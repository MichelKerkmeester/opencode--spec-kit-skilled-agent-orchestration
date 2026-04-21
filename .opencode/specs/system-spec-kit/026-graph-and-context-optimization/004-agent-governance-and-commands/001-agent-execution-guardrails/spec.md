---
title: "Feature Specification: Phase 4 — Agent Execution Guardrails"
description: "Phase 4 defines the execution-guardrail update for three AGENTS files so the moved request-analysis block under Critical Rules is leaner, later sections remain renumbered cleanly, and agents keep the same operational execution behavior without duplicate scaffolding." 
trigger_phrases:
  - "phase 4 agent execution guardrails"
  - "agent execution guardrails"
  - "agents enterprise guardrail update"
  - "barter coder agents guardrails"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]

---
# Feature Specification: Phase 4 — Agent Execution Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child + level2-verify | v2.2 -->

---

Phase 4 is the narrow execution-guidance packet for `026-graph-and-context-optimization`. It updates three AGENTS surfaces so future agents stop ownership-dodging, plan before acting, use research-first evidence, remember runtime conventions from `CLAUDE.md`, and keep pushing toward a complete fix instead of stopping early.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-08 |
| **Branch** | `026-graph-and-context-optimization/004-agent-execution-guardrails` |
| **Phase** | 4 |
| **Validation Target** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails --strict` |
| **Handoff Criteria** | All three AGENTS files are updated, packet docs stay aligned to those edits, and phase validation is captured. |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | None |
| **Successor** | ../002-command-graph-consolidation/spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current agent instruction surfaces must not only state the requested execution guardrails explicitly, they must place them in the right structural location and avoid redundant support scaffolding. The latest implementation keeps the request-analysis framework inside Section 1 `## 1. CRITICAL RULES` under `### Request Analysis & Execution`, removes the old standalone request-analysis section, keeps later top-level sections renumbered, and trims the moved block so it now contains only `Flow` plus `#### Execution Behavior` with the eight bullets.

The packet also has a cross-repo scope boundary. The guidance must land in the Public enterprise example file, the root Public `AGENTS.md`, and the Barter coder AGENTS file without drifting into unrelated policy cleanup.

### Purpose

Define and verify a tightly scoped Level 2 packet that updates exactly the three named AGENTS files with explicit execution guardrails and leaves an auditable packet record for the same-session implementation.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `../002-memory-quality-remediation/006-memory-duplication-reduction/`. Canonical narrative ownership stays in the packet's canonical static docs, including `../002-memory-quality-remediation/006-memory-duplication-reduction/implementation-summary.md`, while memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `AGENTS_example_fs_enterprises.md` in the Public workspace with the new execution guardrails moved under Section 1 `## 1. CRITICAL RULES` -> `### Request Analysis & Execution`.
- Update `AGENTS.md` in the Public workspace with the same structural move and operational guidance.
- Update `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` with the same structural move and operational guidance, adjusted only as needed for local wording fit.
- Document the required guardrails in this phase packet and verify the packet with `validate.sh --strict`.
- Verify the AGENTS-file edits against the requested eight guidance points, the move into Critical Rules, the deletion of the dedicated request-analysis section, the later-section renumbering, the removal of duplicate support scaffolding, and the packet scope boundary.

### Out of Scope

- Updating any additional AGENTS, skill, command, or template files beyond the three named AGENTS targets and this packet.
- Reworking broader agent architecture, delegation rules, or unrelated documentation quality issues.
- Introducing new runtime behavior, tooling, or code changes outside the instruction-file updates.

### Files to Change During Phase Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS_example_fs_enterprises.md` | Modify | Keep `### Request Analysis & Execution` under Critical Rules, remove duplicate support scaffolding from that block, preserve only `Flow` plus `#### Execution Behavior`, keep the old standalone request-analysis section deleted, and retain the renumbered later sections and correct `§4 Confidence Framework` reference. |
| `AGENTS.md` | Modify | Make the same lean structural and wording changes in the root Public agent guidance. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md` | Modify | Make the same lean structural and wording changes in the Barter coder runtime instructions. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails/spec.md` | Create | Record requirements and scope for the AGENTS-file update packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails/plan.md` | Create | Define the implementation and verification approach. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails/tasks.md` | Create | Track setup, edit, and verification tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails/checklist.md` | Create | Track Level 2 verification evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/001-agent-execution-guardrails/implementation-summary.md` | Create | Capture same-session implementation and verification results. |

