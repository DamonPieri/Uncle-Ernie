# Uncle Ernie — Full Software Development Lifecycle Plan

## Context

Uncle Ernie is a greenfield mobile app (iOS + Android) that turns the NYC subway into a discovery mechanism. Users pick a subway line (or go fully random), get a random stop revealed via an animated mechanic, and then see things to do nearby — restaurants, bars, activities, and curated "hidden gems" that no generic API provides. The app's emotional core is serendipity: the subway as a way to experience New York you've never seen.

Platform: React Native + Expo (cross-platform, managed builds)
Team: Solo or small team (TBD)
Data: MTA GTFS (stops) + Google Places API + Yelp Fusion + hand-curated Uncle Ernie picks

---

## Phase 1: Discovery & Requirements

### User Personas
- **Adventurous Local** — NYC resident wanting to break out of routine on weekends
- **Visiting Friend** — Return visitor who wants local spots, not tourist traps
- **Bored Commuter** — Planning a detour or discovering something near a familiar stop

### MVP User Stories (Priority Order)
1. Select a subway line → get a random stop
2. Go fully random (any line, any stop)
3. See nearby restaurants, bars, activities, and hidden gems
4. View the stop on a map
5. Re-roll for a new stop
6. Save stops to a personal list
7. Filter results by category (food, bars, outdoor, etc.)
8. See curated "Uncle Ernie picks" — editorially selected, not just API results

### Out of Scope for MVP
Social features, real-time train arrivals, user-submitted content, offline mode, push notifications, web version.

### Competitive Gap
No app frames NYC discovery around the subway system. Yelp/Google Maps optimize for efficiency; Uncle Ernie optimizes for serendipity. The curated picks layer is the editorial moat.

---

## Phase 2: Design

### Brand Personality
- Voice: Warm, knowing, slightly irreverent. 40-year NYC resident who genuinely loves the city.
- Visual: Retro MTA transit aesthetic (1970s Helvetica signage) modernized — dark base UI, cream text, line-color accents that shift by selected line.
- Typography: Neue Haas Grotesk or Inter. Bold, poster-like.
- Key visual moment: The stop reveal animation. This is the signature experience.

### Information Architecture
```
Home / Line Selection
  ├── Line picker grid (27 MTA lines as colored circles)
  └── "Surprise me" button

Stop Reveal Screen
  ├── Split-flap animation → stop name revealed
  ├── Re-roll button
  └── "Let's go" → Explore

Explore Screen
  ├── Mapbox map (stop + nearby POIs)
  ├── Uncle Ernie Pick card (prominent)
  ├── Category filter strip
  └── Recommendation cards (scrollable)

Saved Stops
Onboarding (first launch only)
Settings (minimal)
```

### Reveal Animation Options (Prototype Both)
- **Option A (Recommended MVP)**: Split-flap departure board — characters flip through before landing on stop name. Iconic, legible, achievable with Reanimated 3 worklets.
- **Option B (Differentiator)**: Scratch card — user physically scratches to reveal stop beneath.

### Design Tooling
- Figma for all UI + design system
- Map design system tokens (`theme.ts`) directly from Figma variables before writing component code
- Mapbox Studio for custom dark map style

---

## Phase 3: Technical Architecture

### Full Stack

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native + Expo SDK 51+ | Cross-platform, OTA updates, managed builds |
| Language | TypeScript | Type safety across data models + API responses |
| Routing | Expo Router v3 | File-based, deep-link ready |
| State (client) | Zustand | Lightweight global state |
| State (server) | TanStack Query | Cache, loading/error, background refresh |
| Animations | Reanimated 3 | UI thread worklets for reveal animation |
| Maps | Mapbox (`@rnmapbox/maps`) | Full style control, custom NYC aesthetic |
| Backend/BaaS | Supabase | Auth, Postgres, Edge Functions, Storage |
| Subway data | MTA GTFS → pre-processed JSON | Free, official, normalized to stops per line |
| Places data | Google Places API (primary) | Comprehensive NYC POI coverage |
| Reviews | Yelp Fusion API (secondary) | Supplemental ratings signal |
| API proxy | Supabase Edge Functions | Server-side key security + caching |
| Analytics | PostHog | Event tracking, funnel + retention analysis |
| Error tracking | Sentry (Expo SDK) | Crash reporting |
| CI/CD | EAS Build + EAS Update | Managed builds, OTA JS updates |

