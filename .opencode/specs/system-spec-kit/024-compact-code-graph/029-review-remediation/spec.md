---
title: "Spec: Review Remediation [024/029] [system-spec-kit/024-compact-code-graph/029-review-remediation/spec]"
description: "Plan the Level 2 remediation packet for the seven active deep-review findings that remain after the compact code graph review converged."
trigger_phrases:
  - "029"
  - "review remediation"
  - "deep review findings"
  - "compact code graph remediation"
  - "active p1 findings"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/029-review-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 29 (`029-review-remediation`) |
| **Predecessor** | `028-startup-highlights-remediation` |
| **Successor** | `030-opencode-graph-plugin` |
| **Handoff Criteria** | All six active P1 findings are remediated with verification evidence, and the advisory P2 parity follow-up is either completed or truthfully deferred |

# Spec: Review Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Phase**: 029 (child of 024-compact-code-graph)
- **Level**: 2 (verification-heavy packet covering multiple runtime and documentation surfaces)
- **Status**: Complete
- **Created**: 2026-04-03
- **Origin**: parent deep review report in the `../review/` folder
- **Planning trigger**: Root packet remains `CONDITIONAL` with active findings `P1=6`, `P2=1`
- **Release posture**: All six active P1 findings are blockers for packet closeout; the single active P2 is advisory unless explicitly promoted
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The completed deep review for `024-compact-code-graph` found seven active issues that leave the packet internally inconsistent across runtime contracts, hook safety, evidence traceability, and cross-runtime guidance. The current tree still advertises behavior that either is not implemented, is documented inconsistently, or is proven with stale evidence. Until these findings are remediated or explicitly downgraded with truthful packet updates, the parent packet cannot be treated as release-ready.

### Purpose

Define and execute one focused remediation packet that closes the active review registry without reopening unrelated packet work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remediate the six active P1 findings `P1-001` through `P1-006`
- Complete the optional advisory follow-up for `P2-001` when the parity fix stays scoped
- Keep implementation and documentation work organized under the review-defined workstreams `WS-1` through `WS-6`
- Update the runtime and packet surfaces named by the parent deep review report
- Verify the repaired contracts, evidence owners, and runtime guidance before closing this packet

### Out of Scope
- Reopening `030-opencode-graph-plugin/` or any other sibling packet outside this phase
- Introducing new review findings beyond the active registry captured in the parent deep review report

### Workstreams and Likely Files to Change

