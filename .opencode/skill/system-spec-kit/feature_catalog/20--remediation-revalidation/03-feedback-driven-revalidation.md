---
title: "Feedback-driven revalidation"
description: "Documents the `memory_validate` feedback loop, including confidence updates, adaptive signals, auto-promotion, negative-feedback persistence, and learned feedback."
---

# Feedback-driven revalidation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Documents the `memory_validate` feedback loop, including confidence updates, adaptive signals, auto-promotion, negative-feedback persistence, and learned feedback.

This feature is the system's revalidation path after retrieval. Instead of treating user feedback as a one-off acknowledgment, it turns each validation into durable search signals that can raise confidence, demote unreliable memories, promote proven memories, and capture future relevance hints from successful selections.

---

## 2. CURRENT REALITY

`memory_validate` requires a positive integer `id` and a boolean `wasUseful`. The handler initializes the memory database, records the validation through `confidenceTracker.recordValidation()`, and returns updated `confidence`, `validationCount`, `positiveValidationCount`, and `promotionEligible` values in the success payload. Positive feedback increments confidence by `0.1` up to `1.0`; negative feedback decrements it by `0.05` down to `0.0`. Promotion eligibility is based on positive validations, not raw total validations.

Every validation also attempts to emit an adaptive-ranking signal. Positive feedback is stored as an `outcome` signal and negative feedback as a `correction` signal, with query/session metadata included when available. This write is intentionally best-effort: if adaptive tables are disabled or unavailable, validation still succeeds and the handler continues without failing the request.

Positive feedback triggers the auto-promotion path. `executeAutoPromotion()` only promotes upward, never demotes: `normal -> important` at 5 positive validations and `important -> critical` at 10 positive validations. The promotion check subtracts persisted negative-feedback events from total validations before deciding eligibility, excludes non-promotable tiers such as `critical`, `constitutional`, `temporary`, and `deprecated`, and rate-limits successful promotions to 3 within an 8-hour rolling window.

Negative feedback is persisted separately through `negative_feedback_events`. That history is used later by search scoring as a runtime demotion signal with a floor multiplier of `0.3` and a 30-day recovery half-life, so repeatedly unhelpful memories lose ranking strength without being hard-deleted.

When feedback is positive and a `queryId` is provided, `memory_validate` also records a ground-truth selection event and may learn query terms for future ranking. Learned feedback only runs when `queryTerms` and a positive `resultRank` are present. The learning path is heavily bounded: it can be disabled by feature flag, ignores top-3 selections, refuses memories younger than 72 hours, applies a 7-day shadow period, filters terms through a denylist, learns at most 3 terms per selection and 8 per memory, and writes only to `memory_index.learned_triggers` rather than the FTS table. The handler returns this work as explicit `autoPromotion`, `learnedFeedback`, and `groundTruthSelectionId` fields so callers can inspect what happened instead of inferring it from the summary line.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/handlers/checkpoints.ts` | Handler | Implements `memory_validate` and wires confidence tracking, adaptive signals, auto-promotion, negative feedback, ground-truth capture, and learned feedback into one response |
| `mcp_server/lib/scoring/confidence-tracker.ts` | Lib | Persists confidence and validation counters and derives promotion eligibility from positive-validation counts |
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Lib | Stores best-effort adaptive feedback signals and governs adaptive-ranking state |
| `mcp_server/lib/search/auto-promotion.ts` | Lib | Defines promotion thresholds, non-promotable tiers, and rolling-window rate limiting |
| `mcp_server/lib/scoring/negative-feedback.ts` | Lib | Persists negative-feedback events and computes score demotion with time-based recovery |
| `mcp_server/lib/search/learned-feedback.ts` | Lib | Learns bounded query terms from successful selections and stores them outside FTS |
| `mcp_server/lib/eval/ground-truth-feedback.ts` | Lib | Persists selection context for feedback-driven ground-truth expansion |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/learned-feedback.vitest.ts` | Integration | Covers learned-feedback safeguards, shadow mode, FTS isolation, and auto-promotion behavior |
| `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` | Behavioral | Verifies promotion logic uses positive validations after subtracting negative events |
| `mcp_server/tests/mcp-input-validation.vitest.ts` | Input validation | Confirms `memory_validate` is exposed through MCP input validation with the expected tool contract |

---

## 4. SOURCE METADATA

- Group: Remediation and Revalidation
- Source feature title: Feedback-driven revalidation
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `20--remediation-revalidation/03-feedback-driven-revalidation.md`
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit
