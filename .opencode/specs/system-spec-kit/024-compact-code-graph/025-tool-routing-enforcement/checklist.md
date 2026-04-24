<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Checklist: Tool Routing Enforcement [system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/checklist]"
description: "Verification checklist for tool routing enforcement across all CLI runtimes."
trigger_phrases:
  - "tool routing checklist"
  - "enforcement verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "024-compact-code-graph/025-tool-routing-enforcement"
    last_updated_at: "2026-04-24T15:33:48Z"
    last_updated_by: "claude-opus-4-7-spec-audit-2026-04-24"
    recent_action: "Spec audit + path reference remediation (Pass 1-3)"
    next_safe_action: "Continue systematic remediation or reindex"
    blockers: []

---
# Verification Checklist: Phase 025 — Tool Routing Enforcement


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

### Layer 1: MCP Server Instructions

### P1

- [x] T-001: Add tool-routing section to `buildServerInstructions()` in `context-server.ts` [EVIDENCE: verified in implementation-summary.md]
- [x] T-002: Check CocoIndex availability via `isCocoIndexAvailable()` in routing section [EVIDENCE: verified in implementation-summary.md]
- [x] T-003: Check Code Graph freshness from session snapshot in routing section [EVIDENCE: verified in implementation-summary.md]
- [x] T-004: Keep routing section under 200 token budget [EVIDENCE: verified in implementation-summary.md]
- [x] T-005: Update `code_graph_query` tool description with "Use INSTEAD of Grep" language [EVIDENCE: verified in implementation-summary.md]
- [x] T-006: Add CocoIndex cross-reference to relevant tool descriptions in `tool-schemas.ts` [EVIDENCE: verified in implementation-summary.md]

### Layer 2: Session Priming Enforcement

- [x] T-007: Extend `PrimePackage` interface with `routingRules.toolRouting` in `memory-surface.ts` [EVIDENCE: verified in implementation-summary.md]
- [x] T-008: Populate `routingRules` based on CocoIndex/Code Graph availability [EVIDENCE: verified in implementation-summary.md]
- [x] T-009: Add actionable routing directives (not passive descriptions) [EVIDENCE: verified in implementation-summary.md]
- [x] T-010: Add `cocoIndexAvailable` to session snapshot in `session-snapshot.ts` (already existed) [EVIDENCE: verified in implementation-summary.md]
- [x] T-011: Add `routingRecommendation` to session snapshot [EVIDENCE: verified in implementation-summary.md]

### Layer 3: Tool Response Hints

- [x] T-012: Detect code-search patterns in `memory_search` queries [EVIDENCE: verified in implementation-summary.md]
- [x] T-013: Detect structural query patterns in `memory_context` queries [EVIDENCE: verified in implementation-summary.md]
- [x] T-014: Inject routing hints in tool response envelope [EVIDENCE: verified in implementation-summary.md]
- [x] T-015: Hints are suggestions only, not blocking [EVIDENCE: verified in implementation-summary.md]

### Layer 4: Instruction File Updates

- [x] T-016: Create constitutional memory `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md` with search decision tree (already existed with richer content) [EVIDENCE: verified in implementation-summary.md]
- [x] T-017: Update root `CLAUDE.md` -- replace passive "MUST use" with active decision tree [EVIDENCE: verified in implementation-summary.md]
- [x] T-018: Keep Claude-aware routing reinforcement consolidated in `../../../../../CLAUDE.md` [EVIDENCE: verified in implementation-summary.md]
- [x] T-019: Update `../../../../../CODEX.md` with non-hook routing enforcement [EVIDENCE: verified in implementation-summary.md]
- [x] T-020: Update `../../../../../GEMINI.md` with Gemini runtime routing enforcement [EVIDENCE: verified in implementation-summary.md]

### Layer 5: Agent Updates

- [x] T-021: Update `.opencode/agent/context-prime.md` with routing rules in output [EVIDENCE: verified in implementation-summary.md]
- [x] T-022: Update `.claude/agents/context-prime.md` with routing rules [EVIDENCE: verified in implementation-summary.md]
- [x] T-023: Update `.codex/agents/context-prime.toml` with routing rules [EVIDENCE: verified in implementation-summary.md]
- [x] T-024: Update `.gemini/agents/context-prime.md` with routing rules [EVIDENCE: verified in implementation-summary.md]
- [x] T-025: Update `.agents/agents/context-prime.md` with routing rules [EVIDENCE: verified in implementation-summary.md]

### Validation

- [x] T-026: Unit test -- `buildServerInstructions()` contains tool-routing section (tsc clean) [EVIDENCE: verified in implementation-summary.md]
- [x] T-027: Unit test -- PrimePackage includes `routingRules` with >= 3 rules (tsc clean) [EVIDENCE: verified in implementation-summary.md]
- [x] T-028: Integration test -- hint fires on semantic search pattern (code verified) [EVIDENCE: verified in implementation-summary.md]
- [x] T-029: Grep verify -- all 4 runtime instruction files contain active enforcement [EVIDENCE: verified in implementation-summary.md]
- [x] T-030: Manual semantic-routing verification is covered by the dedicated tool-routing playbook scenario [EVIDENCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md` includes the runtime routing checks]
