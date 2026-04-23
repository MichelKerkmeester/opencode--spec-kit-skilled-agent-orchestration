# Iteration 3 — Gap Severity Firming + Blind-Spot Audit

## Focus
Firm the 67 candidate-severity gaps from iter-1 into definitive P0/P1/P2 calls, then test for genuinely missing evaluation axes the legacy 18-iteration run never defined or only mentioned in passing.

## Actions Taken
- Re-read the iter-1 gap inventory and carried its 67-row table forward as the Q1 input surface. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md:15-85]
- Re-read iter-2 so Q2 stayed fixed and this pass only targeted severity firming plus blind spots. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-2.md:64-75]
- Ran absence checks over the legacy packet with targeted grep families for tenancy, governance, churn, recovery, retention, and sunk-cost language. Results: `tenant|multi-tenant|multi user|multi-user|org deployment|team deployment` -> 0 hits / 0 files; `access control|RBAC|role-based|permissions model|team policy` -> 0 hits / 0 files; `rollback|restore from corruption|rebuild index|cache invalidation recovery` -> 0 hits / 0 files; `sunk cost|negative findings|discarded recommendation|downgraded recommendation|replaced recommendation` -> 0 hits / 0 files; `churn|API stability|breaking change|surface stability` -> 1 hit / 1 file; `GDPR|retention|right to deletion|delete request|deletion policy` -> 2 hits / 2 files.
- Read the sparse-hit grep outputs to confirm the non-zero cases never became packet-level scoring axes: `research/iterations/q-a-token-honesty.md:38` is the only churn mention, while retention appears only in `research/iterations/iteration-3.md:36` and `research/iterations/gap-closure-phases-3-4-5.json:114`.

## Findings

### Part A — Severity-Firmed Gap Table (67 gaps from iter-1)

