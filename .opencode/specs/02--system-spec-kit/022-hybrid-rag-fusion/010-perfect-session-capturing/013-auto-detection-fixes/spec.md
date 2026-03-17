---
title: "Feature Specification: Auto-Detection Fixes"
---
# Feature Specification: Auto-Detection Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [010-perfect-session-capturing](../spec.md) |
| **R-Item** | R-13 |
| **Sequence** | A0.6-A0.8, B9 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Multiple compound failures in auto-detection and memory quality:

1. **Folder detection cascade is depth-biased** -- children at depth 4 outrank parents at depth 3. For example, `019-feature-flag-reference` (idVector `[19,19]`) beats `019-manual-testing-per-playbook` (depth 3) because `assessAutoDetectConfidence` returns "clear ranked winner" when idVectors differ between children, even though the parent folder has 24 untracked files directly relevant to it.
2. **Decision deduplication bug** -- `input-normalizer.ts:415-449` writes the same decisions to both `observations[]` AND `_manualDecisions[]`. Then `decision-extractor.ts:440` concatenates both arrays unguarded, producing `4+4=8` duplicate decisions instead of 4.
3. **`key_files` always empty** -- tree-thinning uses `f.DESCRIPTION` (1-3 tokens) as content input, causing all files to merge into a single cluster. Synthetic entries are then filtered, leaving `key_files` empty even when real spec files exist.
4. **Blocker extraction bug** -- truncated observation text containing markdown headers is parsed as blocker content, producing blockers like `"## 3. SCOPE"` or `"' to '"` instead of meaningful blocker descriptions.

### Purpose

Fix the detection cascade with git-status signals and parent-affinity boosts, eliminate decision deduplication, provide a filesystem fallback for `key_files` when tree-thinning produces empty results, add blocker extraction validation, and wire remaining template fields (`memory_classification`, `session_dedup`, `causal_links`) into the workflow output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add git-status Priority 2.7 signal to folder detection using `git status --porcelain` filtered to spec paths
- Add parent-folder affinity boost when parent has >3 children with recent mtime
- Fix decision deduplication: suppress observation-type decisions when `_manualDecisions` exists (2-line fix at `decision-extractor.ts:260-261`)
- Fix `key_files` root cause: use actual file content for tree-thinning instead of `f.DESCRIPTION`; add filesystem fallback listing `*.md/*.json` from spec folder when post-thinning is empty
- Create `SessionActivitySignal` interface and `buildSessionActivitySignal()` function for Priority 3.5 signal
- Add blocker extraction validation: reject strings matching markdown headers, code fragments, and section numbering patterns
- Wire `memory_classification`, `session_dedup`, `causal_links` from extractors into the template output

### Out of Scope

- Rewriting the entire folder detection algorithm -- only adding new signals and boosts to the existing cascade
- Changing the auto-detection confidence threshold -- only improving signal quality
- Modifying the decision extractor's core extraction logic -- only fixing the deduplication at the concatenation boundary

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/spec-folder/folder-detector.ts` | Modify | Add git-status Priority 2.7 signal; add parent-folder affinity boost when parent has >3 recently-modified children |
| `scripts/extractors/decision-extractor.ts` | Modify | Suppress observation-type decisions when `_manualDecisions` exists (lines 260-261): set `decisionObservations = []` when `processedManualDecisions.length > 0` |
| `scripts/core/workflow.ts` | Modify | Fix tree-thinning input to use file content not `f.DESCRIPTION`; add `key_files` filesystem fallback; wire `memory_classification`, `session_dedup`, `causal_links` |
| `scripts/extractors/session-extractor.ts` | Modify | Add blocker content validation -- reject strings matching `/^##\s\|^['"` ]\|'\s+to\s+'/` in `extractBlockers()` |
| `scripts/extractors/session-activity-signal.ts` | Create | `SessionActivitySignal` interface + `buildSessionActivitySignal()` aggregating tool call paths, git changes, transcript mentions with confidence boosts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Git-status Priority 2.7 signal: `git status --porcelain` filtered to spec paths, ranked by file count, inserted between Priority 2.5 and Priority 3 (~50 lines in `folder-detector.ts`) | Parent folder with 24 untracked spec files receives highest git-status score and is auto-detected correctly over child folders |
| REQ-002 | Decision dedup fix: when `processedManualDecisions.length > 0`, set `decisionObservations = []` at `decision-extractor.ts:260-261` | 4 manual decisions produce exactly 4 decision records in rendered output, not 8 |
| REQ-003 | `key_files` fix: use actual file content for tree-thinning instead of `f.DESCRIPTION`; add filesystem fallback listing `*.md/*.json` from spec folder when post-thinning is empty | `key_files` populated for spec folders that contain actual files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Session activity signal Priority 3.5: `SessionActivitySignal` interface aggregating tool call paths, git changes, transcript mentions. Confidence boosts: `0.1/mention`, `0.2/Read`, `0.3/Edit\|Write`, `0.25/git-changed-file` | Activity signal produces measurable confidence boost for folders with high session activity |
| REQ-005 | Parent-folder affinity boost: when parent has >3 children with recent mtime, boost parent's effective depth to match children | Parent folder with 4+ recently-modified children is ranked at equivalent depth to its children |
| REQ-006 | Blocker extraction validation: reject strings matching `/^##\s\|^['"` ]\|'\s+to\s+'/` in `extractBlockers()` | Blocker field contains meaningful blocker text; markdown fragments like `"## 3. SCOPE"` are rejected |
| REQ-007 | Template-to-workflow field contract: wire `memory_classification`, `session_dedup`, `causal_links` from extractors into template output | Rendered memory output includes all three fields when extractors produce them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parent folder with 24 untracked files is auto-detected correctly over child folders that happen to have matching idVector components
- **SC-002**: 4 manual decisions produce exactly 4 decision records in rendered output, not 8
- **SC-003**: `key_files` is populated for spec folders that contain actual markdown and JSON files
- **SC-004**: Blocker field contains meaningful blocker text, not markdown fragment artifacts like section headers or quote delimiters
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-11 (session source validation) | Medium | R-11 should land first for transcript integrity; detection fixes can proceed independently but benefit from clean transcript input |
| Risk | Git-status signal adds shell execution to detection hot path | Medium | Cache `git status` output per detection run; filter to spec paths only to minimize output size |
| Risk | Parent-affinity boost may over-promote parents in shallow trees | Low | Boost only activates when parent has >3 children with recent mtime, preventing false promotion in sparse hierarchies |
| Risk | Blocker validation regex may reject legitimate blocker text containing quotes | Low | Regex targets specific patterns (leading `##`, leading quotes, `' to '` transitions) that are structural artifacts, not natural language |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Decision dedup: (A) suppress observation decisions when manual exists (2-line fix), (B) dedup at merge by title/hash, (C) fix dual-write at source in input-normalizer? Option A chosen but masks root cause.
- **OQ-002**: Tree-thinning input: fix at source (read actual file content) or add fallback (filesystem listing when key_files empty)? Both chosen.
<!-- /ANCHOR:questions -->
