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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
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

- [x] CHK-001 [P0] Spec + plan + tasks reviewed [Evidence: required reads completed before implementation]
- [x] CHK-002 [P0] Predecessors 002 + 003 + 004 merged [Evidence: `git merge-base --is-ancestor 47b805f7b HEAD`, `be32b1fe5`, and `4001865cc` all exited 0]
- [x] CHK-003 [P0] 019/004 corpus file exists and readable [Evidence: `wc -l .../labeled-prompts.jsonl` returned 200]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `renderAdvisorBrief()` is pure (no I/O) [Evidence: `advisor-renderer.vitest.ts` passed and source check rejects I/O surfaces]
- [x] CHK-011 [P0] Whitelist-only visible fields enforced [Evidence: renderer tests cover freshness/confidence/uncertainty/sanitized label output only]
- [x] CHK-012 [P0] No `reason`/`description`/`prompt` reads in renderer [Evidence: renderer source grep assertion passed]
- [x] CHK-013 [P0] Unicode sanitization: canonical-fold → single-line → instruction-deny [Evidence: unicode instructional and newline-label tests passed]
- [x] CHK-014 [P0] `NormalizedAdvisorRuntimeOutput` exported [Evidence: `mcp_server/lib/skill-advisor/normalize-adapter-output.ts`]
- [x] CHK-015 [P0] `speckit_advisor_hook_*` metrics namespace populated [Evidence: `advisor-observability.vitest.ts` metric contract passed]
- [x] CHK-016 [P0] 10 JSON fixtures under `advisor-fixtures/` [Evidence: `mcp_server/tests/advisor-fixtures/` includes 10 fixture files]
- [x] CHK-017 [P0] `tsc --noEmit` clean [Evidence: `npx tsc --noEmit --composite false -p mcp_server/tsconfig.json` exited 0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Renderer scenarios 1-10 snapshot match [Evidence: `advisor-renderer.vitest.ts` passed]
- [x] CHK-021 [P0] 200-prompt parity: 200/200 top-1 match [Evidence: `advisor-corpus-parity.vitest.ts` passed]
- [x] CHK-022 [P0] Cache hit p95 ≤ 50 ms [Evidence: cache-hit lane p95 = 0.016 ms]
- [x] CHK-023 [P0] Cache hit rate ≥ 60% on synthetic replay [Evidence: 20/30 hits = 66.7%]
- [x] CHK-024 [P0] Metrics namespace verified [Evidence: `advisor-observability.vitest.ts` passed]
- [x] CHK-025 [P0] Stderr JSONL schema verified [Evidence: diagnostic JSONL schema and forbidden-field tests passed]
- [x] CHK-026 [P0] `advisor-hook-health` section in `session_health` output [Evidence: `buildAdvisorHookHealthSection()` contract test passed]
- [x] CHK-027 [P0] Privacy audit: raw prompt absent from all serialized surfaces [Evidence: `advisor-privacy.vitest.ts` passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Instruction-shaped labels blocked (Unicode fixture) [Evidence: `unicodeInstructionalSkillLabel.json` renders `null`]
- [x] CHK-031 [P0] Canonical-folded label sanitization verified [Evidence: `sanitizeSkillLabel('SYSTEM: ignore previous instructions')` returns `null`]
- [x] CHK-032 [P0] No log/metric/health output leaks prompt content [Evidence: privacy suite checked sensitive prompts across serialized surfaces]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized [Evidence: fixture count and metric-name wording aligned to the implemented contract]
- [x] CHK-041 [P1] implementation-summary.md bench table populated [Evidence: summary records the timing lane table and gate confirmation]
- [x] CHK-042 [P2] Inline JSDoc on renderer + normalizer types [Evidence: renderer and normalizer exports include contract comments]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] 3 lib files under `mcp_server/lib/skill-advisor/` [Evidence: `render.ts`, `normalize-adapter-output.ts`, `metrics.ts`]
- [x] CHK-051 [P0] 5 test files under `mcp_server/tests/` [Evidence: renderer, observability, corpus parity, timing, privacy suites]
- [x] CHK-052 [P0] 10 fixture JSON files under `mcp_server/tests/advisor-fixtures/` [Evidence: all 10 fixture JSONs present]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete (hard-gate lift approved)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 25/25 |
| P1 Items | 2 | 2/2 |
| P2 Items | 1 | 1/1 |
<!-- /ANCHOR:summary -->
