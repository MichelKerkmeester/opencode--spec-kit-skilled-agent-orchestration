---
title: "Wave 3 Synthesis: Code Standards Review"
date: 2026-03-02
sources: [wave3-gemini-mcp-standards.md, wave3-codex-scripts-standards.md]
---

# Wave 3 Synthesis: Code Standards Review

## Summary: 19/20 files FAIL — consistent pattern, low severity

Both the MCP server (Gemini) and scripts (Codex) show the same systematic pattern:
- File headers use `// -------` dashes instead of `// ───` box-drawing characters
- Narrative comments (`// Utils`, `// Node stdlib`, section dividers) used instead of AI-intent prefixes
- These are **P2 cosmetic violations**, not functional issues

## P1 Findings (Require Action)

| # | File | Violation | Action |
|---|------|-----------|--------|
| 1 | handlers/memory-save.ts | `specFolderLocks` constant uses camelCase | Rename to `SPEC_FOLDER_LOCKS` |
| 2 | scripts/core/memory-indexer.ts | Import ordering — internal before external | Reorder imports |
| 3 | Multiple MCP server files | Task tokens (T005, C138, P1-015) missing `AI-TRACE` prefix | Add `AI-TRACE` prefix |

## P2 Findings (Low Priority)

| Pattern | Count | Scope |
|---------|-------|-------|
| Wrong header format (dashes vs box-drawing) | 19/20 files | All packages |
| Narrative comments | 19/20 files | All packages |
| Interface field `memory_id` not camelCase | 1 file | cleanup-orphaned-vectors.ts |

## Assessment

The codebase uses a **consistent internal convention** (`// -------` headers, `// MODULE:` format) that was established before the sk-code--opencode standard was formalized. The code is clean and well-organized — it just uses a different comment style than the current standard requires.

**Recommendation**: These P2 violations should be addressed in a dedicated cleanup pass (separate spec) rather than during this audit. The P1 items (constant naming, import ordering, AI-TRACE tags) could be fixed now.
