# Deep Review Report: Skill Graph SQLite Migration

## 1. Executive Summary

Verdict: **FAIL**.

The review completed 10 iterations across correctness, security, traceability, and maintainability. The release is blocked by one P0 correctness issue: the SQLite skill graph indexer recursively scans all `graph-metadata.json` files under `.opencode/skill`, but the current repo contains a non-skill spec-packet metadata fixture under that tree. That file lacks `skill_id`, so the default scan can throw before indexing the graph and leave `skill_graph_*` tools empty or stale.

The review also found five P1 issues and two P2 advisories. The most important non-P0 issues are missing session-bootstrap topology integration, runtime JSON fallback masking SQLite migration failures, incomplete packet documentation, query payload leakage of nested internal paths/hashes, and a destructive scan-root override.

## 2. Scope

Reviewed packet:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration`

Requested packet files:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md` (missing)
- `implementation-summary.md` (missing)
- `description.json`
- `graph-metadata.json`

Implementation evidence reviewed:

- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## 3. Method

The loop followed the requested dimension rotation:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Each iteration read the prior state, reviewed the target packet against one dimension, wrote an iteration narrative, appended a JSONL delta, and updated the registry. Convergence did not legally occur because F-001 is P0. The run stopped at max iterations.

## 4. Findings By Severity

### P0

| ID | Dimension | Title | Primary Evidence |
| --- | --- | --- | --- |
| F-001 | correctness | Recursive skill graph scan ingests a non-skill graph-metadata fixture and can leave the SQLite graph empty | `skill-graph-db.ts:320`, `skill-graph-db.ts:365`, `context-server.ts:1478`, `scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json:1` |

### P1

| ID | Dimension | Title | Primary Evidence |
| --- | --- | --- | --- |
| F-002 | traceability | Session bootstrap does not include the required skill graph topology summary | `spec.md:151`, `checklist.md:109`, `session-bootstrap.ts:272` |
| F-003 | security | `skill_graph_query` leaks nested `sourcePath` and `contentHash` in several response shapes | `query.ts:113`, `query.ts:120`, `query.ts:134`, `query.ts:182` |
| F-004 | traceability | Packet documentation is not synchronized with the implemented state | `spec.md:37`, `tasks.md:14`, `checklist.md:16`, `description.json:8`, `graph-metadata.json:31` |
| F-005 | correctness | Advisor runtime still silently falls back to legacy `skill-graph.json` | `skill_advisor.py:721`, `skill_advisor.py:737`, `skill_advisor.py:744` |
| F-007 | security | `skill_graph_scan` can erase the live graph when pointed at an empty workspace directory | `scan.ts:29`, `scan.ts:39`, `skill-graph-db.ts:433`, `skill-graph-db.ts:520` |

### P2

| ID | Dimension | Title | Primary Evidence |
| --- | --- | --- | --- |
| F-006 | maintainability | Skill graph validation rules are duplicated across database, status, validate, and compiler paths | `skill-graph-db.ts:89`, `status.ts:16`, `validate.ts:13`, `skill_graph_compiler.py:34` |
| F-008 | maintainability | `skill_graph_status` reports `isHealthy: true` while weight-band violations exist | `status.ts:189`, `status.ts:194` |

## 5. Findings By Dimension

### Correctness

- F-001 (P0): Recursive scan can fail on non-skill graph metadata and leave SQLite graph empty or stale.
- F-005 (P1): Advisor runtime can use JSON fallback, masking SQLite migration failures.

### Security

- F-003 (P1): Query responses leak nested internal paths and hashes.
- F-007 (P1): Arbitrary workspace scan root can destructively wipe the graph.

### Traceability

- F-002 (P1): Bootstrap topology requirements are not implemented.
- F-004 (P1): Packet docs and metadata are not synchronized with implementation state.

### Maintainability

- F-006 (P2): Validation constants are duplicated.
- F-008 (P2): Status health semantics under-report advisory drift.

## 6. Adversarial Self-Check For P0

P0 candidate: F-001.

