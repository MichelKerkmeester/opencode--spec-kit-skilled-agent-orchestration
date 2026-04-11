---
title: "Implementation Summary: Skill Rename — sk-improve-agent & sk-improve-prompt (Phase 7)"
description: "Renamed two skill folders and two changelog folders, swept 303 text references across 303 files, verified zero residuals. Runtime skill list now resolves the new names."
trigger_phrases:
  - "skill rename complete"
  - "sk-improve-agent"
  - "sk-improve-prompt"
  - "phase 7 implementation"
importance_tier: "normal"
contextType: "implementation-summary"
---
# Implementation Summary — Phase 7: Skill Rename

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/` |
| **Parent Packet** | 042-sk-deep-research-review-improvement-2 |
| **Phase** | 7 of 7 |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Completed** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A two-skill rename refactor aligning skill folder names with the `/improve:*` command namespace:

- `.opencode/skill/sk-agent-improver/` → `.opencode/skill/sk-improve-agent/`
- `.opencode/skill/sk-prompt-improver/` → `.opencode/skill/sk-improve-prompt/`
- `.opencode/changelog/14--sk-prompt-improver/` → `.opencode/changelog/14--sk-improve-prompt/`
- `.opencode/changelog/15--sk-agent-improver/` → `.opencode/changelog/15--sk-improve-agent/`

Plus a text sweep updating every repo reference from the old noun-last names to the new verb-first names, so discovery, advisor routing, install guides, READMEs, agent files, historical specs, memories, changelogs, and regression fixtures all carry the new canonical names.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Stage 1: Pre-flight
- Verified no pre-existing collisions for `sk-improve-agent` or `sk-improve-prompt` outside the phase-007 folder itself.
- Built authoritative file list via `grep -rlI`: **240 files** containing `sk-agent-improver`, **63 files** containing `sk-prompt-improver`.
- Verified predecessor phase 006 complete (`implementation-summary.md` present).

### Stage 2: Folder renames (`git mv`)
All four folder moves executed via `git mv` to preserve rename detection:
- `sk-agent-improver` → `sk-improve-agent`
- `sk-prompt-improver` → `sk-improve-prompt`
- `14--sk-prompt-improver` → `14--sk-improve-prompt`
- `15--sk-agent-improver` → `15--sk-improve-agent`

### Stage 3: Mass text replace
Two-pass sed pipeline via:
```bash
grep -rlI --exclude-dir=.git --exclude-dir=node_modules \
  --exclude-dir=007-skill-rename-improve-agent-prompt "<old-name>" . \
  | while IFS= read -r f; do sed -i '' 's/<old>/<new>/g' "$f"; done
```
Run order: folder renames first, then sed; the sed pass covered both the newly-moved files and all external references in one sweep.

Phase-007 folder excluded so its own documentation-of-the-rename strings stay intact.

### Stage 4: Verification
- **Residuals**: 0 matches for either old name (outside `.git/` and `007-*`).
- **High-value files** — match counts after rename:
  - `.opencode/command/improve/agent.md` → 8
  - `.opencode/command/improve/prompt.md` → 10
  - `.opencode/skill/scripts/skill_advisor.py` → 73
  - `.opencode/specs/descriptions.json` → 5
  - `README.md` → 2
  - `.opencode/README.md` → 2
- **Skill paths**: `ls .opencode/skill/sk-improve-agent/SKILL.md` (19977 B) and `ls .opencode/skill/sk-improve-prompt/SKILL.md` (16078 B) both succeed.
- **Runtime agent dirs** (`.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`): all 4 `agent-improver.*` files contain the updated skill-path references.
- **Python syntax**: `skill_advisor.py` parses cleanly post-replacement.
- **Git status**: 87 rename (R/RM) entries covering the four folder moves.
- **Live runtime confirmation**: the skill list now surfaces `sk-improve-agent` and `sk-improve-prompt`, and the `/improve:prompt` command description resolved to the new skill path automatically.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `git mv` before sed | Lets one sed pass cover both moved files and external references; preserves git rename detection. |
| Exclude phase-007 folder from sed | Phase-007 docs explicitly describe the `old → new` transformation; substituting would garble the documentation. |
| Keep runtime agent file names (`agent-improver.*`) as-is | The user asked to rename the two **skill** folders. Agent files follow a different convention (no `sk-` prefix) and their content references were updated in place. |
| Keep historical spec folder names like `041-.../011-sk-agent-improver-advisor-readme-sync/` unchanged | Folder identity is a historical artifact; content references inside were updated via the sed sweep. |
| Single-pass sed via while-read (not xargs) | Safely handles file paths with spaces (e.g., `.opencode/install_guides/SET-UP - AGENTS.md`). |
| Changelog folders renamed to match | `14--sk-prompt-improver` and `15--sk-agent-improver` are skill-name-mirrored — keeping the rename consistent avoids orphaned changelog paths. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] CHK-001 Pre-flight collision check — zero hits outside phase-007. [EVIDENCE: grep count]
- [x] CHK-002 Predecessor phase 006 complete. [EVIDENCE: `006-*/implementation-summary.md` exists]
- [x] CHK-003 `git mv` used — 87 R-entries in `git status`.
- [x] CHK-004 Mechanical sed substitution only.
- [x] CHK-005 Residual `sk-agent-improver` grep = 0. [EVIDENCE: `grep -rlI --exclude-dir=.git --exclude-dir=007-* sk-agent-improver .` → 0 files]
- [x] CHK-006 Residual `sk-prompt-improver` grep = 0. [EVIDENCE: same command → 0 files]
- [x] CHK-007 `sk-improve-agent/SKILL.md` exists (19977 B).
- [x] CHK-008 `sk-improve-prompt/SKILL.md` exists (16078 B).
- [x] CHK-009 `skill_advisor.py` Python syntax OK post-replacement.
- [x] CHK-010 No secrets — rename tokens are public skill identifiers.
- [x] CHK-011 `implementation-summary.md` created (this file).
- [x] CHK-012 Changelog folders renamed — entries stay under `14--sk-improve-prompt` / `15--sk-improve-agent`.
- [x] CHK-013 Memory save pending (Step 13, next action).
- [x] CHK-014 Both renamed changelog folders exist and contain their original version files.
- [x] CHK-015 `.opencode/specs/descriptions.json` carries 5 new-name matches, zero old-name matches.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Phase-007 spec/plan/tasks/checklist intentionally retain the old names to document the transformation; this is correct but worth noting if a future grep is confused by them.
- Historical spec folder names containing the old skill names (e.g. `041-sk-recursive-agent-loop/011-sk-agent-improver-advisor-readme-sync/`) were intentionally **not** renamed — only their content was updated. Anyone browsing by folder name will still see the old token there.
- The broader system-spec-kit validator (`validate.sh`) reports template-placeholder warnings for the phase folder — those are inherited from `create.sh --phase` scaffolding, not caused by this work.
- No automated end-to-end test exists for the `/improve:agent` / `/improve:prompt` commands beyond `skill_advisor.py`'s regression fixtures; a manual invocation is recommended as a follow-up smoke test but was not part of this phase's scope.
<!-- /ANCHOR:limitations -->
