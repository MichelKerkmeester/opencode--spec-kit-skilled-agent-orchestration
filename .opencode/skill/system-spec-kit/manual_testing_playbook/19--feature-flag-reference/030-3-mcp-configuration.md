---
title: "EX-030 -- 3. MCP Configuration"
description: "This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit."
audited_post_018: true
---

# EX-030 -- 3. MCP Configuration

## 1. OVERVIEW

This scenario validates 3. MCP Configuration for `EX-030`. It focuses on MCP limits audit.

---

## 2. SCENARIO CONTRACT


- Objective: MCP limits audit.
- Real user request: `Please validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }) and tell me whether the expected signals are present: MCP guardrails returned.`
- RCAF Prompt: `As a feature-flag validation operator, validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }). Verify mCP guardrails returned. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: MCP guardrails returned
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [19--feature-flag-reference/03-3-mcp-configuration.md](../../feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/030-3-mcp-configuration.md`
