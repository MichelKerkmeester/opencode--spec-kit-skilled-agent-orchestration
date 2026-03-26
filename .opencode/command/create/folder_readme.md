---
description: Unified documentation command for folder README and install guide creation with sk-doc quality standards - supports :auto and :confirm modes
argument-hint: "[readme|install] <target> [--type <project|component|feature|skill>] [--platforms <list>] [--output <path>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @write agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs (including operation detection)
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `create_folder_readme_auto.yaml`
>    - Confirm mode → `create_folder_readme_confirm.yaml`
>    (Both YAMLs contain readme AND install operations — skip to the detected operation section)
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
    │   │   • DQI scoring (target: 75+ Good)                         │
    │   │   • sk-doc skill integration                               │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @write /create:folder_readme [operation] [target]        │
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

**Round-trip optimization:** This workflow requires only 1 user interaction (all questions asked together), with an optional follow-up only if target file already exists.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

0. DETECT OPERATION from $ARGUMENTS or command invocation:
   ├─ First positional token is "readme" → operation = "readme", remove token from args
   ├─ First positional token is "install" → operation = "install", remove token from args
   ├─ "--operation readme" flag → operation = "readme"
   ├─ "--operation install" flag → operation = "install"
   └─ No operation detected → operation = "ASK" (include Q_OP in prompt)
   NOTE: When no operation is detected and $ARGUMENTS contains a path-like value, default to "readme".

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q_MODE)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q_MODE)
   └─ No suffix → execution_mode = "ASK" (include Q_MODE in prompt)

── README BRANCH (operation = "readme") ──────────────────────────────

2R. CHECK if $ARGUMENTS contains target path:
    ├─ IF $ARGUMENTS has path content (ignoring flags) → target_path = $ARGUMENTS, omit Q_R1
    └─ IF $ARGUMENTS is empty → include Q_R1 in prompt

3R. CHECK if $ARGUMENTS contains --type flag:
    ├─ IF --type flag present → readme_type = [parsed value], omit Q_R2
    └─ IF no --type flag → include Q_R2 in prompt

── INSTALL BRANCH (operation = "install") ────────────────────────────

2I. CHECK if $ARGUMENTS contains a project name:
    ├─ IF $ARGUMENTS has content (ignoring flags/suffixes) → project_name = $ARGUMENTS, omit Q_I1
    └─ IF $ARGUMENTS is empty → include Q_I1 in prompt

3I. CHECK for --platforms flag in $ARGUMENTS:
    ├─ IF --platforms flag present with valid values → platforms = [values], omit Q_I2
    └─ IF no --platforms flag → include Q_I2 in prompt

