---
title: "Implementation Plan: 037/002 feature-catalog-trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Doc-only catalog refresh using sk-doc feature-catalog conventions and source file:line evidence from packet 031-036 code surfaces."
trigger_phrases:
  - "037-002-feature-catalog-trio"
  - "feature catalog updates"
  - "catalog refresh 031-036"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/002-feature-catalog-trio"
    last_updated_at: "2026-04-29T17:38:44+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Catalog plan verified"
    next_safe_action: "Run final strict validator"
    blockers: []
    key_files:
      - "plan.md"
      - "discovery-notes.md"
    session_dedup:
      fingerprint: "sha256:037002featurecatalogtrio000000000000000000000000000000000000"
      session_id: "037-002-feature-catalog-trio"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 037/002 feature-catalog-trio

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit + sk-doc templates |
| **Storage** | Spec folder metadata JSON |
| **Testing** | sk-doc document validation and strict spec validation |

### Overview
Refresh feature catalogs by reading the existing catalog packages, preserving their local shape, and adding only packet 031-036 surfaces with line-cited implementation references. Missing catalog surfaces are recorded rather than invented.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet path specified by user.
- [x] Discovery commands executed.
- [x] sk-doc feature-catalog template and an existing catalog read before edits.

### Definition of Done
- [ ] Catalog edits are doc-only.
- [ ] Source references cite real files and line ranges.
- [ ] sk-doc validation runs for modified root catalogs.
- [ ] Strict packet validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-aligned documentation refresh.

### Key Components
- **Discovery notes**: Packet-local record of catalog paths and missing standalone code_graph catalog.
- **System-spec-kit catalog entries**: Root summaries plus per-feature files for retention sweep, matrix runners, and Codex freshness smoke check.
- **Skill Advisor catalog entries**: Root count/list update, `advisor_status` contract update, and new `advisor_rebuild` per-feature file.
- **Code Graph note**: Existing system-spec-kit code-graph readiness entry updated for the read-path/manual freshness contract.

### Data Flow
Source files provide implementation facts and line ranges. Catalog root files summarize current reality and link to per-feature entries. Packet docs record discovery, decisions, validation, and completion evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery
- [x] Run requested `find` commands.
- [x] Locate sk-doc feature-catalog template.
- [x] Read system-spec-kit and skill_advisor catalog examples.

### Phase 2: Catalog Updates
- [x] Add system-spec-kit entries and tool-count update.
- [x] Add skill_advisor `advisor_rebuild` entry and status update.
- [x] Update existing code-graph readiness entry for packet 032/035 freshness and matrix status.

### Phase 3: Verification
- [ ] Run sk-doc validation for modified root catalogs.
- [ ] Run strict system-spec-kit validator for the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document validation | Modified root feature catalogs | `sk-doc/scripts/validate_document.py` |
| Structural validation | Packet docs and metadata | `system-spec-kit/scripts/spec/validate.sh --strict` |
| Manual review | Source line references and catalog gap handling | Direct file reads and `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 033 retention sweep files | Internal | Green | Required for retention entry line refs |
| Packet 034 advisor rebuild and freshness files | Internal | Green | Required for advisor and Codex entries |
| Packet 036 matrix runners | Internal | Green | Required for matrix runner entry |
| Standalone code_graph catalog | Internal | Missing | Gap documented; no fabricated catalog |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Catalog validation or strict packet validation cannot pass.
- **Procedure**: Revert only the docs created or modified by this packet and leave unrelated user changes intact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Discovery -> Catalog Updates -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | User packet request | Catalog Updates |
| Catalog Updates | Discovery | Verification |
| Verification | Catalog Updates | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Low | 15 minutes |
| Catalog Updates | Medium | 60-90 minutes |
| Verification | Low | 15-30 minutes |
| **Total** | | **90-135 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Existing catalogs read before modification.
- [x] Source files read before line citations.
- [x] No runtime code edits planned.

### Rollback Procedure
1. Remove new per-feature catalog files from this packet.
2. Revert edited catalog markdown files.
3. Re-run strict packet validation if packet docs remain.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->
