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
| **Status** | Draft |
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

Phase labeling uses a 6-label precedence ladder (Research / Planning / Implementation / Debugging / Verification / Discussion) without topic awareness. The classifier checks keywords in priority order and assigns the first match, producing misclassifications like "grep in debug output" being labeled as Research instead of Debugging. Repeated returns to the same phase are merged into a single duration entry, losing the non-contiguous structure (e.g., Research -> Implementation -> Research collapses into one Research duration). `FLOW_PATTERN` is derived from two boolean checks rather than structural analysis of phase transitions. Observation types are limited to bugfix/feature/refactor/decision/research/discovery -- missing test, documentation, and performance categories.

### Purpose

Replace single-rule keyword-precedence phase classification with scored topic clusters that use per-exchange document vectors, track non-contiguous phase returns separately, expand observation types, and derive `FLOW_PATTERN` from cluster branching structure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define `TopicCluster` interface for grouped message exchanges with phase scoring
- Build per-exchange document vectors using trigger-extractor preprocessing
- Replace keyword-precedence classifier with cluster-level phase scoring
- Track non-contiguous phase returns as separate timeline entries
- Expand observation types: add test, documentation, performance to the existing set
- Derive `FLOW_PATTERN` from cluster branching structure instead of boolean checks

### Out of Scope

- External NLP libraries or ML model dependencies -- classification uses term-frequency scoring only
- Changing the set of 6 phase labels -- only the classification method changes
- Modifying session boundary detection -- only intra-session phase assignment changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/extractors/session-extractor.ts` | Modify | Replace keyword-precedence ladder with cluster-level phase scoring; track non-contiguous phase returns separately |
| `scripts/extractors/collect-session-data.ts` | Modify | Support `TopicCluster` output alongside existing session data structures |
| `scripts/extractors/file-extractor.ts` | Modify | Add test, documentation, performance observation types to observation classification |
| `scripts/lib/trigger-extractor.ts` | Modify | Provide topic preprocessing for per-exchange document vector construction |
| `scripts/extractors/conversation-extractor.ts` | Modify | FLOW_PATTERN, AUTO_GENERATED_FLOW, MESSAGE_TIME_WINDOW constants and logic live here; update for cluster-derived flow patterns |
| `templates/core/context_template.md` | Modify | Add expanded observation type placeholders (test, documentation, performance) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `TopicCluster` interface: `{ id, label, messageIndexes, observationIndexes, dominantTerms, phaseScores, primaryPhase, confidence }` | Interface defined and used by session extractor for all phase classification |
| REQ-002 | Per-exchange document vectors using trigger-extractor preprocessing | Each conversation exchange produces a term-frequency vector used for cluster assignment |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Observation types expanded: add test, documentation, performance to existing bugfix/feature/refactor/decision/research/discovery | All 9 observation types recognized and classified correctly |
| REQ-004 | Repeated phase returns tracked separately instead of merged | Phase timeline shows separate entries for non-contiguous returns (e.g., Research -> Implementation -> Research produces 3 entries) |
| REQ-005 | `FLOW_PATTERN` derived from cluster branching, not boolean checks | Flow pattern reflects actual transition structure: linear / branching / iterative / exploratory |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: "grep in debug output" classified as Debugging, not Research -- context-aware scoring overrides keyword precedence
- **SC-002**: Phase timeline shows separate entries for non-contiguous Research -> Implementation -> Research instead of merging into one Research duration
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-08 unified signal extractor (008-signal-extraction) | High -- provides the topic preprocessing infrastructure for document vectors | Sequence as C2-C3 after B1 completion |
| Risk | Cluster-based classification may produce different phase distributions than the precedence ladder | Medium | Run both classifiers in parallel during testing to compare outputs and calibrate scoring weights |
| Risk | Non-contiguous phase tracking increases timeline verbosity | Low | Downstream renderers can optionally merge adjacent same-phase entries for compact display |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Full TF-IDF with real IDF (requires corpus management) vs enhanced TF-only with adjacency merging?
<!-- /ANCHOR:questions -->
