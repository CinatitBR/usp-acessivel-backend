import { Hono } from 'hono';
import { cors } from 'hono/cors';
import buildingsRoutes from './routes/buildings';
import visualRoutes from './routes/visualRoutes';
import poisRoutes from './routes/pois';
import mapReportsRoutes from './routes/mapReports';

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

// Apply CORS to all routes, for any origin.
// In the future, for safety reasons, our frontend domain
// should be set to be the only origin allowed.
app.use('*', cors());

app.get('/', (c) => {
  return c.json({ mensagem: 'API RODANDO COM HONO' });
});

app.route('/buildings', buildingsRoutes);
app.route('/visualRoutes', visualRoutes);
app.route('/pois', poisRoutes);
app.route('/mapReports', mapReportsRoutes);

export default app;
