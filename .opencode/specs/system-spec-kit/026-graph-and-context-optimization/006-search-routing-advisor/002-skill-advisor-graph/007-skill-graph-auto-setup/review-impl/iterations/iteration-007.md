# Iteration 007 - Robustness

## Focus

Dimension: robustness.

Files read:
- Prior iteration 006 state and findings registry.
- `skill_advisor.py` subprocess paths.
- `context-server.ts` shutdown and watcher cleanup paths.

Verification:
- Scoped vitest command passed: 4 files, 30 tests.
- Git history checked for audited implementation files.
- Grep compared timeout usage across native bridge, CocoIndex, validation, and auto-compile subprocess paths.

## Findings

| ID | Sev | Finding | Evidence | Impact |
|----|-----|---------|----------|--------|
| IMPL-ROB-003 | P2 | The Python auto-compile fallback runs the graph compiler without a timeout, unlike the native bridge and CocoIndex subprocess paths. If the compiler blocks on filesystem traversal or process startup, a normal advisor invocation can hang instead of failing open. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:745`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:746`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:747`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:748`, comparison timeout pattern in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:246`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:251`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2015`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2019` | Minor but real resilience gap: the fallback intended to keep routing available under missing graph artifacts can itself become an unbounded blocking point. |

## Churn

New findings this iteration: P0=0, P1=0, P2=1. Severity-weighted newFindingsRatio=0.06.
