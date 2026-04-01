// TEST: SEARCH EXTENDED
// Converted from: search-extended.test.ts (custom runner)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  simpleStem,
  isBm25Enabled,
  DEFAULT_K1,
  DEFAULT_B,
} from '../lib/search/bm25-index';
import {
  PROVIDER_CONFIG,
  LENGTH_PENALTY,
  resolveProvider,
  calculateLengthPenalty,
  generateCacheKey,
  isRerankerAvailable,
  resetProvider,
  resetSession,
} from '../lib/search/cross-encoder';

/* ───────────────────────────────────────────────────────────────
   ENV HELPERS
──────────────────────────────────────────────────────────────── */

const originalEnv = { ...process.env };

function resetEnv() {
  delete process.env.VOYAGE_API_KEY;
  delete process.env.COHERE_API_KEY;
  delete process.env.RERANKER_LOCAL;
  delete process.env.ENABLE_BM25;
  resetProvider();
  resetSession();
}

function restoreEnv() {
  for (const key of ['VOYAGE_API_KEY', 'COHERE_API_KEY', 'RERANKER_LOCAL', 'ENABLE_BM25']) {
    if (originalEnv[key] !== undefined) {
      process.env[key] = originalEnv[key];
    } else {
      delete process.env[key];
    }
  }
  resetProvider();
  resetSession();
}

/* ===================================================================
   A. BM25-INDEX: simpleStem
=================================================================== */

describe('simpleStem', () => {
  it('SS01: running → run (-ing removed + double-consonant dedup)', () => {
    // Fix #18 — doubled consonant "nn" after -ing removal now collapses to "n"
    expect(simpleStem('running')).toBe('run');
  });

  it('SS02: played → play (-ed removed)', () => {
    expect(simpleStem('played')).toBe('play');
  });

  it('SS03: dogs → dog (-s removed)', () => {
    expect(simpleStem('dogs')).toBe('dog');
  });

  it('SS04: boxes → box (-es removed)', () => {
    expect(simpleStem('boxes')).toBe('box');
  });

  it('SS05: quickly → quick (-ly removed)', () => {
    expect(simpleStem('quickly')).toBe('quick');
  });

  it('SS06: creation → crea (-tion removed)', () => {
    expect(simpleStem('creation')).toBe('crea');
  });

  it('SS07: bed unchanged (too short for -ed)', () => {
    expect(simpleStem('bed')).toBe('bed');
  });

  it('SS08: is unchanged (too short for -s)', () => {
    expect(simpleStem('is')).toBe('is');
  });

  it('SS09: RUNNING → run (lowercased + stemmed + double-consonant dedup)', () => {
    expect(simpleStem('RUNNING')).toBe('run');
  });

  it('SS10: fox unchanged (no suffix match)', () => {
    expect(simpleStem('fox')).toBe('fox');
  });

  it('SS11: empty string → empty string', () => {
    expect(simpleStem('')).toBe('');
  });

  it('SS12: single char unchanged', () => {
    expect(simpleStem('a')).toBe('a');
  });
});

/* ===================================================================
   B. BM25-INDEX: isBm25Enabled
=================================================================== */

describe('isBm25Enabled', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('BM01: returns true when ENABLE_BM25 not set (BM25 is enabled by default)', () => {
    delete process.env.ENABLE_BM25;
    expect(isBm25Enabled()).toBe(true);
    expect(typeof isBm25Enabled()).toBe('boolean');
  });

  it('BM02: returns false when ENABLE_BM25=false', () => {
    process.env.ENABLE_BM25 = 'false';
    expect(isBm25Enabled()).toBe(false);
  });

  it('BM03: returns true when ENABLE_BM25=true', () => {
    process.env.ENABLE_BM25 = 'true';
    expect(isBm25Enabled()).toBe(true);
  });

  it('BM04: returns false for ENABLE_BM25=0 (non-truthy values stay disabled)', () => {
    process.env.ENABLE_BM25 = '0';
    expect(isBm25Enabled()).toBe(false);
  });
});

/* ===================================================================
   C. BM25-INDEX: DEFAULT_K1 and DEFAULT_B constants
=================================================================== */

