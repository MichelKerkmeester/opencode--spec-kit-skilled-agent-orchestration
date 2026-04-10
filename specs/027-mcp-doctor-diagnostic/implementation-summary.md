---
title: "Implementation Summary: MCP Doctor Diagnostic Command"
description: "Unified MCP diagnostic script that checks all 4 servers across 6 runtimes with auto-repair support."
trigger_phrases:
  - "implementation summary"
  - "mcp doctor summary"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec** | 027-mcp-doctor-diagnostic |
| **Branch** | `027-mcp-doctor-diagnostic` |
| **Level** | 2 |
| **Date** | 2026-04-10 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A unified `mcp-doctor.sh` shell script that diagnoses all 4 OpenCode MCP servers (Spec Kit Memory, CocoIndex Code, Code Mode, Sequential Thinking) and checks config wiring across all 5 detected runtime config files (OpenCode, Claude Code, Codex, Gemini, VS Code/Copilot).

### Files Created

| File | LOC | Purpose |
|------|-----|---------|
| `.opencode/scripts/mcp-doctor.sh` | ~530 | Main diagnostic script |
| `.opencode/scripts/mcp-doctor-lib.sh` | ~160 | Shared helper library |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Per-Server Diagnostics
- **Spec Kit Memory**: dist exists, better-sqlite3 loads, node version marker matches, database exists, server entry point loads
- **CocoIndex Code**: ccc binary exists + executable, ccc --help works, index directory populated, ccc status healthy
- **Code Mode**: dist/index.js exists, .utcp_config.json valid JSON, .env exists, node_modules installed
- **Sequential Thinking**: node >= 18, npx available, package resolvable

### Features
- `--json` for machine-readable output (valid JSON, validated with python3 -m json.tool)
- `--fix` for auto-repair (rebuild native modules, reinstall deps, rebuild dist)
- `--server <name>` for single-server diagnosis
- `--help` for usage information
- Exit codes: 0=healthy, 1=warnings, 2=failures
- Color-coded output respecting NO_COLOR env var
- Graceful degradation when Node.js or Python missing
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **_log helper pattern** — Used `_log() { if [[ "$JSON_MODE" != true ]]; then "$@"; fi; }` to avoid `set -e` + `&&` short-circuit issue where `[[ false ]] && cmd` returns exit code 1
2. **Read-only by default** — `--fix` never edits config files, only rebuilds/reinstalls dependencies
3. **Config detection uses node -e** — Parsing JSON configs via inline node one-liners rather than requiring jq
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test | Result |
|------|--------|
| Human-readable mode | 34 PASS, 5 WARN, 0 FAIL |
| JSON mode | Valid JSON, validated with python3 -m json.tool |
| --server filter | Only targeted server shown |
| --help flag | Full usage displayed |
| Exit code | 1 (warnings only) — correct |
| Checklist | 8/8 P0, 10/10 P1, 1/1 P2 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **--fix not tested live** — Auto-repair code is implemented but testing requires simulating a broken install
2. **VS Code/Copilot MCP config** — `.vscode/mcp.json` on this machine has no servers configured (reported as INFO, not FAIL)
3. **ccc status warning** — CocoIndex reports a minor issue on `ccc status` (index may need refresh), surfaced as WARN
<!-- /ANCHOR:limitations -->
