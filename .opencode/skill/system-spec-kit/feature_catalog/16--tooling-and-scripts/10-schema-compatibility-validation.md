# Schema compatibility validation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)
- [6. IN SIMPLE TERMS](#6--in-simple-terms)

## 1. OVERVIEW

Schema compatibility validation performs a non-throwing readiness check against an open database to verify required tables and columns are present.

## 2. CURRENT REALITY

`validateBackwardCompatibility()` performs a non-throwing readiness check against an already-open database connection. The helper treats `memory_index` and `schema_version` as hard requirements and validates that `memory_index` still exposes the core columns the current runtime expects (`id`, `spec_folder`, `file_path`, `importance_tier`, `context_type`, `session_id`, `created_at`, `updated_at`).

Compatibility fails only when those required tables or columns are missing. Supporting tables such as `memory_history`, `checkpoints` and `memory_conflicts` are reported as warnings instead, which makes the helper useful for rollout logging, migration probes and degraded-mode diagnostics without crashing startup or test flows.

The function is exported in both snake_case and camelCase form from `vector-index-schema.ts`, so call sites can import `validateBackwardCompatibility` while the source file preserves the existing internal naming pattern.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Backward-compatibility validation and schema-report generation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Missing-table detection, required-column coverage and compatible-schema success path |

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Schema compatibility validation
- Current reality source: feature_catalog.md

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-128

## 6. IN SIMPLE TERMS

This feature checks whether the database has the right structure before the system tries to use it. If required tables or columns are missing, it reports the problem clearly instead of crashing. It is like checking that a form has all the expected fields before you start filling it out, so you catch formatting problems early rather than halfway through.
