# Mimo Website - Complete UI/UX Design System Documentation

## 🎨 Design Philosophy
The Mimo website is designed with a mobile-first, calm, and human-centered approach. The design emphasizes:

- **Clarity over cleverness** - Every element serves a clear purpose
- **Ease and control** - Users should feel empowered, not overwhelmed
- **Minimal cognitive load** - One primary action per screen
- **Natural flow** - Smooth transitions that guide attention
- **Israeli-friendly** - RTL support with Hebrew typography

### Agent identity (דונה / Dona)
- The assistant avatar **Dona** is **female**. All Hebrew copy that refers to Dona must use **feminine** forms: pronouns (היא), verbs (מנהלת, עוזרת, מבינה, מזכירה, זוכרת, שולחת, וכו'), and prepositions (איתה, לה). Headlines, testimonials, conversation subheadings, and feature descriptions should be consistent with this.

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
- Background: `var(--theme-button-gradient)` — linear-gradient(104deg, #3e86c6 → #a666aa → #ec4492 → #ee4454 → #f05427)
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

#### CardSwap Container
- position: relative
- perspective: 900px
- overflow: visible
- Cards positioned absolutely with 3D transforms
- Responsive scaling: 0.9x on tablet, 0.75x on mobile

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

#### Home Hero (Mobile Only, max-width: 900px)
- **Placement**: Content in the **right half** of the screen (`left: 38%`, `right: 4%`) so it does not overlap the video/character on the left; vertically centered (`top: 50%`, `transform: translateY(-50%)`).
- **Order**: CTAs above headline — `.hero-text-and-buttons` uses `flex-direction: column-reverse` so buttons appear first, then text.
- **Buttons**: Stacked vertically (`.hero-buttons-mobile` → `flex-direction: column`), max-width 280px; primary CTA "התחלק עכשיו", secondary "גלה יכולות".
- **Text**: Centered within the content block (`text-align: center`); headline ~1.5rem on mobile; content block max-width 280px.
- **Scope**: All of the above apply only inside `@media (max-width: 900px)` in `Home.css`; desktop layout unchanged.

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

### CardSwap Animation Component
- **Purpose**: Animated card stacking effect for feature showcases
- **Library**: GSAP (GreenSock Animation Platform)
- **Location**: `src/components/CardSwap/CardSwap.jsx`
- **Usage**: Wraps feature cards in a 3D stacked animation that cycles through cards
- **Props**:
  - `cardDistance`: Horizontal spacing between cards (default: 60px)
  - `verticalDistance`: Vertical offset for stacking (default: 70px)
  - `delay`: Time between card swaps in milliseconds (default: 5000ms)
  - `pauseOnHover`: Pause animation on hover (default: false)
  - `width`: Card width in pixels (default: 500px)
  - `height`: Card height in pixels (default: 400px)
  - `skewAmount`: 3D skew effect amount (default: 6)
  - `easing`: Animation easing type - 'elastic' or 'power1.inOut' (default: 'elastic')
- **Implementation**: Previously used on Home page for feature cards preview section (replaced by Gallery component)
- **Styling**: Cards maintain FeatureCard styling (bg-white/80, backdrop-blur-sm, rounded-2xl)

### Gallery Component
- **Purpose**: Horizontal scrolling image gallery with navigation arrows and title placeholders
- **Location**: `src/components/Gallery/Gallery.jsx`
- **Usage**: Displays a horizontally scrollable gallery of images with left/right navigation arrows. Each card features an image with an editable title placeholder overlay on top.
- **Props**:
  - `images`: Array of image objects with `src` (string) and `title` (string) properties (required)
  - `scrollStep`: Pixels to scroll per arrow click (default: 400px)
  - `className`: Additional CSS classes for the container (optional)
- **Features**:
  - Horizontal scrolling with smooth behavior
  - Left/right navigation arrow buttons
  - Title placeholder input on each card (editable)
  - Responsive design (mobile-friendly)
  - RTL support for Hebrew text
  - Automatic arrow state management (disabled at start/end)
  - Touch scrolling support on mobile devices
- **Implementation**: Used on Home page to replace CardSwap component, displaying photos from `public/photos/` directory
- **Styling**:
  - Cards: `rounded-2xl` (16px), `shadow-md hover:shadow-lg`, 500px width × 450px height (desktop)
  - Navigation arrows: Circular buttons (48px), dark grey background (`rgba(55, 65, 81, 0.9)`), white arrow icons
  - Title overlay: Gradient background (black with transparency), large white text (2rem), positioned at top of card
  - Container: Horizontal scroll with hidden scrollbar, smooth scroll behavior
  - **Mobile (max-width: 768px)**: Cards scale to 400px × 360px, smaller arrows (40px)
  - **Mobile (max-width: 480px)**: Cards scale to 320px × 288px, smaller arrows (36px)
- **Accessibility**: Arrow buttons include `aria-label` attributes, disabled state properly handled

### Chapter 3 – Conversation Flow (Home)
- **Purpose**: Show how the WhatsApp assistant works in real life: "אתה מבקש. דונה מבצעת." (You ask. Dona does.)
- **Location**: `src/pages/Home.jsx` (section after Hero, before Gallery)
- **Component**: `src/components/ConversationFlow/ConversationFlow.jsx`
- **Content**: Hebrew-only; section title + optional subtitle; each scenario has a header (heading + subheading) above the conversation, WhatsApp-style chat (Donna header + message bubbles), and a floating chevron-down arrow below (scroll cue). Displays multiple conversation examples with message bubbles, timestamps, and Donna's branded header. One scenario demonstrates image understanding: user sends an invitation image (`userImage`), and Donna responds with extracted event details (date, time, location) and offers to add to calendar or set a reminder.
- **Layout**: Full-width white section; centered title; conversation flow container (max-width 375px mobile, scales up on desktop); each conversation shows Donna header (WhatsApp-style dark teal #075E54, 335×60px, border-radius 16px, padding per Figma spec), user messages (light green #DCFFC6, left-aligned), Donna responses (white, right-aligned), with dividers between conversations.
- **Animation**: Section title via ScrollReveal; subtitle via BlurText; each conversation section uses IntersectionObserver-triggered fade-in (opacity 0→1, translateY 60px→0, 1s ease-out) when scrolled into view (threshold 0.3, rootMargin -100px bottom).
- **Styling**: `conversation-flow-container`, `scenario-header`, `donna-header`, `user-message-bubble`, `donna-message-bubble`, `scenario-arrow` in `ConversationFlow.css`; mobile-first padding and typography scale; RTL support for Hebrew text. Scenario header: centered, heading 1.5rem/600, subheading 1rem/gray-500, mb-8. Donna header: flex row, 12px gap, padding 12px 16px 12px 212px (content right-aligned), background #075E54, border-radius 16px; content: circular avatar (36px), name "Donna", status "מקוון". Arrow: chevron-down SVG, gray-300, flow-float animation (2s ease-in-out infinite). Spacing: section py-20 (80px), mb-20 (80px), messages gap 12px, pb-20 on messages, divider mt-8.

### BackgroundVideo Component
- **Purpose**: GIF-like background video that autoplays, loops infinitely, and behaves as a background element
- **Location**: `src/components/BackgroundVideo/BackgroundVideo.jsx`
- **Usage**: Renders a native HTML5 `<video>` element behind content for immersive hero sections
- **Props**:
  - `src`: Path to the video file (required)
  - `poster`: Fallback image shown before video loads (optional)
  - `className`: Additional classes for the container (optional)
  - `videoClassName`: Additional classes for the video element (optional)
  - `children`: Overlay content rendered above the video (optional)
- **Video Attributes**:
  - `autoPlay`: Starts playback automatically on page load
  - `loop`: Infinite playback, restarts when video ends
  - `muted`: Required for autoplay on modern browsers
  - `playsInline`: Prevents fullscreen on iOS Safari
  - `disablePictureInPicture`: Hides PiP overlay button
  - `disableRemotePlayback`: Hides casting/AirPlay controls
- **Implementation**: Used on Home page hero section. Two videos by viewport:
  - **Desktop (viewport > 900px)**: `/videos/dona_video.mp4` (`.hero-video-desktop`)
  - **Phone (viewport ≤ 900px)**: `/videos/dona_iphone.mp4` (`.hero-video-mobile`). CSS shows/hides the correct source so the phone-sized hero plays the iPhone-optimized video.
- **Styling**: 
  - Container: `position: absolute; inset: 0; z-index: 0`
  - Video: `object-fit: cover` fills container like background-size: cover
  - Opacity controlled via className prop (e.g., `opacity-60 md:opacity-40`)
  - **Mobile (max-width: 900px)**: Video scaled to 85% (`transform: scale(0.85)`) to zoom out and make avatar appear smaller without cropping
  - **Mobile positioning**: `object-position: 30% center` to show avatar on left side
- **Accessibility**: Respects `prefers-reduced-motion` - hides video for users who prefer reduced motion

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
- **Background**: Gradient: indigo-50 → purple-50 → pink-50, Background video switches by viewport
- **Video**: Uses BackgroundVideo component. Desktop (viewport > 900px): `dona_video.mp4`. Phone (viewport ≤ 900px): `dona_iphone.mp4` (iPhone-optimized hero). CSS toggles `.hero-video-desktop` / `.hero-video-mobile` so only the appropriate video is visible and plays.
- **Mobile Video**: On phone size the hero plays `dona_iphone.mp4`; existing mobile styling (scale/position) applies to that video
- **Content Hierarchy**: Rating stars (social proof), Main headline (value proposition), Subheadline (explanation), CTA buttons (action), Feature cards (capabilities)
- **Mobile Buttons**: Larger size on mobile (padding: 1rem 2rem, font-size: 1rem, min-height: 48px) for better touch targets and visibility

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

### CardNav Component (Floating Pill Nav)
- **Location**: `src/components/CardNav/`, used on Home and other pages
- **Logo (xl size)**: height 60px, width 90px (Tailwind: `h-[60px] w-[90px]`)
- **CTA Button ("נסה עכשיו")**: min-width 50px, font-size 13px at max-width 400px breakpoint, base font-size 0.875rem
- **Styling**: CardNav.css; Logo uses Tailwind utilities

### Footer Component
- **Location**: `src/components/Footer/` (Footer.jsx, Footer.css)
- **Usage**: Rendered in App.jsx below main content; appears on all pages
- **Layout**: Dark footer (bg-zinc-900), RTL, max-w-7xl container; top row: brand (logo + tagline) and links; bottom row: copyright
- **Links**: דף הבית, יכולות, תמחור, מדיניות פרטיות (Privacy → `/privacy`), תנאי שימוש (Terms → `/terms`), מדיניות ביטול והחזרים (Cancellation & Refund Policy → `/refund-policy`)
- **Styling**: text-gray-300/400, hover accent (--theme-accent), border-t border-white/10 above copyright
- **Accessibility**: role="contentinfo", aria-label on logo link

### Privacy Policy Page
- **Location**: `src/pages/Privacy.jsx`, `src/pages/Privacy.css`
- **Route**: `/privacy`
- **Purpose**: Displays site privacy policy; content is placeholder until provided
- **Layout**: RTL, max-w-4xl, white background; back link to home; title "מדיניות פרטיות"; content area with section/heading/paragraph styles for policy text
- **Content**: Replace placeholder in Privacy.jsx with full policy text when ready (support h2, h3, p, ul, ol via .privacy-content classes)

### Terms of Service Page
- **Location**: `src/pages/Terms.jsx`, `src/pages/Terms.css`
- **Route**: `/terms`
- **Purpose**: Displays Terms of Service; layout matches Privacy (RTL, back link, sections).

### Cancellation & Refund Policy Page
- **Location**: `src/pages/RefundPolicy.jsx`, `src/pages/RefundPolicy.css`
- **Route**: `/refund-policy`
- **Purpose**: Formal Cancellation & Refund Policy for SaaS/payment-processor compliance (subscription, cancellation, refunds, free trial, automatic renewal, failed payments, termination, account deletion, policy updates). Linked from footer and from Pricing page disclaimer near checkout.

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

## ⚙️ Settings Page Design

### Layout
- Route: `/settings`, protected, uses `UserDashboardLayout`
- Background: `bg-gray-50`, white cards stacked vertically
- Desktop: centered `max-w-2xl`, cards `p-8 rounded-3xl shadow-md`, 2-column profile fields
- Mobile: full-width cards `mx-4 p-5 rounded-2xl`, stacked fields, full-width 48px buttons

### Connection Status Indicators
- Connected: green dot (`bg-green-500 w-2.5 h-2.5 rounded-full`) + "מחובר" in `text-green-600`
- Disconnected: red dot (`bg-red-400`) + "לא מחובר" in `text-red-500`

### Danger Button (Delete Account)
- `bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-full`
- Confirmation modal: `bg-white rounded-3xl p-8 max-w-md shadow-2xl` with red confirm button

### Navigation -- Authenticated State
- When `isAuthenticated === true`: CTA button replaced with circular user icon (40x40px, gradient-border-pill, `lucide-react` User icon)
- Navigates to `/settings`, tooltip "הגדרות" on hover

## 🎓 Design Principles Summary
- **Mobile-First** - Design for small screens, enhance for large
- **Clarity** - Every element has a clear purpose
- **Consistency** - Use design tokens and patterns
- **Accessibility** - Design for everyone
- **Performance** - Fast, smooth, responsive
- **Brand Alignment** - Professional yet friendly
- **User-Centered** - Focus on user needs and goals
- **Simplicity** - Remove unnecessary complexity

