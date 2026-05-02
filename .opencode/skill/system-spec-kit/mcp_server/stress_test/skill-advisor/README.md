---
title: "Skill Advisor Stress Tests: Routing And Daemon Pressure"
description: "Stress suites for skill-advisor handlers, scorer fusion, daemon lifecycle, generation cache, hooks parity and compatibility paths."
trigger_phrases:
  - "skill advisor stress tests"
  - "advisor daemon stress"
  - "scorer fusion stress"
---

# Skill Advisor Stress Tests: Routing And Daemon Pressure

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

---

## 1. OVERVIEW

`stress_test/skill-advisor/` contains pressure tests for the skill-advisor package. The suites cover recommendation handlers, scorer fusion, daemon lifecycle, derived metadata sync, generation cache invalidation, hooks parity, compatibility, Python runners and MCP diagnostics.

Current state:

- Exercises advisor handler and scorer paths under stress.
- Covers daemon lifecycle, single-writer lease and file-watcher behavior.
- Tests generation cache invalidation, projection, trust state and Python compatibility paths.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                   SKILL ADVISOR STRESS TESTS                    │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│ Vitest suite │ ───▶ │ Advisor package │ ───▶ │ Scorer / daemon  │
│ stress files │      │ handlers / lib  │      │ generation paths │
└──────┬───────┘      └───────┬────────┘      └────────┬─────────┘
       │                      │                        │
       │                      ▼                        ▼
       │              ┌───────────────┐        ┌────────────────┐
       └───────────▶  │ Compatibility │ ───▶   │ Diagnostics    │
                      │ python/hooks  │        │ stress output  │
                      └───────────────┘        └────────────────┘

Dependency direction: stress tests -> skill_advisor handlers/lib -> diagnostics
```

---

## 3. PACKAGE TOPOLOGY

```text
skill-advisor/
+-- advisor-recommend-handler-stress.vitest.ts
+-- daemon-lifecycle-stress.vitest.ts
+-- five-lane-fusion-stress.vitest.ts
+-- generation-cache-invalidation-stress.vitest.ts
+-- hooks-parity-stress.vitest.ts
+-- lifecycle-routing-stress.vitest.ts
+-- mcp-diagnostics-stress.vitest.ts
+-- python-compat-stress.vitest.ts
+-- scorer-fusion-stress.vitest.ts
+-- single-writer-lease-stress.vitest.ts
+-- skill-graph-rebuild-concurrency.vitest.ts
+-- trust-state-stress.vitest.ts
`-- README.md
```

Allowed direction:

```text
stress suites -> skill_advisor/handlers
stress suites -> skill_advisor/lib
stress suites -> script and compatibility paths under test
```

---

## 4. DIRECTORY TREE

```text
skill-advisor/
+-- anti-stuffing-cardinality-stress.vitest.ts
+-- auto-indexing-derived-sync-stress.vitest.ts
+-- chokidar-narrow-scope-stress.vitest.ts
+-- df-idf-corpus-stress.vitest.ts
+-- lifecycle-routing-stress.vitest.ts
+-- opencode-plugin-bridge-stress.vitest.ts
+-- python-bench-runner-stress.vitest.ts
+-- scorer-extras-stress.vitest.ts
+-- skill-projection-stress.vitest.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-recommend-handler-stress.vitest.ts` | Stresses recommendation handler behavior. |
| `five-lane-fusion-stress.vitest.ts` | Stresses multi-lane fusion behavior. |
| `daemon-lifecycle-stress.vitest.ts` | Stresses daemon lifecycle behavior. |
| `generation-cache-invalidation-stress.vitest.ts` | Stresses generation cache invalidation. |
| `single-writer-lease-stress.vitest.ts` | Stresses lease behavior. |
| `trust-state-stress.vitest.ts` | Stresses trust-state behavior. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Stress tests may import advisor handlers, library modules, scripts and fixtures needed for pressure scenarios. |
| Exports | This folder exports no runtime code. |
| Ownership | Put advisor pressure and integration stress here. Put ordinary advisor unit tests in `../../skill_advisor/tests/`. |

Main flow:

```text
stress scenario
  -> advisor handler, scorer, daemon or compatibility path
  -> recommendation, diagnostic or lifecycle result
  -> assertion on safety and stability
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-recommend-handler-stress.vitest.ts` | Test file | Recommendation handler stress coverage. |
| `scorer-fusion-stress.vitest.ts` | Test file | Scorer fusion stress coverage. |
| `daemon-lifecycle-stress.vitest.ts` | Test file | Daemon lifecycle stress coverage. |
| `mcp-diagnostics-stress.vitest.ts` | Test file | MCP diagnostics stress coverage. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/README.md
```

Expected result: exit code `0`.

---

## 9. RELATED

- [`../search-quality/README.md`](../search-quality/README.md)
- [`../../skill_advisor/tests/README.md`](../../skill_advisor/tests/README.md)
- [`../../skill_advisor/lib/README.md`](../../skill_advisor/lib/README.md)
