---
title: "Feature Specification: Save-Flow Unified Journey - Audit -> Research -> Implementation -> Remediation"
description: "Unified merge packet that consolidates packet 013 audit evidence, packet 014 save-flow research, and packet 015 implementation plus remediation into one self-contained narrative and evidence surface."
trigger_phrases:
  - "016-save-flow-unified-journey"
  - "save-flow unified journey"
  - "memory folder deprecation audit"
  - "save-flow backend relevance review"
  - "save-flow planner-first trim"
  - "planner-first memory save"
  - "trim-targeted verdict"
  - "canonical save remediation"
  - "audit research implementation remediation"
  - "content-router scoped exception"
  - "v3.4.1.0 save flow"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-gov | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-save-flow-unified-journey"
    last_updated_at: "2026-04-15T10:00:01Z"
    last_updated_by: "cli-copilot"
    recent_action: "Merged 013, 014, and 015 into packet 016"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "research/013-audit-snapshot/review-report.md"
      - "research/014-research-snapshot/research.md"
      - "review/015-deep-review-snapshot/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-save-flow-unified-journey-merge"
      parent_session_id: "015-save-flow-planner-first-trim-seed"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q013: Packet 013 proved the runtime was half-migrated."
      - "Q014: Packet 014 kept the writer core and recommended trim-targeted simplification."
      - "Q015: Packet 015 shipped planner-first default with explicit `full-auto` fallback."
      - "Q015-R: The 9 deep-review findings were resolved."
---
# Feature Specification: Save-Flow Unified Journey - Audit -> Research -> Implementation -> Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-gov | v2.2 -->

---

## EXECUTIVE SUMMARY

The save-flow story across packets 013, 014, and 015 is one continuous arc, not three isolated documents. Packet 013 started with a contradiction: the v3.4.0.0 narrative said `[spec]/memory/*.md` was gone, yet the live runtime still created, wrote, indexed, and read that surface on every save. The audit proved the system was half-migrated, classified 25 active findings, and turned the problem from vague drift into a concrete closure map.

Packet 014 picked up after the retirement cutover landed in v3.4.1.0. With the legacy memory-file artifact removed, the question shifted from "what is still broken?" to "what still earns runtime cost?" A 20-iteration research loop classified 15 remaining save-flow subsystems, answered Q1 through Q10, and reached a trim-targeted verdict: keep the canonical atomic writer, routed record identity, content-router core, and thin continuity validation, but move Tier 3 routing, reconsolidation, heavy quality automation, and enrichment out of the default hot path.

Packet 015 turned that verdict into implementation. `/memory:save` became planner-first by default, the explicit `full-auto` fallback preserved the existing canonical atomic path, and freshness work moved into follow-up actions. The packet delivered 43 completed tasks, aligned docs and tests, and shipped the planner-first contract into v3.4.1.0.

Deep review then forced one final pass from "shipped" to "honest and equivalent". Three P0, five P1, and one P2 findings surfaced across router preservation claims, fallback safety parity, planner blocker classification, deferred helper coverage, and changelog honesty. Packet 015 remediated all 9 findings. Packet 016 exists to preserve that full narrative in one place: audit reality, research judgment, implementation scope, and remediation closure.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-15 |
| **Branch** | `026-016-save-flow-unified-journey` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Predecessors** | `013-memory-folder-deprecation-audit`, `014-save-flow-backend-relevance-review`, `015-save-flow-planner-first-trim` |
| **Packet Type** | Unified merge packet |
| **Release Context** | `v3.4.1.0` |
| **Merge Principle** | Preserve each source packet as authoritative while making 016 self-contained for readers |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The three source packets describe one engineering journey, but a reader has to jump between an audit report, a research packet, an implementation packet, a deep-review packet, transcript artifacts, and changelog notes to understand the whole story. That fragmentation makes it harder to answer basic questions such as:

1. What was broken before v3.4.1.0?
2. What research proved which save-flow pieces still mattered?
3. What exactly shipped in planner-first mode?
4. What did deep review find after the implementation?
5. Which claims in the release notes stayed true after remediation?

Packet 016 solves the documentation problem, not a runtime defect. It consolidates the narrative arc and the primary evidence surface while leaving packets 013, 014, and 015 untouched in their original locations.

### Purpose

Create a self-contained Level 3+ merge packet that lets a maintainer stay inside `016-save-flow-unified-journey/` and still understand the full save-flow journey from audit through remediation, with copied artifact snapshots and unified primary docs that point back to the original packet evidence.

