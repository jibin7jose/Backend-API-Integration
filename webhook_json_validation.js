const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const event = JSON.parse(body);
      console.log('Received event:', event);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Event received' }));
    } catch {
      res.writeHead(400, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

server.listen(3004, () => {
  console.log('Webhook server running at http://localhost:3004/webhook');
});
