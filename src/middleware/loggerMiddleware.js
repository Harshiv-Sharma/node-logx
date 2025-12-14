

export function loggerMiddleware(logger) {
  return function (req, res, next) {
    const startTime = process.hrtime.bigint();

    logger.info("Incoming request", {
      method: req.method,
      url: req.originalUrl,
    });

    res.on("finish", () => {
      const durationMs =
        Number(process.hrtime.bigint() - startTime) / 1_000_000;

      logger.info("Request completed", {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: durationMs.toFixed(2),
      });
    });

    next();
  };
}
