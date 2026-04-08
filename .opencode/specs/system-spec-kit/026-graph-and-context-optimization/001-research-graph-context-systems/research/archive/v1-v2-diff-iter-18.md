# Iteration 18 — V1↔V2 Diff Report (final iter)

> Comprehensive change log of what the rigor lane (iters 9-16) and v2 assembly (iter-17) produced.

## TL;DR
- `research-v2.md` is structurally strong: 13 core sections are present, citations grew from `125` to `229`, word count is `8698`, and `phase-N/` literals are gone.
- The one blocking validation failure is in `findings-registry-v2.json`: `tag: "new-cross-phase"` appears `31` times total (`23` newly added), which does not match the requested iter-15 patterns + iter-13 prerequisites target of `15`.
- V2 adds `23` findings, removes `0`, and substantively amends `65`; the biggest new themes are uncertainty hygiene, seam-level validation, freshness authority, Public moats, and hidden prerequisites.
- Combo 3 is now explicitly `FALSIFIED`; old R10 was replaced with a prerequisite trust-axis / freshness-authority contract.
- The recommendation set tightened materially: `R2`, `R3`, `R7`, and `R8` were downgraded; `R1`, `R4`, `R5`, `R6`, and `R9` survived with narrower wording; `R10` was replaced.
- The core v2 story is stronger than v1, but the packet is not fully validation-clean until the registry tag taxonomy is corrected.

## Validation results

### research-v2.md
| Check | Result |
|---|---|
| 13 sections present | pass (`13` core sections present; `2` extra appendices also present) |
| Citation count ≥ 125 | pass (`229`) |
| Word count 8000-12000 | pass (`8698`) |
| No phase-N/ literal paths | pass |
| Combo 3 marked FALSIFIED | pass |
| §12 has 4 patterns | pass |
| §13 has 8 moats + 11 prereqs | pass |
| v1→v2 changelog at top | pass |

### findings-registry-v2.json
| Check | Result |
|---|---|
| Parses | pass |
| Count 80-120 | pass (`88`) |
| All have evidence | pass |
| No broken paths | pass |
| new-cross-phase count matches | fail (`31` total tags; `23` newly added tags; requested target = `15` for iter-15 patterns + iter-13 prerequisites) |

### recommendations-v2.md
| Check | Result |
|---|---|
| 10 recs | pass |
| All fields present | pass |
| R10 = iter-16 replacement | pass |
| R2/R3/R7/R8 downgraded | pass |
| R1/R4/R5/R6/R9 kept | pass |
| All evidence in registry | pass |

## Findings delta

### Added in v2
| Finding ID | Tag | Title | Source iter |
|---|---|---|---|
| F-CROSS-079 | new-cross-phase | Trust-heavy cross-surface outputs are blocked by the missing evidence and freshness contract | iter-13 |
| F-CROSS-069 | new-cross-phase | Cost concentration sits at cross-surface contracts more than missing substrate | iter-15 |
| F-CROSS-083 | new-cross-phase | Boundary validation cannot become authoritative until a stable interchange artifact exists | iter-13 |
| F-CROSS-068 | new-cross-phase | Durable context repeatedly arrives before freshness authority is explicit | iter-15 |
| F-CROSS-076 | new-cross-phase | Public explicit split-topology contract is itself a moat worth preserving | iter-13 |
| F-CROSS-070 | new-cross-phase | Public already has a canonical recovery surface in session_bootstrap | iter-13 |
| F-CROSS-072 | new-cross-phase | Public five-channel retrieval fusion is a moat, not a gap to refill | iter-13 |
| F-CROSS-073 | new-cross-phase | Public already embeds a research-grade eval stack inside the shipped runtime | iter-13 |
| F-CROSS-086 | new-cross-phase | Public still lacks the canonical persisted Stop-summary artifact assumed by fast-start patterns | iter-13 |
| F-CROSS-066 | new-cross-phase | Precision laundering recurs across metrics, provenance, and pricing outputs | iter-15 |

**Total added:** `23`

### Removed in v2
| v1 ID | Reason removed | Source iter |
|---|---|---|
| — | None. V2 adds new findings and amends existing IDs, but does not remove any v1 finding IDs. | — |

**Total removed:** `0`

