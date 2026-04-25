---
title: "Feature Specification: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/spec]"
description: "Root coordination packet for the consolidated nine-phase graph-and-context optimization surface, with historical phases preserved under child phase folders."
trigger_phrases:
  - "026 graph and context optimization"
  - "026 phase consolidation"
  - "29 to 9 phase map"
  - "merged phase map"
  - "graph context optimization root packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-04-25T12:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Second topical consolidation: 008-skill-advisor + 009-memory-causal-graph created; 010 renamed to 010-hook-parity; 007-code-graph expanded to 5 children"
    next_safe_action: "Use merged-phase-map.md and context indexes for navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:34d7c4f4d31b681d4b022a352a2ae7723fe35f46bc94788bd5f4d070e520b594"
      session_id: "026-phase-consolidation-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Graph and Context Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet `026-graph-and-context-optimization` presents an 11-wrapper active navigation surface after two topical consolidation passes. The first pass (2026-04-21) collapsed 29 chronological phase folders into nine thematic wrappers with originals preserved as child packets. The second pass (2026-04-25) merged `008-skill-advisor/` into `008-skill-advisor/`, redistributed children of the former `010-hook-parity/` across `007-code-graph/`, `008-skill-advisor/`, and the renamed `010-hook-parity/`, and added `009-memory-causal-graph/` as a post-hoc Level-2 documentation packet for live infrastructure.

**Key Decisions**: Consolidate by theme rather than chronology, keep root `research/`, `review/`, and `scratch/` folders in place, and use `merged-phase-map.md` plus per-phase context index files as the bridge from old paths to active homes.

**Critical Dependencies**: The preserved child packets remain the authority for historical implementation details. The 11 active wrappers own navigation, status rollup, and continuity pointers only.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-08 |
| **Updated** | 2026-04-25 |
| **Branch** | `026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root packet originally described a 19-phase map while the filesystem exposed 29 direct top-level phases, and follow-up work continued to be added as new siblings even when it belonged to existing thematic tracks. The first consolidation reduced this to nine thematic wrappers, but a subsequent topical pass found that advisor work was split across two wrappers (`008-skill-advisor/` and parts of `010-hook-parity/`), code-graph hook work was hidden inside the hook package, and the live memory-causal-graph infrastructure had no canonical documentation home.

### Purpose
Provide one canonical 11-wrapper active map after two topical consolidation passes while preserving every original packet as a child phase folder with clear old-to-new bridges in `merged-phase-map.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Maintain the 11-wrapper active surface produced by both consolidation passes.
- Keep original phase packets as direct child folders under their thematic wrapper.
- Update root docs, metadata, `merged-phase-map.md`, and per-wrapper context indexes bridge docs as further moves happen.
- Refresh moved packet metadata with new paths plus migration aliases for old packet IDs (including second-pass aliases from `008-skill-advisor/` and `010-hook-parity/`).

### Out of Scope
- Changing runtime code.
- Rewriting historical child packet narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `checklist.md` | Modify | Align root packet docs to the nine-phase map. |
| `merged-phase-map.md` | Create | Map every old phase `001` through `029` to its active home. |
| `00N-*/context indexes` | Create | Per-theme context bridge for original phases. |
| `00N-*/` | Move | Preserved original child packets. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Active children are the 11 thematic wrappers below. Historical phase folders are preserved as direct child folders under each wrapper and mapped in `merged-phase-map.md`. Numbering gaps at `006` and `011` are intentional and reflect prior consolidation passes (do not renumber). The `Status` column tracks wrapper activity only; use the current-state model below to distinguish implemented, narrowed, reopened, and still-open follow-on work.

