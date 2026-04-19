---
title: "Verification Checklist: Advisor Renderer + 200-Prompt Regression Harness"
description: "Level 2 verification for 020/005 — hard gate before runtime rollout."
trigger_phrases:
  - "020 005 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Advisor Renderer + 200-Prompt Regression Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

> **Hard gate** — children 006, 007, 008 blocked until all P0 items `[x]`.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Gate lift requires every P0 `[x]` with evidence |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Spec + plan + tasks reviewed
- [ ] CHK-002 [P0] Predecessors 002 + 003 + 004 merged
- [ ] CHK-003 [P0] 019/004 corpus file exists and readable
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `renderAdvisorBrief()` is pure (no I/O)
- [ ] CHK-011 [P0] Whitelist-only visible fields enforced
- [ ] CHK-012 [P0] No `reason`/`description`/`prompt` reads in renderer
- [ ] CHK-013 [P0] Unicode sanitization: canonical-fold → single-line → instruction-deny
- [ ] CHK-014 [P0] `NormalizedAdvisorRuntimeOutput` exported
- [ ] CHK-015 [P0] `speckit_advisor_hook_*` metrics namespace populated
- [ ] CHK-016 [P0] 7 JSON fixtures under `advisor-fixtures/`
- [ ] CHK-017 [P0] `tsc --noEmit` clean
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Renderer scenarios 1-7 snapshot match
- [ ] CHK-021 [P0] 200-prompt parity: 200/200 top-1 match
- [ ] CHK-022 [P0] Cache hit p95 ≤ 50 ms
- [ ] CHK-023 [P0] Cache hit rate ≥ 60% on synthetic replay
- [ ] CHK-024 [P0] Metrics namespace verified
- [ ] CHK-025 [P0] Stderr JSONL schema verified
- [ ] CHK-026 [P0] `advisor-hook-health` section in `session_health` output
- [ ] CHK-027 [P0] Privacy audit: raw prompt absent from all serialized surfaces
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Instruction-shaped labels blocked (Unicode fixture)
- [ ] CHK-031 [P0] Canonical-folded label sanitization verified
- [ ] CHK-032 [P0] No log/metric/health output leaks prompt content
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] implementation-summary.md bench table populated
- [ ] CHK-042 [P2] Inline JSDoc on renderer + normalizer types
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] 3 lib files under `mcp_server/lib/skill-advisor/`
- [ ] CHK-051 [P0] 5 test files under `mcp_server/tests/`
- [ ] CHK-052 [P0] 7 fixture JSON files under `mcp_server/tests/advisor-fixtures/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending (hard-gate lift blocked)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 0/25 |
| P1 Items | 3 | 0/3 |
| P2 Items | 1 | 0/1 |
<!-- /ANCHOR:summary -->
