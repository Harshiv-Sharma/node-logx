
import { randomUUID } from "crypto";
import { requestContext } from "../context/requestContext.js";

export function correlationIdMiddleware(req, res, next) {
  // Accept incoming header or create new one
  const incoming = req.headers["x-correlation-id"] || req.headers["x-request-id"];
;
  const correlationId = incoming || randomUUID();

  requestContext.run(() => {
    const store = requestContext.get();
    store.correlationId = correlationId;

    // Expose it on req
    req.correlationId = correlationId;

    // set response header
    res.setHeader("x-correlation-id", correlationId);

    next();
  });
}
