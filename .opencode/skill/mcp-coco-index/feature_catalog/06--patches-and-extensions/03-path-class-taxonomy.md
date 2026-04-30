---
title: "03. Path-class taxonomy"
description: "Classifies indexed paths as implementation, tests, docs, spec research, generated or vendor."
---

# 03. Path-class taxonomy

Classifies indexed paths as implementation, tests, docs, spec research, generated or vendor. Path classes let search ranking treat implementation code differently from docs, tests, generated output and vendor trees.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Path classes let search ranking treat implementation code differently from docs, tests, generated output and vendor trees.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Classification happens during indexing. Vendor and generated paths are recognized first, spec research paths are separated from regular implementation, tests are detected by path and filename and docs are recognized outside spec trees.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:52` | Indexer | Classifies source paths. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:220` | Indexer | Stores path class for each processed file. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24` | Schema | Includes `path_class` on query results. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:390` | Reference | Documents path-class field semantics. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:307` | End-to-end | Covers indexed path selection with ignores. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Patches and extensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--patches-and-extensions/03-path-class-taxonomy.md`

<!-- /ANCHOR:source-metadata -->
