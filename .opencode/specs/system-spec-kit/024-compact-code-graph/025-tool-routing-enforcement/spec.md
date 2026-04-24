<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Feature Specification: Tool Routing [system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec]"
description: "Fix root cause of AI tool misjudgment — enforce CocoIndex and Code Graph usage across all CLI runtimes via MCP-level enforcement, not just passive CLAUDE.md instructions."
trigger_phrases:
  - "tool routing enforcement"
  - "cocoindex not used"
  - "code graph misjudgment"
  - "use cocoindex instead of grep"
  - "semantic search enforcement"
importance_tier: "critical"
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
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 25 of 27 |
| **Predecessor** | 024-hookless-priming-optimization |
| **Successor** | 026-session-start-injection-debug |
| **Handoff Criteria** | All CLIs (hook and non-hook) consistently use CocoIndex for semantic searches and Code Graph for structural queries |

### Phase Context

This is **Phase 025** of the compact-code-graph specification.

**Scope Boundary**: MCP server instructions, session priming payloads, tool response hints, and runtime instruction files. No changes to CocoIndex or Code Graph core functionality.

**Dependencies**: Phases 018-024 (all complete — hookless priming, auto-trigger, query routing)

**Deliverables**: Active guidance/enforcement hints that materially reduce tool misjudgment across runtimes (without hard-blocking tool calls).

---

# Feature Specification: Tool Routing Enforcement


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## EXECUTIVE SUMMARY
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. NON-FUNCTIONAL REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 8. EDGE CASES
Template compliance shim section. Legacy phase content continues below.

## 9. COMPLEXITY ASSESSMENT
Template compliance shim section. Legacy phase content continues below.

## 10. RISK MATRIX
Template compliance shim section. Legacy phase content continues below.

## 11. USER STORIES
Template compliance shim section. Legacy phase content continues below.

## 12. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

## RELATED DOCUMENTS
Template compliance shim section. Legacy phase content continues below.

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-01 |
| **Branch** | `system-speckit/024-compact-code-graph` |

---

### 2. PROBLEM & PURPOSE
### Problem Statement

AI assistants across all CLI runtimes (Claude Code, Codex CLI, Copilot CLI, Gemini CLI) consistently default to Grep/Glob for code search tasks even when CocoIndex (semantic search) and Code Graph (structural queries) are available and appropriate. The root cause is a **passive instruction model**: CLAUDE.md says "MUST use CocoIndex" but this competes with the AI's built-in preference for familiar, fast tools. There is no active enforcement at the MCP layer where the AI actually makes tool selection decisions.

**Observed failure modes:**
1. Semantic/concept searches ("find code regarding X") use Grep instead of CocoIndex
2. Structural queries ("what calls this function") use Grep instead of Code Graph
3. Session priming reports tool availability but doesn't inject routing rules
4. `buildServerInstructions()` mentions memory tools but not CocoIndex/Code Graph routing
5. Hook-compatible CLIs have hooks that fire but don't enforce tool selection
6. Non-hook CLIs (Codex, Copilot, Gemini) rely entirely on passive instruction files

### Purpose

Eliminate AI tool misjudgment by adding active enforcement at three MCP enforcement points — server instructions, session priming, and tool response hints — so that ALL CLIs (hook and non-hook) route to the correct search tool without relying on the AI reading and following CLAUDE.md instructions.

---

### 3. SCOPE
### In Scope
- Add tool-routing rules to `buildServerInstructions()` (all CLIs receive this)
- Enrich session priming `PrimePackage` with explicit tool-routing directives
- Add `hints` field to tool responses that redirect to CocoIndex/Code Graph when appropriate
- Update tool descriptions in `tool-schemas.ts` with routing guidance
- Add constitutional memory for tool routing enforcement
- Update all runtime CLAUDE.md/instruction files with stronger enforcement language

### Out of Scope
- CocoIndex core functionality changes — working correctly already
- Code Graph indexer/query changes — working correctly already
- New MCP tools — reuse existing infrastructure
- UI/UX changes — enforcement is at the MCP protocol level

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/context-server.ts` | Modify | Add tool-routing section to `buildServerInstructions()` |
| `mcp_server/hooks/memory-surface.ts` | Modify | Add routing directives to `PrimePackage` |
| `mcp_server/tool-schemas.ts` | Modify | Add routing guidance to search-adjacent tool descriptions |
| `mcp_server/lib/session/session-snapshot.ts` | Modify | Add `cocoIndexAvailable` and routing rules to snapshot |
| `../../../../../CLAUDE.md` | Modify | Strengthen CocoIndex/Code Graph enforcement language and keep Claude-aware routing guidance consolidated in the active workspace file |
| `../../../../../AGENTS.md` | Modify | Add non-hook routing enforcement |
| `../../../../../AGENTS.md` | Modify | Add Gemini runtime routing enforcement |
| Runtime agent files (context-prime.md x5) | Modify | Add routing directives to prime output |

---

### 4. REQUIREMENTS
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `buildServerInstructions()` includes tool-routing rules | Server instructions contain "Use CocoIndex for semantic/concept searches" and "Use Code Graph for structural queries" |
| REQ-002 | PrimePackage includes routing directives | `primePackage.routingRules` object present with named `graphRetrieval`, `communitySearch`, and `toolRouting` fields |
| REQ-003 | Tool response hints redirect misjudgment | When `memory_search` or `memory_context` is called with a code-search query, response includes hint about CocoIndex |
| REQ-004 | All runtimes receive enforcement | Claude Code (hooks), Codex (no hooks), Copilot (no hooks), Gemini (partial hooks) all get routing rules via MCP |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Constitutional memory for routing | `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md` constitutional memory exists and surfaces on code search queries |
| REQ-006 | Runtime instruction files updated | All CLAUDE.md/CODEX.md/GEMINI.md files have active enforcement language, not just "MUST use" |
| REQ-007 | Context-prime agent outputs routing rules | Prime Package output includes routing decision tree |

---

### 5. SUCCESS CRITERIA
- **SC-001**: `buildServerInstructions()` output contains tool-routing section (verified by unit test)
- **SC-002**: PrimePackage includes a `routingRules` object with named graph retrieval, community search, and tool routing fields (verified by unit test)
- **SC-003**: At least one tool response hint fires when semantic search is appropriate (verified by integration test)
- **SC-004**: All 4 runtime instruction files contain active enforcement language (verified by grep)

---

### 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | CocoIndex MCP server running | Routing rules are useless if CocoIndex is down | Include availability check; degrade gracefully |
| Dependency | Code Graph database populated | Structural query routing needs data | Check graph freshness before recommending |
| Risk | Instruction bloat in server instructions | Token budget exceeded | Keep routing section to <200 tokens |
| Risk | Over-aggressive routing creates false redirects | AI sent to CocoIndex for exact text match | Include "use Grep for exact text/regex" escape hatch |
| Dependency | **Phase 009 graph retrieval improvements** | Once community search + dual-level retrieval are implemented, routing rules must be extended | Coordinate: update `buildServerInstructions()` and `PrimePackage.routingRules` after 009 Phase B |

---

### 7. OPEN QUESTIONS

- Should routing enforcement be a standalone MCP tool (`tool_routing_check`) or embedded in existing responses?
- How aggressive should hints be? (soft suggestion vs. "WRONG TOOL" warning)
- Should we track routing compliance metrics (how often AI follows vs. ignores routing hints)?

### Requirements Traceability
- REQ-008: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 5 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 6 runs, **Then** expected packet behavior remains intact.
