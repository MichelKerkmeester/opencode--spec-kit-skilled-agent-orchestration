---
title: "002 — Indexing Normalization"
description: "Index deduplication, tier normalization, and frontmatter standardization for the memory system."
importance_tier: "important"
contextType: "implementation"
---

# 002 — Indexing Normalization

Consolidated sub-spec covering memory index deduplication, tier normalization, and frontmatter standardization. Merges two prior child specs: 002-index-tier-anomalies and 004-frontmatter-indexing.

## Status

**Completed** (index-tier-anomalies) / **Completed** (frontmatter-indexing)

## Scope

- Canonical path deduplication in `memory_index_scan` to prevent duplicate indexing through symlink aliases
- Deterministic tier precedence normalization across spec, memory, and constitutional documents
- Frontmatter key/value schema standardization across templates and spec documents
- Migration tooling (dry-run + apply) and full index rebuild workflow
- Regression tests for symlink dedup, tier resolution, and parser normalization

## Key Files

- `spec.md` — Consolidated specification (2 source specs merged)
- `plan.md` — Implementation plan
- `tasks.md` — Task breakdown
- `checklist.md` — Verification checklist
- `decision-record.md` — Architecture decisions
