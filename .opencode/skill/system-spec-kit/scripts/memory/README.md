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

- [1. OVERVIEW](#1-overview)
- [2. CURRENT INVENTORY](#2-current-inventory)
- [3. MEMORY SAVE RULE COMMANDS](#3-memory-save-rule-commands)
- [4. MAINTENANCE COMMANDS](#4-maintenance-commands)
- [5. WORKFLOW ALIGNMENT](#5-workflow-alignment)
- [6. FRONTMATTER NORMALIZATION + REINDEX](#6-frontmatter-normalization--reindex)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory/` directory contains the CLI entrypoints for the Spec Kit memory pipeline.

This is the **canonical location** for reindex and memory operations documentation.
Other locations point here: `mcp_server/scripts/README.md`, `mcp_server/database/README.md`

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                   MEMORY PIPELINE ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐                                               │
│  │   generate-      │──────────── Canonical Save Entrypoint         │
│  │   context.ts     │                                               │
│  └─────────┬────────┘                                               │
│            │                                                        │
│  ┌─────────▼──────────────────────────────────────────────────────┐ │
│  │                       PIPELINE FLOW                            │ │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │ │
│  │  │ core/    │───▶│extractors│───▶│ loaders/ │───▶│renderers│ │ │
│  │  │workflow  │    │semantic  │    │ data-    │    │template  │ │ │
│  │  │modules   │    │signals   │    │ loader   │    │ render   │ │ │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │ │
│  └──────────────────────────────┬─────────────────────────────────┘ │
│                                 ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                      OUTPUT & VALIDATION                        ││
│  │  ┌────────────────────┐   ┌──────────────────────────────────┐ ││
│  │  │validate-memory-    │   │ Contract Enforcement:             │ ││
│  │  │ quality.ts         │   │ • Missing frontmatter → reject   │ ││
│  │  │3-layer gate:       │   │ • Missing anchors → reject       │ ││
│  │  │ 1. Structure       │   │ • Template leakage → reject      │ ││
│  │  │ 2. Semantic        │   │ • Under-evidenced → abort        │ ││
│  │  │ 3. Duplicate       │   └──────────────────────────────────┘ ││
│  │  └────────────────────┘                                        ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                    MAINTENANCE TOOLS                             ││
│  │  ┌────────────────────┐  ┌──────────────────┐  ┌──────────────┐ ││
│  │  │backfill-           │  │reindex-          │  │cleanup-      │ ││
│  │  │ frontmatter.ts     │  │ embeddings.ts    │  │ orphaned-    │ ││
│  │  │normalize metadata  │  │force full reindex│  │ vectors.ts   │ ││
│  │  │manage keys: title, │  │of all embeddings │  │stale vectors │ ││
│  │  │description, tier   │  └──────────────────┘  └──────────────┘ ││
│  │  └────────────────────┘  ┌──────────────────┐  ┌──────────────┐ ││
│  │  ┌────────────────────┐  │cleanup-index-    │  │rebuild-auto- │ ││
│  │  │rank-memories.ts    │  │ scope-           │  │ entities.ts  │ ││
│  │  │rank candidates by  │  │ violations        │  │rebuild auto- │ ││
│  │  │scoring rules       │  │z_future/external │  │entity meta   │ ││
│  │  └────────────────────┘  └──────────────────┘  └──────────────┘ ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Directory Tree

```
scripts/memory/
├── generate-context.ts             # Canonical save: update packet continuity + context artifacts
├── rank-memories.ts                # Rank memory candidates by scoring rules
├── cleanup-orphaned-vectors.ts     # Remove stale vector rows
├── cleanup-index-scope-violations.ts # Purge z_future/external pollution
├── validate-memory-quality.ts      # Post-render 3-layer quality gate (structure, semantic, duplicate)
├── reindex-embeddings.ts           # Force full embedding reindex
├── ast-parser.ts                   # Parse markdown into heading/code/table-aware sections
├── backfill-frontmatter.ts         # Bulk frontmatter normalization (title, description, tier, triggers)
├── rebuild-auto-entities.ts        # Rebuild auto-entity metadata from indexed content
├── fix-memory-h1.mjs               # One-shot migration: fix H1 format in older artifacts
└── README.md
```

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `generate-context.ts` - update canonical packet continuity and supporting generated context artifacts from spec-folder or JSON input
- `rank-memories.ts` - rank memory candidates by scoring rules
- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories
- `cleanup-index-scope-violations.ts` - delete `z_future` and `external` pollution, repair the `gate-enforcement.md` duplicate, and downgrade invalid constitutional tiers
- `validate-memory-quality.ts` - validates post-render memory quality against scoring thresholds before indexing/reporting; includes post-save quality gates (structure, semantic sufficiency, duplicate detection), heuristic calibration, and trigger sanitization
- `reindex-embeddings.ts` - force full embedding reindex across memory/spec documents
- `ast-parser.ts` - parse markdown into heading/code/table-aware sections
- `backfill-frontmatter.ts` - bulk frontmatter normalization for templates, spec docs, and supporting generated context artifacts
- `rebuild-auto-entities.ts` - rebuild auto-entity metadata from indexed content
- `fix-memory-h1.mjs` - One-shot migration script — fixes H1 heading format in older generated memory artifacts

Runtime files are compiled into `../dist/memory/`.


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:memory-save-rule-commands -->
## 3. MEMORY SAVE RULE COMMANDS


Routine JSON mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"NNN-name","user_prompts":["Summarize the session"],"observations":["Capture the concrete outcome"],"recent_context":["List touched docs, commands, and verification"]}' \
  specs/<###-spec-name>
```

Explicit CLI targets are authoritative, including policy-defined phase folders. `generate-context.js` now updates the canonical continuity surfaces for the target packet through a single canonical path.

JSON input mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  /tmp/save-context-data-<session-id>.json \
  specs/NNN-name
```


<!-- /ANCHOR:memory-save-rule-commands -->
<!-- ANCHOR:maintenance-commands -->
## 4. MAINTENANCE COMMANDS


```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json
node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js
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
- Uses content-aware candidate selection so task/session evidence beats generic packet defaults when valid.
- Derives `MEMORY_TITLE` from the content slug via `slugToTitle(contentSlug)` and writes it into the H1 heading. A blank line separates the frontmatter close `---` from the `# H1`.
- Writes `MEMORY_DASHBOARD_TITLE` into context template frontmatter so dashboard titles stay disambiguated.
- Runs post-render memory quality validation so contaminated headings or stale decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.
- Retroactive title refresh for existing spec-doc records: run `memory_index_scan({ force: true })` after parser/template updates.
<!-- /ANCHOR:workflow-alignment -->

<!-- ANCHOR:frontmatter-normalization-reindex -->
## 6. FRONTMATTER NORMALIZATION + REINDEX

Use the backfill CLI to normalize indexed markdown metadata across templates, spec docs, and supporting generated context artifacts.

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
