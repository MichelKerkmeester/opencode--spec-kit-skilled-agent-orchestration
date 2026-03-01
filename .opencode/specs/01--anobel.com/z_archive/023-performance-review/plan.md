---
title: "Implementation Plan: Performance Optimization Review - Spec 025 [025-performance-review/plan]"
description: "This plan covers the post-implementation review of Spec 024 performance optimizations, remediation of discovered version inconsistencies, and addition of cleanup function to inp..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "performance"
  - "optimization"
  - "review"
  - "025"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Performance Optimization Review - Spec 025

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, HTML |
| **Framework** | Webflow (embedded code) |
| **Storage** | None |
| **Testing** | Lighthouse CLI, PageSpeed API, Browser verification |

### Overview

This plan covers the post-implementation review of Spec 024 performance optimizations, remediation of discovered version inconsistencies, and addition of cleanup function to input_upload.js. The work is primarily verification and small fixes rather than new feature development.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Lighthouse audits captured
- [ ] Version inconsistencies resolved
- [ ] Docs updated (spec/plan/tasks/implementation-summary)

---

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

File-level changes only (no architectural modifications)

### Key Components

- **HTML Script References**: R2 CDN version strings in script tags
- **input_upload.js**: FilePond initialization and cleanup
- **Lighthouse CLI**: Performance measurement tool

### Data Flow

```
Lighthouse → PageSpeed API/CLI → JSON output → scratch/ → spec.md metrics table
```

---

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:implementation-phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Data Gathering

- [ ] Run Lighthouse audits (Mobile + Desktop) for Home page
- [ ] Run Lighthouse audits (Mobile + Desktop) for Contact page
- [ ] Run Lighthouse audits (Mobile + Desktop) for Werken Bij page
- [ ] Save JSON outputs to scratch/

### Phase 2: Version Remediation

- [ ] Verify v1.2.35 exists on R2 CDN for marquee_brands.js
- [ ] Update contact.html marquee_brands.js to v1.2.35
- [ ] Update home.html marquee_brands.js to v1.2.35
- [ ] Update n5_brochures.html marquee_brands.js to v1.2.35
- [ ] Update d1_bunkering.html marquee_brands.js to v1.2.35
- [ ] Update blog.html input_select.js to v1.1.0

### Phase 3: Cleanup Function Implementation

- [ ] Read current input_upload.js implementation
- [ ] Design cleanup function for FilePond instances
- [ ] Implement InputUpload.cleanup() function
- [ ] Test file upload still works after changes

### Phase 4: Documentation

- [ ] Update spec.md with post-implementation metrics
- [ ] Create before/after comparison table
- [ ] Document Phase 2 priorities
- [ ] Create implementation-summary.md

---

<!-- /ANCHOR:implementation-phases -->

<!-- ANCHOR:testing-strategy -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Performance | Core Web Vitals | Lighthouse CLI, PageSpeed API |
| Integration | Script loading | Browser DevTools Network tab |
| Manual | File upload | Browser form submission |

---

<!-- /ANCHOR:testing-strategy -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lighthouse CLI | External | Green | Use PageSpeed API instead |
| PageSpeed API | External | Green | Use Lighthouse CLI instead |
| R2 CDN | Internal | Green | Cannot verify version availability |

---

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback-plan -->
## 7. ROLLBACK PLAN

- **Trigger**: File upload broken after cleanup function changes
- **Procedure**: Revert input_upload.js to previous version via git

---

<!-- /ANCHOR:rollback-plan -->

<!-- ANCHOR:phase-dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Data) ──────────────────────────────────────────┐
                                                         ↓
Phase 2 (Versions) ──► Phase 3 (Cleanup) ──► Phase 4 (Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Data Gathering | None | Documentation |
| Version Remediation | None | None (can parallel) |
| Cleanup Implementation | None | Documentation |
| Documentation | Data, Versions, Cleanup | None |

---

<!-- /ANCHOR:phase-dependencies -->

<!-- ANCHOR:effort-estimation -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Data Gathering | Low | ~15 min |
| Version Remediation | Low | ~10 min |
| Cleanup Implementation | Medium | ~20 min |
| Documentation | Low | ~30 min |
| **Total** | | **~1.25 hours** |

---

<!-- /ANCHOR:effort-estimation -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Git state clean (can revert changes)
- [ ] File upload tested before cleanup changes
- [ ] Version URLs verified accessible

### Rollback Procedure

1. Revert specific file with `git checkout HEAD -- <file>`
2. If widespread issues, `git checkout HEAD -- src/`
3. Verify pages load correctly in browser
4. Re-run Lighthouse to confirm no regression

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A

---

<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:lighthouse-commands -->
## LIGHTHOUSE COMMANDS

### Mobile Audits

```bash
npx lighthouse https://anobel.com/nl/ --output=json,html --chrome-flags="--headless" --only-categories=performance --output-path=./scratch/home-mobile

npx lighthouse https://anobel.com/nl/contact --output=json,html --chrome-flags="--headless" --only-categories=performance --output-path=./scratch/contact-mobile

npx lighthouse https://anobel.com/nl/werkenbij --output=json,html --chrome-flags="--headless" --only-categories=performance --output-path=./scratch/werkenbij-mobile
```

### Desktop Audits

```bash
npx lighthouse https://anobel.com/nl/ --output=json,html --chrome-flags="--headless" --preset=desktop --only-categories=performance --output-path=./scratch/home-desktop

npx lighthouse https://anobel.com/nl/contact --output=json,html --chrome-flags="--headless" --preset=desktop --only-categories=performance --output-path=./scratch/contact-desktop

npx lighthouse https://anobel.com/nl/werkenbij --output=json,html --chrome-flags="--headless" --preset=desktop --only-categories=performance --output-path=./scratch/werkenbij-desktop
```

### PageSpeed API (Alternative)

```bash
# Mobile
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://anobel.com/nl/&strategy=mobile" | jq '.lighthouseResult.categories.performance.score'

# Desktop
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://anobel.com/nl/&strategy=desktop" | jq '.lighthouseResult.categories.performance.score'
```

<!-- /ANCHOR:lighthouse-commands -->
