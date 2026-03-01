---
title: "Plan [037-post-merge-refinement-2/plan]"
description: "plan document for 037-post-merge-refinement-2."
trigger_phrases:
  - "plan"
  - "037"
  - "post"
importance_tier: "important"
contextType: "decision"
---
# Plan

## Phase 1: Analysis (Diff v11 vs v12)
- Compare `scripts/lib/vector-index.js` (v11) and `mcp_server/lib/vector-index.js` (v12).
- Identify specific code blocks for "Smart Ranking" and "Content Extraction".
- Audit path handling logic.

## Phase 2: Implementation (Port features, fix paths)
- Update `mcp_server/lib/vector-index.js` with missing features from v11.
- Refactor `DEFAULT_DB_PATH` resolution to use `__dirname` instead of `process.cwd()`.

## Phase 3: Integration (Update scripts to use shared lib)
- Modify `scripts/generate-context.js` to require `../mcp_server/lib/vector-index.js`.
- Modify any other scripts relying on the old library.

## Phase 4: Cleanup (Delete old lib)
- Delete `scripts/lib/vector-index.js`.
- Verify no other files reference the deleted library.