---

<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Consolidate packet 013 audit findings, packet 014 research verdicts, and packet 015 implementation plus remediation into a single narrative spec.
- Copy the key source artifacts into packet 016 so a reader can inspect the most important audit, research, review, and transcript artifacts without leaving the packet.
- Write unified `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` that explain the end-to-end journey.
- Preserve source packet authority by treating packet 016 as a merge surface, not as a rewrite of packet 013, 014, or 015.
- Record the final understanding of the planner-first save-flow contract after the 015 remediation pass.
- Generate packet metadata and nested changelog artifacts so packet 016 is visible to the usual spec-folder tooling.

### Out of Scope

- Any new runtime or code changes to the save pipeline.
- Any move, rename, or deletion of packet 013, 014, or 015.
- Any edits to source packet artifacts beyond copying them into packet 016.
- Re-opening packet 013 path selection. Packet 016 reports the historical arc as shipped in v3.4.1.0.
- Re-opening packet 014 subsystem classification. Packet 016 preserves the verdicts already reached.
- Re-running packet 015 implementation or deep-review execution. Packet 016 summarizes the delivered result.

### Source Packets Preserved

| Packet | Role in Journey | Authority Kept In | What 016 Adds |
|--------|-----------------|------------------|---------------|
| `013-memory-folder-deprecation-audit` | Audit of the half-migrated memory-folder state | Original audit packet and review artifacts | Narrative summary plus copied review snapshot |
| `014-save-flow-backend-relevance-review` | Research verdict on which save-flow subsystems still earn cost | Original research packet and findings registry | Unified research summary plus copied research snapshot |
| `015-save-flow-planner-first-trim` | Implementation and post-implementation review | Original implementation packet, review packet, and scratch transcripts | Unified implementation and remediation summary plus copied review and transcript snapshots |

### Files to Change or Create

| Phase | File Path | Change Type | Why It Matters |
|-------|-----------|-------------|----------------|
| Packet 016 | `spec.md` | Create | Unified story, requirements, scope, and success criteria |
| Packet 016 | `plan.md` | Create | Unified architecture, phase graph, testing strategy, and rollback story |
| Packet 016 | `tasks.md` | Create | Unified completed work ledger with source evidence |
| Packet 016 | `checklist.md` | Create | Unified verification carry-over across audit, research, implementation, and remediation |
| Packet 016 | `decision-record.md` | Create | Aggregate ADR surface for the journey |
| Packet 016 | `implementation-summary.md` | Create | Unified delivery and remediation summary |
| Packet 016 | `research/013-audit-snapshot/**` | Copy | Self-contained audit evidence inside the merge packet |
| Packet 016 | `research/014-research-snapshot/**` | Copy | Self-contained research evidence inside the merge packet |
| Packet 016 | `review/015-deep-review-snapshot/**` | Copy | Self-contained deep-review evidence inside the merge packet |
| Packet 016 | `scratch/transcripts-snapshot/**` | Copy | Self-contained planner transcript evidence inside the merge packet |
| Packet 016 | `description.json` | Generate | Packet discovery and memory indexing metadata |
| Packet 016 | `graph-metadata.json` | Generate or author | Packet graph visibility and packet relationships |
| Packet 016 | `changelog/changelog-026-016-save-flow-unified-journey.md` | Generate | Packet-local nested changelog |

### Aggregate Historical File Surface

