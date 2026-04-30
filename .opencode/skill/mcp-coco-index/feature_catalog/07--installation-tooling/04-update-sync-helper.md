---
title: "04. Update sync helper"
description: "Compares the vendored fork with a selected upstream release without overwriting local source."
---

# 04. Update sync helper

Compares the vendored fork with a selected upstream release without overwriting local source. The update helper supports fork maintenance by fetching upstream source into a temporary directory and showing diff risk.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The update helper supports fork maintenance by fetching upstream source into a temporary directory and showing diff risk.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`update.sh` downloads an upstream source release, finds the extracted `cocoindex_code` package, compares files against the vendored directory and flags patched files for manual merge. It does not mutate vendored runtime source.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/scripts/update.sh:21` | Maintenance | Defines vendored and temporary upstream paths. |
| `.opencode/skill/mcp-coco-index/scripts/update.sh:49` | Maintenance | Downloads and extracts the upstream source. |
| `.opencode/skill/mcp-coco-index/scripts/update.sh:69` | Maintenance | Diffs upstream files against the vendored fork. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/MAINTENANCE.md:1` | Maintenance doc | Documents fork maintenance expectations. |
| `.opencode/skill/mcp-coco-index/scripts/update.sh:106` | Maintenance | Prints manual next steps after diff review. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Installation tooling
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--installation-tooling/04-update-sync-helper.md`

<!-- /ANCHOR:source-metadata -->
