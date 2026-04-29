---
title: "008 code_graph_context readiness block"
description: "Verify context retrieval preserves readiness metadata and blocks full-scan-required states."
trigger_phrases:
  - "008"
  - "code graph context readiness block"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 008 code_graph_context readiness block

## 1. OVERVIEW

Verify context retrieval preserves readiness metadata and blocks full-scan-required states.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify context retrieval preserves readiness metadata and blocks full-scan-required states.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 008 (code_graph_context readiness block), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Touch more than 50 tracked source files.
3. Call `code_graph_context({"queryMode":"neighborhood","subject":"handleCodeGraphQuery"})`.

### Expected Output / Verification

Payload returns `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, readiness, canonical readiness, and trust state.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Call with a single stale file and verify selective self-heal mirrors query behavior.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 008
- Canonical root source: `manual_testing_playbook.md`

