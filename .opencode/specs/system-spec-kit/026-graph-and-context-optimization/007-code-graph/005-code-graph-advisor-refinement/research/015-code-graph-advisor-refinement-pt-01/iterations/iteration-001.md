# Iteration 1: Architectural Baseline of Code Graph and Skill Advisor

## Focus

Establish the architectural baseline for both systems before diving into specific
research questions. Two objectives:

1. **Code Graph:** map the AST detector → edge-enrichment → persistence → query
   pipeline, and enumerate the current edge-type inventory to answer RQ-01 at
   breadth (edge types supported + one concrete gap).
2. **Skill Advisor:** map the scorer lanes, freshness state machine, and
   promotion bundle, and enumerate the four freshness states plus their
   invariant claims to answer RQ-03 at breadth.

The 3 most load-bearing files per system (by size, centrality, and reach in
the dependency graph, confirmed by code graph startup brief hot-spot data):

| System         | File                                                      | LOC / size | Role                                       |
| -------------- | --------------------------------------------------------- | ---------- | ------------------------------------------ |
| Code Graph     | `lib/structural-indexer.ts`                               | 46,685 B   | AST detection + edge emission              |
| Code Graph     | `lib/code-graph-db.ts`                                    | 26,970 B   | SQLite schema + edge-enrichment summary    |
| Code Graph     | `lib/indexer-types.ts`                                    | 4,189 B    | Canonical type inventory (edges/kinds)     |
| Skill Advisor  | `lib/scorer/fusion.ts`                                    | 14,584 B   | 5-lane weighted fusion + confidence calc   |
| Skill Advisor  | `lib/freshness.ts`                                        | 12,984 B   | 4-state freshness + source signature       |
| Skill Advisor  | `lib/promotion/gate-bundle.ts`                            | 6,524 B    | 12-gate promotion bundle evaluator         |

## Actions Taken

1. Read `research/.../deep-research-config.json` and `deep-research-strategy.md`
   to anchor the iteration.
2. Listed top-level layout of `mcp_server/code-graph/` and
   `mcp_server/skill-advisor/` to map subsystems.
3. Read `code-graph/lib/indexer-types.ts` (full) and
   `code-graph/lib/structural-indexer.ts` (head ~250 lines + edge-emission
   section ~940-1055) to catalogue edge types.
4. Read `skill-advisor/lib/freshness.ts` (full) and
   `skill-advisor/lib/generation.ts` (head) to catalogue freshness states and
   signature invariants.
5. Read `skill-advisor/lib/scorer/fusion.ts` (full),
   `scorer/weights-config.ts` (full), `scorer/lanes/semantic-shadow.ts` (full),
   and `promotion/gate-bundle.ts` (full) to catalogue scorer lanes and
   promotion gates.
6. Ran `grep` across `structural-indexer.ts` and `code-graph-db.ts` to
   cross-check emitted `edgeType` literals against the declared type union and
   to locate the edge-evidence summary classes.

## Findings

### F1 — Canonical edge-type inventory: 10 declared, 10 emitted

The canonical `EdgeType` union is authored in a single place and is fully
emitted by the detector. This is net-new evidence: the startup-brief claim
that edge-enrichment was "direct_call (1.00 coverage)" implied a far thinner
inventory.

- **Declaration (10 types):** `CONTAINS | CALLS | IMPORTS | EXPORTS | EXTENDS |
  IMPLEMENTS | TESTED_BY | DECORATES | OVERRIDES | TYPE_OF`.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:13-17`]
- **Emission sites in structural-indexer.ts** (grep `edgeType: '...'`):
  - `CONTAINS` weight 1.0 → line 886
  - `IMPORTS` weight 1.0 → line 899
  - `EXPORTS` weight 1.0 → line 912
  - `EXTENDS` weight 0.95 → line 926
  - `IMPLEMENTS` weight 0.95 → line 942
  - `CALLS` weight 0.8 → line 975
  - `DECORATES` weight 0.9 → line 997
  - `OVERRIDES` weight 0.9 → line 1019
  - `TYPE_OF` weight 0.85 → line 1046
  - `TESTED_BY` weight 0.6 → line 1357
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` (10 `edgeType:` occurrences, verified via grep)]

