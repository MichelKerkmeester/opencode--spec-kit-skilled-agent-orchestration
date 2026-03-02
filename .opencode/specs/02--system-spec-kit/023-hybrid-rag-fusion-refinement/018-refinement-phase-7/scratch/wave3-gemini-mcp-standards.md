---
title: "Wave 3 - Gemini MCP Server Code Standards Review"
source: "cli-gemini (gemini-3.1-pro-review)"
date: 2026-03-02
---

# Wave 3: Gemini MCP Server Code Standards Review

**Overall Rating: P1** (Major structural compliance, consistent minor violations)

## Results: 9/10 FAIL, 1/10 PASS

| # | File | Status | Violations |
|---|------|--------|------------|
| 1 | handlers/memory-search.ts | FAIL | Narrative comments as section dividers (`// Core utilities`, `// Utils`) |
| 2 | handlers/memory-context.ts | FAIL | Narrative comments. Missing `AI-TRACE` tag on `T005` |
| 3 | handlers/memory-save.ts | FAIL | Narrative comments. `specFolderLocks` constant uses camelCase (should be UPPER_SNAKE) |
| 4 | lib/search/hybrid-search.ts | FAIL | Narrative comments (`// Local`, `// Type-only`) |
| 5 | lib/scoring/composite-scoring.ts | FAIL | Narrative/trace mix (`// HIGH-003 FIX`) without `AI-TRACE` tag |
| 6 | lib/search/pipeline/types.ts | FAIL | Narrative comments. Missing `AI-TRACE` for `P1-015` |
| 7 | lib/storage/causal-edges.ts | FAIL | Narrative module description. Missing `AI-TRACE` for `T202` |
| 8 | lib/search/session-boost.ts | **PASS** | No violations in first 100 lines |
| 9 | lib/eval/shadow-scoring.ts | FAIL | Large narrative block (lines 5-15) |
| 10 | lib/search/channel-representation.ts | FAIL | Narrative "Rules" block and logic explanations |

## Violation Patterns

### Most Frequent: Narrative Comments (P1)
All failing files use narrative comments (`// Utils`, `// Core handlers`, `// Features:`) to group imports or explain logic. Standard requires: only AI-WHY/AI-GUARD/AI-INVARIANT/AI-TRACE/AI-RISK.

### Missing AI-TRACE Tags (P1)
Files use requirement/task tokens like `T005`, `C138`, `R10`, `P1-015` without mandatory `AI-TRACE` prefix.

### Naming Violation (P1)
`memory-save.ts`: `specFolderLocks` is a module-level constant using camelCase. Should be `SPEC_FOLDER_LOCKS`.

### Import Ordering (PASS)
Generally followed across all files — Node builtins first.

## Recommendations
1. Convert narrative section headers to box-drawing dividers or remove
2. Prefix all requirement/task trackers with `AI-TRACE`
3. Rename `specFolderLocks` to `SPEC_FOLDER_LOCKS`
