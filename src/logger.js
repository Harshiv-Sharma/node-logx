import winston from "winston";
import {ensureLogDir} from "./utils/ensureLogDir.js";
import { consoleTransport } from "./transports/consoleTransport.js";
import { fileTransport } from "./transports/fileTransport.js";
import { auditFileTransport } from "./transports/auditFileTransport.js";
import { requestContext } from "./context/requestContext.js";
import { HttpTransport } from "./transports/httpTransport.js";
import { redact } from "./utils/redact.js";


export class Logger {
  constructor(options = {}) {
    this.logDir = options.logDir || 'logs';
    ensureLogDir(this.logDir);

    const env = process.env.NODE_ENV || 'development';

    // Choose level automatically unless user overrides
    const level = options.level || (
      env === "production" ? "info" :
      env === "test" ? "warn" :
      "debug" // development default
    );

    // Unified format for all logs
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),  // includes stack trace
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
      winston.format.json()
    );


    // Create Winston logger instance
    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        // 1. Inject correlationId

        winston.format((info) => {
          const ctx = requestContext.getRequestContext();
          if (ctx?.correlationId) {
            info.correlationId = ctx.correlationId;
          }
          return info;
        })(),

        // 2. Redact sensitive info
        winston.format((info) => {
          if(info && typeof info === 'object') {
            info = {...info};
            info = redact(info);   // redact sensitive info from all logs
          }
          return info;
        }) (),

        // 3. Final formatting
        winston.format.json()
      ),
      transports: [
        consoleTransport(),    // console logs (pretty, colorized)
        fileTransport(this.logDir),   // Rotating app logs
        auditFileTransport(this.logDir),   // Rotating audit logs
        // ...(options.httpEndpoint ? [ httpTransport(options.httpEndpoint) ] : [])
      ],
    });

    // Optional HTTP transport
    if (options.httpEndpoint) {
      this.logger.add(
        new HttpTransport({
          endpoint: options.httpEndpoint,
          headers: options.httpHeaders || {}
        })
      );
    }
  }
   
  info(message, meta = {}) {    
    this.logger.info(message, this._cleanMeta(meta));
  }

  error(message, meta = {}) {    
    this.logger.error(message, this._cleanMeta(meta));
  } 

  warn(message, meta = {}) {    
    this.logger.warn(message, this._cleanMeta(meta));
  }   

  debug(message, meta = {}) {
    this.logger.debug(message, this._cleanMeta(meta));
  }

  // Audit logs (immutable-style event logging).
  audit(action, user, details = {}) {
    const requestId = requestContext.getRequestId();

    this.logger.info(`Audit - ${action}`, {
      audit: true,
      user,
      details,
      eventType: "AUDIT",
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Ensures meta objects are JSON-safe.
  _cleanMeta(meta) {
    const safeMeta = (() => {
      try {
      return JSON.parse(JSON.stringify(meta));  
    } catch {
      return { invalidMeta: true };
    }
    }) ();
    
    const requestId = requestContext.getRequestId();
    if (requestId) {
      safeMeta.requestId = requestId;
    }
    return safeMeta;
  }
}

