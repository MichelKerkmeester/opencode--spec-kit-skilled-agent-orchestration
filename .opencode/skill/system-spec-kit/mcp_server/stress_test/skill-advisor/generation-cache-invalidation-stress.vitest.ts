import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  clearCacheInvalidationListeners,
  onCacheInvalidation,
} from '../../skill_advisor/lib/freshness/cache-invalidation.js';
import {
  publishSkillGraphGeneration,
} from '../../skill_advisor/lib/freshness/generation.js';
import {
  AdvisorPromptCache,
  ADVISOR_PROMPT_CACHE_TTL_MS,
} from '../../skill_advisor/lib/prompt-cache.js';

describe('sa-007 — Generation cache invalidation', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-007-'));
    clearCacheInvalidationListeners();
  });

  afterEach(() => {
    clearCacheInvalidationListeners();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function cacheKey(cache: AdvisorPromptCache<string>, sourceSignature: string): string {
    return cache.makeKey({
      canonicalPrompt: 'stress prompt',
      sourceSignature,
      workspaceRoot: tmpDir,
      runtime: 'vitest',
      maxTokens: 80,
    });
  }

  it('makes pre-bump prompt-cache entries inaccessible through the current generation signature', async () => {
    const cache = new AdvisorPromptCache<string>();
    const beforeKey = cacheKey(cache, 'generation-0');
    cache.set({
      key: beforeKey,
      sourceSignature: 'generation-0',
      value: 'before',
      skillLabels: ['alpha'],
      nowMs: 0,
    });

    let currentSignature = 'generation-0';
    onCacheInvalidation((event) => {
      currentSignature = `generation-${event.generation}`;
      cache.invalidateSourceSignatureChange(currentSignature);
    });
    for (let index = 0; index < 10; index += 1) {
      publishSkillGraphGeneration({ workspaceRoot: tmpDir, reason: `bump-${index}` });
    }

    expect(cache.get(beforeKey, 1)).toBeNull();
    expect(cache.get(cacheKey(cache, currentSignature), 1)).toBeNull();
    expect(cache.size()).toBe(0);
  });

  it('does not let the 5 minute TTL outlive a generation bump', async () => {
    const cache = new AdvisorPromptCache<string>(ADVISOR_PROMPT_CACHE_TTL_MS);
    let currentSignature = 'generation-0';
    const key = cacheKey(cache, currentSignature);
    cache.set({
      key,
      sourceSignature: currentSignature,
      value: 'ttl-protected-entry',
      skillLabels: ['alpha'],
      nowMs: 1,
    });
    onCacheInvalidation((event) => {
      currentSignature = `generation-${event.generation}`;
      cache.invalidateSourceSignatureChange(currentSignature);
    });

    publishSkillGraphGeneration({ workspaceRoot: tmpDir, reason: 'ttl-bypass' });

    expect(ADVISOR_PROMPT_CACHE_TTL_MS).toBe(300_000);
    expect(cache.get(key, 2)).toBeNull();
    expect(cache.get(cacheKey(cache, currentSignature), 2)).toBeNull();
  });
});
