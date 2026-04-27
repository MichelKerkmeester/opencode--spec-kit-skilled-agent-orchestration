---
description: Install or reinstall all 4 MCP servers from scratch (6 steps) - reads install guides, checks system reality, installs dependencies, builds, configures, and verifies.
argument-hint: "[--server <name>] [--runtime <name>]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Load the YAML workflow file:
>    `.opencode/command/doctor/assets/doctor_mcp_install.yaml`
> 2. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow.

# MCP Doctor: Install

Fresh install (or reinstall) all 4 MCP servers based on their install guides and the active system state.

---

## 1. PURPOSE

Provides a guided, step-by-step installation of all OpenCode MCP servers. Reads each server's install guide, checks what's already present on the system, and performs only the necessary install/build/configure steps. Handles the case where old installs conflict with new versions.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — optional flags `[--server <name>]` `[--runtime <name>]`
**Outputs:** All requested MCP servers installed, built, and verified + `STATUS=OK|FAIL`

---

## 3. WORKFLOW OVERVIEW (6 STEPS)

| Step | Name | Purpose | Outputs |
|------|------|---------|---------|
| 1 | Preflight | Check prerequisites (Node.js 18+, Python 3.11+, npm, npx) | prerequisite_report |
| 2 | Assess | For each server, check current state vs expected state | gap_analysis per server |
| 3 | Install | Run install scripts or manual steps per server | dependencies installed |
| 4 | Configure | Verify/create MCP config entries in active runtime configs | config wiring confirmed |
| 5 | Verify | Run `mcp-doctor.sh --json` to confirm health | all checks PASS |
| 6 | Summary | Report what was installed, what was skipped, next steps | STATUS=OK or issues |

---

## 4. INSTRUCTIONS

### Step 1: Preflight

Check system prerequisites. **STOP if blocking prerequisites are missing.**

```bash
node --version    # Must be v18+
python3 --version # Must be 3.11+ (for the spec-kit CocoIndex fork at .opencode/skill/mcp-coco-index/; upstream cocoindex-code may have different Python bounds)
npm --version
npx --version
```

Report which servers can be installed based on available prerequisites.

### Step 2: Assess Current State

For each server (or single server if `--server` provided), read the install guide and check what exists:

| Server | Install Guide | Key Checks |
|--------|---------------|------------|
| **Spec Kit Memory** | `.opencode/install_guides/MCP - Spec Kit Memory.md` | `mcp_server/dist/context-server.js`, `node_modules/better-sqlite3`, `.node-version-marker` |
| **CocoIndex Code** | `.opencode/install_guides/MCP - CocoIndex Code.md` | `.venv/bin/ccc`, `.cocoindex_code/` index dir |
| **Code Mode** | `.opencode/install_guides/MCP - Code Mode.md` | `mcp_server/dist/index.js`, `.utcp_config.json` |
| **Sequential Thinking** | `.opencode/install_guides/MCP - Sequential Thinking.md` | npx package cached |

For each: report `INSTALLED`, `STALE` (exists but outdated/broken), or `MISSING`.

Present assessment and ask:
```
A) Install/reinstall all that need it
B) Walk through each server interactively
C) Install only missing servers (skip STALE)
```

### Step 3: Install Per Server

Execute in order. For each server, follow the install guide's Phase 2 and Phase 3 steps:

**Spec Kit Memory:**
```bash
cd .opencode/skill/system-spec-kit
npm install
npm run build
# If native module issues:
bash scripts/setup/rebuild-native-modules.sh
```

**CocoIndex Code:**
```bash
bash .opencode/skill/mcp-coco-index/scripts/install.sh
# Then initialize index:
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc init
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc index
```

**Code Mode:**
```bash
cd .opencode/skill/mcp-code-mode/mcp_server
npm install
npm run build
```

**Sequential Thinking:**
```bash
# Pre-cache the npx package
npx -y @modelcontextprotocol/server-sequential-thinking --help
```

After each install, run the relevant subset of `mcp-doctor.sh` to confirm:
```bash
bash .opencode/command/doctor/scripts/mcp-doctor.sh --server <name>
```

### Step 4: Configure Runtime Wiring

Check which runtime config files exist and verify MCP entries are present:

| Config File | Format | Servers Expected |
|-------------|--------|-----------------|
| `opencode.json` | `mcp.{server}` | All 4 |
| `.claude/mcp.json` | `mcpServers.{server}` | All 4 |
| `.codex/config.toml` | `[mcp_servers.{server}]` | All 4 |
| `.gemini/settings.json` | `mcpServers.{server}` | All 4 |
| `.vscode/mcp.json` | `mcpServers.{server}` | All 4 |

For each config that exists: read it, check if all installed servers have entries.
If entries are missing: read the install guide's Configuration section (Phase 4) and present the required config snippet to add. Ask user to confirm before editing.

### Step 5: Verify

Run full diagnostic:
```bash
bash .opencode/command/doctor/scripts/mcp-doctor.sh --json
```

Parse results. All servers should show PASS. If any FAIL, report details and suggest `mcp_doctor:debug` for investigation.

### Step 6: Summary

Report final state:

```
## MCP Install — Final Report

| Server | Status | Action Taken |
|--------|--------|--------------|
| Spec Kit Memory | PASS | Rebuilt native modules |
| CocoIndex Code | PASS | Fresh install + index |
| Code Mode | PASS | Already installed (skipped) |
| Sequential Thinking | PASS | Pre-cached npx package |

Config wiring: 4/5 runtimes configured
Next: restart your AI client to pick up MCP servers

STATUS=OK
```

---

## 5. FAILURE RECOVERY

| Failure Type | Recovery Action |
|--------------|----------------|
| npm install fails | Check Node.js version, clear npm cache, retry |
| Python venv fails | Check Python 3.11+, remove old .venv, retry |
| Native module mismatch | Run `rebuild-native-modules.sh` |
| Build fails | Try `npx tsc --build --noCheck --force` as fallback |
| Config syntax error | Show the error location, offer manual edit |

---

## 6. EXAMPLES

```
/doctor:mcp_install                         # Install all 4 servers
/doctor:mcp_install --server cocoindex_code # Install only CocoIndex
/doctor:mcp_install --runtime claude        # Only configure for Claude Code
```

---

## 7. ERROR HANDLING

| Condition | Action |
|-----------|--------|
| Node.js < 18 | `STATUS=FAIL ERROR="Node.js 18+ required"` |
| Python < 3.11 | WARN — CocoIndex skipped, others proceed |
| Install script missing | `STATUS=FAIL ERROR="Install script not found at expected path"` |
| Config file not writable | Show snippet, ask user to add manually |

---

## 8. RELATED COMMANDS

| Command | Purpose |
|---------|---------|
| `/doctor:mcp_debug` | Diagnose and fix existing MCP issues |
| `/memory:manage health` | Check Spec Kit Memory database health |
