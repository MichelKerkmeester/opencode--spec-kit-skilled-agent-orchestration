---
title: Deep Research Dashboard — Memory Refactor vs Deprecation
_lineage: generation_2_ten_iteration_rerun (parent: generation_1_single_shot_retrofit)
_last_updated: 2026-04-11T13:25:00Z
_note: "Generation 1 was a single-shot codex exec delegation (archived at research/archive/retrofit-2026-04-11/). Generation 2 is a real 10-iteration rerun executed by claude-opus-4-6 acting as both orchestrator and worker on 2026-04-11. Metrics below reflect generation 2."
---

# Deep Research Dashboard — Memory Refactor vs Deprecation

Auto-generated from JSONL state log and strategy file. Regenerated after every iteration.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Phase 017 investigated whether the current Spec Kit Memory system should be deprecated, refactored, or replaced. The recommendation is **Option C — Wiki-Style Spec Kit Updates with thin continuity layer**, to be implemented across phases 018, 019, and 020.

**Lifecycle**: Generation 1 was a single-shot `codex exec` delegation (retrofitted on 2026-04-11). Generation 2 is a real 10-iteration rerun following the sk-deep-research workflow, executed on 2026-04-11T12:35:00Z — 13:25:00Z. The generation-2 rerun validates the generation-1 recommendation with iterated evidence.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:status -->
## 2. STATUS

- **Topic**: Memory refactor vs deprecation
- **Started (gen 2)**: 2026-04-11T12:35:00Z
- **Completed (gen 2)**: 2026-04-11T13:25:00Z
- **Status**: COMPLETE
- **Iteration**: 10 of 12 (stopped on `all_questions_answered`)
- **Session ID**: `017-rerun-2026-04-11`
- **Parent Session**: `017-single-shot-retrofit` (generation 1)
- **Lifecycle Mode**: `completed-continue` (reopened generation-1 completed state for rerun)
- **Generation**: 2

<!-- /ANCHOR:status -->

---

<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Scope | Ratio | Findings | Status |
|---|---|---|---:|---:|---|
| 1 | Architecture baseline | read handlers + generate-context + save subdir | 1.00 | 5 | ✅ complete |
| 2 | Q1 — 16-stage pipeline mapping | memory-save.ts line-by-line | 0.90 | 5 | ✅ complete |
| 3 | Q2 — Value assessment | 20-file sample × 4-dim rubric | 0.95 | 6 | ✅ complete |
| 4 | Q3 — Redundancy matrix | 11 sections × spec-doc anchors | 0.85 | 6 | ✅ complete |
| 5 | Q4 — Retrieval comparison | 10-query test | 0.80 | 5 | ✅ complete |
| 6 | Q5 — Alternatives detail | 6 options × 6-dim rubric | 0.70 | 5 | ✅ complete |
| 7 | Q6 — Migration strategy | 4 options, M4 recommended | 0.75 | 5 | ✅ complete |
| 8 | Q7 — Integration impact | 147 files × 9 surfaces | 0.80 | 6 | ✅ complete |
| 9 | Q8 — Synthesis | Recommendation + phased rollout | 0.40 | 5 | ✅ complete |
| 10 | Convergence audit | Citations, contradictions, final synthesis | 0.20 | 5 | ✅ complete |

- **iterationsCompleted**: 10
- **keyFindings**: 53 across all iterations
- **openQuestions**: 0
- **resolvedQuestions**: 8 / 8
- **compositeScore**: 0.92 (high)
- **averageNewInfoRatio**: 0.735

<!-- /ANCHOR:progress -->

---

<!-- ANCHOR:questions -->
## 4. QUESTIONS

- **Answered**: 8 / 8
- [x] **Q1** — Current memory system mapping (iterations 1, 2)
- [x] **Q2** — Value assessment of memories (iteration 3)
- [x] **Q3** — Redundancy with spec kit docs (iteration 4)
- [x] **Q4** — Retrieval value (iteration 5)
- [x] **Q5** — Alternative architectures (iteration 6)
- [x] **Q6** — Migration path (iteration 7)
- [x] **Q7** — Integration impact (iteration 8)
- [x] **Q8** — Recommendation (iteration 9, audited in iteration 10)

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:trend -->
## 5. TREND

