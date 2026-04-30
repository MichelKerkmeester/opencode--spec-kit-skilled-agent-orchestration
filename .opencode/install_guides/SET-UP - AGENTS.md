# AGENTS.md Customization Guide

Complete guide for customizing the AI agent configuration file (AGENTS.md) for your specific project type, installed MCP tools, and available skills. Covers front-end, back-end, and full-stack configurations with interactive AI-assisted setup. Follow each phase checkpoint before proceeding to avoid cascading failures.

> **Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.
> **Scope**: AGENTS.md

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

## 0. AI-FIRST SETUP GUIDE

**Copy and paste this prompt for interactive AGENTS.md customization:**

```text
I need to customize the AGENTS.md file for my project. Please guide me through an interactive setup by asking me questions one at a time.

**Questions to ask me (one at a time, wait for my answer):**

1. **Project Type**: What type of project is this?
   - Front-end (Webflow, CSS, JavaScript, browser-focused)
   - Back-end (API, database, server-side)
   - Full-stack (both front-end and back-end)

2. **MCP Servers**: What MCP servers are installed?
   (Please check my opencode.json and .utcp_config.json to verify)

3. **Available Skills**: What skills exist in my .opencode/skill/ directory?
   (Please list what you find)

4. **AI Client**: Which AI client am I using?
   - OpenCode CLI
   - Claude Code
   - Cursor
   - Other

5. **Project Conventions**: Are there any project-specific patterns or conventions I should include?
   (e.g., Webflow/Finsweet patterns, API naming conventions, testing requirements)

**After gathering my answers, please:**

1. Generate a customized Tool Routing Decision Tree based on my installed MCP servers
2. Generate a customized Skills Table based on my available skills
3. Suggest Confidence Weight adjustments for my project type
4. Identify any sections to remove (tools/skills I don't have)
5. Suggest project-specific additions

Provide copy-paste ready sections I can use to replace parts of my AGENTS.md.

My project is at: [your project path]
```

**What the AI will do:**
- Ask you questions one at a time to understand your setup
- Audit your installed MCP servers by reading your config files
- Check your available skills in `.opencode/skill/`
- Generate customized AGENTS.md sections tailored to your project
- Provide copy-paste ready configuration blocks

**Expected setup time:** 10-15 minutes

---

## 1. OVERVIEW

AGENTS.md is an AI agent configuration file that defines behavior guardrails, standards, and decision frameworks for AI assistants working on your project. It serves as the "operating manual" that AI agents read before executing any task. The universal template includes all possible tools, skills, and patterns. Your project likely uses a subset, so customization is essential.

### Core Principle

> **Customize once, validate at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### What is AGENTS.md?

AGENTS.md defines:
- **Behavior guardrails** - Mandatory gates that prevent common mistakes
- **Tool routing** - Decision trees for selecting the right tool for each task
- **Skills system** - On-demand specialized capabilities for complex workflows
- **Confidence framework** - When to proceed vs. ask for clarification
- **Documentation standards** - Spec folder requirements and templates

### Why Customize It?

The universal template (`AGENTS (Universal).md`) includes ALL possible tools, skills, and patterns. Your project likely uses a subset:

| Scenario               | Customization Needed                      |
| ---------------------- | ----------------------------------------- |
| Front-end only project | Remove backend tools, database references |
| Backend API project    | Remove Webflow, Figma, browser tools      |
| Missing MCP servers    | Remove references to uninstalled tools    |
| Custom skills          | Add project-specific skill definitions    |
| Team conventions       | Add coding standards, review requirements |

### When to Customize vs. Use As-Is

**Customize when:**
- Your project type differs from full-stack (front-end only, backend only)
- You have not installed all MCP servers referenced in the template
- You have project-specific conventions or requirements
- AI agents are trying to use tools that do not exist

**Use as-is when:**
- Full-stack project with all MCP servers installed
- Getting started quickly (customize later)
- Using as reference documentation only

---

## 2. PREREQUISITES

**Phase 1** focuses on auditing what is already installed before making any changes.

### Required: Audit Your Environment

Before customizing, you need to know what tools and skills are available in your project.

**Step 1: Check native MCP servers**

```bash
# Check opencode.json for native MCP servers
cat opencode.json | jq '.mcp'

# Example output:
# {
#   "servers": {
#     "sequential-thinking": { ... },
#     "semantic-memory": { ... },
#     "code-mode": { ... }
#   }
# }
```

**Step 2: Check Code Mode tools**

```bash
# Check .utcp_config.json for Code Mode tools
cat .utcp_config.json | jq '.manuals'

# Example output:
# {
#   "webflow": { ... },
#   "figma": { ... },
#   "clickup": { ... }
# }
```

**Step 3: List available skills**

```bash
# List all skills in the skill directory
ls -la .opencode/skill/

# Example output:
# mcp-code-mode/
# mcp-figma/
# system-spec-kit/
# mcp-chrome-devtools/
# sk-code/
# sk-git/
```

### Validation: `phase_1_complete`

```bash
# All commands should succeed:
cat opencode.json | jq '.mcp'         # → shows MCP server config
ls .opencode/skill/                    # → lists skill directories
```

**Checklist:**
- [ ] `opencode.json` exists and contains MCP configuration?
- [ ] `.utcp_config.json` exists (if using Code Mode)?
- [ ] All skills in `.opencode/skill/` directory listed?
- [ ] Project type identified: [ ] Front-end [ ] Backend [ ] Full-stack

