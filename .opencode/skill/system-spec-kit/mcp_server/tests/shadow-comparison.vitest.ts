// ───────────────────────────────────────────────────────────────
// 1. TEST — SHADOW COMPARISON
// ───────────────────────────────────────────────────────────────
// Verifies that tier-based channel routing produces results comparable
// To full pipeline (all 5 channels) while reducing simulated latency.
//
// Approach:
// - Simulate "search results" as fixed sets based on channel set
// - Use channel count as latency proxy (linear model: channelCount * baseMs)
// - Jaccard similarity of result IDs across routed vs full pipeline
// - 50+ synthetic queries spanning simple/moderate/complex tiers

import { describe, it, expect } from 'vitest';
import {
  classifyQueryComplexity,
  type QueryComplexityTier,
} from '../lib/search/query-classifier';
import {
  routeQuery,
  getChannelSubset,
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  type ChannelName,
} from '../lib/search/query-router';

/* ───────────────────────────────────────────────────────────────
   SYNTHETIC QUERY CORPUS — 60 queries (20 per tier)
   ──────────────────────────────────────────────────────────────── */

const SIMPLE_QUERIES = [
  'fix bug',
  'add feature',
  'search memory',
  'update config',
  'delete file',
  'run tests',
  'check status',
  'read file',
  'list files',
  'find spec',
  'save memory',
  'memory stats',
  'memory list',
  'memory health',
  'list tools',
  'search tools',
  'apply patch',
  'show diff',
  'get info',
  'reset index',
];

const MODERATE_QUERIES = [
  'refactor the database connection module',
  'implement user authentication for API',
  'fix the broken login form handler',
  'add dark mode support globally',
  'understand the caching system design',
  'check security vulnerabilities in API',
  'create a new dashboard component',
  'optimize the search query performance',
  'explain how authentication flow works',
  'build notification system for users',
  'review code quality in handlers',
  'migrate legacy database to PostgreSQL',
  'audit API endpoints for rate limits',
  'improve error handling in middleware',
  'add pagination to the results list',
  'configure deployment pipeline settings',
  'update dependencies to latest versions',
  'write integration tests for auth module',
  'document the REST API endpoints clearly',
  'refactor shared utility functions module',
];

const COMPLEX_QUERIES = [
  'explain how the authentication module integrates with the external OAuth provider and handles token refresh',
  'refactor the database connection pooling module to support multiple concurrent transaction isolation levels properly',
  'implement a comprehensive user notification system with email SMS and in-app push notification support channels',
  'investigate why the search results are returning duplicate entries when using the advanced filter with pagination',
  'add support for real-time collaborative editing with conflict resolution and operational transformation in documents',
  'review and audit the complete authentication authorization flow for potential security vulnerabilities and misconfigurations',
  'design a scalable event-driven architecture for processing high-volume streaming data with fault tolerance and exactly-once delivery',
  'build a comprehensive testing framework that includes unit integration and end-to-end tests with coverage reporting',
  'create a migration plan for moving the monolithic application to a microservices architecture with service mesh',
  'implement rate limiting and request throttling with configurable policies per endpoint user role and time window',
  'optimize database queries for the analytics dashboard that currently takes over thirty seconds to load completely',
  'debug the intermittent connection timeout errors that occur during peak traffic hours in the production environment',
  'implement zero-downtime deployment strategy using blue-green deployment with automated health checks and rollback',
  'design and build a distributed caching layer with TTL invalidation and cache-aside pattern for microservices',
  'write a comprehensive security audit covering authentication authorization input validation and dependency vulnerabilities',
  'build a real-time monitoring dashboard with metrics aggregation alerting and historical trend analysis capabilities',
  'refactor the legacy monolith to extract the user management domain into an independent deployable microservice',
  'implement full-text search with relevance ranking stemming stop-word filtering and approximate nearest-neighbor retrieval',
  'create an automated data pipeline for ETL processing with error recovery idempotency and observability instrumentation',
  'investigate and resolve the memory leak causing gradual performance degradation in the long-running background worker process',
];

const ALL_QUERIES = [...SIMPLE_QUERIES, ...MODERATE_QUERIES, ...COMPLEX_QUERIES];

/* ───────────────────────────────────────────────────────────────
   SIMULATION HELPERS
   ──────────────────────────────────────────────────────────────── */

/** Simulated base latency per channel (ms). */
const BASE_MS_PER_CHANNEL = 10;

/**
 * Simulate result IDs returned by a given channel set.
 * In a real system this would invoke the actual search pipeline.
 * Here we use a deterministic function of channel names to produce
 * a fixed set of result IDs per channel, then union across channels.
 *
 * The vector + fts channels are considered "core" and always return
 * the top results. Additional channels contribute a few more.
 */
