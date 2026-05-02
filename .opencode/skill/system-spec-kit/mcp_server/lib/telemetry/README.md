---
title: "Telemetry"
description: "Retrieval telemetry, scoring observation, trace validation, eval channel tracking, and disabled consumption logging for the MCP server."
trigger_phrases:
  - "retrieval telemetry"
  - "latency metrics"
  - "quality metrics"
  - "scoring observability"
  - "trace schema"
  - "eval channel tracking"
---

# Telemetry

`lib/telemetry/` defines safe observability shapes for retrieval and scoring. Runtime code records bounded telemetry for active requests. Maintenance code samples traces, audits scoring signals, and reviews stored channel contribution data.

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. TOPOLOGY](#2--topology)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

## 1. OVERVIEW

Telemetry is an observation layer. It must not decide ranking, mutate memory records, or make recovery choices. Retrieval handlers can rely on stable data shapes even when extended telemetry is disabled.

Runtime role:

- Build `RetrievalTelemetry` shells for handler responses.
- Capture latency, mode, fallback, quality, graph-health, and trace payload fields when enabled.
- Validate trace payloads before exposing them.

Maintenance role:

- Sample scoring observations for cold-start and interference signals.
- Track eval channel contribution for later analysis.
- Inspect stored trace and consumption tables during audits.

## 2. TOPOLOGY

```text
┌────────────────────┐
│ Retrieval handlers │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ RetrievalTelemetry │
└─────────┬──────────┘
          ├──────────────┬──────────────┬──────────────┐
          ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Trace schema │ │ Scoring obs  │ │ Eval channel │ │ Consumption  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## 3. KEY FILES

| File | Role |
| --- | --- |
| `retrieval-telemetry.ts` | Runtime type definitions and collection helpers for latency, mode, fallback, quality, architecture, graph-health, adaptive, and trace fields. |
| `trace-schema.ts` | Runtime validation and sanitization for canonical retrieval trace payloads. |
| `scoring-observability.ts` | Sampled SQLite-backed scoring observations for N4 cold-start boost and TM-01 interference scoring. |
| `eval-channel-tracking.ts` | Channel contribution telemetry used by eval and reporting paths. |
| `consumption-logger.ts` | Deprecated consumption logging surface. `isConsumptionLogEnabled()` returns `false`. |

## 4. BOUNDARIES

Owns:

- Telemetry data contracts and trace validation.
- Optional sampling for scoring diagnostics.
- Safe disabled behavior for production request paths.

Does not own:

- Retrieval ranking or reranking logic.
- Eval metric formulas.
- Memory DB schema outside telemetry tables.
- Resume or packet continuity order.

## 5. ENTRYPOINTS

| Entrypoint | Caller | Notes |
| --- | --- | --- |
| `createRetrievalTelemetry()` | Retrieval handlers | Returns a stable shell when extended telemetry is off. |
| `sanitizeRetrievalTracePayload()` | Trace-enabled handlers | Strips invalid or extra fields. |
| `isRetrievalTracePayload()` | Tests and runtime guards | Type guard for exact trace shape. |
| `shouldSample()` and `logScoringObservation()` | Scoring paths | Sampling prevents hot-path write volume. |
| `initEvalChannelTracking()` | Eval setup | Prepares channel telemetry storage. |
| `isConsumptionLogEnabled()` | Legacy callers | Always false after audit. |

### Key Environment Flags

| Variable | Default | Scope |
| --- | --- | --- |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Enables detailed retrieval metrics. |
| `SPECKIT_NOVELTY_BOOST` | unset | Gates novelty scoring observation fields. |
| `SPECKIT_INTERFERENCE_SCORE` | unset | Gates interference scoring observation fields. |
| `SPECKIT_CONSUMPTION_LOG` | inert | Deprecated and disabled. |

## 6. VALIDATION

Run focused tests when changing this folder:

```bash
npm test -- mcp_server/tests/telemetry
npm test -- mcp_server/tests/handlers/memory-search
```

Run document validation after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md
```

## 7. RELATED

- `../contracts/README.md` documents trace and response contracts.
- `../eval/README.md` documents metric and channel analysis.
- `../search/README.md` documents retrieval flow.
- `../scoring/README.md` documents score composition.