### Supabase Schema

```sql
-- Pre-processed from MTA GTFS data
stops (stop_id PK, name, lat, lng, lines text[], borough, neighborhood)

-- Editorial curated content
uncle_ernie_picks (id PK, stop_id FK, title, description, category enum,
                   photo_url, published bool, created_at)

-- User data
user_saved_stops (id PK, user_id FK, stop_id FK, saved_at)
```

### API Architecture
**Never call Google Places or Yelp from the mobile client.** All external API calls route through Supabase Edge Functions with:
- Server-side API key storage
- 24-hour cache per (stop_id, category, date) to control costs
- Normalized response shape returned to client

### Riskiest Parts (Mitigate Early)
1. **API cost runaway** — Caching in Edge Functions must be implemented in Sprint 2, before mobile client integration
2. **Mapbox + Expo custom dev client** — Configure EAS Build with rnmapbox in Sprint 0. This requires a custom Expo Dev Client (not standard Expo Go). Block 1-2 days.
3. **Reveal animation quality** — The split-flap is the signature moment. Build it as an isolated component in Sprint 1. Give it 2-3 dedicated days.
4. **Curated content production** — 472 NYC stations, target 50-100 curated stops for launch. This is a parallel editorial workstream, not a sprint task.

---

## Phase 4: Development Sprints (2 weeks each)

### Sprint 0 — Foundation
- Expo + TypeScript + Expo Router initialized, EAS Build configured
- Supabase project: schema defined, `stops` table seeded from processed GTFS
- Mapbox SDK integrated via custom dev client (renders basic map)
- `theme.ts` design system established
- Sentry integrated
- ✅ Success: App runs on iOS + Android simulators with Mapbox map rendering

### Sprint 1 — Line Selection + Stop Reveal
- Home screen: line selector grid (27 lines, correct MTA colors)
- "Surprise me" button functional
- Stop randomization logic (from processed subway data)
- Stop Reveal screen: split-flap animation with Reanimated 3
- Re-roll functionality
- Zustand store: line, stop, navigation state
- ✅ Success: User can select line → see animation → get stop → re-roll

### Sprint 2 — Backend API Layer + Places Integration
- Supabase Edge Functions: Google Places proxy with cache
- Supabase Edge Functions: Yelp proxy with cache
- TanStack Query hooks for nearby places by stop lat/lng
- Explore screen: map + recommendation cards with real API data
- Category filter strip functional
- Error/loading states (real, not placeholder)
- ✅ Success: Real places appear for any stop. No API keys in client code.

### Sprint 3 — Uncle Ernie Picks + Explore Polish
- `uncle_ernie_picks` table wired to Explore screen
- Uncle Ernie Pick card: distinct visual treatment, appears first
- "Ernie hasn't been here yet" placeholder for uncurated stops
- Initial curated batch: minimum 20 stops (target 50)
- Mapbox custom style applied
- Haptic feedback on reveal, re-roll, save
- ✅ Success: Explore screen feels finished. One stop is end-to-end polished.

### Sprint 4 — Auth + Saved Stops
- Supabase Auth: Apple Sign-In (App Store required), Google Sign-In, magic link
- Optional auth: use app without sign-in, saving requires account
- Saved Stops screen: persists across sessions
- ✅ Success: Sign in → save stop → close app → reopen → stop still saved

### Sprint 5 — Onboarding + Polish + Performance
- Onboarding: 3-screen intro (first launch only)
- Location permission (optional, graceful degradation if denied)
- Performance: lazy loading, image optimization, bundle size audit
- Accessibility: AA contrast compliance, screen reader labels
- Empty states, error states
- App icon, splash screen configured
- ✅ Success: Cold start under 3 seconds on mid-range Android. Passes basic a11y audit.

### Sprint 6 — Beta Preparation
- Full QA: iPhone SE → iPhone 16 Pro, Pixel 7 baseline Android
- EAS Build production builds for both platforms
- TestFlight build distributed to 20-50 internal testers
- Play Store internal test track live
- Sentry + PostHog confirmed working in production builds
- Privacy policy linked in app
- ✅ Success: 20+ real users complete core loop without crash or blocking bug

---

