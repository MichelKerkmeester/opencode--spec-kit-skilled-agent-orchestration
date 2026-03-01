---
title: "Load Toggle Component - anobel.com [027-load-toggle/spec]"
description: "A reusable expand/collapse component for Webflow with CMS-bindable button text, smooth animations, and multi-instance support. Enables \"View More / View Less\" patterns with dyna..."
trigger_phrases:
  - "load"
  - "toggle"
  - "component"
  - "anobel"
  - "com"
  - "spec"
  - "027"
importance_tier: "important"
contextType: "decision"
---
# Load Toggle Component - anobel.com

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 027 |
| **Title** | Load Toggle Component |
| **Status** | Implemented |
| **Level** | 2 (Multi-file component with QA verification) |
| **Created** | 2025-02-01 |
| **Author** | Claude Opus 4 |
| **LOC Estimate** | ~210 (JS: 151, CSS: 57) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:overview -->
## Overview

A reusable expand/collapse component for Webflow with CMS-bindable button text, smooth animations, and multi-instance support. Enables "View More / View Less" patterns with dynamic text controlled via data attributes.

### Problem Statement

The anobel.com website needed a flexible expand/collapse mechanism that:
1. Shows/hides content items based on state
2. Supports CMS-bindable button text for multilingual content
3. Works with multiple instances on the same page
4. Integrates with Webflow's page transitions (SPA behavior)
5. Provides proper accessibility via `aria-expanded`

### Solution

A lightweight JavaScript component (~1KB minified) with CSS-only animations that:
- Uses data attributes for configuration (no JavaScript configuration object needed)
- Places CMS-bindable text attributes on the button element
- Provides smooth icon rotation and fade-in animations
- Includes proper cleanup for SPA navigation
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:requirements -->
## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | Toggle between collapsed/expanded states on button click | P0 |
| FR2 | Hide/show items marked with `data-load="expanded"` | P0 |
| FR3 | Update button text based on state | P0 |
| FR4 | Support CMS-bindable text via button data attributes | P1 |
| FR5 | Support multiple independent instances per page | P1 |
| FR6 | Provide default text if CMS values not set | P2 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR1 | < 1KB minified JavaScript | P1 |
| NFR2 | No external dependencies | P0 |
| NFR3 | Compatible with Webflow page transitions | P1 |
| NFR4 | Accessible via aria-expanded attribute | P1 |
| NFR5 | Smooth 300ms animations | P2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:data-attribute-structure -->
## Data Attribute Structure

| Attribute | Element | Purpose | CMS Bindable |
|-----------|---------|---------|--------------|
| `data-target="load-toggle"` | Container | Main wrapper, holds state | No |
| `data-target="load-toggle-trigger"` | Button | Click target | No |
| `data-target="load-toggle-text"` | Span (inside button) | JS sets text content | No |
| `data-target="load-icon"` | Icon/SVG | CSS rotates 180° on expand | No |
| `data-load-collapsed` | Button | Collapsed state text | **Yes** |
| `data-load-expanded` | Button | Expanded state text | **Yes** |
| `data-load="expanded"` | Any child | Hidden when collapsed | No |

### State Management

The container holds state via `data-state` attribute:
- `data-state="collapsed"` - Initial state, expanded items hidden
- `data-state="expanded"` - Expanded items visible
<!-- /ANCHOR:data-attribute-structure -->

---

<!-- ANCHOR:architecture -->
## Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Container [data-target="load-toggle"]                           │
│           [data-state="collapsed|expanded"]                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 1   (no attribute)                                   │ │  ← Always visible
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 2   (no attribute)                                   │ │  ← Always visible
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 3   [data-load="expanded"]                           │ │  ← HIDDEN/SHOWN
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Item 4   [data-load="expanded"]                           │ │  ← HIDDEN/SHOWN
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Button [data-target="load-toggle-trigger"]                │ │
│  │        [data-load-collapsed="View More"]                  │ │
│  │        [data-load-expanded="View Less"]                   │ │
│  │        [aria-expanded="false|true"]                       │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────┐    │ │
│  │   │ Text [data-target="load-toggle-text"]           │    │ │
│  │   └─────────────────────────────────────────────────┘    │ │
│  │                                                           │ │
│  │   ┌─────────────────────────────────────────────────┐    │ │
│  │   │ Icon [data-target="load-icon"]  ↓ → ↑           │    │ │
│  │   └─────────────────────────────────────────────────┘    │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### JavaScript Architecture

```
IIFE (self-executing function)
├── Configuration constants
│   ├── SELECTORS (container, trigger, text)
│   ├── STATE (collapsed, expanded)
│   ├── DEFAULTS (fallback text values)
│   └── ATTRS (data attribute names)
├── Core functions
│   ├── update_text() - Set button text based on state
│   └── toggle_state() - Toggle container state
├── Event handlers
│   ├── handle_click() - Process click events
│   └── bind_events() - Attach listeners to containers
├── Cleanup
│   └── cleanup() - Remove all event listeners
└── Initialize
    └── init() - Entry point with Webflow.push support
```

### CSS Architecture

```
menu_load_toggle.css
├── 1. ITEM VISIBILITY
│   ├── Hidden when collapsed
│   └── Visible when expanded (display: flex)
├── 2. ICON ROTATION
│   ├── Transition (0.3s cubic-bezier)
│   ├── Collapsed: rotate(0deg)
│   └── Expanded: rotate(180deg)
└── 3. CONTENT ANIMATION
    ├── @keyframes loadToggleFadeIn
    └── Apply to expanded items
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:files -->
## Files

| File | Purpose | Location |
|------|---------|----------|
| `load_toggle.js` | Main source | `src/2_javascript/menu/` |
| `load_toggle.js` | Minified | `src/2_javascript/z_minified/menu/` |
| `menu_load_toggle.css` | Styles | `src/1_css/menu/` |
| `src.js` | Staging copy | `src/3_staging/` |
| `src.css` | Staging copy | `src/3_staging/` |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:cdn-deployment -->
## CDN Deployment

| Resource | URL |
|----------|-----|
| JavaScript | `https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/load_toggle.js?v=1.1.0` |

### Upload Command

```bash
wrangler r2 object put anobel-cdn/load_toggle.js --file src/2_javascript/z_minified/menu/load_toggle.js
```
<!-- /ANCHOR:cdn-deployment -->

---

<!-- ANCHOR:documentation -->
## Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| `spec.md` | Requirements and architecture | Complete |
| `plan.md` | Implementation plan | Complete |
| `tasks.md` | Task breakdown | Complete |
| `checklist.md` | QA verification | Complete |
| `implementation-summary.md` | What was built | Complete |
| `webflow-guide.md` | Webflow configuration | Complete |
<!-- /ANCHOR:documentation -->

---

<!-- ANCHOR:revision-history -->
## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2025-02-01 | Claude Opus 4 | Initial implementation |
| 2025-02-01 | Claude Opus 4 | Added multi-instance support |
| 2025-02-01 | Claude Opus 4 | Moved text attributes to button for CMS bindability |
| 2025-02-01 | Claude Opus 4 | Updated icon attribute to `data-target="load-icon"` |
| 2025-02-01 | Claude Opus 4 | Retroactive Level 2 documentation |
<!-- /ANCHOR:revision-history -->
