# Iteration 2: RQ-01 Depth, RQ-03 Depth, RQ-04 Groundwork

## Focus

Drill into the breadth findings from iter 1 with depth reads of the actual
parser + freshness + promotion machinery:

1. **RQ-01 depth:** Does `tree-sitter-parser.ts` already have an AST-based
   `call_expression` query that is simply not wired to the CALLS emitter, or is
   the AST path genuinely unable to produce CALLS edges? If the former, RQ-01
   has a low-cost remediation; if the latter, adding `call_expression` queries
   is a net-new remediation track.
2. **RQ-03 depth:** With iter 1's invariants INV-F1..INV-F5 catalogued at
   breadth, verify the actual concurrency/lock story by reading the real
   freshness primitives (`trust-state.ts`, `cache-invalidation.ts`) plus
   `promotion/semantic-lock.ts`. Confirm whether the 5th state is
   `unavailable` (not `fallback`) and whether any invariant is violated under
   concurrent writes.
3. **RQ-04 groundwork:** Read `two-cycle-requirement.ts` to confirm the
   positive-shadow-cycle rule, and verify the booleanization claim from iter 1
   against the gate-bundle types (are the evidence-quality gates actually
   typed as `boolean`?).

## Actions Taken

1. Listed and confirmed presence/sizes of the five target files:
   `tree-sitter-parser.ts` (24,329 B), `freshness/trust-state.ts` (2,457 B),
   `freshness/cache-invalidation.ts` (1,731 B),
   `promotion/semantic-lock.ts` (1,549 B),
   `promotion/two-cycle-requirement.ts` (1,846 B).
2. Read `tree-sitter-parser.ts` in full (703 lines, covering `walkAST`,
   `visit`, `extractEdges` call, parse orchestration).
3. Read `freshness/trust-state.ts` (82 lines), `freshness/cache-invalidation.ts`
   (49 lines), `promotion/semantic-lock.ts` (40 lines),
   `promotion/two-cycle-requirement.ts` (51 lines).
4. Cross-checked via grep:
   - `call_expression` / `CALLS` in `tree-sitter-parser.ts` (0 matches outside
     comments — the AST walk never captures call sites).
   - `ambiguityStable` / `stuffingRejected` / `derivedLaneAttributionComplete`
     typed as `readonly boolean` in `gate-bundle.ts:49-56`.
   - Lock primitives (`lock|mutex|concurrent|acquire|release`) in
     `freshness/rebuild-from-source.ts` (0 matches).
   - `delta` and `deltaVsLive` in `promotion/shadow-cycle.ts:124-189` for the
     two-cycle scoring path.

## Findings

### F8 — RQ-01 depth: AST path has NO `call_expression` capture at all

This is the single biggest RQ-01 finding this iteration — confirms F2 from
iter 1 is structural, not a wiring bug.

- `tree-sitter-parser.ts` exports `TreeSitterParser`. Its `walkAST(...)` emits
  `RawCapture[]` with `kind ∈ { 'function' | 'method' | 'class' | 'interface'
  | 'type_alias' | 'enum' | 'import' | 'export' | 'variable' | 'parameter' }`
  — observe all call sites of `captures.push(...)` in the file.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:350-358,416-424,436-445,451-460,520-533,555-566`]
- There is **no `call_expression` branch** in `visit(...)` and **no capture
  `kind` for call sites**. Grep for `call_expression` returns 0 hits; grep for
  `'call'` returns 0 hits in capture-emitting paths (only in error-string
  comments on lines 617, 636).
  [SOURCE: grep `call_expression` and `CALLS` against tree-sitter-parser.ts]
- `capturesToNodes` + `extractEdges` are imported from
  `structural-indexer.ts` (the detector module), which is where the regex
  CALLS pass runs on captured callable bodies. Since tree-sitter captures no
  call sites, `extractEdges` has no AST evidence to draw from for CALLS —
  the regex fallback is the ONLY source of CALLS edges regardless of parser
  backend.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:16,645-648`]
- **Implication:** The iter 1 hypothesis "tree-sitter queries are defined but
  bypassed" is FALSE. There is no `call_expression` query/capture at the AST
  level at all. Remediation is net-new: add a `'call'` `RawCapture.kind`,
  emit one per `call_expression` node in `walkAST`, and consume from
  `extractEdges` instead of regex-scanning bodies. This is a contained change
  (one new visit branch + one new extractor branch) but it IS net-new code,
  not a wiring fix.

### F9 — Parser backend enum exists but has no effect on CALLS provenance

- `TreeSitterParser.parse(...)` tags the returned `detectorProvenance` via
  `detectorProvenanceFromParserBackend('treesitter')`
  [`tree-sitter-parser.ts:614,647,660,672`]. So for TS/JS/Python/Bash files
  parsed by tree-sitter, ALL edges inherit `'treesitter'` base provenance.
