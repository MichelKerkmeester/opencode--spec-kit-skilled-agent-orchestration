---
title: "004 code_graph_scan full"
description: "Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline."
trigger_phrases:
  - "004"
  - "code graph scan full"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 004 code_graph_scan full

## 1. OVERVIEW

Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline.

---

## 2. SCENARIO CONTRACT

- **Goal**: Confirm explicit full scan reparses post-exclude candidates and can persist edge distribution baseline.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 004 (code_graph_scan full), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

Call `code_graph_scan({"rootDir":"$WORK","incremental":false,"persistBaseline":true})` in a disposable copy.

### Expected Output / Verification

Payload shows `fullScanRequested:true`, `effectiveIncremental:false`, nonzero graph counts, readiness with `inlineIndexPerformed:true`, and detector provenance summary.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Add an excludeGlobs override and verify excluded paths disappear after the full scan.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 004
- Canonical root source: `manual_testing_playbook.md`

