---
title: "Resource Map: 065/001/001 - skill reindex"
description: "Path ledger for the completed skill advisor reindex phase."
trigger_phrases: ["065/001/001 resource map", "skill reindex resource map"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/001-skill-reindex"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added reindex resource map"
    next_safe_action: "preserve_as_baseline"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/001/001 - skill reindex

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 14
- **By category**: Specs=7, Skills=5, Tests=2
- **Missing on disk**: 0
- **Scope**: completed reindex artifacts plus advisor code/test surfaces changed or checked
- **Generated**: 2026-05-03T11:20:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `pre-snapshot.json` | Created | OK | Initial advisor state |
| `post-snapshot.json` | Created | OK | Post-replay advisor state |
| `reindex.log` | Updated | OK | Reindex and live replay evidence |
| `reindex-diff.md` | Created | OK | GO/NO-GO comparison |
| `implementation-summary.md` | Updated | OK | Final GO summary |
| `tasks.md` | Updated | OK | Completed task ledger |
| `checklist.md` | Created | OK | Verification ledger |
<!-- /ANCHOR:specs -->

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Updated | OK | MCP trust/reload behavior |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Updated | OK | Freshness/trust reporting |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts` | Updated | OK | Route projection behavior |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Updated | OK | Explicit lane scoring |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Updated | OK | Python fallback parity |
<!-- /ANCHOR:skills -->

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|---|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` | Updated | OK | Freshness tests |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Updated | OK | Native scorer tests |
<!-- /ANCHOR:tests -->
