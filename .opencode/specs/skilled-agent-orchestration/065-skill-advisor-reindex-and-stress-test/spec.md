---
title: "Spec: 065 - skill-advisor routing quality program"
description: "Phase parent for completed skill-advisor reindex/stress-test baseline plus follow-on router calibration phases discovered by that campaign."
trigger_phrases:
  - "065 skill advisor"
  - "skill router stress test"
  - "skill reindex"
  - "memory save calibration"
  - "testing playbook routing"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T12:12:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed phases 002-005"
    next_safe_action: "commit_or_resume_from_clean_validation_state"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/"
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration/"
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing/"
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization/"
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not create follow-on specs 066-069; keep follow-on work as phases inside 065."
---

# Spec: 065 - skill-advisor routing quality program

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | Phase Parent |
| Priority | P1 |
| Status | Complete |
| Created | 2026-05-03 |
| Branch | `main` |
| Sub-phases | 5 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

This packet is now the container for the full skill-advisor routing quality program.

Phase `001` preserves the completed baseline work: advisor reindex, live MCP replay, and six-scenario stress campaign. That baseline proved the advisor is live and deterministic, but also found four routing quality misses.

Phases `002` through `005` are the follow-on fixes from that report. They stay inside 065 instead of becoming new top-level specs.

Final replay result: CP-100, CP-103, CP-104, and CP-105 now hit their repaired routes; CP-101 no longer promotes `memory:save`; CP-102 remains below threshold with no recommendations.
<!-- /ANCHOR:purpose -->

<!-- ANCHOR:children -->
## 3. SUB-PHASE CONTROL

| Order | Sub-phase | Purpose | Status |
|---|---|---|---|
| 1 | `001-baseline-reindex-and-stress-results` | Completed reindex + stress-test evidence, including nested original 001/002 execution phases | Complete |
| 2 | `002-memory-save-negative-trigger-calibration` | Reduce `memory:save` false positives while preserving real context-save intent | Complete |
| 3 | `003-create-testing-playbook-routing` | Route testing-playbook creation to `create:testing-playbook` instead of generic `sk-doc` | Complete |
| 4 | `004-skill-router-alias-canonicalization` | Normalize accepted skill/command aliases such as `sk-deep-review` vs `spec_kit:deep-review` | Complete |
| 5 | `005-ambiguous-debug-review-routing` | Improve ambiguous code/debug/review prompts so review/debug candidates outrank broad `sk-code` | Complete |
<!-- /ANCHOR:children -->

<!-- ANCHOR:scope -->
## 4. SCOPE BOUNDARY

### In scope

- Keep all follow-on router quality work inside this existing 065 packet.
- Preserve completed baseline evidence without rewriting history.
- Maintain phase-local docs for each follow-on remediation area.
- Update graph metadata so resume and traversal reflect completed child phases.

### Out of scope

- Creating new top-level specs 066-069.
- Creating new top-level specs for these remediations.
- Changing router code outside the documented child phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Baseline work is preserved under `001-baseline-reindex-and-stress-results`.
- SC-002: Follow-on phases 002-005 exist with Level 1 docs and metadata.
- SC-003: Root graph metadata lists the new phase children in order.
- SC-004: Strict recursive validation passes for the 065 packet.
- SC-005: Phase 002 resolves CP-101 and CP-104 without regressing `save context`.
- SC-006: Phases 003-005 resolve CP-105, CP-103, and CP-100 respectively.
- SC-007: Full CP-100..CP-105 replay is documented at parent level.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Type | Item | Reason |
|---|---|---|
| Baseline | `001-baseline-reindex-and-stress-results` | Supplies the evidence behind follow-on work |
| Tooling | `skill_advisor.py` and MCP advisor tools | System under test for phases 002-005 |
| Validation | `system-spec-kit` strict validator | Confirms the reorganized phase structure is valid |
<!-- /ANCHOR:dependencies -->
