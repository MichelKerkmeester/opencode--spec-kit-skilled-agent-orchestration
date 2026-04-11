---
title: "Iteration 009 — Q8 Synthesis: Recommendation + Phased Rollout + Risk Register"
iteration: 9
timestamp: 2026-04-11T13:15:00Z
worker: claude-opus-4-6 (Claude Code session)
scope: q8_synthesis
status: complete
focus: "Compile all iteration findings into the final recommendation with phased rollout, risk register, and go/no-go criteria."
maps_to_questions: [Q8]
---

# Iteration 009 — Q8: Synthesis

## Goal

Answer Q8 with a complete recommendation that phase 018 can act on immediately: recommended architecture, phased rollout plan, risk register, and go/no-go criteria per phase.

## Inputs

- Iteration 1 (architecture baseline)
- Iteration 2 (16-stage pipeline: 8 as-is + 6 adapt + 2 rewrite)
- Iteration 3 (value assessment: 35/40/25 split)
- Iteration 4 (redundancy matrix: 45% HIGH overlap + 27% unique-valuable metadata)
- Iteration 5 (retrieval comparison: 2/10 memory-wins + 2 partials)
- Iteration 6 (alternatives ranking: C 24/30 > B 21/30 > D/E 18/30 > A 15/30 > F 13/30)
- Iteration 7 (migration strategy: M4 bounded archive)
- Iteration 8 (integration impact: ~147 files, ~52 engineer-days)

## Final Recommendation

**Adopt Option C as the target architecture** — Wiki-Style Spec Kit Updates with a thin continuity layer. Migrate over three phases (018, 019, 020).

### Why Option C wins (from iteration 6, re-verified)

1. **Best information quality** — canonical narrative lives in the docs operators already treat as the source of truth (0% redundancy by design)
2. **Best retrieval preservation** — all 13 advanced memory features retarget without deletion
3. **Best alignment with the existing indexed corpus** — spec docs are already 75%+ of the index; memory files are the minority
4. **Bounded migration risk** — phased rollout with feature-flagged dual-write and shadow comparison
5. **Reuses existing anchor infrastructure** — the `implementation-summary.md::what-built`, `decision-record.md::adr-NNN`, `handover.md` sections already exist and absorb 45% of memory content directly

### Why not Option A, B, D, E, or F

- **A (status quo)**: invests in generator fixes for a layer that's architecturally redundant (iteration 6: 15/30)
- **B (minimal memory)**: strong fallback if phase 018 feels too ambitious, but doesn't answer "where does canonical narrative live?" (iteration 6: 21/30)
- **D (handover-only)**: too narrow — no research or machine metadata handling (iteration 6: 18/30)
- **E (findings-only)**: mirror of D — too narrow for implementation continuity (iteration 6: 18/30)
- **F (full deprecation)**: violates the explicit preserve-13-features constraint, very high disruption (iteration 6: 13/30). Viable ONLY after Option C hardens and the archived-hit-rate shows memory retrieval is load-bearing at <0.5%.

## Phased Rollout Plan

### Phase 018 — Canonical Continuity Refactor (foundation)

**Goal**: establish canonical authority. Narrative flows into spec docs. Memory files are frozen as an archived tier. New advanced research prompts (the two prompts produced earlier in this session) drive design + impact analysis.

**Scope**:
1. Schema migration: add `is_archived` column (or reuse if present), relax `UNIQUE(spec_folder, file_path, anchor_id)` constraint
2. Freeze all 155 existing memory files: `UPDATE memory_index SET is_archived = 1 WHERE source_path LIKE '%/memory/%.md'`
3. Update memory-search.ts ranking to deprioritize archived (weight × 0.3)
4. Backfill canonical `implementation-summary.md` for the ~5 root packets that lack one (blocker — see F5.4, F7.4)
5. Launch the two research prompts created in this session (20-iter implementation design + 5-iter impact analysis) via `/spec_kit:deep-research:auto`
6. Document the new routing rules in `findings/routing-rules.md` (output of phase 018 research)

**Effort**: ~1 week of code work (schema + ranking + backfill) + 2-4 hours for research prompts (both runs)

**Go/no-go criteria before moving to phase 019**:
- [ ] Schema migration tested, rolled forward, and backward-compatible
- [ ] All 155 memory files confirmed `is_archived=1`
- [ ] Ranking change verified: routine search returns spec-doc hits first, archived memory fallback on empty
- [ ] 5 root-packet backfill complete
- [ ] Both research prompts converged and produced their deliverables
- [ ] `archived_hit_rate` dashboard metric < 20% at week 1 (expected because fresh spec-doc content is limited early)

### Phase 019 — Runtime Migration

**Goal**: replace default `memory_save` behavior with wiki-style anchor routing. Update commands, agents, and MCP handlers to use the new path.

**Scope**:
1. Implement `atomicIndexMemory` (non-file path) — the generator's new output target per iteration 2, F2.3
2. Rewrite `scripts/memory/generate-context.ts` to route content per the routing rules from phase 018 findings
3. Update `memory-save.ts` pipeline to support both modes (feature-flagged dual-write during a 2-week shadow window)
4. Update `/spec_kit:resume` recovery ladder: handover.md first, spec docs second, thin continuity third, archived memory last
5. Update `@context` agent's "memory first" protocol to "spec-docs first"
6. Update workflow YAMLs for plan/implement/complete to emit anchor-scoped saves
7. Monitor `archived_hit_rate` weekly

