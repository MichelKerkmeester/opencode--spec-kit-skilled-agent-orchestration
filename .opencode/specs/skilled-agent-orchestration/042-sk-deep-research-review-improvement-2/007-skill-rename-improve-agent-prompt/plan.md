---
title: "Implementation Plan: Skill Rename Closeout [042.007]"
description: "Document the completed rename in the current Level 3 template so the packet reflects the delivered path changes and verification evidence cleanly."
trigger_phrases:
  - "042.007"
  - "skill rename plan"
  - "rename closeout"
importance_tier: "normal"
contextType: "planning"
---
# Implementation Plan: Skill Rename Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs plus repo-path verification |
| **Framework** | Spec Kit Level 3 packet closeout |
| **Storage** | Existing repo paths and changelog directories |
| **Testing** | Strict spec validation plus path and reference verification |

### Overview
This phase records a rename that had already shipped. The plan is therefore a documentation-closeout plan: align the packet with the current Level 3 template, point every path reference at the renamed skill and changelog folders, and preserve enough verification evidence that future maintainers do not need to reconstruct the rename from git history.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The repo already contains `sk-improve-agent` and `sk-improve-prompt`. [EVIDENCE: `.opencode/skill/sk-improve-agent/` and `.opencode/skill/sk-improve-prompt/` present]
- [x] The live runtime-agent files already use `improve-agent` naming. [EVIDENCE: `.opencode/agent/improve-agent.md`, `.claude/agents/improve-agent.md`, `.gemini/agents/improve-agent.md`, `.codex/agents/improve-agent.toml`]
- [x] The phase packet contains enough delivered-state detail to rebuild into the current Level 3 template. [EVIDENCE: existing spec/plan/tasks/checklist/implementation-summary in the phase folder]

### Definition of Done
- [x] Phase docs use the current Level 3 template structure and markers. [EVIDENCE: `SPECKIT_LEVEL: 3` and `SPECKIT_TEMPLATE_SOURCE` headers in all six spec documents]
- [x] Runtime-agent and changelog references resolve cleanly. [EVIDENCE: `spec.md` §3, `implementation-summary.md` Verification table]
- [x] Checklist items are complete with evidence. [EVIDENCE: `checklist.md` all P0/P1 items marked with `[EVIDENCE: ...]` citations]
- [x] Strict validation passes for the phase folder. [EVIDENCE: `validate.sh --strict` run after packet rewrite]

### Pre-Task Checklist

Before starting any packet-edit task, the executing agent MUST verify all of:

- [x] Live skill folders `sk-improve-agent` and `sk-improve-prompt` exist on disk.
- [x] Live runtime-agent files for `improve-agent` exist in all four runtime directories.
- [x] Renamed changelog directories `14--sk-improve-prompt/` and `15--sk-improve-agent/` exist.
- [x] Scope lock: only files inside `007-skill-rename-improve-agent-prompt/` will be modified.
- [x] Memory subfolder is NOT in the edit scope.

### Execution Rules

| Rule | Scope | Action |
|------|-------|--------|
| TASK-SEQ-01 | Phase ordering | Complete Phase 1 (read) before Phase 2 (rewrite); complete Phase 2 before Phase 3 (verify). |
| TASK-SCOPE-01 | File scope | No file outside the phase folder may be created, renamed, deleted, or edited. |
| TASK-SCOPE-02 | Memory boundary | No write operations against `memory/`; memory files are owned by `generate-context.js`. |
| TASK-REF-01 | Path references | Every runtime-agent reference must resolve to a live `improve-agent.*` file. |
| TASK-REF-02 | Changelog references | Every changelog reference must use the renamed `14--` and `15--` directories. |
| TASK-VALIDATE-01 | Closeout gate | Strict validation MUST pass before the phase is claimed complete. |

### Status Reporting Format

Use this compact format when reporting progress on any task in this phase:

```
[042.007/T###] <status> - <artifact path or evidence>
```

Where `<status>` is one of: `started`, `in-progress`, `blocked`, `done`. Include the artifact path or evidence reference for every `done` line.

### Blocked Task Protocol

If any task is BLOCKED:

1. Mark the task `[B]` in `tasks.md`.
2. Capture the blocker description and evidence in the task line.
3. Do NOT invent workarounds; surface the blocker immediately.
4. Re-check the Pre-Task Checklist before the task leaves BLOCKED state.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only closeout over an already-completed rename. No runtime behavior changes; the phase packet acts as the durable record of the rename and its path boundaries.