| GAP-ID | Source | Phase | Severity (firmed) | Cheapest Remediation | Est. Runtime |
|--------|--------|-------|-------------------|----------------------|--------------|
| GAP-013 | first-pass-exit | 003 | P0 | Add 8 lines in `003-contextador/research/research.md` to add atomic conflict semantics or clearly bound Matrix multi-agent writes as non-authoritative (~8 min). | 8 min |
| GAP-014 | first-pass-exit | 003 | P0 | Add 8 lines in `003-contextador/research/research.md` to add webhook idempotency, secret rotation, and routed failure notification to close the lane (~8 min). | 8 min |
| GAP-031 | iter-9 | license | P0 | Add 8 lines in `research/research.md` to keep Q-E's two-column portability rule as the authoritative standard (~8 min). | 8 min |
| GAP-059 | iter-12 | combo | P0 | Add 8 lines in `research/research.md` to keep artifact-default structural packaging blocked until trust axes are separated (~8 min). | 8 min |
| GAP-060 | iter-18 | validation | P0 | Add 8 lines in `research/findings-registry.json` to retag the over-assigned `new-cross-phase` findings and rerun registry validation (~8 min). | 8 min |
| GAP-002 | first-pass-exit | 001 | P1 | Add 6 lines in `001-claude-optimization-settings/research/research.md` to recover chain-level retry examples or stop claiming causal attribution (~6 min). | 6 min |
| GAP-003 | first-pass-exit | 001 | P1 | Add 6 lines in `001-claude-optimization-settings/research/research.md` to count `/clear` remedy overhead against the stale-resume baseline (~6 min). | 6 min |
| GAP-005 | first-pass-exit | cross | P1 | Add 6 lines in `research/research.md` to re-open the phase-001 vs phase-005 contract fit with corrected tagging and citations (~6 min). | 6 min |
| GAP-008 | first-pass-exit | 002 | P1 | Add 6 lines in `002-codesight/research/research.md` to split `ast` from regex/brace-tracked provenance instead of overloading one label (~6 min). | 6 min |
| GAP-010 | first-pass-exit | 002 | P1 | Add 6 lines in `002-codesight/research/research.md` to add a blast-radius precision/recall harness before using schema-impact rhetoric (~6 min). | 6 min |
| GAP-012 | first-pass-exit | 003 | P1 | Add 6 lines in `003-contextador/research/research.md` to keep the privacy weakness explicit and avoid treating Mainframe as a portable source lane (~6 min). | 6 min |
| GAP-015 | first-pass-exit | 003 | P1 | Add 6 lines in `003-contextador/research/research.md` to add post-regeneration completion guarantees or explicitly downgrade repair-queue claims (~6 min). | 6 min |
| GAP-021 | first-pass-exit | 004 | P1 | Add 6 lines in `004-graphify/research/research.md` to add before/after tool-choice telemetry or stop implying the hook changed behavior (~6 min). | 6 min |
| GAP-023 | first-pass-exit | 005 | P1 | Add 6 lines in `005-claudest/research/research.md` to persist `transcript_path`, cache-token fields, and turn offsets before claiming analytics readiness (~6 min). | 6 min |
| GAP-026 | first-pass-exit | cross | P1 | Add 6 lines in `research/research.md` to re-cite the `008-signal-extraction` conclusion with literal paths and stable source_phase metadata (~6 min). | 6 min |
| GAP-029 | iter-9 | deliverable | P1 | Add 6 lines in `research/research.md` to preserve the split between evidence-shape UNKNOWNs and measurement-bounded UNKNOWNs (~6 min). | 6 min |
| GAP-030 | iter-9 | roadmap | P1 | Add 6 lines in `research/recommendations.md` to promote activation scaffolding from an implicit prerequisite to an explicit tracked work item (~6 min). | 6 min |
| GAP-033 | iter-9 | registry | P1 | Patch 6 lines in `research/findings-registry.json` to re-run registry summary and tag validation after retagging cross-phase findings (~6 min). | 6 min |
| GAP-043 | iter-9 | recommendations | P1 | Add 6 lines in `research/recommendations.md` to keep R4's activation-scaffold prerequisite explicit (~6 min). | 6 min |
| GAP-047 | iter-9 | recommendations | P1 | Add 6 lines in `research/recommendations.md` to keep old R10 retired; replacement R10 is prerequisite contract work, not packaging (~6 min). | 6 min |
| GAP-049 | iter-11 | citation | P1 | Add 6 lines in `research/iterations/citation-audit-iter-11.json` to preserve the literal-path repair for F-CROSS-064 and spot-check the content claim again (~6 min). | 6 min |
| GAP-050 | iter-11 | citation | P1 | Add 6 lines in `research/iterations/citation-audit-iter-11.json` to keep F-CROSS-026 on literal folder paths and correct `source_phase` handling (~6 min). | 6 min |
| GAP-051 | iter-11 | citation | P1 | Add 6 lines in `research/iterations/citation-audit-iter-11.json` to keep F-CROSS-005 on literal folder paths and add the intended phase-001 portability lines (~6 min). | 6 min |
| GAP-052 | iter-11 | citation | P1 | Add 6 lines in `research/iterations/citation-audit-iter-11.json` to preserve the literal-path repair for F-CROSS-061 (~6 min). | 6 min |
| GAP-053 | iter-11 | citation | P1 | Add 6 lines in `research/iterations/citation-audit-iter-11.json` to preserve the literal-path repair for F-CROSS-062 (~6 min). | 6 min |
| GAP-054 | iter-11 | citation | P1 | Add 6 lines in `research/iterations/citation-audit-iter-11.json` to preserve the literal-path repair for F-CROSS-065 (~6 min). | 6 min |
| GAP-058 | iter-12 | combo | P1 | Add 6 lines in `research/research.md` to only test Combo 1 on frozen resume corpora with freshness and fidelity gates (~6 min). | 6 min |
| GAP-062 | registry | 001 | P1 | Patch 6 lines in `001-claude-optimization-settings/research/research.md` to leave Q8 explicitly UNKNOWN unless new chain-level evidence appears (~6 min). | 6 min |
| GAP-063 | registry | 001 | P1 | Patch 6 lines in `001-claude-optimization-settings/research/research.md` to close Q9 only after stale-resume costs include remediation overhead (~6 min). | 6 min |
| GAP-065 | registry | 002 | P1 | Patch 6 lines in `002-codesight/research/research.md` to add a blast-radius quality corpus or keep false-positive claims qualitative (~6 min). | 6 min |
| GAP-066 | registry | 004 | P1 | Patch 6 lines in `004-graphify/research/research.md` to add behavior-change telemetry before presenting the PreToolUse nudge as effective (~6 min). | 6 min |
| GAP-067 | registry | cross | P1 | Patch 6 lines in `research/research.md` to reclassify moat-style cross findings out of `new-cross-phase` before any reuse (~6 min). | 6 min |
| GAP-001 | first-pass-exit | 001 | P2 | Add 4 lines in `001-claude-optimization-settings/research/research.md` to measure first-tool latency and fallback discoverability under `ENABLE_TOOL_SEARCH=true` (~4 min). | 4 min |
| GAP-004 | first-pass-exit | 001 | P2 | Add 4 lines in `001-claude-optimization-settings/research/research.md` to reconcile the 926/858 session and 11,357 denominator drift with explicit arithmetic (~4 min). | 4 min |
| GAP-006 | first-pass-exit | 002 | P2 | Add 4 lines in `002-codesight/research/research.md` to keep the closure but add provider-counted token benchmarking before any multiplier language (~4 min). | 4 min |
| GAP-007 | first-pass-exit | 002 | P2 | Add 4 lines in `002-codesight/research/research.md` to treat tRPC/Fastify enrichment as a detector gap, not as evidence of broader contract maturity (~4 min). | 4 min |
| GAP-009 | first-pass-exit | 002 | P2 | Add 4 lines in `002-codesight/research/research.md` to document the real workspace boundary and explicitly exclude nx/turbo/lerna/rush-only metadata (~4 min). | 4 min |
| GAP-011 | first-pass-exit | 003 | P2 | Add 4 lines in `003-contextador/research/research.md` to preserve the closure: the 93% figure is estimate math, not a benchmark (~4 min). | 4 min |
| GAP-016 | first-pass-exit | 004 | P2 | Add 4 lines in `004-graphify/research/research.md` to keep the closure: the 71.5x claim is heuristic unless token counting is grounded (~4 min). | 4 min |
| GAP-017 | first-pass-exit | 004 | P2 | Add 4 lines in `004-graphify/research/research.md` to treat cache deletion/invalidation debt as a bounded maintenance lane, not solved infrastructure (~4 min). | 4 min |
| GAP-018 | first-pass-exit | 004 | P2 | Add 4 lines in `004-graphify/research/research.md` to preserve the parity warning: Swift detection without extraction is still an honesty gap (~4 min). | 4 min |
| GAP-019 | first-pass-exit | 004 | P2 | Add 4 lines in `004-graphify/research/research.md` to separate ranking semantics from report semantics for INFERRED confidence values (~4 min). | 4 min |
| GAP-020 | first-pass-exit | 004 | P2 | Add 4 lines in `004-graphify/research/research.md` to keep the worked artifact labeled as non-reproducible multimodal evidence (~4 min). | 4 min |
| GAP-022 | first-pass-exit | 005 | P2 | Add 4 lines in `005-claudest/research/research.md` to keep FTS fallback claims bounded to the runtime contract actually verified (~4 min). | 4 min |
| GAP-024 | first-pass-exit | 005 | P2 | Add 4 lines in `005-claudest/research/research.md` to replace inferred plugin-doc ownership with direct file proof or keep it marked absent (~4 min). | 4 min |
| GAP-025 | first-pass-exit | 005 | P2 | Add 4 lines in `005-claudest/research/research.md` to align `_build_fallback_context()` docs with the implemented first-2/last-6 renderer (~4 min). | 4 min |
| GAP-027 | iter-9 | deliverable | P2 | Add 4 lines in `research/research.md` to keep Claudest framed as the strongest pattern source, not the cleanest portable codebase (~4 min). | 4 min |
| GAP-028 | iter-9 | deliverable | P2 | Add 4 lines in `research/research.md` to keep matrix prose literal to scored rows instead of value-judgment language (~4 min). | 4 min |
| GAP-032 | iter-9 | confidence | P2 | Add 4 lines in `research/research.md` to keep confidence anchored to correctness plus coverage, not coverage alone (~4 min). | 4 min |
| GAP-034 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to preserve the `adapt` downgrade for F-CROSS-005 unless stronger evidence appears (~4 min). | 4 min |
| GAP-035 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to replace table-row citations on token-reporting claims with method-section evidence (~4 min). | 4 min |
| GAP-036 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to re-cite the FTS cascade with runtime fallback evidence, not a one-line Q-C row (~4 min). | 4 min |
| GAP-037 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to keep F-CROSS-055's confidence provisional and evidence-backed (~4 min). | 4 min |
| GAP-038 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to strip "lanes that matter most" language from cross-phase routing claims (~4 min). | 4 min |
| GAP-039 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to keep `ENABLE_TOOL_SEARCH` phrased as upstream evidence, not as live Public proof (~4 min). | 4 min |
| GAP-040 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to de-duplicate F-CROSS-062 against adjacent overlay-packaging findings (~4 min). | 4 min |
| GAP-041 | iter-9 | registry | P2 | Patch 4 lines in `research/findings-registry.json` to collapse cached-summary overlap between F-CROSS-065 and F-CROSS-046 (~4 min). | 4 min |
| GAP-042 | iter-9 | recommendations | P2 | Add 4 lines in `research/recommendations.md` to re-justify R2's remaining `Depends on: R1` edge or make the policy gate explicit (~4 min). | 4 min |
| GAP-044 | iter-9 | recommendations | P2 | Add 4 lines in `research/recommendations.md` to preserve R5's evidence split and R10 dependency; do not fall back to one trust scalar (~4 min). | 4 min |
| GAP-045 | iter-9 | recommendations | P2 | Add 4 lines in `research/recommendations.md` to keep R6 bounded to detector regression as a floor, not a proxy for user quality (~4 min). | 4 min |
| GAP-046 | iter-9 | recommendations | P2 | Add 4 lines in `research/recommendations.md` to preserve dependency-adjusted ordering language for R8 (~4 min). | 4 min |
| GAP-048 | iter-9 | matrix | P2 | Add 4 lines in `research/cross-phase-matrix.md` to keep ecosystem leakage and tie-break inferences out of future matrix renders (~4 min). | 4 min |
| GAP-055 | iter-11 | citation | P2 | Add 4 lines in `research/iterations/citation-audit-iter-11.json` to replace F-CROSS-036's weak Q-C row with Q-A methodology evidence (~4 min). | 4 min |
| GAP-056 | iter-11 | citation | P2 | Add 4 lines in `research/iterations/citation-audit-iter-11.json` to replace F-CROSS-045's weak Q-C row with phase-005 runtime fallback evidence (~4 min). | 4 min |
| GAP-057 | iter-11 | citation | P2 | Add 4 lines in `research/iterations/citation-audit-iter-11.json` to re-support F-CROSS-056 with matrix/runtime evidence instead of synthesis-only wording (~4 min). | 4 min |
| GAP-061 | registry | 001 | P2 | Patch 4 lines in `001-claude-optimization-settings/research/research.md` to keep Q2 open until first-tool latency is measured, not inferred from discoverability (~4 min). | 4 min |
| GAP-064 | registry | 001 | P2 | Patch 4 lines in `001-claude-optimization-settings/research/research.md` to resolve the Reddit arithmetic with one auditable denominator narrative (~4 min). | 4 min |

