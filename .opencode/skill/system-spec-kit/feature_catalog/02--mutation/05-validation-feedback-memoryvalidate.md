---
title: "Validation feedback (memory_validate)"
description: "Covers the validation feedback tool that adjusts confidence scores, triggers auto-promotion and records learned feedback."
---

# Validation feedback (memory_validate)

## 1. OVERVIEW

Covers the validation feedback tool that adjusts confidence scores, triggers auto-promotion and records learned feedback.

After a search result is shown to you, you can tell the system whether it was helpful or not. Helpful results get a confidence boost so they show up more often in the future. Unhelpful results get demoted so they appear less. Over time, the system learns which memories are genuinely useful and which ones keep missing the mark, like training a recommendation engine with your thumbs-up and thumbs-down.

---

## 2. CURRENT REALITY

Every search result is either helpful or not. This tool lets you record that judgment and triggers several downstream systems based on the feedback.

Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts at 0.5. The asymmetry between positive (+0.1) and negative (-0.05) increments is intentional. It takes one good validation to raise confidence by 0.1 but two bad validations to cancel that out. This bias toward preservation reflects the assumption that a memory might be unhelpful for one query but still valuable for another.

Auto-promotion fires unconditionally on every positive validation. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window. Constitutional, critical, temporary and deprecated tiers are non-promotable. The response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier and the reason.

Negative feedback persistence fires unconditionally on every negative validation. A `recordNegativeFeedbackEvent()` call stores the event in the `negative_feedback_events` table. The search handler reads these events and applies a confidence multiplier that starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3. Time-based recovery with a 30-day half-life gradually restores the multiplier. Demotion scoring runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

When a `queryId` is provided alongside positive feedback, two additional systems activate. Learned feedback persistence records the user's selection and extracts query terms into a separate `learned_triggers` column (isolated from the FTS5 index to prevent contamination). These learned triggers boost future searches for the same terms. Ground truth selection logging records the event in the evaluation database for the ground truth corpus, returning a `groundTruthSelectionId` in the response.

**Prerequisites for learned-feedback activation:** The validation call must include `queryTerms` AND `resultRank` in addition to `queryId`. Without all three fields, learned-feedback persistence is skipped and only the base confidence adjustment and auto-promotion/demotion paths fire.

The confidence read-compute-write segment (`recordValidation`) runs within a single SQLite transaction to prevent concurrent validation updates from racing and dropping writes. Downstream side effects (auto-promotion, negative-feedback persistence, learned feedback and ground-truth logging) execute after that transactional segment.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/checkpoints.ts` | Handler | `memory_validate` handler: confidence update, adaptive signal, auto-promotion, learned feedback, and ground-truth logging |
| `mcp_server/tools/memory-tools.ts` | API | L4 tool dispatcher routing `memory_validate` |
| `mcp_server/lib/storage/history.ts` | Lib | History writes for validation feedback events |
| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Transactional confidence and validation-count update |
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Lib | Best-effort adaptive signal persistence from validation outcomes |
| `mcp_server/lib/search/auto-promotion.ts` | Lib | Positive-validation promotion thresholds and throttle |
| `mcp_server/lib/scoring/negative-feedback.ts` | Lib | Negative-feedback event persistence and score multiplier recovery |
| `mcp_server/lib/search/learned-feedback.ts` | Lib | Learned-trigger extraction, audit logging, and persistence |
| `mcp_server/lib/eval/ground-truth-feedback.ts` | Lib | Query-selection logging into the eval corpus |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-checkpoints.vitest.ts` | `memory_validate` handler validation |
| `mcp_server/tests/confidence-tracker.vitest.ts` | Confidence update transaction behavior |
| `mcp_server/tests/learned-feedback.vitest.ts` | Learned-feedback persistence and safeguards |
| `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` | Positive-validation counting and promotion semantics |
| `mcp_server/tests/adaptive-ranking.vitest.ts` | Adaptive outcome/correction signal logging |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Validation feedback (memory_validate)
- Current reality source: FEATURE_CATALOG.md
