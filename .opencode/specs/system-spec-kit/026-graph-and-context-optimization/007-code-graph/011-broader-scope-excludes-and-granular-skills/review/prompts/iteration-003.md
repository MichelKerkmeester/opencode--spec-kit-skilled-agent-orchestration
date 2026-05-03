# Deep-Review v1 Iter 3/5 — 011 broader excludes + granular skills

Mode: review (RUN 1 on 011 implementation)
Dimension: traceability
SessionId: 2026-05-03T04:12:23Z

## Focus
Iter 3 — traceability: cross-check 011 spec.md scope claims against code. Is every Functional Requirement (F1-F5) implemented? Is every claim in implementation-summary.md verifiable? resource-map drift?

## What 011 modified

Code (per packet spec.md §3 F1-F5):
- mcp_server/code_graph/lib/index-scope-policy.ts (4 new env vars + extended resolver, fingerprint v2)
- mcp_server/code_graph/lib/indexer-types.ts (default excludes from policy)
- mcp_server/code_graph/lib/code-graph-db.ts (expanded stored scope fields)
- mcp_server/code_graph/handlers/scan.ts (4 new scan args)
- mcp_server/code_graph/handlers/status.ts (expanded activeScope payload)
- mcp_server/lib/utils/index-scope.ts (broad excludes + selected skill matching)
- mcp_server/tool-schemas.ts + schemas/tool-input-schemas.ts + utils/tool-input-schema.ts

Tests added (per impl summary):
- mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts

Docs:
- mcp_server/code_graph/README.md §8 SCAN SCOPE
- mcp_server/ENV_REFERENCE.md (5 env vars)

## Apply R5 fix-completeness-checklist
Read `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md` first.

## Output
Write narrative to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-broader-scope-excludes-and-granular-skills/review/iterations/iteration-003.md`

Iteration narrative structure:
- ## Dimension: traceability
- ## Files Reviewed (path:line list)
- ## Findings by Severity (### P0 / ### P1 / ### P2 — say "None." if empty)
- ## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

LEAF agent. Hard max 13 tool calls. Read-only on 011 targets.