function simulateResultIds(channels: readonly ChannelName[], queryHash: number): Set<number> {
  const ids = new Set<number>();

  // Each channel contributes a fixed set of "result slots" based on its index
  // In ALL_CHANNELS and a small query-specific offset
  const channelIndex = (name: ChannelName): number =>
    ALL_CHANNELS.indexOf(name as ChannelName);

  for (const ch of channels) {
    const base = (channelIndex(ch) * 7 + queryHash) % 100;
    // Each channel contributes 3 results
    for (let i = 0; i < 3; i++) {
      ids.add(base + i);
    }
  }
  return ids;
}

/** Compute Jaccard similarity between two sets of result IDs. */
function jaccardSimilarity(a: Set<number>, b: Set<number>): number {
  if (a.size === 0 && b.size === 0) return 1.0;
  let intersection = 0;
  for (const id of a) {
    if (b.has(id)) intersection++;
  }
  const union = new Set([...a, ...b]).size;
  return intersection / union;
}

/** Simulate query processing latency (channel count as proxy). */
function simulatedLatencyMs(channels: readonly ChannelName[]): number {
  return channels.length * BASE_MS_PER_CHANNEL;
}

/** Simple hash for a query string → deterministic integer. */
function queryHash(q: string): number {
  let h = 0;
  for (let i = 0; i < q.length; i++) {
    h = (h * 31 + q.charCodeAt(i)) & 0x7fffffff;
  }
  return h % 97;
}

/* ───────────────────────────────────────────────────────────────
   T031-01: SYNTHETIC QUERY CORPUS VERIFICATION
   ──────────────────────────────────────────────────────────────── */

