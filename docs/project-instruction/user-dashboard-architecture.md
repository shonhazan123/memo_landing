# User Dashboard Architecture

## Overview

The user dashboard is a protected area of the application where authenticated users manage their account settings, view activity, and control integrations. It is designed to start minimal (settings page only) and expand incrementally to include task management, statistics, and analytics.

## Layout Structure

The dashboard uses a shared layout wrapper (`UserDashboardLayout`) that provides:
- A sticky top bar with back navigation, page title, and user email
- A content area that renders child pages via React Router's `<Outlet />`
- RTL support, mobile-first responsive design, consistent with the main site's design system

When the dashboard grows beyond a single page, the layout will gain a sidebar navigation component that lists all dashboard sections. The top bar and sidebar share the same visual language.

## Route Nesting Pattern

All dashboard pages live under a `ProtectedRoute` guard that verifies authentication:

```
/settings          -- Account settings (current)
/dashboard         -- Overview / home (future)
/dashboard/tasks   -- Task management (future)
/dashboard/stats   -- Usage statistics (future)
```

Routes are nested: `ProtectedRoute > UserDashboardLayout > [Page]`. The main site's CardNav and Footer are hidden on dashboard routes -- the layout handles its own navigation.

## Backend Endpoint Conventions

All user-specific endpoints follow the pattern `/api/users/me/*`:

- `GET /api/users/me` -- User profile (includes Google scopes)
- `DELETE /api/users/me` -- Delete account
- `PUT /api/users/me/phone` -- Update phone
- `POST /api/users/me/complete-onboarding` -- Complete onboarding

Future endpoints should follow the same convention:
- `GET /api/users/me/tasks` -- User's tasks
- `GET /api/users/me/stats` -- Usage statistics
- `PUT /api/users/me/settings` -- Update user settings (the JSONB `settings` column)

## State Management

- Authentication state lives in `AuthContext` (React Context)
- The `user` object from `AuthContext` contains all profile data including `googleScopes`
- Dashboard-specific state (tasks, stats) will use dedicated contexts or hooks as needed
- Data fetching uses the `api` client (`src/api/client.js`) with automatic JWT header injection

## Future Expansion Plan

### Task Management
Display tasks created through the WhatsApp agent. Show task status, due dates, and allow basic management (mark complete, delete). Requires new backend endpoints and possibly a `tasks` table.

### Statistics & Analytics
Show usage metrics: messages sent, tasks created, calendar events managed, reminders set. Could include charts and activity timelines. Requires aggregation endpoints on the backend.

### Settings Enhancements
- Editable profile fields (name, timezone)
- Notification preferences (stored in the `settings` JSONB column)
- Language preference
- Data export

### How to Add a New Dashboard Page
1. Create the page component in `src/pages/`
2. Add the route inside the `UserDashboardLayout` route group in `App.jsx`
3. Add the corresponding backend endpoint(s) under `/api/users/me/*`
4. Add the API client method in `src/api/client.js`
5. When sidebar navigation is added, register the page in the sidebar config
