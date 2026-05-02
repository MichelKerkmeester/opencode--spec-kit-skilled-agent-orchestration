---
title: "Skill Advisor Scripts: CLI And Regression Utilities"
description: "Python, shell and compiled graph utilities for skill-advisor routing, benchmarking, regression checks and skill-graph generation."
trigger_phrases:
  - "skill advisor scripts"
  - "skill advisor cli"
  - "skill graph compiler"
---

# Skill Advisor Scripts: CLI And Regression Utilities

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

`skill_advisor/scripts/` holds command-line utilities and generated assets used by the skill-advisor package. The scripts support prompt routing checks, benchmark runs, regression validation, runtime invocation and skill-graph compilation.

Current state:

- Provides the Python `skill_advisor.py` CLI used by fallback routing checks.
- Stores benchmark and regression scripts for advisor quality measurement.
- Includes skill-graph generation utilities and generated graph data.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- check-prompt-quality-card-sync.sh   # Quality-card sync check
+-- init-skill-graph.sh                 # Skill graph initialization helper
+-- skill_advisor.py                    # Main Python CLI wrapper
+-- skill_advisor_bench.py              # Benchmark runner
+-- skill_advisor_regression.py         # Regression runner
+-- skill_advisor_runtime.py            # Runtime support module
+-- skill_graph_compiler.py             # Skill graph compiler
+-- skill-graph.json                    # Generated graph data
+-- fixtures/                           # Script fixtures
+-- routing-accuracy/                   # Routing accuracy inputs or outputs
+-- out/                                # Generated script output
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `skill_advisor.py` | Main CLI used for prompt-to-skill routing checks. |
| `skill_advisor_runtime.py` | Runtime helpers shared by Python advisor scripts. |
| `skill_advisor_regression.py` | Runs regression scenarios for advisor recommendations. |
| `skill_advisor_bench.py` | Runs benchmark scenarios and reports timing or quality metrics. |
| `skill_graph_compiler.py` | Builds skill graph metadata used by advisor routing. |
| `check-prompt-quality-card-sync.sh` | Checks prompt quality-card sync state. |
| `skill-graph.json` | Generated graph input consumed by advisor tooling. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Python scripts may read advisor data, fixtures and generated graph metadata. |
| Exports | Scripts expose command-line behavior and generated artifacts, not MCP handlers. |
| Ownership | Keep skill-advisor CLI, benchmark and graph generation utilities here. Put runtime TypeScript code in `../lib/`. |

Main flow:

```text
prompt, fixture or skill graph source
  -> script CLI
  -> advisor runtime or graph compiler
  -> recommendation, metric report or generated graph data
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `skill_advisor.py` | Python CLI | Returns skill recommendations for prompt text. |
| `skill_advisor_regression.py` | Python CLI | Runs regression scenarios. |
| `skill_advisor_bench.py` | Python CLI | Runs benchmark scenarios. |
| `init-skill-graph.sh` | Shell script | Initializes generated skill graph data. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../tests/README.md`](../tests/README.md)
