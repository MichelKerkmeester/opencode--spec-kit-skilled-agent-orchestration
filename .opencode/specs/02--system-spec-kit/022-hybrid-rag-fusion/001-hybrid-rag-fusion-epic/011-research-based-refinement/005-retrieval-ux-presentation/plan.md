---
title: "...it/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/005-retrieval-ux-presentation/plan]"
description: "Three phases, ordered by dependency chain and effort. Phase A establishes the foundation (recovery + confidence), Phase B adds explainability and profiles (depends on D1 channel..."
trigger_phrases:
  - "022"
  - "hybrid"
  - "rag"
  - "fusion"
  - "001"
  - "plan"
  - "005"
  - "retrieval"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Retrieval UX & Result Presentation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->


## Overview

Three phases, ordered by dependency chain and effort. Phase A establishes the foundation (recovery + confidence), Phase B adds explainability and profiles (depends on D1 channel attribution), and Phase C tackles the largest effort (progressive disclosure + session state).

---

## Phase A: Recovery & Confidence (REQ-D5-001, REQ-D5-004)

**Goal:** Eliminate silent empty results and give every result a calibrated confidence score.

**Why first:** These are foundational — every downstream feature (explainability, profiles, disclosure) assumes results already carry status and confidence metadata. Recovery is Size S and unblocks immediate UX improvements. Confidence scoring is Size M but has no external dependencies.

### Deliverables

1. **Empty/Weak Result Recovery (REQ-D5-001)**
   - Add recovery payload generation to `search-results.ts`
   - Implement status classification (`no_results`, `low_confidence`, `partial`)
   - Implement reason classification (`spec_filter_too_narrow`, `low_signal_query`, `knowledge_gap`)
   - Add suggested query reformulation logic
   - Add `recommendedAction` determination
   - Wire recovery payload into `envelope.ts`
   - Feature flag: `SPECKIT_EMPTY_RESULT_RECOVERY_V1`

2. **Per-Result Calibrated Confidence (REQ-D5-004)**
   - Create `confidence-scoring.ts` module
   - Implement margin calculation
   - Implement multi-channel agreement detection
   - Implement reranker support scoring
   - Implement anchor density assessment
   - Combine into label (`high`/`medium`/`low`) + numeric value + drivers array
   - Add request quality assessment (`good`/`weak`/`gap`)
   - Integrate into `search-results.ts` result objects
   - Feature flag: `SPECKIT_RESULT_CONFIDENCE_V1`

### Exit Criteria
- Zero silent empty results in test suite
- Every result in test suite carries confidence label + value + drivers
- Feature flags independently toggleable

---


## Phase B: Explainability & Profiles (REQ-D5-002, REQ-D5-003)

**Goal:** Add two-tier explainability and mode-aware response shapes.

**Why second:** Explainability depends on D1 channel attribution data from fusion — this cross-dependency means Phase B should not start until D1 attribution is available (or a stub is in place). Profiles depend on confidence data from Phase A being present on results.

### Deliverables

1. **Two-Tier Explainability (REQ-D5-002)**
   - Add `why.summary` generation logic (compose from top scoring signals)
   - Add `topSignals` extraction from fusion scoring data
   - Expose channel contribution data from `stage2-fusion.ts`
   - Implement slim tier (default: summary + topSignals)
   - Implement debug tier (opt-in: full channel breakdown)
   - Wire into `search-results.ts` result envelope
   - Feature flag: `SPECKIT_RESULT_EXPLAIN_V1`

2. **Mode-Aware Response Shape (REQ-D5-003)**
   - Implement presentation profile router in `memory-context.ts`
   - Implement `quick` formatter: topResult + oneLineWhy + omittedCount
   - Implement `research` formatter: results[] + evidenceDigest + followUps[]
   - Implement `resume` formatter: state + nextSteps + blockers
   - Implement `debug` formatter: full trace, no omission
   - Add profile parameter to `memory-search.ts` interface
   - Feature flag: `SPECKIT_RESPONSE_PROFILE_V1`

### Cross-Dependency
- **D1 channel attribution:** If D1 is not yet complete, implement explainability with a stub/mock for channel contribution and add a TODO for real integration.

### Exit Criteria
- Every result has `why.summary` and `topSignals`
- Debug mode shows channel contribution breakdown
- All four profile formatters produce valid output
- `quick` mode token usage is measurably lower than `debug`

---

## Phase C: Progressive Disclosure & Session State (REQ-D5-005, REQ-D5-006)

**Goal:** Replace hard truncation with progressive disclosure and add cross-turn retrieval session state.

**Why last:** These are the largest effort (both Size L). Progressive disclosure restructures how results are returned — it benefits from confidence and explainability being stable first. Session state is the most complex feature and touches the most files.

### Deliverables

1. **Progressive Disclosure (REQ-D5-005)**
   - Implement summary layer generation (count + digest)
   - Implement snippet extraction with `detailAvailable` flag
   - Implement continuation cursor generation and storage
   - Implement cursor-based detail retrieval endpoint
   - Replace hard tail-truncation in `memory-context.ts`
   - Update `search-results.ts` to emit summary + cursor structure
   - Measure and document token savings
   - Feature flag: `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`

2. **Retrieval Session State (REQ-D5-006)**
   - Design session state schema
   - Create `session-state.ts` module
   - Implement `activeGoal` tracking
   - Implement `seenResultIds` tracking and cross-turn dedup
   - Implement `openQuestions` accumulation
   - Implement `preferredAnchors` persistence
   - Wire session state into `memory-context.ts` query pipeline
   - Validate dedup respects seen results across turns
   - Feature flag: `SPECKIT_SESSION_RETRIEVAL_STATE_V1`

### Exit Criteria
- Summary layer generated for all retrieval responses
- Continuation cursors functional — paging works end-to-end
- Token savings documented with before/after comparison
- Session state persists across queries
- Dedup respects `seenResultIds`
- Follow-up quality improves with session context

<!-- ANCHOR:summary -->
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
<!-- /ANCHOR:rollback -->
