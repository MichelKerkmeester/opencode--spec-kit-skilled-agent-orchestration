---
title: "CP-016 -- MCP support discovery"
description: "This scenario validates Copilot CLI's documented MCP (Model Context Protocol) support surface for `CP-016`. It focuses on confirming Copilot acknowledges MCP capability or lists connected MCP servers in response to a documented prompt."
---

# CP-016 -- MCP support discovery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-016`.

---

## 1. OVERVIEW

This scenario validates Copilot CLI's documented MCP (Model Context Protocol) support for `CP-016`. It focuses on confirming Copilot, when asked, either lists currently connected MCP servers or acknowledges MCP capability and explains how to connect a server, citing the documented capability from `references/copilot_tools.md` §2.

### Why This Matters

MCP support is one of the documented unique capabilities in `references/copilot_tools.md` §2, it differentiates Copilot from CLIs that have no extensibility surface for external tools. The four-way comparison table in §3 lists "MCP Support: Yes (Built-in)" for Copilot. If Copilot cannot describe its own MCP support (or denies it), the documented capability is misaligned with reality and operators cannot trust the integration narrative for downstream tooling decisions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Copilot CLI, when asked, either lists currently connected MCP servers or acknowledges MCP capability and explains how to connect a server, citing the documented capability
- Real user request: `Ask Copilot what MCP servers (if any) it has connected and what categories of MCP capability it supports.`
- RCAF Prompt: `As a cross-AI orchestrator probing Copilot's MCP integration surface, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and ask which MCP servers (if any) are currently connected and what categories of MCP capability the CLI supports per its documented feature surface. Verify the answer either (a) lists currently connected MCP servers or (b) acknowledges MCP support and explains how to connect a server, citing the documented capability from copilot_tools.md §2. Return a concise pass/fail verdict with the main reason and a one-line summary of the MCP-related content.`
- Expected execution process: orchestrator captures pre-call tripwire, dispatches the MCP-discovery prompt with `--allow-all-tools` so Copilot can introspect its own configuration if needed, then verifies the response mentions MCP and either lists servers or explains the connection mechanism
- Expected signals: `EXIT=0`. Response mentions `MCP` or `Model Context Protocol`. Response either lists connected servers OR explains connection mechanism (e.g. config file, `/config`). Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + a one-line summary of MCP servers listed or the documented connection mechanism
- Pass/fail: PASS if EXIT=0 AND response mentions MCP/Model Context Protocol AND either lists servers or describes connection mechanism AND tripwire diff is empty. FAIL if Copilot denies MCP support, returns no MCP-related content or mutates the project tree

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate Copilot can describe its own documented MCP support".
2. Stay local: this is a direct CLI dispatch with `--allow-all-tools` (allowing Copilot to introspect its own config).
3. Capture a pre-call tripwire.
4. Dispatch the MCP-discovery prompt.
5. Inspect the response for MCP mentions and either server list or connection mechanism, return a one-line verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-016 | MCP support discovery | Confirm Copilot CLI mentions MCP / Model Context Protocol when asked and either lists servers or explains the connection mechanism | `As a cross-AI orchestrator probing Copilot's MCP integration surface, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and ask which MCP servers (if any) are currently connected and what categories of MCP capability the CLI supports per its documented feature surface. Verify the answer either (a) lists currently connected MCP servers or (b) acknowledges MCP support and explains how to connect a server, citing the documented capability from copilot_tools.md §2. Return a concise pass/fail verdict with the main reason and a one-line summary of the MCP-related content.` | 1. `bash: git status --porcelain > /tmp/cp-016-pre.txt` -> 2. `bash: copilot -p "Describe your MCP (Model Context Protocol) support. If any MCP servers are currently connected to your CLI, list them. If none are connected, explain the documented mechanism for connecting an MCP server (e.g. config file path, command). Be specific and cite the documented capability." --allow-all-tools 2>&1 \| tee /tmp/cp-016-out.txt; echo "EXIT=$?"` -> 3. `bash: git status --porcelain > /tmp/cp-016-post.txt && diff /tmp/cp-016-pre.txt /tmp/cp-016-post.txt && grep -ciE '(MCP\|Model Context Protocol)' /tmp/cp-016-out.txt && grep -ciE '(server\|config\|/config\|connect\|extension)' /tmp/cp-016-out.txt` | Step 1: pre-tripwire captured; Step 2: EXIT=0, transcript mentions MCP; Step 3: tripwire diff empty, MCP grep count >= 1, mechanism/server grep count >= 1 | `/tmp/cp-016-out.txt` (transcript) + `/tmp/cp-016-pre.txt` and `/tmp/cp-016-post.txt` (tripwire pair) + grep counts | PASS if EXIT=0 AND MCP grep >= 1 AND mechanism/server grep >= 1 AND tripwire diff empty; FAIL if Copilot denies MCP support, neither mentions MCP nor describes connection mechanism, or mutates project tree | 1. If Copilot denies MCP support, the documented capability may be out of sync with the active CLI version — re-check `copilot --version` against `references/copilot_tools.md` §2; 2. If grep returns 0 for both, refine the prompt to be more direct (e.g. "list MCP servers in JSON"); 3. If tripwire non-empty, audit the prompt for inadvertent write triggers |

### Optional Supplemental Checks

After PASS, if Copilot reports any connected MCP servers, sanity-check by examining `~/.copilot/` (or the documented MCP config location) for matching server entries. A discrepancy between what Copilot reports and what the config file actually contains suggests a stale-cache issue worth a follow-up review.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Unique Copilot Capabilities row "MCP Support" |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/copilot_tools.md` | §2 documents MCP capability. §3 four-way comparison row "MCP Support: Yes (Built-in)" |
| `../../references/cli_reference.md` | §7 INTERACTIVE COMMANDS includes `/config` for CLI configuration |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CP-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/002-mcp-support-discovery.md`
