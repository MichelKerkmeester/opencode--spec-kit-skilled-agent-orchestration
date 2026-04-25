# Iteration 3: RQ-04 Depth (close) + RQ-07 Groundwork (close at depth)

## Focus

Complete RQ-04 depth with reads of the full promotion machinery (shadow-cycle
body + rollback + weight-delta-cap), and open RQ-07 via a grep matrix across
the 4 tool surfaces to catalog stale-state messaging divergence.

1. **RQ-04 depth:** Are the 12 gates + shadow-cycle + rollback + weight-delta-
   cap collectively sufficient to catch regressions — or does booleanization
   (F14) + magnitude-blind two-cycle accumulator (F13) leak specific
   regression categories through the net?
2. **RQ-07 close:** Map every stale-state word across `handlers/status.ts`,
   `handlers/context.ts`, `handlers/query.ts`, `lib/startup-brief.ts`.
   Catalog the vocabulary divergence and any silent degraded-state paths.

## Actions Taken

1. Read the three outstanding promotion files in full:
   - `promotion/shadow-cycle.ts` (204 lines)
   - `promotion/rollback.ts` (88 lines)
   - `promotion/weight-delta-cap.ts` (73 lines)
2. Ran a grep matrix across 4 code-graph tool surfaces for the state vocabulary
   `'live'|'stale'|'absent'|'unavailable'|'fallback'|'ready'|'empty'|'missing'
   |'blocked'|fallbackMode|freshness|degraded`.
3. Discovered handler filenames differ from the dispatch-context guess:
   actual paths are `handlers/status.ts` (63 LOC), `handlers/context.ts`
   (280 LOC), `handlers/query.ts` (1104 LOC), `lib/startup-brief.ts` (333
   LOC). Not `handlers/code-graph-*.ts`.
4. Read `lib/readiness-contract.ts` (225 lines) in full — the mapper that
   translates `GraphFreshness` across three vocabularies.
5. Cross-checked with `grep "type GraphFreshness"` across `code-graph/lib/` —
   found **two competing `GraphFreshness` type aliases** in the same
   package (structural finding, see F17).

## Findings

### F15 — RQ-04: `shadow-cycle.ts` DOES compute `passesShadowGate` with a threshold, but the threshold defaults to `liveAccuracy` — not an absolute floor

Depth read of `shadow-cycle.ts:182-184` resolves the shape of the
shadow-cycle gate:

```
passesShadowGate = candidateAccuracy >= (minimumAccuracy ?? liveAccuracy)
  && goldNoneFalseFire <= (maximumGoldNoneFalseFire ?? +Infinity)
```

- **Default `minimumAccuracy` is `liveAccuracy`** — the candidate passes if
  it matches or beats live. There is no absolute floor (e.g., "must be
  >=72.5% to ship at all"); the absolute floor lives separately in the
  12-gate bundle (`stratified-holdout-top1 >= 0.725`, iter 1 F36).
- **Default `maximumGoldNoneFalseFire` is `+Infinity`** — if the caller
  forgets to pass it, the gold-None false-fire check is silently disabled
  for this cycle. The 12-gate bundle does enforce
  `gold-none-false-fire-no-increase <= baseline` (iter 1 F38), so the
  baseline floor still applies — but the per-cycle override is absent by
  default. The gate bundle catches it, the shadow cycle does not.
- **`sideEffectFree: true` is hardcoded** at `shadow-cycle.ts:198` — the
  `ShadowCycleSideEffectAudit` interface at lines 26-30 exposes hooks for
  `sqliteWrite`, `generationBump`, `cacheInvalidation`, but the
  `runShadowCycle` function accepts them via options and **never invokes
  them or checks whether they fired**. The audit surface is structural-only
  — it declares the audit intent but does not enforce the no-side-effect
  invariant.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts:140-200`]

### F16 — RQ-04 close: Three concrete regression categories slip through the full promotion bundle

Cross-referencing iter 1 F35-F47 (12 gates) + iter 2 F13-F14 (boolean gates
+ magnitude-blind two-cycle) + this iter's F15 (shadow-cycle threshold) +
reads of `rollback.ts` and `weight-delta-cap.ts`:

**Category A — Micro-perturbations with correlated failures:**
- `MAX_PROMOTION_WEIGHT_DELTA = 0.05` (`weight-delta-cap.ts:7`) caps
  per-lane change at 5 percentage points per promotion.
- But the cap is **per-lane independent** — there is no L1/L2 norm check
  on the total vector change. A promotion that moves 4 lanes by 0.049
  each (total L1 delta = 0.196, L2 = 0.098) all passes the cap
  `enforceWeightDeltaCap` (lines 42-49) because each individual lane's
  delta is below 0.05.
- Two-cycle accumulator (iter 2 F13) counts `passed` as boolean — so two
  cycles each with `deltaVsLive = +0.001` pass identically to two cycles
  with `deltaVsLive = +0.10`.
- **Leakage path:** a correlated four-lane micro-perturbation that
  cumulatively shifts the weight vector by L2=0.098 while each lane is
  <0.05 can accumulate across successive promotions. 20 such promotions
  drift the vector by L2~2.0 with zero individual cap violations and all
  individual shadow cycles marginally passing.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts:7,42-49` + iter 2 F13]

