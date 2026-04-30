---
title: "05. Vector table persistence"
description: "Persists chunks, embeddings and fork metadata in a SQLite vec0 table."
---

# 05. Vector table persistence

Persists chunks, embeddings and fork metadata in a SQLite vec0 table. The indexer stores each chunk in `code_chunks_vec`, using a vector table with language partitioning and auxiliary columns for result display and fork telemetry.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The indexer stores each chunk in `code_chunks_vec`, using a vector table with language partitioning and auxiliary columns for result display and fork telemetry.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The table primary key is chunk id. Auxiliary columns include file path, real path, content, content hash, path class and line ranges. Language is a partition key for indexed language filtering.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:259` | Indexer | Mounts the SQLite vector table target. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:266` | Indexer | Defines language partition and auxiliary columns. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/shared.py:79` | Schema | Defines the stored `CodeChunk` shape. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:186` | Integration | Covers status after the vector table is populated. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e_daemon.py:95` | End-to-end | Covers index and search through persisted state. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/05-vector-table-persistence.md`

<!-- /ANCHOR:source-metadata -->
