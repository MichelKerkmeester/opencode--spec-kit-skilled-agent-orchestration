---
title: "Feature Specification: MCP Tool Schema Governance Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Deep-review angle 6 audits MCP tool schema strictness, governed-ingest enforcement, scope governance, and canonical tool count alignment. The packet is read-only against target runtime code and writes only this Level 2 audit packet."
trigger_phrases:
  - "045-006-mcp-tool-schema-governance"
  - "schema audit"
  - "governance enforcement review"
  - "tool count canonical"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance"
    last_updated_at: "2026-04-29T23:20:00+02:00"
    last_updated_by: "codex"
    recent_action: "Initialized and completed release-readiness MCP tool schema governance audit"
    next_safe_action: "Plan remediation for active P0/P1 findings in review-report.md"
    blockers:
      - "P0-001 session_health skips schema validation"
    key_files:
      - "review-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:045-006-mcp-tool-schema-governance"
      session_id: "045-006-mcp-tool-schema-governance"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Strict schemas are enabled by default because SPECKIT_STRICT_SCHEMAS must be exactly false to switch schemas to passthrough mode."
      - "The canonical public count is 54 for spec_kit_memory: 50 local descriptors plus 4 imported advisor descriptors."
---
# Feature Specification: MCP Tool Schema Governance Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `032-release-readiness-deep-review-program` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The release-readiness program needs a truth check for the MCP tool schema contract. Every public tool should have one canonical Zod schema, strict mode should reject hallucinated parameters by default, governed ingest should not be bypassable, validation errors should be operator-actionable, and tool counts should not silently inflate through deferred or duplicated registrations.

### Purpose

Produce a severity-classified `review-report.md` for MCP schema governance with file:line evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` for canonical `TOOL_DEFINITIONS`.
- Audit `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` for Zod input schemas and strict-mode behavior.
- Audit `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` for imported advisor schemas.
- Audit `.opencode/skill/system-spec-kit/mcp_server/lib/governance/` for governed-ingest and scope-governance enforcement.
- Audit `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for validation dispatch order.
- Cross-check 042 README refresh, 033 `memory_retention_sweep`, and 034 `advisor_rebuild`.
- Write packet-local docs and the final `review-report.md`.

### Out of Scope

- Implementing runtime remediation for findings.
- Modifying target MCP runtime code, README files, or tests.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/spec.md` | Create | Scope and acceptance criteria for the audit packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/plan.md` | Create | Audit execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/tasks.md` | Create | Completed audit task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/checklist.md` | Create | Verification checklist with evidence. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/implementation-summary.md` | Create | Summary of the audit deliverable. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/review-report.md` | Create | Final 9-section release-readiness review report. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/description.json` | Create | Memory metadata for the packet. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/graph-metadata.json` | Create | Graph metadata and dependencies for the packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a 9-section `review-report.md` with P0/P1/P2 findings. | Report contains executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. |
| REQ-002 | Preserve read-only scope for audited target runtime files. | Only files under this packet folder are authored. |
| REQ-003 | Cite file:line evidence for every active finding. | Each finding includes concrete local file references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Answer schema-specific questions about tool/Zod parity, strict mode, skipped validation, governed ingest, tool count, and deferred tools. | Report section 7 and section 9 answer each question. |
| REQ-005 | Run strict validator after packet docs are written. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

- **SCN-001**: **Given** `TOOL_DEFINITIONS`, **when** the report walks the canonical public tools, **then** any tool missing a Zod schema is named.
- **SCN-002**: **Given** strict schemas are enabled, **when** a hallucinated parameter is passed, **then** all public tools should reject it or be reported as a bypass.
- **SCN-003**: **Given** governed-ingest metadata is present, **when** `memory_save` runs, **then** missing provenance or scope fields should reject before writes.
- **SCN-004**: **Given** public tool counts in docs, **when** the report compares source and documentation, **then** 50 local plus 4 advisor tools remains the canonical `spec_kit_memory` count.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` is complete and severity-classified.
- **SC-002**: The report explicitly answers each user-provided schema and governance question.
- **SC-003**: The packet's strict validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 045 phase parent | Child packet must align to release-readiness program scope. | Use parent path and packet numbering exactly as supplied. |
| Dependency | 042 README refresh | Defines canonical README tool-count source. | Cross-check root README and MCP README count claims. |
| Dependency | 033 retention sweep | Recently added tool must be represented in schemas. | Verify `memory_retention_sweep` in descriptor and Zod registry. |
| Dependency | 034 advisor rebuild | Recently added advisor tool must be represented in schemas. | Verify imported advisor descriptors and Zod schemas. |
| Risk | Hidden schema drift | Public tools can fail closed or bypass strict schemas. | Compare descriptors, schema registry, allowed-parameter map, and dispatch paths. |
| Risk | Governance is conditional | Ingest surfaces may create unscoped records when governance metadata is absent or unsupported. | Distinguish code's current contract from release policy expectations. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit uses targeted source reads and exact regex checks rather than broad runtime mutation.

### Security
- **NFR-S01**: Review governed-ingest enforcement, scope filters, and SQL parameterization.
- **NFR-S02**: Do not mutate runtime databases or target MCP source during the audit.

### Reliability
- **NFR-R01**: Findings distinguish strict-mode behavior, passthrough-mode behavior, and documentation drift.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Unknown parameters under strict mode should be rejected for every public tool.
- Unknown parameters under `SPECKIT_STRICT_SCHEMAS=false` should be identified as passthrough failure mode.
- Missing schemas should fail closed rather than silently dispatching.

### Error Scenarios
- Missing Zod schema: validation should produce an operator-actionable unknown-schema failure.
- Governed ingest missing provenance: write should reject and record governance denial.
- Deferred tools: documentation should exclude them from public count unless wired.

### State Transitions
- New tool addition should update descriptor, Zod schema, allowed parameters, dispatch validation, and docs together.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Six target runtime surfaces plus governance/docs cross-checks. |
| Risk | 21/25 | Schema bypass and governance bypass are release-readiness blockers. |
| Research | 16/20 | Requires source, docs, and recent packet evidence cross-checking. |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for audit completion. Remediation ownership belongs in a follow-up packet.
<!-- /ANCHOR:questions -->
