---
title: "Implementation Plan: Cross-Runtime Hook Parity Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Read-only audit plan for runtime hook parity across Claude, Codex, Copilot, Gemini, and OpenCode. The plan checks source behavior, documented contracts, latest hook-test evidence, and release-readiness implications."
trigger_phrases:
  - "045-005-cross-runtime-hook-parity"
  - "hook parity audit"
  - "5-runtime hook review"
  - "cross-runtime feature parity"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity"
    last_updated_at: "2026-04-29T22:30:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed hook parity audit plan"
    next_safe_action: "Use review-report.md to seed remediation"
    blockers:
      - "P0 Copilot checked-in live wrapper does not invoke Spec Kit writer scripts"
    key_files:
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-005-cross-runtime-hook-parity-plan"
      session_id: "045-005-cross-runtime-hook-parity"
      parent_session_id: "045-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cross-Runtime Hook Parity Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, JSON, Markdown |
| **Framework** | Spec Kit MCP server hooks and OpenCode plugin bridge |
| **Storage** | Packet-local markdown and JSON metadata |
| **Testing** | Latest `hook-tests` run-output review plus strict spec validation |

### Overview

The audit compares documented runtime hook contracts to actual source/config behavior. It uses the latest 043/044 hook-test output as evidence while preserving the distinction between direct hook smokes and canonical live CLI verdicts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified and available.

### Definition of Done
- [x] All acceptance criteria met in `review-report.md`.
- [x] Docs updated under the packet folder only.
- [x] Strict validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only audit with packet-local documentation.

### Key Components
- **Runtime hooks**: Claude, Codex, Copilot, and Gemini prompt/startup hook source.
- **OpenCode plugin**: `experimental.chat.system.transform` adapter and bridge.
- **Contract docs**: hook system reference, skill advisor hook reference, AGENTS/SKILL feature parity tables.
- **Evidence packets**: 035 matrix findings, 043 hook/plugin tests, and 044 sandbox methodology correction.

### Data Flow

Read source and evidence -> classify parity findings -> synthesize 9-section report -> validate packet structure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope and Evidence
- [x] Read deep-review and system-spec-kit workflow instructions.
- [x] Read parent packet, 035 findings, 043 findings/run-output, and 044 amendment.
- [x] Read runtime hook docs, configs, source, and plugin bridge.

### Phase 2: Review Synthesis
- [x] Classify findings using P0/P1/P2 rubric.
- [x] Answer parity-specific questions.
- [x] Write the 9-section `review-report.md`.

### Phase 3: Verification
- [x] Author Level 2 packet docs and metadata.
- [x] Run strict validator.
- [x] Record verification evidence in checklist and implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence review | Runtime hooks and latest run-output | `sed`, `nl`, `rg`, `find` |
| Validation | Packet structure and frontmatter | `validate.sh --strict` |
| Manual | Severity classification and parity answers | Read-only review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 045 phase parent | Internal | Available | Defines child scope and output format. |
| 035 findings | Internal | Available | Supplies prior F11 hook reality. |
| 043 findings/run-output | Internal | Available | Supplies direct smoke and live CLI evidence. |
| 044 methodology correction | Internal | Available | Reclassifies sandboxed live CLI failures. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet docs are malformed or validator fails.
- **Procedure**: Patch only files under this packet folder until strict validation passes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Evidence) -> Phase 2 (Synthesis) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence | None | Synthesis |
| Synthesis | Evidence | Verify |
| Verify | Synthesis | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence | Medium | Complete |
| Synthesis | Medium | Complete |
| Verification | Low | Complete |
| **Total** | | **Complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Packet path confirmed.
- [x] Audited surfaces treated read-only.
- [x] Findings cite file:line evidence.

### Rollback Procedure
1. Patch packet-local docs only.
2. Re-run strict validator.
3. Preserve source and config surfaces unchanged.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