Why it is not merely hypothetical:

- The current repo contains 22 `graph-metadata.json` files under `.opencode/skill`, including one fixture under `system-spec-kit/scripts/test-fixtures`.
- The fixture is a spec-packet metadata shape with `packet_id`, `spec_folder`, `manual`, and `derived`, not a skill metadata shape with `skill_id`.
- The new TypeScript indexer recursively discovers every matching filename under the skill root, unlike the legacy compiler which scans top-level skill folders and explicitly adds nested skill-advisor metadata.
- The parser requires `skill_id` and throws before the transaction begins.
- Startup calls the same indexer and catches failures as non-fatal, which means the MCP server can run without a populated skill graph.

Counterargument considered:

The watcher uses a top-level glob (`.opencode/skill/*/graph-metadata.json`) and would not see the fixture. That does not mitigate startup or manual `skill_graph_scan`, which call the recursive indexer.

Conclusion:

F-001 is a real release blocker because the default indexing path is incompatible with the current repository tree.

## 7. Remediation Order

1. Fix F-001 by aligning discovery with the legacy skill surface: top-level skills plus explicit nested skill-advisor metadata, or by schema-discriminating non-skill metadata before parse.
2. Add a regression test that runs the real default skill root shape, including a non-skill nested `graph-metadata.json`, without writing to the production database.
3. Decide the advisor fallback policy for F-005. If JSON fallback remains, make it explicit degraded mode and ensure health cannot report the migration as healthy.
4. Add the missing session bootstrap skill graph summary for F-002.
5. Sanitize all nested query response shapes for F-003.
6. Guard destructive custom-root scans for F-007.
7. Reconcile packet docs, tasks, checklist, `implementation-summary.md`, and metadata for F-004.
8. Clean up F-006 and F-008 as follow-up maintainability work.

## 8. Verification Suggestions

- Add a fixture that mirrors the current repo: 20 top-level skills, nested `system-spec-kit/mcp_server/skill-advisor/graph-metadata.json`, and a nested non-skill `scripts/test-fixtures/**/graph-metadata.json`.
- Run `skill_graph_scan` in a disposable `SPEC_KIT_DB_DIR` and assert the scan indexes only skill metadata.
- Assert `skill_graph_status` reports the expected node count, edge count, families, staleness, and warnings.
- Assert all `skill_graph_query` response shapes omit `sourcePath` and `contentHash` recursively.
- Assert `session_bootstrap` includes a skill graph section with family distribution, hub skills, edge count, and staleness.
- Assert `skill_advisor.py --health` reports `skill_graph_source: sqlite` for healthy runtime and degraded status for fallback.
- Re-run the 44-case advisor regression suite after F-001 and F-005.

## 9. Appendix

### Iteration List

| Iteration | Dimension | New Findings | Ratio | Churn |
| --- | --- | --- | --- | --- |
| 001 | correctness | F-001 | 1.00 | 1.00 |
| 002 | security | F-003 | 0.62 | 0.62 |
| 003 | traceability | F-002 | 0.50 | 0.50 |
| 004 | maintainability | F-006 | 0.18 | 0.18 |
| 005 | correctness | F-005 | 0.34 | 0.34 |
| 006 | security | F-007 | 0.28 | 0.28 |
| 007 | traceability | F-004 | 0.24 | 0.24 |
| 008 | maintainability | F-008 | 0.11 | 0.11 |
| 009 | correctness | none | 0.04 | 0.04 |
| 010 | security | none | 0.03 | 0.03 |

### Delta Files

- `review/deltas/iter-001.jsonl`
- `review/deltas/iter-002.jsonl`
- `review/deltas/iter-003.jsonl`
- `review/deltas/iter-004.jsonl`
- `review/deltas/iter-005.jsonl`
- `review/deltas/iter-006.jsonl`
- `review/deltas/iter-007.jsonl`
- `review/deltas/iter-008.jsonl`
- `review/deltas/iter-009.jsonl`
- `review/deltas/iter-010.jsonl`
