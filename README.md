# Uncle Ernie 🚇

**Pick a subway line. Get a random stop. Go see a part of New York you've never seen.**

Uncle Ernie is an iPhone app (React Native + Expo) that turns the NYC subway into a discovery engine. It's the running project on [DYOD](https://www.youtube.com/@DYODAI), a video podcast where two friends, a developer and a product manager, learn Claude Code out loud.

▶️ **Watch it come together:** [Ep 5: We let AI plan a random NYC subway adventure](https://www.youtube.com/watch?v=GkUav2meNic) · [Ep 16: Uncle Ernie is alive!](https://www.youtube.com/watch?v=Akl2bY5m0B4)

## The idea

Yelp and Google Maps optimize for efficiency: the best-rated thing closest to you. Uncle Ernie optimizes for **serendipity**. You pick a line (or go fully random), a split-flap departure board reveals your stop, and Uncle Ernie, a 40-year New Yorker with opinions, tells you what's worth doing when you get off the train.

**Who it's for**
- **The adventurous local** stuck in a weekend routine
- **The visiting friend** who wants local spots, not tourist traps
- **The bored commuter** looking for a detour near a familiar stop

## What's built

This is an honest prototype. The core experience works end to end on the iPhone simulator, running on sample data.

| Feature | Status |
|---|---|
| Line picker with all MTA lines in their official colors | ✅ Built |
| Random stop by line, or "Surprise me" | ✅ Built, with 8 sample stations |
| Split-flap reveal animation, with re-roll | ✅ Built |
| Explore screen with an "Ernie's Pick" card and category filters (Food, Bars, Outdoor, Culture, Coffee) | ✅ Built, with placeholder places |
| Save places, tagged with the line and stop you found them from | ✅ Built |
| Group saved places into named trips | ✅ Built |
| Light and dark themes | ✅ Built |
| Full station list from MTA GTFS data | ⏳ Planned |
| Real nearby places (Google Places / Yelp, via a server-side proxy) | ⏳ Planned |
| Map view of the stop and nearby spots (Mapbox) | ⏳ Planned |
| Curated Uncle Ernie picks for 50–100 stations | ⏳ Planned, as an editorial workstream |

## How we built it

We started with a plan, not code. Before writing anything, we had Claude produce a full software development lifecycle plan covering personas, prioritized MVP user stories, information architecture, tech stack, data model, sprint breakdown and the riskiest parts to tackle first. It's in [`crystalline-petting-quilt.md`](crystalline-petting-quilt.md); the name is the random one Claude Code gave the plan file.

Then we worked in sprints:
1. **Design first.** Clickable HTML mockups in [`design/`](design/), in dark and light versions, before any app code (DYOD Ep 10).
2. **Sprint 0.** Expo app scaffolding, file-based routing and a design system in `theme.ts`.
3. **Sprint 1.** Line selection, the split-flap reveal, place saving, trips and tab navigation.

The git history follows the same path, from the initial commit (plan and mockups) to Sprint 1.

## PM notes: what I learned

- **Plan review is the cheapest place to find problems.** Reviewing the plan before any code ("mise en place for code," Ep 8) surfaced decisions we'd otherwise have hit mid-build. One example: API keys must never live in the app, so all place lookups go through a server-side proxy with caching to keep API costs under control.
- **The signature moment gets protected time.** The plan named the reveal animation as the riskiest UX piece and gave it dedicated days. That's the part people react to in demos.
- **Sample data first was the right call.** Hard-coding 8 stations and a few places let us prove the whole loop (pick, reveal, explore, save) before paying for APIs or processing transit data.
- **AI tools speed up the building and stall on the environment.** Writing screens was fast. Weeks went to Expo SDK version mismatches, native modules and simulator installs. That gap between "the code is written" and "it runs on a phone" is real, and it's worth planning for.
- **The moat is editorial, not technical.** Any app can call a places API. What makes Uncle Ernie different is the curated picks, and that's a content operation, not a sprint ticket.

## Tech stack

React Native · Expo SDK 56 · Expo Router · TypeScript · Zustand · Reanimated

Planned: Supabase (Postgres + Edge Functions as the API proxy), Mapbox, Google Places, Yelp Fusion, PostHog, Sentry

## Run it locally

```bash
npm install
npx expo start
```

Then press `i` to open the iOS simulator (requires Xcode), or scan the QR code with Expo Go.

## Credits

Built by **Damon Pieri** on [DYOD](https://www.youtube.com/@DYODAI) with co-host **Derek**, and Claude Code as the third member of the team.

---

**Damon Pieri** · Senior Product Manager, AI-enabled EdTech · [LinkedIn](https://www.linkedin.com/in/damonpieri) · [Portfolio](https://damonpieri.github.io)