**Category B — Oscillating skills (high within-cycle variance, marginal
mean):**
- `runShadowCycle` computes `candidateAccuracy = correctPrompts/totalPrompts`
  (a single scalar). There is **no variance metric per-cycle** — no std
  dev, no bootstrap, no per-skill accuracy breakdown in the returned
  `ShadowCycleResult` fields.
- A candidate that flips correctness on 10% of prompts cycle-over-cycle
  (high variance) but happens to land above `liveAccuracy` on two
  consecutive evaluation runs passes the two-cycle rule identically to a
  stable candidate that consistently beats live by 1%.
- The `perPromptMatches` array IS returned — the data is there — but
  `two-cycle-requirement.consecutivePasses()` (iter 2 F13) only reads
  `entry.passed`, not the per-prompt outcomes.
- **Leakage path:** Skills with high within-cycle instability are
  indistinguishable from stable skills at the promotion gate. A noisy
  evaluation environment (flaky test corpus, seed-dependent tiebreaks)
  can trip two-cycle pass purely by chance.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts:173-200` +
   `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:7-41`]

**Category C — Silent rollback cache-invalidation failure:**
- `rollback.ts:40-48` wraps `invalidateCache` in `try/catch` so a cache-
  invalidation throw does NOT block the rollback — `cacheInvalidated`
  flips to `false` and the error is stashed in `cacheInvalidationError`.
- The returned `RollbackTrace.rolledBack` is **always `true`** regardless
  of whether cache invalidation succeeded (`rollback.ts:63-72`).
- **Leakage path:** A rollback that restores the previous weight vector
  but fails to invalidate the in-process freshness/scoring cache will
  continue to serve results scored under the rolled-back weights until
  the cache TTL expires. Callers that read `rolledBack === true` treat
  the rollback as complete; the cache-invalidation error is reported in
  a side channel (`cacheInvalidationError`) that has no guaranteed
  upstream consumer. Combined with iter 2 F11 INV-F5-V2 (generation bump
  without fan-out is discipline-only), this is a second route by which
  stale cache can serve post-rollback.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:40-72`]

### F17 — RQ-07 close: There are THREE independent stale-state vocabularies in the code-graph package

This is the single largest RQ-07 finding this iteration and is *structural*,
not a wiring bug. Grep matrix + type-alias audit reveals:

**Vocabulary V1 — `GraphFreshness` (ensure-ready.ts):**
```
export type GraphFreshness = 'fresh' | 'stale' | 'empty';
```
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:22`]

**Vocabulary V2 — `GraphFreshness` (ops-hardening.ts) — DIFFERENT type, SAME name:**
```
export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
```
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts:7`]

**Vocabulary V3 — `StartupBriefResult.graphState`:**
```
graphState: 'ready' | 'stale' | 'empty' | 'missing';
```
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:43`]

**Vocabulary V4 — `StructuralReadiness` (canonical, ops-hardening):**
```
'ready' | 'stale' | 'missing'
```
Re-exported from `readiness-contract.ts:43`.

**Vocabulary V5 — `SharedPayloadTrustState` (subset projection):**
```
'live' | 'stale' | 'absent' (subset of canonical 8-state)
```
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:103-116`]

**Divergences:**
- Two type aliases named `GraphFreshness` exist in the same package with
  different value sets ({fresh,stale,empty} vs {fresh,stale,empty,error}).
  TypeScript module resolution keeps them isolated, but any refactor that
  unifies imports could produce silent widening/narrowing. **This is a
  structural landmine.**
