# Iteration 16 — Counter-Evidence for Top 10 Recommendations

> Steel-manned counter-arguments for v2 hardening.

## TL;DR
- Severity split: `fatal=1`, `weakening=5`, `bounded=4`.
- The only fatal hit lands on `R10`: the current "trustworthy structural artifacts + overlays" framing inherits Combo 3's already-falsified trust-vocabulary collision. [SOURCE: research/iterations/combo-stress-test-iter-12.md:82-116]
- The biggest downgrade candidates are `R2`, `R3`, `R7`, and `R8`, mostly because freshness/authority debt or already-shipped substrate makes the current wording too strong. [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:57-75] [SOURCE: research/iterations/public-infrastructure-iter-13.md:177-179]
- The most common counter is not "bad idea" but "can start warm, polished, or measured while still being wrong." [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:13-30] [SOURCE: research/iterations/combo-stress-test-iter-12.md:15-44]
- Public already ships stronger continuity and observability substrate than v1 wording implied, so several recs are really about canonizing and constraining existing behavior rather than importing net-new capability. [SOURCE: research/iterations/public-infrastructure-iter-13.md:10-11] [SOURCE: research/iterations/public-infrastructure-iter-13.md:177-179]
- Cost reality matters to v2 wording: `R1` and `R2` are not clean `S` rails, and `R10` is still architectural/speculative as written. [SOURCE: research/iterations/cost-reality-iter-14.md:7-12] [SOURCE: research/iterations/cost-reality-iter-14.md:25-57]

## R1 — Publish one honest token-measurement rule before any multiplier
**Original claim:** Freeze one benchmark-honest measurement rule before any token-savings multiplier becomes policy.
**Counter-argument:** Freezing a publication rule too early can canonize partial observability. Public's telemetry is richer than before, but the measurement lane still spans thin producer rows, missing provider-counted publication fields, and known estimate/default leakage. A "frozen" rule can therefore turn a still-provisional accounting layer into policy-shaped precision and crowd out outcome-level benchmarking.
**Counter-evidence:** [SOURCE: research/iterations/cost-reality-iter-14.md:25-40] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:13-30] [SOURCE: research/iterations/combo-stress-test-iter-12.md:51-67]
**Severity:** bounded
**What defeats the counter:** The methodology stays explicitly provisional, carries `exact | estimated | defaulted | unknown` status on every published metric, and blocks multiplier headlines until provider-counted prompt/completion/cache fields exist.
**v2 verdict:** keep
**v2 reframing:** "Publish a provisional honest measurement contract before any multiplier, with exact-vs-estimated labeling and no headline savings ratios until provider-counted token fields exist."

## R2 — Compute deterministic summaries at Stop time
**Original claim:** Stop time is the cheapest place to create a reusable session summary for faster later startup.
**Counter-argument:** Stop-time summaries can become stale first-class artifacts before freshness and authority are specified. Public already has strong live recovery surfaces (`session_bootstrap`, startup briefs, compact-cache hooks), so a canonical Stop artifact introduced too early can duplicate or override better live recovery. It is also medium cross-surface producer/consumer wiring, not a small rail.
**Counter-evidence:** [SOURCE: research/iterations/cost-reality-iter-14.md:42-57] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:57-75] [SOURCE: research/iterations/public-infrastructure-iter-13.md:9-10] [SOURCE: research/iterations/public-infrastructure-iter-13.md:167-167]
**Severity:** weakening
**What defeats the counter:** The summary is treated as one freshness-scoped input to `session_bootstrap`, carries producer/timestamp/scope metadata, and yields cleanly to live recovery when stale, missing, or mismatched.
**v2 verdict:** downgrade
**v2 reframing:** "Add a freshness-scoped persisted Stop summary artifact that bootstrap may prefer when valid, without replacing live recovery authority."

## R3 — Add a cached SessionStart fast path for context summaries
**Original claim:** Startup should prefer a persisted `context_summary` path instead of reconstructing history on every resume.
**Counter-argument:** Cached startup only wins if the cached summary is both faithful and the right session is selected. The stress test found lossy summarization, heuristic session selection, narrow hook coverage, and freshness mismatch; Public also already ships compact-cache and startup-brief equivalents, so the incremental win is conditional rather than automatic.
**Counter-evidence:** [SOURCE: research/iterations/combo-stress-test-iter-12.md:15-35] [SOURCE: research/iterations/combo-stress-test-iter-12.md:40-44] [SOURCE: research/iterations/public-infrastructure-iter-13.md:178-178]
**Severity:** weakening
**What defeats the counter:** A frozen resume corpus shows equal-or-better answer pass rate, not just prompt reduction, and the fast path is guarded by freshness/fidelity checks with explicit fallback to live reconstruction.
**v2 verdict:** downgrade
**v2 reframing:** "Use cached `context_summary` at SessionStart only when freshness and fidelity checks pass; otherwise fall back to live bootstrap and measure pass-rate deltas, not just prompt-size deltas."

