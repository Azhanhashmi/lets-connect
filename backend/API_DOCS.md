# Connect Backend — API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT in the `Authorization` header:
```
Authorization: Bearer <token>
```
Tokens are returned from `/auth/register` and `/auth/login`.

---

## Health Check

```
GET /health
```
**Response**
```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## Auth

### Register
```
POST /api/auth/register
```
**Body**
```json
{
  "email": "alice@example.com",
  "password": "SecurePass1",
  "username": "alice",
  "displayName": "Alice"
}
```
Password rules: min 8 chars, at least 1 uppercase, at least 1 number.
Username rules: 3–30 chars, alphanumeric + underscores only.

**201 Response**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "clxxx",
      "email": "alice@example.com",
      "verified": false,
      "profile": {
        "id": "clyyy",
        "username": "alice",
        "displayName": "Alice",
        "avatar": null
      }
    }
  }
}
```

---

### Login
```
POST /api/auth/login
```
**Body**
```json
{ "email": "alice@example.com", "password": "SecurePass1" }
```
**200 Response** — same shape as register.

---

### Get Current User
```
GET /api/auth/me
```
🔒 Protected

**200 Response**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "email": "alice@example.com",
    "verified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "profile": { "username": "alice", "displayName": "Alice", "bio": null, ... }
  }
}
```

---

## Profile

### Get Profile by Username
```
GET /api/profile/:username
```
🔒 Protected

Returns the public profile including answered questions and approved compliments.

**200 Response**
```json
{
  "success": true,
  "data": {
    "id": "clyyy",
    "username": "alice",
    "displayName": "Alice",
    "avatar": "https://res.cloudinary.com/...",
    "bio": "Hello world",
    "interests": ["music", "travel"],
    "lookingFor": "Creative collaborators",
    "instagramLink": "https://instagram.com/alice",
    "websiteLink": "https://alice.dev",
    "questions": [...],
    "compliments": [...]
  }
}
```

---

### Update Profile
```
PUT /api/profile
```
🔒 Protected

**Body** (all fields optional)
```json
{
  "displayName": "Alice Smith",
  "bio": "Software engineer & traveller",
  "interests": ["music", "travel", "tech"],
  "lookingFor": "Creative collaborators",
  "instagramLink": "https://instagram.com/alice",
  "websiteLink": "https://alice.dev"
}
```
**200 Response** — updated profile object.

---

### Upload Avatar
```
POST /api/profile/avatar
```
🔒 Protected  
**Content-Type:** `multipart/form-data`  
**Field:** `avatar` (JPEG / PNG / WebP, max 5 MB)

Uploads to Cloudinary (auto-cropped 400×400, face-gravity). Deletes previous avatar automatically.

**200 Response**
```json
{ "success": true, "data": { "avatar": "https://res.cloudinary.com/..." } }
```

---

## Connect Requests

### Send a Request
```
POST /api/requests/send
```
🔒 Protected

**Body**
```json
{ "receiverId": "clzzz", "message": "Hey, let's connect!" }
```
`message` is optional. Cannot send to yourself or to an already-connected user.

**201 Response** — the created `ConnectRequest` object.

---

### Get Pending Requests
```
GET /api/requests/pending
```
🔒 Protected

Returns requests received by the current user with status `PENDING`, enriched with shared interests.

**200 Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clrrr",
      "message": "Hey!",
      "createdAt": "...",
      "sender": {
        "username": "bob",
        "displayName": "Bob",
        "avatar": null,
        "bio": "...",
        "interests": ["music"]
      },
      "sharedInterests": ["music"]
    }
  ]
}
```

---

### Accept a Request
```
POST /api/requests/accept/:id
```
🔒 Protected

Creates a `Connection` and a `Conversation` atomically. Sends a notification to the original sender.

**200 Response**
```json
{ "success": true, "data": { "request": {...}, "connection": {...} } }
```

---

### Pass on a Request
```
POST /api/requests/pass/:id
```
🔒 Protected — sets status to `PASSED`.

---

### Save for Later
```
POST /api/requests/later/:id
```
🔒 Protected — sets status to `LATER`.

---

### Get Saved-for-Later Requests
```
GET /api/requests/later
```
🔒 Protected

---

## Connections

### Get All Connections
```
GET /api/connections
```
🔒 Protected

**200 Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clccc",
      "createdAt": "...",
      "conversationId": "clvvv",
      "user": { "username": "bob", "displayName": "Bob", "avatar": null, "bio": null }
    }
  ]
}
```

---

## Messages

### Get All Conversations
```
GET /api/messages/conversations
```
🔒 Protected

Returns conversations sorted by most recent activity, each with the other participant and last message preview.

**200 Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clvvv",
      "createdAt": "...",
      "participant": { "username": "bob", "displayName": "Bob", "avatar": null },
      "lastMessage": {
        "content": "Hey!",
        "createdAt": "...",
        "read": false,
        "isOwn": false
      }
    }
  ]
}
```

