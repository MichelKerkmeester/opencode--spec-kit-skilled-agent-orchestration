---
title: "Feature Specification: Image Decoding Async Analysis [021-decoding-async-analysis/spec]"
description: "The decoding=\"async\" HTML attribute for <img> elements is a performance optimization that may not be utilized on anobel.com. Without this attribute, the browser decodes images s..."
trigger_phrases:
  - "feature"
  - "specification"
  - "image"
  - "decoding"
  - "async"
  - "spec"
  - "021"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Image Decoding Async Analysis

<!-- SPECKIT_LEVEL: CORE -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Verified - Correctly Implemented |
| **Created** | 2026-01-24 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem--purpose -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `decoding="async"` HTML attribute for `<img>` elements is a performance optimization that may not be utilized on anobel.com. Without this attribute, the browser decodes images synchronously on the main thread, potentially causing jank during scrolling on pages with many or large images.

### Purpose
Analyze anobel.com's image usage patterns and identify which images would benefit from `decoding="async"` to improve scrolling smoothness and perceived performance.

<!-- /ANCHOR:problem--purpose -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research and document `decoding="async"` attribute behavior
- Scan anobel.com codebase for `<img>` elements
- Categorize images by position (above/below fold) and size
- Provide recommendations for which images should use `decoding="async"`

### Out of Scope
- Implementing changes in Webflow (analysis only)
- Lazy loading optimization (`loading="lazy"`) - different concern
- Image compression or format optimization
- CDN configuration changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (Analysis only) | N/A | No file modifications - this is an analysis task |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document `decoding="async"` attribute behavior | Clear explanation of sync vs async decoding |
| REQ-002 | Identify all `<img>` elements in anobel.com | Complete inventory of images with context |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Categorize images by recommendation | Each image tagged: use-async / avoid-async / neutral |
| REQ-004 | Provide implementation recommendations | Clear guidance for Webflow implementation |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Complete inventory of images on anobel.com with decoding recommendations
- **SC-002**: Clear rationale for each recommendation category

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks--dependencies -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to Webflow project | Cannot verify current img attributes | Use exported HTML or live site |
| Risk | Images loaded via JS/dynamic | May miss some images | Document limitation |

<!-- /ANCHOR:risks--dependencies -->

---

<!-- ANCHOR:open-questions -->
## 7. OPEN QUESTIONS

- Does anobel.com already use `decoding="async"` anywhere?
- Are there CMS-managed images that need different handling?

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

<!-- ANCHOR:appendix-technical-background -->
## APPENDIX: Technical Background

### `decoding="async"` Explained

**What it does:**
- Controls *how* the browser turns image data into pixels
- `async`: Decodes in background thread, page stays responsive
- `sync`: Decodes on main thread, may block rendering
- `auto` (default): Browser decides

**Use when:**
- Large images (high resolution)
- Pages with many images
- Images below the fold

**Avoid when:**
- Hero images / critical above-fold content
- LCP (Largest Contentful Paint) images
- Small icons/logos that decode instantly

**Browser Support:**
- Chrome 65+, Firefox 63+, Safari 11.1+
- Widely supported in modern browsers
<!-- /ANCHOR:appendix-technical-background -->