❌ **STOP if validation fails** - Ensure `opencode.json` exists and the skills directory is populated before continuing.

---

## 3. SETUP

**Phase 2** covers renaming the universal template and placing it correctly in your project.

### Remove "(Universal)" for Project-Specific Use

The template file is named `AGENTS (Universal).md` to indicate it is a starting point. For your project:

```bash
# Step 1: Rename for your project
mv "AGENTS (Universal).md" "AGENTS.md"

# Step 2: Keep original as reference (optional)
cp "AGENTS.md" "AGENTS (Template).md"
```

### Why This Matters

AI assistants automatically read `AGENTS.md` from the project root:

| Tool            | File Detection                                 |
| --------------- | ---------------------------------------------- |
| **OpenCode**    | Reads `AGENTS.md` from project root on startup |
| **Claude Code** | Reads `AGENTS.md` from project root            |
| **Cursor**      | Reads `.cursorrules` or `AGENTS.md`            |
| **Windsurf**    | Reads `.windsurfrules` or `AGENTS.md`          |

### File Location

```text
your-project/
├── AGENTS.md              <- AI agents read this
├── AGENTS (Template).md   <- Reference copy (optional)
├── .opencode/
│   └── skill/
└── src/
```

### Validation: `phase_2_complete`

```bash
# Confirm AGENTS.md is in the project root
ls -la AGENTS.md
# → -rw-r--r--  ... AGENTS.md

# Confirm it is readable
head -5 AGENTS.md
# → # AI Agent Framework (or similar H1)
```

**Checklist:**
- [ ] File renamed to `AGENTS.md` (removed "Universal")?
- [ ] File is located in project root directory?
- [ ] File is readable (not empty)?

❌ **STOP if validation fails** - Confirm the rename completed and the file is in the project root, not a subdirectory.

---

## 4. CONFIGURATION

**Phase 3** covers customizing AGENTS.md for your project type, MCP tooling, skills, commands, and any project-specific patterns. This is the primary customization phase.

### 4.1 Project Type Customization

#### Front-end Projects (Webflow, CSS, JavaScript)

Front-end projects emphasize visual development, browser tools, and design integration.

**Tool Emphasis**

| Keep/Emphasize    | Remove/De-emphasize  |
| ----------------- | -------------------- |
| Chrome DevTools   | Database tools       |
| Webflow MCP       | API testing tools    |
| Figma MCP         | Security scanners    |
| CSS/JS patterns   | Backend frameworks   |
| Visual regression | Server configuration |

**Primary Skills**

| Skill                 | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `mcp-chrome-devtools` | Browser debugging, visual testing, DOM inspection |
| `mcp-code-mode`       | Webflow, Figma integration via Code Mode          |

**Confidence Weight Adjustments**

Update your confidence weights section with front-end focused values:

```markdown
| Weight Category      | Frontend |
| -------------------- | -------- |
| Requirements clarity | 25%      |
| API/Component design | 15%      |
| State/Data flow      | 15%      |
| Type safety/Security | 10%      |
| Performance          | 10%      |
| Accessibility        | 15%      |
| Tooling/Risk         | 10%      |
```

**Code Focus Areas**

Add to your code standards section:

```markdown
### Front-end Code Standards
- CSS: BEM naming, Webflow class conventions
- JavaScript: ES6+, no jQuery unless existing
- HTML: Semantic elements, ARIA attributes
- Animations: GSAP or CSS transitions
- Testing: Visual regression, cross-browser
```

---

#### Back-end Projects (API, Database, Server)

Backend projects emphasize data integrity, security, and API design.

**Tool Emphasis**

| Keep/Emphasize    | Remove/De-emphasize |
| ----------------- | ------------------- |
| Database tools    | Chrome DevTools     |
| API testing       | Webflow MCP         |
| Security patterns | Figma MCP           |
| Unit testing      | CSS patterns        |
| CI/CD integration | Visual testing      |

**Primary Skills**

| Skill          | Purpose                                               |
| -------------- | ----------------------------------------------------- |
| `sk-code` | Implementation, debugging, verification lifecycle     |

**Confidence Weight Adjustments**

```markdown
| Weight Category       | Backend |
| --------------------- | ------- |
| Requirements clarity  | 25%     |
| API/Component design  | 20%     |
| State/Data flow       | 15%     |
| Type safety/Security  | 20%     |
| Performance           | 10%     |
| Accessibility/Testing | 5%      |
| Tooling/Risk          | 5%      |
```

**Code Focus Areas**

```markdown
### Backend Code Standards
- API: RESTful conventions, OpenAPI specs
- Database: Migration-first, no raw queries
- Security: Input validation, auth middleware
- Testing: Unit tests required, integration optional
- Logging: Structured JSON, correlation IDs
```

---

#### Full-stack Projects

Full-stack projects use the complete template with balanced weights.

**Tool Emphasis**

Include all tool types with contextual routing:

```markdown
### Tool Routing by Layer
- **Frontend work** -> Chrome DevTools, Webflow, Figma
- **Backend work** -> Database tools, API testing
- **Both** -> Grep/Glob, Memory
```

**Balanced Weight Distribution**

Use the default weights from the template:

