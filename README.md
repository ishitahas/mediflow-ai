# MediFlow AI — Smart Hospital Appointment & Doctor Availability System

[![Live Application](https://img.shields.io/badge/Live%20Demo-mediflow--ai--app.vercel.app-2ea44f?style=for-the-badge&logo=vercel&logoColor=white)](https://mediflow-ai-app.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-v6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Python](https://img.shields.io/badge/Python-v3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-v1.4+-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**MediFlow AI** is a full-stack hospital outpatient department (OPD) intelligence, appointment scheduling, real-time notification, and patient queue management platform. It combines transactional scheduling with an independent Python FastAPI machine learning microservice, QR check-in passes, verified doctor presence tracking, and real-time Socket.IO updates.

---

## 🚀 Live Demo

**Live Application:**  
👉 **[https://mediflow-ai-app.vercel.app](https://mediflow-ai-app.vercel.app)**

The following production routes have been tested and verified:

| Route | Description | Status |
|:---|:---|:---:|
| [`/doctors`](https://mediflow-ai-app.vercel.app/doctors) | Public specialists directory with department filters and real-time availability badges | ✅ Active |
| [`/book`](https://mediflow-ai-app.vercel.app/book) | Interactive doctor selection, schedule calendar, and slot booking | ✅ Active |
| [`/my-appointments`](https://mediflow-ai-app.vercel.app/my-appointments) | Patient appointment management, atomic rescheduling, cancellations, and QR pass access | ✅ Active |
| [`/patient/dashboard`](https://mediflow-ai-app.vercel.app/patient/dashboard) | Patient portal overview with upcoming appointments, recent triage, and profile details | ✅ Active |
| [`/waitlist`](https://mediflow-ai-app.vercel.app/waitlist) | Patient waitlist tracker with rule-based priority score and auto-allocation status | ✅ Active |

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Application Workflow](#-application-workflow)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Screenshots](#-screenshots)
7. [Project Structure](#-project-structure)
8. [Local Installation & Setup](#-local-installation--setup)
9. [Environment Configuration](#-environment-configuration)
10. [Database Provisioning & Migrations](#-database-provisioning--migrations)
11. [Running the Application](#-running-the-application)
12. [Production Deployment](#-production-deployment)
13. [API Documentation](#-api-documentation)
14. [Machine Learning Microservice & Governance](#-machine-learning-microservice--governance)
15. [Role-Based Demo Credentials](#-role-based-demo-credentials)
16. [Verification & Testing](#-verification--testing)
17. [License](#-license)

---

## 🏥 Project Overview

Outpatient departments in modern hospitals frequently face operational bottlenecks:
- **Unpredictable Clinician Schedules:** Doctors engaged in emergency surgeries or inpatient rounds lead to unexpected OPD delays.
- **Double Bookings & Lost Capacity:** Concurrent booking requests cause slot collisions, while last-minute cancellations leave vacant consultation slots unused.
- **Opaque Queuing:** Waiting patients lack visibility into queue progress and estimated waiting times.
- **Administrative Blind Spots:** Clinic managers lack real-time visibility into OPD attendance, room occupancy, and department demand.

**MediFlow AI** addresses these challenges with a decoupled, resilient architecture:
- **Transactional Core (Node.js/Express + PostgreSQL/Prisma):** Enforces ACID booking transactions, compound database slot locking, role-based access control, cryptographic QR check-in, and instant WebSocket broadcasts.
- **Machine Learning Microservice (Python FastAPI + scikit-learn):** Provides non-blocking advisory predictions for patient waiting times, doctor delay risks, consultation durations, and department demand forecasts.
- **Transparent Data Governance:** Models in production are explicitly labeled with honest governance boundaries (`IMPLEMENTED_BUT_INSUFFICIENT_DATA`) until prospective ground-truth clinical timestamps accumulate.

---

## ✨ Key Features

### 1. Multi-Role Authentication & Access Control (RBAC)
- Role segregation across **PATIENT**, **DOCTOR**, and **ADMIN** accounts.
- Passwords securely hashed with **bcryptjs** (salt rounds: 10).
- **Dual-Token Authentication Strategy:** Transmits stateless JWTs via HTTP-only cookies (`sameSite: 'none'` in production) alongside an `Authorization: Bearer <token>` fallback stored in client storage for cross-domain hosting (Vercel $\leftrightarrow$ Render).
- Role guards across Express routes (`authenticateUser`, `authorizeRoles`) and React Router (`ProtectedRoute`).

### 2. Verified Doctor Presence & QR Attendance
- Clinicians check into hospital OPD gates using **signed JWT QR tokens** (`/api/presence/qr/check-in`, `/api/presence/qr/check-out`) via camera scanning (`html5-qrcode`), manual token input, or 1-click viva gate simulation.
- Anti-replay session validation rejects duplicate check-ins (`HTTP 409 Conflict`), backed by audit logging (`QRScanAudit`).
- Real-time presence states: `PRESENT`, `AVAILABLE`, `IN_CONSULTATION`, `ON_BREAK`, `ON_LEAVE`, `AWAY`, `BUSY`, and `OFFLINE`.
- Socket.IO broadcasts (`doctor_status_changed`) synchronize doctor directories and dynamically gate patient booking slots.

### 3. Dynamic Slot Generation & Double-Booking Prevention
- Generates discrete, non-overlapping consultation slots based on doctor schedules and consultation durations (`slotGenerator.js`).
- Booking execution runs inside **PostgreSQL atomic transactions (`prisma.$transaction`)** with doctor-slot conflict checks, patient-time conflict checks, and `@unique` `Appointment.slotId` constraint enforcement.

### 4. Smart Waitlist & Rule-Based Priority Auto-Allocation
- When all regular consultation slots are occupied, patients can join a ranked waitlist queue (`/api/waitlist`).
- **Explainable, deterministic rule-based priority scoring formula** (bounded between 15–90 points):
  $$\text{Priority Score} = \text{Medical Priority Points (10–40)} + \text{Clinical Urgency Points (5–20)} + \min\!\left(\left\lfloor\frac{\text{Wait Minutes}}{30}\right\rfloor, 30\right)$$
- When an existing appointment is cancelled or rescheduled, the system automatically frees the slot and allocates it to the highest-priority waitlisted candidate.

### 5. Digital QR Check-In Pass & Live OPD Queue Board
- Patients receive a signed 48-hour JWT QR pass upon booking confirmation (`/api/check-in/appointment/:id/qr`).
- Touchless reception / doctor check-in (`/check-in`) verifies the QR token and stamps `checkedInAt`, `consultationStartedAt`, and `consultationCompletedAt`.
- Public waiting room queue screen (`/queue/:doctorId`) displays anonymized queues (`Rahul V.***`) with live consultation updates.

### 6. Real-Time In-App Notification System
- Persistent `Notification` records in PostgreSQL linked to user profiles.
- Delivers user-scoped alerts (`user_${userId}`) and admin notifications (`role_admin`) over Socket.IO (`notification:new`, `notification:count`).
- Navbar **`NotificationBell`** component features live unread badge counts, skeleton loaders, and mark-as-read actions.
- Automatically triggers on appointment booking, cancellation, rescheduling, and doctor attendance transitions.

### 7. AI Health Assistant & Symptom Triage (Rule-Based)
- Non-diagnostic health navigation assistant (`/health-assistant`, `/api/triage/analyze`).
- Features an **Emergency Keyword Safety Circuit** that detects critical cardiovascular, respiratory, and neurological symptoms.
- Multi-specialty weighted keyword scoring routes patients to the appropriate medical department, matches verified hospital specialists, and records patient triage history.

### 8. Decoupled Machine Learning Microservice
- Independent Python FastAPI microservice (port `5002`) communicating with Express via `X-Internal-Token` headers and an automated statistical fallback.
- Houses **4 scikit-learn predictive pipelines**:
  1. **Patient Waiting-Time Regressor** (`RandomForestRegressor`)
  2. **Doctor Availability & Delay Classifier** (`RandomForestClassifier`)
  3. **Consultation Duration Regressor** (`GradientBoostingRegressor`)
  4. **Department Demand Forecaster** (`RandomForestRegressor` with time-series lag features)
- **Admin Intelligence Center (`/admin/intelligence`):** Displays model status, prospective timestamp completeness audits, and gates retraining until clinical event thresholds ($\ge 500$) are reached.

---

## 🔄 Application Workflow

The end-to-end patient consultation lifecycle is fully implemented and verified:

```
[ Authentication ]
       │
       ▼
[ Browse Specialists (/doctors) ]
  • Filter by department, experience, and fee
  • View live doctor presence badge
       │
       ▼
[ Select Doctor & View Schedule (/book) ]
  • Load available consultation dates
  • Generate discrete, non-overlapping time slots
       │
       ▼
[ Choose Date & Slot ]
  • Review consultation fee and room details
  • Provide brief symptom / visit reason
       │
       ▼
[ Confirm Appointment ]
  • Atomic PostgreSQL transaction (Prisma)
  • Double-booking prevention lock
  • In-app notification & confirmation email
       │
       ▼
[ Digital QR Check-In Pass ]
  • Signed 48-hour JWT QR token generated
  • Instant display in modal and appointment card
       │
       ▼
[ OPD Reception / Doctor Check-In (/check-in) ]
  • QR camera scan or manual pass verification
  • Status transitions: CONFIRMED → CHECKED_IN → IN_PROGRESS → COMPLETED
  • Anonymized waiting room queue display (/queue/:doctorId)
       │
       ▼
[ Manage Appointments (/my-appointments) ]
  • View upcoming and past appointments
  • Atomic rescheduling with automatic slot release
  • Appointment cancellation triggering waitlist auto-allocation
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose in MediFlow AI |
|:---|:---|:---|
| **Frontend Client** | React 18.3, Vite 5.4, Tailwind CSS 3.4, React Router 6.28, Axios, Socket.IO Client 4.8, `html5-qrcode` | Responsive SPA, interactive booking calendar, QR camera scanner, Notification Bell, Admin Intelligence Center |
| **Backend API** | Node.js 18+, Express 4.21, Prisma ORM 6.19, Socket.IO 4.8, Nodemailer, Bcrypt.js, JWT, `qrcode`, `cookie-parser` | RESTful API, JWT & RBAC middleware, ACID transactions, WebSocket event rooms, email dispatch |
| **Database** | PostgreSQL (Neon Serverless), Prisma Client 6.19 | 14 relational models, foreign keys, versioned migrations, compound unique indexes |
| **ML Microservice** | Python 3.11+, FastAPI 0.110+, Uvicorn, scikit-learn 1.4+, pandas, numpy, joblib, Pydantic | Isolated inference microservice, data quality audits, baseline evaluation registry |
| **Hosting & Cloud** | Vercel (Frontend), Render (Backend & ML Services), Neon (PostgreSQL) | Production deployment across free-tier cloud infrastructure |

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |         React 18 / Vite Client        |
                                  |    (Patient / Doctor / Admin UI)      |
                                  +-------------------+-------------------+
                                                      |
                                          HTTP / REST | WebSocket (Socket.IO)
                                                      v
                                  +---------------------------------------+
                                  |        Express.js Backend API         |
                                  |               (Port 5001)             |
                                  |  - Dual-Token Auth (Cookie + Bearer)  |
                                  |  - Dynamic Slot Generator & Locking   |
                                  |  - Smart Waitlist Auto-Allocation     |
                                  |  - Cryptographic QR Verification      |
                                  +---------+-------------------+---------+
                                            |                   |
                        Prisma Transactions |                   | HTTP + X-Internal-Token
                                (Port 5432) |                   | (Port 5002, 3000ms timeout)
                                            v                   v
                     +-----------------------------+     +-------------------------------+
                     |   Neon PostgreSQL Database  |     |   Python FastAPI ML Service   |
                     |                             |     |          (Port 5002)          |
                     |  - Users, Doctors, Patients |     |  - Waiting Time Regressor     |
                     |  - Appointments & Slots     |     |  - Availability Classifier    |
                     |  - Waitlists & Triage Logs  |     |  - Duration Regressor         |
                     |  - Attendance Sessions      |     |  - Department Demand Forecast |
                     |  - In-App Notifications     |     |  - Governance Model Registry  |
                     +-----------------------------+     +-------------------------------+
```

---

## 📸 Screenshots

### Apollo-Grade Specialists Directory & Online Booking
![Doctor Directory](docs/screenshots/mediflow_home_directory.jpg)
*Filter verified medical specialists across Pune Central Hospital by department, review consultation fees, check real-time presence, and book instant appointment slots.*

### Emergency Care Desk & Architecture Overview
![Emergency Desk & Architecture](docs/screenshots/mediflow_emergency_architecture.jpg)
*24/7 Rapid response ambulance desk with direct helpline dialing and live system architecture monitoring.*

> **Note:** Additional live application walkthrough demonstrations and video showcases will be updated soon.

---

## 📁 Project Structure

```
mediflow-ai/
├── backend/                        # Node.js / Express Backend Service
│   ├── src/
│   │   ├── config/                 # db.js (Prisma Client) & socket.js (Socket.IO rooms)
│   │   ├── controllers/            # Auth, Appointment, Doctor, Attendance, Notification, Triage, AI, Check-In
│   │   ├── middleware/             # JWT authMiddleware, RBAC & rateLimiter guards
│   │   ├── routes/                 # Express REST endpoint routers (/api/*)
│   │   ├── services/               # Core business services
│   │   │   ├── ai/                 # mlServiceClient.js, aiService.js
│   │   │   ├── appointment.service.js
│   │   │   ├── waitlist.service.js
│   │   │   ├── priorityService.js
│   │   │   ├── allocationService.js
│   │   │   ├── checkInService.js
│   │   │   ├── doctorAttendanceService.js
│   │   │   ├── notificationService.js
│   │   │   └── triageService.js
│   │   ├── app.js                  # Express middleware & CORS configuration
│   │   └── server.js               # HTTP & Socket.IO server entry point
│   ├── tests/                      # ML integration tests
│   ├── .env.example                # Backend environment template
│   └── package.json
├── database/                       # Database Definition & Migrations
│   ├── migrations/                 # Versioned PostgreSQL Prisma migrations
│   ├── schema.prisma               # Authoritative Prisma Schema (14 models)
│   └── seed.js                     # Database seeder with demo accounts & schedules
├── frontend/                       # React 18 / Vite Client Application
│   ├── public/
│   │   └── _redirects              # Static SPA routing fallback rule
│   ├── src/
│   │   ├── components/             # Navbar, NotificationBell, ProtectedRoute, UI primitives
│   │   ├── context/                # AuthContext (Dual-token session provider)
│   │   ├── hooks/                  # useSocket subscription hook
│   │   ├── pages/                  # Route views (Home, Doctors, Booking, MyAppointments, Dashboards, Queue)
│   │   └── services/               # api.js (Axios with Bearer interceptor) & socket.js
│   ├── vercel.json                 # Vercel sub-directory deployment configuration
│   ├── .env.example                # Frontend environment template
│   └── package.json
├── ml-service/                     # Python FastAPI Machine Learning Microservice
│   ├── app/
│   │   ├── api/routes/             # /health, /predict/*, /models/*, /data-quality/*
│   │   ├── core/                   # Security (X-Internal-Token) & Pydantic settings
│   │   ├── schemas/                # Request and response validation schemas
│   │   └── services/               # Predictor and data quality audit services
│   ├── artifacts/                  # Trained scikit-learn .joblib artifacts & model_registry.json
│   ├── data/development/           # Isolated synthetic development benchmark dataset (4,080 rows)
│   ├── tests/                      # Pytest test suite (15 tests)
│   ├── requirements.txt            # Python dependencies
│   └── .env.example
├── docs/                           # Engineering specifications & UI screenshots
├── render.yaml                     # Render Blueprint specification (API + ML services)
├── vercel.json                     # Root Vercel SPA routing & security headers
├── .env.example                    # Master environment template
└── README.md
```

---

## 💻 Local Installation & Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** v3.11 or higher with `pip`
- **PostgreSQL:** v14.0 or higher (or a free Neon PostgreSQL connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/sachityadav-2007/mediflow-ai.git
cd mediflow-ai
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm install
npm --prefix backend install
npm --prefix frontend install

# Install Python ML service dependencies
cd ml-service
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

---

## ⚙️ Environment Configuration

### 1. Backend Environment (`backend/.env`)
Copy the backend template:
```bash
cp backend/.env.example backend/.env
```

Configure key variables:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173,https://mediflow-ai-app.vercel.app
DATABASE_URL="postgresql://user:password@localhost:5432/mediflow_ai?schema=public"
JWT_SECRET=super_secure_random_jwt_key_min_32_characters
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:5002
ML_SERVICE_SECRET=mediflow_internal_ml_service_secret_2026
```

### 2. Frontend Environment (`frontend/.env`)
Copy the frontend template:
```bash
cp frontend/.env.example frontend/.env
```

Configure:
```env
VITE_API_URL=http://localhost:5001
```

### 3. ML Service Environment (`ml-service/.env`)
Copy the ML service template:
```bash
cp ml-service/.env.example ml-service/.env
```

Configure:
```env
ML_SERVICE_PORT=5002
ML_SERVICE_SECRET=mediflow_internal_ml_service_secret_2026
```

---

## 🗄️ Database Provisioning & Migrations

MediFlow AI uses Prisma ORM with versioned migrations:

```bash
# 1. Generate Prisma Client
npx --prefix backend prisma generate --schema=database/schema.prisma

# 2. Sync schema with PostgreSQL database
npx --prefix backend prisma db push --schema=database/schema.prisma

# 3. Seed initial doctors, schedules, and test accounts
npm --prefix backend run seed
```

---

## 🚦 Running the Application

For full end-to-end functionality, run the three services concurrently:

### Terminal 1: Python FastAPI ML Service (Port 5002)
```bash
cd ml-service
source venv/bin/activate
PYTHONPATH=. python3 -m uvicorn app.main:app --host 0.0.0.0 --port 5002
```
*Health probe:* `curl -s http://localhost:5002/health`

### Terminal 2: Express Backend API (Port 5001)
```bash
npm --prefix backend run dev
```
*Health probe:* `curl -s http://localhost:5001/api/health`

### Terminal 3: React / Vite Frontend Client (Port 5173)
```bash
npm --prefix frontend run dev
```
*Access UI:* Open `http://localhost:5173` in your browser.

---

## ☁️ Production Deployment

The project is deployed across free-tier cloud platforms:

| Service | Hosting Platform | URL | Configuration |
|:---|:---|:---|:---|
| **Frontend Client** | Vercel | [https://mediflow-ai-app.vercel.app](https://mediflow-ai-app.vercel.app) | `vercel.json` SPA rewrites (`/(.*) -> /index.html`), `_redirects` fallback |
| **Backend API** | Render | `https://mediflow-api-bz27.onrender.com` | `render.yaml` Web Service, Node.js runtime, Socket.IO enabled |
| **ML Microservice** | Render | `https://mediflow-ml-service.onrender.com` | `render.yaml` Python Web Service, Uvicorn server |
| **Database** | Neon | `ep-dark-rain-*.aws.neon.tech` | Serverless PostgreSQL with connection pooling |

---

## 📡 API Documentation

### Authentication & Profiles
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Register new patient account |
| `POST` | `/api/auth/login` | Public | Authenticate user, issue HTTP-only cookie, and return token in JSON |
| `POST` | `/api/auth/logout` | Authenticated | Clear session cookie and invalidate local storage |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

### Doctors, Schedules & Smart Presence
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/doctors` | Public | List verified doctors with search and department filters |
| `GET` | `/api/doctors/:id` | Public | Get doctor profile, active schedules, and current presence |
| `GET` | `/api/presence/me` | Doctor | Fetch logged-in doctor attendance status, duration & active session |
| `GET` | `/api/presence/qr/active` | Doctor / Admin | List active cryptographically signed hospital QR gates |
| `POST` | `/api/presence/qr/check-in` | Doctor | Verify signed QR token & transition doctor to `PRESENT` |
| `POST` | `/api/presence/qr/check-out` | Doctor | Check out of hospital shift, record duration & transition to `OFFLINE` |
| `PUT` | `/api/presence/status` | Doctor | Fast presence state toggle (`AVAILABLE`, `IN_CONSULTATION`, `ON_BREAK`) |

### Appointments & Slots
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/appointments/slots/:doctorId` | Authenticated | Fetch available consultation slots for selected doctor and date |
| `POST` | `/api/appointments` | Patient | Book consultation slot inside an atomic Prisma transaction |
| `PUT` | `/api/appointments/:id/reschedule` | Patient / Doctor / Admin | Atomically reschedule appointment with waitlist reallocation |
| `PUT` | `/api/appointments/:id/cancel` | Patient / Doctor / Admin | Cancel appointment and auto-allocate freed slot to waitlist |
| `GET` | `/api/appointments/my` | Patient | View patient's booked appointments and digital QR passes |

### Smart Waitlist & Priority Allocation
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/waitlist` | Patient | Join doctor's waitlist with clinical urgency and rule-based priority scoring |
| `GET` | `/api/waitlist/my` | Patient | View logged-in patient's active waitlist entries |
| `GET` | `/api/waitlist/doctor/my` | Doctor | View doctor's ranked waitlist triage queue |
| `PUT` | `/api/waitlist/:id/leave` | Patient / Admin | Leave waitlist queue |
| `POST` | `/api/waitlist/allocate` | Admin / Doctor | Manually trigger smart allocation of freed slot to waitlist |

### Reception Check-In & OPD Queue
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/check-in/appointment/:id/qr` | Owner / Doctor / Admin | Generate or retrieve signed 48-hour appointment check-in QR pass |
| `POST` | `/api/check-in/scan` | Authenticated | Scan patient QR token, stamp `checkedInAt`, and enter queue |
| `GET` | `/api/check-in/queue/:doctorId` | Public | Live anonymized OPD queue board for clinic waiting rooms |
| `PUT` | `/api/check-in/queue/consultation/:id` | Doctor / Admin | Update consultation lifecycle (`START` -> `COMPLETE` -> `NO_SHOW`) |

### In-App Notifications
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/notifications` | Authenticated | Retrieve paginated notifications and unread count |
| `GET` | `/api/notifications/unread-count` | Authenticated | Fast unread notification count lookup for Navbar badge |
| `PATCH` | `/api/notifications/read-all` | Authenticated | Mark all unread notifications as read |
| `PATCH` | `/api/notifications/:id/read` | Owner Only | Mark single notification as read |

### Machine Learning & AI Intelligence
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/ai/model-status` | Authenticated | Health and readiness status of all 4 ML models |
| `GET` | `/api/ai/waiting-time` | Authenticated | Advisory patient waiting-time inference |
| `GET` | `/api/ai/doctor-availability` | Authenticated | Advisory doctor availability and delay probability |
| `GET` | `/api/ai/appointment-duration` | Authenticated | Advisory consultation duration inference |
| `GET` | `/api/ai/appointment-demand` | Authenticated | Department demand analysis & 7-day rolling forecast |
| `GET` | `/api/ai/admin/evaluation` | Admin Only | Full model evaluation registry with baseline comparisons |
| `GET` | `/api/ai/admin/data-quality` | Admin Only | Prospective timestamp completeness & production readiness audit |
| `POST` | `/api/ai/admin/retrain` | Admin Only | Production retraining trigger (gated until $\ge 500$ real events) |

---

## 🧠 Machine Learning Microservice & Governance

### Scientific Data Governance
MediFlow AI adheres to strict healthcare software governance:
- **Transparent Readiness Status:** Models in production are transparently classified as `IMPLEMENTED_BUT_INSUFFICIENT_DATA` until verified clinical timestamps accumulate.
- **Benchmark Evaluation:** The 4 machine learning pipelines were trained and benchmarked against naive baselines using an isolated synthetic development dataset (4,080 rows in `ml-service/data/development/`).
- **Prospective Data Capture:** Versioned migration `20261103210000_add_prospective_consultation_timestamps` added timestamp columns to the PostgreSQL database. Production retraining (`/api/ai/admin/retrain`) remains strictly gated until $\ge 500$ clinical events accumulate.

### The Four Machine Learning Pipelines
1. **Patient Waiting-Time Regressor:** `RandomForestRegressor` (Features: queue position, priority weight, doctor load ratio, hour of day).
2. **Doctor Availability & Delay Classifier:** `RandomForestClassifier` with balanced class weights (Features: scheduled shift, check-in variance, day of week).
3. **Consultation Duration Regressor:** `GradientBoostingRegressor` (Features: clinical department, triage level, age bracket, time of day).
4. **Department Demand Forecaster:** Time-Series `RandomForestRegressor` with lag features (Features: Lag $t-1$, Lag $t-7$, 7-day rolling average).

---

## 👥 Role-Based Demo Credentials

The database seeder provisions demo accounts for demonstration and testing:

| Role | Email Address | Password | Context |
|:---|:---|:---|:---|
| **PATIENT** | `rahul.verma@example.com` | `password123` | Patient with booked appointment and digital QR pass |
| **PATIENT** | `priya.singh@example.com` | `password123` | Patient with active waitlist entry |
| **DOCTOR** | `dr.jawale@mediflow.com` | `password123` | Dr. Sunil Jawale (Nephrology Consultant) |
| **DOCTOR** | `dr.sharma@mediflow.com` | `password123` | Dr. Rajesh Sharma (Cardiology Consultant, Room 101) |
| **DOCTOR** | `dr.patel@mediflow.com` | `password123` | Dr. Ananya Patel (Neurology Consultant, Room 204) |
| **ADMIN** | `admin@mediflow.com` | `password123` | System Administrator with AI Intelligence Center access |

*(Quick-fill 1-click viva demo buttons are also provided on the `/login` screen).*

---

## 🧪 Verification & Testing

### 1. Frontend Production Build Check
```bash
npm --prefix frontend run build
```
*Expected Result:* `✓ built in ~1.3s` without TypeScript or bundle errors.

### 2. Python ML Service Pytest Suite
```bash
cd ml-service
source venv/bin/activate
PYTHONPATH=. pytest tests
```
*Expected Result:* `15 passed` (verifies API contracts, model serialization, and data quality probes).

---

## 📄 License

This project is licensed under the **ISC** License as specified in `package.json`.

## 🙋 My Contributions (Ishita, @ishitahas)

My individual contributions to MediFlow AI, in addition to the shared platform built by my teammate:

- **Doctor Availability Calendar and Slot Management** (`b0b8497`): doctors add, block, unblock and remove date-specific slots; the booking engine honours them. Files: `DoctorAvailabilityCalendar.jsx`, `doctor.routes.js`, `doctor.controller.js`, `doctor.service.js`, `appointment.service.js`, `api.js`.
- **Doctor Directory Sorting and "Accepting Patients" Filter** (`5f864ca`): `DoctorDirectoryPage.jsx`.
- **Local frontend setup guide** (PR #2).

A full mapping of ISD course concepts to this code, with a manual test checklist, is in [`docs/ISD_CONCEPTS.md`](docs/ISD_CONCEPTS.md).
