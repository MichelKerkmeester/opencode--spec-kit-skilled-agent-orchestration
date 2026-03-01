---
title: "Implementation Summary: mcp-gemini-cli Skill"
description: "Documentation-only skill enabling Claude Code and OpenCode to orchestrate Google's Gemini CLI for cross-AI tasks."
trigger_phrases:
  - "gemini cli summary"
  - "mcp-gemini-cli summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: mcp-gemini-cli Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Was Built

A documentation-only skill (`mcp-gemini-cli`) that teaches Claude Code and OpenCode agents how to invoke Google's Gemini CLI for supplementary AI tasks. The skill provides structured guidance for cross-AI validation, web research via Google Search grounding, codebase architecture analysis, and parallel task processing.

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Documentation-only (no MCP server) | Gemini CLI is invoked directly via Bash tool — no adapter needed |
| 8-section SKILL.md standard | Follows sk-doc conventions for consistency with other skills |
| Progressive disclosure | SKILL.md (2395 words) → 3 references + 1 asset for deep content |
| Smart routing with 7 intents | Covers all use cases: GENERATION, REVIEW, RESEARCH, ARCHITECTURE, TEMPLATES, PATTERNS, AGENT_DELEGATION |
| Gemini agent delegation | Claude Code as conductor, 9 Gemini agents as specialized executors |
| Skill advisor integration | Both Public and Barter skill_advisor.py updated with discovery entries |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:files-changed -->
## 2. FILES CHANGED

| File | Change | LOC |
|------|--------|-----|
| `.opencode/skill/mcp-gemini-cli/SKILL.md` | Created | 421 |
| `.opencode/skill/mcp-gemini-cli/references/cli_reference.md` | Created | 450 |
| `.opencode/skill/mcp-gemini-cli/references/integration_patterns.md` | Created | 636 |
| `.opencode/skill/mcp-gemini-cli/references/gemini_tools.md` | Created | 474 |
| `.opencode/skill/mcp-gemini-cli/assets/prompt_templates.md` | Created | 351 |
| `.opencode/skill/mcp-gemini-cli/references/agent_delegation.md` | Created | 280 |
| `.opencode/skill/mcp-gemini-cli/SKILL.md` | Rewritten | ~350 |
| `.opencode/skill/scripts/skill_advisor.py` (Public) | Updated | +20 |
| `.opencode/skill/scripts/skill_advisor.py` (Barter) | Updated | +20 |

**Total**: 6 skill files created/rewritten, 2 advisor scripts updated, ~3000 lines
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Data Flow

```
User request → Gate 2 (skill_advisor.py) → SKILL.md loads
  → Smart router scores 7 intents → Loads conditional resources
  → Agent constructs `gemini` CLI command → Bash tool executes
  → Output captured → Agent validates and applies results
```

### File Structure

```
.opencode/skill/mcp-gemini-cli/
├── SKILL.md                              # Main orchestrator (v1.1.0, 8 sk-doc sections)
├── references/
│   ├── cli_reference.md                  # CLI flags, commands, config
│   ├── integration_patterns.md           # 10 cross-AI patterns
│   ├── gemini_tools.md                   # Built-in tools reference
│   └── agent_delegation.md              # 9 Gemini agents, routing table
└── assets/
    └── prompt_templates.md               # Copy-paste templates
```

### Smart Routing

The smart router scores user intent against 7 signal categories and loads resources accordingly:

| Intent | Resources Loaded |
|--------|-----------------|
| GENERATION | cli_reference.md, prompt_templates.md |
| REVIEW | integration_patterns.md, agent_delegation.md |
| RESEARCH | gemini_tools.md, prompt_templates.md |
| ARCHITECTURE | gemini_tools.md, agent_delegation.md |
| TEMPLATES | prompt_templates.md, cli_reference.md |
| PATTERNS | integration_patterns.md, cli_reference.md |
| AGENT_DELEGATION | agent_delegation.md, integration_patterns.md |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:verification -->
## 4. VERIFICATION

### Checklist Results

| Category | Result |
|----------|--------|
| P0 Items | 8/8 passed |
| P1 Items | 9/9 passed |
| P2 Items | 2/2 passed |

### Key Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| SKILL.md word count | <5000 | 2395 |
| Standard sections | 8 | 8 |
| Anchor pairs | 8 | 8 |
| File naming | snake_case | All compliant |
| Hardcoded secrets | 0 | 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:lessons -->
## 5. LESSONS LEARNED

- **Progressive disclosure works well**: SKILL.md at ~520 lines keeps agent context lean while reference files provide depth on demand
- **Parallel implementation**: All reference/asset files are independent and were created concurrently
- **Smart routing prevents bloat**: Loading only intent-relevant resources avoids unnecessary token usage
- **Template alignment pays off**: Rewriting SKILL.md to match sk-doc templates (8 sections, canonical smart routing, emoji-prefixed Rules) ensures consistency with other skills
- **Conductor/executor model**: Claude Code as conductor, Gemini CLI as executor — clean separation of planning and execution
- **Skill advisor entries enable discovery**: SYNONYM_MAP, INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, and PHRASE_INTENT_BOOSTERS provide robust routing (0.95 confidence on "use gemini" queries)
<!-- /ANCHOR:lessons -->

---
