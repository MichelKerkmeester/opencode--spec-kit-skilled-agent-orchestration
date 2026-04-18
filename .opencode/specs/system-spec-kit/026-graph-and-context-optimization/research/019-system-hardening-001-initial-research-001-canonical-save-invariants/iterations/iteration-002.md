# Focus

Extend the Q1 field catalogue for `/memory:save`, derive a source-backed Q2 invariant set across the four write layers, and verify whether H-56-1 fully removed planner-mode suppression for both default `plan-only` and explicit `full-auto` dispatches.

# Actions Taken

1. Re-read `iteration-001.md` to keep the Q1 draft catalogue and earlier candidate invariants stable before extending them.
2. Verified CLI dispatch and defaults in `generate-context.ts` to confirm that `plan-only` remains the default and that both planner modes feed the same workflow entrypoint (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:77-82`, `:415-437`, `:598-607`).
3. Re-read the H-56-1 workflow region to trace the description refresh, graph refresh, Step 11.5 reindex, research backfill, and post-save review behavior (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1326-1615`).
4. Re-read the routed continuity writer, vector-index record creation, scope post-insert metadata helper, and graph derivation code to tighten Q1 and derive Q2 invariants from actual write paths (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213-1248`, `:1462-1565`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:158-171`, `:310-362`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:17-108`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:969-1075`).

# Findings

## Q1 delta: missed fields and exhaustiveness check

- Iteration 1's frontmatter catalogue still holds. The continuity validator confirms the required minimum set remains `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, and `next_safe_action`; the rest of `_memory.continuity` remains optional structure rather than a newly discovered required field (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:512-555`).
- The only material vector-layer addition to the iteration-001 draft is scope metadata. After the initial insert, `createMemoryRecord()` can also write `tenant_id`, `user_id`, `agent_id`, and `session_id` through `buildScopePostInsertMetadata()` when those scope values are present (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:158-171`, `:347-362`).
- The broader post-insert helper allows provenance/retention fields such as `provenance_source`, `provenance_actor`, `retention_policy`, `delete_after`, and `governance_metadata`, but the canonical `createMemoryRecord()` path inspected here does not populate them. For this save path, their absence is expected and should not be classified as drift (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:17-45`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:347-362`).

## Q2: cross-layer invariants

1. **Same-pass freshness invariant.** For workflow-driven canonical saves, `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` should be equal because both are written from the same `metadataSaveTimestamp` in the same workflow pass (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1334-1392`, `:1447-1450`).
2. **Same-pass lineage invariant.** Workflow-driven graph refreshes should write `graph-metadata.json.derived.save_lineage = "same_pass"` because the canonical save path always calls `refreshGraphMetadata(..., { saveLineage: "same_pass" })`. Historical `null` or missing values are migration debt, not current-path behavior (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1434-1450`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1068-1072`).
3. **Packet identity invariant.** `_memory.continuity.packet_pointer`, `description.json.specFolder`, and `graph-metadata.json.spec_folder` should normalize to the same packet-relative identity. The continuity writer strips the leading `/specs/` prefix, `description.json` stores the packet-relative folder, and graph metadata resolves the same packet folder for `spec_folder`/`packet_id` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1215-1234`, `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:75-91`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1049-1079`).
4. **Target-doc pointer invariant.** The routed continuity block, vector row, and graph metadata should all point at the same canonical document surface: `_memory.continuity.key_files` stores the relative target doc path, `createMemoryRecord()` indexes the same target doc path + anchor id, and graph refresh records packet-local `source_docs` from the canonical doc set that now includes the touched document (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1215-1240`, `:1462-1495`, `:1561-1565`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:310-314`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1049-1057`, `:1072`).
5. **Description lineage invariant.** Each canonical save should advance `description.json.memorySequence` monotonically by 1 and append the current `rawCtxFilename` to `memoryNameHistory`, while graph refresh preserves `derived.created_at` and only advances `derived.last_save_at`. This gives a stable graph creation point paired with append-only save lineage in `description.json` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1371-1392`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1068-1071`).
6. **Planner-mode parity invariant.** After H-56-1, `plan-only` and `full-auto` should produce the same metadata side effects for description refresh, graph refresh, Step 11.5 reindex, and post-save review. `generate-context.ts` only parses and forwards `plannerMode`; it no longer selects a different metadata pipeline, and the follow-up block in workflow is unconditional (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:77-82`, `:415-437`, `:598-607`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1418-1427`, `:1500-1509`, `:1601-1611`).

### Migration notes for Q2

- `save_lineage` is the clearest migration-sensitive field. Pre-fix packets can legitimately carry `null`/missing lineage even when their other metadata is present, because current workflow only hard-sets `"same_pass"` after the unconditional follow-up block landed.
- Timestamp equality between `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` is a current-path invariant, not a historical backfill guarantee. Older packets can be stale without implying a fresh regression.

## Q3: H-56-1 scope verification

### Restored by H-56-1

- **Description metadata refresh is restored on every canonical save.** The old dead stub is gone: `ctxFileWritten` is hard-set to `true`, so the `description.json` tracking block now runs for every canonical save and updates `memorySequence`, `memoryNameHistory`, and `lastUpdated` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1326-1392`).
- **Plan-only now gets the same follow-ups as full-auto.** The old `options.plannerMode === 'full-auto'` gate is removed and replaced with `const shouldRunExplicitSaveFollowUps = true;`, so graph refresh, Step 11.5 reindex, and post-save review are no longer planner-mode no-ops (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1418-1427`, `:1447-1450`, `:1500-1509`, `:1601-1611`).
- **Dispatch symmetry is real, not inferred.** `generate-context.ts` forwards `parsed.plannerMode` into the same `runWorkflow()` call for both modes; there is no separate pre-workflow branch that bypasses metadata updates for `plan-only` (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:598-607`).

