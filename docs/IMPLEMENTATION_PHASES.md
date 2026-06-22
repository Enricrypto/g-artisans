# G·Artisans Landing Page — Implementation Phases

## Overview

This document breaks down the G·Artisans landing page into logical implementation phases. Each phase will use the **Feature Factory** workflow:

1. Researcher (explore codebase)
2. Story Writer (define user story)
3. Spec Writer (technical brief)
4. Frontend Builder (implementation)
5. Test Verifier (acceptance tests)
6. Validator (quality gate)

**Design Inspiration Base:** All phases will incorporate the visual patterns extracted from the FOLLOW.ART screenshots (bold typography, geometric accents, playful composition, high contrast).

---

## Phase 1: Design System & Component Foundation (DONE)

**Status:** ⬜ Not Started  
**Priority:** 🔴 Critical (blocks all other phases)  
**Complexity:** Medium  
**Duration:** 1–2 hours

### What's Included

- Tailwind design tokens validation (colors, typography, spacing)
- Base component library:
  - Button variants (Primary Orange, Secondary Green, Outline Orange, Outline Dark)
  - Card component (with rotation, border styles)
  - Badge component (pill shape)
  - Typography system (Cormorant Garamond + Jost scaling)
- Geometric accent shapes (CSS/SVG circles, rectangles)
- Layout/spacing system (4rem gaps, padding scales)
- Icon system (Lucide React integration)

### Deliverables

- ✅ `tailwind.config.ts` validated and documented
- ✅ Component library in `src/components/ui/` (Button, Card, Badge, Accent shapes)
- ✅ Storybook stories or component documentation
- ✅ Spacing/typography utility classes

### Files to Touch

```
src/components/ui/Button.tsx
src/components/ui/Card.tsx
src/components/ui/Badge.tsx
src/components/ui/AccentShape.tsx
tailwind.config.ts
src/styles/globals.css
```

### Acceptance Criteria

- [ ] All 4 button variants render correctly with proper colors & hover states
- [ ] Cards render with configurable rotation, border, and spacing
- [ ] Typography scales correctly (H1–H6, body, small)
- [ ] Geometric accents (circles, rectangles) layer correctly over content
- [ ] All components use Tailwind tokens from config

---

## Phase 2: Hero Section & Navigation

**Status:** ⬜ Not Started  
**Dependency:** Phase 1 ✅  
**Priority:** 🔴 Critical  
**Complexity:** Medium  
**Duration:** 1–2 hours

### What's Included

- Navigation header (logo, menu, language toggle ES|EN, Login/Join buttons)
- Hero section:
  - Oversized headline (72px Cormorant)
  - Naranja background with geometric accent shapes
  - Tagline + supporting text
  - CTA button with arrow accent
  - Background imagery or tilted producer photo (inspiration pattern)
- Mobile responsiveness (mobile menu toggle)

### Deliverables

- ✅ `src/components/sections/Navigation.tsx`
- ✅ `src/components/sections/Hero.tsx`
- ✅ Mobile nav toggle with smooth animation
- ✅ Bilingual content structure (ES/EN via next-intl)

### Files to Touch

```
src/components/sections/Navigation.tsx
src/components/sections/Hero.tsx
src/app/page.tsx (main layout)
src/app/en/page.tsx (EN version)
messages/es.json
messages/en.json
```

### Acceptance Criteria

- [ ] Hero headline renders at 72px with Cormorant Garamond
- [ ] Navigation menu toggles on mobile (< 640px breakpoint)
- [ ] Language selector (ES|EN) works and updates content
- [ ] CTA button directs to `/apply` with arrow accent
- [ ] Naranja background with 2 geometric accent shapes layered
- [ ] Hero section is 100vh or min-height appropriate for content
- [ ] Both ES and EN pages load correctly

---

## Phase 3: Producer Showcase & Featured Artisans

**Status:** ⬜ Not Started  
**Dependency:** Phase 1 ✅  
**Priority:** 🔴 Critical  
**Complexity:** Medium  
**Duration:** 1–2 hours

### What's Included

- "Featured Artisans" section:
  - Grid layout (3–4 columns, responsive)
  - Producer cards with:
    - Image (tilted 2–3°, Selva border frame)
    - Name + craft discipline (e.g., "Maria — Ceramics")
    - Short bio or specialization (1 line max)
    - Subtle Naranja accent shape (corner or overlay)
  - "Explore All Producers" CTA button
- Alternating background colors (Naranja, Linho, Selva per section)
- Whitespace and spacing from design inspiration

### Deliverables

- ✅ `src/components/sections/ProducerShowcase.tsx`
- ✅ `src/components/ProducerCard.tsx`
- ✅ Mock producer data or integration point for Airtable
- ✅ Responsive grid layout (mobile: 1 col, tablet: 2 col, desktop: 3–4 col)

### Files to Touch

```
src/components/sections/ProducerShowcase.tsx
src/components/ProducerCard.tsx
src/lib/types.ts (Producer type)
src/lib/airtable.ts (or data stub)
```

