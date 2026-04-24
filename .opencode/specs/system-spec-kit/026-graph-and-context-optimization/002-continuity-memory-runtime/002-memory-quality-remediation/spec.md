---
title: "F [system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec]"
description: "Parent packet spec for the shipped remediation train plus the scoped Phase 8 and Phase 9 follow-ons triggered by later packet audits."
trigger_phrases:
  - "memory quality parent spec"
  - "d1 d8 packet closeout"
  - "five phase remediation train"
  - "phase documentation map"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-06 |
| **Branch** | `system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation` |
| **Packet Shape** | Parent packet with 10 child phases |
| **Research State** | Complete |
| **Implementation State** | Mixed across child phases; see phase map for current truth |
| **Operational Tail State** | Complete with PR-10 dry-run and PR-11 deferred-with-rationale |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../001-cache-warning-hooks/spec.md |
| **Successor** | ../003-continuity-refactor-gates/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The original research packet identified eight distinct JSON-mode memory defects across content shaping, metadata consistency, lineage capture, git provenance, and template structure. Shipping only the research would have left the save pipeline unrepaired, and shipping only the narrow code fixes would have left the packet without phase-level proof, operational tail decisions, or a durable closeout surface.

### Purpose

Capture the final parent contract for the shipped remediation train: Phases 1-5 delivered their phase-local outcomes, their validation surfaces are linked from this packet, and the parent folder now serves as the packet-level source of truth for what shipped, what intentionally deferred, and which parent-gate follow-ups remain open.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in the packet decision record and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Packet-level documentation for the completed five-phase remediation train.
- Phase-level status roll-up, checklist evidence, and implementation-summary synchronization.
- Parent closeout coverage for PR-1 through PR-11, including explicit deferral status where Phase 5 kept a tail item optional.
- Packet-level verification reporting that points readers to the phase-local checklists and validation surfaces.

### Out of Scope

- Reopening code work already landed in Phases 1-5.
- Rewriting historical memory files beyond the Phase 5 dry-run artifact.
- Inventing new follow-on remediation beyond the packet's documented optional tail decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Record the final parent packet state and phase map. |
| `checklist.md` | Modify | Link packet-level remediation items to the phase-local CHK evidence. |
| `implementation-summary.md` | Modify | Summarize the full PR-1 through PR-11 closeout story. |

<!-- ANCHOR:phase-map -->
### Phase Documentation Map

Phases 1-5 remain the shipped remediation train, but only Phase 1 is fully parent-closed in this packet snapshot. Phases 6-10 are approved follow-on packets that extend this parent tracking map without changing the historical closeout record for the first five phases. The later children split into three lanes: `008-input-normalizer-fastpath-fix` closes the Phase 6 runtime hole, `009-post-save-render-fixes` repairs the live render-layer defects surfaced by the 2026-04-09 packet-014 audit, and `010-memory-save-heuristic-calibration` closes the remaining schema, validator, and D5 heuristic gaps identified by the same-day RCA and skipped-recommendation audits.

