---
title: "01. CLI helper tests"
description: "Validates project-root, default-path and `.gitignore` helper behavior."
---

# 01. CLI helper tests

Validates project-root, default-path and `.gitignore` helper behavior. CLI helper tests protect the small path and ignore-file behaviors that make the terminal UX predictable.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

CLI helper tests protect the small path and ignore-file behaviors that make the terminal UX predictable.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The tests cover initialized and uninitialized project roots, default path calculation from subdirectories and idempotent add/remove behavior for `.gitignore` entries.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/tests/test_cli_helpers.py:22` | Test | Covers successful project root resolution. |
| `.opencode/skill/mcp-coco-index/tests/test_cli_helpers.py:44` | Test | Covers default path from a subdirectory. |
| `.opencode/skill/mcp-coco-index/tests/test_cli_helpers.py:82` | Test | Covers `.gitignore` helper behavior. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:60` | Implementation | Implements project root resolution. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:245` | Implementation | Implements ignore-file updates. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Validation and tests
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--validation-and-tests/01-cli-helper-tests.md`

<!-- /ANCHOR:source-metadata -->
