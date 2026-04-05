---
title: "Post-Merge Refinemen [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/037-post-merge-refinement-2/spec]"
description: "We have a \"Split-Brain\" issue with two versions of vector-index.js"
trigger_phrases:
  - "post"
  - "merge"
  - "refinement"
  - "phase"
  - "library"
  - "spec"
  - "037"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Post-Merge Refinement Phase 2 (Library Unification)

<!-- ANCHOR:metadata -->
## Context
We have a "Split-Brain" issue with two versions of `vector-index.js`:
1. v11 in `scripts/lib/` (used by CLI tools)
2. v12 in `mcp_server/lib/` (used by the MCP server)

<!-- /ANCHOR:metadata -->
## Goals
1. Unify into a single library in `mcp_server/lib/`.
2. Port "Smart Ranking" and "Content Extraction" from v11 to v12.
3. Fix `process.cwd()` fragility by using `__dirname`.
4. Delete the redundant v11 library.
