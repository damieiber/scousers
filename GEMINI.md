# Scousers — AI-Powered Fan Hub

AI-curated football news platform for Liverpool and Everton fans. Bilingual (English default, Spanish), oriented towards English-speaking supporters worldwide.

Package name: `fannews`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (Turbopack) |
| Language | TypeScript |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini AI (`@google/generative-ai`, `@google/genai`) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Auth | next-auth v5 beta 30 (Google OAuth + Credentials) |
| Validation | Zod v4 |
| Forms | React Hook Form + `@hookform/resolvers` |
| Scraping | Cheerio (devDep) |
| Sanitisation | isomorphic-dompurify |
| Icons | Lucide React + Radix Icons |
| Theming | next-themes (light/dark) |
| Deploy | Vercel |

---

## Project Structure

```
app/            → App Router: pages & API routes
components/     → React components organised by feature
lib/            → Core logic: models, services, AI, scraping, DB, i18n, types
scripts/        → Seed, ingest, reset, test scripts
public/         → Static assets & guides
docs/           → Technical documentation
```

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing / Home |
| `/feed` | AI-curated news feed |
| `/news/[id]` | Individual news detail |
| `/match-center` | Next match dashboard (mock data) |
| `/squad` | Squad metrics & management (mock data) |
| `/standings` | Multi-competition standings (mock data) |
| `/efemerides` | Team ephemerides |
| `/profile` | User profile |
| `/login` | Login page |
| `/auth/[...nextauth]` | NextAuth handler |

---

## API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/feed` | Returns curated article feed |
| `/api/ingest` | News ingestion (Vercel Cron: daily 13:00 UTC) |
| `/api/check-quarantined` | Checks quarantined sources (Vercel Cron: daily 02:00 UTC) |
| `/api/efemerides` | Ephemerides data |
| `/api/cleanup` | Purges old articles |
| `/api/auth/[...nextauth]` | NextAuth endpoints |
| `/api/profile` | User profile updates |
| `/api/team/[...params]` | Team data |

---

## MongoDB Models (Mongoose)

All collection names are **PascalCase plural**.

| Model | Collection | Key Fields |
|-------|-----------|------------|
| `Article` | `Articles` | `title`, `titleEn`, `summary`, `summaryEn`, `shortSummary`, `shortSummaryEn`, `imageUrl`, `teamId` (ObjectId → Team), `publishedAt`, `embedding` (number[]), `rivalSentiment` (POSITIVE/NEUTRAL/NEGATIVE), `originalLinks[]` |
| `Team` | `Teams` | `key` (unique), `name`, `sportId`, `isAvailable`, `rivalTeamId` (ObjectId → Team), `primaryColor`, `secondaryColor`, `logoUrl` |
| `User` | `Users` | `email` (unique), `name`, `language` ('es'\|'en', default 'en'), `primaryTeamId`, `secondaryTeamIds[]`, `subscriptionStatus`, `roles[]` |
| `Source` | `Sources` | `name`, `url`, `teamId`, `keywords[]`, `contentSelector`, `articleLinkSelector`, `status` (active/quarantined), `consecutiveFailures`, `quarantineThreshold` |
| `Efemeris` | `Efemerides` | `date`, `year`, `title`, `description`, `type` (match/birth/debut/other), `teamId` |
| `Feature` | `Features` | `key` (unique), `name`, `description`, `isActive` |
| `SubscriptionFeature` | `SubscriptionFeatures` | `subscriptionStatus`, `featureKey` |
| `Rivalry` | `Rivalries` | `teamId`, `rivalTeamId`, `rank` |

---

## Service Layers

### AI Service — `lib/aiService.ts`

- `generateContentWithGemini(prompt, json?)` — Gemini wrapper with retry (max 5) and rate limiting (10s between requests)
- `clusterArticlesByTheme(articles)` — Groups articles by theme using AI
- `extractRelevantLinksFromHtml(html, teamName)` — Extracts relevant links from source page HTML
- `filterRelevantArticles(articles, teamName, keywords)` — Filters articles by team relevance
- `summarizeThemedArticles(theme, articles)` — Generates short/full bilingual summaries (ES/EN)
- `generateEmbedding(text)` — Generates embeddings with Google's embedding model
- `classifyRivalSentiment(title, summary, rivalTeamName)` — Classifies rival sentiment (POSITIVE/NEUTRAL/NEGATIVE)

