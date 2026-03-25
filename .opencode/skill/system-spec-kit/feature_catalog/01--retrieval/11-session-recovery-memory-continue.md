---
title: "Session recovery via /memory:continue"
description: "Reconstructs interrupted session state using resume-mode memory retrieval with a multi-source fallback chain."
---

# Session recovery via /memory:continue

## 1. OVERVIEW

When a session is interrupted by a crash, context compaction, or timeout, `/memory:continue` reconstructs the most likely previous session state and routes the user to the best next step. It is one of the 6 shipped memory commands and exposes 4 shared MCP tools borrowed from `/memory:analyze` and `/memory:manage`.

---

## 2. CURRENT REALITY

**SHIPPED.** `/memory:continue` is live and exposes 4 shared MCP tools:

- **`memory_context`** (from `/memory:analyze`) -- Called in `resume` mode as the primary recovery path. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
- **`memory_search`** (from `/memory:analyze`) -- Fallback for thin summaries when `memory_context` returns the right folder but insufficient state detail. Uses the same resume anchors.
- **`memory_list`** (from `/memory:manage`) -- Recent-candidate discovery when no clear session candidate exists. Returns the 5 most recently updated memories.
- **`memory_stats`** (from `/memory:manage`) -- Exposed on the command surface, but not part of the primary recovery chain documented in the live `/memory:continue` workflow.

### Recovery Modes

- **Auto** (default): Resolves the strongest session candidate with minimal prompting. Prefers a candidate when folder discovery matches a single spec folder, top results cluster around one `specFolder`, or returned content contains state/next-steps/summary/blockers anchors.
- **Manual**: Presents detected session and top 2-3 alternatives. Used when no clear candidate exists, multiple recent folders look plausible, the user explicitly asked for `:manual`, or recovered state conflicts with user expectations.

### Fallback Chain (Priority Order)

| Priority | Source | Use |
|----------|--------|-----|
| 1 | `memory_context(mode: "resume")` | Primary recovery path |
| 2 | `CONTINUE_SESSION.md` | Crash breadcrumb and quick-resume hint |
| 3 | `memory_search()` with resume anchors | Fallback when summary is thin |
| 4 | `memory_list()` | Recent-candidate discovery |
| 5 | User confirmation | Final fallback |

### Post-Recovery Routing

- Quick "what was I doing?" answer: stop after recovery summary
- Structured spec work: recommend `/spec_kit:resume <spec-folder>`
- Broader historical analysis: recommend `/memory:analyze history <spec-folder>`

---

## 3. SOURCE FILES

### Command Definition

| File | Role |
|------|------|
| `.opencode/command/memory/continue.md` | `/memory:continue` command: auto/manual workflows, fallback chain, post-recovery routing |

### Related Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-context.ts` | Handler | Context orchestration entry point (resume mode) |
| `mcp_server/handlers/memory-search.ts` | Handler | Search handler (fallback path) |
| `mcp_server/handlers/memory-crud-list.ts` | Handler | List handler (candidate discovery) |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle and crash-recovery breadcrumbs |

---

## 4. SOURCE METADATA

- Group: Retrieval (session recovery)
- Source feature title: Session recovery via /memory:continue
- Current reality source: `.opencode/command/memory/continue.md` frontmatter and recovery workflow
