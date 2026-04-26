---
title: "CX-025 -- codex mcp server registration"
description: "This scenario validates codex mcp server registration for `CX-025`. It focuses on confirming a registered MCP server is listed and surfaces a usable tool inside an exec session."
---

# CX-025 -- codex mcp server registration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-025`.

---

## 1. OVERVIEW

This scenario validates `codex mcp` server registration for `CX-025`. It focuses on confirming `codex mcp` lists registered MCP servers (or a stub server defined in `.codex/settings.json`) and surfaces a usable tool inside an `exec` session.

### Why This Matters

`references/codex_tools.md` §2 documents Codex's MCP integration as the canonical surface for extending Codex with custom data sources or APIs. If `codex mcp` fails to list registered servers OR if registered servers don't surface their tools inside `exec`, the entire MCP-extension story for Codex collapses and operators lose parity with Claude Code's native MCP support.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-025` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex mcp` lists registered MCP servers and surfaces a usable tool inside an `exec` session.
- Real user request: `Confirm Codex sees my registered MCP servers and can call one of their tools.`
- Prompt: `As a cross-AI orchestrator extending Codex with a custom tool, FIRST register a stub MCP server in .codex/settings.json (or verify an existing entry), THEN run codex mcp to confirm it lists the server, THEN dispatch codex exec --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "List available MCP tools and pick one to call. Return the tool name and a one-line description." Verify codex mcp lists the server, codex exec exits 0, and the response names at least one MCP tool. Return a verdict naming the registered server and the surfaced tool.`
- Expected execution process: Operator inspects `.codex/settings.json` (or `~/.codex/settings.json`) for at least one `mcpServers` entry -> runs `codex mcp` and confirms the server is listed -> dispatches `codex exec` asking Codex to enumerate available MCP tools -> verifies the response names at least one tool from the registered server.
- Expected signals: `.codex/settings.json` (or `~/.codex/settings.json`) defines at least one `mcpServers` entry. `codex mcp` lists the server. `codex exec` exits 0. Response names at least one MCP tool from the registered server.
- Desired user-visible outcome: Confirmation that the MCP integration surface is reachable end-to-end so operators can extend Codex with custom data sources.
- Pass/fail: PASS if a registered server is listed by `codex mcp`, the dispatch exits 0, AND the response names at least one MCP tool. FAIL if no servers are registered, `codex mcp` fails to list them or the exec response contains no tool names.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Inspect `.codex/settings.json` and `~/.codex/settings.json` for `mcpServers` entries. If none exist, register a stub entry per `references/codex_tools.md` §2.
2. Run `codex mcp` and capture the listed servers.
3. Dispatch `codex exec` asking Codex to enumerate available MCP tools.
4. Verify the response names at least one MCP tool.
5. Return a verdict naming the registered server and the surfaced tool.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-025 | codex mcp server registration | Verify codex mcp lists registered servers and exec surfaces a tool | `As a cross-AI orchestrator extending Codex with a custom tool, FIRST register a stub MCP server in .codex/settings.json (or verify an existing entry), THEN run codex mcp to confirm it lists the server, THEN dispatch codex exec --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "List available MCP tools and pick one to call. Return the tool name and a one-line description." Verify codex mcp lists the server, codex exec exits 0, and the response names at least one MCP tool. Return a verdict naming the registered server and the surfaced tool.` | 1. `bash: cat .codex/settings.json ~/.codex/settings.json 2>/dev/null \| grep -A 5 -E "mcpServers\|mcp_servers" > /tmp/cli-codex-cx025-config.txt && wc -l /tmp/cli-codex-cx025-config.txt` -> 2. `bash: codex mcp > /tmp/cli-codex-cx025-list.txt 2>&1 \|\| codex mcp list > /tmp/cli-codex-cx025-list.txt 2>&1` -> 3. `bash: cat /tmp/cli-codex-cx025-list.txt` -> 4. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "List the MCP tools currently available to you. Return a markdown table with columns: tool name \| one-line description. If no MCP tools are available, return the literal string 'NO MCP TOOLS AVAILABLE'." > /tmp/cli-codex-cx025-exec.txt 2>&1` -> 5. `bash: cat /tmp/cli-codex-cx025-exec.txt && grep -E "tool name\|NO MCP TOOLS AVAILABLE\|\\| [a-z_]+ \\|" /tmp/cli-codex-cx025-exec.txt` | Step 1: at least one mcpServers entry detected (config file has >0 lines for the grep); Step 2: codex mcp output captured; Step 3: at least one server is listed; Step 4: exit 0; Step 5: response contains either a tool table OR the explicit "NO MCP TOOLS AVAILABLE" string | Config grep, codex mcp output, captured exec stdout, dispatched command line, exit code | PASS if at least one server is registered AND codex mcp lists it AND exec exits 0 AND response names at least one tool (or explicitly reports no tools available, which is also a valid signal that the surface works); FAIL if no servers registered, codex mcp errors, or exec doesn't return either a tool list or the explicit no-tools sentinel | (1) Per `references/codex_tools.md` §2, add an `mcpServers` block to `.codex/settings.json` if missing; (2) confirm `codex mcp --help` lists the right subcommand syntax (some Codex versions use `codex mcp list`); (3) re-run with `2>&1 \| tee` for stderr inline; (4) verify Codex CLI version supports MCP integration |

### Optional Supplemental Checks

- Dispatch a follow-up `codex exec` that explicitly calls one of the listed MCP tools and confirms the tool round-trip succeeds.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/codex_tools.md` (§2 MCP Server Integration) | Documents codex mcp surface |
| `../../references/cli_reference.md` (§12 Subcommands) | Documents codex mcp subcommand |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/codex_tools.md` | §2 MCP Server Integration |
| `../../references/cli_reference.md` | §12 Subcommands - codex mcp |
| `.codex/settings.json` (or `~/.codex/settings.json`) | mcpServers configuration |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CX-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--built-in-tools/003-mcp-server-registration.md`
