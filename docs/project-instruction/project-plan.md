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
│   │   ├── CardSwap/             # @react-bits/CardSwap-JS-CSS (kept for potential future use)
│   │   ├── Gallery/              # Horizontal scrolling image gallery component
│   │   ├── LogoLoop/             # @react-bits/LogoLoop-JS-CSS
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Pricing.jsx
│   │   ├── Superpowers.jsx
│   │   ├── Login.jsx             # Redirects to Signup
│   │   └── Signup.jsx            # Multi-step auth flow
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
- [ ] Hero section with page title
- [ ] Feature cards grid (6 features)
- [ ] Each card with icon, title, description, benefits
- [ ] Scroll animations
- [ ] Responsive layout (1 col mobile, 2 col desktop)

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
- ✅ Superpowers page implemented (6 feature cards with scroll animations)
- ✅ Pricing page implemented (Toggle, Cards, FAQ, Feature comparison)
- ✅ Login page structure created (prepared for Supabase auth)
- ✅ Supabase configuration file created
- ✅ RTL support implemented
- ✅ Responsive design implemented
- ✅ Project structure scalable and organized

### In Progress
- 🔄 Testing and QA for authentication flow

### Pending
- ⏳ Configure Supabase project with credentials
- ⏳ Set up Google OAuth in Google Cloud Console
- ⏳ Logo image addition (placeholder component ready)
- ⏳ Production deployment

### Completed in Phase 6
- ✅ Multi-step signup flow (Google Auth → Phone Number → WhatsApp)
- ✅ Backend services architecture (GoogleOAuthService, UserService, SignupFlowService)
- ✅ AuthContext for state management across signup flow
- ✅ Database schema (users, user_google_tokens tables)
- ✅ Phone number validation for Israeli numbers
- ✅ WhatsApp integration with pre-filled messages
- ✅ State persistence in localStorage
- ✅ Automatic redirect for returning users

## Notes & Decisions
- Logo placeholder will be added - component ready to accept logo image
- Login page now redirects to Signup page for unified flow
- Full authentication flow implemented with Google OAuth + Phone Number + WhatsApp
- All design tokens from design system implemented via Tailwind
- Authentication documentation: See `docs/project-instruction/authentication-flow.md`
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

## Next Steps
1. Initialize React project
2. Set up Tailwind CSS
3. Configure Figtree font
4. Build base components
5. Implement pages one by one

