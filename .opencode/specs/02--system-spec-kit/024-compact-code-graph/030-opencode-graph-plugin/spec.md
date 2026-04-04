---
title: "Feature Specification: OpenCode Graph Plugin Phased Execution [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/spec]"
description: "Tracks packet 030 as six completed runtime phases and clean Level 3 packet documentation."
trigger_phrases:
  - "opencode graph plugin"
  - "packet 030"
  - "phased execution"
  - "compact code graph"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 30 (`030-opencode-graph-plugin`) |
| **Predecessor** | `029-review-remediation` |
| **Successor** | None |
| **Handoff Criteria** | Six completed child phases stay truth-synced with runtime evidence, strict validation passes, and broader memory-durability work remains explicitly out of scope |

# Feature Specification: OpenCode Graph Plugin Phased Execution

---

## EXECUTIVE SUMMARY

Packet `030-opencode-graph-plugin` is no longer just a research packet. It now records a completed six-phase delivery: shared payload/provenance contracts, a real OpenCode hook plugin, graph-operations hardening, cross-runtime startup surfacing parity, bounded code graph auto-reindex parity with CocoIndex-style first-use refresh behavior, and a Copilot repo-local startup-hook wiring repair. This Level 3 packet lets future sessions recover the shipped runtime work without rereading the full research trail.

**Key Decisions**: Keep the plugin transport-only, keep graph hardening below the transport shell, and keep broader memory durability outside packet 030.

**Critical Dependencies**: Packet 024 runtime handlers, the live OpenCode plugin registration, and the runtime-specific startup entry points for Claude, Gemini, Copilot, and Codex.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Phase Count** | 6 completed child phases |

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| Phase 1 | `001-shared-payload-provenance-layer` | Shared payload and provenance contract | Complete |
| Phase 2 | `002-opencode-transport-adapter` | Live OpenCode transport adapter and plugin shell | Complete |
| Phase 3 | `003-code-graph-operations-hardening` | Graph readiness and operations hardening contract | Complete |
| Phase 4 | `004-cross-runtime-startup-surfacing-parity` | Startup/session-context parity beyond OpenCode | Complete |
| Phase 5 | `005-code-graph-auto-reindex-parity` | Bounded code graph auto-refresh parity with CocoIndex | Complete |
| Phase 6 | `031-copilot-startup-hook-wiring` | Repo-local Copilot sessionStart wiring and runtime-detection truth-sync | Complete |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `030-opencode-graph-plugin` started as research plus a packet scaffold, then converged into six completed runtime phases: shared payload/provenance contracts, OpenCode transport surfacing, graph-operations hardening, cross-runtime startup parity, bounded code-graph auto-reindex parity, and Copilot startup-hook wiring. The remaining packet responsibility is to keep those shipped surfaces documented truthfully without reopening broader memory-durability work.

### Purpose
Keep the completed runtime delivery intact as a clean, truthful Level 3 packet with decision records, verification checklists, and architecture-level recovery context so future sessions can recover the shipped behavior without rereading the research trail.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the completed shared payload and provenance runtime layer
- Record the completed OpenCode transport adapter and live plugin hook layer
- Record the completed graph-operations hardening contract
- Record the completed cross-runtime startup surfacing parity pass
- Record the completed follow-on for code graph auto-reindex parity with CocoIndex
- Upgrade the parent packet and all six child phases to clean Level 3 documentation
- Preserve evidence-backed runtime claims and verification history

