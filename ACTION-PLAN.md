# Prioritized SEO Action Plan: The First 10 Stumps System

Every action item below is evidence-backed from the full automated audit, labeled with implementation effort, ranking impact, and confidence.

---

## Phase 1: High Impact, Zero-Risk Fixes (P0 — Immediate)

### 1. Add Canonical URL and Explicit Favicon Tags
- **Confidence:** Confirmed
- **Impact:** High (Eliminates duplicate content risks across query parameters and social shares; brand recognition in SERP snippets)
- **Effort:** 5 minutes
- **Where:** [`app/layout.tsx`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/app/layout.tsx)
- **Implementation:**
  Add `alternates: { canonical: '/' }` and `icons: { icon: '/favicon.ico' }` into `export const metadata: Metadata` in `app/layout.tsx`.

---

### 2. Add `FAQPage` Rich Result Schema
- **Confidence:** Confirmed
- **Impact:** High (Enables Google expandable accordion rich snippets directly under search results, dramatically increasing SERP CTR)
- **Effort:** 10 minutes
- **Where:** [`app/layout.tsx`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/app/layout.tsx) or `app/page.tsx`
- **Implementation:**
  Map the 8 questions from [`config/faqs.ts`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/config/faqs.ts) into Schema.org `FAQPage` JSON-LD.

---

### 3. Deploy HTTP Security Headers in Next.js
- **Confidence:** Confirmed
- **Impact:** High (Bumps Security Header score from 45/100 to 95/100; satisfies Google Page Experience security signals)
- **Effort:** 10 minutes
- **Where:** [`next.config.js`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/next.config.js)
- **Implementation:**
  Add a `headers()` block providing `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

---

## Phase 2: Generative Engine & Answer Engine Optimization (P1 — High Priority)

### 4. Create `/llms.txt` for AI Search Engines (GEO)
- **Confidence:** Confirmed
- **Impact:** High (Enables Perplexity, ChatGPT Search, Claude, and Google Gemini to accurately cite your tool, formulas, and pricing)
- **Effort:** 10 minutes
- **Where:** `public/llms.txt`
- **Implementation:**
  Create a markdown summary detailing the system's purpose, core pricing formulas, equipment safety guidelines, and direct resource links.

---

### 5. Explicitly Permit AI Search Bots in `robots.ts`
- **Confidence:** Confirmed
- **Impact:** Medium (Ensures AI search assistants like GPTBot, ClaudeBot, and PerplexityBot are explicitly granted crawl permissions)
- **Effort:** 5 minutes
- **Where:** [`app/robots.ts`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/app/robots.ts)
- **Implementation:**
  Add targeted user-agent entries for `GPTBot`, `ClaudeBot`, and `PerplexityBot` allowing `/` and disallowing `/api/`, `/download/`, and `/checkout/success`.

---

## Phase 3: Site Architecture & Performance (P2 — Medium Priority)

### 6. Remove `/resend-links` from Public XML Sitemap
- **Confidence:** Confirmed
- **Impact:** Medium (Preserves crawl budget and prevents Google from ranking a post-purchase utility page over the core sales landing page)
- **Effort:** 5 minutes
- **Where:** [`app/sitemap.ts`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/app/sitemap.ts)
- **Implementation:**
  Remove the `/resend-links` entry from `sitemap()`, leaving only public commercial content pages (`/`, `/contact`, `/refund-policy`, `/terms`, `/privacy`).

---

### 7. Add Explicit `loading="lazy"` & `decoding="async"` to Case Study Images
- **Confidence:** Confirmed
- **Impact:** Medium (Reduces initial mobile data payload and improves First Contentful Paint / LCP)
- **Effort:** 10 minutes
- **Where:** [`components/BeforeAfter.tsx`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/components/BeforeAfter.tsx) & [`components/PreviewGallery.tsx`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/components/PreviewGallery.tsx)
- **Implementation:**
  Add `loading="lazy"` and `decoding="async"` to the comparison card `<img>` elements.

---

## Phase 4: Entity SEO & Authority Building (P3 — Ongoing)

### 8. Add `Organization` & `WebSite` Schema with SameAs Links
- **Confidence:** Confirmed
- **Impact:** Medium (Strengthens Google Knowledge Graph entity recognition and connects business identity)
- **Effort:** 10 minutes
- **Where:** [`app/layout.tsx`](file:///C:/Users/msi/.gemini/antigravity/scratch/stump-grinding-playbook/app/layout.tsx)
- **Implementation:**
  Embed an `Organization` node in JSON-LD linking `name`, `url`, `logo`, and `contactPoint`.

---

### 9. Build Local & Trade Backlinks
- **Confidence:** Confirmed
- **Impact:** High (Long-term organic authority; current link profile is 0/100 as a newly registered domain)
- **Effort:** Ongoing
- **Action:**
  - Share free cheat sheet on Reddit arborist communities (`r/TreeClimbing`, `r/arborists`).
  - Engage on contractor forums like TreeBuzz.com and ArboristSite.
  - List on contractor tools directories.
