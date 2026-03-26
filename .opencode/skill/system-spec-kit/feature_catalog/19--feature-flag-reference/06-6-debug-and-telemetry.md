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
| `SPECKIT_RESULT_EXPLAIN_DEBUG` | `false` | boolean | `mcp_server/formatters/search-results.ts` | Enables debug-tier explainability fields. It does not turn explainability on by itself. |
| `SPECKIT_HYDE_LOG` | `false` | boolean | `mcp_server/lib/search/hyde.ts` | Logs HyDE shadow-run details, including pseudo-document length, for debugging. It has no retrieval effect. |
| `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | `lib/config/capability-flags.ts` | Legacy compatibility alias for the memory-roadmap phase label. Used by telemetry, eval baselines, migration checkpoint metadata, and rename-window compatibility paths. Unsupported values fall back to `shared-rollout`. |
| `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the lineage roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Consumed by roadmap metadata snapshots and rename-window lineage compatibility checks. |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the unified-graph roadmap flag. Roadmap metadata is default-on unless explicitly opted out. It remains distinct from the live `SPECKIT_GRAPH_UNIFIED` runtime gate. |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the adaptive-ranking roadmap flag. Phase 4 adaptive ranking remains dormant in production, so roadmap metadata defaults this flag to off unless explicitly enabled with `true` or `1`. Used by roadmap snapshots and adaptive shadow-ranking compatibility checks. |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the scope-enforcement roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap snapshots and governed-scope compatibility checks. |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the governance-guardrail roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or `0`. Used by roadmap snapshots and governed-ingest compatibility checks. |
| `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the shared-memory roadmap flag. Roadmap metadata now defaults this flag to off unless explicitly enabled with `true` or `1`, matching the live shared-spaces runtime gate. This keeps diagnostic snapshots from claiming shared memory is live before runtime rollout enables it. |
| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | `lib/telemetry/consumption-logger.ts` | (Also listed under Search Pipeline.) **Default ON (graduated via rollout policy).** `isConsumptionLogEnabled()` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`, so consumption logging stays active unless explicitly disabled or rollout policy gates it off. |

### Operational and validation controls

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | string | `mcp_server/lib/cognitive/adaptive-ranking.ts` | Selects the effective adaptive-ranking mode once adaptive ranking is enabled. Only `promoted` elevates the shadow proposal to promoted mode; unset and any other value resolve to `shadow`. |
| `SPECKIT_RECENCY_DECAY_DAYS` | `90` | number | `mcp_server/lib/storage/access-tracker.ts` | Positive day-count override for the linear recency decay window used in popularity scoring. Invalid or non-positive values fall back to 90 days. |
| `SPECKIT_RULES` | _(unset)_ | string | `scripts/spec/validate.sh` | Comma-separated subset of validation rules to run. Each entry is canonicalized; unrecognized names produce a warning and are skipped. |
| `SPECKIT_SKIP_POST_VALIDATE` | _(unset)_ | string | `scripts/spec/create.sh` | When set to `1`, skips the automatic post-create or post-phase validation pass in spec creation flows. Any other value leaves post-validation enabled. |
| `SPECKIT_SKIP_VALIDATION` | _(unset)_ | string | `scripts/spec/validate.sh` | When set to any non-empty value, the validator exits early with code 0 after logging that validation was skipped. |
| `SPECKIT_STRICT` | `false` | boolean | `scripts/spec/validate.sh` | Enables strict validation mode, treating warnings as errors. Equivalent to passing `--strict`. |
| `SPECKIT_VALIDATION` | `true` | boolean | `scripts/spec/validate.sh` | Master on/off switch for spec validation. When set to `false`, validation is disabled and the script exits successfully without running rules. |

### Output and diagnostics controls

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_JSON` | `false` | boolean | `scripts/spec/validate.sh` | Enables JSON output mode for spec validation. Equivalent to passing `--json`. |
| `SPECKIT_QUIET` | `false` | boolean | `scripts/spec/validate.sh` | Suppresses non-essential validator output and keeps results terse. Equivalent to passing `--quiet`. |
| `SPECKIT_VALIDATE_LINKS` | `false` | boolean | `scripts/rules/check-links.sh` | Enables wikilink validation across skill markdown files during the `LINKS_VALID` rule. When unset or false, the rule reports a skipped pass. |
| `SPECKIT_VERBOSE` | `false` | boolean | `scripts/spec/validate.sh` | Enables detailed validator output. Equivalent to passing `--verbose`. |

---

## 3. SOURCE FILES

Source file references are included in the flag tables above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 6. Debug and Telemetry
- Current reality source: FEATURE_CATALOG.md
