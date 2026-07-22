const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const safePath = path.normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = path.join(root, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (error, data) => {
      if (error) {
        fs.readFile(path.join(root, 'index.html'), (fallbackError, fallback) => {
          if (fallbackError) {
            response.writeHead(404);
            response.end('Not found');
            return;
          }
          response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          response.end(fallback);
        });
        return;
      }
      response.writeHead(200, {
        'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      response.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`EcoLearn is running at http://localhost:${port}`);
  console.log('Keep this window open while viewing the website.');
});
