# Phase 3-4 Assessment --- Memory Sequence & Aggregation

Agent: W5-A2 | Date: 2026-03-08 | Source: `folder-discovery.ts` + `workflow.ts` + test files

## What Already Exists

### Phase 3: memorySequence Counter & memoryNameHistory

**Type definition (folder-discovery.ts:34-40):**
- `PerFolderDescription` interface extends `FolderDescription` with `memorySequence: number` (monotonic counter per save) and `memoryNameHistory: string[]` (last 20 slugs, ring buffer). Both fields are well-typed and documented.

**Preservation on regeneration (folder-discovery.ts:573-587):**
- `generatePerFolderDescription()` loads existing `description.json` via `loadPerFolderDescription()` and carries forward `memorySequence` and `memoryNameHistory` with nullish-coalescing defaults (`?? 0` / `?? []`). This prevents counter reset when description content is regenerated from spec.md.

**Workflow integration (workflow.ts:841-856):**
- After atomic file writes (Step 9), workflow dynamically imports `loadPerFolderDescription` / `savePerFolderDescription` from the MCP server module.
- Increments `memorySequence` by 1: `existing.memorySequence = (existing.memorySequence || 0) + 1`
- Appends current `ctxFilename` to `memoryNameHistory` with ring buffer cap: `[...(existing.memoryNameHistory || []).slice(-19), ctxFilename]` (keeps last 20 entries).
- Entire block is wrapped in try/catch with empty catch --- non-fatal, best-effort tracking.

**Atomic I/O (folder-discovery.ts:622-630):**
- `savePerFolderDescription()` uses temp file + rename pattern for atomic writes.
- Note in JSDoc explicitly acknowledges concurrent-process lost-update risk as acceptable trade-off for non-critical tracking data.

### Phase 4: Aggregation Refactor

**Per-folder preference in aggregation (folder-discovery.ts:438-451):**
- `generateFolderDescriptions()` already prefers per-folder `description.json` when:
  1. `loadPerFolderDescription()` returns non-null, AND
  2. `isPerFolderDescriptionStale()` returns false
- Repairs stale/corrupt existing per-folder files from `spec.md` during discovery, and falls back to `_processSpecFolder()` only when per-folder files are missing.

**Per-folder staleness detection (folder-discovery.ts:640-650):**
- `isPerFolderDescriptionStale()` compares `description.json` mtime vs `spec.md` mtime.
- Missing `description.json` = stale (returns true).
- Correctly handles read errors with try/catch returning true.

**ensureDescriptionCache compatibility (folder-discovery.ts:747-781):**
- `ensureDescriptionCache()` loads from `descriptions.json`, checks staleness via `isCacheStale()`, regenerates via `generateFolderDescriptions()`, saves, and returns. Consumer-facing shape is preserved.

**Backward compatibility (folder-discovery.ts:453-465):**
- When a per-folder file is missing, aggregation falls back to the legacy spec.md extraction path via `_processSpecFolder()` (without implicit writes).

### Test Coverage

- **folder-discovery.vitest.ts** (T009 suite):
  - `memorySequence starts at 0` --- verifies initial value
  - `memoryNameHistory is initially empty` --- verifies initial state
  - `memoryNameHistory acts as ring buffer (max 20)` --- verifies 25-item history truncated to 20
  - `preserves existing memorySequence on regeneration` --- verifies counter/history survive description regen
  - `isPerFolderDescriptionStale` (T009 suite) --- tests missing desc, missing spec.md, and fresh states

- **folder-discovery-integration.vitest.ts** (T046 suite):
  - `T046-22`: uses per-folder description.json when fresh
  - `T046-23`: repairs stale existing `description.json` from `spec.md` during discovery
  - `T046-24`: mixed mode aggregation with fresh per-folder files plus fallback for missing files
  - `isCacheStale` suite: 12+ tests covering null cache, invalid timestamps, nested depths, deleted/renamed folders

## What's Missing

