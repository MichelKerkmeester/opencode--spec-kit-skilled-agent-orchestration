---
title: "Verification Checklist: Outsourced Agent Memory Capture"
description: "Verification checklist for the outsourced agent memory capture protocol"
trigger_phrases: ["outsourced agent checklist", "memory handback checklist"]
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Outsourced Agent Memory Capture
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

- [x] CHK-001 [P0] Requirements documented in spec — spec created with full problem statement, scope, 5 requirements REQ-001–REQ-005 (verified)
- [x] CHK-002 [P0] Technical approach defined in plan — plan created with 4-phase approach, data flow diagram, dependency matrix (verified)
- [x] CHK-003 [P1] Dependencies identified and available — generate-context.js JSON mode exists, context template v2.2 stable, all 4 CLI skill folders present (confirmed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:protocol-design -->
## Protocol Design

- [ ] CHK-010 [P0] Memory return protocol defined — structured output format documented
- [ ] CHK-011 [P0] Protocol is CLI-agnostic — works across all 4 cli-* skills
- [ ] CHK-012 [P1] Protocol compatible with `generate-context.js` JSON mode input format
- [ ] CHK-013 [P1] Minimum viable fields defined and documented
<!-- /ANCHOR:protocol-design -->

---

<!-- ANCHOR:skill-updates -->
## Skill Updates

- [ ] CHK-020 [P0] cli-codex SKILL has Memory Handback section
- [ ] CHK-021 [P0] cli-copilot SKILL has Memory Handback section
- [ ] CHK-022 [P0] cli-gemini SKILL has Memory Handback section
- [ ] CHK-023 [P0] cli-claude-code SKILL has Memory Handback section
- [ ] CHK-024 [P0] cli-codex prompt templates has memory epilogue
- [ ] CHK-025 [P0] cli-copilot prompt templates has memory epilogue
- [ ] CHK-026 [P0] cli-gemini prompt templates has memory epilogue
- [ ] CHK-027 [P0] cli-claude-code prompt templates has memory epilogue
<!-- /ANCHOR:skill-updates -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Round-trip test passed: dispatch → structured output → save → searchable
- [ ] CHK-031 [P1] Graceful degradation verified: agent output without structured section handled cleanly
- [ ] CHK-032 [P1] Partial output handled: incomplete structured section still produces usable memory
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and up-to-date
- [ ] CHK-041 [P1] Implementation-summary.md created after completion
- [ ] CHK-042 [P2] CLAUDE.md updated with outsourced agent memory protocol reference (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 2/11 |
| P1 Items | 9 | 1/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->
