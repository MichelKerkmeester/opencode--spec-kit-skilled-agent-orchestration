---
title: "Feature Specification: Contamination Detection"
description: "Strengthen contamination detection to produce measurable score penalties and audit trail coverage."
---
# Feature Specification: Contamination Detection

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
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 2 |
| **Predecessor** | [001-quality-scorer-unification](../001-quality-scorer-unification/spec.md) |
| **Successor** | [003-data-fidelity](../003-data-fidelity/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-02 |
| **Sequence** | B2 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 2** of the Perfect Session Capturing specification.

**Scope Boundary**: Three guard layers exist for contamination detection (lexical scrubber, prompt-quality pipeline, post-render V8/V9), but they run on different payloads and have significant blind spots.
**Dependencies**: 001-quality-scorer-unification
**Deliverables**: Extended V8 to inspect frontmatter and detect non-dominant foreign-spec signals; broadened V9 pattern set beyond current 3 generic title patterns
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three guard layers exist for contamination detection (lexical scrubber, prompt-quality pipeline, post-render V8/V9), but they run on different payloads and have significant blind spots. V8 misses low-volume contamination where only 1-2 foreign-spec mentions appear. V8 ignores frontmatter entirely, allowing foreign spec references in `trigger_phrases` and `key_topics` to pass undetected. V9 catches only 3 generic title patterns, missing many stub and template-residue patterns. The `content-filter` module has a `noise.patterns` config that is defined but never consulted during filtering. There is no structured audit trail showing what each guard layer caught or missed.

### Purpose

Strengthen V8 to inspect frontmatter and detect non-dominant foreign-spec signals. Broaden V9 beyond its 3-title denylist. Wire the existing `noise.patterns` config. Add structured JSON audit logging at three pipeline points (extractor scrub, content-filter, post-render) to create a traceable contamination audit trail.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend V8 to inspect frontmatter `trigger_phrases` and `key_topics` for foreign-spec signals
- Extend V8 to detect non-dominant foreign-spec signals (1-2 mentions scattered across multiple specs)
- Broaden V9 pattern set beyond the current 3 generic title patterns
- Wire `content-filter` `noise.patterns` config so it is actually consulted during filtering
- Add structured JSON audit logging at 3 pipeline points: extractor scrub, content-filter, post-render

### Out of Scope

- Rewriting the lexical scrubber -- it continues to operate as-is
- Changing the overall guard layer architecture (3 layers remain)
- Adding new guard layers beyond the existing three

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/memory/validate-memory-quality.ts` | Modify | Extend V8 to inspect frontmatter and low-volume cross-spec signals; broaden V9 title contamination patterns; emit post-render audit records |
| `scripts/lib/content-filter.ts` | Modify | Wire `noise.patterns` config into actual filtering logic; add structured audit logging |
| `scripts/core/workflow.ts` | Modify | Record extractor-scrub contamination audit output and aggregate all three audit stages into `metadata.json` |
| `scripts/extractors/contamination-filter.ts` | Modify | Preserve lexical scrubber behavior while exposing denylist match metadata for audit reporting |
| `scripts/tests/task-enrichment.vitest.ts` | Modify | Add regression coverage for frontmatter V8, scattered foreign-spec V8, expanded V9, config-driven noise patterns, and workflow audit aggregation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | V8 inspects frontmatter `trigger_phrases` and `key_topics` for foreign-spec signals | Foreign-spec identifiers in frontmatter fields trigger V8 contamination detection |
| REQ-002 | V8 handles non-dominant foreign-spec signals (1-2 mentions across multiple specs) | A memory referencing 2 different foreign specs with 1 mention each is flagged |
| REQ-003 | V9 broadened beyond 3 generic title patterns to cover more stub patterns | V9 pattern list covers template residue, placeholder titles, and generic stub formats |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Structured JSON audit logging at 3 pipeline points: extractor scrub, content-filter, post-render | Each pipeline point emits a JSON audit record showing what was detected, flagged, and passed through |
| REQ-005 | Wire `content-filter` `noise.patterns` config into actual filtering logic | `noise.patterns` from config consulted during content filtering; patterns matched and applied |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cross-spec contamination with fewer than 3 foreign mentions is detected and flagged by V8
- **SC-002**: Audit trail shows what contamination was caught versus missed at each pipeline stage, enabling post-hoc analysis of detection coverage
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

1. **Given** a rendered memory whose `trigger_phrases` include `031-memory-search-state-filter-fix`, **when** post-render validation runs, **then** V8 fails even if the body is otherwise short and clean.
2. **Given** a rendered memory that mentions two different foreign specs once each in the body, **when** post-render validation runs, **then** V8 fails for scattered low-volume contamination instead of passing as “non-dominant.”
3. **Given** a rendered memory titled `Draft`, `[TITLE]`, or a bare spec id, **when** V9 evaluates the rendered title, **then** the memory fails before write/index.
4. **Given** a workflow run that reaches the save path, **when** `metadata.json` is written, **then** it includes `extractor-scrub`, `content-filter`, and `post-render` contamination audit entries with pattern labels/counts but without raw prompt content.
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-01 quality scorer unification (001-quality-scorer-unification) | High | Quality scorer must provide contamination penalty support before detection improvements feed into scoring |
| Risk | Broadened V9 patterns may produce false positives on legitimate short titles | Medium | Test pattern set against existing golden memories to verify no false positives |
| Risk | Frontmatter inspection may flag intentional cross-references | Low | Only flag when foreign-spec signals appear without dominant target-spec anchors |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at this time -- requirements are fully specified from research R-02
<!-- /ANCHOR:questions -->
