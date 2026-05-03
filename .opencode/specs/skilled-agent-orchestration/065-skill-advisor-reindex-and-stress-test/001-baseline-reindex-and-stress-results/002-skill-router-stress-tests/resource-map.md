---
title: "Resource Map: 065/001/002 - skill router stress tests"
description: "Path ledger for the completed six-scenario router stress campaign."
trigger_phrases: ["065/001/002 resource map", "router stress resource map"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/002-skill-router-stress-tests"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added stress-test resource map"
    next_safe_action: "preserve_as_baseline"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 065/001/002 - skill router stress tests

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 9
- **By category**: Specs=9
- **Missing on disk**: 0
- **Scope**: stress-test scenario, result, and report artifacts
- **Generated**: 2026-05-03T11:20:00Z
<!-- /ANCHOR:summary -->

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|---|---|---|---|
| `scenarios/CP-100-ambiguous.md` | Created | OK | Ambiguous debug/review prompt |
| `scenarios/CP-101-false-positive.md` | Created | OK | File-save false positive prompt |
| `scenarios/CP-102-low-confidence.md` | Created | OK | Pure conversation abstain prompt |
| `scenarios/CP-103-multi-skill.md` | Created | OK | Multi-skill alias prompt |
| `scenarios/CP-104-novel-phrasing.md` | Created | OK | Context-preservation paraphrase |
| `scenarios/CP-105-adversarial.md` | Created | OK | Testing-playbook confusable prompt |
| `results/CP-1{00..05}-{copilot,codex,gemini}.json` | Created | OK | 18 result captures |
| `test-report.md` | Created | OK | Aggregate PASS/WARN/FAIL report |
| `checklist.md` | Created | OK | Campaign verification ledger |
<!-- /ANCHOR:specs -->
