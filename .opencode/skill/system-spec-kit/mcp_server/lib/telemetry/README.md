---
title: "Telemetry"
description: "Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs."
trigger_phrases:
  - "retrieval telemetry"
  - "latency metrics"
  - "quality metrics"
---

# Telemetry

> Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs.

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

The telemetry module provides structured observability for the retrieval pipeline. It records per-stage latency, search mode selection, fallback triggers, and composite quality scores. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 1 | `retrieval-telemetry.ts` |
| Metric Groups | 4 | LatencyMetrics, ModeMetrics, FallbackMetrics, QualityMetrics |
| Feature Flag | 1 | `SPECKIT_EXTENDED_TELEMETRY` (default: true) |

### Key Features

| Feature | Description |
|---------|-------------|
| **RetrievalTelemetry** | Main interface aggregating all metric groups for a single retrieval run |
| **LatencyMetrics** | Stage-by-stage timing: candidate, fusion, rerank, boost, and total |
| **ModeMetrics** | Search mode selection, override flag, pressure level, and optional token usage ratio |
| **FallbackMetrics** | Fallback trigger detection, optional reason string, and degraded-mode flag |
| **QualityMetrics** | Composite 0–1 quality proxy derived from relevance, result count, and latency |
| **TelemetryTracePayload** | Canonical retrieval trace payload (sanitized, no sensitive/extra fields) |
| **Feature Flag** | `SPECKIT_EXTENDED_TELEMETRY` gates extended metric collection (default: enabled) |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
telemetry/
 retrieval-telemetry.ts    # Telemetry interfaces, types, and collection utilities
 README.md                 # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `retrieval-telemetry.ts` | Defines `RetrievalTelemetry`, `LatencyMetrics`, `ModeMetrics`, `FallbackMetrics`, and `QualityMetrics`; exposes collection helpers |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Feature Flag

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPECKIT_EXTENDED_TELEMETRY` | `true` | Enable extended metric collection (latency breakdown, quality scoring) |

When disabled, only the minimal `RetrievalTelemetry` shell is populated; latency, mode, fallback, and quality sub-metrics are omitted.

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
| `tokenUsageRatio` | `number \| undefined` | Optional normalized token usage ratio (0–1) |

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
| `avgRelevanceScore` | `number` | Average relevance component (0–1) |
| `topResultScore` | `number` | Highest result relevance score (0–1) |
| `boostImpactDelta` | `number` | Delta contributed by boost stages |
| `extractionCountInSession` | `number` | Session extraction count at scoring time |
| `qualityProxyScore` | `number` | Composite quality proxy score (0–1) |

**Score Interpretation:**

| Range | Meaning |
|-------|---------|
| 0.80–1.00 | High quality |
| 0.60–0.79 | Acceptable |
| 0.40–0.59 | Degraded |
| < 0.40 | Poor — review fallback policy |

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
const extended = process.env.SPECKIT_EXTENDED_TELEMETRY !== 'false';

if (extended) {
  // Collect full latency breakdown and quality score
  telemetry.latency = collectLatencyMetrics(stages);
  telemetry.quality = computeQualityScore(results, requestedLimit, telemetry.latency.totalLatencyMs);
} else {
  // Minimal telemetry only — consumer can emit { enabled: false }
  telemetry.enabled = false;
}
```

### Common Patterns

| Pattern | When to Use |
|---------|-------------|
| Populate `RetrievalTelemetry` before returning from handler | Every retrieval handler call |
| Check `fallback.fallbackTriggered` to gate quality alerts | Governance / SLO monitoring |
| Use `quality.qualityProxyScore < 0.6` to log degraded-run warnings | Observability dashboards |
| Compare `latency.rerankLatencyMs` to `0` | Detect runs where reranking was skipped |

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

### Related Modules

| Module | Purpose |
|--------|---------|
| `handlers/memory-search.ts` | Primary integration point for telemetry collection |
| `handlers/memory-context.ts` | Secondary integration point for telemetry collection |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-19
