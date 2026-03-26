---
title: "6. Debug and Telemetry"
description: "This document captures the implemented behavior, source references, and validation scope for 6. Debug and Telemetry."
---

# 6. Debug and Telemetry

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 6. Debug and Telemetry.

These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DEBUG_TRIGGER_MATCHER` | _(unset)_ | string | `lib/parsing/trigger-matcher.ts` | When set to any non-empty value, emits debug-level output for trigger phrase matching operations. Useful for diagnosing why a particular memory is or is not matching a given prompt. |
| `LOG_LEVEL` | `'info'` | string | `lib/utils/logger.ts` | Minimum log severity level. Messages below this level are suppressed. Valid values: `'debug'`, `'info'`, `'warn'`, `'error'`. All log output goes to stderr (stdout is reserved for JSON-RPC). |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | `lib/eval/eval-logger.ts` | (Also listed under Search Pipeline.) Enables writes to the eval database during retrieval operations. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | (Also listed under Search Pipeline.) Enables verbose file-count diagnostics during index scans. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | `lib/telemetry/retrieval-telemetry.ts` | (Also listed under Search Pipeline.) Opt-in retrieval telemetry. Detailed latency/mode/fallback/quality metrics and architecture updates are recorded only when this is explicitly `'true'`. |
| `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | `lib/config/capability-flags.ts` | Legacy compatibility alias for the memory-roadmap phase label. Used by telemetry, eval baselines, migration checkpoint metadata, and rename-window compatibility paths. Unsupported values fall back to `shared-rollout`. |
| `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the lineage roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Consumed by roadmap metadata snapshots and rename-window lineage compatibility checks. |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the unified-graph roadmap flag. Roadmap metadata is default-on unless explicitly opted out. It remains distinct from the live `SPECKIT_GRAPH_UNIFIED` runtime gate. |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the adaptive-ranking roadmap flag. Phase 4 adaptive ranking remains dormant in production, so roadmap metadata defaults this flag to off unless explicitly enabled with `true` or `1`. Used by roadmap snapshots and adaptive shadow-ranking compatibility checks. |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the scope-enforcement roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap snapshots and governed-scope compatibility checks. |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the governance-guardrail roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap snapshots and governed-ingest compatibility checks. |
| `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the shared-memory roadmap flag. Roadmap metadata now defaults this flag to off unless explicitly enabled with `true` or `1`, matching the live shared-spaces runtime gate. This keeps diagnostic snapshots from claiming shared memory is live before runtime rollout enables it. |
| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | `lib/telemetry/consumption-logger.ts` | (Also listed under Search Pipeline.) **Default ON (graduated via rollout policy).** `isConsumptionLogEnabled()` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`, so consumption logging stays active unless explicitly disabled or rollout policy gates it off. |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 6. Debug and Telemetry
- Current reality source: FEATURE_CATALOG.md
