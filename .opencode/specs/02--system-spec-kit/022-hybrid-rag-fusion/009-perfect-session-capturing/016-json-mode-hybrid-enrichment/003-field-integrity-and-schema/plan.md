---
title: "...-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/003-field-integrity-and-schema/plan]"
description: "Targets two TypeScript source files with eight surgical changes: one data-loss fix on the fast path, two new validation guards, two new V-rules, and three complementary hardening items. All changes are additive or narrow fixes with no API surface changes."
trigger_phrases:
  - "field integrity plan"
  - "schema validation implementation"
  - "filesmodified fast-path fix"
  - "input-normalizer changes"
  - "validate-memory-quality changes"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Field Integrity and Schema Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (CommonJS, Node.js 18+) |
| **Framework** | None (utility scripts) |
| **Storage** | SQLite via Spec Kit Memory MCP (writes not in scope for this phase) |
| **Testing** | Manual integration tests; `tsc --noEmit` for type correctness |
| **Build** | `npm run build` in `.opencode/skill/system-spec-kit/scripts/` |

### Overview

Eight changes across two files harden the `generate-context.js` pipeline against data loss and silent schema violations. The P0 change adds a `filesModified` -> `FILES` conversion to the fast path in `input-normalizer.ts`, mirroring the existing slow-path conversion. The P1 changes add unknown-field warnings, `contextType` enum validation, string length limits, a YAML parser replacement, and a content density V-rule. The P2 changes add V12 path normalization and a status/percentage contradiction V-rule. No public interfaces change; all additions are internal guards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in spec.md
- [x] Research evidence available (Round 2, 74 findings)
- [x] Target line ranges identified for all 8 changes
- [x] `js-yaml` dependency confirmed present in project

### Definition of Done

- [ ] All 8 changes implemented and TypeScript compiles (`tsc --noEmit` exits 0)
- [ ] Manual round-trip test: payload with `userPrompts` + `filesModified` produces FILES in output
- [ ] Manual typo test: `sesionSummary` payload triggers warning in console
- [ ] Manual enum test: `contextType: "bogus"` triggers validation error
- [ ] Manual density test: body-only payload with <50 chars triggers V-rule
- [ ] Spec, plan, tasks all synchronized and checklist verified

### AI Execution Protocol

- [ ] Pre-Task Checklist documented for this implementation pass.
- [ ] Execution Rules documented for this implementation pass.
- [ ] Status Reporting Format documented for this implementation pass.
- [ ] Blocked Task Protocol documented for this implementation pass.

### Pre-Task Checklist

- [ ] Re-read `input-normalizer.ts` lines 414-530 before editing (fast/slow path split).
- [ ] Re-read `validate-memory-quality.ts` lines 183-191 and 612-650 before editing (V-rule patterns).
- [ ] Confirm `js-yaml` is importable (`grep js-yaml package.json`) before starting Phase 2.
- [ ] Keep edits scoped to the two target files only; do not modify sibling phase folders.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope Lock | Only edit `input-normalizer.ts` and `validate-memory-quality.ts`; no other files |
| Read First | Read each target function in full before editing (HALT if line numbers do not match spec) |
| TypeScript First | Run `tsc --noEmit` after each phase; do not proceed to next phase with compile errors |
| Warn Not Error | Unknown-field diagnostics use `console.warn`; do not use `console.error` or throw |

### Status Reporting Format

`Phase 003: <status> -> <artifact or validation result>`

### Blocked Task Protocol

1. Stop if a target line range does not match what `spec.md` documents; re-read the file and update the spec before continuing.
2. If `js-yaml` is not present, defer the YAML parser change (REQ-006) with user approval and document the deferral.
3. Re-run `tsc --noEmit` before claiming any phase complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline with two transformation stages: normalization (`input-normalizer.ts`) then validation (`validate-memory-quality.ts`). Changes are contained to these two files and follow the existing guard/emit pattern in each.

### Key Components

- **`input-normalizer.ts` fast path** (lines 437-491): Converts AI-supplied JSON fields to normalized pipeline fields. Currently handles 11 field families. Change adds `filesModified` as a 12th conversion on the fast path.
- **`validateInputData` function** (`input-normalizer.ts`, lines 621-703): Schema validation entry point. Changes add unknown-field iteration, `contextType` enum check, and string length guards.
- **`validate-memory-quality.ts` V-rules** (lines 183-191, 612-650): Structural quality checks applied after normalization. Changes replace the YAML regex, add a content density rule, add path normalization to V12, and add a status/percentage contradiction rule.

