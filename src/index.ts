import { Hono } from "hono";
import buildingsRoutes from './routes/buildings';

export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;

}

const app = new Hono<{Bindings: Env}>();

app.get('/', (c) => {
    return c.json({mensagem: 'API RODANDO COM HONO'});
});


app.route('/buildings', buildingsRoutes);

export default app;