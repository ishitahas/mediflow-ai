# 🤝 Contributing to MediFlow AI

Thank you for your interest in contributing to **MediFlow AI**! This guide outlines our development workflow, coding standards, and contribution process.

---

## 📋 Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment for all contributors. Please treat everyone with respect, kindness, and constructive feedback.

---

## 🛠️ Development Setup

### 1. Prerequisites
* **Node.js:** `v20.x` or higher
* **npm:** `v10.x` or higher
* **Python:** `v3.11+` (if contributing to `ml-service/`)
* **PostgreSQL:** `v16` (or a free [Neon](https://neon.tech) cloud database)

### 2. Clone the Repository
```bash
git clone https://github.com/sachityadav-2007/mediflow-ai.git
cd mediflow-ai
```

### 3. Install All Dependencies
From the repository root:
```bash
npm run install:all
```
This installs dependencies for both `backend/` and `frontend/`.

### 4. Configure Environment Variables
Copy the example environment templates:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Update `DATABASE_URL` in `backend/.env` with your PostgreSQL connection string.

### 5. Setup Database
```bash
# Validate Prisma schema
npm run db:validate

# Apply migrations
npm run db:migrate

# Seed database with sample doctors, patients, and slots
npm run db:seed
```

### 6. Start Development Servers
Run both backend and frontend concurrently with a single command:
```bash
npm run dev
```
* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:5001`

---

## 🌿 Branching Strategy

* Work on topic branches branched from `main`:
  * Feature: `feat/feature-name`
  * Bugfix: `fix/bug-description`
  * Documentation: `docs/doc-update`
  * Refactoring: `refactor/component-name`

---

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

* `feat: add doctor appointment cancellation email notification`
* `fix: prevent duplicate slot booking under race condition`
* `docs: update DATABASE.md with new index specification`
* `refactor: extract reusable Button primitive to components/ui`
* `test: add unit tests for priority scoring algorithm`
* `chore: update dependencies and lint configuration`

---

## 🧪 Testing & Verification Before Submitting PR

Before pushing your changes, ensure all verification checks pass:

```bash
# 1. Frontend production build
npm run build

# 2. Prisma schema validation
npm run db:validate

# 3. Backend tests
cd backend && npm test

# 4. ML microservice tests (if modified)
cd ml-service && python3 -m pytest tests/
```

---

## 📤 Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `sachityadav-2007/mediflow-ai`.
3. Provide a clear summary of changes, rationale, and screenshots for any UI updates.
4. Verify that CI builds and tests pass.
