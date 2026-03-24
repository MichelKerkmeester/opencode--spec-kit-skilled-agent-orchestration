# Iteration 003

## Focus
Pipeline Governance & Script-MCP Parity (Q3)

## Research Question
Does the script-side indexing path (`generate-context.js` -> `workflow.ts` -> `memory-indexer.ts`) bypass governance, preflight, postflight, and audit hooks that the MCP `memory_save` path enforces? Also: is retention sweep runtime-wired, and does `scripts-registry.json` contain dead entries?

## Path Map

### Script save/index path
1. `scripts/memory/generate-context.ts` parses CLI input and hands control to `runWorkflow(...)`. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:530-550]
2. `scripts/core/workflow.ts` runs the post-save quality review, then enters "Step 11: Semantic memory indexing". [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1601-1623]
3. If `shouldIndexMemory(...)` returns true, `runWorkflow()` calls `indexMemory(...)` directly. The decision only consumes workflow-local validation state (`validationDisposition`, template contract, sufficiency result, quality score). [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1655-1675]
4. `scripts/core/memory-indexer.ts` generates the embedding, extracts/merges trigger phrases, computes `importanceWeight`, `qualityScore`, and `qualityFlags`, then calls `vectorIndex.indexMemory(...)` directly. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72-171]
5. The shared vector mutator writes straight into SQLite: `INSERT INTO memory_index`, optional `INSERT INTO vec_memories`, active-projection upsert, interference refresh, and search-cache clear. If the path already exists, `index_memory()` delegates to `update_memory()`, which issues `UPDATE memory_index`, refreshes vectors, and marks embedding success. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:168-239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:360-447]
6. After that direct DB write, the script path only touches local workflow artifacts: it writes the DB-updated sentinel and updates `metadata.json` with embedding status. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:39-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:179-218] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1628-1645]

### MCP `memory_save` path
1. `handleMemorySave()` validates input, normalizes the file path, opens the DB, and supports a non-mutating dry-run branch. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:542-629]
2. Before indexing, it enforces governance: `ensureGovernanceRuntime()`, `validateGovernedIngest(...)`, denial audit on rejection, and shared-space access checks plus denial audit. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:631-680]
3. Unless `skipPreflight` is set, it runs `preflight.runPreflight(...)`, supports dry-run reporting, and throws structured preflight errors on failure. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:696-806]
4. `indexMemoryFile()` -> `prepareParsedMemoryForIndexing()` applies V-rule validation, quality loop, sufficiency evaluation, template-contract validation, and spec-doc health annotation before save-time indexing proceeds. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:134-231] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:510-537]
5. `processPreparedMemory()` adds spec-folder locking, path dedup, chunking, embedding-cache lookup/store, save quality gate, content-hash dedup, prediction-error gating, reconsolidation, and a DB transaction around create/update. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:277-505]
6. `createMemoryRecord()` does more than the raw vector write: it calls `vectorIndex.indexMemory()` or `indexMemoryDeferred()`, then applies post-insert metadata, optionally links related memories, deprecates predecessors, records lineage transitions, updates BM25, and records per-memory history. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102-229]
7. After the main insert/update, MCP runs post-insert enrichment for causal links, entity extraction/catalog updates, summaries, entity linking, and graph-lifecycle hooks. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:485-503] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:59-190]
8. The response stage appends a mutation-ledger entry, runs post-mutation hooks, triggers opportunistic retry processing, and conditionally runs consolidation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:93-113] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:248-264] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:357-377]
9. Finally, `handleMemorySave()` applies governance metadata to the inserted row and records an allow-audit entry in a transaction; shared-space saves also record conflict telemetry. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:815-868]

## Findings

### F1. The script path bypasses MCP governance entirely.
The script pipeline never calls `ensureGovernanceRuntime()`, `validateGovernedIngest(...)`, `assertSharedSpaceAccess(...)`, or `recordGovernanceAudit(...)`. Its indexing handoff is `runWorkflow()` -> `indexMemory()` -> `vectorIndex.indexMemory()`. The MCP path explicitly performs governance runtime setup, governed-ingest validation, shared-space access control, denial auditing, post-insert governance metadata writes, and allow-audit logging. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1655-1675] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-171] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:631-680] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:815-868]

### F2. The script path bypasses MCP preflight.
MCP `memory_save` has an explicit preflight phase with dry-run support and structured rejection errors. The script pipeline does not call `preflight.runPreflight(...)`; its only index gate at the handoff point is the local `shouldIndexMemory(...)` decision assembled from workflow-local validation outputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:696-806] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1655-1666]

### F3. The script path bypasses most MCP postflight/post-insert hooks.
The script side stops after the raw vector write plus local `metadata.json` bookkeeping. MCP continues into post-insert metadata enrichment, lineage/history, BM25 registration, causal/entity/summary/entity-linking/graph enrichment, mutation-ledger writes, post-mutation hooks, retry processing, and consolidation. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:151-181] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:184-218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:151-224] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:59-190] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:93-113] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:248-264] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:357-377]

