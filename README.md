# Pixel Play

A JioHotstar-style streaming app: browse movies, shows, and sports, sign in,
build a watchlist, pick up where you left off, and (if you're an admin)
manage the entire catalog and user base from a dashboard.

```
pixelplay/
  backend/    Express + MongoDB + JWT API
  frontend/   React + Vite UI
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run seed   # creates admin + demo accounts and a sample catalog
npm run dev    # http://localhost:5000
```

See `backend/README.md` for the full API reference, the seeded login
credentials, and a MongoDB Atlas setup walkthrough if you're not using a
local database.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

The frontend talks to the API at the URL in `frontend/.env`
(`VITE_API_URL`, defaults to `http://localhost:5000/api`).

### 3. Try it out

- Visit `http://localhost:5173`
- Sign in with the demo viewer (`viewer@pixelplay.com` / `Viewer@123`) to
  browse, add titles to your watchlist, and watch sample videos.
- Sign in with the demo admin (`admin@pixelplay.com` / `Admin@12345`) and
  open **My Space → Admin Dashboard** to add/edit/delete titles and manage
  users.

## What's included

**Frontend**
- Dark, gradient-accented UI inspired by the original Pixel Play sidebar
  layout, rebuilt on React Router + Vite
- Home page with a hero banner, "Continue Watching," and genre carousels
- Movies / Shows / Sports / Creators / Categories browse pages
- Search with debounced live results
- Title detail page with an HTML5 video player that tracks watch progress
- Watchlist add/remove from anywhere a title card appears
- Login / Register backed by JWT, persisted across reloads
- Admin Dashboard: stats overview, content CRUD, user management

**Backend**
- JWT auth (register/login/me) with bcrypt password hashing
- Content model covering movies, shows, and sports with genres, cast,
  ratings, and category grouping for home-page rows
- Watchlist and "continue watching" endpoints
- Admin-only routes guarded by role middleware
- Seed script with a ready-to-watch sample catalog
- MongoDB connection validation that gives a clear, specific error message
  for the most common Atlas misconfigurations (bad URI, IP not
  allowlisted, stray whitespace in `.env`, etc.) instead of a silent or
  cryptic failure

## Swapping in your own videos

The seed script ships with free sample MP4s so playback works immediately.
To use your own:
- Edit `backend/src/seed/seed.js` and re-run `npm run seed`, or
- Sign in as admin and edit any title's Video URL from **Admin Dashboard →
  Content**.

## Notes

- This was migrated from an existing Create React App project ("Pixel
  Play") into Vite, and the original placeholder pages were replaced with
  real, data-driven views wired up to this backend.
- For production, set a strong `JWT_SECRET`, point `MONGO_URI` at your real
  database, and update `CLIENT_URL` / `VITE_API_URL` to your deployed
  domains.
- **If you previously set up TMDB import**, that feature has been removed.
  If your database has old TMDB-imported titles in it, they'll continue to
  work fine (they're ordinary content documents) — there's nothing to clean
  up unless you want to remove them via the Admin Dashboard.
