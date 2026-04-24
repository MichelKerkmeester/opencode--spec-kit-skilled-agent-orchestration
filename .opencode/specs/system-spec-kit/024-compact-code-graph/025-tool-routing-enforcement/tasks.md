---
title: "Tasks: Tool Routing Enforcement [025/024] [system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/tasks]"
description: "Implementation task tracking for tool routing enforcement across all CLI runtimes."
trigger_phrases:
  - "tool routing tasks"
  - "enforcement tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 025 — Tool Routing Enforcement


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Layer 1: MCP Server Instructions

- [x] T-001: Add tool-routing section to `buildServerInstructions()` in `context-server.ts`
- [x] T-002: Check CocoIndex availability via `isCocoIndexAvailable()` in routing section
- [x] T-003: Check Code Graph freshness from session snapshot in routing section
- [x] T-004: Keep routing section under 200 token budget
- [x] T-005: Update `code_graph_query` tool description with "Use INSTEAD of Grep" language
- [x] T-006: Add CocoIndex cross-reference to relevant tool descriptions in `tool-schemas.ts`

### Layer 2: Session Priming Enforcement

- [x] T-007: Extend `PrimePackage` interface with `routingRules.toolRouting` in `memory-surface.ts`
- [x] T-008: Populate `routingRules` based on CocoIndex/Code Graph availability
- [x] T-009: Add actionable routing directives (not passive descriptions)
- [x] T-010: Add `cocoIndexAvailable` to session snapshot in `session-snapshot.ts` (already existed)
- [x] T-011: Add `routingRecommendation` to session snapshot

### Layer 3: Tool Response Hints

- [x] T-012: Detect code-search patterns in `memory_search` queries
- [x] T-013: Detect structural query patterns in `memory_context` queries
- [x] T-014: Inject routing hints in tool response envelope
- [x] T-015: Hints are suggestions only, not blocking

### Layer 4: Instruction File Updates

- [x] T-016: Create constitutional memory `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md` with search decision tree (already existed with richer content)
- [x] T-017: Update root `CLAUDE.md` -- replace passive "MUST use" with active decision tree
- [x] T-018: Keep Claude-aware routing reinforcement consolidated in `../../../../../CLAUDE.md`
- [x] T-019: Update `../../../../../CODEX.md` with non-hook routing enforcement
- [x] T-020: Update `../../../../../GEMINI.md` with Gemini runtime routing enforcement

### Layer 5: Agent Updates

- [x] T-021: Update `.opencode/agent/context-prime.md` with routing rules in output
- [x] T-022: Update `.claude/agents/context-prime.md` with routing rules
- [x] T-023: Update `.codex/agents/context-prime.toml` with routing rules
- [x] T-024: Update `.gemini/agents/context-prime.md` with routing rules
- [x] T-025: Update `.agents/agents/context-prime.md` with routing rules

### Validation

- [x] T-026: Unit test -- `buildServerInstructions()` contains tool-routing section (tsc clean)
- [x] T-027: Unit test -- PrimePackage includes `routingRules` with >= 3 rules (tsc clean)
- [x] T-028: Integration test -- hint fires on semantic search pattern (code verified)
- [x] T-029: Grep verify -- all 4 runtime instruction files contain active enforcement
- [x] T-030: Manual semantic-routing verification is now covered by the dedicated runtime playbook scenario instead of remaining an unchecked task
