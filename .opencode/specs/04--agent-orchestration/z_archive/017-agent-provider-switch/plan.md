---
title: "Plan: Spec 017 - Agent Provider Switching with Primary Runtime Path [017-agent-provider-switch/plan]"
description: "Implement a profile activation layer that maps provider-specific source folders (copilot, chatgpt) into .opencode/agent/*.md without changing command references. The runtime pat..."
trigger_phrases:
  - "plan"
  - "spec"
  - "017"
  - "agent"
  - "provider"
importance_tier: "important"
contextType: "decision"
---
# Plan: Spec 017 - Agent Provider Switching with Primary Runtime Path

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell scripts + Markdown docs |
| **Framework** | OpenCode agent/runtime configuration |
| **Storage** | File-system based profile folders |
| **Testing** | Script validation + file diff checks |

### Overview
Implement a profile activation layer that maps provider-specific source folders (`copilot`, `chatgpt`) into `.opencode/agent/*.md` without changing command references. The runtime path remains stable while provider frontmatter switches safely.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope captured in `spec.md`
- [x] Existing path invariants identified (`.opencode/agent/*.md` remains primary)
- [x] Target profile names confirmed (`copilot`, `chatgpt`)

### Definition of Done
- [ ] Activation and status scripts implemented
- [ ] Runtime file verification and rollback proven
- [ ] Documentation updated for daily usage
- [ ] Checklist P0 items complete
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Stable runtime mount point with profile source switching.

### Key Components
- **Profile Sources**: `.opencode/agent/copilot/*.md` and `.opencode/agent/chatgpt/*.md`
- **Runtime Mount**: `.opencode/agent/*.md` (consumed by commands/orchestrator)
- **Activation Script**: copies selected profile into runtime mount with backup/rollback
- **Status Script**: verifies runtime files against expected profile set

### Data Flow
1. User selects provider (`copilot` or `chatgpt`)
2. Activation script validates source profile and managed agent list
3. Script backs up runtime state
4. Script copies profile files into `.opencode/agent/*.md`
5. Script verifies frontmatter expectations and reports result
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Safety
- [ ] Capture/verify managed agent file list (8 files)
- [ ] Add backup + restore behavior
- [ ] Define error codes and failure messages

### Phase 2: Core Switching
- [ ] Implement `activate-provider.sh`
- [ ] Implement `provider-status.sh`
- [ ] Add profile parity checks (all managed files present)

### Phase 3: Verification and Docs
- [ ] Test both directions: copilot -> chatgpt -> copilot
- [ ] Test failure rollback path
- [ ] Update README usage and troubleshooting
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-ish script checks | Argument validation, unknown provider, missing profile | bash |
| Integration | End-to-end provider switch with file verification | bash + git diff |
| Manual | Operator workflow clarity | README walkthrough |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing agent files in `.opencode/agent/*.md` | Internal | Green | Cannot verify parity |
| ChatGPT profile set in `.opencode/agent/chatgpt/` | Internal | Green | ChatGPT activation unavailable |
| Copilot profile set in `.opencode/agent/copilot/` | Internal | Yellow | Copilot activation unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: activation script fails verification or exits mid-copy
- **Procedure**: restore backup of `.opencode/agent/*.md`, then re-run status command
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (Safety baseline) -> Phase 2 (Switching scripts) -> Phase 3 (Verification/docs)

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, Phase 3 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | Release readiness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Safety baseline | Medium | 1-2 hours |
| Switching scripts | Medium | 2-4 hours |
| Verification/docs | Medium | 1-2 hours |
| **Total** |  | **4-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup logic implemented and tested
- [ ] Verification checks fail safely
- [ ] Error output includes recovery guidance

### Rollback Procedure
1. Restore backup snapshot of `.opencode/agent/*.md`
2. Re-run `provider-status.sh`
3. Confirm expected provider active or fail closed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File restore only
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Setup/Validation -> Activation Script -> Status Script -> End-to-end Verification -> Documentation

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Profile parity | Existing profile files | Known-good baseline | Activation |
| Activation script | Profile parity | Runtime switch | Status checks |
| Status script | Activation output | Health report | Final verification |
| Documentation | Verified workflow | Operator guide | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Implement activation script and backup/rollback logic - CRITICAL
2. Implement status verification logic - CRITICAL
3. Validate two-way switching + failure rollback - CRITICAL
4. Publish operational docs - CRITICAL

**Total Critical Path**: 4 major steps

**Parallel Opportunities**:
- Copilot profile folder prep and README draft can run in parallel
- Some verification cases can run after activation baseline exists
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Safety baseline complete | Backup/restore + parity checks in place | Phase 1 |
| M2 | Switching operational | Activation/status scripts working for both providers | Phase 2 |
| M3 | Workflow production-ready | Verified rollback and documented operator flow | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target scope is limited to provider switching and related docs.
- Confirm `.opencode/agent/*.md` remains the runtime target path.
- Confirm backup/rollback behavior is active before runtime file copy.
- Confirm profile source folders (`copilot`, `chatgpt`) are complete.

### Execution Rules

| Rule | Description |
|------|-------------|
| Scope lock | Modify only profile folders, activation scripts, and docs listed in `spec.md` |
| Verify-first | Validate profile parity before writing runtime files |
| Fail closed | On any verification failure, restore backup and exit non-zero |
| Traceability | Record command output and key decisions in spec artifacts |

### Status Reporting Format
- `STATE`: pending | in_progress | completed | blocked
- `STEP`: current phase/task id
- `EVIDENCE`: command output, file path, or diff proof
- `NEXT`: next concrete action

### Blocked Task Protocol
1. Stop writes immediately when a blocker is detected.
2. Record blocker cause and failed command output.
3. Restore runtime state from backup if activation was in progress.
4. Resume only after blocker resolution is documented.
<!-- /ANCHOR:ai-execution-protocol -->
