# MyProject – FastAPI Backend

Modular FastAPI backend for a language-tutoring platform with Daily.co video calls.
Merged from two legacy backends (`backend_arsi` + `backend_artemisa`).

## Table of Contents

- [Quick Start (Docker)](#quick-start-docker)
- [React Native Integration Quickstart](#react-native-integration-quickstart)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Daily.co Video Calls](#dailyco-video-calls)
- [Local Development (no Docker)](#local-development-no-docker)
- [Alembic Migrations](#alembic-migrations)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Quick Start (Docker)

```bash
cd backend
cp .env.example .env          # fill in JWT_SECRET_KEY and DAILY_API_KEY
docker compose up --build
```

The API is available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

## React Native Integration Quickstart

### 1 – Install Google Sign-In

```bash
npx expo install @react-native-google-signin/google-signin
```

Configure your `app.json`/`app.config.js` with your iOS client ID and Android
client ID from [Google Cloud Console](https://console.cloud.google.com/).

### 2 – Sign in and get an ID token

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  // Android client ID (web client ID also works for backend validation)
  webClientId: '325878187070-dnnuldrknhhjffnr01jqb99s8d0bof2l.apps.googleusercontent.com',
  offlineAccess: false,
});

async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const { idToken } = userInfo;  // <── send THIS token to the backend

  // ⚠️  Do NOT send userInfo.serverAuthCode or the access_token.
  //     Only the idToken is accepted by this backend.
  return idToken;
}
```

### 3 – Exchange the ID token for app tokens

```typescript
const BASE_URL = 'http://192.168.1.10:8000';  // your dev machine IP

async function loginWithGoogle(idToken: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!res.ok) throw new Error(await res.text());

  const { access_token, refresh_token } = await res.json();

  // Store tokens securely (never AsyncStorage for sensitive data)
  await SecureStore.setItemAsync('access_token', access_token);
  await SecureStore.setItemAsync('refresh_token', refresh_token);
}
```

### 4 – Call authenticated endpoints

```typescript
async function apiGet(path: string) {
  const token = await SecureStore.getItemAsync('access_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // Access token expired → refresh it
    await refreshAccessToken();
    return apiGet(path);   // retry once
  }

  return res.json();
}
```

### 5 – Refresh the access token

```typescript
async function refreshAccessToken() {
  const refresh_token = await SecureStore.getItemAsync('refresh_token');
  const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) {
    // Refresh token expired → force re-login
    await GoogleSignin.signOut();
    return;
  }

  const { access_token, refresh_token: newRefresh } = await res.json();
  await SecureStore.setItemAsync('access_token', access_token);
  await SecureStore.setItemAsync('refresh_token', newRefresh);
}
```

### 6 – Join a Daily.co video call

```typescript
import { DailyMediaView, DailyCall } from '@daily-co/react-native-daily-js';

async function joinSession(sessionId: string) {
  // Step 1: ensure the room exists on Daily.co
  const room = await apiPost(`/api/v1/sessions/${sessionId}/daily/room`);
  //  room.room_url  → "https://your-domain.daily.co/session-<uuid>"

  // Step 2: get a short-lived meeting token for this user
  const { token } = await apiPost(`/api/v1/sessions/${sessionId}/daily/token`);

  // Step 3: join with the official Daily React Native SDK
  const call = DailyCall.create();
  await call.join({ url: room.room_url, token });
}
```

---

## API Reference

All routes are prefixed with `/api/v1`.

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/google` | – | Exchange Google ID token for app JWT |
| POST | `/auth/register` | – | Email/password registration |
| POST | `/auth/login` | – | Email/password login |
| POST | `/auth/refresh` | – | Rotate refresh token, get new access token |
| GET  | `/auth/me` | Bearer | Current user profile |
| POST | `/auth/logout` | Bearer | Blacklist current access token |

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | `/users/me` | Bearer | Get own profile |
| PATCH | `/users/me` | Bearer | Update own profile |
| GET  | `/users/{id}` | Bearer | Get any user by ID |

### Tutors

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | `/tutors/` | – | List tutors (filter by language, level) |
| GET  | `/tutors/{id}` | – | Tutor public profile |
| PATCH | `/tutors/me` | teacher | Update own tutor profile |
| POST | `/tutors/me/availability` | teacher | Add availability slot |
| GET  | `/tutors/{id}/availability` | – | Get tutor's availability slots |
| DELETE | `/tutors/me/availability/{slot_id}` | teacher | Remove availability slot |

### Sessions (Bookings + Video)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/sessions/` | student | Book a session |
| GET  | `/sessions/{id}` | Bearer | Get session details |
| PATCH | `/sessions/{id}/confirm` | teacher | Confirm booking |
| PATCH | `/sessions/{id}/complete` | teacher | Mark session complete |
| POST | `/sessions/{id}/daily/room` | Bearer | Create/get Daily.co room |
| POST | `/sessions/{id}/daily/token` | Bearer | Get Daily.co meeting token |

