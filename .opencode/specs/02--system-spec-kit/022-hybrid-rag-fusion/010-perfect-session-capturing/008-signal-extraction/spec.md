---
title: "Feature Specification: Signal Extraction"
description: "Tighten signal extraction behavior and evidence quality for session activity signals."
---
# Feature Specification: Signal Extraction

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
| **Phase** | 8 of 16 |
| **Predecessor** | 007-phase-classification |
| **Successor** | 009-embedding-optimization |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-08 |
| **Sequence** | B1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 8** of the Perfect Session Capturing specification.

**Scope Boundary**: The pipeline uses 3 real extraction engines plus 1 wrapper, each with different stopwords, weighting, and placeholder rules.
**Dependencies**: 007-phase-classification
**Deliverables**: Created SemanticSignalExtractor with mode-aware extraction (topics/triggers/summary/all); consolidated 3 divergent stopword lists into a single profile
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The pipeline uses 3 real extraction engines plus 1 wrapper, each with different stopwords, weighting, and placeholder rules:

1. **`shared/trigger-extractor.ts`** (659 lines): Primary engine with 119 English stopwords, TF-IDF weighting, n-gram extraction, and placeholder detection
2. **`core/topic-extractor.ts`** (100 lines): Lightweight topic extraction with its own term selection logic
3. **`session-extractor.ts:381-437`** (inline): Session-level extraction with 136 stopwords (83 overlap with trigger-extractor, but 53 unique to session)
4. **`lib/semantic-summarizer.ts`** (wrapper): Delegates to trigger-extractor but adds its own post-processing

Stopword overlap analysis: session has 136 words, trigger-english has 119, with 83 overlap but 53 unique to session-extractor. The same input text produces materially different ranked term lists depending on which extractor processes it. This divergence means topic classification, trigger phrase generation, and semantic summaries can disagree on the same session data.

### Purpose

Build a unified script-side `SemanticSignalExtractor` with mode-aware extraction (`topics` / `triggers` / `summary` / `all`), a single canonical stopword-profile contract, configurable n-gram depth, and golden tests for regression detection. Script-side extractors become thin adapters over the new engine while the shared trigger extractor remains the frozen baseline for trigger-ranking parity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `SemanticSignalExtractor` with mode-aware extraction: `topics` / `triggers` / `summary` / `all`
- Consolidate 3 divergent stopword lists into a single profile with `balanced` and `aggressive` modes
- Support configurable n-gram depth (1-4 grams)
- Build golden tests with frozen input -> expected output for regression detection
- Convert `trigger-extractor.ts`, `topic-extractor.ts`, and `semantic-summarizer.ts` into thin adapters
- Remove inline extraction logic from `session-extractor.ts`

### Out of Scope

- Adding external NLP libraries or ML models -- term-frequency and TF-IDF remain the core algorithms
- Changing the output format of trigger phrases or topic lists -- only the internal engine changes
- Modifying how downstream consumers use extraction results -- adapter interfaces stay stable

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/lib/semantic-signal-extractor.ts` | Modify | Unified script-side engine with mode-aware extraction, canonical stopword profiles, and configurable n-grams |
| `scripts/lib/trigger-extractor.ts` | Modify | Convert the script-side trigger entrypoint into a thin adapter delegating to the unified engine while preserving shared-baseline behavior |
| `scripts/core/topic-extractor.ts` | Modify | Convert to thin adapter delegating to unified engine; keep public API stable |
| `scripts/extractors/session-extractor.ts` | Modify | Remove inline extraction logic (lines 381-437); delegate to unified engine |
| `scripts/lib/semantic-summarizer.ts` | Modify | Replace direct trigger-extractor calls with unified engine calls |
| `scripts/tests/semantic-signal-golden.vitest.ts` | Create | Frozen trigger/output regression coverage plus stopword-profile and n-gram-depth verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Single `SemanticSignalExtractor` with `mode: 'topics' \| 'triggers' \| 'summary' \| 'all'` | All extraction paths route through one engine; mode parameter controls output shape |
| REQ-002 | Single `stopwordProfile: 'balanced' \| 'aggressive'` replacing 3 divergent stopword lists | One canonical stopword list with mode-aware additions; no extractor maintains its own private stopword set |
| REQ-004 | Golden tests with frozen input -> expected output for regression detection | At least 3 golden test cases with fixed input text and deterministic expected ranked output |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Configurable n-gram depth (1-4 grams) | Extraction supports `ngramDepth: 1 \| 2 \| 3 \| 4` parameter; default is 2 |
| REQ-005 | Script-side extractors become thin adapters delegating to unified engine | `scripts/lib/trigger-extractor.ts`, `topic-extractor.ts`, `session-extractor.ts`, and `semantic-summarizer.ts` delegate script-side semantic preprocessing to the unified engine; public APIs unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Trigger extraction stays deterministic and baseline-compatible -- the shared trigger baseline, the script-side trigger adapter, and `SemanticSignalExtractor` trigger mode all return the same frozen ranked phrases for the same text
- **SC-002**: Stopword divergence eliminated for script-side consumers -- one canonical `balanced` / `aggressive` profile now feeds topic, session, and summary extraction, with shared trigger behavior preserved as the parity baseline
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None -- can be built independently | N/A | This is a foundational change; other phases (R-07 phase classification) depend on it |
| Risk | Unified stopword list changes ranked output for existing sessions | Medium | Golden tests lock expected output; differences are reviewed and accepted during migration |
| Risk | Adapter pattern adds an indirection layer that could affect performance on large sessions | Low | Unified engine is a direct replacement, not an additional layer; adapters are thin wrappers |
| Risk | Shared trigger extraction has accumulated edge-case handling that should not be destabilized during script-side unification | Medium | Keep the shared trigger extractor as the ranking baseline and lock parity with frozen golden tests before changing script-side callers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Full unification with adapters vs merge only topic+session extractors first?
<!-- /ANCHOR:questions -->

---

### Acceptance Scenarios

### Scenario 1: Trigger baseline parity

**Given** a frozen technical implementation input, **when** the shared trigger extractor, the script-side trigger adapter, and `SemanticSignalExtractor` trigger mode run on the same text, **then** they return the same ranked trigger phrases.

### Scenario 2: Aggressive topic cleanup

**Given** script-heavy topic text that includes `session`, `tool`, and `message`, **when** `balanced` and `aggressive` filtering are compared, **then** `balanced` keeps the baseline tokens available and `aggressive` removes those script-noise terms while preserving the domain concepts.

### Scenario 3: Topic/session alignment

**Given** the same summary and decision context, **when** `topic-extractor.ts` and `session-extractor.ts` extract dominant concepts, **then** they return overlapping concepts from the unified stopword-profile contract instead of diverging because of separate local stopword lists.

### Scenario 4: Summary integration

**Given** implementation messages routed through `semantic-summarizer.ts`, **when** summary trigger phrases are generated, **then** the output surfaces the same dominant concepts as the unified engine rather than falling back to a separate local extraction path.
