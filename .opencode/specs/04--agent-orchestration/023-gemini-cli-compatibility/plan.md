---
title: "Implementation Plan: Gemini CLI Compatibility [023-gemini-cli-compatibility/plan]"
description: "Add a Gemini CLI runtime layer to the existing multi-provider OpenCode architecture. This creates a .gemini/ directory with adapted agent definitions, TOML command wrappers, ski..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "gemini"
  - "cli"
  - "compatibility"
  - "023"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Gemini CLI Compatibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (symlinks), JSON (settings), TOML (commands), Markdown (agents) |
| **Framework** | Gemini CLI (Google) |
| **Storage** | File system (symlinks, config files) |
| **Testing** | Manual verification (symlink resolution, gemini CLI validation) |

### Overview
Add a Gemini CLI runtime layer to the existing multi-provider OpenCode architecture. This creates a `.gemini/` directory with adapted agent definitions, TOML command wrappers, skill symlinks, and configuration files — following the same provider pattern used for `.claude/`. No existing `.opencode/` source files are modified; the Gemini layer is purely additive, referencing shared content via symlinks and `@{file}` injection.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (SC-001 through SC-008)
- [ ] All symlinks resolve with no broken links
- [ ] `.gemini/settings.json` validates as well-formed JSON
- [ ] All agent `.md` files have valid Gemini YAML frontmatter
- [ ] All command `.toml` files are valid TOML
- [ ] AGENTS.md §7 updated with Gemini row
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Multi-Provider Runtime Adapter (existing pattern — mirrors `.claude/` provider layer)

### Key Components
- **`.gemini/settings.json`**: Main config file (`enableAgents`, `mcpServers`, `skills`, `context fileName`)
- **`.gemini/agents/`**: 8+ adapted agent `.md` files with Gemini-native frontmatter (tools array, Gemini model IDs, `max_turns`, `timeout_mins`)
- **`.gemini/commands/`**: TOML wrapper files using `@{path}` injection to reference OpenCode command content
- **`.gemini/skills/`**: Relative symlinks to `.opencode/skill/` directories (shared, not duplicated)
- **`GEMINI.md`**: Symlink to `AGENTS.md` at project root (behavioral framework entry point)
- **`.gemini/specs`**: Symlink to `../.opencode/specs` for spec access from Gemini context
- **`.opencode/agent/gemini/`**: 8+ agent files for runtime path resolution (consistent with OpenCode directory convention)

### Data Flow
1. Gemini CLI starts → reads `.gemini/settings.json` → enables agents, loads MCP servers
2. Gemini CLI reads `GEMINI.md` → follows symlink to `AGENTS.md` → behavioral framework loaded
3. User invokes `/spec_kit:plan` → reads `.gemini/commands/spec_kit/plan.toml` → `@{path}` injection pulls OpenCode command content
4. Model activates skill → reads `.gemini/skills/sk-doc/SKILL.md` → follows symlink to `.opencode/skill/` source
5. Model dispatches subagent → reads `.gemini/agents/research.md` → executes with Gemini frontmatter config
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Foundation Setup
- [ ] Create `.gemini/` directory at project root
- [ ] Create `.gemini/agents/` directory
- [ ] Create `.gemini/commands/` directory with subdirectories: `spec_kit/`, `memory/`, `create/`
- [ ] Create `.gemini/skills/` directory
- [ ] Create `GEMINI.md` symlink → `AGENTS.md` at project root
- [ ] Create `.gemini/specs` symlink → `../.opencode/specs`
- [ ] Create `.gemini/settings.json` with full config:
```json
{
  "experimental": {
    "enableAgents": true,
    "codebaseInvestigatorSettings": {
      "enabled": true,
      "maxNumTurns": 20,
      "model": "gemini-2.5-pro"
    }
  },
  "skills": {
    "enabled": true
  },
  "context": {
    "fileName": ["GEMINI.md", "AGENTS.md"]
  },
  "mcpServers": {
    "sequential_thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "spec_kit_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
      "env": {
        "EMBEDDINGS_PROVIDER": "auto",
        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite"
      }
    },
    "code_mode": {
      "command": "node",
      "args": [".opencode/skill/mcp-code-mode/mcp_server/dist/index.js"],
      "env": {
        "UTCP_CONFIG_FILE": ".utcp_config.json"
      }
    }
  }
}
```

### Phase 2: Agent Adaptation

Create 8 agent files in `.gemini/agents/` using Gemini-native frontmatter.

**Frontmatter mapping (OpenCode → Gemini):**

