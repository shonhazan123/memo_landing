# Settings Page -- Execution Phases

## Phase 1: Backend Changes

### 1a. Enhanced Profile Endpoint
- **File:** `server/src/services/user.service.js`
  - Import `GoogleTokenModel`
  - `getUserById()`: query `GoogleTokenModel.findByUserId()` for scope data
  - `formatUser()`: accept optional `googleTokens` param, return `name` and `googleScopes`
- **File:** `server/src/controllers/user.controller.js` -- no change needed (calls `getUserById`)

### 1b. Delete Account Endpoint
- **File:** `server/src/models/User.model.js` -- add `delete(id)` method: `DELETE FROM users WHERE id = $1 RETURNING id`
- **File:** `server/src/services/user.service.js` -- add `deleteUser(userId)` method
- **File:** `server/src/controllers/user.controller.js` -- add `deleteAccount(req, res, next)` method
- **File:** `server/src/routes/user.routes.js` -- register `router.delete('/me', requireAuth, ...)`

### 1c. OAuth Reconnect Support
- **File:** `server/src/services/auth.service.js`
  - `createOAuthState()`: accept `redirectTo` param, include in JWT payload
  - `verifyOAuthState()`: return `redirectTo` from decoded payload
  - `getGoogleAuthUrl()`: accept `redirectTo` in options
- **File:** `server/src/controllers/auth.controller.js`
  - `initiateGoogleAuth()`: read `redirectTo` from `req.query`
  - `handleGoogleCallback()`: if `redirectTo` in state, redirect to that path with token

## Phase 2: Frontend API & Context

### 2a. API Client
- **File:** `src/api/client.js`
  - `auth.getGoogleAuthUrl()`: add optional `redirectTo` parameter
  - `users.deleteAccount()`: add `DELETE /users/me` method

### 2b. AuthContext
- **File:** `src/context/AuthContext.jsx`
  - Add `disconnect()`: frontend-only clear (no backend call)
  - Add `reconnectGoogle()`: calls `getGoogleAuthUrl` with `redirectTo=/settings`
  - Add `deleteAccount()`: calls API then clears frontend state
  - Update `initAuth`: detect token on `/settings` path, skip signup state updates
  - Update `loadUserProfile()`: accept `isSettingsRedirect` flag
  - Expose new methods in context value

## Phase 3: Frontend Infrastructure

### 3a. ProtectedRoute
- **File:** `src/components/ProtectedRoute.jsx` (new)
  - Check `useAuth().isAuthenticated`, redirect to `/login` if false
  - Show spinner while `isLoading`

### 3b. UserDashboardLayout
- **File:** `src/components/UserDashboardLayout/UserDashboardLayout.jsx` (new)
  - Top bar: back arrow, title, user email
  - Content: `<Outlet />`

### 3c. Route Registration
- **File:** `src/App.jsx`
  - Import ProtectedRoute, UserDashboardLayout, Settings
  - Add `MainLayout` component to hide CardNav/Footer on dashboard routes
  - Nest `/settings` under `ProtectedRoute > UserDashboardLayout`

## Phase 4: Settings Page UI

### 4a. Settings Page
- **File:** `src/pages/Settings.jsx` (new)
  - Section 1: Profile Info (read-only fields)
  - Section 2: Connections (Gmail + Calendar status from `googleScopes`)
  - Section 3: Subscription (plan badge, change plan, delete account with modal)
  - Section 4: Disconnect (frontend-only logout)

### 4b. Settings CSS
- **File:** `src/pages/Settings.css` (new)
  - Mobile-first styles
  - Desktop overrides at `@media (min-width: 768px)`

## Phase 5: Navigation Update

### 5a. CardNav
- **File:** `src/components/CardNav/CardNav.jsx`
  - Import `useAuth` and `User` icon
  - Conditional render: user icon button when authenticated, CTA when not
