---
title: "Implementation Plan: Skill Advisor Freshness Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Read-only evidence plan for auditing skill advisor freshness, rebuild behavior, scoring trust, prompt-cache behavior, and Codex timeout fallback markers."
trigger_phrases:
  - "045-003-skill-advisor-freshness"
  - "advisor freshness audit"
  - "daemon freshness review"
  - "advisor rebuild review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/003-skill-advisor-freshness"
    last_updated_at: "2026-04-29T22:05:20+02:00"
    last_updated_by: "codex"
    recent_action: "Completed read-only audit plan"
    next_safe_action: "Use review-report.md to seed remediation"
    blockers:
      - "P1 advisor_rebuild workspaceRoot contract gap"
    key_files:
      - "plan.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-003-skill-advisor-freshness-plan"
      session_id: "045-003-skill-advisor-freshness"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Advisor Freshness Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python compatibility shim |
| **Framework** | Spec Kit MCP server, Vitest |
| **Storage** | Skill graph SQLite database and JSON generation markers |
| **Testing** | Static source audit, existing Vitest evidence, strict spec validator |

### Overview

This packet audits the current skill advisor implementation without changing runtime code. The plan is evidence-first: inspect handlers, daemon lifecycle, generation publication, cache invalidation, scoring tables, Python compatibility, Codex hook fallback evidence, and adjacent packet history, then publish one severity-classified report.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User supplied the exact packet folder.
- [x] Scope and target surfaces are explicit.
- [x] Severity rubric is explicit: P0 stale fallback or scoring corruption, P1 rebuild/reporting bug, P2 optimization or drift.

### Definition of Done
- [x] All packet docs authored under the specified folder.
- [x] `review-report.md` follows the 9-section format.
- [x] Active findings include severity and file:line evidence.
- [x] Strict validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only deep-review packet.

### Key Components
- **Status and rebuild handlers**: Determine diagnostic-only behavior, rebuild trigger behavior, and public tool contract.
- **Generation and cache invalidation**: Determine whether rebuild and daemon events invalidate advisor prompt caches.
- **Scoring lanes**: Determine trust boundary for static boost tables and prompt-derived evidence.
- **Codex hook freshness**: Determine cold-start timeout marker correctness.
- **Python shim**: Determine default native delegation and fallback equivalence limits.

### Data Flow

Evidence flows from source files and tests into `review-report.md`. No target runtime source is modified; the packet metadata and docs record the audit state for memory and graph traversal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Context Setup
- [x] Load deep-review and system-spec-kit workflow expectations.
- [x] Confirm packet folder is user-specified.
- [x] Inspect Level 2 packet templates and sibling packet metadata.

### Phase 2: Evidence Collection
- [x] Audit `advisor_status` for side effects.
- [x] Audit `advisor_rebuild` for force behavior, cache invalidation, and workspace routing.
- [x] Audit scoring tables and prompt-injection boundaries.
- [x] Audit Codex timeout fallback marker and tests.
- [x] Audit Python shim native delegation and fallback behavior.
- [x] Audit prompt-cache hit/miss behavior and daemon lifecycle coverage.
- [x] Cross-read 026/008, 034, and 045/005 where relevant.

### Phase 3: Reporting and Verification
- [x] Create packet docs.
- [x] Create 9-section review report.
- [x] Run strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static audit | Status, rebuild, daemon, scoring, shim, hook fallback | `rg`, `sed`, source reads |
| Evidence review | Existing Vitest coverage and prior packet run-output | File:line citations |
| Packet validation | Level 2 packet docs and metadata | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 045 phase parent | Internal packet | Green | Provides release-readiness umbrella. |
| 026/008 skill graph daemon and advisor unification | Internal packet | Green | Provides historical expected advisor unification behavior. |
| 034 advisor rebuild and freshness-smoke-check | Internal packet | Green | Provides expected status/rebuild split and Codex fallback marker behavior. |
| 045/005 cross-runtime hook parity | Internal packet | Green | Provides overlapping Codex runtime and fallback concerns. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet docs are malformed or validator fails.
- **Procedure**: Patch only packet-local docs, rerun strict validator, and keep target runtime files untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Context setup -> Evidence collection -> Report writing -> Strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Context setup | User-specified packet path | Evidence collection |
| Evidence collection | Context setup | Report writing |
| Report writing | Evidence collection | Strict validation |
| Strict validation | Report writing | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Context setup | Low | Complete |
| Evidence collection | Medium | Complete |
| Report writing | Medium | Complete |
| Verification | Low | Complete |
| **Total** | | **Complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment involved.
- [x] Read-only target source constraint recorded.
- [x] Packet validation command identified.

### Rollback Procedure
1. Patch malformed packet-local docs.
2. Rerun strict validator.
3. Report any unresolved validator blocker with exact output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove or patch packet-local docs if the audit packet must be regenerated.
<!-- /ANCHOR:enhanced-rollback -->
