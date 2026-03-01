---
title: "Tasks: Phase 007 — Finalize mcp-chrome-devtools Rename [007-mcp-chrome-devtools/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "007"
  - "finalize"
  - "mcp"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 007 — Finalize mcp-chrome-devtools Rename

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
## Step 1: Filesystem Rename

- [x] T001 Verify `.opencode/skill/mcp-chrome-devtools` exists and legacy workflows-prefixed folder is absent
- [x] T002 Verify new folder with all 21 files (`find ... | wc -l` => `21`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (21 files)

- [x] T003 Update SKILL.md — name, title, self-refs, MCP designation
- [x] T004 Update index.md — name, description, category
- [x] T005 [P] Update nodes/*.md (~5 files) — self-refs, cross-skill refs
- [x] T006 [P] Update references/*.md (~3 files) — paths
- [x] T007 [P] Update assets/*.md (~5 files) — template paths
- [x] T008 [P] Update scripts/*.sh (~3 files) — paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (36 files)

### skill_advisor.py (20 lines)
- [x] T009 Update INTENT_BOOSTERS legacy chrome-devtools entry to `mcp-chrome-devtools`
- [x] T010 Update MULTI_SKILL_BOOSTERS

### Agent Files (4 runtimes)
- [x] T011 [P] Update .opencode/agent/orchestrate.md
- [x] T012 [P] Update .opencode/agent/chatgpt/orchestrate.md
- [x] T013 [P] Update .claude/agents/orchestrate.md
- [x] T014 [P] Update .gemini/agents/orchestrate.md

### Install Guides (4 files)
- [x] T015 [P] Update .opencode/install_guides/README.md
- [x] T016 [P] Update .opencode/install_guides/SET-UP - AGENTS.md
- [x] T017 [P] Update .opencode/install_guides/SET-UP - Opencode Agents.md
- [x] T018 [P] Update .opencode/install_guides/SET-UP - Skill Creation.md

### Root Docs (3 files)
- [x] T019 Update CLAUDE.md
- [x] T020 Update README.md
- [x] T021 Update .opencode/README.md

### system-spec-kit
- [x] T022 Update system-spec-kit/SKILL.md
- [x] T023 Update system-spec-kit/nodes/rules.md

### Other External
- [x] T024 [P] Update remaining external references
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Cross-References

- [x] T025 Verify `.opencode/changelog/11--mcp-chrome-devtools` exists and legacy workflows-prefixed changelog folder is absent
- [x] T026 Update cross-refs in other skill folders
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [x] T027 `rg -n "workflows-.*chrome-devtools"` — expect 0 (active-target `rg` returned `EXIT:1`)
- [x] T028 `python3 skill_advisor.py "take screenshot"` → `mcp-chrome-devtools` (confidence `0.95`, uncertainty `0.25`)
- [x] T029 `python3 skill_advisor.py "devtools"` → `mcp-chrome-devtools`
- [x] T030 Verify folder exists, no old folder remains (`new_skill_dir=present`, `old_skill_dir=missing`)
- [x] T031 Verify MCP alignment: `ls .opencode/skill/mcp-*` shows mcp-chrome-devtools alongside mcp-figma, mcp-code-mode
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Grep verification passed (T027)
- [x] Smoke tests passed (T028-T029)
- [x] MCP alignment verified (T031)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
