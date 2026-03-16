---
title: "Feature Specification: Signal Extraction"
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
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [010-perfect-session-capturing](../spec.md) |
| **R-Item** | R-08 |
| **Sequence** | B1 |
<!-- /ANCHOR:metadata -->

---

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

Build a unified `SemanticSignalExtractor` with mode-aware extraction (`topics` / `triggers` / `summary` / `all`), a single canonical stopword profile, configurable n-gram depth, and golden tests for regression detection. Existing extractors become thin adapters delegating to the unified engine.
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
| `scripts/lib/semantic-signal-extractor.ts` | Create | New unified engine with mode-aware extraction, canonical stopwords, configurable n-grams |
| `scripts/shared/trigger-extractor.ts` | Modify | Convert to thin adapter delegating to unified engine; keep public API stable |
| `scripts/core/topic-extractor.ts` | Modify | Convert to thin adapter delegating to unified engine; keep public API stable |
| `scripts/extractors/session-extractor.ts` | Modify | Remove inline extraction logic (lines 381-437); delegate to unified engine |
| `scripts/lib/semantic-summarizer.ts` | Modify | Replace direct trigger-extractor calls with unified engine calls |
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
| REQ-005 | Existing 3 extractors become thin adapters delegating to unified engine | `trigger-extractor.ts`, `topic-extractor.ts`, and `semantic-summarizer.ts` delegate all extraction logic; public APIs unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Same input produces deterministic, ranked output regardless of call path -- trigger-extractor, topic-extractor, session-extractor, and semantic-summarizer all produce consistent results for the same text
- **SC-002**: Stopword divergence eliminated -- one canonical list with mode-aware additions; the 53 session-only stopwords and 36 trigger-only stopwords are reconciled into the unified profile
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None -- can be built independently | N/A | This is a foundational change; other phases (R-07 phase classification) depend on it |
| Risk | Unified stopword list changes ranked output for existing sessions | Medium | Golden tests lock expected output; differences are reviewed and accepted during migration |
| Risk | Adapter pattern adds an indirection layer that could affect performance on large sessions | Low | Unified engine is a direct replacement, not an additional layer; adapters are thin wrappers |
| Risk | `trigger-extractor.ts` at 659 lines has accumulated edge-case handling that may not transfer cleanly | Medium | Migrate feature-by-feature with tests validating each edge case; adapter keeps old code accessible during transition |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Full unification with adapters vs merge only topic+session extractors first?
<!-- /ANCHOR:questions -->
