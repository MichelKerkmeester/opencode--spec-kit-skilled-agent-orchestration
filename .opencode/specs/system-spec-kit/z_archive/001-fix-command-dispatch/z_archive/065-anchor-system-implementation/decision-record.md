---
title: "Deci [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation/decision-record]"
description: "Architecture Decision Record (ADR) documenting the choice of parsing strategy for the Anchor System."
trigger_phrases:
  - "decision"
  - "regex"
  - "based"
  - "anchor"
  - "extraction"
  - "decision record"
  - "065"
importance_tier: "important"
contextType: "planning"
---
# Decision: Regex-Based Anchor Extraction - Architecture Decision Record

Architecture Decision Record (ADR) documenting the choice of parsing strategy for the Anchor System.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Decision ID**: ADR-001
- **Status**: Accepted
- **Date**: 2026-01-15
- **Deciders**: OpenCode Agent
- **Related Feature**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation/spec.md`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## 2. CONTEXT

### Problem Statement
The Anchor System requires extracting specific sections of content from Markdown files based on `<!-- ANCHOR:id -->` HTML comments. We needed a reliable, performant way to parse these tags and their content without introducing excessive complexity or heavy dependencies.

### Constraints
- **Performance**: Parsing must happen on-the-fly during `memory_search`, so it must be fast (<10ms).
- **Dependencies**: Minimize new dependencies to keep the MCP server lightweight.
- **Robustness**: Must handle nested anchors and potential malformed tags gracefully.

### Assumptions
- Anchor tags follow a strict format: `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->`.
- Files are relatively small (max 100KB per spec validation rules).

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decision -->
## 3. DECISION

### Summary
We chose **Regex-Based Extraction** implemented in `memory-parser.js` over full AST parsing or client-side filtering.

### Detailed Description
The implementation uses JavaScript `RegExp` with a loop-based approach to find start tags and then search forward for the corresponding closing tag.
- **Pattern**: `<!--\s*(?:ANCHOR|anchor):\s*([a-zA-Z0-9-]+)\s*-->`
- **Logic**:
    1. Scan for all opening tags.
    2. For each opening tag, search the *remaining* string for the specific closing tag `<!-- /ANCHOR:id -->`.
    3. Extract the substring between them.

This approach supports nested anchors (because each opening tag triggers an independent search for its closer) and ignores broken tags without crashing.

### Technical Approach
```javascript
function extract_anchors(content) {
  const anchors = {};
  const anchor_regex = /<!--\s*(?:ANCHOR|anchor):\s*([a-zA-Z0-9-]+)\s*-->/gi;
  let match;
  while ((match = anchor_regex.exec(content)) !== null) {
    // ... find closing tag ...
    // ... extract content ...
  }
  return anchors;
}
```

<!-- /ANCHOR:decision -->
---

## 4. ALTERNATIVES CONSIDERED

### Option 1: [CHOSEN] Regex-Based Extraction

**Description**: Using native JS RegExp to find and extract blocks.

**Pros**:
- Zero external dependencies.
- Extremely fast for typical file sizes.
- Easy to implement and maintain.

**Cons**:
- Regex is not a full parser; theoretically brittle for complex edge cases (though unlikely in Markdown comments).

**Score**: 9/10

**Why Chosen**: Best balance of performance, simplicity, and lack of dependencies.

---

### Option 2: AST Parsing (Unified/Remark)

**Description**: Use a full Markdown parser like `remark` or `unified` to build an Abstract Syntax Tree, then traverse it to find HTML comment nodes.

**Pros**:
- Theoretically "correct" way to parse structured text.
- Robust handling of all Markdown syntax.

**Cons**:
- Heavy dependency tree (adds multiple MBs to `node_modules`).
- Slower parsing speed (overkill for just finding comments).
- Complexity in reconstructing raw text from AST nodes exactly as they were.

**Score**: 6/10

**Why Rejected**: Added unnecessary complexity and weight for a simple extraction task.

---

### Option 3: Client-Side Filtering

**Description**: Server returns full content; Client (AI Agent) extracts what it needs.

**Pros**:
- Zero server-side changes needed.

**Cons**:
- **Defeats the Purpose**: The goal is to save tokens. Sending full content to the client *uses* those tokens before the client can filter them.
- High bandwidth/latency.

**Score**: 2/10

**Why Rejected**: Completely fails to meet the core requirement of token savings.

---

<!-- ANCHOR:consequences -->
## 5. CONSEQUENCES

### Positive Consequences
- **High Performance**: Anchor extraction adds negligible overhead to search requests.
- **Simplicity**: Logic is contained in a single function in `memory-parser.js`.
- **Token Savings**: Immediate reduction in context usage (verified ~58-90%).

### Negative Consequences
- **Strict Syntax**: Users must strictly follow the `<!-- ANCHOR:id -->` format; typos might lead to missed anchors (mitigated by existing validation logic).

### Risks
- **ReDoS**: Maliciously crafted regex inputs could cause CPU spikes (mitigated by simple, bounded regex patterns).

<!-- /ANCHOR:consequences -->
---

## 6. IMPLEMENTATION NOTES

> **Implementation Status**: Completed and verified in `memory-parser.js`. Unit tests cover standard, nested, and broken anchor scenarios.
<!-- /ANCHOR:id -->