### Out of Scope
- Expanding packet 030 into a memory-durability packet
- Replacing the existing memory backend or structural graph model
- Reopening sibling packet work outside `030-opencode-graph-plugin`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `description.json` | Modify | Refresh packet metadata after the Level 3 repair |
| `spec.md` | Modify | Remove template bleed-through and restate Level 3 packet scope |
| `plan.md` | Modify | Record the Level 3 execution model, AI protocol, and milestones |
| `tasks.md` | Modify | Keep tasks at Level 3 and add AI execution protocol guidance |
| `checklist.md` | Modify | Truthfully record parent-level verification evidence |
| `decision-record.md` | Create | Record the packet-level architecture decisions |
| `implementation-summary.md` | Modify | Keep the existing runtime claims while declaring Level 3 |
| `001-shared-payload-provenance-layer/*` | Modify | Upgrade Phase 1 docs to clean Level 3 artifacts |
| `002-opencode-transport-adapter/*` | Modify | Upgrade Phase 2 docs to clean Level 3 artifacts |
| `003-code-graph-operations-hardening/*` | Modify | Upgrade Phase 3 docs to clean Level 3 artifacts |
| `004-cross-runtime-startup-surfacing-parity/*` | Modify | Upgrade Phase 4 docs to clean Level 3 artifacts |
| `005-code-graph-auto-reindex-parity/*` | Modify | Upgrade Phase 5 docs to clean Level 3 artifacts |
| `031-copilot-startup-hook-wiring/*` | Modify | Upgrade Phase 6 docs to clean Level 3 artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 1 shared contract remains recorded accurately | Startup, resume, health, bootstrap, and compaction surfaces are still described as shared payload/provenance producers |
| REQ-002 | Phase 2 remains recorded as a live OpenCode plugin delivery | OpenCode startup, message, compaction, and event hooks remain documented as a real plugin surface |
| REQ-003 | Phase 3 remains recorded as a graph-ops hardening delivery | Readiness, doctor guidance, portability boundaries, and preview behavior remain documented as runtime contract output |
| REQ-004 | Phase 4 remains recorded as a delivered startup-parity pass | Claude, Gemini, Copilot, and Codex startup surfaces remain documented exactly as implemented |
| REQ-004a | Phase 5 remains recorded as a completed bounded follow-on | Parent and child docs show the delivered Phase 5 scope without overstating it into unbounded auto-rescan behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Parent and child docs are all Level 3 compliant | Parent and all six child phases include clean `checklist.md` and `decision-record.md` files |
| REQ-006 | Level declarations are consistent | `SPECKIT_LEVEL` markers and metadata tables all declare Level 3 |
| REQ-007 | Template bleed-through is removed | No duplicated frontmatter blocks or placeholder executive-summary text remain in packet 030 docs |
| REQ-008 | Recovery guidance stays truthful | The packet distinguishes completed in-packet work from the out-of-packet memory-durability follow-on |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parent and child docs pass strict recursive validation as Level 3 artifacts.
- **SC-002**: The packet reflects the completed six-phase runtime delivery without overstating scope.
- **SC-003**: Future sessions can recover the architecture, verification, and follow-on boundaries from packet 030 alone.
- **SC-004**: The packet no longer contains template frontmatter or placeholder content in the body.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** packet 030 is opened after a context loss, **when** the parent spec is read, **then** the four delivered phases, their order, and their runtime purpose are immediately clear.

**Given** a developer opens one of the child phases, **when** they inspect the spec, plan, checklist, and decision record, **then** the phase boundary and evidence are explicit without digging into backup files.

**Given** the user asks whether the OpenCode plugin is live, **when** packet 030 is reviewed, **then** the docs still show the plugin as shipped and registered rather than a planner-only artifact.

**Given** the user asks whether startup parity exists outside OpenCode, **when** phase 004 is reviewed, **then** the docs still show Claude, Gemini, Copilot, and Codex parity accurately.

**Given** another architect asks whether memory durability was solved here, **when** the packet is read, **then** the docs still keep that work explicitly outside packet 030.

**Given** strict recursive validation is rerun later, **when** the packet is checked, **then** it validates as a clean Level 3 packet without template bleed-through.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `research/research.md` | High | Keep the parent packet aligned with the locked packet-030 research synthesis |
| Dependency | `.opencode/skill/system-spec-kit/mcp_server` runtime | High | Keep runtime claims tied to existing implementation-summary evidence |
| Dependency | `.opencode/plugins/spec-kit-compact-code-graph.js` and `opencode.json` | High | Keep parent wording aligned with the live plugin registration |
| Risk | Reintroducing template-generated placeholder content | Medium | Rebuild docs from clean packet content and backup baselines |
| Risk | Treating memory durability as solved in packet 030 | Medium | Keep it explicit as a separate follow-on track |
| Risk | Level 3 upgrade drifting from implemented reality | Medium | Keep every new checklist and decision record evidence-backed |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Packet 030 must remain readable enough that future sessions can recover status in one pass.
- **NFR-P02**: The Level 3 upgrade must not introduce validator-only shims or placeholder noise.

