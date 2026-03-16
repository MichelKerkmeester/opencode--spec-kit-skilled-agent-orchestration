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

This plan implemented a script-side adapter migration pattern: keep the shared trigger extractor as the parity baseline, route script-side trigger/topic/session/summary callers through a unified `SemanticSignalExtractor`, and lock the behavior with frozen golden tests plus targeted regression suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none -- foundational)

### Definition of Done

- [x] All acceptance criteria met for the shipped script-side unification pass (REQ-001 through REQ-005)
- [x] Tests passing -- golden tests lock trigger output, targeted extractor suites stay green, and script-side callers share one stopword-profile contract
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Adapter migration -- preserve the shared trigger extractor as the ranking baseline, build the unified script-side engine alongside it, validate parity with frozen tests, then convert script-side callers to thin adapters one by one.

### Key Components

- **`SemanticSignalExtractor` (`scripts/lib/semantic-signal-extractor.ts`)**: Core script-side engine with mode-aware extraction, canonical stopword profiles, n-gram depth control, and stats
- **Canonical stopword profile**: Single source of truth with `balanced` mode (shared trigger baseline filtering) and `aggressive` mode (balanced + topic/session/script-noise stopwords)
- **Mode-aware extraction**: `topics` returns ranked topic terms, `triggers` returns trigger phrase candidates, `summary` returns semantic summary terms, `all` returns combined output
- **Adapter layer**: `scripts/lib/trigger-extractor.ts`, `topic-extractor.ts`, `session-extractor.ts`, and `semantic-summarizer.ts` preserve their public API signatures while delegating semantic preprocessing to the unified engine

### Data Flow

1. Caller invokes any script-side extraction entry point (`scripts/lib/trigger-extractor.ts`, `topic-extractor.ts`, `session-extractor.ts`, `semantic-summarizer.ts`)
2. Adapter translates call to `SemanticSignalExtractor.extract({ text, mode, stopwordProfile, ngramDepth })`
3. Unified engine: remove markdown -> tokenize -> remove stopwords (profile-aware) -> compute n-grams (1-4) -> score and rank -> return phrases/topics/stats
4. Adapters transform unified output back to each caller's expected format
5. Trigger mode stays baseline-compatible while topic/session/summary paths align on the same dominant concepts and stopword profiles
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Golden Tests (Test-First)

- [x] Create `scripts/tests/semantic-signal-golden.vitest.ts`
- [x] Define 3 frozen input texts covering technical implementation, debugging, and research/planning
- [x] Record expected ranked output from the shared trigger extractor as the baseline
- [x] Validate script-side trigger mode against the frozen baseline after adapter wiring

### Phase 2: Unified Engine Construction

- [x] Use `scripts/lib/semantic-signal-extractor.ts` as the script-side semantic owner with `SemanticSignalExtractor`
- [x] Implement `extract({ text, mode, stopwordProfile, ngramDepth })` plus script-facing helper entrypoints
- [x] Consolidate script-side stopwords into `balanced` and `aggressive` profiles
- [x] Reuse shared trigger scoring primitives so trigger ranking stays consistent with the historical baseline
- [x] Support n-gram extraction depths 1-4 while keeping topic/session callers on default depth 2 and trigger parity on depth 4
- [x] Return mode-specific phrase/topic output and stats from one contract

### Phase 3: Adapter Migration

- [x] `scripts/lib/trigger-extractor.ts`: delegate trigger extraction to `SemanticSignalExtractor` while preserving shared-baseline output
- [x] `topic-extractor.ts`: replace local stopword/topic scoring with `SemanticSignalExtractor.extractTopicTerms(...)`
- [x] `session-extractor.ts`: remove the inline topic stopword owner and delegate topic selection to the unified engine
- [x] `semantic-summarizer.ts`: replace direct trigger extraction with `SemanticSignalExtractor.extract({ mode: 'summary' })`
- [x] Re-run golden tests after the adapter pass

### Phase 4: Verification & Cleanup

- [x] Run all golden tests -- trigger extraction matches locked shared-baseline expectations
- [x] Run targeted extractor suites (`semantic-signal-golden.vitest.ts`, `description-enrichment.vitest.ts`, `decision-confidence.vitest.ts`, `test-extractors-loaders.js`)
- [x] Verify topic/session/summary paths align on the same dominant concepts
- [x] Verify stopword divergence eliminated for script-side consumers through `balanced` and `aggressive` profiles
- [x] Document the shipped design as a script-side unification pass that preserves the shared trigger baseline
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
| Integration | Trigger parity plus topic/session/summary dominant-concept alignment across call paths | Vitest |
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
