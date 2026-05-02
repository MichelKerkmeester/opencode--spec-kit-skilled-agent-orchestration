---
title: "Feature Specifica [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter/spec]"
description: "Build the thin OpenCode transport shell that injects compact packet-024 context at the right lifecycle hooks without becoming a second retrieval backend."
trigger_phrases:
  - "opencode transport adapter"
  - "packet 030"
  - "level 3"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: OpenCode Transport Adapter

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 2 turned the transport concept into a real shipped OpenCode plugin. The Level 3 repair keeps that runtime claim intact while adding the architecture and verification scaffolding needed for trustworthy packet recovery.

**Key Decisions**: Keep the plugin transport-only, map all hook blocks from shared payloads, and expose diagnostics without introducing a second backend.

**Critical Dependencies**: Phase 1 shared payloads, the live plugin file, and the OpenCode config registration in `opencode.json`.

---

### Phase Context

This is **Phase 2 of 4** of the OpenCode Graph Plugin phased execution specification.

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-shared-payload-provenance-layer |
| **Successor** | 003-code-graph-operations-hardening |
| **Handoff Criteria** | The documented phase boundary, verification evidence, and Level 3 artifacts are sufficient for packet recovery and successor review. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | `030-opencode-graph-plugin` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 024 already has strong retrieval surfaces, but OpenCode still lacked a clean prompt-time transport layer that could inject compact context during hook assembly. The research showed that this adapter had to stay thin and consume shared contracts instead of recreating retrieval policy.

### Purpose
Implement the OpenCode-native plugin layer that delivers compact packet-024 context at the right lifecycle points without becoming a second source of truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Register the packet-024 OpenCode transport surface against the shared contract
- Ship a real `@opencode-ai/plugin` layer at `.opencode/plugins/spec-kit-compact-code-graph.js`
- Define injected context blocks for startup, message transform, and compaction
- Register plugin configuration in `opencode.json`
- Keep retrieval policy and storage outside the transport shell

### Out of Scope
- Shared payload contract design
- Graph doctor, export/import, or preview hardening
- Replacing the existing memory backend

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts` | Create | Implement the shared OpenCode transport contract |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Create | Register the real `@opencode-ai/plugin` hook layer |
| `opencode.json` | Modify | Register the plugin config entry |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modify | Emit transport contract output for resume surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modify | Emit transport contract output for bootstrap surfaces |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plugin remains transport-only in responsibility | Phase docs keep retrieval policy and storage ownership out of the plugin layer |
| REQ-002 | Hook coverage is explicit | `event`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, and `experimental.session.compacting` are each accounted for |
| REQ-003 | Injected payload types are bounded | Startup digest, bounded message context, and compaction note are documented separately |
| REQ-004 | Live plugin registration remains documented | The plugin file and `opencode.json` registration stay explicit in the phase docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Adapter consumes the Phase 1 contract | No duplicate payload or provenance semantics are introduced here |
| REQ-006 | Runtime diagnostics remain bounded | Status output remains diagnostic, not a second retrieval surface |
| REQ-007 | Phase 3 can build beneath the adapter | Graph hardening is described as a lower layer, not a plugin rewrite |
| REQ-008 | Phase docs reflect Level 3 closeout accurately | Checklist, ADR, and implementation summary align to the shipped plugin behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OpenCode lifecycle hook responsibilities are clear, packet-local, and implemented as a live plugin.
- **SC-002**: The plugin is documented as a delivery shell, not a second backend.
- **SC-003**: Compaction continuity is kept separate from current-turn retrieval.
- **SC-004**: Phase 2 now stands as a complete Level 3 artifact instead of a Level 1 phase stub.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** `session_resume` emits a shared resume payload, **when** the OpenCode plugin runs, **then** it returns bounded message-transform blocks without introducing retrieval policy.

**Given** `session_bootstrap` emits startup and current-turn payloads, **when** the plugin runs, **then** it returns separate startup, message, and compaction blocks with explicit hook mapping.

**Given** the plugin status tool is queried, **when** a maintainer inspects it, **then** it surfaces runtime diagnostics rather than memory/backend ownership.

**Given** the plugin starts inside OpenCode, **when** hook events fire, **then** startup, messages, and compaction all use the shared transport contract.

**Given** the graph-ops phase follows later, **when** it consumes handler output, **then** it does not need to rewrite the plugin contract.

**Given** strict validation is rerun later, **when** Phase 2 docs are checked, **then** the phase validates as clean Level 3 documentation.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 shared contract | High | Do not redefine payload semantics in the plugin phase |
| Risk | Adapter grows retrieval logic | High | Keep transport and policy ownership separate in the docs and ADR |
| Risk | Plugin registration drifts from packet docs | Medium | Keep plugin file and `opencode.json` explicitly referenced |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The plugin should keep injection bounded so hook latency stays predictable.
- **NFR-P02**: Transport planning should stay small enough to be readable in one pass.

### Security
- **NFR-S01**: No secrets or credentials appear in plugin examples or status output.
- **NFR-S02**: Plugin diagnostics must remain bounded to runtime state, not backend data.

### Reliability
- **NFR-R01**: Hook coverage remains explicit and testable.
- **NFR-R02**: Phase 2 docs validate cleanly as a standalone Level 3 phase artifact.

---

## 8. EDGE CASES

### Data Boundaries
- Empty startup digest still renders a valid system-transform block.
- Minimal resume payload still produces a bounded messages-transform plan.

### Error Scenarios
- Runtime init failures must skip injection instead of breaking OpenCode startup.
- Warmup or bridge failures must fail closed and preserve clean status output.

### State Transitions
- Plugin planner-only state is superseded by the live plugin state.
- Bootstrap-driven startup and current-turn transforms remain separate states.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Touches OpenCode runtime hooks, handler output, and plugin registration |
| Risk | 20/25 | Transport drift could create a second backend by accident |
| Research | 16/20 | Directly grounded in packet research and shipped runtime behavior |
| Multi-Agent | 4/15 | One runtime transport workstream |
| Coordination | 9/15 | Requires alignment with Phase 1 and Phase 3 boundaries |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Plugin takes on retrieval/storage responsibilities | H | M | Keep transport-only wording and ADR rationale explicit |
| R-002 | Hook registration drifts from packet docs | M | M | Keep plugin file and config registration in scope and evidence-backed |

---

## 11. USER STORIES

### US-001: Inject Context at the Right Hook (Priority: P0)

**As an OpenCode runtime maintainer, I want the plugin to inject compact context at the correct lifecycle points, so that OpenCode gets timely context without extra backend ownership.**

**Acceptance Criteria**:
1. Given OpenCode is starting, when the system transform runs, then it receives the startup digest block.
2. Given a turn is in progress, when the messages transform runs, then it receives bounded current-turn context.

---

### US-002: Keep the Plugin Thin (Priority: P1)

**As a maintainer, I want the plugin to stay transport-only, so that retrieval, graph hardening, and memory durability remain in the right layers.**

**Acceptance Criteria**:
1. Given shared payloads already exist, when the plugin maps them into hooks, then it does not redefine the payload semantics.
2. Given graph hardening ships later, when Phase 3 emits `graphOps`, then the transport shell remains unchanged.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for Phase 2.
- The only explicit follow-on is future transport consumers outside OpenCode, which stay out of this phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
