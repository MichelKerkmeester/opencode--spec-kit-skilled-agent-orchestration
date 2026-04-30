---
title: "04. End-to-end session tests"
description: "Validates full CLI, daemon and search workflows against sample projects."
---

# 04. End-to-end session tests

Validates full CLI, daemon and search workflows against sample projects. End-to-end tests verify the commands as operators use them rather than only testing isolated helpers.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

End-to-end tests verify the commands as operators use them rather than only testing isolated helpers.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The suite covers init, index, status, search filters, reset modes, daemon stop and restart, refresh search, not-initialized errors, subdirectory behavior, root discovery and gitignore respect.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:141` | Test | Covers the full happy-path session. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:197` | Test | Covers incremental indexing. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:307` | Test | Covers gitignore-respecting search results. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:494` | Manual playbook | Maps automated test files to manual coverage. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e_daemon.py:95` | End-to-end | Covers index and search via daemon client. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Validation and tests
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--validation-and-tests/04-e2e-session-tests.md`

<!-- /ANCHOR:source-metadata -->
