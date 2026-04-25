# Iteration 001

- Dimension: Correctness
- Focus: Re-verify the live parser/save/discovery contract for retired `specs/**/memory/*.md` paths
- State read first: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`

## Findings

- No new P0/P1/P2 findings in the live runtime path. `isMemoryFile()` now accepts only canonical spec documents and constitutional files, `memory_save` rejects noncanonical paths, startup scan uses `findSpecDocuments()` plus `findConstitutionalFiles()`, and `memory_index_scan` no longer calls the retired discovery helper. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1260-1299] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-229]

## Notes

- The canonical save contract text and invalid-path recovery hint are aligned with spec documents plus constitutional files. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:215-218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:223-229]
- Focused runtime verification passed for parser/spec-doc coverage and vector-index migration tests. This iteration treats F001's original runtime acceptance path as closed unless a downstream public workflow still routes operators into retired paths.

## Next Focus

Iteration 002 will stay on correctness and check whether any active public command workflow still emits or indexes retired `specs/**/memory/*.md` paths against the tightened runtime contract.
