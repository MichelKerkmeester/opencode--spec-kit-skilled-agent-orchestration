---
title: "Adaptive shadow ranking, bounded proposals, and rollback"
description: "Describes the shipped adaptive ranking module that records signals, persists bounded threshold state in SQLite, and emits shadow or promoted proposal payloads without changing live result order."
---

# Adaptive shadow ranking, bounded proposals, and rollback

## 1. OVERVIEW

Describes the shipped adaptive ranking module that records access, outcome, and correction signals, computes bounded proposal deltas, and persists adaptive state in SQLite.

Status: Implemented (shadow mode)

The current runtime keeps production ranking as the source of truth. Adaptive ranking builds proposal payloads in the background, stores threshold state and shadow-run history, and exposes mode metadata for evaluation and rollout drills. `getAdaptiveMode()` resolves `disabled`, `shadow`, or `promoted` from `SPECKIT_MEMORY_ADAPTIVE_RANKING` plus `SPECKIT_MEMORY_ADAPTIVE_MODE`.

---

## 2. CURRENT REALITY

Adaptive ranking is live code, not a future-only design. `ensureAdaptiveTables()` creates and maintains three SQLite tables: `adaptive_signal_events`, `adaptive_thresholds`, and `adaptive_shadow_runs`.

Threshold configuration is persisted in SQLite through `persistAdaptiveThresholdConfig()` and reloaded through `getAdaptiveThresholdConfig()`. The persisted `adaptive_thresholds` row stores bounded threshold values plus metadata, including `updated_at` and `last_tune_watermark`, so tuned settings survive process restarts and cold reloads.

Threshold retuning is idempotent at the watermark level. `tuneAdaptiveThresholdsAfterEvaluation()` builds a watermark from the current signal count and `gateResult.recommendation`, and skips repeat tuning when `last_tune_watermark` already matches that state. `resetAdaptiveState()` clears the watermark so a fresh tuning cycle can run after rollback drills or state resets.

Signal reads are batched and grouped instead of read one memory at a time. `getSignalDeltas()` issues a single `IN (...)` query grouped by `memory_id` and `signal_type`, while `summarizeAdaptiveSignalQuality()` aggregates counts, totals, distinct-memory coverage, promotion-ready counts, and shadow-run coverage from grouped SQLite reads.

`buildAdaptiveShadowProposal()` applies bounded score deltas, persists each proposal in `adaptive_shadow_runs`, and trims retention to the last 50 shadow-run rows. The search handler attaches this payload as `adaptiveShadow` / `adaptive_shadow`, but the shipped interactive search path still returns production ordering unchanged.

Query-filtered feedback labels are supported in the shadow-evaluation path, not in the production delta aggregator itself. `shadow-evaluation-runtime.ts` filters replay labels by `adaptive_signal_events.query` and falls back to `metadata.queryText` when needed. By contrast, `getSignalDeltas()` in `adaptive-ranking.ts` currently aggregates stored signals by memory id and signal type without a per-query filter.

Promotion-gate feedback now drives threshold tuning. When a scheduled shadow-evaluation cycle produces `report.promotionGate`, the runtime passes that gate result into `tuneAdaptiveThresholdsAfterEvaluation()`. The tuner relaxes thresholds when `gateResult.ready === true`, when the recommendation is `promote`, or when aggregate signals are strong. It tightens thresholds when gate evidence is weak, then persists the next threshold snapshot and watermark back to SQLite.

### Shipped prerequisites

Adaptive ranking now depends on five completed prerequisites from the approved spec packet:

1. **Promotion-gate wiring**: shadow evaluation now passes `promotionGate` into the adaptive tuner so gate outcomes change threshold behavior.
2. **SQLite threshold persistence**: bounded thresholds and metadata are stored in `adaptive_thresholds` and survive restarts.
3. **Real feedback labels**: replay evaluation uses stored outcome and correction signals as labels instead of older circular shadow-score stand-ins.
4. **Access-signal path**: production access tracking records adaptive access events into `adaptive_signal_events`.
5. **End-to-end integration coverage**: the replay path is exercised from signal recording through proposal generation and post-evaluation tuning.

Rollback remains a flag flip, not a schema rollback. Disabling `SPECKIT_MEMORY_ADAPTIVE_RANKING` stops signal recording and proposal generation immediately while leaving stored adaptive tables intact for later re-enable or inspection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Lib | Adaptive mode resolution, SQLite table management, threshold persistence, grouped signal aggregation, bounded proposal generation, and rollback reset hooks |
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Lib | Query-scoped replay labels, promotion-gate generation, and post-evaluation threshold tuning calls |
| `mcp_server/handlers/memory-search.ts` | Handler | Adds adaptive proposal payloads to search responses without changing live result ordering |
| `mcp_server/formatters/search-results.ts` | Formatter | Surfaces adaptive mode metadata from the attached proposal payload |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/adaptive-ranking.vitest.ts` | Threshold persistence, watermark idempotency, grouped summaries, bounded proposals, rollback resets, and mode handling |
| `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Replay proposals, persisted thresholds, promoted-mode payloads, and feedback-driven tuning |
| `mcp_server/tests/shadow-evaluation-runtime.vitest.ts` | Query-scoped feedback labels, `metadata.queryText` fallback, and promotion-gate driven tuner calls |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Adaptive shadow ranking, bounded proposals, and rollback
- Current reality source: `mcp_server/lib/cognitive/adaptive-ranking.ts` plus approved spec packet `specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/`

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 121