```markdown
| Weight Category       | Full-stack |
| --------------------- | ---------- |
| Requirements clarity  | 25%        |
| API/Component design  | 17%        |
| State/Data flow       | 15%        |
| Type safety/Security  | 15%        |
| Performance           | 10%        |
| Accessibility/Testing | 10%        |
| Tooling/Risk          | 8%         |
```

---

### 4.2 MCP Tooling Alignment

#### Native MCP Servers Reference

**Current Installation (3 servers):**

| Server                | Tool Prefix             | Purpose                     |
| --------------------- | ----------------------- | --------------------------- |
| `sequential-thinking` | `sequential_thinking_*` | Complex multi-step reasoning |
| `spec-kit-memory`     | `memory_*`              | Context preservation        |
| `code-mode`           | `call_tool_chain()`     | External tool orchestration |

#### Update Tool Routing Decision Tree

Remove lines for tools you have not installed:

**Original (All Tools):**

```markdown
### Tool Routing Decision Tree

Known file path? -> Read()
Research/prior work? -> memory_search() [NATIVE MCP]
Text pattern? -> Grep()
File structure? -> Glob()
Complex reasoning? -> sequential_thinking_sequentialthinking() [NATIVE MCP]
Browser debugging? -> mcp-chrome-devtools skill
External MCP tools? -> call_tool_chain() [Webflow, Figma, ClickUp]
Multi-step workflow? -> Read skill SKILL.md [see Skills section]
```

**Front-end Customization (No Sequential Thinking):**

```markdown
### Tool Routing Decision Tree

Known file path? -> Read()
Research/prior work? -> memory_search() [NATIVE MCP]
Text pattern? -> Grep()
File structure? -> Glob()
Browser debugging? -> mcp-chrome-devtools skill
External MCP tools? -> call_tool_chain() [Webflow, Figma]
Multi-step workflow? -> Read skill SKILL.md [see Skills section]
```

**Backend Customization (No Browser Tools, No Figma):**

```markdown
### Tool Routing Decision Tree

Known file path? -> Read()
Research/prior work? -> memory_search() [NATIVE MCP]
Text pattern? -> Grep()
File structure? -> Glob()
Complex reasoning? -> sequential_thinking_sequentialthinking() [NATIVE MCP]
Multi-step workflow? -> Read skill SKILL.md [see Skills section]
```

#### Update Native MCP Tools Reference

Only include tools configured in `opencode.json`.

**Full Reference (All Native Tools):**

```markdown
### Native MCP Tools Reference

SEMANTIC MEMORY (context/research):
  memory_search()         # Hybrid search (use includeContent: true for full content)
  memory_match_triggers() # Fast trigger matching
  memory_list()           # Browse memories
  memory_save()           # Index generated continuity support artifact
  memory_index_scan()     # Bulk indexing

SEQUENTIAL THINKING (optional):
  sequential_thinking_sequentialthinking()
```

**Minimal Reference (Memory Only):**

```markdown
### Native MCP Tools Reference

SEMANTIC MEMORY (context/research):
  memory_search()         # Hybrid search (use includeContent: true for full content)
  memory_match_triggers() # Fast trigger matching
  memory_list()           # Browse memories
  memory_save()           # Index generated continuity support artifact
  memory_index_scan()     # Bulk indexing
```

#### Update Code Mode Tools Reference

Only include tools in `.utcp_config.json`.

**Front-end Tools (Webflow + Figma):**

```markdown
### Code Mode Tools Reference

External tools accessed via `call_tool_chain()`:

WEBFLOW:
  call_tool_chain(`webflow.webflow_sites_list({})`)
  call_tool_chain(`webflow.webflow_get_site({ site_id: "..." })`)

FIGMA:
  call_tool_chain(`figma.figma_get_file({ file_key: "..." })`)
  call_tool_chain(`figma.figma_get_styles({ file_key: "..." })`)

Discovery: search_tools(), list_tools(), or read .utcp_config.json
```

**Project Management Tools (ClickUp Only):**

```markdown
### Code Mode Tools Reference

External tools accessed via `call_tool_chain()`:

CLICKUP:
  call_tool_chain(`clickup.clickup_get_tasks({ list_id: "..." })`)
  call_tool_chain(`clickup.clickup_create_task({ list_id: "...", name: "..." })`)

Discovery: search_tools(), list_tools(), or read .utcp_config.json
```

---

### 4.3 Skills Alignment

#### Complete Skills Reference

**Current Installation (9 skills):**

| Skill                  | Version | Primary Triggers                                          | Purpose                                          |
| ---------------------- | ------- | --------------------------------------------------------- | ------------------------------------------------ |
| `mcp-figma`            | v1.0.0  | "Figma", "design", "component", "style"                   | Figma design tool integration                    |
| `mcp-code-mode`        | v1.2.0  | "ClickUp", "Figma", "Webflow", "external tool"            | MCP orchestration for external tools             |
| `system-spec-kit`      | v2.2.0  | "save context", "/memory:save", "spec folder", "plan"     | Context preservation and spec workflow           |
| `mcp-chrome-devtools`  | v2.1.0  | "screenshot", "bdg", "browser debug", "DOM"               | Chrome DevTools Protocol debugging               |
| `sk-code`  | v1.0.0  | "implement", "debug", "verify", "refactor" (full-stack)   | Full-stack implementation lifecycle orchestrator |
| `sk-code-opencode`    | v1.3.2  | "opencode code", "system code", "TypeScript", "Python"    | OpenCode system code standards                   |
| `sk-code`         | v1.0.9  | "implement", "debug", "verify", "refactor" (frontend)     | Web development implementation lifecycle         |
| `sk-doc`               | v5.2.0  | "skill", "markdown", "flowchart", "documentation"         | Unified markdown and skill management            |
| `sk-git`               | v1.5.0  | "commit", "branch", "PR", "push", "git"                   | Git workflow orchestration                       |

