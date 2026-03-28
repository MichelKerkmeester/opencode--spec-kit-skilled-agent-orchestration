---
title: "Feature Specification: Anchor Enforcement Automation [015-anchor-enforcement-automation/spec]"
description: "This specification addresses systematic gaps in template and anchor compliance within the system-spec-kit framework, implementing automated enforcement to prevent spec documenta..."
trigger_phrases:
  - "feature"
  - "specification"
  - "anchor"
  - "enforcement"
  - "automation"
  - "spec"
  - "015"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Anchor Enforcement Automation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This specification addresses systematic gaps in template and anchor compliance within the system-spec-kit framework, implementing automated enforcement to prevent spec documentation from being created without full template alignment and proper ANCHOR tag structure.

**Key Decisions**: Implement pre-flight validation gates, automate ANCHOR tag generation, enhance speckit agent routing compliance

**Critical Dependencies**: MCP Memory Server validation hooks, speckit agent dispatch protocol, template composition system
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-02-17 |
| **Parent Spec** | 02--system-spec-kit |
| **Complexity Score** | 85/100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec folder documentation can currently be created without full template compliance or proper ANCHOR tag structure. The @speckit agent, designed as the exclusive authority for spec documentation, is underutilized due to weak enforcement of routing rules. This allows documentation to be created manually or through alternative agents, resulting in inconsistent structure, missing ANCHOR tags, and incomplete validation.

### Purpose
Implement automated enforcement mechanisms that make template/anchor non-compliance impossible, ensuring 100% spec documentation flows through @speckit with validated templates and proper ANCHOR tag structure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pre-flight validation gates for spec file creation
- Automated ANCHOR tag generation and validation
- Enhanced routing enforcement for @speckit agent
- Template compliance checking in validate.sh
- Root cause analysis of under-utilization patterns
- Prevention strategy implementation

