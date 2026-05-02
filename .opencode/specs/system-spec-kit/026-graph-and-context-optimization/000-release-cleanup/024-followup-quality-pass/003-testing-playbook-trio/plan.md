---
title: "Plan: Testing Playbook Trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Doc-only plan for adding manual testing playbook entries across system-spec-kit, skill_advisor, and code_graph coverage."
trigger_phrases:
  - "037-003 testing playbook plan"
  - "manual playbook trio plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/003-testing-playbook-trio"
    last_updated_at: "2026-04-29T15:41:05Z"
    last_updated_by: "cli-codex"
    recent_action: "Plan created for packet 037/003"
    next_safe_action: "Validate docs and strict packet"
    blockers: []
    completion_pct: 90
---

# Plan: Testing Playbook Trio

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc manual testing playbook format |
| **Storage** | N/A |
| **Testing** | `validate_document.py`, strict spec validator |

### Overview

Update three manual testing playbook surfaces with packet 031-036 operator checks. The implementation is additive: create per-feature scenario files, add root playbook links, and record discovery plus validation in the packet docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder established by user.
- [x] Playbook discovery commands executed.
- [x] sk-doc template and cli-opencode examples read.

### Definition of Done

- [ ] All playbook entries added.
- [ ] sk-doc validation passes for touched playbook files.
- [ ] Strict validator exits 0 for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Split manual testing playbook package: root index plus per-feature files in numbered category directories.

### Key Components

- **system-spec-kit root playbook**: packet 033 retention, packet 034 advisor rebuild, packet 036 matrix adapters, and code_graph category entries.
- **skill_advisor playbook**: NC-006 native MCP entry for status/rebuild separation.
- **packet docs**: discovery notes and Level 2 completion record.

### Data Flow

Operator opens root playbook, follows a linked scenario file, executes commands, captures evidence, and records pass/fail based on expected signals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery

- [x] Run playbook discovery commands.
- [x] Record actual paths in `discovery-notes.md`.

### Phase 2: Template Reading

- [x] Read sk-doc manual testing playbook creation reference.
- [x] Read sk-doc playbook template.
- [x] Read cli-opencode per-feature examples.

### Phase 3: Add Entries

- [x] Add system-spec-kit entries for retention, advisor rebuild, matrix adapters, code_graph self-heal, and packet 035 evidence.
- [x] Add skill_advisor NC-006 entry.
- [x] Link new entries from root playbooks.

### Phase 4: Verification

- [ ] Run sk-doc validation on touched playbook docs.
- [ ] Run strict packet validator and fix any failures.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Markdown structure | Touched playbook entries and roots | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| Spec compliance | Packet folder | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| Link/path sanity | New scenario references | `test -f`, `rg`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-sk-code-opencode-audit` | Packet dependency | Complete enough for this follow-up | User-specified dependency for graph metadata |
| sk-doc playbook template | Documentation standard | Available | Needed for structure validation |
| Packet 035 evidence files | Evidence anchor | Available | Needed for F5-F8 coverage entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sk-doc or strict validator failure that cannot be repaired within doc-only scope.
- **Procedure**: Remove new scenario files and root playbook references from this packet's changes, then rerun validators.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Discovery -> Template reading -> Entry authoring -> Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Template reading |
| Template reading | Discovery | Entry authoring |
| Entry authoring | Template reading | Validation |
| Validation | Entry authoring | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Low | Done |
| Entry authoring | Medium | Done |
| Verification | Medium | Pending |
| **Total** | | **Short doc packet** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Scope is doc-only.
- [x] No runtime files edited.
- [ ] Validators pass.

### Rollback Procedure

1. Remove new playbook scenario files.
2. Remove root playbook links for IDs 278-282 and NC-006.
3. Remove packet docs if the whole packet is abandoned.
4. Re-run strict validator.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert or targeted doc removal before commit.
<!-- /ANCHOR:enhanced-rollback -->
