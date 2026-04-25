// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Prompt-Cache Invalidation Listener Uniqueness Tests
// ───────────────────────────────────────────────────────────────
// Pins the F81 contract: module-init scope in skill-advisor-brief.ts
// registers exactly ONE cacheInvalidation listener per host process,
// and a generation-bump invalidation triggers advisorPromptCache.clear()
// exactly once per fan-out (no double-registration on re-import).

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('advisor prompt-cache invalidation listener uniqueness', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers a single listener at module-init that fires exactly once per invalidation', async () => {
    const cacheInvalidation = await import('../../lib/freshness/cache-invalidation.js');
    const promptCacheModule = await import('../../lib/prompt-cache.js');
    cacheInvalidation.clearCacheInvalidationListeners();
    const clearSpy = vi.spyOn(promptCacheModule.advisorPromptCache, 'clear');

    await import('../../lib/skill-advisor-brief.js');

    cacheInvalidation.invalidateSkillGraphCaches({
      generation: 7,
      changedPaths: ['SKILL.md'],
      reason: 'unit-test',
    });

    // Side-effect proof of listener uniqueness: N listeners ⇒ N clear() calls.
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('does not double-register when skill-advisor-brief is imported again', async () => {
    const cacheInvalidation = await import('../../lib/freshness/cache-invalidation.js');
    const promptCacheModule = await import('../../lib/prompt-cache.js');
    cacheInvalidation.clearCacheInvalidationListeners();
    const clearSpy = vi.spyOn(promptCacheModule.advisorPromptCache, 'clear');

    // First import registers; ESM cache means a second import is a no-op.
    await import('../../lib/skill-advisor-brief.js');
    await import('../../lib/skill-advisor-brief.js');

    cacheInvalidation.invalidateSkillGraphCaches({
      generation: 11,
      changedPaths: ['SKILL.md'],
      reason: 'unit-test',
    });

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
