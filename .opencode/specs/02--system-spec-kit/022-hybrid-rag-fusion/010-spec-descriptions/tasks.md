---
title: "Task Breakdown: Spec Folder Description System Refactor"
description: "Implementation tasks derived from plan.md phases."
trigger_phrases:
  - "description tasks"
  - "implementation tasks"
importance_tier: "normal"
contextType: "general"
---
# Task Breakdown: Spec Folder Description System Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:tasks -->
## TASKS

### Phase 1: Per-Folder Description Infrastructure

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
  - [ ] Compare `description.json` and `spec.md` mtimes to detect stale metadata. <!-- AUDIT-2026-03-08: CHK-024 (stale detection test) is unchecked in checklist -->
- [x] TASK-005: Add unit coverage for the new per-folder description helpers
  - [x] Test generation output shape and extracted field values.
  - [ ] Test load/save behavior and stale detection paths. <!-- AUDIT-2026-03-08: stale detection not yet tested per checklist -->

### Phase 2: create.sh Integration

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
- [ ] TASK-010: Add integration coverage for creation-time description generation
  - [ ] Verify L1, L2, and L3 folder creation all produce `description.json`.
  - [ ] Verify generation works for nested and phase-based folder paths.

### Phase 3: Memory Uniqueness Guarantees

- [ ] TASK-011: Add collision-resistant slug generation in `slug-utils.ts`
  - [ ] Implement `ensureUniqueSlug(contextDir, baseSlug, dateTime)`.
  - [ ] Scan existing memory files and append `-1`, `-2`, and higher suffixes when needed.
- [ ] TASK-012: Add guardrails for repeated collision attempts
  - [ ] Cap retry attempts at 100 iterations as a fail-safe.
  - [ ] Return deterministic results for the first available filename candidate.
- [ ] TASK-013: Integrate unique slug generation into the memory save workflow
  - [ ] Call `ensureUniqueSlug()` in `workflow.ts` before constructing `ctxFilename`.
  - [ ] Preserve the current filename format while preventing overwrites.
- [ ] TASK-014: Persist memory naming state in per-folder description metadata
  - [ ] Increment the `memorySequence` counter on each memory save.
  - [ ] Maintain `memoryNameHistory` as a ring buffer containing the last 20 slugs.
- [ ] TASK-015: Add defense-in-depth to the atomic file writer
  - [ ] Check for target filename existence before final write completion.
  - [ ] Keep overwrite prevention aligned with the new uniqueness rules.
- [ ] TASK-016: Add tests for rapid-save and same-timestamp collision scenarios
  - [ ] Verify 10 rapid saves produce 10 unique files.
  - [ ] Verify repeated saves with the same base slug receive sequential suffixes.

### Phase 4: Aggregation & Backward Compatibility

- [ ] TASK-017: Refactor centralized description aggregation to prefer per-folder files
  - [ ] Update `generateFolderDescriptions()` to read `description.json` when present.
  - [ ] Fall back to `spec.md` extraction when per-folder data is missing.
- [ ] TASK-018: Preserve consumer-facing cache behavior
  - [ ] Keep `ensureDescriptionCache()` behavior stable for existing callers.
  - [ ] Ensure aggregated output shape remains compatible with current consumers.
- [ ] TASK-019: Extend cache staleness detection for the new architecture
  - [ ] Update `isCacheStale()` to account for per-folder description file mtimes.
  - [ ] Rebuild the centralized cache when a source folder file becomes newer than the aggregate.
- [ ] TASK-020: Protect backward compatibility when no per-folder files exist
  - [ ] Preserve current behavior for repositories that still rely only on `spec.md`.
  - [ ] Avoid breaking mixed-mode environments during rollout.
- [ ] TASK-021: Add integration coverage for mixed per-folder and legacy discovery
  - [ ] Test scenarios where some folders contain `description.json` and others do not.
  - [ ] Verify aggregation remains correct across both data sources.

### Phase 5: Documentation & Testing Playbook

- [x] TASK-022: Update the feature catalog documentation for the refactored description system
  - [x] Revise `04-spec-folder-description-discovery.md` with the per-folder architecture flow.
  - [x] Update the source file inventory and uniqueness behavior notes.
- [x] TASK-023: Expand the testing playbook for the new description workflow
  - [x] Add scenarios for per-folder generation, stale detection, and aggregation behavior.
  - [x] Document rapid-save uniqueness verification steps.
- [ ] TASK-024: Extend integration tests to cover the new description system behavior
  - [ ] Update `folder-discovery-integration.vitest.ts` with per-folder description scenarios.
  - [ ] Add coverage for backward-compatible mixed-mode discovery.
- [ ] TASK-025: Run regression verification for the full description system refactor
  - [ ] Ensure all existing relevant tests pass without regressions.
  - [ ] Confirm the final documentation and test suite reflect the implemented behavior.

<!-- AUDIT-2026-03-08: Reconciled tasks.md with checklist.md. Phase 1 tasks (TASK-001 to TASK-005) marked done based on checked CHK-010, CHK-012, CHK-014, CHK-016, CHK-017, CHK-018, CHK-020, CHK-021, CHK-023. Phase 2 tasks (TASK-006 to TASK-009) marked done based on CHK-012 (create.sh integration verified). TASK-010 left open (integration coverage not in checklist). Phase 3 left open (CHK-011, CHK-015, CHK-022, CHK-026 all unchecked). Phase 4 left open (CHK-013, CHK-025 unchecked). Phase 5: TASK-022/023 marked done (CHK-040, CHK-041 checked); TASK-024/025 left open (CHK-024, CHK-028, CHK-029 unchecked). -->

<!-- /ANCHOR:tasks -->
