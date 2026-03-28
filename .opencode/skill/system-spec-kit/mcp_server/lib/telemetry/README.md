---
title: "Telemetry"
description: "Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline."
trigger_phrases:
  - "retrieval telemetry"
  - "latency metrics"
  - "quality metrics"
  - "scoring observability"
  - "consumption logger"
  - "trace schema"
---

# Telemetry

> Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The telemetry module provides structured observability for the retrieval pipeline and scoring subsystem. It records per-stage latency, search mode selection, fallback triggers, composite quality scores, scoring observation samples, trace payload validation, and agent consumption events. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 4 | `retrieval-telemetry.ts`, `scoring-observability.ts`, `trace-schema.ts`, `consumption-logger.ts` |
| Metric Groups | 4 | LatencyMetrics, ModeMetrics, FallbackMetrics, QualityMetrics |
| Feature Flags | 11 | `SPECKIT_EXTENDED_TELEMETRY` (default: false), `SPECKIT_MEMORY_ROADMAP_PHASE`, six `SPECKIT_MEMORY_*` capability flags, `SPECKIT_NOVELTY_BOOST`, `SPECKIT_INTERFERENCE_SCORE`, `SPECKIT_CONSUMPTION_LOG` (deprecated, inert) |

### Key Features

| Feature | Description |
|---------|-------------|
| **RetrievalTelemetry** | Main interface aggregating all metric groups for a single retrieval run |
| **LatencyMetrics** | Stage-by-stage timing: candidate, fusion, rerank, boost, and total |
| **ModeMetrics** | Search mode selection, override flag, pressure level, and optional token usage ratio |
| **FallbackMetrics** | Fallback trigger detection, optional reason string, and degraded-mode flag |
| **QualityMetrics** | Composite 0-1 quality proxy derived from relevance, result count, and latency |
| **TelemetryTracePayload** | Canonical retrieval trace payload (sanitized, no sensitive/extra fields) |
| **ScoringObservability** | Sampled logging of N4 cold-start boost and TM-01 interference scoring values |
| **ConsumptionLogger** | Agent consumption event logging to SQLite for usage pattern analysis |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
telemetry/
├── retrieval-telemetry.ts    # Telemetry interfaces, types, and collection utilities
├── scoring-observability.ts  # Sampled scoring observation logging (N4, TM-01)
├── trace-schema.ts           # Canonical trace payload schema and validation
├── consumption-logger.ts     # Agent consumption event logging (T004)
└── README.md                 # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `retrieval-telemetry.ts` | Defines `RetrievalTelemetry`, `LatencyMetrics`, `ModeMetrics`, `FallbackMetrics`, `QualityMetrics`, `ArchitectureMetrics`, `GraphHealthMetrics`, `AdaptiveMetrics`, `GraphWalkDiagnostics`, `LifecycleForecastDiagnostics`, and transition diagnostics support; exposes collection helpers |
| `scoring-observability.ts` | Sampled (5%) observability logging for N4 cold-start boost and TM-01 interference penalty values; SQLite-backed `scoring_observations` table |
| `trace-schema.ts` | Canonical schema and runtime validation for `TelemetryTracePayload`; sanitizes unknown/sensitive fields from trace data |
| `consumption-logger.ts` | Logs agent consumption events (`search`, `context`, `triggers`) to SQLite `consumption_log` table; pattern detection for zero-result, high-frequency, and intent-mismatch queries |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Feature Flags

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Enable extended metric collection (latency breakdown, quality scoring, trace payload validation, and architecture updates). Set to `true` to activate |
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | Record the active memory-roadmap phase in telemetry/checkpoint metadata. Unsupported values fall back to `shared-rollout` |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata; distinct from live `SPECKIT_GRAPH_UNIFIED` |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | Default-off roadmap capability flag surfaced in telemetry metadata |
| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata |
| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata |
| `SPECKIT_MEMORY_SHARED_MEMORY` | `false` | Default-off roadmap capability flag surfaced in telemetry metadata |
| `SPECKIT_NOVELTY_BOOST` | - | Gates N4 cold-start boost in scoring observability |
| `SPECKIT_INTERFERENCE_SCORE` | - | Gates TM-01 interference penalty in scoring observability |
| `SPECKIT_CONSUMPTION_LOG` | inert | Deprecated. Consumption logging is hardcoded to disabled after Sprint 7 audit |

