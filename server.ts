import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import setupBackend from './backend/src/server';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount backend routes and middleware
  setupBackend(app);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Interview Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
