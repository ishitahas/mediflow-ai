# ⚙️ MediFlow AI — Backend Application Server

This directory contains the core REST API gateway, business logic, transaction coordinator, and real-time WebSocket server for **MediFlow AI**.

---

## 🛠️ Technology Stack

* **Runtime:** Node.js 20 LTS
* **Web Framework:** Express.js 4.18.2
* **Database ORM:** Prisma ORM 5.8.1
* **Database Engine:** PostgreSQL 16 (Serverless on Neon Cloud)
* **Real-Time Engine:** Socket.IO 4.7.4
* **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
* **Security Middleware:** `helmet`, `cors`, `cookie-parser`, `express-rate-limit`

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── config/             # Infrastructure and database configuration
│   │   ├── db.js           # Prisma client singleton instance
│   │   └── socket.js       # Socket.IO WebSocket server initialization
│   ├── controllers/        # HTTP Request Handlers (MVC Controller Layer)
│   │   ├── admin.controller.js            # Hospital analytics & staff management
│   │   ├── ai.controller.js               # Machine learning advisory endpoints
│   │   ├── appointment.controller.js      # Slot reservation & cancellation logic
│   │   ├── auth.controller.js             # Register, Login, Logout, Profile
│   │   ├── checkIn.controller.js          # QR pass validation & reception check-in
│   │   ├── doctor.controller.js           # Specialist directory & profiles
│   │   ├── doctorAttendance.controller.js # QR shift check-in / check-out
│   │   ├── health.controller.js           # Server health endpoint
│   │   ├── notification.controller.js     # User notification center
│   │   ├── triage.controller.js           # Symptom triage history & routing
│   │   └── waitlist.controller.js         # Waitlist join & manual allocation trigger
│   ├── middleware/         # Security and verification interceptors
│   │   ├── authMiddleware.js # Dual-token auth verification & RBAC role guards
│   │   └── rateLimiter.js    # Rate limiting protection for authentication routes
│   ├── routes/             # Express REST Route Handlers
│   │   ├── admin.routes.js        # /api/admin
│   │   ├── ai.routes.js           # /api/ai
│   │   ├── appointment.routes.js  # /api/appointments
│   │   ├── auth.routes.js         # /api/auth
│   │   ├── checkIn.routes.js      # /api/check-in
│   │   ├── database.routes.js     # /api/database
│   │   ├── doctor.routes.js       # /api/doctors
│   │   ├── health.routes.js       # /api/health
│   │   ├── notification.routes.js # /api/notifications
│   │   ├── presence.routes.js     # /api/presence
│   │   ├── triage.routes.js       # /api/triage
│   │   └── waitlist.routes.js     # /api/waitlist
│   ├── services/           # Business Logic & Database Transactions
│   │   ├── ai/                    # ML service client & statistical fallbacks
│   │   ├── admin.service.js       # Hospital KPIs & capacity calculation
│   │   ├── allocationService.js   # Automated waitlist slot backfilling
│   │   ├── appointment.service.js # Atomic slot reservation & conflict prevention
│   │   ├── auth.service.js        # Credential verification & JWT issuance
│   │   ├── checkInService.js      # Cryptographic QR token processing
│   │   ├── doctor.service.js      # Doctor profile & availability queries
│   │   ├── doctorAttendanceService.js # QR shift check-in audit & presence update
│   │   ├── notificationService.js # Real-time notification persistence & dispatch
│   │   ├── priorityService.js     # Rule-based triage scoring formula
│   │   ├── triageService.js       # AI symptom triage correlation
│   │   └── waitlist.service.js    # Dynamic priority queue management
│   ├── utils/              # Utility helpers
│   │   └── slotGenerator.js       # Discrete 30-min interval generator
│   ├── app.js              # Express app configuration, CORS, and middleware
│   └── server.js           # HTTP listener & Socket.IO server startup (Port 5001)
├── tests/                  # Integration test suites
├── Dockerfile              # Production container definition
├── package.json            # Backend dependencies and scripts
└── prisma                  # Symlink pointing to ../database
```

---

## 🚀 Running the Backend

### Prerequisites
* Node.js 20+
* PostgreSQL 16 database running locally or hosted on Neon
* Generated Prisma Client

### Quick Start
```bash
# From repository root:
npm run dev:backend

# Or directly from backend/:
cd backend
npm install
npx prisma generate
npm run dev
```
The server will start on: **`http://localhost:5001`**

### Running Tests
```bash
cd backend
npm test
```

---

## 🌐 Environment Configuration

Create a `.env` file in `backend/` (or copy from `.env.example`):

```env
# Server Port
PORT=5001
NODE_ENV=development

# Database Connection (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/mediflow_ai?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/mediflow_ai?sslmode=require"

# Authentication Secrets
JWT_SECRET="your_secure_random_jwt_secret_min_32_characters"
JWT_EXPIRES_IN="7d"

# Allowed CORS Origins (comma-separated)
CLIENT_URL="http://localhost:5173,https://mediflow-ai-app.vercel.app"

# Optional ML Microservice Connection
ML_SERVICE_URL="http://localhost:5002"
ML_SERVICE_SECRET="internal_ml_service_shared_secret"
```

---

## 🔗 Dependencies on Other Components

* **Database Layer (`database/`):** Connects to PostgreSQL using Prisma schema at `database/schema.prisma`.
* **ML Advisory Service (`ml-service/`):** Forwards predictive inference requests to Python FastAPI service on port 5002 with seamless statistical fallbacks if unavailable.
* **Frontend (`frontend/`):** Serves JSON REST APIs and WebSocket real-time events to the React web app.
