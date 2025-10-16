// Vercel serverless function wrapper for the Express backend
// This is just a thin wrapper - all logic is in backend/src/index.ts

import app from '../backend/src/index';

// Export the Express app for Vercel
export default app;
