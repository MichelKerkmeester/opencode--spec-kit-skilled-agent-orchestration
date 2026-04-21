# Ranked Recommendations

Post-2026-04-08 closeout note: no top-level rank-order changes were required after the `002-codesight`, `003-contextador`, `004-graphify`, and `005-claudest` packets reached 20 iterations. The CodeSight closeout strengthened the projection and detector-rigor case while sharpening the rejection of root-file mutation, side-effectful cached queries, breadcrumb-grade detector outputs, and HTML-as-feature priorities; the Contextador closeout strengthened R1's uncertainty-label framing and R4's scaffold dependency; the Graphify closeout tightened R4, R5, and R10 around additive payload and hint enrichment instead of subsystem replacement; the Claudest continuation sharpened packet order and acceptance gates inside the continuity and analytics lane without overriding the broader ranking; and the derivative `006-research-memory-redundancy` follow-on clarified that future continuity artifacts should be compact wrappers that point at canonical packet docs rather than second narrative owners. [SOURCE: 002-codesight/research/research.md:24-30] [SOURCE: 002-codesight/research/research.md:841-860] [SOURCE: 003-contextador/research/research.md:47-51] [SOURCE: 003-contextador/research/research.md:174-182] [SOURCE: 004-graphify/research/research.md:744-768] [SOURCE: 005-claudest/research/research.md:625-668] [SOURCE: 006-research-memory-redundancy/research/research.md]

## R1 — Publish a provisional honest measurement contract before any multiplier

**Rank:** 1  
**Score:** 9.5/10 — still the highest-leverage governance move, but v2 narrows it from a “frozen rule” to a provisional contract because publication-grade authority is not fully shipped yet.  
**Rationale:** The measurement lane remains the gate on every later savings claim, and the rigor lane widened the problem from token math into presentation-layer precision laundering. The Contextador closeout sharpened that warning by confirming the repo still encodes a polished synthetic-savings story in counters, tests, and generated guidance. Public should lock the uncertainty vocabulary now, while explicitly refusing headline ratios until provider-counted prompt/completion/cache fields exist. [SOURCE: research/iterations/counter-evidence-iter-16.md:13-21] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:13-30] [SOURCE: 003-contextador/research/research.md:47-49] [SOURCE: 003-contextador/research/research.md:154-162]  
**Evidence:** [F-CROSS-036] [F-CROSS-055] [F-CROSS-066] [F-CROSS-088]  
**Depends on:** none  
**Effort:** M  
**Acceptance criterion:** Public publishes a versioned methodology that labels every metric `exact | estimated | defaulted | unknown`, blocks headline savings ratios without provider-counted authority, and is used consistently by dashboard/reporting surfaces. [SOURCE: research/iterations/q-a-token-honesty.md:115-125] [SOURCE: research/iterations/counter-evidence-iter-16.md:19-21]

## R2 — Add a freshness-scoped persisted Stop summary artifact that bootstrap may prefer when valid

**Rank:** 7  
**Score:** 7.4/10 — still important, but v2 demotes it because freshness authority and existing live recovery surfaces make the original wording too strong.  
**Rationale:** Stop-summary production remains a prerequisite for later warm-start work, yet iter-16 showed it is neither a small rail nor a safe new authority surface by default. The Claudest continuation sharpened the producer boundary further: the first analytics-adjacent move is a bounded metadata patch that persists transcript identity and cache token fields without turning the Stop hook into the analytics reader. The v2 version therefore keeps bootstrap authoritative and treats the summary artifact as one optional, freshness-scoped input backed by explicit producer metadata. [SOURCE: research/iterations/counter-evidence-iter-16.md:22-30] [SOURCE: research/iterations/cost-reality-iter-14.md:42-57] [SOURCE: 005-claudest/research/research.md:637-643]  
**Evidence:** [F-CROSS-047] [F-CROSS-068] [F-CROSS-086]  
**Depends on:** R1  
**Effort:** M  
**Acceptance criterion:** Public persists a compact Stop-summary artifact with producer, timestamp, scope, invalidation metadata, durable transcript identity, carried-forward cache token fields, and enough distinguishing evidence to act as a continuity wrapper, while leaving `decision-record.md` and `implementation-summary.md` as the long-form narrative owners when they exist. `session_bootstrap` may prefer that wrapper only when those checks pass. [SOURCE: research/iterations/counter-evidence-iter-16.md:29-30] [SOURCE: 005-claudest/research/research.md:639-647] [SOURCE: 006-research-memory-redundancy/research/research.md]

