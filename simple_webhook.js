const http = require('node:http');
const seen = new Set();

http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { id } = JSON.parse(body);
      const duplicate = seen.has(id);
      seen.add(id);
      res.end(duplicate ? 'Duplicate ignored' : 'Event received');
    } catch {
      res.statusCode = 400;
      res.end('Send JSON with an id');
    }
  });
}).listen(3001, () => console.log('Server running on port 3001'));
