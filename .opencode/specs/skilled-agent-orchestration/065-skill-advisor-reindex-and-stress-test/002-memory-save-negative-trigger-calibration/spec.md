---
title: "Spec: 065/002 - memory-save negative trigger calibration"
description: "Plan phase to reduce memory:save false positives for ordinary file-save prompts while preserving context-preservation routing."
trigger_phrases: ["065/002 memory save calibration", "memory save false positive", "save file prompt"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created follow-on phase from 065 stress-test finding CP-101/CP-104"
    next_safe_action: "plan_and_execute_memory_save_calibration"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Spec: 065/002 - memory-save negative trigger calibration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| Level | 1 |
| Status | Planned |
| Parent | 065 |
| Source finding | CP-101 false positive and CP-104 missed semantic match |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The baseline router campaign found two related memory-save issues. `memory:save` scored 0.82 for `save the file I'm working on`, which is a file operation rather than context preservation. The advisor also missed `preserve everything we figured out today so the next session doesn't lose it`, which is context preservation without literal `save` or `context`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: tune advisor metadata, phrases, scoring, or negative examples for `memory:save`; add regression coverage for CP-101 and CP-104.

Out of scope: unrelated memory indexing behavior or new memory tools.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|---|---|
| REQ-001 | Ordinary file-save prompts do not route confidently to `memory:save` |
| REQ-002 | Context-preservation phrasing without literal trigger words surfaces `memory:save` |
| REQ-003 | Existing baseline prompt `save context` still routes to `memory:save` with confidence >= 0.8 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: CP-101 changes from FAIL to PASS.
- SC-002: CP-104 changes from FAIL to PASS.
- SC-003: Original Phase 1 known prompt gates remain green.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Overcorrecting and weakening real memory saves | Keep `save context` as a regression gate |
| Keyword-only fix misses novel wording | Include semantic preservation phrasing in tests |
<!-- /ANCHOR:risks -->
