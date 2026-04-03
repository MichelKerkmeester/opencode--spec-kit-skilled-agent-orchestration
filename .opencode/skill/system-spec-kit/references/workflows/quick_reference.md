---
title: Quick Reference
description: Fast lookup for commands, checklists, and troubleshooting using the progressive enhancement model.
---

# Quick Reference - Commands, Checklists & Troubleshooting

Fast lookup for spec folder commands, checklists, and troubleshooting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Quick reference for spec folder management, commands, and troubleshooting using the progressive enhancement model.

### Progressive Enhancement Model

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md + implementation-summary.md
Level 2 (Verification): Level 1 + checklist.md
Level 3 (Full):         Level 2 + decision-record.md + optional research
Level 3+ (Extended):    Level 3 + governance/AI execution content
```

### Key Points

- LOC thresholds are **SOFT GUIDANCE** (not enforcement)
- **Enforcement is MANUAL** - verify required templates exist before claiming completion

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:level-decision-shortcuts-progressive-enhancement -->
## 2. LEVEL DECISION SHORTCUTS (Progressive Enhancement)

| Situation | Level | Required Templates | Optional Templates |
|-----------|-------|-------------------|-------------------|
| Any task (baseline) | 1 | spec.md + plan.md + tasks.md + implementation-summary.md | None |
| Needs QA validation | 2 | L1 + checklist.md | None |
| Complex/architectural | 3 | L2 + decision-record.md | research/research.md |
| Enterprise/governance heavy | 3+ | L3 file set from `templates/level_3+/` | research/research.md |

**LOC as soft guidance:**
- <100 LOC suggests Level 1
- 100-499 LOC suggests Level 2
- >=500 LOC suggests Level 3
- High complexity/risk and governance needs suggest Level 3+

---

<!-- /ANCHOR:level-decision-shortcuts-progressive-enhancement -->
<!-- ANCHOR:template-copy-commands-progressive -->
## 3. TEMPLATE COPY COMMANDS (Progressive)

### Level 1: Baseline (ALL features start here)

```bash
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md ###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-name/implementation-summary.md
```

### Level 2: Verification (complete set)

```bash
cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_2/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_2/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/###-name/checklist.md
```

### Level 3: Full Documentation (complete set)

```bash
cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-name/decision-record.md
```

### Level 3+: Extended Documentation (complete set)

```bash
cp .opencode/skill/system-spec-kit/templates/level_3+/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3+/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3+/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3+/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3+/decision-record.md specs/###-name/decision-record.md
```

### Optional Templates (Level 3 Only)

```bash
## Comprehensive Research (from root templates folder):
mkdir -p specs/###-name/research && cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research/research.md
```

---

<!-- /ANCHOR:template-copy-commands-progressive -->
<!-- ANCHOR:essential-commands -->
## 4. ESSENTIAL COMMANDS

### Start Here: Command Map

If the runtime does not surface command menus clearly, use this compact command map first.

**SpecKit workflow commands**
- `/spec_kit:resume` - continue or recover existing spec-folder work
- `/spec_kit:plan` - define or refine a scoped spec and plan
- `/spec_kit:implement` - execute an existing spec and plan packet
- `/spec_kit:complete` - run the full spec-to-implementation lifecycle
- `/spec_kit:debug` - delegate a persistent issue to debug workflow
- `/spec_kit:handover` - write continuation context for the next session
- `/spec_kit:deep-research` - run iterative research before planning
- `/spec_kit:deep-review` - run iterative review and finding synthesis

**Memory commands**
- `/memory:save` - preserve the current session context into spec memory
- `/memory:search` - retrieve prior context, decisions, and analysis
- `/memory:manage` - run maintenance, checkpoint, cleanup, and shared-memory operations
- `/memory:learn` - create or manage constitutional always-surface rules

**Nested changelog generator**
- `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write` - publish a packet-local changelog for a root spec or phase child

### Find Next Spec Number

```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

Add 1 to the result to get your next number.

### Create Spec Folder

```bash
mkdir -p specs/###-short-name/
```

### Template Composition (Maintainer)

```bash
# Compose all level templates from core + addendum
./scripts/templates/compose.sh

# Preview changes without writing
./scripts/templates/compose.sh --dry-run

# Verify templates are current
./scripts/templates/compose.sh --verify

# Compose specific levels
./scripts/templates/compose.sh 2 3
```

