---
title: "MCP Server Tests: Vitest Coverage"
description: "Vitest unit, integration, handler, eval, governance, and regression coverage for the MCP server."
trigger_phrases:
  - "test suite"
  - "vitest"
  - "regression tests"
---

# MCP Server Tests: Vitest Coverage

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
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

`tests/` is the default Vitest coverage surface for the MCP server. It covers unit logic, integration paths, MCP handler contracts, retrieval behavior, governance, eval metrics, startup checks, and regression cases.

Current responsibilities:

- Verify cognitive retrieval behavior such as attention decay, tiering, co-activation, and session learning.
- Verify search, ranking, graph, routing, response envelopes, and public API surfaces.
- Verify save, index, checkpoint, governance, lineage, hook, and startup regressions.
- Keep stress and load validation separate in sibling `../stress_test/`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
tests/
+-- *.vitest.ts          # Unit, integration, handler, eval, and regression suites
+-- fixtures/            # Sample documents and data for targeted tests
+-- continuity/          # Continuity-focused nested suites
`-- README.md
```

Allowed dependency direction:

```text
tests ───▶ mcp_server source modules
tests ───▶ fixtures
```

Disallowed dependency direction:

```text
mcp_server source modules ───▶ tests
tests ───▶ shared temp state without explicit setup and cleanup
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
tests/
+-- api-public-surfaces.vitest.ts          # Public export contract coverage
+-- feature-flag-reference-docs.vitest.ts  # Docs and config parity checks
+-- governance-e2e.vitest.ts               # Governed scope integration coverage
+-- handler-memory-search.vitest.ts        # MCP handler search contract coverage
+-- hybrid-search.vitest.ts                # Retrieval ranking coverage
+-- memory-save-integration.vitest.ts      # Save pipeline integration coverage
+-- scope-governance-normalizer-parity.vitest.ts
+-- fixtures/                              # Shared test fixtures
+-- continuity/                            # Continuity-specific suites
`-- README.md
```

Use `rg --files tests -g '*.vitest.ts'` for the full live inventory.

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| Area | Representative Files | Responsibility |
|---|---|---|
| Cognitive and memory state | `attention-decay.vitest.ts`, `working-memory.vitest.ts`, `tier-classifier.vitest.ts` | Retrieval state, scoring, and tier behavior. |
| Search and routing | `hybrid-search.vitest.ts`, `query-plan-emission.vitest.ts`, `intent-routing.vitest.ts` | Query planning, ranking, fusion, and routing behavior. |
| Handler and protocol surface | `handler-memory-search.vitest.ts`, `mcp-tool-dispatch.vitest.ts`, `mcp-error-format.vitest.ts` | MCP dispatch and response contracts. |
| Save and index regressions | `memory-save-integration.vitest.ts`, `handler-memory-index.vitest.ts`, `content-router-cache.vitest.ts` | Save, scan, cache, and indexing behavior. |
| Governance and scope | `governance-e2e.vitest.ts`, `memory-governance.vitest.ts`, `scope-governance-normalizer-parity.vitest.ts` | Scope enforcement and governed lifecycle behavior. |
| Public API and docs parity | `api-public-surfaces.vitest.ts`, `feature-flag-reference-docs.vitest.ts` | Export and documentation alignment. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Test ownership | `tests/` verifies MCP server behavior. It does not own production code paths. |
| Fixtures | Fixture data belongs in `fixtures/` or suite-local setup. |
| Environment | Tests that change database paths, temp folders, or feature flags must isolate state. |
| Stress runs | Large stress and load checks belong in `../stress_test/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Developer or CI command                  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ npx vitest run [suite or pattern]        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Suite setup creates isolated state       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Source module or handler is exercised    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Pass, fail, or focused regression signal │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `npx vitest run` | CLI | Runs the full MCP server test suite. |
| `npx vitest run tests/<file>.vitest.ts` | CLI | Runs one focused suite. |
| `rg --files tests -g '*.vitest.ts'` | CLI | Lists the current Vitest inventory. |
| `fixtures/` | Directory | Shared fixture inputs for targeted suites. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server`.

```bash
npx vitest run
```

Focused examples:

```bash
npx vitest run tests/api-public-surfaces.vitest.ts tests/feature-flag-reference-docs.vitest.ts
npx vitest run tests/governance-e2e.vitest.ts tests/memory-governance.vitest.ts
npx vitest run tests/handler-memory-search.vitest.ts tests/hybrid-search.vitest.ts
```

Expected result: selected suites pass with isolated database and temp state.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../api/README.md`](../api/README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../stress_test/README.md`](../stress_test/README.md)

<!-- /ANCHOR:related -->
