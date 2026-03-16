---
title: "Verification Checklist: Session Source Validation [template:level_2/checklist.md]"
---
# Verification Checklist: Session Source Validation

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
- [ ] CHK-003 [P1] No upstream dependencies blocking start (A0.1-A0.5 can begin immediately)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `captureClaudeConversation` accepts `{ expectedSessionId, sessionStartTs, invocationTs }` session hints
- [ ] CHK-011 [P0] Fallback resolution order enforced: (1) exact sessionId, (2) active lock/session file, (3) newest by history timestamp, (4) reject
- [ ] CHK-012 [P0] Wrong-session transcript rejected when session ID or timestamp does not match (mtime no longer outranks)
- [ ] CHK-013 [P0] Provenance metadata persisted in frontmatter: `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated`
- [ ] CHK-014 [P0] Three file count metrics present: `captured_file_count`, `filesystem_file_count`, `git_changed_file_count`
- [ ] CHK-015 [P1] V10 validator fires on `filesystem_file_count` vs `captured_file_count` divergence with ratio-based threshold
- [ ] CHK-016 [P1] Contamination penalty applied in V2 scorer: -0.25, cap at 0.6
- [ ] CHK-017 [P1] V1 scorer extended with `hadContamination` parameter and equivalent penalty
- [ ] CHK-018 [P1] Trigger phrases reflect actual session content, not FILE_PATH artifacts or synthetic descriptions
- [ ] CHK-019 [P2] Weight/threshold values are configurable (not hardcoded magic numbers)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests pass for session fallback resolution (each step and full chain)
- [ ] CHK-021 [P0] Unit tests pass for V10 validator (matching, divergent, zero-count edge cases)
- [ ] CHK-022 [P1] Unit tests pass for contamination penalty in V1 and V2 scorers
- [ ] CHK-023 [P1] Unit tests pass for trigger sanitization (synthetic excluded, real preserved)
- [ ] CHK-024 [P1] Integration test: wrong-session transcript rejected before downstream processing
- [ ] CHK-025 [P1] Full test suite passes with no regressions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Session ID handling does not expose sensitive session data in logs or error messages
- [ ] CHK-031 [P2] Provenance metadata does not leak absolute filesystem paths outside the project
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md up to date with final implementation
- [ ] CHK-041 [P2] implementation-summary.md created after completion
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
| P0 Items | 9 | [ ]/9 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
