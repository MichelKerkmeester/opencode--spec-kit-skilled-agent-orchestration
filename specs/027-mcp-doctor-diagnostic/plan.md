---
title: "Implementation Plan: MCP Doctor Diagnostic Command"
description: "Technical plan for building the unified MCP diagnostic shell script that checks all 4 MCP servers across 6 runtimes."
trigger_phrases:
  - "plan"
  - "mcp doctor plan"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: MCP Doctor Diagnostic Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (POSIX-compatible with bashisms) |
| **Framework** | Shell script, no framework |
| **Storage** | None (read-only diagnostic) |
| **Testing** | Manual execution + JSON validation |

### Overview
Build a unified `mcp-doctor.sh` shell script that diagnoses all 4 OpenCode MCP servers across all detected runtimes. Reuses patterns from existing `doctor.sh` (CocoIndex) and `check-native-modules.sh` (Spec Kit Memory) but unifies them into a single entry point with consistent output formatting, `--json` mode, `--fix` mode, and per-server filtering.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-010)
- [ ] Script executes cleanly on dev machine
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-entry shell script + helper library. Function-per-server diagnostic with shared output formatting.

### Key Components
- **mcp-doctor.sh**: Main entry — arg parsing, server dispatch loop, summary output
- **mcp-doctor-lib.sh**: Shared helpers — colors, log_pass/log_warn/log_fail, JSON builders, project root detection

### Data Flow
```
User runs mcp-doctor.sh
  -> Parse flags (--json, --fix, --server, --help)
  -> Detect project root
  -> Check global prerequisites (node, python3)
  -> For each server (or single if --server):
     -> Run diagnostic function
     -> Collect results (pass/warn/fail per check)
     -> If --fix and failures found: run repair
  -> Output summary (human or JSON)
  -> Exit with appropriate code
```

### Diagnostic Functions

| Function | Server | Key Checks |
|----------|--------|------------|
| `diagnose_spec_kit_memory` | Spec Kit Memory | dist/context-server.js, better-sqlite3, node version marker, database dir |
| `diagnose_cocoindex_code` | CocoIndex Code | .venv/bin/ccc binary, ccc --help, .cocoindex_code/ dir, ccc status |
| `diagnose_code_mode` | Code Mode | dist/index.js, .utcp_config.json valid JSON |
| `diagnose_sequential_thinking` | Sequential Thinking | node >= 18, npx package cached/reachable |

### Config Detection

Scans for: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`, `.vscode/mcp.json`

For each found config, checks whether each server's MCP entry is present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create mcp-doctor-lib.sh with shared functions
- [ ] Create mcp-doctor.sh with arg parsing and framework

### Phase 2: Core Implementation
- [ ] Implement all 4 server diagnostic functions
- [ ] Implement config detection and verification
- [ ] Implement --fix auto-repair mode
- [ ] Implement --json output mode

### Phase 3: Verification
- [ ] Test on current system
- [ ] Validate JSON output
- [ ] Verify --fix repairs work
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Run on dev machine, verify output | Terminal |
| JSON validation | Pipe --json to python3 -m json.tool | Python |
| Negative | Rename binary, verify FAIL detection | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js 18+ | External | Green | 3/4 servers cannot be checked |
| Python 3.11+ | External | Green | CocoIndex cannot be checked |
| Existing doctor.sh | Internal | Green | Can call directly |
| Existing check-native-modules.sh | Internal | Green | Can call directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Script causes issues or is not needed
- **Procedure**: Delete `.opencode/scripts/mcp-doctor.sh` and `.opencode/scripts/mcp-doctor-lib.sh`
- No existing files modified, zero rollback risk
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: lib + framework) ──► Phase 2 (Core: diagnostics) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~50 LOC |
| Core Implementation | Medium | ~300 LOC |
| Verification | Low | Manual testing |
| **Total** | | **~350 LOC** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No existing files modified (new files only)

### Rollback Procedure
1. Delete `.opencode/scripts/mcp-doctor.sh`
2. Delete `.opencode/scripts/mcp-doctor-lib.sh`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
