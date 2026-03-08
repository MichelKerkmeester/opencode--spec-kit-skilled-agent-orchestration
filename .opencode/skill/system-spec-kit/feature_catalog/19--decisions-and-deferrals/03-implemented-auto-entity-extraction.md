# Implemented: auto entity extraction

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike alongside N2. Rule-based heuristics would extract entities from memory content, gated on edge density.

**Now implemented.** Five regex extraction rules with a 64-word denylist, stored in a dedicated `memory_entities` table (not causal_edges) with an `entity_catalog` for canonical name resolution. Runs at save time behind `SPECKIT_AUTO_ENTITIES` (default ON). Schema migration v20 added `memory_entities` and `entity_catalog` tables. Zero external NLP dependencies. See [Auto entity extraction](#auto-entity-extraction) for the full description. Unblocks S5 (cross-document entity linking).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory integration |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extraction adapter |
| `mcp_server/lib/extraction/redaction-gate.ts` | Lib | Redaction gate |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory |
| `mcp_server/tests/entity-extractor.vitest.ts` | Entity extraction tests |
| `mcp_server/tests/extraction-adapter.vitest.ts` | Extraction adapter tests |
| `mcp_server/tests/redaction-gate.vitest.ts` | Redaction gate tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/working-memory-event-decay.vitest.ts` | Working memory decay |
| `mcp_server/tests/working-memory.vitest.ts` | Working memory tests |

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: Implemented: auto entity extraction
- Current reality source: feature_catalog.md