### Amended in v2
| ID | Before | After | Source iter |
|---|---|---|---|
| F-CROSS-060 | “The strongest combo is warm-start memory plus graph-first routing, not a new super-surface”; `adopt`; confidence `0.93` | “Warm-start memory plus graph-first routing survives only as a conditional bundle”; `adapt`; confidence `0.76`; effort `M` | iter-12, iter-16 |
| F-CROSS-047 | Stop-time summary lane treated as low-risk / small | Same finding kept, but risk rises `low → med` and effort becomes `M` | iter-13, iter-14, iter-16 |
| F-CROSS-046 | Cached SessionStart fast path treated as low-risk adoption | Same finding kept, but risk rises `low → med` and framing becomes conditional | iter-12, iter-13, iter-16 |
| F-CROSS-045 | Runtime FTS cascade had weaker evidence and no effort sizing | Confidence rises `0.74 → 0.83`; evidence refreshed; effort set to `S` | iter-13, iter-14 |
| F-CROSS-037 | Evidence-tagging / confidence score was medium-risk additive work | Reclassified to `high` risk with `Speculative` effort due trust-axis collision | iter-12, iter-13, iter-14, iter-16 |
| F-CROSS-030 | Static artifacts + overlay was medium-risk packaging | Reclassified to `high` risk and `L` effort | iter-13, iter-14 |
| F-CROSS-055 | Headline token-publication rule carried stronger confidence | Confidence reduced `0.94 → 0.78`; effort sized to `M`; wording made more provisional | iter-15, iter-16 |
| F-CROSS-064 | Evidence labeling was useful but loosely costed | Effort sized to `Speculative`; evidence refreshed around transport guarantees | iter-12, iter-14, iter-16 |
| F-CROSS-065 | Cached-summary fast path treated as a straightforward DB lookup win | Title and recommendation narrowed to “when fidelity checks pass”; `adopt → adapt`; effort `S` | iter-12, iter-16 |
| F-CROSS-061 | ENABLE_TOOL_SEARCH finding read like present-tense runtime proof | Narrowed to upstream evidence only, not current-turn runtime authority; `adopt → adapt` | iter-10, iter-16 |

**Total amended:** `65`

## Recommendations delta

### Rank changes
| Rec | v1 rank | v2 rank | Change | Verdict |
|---|---:|---:|---|---|
| R1 | 1 | 1 | — | KEEP |
| R2 | 2 | 7 | down 5 | DOWNGRADE |
| R3 | 3 | 8 | down 5 | DOWNGRADE |
| R4 | 4 | 2 | up 2 | KEEP |
| R5 | 5 | 5 | — | KEEP |
| R6 | 6 | 6 | — | KEEP |
| R7 | 7 | 10 | down 3 | DOWNGRADE |
| R8 | 8 | 9 | down 1 | DOWNGRADE |
| R9 | 9 | 3 | up 6 | KEEP |
| R10 | 10 | 4 | up 6 | REPLACE |

### Content changes per rec
- **R1 (KEEP):** “one honest token-measurement rule” became a “provisional honest measurement contract”; effort moved `S → M`; uncertainty labels are now explicit.
- **R2 (DOWNGRADE):** deterministic Stop summaries were demoted from a cheap backbone to a freshness-scoped artifact that `session_bootstrap` may prefer when valid; effort moved `S → M`.
- **R3 (DOWNGRADE):** cached SessionStart is no longer a default fast path; it now requires fidelity and freshness gates plus pass-rate preservation.
- **R4 (KEEP):** the hook is now a narrow graph-first nudge with readiness checks and an explicit activation-scaffold prerequisite.
- **R5 (KEEP):** “honest confidence labels” was replaced by separate provenance, evidence, and freshness fields; it now depends on the new R10 prerequisite.
- **R6 (KEEP):** the detector harness remains, but v2 explicitly says it is a floor for non-regression, not proof of user-visible quality.
- **R7 (DOWNGRADE):** the FTS cascade was reframed as low-priority memory hardening; dependency on `R1` was dropped and effort moved `M → S`.
- **R8 (DOWNGRADE):** the warm-start combo shifted from “best early multiplier” to a conditional bundle gated by correctness under freshness-sensitive evaluation.
- **R9 (KEEP):** dashboard publication wording tightened around per-field uncertainty labels and methodology gates; dependency on `R2` was dropped.
- **R10 (REPLACE):** old structural-artifact packaging was removed and replaced by a prerequisite contract to separate provenance, evidence status, and freshness authority.

## Sections added/changed in research.md → research-v2.md

| v2 section | Status | Why it changed | Source iter |
|---|---|---|---|
| §1 Executive summary | amended | Added rigor-lane caveats, substrate correction, and effort re-sizing | iter-9, iter-12, iter-13, iter-14 |
| §2 The 5 systems in one paragraph each | amended | Each system summary tightened around gap closures, honesty limits, and portability nuance | iter-10, iter-12, iter-13 |
| §3 Token-honesty audit table | amended | Reframed as a provisional uncertainty contract, not a frozen final rule | iter-15, iter-16 |
| §4 Capability matrix | amended | Clarified rubric limits and strengthened Public-baseline rationale | iter-9, iter-13 |
| §5 Cross-phase findings | amended | Folded in new cross-phase synthesis and stricter combo / seam framing | iter-10, iter-12, iter-13, iter-15, iter-16 |
| §6 Per-phase gap closure log | amended | Reclassified 4 partials to closed and 2 UNKNOWNs to UNKNOWN-confirmed | iter-10 |
| §7 Composition risk analysis | amended | Shifted from “missing substrate” toward “missing contracts” | iter-13, iter-15 |
| §8 Adoption roadmap | amended | Re-tiered effort and sequencing after reality-checking substrate and contract cost | iter-14, iter-16 |
| §9 License + runtime feasibility | amended | Named the stricter source-portability standard that v1 blurred | iter-9 |
| §10 Killer-combo analysis | amended | Combo 3 falsified; Combo 1 weakened to conditional; Combo 2 retained | iter-12, iter-16 |
| §11 Confidence statement + open questions | amended | Confidence lowered; unknown classes clarified | iter-9, iter-10, iter-12 |
| §12 New cross-phase patterns surfaced after iter-8 | added | Added 4 new 3+ phase patterns not owned by Q-A through Q-F | iter-15 |
| §13 Public's moats and hidden prerequisites | added | Added 8 moats and 11 hidden prerequisites that v1 under-described | iter-13 |

