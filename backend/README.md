# Nabila Salon — Backend API

Node.js · Express · MongoDB REST API serving both the Flutter mobile app and the React web frontend.

## Prerequisites

- **Node.js** 18+
- **MongoDB** 7+ (local: `mongod` or MongoDB Community) **or** MongoDB Atlas

## Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Copy env file and set your MONGO_URI
cp .env.example .env

# 3. Seed the database (creates services, employees, demo users)
npm run seed

# 4. Start the API server
npm run dev          # nodemon — auto-restarts on file changes
# OR
npm start            # production
```

Server starts on **http://localhost:5000**

---

## Demo Credentials

| Role     | Email                       | Password    |
|----------|-----------------------------|-------------|
| Client   | risara@demo.com               | client123   |
| Employee | zara@nabilasalon.com        | employee123 |
| Admin    | admin@nabilasalon.com       | admin123    |

---

## Connect the Web Frontend

In `web/.env` change:
```
VITE_USE_BACKEND=true
```
Then restart `npm run dev` in the `web/` directory.

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Path              | Auth     | Body                                     | Returns             |
|--------|-------------------|----------|------------------------------------------|---------------------|
| POST   | `/register`       | —        | `name, email, password, phone?, role?`   | `{ token, user }`  |
| POST   | `/login`          | —        | `email, password, role`                  | `{ token, user }`  |
| GET    | `/me`             | Bearer   | —                                        | `{ user }`         |
| PATCH  | `/profile`        | Bearer   | `name?, phone?`                          | `{ user }`         |
| POST   | `/change-password`| Bearer   | `currentPassword, newPassword`           | `{ message }`      |

### Services — `/api/services`

| Method | Path          | Auth       | Description                    |
|--------|---------------|------------|--------------------------------|
| GET    | `/`           | —          | List all active services       |
| GET    | `/:id`        | —          | Get one service                |
| POST   | `/`           | Admin      | Create service                 |
| PATCH  | `/:id`        | Admin      | Update service                 |
| DELETE | `/:id`        | Admin      | Soft-delete (sets isActive=false)|

### Employees — `/api/employees`

| Method | Path              | Auth          | Description                  |
|--------|-------------------|---------------|------------------------------|
| GET    | `/`               | —             | List all active employees    |
| GET    | `/:id`            | —             | Get one employee             |
| GET    | `/:id/slots`      | —             | Available slots (`?date=YYYY-MM-DD`) |
| POST   | `/`               | Admin         | Create employee profile      |
| PATCH  | `/:id`            | Owner/Admin   | Update availability, photo, etc. |

### Bookings — `/api/bookings`

| Method | Path                  | Auth          | Description                        |
|--------|-----------------------|---------------|------------------------------------|
| GET    | `/`                   | Bearer        | Get bookings (scoped by role)      |
| GET    | `/?status=confirmed`  | Bearer        | Filter by status                   |
| GET    | `/?date=YYYY-MM-DD`   | Bearer        | Filter by date                     |
| GET    | `/:id`                | Bearer        | Get one booking                    |
| POST   | `/`                   | Bearer (client)| Create booking                    |
| PATCH  | `/:id/cancel`         | Bearer        | Cancel a booking                   |
| PATCH  | `/:id/status`         | Admin/Employee | Update booking status              |

**POST /api/bookings body:**
```json
{
  "serviceId":  "...",
  "employeeId": "...",
  "date":       "2026-07-10",
  "startTime":  "10:00",
  "notes":      "optional"
}
```

### Admin — `/api/admin` (Admin role required)

| Method | Path       | Description                          |
|--------|------------|--------------------------------------|
| GET    | `/stats`   | Dashboard stats                      |
| GET    | `/users`   | All users (paginated, `?role=client`)|
| DELETE | `/users/:id` | Remove a user                      |
| GET    | `/revenue` | Revenue breakdown by employee/service|

---

## Response Format

All responses follow this envelope:
```json
{
  "success": true,
  "data": { ... }
}
```
Errors:
```json
{
  "success": false,
  "message": "Human-readable error"
}
```

## Authentication

Include the JWT token as a Bearer header:
```
Authorization: Bearer <token>
```

Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN` in `.env`).

---

## Project Structure

```
backend/src/
├── config/db.js          — MongoDB connection
├── models/
│   ├── User.js           — Auth model (bcrypt hashed password)
│   ├── Employee.js       — Employee profile + availability
│   ├── Service.js        — Salon services
│   └── Booking.js        — Bookings with embedded refs
├── routes/
│   ├── auth.js           — Login, register, me, profile
│   ├── services.js       — CRUD services
│   ├── employees.js      — Employees + slot generation
│   ├── bookings.js       — Create, list, cancel bookings
│   └── admin.js          — Stats, revenue, user management
├── middleware/
│   ├── auth.js           — protect() + authorize() middleware
│   └── errorHandler.js   — Global error handler + validation helper
├── utils/slots.js        — Available slot generation algorithm
├── seed/seed.js          — Database seeder
└── index.js              — Express app entry point
```
