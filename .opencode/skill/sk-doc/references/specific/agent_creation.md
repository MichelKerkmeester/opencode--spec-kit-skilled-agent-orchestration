---
title: Agent Creation - Standards and Workflow
description: Standards and workflow guidance for creating OpenCode agents with runtime-aware placement, unified permission frontmatter, clear authority boundaries, and validation-first delivery.
---

# Agent Creation - Standards and Workflow

Standards and workflow guidance for creating OpenCode agents with runtime-aware placement, unified permission frontmatter, clear authority boundaries, and validation-first delivery.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Agent creation is for cases where the system needs a named AI persona with explicit authority, tool permissions, and operating rules. Agents are not just documentation shells. They shape how work is delegated, what tools are allowed, and what safety boundaries apply at runtime.

**Core Principle**: Create an agent only when the role needs authority and tool policy. Put reusable knowledge and templates in skills, not in agents.

**Primary Sources**:
- [agent_template.md](../../assets/agents/agent_template.md)
- `.opencode/command/create/agent.md`
- `.opencode/command/create/assets/create_agent_auto.yaml`
- `.opencode/command/create/assets/create_agent_confirm.yaml`

**Current Reality Highlights**:
- agents live under the active runtime agent directory, not under `sk-doc`
- the frontmatter contract uses the unified `permission:` object
- the deprecated standalone `tools:` object is no longer the canonical contract
- `@write /create:agent` is the preferred creation workflow for new agents

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-an-agent -->
## 2. WHEN TO CREATE AN AGENT

Create an agent when the system needs a durable role with authority and operating constraints.

**Strong signals**:
- the role needs explicit tool permissions
- the role needs behavioral constraints that should apply every time
- the role should be invokable by name as a stable persona
- the role needs orchestration authority or must be denied orchestration authority
- the same execution posture will be reused across many tasks

**Use a lighter alternative when**:
- the request only needs reusable knowledge or workflow guidance
- the task can be handled by an existing agent plus a skill
- the only goal is scaffolding or content generation without a new runtime role

Decision rule:

```text
Need a named runtime persona with authority and tool policy?
  YES -> Create an agent
  NO  -> Use or create a skill, template, or command instead
```

<!-- /ANCHOR:when-to-create-an-agent -->
<!-- ANCHOR:agent-vs-skill-vs-command -->
## 3. AGENT VS SKILL VS COMMAND

Choose the component type before authoring.

| Component | Primary Question | Use It When |
|---|---|---|
| Agent | Who should do this work? | A stable persona needs authority, permissions, and operating rules |
| Skill | How should the work be done? | Reusable knowledge, standards, templates, or workflows are needed |
| Command | How should a user trigger a workflow? | A slash command should gather inputs and launch a repeatable procedure |

**Practical rule**:
- create an **agent** for role and authority
- create a **skill** for reusable knowledge and references
- create a **command** for user-triggered workflow entry

**Common healthy pairing**:
- agent provides the persona and boundaries
- skill provides the detailed domain knowledge
- command provides the ergonomic entry point

<!-- /ANCHOR:agent-vs-skill-vs-command -->
<!-- ANCHOR:canonical-file-contract -->
## 4. CANONICAL FILE CONTRACT

The canonical agent file is one markdown file in the active runtime agent directory.

Examples:

```text
.opencode/agent/my-agent.md
.claude/agents/my-agent.md
.codex/agents/my-agent.md
.gemini/agents/my-agent.md
```

**Invariants**:
- filename is kebab-case and matches the `name` field
- file extension is `.md`
- placement must match the active runtime profile
- agent content should be self-sufficient for its role and boundaries

**Runtime placement rule**:
- Copilot/default OpenCode profile -> `.opencode/agent/`
- Claude profile -> `.claude/agents/`
- Codex CLI profile -> `.codex/agents/`
- Gemini CLI profile -> `.gemini/agents/`

Do not create the file in one runtime directory and document it as if it belongs to another. The runtime path is part of the contract.

<!-- /ANCHOR:canonical-file-contract -->
<!-- ANCHOR:frontmatter-and-permission-design -->
## 5. FRONTMATTER AND PERMISSION DESIGN

Every agent must start with valid YAML frontmatter.

Canonical shape:

```yaml
---
name: my-agent
description: One-line purpose statement
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
  task: deny
  list: allow
  patch: deny
  external_directory: allow
---
```

