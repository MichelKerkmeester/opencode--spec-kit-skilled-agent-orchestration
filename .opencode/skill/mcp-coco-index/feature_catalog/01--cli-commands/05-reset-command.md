---
title: "05. Reset command"
description: "Deletes index databases and optionally removes project settings and ignore entries."
---

# 05. Reset command

Deletes index databases and optionally removes project settings and ignore entries. The reset command removes generated CocoIndex state without editing source files. It supports database-only cleanup and full cleanup.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The reset command removes generated CocoIndex state without editing source files. It supports database-only cleanup and full cleanup.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

By default, `ccc reset` deletes `cocoindex.db` and `target_sqlite.db` while preserving settings. With `--all`, it also removes `settings.yml`, tries to remove the empty `.cocoindex_code` directory and removes the Git ignore entry.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:397` | CLI | Defines `ccc reset`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:268` | CLI helper | Removes the `.gitignore` entry during full reset. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:340` | Daemon | Removes loaded project resources before files are deleted. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:216` | End-to-end | Covers database reset while keeping settings. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:254` | End-to-end | Covers full reset behavior. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/05-reset-command.md`

<!-- /ANCHOR:source-metadata -->
