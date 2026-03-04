// ---------------------------------------------------------------
// MODULE: Search Feature Flags Tests
// ---------------------------------------------------------------
// TEST: Search Feature Flags

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import {
  isCrossEncoderEnabled,
  isContextHeadersEnabled,
  isMMREnabled,
  isMultiQueryEnabled,
  isTRMEnabled,
} from '../lib/search/search-flags';

const FLAG_NAMES = [
  'SPECKIT_MMR',
  'SPECKIT_TRM',
  'SPECKIT_MULTI_QUERY',
  'SPECKIT_CROSS_ENCODER',
  'SPECKIT_CONTEXT_HEADERS',
  'VOYAGE_API_KEY',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof FLAG_NAMES[number], string | undefined>> = {};

function clearFlags(): void {
  for (const flag of FLAG_NAMES) {
    delete process.env[flag];
  }
  crossEncoder.resetProvider();
}

describe('Search Feature Flags (default-on)', () => {
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

  it('defaults all gates to enabled when env vars are unset', () => {
    expect(isMMREnabled()).toBe(true);
    expect(isTRMEnabled()).toBe(true);
    expect(isMultiQueryEnabled()).toBe(true);
    expect(isCrossEncoderEnabled()).toBe(true);
    expect(isContextHeadersEnabled()).toBe(true);
  });

  it('disables each gate only when explicitly set to false', () => {
    process.env.SPECKIT_MMR = 'false';
    process.env.SPECKIT_TRM = 'false';
    process.env.SPECKIT_MULTI_QUERY = 'false';
    process.env.SPECKIT_CROSS_ENCODER = 'false';
    process.env.SPECKIT_CONTEXT_HEADERS = 'false';

    expect(isMMREnabled()).toBe(false);
    expect(isTRMEnabled()).toBe(false);
    expect(isMultiQueryEnabled()).toBe(false);
    expect(isCrossEncoderEnabled()).toBe(false);
    expect(isContextHeadersEnabled()).toBe(false);
  });

  it('keeps gates enabled when explicitly set to true', () => {
    process.env.SPECKIT_MMR = 'true';
    process.env.SPECKIT_TRM = 'true';
    process.env.SPECKIT_MULTI_QUERY = 'true';
    process.env.SPECKIT_CROSS_ENCODER = 'true';
    process.env.SPECKIT_CONTEXT_HEADERS = 'true';

    expect(isMMREnabled()).toBe(true);
    expect(isTRMEnabled()).toBe(true);
    expect(isMultiQueryEnabled()).toBe(true);
    expect(isCrossEncoderEnabled()).toBe(true);
    expect(isContextHeadersEnabled()).toBe(true);
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
});
