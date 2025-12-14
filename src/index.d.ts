export class Logger {
  constructor(options?: any);

  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  audit(action: string, user: string, details?: any): void;
}

export const requestContext: {
  run(callback: () => void): void;
  setCorrelationId(id: string): void;
  getCorrelationId(): string | null;
  get(): Record<string, any>;
};

export function correlationIdMiddleware(
  req: any,
  res: any,
  next: () => void
): void;

export function humanFormatter(info: any): any;
export function jsonFormatter(info: any): any;
export function baseFormatter(info: any): any;