## R4 — Teach first-query routing with a graph-first PreToolUse hook
**Original claim:** A graph-first hook can nudge the first live query toward the right already-owned retrieval surface.
**Counter-argument:** The hook is narrower than the current recommendation implies. The stress test showed it only catches one class of bad first move (`Glob|Grep`) and only when the graph is already ready; if the real first mistake is stale-summary interpretation, a semantic miss, or a memory-first task, the hook does nothing. The roadmap also gave it an activation-scaffold prerequisite that v1 dropped.
**Counter-evidence:** [SOURCE: research/iterations/combo-stress-test-iter-12.md:18-31] [SOURCE: research/iterations/q-d-adoption-sequencing.md:31-34]
**Severity:** weakening
**What defeats the counter:** v2 frames it as a narrow structural-first nudge after graph-readiness and activation-scaffold checks, not as a general-purpose first-query router.
**v2 verdict:** keep
**v2 reframing:** "Ship a graph-first PreToolUse nudge for structural-first `Glob|Grep` misfires once activation scaffolding and graph readiness are in place, then measure first-query routing outcomes."

## R5 — Harden graph payloads with schema validation and honest confidence labels
**Original claim:** Public should validate graph payloads and expose confidence/provenance fields that make structural answers more trustworthy.
**Counter-argument:** "Honest confidence labels" can still precision-launder if multiple trust axes get collapsed into one field. The stress test found exactly that failure mode across systems: extraction method, evidence status, and freshness are orthogonal, and Public still lacks one cross-surface confidence schema. A badly designed confidence field can mislead more cleanly than today's rough edges.
**Counter-evidence:** [SOURCE: research/iterations/combo-stress-test-iter-12.md:87-116] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:27-30] [SOURCE: research/iterations/public-infrastructure-iter-13.md:9-9] [SOURCE: research/iterations/public-infrastructure-iter-13.md:160-160]
**Severity:** weakening
**What defeats the counter:** v2 requires separate fields for parser provenance, evidence status, and artifact freshness, and forbids one global numeric truth score.
**v2 verdict:** keep
**v2 reframing:** "Harden graph payloads with schema validation plus separate provenance, evidence-status, and freshness fields instead of one collapsed confidence score."

## R6 — Add a detector regression harness before expanding structural extraction
**Original claim:** Freeze detector quality on fixtures before widening extraction breadth.
**Counter-argument:** A fixture harness can overvalidate the wrong seam. Iter-15 showed a recurring pattern where systems validate local mechanics while the claimed user-visible outcome remains untested, and gap reattempts still found real blind spots outside the scored detector lane. Treated as sufficient proof, the harness could justify expansion prematurely.
**Counter-evidence:** [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:35-55] [SOURCE: research/iterations/public-infrastructure-iter-13.md:171-173]
**Severity:** bounded
**What defeats the counter:** The harness is framed as a necessary non-regression rail, then paired with a second seam-level outcome lane for structural follow-up quality before broader extraction claims are made.
**v2 verdict:** keep
**v2 reframing:** "Add a detector regression harness as a non-regression floor before expansion, but do not treat fixture F1 alone as proof of user-visible structural quality."

## R7 — Adopt an internal FTS capability cascade inside Spec Kit Memory
**Original claim:** A runtime FTS capability cascade improves graceful degradation while staying inside one owner surface.
**Counter-argument:** As a top-10 strategic recommendation, this may be adoption theater. Iter-13/14 found that Public already ships FTS5 tables, an FTS module, runtime capability helpers, and dedicated coverage; the remaining work looks more like cleanup and observability hardening than a pivotal adoption move. Ranking it too high may spend priority budget on a lane that is mostly already present.
**Counter-evidence:** [SOURCE: research/iterations/cost-reality-iter-14.md:8-10] [SOURCE: research/iterations/public-infrastructure-iter-13.md:177-181] [SOURCE: research/iterations/public-infrastructure-iter-13.md:198-198]
**Severity:** bounded
**What defeats the counter:** There is still a real fallback-observability or runtime-capability gap to close, and v2 repositions the work as opportunistic hardening rather than as a central strategic bet.
**v2 verdict:** downgrade
**v2 reframing:** "Treat FTS capability cascade as targeted memory-lane hardening: make chosen-path telemetry and fallback semantics explicit, but lower its strategic ranking because most substrate is already shipped."

## R8 — Ship the warm-start combo: Stop summaries + cached startup + graph-first routing
**Original claim:** Combining Stop summaries, cached startup, and graph-first routing is the best early multiplier.
**Counter-argument:** The combo can start warm but wrong. The stress test already weakened Combo 1 because summaries are lossy, session selection is heuristic, the hook only catches a narrow first-move class, and startup freshness can diverge from live graph state. Packaging that stack as a top combo risks turning a conditional pattern into a default.
**Counter-evidence:** [SOURCE: research/iterations/combo-stress-test-iter-12.md:15-44] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:57-75]
**Severity:** weakening
**What defeats the counter:** A frozen resume-plus-follow-up corpus shows lower cost with equal-or-better pass rate, and the combo is gated on summary fidelity plus graph readiness.
**v2 verdict:** downgrade
**v2 reframing:** "Treat the warm-start combo as a conditional bundle for cases with validated Stop-summary fidelity and graph freshness, not as the universal early multiplier."

