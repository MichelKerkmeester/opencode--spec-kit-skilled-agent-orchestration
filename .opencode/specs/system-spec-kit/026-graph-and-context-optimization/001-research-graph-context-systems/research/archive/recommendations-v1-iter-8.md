# Ranked Recommendations

## R1 — Publish one honest token-measurement rule before any multiplier

**Rank:** 1
**Score:** 10/10 — it governs every later savings claim and prevents synthetic numbers from hardening into policy.
**Rationale:** Q-A concluded that Public already has useful telemetry, but not publication-grade token authority. Locking the rule first keeps every later experiment falsifiable instead of marketing-shaped. [SOURCE: research/iterations/q-a-token-honesty.md:115-125] [SOURCE: research/iterations/q-f-killer-combos.md:31-49]
**Evidence:** [F-CROSS-036] [F-CROSS-055]
**Depends on:** none
**Effort:** S
**Acceptance criterion:** Public publishes a frozen benchmark methodology that reports per-turn, per-query, per-session-start, and per-batch token totals with pass-rate scoring and provider-counted authorities. [SOURCE: research/iterations/q-a-token-honesty.md:115-125] [SOURCE: research/iterations/q-f-killer-combos.md:31-49]

## R2 — Compute deterministic summaries at Stop time

**Rank:** 2
**Score:** 9/10 — it unlocks faster resume paths and the analytics backbone without topology risk.
**Rationale:** Stop-time production is the cheapest place to make startup recall predictable. Q-D places it in P0 because it is a direct prerequisite for the warm-start lane and richer memory accounting. [SOURCE: research/iterations/q-d-adoption-sequencing.md:19-21] [SOURCE: research/iterations/q-a-token-honesty.md:81-92]
**Evidence:** [F-CROSS-047] [F-CROSS-064]
**Depends on:** R1
**Effort:** S
**Acceptance criterion:** Public persists deterministic per-session summaries at Stop time with stable transcript identity and fields that downstream startup and analytics consumers can reuse. [SOURCE: research/iterations/q-d-adoption-sequencing.md:19-21] [SOURCE: research/iterations/q-a-token-honesty.md:81-92]

## R3 — Add a cached SessionStart fast path for context summaries

**Rank:** 3
**Score:** 9/10 — it turns startup recall into a bounded lookup instead of repeated reconstruction.
**Rationale:** Claudest’s strongest contribution is not a headline ratio; it is the operational shape of a cheap producer and a cheap consumer. Public only gets that advantage once the Stop-time producer exists. [SOURCE: research/iterations/q-d-adoption-sequencing.md:33-35] [SOURCE: research/iterations/q-f-killer-combos.md:11-29]
**Evidence:** [F-CROSS-046] [F-CROSS-047]
**Depends on:** R2
**Effort:** S
**Acceptance criterion:** Session startup prefers a persisted `context_summary` path and falls back only when the cache is missing or invalid, with startup latency and prompt-size deltas recorded. [SOURCE: research/iterations/q-d-adoption-sequencing.md:33-35] [SOURCE: research/iterations/q-f-killer-combos.md:11-29]

## R4 — Teach first-query routing with a graph-first PreToolUse hook

**Rank:** 4
**Score:** 8/10 — it reinforces Public’s split instead of introducing a fourth retrieval owner.
**Rationale:** Q-C scored the hook as low-risk because it teaches the model to choose the right already-owned surface. That makes it one of the few behavioral nudges that directly improves composition instead of complicating it. [SOURCE: research/iterations/q-c-composition-risk.md:101-107] [SOURCE: research/iterations/q-d-adoption-sequencing.md:33-34]
**Evidence:** [F-CROSS-038] [F-CROSS-056]
**Depends on:** none
**Effort:** S
**Acceptance criterion:** Public ships a hook that nudges structural-first tasks toward `code_graph_query`, semantic-first tasks toward CocoIndex, and reports before/after first-query routing outcomes. [SOURCE: research/iterations/q-c-composition-risk.md:101-107] [SOURCE: research/iterations/q-d-adoption-sequencing.md:33-34]

## R5 — Harden graph payloads with schema validation and honest confidence labels

**Rank:** 5
**Score:** 8/10 — it improves structural trust without pretending semantic and structural certainty are the same.
**Rationale:** The safest structural hardening path is bounded: validate interchange contracts, keep AST-vs-regex provenance explicit, and add evidence labels only as additive fields. That combination gives downstream users better honesty without collapsing Public’s split. [SOURCE: research/iterations/q-c-composition-risk.md:93-123] [SOURCE: research/iterations/q-d-adoption-sequencing.md:21-23]
**Evidence:** [F-CROSS-028] [F-CROSS-041]
**Depends on:** none
**Effort:** M
**Acceptance criterion:** Public validates graph interchange payloads before ingestion and exposes provenance/evidence fields that distinguish extraction mode and confidence without collapsing them into one global truth score. [SOURCE: research/iterations/q-c-composition-risk.md:93-123] [SOURCE: research/iterations/q-d-adoption-sequencing.md:21-23]

