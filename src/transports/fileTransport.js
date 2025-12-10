import DailyRotateFile  from 'winston-daily-rotate-file';
import path from 'path';

export function fileTransport(logDir) {
  return new DailyRotateFile ({
    filename: path.join(logDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d', 
  });
}