---
title: "advisor_validate MCP Tool"
description: "Native MCP tool that returns release-gate slices plus explicit threshold semantics and prompt-safe telemetry/outcome rollups."
trigger_phrases:
  - "advisor_validate"
  - "mcp validate tool"
  - "release gate slices"
  - "corpus holdout parity"
---

# advisor_validate MCP Tool

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Drive release-readiness decisions from real measurements. Consolidate corpus, holdout, parity, safety, and latency slices behind one tool call, while also exposing the threshold contract and prompt-safe telemetry summaries operators need to interpret the run.

---

## 2. CURRENT REALITY

`handlers/advisor-validate.ts` runs the bundled validation slices and returns the landed public contract:

| Top-Level Field | What It Publishes |
| --- | --- |
| `workspaceRoot` / `skillSlug` | The resolved workspace plus optional skill-scoped validation target. |
| `thresholdSemantics` | Separates aggregate release-gate thresholds from prompt-time routing thresholds. |
| `overallAccuracy` / `perSkill` | Aggregate top-1 results for the active corpus selection. |
| `slices` | Corpus, holdout, parity, safety, and latency slice payloads. |
| `telemetry` | Prompt-safe diagnostics and durable outcome rollups. |
| `generatedAt` | Run timestamp for the validation envelope. |

Threshold semantics are explicit so release gating does not get conflated with prompt-time routing:

| Threshold Group | Current Values |
| --- | --- |
| `aggregateValidation` | `fullCorpusTop1=0.75`, `holdoutTop1=0.725`, `perSkillTop1=0.7`, `unknownCountTargetMax=10` |
| `runtimeRouting` | `confidenceThreshold=0.8`, `uncertaintyThreshold=0.35`, `confidenceOnly=false` |

The current baseline slices remain:

| Slice | Target | Measured |
| --- | --- | --- |
| Full corpus top-1 | >= 75% | 80.5% |
| Holdout top-1 | >= 72.5% | 77.5% |
| UNKNOWN | <= 10 | UNKNOWN <= 10 |
| Python-correct parity | 0 regressions | 0 regressions |
| Latency (cache-hit p95) | <= 50 ms | ~6.99 ms |
| Latency (uncached p95) | <= 60 ms | ~11.45 ms |

Telemetry is published as prompt-safe rollups rather than raw prompt content:

| Telemetry Surface | Fields |
| --- | --- |
| `telemetry.diagnostics` | `recordsPath`, `recordsRetained`, `rollingCacheHitRate`, `rollingP95Ms`, `rollingFailOpenRate` |
| `telemetry.outcomes` | `recordsPath`, `recordedThisRun`, `totals` |

`telemetry.outcomes.totals` reports durable outcome counts, and `recordedThisRun` reflects any `outcomeEvents` supplied on the validating call.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-validate.vitest.ts`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/parity/` — Python/TS parity harness.
- Playbook scenario [NC-003](../../manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md).

---

## 5. RELATED

- [01-advisor-recommend.md](./01-advisor-recommend.md).
- [`04--scorer-fusion/05-ablation.md`](../04--scorer-fusion/05-ablation.md).
