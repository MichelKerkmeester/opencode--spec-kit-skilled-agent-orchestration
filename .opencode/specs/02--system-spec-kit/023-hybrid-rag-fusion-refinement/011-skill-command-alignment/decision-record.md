---
title: "Decision Record: Skill & Command Alignment"
description: "Two architectural decisions for agent file synchronization strategy."
importance_tier: "normal"
contextType: "decision"
---
# Decision Record: Skill & Command Alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical + Sync Editing Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | User, Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

Four speckit agent files across different runtimes (Copilot/OpenCode, ChatGPT, Claude, Gemini) share identical body content but have runtime-specific frontmatter and path convention lines. We needed to update Section 2 (MCP Tool Layers) in all four files consistently.

### Constraints

- All 4 files must end up with identical body content
- Frontmatter differs per runtime (model names, permission formats, tool names)
- Path convention line differs per runtime (e.g., `.opencode/agent/*.md` vs `.claude/agents/*.md`)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Edit `.opencode/agent/speckit.md` as the canonical source, then propagate the same body content changes to the 3 mirror files.

**How it works**: Make all content changes to the canonical file first. Then apply the identical text replacement to each mirror file. Verify with diff that Section 2 body content matches across all 4 files.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical + Sync** | Single source of truth, lower divergence risk | Requires explicit sync step | 9/10 |
| Edit all 4 independently | No sync step needed | Higher risk of divergence, typos | 4/10 |
| Template-based generation | Fully automated sync | Over-engineered for 6 lines of changes | 3/10 |

**Why this one**: Simplest approach that guarantees consistency. The sync step is trivial (same string replacement in 3 files) and verification is a single diff command.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- All 4 files guaranteed to have identical Section 2 content
- Single point of editing reduces error rate

**What it costs**:
- Requires 4 edit operations instead of 1. Mitigation: Edits are identical and can be parallelized.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Forgetting to sync a mirror | M | Diff verification step catches this |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Agent files are out of sync with actual tool inventory |
| 2 | **Beyond Local Maxima?** | PASS | Three approaches evaluated |
| 3 | **Sufficient?** | PASS | Simplest approach that guarantees consistency |
| 4 | **Fits Goal?** | PASS | Directly solves the agent drift problem |
| 5 | **Open Horizons?** | PASS | Same pattern reusable for future agent updates |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/agent/speckit.md`: L4 row, L6 row, 2 blockquote notes added
- 3 mirror files: identical body content changes applied

**How to roll back**: `git checkout -- .opencode/agent/speckit.md .opencode/agent/chatgpt/speckit.md .claude/agents/speckit.md .gemini/agents/speckit.md`
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Save-time Note Placement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | User, Claude |

---

### Context

Agents needed awareness of three save-time behaviors: quality gate (0.4 signal density), reconsolidation (0.88 similarity merge), and verify-fix-verify loop. The question was where to put this information in the agent definition files.

### Constraints

- Agent files should stay under 550 lines
- Information should be contextually relevant to MCP tool usage
- Cross-reference SKILL.md for full details (not duplicate everything)

---

### Decision

**We chose**: Brief blockquote notes immediately after the MCP Tool Layers table in Section 2.

**How it works**: Two `>` blockquote paragraphs after the L7 row, before the `---` separator. First note covers `memory_context` modes, second covers save-time behaviors. Both are concise (2-3 lines each) with cross-reference to SKILL.md.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Blockquote after table** | Contextually adjacent, minimal footprint (~6 lines) | Slightly unconventional placement | 9/10 |
| New dedicated section | Clear separation, standard structure | Too heavy for 6 lines, pushes file over 550 | 5/10 |
| Inline in table cells | Zero extra lines | Table cells become unwieldy, hard to read | 2/10 |

**Why this one**: Keeps the information right where agents look (Section 2, MCP tools) while adding only ~6 lines. Blockquotes visually distinguish the notes from the table.

---

### Consequences

**What improves**:
- Agents immediately see behavioral context after reading tool inventory
- File stays lean at ~544 lines (under 550 limit)

**What it costs**:
- Blockquotes after a table are slightly unconventional. Mitigation: Markdown renders them cleanly.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Agents lack awareness of save-time behaviors |
| 2 | **Beyond Local Maxima?** | PASS | Three placement options evaluated |
| 3 | **Sufficient?** | PASS | Concise notes + SKILL.md cross-reference |
| 4 | **Fits Goal?** | PASS | Fills GAP-4, GAP-5, GAP-7 |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future behavioral notes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- 2 blockquote paragraphs added after MCP Tool Layers table in all 4 agent files

**How to roll back**: Remove the 2 blockquote paragraphs from each file
<!-- /ANCHOR:adr-002 -->
