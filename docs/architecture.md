# 🏛️ MediFlow AI — System Architecture Specification

**Document:** `docs/architecture.md`  
**System:** MediFlow AI — Smart Doctor Appointment Booking & Patient Management System  
**Version:** 2.0.0  
**Status:** Approved & Implemented  

---

## 1. Architectural Philosophy: Decoupled Separation of Concerns

MediFlow AI is engineered around the principle of **resilient multi-tier decoupling**. Outpatient appointment booking, patient reception check-in, and doctor attendance verification are mission-critical clinical workflows. The architecture guarantees that:

1. **Transactional Operations are Never Blocked by Analytics:**  
   The core Node.js application server and PostgreSQL database handle all slot reservations, authentication, and clinical state transitions with zero dependency on external analytical engines.
2. **Predictive Intelligence is Strictly Advisory:**  
   The Python FastAPI machine learning microservice operates as an independent advisory layer. If the ML service is delayed or experiencing a cold restart, the backend falls back to deterministic statistical baselines without interrupting patient scheduling.
3. **Real-Time State Propagation is Event-Driven:**  
   Changes in doctor presence, queue status, or waitlist allocations are pushed asynchronously via WebSockets (`Socket.IO`), eliminating polling overhead.

---

## 2. Multi-Tier System Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (SPA)                         │
│  React 18 • Vite 5 • Tailwind CSS • React Router DOM v6 • Axios        │
│  Hosted on Vercel Edge Network (https://mediflow-ai-app.vercel.app)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         HTTPS REST │ WebSocket Events
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  APPLICATION API GATEWAY (REST + WS)                   │
│  Node.js 20 LTS • Express.js • Prisma ORM • Socket.IO Server           │
│  Hosted on Render (https://mediflow-api-bz27.onrender.com)             │
│                                                                        │
│  • Dual-Token Auth (HTTP-Only Cookie + Bearer Authorization Header)    │
│  • Role-Based Access Control (PATIENT, DOCTOR, ADMIN)                  │
│  • 30-Minute Discrete Slot Generator & Collision Lock Engine           │
│  • Deterministic Smart Waitlist Triage Formula (ESI-Inspired)          │
│  • Reception QR Pass Scanner & Shift Attendance Controller             │
└───────────────┬────────────────────────────────────────┬───────────────┘
                │                                        │
    SQL Queries │ Prisma ORM                 JSON Over HTTP │ (Port 5002)
   (Port 6543)  │ PgBouncer Pooler                       │
                │                                        ▼
┌───────────────▼────────────────────────┐ ┌─────────────────────────────┐
│       DATABASE PERSISTENCE TIER        │ │  INDEPENDENT ML ADVISORY    │
│  PostgreSQL 16 (Neon Serverless Cloud) │ │         MICROSERVICE        │
│  • 14 Normalized Relational Models     │ │  Python 3.13 • FastAPI      │
│  • ACID Multi-Version Concurrency      │ │  Uvicorn • Scikit-Learn 1.4 │
│  • Write-Ahead Logging & Foreign Keys  │ │  • Waiting Time Regressor   │
│  • AWS us-east-2 Region               │ │  • Doctor Delay Classifier  │
└────────────────────────────────────────┘ │  • Duration Regressor       │
                                           │  • Department Demand Model  │
                                           └─────────────────────────────┘
```

---

## 3. Core Component Breakdown

### 3.1 Presentation Layer (`frontend/`)
* **Framework:** React 18 with Vite as the build tool.
* **Component Model:** Fully modularized design system located in `frontend/src/components/ui/` with dedicated pages in `frontend/src/pages/`.
* **State Management:** Centralized authentication and session management via `AuthContext.jsx`.
* **Routing Security:** Protected routes wrapped in `ProtectedRoute.jsx` enforce role-based access before view rendering.
* **Deployment:** Hosted as a Single Page Application on Vercel Edge Network with `vercel.json` rewrites redirecting all traffic to `/index.html`.

### 3.2 Application API Gateway (`backend/`)
* **Framework:** Node.js 20 LTS running Express.js.
* **Architecture:** Classic Controller-Service-Repository pattern.
  * **Controllers (`src/controllers/`):** Handle HTTP request/response lifecycles and input sanitization.
  * **Services (`src/services/`):** Encapsulate business logic, transactional locks, and triage scoring.
  * **Repository / ORM (`src/config/db.js`):** Prisma ORM managing strongly-typed queries to PostgreSQL.
* **Real-Time Hub (`src/config/socket.js`):** Socket.IO server emitting typed events across rooms (`queue_updated`, `doctor_presence_updated`, `waitlist_allocated`, `notification_received`).
* **Deployment:** Deployed as a web service on Render with production environment variables (`DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`).

### 3.3 Database Layer (`database/`)
* **Engine:** PostgreSQL 16 hosted on Neon Serverless Cloud.
* **Schema Governance:** 14 models declared in `database/schema.prisma` with immutable SQL migrations in `database/migrations/`.
* **Connection Pooling:** Connected through PgBouncer proxy on port 6543 (`DATABASE_URL`) with unpooled direct access on port 5432 (`DATABASE_URL_UNPOOLED`) for DDL migrations.
* **Documentation:** Fully documented in [`database/DATABASE.md`](../database/DATABASE.md).

### 3.4 Machine Learning Advisory Microservice (`ml-service/`)
* **Framework:** Python 3.13 and FastAPI 0.110 running on Uvicorn.
* **Model Portfolio:** 4 scikit-learn pipelines serialized with Joblib (`waiting_time_model.joblib`, `doctor_availability_model.joblib`, `appointment_duration_model.joblib`, `department_demand_model.joblib`).
* **Scientific Governance:** Tagged as `IMPLEMENTED_BUT_INSUFFICIENT_DATA` until $\ge 500$ real clinical events accumulate in production, maintaining strict academic honesty.

---

## 4. Concurrency & Transactional Consistency

A critical requirement in hospital scheduling is the absolute prevention of **double-booking**. MediFlow AI guarantees zero appointment conflicts through database-level invariants:

1. **Discrete Slot Isolation:** Every appointment slot is uniquely defined by `(doctorId, slotDate, startTime, endTime)`.
2. **Unique Slot Association:** The `Appointment` model enforces `@unique` on `slotId`:
   ```prisma
   slotId String @unique
   slot   AppointmentSlot @relation(fields: [slotId], references: [id], onDelete: Cascade)
   ```
   PostgreSQL enforces this via an unconditional unique index. Two concurrent booking transactions attempting to claim the same slot will cause the second transaction to abort with a unique constraint violation (`P2002`).
3. **Atomic State Transitions:** Slot status transitions from `AVAILABLE` to `BOOKED` are wrapped inside `prisma.$transaction()` blocks.

---

## 5. Authentication & Security Architecture

### 5.1 Dual-Token Authentication Strategy
To guarantee seamless session persistence across modern browsers (including Safari ITP and private browsing modes) in a cross-origin cloud environment:
1. **HTTP-Only Secure Cookie:** The server sets a `SameSite: 'none'`, `secure: true`, `httpOnly: true` cookie upon login.
2. **Bearer Authorization Header:** The client also retains the JWT in storage and transmits it in the `Authorization: Bearer <token>` header via Axios interceptors.
3. **Unified Middleware Extraction:** The backend authentication middleware checks cookies first, falling back to the Bearer header seamlessly.

### 5.2 Role-Based Access Control (RBAC)
User permissions are strictly enforced at the route middleware level:
* **`PATIENT`:** Book appointments, view personal appointment history, join waitlist, access AI symptom assistant.
* **`DOCTOR`:** View outpatient daily queue, advance consultation states, conduct shift attendance check-in.
* **`ADMIN`:** Executive hospital control center, staff workload management, patient registry, manual waitlist allocation triggers, reception QR check-in scanning.

---

## 6. Real-Time WebSocket Event Architecture

MediFlow AI uses Socket.IO to keep patient waiting rooms and doctor consultation suites synchronized in real time:

| Event Name | Direction | Payload | Trigger Condition |
|---|:---:|---|---|
| `queue_updated` | Server $\rightarrow$ Client | `{ doctorId, queueLength, servingToken }` | Patient checks in, doctor advances consultation. |
| `doctor_presence_updated` | Server $\rightarrow$ Client | `{ doctorId, status, changedAt }` | Doctor updates presence or completes QR attendance. |
| `waitlist_allocated` | Server $\rightarrow$ Client | `{ patientId, doctorId, slotId }` | Cancelled slot reallocated to highest-priority candidate. |
| `notification_received` | Server $\rightarrow$ Client | `{ userId, title, message, type }` | System generates booking alert or reminder. |

---

## 7. Cloud Deployment Topology

* **Frontend:** Vercel Edge Network (`https://mediflow-ai-app.vercel.app`)
* **Backend API Gateway:** Render Web Service (`https://mediflow-api-bz27.onrender.com`)
* **ML Inference Microservice:** Render Web Service (`https://mediflow-ml-service.onrender.com`)
* **Database:** Neon Serverless PostgreSQL (`AWS us-east-2`)
* **Container Orchestration:** Docker Compose configurations available for local and production deployment (`docker-compose.prod.yml`, `docker-compose.staging.yml`).
