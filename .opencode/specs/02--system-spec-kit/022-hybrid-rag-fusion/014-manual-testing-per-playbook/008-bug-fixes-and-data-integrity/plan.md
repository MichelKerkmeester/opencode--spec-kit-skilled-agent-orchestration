---
title: "Implementation Plan: bug-fixes-and-data-integrity manual testing [template:level_1/plan.md]"
description: "This plan turns the bug-fixes-and-data-integrity slice of the manual testing playbook into an execution-ready Level 1 packet. It sequences preconditions, non-destructive checks, destructive sandbox work, and evidence capture for 11 manual + MCP scenarios."
trigger_phrases:
  - "implementation"
  - "manual testing"
  - "bug fixes"
  - "data integrity"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: bug-fixes-and-data-integrity manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Existing spec folder markdown + evidence artifacts |
| **Testing** | manual + MCP |

### Overview
This plan organizes the bug-fixes-and-data-integrity scenarios from the hybrid-rag-fusion manual testing playbook into an execution-ready phase packet. The approach preserves the exact prompts, separates non-destructive checks from rollback-sensitive scenarios, and uses a consistent preconditions -> execute -> evidence -> verdict pipeline so reviewers can apply the shared protocol without reinterpretation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement, scope, and parent linkage are documented in `spec.md`
- [ ] All 11 playbook rows and feature catalog links are verified for this phase
- [ ] MCP runtime access and sandbox/checkpoint strategy are identified for rollback-sensitive scenarios

### Definition of Done
- [ ] `spec.md` and `plan.md` contain all 11 exact scenario names and prompts
- [ ] Evidence expectations and verdict flow are documented for every scenario
- [ ] Rollback guidance exists for destructive tests and coverage reaches 11/11 scenarios
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-driven manual test pipeline

### Key Components
- **Playbook scenario source**: Canonical prompts, command sequences, expected signals, and pass/fail rules from [manual_testing_playbook.md](../../manual_testing_playbook/manual_testing_playbook.md)
- **Phase packet docs**: [spec.md](spec.md) and [plan.md](plan.md) provide phase-local scope, requirements, execution ordering, and traceability
- **Execution environment**: Manual operator workflows plus MCP runtime access for search, save, stats, or DB-adjacent validation steps
- **Review protocol**: [review_protocol.md](../../manual_testing_playbook/review_protocol.md) turns collected evidence into deterministic PASS, PARTIAL, or FAIL verdicts

### Data Flow
The execution pipeline starts with preconditions, then runs the exact manual prompt and MCP-assisted steps for each scenario, captures command/output evidence immediately after execution, and ends by applying the review protocol to issue a verdict for the scenario and the phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 Preconditions
- [ ] Confirm NEW-001, NEW-002, NEW-003, NEW-004, NEW-065, NEW-068, NEW-075, NEW-083, NEW-084, NEW-116, and NEW-117 are mapped to this folder and remain unchanged in the source playbook
- [ ] Verify access to the MCP runtime, safe seed data, and the feature catalog files linked from `spec.md`
- [ ] Decide which scenarios require sandboxed or checkpointed state before execution begins

### Phase 2 Non-Destructive Tests
- [ ] Prepare execution notes for NEW-001, NEW-002, NEW-003, NEW-004, NEW-068, NEW-075, and NEW-083 as the non-destructive subset
- [ ] Preserve the exact prompt text while capturing query, save, dedup, and scoring evidence through manual + MCP execution
- [ ] Confirm expected signals are observable before moving to rollback-sensitive scenarios

### Phase 3 Destructive Tests (if any with sandbox rules)
- [ ] Run NEW-065, NEW-084, NEW-116, and NEW-117 only in sandboxed or checkpointed environments because they exercise atomicity, cleanup, or failure behavior
- [ ] Apply reset, checkpoint, or disposable-database rules before inducing concurrency, indexing failure, or cleanup side effects
- [ ] Restore sandbox state after each destructive scenario so later evidence remains attributable and reversible

### Phase 4 Evidence Collection and Verdict
- [ ] Collect prompt, command sequence, output, feature link, and rationale for every scenario
- [ ] Apply [review_protocol.md](../../manual_testing_playbook/review_protocol.md) PASS/PARTIAL/FAIL rules exactly as written, including the 100% coverage expectation
- [ ] Hand off a complete 11/11 scenario packet to the parent phase review without leaving undocumented verdict gaps
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| NEW-001 | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data.` | manual + MCP |
| NEW-002 | Confirm dedup in default mode | `Validate chunk collapse deduplication (G3) in default search mode.` | manual + MCP |
| NEW-003 | Confirm hub dampening | `Verify co-activation fan-effect divisor (R17).` | manual + MCP |
| NEW-004 | Confirm identical re-save skips embedding | `Check SHA-256 dedup (TM-02) on re-save.` | manual + MCP |
| NEW-065 | Confirm Sprint 8 DB safety bundle | `Validate database and schema safety bundle.` | manual + MCP |
| NEW-068 | Confirm edge-case guard fixes | `Validate guards and edge-cases bundle.` | manual + MCP |
| NEW-075 | Confirm mixed-format ID dedup | `Verify canonical ID dedup hardening.` | manual + MCP |
| NEW-083 | Confirm large-array safety | `Validate Math.max/min stack overflow elimination.` | manual + MCP |
| NEW-084 | Confirm transactional limit enforcement | `Validate session-manager transaction gap fixes.` | manual + MCP |
| NEW-116 | Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails | `Re-chunk a parent memory and verify old children survive indexing failure` | manual + MCP |
| NEW-117 | Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format | `Create sessions with known timestamps and verify cleanup deletes only expired ones` | manual + MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [manual_testing_playbook.md](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, expected signals, and acceptance criteria cannot be trusted |
| [review_protocol.md](../../manual_testing_playbook/review_protocol.md) | Internal | Green | PASS/PARTIAL/FAIL evaluation and 100% coverage checks become inconsistent |
| `../../feature_catalog/08--bug-fixes-and-data-integrity/` | Internal | Green | Scenario context and feature traceability are lost |
| MCP runtime and sandboxable data stores | Internal Runtime | Yellow | Manual + MCP execution cannot be performed safely, especially for rollback-sensitive scenarios |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Roll back if any prompt, acceptance criterion, or destructive-test guard is found to be misaligned with the playbook, review protocol, or safe sandbox requirements.
- **Procedure**: Revert `spec.md` and `plan.md` to the last known good git revision, pause execution of NEW-065/084/116/117 until sandbox controls are re-confirmed, then regenerate the phase packet from the playbook sources before resuming.
<!-- /ANCHOR:rollback -->

---
