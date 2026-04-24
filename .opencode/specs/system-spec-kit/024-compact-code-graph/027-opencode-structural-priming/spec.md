---
title: "Spec: OpenCode Structural Priming — [system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec]"
description: "Define the non-hook structural bootstrap contract for OpenCode-first flows so structural context appears through bootstrap and recovery surfaces without relying on manual graph-tool choice."
trigger_phrases:
  - "opencode structural priming"
  - "structural bootstrap contract"
  - "non-hook startup guidance"
  - "027 structural priming"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/027-opencode-structural-priming"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 27 (`027-opencode-structural-priming`) |
| **Predecessor** | Groundwork from `018-non-hook-auto-priming`, `024-hookless-priming-optimization`, and the startup-priming investigation in `026-session-start-injection-debug` |
| **Successor** | `028-startup-highlights-remediation` |
| **Handoff Criteria** | Non-hook runtimes, with OpenCode as the primary example, receive automatic structural bootstrap context plus explicit recovery/tool-routing guidance on first turn |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 27** under the Compact Code Graph packet.

**Scope Boundary**: Non-hook runtime bootstrap and recovery surfaces only — especially OpenCode first-turn behavior, startup guidance, auto-prime/session bootstrap payloads, and structural-context routing hints.

**Dependencies**:
- `018-non-hook-auto-priming` — establishes first-call auto-prime + `session_health`, but still stops at status-oriented priming
- `024-hookless-priming-optimization` — establishes `session_bootstrap` and shared session snapshot helpers, but not a structural-first payload contract
- `026-session-start-injection-debug` — covers startup-injection analysis and hook/runtime startup gaps, and should remain separate from this non-hook bootstrap contract

**Deliverables**:
- A defined structural bootstrap contract for non-hook runtimes
- First-turn guidance that treats OpenCode as the primary target runtime
- Explicit linkage between code-graph readiness, `session_bootstrap`, `session_resume`, and `session_health`
<!-- /ANCHOR:phase-context -->

# Feature Specification: OpenCode Structural Priming

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-02 |
| **Branch** | `system-speckit/024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 018 and 024 improved hookless session bootstrap, but non-hook runtimes still depend too much on the model deciding to call structural tools at the right moment. In practice, OpenCode can start a session with `session_resume`, `session_bootstrap`, and code-graph support available, yet the first-turn experience still leaves the model to infer whether it should inspect graph freshness, request structural context, or continue with manual Grep/Read exploration.

This creates a gap between **tool availability** and **tool utilization**. Hook-capable or startup-oriented work is being handled elsewhere in the packet, while OpenCode and similar non-hook CLIs still lack a single explicit contract for when structural context appears, what it contains, and what recovery step should be recommended when that context is degraded or absent.

### Purpose

Make non-hook runtimes — with OpenCode as the primary example — receive a single structural bootstrap contract, first-turn guidance, and recovery nudges that materially reduce manual graph-tool decision-making.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enrich non-hook startup/bootstrap surfaces so they include compact structural context when code graph data is available
- Define OpenCode-first first-turn guidance that explains when structural context has already been provided and what the next recovery call should be if it has not
- Align `session_bootstrap`, `session_resume`, auto-prime, and `session_health` messaging so they point to the same structural-context contract
- Add routing/response-hint behavior that prefers automatic structural summaries over asking the model to decide on graph-tool usage from scratch
- Register this child packet distinctly from `026-session-start-injection-debug` in parent packet docs

### Out of Scope
- Hook runtime startup injection changes and hook-specific startup output wiring
- Core code graph indexing/query engine changes from phases 008, 009, and 019
- CocoIndex semantic-search improvements unrelated to first-turn structural bootstrap
- Any code changes outside the future implementation scope defined by this phase packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/context-server.ts` | Modify | Strengthen startup instructions and first-turn guidance for non-hook runtimes |
| `mcp_server/hooks/memory-surface.ts` | Modify | Add structural-bootstrap fields and OpenCode-oriented response hints to auto-prime payloads |
| `mcp_server/handlers/session-bootstrap.ts` | Modify | Ensure the composite bootstrap response includes compact structural context by default |
| `mcp_server/handlers/session-resume.ts` | Modify | Expose a lightweight structural recovery digest for resumed non-hook sessions |
| `mcp_server/handlers/session-health.ts` | Modify | Emit clearer recovery guidance when structural context is stale or missing |
| `.opencode/agent/context-prime.md` | Modify | Mirror the non-hook structural bootstrap contract for agent-facing first-turn guidance |
| `AGENTS.md` | Modify | Mirror non-hook runtime recovery expectations without becoming the source of truth |
| `../spec.md` | Modify | Register `027-opencode-structural-priming` explicitly in the parent phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Non-hook first-turn bootstrap includes structural context when the code graph is ready | `session_bootstrap` or equivalent auto-prime response contains a compact graph digest instead of status-only metadata |
| REQ-002 | OpenCode guidance is explicit about structural bootstrap behavior | First-turn instructions tell the model what structural context is already injected and what to call next when it is missing |
| REQ-003 | Recovery guidance stops depending on manual graph-tool judgment as the default path | Warning/stale responses point to `session_bootstrap` first, then `session_resume`, before telling the model to choose graph tools directly |
| REQ-004 | This phase stays distinct from startup-injection work | Documentation explicitly treats `026-session-start-injection-debug` as a separate sibling concern, not an implementation surface to overwrite |
| REQ-005 | Structural bootstrap contract is explicit and shared | Contract defines exact fields, token budget, degraded-state behavior, and one source of truth for all non-hook surfaces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Auto-prime, `session_bootstrap`, `session_resume`, and `session_health` share a consistent structural-context vocabulary | All four surfaces refer to the same structural digest concepts and next-step guidance |
| REQ-007 | OpenCode remains the primary non-hook example while the payload schema stays shared | OpenCode gets stronger wording, but not a separate payload shape from other non-hook CLIs |
| REQ-008 | Structural bootstrap remains compact and actionable | Response design targets a concise digest that fits existing startup budgets and highlights next actions |
<!-- /ANCHOR:requirements -->

