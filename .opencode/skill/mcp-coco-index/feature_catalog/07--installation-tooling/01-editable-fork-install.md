---
title: "01. Editable fork install"
description: "Installs the vendored fork into the skill-local virtual environment."
---

# 01. Editable fork install

Installs the vendored fork into the skill-local virtual environment. The installer prepares the local `ccc` binary used by agents and operators. It installs from the vendored `mcp_server/` directory instead of relying on upstream PyPI.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The installer prepares the local `ccc` binary used by agents and operators. It installs from the vendored `mcp_server/` directory instead of relying on upstream PyPI.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`install.sh` creates a Python 3.11+ virtual environment if needed, installs the package editable, verifies `ccc --help`, initializes the project when `.cocoindex_code/` is missing and prints readiness next steps.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/scripts/install.sh:36` | Installer | Creates the virtual environment. |
| `.opencode/skill/mcp-coco-index/scripts/install.sh:47` | Installer | Installs the vendored package editable. |
| `.opencode/skill/mcp-coco-index/scripts/install.sh:67` | Installer | Initializes project state when needed. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/scripts/doctor.sh:159` | Health check | Verifies the installed binary reports the fork marker. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:380` | Manual playbook | Validates helper script readiness. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Installation tooling
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--installation-tooling/01-editable-fork-install.md`

<!-- /ANCHOR:source-metadata -->
