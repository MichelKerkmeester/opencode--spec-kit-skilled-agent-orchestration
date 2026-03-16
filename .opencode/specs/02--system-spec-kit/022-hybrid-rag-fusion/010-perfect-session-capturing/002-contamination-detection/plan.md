---
title: "Implementation Plan: Contamination Detection"
---
# Implementation Plan: Contamination Detection

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline, validate-memory-quality validators |
| **Storage** | None (validation and filtering, no persistence) |
| **Testing** | Vitest |

### Overview

This plan implements a guard layer extension pattern: extend V8 and V9 validation rules in `validate-memory-quality.ts`, wire the dormant `noise.patterns` config in `content-filter.ts`, and add structured JSON audit logging at three pipeline points (extractor scrub, content-filter, post-render). The result is stronger detection of low-volume and frontmatter-embedded contamination, with a traceable audit trail for each guard layer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-01 quality scorer unification)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Tests passing -- golden test for detection coverage
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Guard layer extension -- strengthen existing detection rules and add observability without changing the 3-layer architecture.

### Key Components

- **V8 validator**: Extended to parse frontmatter `trigger_phrases` and `key_topics` for foreign-spec identifiers; new non-dominant signal detection for scattered 1-2 mention patterns across multiple foreign specs
- **V9 validator**: Pattern set expanded from 3 generic title matchers to cover template residue, placeholder titles, and generic stub formats
- **`content-filter.ts`**: `noise.patterns` config wired into actual filtering decisions; structured audit record emitted
- **Audit logging**: JSON audit records at extractor scrub, content-filter, and post-render stages showing detection/pass-through decisions

### Data Flow

1. Extractor scrub runs lexical scrubber, emits audit record of what was removed
2. Content-filter runs with `noise.patterns` now active, emits audit record
3. V8/V9 validators run on rendered output including frontmatter, emit audit record
4. Each audit record contains: stage name, patterns checked, matches found, action taken, pass-through items
5. Contamination flag feeds into quality scorer (via R-01 penalty)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend V8 Rules

- [ ] Add frontmatter parsing to V8 -- extract `trigger_phrases` and `key_topics` arrays
- [ ] Check extracted frontmatter values against the foreign-spec identifier set
- [ ] Add non-dominant signal detection: flag when 1-2 foreign-spec mentions appear across 2+ different specs
- [ ] Preserve existing V8 body-content detection alongside new frontmatter checks

### Phase 2: Broaden V9 Patterns

- [ ] Audit current 3-pattern V9 denylist and document what it catches
- [ ] Add patterns for: template residue (`[NAME]`, `[placeholder]`), generic stubs (`Untitled`, `Draft`, `TODO`), and spec-number-only titles
- [ ] Test new patterns against existing golden memories to verify zero false positives

### Phase 3: Wire noise.patterns Config

- [ ] Read `noise.patterns` from `content-filter` config at initialization
- [ ] Apply patterns during content filtering alongside hardcoded rules
- [ ] Ensure config-driven patterns do not override safety-critical hardcoded rules

### Phase 4: Add 3-Stage Audit Logging

- [ ] Define `ContaminationAuditRecord` interface: `{ stage, timestamp, patternsChecked, matchesFound, actionsTaken, passedThrough }`
- [ ] Emit audit record at extractor scrub point in `collect-session-data.ts`
- [ ] Emit audit record at content-filter point in `content-filter.ts`
- [ ] Emit audit record at post-render point in renderer pipeline
- [ ] Aggregate audit records for downstream quality reporting
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | V8 frontmatter foreign-spec detection, V8 non-dominant signal detection | Vitest |
| Unit | V9 expanded pattern set -- no false positives on golden memories | Vitest |
| Unit | `noise.patterns` config wiring in content-filter | Vitest |
| Integration | End-to-end contamination detection with audit trail across 3 stages | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-01 quality scorer unification (001-quality-scorer-unification) | Internal | Yellow | Contamination penalty integration requires unified scorer interface; detection work can proceed but penalty application is blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broadened patterns cause false positives on legitimate memories, or audit logging introduces performance regression
- **Procedure**: Revert V8/V9 pattern changes independently of audit logging; audit logging can be disabled via a config flag without reverting detection rules
<!-- /ANCHOR:rollback -->
