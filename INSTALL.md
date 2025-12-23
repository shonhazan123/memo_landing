# Installation Guide

## 📦 All Packages Installation

All packages are defined in `package.json`. To install everything, simply run:

```bash
npm install
```

This single command will install all dependencies listed below.

## 📋 Complete Package List

### Core Dependencies (from package.json)

**React & Routing:**
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^6.20.0

**Backend:**
- `@supabase/supabase-js` ^2.38.4

**Animation Libraries:**
- `gsap` ^3.14.2 (required for: CardSwap, ScrollReveal, ScrollFloat)
- `framer-motion` ^12.23.26 (required for: BlurText)

**WebGL:**
- `ogl` ^1.0.11 (required for Galaxy component)

**shadcn/ui Utilities:**
- `class-variance-authority` ^0.7.1
- `clsx` ^2.1.1
- `lucide-react` ^0.562.0
- `tailwind-merge` ^3.4.0
- `tailwindcss-animate` ^1.0.7

### Dev Dependencies
- `@types/react` ^18.2.43
- `@types/react-dom` ^18.2.17
- `@vitejs/plugin-react` ^4.2.1
- `autoprefixer` ^10.4.16
- `postcss` ^8.4.32
- `tailwindcss` ^3.3.6
- `vite` ^5.0.8

## 🚀 Quick Installation Steps

### For Frontend Only:
```bash
npm install
```

### For Full Setup (Frontend + Backend):
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## ✅ Components (Already Included)

All components are **already committed** to the repository:

### React Bits Components (External):
- `LogoLoop` - `src/components/LogoLoop/` - Logo marquee component
- `CardNav` - `src/components/CardNav/` - Card navigation component
- `CardSwap` - `src/components/CardSwap/` - Card swap animation (uses GSAP)
- `Galaxy` - `src/components/Galaxy/` - Galaxy starfield background (uses ogl/WebGL)

### Custom Animation Components:
- `ScrollReveal` - `src/components/ScrollReveal/` - Scroll-triggered text reveal (uses GSAP)
- `ScrollFloat` - `src/components/ScrollFloat/` - Floating animation on scroll (uses GSAP)
- `BlurText` - `src/components/BlurText/` - Blur-to-focus text animation (uses framer-motion)
- `StarBorder` - `src/components/StarBorder/` - Animated gradient border effect (pure CSS)

**No additional installation needed!** Just run `npm install` and they'll work.

## 📦 Original Component Installation Commands

These are the **original npx commands** we used to install the React Bits components. They're documented here for reference, but **you don't need to run them** since all components are already included in the repository.

### React Bits Components (via shadcn CLI):

```bash
# LogoLoop - Logo marquee component
npx shadcn@latest add @react-bits/LogoLoop-JS-CSS --yes

# CardNav - Card navigation component
npx shadcn@latest add @react-bits/CardNav-JS-CSS --yes

# CardSwap - Card swap animation component
npx shadcn@latest add @react-bits/CardSwap-JS-CSS --yes
```

### Galaxy Component:

The Galaxy component was manually installed from the React Bits registry:
- Component files: `src/components/Galaxy/Galaxy.jsx` and `src/components/Galaxy/Galaxy.css`
- Registry URL: `https://reactbits.dev/r/Galaxy-JS-CSS.json`
- Requires: `ogl` package (already in package.json)

### Custom Animation Components:

These are custom-built components (not from external sources):

**ScrollReveal** - Scroll-triggered text reveal with blur effect
- Location: `src/components/ScrollReveal/`
- Uses: `gsap` and `gsap/ScrollTrigger`
- Features: Word-by-word reveal, rotation, blur effects

**ScrollFloat** - Floating animation on scroll
- Location: `src/components/ScrollFloat/`
- Uses: `gsap` and `gsap/ScrollTrigger`
- Features: Smooth floating motion based on scroll position

**BlurText** - Blur-to-focus text animation
- Location: `src/components/BlurText/`
- Uses: `framer-motion`
- Features: Animated blur effects, word-by-word or character-by-character

**StarBorder** - Animated gradient border
- Location: `src/components/StarBorder/`
- Uses: Pure CSS animations
- Features: Animated gradient border effect for buttons/CTAs

### When to Use These Commands:

- **If components are missing** after cloning (shouldn't happen, but just in case)
- **To update components** to latest versions from React Bits
- **To reinstall** if components get corrupted

**Note:** These commands require `components.json` and `jsconfig.json` to be present (both are committed to the repo).

## 📝 Installation Locations

Installation commands are documented in:
1. **`INSTALL.md`** (this file) - Complete package list and installation guide
2. **`README-SETUP.md`** - Detailed setup guide with environment variables
3. **`QUICKSTART.md`** - Quick start guide
4. **`README.md`** - Main README with installation section
5. **`INSTALLATION-CHECKLIST.md`** - Pre-commit verification checklist

## 🔍 Verify Installation

After running `npm install`, verify everything is installed:

```bash
# Check node_modules exists
ls node_modules

# Check specific packages
ls node_modules/gsap
ls node_modules/ogl
ls node_modules/react

# Verify React Bits components are present
ls src/components/LogoLoop/
ls src/components/CardNav/
ls src/components/CardSwap/
ls src/components/Galaxy/

# Verify custom animation components are present
ls src/components/ScrollReveal/
ls src/components/ScrollFloat/
ls src/components/BlurText/
ls src/components/StarBorder/

# Verify animation libraries
ls node_modules/framer-motion
ls node_modules/gsap
```

## 🎯 Start Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

