# Mimo Website - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 1.1. Install React Bits Components (Required)

After installing npm dependencies, you need to add the React Bits components using shadcn CLI:

```bash
# Install React Bits components
npx shadcn@latest add @react-bits/LogoLoop-JS-CSS --yes
npx shadcn@latest add @react-bits/CardNav-JS-CSS --yes
npx shadcn@latest add @react-bits/CardSwap-JS-CSS --yes
```

**Note:** These components are required dependencies for the project:
- `@react-bits/LogoLoop-JS-CSS` - Logo marquee component
- `@react-bits/CardNav-JS-CSS` - Card navigation component  
- `@react-bits/CardSwap-JS-CSS` - Card swap animation component

If the shadcn CLI installation fails, the components are already included in the repository and will work after `npm install`.

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
SERVER_PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Supabase Database
VITE_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (REQUIRED for authentication)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback

# JWT & Session Secrets
JWT_SECRET=your-random-jwt-secret-here
SESSION_SECRET=your-random-session-secret-here

# Mimo WhatsApp Number
MIMO_WHATSAPP_NUMBER=972501234567
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Calendar API** (and Gmail API if needed)
4. Go to **APIs & Services** → **Credentials**
5. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
6. Choose **Web application**
7. Add **Authorized redirect URI**:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
8. Copy the **Client ID** and **Client Secret** to your `.env` file

### 4. Setup Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to **SQL Editor**
4. Copy and run the SQL from `server/src/database/schema.sql`
5. Copy your project URL and service role key to `.env`

### 5. Run the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Troubleshooting

### "Missing required parameter: client_id" Error

This means `GOOGLE_CLIENT_ID` is not set in your `.env` file.

**Solution:**
1. Check that `.env` file exists in project root
2. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
3. Restart the server after adding credentials

### "Connection Refused" Error

The backend server is not running.

**Solution:**
```bash
cd server
npm run dev
```

### Database Errors

Supabase credentials are missing or incorrect.

**Solution:**
1. Verify `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
2. Make sure you ran the database schema SQL in Supabase

### Font CORS Error

This is fixed! The app now uses Google Fonts CDN which doesn't have CORS issues.

## Development

### Debug Server

Use VS Code debugger:
1. Press `F5` or go to Run and Debug panel
2. Select "Debug Server"
3. Set breakpoints in server code

### Project Structure

```
mimo-website/
├── src/              # Frontend (React)
├── server/           # Backend (Express.js)
└── .env             # Environment variables (create this)
```

## Need Help?

Check the documentation:
- `docs/project-instruction/authentication-flow.md` - Auth flow details
- `docs/project-instruction/project-plan.md` - Project overview

