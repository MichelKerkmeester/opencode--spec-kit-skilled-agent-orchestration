---
title: "Code Graph Stress Tests: Scanner And Context Pressure"
description: "Stress tests for code-graph scanning, context assembly, degraded behavior, change detection and diagnostics."
trigger_phrases:
  - "code graph stress tests"
  - "code graph context stress"
  - "detect changes stress"
---

# Code Graph Stress Tests: Scanner And Context Pressure

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`stress_test/code-graph/` contains Vitest stress coverage for code-graph scanning, context generation, degraded-mode behavior, change detection, diagnostics and denial-of-service caps. These tests exercise pressure paths that are broader than normal unit tests.

Current state:

- Covers code-graph scan, context and degraded sweep behavior.
- Includes stress cases for change detection preflight and manual diagnostics.
- Tests resource caps around walker behavior and integration pressure paths.

---

## 2. DIRECTORY TREE

```text
code-graph/
+-- budget-allocator-stress.vitest.ts
+-- ccc-integration-stress.vitest.ts
+-- code-graph-context-stress.vitest.ts
+-- code-graph-degraded-sweep.vitest.ts
+-- code-graph-scan-stress.vitest.ts
+-- context-handler-normalization-stress.vitest.ts
+-- deep-loop-crud-stress.vitest.ts
+-- deep-loop-graph-convergence-stress.vitest.ts
+-- detect-changes-preflight-stress.vitest.ts
+-- doctor-apply-mode-stress.vitest.ts
+-- manual-diagnostics-stress.vitest.ts
+-- walker-dos-caps.vitest.ts
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `code-graph-scan-stress.vitest.ts` | Stresses scan behavior. |
| `code-graph-context-stress.vitest.ts` | Stresses context assembly. |
| `code-graph-degraded-sweep.vitest.ts` | Stresses degraded-mode sweep behavior. |
| `detect-changes-preflight-stress.vitest.ts` | Stresses diff-to-symbol preflight behavior. |
| `manual-diagnostics-stress.vitest.ts` | Stresses manual diagnostics output. |
| `walker-dos-caps.vitest.ts` | Verifies traversal cap behavior under pressure. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress tests may import code-graph, context and diagnostic modules needed for pressure scenarios. |
| Exports | This folder exports no runtime code. |
| Ownership | Keep code-graph stress cases here. Put ordinary unit tests in the package test folders. |

Main flow:

```text
large or adversarial fixture
  -> code-graph scan, context or diagnostic path
  -> capped output, degraded response or stress result
  -> assertion on safety and behavior
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `code-graph-scan-stress.vitest.ts` | Test file | Scan stress coverage. |
| `code-graph-context-stress.vitest.ts` | Test file | Context stress coverage. |
| `detect-changes-preflight-stress.vitest.ts` | Test file | Change detection stress coverage. |
| `walker-dos-caps.vitest.ts` | Test file | Traversal cap coverage. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../code_graph/tests/README.md`](../../code_graph/tests/README.md)
