---
title: "Tasks: Spec Folder Description System Refactor"
description: "Implementation tasks derived from plan.md phases."
trigger_phrases:
  - "description tasks"
  - "implementation tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Spec Folder Description System Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `TASK-###` | Phase-local task identifier preserved from the original implementation campaign |

**Task Format**: `TASK-###: Description (primary file or seam)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Per-Folder Description Infrastructure

- [x] TASK-001: Define the per-folder description data model in `folder-discovery.ts`
  - [x] Add the `PerFolderDescription` interface with identity and memory naming fields.
  - [x] Keep the schema backward-compatible with the existing folder description shape.
- [x] TASK-002: Implement per-folder description generation logic
  - [x] Create `generatePerFolderDescription(specMdPath, folderPath, basePath)`.
  - [x] Extract the summary sentence, keywords, folder identity, and parent chain values.
- [x] TASK-003: Implement per-folder description loading and persistence helpers
  - [x] Create `loadPerFolderDescription(folderPath)` with null-safe handling for missing files.
  - [x] Create `savePerFolderDescription(desc, folderPath)` targeting `description.json` at the folder root.
- [x] TASK-004: Add safe write and freshness checks for per-folder description files
  - [x] Use atomic temp-then-rename writes for `description.json`.
  - [x] Compare `description.json` and `spec.md` mtimes to detect stale metadata. [EVIDENCE: isPerFolderDescriptionStale() at folder-discovery.ts:690-700, T046-25b verifies stale detection → regeneration → freshness cycle]
- [x] TASK-005: Add unit coverage for the new per-folder description helpers
  - [x] Test generation output shape and extracted field values.
  - [x] Test load/save behavior and stale detection paths. [EVIDENCE: T009 loadPerFolderDescription/savePerFolderDescription suite (5 tests), T046-25/25b stale detection tests]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### create.sh Integration

- [x] TASK-006: Add spec folder description generation to `create.sh`
  - [x] Introduce a `generate_description_json()` helper in the script.
  - [x] Invoke it after template files are copied into a new spec folder.
- [x] TASK-007: Add a Node CLI wrapper for description generation
  - [x] Create `scripts/spec-folder/generate-description.ts` as a thin wrapper.
  - [x] Route the CLI through `generatePerFolderDescription()` for shared logic.
- [x] TASK-008: Wire the Bash and Node paths together for automated folder creation
  - [x] Call `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder-path>` from `create.sh`.
  - [x] Ensure failures surface clearly if description generation cannot complete.
- [x] TASK-009: Extend creation-time generation to phased spec folders
  - [x] Support `--phase` workflows so each child phase folder gets its own `description.json`.
  - [x] Preserve correct relative path handling for nested folders.
- [x] TASK-010: Add integration coverage for creation-time description generation
  - [x] Verify L1, L2, and L3 folder creation all produce `description.json`.
  - [x] Verify generation works for nested and phase-based folder paths.

### Memory Uniqueness Guarantees

- [x] TASK-011: Add collision-resistant slug generation in `slug-utils.ts`
  - [x] Implement `ensureUniqueMemoryFilename(contextDir, filename)`.
  - [x] Scan existing memory files and append `-1`, `-2`, and higher suffixes when needed.
- [x] TASK-012: Add guardrails for repeated collision attempts
  - [x] Cap retry attempts at 100 iterations as a fail-safe.
  - [x] Return deterministic results for the first available filename candidate.
- [x] TASK-013: Integrate unique slug generation into the memory save workflow
  - [x] Call `ensureUniqueMemoryFilename()` in `workflow.ts` before constructing `ctxFilename`.
  - [x] Preserve the current filename format while preventing overwrites.
- [x] TASK-014: Persist memory naming state in per-folder description metadata
  - [x] Increment the `memorySequence` counter on each memory save.
  - [x] Maintain `memoryNameHistory` as a ring buffer containing the last 20 slugs.
- [x] TASK-015: Add defense-in-depth to the atomic file writer
  - [x] Check for target filename existence before final write completion.
  - [x] Keep overwrite prevention aligned with the new uniqueness rules.
- [x] TASK-016: Add tests for rapid-save and same-timestamp collision scenarios
  - [x] Verify 10 rapid saves produce 10 unique files.
  - [x] Verify repeated saves with the same base slug receive sequential suffixes.

### Aggregation & Backward Compatibility

- [x] TASK-017: Refactor centralized description aggregation to prefer per-folder files
  - [x] Update `generateFolderDescriptions()` to read `description.json` when present.
  - [x] Fall back to `spec.md` extraction when per-folder data is missing.
- [x] TASK-018: Preserve consumer-facing cache behavior
  - [x] Keep `ensureDescriptionCache()` behavior stable for existing callers.
  - [x] Ensure aggregated output shape remains compatible with current consumers.
- [x] TASK-019: Extend cache staleness detection for the new architecture
  - [x] Update `isCacheStale()` to account for per-folder description file mtimes.
  - [x] Rebuild the centralized cache when a source folder file becomes newer than the aggregate.
- [x] TASK-020: Protect backward compatibility when no per-folder files exist
  - [x] Preserve current behavior for repositories that still rely only on `spec.md`.
  - [x] Avoid breaking mixed-mode environments during rollout.
- [x] TASK-021: Add integration coverage for mixed per-folder and legacy discovery
  - [x] Test scenarios where some folders contain `description.json` and others do not.
  - [x] Verify aggregation remains correct across both data sources.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Documentation & Testing Playbook

- [x] TASK-022: Update the feature catalog documentation for the refactored description system
  - [x] Revise `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md` with the per-folder architecture flow.
  - [x] Update the source file inventory and uniqueness behavior notes.
- [x] TASK-023: Expand the testing playbook for the new description workflow
  - [x] Add scenarios for per-folder generation, stale detection, and aggregation behavior.
  - [x] Document rapid-save uniqueness verification steps.
- [x] TASK-024: Extend integration tests to cover the new description system behavior
  - [x] Update `folder-discovery-integration.vitest.ts` with per-folder description scenarios.
  - [x] Add coverage for backward-compatible mixed-mode discovery.
- [x] TASK-025: Run regression verification for the full description system refactor
  - [x] Ensure all existing relevant tests pass without regressions.
  - [x] Confirm the final documentation and test suite reflect the implemented behavior.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 25 implementation tasks remain complete under the current Level 2 template structure.
- [x] Targeted regression coverage passes for `folder-discovery`, `folder-discovery-integration`, `workflow-memory-tracking`, `slug-utils-boundary`, and `slug-uniqueness`.
- [x] Strict validation hard errors were remediated by aligning this phase folder to the live template contract from `012-template-compliance`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Feature Catalog**: See `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`

<!-- AUDIT-2026-03-16: All 25 tasks remain complete. Phase 1-2 shipped the per-folder description lifecycle and create.sh integration. Phase 2 shipped uniqueness and aggregation hardening, including reserved random fallback after 100 collisions, discovery-time repair for stale/corrupt existing description.json files, and blank-spec per-folder metadata generation. Latest targeted verification used the current workspace commands: scripts `npm run lint`, scripts `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/slug-uniqueness.vitest.ts`, mcp_server `npx vitest run tests/folder-discovery.vitest.ts tests/folder-discovery-integration.vitest.ts tests/workflow-memory-tracking.vitest.ts tests/slug-utils-boundary.vitest.ts`. -->
<!-- /ANCHOR:cross-refs -->
