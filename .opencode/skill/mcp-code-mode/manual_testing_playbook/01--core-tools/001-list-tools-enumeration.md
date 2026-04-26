---
title: "CM-001 -- list_tools enumeration"
description: "This scenario validates list_tools enumeration for `CM-001`. It focuses on confirming that `list_tools()` returns the full set of registered external MCP tools using the canonical `manual.manual_tool` namespace pattern."
---

# CM-001 -- list_tools enumeration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-001`.

---

## 1. OVERVIEW

This scenario validates `list_tools()` enumeration for `CM-001`. It focuses on confirming that the native Code Mode tool returns the full set of registered external MCP tools and that every entry follows the `manual.manual_tool` naming pattern enforced by the namespace contract.

### Why This Matters

`list_tools()` is the entry point operators use to discover what is available. If it returns a partial list, returns names in a non-canonical form, or fails entirely, every downstream MCP scenario in this and other playbooks (BDG, CU, CCC) becomes unreliable. The naming-pattern check is also the first signal that the manual-namespace contract (CM-005..CM-007) is in force.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `list_tools()` returns a non-empty array of tool names; every entry contains a `.` separator; at least one entry per configured manual in `.utcp_config.json`.
- Real user request: `"What MCP tools do I have access to right now?"`
- Prompt: `As a manual-testing orchestrator, enumerate all available external MCP tools through Code Mode against the current Code Mode and .utcp_config.json registry. Verify the returned list is non-empty and every entry follows the manual.manual_tool naming pattern. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: call `list_tools()` directly through the Code Mode native tool; do not delegate.
- Expected signals: array length > 0; every entry has at least one `.` character; the set of unique prefixes (everything before the first `.`) matches the set of `name` keys in `.utcp_config.json` `manual_call_templates`.
- Desired user-visible outcome: A short report listing the count of tools, the manual names discovered, and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if array is empty, any entry lacks `.`, or a configured manual is missing from results.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, enumerate all available external MCP tools through Code Mode against the current Code Mode and .utcp_config.json registry. Verify the returned list is non-empty and every entry follows the manual.manual_tool naming pattern. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `list_tools()` — invoke the native Code Mode tool with no arguments
2. `bash: cat .utcp_config.json | jq -r '.manual_call_templates[].name'` — capture the configured manual names for comparison
3. Compare: every name from step 2 should appear as a prefix in at least one entry from step 1

### Expected

- Step 1: returns an array of strings; length > 0
- Step 1: every string contains at least one `.` character (e.g., `clickup.clickup_get_teams`)
- Step 2: returns one or more manual names (one per line)
- Step 3: every step-2 name appears as a prefix in step-1 results

### Evidence

Capture the verbatim response of `list_tools()` (paste truncated to first 30 entries if very long), the verbatim output of the `jq` command, and the comparison verdict per manual.

### Pass / Fail

- **Pass**: All three signals hold — array non-empty, every entry has a `.`, every configured manual is represented at least once.
- **Fail**: Array is empty (no MCP servers loaded), any entry lacks `.` (namespace contract broken), or any configured manual is missing from results (server failed to register).

### Failure Triage

1. If `list_tools()` returns empty: check `cat .utcp_config.json | jq '.'` to confirm the file is valid JSON; check Node version `node --version` (must be >= 18); check for `disabled: true` flags on every manual.
2. If entries lack `.`: this is a Code Mode runtime bug — capture the raw response and escalate.
3. If a configured manual is missing: check Code Mode startup logs for that manual's `npx` command failure; verify the package can be installed (`npx -y <package>@latest --version`); check env-var prefix in `.env` per CM-008.

### Optional Supplemental Checks

- If `list_tools()` is slow (> 2 seconds): note timing in evidence; not a fail but a regression signal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Native tools spec; manual-namespace rule |
| `.utcp_config.json` (project root) | Manual configuration source |
| `.opencode/skill/mcp-code-mode/scripts/validate_config.py` | Config validator (referenced by CM-010) |

---

## 5. SOURCE METADATA

- Group: CORE TOOLS
- Playbook ID: CM-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-tools/001-list-tools-enumeration.md`
