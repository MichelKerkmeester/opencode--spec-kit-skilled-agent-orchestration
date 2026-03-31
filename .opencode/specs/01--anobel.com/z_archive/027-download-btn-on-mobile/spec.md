---
title: "Feature Specification: Download Button Mobile Fix [01--anobel.com/z_archive/027-download-btn-on-mobile/spec]"
description: "Download buttons on anobel.com were not working on mobile devices (especially iOS). Users would tap the download button but nothing would happen - the file wouldn't download and..."
trigger_phrases:
  - "feature"
  - "specification"
  - "download"
  - "button"
  - "mobile"
  - "spec"
  - "027"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Download Button Mobile Fix

<!-- SPECKIT_LEVEL: CORE -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem--purpose -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Download buttons on anobel.com were not working on mobile devices (especially iOS). Users would tap the download button but nothing would happen - the file wouldn't download and the button animation wouldn't trigger properly.

### Purpose
Enable reliable PDF downloads on all mobile devices with proper visual feedback (spinner during loading, checkmark on success).
<!-- /ANCHOR:problem--purpose -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix download button click handling on mobile
- Add spinner animation during download
- Fix iOS-specific download behavior
- Update all HTML files with new version

### Out of Scope
- Changing the PDF hosting location - files remain on Webflow CDN
- Native iOS "Save to Files" behavior - iOS will open PDFs in viewer

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/1_css/button/btn_download.css` | Modify | Add anchor overlay fix + spinner animation |
| `src/2_javascript/molecules/btn_download.js` | Modify | Fix iOS download path with loading state |
| `src/0_html/nobel/*.html` | Modify | Bump version to v1.3.0 + add CSS link |
| `src/0_html/contact.html` | Modify | Bump version to v1.3.0 + add CSS link |
| `src/0_html/services/*.html` | Modify | Bump version to v1.3.0 + add CSS link |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Download button click triggers JS handler on mobile | Tapping button fires JS, not Webflow anchor |
| REQ-002 | Visual feedback during download | Spinner shows when downloading |
| REQ-003 | Success animation works | Checkmark animation plays after download |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | iOS devices show loading state | 400ms spinner before triggering download |
| REQ-005 | All HTML files updated | Version bumped to v1.3.0 with CSS link |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Download buttons work on iOS Safari (file opens/downloads)
- **SC-002**: Spinner animation shows during download on all devices
- **SC-003**: Checkmark animation shows on success
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks--dependencies -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cloudflare R2 CDN | Files must be uploaded to CDN | Manual upload via wrangler CLI |
| Dependency | Webflow deployment | HTML must be deployed to live site | Copy to Webflow custom code |
| Risk | iOS still opens PDF in viewer | Medium | Expected behavior, user can use Share → Save |
<!-- /ANCHOR:risks--dependencies -->

---

<!-- ANCHOR:open-questions -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - all issues resolved
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:related-documents -->
<!-- /ANCHOR:questions -->
## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`implementation-summary.md`](./implementation-summary.md) | Post-implementation record |
| [`memory/`](./memory/) | Session context for future reference |
<!-- /ANCHOR:related-documents -->

---
