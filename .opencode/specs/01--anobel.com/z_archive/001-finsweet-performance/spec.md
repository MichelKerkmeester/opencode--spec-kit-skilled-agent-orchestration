---
title: "Finsweet Performance Optimization [001-finsweet-performance/spec]"
description: "Optimize Finsweet Attributes loading to improve PageSpeed scores by deferring script execution until after page load."
trigger_phrases:
  - "finsweet"
  - "performance"
  - "optimization"
  - "spec"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Finsweet Performance Optimization

<!-- ANCHOR:overview -->
## Overview
Optimize Finsweet Attributes loading to improve PageSpeed scores by deferring script execution until after page load.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem-statement -->
## Problem Statement
Finsweet Attributes are currently loaded in the HEADER section with `async`, which:
- Loads immediately when page opens
- Blocks rendering
- Takes 200-400ms before content shows
- Negatively impacts PageSpeed/Core Web Vitals (LCP)
<!-- /ANCHOR:problem-statement -->

<!-- ANCHOR:user-stories -->
## User Stories

### US-001: Deferred Finsweet Loading
**As a** site visitor
**I want** the page content to load quickly
**So that** I can see the content without waiting for third-party scripts

**Acceptance Criteria:**
- [ ] Finsweet scripts load after page `load` event
- [ ] All Finsweet functionality (fs-list, fs-socialshare, cmsnest) works correctly
- [ ] PageSpeed score improves by 10-20 points
<!-- /ANCHOR:user-stories -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- 6 HTML files with Finsweet scripts:
  - `cms/werken_bij.html` - cmsnest
  - `cms/blog_template.html` - fs-socialshare
  - `cms/vacature.html` - fs-socialshare
  - `cms/blog.html` - fs-list
  - `nobel/n4_het_team.html` - fs-list
  - `home.html` - cmsnest

### Out of Scope
- Other performance optimizations
- Non-Finsweet scripts
<!-- /ANCHOR:scope -->

<!-- ANCHOR:technical-requirements -->
## Technical Requirements
- Use `window.addEventListener("load", ...)` pattern
- Dynamic script creation with `document.createElement("script")`
- Proper `setAttribute()` syntax (one call per attribute with empty string value)
- Move scripts from HEADER to FOOTER section
<!-- /ANCHOR:technical-requirements -->

<!-- ANCHOR:reference -->
## Reference
Based on Dmytro Bala's Finsweet performance optimization technique.
<!-- /ANCHOR:reference -->