**Naming rules:**
- 2-3 words (shorter is better)
- Lowercase
- Hyphen-separated
- Action-noun structure

**Good examples:** `fix-typo`, `add-auth`, `mcp-code-mode`, `cli-codex`

### Manual Context Save

Trigger manual context save:
```
Say: "save context" or "save conversation"
```

**Required Inputs:** Structured JSON is mandatory for routine saves, and the target spec folder is still required
```
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/
```

❌ DO NOT use Write/Edit tools to create memory files directly.

---

<!-- /ANCHOR:essential-commands -->
<!-- ANCHOR:pre-implementation-checklist-progressive-enhancement -->
## 5. PRE-IMPLEMENTATION CHECKLIST (Progressive Enhancement)

Before making ANY file changes, verify:

- [ ] Determined level (1/2/3/3+) or exempt (typo fix)
- [ ] Created `/specs/[###-short-name]/`
- [ ] Copied ALL REQUIRED templates for chosen level:
  - [ ] Level 1: spec.md + plan.md + tasks.md + implementation-summary.md
  - [ ] Level 2: Level 1 + checklist.md
  - [ ] Level 3: Level 2 + decision-record.md
  - [ ] Level 3+: Use full Level 3 file set from `templates/level_3+/`
- [ ] Renamed templates correctly
- [ ] Filled ALL template sections with actual content
- [ ] Removed placeholder text and sample sections
- [ ] Copied optional templates if needed (Level 3 only)
- [ ] Presented approach to user (including templates used)
- [ ] Got explicit approval ("yes"/"go ahead"/"proceed")

**If ANY unchecked → STOP**
**If required template missing → Cannot claim completion**

---

<!-- /ANCHOR:pre-implementation-checklist-progressive-enhancement -->
<!-- ANCHOR:folder-naming-examples -->
## 6. FOLDER NAMING EXAMPLES

### Good Examples ✅

- `fix-typo` (concise, clear)
- `add-validation` (action-noun)
- `implement-auth` (descriptive)
- `cdn-migration` (noun-noun acceptable)
- `hero-animation-v2` (version included)

### Bad Examples ❌

- `fix-the-typo-in-header-component` (too long - max 4 words)
- `fixTypo` (not kebab-case)
- `fix_typo` (snake_case, should be kebab-case)
- `typo` (too vague, lacks context)
- `PROJ-123-fix` (no ticket numbers)

---

<!-- /ANCHOR:folder-naming-examples -->
<!-- ANCHOR:status-field-values -->
## 7. STATUS FIELD VALUES

| Status | Meaning | Reuse Priority |
|--------|---------|----------------|
| `draft` | Planning phase | 2 (can start) |
| `active` | Work in progress | 1 (highest - continue here) |
| `paused` | Temporarily on hold | 3 (can resume) |
| `complete` | Implementation finished | 4 (avoid reopening) |
| `archived` | Historical record | 5 (do not reuse) |

---

<!-- /ANCHOR:status-field-values -->
<!-- ANCHOR:update-vs-create-decision -->
## 8. UPDATE VS CREATE DECISION

### UPDATE Existing Spec When:

✅ Iterative development (continuing same feature)
✅ Bug fixes (fixing existing implementation)
✅ Scope escalation (work grew beyond estimate)
✅ Feature enhancement (adding to existing functionality)
✅ Resuming paused work

### CREATE New Spec When:

❌ Distinct feature (completely separate)
❌ Different approach (alternative strategy)
❌ Separate user story (different requirement)
❌ Complete redesign (starting over)
❌ Unrelated work (no connection)

**Phased Packets**: If the target spec already has child phase folders,
resume/update in the active child phase - not the coordination root.
Use the root only for coordination snapshots, phase-map updates,
and tree-truth verification.

---

<!-- /ANCHOR:update-vs-create-decision -->
<!-- ANCHOR:confirmation-options -->
## 9. CONFIRMATION OPTIONS

When workflow prompts at conversation start:

**Option A:** Use detected folder (if related work found)
**Option B:** Create new spec folder with suggested number
**Option C:** Update one of the related specs shown
**Option D:** Skip spec folder creation (**WARNING:** Technical debt!)
**Option E:** Add phase to existing spec — target a specific phase child (e.g., `specs/NNN-name/001-phase/`). Only shown when existing spec has high complexity or phased content.