---

### Get Messages in a Conversation
```
GET /api/messages/:conversationId
```
🔒 Protected

Marks all unread messages from the other participant as read.

**200 Response** — array of message objects with sender profile.

---

### Send a Message
```
POST /api/messages
```
🔒 Protected

**Body**
```json
{ "conversationId": "clvvv", "content": "Hey there!" }
```
Max content length: 2000 characters.

**201 Response** — the created message with sender profile.

---

## Compliments

### Send a Compliment
```
POST /api/compliments
```
🔒 Protected

**Body**
```json
{ "profileId": "clyyy", "content": "You're amazing!", "anonymous": true }
```
`anonymous` defaults to `true`. Compliments require approval before appearing publicly.

**201 Response** — the created compliment.

---

### Get Approved Compliments
```
GET /api/compliments/:username
```
🔒 Protected — returns only `approved: true` compliments.

---

### Approve a Compliment
```
PATCH /api/compliments/:id/approve
```
🔒 Protected — profile owner only.

---

### Delete a Compliment
```
DELETE /api/compliments/:id
```
🔒 Protected — profile owner only.

---

## Questions

### Ask a Question
```
POST /api/questions
```
🔒 Protected

**Body**
```json
{ "profileId": "clyyy", "question": "What's your favourite book?" }
```

**201 Response** — the created question.

---

### Answer a Question
```
POST /api/questions/:id/answer
```
🔒 Protected — profile owner only.

**Body**
```json
{ "answer": "The Hitchhiker's Guide to the Galaxy" }
```

---

### Get Answered Questions
```
GET /api/questions/:username
```
🔒 Protected — returns only questions with a non-null answer.

---

## Notifications

### Get Notifications
```
GET /api/notifications
```
🔒 Protected — returns latest 50 notifications.

**200 Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clnnn",
      "type": "CONNECT_REQUEST",
      "message": "Bob sent you a connect request",
      "read": false,
      "createdAt": "..."
    }
  ]
}
```

Notification types: `CONNECT_REQUEST`, `REQUEST_ACCEPTED`, `NEW_MESSAGE`, `NEW_COMPLIMENT`, `NEW_QUESTION`, `QUESTION_ANSWERED`.

---

### Mark Notification as Read
```
PATCH /api/notifications/:id/read
```
🔒 Protected

---

## Error Responses

All errors follow the same shape:
```json
{ "success": false, "message": "Human-readable description" }
```

| Status | Meaning                        |
|--------|--------------------------------|
| 400    | Validation or bad input        |
| 401    | Missing or invalid JWT         |
| 403    | Forbidden (not your resource)  |
| 404    | Resource not found             |
| 409    | Conflict (duplicate)           |
| 429    | Rate limited                   |
| 500    | Internal server error          |

---

## Socket.io

Connect with a JWT:
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: 'Bearer <jwt>' }
});
```

### Client → Server Events

#### `send_message`
```json
{ "conversationId": "clvvv", "content": "Hello!" }
```

#### `typing`
```json
{ "conversationId": "clvvv" }
```

#### `stop_typing`
```json
{ "conversationId": "clvvv" }
```

---

### Server → Client Events

#### `receive_message`
Emitted to sender (confirmation) and recipient.
```json
{
  "id": "clmmm",
  "conversationId": "clvvv",
  "content": "Hello!",
  "read": false,
  "createdAt": "...",
  "sender": { "username": "alice", "displayName": "Alice", "avatar": null }
}
```

#### `typing`
```json
{ "conversationId": "clvvv", "userId": "clxxx", "username": "alice" }
```

#### `stop_typing`
```json
{ "conversationId": "clvvv", "userId": "clxxx" }
```

#### `notification`
```json
{
  "id": "clnnn",
  "type": "NEW_MESSAGE",
  "message": "Alice sent you a message",
  "read": false,
  "createdAt": "..."
}
```

#### `error`
```json
{ "message": "Not a participant in this conversation" }
```

---

## Rate Limits

| Scope                          | Limit           |
|-------------------------------|-----------------|
| All `/api/*` routes            | 100 req / 15 min |
| `/api/auth/login`              | 10 req / 15 min  |
| `/api/auth/register`           | 10 req / 15 min  |

---

## Setup & Running

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, Cloudinary credentials
```

### 3. Run migrations

**Option A — Prisma managed (recommended for dev)**
```bash
npx prisma migrate dev --name init
```

**Option B — Raw SQL**
```bash
psql -U <user> -d <dbname> -f prisma/migrations/0001_init.sql
```

### 4. Generate Prisma client
```bash
npm run prisma:generate
```

### 5. Start dev server
```bash
npm run dev
```

### 6. Build for production
```bash
npm run build
npm start
```
