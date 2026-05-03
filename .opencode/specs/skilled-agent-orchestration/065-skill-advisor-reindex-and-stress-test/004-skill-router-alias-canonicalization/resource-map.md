---
title: "Resource Map: 065/004 - skill-router alias canonicalization"
description: "Planned affected and checked surfaces for alias-aware router scoring."
trigger_phrases: ["065/004 resource map", "alias canonicalization resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
    last_updated_at: "2026-05-03T12:07:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Updated completed CP-103 alias resource map"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/004 - skill-router alias canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 13
- **By category**: Specs=6, Skills=6, Tests=1
- **Missing on disk**: 0
- **Scope**: files affected or checked for CP-103 alias remediation
- **Generated**: 2026-05-03T12:07:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | Alias requirements |
| `plan.md` | Updated | OK | Alias implementation plan |
| `tasks.md` | Updated | OK | Execution tasks and evidence |
| `checklist.md` | Updated | OK | Verification gates and evidence |
| `implementation-summary.md` | Updated | OK | Before/after CP-103 result |
| `resource-map.md` | Updated | OK | Affected and checked surfaces |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/command/spec_kit/deep-review.md` | Checked | OK | Command id side of alias |
| `.opencode/skill/sk-deep-review/SKILL.md` | Checked | OK | Skill id side of alias |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | Python alias parity |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` | Created | OK | Canonical alias groups and helpers |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/` | Checked | OK | Native scorer integration surface |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Updated | OK | Added alias-aware regression |
<!-- /ANCHOR:tests -->
