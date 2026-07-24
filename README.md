# DigitalHorses - Lead Management Platform

A full-stack lead management application built with Express, React, Node.js, and SQLite.

Built for [Digital Heroes Training Task](https://digitalheroesco.com)

## Features

- **Public Lead Capture Form** - Anyone can submit their information
- **Two Roles** - Admin and Member with enforced permissions on client and server
- **Lead Lifecycle** - Status pipeline (new → contacted → qualified → proposal → won/lost)
- **Assignment** - Assign leads to team members
- **Notes & Activity Trail** - Timestamped notes with full activity history
- **Pagination & Filtering** - Filter by status, text search, paginated results
- **JWT Authentication** - Secure token-based auth

## Tech Stack

- **Backend:** Express.js, SQLite, JWT, bcryptjs
- **Frontend:** React (Vite), React Router
- **Testing:** Jest, Supertest

## Quick Start

```bash
# Install all dependencies
npm run install-all

# Start both server and client
npm run dev
```

Server runs on `http://localhost:5000`, client on `http://localhost:3000`.

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| GET | `/api/auth/me` | Yes | Get current user info |

#### POST /api/auth/register

```json
{ "name": "John", "email": "john@test.com", "password": "123456", "role": "member" }
```

Response `201`:
```json
{ "user": { "id": "...", "name": "John", "email": "john@test.com", "role": "member" }, "token": "..." }
```

#### POST /api/auth/login

```json
{ "email": "john@test.com", "password": "123456" }
```

Response `200`:
```json
{ "user": { "id": "...", "name": "John", "email": "john@test.com", "role": "member" }, "token": "..." }
```

### Leads

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/api/leads` | Yes | All | List leads (members see only assigned) |
| GET | `/api/leads/:id` | Yes | All | Get single lead |
| POST | `/api/leads` | Yes | All | Create a lead |
| PUT | `/api/leads/:id` | Yes | All | Update lead |
| DELETE | `/api/leads/:id` | Yes | Admin only | Delete lead |
| GET | `/api/leads/:id/activities` | Yes | All | Get activity trail |

#### Query Parameters for GET /api/leads

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter by status |
| assigned_to | string | Filter by assignee (admin only) |
| search | string | Search name, email, company |

#### POST /api/leads

```json
{ "name": "Jane", "email": "jane@test.com", "phone": "123-456-7890", "company": "ACME", "source": "web", "notes": "Interested" }
```

Response `201`:
```json
{ "id": "...", "name": "Jane", "email": "jane@test.com", "status": "new", "source": "web", ... }
```

#### PUT /api/leads/:id

```json
{ "status": "qualified", "notes": "Followed up - interested", "assigned_to": "user-id" }
```

Response `200`: Updated lead object.

### Users

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/api/users` | Yes | Admin only | List all users |

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 500 | Server error |

## Running Tests

```bash
npm test
```

Tests cover:
- Auth: registration, duplicate email rejection, login, invalid credentials, /me endpoint, token validation
- Leads: creation, auth enforcement, pagination, filtering, single get, update, activities, member access restriction, admin delete

## Deployment

### Render (Free Tier)

1. Create a Web Service from your GitHub repo
2. Build command: `cd client && npm install && npm run build`
3. Start command: `cd server && npm start`
4. Set environment variables: `JWT_SECRET`, `PORT`
5. Add `--static-dir` to serve the built React app from Express

## Credentials (Testing)

Register at `/register` to create accounts. First user will be member; set role to admin via direct DB manipulation or register with `"role": "admin"`.

---

Built for [Digital Heroes Training Task](https://digitalheroesco.com)
