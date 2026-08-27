# LaptopCare Business Management System

A responsive laptop-repair management dashboard built with Nuxt 4 and Vue 3 Composition API. This portfolio project demonstrates practical CRUD workflows, responsive business UI, Prisma data modelling, and a gradual migration from browser-only state to server persistence.

## Features

- Dashboard metrics for customers and repair-order status
- Customer management with Prisma-backed creation and listing
- Repair-service catalogue with pricing
- Repair-order workflow with laptop brand/model selection and status tracking
- Responsive desktop and mobile layout
- SQLite database with Prisma migrations
- Simple demo login for local presentation

## Tech stack

Nuxt 4 · Vue 3 · TypeScript · Prisma 7 · SQLite · CSS

## Run locally

```bash
npm install
npx prisma generate
npm run dev
```

Open `http://localhost:3000`. The demo login accepts any non-empty username and password.

## Production check

```bash
npm run build
```

## Structure

- `app/app.vue` — dashboard UI and Composition API state
- `server/api/customer` — customer API routes
- `prisma/schema.prisma` — customer, service, and repair-order models

## Roadmap

Complete server-side CRUD for services and repair orders, add authenticated sessions, extract reusable form/table components, and add unit plus end-to-end tests.
