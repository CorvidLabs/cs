import { Database } from 'bun:sqlite';
import { contentRoutes } from './routes/content';
import { progressRoutes } from './routes/progress';
import { executeRoutes } from './routes/execute';
import { initializeDatabase } from './db/schema';

const PORT = process.env['PORT'] ?? 3000;

const db = initializeDatabase();

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;

        if (req.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (path.startsWith('/api/content')) {
            return contentRoutes(req, url, corsHeaders);
        }

        if (path.startsWith('/api/progress')) {
            return progressRoutes(req, url, db, corsHeaders);
        }

        if (path.startsWith('/api/execute')) {
            return executeRoutes(req, url, corsHeaders);
        }

        const staticPath = `./dist/cs/browser${path}`;
        const staticFile = Bun.file(staticPath);

        if (await staticFile.exists()) {
            return new Response(staticFile);
        }

        const indexFile = Bun.file('./dist/cs/browser/index.html');
        if (await indexFile.exists()) {
            return new Response(indexFile, {
                headers: { 'Content-Type': 'text/html' },
            });
        }

        return new Response('Not Found', { status: 404 });
    },
});

console.log(`Server running at http://localhost:${PORT}`);