## R6 — Add a detector regression harness before expanding structural extraction

**Rank:** 6
**Score:** 7/10 — it keeps later schema and route work from drifting silently.
**Rationale:** CodeSight’s F1 harness is a low-risk utility and an important sequencing rail. Public should capture that discipline before adding more extraction breadth or contract enrichment. [SOURCE: research/iterations/q-d-adoption-sequencing.md:24-26] [SOURCE: research/iterations/iteration-2.md:70-79]
**Evidence:** [F-CROSS-031] [F-CROSS-033]
**Depends on:** none
**Effort:** S
**Acceptance criterion:** Public maintains fixture-backed regression tests for structural detectors and blocks releases when route/schema extraction accuracy regresses on the frozen fixture set. [SOURCE: research/iterations/q-d-adoption-sequencing.md:24-26] [SOURCE: research/iterations/iteration-2.md:70-79]

## R7 — Adopt an internal FTS capability cascade inside Spec Kit Memory

**Rank:** 7
**Score:** 7/10 — it is medium effort but stays within one owner surface and improves graceful degradation.
**Rationale:** Q-C and Q-D both keep this lane inside Spec Kit Memory, where the real work is migration and fallback semantics rather than architecture. The benefit is not just better search but honest capability detection and cleaner browse/search separation later. [SOURCE: research/iterations/q-c-composition-risk.md:85-91] [SOURCE: research/iterations/q-d-adoption-sequencing.md:39-43]
**Evidence:** [F-CROSS-045] [F-CROSS-054]
**Depends on:** R1
**Effort:** M
**Acceptance criterion:** Public memory search detects available SQLite text-search capabilities at runtime, records the chosen path, and cleanly falls back through the documented cascade without changing calling semantics. [SOURCE: research/iterations/q-c-composition-risk.md:85-91] [SOURCE: research/iterations/q-d-adoption-sequencing.md:39-43]

## R8 — Ship the warm-start combo: Stop summaries + cached startup + graph-first routing

**Rank:** 8
**Score:** 9/10 — it is the top-ranked killer combo and the best early multiplier.
**Rationale:** This is the strongest combined move because it reduces two separate wastes at once: cold-start reconstruction and first-query wandering. It is also topology-safe, because it works by handing the model to better existing owners rather than by inventing a super-surface. [SOURCE: research/iterations/q-f-killer-combos.md:11-29] [SOURCE: research/iterations/q-d-adoption-sequencing.md:33-35]
**Evidence:** [F-CROSS-038] [F-CROSS-046] [F-CROSS-047] [F-CROSS-060]
**Depends on:** R2, R3, R4
**Effort:** M
**Acceptance criterion:** Public demonstrates lower session-start prompt cost, fewer first-query detours, and equal-or-better answer pass rate on a frozen resume-plus-follow-up task corpus for the combined configuration versus baseline. [SOURCE: research/iterations/q-f-killer-combos.md:11-29] [SOURCE: research/iterations/q-d-adoption-sequencing.md:33-35]

## R9 — Build the auditable-savings stack before publishing dashboards

**Rank:** 9
**Score:** 8/10 — it turns telemetry into evidence instead of decoration.
**Rationale:** The reporting combo is valuable because it forces Public to connect methodology, cost normalization, and stable dashboard contracts in the right order. Without that ordering, dashboards will merely make approximations look official. [SOURCE: research/iterations/q-f-killer-combos.md:31-49] [SOURCE: research/iterations/q-a-token-honesty.md:123-125]
**Evidence:** [F-CROSS-036] [F-CROSS-050] [F-CROSS-052] [F-CROSS-055]
**Depends on:** R1, R2
**Effort:** M
**Acceptance criterion:** Public publishes a dashboard contract that exposes medians and p90s for prompt tokens, returned tokens, latency, cache mix, and pass rate only for runs that satisfy the frozen-task methodology. [SOURCE: research/iterations/q-f-killer-combos.md:31-49] [SOURCE: research/iterations/q-a-token-honesty.md:123-125]

## R10 — Package trustworthy structural context as reusable static artifacts plus live overlays

**Rank:** 10
**Score:** 8/10 — it is the best structural packaging combo that stays honest about provenance.
**Rationale:** The structural combo matters because it lets Public expose durable structural context without pretending every signal is equally certain. It makes artifact generation useful precisely by carrying provenance and evidence forward into the overlay path. [SOURCE: research/iterations/q-f-killer-combos.md:51-69] [SOURCE: research/iterations/q-c-composition-risk.md:109-123]
**Evidence:** [F-CROSS-028] [F-CROSS-030] [F-CROSS-037]
**Depends on:** R5, R6
**Effort:** M
**Acceptance criterion:** Public can generate assistant-facing structural briefs that preserve extraction provenance and evidence labels, while the live overlay can answer follow-up questions without inventing a new retrieval owner. [SOURCE: research/iterations/q-f-killer-combos.md:51-69] [SOURCE: research/iterations/q-c-composition-risk.md:109-123]
