---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Resource Map Deep-Loop Integration"
description: "P0/P1/P2 verification for convergence-time resource-map emission in sk-deep-review and sk-deep-research."
trigger_phrases:
  - "026/013 checklist"
  - "deep loop checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 checklist"
    next_safe_action: "Begin implementation"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Resource Map Deep-Loop Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 001 local-owner rollback completed and phase 012 template shape confirmed stable
- [ ] CHK-004 [P1] Delta shape fields for both skills confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `extract-from-evidence.cjs` is pure CJS (no network, no shell)
- [ ] CHK-011 [P0] `reduce-state.cjs` integration does not introduce convergence-write races
- [ ] CHK-012 [P1] Error handling defensive — malformed deltas logged and skipped, not fatal
- [ ] CHK-013 [P1] YAML edits syntactically valid (no tab/indentation breakage)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Vitest snapshot coverage for review and research shapes both pass
- [ ] CHK-021 [P0] Manual `/spec_kit:deep-review :auto` on fixture packet emits a valid map
- [ ] CHK-022 [P0] Manual `/spec_kit:deep-research :auto` on fixture packet emits a valid map
- [ ] CHK-023 [P1] `--no-resource-map` opt-out produces no map file and exits cleanly
- [ ] CHK-024 [P1] Zero-iteration and max-iteration edge cases behave per spec
- [ ] CHK-025 [P1] Malformed delta scenario produces a `degraded: true` map, not a crash
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in the emitted map (filter frontmatter from deltas)
- [ ] CHK-031 [P0] No shell-out or network calls in the extractor
- [ ] CHK-032 [P1] Path normalization prevents directory traversal in emitted paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Both SKILL.md files document the new output and opt-out
- [ ] CHK-041 [P1] Both command MD files mention the convergence-time emission
- [ ] CHK-042 [P1] Both convergence.md references note the new step
- [ ] CHK-043 [P1] Feature catalog entries exist for both skills
- [ ] CHK-044 [P1] Manual testing playbook entries exist for both skills
- [ ] CHK-045 [P2] README under `scripts/resource-map/` covers the input/output contract
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Extractor lands under `scripts/resource-map/` (consistent with phase-012 peer location)
- [ ] CHK-051 [P1] Test fixtures live under `scripts/tests/` (project convention)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 (pending implementation) |
| P1 Items | 15 | 0/15 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (post-implementation)
<!-- /ANCHOR:summary -->
