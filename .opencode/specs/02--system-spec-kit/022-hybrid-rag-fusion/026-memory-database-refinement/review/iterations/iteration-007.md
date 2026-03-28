# Iteration 007: Lineage and Versioning

## Findings

### [P0] Governed memories from different scopes collide into the same lineage key
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`

**Issue**: Same-path predecessor lookup is scope-aware, but lineage identity is not. `findSamePathExistingMemory()` explicitly isolates predecessor selection by `tenant_id`, `user_id`, `agent_id`, `session_id`, and `shared_space_id`, yet `buildLogicalKey()` only uses `spec_folder`, canonical path, and anchor. That means two governed memories from different scopes but the same file path produce the same `logical_key`. On the first append-only write for the second scope, lineage will try to insert another version `1` for that same key and hit `UNIQUE(logical_key, version_number)`, or at minimum compete for the same `active_memory_projection` row. This breaks tenant/session isolation and turns lineage/projection into a cross-scope collision surface.

**Evidence**:
- [`create-record.ts:47`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L47) scopes same-path predecessor lookup by governance fields.
- [`content-hash-dedup.vitest.ts:511`](../../../../../../skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts#L511) codifies that predecessor lookup must stay inside the current governance scope.
- [`lineage-state.ts:185`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L185) builds lineage keys from only `spec_folder`, canonical path, and anchor.
- [`vector-index-schema.ts:935`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L935) enforces `UNIQUE(logical_key, version_number)` in `memory_lineage`, and [`vector-index-schema.ts:999`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L999) makes `logical_key` the primary key of `active_memory_projection`.
- [`post-insert-metadata.ts:36`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts#L36) shows the scope fields are present on `memory_index`, so the omission is in lineage key construction, not in the stored row data.

**Fix**: Make lineage identity scope-aware. Either include the normalized governance scope tuple in `logical_key`, or introduce a separate stable lineage identity that is derived from `(tenant, user/agent, session/shared-space, spec_folder, canonical_path, anchor)` and use that identity consistently in both `memory_lineage` and `active_memory_projection`.

### [P1] PE `SUPERSEDE` can splice unrelated files into the same version chain
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`

**Issue**: The save path treats any PE `SUPERSEDE` target as a lineage predecessor, even when it was selected by semantic similarity rather than by logical-file identity. `findSimilarMemories()` searches across the scoped memory set and does not restrict candidates to the same file path. When PE returns `SUPERSEDE`, `createMemoryRecord()` uses `existingMemoryId` as `predecessorMemoryId`, and `recordLineageTransition()` then adopts the predecessor's `logical_key` and `root_memory_id`. A contradiction in one file can therefore become the next version of a different file's lineage, moving the active projection for the older document onto the newer file.

**Evidence**:
- [`pe-gating.ts:63`](../../../../../../skill/system-spec-kit/mcp_server/handlers/pe-gating.ts#L63) finds similar memories by semantic search within scope, not by same-path identity.
- [`prediction-error-gate.ts:273`](../../../../../../skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts#L273) converts a high-similarity contradiction into `ACTION.SUPERSEDE`.
- [`create-record.ts:115`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L115) prioritizes `peDecision.existingMemoryId` as the predecessor whenever PE chose `SUPERSEDE`.
- [`lineage-state.ts:547`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L547) blindly inherits `logical_key` and `root_memory_id` from the predecessor row.

**Fix**: Only append to an existing lineage when the predecessor matches the new row's own logical identity. If PE identifies a contradictory memory on a different file path, model it as a causal `supersedes`/conflict relationship instead of a version-chain predecessor.

### [P1] Retention plumbing exists, but expiring the active version would currently drop the active view and erase lineage history
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`

**Issue**: The code persists `retention_policy` and `delete_after`, and governance comments explicitly say ephemeral memories rely on `delete_after`-based sweeps, but I could not find any production retention-sweep implementation under `mcp_server`. More importantly, the only available cleanup path is generic deletion, and that path hard-deletes both `memory_lineage` and `active_memory_projection` rows for the target memory. If an active version is ever deleted for expiry, the logical memory disappears from all projection-backed reads instead of promoting the predecessor or preserving an auditable lineage chain. This is both a retention gap and an integrity gap.

**Evidence**:
- [`memory-save.ts:724`](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L724) validates and accepts `retentionPolicy` / `deleteAfter`.
- [`scope-governance.ts:270`](../../../../../../skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L270) states ephemeral rows depend on `delete_after`-based sweeps.
- [`vector-index-schema.ts:1063`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1063) stores and indexes `retention_policy` / `delete_after`.
- [`vector-index-mutations.ts:43`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L43) deletes `memory_lineage` rows outright and [`vector-index-mutations.ts:66`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L66) deletes the matching `active_memory_projection`.
- [`vector-index-queries.ts:84`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L84) and [`vector-index-store.ts:492`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L492) show that folder reads, counts, and constitutional injection all rely on `JOIN active_memory_projection`.
- A repository-wide search under `.opencode/skill/system-spec-kit/mcp_server` for `retention_sweep` / `delete_after` consumers found only schema/test references, not a runtime sweep implementation.

**Fix**: Implement a real retention sweep that is lineage-aware. For expired active versions, either tombstone the version while promoting the most recent non-expired predecessor into `active_memory_projection`, or preserve lineage rows and mark expiry in metadata instead of physically deleting chain state. If hard deletion is required, it should repair the predecessor/successor pointers and projection inside the same transaction.

### [P2] Delimiter collisions are only warned about, so ambiguous logical keys are still persisted
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`

**Issue**: `buildLogicalKey()` acknowledges that `::` inside `spec_folder`, canonical path, or anchor makes the composite key ambiguous, but it only emits a warning and still persists the concatenated string. Two distinct component tuples can therefore map to the same `logical_key`, merging independent chains or causing projection overwrite.

**Evidence**:
- [`lineage-state.ts:192`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L192) warns about `::` in key components.
- [`lineage-state.ts:196`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L196) still returns the raw delimiter-joined key.
- [`vector-index-schema.ts:948`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L948) and [`vector-index-schema.ts:1000`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1000) make that ambiguous string a uniqueness/primary-key boundary.

**Fix**: Stop using raw string concatenation for lineage identity. Encode each component safely, use a structured serialization such as JSON, or hash a canonical tuple so ambiguous user/path data cannot alias another lineage.

### [P2] Concurrent supersedes of the same predecessor are not serialized or retried
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`

**Issue**: `recordLineageTransition()` derives the next `version_number` from the predecessor row in user space and then inserts that version without any optimistic retry or compare-and-swap guard. If two writers supersede the same predecessor concurrently, both compute the same next version and race into `UNIQUE(logical_key, version_number)`. The transaction protects against silent corruption, but one writer will still fail with an integrity error even though a valid serialized outcome exists.

**Evidence**:
- [`lineage-state.ts:547`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L547) loads the predecessor row and computes `version_number = predecessor.version_number + 1`.
- [`lineage-state.ts:583`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L583) inserts that computed version directly.
- [`vector-index-schema.ts:948`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L948) enforces uniqueness on `(logical_key, version_number)`.
- There is no retry, lock promotion, or conflict-specific recovery path around the insert in [`lineage-state.ts:533`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L533).

**Fix**: Serialize writes per logical key or add a conflict-aware retry path. At minimum, catch uniqueness failures on `(logical_key, version_number)`, reload the latest lineage state, verify the predecessor is still current, and retry or surface a deterministic conflict result instead of a raw DB failure.

## Summary
P0: 1, P1: 2, P2: 2
