---
title: "Session Stress Tests: Resume And Manager Performance"
description: "Stress and benchmark tests for session resume performance and session manager behavior."
trigger_phrases:
  - "session stress tests"
  - "session resume benchmark"
  - "session manager stress"
---

# Session Stress Tests: Resume And Manager Performance

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

`stress_test/session/` contains stress coverage for session resume and session manager behavior. It focuses on performance and stability under heavier session-state scenarios.

Current state:

- Benchmarks session resume behavior.
- Stresses session manager state handling.
- Keeps session stress tests separate from memory and search-quality stress suites.

---

## 2. DIRECTORY TREE

```text
session/
+-- gate-d-benchmark-session-resume.vitest.ts   # Session resume benchmark
+-- gate-d-resume-perf.vitest.ts                # Resume performance coverage
+-- session-manager-stress.vitest.ts            # Session manager stress coverage
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `gate-d-benchmark-session-resume.vitest.ts` | Benchmarks session resume behavior. |
| `gate-d-resume-perf.vitest.ts` | Tests resume performance characteristics. |
| `session-manager-stress.vitest.ts` | Stresses session manager state behavior. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress tests may import session manager and resume helpers. |
| Exports | This folder exports no runtime code. |
| Ownership | Put session performance stress here. Put memory trigger benchmarks in `../memory/`. |

Main flow:

```text
session stress fixture
  -> resume or session manager path
  -> timing, state or result payload
  -> stress assertion
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `gate-d-benchmark-session-resume.vitest.ts` | Test file | Session resume benchmark. |
| `gate-d-resume-perf.vitest.ts` | Test file | Resume performance coverage. |
| `session-manager-stress.vitest.ts` | Test file | Session manager stress coverage. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/stress_test/session/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../memory/README.md`](../memory/README.md)
- [`../search-quality/README.md`](../search-quality/README.md)