### F2 — RQ-01 concrete gap: CALLS edges are regex-inferred, not AST-derived

This is the single biggest correctness exposure in the current detector.

- The CALLS detector (line 950-981 of `structural-indexer.ts`) uses a regex
  `/\b(\w+)\s*\(/g` applied to each callable's line-range body text, with a
  hard-coded skip-list of JS/TS control-flow keywords (`if | for | while |
  switch | catch | return | throw | new | typeof | await | async | function |
  class | const | let | var`).
- Every CALLS edge is emitted with `detectorProvenance: 'heuristic'` and
  `evidenceClass: 'INFERRED'`, regardless of whether tree-sitter or regex is
  the active parser backend for the file. All other edge types (IMPORTS,
  EXPORTS, EXTENDS, IMPLEMENTS, DECORATES, TYPE_OF) use `baseDetectorProvenance`
  (usually `'ast'`) and `evidenceClass: 'EXTRACTED'`.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:950-981`, `indexer-types.ts:19,22`]
- **Concrete failure modes of the regex approach:**
  1. **Type-assertion calls:** `(foo as Bar)(arg)` — the capture group only
     grabs `Bar`, not `foo`.
  2. **Chained calls:** `obj.method1().method2()` — the regex matches `method1`
     and `method2` but the `preferredKinds` lookup is name-only, so any
     unrelated `method1`/`method2` in the same project silently wins.
  3. **Shadowing:** a local `const log = x => ...` inside a function creates
     a CALLS edge to any *other* `log` symbol in the workspace when used.
  4. **Deduped-within-caller-only:** the `seen` set is per-caller-body, so
     repeat calls on the same line to different receivers collapse.

### F3 — Edge-enrichment summary flattens 10 edge types into 5 evidence classes

This explains the known-context "direct_call (1.00 coverage)" puzzle.

- `code-graph-db.ts:38-43` defines `GraphEdgeEvidenceSummaryClass` with only
  five values: `'import' | 'type_reference' | 'test_coverage' |
  'inferred_heuristic' | 'direct_call'`.
- The stored `GraphEdgeEnrichmentSummary` (persisted under metadata key
  `last_graph_edge_enrichment_summary`) records one `edgeEvidenceClass` + a
  single `numericConfidence` per scan — NOT per-edge-type coverage.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:38-48,249-268`]
- The startup brief at `lib/startup-brief.ts:158-161` surfaces this as
  `edge-enrichment=<class> (<confidence>)`, which is what the research-pack
  known-context captured as "direct_call (1.00 coverage)".
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:158-161`]
- **Implication for RQ-09 (benchmark gaps):** there is no per-edge-type
  coverage metric in the persisted schema; you cannot answer "what fraction of
  CALLS edges were AST-derived vs regex-inferred" without joining against
  `code_edges.metadata` JSON at query time.

### F4 — Freshness states: 4 documented, 5 actually produced

This is a direct RQ-03 / RQ-07 finding.

- `AdvisorFreshnessState = AdvisorEnvelopeMetadata['freshness']` is aliased
  from the shared payload envelope (not fully read yet this iteration), but
  the `deriveFreshness` + `unavailableResult` + `degradeRecoveredGeneration`
  functions in `freshness.ts` produce FIVE distinct states:
  `'live' | 'stale' | 'absent' | 'unavailable'` + a "degraded-from-recovered"
  path that rewrites `'live' → 'stale'`.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:242-297,299-325`]