### Data Flow

```
AI JSON payload
    |
    v
input-normalizer.ts: fast path OR slow path
    |  (both paths now produce FILES from filesModified)
    v
validateInputData: unknown-field check, contextType enum, length limits
    |
    v
validate-memory-quality.ts: V-rules (YAML parser, density, V12, contradiction)
    |
    v
generate-context.js: serialize and save
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 — Fast-Path Data-Loss Fix

Target: `input-normalizer.ts` lines 437-491

- [ ] Locate the slow-path `filesModified` -> `FILES` conversion (lines 504-529)
- [ ] Duplicate the conversion logic into the fast path block
- [ ] Guard with `Array.isArray(input.filesModified)` before iterating
- [ ] Verify that an empty `filesModified: []` produces `FILES: []` in output
- [ ] Run `tsc --noEmit` — must exit 0

### Phase 2: P1 — Schema Validation Hardening

Target: `input-normalizer.ts` lines 621-703 and `validate-memory-quality.ts` lines 183-191

- [ ] Define the set of known `RawInputData` field names as a `const` array
- [ ] Add `Object.keys(input)` iteration in `validateInputData`; emit WARN for each unknown key
- [ ] Add `contextType` enum check: define valid values array, check `input.contextType` if present
- [ ] Add string length guards: `sessionSummary` > 50 000 chars, `triggerPhrases` entry > 200 chars, `observations` entry > 5 000 chars
- [ ] Replace regex-based frontmatter extractor with `js-yaml.load()` call; wrap in try/catch
- [ ] Add content density V-rule: strip frontmatter, count non-whitespace chars, emit V-rule failure if < 50

### Phase 3: P2 — Secondary Rules

Target: `validate-memory-quality.ts` lines 612-650 and new rule location

- [ ] Add `path.isAbsolute()` check to V12 guard block; resolve relative paths with `path.resolve(process.cwd(), specFolder)` before passing to the three existing conditions
- [ ] Add status/percentage contradiction rule: if `status === "complete"` and `percentage < 100`, emit a V-rule warning (not error)

### Phase 4: Verification

- [ ] Manual round-trip test: fast-path payload with FILES — compare output to slow-path payload
- [ ] Manual typo test: unknown field warning appears
- [ ] Manual enum test: `contextType: "bogus"` returns validation error
- [ ] Manual YAML test: malformed frontmatter triggers V-rule failure
- [ ] Manual density test: short body is rejected
- [ ] Confirm 001-initial-enrichment scenarios unaffected
- [ ] Update `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| TypeScript compile | All changed files | `tsc --noEmit` |
| Manual integration | Fast-path FILES output | `node generate-context.js --json '...'` |
| Manual integration | Unknown-field warning | Node console output inspection |
| Manual integration | `contextType` enum rejection | Node console output inspection |
| Manual integration | YAML parse error | Crafted malformed frontmatter payload |
| Manual integration | Content density rejection | Short-body payload |
| Manual regression | 001-initial-enrichment scenarios | Replay existing test payloads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `js-yaml` in `package.json` | Internal | Verify before Phase 2 | YAML parser change falls back to regex (P1 deferred) |
| TypeScript strict mode compliance | Internal | Green | Phase merges blocked until tsc exits 0 |
| Phase 001-initial-enrichment merged | Sibling | Green | This phase builds on the stabilized pipeline baseline |
| Phase 002-scoring-and-filter | Sibling | Parallel | Different files; no dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript compile failure, or a regression in 001-initial-enrichment scenarios after merging.
- **Procedure**: `git revert` the commit(s) for this phase. The two target files are isolated; revert is clean. No data migrations, no stored-data side effects.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (P0 Fix) ────┐
                     ├──► Phase 2 (P1 Hardening) ──► Phase 3 (P2 Rules) ──► Phase 4 (Verify)
                     │
(Phase 001 merged) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| P0 Fix | 001-initial-enrichment merged | P1 Hardening |
| P1 Hardening | P0 Fix | P2 Rules |
| P2 Rules | P1 Hardening | Verification |
| Verification | P2 Rules | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| P0 Fix (fast-path FILES) | Low | 0.5 hours |
| P1 Hardening (4 changes) | Medium | 2-3 hours |
| P2 Rules (2 changes) | Low | 1 hour |
| Verification | Low | 1 hour |
| **Total** | | **4.5-5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] `tsc --noEmit` passing before any merge
- [ ] Manual test matrix completed (all 6 scenarios)
- [ ] No feature flags needed (all changes are internal guards)

