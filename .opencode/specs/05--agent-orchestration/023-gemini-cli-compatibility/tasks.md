---
title: "Tasks: Gemini CLI Compatibility [023-gemini-cli-compatibility/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "gemini"
  - "cli"
  - "compatibility"
  - "023"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Gemini CLI Compatibility

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
## Phase 1: Foundation Setup

- [ ] T001 Create `.gemini/` directory with subdirectories (`agents/`, `commands/spec_kit/`, `commands/memory/`, `commands/create/`, `skills/`)
- [ ] T002 Create `GEMINI.md` symlink → `AGENTS.md` at project root
- [ ] T003 Create `.gemini/specs` symlink → `../.opencode/specs`
- [ ] T004 Create `.gemini/settings.json` with `enableAgents`, `mcpServers`, `skills`, and `context` config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Agent Adaptation

- [ ] T010 [P] Create `.gemini/agents/orchestrate.md` with Gemini frontmatter + optimization profile
- [ ] T011 [P] Create `.gemini/agents/context.md` with Gemini frontmatter
- [ ] T012 [P] Create `.gemini/agents/debug.md` with Gemini frontmatter
- [ ] T013 [P] Create `.gemini/agents/research.md` with Gemini frontmatter
- [ ] T014 [P] Create `.gemini/agents/review.md` with Gemini frontmatter
- [ ] T015 [P] Create `.gemini/agents/speckit.md` with Gemini frontmatter
- [ ] T016 [P] Create `.gemini/agents/write.md` with Gemini frontmatter
- [ ] T017 [P] Create `.gemini/agents/handover.md` with Gemini frontmatter
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Skill Symlinks

- [ ] T020 [P] Create 9 skill symlinks in `.gemini/skills/` → `../../.opencode/skill/*`
- [ ] T021 [P] Create scripts symlink in `.gemini/skills/` → `../../.opencode/skill/scripts`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Command TOMLs

- [ ] T030 [P] Create 7 spec_kit command TOMLs in `.gemini/commands/spec_kit/` (`plan`, `implement`, `complete`, `research`, `resume`, `debug`, `handover`)
- [ ] T031 [P] Create 5 memory command TOMLs in `.gemini/commands/memory/` (`save`, `context`, `manage`, `learn`, `continue`)
- [ ] T032 [P] Create 6 create command TOMLs in `.gemini/commands/create/` (`agent`, `skill`, `install_guide`, `folder_readme`, `skill_reference`, `skill_asset`)
- [ ] T033 Create `agent_router.toml` in `.gemini/commands/`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Reference Updates

- [ ] T040 Update `AGENTS.md` §7 to add Gemini row to runtime agent directory table
- [ ] T041 Update `.opencode/command/create/agent.md` to add Gemini CLI path to runtime path resolution list
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification

- [ ] T050 Verify all symlinks resolve correctly (`find .gemini -type l -exec test -e {} \; -print`)
- [ ] T051 Verify `.gemini/settings.json` is valid JSON (`python3 -c "import json; json.load(open('.gemini/settings.json'))"`)
- [ ] T052 Verify all 19 TOML files are valid (`python3 -c "import tomllib; ..."` per file)
- [ ] T053 Verify all agent `.md` frontmatter is valid YAML (inspect `---` blocks or `gemini --list-agents`)
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All symlinks resolve with no broken links
- [ ] `.gemini/settings.json` validates as well-formed JSON
- [ ] All 8 agent `.md` files have valid Gemini YAML frontmatter
- [ ] All 19 command `.toml` files are valid TOML
- [ ] `AGENTS.md` §7 updated with Gemini row
- [ ] `.opencode/command/create/agent.md` updated with Gemini CLI path
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase dependencies**: Phase 1 must complete before Phases 2–5 begin; Phase 6 depends on all prior phases
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- 6 phases: Foundation, Agent Adaptation, Skill Symlinks, Command TOMLs, Reference Updates, Verification
- Parallelizable tasks marked [P] within each phase
- Level 2 spec
-->
