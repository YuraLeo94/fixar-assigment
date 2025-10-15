# Backend

This is the backend API server for the Log Management System.

For complete setup instructions, API documentation, and features, please see the [main README](../README.md) at the root of this repository.

## Quick Start

```bash
npm install
npm run dev
```

The backend API will run on `http://localhost:3000`

## API Endpoints

- `GET /api/logs` - Fetch all logs
- `POST /api/logs` - Create a new log
- `PUT /api/logs/:id` - Update a log
- `DELETE /api/logs/:id` - Delete a log
