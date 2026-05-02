# Batch B — Generate 3 stress tests (auto-indexing + code_graph convergence)

You are generating Vitest stress tests under spec-kit packet 043. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Output locations

- 2 files to `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/`
- 1 file to `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/`

## Reference patterns to mimic (READ FIRST)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/budget-allocator-stress.vitest.ts`
- Any new files written by Batch A that landed in `stress_test/skill-advisor/` (use them for project-style consistency)

## Required structure for every new file

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// + product-source imports

describe('<feature_id> — <feature name>', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = mkdtempSync(join(tmpdir(), 'stress-<id>-')); });
  afterEach(() => { rmSync(tmpDir, { recursive: true, force: true }); });

  it('<stress axis 1>', async () => { /* real code + asserts */ });
  it('<stress axis 2>', async () => { /* real code + asserts */ });
});
```

## The 3 features to generate

### File 1: `skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` (sa-012)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/02--auto-indexing/05-anti-stuffing.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/anti-stuffing.ts` — exports `applyAntiStuffing` (or similarly-named function — discover by reading the file)
- **Stress axes**:
  1. Build an adversarial skill metadata payload with 500 repeated trigger phrases — verify cardinality cap holds (output count ≤ documented limit, e.g. ~50-100)
  2. Build a payload where one phrase has high repetition density (>30% of total tokens) — verify it's demoted, not promoted, in the output

### File 2: `skill-advisor/df-idf-corpus-stress.vitest.ts` (sa-013)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/02--auto-indexing/06-df-idf-corpus.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts` — exports `computeCorpusStats`, `createDebouncedCorpusUpdater` (or similar)
- **Stress axes**:
  1. Compute corpus stats over 1000 synthetic skills (each with 5-20 trigger phrases). Verify completion in <2s and IDF values are positive finite numbers
  2. Place skills under a `z_archive/` subfolder — verify they are EXCLUDED from active-only stats; the IDF for archived-only terms should not appear
  3. Debounce: trigger 50 rapid recompute calls within 100ms — verify only one compute fires (or that rapid calls coalesce per debounce contract)

### File 3: `code-graph/deep-loop-graph-convergence-stress.vitest.ts` (cg-012)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/04-deep-loop-graph-convergence.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` — exports `handleCoverageGraphConvergence` (handler) and `ConvergenceDecision` type union
- Also relevant: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts` for signal computation
- **Stress axes**:
  1. Saturate the coverage graph with 5000+ nodes; verify `handleCoverageGraphConvergence` returns a decision in <500ms
  2. Inject conflicting CONTRADICTS edges; verify the decision becomes `STOP_BLOCKED` (not silent CONTINUE)
  3. Provide a graph with missing evidence (some nodes lack provenance); verify decision returns a reasoned envelope (CONTINUE or STOP_ALLOWED with explanation), no exception

For convergence test: you may need to use an in-memory or temp SQLite to back the coverage graph. If `handleCoverageGraphConvergence` requires a full handler context, mimic the construction style from `code-graph-degraded-sweep.vitest.ts`. If full handler is too heavy, target the lower-level `coverage-graph-signals.ts` functions directly with synthetic input fixtures.

## How to work

1. Read each source file to learn exact exported names. Don't invent.
2. Read sibling stress tests for project style (imports, fixture style, expect API).
3. Each new file: 2-3 `it(...)` blocks, real assertions, no stubs.
4. Use `tmpdir()` for filesystem isolation; clean in `afterEach`.
5. Do NOT modify product code.

## Done definition

- 3 new files exist at the documented paths
- Each `describe` block opens with feature_id
- Each file has at least 2 `it(...)` blocks
- Self-validate by running:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run --config vitest.stress.config.ts \
  stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts \
  stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts \
  stress_test/code-graph/deep-loop-graph-convergence-stress.vitest.ts
```

Fix any compile/run errors. If a real product behavior under stress requires investigation, weaken the assertion to "surface is callable" and emit `// FIXME(<feature_id>): real product behavior under stress requires investigation` so the user can triage. Keep tests passing.
