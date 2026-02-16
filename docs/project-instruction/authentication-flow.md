# Authentication Flow Documentation

## Architecture Overview

The Donna website uses a **separated frontend/backend architecture**:

- **Frontend** (`src/`): React app that makes HTTP requests to the backend
- **Backend** (`server/`): Express.js server with MVC architecture

```
donna-website/
├── src/                    # Frontend (React + Vite)
│   ├── api/
│   │   └── client.js       # API client for HTTP requests
│   ├── lib/
│   │   └── auth-helpers.js  # Auth utilities (state, recovery, errors)
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state management (uses auth-helpers)
│   ├── pages/
│   │   └── Signup.jsx       # Multi-step signup flow
│   └── ...
│
└── server/                 # Backend (Express.js)
    ├── src/
    │   ├── config/         # Database & Google OAuth config
    │   ├── controllers/    # Request handlers
    │   ├── middleware/      # Auth middleware
    │   ├── models/         # Database models
    │   ├── routes/         # API routes
    │   ├── services/       # Business logic
    │   └── index.js        # Server entry point
    └── package.json
```

---

## Backend Server (MVC Architecture)

### Directory Structure

```
server/src/
├── config/
│   ├── database.js         # Supabase client
│   └── google.js           # Google OAuth config
├── controllers/
│   ├── auth.controller.js  # Auth request handlers
│   └── user.controller.js  # User request handlers
├── middleware/
│   └── auth.middleware.js   # JWT verification
├── models/
│   ├── User.model.js       # User database operations
│   └── GoogleToken.model.js # Token database operations
├── routes/
│   ├── auth.routes.js      # /api/auth routes
│   └── user.routes.js      # /api/users routes
├── services/
│   ├── auth.service.js     # Auth business logic
│   └── user.service.js     # User business logic
├── database/
│   └── schema.sql          # Database schema
└── index.js                # Express server entry
```

### API Endpoints

#### Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/google` | Get Google OAuth URL |
| GET | `/google/callback` | Handle OAuth callback |
| GET | `/me` | Get current user |
| GET | `/verify` | Verify JWT token |
| POST | `/refresh` | Refresh Google token |
| POST | `/logout` | Sign out |

#### User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get user profile |
| PUT | `/me/phone` | Update phone number |
| POST | `/me/complete-onboarding` | Complete onboarding |
| GET | `/whatsapp-info` | Get WhatsApp URL |

---

## Authentication Flow

**Key principle:** Users are NOT created in the database when they enter their phone number.
Registration (DB insert) only happens when Google OAuth completes successfully.
This ensures we never have orphaned users or partial registrations.

### Step 1: Phone Number (validate only — no DB write)

```
Frontend                    Backend
   │                           │
   ├─── POST /api/users/check-phone ──►│
   │    { phoneNumber }         │
   │                           │─ Validate format
   │                           │─ Check if phone exists in DB
   │                           │
   │◄── { isNewUser, registered,│
   │      formattedNumber,      │
   │      jwtToken? }  ─────────┤
```

Three outcomes:
- **New user** (`isNewUser: true`): Phone stored in frontend only. Proceed to Google.
- **Partial user** (`registered: false`): Phone exists but no Google. Proceed to Google.
- **Returning user** (`registered: true`): Fully registered. JWT issued, skip to WhatsApp/completed.

### Step 2: Google Sign-in (Stateless — creates user on completion)

