# Mimo Website - Complete UI/UX Design System Documentation

## 🎨 Design Philosophy
The Mimo website is designed with a mobile-first, calm, and human-centered approach. The design emphasizes:

- **Clarity over cleverness** - Every element serves a clear purpose
- **Ease and control** - Users should feel empowered, not overwhelmed
- **Minimal cognitive load** - One primary action per screen
- **Natural flow** - Smooth transitions that guide attention
- **Israeli-friendly** - RTL support with Hebrew typography

## 🌈 Color Palette

### Primary Colors

#### Gradient Accent (Brand Identity)
- **from-indigo-600** (#4F46E5) → **to-pink-600** (#DB2777)
- Used for: Headlines, CTAs, emphasis elements
- Creates energy and modernity while maintaining professionalism

#### Gradient Background (Hero Section)
- **from-indigo-50** (#EEF2FF) → **via-purple-50** (#FAF5FF) → **to-pink-50** (#FDF2F8)
- Creates a soft, welcoming atmosphere
- Subtle enough to not distract from content

### Neutral Colors

#### Text Hierarchy
- **Primary text**: text-gray-900 (#111827) - Main headlines and important content
- **Secondary text**: text-gray-700 (#374151) - Body text and descriptions
- **Tertiary text**: text-gray-600 (#4B5563) - Supporting information
- **Muted text**: text-gray-400 (#9CA3AF) - Placeholders and disabled states

#### Backgrounds
- **Pure white**: bg-white (#FFFFFF) - Cards, sections
- **Light gray**: bg-gray-50 (#F9FAFB) - Alternating sections
- **Dark mode**: bg-zinc-900 (#18181B) - Pricing section for contrast
- **Ultra dark**: bg-zinc-950 (#09090B) - Pricing cards

### Accent Colors

#### Success/Positive
- **bg-lime-400** (#A3E635) - Badges, positive indicators
- **bg-green-500** (#22C55E) - Savings badges

#### Warning/Attention
- **bg-amber-400** (#FBBF24) - Star ratings

#### Interactive States
- **Hover**: hover:shadow-lg - Elevation on interaction
- **Active**: hover:shadow-xl - Enhanced elevation
- **Disabled**: disabled:opacity-50 - Clear unavailable state

## 📝 Typography

### Font Family
**Primary Font: Figtree**
- Source: https://memorae.ai/l3-assets/_next/static/media/f7aa21714c1c53f8.p.e3544bb0.woff2
- Weights used:
  - 400 (Regular) - Body text
  - 500 (Medium) - Subheadings, buttons
  - 600 (Semi-bold) - Section titles
  - 700 (Bold) - Main headlines

**Why Figtree?**
- Modern, clean, and highly readable
- Excellent Hebrew support for RTL
- Professional yet friendly appearance
- Works well at all sizes

### Type Scale

#### Headlines
- **h1**: text-5xl md:text-7xl (48px → 72px) font-bold
- **h2**: text-4xl md:text-6xl (36px → 60px) font-bold
- **h3**: text-3xl md:text-4xl (30px → 36px) font-bold
- **h4**: text-2xl (24px) font-semibold

#### Body Text
- **Large**: text-xl md:text-2xl (20px → 24px)
- **Regular**: text-base (16px)
- **Small**: text-sm (14px)
- **Extra small**: text-xs (12px)

#### Line Height
- **Headlines**: leading-tight (1.25)
- **Body**: leading-relaxed (1.625)
- **Default**: leading-normal (1.5)

## 🎯 Layout & Spacing

### Container System

#### Max Width
- **max-w-7xl** (1280px) - Main content container
- **max-w-6xl** (1152px) - Pricing cards
- **max-w-4xl** (896px) - Feature grids, centered content
- **max-w-3xl** (768px) - Hero subheadline

#### Padding
- **Mobile**: px-4 (16px horizontal)
- **Tablet**: sm:px-6 (24px horizontal)
- **Desktop**: lg:px-8 (32px horizontal)

### Spacing Scale

#### Section Spacing
- **py-16** (64px vertical) - Standard section padding
- **py-12** (48px vertical) - Compact sections
- **py-8** (32px vertical) - Tight sections

#### Element Spacing
- **mb-12** (48px) - Between major sections
- **mb-8** (32px) - Between subsections
- **mb-6** (24px) - Between related elements
- **mb-4** (16px) - Between small elements
- **mb-2** (8px) - Between tightly coupled items

#### Grid Gaps
- **gap-8** (32px) - Large cards
- **gap-6** (24px) - Medium cards
- **gap-4** (16px) - Small cards, buttons
- **gap-2** (8px) - Inline elements

## 🎭 Components

### Buttons

#### Primary CTA
- bg-gradient-to-r from-indigo-500 to-pink-500
- text-white text-xl font-semibold
- px-12 py-4 rounded-full
- shadow-lg hover:shadow-xl
- transition-all

#### Secondary CTA
- bg-white text-gray-700
- text-xl font-semibold
- px-12 py-4 rounded-full
- border-2 border-gray-200
- hover:border-indigo-300
- transition-all

#### Small Button
- px-6 py-2 rounded-full
- bg-gradient-to-r from-indigo-500 to-pink-500
- text-white hover:shadow-lg

### Cards

#### Feature Card
- bg-white/80 backdrop-blur-sm
- p-6 rounded-2xl
- shadow-md hover:shadow-lg
- transition-shadow

#### Testimonial Card
- bg-gradient-to-br from-gray-50 to-white
- p-6 rounded-3xl
- border border-gray-100
- shadow-sm hover:shadow-md
- transition-shadow

#### Pricing Card
- bg-zinc-950 text-white
- p-6 rounded-3xl
- (Most popular: gradient border)

### Navigation

#### Header
- fixed top-0 z-50
- bg-white/90 backdrop-blur-md
- shadow-sm
- h-16 (64px height)

#### Nav Links
- text-gray-700
- hover:text-indigo-600
- transition-colors

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (default)
- **Tablet**: sm: 640px
- **Desktop**: md: 768px
- **Large**: lg: 1024px
- **XL**: xl: 1280px

### Mobile-First Approach

#### Grid Layouts
- **Mobile**: grid-cols-1 (single column)
- **Tablet**: md:grid-cols-2 (two columns)
- **Desktop**: md:grid-cols-3 or md:grid-cols-4

#### Typography Scaling
- **Mobile**: text-5xl (48px)
- **Desktop**: md:text-7xl (72px)

#### Spacing Adjustments
- **Mobile**: gap-4 (16px)
- **Desktop**: md:gap-6 (24px)

## ✨ Animations & Interactions

### Transitions
- **Standard Transition**: transition-all, duration: 300ms (default)
- **Shadow Transitions**: shadow-md → hover:shadow-lg, shadow-lg → hover:shadow-xl
- **Color Transitions**: text-gray-700 → hover:text-indigo-600, border-gray-200 → hover:border-indigo-300

### Hover States
- **Cards**: Elevation increase (shadow), Subtle scale (optional)
- **Buttons**: Shadow enhancement, Slight brightness increase
- **Links**: Color change to brand color, Smooth transition

### Loading States
- disabled:opacity-50
- cursor-not-allowed

## 🎪 Special Effects

### Backdrop Blur
- bg-white/90 backdrop-blur-md
- bg-white/80 backdrop-blur-sm
- Creates depth and modern glass-morphism effect

### Gradients
- **Text Gradients**: bg-gradient-to-r from-indigo-600 to-pink-600, bg-clip-text text-transparent
- **Background Gradients**: bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50, bg-gradient-to-r from-indigo-500 to-pink-500

### Rounded Corners
- **rounded-full** - Pills, buttons (9999px)
- **rounded-3xl** - Large cards (24px)
- **rounded-2xl** - Medium cards (16px)
- **rounded-xl** - Small cards (12px)
- **rounded** - Default (8px)

## 🌐 RTL (Right-to-Left) Support

### Implementation
- **HTML Direction**: `<div dir="rtl">`
- **Text Alignment**: Automatic right alignment for Hebrew text
- **Flexbox**: Reverses naturally with RTL
- **Grid layouts**: Adapt automatically
- **Icon Positioning**: Arrows point left (←) instead of right, Icons positioned on the right side of text

## 📊 Section-Specific Design

### Hero Section
- **Background**: Gradient: indigo-50 → purple-50 → pink-50, Overlay image with 10% opacity
- **Content Hierarchy**: Rating stars (social proof), Main headline (value proposition), Subheadline (explanation), CTA buttons (action), Feature cards (capabilities)

### Stats Section
- **Layout**: 2 columns on mobile, 4 columns on desktop, Centered alignment
- **Typography**: Large gradient numbers (4xl-5xl), Small gray descriptions

### Testimonials Section
- **Card Stagger**: md:mt-10 on middle column (creates visual rhythm)
- **Content Structure**: 5 stars at top, Avatar on right, Title (bold), Testimonial text, Author info at bottom

### Pricing Section
- **Dark Theme**: bg-zinc-900 background, White text for contrast, Gradient accents pop more
- **Toggle Design**: Pill-shaped container, Active state with gradient, Savings badge on annual

## 🦸 Superpowers Page Design

### Page Purpose
Showcase Mimo's capabilities in detail without being technical. Each feature should feel like a superpower the user gains, not a technical specification.

### Layout Structure

#### Hero Section
- **Background**: Gradient (indigo-50 → purple-50 → pink-50)
- **Padding**: py-20 md:py-32
- **Max-width**: max-w-7xl
- **Content Hierarchy**: Page title with gradient accent, Subtitle explaining the value, Feature cards grid

### Feature Cards Design

#### Card Structure
- **Layout**: grid grid-cols-1 md:grid-cols-2 gap-8
- **Card**: bg-white/90 backdrop-blur-sm
- **Padding**: p-8 md:p-10
- **Border-radius**: rounded-3xl
- **Shadow**: shadow-lg hover:shadow-xl
- **Transition**: transition-all duration-300

### Feature Categories
1. **Calendar Management** (לדבר עם היומן) - Icon: 📅, Color: indigo-600
2. **Smart Reminders** (תזכורות חכמות) - Icon: 🔔, Color: purple-600
3. **Recurring Reminders** (תזכורות חוזרות) - Icon: 🔄, Color: pink-600
4. **Nudges** (נודניקים) - Icon: ⏰, Color: amber-500
5. **Lists** (רשימות) - Icon: 📝, Color: green-600
6. **Second Brain** (זיכרון אישי) - Icon: 🧠, Color: indigo-600 to pink-600 gradient

### Typography Hierarchy
- **Page Title**: text-5xl md:text-7xl font-bold
- **Feature Title**: text-3xl md:text-4xl font-bold mb-4
- **Description**: text-lg md:text-xl text-gray-600 mb-6
- **Benefit Points**: text-base text-gray-700

### Interactive Elements
- **Hover Effects**: Card hover: transform scale-105 shadow-xl, Icon hover: Subtle rotation or bounce animation
- **Scroll Animations**: Cards fade in from bottom as user scrolls, Stagger animation: Each card appears 100ms after previous

## 💰 Pricing Page Design

### Page Purpose
Present pricing clearly and transparently, building confidence without overwhelming. Emphasize value over cost.

### Layout Structure
- **Hero Section**: bg-white, py-16 md:py-24, text-align: center
- **Section Breakdown**: Page title and subtitle, Billing toggle (Monthly/Annual), Pricing cards grid, Feature comparison table, FAQ section, Final CTA

### Billing Toggle Design
- **Container**: bg-stone-900 border border-white/20 rounded-full p-1
- **Buttons**: px-6 py-2 rounded-full
- **Active**: bg-gradient-to-r from-indigo-500 to-pink-500 text-white
- **Inactive**: text-white
- **Badge**: bg-green-500 text-xs px-2 py-1 rounded-full

### Pricing Cards Layout
- **Grid Structure**: Desktop: grid-cols-3 gap-6, Mobile: grid-cols-1 gap-6, Max-width: max-w-6xl mx-auto
- **Most Popular Card**: Border: bg-gradient-to-r from-indigo-500 to-pink-500 p-0.5, Header: bg-gradient-to-r from-indigo-600 to-pink-600, Scale: md:scale-105, Z-index: z-10
- **Standard Card**: Background: bg-zinc-950, Text: text-white, Border-radius: rounded-3xl, Padding: p-6

### Pricing Card Components
- **Plan Header**: flex justify-between items-center, Plan Name: text-2xl font-semibold, Badge: bg-lime-400 text-black text-xs px-2 py-1 rounded
- **Price Display**: Current Price: text-4xl font-bold, Original Price: text-2xl text-gray-400 line-through, Frequency: text-gray-400 text-sm, Savings Text: text-gray-400 text-sm
- **CTA Button**: w-full, py-3, text-xl font-semibold, rounded-full, Most Popular: bg-gradient-to-r from-indigo-500 to-pink-500, Standard: bg-indigo-500 hover:bg-indigo-600
- **Features List**: space-y-3 mt-6, Icon: ✓, Text: text-gray-300 text-sm

### Feature Comparison Section
- **Layout**: Background: bg-gray-50, Padding: py-16, Title: text-2xl font-semibold text-center mb-8
- **Feature Grid**: grid-cols-3 md:grid-cols-6 gap-4, Max-width: max-w-4xl mx-auto
- **Feature Card**: Background: bg-gradient-to-br from-gray-800 to-gray-900, Padding: p-4, Border-radius: rounded-2xl, Shadow: shadow-lg, Icon: text-3xl mb-2, Text: text-white text-xs font-medium

### Coming Soon Section
- **Design**: Background: bg-white, Padding: py-12, Border-top: border-t border-gray-200
- **Content Layout**: Title: text-xl font-semibold text-gray-900 mb-6, Grid: grid-cols-2 md:grid-cols-4 gap-4
- **Coming Soon Badge**: Background: bg-gray-100, Padding: p-4, Border-radius: rounded-xl, Border: border-2 border-dashed border-gray-300, Text: text-gray-600 text-center

### FAQ Section
- **Accordion Design**: Background: bg-white, Padding: py-16, Max-width: max-w-3xl mx-auto
- **Question Item**: Border: border-b border-gray-200, Padding: py-4, Question: text-lg font-semibold text-gray-900, Answer: text-gray-600 mt-2, Icon: Rotates 180deg when open

## 🔐 Login/Try Now Page Design

### Page Purpose
Remove friction from onboarding. Make the user feel confident about connecting their Google account.

### Layout Structure
- **Full-Screen Centered**: min-h-screen, flex items-center justify-center, bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
- **Content Container**: Max-width: max-w-md, Background: bg-white/90 backdrop-blur-sm, Padding: p-8 md:p-12, Border-radius: rounded-3xl, Shadow: shadow-2xl

### Onboarding Flow

#### Step 1: Explanation
- **Visual Hierarchy**: Logo: w-16 h-16 mb-6 mx-auto, Title: text-3xl font-bold text-gray-900 mb-4 text-center, Explanation: text-lg text-gray-600 mb-6 text-center, Benefits List: space-y-2 mb-8
- **Google Sign-In Button**: w-full, py-4, bg-white, border-2 border-gray-300, rounded-full, text-lg font-semibold, hover: border-indigo-500 shadow-md, transition-all
- **Security Badge**: flex items-center justify-center gap-2, Icon: 🔒, Text: text-sm text-gray-500, mt-4

#### Step 2: Success State
- **Success Animation**: Icon: Fade in + scale animation, Duration: 500ms, Easing: ease-out
- **WhatsApp CTA**: bg-gradient-to-r from-indigo-500 to-pink-500, text-white text-xl font-semibold, px-12 py-4, rounded-full, shadow-lg hover:shadow-xl, Icon: → (arrow pointing left in RTL)

### Loading States
- **During Authentication**: Spinner: animate-spin, Size: w-12 h-12, Color: text-indigo-600

### Error States
- **If Connection Fails**: Error Icon: text-red-500, Error Text: text-red-600, Retry Button: bg-indigo-500 hover:bg-indigo-600

### Mobile Optimization
- **Touch-Friendly**: Button height: min-h-[56px], Font size: text-lg, Spacing: Generous padding
- **Responsive Layout**: Mobile: Full-width container with side padding, Desktop: Centered card with max-width

## 🍔 Menu Component Design & Behavior

### Desktop Navigation
- **Structure**: [Logo] בית יכולות תמחור [נסה עכשיו]
- **Layout**: fixed top-0 z-50, bg-white/90 backdrop-blur-md, shadow-sm, h-16, px-4 sm:px-6 lg:px-8, flex justify-between items-center
- **Logo**: text-2xl, font-bold, text-indigo-600
- **Navigation Links**: flex items-center gap-8, text-base, text-gray-700, hover:text-indigo-600, transition-colors duration-200
- **Active State**: Current page: text-indigo-600 font-semibold, Underline: border-b-2 border-indigo-600
- **CTA Button**: bg-gradient-to-r from-indigo-500 to-pink-500, text-white, px-6 py-2, rounded-full, hover:shadow-lg, transition-shadow

### Mobile Navigation
- **Collapsed State**: [Logo] [☰]
- **Hamburger Button**: md:hidden, w-6 h-6, text-gray-700, p-2
- **Expanded State**: [Logo] [✕], Menu items below
- **Mobile Menu Panel**: absolute top-16 right-0 left-0, bg-white, border-t border-gray-200, py-4, shadow-lg, Slide down animation
- **Mobile Menu Items**: flex flex-col gap-4, px-4, text-base, text-gray-700, text-align: right
- **Mobile CTA**: w-full, text-align: center, mt-4

### Scroll Behavior
- **On Scroll Down**: bg-white (solid), shadow-md
- **On Scroll Up**: bg-white/90 backdrop-blur-md, shadow-sm
- **Sticky Behavior**: sticky top-0, z-50

### Authentication States
- **Logged Out**: [בית] [יכולות] [תמחור] [התחבר] [נסה עכשיו]
- **Logged In**: [בית] [יכולות] [תמחור] [שם המשתמש ▼] [נסה עכשיו]
- **User Dropdown**: absolute top-full left-0, bg-white, border border-gray-200, rounded-lg, shadow-lg, py-2, min-w-[200px]
- **Dropdown Items**: px-4 py-2, hover:bg-gray-50, text-gray-700, transition: background-color 200ms

### Smooth Scroll Navigation
- **Anchor Links**: href="#home", href="#superpowers", href="#pricing"
- **Scroll Behavior**: scroll-behavior: smooth, scroll-padding-top: 64px
- **Active Section Detection**: IntersectionObserver monitors section visibility, Updates active link styling dynamically

### Accessibility
- **Keyboard Navigation**: Focus: outline-2 outline-offset-2 outline-indigo-500, Tab order: Logical
- **Screen Readers**: <nav aria-label="ניווט ראשי">, <button aria-label="תפריט" aria-expanded="false">
- **Mobile Menu Toggle**: aria-expanded: true/false, aria-controls: "mobile-menu"

### Animation Details
- **Menu Open**: slideDown, translateY(-100%) → translateY(0), opacity 0 → 1, 300ms, ease-out
- **Menu Close**: slideUp, translateY(0) → translateY(-100%), opacity 1 → 0, 200ms, ease-in
- **Link Hover**: color 200ms ease-in-out, translateY(-1px)

### Responsive Breakpoints
- **Mobile Menu**: block (< 768px), md:hidden
- **Desktop Menu**: none (< 768px), md:flex (≥ 768px)

### Z-Index Hierarchy
- Header: z-50
- Mobile Menu: z-40
- Dropdown: z-30
- Content: z-0

## 🎨 Design Tokens Summary

### Spacing
- --spacing-xs: 8px
- --spacing-sm: 16px
- --spacing-md: 24px
- --spacing-lg: 32px
- --spacing-xl: 48px
- --spacing-2xl: 64px

### Border Radius
- --radius-sm: 8px
- --radius-md: 16px
- --radius-lg: 24px
- --radius-full: 9999px

### Shadows
- --shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
- --shadow-md: 0 4px 6px rgba(0,0,0,0.1)
- --shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
- --shadow-xl: 0 20px 25px rgba(0,0,0,0.15)

### Typography
- --font-family: 'Figtree', sans-serif
- --font-size-xs: 12px
- --font-size-sm: 14px
- --font-size-base: 16px
- --font-size-lg: 18px
- --font-size-xl: 20px
- --font-size-2xl: 24px
- --font-size-3xl: 30px
- --font-size-4xl: 36px
- --font-size-5xl: 48px
- --font-size-6xl: 60px
- --font-size-7xl: 72px

## 🎯 Accessibility
- **Color Contrast**: All text meets WCAG AA standards
- **Interactive Elements**: Minimum touch target: 44x44px, Clear focus states, Disabled states clearly indicated, Loading states communicated
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3), Semantic sections (header, main, section), Accessible navigation, Alt text for images

## 📱 Mobile Optimization
- **Touch Targets**: Buttons: minimum 44px height, Links: adequate padding, Cards: full-width tappable area
- **Performance**: Backdrop blur for modern feel, Optimized images, Minimal animations, Fast transitions
- **Readability**: Larger font sizes on mobile, Adequate line height, Sufficient contrast, Clear hierarchy

## 🎨 Brand Voice in Design
- **Visual Personality**: Professional, Friendly, Modern, Trustworthy, Energetic
- **Emotional Goals**: Users should feel Calm, Confident, Understood, Empowered

## 🔧 Implementation Notes
- **Tailwind CSS**: All styles use Tailwind utility classes
- **Custom Fonts**: Figtree loaded via @font-face
- **Gradient Utilities**: .bg-gradient-to-r, .from-{color}, .via-{color}, .to-{color}

## 📋 Checklist for New Components
When creating new components, ensure:
- ✅ Mobile-first responsive design
- ✅ RTL support for Hebrew
- ✅ Loading states handled
- ✅ Error states handled
- ✅ Hover/active states defined
- ✅ Proper spacing (using scale)
- ✅ Accessible color contrast
- ✅ Semantic HTML structure
- ✅ Smooth transitions
- ✅ Consistent with design system

## 🎓 Design Principles Summary
- **Mobile-First** - Design for small screens, enhance for large
- **Clarity** - Every element has a clear purpose
- **Consistency** - Use design tokens and patterns
- **Accessibility** - Design for everyone
- **Performance** - Fast, smooth, responsive
- **Brand Alignment** - Professional yet friendly
- **User-Centered** - Focus on user needs and goals
- **Simplicity** - Remove unnecessary complexity