P0 assignments are the gaps that would directly mislead implementation or create exposure if reused without repair: GAP-013 leaves shared Matrix writes without conflict semantics, so adoption could create correctness bugs in multi-agent state. GAP-014 leaves security/reliability controls like secret rotation and idempotent webhook handling unspecified. GAP-031 is the one licensing-exposure gap: iter-9 explicitly found the deliverable using incompatible portability standards. GAP-059 preserves a combo that iter-12 already falsified unless trust axes are split first, which is a correctness problem, not a cosmetic one. GAP-060 is the key-finding invalidation case: iter-18 still closed with 31 `new-cross-phase` tags when the validator budget was 15, leaving 16 excess tags that materially distort the registry until retagging and revalidation happen. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md:30-31] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md:48-48] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md:76-77] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/001-research-and-baseline-pt-01/iterations/iteration-1.md:87-92]

P0: 5 gaps | P1: 27 gaps | P2: 35 gaps | Total: 67

### Part B — Blind-Spot Enumeration

| BS-ID | Blind-Spot Label | Dimension | Evidence of Absence | Materiality | Cheapest Remediation |
|-------|------------------|-----------|---------------------|-------------|----------------------|
| BS-001 | Multi-tenant deployment model | adoption / topology | `grep -rni --include="*.md" --include="*.json" "tenant|multi-tenant|multi user|multi-user|org deployment|team deployment" research/` returned 0 hits across 0 files. | Maybe - it does not overturn the single-developer ranking by itself, but it could reshuffle near-term adoption if shared infra becomes a hard requirement. | Add 10 lines to `research/research.md` defining shared-state, tenancy, and operator-boundary assumptions (~10 min). |
| BS-002 | Team governance and access control | governance | `grep -rni --include="*.md" --include="*.json" "access control|RBAC|role-based|permissions model|team policy" research/` returned 0 hits across 0 files. | Yes - several surviving recommendations assume shared authority and durable memory, so missing RBAC/auditability could change which seams are safe to adopt first. | Add 8 lines to `research/recommendations.md` scoring RBAC, auditability, and policy delegation for each surviving recommendation (~8 min). |
| BS-003 | Rollback / corruption recovery behavior | failure-mode | `grep -rni --include="*.md" --include="*.json" "rollback|restore from corruption|rebuild index|cache invalidation recovery" research/` returned 0 hits across 0 files. | Yes - if the stateful graph/memory stack cannot recover from corruption or stale cache, several high-ranked substrate recommendations become materially riskier or move down the sequence. | Add 12 lines to `research/research.md` comparing recovery paths for index corruption, stale cache, and restore workflows (~12 min). |
| BS-004 | Cost of discarded recommendations | effort / economics | `grep -rni --include="*.md" --include="*.json" "sunk cost|negative findings|discarded recommendation|downgraded recommendation|replaced recommendation" research/` returned 0 hits across 0 files. | Maybe - this does not change correctness, but it could alter prioritization if the cheapest surviving plan is not actually the lowest net-cost plan. | Add 6 lines to `research/recommendations.md` estimating sunk-cost exposure for downgraded and replaced recommendations (~6 min). |
| BS-005 | Public substrate churn risk | adoption / fragility | `grep -rni --include="*.md" --include="*.json" "churn|API stability|breaking change|surface stability" research/` returned 1 hit across 1 file, limited to `research/iterations/q-a-token-honesty.md:38` and never elevated into any packet-level axis. | Yes - the top recommendations lean on current Public substrate owners; if those APIs are still moving fast, the ranking of "cheap now" moves could change sharply. | Add 8 lines to `research/research.md` rating recommendation fragility against current Public API churn and ownership volatility (~8 min). |
| BS-006 | Retention / deletion obligations | governance / compliance | `grep -rni --include="*.md" --include="*.json" "GDPR|retention|right to deletion|delete request|deletion policy" research/` returned 2 hits across 2 files (`research/iterations/iteration-3.md:36`, `research/iterations/gap-closure-phases-3-4-5.json:114`) and never became a scored evaluation axis. | Maybe - it may not overturn the technical top 10, but it can gate adoption for any recommendation that copies or persists user/session memory. | Add 8 lines to `research/research.md` defining retention, redaction, and deletion constraints for copied memory patterns (~8 min). |

The biggest materiality risk is **BS-003: Rollback / corruption recovery behavior**. The surviving top-10 recommendations are increasingly substrate-heavy and assume the graph/memory layer is trustworthy enough to sit under more routing and continuity work. If corruption recovery, stale-cache rebuild, or rollback semantics are weak, the packet would likely favor narrower bounded seams and move several "build on the substrate" recommendations downward.

## Questions Answered
- [x] Q2 unchanged (answered in iter-2)
- [x] Q1 — severity-firmed gap table produced; P0 count = 5, P1 count = 27, P2 count = 35
- [x] Q3 — blind-spot enumeration produced; 6 material blind spots identified
- [ ] Q4, Q5 remain

## Questions Remaining
- [ ] Q4: Do surviving recommendations withstand fresh adversarial audit against current (2026-04-23) Public state?
- [ ] Q5: What single next action delivers the highest marginal convergence per effort?

## Next Focus
Iteration 4 — Recommendation survival audit (Q4). Re-run counter-evidence on the 5 surviving top-10 recs PLUS the 5 downgraded/replaced, using blind-spot signals from Part B to strengthen the adversarial test. Also sanity-check the surviving Combo 2 and the weakened Combo 1 against Public's current substrate state.
