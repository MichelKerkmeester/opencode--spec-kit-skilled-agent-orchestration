// ───────────────────────────────────────────────────────────────
// 1. TEST — QUERY CLASSIFIER
// ───────────────────────────────────────────────────────────────
// Query Intelligence: complexity classification and routing

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  SIMPLE_TERM_THRESHOLD,
  COMPLEX_TERM_THRESHOLD,
  STOP_WORDS,
  extractTerms,
  calculateStopWordRatio,
  hasTriggerMatch,
  type QueryComplexityTier,
  type ClassificationResult,
} from '../lib/search/query-classifier';

/* ───────────────────────────────────────────────────────────────
   TEST DATA: 10+ queries per tier (30+ total)
──────────────────────────────────────────────────────────────── */

const TRIGGER_PHRASES = [
  'save context',
  'memory search',
  'find spec',
  'save memory',
  'memory stats',
  'memory health',
  'checkpoint create',
  'list tools',
  'search tools',
  'memory list',
  'get learning history',
  'memory delete',
];

const SIMPLE_QUERIES = [
  // Short queries (≤3 terms)
  'fix bug',
  'add feature',
  'search memory',
  'find spec',               // Also a trigger match
  'save context',            // Trigger match
  'memory search',           // Trigger match
  'update config',
  'delete file',
  'run tests',
  'check status',
  'read file',
  'list files',
];

const MODERATE_QUERIES = [
  // 4-8 terms, no trigger match
  'refactor the database connection module',
  'implement user authentication for API',
  'fix the broken login form',
  'add dark mode support globally',
  'understand the caching system design',
  'check security vulnerabilities in API',
  'create a new dashboard component',
  'optimize the search query performance',
  'explain how authentication flow works',
  'build notification system for users',
  'review code quality in handlers',
  'migrate legacy database to PostgreSQL',
];

const COMPLEX_QUERIES = [
  // >8 terms, no trigger match
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
];

/* ───────────────────────────────────────────────────────────────
   HELPER: Enable the feature flag for tests
──────────────────────────────────────────────────────────────── */

