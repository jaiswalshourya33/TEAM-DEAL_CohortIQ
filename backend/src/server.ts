import express, { Express } from 'express';
import 'dotenv/config';
import interviewRoutes from './routes/interview.routes';

export function setupBackend(app: Express): Express {
  // CORS support for running frontend and backend separately
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());
  // Mount routes under /api
  app.use('/api', interviewRoutes);
  return app;
}

// Standalone backend runner
if (process.env.STANDALONE_BACKEND === 'true' || process.env.RUN_BACKEND_ONLY === 'true') {
  const app = express();
  const PORT = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT, 10) : 5000;
  setupBackend(app);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend API server running separately on http://0.0.0.0:${PORT}`);
  });
}

export default setupBackend;
