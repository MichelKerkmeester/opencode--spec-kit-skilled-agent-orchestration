---
title: "Feature Specification: Outsourced Agent Memory Capture"
description: "Reconcile the outsourced-agent memory workflow so repository-side runtime behavior, CLI handback documentation, and spec evidence all agree on explicit JSON-mode failure handling, next-step persistence, and honest verification status."
trigger_phrases: ["outsourced agent memory", "cli agent context", "memory handback", "external agent save"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Outsourced Agent Memory Capture
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
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The outsourced-agent memory flow had drift between the implemented runtime, the CLI handback docs, and this spec folder. Repository code now hard-fails explicit JSON-mode input errors, preserves next-step data for manual and mixed structured payloads, and documents a redact-and-scrub handback flow, but the spec docs still contained stale claims about dropped `Next Steps`, a completed 1032-line round-trip artifact, and the old `.opencode/skill/sk-cli/` path layout.

### Purpose
Keep the spec folder aligned with the implemented repository state so the documented protocol, runtime guarantees, security guidance, and verification evidence all match what can actually be verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Runtime behavior now enforced in `data-loader.ts`, `input-normalizer.ts`, and `session-extractor.ts`
- Regression coverage in `runtime-memory-inputs.vitest.ts`
- CLI handback documentation in all 4 `cli-*` skills and all 4 prompt template files
- Spec-folder evidence reconciliation for this Level 2 documentation set

### Out of Scope
- Changes to external CLI binaries such as Codex, Copilot, Gemini, or Claude Code
- Manual editing of `memory/` artifacts
- Claiming a fresh live outsourced CLI dispatch passed unless it is rerun and verified

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` | Modify | Hard-fail explicit `dataFile` load and parse failures with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` and stop fallback |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Accept `nextSteps` and `next_steps`, preserve mixed structured payload next steps when `Next:` / `Follow-up:` facts are missing, and store remaining items as `Follow-up: ...` |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modify | Read the first persisted `Next: ...` fact into `NEXT_ACTION` |
| `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Cover explicit JSON-mode failures and next-step normalization |
| `.opencode/skill/cli-codex/SKILL.md` | Modify | Document redact-and-scrub handback flow and explicit JSON-mode hard-fail behavior |
| `.opencode/skill/cli-codex/assets/prompt_templates.md` | Modify | Add matching memory epilogue guidance and corrected numbering |
| `.opencode/skill/cli-copilot/SKILL.md` | Modify | Document redact-and-scrub handback flow and explicit JSON-mode hard-fail behavior |
| `.opencode/skill/cli-copilot/assets/prompt_templates.md` | Modify | Add matching memory epilogue guidance |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | Document redact-and-scrub handback flow and explicit JSON-mode hard-fail behavior |
| `.opencode/skill/cli-gemini/assets/prompt_templates.md` | Modify | Add matching memory epilogue guidance |
| `.opencode/skill/cli-claude-code/SKILL.md` | Modify | Document redact-and-scrub handback flow and explicit JSON-mode hard-fail behavior |
| `.opencode/skill/cli-claude-code/assets/prompt_templates.md` | Modify | Add matching memory epilogue guidance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Explicit JSON-mode input failures must hard-fail | Missing file, invalid JSON, or validation failure from an explicit `dataFile` throw `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` and do not fall back to OpenCode capture |
| REQ-002 | Manual and mixed structured next-step fields must survive normalization | `nextSteps` and `next_steps` are both accepted; the first entry persists as `Next: ...` and drives `NEXT_ACTION`; remaining entries persist as `Follow-up: ...`; structured payloads with existing `observations`/`userPrompts`/`recentContext` also preserve next-step facts when missing |
| REQ-003 | All 8 relevant CLI docs must describe the corrected handback flow | Each `cli-*` SKILL and prompt template includes redact-and-scrub guidance, accepted next-step field names, and explicit JSON-mode hard-fail behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Verification evidence must stay repo-verifiable and current | The spec folder cites reproducible current-repo checks and marks unrerun checks as deferred or unverified instead of asserting historical numeric passes |
| REQ-005 | Spec docs must not overstate live round-trip completion | No spec artifact claims an unverifiable 1032-line memory file or marks live outsourced CLI dispatch complete without current proof |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Explicit `dataFile` failures stop with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` instead of falling back to OpenCode capture.
- **SC-002**: `nextSteps` and `next_steps` persist into `Next: ...`, `Follow-up: ...`, and `NEXT_ACTION`, including mixed structured payload inputs when those facts are absent.
- **SC-003**: All 8 relevant `cli-*` docs tell the caller to redact and scrub payloads before writing `/tmp/save-context-data.json`.
- **SC-004**: This spec folder no longer claims the unverifiable 1032-line artifact or a completed live outsourced CLI dispatch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` | Governs explicit JSON-mode failure behavior | Keep docs tied to the current thrown `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` contract |
| Dependency | `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` and `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Governs `nextSteps` / `next_steps` persistence and `NEXT_ACTION` extraction | Verify docs against the current normalization and extraction logic |
| Dependency | 4 `cli-*` skills and 4 prompt templates | Handback protocol guidance must stay consistent across all entry points | Reconcile wording across all 8 docs and use the real `.opencode/skill/cli-*` layout |
| Risk | Live outsourced CLI dispatch is not rerun during this reconciliation | Claiming it passed would overstate completion | Keep live dispatch marked deferred until it is rerun and saved as fresh evidence |
| Risk | Current repository state may drift outside this task's scope | Old verification claims can become stale | Record historical task evidence separately from current rerun results when needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Explicit JSON-mode validation should fail fast before any fallback work begins.
- **NFR-P02**: Next-step normalization should not add measurable overhead beyond the existing save path.

### Security
- **NFR-S01**: Calling agents must redact and scrub secrets, tokens, credentials, and unnecessary sensitive values before writing `/tmp/save-context-data.json`.
- **NFR-S02**: Spec docs must describe the scrub step consistently anywhere the memory handback payload is documented.

### Reliability
- **NFR-R01**: Explicit `dataFile` failures are deterministic and stop the save flow with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`.
- **NFR-R02**: Both `nextSteps` and `next_steps` inputs produce the same persisted next-action behavior for manual and mixed structured payload paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing explicit data file: fail immediately with `EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: ...`.
- Invalid explicit JSON payload: fail immediately with `EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file ...`.
- Mixed next-step field naming: normalize either `nextSteps` or `next_steps` into the same persisted facts.
- Mixed structured payload input with `next_steps`: append `Next: ...` / `Follow-up: ...` only when those facts are not already present.

### Error Scenarios
- Explicit data file fails validation: surface `EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file ...`; do not fall back to OpenCode capture.
- Handback payload contains sensitive values: caller must scrub before writing JSON.
- Live outsourced CLI dispatch not rerun: document deferral instead of treating old artifacts as current proof.

### State Transitions
- First next step present: persist it as `Next: ...` and expose it through `NEXT_ACTION`.
- Additional next steps present: persist them as `Follow-up: ...` facts.
- Structured payload already containing `Next: ...` or `Follow-up: ...` facts: keep existing facts and avoid duplication.
- No next steps present: preserve summary and continue without a derived next-action fact.

### Acceptance Scenarios
- **Given** an explicit `dataFile` path that does not exist, **when** the loader reads it, **then** the save flow stops with `EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: ...` and does not fall back.
- **Given** an explicit `dataFile` containing invalid JSON, **when** the loader parses it, **then** the save flow stops with `EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file ...`.
- **Given** an explicit `dataFile` with an invalid shape, **when** validation runs, **then** the save flow stops with `EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file ...`.
- **Given** manual save input using either `nextSteps` or `next_steps`, **when** normalization runs, **then** the first item becomes `NEXT_ACTION` and later items persist as follow-up facts.
- **Given** mixed structured input containing `observations`, `userPrompts`, and `recentContext` plus `next_steps`, **when** normalization runs, **then** missing `Next:` / `Follow-up:` facts are added and `NEXT_ACTION` resolves from the first next step without duplicating existing facts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Runtime TypeScript, regression tests, 8 CLI docs, and 5 spec artifacts must stay aligned |
| Risk | 11/25 | Memory-save behavior and verification claims can mislead future sessions if they drift |
| Research | 9/20 | Existing repo state and prior task evidence had to be reconciled without inventing proof |
| **Total** | **34/70** | **Level 2 appropriate** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- No open implementation blockers. Follow-up only: rerun a fresh live outsourced CLI dispatch if new end-to-end acceptance evidence is required.
<!-- /ANCHOR:questions -->
