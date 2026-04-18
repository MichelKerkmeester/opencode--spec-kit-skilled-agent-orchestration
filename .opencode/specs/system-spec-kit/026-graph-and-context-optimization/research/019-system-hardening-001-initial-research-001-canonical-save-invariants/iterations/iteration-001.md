# Focus

Draft the Q1 field catalogue for `/memory:save` by enumerating the concrete write targets across the four state layers, and surface the first 2-3 candidate cross-layer invariants for Q2. This iteration stayed inside source inspection only; no packet-wide observation was attempted yet.

# Actions Taken

1. Read the canonical CLI entrypoint in `scripts/memory/generate-context.ts` to confirm the default planner mode and the intended workflow outputs (`plan-only` by default, canonical save plus graph refresh in the same flow).
2. Read the H-56-1 workflow region in `scripts/core/workflow.ts` to trace the description-tracking block, the lifted follow-up gate, the graph refresh, the spec-doc reindex, and the post-save review hook.
3. Read `scripts/spec-folder/generate-description.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, and the routed canonical write path in `mcp_server/handlers/memory-save.ts` to enumerate the frontmatter and `description.json` field sets.
4. Read `mcp_server/lib/graph/graph-metadata-schema.ts` plus `mcp_server/handlers/save/create-record.ts` to enumerate the `graph-metadata.json.derived.*` fields and the vector-index payload/post-insert metadata fields.

# Findings

## Q1 draft: write-target catalogue

### Layer 1: frontmatter `_memory.continuity`

- The thin continuity schema is explicit: `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action`, `blockers[]`, `key_files[]`, optional `session_dedup`, `completion_pct`, `open_questions[]`, and `answered_questions[]` ([`thin-continuity-record.ts:26-38`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts#L26), [`thin-continuity-record.ts:881-893`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts#L881)).
- Routed canonical saves always upsert that record back into markdown frontmatter, not into a sidecar file; `upsertThinContinuityInMarkdown()` rewrites the entire frontmatter block with the validated continuity payload ([`thin-continuity-record.ts:979-997`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts#L979)).
- In `memory_save`, both the `metadata_only` route and the normal merged-document route call `upsertThinContinuityInMarkdown()`. The `metadata_only` path also forces `targetAnchorId = '_memory.continuity'` ([`memory-save.ts:1462-1495`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1462), [`memory-save.ts:1530-1559`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1530)).

### Layer 2: `description.json`

- `generate-description.ts` writes the base per-folder shape: `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, and `memoryNameHistory` when generating from explicit text, or delegates to `generatePerFolderDescription()` when deriving from `spec.md` ([`generate-description.ts:66-103`](../../../../../../../.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts#L66)).
- The canonical save workflow now runs description tracking on every save because H-56-1 hard-sets `ctxFileWritten = true` after the legacy memory artifact was retired ([`workflow.ts:1326-1335`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1326)).
- On each canonical save, the workflow:
  - regenerates missing/corrupt `description.json` from `spec.md` + path structure if needed,
  - increments `memorySequence`,
  - appends the current generated filename slug (`rawCtxFilename`) to `memoryNameHistory` while keeping the latest 20 entries,
  - updates `lastUpdated` to the current save timestamp,
  - retries up to 3 times to confirm the `memorySequence` write ([`workflow.ts:1345-1408`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1345)).

### Layer 3: `graph-metadata.json.derived.*`

- The derived schema currently includes: `trigger_phrases`, `key_topics`, `importance_tier`, `status`, `key_files`, `entities`, `causal_summary`, `created_at`, `last_save_at`, optional `save_lineage`, `last_accessed_at`, and `source_docs` ([`graph-metadata-schema.ts:36-49`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts#L36)).
- H-56-1 also removed the old planner-mode gate by setting `shouldRunExplicitSaveFollowUps = true`, so every canonical save now refreshes graph metadata regardless of `plan-only` vs `full-auto` ([`workflow.ts:1418-1427`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1418)).
- The graph refresh is executed in the same pass with `now: metadataSaveTimestamp` and `saveLineage: 'same_pass'` ([`workflow.ts:1434-1450`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1434)).
- If the packet has research iteration directories, the same save also backfills missing iteration-level `description.json` / `graph-metadata.json` files under the research tree ([`workflow.ts:1456-1472`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1456)).

### Layer 4: memory vector index / DB metadata

- `generate-context.ts` still advertises that the workflow both saves context and indexes it, but the old standalone “legacy memory artifact” index step is retired; Step 11 logs `Skipping retired legacy memory indexing` ([`generate-context.ts:77-82`](../../../../../../../.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L77), [`workflow.ts:1488-1492`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1488)).
- The canonical-save replacement is Step 11.5: reindex touched canonical spec docs plus `graph-metadata.json` via `reindexSpecDocs(specFolderName)`, with counts for `indexed`, `updated`, `unchanged`, `failed`, and `scanned` surfaced from the scan result ([`workflow.ts:1494-1596`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1494)).
- The direct `memory_save` handler still performs the lower-level vector-index write for the persisted canonical document row. `createMemoryRecord()` writes the index identity fields:
  - `specFolder`
  - `filePath`
  - `anchorId`
  - `title`
  - `triggerPhrases`
  - `importanceWeight`
  - `embedding` or deferred indexing `failureReason`
  - `encodingIntent`
  - `documentType`
  - `specLevel`
  - `contentText`
  - `qualityScore`
  - `qualityFlags`
  - `appendOnly`
  ([`create-record.ts:310-342`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L310)).
- After the row is created, post-insert metadata is also written for:
  - `content_hash`
  - `context_type`
  - `importance_tier`
  - `memory_type`
  - `type_inference_source`
  - `stability`
  - `difficulty`
  - `file_mtime_ms`
  - `encoding_intent`
  - `document_type`
  - `spec_level`
  - `quality_score`
  - `quality_flags`
  ([`create-record.ts:347-360`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L347)).

## Q2 draft: first candidate cross-layer invariants

1. **Canonical save freshness invariant.** Every successful canonical save should advance both `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` in the same workflow pass, because both are driven from the same `metadataSaveTimestamp` after H-56-1 ([`workflow.ts:1334-1392`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1334), [`workflow.ts:1447-1450`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1447)).
2. **Continuity-anchor invariant.** If the routed save lands in `_memory.continuity`, the markdown frontmatter must contain a valid thin continuity record and the indexed row must use the matching `_memory.continuity` anchor id so retrieval points back at the same logical surface ([`memory-save.ts:1462-1495`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1462), [`create-record.ts:310-314`](../../../../../../../.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L310)).
3. **Planner-mode parity invariant.** `plan-only` saves are no longer allowed to skip description refresh, graph refresh, spec-doc reindex, or post-save review; those follow-ups should be planner-mode agnostic after the H-56-1 gate lift ([`workflow.ts:1418-1427`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1418), [`workflow.ts:1494-1616`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1494)).

## Additional note on post-save review

- The post-save reviewer is a validation/logging surface, not a write layer. It classifies saves as `PASSED`, `ISSUES_FOUND`, `SKIPPED`, `REJECTED`, or `REVIEWER_ERROR`, and prints structured review output, but this first pass did not find any evidence that it mutates packet state directly ([`post-save-review.ts:27-52`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L27), [`workflow.ts:1601-1616`](../../../../../../../.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1601)).

# Questions Answered

- **Q1:** Partially answered. The first-pass field catalogue is now drafted for all four layers, with a clear split between canonical-save metadata writes and vector-index writes.
- **Q2:** Partially answered. Three high-confidence candidate invariants are now explicit and source-backed.

# Questions Remaining

- **Q2:** Expand the candidate set from 3 invariants to at least 5, especially around filename/history lineage and graph/source-doc coverage.
- **Q3:** Verify the H-56-1 fix behavior empirically across both `plan-only` and `full-auto` dispatch paths, not just by code inspection.
- **Q4:** Observe the 26 active 026-tree packets and classify real vs benign drift once the catalogue is stable.
- **Q5:** Turn the invariant list into validator assertions and propose a migration path for existing packet-local drift.

# Next Focus

Read the graph refresh derivation path itself (`graph-metadata-parser.ts`) and the continuity freshness validator, then sample a small set of active 026-tree packets to convert this draft catalogue into observed invariants before scaling to all 26 packets.