## R3 — Use cached SessionStart summaries only under fidelity and freshness gates

**Rank:** 8  
**Score:** 7.1/10 — demoted because Public already ships adjacent startup substrate and the incremental win is conditional, not automatic.  
**Rationale:** V2 keeps the fast-path idea, but only as a guarded consumer on top of R2. The evidence now says cached startup can lower cost while still harming correctness if lossy summaries or heuristic session selection are treated as authoritative. The Claudest continuation also made the placement concrete: the safe lane is additive continuity for `resume` and `compact`, plus optional startup hints when a cached summary exists, not a replacement for `session_bootstrap()` or memory resume flows. [SOURCE: research/iterations/counter-evidence-iter-16.md:31-39] [SOURCE: research/iterations/combo-stress-test-iter-12.md:15-18] [SOURCE: 005-claudest/research/research.md:645-647]  
**Evidence:** [F-CROSS-046] [F-CROSS-060] [F-CROSS-071] [F-CROSS-086]  
**Depends on:** R2  
**Effort:** S  
**Acceptance criterion:** SessionStart uses cached compact summary wrappers only when fidelity and freshness checks pass, routes them through additive `resume` and `compact` continuity paths plus optional startup hints, and a frozen resume corpus shows equal-or-better pass rate relative to live reconstruction. The wrapper carries additive continuity state rather than a second packet narrative. [SOURCE: research/iterations/counter-evidence-iter-16.md:37-39] [SOURCE: 005-claudest/research/research.md:645-647] [SOURCE: 006-research-memory-redundancy/research/research.md]

## R4 — Ship a narrow graph-first PreToolUse nudge after scaffold and readiness checks

**Rank:** 2  
**Score:** 8.9/10 — one of the safest topology-preserving improvements, provided v2 keeps it narrow and explicit about prerequisites.  
**Rationale:** Public already has the hooks and routing substrate, and iter-16 kept this recommendation while warning against presenting it as a general-purpose router. The right v2 version is a structural-first nudge for known `Glob|Grep` misfires once graph readiness and activation scaffolding exist. The Contextador closeout reinforces that the scaffold itself is worth surfacing, but only as a narrow onboarding/support rail rather than proof of a richer unified query surface. The Graphify closeout made placement concrete: the nudge belongs in the existing `session-prime`, `compact-inject`, `response-hints`, and bootstrap or resume layers, not in a new graph-router subsystem. [SOURCE: research/iterations/counter-evidence-iter-16.md:40-48] [SOURCE: research/iterations/public-infrastructure-iter-13.md:175-175] [SOURCE: 003-contextador/research/research.md:47-48] [SOURCE: 003-contextador/research/research.md:174-182] [SOURCE: 004-graphify/research/research.md:746-749]  
**Evidence:** [F-CROSS-035] [F-CROSS-038] [F-CROSS-056] [F-CROSS-082]  
**Depends on:** packet-level activation-scaffold surfacing  
**Effort:** S  
**Acceptance criterion:** Public ships a structural-first nudge through existing `session-prime`, `compact-inject`, `response-hints`, or bootstrap or resume surfaces only after readiness checks, and a frozen task slice shows improved first-query routing without regressing non-structural tasks. [SOURCE: research/iterations/combo-stress-test-iter-12.md:19-31] [SOURCE: research/iterations/counter-evidence-iter-16.md:44-48] [SOURCE: 004-graphify/research/research.md:746-749]

## R5 — Harden graph payloads with validation plus separate provenance, evidence, and freshness fields

