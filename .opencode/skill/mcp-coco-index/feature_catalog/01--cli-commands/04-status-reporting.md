---
title: "04. Status reporting"
description: "Shows project-level index health, counts and language distribution."
---

# 04. Status reporting

Shows project-level index health, counts and language distribution. Status reporting gives operators a fast read on whether an index exists and what it contains. The command queries the loaded project state through the daemon.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Status reporting gives operators a fast read on whether an index exists and what it contains. The command queries the loaded project state through the daemon.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ccc status` prints project root first, then index status. If the target vector table does not exist yet, it tells the operator to build the index instead of throwing a raw SQLite error.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:388` | CLI | Defines `ccc status`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:120` | CLI helper | Formats chunks, files and languages. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:302` | Daemon | Computes project status from `code_chunks_vec`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:162` | End-to-end | Asserts status output includes chunk counts. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:186` | Integration | Asserts daemon project status reports indexed chunks and files. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/04-status-reporting.md`

<!-- /ANCHOR:source-metadata -->
