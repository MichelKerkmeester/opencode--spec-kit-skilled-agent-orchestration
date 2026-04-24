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
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
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

Packet `026-graph-and-context-optimization` now presents a nine-phase active navigation surface instead of twenty-nine top-level sibling packets. The original phase packets `001` through `029` remain preserved as direct child folders under each active wrapper, with metadata aliases recording their former packet IDs and paths.

**Key Decisions**: Consolidate by theme rather than chronology, keep root `research/`, `review/`, and `scratch/` folders in place, and use `merged-phase-map.md` plus per-phase context index files as the bridge from old paths to active homes.

**Critical Dependencies**: The preserved child packets remain the authority for historical implementation details. The active nine wrappers own navigation, status rollup, and continuity pointers only.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-08 |
| **Updated** | 2026-04-21 |
| **Branch** | `026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root packet still described an older 19-phase map while the filesystem exposed 29 direct top-level phases. New follow-up packets were added as siblings even when they belonged to established thematic tracks, which made resume, validation, and memory lookup noisier than the actual program structure.

### Purpose
Provide one canonical nine-phase active map while preserving every original packet as child phase folders with clear old-to-new bridges.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Consolidate the active direct-child phase surface from 29 folders to 9 thematic wrappers.
- Move original phase packets into direct child folders under their new thematic home.
- Update root docs, metadata, `merged-phase-map.md`, and per-wrapper context indexes bridge docs.
- Refresh moved packet metadata with new paths plus migration aliases for old packet IDs.

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

> Active children are the nine thematic wrappers below. Historical phases `001` through `029` are preserved as direct child folders under each wrapper and mapped in `merged-phase-map.md`. The `Status` column tracks wrapper activity only; use the current-state model below to distinguish implemented, narrowed, reopened, and still-open follow-on work.

| Phase | Folder | Theme | Child Phase Location | Status |
|-------|--------|-------|----------------------|--------|
| 001 | `001-research-and-baseline/` | External research, adoption decisions, and initial graph/context baselines | Merged into phase root | In Progress |
| 002 | `002-continuity-memory-runtime/` | Cache hooks, memory quality, continuity refactor, and memory-save rewrite | `002-continuity-memory-runtime/001-cache-warning-hooks/`, `002-continuity-memory-runtime/002-memory-quality-remediation/`, `002-continuity-memory-runtime/003-continuity-refactor-gates/`, `002-continuity-memory-runtime/004-memory-save-rewrite/` | In Progress |
| 003 | `003-code-graph-package/` | Code graph upgrades and self-contained package migration | `003-code-graph-package/001-code-graph-upgrades/`, `003-code-graph-package/002-code-graph-self-contained-package/` | In Progress |
| 004 | `004-agent-governance-and-commands/` | AGENTS guardrails, canonical intake, and command cleanup | `004-agent-governance-and-commands/001-agent-execution-guardrails/`, `004-agent-governance-and-commands/002-command-graph-consolidation/` | In Progress |
| 005 | `005-release-cleanup-playbooks/` | Release alignment, cleanup/audit, and playbook repair/remediation | `005-release-cleanup-playbooks/001-release-alignment-revisits/`, `005-release-cleanup-playbooks/002-cleanup-and-audit/`, `005-release-cleanup-playbooks/003-playbook-and-remediation/` | In Progress |
| 006 | `006-search-routing-advisor/` | Search/routing tuning, skill advisor graph, phrase boosters, and smart-router work | `006-search-routing-advisor/001-search-and-routing-tuning/`, `006-search-routing-advisor/002-skill-advisor-graph/`, `006-search-routing-advisor/003-advisor-phrase-booster-tailoring/`, `006-search-routing-advisor/004-smart-router-context-efficacy/`, `006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment/`, `006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/`, `006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/` | In Progress |
| 007 | `007-deep-review-remediation/` | Deep review waves and post-review remediation | `007-deep-review-remediation/001-deep-review-and-remediation/`, `007-deep-review-remediation/002-cli-executor-remediation/`, `007-deep-review-remediation/003-deep-review-remediation/`, `007-deep-review-remediation/004-r03-post-remediation/` | In Progress |
| 008 | `008-runtime-executor-hardening/` | Foundational runtime, CLI executor matrix, and system hardening | `008-runtime-executor-hardening/001-foundational-runtime/`, `008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/`, `008-runtime-executor-hardening/003-system-hardening/` | In Progress |
| 009 | `009-hook-package/` | Skill graph daemon, hook parity, plugin/runtime parity, and parity remediation | `009-hook-package/001-skill-advisor-hook-surface/`, `009-hook-package/002-skill-graph-daemon-and-advisor-unification/`, `009-hook-package/003-hook-parity-remediation/` | In Progress |

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

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-research-and-baseline` | `002-continuity-memory-runtime` | Research and baseline findings remain available before runtime/memory consolidation. | Both wrappers validate and expose context indexes. |
| `002-continuity-memory-runtime` | `003-code-graph-package` | Continuity and memory surfaces are stable enough for graph-package migration context. | Child packets `002`, `003`, `006`, `014`, `005`, and `028` are mapped. |
| `003-code-graph-package` | `004-agent-governance-and-commands` | Code graph package work remains distinct from command/governance policy. | Wrappers preserve old packet metadata aliases. |
| `004-agent-governance-and-commands` | `005-release-cleanup-playbooks` | Governance and command cleanup feed release and playbook repair work. | Context indexes list old statuses and open items. |
| `005-release-cleanup-playbooks` | `006-search-routing-advisor` | Cleanup/playbook outcomes precede advisor and routing follow-ups. | Old phases `010`, `011`, `013`, and `021`-`024` are nested under phase 006. |
| `006-search-routing-advisor` | `007-deep-review-remediation` | Search/advisor work is the main target surface for later review remediation. | Old phases `015`, `018`, `025`, and `026` are nested under phase 007. |
| `007-deep-review-remediation` | `008-runtime-executor-hardening` | Remediation findings inform foundational runtime and executor hardening. | Old phases `016`, `017`, and `019` are nested under phase 008. |
| `008-runtime-executor-hardening` | `009-hook-package` | Runtime/executor hardening precedes hook, daemon, and parity remediation. | Old phases `020`, `027`, and `029` are nested under phase 009. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reduce active top-level phase navigation to nine thematic wrappers. | Root direct phase folders are `001` through `009` only. |
| REQ-002 | Preserve every original phase packet. | Every old phase `001` through `029` appears exactly once in `merged-phase-map.md` and exists in its mapped wrapper root or is merged into the phase `001` root. |
| REQ-003 | Keep metadata resolvable after moves. | All migrated `description.json` and `graph-metadata.json` files parse and record migration aliases or source fields. |

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

