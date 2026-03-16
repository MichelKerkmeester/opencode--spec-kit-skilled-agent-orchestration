---
title: "Implementation Plan: Phase Classification"
---
# Implementation Plan: Phase Classification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline |
| **Storage** | None (in-memory session data) |
| **Testing** | Vitest |

### Overview

This plan implements a cluster classification pattern: build per-exchange document vectors from trigger-extractor preprocessing, group exchanges into topic clusters by term-frequency similarity, label each cluster from combined evidence rather than keyword precedence, track non-contiguous phase returns as separate timeline entries, expand observation types with test/documentation/performance, and derive `FLOW_PATTERN` from cluster transition structure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-08 signal extraction)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-005)
- [ ] Tests passing -- context-aware classification correct; non-contiguous phases tracked
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Cluster classification -- replace a precedence-based keyword classifier with a scoring system that groups exchanges by topic similarity, assigns phases from aggregate evidence, and preserves temporal structure.

### Key Components

- **`TopicCluster` interface**: Groups related message exchanges with phase scores, dominant terms, and confidence
- **Document vector builder**: Converts each exchange into a term-frequency vector using trigger-extractor preprocessing
- **Cluster phase scorer**: Assigns phase labels from aggregate term evidence across cluster members instead of single-keyword precedence
- **Non-contiguous phase tracker**: Maintains separate timeline entries when phase identity recurs after interruption
- **Flow pattern deriver**: Analyzes cluster transition graph to classify session flow as linear / branching / iterative / exploratory

### Data Flow

1. Trigger-extractor preprocesses each conversation exchange into normalized terms
2. Document vector builder constructs term-frequency vectors for each exchange
3. Exchanges are grouped into topic clusters by cosine similarity on term vectors
4. Each cluster receives phase scores across all 6 labels based on aggregate term evidence
5. Primary phase is assigned as the highest-scoring label with confidence
6. Non-contiguous returns to the same phase produce separate timeline entries
7. `FLOW_PATTERN` is derived from the cluster transition graph (linear chain vs. branching vs. cycles)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: TopicCluster Interface & Observation Types

- [ ] Define `TopicCluster` interface in session types: `{ id, label, messageIndexes, observationIndexes, dominantTerms, phaseScores, primaryPhase, confidence }`
- [ ] Add observation types: `test`, `documentation`, `performance` to existing enum/union
- [ ] Update observation classification logic in `file-extractor.ts` to recognize new types

### Phase 2: Document Vector Construction

- [ ] Add `buildExchangeVector(exchange: Exchange): TermVector` function using trigger-extractor preprocessing
- [ ] Normalize terms: lowercase, stemming via existing trigger-extractor pipeline, stopword removal
- [ ] Produce term-frequency map per exchange for downstream clustering

### Phase 3: Cluster-Based Phase Scoring

- [ ] Replace keyword-precedence ladder in `session-extractor.ts` with cluster scoring
- [ ] Group exchanges by cosine similarity on term vectors (threshold-based agglomerative clustering)
- [ ] For each cluster, compute phase scores: sum term weights for each of the 6 phase categories
- [ ] Assign `primaryPhase` as the highest-scoring category; `confidence` as ratio of top score to total
- [ ] Handle "grep in debug" case: debug-context terms outweigh the grep/search research terms

### Phase 4: Non-Contiguous Phase Tracking & Flow Pattern

- [ ] Modify phase timeline builder to emit separate entries when a phase recurs after interruption
- [ ] Each timeline entry records: phase label, start index, end index, cluster ID, confidence
- [ ] Derive `FLOW_PATTERN` from cluster transition graph:
  - `linear`: strictly sequential phase progression (A -> B -> C)
  - `branching`: multiple parallel topic threads
  - `iterative`: same phase returns after interruption (A -> B -> A)
  - `exploratory`: frequent short clusters with low confidence

### Phase 5: Verification

- [ ] Add test for "grep in debug output" -> Debugging classification
- [ ] Add test for Research -> Implementation -> Research producing 3 timeline entries
- [ ] Add test for new observation types (test, documentation, performance)
- [ ] Add test for `FLOW_PATTERN` derivation from known cluster structures
- [ ] Verify existing phase classification tests still pass with updated scoring
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Document vector construction from trigger-extractor preprocessing | Vitest |
| Unit | Cluster phase scoring vs. keyword precedence for ambiguous inputs | Vitest |
| Unit | Non-contiguous phase tracking produces separate timeline entries | Vitest |
| Unit | Flow pattern derivation from cluster transition graphs | Vitest |
| Integration | End-to-end session extraction with cluster classification | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-08 signal extraction (008-signal-extraction) | Internal | Yellow | Unified signal extractor provides topic preprocessing infrastructure; blocked until B1 completes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cluster-based classification produces materially worse phase distributions than the precedence ladder
- **Procedure**: Restore keyword-precedence ladder in `session-extractor.ts`; remove `TopicCluster` interface usage; non-contiguous tracking and observation type additions can remain as they are independent of the classification method
<!-- /ANCHOR:rollback -->
