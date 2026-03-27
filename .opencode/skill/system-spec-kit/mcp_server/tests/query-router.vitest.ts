// ───────────────────────────────────────────────────────────────
// 1. TEST — QUERY ROUTER
// ───────────────────────────────────────────────────────────────
// Tier-to-Channel-Subset Routing + Pipeline Integration
// 22 tests covering:
// Channel subset per tier, minimum invariant, custom config,
// RouteQuery convenience, feature flag disabled, classification details,
// Edge cases, enforceMinimumChannels, ALL_CHANNELS constant

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,
  getChannelSubset,
  routeQuery,
  enforceMinimumChannels,
  type ChannelName,
  type ChannelRoutingConfig,
} from '../lib/search/query-router';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const FEATURE_FLAG = 'SPECKIT_COMPLEXITY_ROUTER';

const savedEnv: Record<string, string | undefined> = {};

function setEnv(key: string, value: string | undefined) {
  if (!(key in savedEnv)) savedEnv[key] = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function restoreEnv() {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  for (const key of Object.keys(savedEnv)) {
    delete savedEnv[key];
  }
}

/** Enable the complexity router feature flag for a test block. */
function withFeatureFlag(fn: () => void): void {
  const original = process.env[FEATURE_FLAG];
  process.env[FEATURE_FLAG] = 'true';
  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env[FEATURE_FLAG];
    } else {
      process.env[FEATURE_FLAG] = original;
    }
  }
}

const TRIGGER_PHRASES = [
  'save context',
  'memory search',
  'find spec',
  'save memory',
  'memory stats',
];

/* ───────────────────────────────────────────────────────────────
   T026-01: DEFAULT ROUTING CONFIG
   ──────────────────────────────────────────────────────────────── */

describe('T026-01: Default Routing Config', () => {
  it('T1: simple tier maps to exactly 2 channels (vector + fts)', () => {
    expect(DEFAULT_ROUTING_CONFIG.simple).toEqual(['vector', 'fts']);
    expect(DEFAULT_ROUTING_CONFIG.simple).toHaveLength(2);
  });

  it('T2: moderate tier maps to 3 channels (vector + fts + bm25)', () => {
    expect(DEFAULT_ROUTING_CONFIG.moderate).toEqual(['vector', 'fts', 'bm25']);
    expect(DEFAULT_ROUTING_CONFIG.moderate).toHaveLength(3);
  });

  it('T3: complex tier maps to all 5 channels', () => {
    expect(DEFAULT_ROUTING_CONFIG.complex).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
    expect(DEFAULT_ROUTING_CONFIG.complex).toHaveLength(5);
  });

  it('T4: ALL_CHANNELS constant contains all 5 channel names', () => {
    expect(ALL_CHANNELS).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
    expect(ALL_CHANNELS).toHaveLength(5);
  });

  it('T5: MIN_CHANNELS is 2', () => {
    expect(MIN_CHANNELS).toBe(2);
  });

  it('T6: FALLBACK_CHANNELS are vector and fts', () => {
    expect(FALLBACK_CHANNELS).toEqual(['vector', 'fts']);
  });
});

/* ───────────────────────────────────────────────────────────────
   T026-02: getChannelSubset
   ──────────────────────────────────────────────────────────────── */

