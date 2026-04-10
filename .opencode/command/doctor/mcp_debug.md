---
description: Diagnose and fix MCP server connection issues (5 steps) - runs health checks, investigates failures with install guide knowledge, offers guided repair.
argument-hint: "[--fix] [--server <name>]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Load the YAML workflow file:
>    `.opencode/command/doctor/assets/doctor_mcp_debug.yaml`
> 2. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow.

# MCP Doctor: Debug

Diagnose and repair broken MCP servers. Checks all 4 servers, cross-references install guides for root cause, offers targeted repairs.

---

## 1. PURPOSE

Users face MCP connection failures after updates or version mismatches. This command runs the diagnostic script, investigates each failure using install guide knowledge, and offers guided repair.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — optional flags `[--fix]` `[--server <name>]`
**Outputs:** Diagnostic report + optional repairs + `STATUS=OK|FAIL`

---

## 3. WORKFLOW OVERVIEW (5 STEPS)

| Step | Name | Purpose | Outputs |
|------|------|---------|---------|
| 1 | Diagnose | Run `mcp-doctor.sh --json` | Structured JSON results |
| 2 | Present | Show per-server summary | User chooses: fix all / walk through / stop |
| 3 | Investigate & Fix | Per failure: root cause + repair | Repairs applied |
| 4 | Re-verify | Re-run diagnostics after repair | Confirmation of fixes |
| 5 | Summary | Final report with next steps | STATUS=OK or remaining issues |

---

## 4. INSTRUCTIONS

Load and execute the YAML workflow at:
`.opencode/command/doctor/assets/doctor_mcp_debug.yaml`

The diagnostic script lives at:
`.opencode/command/doctor/scripts/mcp-doctor.sh`

---

## 5. REFERENCE

### Servers Checked

| Server | Runtime | Key Checks |
|--------|---------|------------|
| **Spec Kit Memory** | Node.js | dist build, better-sqlite3, native module version, database |
| **CocoIndex Code** | Python | venv binary, ccc --help, index directory, ccc status |
| **Code Mode** | Node.js | dist build, .utcp_config.json, node_modules |
| **Sequential Thinking** | Node.js (npx) | node >= 18, npx package reachable |

### Config Files Scanned

| File | Runtime |
|------|---------|
| `opencode.json` | OpenCode CLI |
| `.claude/mcp.json` | Claude Code CLI |
| `.codex/config.toml` | Codex CLI |
| `.gemini/settings.json` | Gemini CLI |
| `.vscode/mcp.json` | VS Code / Copilot |

### Install Guides (for root-cause investigation)

| Server | Guide |
|--------|-------|
| Spec Kit Memory | `.opencode/install_guides/MCP - Spec Kit Memory.md` |
| CocoIndex Code | `.opencode/install_guides/MCP - CocoIndex Code.md` |
| Code Mode | `.opencode/install_guides/MCP - Code Mode.md` |
| Sequential Thinking | `.opencode/install_guides/MCP - Sequential Thinking.md` |

---

## 6. EXAMPLES

```
/doctor:mcp_debug                          # Full interactive diagnostic
/doctor:mcp_debug --fix                    # Diagnose + auto-repair failures
/doctor:mcp_debug --server cocoindex_code  # Single server only
```

---

## 7. ERROR HANDLING

| Condition | Action |
|-----------|--------|
| Script not found | `STATUS=FAIL ERROR="mcp-doctor.sh missing"` |
| Node.js missing | WARN — 3/4 servers skipped, CocoIndex still checked |
| Python missing | WARN — CocoIndex skipped, Node-based servers still checked |
| JSON parse error | Fall back to human-readable mode |
| Repair fails | Present manual steps from install guide |

---

## 8. RELATED COMMANDS

| Command | Purpose |
|---------|---------|
| `/doctor:mcp_install` | Fresh install all 4 MCP servers from scratch |
| `/memory:manage health` | Check Spec Kit Memory database health |
