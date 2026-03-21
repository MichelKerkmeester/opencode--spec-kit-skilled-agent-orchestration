---
title: "Feature Specification: Field Integrity and Schema Validation"
description: "Two interrelated gap categories from deep research Round 2: the fast-path silently drops filesModified data, and five schema/validation deficiencies allow corrupt or trivial input to reach storage without detection."
trigger_phrases:
  - "field integrity"
  - "schema validation"
  - "filesModified fast-path"
  - "unknown-field warnings"
  - "contextType enum"
  - "YAML frontmatter validation"
  - "content density"
  - "input-normalizer"
  - "validate-memory-quality"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Field Integrity and Schema Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The `generate-context.js` pipeline contains two categories of correctness gap discovered during deep research Round 2 (74 findings, 20 recommendations). Domain A is a data-loss defect: when an AI sends both `userPrompts` (triggering the fast path) and `filesModified`, the file listing is silently discarded. Domain B is a set of five schema and validation weaknesses that allow typo'd fields, over-long strings, invalid enum values, malformed YAML frontmatter, and trivially short content to pass through to storage undetected. Together these eight changes harden the pipeline against both accidental data loss and silent quality degradation.

**Key Decisions**: Warn-not-error for unknown fields (backward compatibility); real YAML parser for frontmatter (correctness over regex approximation)

**Critical Dependencies**: `js-yaml` already present in the project dependency tree; TypeScript compilation must pass before any merge

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (fast-path fix) / P1 (validation gaps) / P2 (secondary rules) |
| **Status** | Draft |
| **Created** | 2026-03-21 |
| **Branch** | `003-field-integrity-and-schema` |
| **Phase** | 003 of 016-json-mode-hybrid-enrichment |
| **Parent** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `generate-context.js` pipeline has a split code path in `input-normalizer.ts` (lines 414-530): a fast path triggered by `userPrompts`, `observations`, or `recentContext`, and a slow path for all other inputs. The fast path converts 11 field families but omits the `filesModified` -> `FILES` conversion that exists only on the slow path (lines 504-529). When an AI sends `filesModified` alongside any fast-path trigger field, the file listing is silently lost with no warning emitted. Separately, `RawInputData` uses a `[key: string]: unknown` index signature, meaning typo'd field names (e.g. `sesionSummary`) are accepted and silently dropped; `contextType` accepts any string despite the type-system defining an enum; string fields have no length cap; frontmatter is validated via fragile regex rather than a real parser; and quality flags `duplicate_observations` and `short_content` exist but no V-rule enforces them.

### Purpose

Eliminate silent data loss and silent quality degradation in the memory-save pipeline so that every save operation either stores complete, valid data or surfaces a diagnostic that lets the caller understand what was rejected or truncated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix fast-path `filesModified` drop (add `FILES` conversion on fast path, `input-normalizer.ts`)
- Add unknown-field warnings in `validateInputData` for typo detection
- Add `contextType` enum validation (reject strings outside the defined set)
- Add string length limits for `sessionSummary`, `triggerPhrases` entries, and `observations` entries
- Replace YAML frontmatter regex with `js-yaml` parser in `validate-memory-quality.ts`
- Add minimum content density V-rule (reject trivially short memories)
- Add V12 path normalization so relative `spec_folder` strings do not silently degrade the rule
- Add status/percentage contradiction detection V-rule

### Out of Scope

