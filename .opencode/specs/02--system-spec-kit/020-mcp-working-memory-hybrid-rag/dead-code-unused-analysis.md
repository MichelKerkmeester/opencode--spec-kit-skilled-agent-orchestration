# Dead Code and Unused Analysis

<!-- ANCHOR: summary -->
## Summary

This document captures dead code and unused symbol findings from the current review of the MCP working-memory hybrid RAG implementation.
<!-- /ANCHOR: summary -->

<!-- ANCHOR: context -->
## Scope and Method

- Scope: `.opencode/skill/system-spec-kit/scripts/` and `.opencode/skill/system-spec-kit/mcp_server/`
- Method: static review analysis with line-level evidence
- Confidence: proven findings are direct code facts, suspected findings need targeted follow-up
<!-- /ANCHOR: context -->

<!-- ANCHOR: artifacts -->
## Proven Findings

| Finding | Evidence | Why it matters |
|---|---|---|
| Unreachable FAIL path in `chk113` | Set at `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:299`, compared at `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:420` | `totalRequests` is set from a constant and compared to that same constant, so the FAIL path cannot execute. |
| `chk114` hardcoded PASS | `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:421` | This check always reports PASS and cannot fail, so it does not verify runtime behavior. |
| Unused export `isMemoryAwareTool` | `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:159`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:177` | Exported API is not used by current call sites and adds maintenance noise. |
| Unused type `WorkflowState` | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:82` | Dead type declaration increases surface area without value. |
| Unused exported constant `DEFAULT_DENYLIST` | `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:6` (only local references around `:31` and `:56`) | Export appears unused outside the file and can likely be reduced to internal scope or removed. |

## `embedding-provider` Lifecycle and Relevance

### Current Module State

- `mcp_server/lib/interfaces` currently contains only `vector-store.ts` and `README.md`.
- There is no `mcp_server/lib/interfaces/embedding-provider` module in the current tree.
- `mcp_server/tests/embeddings.vitest.ts` was rewritten from deferred placeholder to active architecture-aligned tests.
- The old deferred marker (`describe.skip ... module lib/interfaces/embedding-provider not found`) was removed.
- Targeted verification now passes: `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` -> 1 file passed, 13 tests passed, 0 skipped.

### Historical Lifecycle Evidence

- `v1.2.0.0` contains `.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/embedding-provider.js` (introduced in commit `e711cd299d08cb8fe2476cb5ba5f8abe769adf1b`).
- `v1.3.3.0` still contains `.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/embedding-provider.js`.
- TS migration commit `63a1b338416e563f6ceb869106da14fb00b4ef1e` removes `.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/embedding-provider.js` and adds `.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` as a deferred placeholder.
- PR #1 does not include files matching `embedding-provider`, `mcp_server/lib/interfaces`, or `tests/embeddings` (query result: `0`).

### Replacement Architecture Evidence

- Provider interface now lives in shared types: `.opencode/skill/system-spec-kit/shared/types.ts:50` (`IEmbeddingProvider`).
- Provider implementations are now in shared providers:
  - `.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts:72`
  - `.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts:82`
  - `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts:94`
- Provider factory is in `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:119`.
- Interface coverage is currently tracked in `.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:372` (T085).

### Relevance Classification

- **Placeholder suite relevance:** Drift resolved (legacy history retained).
- **Reason:** The suite no longer targets the removed `lib/interfaces/embedding-provider` path and now aligns with current shared embedding architecture.
- **Coverage status:** Rewritten suite verification passes (1 file, 13 tests, 0 skipped), with interface intent still represented by shared-type/provider paths and T085 coverage in `interfaces.vitest.ts`.

## Suspected Findings

- Compatibility aliases and test-only exports in config modules and snake_case handlers look intentionally retained.
- These items were not marked as proven dead code in this pass because they may still serve backward compatibility or test harness needs.
<!-- /ANCHOR: artifacts -->

<!-- ANCHOR: next-steps -->
## Next Steps

1. Replace hardcoded or unreachable benchmark checks with measurable conditions.
2. Remove or internalize unused exports and types after confirming no external consumers.
3. Keep `tests/embeddings.vitest.ts` aligned with shared embedding contracts and provider/factory behavior.
4. Re-run targeted embedding tests during future shared embedding contract changes.
5. Keep compatibility aliases only where required and document each retained alias.
<!-- /ANCHOR: next-steps -->
