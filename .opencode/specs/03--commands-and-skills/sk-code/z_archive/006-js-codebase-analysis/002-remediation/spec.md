---
title: "Feature Specification: JavaScript Codebase Remediation [002-remediation/spec]"
description: "Implementation of P0 cleanup fixes and snake_case naming standardization across 26 JavaScript files identified in the codebase analysis. This work uses 10 parallel Opus agents o..."
trigger_phrases:
  - "feature"
  - "specification"
  - "javascript"
  - "codebase"
  - "remediation"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: JavaScript Codebase Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Implementation of P0 cleanup fixes and snake_case naming standardization across 26 JavaScript files identified in the codebase analysis. This work uses 10 parallel Opus agents orchestrated for maximum safety and consistency.

**Key Decisions**: Additive-only changes for cleanup; internal-only renaming (no public API changes)

**Critical Dependencies**: Original analysis findings in `../files-inventory.md`

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-01-25 |
| **Parent** | `006-js-codebase-analysis` (analysis phase) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The codebase analysis identified 8 files with P0 issues (missing cleanup functions causing potential memory leaks) and 19 files with naming convention violations (camelCase instead of snake_case).

### Purpose
Remediate all identified issues while ensuring ZERO breaking changes to existing functionality.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **P0 Fixes (8 files)**: Add cleanup/destroy functions for observers, listeners, intervals
- **Naming Standardization (19 files)**: Convert internal camelCase variables to snake_case
- **Safety Verification**: Ensure no public APIs or external integrations are affected

### Out of Scope
- Minification (will be done in separate step after verification)
- HTML/CDN version updates (after minification)
- New feature additions
- Refactoring beyond naming changes

### Files to Modify

#### P0 Cleanup Files (8)
| File | Path | Issue |
|------|------|-------|
| input_focus_handler.js | src/2_javascript/form/ | No cleanup, camelCase |
| input_placeholder.js | src/2_javascript/form/ | No cleanup, camelCase |
| conditional_visibility.js | src/2_javascript/global/ | No cleanup, camelCase |
| hero_video.js | src/2_javascript/hero/ | Resize listener cleanup |
| hero_general.js | src/2_javascript/hero/ | No cleanup, camelCase |
| tab_button.js | src/2_javascript/menu/ | No cleanup |
| label_product.js | src/2_javascript/molecules/ | No cleanup |
| link_grid.js | src/2_javascript/molecules/ | No cleanup, camelCase |
| link_hero.js | src/2_javascript/molecules/ | No cleanup, camelCase |

#### Naming-Only Files (11+)
| File | Path | Issue |
|------|------|-------|
| input_upload.js | src/2_javascript/form/ | camelCase naming |
| browser_change_page_title.js | src/2_javascript/global/ | camelCase naming |
| browser_force_start_at_top.js | src/2_javascript/global/ | camelCase naming |
| copyright.js | src/2_javascript/global/ | camelCase naming |
| hero_cards.js | src/2_javascript/hero/ | camelCase, missing constant |
| hero_webshop.js | src/2_javascript/hero/ | camelCase naming |
| hero_blog_article.js | src/2_javascript/hero/ | Missing INIT_DELAY_MS |
| accordion.js | src/2_javascript/menu/ | camelCase |
| tab_autoplay.js | src/2_javascript/menu/ | camelCase naming |
| tab_main.js | src/2_javascript/menu/ | camelCase naming |
| nav_back_to_top.js | src/2_javascript/navigation/ | camelCase |
| nav_language_selector.js | src/2_javascript/navigation/ | 13+ camelCase violations |
| marquee_brands.js | src/2_javascript/swiper/ | camelCase |
| marquee_clients.js | src/2_javascript/swiper/ | Duplicate of brands |
| timeline.js | src/2_javascript/swiper/ | camelCase naming |
| contact_office_hours.js | src/2_javascript/cms/ | camelCase naming |
| related_articles.js | src/2_javascript/cms/ | Minor naming |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No breaking changes | All existing functionality preserved |
| REQ-002 | No public API changes | `window.*` exports unchanged |
| REQ-003 | P0 cleanup added | All 8 files have cleanup functions |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Naming standardized | Internal variables use snake_case |
| REQ-005 | Code quality maintained | All files pass style guide checks |

<!-- /ANCHOR:requirements -->

---

## 5. SAFETY PROTOCOL

### Variables NEVER to Rename

```javascript
// External library parameters
window.Webflow    // Webflow integration
window.Motion     // Motion.dev library
window.Hls        // HLS.js library
window.lenis      // Lenis smooth scroll

// DOM API names (NEVER rename)
classList, dataset, style, addEventListener, etc.

// Public APIs on window (check each file)
window.ComponentName = { ... }  // Keep as-is
```

### Safe to Rename

```javascript
// Module-level internal variables
let hoverTimer     -> let hover_timer
const isPlaying    -> const is_playing
function handleClick -> function handle_click

// Local function variables
const firstName = ... -> const first_name = ...
```

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: All 8 P0 files have cleanup functions
- **SC-002**: All naming changes are internal-only
- **SC-003**: No console errors in browser testing
- **SC-004**: All files maintain original functionality

<!-- /ANCHOR:success-criteria -->

---

## RELATED DOCUMENTS

- **Parent Analysis**: `../files-inventory.md`
- **Quality Standards**: `.opencode/skill/workflows-code/references/standards/code_quality_standards.md`
- **Style Guide**: `.opencode/skill/workflows-code/references/standards/code_style_guide.md`
