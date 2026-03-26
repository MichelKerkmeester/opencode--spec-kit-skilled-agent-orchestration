---
title: "Memory Maintenance and Migration CLIs"
description: "Operator-facing maintenance and migration command surface for normalizing frontmatter, rebuilding embeddings and entities, cleaning orphaned rows, validating memory quality, and ranking memory datasets."
---

# Memory Maintenance and Migration CLIs

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Memory Maintenance and Migration CLIs is the operator-facing toolbox for repairing, normalizing, validating, and re-ranking the persisted memory corpus.

The cluster combines bulk migration scripts, database cleanup utilities, rebuild commands, a backward-compatible quality-gate CLI, and a JSON ranking helper. It also includes a small markdown section parser in the same `scripts/memory/` area that supports structure-aware memory processing instead of treating markdown as flat text.

---

## 2. CURRENT REALITY

The shipped maintenance surface is a mixed toolkit rather than a single monolithic command.

`backfill-frontmatter.ts` is the broadest migration CLI. It auto-discovers every `specs` directory under the project root unless `--roots` is supplied, optionally includes archived trees, can skip template processing, and supports both `--dry-run` and `--apply`. It normalizes markdown frontmatter for templates, spec docs, and memory files by delegating classification and rendering to `frontmatter-migration`, produces per-kind change counters, can continue past malformed frontmatter when `--allow-malformed` is set, and can emit a structured JSON report via `--report`.

`reindex-embeddings.ts` is the full reindex bootstrap command. It initializes the indexing runtime through the public indexing API, warms the embedding model before scan time, force-runs `runMemoryIndexScan({ force: true, includeConstitutional: true })`, then prints a summarized status block covering scanned, indexed, updated, unchanged, and failed files plus constitutional-memory counts and up to fifteen changed-file rows. Missing summary content or warmup failures terminate the run with a non-zero exit.

`cleanup-orphaned-vectors.ts` is direct SQLite maintenance for index integrity. It opens the production database, loads `sqlite-vec`, counts orphaned `memory_history` rows and `vec_memories` rows, supports `--dry-run`, and when changes are needed deletes both history and vector orphans inside one atomic transaction before printing verification counts for memories, vectors, and history rows.

`rebuild-auto-entities.ts` is a scoped rebuild command for derived entity data. It accepts `--dry-run` and optional `--spec-folder`, opens the production database, then delegates to the public `rebuildAutoEntities()` API. The output reports memories scanned, memories reprocessed, removed auto rows, extracted entities, stored entities, and rebuilt catalog entries when running in apply mode.

`validate-memory-quality.ts` is intentionally a compatibility shim. The canonical implementation lives in `../lib/validate-memory-quality.ts`, but this file preserves the historical CLI entry point, re-exports the validation API, and exits with `QUALITY_GATE_PASS`, `QUALITY_GATE_FAIL`, or usage/file-not-found status codes so older workflows can keep invoking the script path directly.

`rank-memories.ts` is a pure data-processing CLI for JSON memory sets. It accepts stdin or a JSON file, supports `--show-archived`, folder and memory limits, and compact or pretty output, then computes constitutional highlights, recently active folders, high-importance folders, recent non-constitutional memories, and aggregate corpus stats using the shared folder-scoring utilities.

`ast-parser.ts` is not a standalone operator command, but it is part of the same maintenance/tooling cluster and supplies structure-aware markdown parsing for retrieval-side and indexing-side consumers. It re-exports the shared chunker, preserves code blocks and tables as atomic units, and emits typed sections with optional heading titles so markdown can be processed semantically instead of line-by-line.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts` | Migration CLI | Bulk-normalizes markdown frontmatter across templates, spec docs, and memory files with discovery, dry-run/apply modes, and JSON reporting |
| `.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts` | Reindex CLI | Boots the indexing runtime, warms the embedding model, force-runs a full memory scan, and prints corpus-level reindex results |
| `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts` | Database maintenance CLI | Detects and removes orphaned `memory_history` and `vec_memories` rows with dry-run support and atomic cleanup |
| `.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts` | Rebuild CLI | Recomputes auto-generated entity rows for the full corpus or one spec-folder scope through the public API |
| `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | Validation CLI shim | Preserves the historical CLI entry point while re-exporting the canonical memory-quality validation module |
| `.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts` | Reporting CLI | Ranks memory datasets and folder activity from JSON input for dashboarding and operational summaries |
| `.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts` | Parsing utility | Breaks markdown into structured sections with heading awareness and shared chunker semantics for downstream tooling |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Memory Maintenance and Migration CLIs
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of the maintenance CLI implementations and adjacent markdown parsing utility
