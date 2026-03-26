---
title: "Quality proxy formula"
description: "Describes the automated 0-1 quality proxy score that detects retrieval regressions from four weighted components without requiring manual review."
---

# Quality proxy formula

## 1. OVERVIEW

Describes the automated 0-1 quality proxy score that detects retrieval regressions from four weighted components without requiring manual review.

You cannot have a person hand-check every search result after every change. This feature creates a single "quality score" from 0 to 1 that runs automatically and flags when results are getting worse. Think of it like an automated smoke detector for search quality: it watches for problems around the clock so you do not have to.

---

## 2. CURRENT REALITY

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. The proxy is designed to correlate with manual assessment well enough to act as a regression signal, but this feature entry should not claim a separately verified correlation study against the manual ground-truth corpus.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-quality-proxy.ts` | Lib | Quality proxy formula |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/retrieval-telemetry.vitest.ts` | Quality proxy telemetry computation |

Test file removed: `mcp_server/tests/ceiling-quality.vitest.ts`.

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Quality proxy formula
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 009
