---
title: "Feature Specification: 037/004 sk-doc Template Alignment"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Audit markdown and text documents touched by packets 031 through 036 against sk-doc template, frontmatter, anchor, README and DQI rules. Apply only doc-safe fixes inside the packet scope and record deferred raw prompt-template cases."
trigger_phrases:
  - "037-004-sk-doc-template-alignment"
  - "sk-doc audit"
  - "template alignment 031-036"
  - "DQI compliance"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - "audit-target-list.md"
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-004-sk-doc-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 037/004 sk-doc Template Alignment

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
| **Successor** | ../005-stress-test-folder-migration/spec.md |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../003-testing-playbook-trio/spec.md |
| **Parent Spec** | ../spec.md |
| **Branch** | `main` |
| **Parent** | `024-followup-quality-pass` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 031 through 036 changed operator documentation, runtime references, matrix-runner README files, matrix prompt templates and packet-local spec docs. Those documents needed a sk-doc template pass so README anchors, reference frontmatter, section anchors and DQI-sensitive structure stayed aligned before later quality packets built on them.

### Purpose
Produce an auditable target list, fix confirmed sk-doc violations in packet scope and document deferred cases where applying a README or asset template would change a raw prompt payload.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Markdown and text files changed by commits matching `026/031` through `026/036`.
- README TOC anchor fixes, missing README TOCs, reference frontmatter and balanced anchor markers.
- `audit-target-list.md` and `audit-findings.md` at this packet root.
- Strict validation for this Level 2 packet and the 031 through 036 spec folders.

### Out of Scope
- Code changes.
- Editing `.opencode/skill/sk-doc/` standards or templates.
- Fixing unrelated 051, 052 or 037/001 drift picked up by the broad raw range command.
- Rewriting raw matrix prompt templates into README-style documents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/.../004-sk-doc-template-alignment/*.md` | Create | Level 2 packet docs and audit artifacts |
| `specs/.../004-sk-doc-template-alignment/*.json` | Create | Packet metadata and graph metadata |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Modify | README TOC anchor and metadata alignment |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | README TOC anchor and metadata alignment |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/*/README.md` | Modify | README TOC, anchors and metadata alignment |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md` | Modify | README structure, TOC and anchors |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Modify | Reference frontmatter, section numbering and anchors |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modify | Reference importance tier metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Discover target docs | `audit-target-list.md` records the packet-filtered 031 through 036 markdown/text scope |
| REQ-002 | Audit every target | `audit-findings.md` has PASS, FIX_APPLIED or DEFERRED for each target |
| REQ-003 | Keep sk-doc read-only | No files under `.opencode/skill/sk-doc/` are modified |
| REQ-004 | Preserve doc-only scope | No non-document source files are changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fix confirmed template violations | README and reference validator failures are resolved where fixes do not alter prompt payloads |
| REQ-006 | Record intentional deferrals | Raw matrix prompt-template assets and governance-template exceptions are documented with rationale |
| REQ-007 | Verify packet structure | Strict validator exits 0 for this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The active audit scope contains only docs touched by commits 031 through 036.
- **SC-002**: All edited README and reference docs pass `validate_document.py` with the applicable type.
- **SC-003**: Anchor markers and fenced code blocks are balanced across the active target list.
- **SC-004**: Strict validator exits 0 for this packet and the 031 through 036 packet folders.

### Acceptance Scenarios

- **SCN-001**: **Given** a README has single-dash TOC anchors, **when** the validator offers a safe fix, **then** the anchor changes to the double-dash form.
- **SCN-002**: **Given** a README lacks a TOC, **when** the file is README-shaped, **then** the missing TOC and anchors are added.
- **SCN-003**: **Given** a raw matrix prompt template validates as a generic asset, **when** README-style sections would change the prompt payload, **then** the finding is DEFERRED with rationale.
- **SCN-004**: **Given** a governance file is misclassified as a README, **when** the drift existed before packets 031 through 036, **then** the finding is DEFERRED instead of rewritten.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Git history for 031 through 036 | Scope could include unrelated commits if using the broad range alone | Used commit-specific changed-file discovery and documented the raw range caveat |
| Risk | Prompt template mutation | Adding README sections would alter CLI matrix prompts | Deferred raw prompt-template assets |
| Risk | Governance docs misclassified as README | Validator would demand README-only sections | Treated `AGENTS.md` as governance template, not README |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit work must not add runtime dependencies or change command behavior.

### Security
- **NFR-S01**: No secrets or policy weakening in documentation edits.

### Reliability
- **NFR-R01**: Validator commands must be rerun after edits.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Raw range discovery returned unrelated docs after 036. The active audit scope uses commits matching 031 through 036.
- Prompt-template `.md` files are executable prompt payloads, not README pages.

### Error Scenarios
- If a validator-safe README fix affected a prompt payload, it was not applied and was recorded as DEFERRED.
- If strict validation failed, completion remained blocked until fixed.

### State Transitions
- Draft to Complete: Allowed after audit artifacts, fixed docs and strict validator pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 63 active docs audited |
| Risk | 10/25 | Doc-only edits with prompt-template deferrals |
| Research | 13/20 | Required sk-doc rules, templates and packet history |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
