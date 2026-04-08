---
title: "Feature Specification: Research Memory Redundancy Follow-On"
description: "Level 3 coordination packet for formalizing the memory-redundancy research, syncing parent canonicals, and re-evaluating downstream packets against the compact-wrapper contract."
trigger_phrases:
  - "006-research-memory-redundancy"
  - "memory redundancy follow-on"
  - "compact memory wrapper"
  - "canonical doc ownership"
  - "graph context memory follow-on"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Research Memory Redundancy Follow-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet formalizes the moved memory-redundancy research as a follow-on to the `001-research-graph-context-systems` root. Its job is not to reframe the parent as a six-system comparison. Its job is to turn the already-finished redundancy audit into a bounded coordination packet that updates the parent research canonicals, preserves the parent matrix boundary, and re-evaluates downstream packets `002` through `013` against one clarified continuity contract: generated memory saves should be compact retrieval wrappers that point at canonical packet docs instead of replaying them. [SOURCE: research/research.md] [SOURCE: ../research/research.md] [SOURCE: ../research/recommendations.md]

**Key Decisions**: Keep `006/research/research.md` as the canonical redundancy synthesis. Update parent `research.md`, `recommendations.md`, and `deep-research-dashboard.md` for visibility, but leave `cross-phase-matrix.md` unchanged because it remains an external-systems capability artifact. Re-open packet `003` as the primary implementation-owner review, keep `002` as docs-only alignment, and treat `012` plus `013` as assumption-alignment packets rather than new implementation homes. [SOURCE: research/research.md] [SOURCE: ../research/cross-phase-matrix.md] [SOURCE: ../../003-memory-quality-issues/006-memory-duplication-reduction/spec.md] [SOURCE: ../../012-cached-sessionstart-consumer-gated/spec.md] [SOURCE: ../../013-warm-start-bundle-conditional-validation/spec.md]

**Critical Dependencies**: `research/research.md` and `research/findings-registry.json` in this folder remain the redundancy authority. Parent `../research/research.md` and `../research/recommendations.md` remain the adoption-sequencing authority. Packet re-evaluation work must preserve the parent root's split-topology and bounded-follow-on posture. [SOURCE: research/research.md] [SOURCE: research/findings-registry.json] [SOURCE: ../research/research.md] [SOURCE: ../spec.md]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-08 |
| **Branch** | `026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy` |
| **Parent Packet** | `../` |
| **Research Authority** | `research/research.md` |
| **Packet Role** | Follow-on coordination packet for parent-canonical sync and downstream packet re-evaluation |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The moved redundancy research now lives under the graph-and-context root, but the packet family does not yet explain how that research should affect the existing canonicals or the downstream packet train. Leaving it as a standalone report would create two problems. First, the parent root would still read as if the continuity lane ended with the four external-system closeouts and never learned anything local about memory-save duplication. Second, downstream packets would keep assuming richer narrative memory artifacts than the new research now recommends. [SOURCE: research/research.md] [SOURCE: ../research/research.md] [SOURCE: ../../003-memory-quality-issues/spec.md] [SOURCE: ../../012-cached-sessionstart-consumer-gated/spec.md]

### Purpose

Create the coordination packet that turns the redundancy audit into an executable documentation and packet-governance plan:

