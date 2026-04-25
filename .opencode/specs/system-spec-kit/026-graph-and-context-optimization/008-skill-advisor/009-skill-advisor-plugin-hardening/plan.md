---
title: "Impl [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/009-skill-advisor-plugin-hardening/plan]"
description: "Single focused pass: state refactor → in-flight dedup → size caps + LRU. One plugin file edit + one test file extension. Phase 5 baseline (23 tests) is the regression guard."
trigger_phrases:
  - "026/009/008 plan"
  - "skill advisor hardening plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/009-skill-advisor-plugin-hardening"
    last_updated_at: "2026-04-23T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented plugin hardening and verified focused tests/build"
    next_safe_action: "Dispatch codex"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Skill-Advisor Plugin Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Single-file plugin hardening across three concerns: per-instance state isolation, in-flight bridge dedup, prompt/brief size caps with LRU cache eviction. Phase 5's 23 vitest assertions are the canary — anything that breaks them is a refactor regression. Add 5+ new test cases (one per requirement REQ-001 to REQ-005).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Pass Criteria |
|------|---------------|
| State isolation | Two-instance vitest passes; instances do not share counters or cache |
| Dedup | `Promise.all` of N identical-key calls spawns 1 bridge subprocess (asserted via spy) |
| Prompt clamp | Bridge stdin payload size ≤ MAX_PROMPT_BYTES |
| Brief clamp | `output.system[0].length` ≤ MAX_BRIEF_CHARS |
| LRU eviction | Cache size never exceeds MAX_CACHE_ENTRIES; oldest evicted on overflow |
| Phase 5 regression | All existing 23 tests still pass |
| Build | `npm run build` in `mcp_server` clean |
| Strict spec validation | 0/0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Technical Context

OpenCode 1.3.17 plugin runtime (server-side, Bun-bundled). The skill-advisor plugin is loaded once per workspace today; per-instance state isolation prepares for any future multi-workspace hosting and makes the plugin safe under test isolation. The bridge subprocess pattern (Node spawn for ABI isolation from native modules) is preserved unchanged.

### Current state structure (Phase 5)

```js
// module-global at .opencode/plugins/spec-kit-skill-advisor.js:28-36
const advisorCache = new Map();
let runtimeReady = false;
let lastBridgeStatus = 'uninitialized';
let lastErrorCode = null;
let lastDurationMs = 0;
let bridgeInvocations = 0;
let cacheHits = 0;
let cacheMisses = 0;
let advisorLookups = 0;
let disabledReason = null;
```

### Target structure

```js
export default async function SpecKitSkillAdvisorPlugin(ctx, rawOptions) {
  const options = normalizeOptions(rawOptions);
  const projectDir = normalizeWorkspaceRoot(ctx?.directory);

  // per-instance state
  const state = {
    advisorCache: new Map(),      // LRU via insertion-order iteration
    inFlight: new Map(),           // cacheKey -> Promise<result> for dedup
    runtimeReady: false,
    lastBridgeStatus: 'uninitialized',
    lastErrorCode: null,
    lastDurationMs: 0,
    bridgeInvocations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    advisorLookups: 0,
    disabledReason: !options.enabled ? (disabledEnvName() ?? 'config_enabled_false') : null,
  };

  // helpers (getAdvisorContext, runBridge, appendAdvisorBrief, event handler, status tool)
  // are now closures that reference `state` instead of module-global vars
}
```

### New constants

```js
const DEFAULT_MAX_PROMPT_BYTES = 64 * 1024;    // 64KB
const DEFAULT_MAX_BRIEF_CHARS = 2 * 1024;       // 2KB
const DEFAULT_MAX_CACHE_ENTRIES = 1000;
```

Configurable via `options.maxPromptBytes`, `options.maxBriefChars`, `options.maxCacheEntries`.

### In-flight dedup pattern

```js
async function getAdvisorContext({ prompt, sessionID, ... }) {
  const key = cacheKeyForPrompt(...);
  state.advisorLookups++;
  const cached = state.advisorCache.get(key);
  if (cached) { state.cacheHits++; return cached; }

  const existing = state.inFlight.get(key);
  if (existing) { state.cacheHits++; return existing; }  // dedup is a "hit"

  state.cacheMisses++;
  const promise = runBridge(...).finally(() => state.inFlight.delete(key));
  state.inFlight.set(key, promise);
  const result = await promise;
  insertWithEviction(state.advisorCache, key, result, options.maxCacheEntries);
  return result;
}

function insertWithEviction(cache, key, value, maxEntries) {
  cache.set(key, value);
  while (cache.size > maxEntries) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}
```

### Clamp pattern