| Historical Phase | Primary Runtime Files | Primary Doc Files | Historical Outcome |
|------------------|-----------------------|------------------|--------------------|
| 013 audit and retirement | `workflow.ts`, `file-writer.ts`, `memory-indexer.ts`, `memory-metadata.ts`, `directory-setup.ts` | `../../../../command/memory/save.md`, `../../../../command/memory/manage.md`, `../../../../skill/system-spec-kit/references/memory/save_workflow.md`, `../../../../skill/system-spec-kit/references/memory/memory_system.md`, templates, v3.4.0.0 docs | Legacy memory-file write path audited then retired in v3.4.1.0 |
| 014 research | `memory-save.ts`, `content-router.ts`, `atomic-index-memory.ts`, `create-record.ts`, `thin-continuity-record.ts`, `post-insert.ts`, `reconsolidation-bridge.ts`, `workflow.ts` | `research/014-research-snapshot/primary-docs/spec.md`, `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json` | Trim-targeted verdict reached |
| 015 implementation | `memory-save.ts`, `types.ts`, `response-builder.ts`, `validation-responses.ts`, `generate-context.ts`, `content-router.ts`, `quality-loop.ts`, `save-quality-gate.ts`, `reconsolidation-bridge.ts`, `post-insert.ts`, `workflow.ts`, `api/indexing.ts` | `review/015-deep-review-snapshot/primary-docs/spec.md`, `review/015-deep-review-snapshot/primary-docs/plan.md`, `review/015-deep-review-snapshot/primary-docs/tasks.md`, `review/015-deep-review-snapshot/primary-docs/checklist.md`, `review/015-deep-review-snapshot/primary-docs/decision-record.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md` | Planner-first default shipped with explicit fallback |
| 015 remediation | `memory-save.ts`, `post-insert.ts`, `api/indexing.ts`, `content-router.ts`, `../../../../skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` | `review/015-deep-review-snapshot/*`, packet docs, changelog | 9 of 9 findings resolved |

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Packet 016 must preserve the full audit -> research -> implementation -> remediation arc in one narrative. | `spec.md`, `plan.md`, and `implementation-summary.md` each explain all four phases without requiring the reader to infer missing steps. |
| REQ-002 | Packet 016 must remain documentation-only and must not modify or delete packets 013, 014, or 015. | Source packets remain in place, and packet 016 only copies artifacts. |
| REQ-003 | Packet 016 must copy the requested source artifacts so the merge packet is self-contained. | Snapshot directories exist for packet 013 review, packet 014 research, packet 015 review, and packet 015 transcripts. |
| REQ-004 | Every copied Markdown snapshot file must begin with the required snapshot header. | Copied `.md` files in packet 016 open with the `<!-- SNAPSHOT: copied from ... -->` note. |
| REQ-005 | The unified packet must preserve packet 013's central audit truth. | Packet 016 states that packet 013 found a half-migrated state, 25 active findings, and the major path families that drove closure. |
| REQ-006 | The unified packet must preserve packet 014's research truth. | Packet 016 states the `trim-targeted` verdict, answers Q1-Q10, and preserves the 15-subsystem classification shape. |
| REQ-007 | The unified packet must preserve packet 015's implementation truth. | Packet 016 states the planner-first default, the explicit `full-auto` fallback, the four gated features, the follow-up APIs, and the 43 completed tasks. |
| REQ-008 | The unified packet must preserve packet 015's remediation truth. | Packet 016 records that deep review surfaced 3 P0, 5 P1, and 1 P2 findings and that all 9 were resolved before closeout. |
| REQ-009 | The unified packet must aggregate decisions into one ADR surface that a future maintainer can cite. | `decision-record.md` contains ADR-001 through ADR-008 with status, context, decision, consequences, alternatives, and related ADRs. |
| REQ-010 | The unified packet must be discoverable through normal spec-folder metadata. | `description.json`, `graph-metadata.json`, and packet-local changelog exist and validate. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Packet 013 audit findings F001-F007 must be preserved as the closure driver for retiring legacy memory-file writes and reads. | Requirements and checklist entries point to the write path, read path, and legacy indexing findings as the original root cause. |
| REQ-012 | Packet 013 audit findings F008-F016, F019, and F024 must be preserved as the closure driver for documentation and template reconciliation. | Requirements and checklist entries point to contradictory docs, templates, and workflow guidance that had to be corrected. |
| REQ-013 | Packet 013 audit findings F017, F020, and F021 must be preserved as the original phantom dedup-contract family. | Unified docs explain that the save-side dedup contract was not implemented and that the retirement cutover superseded it in context. |
| REQ-014 | Packet 013 r2 findings F026-F040 must be acknowledged as part of the post-cutover clean-up wave, even when packet 016 only narrates the final release state. | Unified docs explain that the retirement cutover exposed secondary follow-up drift and that the release notes captured the final cleaned state. |
| REQ-015 | Packet 014 Q1-Q10 must be reframed as answered research completion requirements, not left as open questions. | `spec.md` and `checklist.md` list each research question as resolved with outcome and evidence source. |
| REQ-016 | Packet 014 subsystem verdicts must preserve the distinction between load-bearing, partial-value, and over-engineered. | Unified docs describe the 4 kept core subsystems, the 4 gated subsystems, and the 7 deferred or follow-up subsystems. |
| REQ-017 | Packet 015 base verification must preserve the implementation packet's completed task and checklist state. | Unified `tasks.md` and `checklist.md` include P015-T001 through P015-T043 and the requested CHK-001 through CHK-045 carry-over with source evidence. |
| REQ-018 | Packet 015 remediation must preserve each finding closure as a source-backed remediation task. | Unified `tasks.md` includes P015-R001 through P015-R009 and unified `checklist.md` includes matching closure items. |
| REQ-019 | Packet 016 must make clear that it claims no new runtime work. | `tasks.md`, `implementation-summary.md`, and `checklist.md` explicitly say packet 016 is a consolidation packet. |
| REQ-020 | Packet 016 must preserve changelog honesty after remediation. | Unified docs record that `hybrid` remains reserved, the router preservation claim has a scoped exception, and follow-up freshness remains explicit. |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-021 | Packet 016 should help a future reader see phase boundaries quickly. | Phase tables, diagrams, and milestone maps are present in `plan.md`. |
| REQ-022 | Packet 016 should let a future maintainer search by packet-specific language without leaving the merge packet. | Trigger phrases cover the audit, research, implementation, remediation, and release-note language. |
| REQ-023 | Packet 016 should keep copied artifacts readable in-context. | Snapshot folders use human-readable names and copied Markdown notes point back to the original source path. |
| REQ-024 | Packet 016 should preserve operator-facing terminology from the source packets. | Terms like `planner-first`, `full-auto`, `trim-targeted`, `handover_state`, and `thin continuity` appear in the unified docs without contradiction. |

