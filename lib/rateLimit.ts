// Rate limiting utility for API endpoints
// In-memory Map-based rate limiter with automatic cleanup
// See Section 4.1 of docs/TRD.md for specifications

const ipRequests = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if a request from an IP hash is within rate limit
 * @param ipHash SHA-256 hash of the IP address
 * @param maxRequests Maximum requests allowed per window (default: 3)
 * @param windowMs Time window in milliseconds (default: 3600000 = 1 hour)
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function checkRateLimit(
  ipHash: string,
  maxRequests = 3,
  windowMs = 3600000, // 1 hour
): boolean {
  const now = Date.now();
  const record = ipRequests.get(ipHash);

  // No record or window expired: allow request and reset
  if (!record || record.resetAt < now) {
    ipRequests.set(ipHash, { count: 1, resetAt: now + windowMs });
    return true;
  }

  // Window still active: check limit
  if (record.count >= maxRequests) {
    return false; // Limit exceeded
  }

  // Increment and allow
  record.count++;
  return true;
}

/**
 * Clean up expired entries from the rate limit map
 * Call this periodically to prevent unbounded memory growth
 * Typically called every 100th request (1% sampling)
 */
export function cleanupOldEntries(): void {
  const now = Date.now();
  const toDelete: string[] = [];

  for (const [key, record] of ipRequests.entries()) {
    if (record.resetAt < now) {
      toDelete.push(key);
    }
  }

  toDelete.forEach(key => ipRequests.delete(key));
}

/**
 * Get current rate limit status for debugging/monitoring
 * @returns Map statistics
 */
export function getStats(): { totalEntries: number; memory: string } {
  const entries = ipRequests.size;
  const memoryEstimate = (entries * 200) / 1024; // rough estimate in KB

  return {
    totalEntries: entries,
    memory: `~${memoryEstimate.toFixed(2)} KB`,
  };
}

/**
 * Reset all rate limits (useful for testing)
 */
export function resetAll(): void {
  ipRequests.clear();
}
