# Iteration 009

- Dimension: Correctness
- Focus: Stabilization pass on F001 and the live save/indexing contract
- State read first: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`

## Findings

- No new P0/P1/P2 findings. The adversarial re-read confirms there is no reachable runtime path that still accepts or discovers `specs/**/memory/*.md`: parser validation rejects the path, `memory_save` throws on it, startup scan uses spec-doc/constitutional discovery only, and `memory_index_scan` uses the same discovery family. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1263-1299] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-229]

## Notes

- F001 is treated as **closed on the shipped runtime path**. The still-open follow-up work is now the command/workflow drift tracked separately in NF001 and NF002.

## Next Focus

Iteration 010 will perform the final traceability/maintainability stabilization pass and prepare synthesis.
