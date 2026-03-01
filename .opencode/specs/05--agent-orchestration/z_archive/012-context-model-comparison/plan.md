---
title: "Plan: Context Agent Model Comparison [012-context-model-comparison/plan]"
description: "Spec: 012-context-model-comparison"
trigger_phrases:
  - "plan"
  - "context"
  - "agent"
  - "model"
  - "comparison"
  - "012"
importance_tier: "important"
contextType: "decision"
---
# Plan: Context Agent Model Comparison

**Spec**: 012-context-model-comparison
**Created**: 2026-02-14

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Agent Variant Creation

**Effort**: Low
**Dependencies**: None

Create 4 agent variant files (2 per platform) with identical body content to the production @context agent. Only frontmatter differs:

| # | File | Key Changes |
|---|------|-------------|
| 1 | `.opencode/agent/context-haiku.md` | `name: context-haiku`, `model: github-copilot/claude-haiku-4.5` |
| 2 | `.opencode/agent/context-sonnet.md` | `name: context-sonnet`, `model: github-copilot/claude-sonnet-4.5` |
| 3 | `.claude/agents/context-haiku.md` | `name: context-haiku`, `model: haiku` |
| 4 | `.claude/agents/context-sonnet.md` | `name: context-sonnet`, `model: sonnet` |

**Verification**: Diff body sections to confirm zero content changes. Confirm model fields are correct per platform.

**Status**: COMPLETED

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Spec Folder Documentation

**Effort**: Medium
**Dependencies**: None (parallel with Phase 1)

Create the spec folder structure at `.opencode/specs/05--agent-orchestration/z_archive/012-context-model-comparison/`:

| File | Purpose |
|------|---------|
| `spec.md` | L2+ spec with problem, scope, requirements, risks |
| `plan.md` | This file — implementation phases |
| `checklist.md` | Verification checklist for all phases |
| `test-protocol.md` | 5 test queries with exact copy-pasteable text |
| `scoring-rubric.md` | Metric definitions, 1-5 scales, decision matrix |
| `results.md` | Template for capturing outputs, scores, verdicts |

**Status**: COMPLETED

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Test Execution

**Effort**: High (manual execution)
**Dependencies**: Phase 1 + Phase 2

### Execution Protocol

- **Platform**: Claude Code primary (clearer dispatch logging)
- **Execution order**: Alternate Haiku/Sonnet per query; swap order on rounds 3 and 5 to avoid first-mover bias
- **Fairness controls**: Same prompts, same codebase state, same memory state

### Query Execution Order

| Round | Query | First Runner | Second Runner |
|-------|-------|--------------|---------------|
| 1 | TQ-1 (quick) | Haiku | Sonnet |
| 2 | TQ-2 (medium) | Sonnet | Haiku |
| 3 | TQ-3 (medium) | Sonnet | Haiku |
| 4 | TQ-4 (thorough) | Haiku | Sonnet |
| 5 | TQ-5 (thorough) | Sonnet | Haiku |

**Status**: PENDING

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Scoring & Analysis

**Effort**: Medium (manual evaluation)
**Dependencies**: Phase 3

1. Score each response using the rubric in `scoring-rubric.md`
2. Record all scores in `results.md`
3. Calculate per-query verdicts using the verdict scale
4. Apply the go/no-go decision matrix
5. Document rationale for the final decision

**Status**: PENDING

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Decision & Cleanup

**Effort**: Low
**Dependencies**: Phase 4

### If GO (keep Haiku)

1. Delete all 4 variant agent files
2. Update spec 011 Phase 1 as PASSED
3. Close relevant checklist items (CHK-003/004/020-024)
4. Save results to memory

### If NO-GO (revert to Sonnet)

1. Delete all 4 variant agent files
2. Revert production `context.md` to Sonnet on both platforms
3. Update spec 011 as "Reverted"
4. Save results to memory

### If CONDITIONAL

1. Run 3 additional queries for stronger signal, OR
2. Document Option C (hybrid model routing) as separate future spec
3. Keep variant agents until resolution

### Always

1. Save final results to memory via `generate-context.js`
2. Update this plan with final status

**Status**: PENDING

<!-- /ANCHOR:phase-5 -->
