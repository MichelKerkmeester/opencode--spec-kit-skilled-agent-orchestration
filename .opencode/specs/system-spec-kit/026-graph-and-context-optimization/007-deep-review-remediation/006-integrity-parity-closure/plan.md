---
title: "Imple [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/plan]"
description: "One-pass remediation plan for the Integrity Parity Closure sub-phase."
trigger_phrases:
  - "implementation plan integrity parity closure"
  - "026 007 006 plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure"
    last_updated_at: "2026-04-23T21:53:25Z"
    last_updated_by: "codex"
    recent_action: "Drafted remediation plan from cross-phase synthesis"
    next_safe_action: "Execute Phase 1 P0 correctness fixes"
    completion_pct: 5
    status: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Integrity Parity Closure
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, Python, YAML |
| **Framework** | system-spec-kit Level 3 remediation packet |
| **Storage** | Spec folder docs, graph metadata, runtime source files |
| **Testing** | `validate.sh --strict`, `jq empty`, live acceptance reruns |

### Overview
Use a one-pass remediation strategy driven by the cross-phase synthesis: close integrity-risking P0 defects first, then collapse the remaining architecture and parity drifts into explicit shared contracts, and only promote packet status after live evidence is attached.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Live verification evidence attached for readiness claims
- [ ] Docs and metadata updated together

### AI Execution Protocol

#### Pre-Task Checklist
- Read the finding-owned target files before editing them.
- Confirm the active CF id and contributing phases before each change.
- Verify whether a live rerun is required before marking the task complete.

#### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-ORDER | Phase 1 P0 correctness fixes land before Phase 2 or Phase 3 work. |
| TASK-SCOPE | Each change stays inside the CF-owned files listed in `spec.md`. |
| TASK-PROOF | No readiness or completion claim is promoted without attached evidence. |

#### Status Reporting Format
Report progress as CF id, files touched, verification result, and remaining blocker.

#### Blocked Task Protocol
If a live rerun or historical source edit is blocked, stop, record the blocker in packet docs, and do not promote status.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cross-phase remediation packet that coordinates runtime-contract fixes and status-surface reconciliation.

### Key Components
- **Integrity closure lane**: CF-002, CF-005, CF-009, CF-017, CF-019, CF-022, CF-025.
- **Architecture normalization lane**: CF-001 and CF-014.
- **Parity and governance lane**: CF-003, CF-004, CF-006, CF-007, CF-010, CF-011, CF-012.

### Data Flow
Synthesis scope feeds packet requirements, structured findings feed task text and file scope, implementation evidence feeds checklist closure, and the closeout pass updates both child and parent graph metadata.

### Approach
Favor the smallest set of runtime and documentation edits that can make runtime truth, packet truth, and verification truth agree again.

### Non-Functional Requirements
- Packet docs must remain internally consistent across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- JSON metadata must stay parseable by graph and memory tooling.
- The remediation path must avoid broad cleanup outside the listed CF-owned files.
- Completion claims must be evidence-backed and replayable from packet-local docs.

### Edge Cases
- If a live verification path still cannot run in the current runtime, record the blocker and owner rather than silently promoting status.
- If CF-022 cannot obtain write authority for historical source packets, record an explicit defer decision.
- If two CF findings point at the same file, preserve one coherent contract instead of layering contradictory fixes.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 9 P0 plus top-7 P1 scope from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-findings.json`
- [ ] Read every target file before editing
- [ ] Confirm live-capable verification ownership for readiness reruns

### Phase 2: Core Implementation
- [ ] Plan Phase 1: P0 correctness fixes for CF-002, CF-005, CF-009, CF-017, CF-019, CF-022, and CF-025
- [ ] Plan Phase 2: P0 architecture fixes for CF-001 and CF-014
- [ ] Plan Phase 3: P1 parity/governance fixes for CF-003, CF-004, CF-006, CF-007, CF-010, CF-011, and CF-012

### Phase 3: Verification
- [ ] Plan Phase 4: verification + graph metadata closeout
- [ ] Re-run packet-local and cross-packet live verification for closed readiness claims
- [ ] Update parent `007-deep-review-remediation/graph-metadata.json` in sorted order
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Packet docs and metadata | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [spec_folder] --strict` |
| JSON parsing | `description.json`, `graph-metadata.json`, parent `graph-metadata.json` | `jq empty` |
| Live acceptance | Scan, index, routing, wrapper, executor claims | packet-owned reruns in a live-capable runtime |
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-synthesis.md` | Internal doc | Green | Packet scope loses its authoritative narrative |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-findings.json` | Internal doc | Green | CF mapping and recommended-fix task text cannot be reconstructed safely |
| Existing 026 phase packets | Internal docs/code | Yellow | Status and runtime truth cannot be reconciled |
| Live-capable verification environment | Runtime dependency | Yellow | Readiness claims cannot be promoted with evidence |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation edit regresses integrity, keeps live verification failing, or breaks packet metadata.
- **Procedure**: Revert the specific CF-scoped change, reopen the matching task, retain the packet documentation, and keep the status in planning or in-progress until evidence is restored.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Status promotion |
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 sessions |
| Core Implementation | High | 4-7 sessions |
| Verification | High | 2-3 sessions |
| **Total** |  | **High-complexity Level 3 remediation packet** |
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| P0 correctness lane | Setup | Integrity-safe runtime behavior | Architecture and verification closure |
| P0 architecture lane | Setup | Canonical contract surfaces | Verification closure |
| P1 parity/governance lane | P0 correctness lane | Runtime-truth alignment | Final status reconciliation |
| Verification closeout | All implementation lanes | Evidence-backed packet closure | Completion |
<!-- /ANCHOR:dependency-graph -->
