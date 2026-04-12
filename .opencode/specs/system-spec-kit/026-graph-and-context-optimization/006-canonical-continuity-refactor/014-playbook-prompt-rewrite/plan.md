---
title: "Plan — Phase 014 Playbook Prompt Rewrite"
status: "planned"
level: 2
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 014 — Playbook Prompt Rewrite

## Implementation

### Step 1 — Read sk-improve-prompt SKILL.md
Load `.opencode/skill/sk-improve-prompt/SKILL.md` for the 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) and CLEAR scoring rubric.

### Step 2 — Batch by category (22 parallel sub-agents)
For each of the 22 categories:
1. Read all scenario files in the category
2. Score each prompt on CLEAR dimensions
3. Rewrite prompts scoring <3.5 using the best-fit framework
4. Standardize format: `Prompt:` → `Commands:` → `Expected:` → `Evidence:`
5. Remove any deprecated concept references (shared memory, archived tier, observation windows, memory files)

### Step 3 — Update master index
Refresh `manual_testing_playbook.md` with updated scenario descriptions.

### Step 4 — Verify
- No deprecated concept references in any playbook file
- All prompts follow a consistent structure
- CLEAR score ≥3.5 across all rewritten prompts

## Execution method
**cli-copilot gpt-5.4 high** — the sk-improve-prompt skill is best exercised through a model with strong prompt engineering capabilities.