---

<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can explain the problem packet 013 found without opening packet 013.
- **SC-002**: A reader can explain why packet 014 recommended planner-first save flow without opening packet 014.
- **SC-003**: A reader can explain what packet 015 shipped and what it did not ship without opening packet 015.
- **SC-004**: A reader can explain why packet 015 needed remediation and what the remediation closed without opening packet 015 review artifacts.
- **SC-005**: Snapshot folders contain the requested copied evidence and all copied Markdown files have the required snapshot note.
- **SC-006**: The six primary docs in packet 016 validate cleanly with `validate_document.py`.
- **SC-007**: Packet 016 passes strict spec validation with no blocking errors.
- **SC-008**: `decision-record.md` contains all eight ADRs requested for the unified journey.
- **SC-009**: `tasks.md` states clearly that packet 016 adds no new implementation work and only consolidates completed work from the source packets.
- **SC-010**: `checklist.md` marks all carry-over verification items complete with source evidence references.
- **SC-011**: `implementation-summary.md` records the runtime split and the remediation closeout details accurately.
- **SC-012**: `graph-metadata.json` relates packet 016 to the three source packets and to the parent packet.
- **SC-013**: The packet-local nested changelog exists in `changelog/`.
- **SC-014**: The original packets remain in place and packet 016 is self-contained rather than source-destructive.
- **SC-015**: The unified packet reflects the post-remediation truth rather than the pre-remediation packet 015 review verdict.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 013 review artifacts are the source of the original contradiction and closure framing | High | Use the copied 013 review snapshot and original packet references in all audit sections |
| Dependency | Packet 014 research artifacts define the subsystem verdicts and Q1-Q10 answers | High | Preserve the 014 language in requirements, decisions, and acceptance scenarios |
| Dependency | Packet 015 packet docs define the implementation contract | High | Pull tasks, ADR substance, and verification language from the original packet docs |
| Dependency | Packet 015 review artifacts define the remediation closure | High | Preserve F001-F009, resolution status, and review rationale in the merge docs |
| Risk | The unified packet accidentally rewrites history instead of describing it | High | Keep source packets authoritative and phrase packet 016 as a consolidation surface |
| Risk | The unified packet overstates what packet 015 shipped before remediation | Medium | Explicitly separate pre-remediation review findings from post-remediation closeout |
| Risk | The unified packet hides the original half-migrated state by focusing only on the release result | Medium | Open the narrative with packet 013's contradiction and audit result |
| Risk | The unified packet understates the role of v3.4.1.0 release notes | Medium | Cross-reference the changelog in spec, plan, and implementation summary |
| Risk | The unified packet confuses `hybrid` as a live mixed-flow mode | Medium | State that `hybrid` remains reserved and currently behaves like `plan-only` |
| Risk | Source evidence becomes hard to trace from task or checklist lines | Medium | Every task and checklist item points to source packet evidence |
| Risk | Snapshot copies drift from original source artifact identity | Low | Snapshot note points to the authoritative original path |
| Risk | The merge packet becomes too sparse to be useful as a Level 3+ artifact | Low | Include governance, approval, compliance, risk, milestone, and decision sections even when minimal |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness

- **NFR-C01**: The unified packet must describe the historical sequence accurately.
- **NFR-C02**: The unified packet must not claim source-packet work that never shipped.
- **NFR-C03**: The unified packet must describe packet 015 in its post-remediation state, not only in its first review state.

### Traceability

- **NFR-T01**: Every phase-level claim must be traceable to a source packet artifact.
- **NFR-T02**: Every task and checklist line must point to source evidence.
- **NFR-T03**: Aggregate ADRs must name which packet they came from.

### Maintainability

- **NFR-M01**: Packet 016 must let future readers answer "why was this done?" without recomputing the narrative from three packets.
- **NFR-M02**: Packet 016 must distinguish clearly between live contract, deferred work, and historical drift.
- **NFR-M03**: Packet 016 must make the relationship between source packets explicit so later archive work stays safe.

### Governance

- **NFR-G01**: Packet 016 must follow Level 3+ structure with governance and compliance sections present.
- **NFR-G02**: Packet 016 must validate cleanly with the project doc validator and strict spec validator.
- **NFR-G03**: Packet 016 must keep source packet authority clear so later readers do not edit the wrong packet.

### Usability

- **NFR-U01**: Packet 016 must be readable as a stand-alone narrative.
- **NFR-U02**: Packet 016 must keep terminology aligned with the shipped save-flow contract.
- **NFR-U03**: Snapshot folder names must be descriptive enough that readers can navigate without a directory tree from the parent packet.

### Reliability

- **NFR-R01**: Packet 016 must not introduce ambiguity about which save-flow features are default, deferred, or explicit fallback.
- **NFR-R02**: Packet 016 must preserve the known limitations carried from the release and remediation pass.
- **NFR-R03**: Packet metadata must support packet discovery and graph traversal.

---

## 8. EDGE CASES

### Documentation Edge Cases

- A reader opens packet 016 without knowing packet 013 existed. Packet 016 still needs to explain the half-migrated state clearly.
- A reader opens packet 016 after seeing only v3.4.1.0 release notes. Packet 016 still needs to explain why packet 015 had a remediation pass.
- A reader assumes the release note phrase "planner-first" means the full-auto path was deleted. Packet 016 must make clear that `full-auto` stayed as an explicit fallback.
- A reader assumes "content-router preserved" means zero file-level edits. Packet 016 must preserve the scoped exception recorded in remediation.
- A reader assumes packet 016 ships new code because it is the newest packet. Packet 016 must clearly state it is a consolidation packet.

### Historical Edge Cases

- Packet 013 review report recommended multiple remediation paths before Phase 013 shipped. Packet 016 must report the historical choice that actually landed.
- Packet 014 research judged the save-flow after the retirement cutover, not before it. Packet 016 must not mix pre-retirement and post-retirement runtime models.
- Packet 015 deep-review report initially recorded a remediation-required verdict. Packet 016 must separate that first review state from the later remediation completion state.

### Snapshot Edge Cases

- Copied Markdown files can be mistaken for authoritative originals. Snapshot headers prevent that confusion.
- JSON snapshot files do not carry headers. Packet 016 must keep their folder names and context clear enough that a reader still knows they are copied artifacts.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | Three source packets, four historical phases, six new primary docs, and four copied evidence trees |
| Risk | 21/25 | High narrative risk because the packet must not distort what the source packets concluded |
| Research | 18/20 | Requires grounding on audit, research, implementation, review, transcript, and changelog artifacts |
| Multi-Agent | 12/15 | Multiple source packets and artifact families with review-driven synthesis |
| Coordination | 14/15 | Merge packet depends on preserving original packet authority and aligning changelog truth |
| **Total** | **88/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Merge packet hides packet 013 root cause | High | Medium | Lead with the half-migrated audit truth |
| R-002 | Merge packet compresses packet 014 too far | High | Medium | Preserve Q1-Q10 and subsystem verdict classes |
| R-003 | Merge packet overstates packet 015 load-bearing preservation | High | Medium | Carry ADR-007 scoped exception forward |
| R-004 | Merge packet underplays remediation | High | Low | Include F001-F009 closure section in tasks, checklist, and implementation summary |
| R-005 | Snapshot folders drift from source identity | Medium | Low | Use snapshot headers and source-path naming |
| R-006 | Validation rejects Level 3+ packet shape | Medium | Medium | Follow template structure and validate before completion |
| R-007 | Packet metadata does not reflect the three source packets | Medium | Medium | Author graph metadata with explicit `related_to` entries |
| R-008 | Reader mistakes packet 016 as the only source of truth | Medium | Medium | State that packets 013, 014, and 015 remain authoritative phase records |