**AI Agent Rule:** NEVER decide autonomously - ask user to choose (A/B/C/D/E)

---

<!-- /ANCHOR:confirmation-options -->
<!-- ANCHOR:level-migration-progressive-enhancement -->
## 10. LEVEL MIGRATION (Progressive Enhancement)

### Script-Assisted Upgrade (Recommended)

```bash
# Upgrade to Level 2 (auto-detects current level)
bash upgrade-level.sh specs/042-feature/ --to 2

# Upgrade to Level 3 (chains through intermediate levels)
bash upgrade-level.sh specs/042-feature/ --to 3

# Upgrade to Level 3+
bash upgrade-level.sh specs/042-feature/ --to 3+

# Preview changes first
bash upgrade-level.sh specs/042-feature/ --to 3 --dry-run
```

**Post-Upgrade:** After the script runs, AI **must** auto-populate all `<placeholder_token>` text in newly injected sections by reading existing spec context and deriving appropriate content.

Then verify placeholders are fully resolved:

```bash
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/042-feature/
```

### Manual Fallback

| From | To | Files to Add |
|------|----|--------------|
| 1 → 2 | Add verification | checklist.md |
| 2 → 3 | Add decision documentation | decision-record.md (+ optional research/research.md) |
| 3 → 3+ | Add governance | Extended governance sections + AI protocols |

