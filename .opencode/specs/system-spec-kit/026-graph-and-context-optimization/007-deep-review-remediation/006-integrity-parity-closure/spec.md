---
title: "Feature Specification: Integrity Parity Closure"
description: "Level 3 remediation sub-phase for closing cross-packet integrity defects, parity drift, and governance gaps surfaced by the 026 cross-phase synthesis."
trigger_phrases:
  - "integrity parity closure"
  - "026 007 006"
  - "cross-phase remediation"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure"
    last_updated_at: "2026-04-23T21:53:25Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 3 remediation packet from cross-phase synthesis and findings"
    next_safe_action: "Start Phase 1 P0 correctness remediation"
    completion_pct: 5
    status: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Integrity Parity Closure
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This sub-phase is the closure packet for the integrity defects, parity drift, and governance gaps that still keep 026 from making trustworthy readiness claims. It turns the cross-phase synthesis into a concrete remediation contract: close the nine P0 defects, convert the leading seven P1 drifts into authoritative runtime contracts, and require live proof before status promotion.

**Key Decisions**: Treat live verification as a promotion gate, keep every requirement mapped to CF identifiers, preserve the user-scoped seven-file packet shape.

**Critical Dependencies**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-synthesis.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-findings.json`

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planning |
| **Created** | 2026-04-23 |
| **Branch** | `006-integrity-parity-closure` |
| **Parent** | 007-deep-review-remediation |
| **Source** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-synthesis.md` |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
026 still lacks a single trusted closure packet for the integrity defects, parity drift, and governance gaps that keep runtime-readiness and remediation status surfaces out of sync with actual behavior. The `Recommended Sub-Phase Scope` block in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/cross-phase-synthesis.md` frames this packet as the place where live proof becomes the promotion gate for scan, index, routing, executor, and packet-status claims.

### Purpose
Success means 026 can point to one packet that closes the remaining cross-phase integrity and parity blockers with replayable evidence instead of stale status prose.

### Cross-Cutting Themes

| Theme | Severity | Meaning for this packet |
|-------|----------|-------------------------|
| Operational proof trails implementation | P0 | Readiness claims must be backed by current live acceptance reruns. |
| Documentation and status surfaces drift from runtime truth | P1 | Specs, summaries, and operator docs must stop overstating closure. |
| Cross-runtime parity remains uneven | P1 | Runtime, wrapper, and lifecycle behavior must converge across supported paths. |
| Concurrency and freshness guards rely on partial contracts | P0 | Save, scan, and index flows still have integrity-risking split contracts. |
| Deep-loop governance is not self-enforcing | P0 | Deep-research and executor workflows still advertise guarantees they do not fully enforce. |

### P0 Findings Summary

| CF ID | Summary |
|-------|---------|
| CF-001 | Root roadmap and convergence labels are stale enough to mis-sequence follow-on work. |
| CF-002 | Scan and index acceptance remains open, so current readiness claims are not authoritative. |
| CF-005 | Routed full-auto saves can lose writes because merge preparation happens before lock acquisition. |
| CF-009 | Manual `code_graph_scan` still bypasses staged persistence and can mark broken files fresh. |
| CF-014 | Child-phase deep-research runs split artifacts across competing roots. |
| CF-017 | The release-cleanup result vocabulary is internally inconsistent around `UNAUTOMATABLE`. |
| CF-019 | Skill-advisor pass/fail freezes before graph conflict penalties are applied. |
| CF-022 | The 005-006 campaign still has a live P0 blocker that needs write-authorized follow-up or explicit ADR deferral. |
| CF-025 | Non-native executor runs remain fail-by-contract because canonical iteration metadata and failure events are misordered. |

### Top 7 P1 Findings Summary

The structured findings file does not expose a separate ranking field, so this packet treats the leading seven P1 entries in source order as the requested top-seven slice.

| CF ID | Summary |
|-------|---------|
| CF-003 | Routing-quality claims still rely on predictive or observe-only telemetry instead of live measurement. |
| CF-004 | Copilot parity work is still reverted, and the remediation backlog trails live 009 truth. |
| CF-006 | Resume behavior has drifted across runtime code, tests, and packet docs. |
| CF-007 | Save and index concurrency protection still depends on soft or partial contracts. |
| CF-010 | Code-graph trust metadata differs across query, context, startup, and docs. |
| CF-011 | Public code-graph schemas lag the live handler contract. |
| CF-012 | Selective code-graph refresh still over-walks the tree and under-scopes debounce reuse. |
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Closing the nine cross-phase P0 findings with implementation evidence or explicit defer decisions where the synthesis allows it.
- Converting the leading seven P1 findings into authoritative runtime, parity, and governance contracts.
- Requiring live verification evidence before this packet or its parent claims readiness.
- Updating the parent `007-deep-review-remediation` graph metadata so the new sub-packet becomes discoverable.

### Out of Scope
- Broad P2 cleanup or archive beautification unrelated to the listed finding IDs.
- New product features or refactors not directly tied to the selected CF findings.
- Editing files outside the finding-owned paths and the parent packet metadata needed to register this sub-phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md` | Modify | Refresh root packet state model for CF-001. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/deep-research-dashboard.md` | Modify | Reconcile archived roadmap labeling for CF-001. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md` | Modify | Record live acceptance evidence for CF-002. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/checklist.md` | Modify | Reflect completion evidence for CF-002. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md` | Modify | Capture code-graph acceptance rerun evidence for CF-002. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | Modify | Fix lock ordering for CF-005. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Align routed save behavior for CF-005. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | Modify | Add save-race regression coverage for CF-005. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts` | Modify | Share staged persistence contract for CF-009. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Modify | Route manual scans through the shared commit path for CF-009. |
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Modify | Centralize artifact-root resolution for CF-014. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Align deep-research workflow pathing and executor events for CF-014 and CF-025. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Update documented artifact-root contract for CF-014. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Normalize result-class vocabulary for CF-017. |
| `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` | Modify | Align runner output vocabulary for CF-017. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/tasks.md` | Modify | Reconcile packet-level result-class language for CF-017. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Modify | Reorder pass/fail derivation for CF-019. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/001-graph-and-metadata-quality/checklist.md` | Modify | Record the CF-022 closure path. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/spec.md` | Modify | Reconcile parent remediation status for CF-022. |
| `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl` | Modify | Write executor metadata early for CF-025. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Modify | Accept typed executor failure events for CF-025. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` | Modify | Attach canonical executor metadata for CF-025. |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CF-001 root packet state model refreshed to distinguish implemented, narrowed, reopened, and still-open work. | Root packet docs stop conflating research convergence with operational acceptance. |
| REQ-002 | CF-002 scan and index readiness claims gated on live acceptance reruns. | Packet evidence links show current successful reruns before status promotion. |
| REQ-003 | CF-005 merge preparation moved or recomputed inside the folder lock. | Routed save regressions cover the pre-lock data-loss path. |
| REQ-004 | CF-009 manual scan and ensure-ready share one staged persistence helper. | Broken writes can no longer mark stale data fresh through the manual path. |
| REQ-005 | CF-014 child-phase deep-research prompts, state, deltas, and synthesis use one artifact root. | Runtime and docs resolve the same canonical research location. |
| REQ-006 | CF-017 playbook, runner, and packet-level result vocabulary normalized. | Wrapper release evidence no longer depends on contradictory result classes. |
| REQ-007 | CF-019 skill-advisor threshold pass/fail derived after all mutators finish. | Conflicting recommendations no longer pass before graph penalties apply. |
| REQ-008 | CF-022 blocker closed through write-authorized follow-up or explicit defer decision. | Packet records either a concrete owner-backed follow-up or a formal defer rationale. |
| REQ-009 | CF-025 executor metadata and typed failure events emitted before validation. | Non-native executor runs no longer fail because canonical records are incomplete. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | CF-003 predictive routing proof replaced with live telemetry evidence. | Readiness claims cite real routing measurements, not predictive counters alone. |
| REQ-011 | CF-004 Copilot parity work reapplied and 007 backlog aligned to 009 truth. | Wrapper wiring and backlog surfaces agree on current parity state. |
| REQ-012 | CF-006 one resume contract adopted across runtime, tests, and packet docs. | Gate D and Gate E docs match shipped selection logic. |
| REQ-013 | CF-007 save/index guardrails hardened into explicit contracts. | Routed and scoped regressions cover the highest-risk concurrency paths. |
| REQ-014 | CF-010 code-graph trust metadata routed through one provenance layer. | Query, context, startup, and docs emit the same trust vocabulary. |
| REQ-015 | CF-011 code-graph public schemas brought into parity with handlers. | Validated inputs can reach the supported handler contract without dead fields. |
| REQ-016 | CF-012 direct stale-file refresh and scoped readiness debounce added. | Unrelated requests cannot reuse the same freshness decision incorrectly. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine P0 findings are fixed with linked evidence, or the packet records an explicit owner-backed defer decision where the synthesis allows it.
- **SC-002**: The selected top-seven P1 findings are fixed with one authoritative runtime, parity, or governance contract surface for each.
- **SC-003**: Live verification passes for the scan, index, routing, executor, and wrapper claims that this packet closes.
- **SC-004**: `007-deep-review-remediation/graph-metadata.json` includes this child packet and remains parseable and ordered.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live-capable runtime access | Without it, readiness claims stay blocked. | Record blocked proof explicitly and do not promote status. |
| Dependency | Historical packet authority for CF-022 | Missing authority blocks closure of the live P0. | Open a write-authorized follow-up or formal defer path. |
| Risk | Scope creep across cross-packet files | The packet could become a cleanup bucket. | Keep every task and requirement mapped to CF ids. |
| Risk | Conflicting contract rewrites in shared files | Multiple findings target the same surfaces. | Centralize edits through one contract per file family. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Live verification evidence must be current enough to support readiness promotion in the active packet state.

### Security
- **NFR-S01**: Permission and wrapper contract changes must not widen runtime capabilities without matching documentation and smoke coverage.

### Reliability
- **NFR-R01**: Packet metadata and evidence paths must remain parseable by graph and memory tooling.

## 8. EDGE CASES

### Data Boundaries
- Duplicate target paths across findings must resolve to one coherent contract change, not stacked contradictory edits.
- Missing ranking metadata in the structured findings file must not cause silent reshaping of the selected P1 slice.

### Error Scenarios
- If a live rerun still fails, the packet must record the blocker and owner instead of promoting readiness.
- If historical source packets are intentionally immutable, CF-022 must move to explicit defer rationale rather than staying implicit.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 16 finding-owned requirements across shared runtime and doc surfaces |
| Risk | 23/25 | Data integrity, readiness truth, and executor correctness are directly affected |
| Research | 15/20 | Cross-packet evidence and live reruns must be reconciled |
| Multi-Agent | 3/15 | Packet is authored in one pass, implementation may later fan out |
| Coordination | 12/15 | Parent and child status surfaces must stay aligned |
| **Total** | **75/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Live verification remains blocked after code fixes | H | M | Treat blocked proof as incomplete, not complete |
| R-002 | Shared contract edits regress another phase surface | H | M | Read and verify every touched target file in task scope |
| R-003 | Parent and child status surfaces drift again | M | M | Update graph metadata and packet docs together during closure |

## 11. USER STORIES

### US-001: Runtime Owner Closure (Priority: P0)

**As a** remediation owner, **I want** one packet that groups the remaining integrity and parity blockers, **so that** I can close them without re-reading all ten source phases.

**Acceptance Criteria**:
1. Given the packet is in planning, When I start implementation, Then every P0 blocker already maps to a CF-owned requirement and task.
2. Given a readiness claim is closed, When I review the packet, Then live evidence is linked before status promotion.
3. Given multiple source phases are involved, When I inspect scope, Then the affected file surfaces are listed explicitly.

### US-002: Reviewer Proof Replay (Priority: P1)

**As a** reviewer, **I want** packet docs and metadata that match runtime truth, **so that** I can replay closure without rediscovering the original synthesis.

**Acceptance Criteria**:
1. Given I open `tasks.md`, When I inspect a task, Then it cites the CF id and the contributing phase context.
2. Given I open `checklist.md`, When a task is marked complete, Then there is an evidence placeholder or linked proof trail.
3. Given I inspect graph metadata, When I traverse the parent packet, Then this child packet is discoverable in sorted child lists.

## 12. OPEN QUESTIONS

- Which live-capable runtime will own the final reruns for scan, index, routing, wrapper, and executor evidence?
- Will CF-022 close through write authority or through an explicit defer path?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: Omitted in this user-scoped seven-file packet; record defer rationale inside `implementation-summary.md` if needed.