### 1. Cache-level staleness does NOT incorporate description.json mtime (CONFIRMED GAP)

**Location:** `collectDiscoveredSpecState()` (folder-discovery.ts:206-231) and `isCacheStale()` (folder-discovery.ts:720-738)

**Problem:** `collectDiscoveredSpecState()` only tracks `spec.md` mtime values. When a memory save updates `description.json` (incrementing `memorySequence`), the `spec.md` mtime does not change. Therefore `isCacheStale()` will return false even though the per-folder `description.json` has been modified since the aggregate cache was generated.

**Impact:** The aggregate `descriptions.json` cache may serve stale data for a folder whose `description.json` was updated (e.g., after a memory save that incremented `memorySequence`). The staleness is self-correcting on next spec.md edit, but in the interim the aggregate cache does not reflect the latest per-folder tracking data.

**Severity:** Medium. The `memorySequence` / `memoryNameHistory` data in the aggregate cache will lag behind per-folder truth. This affects cache consumers that rely on the aggregate file rather than calling `loadPerFolderDescription()` directly. In practice, the MCP search tools primarily use the aggregate for description/keyword matching (not memory tracking), so the operational impact is limited.

**Fix approach:** Expand `collectDiscoveredSpecState()` to also stat `description.json` alongside `spec.md` in each discovered folder, taking the max mtime of both files. This is a ~10-line change but requires careful consideration of:
- Folders without `description.json` (common for new folders --- must not error)
- Performance: adds one `statSync` call per discovered folder
- Test updates: existing `isCacheStale` tests assume only spec.md drives staleness

### 2. No test for workflow-level memorySequence increment round-trip

The test suite verifies that `PerFolderDescription` type holds correct values and that `generatePerFolderDescription()` preserves existing tracking data, but there is no test that exercises the actual workflow.ts integration path: save memory file -> load description.json -> increment memorySequence -> save description.json -> verify counter incremented. This is an integration test gap (the code works, but confidence is lower without end-to-end coverage).

### 3. No concurrent-write protection for memorySequence

As documented in the JSDoc, concurrent processes can cause lost updates to `memorySequence`. There is no file lock, compare-and-swap, or retry logic. This is explicitly accepted as a trade-off for non-critical tracking data and is documented rather than a bug, but it is worth noting as a known limitation.

## Changes Made

No code changes were made. The assessment confirms that Phase 3-4 implementation is substantially complete with one clear gap (cache-level description.json mtime tracking) that requires a focused fix but not a significant rework.

## Remaining Work

| Item | Effort | Priority | Description |
|---|---|---|---|
| `collectDiscoveredSpecState` description.json mtime | S-M | P1 | Expand to stat both `spec.md` and `description.json`, take max mtime. ~10 lines in `collectDiscoveredSpecState()` + test updates. |
| Workflow integration test | M | P2 | End-to-end test: write memory file via workflow -> verify memorySequence incremented in description.json. Requires test infrastructure for workflow invocation. |
| isCacheStale test for description.json mutation | S | P1 | New test case: modify description.json after cache generation -> verify `isCacheStale()` returns true. Required companion to the `collectDiscoveredSpecState` fix. |

### Recommended Fix for collectDiscoveredSpecState

The fix is localized to `collectDiscoveredSpecState()` at folder-discovery.ts:206-231. After the existing `spec.md` mtime stat, add a second stat for `description.json` in the same folder and take the max:

```
// After spec.md mtime collection (line ~220-227):
// Also check description.json mtime for cache-level staleness
try {
  const descJsonPath = path.join(discoveredFolder.folderPath, 'description.json');
  const descMtime = fs.statSync(descJsonPath).mtimeMs;
  if (descMtime > latestMtime) {
    latestMtime = descMtime;
  }
} catch {
  // description.json may not exist yet — not an error
}
```

This is small and safe but was not implemented in this assessment pass because it requires corresponding test updates to validate the new behavior and ensure no regressions in the existing 12+ `isCacheStale` test cases.
