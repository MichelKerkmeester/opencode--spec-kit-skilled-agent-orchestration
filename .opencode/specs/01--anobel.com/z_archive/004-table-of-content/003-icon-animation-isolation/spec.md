---
title: "Spec: Icon Animation Isolation for Download Button [003-icon-animation-isolation/spec]"
description: "Refactor btn_download.css to isolate only the icon animation logic, removing all button-level hover/focus/active styling so the download icon can be embedded inside another butt..."
trigger_phrases:
  - "spec"
  - "icon"
  - "animation"
  - "isolation"
  - "for"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Spec: Icon Animation Isolation for Download Button

<!-- ANCHOR:overview -->
## Overview
Refactor `btn_download.css` to isolate only the icon animation logic, removing all button-level hover/focus/active styling so the download icon can be embedded inside another button component.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem-statement -->
## Problem Statement
The current download button CSS includes:
- Button wrapper styling (background-color transitions)
- Hover state animations (arrow lift, base expand, background change)
- Focus state animations (mirrors hover)

When the download icon is embedded inside another button, these styles conflict with or duplicate the parent button's interaction states.
<!-- /ANCHOR:problem-statement -->

<!-- ANCHOR:goal -->
## Goal
Extract **only the icon animation** (the download state machine: idle → downloading → ready) and remove all button chrome/interaction styling.
<!-- /ANCHOR:goal -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- Remove button wrapper transitions
- Remove entire hover state section
- Remove entire focus state section
- Keep icon element transitions
- Keep download state management
- Keep success state animations

### Out of Scope
- Parent button styling (handled separately)
- JavaScript logic changes
<!-- /ANCHOR:scope -->

<!-- ANCHOR:user-stories -->
## User Stories

### US-1: Clean Icon Animation
**As a** developer embedding the download icon
**I want** only the icon's state machine animation in CSS
**So that** the parent button can control all hover/focus/active states
<!-- /ANCHOR:user-stories -->

<!-- ANCHOR:acceptance-criteria -->
## Acceptance Criteria
- [ ] No `background-color` properties in the CSS
- [ ] No `:hover` selectors in the CSS
- [ ] No `:focus` selectors in the CSS
- [ ] Icon state animations (downloading, ready) still work
- [ ] Transitions for icon elements preserved
<!-- /ANCHOR:acceptance-criteria -->
