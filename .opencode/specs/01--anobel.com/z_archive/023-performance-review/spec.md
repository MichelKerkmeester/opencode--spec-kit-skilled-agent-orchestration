---
title: "Performance Optimization Review - Spec 025 [025-performance-review/spec]"
description: "Spec 024 implemented Phase 1 performance optimizations but lacks post-implementation verification. Additionally, version inconsistencies were discovered across HTML files, and s..."
trigger_phrases:
  - "performance"
  - "optimization"
  - "review"
  - "spec"
  - "025"
importance_tier: "important"
contextType: "decision"
---
# Performance Optimization Review - Spec 025

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implementation Complete (Pending Deployment Verification) |
| **Created** | 2026-01-31 |
| **Parent Spec** | 024-performance-optimization |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem-purpose -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec 024 implemented Phase 1 performance optimizations but lacks post-implementation verification. Additionally, version inconsistencies were discovered across HTML files, and some JavaScript files lack proper cleanup functions that could cause memory leaks in SPA navigation.

### Purpose

Document the performance impact of Spec 024 implementation, remediate discovered issues (version inconsistencies, cleanup functions), and establish Phase 2 optimization priorities.

---

<!-- /ANCHOR:problem-purpose -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Before/after performance comparison (Home, Contact, Werken Bij)
- Version consistency remediation (3 scripts across 5 HTML files)
- JavaScript cleanup function for `input_upload.js`
- Phase 2 optimization roadmap documentation

### Out of Scope