## Phase 5: Testing Strategy

### Unit Tests (Jest + React Native Testing Library)
Test: stop randomization logic, category filter logic, Edge Function cache TTL, "is open now" business hours logic.
Skip: UI snapshots, Mapbox rendering, animation timing (brittle).

### E2E Tests (Detox)
Automate core flows:
1. Line select → reveal → explore loads with results
2. Save stop → navigate to saved → stop appears
3. Re-roll → new stop differs from previous
4. Category filter → list updates

Run against staging Supabase with mocked external API responses (no live Google Places calls in CI).

### User Testing
- Round 1 (Sprint 3-4): Guerrilla, 5-10 people, in-person, unguided
- Round 2 (Sprint 6): TestFlight cohort feedback via Typeform

### Beta Metrics (PostHog)
- Core loop completion rate (home → explore)
- Re-roll rate
- Save rate
- Day 7 retention

---

## Phase 6: Launch Plan

### App Store Metadata
- Name: "Uncle Ernie"
- Subtitle: "NYC Subway Explorer" (30 chars)
- Keywords: nyc, subway, explore, new york, restaurants, hidden gems, discovery
- Age rating: Likely 12+ (alcohol references in bar recommendations)
- Screenshots: Design in Figma showing reveal animation + explore screen — marketing material, not just app captures

### Launch Sequence
1. **Internal beta** (Week 1-2): Fix crashes only, no features
2. **Wider TestFlight** (Week 2-3): NYC-focused users via r/nyc, r/AskNYC, transit Discord servers
3. **Soft launch**: Submit to stores, monitor Sentry for >99% crash-free sessions before public announcement
4. **Hard launch**: Public announcement once stable + 100+ curated Uncle Ernie picks in database

### Pre-Launch Marketing (Organic First)
- Instagram documenting the content research process — "Uncle Ernie" visiting stops
- Outreach to NYC newsletters (Gothamist, Curbed NY, The Urbanist) for launch coverage
- No paid acquisition for MVP — validate retention before spending

---

## Phase 7: Post-Launch

### Q1 — Deepen Core
- Expand curated content to 200+ stops (ongoing editorial workstream)
- Borough filter on home screen
- "I'm near a stop" mode (detect nearest station)

### Q2 — Social Layer
- Share a stop (deep link + shareable card image)
- "Adventures" — personal map of stops visited

### Q3 — Intelligence Layer
- Preference learning ("I prefer outdoor activities")
- Time-aware suggestions (bars Friday night, coffee Sunday morning)
- Seasonal editorial picks

### Q4 — Platform Expansion
- Apple Watch complication
- Home screen widget
- Web companion (shareable stop pages → drives app downloads)

### Monetization (Post-Validation)
1. One-time purchase ("Buy Uncle Ernie a drink") — $2.99-4.99 — fits brand voice
2. Premium tier ($2.99/mo) — curated content depth, advanced filters, social features
3. Disclosed local business partnerships for Ernie's Picks
4. Never: intrusive ads (destroys brand credibility)

---

## Critical Files to Create First

| File | Purpose |
|---|---|
| `app.config.js` | Expo root config — Mapbox token injection, EAS build profiles, plugin list. Wrong here = cascading build failures. |
| `src/constants/theme.ts` | Design system tokens (line colors, typography, spacing). Single source of truth for all UI components. |
| `supabase/functions/places-search/index.ts` | Google Places proxy with caching. Highest-risk file — API costs and key exposure originate here. |
| `src/store/subway.ts` | Zustand store — selected line, current stop, saved stops. Interfaces ripple through every screen. |
| `scripts/process-gtfs.ts` | One-time GTFS processing script → clean subway stops JSON → seeds Supabase. Wrong data model here breaks everything downstream. |

---

## Verification (End-to-End Test)

To confirm the full system works:
1. Run `scripts/process-gtfs.ts` → verify Supabase `stops` table has all 472 stations mapped to correct lines
2. Call Edge Function manually with a stop's lat/lng → confirm Google Places results return and are cached in Supabase
3. Launch app on iOS simulator → select the A line → see animation → land on a stop → see real API results on Explore screen
4. Select the same stop again → confirm Edge Function returns cached results (not a new API call)
5. Sign in → save stop → force-kill app → reopen → confirm stop persists in Saved Stops screen
