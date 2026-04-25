# Theme 7 Fix Summary

## Findings

- PY-P1-001: fixed. `--force-native` now overrides `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` instead of returning an empty legacy result.
- PY-P1-002: fixed. The benchmark harness now disables built-in semantic search for in-process runs and labels runtime modes so the compared paths share the same semantic configuration.
- PY-P1-003: fixed. The regression harness now runs both in-process and subprocess advisor paths by default.
- PY-P1-004: fixed. Graph compiler cross-file validators now normalize malformed edge containers before symmetry, weight-band, parity, cycle, and compile passes.
- MERGE-P1-007: fixed. The Python shim now resolves the nested SQLite database to `mcp_server/database/skill-graph.sqlite`; `init-skill-graph.sh` and `advisor-status.ts` were already on the correct path and needed no code change.
- MERGE-P1-008: fixed for the active runner. The legacy `.opencode/skill/system-spec-kit/scripts/routing-accuracy/` path is absent after the audit; the active `skill-advisor/scripts/routing-accuracy/gate3-corpus-runner.mjs` import now points to the shared Gate 3 classifier.
- PY-P2-001: fixed. Python compatibility tests now cover native bridge legacy field parity and stdin-preferred tty behavior.
- MERGE-P2-001: fixed. Python compat tests now resolve the real scripts directory and are wired into the existing vitest suite via a wrapper under `skill-advisor/tests/compat/`.
- MERGE-P2-002: fixed. `advisor_status` accepts a bounded `maxMetadataFiles` scan option and defaults to a capped metadata walk.
- MERGE-P2-003: fixed. Skill-advisor docs now use repo-root-safe validation commands.
- MERGE-P2-004: fixed. `--force-native` now still tries the native path when semantic flags are present.
- MERGE-P2-005: fixed. `--stdin-preferred` now avoids reading interactive tty stdin before argv fallback.

## Modified / Added Files

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/INSTALL_GUIDE.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/gate3-corpus-runner.mjs`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_bench.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/theme-7-fix-summary.md`

## Verification Output

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck`
  - Exit 0
  - `tsc --noEmit --composite false -p tsconfig.json`
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`
  - Exit 0
  - `tsc --build`
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/ code-graph/tests/ --reporter=default`
  - Exit 0
  - Test Files: 32 passed (32)
  - Tests: 245 passed (245)
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
  - Exit 0
  - Runners exercised: inprocess, subprocess
  - Total cases: 104
  - Passed cases: 104
  - Failed cases: 0
  - Overall pass: true

## Proposed Commit Message

`fix(skill-advisor): harden python bridge and compatibility coverage`
