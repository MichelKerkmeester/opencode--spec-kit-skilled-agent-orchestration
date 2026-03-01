---
title: "Plan: Rename /memory Command to /memory:check [008-rename-memory-check/plan]"
description: "Parallel agent delegation with domain isolation"
trigger_phrases:
  - "plan"
  - "rename"
  - "memory"
  - "command"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Plan: Rename `/memory` Command to `/memory:check`

## Approach
Parallel agent delegation with domain isolation:
- 3 agents process independent domains simultaneously
- 1 agent performs final verification

## Execution Strategy

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   AGENT 1    │  │   AGENT 2    │  │   AGENT 3    │
│  Commands    │  │   Skills     │  │  MCP Docs    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │    ◄── PARALLEL EXECUTION ──►     │
       │                 │                 │
       └────────────┬────┴────┬────────────┘
                    ▼         ▼
            ┌───────────────────────┐
            │       AGENT 4         │
            │    Verification       │
            └───────────────────────┘
```

## Agent Assignments

### Agent 1: Command Files
**Domain:** `.opencode/command/memory/`
- Rename `memory.md` → `check.md`
- Update internal refs in `check.md`
- Update `save.md` Related Commands
- Update `checkpoint.md` Related Commands

### Agent 2: Skills
**Domain:** `.opencode/skills/workflows-memory/`
- Update `SKILL.md` routing diagram
- Update quick reference tables
- Check `references/*.md` for dashboard refs

### Agent 3: MCP Server Docs
**Domain:** `.opencode/memory/mcp_server/`
- Update `README.md` command tables
- Update `INSTALL_GUIDE.md` if needed

### Agent 4: Verification
**Domain:** Full `.opencode/`
- Grep for remaining stale refs
- Validate all changes
- Generate completion report

## Pattern Matching

```
BEFORE                    → AFTER
─────────────────────────────────────────
/memory                   → /memory:check
/memory "query"           → /memory:check "query"
/memory cleanup           → /memory:check cleanup
/memory triggers          → /memory:check triggers
/memory --tier:critical   → /memory:check --tier:critical
```

## Risk Mitigation
- Each agent has isolated domain (no file conflicts)
- Verification agent confirms completion
- Explicit preserve list prevents accidental changes