#### Skill Routing Table

When the runtime surfaces the automatic Skill Advisor Hook brief, Gate 2 uses that as the primary routing signal. When you need the scripted or diagnostic path, `skill_advisor.py` maps user intent to skills:

| User Says                         | Skill Triggered       | Confidence |
| --------------------------------- | --------------------- | ---------- |
| "save this context"               | system-spec-kit       | 0.95       |
| "/memory:save"                    | system-spec-kit       | 0.98       |
| "remember this decision"          | system-spec-kit       | 0.85       |
| "take a screenshot"               | mcp-chrome-devtools   | 0.95       |
| "debug in browser"                | mcp-chrome-devtools   | 0.88       |
| "check the DOM"                   | mcp-chrome-devtools   | 0.82       |
| "implement the login feature"     | sk-code          | 0.90       |
| "help me debug this error"        | sk-code          | 0.85       |
| "verify the changes work"         | sk-code          | 0.82       |
| "create a commit"                 | sk-git                | 0.95       |
| "open a PR"                       | sk-git                | 0.92       |
| "push to remote"                  | sk-git                | 0.90       |
| "get Webflow site data"           | mcp-code-mode         | 0.90       |
| "update Figma component"          | mcp-code-mode         | 0.88       |
| "check ClickUp tasks"             | mcp-code-mode         | 0.85       |

#### Native Skill Discovery (OpenCode v1.0.190+)

OpenCode has built-in skill discovery. No manual skills table is required.

**Automatic Discovery:**
- OpenCode scans `.opencode/skill/*/SKILL.md` on startup
- Skills are surfaced via `skills_*` functions (e.g., `skills_workflows_code`, `skills_system_spec_kit`)
- Frontmatter fields (`name`, `description`, `allowed-tools`) provide metadata

**Simplified AGENTS.md Section:**

