---
title: "Implementation Plan: Anchor System [065-anchor-system-implementation/plan]"
description: "The implementation focuses on enhancing the existing memory-parser.js to support extraction (not just validation) and integrating this capability into the memory_search MCP tool."
trigger_phrases:
  - "implementation"
  - "plan"
  - "anchor"
  - "system"
  - "065"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Anchor System

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

## 1. Technical Approach

The implementation focuses on enhancing the existing `memory-parser.js` to support **extraction** (not just validation) and integrating this capability into the `memory_search` MCP tool.

### Core Components
1.  **Parser Engine (`memory-parser.js`)**:
    *   Add `extract_anchors(content)` function.
    *   Use Regex to find `<!-- ANCHOR:id -->...<!-- /ANCHOR:id -->` blocks.
    *   Return an object/map: `{ "id": "content", ... }`.

2.  **MCP Integration (`context-server.js`)**:
    *   **Tool Schema:** Add `anchors: string[]` to `memory_search` input.
    *   **Handler Logic:**
        *   If `anchors` param is present AND `includeContent: true`:
        *   Parse the file content.
        *   Filter content to keep only requested anchors.
        *   Calculate "hypothetical full tokens" vs "actual returned tokens".
        *   Inject savings metrics into result metadata.

### Data Flow
1.  User calls `memory_search(query="...", includeContent=true, anchors=["summary", "state"])`.
2.  Server performs vector search to find relevant files.
3.  For each result:
    *   Load full file content from disk.
    *   Pass content to `extract_anchors`.
    *   Select "summary" and "state" sections.
    *   Join them (e.g., with `\n\n---\n\n`).
    *   Replace `result.content` with this filtered snippet.
    *   Add `token_metrics` object to result.
4.  Return results to user.

---

## 2. Phased Execution

### Phase 1: Parser Logic (TDD)
- [ ] Create `scratch/fixture-memory.md` with various anchor patterns (standard, nested, broken).
- [ ] Create `scratch/test-parser.js` test runner.
- [ ] Implement `extract_anchors` in `memory-parser.js`.
- [ ] Verify extraction works correctly on fixture.

### Phase 2: MCP Integration
- [ ] Update `memory_search` tool definition in `context-server.js`.
- [ ] Implement filtering logic in `formatSearchResults`.
- [ ] Implement token metrics calculation.

### Phase 3: Verification
- [ ] Create `scratch/verify-mcp.js` to simulate MCP tool calls.
- [ ] Verify `memory_search` returns filtered content.
- [ ] Verify token savings are reported accurately.
- [ ] Verify graceful degradation (missing anchors don't crash).

---

## 3. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Regex Performance** | Slow parsing on large files | Use non-backtracking patterns; files are capped at 100KB. |
| **Schema Breaking** | Existing clients fail | `anchors` param is optional; default behavior is unchanged. |
| **Malformed Anchors** | Parser failure | Validation logic already exists; extraction should be robust (ignore broken tags). |

---

## 4. Verification Plan

### Automated Tests
- `scratch/test-parser.js`: Unit tests for extraction logic.
- `scratch/verify-mcp.js`: Integration test for the full flow.

### Manual Verification
1.  Start MCP server.
2.  Call `memory_search` with anchors via inspector or script.
3.  Confirm output is truncated to specific sections.
