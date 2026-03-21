---
title: "Scripts Library"
description: "Shared TypeScript and shell helper libraries used by system-spec-kit scripts."
trigger_phrases:
  - "scripts library"
  - "anchor generator"
  - "shell common"
---


# Scripts Library

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. NOTES](#3--notes)
- [4. QUICK VALIDATION](#4--quick-validation)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `lib/` directory provides reusable helper modules for memory generation, formatting, scoring, and shell script support.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


TypeScript modules:
- `anchor-generator.ts`
- `ascii-boxes.ts`
- `content-filter.ts`
- `decision-tree-generator.ts`
- `embeddings.ts`
- `flowchart-generator.ts`
- `frontmatter-migration.ts` - helpers for safe markdown frontmatter normalization
- ~~`retry-manager.ts`~~ — moved to `mcp_server/lib/providers/retry-manager.ts`
- `semantic-summarizer.ts`
- `simulation-factory.ts`
- `topic-keywords.ts` - shared lexical helpers for topic extraction
- `trigger-extractor.ts`

Shell helper libraries:
- `git-branch.sh`
- `shell-common.sh`
- `template-utils.sh`


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:notes -->
## 3. NOTES


- `embeddings.ts` and `trigger-extractor.ts` are wrapper/re-export style modules aligned with shared package behavior.
- `shell-common.sh` and `template-utils.sh` are used by shell workflows such as validation and upgrade operations.
- Runtime JavaScript output is under `dist/lib/`.


<!-- /ANCHOR:notes -->
<!-- ANCHOR:quick-validation -->
## 4. QUICK VALIDATION


```bash
node -e "const m=require('./.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator'); console.log(typeof m.generateAnchorId)"
```
<!-- /ANCHOR:quick-validation -->
