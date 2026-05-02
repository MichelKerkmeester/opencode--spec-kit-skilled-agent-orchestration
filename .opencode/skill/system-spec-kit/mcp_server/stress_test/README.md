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

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`stress_test/` holds MCP server checks that are intentionally outside the default `tests/` suite. Use it for load checks, high-volume read and write behavior, matrix-cell remediation, degraded-state sweeps, and performance or capacity validation that operators run by choice.

Current state:

- `vitest.stress.config.ts` includes only `mcp_server/stress_test/**/*.{vitest,test}.ts`.
- Default `npm test` uses `vitest.config.ts`, which excludes `mcp_server/stress_test/**`.
- Stress suites should use temp directories or in-memory databases and must not mutate live DB files.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    MCP SERVER STRESS TESTS                       │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌──────────────────┐
│ Operator       │ ───▶ │ npm run stress     │ ───▶ │ vitest stress    │
│ or CI slice    │      │ stress:* scripts   │      │ config           │
└───────┬────────┘      └─────────┬──────────┘      └────────┬─────────┘
        │                         │                          │
        │                         ▼                          ▼
        │              ┌────────────────────┐       ┌──────────────────┐
        └──────────▶   │ Domain suites      │ ───▶  │ Temp fixtures    │
                       │ search, memory,    │       │ isolated DB and  │
                       │ graph, session     │       │ metrics output   │
                       └─────────┬──────────┘       └──────────────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ Cost notes and     │
                       │ benchmark signals  │
                       └────────────────────┘

Execution boundary: default tests do not import or run stress suites.
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
mcp_server/stress_test/
├── search-quality/                 # W3-W13 search-quality test grid, corpus, metrics, baseline
├── memory/                         # Memory search and trigger latency or throughput
├── skill-advisor/                  # Skill graph rebuild concurrency stress
├── code-graph/                     # Degraded readiness and large-input sweeps
├── session/                        # Session entry-limit and resume benchmarks
├── matrix/                         # Synthetic search routing and latency comparison
├── vitest.stress.config.ts         # Stress-only Vitest config
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `vitest.stress.config.ts` | Limits Vitest discovery to stress suites. |
| `search-quality/` | Runs search-quality test-grid cells, corpus checks, metrics, and baseline comparisons. |
| `memory/` | Measures memory search and trigger pathway behavior under load. |
| `code-graph/` | Exercises degraded graph readiness and large input caps. |
| `session/` | Measures session limits and resume latency. |
| `matrix/` | Runs synthetic matrix routing and latency comparisons. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Default verification | Keep small deterministic regressions in `mcp_server/tests/`, not here. |
| Data safety | Use temp directories, in-memory databases, or generated fixtures. |
| Runtime cost | Note expected cost near the top of long-running suites. |
| Ownership | Add suites here only for capacity, concurrency, degraded-state, matrix, or benchmark coverage. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Operator chooses explicit stress command │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Vitest loads vitest.stress.config.ts     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Matching stress suites run in isolation  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Metrics, timing, or regression signals   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Operator reviews stress-only result      │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `npm run stress` | npm script | Runs the full stress suite from `mcp_server/`. |
| `npm run stress:harness` | npm script | Runs the search-quality test-grid slice. |
| `npm run stress:matrix` | npm script | Runs the matrix stress slice. |
| `vitest.stress.config.ts` | Vitest config | Defines the stress-only test discovery boundary. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server` unless noted.

```bash
npm run stress
npm run stress:harness
npm run stress:matrix
npx vitest run --config vitest.stress.config.ts stress_test/session/session-manager-stress.vitest.ts
```

Expected result: the selected stress slice exits with Vitest success or a clear benchmark failure.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../tests/README.md`](../tests/README.md)
- [`../matrix_runners/README.md`](../matrix_runners/README.md)
- [`../README.md`](../README.md)

<!-- /ANCHOR:related -->
