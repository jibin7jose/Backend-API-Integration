const http = require('node:http'); // Load Node.js's built-in HTTP module.
const requests = new Map(); // Store request counts for each client IP.
const limit = 5; // Allow five requests per client during the time window.
const windowMs = 60_000; // Set the time window to 60 seconds.

http.createServer((req, res) => { // Create the server to handle incoming requests.
  const ip = req.socket.remoteAddress; // Get the client's IP address.
  const now = Date.now(); // Get the current time in milliseconds.
  const record = requests.get(ip) || { count: 0, start: now }; // Get the client's counter, or create one.

  if (now - record.start > windowMs) { // Check whether the client's 60-second window has passed.
    record.count = 0; // Reset their request count.
    record.start = now; // Start a new time window.
  }

  record.count++; // Count this request.
  requests.set(ip, record); // Save the updated counter.

  if (record.count > limit) { // Check whether the client exceeded five requests.
    res.writeHead(429); // Set HTTP status 429: Too Many Requests.
    return res.end('Too many requests'); // Send the limit message.
  }

  res.end('Request allowed'); // Allow the request and send a response.
}).listen(3002, () => { // Start the server on port 3002.
  console.log('API running at http://localhost:3002'); // Print the server URL.
});