### Out of Scope
- Retroactive fixes to existing non-compliant specs (separate migration effort)
- Changes to ANCHOR tag format specification (established in spec 129)
- Template content redesign (only enforcement of existing templates)
- Non-spec documentation enforcement (focuses only on spec folders)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Add template hash validation and ANCHOR requirement checks |
| `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts` | Modify | Enhance automatic ANCHOR tag generation for all sections |
| `.opencode/agent/chatgpt/speckit.md` | Modify | Strengthen pre-flight validation gates |
| `.opencode/agent/chatgpt/orchestrate.md` | Modify | Enforce Gate 3 routing to @speckit exclusively |
| `AGENTS.md` | Modify | Clarify Gate 3 enforcement with HARD BLOCK language |
| `.opencode/skill/system-spec-kit/mcp_server/src/routes/memory/save.ts` | Modify | Add ANCHOR validation pre-flight checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh` | Modify | Extend to validate template files require ANChORS |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template Source Validation | All spec documents MUST declare `<!-- SPECKIT_TEMPLATE_SOURCE -->` header |
| REQ-002 | ANCHOR Tag Enforcement | All spec template sections MUST have opening/closing ANCHOR tags |
| REQ-003 | Speckit Routing Lock | All spec file creation MUST route through @speckit agent exclusively |
| REQ-004 | Pre-flight Validation Gate | validate.sh MUST run automatically before file write in spec folders |
| REQ-005 | Root Cause Documentation | Full analysis of why non-compliance currently possible documented in research/research.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Auto-ANCHOR Generation | anchor-generator.ts automatically wraps template sections with ANCHOR tags |
| REQ-007 | Agent Dispatch Logging | All @speckit dispatches logged for compliance audit trail |
| REQ-008 | Template Hash Verification | validate.sh compares spec files against template hashes (informational) |
| REQ-009 | Orchestrator Enforcement | orchestrate.md HARD BLOCKS file writes that bypass @speckit |
| REQ-010 | Documentation Update | AGENTS.md, speckit.md, and system-spec-kit SKILL.md reflect new enforcement |

### P2 - Optional (can defer without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Migration Script | Script to add ANCHOR tags to existing specs (retrospective fix) |
| REQ-012 | Compliance Dashboard | Visual report of spec folder compliance metrics |
| REQ-013 | Pre-commit Hook | Git hook preventing commit of non-compliant spec files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero spec documents created without `SPECKIT_TEMPLATE_SOURCE` header (100% compliance)
- **SC-002**: Zero spec documents missing ANCHOR tags on major sections (100% compliance)
- **SC-003**: Zero spec file writes bypass @speckit agent (100% routing compliance)
- **SC-004**: validate.sh catches 100% of template/anchor violations before file write
- **SC-005**: Comprehensive root cause analysis documented in research/research.md with evidence citations
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP Server Hook Integration | Cannot validate at write-time | Validate at dispatch-time + read-time fallback |
| Risk | Breaking Existing Workflows | Users frustrated by new validation | Clear error messages with remediation guidance |
| Risk | Performance Overhead | Validation adds latency to spec creation | Cache template hashes, optimize ANCHOR parsing |
| Dependency | Agent Dispatch Protocol | Must modify orchestrator routing logic | Test with multiple agent scenarios |
| Risk | Incomplete ANCHOR Coverage | Some sections might not need anchors | Define clear criteria for ANCHOR requirements |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Template validation must complete within 200ms per file
- **NFR-P02**: ANCHOR parsing overhead <50ms for typical memory file

### Security
- **NFR-S01**: Validation scripts must not execute arbitrary code from spec files
- **NFR-S02**: Template hash verification uses cryptographic hash (SHA-256 minimum)

### Reliability
- **NFR-R01**: Validation failures must never block legitimate spec creation (false positive rate <1%)
- **NFR-R02**: ANCHOR generator must produce valid tags 100% of the time
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty spec file: Validation catches missing required sections
- Spec with no memory/: ANCHOR validation skips memory checks, validates spec docs only
- Partial template use: validate.sh detects missing required sections per level

### Error Scenarios
- Template file not found: Validation logs warning, continues with structure checks only
- Corrupted ANCHOR tags: check-anchors.sh reports line number and mismatch details
- Agent dispatch failure: Orchestrator logs error, retries with @speckit, escalates to user if persistent
- Concurrent spec creation: File system locks prevent race conditions on template reads
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 7, LOC: ~400, Systems: 4 (validation, templates, agents, MCP) |
| Risk | 20/25 | Auth: N, API: Y (MCP), Breaking: Y (workflow changes) |
| Research | 18/20 | Root cause analysis, under-utilization patterns, multi-agent coordination |
| Multi-Agent | 13/15 | Workstreams: 3 (validation, routing, documentation) |
| Coordination | 12/15 | Dependencies: MCP server, agent dispatch, template system |
| **Total** | **85/100** | **Level 3+** (governance + multi-agent + breaking changes) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Validation logic has false positives | High | Medium | Extensive test suite with edge cases, user override flag |
| R-002 | Performance degradation on large specs | Medium | Low | Profile validation scripts, cache template data |
| R-003 | Breaking changes disrupt active workflows | High | High | Phased rollout, clear documentation, graceful degradation |
| R-004 | ANCHOR auto-generation conflicts with manual edits | Medium | Medium | Preserve existing ANChORS, only generate for new sections |
| R-005 | Agent routing enforcement too rigid | Medium | Low | Emergency bypass mechanism for critical edge cases |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Automatic ANCHOR Tag Generation (Priority: P0)

**As a** spec documentation author, **I want** ANCHOR tags automatically added to all major sections, **so that** I don't have to manually wrap every section and risk missing tags.

**Acceptance Criteria**:
1. **Given** a spec file created from template, **When** I fill in sections, **Then** all major sections have proper `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` tags
2. **Given** manual section edits, **When** ANCHOR tags already exist, **Then** auto-generation preserves existing tags
3. **Given** a new section added, **When** section matches naming convention, **Then** ANCHOR tags generated automatically

### US-002: Pre-flight Validation Gate (Priority: P0)

**As a** system enforcing spec quality, **I want** validation to run before any spec file is written, **so that** non-compliant documentation never enters the codebase.

**Acceptance Criteria**:
1. **Given** a spec file creation attempt, **When** file content missing required sections, **Then** write is blocked with clear error message
2. **Given** a spec file with mismatched ANCHOR tags, **When** validation runs, **Then** user sees line number and fix guidance
3. **Given** validation failure, **When** user corrects issues, **Then** retry succeeds immediately

### US-003: Speckit Routing Enforcement (Priority: P0)

**As a** orchestrator managing agent dispatch, **I want** spec file writes to ONLY go through @speckit, **so that** template compliance is guaranteed by design.

**Acceptance Criteria**:
1. **Given** a request to create spec documentation, **When** orchestrator evaluates routing, **Then** @speckit is the ONLY option dispatched
2. **Given** @general or @write attempting spec file write, **When** file path is in spec folder, **Then** write is rejected with routing violation error
3. **Given** emergency bypass scenario, **When** user explicitly overrides, **Then** bypass is logged for audit trail
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | System Architect | Pending | TBD |
| Design Review | Agent Framework Lead | Pending | TBD |
| Implementation Review | Validation System Owner | Pending | TBD |
| Launch Approval | Product Owner | Pending | TBD |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [x] Security review completed (low risk, no user data involved)
- [x] OWASP Top 10 addressed (N/A for internal tooling)
- [x] Data protection requirements met (no PII processed)

### Code Compliance
- [ ] Coding standards followed (TypeScript, Bash, Markdown style guides)
- [ ] License compliance verified (MIT, all dependencies compatible)
- [ ] Agent protocol compliance (routing rules, permission boundaries)

### AI Agent Compliance
- [ ] Agent permission boundaries respected (@speckit write-only for spec files)
- [ ] Gate 3 enforcement implemented (HARD BLOCK on bypass attempts)
- [ ] Dispatch protocol compliance (Context Package format, CWB adherence)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Agent Framework Users | Documentation Authors | High | Release notes, migration guide |
| System Architects | Enforcement Design | High | Design review, approval checkpoint |
| Validation System Maintainers | Implementation | High | PR reviews, integration testing |
| Orchestrator Logic Owners | Routing Changes | Medium | API contract review |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-17)
**Initial specification**
- Defined problem: template/anchor non-compliance possible
- Identified root cause: weak speckit routing enforcement
- Scoped solution: pre-flight validation + agent routing locks + auto-ANCHOR generation
- Established P0/P1/P2 requirements
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Should validation be opt-out (SPECKIT_SKIP_VALIDATION=true) or always enforced?
- What constitutes valid reason for emergency bypass of @speckit routing?
- Should ANCHOR tags be required for ALL sections or only major sections (## headings)?
- How to handle legacy specs without ANChORS during transition period?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Findings**: See `research/research.md`

---

<!--
LEVEL 3+ SPEC (~320 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
- Comprehensive ANCHOR tag coverage
-->
