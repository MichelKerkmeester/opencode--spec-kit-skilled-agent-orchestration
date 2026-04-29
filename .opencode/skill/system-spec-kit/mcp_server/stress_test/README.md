---
title: "MCP Server Stress Tests"
description: "Dedicated Vitest stress, load, matrix-cell, and performance validation suite for the MCP server."
trigger_phrases:
  - "stress test"
  - "mcp_server/stress_test"
  - "dedicated stress folder"
---

# MCP Server Stress Tests

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. ADDING STRESS TESTS](#3-adding-stress-tests)
- [4. BOUNDARY WITH TESTS](#4-boundary-with-tests)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `stress_test/` directory holds MCP server stress coverage that is intentionally separate from the default `tests/` suite. Use it for load-style checks, high-volume write/read behavior, matrix-cell remediations, degraded-state sweeps, and performance or capacity validation that operators may want to run explicitly.

Current stress suites:

- `session-manager-stress.vitest.ts` - interleaved working-memory entry-limit and cleanup stress regressions.
- `code-graph-degraded-sweep.vitest.ts` - packet-013 degraded code-graph stress cell that exercises end-to-end fallback decisions against isolated graph states.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
cd .opencode/skill/system-spec-kit/mcp_server

# Dedicated stress suite
npm run stress

# Single stress file
SPECKIT_RUN_STRESS=true npx vitest run mcp_server/stress_test/session-manager-stress.vitest.ts

# Direct Vitest folder run
SPECKIT_RUN_STRESS=true npx vitest run mcp_server/stress_test
```

`SPECKIT_RUN_STRESS=true` enables `mcp_server/stress_test/**/*.{vitest,test}.ts` in `vitest.config.ts`. Default `npm test` remains scoped to the fast unit, integration, handler, and regression suites under `mcp_server/tests/`.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:adding-stress-tests -->
## 3. ADDING STRESS TESTS

Add a test here when it intentionally stresses capacity, concurrency, degraded-state envelopes, large matrices, high-volume fixtures, or runtime performance. Keep each suite self-contained: use temp directories or in-memory databases, avoid mutating live DB files, and document any expected runtime cost near the top of the file.

If a regression is small, deterministic, and part of normal unit or integration coverage, keep it in `mcp_server/tests/` instead.
<!-- /ANCHOR:adding-stress-tests -->

---

<!-- ANCHOR:boundary-with-tests -->
## 4. BOUNDARY WITH TESTS

| Directory | Purpose | Default Command |
|-----------|---------|-----------------|
| `mcp_server/tests/` | Unit, integration, handler, regression, fixture, and public API coverage expected in normal verification. | `npm test` |
| `mcp_server/stress_test/` | Explicit stress, load, capacity, matrix-cell, degraded-state sweep, and performance validation. | `npm run stress` |
<!-- /ANCHOR:boundary-with-tests -->