describe('DEFAULT_K1 & DEFAULT_B', () => {
  it('K1-01: DEFAULT_K1 is a positive number', () => {
    expect(typeof DEFAULT_K1).toBe('number');
    expect(DEFAULT_K1).toBeGreaterThan(0);
  });

  it('K1-02: DEFAULT_K1 in typical BM25 range [0.5, 3.0]', () => {
    expect(DEFAULT_K1).toBeGreaterThanOrEqual(0.5);
    expect(DEFAULT_K1).toBeLessThanOrEqual(3.0);
  });

  it('K1-03: DEFAULT_K1 === 1.2 (standard value)', () => {
    expect(DEFAULT_K1).toBe(1.2);
  });

  it('B-01: DEFAULT_B is a positive number', () => {
    expect(typeof DEFAULT_B).toBe('number');
    expect(DEFAULT_B).toBeGreaterThan(0);
  });

  it('B-02: DEFAULT_B in typical BM25 range [0, 1.0]', () => {
    expect(DEFAULT_B).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_B).toBeLessThanOrEqual(1.0);
  });

  it('B-03: DEFAULT_B === 0.75 (standard value)', () => {
    expect(DEFAULT_B).toBe(0.75);
  });
});

/* ===================================================================
   D. CROSS-ENCODER: PROVIDER_CONFIG
=================================================================== */

describe('PROVIDER_CONFIG', () => {
  it('PC-01: has voyage, cohere, local', () => {
    const keys = Object.keys(PROVIDER_CONFIG);
    expect(keys).toContain('voyage');
    expect(keys).toContain('cohere');
    expect(keys).toContain('local');
  });

  it('PC-02: each provider has all required fields with correct types', () => {
    for (const key of ['voyage', 'cohere', 'local']) {
      const cfg = PROVIDER_CONFIG[key];
      expect(typeof cfg.name).toBe('string');
      expect(typeof cfg.model).toBe('string');
      expect(typeof cfg.endpoint).toBe('string');
      expect(typeof cfg.apiKeyEnv).toBe('string');
      expect(typeof cfg.maxDocuments).toBe('number');
      expect(typeof cfg.timeout).toBe('number');
      expect(cfg.maxDocuments).toBeGreaterThan(0);
      expect(cfg.timeout).toBeGreaterThan(0);
    }
  });
});

/* ===================================================================
   E. CROSS-ENCODER: LENGTH_PENALTY
=================================================================== */

describe('LENGTH_PENALTY', () => {
  it('LP-01: has all expected numeric properties', () => {
    expect(typeof LENGTH_PENALTY.shortThreshold).toBe('number');
    expect(typeof LENGTH_PENALTY.longThreshold).toBe('number');
    expect(typeof LENGTH_PENALTY.shortPenalty).toBe('number');
    expect(typeof LENGTH_PENALTY.longPenalty).toBe('number');
  });

  it('LP-02: shortThreshold < longThreshold', () => {
    expect(LENGTH_PENALTY.shortThreshold).toBeLessThan(LENGTH_PENALTY.longThreshold);
  });

  it('LP-03: penalty values in (0, 1.0]', () => {
    expect(LENGTH_PENALTY.shortPenalty).toBeGreaterThan(0);
    expect(LENGTH_PENALTY.shortPenalty).toBeLessThanOrEqual(1.0);
    expect(LENGTH_PENALTY.longPenalty).toBeGreaterThan(0);
    expect(LENGTH_PENALTY.longPenalty).toBeLessThanOrEqual(1.0);
  });
});

/* ===================================================================
   F. CROSS-ENCODER: resolveProvider
=================================================================== */

describe('resolveProvider', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('RP-01: returns null when no provider env set', () => {
    resetEnv();
    expect(resolveProvider()).toBe(null);
  });

  it('RP-02: returns voyage when VOYAGE_API_KEY set', () => {
    resetEnv();
    process.env.VOYAGE_API_KEY = 'test-key';
    expect(resolveProvider()).toBe('voyage');
  });

  it('RP-03: returns cohere when COHERE_API_KEY set', () => {
    resetEnv();
    process.env.COHERE_API_KEY = 'test-key';
    expect(resolveProvider()).toBe('cohere');
  });

  it('RP-04: returns local when RERANKER_LOCAL=true', () => {
    resetEnv();
    process.env.RERANKER_LOCAL = 'true';
    expect(resolveProvider()).toBe('local');
  });

  it('RP-05: voyage takes priority over cohere', () => {
    resetEnv();
    process.env.VOYAGE_API_KEY = 'v-key';
    process.env.COHERE_API_KEY = 'c-key';
    expect(resolveProvider()).toBe('voyage');
  });
});

