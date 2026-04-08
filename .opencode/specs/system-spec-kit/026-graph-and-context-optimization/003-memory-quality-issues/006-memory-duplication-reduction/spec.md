---
title: "Feature Specification: Phase 6 — Memory Duplication Reduction"
description: "Phase 6 defines the narrowed implementation-owner follow-on that turns generated memory saves into compact retrieval wrappers while restoring canonical ownership to packet docs."
trigger_phrases:
  - "phase 6 memory duplication reduction"
  - "memory dedupe phase"
  - "recent memory duplication"
  - "phase 6 deep research"
importance_tier: important
contextType: "planning"
---
# Feature Specification: Phase 6 — Memory Duplication Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child + level2-verify | v2.2 -->

---

Phase 6 is the first post-closeout follow-on phase for `003-memory-quality-issues`. It no longer starts from a broad residual-dedup charter. The sibling `001/.../006-research-memory-redundancy` packet has already completed that research and concluded that the real implementation home is a narrower wrapper-and-ownership contract: generated memory saves should become compact retrieval wrappers that point at canonical packet docs instead of replaying them.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P5 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Parent Tasks** | `../tasks.md` |
| **Parent Checklist** | `../checklist.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | `005-operations-tail-prs` |
| **Successor** | `007-skill-catalog-sync` |
| **Validation Target** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction --strict` |
| **Handoff Criteria** | Phase 5 closeout is complete, telemetry is live, and the post-fix memory surface is stable enough to measure duplication against a trustworthy baseline. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 1-5 fixed the save pipeline and the operational tail, but they did not finish one continuity-lane contract: what the generated memory save should actually own once canonical packet docs already exist. The sibling follow-on research now says the biggest remaining issue is not a generic residual-dedup backlog. It is that the current save surface still over-owns packet narrative by restating long-form content already captured in canonical packet docs.

That means Phase 6 should stop framing itself as a fresh five-dimension research program. The research is already done. The remaining work is to apply that synthesis to the generator and template surfaces that currently turn saves into packet-shaped narratives.

### Purpose

Apply the completed redundancy synthesis to one bounded implementation contract: `PR-12` should convert default saves into compact retrieval wrappers with canonical-doc pointers, distinguishing evidence, recovery hints, and metadata. Optional `PR-13` may remain a bounded historical or migration follow-on only if the narrower wrapper contract lands cleanly first. The goal is to remove live duplication without harming retrieval clarity, provenance, reviewer safety, or downstream parity review.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** This packet is the implementation host for the compact retrieval wrapper memory save contract. Research authority: the sibling redundancy research packet, especially its remediation matrix and per-file change proposals. The contract flips memory saves from packet-narrative clones to compact wrappers that point at the packet decision record and implementation summary as canonical narrative owners. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Treat the sibling `001/.../006-research-memory-redundancy` packet as the research authority instead of rerunning the research locally.
- Implement the wrapper-and-ownership contract in the generator path.
- Update the default save shape so long-form packet meaning stays in canonical docs while memory saves keep distinguishing evidence, continuation state, recovery hints, and metadata.
- Add bounded reviewer or validation coverage for the new compact-wrapper contract.
- Re-run validation and document the final Phase 6 state so Phase 7 can audit downstream artifacts against a stable post-wrapper surface.

### Out of Scope

