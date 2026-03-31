---
title: "Feature Specification: Retrieval UX & Result Presentation"
description: "Add empty-result recovery UX, two-tier explainability, mode-aware response shapes, per-result calibrated confidence, progressive disclosure, and retrieval session state."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases: ["result recovery", "explainability", "response profile", "confidence scoring", "progressive disclosure", "session state"]
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Retrieval UX & Result Presentation

## Phase Position

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| Phase       | 5 of 5                                             |
| Parent      | `../spec.md`                                       |
| Predecessor | `../004-feedback-quality-learning/spec.md`         |
| Successor   | None (last child)                                  |

## Important Context

The D5 research agent found the system already has basic empty-result handling, trace envelopes, session transition trace, token budgets, session dedup, and evidence-gap detection. The gap is not raw capability but shaping these signals into an **AI-caller-friendly DECISION CONTRACT** — structured payloads that let the calling AI make informed decisions about retries, abstention, follow-up queries, and presentation depth without parsing free-text or guessing.

---

<!-- ANCHOR:requirements -->
## Requirements

### REQ-D5-001: Empty/Weak Result Recovery

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Priority           | #6                                                                                      |
| Size               | S                                                                                       |
| Feature Flag       | `SPECKIT_EMPTY_RESULT_RECOVERY_V1`                                                      |
| Files              | `search-results.ts`, `envelope.ts`                                                      |

**Description:** When a retrieval query returns no results, low-confidence results, or partial results, the system must return a structured recovery payload instead of silent emptiness. The payload provides status codes, failure reasons, suggested reformulations, and recommended actions.

**Schema:**

```jsonc
{
  "status": "no_results|low_confidence|partial",
  "reason": "spec_filter_too_narrow|low_signal_query|knowledge_gap",
  "suggestedQueries": ["broader alternative 1", "rephrased alternative 2"],
  "recommendedAction": "retry_broader|switch_mode|save_memory|ask_user"
}
```

**Acceptance Criteria:**
- No more silent empty results — every empty/weak retrieval returns a recovery payload.
- Callers receive actionable recovery guidance (reason + suggested queries + recommended action).
- Status accurately classifies the failure mode (no results vs. low confidence vs. partial).

---

### REQ-D5-002: Two-Tier Explainability

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Priority           | #16                                                                                     |
| Size               | M                                                                                       |
| Feature Flag       | `SPECKIT_RESULT_EXPLAIN_V1`                                                             |
| Files              | `search-results.ts`, `stage2-fusion.ts`                                                 |
| Cross-dependency   | Needs D1 channel attribution data from fusion                                           |

**Description:** Every result carries a slim explainability envelope by default (`why.summary` + `topSignals`). An opt-in debug tier exposes full per-channel attribution breakdown. The slim tier is always present; the debug tier is activated by request parameter.

**Schema:**

```jsonc
{
  "why": {
    "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
    "topSignals": ["semantic_match", "anchor:decisions"],
    "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
  },
  "debug": { "enabled": false }
}
```

**Acceptance Criteria:**
- Every result has a `why.summary` string and `topSignals` array.
- Debug mode (opt-in) shows full channel contribution breakdown.
- `stage2-fusion.ts` exposes channel contribution data for the explain layer to consume.

---

### REQ-D5-003: Mode-Aware Response Shape

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Priority           | #17                                                                                     |
| Size               | M                                                                                       |
| Feature Flag       | `SPECKIT_RESPONSE_PROFILE_V1`                                                           |
| Files              | `memory-context.ts`, `memory-search.ts`                                                 |

**Description:** Different retrieval modes produce different payload contracts. Callers specify a presentation profile, and the response shape adapts accordingly.

**Profiles:**

| Profile    | Shape                                                          |
| ---------- | -------------------------------------------------------------- |
| `quick`    | `topResult`, `oneLineWhy`, `omittedCount`                      |
| `research` | `results[]`, `evidenceDigest`, `followUps[]`                   |
| `resume`   | `state`, `nextSteps`, `blockers`                               |
| `debug`    | Full trace (all fields, no omission)                           |

**Acceptance Criteria:**
- Callers can request a presentation mode via parameter.
- Response shape adapts to the requested profile.
- Token usage reduces measurably for `quick` mode compared to full response.

---

### REQ-D5-004: Per-Result Calibrated Confidence

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Priority           | #18                                                                                     |
| Size               | M                                                                                       |
| Feature Flag       | `SPECKIT_RESULT_CONFIDENCE_V1`                                                          |
| Files              | New `confidence-scoring.ts`, `search-results.ts`                                        |

