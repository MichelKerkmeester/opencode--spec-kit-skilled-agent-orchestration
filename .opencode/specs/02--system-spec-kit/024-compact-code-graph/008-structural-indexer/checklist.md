---
title: "Checklist: Phase 008 — Structural Indexer [02--system-spec-kit/024-compact-code-graph/008-structural-indexer/checklist]"
description: "checklist document for 008-structural-indexer."
trigger_phrases:
  - "checklist"
  - "phase"
  - "008"
  - "structural"
  - "indexer"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 008 — Structural Indexer

## P0
- [x] Regex-based parser implemented (tree-sitter WASM planned as enhancement)
- [x] JavaScript regex parser extracts functions, classes, imports without crash
- [x] TypeScript regex parser extracts functions, classes, interfaces, types without crash
- [x] Standardized captures produce correct `CodeNode[]` for functions, classes, methods
- [x] `CONTAINS` edges correctly link classes → methods
- [ ] `CALLS` edges correctly identify direct function calls
- [x] `IMPORTS` edges correctly identify import statements
- [x] `symbolId` is deterministic (SHA-256 of filePath + fqName + kind)
- [x] Parser health metadata distinguishes clean/recovered/error

## P1
- [x] Python regex parser extracts function/class/method definitions
- [x] Shell regex parser extracts function definitions (conservative)
- [x] Content-hash incremental skip works (unchanged file not re-parsed)
- [x] `fqName` construction follows consistent rules across languages
- [x] `EXPORTS` edges identify exported symbols in JS/TS
- [ ] Full repo index completes in <30 seconds
- [ ] Incremental re-index (10 files changed) completes in <5 seconds

## P2
- [ ] `EXTENDS` and `IMPLEMENTS` edges extracted for TS classes/interfaces
- [ ] `TESTED_BY` heuristic edge links test files to tested modules
- [ ] Files >100KB skipped with warning (not crash)
- [ ] Parse time tracked per file for performance monitoring
- [ ] Edge confidence scores reflect extraction reliability
