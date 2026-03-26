---
title: "146 -- Dynamic server instructions (P1-6)"
description: "This scenario validates Dynamic server instructions (P1-6) for `146`. It focuses on Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning."
---

# 146 -- Dynamic server instructions (P1-6)

## 1. OVERVIEW

This scenario validates Dynamic server instructions (P1-6) for `146`. It focuses on Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `146` and confirm the expected signals without contradicting evidence.

- Objective: Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning
- Prompt: `Validate dynamic server instructions at MCP initialization. Capture the evidence needed to prove Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions
- Pass/fail: PASS if enabled mode emits overview with counts/channels and disabled mode yields empty string

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 146 | Dynamic server instructions (P1-6) | Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning | `Validate dynamic server instructions at MCP initialization. Capture the evidence needed to prove Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start the MCP server and capture startup logs 2) Verify `setInstructions()` was called with a non-empty instructions string 3) Verify instructions include: memory count, spec folder count, available channels, and active feature flags 4) If 11+ stale memories exist, verify a stale warning is included 5) Restart with `SPECKIT_DYNAMIC_INIT=false` and verify `setInstructions()` receives an empty string | Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions | Server startup log + instructions content snapshot + flag toggle comparison | PASS if enabled mode emits overview with counts/channels and disabled mode yields empty string | Inspect `context-server.ts` `buildServerInstructions`, `startup-checks.ts`, and `SPECKIT_DYNAMIC_INIT` flag handling |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md](../../feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 146
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/146-dynamic-server-instructions-p1-6.md`
