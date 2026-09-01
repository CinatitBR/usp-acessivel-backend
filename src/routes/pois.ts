import { Hono } from 'hono';
import { getPois } from '../repositories/pois';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

const poisRoutes = new Hono<{ Bindings: Bindings }>();

poisRoutes.get('/', async (c) => {
  try {
    const pageParam = c.req.query('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    if (isNaN(page) || page < 1) {
      return c.json({ error: 'Parâmetro de página inválido' }, 400);
    }

    const limit = 40;
    const offset = (page - 1) * limit;

    const pois = await getPois(c.env.DB, limit, offset);

    return c.json({ success: true, data: pois }, 200);
  } catch (error) {
    console.error('Erro ao buscar POIs:', error);
    return c.json({ error: 'Erro interno ao buscar POIs' }, 500);
  }
});

export default poisRoutes;
