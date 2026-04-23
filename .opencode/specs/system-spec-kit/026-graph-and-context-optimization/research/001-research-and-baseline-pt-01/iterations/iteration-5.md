# Iteration 5 — Cheapest-Next-Action Synthesis (Q5)

## Focus
Rank the cheapest remaining moves across P0 remediations, taxonomy cleanup, recommendation-rescue, and blind-spot closure so Q5 ends with one concrete next action rather than another broad backlog.

This pass stayed synthesis-only: it reused iteration 1-4 evidence to score which single action buys the most convergence per operator hour.

## Actions Taken
- Re-read iter-1's gap inventory to recover the original 67-gap map and the taxonomy/citation defect sources.
- Re-read iter-2's taxonomy audit to recover the exact `15 genuine / 16 mis-tagged / 1 ambiguous` split for `new-cross-phase`.
- Re-read iter-3's severity and blind-spot tables to reuse the five P0 gaps and six blind spots with their cheapest-remediation estimates.
- Re-read iter-4's survival audit plus the live ranked recommendation file to map which downgraded recommendations still have plausible rescue paths.
- Scored every candidate as `IMPACT / EFFORT`, using recommendation flips, P0 closure, validator-pass impact, and blind-spot reach as the impact basis.

## Findings

### Candidate Pool (all lanes)

