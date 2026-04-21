---
title: "Feature Specification: Graph and Context Systems Master Research Packet"
description: "Level 3 coordination packet for the v2 cross-phase synthesis, adoption decisions, and downstream sequencing for graph and context optimization in Public."
trigger_phrases:
  - "graph and context optimization"
  - "master research packet"
  - "adoption sequencing"
  - "honest measurement contract"
  - "trust-axis separation"
importance_tier: "critical"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Merged single original phase root"
    next_safe_action: "Use context-index.md for local phase navigation"
    key_files: ["spec.md"]

---
# Feature Specification: Graph and Context Systems Master Research Packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet turns the v2 master synthesis into a Level 3 coordination root for `Public`. The research now says Public should preserve its split semantic, structural, and continuity topology, prioritize seam-hardening contracts ahead of packaging work, and translate the strongest surviving recommendations into follow-on packets instead of treating any external system as a replacement architecture. A later derivative child packet, `006-research-memory-redundancy`, now tightens one local continuity rule for those follow-ons: persisted or cached summary artifacts should act as compact wrappers pointing at canonical packet docs rather than second narrative owners. [SOURCE: research/research.md:20-28] [SOURCE: research/research.md:274-306] [SOURCE: research/recommendations.md:3-101]

**Key Decisions**: Publish a provisional honest measurement contract before any multiplier claims. Replace the old structural-artifact bundle with trust-axis separation plus freshness authority before packaging structural context. [SOURCE: research/recommendations.md:3-12] [SOURCE: research/recommendations.md:93-101] [SOURCE: research/research.md:229-236]

**Critical Dependencies**: `research/research.md` is the canonical synthesis, `research/recommendations.md` is the ranked decision surface, `research/findings-registry.json` is the 88-finding evidence index, and `research/iterations/q-d-adoption-sequencing.md` plus `research/cross-phase-matrix.md` supply the sequencing and capability baselines used by this packet. The derivative child packet `006-research-memory-redundancy` extends that continuity lane locally without changing the matrix scope. [SOURCE: research/findings-registry.json:1-39] [SOURCE: research/iterations/q-d-adoption-sequencing.md:13-116] [SOURCE: research/cross-phase-matrix.md:6-123]

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-07 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | None |
| **Successor** | ../002-continuity-memory-runtime/spec.md |
| **Research Scope** | 5 external systems, 18 master-consolidation iterations, 88 findings, 10 ranked recommendations, plus 1 derivative internal follow-on packet |
| **Packet Type** | Research-only coordination root with downstream adoption decisions |
<!-- /ANCHOR:metadata -->


---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent folder held the authoritative research deliverables for the graph-and-context optimization program, but it had no root Level 3 packet tying those deliverables into a formal requirements set, decision record, execution plan, or verification contract. Without that root packet, the v2 conclusions remained hard to adopt safely: recommendation order could drift, child-folder conformance drift remained unresolved, and downstream implementation packets had no single document saying which seams should move first and which apparent wins were actually blocked by missing trust or freshness contracts. [SOURCE: scratch/spec-doc-audit.md:7-14] [SOURCE: research/research.md:80-96] [SOURCE: research/research.md:274-306]

### Purpose

Produce the coordination packet that converts the frozen research deliverables into evidence-backed requirements, adoption decisions, sequencing rules, and conformance fixes so Phase 3 can validate one packet instead of six loosely related folders. [SOURCE: scratch/spec-doc-audit.md:193-236] [SOURCE: research/research.md:148-199]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create the seven missing parent Level 3 packet documents for this research-only initiative.
- Encode evidence, evaluation, and adoption-decision requirements directly from the v2 synthesis and recommendations.
- Normalize packet metadata with repo-native `description.json` schema fields only.
- Repair audit-listed child-folder drift so the packet is structurally coherent before strict validation.
- Keep the root `research/` folder in a canonical current-plus-archive layout so the parent packet always points at the live synthesis rather than superseded snapshots.
- Review the root `memory/` folder for usefulness, duplication, and safe-organization constraints without manually rewriting generated memory markdown content.
- Record derivative child follow-ons that clarify how the ranked recommendations should be applied locally without re-scoring the external-systems matrix.
- Translate the P0 through P3 adoption roadmap into packet-ready planning and task language.
- Capture the major adoption decisions as explicit ADRs: honest measurement, P0 fast wins, trust-axis separation, and conditional warm-start sequencing. [SOURCE: scratch/spec-doc-audit.md:65-87] [SOURCE: research/research.md:148-199] [SOURCE: research/recommendations.md:3-101]