- BUT from iter 1 F2: the CALLS emission path at
  `structural-indexer.ts:950-981` hard-overrides to
  `detectorProvenance: 'heuristic'` + `evidenceClass: 'INFERRED'` regardless
  of the parser backend.
- So: even when the tree-sitter backend is active, CALLS edges appear with
  `'heuristic'` provenance. A consumer that filters on provenance (e.g. a
  scorer lane that trusts only `'ast'`/`'treesitter'` edges) will discard
  100% of CALLS edges even on successful tree-sitter parses.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:614-648`
   + iter 1 F2 cross-ref]

### F10 — RQ-03 depth: 5th state is `'unavailable'` and it short-circuits ALL other checks

iter 1 F4 called this out at breadth. Depth read confirms the precise state
machine:

- `createTrustState(input)` branches in strict priority order
  [`trust-state.ts:29-65`]:
  1. `!input.daemonAvailable` → `'unavailable'` (reason defaults
     `'DAEMON_UNAVAILABLE'`)
  2. else if `!hasSources || !hasArtifact` → `'absent'` (reason
     `'SKILL_GRAPH_ABSENT'` or `'SKILL_SOURCES_ABSENT'`)
  3. else if `sourceChanged` → `'stale'` (reason
     `'SOURCE_NEWER_THAN_SKILL_GRAPH'`)
  4. else → `'live'` with `lastLiveAt = checkedAt`
- `isReaderUsable(state)` [`trust-state.ts:79-81`] returns `true` for
  `'live'` AND `'stale'` — so `'stale'` is still consumed by readers, but
  `'absent'` and `'unavailable'` gate the reader entirely.
- `failOpenTrustState(reason, generation = 0)` is the emergency path — it
  calls `createTrustState` with `daemonAvailable: false`, forcing
  `'unavailable'` with explicit generation 0. This is the "fail open" route
  used when rebuild fails catastrophically.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts:26-82`]
- **Five states confirmed:** `'live' | 'stale' | 'absent' | 'unavailable'`
  (the type alias) plus the recovered-generation downgrade path from iter 1
  INV-F4 that maps `'live' → 'stale'`. The recovered-downgrade path lives in
  the legacy `freshness.ts` file (not in `trust-state.ts`), so the 5th state
  is better described as "a rewritten-stale with diagnostic
  `GENERATION_COUNTER_RECOVERED`".

### F11 — RQ-03 depth: INV-F5 (cache key invalidation) is EVENT-BASED, not
### key-structural — and has three concrete concurrency exposures

This is a net-new finding. iter 1 INV-F5 claimed "cache keyed on
workspaceRoot + sourceSignature + generation" from `freshness.ts:371-376`.
The actual cache-invalidation primitive is different:

- `cache-invalidation.ts` is an event bus: listeners register via
  `onCacheInvalidation`, and `invalidateSkillGraphCaches(event)` fans the
  event out to ALL listeners with a `generation`, `changedPaths`, and
  `invalidatedAt` timestamp.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts:5-48`]
- The only persisted state is `lastInvalidation: CacheInvalidationEvent | null`
  (a module-level `let`). There is no lock around the `listeners: Set` or
  `lastInvalidation`.
- Listener iteration wraps each callback in `try/catch` so a throwing
  listener does not block the fan-out [`cache-invalidation.ts:30-37`].
- **Three concrete concurrency exposures** (INV-F5-V1 .. INV-F5-V3):
  1. **INV-F5-V1 (race between reader and invalidator):** If a reader snapshots
     the freshness cache AFTER `invalidateSkillGraphCaches` has fired but
     BEFORE its own listener has processed the event, it can observe
     `state='live'` for a generation that has just been invalidated. No
     barrier/lock protects "all listeners drained" before readers see
     invalidation. This is a theoretical torn read; practical impact depends
     on Node.js event loop ordering (single-threaded mitigates it for
     synchronous listeners but async listeners can observe it).
  2. **INV-F5-V2 (generation bump without fan-out):** `generation` lives on the
     event object, not on the invalidator module. Any code path that bumps
     generation (e.g. a rebuild completion in `rebuild-from-source.ts`) must
     explicitly call `invalidateSkillGraphCaches`. A generation bump that
     forgets to invalidate does NOT implicitly invalidate caches — unlike a
     key-structural cache where a different generation means a different key.
     The invariant is thus **discipline-enforced**, not **structurally
     enforced**.
     [Contrast with `freshness.ts:371-376` in-process TTL cache which IS
      keyed structurally — the two caches have different invariants.]
  3. **INV-F5-V3 (listener add during fan-out):** `for (const listener of
     listeners)` iterates a mutable Set. A listener that calls
     `onCacheInvalidation` to register a new listener during dispatch may or
     may not see the new listener in the same event (JS Set iteration order
     MDN-guarantees insertion order but not stability under concurrent
     modification). A new listener added during dispatch may miss the current
     event.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts:14-39`]
