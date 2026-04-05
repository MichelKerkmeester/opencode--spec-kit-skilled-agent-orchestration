# Iteration 001 — Correctness

## Findings
- P0: `mcp_server/lib/code-graph/startup-brief.ts` missing.
- P0: `mcp_server/hooks/claude/hook-state.ts` lacks most-recent-state loader.
- P0: Startup hooks still emit static sections only.
- P1: No startup-highlight query in `code-graph-db.ts`.

## Next Focus
Implement helper surfaces and hook wiring.

