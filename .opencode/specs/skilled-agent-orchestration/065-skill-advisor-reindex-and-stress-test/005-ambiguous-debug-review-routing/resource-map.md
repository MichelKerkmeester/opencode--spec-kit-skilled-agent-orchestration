---
title: "Resource Map: 065/005 - ambiguous debug review routing"
description: "Planned affected and checked surfaces for ambiguous debug/review route calibration."
trigger_phrases: ["065/005 resource map", "ambiguous debug review resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
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

# Resource Map: 065/005 - ambiguous debug review routing

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 10
- **By category**: Specs=4, Skills=5, Tests=1
- **Missing on disk**: 0
- **Scope**: files likely affected or checked for CP-100 remediation
- **Generated**: 2026-05-03T11:20:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | CP-100 requirements |
| `plan.md` | Updated | OK | Ambiguous routing plan |
| `tasks.md` | Updated | OK | Execution tasks |
| `checklist.md` | Created | OK | Verification gates |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/sk-code/SKILL.md` | Checked | OK | Broad implementation route control |
| `.opencode/skill/sk-code-review/SKILL.md` | Checked | OK | Review candidate |
| `.opencode/skill/sk-deep-review/SKILL.md` | Checked | OK | Deep-review candidate |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Checked | OK | CP-100 probe |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/` | Planned | OK | Possible lane calibration |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Planned | OK | Add CP-100 regression |
<!-- /ANCHOR:tests -->
