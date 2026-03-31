
---
title: "Verification Checklist: Adversarial Self-Check for Review, Debug, Ultra-Think Agents [04--agent-orchestration/026-review-debug-agent-improvement/checklist]"
description: "Verification checklist for the adversarial self-check agent improvement spec."
trigger_phrases:
  - "verification"
  - "checklist"
  - "review"
  - "debug"
  - "ultra-think"
  - "026"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Adversarial Self-Check for Review, Debug, Ultra-Think Agents

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- P0 items are blockers.
- P1 items are required unless explicitly deferred.
- P2 items are optional and documented when skipped.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Plan documented in `plan.md`
- [x] CHK-003 [P1] Target runtime variants identified before normalization
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Review variants contain adversarial self-check guidance
- [x] CHK-011 [P0] Debug variants contain counter-evidence validation
- [x] CHK-012 [P0] Ultra-think variants contain adversarial cross-critique guidance
- [x] CHK-013 [P1] Removed historical variants are described in prose only
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Surviving runtime variants were read and cross-checked
- [x] CHK-021 [P0] Codex TOML variants remain syntactically valid
- [x] CHK-022 [P1] No out-of-scope agent families were changed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced
- [x] CHK-031 [P1] No permission or authority rules were weakened
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` are synchronized
- [x] CHK-041 [P1] Historical removed runtime variants are called out explicitly as removed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temporary files remain in the spec folder
- [x] CHK-051 [P2] Compliance fixes stay inside the assigned spec scope
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |
<!-- /ANCHOR:summary -->