Additional structural delta: `research-v2.md` also adds `Appendix A` and `Appendix B` beyond the requested 13 core sections.

## Composite score trajectory

| Iter | Mission | Composite | NewInfoRatio | Direction |
|---|---|---:|---:|---|
| 1 | Inventory | 0.17 | 1.00 | baseline |
| 2 | Gap closure 1+2 | 0.64 | 0.42 | ↑ |
| 3 | Gap closure 3+4+5 | 0.81 | 0.31 | ↑ |
| 4 | Q-B capability matrix | 0.84 | 0.27 | ↑ |
| 5 | Q-A token honesty | 0.88 | 0.24 | ↑ |
| 6 | Q-E + Q-C | 0.91 | 0.21 | ↑ |
| 7 | Q-D + Q-F | 0.94 | 0.13 | ↑ |
| 8 | Final assembly v1 | 0.94 | 0.00 | converged |
| 9 | Skeptical review | 0.62 | 0.18 | ↓↓ honest reset |
| 10 | Gap re-attempt | 0.78 | 0.40 | ↑ |
| 11 | Citation audit | 0.80 | 0.30 | ↑ |
| 12 | Combo stress-test | 0.67 | 0.34 | ↓ Combo 3 falsified |
| 13 | Public infra inventory | 0.82 | 0.58 | ↑↑ |
| 14 | Cost reality check | 0.81 | 0.38 | ≈ |
| 15 | Pattern hunt | 0.79 | 0.33 | ≈ |
| 16 | Counter-evidence | 0.78 | 0.27 | ≈ |
| 17 | V2 assembly | 0.83 | 0.29 | ↑ |
| 18 | Final validation + diff | 0.82 | 0.08 | ↓ tag-taxonomy blocker |

## Falsifications (rare and significant)

- **Combo 3:** iter-12 showed incompatible confidence / trust semantics across the structural-artifact bundle, so v2 marks it `FALSIFIED` and moves it into considered-but-rejected status.
- **R10:** iter-16 replaced the old “trustworthy structural artifacts + overlays” recommendation because the trust premise inherited Combo 3’s broken assumptions.
- **No other full reversals:** Combo 1 weakened materially, but it survived as a conditional bundle rather than being falsified.

## Confirmations (recs that survived adversarial review)

- **R1:** iter-16 did not defeat the need for a measurement-governance contract; it only made the wording more provisional and honest.
- **R4:** the graph-first hook survived once narrowed to a structural-first nudge with readiness checks.
- **R6:** fixture-backed detector regression remained a valid low-risk floor even after the “validated one seam too early” critique.
- **R9:** the auditable-savings stack stayed high-value once publication certainty was made explicit instead of assumed.
- **R5:** it survived only after splitting provenance, evidence, and freshness, which is exactly why the replacement R10 became a prerequisite.

## Open questions remaining (UNKNOWN-confirmed from iter-10)

| Gap ID | Original UNKNOWN | iter-10 verdict | Reason |
|---|---|---|---|
| G1.Q8 | Edit-retry root-cause bucketing in phase 001 | UNKNOWN-confirmed | The source never exposes chain-level examples or cause labels. |
| G4.PT | Graphify PreToolUse hook effectiveness | UNKNOWN-confirmed | The hook exists and installs, but no behavior-change telemetry or before/after benchmark exists. |

## Final verdict

Is v2 the production deliverable Public should use? **with-caveats**

V2 is the right narrative and recommendation set to use going forward: it fixes the biggest v1 overstatements, preserves the core insights that survived adversarial review, and adds the missing cross-phase patterns plus Public-baseline context. The narrative file and recommendation file both validate cleanly against the requested checks. The blocker is narrower than “v2 is wrong”: the findings registry’s `new-cross-phase` taxonomy is over-assigned. Instead of matching the requested iter-15 patterns plus iter-13 prerequisite target, it tags all `23` newly added findings as `new-cross-phase`, including the `8` moat findings, for `31` total tagged findings in v2. That means the rigor lane is analytically complete, but the registry is not validation-clean enough to call the packet fully passed. A small follow-up retagging pass would likely convert this from `with-caveats` to `yes` without changing the actual v2 conclusions.
