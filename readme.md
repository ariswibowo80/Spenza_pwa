# Spenza PWA — Setup Guide

A fully installable Android app (Progressive Web App) with Google Sign-In.

---

## 📁 File Structure

```
spenza-pwa/
├── index.html          ← Main app (all data embedded)
├── manifest.json       ← PWA manifest (install metadata)
├── sw.js               ← Service worker (offline support)
├── favicon.svg         ← Browser tab icon
├── icons/
│   ├── icon-192.svg    ← Home screen icon (small)
│   └── icon-512.svg    ← Home screen icon (large)
└── README.md           ← This file
```

---

## 🚀 Step 1 — Host the App (Required for PWA install)

PWAs must be served over **HTTPS**. You cannot install from `file://`.

### Option A: Netlify (Free, Easiest)
1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Drag the entire `spenza-pwa/` folder onto the Netlify dashboard
3. You'll get a URL like `https://your-app.netlify.app`
4. Done — your app is live!

### Option B: GitHub Pages (Free)
1. Create a GitHub account
2. Create a new repository named `spenza`
3. Upload all files from `spenza-pwa/` folder
4. Go to Settings → Pages → Source: `main` branch
5. Your app will be at `https://yourusername.github.io/spenza`

### Option C: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` inside the `spenza-pwa/` folder
3. Follow prompts → you'll get an HTTPS URL

### Option D: Local testing (no install, but works for testing)
```bash
npx serve spenza-pwa/
# or
python3 -m http.server 8080
```
Then open `http://localhost:8080` in Chrome on your PC.

---

## 🔐 Step 2 — Set Up Google Sign-In (Optional but recommended)

> **If you skip this**, use "Try Demo Mode" button — the app works fully without Google.

### 2a. Create Google OAuth credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **+ Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Name: `Spenza`
7. Under **Authorized JavaScript origins**, add:
   - `https://your-app.netlify.app` (your hosting URL)
   - `http://localhost:8080` (for local testing)
8. Click **Create** → copy the **Client ID**

### 2b. Configure the app
Open `index.html` and find this line near the top of the `<script>` section:

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:

```javascript
const GOOGLE_CLIENT_ID = '123456789-abcdef.apps.googleusercontent.com';
```

Re-upload the updated `index.html` to your host.

---

## 📲 Step 3 — Install on Android

1. Open Chrome on your Android phone
2. Navigate to your hosted URL (e.g. `https://your-app.netlify.app`)
3. Sign in with Google (or Demo Mode)
4. Chrome will show a banner: **"Add Spenza to Home screen"**
   - Or tap the ⋮ menu → **Add to Home screen**
5. Tap **Add** → Spenza appears on your home screen like a native app!

### What you get after installing:
- ✅ Launches without browser UI (full-screen)
- ✅ Appears in your app drawer
- ✅ Works offline (service worker caches the app)
- ✅ Purple splash screen on launch
- ✅ Follows Android back button

---

## ⚠️ Important Notes

- **Data is stored in memory** — transactions added in the session will be lost on refresh
  (The CSV data is baked in at build time)
- **Google Sign-In is for authentication only** — no data is sent to Google
- The app works 100% offline once installed and cached
- For persistent new transactions, you'd need a backend (Firebase, Supabase, etc.)

---

## 🛠 Customization

### Change app name
Edit `manifest.json`: change `"name"` and `"short_name"`

### Change theme color
Edit `manifest.json`: change `"theme_color"` 
Edit `index.html`: change `--accent` CSS variable

### Add your own data
Replace the `RAW_DATA` object in `index.html` with your own CSV data

---

## 🔧 Troubleshooting

**"Install" option doesn't appear?**
- Must be served over HTTPS (not file://)
- Must use Chrome or Edge on Android
- The manifest.json must be linked correctly

**Google Sign-In not working?**
- Check your Client ID is correct
- Verify your hosting URL is in the Authorized origins list
- Use Demo Mode as fallback

**App not updating after re-upload?**
- The service worker caches aggressively
- Force refresh: Chrome → ⋮ → More tools → Developer tools → Application → Service Workers → Update
