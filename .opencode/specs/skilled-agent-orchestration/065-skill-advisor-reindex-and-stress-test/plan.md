---
title: "Plan: 065 - skill-advisor routing quality program"
description: "Program-level plan for preserving the completed baseline and executing four router calibration phases inside existing packet 065."
trigger_phrases: ["065 plan", "skill advisor routing quality plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T12:12:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed all 065 remediation phases"
    next_safe_action: "commit_or_resume_from_clean_validation_state"
    blockers: []
    key_files:
      - "001-baseline-reindex-and-stress-results/"
      - "002-memory-save-negative-trigger-calibration/"
      - "003-create-testing-playbook-routing/"
      - "004-skill-router-alias-canonicalization/"
      - "005-ambiguous-debug-review-routing/"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Plan: 065 - skill-advisor routing quality program

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

The packet is a program container. Phase 001 preserves the completed reindex and stress-test baseline; phases 002-005 implement the four follow-on routing fixes found by that baseline.

All executable remediation phases are complete. The parent stays responsible for aggregate evidence, final validation, and resume continuity.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each child phase has `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `resource-map.md`, `description.json`, and `graph-metadata.json`.
- Each implementation phase runs deterministic advisor probes before and after changes.
- Existing known-good advisor prompts stay green: `save context`, `create new agent`, `deep research`, `git commit`, and `review pull request`.
- Recursive strict validation passes for 065 before any completion claim.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The program uses phase-local remediation. Each child phase owns one router failure class and its regression probes, while the root only tracks sequence and aggregate state.

Expected affected runtime surfaces across the program:

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/**`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/**`
- `.opencode/skill/system-spec-kit/**/graph-metadata.json` and related route metadata if calibration requires metadata changes
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Status | Work |
|---|---|---|
| 001 | Complete | Preserve baseline reindex and stress-test evidence |
| 002 | Complete | Fixed `memory:save` false positives and semantic misses |
| 003 | Complete | Fixed testing-playbook creation routing |
| 004 | Complete | Canonicalized skill/command aliases |
| 005 | Complete | Improved ambiguous debug/review routing |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Use the baseline CP scenarios as regression probes. Every remediation phase ran its target CP, relevant controls, advisor unit tests, typecheck/build when code changed, and strict spec validation at parent completion.

Final replay:

| Scenario | Result |
|---|---|
| CP-100 | `sk-code-review` top-1, confidence 0.82 |
| CP-101 | `system-spec-kit` top-1; `memory:save` stays below threshold at 0.49 |
| CP-102 | no recommendations |
| CP-103 | `sk-deep-review` top-1, confidence 0.95; alias-aware PASS for `spec_kit:deep-review` |
| CP-104 | `memory:save` top-1, confidence 0.82 |
| CP-105 | `create:testing-playbook` top-1, confidence 0.8387 |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 baseline report | Internal evidence | Complete | Follow-on phases lose source-of-truth |
| Advisor test suite | Internal tests | Available | Cannot safely change scoring |
| MCP advisor tools | Runtime verification | Available but may need restart | Live replay may lag source changes |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback any child phase independently. Keep the baseline phase intact; it is evidence, not an implementation surface.
<!-- /ANCHOR:rollback -->
