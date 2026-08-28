# LaptopCare Business Management System

LaptopCare is a small full-stack laptop repair shop management system. It provides a responsive dashboard for managing customers, repair services, and repair orders, with Prisma-backed persistence and session-based authentication.

## Features

- Dashboard statistics from the database: customers, orders, statuses, cancelled orders, and revenue
- Customer CRUD with validation and delete business rules
- Repair service CRUD with price validation
- Repair order CRUD with customer/service relationships
- Order statuses: Pending, In Progress, Completed, and Cancelled
- Login, logout, current-user session, and protected API routes
- Responsive Vue UI with confirmation dialogs and validation feedback
- Repeatable demo data seed and API smoke tests

## Tech stack

- Nuxt 4
- Vue 3 Composition API
- TypeScript
- Prisma 7
- SQLite
- Node.js `scrypt` password hashing
- CSS responsive layout

## Requirements

- Node.js 20 or newer
- npm

## Installation

```bash
npm install
npx prisma generate
```

## Environment configuration

Copy the example environment file:

```bash
Copy-Item .env.example .env
```

Default `.env` configuration:

```env
DATABASE_URL="file:./dev.db"
```

The local SQLite database is intentionally ignored by Git.

## Database setup and demo data

Synchronize the local schema and create demo records:

```bash
npx prisma db push
npm run db:seed
```

Demo account:

```text
Username: admin
Password: admin123
```

The seed command creates three customers, three repair services, and three repair orders. It is safe to run repeatedly.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

With the development server running, execute:

```bash
npm run test:smoke
```

The smoke test covers health checks, unauthorized API access, login, protected API reads, Customer CRUD, Service CRUD, Repair Order CRUD, Cancelled status, invalid input, and cleanup.

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
app/app.vue                 Vue dashboard UI
server/api                  Authentication, CRUD, health, and dashboard APIs
server/middleware            API session protection
server/utils                 Prisma and session utilities
prisma/schema.prisma         Database models
scripts/seed.mjs             Demo database seed
scripts/smoke-test.mjs       API and business-rule smoke test
```

## Portfolio scope

This repository intentionally focuses on a complete small-business MVP rather than adding unrelated modules. Future production hardening could include role-based permissions, a shared session store, and browser-level end-to-end tests.
