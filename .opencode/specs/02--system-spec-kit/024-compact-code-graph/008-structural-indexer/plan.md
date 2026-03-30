# Plan: Phase 008 — Structural Indexer

## Steps

1. **Set up tree-sitter WASM runtime:**
   - Install `web-tree-sitter` and language grammar packages
   - Configure WASM loading for Node.js environment
   - Verify parse works on a sample JS/TS file
2. **Write tree-sitter query files:**
   - `javascript.scm` with @definition and @reference captures
   - `typescript.scm` extending JS with TS-specific nodes
   - `python.scm` for function/class/import patterns
   - `bash.scm` for conservative function/command patterns
3. **Implement `indexer-types.ts`:**
   - Define `CodeNode`, `CodeEdge`, `ParseResult` interfaces
   - Define `symbolId` generation (deterministic hash)
   - Define `fqName` construction rules per language
4. **Implement `structural-indexer.ts`:**
   - Parse file → run query → collect captures
   - Map captures to `CodeNode[]` and `CodeEdge[]`
   - Track parser health (clean/recovered/error)
   - Handle parse errors gracefully (partial results, not crash)
5. **Implement `incremental-index.ts`:**
   - Content-hash computation per file
   - Compare against stored hash in SQLite (Phase 009)
   - Skip re-parse when hash matches
   - Report stale file count
6. **Test on repo files:**
   - Run indexer against actual JS/TS files in `.opencode/`
   - Verify node/edge counts are reasonable
   - Check parser health across all file types
   - Measure parse time per file and full-repo time
7. **Validate edge extraction quality:**
   - Spot-check CALLS edges against manual reading
   - Verify IMPORTS edges match actual import statements
   - Check CONTAINS relationships for nested symbols

## Dependencies

- No runtime dependencies on Phases 001-007
- Phase 009 must exist for persistent storage (can test with in-memory arrays)
- tree-sitter WASM grammars must be available at runtime

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Parser quality variance across grammars | Parser health flags, partial results on error |
| WASM loading issues in Node.js | Test early, fallback to native tree-sitter if needed |
| Shell grammar too noisy | Conservative captures only (function_definition) |
| Performance on large files | File-size guard, skip files >100KB |
