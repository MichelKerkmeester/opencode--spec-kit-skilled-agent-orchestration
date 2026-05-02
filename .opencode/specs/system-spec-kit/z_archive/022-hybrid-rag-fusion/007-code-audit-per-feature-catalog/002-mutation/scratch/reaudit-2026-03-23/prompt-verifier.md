# Code Audit — Verifier Role: Category 02-Mutation

You are performing code-level verification of feature catalog entries for the **Mutation** category of the Spec Kit Memory MCP server.

## Your Task

For each of the 10 features, verify at the code level:
1. **File existence** — Do all source files listed in the catalog entry actually exist?
2. **Function signatures** — Do referenced functions/classes exist with documented signatures?
3. **Flag defaults** — Are feature flag default values correct as documented?
4. **Unreferenced files** — Are there source files implementing this feature NOT listed in the catalog?
5. **Behavioral accuracy** — Does the code do what the catalog says?

## Files to Read

### Feature Catalog Entries (read ALL 10)
Directory: `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/`
Files: 01 through 10 (all .md files in this directory)

### MCP Server Source Code
Root: `.opencode/skill/system-spec-kit/mcp_server/`
Key directories:
- `handlers/save/` — save handler implementations
- `handlers/` — mutation tool handlers
- `lib/storage/` — storage utilities, history, transactions
- `lib/shared-memory/` — namespace CRUD
- `lib/` — utilities

Pay special attention to:
- `lib/storage/history.ts` — was missing from ALL mutation catalogs in prior audit
- Files in `handlers/save/` like spec-folder-mutex.ts, v-rule-bridge.ts, validation-responses.ts

## Output Format

For each feature:
```
## Feature NN: [Feature Name]

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|

### Unreferenced Files
- [files implementing this feature not in catalog]

### Verdict: MATCH | PARTIAL | MISMATCH
```

End with summary table:
| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---------|-----------|---------------|-----------|---------------|---------|

Be exhaustive. Check every file reference. List every discrepancy with exact paths and line numbers.
