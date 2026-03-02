---
title: "Wave 3 - Codex Scripts Code Standards Review"
source: "cli-codex (gpt-5.3-codex, read-only sandbox)"
date: 2026-03-02
---

# Wave 3: Codex Scripts Code Standards Review

**Overall Rating: P2** (All failures are minor — wrong header format and narrative comments)

## Results: 10/10 FAIL

| # | File | Violations |
|---|------|------------|
| 1 | memory/generate-context.ts | P2: Header `// ----` not box-drawing `// ───`. Non-AI comments |
| 2 | core/workflow.ts | P2: Header format. Non-AI comments (`// Node stdlib`, `// Internal modules`) |
| 3 | core/config.ts | P2: Header format. Non-AI comments (section banners) |
| 4 | core/memory-indexer.ts | P2: Header format. **P1: Import ordering** — internal before external then internal again |
| 5 | memory/reindex-embeddings.ts | P2: Header format. Non-AI comments (section banners) |
| 6 | memory/rank-memories.ts | P2: Header format. Non-AI comments |
| 7 | evals/run-performance-benchmarks.ts | P2: Header format. Non-AI comments (usage block) |
| 8 | core/quality-scorer.ts | P2: Header format. Non-AI comments |
| 9 | memory/cleanup-orphaned-vectors.ts | P2: Header format. P2: `memory_id` interface field not camelCase |
| 10 | lib/content-filter.ts | P2: Header format. Non-AI comments |

## Key Observations

- **No commented-out code** found in any file
- **Import ordering** generally correct except memory-indexer.ts
- **Naming** mostly correct — one interface field `memory_id` should be `memoryId`
- The `// -------` header format is used universally instead of `// ───` box-drawing format
- All files use a consistent internal pattern (just not the sk-code--opencode pattern)