### Still gated (but no longer by planner mode)

- **`description.json` refresh still depends on an existing or regenerable description file.** If the workflow cannot load or regenerate `description.json`, it returns without writing metadata; this is a data-availability gate, not a planner-mode gate (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1345-1365`).
- **Step 11.5 still honors explicit kill switches and target presence.** Auto-index skips when `specFolderName` is absent or when `SPECKIT_AUTO_INDEX_TOUCHED=false` / `SPECKIT_INDEX_SPEC_DOCS=false` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1500-1509`).
- **Research metadata backfill is conditional.** The iteration-level description/graph backfill still runs only when `hasResearchIterationDirectories(...)` is true (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1456-1472`).

### Was never gated

- **Planner mode itself was never a separate dispatch fork.** The CLI layer only chooses a string value (`plan-only`, `full-auto`, `hybrid`) and passes it into workflow; the H-56-1 bug lived in downstream workflow guards, not in argument parsing or dispatch selection (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:415-437`, `:598-607`).

# Questions Answered

- **Q1:** Substantially answered. The field catalogue is now exhaustive enough for validator design, with one meaningful addition: scope metadata in the vector row's post-insert layer.
- **Q2:** Answered for the code-path view. Six source-backed invariants are now explicit, including migration-sensitive notes.
- **Q3:** Answered. H-56-1 restores full metadata parity between `plan-only` and `full-auto`; the remaining skips are data/env guards, not planner-mode asymmetry.

# Questions Remaining

- **Q4:** Still open. The next step is to check the active 026-tree packets against the six invariants and classify each divergence as expected historical drift, benign omission, latent risk, or real regression.
- **Q5:** Still open. Validator assertions should be derived from the six invariants only after packet observations establish which historical deviations need migration exceptions.

# Next Focus

Sample the active 026-tree packets against the six invariants, especially `lastUpdated` vs `last_save_at`, `save_lineage`, packet identity normalization, and anchor/doc-path parity, then turn the observed divergence classes into validator assertions plus migration rules.
