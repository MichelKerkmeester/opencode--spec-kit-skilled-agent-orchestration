---
title: "001 ensure-ready selective reindex"
description: "Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior."
trigger_phrases:
  - "001"
  - "ensure ready selective reindex"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 001 ensure-ready selective reindex

## 1. OVERVIEW

Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 001 (ensure-ready selective reindex), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Create a disposable copy and run `code_graph_scan({"rootDir":"$WORK","incremental":false})`.
2. Touch one indexed TypeScript file.
3. Call `code_graph_query({"operation":"outline","subject":"<touched-file>","limit":20})`.
4. Capture readiness fields from the response.

### Expected Output / Verification

Response shows `status:"ok"` and readiness/self-heal evidence such as `inlineIndexPerformed:true` or `selfHealResult:"ok"`. No transcript line shows an unrequested full `code_graph_scan`.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Repeat with `allowInlineIndex:false` through `detect_changes` and confirm it blocks instead.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 001
- Canonical root source: `manual_testing_playbook.md`

