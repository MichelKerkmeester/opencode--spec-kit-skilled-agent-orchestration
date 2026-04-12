---
title: "Gate E — Runtime Migration Plan"
description: "Cutover plan."
trigger_phrases: ["gate e", "plan"]
importance_tier: "important"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "018/005-gate-e-runtime-migration"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Plan sync"
    next_safe_action: "Run"
    key_files: ["plan.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate E — Runtime Migration

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript, Markdown, YAML, shell validation |
| Framework | system-spec-kit plus Spec Kit Memory MCP |
| Storage | SQLite-backed memory/index state plus spec-doc continuity |
| Testing | Targeted runtime verification, grep sweeps, markdown validation, `validate.sh --strict` |

### Overview

Gate E is no longer a staged rollout plan. The runtime migration is a single canonical flip: find the remaining flag or control-plane hook, make the new path canonical immediately, remove the retired rollout scaffolding, verify a sample save, then finish the mapped documentation fanout so the repo teaches the same contract that the runtime now enforces.

This packet does not assume the repo-wide exit gate is already satisfied. It tracks the closeout path honestly: immediate cutover first, doc parity second, packet and repo validation last.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] Packet scope is limited to Gate E runtime migration and parity work.
- [x] Entry-gate expectations are explicit in the operator directive: Gate D closed, 13 regressions green, perf targets met, Gate B cleanup complete, Gate C writers present.
- [x] Required evidence sources are identified: packet docs, handover, resource-map slices, and cited research iterations.

### Definition of Done

- [ ] Canonical continuity is the only live runtime path.
- [ ] Required mapped surfaces are updated or remaining gaps are explicitly recorded.
- [ ] CLI handback docs match the shipped `generate-context.js` contract.
- [ ] Packet-local validation passes and the implementation summary records real results.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Immediate canonical cutover plus parity fanout.

### Key Components

- Canonical runtime path: the active save and continuity flow after Gate E.
- Retired rollout scaffolding: shadow and multi-state control-plane logic that must no longer shape active guidance.
- Doc parity batches: commands, agents, CLI handback docs, skills, top-level docs, and sub-READMEs from the resource map.
- Packet closeout evidence: validation output, touched-file lists, and implementation notes captured in this phase folder.

### Data Flow

The implementation path sets canonical continuity unconditionally, then the doc fanout updates the repo surfaces to match that runtime truth. Packet closeout follows after validation and evidence are attached. No observation ladder or staged promotion logic sits between these steps.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. Implementation Phases

### Phase 1: Canonical runtime flip

- [ ] Locate the remaining feature-flag or control-plane plumbing for canonical continuity.
- [ ] Set the new path as canonical immediately, or remove the retired flag if it no longer serves a purpose.
- [ ] Remove rollout-era shadow and state-machine scaffolding from active runtime-facing surfaces.
- [ ] Verify a sample save end to end before calling the cutover complete.

### Phase 2: Parallel doc parity fanout

- [ ] Update command and workflow surfaces.
- [ ] Update agent surfaces.
- [ ] Update the 8 CLI handback files to the current JSON-primary contract.
- [ ] Update `sk-*` and system-spec-kit internal docs.
- [ ] Update top-level docs and mapped sub-READMEs.
- [ ] Sweep for retired continuity language in the updated surfaces.

### Phase 3: Packet and repo closeout

- [ ] Run packet-local markdown validation.
- [ ] Run `validate.sh --strict` for this packet and capture the result.
- [ ] Update `implementation-summary.md` with touched files, validation state, and any sample post-flip metrics that actually exist.
- [ ] Mark the packet complete only after the evidence is attached.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Runtime verification | Canonical path active, sample save succeeds | targeted runtime invocation and save-path checks |
| Contract verification | CLI handback docs match live save contract | `generate-context.js --help`, targeted grep, file diffs |
| Documentation verification | Packet docs and parity surfaces remain structurally valid | `validate_document.py`, `git diff --check`, packet validator |
| Scope verification | Retired continuity terms are removed from updated files | targeted `rg` sweeps against banned phrases |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gate B, C, and D completion state | Internal | Assumed per operator directive | Runtime cutover truth becomes uncertain |
| Resource-map surface inventory | Internal | Available | Broad parity fanout can miss required files |
| Current `generate-context.js` behavior | Internal | Available | CLI handback docs could drift from runtime truth |
| Packet-local validation scripts | Internal | Pending run | Packet closeout cannot be claimed cleanly |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- Trigger: Canonical path verification fails before closeout, or doc parity exposes a contract mismatch that would mislead operators.
- Procedure: Revert the Gate E change set or the specific parity batch causing the mismatch, then re-run the targeted verification. There is no staged flag demotion ladder in this packet design.
- Constraint: Do not reintroduce the retired shadow or dual-write framework as a workaround.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Canonical runtime flip -> Parallel doc parity fanout -> Packet validation and closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Canonical runtime flip | Entry-gate assumptions and current save-path plumbing | Fanout language truth |
| Parallel doc parity fanout | Canonical runtime contract | Honest repo-wide guidance |
| Packet validation and closeout | Completed packet docs and available validator output | Gate E completion claim |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Canonical runtime flip | Medium | Short focused implementation pass |
| Parallel doc parity fanout | High | Large fanout across mapped surfaces |
| Packet validation and closeout | Medium | Dependent on final verifier runs |
| Total | | One concentrated implementation and verification cycle |
<!-- /ANCHOR:effort -->

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the packet remains within the owned markdown files.
- Use the resource-map only as a read-only scope authority.
- Keep packet status honest if repo-wide closeout is still in flight.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-018E | Do not edit research, resource-map, or sibling packet docs | Preserves packet boundaries |
| AI-CANONICAL-018E | Describe one canonical runtime path only | Matches the requested migration model |
| AI-VERIFY-018E | Record validator state exactly as run | Prevents invented closeout evidence |
| AI-CLOSEOUT-018E | Use `implementation-summary.md` as the packet evidence ledger | Keeps closeout state auditable |

### Status Reporting Format

- Start state: canonical cutover status, parity status, and remaining packet blockers.
- Work state: packet-only edits plus validator remediation progress.
- End state: packet validated, awaiting runtime proof, or ready for orchestrator closeout.

### Blocked Task Protocol

1. Stop if a completion claim depends on unrun validation.
2. Leave the task and checklist item open.
3. Record the missing proof in the implementation summary.