### Scraping Service — `lib/scrapingService.ts`

- `getLinksFromSource(source, teamKey, limit?)` — Gets links from a source using AI to filter HTML
- `getContentFromUrl(articleUrl)` — Scrapes article content (title, text, og:image)

### Data Access Layer — `lib/db.ts`

Key functions: `getActiveSources()`, `saveThemedArticle()`, `findSimilarTheme()` (cosine similarity, threshold 0.85), `handleSourceSuccess()`, `handleSourceFailure()`, `getQuarantinedSources()`, `reactivateSource()`, `purgeOldArticles(daysOld)`, `getAllTeams()`, `getAvailableTeams()`, `updateUserProfile()`, `isUserPremium()`, `getAllFeatures()`, `getSubscriptionFeatures()`, `getUserFeatures()`, `hasFeature()`, `getTeamRivalries()`, `getRivalTeamIds()`, `updateArticleSentiment()`, `getThemedArticleWithOriginals()`.

### Mock Services — `lib/services/`

Currently `useMock = true` in `lib/services/index.ts`. Three interfaces with mock implementations:

- `IMatchAnalysisService` — Match preview, tactical data (Liverpool vs Everton mock)
- `ISquadService` — Player form, squad load, transfers, loan watch, youth prospect
- `IClubService` — Match odds, competition standings (Premier League, Champions League)

To connect real APIs, set `useMock = false`.

---

## News Ingestion Pipeline

Runs via the `/api/ingest` endpoint (Vercel Cron daily at 13:00 UTC). The strategy is:

1. Scrape list of links with titles from source page
2. AI pre-filters links by title (`extractRelevantLinksFromHtml`)
3. Scrape full content of only relevant links
4. `filterRelevantArticles()` filters by team relevance
5. `clusterArticlesByTheme()` groups articles by theme
6. `summarizeThemedArticles()` generates bilingual summaries
7. `generateEmbedding()` creates embedding for theme
8. `findSimilarTheme()` detects duplicates via cosine similarity (threshold: 0.85)
9. `saveThemedArticle()` persists to MongoDB

Script implementation: `scripts/cluster-and-ingest.ts`.

---

## Authentication

- **Providers:** Google OAuth + Credentials (email/password)
- **Architecture:** Split into `auth.config.ts` (edge-compatible, no DB) + `auth.ts` (with DB access)
- **Middleware:** Protects `/dashboard` → redirects to `/login` if unauthenticated; redirects logged-in users away from `/login` to `/`
- **Session callback:** Enriches session with `primaryTeamId`, `subscriptionStatus`, `roles` from MongoDB

---

## Environment Variables