### Security
- **NFR-S01**: The doc upgrade must not add secrets or credential-bearing examples.
- **NFR-S02**: External reference material must remain isolated under `external/`.

### Reliability
- **NFR-R01**: Parent and child docs must stay mutually consistent.
- **NFR-R02**: The Level 3 packet must validate cleanly under strict recursive validation.
- **NFR-R03**: Runtime claims must remain evidence-backed and unchanged in substance.

---

## 8. EDGE CASES

### Data Boundaries
- Parent packet closeout without child parity: invalid for this packet, because all six phases are complete.
- Child-phase-only recovery: supported, because each phase keeps predecessor/successor links and packet-local evidence.
- Future follow-on packet creation: supported, but only outside packet 030 for memory durability.

### Error Scenarios
- Template upgrade accidentally injects second frontmatter: treat as invalid and rebuild from backup-aligned content.
- Checklist exists but lacks evidence: treat as invalid for strict closeout.
- Decision record exists but still contains placeholders: treat as invalid Level 3 documentation.

### State Transitions
- Research-only packet state: superseded by the completed runtime packet state.
- Runtime-complete but doc-incomplete state: repaired by this Level 3 truth-sync.
- Future maintenance state: should extend packet-local docs without reopening the completed runtime claims.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | Parent packet plus four completed child phases and their closeout artifacts |
| Risk | 20/25 | Runtime claims must remain precise while the documentation model is upgraded |
| Research | 17/20 | Strongly grounded in completed packet-030 research and implementation evidence |
| Multi-Agent | 5/15 | Work touched multiple runtime surfaces but stayed within one packet |
| Coordination | 9/15 | Parent-child truth-sync and validation were required |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Docs imply memory durability was shipped here | H | M | Keep the out-of-packet follow-on explicit in spec, plan, ADR, and summary |
| R-002 | Phase docs drift from parent packet wording | M | M | Keep parent and child verification evidence aligned |
| R-003 | Startup-parity wording overstates runtime capability | H | L | Preserve the existing implementation claims exactly and distinguish hook-capable from hookless paths |
| R-004 | Future sessions rely on stale backup directories | M | M | Remove upgrade backups after the packet validates cleanly |

---

## 11. USER STORIES

### US-001: Recover Packet 030 Quickly (Priority: P0)

**As a** maintainer, **I want** packet 030 to state the completed architecture and verification clearly, **so that** I can resume work without reconstructing the history from research iterations.

**Acceptance Criteria**:
1. Given packet 030 is opened after time has passed, When the parent spec is reviewed, Then the completed phases and their purpose are explicit.
2. Given a child phase is opened directly, When the phase spec is read, Then predecessor, successor, and handoff criteria are clear.
3. Given strict validation is rerun, When packet 030 is checked, Then the Level 3 packet passes without doc-structure failures.

### US-002: Trust the Runtime Claims (Priority: P1)

**As a** collaborator, **I want** the packet docs to match what was actually implemented, **so that** I can use the packet as the source of truth during reviews and follow-on planning.

**Acceptance Criteria**:
1. Given the implementation summary lists the shipped plugin and startup parity work, When the Level 3 docs are reviewed, Then those claims remain unchanged in meaning.
2. Given the user asks what is still out of scope, When the packet is read, Then memory durability is still clearly outside packet 030.
3. Given a reviewer checks the checklist and decision record, When they inspect evidence references, Then the packet still points back to real runtime verification.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for packet 030 closeout.
- The only explicit follow-on question is when to open the separate memory-durability packet outside packet 030.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research**: See `research/research.md`
