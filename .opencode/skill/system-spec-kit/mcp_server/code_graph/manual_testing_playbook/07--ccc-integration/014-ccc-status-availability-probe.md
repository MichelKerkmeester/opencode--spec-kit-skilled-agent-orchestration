---
title: "014 ccc_status availability probe"
description: "Verify ccc_status reports binary/index availability and recommendation without invoking reindex."
trigger_phrases:
  - "014"
  - "ccc status availability probe"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 014 ccc_status availability probe

## 1. OVERVIEW

Verify ccc_status reports binary/index availability and recommendation without invoking reindex.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify ccc_status reports binary/index availability and recommendation without invoking reindex.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 014 (ccc_status availability probe), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

Call `ccc_status({})` and capture `available`, `binaryPath`, `indexExists`, `indexSize`, and `recommendation`.

### Expected Output / Verification

Response is diagnostic-only and does not create or modify `.cocoindex_code`. Recommendation matches binary/index presence.

### Cleanup

None.

### Variant Scenarios

Temporarily rename the copied binary in a disposable workspace to test unavailable status.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 014
- Canonical root source: `manual_testing_playbook.md`

