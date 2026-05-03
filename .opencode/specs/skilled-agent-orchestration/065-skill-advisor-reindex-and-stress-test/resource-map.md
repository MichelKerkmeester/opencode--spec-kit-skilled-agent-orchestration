---
title: "Resource Map: 065 - skill-advisor routing quality program"
description: "Program-level path ledger for all phase folders and expected advisor routing surfaces."
trigger_phrases: ["065 resource map", "skill advisor routing resources"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added root resource map"
    next_safe_action: "execute_phase_002"
    blockers: []
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---

# Resource Map: 065 - skill-advisor routing quality program

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 14
- **By category**: Specs=8, Skills=5, Tests=1
- **Missing on disk**: 0
- **Scope**: parent-level map for the 065 program, including child phase docs and shared advisor surfaces to check
- **Generated**: 2026-05-03T11:20:00Z
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
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration/` | Created | OK | Planned remediation phase |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing/` | Created | OK | Planned remediation phase |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization/` | Created | OK | Planned remediation phase |
| `.opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing/` | Created | OK | Planned remediation phase |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Checked | OK | CLI fallback and deterministic probes |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/` | Planned | OK | Likely scorer calibration surface |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/` | Checked | OK | Advisor status/recommend handler surface |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Checked | OK | MCP tool registration and trust context |
| `.opencode/skill/system-spec-kit/**/graph-metadata.json` | Planned | OK | Possible route metadata inputs |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/` | Planned | OK | Native scorer and handler regressions |
<!-- /ANCHOR:tests -->
