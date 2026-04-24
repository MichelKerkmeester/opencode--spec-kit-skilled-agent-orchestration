# Iteration 002 - Security

## Prior State

Read iteration 001 and the registry. Open finding: `P1-IMPL-002`.

Vitest: PASS, `2 passed` files, `77 passed | 3 skipped`.

## Finding

### P0-IMPL-001 - Tier 3 target_doc can escape the spec folder before canonical merge writes

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:856` returns a validated Tier 3 response.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859` preserves `raw.target_doc` if it is a string.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:860` does the same for `raw.target_anchor`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157` special-cases only `spec-frontmatter` and `implementation-summary.md`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160` uses `path.join(specFolderAbsolute, routedDocPath)` for all other routed docs.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427` resolves `effectiveDecision.target.docPath`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1443` reads the resolved path.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1503` then passes that document into `anchorMergeOperation`.

Expected: untrusted Tier 3 target docs are restricted to a canonical allowlist and verified to remain under the packet folder before any read or merge write.

Actual: a Tier 3 response with a high-confidence non-drop category can provide `../` segments in `target_doc`. The memory-save path joins that value and proceeds if the escaped path exists.

## Delta

New findings: 1. Registry updated with `P0-IMPL-001`.
