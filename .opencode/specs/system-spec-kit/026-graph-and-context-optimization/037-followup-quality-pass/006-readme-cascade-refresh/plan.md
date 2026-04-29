---
title: "Implementation Plan: 037/006 README Cascade Refresh"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Doc-only cascade plan for auditing first-party READMEs, updating stale current-state claims, verifying links, and passing strict packet validation."
trigger_phrases:
  - "037-006-readme-cascade-refresh"
  - "README cascade plan"
  - "mcp_server README update"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/006-readme-cascade-refresh"
    last_updated_at: "2026-04-29T18:19:08+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Planned README cascade refresh"
    next_safe_action: "Verify links and strict validator"
    blockers: []
    key_files:
      - "target-list.md"
    session_dedup:
      fingerprint: "sha256:037006readmecascaderefreshplan000000000000000000000000"
      session_id: "037-006-readme-cascade-refresh"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 037/006 README Cascade Refresh

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit templates |
| **Storage** | Authored docs under `.opencode/skill/system-spec-kit/` and packet docs under `.opencode/specs/` |
| **Testing** | Shell discovery, link/path checks, strict spec validator |

### Overview

The plan is intentionally narrow: build the README target list, audit stale claims against live files, patch only authored docs that drifted, then verify local links and packet structure. Runtime code stays untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] User supplied packet root and dependencies.
- [x] 037/001-005 implementation summaries read.
- [x] README discovery commands run.

### Definition of Done

- [x] `target-list.md` records audit status.
- [x] Scoped README and parent skill docs updated.
- [x] Link/path verification complete.
- [x] Strict validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation cascade audit.

### Key Components

- **Discovery**: `find` and `rg` identify README scope and stale current-state claims.
- **Audit Ledger**: `target-list.md` records PASS / UPDATED status for first-party targets.
- **Surgical Edits**: README and related docs are patched only where current-state drift exists.

### Data Flow

Live filesystem and packet summaries feed `target-list.md`; stale findings drive targeted markdown patches; verification confirms links and packet validity.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery

- [x] List first-party READMEs under `mcp_server/`.
- [x] List parent and related README/docs in scope.
- [x] Read packet summaries for 037/001-005.

### Phase 2: Audit

- [x] Confirm `TOOL_DEFINITIONS.length` is 54.
- [x] Compare README structure sections against live folders.
- [x] Search for stale counts and broken path names.

### Phase 3: Updates

- [x] Patch stale tool counts, paths, structure trees, and version tags.
- [x] Add retention, advisor rebuild, Codex freshness, matrix runner, and stress folder notes where missing.

### Phase 4: Verification

- [x] Run link/path verification.
- [x] Run strict validator for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Discovery | README inventory, tool count, package versions | `find`, `rg`, `awk`, `node` |
| Link/path | Modified authored docs | Shell markdown-link path check |
| Validator | Packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 037/002-005 packet summaries | Internal docs | Available | Current-state changes would be unclear |
| `mcp_server/tool-schemas.ts` | Internal source | Available | Tool count could not be verified |
| `mcp_server/package.json` | Internal package metadata | Available | Version tags could not be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Link verification or strict validation fails because of these doc edits.
- **Procedure**: Patch the affected markdown lines, rerun link verification, then rerun strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Discovery -> Audit -> Updates -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Audit |
| Audit | Discovery | Updates |
| Updates | Audit | Verification |
| Verification | Updates | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Medium | 20 minutes |
| Audit | Medium | 30 minutes |
| Updates | Medium | 45 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Git status reviewed before edits.
- [x] Target files read before patching.

### Rollback Procedure

1. Identify failing doc/link from verification output.
2. Patch only the failing markdown section.
3. Rerun link/path verification.
4. Rerun strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Markdown-only patch correction.
<!-- /ANCHOR:enhanced-rollback -->
