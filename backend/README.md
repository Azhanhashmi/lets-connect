# Connect Backend

Production-ready REST API + real-time WebSocket server built with Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, Socket.io, and Cloudinary.

## Tech Stack

| Layer           | Technology                       |
|-----------------|----------------------------------|
| Runtime         | Node.js 20+                      |
| Framework       | Express.js                       |
| Language        | TypeScript (strict mode)         |
| Database        | PostgreSQL 15+                   |
| ORM             | Prisma 5                         |
| Auth            | JWT (jsonwebtoken + bcryptjs)    |
| Real-time       | Socket.io                        |
| File uploads    | Cloudinary + Multer              |
| Validation      | Zod                              |
| Security        | Helmet, CORS, express-rate-limit |
| Logging         | Morgan                           |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma               # Database schema & relations
│   └── migrations/
│       └── 0001_init.sql           # Raw SQL migration (reference)
│
├── src/
│   ├── index.ts                    # Entry point — HTTP + Socket.io server
│   ├── app.ts                      # Express app factory (middleware, routes)
│   │
│   ├── config/
│   │   ├── env.ts                  # Zod-validated environment variables
│   │   ├── prisma.ts               # Prisma singleton
│   │   └── cloudinary.ts           # Cloudinary SDK config
│   │
│   ├── types/
│   │   └── index.ts                # AuthenticatedRequest, JwtPayload, ApiResponse
│   │
│   ├── utils/
│   │   ├── AppError.ts             # AppError + typed subclasses
│   │   ├── response.ts             # sendSuccess / sendError / sendCreated
│   │   ├── jwt.ts                  # signToken / verifyToken
│   │   ├── multer.ts               # Memory-storage upload middleware
│   │   └── uploadImage.ts          # Cloudinary upload/delete helpers
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT authentication (authenticate)
│   │   ├── role.middleware.ts       # RBAC scaffold (requireRole)
│   │   ├── validate.middleware.ts   # Zod request validator
│   │   └── error.middleware.ts      # Global error + 404 handlers
│   │
│   ├── validators/
│   │   └── schemas.ts              # All Zod schemas
│   │
│   ├── services/                   # Business logic — no HTTP concerns
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── request.service.ts
│   │   ├── connection.service.ts
│   │   ├── message.service.ts
│   │   ├── compliment.service.ts
│   │   ├── question.service.ts
│   │   └── notification.service.ts
│   │
│   ├── controllers/                # Thin HTTP adapters → call services
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── request.controller.ts
│   │   ├── connection.controller.ts
│   │   ├── message.controller.ts
│   │   ├── compliment.controller.ts
│   │   ├── question.controller.ts
│   │   └── notification.controller.ts
│   │
│   ├── routes/
│   │   ├── index.ts                # Root router — mounts all modules
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── request.routes.ts
│   │   ├── connection.routes.ts
│   │   ├── message.routes.ts
│   │   ├── compliment.routes.ts
│   │   ├── question.routes.ts
│   │   └── notification.routes.ts
│   │
│   └── socket/
│       └── socket.handler.ts       # Socket.io events with JWT auth
│
├── .env.example
├── API_DOCS.md
├── README.md
├── package.json
└── tsconfig.json
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ running locally (or a connection string)
- Cloudinary account (free tier is fine)

### 1. Install
```bash
cd backend
npm install
```

### 2. Environment
```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/connect_db"

JWT_SECRET=replace_with_32_plus_random_chars_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:3000
```

### 3. Database

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE connect_db;"
```

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run
```bash
# Development (hot-reload)
npm run dev

# Production
npm run build
npm start
```

Server starts at `http://localhost:5000`.

---

## Environment Variables

| Variable                  | Required | Description                          |
|---------------------------|----------|--------------------------------------|
| `NODE_ENV`                | No       | `development` / `production` / `test` |
| `PORT`                    | No       | HTTP port (default 5000)             |
| `DATABASE_URL`            | ✅       | PostgreSQL connection string         |
| `JWT_SECRET`              | ✅       | Min 32 chars                         |
| `JWT_EXPIRES_IN`          | No       | JWT lifetime (default `7d`)          |
| `CLOUDINARY_CLOUD_NAME`   | ✅       | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`      | ✅       | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET`   | ✅       | Cloudinary API secret                |
| `CLIENT_URL`              | No       | Frontend origin for CORS             |

---

## API Overview

See **[API_DOCS.md](./API_DOCS.md)** for full route documentation.

