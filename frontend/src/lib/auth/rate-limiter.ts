/**
 * In-Memory sliding-window rate limiter for OTP requests and bot protection.
 * Configured for max 3 OTP requests per 10-minute window per phone number.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_REQUESTS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkOtpRateLimit(phone: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(phone);

  if (!record || now > record.resetAt) {
    // Window expired or first request
    rateLimitStore.set(phone, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Increment within window
  record.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - record.count,
    retryAfterSeconds: 0,
  };
}

export function resetOtpRateLimitForTesting(phone?: string) {
  if (phone) {
    rateLimitStore.delete(phone);
  } else {
    rateLimitStore.clear();
  }
}
