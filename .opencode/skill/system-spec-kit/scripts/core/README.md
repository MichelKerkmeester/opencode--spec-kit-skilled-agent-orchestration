---
title: "Core System Scripts"
description: "Core TypeScript workflow modules for context generation, scoring, writing, and indexing."
trigger_phrases:
  - "core workflow"
  - "memory workflow"
  - "subfolder resolution"
---


# Core System Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. RUNTIME MODEL](#3--runtime-model)
- [4. WORKFLOW NOTES](#4--workflow-notes)
- [5. QUICK VERIFICATION](#5--quick-verification)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY

Current source inventory: 17 TypeScript modules plus `index.ts` barrel export.

- `alignment-validator.ts` - spec folder alignment checking and tree-thinning application for file change lists
- `config.ts` - config loading and path/constants wiring
- `content-cleaner.ts` - HTML stripping and literal anchor escaping for rendered memory content
- `file-writer.ts` - write/validation helpers for generated files
- `frontmatter-editor.ts` - frontmatter metadata injection and trigger phrase YAML rendering
- `memory-indexer.ts` - indexing hooks and metadata preparation
- `memory-metadata.ts` - memory classification, session dedup, causal links, and evidence snapshot assembly
- `post-save-review.ts` - Post-save quality review — compares saved frontmatter against JSON payload, emits machine-readable severity-graded findings (Step 10.5)
- `quality-gates.ts` - memory indexing decision logic and sufficiency abort formatting
- `quality-scorer.ts` - quality scoring support for generated artifacts
- `subfolder-utils.ts` - spec folder and child-folder resolution helpers
- `title-builder.ts` - memory title construction, normalization, and dashboard suffix helpers
- `topic-extractor.ts` - derive topic signals from folder/content inputs
- `tree-thinning.ts` - bottom-up merging of small files during context loading to reduce token overhead (pre-pipeline)
- `workflow-accessors.ts` - safe typed accessors for loosely-typed workflow objects
- `workflow-path-utils.ts` - path normalization, key-file discovery, and alignment keyword helpers
- `workflow.ts` - main orchestration flow
- `index.ts` - barrel exports


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:runtime-model -->
## 3. RUNTIME MODEL


- Source of truth: `core/*.ts`
- Runtime: `dist/core/*.js`
- Build command:

```bash
cd .opencode/skill/system-spec-kit/scripts && npm run build
```


<!-- /ANCHOR:runtime-model -->
<!-- ANCHOR:workflow-notes -->
## 4. WORKFLOW NOTES


- `workflow.ts` composes loaders, extractors, renderers, and lib utilities.
- `subfolder-utils.ts` supports subfolder-aware operations used by memory save flows.
- `file-writer.ts` and `memory-indexer.ts` keep generated context output consistent with indexing expectations.
- `post-save-review.ts` runs after writes in JSON-mode save flows to compare saved frontmatter against the input payload and surface severity-graded drift findings.
- `workflow.ts` updates per-folder `description.json` after each memory save (increments `memorySequence`, appends to `memoryNameHistory`). This tracking is best-effort — failures are non-fatal.


<!-- /ANCHOR:workflow-notes -->
<!-- ANCHOR:quick-verification -->
## 5. QUICK VERIFICATION


```bash
node -e "const core=require('./.opencode/skill/system-spec-kit/scripts/dist/core'); console.log(Object.keys(core))"
```
<!-- /ANCHOR:quick-verification -->