### Structural Bootstrap Contract

The structural bootstrap contract defined by this phase is the single source of truth for non-hook runtime startup and recovery wording.

| Field | Purpose | Required | Notes |
|-------|---------|----------|-------|
| `status` | `ready`, `stale`, or `missing` | Yes | Declares whether structural context is trustworthy |
| `summary` | Compact graph digest sentence | Yes | Example: file/node/edge counts plus freshness |
| `highlights` | 0-5 structural bullets | No | Present only when graph data is `ready` |
| `recommendedAction` | Canonical next step | Yes | `session_bootstrap` first for missing/stale bootstrap context |
| `sourceSurface` | Emitting surface name | Yes | `auto-prime`, `session_bootstrap`, `session_resume`, or `session_health` |

Budget rules:
- Target budget: 250-400 tokens for the structural contract itself
- Hard ceiling: 500 tokens including guidance text
- OpenCode may receive stronger wording, but all non-hook runtimes share the same contract fields

Degraded-state rules:
- `ready`: include `summary` plus optional `highlights`
- `stale`: include `summary`, mark as degraded, omit detailed highlights if they may mislead, recommend `session_bootstrap`
- `missing`: no highlights, explicit absence message, recommend `session_bootstrap`, and only then recommend deeper graph calls if needed

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OpenCode first-turn flows provide structural context without requiring the model to manually pick a graph tool first
- **SC-002**: Recovery paths for stale/missing context direct the model toward bootstrap/resume surfaces, not ad hoc graph exploration
- **SC-003**: Packet linkage clearly distinguishes this child from `026-session-start-injection-debug`
- **SC-004**: Documentation remains aligned with parent packet goals from phases 018 and 024

### Acceptance Scenarios

- **Given** OpenCode starts a fresh non-hook session with a ready code graph, **When** first-turn bootstrap runs, **Then** the response includes a compact structural digest without requiring a manual graph-tool choice.
- **Given** OpenCode starts a session with stale graph data, **When** the bootstrap surface responds, **Then** it marks the digest as degraded and points to the canonical recovery step.
- **Given** a session resumes after context drift, **When** `session_resume` or `session_health` is used, **Then** both surfaces refer to the same structural recovery contract.
- **Given** `026-session-start-injection-debug` and `027-opencode-structural-priming` both exist, **When** packet references describe dependencies, **Then** they identify the child by full folder slug rather than by number alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Structural digest duplicates existing startup-injection work | Mis-scoped implementation | Keep startup hook work explicitly out of scope and reference `026-session-start-injection-debug` |
| Risk | First-turn guidance becomes too verbose | Startup payload loses usefulness | Keep structural digest compact and reuse shared snapshot helpers from Phase 024 |
| Risk | Empty or stale graph data causes misleading confidence | Model over-trusts bootstrap output | Pair graph digest with freshness/availability status and clear fallback guidance |
| Dependency | Phase 018 auto-prime behavior | Structural bootstrap needs first-call delivery mechanism | Status-only transport exists, but payload contract still needs work |
| Dependency | Phase 024 bootstrap/session snapshot helpers | Consistent recovery vocabulary depends on shared session state | Helper foundation exists, but structural contract is not yet unified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Structural bootstrap additions must fit within existing first-turn token budgets without crowding out recovery guidance
- **NFR-P02**: Bootstrap/recovery surfaces should remain fast enough for non-hook CLI startup usage patterns

### Security
- **NFR-S01**: Structural summaries must avoid surfacing sensitive path or state details beyond the current workspace context
- **NFR-S02**: Recovery hints must not encourage bypassing existing tool-safety or scope rules

### Reliability
- **NFR-R01**: Missing or stale graph data must degrade to explicit guidance rather than silent omission
- **NFR-R02**: OpenCode-first guidance must still behave correctly when reused by other non-hook runtimes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty code graph index: bootstrap should say structural context is unavailable and recommend the canonical recovery step
- Very large workspaces: structural digest should summarize top-level architecture, not dump raw outlines
- No prior session state: first-turn guidance should still explain how to continue safely

### Error Scenarios
- `session_bootstrap` succeeds but graph freshness is stale: mark the digest as degraded and recommend recovery
- Auto-prime attaches only status flags: response hints should escalate toward the richer bootstrap surface
- Runtime starts outside the normal first-turn flow: `session_health` should point back to the same structural recovery contract
- OpenCode wording diverges from other non-hook runtimes: keep wording stronger, but keep payload fields identical

### State Transitions
- Fresh session: structural digest should appear on the first useful bootstrap surface
- Resume after context drift: structural recovery should reuse the same concise digest instead of a separate wording path
- Parallel phase coexistence: references to phase 27 work must use full folder names, not the number alone
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Touches several bootstrap/recovery surfaces but stays focused on non-hook runtime experience |
| Risk | 15/25 | Mostly additive guidance/contract work; main risk is overlap with `026-session-start-injection-debug` |
| Research | 14/20 | Builds directly on packet context from phases 018, 024, 026, and existing 027 |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at spec level. This phase now locks two decisions:
- OpenCode gets stronger wording, but all non-hook runtimes share the same structural-bootstrap payload contract.
- `session_health` should actively recommend `session_bootstrap` when structural context is stale or missing.
<!-- /ANCHOR:questions -->
