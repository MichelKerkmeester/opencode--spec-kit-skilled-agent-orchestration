---
title: "Feature Specification: Phase Classification"
---
# Feature Specification: Phase Classification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [010-perfect-session-capturing](../spec.md) |
| **R-Item** | R-07 |
| **Sequence** | C2-C3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Conversation phase handling previously lived in a keyword-precedence ladder that favored early matches over richer context, so ambiguous exchanges like "grep in debug output" could resolve to Research instead of Debugging. Timeline output also merged repeated returns to the same phase into one duration bucket, which erased non-contiguous structures such as Research -> Implementation -> Research. `FLOW_PATTERN` used coarse boolean heuristics instead of structural analysis, and observation typing did not distinguish test, documentation, or performance work.

### Purpose

Ship a conversation-phase classifier that builds exchange-level semantic signals from the unified `008` extractor contract, clusters exchanges in timeline order, scores each cluster across the 6 canonical phases, preserves repeated phase returns as separate segments, expands observation taxonomy, and derives `FLOW_PATTERN` from topic-link structure instead of a simple precedence ladder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `scripts/utils/phase-classifier.ts` as the single owner of exchange signal building, clustering, phase scoring, confidence, and flow-pattern derivation
- Build each exchange from user prompt text, matched observation narratives, coerced fact text, tool names, and observation types
- Use `SemanticSignalExtractor.extract({ mode: 'all', stopwordProfile: 'aggressive', ngramDepth: 2 })` as the phase-classification signal contract from `008`
- Expand `ConversationPhase` / `ConversationData` with cluster metadata, ordered phase segments, `TOPIC_CLUSTERS`, and `UNIQUE_PHASE_COUNT`
- Expand observation types with `test`, `documentation`, and `performance`
- Update the context template wording so conversation summaries refer to phase segments and unique phase count

### Out of Scope

- Changing the 6 canonical conversation-phase labels
- Modifying `session-extractor.ts` project-phase heuristics
- Changing `AUTO_GENERATED_FLOW` generation or `scripts/lib/flowchart-generator.ts`
- Introducing non-contiguous cluster merging; repeated returns remain distinct timeline segments

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/utils/phase-classifier.ts` | Add | Own exchange signal building, clustering, scoring, confidence, and `FLOW_PATTERN` derivation |
| `scripts/utils/tool-detection.ts` | Modify | Keep tool detection/prose logic and delegate compatibility phase classification to the new classifier |
| `scripts/extractors/conversation-extractor.ts` | Modify | Build ordered exchanges, emit timeline segments, `TOPIC_CLUSTERS`, `UNIQUE_PHASE_COUNT`, and upgraded `FLOW_PATTERN` |
| `scripts/extractors/file-extractor.ts` | Modify | Add test, documentation, performance observation types to observation classification |
| `scripts/types/session-types.ts` | Modify | Add `TopicCluster`, phase-score types, and richer conversation metadata |
| `scripts/lib/simulation-factory.ts` | Modify | Keep simulation fallback aligned with the expanded conversation contract |
| `templates/context_template` | Modify | Update conversation summary wording for phase segments and unique phase count |
| `scripts/tests/phase-classification.vitest.ts` | Add | Lock regression coverage for scoring, clustering, observation types, and flow patterns |
| `scripts/tests/test-extractors-loaders.js` | Modify | Verify repeated phase returns, new flow-pattern values, and new conversation fields |
| `scripts/tests/test-scripts-modules.js` | Modify | Verify the compatibility wrapper and the new classifier module |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `TopicCluster` interface: `{ id, label, messageIndexes, observationIndexes, dominantTerms, phaseScores, primaryPhase, confidence }` and richer `ConversationPhase` / `ConversationData` metadata | Canonical types exist in `session-types.ts` and are emitted by conversation extraction |
| REQ-002 | Exchange classification must use the `008` unified signal contract | Each exchange uses `SemanticSignalExtractor.extract({ mode: 'all', stopwordProfile: 'aggressive', ngramDepth: 2 })` plus deterministic weights for topics, phrases, filtered tokens, tools, and observation types |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Observation types expanded: add test, documentation, performance to existing bugfix/feature/refactor/decision/research/discovery | All 9 observation types recognized and classified correctly |
| REQ-004 | Repeated phase returns tracked separately instead of merged | `PHASES` remains an ordered timeline of phase segments with cluster ID, confidence, start/end indexes, and dominant terms |
| REQ-005 | `FLOW_PATTERN` derived from cluster branching, not boolean checks | Flow pattern resolves to `Linear Sequential`, `Iterative Loop`, `Branching Investigation`, or `Exploratory Sweep` from cluster structure |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: "grep in debug output" resolves to `Debugging`, not `Research`
- **SC-002**: Research -> Implementation -> Research remains 3 separate phase segments with `UNIQUE_PHASE_COUNT = 2`
- **SC-003**: Flow-pattern derivation covers all 4 user-facing outputs without crashing on low-signal exchanges
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-08 unified signal extractor (008-signal-extraction) | High -- phase signals are intentionally built on its stable extraction contract | Completed first; `007` only consumes the new contract |
| Risk | Cluster-level scoring can shift phase assignments versus the legacy ladder | Medium | Lock targeted fixtures for debugging, iterative returns, low-signal fallback, and flow-pattern derivation |
| Risk | Broader legacy module suites contain unrelated baseline failures | Low | Treat `T-024e`, `T-024f`, and `T-032` as pre-existing baseline issues unless this phase introduces new failures |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at implementation close-out. The phase shipped with deterministic weighted vectors rather than corpus-managed TF-IDF.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 8. ACCEPTANCE SCENARIOS

### Scenario 1: Search plus error resolves to Debugging

**Given** a search-heavy exchange that also contains error or debug language, **when** the classifier scores the exchange, **then** the phase resolves to `Debugging` rather than `Research`.

### Scenario 2: Non-contiguous returns stay separate

**Given** a conversation with Research -> Implementation -> Research in non-contiguous order, **when** the timeline is emitted, **then** `PHASES` contains 3 separate segments and `UNIQUE_PHASE_COUNT` remains `2`.

### Scenario 3: All flow-pattern outcomes are covered

**Given** conversation clusters that form a revisiting loop, a branch, a low-confidence exploratory sweep, or a simple line, **when** `FLOW_PATTERN` is derived, **then** the result is one of `Iterative Loop`, `Branching Investigation`, `Exploratory Sweep`, or `Linear Sequential`.

### Scenario 4: Observation taxonomy expands without template branching

**Given** observations that describe tests, documentation work, or performance tuning, **when** file observations are typed, **then** the new categories are emitted without introducing template-specific special casing.
<!-- /ANCHOR:acceptance-scenarios -->