**Effort**: ~2-3 weeks

**Go/no-go criteria before moving to phase 020**:
- [ ] Dual-write shadow comparison shows equivalent or better retrieval quality vs current memory path
- [ ] No critical regressions in `/spec_kit:resume` performance
- [ ] `archived_hit_rate` < 5% at week 4 (indicates fresh spec-doc coverage is working)
- [ ] All 13 advanced features verified operational against the new substrate
- [ ] Test suites pass for modified handlers

### Phase 020 — Surface Cleanup & Permanence Decision

**Goal**: clean up commands/agents/tests/docs that still reference the old memory model. Decide whether to retain the thin continuity layer permanently or move toward Option F (full deprecation).

**Scope**:
1. Update all command/agent docs that describe memory as "mandatory tool"
2. Rewrite skill reference files (`references/memory/*`)
3. Update CLAUDE.md, AGENTS.md, README.md, ARCHITECTURE.md
4. Decide on archived memory retirement: if `archived_hit_rate` < 0.5% at day 180, retire
5. Optional: if retention decision is "full deprecation", begin Option F migration in phase 021+

**Effort**: ~1-2 weeks (mostly docs + test cleanup)

**Go/no-go criteria**:
- [ ] All docs updated and synchronized
- [ ] Operator feedback captured (did resume get faster/better?)
- [ ] `archived_hit_rate` trend captured for 180 days
- [ ] Decision recorded in `decision-record.md::adr-020-permanence`

## Top 10 Risks (Risk Register)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|:---:|:---:|---|
| 1 | Schema migration corrupts `memory_index` | Low | High | Backup SQLite DB before migration; test on copy first; rollback script ready |
| 2 | Routing classifier misroutes content to wrong anchor | Medium | Medium | Start with rule-based classifier; log all routing decisions; add user override |
| 3 | `archived_hit_rate` stays high (>5%) after phase 019, indicating fresh spec-doc coverage is insufficient | Medium | Medium | Investigate which queries hit archives; improve routing rules; extend phase 019 if needed |
| 4 | `/spec_kit:resume` latency regresses | Low | High | Benchmark before and after; keep old path as feature flag; roll back if regression >20% |
| 5 | Root packets without canonical `implementation-summary.md` are missed in backfill | Medium | Medium | Audit before phase 018 start; maintain checklist; verify each one |
| 6 | Merge conflicts when two sessions write to same anchor concurrently | Medium | Medium | Preserve `withSpecFolderLock` mutex; design conflict resolution in phase 018 research |
| 7 | Deep-research loop prompts don't converge | Low | Medium | Prompts have stop conditions; fallback to manual completion |
| 8 | Test suite rewrites underestimated | Medium | Medium | Budget 2x estimate; prioritize critical path tests first |
| 9 | Generator-quality fixes from phase 005 become obsolete mid-flight | Low | Low | Coordinate with phase 005 owners; accept some fixes will be retired |
| 10 | Operator confusion during transition (two retrieval paths) | Low | Medium | Clear dashboard metrics; communicate transition timeline; deprecation banner in old commands |

## Findings

- **F9.1**: Option C is the defensible recommendation. Every iteration 1-8 points to it. No iteration surfaced a blocker.
- **F9.2**: Phased rollout is essential — doing all 147 files at once would break the world. Phase 018 focuses on foundation, 019 on runtime, 020 on cleanup.
- **F9.3**: The gate between phase 018 and 019 is the successful completion of both research prompts (design + impact) plus the 5-root-packet backfill.
- **F9.4**: The gate between 019 and 020 is the archived-hit-rate metric showing fresh spec-doc content is covering the retrieval surface.
- **F9.5**: Total timeline: 4-6 weeks end-to-end with disciplined sequencing. The single research prompts alone are ~2-4 hours of wall clock. The code work is 3-5 weeks. Doc cleanup is 1-2 weeks.

## Q8 answer (verified)

Adopt Option C with the 3-phase rollout above. Phase 018 is the gate — it produces the design and impact analysis from the 20-iter + 5-iter research prompts created earlier in this session. Phase 019 executes the code refactor. Phase 020 cleans up and decides on long-term permanence. Top 10 risks are manageable with the mitigations listed. Go/no-go criteria are explicit at each phase gate.

## What worked

- Compiling all 8 prior iterations into one recommendation produced a clean chain of evidence. Every claim in the recommendation links back to a specific iteration finding.
- The 3-phase structure aligns with the phase 017 `phase-018-proposal.md` structure, so this synthesis is directly actionable.

## What failed / did not work

- The effort estimate remains coarse (4-6 weeks is a range, not a point). Phase 018's impact analysis research (5 iterations) will tighten this.
- Risk register is 10 items — probably more exist. Phase 018 research should expand this.

## Open questions carried forward

- Exact tuning of `archived_hit_rate` thresholds (5%, 0.5%) — needs operator feedback during phase 019
- Whether to run Option B as a shadow alongside Option C in phase 019 for comparison — deferred to phase 018 design research

## Next focus (for iteration 10)

Convergence audit and citation verification. Check every claim in iterations 1-9 for citations. Verify no contradictions. Compute the final convergence score. Produce the cross-iteration synthesis that becomes the updated `research.md`.
