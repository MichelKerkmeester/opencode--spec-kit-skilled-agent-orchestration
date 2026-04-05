# Agent 13 - Wave 1 Slice A13 Notes

- Updated `.opencode/command/memory/context.md` to align with current `memory_context` behavior: L1 budget guidance, `sessionId` naming, and preferred single-call MCP flow with manual-search fallback.
- Updated `.opencode/command/memory/learn.md` by removing stray non-doc text and adding `asyncEmbedding` to `memory_save` signature examples.
- Updated `.opencode/command/memory/manage.md` health output examples from schema `v9` to `v13`, corrected table naming to `memory_index`, and fixed dashboard action label `point` -> `checkpoint`.
- Updated `.opencode/command/memory/save.md` to document `asyncEmbedding` and corrected `/memory:save` no-argument behavior to folder prompt/active Gate 3 context instead of implicit auto-detect.

## Checks

- Manual accuracy check against `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` for `memory_context`, `memory_save`, and `memory_index_scan` parameters.
- Manual consistency check for 5-source indexing, 7 intents, and schema v13 references where present.