### Acceptance Criteria

- [ ] Producer cards render in responsive grid (1–3–4 columns)
- [ ] Each card includes image, name, discipline, and accent shape
- [ ] Cards are rotated -2° to -3° (CSS transform)
- [ ] Selva border frames around images
- [ ] Naranja geometric accent in corner or as overlay
- [ ] Grid has generous whitespace between cards (2rem+ gap)
- [ ] "Explore All Producers" button links to producers page (Phase 5)
- [ ] Section background alternates (Naranja/Linho/Selva)

---

## Phase 4: Application Form & Validation

**Status:** ⬜ Not Started  
**Dependency:** Phase 1 ✅  
**Priority:** 🔴 Critical  
**Complexity:** High  
**Duration:** 2–3 hours

### What's Included

- Producer application form (`/apply` page):
  - Form fields (name, email, craft discipline, bio, photos, etc. per TRD Section 3)
  - React Hook Form + Zod validation (client + server)
  - Honeypot field `_gotcha` (anti-spam, off-screen)
  - Rate limiting (3 requests/hour per IP via @upstash/ratelimit or in-memory)
  - Form state management (errors, success, loading)
  - API endpoint `/api/producers/apply` (POST)
  - Airtable integration (send to `Productores_Solicitudes` table)
  - Resend email integration:
    - Producer confirmation email
    - Internal notification email to admin
- Success page / confirmation message
- Error handling & retries (exponential backoff for 429)

### Deliverables

- ✅ `src/app/apply/page.tsx`
- ✅ `src/app/api/producers/apply/route.ts`
- ✅ `src/components/sections/ProducerForm.tsx`
- ✅ `src/lib/validation/producer.ts` (Zod schema)
- ✅ `src/lib/airtable.ts` (Airtable client + rate limit logic)
- ✅ `src/lib/email.ts` (Resend templates)
- ✅ `.env.example` updated with Airtable + Resend keys

### Files to Touch

```
src/app/apply/page.tsx
src/app/api/producers/apply/route.ts
src/components/sections/ProducerForm.tsx
src/lib/validation/producer.ts
src/lib/airtable.ts
src/lib/email.ts
src/lib/rateLimit.ts
.env.example
```

### Acceptance Criteria

- [ ] Form renders with all fields from TRD Section 3
- [ ] Client-side validation works (Zod + React Hook Form)
- [ ] Honeypot field is hidden (off-screen, not display:none)
- [ ] Rate limiting enforced (3 requests/hour per IP, returns 429)
- [ ] Form submission sends data to Airtable `Productores_Solicitudes` table
- [ ] Producer receives confirmation email via Resend
- [ ] Admin receives notification email
- [ ] Success page displays after submission
- [ ] Error handling for Airtable 429 (retry with backoff)
- [ ] Server-side validation matches client (Zod)
- [ ] No hardcoded secrets (all in .env)

---

## Phase 5: Additional Pages & Sections

**Status:** ⬜ Not Started  
**Dependency:** Phase 2, Phase 3 ✅  
**Priority:** 🟡 High  
**Complexity:** Medium  
**Duration:** 2–3 hours

### What's Included

- About page (`/about`, `/en/about`):
  - Mission statement + brand story
  - Team section (founder bios, photos grid)
  - Why sustainable artisans matter
- FAQ page (`/faq`, `/en/faq`):
  - Accordion component (expand/collapse)
  - 8–10 common questions
  - GA4 event on expand (`faq_expand`)
- Producers page (listing all producers, filterable by craft):
  - Grid or list view of all producers
  - Filter by discipline
  - Search functionality
- Testimonials section (if data available):
  - Quote cards with author photo + name
- Newsletter signup section:
  - Email input + subscribe button
  - Integration with Resend / mailing list
- Footer:
  - Links, legal, social media

### Deliverables

- ✅ `src/app/about/page.tsx`, `src/app/en/about/page.tsx`
- ✅ `src/app/faq/page.tsx`, `src/app/en/faq/page.tsx`
- ✅ `src/app/producers/page.tsx`, `src/app/en/producers/page.tsx`
- ✅ `src/components/sections/FAQ.tsx`
- ✅ `src/components/sections/Footer.tsx`
- ✅ `src/components/Accordion.tsx`

### Files to Touch

```
src/app/about/page.tsx
src/app/en/about/page.tsx
src/app/faq/page.tsx
src/app/en/faq/page.tsx
src/app/producers/page.tsx
src/app/en/producers/page.tsx
src/components/sections/FAQ.tsx
src/components/sections/Footer.tsx
src/components/Accordion.tsx
messages/es.json
messages/en.json
```

### Acceptance Criteria

- [ ] About page renders with mission, story, team sections
- [ ] FAQ page has accordion component working (expand/collapse)
- [ ] GA4 event fired on FAQ expand (`faq_expand`)
- [ ] Producers page lists all producers from Airtable
- [ ] Producers page has filter by craft discipline
- [ ] Newsletter signup sends email to mailing list
- [ ] Footer includes links, legal (privacy, terms), social media
- [ ] All pages bilingual (ES/EN)
- [ ] Mobile responsive

