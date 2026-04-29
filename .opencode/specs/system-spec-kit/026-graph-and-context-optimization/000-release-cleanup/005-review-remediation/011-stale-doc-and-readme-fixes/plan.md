---
title: "Implementation Plan: Stale Doc + README Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Plan for retiring 12 stale documentation findings from the 011 deep-review and README staleness audit without changing runtime or test code."
trigger_phrases:
  - "011-stale-doc-and-readme-fixes plan"
  - "stale doc readme remediation plan"
  - "readme staleness remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes"
    last_updated_at: "2026-04-29T11:12:30Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Closed 12 stale doc/README findings"
    next_safe_action: "Re-run README staleness audit to confirm 0 STALE-HIGH"
    blockers: []
    key_files:
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/spec.md"
      - "/tmp/audit-readme-staleness-report.md"
    session_dedup:
      fingerprint: "sha256:011-stale-doc-and-readme-fixes-plan"
      session_id: "011-stale-doc-and-readme-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The README audit HIGH and MEDIUM findings are both in scope."
---
# Implementation Plan: Stale Doc + README Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | Spec Kit packet docs and OpenCode skill READMEs |
| **Storage** | Repository files only |
| **Testing** | Grep verification and strict Spec Kit validator |

### Overview

This packet updates 12 stale documentation surfaces identified by the 011 deep-review and README staleness audit. The work is replacement-only or additive documentation repair: packet continuity gets aligned to shipped state, README contracts get updated to match current code, and no runtime or test implementation files are touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable through grep and strict validation
- [x] Dependencies identified: README audit report plus scoped packet docs

### Definition of Done
- [x] All 12 scoped documentation edits land
- [x] Removed identifiers no longer appear in the targeted README contexts
- [x] `pt-01` remains only in conditional/example contexts for deep-loop READMEs
- [x] Strict validator exits 0 for this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation remediation packet.

### Key Components
- **Packet continuity docs**: Update stale summaries and task state in existing spec packets 023, 025, and 028.
- **Code-adjacent READMEs**: Align README contracts with current MCP server search, core, scripts, and code graph behavior.
- **Skill READMEs**: Reflect flat-first research/review artifact resolution and the `playbook_feature` document type.

### Data Flow

Evidence flows from `spec.md` and `/tmp/audit-readme-staleness-report.md` into scoped Markdown edits. Verification flows back through targeted grep checks and the packet strict validator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet contract and README audit
- [x] Resolve shorthand packet paths to actual 023/025/028 folders
- [x] Read Level 1 plan and tasks templates

### Phase 2: Documentation Edits
- [x] Patch four packet-continuity files
- [x] Patch five code-adjacent READMEs
- [x] Patch three skill READMEs
- [x] Write packet implementation summary

### Phase 3: Verification
- [x] Run removed-identifier grep checks
- [x] Run `pt-01` conditional-context grep checks
- [x] Run strict validator for this packet
- [x] Update `spec.md` continuity to completion
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Text grep | Removed identifiers and conditional `pt-01` contexts | `rg` |
| Spec validation | Packet document structure | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Manual review | Adjacent README prose around cited lines | `nl`, `sed`, direct readback |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/tmp/audit-readme-staleness-report.md` | Local audit evidence | Green | README stale findings would lack detailed evidence |
| 011 deep-review findings registry | Local review evidence | Missing | Implementation summary records that the named registry path was unavailable; `spec.md` still carries finding IDs |
| Target documentation files | Internal docs | Green | Required for scoped replacements |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Grep or validator checks fail after scoped documentation edits.
- **Procedure**: Reopen the changed Markdown files, restore only this packet's documentation edits, and rerun the same grep and validator checks.
<!-- /ANCHOR:rollback -->
