---
title: "Verification Checklist: 015 Residuals Restart"
description: "Verification for 19 residuals."
trigger_phrases: ["015 residuals checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-015-residuals-restart"
    last_updated_at: "2026-04-18T23:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify post-implementation"
---
# Verification Checklist: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Pre-Implementation
- [ ] Delta review reviewed: ../001-initial-research/002-delta-review-015/review-report.md
- [ ] 19 residuals enumerated by cluster

## Code Quality
### Cluster 1 — DB boundary
- [ ] Realpath escape fix — evidence
- [ ] Late-env-override fix — evidence

### Cluster 2 — Advisor
- [ ] Source-metadata fail-open fix — evidence
- [ ] Continuation degraded visibility fix — evidence
- [ ] Cache-health false-green fix — evidence

### Cluster 3 — Resume minimal
- [ ] Minimal contract honored — evidence

### Cluster 4 — Review-graph
- [ ] coverage_gaps semantics fix — evidence
- [ ] coverage_gaps/uncovered_questions split — evidence
- [ ] Status fail-open fix — evidence

### Cluster 5 — Docs
- [ ] mcp-code-mode README fixes — evidence (3 items)
- [ ] folder_routing.md fixes — evidence (2 items)
- [ ] troubleshooting.md fix — evidence
- [ ] AUTO_SAVE_MODE doc — evidence
- [ ] sk-code-full-stack path fix — evidence
- [ ] cli-copilot duplicate tail fix — evidence

### Cluster 6 — Hygiene
- [ ] save-quality-gate whitespace fix — evidence
- [ ] session-prime regression visibility — evidence

## Testing
- [ ] Per-cluster regression tests green — evidence per cluster
- [ ] validate.sh --strict green on updated docs — evidence
- [ ] Full test suite green — evidence

## Security
- [ ] DB path boundary hardened (no realpath escape)

## Documentation
- [ ] All 19 residuals have matching commit SHAs recorded in implementation-summary.md

## File Organization
- [ ] No orphan files

## Verification Summary

Status: Pending