4I. Check for existing installation guides:
    $ ls -la ./install_guides/*.md ./INSTALL.md ./docs/INSTALL.md 2>/dev/null
    - Will inform conflict handling in Q_I3 if files exist

──────────────────────────────────────────────────────────────────────

5. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q_OP. Operation** (if not detected from args):               │
   │    A) README - Create/update folder documentation              │
   │    B) Install Guide - Create/update installation guide         │
   │                                                                │
   │ ── README Questions (if operation = readme) ──                 │
   │                                                                │
   │ **Q_R1. Target Path** (if not provided in command):            │
   │    Where should the README be created?                         │
   │    (e.g., .opencode/skill/my-skill, src/components, ./)        │
   │                                                                │
   │ **Q_R2. README Type** (if not provided via --type):            │
   │    A) Project - Main project documentation at root level       │
   │    B) Component - Documentation for a module/package/skill     │
   │    C) Feature - Documentation for a specific feature/system     │
   │    D) Skill - Documentation for an OpenCode skill              │
   │                                                                │
   │ ── Install Guide Questions (if operation = install) ──         │
   │                                                                │
   │ **Q_I1. Project Name** (if not provided in command):           │
   │    What project/tool needs an installation guide?              │
   │                                                                │
   │ **Q_I2. Target Platforms** (required):                         │
   │    A) All platforms (macOS, Linux, Windows, Docker)            │
   │    B) macOS only                                               │
   │    C) Linux only                                               │
   │    D) Custom (specify: macos,linux,windows,docker)             │
   │                                                                │
   │ **Q_I3. Output Location** (required):                          │
   │    A) install_guides/[Type] - [Name].md (Recommended)          │
   │    B) INSTALL.md at project root                               │
   │    C) docs/INSTALL.md                                          │
   │    D) Custom path (specify)                                    │
   │    [If existing file found: E) Overwrite | F) Merge | G) Cancel]│
   │                                                                │
   │ ── Common ──                                                   │
   │                                                                │
   │ **Q_MODE. Execution Mode** (if no :auto/:confirm suffix):        │
   │    A) Interactive - Confirm at each step (Recommended)          │
   │    B) Autonomous - Execute without prompts                     │
   │                                                                │
   │ Reply with answers for applicable questions only.              │
   └────────────────────────────────────────────────────────────────┘

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - operation = [readme/install]

   IF readme:
     - target_path = [from Q_R1 or $ARGUMENTS]
     - readme_type = [A/B/C/D from Q_R2 or --type flag → project/component/feature/skill]

   IF install:
     - project_name = [from Q_I1 or $ARGUMENTS]
     - platforms = [from Q_I2 or --platforms flag: all/macos/linux/windows/docker]
     - output_path = [derived from Q_I3 choice]
     - existing_file = [yes/no based on check]
     - conflict_resolution = [if existing: overwrite/merge/cancel]

   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q_MODE]

8. VERIFY target and check for existing output:
   ├─ README operation:
   │   ├─ Check if target path exists: $ ls -la [target_path] 2>/dev/null
   │   ├─ IF target path does not exist: Create directory: mkdir -p [target_path]
   │   ├─ Check for existing README: $ ls -la [target_path]/README.md 2>/dev/null
   │   └─ IF README.md already exists:
   │       ├─ ASK user (ONLY conditional follow-up):
   │       │   ┌────────────────────────────────────────────────────────────┐
   │       │   │ **README.md already exists at [path].**                    │
   │       │   │                                                            │
   │       │   │ **How should we proceed?**                                 │
   │       │   │    A) Overwrite existing file                               │
   │       │   │    B) Create backup and overwrite                          │
   │       │   │    C) Merge/update existing content                        │
   │       │   │    D) Cancel                                               │
   │       │   └────────────────────────────────────────────────────────────┘
   │       ├─ WAIT for user response
   │       └─ Process based on choice (D = RETURN STATUS=CANCELLED)
   │
   └─ Install operation:
       └─ IF output location has conflict AND conflict_resolution not set:
           └─ Handle inline based on Q_I3 response (E/F/G options)

9. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create directories without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
⛔ NEVER infer target path or project name from context
⛔ NEVER assume platforms without confirmation
```

**Phase Output:**
- `write_agent_verified = ________________`
- `operation = ________________`
- `target_path = ________________` (readme only)
- `readme_type = ________________` (readme only)
- `project_name = ________________` (install only)
- `platforms = ________________` (install only)
- `output_path = ________________` (install only)
- `existing_file = ________________` (install only)
- `execution_mode = ________________`
- `existing_file_action = ________________` (if applicable)

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL required values are set:**

| FIELD                  | REQUIRED       | YOUR VALUE | SOURCE                |
| ---------------------- | -------------- | ---------- | --------------------- |
| write_agent_verified   | ✅ Yes          | ______     | Automatic check       |
| operation              | ✅ Yes          | ______     | Detection or Q_OP     |
| target_path            | ○ readme only  | ______     | Q_R1 or $ARGUMENTS    |
| readme_type            | ○ readme only  | ______     | Q_R2 or --type flag   |
| project_name           | ○ install only | ______     | Q_I1 or $ARGUMENTS    |
| platforms              | ○ install only | ______     | Q_I2 or --platforms   |
| output_path            | ○ install only | ______     | Derived from Q_I3     |
| execution_mode         | ✅ Yes          | ______     | Suffix or Q_MODE      |
| existing_file_action   | ○ Conditional  | ______     | If file exists        |

```
VERIFICATION CHECK:
├─ ALL required fields (for detected operation) have values?
│   ├─ YES → Proceed to "1. INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## 1. INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

| Mode | YAML Workflow |
| ---- | ------------- |
| `:auto` | `.opencode/command/create/assets/create_folder_readme_auto.yaml` |
| `:confirm` | `.opencode/command/create/assets/create_folder_readme_confirm.yaml` |

Each YAML contains both **README** and **Install Guide** operation sections. Skip to the section matching the detected operation from the Setup Phase.

The YAML contains: detailed step activities, checkpoints, confidence scoring, error recovery, validation gates, resource routing, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: run Phase 0, then Setup Phase, then load the YAML file

---

## RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on the active runtime profile:

- Default/Copilot: `.opencode/agent`
- Claude: `.claude/agents`
- Codex: `.codex/agents`
- Gemini CLI: `.gemini/agents` (runtime-facing symlink to `.agents/agents`)

---

## GATE 3 STATUS: EXEMPT (Self-Documenting Artifact)

**This command creates documentation files that ARE the documentation artifact.**

| Property        | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| **Location**    | User-specified path (target directory or `install_guides/`) |
| **Reason**      | The created file IS the documentation                       |
| **Spec Folder** | Not required — the output serves as its own spec            |

---

## OPERATION ROUTING

### Input Normalization

- `folder_readme` alias normalizes to `readme`
- `install_guide` alias normalizes to `install`
- `--operation` flag has precedence over positional token
- When no operation is detected and args look like a path, default to `readme`
- Unknown operation values must hard-stop with a re-prompt

### Backward Compatibility

| Legacy Invocation | Normalized Route |
| --- | --- |
| `/create:folder_readme <path> [--type ...] [:mode]` | operation=readme (default) |
| `/create:folder_readme install <project> [--platforms ...] [:mode]` | operation=install (explicit) |

---

## VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed command without @write agent verification
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Started reading the workflow section before all fields are set
- Proceeded without explicit target path or project name
- Overwrote existing file without confirmation
- Inferred location from context instead of explicit user input

**Workflow Violations (Steps 1-5):**
- Skipped content discovery and jumped to generation
- Generated output without identifying key features first
- Did not validate structure before claiming complete

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
6. MARK step ✅ in tracking table
7. CONTINUE to next step in sequence
```

---

## MODE BEHAVIORS

**AUTONOMOUS (:auto):**
- Execute all steps without approval prompts
- Only stop for errors or missing required input
- Best for: Experienced users, scripted workflows, batch operations

**INTERACTIVE (:confirm):**
- Pause at each major step for user approval
- Show preview before file creation
- Ask for confirmation on critical decisions
- Best for: New users, learning workflows, high-stakes changes

**Default:** INTERACTIVE (creation workflows benefit from confirmation)

---

## WORKFLOW TRACKING

### README Operation

| STEP | NAME       | STATUS | REQUIRED OUTPUT     | VERIFICATION                |
| ---- | ---------- | ------ | ------------------- | --------------------------- |
| 1    | Analysis   | ☐      | README type, path   | Type and location confirmed |
| 2    | Discovery  | ☐      | Features, structure | Project info gathered       |
| 3    | Structure  | ☐      | Section structure   | Template selected           |
| 4    | Generation | ☐      | README.md           | Complete README written     |
| 5    | Validation | ☐      | Validated README    | Structure verified          |

### Install Guide Operation

| STEP | NAME       | STATUS | REQUIRED OUTPUT       | VERIFICATION                 |
| ---- | ---------- | ------ | --------------------- | ---------------------------- |
| 1    | Analysis   | ☐      | Guide type, platforms | Type and platforms confirmed |
| 2    | Discovery  | ☐      | Requirements, deps    | Project info gathered        |
| 3    | Structure  | ☐      | Section structure     | Template selected            |
| 4    | Generation | ☐      | Install guide         | Complete guide written       |
| 5    | Validation | ☐      | Validated guide       | Structure verified           |

---

## CRITICAL ENFORCEMENT RULES

```
README STEP 2 (Discovery) REQUIREMENTS:
├─ MUST gather project information before writing
├─ MUST identify key features and structure
├─ MUST determine appropriate sections for type
└─ MUST NOT proceed without content to document

README STEP 4 (Generation) REQUIREMENTS:
├─ MUST include title + tagline
├─ MUST include TABLE OF CONTENTS
├─ MUST use numbered sections
├─ MUST include tables for structured data
└─ MUST NOT leave placeholder content

README STEP 5 (Validation) REQUIREMENTS:
├─ MUST verify all sections are linked in TOC
├─ MUST check no placeholders remain
├─ MUST validate horizontal rules present
└─ MUST NOT claim "complete" without structure check

INSTALL GUIDE REQUIREMENTS:
├─ MUST include AI-First copy-paste prompt
├─ MUST include platform-specific prerequisites
├─ MUST include step-by-step commands
├─ MUST include troubleshooting section
└─ MUST NOT leave untested commands
```

---

## 2. PURPOSE

Create comprehensive documentation following sk-doc quality standards:

- **README operation**: AI-optimized README.md with proper structure, table of contents, and comprehensive documentation following the patterns from SpecKit, Memory System, and Code Environment READMEs.
- **Install guide operation**: AI-first installation guide with clear prerequisites, step-by-step instructions, copy-paste AI prompt, and thorough troubleshooting.

---

## 3. CONTRACT

**Inputs:** `$ARGUMENTS` — Operation + target with optional flags
**Outputs:** Documentation file at target path + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

### Status Patterns

- Success: `STATUS=OK PATH=<output-file>`
- Failure: `STATUS=FAIL ERROR="<reason>"`
- Cancelled: `STATUS=CANCELLED ACTION=cancelled`

---

## 4. REFERENCE (See YAML for Details)

### README Operation

| Section           | Location in YAML      |
| ----------------- | --------------------- |
| README Types      | `readme_types`        |
| Key Patterns      | `template_references` |
| Section Templates | `templates`           |
| Failure Recovery  | `error_recovery`      |
| Completion Report | `completion_report`   |

**Reference READMEs:**
- `.opencode/skill/system-spec-kit/README.md` (SpecKit + Memory pattern)

### Install Guide Operation

| Section             | Location in YAML                |
| ------------------- | ------------------------------- |
| Type Prefixes       | `notes.type_prefix_conventions` |
| Required Sections   | `notes.required_sections`       |
| AI-First Philosophy | `notes.ai_first_philosophy`     |
| Failure Recovery    | `failure_recovery`              |
| Completion Report   | `completion_report_template`    |

**Reference Guides:**
- `.opencode/install_guides/MCP - Code Mode.md`
- `.opencode/install_guides/MCP - Spec Kit Memory.md`
- `.opencode/install_guides/MCP - Chrome Dev Tools.md`

---

## 5. EXAMPLES

### README Examples

**Project README:**
```
/create:folder_readme ./ --type project
```
→ Creates comprehensive project README at root

**Skill README:**
```
/create:folder_readme .opencode/skill/my-skill --type skill
```
→ Creates skill documentation with triggers, commands, MCP tools

**Component README:**
```
/create:folder_readme ./src/auth --type component
```
→ Creates component README with API, usage, integration

**Auto mode (no prompts):**
```
/create:folder_readme ./ --type project :auto
```
→ Creates README without approval prompts, only stops for errors

**Confirm mode (step-by-step approval):**
```
/create:folder_readme .opencode/skill/my-skill --type skill :confirm
```
→ Pauses at each step for user confirmation

### Install Guide Examples

**MCP Server Guide:**
```
/create:folder_readme install semantic-search-mcp
```
→ Creates `install_guides/MCP - Semantic Search.md`

**CLI Tool Guide:**
```
/create:folder_readme install chrome-devtools-cli --platforms macos,linux
```
→ Creates `install_guides/CLI - Chrome DevTools.md`

**Auto mode:**
```
/create:folder_readme install semantic-search-mcp :auto
```
→ Creates install guide without approval prompts

---

## 6. COMMAND CHAIN

This command creates standalone documentation:

```
/create:folder_readme → [Verify output]
```

**Related commands:**
- `/create:sk-skill` — Unified skill creation/update workflows

---

## 7. NEXT STEPS

After documentation creation completes, suggest relevant next steps:

| Condition               | Suggested Command                  | Reason                         |
| ----------------------- | ---------------------------------- | ------------------------------ |
| README created          | Review and verify links work       | Confirm TOC links correctly    |
| Install guide created   | Test AI-First prompt               | Verify installation works      |
| Need the other type     | `/create:folder_readme [op] ...`   | Create companion documentation |
| Create another document | `/create:folder_readme [op] ...`   | Document related component     |
| Want to save context    | `/memory:save [spec-folder-path]`  | Preserve documentation context |

**ALWAYS** end with: "What would you like to do next?"
