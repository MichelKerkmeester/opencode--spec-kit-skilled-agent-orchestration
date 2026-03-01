---
title: "Spec 012: Context Agent Model Comparison (Haiku vs Sonnet) [012-context-model-comparison/spec]"
description: "Spec Level: L2+ (Research & Validation)"
trigger_phrases:
  - "spec"
  - "012"
  - "context"
  - "agent"
  - "model"
importance_tier: "important"
contextType: "decision"
---
# Spec 012: Context Agent Model Comparison (Haiku vs Sonnet)

**Spec Level**: L2+ (Research & Validation)
**Parent Spec**: 05--agent-orchestration / 011-context-model-optimization
**Status**: ACTIVE — Phase 1 Validation
**Created**: 2026-02-14

---

<!-- ANCHOR:problem -->
## Problem Statement

Spec 011 switched the @context agent from Sonnet to Haiku to reduce latency and cost. However, the Phase 1 validation (controlled comparison) was never executed. Without empirical evidence, we cannot confirm that Haiku provides acceptable quality for the context retrieval role. This spec provides the controlled comparison framework to make a data-driven go/no-go decision.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## Scope

### In Scope

- Create duplicate @context agent variants (Haiku and Sonnet) on both platforms (Copilot + Claude Code)
- Design and document 5 standardized test queries covering quick/medium/thorough modes
- Define scoring rubric with structural, substantive, and operational metrics
- Execute controlled A/B comparison with fairness controls
- Produce go/no-go decision based on predefined decision matrix

### Out of Scope

- Changes to the production @context agent during testing
- Testing other agents beyond @context
- Performance testing beyond the 5 defined queries (unless CONDITIONAL verdict triggers additional rounds)
- Option C (hybrid model routing) — documented as future spec if needed

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## Requirements

### R-001: Agent Variant Isolation

Agent variants MUST be identical to the production @context agent in all respects except the `model` field and `name`/`description` metadata. Body content must be copied verbatim with zero modifications.

### R-002: Platform Parity

Variants must exist on both platforms:
- **Copilot**: `.opencode/agent/context-haiku.md` and `context-sonnet.md`
- **Claude Code**: `.claude/agents/context-haiku.md` and `context-sonnet.md`

### R-003: Test Fairness

All test queries must be executed against the same codebase state (no commits between runs), with identical prompts, and alternating execution order to avoid first-mover bias.

### R-004: Scoring Objectivity

Scoring must use predefined rubrics with 1-5 scales. Only differences of 2+ points on substantive metrics count as meaningful (acknowledged N=5 limitation).

### R-005: Decision Transparency

The go/no-go decision must follow the predefined decision matrix exactly. No post-hoc rationalization.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:risks -->
## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Non-determinism masks real differences | High | Medium | Use clear rubric; require 2+ point gaps for significance |
| N=5 too small for statistical confidence | High | Medium | Acknowledged limitation; supplement with qualitative analysis |
| Memory state differs between runs | Low | High | Execute all queries in same session, verify memory state before starting |
| Codebase changes between runs | Low | High | No commits during test execution |
| Evaluator bias | Medium | Medium | Use predefined rubric; score before comparing |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

- All 5 test queries executed on both variants
- All scores recorded using the predefined rubric
- Go/no-go decision made using the decision matrix
- Results documented in `results.md` with full evidence
- Spec 011 Phase 1 status updated based on outcome

<!-- /ANCHOR:success-criteria -->

---

## Dependencies

| Dependency | Type | Status |
|-----------|------|--------|
| Spec 011 (context-model-optimization) | Parent spec | Active — awaiting Phase 1 validation |
| @context agent (production) | Source for variants | Stable — currently on Haiku |
| anobel.com codebase | Test target | Stable — no changes during testing |

---

## Related Files

| File | Purpose |
|------|---------|
| `plan.md` | Implementation phases and effort estimates |
| `checklist.md` | Verification checklist for all phases |
| `test-protocol.md` | 5 test queries with exact text and expected outputs |
| `scoring-rubric.md` | Metric definitions, scales, and decision matrix |
| `results.md` | Template for capturing test outputs and scores |
