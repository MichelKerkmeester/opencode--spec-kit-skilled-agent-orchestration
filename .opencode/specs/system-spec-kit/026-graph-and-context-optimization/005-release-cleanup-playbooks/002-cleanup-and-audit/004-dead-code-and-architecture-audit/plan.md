---
title: "Implementation Plan: 018 / 013 — dead code and architecture audit"
description: "Execution plan for cleaning the active runtime, aligning architecture docs, completing README coverage, and closing the packet with verification evidence."
trigger_phrases: ["013 plan", "dead code audit plan", "architecture audit plan"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
level: 3
parent: "008-cleanup-and-audit"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/004-dead-code-and-architecture-audit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the executed implementation plan"
    next_safe_action: "Review packet"
    key_files: ["plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 018 / 013 — dead code and architecture audit

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, shell, markdown |
| **Framework** | `system-spec-kit` scripts plus MCP runtime |
| **Storage** | Existing packet docs, package docs, and runtime modules |
| **Testing** | TypeScript compiler, npm workspace typechecks, Vitest, packet validator |

### Overview

The plan executed in five workstreams: scan for dead code and removed concepts, clean the runtime, rewrite the package architecture narrative, complete source README coverage and the legacy 006 resource map, then rerun the full verification set required for packet closeout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Runtime scope identified
- [x] Shared docs to update identified
- [x] Verification commands known

### Definition of Done

- [x] Dead-code compiler sweeps pass in both workspaces
- [x] Workspace typechecks pass
- [x] Affected tests pass
- [x] Packet validator passes in strict mode
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical runtime cleanup followed by documentation alignment.

### Key Components

- `mcp_server/handlers/` cleanup for handler entrypoints
- `mcp_server/lib/` cleanup for runtime helpers and storage-adjacent modules
- `scripts/core/`, `scripts/loaders/`, and `scripts/extractors/` cleanup for the active save path
- Package architecture document and per-directory README coverage
- Parent resource map and packet-local closeout docs

### Data Flow

Audit commands identify dead symbols and removed concept branches, cleanup edits remove them, architecture and README updates document the surviving runtime, then verification commands confirm the cleaned tree still behaves correctly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the phase packet, package docs, and representative runtime modules
- [x] Run dead-code, dead-concept, console, cycle, and boundary scans

### Phase 2: Core Implementation
- [x] Remove dead imports, dead locals, and dead helper paths
- [x] Replace raw runtime `console.log` usage in the active save pipeline
- [x] Rewrite the package architecture document
- [x] Create missing source READMEs and refresh the legacy 006 resource map

### Phase 3: Verification
- [x] Run workspace typechecks
- [x] Run targeted runtime and scripts Vitest batches
- [x] Run strict packet validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Unused symbols and dead concept greps | `tsc`, `rg` |
| Runtime | Handler cycles and architecture boundaries | package scripts |
| Behavioral | Affected runtime and scripts tests | Vitest |
| Documentation | Packet integrity and template compliance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server` workspace | Internal | Green | Runtime cleanup cannot be verified |
| `scripts` workspace | Internal | Green | Save-path cleanup cannot be verified |
| Package architecture document | Internal | Green | Architecture alignment cannot close |
| Legacy 006 resource map | Internal | Green | Legacy-006 ownership remains stale |
| Packet validator | Internal | Green | Phase cannot close cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cleanup edits break typecheck, tests, or validator compliance.
- **Procedure**:
1. Restore the smallest failing module behavior.
2. Re-run the affected verification command.
3. Keep packet docs honest about what remains unresolved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 45 minutes |
| Core Implementation | High | 3 hours |
| Verification | Medium | 90 minutes |
| **Total** | | **5 hours 15 minutes** |
<!-- /ANCHOR:effort -->
