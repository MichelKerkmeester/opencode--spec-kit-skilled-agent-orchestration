---
title: "Implementation Plan: Create Changelog Command [03--commands-and-skills/015-cmd-create-changelog/plan]"
description: "Mode-based slash command with 7-step YAML workflow that dynamically detects recent work, resolves changelog component folders, calculates version numbers, and generates formatted changelog files."
trigger_phrases:
  - "implementation"
  - "plan"
  - "changelog"
  - "create changelog"
  - "command"
  - "014"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Create Changelog Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (COMMAND.md) + YAML (workflow definitions) |
| **Framework** | OpenCode command system (mode-based pattern) |
| **Storage** | File system (`.opencode/changelog/` subfolders) |
| **Testing** | Manual invocation verification |

### Overview
Create a `/create:changelog` slash command that follows the established mode-based create command pattern. The command file (changelog.md) handles argument parsing, mode detection, and routes to YAML workflows (auto/confirm) that execute a 7-step process: detect work context, resolve target component, calculate version, generate content, validate, write file, and save context. The core innovation is dynamic detection — the command intelligently determines what was worked on and where the changelog belongs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Existing create command patterns analyzed (7 sibling commands)
- [x] Changelog structure analyzed (18 folders, 370+ files)
- [x] Command template reference reviewed (command_template.md)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-010)
- [ ] Command invocable via `/create:changelog`
- [ ] Both :auto and :confirm modes functional
- [ ] Generated changelogs match established format
- [ ] Spec folder artifacts updated (tasks marked [x], implementation-summary.md created)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mode-Based Command with YAML Workflow Dispatch (same pattern as create:skill, create:agent, etc.)

### Key Components

- **changelog.md** (Command File): Frontmatter, Phase 0 agent check, Unified Setup Phase, mode routing to YAML
- **create_changelog_auto.yaml** (Auto Workflow): 7-step autonomous execution with component mapping table, version calculation logic, and content generation template
- **create_changelog_confirm.yaml** (Confirm Workflow): Same 7 steps with checkpoint gates for user approval at each step

### Data Flow
```
User invokes /create:changelog <spec-folder> [:auto|:confirm]
    │
    ├─► changelog.md parses args, detects mode, validates inputs
    │
    ├─► Routes to auto or confirm YAML workflow
    │
    └─► YAML workflow executes 7 steps:
        │
        ├── Step 1: Context Analysis
        │   ├── Read spec folder artifacts (implementation-summary.md, tasks.md, spec.md)
        │   └── Fallback: git log analysis
        │
        ├── Step 2: Component Resolution
        │   ├── Map changed file paths → component mapping table
        │   └── Output: target changelog subfolder(s)
        │
        ├── Step 3: Version Determination
        │   ├── Scan target folder for existing versions
        │   ├── Parse latest version number
        │   └── Apply bump rules → next version
        │
        ├── Step 4: Content Generation
        │   ├── Pull summary from spec artifacts
        │   ├── Categorize changes (New/Changed/Fixed)
        │   ├── List files changed
        │   └── Format per changelog template
        │
        ├── Step 5: Quality Validation
        │   ├── Verify format compliance
        │   ├── Verify version is sequential
        │   └── Verify no duplicate files
        │
        ├── Step 6: Write File
        │   └── Write to .opencode/changelog/{component}/v{version}.md
        │
        └── Step 7: Save Context
            └── Report completion + save memory
```

### Component Mapping Table (Embedded in YAML)

