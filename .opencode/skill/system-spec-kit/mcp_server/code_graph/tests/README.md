---
title: "Code Graph Tests: Structural Index Coverage"
description: "Vitest coverage for code graph indexing, readiness, query, context, and change-detection behavior."
trigger_phrases:
  - "code graph tests"
  - "structural index tests"
  - "detect changes tests"
---

# Code Graph Tests: Structural Index Coverage

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY TEST AREAS](#3--key-test-areas)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`mcp_server/code_graph/tests/` contains Vitest coverage for the code graph package. The suite checks structural indexing, SQLite persistence behavior, readiness gates, query and context handlers, seed resolution, verification, and diff-to-symbol attribution.

Current state:

- Most tests build temporary workspaces and isolate database state between cases.
- Handler tests mock readiness and database calls where safety contracts matter.
- `assets/code-graph-gold-queries.json` stores the gold-query battery fixture used by verification coverage.

## 2. PACKAGE TOPOLOGY

```text
tests/
+-- assets/                              # Static fixtures for verification tests
+-- code-graph-*.vitest.ts               # Indexer, DB, query, context, readiness coverage
+-- detect-changes.test.ts               # Diff parser and affected-symbol safety coverage
+-- edge-*.test.ts                       # Edge drift and metadata sanitization coverage
`-- phase-runner.test.ts                 # Phase dependency ordering and failure coverage
```

Primary dependency direction:

```text
tests -> ../lib
tests -> ../handlers
tests -> assets
```

## 3. KEY TEST AREAS

| Area | Representative Files | Coverage |
|---|---|---|
| Indexing and persistence | `code-graph-indexer.vitest.ts`, `code-graph-atomic-persistence.vitest.ts` | Symbol IDs, content hashes, stale detection, node and edge writes. |
| Scope policy and doc-language | `code-graph-indexer.vitest.ts`, `code-graph-scan.vitest.ts`, `code-graph-doc-language.test-d.ts` | 5-folder default excludes, env+per-call precedence, granular `sk-*` list selection, the 24-cell folder × file-type matrix that proves opted-in `.opencode/` folders persist `language='doc'` rows, and the type-level `SupportedLanguage` guard. |
| Readiness and scope fingerprint | `code-graph-scope-readiness.vitest.ts`, `code-graph-siblings-readiness.vitest.ts` | Freshness gates, workspace scope decisions and v2 scope-fingerprint round-trip. |
| Schema validation | `../tests/tool-input-schema.vitest.ts` | Accept and reject paths for `code_graph_scan` per-call args including `includeSkills` boolean, `sk-*` regex list, undefined defaults. |
| Query and context handlers | `code-graph-query-handler.vitest.ts`, `code-graph-context-handler.vitest.ts` | MCP handler output contracts and graph context shaping. |
| Seed and subject resolution | `code-graph-seed-resolver.vitest.ts`, `code-graph-resolve-subject-typed.vitest.ts` | File, symbol, and external seed mapping. |
| Change detection | `detect-changes.test.ts` | Blocked responses on stale or failed readiness and line-range overlap attribution. |
| Phase execution | `phase-runner.test.ts` | Topological ordering, duplicate output rejection, missing dependencies, and cycle errors. |

## 4. BOUNDARIES

Tests may create temporary workspaces and mock code graph internals. They should not depend on the developer's live code graph database or mutate repository source fixtures outside this directory.

## 5. VALIDATION

Run code graph tests from the repository root:

```bash
npm test -- --run code-graph
```

For focused change-detection coverage:

```bash
npm test -- --run detect-changes
```

## 6. RELATED

- `../lib/`
- `../handlers/`
- `assets/code-graph-gold-queries.json`
