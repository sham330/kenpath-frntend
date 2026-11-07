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

## Future Improvements

### Role-Based Access Control
Introduce three roles — **Patient**, **Nurse**, and **Doctor** — each with a different view of the app.

- **Patient** — can only log their own readings, view their own reports, and write personal notes
- **Nurse** — can view and manage readings for assigned patients, add observations
- **Doctor** — full read access across all assigned patients, can review trends and leave clinical notes

On the frontend this means:
- Store `role` in the auth state alongside `token` and `user`
- Create a `RoleGuard` component (similar to `ProtectedRoute`) that restricts pages by role
- Show different sidebar links and actions depending on the role

### Patient Monitoring Dashboard (Doctor / Nurse view)
A dedicated page where a doctor or nurse can:
- Search and select a patient
- See their glucose trend over time as a line chart
- Compare readings across multiple patients side by side
- Get alerts when a patient's readings are consistently out of range

### Food & Meal Logging
Extend each reading entry to optionally include what the patient ate:
- Meal description (free text)
- Carbohydrate estimate (grams)
- This helps correlate food intake with glucose spikes, especially useful for the `AFTER_BREAKFAST`, `AFTER_LUNCH`, `AFTER_DINNER` slots

### Medication Tracking
A separate log for medications taken each day:
- Medicine name, dosage, and time taken
- Link medication entries to the same date as readings so doctors can see the full picture
- Alerts if a patient hasn't logged their medication for the day

### Patient Notes / Journal
Allow patients to attach a short note to any reading describing how they feel:
- Energy level, symptoms (headache, dizziness, fatigue), stress level
- Doctors and nurses can read these notes when reviewing a patient's history
- Helps explain unusual readings that numbers alone can't capture

### Notifications & Alerts
- Notify patients when a reading is outside their target range
- Remind patients to log readings at each time slot
- Alert the assigned nurse or doctor if a critical reading is logged (e.g. below 60 or above 400 mg/dL)

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
