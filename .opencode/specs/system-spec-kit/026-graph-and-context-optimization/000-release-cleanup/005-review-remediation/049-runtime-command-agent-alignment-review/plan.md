---
title: "Implementation Plan: 049 Runtime Command Agent Alignment Review"
description: "Audit command and agent definitions against canonical tool schemas, runtime hook contracts, and recent path changes, then apply minimal doc-level corrections."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "049-runtime-command-agent-alignment-review"
  - "runtime command audit"
  - "agent alignment review"
  - "cross-runtime agent consistency"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/049-runtime-command-agent-alignment-review"
    last_updated_at: "2026-04-30T07:45:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Plan executed"
    next_safe_action: "Use reports"
    blockers:
      - ".codex/agents writes blocked by sandbox EPERM"
    key_files:
      - "plan.md"
      - "audit-findings.md"
    session_dedup:
      fingerprint: "sha256:049-runtime-command-agent-alignment-review-plan"
      session_id: "049-runtime-command-agent-alignment-review"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 049 Runtime Command Agent Alignment Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, TOML documentation |
| **Framework** | Spec Kit command and agent runtime docs |
| **Storage** | Filesystem only |
| **Testing** | Strict spec validator plus grep audits |

### Overview

The plan audits runtime docs first, fixes only text-level drift, and records blocked Codex TOML drift separately because the sandbox denies writes there. Canonical sources are `tool-schemas.ts`, advisor tool descriptors, `opencode.json`, hook-system docs, and prior packet summaries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder provided by user.
- [x] Source-of-truth files identified.
- [x] Runtime command and agent file lists discovered.

### Definition of Done

- [x] Audit report complete.
- [x] Safe remediations applied.
- [x] Blocked Codex drift documented.
- [x] Strict validator passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation audit with minimal targeted edits.

### Key Components

- **Audit pass**: classify command and agent files as PASS, DRIFT, MISSING, or BLOCKED.
- **Remediation pass**: apply conservative text replacements with source anchors.
- **Cross-runtime pass**: compare equivalent agent definitions and document divergence.

### Data Flow

Discovery commands produce file lists. Grep and direct reads identify candidate drift. Edits update runtime-facing docs. Reports summarize evidence and outcomes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery

- [x] Count `.opencode/command/**/*.md`.
- [x] Count OpenCode, Claude, Codex, and Gemini agent definitions.
- [x] Read canonical tool, hook, and prior-packet sources.

### Phase 2: Remediation

- [x] Fix stale Node floor, code-graph narrative, advisor rebuild, retention sweep, hook wording, evergreen guidance, and runtime directory guidance.
- [x] Record Codex TOML write denial.

### Phase 3: Verification

- [x] Run stale-path and evergreen grep checks.
- [x] Run strict packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | Old paths, packet-history claims, hook wording | `rg` |
| Cross-runtime | Agent definitions across runtime dirs | `diff`, `cmp`, direct reads |
| Spec validation | Packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 042 root README refresh | Spec packet | Available | Context source only |
| 047 matrix_runners rename | Spec packet | Available | Path-current source |
| 048 remaining remediation | Spec packet | Available | Tool-surface source |
| `.codex/agents` write access | Filesystem | Blocked | Codex findings documented, not fixed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A runtime doc edit is judged too broad or incorrect.
- **Procedure**: Revert only the affected documentation file or YAML asset; no tool source files were changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Discovery -> Audit -> Remediation -> Reports -> Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Audit |
| Audit | Discovery | Remediation |
| Remediation | Audit | Reports |
| Reports | Remediation | Validation |
| Validation | Reports | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Medium | Completed |
| Remediation | Medium | Completed |
| Verification | Low | Completed |
| **Total** | | **Completed in-session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No runtime source/schema mutation.
- [x] Packet reports created before completion claim.

### Rollback Procedure

1. Review `remediation-log.md` for changed files.
2. Revert the specific documentation file if a wording correction is rejected.
3. Re-run the strict validator.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->
