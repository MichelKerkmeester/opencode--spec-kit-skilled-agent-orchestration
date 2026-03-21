---
title: "Feature Specification: Attribute Cleanup Deepdive [020-attribute-cleanup/spec]"
description: "Level 1 (Core) is appropriate when"
trigger_phrases:
  - "feature"
  - "specification"
  - "attribute"
  - "cleanup"
  - "deepdive"
  - "spec"
  - "020"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Attribute Cleanup Deepdive

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 1 (Core) is appropriate when:
- Changes affect <100 lines of code
- Simple feature or bug fix with clear scope
- Single developer, single session work
- Low risk, well-understood change
- No architectural decisions required
- 1-2 user stories maximum

DO NOT use Level 1 if:
- Multiple stakeholders need alignment
- Verification checklist would help QA
- Complex edge cases exist
- Architecture decisions are involved (use Level 3)
- Governance/compliance required (use Level 3+)
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-01-24 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem--purpose -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`src/2_javascript/global/attribute_cleanup.js` only cleaned a small, outdated subset of empty attributes (mostly legacy `data-btn-*`), while the current anobel.com CSS uses a broader set of value-based `data-*` attributes for variants and configuration.

When Webflow outputs these attributes with empty values, they add DOM weight and can create invalid HTML (`id=""`).

### Purpose
Keep the DOM and exported HTML clean by removing empty value-based attributes consistently across all pages.

<!-- /ANCHOR:problem--purpose -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deepdive scan of all local HTML pages in `src/0_html` for empty attribute output
- Inventory of value-based `data-*` attributes used by site CSS in `src/1_css`
- Update `src/2_javascript/global/attribute_cleanup.js` to remove empty attributes from that inventory

### Out of Scope
- CDN deployment/version bump (R2 URLs in `src/0_html/global.html`) - requires separate step
- Regenerating minified bundles under `src/2_javascript/z_minified/` - requires running the project minify workflow

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/2_javascript/global/attribute_cleanup.js` | Modify | Expand empty attribute allowlist based on `src/1_css` + known config attrs |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove empty `id=""` attributes | A jsdom smoke test shows `id` removed when empty |
| REQ-002 | Remove empty value-based `data-*` attributes used for variants/config | A jsdom smoke test shows representative attrs removed; list includes all CSS-derived attrs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Keep marker/presence-only attributes untouched | jsdom smoke test preserves an attribute not in the allowlist (e.g. `data-notification-spacer`) |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `src/2_javascript/global/attribute_cleanup.js` contains the consolidated attribute list derived from `src/1_css`
- **SC-002**: Smoke test passes (no accidental removal of non-listed marker attributes)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks--dependencies -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-removing attributes that are used as marker/presence flags | High | Only include value-based attributes (seen as `[...]="..."` in CSS) + explicit reviewed config attrs; keep allowlist explicit |
| Risk | Drift between CSS and allowlist over time | Med | Re-run CSS inventory when new variant attributes are introduced |

<!-- /ANCHOR:risks--dependencies -->

---

<!-- ANCHOR:open-questions -->
## 7. OPEN QUESTIONS

- Should we also regenerate `src/2_javascript/z_minified/global/attribute_cleanup.js` and bump the CDN version in `src/0_html/global.html`?

<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:related-documents -->
## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`plan.md`](./plan.md) | Implementation approach and phases |
| [`tasks.md`](./tasks.md) | Detailed task breakdown |
| [`implementation-summary.md`](./implementation-summary.md) | Post-implementation record |

<!-- /ANCHOR:related-documents -->

---

<!--
CORE TEMPLATE (~95 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
