---
title: "Implementation Plan: MCP Tool Schema Governance Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Plan for a read-only release-readiness audit of MCP tool schema strictness, governed-ingest enforcement, and canonical tool count alignment."
trigger_phrases:
  - "045-006-mcp-tool-schema-governance"
  - "schema audit"
  - "governance enforcement review"
  - "tool count canonical"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/006-mcp-tool-schema-governance"
    last_updated_at: "2026-04-29T23:20:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed audit plan execution"
    next_safe_action: "Use review-report.md for remediation planning"
    blockers:
      - "P0-001 session_health skips schema validation"
    key_files:
      - "plan.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-006-mcp-tool-schema-governance"
      session_id: "045-006-mcp-tool-schema-governance"
      parent_session_id: "045-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: MCP Tool Schema Governance Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, JSON |
| **Framework** | MCP server runtime, Zod schemas, SQLite-backed memory store |
| **Storage** | No runtime storage mutation; packet docs only |
| **Testing** | Static audit plus strict spec validator |

### Overview

This plan audits descriptor/schema parity, strict-mode behavior, dispatch validation, governed-ingest enforcement, and canonical tool counts. The work is intentionally read-only against target runtime files and produces a packet-local 9-section review report.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User supplied exact packet folder and read-only target scope.
- [x] Target files and schema-specific questions documented.
- [x] Relevant skills selected: `sk-deep-review` and `system-spec-kit`.

### Definition of Done
- [x] All acceptance criteria met.
- [x] `review-report.md` contains P0/P1/P2 findings with file:line evidence.
- [x] Strict validator passes for the packet folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only release-readiness audit packet.

### Key Components
- **Descriptor registry**: `tool-schemas.ts` defines the canonical public MCP tool list and imports advisor tool descriptors.
- **Input schema registry**: `tool-input-schemas.ts` defines Zod validation and allowed-parameter error metadata.
- **Dispatch layer**: `context-server.ts` receives raw tool calls; `tools/index.ts` and module dispatchers apply validation.
- **Governance layer**: `scope-governance.ts` and memory ingest/save handlers define when provenance and scope are required.
- **Documentation count surfaces**: root README, MCP README, schema README, and `opencode.json`.

### Data Flow

MCP calls enter `context-server.ts`, run length checks and pre-dispatch session/auto-surface logic, then dispatch to tool modules. Tool modules either validate centrally in `tools/index.ts` or validate inside feature-specific dispatch modules before calling handlers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope and Evidence Setup
- [x] Confirm packet folder and read-only target surface.
- [x] Read relevant templates and sibling 045 packet format.
- [x] Gather descriptor, schema, dispatch, governance, and documentation evidence.

### Phase 2: Audit Analysis
- [x] Compare `TOOL_DEFINITIONS` against `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS`.
- [x] Trace strict-mode behavior and passthrough failure mode.
- [x] Trace dispatch paths for validation skips.
- [x] Trace governed-ingest enforcement across `memory_save`, `memory_index_scan`, and `memory_ingest_start`.
- [x] Cross-check 033, 034, and 042 packet evidence.

### Phase 3: Packet Authoring and Verification
- [x] Create Level 2 packet docs.
- [x] Write the 9-section `review-report.md`.
- [x] Run strict validator and fix packet doc issues if needed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static parity | Tool descriptors versus schema registry and allowed-parameter map | `rg`, direct file reads |
| Dispatch trace | Validation paths and skips | Source inspection |
| Governance trace | Required provenance/scope fields and SQL safety | Source inspection |
| Documentation trace | README and `opencode.json` count claims | Source inspection |
| Packet validation | Level 2 docs and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 045 phase parent | Internal spec | Green | Defines release-readiness packet structure. |
| 042 README refresh | Internal spec | Green | Defines canonical 54/63 count wording. |
| 033 memory retention sweep | Internal spec | Green | Confirms recent tool was added to descriptor/schema surfaces. |
| 034 advisor rebuild | Internal spec | Green | Confirms recent advisor tool imported into descriptor/schema surfaces. |
| Strict validator | Internal script | Green | Required before completion claim. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet docs are placed outside the requested path or strict validator fails.
- **Procedure**: Patch only packet-local docs until validator passes. Do not touch target runtime code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scope and Evidence -> Audit Analysis -> Packet Authoring -> Strict Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scope and Evidence | User prompt | Audit Analysis |
| Audit Analysis | Scope and Evidence | Packet Authoring |
| Packet Authoring | Audit Analysis | Strict Validation |
| Strict Validation | Packet Authoring | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scope and Evidence | Medium | Completed |
| Audit Analysis | High | Completed |
| Packet Authoring | Medium | Completed |
| Verification | Low | Completed |
| **Total** | | **Completed in-session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No deployment or runtime mutation planned.
- [x] Target code read-only constraint documented.
- [x] Packet-local path confirmed.

### Rollback Procedure
1. Patch packet docs if validation identifies a formatting or metadata defect.
2. Re-run strict validator.
3. Leave target runtime code unchanged.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
