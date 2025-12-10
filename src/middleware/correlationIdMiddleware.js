import { randomUUID } from "crypto";
import { setRequestContext } from "../context/requestContext.js";


export function correlationIdMiddleware(req, res, next) {
  const correlationId = randomUUID();

  // Store in request context (async context)
  setRequestContext({ correlationId });

  // Also attach to req for convenience
  req.correlationId = correlationId;

  next();
}