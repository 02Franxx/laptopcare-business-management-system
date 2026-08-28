# LaptopCare Business Management System

LaptopCare is a small full-stack laptop repair shop management system. It provides a responsive dashboard for managing customers, repair services, and repair orders, with Prisma-backed persistence and session-based authentication.

## Preview

Run the project locally to preview the Dashboard, Customer Management, Repair Services, and Repair Orders screens:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The repository intentionally does not include personal screenshots; the live local preview is the source of truth for the current UI.

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

## API Endpoints

Authentication:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

Customers:

```text
GET    /api/customer
POST   /api/customer
PATCH  /api/customer/:id
DELETE /api/customer/:id
```

Services:

```text
GET    /api/service
POST   /api/service
PATCH  /api/service/:id
DELETE /api/service/:id
```

Repair Orders:

```text
GET    /api/order
POST   /api/order
PATCH  /api/order/:id
DELETE /api/order/:id
```

Dashboard and health:

```text
GET    /api/dashboard
GET    /api/health
```

## Validation Rules

Customer:

- Name uses valid English characters and spaces
- Phone uses a valid numeric format
- Email must be valid

Service:

- Service name is required
- Price must be a number greater than 0

Repair Order:

- Customer must exist
- Service must exist
- Laptop brand, model, and problem are required
- Status must be `Pending`, `In Progress`, `Completed`, or `Cancelled`

## Demo Workflow

1. Login with the demo account.
2. Add a customer.
3. Add a repair service.
4. Create a repair order.
5. Update the repair order status.
6. Complete or cancel the order.
7. View the updated dashboard statistics.

## Requirements

- Node.js 20 or newer
- npm

## Installation

```bash
npm install
npx prisma generate
```

## Environment configuration

```bash
Copy-Item .env.example .env
```

Default `.env` configuration:

```env
DATABASE_URL="file:./dev.db"
```

The local SQLite database is intentionally ignored by Git.

## Database setup and Demo Account

```bash
npx prisma db push
npm run db:seed
```

Demo account:

```text
Username: admin
Password: admin123
```

The seed command creates three customers, three repair services, three repair orders, and the Demo Account. It is safe to run repeatedly.

## Development

```bash
npm run dev
```

## Testing

With the development server running:

```bash
npm run test:smoke
```

The smoke test covers health checks, unauthorized API access, login, protected API reads, Customer CRUD, Service CRUD, Repair Order CRUD, Cancelled status, invalid input, and cleanup.

## Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
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
