---
description: Create a changelog entry by dynamically detecting recent work, resolving the target component folder, and generating a properly formatted changelog file - supports :auto and :confirm modes
argument-hint: "<spec-folder-or-component> [--bump <major|minor|patch|build>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @write agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `create_changelog_auto.yaml`
>    - Confirm mode → `create_changelog_confirm.yaml`
> 5. Execute the YAML workflow step by step
>
> The @write references below are self-verification checks — not dispatch instructions.
> All content after the Setup Phase is reference context for the YAML workflow.

---

# 🚨 PHASE 0: @WRITE AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @write agent?
│
├─ INDICATORS that you ARE @write agent:
│   ├─ You were invoked with "@write" prefix
│   ├─ You have template-first workflow capabilities
│   ├─ You load templates BEFORE creating content
│   ├─ You validate template alignment AFTER creating
│
├─ IF YES (all indicators present):
│   └─ write_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ WRITE AGENT REQUIRED                                    │
    │   │                                                            │
    │   │ This command requires the @write agent for:                │
    │   │   • Template-first workflow (loads before creating)          │
    │   │   • Changelog format validation                            │
    │   │   • Version number verification                             │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @write /create:changelog [spec-folder-or-component]      │
    │   │                                                            │
    │   │ Reference: [runtime_agent_path]/write.md                   │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Write agent required"
```

**Phase Output:**
- `write_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains a spec folder path or component name (ignoring flags):
   ├─ IF $ARGUMENTS has a path to a spec folder:
   │   ├─ spec_folder = extracted path
   │   ├─ Read implementation-summary.md, tasks.md, spec.md from that folder
   │   ├─ Extract: work summary, files changed, change type
   │   ├─ component_hint = "auto-detect from spec artifacts"
   │   └─ Omit Q0 (spec folder already provided)
   │
   ├─ IF $ARGUMENTS has a component name (e.g., "sk-doc", "commands"):
   │   ├─ component_hint = extracted name
   │   ├─ spec_folder = null (will use git history instead)
   │   └─ Omit Q0 (component already provided)
   │
   └─ IF $ARGUMENTS is empty → include Q0 in prompt

3. CHECK for --bump flag:
   ├─ IF --bump <type> present → version_bump = extracted type, omit Q1
   └─ IF no --bump flag → include Q1 in prompt

4. Search for recent spec folders with implementation-summary.md:
   $ find .opencode/specs -name "implementation-summary.md" -mtime -7 2>/dev/null | head -5

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                              │
   │                                                                    │
   │ **Q0. Source** (if not provided in command):                       │
   │    What should we create a changelog for?                          │
   │    A) Spec folder path: [suggest recent specs if found]            │
   │    B) Component name (e.g., sk-doc, commands, system-spec-kit)     │
   │    C) Recent git commits (auto-detect from history)                │
   │                                                                    │
   │ **Q1. Version Bump** (if no --bump flag):                           │
   │    What type of version change is this?                            │
   │    A) Minor - New feature or significant addition (Recommended)     │
   │    B) Patch - Bug fix, refactor, or incremental improvement         │
   │    C) Major - Breaking change or architectural overhaul            │
   │    D) Build - Hotfix on an already-published version                │
   │    E) Auto-detect from change type                                 │
   │                                                                    │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):                │
   │    A) Autonomous - Execute without prompts (Recommended)           │
   │    B) Interactive - Confirm at each step                            │
   │                                                                    │
   │ Reply with answers, e.g.: "A specs/01.../042..., E, A"             │
   └────────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - source_type = [spec_folder / component / git_history]
   - spec_folder = [path or null]
   - component_hint = [name or null]
   - version_bump = [major / minor / patch / build / auto]
   - execution_mode = [AUTONOMOUS / INTERACTIVE from suffix or Q2]

8. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create changelog files without completing the workflow
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer the source from context, screenshots, or conversation history
```

**Phase Output:**
- `write_agent_verified = ________________`
- `source_type = ________________`
- `spec_folder = ________________`
- `component_hint = ________________`
- `version_bump = ________________`
- `execution_mode = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                | REQUIRED    | YOUR VALUE | SOURCE            |
| -------------------- | ----------- | ---------- | ----------------- |
| write_agent_verified | ✅ Yes       | ______     | Automatic check   |
| source_type          | ✅ Yes       | ______     | Q0 or $ARGUMENTS  |
| spec_folder          | Conditional | ______     | Q0 path or null   |
| component_hint       | Conditional | ______     | Q0 name or null   |
| version_bump         | ✅ Yes       | ______     | --bump flag or Q1 |
| execution_mode       | ✅ Yes       | ______     | Suffix or Q2      |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_changelog_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_changelog_confirm.yaml`

The YAML contains: detailed step activities, component mapping, version calculation, content generation, validation, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@context`, `@speckit`) from this document
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: run Phase 0, then Setup Phase, then load the YAML file

