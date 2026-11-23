# 🎨 MediFlow AI — Frontend Application

This directory contains the user interface for **MediFlow AI**, a modern, responsive Single Page Application (SPA) designed for hospital outpatients, attending doctors, and hospital administrators.

---

## 🛠️ Technology Stack

* **Framework:** React 18.2.0
* **Build System:** Vite 5.4.21
* **Styling:** Tailwind CSS 3.4.1
* **Client-Side Routing:** React Router DOM 6.22.0
* **HTTP Client:** Axios (configured with credentials and Bearer token fallback)
* **Real-Time Client:** Socket.IO Client 4.7.4
* **Icons:** Lucide React
* **QR Scanning:** HTML5-QRCode (browser webcam & kiosk support)

---

## 📁 Directory Structure

```text
frontend/
├── public/                 # Static public assets (icons, favicon, manifest)
├── src/
│   ├── components/         # Shared UI and layout components
│   │   ├── ui/             # Reusable design system primitives (Button, Card, Badge, Modal, etc.)
│   │   ├── Navbar.jsx      # Global navigation header with role-based links
│   │   ├── ProtectedRoute.jsx # Role-Based Access Control (RBAC) route guard
│   │   ├── NotificationBell.jsx # In-app notification center bell with live badge
│   │   ├── DoctorCard.jsx  # Doctor directory card with presence badge & booking action
│   │   ├── ServerStatus.jsx# Backend connectivity indicator
│   │   └── ScrollToTop.jsx # Route change viewport scroll reset
│   ├── context/
│   │   └── AuthContext.jsx # Global auth provider (user state, login, logout, roles)
│   ├── hooks/
│   │   └── useSocket.js    # React hook for real-time Socket.IO subscriptions
│   ├── pages/              # 13 Dedicated application views
│   │   ├── HomePage.jsx             # Landing page and clinical network overview
│   │   ├── LoginPage.jsx            # Multi-role authentication portal with 1-click test logins
│   │   ├── RegisterPage.jsx         # Patient account registration view
│   │   ├── DoctorDirectoryPage.jsx  # Interactive doctor catalog with search & specialty filters
│   │   ├── BookAppointmentPage.jsx  # Discrete 30-min slot selector & booking engine
│   │   ├── MyAppointmentsPage.jsx   # Patient appointment history & digital QR pass view
│   │   ├── PatientDashboard.jsx     # Patient clinical portal
│   │   ├── DoctorDashboard.jsx      # Doctor consultation queue and status controls
│   │   ├── DoctorAttendancePage.jsx # Doctor shift check-in / check-out with QR scanner
│   │   ├── ReceptionCheckInPage.jsx # Hospital reception QR scanner portal (/check-in)
│   │   ├── LiveQueuePage.jsx        # Public OPD waiting room display (/queue/:doctorId)
│   │   ├── PatientWaitlistPage.jsx  # Patient smart waitlist priority tracker
│   │   ├── AdminDashboard.jsx       # Hospital control center with KPIs and staff workload
│   │   └── HealthAssistantPage.jsx  # AI symptom triage & specialist guidance
│   ├── services/
│   │   ├── api.js          # Pre-configured Axios instance with dual-token auth
│   │   └── socket.js       # Socket.IO client instance connecting to backend
│   ├── App.jsx             # React Router v6 route configuration
│   ├── index.css           # Tailwind CSS directives and custom clinical styles
│   └── main.jsx            # Application DOM mount entry point
├── Dockerfile              # Multi-stage production container definition (Nginx)
├── nginx.conf              # Production Nginx reverse proxy configuration
├── package.json            # Frontend dependencies and npm scripts
├── tailwind.config.js      # Tailwind design tokens and color scheme
├── vercel.json             # Vercel Single Page Application rewrite rules
└── vite.config.js          # Vite bundler and development server configuration
```

---

## 🚀 Running the Frontend

### Prerequisites
* Node.js 20+ installed
* Running backend on port 5001 (or configured `VITE_API_URL`)

### Development Mode
```bash
# From repository root:
npm run dev:frontend

# Or directly from frontend/:
cd frontend
npm install
npm run dev
```
The application will launch at: **`http://localhost:5173`**

### Production Build
```bash
cd frontend
npm run build
```
Generates an optimized static distribution in `frontend/dist/`.

---

## 🌐 Environment Configuration

Create a `.env` file inside `frontend/` (or copy from `.env.example`):

```env
# Backend API Base URL
VITE_API_URL=http://localhost:5001
```

In production on Vercel, `VITE_API_URL` is set to `https://mediflow-api-bz27.onrender.com`.

---

## 🔗 Dependencies on Other Components

* **Backend API (`backend/`):** Consumes REST endpoints at `/api/*` for authentication, booking, queue states, and doctor data.
* **WebSocket Engine:** Subscribes to real-time events (`queue_updated`, `doctor_presence_updated`, `waitlist_allocated`, `notification_received`) on port 5001.
