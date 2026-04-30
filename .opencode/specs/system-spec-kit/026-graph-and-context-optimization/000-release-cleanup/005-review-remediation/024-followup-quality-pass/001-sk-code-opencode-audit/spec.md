---
title: "Feature Specification: 037/001 sk-code-opencode Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Audit newly-created and modified code from packets 033, 034, and 036 against sk-code-opencode standards. Apply minimal in-packet fixes for code violations and record standards gaps for follow-up."
trigger_phrases:
  - "037-001-sk-code-opencode-audit"
  - "sk-code-opencode audit"
  - "audit 033 034 036"
  - "standards alignment audit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - "audit-findings.md"
      - ".opencode/skill/system-spec-kit/mcp_server/"
    session_dedup:
      fingerprint: "sha256:037001skcodeopencodeaudit000000000000000000000000000000000000"
      session_id: "037-001-sk-code-opencode-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 037/001 sk-code-opencode Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Parent Spec** | ../spec.md |
| **Successor** | ../002-feature-catalog-trio/spec.md |
| **Parent Spec** | ../spec.md |
| **Branch** | `main` |
| **Parent** | `024-followup-quality-pass` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 033, 034, and 036 added retention-sweep, half-auto advisor, hook freshness, and matrix-runner code. The new and modified code needed a standards pass against sk-code-opencode before the larger 037 quality phase could continue.

### Purpose
Produce a line-cited audit, apply minimal code fixes for confirmed violations, and leave skill-standard gaps as follow-up findings rather than modifying sk-code-opencode in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit TypeScript, JSON, README, and matrix prompt-template files changed by packets 033, 034, and 036.
- Apply minimal standards fixes in MCP server code and tests.
- Write `audit-findings.md` with PASS, fix-applied, and skill-gap categories.
- Verify strict validator, build, and targeted vitest run.

### Out of Scope
- Modifying `.opencode/skill/sk-code-opencode/` files - read-only in this packet.
- Refactoring pre-existing code outside the packet changes.
- Running the full 036 matrix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/.../001-sk-code-opencode-audit/*.md` | Create | Level 2 packet docs and audit report |
| `specs/.../001-sk-code-opencode-audit/*.json` | Create | Packet metadata and graph metadata |
| `.opencode/skill/system-spec-kit/mcp_server/**/*.ts` | Modify | Minimal standards fixes found during audit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit packet 033/034/036 files | `audit-findings.md` lists per-file results with file:line evidence |
| REQ-002 | Fix confirmed code-standard violations | Build and targeted tests pass after edits |
| REQ-003 | Preserve sk-code-opencode as read-only | Skill updates appear only as proposed follow-ups |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Create Level 2 packet structure | Strict validator exits 0 for this child packet |
| REQ-005 | Include 036 when present | 036 commit was found and matrix runner files were audited |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `audit-findings.md` records every audited file.
- **SC-002**: All fixed violations are minimal standards alignment edits.
- **SC-003**: `npm run build` passes in `mcp_server`.
- **SC-004**: `npx vitest run memory-retention-sweep advisor-rebuild hooks-codex-freshness` passes.

### Acceptance Scenarios

- **SCN-001**: **Given** packet 036 is present, when the audit scope is built, then matrix runner files are included.
- **SCN-002**: **Given** a TypeScript import uses type-only symbols, when the file is fixed, then type imports are separated and ordered last.
- **SCN-003**: **Given** a new test file lacks a module header, when the audit fixes it, then the file starts with a TypeScript module header.
- **SCN-004**: **Given** a pattern is missing from sk-code-opencode, when the audit reports it, then the skill-gap section proposes a follow-up without editing the skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 036 commit | Audit scope depends on merge state | Commit `999c8ea` was present and included |
| Risk | Standards ambiguity for JSON/template/CLI files | False-positive fixes in assets | Recorded as skill-gap follow-ups instead |
| Risk | Touching broad legacy files | Scope drift | Limited edits to import ordering and packet-added surfaces |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit fixes must not change runtime behavior or add dependencies.

### Security
- **NFR-S01**: No hardcoded secrets or path-safety regressions introduced.

### Reliability
- **NFR-R01**: Build and targeted tests must pass after all fixes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty 036 scope: Would be documented as deferred; not applicable because 036 is merged.
- Untracked helper: `tests/matrix-adapter-test-utils.ts` was present and imported by 036 tests, so it was audited as a worktree support file.

### Error Scenarios
- Standards ambiguity: Captured in skill-gap findings instead of changing skill files.
- Verification failure: Would block completion until fixed.

### State Transitions
- Planned to Complete: Allowed after audit report, strict validator, build, and tests pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 51 files audited, limited code edits |
| Risk | 12/25 | TypeScript standards edits only |
| Research | 12/20 | Required sk-code-opencode and packet diff reads |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