Phase 4 adaptive ranking remains dormant in production.

When `SPECKIT_EXTENDED_TELEMETRY` is disabled (default), the minimal `RetrievalTelemetry` shell is still created so callers can rely on a stable shape. Latency, mode, fallback, quality, graph-health, and adaptive sub-metrics remain zeroed/empty, while the baseline architecture snapshot still records the current memory-roadmap phase/capability defaults.

### RetrievalTelemetry

**Purpose**: Aggregate all metric groups for one retrieval run.

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | `boolean` | Whether extended telemetry collection is enabled |
| `timestamp` | `string` | ISO timestamp when the run started |
| `latency` | `LatencyMetrics` | Per-stage timing breakdown |
| `mode` | `ModeMetrics` | Search mode selection details |
| `fallback` | `FallbackMetrics` | Fallback trigger record |
| `quality` | `QualityMetrics` | Composite quality assessment |
| `architecture` | `ArchitectureMetrics` | Memory-roadmap phase and capability state for the run |
| `graphHealth` | `GraphHealthMetrics` | Graph-signal injection and rollback-gate state for the run |
| `adaptive` | `AdaptiveMetrics` | Adaptive shadow/promoted evaluation summary for the run |
| `transitionDiagnostics` | `SessionTransitionTrace \| undefined` | Optional spec-shaped session transition diagnostics captured for trace-enabled retrievals |
| `graphWalkDiagnostics` | `GraphWalkDiagnostics \| undefined` | Optional graph-walk rollout and contribution diagnostics captured for retrieval observability |
| `lifecycleForecastDiagnostics` | `LifecycleForecastDiagnostics \| undefined` | Optional ingest forecast diagnostics captured when lifecycle telemetry instrumentation is enabled |
| `tracePayload` | `TelemetryTracePayload \| undefined` | Optional canonical retrieval trace payload |

### LatencyMetrics

**Purpose**: Record time spent in each pipeline stage.

| Field | Type | Description |
|-------|------|-------------|
| `totalLatencyMs` | `number` | Wall-clock total for the full pipeline |
| `candidateLatencyMs` | `number` | Candidate retrieval stage duration |
| `fusionLatencyMs` | `number` | RRF fusion duration |
| `rerankLatencyMs` | `number` | Cross-encoder rerank duration (0 if skipped) |
| `boostLatencyMs` | `number` | Session/causal boost duration |

### ModeMetrics

**Purpose**: Capture which search mode was used and whether it was overridden.

| Field | Type | Description |
|-------|------|-------------|
| `selectedMode` | `string \| null` | Mode chosen for this run (e.g., `hybrid`, `auto`, `deep`) |
| `modeOverrideApplied` | `boolean` | Whether the default mode was overridden by caller or pressure policy |
| `pressureLevel` | `string \| null` | Pressure level label at the time of selection |
| `tokenUsageRatio` | `number \| undefined` | Optional normalized token usage ratio (0-1) |

### FallbackMetrics

**Purpose**: Record whether and why the pipeline fell back to a degraded path.

| Field | Type | Description |
|-------|------|-------------|
| `fallbackTriggered` | `boolean` | Whether any fallback was activated |
| `fallbackReason` | `string \| undefined` | Human-readable reason for fallback (omitted when not triggered) |
| `degradedModeActive` | `boolean` | Whether the run completed in degraded mode |

### QualityMetrics

**Purpose**: Composite quality score for the retrieval run.

