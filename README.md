# FlexLiving Reviews Dashboard


## Tech Stack
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind for styling; minimal custom UI primitives
- File-based mocked data for Hostaway; JSON file persistence for approvals with in-memory fallback


## Key Design & Logic Decisions
- **Normalization**: `/api/reviews/hostaway` converts raw sandbox/mock payloads into a consistent `NormalizedReview` shape keyed by listing, channel, type, and date strings, simplifying UI.
- **Live vs Mock Switching**: If `HOSTAWAY_API_KEY` is set, the Hostaway route attempts a **live** fetch from `HOSTAWAY_BASE_URL` and falls back to **mock** automatically on any failure. The JSON response includes a `source` field (`"live" | "mock"`).
- **Filters**: Client-side filters enable fast iteration; could move server-side for very large datasets.
- **Approvals**: Persisted to `data/approvals.json` when possible. If not writable (serverless), fallback to memory so flow still works during assessment.
- **Trends**: Lightweight SVG chart shows average monthly ratings on a 0–10 scale. Categories displayed per review to surface recurring issues.
- **Public Page**: `/listings/[listingId]` renders only manager-approved reviews, aligning with product requirement.
- **Google Reviews**: `/api/reviews/google` returns a documented stub unless `GOOGLE_PLACES_API_KEY` is set; with key it fetches Place Details reviews and normalizes them to the same shape.


## API Behaviors
- `GET /api/reviews/hostaway` → `{ source, status, count, result: NormalizedReview[] }`
- `GET /api/reviews/google?placeId=...` → stub or live normalized result
- `GET /api/approvals?listingId=...` → list of approved review IDs for a property
- `POST /api/approvals` body `{ listingId, reviewIds: string[] }` → persists approvals


## Local Setup
1. `cp .env.example .env.local` and set values as needed
- For **mock only**: leave `HOSTAWAY_API_KEY` empty.
- For **live Hostaway**: set `HOSTAWAY_API_KEY`, optionally `HOSTAWAY_BASE_URL` (defaults to sandbox), and `HOSTAWAY_ACCOUNT_ID`.
- For **live Google**: set `GOOGLE_PLACES_API_KEY`.
2. `pnpm install` (or `npm i`/`yarn`)
3. `pnpm dev` and open `http://localhost:3000`


## Notes
- The Hostaway sandbox often contains no reviews; mocked JSON is used to simulate realistic data for development. When live fetch is enabled but fails (network/permissions/empty), the route **falls back** to mock and logs a warning.
- Extend `data/hostaway_mock.json` with more entries to test edge cases.