### Reviews

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reviews/` | student | Submit review (triggers payment release) |
| GET  | `/reviews/tutor/{teacher_id}` | – | Get reviews for a tutor |

### Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | `/payments/course/{id}` | Bearer | Course payment details |
| PATCH | `/payments/course/{id}/plan` | student | Update payment plan |

### Chat

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chat/` | Bearer | Send message |
| GET  | `/chat/` | Bearer | Get conversation with another user |
| PATCH | `/chat/{id}/like` | Bearer | Toggle message like |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/admin/suspend/{user_id}` | admin | Suspend user |
| POST | `/admin/unsuspend/{user_id}` | admin | Lift suspension |
| POST | `/admin/release-payments` | admin | Manually trigger auto-release |
| GET  | `/admin/overdue-sessions` | admin | List sessions overdue for release |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | `/health` | – | `{"status":"ok", "env":"..."}` |

---

## Authentication Flow

```
React Native App                       Backend
      │                                   │
      │  GoogleSignin.signIn()            │
      │  ──────────────────────────────>  │
      │  POST /api/v1/auth/google         │
      │  { id_token: "<Google JWT>" }     │
      │                                   │  verify_oauth2_token()
      │                                   │  (google-auth library, no secret needed)
      │  <──────────────────────────────  │
      │  { access_token, refresh_token }  │
      │                                   │
      │  GET /api/v1/.../protected        │
      │  Authorization: Bearer <access>   │
      │  ──────────────────────────────>  │
      │                                   │  decode JWT, check blacklist
      │  <──────────────────────────────  │
      │  200 OK + data                    │
      │                                   │
      │  (access expired after 15 min)    │
      │  POST /api/v1/auth/refresh        │
      │  { refresh_token: "<opaque>" }    │
      │  ──────────────────────────────>  │
      │                                   │  rotate: old token revoked, new issued
      │  <──────────────────────────────  │
      │  { access_token, refresh_token }  │
```

---

## Daily.co Video Calls

1. Set `DAILY_API_KEY` in `.env` (get from https://dashboard.daily.co/developers).
2. After a session is confirmed, the student or teacher calls:
   - `POST /api/v1/sessions/{id}/daily/room` → creates a room named `session-<uuid>` (idempotent).
   - `POST /api/v1/sessions/{id}/daily/token` → mints a short-lived token (1 hour) for the caller.
3. Pass `room_url` + `token` to the Daily React Native SDK `call.join()`.

Rooms are created with `privacy: private` so only users with a valid token can join.

---

## Local Development (no Docker)

```bash
# Requires Python 3.11+ and a running PostgreSQL instance
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS/Linux

pip install -r requirements.txt

cp .env.example .env
# Edit .env: set DATABASE_URL to point at your local Postgres

alembic upgrade head            # run all migrations
uvicorn app.main:app --reload   # starts on http://localhost:8000
```

---

## Alembic Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Create a new migration after changing a model
alembic revision --autogenerate -m "describe your change"

# Roll back one migration
alembic downgrade -1

# Show current revision
alembic current
```

Migrations live in `alembic/versions/`.  
`alembic/env.py` reads `DATABASE_URL` from your `.env` via `pydantic-settings`.

---

## Environment Variables

See [.env.example](.env.example) for the full annotated list.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL DSN |
| `JWT_SECRET_KEY` | ✅ | 32+ random bytes (base64) |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth2 client ID |
| `DAILY_API_KEY` | ⬜ | Daily.co API key (video calls disabled if absent) |
| `CORS_ORIGINS` | ⬜ | Comma-separated allowed origins |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | ⬜ | Default: 15 |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | ⬜ | Default: 30 |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py               # FastAPI app factory, CORS, lifespan scheduler
│   ├── core/
│   │   ├── config.py         # Pydantic Settings (all env vars)
│   │   ├── security.py       # JWT, bcrypt, token helpers
│   │   └── logging.py        # Centralized log config
│   ├── db/
│   │   ├── session.py        # SQLAlchemy engine + get_db() dependency
│   │   └── base.py           # DeclarativeBase + all model imports (for Alembic)
│   ├── models/               # One file per domain entity
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Business logic (google_auth, daily, users, auto_release)
│   └── api/
│       ├── deps.py           # get_current_user, require_role dependencies
│       └── v1/
│           ├── router.py     # Central router (all prefixes)
│           └── endpoints/    # One file per domain
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py
├── tests/
│   ├── test_health.py
│   └── test_auth.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── alembic.ini
└── .env.example
```
