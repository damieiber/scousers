# FanNews - Project Documentation

> AI-Powered Fan Hub: Una plataforma que resuelve la sobrecarga de información para los fanáticos del deporte.

## Tabla de Contenidos

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Estado Actual del MVP](#estado-actual-del-mvp)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Arquitectura y Stack Tecnológico](#arquitectura-y-stack-tecnológico)
5. [Database Schema](#database-schema)
6. [Flujo de Ingesta de Noticias (AI-Driven)](#flujo-de-ingesta-de-noticias-ai-driven)
7. [Sistema de Autenticación y Perfiles](#sistema-de-autenticación-y-perfiles)
8. [Sistema de Suscripciones y Features](#sistema-de-suscripciones-y-features)
9. [Vercel Cron Jobs](#vercel-cron-jobs)
10. [Roadmap: Fase 2 (Premium)](#roadmap-fase-2-premium)
11. [Roadmap: Contenido Nuevo](#roadmap-contenido-nuevo)
12. [Notas Técnicas](#notas-técnicas)

---

## Resumen del Proyecto

**FanNews** es una aplicación Next.js que agrega y muestra noticias deportivas personalizadas. Utiliza IA para:
- Agregar noticias de múltiples fuentes
- Eliminar duplicados y agrupar por tema
- Generar resúmenes concisos en español
- Deduplicación semántica con embeddings

### Modelo de Negocio (Freemium)
- **Gratuito**: Feed básico con noticias resumidas, efemérides, experiencia para un equipo
- **Premium**: Modo Rival, personalización visual, multi-equipo, motor de preferencias explícitas

---

## Estado Actual del MVP

### ✅ Completado (Epic 1 & 2)

| Historia | Estado | Descripción |
|----------|--------|-------------|
| 1.1 Configuración Multi-equipo | ✅ | Tablas `teams`, `sports`, relaciones con `team_id` |
| 1.2 Ingesta + Health Management | ✅ | Scraping, cuarentena de fuentes, 24 migraciones, scripts optimizados |
| 1.3 Feed Básico | ✅ | Página principal, cards, Suspense boundaries para build |
| 1.4 Resúmenes y Clustering IA | ✅ | Gemini API, deduplicación vectoria con pgvector |
| 1.5 Engagement Diario | ✅ | Efemérides (JSON + tabla DB), integration en UI |
| F2-1 Autenticación | ✅ | Email/Password + Google OAuth (corregido UserNav) |
| F2-1 Perfil de Usuario | ✅ | Edición de perfil, Avatar, manejo de estado de sesión |
| F2-1 Sistema de Suscripciones | ✅ | 5 tiers, lógica de features en backend y frontend |
| F2-2 Modo Rival (Base) | ✅ | Toggle en Header, filtro por query param, indicación visual |

### 🚧 En Progreso / Pendiente (Fase 2)

| Historia | Estado | Descripción |
|----------|--------|-------------|
| F2-3 Personalización Visual | ❌ | Teams Assets pendientes (theme switcher funciona global) |
| F2-4 Motor Explícito | ❌ | Feed ponderado por preferencias (likes/dislikes) |
| F2-5 Multi-equipo UI | 🔄 | Backend listo, UI de selección secundaria disabled |
| F2-6 Engagement IA | ❌ | Generación automática de contenido diario |

---

## Estructura del Proyecto

```
app/
├── api/
│   ├── feed/route.ts          # GET feed (filtra por team_id del usuario)
│   ├── ingest/route.ts        # POST trigger ingesta (CRON)
│   ├── cleanup/route.ts       # POST purge artículos >30 días
│   ├── check-quarantined/     # POST reactivar fuentes
│   └── efemerides/route.ts    # GET efemérides por fecha
├── auth/
│   ├── auth-code-error/       # Página error OAuth
│   └── callback/              # OAuth callback handler
├── efemerides/                # Navegación de efemérides
├── feed/                      # Feed completo de noticias
├── login/                     # Página de login
├── news/[id]/                 # Detalle de noticia
├── profile/                   # Página de perfil usuario
├── match-center/              # [WIP] Centro de partidos
├── squad/                     # [WIP] Plantel
└── standings/                 # [WIP] Tabla de posiciones

components/
├── auth/AuthForm.tsx          # Login/Register form
├── cards/
│   ├── NewsCard.tsx           # Card de noticia
│   └── EfemeridesCard.tsx     # Card de efeméride
├── layout/
│   ├── Header.tsx             # Header con nav
│   ├── ThemeProvider.tsx      # next-themes provider
│   └── UserNav.tsx            # Avatar/Login button
├── profile/
│   ├── ProfileForm.tsx        # Form de perfil completo
│   └── TeamSelector.tsx       # Selector de equipo
├── club/                      # Componentes de club
├── squad/                     # Componentes de plantel
├── tactics/                   # Componentes tácticos
└── ui/                        # shadcn/ui primitives

lib/
├── aiService.ts               # Gemini API (summarize, cluster, filter)
├── scrapingService.ts         # Cheerio + fetch para scraping
├── supabaseService.ts         # Todas las queries a Supabase
├── types.ts                   # TypeScript types
├── config.ts                  # Site config
└── services/                  # Servicios adicionales

scripts/
└── cluster-and-ingest.ts      # Script principal de ingesta

supabase/migrations/           # 24 archivos de migración
utils/supabase/middleware.ts   # Session refresh middleware
```

---

## Arquitectura y Stack Tecnológico

| Categoría | Tecnología | Justificación |
|-----------|------------|---------------|
| Framework | Next.js 15 | Full-stack, App Router, SSR/SSG |
| Lenguaje | TypeScript | Tipado estático, calidad de código |
| Base de Datos | PostgreSQL + Supabase | pgvector para embeddings |
| Auth | Supabase Auth | Email + OAuth integrado |
| UI | Tailwind + shadcn/ui | Componentes accesibles |
| Hosting | Vercel | Preview deployments, cron jobs |
| IA | Google Gemini | Resúmenes, clustering, filtrado |

---

## Database Schema

### Tablas Principales

```sql
-- Equipos y deportes
teams (id, key, sport_id, is_available, created_at, updated_at)
sports (id, key)

-- Artículos temáticos (agrupados por IA)
themed_articles (
  id, title, summary, short_summary,
  team_id, published_at, embedding, image_url,
  created_at, updated_at
)

-- Links a artículos originales
original_article_links (
  id, themed_article_id, url, source_name, title
)

-- Fuentes de noticias
sources (
  id, name, url, team_id, logo_url,
  content_selector, article_link_selector,
  status ('active'|'quarantined'),
  consecutive_failures, quarantine_threshold
)

-- Usuarios
user_profiles (
  id, email, full_name, avatar_url,
  primary_team_id, secondary_team_ids[],
  subscription_status, subscription_expires_at,
  preferences JSONB, created_at, updated_at
)

-- Features dinámicas
features (id, key, name, description, is_active)
subscription_features (subscription_status, feature_id)

-- Efemérides
efemerides (id, date, year, title, description, type, team_id, importance)
```

### Función RPC para Búsqueda Semántica

```sql
find_similar_theme(query_embedding, p_team_id, similarity_threshold)
  RETURNS (id, title, published_at, similarity)
```

---

## Flujo de Ingesta de Noticias (AI-Driven)

```
1. Fetch Active Sources (supabaseService)
      ↓
2. Para cada equipo:
   a. Scrape links de cada fuente
   b. AI filtra links relevantes (Gemini)
   c. Scrape contenido de links filtrados
      ↓
3. AI Clustering por tema
   - Genera título, resumen, shortSummary
   - Selecciona imagen (evita logos)
      ↓
4. Deduplicación Semántica
   - Genera embedding del tema
   - Busca tema similar (threshold 0.8, <3 días)
   - Si existe: merge artículos + actualiza
   - Si no: crea nuevo themed_article
      ↓
5. Health Management
   - Éxito: reset consecutive_failures
   - Fallo: increment + quarantine si >= threshold
```

---

## Sistema de Autenticación y Perfiles

### Flujo de Auth
1. Usuario accede a `/login`
2. `AuthForm.tsx` permite email/password o Google OAuth
3. `middleware.ts` → `utils/supabase/middleware.ts` refresh token
4. Callback OAuth → `/auth/callback` → redirect home
5. Errores → `/auth/auth-code-error`

### Perfil de Usuario
- `ProfileForm.tsx` muestra:
  - Datos personales (nombre, email readonly)
  - Plan de suscripción (badge con color)
  - Features activas del plan
  - Selector de equipo principal
  - Equipos secundarios (disabled, premium only)

---

## Sistema de Suscripciones y Features

### Tiers de Suscripción
| Tier | Descripción |
|------|-------------|
| `free` | Básico, sin expiración |
| `standard` | Funciones básicas premium |
| `plus` | Funciones intermedias |
| `premium` | Todas las features |
| `trial` | Prueba con expiración |

### Verificación de Features
```typescript
// En código
const isPremium = await isUserPremium(userId);
const hasSecondaryTeams = await hasFeature(userId, 'secondary_teams');
const userFeatures = await getUserFeatures(userId);
```

---

## Vercel Cron Jobs

Configuración en `vercel.json`:

| Endpoint | Horario | Propósito |
|----------|---------|-----------|
| `/api/ingest` | 13:00 diario | Ingesta completa de noticias |
| `/api/check-quarantined` | 02:00 diario | Reactivar fuentes recuperadas |

**Nota**: Plan Hobby limita a 1 ejecución/día por job.

---

## Roadmap: Fase 2 (Premium)

### F2-2: Modo Rival Automático
- Tabla `rivalries (team_id, rival_team_id, rank)`
- IA clasifica noticias: NEGATIVA/NEUTRA/POSITIVA
- Feed filtrado solo rivales, ordenado por sentimiento

### F2-3: Personalización Visual
- Tabla `teams_assets (primary_color, secondary_color, logo_url, banner_url)`
- IA Asset Manager para actualizar assets
- React Context aplica tema según equipo

### F2-4: Motor de Personalización Explícita
- Tabla `user_preferences (category_id, weight)`
- IA categoriza noticias automáticamente
- Feed ponderado por preferencias

### F2-5: Multi-equipo Premium
- `secondary_team_ids[]` ya en DB
- Feed combina todos los equipos
- Filtro rápido por equipo

### F2-6: Engagement IA Diario
- Tabla `daily_content (team_id, date, type, content)`
- IA genera efemérides automáticamente
- Foto del día desde redes oficiales

---

## Roadmap: Contenido Nuevo

De `Nuevo contenido.docx.txt`:

| # | Feature | Endpoint | Estado |
|---|---------|----------|--------|
| 1 | Tablero táctico | `/api/team/tactics` | ❌ |
| 2 | Eficacia balón parado | `/api/team/setpieces` | ❌ |
| 3 | Índice riesgo partido | `/api/match/risk` | ❌ |
| 4 | H2H compacto | `/api/match/h2h` | ❌ |
| 5 | Formómetro jugadores | `/api/team/top-form` | ❌ |
| 6 | Mapa minutos/carga | `/api/team/load-map` | ❌ |
| 7 | Impacto mercado | `/api/team/transfer-impact` | ❌ |
| 8 | Loan Watch | `/api/team/loans` | ❌ |
| 9 | Cantera/Reserva | `/api/team/youth-highlight` | ❌ |
| 10 | Previa partido | `/api/match/preview` | ❌ |
| 11 | Odds informativo | `/api/match/odds-top` | ❌ |
| 12 | Tabla posiciones | `/api/team/standings` | 🔄 WIP |

**Fuentes de datos sugeridas**: API-Football, TheOddsAPI, OpenWeather

---

## Notas Técnicas

### Module Resolution
El proyecto usa CommonJS para compatibilidad entre Next.js y scripts:
- Sin `"type": "module"` en `package.json`
- `tsconfig.scripts.json` usa `module: CommonJS`
- Imports sin extensión en `lib/` y `scripts/`

### User Rules
- ❌ No usar `npm`, `npx`, `git` - el usuario maneja esto
- ❌ No formatear prompts de IA como JSON string
- ✅ Respuestas de IA pueden ser JSON si es apropiado

### Pipeline de Sanitización
Todas las respuestas de IA pasan por sanitización antes de guardarse:
- DOMPurify para eliminar XSS
- Validación de formato JSON
- Retry mechanism para estabilidad API

### Deduplicación Semántica
- Threshold: 0.8 (agresivo)
- Límite temporal: 3 días
- Si tema existe y es reciente: merge artículos + update summary
- Si tema es viejo (>3 días): crear nuevo tema