### Key Components
- **Phase specification (`spec.md`)**: states the completed rename truth and canonical paths.
- **Task log (`tasks.md`)**: captures the rename workflow as completed work with evidence.
- **Verification checklist (`checklist.md`)**: proves the new names, renamed folders, and packet hygiene.
- **Decision record (`decision-record.md`)**: explains why the `sk-improve-*` names remain canonical, why runtime-agent filenames were left alone, and why historical slugs remain unchanged.
- **Implementation summary (`implementation-summary.md`)**: narrates the closeout outcome and verification.

### Data Flow
Live repo paths → packet documentation → strict validator → parent packet closeout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the existing phase docs and the live repo paths for the renamed skills.
- [x] Identify stale references, missing template markers, and broken README links.

### Phase 2: Core Implementation
- [x] Rebuild the phase docs around the current Level 3 template.
- [x] Replace stale runtime-agent references with the live `improve-agent` files.
- [x] Add a Level 3 decision record capturing ADR-001, ADR-002, and ADR-003.

### Phase 3: Verification
- [x] Add evidence to all checklist items.
- [x] Repair README template-reference links.
- [x] Re-run strict validation on the phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Template markers, anchors, and section order | `validate.sh --strict` |
| Reference | Runtime-agent paths and changelog paths | direct path verification |
| Documentation | README template links and checklist evidence | direct file inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Renamed skill folders | Internal | Green | Without them the packet could not record the completed rename truthfully. |
| Renamed changelog folders | Internal | Green | Without them the rename closeout would still point to stale changelog paths. |
| Live `improve-agent` runtime files | Internal | Green | The packet would keep sending readers to missing paths. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation still fails or the packet contains unresolved stale path references.
- **Procedure**: Keep the rename itself untouched, repair the packet docs, and re-run strict validation until the closeout packet matches current reality.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (read current state)
  -> Phase 2 (rebuild packet docs)
  -> Phase 3 (verify and close out)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Live renamed paths | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Parent closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 minutes |
| Core Implementation | Medium | 45-90 minutes |
| Verification | Low | 15-30 minutes |
| **Total** | | **1.5-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Live renamed paths verified before editing docs
- [x] Packet scope kept within the phase folder
- [x] Validation command identified before closeout

### Rollback Procedure
1. Revert only the phase-doc edits if they introduce new drift.
2. Keep the shipped rename intact.
3. Re-run strict validation after any documentation correction.
4. Update the parent packet only after the child packet is clean.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable; this phase is documentation-only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌──────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│ Phase 1: Setup   │────►│ Phase 2: Rewrite   │────►│ Phase 3: Verify    │
│ Read live paths  │     │ Spec/plan/tasks/   │     │ Strict validation  │
│                  │     │ checklist/impl/    │     │ Evidence audit     │
│                  │     │ decision-record    │     │                    │
└──────────────────┘     └────────────────────┘     └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (read state) | Live renamed skill/agent/changelog paths | Gap inventory | Phase 2 |
| Phase 2 (rewrite docs) | Phase 1 gap inventory | Rebuilt spec/plan/tasks/checklist/impl-summary/decision-record | Phase 3 |
| Phase 3 (verify) | Phase 2 rewrite | Strict validation PASS, evidence-backed checklist | Parent packet closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Read live state** - 15-30 min - CRITICAL
2. **Phase 2: Rewrite packet docs to Level 3 template** - 45-90 min - CRITICAL
3. **Phase 3: Strict validation and evidence audit** - 15-30 min - CRITICAL

**Total Critical Path**: 1.5-2.5 hours

**Parallel Opportunities**:
- Within Phase 2, the six packet files can be edited in any order as long as Phase 1 is complete.
- Decision-record ADRs can be drafted in parallel since they cover independent boundaries.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Live-state read complete | Gap inventory captured against Level 3 template | Phase 1 |
| M2 | Packet rewrite complete | All six files on Level 3 template; ADR-001/002/003 present | Phase 2 |
| M3 | Closeout ready | `validate.sh --strict` passes cleanly on the phase folder | Phase 3 |
<!-- /ANCHOR:milestones -->

---
