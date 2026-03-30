# Iteration 009: D2 Security + D6 Reliability Cross-Reference

## Findings

No P0 issues found.

### [P1] Preflight exact-duplicate checks ignore governed scope, so `memory_save` can leak cross-tenant/shared-space memory metadata and falsely reject scoped saves
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:419-447`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110-1123`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1252-1259`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1296-1313`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1350-1366`
- **Issue**: `memory_save` validates governed ingest and derives a scoped save context, but the subsequent preflight duplicate pass still queries `memory_index` by only `content_hash` and `spec_folder`. That means an exact-content match owned by another tenant/user/session/shared space in the same spec folder is treated as a duplicate before the scoped save proceeds. In dry-run mode, the handler returns the full preflight error payload; in blocking mode, it throws a `PreflightError` with the same structured details. Because the duplicate payload includes `existingId` and `existing_path`, a caller can learn that another scoped row exists and where its backing file lives, and the save can be rejected because of a row the caller is not authorized to see or mutate.
- **Evidence**: `validateGovernedIngest()` runs first and produces `governanceDecision`, but `runPreflight()` is later invoked with the raw database handle and an unscoped `findSimilarMemories` cast. Inside `checkDuplicate()`, the exact-match SQL uses only `content_hash` plus optional `spec_folder`, with no tenant/user/agent/session/shared-space predicates. The handler then returns `preflightResult.errors` and `details` directly in dry-run responses and rethrows them in non-dry-run failures.
- **Fix**: Thread the governed scope into preflight duplicate detection, not just PE gating and the quality gate. Exact-duplicate queries should be filtered by the same tenant/user/agent/session/shared-space rules used elsewhere, and operator-visible error payloads should avoid exposing `existing_path` or foreign IDs for rows outside the caller's authorized scope.

```json
{
  "type": "claim-adjudication",
  "claim": "memory_save's preflight duplicate check bypasses governance scope and can both reveal foreign duplicate metadata and block saves based on memories outside the caller's authorized visibility.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:419-447",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110-1123",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1252-1259",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1296-1313",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1350-1366"
  ],
  "counterevidenceSought": "Looked for a scope-aware wrapper around preflight duplicate queries or a later redaction step before dry-run/error payloads are returned, and did not find one in the reviewed save path.",
  "alternativeExplanation": "The implementation may still assume a mostly single-tenant/local operator database where spec-folder-level duplicate detection is considered sufficient and response payloads are only visible to trusted callers.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if preflight is guaranteed to run only against a caller-isolated database or if an outer transport layer strips duplicate metadata and enforces scope before any memory_save response reaches the client."
}
```

## Cross-Reference Status

- `save-quality-gate.ts`: I did not find a new ESM-specific security failure in the warn-only activation persistence or short-critical exception path. The quality gate now receives scoped similarity callbacks from `memory-save.ts`, so this iteration's boundary issue is narrower and earlier in the pipeline than TM-04.
- `pe-gating.ts`: `findSimilarMemories()` now accepts tenant/user/agent/session/shared-space filters, and the `memory-save.ts` quality-gate / PE-orchestration call sites pass them. I did not find a reason to upgrade the earlier PE-related findings from this pass.
- `hooks/index.ts` and `hooks/memory-surface.ts`: The reviewed hook surface remains token-budgeted and recursion-guarded. I did not find a new cross-scope leak here because this payload only surfaces triggered/constitutional summaries, not raw duplicate metadata.
- `scope-governance.ts`: `createScopeFilterPredicate()` still enforces deny-by-default for empty scopes under enforcement. This iteration's finding is specifically that preflight duplicate detection bypasses that governance model instead of reusing it.

## Upgrade Assessment

- Iteration 002's shared-memory admin spoofing finding remains **P1**, not P0, from this pass. The reviewed governance and hook code did not add a new remote-authentication bypass beyond the already-documented trust-in-caller-identity problem.
- Iteration 006's partial-failure warning-flattening finding remains **P1**. The new preflight leak is a separate earlier-stage boundary defect, not evidence that the response-shaping issue should be upgraded further.

## Summary

- P0: 0 findings
- P1: 1 finding
- P2: 0 findings
- severity upgrades: 0
- newFindingsRatio: 0.45
