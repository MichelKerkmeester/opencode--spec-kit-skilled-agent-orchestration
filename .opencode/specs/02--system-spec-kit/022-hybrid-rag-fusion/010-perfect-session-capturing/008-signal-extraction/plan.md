---
title: "Implementation Plan: Signal Extraction"
---
# Implementation Plan: Signal Extraction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline |
| **Storage** | None (in-memory text processing) |
| **Testing** | Vitest |

### Overview

This plan implements an adapter migration pattern: build a unified `SemanticSignalExtractor` with mode-aware extraction and a single canonical stopword profile, create golden tests to lock expected output, then convert the three existing extractors (`trigger-extractor.ts`, `topic-extractor.ts`, `semantic-summarizer.ts`) into thin adapters delegating to the unified engine, and remove inline extraction from `session-extractor.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none -- foundational)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-005)
- [ ] Tests passing -- golden tests lock output; all call paths produce consistent results
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Adapter migration -- build the unified engine alongside existing extractors, validate with golden tests, then convert existing extractors to thin adapters one by one, verifying each migration step independently.

### Key Components

- **`SemanticSignalExtractor` (`scripts/lib/semantic-signal-extractor.ts`)**: Core unified engine with mode-aware extraction, canonical stopwords, and configurable n-gram depth
- **Canonical stopword profile**: Single source of truth with `balanced` mode (common English + code noise) and `aggressive` mode (balanced + domain-specific filler terms)
- **Mode-aware extraction**: `topics` returns ranked topic terms, `triggers` returns trigger phrase candidates, `summary` returns semantic summary terms, `all` returns combined output
- **Adapter layer**: `trigger-extractor.ts`, `topic-extractor.ts`, `semantic-summarizer.ts` become thin wrappers preserving their public API signatures

### Data Flow

1. Caller invokes any extraction entry point (trigger-extractor, topic-extractor, session-extractor, semantic-summarizer)
2. Adapter translates call to `SemanticSignalExtractor.extract({ text, mode, stopwordProfile, ngramDepth })`
3. Unified engine: tokenize -> remove stopwords (profile-aware) -> compute n-grams (1-4) -> TF-IDF weight -> rank -> return
4. Adapter transforms unified output back to the caller's expected format
5. All paths produce deterministic ranked output for the same input
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Golden Tests (Test-First)

- [ ] Create `scripts/tests/semantic-signal-golden.vitest.ts`
- [ ] Define 3+ frozen input texts covering: technical discussion, debugging session, research/planning
- [ ] Record expected ranked output from the current trigger-extractor as baseline
- [ ] Tests initially validate current behavior; after migration they validate unified engine parity

### Phase 2: Unified Engine Construction

- [ ] Create `scripts/lib/semantic-signal-extractor.ts` with `SemanticSignalExtractor` class
- [ ] Implement `extract({ text, mode, stopwordProfile, ngramDepth })` core method
- [ ] Consolidate stopwords:
  - Merge 119 trigger-english + 136 session-extractor lists
  - Resolve 53 session-only words: include in `balanced` or move to `aggressive`
  - Resolve 36 trigger-only words: include in `balanced` or move to `aggressive`
  - Result: one `balanced` list (~130-150 words) + one `aggressive` list (balanced + ~30-40 domain filler)
- [ ] Implement n-gram extraction for depths 1-4 (default: 2)
- [ ] Implement TF-IDF weighting consistent with existing trigger-extractor logic
- [ ] Implement mode-specific post-processing:
  - `topics`: return top-N ranked terms with frequency counts
  - `triggers`: return phrase candidates with relevance scores
  - `summary`: return semantic summary terms with context
  - `all`: return combined output structure

### Phase 3: Adapter Migration

- [ ] **trigger-extractor.ts**: Replace internal extraction with `SemanticSignalExtractor.extract({ mode: 'triggers' })`; keep all public functions (`extractTriggers`, `extractKeyTerms`, etc.) with same signatures
- [ ] **topic-extractor.ts**: Replace internal logic with `SemanticSignalExtractor.extract({ mode: 'topics' })`; keep `extractTopics` signature stable
- [ ] **session-extractor.ts**: Remove inline extraction (lines 381-437); replace with `SemanticSignalExtractor.extract({ mode: 'all' })` call
- [ ] **semantic-summarizer.ts**: Replace trigger-extractor delegation with `SemanticSignalExtractor.extract({ mode: 'summary' })`
- [ ] Migrate one adapter at a time; run golden tests after each migration

### Phase 4: Verification & Cleanup

- [ ] Run all golden tests -- unified engine produces deterministic output matching locked expectations
- [ ] Run existing extractor test suites -- all pass through adapter layer
- [ ] Verify same input through all 4 call paths produces identical ranked output
- [ ] Remove dead code from migrated extractors (private helper functions no longer called)
- [ ] Document the stopword reconciliation decisions (which session-only words were kept/dropped)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Golden | Frozen input -> expected ranked output for regression detection | Vitest |
| Unit | Stopword profile application (`balanced` vs. `aggressive`) | Vitest |
| Unit | N-gram extraction at depths 1-4 | Vitest |
| Unit | Mode-aware output shape (`topics` / `triggers` / `summary` / `all`) | Vitest |
| Integration | Same input through all 4 call paths produces identical results | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | This is a foundational change with no upstream dependencies; R-07 (phase classification) depends on this completing first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Unified engine produces materially different ranked output that breaks downstream consumers (trigger phrases, topic classification, semantic summaries)
- **Procedure**: Revert adapter changes so extractors use their original internal logic; the unified engine file can remain in the codebase without being called; golden tests document the expected behavior for a subsequent migration attempt
<!-- /ANCHOR:rollback -->
