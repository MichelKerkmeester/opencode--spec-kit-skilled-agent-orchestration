---
title: "02. Doctor health check"
description: "Reports CocoIndex binary, payload, index, daemon and config readiness."
---

# 02. Doctor health check

Reports CocoIndex binary, payload, index, daemon and config readiness. The doctor script is a read-only health check for the skill installation and project wiring.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The doctor script is a read-only health check for the skill installation and project wiring.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`doctor.sh` can emit JSON, run in strict mode, require config wiring, require daemon availability and check specific config paths. It uses shared readiness helpers and returns distinct exit codes for blocking states.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/scripts/doctor.sh:23` | Health check | Defines mode flags. |
| `.opencode/skill/mcp-coco-index/scripts/doctor.sh:94` | Health check | Computes readiness. |
| `.opencode/skill/mcp-coco-index/scripts/common.sh:201` | Shared helper | Computes recommended next steps. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:380` | Manual playbook | Validates doctor strict and JSON paths. |
| `.opencode/skill/mcp-coco-index/scripts/doctor.sh:9` | Health check | Documents exit codes. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Installation tooling
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--installation-tooling/02-doctor-health-check.md`

<!-- /ANCHOR:source-metadata -->
