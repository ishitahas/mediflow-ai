# 🗄️ MediFlow AI — Database Layer & Prisma ORM

This directory contains the database schema, versioned migrations, and seeder scripts for **MediFlow AI**.

For complete schema specifications, field-by-field definitions, foreign keys, and ER diagrams, see:  
👉 **[`database/DATABASE.md`](./DATABASE.md)**

---

## 📁 Directory Structure

```text
database/
├── schema.prisma       # Complete Prisma schema definition (14 Models, 10 Enums)
├── DATABASE.md         # Comprehensive database specification and ER documentation
├── seed.js             # Automated seeder (Apollo-grade Doctors, Admin, Patients, Slots)
├── migrations/         # Immutable PostgreSQL SQL migration history
├── queries.sql         # Handy SQL verification queries for inspection
└── README.md           # Database directory overview (this file)
```

---

## 📊 Schema Highlights

MediFlow AI uses a normalized relational architecture with **14 models** across 5 functional domains:

1. **Identity & Authentication:** `User`
2. **Clinical Personnel:** `Doctor`, `DoctorAvailability`, `PresenceLog`, `DoctorAttendance`, `HospitalQRCode`
3. **Outpatient Management:** `Patient`, `TriageHistory`
4. **Appointment & Queue Engine:** `AppointmentSlot`, `Appointment`, `Waitlist`, `QRScanAudit`
5. **System Observability & Messaging:** `PredictionLog`, `Notification`

---

## ⚡ Essential Database Commands

Execute from root:

```bash
# Validate Prisma schema
npm run db:validate

# Apply migrations
npm run db:migrate

# Seed database with sample doctors, patients, and appointment slots
npm run db:seed

# Open visual web database browser (Prisma Studio at http://localhost:5555)
npm run db:studio
```

For full database documentation, see [`DATABASE.md`](./DATABASE.md).
