# BM25 trigger phrase re-index gate

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Tracks the fix that expands the BM25 re-index condition to include trigger phrase changes alongside title changes.

## 2. CURRENT REALITY
The BM25 re-index condition in `memory-crud-update.ts` was expanded from title-only to title OR trigger phrases: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`. The BM25 corpus includes trigger phrases, so changes to either field must trigger re-indexing.

## 3. IN SIMPLE TERMS
When you change the keywords associated with a memory, the search index now updates itself to reflect those changes. Previously it only refreshed when you changed the title, so updated keywords were invisible to searches until a full rebuild. This fix makes sure the system stays in sync with your edits.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Update handler with BM25 re-index gate |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/sqlite-fts.vitest.ts` | SQLite FTS5 operations |

## 5. SOURCE METADATA
- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: BM25 trigger phrase re-index gate
- Current reality source: feature_catalog.md

