---
title: Deep Review Strategy - Gate E Runtime Migration
description: Final strategy state for the Gate E doc-surface parity review batch.
---

# Deep Review Strategy: Gate E - Runtime Migration

## 2. TOPIC
Gate E documentation-parity review for batch iterations 005-008 covering the top-level operator docs, memory commands, agent docs, and the `system-spec-kit` skill contract.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - Recovery instructions vs shipped runtime behavior
- [x] D2 Security - Retired migration language and unsafe operator guidance
- [x] D3 Traceability - Cross-surface consistency across docs, commands, agents, and skills
- [x] D4 Maintainability - Stable wording, minimal ambiguity, future-safe guidance
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Editing the packet docs or broader repo surfaces.
- Recounting every historical Gate E touched file from git history.
- Reviewing runtime implementation beyond the specific lines needed to validate doc claims.

## 5. STOP CONDITIONS
- Complete the four requested Gate E iterations.
- Confirm whether the mapped surfaces reflect current post-006 recovery reality.
- Keep all writes inside `005-gate-e-runtime-migration/review/`.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 005 | Operator-facing docs say direct `_memory.continuity` edits can land in generic spec docs, but the runtime ladder only reads continuity from `implementation-summary.md`. |
| D2 Security | PASS | 007 | No target-surface references to `/spec_kit:continue`, `/memory:continue`, shadow-only rollout, EWMA, or staged hold windows remain. |
| D3 Traceability | CONDITIONAL | 006 | `system-spec-kit/SKILL.md` still hard-blocks direct continuity edits while AGENTS, CLAUDE, and `/memory:save` explicitly allow them. |
| D4 Maintainability | PASS | 008 | The surviving command and agent surfaces consistently re-anchor recovery on `/spec_kit:resume` and the canonical ladder. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Comparing the live runtime carrier (`resume-ladder.ts`) to AGENTS, CLAUDE, README, and `/memory:save` exposed the operator-visible drift quickly. (iteration 005)
- Reading the `system-spec-kit` skill after the command docs showed the second contradiction was not runtime vs docs, but doc vs doc. (iteration 006)
- Exit-code grep sweeps were effective for ruling out stale rollout vocabulary across the targeted surfaces. (iteration 007)

## 9. WHAT FAILED
- Packet implementation-summary counts were not useful for parity review by themselves; the current text had to be validated against the live files directly. (iteration 008)
- The generic phrase “spec docs” hid a real operational ambiguity until the runtime carrier and command guidance were read together. (iteration 005)

## 10. EXHAUSTED APPROACHES (do not retry)
### Quick continuity wording audit -- PRODUCTIVE (iteration 005)
- What worked: compare AGENTS, CLAUDE, README, and `/memory:save` against the live resume reader.
- Prefer for: operator-facing continuity contract disputes.

### Historical rollout term hunting -- PRODUCTIVE (iteration 007)
- What worked: exact-term grep across the scoped doc, command, and agent surfaces.
- Prefer for: proving retired migration language is gone from active guidance.

### Git-history reconstruction of the 178-file fanout -- BLOCKED (iteration 008)
- What was tried: inferring parity correctness from packet summary counts alone.
- Why blocked: the current review target is present-tense doc/runtime parity, not historical diff accounting.
- Do NOT retry: treat the packet’s aggregate file counts as proof of alignment without checking the live surfaces.

## 11. RULED OUT DIRECTIONS
- Stale `/spec_kit:continue` or `/memory:continue` references in the scoped Gate E surfaces were ruled out by exact-term grep. (iteration 007)
- Shadow-only rollout, dual-write, EWMA, and fixed hold-window language were ruled out across the targeted doc/agent/command surfaces. (iteration 007)
- A repo-root `ARCHITECTURE.md` parity obligation was ruled out for this checkout because no such file exists at the target root. (iteration 008)

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
All requested Gate E iterations are complete. Remaining work is remediation planning for the two continuity-contract contradictions.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- Batch 2/5 scope fixed Gate E review to current-reality doc parity, not runtime implementation edits.
- The operator specifically asked for AGENTS, CLAUDE, README, command, agent, and skill surfaces.
- Review target stayed read-only; no non-review markdown was touched.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `doc_runtime` | core | partial | 005 | Quick continuity edit guidance over-promises which spec docs are load-bearing for `/spec_kit:resume`. |
| `command_agent_skill` | core | partial | 006 | `system-spec-kit/SKILL.md` contradicts AGENTS, CLAUDE, and `/memory:save` on whether direct `_memory.continuity` edits are allowed. |
| `resume_surface` | overlay | pass | 008 | Targeted agent and command docs consistently re-anchor recovery on `/spec_kit:resume` and the canonical ladder. |
| `stale_rollout_terms` | overlay | pass | 007 | No stale `/continue`, shadow-only, EWMA, or hold-window language remains in the scoped Gate E surfaces. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `AGENTS.md` | D1, D3 | 005 | 1 P1 | complete |
| `CLAUDE.md` | D1, D3 | 005 | 1 P1 | complete |
| `README.md` | D1, D4 | 008 | 1 P1 | complete |
| `.opencode/command/memory/save.md` | D1, D3 | 006 | 2 P1 | complete |
| `.opencode/command/memory/README.txt` | D2, D4 | 007 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/command/memory/search.md` | D2, D4 | 008 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/agent/context.md` | D3, D4 | 008 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/agent/deep-review.md` | D3, D4 | 008 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/agent/handover.md` | D3, D4 | 008 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/agent/review.md` | D3, D4 | 008 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/agent/speckit.md` | D3, D4 | 008 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/SKILL.md` | D1, D3, D4 | 006 | 1 P1 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10 batch iterations, 4 allocated to this phase
- Convergence threshold: not used in this manual batch pass
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=dr-026-006-005-20260412, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: not created in this scoped pass; state lives in `deep-review-state.jsonl`
- Release-readiness states: review_in_progress
- Per-iteration budget: 12 tool calls, 20 minutes
- Severity threshold: P2
- Review target type: docs
- Cross-reference checks: core=doc_runtime, command_agent_skill; overlay=resume_surface, stale_rollout_terms
- Started: 2026-04-12T10:30:00Z
<!-- MACHINE-OWNED: END -->