---

## 11. USER STORIES

### US-001: Audit Reader

**As an** auditor, **I want** packet 016 to explain what packet 013 proved about the half-migrated save flow, **so that** I can understand the original contradiction without reconstructing the audit.

**Acceptance Criteria**
1. Given a reader starts in packet 016, when they read the executive summary and problem statement, then they understand that `[spec]/memory/*.md` was still live when packet 013 started.
2. Given a reader opens `tasks.md`, when they inspect the packet-013 section, then they can see the audit work and path-selection evidence.

### US-002: Research Reader

**As a** maintainer, **I want** packet 016 to preserve packet 014's subsystem verdicts and Q1-Q10 answers, **so that** I know why the planner-first path was selected.

**Acceptance Criteria**
1. Given a reader opens `spec.md`, when they reach the requirements and resolved questions sections, then they can see the research answers and verdict categories.
2. Given a reader opens `decision-record.md`, when they read ADR-001, then they understand why the trim-targeted verdict existed before implementation started.

### US-003: Implementation Reader

**As a** save-flow operator, **I want** packet 016 to preserve what packet 015 actually shipped, **so that** I can understand planner-first default behavior and explicit `full-auto` fallback in one place.

**Acceptance Criteria**
1. Given a reader opens `implementation-summary.md`, when they read the delivery section, then they can see the planner-first contract, follow-up APIs, and fallback behavior.
2. Given a reader opens `checklist.md`, when they inspect the packet 015 carry-over section, then they can see that the implementation packet closed its requested verification surface.

### US-004: Reviewer

**As a** code reviewer or release maintainer, **I want** packet 016 to preserve the deep-review and remediation outcome, **so that** I know which late-stage issues were real and how they were closed.

**Acceptance Criteria**
1. Given a reader opens `tasks.md`, when they inspect P015-R001 through P015-R009, then they can see each remediation closure.
2. Given a reader opens `decision-record.md`, when they read ADR-007, then they can see why the scoped router exception became part of the honest contract.

### US-005: Architect

**As an** architect, **I want** packet 016 to distinguish load-bearing core from deferred subsystems, **so that** future refactors do not repeat the same overreach.

**Acceptance Criteria**
1. Given a reader opens `spec.md`, when they inspect requirements, NFRs, and acceptance scenarios, then they can tell which save-flow pieces stay in the core.
2. Given a reader opens `plan.md`, when they inspect the architecture and dependency sections, then they can tell which deferred features remain follow-up actions.

### US-006: Orchestrator

**As an** orchestrator or future AI session, **I want** packet 016 to be self-contained, **so that** I can resume the save-flow story from one packet without losing access to the most important evidence.

**Acceptance Criteria**
1. Given a reader inspects the packet tree, when they open `research/` and `review/`, then they find the copied artifacts with clear source notes.
2. Given a reader uses packet metadata or memory tooling, when they query packet 016, then they discover the unified packet alongside its source packet relationships.

### US-007: Release Historian

**As a** release historian, **I want** packet 016 to align with v3.4.1.0, **so that** the release notes and packet narrative do not drift apart again.

**Acceptance Criteria**
1. Given a reader compares packet 016 with v3.4.1.0, when they inspect planner-first, router exception, and `hybrid` wording, then the stories match.
2. Given a reader inspects known limitations, when they compare them to the changelog, then packet 016 preserves the same caution points.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Merge packet scope review | Orchestrator | Complete | 2026-04-15 |
| Source-packet preservation review | Packet author | Complete | 2026-04-15 |
| Documentation quality review | Validator tooling | Pending validation run | 2026-04-15 |
| Archive-readiness review | Orchestrator | Pending final handoff | 2026-04-15 |

---

## 13. COMPLIANCE CHECKPOINTS

### Documentation Governance

- [x] Level 3+ packet structure present.
- [x] No source packet files moved or deleted.
- [x] Snapshot notes added to copied Markdown files.
- [x] Primary docs authored as unified narrative rather than copied duplicates.

### Accuracy Governance

- [x] Packet 013 half-migrated audit truth preserved.
- [x] Packet 014 trim-targeted verdict preserved.
- [x] Packet 015 planner-first implementation truth preserved.
- [x] Packet 015 remediation closure preserved.

