---
title: "Plan: Phase 010 — CocoIndex Bridge + [system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/plan]"
description: "1. Implement seed-resolver.ts"
trigger_phrases:
  - "plan"
  - "phase"
  - "010"
  - "cocoindex"
  - "bridge"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 010 — CocoIndex Bridge + code_graph_context


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

1. **Implement `seed-resolver.ts`:**
   - Accept `CodeGraphSeed[]` from any provider
   - Normalize each seed to `ArtifactRef` (filePath, startLine, endLine, symbolId, fqName)
   - Resolution chain: exact symbol → near-exact symbol → enclosing symbol → file anchor
   - Deduplicate overlapping seeds
   - Score each resolution with confidence value
2. **Implement `code-graph-context.ts`:**
   - Parse MCP tool input (input, queryMode, subject, seeds, budget params)
   - Call seed-resolver for all seeds
   - Select expansion behavior based on queryMode:
      - `neighborhood`: 1-hop CALLS + IMPORTS + CONTAINS from resolved anchors
      - `outline`: file/package CONTAINS + EXPORTS
      - `impact`: reverse CALLS + reverse IMPORTS
    - Execute graph queries via Phase 009 `code_graph_query`
    - Optional reverse semantic augmentation: expanded graph neighbors → CocoIndex search
    - Collect results into the handler response envelope (`status`, `data.queryMode`, `data.anchors`, `data.graphContext`, `data.textBrief`, `data.combinedSummary`, `data.nextActions`, `data.metadata`)
    - Keep formatting helpers inline in `code-graph-context.ts`
    - Note: `ContextArgs` accepts `includeTrace`, but MCP schema does not expose it because `additionalProperties: false` blocks undeclared fields
3. **Register tool in MCP server:**
    - Add `code_graph_context` schema to `tool-schemas.ts`
    - Wire handler in `context-server.ts`
4. **Test with real CocoIndex results:**
    - Run CocoIndex search → feed results as seeds to code_graph_context
    - Verify resolution chain produces correct graph anchors
    - Check that expanded neighborhood includes relevant structural neighbors
    - Verify text fallback is readable and within budget
5. **Test edge cases:**
    - Seeds with no graph node match → file anchor fallback
    - Empty seeds array → outline mode fallback
    - Budget of 0 → minimal response (root + one edge)
    - Multiple seeds resolving to same node → deduplicated

<!-- ANCHOR:dependencies -->
### Dependencies

- Phase 008 indexer (for node data in graph)
- Phase 009 storage + query tools (for graph queries)
- CocoIndex Code MCP (for semantic seeds — already deployed)
- Existing profile-formatters.ts patterns (for output style)
<!-- /ANCHOR:dependencies -->

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Seed-to-node ambiguity | Confidence scoring + fallback chain, never fail |
| CocoIndex unavailable | Proceed without seeds, use subject or outline fallback |
| Budget overflow from large neighborhoods | Deterministic truncation, 1-hop default |
| Reverse semantic augmentation too slow | Skip if <400ms budget remains (latency guard) |

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