**Always:**
- Update `level:` field in metadata
- Add changelog entry noting escalation
- Keep existing documentation (progressive - don't delete)
- Inform user of level change

---

<!-- /ANCHOR:level-migration-progressive-enhancement -->
<!-- ANCHOR:troubleshooting -->
## 11. TROUBLESHOOTING

### "I forgot to create the spec folder"

**Fix:**
1. Stop coding immediately
2. Create spec folder retroactively
3. Document what was done and why
4. Get user approval
5. Continue with documentation in place

---

### "I'm not sure which level to choose"

**Solution:**
- When in doubt → choose **higher level**
- Ask user if confidence <80%
- Consider complexity and risk, not only LOC
- Better to over-document than under-document

---

### "Can I change levels mid-work?"

**Yes:**
- Going up: Add additional files (see Level Migration table)
- Going down: Keep existing docs (uncommon)
- Always: Inform user why level changed, update changelog

---

### "What if it's only exploration?"

**Rule:**
- Pure exploration/reading = NO spec needed
- Once you write/edit ANY files = SPEC REQUIRED
- If uncertain → create spec (safer)

---

### "Do I need specs for documentation changes?"

**YES - Documentation changes require specs the same as code changes.**

**Requires spec:**
- ✅ Code files (*.js, *.ts, *.css, *.py)
- ✅ Documentation files (*.md, *.txt, docs/)
- ✅ Configuration files (*.json, *.yaml, *.toml)
- ✅ Knowledge base files
- ✅ Templates (.opencode/skill/system-spec-kit/templates/*.md)
- ✅ Build files (package.json, requirements.txt)

**Exceptions (no spec needed):**
- ❌ Single typo fix (<5 characters in one file)
- ❌ Whitespace-only changes
- ❌ Auto-generated updates (package-lock.json)

---

### "When do I need an Architecture Decision Record (ADR)?"

**Create `decision-record-*.md` when making:**
- Database, framework, or library choices
- Architectural pattern selections
- Major refactoring approaches
- Infrastructure/deployment strategy changes

**Format:** Use descriptive name (e.g., `decision-record-database-choice.md`)

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:what-requires-spec-folders -->
## 12. WHAT REQUIRES SPEC FOLDERS

| File Type | Requires Spec | Examples |
|-----------|--------------|----------|
| Code files | ✅ Yes | JavaScript, TypeScript, Python, CSS, HTML |
| Documentation | ✅ Yes | Markdown, README updates, guides |
| Configuration | ✅ Yes | JSON, YAML, TOML, .env templates |
| Knowledge base | ✅ Yes | Project-specific knowledge files |
| Templates | ✅ Yes | `.opencode/skill/system-spec-kit/templates/*.md` modifications |
| Build/tooling | ✅ Yes | package.json, requirements.txt, Dockerfile |

**Exceptions (no spec needed):**
- ❌ Pure exploration/reading (no file modifications)
- ❌ Single typo fixes (<5 characters in one file)
- ❌ Whitespace-only changes
- ❌ Auto-generated file updates (package-lock.json)

---

<!-- /ANCHOR:what-requires-spec-folders -->
<!-- ANCHOR:skip-option-option-d-usage -->
## 13. SKIP OPTION (OPTION D) USAGE

### When Appropriate ✅

- Quick code exploration without implementation
- Testing a concept or approach
- Reading/analyzing existing code only
- Prototyping that will be discarded

### When NOT Appropriate ❌

- Any actual implementation
- Bug fixes (even small ones)
- Feature work
- Refactoring
- Configuration changes
- Documentation updates

### Technical Debt Warning

Skipping documentation:
- Makes future debugging harder
- Loses implementation decisions
- Breaks team handoffs
- Creates incomplete change history

**Use sparingly.** When in doubt, create spec folder (even minimal Level 1).

---

<!-- /ANCHOR:skip-option-option-d-usage -->
<!-- ANCHOR:template-adaptation-checklist-progressive-enhancement -->
## 14. TEMPLATE ADAPTATION CHECKLIST (Progressive Enhancement)

Before presenting documentation to user:

- [ ] All REQUIRED templates for level copied from `.opencode/skill/system-spec-kit/templates/`:
  - [ ] Level 1: spec.md + plan.md + tasks.md + implementation-summary.md
  - [ ] Level 2: Level 1 + checklist.md
  - [ ] Level 3: Level 2 + decision-record.md
- [ ] Optional templates copied if needed (Level 3 only)
- [ ] All placeholders replaced (`<PLACEHOLDER>`, `<NEEDS_CLARIFICATION: ...>`)
- [ ] All sample content removed (`<!-- SAMPLE CONTENT -->`)
- [ ] Template footer deleted
- [ ] Metadata block filled correctly
- [ ] All sections filled with actual content (or marked "N/A")
- [ ] Cross-references to sibling documents working
- [ ] Numbering and emojis preserved
- [ ] Structure matches template
- [ ] Descriptive filenames used (for decision records)

**If ANY unchecked → Fix before user presentation**
**If required template missing → Cannot claim completion**

---

<!-- /ANCHOR:template-adaptation-checklist-progressive-enhancement -->
<!-- ANCHOR:context-save-handover -->
## 15. CONTEXT SAVE & HANDOVER

### Context Save

**Manual triggers (OpenCode):**
- Command: `/memory:save`
- Keywords: "save context", "save conversation", "save this"

**Note:** OpenCode does not support automatic interval-based saves (no hooks system).

**MANDATORY:** Use generate-context.js for memory save:
```
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/###-folder/
```

❌ DO NOT use Write/Edit tools to create memory files directly.

> **Memory Context Loading Integration:** Memory loading implements AGENTS.md Memory Context Loading. When resuming work on an existing spec folder with memory files, display options: `[1] [2] [3] [all] [skip]` for memory selection.

**Phased Resume**: When the target folder has child phases, first resolve
whether you need the coordination root or an active child.
Load/save memory in the child packet by default.
Only load root memory when updating coordination snapshots.

**Save location:**
- Primary: `specs/###-folder/memory/`
- No workspace-root fallback; save memory only in the active spec folder's `memory/` directory

**Filename pattern:** `DD-MM-YY_HH-MM__short-description.md`

### Session Handover

**Command:** `/spec_kit:handover`

**Variants:**
- `/spec_kit:handover:quick` (default) - Minimal handover for quick continuation
- `/spec_kit:handover:full` - Comprehensive handover with full context

**Purpose:** Creates a continuation document for smooth session transitions.

**Use when:**
- Ending a long session
- Context compaction detected
- Handing off to another session
- Before complex multi-step operations

---

<!-- /ANCHOR:context-save-handover -->
<!-- ANCHOR:phase-workflow-shortcuts -->
## 16. PHASE WORKFLOW SHORTCUTS

### Phase Commands

| Command | Description |
|---------|-------------|
| `/spec_kit:plan :with-phases` | Trigger phase decomposition as pre-workflow in plan or complete |
| `create.sh --phase <parent> --topic <name>` | Create a new phase child folder under a parent spec |
| `validate.sh <parent> --recursive` | Validate parent and all child phase folders |
| `node .../nested-changelog.js <spec-folder> --write` | Write a packet-local root or phase changelog into the parent packet `changelog/` folder |

### Phase Quick Reference

**Detection:** Complexity score >= 25 AND level >= 3

**Scoring dimensions:** Architectural (10) + Files>15 (10) + LOC>800 (10) + Risk>=2 (10) + Extreme scale (10)

**Suggested phase counts:**
- Score 25-34: 2 phases
- Score 35-44: 3 phases
- Score 45+: 4 phases

### Phase Folder Pattern

```
specs/###-parent/
├── spec.md           # Phase Documentation Map
├── changelog/        # Root + phase changelog artifacts
├── 001-phase-one/    # Independent child spec folder
├── 002-phase-two/
└── 003-phase-three/
```

### Phase vs Version Sub-Folders

- **Phases:** Parallel decomposition of different work streams
- **Versions:** Sequential iterations of the same work

**Full documentation:** See [phase_definitions.md](../structure/phase_definitions.md)

---

<!-- /ANCHOR:phase-workflow-shortcuts -->
<!-- ANCHOR:agent-critical-rules-progressive-enhancement -->
## 17. AGENT CRITICAL RULES (Progressive Enhancement)

### Absolutely Required

- **NEVER create documentation from scratch** - Always copy from templates
- **ALWAYS copy from `.opencode/skill/system-spec-kit/templates/`** directory
- **ALWAYS copy ALL REQUIRED templates for chosen level**:
  - Level 1: spec.md + plan.md + tasks.md + implementation-summary.md
  - Level 2: Level 1 + checklist.md
  - Level 3: Level 2 + decision-record.md
- **ALWAYS fill ALL placeholders** - No `<PLACEHOLDER>` marker in final docs
- **ALWAYS respond to workflow prompts** - Ask user for A/B/C/D/E choice
- **ALWAYS get user approval** - Explicit "yes" before file changes
- **ONLY @speckit creates spec documentation** — Never route spec.md/plan.md/tasks.md/etc. to @general/@write. Exceptions: @handover (handover.md), @deep-research (research/research.md), @debug (debug-delegation.md)

### Enforcement

- **Verify required templates exist** before claiming completion
- **LOC thresholds are soft guidance** - use judgment
- **Enforcement is manual** - verify before claiming done

### Applies to ALL

- Code files (*.js, *.ts, *.py, *.css, *.html)
- Documentation files (*.md, README, docs/)
- Configuration files (*.json, *.yaml, *.toml)
- Knowledge base files (project-specific)
- Template files (.opencode/skill/system-spec-kit/templates/*.md)
- Build files (package.json, requirements.txt)

**No exceptions** (unless user explicitly selects Option D)

---

<!-- /ANCHOR:agent-critical-rules-progressive-enhancement -->
<!-- ANCHOR:checklist-verification-protocol-level-2 -->
## 18. CHECKLIST VERIFICATION PROTOCOL (Level 2+)

### When to Use

Checklist verification is **MANDATORY** for all Level 2+ documentation:
- Level 2: Features requiring QA validation (100-499 LOC guidance)
- Level 3: Complex/architectural work (>=500 LOC guidance)
- Level 3+: Complex governance/multi-agent work (high complexity/risk)

The `checklist.md` is an **ACTIVE VERIFICATION TOOL**, not passive documentation.

### Verification Process

```
CHECKLIST AS VERIFICATION TOOL (Level 2+):
1. LOAD checklist.md at completion phase
2. VERIFY each item systematically (P0 first, then P1, then P2)
3. MARK items [x] with evidence (links, test results, etc.)
4. BLOCK completion until all P0/P1 items verified
5. DOCUMENT any deferred P2 items with reason
```

### Priority Levels

| Priority | Meaning | Completion Gate |
|----------|---------|-----------------|
| **P0** | Blocker | MUST pass - work is incomplete without this |
| **P1** | Required | MUST pass - required for production readiness |
| **P2** | Optional | Can defer with documented reason |

### How to Verify Items

For each checklist item:

1. **Perform the check** (run test, inspect code, verify behavior)
2. **Mark with [x]** when verified
3. **Add evidence** (link, test output, screenshot reference)
4. **Add timestamp** for audit trail

### Example: Properly Verified Checklist

```markdown
## Verification Checklist

### P0 - Blockers (MUST pass)
- [x] Core functionality works as specified
  - Evidence: Manual test passed - modal opens/closes correctly
  - Verified: 2025-12-01 14:30
- [x] No console errors in browser
  - Evidence: DevTools console clean on Chrome/Firefox/Safari
  - Verified: 2025-12-01 14:32

### P1 - Required (MUST pass for production)
- [x] Responsive design verified (mobile/tablet/desktop)
  - Evidence: Tested at 375px, 768px, 1440px breakpoints
  - Verified: 2025-12-01 14:35
- [x] Accessibility: keyboard navigation works
  - Evidence: Tab/Enter/Escape all functional
  - Verified: 2025-12-01 14:38

### P2 - Optional (can defer)
- [ ] Performance optimization for large datasets
  - Deferred: Not needed for MVP, tracked in issue #123
- [x] Animation smoothness verified
  - Evidence: 60fps confirmed in Performance tab
  - Verified: 2025-12-01 14:40
```

### AI Agent Rules

- **NEVER claim completion without running checklist verification**
- **ALWAYS load checklist.md before stating work is done**
- **ALWAYS mark items with evidence, not only [x]**
- **ALWAYS complete all P0/P1 before claiming done**
- **ALWAYS document why P2 items are deferred (if applicable)**

---

<!-- /ANCHOR:checklist-verification-protocol-level-2 -->
<!-- ANCHOR:core-principle -->
## 19. Core Principle

**Every file change deserves documentation.**

Future you will thank present you for creating that spec folder.

When in doubt:
- Document more rather than less
- Choose higher level over lower
- Create spec folder over skipping
- Ask user rather than guessing

**Cost of creating spec << Cost of reconstructing lost context later**

---

<!-- /ANCHOR:core-principle -->
<!-- ANCHOR:related-resources -->
## 20. RELATED RESOURCES

### Reference Files
- [template_guide.md](../templates/template_guide.md) - Template selection, adaptation, and quality standards
- [level_specifications.md](../templates/level_specifications.md) - Complete Level 1-3 requirements and migration
- [path_scoped_rules.md](../validation/path_scoped_rules.md) - Path-scoped validation rules reference

### Templates (Organized by Level)

**Level 1 Templates (Baseline):**
- [spec.md](../../templates/level_1/spec.md) - Requirements and user stories template
- [plan.md](../../templates/level_1/plan.md) - Technical implementation plan template
- [tasks.md](../../templates/level_1/tasks.md) - Task breakdown template
- [implementation-summary.md](../../templates/level_1/implementation-summary.md) - Completion summary template

**Level 2 Templates (Verification):**
- [spec.md](../../templates/level_2/spec.md) - Requirements template with extended sections
- [plan.md](../../templates/level_2/plan.md) - Implementation plan with verification
- [tasks.md](../../templates/level_2/tasks.md) - Task breakdown template
- [implementation-summary.md](../../templates/level_2/implementation-summary.md) - Completion summary template
- [checklist.md](../../templates/level_2/checklist.md) - Validation checklist template

**Level 3 Templates (Full Documentation):**
- [spec.md](../../templates/level_3/spec.md) - Comprehensive requirements template
- [plan.md](../../templates/level_3/plan.md) - Full implementation plan template
- [tasks.md](../../templates/level_3/tasks.md) - Detailed task breakdown template
- [implementation-summary.md](../../templates/level_3/implementation-summary.md) - Completion summary template
- [checklist.md](../../templates/level_3/checklist.md) - Full validation checklist template
- [decision-record.md](../../templates/level_3/decision-record.md) - Architecture Decision Records template

**Research Templates (Level 3 optional):**
- [research template](../../templates/research.md) - Copy to `research/research.md` for Level 3 research packets

**Session Management Templates:**
- [handover.md](../../templates/handover.md) - Full session handover document
- [debug-delegation.md](../../templates/debug-delegation.md) - Debug task delegation template

**Summary Templates:**
- [implementation-summary.md](../../templates/level_1/implementation-summary.md) - Required completion summary (Level 1 baseline)
- [implementation-summary.md](../../templates/level_2/implementation-summary.md) - Required completion summary (Level 2)
- [implementation-summary.md](../../templates/level_3/implementation-summary.md) - Required completion summary (Level 3)
- [implementation-summary.md](../../templates/level_3+/implementation-summary.md) - Required completion summary (Level 3+)

### Related Skills
- `sk-code--web` - Implementation, debugging, and verification lifecycle
- `system-spec-kit` - Context preservation with semantic memory
- `sk-git` - Git workspace setup and clean commits
<!-- /ANCHOR:related-resources -->