**Description:** Combine margin, multi-channel agreement, reranker support, and anchor density into a calibrated confidence score per result. Output includes a coarse label, numeric value, and driver list. Also assess overall request quality.

**Schema:**

```jsonc
{
  "confidence": {
    "label": "high|medium|low",
    "value": 0.78,
    "drivers": ["large_margin", "multi_channel_agreement"]
  },
  "requestQuality": {
    "label": "good|weak|gap"
  }
}
```

**Acceptance Criteria:**
- Every result carries a confidence label, numeric value, and drivers array.
- Callers can use confidence for abstention decisions (e.g., skip low-confidence results).
- Request quality assessed at the query level (good/weak/gap).

---

### REQ-D5-005: Progressive Disclosure

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Priority           | #26                                                                                     |
| Size               | L                                                                                       |
| Feature Flag       | `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`                                                     |
| Files              | `memory-context.ts`, `search-results.ts`                                                |

**Description:** Add a progressive-disclosure companion payload without removing the full result list. The response preserves full `data.results`, adds `data.progressiveDisclosure` with summary/snippet metadata, and supports continuation via `memory_search({ cursor })`.

**Schema:**

```jsonc
{
  "data": {
    "results": [
      { "id": "mem-1", "content": "full result content remains available" }
    ],
    "progressiveDisclosure": {
      "summaryLayer": {
        "count": 10,
        "digest": "3 strong, 2 weak, 1 conflict"
      },
      "results": [
        { "id": "mem-1", "snippet": "...", "detailAvailable": true }
      ],
      "continuation": {
        "cursor": "abc",
        "remainingCount": 6
      }
    }
  }
}
```

**Acceptance Criteria:**
- Full `data.results` remains present for backward compatibility.
- `data.progressiveDisclosure` is generated for retrieval responses when the graduated flag remains enabled.
- Continuation cursors work through `memory_search({ cursor })` without requiring a new query.

---

### REQ-D5-006: Retrieval Session State

| Field              | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Priority           | #27                                                                                     |
| Size               | L                                                                                       |
| Feature Flag       | `SPECKIT_SESSION_RETRIEVAL_STATE_V1`                                                    |
| Files              | `memory-context.ts`, new `session-state.ts`                                             |

**Description:** Track retrieval session state across turns and expose it additively in the live search response. The handler preserves normal search output, adds `data.sessionState` plus `data.goalRefinement`, and uses session context for cross-turn deduplication and goal-aware refinement.

**Schema:**

```jsonc
{
  "data": {
    "sessionState": {
      "activeGoal": "Find decision records about fusion scoring",
      "seenResultIds": [12, 18],
      "openQuestions": ["What weighting does graph channel use?"],
      "preferredAnchors": ["state", "next-steps"]
    },
    "goalRefinement": {
      "activeGoal": "Find decision records about fusion scoring",
      "applied": true
    }
  }
}
```

**Acceptance Criteria:**
- `data.sessionState` is returned for session-aware searches while preserving the existing response shape.
- Dedup respects `seenResultIds` and falls back to score-based deprioritization when the legacy session manager is unavailable.
- `data.goalRefinement` is returned when an active goal is inferred or refreshed from the current query.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## Success Criteria

| Criterion                             | Measure                                                        |
| ------------------------------------- | -------------------------------------------------------------- |
| No silent empty results               | Every empty/weak retrieval returns recovery payload             |
| Every result has confidence + why     | 100% of results carry confidence label and why.summary          |
| Mode-aware responses reduce tokens    | `quick` mode uses measurably fewer tokens than full response    |
| Progressive disclosure available      | Full results preserved plus companion disclosure and cursor flow |
| Session state operational             | Additive session state and goal refinement emitted live         |

<!-- /ANCHOR:success-criteria -->
---

## Risks & Mitigations

| Risk                      | Impact | Mitigation                                                     |
| ------------------------- | ------ | -------------------------------------------------------------- |
| Context budget bloat      | High   | Default to slim mode; debug/full only on explicit opt-in       |
| Latency cost              | Medium | V1 uses heuristic scoring only — no model calls in hot path    |
| Backward compatibility    | Medium | All new fields are additive; existing contracts unchanged       |
| False precision           | Medium | Use coarse labels (high/medium/low) + drivers, not fine scores |<!-- ANCHOR:metadata -->
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
