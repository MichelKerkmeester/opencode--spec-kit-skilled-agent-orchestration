# Tasks: 017-temporal-knowledge-graph-investigation

1. Document current memory, save, and governance boundaries using `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`.
2. Define a minimal temporal-fact schema and invalidation workflow using `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts` and `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` as the nearest current contracts.
3. Specify how future timeline or fact queries would stay narrow and non-competitive with ordinary memory retrieval.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/017-temporal-knowledge-graph-investigation --strict`.