describe('T031-01: Synthetic Query Corpus', () => {
  it('T1: corpus contains at least 50 queries', () => {
    expect(ALL_QUERIES.length).toBeGreaterThanOrEqual(50);
  });

  it('T2: corpus has exactly 20 simple queries', () => {
    expect(SIMPLE_QUERIES.length).toBe(20);
  });

  it('T3: corpus has exactly 20 moderate queries', () => {
    expect(MODERATE_QUERIES.length).toBe(20);
  });

  it('T4: corpus has exactly 20 complex queries', () => {
    expect(COMPLEX_QUERIES.length).toBe(20);
  });

  it('T5: no query appears in multiple tier lists', () => {
    const simple = new Set(SIMPLE_QUERIES);
    const moderate = new Set(MODERATE_QUERIES);
    const complex = new Set(COMPLEX_QUERIES);
    for (const q of MODERATE_QUERIES) {
      expect(simple.has(q)).toBe(false);
    }
    for (const q of COMPLEX_QUERIES) {
      expect(simple.has(q)).toBe(false);
      expect(moderate.has(q)).toBe(false);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   T031-02: CHANNEL COUNT PER TIER VERIFICATION
   ──────────────────────────────────────────────────────────────── */

describe('T031-02: Channel Count Per Tier', () => {
  it('T6: simple tier routes to exactly 2 channels', () => {
    const channels = getChannelSubset('simple');
    expect(channels).toHaveLength(2);
  });

  it('T7: moderate tier routes to exactly 3 channels', () => {
    const channels = getChannelSubset('moderate');
    expect(channels).toHaveLength(3);
  });

  it('T8: complex tier routes to all 5 channels', () => {
    const channels = getChannelSubset('complex');
    expect(channels).toHaveLength(5);
  });

  it('T9: full pipeline (ALL_CHANNELS) has 5 channels', () => {
    expect(ALL_CHANNELS).toHaveLength(5);
  });

  it('T10: routed simple uses fewer channels than complex', () => {
    const simpleChannels = getChannelSubset('simple');
    const complexChannels = getChannelSubset('complex');
    expect(simpleChannels.length).toBeLessThan(complexChannels.length);
  });
});

/* ───────────────────────────────────────────────────────────────
   T031-03: SIMULATED TIMING COMPARISON
   ──────────────────────────────────────────────────────────────── */

describe('T031-03: Simulated Timing (Channel Count Proxy)', () => {
  it('T11: simple queries simulated latency is ~60% faster than full pipeline', () => {
    const simpleLatency = simulatedLatencyMs(DEFAULT_ROUTING_CONFIG.simple);    // 2 ch × 10ms = 20ms
    const fullLatency = simulatedLatencyMs([...ALL_CHANNELS]);                   // 5 ch × 10ms = 50ms

    // Simple should be at most 40% of full (i.e., at least 60% faster)
    const ratio = simpleLatency / fullLatency;
    expect(ratio).toBeLessThanOrEqual(0.40);
  });

  it('T12: moderate queries simulated latency is between simple and full', () => {
    const simpleLatency = simulatedLatencyMs(DEFAULT_ROUTING_CONFIG.simple);
    const moderateLatency = simulatedLatencyMs(DEFAULT_ROUTING_CONFIG.moderate);
    const fullLatency = simulatedLatencyMs([...ALL_CHANNELS]);

    expect(moderateLatency).toBeGreaterThan(simpleLatency);
    expect(moderateLatency).toBeLessThan(fullLatency);
  });

  it('T13: p95 latency for simple queries (2 channels) is <30ms', () => {
    // With BASE_MS_PER_CHANNEL=10 and 2 channels: 20ms < 30ms
    const latencies = SIMPLE_QUERIES.map(() =>
      simulatedLatencyMs(DEFAULT_ROUTING_CONFIG.simple)
    );
    const sorted = [...latencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];
    expect(p95).toBeLessThan(30);
  });

  it('T14: latency scales linearly with channel count', () => {
    const ch2 = simulatedLatencyMs(['vector', 'fts']);
    const ch3 = simulatedLatencyMs(['vector', 'fts', 'bm25']);
    const ch5 = simulatedLatencyMs([...ALL_CHANNELS]);

    expect(ch2).toBe(2 * BASE_MS_PER_CHANNEL);
    expect(ch3).toBe(3 * BASE_MS_PER_CHANNEL);
    expect(ch5).toBe(5 * BASE_MS_PER_CHANNEL);
  });
});

/* ───────────────────────────────────────────────────────────────
   T031-04: RESULT OVERLAP (JACCARD SIMILARITY)
   ──────────────────────────────────────────────────────────────── */

describe('T031-04: Result Overlap — Jaccard Similarity', () => {
  it('T15: complex-tier routed results have high overlap with full pipeline', () => {
    // Complex routing uses all 5 channels = identical to full pipeline
    const complexChannels = getChannelSubset('complex');
    const fullChannels = [...ALL_CHANNELS] as ChannelName[];

    const similarities: number[] = [];
    for (const q of COMPLEX_QUERIES) {
      const hash = queryHash(q);
      const routedIds = simulateResultIds(complexChannels, hash);
      const fullIds = simulateResultIds(fullChannels, hash);
      similarities.push(jaccardSimilarity(routedIds, fullIds));
    }

    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    // Complex tier uses all channels → should be identical (similarity = 1.0)
    expect(avgSimilarity).toBeCloseTo(1.0, 2);
  });

  it('T16: simple-tier results share core overlap with full pipeline', () => {
    // Simple uses vector + fts (subset of full pipeline)
    const simpleChannels = getChannelSubset('simple');
    const fullChannels = [...ALL_CHANNELS] as ChannelName[];

    const similarities: number[] = [];
    for (const q of SIMPLE_QUERIES) {
      const hash = queryHash(q);
      const routedIds = simulateResultIds(simpleChannels, hash);
      const fullIds = simulateResultIds(fullChannels, hash);
      similarities.push(jaccardSimilarity(routedIds, fullIds));
    }

    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    // Simple uses a subset of channels so similarity is partial but > 0
    expect(avgSimilarity).toBeGreaterThan(0);
    expect(avgSimilarity).toBeLessThanOrEqual(1.0);
  });

  it('T17: Jaccard similarity is 1.0 for identical result sets', () => {
    const ids = new Set([1, 2, 3, 4, 5]);
    expect(jaccardSimilarity(ids, ids)).toBe(1.0);
  });

  it('T18: Jaccard similarity is 0 for disjoint result sets', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([4, 5, 6]);
    expect(jaccardSimilarity(a, b)).toBe(0);
  });

  it('T19: Jaccard similarity is between 0 and 1 for partial overlap', () => {
    const a = new Set([1, 2, 3, 4]);
    const b = new Set([3, 4, 5, 6]);
    const sim = jaccardSimilarity(a, b);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
    // Intersection={3,4}=2, Union={1,2,3,4,5,6}=6 → 2/6 ≈ 0.333
    expect(sim).toBeCloseTo(2 / 6, 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   T031-05: ROUTING CORRECTNESS ON SYNTHETIC CORPUS
   ──────────────────────────────────────────────────────────────── */

describe('T031-05: Routing Correctness on Synthetic Corpus', () => {
  it('T20: all queries route to valid channel sets (≥2 channels)', () => {
    // Enable complexity router for this test
    const original = process.env.SPECKIT_COMPLEXITY_ROUTER;
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
    try {
      for (const q of ALL_QUERIES) {
        const result = routeQuery(q);
        expect(result.channels.length).toBeGreaterThanOrEqual(2);
      }
    } finally {
      if (original === undefined) {
        delete process.env.SPECKIT_COMPLEXITY_ROUTER;
      } else {
        process.env.SPECKIT_COMPLEXITY_ROUTER = original;
      }
    }
  });

  it('T21: flag disabled routes ALL queries to full pipeline (5 channels)', () => {
    const original = process.env.SPECKIT_COMPLEXITY_ROUTER;
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    try {
      for (const q of ALL_QUERIES) {
        const result = routeQuery(q);
        expect(result.channels).toHaveLength(5);
        expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
      }
    } finally {
      if (original === undefined) {
        delete process.env.SPECKIT_COMPLEXITY_ROUTER;
      } else {
        process.env.SPECKIT_COMPLEXITY_ROUTER = original;
      }
    }
  });
});
