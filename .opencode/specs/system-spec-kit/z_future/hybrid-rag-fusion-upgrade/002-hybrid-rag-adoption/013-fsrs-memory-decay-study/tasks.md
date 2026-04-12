# Tasks: 013-fsrs-memory-decay-study

1. Document the current FSRS default tables and due-state gaps in `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`.
2. Define measurement variants against `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`.
3. Specify test and eval evidence using `.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts`.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/013-fsrs-memory-decay-study --strict`.
