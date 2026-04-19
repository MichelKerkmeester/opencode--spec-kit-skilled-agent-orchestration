import { describe, expect, it } from 'vitest';
import {
  AdvisorPromptCache,
  MAX_CACHE_ENTRIES,
  createAdvisorPromptCacheKey,
} from '../lib/skill-advisor/prompt-cache.js';

describe('skill advisor prompt cache', () => {
  it('returns exact HMAC cache hits within the TTL', () => {
    const cache = new AdvisorPromptCache<string>(300_000, Buffer.from('test-secret'));
    const key = cache.makeKey({
      canonicalPrompt: 'implement feature x',
      sourceSignature: 'sig-a',
      runtime: 'codex',
      thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
    });

    cache.set({
      key,
      sourceSignature: 'sig-a',
      value: 'brief',
      skillLabels: ['sk-code-opencode'],
      nowMs: 10,
    });

    expect(cache.get(key, 20)?.value).toBe('brief');
    expect(cache.get(key, 300_011)).toBeNull();
  });

  it('invalidates all prior entries when sourceSignature changes', () => {
    const cache = new AdvisorPromptCache<string>(300_000, Buffer.from('test-secret'));
    const staleKey = cache.makeKey({
      canonicalPrompt: 'same prompt',
      sourceSignature: 'old',
      runtime: 'codex',
    });
    const liveKey = cache.makeKey({
      canonicalPrompt: 'same prompt',
      sourceSignature: 'new',
      runtime: 'codex',
    });
    cache.set({ key: staleKey, sourceSignature: 'old', value: 'old', skillLabels: [], nowMs: 0 });
    cache.set({ key: liveKey, sourceSignature: 'new', value: 'new', skillLabels: [], nowMs: 0 });

    expect(cache.invalidateSourceSignatureChange('new')).toBe(1);
    expect(cache.get(staleKey, 1)).toBeNull();
    expect(cache.get(liveKey, 1)?.value).toBe('new');
  });

  it('uses opaque HMAC keys and never embeds raw prompt text', () => {
    const rawPrompt = ['secret', 'customer', 'token', 'prompt'].join(' ');
    const key = createAdvisorPromptCacheKey({
      canonicalPrompt: rawPrompt,
      sourceSignature: 'sig',
      runtime: 'claude',
      thresholdConfig: { confidenceThreshold: 0.9 },
    }, Buffer.from('test-secret'));

    expect(key).toMatch(/^[a-f0-9]{64}$/);
    expect(key).not.toContain(rawPrompt);
    expect(key).not.toContain('secret');
  });

  it('includes normalized maxTokens in prompt cache keys', () => {
    const base = {
      canonicalPrompt: 'implement feature x',
      sourceSignature: 'sig-a',
      runtime: 'codex',
    };
    const compact = createAdvisorPromptCacheKey({
      ...base,
      maxTokens: 80,
    }, Buffer.from('test-secret'));
    const expanded = createAdvisorPromptCacheKey({
      ...base,
      maxTokens: 120,
    }, Buffer.from('test-secret'));
    const defaulted = createAdvisorPromptCacheKey(base, Buffer.from('test-secret'));

    expect(compact).not.toBe(expanded);
    expect(defaulted).toBe(compact);
  });

  it('evicts the oldest entries when the size cap is reached', () => {
    const cache = new AdvisorPromptCache<string>(300_000, Buffer.from('test-secret'));
    for (let index = 0; index < MAX_CACHE_ENTRIES + 1; index += 1) {
      const key = `key-${index}`;
      cache.set({
        key,
        sourceSignature: 'sig-a',
        value: `brief-${index}`,
        skillLabels: [],
        nowMs: index,
      });
    }

    expect(cache.size()).toBe(MAX_CACHE_ENTRIES);
    expect(cache.get('key-0', MAX_CACHE_ENTRIES + 2)).toBeNull();
    expect(cache.get(`key-${MAX_CACHE_ENTRIES}`, MAX_CACHE_ENTRIES + 2)?.value).toBe(`brief-${MAX_CACHE_ENTRIES}`);
  });
});
