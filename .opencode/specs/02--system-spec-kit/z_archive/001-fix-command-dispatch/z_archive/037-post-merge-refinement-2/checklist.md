---
title: "Checklist [037-post-merge-refinement-2/checklist]"
description: "checklist document for 037-post-merge-refinement-2."
trigger_phrases:
  - "checklist"
  - "037"
  - "post"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist

- [x] Analyze feature gap between v11 and v12
- [x] Update `mcp_server/lib/vector-index.js` with missing v11 features
- [x] Fix `DEFAULT_DB_PATH` in `mcp_server/lib/vector-index.js`
- [x] Update `scripts/generate-context.js` to require the shared library
- [x] Verify `generate-context.js` runs successfully
- [x] Delete `scripts/lib/vector-index.js`
