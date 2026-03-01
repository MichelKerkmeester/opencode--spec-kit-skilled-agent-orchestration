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


- `workflow.ts` - main orchestration flow
- `config.ts` - config loading and path/constants wiring
- `subfolder-utils.ts` - spec folder and child-folder resolution helpers
- `topic-extractor.ts` - derive topic signals from folder/content inputs
- `quality-scorer.ts` - quality scoring support for generated artifacts
- `file-writer.ts` - write/validation helpers for generated files
- `memory-indexer.ts` - indexing hooks and metadata preparation
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


<!-- /ANCHOR:workflow-notes -->
<!-- ANCHOR:quick-verification -->
## 5. QUICK VERIFICATION


```bash
node -e "const core=require('./.opencode/skill/system-spec-kit/scripts/dist/core'); console.log(Object.keys(core))"
```
<!-- /ANCHOR:quick-verification -->
