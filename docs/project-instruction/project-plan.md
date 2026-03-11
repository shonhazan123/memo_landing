# Mimo Website - Project Plan & Checkpoints

## Project Overview
Building a complete React-based website for Mimo, a personal secretary service, with Home, Pricing, and Superpowers pages. Includes Supabase integration for Google authentication (prepared for future implementation).

## Technology Stack
- **Framework**: React (Create React App or Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Backend**: Supabase (for authentication)
- **Font**: Figtree (from provided URL)
- **Animation**: GSAP (GreenSock Animation Platform) for CardSwap component
- **UI Components**: React Bits components via shadcn CLI
  - `@react-bits/LogoLoop-JS-CSS` - Logo marquee component
  - `@react-bits/CardNav-JS-CSS` - Card navigation component
  - `@react-bits/CardSwap-JS-CSS` - Card swap animation component (requires GSAP)

## Project Structure
```
mimo-website/
├── public/
│   └── (logo placeholder)
├── src/                          # Frontend (React + Vite)
│   ├── api/
│   │   └── client.js             # HTTP client for backend API
│   ├── components/
│   │   ├── Menu/
│   │   ├── Logo/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── CardNav/              # @react-bits/CardNav-JS-CSS
│   │   ├── Footer/               # Site footer with Privacy link
│   │   ├── CardSwap/             # @react-bits/CardSwap-JS-CSS (kept for potential future use)
│   │   ├── Gallery/              # Horizontal scrolling image gallery component
│   │   ├── LogoLoop/             # @react-bits/LogoLoop-JS-CSS
│   │   ├── AbilityCard/          # Clickable ability card for grid view
│   │   ├── ConversationGallery/   # Horizontal carousel for conversation examples
│   │   └── ...
│   ├── data/
│   │   ├── abilities.js           # Central abilities configuration
│   │   └── conversations/         # Conversation data files per ability
│   │       ├── calendar-management.js
│   │       ├── tasks-reminders.js
│   │       ├── emails.js
│   │       └── google-workspace.js
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Pricing.jsx
│   │   ├── Superpowers.jsx        # Grid view of all abilities
│   │   ├── AbilityDetail.jsx      # Dynamic ability detail page
│   │   ├── Login.jsx             # Redirects to Signup
│   │   ├── Signup.jsx            # Multi-step auth flow
│   │   └── Privacy.jsx            # Privacy policy page (/privacy)
│   ├── config/
│   │   └── supabase.js
│   ├── styles/
│   │   ├── index.css
│   │   └── fonts.css
│   └── App.jsx
├── server/                       # Backend (Express.js MVC)
│   ├── src/
│   │   ├── config/               # Database & OAuth config
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Auth middleware
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── database/
│   │   │   └── schema.sql        # Database schema
│   │   └── index.js              # Server entry point
│   └── package.json
├── docs/
│   └── project-instruction/
│       ├── add-or-edit-capability.md   # Runbook: add/edit capability (all references)
│       ├── design-system.md
│       ├── project-plan.md
│       └── authentication-flow.md
└── package.json
```

## Implementation Checklist

### Phase 1: Project Setup ✅
- [x] Save design system documentation
- [x] Create project plan file
- [x] Initialize React project
- [x] Install dependencies (React Router, Tailwind, Supabase, GSAP)
- [x] Configure Tailwind CSS
- [x] Set up Figtree font
- [x] Create base folder structure
- [x] Install React Bits components (LogoLoop, CardNav, CardSwap)
- [x] Create Gallery component (replaces CardSwap on Home page)
- [x] Configure shadcn CLI and components.json

### Phase 2: Core Components ✅
- [ ] Logo component (with placeholder)
- [ ] Button components (Primary, Secondary, Small)
- [ ] Card components (Feature, Testimonial, Pricing)
- [ ] Menu/Navigation component
- [ ] Base layout wrapper

### Phase 3: Home Page ✅
- [ ] Hero section with gradient background (Chapter 1 & 2 – video, headline, CTAs)
- [x] **Chapter 3 – Conversation Flow**: section "אתה מבקש. דונה מבצעת." with conversation flow UI showing real WhatsApp-style messages between user and Donna (ConversationFlow component); placed after Hero, before Gallery
- [ ] Gallery section (horizontal scrolling image gallery with navigation arrows)
- [ ] Stats section (4 stats, responsive grid)
- [ ] Testimonials section (3 cards, staggered layout)
- [ ] Final CTA section

### Phase 4: Superpowers Page ✅
- [x] Hero section with page title
- [x] Ability cards grid (4 abilities)
- [x] Each card with image, title, clickable navigation
- [x] Scroll animations
- [x] Responsive layout (1 col mobile, 2 col desktop)
- [x] Dynamic ability detail pages with conversation galleries

#### Phase 4.1: Dynamic Ability Pages System ✅
- [x] Centralized abilities data structure (`src/data/abilities.js`)
- [x] Conversation data files for each ability (`src/data/conversations/`)
- [x] AbilityCard component for grid display
- [x] ConversationGallery component (horizontal carousel with navigation)
- [x] AbilityDetail page component with dynamic routing
- [x] Dynamic routes: `/superpowers/:slug`
- [x] Scalable architecture for adding new abilities

**Ability Pages Architecture:**
- **Grid View** (`/superpowers`): Displays all abilities as clickable cards in a 2-column grid
- **Detail Pages** (`/superpowers/:slug`): Individual ability pages with:
  - Header section with ability title
  - Description section
  - Conversation gallery showing use case examples
- **Data Structure**: Centralized in `src/data/abilities.js` with conversation data in separate files
- **Components**: 
  - `AbilityCard`: Clickable card component for grid view
  - `ConversationGallery`: Horizontal carousel showing WhatsApp-style conversation examples
  - `AbilityDetail`: Dynamic page component that loads ability-specific data

**Current Abilities:**
1. ניהול יומן (Calendar Management) - `/superpowers/calendar-management`
2. משימות ותזכורות (Tasks and Reminders) - `/superpowers/tasks-reminders`
3. אימיילים (Emails) - `/superpowers/emails`
4. Google Work Space - `/superpowers/google-workspace`

**Conversation content (per ability):**
- **Tasks & Reminders:** Four types only — (1) Tasks/todos (unscheduled), (2) normal time-based reminders, (3) recurring reminders, (4) nudges (נודניק). No location-based reminders.
- **Calendar:** Creating events, complex requests (e.g. free tomorrow + set meeting with X at 8am), updating work hours, and questions (e.g. doctor appointments in upcoming month).
- **Google Workspace:** Search/locate files, answer questions about document content, return links to documents (e.g. wedding Excel, renovation contract).
- **Emails:** Quick summary of today's emails, adding email-related items as todos, replying with draft text and asking for confirmation before sending.

**Adding or editing a capability:** See the runbook `docs/project-instruction/add-or-edit-capability.md` for the full checklist (picture, conversation examples, gallery, pricing, comparison table, optional coming-soon badge). The Cursor rule in `.cursor/rules/add-or-edit-capability.mdc` instructs the agent to follow that runbook when working on capability-related files.

### Phase 5: Pricing Page ✅
- [ ] Hero section with title/subtitle
- [ ] Billing toggle (Monthly/Annual)
- [ ] Pricing cards (3 plans)
- [ ] Most popular card with gradient border
- [ ] Feature comparison section
- [ ] Coming soon section
- [ ] FAQ accordion section
- [ ] Final CTA

### Phase 6: Supabase & Authentication Setup ✅
- [x] Create Supabase configuration file
- [x] Set up environment variables structure
- [x] Create authentication context/provider
- [x] Prepare Google OAuth integration structure
- [x] Add authentication utilities
- [x] Create backend services folder
- [x] Implement multi-step signup flow
- [x] Create database schema SQL

### Phase 7: Styling & Polish ✅
- [ ] RTL support implementation
- [ ] Responsive design for all breakpoints
- [ ] Hover states and transitions
- [ ] Loading states
- [ ] Error states (where applicable)
- [ ] Accessibility improvements

### Phase 8: Testing & Refinement ✅
- [ ] Test all pages on mobile
- [ ] Test all pages on tablet
- [ ] Test all pages on desktop
- [ ] Verify RTL support
- [ ] Check accessibility
- [ ] Performance optimization

## Current Status
**Last Updated**: Initial implementation complete

### Completed
- ✅ Design system documentation saved
- ✅ Project plan created
- ✅ React project initialized with Vite
- ✅ All dependencies installed and configured
- ✅ Tailwind CSS configured with design tokens
- ✅ Figtree font integrated from URL
- ✅ Base components created (Button, Cards, Logo, Menu)
- ✅ Home page implemented (Hero, Chapter 3 Real Life Examples, Gallery, Stats, Testimonials, CTA)
- ✅ Gallery component created (replaces CardSwap on Home page)
- ✅ Superpowers page implemented (ability cards grid with scroll animations)
- ✅ Dynamic ability pages system implemented (AbilityCard, ConversationGallery, AbilityDetail)
- ✅ Abilities data structure created (centralized configuration with conversation data files)
- ✅ Pricing page implemented (Toggle, Cards, FAQ, Feature comparison)
- ✅ Login page structure created (prepared for Supabase auth)
- ✅ Supabase configuration file created
- ✅ RTL support implemented
- ✅ Responsive design implemented
- ✅ Project structure scalable and organized
- ✅ Footer component (site-wide, with links to Home, Superpowers, Pricing, Privacy, Terms, Cancellation & Refund Policy)
- ✅ Privacy policy page (/privacy) with full policy text
- ✅ Terms of Service page (/terms)
- ✅ Cancellation & Refund Policy page (/refund-policy); linked from footer and Pricing checkout disclaimer

### In Progress
- 🔄 Testing and QA for authentication flow

### Pending
- ⏳ Configure Supabase project with credentials
- ⏳ Set up Google OAuth in Google Cloud Console
- ⏳ Logo image addition (placeholder component ready)
- ⏳ Production deployment (Vercel setup ready; see Deployment section)

### Completed in Phase 6
- ✅ Multi-step signup flow (Google Auth → Phone Number → WhatsApp)
- ✅ Backend services architecture (GoogleOAuthService, UserService, SignupFlowService)
- ✅ AuthContext for state management across signup flow
- ✅ Database schema (users, user_google_tokens tables)
- ✅ Phone number validation for Israeli numbers
- ✅ WhatsApp integration with pre-filled messages
- ✅ State persistence in localStorage
- ✅ Automatic redirect for returning users

## Deployment (Vercel)

### One command for frontend + backend
- **Development (both frontend and backend):** `npm run dev:all` — runs Vite dev server and Express server together.
- **Production-like local (build + run both):** `npm run build` then `npm run start` — builds frontend, then runs Vite preview and Express together.

### Deploying to Vercel
- **Build command:** `npm run build` (builds frontend only; backend runs as serverless via `api/`).
- **Output directory:** `dist`
- **Install:** Root and server dependencies are installed via `installCommand` in `vercel.json`.
- **Backend on Vercel:** The Express app is exposed as a serverless function via `api/backend.js`. Rewrites in `vercel.json` send all `/api/*` requests to `/api/backend`; the handler restores the original path so Express routing works. The server skips `app.listen()` when `VERCEL` is set.
- **Environment variables:** Set in Vercel dashboard (e.g. `SESSION_SECRET`, `FRONTEND_URL`, DB and OAuth vars). The frontend uses `/api` as the API base in production when `VITE_API_URL` is not set.

### Project layout for deploy
- `vercel.json` — build command, output directory, install command.
- `api/backend.js` — Vercel serverless handler; `vercel.json` rewrites `/api/(.*)` to `/api/backend?path=$1`, and the handler restores `req.url` so the Express app in `server/src/index.js` receives the correct path.

## Notes & Decisions
- Logo placeholder will be added - component ready to accept logo image
- Login page now redirects to Signup page for unified flow
- Full authentication flow implemented with Google OAuth + Phone Number + WhatsApp
- All design tokens from design system implemented via Tailwind
- Authentication documentation: See `docs/project-instruction/authentication-flow.md`
- Payment (PayPlus) documentation: See `docs/project-instruction/payment-flow.md`
- Database schema: See `src/backend/database/schema.sql`

## Required Dependencies

### npm Dependencies
All dependencies are listed in `package.json`. Key dependencies include:
- `react`, `react-dom`, `react-router-dom` - Core React framework
- `@supabase/supabase-js` - Supabase client
- `gsap` - Animation library (required for CardSwap component)
- `tailwindcss`, `autoprefixer`, `postcss` - Styling
- `class-variance-authority`, `clsx`, `tailwind-merge` - Utility libraries (shadcn dependencies)
- `lucide-react` - Icon library (shadcn dependency)

### React Bits Components (via shadcn CLI)
After cloning the repository, install these components:
```bash
npx shadcn@latest add @react-bits/LogoLoop-JS-CSS --yes
npx shadcn@latest add @react-bits/CardNav-JS-CSS --yes
npx shadcn@latest add @react-bits/CardSwap-JS-CSS --yes
```

**Note:** Gallery component has been created to replace CardSwap on the Home page. CardSwap component is kept in the codebase for potential future use.

**Note:** These components are already included in the repository. The shadcn CLI command is for updating or reinstalling them.

## Environment Variables Needed
Create `.env` file with:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For PayPlus payment page (pricing purchase flow), set in server `.env` (see `docs/project-instruction/payment-flow.md`):
```
PAYPLUS_API_KEY=your_payplus_api_key
PAYPLUS_SECRET_KEY=your_payplus_secret_key
PAYPLUS_PAGE_UID=your_payment_page_uid
FRONTEND_URL=https://your-site.com
```
Optional: `PAYPLUS_BASE_URL` for sandbox (e.g. `https://restapidev.payplus.co.il/api/v1.0`).

## Next Steps
1. Initialize React project
2. Set up Tailwind CSS
3. Configure Figtree font
4. Build base components
5. Implement pages one by one

