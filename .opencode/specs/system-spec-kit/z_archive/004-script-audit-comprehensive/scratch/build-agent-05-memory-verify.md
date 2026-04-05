## Build Agent 05 - Memory/Indexing Verification (Static, Read-Only)

Source note: `context-agent-05-memory-indexing.md` is missing in this shard; highest-severity findings were validated via existing shard findings plus direct static inspection of current memory/indexing code.

Exclusion note: node_modules relocation-only issues are explicitly excluded.

Validated findings (top 3 highest severity, all CRITICAL):

1) C09-001 - CONFIRMED
- Finding: DB update marker writer/reader path contract is brittle and can diverge with structure assumptions.
- Evidence:
  - `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:19` writes marker via hardcoded relative traversal (`../../../mcp_server/database/.db-updated`).
  - `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:31` resolves `DATABASE_DIR` from env/CWD.
  - `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:35` reads marker at `path.join(DATABASE_DIR, '.db-updated')`.

2) C10-F002 - CONFIRMED
- Finding: immediate "generate/save -> indexed/available" behavior is not guaranteed.
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:816` returns `status = 'deferred'` when embedding is not successful.
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:849` returns deferred indexing message to caller.
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:240` enforces scan cooldown using `INDEX_SCAN_COOLDOWN`.
  - `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:48` sets `INDEX_SCAN_COOLDOWN` to `60000` ms.

3) C08-F003 - CONFIRMED
- Finding: degraded-operation paths continue after errors without hard failure, allowing partial-success behavior.
- Evidence:
  - `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:32` logs DB notification error and continues.
  - `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:89` logs trigger extraction failure and falls back.
  - `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:146` logs metadata update failure and continues.
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:206` logs vector search failure and returns empty result.
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:288` logs supersede failure and returns `false`.

Counts:
- validated_count: 3
- confirmed_count: 3
