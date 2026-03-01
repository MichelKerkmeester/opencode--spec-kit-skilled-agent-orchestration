---
title: "Checklist: Context Agent Model Comparison [012-context-model-comparison/checklist]"
description: "Spec: 012-context-model-comparison"
trigger_phrases:
  - "checklist"
  - "context"
  - "agent"
  - "model"
  - "comparison"
  - "012"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Context Agent Model Comparison

**Spec**: 012-context-model-comparison
**Created**: 2026-02-14

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Agent Variant Creation

- [x] CHK-001: `.opencode/agent/context-haiku.md` created with correct frontmatter
- [x] CHK-002: `.opencode/agent/context-sonnet.md` created with correct frontmatter
- [x] CHK-003: `.claude/agents/context-haiku.md` created with correct frontmatter
- [x] CHK-004: `.claude/agents/context-sonnet.md` created with correct frontmatter
- [x] CHK-005: All 4 variant bodies are identical to source `context.md`
- [x] CHK-006: Copilot variants use `github-copilot/claude-haiku-4.5` and `github-copilot/claude-sonnet-4.5`
- [x] CHK-007: Claude Code variants use `haiku` and `sonnet`
- [x] CHK-008: Temperature stays 0.1 on both Copilot variants
- [x] CHK-009: All variants have `[A/B TEST]` prefix in description

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Spec Folder Documentation

- [x] CHK-010: `spec.md` created with problem, scope, requirements, risks
- [x] CHK-011: `plan.md` created with phases, dependencies, effort
- [x] CHK-012: `checklist.md` created (this file)
- [x] CHK-013: `test-protocol.md` created with 5 test queries
- [x] CHK-014: `scoring-rubric.md` created with metric definitions and decision matrix
- [x] CHK-015: `results.md` template created with scoring tables

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Test Execution

- [ ] CHK-016: Codebase state verified (no uncommitted changes affecting test targets)
- [ ] CHK-017: Memory state verified before first query
- [ ] CHK-018: `@context-haiku` resolves correctly in Claude Code
- [ ] CHK-019: `@context-sonnet` resolves correctly in Claude Code
- [ ] CHK-020: TQ-1 executed on both variants (quick mode)
- [ ] CHK-021: TQ-2 executed on both variants (medium mode)
- [ ] CHK-022: TQ-3 executed on both variants (medium mode)
- [ ] CHK-023: TQ-4 executed on both variants (thorough mode)
- [ ] CHK-024: TQ-5 executed on both variants (thorough mode)
- [ ] CHK-025: Execution order alternated per protocol (swap on rounds 3 and 5)
- [ ] CHK-026: No codebase commits between test executions

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Scoring & Analysis

- [ ] CHK-027: All structural checks completed (pass/fail)
- [ ] CHK-028: All substantive scores recorded (Q-01 through Q-06, 1-5 scale)
- [ ] CHK-029: All operational metrics captured (latency, tool calls, dispatches)
- [ ] CHK-030: Per-query verdicts assigned using verdict scale
- [ ] CHK-031: Scores recorded before cross-variant comparison (avoid bias)

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Decision & Cleanup

- [ ] CHK-032: Go/no-go decision made using decision matrix
- [ ] CHK-033: Decision rationale documented in `results.md`
- [ ] CHK-034: Variant agent files cleaned up per decision outcome
- [ ] CHK-035: Spec 011 Phase 1 status updated
- [ ] CHK-036: Results saved to memory

<!-- /ANCHOR:phase-5 -->
