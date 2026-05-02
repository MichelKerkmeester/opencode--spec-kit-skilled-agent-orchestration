## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:1-82`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:1-52`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:1-167`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1-130`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1475`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1-180`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:230-255`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:580-600`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:1-190`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:260-320`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:520-570`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:1-140`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:180-405`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:1-260`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:1-150`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:559-576`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:1-130`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:489-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:679-686`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:742-748`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:250-310`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:1-180`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:230-560`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:1-170`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:215-222`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:520-570`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:614-632`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:232-280`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:258-264`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:1-180`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:1-180`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:1-170`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:1-160`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:1-154`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:1-126`

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R2-I1-P2-001: Skill-scope path literals still have multiple source-code representations

The central policy exports `CODE_GRAPH_SKILL_EXCLUDE_GLOBS` for the default glob exclusion, and most callers reuse that for config-level behavior. However, the same `.opencode/skill` scope is still represented independently as a private regex in `index-scope.ts` and as a SQL `LIKE` literal in `code-graph-db.ts`. That leaves three source-code encodings of the same scope contract: the exported glob, the path-level regex guard, and the status/count SQL predicate. If this scope expands beyond `.opencode/skill/**`, future maintainers must update multiple representations manually, which weakens the "single consistent policy" design called out in the plan.

Evidence:

- `index-scope-policy.ts:9` exports `CODE_GRAPH_SKILL_EXCLUDE_GLOBS = ['**/.opencode/skill/**']`.
- `index-scope.ts:48-50` defines a separate `EXCLUDED_SKILL_INTERNALS_FOR_CODE_GRAPH` regex for `\.opencode/skill`.
- `index-scope.ts:63-64` applies that separate regex through `shouldIndexForCodeGraph()`.
- `code-graph-db.ts:586-592` counts tracked skill files with `WHERE file_path LIKE '%.opencode/skill/%'`.
- `plan.md:127-129` describes the intended architecture as one consistent policy applied at both scope layers.

Severity: P2. This is a maintainability drift risk, not a current behavior failure: tests show default exclusion, env opt-in, per-call opt-in, and per-call false precedence are covered, and the current literals agree for the present `.opencode/skill/**` scope.

Suggested remediation: keep `CODE_GRAPH_SKILL_EXCLUDE_GLOBS` as the public glob surface, but add a policy-owned helper/constant for path-segment matching and SQL/status counting so `index-scope.ts` and `code-graph-db.ts` do not each hand-code the same path contract.

## Traceability Checks

- `spec_code`: PASS. `spec.md:119-121` requires default exclusion plus opt-in; `indexer-types.ts:145-157`, `index-scope.ts:56-65`, `scan.ts:233-236`, and `tool-schemas.ts:563-576` implement that contract.
- `checklist_evidence`: PASS. CHK-022 and CHK-032 are supported by tests covering default false, env true, per-call true, per-call false overriding env, and strict schema rejection (`code-graph-indexer.vitest.ts:257-300`, `code-graph-scan.vitest.ts:253-310`, `tool-input-schema.vitest.ts:617-628`).
- `skill_agent`: PASS. The implementation keeps the structural code graph default end-user scoped while leaving separate advisor/skill graph surfaces out of scope, matching `decision-record.md:101-105`.
- `feature_catalog_code`: PASS. The code exposes readiness/status scope mismatch through existing full-scan recovery paths rather than inventing a new response family (`ensure-ready.ts:293-303`, `status.ts:168-172`, `README.md:272-278`).

## Run-1 Regression Check

- PASS — R1-P1-001 precedence: re-verified `includeSkills:false` overrides env in `index-scope-policy.ts:30-39`, with tests in `code-graph-indexer.vitest.ts:291-300` and `code-graph-scan.vitest.ts:280-310`.
- PASS — R3-P1-001 symlink rootDir bypass: re-verified canonical root flows into `getDefaultConfig()` in `scan.ts:201-234`, with regression test coverage in `code-graph-scan.vitest.ts:312-346`.
- PASS — R1-P2-001/R2-P2-001/R4-P2-002 resource-map drift: re-verified `resource-map.md:58-88` now matches the implementation file set and notes the FIX-009 updates.
- PASS — R4-P2-001 absolute path leakage: re-verified `relativize()` and warning rewriting in `scan.ts:180-194` and `scan.ts:343-344`, with tests in `code-graph-scan.vitest.ts:348-415`.

## Verdict — PASS

No P0/P1 findings. One P2 maintainability advisory was recorded for future cleanup of duplicated skill-scope path literals.

## Next Dimension

Maintainability, iteration 2: focus on readability of readiness/status plumbing and whether scope policy naming stays clear across scan, status, and docs.
