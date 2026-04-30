---
title: "Verification Checklist: Retroactive Phase-Parent Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "P0/P1/P2 verification for the migration packet."
trigger_phrases:
  - "retroactive phase parent checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/004-retroactive-phase-parent-migration"
    last_updated_at: "2026-04-27T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Author worker briefs + dispatch"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Retroactive Phase-Parent Migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Discovery scan complete; 28 in-scope parents enumerated
- [ ] CHK-002 [P0] Pre-migration 026 regression baseline captured at `scratch/regression-baseline-pre-004.txt`
- [ ] CHK-003 [P0] cli-copilot v1.0.36+ available
- [ ] CHK-004 [P0] Phases 001 + 002 + 003 shipped (templates, validators, docs ready)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All 3 worker briefs include hard constraints: tolerant migration, narrative preservation, manual-block preservation
- [ ] CHK-011 [P0] All 3 workers dispatched with `--model gpt-5.4 --effort medium --autopilot --no-ask-user --allow-all-tools --no-color --no-custom-instructions`
- [ ] CHK-012 [P0] Workers chunked by parent spec collection (no shared write paths)
- [ ] CHK-013 [P1] Each worker's JSON report passes JSON schema validation
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 28 in-scope phase parents present in worker reports (processed or skipped with reason)
- [ ] CHK-021 [P0] Post-migration discovery scan: zero parents in Category C
- [ ] CHK-022 [P0] 026 regression: parent-level error rules unchanged from `scratch/regression-baseline-pre-004.txt`
- [ ] CHK-023 [P0] Cross-impl detection: every touched parent returns identical bool from shell + ESM JS
- [ ] CHK-024 [P1] Spot-check 5 random touched parents: `manual` block byte-equal pre/post
- [ ] CHK-025 [P1] Spot-check 5 random touched parents: narrative content visibly preserved
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No worker deleted any heavy doc (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) at any parent
- [ ] CHK-031 [P0] No worker mutated files outside `.opencode/specs/` tree
- [ ] CHK-032 [P1] Worker logs contain no API key, secret, or token leakage
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `004/implementation-summary.md` authored with worker output aggregate + verification results
- [ ] CHK-041 [P0] `004/scratch/migration-manifest.json` filed
- [ ] CHK-042 [P1] Each B-category parent's refreshed spec.md still carries vision/purpose narrative
- [ ] CHK-043 [P1] Each C-category parent's synthesized spec.md follows `templates/phase_parent/spec.md` structure
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Worker briefs cleaned from `/tmp/` after dispatch (or retention reason documented in implementation-summary.md)
- [ ] CHK-051 [P1] Worker logs at `/tmp/copilot-worker-N.log` archived to `004/scratch/` for audit
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 9 | 0/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
