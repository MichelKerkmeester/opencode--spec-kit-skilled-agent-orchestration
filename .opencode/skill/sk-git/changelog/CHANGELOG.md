# sk-git Changelog

All notable changes to the sk-git skill are documented here.

---

## 1.1.0.0 — 2026-03-10

**Enforced worktree-only branch creation policy across all skill files.**

### Changed
- SKILL.md: Replaced 3-option workspace choice (branch/worktree/current) with 2-option (worktree/current branch)
- SKILL.md: Added NEVER rule for direct branch creation (`git branch`, `git checkout -b`, `git switch -c`)
- SKILL.md: Removed `branch-management` keyword and `branch strategy` from intent routing
- SKILL.md: Updated success criteria to reference worktree-only workflow
- README.md: Updated overview and features to reflect worktree-only policy
- worktree_workflows.md: Removed "create a standard branch instead" fallback for Option A
- worktree_workflows.md: Replaced `git checkout -b` in detached HEAD example with `git worktree add -b`
- shared_patterns.md: Removed "Create branch" subsection; added worktree-only policy note
- shared_patterns.md: Fixed experimental and detached HEAD recovery patterns to use `git worktree add -b`
- quick_reference.md: Replaced `git checkout -b` in Workflow C with `git worktree add -b`
- quick_reference.md: Renamed "Branch" section to "Branch Inspection & Cleanup"
- github_mcp_integration.md: Added note to not create branches via GitHub MCP
- worktree_checklist.md: Added worktree-only policy statement; changed "branch strategy" to "worktree strategy"
- finish_workflows.md: Added assumption that branches originate from `git worktree add -b`

### Added
- 9 explicit worktree-only policy statements across 6 files
- New NEVER rule (#2) in SKILL.md Rules section
- "Worktree-only branch creation" feature bullet in README.md

### Removed
- Option A "Create a new branch" from workspace choice table
- "Create branch" override phrases from SKILL.md
- `git branch <name>` and `git checkout -b` command examples from shared_patterns.md
- Direct branch creation commands from quick_reference.md Branch section

---

## 1.0.10.0 — 2026-02-28

**Restructured SKILL.md to comply with sk-doc template standards.**

### Changed
- Reordered sections to match 8-section template: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES, SUCCESS CRITERIA, INTEGRATION POINTS, RELATED RESOURCES
- Merged Workspace Choice Enforcement and Skill Selection Decision Tree into HOW IT WORKS
- Merged Integration Examples into RELATED RESOURCES
- Added missing opening `<!-- ANCHOR:when-to-use -->` marker
- Updated RESOURCE_MAP to include `github_mcp_integration.md` in FINISH intent
- Removed table of contents from README.md (forbidden by sk-doc standards)
- Added `github_mcp_integration.md` to README structure tree

### Added
- `references/github_mcp_integration.md` — extracted from SKILL.md Section 7 (GitHub MCP Integration)

### Metrics
- SKILL.md: 692 lines → 478 lines, 3170 words → 2311 words, 12 sections → 8 sections

---

## 1.0.9.0 — 2026-02-24

**Added deterministic AI commit-message logic.**

### Changed
- Added deterministic AI commit-message logic in SKILL.md (type/scope inference, summary normalization)
- Updated `references/commit_workflows.md` with first-match type/scope inference and summary normalization
- Updated `assets/commit_message_template.md` with AI-specific priority logic
- Updated README.md with changelog folder and feature note

---
