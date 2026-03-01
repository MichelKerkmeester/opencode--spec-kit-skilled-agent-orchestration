---
title: "Implementation Plan: Tab Menu Border Fix [002-tab-menu-border-fix/plan]"
description: "Simple find-and-replace of the incorrect CSS variable name in tab_menu.js."
trigger_phrases:
  - "implementation"
  - "plan"
  - "tab"
  - "menu"
  - "border"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Tab Menu Border Fix

<!-- ANCHOR:approach -->
## Approach
Simple find-and-replace of the incorrect CSS variable name in `tab_menu.js`.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:changes-required -->
## Changes Required

### File: `src/2_javascript/menu/tab_menu.js`

Replace all occurrences of:
```
--_color-tokens---border-neutral--darkest
```
With:
```
--_color-tokens---border-neutral--dark
```

### Lines Affected

| Line | Context | Change |
|------|---------|--------|
| 22 | Comment: UNSET BUTTON reference | Update documentation |
| 51 | `apply_active_styles()` FROM value | Fix animation start |
| 79 | `remove_active_styles()` TO value | **Primary fix** |
| 104 | `apply_hover_styles()` FROM value | Fix hover animation |
| 105 | `apply_hover_styles()` TO value | Fix hover animation |
| 130 | `remove_hover_styles()` FROM value | Fix hover animation |
| 131 | `remove_hover_styles()` TO value | Fix hover animation |
<!-- /ANCHOR:changes-required -->

<!-- ANCHOR:implementation-steps -->
## Implementation Steps

1. **Edit tab_menu.js** - Replace all 7 occurrences using `replaceAll`
2. **Verify syntax** - Ensure no typos in variable name
3. **Test in browser** - Use bdg to verify computed styles
<!-- /ANCHOR:implementation-steps -->

<!-- ANCHOR:risk-assessment -->
## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Typo in variable name | Low | High | Copy exact variable from CSS |
| Break other animations | Low | Medium | Only changing border-color values |
| Wrong variable chosen | Low | High | Verified via DevTools that `--dark` = `#cfcfcf` |
<!-- /ANCHOR:risk-assessment -->

<!-- ANCHOR:rollback-plan -->
## Rollback Plan
Revert the single file change if issues arise.
<!-- /ANCHOR:rollback-plan -->

<!-- ANCHOR:testing-strategy -->
## Testing Strategy
1. Navigate to `/nl/blog` with active filter
2. Click different filter buttons
3. Verify all inactive buttons have `rgb(207, 207, 207)` border
4. Check hover states work correctly
<!-- /ANCHOR:testing-strategy -->
