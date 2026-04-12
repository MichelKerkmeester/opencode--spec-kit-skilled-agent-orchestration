---
title: "EX-030 -- 3. MCP Configuration"
description: "This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit."
audited_post_018: true
---

# EX-030 -- 3. MCP Configuration

## 1. OVERVIEW

This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-030` and confirm the expected signals without contradicting evidence.

- Objective: MCP limits audit
- Prompt: `As a feature-flag validation operator, validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }). Verify mCP guardrails returned. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: MCP guardrails returned
- Pass/fail: PASS if defaults + keys identified

---

## 3. TEST EXECUTION

### Prompt

```
As a feature-flag validation operator, validate MCP limits audit against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }). Verify mCP guardrails returned. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })

### Expected

MCP guardrails returned

### Evidence

Search output

### Pass / Fail

- **Pass**: defaults + keys identified
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify in config files directly

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/03-3-mcp-configuration.md](../../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-030
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/030-3-mcp-configuration.md`
