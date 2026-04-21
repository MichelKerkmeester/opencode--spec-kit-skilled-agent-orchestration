# Iteration 004 - Testing

## Focus

Dimension: testing.

Files read:
- Prior iteration 003 and findings registry.
- Scoped vitest files requested for this packet.
- Test grep for init-script, indexer, watcher, and fixture coverage.

Verification:
- Scoped vitest command passed: 4 files, 30 tests.
- Git history checked for audited implementation files.
- Grep confirmed `init-skill-graph` is not exercised by the scoped tests, and `skill-graph-db.vitest.ts` covers a clean synthetic skill root only.

## Findings

| ID | Sev | Finding | Evidence | Impact |
|----|-----|---------|----------|--------|
| IMPL-TST-001 | P1 | There is no scoped regression test that executes the shipped init script end-to-end, so the suite passes while `init-skill-graph.sh` currently fails before export/health. | Production path: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:53`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:56`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:59`; current scoped wrapper only runs Python compatibility in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts:13`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts:15`. | The main operator entrypoint can regress independently of the Python advisor API and still leave the packet's scoped vitest run green. |
| IMPL-TST-002 | P1 | The DB indexer tests do not cover mixed repository roots containing non-skill `graph-metadata.json` files, which is the shape used by the real `.opencode/skill` tree. | Production path: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:338`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:455`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:462`; existing test fixture uses a synthetic clean root in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts:28`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts:40`. | The exact recursive-scan failure from iteration 003 is not represented in tests, so future changes can keep passing while startup indexing remains broken on the real repo layout. |
| IMPL-TST-003 | P2 | The context-server watcher path has no scoped test for nested skill-advisor metadata, while the production watcher uses a one-level glob. | Production path: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1528`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1529`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1543`; the available watcher tests exercise the separate daemon watcher in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts:117`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts:124`. | The nested metadata freshness gap is easy to preserve because existing tests validate a different watcher surface. |

## Churn

New findings this iteration: P0=0, P1=2, P2=1. Severity-weighted newFindingsRatio=0.44.
