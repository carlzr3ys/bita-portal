/**
 * BITA Development Server
 * 
 * This server serves the frontend (HTML/CSS/JS) and proxies API calls to XAMPP Apache
 * 
 * Usage:
 *   1. Make sure XAMPP Apache and MySQL are running
 *   2. Run: npm start
 *   3. Open: http://localhost:8080
 */

const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');
const fs = require('fs');
const url = require('url');

const PORT = 8080;
const XAMPP_HOST = 'localhost';
const XAMPP_PORT = 80;

// Create proxy for API requests
const proxy = httpProxy.createProxyServer({
    target: `http://${XAMPP_HOST}:${XAMPP_PORT}`,
    changeOrigin: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    if (!res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'XAMPP Apache tidak running. Sila start XAMPP Apache dan MySQL dahulu.'
        }));
    }
});

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf'
};

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Proxy API requests to XAMPP Apache
    if (pathname.startsWith('/api/') || pathname.endsWith('.php')) {
        // Modify path to include /bita prefix for XAMPP
        req.url = '/bita' + req.url;
        req.headers.host = XAMPP_HOST;
        
        // Proxy to XAMPP
        proxy.web(req, res);
        return;
    }

    // Serve static files
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`, 'utf-8');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 BITA Development Server Started!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API Proxy: http://localhost:${PORT}/api/ → http://localhost/bita/api/`);
    console.log('');
    console.log('⚠️  IMPORTANT: Make sure XAMPP Apache and MySQL are running!');
    console.log('   - XAMPP Apache: http://localhost');
    console.log('   - MySQL: Should be running in XAMPP');
    console.log('   - Check: npm run check-xampp');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('═══════════════════════════════════════════════════');
    
    // Try to open browser
    const { exec } = require('child_process');
    const start = process.platform === 'win32' ? 'start' : 
                  process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${start} http://localhost:${PORT}`);
});