| OpenCode Field | Gemini Field | Conversion Rule |
|---|---|---|
| `name:` | `name:` | Keep same |
| `description:` | `description:` | Keep same |
| (none) | `kind: local` | Add for all agents |
| `permission:` map | `tools:` array | Convert allow → tool name, deny → omit |
| `mode: primary/subagent` | (none) | Drop — Gemini has no equivalent |
| `model:` | `model:` | Replace with Gemini model ID |
| `temperature:` | `temperature:` | Keep same |
| (none) | `max_turns:` | Add: 15 default, 25 for orchestrate |
| (none) | `timeout_mins:` | Add: 5 default, 10 for research/debug |

**Permission → Tools mapping:**

| OpenCode Permission | Gemini Tool Name |
|---|---|
| `read: allow` | `read_file`, `read_many_files` |
| `write: allow` | `write_file` |
| `edit: allow` | `edit_file` |
| `bash: allow` | `run_shell_command` |
| `grep: allow` | `grep_search` |
| `glob: allow` | `list_directory` |
| `webfetch: allow` | `web_search` |

**8 Agent files to create:**

- [ ] **orchestrate.md** — tools: `[read_file]`, model: `gemini-2.5-pro`, `max_turns: 25`, `timeout_mins: 10`. Body from `.opencode/agent/orchestrate.md`, add Gemini Optimization Profile section, replace path convention to `.gemini/agents/*.md`
- [ ] **context.md** — tools: `[read_file, read_many_files, grep_search, list_directory]`, model: `gemini-2.5-flash`, `max_turns: 15`. Body from `.opencode/agent/context.md`
- [ ] **debug.md** — tools: `[read_file, write_file, edit_file, run_shell_command, grep_search, list_directory]`, model: `gemini-2.5-pro`, `max_turns: 15`, `timeout_mins: 10`. Body from `.opencode/agent/debug.md`
- [ ] **research.md** — tools: `[read_file, write_file, edit_file, run_shell_command, grep_search, list_directory, web_search]`, model: `gemini-2.5-pro`, `max_turns: 15`, `timeout_mins: 10`. Body from `.opencode/agent/research.md`
- [ ] **review.md** — tools: `[read_file, grep_search, list_directory]`, model: `gemini-2.5-flash`, `max_turns: 15`. Body from `.opencode/agent/review.md`
- [ ] **speckit.md** — tools: `[read_file, write_file, edit_file, run_shell_command, grep_search, list_directory]`, model: `gemini-2.5-flash`, `max_turns: 15`. Body from `.opencode/agent/speckit.md`
- [ ] **write.md** — tools: `[read_file, write_file, edit_file, run_shell_command, grep_search, list_directory, web_search]`, model: `gemini-2.5-flash`, `max_turns: 15`. Body from `.opencode/agent/write.md`
- [ ] **handover.md** — tools: `[read_file, write_file, edit_file, run_shell_command, grep_search, list_directory]`, model: `gemini-2.5-flash`, `max_turns: 15`. Body from `.opencode/agent/handover.md`

### Phase 3: Skill Symlinks

Create 10 relative symlinks from `.gemini/skills/` to `.opencode/skill/`:

- [ ] `.gemini/skills/mcp-code-mode` → `../../.opencode/skill/mcp-code-mode`
- [ ] `.gemini/skills/mcp-figma` → `../../.opencode/skill/mcp-figma`
- [ ] `.gemini/skills/system-spec-kit` → `../../.opencode/skill/system-spec-kit`
- [ ] `.gemini/skills/mcp-chrome-devtools` → `../../.opencode/skill/mcp-chrome-devtools`
- [ ] `.gemini/skills/sk-code--full-stack` → `../../.opencode/skill/sk-code--full-stack`
- [ ] `.gemini/skills/sk-code--opencode` → `../../.opencode/skill/sk-code--opencode`
- [ ] `.gemini/skills/workflows-code--web-dev` → `../../.opencode/skill/workflows-code--web-dev`
- [ ] `.gemini/skills/sk-doc` → `../../.opencode/skill/sk-doc`
- [ ] `.gemini/skills/sk-git` → `../../.opencode/skill/sk-git`
- [ ] `.gemini/skills/scripts` → `../../.opencode/skill/scripts`

### Phase 4: Command TOML Wrappers

Create 19 TOML files using the `@{file}` injection pattern:

```toml
description = "[from OpenCode frontmatter description]"
prompt = """@{../../.opencode/command/[namespace]/[command].md}

User request: {{args}}"""
```

**spec_kit/ namespace (7 files):**
- [ ] `.gemini/commands/spec_kit/plan.toml`
- [ ] `.gemini/commands/spec_kit/implement.toml`
- [ ] `.gemini/commands/spec_kit/complete.toml`
- [ ] `.gemini/commands/spec_kit/research.toml`
- [ ] `.gemini/commands/spec_kit/resume.toml`
- [ ] `.gemini/commands/spec_kit/debug.toml`
- [ ] `.gemini/commands/spec_kit/handover.toml`

