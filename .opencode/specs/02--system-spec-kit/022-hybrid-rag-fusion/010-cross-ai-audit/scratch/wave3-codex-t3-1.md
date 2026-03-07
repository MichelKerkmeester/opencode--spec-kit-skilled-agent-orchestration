# T3-1: Code Standards Alignment Audit (Codex gpt-5.3-codex)

## Agent: Codex CLI (read-only sandbox)
## Date: 2026-03-07
## Source: `/tmp/codex-t3-1.txt` (451 lines)

---

## Summary

180 source files scanned across `mcp_server/handlers/` and `mcp_server/lib/` (excluding tests, node_modules, dist).

### AI-Prefix Coverage

| Prefix | Count |
|--------|:-----:|
| AI-WHY | 122 |
| AI-TRACE | 28 |
| AI-NOTE | 0 |
| AI-GUARD | 35 |
| **Total** | **185** |

- **57 files** have at least one AI-prefix comment
- **123 files** have no AI-prefix comments
- **104 files** have rationale-style comments (keyword match: because, avoid, prevent, fallback, atomic, etc.)
- **65 files** have rationale comments but NO AI-prefixes (conversion candidates)
- **39 files** have BOTH AI-prefixes AND plain rationale comments (partial migration)

### Separator Header Styles

| Style | Count | Description |
|-------|:-----:|-------------|
| Long-dash `// ----------` | ~20 handler + ~20 lib files | Non-standard, consistent internal convention |
| Short-dash `// --- N. SECTION ---` | 3 files (composite-scoring, checkpoints, recovery-hints) | Closer to standard but still mixed |
| Block comment `/* --- N. SECTION --- */` | ~20 files | Numbered section separators |
| No separator headers | ~19 files | Includes all new `handlers/save/` modules |

### Top 25 Files by Non-Standard Rationale Comment Count

| Count | File | First Line |
|:-----:|------|:----------:|
| 20 | lib/search/learned-feedback.ts | 208 |
| 18 | lib/search/hybrid-search.ts | 4 |
| 10 | lib/search/pipeline/stage3-rerank.ts | 11 |
| 9 | lib/search/pipeline/stage2-fusion.ts | 17 |
| 9 | lib/storage/causal-edges.ts | 101 |
| 7 | handlers/memory-context.ts | 35 |
| 7 | lib/parsing/memory-parser.ts | 118 |
| 7 | lib/scoring/composite-scoring.ts | 23 |
| 7 | lib/search/embedding-expansion.ts | 7 |
| 7 | lib/search/local-reranker.ts | 5 |
| 7 | lib/storage/checkpoints.ts | 306 |
| 6 | handlers/memory-save.ts | 109 |
| 6 | lib/search/cross-encoder.ts | 7 |
| 6 | lib/search/pipeline/stage1-candidate-gen.ts | 221 |
| 6 | lib/storage/transaction-manager.ts | 3 |
| 5 | handlers/memory-triggers.ts | 33 |
| 5 | lib/errors/core.ts | 44 |
| 5 | lib/search/vector-index-schema.ts | 40 |
| 5 | lib/storage/reconsolidation.ts | 220 |
| 4 | lib/cognitive/tier-classifier.ts | 108 |

### Effort Estimates (65 conversion-candidate files)

| Effort | File Count | Description |
|:------:|:----------:|-------------|
| S (1-2 comments) | ~40 | Quick prefix additions |
| M (3-5 comments) | ~15 | Moderate review needed |
| L (6+ comments) | ~10 | Significant review — search/, storage/ heavy hitters |

### Verdict

- **Scope confirmed:** 180 files, 256 non-standard rationale comments across 97 files
- **Conversion effort:** 65 files have no AI-prefixes but have rationale comments → need AI-WHY/AI-GUARD/AI-TRACE prefixes
- **39 files partially migrated** — have both styles, need cleanup pass
- **Separator headers:** Two styles coexist (long-dash and short-dash). Standardization would touch ~40 files.
- **Recommendation:** DEFER to dedicated spec folder — estimated 4-6h for full alignment
