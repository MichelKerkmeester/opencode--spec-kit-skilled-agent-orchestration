# 017 — Agent Alignment: Sync Runtime Agent Definitions

| Field       | Value                                                    |
| ----------- | -------------------------------------------------------- |
| **Level**   | 2                                                        |
| **Status**  | Complete                                                 |
| **Priority**| P1                                                       |
| **Parent**  | 022-hybrid-rag-fusion                                    |
| **Created** | 2026-03-15                                               |
| **Updated** | 2026-03-15                                               |

---

## Problem

Runtime agent copies at `.claude/agents/` (10–17 days stale, last updated Feb 26 – Mar 5) and `.gemini/agents/` (10–13 days stale, last updated Mar 2 – Mar 5) have drifted from the canonical `.opencode/agent/` definitions (last updated Mar 14–15).

The canonical source was refreshed on Mar 14 (8 agents) and Mar 15 (speckit.md), but the Claude and Gemini runtime copies were not updated, creating behavioral drift where those runtimes execute outdated agent instructions.

### Drift Summary

| Runtime            | Path                          | Last Update    | Drift        | Status      |
| ------------------ | ----------------------------- | -------------- | ------------ | ----------- |
| Base (canonical)   | `.opencode/agent/*.md`        | Mar 14–15      | —            | Source      |
| ChatGPT            | `.opencode/agent/chatgpt/*.md`| Mar 14–15      | In sync      | ✓           |
| Codex              | `.codex/agents/*.toml`        | Mar 15         | In sync      | ✓           |
| **Claude**         | **`.claude/agents/*.md`**     | **Feb 26–Mar 5** | **10–17 days** | **Stale** |
| **Gemini**         | **`.gemini/agents/*.md`**     | **Mar 2–Mar 5**  | **10–13 days** | **Stale** |

---

## Scope

**In scope:** Sync body content from canonical `.opencode/agent/*.md` to `.claude/agents/*.md` and `.gemini/agents/*.md` for all 9 agents, preserving runtime-specific frontmatter.

**9 agents × 2 stale runtimes = 18 files to update:**

| Agent          | `.claude/agents/` | `.gemini/agents/` |
| -------------- | ------------------ | ------------------ |
| context.md     | Sync               | Sync               |
| debug.md       | Sync               | Sync               |
| handover.md    | Sync               | Sync               |
| orchestrate.md | Sync               | Sync               |
| research.md    | Sync               | Sync               |
| review.md      | Sync               | Sync               |
| speckit.md     | Sync               | Sync               |
| ultra-think.md | Sync               | Sync               |
| write.md       | Sync               | Sync               |

**Out of scope:**
- Agent behavioral/content changes (sync only, no modifications)
- ChatGPT runtime (already in sync)
- Codex TOML runtime (already in sync)
- MCP server or skill changes

---

## Requirements

| ID     | Priority | Requirement                                                           |
| ------ | -------- | --------------------------------------------------------------------- |
| AA-001 | P0       | Body content (post-frontmatter) identical across canonical, Claude, Gemini |
| AA-002 | P0       | Claude frontmatter preserved: `tools:` list, `model:` field, `mcpServers:` |
| AA-003 | P0       | Gemini frontmatter preserved: `kind:`, `model:`, `tools:`, `max_turns:`, `timeout_mins:` |
| AA-004 | P0       | Path convention directive updated per runtime (`.claude/agents/`, `.gemini/agents/`) |
| AA-005 | P0       | No behavioral modifications — sync operation only                      |
| AA-006 | P1       | File sizes within ±500 bytes of canonical (frontmatter differences)    |
| AA-007 | P1       | All 9 agents present in all 5 runtimes (45 files total)               |
| AA-008 | P1       | Nesting rules (§0 ILLEGAL NESTING, LEAF NESTING CONSTRAINT) preserved |
| AA-009 | P2       | ChatGPT and Codex verified still in sync (spot check)                  |

---

## Frontmatter Format Reference

### Canonical (`.opencode/agent/`)
```yaml
name: [agent-name]
description: "[description]"
mode: subagent|all|primary
temperature: 0.1|0.2
permission:
  read: allow
  write: allow|deny
  ...
mcpServers:
  - spec_kit_memory
```

### Claude (`.claude/agents/`)
```yaml
name: [agent-name]
description: "[description]"
tools:
  - Read
  - Grep
  - Glob
  ...
model: sonnet|opus
mcpServers:
  - spec_kit_memory
  - code_mode
```

### Gemini (`.gemini/agents/`)
```yaml
kind: local
model: gemini-3.1-pro-preview
temperature: 0.1|0.2
max_turns: 10|20
timeout_mins: 5|15
tools:
  - read_file
  - grep_search
  - list_directory
  ...
```

---

## Files to Change

All files in the anobel.com repository:

### Claude Runtime (9 files)
- `.claude/agents/context.md` — sync from `.opencode/agent/context.md`
- `.claude/agents/debug.md` — sync from `.opencode/agent/debug.md`
- `.claude/agents/handover.md` — sync from `.opencode/agent/handover.md`
- `.claude/agents/orchestrate.md` — sync from `.opencode/agent/orchestrate.md`
- `.claude/agents/research.md` — sync from `.opencode/agent/research.md`
- `.claude/agents/review.md` — sync from `.opencode/agent/review.md`
- `.claude/agents/speckit.md` — sync from `.opencode/agent/speckit.md`
- `.claude/agents/ultra-think.md` — sync from `.opencode/agent/ultra-think.md`
- `.claude/agents/write.md` — sync from `.opencode/agent/write.md`

### Gemini Runtime (9 files)
- `.gemini/agents/context.md` — sync from `.opencode/agent/context.md`
- `.gemini/agents/debug.md` — sync from `.opencode/agent/debug.md`
- `.gemini/agents/handover.md` — sync from `.opencode/agent/handover.md`
- `.gemini/agents/orchestrate.md` — sync from `.opencode/agent/orchestrate.md`
- `.gemini/agents/research.md` — sync from `.opencode/agent/research.md`
- `.gemini/agents/review.md` — sync from `.opencode/agent/review.md`
- `.gemini/agents/speckit.md` — sync from `.opencode/agent/speckit.md`
- `.gemini/agents/ultra-think.md` — sync from `.opencode/agent/ultra-think.md`
- `.gemini/agents/write.md` — sync from `.opencode/agent/write.md`