- **File:** `src/components/CardNav/CardNav.css`
  - Add `.card-nav-user-button` and `.card-nav-user-button-inner` styles
  - Add responsive overrides for mobile breakpoints

## Phase 6: Documentation

- **File:** `docs/project-instruction/authentication-flow.md` -- add Settings & Account Management section
- **File:** `docs/project-instruction/design-system.md` -- add Settings Page Design section
- **File:** `docs/project-instruction/user-dashboard-architecture.md` (new) -- architecture description only
- **File:** `docs/project-instruction/settings-execution-phases.md` (this file) -- implementation phases

---

## Future Work

### 1. ~~Bug Fix~~ FIXED -- Connection status shows "not connected" when user has valid Google + Calendar tokens

**Problem:** The settings page derives Gmail/Calendar connection status from `user.googleScopes`, which comes from the `scope TEXT[]` column in `user_google_tokens`. The `/api/auth/me` (getCurrentUser) endpoint was building the user object manually and **never included `googleScopes`**, so the frontend always saw an empty list and showed "לא מחובר" for both.

**Fix applied:**
- **Backend:** `server/src/controllers/auth.controller.js` — `getCurrentUser` now uses `UserService.getUserById(user.id)` so the response includes `googleScopes` from `user_google_tokens` (same shape as other user endpoints).
- **Frontend:** `src/pages/Settings.jsx` — Connections section uses `Array.isArray(user?.googleScopes) ? user.googleScopes : []` so scope list is always an array.

**Scope strings used in Settings (must match DB):**
- Gmail: `https://www.googleapis.com/auth/gmail.modify`
- Calendar: `https://www.googleapis.com/auth/calendar`

**Files involved:**
- `server/src/controllers/auth.controller.js` — getCurrentUser returns formatted user with googleScopes
- `src/pages/Settings.jsx` — GMAIL_SCOPE, CALENDAR_SCOPE, safe googleScopes read

### 2. Add user name field to the phone number step during sign-up

**Goal:** Collect the user's name alongside their phone number in the first step of the signup flow, so the `name` column in the `users` table is populated from the start (currently it's always null).

**Changes needed:**
- `src/pages/Signup.jsx` -- Add a name input field to `PhoneNumberStep`. Collect name alongside phone in local state.
- `src/context/AuthContext.jsx` -- Pass the name through `submitPhoneNumber()` and store it in `signupState`
- `server/src/services/auth.service.js` -- `handleGoogleCallback()` should accept and store name (could be passed in the OAuth state JWT alongside phoneNumber)
- `server/src/services/auth.service.js` -- `createOAuthState()` / `verifyOAuthState()` -- include `name` in the signed state payload
- `server/src/controllers/auth.controller.js` -- `initiateGoogleAuth()` -- read `name` from query params
- `src/api/client.js` -- `auth.getGoogleAuthUrl()` -- pass `name` parameter
- `server/src/models/User.model.js` -- `findOrCreateByWhatsappNumber()` or `create()` -- accept and store name
- DB: the `name TEXT` column already exists in the `users` table schema

### 3. Improve overall design of the Settings page

**Goal:** Refine the visual polish of the settings page to match the premium feel of the rest of the site (Signup, Pricing, Home pages).

**Areas to address:**
- Add subtle gradient background or decorative elements (matching the indigo-50 → purple-50 → pink-50 gradient used on other pages)
- Add smooth scroll-triggered entrance animations per card section (using Framer Motion or GSAP, consistent with Superpowers page)
- Improve profile section with a user avatar/initial circle (gradient background with first letter of name)
- Add icon badges to connection rows (Google colored icons instead of generic lucide icons)
- Add a visual plan comparison or upgrade CTA in the subscription section
- Improve the delete account modal with a more polished animation and a typed-confirmation input ("type DELETE to confirm")
- Responsive typography refinements (larger headings on desktop, tighter on mobile)
- Test and polish RTL alignment edge cases (phone numbers, emails displayed LTR within RTL layout)