| Field | Type | Description |
|-------|------|-------------|
| `resultCount` | `number` | Number of retrieval results used in scoring |
| `avgRelevanceScore` | `number` | Average relevance component (0-1) |
| `topResultScore` | `number` | Highest result relevance score (0-1) |
| `boostImpactDelta` | `number` | Delta contributed by boost stages |
| `extractionCountInSession` | `number` | Session extraction count at scoring time |
| `qualityProxyScore` | `number` | Composite quality proxy score (0-1) |

**Score Interpretation:**

| Range | Meaning |
|-------|---------|
| 0.80-1.00 | High quality |
| 0.60-0.79 | Acceptable |
| 0.40-0.59 | Degraded |
| < 0.40 | Poor -- review fallback policy |

### ArchitectureMetrics

**Purpose**: Capture memory-roadmap phase and capability state for architectural telemetry.

| Field | Type | Description |
|-------|------|-------------|
| `phase` | `MemoryRoadmapPhase` | Active memory-roadmap phase for this retrieval run |
| `capabilities` | `MemoryRoadmapCapabilityFlags` | Capability flags snapshot associated with the phase |
| `scopeDimensionsTracked` | `number` | Number of tracked retrieval scope dimensions in this phase |

### GraphHealthMetrics

**Purpose**: Surface graph-fusion activity, injected signal volume, and kill-switch state.

| Field | Type | Description |
|-------|------|-------------|
| `killSwitchActive` | `boolean` | Whether graph-unified behavior is currently gated off |
| `causalBoosted` | `number` | Count of results boosted by causal-edge signals |
| `coActivationBoosted` | `number` | Count of results boosted by co-activation signals |
| `communityInjected` | `number` | Count of results injected from community expansion |
| `graphSignalsBoosted` | `number` | Count of results boosted by graph-signal overlays |
| `totalGraphInjected` | `number` | Aggregate graph-contribution count for the run |

### AdaptiveMetrics

**Purpose**: Record whether adaptive ranking ran, whether it stayed bounded, and how many rows would move.

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `'shadow' \| 'promoted' \| 'disabled'` | Adaptive evaluation mode for the run |
| `promotedCount` | `number` | Count of rows proposed to move upward |
| `demotedCount` | `number` | Count of rows proposed to move downward |
| `bounded` | `boolean` | Whether bounded-update safeguards remained active |
| `maxDeltaApplied` | `number` | Largest score delta the adaptive proposal was allowed to apply |

### GraphWalkDiagnostics

**Purpose**: Summarize graph-walk rollout semantics and bounded contribution diagnostics for a retrieval run.

| Field | Type | Description |
|-------|------|-------------|
| `rolloutState` | `'off' \| 'trace_only' \| 'bounded_runtime'` | Effective graph-walk rollout state for the run |
| `rowsWithGraphContribution` | `number` | Count of rows carrying graph-walk diagnostics |
| `rowsWithAppliedBonus` | `number` | Count of rows that received a non-zero applied graph bonus |
| `capAppliedCount` | `number` | Count of rows where the graph bonus was actually clipped by the cap |
| `maxRaw` | `number` | Maximum raw pre-normalization graph-walk value observed in the run |
| `maxNormalized` | `number` | Maximum normalized graph-walk value observed in the run |
| `maxAppliedBonus` | `number` | Maximum bounded graph bonus applied in the run |

### Transition Diagnostics

**Purpose**: Persist the spec-shaped session transition trace contract into retrieval telemetry when trace-enabled search paths emit transition metadata.

| Field | Type | Description |
|-------|------|-------------|
| `previousState` | `string \| null` | Prior inferred state label, nullable on cold start |
| `currentState` | `string \| null` | Current inferred state label |
| `confidence` | `number` | Clamped transition confidence in the range `[0, 1]` |
| `signalSources` | `string[]` | Deterministic list of signal sources used for the transition inference |
| `reason` | `string \| undefined` | Optional human-readable explanation for the inferred transition |

### LifecycleForecastDiagnostics

**Purpose**: Capture optional ingest lifecycle forecast telemetry without making forecast generation a blocking path.

