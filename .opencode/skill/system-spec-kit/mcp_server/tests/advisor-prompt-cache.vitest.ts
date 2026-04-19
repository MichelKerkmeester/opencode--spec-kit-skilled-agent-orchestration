import { describe, expect, it } from 'vitest';
import {
  AdvisorPromptCache,
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
});
