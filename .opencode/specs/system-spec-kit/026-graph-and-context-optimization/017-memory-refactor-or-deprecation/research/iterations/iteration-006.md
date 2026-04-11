---
title: "Iteration 006 — Q5 Deep Dive: 6 alternative architectures with trade-off analysis"
iteration: 6
timestamp: 2026-04-11T13:00:00Z
worker: claude-opus-4-6 (Claude Code session)
scope: q5_alternatives_detail
status: complete
focus: "For each of the 6 architectural alternatives (A-F), produce a detailed trade-off sketch, effort estimate, compatibility check against the 13 advanced memory features, and a final ranking."
maps_to_questions: [Q5]
---

# Iteration 006 — Q5: Alternatives Deep Dive

## Goal

Answer Q5 with rigor: evaluate every architectural alternative against a consistent rubric. Produce a ranked recommendation with defensible rationale.

## The 6 alternatives

From phase 017's alternatives-comparison.md, re-evaluated in this iteration:

- **A. Status quo + fix generator** — keep memory as-is, invest in the 562 generator fixes from phase 005
- **B. Minimal memory** — keep memory MCP but only save for critical decisions and handovers
- **C. Wiki-style spec kit updates** — route narrative into spec docs, keep thin continuity layer
- **D. Handover-only** — replace memory saves with structured `handover.md` files
- **E. Findings-only** — memories become research findings appended to `research/research.md`
- **F. Full deprecation** — remove memory MCP entirely, rely on spec docs + CocoIndex

## Rubric (6 dimensions, 0-5 each, 30 points total)

1. **Information quality** — does the operator get richer, less noisy context?
2. **Operational reliability** — does it avoid the phase 005 generator defects and the embedding warmup fragility?
3. **Retrieval coverage** — can it answer the 2/10 memory-wins queries from iteration 5?
4. **Advanced feature preservation** — does it preserve the 13 advanced memory features?
5. **Migration cost** — how expensive is the transition?
6. **Rollback cost** — how hard is it to undo if the new architecture underperforms?

## Detailed evaluation

### Option A — Status Quo + Fix Generator

| Dimension | Score | Rationale |
|---|---:|---|
| Information quality | 2/5 | Even fixed, narrative memory is still redundant with packet docs. 85% of memory bytes are HIGH-overlap (iteration 4). |
| Operational reliability | 1/5 | Embedding warmup fragility remains. 562 defects to fix (phase 005). |
| Retrieval coverage | 4/5 | Full retrieval preserved (all 13 features operational). |
| Advanced feature preservation | 5/5 | No features touched. |
| Migration cost | 1/5 | Fixing 562 defects is a sunk-cost bet on the wrong layer. |
| Rollback cost | 2/5 | Rollback requires reverting generator fixes. |
| **Total** | **15/30** | Lowest ranking. |

**Effort estimate**: 4-6 weeks for generator fixes, unbounded for architectural tech debt. **Risk**: high. Option A accepts the fundamental architectural redundancy.

### Option B — Minimal Memory

| Dimension | Score | Rationale |
|---|---:|---|
| Information quality | 4/5 | Only critical decisions + handovers saved — high signal. |
| Operational reliability | 3/5 | Fewer saves = fewer failure modes, but embedding fragility remains on retrieval. |
| Retrieval coverage | 3/5 | Loses trigger matching on archived features unless continuity layer preserves them. |
| Advanced feature preservation | 4/5 | Most features retained; save-quality-gate and reconsolidation become less relevant. |
| Migration cost | 3/5 | Moderate — disable the default narrative save path, update `/memory:save` semantics. |
| Rollback cost | 4/5 | Simple — re-enable the default save path. |
| **Total** | **21/30** | Strong fallback. |

**Effort estimate**: 2-3 weeks. **Risk**: medium. Option B is Option C's safer cousin.

### Option C — Wiki-Style Spec Kit Updates + Thin Continuity Layer

| Dimension | Score | Rationale |
|---|---:|---|
| Information quality | 5/5 | Canonical narrative lives in packet docs, which are already the source of truth. Zero redundancy by design. |
| Operational reliability | 4/5 | Drops the atomicSaveMemory file-I/O failure mode. Embedding fragility moves to retrieval-only (smaller surface area). |
| Retrieval coverage | 5/5 | Preserves trigger matching, causal graph, FSRS decay, constitutional memory — all retargeted onto the new substrate per iteration 2. |
| Advanced feature preservation | 5/5 | ~80% of features retarget without schema change (per phase 017 + iteration 2 verification). |
| Migration cost | 2/5 | Large — 12 VERY-HIGH effort files, ~20 HIGH, dozens MEDIUM. Biggest single refactor point. |
| Rollback cost | 3/5 | Feature-flagged dual-write during phase 019 enables shadow comparison; legacy memory files stay read-only as fallback. |
| **Total** | **24/30** | **Highest ranking.** |

**Effort estimate**: 4-6 weeks across phases 018, 019, 020. **Risk**: medium-high but bounded by phased rollout.

### Option D — Handover-Only

| Dimension | Score | Rationale |
|---|---:|---|
| Information quality | 3/5 | Strong for session-end continuity, weak for research/implementation narrative. |
| Operational reliability | 4/5 | Handover files are simple markdown, no complex pipeline. |
| Retrieval coverage | 2/5 | Loses trigger matching against archived features and research content. |
| Advanced feature preservation | 2/5 | Drops causal graph, FSRS decay, constitutional memory — replaced by simple file reads. |
| Migration cost | 3/5 | Straightforward — replace `/memory:save` with a `handover.md` writer. |
| Rollback cost | 4/5 | Easy — handover files remain even if memory is re-enabled. |
| **Total** | **18/30** | Partial answer. |

