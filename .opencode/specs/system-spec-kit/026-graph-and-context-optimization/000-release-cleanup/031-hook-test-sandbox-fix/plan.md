---
title: "Plan: Hook Test Sandbox Fix"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Implementation plan for sandbox-aware runtime hook tests and corrected findings."
trigger_phrases:
  - "031-hook-test-sandbox-fix"
  - "hook test methodology"
  - "sandbox detection"
  - "BLOCKED_BY_TEST_SANDBOX"
  - "operator-run-outside-sandbox"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix"
    last_updated_at: "2026-04-29T21:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned runner split"
    next_safe_action: "Verify build and validator"
    blockers: []
    completion_pct: 95
---
# Plan: Hook Test Sandbox Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, JSON |
| **Framework** | Node.js runner scripts |
| **Storage** | JSONL run output |
| **Testing** | Node TS loader, TypeScript build, strict spec validator |

### Overview

The implementation splits deterministic direct hook/plugin smokes from live CLI
invocations. Sandbox detection runs once in the orchestrator and prevents invalid
live CLI calls while preserving direct smoke coverage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Historical evidence reviewed. [EVIDENCE: `../030-hook-plugin-per-runtime-testing/results/*.jsonl`]
- [x] Constraints documented. [EVIDENCE: `spec.md`]
- [x] Operator live mode identified. [EVIDENCE: `methodology-correction.md`]

### Definition of Done
- [x] Sandbox mode reports direct-smoke pass cells. [EVIDENCE: runner output]
- [x] Sandbox mode reports live-cli `SKIPPED_SANDBOX` cells. [EVIDENCE: runner output]
- [x] Prior findings amended. [EVIDENCE: `../030-hook-plugin-per-runtime-testing/findings.md`]
- [x] Build and strict validation pass. [EVIDENCE: command outputs]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared utility plus per-runtime adapters.

### Key Components

- **Shared detection**: `detectSandbox()` centralizes sandbox checks.
- **Orchestrator**: passes one detection result to each runtime adapter.
- **Runtime adapters**: emit one direct-smoke cell and one live-cli cell.
- **Findings amendment**: corrects classification without deleting history.

### Data Flow

`run-all-runtime-hooks.ts` detects sandbox state, dispatches adapters, writes
JSONL output under `run-output/latest`, and prints status counts plus verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Read prior findings and result JSONL evidence.
- Confirm direct smokes passed and live failures map to sandbox-blocked state.

### Phase 2: Implementation

- Add shared sandbox detection and `SKIPPED_SANDBOX`.
- Split each runtime adapter into direct-smoke and live-cli cells.
- Add package script and fix repo-root resolution for symlinked specs.

### Phase 3: Verification

- Run sandboxed hook test script.
- Run MCP server build.
- Run strict validator for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Expected |
|------|---------|----------|
| Sandboxed runner | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` | 5 PASS, 5 SKIPPED_SANDBOX |
| Build | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` | exit 0 |
| Strict validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix --strict` | exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Use | Status |
|------------|-----|--------|
| Prior runtime hook runner packet | Source runner and findings files | Available |
| Local TS loader from system-spec-kit scripts | Runs packet-local TypeScript without network fetch | Available |
| MCP server TypeScript build | Build verification | Available |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the runner methodology edits and 044 amendment if sandbox detection causes
incorrect skips in a normal shell. Historical prior JSONL files remain available
because the new runner writes to `run-output/latest`.
<!-- /ANCHOR:rollback -->