| Workstream | Findings | Priority | Likely Files to Change |
|-----------|----------|----------|------------------------|
| WS-1 Recovery API truth-sync | P1-001 | Blocker | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` |
| WS-2 Root packet evidence repair | P1-002 | Blocker | `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md`, `.opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md`, child packet evidence references for phases 015/016 if needed |
| WS-3 Hook safety and autosave hardening | P1-003, P1-004 | Blocker | `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` |
| WS-4 Runtime guidance parity | P1-005 | Blocker | `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md`, `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md`, `AGENTS.md` |
| WS-5 Structural bootstrap budget enforcement | P1-006 | Blocker | `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md`, `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/plan.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` |
| WS-6 Advisory context-prime alignment | P2-001 | Advisory | `.opencode/agent/context.md`, `.claude/agents/context.md`, `.codex/agents/context-prime.toml` |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must enumerate all six active P1 findings as implementation blockers. | `spec.md`, `plan.md`, and `tasks.md` each map the six P1 findings to concrete remediation workstreams and do not present them as already fixed. |
| REQ-002 | The packet must keep the remediation scope limited to the active review registry. | No task or plan item expands into unrelated startup, plugin, or packet-wide refactors beyond P1-001 through P1-006 and optional P2-001. |
| REQ-003 | The packet must truthfully distinguish blockers from advisory work. | P1 items are labeled blocker or required; P2-001 is labeled advisory and may remain deferred with justification. |
| REQ-004 | The packet must name the likely code and document surfaces that future implementation will touch. | Every workstream lists the current files evidenced in the parent deep review report, plus any direct evidence target that may need synchronization. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | WS-1 must force a truth-sync decision for `session_bootstrap`: implement `nextActions` or relax public contracts. | The plan explicitly states both resolution paths and requires all three contract surfaces plus the live handler to agree. |
| REQ-006 | WS-2 must restore trustworthy root evidence for Phase 015/016 shipped status. | The plan names the root checklist and implementation summary as evidence owners and defines whether the fix is summary refresh, checklist repointing, or both. |
| REQ-007 | WS-3 must treat Gemini provenance fencing and Claude autosave targeting as separate hardening tasks under one workstream. | Tasks and checklist distinguish prompt-safety fencing from autosave packet selection validation. |
| REQ-008 | WS-4 and WS-5 must resolve packet-to-runtime contract drift rather than document around it ambiguously. | The packet requires either implementation alignment or explicit claim downgrades for Phase 021 and Phase 027. |
| REQ-009 | WS-6 must remain optional and clearly subordinate to P1 closure. | The packet states that context-prime parity is advisory and should not block the parent packet unless promoted. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementer can pick up this packet and see all seven active review items grouped into six workstreams with no ambiguity about priority.
- **SC-002**: The packet names the exact contract and evidence surfaces that must be updated before the parent packet can be re-reviewed.
- **SC-003**: The checklist defines a realistic verification bar for contract truth-sync, evidence repair, hook safety, runtime guidance parity, and structural budget enforcement.
- **SC-004**: The packet docs, runtime surfaces, and verification evidence tell the truth about what shipped and what remains optional.

### Acceptance Scenarios

- **Given** the review report shows six active P1 findings, **When** this packet is read, **Then** each P1 appears as blocker-scoped work under WS-1 through WS-5.
- **Given** `P2-001` remains advisory in the review report, **When** this packet is read, **Then** WS-6 is documented as optional follow-up rather than release-blocking work.
- **Given** the review report points to specific implementation and packet files, **When** scope is reviewed, **Then** the packet lists those same files as likely change surfaces.
- **Given** implementation is complete, **When** readers inspect the packet, **Then** tasks, checklist, and implementation summary provide concrete evidence for each remediated workstream.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The parent deep review report remains the source of truth for the active registry | If the report changes, this packet can drift immediately | Re-check the active registry before implementation begins |
| Risk | A future implementation pass may update docs without aligning live handler behavior | The packet could appear fixed while runtime drift remains | Checklist requires code/schema/doc agreement for each contract workstream |
| Risk | Root evidence repair may touch multiple historical child packets | Review traceability could become noisy or over-broad | Prefer repointing to existing child evidence unless root summary truly needs a fresh truth-sync |
| Risk | Structural budget enforcement may reveal a mismatch between documented token claims and shared builder constraints | Either code scope grows or docs need a scoped downgrade | Force an explicit decision in WS-5 instead of leaving the claim ambiguous |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- WS-1 resolved in favor of implementation: `session_bootstrap` now returns a real `nextActions` payload so public contracts can stay additive and truthful.
- WS-2 resolved by refreshing the root implementation summary to current truth rather than repointing checklist evidence away from the root packet.
- WS-5 resolved in code: the shared structural bootstrap contract now enforces the documented 500-token hard ceiling instead of downgrading the packet language.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planning content must keep workstream descriptions concise enough for future implementers to scan quickly during remediation.
- **NFR-P02**: The packet must expose likely file targets without requiring another broad codebase discovery pass.

### Security
- **NFR-S01**: Hook-safety planning must preserve the provenance-fence requirement called out in the review rather than paraphrasing it loosely.
- **NFR-S02**: The packet must not imply that prompt-safety and autosave-targeting issues are already mitigated.

### Reliability
- **NFR-R01**: All packet-local cross-references in this phase must resolve, and any external runtime or repo references must point to current real files.
- **NFR-R02**: The packet must remain valid even if WS-6 is deferred after P1 closure.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Mixed runtime/documentation findings: keep the workstream split by problem type, not by file extension.
- Historical packet drift: mark older packet statements as superseded when they conflict with root/runtime guidance.

### Error Scenarios
- If the live handler and docs intentionally diverge for backward compatibility, document the divergence explicitly and remove claims of parity.
- If root evidence cannot be refreshed cleanly, repoint proof to the child packets that already hold the shipped truth.

### State Transitions
- Planning to implementation: checklist items stay unchecked until a future implementation pass generates real evidence.
- Advisory deferral: WS-6 may remain open after parent P1 closure, but only with written acknowledgement that the drift is maintenance debt.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Six blocker workstreams plus one advisory workstream across runtime code, packet docs, and agent docs |
| Risk | 20/25 | Includes prompt-safety, autosave correctness, and public contract drift |
| Research | 13/20 | Review evidence already exists, but implementation choices remain open for several findings |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