### Required Guardrails

1. Agents avoid ownership-dodging language and take responsibility for fixing issues they encounter.
2. Agents avoid premature stopping and keep pushing toward a complete solution.
3. Agents avoid permission-seeking when they are already capable of solving the problem safely.
4. Agents plan multi-step approaches before acting.
5. Agents recall and apply project-specific conventions from `CLAUDE.md` files.
6. Agents catch and fix their own mistakes using reasoning loops and self-checks.
7. Agents use a research-first tool approach and prefer surgical edits.
8. Agents reason from actual data instead of assumptions.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-401 | The packet must stay scoped to the three named AGENTS targets plus packet-local documentation and verification. | Final file set contains only the three AGENTS edits and this packet's docs or verification artifacts. |
| REQ-402 | All three AGENTS files must explicitly instruct agents to avoid ownership-dodging language and take responsibility for fixing issues encountered. | Each target file contains guidance that tells agents to own and fix encountered problems instead of framing them as someone else's issue. |
| REQ-403 | All three AGENTS files must instruct agents not to stop early and to keep pushing toward a complete solution when safe and in scope. | Each target file includes explicit persistence guidance tied to complete problem resolution. |
| REQ-404 | All three AGENTS files must tell agents not to seek permission for work they are already capable of performing safely within scope. | Each target file includes operational wording that discourages unnecessary permission-seeking while preserving existing safety gates. |
| REQ-405 | All three AGENTS files must require planning for multi-step work before edits or tool execution. | Each target file includes a plan-first instruction for multi-step tasks. |
| REQ-406 | All three AGENTS files must place the request-analysis framework inside Section 1 `## 1. CRITICAL RULES` under `### Request Analysis & Execution`. | Each target file contains that subsection in Critical Rules rather than as a standalone top-level section. |
| REQ-407 | The moved request-analysis block in all three AGENTS files must be lean and contain only `Flow` plus `#### Execution Behavior`. | Each target file omits the removed scaffolding sections and transitions from the moved block directly into `### Tools & Search`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-408 | All three AGENTS files must remind agents to recall and apply project-specific conventions from `CLAUDE.md` files. | Each target file references `CLAUDE.md` convention recall in an operational way. |
| REQ-409 | All three AGENTS files must require self-checks and reasoning loops that catch and fix the agent's own mistakes. | Each target file includes explicit self-correction guidance. |
| REQ-410 | All three AGENTS files must require a research-first tool approach and a preference for surgical edits over broad rewrites. | Each target file tells agents to inspect evidence first and keep edits narrow. |
| REQ-411 | All three AGENTS files must tell agents to reason from actual data rather than assumptions. | Each target file includes explicit evidence-over-assumption guidance. |
| REQ-412 | All three AGENTS files must delete the old standalone request-analysis top-level section and leave later top-level sections renumbered as `## 5`, `## 6`, and `## 7`. | Each target file no longer has the dedicated request-analysis section, and later headings appear as `## 5. AGENT ROUTING`, `## 6. MCP CONFIGURATION`, and `## 7. SKILLS SYSTEM`. |
| REQ-413 | The moved request-analysis block must keep the confidence cross-reference correct. | Each target file uses `§4 Confidence Framework` in the Clarify bullet. |
| REQ-414 | Packet docs and verification notes must describe the three-file scope, structural move, section deletion, lean block shape, renumbering, and evidence consistently. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all align on scope and structure changes. |

### Acceptance Scenarios

**Scenario A: Ownership and persistence guidance lands in all three targets**

- **Given** an agent encounters an issue while working inside scope,
- **When** it reads the updated AGENTS guidance,
- **Then** it is told to own the problem and keep working toward a complete fix,
- **And** it is not encouraged to stop early or dodge responsibility.

**Scenario B: Agents plan and research before editing**

- **Given** a multi-step task,
- **When** the updated instructions apply,
- **Then** the agent plans the approach before acting,
- **And** it uses a research-first, evidence-driven workflow with surgical edits.

**Scenario C: Request analysis guidance moves into Critical Rules**

