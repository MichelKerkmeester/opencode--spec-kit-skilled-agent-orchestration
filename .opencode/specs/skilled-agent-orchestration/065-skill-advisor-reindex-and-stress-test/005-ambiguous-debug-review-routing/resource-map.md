---
title: "Resource Map: 065/005 - ambiguous debug review routing"
description: "Planned affected and checked surfaces for ambiguous debug/review route calibration."
trigger_phrases: ["065/005 resource map", "ambiguous debug review resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T12:09:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Updated completed CP-100 resource map"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/005 - ambiguous debug review routing

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 14
- **By category**: Specs=6, Skills=7, Tests=1
- **Missing on disk**: 0
- **Scope**: files affected or checked for CP-100 remediation
- **Generated**: 2026-05-03T12:09:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | CP-100 requirements |
| `plan.md` | Updated | OK | Ambiguous routing plan |
| `tasks.md` | Updated | OK | Execution tasks and evidence |
| `checklist.md` | Updated | OK | Verification gates and evidence |
| `implementation-summary.md` | Updated | OK | Before/after CP-100 result |
| `resource-map.md` | Updated | OK | Affected and checked surfaces |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/sk-code/SKILL.md` | Checked | OK | Broad implementation route control |
| `.opencode/skill/sk-code-review/SKILL.md` | Checked | OK | Review candidate |
| `.opencode/skill/sk-deep-review/SKILL.md` | Checked | OK | Deep-review candidate |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | Python fallback ambiguous route parity |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Updated | OK | Ambiguous code-problem signal |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/` | Checked | OK | Lane calibration surface |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Updated | OK | Added CP-100 and implementation-control regressions |
<!-- /ANCHOR:tests -->