| Method | Route                          | Auth | Description                          |
|--------|--------------------------------|------|--------------------------------------|
| POST   | /api/auth/register             | ❌   | Register + create profile            |
| POST   | /api/auth/login                | ❌   | Login, receive JWT                   |
| GET    | /api/auth/me                   | ✅   | Current user                         |
| GET    | /api/profile/:username         | ✅   | Public profile                       |
| PUT    | /api/profile                   | ✅   | Update own profile                   |
| POST   | /api/profile/avatar            | ✅   | Upload avatar to Cloudinary          |
| POST   | /api/requests/send             | ✅   | Send connect request                 |
| GET    | /api/requests/pending          | ✅   | Incoming pending requests            |
| POST   | /api/requests/accept/:id       | ✅   | Accept → creates connection + chat   |
| POST   | /api/requests/pass/:id         | ✅   | Pass on a request                    |
| POST   | /api/requests/later/:id        | ✅   | Save request for later               |
| GET    | /api/requests/later            | ✅   | Saved-for-later requests             |
| GET    | /api/connections               | ✅   | All connections                      |
| GET    | /api/messages/conversations    | ✅   | All conversations + last message     |
| GET    | /api/messages/:conversationId  | ✅   | All messages (marks read)            |
| POST   | /api/messages                  | ✅   | Send a message                       |
| POST   | /api/compliments               | ✅   | Send a compliment                    |
| GET    | /api/compliments/:username     | ✅   | Approved compliments                 |
| PATCH  | /api/compliments/:id/approve   | ✅   | Approve (owner only)                 |
| DELETE | /api/compliments/:id           | ✅   | Delete (owner only)                  |
| POST   | /api/questions                 | ✅   | Ask a question                       |
| POST   | /api/questions/:id/answer      | ✅   | Answer (owner only)                  |
| GET    | /api/questions/:username       | ✅   | Answered questions                   |
| GET    | /api/notifications             | ✅   | Latest 50 notifications              |
| PATCH  | /api/notifications/:id/read    | ✅   | Mark one as read                     |

---

## Socket.io

Authenticate via `auth.token`:
```js
const socket = io('http://localhost:5000', {
  auth: { token: 'Bearer <your-jwt>' }
});
```

| Direction       | Event           | Payload                                 |
|-----------------|-----------------|-----------------------------------------|
| Client → Server | `send_message`  | `{ conversationId, content }`           |
| Client → Server | `typing`        | `{ conversationId }`                    |
| Client → Server | `stop_typing`   | `{ conversationId }`                    |
| Server → Client | `receive_message`| Full message object with sender profile |
| Server → Client | `typing`        | `{ conversationId, userId, username }`  |
| Server → Client | `stop_typing`   | `{ conversationId, userId }`            |
| Server → Client | `notification`  | Notification object                     |
| Server → Client | `error`         | `{ message }`                           |

Real-time messages sent via Socket.io are **also persisted to PostgreSQL** — the REST and WS layers share the same database.

---

## Security

- **Helmet** sets secure HTTP headers
- **CORS** restricted to `CLIENT_URL`
- **Rate limiting**: 100 req/15 min globally, 10 req/15 min on auth routes
- **bcryptjs** with cost factor 12 for password hashing
- **JWT** verified on every protected request (including DB user existence check)
- **Zod** validates all request bodies and URL params before they reach controllers
- All Prisma queries use parameterised statements — no raw SQL injection surface
- Cascade deletes on all foreign keys — orphaned data cannot accumulate

---

## Role-Based Access Control

`src/middleware/role.middleware.ts` exports `requireRole(Role.ADMIN)`.  
Currently all authenticated users are `USER`. To expand:

1. Add a `role` column to the `User` model in `schema.prisma`
2. Create a migration
3. Uncomment the Prisma lookup in `role.middleware.ts`
4. Attach `requireRole(Role.MODERATOR)` or `requireRole(Role.ADMIN)` after `authenticate` on any route

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, randomly generated `JWT_SECRET`
- [ ] Run `npx prisma migrate deploy` (not `dev`)
- [ ] Point `CLIENT_URL` to your frontend domain
- [ ] Run behind a reverse proxy (nginx / Caddy) with TLS
- [ ] Set up PostgreSQL connection pooling (PgBouncer or Prisma Accelerate)
- [ ] Configure log shipping (stdout → Loki / Datadog / CloudWatch)
- [ ] Add a process manager (`pm2`, Docker, systemd)
