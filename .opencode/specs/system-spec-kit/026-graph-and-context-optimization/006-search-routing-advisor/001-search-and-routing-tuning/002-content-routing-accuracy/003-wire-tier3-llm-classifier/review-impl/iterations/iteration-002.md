# Iteration 002 - Security

## Scope

Re-read the audited production files with security focus, especially LLM transport boundaries and file target resolution.

## Verification

Scoped Vitest result: PASS. `2` files passed; `89` tests passed and `3` skipped.

Git history check repeated against the audited files. The implementation commit history confirms this area was recently changed by Tier 3 enablement and deep-review remediation commits.

## Findings

### IMPL-F002 - P0 Security - Tier 3 target_doc can escape the spec folder

Tier 3 response validation only checks type and enum shape. At `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837`, `validateTier3Response()` accepts a raw response, and at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:856` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:861` it preserves any string `target_doc` and `target_anchor` when confidence is at least `TIER3_THRESHOLD`.

The decision builder then trusts those strings as the effective target at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:689`.

The save handler resolves that model-provided doc path with `path.join(specFolderAbsolute, routedDocPath)` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160`, then checks existence and reads it at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1443`. If the escaped document has the requested anchor, `anchorMergeOperation()` writes the merge payload at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1503` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1515`.

Expected behavior: a Tier 3 model response should be constrained to an allowlist of canonical target docs under the same spec folder, or rejected/fail-open to Tier 2. Actual behavior: a high-confidence response can name `../sibling-packet/implementation-summary.md` and the handler will normalize to a path outside the current packet if that file exists.

### IMPL-F003 - P1 Security - full-auto enables live Tier 3 transport even when the router flag is unset

The handler sets `tier3Enabled` with `params.plannerMode === 'full-auto' || isTier3RoutingEnabled()` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`. The explicit flag reader in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1368` therefore does not fully control Tier 3 activation in the save path.

Once enabled, `classifyWithTier3Llm()` posts the prompt body to `${endpoint}/chat/completions` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1069`.

The handler test at `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625` through `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1674` codifies that `plannerMode: 'full-auto'` plus an endpoint is enough to call `fetch`, without setting the router flag. This creates a hidden outbound-content path for callers who treat the flag as the Tier 3 activation control.

## Convergence

New weighted findings ratio: `0.58`. Continue.
