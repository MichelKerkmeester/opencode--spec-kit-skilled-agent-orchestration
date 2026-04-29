---
title: "Implementation Plan: Broad-Suite Vitest Honesty"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Investigate the broad Vitest suite, classify any hangs or failures, and correct 026's verification claim to match reproducible evidence."
trigger_phrases:
  - "012-broad-suite-vitest-honesty"
  - "broad suite vitest plan"
  - "F-005 vitest remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/012-broad-suite-vitest-honesty"
    last_updated_at: "2026-04-29T11:15:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Created investigation plan"
    next_safe_action: "Run progressive Vitest reproduction matrix"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/tests"
      - "specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:012-broad-suite-vitest-honesty-plan"
      session_id: "012-broad-suite-vitest-honesty"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Gate 3 answered A with packet path pre-approved by user"
---
# Implementation Plan: Broad-Suite Vitest Honesty

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest test runner |
| **Storage** | Local spec docs plus MCP server test fixtures |
| **Testing** | `npx vitest run`, `npx tsc`, strict spec validator |

### Overview
This packet turns F-005 into reproducible evidence. The work runs Vitest in progressively broader slices, classifies each failure or hang, fixes only 026-induced issues, and scopes 026's verification claim to what actually passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Progressive Vitest matrix recorded with exit codes and timing
- [ ] Any 026-induced failures fixed or escalated
- [ ] 026 implementation summary no longer overstates broad-suite status
- [ ] This packet validates strictly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Diagnostic remediation packet.

### Key Components
- **Vitest matrix**: Runs specific subgroups before the full suite to isolate failures and hangs.
- **Failure classifier**: Uses command output and git history to label failures as 026-induced, pre-existing, environment, or flaky.
- **Documentation correction**: Updates 026's summary with exact test evidence instead of broad claims.

### Data Flow
Vitest output feeds the classification table in `implementation-summary.md`; that summary then drives the wording change in 026's verification section.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the packet specification
- [x] Read 026 implementation-summary claim
- [x] Read F-005 registry finding

### Phase 2: Investigation
- [ ] Run requested Vitest subgroups from `.opencode/skill/system-spec-kit/mcp_server`
- [ ] Bisect full-suite hang if reproduced
- [ ] Classify every failed or hanging test file

### Phase 3: Remediation and Verification
- [ ] Fix only 026-induced failures if found
- [ ] Update 026's claim with actual suite state
- [ ] Write the completion summary and continuity
- [ ] Run strict validators
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/integration | Requested Vitest subgroups and full suite | `npx vitest run` |
| Regression | Any surgically fixed 026-induced tests | Targeted Vitest command |
| Documentation | Packet and 026 strict validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local npm dependencies | Internal | Green | Cannot run Vitest without installed packages |
| Broad Vitest suite | Internal | Yellow | May hang or contain pre-existing failures |
| Git history around `733ce07c3` | Internal | Green | Needed to classify whether failures pre-date 026 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation correction is based on incorrect command evidence.
- **Procedure**: Re-run the recorded commands, restore the previous wording from git, and replace it with evidence-backed wording.
<!-- /ANCHOR:rollback -->