**Rank:** 5  
**Score:** 8.2/10 — still worth doing, but only after v2 drops the collapsed-confidence framing that made the original wording unsafe.  
**Rationale:** The validator remains a strong bounded move, but the “honest confidence labels” wording from v1 was too loose. In v2 this recommendation is explicitly downstream of the trust-axis split: validate the payload boundary and carry separate fields, not one cleaned-up truth score. The Graphify closeout tightened the fit by showing that Public's existing result-confidence, result-provenance, bridge-context, and code-graph-context payloads can absorb those fields additively without creating a second owner surface. [SOURCE: research/iterations/counter-evidence-iter-16.md:49-57] [SOURCE: research/iterations/cost-reality-iter-14.md:59-74] [SOURCE: 004-graphify/research/research.md:744-749]  
**Evidence:** [F-CROSS-041] [F-CROSS-064] [F-CROSS-079] [F-CROSS-083] [F-CROSS-094]  
**Depends on:** R10  
**Effort:** M  
**Acceptance criterion:** Code-graph and bridge payloads fail validation on malformed trust metadata, and consumer outputs preserve separate provenance, evidence, and freshness fields end to end without introducing a parallel graph-only contract family. [SOURCE: research/iterations/counter-evidence-iter-16.md:55-57] [SOURCE: research/iterations/public-infrastructure-iter-13.md:160-166] [SOURCE: 004-graphify/research/research.md:744-749]

## R6 — Add a detector regression harness as a floor, not as proof of user-visible quality

**Rank:** 6  
**Score:** 7.9/10 — low-risk and immediately useful, but v2 keeps it explicitly subordinate to later seam-level outcome testing.  
**Rationale:** Iter-16 kept this recommendation while warning that fixture coverage can overvalidate the wrong seam. The right framing is a non-regression floor before broader extraction work, not a proxy for user-visible structural quality. The CodeSight closeout reinforced that conclusion: its fixture harness is one of the safest lifts in the repo, while the weaker middleware/libs/config detectors show why frozen fixtures must remain a floor for detector integrity rather than a claim that downstream structural context is fully trustworthy. [SOURCE: research/iterations/counter-evidence-iter-16.md:58-66] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:35-55] [SOURCE: 002-codesight/research/research.md:329-352] [SOURCE: 002-codesight/research/research.md:779-798]  
**Evidence:** [F-CROSS-031] [F-CROSS-067]  
**Depends on:** none  
**Effort:** S  
**Acceptance criterion:** Public lands frozen detector fixtures that fail on structural regressions, and a follow-on task corpus is defined separately for user-visible structural quality claims. [SOURCE: research/iterations/counter-evidence-iter-16.md:62-66]

## R7 — Reframe the FTS capability cascade as low-priority memory-lane hardening

**Rank:** 10  
**Score:** 6.2/10 — the idea is still good, but v2 drops it to the bottom tier because the substrate is already mostly shipped.  
**Rationale:** Iter-13 and iter-14 both found that Public already has much of the FTS substrate, so this is still a bounded hardening lane rather than a platform rewrite. The Claudest continuation sharpened why it still matters: it is the first concrete implementation packet inside the continuity/analytics track, because retrieval-path truth and forced-degrade behavior should stabilize before analytics readers, cached summaries, or dashboard contracts build on top of them. [SOURCE: research/iterations/public-infrastructure-iter-13.md:177-177] [SOURCE: research/iterations/cost-reality-iter-14.md:8-10] [SOURCE: 005-claudest/research/research.md:599-600] [SOURCE: 005-claudest/research/research.md:657-666]  
**Evidence:** [F-CROSS-045] [F-CROSS-077]  
**Depends on:** none  
**Effort:** S  
**Acceptance criterion:** Memory search records which lexical path was chosen at runtime, exposes fallback status explicitly, preserves current semantics when FTS5 is unavailable, and ships a truthful forced-degrade matrix that covers compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure without overstating an `fts4_match` lane. [SOURCE: research/iterations/counter-evidence-iter-16.md:71-73] [SOURCE: 005-claudest/research/research.md:631-635]

## R8 — Treat the warm-start bundle as a conditional package, not the default early multiplier