- formalize the redundancy conclusions in packet docs
- sync the parent canonicals without distorting the parent external-systems matrix
- classify every downstream packet from `002` through `013`
- identify which packet actually owns follow-on implementation re-scope
- leave a clean handoff for later runtime work
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` for this moved packet.
- Treat `research/research.md` and `research/findings-registry.json` in this folder as the canonical redundancy inputs.
- Update parent `../research/research.md`, `../research/recommendations.md`, and `../research/deep-research-dashboard.md` so they acknowledge the compact-wrapper and canonical-doc-ownership conclusions.
- Update parent `../spec.md`, `../plan.md`, `../tasks.md`, `../checklist.md`, and `../implementation-summary.md` only where needed so they no longer imply that the child family stops at the original five external-system lanes.
- Re-evaluate every packet from `../../002-implement-cache-warning-hooks` through `../../013-warm-start-bundle-conditional-validation`.
- Record packet outcomes as one of: `implementation re-scope`, `recommendation or assumption alignment`, `documentation sync only`, or `no change`.
- Update only the packet docs that actually conflict with the new contract.

### Out of Scope

- Runtime implementation of the generator, collector, template contract, or template body changes recommended by the redundancy research.
- Editing `cross-phase-matrix.md` as if `006` were a sixth peer in the original capability comparison.
- Hand-editing generated memory markdown.
- Reopening unaffected packets just for wording polish.
- Reframing the parent root as anything other than an external-systems synthesis plus bounded follow-on packet family.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Define the follow-on packet contract |
| `plan.md` | Create | Describe parent-sync and downstream re-evaluation workflow |
| `tasks.md` | Create | Break the work into canonical sync, packet review, and verification tasks |
| `checklist.md` | Create | Verification surface for the packet and its downstream review outcomes |
| `research/research.md`, `research/findings-registry.json` | Read-only authority | Keep the redundancy synthesis and findings registry as the local canonical source |
| `../research/research.md` | Modify | Add bounded parent visibility for the compact-wrapper findings |
| `../research/recommendations.md` | Modify | Add continuity-lane guidance that future summary artifacts are compact wrappers, not narrative clones |
| `../research/deep-research-dashboard.md` | Modify | Record the follow-on packet sync without broadening the capability matrix |
| `../spec.md`, `../plan.md`, `../tasks.md`, `../checklist.md`, `../implementation-summary.md` | Modify | Keep the parent root charter and completion truth aligned with the new child follow-on |
| `../../002-implement-cache-warning-hooks/spec.md` | Modify | Document compact-wrapper and canonical-doc ownership assumptions without reopening code scope |
| `../../003-memory-quality-issues/spec.md` | Modify | Reclassify Phase 6/7 around the narrower wrapper-and-ownership contract |
| `../../003-memory-quality-issues/006-memory-duplication-reduction/spec.md` | Modify | Narrow the future implementation home to the wrapper contract and bounded downstream fallout |
| `../../003-memory-quality-issues/007-skill-catalog-sync/spec.md` | Modify | Re-scope downstream sync to the final compact-wrapper contract |
| `../../012-cached-sessionstart-consumer-gated/spec.md` | Modify | Align consumer assumptions to compact continuity wrappers |
| `../../013-warm-start-bundle-conditional-validation/spec.md` | Modify | Align validation assumptions to compact continuity wrappers |
| `../../013-warm-start-bundle-conditional-validation/plan.md` | Modify | Keep the benchmark corpus and dependency wording aligned to the wrapper contract |
<!-- /ANCHOR:scope -->

---

## 3A. DOWNSTREAM IMPACT MAP

| Packet | Impact Class | Planned Outcome |
|--------|--------------|-----------------|
| `002-implement-cache-warning-hooks` | Documentation sync only | Keep producer scope unchanged, but align artifact wording to compact continuity wrappers and canonical packet-doc ownership |
| `003-memory-quality-issues` | Implementation re-scope | Reclassify Phase 6 as the future implementation-owner review for the wrapper contract and Phase 7 as downstream parity audit after that narrower contract lands |
| `004-agent-execution-guardrails` | No change | AGENTS-policy packet; no direct memory-save generator or template ownership |
| `005-provisional-measurement-contract` | No change | Measurement-honesty contract; no direct dependency on memory-body shape |
| `006-structural-trust-axis-contract` | No change | Trust-axis payload contract; already compatible with preserving current owners |
| `007-detector-provenance-and-regression-floor` | No change | Detector-honesty packet; orthogonal to memory wrapper composition |
| `008-graph-first-routing-nudge` | No change | Routing nudge packet; no direct generator or template coupling |
| `009-auditable-savings-publication-contract` | No change | Reporting/publication contract; no direct dependence on narrative memory-body shape |
| `010-fts-capability-cascade-floor` | No change | Retrieval-lane hardening; independent from generated memory-body duplication |
| `011-graph-payload-validator-and-trust-preservation` | No change | Graph payload trust packet; no generator or template ownership |
| `012-cached-sessionstart-consumer-gated` | Recommendation or assumption alignment | Keep additive-consumer scope, but describe the upstream artifact as a compact continuity wrapper |
| `013-warm-start-bundle-conditional-validation` | Recommendation or assumption alignment | Keep the benchmark packet, but validate compact-wrapper artifacts rather than narrative packet clones |

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The moved packet must formalize the redundancy research without replacing its local canonicals. | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all treat `research/research.md` and `research/findings-registry.json` as the authority for this follow-on. |
| REQ-002 | Parent canonicals must acknowledge the new follow-on without collapsing the external-systems matrix boundary. | Parent `research.md`, `recommendations.md`, and `deep-research-dashboard.md` all mention the compact-wrapper conclusions, and `cross-phase-matrix.md` is explicitly left unchanged with rationale. |
| REQ-003 | Every downstream packet from `002` through `013` must receive an explicit review outcome. | Packet docs or this packet's task or checklist surfaces record one outcome class for each packet in the range. |
| REQ-004 | Packet `003` must be reclassified as the primary implementation-owner review. | Parent and child `003` docs explicitly say the runtime implementation re-scope belongs there rather than in `002`, `012`, or `013`. |
| REQ-005 | Packet `002` must remain docs-only alignment. | The `002` packet docs adopt the canonical-doc-ownership assumption without widening producer scope. |
| REQ-006 | Packets `012` and `013` must align their continuity assumptions to compact wrappers. | Their docs describe the upstream continuity artifact as a compact additive summary surface rather than a rich narrative packet clone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Parent root docs must stay truthful about the original research charter. | The root still distinguishes five external-system inputs from this later internal follow-on packet. |
| REQ-008 | Unchanged packets must be recorded as intentionally unchanged, not silently skipped. | `004`, `005`, `006`, `007`, `008`, `009`, `010`, and `011` all have explicit no-change or no-direct-impact rationale. |
| REQ-009 | The packet must leave a clean handoff for later implementation. | The docs clearly point future runtime work toward the generator, collector, workflow, contract, and template surfaces named in the research synthesis. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | The parent packet may record the child follow-on in its phase or related-doc map. | The parent spec and summary point readers to `006-research-memory-redundancy` as a derivative follow-on rather than a matrix peer. |
| REQ-011 | The packet may capture a concise impact matrix inside `scratch/` later if needed. | A later execution phase can add a packet-impact table without rewriting the planning docs. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The moved `006` folder now has a real Level 3 planning packet.
- **SC-002**: Parent canonicals acknowledge the memory-redundancy follow-on while preserving the external-systems matrix boundary.
- **SC-003**: Packet `003` is clearly identified as the future implementation re-scope owner for the wrapper contract.
- **SC-004**: Packets `002`, `012`, and `013` are aligned to the new compact-wrapper assumptions without unnecessary scope growth.
- **SC-005**: Every packet from `002` through `013` has a documented review outcome.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent root still frames itself as the completed five-system synthesis | Medium | Add bounded follow-on language instead of rewriting the parent into a different packet type |
| Risk | `006` is folded into the wrong artifact, especially `cross-phase-matrix.md` | High | Keep the matrix unchanged and state why |
| Risk | Revisit work widens into packet churn across unaffected phases | Medium | Limit edits to packets whose assumptions truly change and record explicit no-change outcomes for the rest |
| Risk | Packet `003` continues to treat Phase 6 as a broad residual-dedup program instead of the narrower wrapper contract | High | Re-scope the parent phase map and Phase 6 child spec in the same patch set |
| Risk | Continuity packets keep implying richer narrative summary artifacts than the research now supports | High | Update `012` and `013` to describe compact additive wrapper artifacts explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Parent and child packet docs must keep one clear distinction between external-system synthesis and internal follow-on packet work.
- **NFR-M02**: Downstream packet edits should be the minimum needed to resolve assumption drift.

### Reliability

- **NFR-R01**: The packet-impact classification must be reproducible from the current packet docs and the redundancy synthesis.
- **NFR-R02**: Parent canonicals must remain readable as the root adoption surface after the fold-in.

### Performance

- **NFR-P01**: The planning packet should avoid broad packet rewrites and focus on the documents that shape future work.
- **NFR-P02**: Any later execution packet should inherit a narrowed implementation target instead of having to repeat this classification pass.

### Testability

- **NFR-T01**: Verification should use strict spec validation on every touched packet folder.
- **NFR-T02**: The checklist must expose all changed and unchanged packet outcomes explicitly.
<!-- /ANCHOR:questions -->

---

## 8. EDGE CASES

- A packet may mention summaries or cached artifacts generically but still remain compatible with the compact-wrapper model; avoid unnecessary edits when the truth already fits.
- A packet may need assumption alignment in its spec or plan even if its tasks and checklist remain valid.
- Parent root docs must not imply that the capability matrix or ranked recommendations were recalculated from scratch because of this follow-on.
- Later runtime implementation may still decide a bounded fallback narrative mode is needed when no canonical static doc exists; this packet should not pre-empt that later code decision.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | New Level 3 planning packet plus parent sync and downstream packet review |
| Risk | 18/25 | Root-charter drift and packet-owner confusion are the main risks |
| Research | 18/20 | Existing research is strong, but it must be applied to the right packet surfaces |
| Multi-Agent | 6/15 | Research and packet review were parallelized, but execution is doc-centric |
| Coordination | 13/15 | Requires parent root, child follow-on, and downstream packet-family alignment |
| **Total** | **75/100** | **Level 3 because it coordinates multiple packet families and constrains future implementation ownership.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Parent root is broadened so far that it no longer reads as the external-systems synthesis | H | M | Keep fold-in bounded to visibility, guidance, and child-family references |
| R-002 | `003` continues to own an overly broad Phase 6 charter | H | H | Patch the parent phase map and Phase 6 child spec together |
| R-003 | Continuity packets inherit the wrong artifact assumptions | H | M | Patch `012` and `013` in the same pass |
| R-004 | Unaffected packets get rewritten unnecessarily | M | M | Record explicit no-change rationale and leave them untouched |

---

## 11. USER STORIES

### US-001: Root maintainer needs bounded parent visibility (Priority: P0)

**As a** maintainer reading the root `001` packet, **I want** the memory-redundancy follow-on to be visible without pretending it was part of the original external-systems comparison, **so that** the root stays truthful and still points at the next continuity decisions.

**Acceptance Criteria**:
1. **Given** the parent root docs are open, **When** I look for continuity-lane follow-ons, **Then** I can find `006-research-memory-redundancy` referenced as a derivative child packet.
2. **Given** `cross-phase-matrix.md` is open, **When** I compare the matrix scope, **Then** it still reads as the original external-systems capability comparison rather than a re-scored six-lane table.

### US-002: Packet owner needs the real implementation home identified (Priority: P0)

**As a** maintainer preparing the next runtime change, **I want** the docs to point at `003` as the packet family that should absorb the wrapper-contract implementation re-scope, **so that** I do not reopen the wrong phase.

**Acceptance Criteria**:
1. **Given** the `003` parent spec and Phase 6 child spec are open, **When** I read their phase map and purpose, **Then** they describe the narrower wrapper-and-ownership contract rather than a broad residual-duplication rewrite.

### US-003: Continuity implementer needs aligned assumptions (Priority: P1)

**As a** maintainer working in `012` or `013`, **I want** the upstream cached or persisted artifact described as a compact additive wrapper, **so that** validation and consumer logic do not assume a second narrative packet.

**Acceptance Criteria**:
1. **Given** `012/spec.md` or `013/spec.md` and `013/plan.md` are open, **When** I read the dependency assumptions, **Then** they describe compact continuity wrappers with canonical-doc ownership preserved elsewhere.

---

## 12. OPEN QUESTIONS

- Should a later follow-on packet create a packet-impact matrix artifact under `scratch/`, or is the classification embedded in these docs sufficient?
- If future runtime implementation needs a fallback narrative mode for packets without canonical static docs, should that fallback be specified in `003` or in a later runtime implementation packet?

---

## RELATED DOCUMENTS

- **Research Authority**: See `research/research.md`
- **Findings Registry**: See `research/findings-registry.json`
- **Parent Root Spec**: See `../spec.md`
- **Parent Root Research**: See `../research/research.md`
- **Parent Ranked Recommendations**: See `../research/recommendations.md`
