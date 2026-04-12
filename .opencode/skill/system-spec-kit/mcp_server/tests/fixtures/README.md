---
title: "Test Fixtures"
description: "Shared runtime JSON and TypeScript fixtures for MCP server tests."
trigger_phrases:
  - "test fixtures"
  - "runtime fixtures"
---

# Test Fixtures

## 1. OVERVIEW

`tests/fixtures/` holds reusable test data for runtime and regression suites.

- `runtime-fixtures.ts` - runtime capability fixtures for hook-detection tests.
- `sample-memories.json` - representative memory records.
- `similarity-test-cases.json` - similarity and ranking scenarios.
- `contradiction-pairs.json` - contradiction-detection fixture data.

Subdirectories:

- `hooks/` - transcript fixtures used by hook replay tests.

## 2. RELATED

- `../README.md`
- `../../test/hooks/README.md`
