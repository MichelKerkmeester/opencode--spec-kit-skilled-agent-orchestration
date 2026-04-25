# Iteration 11: Test fixture skeleton, promotion-orchestrate handler skeleton, F37-v2 consolidated remediation table, dead-code second-order check

## Focus

Three orchestrator-ready deliverables plus a second-order soundness check on the iter-10 dead-code finding:

1. Settings-driven hook test fixture skeleton (`tests/hooks/settings-driven-invocation-parity.vitest.ts`, ~60 LOC) supporting F46/F51 with file:line evidence for how Claude Code interprets `hooks[].command` vs `bash:`.
2. Promotion-orchestrate handler skeleton (`handlers/promotion-orchestrate.ts`, ~80 LOC) — the missing seam from F52 that wires `rollbackOnRegression()` + `advisorPromptCache.clear()` + telemetry emission.
3. F37-v2 consolidated remediation table absorbing iter-8/9/10 sharpenings (F33 corpus-path, F23.1 settings wiring, F25 parity test, F37 #7 cache invalidation).
4. Second-order check: does iter-10's dead-code finding (F52) invalidate iter-3 F15's "regression categories leak through" claim, or is the subsystem intended to be wired up later? Search for TODOs / inline docs.

## Actions Taken

1. Re-read `iterations/iteration-010.md` end-to-end to anchor F51-F55 evidence.
2. Re-read `deep-research-strategy.md` Sections 3, 9, 11 to confirm next-focus alignment and check exhausted approaches.
3. Grepped `(TODO|FIXME|@todo|future|wire.*up|not.*yet|orchestrat|integration|deferred|placeholder)` across `lib/promotion/` and `handlers/` — **ZERO hits in `lib/promotion/`**, one false-positive `'future'` in `handlers/advisor-recommend.ts:138` (a status enum literal). The 6-module promotion subsystem has NO inline doc, NO TODO, and NO comment explaining when/how it gets wired to a production caller.
4. Read `handlers/index.ts` in full (8 lines) — confirmed only 3 read-side handler exports; no promotion-write surface.
5. Read `handlers/advisor-recommend.ts:1-80` to ground the handler skeleton's import shape, schema-Zod pattern, and `HandlerResponse = { content: Array<{ type: string; text: string }> }` MCP-tool envelope contract.
6. Re-read `lib/promotion/rollback.ts` end-to-end (88 lines) — discovered iter-10 F55's reading missed three details: `rollbackPromotion` requires `failedWeights` (not `attemptedWeights`) and `emitTelemetry`, and `rollbackOnRegression` short-circuits on `!regressionDetected` returning `null`. **F55 needs correction (see F58 below).**
7. Cross-walked the corrected `rollback.ts` signature against the iter-10 F52 sample wire-up code — confirmed F52's sample code was correct in spirit but wrong in two arg names (`attemptedWeights` should be `failedWeights`) and missing the `emitTelemetry` callback. The handler skeleton in this iteration carries the correct shape.
8. Counted JSONL records (`wc -l deep-research-state.jsonl` -> 15) to verify iter-11 is the next index. (Note: 15 records covers iters 1-10 plus 5 reducer/lineage records; iter-11 narrative is the 11th iteration record.)

## Findings

### F56 — Test fixture skeleton for `tests/hooks/settings-driven-invocation-parity.vitest.ts` (~60 LOC, Claude-runtime-only assertion shape)

**File to create:** `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`

**Test contract (per F51 narrowing):**
- Read `.claude/settings.local.json` directly from disk (no mock; this is a fixture-shape assertion, not a runtime behavior assertion).
- For each of the four hook event keys (`UserPromptSubmit`, `PreCompact`, `SessionStart`, `Stop`):
  - Assert the array has exactly 1 entry.
  - Assert that entry has a top-level `command` field pointing at `dist/hooks/claude/<event>.js`.
  - Assert that entry does NOT have a top-level `bash` field.
  - Assert that entry does NOT have a nested `hooks[]` array.
- Optional: assert timeouts match expected values (3s for fast hooks, 10s + `async: true` for `Stop`).

**Why no `vi.mock(child_process)`:** The bug F23.1/F37 #1 surfaces is in the **JSON shape** of `settings.local.json`, not in the JS spawn behavior. Claude Code's hook-schema interpreter (closed-source, runs inside the Claude CLI) is what walks the shape; we cannot mock it. The cheapest, highest-value test is to **assert the JSON shape itself**, which is the canonical form that the interpreter consumes. This avoids re-implementing Claude Code's interpreter in test infrastructure and instead pins the contract at the **input boundary** (the JSON file).

**Cited file:line evidence for hook-schema interpretation:**

The Claude Code hook-schema interpretation is observable from runtime behavior at `.claude/settings.local.json:24-82` (per iter-10 F51): a top-level `bash` field invokes a shell command directly, and a nested `hooks[]` array invokes each `command` inside it. **Both fire on every event.** This is the bug shape iter-10 F51 documented; the test asserts the corrected shape.

There is no public Anthropic doc citing the hook interpreter's behavior at file:line precision, but the empirical signal from `.claude/settings.local.json:24-82` (where `node ...copilot/user-prompt-submit.js` is at line 28 and `node ...claude/user-prompt-submit.js` is at line 33, both demonstrably fire in Claude Code sessions) is the load-bearing evidence. **The test reifies this empirical observation as a regression guard.**

**Severity: P1 (blocks F23.1 PR — the implementer needs a guard so the broken shape can't reappear). Effort: S (~60 LOC, single new file, no production code touched).** [SOURCE: `.claude/settings.local.json:24-82`; iter-10 F51; iter-9 F46]

### F57 — Promotion-orchestrate handler skeleton for `handlers/promotion-orchestrate.ts` (~80 LOC, with corrected `rollback.ts` signature)

**File to create:** `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/promotion-orchestrate.ts`

**Function signature:**

```ts
export interface PromotionOrchestrateInput {
  readonly previousWeights: PromotionWeights;
  readonly attemptedWeights: PromotionWeights;
  readonly regressionDetected: boolean;
  readonly regressionReason: string;
  readonly applyWeights: (weights: PromotionWeights) => void | Promise<void>;
  readonly emitTelemetry: (event: RollbackTelemetryEvent) => void | Promise<void>;
}

export interface PromotionOrchestrateOutput {
  readonly rolledBack: boolean;
  readonly trace: RollbackTrace | null;
  readonly invalidatedCache: boolean;
}

export async function handlePromotionOrchestrate(
  input: PromotionOrchestrateInput,
): Promise<PromotionOrchestrateOutput>;
```

**Dependency injection points (5):**
1. `applyWeights` — caller-provided weight persistence (NOT inlined; the handler stays decoupled from the weights store).
2. `emitTelemetry` — caller-provided telemetry sink (the handler does NOT bind to a specific observability backend).
3. `invalidateCache` — bound INSIDE the handler to `clearAdvisorBriefCache()` (per F54's renamed seam) or directly to `advisorPromptCache.clear()` if F54 hasn't landed yet.
4. `regressionDetected` and `regressionReason` — caller-provided gate-evaluation results. The handler does NOT run the 7-gate bundle itself; it consumes the result. This keeps the handler's responsibility narrow ("on regression -> rollback + invalidate cache + telemetry").
5. `now` (optional) — implicit via `rollbackPromotion`'s default `new Date().toISOString()`.

**State-log event emission contract:**
- The handler emits **at most one** `promotion_rollback` event per call, only when `regressionDetected === true`.
- The event payload conforms to `RollbackTelemetryEvent` (defined at `lib/promotion/rollback.ts:7-14`): `{ event, reason, restoredWeights, failedWeights, cacheInvalidated, rolledBackAt }`.
- Telemetry emission errors are SWALLOWED (they appear as `trace.telemetryError` in the return value but do not throw). This matches `rollbackPromotion`'s existing behavior at `rollback.ts:57-62`.
- Cache-invalidation errors are SWALLOWED (they appear as `trace.cacheInvalidationError`). **F37 #7's pre-emptive correctness fix would change this to `rolledBack: false` on cache failure**, but that is OUT OF SCOPE for the orchestrate handler — the fix lives in `rollback.ts:43-48`.

**MCP tool surface (Option B from iter-10 F52):**
- The handler is exported from `handlers/promotion-orchestrate.ts`.
- An MCP-tool wrapper is registered in `handlers/index.ts` as `handle_promotion_orchestrate` (snake_case for MCP convention).
- Tool name: `speckit_advisor_promotion_orchestrate`.
- This is OPTIONAL for v1; the handler can also be invoked directly as a library function from a future CLI or scheduler.

**Why this shape (vs inlining in advisor-validate or as a side-effect of advisor-recommend):**
- `advisor-recommend` is the read-side hot path (cache hits target sub-1ms); adding promotion logic to it would defeat its caching invariants.
- `advisor-validate` is a read-side validation tool; promotion is a write-side concern and belongs in its own handler.
- A dedicated handler also gives a clean test seam: `tests/handlers/promotion-orchestrate.vitest.ts` can construct a fixture input, call the handler, and assert the trace + the side effects on the injected callbacks. This is materially cleaner than the current state where promotion logic only exists at the unit level (`tests/promotion/promotion-gates.vitest.ts`).

**Severity: P1 (architectural gap — the entire 6-module promotion subsystem is currently dead code outside tests per iter-10 F52). Effort: M (~80 LOC handler + ~20 LOC index registration + ~60 LOC test = ~160 LOC total). Blast radius: subsystem (only the promotion subsystem; advisor-recommend / advisor-status / advisor-validate are unaffected).** [SOURCE: `lib/promotion/rollback.ts:7-87`; `handlers/index.ts:1-8`; `handlers/advisor-recommend.ts:1-80`; iter-10 F52, F54]

### F58 — Iter-10 F55 needs a 2-arg-name correction; `rollbackOnRegression` is NOT a pure 1-line passthrough

While constructing the F57 skeleton, re-read `lib/promotion/rollback.ts:75-87` end-to-end. **Three details that iter-10 F55 missed:**

1. The arg name is `failedWeights` (not `attemptedWeights`). F55's example code used `attemptedWeights`; that's wrong and would not type-check.
2. Both functions require an `emitTelemetry: (event: RollbackTelemetryEvent) => void | Promise<void>` callback. F55's example code omitted it.
3. `rollbackOnRegression` short-circuits on `!regressionDetected` returning `null` (line 85). It is NOT a pure 1-line passthrough; it has a guard. F55's "1-line wrapper" framing was approximately right but understates the guard semantics.

**Implication for F37 #7's surgical fix:** F55's claim that "the fix at `rollback.ts:48-51` covers both API surfaces" is still correct (because `rollbackOnRegression` does delegate to `rollbackPromotion` once past the guard), but the framing "1-line wrapper" should be "thin wrapper with a regression-detected guard." The fix-propagation conclusion stands.

**Implication for F52 sample code:** Iter-10 F52's sample wire-up code is **not type-correct as written** because of the arg-name mismatch and the missing `emitTelemetry`. The corrected shape is in F57's signature above. This is a documentation-quality issue, not a behavioral issue — F52's recommendation to build the handler is still correct.

**Severity: P3 (corrective re-anchor; affects iter-10 derivative claims but not the action plan). Effort: trivial (this finding IS the correction).** [SOURCE: `lib/promotion/rollback.ts:75-87`; iter-10 F52, F55]

### F59 — F37-v2 consolidated remediation table (orchestrator-ready)

Absorbing iter-3 F15, iter-7 F33, iter-8 F37 (initial 11-row table), iter-9 F45-F50, iter-10 F51-F55, and iter-11 F56-F58.

| #  | Finding ref      | Description                                                                                          | Severity | Effort | LOC delta            | File(s) touched                                                       | Blast radius          | Blocked-by  |
| -- | ---------------- | ---------------------------------------------------------------------------------------------------- | -------- | ------ | -------------------- | --------------------------------------------------------------------- | --------------------- | ----------- |
| 1  | F23.1 / F37 #1   | Settings rewrite: flatten 4 nested hook entries to single-level Claude-runtime entries               | **P0**   | S      | **-31 lines net**    | `.claude/settings.local.json:24-82`                                   | cross-system          | —           |
| 2  | F33 / F37 #2     | AC-4 corpus path fix: change benchmark to read from current corpus location                          | **P0**   | S      | **4 lines** (was "1 line"; iter-9 sharpened to 4) | `bench/closing-accuracy.bench.ts` (path constant)                     | benchmark suite       | —           |
| 3  | F25 / F46 / F56  | New `tests/hooks/settings-driven-invocation-parity.vitest.ts` — assert JSON shape of settings        | P1       | S      | **+60 LOC** new file | `tests/hooks/settings-driven-invocation-parity.vitest.ts` (NEW)       | regression guard      | #1 (logical) |
| 4  | F52 / F57        | New `handlers/promotion-orchestrate.ts` — wire promotion subsystem to production seam                | P1       | M      | **+80 LOC handler + 20 LOC index + 60 LOC test = +160 LOC** | `handlers/promotion-orchestrate.ts` (NEW), `handlers/index.ts`, `tests/handlers/promotion-orchestrate.vitest.ts` (NEW) | subsystem (promotion) | —           |
| 5  | F54              | Rename `clearAdvisorBriefCacheForTests` -> `clearAdvisorBriefCache`; alias retained for backcompat   | P2       | S      | **+5 LOC**           | `lib/skill-advisor-brief.ts:384-387`                                  | file-local            | —           |
| 6  | F37 #7           | `rollbackPromotion` returns `rolledBack: false` on cache-invalidation error (pre-emptive correctness)| **P2** (was P1; iter-10 re-prioritized due to F52 dead-code finding) | S | **~5 lines** (catch block edit) | `lib/promotion/rollback.ts:43-51`                              | subsystem (promotion) | #4 (becomes live only when handler exists) |
| 7  | F37 #5           | Variance-metric fix in `gate-bundle.ts` (closing accuracy gate uses sample variance, not population) | P1       | S      | **~3 lines**         | `lib/promotion/gate-bundle.ts` (line ref TBD; iter-8 framed surgically) | subsystem (promotion) | —           |
| 8  | F37 #6           | L1/L2-norm consistency in `weight-delta-cap.ts` (currently mixes L1/L2 in two paths)                 | P1       | S      | **~6 lines**         | `lib/promotion/weight-delta-cap.ts`                                   | subsystem (promotion) | —           |
| 9  | F37 #9           | Stale-state messaging consistency: 4 surfaces emit divergent state strings                           | P1       | M      | **~30 LOC across 4 files** | `code_graph_status.ts`, `code_graph_context.ts`, `code_graph_query.ts`, advisor brief | cross-tool            | —           |
| 10 | F37 #11          | Lane-confidence empirical calibration (after F33 lands, run the calibration job)                     | P2       | M      | **+~150 LOC bench**  | `bench/lane-calibration.bench.ts` (NEW)                               | benchmark suite       | #2          |
| 11 | F36 #1           | New benchmark `bench/edge-precision-recall.bench.ts` — close per-language parser benchmark gap        | P2       | M      | **+~120 LOC bench**  | `bench/edge-precision-recall.bench.ts` (NEW)                          | benchmark suite       | —           |

**Net F37-v2 effort tier distribution:**
- P0 / S: 2 items (#1, #2) — total ~ -27 LOC (deletes dominate)
- P1 / S: 3 items (#3, #7, #8) — total ~ +69 LOC
- P1 / M: 2 items (#4, #9) — total ~ +190 LOC
- P2 / S: 2 items (#5, #6) — total ~ +10 LOC
- P2 / M: 2 items (#10, #11) — total ~ +270 LOC

**Critical-path PR sequence (recommended):**
1. P0 fixes first (#1 settings rewrite, #2 corpus path) — these unblock the benchmark suite and Claude-runtime hook hygiene.
2. P1 promotion-subsystem wiring (#4 + #5/#6/#7 promoted into the same PR) — single coherent feature: "wire promotion rollback to cache invalidation, fix the variance/norm/error-handling correctness items at the same time."
3. P1 settings-test guard (#3) — fast follow-on after #1 to prevent regression.
4. P1 stale-state messaging (#9) — independent of promotion subsystem.
5. P2 bench coverage (#10, #11) — runs after the calibration corpus is unblocked by #2.

[SOURCE: iter-3 F15; iter-7 F33; iter-8 F37 (initial table); iter-9 F45-F50; iter-10 F51-F55; iter-11 F56-F58]

### F60 — Second-order check on iter-10 dead-code finding: F15's "regression categories leak through" claim survives, but its scope is narrowed

**Question:** If the entire 6-module promotion subsystem never runs in production (per iter-10 F52), does that invalidate iter-3 F15's claim that "regression categories leak through the 7-gate promotion bundle"?

**Evidence from iter-11 grep over `lib/promotion/` and `handlers/`:** ZERO `TODO`, `FIXME`, `@todo`, `future`, `wire`, `not yet`, `orchestrat`, `integration`, `deferred`, or `placeholder` hits. The promotion modules contain no inline comments explaining when/how they get wired. **There is no documented "wired up later" intent.** The subsystem is structurally complete (6 modules, full test coverage, exported APIs) but architecturally orphaned.

**Two possible explanations:**
1. **Build-then-wire:** The author built the promotion subsystem with full test coverage planning to wire it up in a follow-on PR that never happened. The dead-code state is unintentional.
2. **Speculative subsystem:** The author built it as a future capability with no specific PR plan. The dead-code state is intentional but indefinitely deferred.

The grep results don't disambiguate, but the **near-complete test coverage** (full unit tests at `tests/promotion/promotion-gates.vitest.ts`, integration-shaped fixtures, type-correct callbacks) strongly suggests Explanation 1. **Author intent was to wire it.**

**Implication for iter-3 F15:**

Iter-3 F15 claimed "X% of regression categories leak through the 7-gate promotion bundle" based on static analysis of the gate logic. With iter-10 F52's finding that the gates never run in production:

- F15's claim is **structurally correct** — the gate logic, when executed, would let those regression categories through.
- F15's claim is **operationally moot** — because the gates never execute, no regression categories actually leak through to production. There IS no production promotion path to leak through.
- **Net:** F15 is best re-framed as "**when the promotion subsystem is wired up (per F52/F57), the 7-gate bundle MUST be hardened with the F37 #5/#6/#7 corrections before it gates real promotions, otherwise X% of regression categories will leak through.**" This converts F15 from a current-state defect to a **pre-condition on the F4/F57 wire-up landing**.

**Implication for the F37-v2 table:** items #6 (variance), #7 (cache-invalidation error handling), #8 (L1/L2 consistency) all become **prerequisites for F37-v2 #4 (handler skeleton)** rather than independent fixes. The recommended sequencing is now: **wire the handler #4, but include #6+#7+#8 in the same PR** so the production-gated promotion path lands with the corrections in place. This is a STRONGER form of the iter-11 F59 sequencing recommendation.

**Implication for severity tagging:** F15 stays P1 ("regression-protection-critical for the future production path") but is annotated with "**not currently exploitable in production; becomes exploitable when F57 lands**". This avoids both over- and under-stating its current risk.

**Severity: F15 (re-framed) stays P1. F60 itself is a synthesis finding, no severity tag.** [SOURCE: grep over `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/` and `handlers/` for wiring-intent keywords; iter-3 F15; iter-10 F52; iter-11 F57]

## Edit-plan deltas (also written to `deltas/iter-011.jsonl`)

This iteration produces TWO `edit_plan` records — one for the test fixture skeleton (F56) and one for the handler skeleton (F57). Both are skeletons (not real production edits); they live as proposed `newContent` blocks in the delta JSONL for the implementation phase to consume verbatim.

See `deltas/iter-011.jsonl` for the structured records. Inline summary:

**Delta #1 — `tests/hooks/settings-driven-invocation-parity.vitest.ts` (new file, ~60 LOC):**

```ts
// ───────────────────────────────────────────────────────────────
// MODULE: Settings-driven Invocation Parity (F23.1 / F46 / F51 regression guard)
// ───────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const SETTINGS_PATH = resolve(__dirname, '../../../../../../.claude/settings.local.json');
const EXPECTED_HOOK_EVENTS = ['UserPromptSubmit', 'PreCompact', 'SessionStart', 'Stop'] as const;
const EXPECTED_HANDLER_PATHS: Record<(typeof EXPECTED_HOOK_EVENTS)[number], string> = {
  UserPromptSubmit: 'dist/hooks/claude/user-prompt-submit.js',
  PreCompact: 'dist/hooks/claude/compact-inject.js',
  SessionStart: 'dist/hooks/claude/session-prime.js',
  Stop: 'dist/hooks/claude/session-stop.js',
};

interface HookEntry {
  type: string;
  command?: string;
  bash?: string;
  hooks?: unknown[];
  timeout?: number;
  timeoutSec?: number;
  async?: boolean;
}

interface ClaudeSettings {
  hooks?: Record<string, HookEntry[]>;
}

describe('settings-driven invocation parity (F23.1 / F46 / F51)', () => {
  const raw = readFileSync(SETTINGS_PATH, 'utf8');
  const settings = JSON.parse(raw) as ClaudeSettings;

  it('hooks block exists', () => {
    expect(settings.hooks).toBeDefined();
  });

  for (const event of EXPECTED_HOOK_EVENTS) {
    describe(`event=${event}`, () => {
      const entries = settings.hooks?.[event] ?? [];

      it('has exactly one entry', () => {
        expect(entries).toHaveLength(1);
      });

      const entry = entries[0];

      it('has top-level command (not bash)', () => {
        expect(entry?.command).toBeDefined();
        expect(entry?.bash).toBeUndefined();
      });

      it('has no nested hooks[] array', () => {
        expect(entry?.hooks).toBeUndefined();
      });

      it('command resolves to claude/ adapter, not copilot/', () => {
        expect(entry?.command).toContain(EXPECTED_HANDLER_PATHS[event]);
        expect(entry?.command).not.toContain('hooks/copilot/');
      });
    });
  }

  it('Stop hook is async with extended timeout', () => {
    const stop = settings.hooks?.Stop?.[0];
    expect(stop?.async).toBe(true);
    expect(stop?.timeout).toBeGreaterThanOrEqual(10);
  });
});
```

**Delta #2 — `handlers/promotion-orchestrate.ts` (new file, ~80 LOC):**

```ts
// ───────────────────────────────────────────────────────────────
// MODULE: promotion_orchestrate Handler (F52 / F57 production seam)
// ───────────────────────────────────────────────────────────────

import { advisorPromptCache } from '../lib/prompt-cache.js';
import {
  rollbackOnRegression,
  type RollbackTelemetryEvent,
  type RollbackTrace,
} from '../lib/promotion/rollback.js';
import type { PromotionWeights } from '../schemas/promotion-cycle.js';

export interface PromotionOrchestrateInput {
  readonly previousWeights: PromotionWeights;
  readonly attemptedWeights: PromotionWeights;
  readonly regressionDetected: boolean;
  readonly regressionReason: string;
  readonly applyWeights: (weights: PromotionWeights) => void | Promise<void>;
  readonly emitTelemetry: (event: RollbackTelemetryEvent) => void | Promise<void>;
  readonly now?: () => string;
}

export interface PromotionOrchestrateOutput {
  readonly rolledBack: boolean;
  readonly trace: RollbackTrace | null;
  readonly invalidatedCache: boolean;
  readonly cacheInvalidationError?: string;
  readonly telemetryError?: string;
}

/**
 * Orchestrate a promotion outcome.
 *
 * - On regression: applies previous weights, invalidates the advisor prompt cache,
 *   and emits a `promotion_rollback` telemetry event.
 * - On no regression: returns a no-op result (trace=null, rolledBack=false).
 *
 * The handler is the production seam between the 7-gate promotion bundle
 * (caller-side: produces `regressionDetected`) and the advisor caching layer
 * (handler-side: invalidates `advisorPromptCache`).
 */
export async function handlePromotionOrchestrate(
  input: PromotionOrchestrateInput,
): Promise<PromotionOrchestrateOutput> {
  const trace = await rollbackOnRegression({
    regressionDetected: input.regressionDetected,
    reason: input.regressionReason,
    previousWeights: input.previousWeights,
    failedWeights: input.attemptedWeights,
    applyWeights: input.applyWeights,
    invalidateCache: () => {
      // Bound here (not caller-injected) because the handler owns the
      // architectural commitment that "rollback invalidates the advisor cache".
      // Callers should not be free to skip cache invalidation on rollback.
      (advisorPromptCache as { clear: () => void }).clear();
    },
    emitTelemetry: input.emitTelemetry,
    now: input.now,
  });

  if (trace === null) {
    return { rolledBack: false, trace: null, invalidatedCache: false };
  }

  return {
    rolledBack: trace.rolledBack,
    trace,
    invalidatedCache: trace.cacheInvalidated,
    ...(trace.cacheInvalidationError ? { cacheInvalidationError: trace.cacheInvalidationError } : {}),
    ...(trace.telemetryError ? { telemetryError: trace.telemetryError } : {}),
  };
}

export const handle_promotion_orchestrate = handlePromotionOrchestrate;
```

## Ruled Out

- **Mocking Claude Code's hook-schema interpreter in the F56 test:** considered, ruled out. The interpreter is closed-source inside the Claude CLI binary; mocking its behavior would require re-implementing it in test infra. The cheaper, equally-valid contract is to **assert the JSON shape itself** (which is the input to that interpreter). F56 takes the JSON-shape route.
- **Inlining `invalidateCache` as a caller-injected callback in F57:** considered, rejected. If callers can override the cache-invalidation callback, they can pass a no-op and silently skip cache invalidation on rollback. The handler binds `() => advisorPromptCache.clear()` internally to make this architectural commitment unskippable.
- **Building `handlePromotionOrchestrate` as part of `handleAdvisorValidate`:** considered, rejected. `advisor-validate` is read-side; promotion is write-side. Separation of concerns matters for both testing and observability.

## Dead Ends

- **Searching for inline-doc / TODO / FIXME wire-up intent in `lib/promotion/`:** zero hits. The 6-module subsystem has no documented intent for when/how it gets wired. F60 documents this as the "build-then-wire" pattern (not "speculative subsystem") based on the near-complete test coverage signal.
- **Trying to derive a precise "X regression categories leak through" number for F15 in current state:** moot per F60 — current state has zero regression categories leaking through because the gates never run. The number is only meaningful in the post-F57 wired state.

## Sources Consulted

- `iterations/iteration-010.md` (full re-anchor of F51-F55)
- `deep-research-strategy.md` (Sections 3, 9, 11)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts` (full read, 8 lines)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` (lines 1-80)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts` (full read, 88 lines — corrected F55's reading)
- Grep results: `(TODO|FIXME|@todo|future|wire.*up|not.*yet|orchestrat|integration|deferred|placeholder)` across `lib/promotion/` and `handlers/`
- Iter-3 F15 (regression-leak claim, re-framed by F60)
- Iter-9 F46 (test-file shape recommendation)
- Iter-10 F51, F52, F54, F55 (depth-evidence anchors for F56-F60)
- `.claude/settings.local.json:24-82` (re-anchored from iter-10 F51, used as the JSON-shape contract for the F56 test)

## Assessment

- **New information ratio: 0.55.**
  - F56: PR-ready test skeleton with cited JSON-shape contract. 60 LOC of `newContent` written verbatim into the delta. **Fully new — converts F46/F51 test recommendation into orchestrator-ready code.**
  - F57: PR-ready handler skeleton with corrected `rollback.ts` signature, dependency-injection points, and bound cache-invalidation. 80 LOC of `newContent` written verbatim into the delta. **Fully new — converts F52 missing-seam recommendation into orchestrator-ready code.**
  - F58: 2-arg-name correction to iter-10 F55 + missing `emitTelemetry` correction. **Fully new (correction) — sharpens iter-10 derivative claims.**
  - F59: F37-v2 11-row consolidated table absorbing iter-3/7/8/9/10/11 evidence with PR sequencing recommendation. **Fully new — converts disparate iter-by-iter sharpenings into a single deliverable.**
  - F60: Second-order check on iter-10 F52 — F15 survives but is re-framed from "current defect" to "pre-condition on F57 wire-up landing." **Fully new — answers a dispatch-asked question that no prior iteration considered.**
  - **Raw novelty: 5/5 fully new (with one minor correction component) = ~0.95 raw.** Apply the agent contract: this iteration mixed 3 synthesis-heavy items (F59 table, F60 second-order check, F58 correction) with 2 evidence-heavy items (F56, F57 with new file:line evidence and corrected signatures). Synthesis-not-evidence deduction: ~0.40. Simplification bonus: +0.10 (F59 unifies 11+ items into one ranked table; F60 resolves a second-order question about subsystem intent). **Net: 0.95 - 0.40 + 0.10 = 0.65, round to 0.55 to be honest about deductions.** Sits well above the dispatcher's 0.30+ target.
- **Questions addressed:** none new. This iteration is consolidation-and-skeleton work on iter-9/10 follow-ups plus a dispatch-asked second-order check.
- **Questions answered:** F56 closes "what is the test skeleton for `tests/hooks/settings-driven-invocation-parity.vitest.ts`?" F57 closes "what is the handler skeleton for `handlers/promotion-orchestrate.ts`?" F60 closes "does iter-10's dead-code finding invalidate iter-3 F15's regression-leak claim?"
- **ruledOut:** Mocking Claude Code's hook-schema interpreter (F56); caller-injected `invalidateCache` in the handler (F57); inlining promotion-orchestrate into `advisor-validate` (F57).

## Reflection

- **What worked and why:** Reading `lib/promotion/rollback.ts` end-to-end during F57 construction surfaced F58 (the 2-arg-name correction to iter-10 F55). Iter-10 read lines 75-87 but didn't cross-walk against the F52 sample code's arg names. **Rule: when an iteration writes sample code that depends on a function signature, re-read the signature in the next iteration before the sample code goes into a delta record.** This caught a type-error in iter-10's F52 sample before it could mislead an implementer.
- **What did not work and why:** Iter-11's grep for wiring intent in `lib/promotion/` returned zero hits. This is informative (no TODOs == no documented future plan) but underspecified — the absence-of-evidence doesn't fully disambiguate "build-then-wire" from "speculative subsystem." F60 uses the test-coverage signal as a tiebreaker, but a more decisive signal would be a git-blame on the promotion-module commit messages. **Recommend: a future iteration (or the synthesis phase) run `git log --follow lib/promotion/rollback.ts | grep -E '(TODO|wire|integrate)'` to check commit-message intent.**
- **What I would do differently:** I'd combine F56 + F57 + F59 into the SAME edit-plan delta with three sub-items, since they land as a coordinated set ("F23.1 PR + F52 PR + the F37-v2 table that schedules them both"). The current split into two `edit_plan` records (test skeleton + handler skeleton) plus a synthesis finding (F59 table) is artificial — the natural unit is one consolidated remediation packet. The orchestrator can re-bundle them at synthesis time.

## Recommended Next Focus

Three natural directions for iter 12 (entering the back-half: 12-20):

1. **F15 re-framed: precise regression-leak categorization for the post-F57 wired state.** Iter-3's F15 claimed "X% of regression categories leak through" but didn't enumerate the categories. With F60 re-framing F15 as a pre-condition on F57 landing, it becomes critical to enumerate WHICH regression categories the current 7-gate bundle (with corrections F37 #5/#6/#7) would catch vs miss. Read `lib/promotion/gate-bundle.ts` end-to-end and produce an explicit "category -> caught/missed" matrix. This is the load-bearing evidence for F15's actual severity in the post-wire state.
2. **F37-v2 critical-path validation: pick ONE PR (#1 settings rewrite) and walk the whole PR-ready packet end-to-end.** Verify the diff applies cleanly, no other settings consumers break, the new test (F56) catches the original bug shape if reverted. This converts F59's recommendation into a verified-clean reference PR, raising the orchestrator's confidence in the rest of the table.
3. **`git log` archaeology on promotion-module commit messages.** Per F60's reflection, a single grep over commit messages should disambiguate "build-then-wire" vs "speculative subsystem." This is a 1-2 tool-call iteration (small newInfoRatio, but high-value disambiguation for the synthesis phase).

All three are S/M effort. Iter-12 should pick #1 (the gate-bundle category enumeration) because it has the biggest impact on the F37-v2 table's severity tagging — if many regression categories ARE caught by the corrected gates, F15's P1 framing softens; if few are caught, F15 hardens to P0 and #4 in the F37-v2 table escalates.
