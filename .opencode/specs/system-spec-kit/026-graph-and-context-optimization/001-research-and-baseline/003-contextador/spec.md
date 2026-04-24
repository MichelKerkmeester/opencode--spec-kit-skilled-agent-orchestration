---
title: "Feature Specificatio [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/003-contextador/spec]"
description: "Research Contextador's MCP query architecture, self-healing feedback loop, and Mainframe shared cache to identify concrete, evidence-backed improvements for Code_Environment/Public's retrieval surfaces."
trigger_phrases:
  - "contextador"
  - "mcp query interface"
  - "self-healing context"
  - "mainframe shared cache"
  - "token efficient navigation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: Contextador Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 003 of the graph-and-context-optimization research track investigates Contextador, a Bun-based TypeScript MCP server and CLI. The goal is to extract evidence-backed lessons about MCP-based query interfaces, self-healing context artifacts, Mainframe-style shared agent caches, and token-efficient codebase navigation, then map each lesson to a concrete `adopt now`, `prototype later`, or `reject` recommendation for `Code_Environment/Public`.

**Key Decisions**: Research-only scope with no implementation changes. All writes are confined to this phase folder; the `external/` checkout is read-only.

**Critical Dependencies**: Pre-approved phase folder, intact `external/` Contextador checkout, working `cli-codex` (gpt-5.4 high) bridge for iteration delegation, validate.sh strict pass before research begins.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-06 |
| **Branch** | `main` (research packet, no feature branch) |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../002-codesight/spec.md` |
| **Successor Phase** | `../004-graphify/spec.md` |
<!-- /ANCHOR:metadata -->


---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`Code_Environment/Public` already operates CocoIndex, Code Graph MCP, and Spec Kit Memory. It does not yet have a Mainframe-style shared query-result cache or a self-healing loop that patches stale code-context artifacts after agent failures. Contextador appears to address both concerns, but its claims (93% token reduction, "self-improving" knowledge, cross-agent reuse) need to be verified against the actual checked-in source instead of README marketing.

### Purpose

Produce a Level 3 Spec Kit research packet that turns Contextador's source code into actionable, evidence-backed recommendations for this repository, with each recommendation labeled `adopt now`, `prototype later`, or `reject`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- MCP tool surface registered in `external/src/mcp.ts`
- Query routing, pointer serialization, and `routeQuery(...)` semantics
- Self-healing feedback loop in `external/src/lib/core/feedback.ts` and `janitor.ts`
- Mainframe shared cache (`bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, `summarizer.ts`)
- Multi-provider abstraction (`external/src/lib/providers/config.ts`)
- `.mcp.json` auto-detection in `external/src/cli.ts`
- Token-efficiency claims and the `stats.ts` measurement quality
- Direct comparison with current CocoIndex, Code Graph MCP, and Spec Kit Memory surfaces in this repository
- Cross-phase boundary resolution against 002-codesight and 004-graphify

### Out of Scope

