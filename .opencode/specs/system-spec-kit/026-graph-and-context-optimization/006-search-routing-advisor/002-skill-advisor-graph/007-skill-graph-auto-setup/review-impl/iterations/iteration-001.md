# Iteration 001 - Correctness

## Focus

Dimension: correctness.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Supporting call-graph code: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`

Prior state:
- Fresh implementation-audit packet. No prior implementation findings.

Verification:
- Scoped vitest command passed: 4 files, 30 tests.
- Git history checked for the implementation lineage. Relevant commits include `8264f5ecca feat(011): implement skill graph auto-setup with init script and lazy fallback`, `106d394ca0 refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/`, and `a663cbe78f fix(027): scan-findings Themes 2-7`.
- Reproduction command: `bash .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh` currently reports `rc=2` after "VALIDATION FAILED: 2 error(s)".

## Findings

| ID | Sev | Finding | Evidence | Impact |
|----|-----|---------|----------|--------|
| IMPL-COR-001 | P1 | The shipped init entrypoint fails before it performs setup in the current repository. `init-skill-graph.sh` runs compiler validation under `set -euo pipefail`, so the current `--validate-only` nonzero result aborts before JSON export and advisor health reporting. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:8`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:53`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:56`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:59`; supporting validator behavior in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:97`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:308`. | Operators cannot use the advertised auto-setup script to refresh the fallback graph or see health diagnostics unless the repository has zero topology warnings. This breaks the setup path rather than merely reporting degraded health. |

## Ruled Out

- The init script's repository-root calculation is correct for the live consolidated path: `scripts/../../../../../..` resolves to the repo root.
- The moved claimed paths are not treated as findings in this pass because the request explicitly excluded spec-doc drift; the live counterparts were audited.

## Churn

New findings this iteration: P0=0, P1=1, P2=0. Severity-weighted newFindingsRatio=0.31.
