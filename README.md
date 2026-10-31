# The Stump Grinding Playbook — Production E-Commerce Platform

A production-ready direct sales website and digital delivery engine built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, and SQLite (Postgres-compatible). Built specifically for selling digital downloads with zero marketplace fees and complete revenue ownership.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Push database schema to local SQLite database (dev.db)
npx prisma db push

# 3. Create starter seed files in /private-files (if not already present)
node scripts/create-seed-files.js

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 1. How It Works (Architecture Overview)

- **Products Configuration (`/config/products.ts`)**: Edit names, tiers, prices, and file inclusions in one central file. The server enforces pricing and file entitlements—client-side prices are never trusted.
- **Secure File Storage (`/private-files/`)**: Digital files are stored outside the public directory. They are never directly accessible via web URLs.
- **Expiring Download Tokens**: Every completed payment generates a cryptographically secure 24-byte hex token valid for 7 days (configurable) with a maximum download limit per file.
- **Dynamic PDF Stamping (`/lib/stamper.ts`)**: Watermarks the buyer's email onto the footer of every page of `The-Stump-Grinding-Playbook.pdf` on the fly using `pdf-lib` to discourage file sharing.
- **Self-Service Link Recovery (`/resend-links`)**: Buyers who lose their links or whose links expire can enter their purchase email to receive an instant rotated token.
- **Lead Capture & Admin Export (`/api/leads`, `/api/admin/leads`)**: Captures free cheat sheet email signups. Export via CSV or JSON using `Bearer ADMIN_SECRET_KEY`.

---

## 2. Managing Products and Files

### Adding Your Real Product Files
Place your actual production files into the `/private-files` directory with these exact names (or change the names in `/config/products.ts`):
1. `The-Stump-Grinding-Playbook.pdf` (30+ page operational manual)
2. `Stump-Grinding-Pricing-Calculator.xlsx` (Excel & Google Sheets quoting tool)
3. `Stump-Grinding-Templates-and-Scripts-Pack.docx` (12 Word documents pack)

> **Security Note:** Never place files in `/public`. The `/api/download` route verifies token validity, token expiration, download quotas, and product tier entitlements before streaming files.

### Adding Real Job Photos and Previews
Put your real job photos into `/public/images/`:
- `cover.jpg` (1280x720 recommended for hero & social cards)
- `before-oak.jpg` and `after-oak.jpg` (Before & After comparison photos)
- `before-maple.jpg` and `after-maple.jpg`
- `preview-playbook.png`, `preview-calculator.png`, `preview-templates.png`

> **Fallback Mode:** If you do not have photos ready, clean labeled placeholders ("Your job photo here") are displayed automatically. You can toggle the real jobs section off at any time by setting `beforeAfter.enabled: false` in `/config/site.ts`.

---

## 3. Payment Providers & Setup

You can switch the payment provider with a single environment variable:
`PAYMENT_PROVIDER="lemonsqueezy"` (or `"stripe"`, `"paypal"`, `"razorpay"`, `"demo"`).

### Recommended Default for India Sellers: **Lemon Squeezy**
If you are an individual based in India selling digital downloads to US customers in USD:
- **Why Lemon Squeezy is recommended:** Lemon Squeezy acts as a **Merchant of Record (MoR)**. When selling across 50 US states, US economic nexus laws require calculating and remitting state sales tax (e.g. California, Texas, Florida). As an MoR, Lemon Squeezy calculates and remits all state taxes on your behalf, handles international card acceptance and chargebacks, and pays your earnings out directly to your Indian bank account via Wise/Payoneer/Direct Wire.
- *Note: Payment policies, fees, and cross-border availability change over time. Please verify current fees and terms directly with the provider.*

