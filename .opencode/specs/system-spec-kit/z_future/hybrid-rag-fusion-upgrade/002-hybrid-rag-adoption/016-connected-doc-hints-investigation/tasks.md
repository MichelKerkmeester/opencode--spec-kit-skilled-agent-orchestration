---
title: "...stem-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/016-connected-doc-hints-investigation/tasks]"
description: "1. Document current result and appendix-adjacent behavior in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts, .opencode/skill/system-spec-kit/mcp_server/too..."
trigger_phrases:
  - "stem"
  - "spec"
  - "kit"
  - "future"
  - "hybrid"
  - "tasks"
  - "016"
  - "connected"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 016-connected-doc-hints-investigation

1. Document current result and appendix-adjacent behavior in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`.
2. Define hint-trigger and labeling experiments using `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts`.
3. Specify duplication and contradiction checks against current graph and causal semantics.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/016-connected-doc-hints-investigation --strict`.