| Cand-ID | Lane | Label | Source | IMPACT (1-10) | EFFORT (hours) | SCORE | Rationale |
|---------|------|-------|--------|---------------|----------------|-------|-----------|
| C-01 | P0-Gap | Bound Matrix multi-agent writes with explicit conflict semantics | GAP-013 | 6.0 | 0.75 | 8.0 | Closes a true P0 correctness gap, but it only firms the Contextador write-path claim and does not flip any current ranked recommendation. Effort assumes rereading the packet section, adding the bounded caveat, and rerunning a local wording sanity pass. [SOURCE: iteration-3.md:18] [SOURCE: iteration-3.md:86] |
| C-02 | P0-Gap | Add webhook idempotency, secret-rotation, and routed-failure caveats | GAP-014 | 6.0 | 0.75 | 8.0 | Removes a P0 security/reliability omission, yet its convergence gain is still local to one lane and does not change the current keep/downgrade split. Effort is one bounded doc/evidence patch plus a quick re-audit of the cited lane. [SOURCE: iteration-3.md:19] [SOURCE: iteration-3.md:86] |
| C-03 | P0-Gap | Reassert Q-E's two-column portability rule as the license standard | GAP-031 | 6.0 | 0.75 | 8.0 | Closes the only licensing-exposure P0, but it mainly stabilizes one governing rule rather than re-ranking the surviving recommendation set. Effort covers reread, patch, and one validation pass over the affected licensing section. [SOURCE: iteration-3.md:20] [SOURCE: iteration-3.md:86] |
| C-04 | P0-Gap | Keep artifact-default structural packaging blocked until trust axes split | GAP-059 | 8.0 | 0.75 | 10.7 | This directly locks in the iter-4 decision to withdraw Combo 1 and preserves replacement R10 as the prerequisite lane, so it removes a still-dangerous false comeback path with very little work. Effort is modest because the evidence already exists; the follow-up is mostly codifying the guardrail. [SOURCE: iteration-3.md:21] [SOURCE: iteration-4.md:77-79] [SOURCE: recommendations.md:95-103] |
| C-05 | P0-Gap | Retag over-assigned `new-cross-phase` findings and rerun registry validation | GAP-060 | 6.5 | 0.75 | 8.7 | As an isolated P0 fix, this repairs the registry defect that left 16 excess `new-cross-phase` tags, but by itself it does not fully reconcile the broader Q2a taxonomy story. Effort includes the registry edit and one validator rerun. [SOURCE: iteration-3.md:22] [SOURCE: iteration-3.md:86-88] [SOURCE: iteration-2.md:13-23] |
| C-06 | Taxonomy | Retag the 16 misassigned `new-cross-phase` findings, resolve `F-CROSS-056`, and rerun v2 validation | Q2a | 9.0 | 0.75 | 12.0 | This is the cheapest action that clears the only hard-failure left from iter-18: it collapses the taxonomy back to the validated 15 genuine cross-phase findings, handles the one ambiguous row, and turns Q2a from "known artifact" into "closed with evidence." Effort stays low because iter-2 already enumerated the exact `11 extended + 4 confirmed + 1 ambiguous` retag set. [SOURCE: iteration-2.md:13-24] [SOURCE: iteration-2.md:57-62] [SOURCE: iteration-3.md:86-88] |
| C-07 | Rec-Rescue | Rescue R2 with a freshness-scoped Stop-summary wrapper plus producer, invalidation, RBAC, and retention gates | R2 | 8.0 | 1.50 | 5.3 | This is the cheapest plausible path to flipping R2 from DOWNGRADE back to KEEP, but it still has to answer BS-002, BS-003, BS-005, and BS-006 before the wrapper is safe. Effort includes both the metadata contract and the guardrail review that iter-4 said is still missing. [SOURCE: iteration-4.md:69] [SOURCE: iteration-4.md:52-53] [SOURCE: recommendations.md:15-23] |
| C-08 | Rec-Rescue | Rescue R3 with a frozen resume corpus plus fidelity/freshness gates for cached SessionStart | R3 | 7.0 | 2.00 | 3.5 | R3 can still be re-promoted, but only after R2 exists and a corpus proves cached startup is no worse than live reconstruction; that makes it a longer dependency chain for modest convergence gain. Effort includes corpus assembly, gated-consumer design, and comparison reruns. [SOURCE: iteration-4.md:70] [SOURCE: iteration-4.md:53] [SOURCE: recommendations.md:25-33] |
| C-09 | Rec-Rescue | Rescue R7 with a truthful forced-degrade matrix and runtime path logging for FTS fallback | R7 | 6.0 | 0.75 | 8.0 | This is the cheapest recommendation rescue in lane 3 because the substrate already exists and the missing work is mostly truthfulness/telemetry hardening; a clean result could move R7 from DOWNGRADE back to KEEP. Its ceiling is still limited because iter-4 kept it low priority even before the blind-spot pass. [SOURCE: iteration-4.md:74] [SOURCE: iteration-4.md:57] [SOURCE: recommendations.md:65-73] |
| C-10 | Rec-Rescue | Rescue R8 with a prerequisite-proofed warm-start corpus across R2+R3+R4 | R8 | 8.0 | 3.00 | 2.7 | R8 remains the most expensive rescue because it depends on multiple other lanes proving out first; only then could the warm-start bundle move above DOWNGRADE. The upside is real, but the dependency stack makes the marginal-convergence-per-hour poor. [SOURCE: iteration-4.md:75] [SOURCE: iteration-4.md:58] [SOURCE: recommendations.md:75-83] |
| C-11 | Blind-Spot | Close BS-001 by documenting multi-tenant/operator-boundary assumptions | BS-001 | 5.0 | 0.75 | 6.7 | This would narrow uncertainty for R2, R3, and R8, but iter-3 explicitly said it would not overturn the current single-developer ordering by itself. Effort is small, but so is the expected ranking change. [SOURCE: iteration-3.md:94] |
| C-12 | Blind-Spot | Close BS-002 by scoring RBAC, auditability, and policy delegation across surviving recs | BS-002 | 7.0 | 0.75 | 9.3 | This is a cheap way to revisit four live recommendations at once: iter-4 says BS-002 weakens R2, R4, R8, and R9, so closing it could tighten adoption order without re-running the whole packet. Effort is mostly a bounded cross-rec scoring pass. [SOURCE: iteration-3.md:95] [SOURCE: iteration-4.md:52-60] |
| C-13 | Blind-Spot | Close BS-003 by comparing rollback, corruption-recovery, and stale-cache restore paths | BS-003 | 8.5 | 1.00 | 8.5 | This is the highest-materiality blind-spot close because iter-3 named it the biggest missing axis, and iter-4 shows it directly weakens R2, R3, R4, and R8 while helping invalidate Combo 1. Effort is higher than the taxonomy or RBAC passes because it needs a real cross-substrate recovery comparison. [SOURCE: iteration-3.md:96-101] [SOURCE: iteration-4.md:52-61] |
| C-14 | Blind-Spot | Close BS-004 by estimating sunk-cost exposure for downgraded and replaced recs | BS-004 | 4.0 | 0.50 | 8.0 | This improves prioritization hygiene, but iter-3 already framed it as an economics-only axis that does not change correctness. It is cheap, but mostly informs sequencing rather than overturning verdicts. [SOURCE: iteration-3.md:97] |
| C-15 | Blind-Spot | Close BS-005 by rating each surviving rec against current Public substrate churn | BS-005 | 7.0 | 0.75 | 9.3 | This blind-spot touches more of the active board than any other cheap research pass: iter-4 shows BS-005 weakens R2, R3, R4, R7, and R8 and contributes to Combo 1's invalidation. Closing it would quickly separate "cheap now" from "cheap until the next substrate change." [SOURCE: iteration-3.md:98] [SOURCE: iteration-4.md:52-61] |
| C-16 | Blind-Spot | Close BS-006 by defining retention, redaction, and deletion rules for copied-memory patterns | BS-006 | 6.0 | 0.75 | 8.0 | This would sharpen the safety envelope for R2, R3, R8, and R9, but iter-3 treated it as gating for copied-memory patterns rather than a broad ranking reset. Effort is moderate because it is mostly policy framing, not a new measurement corpus. [SOURCE: iteration-3.md:99] [SOURCE: iteration-4.md:52-62] |