---

## Phase 6: SEO, Analytics & Final Polish

**Status:** ⬜ Not Started  
**Dependency:** All phases ✅  
**Priority:** 🟡 High  
**Complexity:** Medium  
**Duration:** 1–2 hours

### What's Included

- SEO & OG tags:
  - Page titles, meta descriptions (unique per page)
  - Open Graph images (1200×630px) per page
  - Schema markup (Organization, FAQPage, WebSite, BreadcrumbList)
- GA4 setup:
  - Event tracking (`form_start`, `form_submit`, `form_success`, `form_error`, `cta_click`, `language_switch`, `faq_expand`)
  - Custom dimensions (language, producer_discipline)
- Google Search Console:
  - Verification meta tag
  - `robots.txt` and `sitemap.xml` (autogenerated via `next-sitemap` or manual)
- Security headers (CSP, X-Frame-Options, etc.)
- Performance optimizations:
  - Image lazy loading + next/image
  - CSS/JS minification (automatic via Next.js)
  - Lighthouse audit (target ≥90)
- Cookie banner (GDPR compliance)
- Accessibility audit (WCAG 2.1 AA):
  - Contrast checks (4.5:1 minimum)
  - Keyboard navigation
  - ARIA labels
  - Skip link
- `.env.example` finalized
- Deployment to Vercel (staging + production)

### Deliverables

- ✅ `next.config.js` with security headers + CSP
- ✅ `src/app/layout.tsx` with GA4 script + OG tags
- ✅ Schema markup JSON-LD in components
- ✅ `public/robots.txt`
- ✅ `public/sitemap.xml` (or generation script)
- ✅ `src/components/CookieBanner.tsx`
- ✅ Lighthouse audit report (target ≥90)
- ✅ WCAG audit checklist completed

### Files to Touch

```
next.config.js
src/app/layout.tsx
src/components/SEOHead.tsx (or per-page OG tags)
src/components/CookieBanner.tsx
src/lib/schema.ts (schema markup helpers)
public/robots.txt
public/sitemap.xml (or script to generate)
.env.example
```

### Acceptance Criteria

- [ ] Every page has unique title, meta description, OG image
- [ ] Schema markup (Organization, FAQPage, etc.) validates via schema.org
- [ ] GA4 events fire correctly on form submit, CTA click, language switch, FAQ expand
- [ ] Google Search Console verification meta tag present
- [ ] Security headers present (CSP, X-Frame-Options, etc.)
- [ ] robots.txt and sitemap.xml accessible
- [ ] Lighthouse score ≥90 (Performance, SEO, Accessibility)
- [ ] Cookie banner displays and persists consent
- [ ] All links keyboard-navigable
- [ ] Contrast ratios ≥4.5:1 (WCAG AA)
- [ ] Skip link present in HTML (first element in body)
- [ ] `.env.example` documented with all required keys
- [ ] Deployable to Vercel (staging URL + production URL)

---

## Implementation Order

```
Phase 1 (Design System)
    ↓
Phase 2 (Hero + Nav)
    ↓
Phase 3 (Producer Showcase)
    ↓
Phase 4 (Application Form)
    ↓
Phase 5 (Additional Pages)
    ↓
Phase 6 (SEO + Analytics + Polish)
    ↓
🚀 Launch
```

**Each phase uses the Feature Factory workflow:**

1. Run Researcher → explore current codebase
2. Write Story → define user story & acceptance criteria
3. Write Brief → technical specification
4. Frontend Builder → implement components
5. Test Verifier → write E2E + unit tests
6. Validator → compare vs. approved brief

---

## Notes

- **Design Inspiration:** All phases incorporate patterns from FOLLOW.ART screenshots:
  - Bold, oversized typography (72px+ headlines)
  - High-contrast color blocking (Naranja backgrounds)
  - Geometric accent shapes (circles, rectangles)
  - Tilted/rotated cards for dynamism
  - Generous whitespace & breathing room
  - Simple, high-contrast CTAs

- **Color Palette (from TRD):**
  - **Naranja:** Primary orange (#F4A460 equivalent)
  - **Selva:** Forest green (#2D5A3D equivalent)
  - **Linho:** Natural beige (#E8D7C3 equivalent)
  - **Noche:** Dark (#1A1A1A equivalent)
  - **Muted:** Gray for secondary text
  - **Rule:** Subtle borders

- **Typography:**
  - **Display:** Cormorant Garamond (serif, elegant)
  - **Body:** Jost (sans-serif, modern)

- **Responsive Breakpoints:**
  - Mobile: < 640px
  - Tablet: 768px–1024px
  - Desktop: > 1024px

---

## Checklist: Ready for Phase 1?

- [ ] Read this document
- [ ] Confirm Phase 1 scope with team
- [ ] Activate Feature Factory skill
- [ ] Run Researcher agent (Phase 1)
- [ ] Proceed to Story Writer & implementation

Let's start with **Phase 1: Design System & Component Foundation**!
