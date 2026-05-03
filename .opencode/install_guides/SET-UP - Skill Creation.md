# SET-UP - Skill Creation

Complete guide for creating AI agent skills with native OpenCode discovery. Covers the full 6-step workflow from concept to deployment: understanding, planning, initializing, editing, packaging, and iterating. Includes SKILL.md template reference, bundled resources (scripts, references, assets), validation with DQI scoring, and troubleshooting for common discovery issues.

> **Part of OpenCode Installation.** See the [Master Installation Guide](./README.md) for complete setup.
> **Scope:** `.opencode/skill/` | **Agent Required:** `@general` | **Target DQI:** 75+ (Good), 90+ (Excellent)

---

## 0. AI-FIRST SETUP GUIDE

Copy and paste this prompt to your AI assistant (with `@general`) to get interactive skill creation help:

```text
@general I want to create a new skill for OpenCode. Please guide me through the process interactively by asking me questions one at a time.

**PREREQUISITE CHECK (you MUST verify before proceeding):**
- [ ] You are operating as the @general agent (Mode 2: Skill Creation)
- [ ] sk-doc skill is accessible

If you are NOT the @general agent: STOP immediately and instruct the user to restart with the "@general" prefix. Do NOT proceed with skill creation.

**Questions to ask me (one at a time, wait for my answer):**

1. **Purpose**: What is the skill's purpose? What problem does it solve?

2. **Use Cases**: Give me 2-3 concrete examples of when this skill would be triggered.
   (e.g., "When user asks to create documentation", "When user needs to debug browser issues")

3. **Required Tools**: What tools will the skill need access to?
   - Read (examine files)
   - Write (create files)
   - Edit (modify files)
   - Bash (run commands)
   - Glob (find files)
   - Grep (search content)
   - Task (delegate to agents)
   - WebFetch (fetch URLs)

4. **Bundled Resources**: Will the skill need bundled resources?
   - scripts/ (Python/bash automation)
   - references/ (detailed documentation)
   - assets/ (templates, examples)

5. **Skill Name**: What should we name this skill?
   (Format: lowercase-hyphenated, e.g., "my-custom-skill")

**After gathering my answers, please:**

1. Run: `python .opencode/skill/sk-doc/scripts/init_skill.py <skill-name> --path .opencode/skill`
2. Help me populate the SKILL.md template with my answers
3. Guide me through creating any bundled resources
4. Run: `python .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/<skill-name>` to validate
5. Help me test the skill with a real example
6. Iterate and refine based on testing

My project is at: [your project path]
```

The AI will:
- Ask questions one at a time to understand your skill requirements
- Scaffold the structure using `init_skill.py`
- Generate SKILL.md based on your answers
- Guide you through adding scripts, references, or assets
- Validate with `package_skill.py`
- Help you test with real examples

**Expected creation time:** 20-30 minutes

### Hard Block: @general Agent Required

> **CRITICAL:** Skill creation REQUIRES the `@general` agent to be active.

**Why @general is mandatory:**
- Loads `skill_md_template.md` BEFORE creating (template-first workflow)
- Validates template alignment AFTER creating
- Runs DQI scoring (target: 90+ Excellent)
- Invokes `sk-doc` skill for standards
- Ensures proper use of `init_skill.py` and `package_skill.py`

**Verification (MUST pass before proceeding):**
- [ ] Write agent exists: `ls .opencode/agent/orchestrate.md`
- [ ] Use `@general` prefix when invoking the prompt above

**DO NOT** create skills without the @general agent. Manual creation bypasses quality gates and template alignment.

**Reference:** `.opencode/agent/orchestrate.md` (or any general agent) - Section 4 (Mode 2: Skill Creation)

---

## TABLE OF CONTENTS

