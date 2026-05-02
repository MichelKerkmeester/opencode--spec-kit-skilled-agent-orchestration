---
title: "Implementation Plan: Evergreen Doc Packet ID Removal"
description: "Doc-only plan for adding the sk-doc evergreen no-packet-ID rule, auditing recently touched evergreen docs, and applying surgical wording fixes."
trigger_phrases:
  - "027-evergreen-doc-packet-id-removal"
  - "evergreen doc rule"
  - "no packet ids in readmes"
  - "sk-doc evergreen rule"
  - "packet id audit"
importance_tier: "important"
contextType: "general"
template_source_marker: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/027-evergreen-doc-packet-id-removal"
    last_updated_at: "2026-04-29T20:05:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned doc-only audit and fixes"
    next_safe_action: "Review audit exceptions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-evergreen-doc-packet-id-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Evergreen Doc Packet ID Removal

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc + system-spec-kit templates |
| **Storage** | Git-tracked docs |
| **Testing** | grep audit + strict spec validator |

### Overview
Add a global sk-doc rule for evergreen docs, update the affected templates, then audit recently touched runtime docs. Apply high-confidence wording fixes and record remaining broad-grep matches as explicit exceptions or deferred cleanup.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] sk-doc rule and template hints added.
- [x] Audit findings written.
- [x] Strict validator passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-rule addition plus surgical evergreen cleanup.

### Key Components
- **Rule reference**: `references/global/evergreen packet ID rule`.
- **Template hints**: README, install guide, feature catalog, manual testing playbook.
- **Audit record**: packet-local `audit findings`.

### Data Flow
Authors load sk-doc, doc-quality routing includes the evergreen rule, templates remind authors to cite current runtime anchors, and audit commands identify candidate packet-history references.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read sk-doc skill and template structure.
- [x] Read Level 2 spec templates.
- [x] Collect recent evergreen candidates from git history.

### Phase 2: Core Implementation
- [x] Add the evergreen packet-ID rule.
- [x] Wire the rule into sk-doc routing and quick reference.
- [x] Update relevant templates.
- [x] Apply targeted evergreen wording fixes.

### Phase 3: Verification
- [x] Rerun audit grep.
- [x] Document exceptions and deferred legacy cleanup.
- [x] Run strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static audit | Evergreen doc packet references | grep |
| Spec validation | Packet docs | `validate.sh --strict` |
| Manual review | Diff scope | `git diff --stat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 037/004 sk-doc template alignment | Internal | Available | Template audit incomplete |
| 038 stress-test folder completion | Internal | Available | Stress docs audit incomplete |
| 039 code-graph catalog and playbook | Internal | Available | Code-graph docs audit incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rule wording or audit fix is judged too broad.
- **Procedure**: Revert doc-only edits for the affected file and keep the audit finding as deferred.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Rule/template updates -> Audit fixes -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 037/004, 038, 039 | Rule/template updates |
| Rule/template updates | Setup | Audit fixes |
| Audit fixes | Rule/template updates | Verification |
| Verification | Audit fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed |
| Core Implementation | Medium | Completed |
| Verification | Medium | Completed |
| **Total** | | **Completed** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Doc-only scope confirmed.
- [x] Existing packet-local specs excluded from cleanup.

### Rollback Procedure
1. Revert only the affected markdown edits.
2. Leave `audit findings` with the reason for rollback.
3. Rerun strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