| Pattern | Changelog Folder |
|---------|-----------------|
| `.opencode/skill/system-spec-kit/**` | `01--system-spec-kit` |
| `AGENTS.md`, `.claude/agents/**`, `.opencode/agent/**` | `02--agents-md` |
| Agent orchestration, dispatch logic | `03--agent-orchestration` |
| `.opencode/command/**` | `04--commands` |
| `skill_advisor.py` | `05--skill-advisor` |
| `.opencode/skill/sk-code-opencode/**` | `06--sk-code-opencode` |
| `.opencode/skill/sk-code-web/**` | `07--sk-code-web` |
| `.opencode/skill/sk-code-full-stack/**` | `08--sk-code-full-stack` |
| `.opencode/skill/sk-code-review/**` | `09--sk-code-review` |
| `.opencode/skill/sk-git/**` | `10--sk-git` |
| `.opencode/skill/sk-doc/**` | `11--sk-doc` |
| `.opencode/skill/sk-improve-prompt/**` | `13--sk-improve-prompt` |
| `.opencode/skill/mcp-chrome-devtools/**` | `14--mcp-chrome-devtools` |
| `.opencode/skill/mcp-code-mode/**` | `15--mcp-code-mode` |
| `.opencode/skill/mcp-figma/**` | `16--mcp-figma` |
| `.opencode/skill/cli-gemini/**` | `17--cli-gemini` |
| Unmatched / cross-component | `00--opencode-environment` |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Command File
- [ ] Create changelog.md following mode-based command template
- [ ] Include Phase 0 (@write agent verification)
- [ ] Include Unified Setup Phase (Q0: spec folder, Q1: version bump, Q2: mode, Q3: memory)
- [ ] Include Phase Status Verification table
- [ ] Add instructions pointing to auto/confirm YAML files

### Phase 2: Auto YAML Workflow
- [ ] Create create_changelog_auto.yaml with full 7-step workflow
- [ ] Implement component mapping table
- [ ] Implement version detection and bump logic
- [ ] Implement changelog content generation template
- [ ] Add quality validation rules
- [ ] Include completion report format

### Phase 3: Confirm YAML Workflow
- [ ] Create create_changelog_confirm.yaml (duplicate auto, add checkpoints)
- [ ] Add checkpoint gates at each of the 7 steps
- [ ] Configure interactive options (Approve/Review/Modify/Skip)

### Phase 4: Verification & Integration
- [ ] Update README.txt with new command entry
- [ ] Verify command structure matches sibling create commands
- [ ] Test format of generated changelogs against existing entries
- [ ] Verify all YAML fields present per established pattern
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Command file sections, YAML fields | Grep for required sections |
| Format | Generated changelog compliance | Compare against existing changelogs |
| Manual | End-to-end invocation | `/create:changelog` with sample spec folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing create command pattern | Internal | Green | Pattern is well-documented and stable |
| Changelog format/structure | Internal | Green | 370+ existing files for reference |
| command_template.md reference | Internal | Green | Template read and aligned |
| OpenCode command system | Internal | Green | Slash command infrastructure exists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Command generates malformed changelogs or breaks existing command index
- **Procedure**: Delete the 3 new files (changelog.md, 2 YAML files), revert README.txt change
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Command File) ──► Phase 2 (Auto YAML) ──► Phase 3 (Confirm YAML) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Command File | None | Phase 2, 3 |
| Phase 2: Auto YAML | Phase 1 | Phase 3, 4 |
| Phase 3: Confirm YAML | Phase 2 (for duplication base) | Phase 4 |
| Phase 4: Verification | Phase 1, 2, 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Command File | Low | ~180 LOC |
| Phase 2: Auto YAML | Medium | ~450 LOC |
| Phase 3: Confirm YAML | Low (duplication + checkpoints) | ~500 LOC |
| Phase 4: Verification | Low | ~10 LOC (README update) |
| **Total** | | **~1140 LOC** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No existing command named "changelog" in create/ namespace
- [ ] YAML syntax valid (no parse errors)
- [ ] README.txt backed up

### Rollback Procedure
1. Delete `.opencode/command/create/changelog.md`
2. Delete `.opencode/command/create/assets/create_changelog_auto.yaml`
3. Delete `.opencode/command/create/assets/create_changelog_confirm.yaml`
4. Revert README.txt to previous state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — new files only
<!-- /ANCHOR:enhanced-rollback -->

---
