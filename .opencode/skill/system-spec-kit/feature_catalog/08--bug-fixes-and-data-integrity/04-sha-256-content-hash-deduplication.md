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

| File | Role |
|------|------|
| `mcp_server/handlers/save/dedup.ts` | SHA-256 hash computation and O(1) duplicate detection against `memory_index` |
| `mcp_server/handlers/save/types.ts` | Type definitions for dedup pipeline context |
| `mcp_server/lib/storage/incremental-index.ts` | Incremental indexing integration for content hash checks |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/content-hash-dedup.vitest.ts` | Content hash dedup tests |
| `mcp_server/tests/integration-session-dedup.vitest.ts` | Session dedup integration |

---

## 4. SOURCE METADATA

- Group: Bug fixes and data integrity
- Source feature title: SHA-256 content-hash deduplication
- Current reality source: FEATURE_CATALOG.md
