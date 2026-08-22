import { Hono } from "hono";

export interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;

}

const app = new Hono<{Bindings: Env}>();

app.get('/', (c) => {
    return c.json({mensagem: 'API RODANDO COM HONO'});
});

export default app;