function withFeatureFlag(fn: () => void): void {
  const original = process.env.SPECKIT_COMPLEXITY_ROUTER;
  process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    } else {
      process.env.SPECKIT_COMPLEXITY_ROUTER = original;
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   T022-01: FEATURE FLAG TESTS
──────────────────────────────────────────────────────────────── */

describe('T022-01: Feature Flag (SPECKIT_COMPLEXITY_ROUTER)', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.SPECKIT_COMPLEXITY_ROUTER;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    } else {
      process.env.SPECKIT_COMPLEXITY_ROUTER = originalEnv;
    }
  });

  it('defaults to enabled when env var is not set (graduated flag)', () => {
    delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    expect(isComplexityRouterEnabled()).toBe(true);
  });

  it('is disabled when env var is "false"', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    expect(isComplexityRouterEnabled()).toBe(false);
  });

  it('is enabled when env var is empty string (graduated flag)', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = '';
    expect(isComplexityRouterEnabled()).toBe(true);
  });

  it('is enabled when env var is arbitrary string (graduated flag)', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'maybe';
    expect(isComplexityRouterEnabled()).toBe(true);
  });

  it('is enabled when env var is "true"', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
    expect(isComplexityRouterEnabled()).toBe(true);
  });

  it('is enabled when env var is "TRUE" (case-insensitive)', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'TRUE';
    expect(isComplexityRouterEnabled()).toBe(true);
  });

  it('is enabled when env var is "True" (mixed case)', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'True';
    expect(isComplexityRouterEnabled()).toBe(true);
  });

  it('when disabled, classifyQueryComplexity always returns "complex"', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    const shortQuery = classifyQueryComplexity('fix bug');
    expect(shortQuery.tier).toBe('complex');
    expect(shortQuery.confidence).toBe('fallback');

    const longQuery = classifyQueryComplexity('explain the full architecture of the system');
    expect(longQuery.tier).toBe('complex');
    expect(longQuery.confidence).toBe('fallback');
  });

  it('when disabled, trigger matches still return "complex"', () => {
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    const result = classifyQueryComplexity('save context', TRIGGER_PHRASES);
    expect(result.tier).toBe('complex');
    expect(result.confidence).toBe('fallback');
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-02: SIMPLE TIER CLASSIFICATION (10+ queries)
──────────────────────────────────────────────────────────────── */

describe('T022-02: Simple Tier Classification', () => {
  it('classifies all simple queries as "simple" (≤3 terms or trigger match)', () => {
    withFeatureFlag(() => {
      let correct = 0;
      for (const query of SIMPLE_QUERIES) {
        const result = classifyQueryComplexity(query, TRIGGER_PHRASES);
        if (result.tier === 'simple') correct++;
      }
      expect(correct).toBe(SIMPLE_QUERIES.length);
      expect(SIMPLE_QUERIES.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('classifies 1-term queries as simple', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('search');
      expect(result.tier).toBe('simple');
      expect(result.features.termCount).toBe(1);
    });
  });

  it('classifies 2-term queries as simple', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix bug');
      expect(result.tier).toBe('simple');
      expect(result.features.termCount).toBe(2);
    });
  });

  it('classifies 3-term queries as simple', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('add new feature');
      expect(result.tier).toBe('simple');
      expect(result.features.termCount).toBe(3);
    });
  });

  it('classifies trigger phrase matches as simple regardless of length', () => {
    withFeatureFlag(() => {
      // "get learning history" has 3 terms and is a trigger phrase
      const result = classifyQueryComplexity('get learning history', TRIGGER_PHRASES);
      expect(result.tier).toBe('simple');
      expect(result.features.hasTriggerMatch).toBe(true);
    });
  });

  it('reports high confidence for trigger matches', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('save context', TRIGGER_PHRASES);
      expect(result.confidence).toBe('high');
    });
  });

  it('reports high confidence for very short queries', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix');
      expect(result.confidence).toBe('high');
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-03: MODERATE TIER CLASSIFICATION (10+ queries)
──────────────────────────────────────────────────────────────── */

describe('T022-03: Moderate Tier Classification', () => {
  it('classifies all moderate queries as "moderate" (4-8 terms, no trigger)', () => {
    withFeatureFlag(() => {
      let correct = 0;
      for (const query of MODERATE_QUERIES) {
        const result = classifyQueryComplexity(query);
        if (result.tier === 'moderate') correct++;
      }
      expect(correct).toBe(MODERATE_QUERIES.length);
      expect(MODERATE_QUERIES.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('classifies exactly 4-term query as moderate', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('refactor the database module');
      expect(result.tier).toBe('moderate');
      expect(result.features.termCount).toBe(4);
    });
  });

  it('classifies exactly 8-term query as moderate', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('implement user authentication for the web API endpoint');
      expect(result.tier).toBe('moderate');
      expect(result.features.termCount).toBe(8);
    });
  });

  it('reports appropriate confidence for moderate tier', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('refactor the database connection module');
      expect(['low', 'medium']).toContain(result.confidence);
    });
  });

  it('reports low confidence near simple boundary (4 terms)', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('refactor the database module');
      expect(result.features.termCount).toBe(SIMPLE_TERM_THRESHOLD + 1);
      expect(result.confidence).toBe('low');
    });
  });

  it('reports low confidence near complex boundary (8 terms)', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('implement user authentication for the web API endpoint');
      expect(result.features.termCount).toBe(COMPLEX_TERM_THRESHOLD);
      expect(result.confidence).toBe('low');
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-04: COMPLEX TIER CLASSIFICATION (10+ queries)
──────────────────────────────────────────────────────────────── */

describe('T022-04: Complex Tier Classification', () => {
  it('classifies all complex queries as "complex" (>8 terms, no trigger)', () => {
    withFeatureFlag(() => {
      let correct = 0;
      for (const query of COMPLEX_QUERIES) {
        const result = classifyQueryComplexity(query);
        if (result.tier === 'complex') correct++;
      }
      expect(correct).toBe(COMPLEX_QUERIES.length);
      expect(COMPLEX_QUERIES.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('classifies 9-term query as complex', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('explain how the authentication module integrates with external providers');
      expect(result.tier).toBe('complex');
      expect(result.features.termCount).toBe(9);
    });
  });

  it('classifies very long query as complex', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity(
        'design and implement a comprehensive distributed caching layer with write-through and write-behind policies for the microservices architecture including cache invalidation strategies'
      );
      expect(result.tier).toBe('complex');
      expect(result.features.termCount).toBeGreaterThan(COMPLEX_TERM_THRESHOLD);
    });
  });

  it('reports high confidence for very long queries (>12 terms)', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity(
        'explain how the authentication module integrates with the external OAuth provider and handles token refresh gracefully'
      );
      expect(result.features.termCount).toBeGreaterThan(12);
      expect(result.confidence).toBe('high');
    });
  });

  it('reports high confidence for content-rich queries (low stop-word ratio)', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity(
        'implement rate limiting request throttling configurable policies endpoint user role'
      );
      expect(result.tier).toBe('complex');
      expect(result.features.stopWordRatio).toBeLessThan(0.3);
      expect(result.confidence).toBe('high');
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-05: CONFIG THRESHOLDS
──────────────────────────────────────────────────────────────── */

describe('T022-05: Config-Driven Thresholds', () => {
  it('SIMPLE_TERM_THRESHOLD is 3', () => {
    expect(SIMPLE_TERM_THRESHOLD).toBe(3);
  });

  it('COMPLEX_TERM_THRESHOLD is 8', () => {
    expect(COMPLEX_TERM_THRESHOLD).toBe(8);
  });

  it('thresholds define correct boundaries', () => {
    expect(SIMPLE_TERM_THRESHOLD).toBeLessThan(COMPLEX_TERM_THRESHOLD);
  });

  it('query at SIMPLE_TERM_THRESHOLD boundary (3 terms) is simple', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix the bug');
      expect(result.features.termCount).toBe(SIMPLE_TERM_THRESHOLD);
      expect(result.tier).toBe('simple');
    });
  });

  it('query at SIMPLE_TERM_THRESHOLD + 1 (4 terms) is moderate', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix the login bug');
      expect(result.features.termCount).toBe(SIMPLE_TERM_THRESHOLD + 1);
      expect(result.tier).toBe('moderate');
    });
  });

  it('query at COMPLEX_TERM_THRESHOLD (8 terms) is moderate', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix the login bug in the main module');
      expect(result.features.termCount).toBe(COMPLEX_TERM_THRESHOLD);
      expect(result.tier).toBe('moderate');
    });
  });

  it('query at COMPLEX_TERM_THRESHOLD + 1 (9 terms) is complex', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix the login bug in the main authentication module');
      expect(result.features.termCount).toBe(COMPLEX_TERM_THRESHOLD + 1);
      expect(result.tier).toBe('complex');
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-06: STOP-WORD RATIO CALCULATION
──────────────────────────────────────────────────────────────── */

describe('T022-06: Stop-Word Ratio Accuracy', () => {
  it('calculates 0 ratio for all content words', () => {
    const terms = extractTerms('implement authentication database');
    const ratio = calculateStopWordRatio(terms);
    expect(ratio).toBe(0);
  });

  it('calculates 1.0 ratio for all stop words', () => {
    const terms = extractTerms('the a an is are');
    const ratio = calculateStopWordRatio(terms);
    expect(ratio).toBe(1);
  });

  it('calculates correct ratio for mixed terms', () => {
    // "fix the login bug" → 1 stop word ("the") / 4 terms = 0.25
    const terms = extractTerms('fix the login bug');
    const ratio = calculateStopWordRatio(terms);
    expect(ratio).toBe(0.25);
  });

  it('calculates correct ratio for high stop-word query', () => {
    // "is it in the" → 4 stop words / 4 terms = 1.0
    const terms = extractTerms('is it in the');
    const ratio = calculateStopWordRatio(terms);
    expect(ratio).toBe(1);
  });

  it('returns 0 for empty term list', () => {
    const ratio = calculateStopWordRatio([]);
    expect(ratio).toBe(0);
  });

  it('is case-insensitive for stop word detection', () => {
    const terms = ['THE', 'Bug', 'IS', 'Fixed'];
    const ratio = calculateStopWordRatio(terms);
    // "THE" and "IS" are stop words → 2/4 = 0.5
    expect(ratio).toBe(0.5);
  });

  it('STOP_WORDS set contains all required words', () => {
    const required = [
      'the', 'a', 'an', 'is', 'are', 'was', 'were',
      'in', 'on', 'at', 'to', 'for', 'of',
      'and', 'or', 'but', 'not',
      'with', 'this', 'that', 'it',
      'from', 'by', 'as', 'be',
      'has', 'had', 'have',
      'do', 'does', 'did',
      'will', 'would', 'can', 'could', 'should', 'may', 'might',
    ];
    for (const word of required) {
      expect(STOP_WORDS.has(word)).toBe(true);
    }
  });

  it('stop-word ratio is reflected in classification features', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('the a an is are in on at to');
      // All stop words → high ratio
      expect(result.features.stopWordRatio).toBeGreaterThan(0.9);
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-07: TRIGGER PHRASE MATCHING
──────────────────────────────────────────────────────────────── */

describe('T022-07: Trigger Phrase Matching', () => {
  it('matches exact trigger phrase (case-insensitive)', () => {
    expect(hasTriggerMatch('save context', TRIGGER_PHRASES)).toBe(true);
    expect(hasTriggerMatch('SAVE CONTEXT', TRIGGER_PHRASES)).toBe(true);
    expect(hasTriggerMatch('Save Context', TRIGGER_PHRASES)).toBe(true);
  });

  it('does not match partial trigger phrase', () => {
    expect(hasTriggerMatch('save', TRIGGER_PHRASES)).toBe(false);
    expect(hasTriggerMatch('save context now', TRIGGER_PHRASES)).toBe(false);
  });

  it('handles empty trigger phrase list', () => {
    expect(hasTriggerMatch('save context', [])).toBe(false);
  });

  it('handles whitespace in query matching', () => {
    expect(hasTriggerMatch('  save context  ', TRIGGER_PHRASES)).toBe(true);
  });

  it('trigger match overrides term count for classification', () => {
    withFeatureFlag(() => {
      // "get learning history" is a trigger phrase with exactly 3 terms
      const result = classifyQueryComplexity('get learning history', TRIGGER_PHRASES);
      expect(result.tier).toBe('simple');
      expect(result.features.hasTriggerMatch).toBe(true);
    });
  });

  it('no trigger match when triggerPhrases is undefined', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('save context');
      expect(result.features.hasTriggerMatch).toBe(false);
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-08: EDGE CASES & ERROR FALLBACKS
──────────────────────────────────────────────────────────────── */

describe('T022-08: Edge Cases and Error Fallbacks', () => {
  it('empty string returns complex fallback', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('');
      expect(result.tier).toBe('complex');
      expect(result.confidence).toBe('fallback');
    });
  });

  it('whitespace-only string returns complex fallback', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('   \t\n  ');
      expect(result.tier).toBe('complex');
      expect(result.confidence).toBe('fallback');
    });
  });

  it('null query returns complex fallback', () => {
    withFeatureFlag(() => {
      // @ts-expect-error -- intentional null test
      const result = classifyQueryComplexity(null);
      expect(result.tier).toBe('complex');
      expect(result.confidence).toBe('fallback');
    });
  });

  it('undefined query returns complex fallback', () => {
    withFeatureFlag(() => {
      // @ts-expect-error -- intentional undefined test
      const result = classifyQueryComplexity(undefined);
      expect(result.tier).toBe('complex');
      expect(result.confidence).toBe('fallback');
    });
  });

  it('numeric query returns complex fallback', () => {
    withFeatureFlag(() => {
      // @ts-expect-error -- intentional type mismatch
      const result = classifyQueryComplexity(42);
      expect(result.tier).toBe('complex');
      expect(result.confidence).toBe('fallback');
    });
  });

  it('single character query is classified as simple', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('a');
      expect(result.tier).toBe('simple');
      expect(result.features.termCount).toBe(1);
    });
  });

  it('query with multiple spaces between terms is handled correctly', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix   the    bug');
      expect(result.tier).toBe('simple');
      expect(result.features.termCount).toBe(3);
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-09: CLASSIFICATION RESULT STRUCTURE
──────────────────────────────────────────────────────────────── */

describe('T022-09: ClassificationResult Structure', () => {
  it('returns correct interface shape', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix the login bug');

      // Tier
      expect(['simple', 'moderate', 'complex']).toContain(result.tier);

      // Features
      expect(typeof result.features.termCount).toBe('number');
      expect(typeof result.features.charCount).toBe('number');
      expect(typeof result.features.hasTriggerMatch).toBe('boolean');
      expect(typeof result.features.stopWordRatio).toBe('number');

      // Confidence
      expect(typeof result.confidence).toBe('string');
    });
  });

  it('charCount reflects actual query length', () => {
    withFeatureFlag(() => {
      const query = 'fix the login bug';
      const result = classifyQueryComplexity(query);
      expect(result.features.charCount).toBe(query.length);
    });
  });

  it('termCount reflects actual term count', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('one two three four five');
      expect(result.features.termCount).toBe(5);
    });
  });

  it('stopWordRatio is between 0 and 1', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('implement the new authentication module');
      expect(result.features.stopWordRatio).toBeGreaterThanOrEqual(0);
      expect(result.features.stopWordRatio).toBeLessThanOrEqual(1);
    });
  });

  it('stopWordRatio has at most 3 decimal places', () => {
    withFeatureFlag(() => {
      const result = classifyQueryComplexity('fix the login bug in the system');
      const decimals = result.features.stopWordRatio.toString().split('.')[1];
      if (decimals) {
        expect(decimals.length).toBeLessThanOrEqual(3);
      }
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-10: TERM EXTRACTION
──────────────────────────────────────────────────────────────── */

describe('T022-10: Term Extraction', () => {
  it('extracts terms by whitespace', () => {
    expect(extractTerms('fix the bug')).toEqual(['fix', 'the', 'bug']);
  });

  it('handles multiple spaces', () => {
    expect(extractTerms('fix   the    bug')).toEqual(['fix', 'the', 'bug']);
  });

  it('handles leading/trailing whitespace', () => {
    expect(extractTerms('  fix bug  ')).toEqual(['fix', 'bug']);
  });

  it('handles tabs and newlines', () => {
    expect(extractTerms('fix\tthe\nbug')).toEqual(['fix', 'the', 'bug']);
  });

  it('returns empty array for empty string', () => {
    expect(extractTerms('')).toEqual([]);
  });

  it('returns empty array for whitespace-only string', () => {
    expect(extractTerms('   ')).toEqual([]);
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-11: CHANNEL ROUTING TIER MAPPING (Documentation)
──────────────────────────────────────────────────────────────── */

describe('T022-11: Tier-to-Channel Mapping Readiness', () => {
  it('tier values are exactly the expected enum values', () => {
    withFeatureFlag(() => {
      const simple = classifyQueryComplexity('fix bug');
      const moderate = classifyQueryComplexity('refactor the database connection module');
      const complex = classifyQueryComplexity('explain how the authentication module integrates with the external OAuth provider and handles refresh');

      expect(simple.tier).toBe('simple');
      expect(moderate.tier).toBe('moderate');
      expect(complex.tier).toBe('complex');
    });
  });

  it('QueryComplexityTier type covers all three values', () => {
    // TypeScript compile-time check: all tiers are assignable
    const tiers: QueryComplexityTier[] = ['simple', 'moderate', 'complex'];
    expect(tiers).toHaveLength(3);
  });
});

/* ───────────────────────────────────────────────────────────────
   T022-12: COMPREHENSIVE ACCURACY TEST
──────────────────────────────────────────────────────────────── */

describe('T022-12: Comprehensive Accuracy', () => {
  it('100% accuracy on simple tier (10+ queries)', () => {
    withFeatureFlag(() => {
      let correct = 0;
      for (const query of SIMPLE_QUERIES) {
        const result = classifyQueryComplexity(query, TRIGGER_PHRASES);
        if (result.tier === 'simple') correct++;
      }
      expect(correct).toBe(SIMPLE_QUERIES.length);
    });
  });

  it('100% accuracy on moderate tier (10+ queries)', () => {
    withFeatureFlag(() => {
      let correct = 0;
      for (const query of MODERATE_QUERIES) {
        const result = classifyQueryComplexity(query);
        if (result.tier === 'moderate') correct++;
      }
      expect(correct).toBe(MODERATE_QUERIES.length);
    });
  });

  it('100% accuracy on complex tier (10+ queries)', () => {
    withFeatureFlag(() => {
      let correct = 0;
      for (const query of COMPLEX_QUERIES) {
        const result = classifyQueryComplexity(query);
        if (result.tier === 'complex') correct++;
      }
      expect(correct).toBe(COMPLEX_QUERIES.length);
    });
  });

  it('total test query count exceeds 30', () => {
    const total = SIMPLE_QUERIES.length + MODERATE_QUERIES.length + COMPLEX_QUERIES.length;
    expect(total).toBeGreaterThanOrEqual(30);
  });
});
