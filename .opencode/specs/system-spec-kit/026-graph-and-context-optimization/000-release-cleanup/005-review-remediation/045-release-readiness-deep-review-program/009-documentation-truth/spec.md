<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Documentation Truth Deep Review"
description: "Read-only release-readiness audit of evergreen documentation truth against live runtime sources. The audit checks tool counts, feature catalogs, manual playbooks, automation claims, evergreen references, security posture, and local cross-references."
trigger_phrases:
  - "045-009-documentation-truth"
  - "docs truth audit"
  - "stale claims review"
  - "evergreen rule self-check"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth"
    last_updated_at: "2026-04-29T22:34:00+02:00"
    last_updated_by: "codex"
    recent_action: "Initialized documentation truth deep-review packet"
    next_safe_action: "Use review-report.md findings for remediation planning"
    blockers: []
    key_files:
      - "review-report.md"
      - "README.md"
      - "AGENTS.md"
      - ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts"
    session_dedup:
      fingerprint: "sha256:045009documentationtruth000000000000000000000000000000000000"
      session_id: "045-009-documentation-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User supplied the exact packet folder and requested a read-only audit."
---
# Feature Specification: Documentation Truth Deep Review

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
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The documentation surface needs a release-readiness truth audit after recent refresh work. Claims about automation, tool counts, feature coverage, and operator validation must match the live runtime and schema sources.

### Purpose
Produce a severity-classified review report that identifies stale or unsupported documentation claims without modifying target documentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit the requested root, agent, system-spec-kit, MCP server, feature catalog, manual playbook, and reference documentation.
- Cross-check tool counts against `mcp_server/tool-schemas.ts` plus Skill Advisor schema entries.
- Check feature catalog and manual playbook coverage for registered MCP tools.
- Run the evergreen reference self-check and classify real violations versus stable artifact IDs.
- Write only packet-local spec docs and `review-report.md`.

### Out of Scope
- Runtime code changes.
- Fixing target documentation.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/spec.md` | Create | Packet specification |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/plan.md` | Create | Audit plan |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/tasks.md` | Create | Audit task ledger |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/checklist.md` | Create | Verification checklist |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/implementation-summary.md` | Create | Completion summary |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/description.json` | Create | Search metadata |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/graph-metadata.json` | Create | Graph metadata |
| `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/review-report.md` | Create | Severity-classified audit output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve read-only target scope | Only packet-local docs are written; target docs are inspected only |
| REQ-002 | Produce severity-classified findings | `review-report.md` lists P0/P1/P2 findings with file:line evidence |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Verify evergreen reference policy | Grep result is captured and classified |
| REQ-004 | Verify tool count truth | Public count claims are checked against canonical schema sources |
| REQ-005 | Verify catalog and playbook coverage | Missing entries are listed with the registered tool evidence |
| REQ-006 | Verify automation and security claims | Automation tables and install-guide security posture are reviewed |

### Acceptance Scenarios

- **Given** the evergreen documentation set, **when** the reference grep runs, **then** packet-history hits are classified as actionable violations or stable artifact IDs.
- **Given** the canonical MCP schema sources, **when** public tool counts are audited, **then** stale totals are listed with file:line evidence.
- **Given** the registered MCP tool list, **when** feature catalogs and playbooks are searched, **then** missing coverage is listed by tool name.
- **Given** the packet-local report, **when** strict validation runs, **then** the packet passes without target-document edits.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` uses the 9-section deep-review report structure.
- **SC-002**: Active findings cite file:line evidence or clearly identify command-derived absence evidence.
- **SC-003**: Strict validator exits 0 for the packet folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Target docs are large generated catalogs | High grep noise | Classify stable artifact IDs separately from actionable violations |
| Risk | Absence checks can be ambiguous | False missing-catalog findings | Cross-check registered tool names against all root and package-local catalog/playbook trees |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Do not expose secrets or inspect hidden credentials.
- **NFR-S02**: Report insecure install-guide defaults if found.

### Reliability
- **NFR-R01**: Findings must be reproducible with listed commands or cited file lines.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Audit Boundaries
- Stable file names and scenario IDs may match the evergreen grep. Classify them rather than treating all hits as violations.
- Imported Skill Advisor descriptors do not appear as `name: '` lines in `tool-schemas.ts`; count them through the advisor schema/descriptor surface.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Broad documentation surface |
| Risk | 12/25 | Read-only target audit |
| Research | 18/20 | Multiple schema and catalog cross-checks |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
