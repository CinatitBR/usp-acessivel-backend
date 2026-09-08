import { Hono } from "hono";
import buildingsRoutes from './routes/buildings';
import visualRoutes from "./routes/visualRoutes";
import poisRoutes from "./routes/pois";
import mapReportsRoutes from "./routes/mapReports";

export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;

}

const app = new Hono<{Bindings: Env}>();

app.get('/', (c) => {
    return c.json({mensagem: 'API RODANDO COM HONO'});
});


app.route('/buildings', buildingsRoutes);
app.route('/visualRoutes', visualRoutes);
app.route('/pois', poisRoutes);
app.route('/mapReports', mapReportsRoutes);

export default app;