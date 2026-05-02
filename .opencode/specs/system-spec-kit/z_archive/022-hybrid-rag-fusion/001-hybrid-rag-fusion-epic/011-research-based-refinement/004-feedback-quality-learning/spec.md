---
title: "...it/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/004-feedback-quality-learning/spec]"
description: "Add implicit feedback event ledger, FSRS hybrid decay policy, quality gate exceptions, weekly batch learning, assistive reconsolidation, and shadow scoring with holdout evaluation."
trigger_phrases:
  - "feedback ledger"
  - "fsrs hybrid"
  - "quality gate exception"
  - "batch learning"
  - "reconsolidation"
  - "shadow scoring"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/004-feedback-quality-learning"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->
# Feature Specification: Feedback & Quality Learning

## Phase Context

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| Phase       | 4 of 5                                             |
| Parent      | `../spec.md`                                       |
| Predecessor | `../003-graph-augmented-retrieval/spec.md`          |
| Successor   | `../005-retrieval-ux-presentation/spec.md`          |
| Priority    | P0 (foundational — event ledger unlocks learned features across all dimensions) |

---

## 1. Overview

Feedback & Quality Learning closes the loop between retrieval and ranking by collecting implicit signals from the calling AI and using them to improve future results. The D4 deep-research agent discovered the system is **more mature than expected**: quality gates already exist in `save-quality-gate.ts` (0.4 density, 0.92 dedup, 50 char min), reconsolidation exists in `reconsolidation-bridge.ts` (opt-in, checkpoint-gated), and learned feedback exists in `learned-feedback.ts` with 10 safeguards. The real gap is **signal collection from the calling AI**, not safeguard design.

Six requirements span event logging, decay policy, gate exceptions, batch learning, reconsolidation, and shadow evaluation.

---

<!-- ANCHOR:requirements -->
## 2. Requirements

### REQ-D4-001: Implicit Feedback Event Ledger

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #2                                             |
| Size         | S                                                            |
| Flag         | `SPECKIT_IMPLICIT_FEEDBACK_LOG`                              |
| Files        | new `feedback-ledger.ts`, Stage 2 hooks                      |

**Behavior:**
- Record five event types: `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, `follow_on_tool_use`.
- Signal confidence tiers: citation/use (strongest) > reformulation (medium) > repeated search (weak).
- Events logged to a SQLite table, queryable for downstream aggregation.
- Shadow-only initially — no ranking side effects.

**Sketch:**

```ts
type FeedbackEvent = {
  type: 'search_shown' | 'result_cited' | 'query_reformulated'
       | 'same_topic_requery' | 'follow_on_tool_use';
  memoryId: string;
  queryId: string;
  confidence: 'strong' | 'medium' | 'weak';
  timestamp: number;
};

logEvent(event); // insert into feedback_events table
```

**Acceptance:** Events logged to SQLite, queryable, no ranking side effects.

---

### REQ-D4-002: FSRS Hybrid Decay

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #3                                             |
| Size         | S                                                            |
| Flag         | `SPECKIT_HYBRID_DECAY_POLICY`                                |
| Files        | `fsrs-scheduler.ts` (already has partial classification-decay support) |

**Behavior:**
- Type-aware no-decay for documents classified as `decision`, `constitutional`, or `critical`.
- FSRS decay applied only to engagement-sensitive documents (session notes, scratch, transient).
- Classification determined at save time via existing `context_type` metadata.

**Sketch:**

```ts
if (['decision', 'constitutional', 'critical'].includes(doc.contextType)) {
  decay = NO_DECAY;      // never decays
} else {
  decay = fsrsSchedule(doc);  // standard FSRS
}
```

**Acceptance:** Decisions never decay, engagement docs use FSRS, eval shows precision gain on durable docs.

---

### REQ-D4-003: Short-Critical Quality Gate Exception

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #7                                             |
| Size         | S                                                            |
| Flag         | `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS`                       |
| Files        | `save-quality-gate.ts`                                       |

**Behavior:**
- Bypass the 50 char minimum length gate when `context_type === 'decision'` AND the document has at least 2 strong structural signals (title, specFolder, anchor).
- Warn-only mode initially — log bypass events rather than silently accepting.
- Existing gates (0.4 density, 0.92 dedup) remain enforced.

**Sketch:**

```ts
const structuralSignals = [doc.title, doc.specFolder, doc.anchor]
  .filter(Boolean).length;

