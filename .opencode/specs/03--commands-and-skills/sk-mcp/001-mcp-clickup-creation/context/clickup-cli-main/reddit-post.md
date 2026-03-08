# I built a ClickUp CLI for AI agents and terminal workflows

I wanted my AI coding agents (Claude Code, Codex, etc.) to work with ClickUp directly. Fetch task descriptions for context, reference ticket IDs in commits, update statuses, post comments - close the loop without browser copy-paste.

Switching to the browser for every little task update was slowing me down, so I built `cu`: an open source ClickUp CLI. It is agent-friendly and still useful as a normal human CLI.

**Why a CLI and not an MCP server?** I tried both directions. For my workflow, a CLI + skill/instruction file worked better. The agent already knows shell commands, and the skill file teaches command patterns. Less moving parts, no extra protocol layer, no additional server process for every tool. The repo includes a ready-to-use skill file for Claude Code, OpenCode, Codex, and similar setups.

**The core idea:** when piped or called with `--json`, everything outputs machine-readable JSON. When you run it in a terminal, you get interactive tables with a task picker and detail views. Same tool, two modes.

**Scoped output, not a firehose.** Most commands are scoped to your assigned tasks by default. `cu tasks`, `cu sprint`, `cu overdue`, `cu summary` - all of these only show what's assigned to you. `cu spaces --my` filters to spaces where you have tasks. This matters for agents especially - you do not want your whole workspace dumped into context.

For me this removed a lot of browser context switching. What used to be a sequence of tabs and copy-paste is now a couple of terminal commands.

## What it does

20 commands. Here are the ones I use most:

- `cu tasks --status "in progress"` - list my tasks, filter by status/name/list/space
- `cu sprint` - auto-detects the active sprint from folder names and shows my tasks in it
- `cu task abc123` - full task details (description, assignees, priority, dates, everything)
- `cu update abc123 -s "done"` - update status, priority, due date, assignees
- `cu create -n "Fix the thing" -p <parentTaskId>` - create subtasks (list auto-detected from parent)
- `cu summary` - standup helper that groups tasks into completed/in-progress/overdue
- `cu open "login bug"` - fuzzy search by name, opens in browser
- `cu overdue` - what it sounds like
- `cu assign abc123 --to me` - assign yourself without looking up your user ID
- `cu completion bash/zsh/fish` - shell completions for everything

All write commands (`update`, `create`, `comment`, `assign`) return JSON, so agents can parse the result and keep going.

## How I actually use it

My AI agents have a skill file (included in the repo) that teaches them the CLI. When an agent picks up a task:

Typical prompts I give agents:

- "Check all tasks under initiative `<id>` and improve task descriptions."
- "Update status for task `Setting up CI`."
- "Do exploratory work for task `Implement X`, improve the description with findings, highlight blockers with comments, and tag me."

Under the hood that usually becomes calls like:

```bash
# Agent reads the task description for context
cu task abc123 --json | jq '.description'

# Agent explores related tasks/subtasks
cu subtasks abc123 --json

# Does the work...

# Updates status and posts a comment
cu update abc123 -s "in review"
cu comment abc123 -m "Fixed in commit abc1234"
```

No browser, no copy-paste, no context switching. The agent just calls `cu` and gets what it needs.

## Install

```bash
npm install -g @krodak/clickup-cli
cu init    # walks you through API token setup
```

Needs Node 22+ and a personal API token from ClickUp settings.

## Links

- GitHub: https://github.com/krodak/clickup-cli
- npm: https://www.npmjs.com/package/@krodak/clickup-cli

It's MIT licensed and actively used in my daily workflow.

If you use ClickUp with AI agents, I would love to hear your setup. What workflow am I missing?
