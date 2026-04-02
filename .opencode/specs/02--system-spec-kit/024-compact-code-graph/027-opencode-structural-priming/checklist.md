---
title: "Verification Checklist: OpenCode Structural Priming"
description: "Level 2 verification checklist for the non-hook runtime structural bootstrap phase."
trigger_phrases:
  - "027 structural priming checklist"
  - "opencode bootstrap checklist"
importance_tier: "normal"
contextType: "verification"
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: OpenCode Structural Priming

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` with OpenCode as the primary non-hook example
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` and kept separate from hook-runtime startup injection
- [ ] CHK-003 [P1] Dependencies on phases 018, 024, and sibling `026-session-start-injection-debug` are stated clearly
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Structural bootstrap contract is defined consistently across auto-prime, `session_bootstrap`, `session_resume`, and `session_health`
- [ ] CHK-011 [P0] First-turn guidance reduces reliance on manual graph-tool choice as the default path
- [ ] CHK-012 [P1] Structural contract explicitly defines token budget, degraded-state behavior, and source of truth
- [ ] CHK-013 [P1] Response hints degrade gracefully when graph data is stale or unavailable
- [ ] CHK-014 [P1] Packet references identify `027-opencode-structural-priming` and `026-session-start-injection-debug` unambiguously by slug
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] OpenCode first-turn flow verified with ready graph data
- [ ] CHK-021 [P0] OpenCode first-turn flow verified with stale or missing graph data
- [ ] CHK-022 [P1] Ready, stale, and missing graph states all use the expected structural contract behavior
- [ ] CHK-023 [P1] `session_bootstrap`, `session_resume`, and `session_health` wording checked for consistency
- [ ] CHK-024 [P1] Non-hook guidance verified to remain compatible with other runtimes after OpenCode-first wording
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Structural digest avoids exposing unnecessary sensitive workspace details
- [ ] CHK-031 [P0] Recovery guidance does not bypass established tool-safety or scope rules
- [ ] CHK-032 [P1] Degraded states do not present stale graph data as authoritative
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized
- [ ] CHK-041 [P1] Phase metadata explains the distinction from `026-session-start-injection-debug`
- [ ] CHK-042 [P1] Parent packet phase map updated to register `027-opencode-structural-priming`
- [ ] CHK-043 [P2] Parent packet follow-up notes updated if this phase changes expected sequencing
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Work remains scoped to the new child phase folder during documentation creation
- [ ] CHK-051 [P1] No unrelated packet files modified while drafting this phase
- [ ] CHK-052 [P2] Context preservation/memory follow-up considered if implementation proceeds later
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-04-02
<!-- /ANCHOR:summary -->
