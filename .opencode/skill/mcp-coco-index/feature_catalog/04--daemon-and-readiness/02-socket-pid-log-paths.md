---
title: "02. Socket, PID and log paths"
description: "Defines daemon runtime paths under the user settings directory."
---

# 02. Socket, PID and log paths

Defines daemon runtime paths under the user settings directory. Daemon runtime files live with user-level CocoIndex settings so the process can outlive individual project commands.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Daemon runtime files live with user-level CocoIndex settings so the process can outlive individual project commands.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Unix uses a socket file under the daemon directory. Windows uses a named pipe with a hash of the daemon directory so environment overrides can create isolated daemon instances. PID and log files share the same directory.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:84` | Daemon | Defines the daemon directory. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:94` | Daemon | Defines socket or pipe addressing. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:106` | Daemon | Defines PID and log paths. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_client.py:36` | Unit | Patches daemon paths for client tests. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:367` | Manual playbook | Checks daemon status plus PID and socket files. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/02-socket-pid-log-paths.md`

<!-- /ANCHOR:source-metadata -->
