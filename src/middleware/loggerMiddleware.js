import { Logger } from "./logger.js";
import { requestContext } from "../context/requestContext.js";


export function loggerMiddleware(req, res, next) {
  const requsetId = crypto.randomUUID();
  const startTime = process.hrtime.bigint(); // High-resolution start time

  // storing id in asyncLocalStorage for corelation IDs
  requestContext.run({ requestId }, () => {
    Logger.info(`Incoming request` , {
      method: req.method,
      url: req.originalUrl,
      requestId,
    });

  // When the response is finished, log duration
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

      Logger.info(`Request completed`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${durationMs.toFixed(2)} ms`,
        requestId
  });
    });

    next();
  });  
}