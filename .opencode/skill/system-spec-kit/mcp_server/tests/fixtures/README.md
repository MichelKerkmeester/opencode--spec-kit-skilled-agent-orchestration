---
title: "Test Fixtures"
description: "Shared runtime JSON and TypeScript fixtures for MCP server tests."
trigger_phrases:
  - "test fixtures"
  - "runtime fixtures"
---

# Test Fixtures

## 1. PURPOSE

`tests/fixtures/` holds reusable, deterministic test data for MCP server runtime and regression suites. Fixtures should describe test scenarios, not production architecture.

## 2. TREE AND KEY FILES

```text
fixtures/
+-- hooks/                    # Hook transcript replay inputs
+-- runtime-fixtures.ts        # Runtime capability fixtures
+-- sample-memories.json       # Representative memory records
+-- similarity-test-cases.json # Similarity and ranking cases
`-- contradiction-pairs.json   # Contradiction-detection pairs
```

- `runtime-fixtures.ts` - runtime capability fixtures for hook-detection tests.
- `sample-memories.json` - representative memory records.
- `similarity-test-cases.json` - similarity and ranking scenarios.
- `contradiction-pairs.json` - contradiction-detection fixture data.
- `hooks/` - transcript fixtures used by hook replay tests.

## 3. BOUNDARIES

- Keep fixture data small, explicit, and stable across machines.
- Do not store generated databases, temporary files, or CI outputs here.
- Prefer suite-local setup when data is only useful to one test file.

## 4. VALIDATION

Run the suite that consumes the changed fixture from `mcp_server`, or run the full test set when the fixture has broad use:

```bash
npx vitest run tests/<suite>.vitest.ts
npx vitest run
```

## 5. RELATED

- `../README.md`
- `./hooks/README.md`