| Field | Type | Description |
|-------|------|-------------|
| `state` | `string \| null` | Current ingest job state associated with the forecast |
| `progress` | `number` | Progress percentage clamped to `0-100` |
| `filesProcessed` | `number` | Count of files processed so far |
| `filesTotal` | `number` | Total files scheduled for the ingest job |
| `etaSeconds` | `number \| null` | Advisory ETA in seconds |
| `etaConfidence` | `number \| null` | Confidence in the ETA estimate clamped to `[0,1]` |
| `failureRisk` | `number \| null` | Advisory failure-risk estimate clamped to `[0,1]` |
| `riskSignals` | `string[]` | Safe summary labels contributing to the forecast |
| `caveat` | `string \| undefined` | Optional caveat when forecast quality is limited or unavailable |

### TraceSamplingOptions

**Purpose**: Configure `sampleTracePayloads()` filtering behavior when selecting trace payload examples.

| Field | Type | Description |
|-------|------|-------------|
| `limit` | `number \| undefined` | Maximum number of sampled payloads to return |
| `minGraphInjected` | `number \| undefined` | Minimum `graphHealth.totalGraphInjected` required for inclusion |
| `killSwitchOnly` | `boolean \| undefined` | Restrict samples to payloads where `graphHealth.killSwitchActive` is `true` |

### SampledTracePayload

**Purpose**: Return shape from `sampleTracePayloads()` containing sanitized trace details and graph-health context.

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | `string \| null` | Retrieval timestamp used for secondary sort and inspection |
| `graphHealth` | `GraphHealthMetrics` | Graph-health counters associated with the sampled retrieval payload |
| `tracePayload` | `TelemetryTracePayload` | Sanitized canonical retrieval trace payload |

### Scoring Observability (`scoring-observability.ts`)

**Purpose**: Sampled logging of N4 cold-start boost and TM-01 interference penalty values.

| Aspect | Value |
|--------|-------|
| **Sampling Rate** | 5% (logs ~1 in 20 scoring calls) |
| **Storage** | SQLite table `scoring_observations` |
| **Behavior** | Fail-safe -- never throws; all errors caught and logged |

| Function | Purpose |
|----------|---------|
| `initScoringObservability(db)` | Create `scoring_observations` table (idempotent) |
| `shouldSample()` | Returns `true` approximately 5% of the time |
| `logScoringObservation(obs)` | Persist a `ScoringObservation` record to the DB |
| `getScoringStats()` | Aggregate stats: avg novelty boost, avg interference penalty, percentages |
| `getDb()` | Return current DB handle (for testing) |
| `resetDb()` | Reset DB handle (for testing teardown) |

### Trace Schema (`trace-schema.ts`)

**Purpose**: Canonical schema and runtime validation for retrieval trace payloads.

| Function | Purpose |
|----------|---------|
| `sanitizeRetrievalTracePayload(payload)` | Validate and strip unknown/sensitive fields from a trace payload |
| `isRetrievalTracePayload(payload)` | Type guard: returns `true` if payload matches canonical schema exactly |

| Constant | Purpose |
|----------|---------|
| `RETRIEVAL_TRACE_STAGES` | Allowed stage names: `candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank` |

### Consumption Logger (`consumption-logger.ts`)

**Purpose**: Agent consumption event logging for usage pattern analysis.

> **Note**: The `SPECKIT_CONSUMPTION_LOG` feature flag is deprecated and inert. The `isConsumptionLogEnabled()` function is hardcoded to `false` after Sprint 7 audit. No new events are logged.

| Function | Purpose |
|----------|---------|
| `initConsumptionLog(db)` | Create `consumption_log` table with indexes (idempotent) |
| `logConsumptionEvent(db, event)` | Insert a consumption event row (no-op when disabled) |
| `getConsumptionStats(db, options)` | Aggregate statistics from `consumption_log` |
| `getConsumptionPatterns(db, options)` | Detect patterns: high-frequency, zero-result, low-selection, intent-mismatch, session-heavy |
| `isConsumptionLogEnabled()` | Returns `false` (deprecated) |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Collect Telemetry for a Retrieval Run

