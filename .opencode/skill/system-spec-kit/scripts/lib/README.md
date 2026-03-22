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

The `lib/` directory provides 20 reusable helper libraries: 17 TypeScript modules compiled to `dist/lib/` and 3 shell helper scripts used by system-spec-kit workflows.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


TypeScript modules (17):
- `anchor-generator.ts` - generates stable anchor identifiers for markdown content
- `ascii-boxes.ts` - renders boxed ASCII layouts for terminal-friendly output
- `cli-capture-shared.ts` - shares helpers for CLI capture payload handling
- `content-filter.ts` - filters content before downstream processing or output
- `decision-tree-generator.ts` - builds decision-tree structures for generated docs
- `embeddings.ts` - exposes shared embedding-related helpers and wrappers
- `flowchart-generator.ts` - generates flowchart-friendly output structures
- `frontmatter-migration.ts` - helpers for safe markdown frontmatter normalization
- `memory-frontmatter.ts` - shared helpers for memory document frontmatter handling
- `phase-classifier.ts` - classifies captured data into workflow phases
- `semantic-signal-extractor.ts` - extracts semantic signals for routing or scoring
- `semantic-summarizer.ts` - summarizes semantic content for downstream workflows
- `session-activity-signal.ts` - derives session activity signals from captured activity
- `simulation-factory.ts` - builds simulation inputs and helper fixtures
- `topic-keywords.ts` - shared lexical helpers for topic extraction
- `trigger-extractor.ts` - extracts trigger phrases and activation cues
- `validate-memory-quality.ts` - validates generated memory content quality

Shell helper libraries (3):
- `git-branch.sh`
- `shell-common.sh`
- `template-utils.sh`


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:notes -->
## 3. NOTES


- `embeddings.ts` and `trigger-extractor.ts` are wrapper/re-export style modules aligned with shared package behavior.
- `shell-common.sh` and `template-utils.sh` are used by shell workflows such as validation and upgrade operations.
- Runtime JavaScript output is under `dist/lib/` with 17 compiled `.js` modules plus matching `.d.ts` and `.js.map` files.


<!-- /ANCHOR:notes -->
<!-- ANCHOR:quick-validation -->
## 4. QUICK VALIDATION


```bash
node -e "const m=require('./.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator'); console.log(typeof m.generateAnchorId)"
```
<!-- /ANCHOR:quick-validation -->
