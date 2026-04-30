---
title: "03. Ensure-ready bootstrap"
description: "Idempotently installs, initializes and indexes enough state for search use."
---

# 03. Ensure-ready bootstrap

Idempotently installs, initializes and indexes enough state for search use. `ensure_ready.sh` is the automation-friendly wrapper that brings a project to a usable CocoIndex state.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`ensure_ready.sh` is the automation-friendly wrapper that brings a project to a usable CocoIndex state.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The script installs the binary when missing, runs `ccc init` when project settings are missing, indexes when requested or when readiness says the index is missing and can return machine-readable JSON with actions performed.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:23` | Bootstrap | Defines bootstrap flags and action logging. |
| `.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:94` | Bootstrap | Installs the package when `ccc` is missing. |
| `.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:110` | Bootstrap | Builds the index when refresh is requested or needed. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:380` | Manual playbook | Covers ensure-ready strict and idempotent behavior. |
| `.opencode/skill/mcp-coco-index/scripts/common.sh:123` | Shared helper | Runs `ccc` with project-root override. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Installation tooling
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--installation-tooling/03-ensure-ready-bootstrap.md`

<!-- /ANCHOR:source-metadata -->
