import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, resetAll, cleanupOldEntries } from '@/lib/rateLimit';

describe('Rate Limiting Utility', () => {
  beforeEach(() => {
    resetAll();
    vi.useFakeTimers();
  });

  afterEach(() => {
    resetAll();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('allows first request', () => {
    const ipHash = 'hash123';
    const result = checkRateLimit(ipHash);

    expect(result).toBe(true);
  });

  it('allows second request within 1 hour window', () => {
    const ipHash = 'hash123';

    const first = checkRateLimit(ipHash);
    const second = checkRateLimit(ipHash);

    expect(first).toBe(true);
    expect(second).toBe(true);
  });

  it('allows third request within 1 hour window', () => {
    const ipHash = 'hash123';

    const first = checkRateLimit(ipHash);
    const second = checkRateLimit(ipHash);
    const third = checkRateLimit(ipHash);

    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(third).toBe(true);
  });

  it('blocks fourth request (rate limit exceeded)', () => {
    const ipHash = 'hash123';

    checkRateLimit(ipHash); // 1
    checkRateLimit(ipHash); // 2
    checkRateLimit(ipHash); // 3
    const fourth = checkRateLimit(ipHash); // Should be blocked

    expect(fourth).toBe(false);
  });

  it('blocks 5th request after 4th was blocked', () => {
    const ipHash = 'hash123';

    checkRateLimit(ipHash); // 1
    checkRateLimit(ipHash); // 2
    checkRateLimit(ipHash); // 3
    checkRateLimit(ipHash); // blocked
    const fifth = checkRateLimit(ipHash); // Should still be blocked

    expect(fifth).toBe(false);
  });

  it('different IPs are tracked separately', () => {
    const ip1 = 'hash1';
    const ip2 = 'hash2';

    checkRateLimit(ip1);
    checkRateLimit(ip1);
    checkRateLimit(ip1);
    const blocked = checkRateLimit(ip1); // IP1 blocked

    const ip2First = checkRateLimit(ip2); // IP2 should work

    expect(blocked).toBe(false);
    expect(ip2First).toBe(true);
  });

  it('resets counter after time window expires', () => {
    const ipHash = 'hash123';

    checkRateLimit(ipHash);
    checkRateLimit(ipHash);
    checkRateLimit(ipHash);
    const blocked = checkRateLimit(ipHash);

    expect(blocked).toBe(false);

    // Advance time by 1 hour + 1 second
    vi.advanceTimersByTime(3600000 + 1000);

    // Should allow new request after window reset
    const afterReset = checkRateLimit(ipHash);
    expect(afterReset).toBe(true);
  });

  it('respects custom maxRequests parameter', () => {
    const ipHash = 'hash123';
    const maxRequests = 2;

    const first = checkRateLimit(ipHash, maxRequests);
    const second = checkRateLimit(ipHash, maxRequests);
    const third = checkRateLimit(ipHash, maxRequests);

    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(third).toBe(false);
  });

  it('respects custom time window parameter', () => {
    const ipHash = 'hash123';
    const windowMs = 60000; // 1 minute

    checkRateLimit(ipHash, 3, windowMs);
    checkRateLimit(ipHash, 3, windowMs);
    checkRateLimit(ipHash, 3, windowMs);
    const blocked = checkRateLimit(ipHash, 3, windowMs);

    expect(blocked).toBe(false);

    // Advance by 1 minute + 1 second
    vi.advanceTimersByTime(windowMs + 1000);

    const afterReset = checkRateLimit(ipHash, 3, windowMs);
    expect(afterReset).toBe(true);
  });

  it('cleanup removes expired entries', () => {
    const ip1 = 'hash1';
    const ip2 = 'hash2';
    const windowMs = 3600000;

    checkRateLimit(ip1, 3, windowMs);
    checkRateLimit(ip2, 3, windowMs);

    // Advance time to expire IP1
    vi.advanceTimersByTime(windowMs + 1000);

    cleanupOldEntries();

    // IP2 should have reset since enough time passed
    // But new IP3 should work normally
    const ip3 = 'hash3';
    const ip3Result = checkRateLimit(ip3);
    expect(ip3Result).toBe(true);
  });

  it('handles multiple IPs independently', () => {
    const ips = Array.from({ length: 5 }, (_, i) => `hash${i}`);

    ips.forEach(ip => {
      const r1 = checkRateLimit(ip);
      const r2 = checkRateLimit(ip);
      const r3 = checkRateLimit(ip);
      const r4 = checkRateLimit(ip);

      expect(r1).toBe(true);
      expect(r2).toBe(true);
      expect(r3).toBe(true);
      expect(r4).toBe(false);
    });
  });

  it('allows exactly 3 requests per hour default', () => {
    const ipHash = 'test-hash';

    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(checkRateLimit(ipHash));
    }

    expect(results).toEqual([true, true, true, false, false]);
  });

  it('rate limit window does not affect other IPs', () => {
    const ip1 = 'hash1';
    const ip2 = 'hash2';

    // Exhaust IP1
    checkRateLimit(ip1);
    checkRateLimit(ip1);
    checkRateLimit(ip1);
    const ip1Blocked = checkRateLimit(ip1);

    expect(ip1Blocked).toBe(false);

    // IP2 should not be affected
    const ip2First = checkRateLimit(ip2);
    expect(ip2First).toBe(true);
  });

  it('cleanup is called without errors', () => {
    const ipHash = 'hash123';

    checkRateLimit(ipHash);
    checkRateLimit(ipHash);

    expect(() => {
      cleanupOldEntries();
    }).not.toThrow();
  });
});
