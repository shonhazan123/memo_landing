# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📋 What's Included

✅ **Complete React App** with:
- Home page (Hero, Stats, Testimonials)
- Superpowers page (6 feature cards)
- Pricing page (Toggle, Cards, FAQ)
- Login page (prepared for Google auth)

✅ **Design System** fully implemented:
- Figtree font (from provided URL)
- Tailwind CSS with all design tokens
- RTL support for Hebrew
- Responsive design (mobile-first)

✅ **Components**:
- Menu/Navigation (desktop & mobile)
- Buttons (Primary, Secondary, Small)
- Cards (Feature, Testimonial, Pricing)
- Logo (with placeholder)

✅ **Supabase** configured:
- Client setup ready
- Auth helpers structure prepared
- Just needs credentials and OAuth setup

## 🎨 Adding Your Logo

Simply add your logo image to `public/logo.png` and it will automatically appear. The Logo component handles the fallback to text if the image isn't found.

## 🔐 Setting Up Google Authentication

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your OAuth credentials
5. Uncomment the auth functions in `src/config/supabase.js`
6. Update `src/pages/Login.jsx` to use the actual auth

## 📱 Testing

Test on different screen sizes:
- Mobile: < 640px
- Tablet: 640px - 768px
- Desktop: > 768px

All pages are fully responsive and RTL-enabled.

## 🐛 Troubleshooting

**Font not loading?**
- Check if the Figtree font URL is accessible
- The font is loaded from: `https://memorae.ai/l3-assets/_next/static/media/f7aa21714c1c53f8.p.e3544bb0.woff2`

**Supabase errors?**
- Make sure `.env` file has correct credentials
- Check Supabase dashboard for project URL and anon key

**Build errors?**
- Run `npm install` again
- Clear `node_modules` and reinstall if needed

## 📚 Documentation

- **Design System**: `docs/project-instruction/design-system.md`
- **Project Plan**: `docs/project-instruction/project-plan.md`
- **README**: `README.md`

## ✅ Next Steps

1. Add Supabase credentials
2. Set up Google OAuth
3. Add logo image
4. Test all pages
5. Deploy to production

Happy coding! 🎉

