import winston from "winston";
import {ensureLogDir} from "./utils/ensureLogDir.js";
import { consoleTransport } from "./transports/consoleTransport.js";
import { fileTransport } from "./transports/fileTransport.js";
import { auditFileTransport } from "./transports/auditFileTransport.js";
import { requestContext } from "./context/requestContext.js";
import { HttpTransport } from "./transports/httpTransport.js";
import { redact } from "./utils/redact.js";
import { baseFormatter } from "./formatters/baseFormatter.js";
import { jsonFormatter } from "./formatters/jsonFormatter.js";
import { humanFormatter } from "./formatters/humanFormatter.js";
 


export class Logger {
  constructor(options = {}) {

    this.logDir = options.logDir || 'logs';
    ensureLogDir(this.logDir);

    const env = process.env.NODE_ENV || 'development';
    
    // --- Formatter support ---
    this.formatters = options.formatters || [];  
    this.formatters.push(baseFormatter); // Always applied last

    // Choose level automatically unless user overrides

    const level = options.level || (
      env === "production" ? "info" :
      env === "test" ? "warn" :
      "debug" // development default
    );

    // Final format function applying all formatters

    const finalFormat = winston.format.printf((info) => {
      let data = { ...info };
      for (const formatter of this.formatters) {
        data = formatter(data);
      }
      return typeof data === "string"
        ? data
        : JSON.stringify(data);
    });

    // Create Winston logger instance
    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(

        // timestamp
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

        // 1. Inject correlationId

        winston.format((info) => {
          const correlationId = requestContext.getCorrelationId();
          if (correlationId) {
            info.correlationId = correlationId;
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

        finalFormat
      ),

      transports: [
        consoleTransport(),                             // console logs (pretty, colorized)
        fileTransport(this.logDir),                    // Rotating app logs
        auditFileTransport(this.logDir),              // Rotating audit logs
        // ...(options.httpEndpoint ? [ httpTransport(options.httpEndpoint) ] : [])
      ],
    });

  // Add HTTP transport if configured
    if (options.httpEndpoint) {
      this.logger.add(
        new HttpTransport({
          endpoint: options.httpEndpoint,
          headers: options.httpHeaders || {},
          flushInterval: options.flushInterval || 3000,
          maxBuffer: options.maxBuffer || 20
        })
      );
    }
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
    
    return safeMeta;
  }

  // Standard log methods (wrappers)
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
    this.logger.info(`Audit - ${action}`, {
      audit: true,
      user,
      details,
      eventType: "AUDIT",
    });
  }
}

