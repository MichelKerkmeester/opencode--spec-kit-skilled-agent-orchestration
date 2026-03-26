---
title: "SHA-256 content-hash deduplication"
description: "Tracks the O(1) SHA-256 hash lookup that skips embedding generation when identical content is re-saved."
---

# SHA-256 content-hash deduplication

## 1. OVERVIEW

Tracks the O(1) SHA-256 hash lookup that skips embedding generation when identical content is re-saved.

When you save the same file again without changing it, the system now recognizes it instantly and skips the expensive processing step. It is like a postal worker who recognizes a letter they already delivered and sends it straight back instead of processing it again. This saves time and resources without any risk of missing actual changes.

---

## 2. CURRENT REALITY

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/storage/incremental-index.ts` | Lib | Incremental indexing |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/path-security.ts` | Lib | Path security validation |
| `shared/parsing/quality-extractors.ts` | Shared | Quality signal extraction |
| `shared/utils/path-security.ts` | Shared | Shared path security |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/content-hash-dedup.vitest.ts` | Content hash dedup tests |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Incremental index behavioral tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Focused incremental-index coverage (supplemental to `incremental-index-v2.vitest.ts`; concrete fast-path assertions) |
| `mcp_server/tests/integration-session-dedup.vitest.ts` | Session dedup integration |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Parser extended tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `shared/parsing/quality-extractors.test.ts` | Quality Extractors.Ts |

---

## 4. SOURCE METADATA

- Group: Bug fixes and data integrity
- Source feature title: SHA-256 content-hash deduplication
- Current reality source: FEATURE_CATALOG.md
