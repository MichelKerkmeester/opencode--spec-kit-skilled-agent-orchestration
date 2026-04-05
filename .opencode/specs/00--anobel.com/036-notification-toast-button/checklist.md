---
title: "Verification Checklist: CMS-Driven Button in Notification Toast"
description: "QA verification checklist for the notification toast button feature."
trigger_phrases:
  - "notification toast button checklist"
  - "alert button verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: CMS-Driven Button in Notification Toast

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

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: spec.md contains 6 requirements (REQ-001 to REQ-006), 4 acceptance scenarios, and 5 success criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: plan.md defines 3 phases with architecture, data flow, and component descriptions
- [x] CHK-003 [P1] Dependencies identified and available — Evidence: plan.md Section 6 lists 3 dependencies (Webflow Designer, CDN, CMS fields), all status Green
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `CONFIG.selectors.button` added — no magic strings elsewhere
- [ ] CHK-011 [P0] No console errors or warnings when button element is present
- [ ] CHK-012 [P0] No console errors when button element is absent (null-guard)
- [ ] CHK-013 [P1] Code follows existing patterns (matches `update_bullet_visibility()` structure)
- [ ] CHK-014 [P1] External URL detection uses `new URL()` hostname comparison, not regex
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Button with text + URL: button visible, clickable, correct label
- [ ] CHK-021 [P0] Empty Button field: no button visible, toast layout unchanged
- [ ] CHK-022 [P0] Button links to correct URL from CMS `URL` field
- [ ] CHK-023 [P1] External URL: opens in new tab with `target="_blank" rel="noopener noreferrer"`
- [ ] CHK-024 [P1] Same-domain URL: navigates in same tab (no `target="_blank"`)
- [ ] CHK-025 [P1] Whitespace-only Button field: treated as empty, button hidden
- [ ] CHK-026 [P1] Empty URL with non-empty Button: button hidden (no broken link)
- [ ] CHK-027 [P1] Malformed URL: no JS error, defaults to same-tab behavior
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] External links include `rel="noopener noreferrer"`
- [ ] CHK-032 [P1] URL values rendered as `href` only — no `innerHTML` or dynamic script execution
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `webflow_guide.md` created with all Designer steps
- [ ] CHK-042 [P2] Code comments adequate (inline comments where logic is non-obvious)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files outside scratch/
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:regression -->
## Regression

- [ ] CHK-060 [P0] Existing alerts without button: behavior identical to before
- [ ] CHK-061 [P0] Dismissal logic unchanged (session, day, until-end-date)
- [ ] CHK-062 [P1] Scheduling logic unchanged (start/end dates, time-based)
- [ ] CHK-063 [P1] Office hours logic unchanged
- [ ] CHK-064 [P1] Bullet visibility logic unchanged
- [ ] CHK-065 [P1] Side panel position adjustment unchanged
<!-- /ANCHOR:regression -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 |
| P1 Items | 14 | 1/14 |
| P2 Items | 2 | 0/2 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->

---
