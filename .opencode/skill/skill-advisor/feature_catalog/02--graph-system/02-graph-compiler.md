---
title: "Graph compiler"
description: "Describes the discovery, validation, warning, and compile pipeline that produces the runtime skill graph."
---

# Graph compiler

## 1. OVERVIEW

Describes the discovery, validation, warning, and compile pipeline that produces the runtime skill graph.

The graph compiler is the build-time bridge between many per-skill metadata files and the single runtime artifact the advisor can load instantly. It owns discovery, validation, warning surfacing, and final JSON emission.

---

## 2. CURRENT REALITY

The compiler starts with `discover_graph_metadata()`, which scans sibling skill folders for `graph-metadata.json`, skips folders that do not publish metadata, and parses every discovered file into `(folder, path, data)` tuples. The main CLI then cross-validates the full discovered set by building the known skill ID list, running per-file schema validation, detecting two-node dependency cycles, and printing error blocks before exiting with status `2` when anything is invalid.

Soft validation runs alongside the hard checks. `validate_edge_symmetry()` warns when `depends_on` and `prerequisite_for` or `siblings` links are not mirrored, while `validate_zero_edge_skills()` flags orphan skills with no edges at all. When validation passes and `--validate-only` is not set, `compile_graph()` produces the aggregated graph and writes `skill-graph.json`, warning again if the output grows beyond the 4 KB target.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_graph_compiler.py` | Build | Discovers per-skill metadata files and drives the end-to-end compile CLI. |
| `skill_graph_compiler.py` | Build | Runs hard validation, soft warning passes, graph compilation, and output writing. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_graph_compiler.py` | Validation CLI | Exposes `--validate-only`, `--pretty`, and custom output handling for compiler checks. |
| `skill-graph.json` | Compiled artifact | Captures the latest successful compiler output consumed by the advisor runtime. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/02-graph-compiler.md`