```js
function clampPrompt(prompt, maxBytes) {
  if (typeof prompt !== 'string') return prompt;
  // Byte-aware truncation (UTF-8 may produce multi-byte chars; for safety use byte-length check)
  const bytes = Buffer.byteLength(prompt, 'utf8');
  if (bytes <= maxBytes) return prompt;
  // truncate by char until byte-length fits (simple loop is fine for cap-bound input)
  let end = prompt.length;
  while (end > 0 && Buffer.byteLength(prompt.slice(0, end), 'utf8') > maxBytes) end--;
  return prompt.slice(0, end);
}

function clampBrief(brief, maxChars) {
  if (typeof brief !== 'string') return brief;
  return brief.length <= maxChars ? brief : brief.slice(0, maxChars);
}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: State refactor (highest blast radius — do first)

1. Wrap all module-global `let`/`const` state in a `state` object initialized inside `SpecKitSkillAdvisorPlugin(ctx, opts)`.
2. Update every helper (`getAdvisorContext`, `runBridge`, `appendAdvisorBrief`, `event:` handler, status tool) to read/write `state.X` instead of bare `X`.
3. The `cacheKeyForPrompt`, `extractPrompt`, `sessionIdFrom`, `normalizeOptions`, etc. utility functions can stay module-level since they don't touch state.
4. The status tool body now closes over `state`.
5. Run all 23 existing tests — they must pass before proceeding.

### Phase 2: In-flight dedup

1. Add `state.inFlight = new Map()`.
2. Modify `getAdvisorContext` to check `state.inFlight.get(key)` after cache miss.
3. Wrap `runBridge` call in a stored Promise that cleans up on `.finally()`.
4. Test: spy on `runBridge` (or `spawn`), call `Promise.all([getAdvisorContext(p), getAdvisorContext(p), getAdvisorContext(p)])`, assert exactly 1 spawn.

### Phase 3: Caps + LRU

1. Add `DEFAULT_MAX_PROMPT_BYTES`, `DEFAULT_MAX_BRIEF_CHARS`, `DEFAULT_MAX_CACHE_ENTRIES` constants.
2. Add to `normalizeOptions`: read `options.maxPromptBytes`, `options.maxBriefChars`, `options.maxCacheEntries`.
3. Implement `clampPrompt(prompt, maxBytes)` — byte-aware truncation.
4. Implement `clampBrief(brief, maxChars)` — char-count truncation.
5. Apply `clampPrompt` before sending to bridge in `runBridge`.
6. Apply `clampBrief` in `appendAdvisorBrief` before pushing into `output.system[]`.
7. Implement `insertWithEviction(cache, key, value, maxEntries)` and use it in place of `state.advisorCache.set(key, value)`.
8. Tests:
   - 100KB prompt → bridge stdin ≤ MAX_PROMPT_BYTES (assert via spy)
   - bridge returns 10KB brief → `output.system[0].length ≤ MAX_BRIEF_CHARS`
   - insert MAX+1 distinct keys → `cache.size === MAX`, oldest gone

### Phase 4: Verify + canonical save

1. Full focused vitest run → expect 28+ tests (was 23, +5 new).
2. `npm run build` clean.
3. `validate.sh --strict` → 0/0.
4. `generate-context.js` for canonical save.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Add to existing `tests/spec-kit-skill-advisor-plugin.vitest.ts`:

| Test | Asserts |
|------|---------|
| `two instances have independent state` | Plugin called twice with different ctx objects, mutating one's cache/counters does not affect the other's |
| `concurrent identical-key requests dedup to one bridge spawn` | Spy on `runBridge`/`spawn`, `Promise.all([getCtx(p)×5])`, assert 1 spawn |
| `oversized prompt is clamped before bridge` | Spy on bridge stdin write, send 100KB prompt, assert ≤ MAX_PROMPT_BYTES bytes received |
| `oversized brief is clamped before output.system` | Mock bridge to return 10KB brief, assert `output.system[0].length === MAX_BRIEF_CHARS` |
| `cache evicts oldest on overflow` | Insert MAX+1 distinct keys, assert `cache.size === MAX` and the first key is gone |
| `Phase 5 invariants per-instance` | Cache invariant from Phase 5 (`cache_misses === bridge_invocations`, `cache_hits + cache_misses === advisor_lookups`) holds for each instance independently |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 5 baseline (23 tests, fixed metrics, fixed event listener) | Shipped in packet 007 |
| Vitest already configured | Yes |
| OpenCode plugin API stable | Yes (Hooks interface verified in 007 ADR-001) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` of the single commit. No live system state changes; no MCP server restart needed (plugin reloads on next OpenCode session).
<!-- /ANCHOR:rollback -->
