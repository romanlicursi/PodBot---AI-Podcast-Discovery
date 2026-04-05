# PodBot — AI-Powered Podcast Recommendations

PodBot connects to your Spotify account, analyzes your podcast listening history, and uses AI to recommend episodes matched to your taste profile. Connect once, get personalized picks, and save your favorites directly to a Spotify playlist.

## Features

- **Spotify OAuth** — Secure account connection with full token management via Supabase Auth
- **Listening Analysis** — Pulls podcast history and completion data to build a personal taste profile
- **AI Recommendations** — Episode suggestions generated from your actual listening patterns
- **Playlist Save** — Add recommended episodes directly to any of your Spotify playlists
- **Onboarding Flow** — Guided walkthrough for first-time users

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite (SWC) |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |
| State | TanStack React Query, React Hook Form, Zod |
| Backend | Supabase (auth, database, edge functions) |
| API | Spotify Web API (OAuth 2.0) |
| Testing | Vitest, Playwright |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) or Node.js 18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) app with a registered redirect URI
- A [Supabase](https://supabase.com) project

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/romanlicursi/ear-decoder-bot.git
   cd ear-decoder-bot
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Create a `.env` file at the project root:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Add your Spotify client credentials to the Supabase edge function secrets (see `/supabase/functions`).

5. Start the dev server
   ```bash
   bun dev
   ```

## How It Works

1. **Connect** — User authenticates with Spotify via OAuth 2.0; tokens are stored and managed by Supabase Auth
2. **Analyze** — Edge functions call the Spotify API to fetch listening history and build a taste profile
3. **Recommend** — AI processes the taste profile and returns ranked podcast episode suggestions
4. **Save** — Users can add any recommendation directly to a Spotify playlist

## License

MIT
