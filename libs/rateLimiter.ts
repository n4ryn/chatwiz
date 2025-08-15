type RateLimitRecord = {
  count: number;
  lastRequest: number;
};

const requestsMap = new Map<string, RateLimitRecord>();

export function rateLimiter(ip: string, limit = 10, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const record = requestsMap.get(ip);

  if (!record) {
    requestsMap.set(ip, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  if (now - record.lastRequest > windowMs) {
    requestsMap.set(ip, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  if (record.count >= limit) {
    return { allowed: false };
  }

  record.count++;
  record.lastRequest = now;
  requestsMap.set(ip, record);
  return { allowed: true };
}
