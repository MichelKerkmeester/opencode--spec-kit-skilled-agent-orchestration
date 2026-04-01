---
title: "254 -- Code graph scan and structural query"
description: "This scenario validates Code graph storage and query for 254. It focuses on Indexer produces nodes/edges, query returns results."
---

# 254 -- Code graph scan and structural query

## 1. OVERVIEW

This scenario validates Code graph storage and query.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the code graph SQLite storage (code-graph.sqlite) correctly indexes source files into `code_files`, `code_nodes`, and `code_edges` tables. The structural indexer must extract function declarations, class definitions, and import statements as nodes, and build call/import relationship edges. The 4 MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`) must return correct results. WAL mode and foreign keys must be enabled.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - SQLite3 available (bundled via better-sqlite3)
  - Test fixture files available for indexing
- **Prompt**: `Validate 254 Code graph storage and query behavior. Run the vitest suite for code-graph-indexer and confirm: (1) code_graph_scan indexes files and produces code_files, code_nodes, code_edges rows, (2) function/class/import nodes extracted with correct types, (3) call and import edges built between nodes, (4) code_graph_query returns outline/calls/imports results, (5) code_graph_status returns health metrics (file count, node count, edge count), (6) SQLite WAL mode and foreign keys enabled.`
- **Expected signals**:
  - All vitest tests in `code-graph-indexer.vitest.ts` pass
  - `code_graph_scan` populates `code_files` table with indexed file paths and hashes
  - `code_nodes` table contains entries with types: function, class, import (with fqName, file, line, column)
  - `code_edges` table contains directional relationships (source_id, target_id, edge_type: calls/imports)
  - `code_graph_query` for outline mode returns symbol list for a given file
  - `code_graph_query` for calls mode returns callers/callees of a symbol
  - `code_graph_query` for imports mode returns import relationships
  - `code_graph_status` returns counts (files indexed, nodes, edges)
  - Database uses WAL journal mode and has foreign keys enabled
- **Pass/fail criteria**:
  - PASS: All tables populated correctly, query tools return expected results, WAL mode confirmed
  - FAIL: Missing nodes/edges for known fixtures, query returns empty when data exists, or foreign key violations

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 254a | Code graph storage and query | Indexer extracts function/class/import nodes from source files | `Validate 254a node extraction` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | `code_nodes` contains function, class, import entries with fqName, file path, line numbers | Test output showing node types and counts | PASS if functions, classes, and imports all extracted from fixture files | Check structural indexer regex/parser for supported syntax patterns |
| 254b | Code graph storage and query | Edge builder produces call and import relationships | `Validate 254b edge building` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | `code_edges` contains directional edges with source_id, target_id, edge_type (calls, imports) | Test output showing edge counts and types | PASS if edges correctly connect caller to callee and importer to imported | Verify edge direction: source calls target, source imports target |
| 254c | Code graph storage and query | Query tools (outline, calls, imports, status) return correct results | `Validate 254c query tools` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | `code_graph_query` returns results for outline/calls/imports modes, `code_graph_status` returns file/node/edge counts | Test output showing query results | PASS if all 4 MCP tool operations return non-empty valid results | Check handler implementations in `handlers/code-graph/` |
| 254d | Code graph storage and query | Deleted files purged during incremental scan | `Validate 254d deleted-file purge during incremental scan` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-scan.vitest.ts` | Incremental scan removes deleted tracked files and purges their nodes/edges from `code_files`, `code_nodes`, and `code_edges` | Vitest output showing deleted file removal path and follow-up DB assertions | PASS if deleted file no longer appears in any graph table after incremental scan | Check `handlers/code-graph/scan.ts` delete path and `tests/code-graph-scan.vitest.ts` coverage for tracked-file removal |
| 254e | Code graph storage and query | Symlink boundary validation | `Validate 254e symlink boundary enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/unit-path-security.vitest.ts tests/code-graph-scan.vitest.ts` | `code_graph_scan` canonicalizes `rootDir`, rejects broken or escaping symlinks, and does not index files outside the project root | Vitest output showing symlink escape rejection and scan boundary enforcement | PASS if symlinked external files are NOT indexed and escaping paths are rejected | Check `handlers/code-graph/scan.ts` realpath-based boundary check and `tests/unit-path-security.vitest.ts` for escape scenarios |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/08-code-graph-storage-query.md](../../feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 254
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
