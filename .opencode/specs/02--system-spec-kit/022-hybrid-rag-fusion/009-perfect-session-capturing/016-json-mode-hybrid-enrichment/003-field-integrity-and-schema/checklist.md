---
title: "Verification Checklist: Field Integrity and Schema Validation"
description: "Verification Date: pending"
trigger_phrases:
  - "field integrity checklist"
  - "schema validation checklist"
  - "filesModified verification"
  - "input-normalizer checklist"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Field Integrity and Schema Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` documents all 8 changes with acceptance criteria
- [ ] CHK-002 [P0] `plan.md` identifies target line ranges for all changes
- [ ] CHK-003 [P0] `js-yaml` confirmed present in `package.json` before Phase 3 begins
- [ ] CHK-004 [P1] `input-normalizer.ts` fast-path / slow-path split confirmed at lines 414-530
- [ ] CHK-005 [P1] Slow-path `filesModified` conversion confirmed at lines 504-529 (reference for P0 fix)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `tsc --noEmit` exits 0 after all changes (no TypeScript compile errors)
- [ ] CHK-011 [P0] No `console.error` calls introduced without structured error objects
- [ ] CHK-012 [P0] Fast-path `filesModified` conversion guarded with `Array.isArray()` check
- [ ] CHK-013 [P1] Unknown-field warnings use `console.warn` (not `console.error`) — warn-not-error per ADR-001
- [ ] CHK-014 [P1] `KNOWN_RAW_INPUT_FIELDS` constant is exhaustive (covers all documented `RawInputData` keys)
- [ ] CHK-015 [P1] `VALID_CONTEXT_TYPES` constant matches the `contextType` type definition exactly
- [ ] CHK-016 [P1] `yaml.load()` call wrapped in try/catch; exception converted to V-rule failure object
- [ ] CHK-017 [P1] Content density rule counts non-whitespace chars after frontmatter strip (not raw length)
- [ ] CHK-018 [P2] V12 path normalization guarded with `path.isAbsolute()` — absolute paths unchanged
- [ ] CHK-019 [P2] Status/percentage contradiction rule emits warning not error (non-blocking V-rule)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fast-path FILES test: payload `{ userPrompts: [...], filesModified: ["src/foo.ts"] }` produces output memory with `files: ["src/foo.ts"]` [Evidence: console output or saved memory inspection]
- [ ] CHK-021 [P0] Fast-path regression: payload with `userPrompts` and no `filesModified` produces output with no `files` key (no regression) [Evidence: console output]
- [ ] CHK-022 [P1] Unknown-field warning: payload with `sesionSummary` (typo) produces `WARN unknown field: sesionSummary` in console [Evidence: console output]
- [ ] CHK-023 [P1] Known-field no-warning: payload with `sessionSummary` (correct) produces no unknown-field warning [Evidence: console output]
- [ ] CHK-024 [P1] `contextType` enum rejection: `{ contextType: "bogus" }` returns validation error naming the invalid value [Evidence: error object or console]
- [ ] CHK-025 [P1] `contextType` enum pass: `{ contextType: "implementation" }` passes without error [Evidence: console output]
- [ ] CHK-026 [P1] `sessionSummary` length limit: string of 50 001 chars triggers rejection [Evidence: error output]
- [ ] CHK-027 [P1] YAML parser test: frontmatter with unclosed quote triggers V-rule failure (not silent pass) [Evidence: V-rule output]
- [ ] CHK-028 [P1] YAML parser pass: well-formed frontmatter passes without V-rule error [Evidence: V-rule output]
- [ ] CHK-029 [P1] Content density rejection: body `# Title\n\n` (4 non-whitespace chars) triggers V-rule failure [Evidence: V-rule output]
- [ ] CHK-030 [P1] Content density pass: body with >50 non-whitespace chars passes [Evidence: V-rule output]
- [ ] CHK-031 [P2] V12 normalization: payload with relative `spec_folder` path runs V12 without silent no-op [Evidence: V12 output]
- [ ] CHK-032 [P2] V12 absolute path unchanged: payload with absolute `spec_folder` path behaves identically to before [Evidence: V12 output]
- [ ] CHK-033 [P2] Contradiction warning: memory with `status: "complete"` and `percentage: 40` emits a V-rule warning [Evidence: V-rule output]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets or file paths introduced
- [ ] CHK-041 [P0] String length limits prevent memory exhaustion from pathologically large payloads
- [ ] CHK-042 [P1] `yaml.load()` uses `{ schema: yaml.DEFAULT_SAFE_SCHEMA }` or equivalent to prevent arbitrary code execution from YAML payload
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md` synchronized (no contradictions between files)
- [ ] CHK-051 [P1] Code comments on fast-path FILES conversion explain why the conversion is duplicated (reference to slow-path equivalent)
- [ ] CHK-052 [P1] `KNOWN_RAW_INPUT_FIELDS` and `VALID_CONTEXT_TYPES` constants have JSDoc comments listing where the source-of-truth type is defined
- [ ] CHK-053 [P2] `implementation-summary.md` completed and accurately reflects actual changes and any deviations from plan
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Temp test payloads in `scratch/` only, not committed
- [ ] CHK-061 [P1] `scratch/` cleaned before completion claim
- [ ] CHK-062 [P2] Session findings saved to `memory/` via `generate-context.js` after completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:regression -->
## Regression Gate

- [ ] CHK-070 [P0] All 001-initial-enrichment test scenarios replayed and produce identical output after this phase's changes
- [ ] CHK-071 [P1] No new TypeScript errors introduced in files outside `input-normalizer.ts` and `validate-memory-quality.ts`
<!-- /ANCHOR:regression -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001: warn-not-error, ADR-002: YAML parser)
- [ ] CHK-101 [P1] All ADRs have status "Accepted"
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for both ADRs
- [ ] CHK-103 [P2] Migration path documented for callers using extension fields (unknown-field warning behavior)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 22 | 0/22 |
| P2 Items | 8 | 0/8 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
