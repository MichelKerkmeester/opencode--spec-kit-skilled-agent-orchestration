---
title: "Data Extractors"
description: "Extractor inventory for session, conversation, decision, file, and implementation data capture."
trigger_phrases:
  - "data extractors"
  - "collect session data"
  - "decision extraction"
---


# Data Extractors

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. ROLE IN PIPELINE](#3--role-in-pipeline)
- [4. NOTES](#4--notes)
- [5. QUICK IMPORT CHECK](#5--quick-import-check)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `extractors/` directory converts collected session input into structured data used by templates and indexing.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY

Current source inventory: 12 TypeScript modules plus `index.ts` barrel export.

- `collect-session-data.ts` - Orchestrates session data collection across observations, files, decisions, and context
- `contamination-filter.ts` - Filters contamination from extraction pipeline outputs
- `conversation-extractor.ts`
- `decision-extractor.ts`
- `diagram-extractor.ts`
- `file-extractor.ts`
- `git-context-extractor.ts` - Mines git history for captured-session enrichment (spec 013)
- `implementation-guide-extractor.ts`
- `quality-scorer.ts` - Scores extraction quality for validation
- `session-activity-signal.ts` - Detects session activity signals for capture gating (re-exported from barrel)
- `session-extractor.ts`
- `spec-folder-extractor.ts` - Parses spec folder docs for captured-session enrichment (spec 013)
- `index.ts`


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:role-in-pipeline -->
## 3. ROLE IN PIPELINE


- Input: normalized data from `loaders/data-loader.ts`
- Processing: extraction and enrichment across conversation, files, decisions, and session context
- Output: structured objects consumed by `renderers/template-renderer.ts` and core workflow/indexing layers


<!-- /ANCHOR:role-in-pipeline -->
<!-- ANCHOR:notes -->
## 4. NOTES


- Decision tree generation logic is provided by `lib/decision-tree-generator.ts` and used by extractor flow.
- Runtime imports use compiled files under `dist/extractors/`.
- The extractor barrel now re-exports the captured-session enrichment helpers `extractSpecFolderContext()` and `extractGitContext()` alongside the existing extraction surface.


<!-- /ANCHOR:notes -->
<!-- ANCHOR:quick-import-check -->
## 5. QUICK IMPORT CHECK


```bash
node -e "const e=require('./.opencode/skill/system-spec-kit/scripts/dist/extractors'); console.log(Object.keys(e))"
```
<!-- /ANCHOR:quick-import-check -->
