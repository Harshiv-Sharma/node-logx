📘 Node.js Advanced Logger

A fully-featured, production-ready logging system for Node.js applications.
This logger includes:

Correlation/Request IDs

Console + rotating file transports

Audit logging

HTTP log forwarding

Sensitive data redaction

Environment-based log levels

JSON log formatting

Pluggable transport architecture

🚀 Features
1. Request Context (Correlation ID)

Automatically attaches a unique requestId to every log created inside a request lifecycle.

2. Multiple Transports

Console (pretty printed)

Rotating File Logs

Audit log file

Optional HTTP transport (async + buffered)

3. Environment-based Logging

development → debug

test → warn

production → info

4. Sensitive Field Redaction

All logs are sanitized (passwords, tokens, etc.) before output.

5. HTTP Log Buffer (Async Queue)

HTTP logs are batched and sent periodically to reduce load.

📦 Installation
npm install

🛠️ Usage
import Logger from "./index.js";

export const logger = new Logger({
  logDir: "logs",
  httpEndpoint: "http://localhost:3000/logs",
  flushInterval: 3000,
  maxBuffer: 20
});

logger.info("Server started");
logger.error("Something failed", { details: "extra context" });
logger.audit("USER_LOGIN", { id: 1 });

📁 Project Structure
/context
  requestContext.js
/logger.js
/transports
  consoleTransport.js
  fileTransport.js
  auditFileTransport.js
  httpTransport.js
/utils
  ensureLogDir.js
  redact.js
index.js

⚙️ Environment Variables

Create a .env or .env.local file:

NODE_ENV=development

📤 Sending Logs to HTTP Endpoint

The logger includes an async buffered HTTP transport:

Batches logs

Retries on failure

Sends JSON data

Configure like:

new Logger({
  httpEndpoint: "http://localhost:3000/logs",
  flushInterval: 3000,
  maxBuffer: 20
});

📝 Audit Logging Example
logger.audit("USER_LOGIN", { userId: 123 }, { ip: "127.0.0.1" });
