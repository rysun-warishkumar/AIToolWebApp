# Google AdSense setup

## Prerequisites

1. A **live domain** (AdSense does not approve `localhost`).
2. **Privacy Policy**, **Terms**, and **Cookie Policy** pages (already on this site).
3. Enough original content (tools, prompts, articles).

## Steps

1. Apply at [https://www.google.com/adsense](https://www.google.com/adsense) with your production URL.
2. After approval, create an **ad unit** (Display → Responsive).
3. Copy your **Publisher ID** (`ca-pub-XXXXXXXX`) and **ad slot** ID.

## Environment variables

In `frontend/.env.production`:

```env
VITE_SITE_URL=https://your-domain.com
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT=1234567890
```

## Load the AdSense script

Add to `frontend/index.html` inside `<head>` (only in production builds):

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"
></script>
```

Replace the client ID with yours. Google requires this script on pages that show ads.

## Place ads in the app

Import the slot component where you want an ad (e.g. footer of list pages):

```jsx
import AdSenseSlot from '../components/ads/AdSenseSlot'

<AdSenseSlot className="my-8 max-w-4xl mx-auto" />
```

**Policy tips:** Do not place ads on login/admin pages. Avoid ads too close to primary buttons. Use fewer units on mobile.

## Cookie consent

If you serve EU users, add a cookie consent banner before loading AdSense (personalized ads require consent under GDPR).

## SEO files

Update `frontend/public/robots.txt` and `frontend/public/sitemap.xml` — replace `https://your-domain.com` with your real domain before deploy.