| Folder | Theme | Notes |
|--------|-------|-------|
| `000-release-cleanup-playbooks/` | Release alignment, cleanup/audit, and playbook repair/remediation (root-only Phase 5 merge) | No child phases — three former sub-packets merged into root docs. |
| `001-research-and-baseline/` | External research, adoption decisions, and initial graph/context baselines | Original phase `001-research-graph-context-systems/` merged into the wrapper root. |
| `002-resource-map-template/` | Resource-map template introduction, deep-loop integration, and reverse parent folder restoration | Three child phases. |
| `003-continuity-memory-runtime/` | Cache hooks, memory quality, continuity refactor, and memory-save rewrite | Four child phases preserved intact. |
| `004-runtime-executor-hardening/` | Foundational runtime, CLI executor matrix, and system hardening | Three child phases preserved intact. |
| `005-memory-indexer-invariants/` | Memory indexer lineage fix and constitutional-tier index-scope invariants (root-only merge) | No child phases — both tracks merged into root docs. |
| `007-code-graph/` | Code graph upgrades, self-contained package migration, context/scan scope, and code-graph hook/advisor refinement | Five child phases (last two added in second pass from former `010-hook-parity/013` and `010-hook-parity/015`). |
| `008-skill-advisor/` | Skill advisor system: search/routing tuning, advisor graph, phrase boosters, smart-router, advisor docs/standards, hook surface, daemon unification, plugin hardening, and hook improvements | 11 child phases (six absorbed from `008-skill-advisor/` plus five from former `010-hook-parity/{001,002,008,009,014}`). |
| `009-memory-causal-graph/` | Post-hoc canonical documentation home for the live causal-graph infrastructure (four MCP tools, `causal_edges` schema, six-relation taxonomy, ownership boundary) | Level-2 documentation packet, no children, no code changes. |
| `010-hook-parity/` | Runtime hook parity across Claude / Codex / Copilot / OpenCode plugin: schema fixes, wrapper wiring fixes, parity remediations | Eight child phases renumbered 001-008 after second-pass migrations out. |
| `012-graph-impact-and-affordance-uplift/` | GitNexus pt-01 + pt-02 adoption: phase-DAG runner, edge explanation/impact uplift, advisor affordance evidence, memory causal trust display, docs/catalogs rollup | Six child phases. |

### Current State Model

| State | Meaning For Sequencing | Current Root Examples |
|-------|------------------------|-----------------------|
| `implemented` | Shipped substrate exists and should not be treated as missing prerequisite work. | Shared trust axes and readiness primitives, planner-first memory-save substrate, Codex hook injection, search-routing measurement scaffolding |
| `narrowed` | The original blocker framing was broader than the remaining work, which is now bounded to cleanup or acceptance follow-through. | Continuity artifact framing, trust-axis narrative cleanup, additive graph-enrichment guidance |
| `reopened` | Later packet truth or reverts reopened a lane that once looked settled enough to de-prioritize. | Copilot wrapper parity reapply, code-graph scan-correctness recovery, release-evidence reconciliation |
| `still-open` | Live acceptance or unresolved defects still block readiness promotion. | Memory-index acceptance reruns, full code-graph scan recovery, live routing telemetry, completion-proof governance |

Research convergence in the archived `001-research-and-baseline` corpus means synthesis coverage closure only. Operational acceptance must be read from the active wrapper packets and their live verification evidence.

### Phase Transition Rules

- Each active wrapper owns navigation and context bridging for its theme.
- Historical child packets preserved as direct children remain evidence and are not flattened into the wrapper docs.
- Root `research/`, `review/`, and `scratch/` folders remain root-level support surfaces.
- New follow-up work should attach to the relevant active wrapper unless it starts a genuinely new top-level theme.
- Numbering gaps at `006` and `011` are deliberate audit markers from consolidation passes; never renumber to fill them.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-research-and-baseline` | `003-continuity-memory-runtime` | Research and baseline findings remain available before runtime/memory consolidation. | Both wrappers validate and expose context indexes. |
| `003-continuity-memory-runtime` | `007-code-graph` | Continuity and memory surfaces are stable enough for graph-package and graph-context work. | Child packets covering memory/runtime are preserved with metadata aliases. |
| `007-code-graph` | `008-skill-advisor` | Code-graph upgrades and hook/advisor refinement land before advisor system unification. | Second-pass code-graph children (`004`, `005`) carry migration aliases from `010-hook-parity/{013,015}`. |
| `008-skill-advisor` | `009-memory-causal-graph` | Advisor consolidation precedes documenting the causal-graph infrastructure that informs trust display. | `008-skill-advisor` has 11 children; `009-memory-causal-graph` is post-hoc documentation only. |
| `009-memory-causal-graph` | `010-hook-parity` | Causal-graph documentation precedes runtime hook parity work that touches advisor + memory hooks. | `010-hook-parity` retains migration aliases for `010-hook-parity/` and `010-hook-parity/`. |
| `010-hook-parity` | `012-graph-impact-and-affordance-uplift` | Runtime hook parity precedes the GitNexus adoption uplift program. | `012-graph-impact-and-affordance-uplift` consumes graph and advisor surfaces in display-only mode. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Maintain a topical-thematic active phase surface. | Root direct phase folders are exactly the 11 approved wrappers; numbering gaps at `006` and `011` are intentional and documented. |
| REQ-002 | Preserve every original phase packet across both consolidation passes. | Every old phase `001` through `029` appears exactly once in the first-pass section of `merged-phase-map.md`, and every second-pass move/rename appears exactly once in the appended second-pass section. |
| REQ-003 | Keep metadata resolvable after moves. | All migrated `description.json` and `graph-metadata.json` files parse and record migration aliases or source fields, including second-pass aliases for `008-skill-advisor/` and `010-hook-parity/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bridge old context to new homes. | Every active wrapper has a context index with old phase names, statuses, summaries, open items, and original/current paths. |
| REQ-005 | Keep support folders in place. | Root `research/`, `review/`, and `scratch/` remain at the root and are referenced rather than moved. |
| REQ-006 | Validate active wrappers independently. | The root and each active wrapper are run through strict validation. |
| REQ-007 | Avoid rewriting historical narratives. | Child packet docs remain intact except for metadata path refreshes. |
| REQ-008 | Preserve old trigger visibility. | Old phase names and trigger phrases remain available in context indexes or source metadata. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** a maintainer opens the root packet, **when** they inspect the phase map, **then** they see 11 active thematic wrappers instead of the original 29 siblings, with both consolidation passes recorded in `merged-phase-map.md`.