- `ensure-ready.GraphFreshness` has no `'error'` case; `ops-hardening
  .GraphFreshness` does. Consumers going through
  `readiness-contract.canonicalReadinessFromFreshness` call
  `assertNever(freshness, 'graph-freshness')` on the default branch —
  which means if an `'error'`-valued `GraphFreshness` from ops-hardening
  ever flowed into that helper, `assertNever` would throw at runtime.
- `startup-brief.graphState` has `'missing'` as a distinct state from
  `'empty'`. Inspection of `buildGraphOutline` (`startup-brief.ts:208-247`)
  reveals the distinction: `'empty'` = totalFiles<=0 or totalNodes<=0 (db
  is queryable but has no content); `'missing'` = `getStats()` or
  `getGraphFreshness()` threw (db is not queryable). Yet
  `trustStateFromGraphState` (used at line 313) must map 4 values to a
  trust state, but it was not visible in the grep because it's imported
  from `'./format-highlights.js'` (line 13) and I did not read that
  file. **Verified gap:** I do not have evidence whether that mapper
  handles `'missing'` or routes it to `'absent'`/`'unavailable'`/throws.

### F18 — RQ-07 close: Four concrete stale-state messaging divergences across the 4 tool surfaces

**Surface S1 — `handlers/status.ts` (63 LOC):**
- Returns the raw `GraphFreshness` value (3-value set: fresh/stale/empty)
  at `status.ts:14,35`.
- Maps through `buildReadinessBlock` which emits both `canonicalReadiness`
  ({ready|stale|missing}) and `trustState` ({live|stale|absent}).
- Human-readable `reason` field switches on `'fresh'`/`'stale'`/else —
  the else branch says "graph is missing" even though the freshness enum
  says `'empty'`. **Minor divergence:** the `reason` string uses the V4
  vocabulary while the `freshness` field uses the V1 vocabulary in the
  same response.
- No mention of `'unavailable'`, `'fallback'`, `'blocked'`, or `'degraded'`.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:11-63`]

**Surface S2 — `handlers/context.ts` (280 LOC):**
- Uses `freshness: 'empty' as const` as the default-initialized readiness
  state before `ensureCodeGraphReady` is called (lines 110, 127). If the
  readiness check throws, the fallback is `'empty'` with
  `reason: 'readiness_check_crashed'`.
- Emits `status: 'blocked'` **and** `degraded: true` on the blocked-read
  path (lines 141, 146) for `code_graph_full_scan_required`.
- **Unique path:** When `readinessCheckCrashed === true`, it overrides the
  `trustState` to `'unavailable' as const` AFTER `buildReadinessBlock`
  already produced a `live|stale|absent` value (lines 224-229). This is a
  **manual type widening past the canonical subset** — `buildReadinessBlock`
  only knows 3 trust states; context.ts injects a 4th ad-hoc. Consumers
  that switch on `trustState` must handle the 4-value union here but
  only the 3-value subset elsewhere. **Silent degraded-state path.**
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:108-229`]

**Surface S3 — `handlers/query.ts` (1104 LOC):**
- Uses `freshness: 'empty' as const` as default (line 760), same pattern
  as S2.
- Emits `status: 'blocked'` + `degraded: true` + `graphAnswersOmitted:
  true` (lines 633,639,640) for the full-scan-required path. Also adds
  `blockReason: 'full_scan_required'` as a structured enum key that S2
  also emits verbatim. S1 (status handler) does NOT use `blockReason` at
  all — it just returns a human `reason` string.
