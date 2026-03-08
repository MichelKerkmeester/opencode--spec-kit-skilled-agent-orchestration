# Audit H-02: mcp_server/handlers/ (N-Z) + save/

**Agent:** Codex GPT-5.4 xhigh (read-only)
**Scope:** 22 files in `mcp_server/handlers/` (memory-index-alias through types) + `handlers/save/`
**Date:** 2026-03-08

## Per-File Results

| File | P0 | P1 | Issues |
|------|----|----|--------|
| memory-index-alias.ts | PASS | FAIL (missing TSDoc @28,49,75,136,182,238; catch lacks instanceof @193,261,277,298) | 10 |
| memory-index-discovery.ts | PASS | FAIL (missing TSDoc @35; catch lacks instanceof @90,154,157,183,188) | 6 |
| memory-index.ts | FAIL (non-AI comment block @342-346) | FAIL (catch lacks instanceof @154,231,482) | 4 |
| memory-ingest.ts | PASS | FAIL (missing TSDoc @63,167,196) | 3 |
| memory-save.ts | PASS | FAIL (unnamed options object @108; bare catch @458) | 2 |
| memory-search.ts | PASS | FAIL (non-null assertions @713,780; catch lacks narrowing @522,634,689,892,911,982,995,1007,1022,1043) | 12 |
| memory-triggers.ts | PASS | FAIL (non-null assertion @383; catch lacks narrowing @135,157,210,224,238,286,302,456) | 9 |
| mutation-hooks.ts | PASS | FAIL (missing TSDoc @15; bare catches @25,32,40,48,56) | 6 |
| pe-gating.ts | PASS | FAIL (inline options object @100; catch lacks instanceof @126,188,214,333) | 5 |
| quality-loop.ts | PASS | FAIL (missing TSDoc @43; inline options @407) | 2 |
| session-learning.ts | PASS | FAIL (catch lacks narrowing @113,240,292,411,456,517,518,519,649) | 9 |
| types.ts | PASS | PASS | 0 |
| save/create-record.ts | PASS | FAIL (missing TSDoc @30; catch lacks instanceof @110,120) | 3 |
| save/db-helpers.ts | PASS | FAIL (catch not narrowed @85) | 1 |
| save/dedup.ts | PASS | FAIL (missing TSDoc @10,43) | 2 |
| save/embedding-pipeline.ts | PASS | FAIL (missing TSDoc @14,20; catch lacks instanceof @59) | 3 |
| save/index.ts | PASS | PASS | 0 |
| save/pe-orchestration.ts | PASS | FAIL (missing TSDoc @19,25) | 2 |
| save/post-insert.ts | PASS | FAIL (missing TSDoc @28,32; catch lacks instanceof @48,64,82,104) | 6 |
| save/reconsolidation-bridge.ts | PASS | FAIL (missing TSDoc @29,34; catch lacks instanceof @131,187) | 4 |
| save/response-builder.ts | PASS | FAIL (missing TSDoc @64,173; bare catch @194) | 3 |
| save/types.ts | PASS | FAIL (missing TSDoc @8,14,24,32,60,68,73,77,92,100) | 10 |

## Summary

- **Files scanned:** 22
- **P0 issues:** 1 (non-AI invariant comment block in memory-index.ts)
- **P1 issues:** 101 (predominantly missing TSDoc and catch blocks lacking instanceof narrowing)
- **Top 3 worst:** memory-search.ts (12), memory-index-alias.ts (10), save/types.ts (10)