```markdown
### Skill Routing (Gate 2)

Gate 2 uses the automatic Skill Advisor Hook brief when the runtime surfaces it. If the hook brief is unavailable, run `skill_advisor.py` as the compatibility fallback. When confidence > 0.8, you MUST invoke the recommended skill.

**How to use skills:**
- OpenCode v1.0.190+ auto-discovers skills from `.opencode/skill/*/SKILL.md` frontmatter
- Skills appear as `skills_*` functions in your available tools
- When a task matches a skill, read the SKILL.md directly: `Read(".opencode/skill/<skill-name>/SKILL.md")`
- Base directory provided for resolving bundled resources (`references/`, `scripts/`, `assets/`)

**Usage notes:**
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
- Skills are auto-indexed from SKILL.md frontmatter, no manual list maintenance required
```

---

### 4.4 Commands

#### All Available Commands (22 total)

Commands are slash-prefixed shortcuts for common workflows.

**Create Commands (7)**

| Command                   | Description                         | Output                            |
| ------------------------- | ----------------------------------- | --------------------------------- |
| `/create:agent`           | Create new agent                    | Agent file in the active runtime agent path |
| `/create:changelog`       | Create changelog entry              | Versioned changelog markdown      |
| `/create:feature-catalog` | Create or update feature catalog    | Rooted `feature_catalog/` package |
| `/create:folder_readme`   | Unified README + install guide      | README.md or install guide output |
| `/create:prompt`          | Create or improve prompt artifact   | Prompt markdown                   |
| `/create:sk-skill`        | Unified skill command               | Skill create/update/file flows    |
| `/create:testing-playbook` | Create or update testing playbook | Rooted `manual_testing_playbook/` package |

**Memory Commands (4)**

| Command            | Description                             | Output                          |
| ------------------ | --------------------------------------- | ------------------------------- |
| `/memory:search`  | Unified retrieval and analysis             | Context, epistemic, causal data |
| `/memory:learn`   | Manage constitutional memories             | Memory rule files and budget    |
| `/memory:manage`  | Manage database, ingest, and shared spaces | Operational status or mutations |
| `/memory:save`    | Save current context                       | Canonical continuity refresh in the active spec packet |

**SpecKit Commands (8)**

| Command               | Description                           | Output                      |
| --------------------- | ------------------------------------- | --------------------------- |
| `/spec_kit:complete`  | Full spec workflow (plan + implement) | Complete implementation     |
| `/spec_kit:deep-research` | Iterative deep research workflow | Research findings and state |
| `/spec_kit:implement` | Execute pre-planned work              | Implementation from plan    |
| `/spec_kit:plan :with-phases` | Phase decomposition (integrated into plan/complete) | Parent and child spec packs |
| `/spec_kit:plan`      | Planning phase only                   | Plan without implementation |
| `/spec_kit:resume`    | Resume previous session               | Continued work              |

#### Customizing Commands for Project Type

**Front-end projects - essential commands:**
- `/memory:save` - Preserve design decisions
- `/spec_kit:*` - Documentation workflow
- `/create:*` - Asset creation

**Backend projects - essential commands:**
- `/memory:*` - All memory commands for research
- `/search:*` - Code discovery
- `/spec_kit:*` - Full workflow

Remove commands by not referencing them in your AGENTS.md. Commands are defined in `.opencode/command/`.

---

### 4.5 Project-Specific Additions

#### Custom Commands

Add project-specific slash commands:

```markdown
### Project Commands

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `/deploy:staging` | Deploy to staging environment            |
| `/deploy:prod`    | Deploy to production (requires approval) |
| `/test:visual`    | Run visual regression tests              |
| `/sync:webflow`   | Sync changes with Webflow                |
```

#### Project Conventions

Document team conventions:

```markdown
### Code Conventions

#### Naming
- CSS classes: BEM with `c-` prefix (e.g., `c-card__title`)
- JavaScript: camelCase for variables, PascalCase for classes
- Files: kebab-case (e.g., `user-profile.js`)

#### Git
- Branch format: `feature/XXX-description` or `fix/XXX-description`
- Commit format: `type(scope): description`
- PR requires: 1 approval, passing tests

#### Documentation
- All new features require spec folder
- API changes require decision-record.md
- Breaking changes require migration guide
```

#### Code Quality Standards Links

Reference external documentation:

```markdown
### Code Quality Standards

Project standards are defined in:
- **CSS**: `docs/standards/css-conventions.md`
- **JavaScript**: `docs/standards/js-conventions.md`
- **Testing**: `docs/standards/testing-requirements.md`
- **Accessibility**: `docs/standards/a11y-checklist.md`

**Enforcement:** These standards override general practices. Check before proposing solutions.
```

#### Webflow-Specific Patterns (Front-end)

```markdown
### Webflow Integration

#### Class Naming
- Client classes: No prefix (Webflow default)
- Custom classes: `c-` prefix
- Utility classes: `u-` prefix
- State classes: `is-` or `has-` prefix

#### CMS Patterns
- Collection items: `[collection-name]_item`
- Dynamic content: Use embed blocks for custom JS
- Conditional visibility: Prefer Webflow native over JS

#### JavaScript Loading
- Global scripts: In project settings
- Page-specific: In page settings footer
- CMS template: In embed within collection
```

#### API Conventions (Backend)

```markdown
### API Standards

#### Endpoint Design
- RESTful: `/api/v1/[resource]/[id]/[sub-resource]`
- Use plural nouns: `/users` not `/user`
- Actions as verbs: `/users/:id/activate`

#### Response Format
```json
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 },
  "errors": []
}
```

#### Error Handling
- 4xx: Client errors with actionable message
- 5xx: Server errors with correlation ID
- Always include `error_code` for programmatic handling
```

### Validation: `phase_3_complete`

```bash
# Confirm AGENTS.md has been updated for your project type
grep -i "project type\|front-end\|backend\|full-stack" AGENTS.md

# Confirm tool references only include installed tools
cat opencode.json | jq '.mcp | keys'

# Confirm skill references match actual skills directory
ls .opencode/skill/
```

**Checklist:**
- [ ] Project type configuration complete (front-end, backend, or full-stack)?
- [ ] Confidence weights updated for project type?
- [ ] Tool Routing Decision Tree updated (removed missing tools)?
- [ ] Native MCP Tools Reference reflects installed tools only?
- [ ] Code Mode Tools Reference reflects `.utcp_config.json` contents?
- [ ] Skills table updated (removed skills not in `.opencode/skill/`)?
- [ ] Commands list reflects `.opencode/command/` directory?
- [ ] Project-specific conventions or patterns added?

❌ **STOP if validation fails** - Review each checklist item and fix mismatches between AGENTS.md references and your actual installed tools before continuing.

---

## 5. VERIFICATION

**Phase 4** confirms your customized AGENTS.md works correctly end-to-end.

### Validation Checklist

Run these quick checks to confirm the configuration is sound:

```bash
# Verify AGENTS.md exists and is readable
head -20 AGENTS.md

# Verify CLI compatibility shim works
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "help me debug CSS"
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-native "help me debug CSS"
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-local "help me debug CSS"

# Verify MCP tools are configured
cat opencode.json | jq '.mcp.servers | keys'

# Verify skills directory
ls .opencode/skill/

# Verify commands directory
ls .opencode/command/
```

Verify the native advisor tool surface in a hook-capable runtime or MCP console:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
advisor_recommend({"prompt":"help me debug CSS","options":{"topK":1}})
advisor_validate({"skillSlug":null})
```

If your runtime supports prompt hooks, start a fresh session and confirm the Skill Advisor Hook brief appears before falling back to the CLI shim. If you previously set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` for rollback testing, unset it before this check.

### Validation: `phase_4_complete`

```bash
# All commands should succeed:
head -5 AGENTS.md                                   # -> H1 title visible
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-native "save context"  # -> native advisor path
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-local "save context"   # -> Python fallback path
cat opencode.json | python3 -m json.tool            # -> valid JSON
ls .opencode/skill/                                 # -> skill directories listed
```

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})      -> freshness/trustState visible
advisor_recommend({"prompt":"save context","options":{"topK":1}}) -> recommendation surface visible
advisor_validate({"skillSlug":null})                               -> validation surface visible
```

**Checklist:**
- [ ] AGENTS.md is readable and starts with expected H1?
- [ ] Skill Advisor Hook brief or native advisor tools are available in the target runtime?
- [ ] `skill_advisor.py` fallback works for default, `--force-native`, and `--force-local` checks?
- [ ] `opencode.json` contains valid JSON?
- [ ] Tool references in AGENTS.md resolve to actual installed tools?
- [ ] Memory system accessible (no connection errors)?
- [ ] Spec folder workflow operates as expected?

❌ **STOP if validation fails** - Fix any mismatches between AGENTS.md references and your actual environment before testing with a live AI session.

### AI Agent Test

**Phase 5** confirms the AI agent reads and follows AGENTS.md correctly.

Start a new AI session and ask:

```text
What AGENTS.md file are you reading? What gates are defined? What skills are available?
```

Expected responses:
- Agent names the correct AGENTS.md location
- Agent lists the gates (Understanding, Skill Routing, Spec Folder)
- Agent lists only skills that exist in `.opencode/skill/`
- Agent does not reference tools that are not installed

### Success Criteria (`phase_5_complete`)

- [ ] AI reads AGENTS.md on session start
- [ ] Hook-first skill routing works (brief appears or fallback diagnostics pass)
- [ ] Tool references resolve to actual tools
- [ ] Memory system functions correctly
- [ ] Spec folder workflow operates as expected

❌ **STOP if validation fails** - If the AI references missing tools or skips gates, re-check your customization from Phase 3 and correct the mismatched references.

---

## 6. USAGE

### Gates Reference

Quick reference for the mandatory gates defined in AGENTS.md. Gates are checkpoints that AI agents must pass before taking actions.

**Gate Summary Table**

| Gate/Rule                               | Trigger                        | Action                                             | Block Type |
| --------------------------------------- | ------------------------------ | -------------------------------------------------- | ---------- |
| **Gate 1:** Understanding               | Each new user message          | `memory_match_triggers()` -> Classify intent       | SOFT       |
| **Gate 2:** Skill Routing               | Every task                     | Use hook brief when available -> else `skill_advisor.py` | REQUIRED   |
| **Gate 3:** Spec Folder                 | File modification detected     | Ask A/B/C/D options before tools                   | HARD BLOCK |
| **Memory Context Loading** (rule)       | User selects A or C in Gate 3  | Load memory when using existing spec folder        | SOFT       |
| **Memory Save Rule** (post-exec)        | "save context", "/memory:save" | Validate folder -> Execute `generate-context.js`   | HARD       |
| **Completion Verification** (post-exec) | Claiming "done", "complete"    | Load checklist.md -> Verify all items              | HARD       |

### Gate Flow Diagram

```text
User Message
     |
+---------------------------+
| Gate 1: Understanding     |---> memory_match_triggers() -> Classify intent
+----------+----------------+
           |
+---------------------------+
| Gate 2: Skill Routing     |---> Hook brief if available -> else skill_advisor.py
+----------+----------------+
           |
+---------------------------+
| Gate 3: Spec Folder       |---> File modification? -> Ask A/B/C/D
+----------+----------------+
           |
+---------------------------+
| Memory Context Loading    |---> Load memory for existing spec folder
+----------+----------------+
           |
        EXECUTE TASK
           |
+---------------------------+
| Memory Save Rule          |---> generate-context.js required
+----------+----------------+
           |
+---------------------------+
| Completion Verification   |---> Verify checklist.md
+----------+----------------+
           |
        CLAIM DONE
```

### Command Usage Examples

```bash
# Save context before ending session
/memory:save

# Search for prior work on authentication
/memory:search auth implementation

# Start a new feature with full workflow
/spec_kit:complete

# Resume work from yesterday
/spec_kit:resume

# Find code related to payments
/search:code payment processing
```

---

## 7. FEATURES

### Detailed Gates Table

| Gate                  | Trigger Condition              | Required Action                                  | What Happens if Skipped              |
| --------------------- | ------------------------------ | ------------------------------------------------ | ------------------------------------ |
| Gate 1: Understanding | Every new user message         | Run `memory_match_triggers()`, classify intent   | Missing context, potential wrong answer |
| Gate 2: Skill Routing | Every non-trivial task         | Use automatic hook brief when available; otherwise run `skill_advisor.py` with 0.8 threshold | Wrong tool used, quality degraded    |
| Gate 3: Spec Folder   | Any file modification detected | Ask A/B/C/D before any tool use                  | Untracked changes, no documentation  |

### Block Types Explained

| Block Type    | Meaning                           | User Action               |
| ------------- | --------------------------------- | ------------------------- |
| **HARD**      | Cannot proceed without resolution | Must respond or fix issue |
| **SOFT**      | Can be bypassed with [skip]       | Optional engagement       |
| **MANDATORY** | Always runs, cannot skip          | Automatic                 |

### Post-Execution Rules

**Memory Save Rule (HARD BLOCK)**
- Trigger: "save context", "save memory", `/memory:save`, continuity support artifact refresh
- If spec folder established at Gate 3, use it (do not re-ask)
- Script: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`
- Violation: Manually authored continuity support artifact under `memory/` means DELETE and re-run via script

**Completion Verification Rule (HARD BLOCK)**
- Trigger: Claiming "done", "complete", "finished", "works"
- Load `checklist.md` and verify ALL items with evidence
- Skip only for Level 1 tasks (no checklist.md required)

---

## 8. EXAMPLES

### Before/After Customization Examples

#### Example: Frontend Project (Webflow/CSS/JS)

**Before (Universal Template):**
- All 9 skills installed
- All 3 MCP servers configured
- All 19 commands available

**After (Frontend-Optimized):**

| Component             | Status | Items                 | Reason                      |
| --------------------- | ------ | --------------------- | --------------------------- |
| **Skills - Keep**     | Yes    | system-spec-kit       | Context preservation needed |
|                       | Yes    | mcp-chrome-devtools   | Browser debugging essential |
|                       | Yes    | sk-code          | Implementation workflow     |
|                       | Yes    | mcp-code-mode         | Webflow/Figma integration   |
| **Skills - Remove**   | No     | sk-git                | Optional for solo projects  |
| **MCP - Keep**        | Yes    | spec_kit_memory       | Required for spec-kit skill |
|                       | Yes    | code_mode             | External tool access        |
| **MCP - Remove**      | No     | sequential_thinking   | Overkill for frontend       |
| **Commands - Keep**   | Yes    | /memory:*             | Context preservation        |
|                       | Yes    | /spec_kit:*           | Documentation workflow      |
| **Commands - Remove** | No     | /search:*             | Using simple grep instead   |

---

#### Example: Backend API Project

**Before (Universal Template):**
- All 9 skills installed
- All 3 MCP servers configured

**After (Backend-Optimized):**

| Component           | Status | Items               | Reason                           |
| ------------------- | ------ | ------------------- | -------------------------------- |
| **Skills - Keep**   | Yes    | system-spec-kit     | Research context preservation    |
|                     | Yes    | sk-code        | Implementation lifecycle         |
|                     | Yes    | sk-git              | PR/commit workflows              |
| **Skills - Remove** | No     | mcp-chrome-devtools | No browser UI                    |
|                     | No     | mcp-code-mode       | No Webflow/Figma needed          |
| **MCP - Keep**      | Yes    | spec_kit_memory     | Context preservation             |
|                     | Yes    | sequential_thinking | Complex reasoning                |
| **MCP - Remove**    | No     | code_mode           | No external design tools         |

---

#### Example: Minimal AGENTS.md Structure

When stripping AGENTS.md to essentials, follow this structure:

```markdown
# AI Agent Framework

## 1. CRITICAL RULES
[Keep: Core rules, gates, mandatory behaviors]

## 2. MANDATORY GATES
[Keep: All gates - these are universal]

## 3. DOCUMENTATION
[Customize: Spec folder paths, templates]

## 4. CONFIDENCE FRAMEWORK
[Customize: Weights for project type]

## 5. SOLUTION FRAMEWORK
[Customize: Project-specific standards]

## 6. TOOL SYSTEM
[Customize: Only installed tools]

## 7. SKILLS SYSTEM
[Customize: Only available skills]
```

---

## 9. TROUBLESHOOTING

### "Tool not found" Errors

**Error:** `Error: tool 'webflow_sites_list' not found` or similar tool resolution errors.

**Cause:** AGENTS.md references a tool (e.g., Webflow, Figma, ClickUp) that is not configured in `.utcp_config.json` or the Code Mode MCP server is not running.

**Fix:**

```bash
# Check what tools are actually configured
cat .utcp_config.json | jq '.manuals | keys'

# Check Code Mode MCP server status
cat opencode.json | jq '.mcp["code-mode"]'
```

Remove any tool references from AGENTS.md that do not appear in the output above.

---

### Skill Routing Fails

**Error:** Gate 2 hook routing does not activate, or `skill_advisor.py` returns no recommendation.

**Cause:** The runtime hook/plugin path is not wired, native advisor tools are unavailable or disabled, or the `skill_advisor.py` compatibility shim is missing or misconfigured.

**Fix:**

```bash
# Verify skill_advisor.py exists
ls .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py

# Test native delegation through the compat shim
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-native "save my context"

# Test local fallback explicitly
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --force-local "save my context"

# If rollback testing disabled hook-first behavior, restore it
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED

# List actual skills installed
ls .opencode/skill/
```

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
advisor_recommend({"prompt":"save my context","options":{"topK":1}})
```

If `--force-native` fails but `--force-local` succeeds, recheck runtime MCP/bootstrap wiring. If both CLI modes work but the hook brief is still absent, inspect the runtime's hook/plugin registration.

Update the skills table in AGENTS.md to match only what is installed.

---

### Wrong Confidence Weights Applied

**Error:** AI agent proceeds when it should ask, or asks when it should proceed.

**Cause:** Confidence weight table in AGENTS.md does not match the project type. Full-stack weights applied to a front-end project, for example, will skew routing.

**Fix:**

```markdown
# In AGENTS.md, locate your confidence weights section and replace with project-specific values.
# Front-end: increase Accessibility to 15%, decrease API/Component design to 15%.
# Backend: increase Type safety/Security to 20%, decrease Accessibility to 5%.
# Full-stack: use default balanced weights.
```

Refer to the weight tables in Section 4.1 of this guide.

---

### Memory Not Surfacing Context

**Error:** AI agent does not recall prior decisions, or `memory_match_triggers()` returns no results.

**Cause:** Trigger phrases in AGENTS.md do not match the phrases used when memory was saved, or the memory index is out of date.

**Fix:**

```bash
# Check what memories exist
# (Run inside an AI session)
# memory_list()

# Rebuild the index if stale
# memory_index_scan({ force: true })

# Check trigger phrases in your AGENTS.md Gate 1 section
grep -i "memory_match_triggers" AGENTS.md
```

Ensure the trigger phrases in your AGENTS.md align with the terms you use when saving context.

---

### Gate 3 Spec Folder Not Prompted

**Error:** AI starts modifying files without asking which spec folder to use.

**Cause:** Gate 3 documentation is missing or incomplete in AGENTS.md. The gate trigger list must include "rename", "move", "create", "update", "modify", "edit", "fix", "implement", "write", and other modification verbs.

**Fix:**

```bash
# Verify Gate 3 is documented in AGENTS.md
grep -A 10 "GATE 3\|Gate 3\|Spec Folder" AGENTS.md
```

If Gate 3 is missing or has incomplete triggers, restore it from the universal template at `AGENTS (Template).md`.

---

### Gate Flow Broken or Skipped

**Error:** AI agent skips gates, does not call `memory_match_triggers()`, or goes straight to execution.

**Cause:** Gate documentation section is malformed, has missing trigger conditions, or the agent is using a cached version of AGENTS.md from before your customization.

**Fix:**

```bash
# Confirm Gate documentation is present and correctly formatted
grep -n "Gate 1\|Gate 2\|Gate 3\|GATE 1\|GATE 2\|GATE 3" AGENTS.md

# Restart your AI client to force a fresh read of AGENTS.md
# Then start a new session and ask:
# "What gates are defined in AGENTS.md?"
```

If gates are missing, restore from `AGENTS (Template).md` and re-apply your customizations from Phase 3.

---

### Commands Not Recognized

**Error:** `/memory:save` or other slash commands return "command not found".

**Cause:** The command file does not exist in `.opencode/command/`, or the command path is incorrect.

**Fix:**

```bash
# List all available commands
ls .opencode/command/

# Check a specific command exists
ls .opencode/command/memory/save.md

# Verify the commands directory structure
find .opencode/commands -name "*.md" | head -20
```

Update AGENTS.md to reference only the commands that exist in your `.opencode/command/` directory.

---

## 10. RESOURCES

### Quick Reference: Current Installation Summary

| Category          | Count  | Items                                                                                                                       |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Skills**        | 17     | mcp-chrome-devtools, mcp-coco-index, mcp-code-mode, mcp-figma, system-spec-kit, cli-codex, cli-copilot, cli-claude-code, cli-gemini, sk-code, sk-code-opencode, sk-code-review, sk-code, sk-deep-research, sk-doc, sk-git, sk-improve-prompt |
| **MCP Servers**   | 3      | sequential-thinking, spec-kit-memory, code-mode                                                                             |
| **Commands**      | 22     | /create:* (7), /memory:* (6), /spec_kit:* (8), agent_router (1)                                                             |
| **Gates + Rules** | 3 + 3  | Gate 1-3 (Understanding, Skill Routing, Spec Folder) + Behavioral Rules (Memory Context Loading, Memory Save Rule, Completion Verification) |

### File Size Guidelines

| Section           | Recommended Lines |
| ----------------- | ----------------- |
| §1 Critical Rules | 40-60             |
| §2 Gates          | 80-100            |
| §3 Documentation  | 60-80             |
| §4 Confidence     | 50-70             |
| §5 Solution       | 80-100            |
| §6 Tools          | 80-120            |
| §7 Skills         | 60-100            |
| **Total**         | **450-630**       |

### Phase Checkpoint Summary

| Checkpoint         | What It Validates                                  |
| ------------------ | -------------------------------------------------- |
| `phase_1_complete` | MCP servers audited, skills directory listed       |
| `phase_2_complete` | AGENTS.md renamed and located in project root      |
| `phase_3_complete` | Customization for project type complete            |
| `phase_4_complete` | Validation checklist passes                        |
| `phase_5_complete` | AI agent reads AGENTS.md and follows gates correctly |

### Related Files

| File                                          | Purpose                                  |
| --------------------------------------------- | ---------------------------------------- |
| `AGENTS (Universal).md`                       | Source template for all project types    |
| `AGENTS (Template).md`                        | Your saved reference copy                |
| `opencode.json`                               | Native MCP server configuration          |
| `.utcp_config.json`                           | Code Mode external tools configuration   |
| `.opencode/skill/`                            | Installed skills directory               |
| `.opencode/command/`                          | Available slash commands directory       |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`    | Gate 2 compatibility shim and diagnostics |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/INSTALL_GUIDE.md`             | Native advisor bootstrap, verification, and rollback |

### External Links

- **Master Installation Guide**: [./README.md](./README.md)
- **OpenCode Documentation**: [https://opencode.ai/docs](https://opencode.ai/docs)
- **Spec Kit Memory Guide**: [./MCP - Spec Kit Memory.md](./MCP%20-%20Spec%20Kit%20Memory.md)
- **Code Mode Guide**: [./MCP - Code Mode.md](./MCP%20-%20Code%20Mode.md)

---

*Last updated: February 2026*
