# Checklist: Phase 008 — Structural Indexer

## P0
- [ ] tree-sitter WASM runtime loads and initializes without error
- [ ] JavaScript grammar parses all `.js` files in repo without crash
- [ ] TypeScript grammar parses all `.ts` files in repo without crash
- [ ] Standardized captures produce correct `CodeNode[]` for functions, classes, methods
- [ ] `CONTAINS` edges correctly link files → functions and classes → methods
- [ ] `CALLS` edges correctly identify direct function calls
- [ ] `IMPORTS` edges correctly identify import statements
- [ ] `symbolId` is deterministic (same file + same content → same ID)
- [ ] Parser health metadata distinguishes clean/recovered/error trees

## P1
- [ ] Python grammar parses `.py` files and extracts function/class definitions
- [ ] Shell grammar parses `.sh` files and extracts function definitions (conservative)
- [ ] Content-hash incremental skip works (unchanged file not re-parsed)
- [ ] `fqName` construction follows consistent rules across languages
- [ ] `EXPORTS` edges identify exported symbols in JS/TS
- [ ] Full repo index completes in <30 seconds
- [ ] Incremental re-index (10 files changed) completes in <5 seconds

## P2
- [ ] `EXTENDS` and `IMPLEMENTS` edges extracted for TS classes/interfaces
- [ ] `TESTED_BY` heuristic edge links test files to tested modules
- [ ] Files >100KB skipped with warning (not crash)
- [ ] Parse time tracked per file for performance monitoring
- [ ] Edge confidence scores reflect extraction reliability
