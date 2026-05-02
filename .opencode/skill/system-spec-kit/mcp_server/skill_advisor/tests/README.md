---
title: "Skill Advisor Tests: Regression And Contract Coverage"
description: "Vitest, Python and fixture coverage for skill-advisor routing, handlers, hooks, schemas, scorer paths and compatibility behavior."
trigger_phrases:
  - "skill advisor tests"
  - "advisor regression tests"
  - "skill advisor vitest"
---

# Skill Advisor Tests: Regression And Contract Coverage

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

`skill_advisor/tests/` is the regression surface for the skill-advisor package. It groups focused Vitest suites, compatibility checks, handler and hook tests, schema checks, Python parity tests and shared fixtures used by the advisor scorer and daemon paths.

Current state:

- Covers advisor routing, scorer, lane attribution, cache, daemon freshness and lifecycle metadata behavior.
- Keeps compatibility, parity and schema tests in named subfolders.
- Provides shared fixtures and helpers used across direct TypeScript and Python-facing advisor checks.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                      SKILL ADVISOR TESTS                         │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│ Test runner  │ ───▶ │ Vitest suites   │ ───▶ │ Advisor modules  │
│ npm / vitest │      │ tests/*.ts      │      │ lib / handlers   │
└──────┬───────┘      └───────┬────────┘      └────────┬─────────┘
       │                      │                        │
       │                      ▼                        ▼
       │              ┌───────────────┐        ┌────────────────┐
       └───────────▶  │ Fixtures      │ ───▶   │ Schemas        │
                      │ tests/fixtures│        │ schemas/*      │
                      └───────┬───────┘        └────────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Python parity │
                      └───────────────┘

Dependency direction: test suites -> fixtures -> advisor runtime modules
```

---

## 3. PACKAGE TOPOLOGY

```text
tests/
+-- __shared__/              # Shared test helpers
+-- cache/                   # Cache behavior coverage
+-- compat/                  # Compatibility contract checks
+-- fixtures/                # Prompt, graph and routing fixtures
+-- handlers/                # MCP handler tests
+-- hooks/                   # Hook integration tests
+-- legacy/                  # Legacy compatibility coverage
+-- parity/                  # Cross-runtime parity checks
+-- python/                  # Python wrapper and script tests
+-- schemas/                 # Schema validation tests
+-- scorer/                  # Native scorer tests
+-- *.vitest.ts              # Package-level regression suites
+-- *.test.ts                # Focused unit tests
`-- README.md
```

Allowed direction:

```text
tests -> fixtures
tests -> skill_advisor/lib
tests -> skill_advisor/handlers
```

Disallowed direction:

```text
runtime code -> tests
fixtures -> generated runtime state without an explicit test setup
```

---

## 4. DIRECTORY TREE

```text
tests/
+-- affordance-normalizer.test.ts
+-- lane-attribution.test.ts
+-- manual-testing-playbook.vitest.ts
+-- routing-fixtures.affordance.test.ts
+-- shadow-sink.vitest.ts
+-- skill-graph-db.vitest.ts
+-- daemon-freshness-foundation.vitest.ts
+-- lifecycle-derived-metadata.vitest.ts
+-- scorer/
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lane-attribution.test.ts` | Verifies prompt-safe lane attribution behavior. |
| `affordance-normalizer.test.ts` | Tests affordance normalization used by advisor routing. |
| `routing-fixtures.affordance.test.ts` | Connects fixture prompts to affordance expectations. |
| `shadow-sink.vitest.ts` | Covers shadow telemetry sink behavior. |
| `skill-graph-db.vitest.ts` | Checks skill-graph database behavior used by advisor tests. |
| `manual-testing-playbook.vitest.ts` | Verifies manual testing playbook routing fixtures. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Tests may import advisor runtime modules, schemas, fixtures and local shared helpers. |
| Exports | This folder exports no production runtime code. |
| Ownership | Keep advisor package tests here. Put code-graph, memory or deep-loop tests in their own package folders. |

Main flow:

```text
fixture or inline scenario
  -> advisor scorer, handler, hook or schema path
  -> prompt-safe result, metadata or validation output
  -> assertion on stable advisor behavior
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `*.vitest.ts` | Test files | Vitest regression suites for daemon, lifecycle, shadow and database behavior. |
| `*.test.ts` | Test files | Focused unit tests for affordance and attribution helpers. |
| `fixtures/` | Test data | Shared prompt and routing inputs. |
| `scorer/` | Test folder | Native scorer regression coverage. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/README.md
```

Expected result: exit code `0`.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`scorer/README.md`](scorer/README.md)
