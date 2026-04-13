---
title: "Graph metadata schema"
description: "Describes the per-skill metadata contract that feeds the compiled routing graph."
---

# Graph metadata schema

## 1. OVERVIEW

Describes the per-skill metadata contract that feeds the compiled routing graph.

The runtime graph is only as trustworthy as the metadata that feeds it. This feature defines the validation contract every `graph-metadata.json` file must satisfy before the compiler will allow it into the aggregated graph.

---

## 2. CURRENT REALITY

`validate_skill_metadata()` enforces a strict schema. Each metadata file must declare `schema_version: 1`, a `skill_id` that exactly matches the folder name, a `family` from the allowed set (`cli`, `mcp`, `sk-code`, `sk-deep`, `sk-util`, `system`), and a `category` from the allowed category list. `domains` and `intent_signals` must both be arrays, which means the schema validates capability identity as well as graph edges.

The `edges` object is validated field by field. Supported edge groups are `depends_on`, `enhances`, `siblings`, `conflicts_with`, and `prerequisite_for`. Every edge must be an object with a known target, a numeric weight inside `[0.0, 1.0]`, and a `context` field. Self-references, unknown targets, invalid edge types, or malformed arrays all become hard validation errors.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_graph_compiler.py` | Build | Defines the allowed families, categories, edge types, and schema version for per-skill metadata. |
| `skill_graph_compiler.py` | Build | Validates every metadata file and emits hard errors for schema, target, and edge-shape violations. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_graph_compiler.py` | Validation CLI | `--validate-only` runs schema checks without writing a compiled graph file. |
| `skill-graph.json` | Compiled artifact | Reflects the contract that successfully validated metadata eventually produces. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/01-graph-metadata-schema.md`
