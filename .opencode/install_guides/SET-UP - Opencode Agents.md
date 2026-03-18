# Opencode Agents - Primary and Sub-agents

Complete setup and configuration guide for OpenCode agents, covering both primary agents (main assistants cycled via Tab key) and sub-agents (specialized assistants invoked via @ mention or automatically by primary agents). Includes built-in agents (Build, Plan, General, Explore), custom agent creation with YAML frontmatter, tool permissions, behavioral rules, and the distinction between agents (authority + tools) and skills (knowledge + workflows). Follow the phase-based approach to verify each step before continuing.

> **Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.
> **Scope**: `.opencode/agent/`

---

## TABLE OF CONTENTS

- [0. AI-FIRST SETUP GUIDE](#0-ai-first-setup-guide)
- [1. OVERVIEW](#1-overview)
- [2. PREREQUISITES](#2-prerequisites)
- [3. SETUP](#3-setup)
- [4. CONFIGURATION](#4-configuration)
- [5. VERIFICATION](#5-verification)
- [6. USAGE](#6-usage)
- [7. FEATURES](#7-features)
- [8. EXAMPLES](#8-examples)
- [9. TROUBLESHOOTING](#9-troubleshooting)
- [10. RESOURCES](#10-resources)

---

## 0. AI-FIRST SETUP GUIDE

### HARD BLOCK: Write Agent Required

> **CRITICAL:** Agent creation REQUIRES the `@write` agent to be active.

**Why @write is mandatory:**
- Loads `agent_template.md` BEFORE creating (template-first workflow)
- Validates frontmatter format (YAML syntax, required fields)
- Ensures proper tool permissions and behavioral rules
- Invokes `sk-doc` skill for documentation standards
- Validates template alignment AFTER creating

**Template Location:** `.opencode/skill/sk-doc/assets/agents/agent_template.md`

**Verification (MUST pass before proceeding):**
- [ ] Write agent exists: `ls .opencode/agent/write.md`
- [ ] Agent template exists: `ls .opencode/skill/sk-doc/assets/agents/agent_template.md`
- [ ] Use `@write` prefix when invoking the prompt below

**DO NOT** create agents without the @write agent. Manual creation bypasses quality gates and frontmatter validation.

**Reference:** `.opencode/agent/write.md` - Documentation creation standards

---

**Copy and paste this prompt for interactive agent creation:**

```text
@write I want to create a new agent for OpenCode. Please guide me through the process interactively by asking me questions one at a time.

**PREREQUISITE CHECK (you MUST verify before proceeding):**
- [ ] You are operating as the @write agent
- [ ] sk-doc skill is accessible

If you are NOT the @write agent: STOP immediately and instruct the user to restart with the "@write" prefix. Do NOT proceed with agent creation.

**Questions to ask me (one at a time, wait for my answer):**

1. **Purpose**: What is the agent's purpose? What specific role will it fill?
   (e.g., "Code review specialist", "Security auditor", "Test automation")

2. **Authority**: What is this agent responsible for? What decisions can it make?
   (e.g., "Approve/reject code changes", "Flag security issues", "Generate test cases")

3. **Tool Permissions**: What tools will the agent need access to?
   - read: Examine files
   - write: Create files
   - edit: Modify files
   - bash: Run commands
   - grep: Search content
   - glob: Find files
   - webfetch: Fetch URLs
   - memory: Spec Kit Memory
   - chrome_devtools: Browser debugging
   - task: Delegate to sub-agents (orchestrator only)

4. **Behavioral Rules**: What should this agent ALWAYS do? NEVER do?
   (e.g., "ALWAYS run tests before approving", "NEVER modify production files")

5. **Skills Integration**: What skills should this agent invoke?
   (e.g., "sk-code--web for code standards", "system-spec-kit for documentation")

6. **Agent Name**: What should we name this agent?
   (Format: lowercase, single word or hyphenated, e.g., "review", "security-audit")

**After gathering my answers, please:**

1. Create the agent file at `.opencode/agent/<agent-name>.md`
2. Generate proper YAML frontmatter with:
   - name, description, mode, temperature
   - tools (true/false for each)
   - permission (allow/deny for actions)
3. Create the agent body with:
   - Core workflow section
   - Domain-specific sections
   - Anti-patterns section
   - Related resources section
4. Validate the frontmatter syntax
5. Help me test the agent with a real example
6. Iterate and refine based on testing

My project is at: [your project path]
```

**What the AI will do:**
- Ask questions one at a time to understand your agent requirements
- Create the agent file with proper frontmatter structure
- Generate behavioral rules based on your answers
- Set appropriate tool permissions
- Guide you through testing with real examples

**Expected creation time:** 15-25 minutes

---

## 1. OVERVIEW

Agents are the execution layer of the OpenCode system. Each agent is a specialized persona with specific capabilities, tool access, and behavioral constraints. Unlike skills (which provide knowledge and workflows), agents have **authority** to act and **tools** to execute.

### Core Principle

> **Create once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### What Are Agents?

Agents are specialized AI personas defined in markdown files with YAML frontmatter. Each agent has:

- **Identity**: Name and description
- **Authority**: What they are responsible for
- **Tools**: Which tools they can use (read, write, bash, etc.)
- **Permissions**: What actions are allowed or denied
- **Behavior**: Rules and workflows they follow

Think of agents as **roles** with specific job descriptions, while skills are **knowledge bases** they can consult.

### Agent Types

OpenCode has **two types** of agents:

| Type         | Description                                                                       | Invocation                                          |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Primary**  | Main assistants you interact with directly. Handle main conversation.             | **Tab** key to cycle, or configured keybind         |
| **Subagent** | Specialized assistants for specific tasks. Invoked by primary agents or manually. | **@ mention** (e.g., `@general`) or automatic      |

**Primary agents** are cycled through using the **Tab** key during a session. They have full access to configured tools and handle your main conversation.

**Subagents** are specialized assistants that:
- Can be invoked **automatically** by primary agents based on their descriptions
- Can be invoked **manually** by @ mentioning them (e.g., `@general help me search`)
- Create child sessions that you can navigate using `<Leader>+Right/Left`

### How Agents Work

```
User Request
    |
    v
+---------------------------------------------------------------+
|                     AGENT SELECTION                           |
+---------------------------------------------------------------+
|  PRIMARY AGENTS (Tab to cycle):                               |
|  +-> Build: Full development with all tools                   |
|  +-> Plan: Analysis without making changes                    |
|                                                               |
|  SUBAGENTS (@ mention or automatic):                          |
|  +-> @general: Research, search, multi-step tasks             |
|  +-> @explore: Fast codebase exploration                      |
|       (prefer @context for structured output)                 |
|                                                               |
|  CUSTOM AGENTS:                                               |
|  +-> @context: Context retrieval, analysis, exploration       |
|  +-> @orchestrate: Task decomposition and delegation          |
|  +-> @write: Documentation with template enforcement          |
|  +-> @deep-research: Autonomous iterative research loop       |
|  +-> @review: Code quality and security assessment            |
|  +-> @speckit: Spec folder documentation (Level 1-3+)         |
|  +-> @handover: Session continuation and context preservation |
|  +-> @debug: Fresh perspective debugging (4-phase method)     |
+---------------------------------------------------------------+
    |
    v
Agent Executes (using permitted tools + invoking skills/subagents)
    |
    v
Response Delivered
```

---

## 2. PREREQUISITES

**Phase 1** confirms that OpenCode is installed and the agent directory is in place before you create or configure any agents.

### Required Software

1. **OpenCode** (v1.1.1 or later)
   ```bash
   opencode --version
   # Should show v1.1.1 or higher
   ```

2. **Agent directory** exists in your project
   ```bash
   ls .opencode/agent/
   # Should list existing agent .md files
   ```

### Actions

1. **Install OpenCode** if not already present, following the [Master Installation Guide](./README.md).

2. **Create the agent directory** if it does not exist:
   ```bash
   mkdir -p .opencode/agent
   ```

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
opencode --version           # -> v1.1.1 or higher
ls -d .opencode/agent        # -> .opencode/agent
```

**Checklist:**
- [ ] `opencode --version` returns v1.1.1 or higher?
- [ ] `.opencode/agent/` directory exists?

❌ **STOP if validation fails** - Install or update OpenCode and create the agent directory before continuing.

---

## 3. SETUP

This section covers **Phase 2**: creating an agent file with valid YAML frontmatter.

### Step 1: Choose Your Creation Method

**Option A: Interactive Prompt with @write Agent (Recommended)**

Use the AI-First prompt from section 0. Invoke it via:

```bash
# Inside an OpenCode session, type:
@write /create:agent my-agent
```

The @write agent will:
1. Verify the template exists before creating
2. Ask you about purpose, tools, rules, and name
3. Generate the agent file with validated frontmatter
4. Confirm template alignment after creation

**Option B: OpenCode CLI**

```bash
# Use OpenCode's built-in agent creation wizard
opencode agent create
```

This CLI command will:
1. Ask where to save the agent (global or project-specific)
2. Ask for a description of what the agent should do
3. Generate an appropriate system prompt and identifier
4. Let you select which tools the agent can access
5. Create a markdown file with the agent configuration

**Option C: Manual Creation**

```bash
# Create the file manually
touch .opencode/agent/my-agent.md
```

Then add frontmatter and content as shown in Steps 2-3 below.

### Step 2: Add YAML Frontmatter

Every agent file MUST have YAML frontmatter at the top:

```yaml
---
name: my-agent
description: One-line description of what this agent does
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  external_directory: allow
---
```

**Mode Selection Guide:**

| Choose `mode`   | When...                                                        |
| --------------- | -------------------------------------------------------------- |
| `primary`       | Agent should appear in Tab cycle as main assistant             |
| `subagent`      | Agent should only be invoked via @ mention or by other agents  |
| `all` (default) | Agent can be used both ways                                    |

> **Note:** The separate `tools:` object is deprecated as of OpenCode v1.1.1. Use the unified `permission:` object with `allow`/`deny`/`ask` values instead.

### Step 3: Add Agent Body Content

```markdown
# My Agent Title

Brief description of this agent's purpose and authority.

---

## 1. CORE WORKFLOW

1. **STEP 1** -> Description
2. **STEP 2** -> Description
3. **STEP 3** -> Description

---

## 2. [DOMAIN SECTION]

### Subsection

Content here...

---

## 3. ANTI-PATTERNS

**Never do X**
- Reason

**Never do Y**
- Reason

---

## 4. RELATED RESOURCES

- [Skill Name](../skill/skill-name/SKILL.md)
- [Template](../skill/sk-doc/assets/agents/agent_template.md)
```

### Validation: `phase_2_complete`

```bash
# Verify the agent file was created with frontmatter:
ls .opencode/agent/my-agent.md                     # -> file exists
head -20 .opencode/agent/my-agent.md               # -> shows --- frontmatter block
python3 -c "
import yaml, sys
content = open('.opencode/agent/my-agent.md').read()
parts = content.split('---')
if len(parts) >= 3:
    data = yaml.safe_load(parts[1])
    required = ['name', 'description']
    missing = [k for k in required if k not in data]
    print('VALID' if not missing else f'MISSING: {missing}')
else:
    print('NO FRONTMATTER FOUND')
"
# -> VALID
```

**Checklist:**
- [ ] Agent `.md` file created in `.opencode/agent/`?
- [ ] File contains `---` YAML frontmatter block?
- [ ] `name` field present in frontmatter?
- [ ] `description` field present in frontmatter?
- [ ] Python YAML check returns `VALID`?

❌ **STOP if validation fails** - Fix the frontmatter syntax before continuing. Check for missing required fields or YAML indentation errors.

---

## 4. CONFIGURATION

**Phase 3** covers configuring tool permissions and behavioral rules for your agent.

### Tool Permissions

The `permission:` block controls which tools the agent can use:

```yaml
permission:
  read: allow            # Read files
  write: allow           # Create files
  edit: allow            # Modify files
  bash: allow            # Execute commands
  grep: allow            # Search content
  glob: allow            # Find files
  webfetch: deny         # Fetch URLs (deny unless needed)
  memory: allow          # Spec Kit Memory
  chrome_devtools: deny  # Browser debugging (deny unless needed)
  external_directory: allow  # Access files outside project
```

**Permission Values:**

| Value   | Behavior                               |
| ------- | -------------------------------------- |
| `allow` | Automatically approve (no prompt)      |
| `deny`  | Automatically reject (blocked)         |
| `ask`   | Prompt the user for approval each time |

### Permission Reference

| Permission            | Purpose                           | Typical Setting       |
| --------------------- | --------------------------------- | --------------------- |
| `read`                | Read files                        | allow                 |
| `write`               | Create files                      | allow                 |
| `edit`                | Modify files                      | allow                 |
| `bash`                | Execute commands                  | allow (with caution)  |
| `grep`                | Search content                    | allow                 |
| `glob`                | Find files                        | allow                 |
| `webfetch`            | Fetch URLs                        | deny (unless needed)  |
| `memory`              | Spec Kit Memory                   | allow                 |
| `chrome_devtools`     | Browser debugging                 | deny (unless needed)  |
| `external_directory`  | Access files outside project      | allow                 |

### Behavioral Rules

Embed behavioral rules directly in the agent body using ALWAYS/NEVER patterns:

```markdown
## RULES

**ALWAYS:**
- Read files before editing them
- Verify syntax passes before claiming completion
- Ask for clarification when confidence is below 80%

**NEVER:**
- Modify files outside the stated scope
- Skip validation steps
- Fabricate information
```

### Allowed-Tools Field (Skills Format)

For agents that invoke skills, you can also specify `allowed-tools` in the body:

```markdown
**Allowed tools:** read, write, edit, bash, grep, glob, memory
```

### Validation: `phase_3_complete`

```bash
# Verify permission block is present and well-formed:
python3 -c "
import yaml
content = open('.opencode/agent/my-agent.md').read()
parts = content.split('---')
data = yaml.safe_load(parts[1])
perms = data.get('permission', {})
print('PERMISSIONS FOUND:', list(perms.keys()) if perms else 'NONE')
print('temperature:', data.get('temperature', 'NOT SET'))
print('mode:', data.get('mode', 'NOT SET'))
"
# -> PERMISSIONS FOUND: [read, write, edit, bash, ...]
```

**Checklist:**
- [ ] `permission:` block present in frontmatter?
- [ ] All required tool permissions set to `allow` or `deny`?
- [ ] `temperature` set (recommended: 0.1)?
- [ ] `mode` set (`primary`, `subagent`, or `all`)?
- [ ] Behavioral rules section present in agent body?

❌ **STOP if validation fails** - Add missing permission fields or fix the YAML indentation. Each permission key must be indented under `permission:`.

---

## 5. VERIFICATION

**Phase 4** verifies that the agent appears in the OpenCode agent picker. **Phase 5** confirms it responds correctly to a test prompt.

### Step 1: Restart OpenCode

```bash
# Restart your OpenCode session to pick up new agent files
opencode
```

### Step 2: Verify Agent Appears in Picker (Phase 4)

Press **Tab** to cycle primary agents, or type `@` followed by your agent name in the chat input. The agent should appear in the autocomplete list.

```bash
# Also verify from the command line:
ls -la .opencode/agent/my-agent.md
# -> -rw-r--r-- ... .opencode/agent/my-agent.md
```

### Validation: `phase_4_complete`

```bash
# Verify agent file is in place and readable:
ls .opencode/agent/my-agent.md     # -> file present
head -5 .opencode/agent/my-agent.md  # -> shows --- frontmatter
```

**Checklist:**
- [ ] Agent file present in `.opencode/agent/`?
- [ ] `@my-agent` appears in OpenCode's @ mention autocomplete?
- [ ] No YAML parse errors when OpenCode loads the file?

❌ **STOP if validation fails** - Check that the file is in `.opencode/agent/`, has valid YAML, and that OpenCode was restarted after creating the file.

### Step 3: Test Agent Response (Phase 5)

In an OpenCode session, invoke your agent with a simple test prompt:

```text
@my-agent What is your purpose and what tools do you have available?
```

Expected response: The agent should introduce itself, describe its purpose, and list the tools it is permitted to use.

### Validation: `phase_5_complete`

**Checklist:**
- [ ] Agent responds when invoked with `@my-agent`?
- [ ] Response matches the description in frontmatter?
- [ ] Agent does not attempt to use tools set to `deny`?
- [ ] Agent follows the behavioral rules defined in its body?

❌ **STOP if validation fails** - Review the agent description and behavioral rules. If the agent ignores its rules, lower the temperature to 0.1 and ensure rules use explicit ALWAYS/NEVER language.

---

## 6. USAGE

### When to Use Agents

Use agents when you need:
- **Specific tool permissions**: Different tasks need different access levels
- **Behavioral constraints**: Rules and workflows enforced per task type
- **Parallel delegation**: Orchestrating multiple specialized tasks
- **Domain authority**: An agent with responsibility for a specific domain

Use skills when you need:
- **Domain knowledge**: Standards, templates, and reference information
- **Workflow guidance**: Step-by-step processes without tool authority
- **Reusable expertise**: Capabilities shared across multiple agents

### Daily Workflow

```bash
# Start OpenCode - agents load automatically
opencode

# Switch between primary agents with Tab
# Tab -> Build (all tools, default development)
# Tab -> Plan (read-only, analysis mode)
# Tab -> Build (cycles back)

# Invoke subagents via @ mention
@context find all config files in this project
@deep-research investigate how authentication is implemented
@write create a README for the utils folder
@review check this function for security issues
```

### Session Navigation

When subagents create child sessions, navigate between them:

| Keybind          | Action                                  |
| ---------------- | --------------------------------------- |
| `<Leader>+Right` | Cycle forward: parent -> child1 -> child2  |
| `<Leader>+Left`  | Cycle backward: parent <- child1 <- child2 |

### Quick Agent Reference

| Agent          | Mode     | Invocation     | Best For                                    |
| -------------- | -------- | -------------- | ------------------------------------------- |
| Build          | Primary  | Tab (default)  | Standard development with full tool access  |
| Plan           | Primary  | Tab            | Analysis and planning without changes       |
| General        | Subagent | `@general`     | Research and multi-step tasks               |
| Explore        | Subagent | `@explore`     | Fast file and code pattern discovery        |
| context        | Subagent | `@context`     | Memory-integrated context retrieval         |
| orchestrate    | Primary  | `@orchestrate` | Complex multi-step task coordination        |
| write          | All      | `@write`       | Documentation creation with DQI scoring     |
| deep-research  | Subagent | `@deep-research` | Autonomous iterative research loop        |
| review         | Subagent | `@review`      | Code quality and security assessment        |
| speckit        | Subagent | `@speckit`     | Spec folder documentation (Level 1-3+)      |
| handover       | Subagent | `@handover`    | Session continuation and context export     |
| debug          | Subagent | `@debug`       | Fresh perspective debugging (4-phase)       |

### First Use Recommendations

1. **For development work**: Use **Build** agent (default). Has all tools enabled.
2. **For planning or analysis**: Press **Tab** to switch to **Plan** agent. Suggests changes without making them.
3. **For codebase exploration**: Type `@context` for memory-integrated exploration with structured Context Package output. Preferred over raw `@explore`.
4. **For research tasks**: Type `@general` for general research, or `@deep-research` for autonomous iterative investigation.
5. **For documentation tasks**: Type `@write` to invoke the documentation agent with template enforcement.
6. **For complex multi-step tasks**: Type `@orchestrate` to decompose and delegate work.
7. **For code reviews**: Type `@review` for quality scoring and security assessment.
8. **For spec folder creation**: Type `@speckit` to create Level 1-3+ spec documentation.
9. **For session handover**: Type `@handover` or use `/spec_kit:handover` to preserve context.
10. **For stuck debugging**: Type `@debug` for a fresh perspective with the 4-phase methodology.

---

## 7. FEATURES

### Built-in Agents (OpenCode Default)

These agents come with OpenCode and are always available:

| Agent       | Mode       | Purpose                                              | Key Feature                                     |
| ----------- | ---------- | ---------------------------------------------------- | ----------------------------------------------- |
| **Build**   | `primary`  | Default development agent with all tools enabled     | Full tool access, Tab to select                 |
| **Plan**    | `primary`  | Analysis and planning without making changes         | Read-only, suggests changes                     |
| **General** | `subagent` | Research, search, and multi-step task execution      | @ mention or automatic invocation               |
| **Explore** | `subagent` | Fast codebase exploration and file pattern matching  | Quick file and code discovery (prefer @context) |

> **Note:** For exploration tasks, prefer `@context` over raw `@explore`. The context agent provides memory integration, structured output, and can dispatch @explore internally when needed.

### Custom Agents Summary

These are project-specific agents defined in `.opencode/agent/`:

| Agent           | Purpose                                  | Tools                                                 | Key Capability                                              |
| --------------- | ---------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| **context**     | Context retrieval and exploration        | read, bash, grep, glob, memory                        | Structured Context Package output, active dispatch          |
| **orchestrate** | Task decomposition and delegation        | `task` only                                           | Parallel delegation to subagents                            |
| **write**       | Documentation creation                   | read, write, edit, bash, grep, glob, webfetch, memory | Template-first, DQI scoring                                 |
| **research**    | Technical investigation                  | read, write, edit, bash, grep, glob, webfetch, memory | 9-step research workflow, evidence-based                    |
| **review**      | Code quality and security assessment     | read, bash, grep, glob, memory (read-only)            | Quality scoring, 5-dimension rubric                         |
| **speckit**     | Spec folder documentation                | read, write, edit, bash, grep, glob, memory           | Level 1-3+ templates, validation                            |
| **handover**    | Session continuation                     | read, write, edit, bash, grep, glob, memory           | Context preservation, attempt tracking                      |
| **debug**       | Fresh perspective debugging              | read, write, edit, bash, grep, glob, memory           | 4-phase methodology, isolated context                       |

### Key Statistics

| Metric              | Value              | Description                                             |
| ------------------- | ------------------ | ------------------------------------------------------- |
| Built-in Agents     | 4                  | Build, Plan, General, Explore                           |
| Custom Agents       | 8                  | context, orchestrate, write, research, review, speckit, handover, debug |
| Default Mode        | `all`              | Both primary and subagent                               |
| Default Temperature | 0.1                | Deterministic, consistent output                        |
| Location            | `.opencode/agent/` | Agent definition files                                  |

### Key System Features

| Feature                  | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| **Tool Permissions**     | Fine-grained control over which tools each agent can use  |
| **Behavioral Rules**     | Embedded workflows and constraints in each agent file     |
| **Parallel Delegation**  | Primary agents can invoke subagents for specialized tasks |
| **Template Enforcement** | Write agent ensures 100% template alignment               |
| **Skill Integration**    | Agents invoke skills for domain expertise                 |
| **Session Navigation**   | Navigate between parent and child sessions with keybinds  |

### Agent Anatomy Reference

**Frontmatter Fields (v1.1.1+ Format)**

Every agent file MUST have YAML frontmatter:

```yaml
---
name: agent-name                    # Required: Identifier
description: One-line description   # Required: Purpose
mode: primary                       # Required: primary, subagent, or all
temperature: 0.1                    # Required: 0.0-1.0 (lower = deterministic)
permission:                         # Required: Unified permissions (v1.1.1+)
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  external_directory: allow
---
```

**Frontmatter Field Reference**

| Field         | Required | Type   | Description                                                    |
| ------------- | -------- | ------ | -------------------------------------------------------------- |
| `name`        | Yes      | string | Agent identifier (used in `@name` invocation)                  |
| `description` | Yes      | string | One-line purpose description (used for automatic routing)      |
| `mode`        | No       | string | `primary`, `subagent`, or `all` (default: `all`)               |
| `temperature` | No       | float  | 0.0-1.0, lower = more deterministic (default: model-specific)  |
| `permission`  | No       | object | Unified tool and action permissions (allow/deny/ask)           |
| `model`       | No       | string | Override model for this agent (format: `provider/model-id`)    |
| `steps`       | No       | int    | Max agentic iterations (replaces deprecated `maxSteps`)        |

**Required Body Sections**

Agent files should follow this structure:

```markdown
# Agent Title

[1-2 sentence intro - what this agent does]

---

## 1. CORE WORKFLOW
[Numbered steps the agent follows]

## 2-N. [DOMAIN SECTIONS]
[Agent-specific content]

## N. ANTI-PATTERNS
[What the agent should NEVER do]

## N+1. RELATED RESOURCES
[Links to skills, templates, docs]
```

### Directory Layout

```
.opencode/agent/
+-- context.md      # Context retrieval and exploration dispatch agent
+-- debug.md        # Fresh perspective debugging agent
+-- handover.md     # Session continuation agent
+-- orchestrate.md  # Task decomposition and delegation agent
+-- research.md     # Technical investigation agent
+-- review.md       # Code quality and security assessment agent
+-- speckit.md      # Spec folder documentation agent
+-- write.md        # Documentation creation agent
```

### File Naming Conventions

| Pattern                  | Example                  | Use Case              |
| ------------------------ | ------------------------ | --------------------- |
| `{role}.md`              | `write.md`               | Single-word role name |
| `{action}-{domain}.md`   | `review-code.md`         | Action-focused agent  |
| `{domain}-specialist.md` | `security-specialist.md` | Domain expert agent   |

---

## 8. EXAMPLES

### Example 1: Creating a Custom Agent

**Scenario:** You need a specialized agent for database migration work.

```bash
# Step 1: Create the file
touch .opencode/agent/db-migrate.md
```

Add frontmatter and content:

```yaml
---
name: db-migrate
description: Database migration specialist for schema changes and data transformations
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  external_directory: deny
---
```

```markdown
# Database Migration Specialist

Handles schema migrations, data transformations, and rollback planning
for database changes.

---

## 1. CORE WORKFLOW

1. **READ** migration files and current schema
2. **ANALYZE** impact on existing data
3. **PLAN** rollback strategy before executing
4. **EXECUTE** migration with validation checkpoints
5. **VERIFY** data integrity after migration

---

## 2. RULES

**ALWAYS:**
- Create a rollback plan before any migration
- Test on a copy of production data first
- Verify row counts before and after

**NEVER:**
- Run destructive migrations without a backup verification
- Skip the rollback test

---

## 3. RELATED RESOURCES

- [system-spec-kit](../skill/system-spec-kit/SKILL.md)
```

```bash
# Step 2: Test the agent
# Inside OpenCode:
# @db-migrate analyze the migration in migrations/0042_add_user_roles.sql
```

### Example 2: Documentation Creation

```markdown
User: "Create a README for the utils folder"

-> Routes to @write agent
-> Agent loads readme_template.md
-> Agent creates README following template
-> Agent validates template alignment
-> Agent runs DQI scoring
-> Agent delivers template-aligned README
```

### Example 3: Complex Multi-Step Task

```markdown
User: "@orchestrate analyze this codebase and create a refactoring plan"

-> Orchestrate agent receives request
-> Decomposes into tasks:
   - Task 1: Analyze code structure (delegate to @general)
   - Task 2: Identify patterns (delegate to @general)
   - Task 3: Create refactoring plan (delegate to @write)
-> Delegates tasks in parallel
-> Evaluates sub-agent outputs
-> Synthesizes into unified response
-> Delivers comprehensive plan
```

### Example 4: Agent + Skill Integration

```markdown
User: "Create a new skill for API testing"

-> Routes to @write agent
-> Agent invokes sk-doc skill
-> Skill provides:
   - skill_md_template.md
   - skill_reference_template.md
   - skill_asset_template.md
   - DQI scoring standards
-> Agent creates skill structure
-> Agent validates against templates
-> Agent delivers DQI-compliant skill
```

### Agent vs. Skill Decision

| Scenario                        | Use Agent         | Use Skill                   |
| ------------------------------- | ----------------- | --------------------------- |
| Need specific tool permissions  | Yes               | No                          |
| Need to delegate to sub-agents  | Yes               | No                          |
| Need domain knowledge/workflows | No                | Yes                         |
| Need templates and standards    | No                | Yes                         |
| Need behavioral constraints     | Yes               | Yes                         |
| Creating documentation          | Yes `@write`      | Yes `sk-doc`                |
| Complex multi-step task         | Yes `@orchestrate`| No                          |
| Code quality standards          | No                | Yes `sk-code--web`          |
| Git workflows                   | No                | Yes `sk-git`                |

**Decision rule:** If you need **authority + tools**, create an agent. If you need **knowledge + workflows**, create a skill.

---

## 9. TROUBLESHOOTING

### Agent Not Found When Typing @agent-name

**Error:** Typing `@my-agent` produces no autocomplete result and the agent does not respond.

**Cause:** The agent file is missing, in the wrong directory, has an invalid `name` field, or OpenCode has not been restarted since the file was created.

**Fix:**
```bash
# Verify the file exists in the correct location
ls .opencode/agent/my-agent.md

# Check the name field matches what you are typing
head -5 .opencode/agent/my-agent.md
# Should show:  name: my-agent

# If file is missing, create it
touch .opencode/agent/my-agent.md

# Restart OpenCode to reload agent definitions
opencode
```

---

### YAML Frontmatter Parse Error

**Error:** OpenCode reports a YAML error or the agent silently fails to load.

**Cause:** Incorrect YAML indentation, missing required fields, or use of tabs instead of spaces.

**Fix:**
```bash
# Check frontmatter syntax with Python
python3 -c "
import yaml
content = open('.opencode/agent/my-agent.md').read()
parts = content.split('---')
if len(parts) >= 3:
    try:
        data = yaml.safe_load(parts[1])
        print('VALID:', list(data.keys()))
    except yaml.YAMLError as e:
        print('ERROR:', e)
else:
    print('NO FRONTMATTER BLOCK FOUND')
"

# Common fixes:
# - Use 2 spaces for indentation (no tabs)
# - Wrap values with special characters in quotes
# - Ensure opening --- is on line 1
```

---

### Agent Can't Use a Tool (Permission Denied)

**Error:** Agent fails or reports it cannot use a specific tool.

**Cause:** The tool's permission is set to `deny` or the `permission:` block uses the deprecated `tools:` format.

**Fix:**
```bash
# Check current permission settings
python3 -c "
import yaml
content = open('.opencode/agent/my-agent.md').read()
data = yaml.safe_load(content.split('---')[1])
print('permission:', data.get('permission', 'NOT FOUND'))
print('tools (deprecated):', data.get('tools', 'not present'))
"

# To allow a tool, update the permission block:
# permission:
#   bash: allow   # Change from deny to allow
```

If you are using the deprecated `tools:` format, migrate to `permission:`:

```yaml
# Old format (deprecated):
tools:
  bash: true
  write: true

# New format (v1.1.1+):
permission:
  bash: allow
  write: allow
```

---

### Agent Not Following Behavioral Rules

**Error:** Agent ignores ALWAYS/NEVER rules defined in the agent body.

**Cause:** Rules are written vaguely, temperature is too high (causing unpredictable behavior), or conflicting rules create ambiguity.

**Fix:**
```bash
# Check current temperature setting
python3 -c "
import yaml
content = open('.opencode/agent/my-agent.md').read()
data = yaml.safe_load(content.split('---')[1])
print('temperature:', data.get('temperature', 'NOT SET - using model default'))
"

# Lower temperature to 0.1 for deterministic behavior
# In frontmatter:
# temperature: 0.1
```

Also rewrite rules to use explicit language:

```markdown
# Vague (avoid):
- Try to read files before editing

# Explicit (preferred):
**ALWAYS:** Read a file completely before making any edits.
**NEVER:** Edit a file that has not been read in the current session.
```

---

### Agent Not Appearing in Tab Cycle

**Error:** Pressing Tab does not cycle to the new agent.

**Cause:** Agent `mode` is set to `subagent` instead of `primary` or `all`.

**Fix:**
```bash
# Check the mode field
python3 -c "
import yaml
content = open('.opencode/agent/my-agent.md').read()
data = yaml.safe_load(content.split('---')[1])
print('mode:', data.get('mode', 'NOT SET - defaults to all'))
"

# To appear in Tab cycle, set mode to primary or all:
# mode: primary
# Then restart OpenCode
```

---

### Subagent Not Invoked Automatically

**Error:** A primary agent never dispatches the subagent even though it should.

**Cause:** The subagent's `description` field is too vague for automatic routing to match. OpenCode uses the description to decide when to invoke a subagent automatically.

**Fix:**

Write a specific, action-oriented description that clearly states when the agent should be invoked:

```yaml
# Vague (avoid):
description: Helps with tasks

# Specific (preferred):
description: Specialist for database schema migrations, rollback planning, and data transformation validation
```

Also verify the subagent file is present and valid:

```bash
ls -la .opencode/agent/
python3 -c "
import yaml
for f in ['context.md','research.md','write.md','review.md']:
    try:
        content = open(f'.opencode/agent/{f}').read()
        data = yaml.safe_load(content.split('---')[1])
        print(f, '->', data.get('description', 'NO DESCRIPTION'))
    except Exception as e:
        print(f, '-> ERROR:', e)
"
```

---

### Diagnostic Commands

```bash
# List all agent files
ls -la .opencode/agent/

# Check frontmatter of a specific agent
head -30 .opencode/agent/write.md

# Validate all agents in one pass
for f in .opencode/agent/*.md; do
  echo "--- $f ---"
  python3 -c "
import yaml, sys
content = open('$f').read()
parts = content.split('---')
if len(parts) >= 3:
    try:
        data = yaml.safe_load(parts[1])
        print('OK:', data.get('name', 'NO NAME'), '|', data.get('mode', 'no mode'))
    except yaml.YAMLError as e:
        print('YAML ERROR:', e)
else:
    print('NO FRONTMATTER')
"
done
```

---

## 10. RESOURCES

### File Locations

| Path                                              | Purpose                               |
| ------------------------------------------------- | ------------------------------------- |
| `.opencode/agent/`                                | All agent definition files            |
| `.opencode/agent/write.md`                        | Documentation creation agent          |
| `.opencode/agent/orchestrate.md`                  | Task coordination agent               |
| `.opencode/agent/context.md`                      | Context retrieval agent               |
| `.opencode/skill/sk-doc/assets/agents/agent_template.md` | Agent file template             |
| `AGENTS.md`                                       | Main AI behavior configuration        |

### Agent Files

| Agent       | Location               | Purpose                                  |
| ----------- | ---------------------- | ---------------------------------------- |
| context     | `./context.md`         | Context retrieval and exploration        |
| orchestrate | `./orchestrate.md`     | Task decomposition and delegation        |
| write       | `./write.md`           | Documentation creation                   |
| research    | `./research.md`        | Technical investigation                  |
| review      | `./review.md`          | Code quality and security assessment     |
| speckit     | `./speckit.md`         | Spec folder documentation                |
| handover    | `./handover.md`        | Session continuation                     |
| debug       | `./debug.md`           | Fresh perspective debugging              |

### Related Skills

| Skill            | Location                      | Purpose                 |
| ---------------- | ----------------------------- | ----------------------- |
| sk-doc           | `../skill/sk-doc/`            | Documentation standards |
| sk-code--web     | `../skill/sk-code--web/`      | Code quality standards  |
| system-spec-kit  | `../skill/system-spec-kit/`   | Spec folder management  |
| sk-git           | `../skill/sk-git/`            | Git workflows           |

### Templates

| Template                 | Location                                    | Purpose                  |
| ------------------------ | ------------------------------------------- | ------------------------ |
| agent_template.md        | `../skill/sk-doc/assets/opencode/`          | Agent file structure     |
| skill_md_template.md     | `../skill/sk-doc/assets/opencode/`          | SKILL.md structure       |
| install_guide_template.md| `../skill/sk-doc/assets/documentation/`     | Install guide structure  |

### Quick Start Summary

```bash
# 1. Verify prerequisites
opencode --version       # v1.1.1+
ls .opencode/agent/      # directory exists

# 2. Create agent file
touch .opencode/agent/my-agent.md
# Add YAML frontmatter with name, description, mode, temperature, permission

# 3. Configure permissions and rules
# Edit frontmatter: set permission values to allow/deny/ask
# Add ALWAYS/NEVER rules in agent body

# 4. Restart OpenCode
opencode

# 5. Test the agent
# @my-agent What is your purpose?
```

### Related Guides

| Guide                          | Location                                         | Purpose                        |
| ------------------------------ | ------------------------------------------------ | ------------------------------ |
| Master Installation Guide      | `./README.md`                                    | Full OpenCode setup            |
| Skill Creation Guide           | `./SET-UP - Skill Creation.md`                   | Creating skills                |
| AGENTS.md                      | `../../AGENTS.md`                                | Main AI behavior configuration |

---

*Documentation version: 1.4 | Last updated: 2026-02-28 | OpenCode v1.1.1+ compatible*