- **Given** the AGENTS files previously held request-analysis guidance in a standalone top-level section,
- **When** the latest implementation lands,
- **Then** that guidance appears under Section 1 `## 1. CRITICAL RULES` as `### Request Analysis & Execution`,
- **And** the old dedicated request-analysis section is gone,
- **And** the moved block keeps only `Flow` plus `#### Execution Behavior` before `### Tools & Search`.

**Scenario D: Agents rely on local conventions and self-correction**

- **Given** project-specific conventions exist in `CLAUDE.md`,
- **When** an agent prepares to act,
- **Then** it recalls and applies those conventions,
- **And** it uses self-checks or reasoning loops to catch and repair its own mistakes.

**Scenario E: Scope stays narrow**

- **Given** the packet is limited to three AGENTS files plus packet docs,
- **When** implementation completes,
- **Then** unrelated policy cleanup is excluded,
- **And** verification proves the final change set stayed inside the declared boundary.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-401**: All three AGENTS files contain the requested execution guardrails in explicit operational language.
- **SC-402**: All three AGENTS files place the request-analysis framework under Section 1 `## 1. CRITICAL RULES` and remove the old standalone request-analysis section.
- **SC-403**: The moved request-analysis block is lean in all three files and contains only `Flow` plus `#### Execution Behavior` before `### Tools & Search`.
- **SC-404**: Later top-level sections are renumbered cleanly as `## 5`, `## 6`, and `## 7`, and the Clarify bullet points to `§4 Confidence Framework`.
- **SC-405**: The packet documentation stays aligned to the exact three-file scope and the structural changes.
- **SC-406**: The phase folder validates cleanly and leaves a same-session implementation record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to all three target AGENTS files | The phase cannot finish if one target cannot be read or updated | Read all three files first, then keep verification evidence for all paths |
| Risk | Guardrail wording becomes too abstract | Future agents may still ignore the intent or interpret it loosely | Use concrete, operational phrasing that mirrors the requested behavior |
| Risk | Broader cleanup sneaks into the AGENTS edits | Scope expands beyond the packet and creates review noise | Restrict implementation to the three requested AGENTS files and packet docs only |
| Risk | The three AGENTS files drift in wording or emphasis | One runtime may enforce weaker behavior than the others | Verify all three files against the same eight-point checklist |
| Risk | Guidance conflicts with existing safety gates | Agents may get contradictory instructions about when to proceed | Keep anti-permission wording explicitly bounded by existing safety and scope rules |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: The new guidance should read as operational policy, not aspirational prose.
- **NFR-M02**: All three AGENTS files should stay meaningfully parallel so later sync work is straightforward.

### Reliability

- **NFR-R01**: The final wording must preserve existing hard blockers and safety gates while strengthening execution behavior.
- **NFR-R02**: Verification notes must show that all three files were checked directly rather than assumed to match.

### Performance

- **NFR-P01**: The edit workflow should remain surgical, limited to the smallest instruction blocks that express the requested guardrails clearly.
- **NFR-P02**: Packet completion should not require unrelated repo-wide audits or refactors.

### Testability

- **NFR-T01**: The checklist must map the eight requested guardrails to direct evidence in the three AGENTS files.
- **NFR-T02**: The implementation summary must record what changed in each AGENTS file and how the packet was validated.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Existing wording may already imply one of the requested behaviors; Phase 4 should still make the guidance explicit if the current language leaves room for weak interpretation.
- One target file may need slightly different phrasing to fit local structure, but the meaning of all eight guardrails must remain aligned.
- Anti-permission guidance must not erase escalation rules for true blockers, missing context, or safety boundaries.
- Planning-first guidance should reinforce action readiness, not add process overhead for trivial one-step tasks.
- Removing duplicate scaffolding must not remove the actual behavior requirements; the leaner block still has to preserve all eight execution bullets.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Three AGENTS targets across two workspaces plus packet docs and verification |
| Risk | 15/25 | Risk is mainly instruction drift, overscoped cleanup, or weakened safety wording |
| Research | 18/20 | Requires evidence-based review of three instruction surfaces plus heading structure, block-shape simplification, and cross-reference updates |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does any of the three target AGENTS files still contain residual wording from the deleted standalone request-analysis section?
- Does any target need a future wording trim now that the request-analysis block under Critical Rules has been reduced to `Flow` plus `#### Execution Behavior`?
<!-- /ANCHOR:questions -->
