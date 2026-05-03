---
title: "Resource Map: 065/004 - skill-router alias canonicalization"
description: "Planned affected and checked surfaces for alias-aware router scoring."
trigger_phrases: ["065/004 resource map", "alias canonicalization resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
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

# Resource Map: 065/004 - skill-router alias canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 9
- **By category**: Specs=4, Skills=4, Tests=1
- **Missing on disk**: 0
- **Scope**: files likely affected or checked for CP-103 alias remediation
- **Generated**: 2026-05-03T11:20:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | Alias requirements |
| `plan.md` | Updated | OK | Alias implementation plan |
| `tasks.md` | Updated | OK | Execution tasks |
| `checklist.md` | Created | OK | Verification gates |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/command/spec_kit/deep-review.md` | Checked | OK | Command id side of alias |
| `.opencode/skill/sk-deep-review/SKILL.md` | Checked | OK | Skill id side of alias |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Checked | OK | CP-103 probe |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/` | Planned | OK | Possible canonicalization support |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Planned | OK | Add alias-aware regression if runtime scoring changes |
<!-- /ANCHOR:tests -->
