---
title: "Implementation Plan: 050 Feature Catalog Shape Realignment"
description: "Audit the six real feature catalog roots, mechanically realign drifted per-feature files to the sk-doc snippet shape, and verify zero remaining catalog drift."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "037-feature-catalog-shape-realignment"
  - "feature catalog shape audit"
  - "sk-doc snippet template alignment"
  - "catalog OVERVIEW canonical"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/037-feature-catalog-shape-realignment"
    last_updated_at: "2026-04-30T08:40:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Plan executed"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "plan.md"
      - "audit-findings.md"
      - "remediation-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-feature-catalog-shape-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 050 Feature Catalog Shape Realignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc feature catalog conventions |
| **Storage** | Filesystem only |
| **Testing** | Shape audit, structural lint, evergreen grep, strict validator |

### Overview

The plan reads the canonical sk-doc snippet template, audits all six feature catalog roots, then applies minimal structural rewrites. Existing feature text remains the source of truth; only H2 shape, TOC placement, anchor balance, source tables, metadata blocks, and evergreen packet-history wording change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder provided by user.
- [x] Canonical sk-doc snippet and root templates read.
- [x] Evergreen rule and global doc standards read.
- [x] Existing conformant example found after the requested example path drifted.

### Definition of Done

- [x] Six catalog roots shape-audited.
- [x] `skill_advisor` and `code_graph` catalogs realigned.
- [x] Additional lint-discovered drift fixed.
- [x] Packet reports written.
- [x] Strict validator passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation shape normalization with content-preserving section mapping.

### Key Components

- **Lint pass**: checks frontmatter, H1/title parity, H2 order, anchor balance, redundant TOCs, and evergreen-rule hits.
- **Realignment pass**: maps legacy H2 sections into canonical H2 blocks and keeps old details as H3 subsections when needed.
- **Report pass**: records before/after drift, per-file remediation, and verification output.

### Data Flow

File discovery produces catalog root lists. Read-only audits classify drift. The rewrite pass updates only per-feature files. Verification commands then read the same roots and confirm zero remaining drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read sk-doc and system-spec-kit guidance.
- [x] Read canonical feature catalog templates and evergreen rule.
- [x] Inventory six real catalog roots.

### Phase 2: Implementation

- [x] Remove redundant `sk-deep-review` TOCs.
- [x] Realign 37 `skill_advisor` feature files.
- [x] Realign 17 `code_graph` feature files.
- [x] Fix 27 additional `system-spec-kit` per-feature drift files found by lint.
- [x] Add canonical metadata and anchors where files were rebuilt.

### Phase 3: Verification

- [x] Run six-root shape audit.
- [x] Run structural Node audit.
- [x] Run evergreen-doc grep and classify stable false positives.
- [x] Run strict packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Shape audit | Six real catalog roots | `find`, `grep` |
| Structural lint | Frontmatter, H1/title, anchors, TOCs | Node checker |
| Evergreen grep | Touched feature catalog files | `rg` |
| Packet validation | Level 2 packet folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc snippet template | Documentation standard | Available | Blocks target shape |
| sk-doc evergreen rule | Documentation standard | Available | Blocks touched evergreen catalog cleanup |
| Prior code graph catalog packet | Spec dependency | Available | Context only |
| Remaining remediation packet | Spec dependency | Available | Context only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A catalog owner rejects the section mapping.
- **Procedure**: Revert only the affected markdown files. No code, schemas, or root index files changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Template read -> Lint -> Realign -> Report -> Validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Template read | None | Lint |
| Lint | Template read | Realign |
| Realign | Lint | Report |
| Report | Realign | Validate |
| Validate | Report | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed |
| Implementation | Medium | Completed |
| Verification | Medium | Completed |
| **Total** | | **Completed in-session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Documentation-only scope confirmed.
- [x] Root catalog indexes left untouched.
- [x] Packet reports capture changed file groups.

### Rollback Procedure

1. Revert the changed markdown files in the affected catalog root.
2. Re-run the six-root shape audit.
3. Update `audit-findings.md` if any rollback is intentional.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git-level markdown revert only.
<!-- /ANCHOR:enhanced-rollback -->