describe('T026-02: getChannelSubset', () => {
  it('T7: simple tier returns 2 channels with default config', () => {
    const channels = getChannelSubset('simple');
    expect(channels).toHaveLength(2);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
  });

  it('T8: moderate tier returns 3 channels with default config', () => {
    const channels = getChannelSubset('moderate');
    expect(channels).toHaveLength(3);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
    expect(channels).toContain('bm25');
  });

  it('T9: complex tier returns all 5 channels with default config', () => {
    const channels = getChannelSubset('complex');
    expect(channels).toHaveLength(5);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
    expect(channels).toContain('bm25');
    expect(channels).toContain('graph');
    expect(channels).toContain('degree');
  });

  it('T10: custom config overrides default routing', () => {
    const customConfig: ChannelRoutingConfig = {
      simple: ['bm25', 'graph'],
      moderate: ['vector', 'fts', 'graph', 'degree'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const simpleChannels = getChannelSubset('simple', customConfig);
    expect(simpleChannels).toEqual(['bm25', 'graph']);

    const moderateChannels = getChannelSubset('moderate', customConfig);
    expect(moderateChannels).toEqual(['vector', 'fts', 'graph', 'degree']);
    expect(moderateChannels).toHaveLength(4);
  });

  it('T11: returns a copy, not a reference to the config array', () => {
    const channels = getChannelSubset('simple');
    channels.push('graph');
    // Original config should be unchanged
    expect(DEFAULT_ROUTING_CONFIG.simple).toHaveLength(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   T026-03: MINIMUM 2-CHANNEL INVARIANT
   ──────────────────────────────────────────────────────────────── */

describe('T026-03: Minimum 2-Channel Invariant', () => {
  it('T12: empty channel config is padded to 2 channels', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: [] as ChannelName[],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels.length).toBeGreaterThanOrEqual(2);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
  });

  it('T13: single-channel config is padded to 2 channels', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: ['graph'],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels.length).toBeGreaterThanOrEqual(2);
    expect(channels).toContain('graph'); // original preserved
    // Should have at least one fallback added
    const hasFallback = channels.includes('vector') || channels.includes('fts');
    expect(hasFallback).toBe(true);
  });

  it('T14: single-channel config with vector gets fts as fallback', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: ['vector'],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels).toHaveLength(2);
    expect(channels).toContain('vector');
    expect(channels).toContain('fts');
  });

  it('T15: enforceMinimumChannels pads empty array', () => {
    const result = enforceMinimumChannels([]);
    expect(result.length).toBeGreaterThanOrEqual(MIN_CHANNELS);
    expect(result).toContain('vector');
    expect(result).toContain('fts');
  });

  it('T16: enforceMinimumChannels does not modify arrays already meeting minimum', () => {
    const input: ChannelName[] = ['bm25', 'graph', 'degree'];
    const result = enforceMinimumChannels(input);
    expect(result).toEqual(['bm25', 'graph', 'degree']);
  });

  it('T17: enforceMinimumChannels does not duplicate channels already present', () => {
    const input: ChannelName[] = ['vector'];
    const result = enforceMinimumChannels(input);
    expect(result).toHaveLength(2);
    expect(result).toContain('vector');
    expect(result).toContain('fts');
    // Vector should appear only once
    expect(result.filter(c => c === 'vector')).toHaveLength(1);
  });

  it('T17b: duplicate channels are collapsed before minimum enforcement', () => {
    const input: ChannelName[] = ['vector', 'vector'];
    const result = enforceMinimumChannels(input);
    expect(result).toEqual(['vector', 'fts']);
  });

  it('T17c: custom configs with duplicates still resolve to distinct channels', () => {
    const brokenConfig: ChannelRoutingConfig = {
      simple: ['vector', 'vector'],
      moderate: ['vector', 'fts', 'bm25'],
      complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    };

    const channels = getChannelSubset('simple', brokenConfig);
    expect(channels).toEqual(['vector', 'fts']);
  });
});

/* ───────────────────────────────────────────────────────────────
   T026-04: routeQuery CONVENIENCE FUNCTION
   ──────────────────────────────────────────────────────────────── */

describe('T026-04: routeQuery Convenience Function', () => {
  beforeEach(() => {
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  it('T18: routes simple query to 2 channels', () => {
    const result = routeQuery('fix bug');
    expect(result.tier).toBe('simple');
    expect(result.channels).toHaveLength(2);
    expect(result.channels).toContain('vector');
    expect(result.channels).toContain('fts');
  });

  it('T19: routes complex query to all 5 channels', () => {
    const result = routeQuery(
      'explain how the authentication module integrates with the external OAuth provider and handles token refresh gracefully'
    );
    expect(result.tier).toBe('complex');
    expect(result.channels).toHaveLength(5);
  });

  it('T20: includes full classification details in result', () => {
    const result = routeQuery('fix bug');
    expect(result.classification).toBeDefined();
    expect(result.classification.tier).toBe('simple');
    expect(typeof result.classification.features.termCount).toBe('number');
    expect(typeof result.classification.features.charCount).toBe('number');
    expect(typeof result.classification.features.hasTriggerMatch).toBe('boolean');
    expect(typeof result.classification.features.stopWordRatio).toBe('number');
    expect(typeof result.classification.confidence).toBe('string');
  });

  it('T21: routes trigger phrase match to simple tier', () => {
    const result = routeQuery('save context', TRIGGER_PHRASES);
    expect(result.tier).toBe('simple');
    expect(result.channels).toHaveLength(2);
    expect(result.classification.features.hasTriggerMatch).toBe(true);
  });

  it('T22: routes moderate query to 3 channels', () => {
    const result = routeQuery('refactor the database connection module');
    expect(result.tier).toBe('moderate');
    expect(result.channels).toHaveLength(3);
    expect(result.channels).toContain('vector');
    expect(result.channels).toContain('fts');
    expect(result.channels).toContain('bm25');
  });
});

/* ───────────────────────────────────────────────────────────────
   T026-05: FEATURE FLAG DISABLED
   ──────────────────────────────────────────────────────────────── */

describe('T026-05: Feature Flag Disabled', () => {
  beforeEach(() => {
    setEnv(FEATURE_FLAG, 'false');
  });

  afterEach(() => {
    restoreEnv();
  });

  it('T23: routeQuery returns all 5 channels when flag is disabled', () => {
    const result = routeQuery('fix bug');
    expect(result.channels).toHaveLength(5);
    expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
  });

  it('T24: routeQuery returns complex tier when flag is disabled (classifier fallback)', () => {
    const result = routeQuery('fix bug');
    expect(result.tier).toBe('complex');
    expect(result.classification.confidence).toBe('fallback');
  });

  it('T25: routeQuery returns all 5 channels for any query when flag is disabled', () => {
    // Even a trigger-phrase query gets all channels when disabled
    const result = routeQuery('save context', TRIGGER_PHRASES);
    expect(result.channels).toHaveLength(5);
    expect(result.tier).toBe('complex');
  });

  it('T26: routeQuery with flag set to "false" returns all 5 channels', () => {
    setEnv(FEATURE_FLAG, 'false');
    const result = routeQuery('refactor the database connection module');
    expect(result.channels).toHaveLength(5);
    expect(result.channels).toEqual(['vector', 'fts', 'bm25', 'graph', 'degree']);
  });
});

/* ───────────────────────────────────────────────────────────────
   T026-06: EDGE CASES
   ──────────────────────────────────────────────────────────────── */

describe('T026-06: Edge Cases', () => {
  beforeEach(() => {
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  it('T27: empty query routes to all channels (complex fallback)', () => {
    const result = routeQuery('');
    // Empty query triggers complex fallback in classifier
    expect(result.tier).toBe('complex');
    expect(result.channels).toHaveLength(5);
  });

  it('T28: default config has increasing channel count per tier', () => {
    const simpleCount = DEFAULT_ROUTING_CONFIG.simple.length;
    const moderateCount = DEFAULT_ROUTING_CONFIG.moderate.length;
    const complexCount = DEFAULT_ROUTING_CONFIG.complex.length;

    expect(simpleCount).toBeLessThan(moderateCount);
    expect(moderateCount).toBeLessThan(complexCount);
  });

  it('T29: all tiers in default config satisfy minimum channel invariant', () => {
    for (const tier of ['simple', 'moderate', 'complex'] as const) {
      const channels = getChannelSubset(tier);
      expect(channels.length).toBeGreaterThanOrEqual(MIN_CHANNELS);
    }
  });

  it('T30: routeQuery result tier matches classification tier', () => {
    const result = routeQuery('fix bug');
    expect(result.tier).toBe(result.classification.tier);
  });

  it('T31: complex tier in default config matches ALL_CHANNELS exactly', () => {
    expect(DEFAULT_ROUTING_CONFIG.complex).toEqual([...ALL_CHANNELS]);
  });

  it('T32: simple tier channels are a subset of complex tier channels', () => {
    for (const channel of DEFAULT_ROUTING_CONFIG.simple) {
      expect(DEFAULT_ROUTING_CONFIG.complex).toContain(channel);
    }
  });

  it('T33: moderate tier channels are a subset of complex tier channels', () => {
    for (const channel of DEFAULT_ROUTING_CONFIG.moderate) {
      expect(DEFAULT_ROUTING_CONFIG.complex).toContain(channel);
    }
  });
});
