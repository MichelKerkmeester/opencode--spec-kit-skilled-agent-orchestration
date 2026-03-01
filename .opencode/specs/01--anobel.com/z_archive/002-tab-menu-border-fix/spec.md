---
title: "Tab Menu Border Color Fix [002-tab-menu-border-fix/spec]"
description: "Fix incorrect border color on filter tab buttons after they transition from active (SET) to inactive (ENABLED) state."
trigger_phrases:
  - "tab"
  - "menu"
  - "border"
  - "color"
  - "fix"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Tab Menu Border Color Fix

<!-- ANCHOR:overview -->
## Overview
Fix incorrect border color on filter tab buttons after they transition from active (SET) to inactive (ENABLED) state.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem-statement -->
## Problem Statement
On the blog page (`/nl/blog`), filter category buttons display the wrong border color after being deselected:
- **Expected:** Light gray border `#cfcfcf` (rgb(207, 207, 207))
- **Actual:** Dark gray border `#979797` (rgb(151, 151, 151))

This only affects buttons that have been clicked and then deselected. Buttons never clicked display the correct border color.
<!-- /ANCHOR:problem-statement -->

<!-- ANCHOR:user-stories -->
## User Stories

### US-001: Consistent Border Color on Filter Buttons
**As a** site visitor
**I want** all inactive filter buttons to have the same border color
**So that** the UI appears consistent and polished

**Acceptance Criteria:**
- [ ] All inactive buttons have border color `#cfcfcf`
- [ ] Border color remains consistent after clicking different filters
- [ ] No visual jump when transitioning between states
<!-- /ANCHOR:user-stories -->

<!-- ANCHOR:root-cause-analysis -->
## Root Cause Analysis

### Discovery Method
Used Chrome DevTools CLI (`bdg`) to:
1. Query `.tab--menu-btn` elements
2. Compare computed styles between never-clicked and previously-clicked buttons
3. Identify inline style injection from JavaScript animation

### Findings
| Button State | Inline Style | Border Color |
|-------------|--------------|--------------|
| Never clicked | `min-width: NNpx;` only | `#cfcfcf` (CSS) |
| Previously clicked | Full inline styles with `border-color` | `#979797` (JS) |

### Root Cause
The JavaScript file `tab_menu.js` uses the wrong CSS variable for UNSET button borders:
- **CSS (Webflow):** `--_color-tokens---border-neutral--dark` → `#cfcfcf`
- **JavaScript:** `--_color-tokens---border-neutral--darkest` → `#979797`

When Motion.js animates a button back to UNSET state, it applies inline styles using the wrong variable, overriding the correct CSS value.
<!-- /ANCHOR:root-cause-analysis -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- `src/2_javascript/menu/tab_menu.js` - 7 occurrences of wrong variable

### Out of Scope
- CSS changes in Webflow
- Other button states or components
<!-- /ANCHOR:scope -->

<!-- ANCHOR:technical-requirements -->
## Technical Requirements
- Replace `--_color-tokens---border-neutral--darkest` with `--_color-tokens---border-neutral--dark`
- Maintain existing animation behavior
- No changes to animation timing or easing
<!-- /ANCHOR:technical-requirements -->

<!-- ANCHOR:reference -->
## Reference
- Affected page: https://a-nobel-en-zn.webflow.io/nl/blog
- Source file: `src/2_javascript/menu/tab_menu.js:22,51,79,104,105,130,131`
<!-- /ANCHOR:reference -->
