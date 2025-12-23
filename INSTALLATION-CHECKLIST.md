# Installation Checklist

This document ensures all dependencies and components are properly set up when cloning the repository.

## ✅ Pre-commit Checklist

All items below should be verified before committing:

### 1. NPM Dependencies (package.json)
- [x] `react` & `react-dom` - Core React framework
- [x] `react-router-dom` - Routing
- [x] `@supabase/supabase-js` - Supabase client
- [x] `gsap` - Animation library (required for CardSwap)
- [x] `ogl` - WebGL library (required for Galaxy component)
- [x] `framer-motion` - Animation library
- [x] `class-variance-authority` - shadcn utility
- [x] `clsx` - shadcn utility
- [x] `lucide-react` - Icon library (shadcn)
- [x] `tailwind-merge` - Tailwind utility
- [x] `tailwindcss-animate` - Tailwind animations

### 2. Configuration Files
- [x] `components.json` - shadcn configuration
- [x] `jsconfig.json` - Path aliases configuration
- [x] `vite.config.js` - Vite configuration with path aliases
- [x] `tailwind.config.js` - Tailwind configuration

### 3. Component Files (All Committed)
- [x] `src/components/LogoLoop/` - LogoLoop component
- [x] `src/components/CardNav/` - CardNav component
- [x] `src/components/CardSwap/` - CardSwap component
- [x] `src/components/Galaxy/` - Galaxy component
- [x] `src/lib/utils.js` - shadcn utilities

### 4. Media Files
- [x] `public/videos/hero-video.mp4` - Hero section video (if used)
- [x] Logo images in `src/components/Logo/`

### 5. Documentation
- [x] `README-SETUP.md` - Updated with correct installation steps
- [x] `README.md` - Updated with component information
- [x] `QUICKSTART.md` - Updated installation instructions

## 🚀 Installation Steps (For New Clone)

When cloning on a new computer, follow these steps:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memo_landing
   ```

2. **Install npm dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies** (if using backend)
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Verify components are present**
   ```bash
   ls src/components/LogoLoop/
   ls src/components/CardNav/
   ls src/components/CardSwap/
   ls src/components/Galaxy/
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## ✅ Verification

After installation, verify:
- [ ] No errors in console
- [ ] All components render correctly
- [ ] Animations work (CardSwap, ScrollReveal, etc.)
- [ ] Galaxy component loads (if used)
- [ ] Video plays (if hero video is used)

## 📝 Notes

- **React Bits Components**: Already included in repository, no need to reinstall via shadcn CLI
- **Video Files**: Large video files are in `public/videos/` folder
- **Configuration**: All shadcn/config files are committed and ready to use

