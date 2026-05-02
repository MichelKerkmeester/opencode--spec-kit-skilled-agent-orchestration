---
title: "Core Scripts: Context Workflow Modules"
description: "TypeScript modules that generate, score, write and index Spec Kit continuity context."
trigger_phrases:
  - "core workflow"
  - "memory workflow"
  - "subfolder resolution"
---

# Core Scripts: Context Workflow Modules

> TypeScript modules for context-save orchestration, scoring, file output and indexing hooks.

<!-- ANCHOR:table-of-contents -->
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

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/core/` contains the TypeScript workflow modules used by `scripts/dist/memory/generate-context.js`. The folder owns context-save orchestration, quality scoring, metadata extraction, file writing, indexing hooks and spec-folder path handling.

Current state:

- Source of truth is `scripts/core/*.ts`.
- Compiled runtime output is `scripts/dist/core/*.js`.
- `workflow.ts` composes the save flow and imports focused helpers from this folder.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         scripts/core/                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────────┐      ┌──────────────────────┐
│ generate-context.js  │ ───▶ │ workflow.ts          │
│ dist/memory caller   │      │ save orchestration   │
└──────────────────────┘      └──────────┬───────────┘
                                          │
                                          ▼
┌──────────────────────┐      ┌──────────────────────┐
│ path + config        │ ◀─── │ workflow helpers     │
│ config/subfolders    │      │ accessors/path utils │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           ▼                             ▼
┌──────────────────────┐      ┌──────────────────────┐
│ metadata + scoring   │ ───▶ │ writers + indexers   │
│ memory/title/topic   │      │ file/memory hooks    │
└──────────────────────┘      └──────────────────────┘

Dependency direction:
workflow.ts -> focused core helpers -> scripts/lib utilities
index.ts -> public exports only
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
scripts/core/
+-- index.ts                  # Public barrel for core modules
+-- workflow.ts               # Main context-save orchestration
+-- workflow-accessors.ts     # Typed accessors for workflow objects
+-- workflow-path-utils.ts    # Path normalization and key-file discovery
+-- config.ts                 # Runtime config and constants
+-- subfolder-utils.ts        # Spec folder and child-folder resolution
+-- save-context-path.ts      # Save path resolution helpers
+-- memory-*.ts               # Metadata and indexing support
+-- *-scorer.ts               # Quality scoring support
+-- *-validator.ts            # Alignment and quality gate checks
`-- README.md
```

Allowed dependency direction:

```text
workflow.ts -> core helper modules -> scripts/lib utilities
index.ts -> core helper modules
core helper modules -> Node built-ins and local script libraries
```

Disallowed dependency direction:

```text
core helper modules -> scripts/dist compiled output
scripts/lib utilities -> workflow.ts
runtime callers -> private helper assumptions not exported by index.ts
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
scripts/core/
+-- alignment-validator.ts       # Spec-folder alignment and tree-thinning checks
+-- config.ts                    # Shared config loading and path wiring
+-- content-cleaner.ts           # HTML stripping and anchor escaping
+-- find-predecessor-memory.ts   # Prior memory lookup support
+-- frontmatter-editor.ts        # Frontmatter injection and trigger rendering
+-- index.ts                     # Barrel exports
+-- memory-indexer.ts            # Indexing hooks and metadata preparation
+-- memory-metadata.ts           # Memory classification and evidence snapshots
+-- post-save-review.ts          # Post-save frontmatter drift review
+-- quality-gates.ts             # Save and indexing gate decisions
+-- quality-scorer.ts            # Artifact quality scoring
+-- save-context-path.ts         # Save target path helpers
+-- subfolder-utils.ts           # Spec folder resolution helpers
+-- title-builder.ts             # Memory title construction
+-- topic-extractor.ts           # Topic signal extraction
+-- tree-thinning.ts             # Context tree compaction helpers
+-- workflow-accessors.ts        # Safe accessors for loose workflow data
+-- workflow-path-utils.ts       # Path normalization and key-file discovery
+-- workflow.ts                  # Main orchestration flow
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `workflow.ts` | Runs the context-save flow from parsed input through generated continuity artifacts. |
| `config.ts` | Centralizes script paths, repository roots and runtime constants. |
| `subfolder-utils.ts` | Resolves spec folders, child folders and subfolder-aware save targets. |
| `save-context-path.ts` | Computes canonical save paths for generated context output. |
| `memory-metadata.ts` | Builds metadata used by memory records, deduplication, causal links and evidence snapshots. |
| `memory-indexer.ts` | Prepares indexing calls and memory metadata for saved artifacts. |
| `frontmatter-editor.ts` | Injects metadata and renders trigger phrase frontmatter. |
| `post-save-review.ts` | Compares saved frontmatter with JSON payloads and reports drift findings. |
| `quality-gates.ts` | Decides whether save and indexing quality gates pass or abort. |
| `index.ts` | Exposes the modules that callers can import from `core`. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Source modules import local TypeScript helpers and script libraries, not compiled `dist/` output. |
| Exports | `index.ts` is the public barrel for this folder. Keep one-off helpers private unless another script imports them. |
| Ownership | This folder owns context-save orchestration helpers. MCP server tools, database code and spec templates belong outside `scripts/core/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ dist/memory/generate-context.js          │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ workflow.ts                              │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ config + path + subfolder resolution     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ metadata extraction and quality scoring  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ generated files and indexing hooks       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ continuity files, descriptions and graph │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `workflow.ts` | Module | Main source file for the save workflow. |
| `index.ts` | Module | Public barrel for importing core helpers. |
| `scripts/dist/core` | Compiled output | Runtime location consumed after `npm run build`. |
| `scripts/dist/memory/generate-context.js` | CLI script | Primary caller for core workflow behavior. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root unless noted.

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
```

Expected result: TypeScript compiles and updates `scripts/dist/`.

```bash
node -e "const core=require('./.opencode/skill/system-spec-kit/scripts/dist/core'); console.log(Object.keys(core))"
```

Expected result: Node prints the exported core module names.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`../README.md`](../README.md)
- [`../memory/README.md`](../memory/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
