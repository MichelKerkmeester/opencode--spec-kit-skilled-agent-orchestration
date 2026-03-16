---
title: "Implementation Plan: Phase Classification"
---
# Implementation Plan: Phase Classification

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
| **Storage** | None (in-memory session data) |
| **Testing** | Vitest |

### Overview

This plan ships `007` on top of the completed `008` signal contract. The conversation extractor builds one exchange per user prompt, the new phase classifier turns those exchanges into weighted semantic vectors, clusters them contiguously in timeline order, scores the resulting clusters across the 6 canonical phases, preserves repeated returns as separate phase segments, expands observation taxonomy, and derives `FLOW_PATTERN` from topic-link structure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-08 signal extraction)

### Definition of Done

- [x] All acceptance criteria met (REQ-001 through REQ-005)
- [x] Targeted tests passing -- context-aware classification correct; non-contiguous phases tracked
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Cluster classification rooted in the unified `SemanticSignalExtractor` contract from `008`.

### Key Components

- **`scripts/utils/phase-classifier.ts`**: Single owner for exchange signal building, contiguous clustering, phase scoring, cluster confidence, and flow-pattern derivation
- **`conversation-extractor.ts`**: Builds exchanges from prompts + matched observations, then emits `PHASES`, `TOPIC_CLUSTERS`, `UNIQUE_PHASE_COUNT`, and `FLOW_PATTERN`
- **`tool-detection.ts`**: Retains tool/prose helpers and exposes a compatibility shim for `classifyConversationPhase()`
- **`session-types.ts`**: Defines `TopicCluster`, `PhaseScoreMap`, `ConversationPhaseLabel`, and the expanded conversation contract
- **`file-extractor.ts`**: Expands observation-type detection for `test`, `documentation`, and `performance`

### Data Flow

1. `conversation-extractor.ts` builds one exchange per user prompt plus the observations in its time window.
2. `phase-classifier.ts` composes exchange text from prompt, observation narrative, coerced facts, tool names, and observation types.
3. `SemanticSignalExtractor.extract({ mode: 'all', stopwordProfile: 'aggressive', ngramDepth: 2 })` produces topics, phrases, and filtered tokens.
4. The classifier builds a deterministic weighted vector: topics `3`, phrases `2`, filtered tokens `1`, tools `2`, observation types `2`.
5. Exchanges are clustered contiguously by `0.7 * cosine + 0.3 * Jaccard >= 0.55`; repeated later returns remain separate clusters.
6. Each cluster is scored across Research / Planning / Implementation / Debugging / Verification / Discussion, with an explicit debugging override for search-plus-error sessions.
7. The classifier emits ordered phase segments plus topic clusters and derives `FLOW_PATTERN` from iterative recurrence, exploratory breadth, and topic-link branching.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Type and extractor ownership

- [x] Add `ConversationPhaseLabel`, `PhaseScoreMap`, and `TopicCluster` to `session-types.ts`
- [x] Expand `ConversationPhase` and `ConversationData` with cluster metadata, `TOPIC_CLUSTERS`, and `UNIQUE_PHASE_COUNT`
- [x] Expand observation-type detection for `test`, `documentation`, and `performance`

### Phase 2: Exchange classification and compatibility

- [x] Add `scripts/utils/phase-classifier.ts`
- [x] Build exchange text from prompt, narratives, coerced fact text, tool names, and observation types
- [x] Use `SemanticSignalExtractor.extract({ mode: 'all', stopwordProfile: 'aggressive', ngramDepth: 2 })`
- [x] Build deterministic weighted vectors and contiguous-first topic clusters
- [x] Keep `tool-detection.ts` as a compatibility shim for legacy phase-classification callers

### Phase 3: Timeline output and flow pattern

- [x] Rework `conversation-extractor.ts` to classify ordered exchanges rather than using a direct precedence ladder
- [x] Preserve repeated phase returns as separate phase segments with cluster metadata
- [x] Derive `FLOW_PATTERN` as `Linear Sequential`, `Iterative Loop`, `Branching Investigation`, or `Exploratory Sweep`
- [x] Align simulation fallback and context-template wording with the richer conversation contract

### Phase 4: Verification

- [x] Add `phase-classification.vitest.ts` for debugging override, iterative returns, observation types, flow patterns, and low-signal fallback
- [x] Update extractor and module regression suites for new flow-pattern values and conversation metadata
- [x] Rebuild `scripts/dist` and rerun targeted verification suites
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Exchange scoring, debugging override, low-signal fallback | Vitest |
| Unit | Observation typing and flow-pattern derivation | Vitest |
| Integration | End-to-end conversation extraction with topic clusters and repeated phase returns | Vitest |
| Regression | Extractor/loaders and module compatibility suites against `scripts/dist` | Node.js scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-08 signal extraction (008-signal-extraction) | Internal | Green | The unified signal extractor is now the active upstream contract for `007` classification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Topic clusters or phase scoring introduce incorrect timeline output in targeted regression coverage
- **Procedure**: Revert `conversation-extractor.ts`, `tool-detection.ts`, `session-types.ts`, and `phase-classifier.ts` together so the compatibility seam returns to the legacy ladder without leaving the conversation contract half-migrated
<!-- /ANCHOR:rollback -->
