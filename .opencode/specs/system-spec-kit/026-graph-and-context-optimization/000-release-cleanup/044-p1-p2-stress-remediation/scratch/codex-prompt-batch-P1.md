# Batch P1 — Generate 6 P1 stress tests

You are generating Vitest stress tests under spec-kit packet 044. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Output locations

- 3 files to `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/`
- 3 files to `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/`

## Reference patterns (READ FIRST)

Look at the new files added by packet 043 to learn the project's stress-test style:
- `mcp_server/stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts` (cg)
- `mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts` (sa)
- `mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts` (sa concurrency)
- `mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` (sa large-corpus)

## The 6 P1 features

### File 1: `code-graph/code-graph-scan-stress.vitest.ts` (cg-003)

- **Catalog**: `mcp_server/code_graph/feature_catalog/02--manual-scan/01-code-graph-scan.md`
- **Source**: `mcp_server/handlers/code_graph/scan.ts` and related — read to find exports
- **Stress axes**: full-scan handler under wide directory tree (1000+ files); scan with `verify=true` flag; concurrent scans

### File 2: `code-graph/code-graph-context-stress.vitest.ts` (cg-007)

- **Catalog**: `mcp_server/code_graph/feature_catalog/04--context-retrieval/01-code-graph-context.md`
- **Source**: `mcp_server/handlers/code_graph/context.ts`
- **Stress axes**: handler seed/deadline pressure — many seeds, tight budgets; deeply nested context; budget exhaustion

### File 3: `code-graph/context-handler-normalization-stress.vitest.ts` (cg-008)

- **Catalog**: `mcp_server/code_graph/feature_catalog/04--context-retrieval/02-context-handler.md`
- **Source**: `mcp_server/lib/code_graph/context-handler.ts` (or similar)
- **Stress axes**: normalization paths for adversarial input; blocked-output paths under saturation

### File 4: `skill-advisor/five-lane-fusion-stress.vitest.ts` (sa-019)

- **Catalog**: `mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/01-five-lane-fusion.md`
- **Source**: `mcp_server/skill_advisor/lib/scorer/fusion.ts` — `scoreAdvisorPrompt`
- **Stress axes**: large-corpus lane pressure (500+ skills, varied lane signals); thrashing across lanes; degenerate inputs

### File 5: `skill-advisor/skill-projection-stress.vitest.ts` (sa-020)

- **Catalog**: `mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/02-projection.md`
- **Source**: `mcp_server/skill_advisor/lib/scorer/projection.ts` — projection helpers
- **Stress axes**: large-fixture projections (1000+ skills); projection consistency under repeated calls; edge nodes/empty edges

### File 6: `skill-advisor/advisor-recommend-handler-stress.vitest.ts` (sa-025)

- **Catalog**: `mcp_server/skill_advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md`
- **Source**: `mcp_server/skill_advisor/handlers/advisor-recommend.ts` (or wherever the handler lives)
- **Stress axes**: full MCP handler under load (many concurrent recommend calls); large prompt payload; degraded skill graph

## Required structure

Same shape as packet 043 tests: `describe('<feature_id> — <feature name>')`, `beforeEach`/`afterEach` with `mkdtempSync`/`rmSync`, 2-3 `it(...)` blocks per file with real assertions.

Imports must reference real product source. If the exact export name is unclear, READ the source file to confirm. Do NOT modify product code.

## Done definition

- 6 new files at the documented paths
- Each `describe` block opens with feature_id
- Each file has at least 2 `it(...)` blocks with real assertions
- Self-validate by running:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run --config vitest.stress.config.ts \
  stress_test/code-graph/code-graph-scan-stress.vitest.ts \
  stress_test/code-graph/code-graph-context-stress.vitest.ts \
  stress_test/code-graph/context-handler-normalization-stress.vitest.ts \
  stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts \
  stress_test/skill-advisor/skill-projection-stress.vitest.ts \
  stress_test/skill-advisor/advisor-recommend-handler-stress.vitest.ts
```

If anything fails, fix it. If real product behavior under stress requires investigation, weaken the assertion to "surface is callable" and emit `// FIXME(<feature_id>): real product behavior under stress requires investigation`. Keep tests passing.

## IMPORTANT: Spec folder context

This work is part of spec-kit packet `044-p1-p2-stress-remediation`. If asked about spec folder, the answer is: **continuing existing packet 044**. Do not block on Gate 3.