- Adding new memory fields or changing the JSON schema structure (Domain C: indexing, addressed in 004-indexing-and-coherence)
- Changes to scoring weights or contamination detection (addressed in 002-scoring-and-filter)
- Backfilling or re-validating existing memories in storage
- Changing the CLI interface or `description.json` format

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Fast-path `filesModified` conversion, unknown-field warnings, `contextType` enum validation, string length limits |
| `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Modify | YAML parser replacement, content density V-rule, V12 path normalization, status/percentage contradiction V-rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fast-path `filesModified` drop fixed | When `userPrompts` is present alongside `filesModified`, the output `FILES` array is populated identically to the slow path |
| REQ-002 | TypeScript compilation passes | `tsc --noEmit` exits 0 after all changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Unknown-field warnings emitted | Sending `sesionSummary` (typo) produces a `WARN unknown field` log line; valid fields produce no warning |
| REQ-004 | `contextType` enum validated | Sending `contextType: "bogus"` is rejected with a descriptive error; all documented enum values are accepted |
| REQ-005 | String length limits enforced | `sessionSummary` > 50 KB triggers a validation error; `triggerPhrases` entries > 200 chars are rejected |
| REQ-006 | YAML frontmatter uses real parser | `extractFrontMatter` in `validate-memory-quality.ts` uses `js-yaml`; malformed YAML produces a parse-error V-rule failure rather than silently passing |
| REQ-007 | Content density V-rule added | Memories whose body (frontmatter stripped) contains fewer than 50 non-whitespace characters are rejected with a diagnostic |

### P2 - Optional (can defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | V12 path normalization | When `spec_folder` is a relative path, V12 resolves it against `process.cwd()` before the three existing guard conditions run |
| REQ-009 | Status/percentage contradiction V-rule | A memory claiming `status: complete` with `percentage: 40` emits a V-rule warning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Round-trip test — an AI payload containing both `userPrompts` and `filesModified` produces a saved memory with a populated `files` section.
- **SC-002**: Typo audit — sending a payload with `sesionSummary` instead of `sessionSummary` produces at least one console warning referencing the unknown field name.
- **SC-003**: Enum guard — `contextType: "invalidValue"` causes `validateInputData` to return a validation error (not pass silently).
- **SC-004**: YAML correctness — a frontmatter block with an unclosed quote (`title: "broken`) triggers a V-rule failure in `validate-memory-quality.ts`.
- **SC-005**: Content density — a payload whose body is only `# Title\n` (4 non-whitespace chars) is rejected before storage.
- **SC-006**: No regression — the existing 001-initial-enrichment test scenarios continue to pass.

### Acceptance Scenarios

1. **Given** a payload with `userPrompts: [...]` and `filesModified: ["src/foo.ts"]`, **when** the pipeline runs on the fast path, **then** the output memory contains `files: ["src/foo.ts"]`.
2. **Given** a payload with `sesionSummary: "..."` (typo), **when** `validateInputData` runs, **then** at least one `WARN unknown field: sesionSummary` message is emitted to the console.
3. **Given** a payload with `contextType: "randomValue"`, **when** `validateInputData` runs, **then** a validation error is returned citing the invalid enum value and listing accepted values.
4. **Given** a memory file with frontmatter containing an unclosed YAML string (`title: "broken`), **when** the V-rules run, **then** a structured V-rule failure is returned with `ruleId: "V-FRONTMATTER-PARSE"` and no exception is thrown.
5. **Given** a memory payload whose body (frontmatter stripped) contains fewer than 50 non-whitespace characters, **when** the V-rules run, **then** a structured V-rule failure is returned with `ruleId: "V-CONTENT-DENSITY"`.
6. **Given** a payload identical to any 001-initial-enrichment test scenario, **when** it is replayed after this phase's changes, **then** the output is identical to the pre-change output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `js-yaml` present in package.json | If absent, YAML parser change blocked | Verify with `cat package.json \| grep js-yaml` before starting |
| Risk | Unknown-field warnings too noisy | Legitimate callers may use extension fields | Emit at WARN level only; allow opt-out via config flag if needed |
| Risk | Length limits break existing callers | AI-generated `sessionSummary` fields can be long | Set limits generously (50 KB for sessionSummary); document limits in schema |
| Risk | Fast-path fix introduces duplicate FILES entries | Both paths now convert `filesModified` | Unit test with payload that has `filesModified` on both paths |
| Risk | V12 normalization changes path resolution behavior | Relative paths now resolve differently | Only activates when path is not absolute; preserve absolute-path behavior |
| Dependency | TypeScript strict mode | New code must satisfy strict type checks | Write types before implementation |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The unknown-field check adds at most one Object.keys() iteration per call; negligible overhead (<1 ms).
- **NFR-P02**: `js-yaml` parse of a typical 30-line frontmatter block must complete in <5 ms.

### Security

- **NFR-S01**: String length limits prevent memory exhaustion from pathologically large payloads.
- **NFR-S02**: No new external network calls are introduced.

### Reliability

- **NFR-R01**: All new V-rules must emit structured error objects (not throw) so the caller can handle them gracefully.
- **NFR-R02**: The fast-path fix must not break existing callers that omit `filesModified`.

---

## 8. EDGE CASES

