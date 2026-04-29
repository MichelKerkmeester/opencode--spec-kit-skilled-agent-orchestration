---
title: "Spec: Testing Playbook Trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Updates three manual testing playbooks with reproducible operator entries for tools shipped in packets 031-036."
trigger_phrases:
  - "037-003-testing-playbook-trio"
  - "manual testing playbook"
  - "playbook updates 031-036"
  - "system-spec-kit playbook"
  - "skill_advisor playbook"
  - "code_graph playbook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/003-testing-playbook-trio"
    last_updated_at: "2026-04-29T15:41:05Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized packet 037/003 docs and playbook entries"
    next_safe_action: "Run sk-doc validation and strict spec validator"
    blockers: []
    completion_pct: 90
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: Testing Playbook Trio

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-29 |
| **Parent Spec** | ../spec.md |
| **Successor** | ../004-sk-doc-template-alignment/spec.md |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../002-feature-catalog-trio/spec.md |
| **Parent Spec** | ../spec.md |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization/037-followup-quality-pass` |
| **Depends On** | `system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit` |
| **Mode** | Doc-only manual testing playbook update |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packets 031-036 shipped or corrected operator-visible surfaces, but the reusable manual testing playbooks did not yet give operators copy-pasteable validation entries for the new handlers and runners. The gap affects retention enforcement, Skill Advisor rebuild separation, CLI matrix adapters, code-graph read-path repair, and packet 035 code-graph cell evidence.

### Purpose

Add reproducible, template-aligned manual testing entries across system-spec-kit, skill_advisor, and the code_graph subsystem without changing runtime code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- system-spec-kit root manual testing playbook entries for packets 033, 034, and 036.
- skill_advisor manual testing playbook entry for `advisor_status` / `advisor_rebuild` separation.
- code_graph subsystem entries under the system-spec-kit code-graph category for packet 032 and packet 035 evidence.
- Packet-local discovery notes and Level 2 spec docs.

### Out of Scope

- Runtime code changes.
- Test-code changes.
- Committing changes.
- Fabricating a standalone code_graph playbook when discovery shows code_graph coverage lives inside the system-spec-kit playbook.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Discover playbook locations before edits. | `discovery-notes.md` lists actual playbook directories and files. |
| REQ-002 | Read sk-doc playbook template and existing entries. | Packet notes and plan cite template and cli-opencode examples. |
| REQ-003 | Add system-spec-kit retention sweep entry. | Entry covers insert/save with `delete_after`, dry run, sweep, deletion verification, interval verification, cleanup, and variants. |
| REQ-004 | Add system-spec-kit advisor rebuild entry. | Entry covers stale state, status diagnostic-only behavior, rebuild path, live skip, and force rebuild. |
| REQ-005 | Add system-spec-kit CLI matrix adapter entry. | Entry covers one F5 cell through every adapter, JSONL shape, summary, and timeout handling. |
| REQ-006 | Add skill_advisor status/rebuild entry. | Nested playbook includes NC-006 and root index links it. |
| REQ-007 | Add code_graph read-path entry. | Entry covers tracked-file modification, `code_graph_query` selective self-heal, and explicit full-scan handoff. |
| REQ-008 | Add code_graph packet 035 evidence entry. | Entry references F5, F6, F7, and F8 logs/results under packet 035. |

### Acceptance Scenarios

1. **Given** an operator needs to validate packet 033, when they open the system-spec-kit playbook, then they can run a dry-run and deleting retention sweep from a deterministic entry.
2. **Given** Skill Advisor freshness is stale, when an operator reads the playbook, then they see `advisor_status` as diagnostic-only and `advisor_rebuild` as the explicit repair path.
3. **Given** a code graph file changes, when an operator reads the code-graph entry, then they can distinguish selective read-path repair from operator-triggered full scans.
4. **Given** an operator audits packet 035 code-graph matrix coverage, when they follow the evidence entry, then F5-F8 log and JSONL paths resolve.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New entries are additive and doc-only.
- **SC-002**: Each new entry includes goal, prerequisites, commands, expected verification, cleanup, and variants.
- **SC-003**: sk-doc markdown validation passes for new playbook entries and touched root playbooks where applicable.
- **SC-004**: Strict packet validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | Existing playbook topology | Discovery recorded actual paths before editing. |
| Dependency | Packet 035 evidence files | Entries reference existing `logs/feature-runs` and `results` paths. |
| Risk | Commands mutate live data | Destructive and mtime steps use disposable spec/workspace paths. |
| Risk | Standalone code_graph playbook does not exist | Document the gap and use the existing code-graph category inside system-spec-kit. |
| Risk | External CLI auth can block live matrix cells | Matrix entry accepts explicit normalized `BLOCKED` evidence and validates timeout with mocked tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Commands must be copy-pasteable with placeholders named where runtime-specific values are required.
- **NFR-R02**: Entries must avoid silent pass/fail; every scenario names evidence to capture.

### Maintainability
- **NFR-M01**: Follow current split playbook pattern: root summary plus per-feature file.
- **NFR-M02**: Avoid renumbering existing scenario IDs.

### Security
- **NFR-S01**: No secrets or local credentials in docs.
- **NFR-S02**: Destructive checks run only in disposable folders.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- If external CLIs are unavailable, matrix entries must record `BLOCKED` with reason rather than inventing pass evidence.
- If `jq` is unavailable, operators may inspect the same JSON fields manually and record that substitution.
- If a playbook validator is root-focused, validate per-feature files directly with `validate_document.py` as `playbook_feature`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Files touched | Medium | Three playbook surfaces plus packet docs |
| Behavioral risk | Low | Documentation-only |
| Verification | Medium | sk-doc validation plus strict spec validation |
| Overall | Level 2 | Multiple doc surfaces need coordinated operator accuracy |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions. Discovery found no standalone code_graph playbook; code_graph entries live in the system-spec-kit manual testing playbook category.
<!-- /ANCHOR:questions -->
