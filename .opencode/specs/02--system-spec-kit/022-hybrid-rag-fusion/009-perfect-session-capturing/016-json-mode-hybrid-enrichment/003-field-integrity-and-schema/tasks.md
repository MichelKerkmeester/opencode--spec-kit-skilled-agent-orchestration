---
title: "Tasks: Field Integrity and Schema Validation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "field integrity tasks"
  - "schema validation tasks"
  - "filesModified fast-path task"
  - "unknown-field warning task"
  - "contextType validation task"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Field Integrity and Schema Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> **P0 — Fast-Path Data-Loss Fix**: Ensure `filesModified` is converted to `FILES` on the fast path, matching the slow-path behavior.

- [ ] T001 Read `input-normalizer.ts` lines 437-491 to understand fast-path field conversion block (`input-normalizer.ts`)
- [ ] T002 Read `input-normalizer.ts` lines 504-529 to understand slow-path `filesModified` -> `FILES` conversion (`input-normalizer.ts`)
- [ ] T003 Add `filesModified` -> `FILES` conversion inside the fast-path block, guarded with `Array.isArray(input.filesModified)` (`input-normalizer.ts:437-491`)
- [ ] T004 Handle empty `filesModified: []` case — must produce `FILES: []` not omit key (`input-normalizer.ts`)
- [ ] T005 Run `tsc --noEmit` — must exit 0; fix any type errors before proceeding
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **P1 — Schema Validation Hardening (input-normalizer.ts)**: Add unknown-field warnings, `contextType` enum guard, and string length limits.

- [ ] T006 Read `input-normalizer.ts` lines 621-703 (`validateInputData` function) in full (`input-normalizer.ts`)
- [ ] T007 Define `KNOWN_RAW_INPUT_FIELDS` constant array listing all valid `RawInputData` keys (`input-normalizer.ts`)
- [ ] T008 Add `Object.keys(input)` iteration after existing guards; emit `console.warn` for each key not in `KNOWN_RAW_INPUT_FIELDS` (`input-normalizer.ts:621-703`)
- [ ] T009 [P] Define `VALID_CONTEXT_TYPES` constant array from the `contextType` type definition (`input-normalizer.ts`)
- [ ] T010 [P] Add `contextType` enum check: if `input.contextType` is present and not in `VALID_CONTEXT_TYPES`, return validation error with field name and accepted values (`input-normalizer.ts:602-606`)
- [ ] T011 [P] Add `sessionSummary` length check: reject if string length > 50 000 characters (`input-normalizer.ts:621-703`)
- [ ] T012 [P] Add `triggerPhrases` entry length check: reject if any entry > 200 characters (`input-normalizer.ts:621-703`)
- [ ] T013 [P] Add `observations` entry length check: reject if any entry > 5 000 characters (`input-normalizer.ts:621-703`)
- [ ] T014 Run `tsc --noEmit` — must exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **P1 — V-Rule Hardening (validate-memory-quality.ts)**: Replace regex-based YAML parsing and add content density V-rule.

- [ ] T015 Read `validate-memory-quality.ts` lines 183-191 (`extractFrontMatter`) (`validate-memory-quality.ts`)
- [ ] T016 Verify `js-yaml` is importable: add `import * as yaml from 'js-yaml'` at file top and confirm `tsc --noEmit` still exits 0 (`validate-memory-quality.ts`)
- [ ] T017 Replace regex-based frontmatter parse with `yaml.load()` call wrapped in try/catch (`validate-memory-quality.ts:183-191`)
- [ ] T018 Convert `yaml.load()` parse exceptions to a structured V-rule failure object (not a thrown exception) (`validate-memory-quality.ts`)
- [ ] T019 Read existing content quality V-rule patterns in `validate-memory-quality.ts` to understand V-rule object format (`validate-memory-quality.ts`)
- [ ] T020 Add content density V-rule: strip frontmatter block from body, count non-whitespace characters, emit V-rule failure if count < 50 (`validate-memory-quality.ts`)
- [ ] T021 Run `tsc --noEmit` — must exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: P2 — Secondary Rules (validate-memory-quality.ts)

**Goal**: Add V12 path normalization and status/percentage contradiction V-rule.

- [ ] T022 Read `validate-memory-quality.ts` lines 612-650 (V12 rule block) (`validate-memory-quality.ts`)
- [ ] T023 Add `path.isAbsolute()` check at V12 entry: if `spec_folder` is not absolute, resolve with `path.resolve(process.cwd(), specFolder)` before the three existing guard conditions (`validate-memory-quality.ts:612-650`)
- [ ] T024 Read existing V-rule warning patterns (non-blocking rules) for status/contradiction pattern (`validate-memory-quality.ts`)
- [ ] T025 Add status/percentage contradiction V-rule: if `status === "complete"` and `percentage` field is present and < 100, emit a V-rule warning (not error) (`validate-memory-quality.ts`)
- [ ] T026 Run `tsc --noEmit` — must exit 0
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

**Goal**: Confirm all 8 changes work correctly and no regressions in existing scenarios.

- [ ] T027 Manual test — fast-path FILES: run `generate-context.js` with payload containing `userPrompts` + `filesModified`; confirm output memory has populated `files` section
- [ ] T028 Manual test — unknown-field warning: run with payload containing `sesionSummary`; confirm console WARN naming the field
- [ ] T029 Manual test — `contextType` enum: run with `contextType: "bogus"`; confirm validation error returned
- [ ] T030 Manual test — string length: run with `sessionSummary` > 50 000 chars; confirm rejection
- [ ] T031 Manual test — YAML parser: run with malformed frontmatter (unclosed quote); confirm V-rule failure emitted
- [ ] T032 Manual test — content density: run with body `# Title\n\n`; confirm V-rule rejection
- [ ] T033 Regression test — replay 001-initial-enrichment test scenarios; confirm no behavioral change
- [ ] T034 [P] Update `implementation-summary.md` with actual changes, outcomes, and any deviations from plan
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T033 marked `[x]` (T034 after summary written)
- [ ] No `[B]` blocked tasks remaining
- [ ] `tsc --noEmit` exits 0
- [ ] All 6 manual verification scenarios pass (T027-T032)
- [ ] 001-initial-enrichment regression check passes (T033)
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Source**: `../research.md` (Round 2)

### P0 / P1 / P2 Task Map

| Priority | Tasks | LOC Estimate |
|----------|-------|--------------|
| P0 | T001-T005 | ~10 |
| P1 (input-normalizer) | T006-T014 | ~35 |
| P1 (validate-memory-quality) | T015-T021 | ~20 |
| P2 | T022-T026 | ~15 |
| Verification | T027-T034 | — |
<!-- /ANCHOR:cross-refs -->
