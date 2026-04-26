---
title: "CM-022 -- Disabled server omitted"
description: "This scenario validates the disabled-server config flag for `CM-022`. It focuses on confirming `\"disabled\": true` for a manual removes its tools from `list_tools()` output and re-enabling restores them."
---

# CM-022 -- Disabled server omitted

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-022`.

---

## 1. OVERVIEW

This scenario validates the `disabled: true` flag for `CM-022`. It focuses on confirming that setting the flag for a manual in `.utcp_config.json` removes that manual's tools from `list_tools()` output, and that removing/setting-false the flag restores them — without restarting other servers.

### Why This Matters

Operators frequently disable a server temporarily (e.g., when its API is down, when testing in isolation, or to reduce token consumption). If the flag doesn't take effect cleanly, operators may believe Code Mode is broken when it's just respecting their config.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-022` and confirm the expected signals without contradictory evidence.

- Objective: Verify setting `"disabled": true` for the GitHub manual removes its tools; reverting restores them.
- Real user request: `"Temporarily disable the GitHub MCP for this session."`
- Prompt: `As a manual-testing orchestrator, set disabled: true for the GitHub manual, restart Code Mode, list tools, then revert through Code Mode against the modified-then-restored config. Verify GitHub tools are absent during the disabled run and present after revert. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: backup config → patch GitHub manual to disabled → restart → list_tools (verify GitHub absent) → revert → restart → list_tools (verify GitHub present).
- Expected signals: during disabled run, no `github.` entries in `list_tools()`; after revert, `github.` entries return.
- Desired user-visible outcome: A short report listing tool counts before/during/after with a PASS verdict.
- Pass/fail: PASS if all signals hold; FAIL if GitHub tools appear during disabled run (flag not respected) or don't reappear after revert (other servers also affected).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, set disabled: true for the GitHub manual, restart Code Mode, list tools, then revert through Code Mode against the modified-then-restored config. Verify GitHub tools are absent during the disabled run and present after revert. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cp .utcp_config.json .utcp_config.json.bak`
2. `bash: jq '(.manual_call_templates[] | select(.name == "github")).config.mcpServers.github.disabled = true' .utcp_config.json.bak > .utcp_config.json`
3. Restart Code Mode runtime
4. `call_tool_chain({ code: "const tools = await list_tools(); return tools.filter(t => t.startsWith('github')).length;" })`
5. `bash: mv .utcp_config.json.bak .utcp_config.json`
6. Restart Code Mode runtime
7. `call_tool_chain({ code: "const tools = await list_tools(); return tools.filter(t => t.startsWith('github')).length;" })`

### Expected

- Step 4: returns 0 (no GitHub tools during disabled run)
- Step 7: returns > 0 (GitHub tools restored)

### Evidence

Capture the GitHub tool counts at steps 4 and 7.

### Pass / Fail

- **Pass**: 0 GitHub tools during disabled; > 0 after revert.
- **Fail**: GitHub tools present during disabled (flag ignored); not restored (revert broken).

### Failure Triage

1. If GitHub tools present during disabled: confirm the JSON patch landed in the right path — `cat .utcp_config.json | jq '.manual_call_templates[] | select(.name == "github")'` should show `disabled: true`.
2. If not restored after revert: confirm `cat .utcp_config.json | jq '.'` matches the original; restart Code Mode again.
3. If other servers also affected: this is a Code Mode bug — disabling one manual shouldn't affect others. Capture before/after lists and escalate.

### Optional Supplemental Checks

- Try with a manual that has many tools (e.g., webflow with 42); confirms disable works at scale.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.utcp_config.json` (project root) | Subject of patch |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND CONFIG
- Playbook ID: CM-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--recovery-and-config/002-disabled-server-omitted.md`
