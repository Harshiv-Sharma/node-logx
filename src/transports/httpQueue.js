import fetch from "node-fetch";

export class HttpQueue {
  constructor({ endpoint, headers = {}, flushInterval = 3000, maxBuffer = 20 }) {
    this.endpoint = endpoint;
    this.headers = headers;
    this.buffer = [];
    this.maxBuffer = maxBuffer;

    // Auto flush every few seconds
    this.timer = setInterval(() => this.flush(), flushInterval);
  }

  push(logObject) {
    this.buffer.push(logObject);

    // Auto-flush if buffer too large
    if (this.buffer.length >= this.maxBuffer) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;

    const payload = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("HTTP Queue Flush Failed:", err);

      // Restore logs back to buffer for retry
      this.buffer.unshift(...payload);
    }
  }

  stop() {
    clearInterval(this.timer);
  }
}
