---
title: "Implementation Plan: 037/004 sk-doc Template Alignment"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Run a packet-filtered sk-doc audit for docs touched by 031 through 036, apply safe README and reference fixes, document deferrals and verify the packet with strict validation."
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
    last_updated_at: "2026-04-29T17:41:50+02:00"
    last_updated_by: "cli-codex"
    recent_action: "sk-doc template audit and fixes completed"
    next_safe_action: "Run strict validator as final verification"
    blockers: []
    key_files:
      - "audit-target-list.md"
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:037004skdoctemplatealignmentplan0000000000000000000000000"
      session_id: "037-004-sk-doc-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 037/004 sk-doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON metadata |
| **Framework** | sk-doc document templates, system-spec-kit Level 2 packet |
| **Storage** | None |
| **Testing** | sk-doc validators and strict spec validator |

### Overview
The audit reads sk-doc standards and template assets, builds the 031 through 036 target list, applies safe README/reference fixes and writes a per-file audit report. Verification runs the strict packet validator after all edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder selected by packet path.
- [x] sk-doc standards and template assets read.
- [x] 031 through 036 target list discovered.

### Definition of Done
- [x] Audit target list written.
- [x] Audit findings written with PASS, FIX_APPLIED and DEFERRED rows.
- [x] Safe fixes applied and rechecked.
- [x] Strict validator passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Document audit with template-aware fix pass.

### Key Components
- **Discovery**: Git commit-specific markdown/text target list for packets 031 through 036.
- **Validation**: sk-doc `validate_document.py`, frontmatter checks, anchor balance checks and DQI heuristics.
- **Fix pass**: README and reference structure fixes only.
- **Report**: Per-file audit findings with explicit deferral rationale.

### Data Flow
Git history -> active target list -> sk-doc template checks -> safe fixes -> audit findings -> strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery
- [x] Run the requested broad diff command.
- [x] Build commit-filtered active scope for 031 through 036.
- [x] Write `audit-target-list.md`.

### Phase 2: Audit
- [x] Read sk-doc standards and templates.
- [x] Validate READMEs, references, skill docs, command docs, specs and prompt-template assets by applicable type.
- [x] Check anchor balance and fenced code blocks across the active list.

### Phase 3: Fixes
- [x] Apply validator-safe README TOC anchor fixes.
- [x] Add missing README TOCs and anchors.
- [x] Add reference metadata, numbered sections and anchors where needed.
- [x] Record raw prompt-template assets as DEFERRED.

### Phase 4: Verification
- [x] Re-run sk-doc checks on edited docs.
- [x] Run strict validator on this packet and touched 031 through 036 packet folders.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Edited READMEs and references | `validate_document.py` |
| Integrity | Active target list | Anchor and fenced-code audit script |
| Spec | Packet docs and 031 through 036 folders | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc skill standards | Internal skill | Available | Audit rules unavailable |
| system-spec-kit templates | Internal templates | Available | Packet docs could fail validation |
| Git commits 031 through 036 | Repository history | Available | Target list incomplete |
| 037/001 audit packet | Packet dependency | Available | Follow-up ordering unclear |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README/reference validation or strict spec validation fails after edits.
- **Procedure**: Revert only this packet's doc edits, re-run sk-doc validation, then reapply smaller fixes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Read standards -> Discover scope -> Audit -> Apply safe fixes -> Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | Git history | Audit |
| Audit | sk-doc standards | Fixes |
| Fixes | Audit findings | Verification |
| Verification | Packet docs and fixes | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Low | 10 minutes |
| Audit | Medium | 45 minutes |
| Fixes | Medium | 30 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **95 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No code files changed.
- [x] No sk-doc skill files changed.
- [x] Raw prompt templates preserved.

### Rollback Procedure
1. Revert the README/reference doc edits from this packet.
2. Keep `audit-findings.md` if it still documents the failure.
3. Re-run strict validator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
