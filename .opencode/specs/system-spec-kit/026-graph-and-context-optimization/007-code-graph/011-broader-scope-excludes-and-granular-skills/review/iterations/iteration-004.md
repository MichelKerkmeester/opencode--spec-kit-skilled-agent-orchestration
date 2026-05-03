## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md`:1-85
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`:5-9,53-99,101-189,191-235
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`:139-172
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`:253-276,610-625
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`:26-38,252-261,355-372,394-407
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`:171-175,271-290
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`:31-46,57-90
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`:562-589
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`:488-500,750
- `.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts`:83-170,224-278
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`:55-63,116-139,288-460,467-490
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts`:149-268,310-407,409-548
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts`:31-75,78-167
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md`:236-306
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`:258-265

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`:572-578, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`:488-497, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`:71-85, `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`:80-85, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`:355-372 — Granular `includeSkills` accepts syntactically valid but nonexistent skill names with no warning or failure.
   - Risk: a maintainer typo such as `includeSkills:["sk-dooc"]` or `SPECKIT_CODE_GRAPH_INDEX_SKILLS=sk-dooc` passes both public schemas because the regex only checks the `sk-*` shape. Policy resolution preserves that value as an active list, the matcher only includes `.opencode/skill/<name>` when the folder segment equals one of those names, and the scan still returns `status:"ok"` with warnings sourced only from indexer warnings. The result is an apparently successful targeted skill scan that silently indexes no requested skill content when every requested name is absent.
   - Fix class: `cross-consumer` + `matrix/evidence` because the same selected-skill list is consumed by schema validation, env parsing, scan execution, status reporting, persistence fingerprints, docs, and tests.
   - Recommended fix: validate selected skill names against discovered `.opencode/skill/*` directories at scan time, or at minimum emit deterministic scan warnings for unknown requested skills. Keep the schema regex as a syntax guard if runtime existence cannot be known there, but add per-call and env matrix tests for unknown names and document the resulting warning/failure behavior.

## Verdict

CONDITIONAL — the five env constants and default handling are consistent, but granular skill selection needs an existence/diagnostic path so typos do not create successful no-op scans.
