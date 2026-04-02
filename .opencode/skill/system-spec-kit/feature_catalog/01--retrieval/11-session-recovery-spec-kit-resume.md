---
title: "Session recovery via /spec_kit:resume"
description: "Reconstructs interrupted session state through the unified spec-folder resume workflow."
---

# Session recovery via /spec_kit:resume

## 1. OVERVIEW

When a session is interrupted by a crash, context compaction, timeout, or an ordinary handoff between sessions, `/spec_kit:resume` reconstructs the most likely previous state and routes the user to the best next step. Session recovery is no longer a standalone memory command. It now lives under the spec-folder resume workflow, where its primary recovery chain relies on shared memory tools while the wrapper also exposes broader helper access for resume workflows.

---

## 2. CURRENT REALITY

**SHIPPED.** `/spec_kit:resume` owns both standard continuation and interrupted-session recovery. Its primary recovery chain uses 3 shared memory tools, while the live wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers:

- **`memory_context`** (from `/memory:search`) -- Called in `resume` mode as the primary interrupted-session recovery path whenever no fresh `handover.md` already provides enough state. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
- **`memory_search`** (from `/memory:search`) -- Fallback for thin summaries when `memory_context` resolves the right folder but does not return enough state detail. Uses the same resume anchors.
- **`memory_list`** (from `/memory:manage`) -- Recent-candidate discovery when no clear session candidate exists. Returns the most recently updated memories.

`memory_stats` remains diagnostic/helper access on the wrapper rather than part of the primary recovery chain. Additional helper access includes `memory_match_triggers()` for early session detection, `memory_delete`, `memory_update`, health, indexing, checkpoint, validation, and CocoIndex support surfaces.

### Resume Modes

- **Auto** (`:auto`) -- Resolves the strongest session candidate with minimal prompting. Prefers a candidate when folder discovery matches a single spec folder, top results cluster around one `specFolder`, or returned content contains state/next-steps/summary/blockers anchors.
- **Confirm** (`:confirm` or default interactive mode) -- Presents the detected session, optional supplemental context choices, and continuation options when confidence is lower or the operator wants checkpoints.

### Recovery Chain (Priority Order)

| Priority | Source | Use |
|----------|--------|-----|
| 1 | `handover.md` (<24h) | Preferred continuation context when a fresh structured handoff exists |
| 2 | `memory_context(mode: "resume")` | Primary interrupted-session recovery path |
| 3 | `CONTINUE_SESSION.md` | Crash breadcrumb and quick-resume hint |
| 4 | `memory_search()` with resume anchors | Fallback when the summary is thin |
| 5 | `memory_list()` | Recent-candidate discovery |
| 6 | User confirmation | Final fallback |

### Post-Recovery Routing

- Quick "what was I doing?" answer: stop after the recovery summary
- Structured spec work: continue directly inside `/spec_kit:resume`
- Broader historical analysis: recommend `/memory:search history <spec-folder>`

---

## 3. SOURCE FILES

### Command Definition

| File | Role |
|------|------|
| `.opencode/command/spec_kit/resume.md` | `/spec_kit:resume` command: standard continuation plus interrupted-session recovery |
| `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` | Autonomous resume and recovery workflow |
| `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` | Interactive resume and recovery workflow |

### Related Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-context.ts` | Handler | Context orchestration entry point (resume mode) |
| `mcp_server/handlers/memory-search.ts` | Handler | Search handler (fallback path) |
| `mcp_server/handlers/memory-crud-list.ts` | Handler | List handler (candidate discovery) |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle and crash-recovery breadcrumbs |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-context.vitest.ts` | Resume-mode token budget, anchor selection, and auto-resume routing |
| `mcp_server/tests/continue-session.vitest.ts` | CONTINUE_SESSION generation helpers and crash-recovery data shape |
| `mcp_server/tests/crash-recovery.vitest.ts` | Crash breadcrumb generation and CONTINUE_SESSION write path |
| `mcp_server/tests/recovery-hints.vitest.ts` | User-facing recovery hint routing for expired sessions |

---

## 4. SOURCE METADATA

- Group: Retrieval (session recovery)
- Source feature title: Session recovery via /spec_kit:resume
- Current reality source: direct command/runtime audit of `.opencode/command/spec_kit/resume.md` plus the listed resume and crash-recovery tests
