---
title: "Implementation [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/plan]"
description: "Deliver Phase 3 UX and agentic-system research, then repair the packet root and prompt references so the phase validates cleanly."
trigger_phrases:
  - "006-ralph-main plan"
  - "ralph phase closeout plan"
  - "research phase implementation plan"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: 006-ralph-main Research Phase Closeout

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSONL, shell validation |
| **Framework** | Packet-local deep research workflow |
| **Storage** | Packet files under `.opencode/specs/.../006-ralph-main/` |
| **Testing** | `validate.sh --strict`, targeted consistency checks |

### Overview
The closeout extends the existing Ralph research packet from 20 to 30 iterations, with Phase 3 focused on command UX, templates, agentic orchestration, skills, and end-to-end workflow friction. After the research artifacts are updated, the packet root is repaired so the phase is structurally valid and reusable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready
- [x] Existing iterations `001-020` reviewed to avoid duplication
- [x] External Ralph snapshot mapped and treated as read-only
- [x] Phase 3 focus areas and output contract understood

### Definition of Done
- [x] Iterations `021-030` written
- [x] JSONL, dashboard, and merged report updated consistently
- [x] Packet-root docs restored and prompt paths repaired
- [x] Strict validation passes on this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern
Documentation-driven research closeout with packet-local validation repair.

### Key Components
- **Iteration artifacts**: Ten Phase 3 markdown files under `research/iterations/`
- **Reducer artifacts**: `research/deep-research-state.jsonl`, `research/deep-research-dashboard.md`, and `research/research.md`
- **Packet baseline docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
- **Prompt contract**: `phase-research-prompt.md` with packet-local `external/...` references

### Data Flow
Read existing research and external evidence -> write Phase 3 iteration artifacts -> append state JSONL -> update dashboard and merged report -> repair packet-root docs and prompt references -> run strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. Implementation Phases

### Phase 1: Research Extension
- [x] Inspect prior iterations and the current merged report
- [x] Gather new UX, command, agent, skill, and gate evidence
- [x] Write iterations `021-030`

### Phase 2: Synthesis and Packet Repair
- [x] Append Phase 3 state rows
- [x] Refresh the dashboard and merged report
- [x] Restore missing packet-root docs
- [x] Repair stale `phase-research-prompt.md` references

### Phase 3: Verification
- [x] Run consistency checks on totals and rollups
- [x] Run strict packet validation
- [x] Record verification evidence in `checklist.md` and `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integrity | Packet-local file existence and totals alignment | `rg`, `tail`, manual review |
| Validation | Spec packet structure and references | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "<phase>" --strict` |
| Manual | Research artifact spot checks | `sed`, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet-local Ralph snapshot under `external/` | Internal | Green | Research evidence would be incomplete |
| `validate.sh` strict validator | Internal | Green | Packet closeout could not be proven cleanly |
| Existing Phase 1 and Phase 2 artifacts | Internal | Green | Phase 3 synthesis would risk duplication |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: Validation or totals checks fail after the write pass.
- **Procedure**: Repair only packet-local docs or rollup values inside `006-ralph-main/`, then rerun strict validation until the packet is clean.
<!-- /ANCHOR:rollback -->