**memory/ namespace (5 files):**
- [ ] `.gemini/commands/memory/save.toml`
- [ ] `.gemini/commands/memory/context.toml`
- [ ] `.gemini/commands/memory/manage.toml`
- [ ] `.gemini/commands/memory/learn.toml`
- [ ] `.gemini/commands/memory/continue.toml`

**create/ namespace (6 files):**
- [ ] `.gemini/commands/create/agent.toml`
- [ ] `.gemini/commands/create/skill.toml`
- [ ] `.gemini/commands/create/install_guide.toml`
- [ ] `.gemini/commands/create/folder_readme.toml`
- [ ] `.gemini/commands/create/skill_reference.toml`
- [ ] `.gemini/commands/create/skill_asset.toml`

**Root level (1 file):**
- [ ] `.gemini/commands/agent_router.toml`

### Phase 5: Reference Updates

- [ ] **AGENTS.md §7** — Add Gemini row to runtime agent directory table:
  ```
  | **Gemini CLI** | `.gemini/agents/` | Load Gemini-specific agent definitions from this directory |
  ```
- [ ] **`.opencode/command/create/agent.md`** — Add Gemini to runtime path resolution list:
  ```
  - Gemini CLI: .gemini/agents
  ```

### Phase 6: Verification

- [ ] All symlinks resolve (`find .gemini -type l -exec test -e {} \; -print`)
- [ ] `GEMINI.md` resolves to `AGENTS.md` content (`readlink GEMINI.md` = `AGENTS.md`)
- [ ] `.gemini/settings.json` is valid JSON (`python3 -c "import json; json.load(open('.gemini/settings.json'))"`)
- [ ] All agent `.md` files have valid YAML frontmatter (grep `---` blocks, inspect manually)
- [ ] All command `.toml` files are valid TOML (`python3 -c "import tomllib; ..."` for each)
- [ ] AGENTS.md §7 contains Gemini row
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Symlink validation | All symlinks in `.gemini/` resolve correctly | `find .gemini -type l`, `readlink`, `test -e` |
| JSON validation | `.gemini/settings.json` is well-formed | `python3 -c "import json; json.load(open('.gemini/settings.json'))"` |
| TOML validation | All 19 `.toml` files parse correctly | `python3 -c "import tomllib; tomllib.load(open(f, 'rb'))"` per file |
| YAML frontmatter | Agent `.md` files have valid frontmatter | Manual inspection of `---` blocks, or `gemini --list-agents` |
| Integration | Gemini CLI reads agents/skills/commands | `gemini agents list`, `/skills list` (requires Gemini CLI installed) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/` directories | Internal | Green | Skill symlinks would be broken |
| `.opencode/command/` files | Internal | Green | TOML `@{file}` injection would fail at runtime |
| `.opencode/agent/` base files | Internal | Green | Agent body content unavailable for adaptation |
| `AGENTS.md` | Internal | Green | Runtime resolution table entry incomplete |
| Gemini CLI installation | External | Yellow | Integration testing impossible; file structure validation still possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken symlinks unresolvable, invalid config incompatible with Gemini CLI, or fundamental schema incompatibility discovered
- **Procedure**: `rm -rf .gemini/ GEMINI.md` at project root + revert `AGENTS.md` and `.opencode/command/create/agent.md` changes via git
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Foundation) ──┐
                       ├──► Phase 2 (Agents)   ──┐
                       ├──► Phase 3 (Skills)   ──┤
                       ├──► Phase 4 (Commands) ──┤──► Phase 6 (Verify)
                       └──► Phase 5 (Refs)     ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Foundation | None | Agents, Skills, Commands, Refs |
| Agents | Foundation | Verify |
| Skills | Foundation | Verify |
| Commands | Foundation | Verify |
| Refs | Foundation | Verify |
| Verify | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Foundation Setup | Low | Quick — mkdir + JSON + 2 symlinks |
| Agent Adaptation | Medium | Moderate — 8 files, frontmatter conversion + body edits |
| Skill Symlinks | Low | Quick — 10 symlinks |
| Command TOMLs | Medium | Moderate — 19 TOML files from template |
| Reference Updates | Low | Quick — 2 small edits to existing files |
| Verification | Low | Quick — automated checks |
| **Total** | | **Medium overall** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All changes are in new files/directories — no existing source files modified except `AGENTS.md` and `.opencode/command/create/agent.md`
- [ ] No data migrations involved (pure file/config additions)
- [ ] Git status confirmed clean before starting (changes traceable via `git diff`)

### Rollback Procedure
1. Remove `.gemini/` directory: `rm -rf .gemini/`
2. Remove `GEMINI.md` symlink: `rm GEMINI.md`
3. Revert `AGENTS.md` changes: `git checkout AGENTS.md`
4. Revert `.opencode/command/create/agent.md`: `git checkout .opencode/command/create/agent.md`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are additive file/directory/symlink operations with no state mutation
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
