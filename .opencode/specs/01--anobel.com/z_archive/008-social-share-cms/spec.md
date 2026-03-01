---
title: "Social Share CMS Integration [008-social-share-cms/spec]"
description: "Enhance the social share component to support separate URL and slug CMS fields in Webflow, enabling more flexible CMS binding while maintaining backwards compatibility."
trigger_phrases:
  - "social"
  - "share"
  - "cms"
  - "integration"
  - "spec"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Social Share CMS Integration

<!-- ANCHOR:overview -->
## Overview
Enhance the social share component to support separate URL and slug CMS fields in Webflow, enabling more flexible CMS binding while maintaining backwards compatibility.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem-statement -->
## Problem Statement
Current implementation uses a single `data-social-share-link` attribute for the full URL. In Webflow CMS, it's often more practical to have:
- A base URL (hardcoded or from CMS)
- A slug (from CMS collection item)
<!-- /ANCHOR:problem-statement -->

<!-- ANCHOR:solution -->
## Solution
Add two new attributes that combine to form the share URL:
- `data-social-share-url` - Base URL (e.g., `https://anobel.com/blog/`)
- `data-social-share-slug` - Page slug from CMS (e.g., `my-article`)
<!-- /ANCHOR:solution -->

<!-- ANCHOR:attribute-priority-logic -->
## Attribute Priority Logic
1. `data-social-share-link` - Direct full URL (backwards compatible)
2. `data-social-share-url` + `data-social-share-slug` - Combined
3. `data-social-share-url` only - Use as full link
4. `data-social-share-slug` only - Combine with `window.location.origin`
5. Fallback - `window.location.href`
<!-- /ANCHOR:attribute-priority-logic -->

<!-- ANCHOR:webflow-cms-usage-example -->
## Webflow CMS Usage Example
```html
<div data-social-share
     data-social-share-url="https://anobel.com/blog/"
     data-social-share-slug="{Slug from CMS}"
     data-social-share-title="{Title from CMS}">
  <button data-social-share-type="linkedin">LinkedIn</button>
  <button data-social-share-type="x">X</button>
  <button data-social-share-type="clipboard">Copy Link</button>
</div>
```
<!-- /ANCHOR:webflow-cms-usage-example -->

<!-- ANCHOR:technical-details -->
## Technical Details
- File: `src/2_javascript/cms/social_share.js`
- Changes: ~25 lines modified/added
- Backwards compatible: Yes (existing `data-social-share-link` continues to work)
<!-- /ANCHOR:technical-details -->

<!-- ANCHOR:edge-cases-handled -->
## Edge Cases Handled
- Trailing slash normalization: `url/` + `slug` = `url/slug`
- Leading slash normalization: `url` + `/slug` = `url/slug`
- Double slash prevention: `url/` + `/slug` = `url/slug`
<!-- /ANCHOR:edge-cases-handled -->
