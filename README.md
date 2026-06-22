# G·Artisans — Landing Page

Sustainable artisan marketplace landing page. Phase 1 focused on capturing 50 founding producers.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
open http://localhost:3000
```

## Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5+
- **Styles:** Tailwind CSS 3
- **Data:** Airtable REST API
- **Email:** Resend
- **i18n:** next-intl (ES/EN)
- **Analytics:** Google Analytics 4
- **Hosting:** Vercel (CDG1 — Europe)

## Project Structure

```
g-artisans/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Homepage
│   │   ├── about/
│   │   ├── artisans/
│   │   ├── marketplace/
│   │   ├── apply/            # Producer application form
│   │   ├── contact/
│   │   ├── privacidad/
│   │   ├── aviso-legal/
│   │   └── cookies/
│   ├── api/
│   │   ├── apply/route.ts
│   │   ├── contact/route.ts
│   │   ├── spots/route.ts
│   │   └── notify/route.ts
│   └── globals.css
├── components/
│   ├── ui/
│   ├── sections/
│   ├── forms/
│   └── layout/
├── messages/
│   ├── es.json
│   └── en.json
├── lib/
│   ├── airtable.ts
│   ├── resend.ts
│   ├── validations.ts
│   └── utils.ts
├── docs/
│   └── TRD.md               # Technical Requirements Document
├── CLAUDE.md                # Project instructions
├── i18n.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — Project guidelines, architecture rules, and development workflow
- **[docs/TRD.md](docs/TRD.md)** — Complete Technical Requirements Document (v1.1)

## Key Features

- ✅ Bilingual landing (ES/EN) with language selector
- ✅ Producer application form with validation (Zod)
- ✅ Airtable integration for data persistence
- ✅ Automated emails (Resend) — confirmations + internal notifications
- ✅ Available spots counter (API `/api/spots`)
- ✅ GDPR-compliant cookie banner
- ✅ Google Analytics 4 with custom events
- ✅ Security headers + rate limiting
- ✅ SEO optimized (sitemap, schema markup, Open Graph)
- ✅ Responsive design (mobile-first)
- ✅ WCAG 2.1 AA accessible

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

See `.env.example` for all required and optional variables.

## Development

### Run tests
```bash
pnpm test
```

### Type check
```bash
pnpm type-check
```

### Lint
```bash
pnpm lint
```

### Build for production
```bash
pnpm build
pnpm start
```

## Git Workflow

- `main` → Production (`https://g-artisans.com`)
- `staging` → Pre-production (`https://staging.g-artisans.com`)
- `feature/*` → Development (Vercel Preview)

**Rules:**
- No direct pushes to `main` or `staging`
- All changes via Pull Request (≥1 approval required)
- Tests must pass before merge
- Commit messages: `feat:`, `fix:`, `docs:`, `chore:` (English)

## Deployment

Hosted on **Vercel** with automatic deployments:
- Pushes to `main` → Production
- Pushes to `staging` → Staging
- PRs → Vercel Preview URLs

Environment variables configured in Vercel dashboard (Production, Preview, Development).

## Support & Documentation

For detailed specifications on every page, component, form field, API endpoint, color, font, and acceptance criterion, see **[docs/TRD.md](docs/TRD.md)**.

For project guidelines and development rules, see **[CLAUDE.md](CLAUDE.md)**.

---

**Client:** Alternative Green Energy Holdco S.L.  
**Version:** 1.0.0  
**Last updated:** June 2026
