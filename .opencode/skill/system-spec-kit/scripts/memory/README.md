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

<!-- /ANCHOR:overview -->

## Canonical Runbook

This is the **canonical location** for reindex and memory operations documentation.

Other locations point here: `mcp_server/scripts/README.md`, `mcp_server/database/README.md`

<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `generate-context.ts` - generate memory output from spec folder or JSON input
- `rank-memories.ts` - rank memory candidates by scoring rules
- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories
- `validate-memory-quality.ts` - validates memory entry quality against scoring thresholds
- `reindex-embeddings.ts` - force full embedding reindex across memory/spec documents
- `ast-parser.ts` - parse markdown into heading/code/table-aware sections
- `backfill-frontmatter.ts` - bulk frontmatter normalization for templates, spec docs, and memory files

Runtime files are compiled into `../dist/memory/`.


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:memory-save-rule-commands -->
## 3. MEMORY SAVE RULE COMMANDS


Direct spec-folder mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<###-spec-name>
```

JSON input mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
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
- Writes `MEMORY_TITLE` into generated context frontmatter/headings so index titles stay descriptive.
- Writes `MEMORY_DASHBOARD_TITLE` into context template frontmatter so dashboard titles stay disambiguated.
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
```

To target specific roots, pass `--roots`:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --roots ./.opencode/specs,./specs --report /tmp/frontmatter-targeted.json
```

If you need compatibility mode during staged cleanup, use `--allow-malformed` to keep processing without non-zero exit on malformed frontmatter files.
<!-- /ANCHOR:frontmatter-normalization-reindex -->