- The research-topic context said "four states (live/stale/absent/fallback)"
  but the code has `live | stale | absent | unavailable` plus `fallbackMode`
  is an ORTHOGONAL field (`'sqlite' | 'json' | 'none'`) — NOT a freshness
  state. This is a documentation/vocabulary drift ripe for RQ-07.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:33-35,55-63`]

### F5 — Freshness invariants (RQ-03 at breadth)

Five invariant claims the freshness machine makes — each is an audit target
for later iterations.

- **INV-F1 (missing-source implies absent):** If any required source is
  missing (skill SKILL.md roots, advisor scripts), the state is ALWAYS
  `'absent'` regardless of whether a stale SQLite exists.
  [`freshness.ts:245-253`]
- **INV-F2 (source newer than SQLite ⇒ stale):** If the source-signature
  hash or `maxSourceMtimeMs` exceeds the SQLite artifact mtime, state is
  `'stale'` (sqlite fallback) even though SQLite is physically present.
  [`freshness.ts:274-294`]
- **INV-F3 (JSON-only fallback ⇒ stale):** When SQLite is absent but JSON
  artifact exists, state is `'stale'` with `fallbackMode='json'` — never
  `'live'`, even if JSON matches the source signature.
  [`freshness.ts:255-264`]
- **INV-F4 (recovered generation ⇒ downgrade live to stale):** If the
  generation counter was recovered (e.g. from crash), any computed `'live'`
  is rewritten to `'stale'` with diagnostic `GENERATION_COUNTER_RECOVERED`.
  [`freshness.ts:319-324,367-368`]
- **INV-F5 (cache keyed on workspaceRoot + sourceSignature + generation):**
  TTL-bounded in-process cache keyed by
  `resolve(workspaceRoot) + sourceSignature + generation`; a generation bump
  (e.g. after rebuild) invalidates cache implicitly.
  [`freshness.ts:371-376`]

### F6 — Scorer is 5-lane fusion with hard-coded weights; semantic lane is a shadow

Critical input for RQ-02 (scorer lane bias).

- **Lanes and weights (authored):**
  `explicit_author=0.45`, `lexical=0.30`, `graph_causal=0.15`,
  `derived_generated=0.10`, `semantic_shadow=0.00`.
  Weights are compile-time literals guarded by a Zod `z.literal(...)` schema,
  so tuning requires a code change + a new promotion cycle.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:8-20,30-36`]
- **`graph_causal` lane is derivative, not primary:** it's computed from the
  union of explicit/lexical/derived matches (`fusion.ts:120-126`), so its
  contribution is correlated with the other live lanes. "Lane diversity" in
  the fusion output is therefore 3-lane effective, not 4-lane (and semantic
  is shadow-only).
- **Confidence is heavily hand-crafted, not learned:**
  `confidenceFor(...)` applies at least 10 branch-specific boosts
  (`readOnlyExplainer`, `readOnlyRouteAllowed`, `derivedDominant + directScore<0.2`,
  `hasDeepResearchCycleIntent + sk-deep-research + liveNormalized>=0.12`,
  `hasTaskIntent + (directScore>=0.18 || liveNormalized>=0.2)`,
  `directScore>=0.65`, `directScore>=0.85`). This is an audit target for
  RQ-02 calibration.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:72-97`]
- **Primary-intent bonuses are hardcoded per-skill** (`primaryIntentBonus`,
  lines 172-205): 12+ explicit regex patterns map to specific skill IDs
  (`mcp-coco-index`, `sk-deep-research`, `sk-deep-review`, `sk-code-review`,
  `system-spec-kit`, `sk-improve-prompt`). Ranks-after-sort are shifted by
  `+0.35..+0.5` / `-0.18..-0.25` based on these string patterns — a second
  scoring pass running AFTER weight fusion. This creates a tight coupling
  between the corpus vocabulary and specific skill IDs.
  [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:172-205,272-280`]

### F7 — Promotion bundle is 12 gates, not 7 as claimed

The research topic known-context referenced a "7-gate promotion bundle with
two consecutive shadow cycle requirement". The actual bundle evaluator
produces 12 gates:

