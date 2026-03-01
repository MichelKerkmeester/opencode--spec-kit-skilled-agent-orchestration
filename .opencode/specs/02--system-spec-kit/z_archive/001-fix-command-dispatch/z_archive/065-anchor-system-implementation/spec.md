---
title: "Feature Specification: Anchor System Implementation - Targeted Memory Retrieval [065-anchor-system-implementation/spec]"
description: "Complete feature specification defining requirements, user stories, and success criteria for the Anchor System implementation."
trigger_phrases:
  - "feature"
  - "specification"
  - "anchor"
  - "system"
  - "implementation"
  - "spec"
  - "065"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Anchor System Implementation - Targeted Memory Retrieval

Complete feature specification defining requirements, user stories, and success criteria for the Anchor System implementation.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Level**: 3
- **Tags**: memory-system, optimization, mcp
- **Priority**: P1
- **Feature Branch**: `065-anchor-system-implementation`
- **Created**: 2025-01-15
- **Status**: Complete
- **Input**: "93% token savings" goal from Spec Kit documentation

### Stakeholders
- **AI Agents**: Primary consumers of memory context
- **Developers**: Users of the Spec Kit system
- **System Owner**: Michel Kerkmeester

### Problem Statement
Currently, the Spec Kit system *creates* anchors (the `<!-- ANCHOR:id -->` tags) in memory files, but the retrieval system ignores them. When an agent needs context, it must load the **entire** memory file (often 2000+ tokens), even if it only needs a specific section like "Project State" or "Key Decisions". This wastes tokens, reduces context window availability, and slows down processing.

### Purpose
Implement the backend logic to enable **targeted retrieval** of specific memory sections via anchors, realizing the promised ~90% token savings by allowing agents to load *only* what they need.

### Assumptions
- Memory files already follow the ANCHOR format (validated by current system).
- The `memory-parser.js` module is the correct place for extraction logic.
- The `memory_search` tool is the primary entry point for retrieving context.

---

## 2. SCOPE

### In Scope
- **Anchor Parsing Logic:** Implementing `extract_anchors` in `memory-parser.js`.
- **MCP Tool Update:** Updating `memory_search` to accept an `anchors` parameter.
- **Content Filtering:** Logic to filter returned file content to only requested anchors.
- **Token Savings Metrics:** Calculating and reporting the actual savings.

### Out of Scope
- **Auto-Anchoring:** Automatically adding anchors to files that don't have them (files must already be formatted).
- **Client-Side Integration:** Updating the AI agent's *prompting strategy* to use this feature (we are building the *capability*, not the policy).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js` | Modify | Add `extract_anchors` function |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | Modify | Update `memory_search` schema and handler |
| `.opencode/skill/system-spec-kit/mcp_server/lib/token-budget.js` | Modify | Add token calculation for anchor savings (if needed) |

---

## 3. USERS & STORIES

### User Story 1 - Targeted Context Retrieval (Priority: P0)
**As an** AI agent,
**I want to** request specific sections of a memory file (e.g., "summary", "state"),
**So that** I can minimize token usage while maintaining necessary context.

**Why This Priority**: This is the core value proposition of the Anchor System.

**Acceptance Scenarios**:
1. **Given** a memory file with `ANCHOR:summary` and `ANCHOR:details`, **When** I call `memory_search` with `anchors=['summary']`, **Then** I receive ONLY the summary content.
2. **Given** a memory file, **When** I request a non-existent anchor, **Then** I receive a clear warning or partial content, not an error.

### User Story 2 - Token Savings Verification (Priority: P1)
**As a** system developer,
**I want to** see the calculated token savings in the response metadata,
**So that** I can verify the efficacy of the system.

**Why This Priority**: Validates the "93%" claim.

**Acceptance Scenarios**:
1. **Given** a targeted retrieval, **When** I inspect the response, **Then** I see fields for `actualTokens`, `fullFileTokens`, and `savingsPercent`.

---

## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** `memory-parser.js` MUST export an `extract_anchors(content)` function that returns a map of anchor IDs to their content.
- **REQ-FUNC-002:** The extraction logic MUST handle standard anchor format: `<!-- ANCHOR:id -->...<!-- /ANCHOR:id -->` (case-insensitive).
- **REQ-FUNC-003:** The `memory_search` tool MUST accept an optional `anchors` parameter (array of strings).
- **REQ-FUNC-004:** When `anchors` is provided and `includeContent` is true, the system MUST filter the returned content to include ONLY the requested sections.
- **REQ-FUNC-005:** If multiple anchors are requested, they MUST be joined with a separator (e.g., `\n\n...\n\n`).
- **REQ-FUNC-006:** The response MUST include metadata indicating the token savings achieved.

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Parsing overhead MUST be negligible (<10ms per file).
- **NFR-P02**: Regular expression MUST be optimized to prevent catastrophic backtracking (ReDoS).

### Reliability
- **NFR-R01**: The system MUST handle malformed anchors gracefully (e.g., missing closing tag) without crashing.
- **NFR-R02**: If a requested anchor is not found, the system MUST NOT fail the entire request.

---

## 6. EDGE CASES

### Data Boundaries
- **Nested Anchors:** How to handle `<!-- ANCHOR:outer -->...<!-- ANCHOR:inner -->...<!-- /ANCHOR:inner -->...<!-- /ANCHOR:outer -->`? (Assumption: Return inner content as part of outer).
- **Duplicate IDs:** If a file has two anchors with the same ID, returning the first one is acceptable.

### Error Scenarios
- **No Anchors Found:** Return empty content or a specific message.
- **Partial Match:** Requested `['A', 'B']` but only `A` exists. Return `A` and a warning about `B`.

---

## 7. SUCCESS CRITERIA

### Measurable Outcomes
- **SC-001**: `memory_search` correctly filters content based on anchor IDs.
- **SC-002**: Token savings are calculated and reported.
- **SC-003**: System handles missing/invalid anchors without crashing.

---

## 8. DEPENDENCIES & RISKS

### Dependencies
- **Existing Parser:** `memory-parser.js` already exists; we are extending it.
- **MCP Server:** `context-server.js` is the integration point.

### Risks
- **R-001**: ReDoS vulnerability in regex. *Mitigation:* Use simple, bounded regex patterns.
- **R-002**: Breaking existing `memory_search` clients. *Mitigation:* Make `anchors` parameter optional; default behavior (full content) remains unchanged.

---