/* ===================================================================
   G. CROSS-ENCODER: calculateLengthPenalty
=================================================================== */

describe('calculateLengthPenalty', () => {
  it('CLP-01: short content → shortPenalty', () => {
    expect(calculateLengthPenalty(10)).toBe(LENGTH_PENALTY.shortPenalty);
  });

  it('CLP-02: medium content → 1.0 (no penalty)', () => {
    expect(calculateLengthPenalty(500)).toBe(1.0);
  });

  it('CLP-03: long content → longPenalty', () => {
    expect(calculateLengthPenalty(5000)).toBe(LENGTH_PENALTY.longPenalty);
  });

  it('CLP-04: exactly shortThreshold → 1.0', () => {
    expect(calculateLengthPenalty(LENGTH_PENALTY.shortThreshold)).toBe(1.0);
  });

  it('CLP-05: exactly longThreshold → 1.0', () => {
    expect(calculateLengthPenalty(LENGTH_PENALTY.longThreshold)).toBe(1.0);
  });

  it('CLP-06: length 0 → shortPenalty', () => {
    expect(calculateLengthPenalty(0)).toBe(LENGTH_PENALTY.shortPenalty);
  });
});

/* ===================================================================
   H. CROSS-ENCODER: generateCacheKey
=================================================================== */

describe('generateCacheKey', () => {
  it('GCK-01: returns string with rerank- prefix', () => {
    const key = generateCacheKey('test query', [1, 2, 3]);
    expect(typeof key).toBe('string');
    expect(key.startsWith('rerank-')).toBe(true);
  });

  it('GCK-02: same inputs → same key (deterministic)', () => {
    const key1 = generateCacheKey('query alpha', [10, 20]);
    const key2 = generateCacheKey('query alpha', [10, 20]);
    expect(key1).toBe(key2);
  });

  it('GCK-03: different queries → different keys', () => {
    const key1 = generateCacheKey('query alpha', [1, 2]);
    const key2 = generateCacheKey('query beta', [1, 2]);
    expect(key1).not.toBe(key2);
  });

  it('GCK-04: different doc IDs → different keys', () => {
    const key1 = generateCacheKey('same query', [1, 2]);
    const key2 = generateCacheKey('same query', [3, 4]);
    expect(key1).not.toBe(key2);
  });

  it('GCK-05: doc ID order irrelevant (sorted internally)', () => {
    const key1 = generateCacheKey('query', [3, 1, 2]);
    const key2 = generateCacheKey('query', [1, 2, 3]);
    expect(key1).toBe(key2);
  });

  it('GCK-06: works with string doc IDs', () => {
    const key = generateCacheKey('query', ['abc', 'def']);
    expect(typeof key).toBe('string');
    expect(key.startsWith('rerank-')).toBe(true);
  });
});

/* ===================================================================
   I. CROSS-ENCODER: isRerankerAvailable
=================================================================== */

describe('isRerankerAvailable', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('IRA-01: returns false when no provider configured', () => {
    resetEnv();
    expect(isRerankerAvailable()).toBe(false);
    expect(typeof isRerankerAvailable()).toBe('boolean');
  });

  it('IRA-02: returns true when VOYAGE_API_KEY set', () => {
    resetEnv();
    process.env.VOYAGE_API_KEY = 'test-key';
    expect(isRerankerAvailable()).toBe(true);
  });

  it('IRA-03: returns true when COHERE_API_KEY set', () => {
    resetEnv();
    process.env.COHERE_API_KEY = 'test-key';
    expect(isRerankerAvailable()).toBe(true);
  });

  it('IRA-04: returns true when RERANKER_LOCAL=true', () => {
    resetEnv();
    process.env.RERANKER_LOCAL = 'true';
    expect(isRerankerAvailable()).toBe(true);
  });
});