**Given** a maintainer needs an old phase, **when** they search `merged-phase-map.md`, **then** they can find its current wrapper or phase-root path across both first-pass (29→9) and second-pass (9→11) tables.

**Given** memory tooling reads moved metadata, **when** it sees aliases and migration fields, **then** the old packet ID remains traceable to the new path.

**Given** a validator runs on active wrappers, **when** it inspects wrapper docs, **then** each wrapper has a parent link and adjacent phase links.

**Given** child phase folders are inspected, **when** a maintainer opens a mapped wrapper root, **then** original implementation summaries, decisions, and handovers are still present.

**Given** support evidence is needed, **when** a maintainer reads the root map, **then** root `research/`, `review/`, and `scratch/` are still identified as root-level support folders.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root direct child phase folders are the 11 approved thematic wrappers (with intentional gaps at `006` and `011`).
- **SC-002**: Every old phase `001` through `029` is represented exactly once in the first-pass section of `merged-phase-map.md`, and every second-pass move/rename appears exactly once in the appended second-pass section.
- **SC-003**: JSON metadata parse checks pass for all descriptions and graph metadata under the packet.
- **SC-004**: Strict validation passes for the root packet and each active wrapper.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Historical citations still mention old top-level paths | Medium | Preserve old paths in context indexes and metadata migration fields; do not rewrite child phase folders blindly. |
| Risk | Recursive validation starts treating child phase folders as active phase work | Medium | Keep child folders under their thematic wrappers, not as root direct children. |
| Dependency | Existing child packets | High | Move folders intact before generating wrappers. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Active root navigation should be scannable in one screen of folder names.

### Security

- **NFR-S01**: The consolidation must not change runtime code or external trees.

### Reliability

- **NFR-R01**: Metadata path rewrites must preserve old IDs in migration fields.

## 8. EDGE CASES

### Data Boundaries

- Child packet internal prose may retain historical references when those references describe past work.
- Root support folders stay root-level even when their content concerns a specific historical phase.

### Error Scenarios

- If a moved packet lacks metadata, the wrapper context index remains the bridge of record.
- If validation finds historical source issues, active wrapper validation takes priority because child packets are preserved history.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Twenty-nine historical phase folders consolidated into 11 wrappers across two topical passes |
| Risk | 14/25 | Metadata and memory continuity can drift if old IDs vanish |
| Research | 12/20 | Existing research/review/scratch support folders remain root references |
| Multi-Agent | 4/15 | Documentation and metadata only |
| Coordination | 15/15 | Cross-phase navigation and validation surface |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Original phase context becomes hard to find | H | M | Maintain `merged-phase-map.md` and per-wrapper context indexes. |
| R-002 | Old packet metadata points to dead top-level paths | H | M | Rewrite metadata paths and preserve aliases. |
| R-003 | Source-history docs get rewritten unnecessarily | M | L | Generate wrappers and metadata only; keep source narratives intact. |

## 11. USER STORIES

### US-001: Maintainer needs a smaller active map (Priority: P0)

**As a** maintainer, **I want** thematic phase folders, **so that** I can navigate the packet without scanning the original twenty-nine sibling folders.

**Acceptance Criteria**:
1. Given the root packet folder is listed, When I inspect direct numeric children, Then I see the 11 approved wrappers (`000`, `001`, `002`, `003`, `004`, `005`, `007`, `008`, `009`, `010-hook-parity`, `012`) and no others.

---

### US-002: Maintainer needs old context preserved (Priority: P0)

**As a** maintainer, **I want** every old phase mapped to a new child-phase path, **so that** no implementation or review evidence is lost.

**Acceptance Criteria**:
1. Given I search `merged-phase-map.md`, When I look for any old phase `001` through `029`, Then exactly one row gives its active home and source path.

## 12. OPEN QUESTIONS

- None. The consolidation map is fixed by the implementation plan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Merged Phase Map**: See `merged-phase-map.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