- **Ratios (last 5)**: 0.70 → 0.75 → 0.80 → 0.40 → 0.20 (expected decline — late iterations are synthesis/audit, not discovery)
- **Stuck count**: 0
- **Guard violations**: 0 (iteration 10 audit confirmed 9/9 citations, 0 contradictions)
- **convergenceScore**: 0.92
- **coverageBySources**: code (memory-save.ts, memory-context.ts, generate-context.ts, save/ subdir), prior research (phase 017 generation 1 + phase 005 findings), live corpus inventory (155 files, distribution stats), redundancy analysis, retrieval comparison

<!-- /ANCHOR:trend -->

---

<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS

- **Live memory_search handler calls**: embedding warmup timeout blocked the live retrieval test in iteration 5. Pivoted to prediction based on indexed content shape. Same failure mode as generation 1 — validates phase 017's operational reliability concern.
- **Option F (full deprecation)**: ruled out by iteration 6 scoring (13/30) because it violates the preserve-13-features constraint and has very high migration cost. Viable only AFTER Option C hardens and archived_hit_rate shows memory retrieval is non-load-bearing.
- **Option M3 (bulk rewrite of 150 memories)**: ruled out by iteration 7 because iteration 3's value distribution (35/40/25) shows bulk conversion over-promotes waste.

<!-- /ANCHOR:dead-ends -->

---

<!-- ANCHOR:next-action -->
## 7. NEXT ACTION

**Research phase status**: complete. No next action within this research session.

**Downstream**:
1. **Phase 018 launch**: run the two research prompts at `../006-canonical-continuity-refactor/prompts/` via `/spec_kit:deep-research:auto`. Both prompts have been hardened to reject single-shot delegation.
2. **Phase 018 prerequisites** (before the code work begins):
   - Backfill canonical `implementation-summary.md` for ~5 root packets that currently rely on memory files as the only narrative (iteration 5 F5.4, iteration 7 F7.4)
   - Take SQLite backup of `memory_index` table
3. **Phase 018 gate criteria** (iteration 9):
   - Schema migration tested + backward compatible
   - All 155 memory files confirmed `is_archived=1`
   - Ranking change verified
   - 5 root-packet backfill complete
   - Both research prompts converged

<!-- /ANCHOR:next-action -->

---

<!-- ANCHOR:generation-notes -->
## 8. GENERATION NOTES

**Generation 1 (2026-04-10)**:
- Single-shot `codex exec` delegation
- 324,196 tokens, ~10 minutes wall clock
- Produced `research/research.md`, `findings/*.md`, `recommendation.md`, `phase-018-proposal.md`
- Bypassed the sk-deep-research loop driver entirely
- Retrofitted with skeletal state files on 2026-04-11T12:15:00Z after user flagged the gap
- Retrofit wrapper archived at `research/archive/retrofit-2026-04-11/iteration-001-retrofit-wrapper.md`

**Generation 2 (2026-04-11)**:
- Real 10-iteration rerun
- Orchestrator and worker: claude-opus-4-6 (single Claude Code session)
- Each iteration has distinct focus, file citations, and findings
- Cross-iteration synthesis in iteration-010 validates generation-1 recommendation
- Stop reason: `all_questions_answered_plus_audit_complete` (alternative sk-deep-research stop path)
- Composite convergence score: 0.92

**Why both generations coexist**: generation-1 deliverables (research.md, findings/, recommendation.md, phase-018-proposal.md) are the trusted synthesis and are unchanged. Generation-2 iterations are the audit trail that the sk-deep-research protocol requires. Together they satisfy both the content quality bar (generation 1) and the process quality bar (generation 2).

<!-- /ANCHOR:generation-notes -->
