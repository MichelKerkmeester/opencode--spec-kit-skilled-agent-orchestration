---
title: "Feature Specification: MCP Doctor Diagnostic Command"
description: "Users face MCP connection failures after updates — no unified way to diagnose and fix all 4 MCP servers across 6 runtimes."
trigger_phrases:
  - "mcp doctor"
  - "mcp diagnostic"
  - "mcp not connecting"
  - "mcp debug"
  - "fix mcp"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: MCP Doctor Diagnostic Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-04-10 |
| **Branch** | `027-mcp-doctor-diagnostic` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Users experience MCP server connection failures after installing or updating OpenCode components. The 4 MCP servers (Spec Kit Memory, CocoIndex Code, Code Mode, Sequential Thinking) each have different runtimes (Node.js, Python), different config formats per CLI (opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json, .vscode/mcp.json), and different failure modes. There is no unified diagnostic tool — users must manually check each server's binary, dependencies, config wiring, and process health one by one.

### Purpose
Create a single `mcp-doctor.sh` command that diagnoses all 4 MCP servers, detects common failure patterns (missing binaries, stale builds, native module mismatches, broken config wiring, missing env vars), reports a clear status per server, and offers auto-repair actions where safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Single shell script: `.opencode/scripts/mcp-doctor.sh`
- Diagnose all 4 MCP servers: Spec Kit Memory, CocoIndex Code, Code Mode, Sequential Thinking
- Detect the active runtime(s) and check their config files
- Check: binary exists, dependencies installed, build artifacts fresh, native modules match, config JSON valid, env vars present
- Human-readable output with PASS/FAIL/WARN per check
- `--json` flag for machine-readable output
- `--fix` flag for safe auto-repair (rebuild native modules, npm install, pip install, etc.)
- `--server <name>` flag to diagnose a single server
- Exit codes: 0 = all pass, 1 = warnings only, 2 = failures detected

### Out of Scope
- GUI or web interface — CLI only
- Modifying user's MCP config files (read-only diagnosis of config, no writes)
- Supporting non-repo MCP servers (only the 4 shipped with OpenCode)
- Windows native support (WSL is acceptable)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/mcp-doctor.sh` | Create | Main diagnostic script |
| `.opencode/scripts/mcp-doctor-lib.sh` | Create | Shared helper functions (colors, JSON output, logging) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Check Spec Kit Memory: dist/context-server.js exists, better-sqlite3 loads, node version match | `mcp-doctor.sh` reports PASS/FAIL for each sub-check |
| REQ-002 | Check CocoIndex Code: .venv/bin/ccc exists, ccc --help succeeds, .cocoindex_code/ index exists | `mcp-doctor.sh` reports PASS/FAIL for each sub-check |
| REQ-003 | Check Code Mode: dist/index.js exists, .utcp_config.json valid | `mcp-doctor.sh` reports PASS/FAIL for each sub-check |
| REQ-004 | Check Sequential Thinking: node >= 18, npx can reach package | `mcp-doctor.sh` reports PASS/FAIL for each sub-check |
| REQ-005 | Detect active runtime config files and verify MCP wiring present | Script finds and checks opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json, .vscode/mcp.json |
| REQ-006 | Clear human-readable output with color-coded PASS/WARN/FAIL | Running without flags shows formatted diagnostic report |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `--json` flag outputs machine-readable JSON | Valid JSON with status per server |
| REQ-008 | `--fix` flag runs safe auto-repair actions | Rebuilds native modules, reinstalls deps, rebuilds dist |
| REQ-009 | `--server <name>` flag diagnoses single server | Only runs checks for specified server |
| REQ-010 | Exit codes: 0=pass, 1=warnings, 2=failures | Script exits with correct code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running `bash .opencode/scripts/mcp-doctor.sh` on a healthy system exits 0 with all PASS
- **SC-002**: Running on a system with a broken MCP (e.g., missing build) exits 2 and identifies the issue
- **SC-003**: Running with `--fix` on a system with stale native modules rebuilds them and re-checks pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Python 3.11+ for CocoIndex checks | Check may fail if Python missing | Report as SKIP with install instructions |
| Dependency | Node.js 18+ for Spec Kit Memory / Code Mode / Sequential Thinking | Most checks fail | Report as FAIL with install instructions |
| Risk | `--fix` could break a working install | Medium | Only run well-known repair commands (npm install, npm run build, rebuild-native-modules.sh) |
| Risk | Config file formats differ across runtimes | Low | Use simple JSON/TOML parsing with node/python |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full diagnostic completes in <30 seconds
- **NFR-P02**: Single-server check completes in <10 seconds

### Security
- **NFR-S01**: Script is read-only by default; `--fix` requires explicit flag
- **NFR-S02**: Never expose API keys or secrets in output

### Reliability
- **NFR-R01**: Script must work on macOS and Linux
- **NFR-R02**: Graceful degradation — if one check fails, continue with remaining
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing config file: Report as INFO (runtime not configured), not FAIL
- Empty .cocoindex_code/ directory: Report as WARN (index not built)
- Missing .venv entirely: Report as FAIL with install command

### Error Scenarios
- Node.js not installed: Report FAIL for Node-based servers, SKIP checks gracefully
- Python not installed: Report FAIL for CocoIndex, SKIP gracefully
- Corrupted SQLite database: Detect via node probe, suggest rebuild

### State Transitions
- Running during active MCP session: Read-only checks are safe, `--fix` warns about restart needed
- Partial install (some servers present, others not): Report per-server independently
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 2 files, ~300-400 LOC shell, 4 servers x 6 configs |
| Risk | 8/25 | Read-only by default, --fix is bounded |
| Research | 5/20 | Install guides already document all checks |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — all 4 install guides provide sufficient diagnostic patterns
<!-- /ANCHOR:questions -->
