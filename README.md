# Home Croissanterie — Wholesale Order App

A mobile-first web app for wholesale customers to place orders.

## Customer URLs
- Beta Coffee: `https://order.homecroissanterie.com.au/order/beta-coffee`
- Algorithm Potts Point: `https://order.homecroissanterie.com.au/order/algorithm-potts-point`
- Pillar Burwood: `https://order.homecroissanterie.com.au/order/pillar-burwood`

---

## Setup & Deployment

### Step 1 — Resend (email sending)
1. Create a free account at [resend.com](https://resend.com)
2. Go to Domains → Add Domain → enter `homecroissanterie.com.au`
3. Add the DNS records they give you to your domain registrar
4. Wait for verification (usually a few minutes)
5. Go to API Keys → Create API Key → copy it

### Step 2 — GitHub
1. Create a free account at [github.com](https://github.com) if you don't have one
2. Create a new repository called `hc-order-app`
3. Upload all these files to the repository

### Step 3 — Vercel
1. Create a free account at [vercel.com](https://vercel.com)
2. Click "Add New Project" → import your GitHub repo
3. Add environment variable:
   - Name: `RESEND_API_KEY`
   - Value: the API key from Step 1
4. Click Deploy — Vercel builds and deploys automatically
5. You'll get a URL like `hc-order-app.vercel.app`

### Step 4 — Custom domain
1. In Vercel, go to your project → Settings → Domains
2. Add `order.homecroissanterie.com.au`
3. Vercel will give you a DNS record to add to your domain registrar
4. Once verified, your app is live at `order.homecroissanterie.com.au`

---

## Adding a new customer
1. Open `lib/config.ts`
2. Add a new entry to `CUSTOMERS`:
   ```ts
   "new-shop-slug": {
     name: "New Shop Name",
     email: "",
   },
   ```
3. Push to GitHub — Vercel redeploys automatically in ~30 seconds
4. Share the URL: `order.homecroissanterie.com.au/order/new-shop-slug`

## Updating prices or menu items
Edit `MENU_ITEMS` in `lib/config.ts` and push to GitHub.

## Updating the Web App URL
Edit `WEBAPP_URL` in `lib/config.ts`.

---

## Local development
```bash
npm install
cp .env.local.example .env.local
# Add your RESEND_API_KEY to .env.local
npm run dev
# Open http://localhost:3000/order/beta-coffee
```
