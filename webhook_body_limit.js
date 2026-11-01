// Interview question:
// How do you stop a webhook client from sending an excessively large body?
//
// Answer:
// Set a maximum body size. If the request exceeds it, return HTTP 413
// (Payload Too Large) and do not parse or process the payload.

const http = require('node:http');
const maxBodySize = 1_000_000; // Maximum request body size: 1 MB.

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    return res.end('Not found');
  }

  let body = '';
  let tooLarge = false;

  req.on('data', chunk => {
    if (tooLarge) return; // Ignore further chunks after the limit is reached.

    body += chunk;
    if (Buffer.byteLength(body) > maxBodySize) {
      tooLarge = true;
      res.writeHead(413, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload too large' }));
    }
  });

  req.on('end', () => {
    if (tooLarge) return;

    try {
      const event = JSON.parse(body);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Event received', id: event.id }));
    } catch {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

server.listen(3005, () => {
  console.log('Webhook server running at http://localhost:3005/webhook');
});