- Detailed commercial contract terms - licensing implications only, not legal review
- View AI marketing strategy - product framing only when needed for evidence labeling
- Speculative rewrites of Contextador into another runtime - Bun is a fixed assumption
- Generic MCP primers not grounded in this repository's tooling
- Implementation work - this packet is research-only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| spec.md | Create | This Level 3 specification |
| plan.md | Create | Research methodology and deep-research orchestration plan |
| tasks.md | Create | Task list for research, synthesis, and memory save |
| checklist.md | Create | Verification checklist for research deliverables |
| decision-record.md | Create | ADRs for research scoping and cli-codex delegation |
| research/research.md | Create | Canonical research output with at least 5 findings |
| research/iterations/iteration-NNN.md | Create | Per-iteration research notes |
| research/deep-research-config.json | Create | sk-deep-research config |
| research/deep-research-state.jsonl | Create | sk-deep-research state log |
| research/deep-research-strategy.md | Create | sk-deep-research strategy file |
| research/findings-registry.json | Create | Reducer-owned findings registry |
| research/deep-research-dashboard.md | Create | Auto-generated dashboard |
| implementation-summary.md | Create | Created at the end of the phase |
| memory/*.md | Create | Memory artifact via generate-context.js |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read `external/src/mcp.ts` first and trace every `server.tool(...)` registration | Iteration notes cite line ranges or tool names from `mcp.ts` |
| REQ-002 | Trace the self-healing loop end to end through `feedback.ts`, `janitor.ts`, `generator.ts`, and `enrichFromFeedback(...)` | Findings explain repair queue, regeneration, and enrichment with file references |
| REQ-003 | Trace Mainframe via `bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, and `summarizer.ts` | Findings describe sync model, query-hash dedup, room state, and budget tracking with file references |
| REQ-004 | Produce at least 5 evidence-backed findings labeled `adopt now`, `prototype later`, or `reject` | research/research.md contains the findings with the required schema |
| REQ-005 | Verify the 93% token-reduction claim against `stats.ts` and README | research/research.md documents whether the number is benchmarked, estimated, or marketing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Compare Contextador against current CocoIndex, Code Graph MCP, and Spec Kit Memory surfaces | research.md cites concrete repo paths in the comparison |
| REQ-007 | Resolve cross-phase boundaries with 002-codesight and 004-graphify | research.md explicitly states what is in scope for 003 vs siblings |
| REQ-008 | Address AGPL-3.0-or-later plus commercial licensing | research.md flags licensing constraints on direct adoption |
| REQ-009 | Use cli-codex (gpt-5.4 high) for iteration delegation wherever feasible | iteration files note which agent ran them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research/research.md contains at least 5 evidence-backed findings with the full minimum schema (title, source evidence, evidence type, what Contextador does, why it matters, recommendation, affected subsystem, risk).
- **SC-002**: validate.sh --strict on this phase folder returns exit code 0 (or only documented warnings) before deep research begins.
- **SC-003**: implementation-summary.md and memory artifacts are created from this folder via `generate-context.js`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex CLI availability for iteration delegation | High - blocks gpt-5.4 high path | Fall back to internal @deep-research agent if Codex is unreachable |
| Dependency | Pre-approved phase folder remains stable | High - workflow assumes Gate 3 is satisfied | All writes restricted to phase folder, no edits outside |
| Risk | README claims overstating self-healing or token savings | Medium - distorts recommendations | Label every claim as source-proven, README-documented, or both |
| Risk | Cross-phase scope creep into 002-codesight or 004-graphify | Medium - dilutes findings | Restate cross-phase boundaries inside research.md |
| Risk | AGPL licensing makes direct adoption non-trivial | Medium - reduces "adopt now" surface | Always pair recommendations with licensing notes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Each research iteration should complete within the cli-codex tool-call budget (target 8, max 12 tool calls).

### Security

- **NFR-S01**: No secrets, credentials, or tokens may be embedded in research artifacts or prompts delegated to Codex.

### Reliability

- **NFR-R01**: All findings must be reconstructable from JSONL state and iteration files even if research/research.md is deleted.

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: If `external/` is missing files referenced in the prompt, fall back to the nearest real path and document the correction.
- Maximum length: Iteration files target focused notes; consolidation happens in synthesis, not in individual iterations.

### Error Scenarios

- External service failure: If Codex CLI fails or rate-limits, retry once with reduced scope, then fall back to internal @deep-research.
- Network timeout: Treat as iteration error, append iteration record with status `error`, continue loop.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~15 external source files reviewed; LOC: research-only output; Systems: MCP, Janitor, Mainframe |
| Risk | 12/25 | Auth: N; API: N; Breaking: N; Licensing: Y |
| Research | 18/20 | Multi-subsystem investigation, evidence verification, cross-phase resolution |
| Multi-Agent | 8/15 | cli-codex delegation plus internal fallback |
| Coordination | 6/15 | Single phase folder, multiple iteration files |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | README claims diverge from source | M | H | Label evidence type for every claim |
| R-002 | Cross-phase scope leak into 002 / 004 | M | M | Re-state boundaries inside research.md |
| R-003 | Codex CLI unavailable mid-loop | H | L | Internal @deep-research fallback path |
| R-004 | AGPL licensing blocks direct adoption | M | H | Pair every "adopt now" recommendation with licensing note |

---

## 11. USER STORIES

### US-001: Verified self-healing loop story (Priority: P0)

**As a** maintainer of `Code_Environment/Public`, **I want** an evidence-backed account of Contextador's self-healing loop, **so that** I can decide whether to prototype a stale-context repair surface for this repo.

**Acceptance Scenarios**:

1. **Given** the source files in `external/src/lib/core/`, **When** research traces the loop end to end, **Then** the research output documents the lifecycle from agent failure report to repair queue to enrichment with file references.
2. **Given** an iteration finishes a feedback-loop trace, **When** the synthesis step compiles the research output, **Then** at least one finding labels the self-healing loop as adopt now, prototype later, or reject with rationale.

---

### US-002: Mainframe shared cache reality check (Priority: P0)

**As a** maintainer of `Code_Environment/Public`, **I want** to know what Mainframe actually synchronizes between agents, **so that** I can decide whether the shared cache idea is worth prototyping locally.

**Acceptance Scenarios**:

1. **Given** the Mainframe sources in `external/src/lib/mainframe/`, **When** research inspects bridge, rooms, dedup, and summarizer, **Then** the research output describes the Matrix room protocol, query-hash dedup, janitor locking, and where conflict resolution is missing.
2. **Given** the Mainframe trace is complete, **When** synthesis runs, **Then** the research output explicitly addresses privacy and operational tradeoffs for shared rooms and persistent agent IDs.

---

### US-003: Cross-phase boundary clarity (Priority: P1)

**As a** reviewer of the 026 research track, **I want** explicit boundaries between 003-contextador and its siblings, **so that** I can avoid duplicating findings across phases.

**Acceptance Scenarios**:

1. **Given** the cross-phase awareness table in the phase prompt, **When** the research output is finalized, **Then** it explicitly states what 003 owns vs 002-codesight and 004-graphify.
2. **Given** a finding overlaps with 002-codesight static-file generation or 004-graphify knowledge graph, **When** the synthesis labels the finding, **Then** the label notes which phase owns the topic and why 003 only addresses the MCP query, self-healing, and shared cache angles.

---

## 12. OPEN QUESTIONS

- How granular is the `routeQuery(...)` decision between AI routing, keyword fallback, and fan-out, and is fan-out bounded?
- Does Mainframe handle conflict resolution at all, or does last-writer-wins prevail for shared rooms?
- How does Contextador's `.mcp.json` auto-detection compare to this repo's existing MCP configuration patterns?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Phase Research Prompt**: See `scratch/phase-research-prompt.md`
- **Final Research**: See research/research.md (created during synthesis)

---