0. [AI-FIRST SETUP GUIDE](#0-ai-first-setup-guide)
1. [OVERVIEW](#1-overview)
2. [PREREQUISITES](#2-prerequisites)
3. [SETUP](#3-setup)
4. [CONFIGURATION](#4-configuration)
5. [VERIFICATION](#5-verification)
6. [USAGE](#6-usage)
7. [FEATURES](#7-features)
8. [EXAMPLES](#8-examples)
9. [TROUBLESHOOTING](#9-troubleshooting)
10. [RESOURCES](#10-resources)

---

## 1. OVERVIEW

Skills are specialized, on-demand capabilities loaded into an AI agent at runtime. Each skill is a folder under `.opencode/skill/` containing a `SKILL.md` file with YAML frontmatter that OpenCode reads on startup. The agent invokes the skill when a task matches the skill's description, then follows the instructions inside `SKILL.md` to complete the task.

### Core Principle

> **Create once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### The 6-Step Workflow

```text
[PREREQUISITE: Invoke with @general agent - see Section 0]
            |
Step 1: UNDERSTANDING (~5 min)
    |-> Define purpose, use cases, trigger conditions
            |
Step 2: PLANNING (~5 min)
    |-> Identify resources: scripts, references, assets
            |
Step 3: INITIALIZING (~2 min)
    |-> Run init_skill.py to scaffold structure
            |
Step 4: EDITING (~10-15 min)
    |-> Populate SKILL.md and bundled resources
            |
Step 5: PACKAGING (~2 min)
    |-> Validate with package_skill.py
            |
Step 6: ITERATING (ongoing)
    |-> Test, refine, re-validate
```

### How Discovery Works

```text
OpenCode starts
    |
Scans .opencode/skill/*/SKILL.md
    |
Parses YAML frontmatter (name, description, allowed-tools)
    |
Registers skills_<name>() function
    |
Agent matches user request to skill description
    |
Skill invoked: AI reads SKILL.md and follows instructions
```

Skills appear as `skills_*` functions in available tools after each restart. The `name` field in frontmatter must match the folder name exactly (hyphens become underscores in the function name).

---

## 2. PREREQUISITES

### Required Software

| Software | Version | Verification Command |
| -------- | ------- | -------------------- |
| Python | 3.10+ | `python3 --version` |
| sk-doc skill | Latest | `ls .opencode/skill/sk-doc/` |
| OpenCode | v1.0.190+ | Native skill discovery built-in |
| **@general agent** | - | `ls .opencode/agent/orchestrate.md` |

### Required Files

| File | Purpose |
| ---- | ------- |
| `scripts/init_skill.py` | Initialize new skill structure |
| `scripts/package_skill.py` | Validate and package skill |
| `assets/opencode/skill_md_template.md` | SKILL.md template |

### Validation: `phase_1_complete`

Run these prerequisite checks before continuing:

```bash
python3 --version && \
ls .opencode/skill/sk-doc/scripts/init_skill.py && \
ls .opencode/agent/orchestrate.md && \
echo "Prerequisites OK (including @general agent)"
```

**Checklist:**
- [ ] Python 3.10+ installed?
- [ ] sk-doc skill exists at `.opencode/skill/sk-doc/`?
- [ ] `init_skill.py` and `package_skill.py` accessible?
- [ ] @general agent exists at `.opencode/agent/orchestrate.md` (or any general agent)?

❌ **STOP if validation fails** - install all prerequisites before creating skills.

---

## 3. SETUP

### Initialize the Skill Folder

Use `init_skill.py` to scaffold the correct folder structure automatically:

```bash
python .opencode/skill/sk-doc/scripts/init_skill.py <skill-name> --path .opencode/skill
```

**Example:**

```bash
python .opencode/skill/sk-doc/scripts/init_skill.py my-flowchart-skill --path .opencode/skill
```

**Expected output:**

```text
Creating skill: my-flowchart-skill
Location: .opencode/skill/my-flowchart-skill/

Created:
  OK SKILL.md (template)
  OK references/ (directory)
  OK scripts/ (directory)
  OK assets/ (directory)
```

**Resulting structure:**

```text
.opencode/skill/my-flowchart-skill/
|-- SKILL.md          # Main orchestrator (template stub)
|-- references/       # Detailed documentation
|-- scripts/          # Automation scripts
`-- assets/           # Templates and examples
```

### Manual Initialization (Alternative)

If `init_skill.py` is not available, create the structure manually:

```bash
mkdir -p .opencode/skill/my-skill/{references,scripts,assets}
touch .opencode/skill/my-skill/SKILL.md
```

Then copy the frontmatter stub from Section 7 into `SKILL.md` before editing.

### Quick Start (Full Flow in 5 Commands)

```bash
# Step 1: Initialize skill structure (~2 min)
python .opencode/skill/sk-doc/scripts/init_skill.py my-skill --path .opencode/skill

# Step 2: Edit SKILL.md with your content (~15 min)
# Required frontmatter: name (must match folder), description
# Required sections: WHEN TO USE, HOW IT WORKS (or HOW TO USE), RULES

# Step 3: Add bundled resources as needed (~5 min)
# scripts/ -> automation, references/ -> documentation, assets/ -> templates

# Step 4: Validate (~1 min)
python .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill --check

# Step 5: Full package and restart OpenCode
python .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill
```

**Result:** Skill auto-discovered by OpenCode v1.0.190+ as `skills_my_skill()` function.

### Validation: `phase_2_complete`

```bash
ls .opencode/skill/my-skill/SKILL.md && \
head -5 .opencode/skill/my-skill/SKILL.md && \
echo "Skill folder initialized"
```

**Checklist:**
- [ ] Skill folder exists at `.opencode/skill/<skill-name>/`?
- [ ] `SKILL.md` file is present?
- [ ] Subdirectories (`references/`, `scripts/`, `assets/`) created?

❌ **STOP if validation fails** - re-run `init_skill.py` or create the folder structure manually before proceeding.

---

## 4. CONFIGURATION

### Editing Order

Edit files in this order to build up the skill progressively:

1. **SKILL.md** - Main orchestrator (required)
2. **scripts/** - Automation if needed
3. **references/** - Deep documentation if needed
4. **assets/** - Templates and examples if needed

### Step 1: Understanding (~5 min)

Define the skill's purpose with concrete examples before writing a single line.

**Questions to answer:**

| Question | Purpose |
| -------- | ------- |
| What problem does this skill solve? | Core value |
| When would an AI agent need this? | Trigger conditions |
| What are 2-3 specific use cases? | Grounds in reality |
| What distinguishes this from existing skills? | Prevents duplication |

**Example definition:**

```markdown
Purpose: Help users create ASCII flowcharts for documentation

Use Cases:
1. "Create a flowchart for user authentication flow"
2. "Visualize this decision tree as ASCII art"
3. "Draw the data flow diagram for the payment system"

Triggers: "flowchart", "diagram", "visualize", "ASCII art"
```

### Step 2: Planning (~5 min)

Identify what resources the skill needs before initializing.

**Resource decision matrix:**

| Need | Resource Type | When to Include |
| ---- | ------------- | --------------- |
| Automation | `scripts/` | Repetitive tasks, validation, scaffolding |
| Deep docs | `references/` | Content over 500 words, API details |
| Templates | `assets/` | Reusable patterns, examples |
| Data files | `assets/` | Static data, configurations |

**Planning checklist:**
- [ ] Does the skill need automation scripts?
- [ ] Does the skill need detailed documentation (over 500 words)?
- [ ] Does the skill need templates or examples?
- [ ] What tools will the skill use? (Read, Write, Edit, Bash, Glob, Grep, Task, WebFetch)

### Step 3: Initializing (~2 min)

Run `init_skill.py` as shown in Section 3. Do not proceed to editing until the folder structure exists and `phase_2_complete` passes.

### Step 4: Editing the SKILL.md (~10-15 min)

**SKILL.md editing checklist:**

**Frontmatter (required):**
- [ ] `name` - hyphen-case, matches folder name exactly
- [ ] `description` - single-line, no `<>` characters

**Frontmatter (recommended):**
- [ ] `allowed-tools` - array format `[Read, Write, Edit]`
- [ ] `version` - semantic versioning

**Required sections:**
- [ ] WHEN TO USE - trigger conditions and use cases
- [ ] HOW IT WORKS or HOW TO USE - step-by-step execution patterns
- [ ] RULES with subsections: ALWAYS, NEVER, ESCALATE IF

**Recommended sections:**
- [ ] SMART ROUTING - resource router tables
- [ ] SUCCESS CRITERIA - completion checklists
- [ ] INTEGRATION POINTS - related skills

See Section 7 (Features) for the canonical SKILL.md template.

### Step 5: Bundled Resources

**scripts/ - Automation**

Purpose: Scripts for repetitive or complex tasks that the AI should delegate rather than reimplement each time.

Naming: `snake_case`, extensions `.py`, `.sh`, `.bash`, `.js`

**Python script template:**

```python
#!/usr/bin/env python3
"""Brief description of what this script does.

Usage:
    python script_name.py <arg1> [--option]
"""

import argparse

def main():
    parser = argparse.ArgumentParser(description="Script description")
    parser.add_argument("input", help="Input description")
    args = parser.parse_args()

    # Implementation
    print(f"Processing: {args.input}")

if __name__ == "__main__":
    main()
```

**references/ - Deep Documentation**

Purpose: Detailed documentation that does not fit in SKILL.md (over 500 words, API specs, detailed guides).

Naming: `snake_case`, `.md` files only

Folder organization: Keep FLAT (no subfolders recommended). Simpler navigation and easier AI agent discovery.

Best practices:
- Move content exceeding 500 words to `references/`
- Include grep search patterns in SKILL.md for large reference files
- Avoid duplication between SKILL.md and references

**assets/ - Templates and Examples**

Purpose: Templates, examples, and data files used in skill output.

Naming: `snake_case`

Folder organization: Subfolders ALLOWED when organizing many files by category (e.g., `assets/opencode/`, `assets/documentation/`)

Best practices:
- Use `[PLACEHOLDER]` format for replaceable content
- Include usage instructions inside template files

**Referencing resources in SKILL.md:**

```markdown
## SMART ROUTING

| Resource       | Path                                | Purpose            |
| -------------- | ----------------------------------- | ------------------ |
| Detailed Guide | [guide.md](./references/guide.md)   | Full documentation |
| Template       | [template.md](./assets/template.md) | Starting point     |
| Script         | `scripts/main.py`                   | Automation         |
```

### Step 6: Packaging (~2 min)

Run validation before declaring the skill ready:

```bash
# Quick validation (check mode only)
python .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill --check

# Full packaging and validation
python .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill
```

**Expected success output:**

```text
Validating skill: my-skill

Checks:
  OK YAML frontmatter valid
  OK Required fields present (name, description)
  OK Name matches folder (hyphen-case)
  OK Description is single-line, no <> characters
  OK Required sections present (WHEN TO USE, HOW IT WORKS/HOW TO USE, RULES)
  OK RULES section has ALWAYS/NEVER/ESCALATE subsections
  OK Word count under 5k (current: 2,341)

Validation: PASSED
DQI Score: 82/100 (Good)
```

**Expected failure output:**

```text
Validating skill: my-skill

Checks:
  OK YAML frontmatter valid
  FAIL Name not hyphen-case or doesn't match folder
  FAIL Missing required section: HOW IT WORKS

Validation: FAILED
Fix the errors above and re-run validation.
```

### Validation: `phase_3_complete`

```bash
python3 .opencode/skill/sk-doc/scripts/package_skill.py \
  .opencode/skill/my-skill --check && \
echo "SKILL.md populated and frontmatter valid"
```

**Checklist:**
- [ ] `name` field in frontmatter is hyphen-case and matches folder name?
- [ ] `description` is single-line with no `<>` characters?
- [ ] WHEN TO USE section present?
- [ ] HOW IT WORKS or HOW TO USE section present?
- [ ] RULES section present with ALWAYS/NEVER/ESCALATE IF subsections?

❌ **STOP if validation fails** - fix all frontmatter and section errors reported by `package_skill.py` before running full validation.

---

## 5. VERIFICATION

### Validation Commands

| Command | Purpose | When to Use |
| ------- | ------- | ----------- |
| `package_skill.py --check` | Validation only | During development |
| `package_skill.py` | Full validation and packaging | Before distribution |
| `extract_structure.py` | DQI scoring | Quality assessment |

### DQI Score Interpretation

| Score | Rating | Action |
| ----- | ------ | ------ |
| 90-100 | Excellent | Production ready |
| 75-89 | Good | Minor improvements |
| 60-74 | Fair | Needs work |
| under 60 | Poor | Significant revision needed |

**Target: DQI >= 75 (Good). Target for production: DQI >= 90 (Excellent)**

### Test Matrix

| Test | Command / Action | Expected Result |
| ---- | ---------------- | --------------- |
| Frontmatter valid | `head -10 SKILL.md` | Valid YAML with `---` delimiters |
| Name matches folder | `grep "^name:" SKILL.md` | Matches folder name exactly |
| Skill discoverable | Restart OpenCode | `skills_my_skill` in available tools |
| Triggers correctly | Request matching description | Skill invokes |
| Resources accessible | Follow SMART ROUTING links | All paths resolve |

### Validation: `phase_4_complete`

```bash
python3 .opencode/skill/sk-doc/scripts/package_skill.py \
  .opencode/skill/my-skill && \
python3 .opencode/skill/sk-doc/scripts/extract_structure.py \
  .opencode/skill/my-skill/SKILL.md && \
echo "Validation and DQI check complete"
```

**Checklist:**
- [ ] `package_skill.py` exits with "Validation: PASSED"?
- [ ] DQI score is 75 or higher?
- [ ] All YAML frontmatter checks pass?
- [ ] All required sections present?
- [ ] All resource paths resolve?

❌ **STOP if validation fails** - fix errors reported by `package_skill.py` and re-run. Do not restart OpenCode until validation passes.

### Check: Verify Skill Is Discoverable

```bash
# After restarting OpenCode, verify the skill appears
# 1. Restart OpenCode

# 2. Check frontmatter name matches folder
grep "^name:" .opencode/skill/my-skill/SKILL.md

# 3. Confirm skill folder name
ls -d .opencode/skill/my-skill
```

### Validation: `phase_5_complete`

```text
No shell command required. Verify through your AI client directly.
Restart OpenCode, then confirm skills_my_skill appears in available tools.
```

**Checklist:**
- [ ] OpenCode restarted after skill creation?
- [ ] `skills_my_skill` (with correct name) appears in available tools?
- [ ] Skill invokes when a request matches its description?
- [ ] Bundled resources load without "file not found" errors?

❌ **STOP if validation fails** - check the skill name in frontmatter (must match folder exactly), verify frontmatter YAML is valid, and confirm no `<>` characters in description.

---

## 6. USAGE

### Iterate and Publish Workflow

After the skill passes all 5 phase checkpoints, continue with this iteration cycle:

1. **Restart OpenCode** - Required for discovery rescan after any SKILL.md change
2. **Verify skill appears** - Check for `skills_my_skill` in available tools
3. **Try each use case** - Test with real requests matching your defined triggers
4. **Document issues** - Note what was unclear, missing, or incorrect
5. **Refine and re-validate** - Fix issues and run `package_skill.py` again
6. **Repeat** until all use cases produce expected results

### Iteration Checklist

- [ ] Skill invokes correctly (native discovery or Read tool)
- [ ] Skill triggers on expected keywords
- [ ] Instructions are clear and actionable
- [ ] Scripts execute without errors
- [ ] Resources are accessible and helpful
- [ ] Use cases produce expected results

### Discovery Mechanics

OpenCode has built-in skill discovery - no plugin required. Skills are auto-discovered from `.opencode/skill/*/SKILL.md` frontmatter.

**Discovery process:**

```text
Step 1: STARTUP SCAN
    |-> OpenCode scans .opencode/skill/*/SKILL.md
            |
Step 2: FRONTMATTER PARSING
    |-> Extract name, description, allowed-tools from YAML
            |
Step 3: FUNCTION REGISTRATION
    |-> Register as skills_<name> function
    |-> Hyphens become underscores (my-skill -> skills_my_skill)
            |
Step 4: AVAILABILITY
    |-> Skill accessible via:
        - Direct call: skills_my_skill()
        - Read tool: Read(".opencode/skill/my-skill/SKILL.md")
        - Natural language matching description
```

**Discovery requirements:**

| Requirement | Details | Failure Mode |
| ----------- | ------- | ------------ |
| Valid YAML frontmatter | Opening and closing `---` | Skill not found |
| `name` field present | Must match folder name exactly | Skill not found |
| `description` field | Single line, no `<>` characters | Parse error |
| `allowed-tools` array (recommended) | Bracket format `[Read, Write]` | Validation warning (non-blocking) |

**Function naming examples:**

```text
Folder: .opencode/skill/mcp-code-mode/
    -> Function: skills_mcp_code_mode()

Folder: .opencode/skill/system-spec-kit/
    -> Function: skills_system_spec_kit()

Folder: .opencode/skill/my-custom-skill/
    -> Function: skills_my_custom_skill()
```

### When to Invoke a Skill

The AI agent invokes a skill through Gate 2 (skill routing) when:
- A task description matches the skill's `description` field
- A user references the skill by name or capability
- The `skill_advisor.py` recommends the skill with confidence >= 0.8

Skills can also be invoked directly with `Read(".opencode/skill/my-skill/SKILL.md")` when the agent needs to load instructions explicitly.

---

## 7. FEATURES

### SKILL.md Canonical Template

> **CRITICAL:** The `name` field in frontmatter MUST match the folder name exactly (case-sensitive, hyphen-case). This is the number one cause of discovery failures.

```yaml
---
name: my-skill-name
description: "Brief description without special characters. Use when X. Provides Y."
version: 1.0.0
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Skill Title - Clear Purpose Statement

Brief overview paragraph explaining what this skill does and why it exists.

---

## WHEN TO USE

Trigger conditions and use cases:
- "User asks for X..."
- "When task involves Y..."
- Keywords: term1, term2, term3

---

## HOW IT WORKS

Step-by-step execution patterns:

1. First step
2. Second step
3. Third step

---

## RULES

### ALWAYS
- Rule 1
- Rule 2

### NEVER
- Rule 1
- Rule 2

### ESCALATE IF
- Condition 1
- Condition 2

---

## SMART ROUTING

| Resource | Path                              | Purpose       |
| -------- | --------------------------------- | ------------- |
| Guide    | [guide.md](./references/guide.md) | Detailed docs |
| Script   | `scripts/main.py`                 | Automation    |

---

## SUCCESS CRITERIA

- [ ] Criterion 1
- [ ] Criterion 2
```

### Detailed Section Reference

**Required sections (must have):**

| Section | Required Content |
| ------- | ---------------- |
| WHEN TO USE | Trigger conditions and use cases |
| HOW IT WORKS or HOW TO USE | Step-by-step execution patterns (either heading accepted) |
| RULES | Must have ALWAYS, NEVER, ESCALATE IF subsections |

**Recommended sections:**

| Section | Purpose |
| ------- | ------- |
| SMART ROUTING | Resource router tables and file references |
| SUCCESS CRITERIA | Completion checklists and verification steps |
| INTEGRATION POINTS | Related skills and tools |

### Frontmatter Field Reference

| Field | Required | Format | Notes |
| ----- | -------- | ------ | ----- |
| `name` | Yes | `hyphen-case` | Must match folder name exactly |
| `description` | Yes | Single line | No `<>` characters, no multi-line |
| `allowed-tools` | Recommended | Array | Valid: Read, Write, Edit, Bash, Glob, Grep, Task, WebFetch |
| `version` | Recommended | Semver | e.g., `1.0.0`, `2.1.3` |
| `triggers` | Optional | Array | Keywords that activate the skill |

### Size Constraints

| Location | Limit | Recommendation |
| -------- | ----- | -------------- |
| Description | Single line | Keep concise for skill routing |
| SKILL.md total | Max 5,000 words | 3,000 words recommended |
| Line count | Max 3,000 lines | Move excess to `references/` |

---

## 8. EXAMPLES

### Example 1: Minimal Skill (Complete)

A simple skill with no bundled resources. Use this as the starting point for low-complexity skills.

**Folder structure:**

```text
.opencode/skill/greeting-formatter/
`-- SKILL.md
```

**SKILL.md:**

```yaml
---
name: greeting-formatter
description: "Format greetings for different contexts. Use when creating welcome messages, email salutations, or chat introductions."
allowed-tools: [Read, Write, Edit]
version: 1.0.0
---

# Greeting Formatter - Context-Aware Salutations

Format greetings appropriately for emails, chat, formal documents, and casual conversations.

---

## WHEN TO USE

- "Write a greeting for..."
- "How should I start this email..."
- "Create a welcome message..."

Keywords: greeting, salutation, welcome, email opening

---

## HOW IT WORKS

1. Identify the context (email, chat, formal, casual)
2. Determine the audience (colleague, client, friend)
3. Select appropriate formality level
4. Generate greeting with proper formatting

---

## RULES

### ALWAYS
- Match formality to context
- Use appropriate cultural conventions

### NEVER
- Mix formal and casual in same greeting
- Use gendered assumptions without context

### ESCALATE IF
- Unsure about cultural appropriateness
- Multiple conflicting contexts

---

## SUCCESS CRITERIA

- [ ] Greeting matches requested context
- [ ] Tone is appropriate for audience
```

### Example 2: Skill Creation Walkthrough

A complete walkthrough creating a fictional `code-reviewer` skill from scratch.

**Step 1 - Define the skill:**

```text
Purpose: Automated code review assistance
Triggers: "review this", "check my code", "code quality"
Tools needed: Read, Grep, Glob
Resources: references/review_checklist.md
```

**Step 2 - Initialize:**

```bash
python .opencode/skill/sk-doc/scripts/init_skill.py code-reviewer \
  --path .opencode/skill
```

**Step 3 - Edit SKILL.md frontmatter:**

```yaml
---
name: code-reviewer
description: "Automated code review. Use when reviewing pull requests, checking code quality, or auditing style compliance."
version: 1.0.0
allowed-tools:
  - Read
  - Grep
  - Glob
---
```

**Step 4 - Validate:**

```bash
python .opencode/skill/sk-doc/scripts/package_skill.py \
  .opencode/skill/code-reviewer --check
```

**Step 5 - Add reference file:**

```bash
# Create reference file for detailed checklist
touch .opencode/skill/code-reviewer/references/review_checklist.md
```

**Step 6 - Add SMART ROUTING to SKILL.md:**

```markdown
## SMART ROUTING

| Resource | Path | Purpose |
| -------- | ---- | ------- |
| Checklist | [review_checklist.md](./references/review_checklist.md) | Detailed review criteria |
```

### Production Examples

For comprehensive real-world examples, examine these production skills:

| Skill | Path | Highlights |
| ----- | ---- | ---------- |
| **mcp-code-mode** | `.opencode/skill/mcp-code-mode/SKILL.md` | MCP orchestration, external tool integration, SMART ROUTING |
| **system-spec-kit** | `.opencode/skill/system-spec-kit/SKILL.md` | Complex skill with multiple references, checkpoint system, context preservation |

**To examine:**

```bash
head -100 .opencode/skill/mcp-code-mode/SKILL.md
head -100 .opencode/skill/system-spec-kit/SKILL.md
```

---

## 9. TROUBLESHOOTING

### Skill Not Found / Not Appearing in Tools

**Error:** Skill does not appear as `skills_<name>` after restarting OpenCode.

**Cause:** The `name` field in frontmatter does not match the folder name, or YAML frontmatter is invalid, or OpenCode was not restarted.

**Fix:**

```bash
# Check the name in frontmatter
grep "^name:" .opencode/skill/my-skill/SKILL.md

# Check the folder name
ls -d .opencode/skill/my-skill

# The two values must match exactly (case-sensitive)
# Then restart OpenCode to trigger a rescan
```

Common causes and fixes:

| Cause | Fix |
| ----- | --- |
| Name does not match folder | Ensure `name:` field exactly matches folder name (case-sensitive) |
| Invalid YAML frontmatter | Check `---` delimiters, use spaces not tabs |
| OpenCode not restarted | Restart OpenCode to trigger discovery scan |
| Description has `<>` chars | Remove angle brackets from description |

---

### YAML Frontmatter Invalid

**Error:** `package_skill.py` reports "YAML frontmatter invalid" or "Missing required fields".

**Cause:** Missing `---` delimiters, tabs instead of spaces, or unquoted special characters in the description.

**Fix:**

```yaml
# Invalid - unquoted inner quotes, tabs for indentation
---
name: my-skill
description: Use when "things" happen
allowed-tools:
	- Read
---

# Valid - quoted description, spaces for indentation
---
name: my-skill
description: "Use when things happen. Provides X."
allowed-tools:
  - Read
  - Write
---
```

---

### Missing Required Section

**Error:** `package_skill.py` reports "Missing required section: HOW IT WORKS" or similar.

**Cause:** One or more of the three required sections (WHEN TO USE, HOW IT WORKS / HOW TO USE, RULES) is absent or uses an incorrect heading.

**Fix:**

```markdown
## WHEN TO USE

- Trigger condition 1
- Trigger condition 2

---

## HOW IT WORKS

1. Step one
2. Step two

---

## RULES

### ALWAYS
- Rule

### NEVER
- Rule

### ESCALATE IF
- Condition
```

Note: "HOW IT WORKS" and "HOW TO USE" are both accepted. Any other heading variant will fail validation.

---

### Description Invalid

**Error:** `package_skill.py` reports "Description invalid" or "Description contains special characters".

**Cause:** Description contains `<>` angle brackets, or is formatted as multi-line YAML.

**Fix:**

```yaml
# Invalid - angle brackets present
description: "Use when <condition> occurs"

# Invalid - multi-line format
description: |
  Multi-line description

# Valid - single line, no angle brackets
description: "Use when generating reports. Provides automated analysis."
```

---

### Skill Not Triggering

**Error:** Skill is discoverable but the AI does not invoke it for relevant requests.

**Cause:** Description is too generic and does not contain the keywords the AI matches against, or trigger conditions in WHEN TO USE are too vague.

**Fix:**

```yaml
# Before - too generic
description: "Creates visual representations of processes."

# After - specific keywords and trigger context
description: "Create ASCII flowcharts and diagrams. Use when visualizing workflows, decision trees, or process flows."
```

Also improve the WHEN TO USE section with explicit trigger phrases and keyword lists.

---

### Resource Not Found

**Error:** AI reports a file path from SMART ROUTING cannot be found, or `package_skill.py` warns about unresolvable links.

**Cause:** Path uses incorrect format (missing `./` prefix) or the file was not created.

**Fix:**

```markdown
<!-- Invalid - missing ./ prefix -->
[guide](references/guide.md)

<!-- Valid - relative path with ./ prefix -->
[guide](./references/guide.md)
```

Verify the file exists:

```bash
ls .opencode/skill/my-skill/references/guide.md
```

---

### DQI Score Too Low

**Error:** `extract_structure.py` returns a DQI score below 75.

**Cause:** Thin content in sections, missing RULES subsections, no examples, or header formatting issues.

**Fix - run diagnostics first:**

```bash
python .opencode/skill/sk-doc/scripts/extract_structure.py \
  .opencode/skill/my-skill/SKILL.md
```

Common fixes based on diagnostic output:
- Add substantive content to thin sections (under 50 words each)
- Ensure all three RULES subsections (ALWAYS/NEVER/ESCALATE IF) are present
- Add concrete examples to HOW IT WORKS
- Fix any H2/H3 header formatting issues
- Populate SUCCESS CRITERIA with at least 2 checkable items

---

## 10. RESOURCES

### File Locations

| Path | Purpose |
| ---- | ------- |
| `.opencode/skill/` | Skills directory |
| `.opencode/skill/sk-doc/scripts/init_skill.py` | Initialize skill |
| `.opencode/skill/sk-doc/scripts/package_skill.py` | Validate and package |
| `.opencode/skill/sk-doc/scripts/extract_structure.py` | DQI scoring |
| `.opencode/skill/sk-doc/assets/opencode/skill_md_template.md` | SKILL.md template |
| `.opencode/agent/orchestrate.md` (or any general agent) | general agent definition (orchestrate is a good baseline) |

### Scripts Reference

```bash
# Initialize new skill
python .opencode/skill/sk-doc/scripts/init_skill.py \
  <skill-name> --path .opencode/skill

# Validation only (check mode)
python .opencode/skill/sk-doc/scripts/package_skill.py \
  <skill-path> --check

# Full packaging and validation
python .opencode/skill/sk-doc/scripts/package_skill.py \
  <skill-path>

# DQI scoring
python .opencode/skill/sk-doc/scripts/extract_structure.py \
  <skill-path>/SKILL.md
```

### Related Guides

| Guide | Purpose |
| ----- | ------- |
| [SET-UP - AGENTS.md](./SET-UP%20-%20AGENTS.md) | Add skills to agent config |
| [Master Installation Guide](./README.md) | OpenCode setup overview |
| [@general Agent](../../agent/orchestrate.md) | General agent (Mode 2: Skill Creation) |

### External Resources

| Resource | URL |
| -------- | --- |
| OpenCode Documentation | https://opencode.ai/docs |
| OpenCode Skills Docs | https://opencode.ai/docs/skills |

### Validation Checkpoints Summary

| Checkpoint | Meaning |
| ---------- | ------- |
| `phase_1_complete` | Python 3.10+, sk-doc skill, and @general agent are all present |
| `phase_2_complete` | Skill folder initialized with SKILL.md stub and subdirectories |
| `phase_3_complete` | SKILL.md populated with valid frontmatter and all required sections |
| `phase_4_complete` | `package_skill.py` passes and DQI score is 75 or higher |
| `phase_5_complete` | Skill is discoverable in OpenCode and invocable via Gate 2 |

### Final Checklist

- [ ] **Step 1:** Purpose and use cases defined
- [ ] **Step 2:** Resource plan documented (scripts/references/assets needed)
- [ ] **Step 3:** Skill structure initialized with `init_skill.py`
- [ ] **Step 4:** SKILL.md populated:
  - [ ] Frontmatter (required): name (matches folder), description (single-line, no `<>`)
  - [ ] Frontmatter (recommended): allowed-tools, version
  - [ ] Required sections: WHEN TO USE, HOW IT WORKS (or HOW TO USE), RULES
  - [ ] RULES subsections: ALWAYS, NEVER, ESCALATE IF
- [ ] **Step 5:** Validation passed (`package_skill.py --check`)
- [ ] **Step 6:** Tested with real use cases, skill triggers correctly
- [ ] **Optional:** DQI score >= 75 (Good) verified with `extract_structure.py`

---

Your skill is now ready. OpenCode v1.0.190+ will auto-discover it from `.opencode/skill/*/SKILL.md` frontmatter. Skills appear as `skills_*` functions in available tools after each restart.
