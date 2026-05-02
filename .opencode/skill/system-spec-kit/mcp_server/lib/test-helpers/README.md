---
title: "Test Helpers: Shared Test Utilities"
description: "Small utilities shared by MCP server tests."
trigger_phrases:
  - "test helpers"
  - "env snapshot"
---

# Test Helpers: Shared Test Utilities

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. USAGE NOTES](#3--usage-notes)
- [4. RELATED RESOURCES](#4--related-resources)

## 1. OVERVIEW

`lib/test-helpers/` contains small helpers used by MCP server tests. These modules are test support only and should not become product runtime dependencies.

Current state:

- Provides an environment snapshot helper for tests that mutate `process.env`.
- Keeps cleanup behavior reusable across test files.

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `env-snapshot.ts` | Captures selected environment variables and returns a restore function. |

## 3. USAGE NOTES

- Use `snapshotEnv()` in test setup before changing environment variables.
- Call the returned restore function in teardown, including failure paths.
- Keep helpers generic. Test-specific fixtures should stay near the tests that use them.

## 4. RELATED RESOURCES

- [`../`](../)
- [`../../tests/`](../../tests/)
