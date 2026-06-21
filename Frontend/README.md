# Connectly — Premium Social Networking Frontend

A production-ready React + TypeScript frontend for the Connectly social platform.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — utility-first styling
- **React Router DOM** — client-side routing
- **TanStack React Query** — server state management
- **Axios** — HTTP client
- **Zustand** — client state (auth, notifications, socket)
- **Socket.io Client** — real-time messaging
- **Framer Motion** — animations & swipe gestures
- **Lucide React** — icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (requires backend running at http://localhost:5000)
npm run dev

# Build for production
npm run build
```

## Pages

| Route | Page | Auth |
|-------|------|------|
| `/` | Landing | Public |
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |
| `/home` | Home dashboard | Protected |
| `/requests` | Swipeable requests | Protected |
| `/messages` | Conversations list | Protected |
| `/messages/:id` | Chat room | Protected |
| `/notifications` | Notifications | Protected |
| `/profile` | Own profile | Protected |
| `/edit-profile` | Edit profile | Protected |
| `/settings` | Settings | Protected |
| `/compliments` | Manage compliments | Protected |
| `/questions` | Manage Q&A | Protected |
| `/connections` | All connections | Protected |
| `/u/:username` | Public profile | Protected |

## Project Structure

```
src/
├── components/
│   ├── ui/          # Avatar, Tag, Spinner, EmptyState, ErrorState
│   └── shared/      # BottomNav
├── features/
│   └── requests/    # RequestCard (swipeable)
├── pages/           # All page components
├── layouts/         # AppLayout (with BottomNav), AuthLayout
├── hooks/           # React Query hooks per domain
├── services/        # Axios API client + service functions
├── store/           # Zustand stores (auth, notifications, socket)
├── routes/          # ProtectedRoute, GuestRoute guards
└── types/           # TypeScript interfaces
```

## Design System

- **Primary White**: `#FFFEFD`
- **Primary Black**: `#1A1A1A`
- **Accent Purple**: `#994EA8`
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Style**: Glassmorphism cards, 90%+ white/black, purple for active states only

## Key Features

### Requests Page
Hinge-style swipeable cards — one request at a time with:
- Swipe left → Pass
- Swipe right → Accept  
- Swipe up → Later
- Tap buttons for same actions
- Framer Motion drag gestures + animated overlays

### Real-time Chat
- Socket.io integration for live messages
- Optimistic UI updates
- Typing indicators
- Read receipts (✓ / ✓✓)
- iMessage-style bubbles

### Public Profiles
- Send connect requests with custom message
- Send compliments (optional anonymous)
- Ask questions (optional anonymous)

## Environment

Backend expected at `http://localhost:5000/api`

To change: update `src/services/api.ts` → `BASE_URL`
