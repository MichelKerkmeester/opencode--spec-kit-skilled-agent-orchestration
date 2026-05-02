---
title: "Agent 4 Doc Alignment Summary"
description: "Audit summary for memory command and MCP capability documentation aligned to Memory Database Refinement fixes."
---

# Agent 4 Doc Alignment Summary

## Scope Audited

- `.opencode/command/memory/`
- `.opencode/skill/sk-deep-research/`
- `.opencode/command/spec_kit/`
- `.opencode/skill/system-spec-kit/scripts/`
- `.opencode/skill/system-spec-kit/mcp_server/configs/`

## Files Updated

### `.opencode/command/memory/manage.md`

- Corrected `shared status` command usage from legacy `--user` / `--agent` flags to schema-aligned `--actor-user` / `--actor-agent`.
- Documented that `shared_memory_enable()` now requires authenticated caller context and only succeeds for the configured shared-memory admin, even though the tool still takes no user-supplied parameters.
- Updated the shared-status workflow and MCP signature to use `actorUserId` / `actorAgentId`.
- Added explicit error-handling guidance for shared-enable auth failures.

### `.opencode/command/memory/README.txt`

- Corrected the shared-status invocation syntax to use actor identity flags.
- Added a shared-memory note clarifying the new auth/admin requirement for `shared_memory_enable()` and the concrete-caller requirement for `shared_memory_status`.
- Updated the usage example for `shared status`.
- Expanded FAQ/troubleshooting coverage for shared-enable auth failures, missing ablation IDs, and investigation-only ablation runs caused by token-budget overflow.

### `.opencode/command/memory/search.md`

- Added the optional `mode` parameter to the ablation parameter table to match the current schema (`ablation` or `k_sensitivity`).
- Documented current ablation behavior:
  - missing `groundTruthQueryIds` warn and continue
  - `Token budget overflow` below `recallK` is investigation-only
  - `scripts/evals/map-ground-truth-ids.ts` should be rerun after DB rebuild/swap before comparing deltas
- Updated the example ablation tool call to the recommended explicit form: `mode: "ablation"`, `storeResults: true`, `includeFormattedReport: true`.
- Added matching error-handling notes for the ablation warning cases.

### `.opencode/skill/system-spec-kit/scripts/evals/README.md`

- Updated `map-ground-truth-ids.ts` description to call out the DB rebuild/swap rerun requirement.
- Updated `run-ablation.ts` description to mention missing-ID warnings and investigation-only handling when token-budget overflow truncates evaluation below Recall@K validity.

### `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`

- Clarified that runtime behavior is determined by live resolver helpers, not by frozen import-time config snapshots.
- Kept `COGNITIVE_CONFIG` documented, but noted that callers needing fresh env values should use `loadCognitiveConfigFromEnv()` / `safeParseCognitiveConfigFromEnv()`.
- Added explicit guidance that feature-flag and shared-memory enablement behavior should be documented against runtime resolver functions such as `isSharedMemoryEnabled()`.

## Audited With No Content Changes Required

### `.opencode/skill/sk-deep-research/`

- Reviewed `README.md`, `SKILL.md`, `references/quick_reference.md`, plus reference/asset search hits for memory MCP usage.
- No stale references to changed memory MCP capability names or shared-memory auth semantics were found in the checked files.

### `.opencode/command/spec_kit/`

- Reviewed `deep-research.md` and `resume.md` for memory MCP references.
- No updates were needed for the documented `memory_context()` / `memory_search()` / `memory_match_triggers()` usage in the checked command docs.

### `.opencode/skill/system-spec-kit/scripts/README.md`
### `.opencode/skill/system-spec-kit/scripts/setup/README.md`
### `.opencode/skill/system-spec-kit/scripts/rules/README.md`

- Audited for references to changed memory MCP behavior.
- No stale MCP capability documentation was found in these files.

## Verification Notes

- Source-of-truth checks were taken from:
  - `mcp_server/tool-schemas.ts`
  - `mcp_server/schemas/tool-input-schemas.ts`
  - `mcp_server/handlers/shared-memory.ts`
  - `mcp_server/lib/collab/shared-spaces.ts`
  - `mcp_server/lib/eval/ablation-framework.ts`
  - `mcp_server/hooks/response-hints.ts`
  - `mcp_server/lib/parsing/trigger-matcher.ts`
  - `mcp_server/lib/search/intent-classifier.ts`

- Notable confirmed implementation facts used during alignment:
  - `shared_memory_status` validates `actorUserId` / `actorAgentId`, not legacy `userId` / `agentId`.
  - `shared_memory_enable` is auth-gated in the handler and admin-only.
  - `eval_run_ablation` accepts optional `mode`.
  - Missing ablation IDs warn and continue.
  - Envelope `tokenCount` is synchronized from full serialized envelope content.
  - Trigger matching is Unicode-aware in `trigger-matcher.ts`.
  - Intent classification now computes `rankedIntents`, but no audited target doc required a public-facing change for that internal enhancement.
