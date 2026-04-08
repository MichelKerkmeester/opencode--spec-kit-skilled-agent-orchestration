import { describe, expect, it } from 'vitest';

import {
  sanitizeTriggerPhrase,
  sanitizeTriggerPhrases,
} from '../lib/trigger-phrase-sanitizer';

describe('trigger-phrase sanitizer', () => {
  it('rejects path fragments from folder leaks', () => {
    expect(sanitizeTriggerPhrase('kit/026')).toEqual({ keep: false, reason: 'path_fragment' });
    expect(sanitizeTriggerPhrase('optimization/003')).toEqual({ keep: false, reason: 'path_fragment' });
    expect(sanitizeTriggerPhrase('specs/026-graph-and-context-optimization')).toEqual({ keep: false, reason: 'path_fragment' });
  });

  it('rejects standalone stopwords and observed singleton leaks', () => {
    expect(sanitizeTriggerPhrase('and')).toEqual({ keep: false, reason: 'standalone_stopword' });
    expect(sanitizeTriggerPhrase('the')).toEqual({ keep: false, reason: 'standalone_stopword' });
    expect(sanitizeTriggerPhrase('with')).toEqual({ keep: false, reason: 'standalone_stopword' });
    expect(sanitizeTriggerPhrase('graph')).toEqual({ keep: false, reason: 'standalone_stopword' });
    expect(sanitizeTriggerPhrase('issues')).toEqual({ keep: false, reason: 'standalone_stopword' });
  });

  it('rejects suspicious prefixes without blocking standalone domain nouns', () => {
    expect(sanitizeTriggerPhrase('phase 7 cocoindex')).toEqual({ keep: false, reason: 'suspicious_prefix' });
    expect(sanitizeTriggerPhrase('f21 arithmetic inconsistency')).toEqual({ keep: false, reason: 'suspicious_prefix' });
    expect(sanitizeTriggerPhrase('iteration 15 filter list')).toEqual({ keep: false, reason: 'suspicious_prefix' });
    expect(sanitizeTriggerPhrase('phase')).toEqual({ keep: true });
  });

  it('rejects known synthetic bigrams from the frozen D3 corpus', () => {
    expect(sanitizeTriggerPhrase('with phases')).toEqual({ keep: false, reason: 'synthetic_bigram' });
    expect(sanitizeTriggerPhrase('session for')).toEqual({ keep: false, reason: 'synthetic_bigram' });
    expect(sanitizeTriggerPhrase('tiers full')).toEqual({ keep: false, reason: 'synthetic_bigram' });
    expect(sanitizeTriggerPhrase('level spec')).toEqual({ keep: false, reason: 'synthetic_bigram' });
  });

  it('preserves allowlisted short product names and legitimate phrases', () => {
    expect(sanitizeTriggerPhrase('mcp')).toEqual({ keep: true });
    expect(sanitizeTriggerPhrase('api')).toEqual({ keep: true });
    expect(sanitizeTriggerPhrase('spec kit')).toEqual({ keep: true });
    expect(sanitizeTriggerPhrase('semantic search')).toEqual({ keep: true });
  });

  it('deduplicates and preserves only kept phrases in wrapper output', () => {
    expect(sanitizeTriggerPhrases([
      'MCP',
      'mcp',
      'kit/026',
      'semantic search',
      'semantic search',
      'graph',
    ])).toEqual([
      'mcp',
      'semantic search',
    ]);
  });

  it('observes zero false positives across the tuned category corpus', () => {
    const legitimateCorpus = [
      'mcp',
      'api',
      'spec kit',
      'semantic search',
      'memory pipeline',
      'adjacent phrase',
      'graph traversal',
      'issues triage',
      'decision precedence',
    ];

    const falsePositives = legitimateCorpus.filter((phrase) => !sanitizeTriggerPhrase(phrase).keep);

    expect(falsePositives).toEqual([]);
  });
});
