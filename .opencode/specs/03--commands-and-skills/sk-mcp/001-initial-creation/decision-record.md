---
title: "Decision Record: Figma MCP Install Guide & Skill Creation [001-initial-creation/decision-record]"
description: "Date: 2024-12-30"
trigger_phrases:
  - "decision"
  - "record"
  - "figma"
  - "mcp"
  - "install"
  - "decision record"
  - "013"
  - "initial"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Decision Record: Figma MCP Install Guide & Skill Creation

> **Spec:** [spec.md](./spec.md) | **Plan:** [plan.md](./plan.md)

---

<!-- ANCHOR:adr-001 -->
## Decision 1: Code Mode Access Only

**Date:** 2024-12-30

**Context:**
Figma MCP can be accessed either as a native MCP server or through Code Mode's unified interface.

**Options Considered:**

| Option | Pros | Cons |
|--------|------|------|
| A) Native MCP | Direct access, simpler config | Context overhead (~3k tokens/tool), limited to 2-3 servers |
| B) Code Mode only | 98.7% token reduction, unified interface | Requires Code Mode skill knowledge |
| C) Both documented | Complete coverage | Confusing, maintenance burden |

**Decision:** Option B - Code Mode only

**Rationale:**
- Figma MCP is already configured in `.utcp_config.json` for Code Mode
- Token efficiency is critical for multi-tool workflows
- Consistent with mcp-narsil approach
- Users already need Code Mode for other MCP tools

**Consequences:**
- Install guide focuses on Code Mode configuration
- SKILL.md requires mcp-code-mode as dependency
- Examples use `call_tool_chain()` pattern
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## Decision 2: Pattern Source - mcp-narsil

**Date:** 2024-12-30

**Context:**
Need to choose a pattern source for the new skill structure.

**Options Considered:**

| Option | Pros | Cons |
|--------|------|------|
| A) mcp-narsil | Most comprehensive, 7 sections, references/assets | Complex |
| B) mcp-code-mode | Simpler, focused on orchestration | Less detailed tool docs |
| C) Custom structure | Tailored to Figma | Inconsistent with existing skills |

**Decision:** Option A - mcp-narsil pattern

**Rationale:**
- mcp-narsil has the most complete structure
- Includes references/ and assets/ folders
- Smart Routing section is valuable
- Tool reference pattern is well-established

**Consequences:**
- SKILL.md follows 7-section structure
- Create references/tool_reference.md and references/quick_start.md
- Create assets/tool_categories.md
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## Decision 3: Tool Priority Classification

**Date:** 2024-12-30

**Context:**
Need to classify 18 Figma tools by priority for user guidance.

**Options Considered:**

| Option | HIGH | MEDIUM | LOW |
|--------|------|--------|-----|
| A) All HIGH | 18 | 0 | 0 |
| B) Balanced | 5 | 7 | 6 |
| C) Conservative | 3 | 5 | 10 |

**Decision:** Option B - Balanced (5 HIGH, 7 MEDIUM, 6 LOW)

**Rationale:**
- HIGH tools are core design file access (get_file, get_file_nodes, get_image, get_file_components, get_file_styles)
- MEDIUM tools are useful but situational (comments, team projects, specific lookups)
- LOW tools are rarely needed (API key management, team-level queries, delete operations)

**Consequences:**
- tool_categories.md reflects this classification
- Quick start focuses on HIGH priority tools
- Examples prioritize HIGH and MEDIUM tools
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## Decision 4: Install Guide Section Count

**Date:** 2024-12-30

**Context:**
Install guide template has 11 sections (0-10). Need to decide which are required vs optional.

**Options Considered:**

| Option | Sections | Notes |
|--------|----------|-------|
| A) All 11 | 0-10 | Complete but lengthy |
| B) 9 required + 2 optional | Skip Features/Examples if simple | Figma has 18 tools, needs both |
| C) Custom | Merge sections | Inconsistent with template |

**Decision:** Option A - All 11 sections

**Rationale:**
- Figma has 18 tools requiring Features section
- Examples are essential for design workflows
- Consistency with MCP - Code Mode.md (1400+ lines)

**Consequences:**
- Install guide will be ~800-1000 lines
- Features section documents all 18 tools
- Examples section has 5-6 scenarios
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## Decision 5: Figma Token Documentation

**Date:** 2024-12-30

**Context:**
Users need a Figma Personal Access Token. Should we document token generation or link to Figma docs?

**Options Considered:**

| Option | Pros | Cons |
|--------|------|------|
| A) Full instructions | Self-contained | May become outdated |
| B) Link to Figma docs | Always current | Requires external navigation |
| C) Brief + link | Best of both | Slightly redundant |

**Decision:** Option C - Brief instructions + link

**Rationale:**
- Users need quick guidance
- Figma UI may change
- Link provides authoritative source

**Consequences:**
- Prerequisites section has brief token steps
- Links to Figma's official documentation
- Notes about token permissions needed
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## Decision 6: Example Scenarios Selection

**Date:** 2024-12-30

**Context:**
Need to select 5-6 example scenarios for the install guide.

**Selected Examples:**

| # | Scenario | Tools Used | Rationale |
|---|----------|------------|-----------|
| 1 | Get design file structure | get_file | Most basic operation |
| 2 | Export component as PNG | get_image | Common asset workflow |
| 3 | Get design system components | get_file_components | Design system use case |
| 4 | Add review comment | post_comment | Collaboration workflow |
| 5 | Multi-tool workflow | get_file + get_file_components + get_image | Shows orchestration |
| 6 | Get file styles | get_file_styles | Design token extraction |

**Rationale:**
- Covers HIGH and MEDIUM priority tools
- Progresses from simple to complex
- Represents real-world use cases
- Demonstrates Code Mode orchestration
<!-- /ANCHOR:adr-006 -->

---

## Decision Log Summary

| # | Decision | Choice | Date |
|---|----------|--------|------|
| 1 | Access method | Code Mode only | 2024-12-30 |
| 2 | Pattern source | mcp-narsil | 2024-12-30 |
| 3 | Tool priority | Balanced (5/7/6) | 2024-12-30 |
| 4 | Section count | All 11 sections | 2024-12-30 |
| 5 | Token docs | Brief + link | 2024-12-30 |
| 6 | Examples | 6 scenarios | 2024-12-30 |
