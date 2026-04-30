---
title: "01. Project initialization"
description: "Creates project and user settings for a new CocoIndex Code workspace."
---

# 01. Project initialization

Creates project and user settings for a new CocoIndex Code workspace. Project initialization prepares a repository for semantic indexing by creating `.cocoindex_code/settings.yml`, creating user settings when needed and adding the index directory to `.gitignore` when the project is a Git repository.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Project initialization prepares a repository for semantic indexing by creating `.cocoindex_code/settings.yml`, creating user settings when needed and adding the index directory to `.gitignore` when the project is a Git repository.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ccc init` exits early when the project is already initialized. Without `--force`, it warns when a parent directory already looks like the better project root, then writes default settings and leaves indexing to the next `ccc index` run.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:295` | CLI | Defines `ccc init` and the parent-root guard. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:245` | CLI helper | Adds the `.cocoindex_code` ignore entry when a Git repository exists. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:326` | Settings | Writes project settings under the project root. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:141` | End-to-end | Covers the happy-path initialization session. |
| `.opencode/skill/mcp-coco-index/tests/test_cli_helpers.py:82` | Unit | Covers `.gitignore` creation for initialized Git projects. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/01-project-initialization.md`

<!-- /ANCHOR:source-metadata -->
