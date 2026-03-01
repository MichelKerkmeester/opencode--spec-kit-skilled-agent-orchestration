---
title: "Plan: Icon Animation Isolation [003-icon-animation-isolation/plan]"
description: "Remove all button-level styling from btn_download.css (staging), keeping only the pure icon animation for the download state machine."
trigger_phrases:
  - "plan"
  - "icon"
  - "animation"
  - "isolation"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Plan: Icon Animation Isolation

<!-- ANCHOR:summary -->
## Summary
Remove all button-level styling from `btn_download.css` (staging), keeping only the pure icon animation for the download state machine.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:analysis -->
## Analysis

### KEEP - Core Icon Animation

| Lines | Selector | Purpose |
|-------|----------|---------|
| 13-17 | `[data-download-arrow], [data-download-base]` | Transform transitions |
| 19-23 | `[data-download-icon-wrap]` | Clip-path for checkmark |
| 25-28 | `[data-download-success] path` | Checkmark stroke |
| 30-33 | `[data-download-base]` | Transform origin |
| 38-41 | `[data-download-state="downloading"]` | Pointer-events |
| 43-46 | `body:has(...)` | Wait cursor |
| 51-72 | `[data-download-state="ready"] ...` | Success animations |

### REMOVE - Button/Interaction Styling

| Lines | What | Why |
|-------|------|-----|
| 8-11 | `[data-download-src] { transition: background-color }` | Button wrapper styling |
| 74-92 | Entire hover section | Parent handles hover |
| 94-108 | Entire focus section | Parent handles focus |
<!-- /ANCHOR:analysis -->

<!-- ANCHOR:implementation -->
## Implementation

### Step 1: Remove button wrapper transition (lines 8-11)
Delete the `[data-download-src]` background-color transition rule.

### Step 2: Remove hover section (lines 74-92)
Delete the entire `@media (hover: hover)` block.

### Step 3: Remove focus section (lines 94-108)
Delete the entire focus state section.

### Step 4: Clean up section headers
Update comments to reflect new structure (no hover/focus sections).
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:file-changes -->
## File Changes
- `src/3_staging/btn_download.css` - Remove 3 sections
<!-- /ANCHOR:file-changes -->

<!-- ANCHOR:risk-assessment -->
## Risk Assessment
- **Low risk**: Purely subtractive change
- **Dependency**: Parent button must provide hover/focus styles
<!-- /ANCHOR:risk-assessment -->
