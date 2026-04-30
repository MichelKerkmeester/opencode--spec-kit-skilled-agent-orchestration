---
title: "01. Project environment"
description: "Creates a CocoIndex environment with project settings, embedder and SQLite contexts."
---

# 01. Project environment

Creates a CocoIndex environment with project settings, embedder and SQLite contexts. A project wraps the CocoIndex environment, app and storage contexts for one repository root. It is the runtime bridge between daemon requests and the indexer flow.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

A project wraps the CocoIndex environment, app and storage contexts for one repository root. It is the runtime bridge between daemon requests and the indexer flow.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Project creation ensures `.cocoindex_code/` exists, opens the target SQLite database with vector loading, injects project settings, language overrides and `.gitignore` state, then builds a `CocoIndexCode` app around `indexer_main`.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/project.py:84` | Project runtime | Creates the project environment. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/project.py:100` | Project runtime | Provides context keys to CocoIndex. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/project.py:112` | Project runtime | Constructs the CocoIndex app. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e_daemon.py:95` | End-to-end | Covers indexing and searching through the client. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:186` | Integration | Covers project status after indexing. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/01-project-environment.md`

<!-- /ANCHOR:source-metadata -->
