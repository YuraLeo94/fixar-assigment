import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log type definition
interface Log {
  id: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  logText: string;
}

// In-memory data store with sample logs
let logs: Log[] = [
  {
    id: '1',
    owner: 'John Doe',
    createdAt: new Date('2025-10-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-10T10:00:00Z').toISOString(),
    logText: 'Initial system startup completed successfully',
  },
  {
    id: '2',
    owner: 'Jane Smith',
    createdAt: new Date('2025-10-11T14:30:00Z').toISOString(),
    updatedAt: new Date('2025-10-11T14:30:00Z').toISOString(),
    logText: 'Database migration executed without errors',
  },
  {
    id: '3',
    owner: 'Bob Johnson',
    createdAt: new Date('2025-10-12T09:15:00Z').toISOString(),
    updatedAt: new Date('2025-10-12T09:15:00Z').toISOString(),
    logText: 'User authentication service is now operational',
  },
  {
    id: '4',
    owner: 'Alice Williams',
    createdAt: new Date('2025-10-13T16:45:00Z').toISOString(),
    updatedAt: new Date('2025-10-13T16:45:00Z').toISOString(),
    logText: 'API response time improved by 40%',
  },
  {
    id: '5',
    owner: 'Charlie Brown',
    createdAt: new Date('2025-10-14T11:20:00Z').toISOString(),
    updatedAt: new Date('2025-10-14T11:20:00Z').toISOString(),
    logText: 'Security patches applied to all production servers',
  },
  {
    id: '6',
    owner: 'Diana Prince',
    createdAt: new Date('2025-10-14T13:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-14T13:00:00Z').toISOString(),
    logText: 'Cache invalidation strategy implemented successfully',
  },
  {
    id: '7',
    owner: 'Eve Martinez',
    createdAt: new Date('2025-10-14T15:30:00Z').toISOString(),
    updatedAt: new Date('2025-10-14T15:30:00Z').toISOString(),
    logText: 'New monitoring dashboard deployed to production',
  },
  {
    id: '8',
    owner: 'Frank Wilson',
    createdAt: new Date('2025-10-15T08:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-15T08:00:00Z').toISOString(),
    logText: 'Backup verification completed - all systems nominal',
  },
  {
    id: '9',
    owner: 'Grace Lee',
    createdAt: new Date('2025-10-15T10:10:00Z').toISOString(),
    updatedAt: new Date('2025-10-15T10:10:00Z').toISOString(),
    logText: 'Load balancer configuration optimized for peak traffic',
  },
  {
    id: '10',
    owner: 'Henry Davis',
    createdAt: new Date('2025-10-15T12:30:00Z').toISOString(),
    updatedAt: new Date('2025-10-15T12:30:00Z').toISOString(),
    logText: 'Code review process automated with new CI/CD pipeline',
  },
  {
    id: '11',
    owner: 'Iris Chen',
    createdAt: new Date('2025-10-15T14:00:00Z').toISOString(),
    updatedAt: new Date('2025-10-15T14:00:00Z').toISOString(),
    logText: 'Customer feedback system integrated into main dashboard',
  },
  {
    id: '12',
    owner: 'Jack Thompson',
    createdAt: new Date('2025-10-15T15:15:00Z').toISOString(),
    updatedAt: new Date('2025-10-15T15:15:00Z').toISOString(),
    logText: 'Performance benchmarks exceeded expectations by 25%',
  },
];

// GET /api/logs - Fetch all logs
app.get('/api/logs', (_req: Request, res: Response) => {
  res.json(logs);
});

// POST /api/logs - Create a new log
app.post('/api/logs', (req: Request, res: Response) => {
  const { owner, logText } = req.body;

  if (!owner || !logText) {
    return res.status(400).json({ error: 'Owner and logText are required' });
  }

  const newLog: Log = {
    id: String(Date.now()),
    owner,
    logText,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  logs.push(newLog);
  return res.status(201).json(newLog);
});

// PUT /api/logs/:id - Update a log
app.put('/api/logs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { owner, logText } = req.body;

  const logIndex = logs.findIndex((log) => log.id === id);

  if (logIndex === -1) {
    return res.status(404).json({ error: 'Log not found' });
  }

  // Update only provided fields
  if (owner !== undefined) {
    logs[logIndex].owner = owner;
  }
  if (logText !== undefined) {
    logs[logIndex].logText = logText;
  }

  logs[logIndex].updatedAt = new Date().toISOString();

  return res.json(logs[logIndex]);
});

// DELETE /api/logs/:id - Delete a log
app.delete('/api/logs/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const logIndex = logs.findIndex((log) => log.id === id);

  if (logIndex === -1) {
    return res.status(404).json({ error: 'Log not found' });
  }

  logs.splice(logIndex, 1);
  return res.status(204).send();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel serverless
export default app;

// Only start server in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/logs`);
  });
}