| Phase | Priority | Folder | Focus | PRs / Defects | Depends On | Status |
|-------|----------|--------|-------|---------------|------------|--------|
| 1 | P0 | `001-foundation-templates-truncation/` | Anchor-template fix, shared truncation helper, OVERVIEW preservation | PR-1 (D8), PR-2 (D1) | — | Complete |
| 2 | P1 | `002-single-owner-metadata/` | Importance-tier single-owner contract and provenance-only JSON enrichment | PR-3 (D4), PR-4 (D7) | Phase 1 | Complete |
| 3 | P2 | `003-sanitization-precedence/` | Trigger-phrase sanitization and authored-decision precedence | PR-5 (D3), PR-6 (D2) | Phase 2 | Complete |
| 4 | P3 | `004-heuristics-refactor-guardrails/` | Conservative predecessor discovery, SaveMode refactor, reviewer guardrails | PR-7 (D5), PR-8 (SaveMode), PR-9 (reviewer) | Phases 1-3 | Complete |
| 5 | P4 | `005-operations-tail-prs/` | Telemetry artifacts, PR-10 dry-run, PR-11 defer/ship decision, parent closeout | PR-10 (migration dry-run), PR-11 (deferred), PR-9 telemetry fold-in | Phase 4 | Phase-local complete, parent gates pending |
| 6 | P5 | `006-memory-duplication-reduction/` | Narrow the future implementation home to the compact-wrapper and canonical-doc-ownership contract identified by the sibling `001/.../006-research-memory-redundancy` packet. Focus future runtime work on collector, workflow, template-contract, and template-body surfaces plus bounded verification rather than a broad residual-dedup rewrite. | Implementation re-scope + bounded follow-on PRs (P12-P13) | Phases 1-5 stable and sibling redundancy synthesis complete | Complete |
| 7 | P6 | `007-skill-catalog-sync/` | Audit downstream docs, templates, commands, MCP surfaces, and agents only after the narrower Phase 6 compact-wrapper contract lands, so parity review targets the final wrapper behavior instead of a broader dedupe program. | Review + update PRs (P14-P15) | Phase 6 (final compact-wrapper contract required before auditing downstream artifacts) | Complete |
| 8 | P7 | `008-input-normalizer-fastpath-fix/` | Repair the input-normalizer fast path so packet-local save generation preserves normalized trigger shaping and compact-wrapper structure instead of bypassing the hardened path. | Fast-path normalization fix | Phase 6 contract stable and runtime save path isolated | Complete |
| 9 | P8 | `009-post-save-render-fixes/` | Repair the nine render-layer defects still visible in live compact-wrapper saves after Phase 6 shipped: title suffix garbage, empty canonical sources, zeroed file counts, trigger noise, duplicated evidence, stale phase or status, missing lineage, self-referential parent spec, and ambiguous quality-score names. | Render-layer follow-on fixes (A-I) | Phase 6 runtime stable and the 014 memory audit complete | Implemented |
| 10 | P9 | `010-memory-save-heuristic-calibration/` | Close the remaining memory-save schema, sanitizer, validator, and continuation-linker gaps still exposed by the 2026-04-09 RCA and skipped-recommendation audits: explicit title/description/causal-links payload fields, manual DR trigger preservation, V8/V12 calibration, D5 linker-reviewer alignment, and REC-003 helper cleanup. | RCA Issues 1-5 + REC-003/006/008/018 | Phase 9 render fixes shipped and the RCA/skipped-recommendation audits complete | Implemented |

*Parent note: Child phases may be phase-local complete while parent strict-validation blockers in `plan.md` and `tasks.md` remain out of scope for those folders; this remediation workstream is tracked in `implementation-summary.md`.*

### Phase Transition Rules

- Each child phase validates independently before parent roll-up.
- Phase-local checklists own the detailed CHK evidence for each remediation slice.
- The parent packet records aggregate status only after the child folder evidence is attached.
- Packet closeout remains truthful even when an optional Phase 5 tail item is deferred with rationale.

### Phase Handoff Criteria

| From Phase | To Phase | Handoff Contract | Exit Signal |
|------------|----------|------------------|-------------|
| `001-foundation-templates-truncation` | `002-single-owner-metadata` | Phase 1 foundations are merged and the shared truncation/template surfaces are stable enough for metadata-owner work. | F-AC1 and F-AC7 green; phase validator exit `0`. |
| `002-single-owner-metadata` | `003-sanitization-precedence` | Phase 2 single-owner metadata fixes are merged and JSON-mode provenance is stable enough for sanitization and authored-decision precedence work. | F-AC4 and F-AC6 green; phase validator exit `0`. |
| `003-sanitization-precedence` | `004-heuristics-refactor-guardrails` | Phase 3 sanitization and authored-decision precedence are merged and degraded-payload regressions are understood before heuristic/refactor work begins. | F-AC2 and F-AC3 green plus degraded-payload regression coverage; phase validator exit `0`. |
| `004-heuristics-refactor-guardrails` | `005-operations-tail-prs` | Phase 4 heuristic guardrails and reviewer hardening are merged, leaving the operational tail as the next valid packet slice. | F-AC5 and F-AC8 green plus 3+ lineage fixture and broken D1/D4/D7/D8 fixture coverage; phase validator exit `0`. |
| `005-operations-tail-prs` | `006-memory-duplication-reduction` | Phase 5 closeout complete (all PR-1..PR-9 merged + telemetry live). Memory save pipeline stable enough that residual duplication can be measured against the post-fix baseline. | All Phase 1-5 fixtures green; parent validate.sh exit <=1. |
| `006-memory-duplication-reduction` | `007-skill-catalog-sync` | Phase 6 implementation merged. Final memory pipeline behavior frozen so downstream artifacts can be audited against a stable surface. | Phase 6 acceptance fixtures green; phase validate.sh exit 0. |