Stored in `.env.local` (git-ignored). Reference: `env.example`.

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GOOGLE_AI_API_KEY` | Gemini AI (content generation) |
| `GOOGLE_AI_API_KEY_EMBEDDINGS` | Gemini AI (embeddings) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | NextAuth secret |
| `NEXTAUTH_URL` | NextAuth base URL |

---

## Internationalisation (i18n)

- **Languages:** English (default) and Spanish, both fully supported
- **Implementation:** Dictionaries in `lib/i18n/dictionaries.ts`
- **Provider:** `LanguageProvider` in root layout (default: `'en'`)
- **User preference:** Stored in user profile (`language: 'es' | 'en'`, default `'en'`)
- **Bilingual articles:** Fields `title`/`titleEn`, `summary`/`summaryEn`, `shortSummary`/`shortSummaryEn`

---

## Theming

- **Light/Dark mode:** via `next-themes` (`ThemeProvider`)
- **Team colours:** `TeamThemeProvider` applies primary/secondary colours from the user's team
- **Switcher component:** `ThemeSwitcher.tsx`
- **Provider chain:** `SessionProvider → ThemeProvider → TeamThemeProvider → LanguageProvider`

---

## Key Components

| Group | Components |
|-------|-----------|
| Layout | `Header`, `Footer`, `ThemeProvider`, `UserNav` |
| Auth | `SessionProvider`, login page |
| Cards | News cards |
| Club | Club-related components |
| Squad | 5 components: form meter, load, transfers, loans, youth |
| Tactics | 5 components: attack zones, set pieces, risk index, H2H, odds |
| Providers | `LanguageProvider`, `TeamThemeProvider` |
| UI | 13 shadcn/ui components (Dialog, Select, Popover, Avatar, etc.) |

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build with Turbopack |
| `seed-teams-sources.ts` | Seeds Liverpool/Everton teams and their news sources |
| `seed-efemerides.ts` | Seeds team ephemerides |
| `seed-features.ts` | Seeds system features |
| `reset_db.ts` | Resets the database |
| `setup-mongo-schema.js` | Sets up MongoDB schema validation |
| `mongo_shell_init.js` | Full mongosh init: schema + seed (Teams, Sources, Features, SubscriptionFeatures) |
| `test-gemini.js` | Tests Gemini AI connection |
| `test-gemini-models.ts` | Tests available Gemini models |
| `list_models.js` | Lists available AI models |

---

## Vercel Configuration

- **Crons:**
  - `/api/ingest` → daily at 13:00 UTC
  - `/api/check-quarantined` → daily at 02:00 UTC
- **Remote images:** Enabled for all domains (`**`)

---

## Coding Rules & Conventions

- **DO NOT** use `npm`, `npx`, or `git` commands — the user handles package management and version control
- **AI prompts:** Must be plain strings, never JSON-formatted. The AI response format can be JSON when appropriate
- **Code language:** Variable/function names in English
- **MongoDB collections:** PascalCase plural (`Articles`, `Teams`, `Users`, `Sources`)
- **Properties:** Always use `teamId` (camelCase), NEVER `team_id` (snake_case), to align with Mongoose schemas
- **ESLint:** Configured with `eslint-config-next`
- **TypeScript:** Strict mode via `tsconfig.json` for app, `tsconfig.scripts.json` for scripts

---

## News Sources

**Liverpool:**
- Liverpool FC Official — `liverpoolfc.com/news`
- Liverpool Echo — `liverpoolecho.co.uk/all-about/liverpool-fc`
- This Is Anfield — `thisisanfield.com`
- Empire of the Kop — `empireofthekop.com`
- Anfield Watch — `anfieldwatch.co.uk`
- Rousing The Kop — `rousingthekop.com`

**Everton:**
- Everton FC Official — `evertonfc.com/news`
- Liverpool Echo (Everton) — `liverpoolecho.co.uk/all-about/everton-fc`
- ToffeeWeb — `toffeeweb.com`
- GrandOldTeam — `grandoldteam.com/news`
- Royal Blue Mersey — `royalbluemersey.sbnation.com`
- Goodison News — `goodisonnews.com`

---

## Feature State

| Feature | Status |
|---------|--------|
| AI news feed & ingestion | ✅ Production |
| Authentication (Google + Credentials) | ✅ Production |
| Ephemerides | ✅ Production |
| User profile & preferences | ✅ Production |
| Match Center | 🟡 Mock data |
| Squad management | 🟡 Mock data |
| Standings | 🟡 Mock data |
| Odds | 🟡 Mock data |

Mock → real: change `useMock = false` in `lib/services/index.ts`.

---

## Subscriptions & Roles

- **Subscription tiers:** `free`, `standard`, `plus`, `premium`, `trial`
- **User roles:** Array of strings, default `['user']`
- **Feature gating:** `SubscriptionFeature` model maps features to subscription levels
- **Rival Mode:** AI classifies rival sentiment on articles (POSITIVE/NEUTRAL/NEGATIVE)

---

## Technical Details

- **MongoDB connection:** Globally cached singleton for HMR in development (`lib/mongodb.ts`)
- **AI rate limiting:** 10s between Gemini requests, max 5 retries with 10s delay
- **Duplicate detection:** Cosine similarity threshold of 0.85 on article embeddings
- **Source quarantine:** Sources are quarantined after consecutive failures (per-source `quarantineThreshold`)
- **Article purge:** `purgeOldArticles(daysOld)` available for cleanup
