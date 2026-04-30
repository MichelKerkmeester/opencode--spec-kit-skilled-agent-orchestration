---
title: "CM-024 -- Deregister/re-register cycle (DESTRUCTIVE)"
description: "This scenario validates dynamic manual deregister/re-register for `CM-024`. It focuses on confirming `deregister_manual` removes a manual at runtime and `register_manual` restores it without restarting Code Mode."
---

# CM-024 -- Deregister/re-register cycle (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-024`.

---

## 1. OVERVIEW

This scenario validates the dynamic deregister/re-register cycle for `CM-024`. It focuses on confirming that `deregister_manual({name})` removes a manual from runtime so its tools disappear from `list_tools()`, and that `register_manual` (with the original config block) restores it — without a Code Mode process restart.

**WARNING — Destructive scenario**: temporarily removes a manual from runtime. Other scenarios depending on that manual will fail until restoration.

### Why This Matters

Some workflows benefit from temporarily removing a manual (e.g., switching tokens, rotating credentials, isolating a flaky server). If deregister/re-register doesn't behave atomically, operators must restart the whole runtime — losing other in-flight session state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-024` and confirm the expected signals without contradictory evidence.

- Objective: Verify `deregister_manual({name: "github"})` removes GitHub tools; `register_manual({...github_config})` restores them — without Code Mode restart.
- Real user request: `"Hot-swap the GitHub MCP without restarting my session."`
- RCAF Prompt: `As a manual-testing orchestrator, deregister the GitHub manual, list tools (verify absent), then re-register it from the saved .utcp_config.json entry through Code Mode against the live runtime. Verify the manual is absent during the deregister window and present after re-register. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: capture original GitHub config block → deregister → list_tools (verify absent) → register with original config → list_tools (verify present).
- Expected signals: deregister returns success; intermediate `list_tools()` shows no `github.` entries; re-register succeeds; final `list_tools()` shows GitHub tools again.
- Desired user-visible outcome: A short report listing tool counts at each step with a PASS verdict.
- Pass/fail: PASS if all signals hold; FAIL if deregister doesn't remove tools, or re-register fails / tools remain absent.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, deregister the GitHub manual, list tools (verify absent), then re-register it from the saved .utcp_config.json entry through Code Mode against the live runtime. Verify the manual is absent during the deregister window and present after re-register. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const config = require('fs').readFileSync('.utcp_config.json', 'utf8'); const githubBlock = JSON.parse(config).manual_call_templates.find(m => m.name === 'github'); await deregister_manual({ name: 'github' }); const after = (await list_tools()).filter(t => t.startsWith('github')).length; await register_manual(githubBlock); const restored = (await list_tools()).filter(t => t.startsWith('github')).length; return { after_deregister: after, after_register: restored };" })`
2. Inspect the returned counts

### Expected

- Step 1: chain returns object with `after_deregister: 0` and `after_register: > 0`

### Evidence

Capture the chain response with both counts.

### Pass / Fail

- **Pass**: Deregister removed tools (count=0); re-register restored tools (count>0).
- **Fail**: Deregister didn't remove tools (cycle broken); re-register failed or tools didn't reappear.

### Failure Triage

1. If `deregister_manual` is "tool not found": this is a deferred Code Mode tool — load it first via `tool_info({tool_name: "deregister_manual"})`; if absent, the runtime doesn't support dynamic registration.
2. If re-register fails: confirm the saved config block has the right shape (manual_call_templates entry, not just mcpServers); check Code Mode log for register failure.
3. If after-register count = 0: the registration may have appeared to succeed but the server didn't actually start; check the underlying npx command works (`npx -y <package>@latest --version`).

### Optional Supplemental Checks

- Try deregister + re-register with a different manual (e.g., notion); confirms the cycle generalizes.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Dynamic registration tools |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND CONFIG
- Playbook ID: CM-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--recovery-and-config/004-deregister-reregister-cycle.md`
