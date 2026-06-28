# Pixel Play — Backend

Express + MongoDB + JWT API for the Pixel Play streaming app (movies, shows,
sports, watchlists, and an admin dashboard).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` (already done for you) and edit values as
   needed — especially `MONGO_URI` and `JWT_SECRET`. See **MongoDB Atlas
   setup** below if you're using Atlas rather than a local database.

3. Seed the database with an admin account, a demo viewer account, and a
   catalog of sample movies/shows/sports:
   ```bash
   npm run seed
   ```
   This prints the admin and demo login credentials to the console.

4. Start the dev server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
   The API runs at `http://localhost:5000` by default. On success you'll
   see `MongoDB connected: ...` in the terminal — if you don't see that,
   the app didn't actually connect; check the error message it prints.

## MongoDB Atlas setup

If you're using a local MongoDB install, the default
`MONGO_URI=mongodb://127.0.0.1:27017/pixelplay` in `.env.example` already
works and you can skip this section.

To use Atlas instead:

1. In Atlas, go to **Network Access** and add your current IP address (or
   `0.0.0.0/0` to allow from anywhere while developing — not recommended
   for production).
2. In Atlas, go to **Database Access** and confirm you have a database
   user with a username/password (not just SSO login).
3. Go to **Database > Connect > Drivers**, copy the connection string. It
   looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-host>/?retryWrites=true&w=majority
   ```
4. Paste it into `MONGO_URI` in `backend/.env`, then:
   - Replace `<username>` and `<password>` with your real database user
     credentials (not your Atlas login email/password — these are
     separate).
   - If your password contains special characters (`@ : / ? # [ ] %`),
     URL-encode them, or the connection string will be parsed incorrectly.
   - Add a database name right after the host, before the `?`, e.g.
     `.../pixelplay?retryWrites=true...`. If you skip this, Mongo will use
     a database called `test` instead of one named for this project.
5. **Double-check there is no extra whitespace** before or after the value
   on the `MONGO_URI=` line. A stray leading space (easy to introduce by
   copy-pasting) makes the URI invalid and is one of the most common
   causes of a silent or confusing connection failure.

**Common Atlas connection errors:**
| Symptom | Likely cause |
|---|---|
| Times out / `ETIMEDOUT` / `ENOTFOUND` | Your IP isn't allowlisted in Network Access, or the cluster hostname is wrong |
| `querySrv ECONNREFUSED` / `querySrv ENOTFOUND` | Your network/DNS can't resolve `mongodb+srv://` SRV records — see below |
| `Authentication failed` | Wrong username/password, or password needs URL-encoding |
| Connects to the wrong/empty database | No database name in the URI (defaulted to `test`) |
| `MONGO_URI must start with "mongodb://"...` | Stray whitespace or a leftover `#` at the start of the line in `.env` |

The app validates the connection string on startup and will print a
specific message for these cases instead of a generic failure.

### Fixing `querySrv ECONNREFUSED` / DNS SRV lookup failures

The `mongodb+srv://` format Atlas gives you by default depends on a special
DNS record type (SRV) to discover your cluster's actual servers. Some
networks — certain ISPs, routers, VPNs, school/work networks, or DNS
providers — block or don't support this DNS record type, even though
normal websites load fine. When that happens, the connection fails before
it even reaches Atlas, with an error like `querySrv ECONNREFUSED` or
`querySrv ENOTFOUND`.

**The fix: use the standard (non-SRV) connection string instead.**

1. In Atlas, go to **Database > Connect > Drivers**.
2. Below the `mongodb+srv://...` string, look for a link/toggle along the
   lines of *"Using a different connection method?"* or a standard
   connection string option. It will look like this instead:
   ```
   mongodb://<username>:<password>@cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017/pixelplay?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
   ```
   Note it starts with `mongodb://` (not `mongodb+srv://`) and lists three
   full hostnames instead of one short one.
3. Use that as your `MONGO_URI` instead. It connects directly to each
   server by hostname and never needs an SRV DNS lookup, so it works even
   on networks that block them.

This is the standard workaround MongoDB itself recommends for SRV DNS
issues — it's not a hack, just an older/more explicit connection format
that Atlas still fully supports.

## Project structure

```
src/
  config/db.js            MongoDB connection
  models/                 Mongoose schemas (User, Content)
  controllers/            Route handler logic
  routes/                 Express routers
  middleware/auth.js      JWT verification + admin guard
  middleware/errorHandler.js
  seed/seed.js            Sample data generator
  app.js                  Express app (middleware + routes)
  server.js               Entry point
```

## API overview

### Auth — `/api/auth`
| Method | Route          | Access  | Description                          |
|--------|----------------|---------|----------------------------------------|
| POST   | /register      | Public  | Create a new account                   |
| POST   | /login         | Public  | Log in, returns JWT                    |
| GET    | /me            | Private | Get current user profile               |
| PUT    | /me            | Private | Update own name / email / avatar       |
| PUT    | /me/password   | Private | Change own password (needs current pw) |

### Content — `/api/content`
| Method | Route          | Access | Description                                   |
|--------|----------------|--------|------------------------------------------------|
| GET    | /               | Public | List content (filters: type, genre, search, category, featured, trending, page, limit) |
| GET    | /categories     | Public | Home page rows grouped by category             |
| GET    | /:id            | Public | Get one item by id                              |
| POST   | /:id/view       | Public | Increment view counter                          |
| POST   | /                | Admin  | Create content                                  |
| PUT    | /:id            | Admin  | Update content                                  |
| DELETE | /:id            | Admin  | Delete content                                  |

### Watchlist — `/api/watchlist` (all routes require login)
| Method | Route                          | Description                       |
|--------|--------------------------------|------------------------------------|
| GET    | /                              | Get my watchlist                   |
| POST   | /:contentId                    | Add item to watchlist              |
| DELETE | /:contentId                    | Remove item from watchlist         |
| GET    | /continue-watching             | Get my "continue watching" list    |
| POST   | /continue-watching/:contentId  | Save/update playback progress      |

### Admin — `/api/admin` (all routes require admin role)
| Method | Route               | Description                       |
|--------|---------------------|-------------------------------------|
| GET    | /stats              | Dashboard stats (counts, top content, recent users) |
| GET    | /users              | List all users                      |
| PUT    | /users/:id/role      | Promote/demote a user               |
| PUT    | /users/:id/status    | Activate/deactivate a user          |
| DELETE | /users/:id           | Delete a user                       |

## Auth flow

Send the JWT returned from `/api/auth/login` or `/api/auth/register` as a
Bearer token on subsequent requests:

```
Authorization: Bearer <token>
```

## Notes on sample video URLs

The seed script uses publicly hosted sample MP4s (Google's GTV test catalog)
so playback works immediately. Update `videoUrl` on any content from the
Admin Dashboard, or edit `src/seed/seed.js` and re-run `npm run seed`, to
point at your own video files/CDN.

## If you previously ran a TMDB import

TMDB support has been removed from this project. If your database was ever
connected to a version of this app that had it, your `content` collection
may still have a leftover index named `tmdbId_1`. It's harmless (it won't
cause errors or block inserts), but if you want to remove it:

```js
// In MongoDB Shell / Atlas Data Explorer, run:
db.contents.dropIndex("tmdbId_1")
```

If that index doesn't exist, this command will just return a harmless
error saying so — nothing to worry about either way.