- TypeKit async loading (Webflow-managed constraint)
- jQuery/Webflow.js defer (Webflow-managed constraint)
- Motion.dev tree-shaking (Phase 2 candidate)
- Critical CSS inlining (Phase 2 candidate)
- ConsentPro audit (requires legal review)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/0_html/contact.html` | Modify | Update marquee_brands.js v1.2.33 → v1.2.35 |
| `src/0_html/home.html` | Modify | Update marquee_brands.js v1.2.33 → v1.2.35 |
| `src/0_html/nobel/n5_brochures.html` | Modify | Update marquee_brands.js v1.2.33 → v1.2.35 |
| `src/0_html/services/d1_bunkering.html` | Modify | Update marquee_brands.js v1.2.33 → v1.2.35 |
| `src/0_html/blog.html` | Modify | Update input_select.js v1.0.0 → v1.1.0 |
| `src/2_javascript/form/input_upload.js` | Modify | Add cleanup function for FilePond instances |

---

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix marquee_brands.js version to v1.2.35 | All 4 HTML files reference v1.2.35 |
| REQ-002 | Document PageSpeed metrics | Lighthouse JSON saved to scratch/ |
| REQ-003 | Create before/after comparison table | spec.md contains metrics comparison |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Fix input_select.js version to v1.1.0 | blog.html references v1.1.0 |
| REQ-005 | Add cleanup function to input_upload.js | `InputUpload.cleanup()` function exists |
| REQ-006 | Establish Phase 2 priorities | plan.md contains prioritized roadmap |

---

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All version inconsistencies resolved (grep verification shows uniform versions)
- **SC-002**: Lighthouse audits captured for 3 pages (Home, Contact, Werken Bij)
- **SC-003**: input_upload.js exposes cleanup function for FilePond instances

---

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks-dependencies -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | PageSpeed API availability | Cannot capture metrics | Use npx lighthouse as fallback |
| Dependency | R2 CDN scripts at correct versions | Version updates won't work | Verify v1.2.35 exists before updating |
| Risk | FilePond cleanup breaks uploads | Medium | Test file upload after changes |

---

<!-- /ANCHOR:risks-dependencies -->

<!-- ANCHOR:non-functional-requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Mobile LCP target <4s (down from 20.2s baseline)
- **NFR-P02**: Mobile FCP target <3s (down from 6.2s baseline)
- **NFR-P03**: Desktop LCP target <2.5s (down from 3.7s baseline)

### Reliability

- **NFR-R01**: No console errors after version updates
- **NFR-R02**: File upload functionality preserved after cleanup function addition

---

<!-- /ANCHOR:non-functional-requirements -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Version Update Scenarios

- Script not found at new version: Check R2 CDN before updating HTML
- Multiple version references in same file: Update all instances

### Cleanup Function Scenarios

- FilePond not initialized: Check instances array length before cleanup
- Multiple upload elements: Iterate all FilePond instances
- Cleanup called twice: Idempotent operation (no-op if already cleaned)

---

<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity-assessment -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 6 files, ~50 LOC changes, 2 systems (HTML/JS) |
| Risk | 8/25 | Low-risk version updates, standard cleanup pattern |
| Research | 10/20 | Lighthouse audits, version verification |
| **Total** | **30/70** | **Level 2** |

---

<!-- /ANCHOR:complexity-assessment -->

<!-- ANCHOR:baseline-metrics-pre-spec-024 -->
## BASELINE METRICS (Pre-Spec 024)

| Metric | Mobile | Desktop | Target |
|--------|--------|---------|--------|
| **LCP** | 20.2s | 3.7s | <4s / <2.5s |
| **FCP** | 6.2s | 1.5s | <3s / <1.8s |
| **Speed Index** | 8.7s | 2.0s | <4s / <3.4s |
| **TBT** | 110ms | 40ms | <200ms |
| **CLS** | 0.004 | 0.014 | <0.1 |

---

<!-- /ANCHOR:baseline-metrics-pre-spec-024 -->

<!-- ANCHOR:post-implementation-metrics-after-spec-024 -->
## POST-IMPLEMENTATION METRICS (After Spec 024)

*Captured via Lighthouse CLI on 2026-01-31*

### Home Page (https://anobel.com/nl/)

| Metric | Mobile | Desktop | Target | Status |
|--------|--------|---------|--------|--------|
| **Score** | 55% | 77% | >75% / >90% | Desktop OK |
| **LCP** | 21.4s | 4.1s | <4s / <2.5s | Both FAIL |
| **FCP** | 5.9s | 0.7s | <3s / <1.8s | Desktop OK |
| **Speed Index** | 10.1s | 1.6s | <4s / <3.4s | Desktop OK |
| **TBT** | 130ms | 0ms | <200ms | Both OK |
| **CLS** | 0.003 | 0.005 | <0.1 | Both OK |

### Contact Page (https://anobel.com/nl/contact)

| Metric | Mobile | Desktop | Target | Status |
|--------|--------|---------|--------|--------|
| **Score** | 57% | 75% | >75% / >90% | Desktop OK |
| **LCP** | 19.7s | 4.0s | <4s / <2.5s | Both FAIL |
| **FCP** | 3.9s | 0.9s | <3s / <1.8s | Desktop OK |
| **Speed Index** | 9.4s | 1.9s | <4s / <3.4s | Desktop OK |
| **TBT** | 110ms | 0ms | <200ms | Both OK |
| **CLS** | 0 | 0 | <0.1 | Both OK |

### Werken Bij Page (https://anobel.com/nl/werkenbij)

| Metric | Mobile | Desktop | Target | Status |
|--------|--------|---------|--------|--------|
| **Score** | 56% | 74% | >75% / >90% | Desktop OK |
| **LCP** | 20.0s | 4.2s | <4s / <2.5s | Both FAIL |
| **FCP** | 7.5s | 0.8s | <3s / <1.8s | Desktop OK |
| **Speed Index** | 9.8s | 2.0s | <4s / <3.4s | Desktop OK |
| **TBT** | 100ms | 0ms | <200ms | Both OK |
| **CLS** | 0 | 0 | <0.1 | Both OK |

### Analysis

**Mobile LCP Observation**: The mobile LCP remains ~20s despite the 3s safety timeout implemented in Spec 024. This suggests:

1. **Possible Cause**: The Lighthouse test may be measuring LCP based on the hero element's full paint completion rather than the visibility toggle.

2. **Alternative Explanation**: The code changes from Spec 024 may not be deployed to production yet (HTML files modified locally but not pushed to Webflow).

3. **Next Steps**: Verify deployment status and consider whether the LCP element needs explicit preloading.

**Desktop Performance**: Desktop metrics are significantly better with acceptable scores on FCP, Speed Index, TBT, and CLS. Desktop LCP (~4s) is borderline but far better than mobile.

---

<!-- /ANCHOR:post-implementation-metrics-after-spec-024 -->

<!-- ANCHOR:discovered-issues -->
## DISCOVERED ISSUES

### Version Inconsistencies

| Script | Expected | Actual | Pages Affected |
|--------|----------|--------|----------------|
| marquee_brands.js | v1.2.35 | v1.2.33 | contact.html, home.html, n5_brochures.html, d1_bunkering.html |
| input_select.js | v1.1.0 | v1.0.0 | blog.html |

### JavaScript Cleanup Issues

| File | Risk Level | Issue |
|------|------------|-------|
| input_upload.js | MEDIUM-HIGH | No explicit cleanup exposed; FilePond instances persist |

---

<!-- /ANCHOR:discovered-issues -->

<!-- ANCHOR:phase-2-candidates -->
## PHASE 2 CANDIDATES

| ID | Task | Estimated Impact | Effort | Priority |
|----|------|------------------|--------|----------|
| P2-1 | Motion.dev tree-shaking | -15KB | Medium | High |
| P2-2 | Lazy load non-critical scripts | -100-200ms TTI | Medium | High |
| P2-3 | Custom Swiper build | -25-30KB | Medium | Medium |
| P2-4 | Critical CSS inlining | -500-800ms LCP | High | Medium |
| P2-5 | ConsentPro audit | -250KB | High (legal) | Low |

---

<!-- /ANCHOR:phase-2-candidates -->

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- None currently

---

<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:revision-history -->
## REVISION HISTORY

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-31 | Claude Opus 4.5 | Initial spec created |
| 2026-01-31 | Claude Opus 4.5 | Implementation complete - version fixes, cleanup function, metrics captured |

<!-- /ANCHOR:revision-history -->
