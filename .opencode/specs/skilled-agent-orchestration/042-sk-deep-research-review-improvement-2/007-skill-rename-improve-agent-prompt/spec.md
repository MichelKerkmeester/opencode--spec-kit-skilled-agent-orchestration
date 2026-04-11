---
title: "Phase 7: Skill rename — sk-improve-agent and sk-improve-prompt"
description: "Rename sk-agent-improver → sk-improve-agent and sk-prompt-improver → sk-improve-prompt. Update all text references, folder-name dependencies (changelog), and validate no broken paths remain."
trigger_phrases:
  - "sk-agent-improver"
  - "sk-prompt-improver"
  - "sk-improve-agent"
  - "sk-improve-prompt"
  - "skill rename"
  - "agent improver"
  - "prompt improver"
importance_tier: "normal"
contextType: "refactor"
---
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-graph-testing-and-playbook-alignment |
| **Successor** | None |
| **Handoff Criteria** | All references updated, both skill folders renamed, changelog folders renamed, grep returns zero matches for old names (excluding archived history where required). |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 7** of packet 042 (sk-deep-research-review-improvement-2). Follows 006 (graph-testing-and-playbook-alignment).

**Scope Boundary**: Naming-only refactor — no behavior changes. Affects skill folder names, changelog folder names, and text references in markdown, JSON, JSONL, TOML, Python, and shell files.

**Dependencies**:
- 006 complete (implementation-summary.md present).
- No in-flight work that references `sk-agent-improver` or `sk-prompt-improver` paths.

**Deliverables**:
- Two renamed skill folders (`sk-improve-agent`, `sk-improve-prompt`).
- Two renamed changelog folders (`14--sk-improve-prompt`, `15--sk-improve-agent`).
- Updated text references across commands, agents, skill_advisor, README, install guides, spec history, and memory files.
- Zero residual matches for the old names in active code paths.

**Changelog**:
- On close: add entry under the renamed `../changelog/` packet path.
<!-- /ANCHOR:phase-context -->

---

# Feature Specification: Skill Rename — sk-improve-agent & sk-improve-prompt

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill folders `sk-agent-improver` and `sk-prompt-improver` use inconsistent naming vs. the `/improve:agent` and `/improve:prompt` command convention. The noun-last form obscures that these are improvers bound to the `improve:*` command namespace and makes discovery and mental-model matching harder.

### Purpose
Rename both skills to the verb-form-matches-command pattern (`sk-improve-agent`, `sk-improve-prompt`) and update every reference so nothing silently breaks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `.opencode/skill/sk-agent-improver/` → `.opencode/skill/sk-improve-agent/`
- Rename `.opencode/skill/sk-prompt-improver/` → `.opencode/skill/sk-improve-prompt/`
- Rename `.opencode/changelog/14--sk-prompt-improver/` → `.opencode/changelog/14--sk-improve-prompt/`
- Rename `.opencode/changelog/15--sk-agent-improver/` → `.opencode/changelog/15--sk-improve-agent/`
- Text replacement across all active files containing either old skill name.
- Update within: skill docs (SKILL.md, README.md, references, scripts, assets), commands (`.opencode/command/improve/**`, `.agents/commands/**`), agents (`.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`), skill_advisor + regression fixtures, READMEs, install guides, `.opencode/specs/descriptions.json`, spec docs/memories/scratch, changelogs.

### Out of Scope
- Renaming agent files themselves (`agent-improver.md`, `agent-improver.toml`) — they follow a different convention without the `sk-` prefix. Content inside is updated only where it references the skill paths.
- Renaming historical spec folder names (e.g. `041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/`) — folder identity preserved; content references updated.
- Behavior changes, API changes, or refactoring beyond the string/folder rename.
- Git history rewriting.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-agent-improver/` | Rename dir | → `sk-improve-agent/` |
| `.opencode/skill/sk-prompt-improver/` | Rename dir | → `sk-improve-prompt/` |
| `.opencode/changelog/14--sk-prompt-improver/` | Rename dir | → `14--sk-improve-prompt/` |
| `.opencode/changelog/15--sk-agent-improver/` | Rename dir | → `15--sk-improve-agent/` |
| `~240` files (sk-agent-improver) | Text replace | `sk-agent-improver` → `sk-improve-agent` |
| `~63` files (sk-prompt-improver) | Text replace | `sk-prompt-improver` → `sk-improve-prompt` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill folder renames completed via `git mv` | `.opencode/skill/sk-improve-agent/` and `.opencode/skill/sk-improve-prompt/` exist; old folders absent |
| REQ-002 | Changelog folder renames completed via `git mv` | `.opencode/changelog/14--sk-improve-prompt/` and `.opencode/changelog/15--sk-improve-agent/` exist; old folders absent |
| REQ-003 | Mass text replace across repo | `grep -r "sk-agent-improver\|sk-prompt-improver"` returns zero matches outside `.git/` and allowed historical anchors |
| REQ-004 | `skill_advisor.py` routing data updated | Advisor maps `improve:agent` → `sk-improve-agent` and `improve:prompt` → `sk-improve-prompt` |
| REQ-005 | Command wiring still functional | `/improve:agent` and `/improve:prompt` commands resolve skill paths correctly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `.opencode/specs/descriptions.json` updated | Skill entries reflect new names |
| REQ-007 | Install guides and READMEs updated | `README.md`, `.opencode/README.md`, `.opencode/install_guides/README.md`, `SET-UP - AGENTS.md`, `.opencode/skill/README.md` all reference new names |
| REQ-008 | Agent files reference new skill paths | `.opencode/agent/agent-improver.md`, `.claude/agents/agent-improver.md`, `.codex/agents/agent-improver.toml`, `.gemini/agents/agent-improver.md` updated where skill path is cited |
| REQ-009 | Memory and scratch files updated | Historical memory/scratch references carry the new canonical name (retains searchability) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero `sk-agent-improver` or `sk-prompt-improver` matches in active repo files (excluding `.git/`).
- **SC-002**: `skill_advisor.py` test/regression fixtures reference the new skill names and pass.
- **SC-003**: Both renamed skill folders load via their SKILL.md paths (smoke test: `ls .opencode/skill/sk-improve-agent/SKILL.md`, etc.).
- **SC-004**: `git status` shows rename operations (R), not delete+add pairs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broken path in `skill_advisor.py` catalog | High | Grep-verify after replacement; run advisor smoke test |
| Risk | Text replacement hits unintended substring | Low | Old names are 17/18-char distinctive tokens — no known substrings collide |
| Risk | Binary or lock files with strings | Low | Sed targets only text file extensions (md, json, jsonl, py, txt, toml, sh, yaml, yml, ts, js) |
| Dependency | git worktree on main branch | Medium | Operate on current system-speckit branch; commit at end |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — scope is mechanical rename + reference sweep.
<!-- /ANCHOR:questions -->
