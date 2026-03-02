---
title: "Feature Specification: Refinement Phase 7 — Cross-AI Review Audit [template:level_2/spec.md]"
description: "Comprehensive review of all work in 023-hybrid-rag-fusion-refinement for bugs, misalignments, script location correctness, documentation accuracy, and code standards compliance."
trigger_phrases:
  - "refinement phase 7"
  - "script location"
  - "hybrid rag review"
  - "code standards check"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Refinement Phase 7 — Cross-AI Review Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-02 |
| **Parent** | 023-hybrid-rag-fusion-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 023-hybrid-rag-fusion-refinement program delivered 50,000+ LOC across 17 phases but has not undergone a unified cross-cutting review. Script locations between system-spec-kit/scripts/ and system-spec-kit/mcp_server/ may not be optimal. Summary documents may have drifted from actual code. Code standards alignment with sk-code--opencode has not been verified.

### Purpose
Produce a comprehensive audit identifying script misplacements, documentation inaccuracies, code standards violations, and bugs — then fix all P0/P1 findings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Script location analysis (system-spec-kit monorepo boundaries)
- Summary document verification (new_features, existing_features vs code)
- Code standards review against sk-code--opencode
- Bug detection across phases 010-017
- Cross-AI validation using cli-gemini and cli-codex

### Out of Scope
- New feature implementation
- Performance optimization
- Test coverage expansion (except for bugs found)

### Files to Review

| Area | Path | Check |
|------|------|-------|
| Scripts | `.opencode/skill/system-spec-kit/scripts/` | Location correctness |
| MCP Server | `.opencode/skill/system-spec-kit/mcp_server/` | Boundary violations |
| Shared | `.opencode/skill/system-spec-kit/shared/` | Completeness |
| New Features | `023-*/summary_of_new_features.md` | Accuracy vs code |
| Existing Features | `023-*/summary_of_existing_features.md` | Accuracy vs code |
| Build System | `*/tsconfig.json`, `*/package.json` | Dependency flow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Script location analysis with recommendations | All import paths mapped, misplacements identified |
| REQ-002 | Summary documents verified against code | At least 15 features spot-checked per document |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Code standards review against sk-code--opencode | 20 files sampled across scripts and mcp_server |
| REQ-004 | Phase 017 verification | 35 claimed fixes verified in code |
| REQ-005 | Bug hunt across critical paths | SQL safety, scoring, race conditions checked |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All wave outputs produced with substantive findings
- **SC-002**: P0 findings fixed, P1 findings fixed or tracked
- **SC-003**: Gemini and Codex used for at least 6/10 analysis tasks
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality
- **NFR-Q01**: Each finding cites specific file paths and line references
- **NFR-Q02**: Severity ratings (P0/P1/P2) for all code quality findings

### Coverage
- **NFR-C01**: At least 20 files reviewed for standards compliance
- **NFR-C02**: At least 30 features verified between both summary documents
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 50,000+ LOC across 3 packages, 89 flags, 23 tools |
| Risk | 10/25 | Read-heavy audit, fixes are targeted |
| Research | 15/20 | Deep cross-referencing needed |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
