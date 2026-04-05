---
title: "Tasks: Hero Webshop Selector Scoping [00--anobel.com/035-hero-contact-success/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "hero"
  - "webshop"
  - "contact-success"
  - "035"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Hero Webshop Selector Scoping

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inspect the contact-success DOM via Chrome DevTools
- [x] T002 Identify which `hero_webshop.js` selectors match on contact-success
- [x] T003 Confirm the root cause is broad class-based selector scoping
- [x] T004 Compare the script with the `hero_cards.js` `data-target` pattern
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Replace the class-based selectors in `hero_webshop.js` with `data-target` selectors
- [x] T006 Add the `.is--webshop` qualifier to the section selector
- [ ] T007 Minify the updated script into `hero_webshop.min.js`
- [ ] T008 Deploy the rebuilt asset to Cloudflare R2 CDN with a version bump
- [ ] T009 Add the matching `data-target` attributes in Webflow Designer
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify the contact-success page no longer shows the blue bar artifact
- [ ] T011 Verify the webshop hero animation still works correctly
- [ ] T012 Run browser checks on desktop and mobile
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Contact-success and webshop verification both pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