> **Handoff waiver (recorded 2026-04-08 during deep-review remediation):** The Phase 5→6 and Phase 6→7 handoff gates are explicitly waived for the 026-graph-and-context-optimization remediation cycle. Rationale: the Phase 5 closeout criterion depends on parent strict validation which is blocked by out-of-scope plan/tasks drift (addressed by P1-007), and Phase 6 implementation state is being normalized to placeholder under P1-012. Gates should be re-evaluated when the parent remediation workstream completes. See `implementation-summary.md` §Deep-Review Remediation Cycle for the consolidated cross-reference evidence.
<!-- /ANCHOR:phase-map -->
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All five child phases must validate cleanly under the strict packet validator. | Each phase folder returns exit code `0` from `validate.sh --strict`. |
| REQ-002 | The parent packet must link every completed remediation slice to phase-local checklist evidence. | Parent checklist items point to phase-local CHK IDs for D1-D8 and the operational tail. |
| REQ-003 | Parent docs must reflect the final train state rather than the earlier research-only snapshot. | `spec.md`, `checklist.md`, and `implementation-summary.md` all describe the packet as complete. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Phase 5 must record PR-10 and PR-11 truthfully. | PR-10 is documented as dry-run-only in this packet, and PR-11 is explicitly deferred with rationale. |
| REQ-005 | The parent phase map must stay aligned with the child folders. | Each phase row matches the actual child-folder validation and checklist state. |
| REQ-006 | Packet-level verification reporting must surface remaining out-of-scope blockers honestly. | Final reporting distinguishes fixed scoped docs from parent validation blockers in out-of-scope files. |

### Acceptance Scenarios

**Scenario A: Phase-local validation gates the packet**

- **Given** the completed Phase 1-5 child folders,
- **When** each child folder is run through `validate.sh --strict`,
- **Then** every child phase returns exit code `0`,
- **And** the parent packet can link packet-level claims back to those validated child folders.

**Scenario B: Phase evidence rolls up without losing detail**

- **Given** the completed remediation train,
- **When** the parent checklist summarizes D1-D8 and the operational tail,
- **Then** each packet-level item cites the owning phase checklist CHK IDs,
- **And** the parent packet avoids restating phase evidence as unsupported prose.

**Scenario C: Optional tail work stays explicit**

- **Given** Phase 5 closed with PR-10 dry-run evidence and a PR-11 defer rationale,
- **When** the parent implementation summary describes the full train,
- **Then** it records PR-10 as dry-run-only in this packet,
- **And** it records PR-11 as deferred rather than implying it shipped.

**Scenario D: Parent closeout remains honest about remaining blockers**

- **Given** the parent folder still contains out-of-scope plan/tasks/memory validation drift,
- **When** the final verification report is produced,
- **Then** the report distinguishes those blockers from the now-clean child phases,
- **And** it does not claim a full parent strict pass unless the out-of-scope files are also remediated.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase map shows all ten child phases with statuses that match each child folder's current metadata.
- **SC-002**: The parent checklist links packet-level remediation claims to phase-local CHK evidence.
- **SC-003**: The parent implementation summary accurately describes PR-1 through PR-11 closeout status, including Phase 5 defer decisions.
- **SC-004**: Child-phase validation passes are easy to verify from the packet root documentation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase-local checklists remain the detailed evidence owners | Parent claims can drift from child evidence if phase checklists are not kept current | Point packet-level evidence directly at child CHK IDs and update both together |
| Risk | Parent packet still carries older research-era docs outside the scoped files | Parent strict validation can still fail even after the phase docs are synchronized | Report those blockers explicitly as out-of-scope until the parent plan/tasks/memory files are remediated |
| Risk | Optional Phase 5 tail work is misread as shipped work | Release or audit readers could overstate the packet outcome | Keep PR-10 apply and PR-11 status explicit in both checklist and summary |
| Dependency | Phase 5 dry-run artifact remains the only approved historical-migration evidence in this packet | Historical repair claims can become overstated | Limit historical-fix statements to the dry-run classification and defer any apply claims |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Traceability

- Parent packet claims must be traceable to a phase checklist, validator run, or phase-local artifact.
- Child-phase and parent-phase wording should describe the same shipped state.

### Maintainability

- Parent docs should summarize rather than duplicate the full child evidence.
- Optional tail work must stay explicit so follow-on operators know what still requires approval.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Child phases pass while the parent packet still fails because of out-of-scope files: report the split state honestly.
- Optional tail work is deferred: keep the phase complete but record the defer rationale clearly.
- Historical migration evidence exists only as dry-run output: do not describe apply-time results that never happened in this packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Five child phases plus packet-level roll-up |
| Risk | 18/25 | Parent claims can drift if they outpace child evidence |
| Research | 14/20 | Research is complete, but packet closeout still depends on accurate synthesis |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the out-of-scope parent `plan.md`, `tasks.md`, and `memory/` validation drift be remediated in a follow-on packet closeout pass?
- If PR-10 apply is ever approved, should the resulting historical-file evidence live in this packet or in a dedicated migration follow-up?
<!-- /ANCHOR:questions -->
