# Iteration 005 - Correctness

## Focus

Dimension: correctness.

Files read:
- Prior iteration 004 and findings registry.
- `skill_advisor.py` health and inventory code.
- Runtime helper discovery/parity code.

Verification:
- Scoped vitest command passed: 4 files, 30 tests.
- Git history checked for audited implementation files.
- Reproduction command: `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health` exits 0 but reports `"status": "degraded"`, `"skill_graph_source": "sqlite"`, `"skill_graph_skill_count": 21`, and `"missing_in_discovery": ["skill-advisor"]`.

## Findings

| ID | Sev | Finding | Evidence | Impact |
|----|-----|---------|----------|--------|
| IMPL-COR-002 | P1 | The advisor health check is structurally degraded in the current layout because graph inventory includes the nested `skill-advisor` node while SKILL.md discovery only scans top-level skill folders. That means the health command used by the setup script reports degraded even when SQLite loads successfully. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2931`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2934`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2957`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2958`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2965`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2968`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:153`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:155`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:291`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:315` | Operators get a degraded health result even after the graph is present. This makes the setup-health signal ambiguous: it cannot distinguish real broken graph state from an expected nested-package inventory mismatch. |

## Ruled Out

- This is not just doc drift. It is reproduced by the live Python health command and the live SQLite graph inventory.
- This is separate from `IMPL-COR-001`: even if validation/export were allowed to continue, the final health step would still report degraded in the current layout.

## Churn

New findings this iteration: P0=0, P1=1, P2=0. Severity-weighted newFindingsRatio=0.25.
