---
title: "07. Daemon subcommands"
description: "Exposes daemon status, restart and stop operations through `ccc daemon`."
---

# 07. Daemon subcommands

Exposes daemon status, restart and stop operations through `ccc daemon`. Daemon subcommands provide operator controls around the background process. They report loaded projects, restart the process or stop it cleanly.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Daemon subcommands provide operator controls around the background process. They report loaded projects, restart the process or stop it cleanly.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The installed CLI exposes `status`, `restart` and `stop`, but not a standalone `start` subcommand. Normal commands auto-start the daemon through `ensure_daemon`.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:505` | CLI | Defines `ccc daemon status`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:529` | CLI | Defines `ccc daemon restart`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:547` | CLI | Defines `ccc daemon stop`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:338` | End-to-end | Covers stop plus auto-start on later search. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:358` | End-to-end | Covers daemon restart. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/07-daemon-subcommands.md`

<!-- /ANCHOR:source-metadata -->
