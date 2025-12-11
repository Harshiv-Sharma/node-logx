// base or common formatter to structure log information

export function baseFormatter(info) {
  return {
    timestamp: info.timestamp,
    level: info.level,
    message: info.message,
    correlationId: info.correlationId,
    requestId: info.requestId,
    ...info
  };
}
