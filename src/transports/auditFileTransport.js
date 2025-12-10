import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";


export function auditFileTransport(logDir) {
  return new DailyRotateFile({
    filename: path.join(logDir, 'audit-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  });
}