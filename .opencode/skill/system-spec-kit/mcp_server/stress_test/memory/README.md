---
title: "Memory Stress Tests: Gate D Benchmarks"
description: "Stress and benchmark tests for memory search, trigger fast paths and trigger performance."
trigger_phrases:
  - "memory stress tests"
  - "gate d benchmark"
  - "trigger performance"
---

# Memory Stress Tests: Gate D Benchmarks

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

`stress_test/memory/` contains Gate D benchmark stress coverage for memory search and trigger matching paths. These tests focus on performance-sensitive memory behavior rather than feature-level correctness alone.

Current state:

- Benchmarks memory search behavior.
- Benchmarks trigger fast-path behavior.
- Tracks trigger performance under stress conditions.

---

## 2. DIRECTORY TREE

```text
memory/
+-- gate-d-benchmark-memory-search.vitest.ts        # Memory search benchmark
+-- gate-d-benchmark-trigger-fast-path.vitest.ts    # Trigger fast-path benchmark
+-- gate-d-trigger-perf-benchmark.vitest.ts         # Trigger performance benchmark
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `gate-d-benchmark-memory-search.vitest.ts` | Benchmarks memory search behavior. |
| `gate-d-benchmark-trigger-fast-path.vitest.ts` | Benchmarks trigger fast-path behavior. |
| `gate-d-trigger-perf-benchmark.vitest.ts` | Benchmarks trigger matching performance. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress tests may import memory search and trigger modules with benchmark fixtures. |
| Exports | This folder exports no runtime code. |
| Ownership | Put memory performance stress cases here. Put ordinary memory unit tests near the memory package. |

Main flow:

```text
benchmark memory scenario
  -> search or trigger path
  -> timing and response result
  -> assertion on benchmark threshold or behavior
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `gate-d-benchmark-memory-search.vitest.ts` | Test file | Memory search benchmark. |
| `gate-d-benchmark-trigger-fast-path.vitest.ts` | Test file | Trigger fast-path benchmark. |
| `gate-d-trigger-perf-benchmark.vitest.ts` | Test file | Trigger performance benchmark. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/stress_test/memory/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../session/README.md`](../session/README.md)
- [`../search-quality/README.md`](../search-quality/README.md)