if (doc.contextType === 'decision' && structuralSignals >= 2) {
  logBypass('short-critical-exception', doc);
  return PASS;  // bypass length gate only
}
```

**Acceptance:** Short decisions with title + specFolder + anchor pass gate, warn-only initially.

---

### REQ-D4-004: Weekly Batch Feedback Learning

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #19                                            |
| Size         | M                                                            |
| Flag         | `SPECKIT_BATCH_LEARNED_FEEDBACK`                             |
| Files        | `learned-feedback.ts`, new batch job script                  |
| Cross-dep    | Needs REQ-D4-001 event data                                 |

**Behavior:**
- Aggregate high-confidence implicit signals from the event ledger on a weekly cadence.
- Min-support threshold: a signal must appear in at least 3 independent sessions before promotion.
- Cap individual boosts to prevent runaway amplification (max boost delta per cycle).
- Shadow compare: compute would-have-been ranking alongside live ranking.

**Sketch:**

```ts
const candidates = aggregateEvents({ since: oneWeekAgo, minSupport: 3 });
for (const signal of candidates) {
  const boost = Math.min(signal.computedBoost, MAX_BOOST_DELTA);
  shadowApply(signal.memoryId, boost);  // shadow only, no live effect
}
```

**Acceptance:** Weekly batch runs, only promotes signals with sufficient support, shadow-only initially.

---

### REQ-D4-005: Assistive Reconsolidation

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #20                                            |
| Size         | M                                                            |
| Flag         | `SPECKIT_ASSISTIVE_RECONSOLIDATION`                          |
| Files        | `reconsolidation-bridge.ts` (extend existing opt-in module)  |

**Behavior:**
- Auto-merge when semantic similarity >= 0.96 (near-duplicate).
- Review recommendation when similarity is 0.88-0.96 — classify as supersede or complement.
- Keep separate when similarity < 0.88 — no action taken.
- No destructive consolidation below the 0.88 threshold.

**Sketch:**

```ts
if (similarity >= 0.96) {
  autoMerge(older, newer);            // near-duplicate
} else if (similarity >= 0.88) {
  logRecommendation(older, newer);    // human/AI review
} else {
  keepSeparate();                     // distinct memories
}
```

**Acceptance:** Near-duplicates auto-merged, borderline cases log recommendation, no destructive consolidation below 0.88.

---

### REQ-D4-006: Shadow Scoring with Holdout

| Field        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Research Ref | Research Item #21                                            |
| Size         | M                                                            |
| Flag         | `SPECKIT_SHADOW_FEEDBACK`                                    |
| Files        | new `shadow-scoring.ts`, eval pipeline                       |
| Cross-dep    | Needs REQ-D4-004 learned signals                             |

**Behavior:**
- Compare would-have-changed rank vs live rank on a holdout slice of queries.
- Log rank deltas and direction-of-change metrics.
- Promote learned signals to live scoring only after 2 stable weekly evaluations.

**Sketch:**

```ts
for (const query of holdoutQueries) {
  const liveRank = rankWithoutLearnedSignals(query);
  const shadowRank = rankWithLearnedSignals(query);
  logComparison(query, liveRank, shadowRank);
}
// Promote only after 2 consecutive weeks of improvement
```

**Acceptance:** Shadow comparison running, promote only after 2 stable weekly evaluations.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 3. Success Criteria

| Criterion                     | Target                                              |
| ----------------------------- | --------------------------------------------------- |
| Event collection              | Operational — all 5 event types logged to SQLite     |
| FSRS hybrid decay             | Active — decisions never decay, engagement docs use FSRS |
| Quality gate exceptions       | Working — short decisions with strong signals pass   |
| Batch learning                | Shadow mode — weekly aggregation running, no live effect |
| Reconsolidation               | Assistive — auto-merge above 0.96, recommend 0.88-0.96 |
| Shadow scoring                | Validating — holdout comparison active               |

<!-- /ANCHOR:success-criteria -->
---

## 4. Risks

| Risk                          | Mitigation                                          |
| ----------------------------- | --------------------------------------------------- |
| Sparse event data early on    | Min-support threshold (>=3) prevents premature promotion |
| Feedback loop amplification   | Boost cap per cycle, shadow-only before live         |
| Quality gate bypass abuse     | Restricted to decision + 2 structural signals, warn-only |
| Reconsolidation data loss     | No destructive action below 0.88, checkpoint before merge |
| Shadow scoring overhead       | Holdout slice only, not full query volume            |

---

## 5. Verification (Level 2)

- [ ] All 6 feature flags documented and gated
- [ ] Unit tests per requirement
- [ ] Integration test: event ledger round-trip (log, query, aggregate)
- [ ] Integration test: quality gate exception for short decisions
- [ ] Shadow scoring comparison report produced for at least 2 weekly cycles
- [ ] No ranking side effects observable while in shadow mode
- [ ] Existing test suite (4876+) passes without regressions<!-- ANCHOR:metadata -->
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->
