---
title: "05. Downstream MCP adoption"
description: "Documents the minimal config wiring needed for repositories to use CocoIndex."
---

# 05. Downstream MCP adoption

Documents the minimal config wiring needed for repositories to use CocoIndex. Downstream adoption guidance keeps repositories from copying only part of the skill payload or enabling unused MCP configs.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Downstream adoption guidance keeps repositories from copying only part of the skill payload or enabling unused MCP configs.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The checklist requires the local skill payload, repo-specific `cocoindex_code` MCP wiring, readiness checks and `.gitignore` hygiene. It says not to expand rollout to unused CLI configs just for symmetry.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/references/downstream_adoption_checklist.md:29` | Reference | Defines the adoption bundle. |
| `.opencode/skill/mcp-coco-index/references/downstream_adoption_checklist.md:55` | Reference | Documents config wiring. |
| `.opencode/skill/mcp-coco-index/scripts/common.sh:150` | Script helper | Detects configured MCP clients. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/scripts/common.sh:218` | Script helper | Recommends the adoption checklist for missing config. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:380` | Manual playbook | Validates readiness scripts with config requirements. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Configuration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--configuration/05-downstream-mcp-adoption.md`

<!-- /ANCHOR:source-metadata -->
