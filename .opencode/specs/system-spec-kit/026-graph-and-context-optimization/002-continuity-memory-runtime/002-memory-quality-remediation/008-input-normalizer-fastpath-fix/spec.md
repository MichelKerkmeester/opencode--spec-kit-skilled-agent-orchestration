---
title: "Feature Specification: Input Normalizer Fast-Path Fix [system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/008-input-normalizer-fastpath-fix/spec]"
description: "Fix the fast-path normalizer so JSON-mode memory saves accept string arrays for user prompts, observations, and recent context without aborting sufficiency checks."
trigger_phrases:
  - "input normalizer fast-path fix"
  - "memory save string coercion"
  - "003 phase 8"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/008-input-normalizer-fastpath-fix"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]

---
# Feature Specification: Input Normalizer Fast-Path Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 8** of `003-memory-quality-remediation`.

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-skill-catalog-sync |
| **Successor** | 009-post-save-render-fixes |
| **Handoff Criteria** | Fast-path JSON saves accept plain-string arrays, mixed enrichment payloads stay intact, and the repro save completes successfully. |

**Scope Boundary**: Limit the fix to `scripts/utils/input-normalizer.ts`, `scripts/memory/generate-context.ts`, focused tests, and this new Level-1 phase packet. Do not modify any existing packet docs or prior memory files.

**Source Inputs**:
- Diagnostic report: original B4 diagnostic report captured during the implementation pass
- Reproduction payload: `/tmp/save-context-data.json`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-08 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `003-memory-quality-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`generate-context.js` aborts with `INSUFFICIENT_CONTEXT_ABORT` when structured JSON callers send plain-string arrays for `user_prompts`, `observations`, or `recent_context`. The fast-path in `normalizeInputData()` assumes those arrays already contain structured objects, so downstream rendering collapses them into empty evidence and the save fails. In the same fast-path branch, documented enrichment fields like `sessionSummary`, `toolCalls`, and `exchanges` were being dropped instead of merged.

### Purpose
Make JSON-mode memory saves resilient to the documented string-array shape, preserve slow-path enrichments in fast-path mode, and keep the CLI help text aligned with the real `--session-id` behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coerce fast-path string arrays for `user_prompts`, `observations`, and `recent_context` into structured objects.
- Merge slow-path enrichment fields into fast-path normalization when mixed payloads are provided.
- Correct the `--session-id` help text in `generate-context.ts`.
- Add focused unit coverage and rerun the requested build and regression commands.
- Record the fix in this new Level-1 child phase.

### Out of Scope
- Refactoring unrelated memory-save workflow logic.
- Editing parent or sibling phase docs.
- Modifying existing memory files under `003-memory-quality-remediation/memory/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Add fast-path string coercion and enrichment merge logic. |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Correct the `--session-id` help text. |
| `.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts` | Modify | Add focused regression coverage for coercion and mixed fast-path payloads. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/008-input-normalizer-fastpath-fix/*.md` | Create | Track the fix with a minimal Level-1 packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-801 | Fast-path string arrays must be coerced before returning normalized data. | A JSON payload with string `user_prompts`, `observations`, and `recent_context` produces structured `userPrompts`, `observations`, and `recentContext` entries. |
| REQ-802 | Mixed fast-path payloads must preserve slow-path enrichments. | `sessionSummary`, `keyDecisions`, `nextSteps`, `filesModified`, `toolCalls`, and `exchanges` remain visible in normalized output when `user_prompts` and related fast-path fields are present. |
| REQ-803 | The original failing save repro must complete successfully. | Running `node .../dist/memory/generate-context.js /tmp/save-context-data.json system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation` exits 0 and writes a new memory file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-804 | CLI help text must describe the real `--session-id` behavior. | `--help` output says the session ID is attached to saved memory metadata, not used for transcript selection. |
| REQ-805 | Existing memory-quality behavior must stay green. | `npm run build`, the requested memory-quality Vitest suite, and direct `input-normalizer` tests all pass at or above the prior baseline. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-801**: The failing `/tmp/save-context-data.json` save succeeds without `INSUFFICIENT_CONTEXT_ABORT`.
- **SC-802**: The new memory file reflects the current JSON payload rather than stale session content.
- **SC-803**: The requested regression suite remains at `35 passed`, `10 skipped`, `0 failed`.
- **SC-804**: Focused unit coverage proves the fast-path coercion and mixed-enrichment behavior.
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

**Given** a structured JSON payload sends `user_prompts`, `observations`, and `recent_context` as plain strings, **when** `normalizeInputData()` runs through the fast path, **then** it emits structured prompt, observation, and recent-context objects instead of empty downstream evidence.

**Given** a mixed payload includes fast-path arrays plus `sessionSummary`, `keyDecisions`, `nextSteps`, `filesModified`, `toolCalls`, and `exchanges`, **when** the save workflow normalizes the input, **then** those enrichments remain visible in the normalized output and the memory save still completes.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/tmp/save-context-data.json` repro payload | Required to prove the original failure is fixed | Run the exact structured-save command after rebuild and inspect the created memory file |
| Risk | Fast-path patch changes object-shaped callers | Could regress current JSON-mode saves | Limit coercion to `typeof entry === "string"` and keep object entries unchanged |
| Risk | Mixed enrichment merge duplicates evidence | Could add noisy observations or prompts | Reuse existing builders and dedupe observations by narrative while deduping promoted prompts by prompt text |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The diagnostic report and repro payload were sufficient to implement and verify the fix.
<!-- /ANCHOR:questions -->
