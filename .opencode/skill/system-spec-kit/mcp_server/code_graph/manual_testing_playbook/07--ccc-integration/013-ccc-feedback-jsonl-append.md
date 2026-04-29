---
title: "013 ccc_feedback jsonl append"
description: "Verify ccc_feedback appends one JSONL feedback entry with query, rating, resultFile, and comment fields."
trigger_phrases:
  - "013"
  - "ccc feedback jsonl append"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 013 ccc_feedback jsonl append

## 1. OVERVIEW

Verify ccc_feedback appends one JSONL feedback entry with query, rating, resultFile, and comment fields.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify ccc_feedback appends one JSONL feedback entry with query, rating, resultFile, and comment fields.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 013 (ccc_feedback jsonl append), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. In a disposable copy, call `ccc_feedback({"query":"code graph","rating":"partial","comment":"manual test"})`.
2. Inspect `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl`.

### Expected Output / Verification

Response has `recorded:true`; JSONL file contains one new valid JSON line with timestamp, query, rating, and comment.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run with missing rating and verify validation error.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 013
- Canonical root source: `manual_testing_playbook.md`

