---
title: "Resource Map: 065/002 - memory-save negative trigger calibration"
description: "Planned affected and checked surfaces for memory:save calibration."
trigger_phrases: ["065/002 resource map", "memory save calibration resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added resource map"
    next_safe_action: "execute_phase"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/002 - memory-save negative trigger calibration

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 9
- **By category**: Specs=4, Skills=4, Tests=1
- **Missing on disk**: 0
- **Scope**: files likely affected or checked for CP-101/CP-104 remediation
- **Generated**: 2026-05-03T11:20:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | Requirements for CP-101/CP-104 |
| `plan.md` | Updated | OK | Calibration plan |
| `tasks.md` | Updated | OK | Execution tasks |
| `checklist.md` | Created | OK | Verification gates |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Checked | OK | Reproduce probes with `--threshold 0.0` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Planned | OK | Possible trigger calibration |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Planned | OK | Possible confidence merge behavior |
| `.opencode/skill/system-spec-kit/**/graph-metadata.json` | Planned | OK | Possible route metadata source |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Planned | OK | Add CP-101/CP-104 regressions |
<!-- /ANCHOR:tests -->
