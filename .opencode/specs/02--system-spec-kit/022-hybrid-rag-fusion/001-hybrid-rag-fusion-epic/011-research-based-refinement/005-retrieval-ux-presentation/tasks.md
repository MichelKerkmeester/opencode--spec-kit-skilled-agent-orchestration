---
title: "...t/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/005-retrieval-ux-presentation/tasks]"
description: "tasks document for 005-retrieval-ux-presentation."
trigger_phrases:
  - "022"
  - "hybrid"
  - "rag"
  - "fusion"
  - "001"
  - "tasks"
  - "005"
  - "retrieval"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Retrieval UX & Result Presentation

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->


## Phase A: Recovery & Confidence

### REQ-D5-001: Empty/Weak Result Recovery

- [ ] **A-01** Implement recovery status classification — detect `no_results`, `low_confidence`, and `partial` states from retrieval output in `search-results.ts`
- [ ] **A-02** Implement failure reason classification — map retrieval context to `spec_filter_too_narrow`, `low_signal_query`, or `knowledge_gap` reasons
- [ ] **A-03** Implement suggested query reformulation — generate 1-3 broader/rephrased alternative queries based on the original query and failure reason
- [ ] **A-04** Implement `recommendedAction` logic — select `retry_broader`, `switch_mode`, `save_memory`, or `ask_user` based on status + reason combination
- [ ] **A-05** Wire recovery payload into `envelope.ts` — ensure recovery metadata is included in the trace envelope for all empty/weak results
- [ ] **A-06** Add `SPECKIT_EMPTY_RESULT_RECOVERY_V1` feature flag gating
- [ ] **A-07** Write tests for recovery status, reason, suggested queries, and recommended action logic

### REQ-D5-004: Per-Result Calibrated Confidence

- [ ] **A-08** Create `confidence-scoring.ts` module with public scoring interface
- [ ] **A-09** Implement margin calculation — compute score distance between top result and next-best
- [ ] **A-10** Implement multi-channel agreement detection — flag when 2+ channels (vector, FTS, graph) agree on ranking
- [ ] **A-11** Implement driver labeling — map scoring signals to human-readable driver strings (`large_margin`, `multi_channel_agreement`, `reranker_boost`, `anchor_density`)
- [ ] **A-12** Implement confidence label + value computation — combine margin, agreement, reranker, and anchor density into `high`/`medium`/`low` label plus 0-1 numeric value
- [ ] **A-13** Implement request quality assessment — evaluate query-level quality as `good`, `weak`, or `gap`
- [ ] **A-14** Integrate confidence output into `search-results.ts` result objects
- [ ] **A-15** Write tests for confidence scoring (margin, agreement, drivers, labels, edge cases)

---

## Phase B: Explainability & Profiles

### REQ-D5-002: Two-Tier Explainability

- [ ] **B-01** Implement `why.summary` generation — compose a natural-language sentence from top scoring signals explaining why a result ranked where it did
- [ ] **B-02** Implement `topSignals` extraction — select the 2-4 most influential signals from fusion scoring data
- [ ] **B-03** Extract channel contribution data from `stage2-fusion.ts` — expose per-channel score breakdown (vector, FTS, graph weights) for the explain layer
- [ ] **B-04** Implement slim explainability tier (default) — attach `why.summary` + `topSignals` to every result
- [ ] **B-05** Implement debug explainability tier (opt-in) — include full `channelContribution` map and raw scoring details when `debug.enabled` is true
- [ ] **B-06** Write tests for both explainability tiers (slim default, debug opt-in, channel attribution accuracy)

### REQ-D5-003: Mode-Aware Response Shape

- [ ] **B-07** Implement presentation profile router — accept profile parameter (`quick`, `research`, `resume`, `debug`) and dispatch to the correct formatter
- [ ] **B-08** Implement `quick` formatter — produce `topResult` + `oneLineWhy` + `omittedCount`
- [ ] **B-09** Implement `research` formatter — produce `results[]` + `evidenceDigest` + `followUps[]`
- [ ] **B-10** Implement `resume` formatter — produce `state` + `nextSteps` + `blockers`
- [ ] **B-11** Implement `debug` formatter — produce full trace with no field omission
- [ ] **B-12** Add profile parameter to `memory-search.ts` and `memory-context.ts` interfaces
- [ ] **B-13** Write tests for all four profile formatters (shape validation, token reduction for quick mode)

---


## Phase C: Progressive Disclosure & Session State

### REQ-D5-005: Progressive Disclosure

- [ ] **C-01** Implement summary layer generation — produce `count` + `digest` string summarizing result distribution (strong/weak/conflict)
- [ ] **C-02** Implement snippet extraction with `detailAvailable` flag — produce compact result previews indicating whether full detail can be fetched
- [ ] **C-03** Implement continuation cursor generation — create opaque cursor tokens that encode position in the full result set
- [ ] **C-04** Implement cursor-based detail retrieval — accept a cursor and return the next page of detailed results
- [ ] **C-05** Replace hard tail-truncation in `memory-context.ts` with summary layer + cursor structure
- [ ] **C-06** Measure and document token savings — compare before/after token counts for typical retrieval responses
- [ ] **C-07** Write tests for summary generation, cursor creation, cursor resolution, and pagination edge cases

### REQ-D5-006: Retrieval Session State

- [ ] **C-08** Design and implement session state schema in new `session-state.ts` — `activeGoal`, `seenResultIds`, `openQuestions`, `preferredAnchors`
- [ ] **C-09** Implement `activeGoal` tracking — detect and persist the user's retrieval intent across turns
- [ ] **C-10** Implement `seenResultIds` tracking — record which result IDs have been returned in prior turns
- [ ] **C-11** Implement cross-turn dedup — deprioritize results whose IDs appear in `seenResultIds`
- [ ] **C-12** Implement `openQuestions` accumulation — track unresolved questions surfaced during retrieval
- [ ] **C-13** Implement `preferredAnchors` persistence — remember which anchors the caller favors across turns
- [ ] **C-14** Wire session state into `memory-context.ts` query pipeline — ensure state is read at query start and written at query end
- [ ] **C-15** Write tests for session state persistence, dedup behavior, and follow-up quality with session context

<!-- ANCHOR:notation -->
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
<!-- /ANCHOR:cross-refs -->
