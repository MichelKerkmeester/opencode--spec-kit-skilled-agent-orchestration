---
title: "T [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/015-rrf-hybrid-retrieval-evaluation/tasks]"
description: "1. Document the current hybrid stack and RRF ownership in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts, .opencode/skill/system-spec-kit/mcp_server/lib/se..."
trigger_phrases:
  - "tasks"
  - "015"
  - "rrf"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 015-rrf-hybrid-retrieval-evaluation

1. Document the current hybrid stack and RRF ownership in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`.
2. Define comparison benchmarks and regression criteria using `.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts`.
3. Add compaction-continuity and cold-start measurement requirements so the study covers more than ranking output.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/015-rrf-hybrid-retrieval-evaluation --strict`.