## R9 — Build the auditable-savings stack before publishing dashboards
**Original claim:** Public should build the methodology-plus-dashboard stack that makes savings claims auditable instead of decorative.
**Counter-argument:** Even correctly sequenced dashboards can still precision-launder defaults, heuristics, and unknown-model fallbacks. Public already has strong observability substrate, so the real risk is not missing dashboards but missing uncertainty contracts; without them, an auditable-looking surface can still overclaim.
**Counter-evidence:** [SOURCE: research/iterations/combo-stress-test-iter-12.md:51-80] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:13-30] [SOURCE: research/iterations/public-infrastructure-iter-13.md:11-11] [SOURCE: research/iterations/public-infrastructure-iter-13.md:179-179]
**Severity:** bounded
**What defeats the counter:** The stack publishes provenance on every field, distinguishes exact from estimated/defaulted values, and refuses dashboard publication for runs that fail the frozen-task methodology.
**v2 verdict:** keep
**v2 reframing:** "Build the auditable-savings stack before dashboards, and require per-metric uncertainty labels plus provider-counted token authority for any published headline view."

## R10 — Package trustworthy structural context as reusable static artifacts plus live overlays
**Original claim:** Public can package trustworthy structural context into durable artifacts and live overlays without inventing a new retrieval owner.
**Counter-argument:** The trust claim is already broken. Combo 3 was falsified because confidence semantics collide across sources, one extraction path already overclaims `ast`, static artifacts create a stale first-source-of-truth problem, and Graphify-style exports invent numeric confidence defaults. In its current form, this recommendation packages ambiguity, not trustworthy structure.
**Counter-evidence:** [SOURCE: research/iterations/combo-stress-test-iter-12.md:82-116] [SOURCE: research/iterations/cost-reality-iter-14.md:7-12] [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:57-75]
**Severity:** fatal
**What defeats the counter:** First separate provenance, evidence, and freshness axes; fix mislabeled extractor paths; add freshness authority and stale fallback; then re-evaluate packaging as a later follow-on.
**v2 verdict:** replace
**v2 reframing:** "Replace with a prerequisite contract rec: separate trust axes and freshness authority before attempting reusable structural artifacts or overlay-default packaging."

## Severity distribution
| Severity | Count | R IDs |
|---|---:|---|
| fatal | 1 | R10 |
| weakening | 5 | R2, R3, R4, R5, R8 |
| bounded | 4 | R1, R6, R7, R9 |

## v2 verdict distribution
| Verdict | Count | R IDs |
|---|---:|---|
| keep | 5 | R1, R4, R5, R6, R9 |
| downgrade | 4 | R2, R3, R7, R8 |
| replace | 1 | R10 |
| remove | 0 | — |

## Patterns observed
- Freshness and authority debt is the dominant counter across durable-context recommendations (`R2`, `R3`, `R8`, `R10`). [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:57-75]
- Precision laundering recurs anywhere exported metrics or trust labels appear (`R1`, `R5`, `R9`, `R10`). [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:13-30]
- Several recommendations are weaker because Public already ships much of the substrate; the real work is contract tightening, not capability import. [SOURCE: research/iterations/public-infrastructure-iter-13.md:8-11] [SOURCE: research/iterations/public-infrastructure-iter-13.md:177-181]
- The hardest remaining work sits at cross-surface contract seams, not inside single owner surfaces. [SOURCE: research/iterations/cross-phase-patterns-iter-15.md:77-93] [SOURCE: research/iterations/public-infrastructure-iter-13.md:9-9]

## Recommendations for iter-17 (v2 assembly)
- R1: keep first, but change "frozen rule" to "provisional honest contract" until provider-counted fields exist.
- R2: lower confidence and rank; make freshness-scoped summary artifact subordinate to `session_bootstrap`, not replacement authority.
- R3: make pass-rate preservation the gate; do not sell cached startup on prompt-size reduction alone.
- R4: keep, but explicitly add the activation-scaffold dependency and narrow the claim to structural-first first-query nudges.
- R5: keep only if v2 splits provenance, evidence status, and freshness into separate fields.
- R6: keep as a floor, but add a note that fixture F1 is not enough to justify user-visible outcome claims.
- R7: demote toward cleanup/hardening tier unless iter-17 can show a still-missing runtime fallback observability gap.
- R8: move below its prerequisites and describe it as a conditional bundle, not the default early multiplier.
- R9: keep, but require per-field uncertainty labels in the dashboard contract language.
- R10: remove as written and replace with a prerequisite contract recommendation around trust-axis separation plus freshness authority.
- Ranking should change in v2: `R1` can stay first, `R10` should leave the current top-10 form entirely, `R8` should fall below `R2`-`R4`, and `R7` should move toward the lower end because it is mostly hardening over shipped substrate.