### F4. The script path also bypasses MCP concurrency/dedup/PE/reconsolidation controls.
MCP serializes by spec folder, re-checks content-hash dedup inside `BEGIN IMMEDIATE`, runs prediction-error save arbitration, and optionally reconsolidates before the final insert/update transaction. The script path does none of that; it calls the vector mutator directly once the workflow says "index". [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:277-505] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1655-1675] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-171]

### F5. Shared lower-layer parity exists only at the raw vector storage layer.
Both paths eventually hit the same vector mutators, so both can `INSERT`/`UPDATE` `memory_index`, maintain `vec_memories`, update active-memory projection, refresh folder interference scores, and clear search cache. That parity starts only after the MCP-only governance/preflight/save-pipeline checks have already run. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:151-161] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:119-149] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:198-239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:420-447]

### F6. Retention sweep is implemented but not runtime-wired.
`runRetentionSweep()` is exported from `mcp_server/lib/governance/retention.ts` and performs governed deletes plus audit logging. In this repository pass I found references only at the definition site and in tests; the runtime code path does not call it. That matches the known P1-12 hypothesis. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts:41-130] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:260] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:329] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:388] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:432] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:441] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:491]

### F7. `scripts-registry.json` has at least one additional dead entry beyond `opencode-capture`.
The registry still declares `opencode-capture` at `scripts/dist/extractors/opencode-capture.js`, which is missing on disk, and an existence audit also found `skill_advisor` missing from the registry-resolved path. The dead-entry set from this pass is `{ opencode-capture, skill_advisor }`. [SOURCE: .opencode/skill/system-spec-kit/scripts/scripts-registry.json:425-427] [SOURCE: .opencode/skill/system-spec-kit/scripts/scripts-registry.json:235]

## Hook Parity Summary

| Hook / Check | MCP `memory_save` | Script path |
| --- | --- | --- |
| Governance runtime + governed ingest validation | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:631-659] | No. Direct workflow-to-indexer handoff. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1655-1675] |
| Shared-space access control + denial audit | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:661-680] | No. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-171] |
| Preflight + dry-run | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:574-629] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:696-806] | No dedicated preflight. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1655-1666] |
| Quality loop / sufficiency / template-contract gate | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:134-231] | Partial/local equivalents feed `shouldIndexMemory(...)`, but only inside workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1656-1663] |
| Spec-folder mutex + transaction-level dedup | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:277-315] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:394-483] | No. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-171] |
| Embedding cache + save quality gate | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:116-203] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:324-382] | No cache/gate stage. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72-171] |
| Prediction-error gating + reconsolidation | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:27-169] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:384-392] | No. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-171] |
| Post-insert metadata / lineage / history | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:154-224] | No, aside from local `metadata.json`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:184-218] |
| Post-insert enrichment | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:59-190] | No. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-181] |
| Mutation ledger + post-mutation hooks + consolidation/retry side effects | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:93-113] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:248-264] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:357-377] | No. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-181] |
| Governance metadata + allow-audit after successful write | Yes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:815-865] | No. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-181] |

## Database Write Inventory

### Script path
- Shared vector layer `index_memory()` can `INSERT INTO memory_index`, `INSERT INTO vec_memories`, and upsert `active_memory_projection`; `update_memory()` issues `UPDATE memory_index`, refreshes `vec_memories`, and sets `embedding_status`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:201-229] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:420-447]
- Script-owned writes after indexing are file writes only: DB-updated sentinel and `metadata.json`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:39-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:184-218]

### MCP path
- Raw vector writes: same shared `memory_index` / `vec_memories` operations. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:201-229] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:420-447]
- Post-insert metadata update: dynamic `UPDATE memory_index SET ... WHERE id = ?`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:81-110]
- Additional save-time mutations: related-memory `UPDATE`, predecessor deprecation `UPDATE`, lineage/history/BM25 writes, governance metadata `UPDATE`, governance audit inserts, shared-conflict writes, and post-insert enrichment writes into causal/entity/summary/graph tables. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:170-224] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:819-853] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:73-187]

## New Information Assessment
- `newInfoRatio`: `0.38`
- Why not higher: the headline risks (governance bypass, retention wiring gap, dead `opencode-capture` registry entry) were already in known context.
- What was genuinely new this round:
  - The exact hook-by-hook divergence between script save/index and MCP `memory_save`
  - Confirmation that retention sweep is referenced only by tests in this repo pass
  - One additional dead registry entry beyond `opencode-capture` (`skill_advisor`)

## Status
- Q3 answered: Yes
- Convergence note: This iteration adds precise path mapping and parity evidence, but it mostly deepens existing P1-11/P1-12/P1-5 hypotheses rather than overturning them.
