The targeted fallback suites are green, but the full MCP server suite is not.

**Results**
- Targeted suite 1 passed: `71/71`
- Targeted suite 2 passed: `59/59`
- Targeted suite 3 passed: `184/184`
- Targeted total passed: `314/314`

A full-suite rerun with JSON reporting showed:
- Total tests: `8664`
- Passed: `8548`
- Failed: `16`
- Skipped: `74`
- Todo: `26`

One important caveat: the exact command `npx vitest run --reporter=verbose 2>&1 | tail -50` masked Vitest’s non-zero exit status because of the pipe to `tail`, so the shell exit code came back `0` even though failures were present.

**Failures**
- `13` failures in [entity-linker.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts#L27).
  - Root cause is in [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L392): `buildEntityCatalog()` now filters on `mi.importance_tier`.
  - The test DB fixture’s `memory_index` schema in [entity-linker.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts#L30) does not create an `importance_tier` column.
  - Rerunning that file logs: `Failed to build entity catalog: no such column: mi.importance_tier`.
  - Because the function catches that SQL error and returns an empty map, failures cascade through `buildEntityCatalog`, `findCrossDocumentMatches`, and `runEntityLinking`.

- `2` failures in [hydra-spec-pack-consistency.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts#L66).
  - One is doc wording drift: the test expects `"acts as the Level 3 coordination record..."` at [line 71](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts#L71), but [spec.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/spec.md#L22) says `"now acts as..."`, so the exact substring no longer matches.
  - The other is a stale runtime reference: the test and docs still require `mcp_server/lib/governance/retention.ts` at [lines 25-28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts#L25) and [tasks.md line 61](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/tasks.md#L61), but that file does not exist in the repo. Current governance tests import [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts#L4), and retention-related fields are handled in [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L270).

- `1` failure in [modularization.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts#L20).
  - The limit for `handlers/memory-triggers.js` is `440` lines at [lines 20-26](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts#L20), and the assertion is at [line 90](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts#L90).
  - The compiled file [dist/handlers/memory-triggers.js](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-triggers.js) is currently `451` lines on disk, so this is a real size-budget failure, not a flaky test.

Net: the specific targeted memory handler/transaction/calibration lanes pass, but the full Spec Kit Memory MCP server suite currently fails in 3 files with 16 failing tests.
