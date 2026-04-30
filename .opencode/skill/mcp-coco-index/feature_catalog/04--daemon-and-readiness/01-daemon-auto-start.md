---
title: "01. Daemon auto-start"
description: "Connects to an existing daemon or starts one when commands need it."
---

# 01. Daemon auto-start

Connects to an existing daemon or starts one when commands need it. Most user-facing commands do not ask operators to start the daemon manually. They call a client helper that connects, restarts stale daemons or starts a new process.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Most user-facing commands do not ask operators to start the daemon manually. They call a client helper that connects, restarts stale daemons or starts a new process.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ensure_daemon` first tries an existing socket. If the daemon is missing, version-stale or settings-stale, it starts or restarts the process and retries the handshake.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py:405` | Client | Ensures a usable daemon exists. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py:192` | Client | Starts the daemon process. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py:389` | Client | Detects restart requirements. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:338` | End-to-end | Covers auto-start after a daemon stop. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:354` | Manual playbook | Defines daemon auto-start manual validation. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/01-daemon-auto-start.md`

<!-- /ANCHOR:source-metadata -->
