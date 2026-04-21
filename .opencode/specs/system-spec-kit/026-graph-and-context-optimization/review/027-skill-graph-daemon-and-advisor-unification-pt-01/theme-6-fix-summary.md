# Theme 6 Fix Summary

## Findings

- MERGE-P1-005: fixed. Skill graph indexing now re-publishes edges for every parsed source after all current nodes are known, so an unchanged source can backfill a previously rejected edge when its target appears in a later scan.
- MERGE-P1-006: fixed. Advisor projection loading now fail-opens to filesystem projection when the SQLite graph exists but is unreadable or corrupt, preventing `advisor_recommend` from crashing through native scoring.

## Modified / Added Files

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/theme-6-fix-summary.md`

## Verification Output

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck`
  - Exit 0
  - `tsc --noEmit --composite false -p tsconfig.json`
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`
  - Exit 0
  - `tsc --build`
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/ code-graph/tests/ --reporter=default`
  - Exit 0
  - Test Files: 31 passed (31)
  - Tests: 241 passed (241)
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
  - Exit 0
  - Total cases: 52
  - Passed cases: 52
  - Failed cases: 0
  - Overall pass: true

## Proposed Commit Message

`fix(skill-advisor): backfill graph edges and fail open sqlite projection`
