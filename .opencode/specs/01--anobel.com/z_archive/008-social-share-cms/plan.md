---
title: "Implementation Plan [008-social-share-cms/plan]"
description: "1. Check for direct link attribute (backwards compatible)"
trigger_phrases:
  - "implementation"
  - "plan"
  - "008"
  - "social"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan

<!-- ANCHOR:phase-1-add-new-attribute-constants -->
## Phase 1: Add New Attribute Constants
- Add `ATTR_URL = "data-social-share-url"`
- Add `ATTR_SLUG = "data-social-share-slug"`
<!-- /ANCHOR:phase-1-add-new-attribute-constants -->

<!-- ANCHOR_EXAMPLE:phase-2-add-url-join-helper -->
## Phase 2: Add URL Join Helper
- Create `join_url_slug(base, slug)` function
- Handle trailing/leading slash normalization
- Ensure clean URL output
<!-- /ANCHOR_EXAMPLE:phase-2-add-url-join-helper -->

<!-- ANCHOR_EXAMPLE:phase-3-refactor-get_share_context -->
## Phase 3: Refactor get_share_context()
- Implement priority logic:
  1. Check for direct `link` attribute (backwards compatible)
  2. Check for `url` + `slug` combination
  3. Check for `url` only
  4. Check for `slug` only (combine with origin)
  5. Fallback to `window.location.href`
<!-- /ANCHOR_EXAMPLE:phase-3-refactor-get_share_context -->

<!-- ANCHOR_EXAMPLE:phase-4-testing -->
## Phase 4: Testing
- Verify backwards compatibility with existing `data-social-share-link`
- Test URL + slug combination
- Test edge cases (trailing slashes, etc.)
<!-- /ANCHOR_EXAMPLE:phase-4-testing -->

<!-- ANCHOR_EXAMPLE:files-modified -->
## Files Modified
- `src/2_javascript/cms/social_share.js`
<!-- /ANCHOR:files-modified -->
