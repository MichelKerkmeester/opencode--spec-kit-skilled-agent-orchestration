---
title: "EX-030 -- 3. MCP Configuration"
description: "This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit."
---

# EX-030 -- 3. MCP Configuration

## 1. OVERVIEW

This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-030` and confirm the expected signals without contradicting evidence.

- Objective: MCP limits audit
- Prompt: `Find MCP validation settings defaults. Capture the evidence needed to prove MCP guardrails returned. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: MCP guardrails returned
- Pass/fail: PASS if defaults + keys identified

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-030 | 3. MCP Configuration | MCP limits audit | `Find MCP validation settings defaults. Capture the evidence needed to prove MCP guardrails returned. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })` | MCP guardrails returned | Search output | PASS if defaults + keys identified | Verify in config files directly |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/03-3-mcp-configuration.md](../../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-030
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/030-3-mcp-configuration.md`
