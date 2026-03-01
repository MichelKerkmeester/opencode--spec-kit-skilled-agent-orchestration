---
title: "Implementation Plan: Rename workflows-code to workflows-code--web-dev [009-rename-to-web-dev/plan]"
description: "Overview: This implements a directory rename of .opencode/skill/workflows-code to .opencode/skill/workflows-code--web-dev and updates all references across the active codebase. ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "rename"
  - "workflows"
  - "code"
  - "028"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Rename workflows-code to workflows-code--web-dev

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, YAML |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem (directory rename + text replacements) |

**Overview**: This implements a directory rename of `.opencode/skill/workflows-code` to `.opencode/skill/workflows-code--web-dev` and updates all references across the active codebase. The approach is: rename first, then systematically update references in concentric rings outward from the skill itself to system files.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**Ready When:**
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Full inventory of files containing `workflows-code` references compiled

**Done When:**
- [ ] Directory renamed successfully
- [ ] All active file references updated
- [ ] Grep verification shows no stale references in active files
- [ ] `skill_advisor.py` correctly routes to new name

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION PHASES

### Phase 1: Pre-Rename Verification
- [ ] Run `grep -rn "workflows-code" .opencode/skill/ .opencode/agent/ .opencode/scripts/ .opencode/command/ AGENTS.md AGENTS.md` to establish baseline reference count
- [ ] Verify no other branches have pending changes to `workflows-code/` files
- [ ] Snapshot the current file list in `workflows-code/` for post-rename verification

### Phase 2: Directory Rename
- [ ] Rename `.opencode/skill/workflows-code/` to `.opencode/skill/workflows-code--web-dev/`
- [ ] Verify all files are intact at new path (compare file count and names)

### Phase 3: Update References (Concentric Rings)

**Ring 1 - Skill internal files** (files now inside `workflows-code--web-dev/`):
- [ ] Update `SKILL.md` self-references
- [ ] Update `assets/checklists/code_quality_checklist.md`
- [ ] Update all files under `references/` subdirectories

**Ring 2 - System configuration files:**
- [ ] Update `AGENTS.md` (critical - defines skill routing for all agents)
- [ ] Update `AGENTS.md`
- [ ] Update `.opencode/scripts/skill_advisor.py`

**Ring 3 - Agent files:**
- [ ] Update `.opencode/agent/orchestrate.md`
- [ ] Update `.opencode/agent/review.md`

**Ring 4 - Command and template files:**
- [ ] Update `.opencode/command/create/assets/create_agent.yaml`
- [ ] Update `.opencode/command/create/skill_reference.md`
- [ ] Update `.opencode/scripts/README.md`

**Ring 5 - Cross-skill references:**
- [ ] Update `.opencode/skill/sk-code--opencode/SKILL.md`
- [ ] Update `.opencode/skill/mcp-chrome-devtools/SKILL.md`
- [ ] Update `.opencode/skill/mcp-chrome-devtools/examples/README.md`
- [ ] Update `.opencode/skill/system-spec-kit/SKILL.md`
- [ ] Update all system-spec-kit reference files that mention `workflows-code`
- [ ] Update `.opencode/skill/sk-doc/assets/opencode/skill_md_template.md`

### Phase 4: Verification
- [ ] Run grep to verify no stale `workflows-code` references remain in active files (excluding `sk-code--opencode`, `workflows-code--web-dev`, and `z_archive/`)
- [ ] Verify `skill_advisor.py` functions correctly with new name
- [ ] Spot-check 3-5 updated files to confirm replacements are correct

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| No concurrent edits to `workflows-code/` | Green | Merge conflicts if concurrent work exists |
| Git working tree clean for skill directory | Green | Rename may conflict with staged changes |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

- **Trigger**: Rename causes unexpected breakage in skill routing or agent behavior
- **Procedure**: `git mv .opencode/skill/workflows-code--web-dev .opencode/skill/workflows-code` + revert all reference changes via `git checkout -- <files>`

<!-- /ANCHOR:rollback -->

---

## 6. REFERENCE REPLACEMENT STRATEGY

When replacing references, use these rules to avoid false positives:

| Pattern | Replace With | Notes |
|---------|-------------|-------|
| `workflows-code/` (with trailing slash) | `workflows-code--web-dev/` | Directory paths |
| `workflows-code` (standalone word, not followed by `--`) | `workflows-code--web-dev` | Name references |
| `sk-code--opencode` | DO NOT CHANGE | Different skill |

**Key exclusion**: Any occurrence of `workflows-code--` (with double dash) is either `sk-code--opencode` or the new `workflows-code--web-dev` and should not be double-replaced.

---