1. `full-corpus-top1` (≥75%)
2. `stratified-holdout-top1` (≥72.5%)
3. `unknown-count-ceiling` (≤10)
4. `gold-none-false-fire-no-increase` (≤baseline)
5. `explicit-skill-top1-no-regression` (=0)
6. `ambiguity-stability` (boolean)
7. `derived-lane-attribution-required` (boolean)
8. `adversarial-stuffing-rejection` (boolean)
9. `safety-regression-no-increase` (≤baseline)
10. `latency-no-regression` (cache-hit p95 ≤50ms, uncached p95 ≤60ms, no
    baseline regression)
11. `exact-parity-preservation` (0 regressions on Python-correct prompts)
12. `regression-suite` (P0=1.0, failed=0, command-bridge FP ≤0.05)

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:81-168`]

- Two-consecutive-shadow-cycle rule is NOT in this bundle — it's layered
  *above* the bundle in `promotion/two-cycle-requirement.ts` (1846 B — small;
  worth reading in iteration 2 to confirm RQ-04).
- **RQ-04 angle:** 12 gates look comprehensive but the evidence-quality gates
  are BOOLEAN (`ambiguityStable`, `derivedLaneAttributionComplete`,
  `stuffingRejected`). A booleanised measurement is brittle: a single true/false
  hides regression magnitude and rewards false-true more than noise-true.

## Questions Answered

- **RQ-01 (breadth):** Answered. 10 edge types declared, 10 emitted. Concrete
  gap: `CALLS` is regex-heuristic (detectorProvenance='heuristic',
  evidenceClass='INFERRED') while all other 9 edge types are AST-extracted
  (`evidenceClass='EXTRACTED'`). Additionally, the persisted
  edge-enrichment summary flattens to 5 classes with a single confidence
  scalar — no per-edge-type coverage is stored.
- **RQ-03 (breadth):** Partially answered. 4 states documented in the topic
  but 5 states actually produced (live/stale/absent/unavailable + the
  recovered-downgrade path). Five invariants (INV-F1..INV-F5) identified and
  each is auditable. `fallbackMode` is an orthogonal dimension, NOT a
  freshness state.

## Questions Remaining

- **RQ-01 (depth):** What is the **rate** of CALLS-edge false positives vs
  true positives? Need a measured comparison (AST ground truth vs current
  regex output). Deferred to iteration 2.
- **RQ-02:** Full scorer-lane bias study — requires running the corpus
  through ablation. Deferred.
- **RQ-03 (depth):** Invariant violations under concurrency, partial scans,
  lock contention. Requires reading `promotion/semantic-lock.ts` +
  `freshness/cache-invalidation.ts` + `freshness/trust-state.ts`.
- **RQ-04:** Actual rigor of 12-gate bundle — need to read
  `promotion/two-cycle-requirement.ts` + `promotion/shadow-cycle.ts`.
- **RQ-05–RQ-10:** Untouched this iteration.

## Next Focus

**Iteration 2 focus:** Drill into RQ-01 depth and RQ-03 depth.

1. **RQ-01 depth:** Read the tree-sitter parser (`tree-sitter-parser.ts`, 24k)
   to determine whether an AST-based call-expression query IS available but
   simply not wired to the CALLS emitter. If yes, RQ-01 has a low-cost fix
   path; if no, propose adding `call_expression` tree-sitter queries as a
   remediation track. Also check `code-graph-db.ts` schema-v3 for any
   per-edge-type coverage column (grep for `edge_coverage` / `coverage`).
2. **RQ-03 depth:** Read `promotion/semantic-lock.ts` +
   `freshness/trust-state.ts` + `freshness/cache-invalidation.ts` to
   enumerate lock boundaries. Specifically verify INV-F5 (cache invalidation
   on generation bump) by tracing write paths.
3. **RQ-04 groundwork (low-cost while in promotion/):** Read
   `two-cycle-requirement.ts` + `shadow-cycle.ts` to confirm the
   two-consecutive-shadow-cycle rule and document it.

Reducer note: What worked — reading small type-inventory files first
(`indexer-types.ts`, `weights-config.ts`) to anchor the larger files gave
high-leverage grounding. What could improve — I under-budgeted on test
files (`tests/` folders were listed but not opened); iteration 2 or 3
should read at least one test per system to cross-check invariant claims.