#### Lemon Squeezy Setup
1. Create an account at [lemonsqueezy.com](https://www.lemonsqueezy.com) and complete your store setup.
2. In your dashboard, create three digital products matching your tiers:
   - Playbook Only ($47)
   - Calculator + Templates ($67)
   - Full Kit ($97)
3. Copy each product's Variant ID into `.env`:
   - `LEMONSQUEEZY_VARIANT_PLAYBOOK="12345"`
   - `LEMONSQUEEZY_VARIANT_CALCULATOR="12346"`
   - `LEMONSQUEEZY_VARIANT_FULL_KIT="12347"`
4. In **Settings > API**, create an API key and set `LEMONSQUEEZY_API_KEY` and `LEMONSQUEEZY_STORE_ID`.
5. In **Settings > Webhooks**, create a webhook pointing to `https://your-domain.com/api/webhooks/lemonsqueezy` listening for `order_created`.
6. Set `LEMONSQUEEZY_WEBHOOK_SECRET` in `.env`.

---

### Alternative: Stripe
1. Create an account at [stripe.com](https://stripe.com). For Indian Stripe accounts, enable international card payments and USD currency settlement.
2. Set `STRIPE_SECRET_KEY="sk_test_..."`.
3. In the Stripe Dashboard, go to **Developers > Webhooks**, add an endpoint pointing to `https://your-domain.com/api/webhooks/stripe` listening for `checkout.session.completed`.
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET="whsec_..."`.

---

### Alternative: PayPal
1. Create a PayPal Developer app at [developer.paypal.com](https://developer.paypal.com).
2. Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`.
3. Set `PAYPAL_MODE="sandbox"` for testing or `"live"` for production.
4. Add a Webhook for `PAYMENT.CAPTURE.COMPLETED` pointing to `https://your-domain.com/api/webhooks/paypal` and paste the Webhook ID into `PAYPAL_WEBHOOK_ID`.

---

### Alternative: Razorpay (for INR)
1. Generate API Keys in the Razorpay Dashboard.
2. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
3. Add a webhook for `payment.captured` pointing to `https://your-domain.com/api/webhooks/razorpay`.

---

## 4. End-to-End Testing (Demo Mode)

The site includes a built-in **Demo Mode** enabled via `DEMO_MODE="true"` in `.env`.

To test the entire checkout and delivery flow locally without any payment gateway accounts:
1. Ensure `DEMO_MODE="true"` is set in `.env`.
2. Start the app: `npm run dev`.
3. Open [http://localhost:3000](http://localhost:3000).
4. Click **Get the Kit** on any tier (e.g. "Full Kit $97").
5. Enter any email address (e.g. `test@operator.com`) and click **Proceed to Secure Checkout**.
6. The app instantly completes the transaction, stores the order in SQLite, dispatches a simulated email to the console, and redirects to `/checkout/success` with your files ready to download.
7. Click the download buttons:
   - Notice the PDF is delivered with your email watermarked in the footer.
   - Notice that if you bought Tier 1 ($47 Playbook), the server blocks access to the Excel calculator.

To run automated integration tests:
```bash
npm run test:flow
```
This runs 7 automated assertions verifying token expiration, tier file boundaries, PDF watermarking, and link recovery.

---

## 5. Deploying to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Connect a PostgreSQL database (such as Vercel Postgres, Supabase, Neon, or Turso):
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
   - Set the `DATABASE_URL` environment variable in Vercel settings.
4. Add your production environment variables (`PAYMENT_PROVIDER`, API keys, `NEXT_PUBLIC_APP_URL="https://your-domain.com"`).
5. Deploy. Prisma runs `prisma generate` automatically via `npm run build`.

---

## 6. Pre-Launch Checklist

- [ ] **Review Legal Drafts**: Have `/terms` and `/privacy` reviewed by a qualified attorney.
- [ ] **Set Support Email**: Update `SUPPORT_EMAIL` in `.env` to your actual business address.
- [ ] **Replace Seed Files**: Place your real 30+ page PDF, Excel calculator, and Word templates in `/private-files`.
- [ ] **Upload Real Photos**: Place your job photos in `/public/images` (or set `beforeAfter.enabled = false` in `config/site.ts`).
- [ ] **Configure Transactional Email**: Add your `RESEND_API_KEY` in `.env` to send automatic receipt emails to buyers.
- [ ] **Switch off Demo Mode**: Set `DEMO_MODE="false"` in your production environment variables.
- [ ] **Test Live Sandbox**: Run a 100%-off coupon or $1 test transaction on your chosen provider to verify webhook signatures.
- [ ] **Domain & SSL**: Point your custom domain and verify HTTPS certificates.
- [ ] **Export Leads**: Retrieve captured cheat sheet emails at `/api/admin/leads?format=csv` using your `ADMIN_SECRET_KEY`.
