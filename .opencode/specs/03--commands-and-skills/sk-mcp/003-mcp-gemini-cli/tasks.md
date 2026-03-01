---
title: "Tasks: mcp-gemini-cli Skill"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gemini cli tasks"
  - "mcp-gemini-cli tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: mcp-gemini-cli Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create skill directory structure (.opencode/skill/mcp-gemini-cli/)
- [x] T002 Create references/ and assets/ subdirectories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create SKILL.md with 8 standard sections (.opencode/skill/mcp-gemini-cli/SKILL.md)
- [x] T004 [P] Create CLI reference (.opencode/skill/mcp-gemini-cli/references/cli_reference.md)
- [x] T005 [P] Create integration patterns (.opencode/skill/mcp-gemini-cli/references/integration_patterns.md)
- [x] T006 [P] Create Gemini tools reference (.opencode/skill/mcp-gemini-cli/references/gemini_tools.md)
- [x] T007 [P] Create prompt templates (.opencode/skill/mcp-gemini-cli/assets/prompt_templates.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify SKILL.md word count under 5k (2395 words)
- [x] T009 Verify all sections have proper anchors (8/8 verified)
- [x] T010 Verify file naming follows snake_case convention (all files compliant)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Template Alignment & Skill Advisor

- [x] T011 Rewrite SKILL.md to align with sk-doc skill_md_template.md (8 sections, canonical smart routing, emoji-prefixed Rules)
- [x] T012 Create references/agent_delegation.md (9 Gemini agents, conductor/executor model, routing table)
- [x] T013 [P] Add YAML frontmatter to cli_reference.md, integration_patterns.md, gemini_tools.md
- [x] T014 [P] Add mcp-gemini-cli entries to Public skill_advisor.py (SYNONYM_MAP, INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
- [x] T015 [P] Add mcp-gemini-cli entries to Barter skill_advisor.py (same entries, adapted for sk-code naming)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
