# Authentication Flow Documentation

## Architecture Overview

The Mimo website uses a **separated frontend/backend architecture**:

- **Frontend** (`src/`): React app that makes HTTP requests to the backend
- **Backend** (`server/`): Express.js server with MVC architecture

```
mimo-website/
├── src/                    # Frontend (React + Vite)
│   ├── api/
│   │   └── client.js       # API client for HTTP requests
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   ├── pages/
│   │   └── Signup.jsx      # Multi-step signup flow
│   └── ...
│
└── server/                 # Backend (Express.js)
    ├── src/
    │   ├── config/         # Database & Google OAuth config
    │   ├── controllers/    # Request handlers
    │   ├── middleware/     # Auth middleware
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
│   └── auth.middleware.js  # JWT verification
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

### Step 1: Google Sign-in

```
Frontend                    Backend                     Google
   │                           │                           │
   ├─── GET /api/auth/google ──►│                           │
   │                           │                           │
   │◄── { authUrl } ───────────┤                           │
   │                           │                           │
   ├─── Redirect to authUrl ───────────────────────────────►│
   │                           │                           │
   │                           │◄── Callback with code ────┤
   │                           │                           │
   │                           ├─── Exchange code ─────────►│
   │                           │                           │
   │                           │◄── Access + Refresh tokens─┤
   │                           │                           │
   │◄── Redirect with JWT ─────┤                           │
```

### Step 2: Phone Number

```
Frontend                    Backend
   │                           │
   ├─── PUT /api/users/me/phone ─►│
   │    { phoneNumber }         │
   │                           │
   │◄── { user } ──────────────┤
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

### API Client (`src/api/client.js`)

```javascript
import api from '../api/client'

// Get Google OAuth URL
const { authUrl } = await api.auth.getGoogleAuthUrl('standard')
window.location.href = authUrl

// Get current user
const { user } = await api.auth.getCurrentUser()

// Update phone
const { user } = await api.users.updatePhone('+972501234567')

// Complete onboarding
const { user, whatsapp } = await api.users.completeOnboarding()
```

### Auth Context (`src/context/AuthContext.jsx`)

```javascript
import { useAuth, SIGNUP_STEPS } from '../context/AuthContext'

function MyComponent() {
  const {
    isLoading,
    isAuthenticated,
    user,
    currentStep,
    signInWithGoogle,
    submitPhoneNumber,
    completeOnboarding
  } = useAuth()
  
  // ...
}
```

---

## Environment Variables

### Frontend (`.env`)

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Supabase (optional, for real-time features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (`.env` in root or `server/.env`)

```env
# Server
SERVER_PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback

# JWT
JWT_SECRET=your-jwt-secret-change-in-production
SESSION_SECRET=your-session-secret-change-in-production

# Mimo WhatsApp
MIMO_WHATSAPP_NUMBER=972501234567
```

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

1. Go to Supabase Dashboard → SQL Editor
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
   - Add redirect URI: `http://localhost:3001/api/auth/google/callback`

2. **Add to `.env`**
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

---

## Security Features

- **JWT Authentication**: Stateless token-based auth
- **CSRF Protection**: State parameter in OAuth flow
- **CORS**: Configured for frontend origin only
- **Helmet**: Security headers
- **Session**: Secure cookies for OAuth state

---

## Error Handling

### Frontend Errors

Errors are displayed in Hebrew:
- `ההתחברות נכשלה` - Auth failed
- `מספר טלפון לא תקין` - Invalid phone
- `שגיאת אבטחה` - Security error

### Backend Errors

HTTP status codes:
- `400` - Bad request (validation)
- `401` - Unauthorized (auth required)
- `404` - Not found
- `500` - Server error
