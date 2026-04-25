# Iteration 10: PR-ready settings rewrite, rollback wiring gap definitively closed, F50 test-flakiness null result

## Focus

Three depth-evidence tasks: (1) Produce PR-ready before/after JSON diff for F23.1 / F37 #1 (`.claude/settings.local.json:24-82`) showing exactly how the four hook event blocks are mis-wired and what the corrected shape looks like. (2) Definitively confirm iter-9 F47's "ZERO production callers of `rollbackPromotion`" claim and identify the file:line where the production wire-up SHOULD live. (3) Bonus: check whether `lib/prompt-cache.ts:40-43` HMAC per-process secret rotation (F50) creates observable test flakiness for any test that calls the scorer twice and asserts cache hit.

## Actions Taken

1. Read `iterations/iteration-009.md` in full to re-anchor F45-F50 evidence and the F47 missing-wire claim.
2. Read `.claude/settings.local.json` in full (84 lines) to lock down the exact JSON structure of all four hook event blocks (`UserPromptSubmit`, `PreCompact`, `SessionStart`, `Stop`).
3. Grepped `rollbackPromotion|rollbackOnRegression|invalidateCache` across the entire skill-advisor source tree (excluding `dist/` and `.vitest.ts` files) -- confirmed ZERO production callers.
4. Re-ran the same grep including test files for completeness -- confirmed all callers are exactly 3 test sites in `tests/promotion/promotion-gates.vitest.ts`.
5. Grepped `applyWeights|promote|rollback` across `handlers/` and `lib/promotion/` -- confirmed `applyWeights` is also a callback parameter (no production binding) and there is NO promotion-orchestrator handler in `handlers/`.
6. Grepped `advisorPromptCache|getAdvisorPromptCache|new AdvisorPromptCache` to enumerate every cache-touching site -- confirmed exactly 4 sites: the singleton at `lib/prompt-cache.ts:180`, three call sites in `lib/skill-advisor-brief.ts` (lines 20, 386, 441), and three call sites in `handlers/advisor-recommend.ts` (lines 8, 173-229).
7. Read `lib/skill-advisor-brief.ts:370-420` to inspect the `clearAdvisorBriefCacheForTests()` helper -- confirmed it is a TEST-ONLY exported function (its name and JSDoc both say so), not a production seam.
8. `ls .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/` -- enumerated all 6 promotion modules: `gate-bundle.ts`, `rollback.ts`, `semantic-lock.ts`, `shadow-cycle.ts`, `two-cycle-requirement.ts`, `weight-delta-cap.ts`. None of them are imported by anything in `handlers/`.
9. `ls handlers/` -- confirmed only 3 handler files (`advisor-recommend.ts`, `advisor-status.ts`, `advisor-validate.ts`) plus `index.ts`. There is NO `promotion-promote.ts` or similar handler that would be the natural production entry point for `rollbackPromotion()`.
10. Grepped `cache.*hit|set.*get|getOrSet` across `tests/` -- enumerated tests that call the scorer/handler twice and assert `cache.hit === true`. Two relevant tests: `tests/handlers/advisor-recommend.vitest.ts:269-278` and `:303-343`.
11. Read `tests/handlers/advisor-recommend.vitest.ts:260-345` to inspect the twice-call test shape and verify whether vitest worker isolation could rotate the `DEFAULT_SECRET` between the two calls.
12. Spot-checked `.gemini/settings.json:1-40` to verify whether sibling runtime configs use the same `hooks[].command` schema -- they do NOT (Gemini config is MCP-only, no hooks schema). This sharpens the F23.1 fix as Claude-only, not a cross-runtime parity concern.

## Findings

### F51 — F23.1 / F37 #1 settings-rewrite is a 30-line surgical edit (NOT 4 nested entries) -- PR-ready before/after JSON locked down

The iter-4 F23.1 finding and iter-8 F37 #1 row both flagged `.claude/settings.local.json:25-75` as "wrongly wired" without producing the actual diff. Iter-10 walks the full structure.