### Tooling Governance

- [ ] `validate_document.py` pass recorded for the six primary docs.
- [ ] `validate.sh --strict` pass recorded for packet 016.
- [ ] `description.json` and `graph-metadata.json` generated or authored.

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication Need |
|-------------|------|----------|--------------------|
| Save-flow maintainers | Runtime and docs owners | High | Need one accurate packet for future change planning |
| Release maintainers | Changelog and archive owners | High | Need packet-level alignment with v3.4.1.0 |
| Future reviewers | Audit and remediation readers | High | Need source-backed narrative without packet hopping |
| Tooling operators | `/memory:save` users | Medium | Need clear default, fallback, and follow-up behavior |
| AI orchestrators | Session continuity readers | High | Need self-contained merged context |

---

## 15. CHANGE LOG

### v1.0 (2026-04-15)

- Created packet 016 as a unified merge packet for save-flow audit, research, implementation, and remediation.
- Copied the requested packet 013, 014, and 015 artifact snapshots into packet-local folders.
- Authored unified spec, plan, tasks, checklist, decision, and implementation summary docs.

---

### Acceptance Scenarios

### Scenario 1: Planner-first default is preserved as the shipped contract

**Given** the reader only opens packet 016  
**When** they read the executive summary, implementation summary, and checklist  
**Then** they understand that `/memory:save` now returns a structured planner response by default and no longer mutates files on the default path.

### Scenario 2: Full-auto fallback remains available

**Given** the reader wants to know whether automation was removed entirely  
**When** they inspect the unified requirements and implementation summary  
**Then** they see that the explicit `full-auto` path still preserves canonical atomic mutation, promotion, rollback, and same-path identity.

### Scenario 3: Deferred enrichment is not mistaken for removal

**Given** the reader looks for graph refresh, reindex, and enrichment behavior  
**When** they read the unified narrative  
**Then** they understand that these behaviors moved to explicit follow-up actions or fallback mode rather than disappearing.

### Scenario 4: `SPECKIT_SAVE_PLANNER_MODE` remains the primary planner flag

**Given** a maintainer is checking the rollout model  
**When** they inspect packet 016's implementation and verification sections  
**Then** they see `plan-only` as default, `full-auto` as explicit fallback, and `hybrid` as reserved.

### Scenario 5: `SPECKIT_ROUTER_TIER3_ENABLED` stays opt-in

**Given** a reader wants to know whether Tier 3 routing still participates by default  
**When** they inspect the acceptance and decision sections  
**Then** they see that Tier 3 routing is default-off and guarded as a scoped exception inside `content-router.ts`.

### Scenario 6: `SPECKIT_QUALITY_AUTO_FIX` stays opt-in

**Given** a reader wants to know what happened to quality-loop auto-fix  
**When** they read packet 016's requirements and ADR set  
**Then** they see that hard checks remain blockers while auto-fix retries moved behind explicit opt-in behavior.

### Scenario 7: `SPECKIT_RECONSOLIDATION_ENABLED` stays opt-in

**Given** a reader wants to know what happened to reconsolidation-on-save  
**When** they inspect packet 016's implementation and verification sections  
**Then** they see that reconsolidation remains available only through explicit opt-in or fallback behavior.

### Scenario 8: `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` stays opt-in

**Given** a reader wants to know whether post-insert enrichment still exists  
**When** they inspect packet 016's requirement, decision, and summary sections  
**Then** they see that post-insert enrichment remains available but is no longer part of the default save path.

---

<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
### Questions

