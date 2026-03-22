---
title: "Memory Scripts"
description: "TypeScript CLIs for memory context generation, enrichment, ranking, quality checks, and index maintenance."
trigger_phrases:
  - "memory scripts"
  - "generate context"
  - "rank memories"
  - "cleanup orphaned vectors"
---


# Memory Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. MEMORY SAVE RULE COMMANDS](#3--memory-save-rule-commands)
- [4. MAINTENANCE COMMANDS](#4--maintenance-commands)
- [5. WORKFLOW ALIGNMENT](#5--workflow-alignment)
- [6. FRONTMATTER NORMALIZATION + REINDEX](#6--frontmatter-normalization--reindex)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory/` directory contains the CLI entrypoints for the Spec Kit memory pipeline.

This is the **canonical location** for reindex and memory operations documentation.
Other locations point here: `mcp_server/scripts/README.md`, `mcp_server/database/README.md`

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
- `rank-memories.ts` - rank memory candidates by scoring rules
- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories
- `validate-memory-quality.ts` - validates post-render memory quality against scoring thresholds before indexing/reporting
- `reindex-embeddings.ts` - force full embedding reindex across memory/spec documents
- `ast-parser.ts` - parse markdown into heading/code/table-aware sections
- `backfill-frontmatter.ts` - bulk frontmatter normalization for templates, spec docs, and memory files
- `rebuild-auto-entities.ts` - rebuild auto-entity metadata from indexed content
- `fix-memory-h1.mjs` - One-shot migration script — fixes H1 heading format in legacy memory files

Runtime files are compiled into `../dist/memory/`.


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:memory-save-rule-commands -->
## 3. MEMORY SAVE RULE COMMANDS


Routine JSON mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
```

Explicit CLI targets are authoritative, including policy-defined phase folders. Direct positional saves now reject and must be replaced with structured JSON input.

JSON input mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
```


<!-- /ANCHOR:memory-save-rule-commands -->
<!-- ANCHOR:maintenance-commands -->
## 4. MAINTENANCE COMMANDS


```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json
node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
node .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --apply --include-archive --report /tmp/frontmatter-apply.json
```


<!-- /ANCHOR:maintenance-commands -->
<!-- ANCHOR:workflow-alignment -->
## 5. WORKFLOW ALIGNMENT


- Uses the modular core/extractors/loaders/renderers/lib pipeline.
- Supports subfolder-aware spec path handling through core utilities.
- Produces ANCHOR-structured markdown expected by downstream validation and indexing.
- Enforces the shared rendered-memory contract before successful write/index so malformed anchors, ids, frontmatter, or cleanup artifacts do not persist as active memories.
- Uses content-aware candidate selection so task/session evidence beats generic folder fallback when valid.
- Derives `MEMORY_TITLE` from the content slug via `slugToTitle(contentSlug)` and writes it into the H1 heading. A blank line separates the frontmatter close `---` from the `# H1`.
- Writes `MEMORY_DASHBOARD_TITLE` into context template frontmatter so dashboard titles stay disambiguated.
- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population.
- Retroactive title refresh for existing memories: run `memory_index_scan({ force: true })` after parser/template updates.
<!-- /ANCHOR:workflow-alignment -->

<!-- ANCHOR:frontmatter-normalization-reindex -->
## 6. FRONTMATTER NORMALIZATION + REINDEX

Use the backfill CLI to normalize indexed markdown metadata across templates, spec docs, and memory files.

Managed keys:
- `title`
- `description`
- `trigger_phrases`
- `importance_tier`
- `contextType` (parser also accepts `context_type` alias)

Typical migration workflow:

```bash
# Dry-run first (strict mode by default: malformed frontmatter fails)
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --include-archive --report /tmp/frontmatter-dry-run.json

# Apply once dry-run output is clean
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --apply --include-archive --report /tmp/frontmatter-apply.json

# Reindex embeddings so dashboard/search reflects updated metadata
node .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js

To target specific roots, pass `--roots`:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --roots ./.opencode/specs,./specs --report /tmp/frontmatter-targeted.json
```

If you need compatibility mode during staged cleanup, use `--allow-malformed` to keep processing without non-zero exit on malformed frontmatter files.
<!-- /ANCHOR:frontmatter-normalization-reindex -->
