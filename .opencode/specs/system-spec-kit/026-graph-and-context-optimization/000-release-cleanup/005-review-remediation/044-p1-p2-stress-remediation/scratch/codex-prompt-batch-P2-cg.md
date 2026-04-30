# Batch P2-cg — Generate stress tests for 10 code_graph P2 features

You are generating Vitest stress tests under spec-kit packet 044. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Output location

`.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/`

## Consolidation guidance

Group naturally:
- **Manual diagnostics trio** (cg-004 verify + cg-005 status): one consolidated file
- **detect_changes preflight** (cg-006): one file
- **Deep-loop CRUD trio** (cg-009 query + cg-010 status + cg-011 upsert): one consolidated file
- **CCC integration trio** (cg-014 reindex + cg-015 feedback + cg-016 status): one consolidated file
- **Doctor apply mode** (cg-017): one file

Result: ~5 files covering 10 features.

## Reference patterns

- `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`
- `mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts`
- `mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` (from packet 043)
- `mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts`

## Features to cover

| feature_id | Catalog path |
|------------|--------------|
| cg-004 | `mcp_server/code_graph/feature_catalog/02--manual-scan/02-code-graph-verify.md` |
| cg-005 | `mcp_server/code_graph/feature_catalog/02--manual-scan/03-code-graph-status.md` |
| cg-006 | `mcp_server/code_graph/feature_catalog/03--detect-changes-preflight/01-detect-changes.md` |
| cg-009 | `mcp_server/code_graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md` |
| cg-010 | `mcp_server/code_graph/feature_catalog/05--coverage-graph/02-deep-loop-graph-status.md` |
| cg-011 | `mcp_server/code_graph/feature_catalog/05--coverage-graph/03-deep-loop-graph-upsert.md` |
| cg-014 | `mcp_server/code_graph/feature_catalog/07--ccc-integration/01-ccc-reindex.md` |
| cg-015 | `mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md` |
| cg-016 | `mcp_server/code_graph/feature_catalog/07--ccc-integration/03-ccc-status.md` |
| cg-017 | `mcp_server/code_graph/feature_catalog/08--doctor-code-graph/01-doctor-apply.md` |

## Requirements

- Each consolidated file's `describe` block names ALL covered feature_ids (e.g. `'cg-004,005 — manual diagnostics'`)
- Each file has at least 2 `it(...)` blocks per feature_id covered
- Source imports must be real (READ source files to confirm exports)
- For `ccc_*` features (cg-014..016): if the `ccc` binary is unavailable, gracefully `it.skip` with reason; otherwise spawn and assert
- For Doctor apply mode (cg-017): use temp dir; do NOT mutate live filesystem outside tmp
- No product code modified

## Done definition

5 new files exist. Self-validate via:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run --config vitest.stress.config.ts \
  stress_test/code-graph/manual-diagnostics-stress.vitest.ts \
  stress_test/code-graph/detect-changes-preflight-stress.vitest.ts \
  stress_test/code-graph/deep-loop-crud-stress.vitest.ts \
  stress_test/code-graph/ccc-integration-stress.vitest.ts \
  stress_test/code-graph/doctor-apply-mode-stress.vitest.ts
```

(Filenames are guidance — adjust if a clearer name fits, but document the renames.)

If a test would require product changes to pass, weaken with `// FIXME(<feature_id>):` comment and keep it passing.

## IMPORTANT

This is packet 044. Do not block on Gate 3 — answer "continuing 044" if prompted. Do not modify product code under any circumstance.
