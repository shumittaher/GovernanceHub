# GovernanceHub

GovernanceHub is a multi-tenant incident and governance management application built as a full-stack SaaS-style project.

The application demonstrates:

* Multi-tenant architecture
* JWT authentication
* Role-Based Access Control (RBAC)
* Superadmin platform management
* Incident management CRUD
* Tenant isolation
* React + TypeScript frontend
* Node.js + Express backend
* PostgreSQL database

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

## Backend

* Node.js
* Express
* TypeScript
* PostgreSQL
* JWT Authentication
* Zod validation
* bcrypt password hashing

## Infrastructure

* Render (frontend + backend + PostgreSQL)
* Docker (local PostgreSQL development)

---

# Features

## Authentication & Authorization

* JWT-based authentication
* Secure password hashing with bcrypt
* Role-based access control
* Protected frontend routes
* Protected backend APIs

## Roles

### Superadmin

Platform-level management role.

Capabilities:

* Create tenants
* Delete tenants
* Create tenant admins
* Delete tenant admins

The superadmin does not access tenant incidents directly.

### Admin

Tenant administrator role.

Capabilities:

* Create users within their tenant
* Create incidents
* Edit incidents
* Delete incidents
* View incidents

### User

Standard tenant user role.

Capabilities:

* View incidents
* Create incidents
* Edit incidents

Users cannot:

* Delete incidents
* Create users
* Access superadmin features

---

# Multi-Tenant Architecture

All incident and user data is tenant-scoped.

Tenant isolation is enforced at the backend using:

* JWT tenant information
* Route middleware
* Tenant-scoped SQL queries

Example:

```sql
WHERE tenant_id = $1
```

This prevents cross-tenant data access.

---

# Incident Management

Features include:

* Create incidents
* Edit incidents
* Delete incidents
* Incident detail page
* Summary dashboard cards
* Filtering
* Sorting
* Created/updated timestamps

Filtering:

* Severity
* Status

Sorting:

* Title
* Severity
* Status
* Assigned To
* Created At
* Updated At

---

# RBAC Highlights

Examples of backend-enforced authorization:

* Only admins can delete incidents
* Only admins can create tenant users
* Only superadmins can manage tenants/admins

Frontend visibility also aligns with permissions.

---

# Local Development

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Backend

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgres://...
JWT_SECRET=your-secret
```

---

# Database Setup

Run schema:

```bash
psql <database_url> < backend/sql/001_initial_schema.sql
```

Run seed data:

```bash
psql <database_url> < backend/sql/002_seed_data.sql
```

---

# Seed Accounts

The following demo accounts are available after running the seed script.

Password for all accounts:

```text
Password123!
```

## Superadmin

| Email                                   | Role       |
| --------------------------------------- | ---------- |
| [shumit@scb.com](mailto:shumit@scb.com) | superadmin |

## Admin

| Email                                 | Role  | Tenant                  |
| ------------------------------------- | ----- | ----------------------- |
| [sarah@scb.com](mailto:sarah@scb.com) | admin | Standard Chartered Bank |

## User

| Email                                             | Role | Tenant   |
| ------------------------------------------------- | ---- | -------- |
| [mike@kiwirail.co.nz](mailto:mike@kiwirail.co.nz) | user | KiwiRail |

---

# Deployment

The application is designed to deploy on Render using:

* Render PostgreSQL
* Render Web Service (backend)
* Render Static Site (frontend)

Frontend uses:

```env
VITE_API_BASE_URL
```

Backend uses:

```env
DATABASE_URL
JWT_SECRET
```

---

# Screens / Modules

* Login
* Incident Dashboard
* Incident Detail Page
* User Creation
* Superadmin Admin Management
* Superadmin Tenant Management

---

# Project Goals

This project was built to demonstrate practical full-stack software engineering concepts including:

* SaaS architecture
* Authentication and authorization
* RBAC
* Tenant isolation
* CRUD workflows
* REST APIs
* Frontend state management
* Deployment workflows
* Production-style application structure

---

# Future Improvements

Potential future enhancements:

* Status/severity badges
* Audit logs
* Activity timeline/comments
* Search
* Pagination
* Charts and analytics
* Email notifications
* Dark mode
* Automated tests
* CI/CD pipeline
* Database migrations
