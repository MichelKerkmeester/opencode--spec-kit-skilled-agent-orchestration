---
title: "Resource Map: 065/003 - create testing playbook routing"
description: "Planned affected and checked surfaces for testing-playbook route calibration."
trigger_phrases: ["065/003 resource map", "testing playbook routing resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
    last_updated_at: "2026-05-03T12:05:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Updated completed CP-105 resource map"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/003 - create testing playbook routing

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 14
- **By category**: Specs=6, Skills=7, Tests=1
- **Missing on disk**: 0
- **Scope**: files affected or checked for CP-105 remediation
- **Generated**: 2026-05-03T12:05:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `spec.md` | Updated | OK | CP-105 requirement |
| `plan.md` | Updated | OK | Route calibration plan |
| `tasks.md` | Updated | OK | Execution tasks and evidence |
| `checklist.md` | Updated | OK | Verification gates and evidence |
| `implementation-summary.md` | Updated | OK | Before/after CP-105 results |
| `resource-map.md` | Updated | OK | Affected and checked surfaces |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/sk-doc/SKILL.md` | Checked | OK | Generic doc routing control |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | Python fallback route parity |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts` | Updated | OK | Command bridge for `create:testing-playbook` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Updated | OK | Testing-playbook creation phrase boosts |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Updated | OK | Primary intent bonus and competitor dampening |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` | Checked | OK | Canonical alias support used by related phase |
| `.opencode/skill/system-spec-kit/**/graph-metadata.json` | Checked | OK | No route graph metadata edits required |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Updated | OK | Added CP-105 regression |
<!-- /ANCHOR:tests -->
