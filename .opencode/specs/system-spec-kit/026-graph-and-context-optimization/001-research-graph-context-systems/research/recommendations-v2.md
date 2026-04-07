# Ranked Recommendations (v2)

## R1 — Publish a provisional honest measurement contract before any multiplier

**Rank:** 1  
**Score:** 9.5/10 — still the highest-leverage governance move, but v2 narrows it from a “frozen rule” to a provisional contract because publication-grade authority is not fully shipped yet.  
**Rationale:** The measurement lane remains the gate on every later savings claim, and the rigor lane widened the problem from token math into presentation-layer precision laundering. Public should lock the uncertainty vocabulary now, while explicitly refusing headline ratios until provider-counted prompt/completion/cache fields exist. [SOURCE: research/iterations/counter-evidence-iter-16.md:13-21] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:13-30]  
**Evidence:** [F-CROSS-036] [F-CROSS-055] [F-CROSS-066] [F-CROSS-088]  
**Depends on:** none  
**Effort:** M  
**Acceptance criterion:** Public publishes a versioned methodology that labels every metric `exact | estimated | defaulted | unknown`, blocks headline savings ratios without provider-counted authority, and is used consistently by dashboard/reporting surfaces. [SOURCE: research/iterations/q-a-token-honesty.md:115-125] [SOURCE: research/iterations/counter-evidence-iter-16.md:19-21]

## R2 — Add a freshness-scoped persisted Stop summary artifact that bootstrap may prefer when valid

**Rank:** 7  
**Score:** 7.4/10 — still important, but v2 demotes it because freshness authority and existing live recovery surfaces make the original wording too strong.  
**Rationale:** Stop-summary production remains a prerequisite for later warm-start work, yet iter-16 showed it is neither a small rail nor a safe new authority surface by default. The v2 version keeps bootstrap authoritative and treats the summary as one optional, freshness-scoped input. [SOURCE: research/iterations/counter-evidence-iter-16.md:22-30] [SOURCE: research/iterations/cost-reality-iter-14.md:42-57]  
**Evidence:** [F-CROSS-047] [F-CROSS-068] [F-CROSS-086]  
**Depends on:** R1  
**Effort:** M  
**Acceptance criterion:** Public persists a Stop-summary artifact with producer, timestamp, scope, and invalidation metadata, and `session_bootstrap` prefers it only when those checks pass. [SOURCE: research/iterations/counter-evidence-iter-16.md:29-30]

## R3 — Use cached SessionStart summaries only under fidelity and freshness gates

**Rank:** 8  
**Score:** 7.1/10 — demoted because Public already ships adjacent startup substrate and the incremental win is conditional, not automatic.  
**Rationale:** V2 keeps the fast-path idea, but only as a guarded consumer on top of R2. The evidence now says cached startup can lower cost while still harming correctness if lossy summaries or heuristic session selection are treated as authoritative. [SOURCE: research/iterations/counter-evidence-iter-16.md:31-39] [SOURCE: research/iterations/combo-stress-test-iter-12.md:15-18]  
**Evidence:** [F-CROSS-046] [F-CROSS-060] [F-CROSS-071] [F-CROSS-086]  
**Depends on:** R2  
**Effort:** S  
**Acceptance criterion:** SessionStart uses cached summaries only when fidelity and freshness checks pass, and a frozen resume corpus shows equal-or-better pass rate relative to live reconstruction. [SOURCE: research/iterations/counter-evidence-iter-16.md:37-39]

## R4 — Ship a narrow graph-first PreToolUse nudge after scaffold and readiness checks

**Rank:** 2  
**Score:** 8.9/10 — one of the safest topology-preserving improvements, provided v2 keeps it narrow and explicit about prerequisites.  
**Rationale:** Public already has the hooks and routing substrate, and iter-16 kept this recommendation while warning against presenting it as a general-purpose router. The right v2 version is a structural-first nudge for known `Glob|Grep` misfires once graph readiness and activation scaffolding exist. [SOURCE: research/iterations/counter-evidence-iter-16.md:40-48] [SOURCE: research/iterations/public-infrastructure-iter-13.md:175-175]  
**Evidence:** [F-CROSS-035] [F-CROSS-038] [F-CROSS-056] [F-CROSS-082]  
**Depends on:** packet-level activation-scaffold surfacing  
**Effort:** S  
**Acceptance criterion:** Public ships a PreToolUse nudge that only fires for structural-first misfires after readiness checks, and a frozen task slice shows improved first-query routing without regressing non-structural tasks. [SOURCE: research/iterations/combo-stress-test-iter-12.md:19-31] [SOURCE: research/iterations/counter-evidence-iter-16.md:44-48]

## R5 — Harden graph payloads with validation plus separate provenance, evidence, and freshness fields

**Rank:** 5  
**Score:** 8.2/10 — still worth doing, but only after v2 drops the collapsed-confidence framing that made the original wording unsafe.  
**Rationale:** The validator remains a strong bounded move, but the “honest confidence labels” wording from v1 was too loose. In v2 this recommendation is explicitly downstream of the trust-axis split: validate the payload boundary and carry separate fields, not one cleaned-up truth score. [SOURCE: research/iterations/counter-evidence-iter-16.md:49-57] [SOURCE: research/iterations/cost-reality-iter-14.md:59-74]  
**Evidence:** [F-CROSS-041] [F-CROSS-064] [F-CROSS-079] [F-CROSS-083]  
**Depends on:** R10  
**Effort:** M  
**Acceptance criterion:** Code-graph payloads fail validation on malformed trust metadata, and consumer outputs preserve separate provenance/evidence/freshness fields end to end. [SOURCE: research/iterations/counter-evidence-iter-16.md:55-57] [SOURCE: research/iterations/public-infrastructure-iter-13.md:160-166]

