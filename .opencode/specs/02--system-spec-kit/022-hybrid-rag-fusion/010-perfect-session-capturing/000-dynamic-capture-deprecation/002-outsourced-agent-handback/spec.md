---
title: "Outsourced Agent Handback Protocol"
description: "External CLI handback protocol for session memory saves: hard-fail JSON input, next-step persistence, redact-and-scrub security, and post-010 awareness of sufficiency/contamination gates."
trigger_phrases: ["outsourced agent memory", "cli agent context", "memory handback", "external agent save", "generate-context json"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Outsourced Agent Handback Protocol

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


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
| **Created** | 2026-03-11 |
| **Completed** | 2026-03-16 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 001-session-source-validation |
| **Successor** | 003-multi-cli-parity |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-15 |
| **Sequence** | B5 (after 011) |
| **Origin** | Evolved from `022-hybrid-rag-fusion/013-outsourced-agent-memory/` |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 15** of the Perfect Session Capturing specification.

**Scope Boundary**: When an external CLI (Codex, Copilot, Gemini, Claude Code) completes delegated work and returns session context, the data must flow through 010's generate-context.js pipeline to produce a memory file.
**Dependencies**: 014-spec-descriptions
**Deliverables**: Runtime hard-fail for explicit JSON-mode input errors; nextSteps/next_steps normalization through to NEXT_ACTION
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When an external CLI (Codex, Copilot, Gemini, Claude Code) completes delegated work and returns session context, the data must flow through 010's `generate-context.js` pipeline to produce a memory file. This pipeline has three layers that must agree:

1. **Runtime behavior**: How `data-loader.ts`, `input-normalizer.ts`, and `session-extractor.ts` handle explicit JSON-mode input
2. **CLI handback documentation**: What the 4 CLI skill docs and prompt templates tell the calling AI to produce
3. **Post-010 pipeline gates**: How the sufficiency, contamination, and quality gates affect file-backed saves *after* normalization succeeds

The original 013 spec addressed layers 1 and 2. This rewrite adds layer 3 awareness: since 010's phases shipped, the pipeline now has post-normalization gates that can reject outsourced saves even when the JSON input is valid and normalizes successfully.

### Purpose

Ensure the outsourced agent handback protocol produces saves that survive the full 010 pipeline as far as caller-provided evidence allows, covering not just input validation, but also sufficiency evaluation, contamination detection, and post-render quality scoring. Callers must know what minimum payload richness is required, what rejection codes they may encounter, and that file-backed saves bypass `QUALITY_GATE_ABORT` without bypassing all quality-related warnings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Runtime hard-fail for explicit JSON-mode input errors (`EXPLICIT_DATA_FILE_LOAD_FAILED`)
- `nextSteps`/`next_steps` normalization through to `NEXT_ACTION`
- Redact-and-scrub security guidance in all 4 CLI skill docs and prompt templates
- Documentation of post-010 pipeline gates affecting outsourced saves
- Snake_case field acceptance in the handback protocol

### Out of Scope

- Changing 010's sufficiency or contamination gate logic (those are parent-spec concerns)
- Adding new CLI backends
- Modifying native capture extractors (outsourced saves use JSON-mode, not native capture)

### Files to Change

| Path | Change Type | Purpose |
|------|-------------|---------|
| `scripts/loaders/data-loader.ts` | Modify | Hard-fail explicit dataFile errors (ENOENT, bad JSON, validation) without native capture fallback |
| `scripts/utils/input-normalizer.ts` | Modify | Accept `nextSteps`/`next_steps`, persist as `Next:`/`Follow-up:` facts |
| `scripts/extractors/session-extractor.ts` | Modify | `extractNextAction()` reads `Next:` facts into `NEXT_ACTION` |
| `scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Regression coverage for explicit failures and next-step persistence |
| `scripts/tests/outsourced-agent-handback-docs.vitest.ts` | Create | Guard the 8 handback docs and feature catalog against post-010 drift |
| `.opencode/skill/cli-codex/SKILL.md` | Modify | Memory Handback Protocol with redact-and-scrub guidance |
| `.opencode/skill/cli-copilot/SKILL.md` | Modify | Same |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | Same |
| `.opencode/skill/cli-claude-code/SKILL.md` | Modify | Same |
| 4 prompt_templates.md files | Modify | `MEMORY_HANDBACK_START`/`END` delimiters and extraction guidance |
| `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` | Modify | Align the catalog entry to phase `015` and the post-010 gate contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Explicit JSON-mode input failures hard-fail | Missing file → `EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found`; bad JSON → `...Invalid JSON`; validation failure → `...Failed to load`. No fallback to native capture. |
| REQ-002 | `nextSteps` and `next_steps` both accepted and persisted | First → `Next: ...` fact, rest → `Follow-up: ...` facts; both drive `NEXT_ACTION` via `extractNextAction()` |
| REQ-003 | All 8 CLI docs describe the handback protocol with redact-and-scrub | 4 SKILL.md + 4 prompt templates contain identical 7-step flow with `MEMORY_HANDBACK_START`/`END` delimiters |
| REQ-004 | Verification evidence is repo-verifiable | No overstatement of live round-trip completion; cites reproducible commands |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-005 | Snake_case JSON fields accepted alongside camelCase | `user_prompts`, `recent_context`, `trigger_phrases`, `session_summary`, `spec_folder`, `key_decisions`, `files_modified`, `importance_tier` all normalize correctly |
| REQ-006 | Callers aware that thin payloads are rejected by sufficiency gate | CLI docs and spec document that `INSUFFICIENT_CONTEXT_ABORT` can fire on valid-but-thin JSON input |
| REQ-007 | Callers aware that cross-spec content triggers contamination gate | CLI docs and spec document that `CONTAMINATION_GATE_ABORT` fires when handback JSON contains content about a different spec folder |
| REQ-008 | Enriched FILE metadata recommended for quality | Handback protocol recommends `ACTION`, `MODIFICATION_MAGNITUDE`, descriptive `DESCRIPTION`, and `_provenance` fields on FILES entries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Explicit `dataFile` failures stop with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`
- Both `nextSteps` and `next_steps` persist into `Next: ...`, `Follow-up: ...`, and `NEXT_ACTION`
- All 8 CLI docs tell caller to redact and scrub before writing `/tmp/save-context-data.json`
- All 8 CLI docs and the feature catalog document `INSUFFICIENT_CONTEXT_ABORT`, `CONTAMINATION_GATE_ABORT`, and richer `FILES` metadata guidance
- A representative manual-format JSON handback writes successfully and produces a fresh memory file for phase `015`
- Thin snake_case JSON payloads fail with `INSUFFICIENT_CONTEXT_ABORT` before file write
- The targeted verification lane passes with `2` files and `32` tests
- Alignment drift passes with `246` scanned files (as of 2026-03-17) and `0` findings
- Spec validation returns zero errors and zero warnings after the phase artifacts are reconciled

### Acceptance Scenarios

1. **Given** an explicit JSON path that does not exist, **when** `generate-context.js` loads the handback payload, **then** it stops with `EXPLICIT_DATA_FILE_LOAD_FAILED` and does not fall back to native capture.
2. **Given** a handback payload that uses `next_steps`, **when** normalization runs, **then** the first item becomes `Next: ...`, later items become `Follow-up: ...`, and `NEXT_ACTION` reflects the first item.
3. **Given** a valid-but-thin handback payload, **when** post-normalization sufficiency runs, **then** the save aborts with `INSUFFICIENT_CONTEXT_ABORT` before any new memory file is written.
4. **Given** a handback payload that includes content from another spec, **when** post-render contamination checks run, **then** the save aborts with `CONTAMINATION_GATE_ABORT`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Thin outsourced payloads silently fail post-normalization | High | REQ-006 documents minimum payload richness; CLI docs warn about `INSUFFICIENT_CONTEXT_ABORT` |
| Risk | Cross-spec content in handback data causes save rejection | Medium | REQ-007 documents contamination gate; redact-and-scrub guidance includes spec-scope awareness |
| Risk | CLI skill docs diverge over time | Low | All 4 CLI docs use identical handback protocol section |
| Dependency | 010 Parent (sufficiency gate) | Shipped | `evaluateMemorySufficiency()` in `workflow.ts` runs on ALL saves including file-backed |
| Dependency | 010 Parent (contamination gate) | Shipped | `CONTAMINATION_GATE_ABORT` in `workflow.ts` runs on ALL saves |
| Dependency | 010 Parent (snake_case acceptance) | Shipped | `input-normalizer.ts` accepts all documented snake_case variants |
| Dependency | Phase 003 (Data Fidelity) | Shipped | `normalizeFileEntryLike()` preserves `ACTION`, `_provenance`, `_synthetic`, `MODIFICATION_MAGNITUDE` |
| Dependency | Phase 011 (Session Source Validation) | Shipped | `data-loader.ts` entry point. 015's hard-fail executes before any capture attempt. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The targeted handback verification lane should stay lightweight enough to run in under a second on local reruns.
- **NFR-P02**: Handback docs should describe richer payloads without requiring callers to serialize the entire session transcript.

### Security
- **NFR-S01**: Caller-facing docs must keep redact-and-scrub guidance explicit before `/tmp/save-context-data.json` is written.
- **NFR-S02**: The handback protocol must not imply fallback to native capture when the explicit JSON path fails to load.

### Reliability
- **NFR-R01**: All 8 CLI handback docs and the feature catalog must stay aligned on rejection codes and minimum payload guidance.
- **NFR-R02**: File-backed handbacks must continue to document the distinction between `QUALITY_GATE_ABORT` and non-blocking `QUALITY_GATE_FAIL`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

### Data Boundaries
- Empty or missing explicit JSON file: hard-fail with `EXPLICIT_DATA_FILE_LOAD_FAILED`.
- Thin handback payload: abort with `INSUFFICIENT_CONTEXT_ABORT` before file write.
- Cross-spec payload: abort with `CONTAMINATION_GATE_ABORT` before persistence.

### Error Scenarios
- Valid JSON with low rendered quality: the save can still write successfully while logging `QUALITY_GATE_FAIL` and skipping production indexing.
- Payloads that already use `user_prompts`, `recent_context`, or `observations`: callers must provide equivalent durable evidence because the manual-format synthesis path is shorter.
- Legacy caller docs drifting away from the runtime: the dedicated doc Vitest lane blocks silent wording regressions.

### State Transitions
- `nextSteps` / `next_steps` normalization: first item becomes `Next: ...`, remaining items become `Follow-up: ...`, and `NEXT_ACTION` mirrors the first item.
- File-backed handback save flow:
  1. Extract `MEMORY_HANDBACK`, redact and scrub, then write `/tmp/save-context-data.json`.
  2. `data-loader.ts` validates the explicit JSON and hard-fails on missing or malformed input.
  3. `input-normalizer.ts` normalizes snake_case fields and persists next-step facts.
  4. `session-extractor.ts` derives `NEXT_ACTION`, then `workflow.ts` applies sufficiency, contamination, and render-quality checks before write/index behavior is finalized.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Touches runtime docs, feature catalog, a new doc-regression test, and five canonical phase artifacts |
| Risk | 14/25 | Incorrect wording here would mislead every outsourced handback caller about save behavior and rejection handling |
| Research | 9/20 | Required review of parent `010`, prior phases `001`-`012`, and the existing caller-facing handback docs |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

- **Q1**: Should explicit JSON errors fall back to native capture? **NO**. Hard-fail only.
- **Q2**: Should `nextSteps` or `next_steps` take priority? **`nextSteps` (camelCase) takes priority** when both present.
- **Q3**: Should `QUALITY_GATE_ABORT` apply to file-backed saves? **NO**. `workflow.ts` line 1656 exempts `_source === 'file'`.

### Known Limitations

- **L1**: File-backed saves bypass `QUALITY_GATE_ABORT`, but the workflow still records non-blocking `QUALITY_GATE_FAIL` warnings and may skip production indexing when rendered validation rules fail.
- **L2**: Native capture mode for external CLIs (when CLI runs in the same workspace) is an alternative path not covered by this protocol. The handback protocol only covers the JSON-mode path.
- **L3**: Payloads that already use `user_prompts`, `recent_context`, or `observations` bypass parts of the manual-format synthesis path, so callers should provide equivalent durable evidence rather than relying on a single summary string.
<!-- /ANCHOR:questions -->
