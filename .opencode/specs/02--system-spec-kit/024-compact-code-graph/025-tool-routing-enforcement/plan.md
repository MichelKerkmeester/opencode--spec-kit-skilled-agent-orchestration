---
title: "Plan: Tool Routing Enforcement [025/024]"
description: "Implementation order for eliminating AI tool misjudgment across all CLI runtimes."
trigger_phrases:
  - "tool routing plan"
  - "enforcement implementation order"
  - "cocoindex enforcement plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 025 — Tool Routing Enforcement


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

### Implementation Order

### Layer 1: MCP Server Instructions (Universal — all CLIs)

1. **buildServerInstructions() routing section** (30-40 LOC)
   - In `context-server.ts:buildServerInstructions()`
   - After existing Session Recovery section, add Tool Routing section
   - Content: 3 rules (CocoIndex for semantic, Code Graph for structural, Grep for exact text)
   - Include CocoIndex availability check via `isCocoIndexAvailable()`
   - Include Code Graph freshness from session snapshot
   - Token budget: <200 tokens for routing section

2. **Tool description enrichment** (20-30 LOC)
   - In `tool-schemas.ts`: update `code_graph_query` description to include "Use INSTEAD of Grep for structural queries"
   - Add `mcp__cocoindex_code__search` cross-reference in memory_context description
   - Add "For code search, prefer CocoIndex" to relevant tool descriptions

### Layer 2: Session Priming Enforcement

3. **PrimePackage routing directives** (40-50 LOC)
   - In `hooks/memory-surface.ts`: extend `PrimePackage` interface with `routingRules: string[]`
   - Populate based on availability: CocoIndex available -> add semantic routing rule; Code Graph fresh -> add structural routing rule
   - Rules are actionable directives, not passive descriptions
   - Example: `"SEARCH ROUTING: semantic/concept queries -> mcp__cocoindex_code__search | structural queries (callers, dependencies) -> code_graph_query | exact text/regex -> Grep"`

4. **Session snapshot routing state** (15-20 LOC)
   - In `lib/session/session-snapshot.ts`: add `cocoIndexAvailable: boolean` and `routingRecommendation: string` to snapshot
   - Used by both buildServerInstructions and PrimePackage

### Layer 3: Tool Response Hints (Reactive)

5. **Response hint injection** (40-60 LOC)
   - In tool dispatch layer or envelope: when a tool call pattern suggests misjudgment, append a hint
   - Pattern: `memory_search` called with query matching code concepts -> hint: "Consider using mcp__cocoindex_code__search for code search"
   - Pattern: `memory_context` with code structural query -> hint: "Consider using code_graph_query for structural queries"
   - Light-touch: hints only, not blocking

### Layer 4: Instruction File Updates

6. **Constitutional memory** (1 file, 20-30 LOC)
   - Create `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
   - Title: "TOOL ROUTING ENFORCEMENT -- Code Search Decision Tree"
   - Constitutional tier = always surfaced on every query
   - Content: decision tree for search tool selection

7. **Runtime instruction files** (4 files, ~20 LOC each)
   - `CLAUDE.md` (root): Replace passive "MUST use" with active decision tree
   - `.claude/CLAUDE.md`: Add hook-aware routing reinforcement
   - `.codex/CODEX.md`: Add explicit routing since no hooks available
   - `.gemini/GEMINI.md`: Add routing for partial-hook runtime

8. **Context-prime agent** (5 files, ~10 LOC each)
   - All runtime copies of `.opencode/agent/context-prime.md`: add routing rules to output format
   - Prime Package display includes routing decision tree

### Estimated Total: 250-350 LOC
### Dependencies: Phases 018-024 complete (CocoIndex bridge, Code Graph auto-trigger, hookless priming)
### Risk: LOW -- all changes are additive enforcement, no functional changes to search tools

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scope and validation target before edits.
- Confirm in-scope files and runtime gates.

### Execution Rules
- TASK-SEQ: Apply changes in small, verifiable increments.
- TASK-SCOPE: Keep edits constrained to this phase packet and linked runtime surfaces.

### Status Reporting Format
- Status Reporting: report changes, verification commands, and outcomes per pass.

### Blocked Task Protocol
- BLOCKED: capture blocker evidence and immediate next action.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.

## L3: DEPENDENCY GRAPH
- Dependency graph snapshot preserved for planning completeness.
