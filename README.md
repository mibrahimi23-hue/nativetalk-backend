# NativeTalk

Language tutoring platform — FastAPI backend + Expo (React Native) frontend.

---

## Prerequisites

| Tool | Minimum version | Install |
|------|----------------|---------|
| Python | 3.11+ | https://www.python.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |
| npm | 9+ | bundled with Node.js |
| Docker Desktop | latest | https://www.docker.com/products/docker-desktop/ |
| Expo Go (phone) | latest | App Store / Play Store |

---

## 1 — Backend (FastAPI + PostgreSQL)

The backend runs inside Docker. Open a terminal in the project root.

### Option A — Docker (recommended)

```bash
# 1. Navigate to the Backend folder
cd Backend

# 2. Copy the environment file and fill in your secrets
copy .env.example .env
#    Open .env and set:
#      JWT_SECRET_KEY=<any long random string>
#      DAILY_API_KEY=<your Daily.co API key>
#      DATABASE_URL=postgresql://postgres:postgres@db:5432/myproject

# 3. Build and start (first run may take a few minutes)
docker compose up --build

# 4. In a second terminal, run database migrations
docker compose exec api alembic upgrade head
```

The API will be live at **http://localhost:8000**  
Interactive docs (Swagger): **http://localhost:8000/docs**

To stop the backend:
```bash
docker compose down
```

---

### Option B — Local Python (no Docker)

Requires PostgreSQL running locally on port 5432.

```bash
# 1. Navigate to the Backend folder
cd Backend

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy and configure the environment file
copy .env.example .env
#    Open .env and set DATABASE_URL, JWT_SECRET_KEY, DAILY_API_KEY

# 5. Run database migrations
alembic upgrade head

# 6. Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 2 — Frontend (Expo / React Native)

Open a **new terminal** (keep the backend terminal running).

```bash
# 1. Navigate to the Frontend folder
cd Frontend

# 2. Install dependencies (only needed once)
npm install

# 3. Start the Expo dev server
npx expo start
```

After the dev server starts you will see a QR code in the terminal.

| Target | How to open |
|--------|-------------|
| Physical phone | Scan the QR code with **Expo Go** |
| Android emulator | Press `a` in the terminal (requires Android Studio) |
| iOS simulator | Press `i` in the terminal (macOS + Xcode only) |
| Web browser | Press `w` in the terminal |

> **Important:** The app connects to `http://localhost:8000` by default.  
> If running on a physical device, open `Frontend/services/api-client.js` and replace  
> `localhost` with your computer's local IP address (e.g. `192.168.1.10`).

---

## 3 — Running Both Together (quick reference)

Open **two terminals** side by side:

**Terminal 1 — Backend**
```bash
cd Backend
docker compose up
```

**Terminal 2 — Frontend**
```bash
cd Frontend
npm install
npx expo start
```

---

## Environment Variables (Backend)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@db:5432/myproject` |
| `JWT_SECRET_KEY` | Secret used to sign JWT tokens | any long random string |
| `DAILY_API_KEY` | Daily.co API key for video calls | `abc123...` |
| `DAILY_DOMAIN` | Your Daily.co domain | `yourapp.daily.co` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | from Google Cloud Console |

---

## Project Structure

```
nativetalk-backend-main/
├── Backend/             # FastAPI app, Alembic migrations, Docker config
│   ├── app/             # Routes, models, services, schemas
│   ├── alembic/         # Database migrations
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
└── Frontend/            # Expo React Native app
    ├── app/             # Screens (file-based routing via expo-router)
    ├── components/      # Shared UI components
    ├── constants/       # Theme colors, fonts, spacing
    ├── contexts/        # React context providers
    ├── hooks/           # Custom hooks
    └── services/        # API client and service helpers
```

---

## Useful Commands

### Backend
```bash
# View live logs
docker compose logs -f api

# Open a shell inside the API container
docker compose exec api bash

# Create a new migration after model changes
docker compose exec api alembic revision --autogenerate -m "describe change"

# Apply migrations
docker compose exec api alembic upgrade head

# Reset the database (destructive — deletes all data)
docker compose down -v
docker compose up --build
docker compose exec api alembic upgrade head
```

### Frontend
```bash
# Clear Expo cache and restart
npx expo start --clear

# Build for Android (EAS)
npx eas build --platform android

# Build for iOS (EAS)
npx eas build --platform ios
```
