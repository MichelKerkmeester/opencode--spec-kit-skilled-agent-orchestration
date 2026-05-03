---
title: "Resource Map: 065/003 - create testing playbook routing"
description: "Planned affected and checked surfaces for testing-playbook route calibration."
trigger_phrases: ["065/003 resource map", "testing playbook routing resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
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

# Resource Map: 065/003 - create testing playbook routing

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 9
- **By category**: Specs=4, Skills=4, Tests=1
- **Missing on disk**: 0
- **Scope**: files likely affected or checked for CP-105 remediation
- **Generated**: 2026-05-03T11:20:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | CP-105 requirement |
| `plan.md` | Updated | OK | Route calibration plan |
| `tasks.md` | Updated | OK | Execution tasks |
| `checklist.md` | Created | OK | Verification gates |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/sk-doc/SKILL.md` | Checked | OK | Generic doc routing control |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Checked | OK | CP-105 probe |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Planned | OK | Possible create route boost |
| `.opencode/skill/system-spec-kit/**/graph-metadata.json` | Planned | OK | Possible create route metadata |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Planned | OK | Add CP-105 regression |
<!-- /ANCHOR:tests -->