## R6 — Add a detector regression harness as a floor, not as proof of user-visible quality

**Rank:** 6  
**Score:** 7.9/10 — low-risk and immediately useful, but v2 keeps it explicitly subordinate to later seam-level outcome testing.  
**Rationale:** Iter-16 kept this recommendation while warning that fixture coverage can overvalidate the wrong seam. The right framing is a non-regression floor before broader extraction work, not a proxy for user-visible structural quality. [SOURCE: research/iterations/counter-evidence-iter-16.md:58-66] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:35-55]  
**Evidence:** [F-CROSS-031] [F-CROSS-067]  
**Depends on:** none  
**Effort:** S  
**Acceptance criterion:** Public lands frozen detector fixtures that fail on structural regressions, and a follow-on task corpus is defined separately for user-visible structural quality claims. [SOURCE: research/iterations/counter-evidence-iter-16.md:62-66]

## R7 — Reframe the FTS capability cascade as low-priority memory-lane hardening

**Rank:** 10  
**Score:** 6.2/10 — the idea is still good, but v2 drops it to the bottom tier because the substrate is already mostly shipped.  
**Rationale:** Iter-13 and iter-14 both found that Public already has the FTS table, helper, and test coverage. That makes the remaining work real but strategically smaller: it is chosen-path telemetry and fallback clarity, not a pivotal adoption bet. [SOURCE: research/iterations/public-infrastructure-iter-13.md:177-177] [SOURCE: research/iterations/cost-reality-iter-14.md:8-10]  
**Evidence:** [F-CROSS-045] [F-CROSS-077]  
**Depends on:** none  
**Effort:** S  
**Acceptance criterion:** Memory search records which lexical path was chosen at runtime, exposes fallback status explicitly, and preserves current semantics when FTS5 is unavailable. [SOURCE: research/iterations/counter-evidence-iter-16.md:71-73]

## R8 — Treat the warm-start bundle as a conditional package, not the default early multiplier

**Rank:** 9  
**Score:** 6.8/10 — still worthwhile, but only after its components prove they preserve correctness under freshness-sensitive evaluation.  
**Rationale:** Iter-12 weakened Combo 1 and iter-16 explicitly told v2 to move it below its prerequisites. The bundle survives, but only for validated cases where summary fidelity and graph readiness are both high. [SOURCE: research/iterations/combo-stress-test-iter-12.md:40-45] [SOURCE: research/iterations/counter-evidence-iter-16.md:76-84]  
**Evidence:** [F-CROSS-038] [F-CROSS-060] [F-CROSS-068] [F-CROSS-086]  
**Depends on:** R2, R3, R4  
**Effort:** M  
**Acceptance criterion:** A frozen resume-plus-follow-up corpus shows lower cost with equal-or-better pass rate for the combined configuration than for the baseline and component-only variants. [SOURCE: research/iterations/counter-evidence-iter-16.md:80-84]

## R9 — Build the auditable-savings stack before dashboard publication

**Rank:** 3  
**Score:** 8.7/10 — v2 keeps this high because Public already has the observability substrate; the remaining risk is certainty laundering, not missing dashboards.  
**Rationale:** Iter-16 preserved this recommendation but made the contract requirement sharper: the stack is only useful if every field carries provenance and uncertainty status. The value is therefore governance over publication, not prettier charts. [SOURCE: research/iterations/counter-evidence-iter-16.md:85-93] [SOURCE: research/iterations/combo-stress-test-iter-12.md:51-80]  
**Evidence:** [F-CROSS-036] [F-CROSS-050] [F-CROSS-052] [F-CROSS-066] [F-CROSS-073] [F-CROSS-088]  
**Depends on:** R1  
**Effort:** M  
**Acceptance criterion:** Dashboard/reporting publication is blocked unless rows include uncertainty labels, schema versioning, and frozen-task methodology status, and published aggregate views exclude runs that fail that contract. [SOURCE: research/iterations/combo-stress-test-iter-12.md:58-67] [SOURCE: research/iterations/counter-evidence-iter-16.md:89-93]

## R10 — Separate trust axes and freshness authority before packaging structural artifacts

**Rank:** 4  
**Score:** 8.4/10 — this is the v2 replacement for old R10 and the key prerequisite the rigor lane exposed.  
**Rationale:** Combo 3 failed because provenance, evidence status, and freshness were treated as if one confidence field could carry all three. V2 should first create an explicit contract for those axes and only then reconsider artifact-default structural packaging. [SOURCE: research/iterations/combo-stress-test-iter-12.md:112-116] [SOURCE: research/iterations/counter-evidence-iter-16.md:94-100]  
**Evidence:** [F-CROSS-066] [F-CROSS-068] [F-CROSS-069] [F-CROSS-079] [F-CROSS-083] [F-CROSS-085]  
**Depends on:** none  
**Effort:** M  
**Acceptance criterion:** Shared structural payloads expose separate fields for parser provenance, evidence status, and freshness/authority, and no consumer-facing output collapses them into one scalar trust score. [SOURCE: research/iterations/counter-evidence-iter-16.md:53-57] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:27-30]
