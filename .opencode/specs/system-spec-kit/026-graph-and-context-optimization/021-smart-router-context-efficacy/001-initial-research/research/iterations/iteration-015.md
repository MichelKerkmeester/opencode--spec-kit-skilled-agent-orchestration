# Iteration 015 - Plugin Telemetry and Status Contract

## Focus Questions

V9, V10

## Tools Used

- Status-tool pattern review
- Metrics contract review

## Sources Queried

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`

## Findings

- Existing advisor metric names include duration, invocations, cache hits, cache misses, fail-open total, and freshness state. Plugin telemetry should reuse those names or clearly prefix OpenCode plugin-specific wrappers. (sourceStrength: primary)
- The OpenCode plugin status tool should avoid raw prompt fields and should report only aggregated counts, last sanitized error, freshness, cache size, TTL, and disabled state. This follows the Phase 020 privacy model. (sourceStrength: moderate)
- Recommended status output fields: `plugin_id`, `enabled`, `cache_ttl_ms`, `node_binary`, `bridge_timeout_ms`, `runtime_ready`, `advisor_freshness`, `last_runtime_error`, `cache_entries`, `invocations`, `cache_hits`, `fail_open_count`. (sourceStrength: moderate)
- Prompt-level diagnostics should remain prompt-free JSONL if persisted at all. Better default: no persistent plugin diagnostics, only in-memory status plus existing hook diagnostic path. (sourceStrength: moderate)
- OpenCode event invalidation should clear cache on session and message changes, mirroring compact code-graph plugin invalidation. (sourceStrength: primary)

## Novelty Justification

This pass converted broad telemetry needs into a prompt-safe status contract.

## New Info Ratio

0.21

## Next Iteration Focus

Review blind-following and assistant-instruction wording.