**Effort estimate**: 1-2 weeks. **Risk**: low-medium. Too narrow for the full problem.

### Option E — Findings-Only

| Dimension | Score | Rationale |
|---|---:|---|
| Information quality | 3/5 | Good for research, weak for implementation continuity. |
| Operational reliability | 4/5 | Simple markdown append, no complex pipeline. |
| Retrieval coverage | 2/5 | Same trigger-matching loss as D. |
| Advanced feature preservation | 2/5 | Same as D. |
| Migration cost | 3/5 | Similar to D. |
| Rollback cost | 4/5 | Similar to D. |
| **Total** | **18/30** | Partial answer (mirror of D for research). |

**Effort estimate**: 1-2 weeks. **Risk**: low-medium. Also too narrow.

### Option F — Full Deprecation

| Dimension | Score | Rationale |
|---|---:|---|
| Information quality | 4/5 | Forces operator to maintain packet docs as the single source of truth. Clean. |
| Operational reliability | 5/5 | No memory pipeline, no embedding fragility, no 562 defects. |
| Retrieval coverage | 2/5 | Loses the 2/10 memory-wins queries from iteration 5. Loses gap-filling role. |
| Advanced feature preservation | 0/5 | All 13 features deleted. Violates the user's explicit "preserve features" constraint. |
| Migration cost | 1/5 | Very high — 100+ files across commands, agents, handlers, tests, docs need updates. Simultaneously disruptive. |
| Rollback cost | 1/5 | Very hard — once MCP server is removed and code paths deleted, reverting requires re-implementing. |
| **Total** | **13/30** | Viable **after** Option C hardens, not before. |

**Effort estimate**: 8-12 weeks. **Risk**: very high. Direct conflict with the preserve-features constraint.

## Ranking

| Rank | Option | Score | Notes |
|---:|---|---:|---|
| **1** | **C. Wiki-style + thin continuity** | **24/30** | **Recommended.** Best balance of signal, retrieval preservation, and feature retargeting. |
| 2 | B. Minimal memory | 21/30 | Safer fallback if C feels too ambitious for phase 018. |
| 3 | D. Handover-only | 18/30 | Good subset but too narrow as the whole answer. |
| 3 (tie) | E. Findings-only | 18/30 | Good subset for research but weak on implementation. |
| 5 | A. Status quo + fix generator | 15/30 | Not recommended. Sunk cost on the wrong layer. |
| 6 | F. Full deprecation | 13/30 | Viable only after C hardens. Violates preserve-features constraint. |

## Compatibility with the 13 advanced features

For the recommended Option C:

| Feature | Retarget mechanism | Status |
|---|---|---|
| 1. Trigger phrase fast matching | Source spec doc frontmatter + thin continuity fallback | ✅ Retargetable |
| 2. Intent-aware retrieval | Query-side classification unchanged; targets change | ✅ Retargetable |
| 3. Session dedup | Fingerprint over anchor-scoped writes | ✅ Retargetable with adaptation |
| 4. Multi-dimension quality scoring | Per-anchor quality gates | ✅ Retargetable with adaptation |
| 5. Memory reconsolidation | Auto-merge at >0.96 similarity works on any content | ✅ Retargetable |
| 6. Causal graph | Edges point to (spec_folder, doc, anchor) tuples | ✅ Retargetable with schema update |
| 7. Memory tiers | Tier field stored per row, works on any row | ✅ Retargetable |
| 8. FSRS cognitive decay | Per-row decay, works on any indexed unit | ✅ Retargetable |
| 9. Shared memory governance | Governance scope fields are storage-agnostic | ✅ Retargetable |
| 10. Ablation studies, dashboards | Metrics-driven, works on any content | ✅ Retargetable |
| 11. Constitutional memory | Flag field, works on any row | ✅ Retargetable |
| 12. Embedding semantic search | Content-agnostic | ✅ Retargetable |
| 13. 4-stage search pipeline | RRF fusion across channels, channel-agnostic | ✅ Retargetable |

**All 13 features retarget under Option C.** No feature is deleted.

## Findings

- **F6.1**: Option C scores 24/30 — the clear winner. It is the only option that preserves all 13 advanced features AND gives the operator cleaner information architecture AND bounds migration risk via phasing.
- **F6.2**: Option B scores 21/30 — a strong fallback. If phase 018 scope must shrink, Option B delivers most of the value with lower risk.
- **F6.3**: Options D and E tie at 18/30 — both are valid subsets but neither is sufficient alone.
- **F6.4**: Option A (15/30) is the lowest-ranked viable option because it invests heavily in the wrong layer (generator fixes) while leaving the architectural redundancy in place.
- **F6.5**: Option F (13/30) is the lowest-ranked overall because it violates the explicit preserve-features constraint AND has very high migration + rollback costs.

## What worked

- Evaluating all 6 options against one rubric (6 dimensions × 5 points) produced defensible scores with transparent reasoning.
- Cross-referencing each option against the 13-feature preservation check ruled out Option F cleanly.

## What failed / did not work

- The rubric scored F at 0/5 for feature preservation, which may understate value. Option F could eventually preserve features if they were re-implemented on spec-doc substrate — but that's effectively Option C, so the distinction holds.

## Open questions carried forward

- Could Options C and F compose over time? (Yes — see iteration 9's phased rollout plan: 018 starts C, 019 hardens C, 020 evaluates whether to move toward F.)
- How should the thin continuity layer be sized? (Deferred to phase 018's research track.)

## Next focus (for iteration 7)

Q6 migration strategy: model the 4 migration options for the existing 155 memory files. Pick one, justify with evidence.
