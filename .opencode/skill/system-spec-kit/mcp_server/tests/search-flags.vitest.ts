// ───────────────────────────────────────────────────────────────
// 1. SEARCH FEATURE FLAGS TESTS
// ───────────────────────────────────────────────────────────────
// TEST: Search Feature Flags

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import {
  isCrossEncoderEnabled,
  isContextHeadersEnabled,
  isFileWatcherEnabled,
  isLocalRerankerEnabled,
  isMMREnabled,
  isMultiQueryEnabled,
  isReconsolidationEnabled,
  isTRMEnabled,
} from '../lib/search/search-flags';

const FLAG_NAMES = [
  'SPECKIT_MMR',
  'SPECKIT_TRM',
  'SPECKIT_MULTI_QUERY',
  'SPECKIT_CROSS_ENCODER',
  'SPECKIT_CONTEXT_HEADERS',
  'SPECKIT_RECONSOLIDATION',
  'SPECKIT_FILE_WATCHER',
  'SPECKIT_ROLLOUT_PERCENT',
  'RERANKER_LOCAL',
  'VOYAGE_API_KEY',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof FLAG_NAMES[number], string | undefined>> = {};

function clearFlags(): void {
  for (const flag of FLAG_NAMES) {
    delete process.env[flag];
  }
  crossEncoder.resetProvider();
}

describe('Search Feature Flags', () => {
  beforeEach(() => {
    for (const flag of FLAG_NAMES) {
      ORIGINAL_ENV[flag] = process.env[flag];
    }
    clearFlags();
  });

  afterEach(() => {
    for (const flag of FLAG_NAMES) {
      if (ORIGINAL_ENV[flag] === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = ORIGINAL_ENV[flag];
      }
    }
    crossEncoder.resetProvider();
  });

  it('defaults graduated gates on while keeping reconsolidation opt-in', () => {
    expect(isMMREnabled()).toBe(true);
    expect(isTRMEnabled()).toBe(true);
    expect(isMultiQueryEnabled()).toBe(true);
    expect(isCrossEncoderEnabled()).toBe(true);
    expect(isContextHeadersEnabled()).toBe(true);
    expect(isReconsolidationEnabled()).toBe(false);
  });

  it('disables each gate only when explicitly set to false', () => {
    process.env.SPECKIT_MMR = 'false';
    process.env.SPECKIT_TRM = 'false';
    process.env.SPECKIT_MULTI_QUERY = 'false';
    process.env.SPECKIT_CROSS_ENCODER = 'false';
    process.env.SPECKIT_CONTEXT_HEADERS = 'false';
    process.env.SPECKIT_RECONSOLIDATION = 'false';

    expect(isMMREnabled()).toBe(false);
    expect(isTRMEnabled()).toBe(false);
    expect(isMultiQueryEnabled()).toBe(false);
    expect(isCrossEncoderEnabled()).toBe(false);
    expect(isContextHeadersEnabled()).toBe(false);
    expect(isReconsolidationEnabled()).toBe(false);
  });

  it('keeps gates enabled when explicitly set to true', () => {
    process.env.SPECKIT_MMR = 'true';
    process.env.SPECKIT_TRM = 'true';
    process.env.SPECKIT_MULTI_QUERY = 'true';
    process.env.SPECKIT_CROSS_ENCODER = 'true';
    process.env.SPECKIT_CONTEXT_HEADERS = 'true';
    process.env.SPECKIT_RECONSOLIDATION = 'true';

    expect(isMMREnabled()).toBe(true);
    expect(isTRMEnabled()).toBe(true);
    expect(isMultiQueryEnabled()).toBe(true);
    expect(isCrossEncoderEnabled()).toBe(true);
    expect(isContextHeadersEnabled()).toBe(true);
    expect(isReconsolidationEnabled()).toBe(true);
  });

  it('reconsolidation only enables for an explicit true value', () => {
    process.env.SPECKIT_RECONSOLIDATION = 'TRUE';
    expect(isReconsolidationEnabled()).toBe(true);

    process.env.SPECKIT_RECONSOLIDATION = '1';
    expect(isReconsolidationEnabled()).toBe(false);

    delete process.env.SPECKIT_RECONSOLIDATION;
    expect(isReconsolidationEnabled()).toBe(false);
  });

  it('cross-encoder provider resolution is blocked when SPECKIT_CROSS_ENCODER=false', () => {
    process.env.VOYAGE_API_KEY = 'test-key';
    process.env.SPECKIT_CROSS_ENCODER = 'false';
    crossEncoder.resetProvider();

    expect(crossEncoder.resolveProvider()).toBe(null);
    expect(crossEncoder.isRerankerAvailable()).toBe(false);
  });

  it('cross-encoder provider resolution works when gate is enabled and provider key exists', () => {
    process.env.VOYAGE_API_KEY = 'test-key';
    process.env.SPECKIT_CROSS_ENCODER = 'true';
    crossEncoder.resetProvider();

    expect(crossEncoder.resolveProvider()).toBe('voyage');
    expect(crossEncoder.isRerankerAvailable()).toBe(true);
  });

  it('file watcher and local reranker remain opt-in by default', () => {
    expect(isFileWatcherEnabled()).toBe(false);
    expect(isLocalRerankerEnabled()).toBe(false);
  });

  it('enables file watcher and local reranker only with explicit opt-in', () => {
    process.env.SPECKIT_FILE_WATCHER = 'true';
    process.env.RERANKER_LOCAL = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    expect(isFileWatcherEnabled()).toBe(true);
    expect(isLocalRerankerEnabled()).toBe(true);
  });

  it('applies rollout policy to opt-in wrappers and fails closed on partial rollout without identity', () => {
    process.env.SPECKIT_FILE_WATCHER = 'true';
    process.env.RERANKER_LOCAL = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '50';

    expect(isFileWatcherEnabled()).toBe(false);
    expect(isLocalRerankerEnabled()).toBe(false);
  });
});
