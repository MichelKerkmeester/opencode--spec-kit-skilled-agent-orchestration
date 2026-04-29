---
title: "006 code_graph_status readonly"
description: "Verify status reads readiness and graph quality without mutating or repairing stale state."
trigger_phrases:
  - "006"
  - "code graph status readonly"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 006 code_graph_status readonly

## 1. OVERVIEW

Verify status reads readiness and graph quality without mutating or repairing stale state.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify status reads readiness and graph quality without mutating or repairing stale state.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 006 (code_graph_status readonly), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Capture `code_graph_status({})` twice around a stale-file fixture.
2. Compare `lastPersistedAt`, readiness, and scan counts.
3. Confirm no `code_graph_scan` was invoked.

### Expected Output / Verification

Status returns diagnostic fields including `freshness`, `readiness`, `canonicalReadiness`, `trustState`, and `graphQualitySummary`, but does not repair stale state.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Corrupt the copied DB and verify status returns a degraded envelope rather than crashing.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 006
- Canonical root source: `manual_testing_playbook.md`

