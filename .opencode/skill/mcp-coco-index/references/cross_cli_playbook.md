---
title: CocoIndex Cross-CLI Playbook
description: Canonical AI operating guide for using CocoIndex safely and consistently across CLI environments.
trigger_phrases:
  - cross cli cocoindex
  - cocoindex playbook
  - cocoindex troubleshooting
  - refresh_index false
  - multi query cocoindex
---

# CocoIndex Cross-CLI Playbook

Canonical AI usage guide for CocoIndex across Claude, Gemini, Copilot, Codex, and OpenCode-style environments.

---

## 1. OVERVIEW

Use this reference when an agent or operator needs a stable, cross-CLI operating pattern for CocoIndex search, readiness checks, and troubleshooting. It captures the safe defaults that held up during the shared-repo hardening work:

- start with readiness checks when setup is uncertain
- use CocoIndex for concept search and Grep for exact text
- switch follow-up MCP queries to `refresh_index=false` unless code changed
- treat sibling-repo adoption as payload plus config wiring, not advisor heuristics alone

---

## 2. DEFAULT FLOW

Use this ladder by default:

1. Run `doctor.sh` when readiness is unclear.
2. Run `ensure_ready.sh` when the binary or index is missing.
3. Use CocoIndex `search` for concept-based discovery.
4. Verify promising hits with `Read`.
5. Use `Grep` for exact-match confirmation.

### Ready Check

```bash
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --json
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --strict --require-config
```

### Bootstrap

```bash
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --refresh-index
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
```

---

## 3. QUERY RECIPE

### First Query in a Session

- Start with a short concept phrase: 3-5 words.
- Default to `limit=5` for MCP or `--limit 5` for CLI.
- Add `languages` / `--lang` when the target language is known.
- Add `paths` / `--path` when the module is known.

### Follow-Up Queries

- For MCP, switch to `refresh_index=false` after the first query unless the code changed.
- For CLI, only pass `--refresh` when the index truly needs an update.
- Narrow with language and path filters before broadening the wording.

### Query Ladder

1. Short concept phrase
2. Add language filter
3. Add path filter
4. Rephrase the concept
5. Fall back to `Grep` if the task is exact-text search

---

## 4. WHEN TO USE WHAT

| Use Case | Preferred Tool | Why |
| --- | --- | --- |
| "How is auth implemented?" | CocoIndex | Semantic code discovery |
| "Where is retry logic?" | CocoIndex | Intent-based search |
| "Find all TODO comments" | Grep | Exact string search |
| "Show me this known file" | Read | Full file context |
| "Confirm this symbol is used here" | Grep | Exact confirmation |

### Exact-Match Signals

Use `Grep` first when the prompt asks for:

- exact text
- literal strings
- regex patterns
- usages of a known symbol
- import statements
- TODO comments

---

## 5. CROSS-CLI SAFETY NOTES

- MCP exposes only `search`.
- CLI owns `status`, `index`, `reset`, and `daemon`.
- Daemon auto-start is the normal path. Do not rely on `ccc daemon start`; the installed CLI does not provide it.
- Prefer explicit `paths` filters for cross-CLI consistency; CLI cwd-scoping can differ from MCP behavior.
- Do not assume continuous file-watch reindexing. For major refactors or branch switches, run `ccc index`.
- Do not assume sibling repos inherit CocoIndex from advisor heuristics alone. Downstream repos need the local skill payload plus `cocoindex_code` config wiring. See `references/downstream_adoption_checklist.md`.

### Provider-Specific Activation Recipes

#### Claude Code
- **MCP tool**: `mcp__cocoindex_code__search`
- **Auto-activation**: CLAUDE.md MANDATORY TOOLS says MUST use for concept search
- **Best practice**: Use MCP `search` tool directly; set `refresh_index=false` after first query

#### Codex CLI
- **MCP config**: `.codex/config.toml` under `[mcp_servers.cocoindex_code]`
- **Auto-activation**: AGENTS.md Code Search Protocol section
- **Best practice**: Use CLI `ccc search` via Bash or MCP `search` tool

#### Gemini CLI
- **MCP config**: `.gemini/settings.json` under `mcpServers.cocoindex_code`
- **Auto-activation**: GEMINI.md Code Search Protocol section
- **Best practice**: Combine with Google Search for external + CocoIndex for codebase context

#### GitHub Copilot
- **MCP config**: `.agents/settings.json` under `mcpServers.cocoindex_code`
- **Auto-activation**: AGENTS.md Code Search Protocol section
- **Known issue**: Use `refresh_index=false` for follow-up queries to avoid daemon concurrency crashes

#### OpenCode
- **MCP config**: `opencode.json` under `mcpServers.cocoindex_code`
- **Auto-activation**: AGENTS.md + skill_advisor.py routing
- **Best practice**: skill_advisor.py auto-routes semantic prompts; CLI or MCP interchangeable

---

## 6. TROUBLESHOOTING LADDER

### Binary Missing

```bash
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh
```

### Index Missing or Empty

```bash
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --refresh-index
```

### Daemon Looks Stale

```bash
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc daemon restart
```

### Search Returned No Results

1. Check `doctor.sh`
2. Confirm the project root
3. Try a shorter concept phrase
4. Add `--lang` / `languages`
5. Add `--path` / `paths`
6. Use `Grep` if the request is exact-text oriented
