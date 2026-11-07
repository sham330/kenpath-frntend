# Glucose Tracker — Frontend

A React + TypeScript frontend for tracking blood glucose readings and generating reports.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Redux Toolkit** — state management
- **React Router v7** — routing
- **Tailwind CSS v4** — styling
- **shadcn/ui** — component library
- **Recharts** — charts
- **Vitest** + **Testing Library** — testing

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:8000`

### Install & Run

```bash
npm install
npm run dev
```

### Environment

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── authService.ts     # fetch calls — login, register
│   │   ├── authSlice.ts       # Redux slice + thunks
│   │   └── useAuth.ts         # custom hook
│   ├── readings/
│   │   ├── readingsService.ts # fetch calls — CRUD
│   │   ├── readingsSlice.ts   # Redux slice + thunks
│   │   └── useReadings.ts     # custom hook
│   └── reports/
│       ├── reportsService.ts  # fetch calls — reports
│       ├── reportsSlice.ts    # Redux slice + thunk
│       └── useReports.ts      # custom hook
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Readings.tsx
│   └── Reports.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── test/
│   ├── setup.ts
│   ├── authService.test.ts
│   ├── authSlice.test.ts
│   ├── readingsSlice.test.ts
│   └── reportsSlice.test.ts
├── store.ts
└── App.tsx
```

## Architecture

Each feature follows a strict layered pattern:

```
Service → Hook → Slice → Component
```

| Layer | Responsibility |
|---|---|
| `*Service.ts` | Raw `fetch` calls to the API |
| `*Slice.ts` | Redux state, async thunks, reducers |
| `use*.ts` | Custom hook — wraps dispatch + selector |
| `*.tsx` | Component — only talks to the hook |

## Features

### Auth
- Login and Register with JWT token stored in `localStorage`
- Protected routes — redirects to `/login` if unauthenticated
- Logout from the navbar dropdown

### Readings (`/dashboard/readings`)
- View paginated glucose readings (10 per page)
- Add a new reading via a centered dialog (date, time slot, value)
- Edit a reading via a centered dialog (pre-filled)
- Delete a reading with a confirmation dialog
- All mutations refetch from the server to stay in sync

### Reports (`/dashboard/reports`)
- Three report types via a segmented button toggle:
  - **Daily** — date picker, shows readings for that day
  - **Month to Date** — date picker, shows 1st of month to selected date
  - **Monthly** — month picker, shows the full previous month
- Live range hint shown below the date input
- Stat cards: total readings, average, highest, lowest
- Bar chart with per-time-slot color coding
- Readings table (daily only)

## API

Base URL: `VITE_API_URL` from `.env`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/readings?page=` | Get paginated readings |
| POST | `/api/readings` | Create reading |
| PATCH | `/api/readings/:id` | Update reading |
| DELETE | `/api/readings/:id` | Delete reading |
| GET | `/api/readings/reports?type=&date=` | Get report |

All authenticated endpoints require `Authorization: Bearer <token>`.

### Reading Values

- `timeSlot`: `MORNING` | `AFTER_BREAKFAST` | `AFTER_LUNCH` | `AFTER_DINNER`
- `value`: integer between `40` and `600` (mg/dL)

## Testing

```bash
npm run test          # watch mode
npm run test:run      # single run
npm run coverage      # coverage report
```

Tests cover:
- `authService` — fetch mocking, success and error paths
- `authSlice` — login/register thunks, logout, clearError reducers
- `readingsSlice` — fetch, create, update, delete thunks
- `reportsSlice` — fetch report, empty state, clearReport

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build
npm run lint       # run oxlint
npm run test       # run tests in watch mode
npm run test:run   # run tests once
npm run coverage   # test coverage
```
