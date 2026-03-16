---
title: "Multi-CLI Parity Fixes"
description: "Fix cross-CLI gaps where existing pipeline phases have implicit Claude Code assumptions that degrade results for Copilot, Codex, and Gemini sessions."
trigger_phrases: ["multi-cli parity", "copilot tool names", "cli noise patterns", "tool name aliases"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Multi-CLI Parity Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Parent** | 010-perfect-session-capturing |
| **R-Item** | R-16 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Cross-phase review of the session-capture pipeline found 4 actionable gaps where existing phases have implicit Claude Code tool-name and artifact assumptions that degrade results for Copilot, Codex, and Gemini sessions:

1. **Phase 007 — Tool Name Mismatch**: `RESEARCH_TOOLS` and `IMPLEMENTATION_TOOLS` in `phase-classifier.ts` use Claude Code tool names. Copilot emits `'view'` instead of `'read'`, causing research sessions to be misclassified as "Discussion".
2. **Phase 002 — Noise Patterns Claude Code-Centric**: `NOISE_PATTERNS` in `content-filter.ts` only cover Claude Code artifacts. Other CLIs' prompt artifacts pass through unfiltered.
3. **Phase 006 — Missing `_provenance` on CLI Files**: `transformOpencodeCapture()` in `input-normalizer.ts` doesn't set `_provenance` on FILES extracted from CLI tool calls. Quality scorer gives these lowest trust weight.
4. **Normalizer — Missing `'view'` Tool Title**: `buildToolObservationTitle()` switch statement doesn't handle Copilot's `'view'` tool name.

### Purpose

Ensure the session-capture pipeline classifies, filters, and scores sessions from all 5 supported CLIs with equal fidelity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add tool name alias mapping in `phase-classifier.ts` for cross-CLI tool name normalization
- Add CLI-agnostic noise patterns in `content-filter.ts` for Codex, Copilot, and generic XML wrapper tags
- Set `_provenance: 'tool'` on files built from CLI tool calls in `input-normalizer.ts`
- Add `case 'view':` to `buildToolObservationTitle()` in `input-normalizer.ts`

### Out Of Scope

- Adding new CLI backends
- Changing the native capture contract
- Modifying test fixtures for non-regression scenarios

### Files Changed

| Path | Change Type | Purpose |
|------|-------------|---------|
| `scripts/utils/phase-classifier.ts` | Modify | Add TOOL_NAME_ALIASES map, apply in buildExchangeSignals() |
| `scripts/lib/content-filter.ts` | Modify | Add CLI-agnostic noise patterns |
| `scripts/utils/input-normalizer.ts` | Modify | Set _provenance on CLI files, add 'view' tool title |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Tool name aliases normalize cross-CLI names before classification | Copilot `'view'` tool names are mapped to `'read'` before phase scoring |
| REQ-002 | CLI-agnostic noise patterns filter non-Claude artifacts | Generic XML wrapper tags, Copilot lifecycle events, and Codex reasoning markers are caught |
| REQ-003 | Files from CLI tool calls carry provenance metadata | All FILES built in `transformOpencodeCapture()` have `_provenance: 'tool'` |
| REQ-004 | Copilot `'view'` tool generates proper observation title | `buildToolObservationTitle()` returns "Read {path}" for `'view'` tool calls |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-005 | Existing test suites pass without regression | All 6 targeted test suites + extractors-loaders baseline pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `tsc --noEmit` passes with zero errors
- `npm run build` passes
- `phase-classification.vitest.ts` — Copilot tool names classify correctly as Research
- `task-enrichment.vitest.ts` — contamination audit still passes
- `runtime-memory-inputs.vitest.ts` — provenance tests pass
- `description-enrichment.vitest.ts` — trust multiplier with 'tool' provenance works
- `test-extractors-loaders.js` — baseline regression passes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Alias map may miss future CLI tool names | Low | Map is additive; new CLIs can extend without breaking existing mappings |
| Risk | Generic XML noise pattern may over-match valid content | Low | Pattern only matches empty single-line tags |
| Dependency | Phase 007 (phase-classification) | Completed | Tool name normalization builds on existing scoring infrastructure |
| Dependency | Phase 002 (contamination-detection) | Completed | Noise patterns extend the existing content-filter pipeline |
| Dependency | Phase 003 (data-fidelity) | Completed | Provenance field already defined in FileEntry type |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions — all 4 gaps are well-defined and the fixes are additive.
<!-- /ANCHOR:questions -->

---

## 8. COMPLEXITY ASSESSMENT

| Dimension | Notes |
|-----------|-------|
| Scope | 3 files, 4 targeted changes |
| Risk | Low — additive changes, no contract modifications |
| Coordination | Single-phase, no cross-team dependency |
| Level | Level 2 — targeted code + verification |
