import { Transport } from "winston";
import { HttpQueue } from "./httpQueue.js";

export class HttpTransport extends Transport {
  constructor(opts = {}) {
    super(opts);
    this.queue = new HttpQueue({
      endpoint: opts.endpoint,
      headers: opts.headers,
      flushInterval: opts.flushInterval || 3000,
      maxBuffer: opts.maxBuffer || 20
    });
  }

  log(info, callback) {
    setImmediate(() => this.emit("logged", info));

    const logEntry = {
      level: info.level,
      message: info.message,
      timestamp: info.timestamp,
      ...info
    };

    this.queue.push(logEntry);

    callback();
  }
}
