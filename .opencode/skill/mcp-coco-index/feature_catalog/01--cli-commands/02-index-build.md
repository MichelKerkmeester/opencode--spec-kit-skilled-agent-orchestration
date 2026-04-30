---
title: "02. Index build"
description: "Runs incremental indexing and prints final index statistics."
---

# 02. Index build

Runs incremental indexing and prints final index statistics. The index command connects to the daemon and asks it to update the current project index. It streams progress while CocoIndex scans files, chunks content and updates the SQLite vector table.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The index command connects to the daemon and asks it to update the current project index. It streams progress while CocoIndex scans files, chunks content and updates the SQLite vector table.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ccc index` has no refresh flag because the command itself is the refresh path. It requires an initialized project, starts or reconnects to the daemon and prints chunk, file and language counts after the update finishes.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:338` | CLI | Defines `ccc index`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:164` | CLI helper | Streams indexing progress from the daemon. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/project.py:40` | Project runtime | Updates the CocoIndex app and converts file stats to progress snapshots. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:156` | End-to-end | Asserts index output includes chunk and file counts. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:205` | Integration | Asserts daemon indexing streams progress updates. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/02-index-build.md`

<!-- /ANCHOR:source-metadata -->
