# PodBot — AI Podcast Discovery

**Live at [podbot.guru](https://podbot.guru)**

PodBot is a personalized podcast discovery app that connects to your Spotify account and uses AI to recommend episodes matched to your actual listening taste — not generic charts or editorial picks.

---

## What It Does

Most podcast apps recommend based on category tags or popularity. PodBot works differently: it pulls your real listening history from Spotify, analyzes your behavior patterns (what you finish, what you skip, what you return to), and builds a taste profile that feeds into an AI recommendation engine.

The result is episode-level recommendations — not just "you might like this show," but specific episodes, matched to your specific preferences.

---

## How the Recommendation Engine Works

1. **OAuth Connection** — User authenticates with Spotify via OAuth 2.0. Tokens are managed and refreshed securely through Supabase Auth, not stored client-side.

2. **Behavioral Analysis** — The app fetches listening history from the Spotify Web API: played episodes, completion rates, and frequency patterns. This raw data is processed to extract signal (what genres, lengths, and formats the user actually engages with) and filter out noise (episodes played briefly or skipped).

3. **Taste Profile Construction** — The behavioral signals are structured into a taste profile: preferred episode length, topic clusters, host style patterns, and listening cadence. This profile is persisted in Supabase so recommendations improve over time as more data accumulates.

4. **AI Recommendation Generation** — The taste profile is passed to an AI layer that maps it against a corpus of available episodes and ranks them by predicted fit. Recommendations are surfaced as a ranked list with explanations for why each episode was selected.

5. **Playlist Integration** — Users can save any recommended episode directly to a Spotify playlist, closing the loop from discovery to action.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite (SWC) |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |
| State & Data | TanStack React Query, React Hook Form, Zod |
| Backend | Supabase (auth, PostgreSQL database, edge functions) |
| API | Spotify Web API (OAuth 2.0) |
| Testing | Vitest, Playwright |

---

## Skills Demonstrated

- **OAuth 2.0 integration** — full authorization code flow with token refresh, scope management, and secure storage
- **Third-party API design** — wrapping the Spotify Web API in typed hooks with error handling, caching, and loading states via TanStack Query
- **Supabase edge functions** — serverless backend logic for data processing and AI calls without a separate server
- **AI-driven product logic** — translating behavioral data into structured prompts and surfacing ranked, explainable recommendations
- **Full-stack TypeScript** — end-to-end type safety from API response to UI component
- **Component architecture** — composable UI built on Radix UI primitives with consistent design via shadcn/ui

---

## License

MIT
