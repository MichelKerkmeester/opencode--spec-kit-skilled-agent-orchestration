# Agent 03 - Wave 1 Slice A03 Notes

## Scope Completed

Updated only the requested module README files under `mcp_server/` plus this scratch note.

Updated files:
- `.opencode/skill/system-spec-kit/mcp_server/core/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/database/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tools/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/utils/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`

## What Changed

General pass:
- Replaced long, drifted docs with concise implemented-state snapshots.
- Kept content ASCII-only.
- Focused on current module behavior and active interfaces instead of old examples.

Per-file notes:

### 1) core/README.md
- Reframed as runtime foundation module (`config.ts`, `db-state.ts`, `index.ts`).
- Added current dependency coverage in `init()` (`sessionManager`, `incrementalIndex` included).
- Added hardening summary: BUG-001, HIGH-002, BUG-005, plus P4-12/P4-13 lifecycle fixes.

### 2) database/README.md
- Corrected folder reality: runtime DB files are generated; repo tracks `.db-updated` and `.gitkeep`.
- Added schema-v13 alignment (`document_type`, `spec_level`) from Spec 126.
- Clarified role of `.db-updated` in reconnect signaling.

### 3) formatters/README.md
- Tightened to current formatter responsibilities only.
- Confirmed anchor/token metrics behavior and guard condition (`includeContent` + `anchors`).
- Kept path-validation mention aligned with core allowed-path policy.

### 4) handlers/README.md
- Replaced stale table-centric wording with actual handler module inventory.
- Corrected persistence language to `memory_index` model (not old `memories` phrasing).
- Added Spec 126 state: `includeSpecDocs`, doc metadata preservation, spec-doc chain creation.
- Added hardening points (safe mtime updates, folder-boundary filtering, descriptor-safe reads).

### 5) hooks/README.md
- Corrected API naming to camelCase exports (`extractContextHint`, `autoSurfaceMemories`, etc.).
- Corrected returned latency key to `latencyMs`.
- Clarified this is helper logic, not standalone MCP hook registration.

### 6) tools/README.md
- Kept dispatch architecture but condensed to current shape and responsibilities.
- Explicitly documented 22-tool/5-dispatcher implemented state.
- Added recent argument support highlights (`includeSpecDocs`, `asyncEmbedding`).

### 7) utils/README.md
- Replaced outdated snake_case examples with current camelCase exported APIs.
- Documented actual utility module responsibilities and key exports.
- Kept security/reliability guidance aligned with active validator and batch behavior.

### 8) scripts/README.md
- Reframed to current single-script reality (`reindex-embeddings.ts`).
- Clarified it reuses handler pipeline (`handleMemoryIndexScan`) and force behavior.
- Kept usage minimal and current.

### 9) configs/README.md
- Corrected implemented state to match `search-weights.json` comments and current code posture.
- Documented active vs legacy/dead sections explicitly.
- Added Spec 126 and Spec 125 context where relevant:
  - documentTypeMultipliers added by Spec 126
  - dead/legacy config annotations from post-audit hardening state

## Alignment References Used

Spec implementation summaries reviewed:
- Spec 122, 123, 124, 125, 126, 127, 128, 129 implementation summaries

Primary code reality checks:
- `mcp_server/core/config.ts`
- `mcp_server/core/db-state.ts`
- `mcp_server/handlers/index.ts`
- `mcp_server/handlers/memory-index.ts`
- `mcp_server/handlers/memory-save.ts`
- `mcp_server/hooks/memory-surface.ts`
- `mcp_server/tools/types.ts`
- `mcp_server/utils/index.ts`
- `mcp_server/formatters/index.ts`
- `mcp_server/scripts/reindex-embeddings.ts`
- `mcp_server/configs/search-weights.json`

## Verification Run

Performed:
- Manual content verification against current module files and spec 122-129 summaries.
- `git diff --` review of the changed README set and scratch note.

Not performed:
- Unit/integration tests (documentation-only changes).