- **No `'unavailable'` trust-state injection** — unlike S2, query.ts does
  NOT have a separate readiness-crash branch that forces
  `trustState: 'unavailable'`. If readiness throws in query.ts it goes to
  `status: 'error'` with a `code_graph_not_ready:` message (query.ts:774-
  780), NOT the same path as S2's crash branch. **Asymmetry:** S2 serves
  a `status: 'blocked'` payload with `trustState: 'unavailable'` on
  crash; S3 serves a `status: 'error'` payload with no trustState field
  at all.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:623-780`]

**Surface S4 — `lib/startup-brief.ts` (333 LOC):**
- Uses V3 `graphState: 'ready'|'stale'|'empty'|'missing'` (line 43).
- Maps `getGraphFreshness()` ({fresh|stale|empty}) to `graphState` via:
  - `freshness === 'stale'` → `'stale'`
  - else if `totalFiles<=0 || totalNodes<=0` → `'empty'`
  - else → `'ready'`
  - On exception → `'missing'` (line 247)
  [`startup-brief.ts:186-247`]
- Sends `graphState` through `trustStateFromGraphState(...)` (line 313) to
  produce a trust state for the shared-payload envelope. The mapper is
  imported from `./format-highlights.js` — NOT read this iteration,
  explicit gap.
- Human-readable stale line (`startup-brief.ts:223-224`): "Freshness:
  stale — first structural read may trigger bounded inline refresh or
  recommend code_graph_scan." This is the ONLY surface that surfaces the
  stale-triggers-inline-refresh behavior to the user. The three handler
  surfaces (S1/S2/S3) do NOT mention inline refresh in their messages.

**Summary of divergences (catalogued):**

| Axis                        | S1 status.ts     | S2 context.ts              | S3 query.ts                | S4 startup-brief.ts |
| --------------------------- | ---------------- | -------------------------- | -------------------------- | ------------------- |
| Primary state enum          | V1 {fresh/stale/empty}  | V1 + V4 + V5                | V1 + V4 + V5                | V3 {ready/stale/empty/missing} |
| Emits `trustState`          | Yes (V5, 3-val)  | Yes (V5 **OR** `'unavailable'`) | No (query.ts line 623-645 path omits) | Indirect via `trustStateFromGraphState` |
| Emits `canonicalReadiness`  | Yes              | Yes                        | Yes (via buildReadinessBlock) | No (does not use readiness-contract) |
| Emits `'blocked'` status    | No               | Yes                        | Yes                        | No                  |
| Emits `degraded: true`      | No               | Yes (paired w/ blocked)    | Yes (paired w/ blocked)    | No                  |
| Emits `blockReason` enum    | No               | Yes                        | Yes                        | No                  |
| Surfaces inline-refresh UX  | No               | No                         | No                         | **Yes (only S4)**    |
| Readiness-crash trust       | N/A (no try/catch around freshness) | `'unavailable'` override | `'error'` status, no trust  | `'missing'` graphState |
| Default-init freshness      | N/A              | `'empty'`                  | `'empty'`                  | N/A                 |

**Verdict for RQ-07:** Stale-state messaging is NOT consistent across the
4 tool surfaces. There are at least 4 concrete divergences (the 4 axes
above with asymmetric answers), at least 2 silent degraded paths (S2's
`'unavailable'` injection bypassing `buildReadinessBlock`'s canonical
3-state subset; S3's crash-to-error transition that drops trust state
entirely), and 5 distinct state vocabularies (V1-V5) in circulation —
two of which share the same type name `GraphFreshness` with different
value sets.

## Questions Answered

- **RQ-04 (close):** Answered. The 12 gates + two-cycle + shadow-cycle +
  weight-delta-cap + rollback ensemble has three documented leakage
  categories (F16 Cat A/B/C): correlated micro-perturbations through the
  per-lane-independent cap, oscillating skills through the variance-blind
  scalar `candidateAccuracy`, and silent post-rollback cache staleness
  through the try/catch around `invalidateCache`. The `ShadowCycleSideEffectAudit`
  interface is structural-only (declares intent, never invoked, F15). The
  bundle has real rigor (numeric thresholds on 9/12 gates, weight-delta
  cap, two-cycle rule, rollback telemetry) but three corners are open.
- **RQ-07 (close):** Answered. Five competing state vocabularies (V1-V5,
  F17), two of them sharing the type name `GraphFreshness` with different
  value sets. Four tool surfaces diverge on at least 9 axes (F18
  summary table). Two silent degraded-state paths identified:
  (1) S2 context.ts manually injects `trustState: 'unavailable'` past the
  canonical 3-state subset on readiness-crash; (2) S3 query.ts drops the
  trust-state field entirely on readiness-throw (converts to
  `status: 'error'`). Only S4 startup-brief.ts surfaces the
  inline-refresh user-facing behavior.

## Ruled Out

- **Not a single-source fix for RQ-07:** Because three of the five
  vocabularies are **type-level canonical** (V1 ensure-ready, V2 ops-
  hardening, V3 startup-brief) and imported by different subsystems,
  unifying the vocabulary is not a string-replace job — it requires
  reconciling `ensure-ready.GraphFreshness` with `ops-hardening
  .GraphFreshness` (both named identically) WITHOUT breaking
  `assertNever` exhaustiveness checks in `readiness-contract.ts`. Ruled
  out: "just rename V2 to `OpsGraphFreshness`" — that's a naming fix
  and doesn't address the V1/V3/V4/V5 fan-out.
- **Not a flag/config issue for RQ-04 Cat A:** The per-lane-independent
  cap is structural (`PROMOTION_WEIGHT_KEYS.map(...).filter(...)`) — there
  is no norm-based threshold hiding behind a config flag.

## Dead Ends

- None this iteration. Every action produced evidence. The one explicit
  gap (`trustStateFromGraphState` in format-highlights.js not read) is a
  known follow-up, not a dead end.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts:1-204`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:1-88`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts:1-73`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:1-63`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:108-229`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:620-780`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:43-333`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:1-225`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:22` (via grep)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts:7` (via grep)

## Assessment

- New information ratio: **0.84** — 8/10 findings genuinely new (F15, F16
  Cat A, F16 Cat B, F16 Cat C, F17 two-`GraphFreshness`-aliases, F17
  five-vocabulary catalog, F18 4-surface divergence matrix, F18
  inline-refresh S4-only UX); 2 are strong extensions of iter 1/2
  findings (shadow-cycle threshold formula, rollback structure).
- Questions addressed: **RQ-04 (closed at depth), RQ-07 (closed at depth)**.
- Questions answered (via registry IDs): `question-4-rq-04-is-the-7-gate-promotion-bundle-actually-rigorous-enough-to-block-regressio`,
  `question-7-rq-07-how-consistent-is-stale-state-messaging-across-the-4-tool-surfaces-code-gr`.

## Reflection

- **What worked and why:** Frontloading the grep matrix (iter 2's
  reflection adjustment) was exactly right — the single command
  `grep -nE "'live'|'stale'|..." 4-files` produced the divergence
  evidence in one pass and saved two sequential read cycles. Then reading
  ONLY the regions grep flagged (status.ts full because it's 63 LOC;
  context.ts 108-229 for the crash-path; query.ts 620-780 for the
  blocked-path and readiness-throw) kept the read budget tight. 4
  research actions total (3 file reads in parallel + 1 grep matrix + 1
  type-alias audit), well under the 5-action target.
- **What did not work and why:** The original dispatch-context file names
  (`handlers/code-graph-status.ts`, etc.) were wrong — actual files are
  `handlers/status.ts`. Caught by `ls -la handlers/` but cost one tool
  call. Root cause: dispatch context was authored without a
  directory-listing verification step; preferred fix is for the reducer
  to emit actual paths, not conjectured paths.
- **What I would do differently:** On the next iteration, if a dispatch
  context lists specific paths, confirm them with a single `ls` before
  reading. That would have replaced two tool calls with one. For RQ-07
  completion, I should also read `format-highlights.ts` to confirm the
  `trustStateFromGraphState` mapper handles all 4 graphState values —
  that's a 50-LOC read that would close the last explicit gap in F17.

## Recommended Next Focus

**Iteration 4 focus:** Pivot to measurement-heavy RQs now that the
structural baseline is complete for RQ-01, RQ-03, RQ-04, and RQ-07.
Three attractive options; in order of marginal value:

1. **RQ-08 (hook brief signal-to-noise)** — read
   `skill-advisor/lib/skill-advisor-brief.ts` in full and catalog which
   fields are actually consumed by downstream runtimes. This is a
   contained file-read iteration (like iter 2) with a high chance of
   finding dead fields.
2. **RQ-10 (cross-runtime parity)** — grep all 5 runtimes (Claude, Codex,
   Gemini, Copilot, OpenCode plugin) for skill-advisor brief-consumer
   hooks. This is a pure evidence-gathering iteration and the results map
   directly to remediation phases in the spec packet.
3. **RQ-02 (scorer bias)** — requires `eval_run_ablation` and
   `eval_reporting_dashboard` MCP tools (not file reads). Better suited
   to a later iteration when we have explicit ablation intent, because
   running an ablation costs one MCP call with a long latency tail.

**Also close the F17 gap:** read `code-graph/lib/format-highlights.ts`
(~100 LOC estimated) to confirm `trustStateFromGraphState` mapping for
all 4 `graphState` values — that's a 1-tool-call tail-end of iter 3's
RQ-07 that can be folded into iter 4's research actions.
