# Log Management System

A full-stack web application for managing system logs built with React, TypeScript, and Tailwind CSS.

> Technical assessment project for Fixar

**Repository:** https://github.com/YuraLeo94/fixar-assigment

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Click-to-edit inline editing
- Responsive design (mobile & desktop)
- Pagination for large datasets
- Toast notifications
- Comprehensive unit tests

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Testing:** Jest, React Testing Library

## Quick Start

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/YuraLeo94/fixar-assigment.git
cd fixar-assigment

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (terminal 1)
cd backend && npm run dev
# Backend runs on http://localhost:3000

# Start frontend (terminal 2)
cd frontend && npm run dev
# Frontend runs on http://localhost:5173

# Run tests
cd frontend && npm test
```

## API Endpoints

- `GET /api/logs` - Fetch all logs
- `POST /api/logs` - Create a new log (body: `{ owner, logText }`)
- `PUT /api/logs/:id` - Update a log (body: `{ owner?, logText? }`)
- `DELETE /api/logs/:id` - Delete a log

## Project Structure

```
fixar-assigment/
├── frontend/
│   ├── src/
│   │   ├── __tests__/          # Test files
│   │   ├── api/                # API service layer
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   └── types/              # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   └── index.ts            # Express server
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Testing

All components, hooks, and API services have unit tests following React Testing Library best practices.

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:coverage # Coverage report
```

---

**Author:** [YuraLeo94](https://github.com/YuraLeo94)