```typescript
import {
  RetrievalTelemetry,
  LatencyMetrics,
  ModeMetrics,
  FallbackMetrics,
  QualityMetrics,
} from './retrieval-telemetry';

const latency: LatencyMetrics = {
  totalLatencyMs: 36,
  candidateLatencyMs: 18,
  fusionLatencyMs: 3,
  rerankLatencyMs: 0,
  boostLatencyMs: 15,
};

const mode: ModeMetrics = {
  selectedMode: 'auto',
  modeOverrideApplied: false,
  pressureLevel: 'low',
  tokenUsageRatio: 0.2,
};

const fallback: FallbackMetrics = {
  fallbackTriggered: false,
  degradedModeActive: false,
};

const quality: QualityMetrics = {
  resultCount: 8,
  avgRelevanceScore: 0.90,
  topResultScore: 0.95,
  boostImpactDelta: 0.05,
  extractionCountInSession: 3,
  qualityProxyScore: 0.87,
};

const telemetry: RetrievalTelemetry = {
  enabled: true,
  timestamp: new Date().toISOString(),
  latency,
  mode,
  fallback,
  quality,
};
```

### Example 2: Check Feature Flag Before Extended Collection

```typescript
const extended = process.env.SPECKIT_EXTENDED_TELEMETRY === 'true';

if (extended) {
  // Collect full latency breakdown and quality score
  telemetry.latency = collectLatencyMetrics(stages);
  telemetry.quality = computeQualityScore(results, requestedLimit, telemetry.latency.totalLatencyMs);
} else {
  // Minimal telemetry only
  telemetry.enabled = false;
}
```

### Example 3: Scoring Observability

```typescript
import { shouldSample, logScoringObservation, getScoringStats } from './scoring-observability';

if (shouldSample()) {
  logScoringObservation({
    memoryId: 42,
    queryId: 'q-abc-123',
    timestamp: new Date().toISOString(),
    noveltyBoostApplied: true,
    noveltyBoostValue: 0.15,
    memoryAgeDays: 2,
    interferenceApplied: false,
    interferenceScore: 0,
    interferencePenalty: 0,
    scoreBeforeBoosts: 0.72,
    scoreAfterBoosts: 0.87,
    scoreDelta: 0.15,
  });
}

const stats = getScoringStats();
// { totalObservations: 50, avgNoveltyBoost: 0.12, ... }
```

### Example 4: Validate a Trace Payload

```typescript
import { sanitizeRetrievalTracePayload, isRetrievalTracePayload } from './trace-schema';

const raw = getTraceFromPipeline();
const canonical = sanitizeRetrievalTracePayload(raw);
// Returns null if invalid, or a sanitized TelemetryTracePayload

if (isRetrievalTracePayload(raw)) {
  // raw matches canonical schema exactly
}
```

### Common Patterns

| Pattern | When to Use |
|---------|-------------|
| Populate `RetrievalTelemetry` before returning from handler | Every retrieval handler call |
| Check `fallback.fallbackTriggered` to gate quality alerts | Governance / SLO monitoring |
| Use `quality.qualityProxyScore < 0.6` to log degraded-run warnings | Observability dashboards |
| Compare `latency.rerankLatencyMs` to `0` | Detect runs where reranking was skipped |
| Call `shouldSample()` before `logScoringObservation()` | Scoring hot path (avoid logging every call) |

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [lib/contracts/README.md](../contracts/README.md) | Retrieval pipeline contracts (envelopes, traces) |
| [lib/search/README.md](../search/README.md) | Hybrid search pipeline |
| [lib/cognitive/README.md](../cognitive/README.md) | Cognitive pressure monitoring |
| [lib/scoring/README.md](../scoring/README.md) | Composite scoring (referenced by scoring observability) |

### Related Modules

| Module | Purpose |
|--------|---------|
| `handlers/memory-search.ts` | Primary integration point for telemetry collection |
| `handlers/memory-context.ts` | Secondary integration point for telemetry collection |

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-03-08