**Field rules**:
- `name` must match the filename stem
- `description` should describe role and scope in one line
- `mode` must be `subagent`, `agent`, or `all`
- `temperature` should reflect determinism needs
- `permission` must be explicit and justified by the role

### Permission Design Rules

- default to the least authority that still enables the job
- set `task: allow` only for agents that should orchestrate others
- deny high-risk tools unless the role clearly needs them
- keep permission choices aligned with the role description and workflow

### Current-Contract Reminder

Do not treat the old standalone `tools:` object as canonical. Use the unified `permission:` object.

<!-- /ANCHOR:frontmatter-and-permission-design -->
<!-- ANCHOR:required-content-sections -->
## 6. REQUIRED CONTENT SECTIONS

Use [agent_template.md](../../assets/agents/agent_template.md) as the scaffold.

At minimum, production-ready agents should include:
- a core workflow section
- a capability scan section
- an output verification section
- an anti-patterns section
- a related resources section

**Content expectations**:
- workflows should describe how the agent thinks and acts
- capability scan should identify the relevant skills, tools, or supporting agents
- output verification should define what must be checked before claiming completion
- anti-patterns should make failure modes explicit
- related resources should point to the commands, skills, and agents that support the role

**Authoring rule**:
- keep the agent focused on its role
- do not paste full skill guidance into the agent body
- link to supporting skills and references instead of duplicating them

<!-- /ANCHOR:required-content-sections -->
<!-- ANCHOR:authoring-workflow -->
## 7. AUTHORING WORKFLOW

Recommended workflow:

1. Define the agent's role, authority boundaries, and runtime directory.
2. Decide whether the task truly needs a new agent instead of a skill or command.
3. Start from [agent_template.md](../../assets/agents/agent_template.md).
4. Set frontmatter first, especially `mode` and `permission`.
5. Write the core workflow and capability scan.
6. Add explicit output verification and anti-patterns.
7. Link the supporting skills, commands, and companion agents.
8. Validate the markdown and sanity-check runtime-path placement.

**Preferred entry point**:
- run `@write /create:agent ...` so the workflow can use the existing creation command and YAML execution guides

**Authoring order matters**:
- decide authority before drafting prose
- decide permissions before adding tool-heavy instructions
- finish workflow and verification before polishing summary language

<!-- /ANCHOR:authoring-workflow -->
<!-- ANCHOR:validation-and-delivery -->
## 8. VALIDATION AND DELIVERY

Before delivery, verify both document quality and runtime correctness.

**Document checks**:
- frontmatter parses correctly
- filename and `name` field match
- required sections are present
- markdown links resolve

**Runtime checks**:
- the file is placed in the correct runtime agent directory
- permissions match the intended authority
- orchestration permissions are correct for the role
- related resources point to real supporting files

**Preferred workflow**:
- validate the file as markdown
- inspect the final frontmatter literally
- compare the role description, workflow, and permissions for consistency

<!-- /ANCHOR:validation-and-delivery -->
<!-- ANCHOR:common-mistakes -->
## 9. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Creating an agent for reusable knowledge only | Authority and persona are unnecessary overhead | Create or extend a skill instead |
| Using the wrong runtime agent directory | The runtime will not resolve the file as intended | Place the file under the active runtime path |
| Mismatching filename and `name` | Invocation and identity drift apart | Keep the filename stem and `name` identical |
| Over-permissive `permission` values | The role can do more than its contract allows | Reduce permissions to the least authority needed |
| Giving `task: allow` to a non-orchestrator | Delegation authority leaks into a leaf role | Deny `task` unless orchestration is intentional |
| Copying skill reference content into the agent body | The agent becomes bloated and hard to maintain | Keep deep guidance in skills and link to them |
| Using deprecated frontmatter conventions | The file drifts from current runtime expectations | Use the unified `permission:` contract |

<!-- /ANCHOR:common-mistakes -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

- [agent_template.md](../../assets/agents/agent_template.md) - canonical agent scaffold
- [command_template.md](../../assets/agents/command_template.md) - companion scaffold for slash-command entry points
- [skill_creation.md](./skill_creation.md) - companion workflow for reusable knowledge bundles
- [quick_reference.md](../global/quick_reference.md) - condensed commands and file locations
- [workflows.md](../global/workflows.md) - execution-mode reference
- `.opencode/command/create/agent.md` - preferred command-driven creation workflow

<!-- /ANCHOR:related-resources -->
