---
title: "Resource Map: 065/002 - memory-save negative trigger calibration"
description: "Affected and checked surfaces for completed memory:save calibration."
trigger_phrases: ["065/002 resource map", "memory save calibration resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Updated resource map after completed calibration"
    next_safe_action: "continue_phase_003_create_testing_playbook_routing"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/002 - memory-save negative trigger calibration

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 14
- **By category**: Specs=6, Skills=5, Tests=3
- **Missing on disk**: 0
- **Scope**: files affected or checked for CP-101/CP-104 remediation and advisor health verification
- **Generated**: 2026-05-03T11:17:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | Requirements for CP-101/CP-104 |
| `plan.md` | Updated | OK | Calibration plan |
| `tasks.md` | Updated | OK | Execution tasks |
| `checklist.md` | Updated | OK | Verification gates and evidence |
| `implementation-summary.md` | Updated | OK | Completion evidence |
| `description.json` | Updated | OK | Completion metadata |
| `graph-metadata.json` | Updated | OK | Completion metadata |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | Python fallback parity and graphless inline bridge health tolerance |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Updated | OK | Next-session preservation boost |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Updated | OK | Plain file-save confidence cap |
| `.opencode/skill/sk-doc/graph-metadata.json` | Updated | OK | Removed stale missing agent references blocking advisor graph-health validation |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/data/shadow-deltas.jsonl` | Checked | OK | Probe-generated telemetry noise removed from patch |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Updated | OK | Added CP-101/CP-104 regressions |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/shim.vitest.ts` | Updated | OK | Native shim allows memory-save candidate |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py` | Updated | OK | Command bridge owner expectation aligned to `memory:save` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-graph-health.vitest.ts` | Updated | OK | Health test covers graphless inline bridge tolerance |
<!-- /ANCHOR:tests -->