### Out of Scope

- Rewriting child-phase `research/` deliverables or hand-editing generated `memory/*.md` content outside the save workflow.
- Implementing runtime code in Spec Kit Memory, Code Graph, CocoIndex, or startup hooks.
- Re-scoring or re-tagging `research/findings-registry.json` in this phase, even though the archived diff report still notes an over-assigned `new-cross-phase` taxonomy.
- Replacing Public's split topology with a monolithic scan, bootstrap, or artifact surface.
- Changing template files or introducing a new packet metadata schema. [SOURCE: scratch/spec-doc-audit.md:77-87] [SOURCE: research/archive/v1-v2-diff-iter-18.md:27-45] [SOURCE: research/research.md:178-183]
- Recomputing `research/cross-phase-matrix.md` as if derivative child packets were new peer systems.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Root Level 3 packet requirements for the v2 synthesis |
| `plan.md` | Create | Root adoption-sequencing and packet-rollback plan |
| `tasks.md` | Create | Executable packet and follow-on adoption tasks |
| `checklist.md` | Create | Research-packet verification checklist with evidence and N/A deployment handling |
| `decision-record.md` | Create | Root ADR set for the packet's adoption decisions |
| `implementation-summary.md` | Create | Narrative summary of how the packet was produced and what follows next |
| `description.json` | Create | Repo-native packet metadata for folder discovery |
| `research/{research.md,recommendations.md,findings-registry.json,deep-research-dashboard.md}` | Modify | Keep the canonical synthesis current and reflect the root archive split |
| `research/archive/*` | Move | Keep superseded top-level snapshots archived instead of version-suffixed at the root |
| `memory/metadata.json` | Review | Preserve generated-memory constraints while checking duplication and organization health |
| `002-codesight/description.json` | Create | Repo-native metadata for the missing child description file |
| `001-claude-optimization-settings/{spec.md,tasks.md,checklist.md}` | Modify | Repair broken link and fold or normalize template drift |
| `002-codesight/{spec.md,plan.md,decision-record.md}` | Modify | Normalize metadata sections, add missing Level 3 sections, and complete later ADR structure |
| `003-contextador/{spec.md,tasks.md,CONTEXT.md,implementation-summary.md}` | Modify | Repair links, normalize metadata sections, and remove Level 3 summary drift |
| `004-graphify/{spec.md,decision-record.md}` | Modify | Normalize metadata sections and complete later ADR structure |
| `005-claudest/{spec.md,plan.md,decision-record.md}` | Modify | Normalize metadata sections, add missing Level 3 sections, and complete later ADR structure |
| `006-research-memory-redundancy/{spec.md,plan.md,tasks.md,checklist.md}` | Create | Formalize the derivative continuity-lane follow-on and capture downstream packet-impact review |
| `scratch/spec-doc-phase-2-summary.md` | Create | Phase 2 before/after report for every created and patched file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root packet must contain all seven Level 3 documents | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, and `description.json` all exist at the parent root |
| REQ-002 | The root packet must restate the v2 outcome honestly as seam hardening, not replacement architecture | `spec.md`, `plan.md`, and `decision-record.md` all preserve the split-topology baseline and cite moats plus hidden prerequisites |
| REQ-003 | Adoption requirements must be evidence-backed rather than product-feature phrasing | Requirements and ADRs cite `research/research.md`, `research/recommendations.md`, `research/iterations/q-d-adoption-sequencing.md`, or `research/iterations/q-f-killer-combos.md` |
| REQ-004 | The packet must encode the v2 recommendation ordering and P0-P3 sequencing | `plan.md` and `tasks.md` translate the ranked recommendations into phased follow-on work |
| REQ-005 | Parent and child metadata must use the repo-native folder-discovery schema only | Both new `description.json` files include `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, and `memoryNameHistory` |
| REQ-006 | Audit-listed child drift must be fixed before validation | Broken prompt links, metadata-section drift, missing plan sections, partial ADR structure, and the Level 3 summary table drift are all removed |
| REQ-007 | Root ADRs must capture the packet's four major adoption decisions | `decision-record.md` contains four full ADR blocks covering R1, P0 sequencing, R10 replacement, and conditional warm-start handling |
| REQ-008 | Research-only sections that do not map to runtime rollout must be written as explicit packet analogs or `N/A` with rationale | `checklist.md` and `plan.md` convert deployment and rollback sections into packet-level language instead of leaving runtime placeholders |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Tasks must be executable next-step work, not a prose restatement of findings | `tasks.md` contains discrete packet-opening, contract-drafting, validation, and handoff tasks |
| REQ-010 | Plan rollback must operate at packet and recommendation level | `plan.md` rollback sections describe recommendation withdrawal, supersession, or packet revert steps rather than production rollback |
| REQ-011 | Implementation summary must document the full 8-plus-10 iteration production story | `implementation-summary.md` states the v1 assembly lane, rigor lane, v1→v2 evolution, and remaining downstream implementation work |
| REQ-012 | Cross-references must use literal folder paths instead of `phase-N/` aliases | Any repaired or newly added child prompt references point to the matching child-folder `scratch/` prompt target |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The parent folder now validates as a real Level 3 packet with seven root docs and repo-native metadata. [SOURCE: scratch/spec-doc-audit.md:65-87]
- **SC-002**: The packet preserves the v2 headline: Public keeps its split topology and front-loads seam contracts before packaging work. [SOURCE: research/research.md:20-28] [SOURCE: research/research.md:277-306]
- **SC-003**: Every top-10 recommendation is represented in the root plan, completion-truth tasks, or explicit downstream queue language, with R1, R10, R4, R6, and R9 treated as the strongest surviving cluster. [SOURCE: research/recommendations.md:3-101] [SOURCE: research/archive/v1-v2-diff-iter-18.md:87-113]
- **SC-004**: All 15 audit-listed child drift items are patched, including the items outside the short user bullet list. [SOURCE: scratch/spec-doc-audit.md:177-236]
- **SC-005**: No new document invents runtime deployment, feature-flag, or monitoring claims for this research-only packet. [SOURCE: scratch/spec-doc-audit.md:79-87] [SOURCE: research/research.md:238-247]
- **SC-006**: The packet records the remaining open follow-on questions honestly, including the registry taxonomy caveat and the two UNKNOWN-confirmed gaps carried forward from v2. [SOURCE: research/archive/v1-v2-diff-iter-18.md:172-183] [SOURCE: research/research.md:238-247]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `research/research.md`, `research/recommendations.md`, and `research/findings-registry.json` remain frozen inputs | Root packet can only be correct if it mirrors those files honestly | Cite the frozen deliverables directly and do not rewrite them in this phase |
| Dependency | `research/iterations/q-d-adoption-sequencing.md` and `research/iterations/q-f-killer-combos.md` define the load-bearing ordering and combo conclusions | Weak sequencing would distort downstream packet order | Reuse their P0-P3 and combo status language in the plan and ADRs |
| Risk | Old `phase-N/` path grammar or broken prompt links survive into Phase 3 | Strict validation would still fail on dead links | Replace all flagged references with literal child-folder `scratch/` prompt targets |
| Risk | Validator and template disagree on multi-ADR behavior | Later ADR blocks could look non-conformant even when content is valid | Patch later ADR blocks with explicit template anchors instead of collapsing them |
| Risk | Research-only docs borrow runtime rollout language from the Level 3 template | Packet reads as if it shipped production code | Rewrite rollback and deployment sections as packet-level checks or explicit `N/A` rationale |
| Risk | `research/findings-registry.json` still carries the known `new-cross-phase` taxonomy mismatch | Phase 3 could surface a non-doc blocker after doc work is complete | Record the blocker in packet open questions and keep the registry frozen in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality
- **NFR-E01**: Every major claim in the root packet must point back to a frozen research deliverable or iteration artifact, not to uncited operator memory.

### Topology Preservation
- **NFR-T01**: No section may recommend replacing Public's semantic, structural, and continuity owners with a single external-style facade. The packet may only recommend bounded adapters, contracts, or follow-on packets. [SOURCE: research/research.md:80-96] [SOURCE: research/research.md:277-285]

### Uncertainty Honesty
- **NFR-U01**: The packet must preserve the v2 exact-versus-estimated posture and the separate provenance, evidence, and freshness axes whenever trust or savings claims are discussed. [SOURCE: research/research.md:46-60] [SOURCE: research/recommendations.md:43-51] [SOURCE: research/recommendations.md:93-101]

### Conformance
- **NFR-C01**: Child-folder repairs must improve structural conformity without deleting useful auxiliary content that the audit explicitly chose to retain, such as `003-contextador/CONTEXT.md`. [SOURCE: scratch/spec-doc-audit.md:141-142] [SOURCE: scratch/spec-doc-audit.md:213-214]

---

## 8. EDGE CASES

### Packet-Only Delivery
- Runtime deployment, feature flags, production monitoring, and operator runbooks are not shipped here. Where the template asks for those topics, the packet must answer with packet-level analogs or explicit `N/A` rationale.

### Frozen Research Caveat
- `research/findings-registry.json` currently passes parse and evidence checks but still carries the known `new-cross-phase` tag overcount. This packet may record that blocker, but it cannot silently repair or reinterpret the registry in this phase. [SOURCE: research/archive/v1-v2-diff-iter-18.md:27-35] [SOURCE: research/findings-registry.json:1-39]

### Contract Before Packaging
- Any downstream reader who tries to treat cached startup, dashboard publication, or structural artifacts as ready-made defaults must be pointed back to the trust-axis and freshness prerequisites first. [SOURCE: research/recommendations.md:13-31] [SOURCE: research/recommendations.md:93-101] [SOURCE: research/research.md:217-236]

### Audit Staleness
- If an audit note and the filesystem disagree, the packet should preserve the note as historical audit context while using the live filesystem for current execution. This already applies to `research/iterations/q-d-adoption-sequencing.md`, which exists even though the audit note said it was not found. [SOURCE: scratch/spec-doc-audit.md:77-79]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | 8 files created, 15 files patched, 1 coordination root spanning 5 child phases |
| Risk | 13/25 | Research-only packet, but strict conformance, cross-link integrity, and frozen-source honesty matter |
| Research | 20/20 | 18 consolidation iterations, 88 indexed findings, 10 ranked recommendations, 4 new cross-phase patterns |
| Multi-Agent | 4/15 | LEAF-only for this phase, but the source packet itself summarizes multi-engine work |
| Coordination | 13/15 | Parent packet plus five child folders plus downstream packet sequencing |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Root packet drifts from the frozen v2 recommendation order | H | M | Tie every decision section back to `research/recommendations.md` and the diff report |
| R-002 | Child packet fixes repair validation failures but leave template drift behind | M | M | Patch the full audit list, not only the short bullet list in the task prompt |
| R-003 | Readers misread downgraded items as rejections | M | M | State clearly that downgrades reflect substrate readiness and missing contracts, not idea invalidation |
| R-004 | The old structural-artifact bundle is revived without trust-axis separation | H | M | Make the replacement R10 decision explicit in both spec and ADRs |
| R-005 | Phase 3 validation surfaces the registry taxonomy caveat as the last blocker | M | H | Keep the blocker visible in open questions and the implementation summary |

---

## 11. USER STORIES

### US-001: Packet owner needs one authoritative adoption root (Priority: P0)

**As a** maintainer planning the next graph-and-context packets, **I want** one root document set that explains which recommendations survived, which were downgraded, and which prerequisites block the tempting but unsafe moves, **so that** I can open the right follow-on packets without re-reading 18 iterations of synthesis.

**Acceptance Criteria**:
1. **Given** the root packet docs are open, **When** I compare them against `research/recommendations.md`, **Then** the ordering and verdicts match the frozen top-10 recommendations.
2. **Given** I need to open the first downstream packet, **When** I read `plan.md` and `tasks.md`, **Then** I can see why the first cluster starts with measurement, trust, payload, and detector-discipline work rather than artifact packaging. [SOURCE: research/recommendations.md:3-101] [SOURCE: research/research.md:148-199]

---

### US-002: Validator owner needs one structurally clean packet (Priority: P0)

**As a** validator running strict checks across the research track, **I want** the parent root and all five child folders to agree on path grammar, metadata sections, plan sections, and later ADR structure, **so that** Phase 3 can validate one coherent packet.

**Acceptance Criteria**:
1. **Given** the audit's drift list, **When** I inspect the patched child files, **Then** every listed drift item has been resolved or explicitly retained with rationale.
2. **Given** I search for child prompt links, **When** I inspect each surviving reference, **Then** it points to the matching child-folder `scratch/` prompt target. [SOURCE: scratch/spec-doc-audit.md:177-236]

---

### US-003: Architecture reviewer needs the trust decision made explicit (Priority: P1)

**As a** reviewer of structural-context proposals, **I want** the packet to say plainly that old Combo 3 failed and that trust axes must be separated before packaging structural artifacts, **so that** later packets do not revive the v1 ambiguity under a different label.

**Acceptance Criteria**:
1. **Given** `decision-record.md` is open, **When** I read the R10 replacement ADR, **Then** I see provenance, evidence status, and freshness authority treated as separate fields.
2. **Given** `spec.md` or `plan.md` is open, **When** I look for structural-artifact work, **Then** it appears after the trust contract prerequisites, not before them. [SOURCE: research/recommendations.md:43-51] [SOURCE: research/recommendations.md:93-101] [SOURCE: research/research.md:229-236]

---

### US-004: Follow-on implementer needs the research packet framed honestly (Priority: P1)

**As a** maintainer preparing runtime work, **I want** the packet to distinguish research-only docs from shipped runtime changes, **so that** I do not mistake packet completion for feature completion.

**Acceptance Criteria**:
1. **Given** `implementation-summary.md` and `checklist.md` are open, **When** I read rollout or deployment sections, **Then** they are written as packet-level or `N/A` checks rather than runtime rollout claims.
2. **Given** the open questions section is open, **When** I look for unresolved items, **Then** I see the remaining registry taxonomy caveat and the two UNKNOWN-confirmed research gaps called out explicitly. [SOURCE: research/archive/v1-v2-diff-iter-18.md:172-183] [SOURCE: research/research.md:243-247]

---

## 12. OPEN QUESTIONS

- Which follow-on packet should own the `research/findings-registry.json` retagging pass that reduces the over-assigned `new-cross-phase` count without changing the rigor-lane narrative? [SOURCE: research/archive/v1-v2-diff-iter-18.md:27-35] [SOURCE: research/findings-registry.json:7-18]
- What is the first frozen task corpus that should be used to decide when the conditional warm-start bundle is safe enough to promote beyond experiment status? [SOURCE: research/recommendations.md:23-31] [SOURCE: research/recommendations.md:73-81]
- Which downstream packet should formalize the first-class auditor versus discoverer workflow contract once the placement rubric and trust-axis contract land? [SOURCE: research/research.md:289-300]
<!-- /ANCHOR:questions -->

---

## PHASE DOCUMENTATION MAP

| Phase | Focus | Packet |
|-------|-------|--------|
| 001 | Claude optimization audit patterns | `001-claude-optimization-settings/spec.md` |
| 002 | CodeSight scan-time detectors and artifact generation | `002-codesight/spec.md` |
| 003 | Contextador runtime retrieval ergonomics | `003-contextador/spec.md` |
| 004 | Graphify structural graph extraction and clustering | `004-graphify/spec.md` |
| 005 | Claudest plugin and memory implementation analysis | `005-claudest/spec.md` |
| 006 | Memory-save redundancy follow-on and downstream packet-impact review | `006-research-memory-redundancy/spec.md` |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Delivery Summary**: See `implementation-summary.md`
- **Master Synthesis**: See `research/research.md`
- **Ranked Recommendations**: See `research/recommendations.md`
- **Capability Matrix**: See `research/cross-phase-matrix.md`
- **Adoption Sequencing**: See `research/iterations/q-d-adoption-sequencing.md`
- **Killer Combos**: See `research/iterations/q-f-killer-combos.md`