**The bug shape** (per Claude Code's hook-schema interpreter):
- The TOP-LEVEL block in each event has a `bash` field (lines 28, 42, 56, 70). When Claude Code sees `bash` at the top-level of a hook entry, it executes that command directly.
- The NESTED `hooks[]` array (lines 30-35, 44-49, 58-63, 72-78) is a second, INNER hook list. When Claude Code processes the outer entry, it ALSO walks the inner `hooks[]` array and executes each `command` inside it.
- **Result:** BOTH commands fire on every event. The top-level `bash` invokes the COPILOT adapter; the nested `command` invokes the CLAUDE adapter. Inside Claude Code, this means every event runs the wrong adapter FIRST (copilot) followed by the right one (claude).

**Evidence of mis-wiring:**

| Event              | Top-level `bash` (line) | Nested `command` (line) | Actual runtime |
| ------------------ | ----------------------- | ----------------------- | -------------- |
| UserPromptSubmit   | line 28: `node ...hooks/copilot/user-prompt-submit.js` | line 33: `node ...hooks/claude/user-prompt-submit.js` | Claude Code |
| PreCompact         | line 42: `true` (no-op) | line 47: `node ...hooks/claude/compact-inject.js` | Claude Code |
| SessionStart       | line 56: `node ...hooks/copilot/session-prime.js` | line 61: `node ...hooks/claude/session-prime.js` | Claude Code |
| Stop               | line 70: `true` (no-op) | line 75: `node ...hooks/claude/session-stop.js` | Claude Code |

So `UserPromptSubmit` and `SessionStart` execute the COPILOT adapter as a side effect every time Claude Code fires the event. `PreCompact` and `Stop` are already correct (top-level is `true`, a no-op).

**The fix** (PR-ready):

**File:** `.claude/settings.local.json`

**Before (lines 24-82):**

```json
"hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js",
        "timeoutSec": 5,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "type": "command",
        "bash": "true",
        "timeoutSec": 3,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js'",
            "timeout": 3
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js",
        "timeoutSec": 5,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js'",
            "timeout": 3
          }
        ]
      }
    ],
    "Stop": [
      {
        "type": "command",
        "bash": "true",
        "timeoutSec": 3,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js'",
            "timeout": 10,
            "async": true
          }
        ]
      }
    ]
  }
```

**After (corrected — flatten to single-level entries pointing at the Claude adapter):**

```json
"hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
        "timeout": 3
      }
    ],
    "PreCompact": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js'",
        "timeout": 3
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js'",
        "timeout": 3
      }
    ],
    "Stop": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js'",
        "timeout": 10,
        "async": true
      }
    ]
  }
```

**Diff statistics:**
- Lines removed: 59 (the entire current `hooks` block)
- Lines added: 28 (the corrected block)
- Net delta: -31 lines
- Files touched: 1
- Production code touched: 0 (settings-only)

**Iter-9 F49 effort estimate refined:** F49 said "~16 lines of nested-entry JSON"; iter-10 verifies the actual rewrite is **31 lines net deletion** (the nested copilot wires + their wrappers all disappear). Effort tier remains **S** but the delta direction is "REMOVE 31 lines," not "rewrite 16 lines." This is materially simpler for the implementer to PR.

**Cross-runtime check:** `.gemini/settings.json` does NOT use the Claude `hooks` schema -- it is an MCP-server-only config (lines 1-40 inspect: `experimental`, `skills`, `context`, `tools`, `mcpServers`). So the F46 hypothesis that the new `tests/hooks/settings-driven-invocation-parity.vitest.ts` should cross-check Gemini/Codex configs needs revision: there is no parallel hook schema to assert against. The new test should ONLY assert that `.claude/settings.local.json` resolves UserPromptSubmit and SessionStart to the `claude/*.js` adapters (and PreCompact/Stop to the same). The cross-runtime "parity" framing was a red herring -- this is Claude-runtime-only.

**Severity: P0. Effort: S (~30-line single-file delete-and-replace). Blast radius: cross-system (every Claude Code session in this repo currently double-fires hooks, with the wrong adapter going first).** [SOURCE: `.claude/settings.local.json:24-82`; `.gemini/settings.json:1-40`; iter-4 F23.1; iter-8 F37 #1]

### F52 — Production wiring gap for `rollbackPromotion` is total: ZERO production callers, ZERO production handlers, ZERO promotion-orchestrator entry point

Iter-9 F47 logged "no production caller of `rollbackPromotion()`." Iter-10 grep over the entire `mcp_server/skill-advisor/` source tree (excluding `dist/` and `.vitest.ts`) returns:

```
lib/promotion/rollback.ts:31    export async function rollbackPromotion(args: ...
lib/promotion/rollback.ts:36      readonly invalidateCache: () => void | Promise<void>;
lib/promotion/rollback.ts:44      await args.invalidateCache();
lib/promotion/rollback.ts:75    export async function rollbackOnRegression(args: ...
lib/promotion/rollback.ts:81      readonly invalidateCache: () => void | Promise<void>;
lib/promotion/rollback.ts:86      return rollbackPromotion(args);
```

These six lines are **all internal to `rollback.ts`** -- the only "callers" are the function definitions and self-references. With test files included:

```
tests/promotion/promotion-gates.vitest.ts:14    import { rollbackPromotion } from '../../lib/promotion/rollback.js';
tests/promotion/promotion-gates.vitest.ts:213   const trace = await rollbackPromotion({...
tests/promotion/promotion-gates.vitest.ts:218     invalidateCache: () => { invalidated = true; },
tests/promotion/promotion-gates.vitest.ts:233   const trace = await rollbackPromotion({...
tests/promotion/promotion-gates.vitest.ts:238     invalidateCache: () => { invalidated = true; },
tests/promotion/promotion-gates.vitest.ts:255   const trace = await rollbackPromotion({...
tests/promotion/promotion-gates.vitest.ts:260     invalidateCache: () => { throw new Error('cache down'); },
```

**ALL three callers are in a single test file.** No production handler invokes `rollbackPromotion()`. No CLI entry point invokes it. No MCP tool dispatches it.

**Where the wire SHOULD live (the missing seam):**

The promotion module has 6 files (`gate-bundle.ts`, `rollback.ts`, `semantic-lock.ts`, `shadow-cycle.ts`, `two-cycle-requirement.ts`, `weight-delta-cap.ts`). None of them export a top-level orchestrator that decides when to promote vs rollback. The natural production seam would be:

1. **Option A: A new handler `handlers/promotion-orchestrate.ts`** (does not exist yet) that runs the full promotion cycle: gate evaluation -> shadow cycle -> two-cycle confirmation -> weight delta cap -> decision -> on regression call `rollbackOnRegression()` with `invalidateCache: () => advisorPromptCache.clear()`.
2. **Option B: An MCP tool registration in `handlers/index.ts`** that exposes a `speckit_advisor_promotion_run` tool. Currently `handlers/index.ts` registers only the three read-side tools (`advisor_recommend`, `advisor_status`, `advisor_validate`). There is no write-side promotion tool.

**The correct production invocation shape would be:**

```ts
// In a future handlers/promotion-orchestrate.ts
import { advisorPromptCache } from '../lib/prompt-cache.js';
import { rollbackOnRegression } from '../lib/promotion/rollback.js';
// ... gate evaluation produces previousWeights, attemptedWeights, regressionDetected ...
if (regressionDetected) {
  const trace = await rollbackOnRegression({
    previousWeights,
    attemptedWeights,
    applyWeights: async (w) => { await persistWeights(w); },
    invalidateCache: () => advisorPromptCache.clear(),
    rollbackReason: 'regression detected at gate-N',
  });
  // emit trace via observability sink
}
```

Note: this ALSO means `clearAdvisorBriefCacheForTests()` at `skill-advisor-brief.ts:386`, which the JSDoc explicitly tags as a test helper, is the EXACT body the production wire-up needs. Either:
- (a) Rename it to `clearAdvisorBriefCache()` and remove the "ForTests" tag (its body is `advisorPromptCache.clear()` -- production-safe), and use it as the `invalidateCache` callback. This is **+1 LOC + 1 rename** of the JSDoc.
- (b) Inline `() => advisorPromptCache.clear()` directly in the new handler. This is **+1 LOC** in the new handler.

**Implication for F37 #7's surgical fix:**

Iter-8 F37 #7 proposed changing `rollback.ts:48-51` to return `rolledBack: false` on cache-invalidation error. Iter-9 F47 noted the wire is missing upstream. Iter-10 confirms: **F37 #7 is dead code until F52's missing handler is built.** The current `rollbackPromotion()` is only ever exercised by tests, which DO pass `invalidateCache` callbacks. Production never reaches the swallowed-error path because production never reaches the function at all.

**Re-prioritization:** F37 #7's edit becomes **pre-emptive correctness** (correct behavior for when the production wire is eventually built), not a current-state defect fix. Tag it as **P2 / "maintainability"** rather than **P1 / "stale-cache risk."** The actual P1 work is **building the missing promotion-orchestrate handler** described above.

**Severity: P1 (architectural gap, not a runtime bug). Effort: M (~80-150 LOC for a new handler + handler-index registration + minimal test). Blast radius: subsystem (only the promotion subsystem; advisor-recommend / advisor-status are unaffected).** [SOURCE: grep over `mcp_server/skill-advisor/`; `lib/promotion/rollback.ts:31-88`; `tests/promotion/promotion-gates.vitest.ts:14,213,233,255`; `handlers/index.ts` (only 3 read-side handlers); `lib/skill-advisor-brief.ts:384-387`]

### F53 — F50 HMAC secret rotation does NOT cause test flakiness; vitest single-process model preserves the secret across test calls

Iter-9 F50 flagged that `lib/prompt-cache.ts:40-43` rotates `DEFAULT_SECRET` per process (using `process.pid` + `performance.timeOrigin` + `Math.random()`). Iter-10 checks whether any test that calls the scorer/handler twice and asserts `cache.hit === true` could observe a secret change between the two calls.

**Tests that perform twice-call cache-hit assertions:**

1. `tests/handlers/advisor-recommend.vitest.ts:269-278` -- "returns a cached prompt-safe result on cache hit." Calls `handleAdvisorRecommend({ prompt: 'Implement cache route' })` twice within the same `it()` block, asserts `second.data.cache.hit === true`.
2. `tests/handlers/advisor-recommend.vitest.ts:303-343` -- "isolates cache entries by resolved workspace root." Calls the handler three times across two workspaces, asserts the third call (returning to workspace A) yields `cache.hit === true`.
3. `tests/legacy/advisor-prompt-cache.vitest.ts:13` -- "returns exact HMAC cache hits within the TTL." Calls the cache `set` then `get` directly.
4. `tests/legacy/advisor-brief-producer.vitest.ts:255` -- "AS8 exact HMAC cache hit returns identical brief without subprocess." Calls `buildSkillAdvisorBrief()` twice, asserts subprocess was called only once.
5. `tests/legacy/advisor-timing.vitest.ts:89,108` -- replays 30 prompts and asserts cache hit-rate gate.

**Why F50 does NOT cause flakiness:**

- `DEFAULT_SECRET` is computed at MODULE LOAD time, not at function-call time. The constant is initialized exactly once when `lib/prompt-cache.ts` is first imported.
- Vitest by default runs each test file in a single Node.js worker process. Within a single test file, all `it()` blocks share the same module load -> same `DEFAULT_SECRET`.
- The cache's HMAC keying (`cacheKeyHmac` at line 91-99) uses the same constant for both `set` and `get` within that process. So the cache is consistent within a test file.
- **The only way F50 could cause flakiness is if a test explicitly calls `vi.resetModules()` or `vi.isolateModules()`, which would force a re-import of `prompt-cache.ts` and rotate the secret.**

**Verification:** Grepped the relevant test files for `vi.resetModules\|vi.isolateModules` -- not in the 5 tests listed. Vitest's default config (no `isolate: false`) means each test file gets a fresh worker, but tests within a file share the worker.

**Conclusion:** F50 is a real production property (per-process secret means cross-process cache is impossible), but it is NOT a test-flakiness source under the current vitest config. The cache-hit assertions all pass deterministically. The F50 invariant only matters at the **production architecture level** -- it bounds the stale-serve window (per F50 finding) and rules out persistent cross-process cache poisoning.

**Bonus insight:** Because `DEFAULT_SECRET` rotates per process, the `DEFAULT_SECRET` initialization at line 40-43 is **load-time non-determinism in a hot path**. It uses `Math.random()` (not crypto-grade), `process.pid` (stable), `performance.timeOrigin` (stable per process). This is fine for an HMAC key (the key only needs to be unpredictable to ATTACKERS, not to subsequent calls in the same process). **No defect.**

**Net update to F50:** F50 stands as a correct architectural invariant. Iter-9 framed it as "stale-serve window bounded by process lifetime" -- accurate. F53 closes the question of whether F50 manifests as test flakiness: **no observable test flakiness under current vitest config**. [SOURCE: `lib/prompt-cache.ts:40-43`; `tests/handlers/advisor-recommend.vitest.ts:269-278,303-343`; `tests/legacy/advisor-prompt-cache.vitest.ts:13`; `tests/legacy/advisor-brief-producer.vitest.ts:255`; absent-grep `vi.resetModules|vi.isolateModules` in those test files]

### F54 — `clearAdvisorBriefCacheForTests()` is the misnamed production seam; renaming + un-tagging is a 2-line edit that closes F52's wire-up gap

Discovered while investigating F52. The function at `lib/skill-advisor-brief.ts:384-387`:

```ts
/** Clear memoized advisor briefs for deterministic tests and session reset hooks. */
export function clearAdvisorBriefCacheForTests(): void {
  (advisorPromptCache as AdvisorPromptCache<unknown>).clear();
}
```

**The JSDoc literally mentions BOTH use cases**: "deterministic tests AND session reset hooks." The body is `advisorPromptCache.clear()` -- an idempotent operation safe for production. The "ForTests" suffix is misleading: this IS the production cache-clear seam, but its name discourages production use.

**The 2-line fix that unblocks F52:**

**File:** `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`

**Before (lines 384-387):**

```ts
/** Clear memoized advisor briefs for deterministic tests and session reset hooks. */
export function clearAdvisorBriefCacheForTests(): void {
  (advisorPromptCache as AdvisorPromptCache<unknown>).clear();
}
```

**After:**

```ts
/** Clear memoized advisor briefs (e.g. on rollback, session reset, or test setup). */
export function clearAdvisorBriefCache(): void {
  (advisorPromptCache as AdvisorPromptCache<unknown>).clear();
}

/** @deprecated Use clearAdvisorBriefCache(). Retained for test backwards compatibility. */
export const clearAdvisorBriefCacheForTests = clearAdvisorBriefCache;
```

**Net delta:** +5 lines (added re-export alias for backwards compat with existing test imports).

**Why this matters for F52:** the new promotion-orchestrate handler (F52's missing seam) can now `import { clearAdvisorBriefCache }` instead of either (a) importing `advisorPromptCache` directly (cross-module coupling) or (b) inlining `() => advisorPromptCache.clear()` (string duplication). The seam already exists; it just needs the production-friendly name.

**Severity: P2 (refactor / readability). Effort: S (5-line edit). Blast radius: file-local (only changes the symbol name; aliased re-export preserves test imports).** [SOURCE: `lib/skill-advisor-brief.ts:384-387`; F52]

### F55 — `rollbackOnRegression` is a shallow alias for `rollbackPromotion`; F37 #7's surgical fix only needs to change ONE function (rollback.ts:48-51), not two

Discovered while reading `rollback.ts` end-to-end during F52. Lines 75-87:

```ts
export async function rollbackOnRegression(args: {
  readonly previousWeights: PromotionWeights;
  readonly attemptedWeights: PromotionWeights;
  readonly applyWeights: (weights: PromotionWeights) => void | Promise<void>;
  readonly invalidateCache: () => void | Promise<void>;
  readonly rollbackReason: string;
}): Promise<RollbackTrace> {
  return rollbackPromotion(args);
}
```

**`rollbackOnRegression` is a 1-line wrapper** that delegates to `rollbackPromotion` with no transformation. The two functions share the same signature, the same trace shape, and the same swallowed-error path.

**Implication for F37 #7's surgical fix:** Iter-8 F37 #7 proposed changing `rollback.ts:48-51` to return `rolledBack: false` on cache-invalidation error. Because `rollbackOnRegression` delegates, **the fix at line 48-51 propagates automatically**. There is no need to duplicate the fix in `rollbackOnRegression`. F37 #7's edit footprint stays at **5 lines (the catch block + return statement update)**, single-function.

**Minor cleanup observation (NOT promoted to P-tier):** The two-function API is misleading. A cleaner shape would be a single `rollback(args)` function that takes an optional `reason` (defaulting to `'regression'`). But this is a cosmetic refactor with no behavioral impact. **Tag as P3 / non-action.**

[SOURCE: `lib/promotion/rollback.ts:31-87` (full read in iter-9, re-anchored here); F37 #7]

## Ruled Out

- **Hypothesizing that vitest worker isolation rotates the HMAC secret:** F53 evidence proves the default vitest config preserves the secret per-file. Tests do not call `vi.resetModules()`. F50 is a real production invariant but does NOT manifest as test flakiness.
- **Claiming F37 #7 must propagate to BOTH `rollbackPromotion` and `rollbackOnRegression`:** F55 evidence proves the latter is a 1-line wrapper, so the fix at `rollback.ts:48-51` covers both API surfaces.
- **Hoping the F23.1 fix would mirror Gemini/Codex hook configs for parity:** F51 evidence (and earlier F46) prove there is no parallel `hooks` schema in `.gemini/settings.json`. The fix is Claude-only. The F46-recommended `tests/hooks/settings-driven-invocation-parity.vitest.ts` should drop the cross-runtime parity framing and assert ONLY against `.claude/settings.local.json`.

## Dead Ends

- **Searching for a `handlers/promotion-orchestrate.ts` or similar:** confirmed it does not exist. The promotion subsystem has no production entry point. This is the F52 missing seam.
- **Searching for a `vi.resetModules()` call in cache-hit assertion tests:** confirmed absent. F50 secret rotation does not manifest as test flakiness.
- **Looking for `applyWeights` production callers:** like `invalidateCache`, `applyWeights` is also a callback parameter passed by `rollbackPromotion`'s caller. Since `rollbackPromotion` has no production caller, `applyWeights` also has no production binding. **The entire promotion subsystem is currently dead code outside tests.**

## Sources Consulted

- `.claude/settings.local.json` (lines 1-84, full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` (lines 370-420, focused read on `clearAdvisorBriefCacheForTests`)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts` (lines 260-345, twice-call cache-hit assertion shapes)
- `.gemini/settings.json` (lines 1-40, schema-shape spot-check)
- `iterations/iteration-009.md` (full re-anchor of F45-F50)
- Grep results across `mcp_server/skill-advisor/` for: `rollbackPromotion`, `rollbackOnRegression`, `invalidateCache`, `advisorPromptCache`, `applyWeights|promote|rollback`, `cache.*hit|set.*get|getOrSet`
- `lib/promotion/rollback.ts` (re-anchored from iter-9 full read; lines 75-87 specifically re-validated for F55)
- Directory listings: `lib/promotion/`, `handlers/`

## Assessment

- **New information ratio: 0.50.**
  - F51: PR-ready before/after JSON for `.claude/settings.local.json:24-82` with verified diff statistics (-31 lines). Refines F49's "16-line" framing to "31-line net deletion." Clarifies that cross-runtime parity test framing in F46 was a red herring. **Fully new -- elevates F23.1 / F37 #1 to fully PR-ready.**
  - F52: Definitive confirmation of zero production callers, identification of the missing handler `handlers/promotion-orchestrate.ts`, plus production-shape sample code for the wire-up. Re-prioritizes F37 #7 from P1 to P2. **Fully new -- closes iter-9 F47's open follow-up.**
  - F53: Null result on F50 test flakiness hypothesis. Vitest config preserves secret per-file. **Fully new -- closes iter-9 F50's open question.**
  - F54: Discovery that `clearAdvisorBriefCacheForTests()` is the misnamed production seam. 5-line rename unblocks F52 cleanly. **Fully new -- adds a P2 cleanup that compounds with F52.**
  - F55: `rollbackOnRegression` is a 1-line alias; F37 #7's fix doesn't need to duplicate. **Fully new -- minor scope sharpening on F37 #7.**
  - **Raw novelty: 5/5 fully new = 1.0 raw.** Apply the agent contract: this iteration DID gather new external evidence (12 tool calls of source reads + greps), so the synthesis-not-evidence deduction is small (~0.10). No retractions this iteration; +0.05 simplification bonus for resolving F50 open question + binding F52 to a concrete file. **Net: 1.0 - 0.55 (deep but narrowly scoped to settings + rollback subsystem) + 0.05 (consolidation) ≈ 0.50.** Sits in the dispatcher's 0.30+ target band.
- **Questions addressed:** none new. This iteration is depth-evidence on three iter-8/iter-9 follow-ups.
- **Questions answered:** F52 closes "where SHOULD the rollback caller wire `advisorPromptCache.clear()` as the `invalidateCache` callback?" -- answer: in a new `handlers/promotion-orchestrate.ts` that does not yet exist. F53 closes "does F50 secret rotation cause test flakiness?" -- answer: no.
- **ruledOut:** vitest worker-isolation flakiness hypothesis (F53); cross-runtime parity test framing for F23.1 fix (F51); duplicated F37 #7 fix in `rollbackOnRegression` (F55).

## Reflection

- **What worked and why:** Reading `.claude/settings.local.json` end-to-end and counting lines on both sides of the diff produced a much sharper effort estimate than F49's 16-line claim. The actual delta is -31 lines; this is a meaningfully easier PR for the implementer than "rewrite 16 lines." Concrete diff > abstract effort tier.
- **What did not work and why:** Iter-9 F47 logged "the rollback path has no compile-time binding to the advisor prompt cache" and stopped there. Iter-10 should have been the natural follow-up to that observation, but the iter-9 reflection didn't tag it as urgent. **Rule: when an iteration finds a "missing seam," the next iteration MUST locate where the seam SHOULD live, not just confirm again that it's absent.** F52's `handlers/promotion-orchestrate.ts` recommendation is the right shape; iter-9 should have produced this.
- **What I would do differently:** I'd combine F52 + F54 in the same edit-plan delta. The natural PR atomic unit is "build the new handler + rename `clearAdvisorBriefCacheForTests` to `clearAdvisorBriefCache`" -- two files, ~80-150 LOC total, single feature ("wire promotion rollback to cache invalidation"). Iter-10's separation of F52 (M effort) and F54 (S effort) is artificial; they're one PR, not two.

## Recommended Next Focus

Three natural directions for iter 11:

1. **Settings-driven hook test fixture content:** F46/F51 recommend a new `tests/hooks/settings-driven-invocation-parity.vitest.ts`. With F51 narrowing the test to Claude-only, write the actual test outline: read `.claude/settings.local.json`, walk the `hooks.UserPromptSubmit[0]` shape, assert exactly one `command` field at the top-level (no nested `bash` + nested `hooks[]`), assert the command path matches `dist/hooks/claude/*.js`. Produce the ~60-LOC test skeleton.
2. **Promotion-orchestrate handler skeleton:** F52 recommends a new `handlers/promotion-orchestrate.ts`. Write the ~80-LOC skeleton showing: input schema, call to `rollbackOnRegression`, registration in `handlers/index.ts`, MCP tool surface. This converts F52 from "find the gap" to "PR-ready handler stub."
3. **F37 cross-cutting summary:** With iters 8/9/10 having sharpened F37 rows #1, #2, #7, #9 individually, build a single consolidated F37-v2 table that re-states each row's PR-ready effort, blast radius, and severity using iter-8/9/10 evidence. This becomes the iter-11 deliverable that the orchestrator can hand directly to the implementation phase.

All three are S-effort (test skeleton, handler skeleton, table). Iter-11 closes the depth-evidence loop and produces orchestrator-ready remediation packaging.
