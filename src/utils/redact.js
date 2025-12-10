
// redact or make sensitive information in log objects

const SENSITIVE_KEYS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "email",
  "ssn",
  "otp"
];

export function redact(obj) {
  if (!obj || typeof obj !== "object") return obj;

  const clone = { ...obj };

  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.includes(key)) {
      clone[key] = "***REDACTED***";
    } else if (typeof clone[key] === "object") {
      clone[key] = redact(clone[key]);
    }
  }
  return clone;
}