---
title: "Decision Record: OpenCode Naming Convention Alignment [090-opencode-naming-conventions/decision-record]"
description: "The sk-code--opencode skill enforces snake_case for JavaScript functions, parameters, and exports. This is non-standard for JS — MDN, Airbnb style guide, Node.js core, and virtu..."
trigger_phrases:
  - "decision"
  - "record"
  - "opencode"
  - "naming"
  - "convention"
  - "decision record"
  - "090"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: OpenCode Naming Convention Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Adopt camelCase for JavaScript in OpenCode Framework

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-06 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The `sk-code--opencode` skill enforces `snake_case` for JavaScript functions, parameters, and exports. This is non-standard for JS — MDN, Airbnb style guide, Node.js core, and virtually all JS libraries use `camelCase`. The current convention creates friction when reading/writing code and contradicts what every JS developer expects.

### Constraints
- ~206 JS files need migration (large blast radius)
- MCP handlers are the external API surface (must remain backward-compatible)
- Python and Shell files must NOT be affected
- SQL column names and external API keys must stay as-is

---

### Decision

**Summary**: Adopt camelCase as the standard for JavaScript functions, parameters, module variables, and exports in the OpenCode framework.

**Details**: All JS identifiers will be renamed from snake_case to camelCase. MCP handler exports will include backward-compatible aliases (both `handleMemorySearch` and `handle_memory_search`). Constants remain UPPER_SNAKE_CASE. Python stays PEP 8, Shell stays Google style.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **camelCase (Chosen)** | Industry standard, MDN/Airbnb/Node.js aligned, reduces friction | Large migration effort | 9/10 |
| Keep snake_case | No migration needed | Non-standard, confusing, unique to this project | 3/10 |
| Mixed (new code camelCase, old stays) | Less migration | Inconsistent codebase, confusing | 2/10 |

**Why Chosen**: Industry alignment outweighs migration cost. The migration is mechanical and can be done with high confidence.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current snake_case is non-standard, creates friction |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives explored |
| 3 | **Sufficient?** | PASS | Simple rename, no new abstractions |
| 4 | **Fits Goal?** | PASS | Directly aligns with "each language uses its ecosystem standard" |
| 5 | **Open Horizons?** | PASS | camelCase is the long-term JS standard |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- JS code follows industry convention
- Reduced cognitive load for any JS developer
- Consistent with external libraries and Node.js core

**Negative**:
- Large migration effort (~206 files) - Mitigation: Parallel agent execution
- Risk of broken cross-file imports - Mitigation: Post-migration sweep + verification

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken MCP handlers | H | Backward-compat export aliases |
| Missed renames | M | Grep verification pass |
| SQL key rename | M | Explicit exclusion rules |

---

### Implementation

**Affected Systems**:
- MCP server (handlers, core, lib, formatters, shared)
- Build/utility scripts
- Skill documentation

**Rollback**: `git checkout -- .opencode/skill/system-spec-kit/` restores all JS files

---

## ADR-002: Backward-Compatible Export Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-06 |
| **Deciders** | Michel Kerkmeester |

---

### Context

MCP handlers are registered by export name. If we only export `handleMemorySearch`, any consumer using `handle_memory_search` will break.

### Decision

**Summary**: MCP handler exports include both camelCase (primary) and snake_case (alias).

**Details**:
```javascript
module.exports = {
  handleMemorySearch,  // primary
  handle_memory_search: handleMemorySearch,  // backward-compat alias
};
```

This applies only to MCP handler files in `mcp_server/handlers/`. Internal scripts and utilities only need the camelCase export.

---

### Consequences

**Positive**: Zero breaking changes for consumers
**Negative**: Slightly larger export objects - negligible impact
