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
- [3. STRUCTURE](#3-structure)
- [4. ADDING STRESS TESTS](#4-adding-stress-tests)
- [5. BOUNDARY WITH TESTS](#5-boundary-with-tests)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `stress_test/` directory holds MCP server stress coverage that is intentionally separate from the default `tests/` suite. Use it for load-style checks, high-volume write/read behavior, matrix-cell remediations, degraded-state sweeps, and performance or capacity validation that operators may want to run explicitly.

Current stress suites:

- `search-quality/` - full W3-W13 search-quality harness, corpus, metrics, baseline, telemetry export, and degraded-readiness cells.
- `memory/` - memory search and trigger fast-path latency/throughput benchmarks.
- `skill-advisor/` - skill graph rebuild concurrency stress coverage.
- `code-graph/` - degraded-readiness sweep and large-input/DoS-cap coverage.
- `session/` - session-manager entry-limit stress and Gate D resume benchmarks.
- `matrix/` - synthetic matrix and routing latency comparison coverage.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
cd .opencode/skill/system-spec-kit/mcp_server

# Dedicated stress suite
npm run stress

# Single stress file
npx vitest run --config vitest.stress.config.ts mcp_server/stress_test/session/session-manager-stress.vitest.ts

# Search-quality harness only
npm run stress:harness

# Matrix-only stress slice
npm run stress:matrix

# Direct Vitest folder run
npx vitest run --config vitest.stress.config.ts mcp_server/stress_test
```

`vitest.stress.config.ts` includes only `mcp_server/stress_test/**/*.{vitest,test}.ts`. Default `npm test` uses `vitest.config.ts`, which excludes `mcp_server/stress_test/**`.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

| Directory | Owns |
|-----------|------|
| `search-quality/` | Search-quality harness machinery, W3-W13 workstream cells, corpus, metrics, baseline, telemetry export. |
| `memory/` | Memory search and trigger fast-path benchmark suites. |
| `skill-advisor/` | Skill Advisor and skill graph concurrency stress suites. |
| `code-graph/` | Degraded graph fallback sweeps and large-input code-graph caps. |
| `session/` | Session-manager capacity and session-resume latency benchmarks. |
| `matrix/` | Matrix-style synthetic search routing and latency comparison suites. |
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:adding-stress-tests -->
## 4. ADDING STRESS TESTS

Add a test here when it intentionally stresses capacity, concurrency, degraded-state envelopes, large matrices, high-volume fixtures, or runtime performance. Keep each suite self-contained: use temp directories or in-memory databases, avoid mutating live DB files, and document any expected runtime cost near the top of the file.

If a regression is small, deterministic, and part of normal unit or integration coverage, keep it in `mcp_server/tests/` instead.
<!-- /ANCHOR:adding-stress-tests -->

---

<!-- ANCHOR:boundary-with-tests -->
## 5. BOUNDARY WITH TESTS

| Directory | Purpose | Default Command |
|-----------|---------|-----------------|
| `mcp_server/tests/` | Unit, integration, handler, regression, fixture, and public API coverage expected in normal verification. | `npm test` |
| `mcp_server/stress_test/` | Explicit stress, load, capacity, matrix-cell, degraded-state sweep, and performance validation. | `npm run stress` |
<!-- /ANCHOR:boundary-with-tests -->