- Reopening D1-D8 root-cause remediation or the Phase 1-5 operational closeout.
- Broad redesign of the memory schema beyond the wrapper-and-ownership contract already identified by the sibling research packet.
- Downstream documentation, feature catalog, template, command, MCP, or agent-surface updates. Those belong to Phase 7.
- Re-running or redefining the five research iterations. Their outputs already exist in the sibling research packet and are frozen input to this phase.
- Low-severity historical cleanup items (`F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, `F005.4`) unless a later follow-up packet promotes them into scope.

### Files to Change During Phase Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Detect canonical packet docs, keep compact distinguishing evidence, and stop defaulting to packet-scale narrative restatement. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Bind compact wrapper inputs instead of long-form packet-summary sections by default. |
| `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts` | Modify | Make canonical sources and compact evidence mandatory while removing packet-clone sections from the default contract. |
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Modify | Render the compact retrieval wrapper instead of a packet narrative clone. |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Add reviewer checks that protect the compact-wrapper contract. |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | Modify | Keep anchors and metadata aligned to the reduced wrapper shape. |
| `research/research.md`, `research/findings-registry.json` | Read-only authority | Keep the sibling synthesis and findings registry as the source of truth for this narrowed implementation phase. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modify | Keep the phase contract, verification, and final closeout synchronized with the actual remediation. |

### Implementation Focus

1. Canonical doc detection and pointer generation.
2. Compact distinguishing evidence selection.
3. Default template shrink from packet narrative to wrapper.
4. Reviewer and metadata alignment for the reduced contract.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-601 | Phase 6 must use the sibling `001/.../006-research-memory-redundancy` packet as the implementation authority. | Packet docs cite the sibling synthesis as the source of truth instead of launching a second research lane. |
| REQ-602 | The default save contract must become a compact retrieval wrapper. | The final Phase 6 implementation no longer emits a packet-shaped narrative by default when canonical packet docs exist. |
| REQ-603 | Canonical packet docs must remain the long-form owners. | Canonical packet docs remain the long-form narrative owners when present, and memory saves point back to them instead of replaying them. |
| REQ-604 | Phase 6 must preserve retrieval meaning while shrinking narrative duplication. | Verification shows the wrapper keeps title, trigger phrases, distinguishing evidence, continuation state, recovery hints, anchors, and metadata intact. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-605 | Phase 6 must prefer the four main implementation-owner surfaces named by the sibling research before widening elsewhere. | Collector, workflow, contract, and template files carry the main implementation load unless a later blocker proves another owner surface is necessary. |
| REQ-606 | Historical cleanup or migration remains optional and bounded. | Any `PR-13` or migration-like follow-on is deferred unless the wrapper contract lands cleanly first. |
| REQ-607 | Phase 6 must leave the downstream audit surface stable for Phase 7. | The final phase summary states what changed, what stayed intentionally unchanged, and which downstream docs now need parity review against the compact-wrapper contract. |

### Acceptance Scenarios

**Scenario A: Canonical docs become the long-form owners**

- **Given** a packet already has canonical long-form packet docs,
- **When** `PR-12` lands the wrapper-contract implementation,
- **Then** generated memory saves point back to those docs instead of restating them,
- **And** the save keeps only compact distinguishing evidence, recovery hints, continuation state, and metadata.

**Scenario B: Default wrapper output still supports recall**

- **Given** a packet is later retrieved through triggers, semantic search, or auto-surface behavior,
- **When** the compact wrapper is indexed,
- **Then** title, trigger phrases, anchors, evidence, and metadata still make the packet retrievable,
- **And** retrieval does not depend on a second packet narrative being embedded in the memory body.

**Scenario C: Historical or optional cleanup stays bounded**

- **Given** older saves or low-severity duplication classes still exist,
- **When** the team evaluates follow-on cleanup,
- **Then** that work stays optional and bounded,
- **And** the main wrapper contract does not get blocked on broad historical rewrite work.

**Scenario D: Shipped parent closeout stays authoritative**

- **Given** Phases 1-5 already closed the D1-D8 remediation train,
- **When** Phase 6 narrows future work to wrapper-and-ownership surfaces,
- **Then** the parent `003-memory-quality-issues` packet remains the long-form closeout owner for shipped work,
- **And** Phase 6 does not reopen earlier phase acceptance claims.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-601**: `research/research.md` and `research/findings-registry.json` freeze the five-iteration Phase 6 synthesis with 10 actionable HIGH/MEDIUM remediation rows.
- **SC-602**: `PR-12` removes the approved live-path duplication classes without erasing distinct decisions, observations, provenance, or recovery cues.
- **SC-603**: Optional `PR-13` either runs a bounded stale-trigger migration for `F001.2` or is explicitly deferred with rationale.
- **SC-604**: Phase 6 validates cleanly and leaves Phase 7 a stable post-dedupe baseline plus an explicit post-Phase-6 deferral list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1-5 pipeline and telemetry surfaces remain stable | Without a stable baseline, duplicate measurements could describe transient defects instead of real residual duplication | Start only after Phase 5 closeout is complete and treat that state as the comparison baseline |
| Dependency | Multiple recent-memory stores may use slightly different conventions | A single remediation rule could overfit one store and break another | Inventory stores first and validate duplication patterns against store-specific examples before applying changes |
| Risk | Over-aggressive dedupe removes meaningful distinctions | Retrieval quality could degrade if unique decisions or observations are collapsed | Require synthesis approval and keep risky duplication classes explicit but deferred |
| Risk | Narrative dedupe drifts into rewrite-heavy cleanup | The phase could widen beyond duplication reduction and become editorial churn | Rank duplication classes and implement only the highest-value, lowest-risk reductions |
| Risk | Structural dedupe touches fields that downstream tooling still expects | Downstream audits or parsers could become noisy | Treat structural duplication as a research dimension first and verify the post-change surface before handoff to Phase 7 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: The duplication-reduction strategy must be easy to explain by dimension and by store.
- **NFR-M02**: Deferred duplication classes must be documented clearly enough that a later follow-up can resume without repeating the full investigation.

### Reliability

- **NFR-R01**: The phase must preserve current recent-memory readability and provenance after dedupe changes.
- **NFR-R02**: Verification must sample more than one store when Phase 6 edits more than one store.

### Performance

- **NFR-P01**: Corpus inventory and duplicate-pattern analysis should stay bounded to current recent memory files rather than scanning unbounded historical archives unless explicitly promoted into scope.
- **NFR-P02**: The implementation should prefer the smallest safe edit set that removes the highest-cost redundancy first.

### Testability

- **NFR-T01**: Every implemented duplication reduction must trace back to a specific research dimension and synthesis decision.
- **NFR-T02**: Phase verification must include before/after spot checks that prove unique meaning survived the duplication reduction.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Two memory files may share similar trigger phrases but serve different retrieval intents; Phase 6 must not merge them blindly.
- A repeated paragraph may be acceptable if it is the only place where a critical operational caveat is preserved; narrative duplication needs semantic review, not line-count-only cleanup.
- `FILES` tables may repeat a path for valid multi-reason references; path repetition alone is not sufficient proof of redundancy.
- Structural duplication may be intentional when one representation is machine-facing and another is human-facing; the research pass must distinguish redundant mirrors from necessary dual-format representations.
- A newly discovered memory store may not belong in scope if it is archival rather than current-recent; the setup pass must classify it before counting it toward remediation work.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multi-store corpus inventory plus dedupe implementation |
| Risk | 16/25 | Semantic-loss risk if duplicate content is over-collapsed |
| Research | 17/20 | Five parallel research dimensions drive the implementation scope |
| **Total** | **51/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which additional memory stores, if any, qualify as current recent memory once the setup inventory is complete?
- Does any structural duplication class need a follow-on tooling change instead of a corpus-only rewrite?
<!-- /ANCHOR:questions -->
