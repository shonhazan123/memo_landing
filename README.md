# Mimo Website

A modern, mobile-first website for Mimo - your personal secretary service. Built with React, Tailwind CSS, and Supabase.

## 🚀 Features

- **Home Page**: Hero section, stats, testimonials, and feature preview
- **Superpowers Page**: Detailed feature showcase with 6 main capabilities
- **Pricing Page**: Transparent pricing with monthly/annual toggle, FAQ, and feature comparison
- **Login Page**: Google authentication (prepared for Supabase integration)
- **Responsive Design**: Mobile-first approach with RTL support for Hebrew
- **Design System**: Complete UI/UX documentation following the design system

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Supabase** - Backend and authentication (configured, ready for implementation)
- **React Bits Components** - UI components (LogoLoop, CardNav, CardSwap)
- **GSAP** - Animation library (required for CardSwap)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. **✅ All components are already included!** 

The following React Bits components are committed to the repository:
- `LogoLoop` - Logo marquee component
- `CardNav` - Card navigation component  
- `CardSwap` - Card swap animation component (requires `gsap`)
- `Galaxy` - Galaxy starfield background component

No additional installation needed - just run `npm install` and everything will work!

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
mimo-website/
├── docs/
│   └── project-instruction/
│       ├── design-system.md      # Complete design system documentation
│       └── project-plan.md       # Project plan and checkpoints
├── public/
│   └── logo.png                  # Add your logo here (will auto-appear)
├── src/
│   ├── components/
│   │   ├── Button/               # Button components
│   │   ├── Card/                 # Card components (Feature, Testimonial, Pricing)
│   │   ├── CardNav/              # Card navigation component (@react-bits)
│   │   ├── CardSwap/             # Card swap animation component (@react-bits)
│   │   ├── Logo/                 # Logo component with placeholder
│   │   ├── LogoLoop/             # Logo marquee component (@react-bits)
│   │   └── Menu/                 # Navigation menu
│   ├── config/
│   │   └── supabase.js          # Supabase configuration
│   ├── pages/
│   │   ├── Home.jsx             # Home page
│   │   ├── Superpowers.jsx      # Features/superpowers page
│   │   ├── Pricing.jsx           # Pricing page
│   │   └── Login.jsx             # Login page (prepared)
│   ├── styles/
│   │   ├── fonts.css            # Figtree font loading
│   │   └── index.css            # Global styles and Tailwind
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
└── package.json
```

## 🎨 Design System

The complete design system is documented in `docs/project-instruction/design-system.md`. Key highlights:

- **Colors**: Gradient accents (indigo → pink), neutral grays, dark pricing section
- **Typography**: Figtree font with responsive scaling
- **Components**: Buttons, cards, navigation with consistent styling
- **Layout**: Mobile-first responsive design with RTL support
- **Animations**: Smooth transitions and scroll animations

## 🔐 Authentication

Supabase is configured and ready for Google OAuth implementation. The structure is in place in:
- `src/config/supabase.js` - Supabase client and auth helpers
- `src/pages/Login.jsx` - Login page with Google sign-in button

To implement:
1. Set up Google OAuth in Supabase dashboard
2. Uncomment and configure the auth functions in `src/config/supabase.js`
3. Update `src/pages/Login.jsx` to use the actual auth functions

## 🖼️ Logo

Add your logo to `public/logo.png`. The Logo component will automatically display it when available, falling back to text "דונה" if not found.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (default)
- **Tablet**: sm: 640px
- **Desktop**: md: 768px
- **Large**: lg: 1024px
- **XL**: xl: 1280px

## 🌐 RTL Support

The website is fully RTL-enabled for Hebrew:
- HTML `dir="rtl"` attribute
- Right-aligned text
- Icons and arrows reversed
- Flexbox and grid layouts adapt automatically

## ✅ Checklist

- [x] Project setup with React + Vite
- [x] Tailwind CSS configuration
- [x] Figtree font integration
- [x] Design system documentation
- [x] Base components (Button, Cards, Logo, Menu)
- [x] Home page
- [x] Superpowers page
- [x] Pricing page
- [x] Login page structure
- [x] Supabase configuration
- [x] RTL support
- [x] Responsive design
- [ ] Google OAuth implementation (prepared, needs Supabase setup)
- [ ] Logo image (placeholder ready)

## 📝 Notes

- All pages follow the design system specifications
- Components are reusable and scalable
- Supabase auth is prepared but not yet implemented (waiting for credentials)
- Logo placeholder will automatically work when logo is added
- All animations and transitions follow the design system

## 🚧 Next Steps

1. Add Supabase credentials to `.env`
2. Implement Google OAuth in Supabase dashboard
3. Complete authentication flow in `src/config/supabase.js` and `src/pages/Login.jsx`
4. Add logo image to `public/logo.png`
5. Test all pages on different devices
6. Deploy to production

## 📄 License

[Your License Here]

