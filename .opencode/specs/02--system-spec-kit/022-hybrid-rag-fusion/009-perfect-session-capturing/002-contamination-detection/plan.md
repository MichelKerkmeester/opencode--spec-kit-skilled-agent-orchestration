---
title: "Implementatio [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection/plan]"
description: "title: \"Implementation Plan: Contamination Detection\""
trigger_phrases:
  - "implementatio"
  - "plan"
  - "002"
  - "contamination"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Contamination Detection

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
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

This plan implements a guard layer extension pattern in the live pipeline: extend V8 and V9 validation rules in `scripts/memory/validate-memory-quality.ts`, wire the dormant `noise.patterns` config in `scripts/lib/content-filter.ts`, and add structured JSON audit logging at three pipeline points (extractor scrub in `scripts/core/workflow.ts`, content-filter, post-render). The result is stronger detection of low-volume and frontmatter-embedded contamination, with a traceable audit trail for each guard layer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-01 quality scorer unification)

### Definition of Done

- [x] All acceptance criteria met (REQ-001 through REQ-005)
- [x] Tests passing -- targeted Vitest regression coverage plus standalone memory-quality lane
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Guard layer extension -- strengthen existing detection rules and add observability without changing the 3-layer architecture.

### Key Components

- **V8 validator**: Extended to parse frontmatter `trigger_phrases` and `key_topics` for foreign-spec identifiers; new non-dominant signal detection for scattered 1-2 mention patterns across multiple foreign specs
- **V9 validator**: Pattern set expanded from 3 generic title matchers to cover template residue, placeholder titles, generic stub formats, and spec-id-only titles
- **`content-filter.ts`**: `noise.patterns` config is compiled from config input and consulted alongside hardcoded rules; structured audit record emitted
- **Extractor scrub audit**: `scripts/core/workflow.ts` records denylist matches from the existing lexical scrubber without changing the scrubber architecture
- **Audit logging**: JSON audit records at extractor scrub, content-filter, and post-render stages are aggregated into `metadata.json`

### Data Flow

1. Extractor scrub runs the existing lexical scrubber inside `workflow.ts`, captures denylist labels/counts, and emits an audit record
2. Content-filter runs with config-driven `noise.patterns` active alongside the hardcoded rules and emits an audit record
3. V8/V9 validators run on rendered output including frontmatter and emit a post-render audit record
4. Workflow aggregates the three audit records into `metadata.json` for downstream reporting
5. Contamination flag continues to feed into quality scoring (via prior phase scorer support)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend V8 Rules

- [x] Add frontmatter parsing to V8 -- extract `trigger_phrases` and `key_topics` arrays
- [x] Check extracted frontmatter values against the foreign-spec identifier set
- [x] Add non-dominant signal detection: flag when 1-2 foreign-spec mentions appear across 2+ different specs
- [x] Preserve existing V8 body-content detection alongside new frontmatter checks

### Phase 2: Broaden V9 Patterns

- [x] Audit current 3-pattern V9 denylist and document what it catches
- [x] Add patterns for: template residue (`[NAME]`, `[placeholder]`), generic stubs (`Untitled`, `Draft`, `TODO`), and spec-number-only titles
- [x] Test new patterns against existing golden memories to verify zero false positives

### Phase 3: Wire noise.patterns Config

- [x] Read `noise.patterns` from `content-filter` config at initialization
- [x] Apply patterns during content filtering alongside hardcoded rules
- [x] Ensure config-driven patterns do not override safety-critical hardcoded rules

### Phase 4: Add 3-Stage Audit Logging

- [x] Define `ContaminationAuditRecord` interface: `{ stage, timestamp, patternsChecked, matchesFound, actionsTaken, passedThrough }`
- [x] Emit audit record at extractor scrub point in the live workflow scrub stage
- [x] Emit audit record at content-filter point in `content-filter.ts`
- [x] Emit audit record at post-render point in `validate-memory-quality.ts`
- [x] Aggregate audit records for downstream quality reporting in `metadata.json`
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
| R-01 quality scorer unification (001-quality-scorer-unification) | Internal | Green | Detection complete; penalty integration into scoring deferred to 001 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broadened patterns cause false positives on legitimate memories, or audit logging introduces performance regression
- **Procedure**: Revert V8/V9 pattern changes independently of audit logging; audit logging can be disabled via a config flag without reverting detection rules
<!-- /ANCHOR:rollback -->