### Top-5 Ranked

| Rank | Cand-ID | Label | Score | Why it wins |
|------|---------|-------|-------|-------------|
| 1 | C-06 | Retag the 16 misassigned `new-cross-phase` findings, resolve `F-CROSS-056`, and rerun v2 validation | 12.0 | It is the only sub-hour move that clears the packet's last hard validation failure and converts Q2a from a known artifact into a closed surface. [SOURCE: iteration-2.md:13-24] [SOURCE: iteration-2.md:57-62] |
| 2 | C-04 | Keep artifact-default structural packaging blocked until trust axes split | 10.7 | It cheaply hardens the new Q4 outcome by preventing Combo 1 from re-entering the roadmap before R10's trust-axis prerequisite lands. [SOURCE: iteration-4.md:77-79] [SOURCE: recommendations.md:95-103] |
| 3 | C-15 | Close BS-005 by rating each surviving rec against current Public substrate churn | 9.3 | It cheaply touches the widest live uncertainty surface after taxonomy: R2, R3, R4, R7, and R8 all weaken under churn pressure today. [SOURCE: iteration-3.md:98] [SOURCE: iteration-4.md:52-61] |
| 4 | C-12 | Close BS-002 by scoring RBAC, auditability, and policy delegation across surviving recs | 9.3 | It is the fastest governance-oriented pass that could tighten adoption order for R2, R4, R8, and R9 without reopening the whole packet. [SOURCE: iteration-3.md:95] [SOURCE: iteration-4.md:52-60] |
| 5 | C-13 | Close BS-003 by comparing rollback, corruption-recovery, and stale-cache restore paths | 8.5 | It costs more than the top four, but it is the highest-materiality blind-spot and directly explains why several substrate-heavy recs remain fragile. [SOURCE: iteration-3.md:96-101] [SOURCE: iteration-4.md:52-61] |

### The Single Best Next Action

**Do C-06 next:** run a bounded taxonomy-remediation pass against the legacy packet's `research/findings-registry.json`, retag the `11` rows that iter-2 marked `retag_to_extended`, retag the `4` moat-style rows to `phase-1-confirmed`, resolve the one ambiguous `F-CROSS-056` classification, then rerun the same registry/validator checks that failed in iter-18. The expected gain is immediate: one sub-hour pass removes the only surviving hard failure, stabilizes the cross-phase evidence surface back to the validated `15` rows, and materially lowers uncertainty around whether the v2 package is blocked by real substantive defects or just residual taxonomy debt. [SOURCE: iteration-2.md:16-23] [SOURCE: iteration-2.md:57-62]

### Diminishing-returns inflection

The top-5 score band runs from **12.0 down to 8.5**. After rank 5, the board falls into the **8.0-and-below** tier, where actions mostly either rescue one downgraded recommendation at a time (R7) or tighten narrative precision without moving the current verdict set. That makes **rank 6** the natural inflection: beyond the top five, extra work is still useful, but it buys mostly local cleanup instead of packet-level convergence.

## Questions Answered
- [x] Q1, Q2, Q3, Q4 unchanged.
- [x] Q5 — top-5 ranked candidate list with single-best-next-action produced.

## Questions Remaining
- None remaining. All 5 key questions are answered.

## Next Focus
SYNTHESIS — compile `research/001-research-and-baseline-pt-01/research.md` consolidating all iter-1..5 findings, plus convergence report. No more iterations needed unless new evidence emerges during synthesis.
