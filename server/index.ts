/**
 * SECURITY NOTES for this server:
 *
 * 1. The /api/execute endpoint runs user-submitted code. It is the highest-risk
 *    surface. See server/routes/execute.ts for sandboxing details.
 *
 * 2. CORS is restricted to the configured ALLOWED_ORIGIN (defaults to
 *    localhost during development). For production, set the CS_ALLOWED_ORIGIN
 *    environment variable to the actual frontend origin.
 *
 * 3. Request body size is limited to prevent memory exhaustion attacks.
 *
 * 4. TODO(security): Add authentication before allowing code execution.
 *    Currently any client can execute arbitrary code on the server.
 *
 * 5. TODO(security): Add HTTPS termination (via reverse proxy or directly)
 *    for production deployments.
 */

import { Database } from 'bun:sqlite';
import { contentRoutes } from './routes/content';
import { progressRoutes } from './routes/progress';
import { executeRoutes } from './routes/execute';
import { initializeDatabase } from './db/schema';

const PORT = process.env['PORT'] ?? 3000;

// SECURITY: Restrict CORS to a specific origin in production.
// Set CS_ALLOWED_ORIGIN env var to your frontend's URL.
const ALLOWED_ORIGIN = process.env['CS_ALLOWED_ORIGIN'] ?? `http://localhost:4200`;

// SECURITY: Maximum request body size (256 KB) to prevent memory exhaustion
const MAX_REQUEST_BODY_BYTES = 256 * 1024;

const db = initializeDatabase();

const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

        // SECURITY: Enforce request body size limit on POST requests
        if (req.method === 'POST') {
            const contentLength = req.headers.get('content-length');
            if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_BYTES) {
                return new Response(
                    JSON.stringify({ error: 'Request body too large' }),
                    {
                        status: 413,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    }
                );
            }
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