- `rebuild-from-source.ts` (95 lines) has NO lock primitives (grep
  `lock|mutex|concurrent|acquire|release` returns 0 hits). Rebuilds rely on
  single-writer discipline at the process level rather than in-code locking.

### F12 — RQ-03 depth: `semantic-lock.ts` is a WEIGHT lock, not a concurrency lock

Important disambiguation: iter 1 planned to read "semantic-lock.ts" expecting
it to cover concurrency on the semantic lane. It does not.

- `assertSemanticLiveWeightLocked(weights, options)` rejects any promotion
  whose `weights.semantic_shadow !== 0` during the `firstPromotionWave`
  (default true) [`semantic-lock.ts:13-31`].
- `requireSemanticLiveWeightLocked` throws on rejection.
- This is a **gate** (a write-time assertion on the promoted weight vector),
  not a runtime lock. It enforces the shadow-only property of the semantic
  lane during the first promotion wave — i.e. "you cannot release the
  semantic-shadow lane to production weight > 0 until the first wave is
  done".
- **RQ-02 implication:** cross-reference with iter 1 F6 —
  `semantic_shadow=0.00` is compile-time locked by a Zod `z.literal(0)` AND
  promotion-time locked by this function. That's two layers of enforcement
  for the same invariant. Loosening the semantic lane requires (a) lifting
  the Zod literal, (b) setting `firstPromotionWave=false` or removing the
  check, AND (c) passing the two-consecutive-shadow-cycle bundle. This is
  deliberately a painful change and worth flagging in RQ-02 remediation.

### F13 — RQ-04 groundwork: two-cycle-requirement is purely binary accumulation

Depth read confirms iter 1 F7 + extends it:

- `REQUIRED_POSITIVE_SHADOW_CYCLES = 2` [`two-cycle-requirement.ts:5`] is a
  module constant. Changing it requires code + promotion.
- `ShadowCycleHistoryEntry` stores `{cycleId, passed, evaluatedAt,
  candidateAccuracy?, deltaVsLive?}` — note `candidateAccuracy` and
  `deltaVsLive` are **optional**. The eligibility check at
  `consecutivePasses(...)` reads ONLY `entry.passed` (a boolean), ignoring
  the optional magnitude fields entirely.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:7-41`]
- **RQ-04 angle:** Two consecutive `passed=true` cycles are sufficient for
  eligibility regardless of margin. A cycle passing with `deltaVsLive=+0.01`
  counts the same as `deltaVsLive=+0.15`. This magnifies the iter 1 F7 concern
  that the bundle itself is booleanized — even the cycle-count layer above
  the bundle is magnitude-blind.
- **Gap from iter 1 F7 corrected:** `shadow-cycle.ts` DOES compute
  `deltaVsLive` [`shadow-cycle.ts:168,189`] and stores it on the entry, but
  `two-cycle-requirement.ts` does not consume it. The data is captured but
  unused for the eligibility gate.

### F14 — RQ-04 confirmed booleanization: three gates are typed `readonly boolean`

Direct confirmation of iter 1 F7's booleanization concern:

- `gate-bundle.ts:49-56` types the paritySlice / adversarial inputs:
  `readonly ambiguityStable: boolean`
  `readonly derivedLaneAttributionComplete: boolean`
  `readonly stuffingRejected: boolean`
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:49-56`]
- The gate evaluator passes each through as the gate's `passed` value
  directly [`gate-bundle.ts:123,129,135`]. No numeric threshold, no scoring.
- The other nine gates DO use numeric thresholds
  (e.g. `full-corpus-top1 ≥ 0.75`, `unknown-count ≤ 10`, latency p95
  caps) — confirmed by grep: `passed: failedGates.length === 0` at
  `gate-bundle.ts:171` is the only boolean conjunction, and each gate's
  `passed` is computed per-gate with numeric comparisons for the quantitative
  ones.
- **Upshot:** 3 of 12 gates (25%) are booleanised at the type level. A
  parity slice that flips from true→false by a single adversarial example
  sinks the whole bundle; a slice that barely passes is indistinguishable
  from a slice that robustly passes. This is genuine rigor exposure for
  RQ-04.

## Questions Answered

- **RQ-01 (depth):** Answered. The tree-sitter AST path has no
  `call_expression` capture or query — CALLS is structurally regex-only, not
  a wiring oversight (F8). Even with `'treesitter'` parser backend tagged,
  CALLS edges always emit `detectorProvenance='heuristic'` +
  `evidenceClass='INFERRED'` (F9). Remediation is net-new: add
  `call_expression` handling in `walkAST` + a new `RawCapture.kind='call'`
  consumed by `extractEdges`.
