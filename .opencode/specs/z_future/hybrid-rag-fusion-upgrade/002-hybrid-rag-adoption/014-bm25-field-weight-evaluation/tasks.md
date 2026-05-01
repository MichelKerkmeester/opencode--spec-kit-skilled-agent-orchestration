---
title: "Task [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/014-bm25-field-weight-evaluation/tasks]"
description: "1. Document the lexical field surfaces in .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts and .opencode/skill/system-spec-kit/mcp_server/handlers/memory-sear..."
trigger_phrases:
  - "task"
  - "tasks"
  - "014"
  - "bm25"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 014-bm25-field-weight-evaluation

1. Document the lexical field surfaces in `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`.
2. Define candidate weight tables and benchmark fixtures in `.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts`.
3. Specify regression coverage for `.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts`.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/014-bm25-field-weight-evaluation --strict`.
