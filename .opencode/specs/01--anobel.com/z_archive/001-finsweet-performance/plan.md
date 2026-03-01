---
title: "Implementation Plan: Finsweet Performance Optimization [001-finsweet-performance/plan]"
description: "Defer Finsweet Attributes loading to improve PageSpeed by 10-20 points."
trigger_phrases:
  - "implementation"
  - "plan"
  - "finsweet"
  - "performance"
  - "optimization"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Finsweet Performance Optimization

<!-- ANCHOR:overview -->
## Overview
Defer Finsweet Attributes loading to improve PageSpeed by 10-20 points.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:architecture -->
## Architecture

### Before (Blocking Pattern)
```html
<!-- HEADER -->
<script async type="module" src="https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js" fs-list></script>
```

### After (Deferred Pattern)
```html
<!-- FOOTER -->
<script>
window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js";
  script.setAttribute("fs-list", "");
  document.body.appendChild(script);
});
</script>
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:implementation-steps -->
## Implementation Steps

### Phase 1: Attributes@2 Scripts (4 files)
Files using `@finsweet/attributes@2/attributes.js`:

1. **blog_template.html** - `fs-socialshare`
2. **vacature.html** - `fs-socialshare`
3. **blog.html** - `fs-list`
4. **n4_het_team.html** - `fs-list`

Pattern:
```javascript
window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js";
  script.setAttribute("fs-{attribute}", "");
  document.body.appendChild(script);
});
```

### Phase 2: CMS Nest Scripts (2 files)
Files using `@finsweet/attributes-cmsnest@1/cmsnest.js`:

1. **werken_bij.html**
2. **home.html**

Pattern:
```javascript
window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsnest@1/cmsnest.js";
  document.body.appendChild(script);
});
```
<!-- /ANCHOR:implementation-steps -->

<!-- ANCHOR:key-corrections-from-dmytro-bala -->
## Key Corrections (from Dmytro Bala)
- Each `fs-*` attribute needs its own `setAttribute()` call
- Value should be empty string: `script.setAttribute("fs-list", "");`
- WRONG: `script.setAttribute("fs-list", "fs-toc", "fs-scrolldisable");`
<!-- /ANCHOR:key-corrections-from-dmytro-bala -->

<!-- ANCHOR:testing -->
## Testing
1. Verify Finsweet functionality works after changes
2. Test PageSpeed scores before/after
3. Check that LCP improves
<!-- /ANCHOR:testing -->

<!-- ANCHOR:rollback -->
## Rollback
If issues occur, revert to original `<script async>` pattern in HEADER.
<!-- /ANCHOR:rollback -->
