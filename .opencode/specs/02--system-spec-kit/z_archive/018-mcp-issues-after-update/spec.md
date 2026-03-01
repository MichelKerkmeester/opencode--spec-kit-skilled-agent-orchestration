---
title: "Feature Specification: MCP Server Failures After Updates [135-mcp-issues-after-update/spec]"
description: "Users report MCP server failures and errors after major system updates. The working hypothesis is that these failures may be related to the recent node_modules relocation, but t..."
trigger_phrases:
  - "feature"
  - "specification"
  - "mcp"
  - "server"
  - "failures"
  - "spec"
  - "135"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: MCP Server Failures After Updates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-18 |
| **Completed** | 2026-02-18 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Users report MCP server failures and errors after major system updates. The working hypothesis is that these failures may be related to the recent node_modules relocation, but the actual root cause needs investigation. Users currently lack effective debugging guidance in the install guide.

### Purpose
Investigate and identify the root cause of post-update MCP server failures, then update the Spec Kit Memory MCP install guide to provide users with clear debugging and recovery procedures.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigate reported MCP server failure patterns after updates
- Test hypothesis: failures related to node_modules relocation
- Identify actual root cause(s) of failures
- Rewrite/update MCP Spec Kit Memory install guide with debugging procedures
- Add troubleshooting section for post-update recovery
- Include clear error message interpretation guidance

### Out of Scope
- Changes to MCP server implementation code - focusing on documentation and diagnosis only
- Automated update/migration scripts - manual recovery procedures sufficient for now
- Prevention of the underlying issue - immediate goal is user recovery capability

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/install_guides/MCP - Spec Kit Memory.md` | Modified | Rewritten via sk-doc skill - recovery-first approach with troubleshooting sections |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Canonical source backing the install guide |
| `.opencode/install_guides/install_scripts/install-spec-kit-memory.sh` | Modified | Aligned installer script with recovery-first flow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identify root cause of MCP server failures after updates | Clear documentation of what causes failures (node_modules relocation vs other factors) |
| REQ-002 | Test node_modules relocation hypothesis | Evidence showing whether relocation is or is not the primary cause |
| REQ-003 | Update install guide with debugging procedures | Install guide contains step-by-step debugging section for post-update failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document common error messages and meanings | Install guide includes error message reference table |
| REQ-005 | Provide recovery procedures for identified failure modes | Each identified failure mode has documented recovery steps |
| REQ-006 | Add validation steps users can run to verify MCP health | Install guide includes health check commands/procedures |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root cause of post-update MCP failures identified and documented with supporting evidence
- **SC-002**: Install guide updated with troubleshooting section that enables users to self-diagnose and recover from failures
- **SC-003**: All common error scenarios have documented recovery procedures
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 6. ACCEPTANCE SCENARIOS

**Given** a user experiences MCP server failures after a system update
**When** they follow the debugging procedures in the updated install guide
**Then** they can identify the root cause within 10 minutes and proceed to the appropriate recovery steps

**Given** a user's MCP server fails due to node_modules relocation (if confirmed as root cause)
**When** they execute the documented recovery procedure
**Then** the MCP server successfully restarts and processes requests without errors

**Given** a user encounters a specific error message during MCP startup
**When** they reference the error message table in the install guide
**Then** they find the error meaning, root cause, and recovery steps clearly documented

**Given** a user has recovered from an MCP failure
**When** they run the health check validation steps from the install guide
**Then** all validation checks pass and confirm the MCP server is functioning correctly

**Given** a user experiences an edge case error not covered in the main recovery procedures
**When** they review the troubleshooting section
**Then** they find fallback diagnostic steps and an escalation path for unresolved issues
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Multiple root causes possible | Medium - requires comprehensive investigation | Test multiple hypotheses systematically |
| Risk | Unable to reproduce failures locally | High - limits diagnostic capability | Gather detailed error logs from affected users |
| Dependency | Access to user error reports/logs | Medium - needed for pattern analysis | Request logs if not already available |
| Risk | Install guide changes may not cover all scenarios | Medium - users still experiencing issues | Provide escalation path and feedback mechanism |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Debugging procedures should be completable in <10 minutes for common cases
- **NFR-P02**: Health check commands should return results in <5 seconds

### Security
- **NFR-S01**: Debugging procedures must not expose sensitive credentials or tokens
- **NFR-S02**: Log collection guidance should filter out PII and secrets

### Reliability
- **NFR-R01**: Recovery procedures should have 95%+ success rate for identified failure modes
- **NFR-R02**: Install guide should be version-agnostic where possible (work across updates)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

### Data Boundaries
- Partial/incomplete updates: System in mixed state with some components updated
- Fresh install vs upgrade: Different failure modes may apply
- Multiple MCP servers: Only Spec Kit Memory affected vs system-wide issues

### Error Scenarios
- Node/npm version mismatches: Compatibility issues after update
- Corrupted node_modules: Incomplete or failed npm install/update
- Path resolution failures: node_modules location not found
- Permission issues: File access denied after directory moves

### State Transitions
- Mid-update failure: Update process interrupted, system in inconsistent state
- Config file drift: opencode.json or package.json out of sync with actual installation
- Cache invalidation needed: Stale caches pointing to old locations
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Single file modification (install guide), but investigation needed across multiple potential causes |
| Risk | 18/25 | User-facing documentation, incorrect guidance could make problems worse |
| Research | 16/20 | Requires investigation and hypothesis testing, multiple potential root causes |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

### Resolved
- ✅ What specific error messages are users reporting? → Documented in install guide error reference
- ✅ When did node_modules relocation occur? → Investigated via fallback build awareness
- ✅ Do failures occur immediately after update or after first use attempt? → Documented startup failure scenarios

### Remaining
- How many users are affected? (Not critical - recovery procedures now available)
- Edge cases for specific configurations may surface over time (fallback guidance provided)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
