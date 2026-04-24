---
title: "...aph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/005-description-regen-contract/spec]"
description: "Formalize field-level merge policy for description.json regeneration per 019/001/004 research. Introduce shared schema around FolderDescription/PerFolderDescription, unify schema-valid and 018 R4 merge-preserving lanes, preserve unknown non-reserved keys as explicit passthrough."
trigger_phrases:
  - "description regen contract"
  - "field level merge policy"
  - "description json preservation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/005-description-regen-contract"
    last_updated_at: "2026-04-18T23:47:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Remediation child scaffolded from 019/001/004 research"
    next_safe_action: "Dispatch implementation"
    blockers: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Description Regen Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Research** | ../../research/019-system-hardening-pt-01/research.md |
| **Priority** | P1 |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Spec Ready |
| **Effort Estimate** | 2-3 days |
| **Executor** | cli-codex gpt-5.4 high fast |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Research 019/001/004 found description.json preservation works today but by implicit mechanisms split across 2 lanes:
- `getDescriptionWritePayload()` in `folder-discovery.ts` merges existing data with canonical overrides (schema-valid path)
- 018 R4 `mergePreserveRepair()` helper handles schema-invalid-but-parseable files

The live tree (86 description.json, 28 rich files) does not show broad deletion of authored rich fields during ordinary regeneration. The defect is that preservation semantics are **real but under-specified**, duplicated, and partially accidental.

### Purpose

Formalize the field-level merge policy so:
- Canonical derived fields (specFolder, specId, folderSlug, parentChain, lastUpdated) always regenerate from structure/save-time context
- System tracking fields (memorySequence, memoryNameHistory) survive writes
- Known authored optional fields (title, type, trigger_phrases, path) are intentionally preserved
- Unknown non-reserved top-level keys pass through as explicit passthrough
- Both schema-valid and 018 R4 lanes route through one merge helper
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Introduce shared description.json schema around existing `FolderDescription`, `PerFolderDescription`, `LoadResult` surfaces
- Unify schema-valid + 018 R4 merge-preserving lanes through one merge helper
- Implement field-level merge policy with explicit classification:
  - `canonical_derived`: always regenerated (specFolder, specId, folderSlug, parentChain, lastUpdated)
  - `canonical_authored`: regenerated from canonical inputs (description, keywords)
  - `tracking`: preserved but system-owned (memorySequence, memoryNameHistory)
  - `known_authored_optional`: preserved via explicit allowlist (title, type, trigger_phrases, path)
  - `unknown_passthrough`: preserved if non-reserved top-level key
- Add validation fixture: regen preserves all 4 known authored fields + any unknown keys on rich sample
- Update tests to assert field-level merge contract

### 3.2 Out of Scope

- Schema-versioned authored layer (heavier redesign, not justified by evidence)
- Hash-based change detection (research ranked it 2nd, not needed)
- Opt-in regen flag (research ranked it 3rd, caller-remembering brittleness)
- 007/008/009/010 root-doc remediation (belongs to 019/002)

### 3.3 Files to Change

- `mcp_server/lib/search/folder-discovery.ts` — `getDescriptionWritePayload()` refactor
- `mcp_server/lib/description/description-schema.ts` (NEW) — shared schema
- `mcp_server/lib/description/description-merge.ts` (NEW) — unified merge helper
- `mcp_server/lib/description/repair.ts` — route 018 R4 `mergePreserveRepair()` through new merge
- Tests + fixtures
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **REQ-FUNC-001**: Shared description schema formalizes the 5 field classes
- **REQ-FUNC-002**: Unified merge helper handles both schema-valid and schema-invalid-parseable paths
- **REQ-FUNC-003**: Regen preserves `title`, `type`, `trigger_phrases`, and `path` on all existing rich files
- **REQ-FUNC-004**: Unknown non-reserved keys pass through

### 4.2 P1 - Required

- **REQ-FUNC-005**: Regression tests cover all 5 field classes
- **REQ-DATA-006**: No deletion of authored fields on the 28 rich-sample description.json files
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Run regen on all 28 rich description.json files, verify no field loss
- [ ] Shared schema importable from both lanes
- [ ] Unified merge helper passes schema-valid + schema-invalid-parseable test cases
- [ ] Unknown key passthrough verified with synthetic fixture

### 5.1 Acceptance Scenarios

- **Given** a schema-valid `description.json` containing authored optional fields, **when** regen runs, **then** canonical fields refresh and `title`, `type`, `trigger_phrases`, and `path` remain intact.
- **Given** a schema-invalid but parseable `description.json`, **when** repair regeneration runs, **then** the same merge policy preserves allowed authored fields and tracking state.
- **Given** a `description.json` containing unknown non-reserved top-level keys, **when** regen runs, **then** those keys pass through unchanged.
- **Given** a canonical authored field such as `description` or `keywords`, **when** canonical inputs change, **then** the regenerated output reflects the new canonical values.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Schema refactor breaks existing consumers | Strict type compatibility; add adapter if needed |
| Merge helper subtly changes tracking field semantics | Unit tests per field class |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should unknown-key passthrough have size cap (prevent pollution)?
- Should `description`/`keywords` regeneration trigger on every save or only on authored-source change?
<!-- /ANCHOR:questions -->
