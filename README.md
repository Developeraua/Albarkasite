# Albarka Properties Consultant Limited

Official web platform for **Albarka Properties Consultant Limited** — a real estate, construction, infrastructure, and property consultancy agency based in Bauchi, Bauchi State, Nigeria (RC: 7062863).

## Features

- **Real Estate Listings**: Verified plots, landed properties, luxury duplexes, apartments, and commercial plazas in Bauchi.
- **Project Showcase**: Civil works, estate development, and infrastructure portfolio.
- **Real-Time Database**: Powered by Supabase for on-sale catalogues, projects, and user authentication.
- **Admin Management Portal (`/admin`)**: Restricted to authorized `SUPER_ADMIN` accounts to add, edit, or delete listings and upload multiple property images in real time.
- **Interactive Inquiries**: Multi-slide property previews, direct WhatsApp chat, telephone lines, and comment/inquiry modals for clients.
- **Mobile First & Responsive**: Optimized for smartphones, tablets, and desktop displays with smooth scrolling and high-performance typography.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** + **Tailwind CSS v4**
- **Framer Motion** + **Lucide React**
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`)

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/albarka-properties.git
cd albarka-properties
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production

#### For standard web hosting (GitHub Pages, Netlify, Vercel):
Generates a small `index.html` referencing separate `assets/` files:
```bash
npx vite build -c vite.standard.config.ts
```
Output:
```
dist/
  index.html        (small ~4 kB, references assets)
  assets/
    index-XXXX.js   (JavaScript bundle)
    index-XXXX.css  (Tailwind & custom CSS)
  favicon.svg
  logo.svg
```

#### For standalone single-file bundling:
```bash
npm run build
```

## License

Copyright © 2026 Albarka Properties Consultant Limited. All Rights Reserved.