The `state` parameter sent to Google is a **signed JWT** containing `phoneNumber` and `planType`
(not userId, since the user doesn't exist in the DB yet). On callback, the backend decodes the
phone from the state, exchanges the Google code for tokens, and creates the user with all
information at once.

```
Frontend                    Backend                     Google
   │                           │                           │
   ├─── GET /api/auth/google ──►│                           │
   │    ?phoneNumber=...        │                           │
   │                           │─ createOAuthState(phone)   │
   │                           │  (signed JWT as state)     │
   │◄── { authUrl } ───────────┤                           │
   │                           │                           │
   ├─── Redirect to authUrl ───────────────────────────────►│
   │                           │                           │
   │                           │◄── Callback: ?state=...&code=...
   │                           │                           │
   │                           │─ verifyOAuthState(state)   │
   │                           │  → { phoneNumber, planType}│
   │                           │                           │
   │                           ├─── Exchange code ─────────►│
   │                           │◄── Tokens + profile ───────┤
   │                           │                           │
   │                           │─ findOrCreate user by phone│
   │                           │─ Link Google email + tokens│
   │                           │─ Generate JWT              │
   │                           │                           │
   │◄── Redirect with JWT ─────┤                           │
```

### Step 3: Complete Onboarding

```
Frontend                    Backend
   │                           │
   ├─── POST /api/users/me/complete-onboarding ──►│
   │                           │
   │◄── { user, whatsapp } ────┤
   │                           │
   ├─── Open WhatsApp URL      │
```

---

## Frontend Implementation

### Auth Helpers (`src/lib/auth-helpers.js`)

Dedicated utility file containing all persistence, recovery, and validation logic:

- **Signup state** persistence (`localStorage`): `loadSignupState`, `saveSignupState`, `clearSignupState`
- **OAuth redirect marker** (`sessionStorage`): `setOAuthRedirectPending`, `isOAuthRedirectPending`, `clearOAuthRedirectPending`
- **State validation**: `isSignupStateStale`, `determineStepFromUser`
- **Error messages** (Hebrew): `getErrorMessage`, `isUserNotFoundError`, `getGoogleSignInErrorMessage`
- **Constants**: `SIGNUP_STEPS`, `getInitialSignupState`

### Auth Context (`src/context/AuthContext.jsx`)

Manages React state and user-facing actions. Uses `auth-helpers.js` for all persistence logic.

```javascript
import { useAuth, SIGNUP_STEPS } from '../context/AuthContext'

function MyComponent() {
  const {
    // State
    isLoading,              // true during short API calls
    isRedirectingToOAuth,   // true after clicking Google (separate from isLoading)
    isAuthenticated,
    user,
    error,
    currentStep,

    // Auth actions
    signInWithGoogle,
    signOut,

    // Signup flow actions
    submitPhoneNumber,
    completeOnboarding,
    goBackToPhoneStep,      // Return to phone step (clears auth)
    cancelOAuthRedirect,    // Manual escape from redirect spinner
    resetSignupFlow,        // Full reset

    getWhatsAppUrl
  } = useAuth()
}
```

### API Client (`src/api/client.js`)

```javascript
import api from '../api/client'

// Validate phone (no user created)
const { isNewUser, registered, formattedNumber } = await api.users.checkPhone('+972501234567')

// Get Google OAuth URL (uses phone number, not userId — user not in DB yet)
const { authUrl } = await api.auth.getGoogleAuthUrl('+972501234567', 'standard')

// Get current user
const { user } = await api.auth.getCurrentUser()

// Complete onboarding
const { user, whatsapp } = await api.users.completeOnboarding()
```

---

## State Management & Recovery

### Two State Stores

The signup flow uses two separate stores that must stay in sync:

| Store | Where | What |
|-------|-------|------|
| **signupState** | `localStorage` | `step`, `whatsappNumber`, `formattedNumber`, `userId` (set after Google), `hasGoogleConnection` |
| **Auth/JWT** | `localStorage` | JWT token for API calls |
| **OAuth redirect marker** | `sessionStorage` | Flag set before navigating to Google |

### State Sync Rules (in `initAuth`)

1. If JWT is valid AND user profile loads → sync signupState step from user data
2. If JWT is valid BUT user profile fails (user deleted) → reset BOTH auth AND signupState
3. If JWT is invalid/missing AND signupState is past phone step → reset signupState to phone
4. Exception: if OAuth redirect is pending (sessionStorage flag), don't reset — user is mid-flow

### OAuth Redirect Recovery

When the user clicks "Connect with Google" and navigates to the Google consent screen:

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| User presses browser back (bfcache) | `pageshow` event with `persisted=true` | Reset `isRedirectingToOAuth` |
| User switches back to tab | `visibilitychange` to `visible` | Reset `isRedirectingToOAuth` |
| User refreshes after abandoning OAuth | `sessionStorage` flag + no callback params | Clear flag, show normal step |
| User clicks Cancel button | Manual action | `cancelOAuthRedirect()` |
| Phone number missing | No `formattedNumber` in state | Show error + back to phone |
| Google returns error (deny) | `?error=` in URL | Show error + retry button |
| Session expired between steps | Backend returns `session_expired` | Show error + back to phone |

---



### Production (www.donnai.io)

**Required so Google redirects to your domain instead of localhost.** Set these on the **production server** (and in Google Cloud Console):

```env
FRONTEND_URL=https://www.donnai.io
GOOGLE_REDIRECT_URI=https://www.donnai.io/api/auth/google/callback
NODE_ENV=production
```

**Google Cloud Console (OAuth client):**

1. Open [APIs & Services -> Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your OAuth 2.0 Client ID.
3. Under **Authorized redirect URIs**, add:
   - `https://www.donnai.io/api/auth/google/callback` (or your actual backend callback URL).
4. Save.

---

## Running the Application

### 1. Start Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### 2. Start Frontend

```bash
# In project root
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Database Setup

### Run Schema in Supabase

1. Go to Supabase Dashboard -> SQL Editor
2. Copy contents of `server/src/database/schema.sql`
3. Run the SQL

### Tables Created

- `users` - User profiles
- `user_google_tokens` - OAuth tokens

---

## Google OAuth Setup

1. **Google Cloud Console**
   - Create project
   - Enable Google Calendar API
   - Create OAuth credentials
   - **Authorized redirect URIs** (add both for dev and production):
     - `http://localhost:3001/api/auth/google/callback` (development)
     - `https://www.donnai.io/api/auth/google/callback` (production; or your API host if different)

2. **Add to `.env`**
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

---

## Security Features

- **JWT Authentication**: Stateless token-based auth
- **CSRF Protection**: Stateless signed state token in OAuth flow (no session dependency)
- **CORS**: Configured for frontend origin + donnai.io
- **Helmet**: Security headers
- **Session**: Secure cookies with `sameSite: 'lax'` (session used for logout only; OAuth state is stateless)
- **State sync**: signupState always resets when auth is invalid (prevents stale step)

---

## Error Handling

### Frontend Errors

Errors are displayed in Hebrew (defined in `src/lib/auth-helpers.js`):
- `ההתחברות נכשלה` - Auth failed
- `מספר טלפון לא תקין` - Invalid phone
- `שגיאת אבטחה` - Security error (invalid_state)
- `המשתמש לא נמצא` - User not found (user deleted); auto-redirects to phone step
- `ההתחברות פגה` - Session expired; user must re-enter phone

### Backend Errors

HTTP status codes:
- `400` - Bad request (validation)
- `401` - Unauthorized (auth required)
- `404` - Not found
- `500` - Server error

---

## Settings Page & Account Management

### Route
- `/settings` -- protected by `ProtectedRoute` component, requires `isAuthenticated === true`
- Uses `UserDashboardLayout` wrapper (shared by future dashboard pages)

### Disconnect (Frontend-Only)
- Clears JWT from localStorage, resets AuthContext state
- Does NOT call any backend endpoint -- DB untouched
- User returns to default visitor state; WhatsApp agent keeps working
- Method: `disconnect()` in AuthContext

### Reconnect Google (Switch Account)
- Calls `GET /api/auth/google` with `redirectTo=/settings` query param
- `redirectTo` is encoded into the signed OAuth state JWT
- On callback, backend redirects to `/settings?token=...` instead of `/signup`
- `initAuth` detects token on `/settings` path and skips signup state updates

### Account Deletion (Cancel Subscription)
- `DELETE /api/users/me` -- deletes user row from DB
- `ON DELETE CASCADE` on `user_google_tokens` cleans up tokens automatically
- Frontend clears auth state and redirects to home
- Method: `deleteAccount()` in AuthContext

### Enhanced Profile Endpoint
- `GET /api/users/me` now returns `name` and `googleScopes` fields
- `googleScopes` is the `scope TEXT[]` from `user_google_tokens` table
- Used by Settings page to show Gmail/Calendar connection status