### Rollback Procedure

1. `git revert <commit-sha>` for this phase's commit
2. Run `tsc --noEmit` to confirm revert is clean
3. Replay 001-initial-enrichment test scenarios to verify no residual change

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A — changes are pipeline logic only, no stored data modified
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌────────────────────────┐
│  Phase 1: P0 Fix     │────►│  Phase 2: P1 Hardening │
│  input-normalizer.ts │     │  input-normalizer.ts   │
│  fast-path FILES     │     │  validate-mem-quality  │
└──────────────────────┘     └───────────┬────────────┘
                                         │
                             ┌───────────▼────────────┐
                             │  Phase 3: P2 Rules     │
                             │  validate-mem-quality  │
                             │  V12 norm + contradict │
                             └───────────┬────────────┘
                                         │
                             ┌───────────▼────────────┐
                             │  Phase 4: Verification │
                             │  All 6 manual tests    │
                             └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Fast-path FILES fix | 001 baseline | Correct FILES output | P1 Hardening |
| Unknown-field warnings | Fast-path fix | Warning diagnostics | contextType enum |
| contextType enum | Unknown-field warnings | Enum rejection | Length limits |
| Length limits | contextType enum | Truncation errors | P2 Rules |
| YAML parser | Length limits | Structured parse errors | Content density |
| Content density V-rule | YAML parser | Density rejections | P2 Rules |
| V12 path normalization | P1 complete | Correct V12 behavior | Contradiction rule |
| Contradiction V-rule | V12 norm | Status warnings | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **P0 Fast-path FILES fix** — 0.5 hours — CRITICAL (unblocks all downstream changes)
2. **YAML parser replacement** — 0.75 hours — CRITICAL (most structurally different change; early failure possible)
3. **Unknown-field warnings** — 0.5 hours — CRITICAL (establishes unknown-field detection pattern reused by contextType check)
4. **Verification** — 1 hour — CRITICAL (gate before merge)

**Total Critical Path**: 2.75 hours

**Parallel Opportunities**:
- `contextType` enum check and string length limits can be written simultaneously (both in `validateInputData`)
- V12 path normalization and contradiction V-rule can be written simultaneously (both in `validate-memory-quality.ts`, different functions)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | P0 Fix merged | Round-trip test passes for fast-path FILES | Phase 1 complete |
| M2 | P1 Hardening complete | All 4 P1 acceptance criteria met | Phase 2 complete |
| M3 | All changes verified | Full 6-scenario test matrix passing, tsc clean | Phase 4 complete |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Warn-Not-Error for Unknown Fields

**Status**: Accepted

**Context**: `RawInputData` uses `[key: string]: unknown`, so any field name is currently accepted. We needed to choose between silently dropping unknown fields (current behavior), emitting warnings, or rejecting payloads with unknown fields as errors.

**Decision**: Emit a WARN-level log message for each unknown field. Do not reject the payload.

**Consequences**:
- Existing callers using unofficial extension fields continue to work without breakage.
- Typos are surfaced without causing failures in production saves.
- Callers that monitor console output will see actionable diagnostics.

**Alternatives Rejected**:
- Hard error on unknown fields: breaks any caller using extension fields; too disruptive for a first hardening pass.
- Continue silently dropping: misses the typo-detection use case entirely.

---

### ADR-002: Real YAML Parser Over Regex for Frontmatter

**Status**: Accepted

**Context**: `extractFrontMatter` in `validate-memory-quality.ts` (lines 183-191) used a regex to parse YAML frontmatter. The regex passed malformed YAML (unclosed quotes, bad indentation) without error, producing silently incorrect parsed data.

**Decision**: Replace the regex with `js-yaml.load()` wrapped in a try/catch. Parse errors are converted to a structured V-rule failure object and returned to the caller.

**Consequences**:
- Malformed frontmatter is detected and surfaces a diagnostic rather than corrupting parsed values.
- `js-yaml` is already a transitive dependency, so no new package is added.
- Synchronous parse of typical frontmatter (<50 lines) completes in <2 ms.

**Alternatives Rejected**:
- Keep regex but extend it: regex cannot reliably handle all valid YAML syntax; would require a near-complete YAML subset implementation.
- Use async YAML parsing: unnecessary complexity; frontmatter is small and parse is fast.
<!-- /ANCHOR:architecture -->
