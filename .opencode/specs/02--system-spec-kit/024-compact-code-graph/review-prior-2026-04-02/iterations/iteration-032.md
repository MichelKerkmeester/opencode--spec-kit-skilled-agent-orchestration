# Review Iteration 032
## Dimension: D1 Correctness
## Focus: getParser() async migration, circular import safety, fallback behavior
## New Findings
### [P1] F034 - failed tree-sitter initialization poisons the parser singleton and can lock later scans into permanent parse errors
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:63-86`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:623-640`
- Evidence: `ensureInit()` memoizes the first init attempt in `initPromise` and never clears it on rejection, while `getLanguageGrammar()`/`loadAllLanguages()` likewise leave any already-loaded grammars in `grammarCache`. `getParser()` catches that first failure and returns a `RegexParser`, but on a later retry it can successfully pass `TreeSitterParser.isReady()` once `parserInstance` exists and `grammarCache.size > 0`, then construct `new TreeSitterParser()` even if one or more grammars never loaded. `TreeSitterParser.parse()` then returns `parseHealth: 'error'` for those languages (`Grammar not loaded for ...`) instead of retrying or falling back, so a transient bootstrap/load failure can leave the process in a stuck partially initialized state.
- Fix: Reset `initPromise` on rejection, and treat grammar loading as all-or-nothing for the cached singleton. Either clear partial grammar state on failed `loadAllLanguages()` or have `getParser()` verify every supported grammar explicitly before caching `treeSitterParser`; if that verification fails, keep using regex fallback for that call and retry cleanly later.

## Remediation Verification
- F021: FIXED — `handleCodeGraphScan()` now reaches `graphDb.getLastGitHead()`/`graphDb.getDb()`/`graphDb.isFileStale()` through DB helpers whose `getDb()` path lazy-initializes via `initDb(DATABASE_DIR)`, so the live scan path no longer depends on a separate explicit bootstrap before first use. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:71-104`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:111-145`

## Iteration Summary
- New findings: 1 P1
- Verified fixes: 1
- Remaining active: 1