### Data Boundaries

- Empty `filesModified: []` on fast path: must produce `FILES: []` (not omit the key).
- `contextType` not present in payload: field is optional; absence must not trigger enum error.
- `sessionSummary` exactly at the 50 KB limit: accepted. One byte over: rejected.
- Frontmatter block that is entirely absent: `extractFrontMatter` returns empty object, V-rule passes normally.

### Error Scenarios

- `js-yaml` throws a synchronous exception on malformed YAML: catch and convert to a V-rule failure object, do not propagate exception.
- Both `userPrompts` AND `filesModified` present but `filesModified` is undefined: fast path must guard with `Array.isArray` check before pushing entries.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 2, LOC: ~70, Systems: pipeline only |
| Risk | 8/25 | No auth, no API, no breaking change (warn-not-error) |
| Research | 14/20 | Deep research Round 2 already completed, 74 findings as evidence base |
| Multi-Agent | 3/15 | Single workstream |
| Coordination | 5/15 | Sibling phases 002 and 004 touch different files |
| **Total** | **42/100** | **Level 3 (architectural decisions justified)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fast-path fix duplicates FILES when slow path also runs | M | L | Fast path is mutually exclusive with slow path by design; add guard comment |
| R-002 | Unknown-field warnings break callers using extension fields | M | M | Emit WARN not ERROR; document extension-field convention |
| R-003 | `js-yaml` version mismatch causes parse differences | L | L | Pin version; check existing `js-yaml` import elsewhere in codebase |
| R-004 | Content density rule rejects valid short memories (tags-only) | M | L | Threshold 50 non-whitespace chars is deliberately low; exemption for `contextType: tags` if needed |
| R-005 | V12 path normalization changes behavior for existing absolute paths | L | L | Guard with `path.isAbsolute()` check; only normalize relative paths |

---

## 11. USER STORIES

### US-001: File Data Preserved on Fast Path (Priority: P0)

**As an** AI assistant saving a memory via `generate-context.js`, **I want** my `filesModified` list to appear in the saved memory regardless of whether I also sent `userPrompts`, **so that** the memory accurately reflects which files were touched in the session.

**Acceptance Criteria**:
1. Given a payload with `userPrompts: [...]` and `filesModified: ["src/foo.ts"]`, When the pipeline runs, Then the output memory contains `FILES: ["src/foo.ts"]`.
2. Given a payload with `userPrompts: [...]` and no `filesModified`, When the pipeline runs, Then no `FILES` key is emitted (no regression).

---

### US-002: Typo Detection on Unknown Fields (Priority: P1)

**As an** AI assistant, **I want** a warning when I send a misspelled field name, **so that** I can correct the payload before data is silently lost.

**Acceptance Criteria**:
1. Given `{ sesionSummary: "..." }`, When validated, Then a warning is logged naming the unknown field.
2. Given `{ sessionSummary: "..." }`, When validated, Then no unknown-field warning is emitted.

---

### US-003: Valid Enum Values Enforced (Priority: P1)

**As a** pipeline maintainer, **I want** `contextType` validated against the defined enum, **so that** storage contains only semantically valid context type values.

**Acceptance Criteria**:
1. Given `contextType: "random"`, When validated, Then validation returns an error citing the invalid enum value.
2. Given `contextType: "implementation"`, When validated, Then validation passes without error.

---

### US-004: Content Density Gate (Priority: P1)

**As a** memory retrieval system, **I want** memories to contain a minimum amount of content, **so that** trivially empty saves do not pollute the search index.

**Acceptance Criteria**:
1. Given a payload with body `# Title\n\n`, When validated, Then the content density V-rule rejects it.
2. Given a payload with a substantive body (>50 non-whitespace chars), When validated, Then the V-rule passes.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `contextType` validation emit an error (reject) or a warning (coerce to `"general"`)? Current recommendation: error, to surface miscategorisation.
- What is the correct `triggerPhrases` entry length limit? Proposed 200 chars; confirm with field usage analysis.
- Should the content density threshold be configurable via env var, or is 50 non-whitespace chars sufficient as a hard constant?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Source**: `../research.md` (Round 2, findings F-D01 through F-D08 and F-S01 through F-S05)
- **Sibling Phases**: `001-initial-enrichment/`, `002-scoring-and-filter/`, `004-indexing-and-coherence/`