**Given** a maintainer opens the root packet, **when** they inspect the phase map, **then** they see nine active thematic wrappers instead of twenty-nine siblings.

**Given** a maintainer needs an old phase, **when** they search `merged-phase-map.md`, **then** they can find its current wrapper or phase-root path.

**Given** memory tooling reads moved metadata, **when** it sees aliases and migration fields, **then** the old packet ID remains traceable to the new path.

**Given** a validator runs on active wrappers, **when** it inspects wrapper docs, **then** each wrapper has a parent link and adjacent phase links.

**Given** child phase folders are inspected, **when** a maintainer opens a mapped wrapper root, **then** original implementation summaries, decisions, and handovers are still present.

**Given** support evidence is needed, **when** a maintainer reads the root map, **then** root `research/`, `review/`, and `scratch/` are still identified as root-level support folders.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root direct child phase folders are the nine approved thematic wrappers.
- **SC-002**: Every old phase `001` through `029` is represented exactly once in `merged-phase-map.md`.
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
| Scope | 23/25 | Twenty-nine historical phase folders consolidated into nine wrappers |
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

**As a** maintainer, **I want** nine thematic phase folders, **so that** I can navigate the packet without scanning twenty-nine sibling folders.

**Acceptance Criteria**:
1. Given the root packet folder is listed, When I inspect direct numeric children, Then I see phases `001` through `009` only.

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