- **RQ-03 (depth):** Answered. The 5th state is `'unavailable'`, produced by
  the top-priority `!daemonAvailable` branch in `createTrustState` (F10).
  Three concrete concurrency exposures for INV-F5 are documented
  (F11 INV-F5-V1..V3): torn reads between invalidator and reader, generation
  bump without fan-out (discipline-only), and listener-add-during-dispatch.
  `semantic-lock.ts` is a weight-gate, not a concurrency lock (F12).
- **RQ-04 (groundwork):** Partially answered. Two-consecutive-shadow-cycle
  rule confirmed at `REQUIRED_POSITIVE_SHADOW_CYCLES=2` and shown to ignore
  the magnitude data (`deltaVsLive`, `candidateAccuracy`) even though
  `shadow-cycle.ts` captures them (F13). Three of twelve gates are
  booleanized at the type level (F14). Full RQ-04 still needs a pass on
  `shadow-cycle.ts` body + `rollback.ts` + `weight-delta-cap.ts`, deferred.

## Questions Remaining

- **RQ-01 (concrete rate):** What is the measured false-positive rate of the
  regex CALLS detector on real code? Need an AST-ground-truth vs regex
  comparison run on a representative sample (e.g. the `code-graph/` and
  `skill-advisor/` dirs themselves).
- **RQ-02 (scorer bias):** Full lane ablation. Uses the evaluator / ablation
  MCP (`eval_run_ablation`), not a file-read iteration.
- **RQ-03 (runtime proof):** Concurrency exposures in F11 are
  code-evidence-derived. An actual runtime proof (race test) would require
  a test run or harness authorship — deferred.
- **RQ-04 (full rigor):** Read `shadow-cycle.ts` body, `rollback.ts`,
  `weight-delta-cap.ts` to catalog the full promotion machinery + rollback
  semantics. Write up which categories of regression could still slip
  through.
- **RQ-05..RQ-10:** Untouched.

## Next Focus

**Iteration 3 focus:** Close RQ-04 at depth and start RQ-07 (stale-state
messaging consistency across the 4 tool surfaces).

1. **RQ-04 depth:** Read `promotion/shadow-cycle.ts` (full, 7464 B) +
   `promotion/rollback.ts` (3272 B) + `promotion/weight-delta-cap.ts`
   (2495 B). Catalog:
   - What counts as a "shadow cycle"? How is pass/fail decided (returns to
     F13 with the actual scoring function)?
   - Rollback triggers and guarantees — does rollback preserve consistency
     (is the prior weight vector restored atomically)?
   - Weight-delta-cap — maximum perturbation per cycle — what is it and does
     it apply to all lanes including `semantic_shadow`?
2. **RQ-07 groundwork:** Grep for `'stale'` / `'unavailable'` / `'absent'`
   string literals across `code_graph_status`, `code_graph_context`,
   `code_graph_query`, and `startup-brief.ts` to find stale-messaging drift.
   Target one file read per tool surface.
3. **Reducer note:** Iter 1 + iter 2 together establish full architectural
   baseline + depth on the two highest-impact RQs (RQ-01 CALLS provenance,
   RQ-03 freshness concurrency). Iter 3 completes the promotion-bundle
   triad (RQ-04) and opens the UX/messaging dimension (RQ-07). After iter 3,
   plan to pivot to the measurement-heavy RQs (RQ-05 throughput, RQ-06
   latency, RQ-08 brief signal/noise, RQ-09 benchmarks) which will require
   MCP tools (`code_graph_query`, `eval_run_ablation`,
   `eval_reporting_dashboard`) rather than file reads.

### Reflection

- **What worked:** Reading all five small depth files in parallel was the
  right move — each is <3k lines and the triangulation (parser + trust-state
  + cache-invalidation + semantic-lock + two-cycle) gave cross-referenced
  findings (F8/F9 link parser backend to CALLS provenance; F11/F12
  disambiguate two different "lock" meanings).
- **What did not work:** I under-estimated the value of grep
  cross-checks. Running `grep call_expression` against
  `tree-sitter-parser.ts` was the single most load-bearing action this
  iteration (turned a hypothesis into a confirmed structural finding). Next
  iteration should start with the grep matrix, then read only files that
  grep results suggest need deep reads.
- **Adjustment for iter 3:** Frontload the grep matrix on stale/absent/
  unavailable/fallback/fallbackMode across all 4 tool surfaces BEFORE reading
  `shadow-cycle.ts`. That orders the work by decreasing marginal value.
