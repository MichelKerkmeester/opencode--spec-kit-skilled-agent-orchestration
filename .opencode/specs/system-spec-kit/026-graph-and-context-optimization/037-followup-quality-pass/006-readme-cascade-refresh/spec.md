---
title: "Feature Specification: 037/006 README Cascade Refresh"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Cascade-refresh first-party READMEs and parent skill docs after packets 031-036 and 037/001-005 so tool counts, folder structure, capability notes, and cross-references match the live repository."
trigger_phrases:
  - "037-006-readme-cascade-refresh"
  - "README cascade"
  - "README refresh"
  - "mcp_server README update"
  - "parent skill README"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/006-readme-cascade-refresh"
    last_updated_at: "2026-04-29T18:19:08+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Initialized README cascade refresh packet"
    next_safe_action: "Verify links and strict validator"
    blockers: []
    key_files:
      - "target-list.md"
      - ".opencode/skill/system-spec-kit/README.md"
      - ".opencode/skill/system-spec-kit/mcp_server/README.md"
    session_dedup:
      fingerprint: "sha256:037006readmecascaderefresh000000000000000000000000000000"
      session_id: "037-006-readme-cascade-refresh"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: 037/006 README Cascade Refresh

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
| **Predecessor** | ../005-stress-test-folder-migration/spec.md |
| **Parent Spec** | ../spec.md |
| **Branch** | `037-followup-quality-pass/006-readme-cascade-refresh` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packets 031-036 and 037/001-005 changed the current documentation surface: the MCP registry is now 54 tools, `matrix-runners/` and `stress_test/` are live folders, `advisor_rebuild` is a public Skill Advisor tool, and the stress suites moved out of `tests/`. Several parent and subfolder READMEs still carried stale counts, hyphenated paths, or missing entries.

### Purpose

Refresh the first-party README cascade so operators can trust tool counts, folder trees, command examples, and cross-references without chasing stale packet history.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit first-party READMEs under `.opencode/skill/system-spec-kit/mcp_server/`.
- Refresh parent skill docs: README, skill instructions, and architecture overview.
- Refresh related reference docs when README links or version/tool-count claims depend on them.
- Create `target-list.md` with discovery and PASS / NEEDS_UPDATE results.

### Out of Scope

- Runtime TypeScript or package metadata changes - this packet is doc-only.
- Vendored `node_modules` README files and cache README files - they are dependency/cache artifacts, not authored cascade docs.
- Full test-suite remediation - packet 037/005 already recorded existing broad-suite blockers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/README.md` | Modify | Update MCP count, feature/playbook counts, structure tree, and related links |
| Parent skill instruction doc | Modify | Update server version and catalog/playbook counts |
| Parent architecture doc | Modify | Add matrix/stress architecture notes and correct subsystem/tool lists |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | Update 54-tool count, Skill Advisor tool list, structure, and version footer |
| `.opencode/skill/system-spec-kit/mcp_server/**/*.md` | Modify | Surgical subfolder README/link refreshes where stale |
| `.opencode/specs/.../006-readme-cascade-refresh/*` | Create | Level 2 packet docs and target audit list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Target list exists | `target-list.md` lists README discovery, exclusions, and PASS / UPDATED findings |
| REQ-002 | Tool count current | Parent and MCP docs cite 54 public MCP tools from `TOOL_DEFINITIONS.length` |
| REQ-003 | Folder structure current | README/architecture trees include `matrix-runners/` and `stress_test/` where relevant |
| REQ-004 | Cross-references resolve | Authored markdown links checked for modified docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Subfolder READMEs refreshed | Handler, library, schema, tool, hook, code graph, and Skill Advisor README gaps updated |
| REQ-006 | Version tags checked | MCP server version and SDK tag in docs align with `mcp_server/package.json` |
| REQ-007 | Strict validator passes | `validate.sh .../006-readme-cascade-refresh --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `target-list.md` records every first-party `mcp_server` README as PASS or UPDATED.
- **SC-002**: No scoped authored doc retains stale 51-tool, hyphenated subsystem path, or missing `advisor_rebuild` claims.
- **SC-003**: Strict packet validation exits 0.

### Acceptance Scenarios

- **SCN-001**: **Given** an operator reads the MCP server README, when they check the tool architecture table, then the total is 54 and includes `advisor_rebuild`, `memory_retention_sweep`, `code_graph_verify`, and `detect_changes`.
- **SCN-002**: **Given** an operator reads folder structure docs, when they look for matrix and stress coverage, then `matrix-runners/` and `stress_test/` are listed in the relevant parent surfaces.
- **SCN-003**: **Given** an operator follows local links in modified docs, when the link verifier runs, then every local target resolves.
- **SCN-004**: **Given** the packet docs are complete, when the strict validator runs, then it exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Vendored README noise | Raw `find` includes dependency READMEs | Exclude `node_modules` and `.pytest_cache` in target list |
| Risk | Link drift | 037/005 moved stress docs and tests | Run link/path verification after edits |
| Dependency | 037/001-005 summaries | Needed to know current changed surfaces | Read summaries before editing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Documentation audit uses bounded shell discovery and targeted edits only.

### Security

- **NFR-S01**: No secrets, auth material, or runtime configuration values are added.

### Reliability

- **NFR-R01**: Link checks and strict validator provide completion evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Vendored dependency READMEs: excluded with rationale.
- Generated/cache READMEs: excluded with rationale.
- Non-README related docs: updated only when they carry cascade-visible stale claims.

### Error Scenarios

- Link check false positives for external URLs: local path checks remain authoritative for this doc-only packet.
- Existing broad test failures: not part of this README cascade.

### State Transitions

- Packet starts and completes in one session with no code changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Many README files, but surgical documentation edits |
| Risk | 8/25 | Doc-only, cross-reference risk is the main concern |
| Research | 12/20 | Requires packet-summary and live filesystem discovery |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
