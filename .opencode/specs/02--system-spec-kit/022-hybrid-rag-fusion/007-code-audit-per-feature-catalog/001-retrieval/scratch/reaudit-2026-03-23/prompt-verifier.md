# Code Audit — Verifier Role: Category 01-Retrieval

You are performing code-level verification of feature catalog entries for the **Retrieval** category of the Spec Kit Memory MCP server.

## Your Task

For each of the 11 features, verify at the code level:
1. **File existence** — Do all source files listed in the catalog entry actually exist?
2. **Function signatures** — Do referenced functions/classes exist with the documented signatures?
3. **Flag defaults** — Are feature flag default values correct as documented?
4. **Unreferenced files** — Are there source files implementing this feature NOT listed in the catalog?
5. **Behavioral accuracy** — Does the code do what the catalog says it does?

## Files to Read

### Feature Catalog Entries (read ALL 11)
Directory: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/`
Files: 01 through 11 (all .md files in this directory)

### MCP Server Source Code
Root: `.opencode/skill/system-spec-kit/mcp_server/`
Key directories to scan:
- `handlers/` — tool handlers (memory_context, memory_search, memory_match_triggers, memory_quick_search)
- `lib/search/` — search library
- `lib/search/pipeline/` — pipeline stages (stage1 through stage4)
- `lib/` — utility modules
- `index.ts` or entry point — for tool registration

## Output Format

For each feature:

```
## Feature NN: [Feature Name]

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| path/to/file.ts           | YES/NO  | YES/NO/WRONG  |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| functionName   | YES/NO | YES/NO          |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| FLAG_NAME | value | value | YES/NO |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- [list or "None found"]

### Verdict: MATCH | PARTIAL | MISMATCH
```

End with a summary:
| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---------|-----------|---------------|-----------|---------------|---------|

Be exhaustive. Check every file reference. List every discrepancy with exact paths and line numbers.