| Phase | Question | Answer | Evidence |
|------|----------|--------|----------|
| 013 | Was the legacy memory-file surface truly retired when the audit began? | No. The audit found the runtime still created, wrote, indexed, and read `[spec]/memory/*.md`. | `research/013-audit-snapshot/review-report.md`, `research/013-audit-snapshot/iterations/iteration-001.md` |
| 013 | Was the contradiction limited to docs? | No. The contradiction existed in runtime code, docs, templates, and tests. | `research/013-audit-snapshot/review-report.md` |
| 013 | How large was the original active finding set? | 25 active findings across 9 P0, 9 P1, and 7 P2. | `research/013-audit-snapshot/review-report.md` |
| 013 | What closure paths did the audit identify? | Path A retire, Path B rescind, Path C dedup redesign. | `research/013-audit-snapshot/review-report.md` |
| 013 | Which outcome became historical truth in v3.4.1.0? | The retirement path landed and release notes aligned the runtime with the intended canonical-doc model. | `../../../../changelog/01--system-spec-kit/v3.4.1.0.md`, `research/013-audit-snapshot/deep-review-strategy.md` |
| 014 | Which save-flow pieces remained load-bearing? | Canonical atomic writer, routed record identity, content-router core, thin continuity validation. | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json` |
| 014 | Which save-flow pieces were over-engineered on the default path? | Tier 3 routing, reconsolidation-on-save, heavy quality-loop auto-fix, post-insert enrichment. | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/findings-registry.json` |
| 014 | Could the save system be redesigned without replacing the core writer? | Yes. The research recommended a planner-first wrapper around the existing canonical prep and fallback writer. | `research/014-research-snapshot/research.md`, `research/014-research-snapshot/iterations/iteration-020.md` |
| 014 | Did the research support decoupling reindex and graph refresh? | Yes. Both were classified as freshness or derived-state concerns rather than write-core correctness. | `research/014-research-snapshot/research.md` |
| 014 | Did the research require deleting the CLI wrapper? | No. The wrapper retained partial value for explicit target authority and structured input normalization. | `research/014-research-snapshot/iterations/iteration-001.md`, `research/014-research-snapshot/findings-registry.json` |
| 015 | What became the new default operator contract? | Planner-first `/memory:save` with structured non-mutating output. | `review/015-deep-review-snapshot/primary-docs/spec.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| 015 | Was the old full-auto path deleted? | No. It remained available as explicit `full-auto` fallback. | `review/015-deep-review-snapshot/primary-docs/spec.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| 015 | How many implementation tasks shipped? | 43 of 43 tasks. | `review/015-deep-review-snapshot/primary-docs/tasks.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| 015 | Which follow-up APIs became explicit? | `refreshGraphMetadata`, `reindexSpecDocs`, and `runEnrichmentBackfill`. | `review/015-deep-review-snapshot/primary-docs/tasks.md`, `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| 015 | What did the first deep-review pass find? | 3 P0, 5 P1, and 1 P2 findings across router honesty, fallback parity, blocker classification, coverage, and doc drift. | `review/015-deep-review-snapshot/review-report.md`, `review/015-deep-review-snapshot/deep-review-findings-registry.json` |
| 015 remediation | Did packet 015 close every deep-review finding? | Yes. All 9 findings were resolved in the remediation pass. | `review/015-deep-review-snapshot/primary-docs/implementation-summary.md`, `review/015-deep-review-snapshot/deep-review-findings-registry.json` |
| 015 remediation | What became the honest router story after remediation? | Router core preserved with one scoped Tier 3 default-disable and manual-review exception recorded in the ADR set. | `review/015-deep-review-snapshot/primary-docs/decision-record.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| release | What does `hybrid` mean after remediation? | It remains reserved and currently behaves like `plan-only`. | `review/015-deep-review-snapshot/review-report.md`, `../../../../changelog/01--system-spec-kit/v3.4.1.0.md` |
| merge | Why create packet 016 at all? | To let future readers stay in one packet for the whole journey while preserving source packet authority. | Packet 016 scope and decision record |

---

### Relationship to Source Packets

### Packet 013 Contribution

- Established the original contradiction between release-note intent and runtime reality.
- Identified the major families that had to close before the save-flow story could stabilize.
- Supplied the audit artifact set that explains why Phase 013 mattered.

### Packet 014 Contribution

- Reframed the problem after the retirement cutover.
- Identified which save-flow pieces still mattered after the legacy artifact disappeared.
- Provided the trim-targeted verdict that made packet 015 possible.

### Packet 015 Contribution

- Shipped the planner-first default path and explicit fallback contract.
- Added transcript evidence and targeted test proof for the new contract.
- Exposed the last mile of honesty gaps through deep review and then closed them.

### Packet 016 Responsibility

- Preserve the combined journey.
- Keep the source packets untouched.
- Make the merged story available to future readers, auditors, maintainers, and orchestrators.

---

## 16. OPEN QUESTIONS

None for packet 016. The merge packet records the shipped and remediated state of the save-flow journey as of 2026-04-15.

---

<!-- /ANCHOR:questions -->
## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Inventory**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Packet 013 Snapshot**: `research/013-audit-snapshot/`
- **Packet 014 Snapshot**: `research/014-research-snapshot/`
- **Packet 015 Review Snapshot**: `review/015-deep-review-snapshot/`
- **Packet 015 Transcript Snapshot**: `scratch/transcripts-snapshot/`