**Rank:** 9  
**Score:** 6.8/10 — still worthwhile, but only after its components prove they preserve correctness under freshness-sensitive evaluation.  
**Rationale:** Iter-12 weakened Combo 1 and iter-16 explicitly told v2 to move it below its prerequisites. The bundle survives, but only for validated cases where summary fidelity and graph readiness are both high. The Claudest continuation made those prerequisites operational: the bundle should not be treated as active implementation work until the FTS helper/tests, Stop-hook metadata patch, analytics reader, and cached-summary consumer all exist in that order. [SOURCE: research/iterations/combo-stress-test-iter-12.md:40-45] [SOURCE: research/iterations/counter-evidence-iter-16.md:76-84] [SOURCE: 005-claudest/research/research.md:659-666]  
**Evidence:** [F-CROSS-038] [F-CROSS-060] [F-CROSS-068] [F-CROSS-086]  
**Depends on:** R2, R3, R4  
**Effort:** M  
**Acceptance criterion:** A frozen resume-plus-follow-up corpus built around compact continuity wrappers shows lower cost with equal-or-better pass rate for the combined configuration than for the baseline and component-only variants. [SOURCE: research/iterations/counter-evidence-iter-16.md:80-84] [SOURCE: 006-research-memory-redundancy/research/research.md]

## R9 — Build the auditable-savings stack before dashboard publication

**Rank:** 3  
**Score:** 8.7/10 — v2 keeps this high because Public already has the observability substrate; the remaining risk is certainty laundering, not missing dashboards.  
**Rationale:** Iter-16 preserved this recommendation but made the contract requirement sharper: the stack is only useful if every field carries provenance and uncertainty status. The Claudest continuation tightened the implementation dependency too: dashboard- or export-level contracts should only ride on top of a normalized analytics reader, not directly on hook-state payloads or producer-only snapshots. The value is therefore governance over publication, not prettier charts. [SOURCE: research/iterations/counter-evidence-iter-16.md:85-93] [SOURCE: research/iterations/combo-stress-test-iter-12.md:51-80] [SOURCE: 005-claudest/research/research.md:641-655]  
**Evidence:** [F-CROSS-036] [F-CROSS-050] [F-CROSS-052] [F-CROSS-066] [F-CROSS-073] [F-CROSS-088]  
**Depends on:** R1  
**Effort:** M  
**Acceptance criterion:** Dashboard/reporting publication is blocked unless rows include uncertainty labels, schema versioning, frozen-task methodology status, and normalized reader provenance, and published aggregate views exclude runs that fail that contract. [SOURCE: research/iterations/combo-stress-test-iter-12.md:58-67] [SOURCE: research/iterations/counter-evidence-iter-16.md:89-93] [SOURCE: 005-claudest/research/research.md:643-655]

## R10 — Separate trust axes and freshness authority before packaging structural artifacts

**Rank:** 4  
**Score:** 8.4/10 — this is the v2 replacement for old R10 and the key prerequisite the rigor lane exposed.  
**Rationale:** Combo 3 failed because provenance, evidence status, and freshness were treated as if one confidence field could carry all three. Public should first create an explicit contract for those axes and only then reconsider artifact-default structural packaging. The Claudest continuation supplies a concrete parallel in the analytics lane: transcript identity, replay checkpoints, and cache fields must be separated before consumer contracts become trustworthy. The Graphify closeout sharpened the structural half of the same lesson by showing that clustering, multimodal scope, and graph-first enrichment all fit better as later additive layers on current payloads than as a new graph-shaped authority surface. The CodeSight closeout reinforced the packaging risk directly: stale section files can persist, cold MCP queries write artifacts as a side effect, and profile/HTML projections can re-amplify heuristic token narratives, so shipping artifact-first surfaces before trust and freshness separation would harden the wrong contract. [SOURCE: research/iterations/combo-stress-test-iter-12.md:112-116] [SOURCE: research/iterations/counter-evidence-iter-16.md:94-100] [SOURCE: 005-claudest/research/research.md:639-655] [SOURCE: 004-graphify/research/research.md:752-768] [SOURCE: 002-codesight/research/research.md:802-829] [SOURCE: 002-codesight/research/research.md:810-822]  
**Evidence:** [F-CROSS-066] [F-CROSS-068] [F-CROSS-069] [F-CROSS-079] [F-CROSS-083] [F-CROSS-085] [F-CROSS-097] [F-CROSS-098]  
**Depends on:** none  
**Effort:** M  
**Acceptance criterion:** Shared structural payloads expose separate fields for parser provenance, evidence status, and freshness or authority, and no consumer-facing output collapses them into one scalar trust score before later multimodal or clustering overlays are considered. [SOURCE: research/iterations/counter-evidence-iter-16.md:53-57] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:27-30] [SOURCE: 004-graphify/research/research.md:752-768]
