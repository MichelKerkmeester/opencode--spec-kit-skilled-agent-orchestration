# Strategy — Gap Investigation for 013

## Charter

Investigate which repo surfaces connected to packet `013-code-graph-hook-improvements` were likely missed by the implementation closeout and resource map, with emphasis on docs, test playbooks, tool metadata, and cross-runtime startup/readiness descriptions.

Non-Goals:
- Re-doing pt-02 research
- Finding implementation bugs

Stop Conditions:
- Coverage saturation on cross-refs

Success Criteria:
- Concrete missed-files list

## Known Inventory

- Resource-map-covered implementation files already include the packet-local code-graph handlers, seed resolver, startup brief, runtime startup hooks, `ENV_REFERENCE.md`, focused Vitest suites, packet docs, and prior adjacent research inputs.
- Packet docs already tracked `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `resource-map.md`, and the packet-local zero-calls investigation.
- Resource-map-covered test evidence already includes `code-graph-query-handler.vitest.ts`, `code-graph-context-handler.vitest.ts`, `code-graph-scan.vitest.ts`, `hook-session-start.vitest.ts`, and `codex-session-start-hook.vitest.ts`.
- Resource-map-covered hook/runtime references already include `references/config/hook_system.md` and `mcp_server/hooks/codex/README.md`.
- The on-disk packet does not contain the `applied/T-*.md` files referenced by `resource-map.md` and `checklist.md`, so conservative exclusion must also use `tasks.md` and `implementation-summary.md` target lists.

## Gap Hypotheses

- Feature catalog entries for code-graph storage, readiness, auto-trigger, and CocoIndex bridge still describe pre-013 contracts or stale test paths.
- Manual testing playbook pages still validate counts-only or action-only behavior and may miss `graphQualitySummary`, blocked read payloads, and `partialOutput`.
- `references/` and install-guide surfaces may still describe startup/status behavior at the old “freshness only” level.
- `mcp_server` docs and tool-schema metadata may still advertise the old `code_graph_status` and `code_graph_context` contracts.
- README family drift is likely in top-level `mcp_server/README.md`, `code-graph/README.md`, and adjacent handler READMEs.
- Sibling `009` packet docs may not need edits, but shared payload and hook-oriented docs around startup parity need a cross-check.
- Coordination-root shared payload/startup notes may have downstream consumers that were never cited by the packet.
- `CLAUDE.md` / `AGENTS.md` cross-refs are lower-likelihood unless they explicitly name code-graph startup/status details.

## Iteration Plan

- iter-1 semantic search + code-graph neighborhood expansion from known resource-map entries
- iter-2 grep/glob for cross-references (function names, env vars, doc anchors) across the repo
- iter-3 docs cross-refs (feature_catalog, testing playbook, mcp_server READMEs, references/)
- iter-4 synthesis + dedup
