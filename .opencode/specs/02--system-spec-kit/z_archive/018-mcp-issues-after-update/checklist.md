---
title: "Verification Checklist: MCP Issues After Update [02--system-spec-kit/z_archive/018-mcp-issues-after-update/checklist]"
description: "Verification Date: 2026-03-31"
trigger_phrases:
  - "verification"
  - "checklist"
  - "archive"
  - "validation"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: MCP Issues After Update

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] CHK-001 [P0] Archived topic documented in spec.md
- [ ] CHK-002 [P0] Normalization approach recorded in plan.md
- [ ] CHK-003 [P1] Compatibility files reviewed before edits
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Core archive docs match current template structure
- [ ] CHK-011 [P0] No malformed anchors remain in retained spec docs
- [ ] CHK-012 [P1] Auxiliary notes are simplified and readable
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Folder validates with zero errors
- [ ] CHK-021 [P0] Top-level markdown integrity checks pass
- [ ] CHK-022 [P1] Manual archive review confirms topic clarity
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No sensitive data was introduced during archive cleanup
- [ ] CHK-031 [P1] No misleading instructions remain in handover or archive notes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, and tasks.md describe the same archive state
- [ ] CHK-041 [P1] implementation-summary.md uses the correct folder metadata
- [ ] CHK-042 [P2] Optional archive notes are concise and self-explanatory
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Required Level 1 files are present
- [ ] CHK-051 [P1] Compatibility stubs are only kept where the archived folder already had them
- [ ] CHK-052 [P2] Extra markdown files no longer contain broken backticked markdown references
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-03-31
<!-- /ANCHOR:summary -->

---