---

## 1. ROLE & PURPOSE

```yaml
role: Expert Changelog Creator using established format conventions
purpose: Create properly formatted changelog entries by dynamically detecting work context
action: Analyze recent work, resolve component, calculate version, generate changelog

operating_mode:
  workflow: sequential_7_step
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  tracking: progressive_task_checklists
  validation: format_and_version_check
```

Create a complete, properly formatted changelog file by analyzing recent work (from spec folders or git history), resolving the correct component subfolder, calculating the next version number, and generating content that matches the established changelog format used across 370+ existing files.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Spec folder path, component name, or empty (auto-detect)
**Outputs:** Changelog file at `.opencode/changelog/{component}/v{version}.md` + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. CHANGELOG FORMAT REFERENCE

### Established Format

```markdown
# v{VERSION}

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**{VERSION}**] - {YYYY-MM-DD}

{One-sentence or one-paragraph summary of the release.}

> Spec folder: `{path}` (optional)

---

## Highlights

### {Category Heading}

- **{Feature/Fix name}** — {Description}

## Files Changed

| File           | Action                   | Description       |
| -------------- | ------------------------ | ----------------- |
| `path/to/file` | Created/Modified/Deleted | Brief description |

## Upgrade

No migration required.
```

### Version Format

`v{MAJOR}.{MINOR}.{PATCH}.{BUILD}` — 4-segment, all numeric, prefixed with `v`.

### Component Folders

Discovered dynamically at runtime by scanning `.opencode/changelog/` for existing subfolders:

```
$ ls -d .opencode/changelog/*/  # Lists all component folders
```

The YAML workflow (Step 2) scans this directory to build the component mapping. Folder names follow the `NN--component-name` convention where `NN` is a zero-padded index.

---

## 4. EXAMPLES

**Example 1: From spec folder (auto mode)**
```
/create:changelog .opencode/specs/01--system-spec-kit/042-memory-upgrade :auto
```
→ Reads spec artifacts, detects component as `01--system-spec-kit`, calculates next version, generates changelog

**Example 2: From component name**
```
/create:changelog sk-doc --bump minor :confirm
```
→ Targets `11--sk-doc`, uses git history for content, bumps minor version

**Example 3: Auto-detect everything**
```
/create:changelog :auto
```
→ Scans recent git commits, determines component(s), auto-detects version bump

**Example 4: Prompted creation**
```
/create:changelog
```
→ Prompts: consolidated prompt with Q0-Q2, interactive workflow

---

## 5. ERROR HANDLING

| Error                   | Cause                                         | Fix                                                  |
| ----------------------- | --------------------------------------------- | ---------------------------------------------------- |
| No spec artifacts found | Empty or non-existent spec folder             | Fall back to git history analysis                    |
| Component not resolved  | Changed files don't match any mapping pattern | Default to `00--opencode-environment` or prompt user |
| Version conflict        | File with calculated version already exists   | Increment BUILD segment                              |
| Empty changelog content | No work context detected                      | Prompt user for manual input                         |
| Invalid version format  | Non-standard existing filenames               | Skip non-conforming files during scan                |

---

## 6. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @write agent verification (Phase 0)
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Proceeded without asking user for source when not in $ARGUMENTS
- Auto-created changelog file without completing all workflow steps

**Workflow Violations (Steps 1-7):**
- Skipped context analysis and jumped to content generation
- Wrote changelog without verifying version is sequential
- Generated content that doesn't match established format
- Claimed "complete" without quality validation

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. VERIFY outputs exist
6. CONTINUE to next step in sequence
```

---

## 7. RELATED RESOURCES

| Resource                  | Path                                                       |
| ------------------------- | ---------------------------------------------------------- |
| Changelog format examples | `.opencode/changelog/` (370+ existing files)               |
| Command template          | `.opencode/skill/sk-doc/assets/agents/command_template.md` |
| sk-doc skill              | `.opencode/skill/sk-doc/SKILL.md`                          |
| system-spec-kit skill     | `.opencode/skill/system-spec-kit/SKILL.md`                 |

---

## 8. COMMAND CHAIN

| Condition               | Suggested Command                       | Reason                            |
| ----------------------- | --------------------------------------- | --------------------------------- |
| After changelog created | `/create:visual_html`                   | Generate visual changelog summary |
| Need spec folder first  | `/spec_kit:complete`                    | Create spec with implementation   |
| Umbrella release        | Manual `00--opencode-environment` entry | Aggregates component changelogs   |
| Save context            | `/memory:save`                          | Preserve decisions                |

---

## 9. NEXT STEPS

What would you like to do next?

- Create another changelog for a different component
- Review the generated changelog
- Create a visual HTML summary of recent changelogs
- Save context and end session
