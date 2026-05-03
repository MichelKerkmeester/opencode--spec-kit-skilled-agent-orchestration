---
title: "Plan: 065 - skill-advisor routing quality program"
description: "Program-level plan for preserving the completed baseline and executing four router calibration phases inside existing packet 065."
trigger_phrases: ["065 plan", "skill advisor routing quality plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added detailed root plan"
    next_safe_action: "execute_002_memory_save_negative_trigger_calibration"
    blockers: []
    key_files:
      - "001-baseline-reindex-and-stress-results/"
      - "002-memory-save-negative-trigger-calibration/"
      - "003-create-testing-playbook-routing/"
      - "004-skill-router-alias-canonicalization/"
      - "005-ambiguous-debug-review-routing/"
    completion_pct: 20
    open_questions: []
    answered_questions: []
---

# Plan: 065 - skill-advisor routing quality program

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

The packet is a program container. Phase 001 preserves the completed reindex and stress-test baseline; phases 002-005 implement the four follow-on routing fixes found by that baseline.

The next executable phase is 002. The parent stays responsible for ordering, shared verification gates, and cross-phase evidence.
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
| 002 | Planned | Fix `memory:save` false positives and semantic misses |
| 003 | Planned | Fix testing-playbook creation routing |
| 004 | Planned | Canonicalize skill/command aliases |
| 005 | Planned | Improve ambiguous debug/review routing |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Use the baseline CP scenarios as regression probes. Every remediation phase must run its target CP, relevant controls, advisor unit tests, typecheck/build when code changes, and strict spec validation.
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
