---
title: "Resource Map: 065 - skill-advisor routing quality program"
description: "Program-level path ledger for all phase folders and expected advisor routing surfaces."
trigger_phrases: ["065 resource map", "skill advisor routing resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T12:12:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Updated root resource map after phases 002-005"
    next_safe_action: "commit_or_resume_from_clean_validation_state"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065 - skill-advisor routing quality program

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 18
- **By category**: Specs=9, Skills=8, Tests=1
- **Missing on disk**: 0
- **Scope**: parent-level map for the completed 065 program, including child phase docs and shared advisor surfaces checked
- **Generated**: 2026-05-03T12:12:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/spec.md` | Updated | OK | Root phase contract |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/plan.md` | Created | OK | Root execution plan |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/tasks.md` | Created | OK | Root task sequence |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/checklist.md` | Created | OK | Root verification ledger |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/` | Moved | OK | Completed baseline evidence |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/resource-map.md` | Updated | OK | Root affected-surface ledger |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration/` | Updated | OK | Completed memory-save remediation phase |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing/` | Updated | OK | Completed testing-playbook remediation phase |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization/` | Updated | OK | Completed alias remediation phase |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing/` | Updated | OK | Completed ambiguous debug/review remediation phase |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | CLI fallback, deterministic probes, and Python parity |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` | Created | OK | Explicit command/skill alias groups |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts` | Updated | OK | Testing-playbook command bridge |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Updated | OK | Testing-playbook primary intent calibration |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Updated | OK | Testing-playbook and ambiguous debug/review signals |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/` | Checked | OK | Advisor status/recommend handler surface |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Checked | OK | MCP tool registration and trust context |
| `.opencode/skill/system-spec-kit/**/graph-metadata.json` | Checked | OK | No route metadata edits required |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/` | Updated | OK | Native scorer, graph health, and full regression suite |
<!-- /ANCHOR:tests -->
