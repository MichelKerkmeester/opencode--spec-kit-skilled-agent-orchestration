---
title: "Spec: 065/002 — skill-router-stress-tests"
description: "Stress-test SKILL.md content + skill router routing efficiency via 6+ manual playbook CP-XXX scenarios dispatched across 3 external CLI executors (cli-copilot, cli-codex, cli-gemini)"
trigger_phrases:
  - "065/002 stress test"
  - "skill router stress"
  - "manual playbook scenarios"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded sub-phase"
    next_safe_action: "wait_for_001_complete_then_dispatch_executors"
    blockers:
      - "Blocked until 001-skill-reindex reaches Complete with GO signal"
    key_files:
      - "scenarios/"
      - "results/"
      - "test-report.md"
    completion_pct: 0
    open_questions:
      - "Confirm executor mix (default: cli-copilot + cli-codex + cli-gemini all 3)"
      - "Confidence threshold for PASS (default: 0.7 for primary skill, 0.5 for top-3 inclusion)"
    answered_questions: []
---

# Spec: 065/002 — skill-router-stress-tests

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | 1 (test-report.md serves as QA artifact in lieu of checklist.md) |
| Priority | P1 |
| Status | Planned (BLOCKED on 001) |
| Created | 2026-05-03 |
| Branch | `main` |
| Parent | `065-skill-advisor-reindex-and-stress-test` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the 001 reindex refreshes the skill advisor, validate that:

1. **SKILL.md content quality** is sufficient — does each SKILL.md describe its purpose / triggers / out-of-scope clearly enough that the router's natural-language matching works?
2. **Skill router efficiency** is trustworthy — does `mcp__spec_kit_memory__advisor_recommend` (and the matching live in skill_advisor.py) pick the right skill with high confidence on real-world prompts, and correctly say "no match" when nothing fits?

Validation method: 6 CP-XXX scenarios across 6 categories (ambiguous, false-positive, low-confidence, multi-skill, novel-phrasing, adversarial), each dispatched to 3 external CLI executors (cli-copilot, cli-codex, cli-gemini) for cross-runtime cross-validation. Pattern mirrors packet 060/004 (which validated @code agent stress-test methodology) and 062 (which extended it to @deep-research / @deep-review).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 6 CP-XXX manual playbook scenarios authored under `scenarios/` (CP-100 through CP-105)
- Per-scenario executor dispatch script (3 executors × 6 scenarios = 18 executions)
- Per-execution result capture into `results/CP-NNN-<executor>.json`
- Aggregate `test-report.md` with PASS/WARN/FAIL counts + methodology + lessons-learned (mirrors 060/004 structure)
- Checklist.md for QA verification

### Out of Scope
- Fixing failures discovered (creates follow-on packet recommendations instead)
- Changes to skill_advisor.py algorithm
- Changes to SKILL.md content (this packet measures, doesn't author)
- New skill creation
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|---|---|
| REQ-001 | 001-skill-reindex sub-phase reached Complete with GO signal before 002 starts |
| REQ-002 | 6 CP-XXX scenario files exist under `scenarios/` covering A/B/C/D/E/F categories |
| REQ-003 | Each scenario specifies: prompt, expected skill, pass criteria, confidence threshold |
| REQ-004 | Executor matrix: cli-copilot + cli-codex + cli-gemini (or operator-confirmed subset) |
| REQ-005 | All 18 (6×3) executions captured to `results/` |
| REQ-006 | `test-report.md` produced with PASS/WARN/FAIL counts, per-CP table, methodology, lessons-learned |
| REQ-007 | Findings classified by severity: P0 (router broken), P1 (missed match), P2 (low confidence on edge case) |
| REQ-008 | Recommendation section: which CPs warrant follow-on packet for SKILL.md content fix vs router algorithm change |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All 6 scenarios authored + executable
- SC-002: All 18 executions complete (or documented timeout/failure with retry exhausted)
- SC-003: test-report.md follows 060/004 structure (header, methodology, results table, lessons §9-style)
- SC-004: Strict validator passes on this sub-phase folder
- SC-005: At least one of: (a) PASS rate ≥ 80% (router healthy), or (b) clear list of follow-on remediation packets
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|---|---|---|
| Dependency | 001-skill-reindex | Hard block; do NOT dispatch executors against stale index |
| Risk | cli-copilot budget cap (per memory rule, max 3 concurrent) | Stagger dispatch; use per-CP delta files |
| Risk | cli-gemini single-model limitation | Accept; document in executor matrix notes |
| Risk | Executor timeouts on long prompts | Default 600s timeout; CP-105 (adversarial) may need 900s |
| Risk | Subjective scoring (LLM-as-judge anti-pattern) | Make pass criteria grep-checkable: expected skill name match, confidence numeric threshold |
| Risk | False conclusions from single-shot dispatch | Each CP runs across 3 executors; require 2/3 agreement for PASS |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm executor mix (default: all 3 — cli-copilot + cli-codex + cli-gemini)
- Confirm confidence thresholds: 0.7 primary / 0.5 top-3 inclusion (defaults)
- Should adversarial CP-105 be excluded from PASS-rate computation? (Default: include, separately tagged)
<!-- /ANCHOR:questions -->
