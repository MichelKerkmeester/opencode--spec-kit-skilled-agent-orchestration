# SHA-256 content-hash deduplication

## Current Reality

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---

## Source Metadata

- Group: Bug fixes and data integrity
- Source feature title: SHA-256 content-hash deduplication
- Summary match found: Yes
- Summary source feature title: SHA-256 content-hash deduplication
- Current reality source: feature_catalog.md
