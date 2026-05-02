# Changelog: 024/003-stop-hook-tracking

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 003-stop-hook-tracking — 2026-03-28

This phase added the missing end-of-session bookkeeping for Claude hook flows. Session stop now parses transcript JSONL, records token estimates, updates hook-state metrics, and attempts a best-effort context save so long-running sessions can be measured and resumed with less guesswork.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/`

---

## New Features (3)

### Transcript-backed stop hook

**Problem:** The system had no durable record of what a Claude session consumed or where it left off when the session ended.

**Fix:** Added `session-stop.ts` plus transcript parsing utilities so stop events can estimate prompt, completion, and cache token usage from Claude JSONL transcripts and write that state into hook-managed session files.

### Pressure metrics integration

**Problem:** Session-start pressure handling had no end-of-session data to learn from.

**Fix:** Fed stop-hook token summaries back into hook state so later startup and recovery paths can reason about prior session pressure and continuity.

### Best-effort context save

**Problem:** Session end still risked losing the final working context if the user stopped without manually saving.

**Fix:** Added a best-effort `generate-context.js` invocation path when stop thresholds are met, while treating failures as warnings so session shutdown does not become brittle.

---

## Known Limits (2)

### Token counts remain approximate

**Problem:** Claude transcripts do not expose every possible usage bucket in a perfect, queryable form.

**Fix:** The stop hook records lower-bound estimates and documents that the data is directional rather than billing-grade.

### Auto-save is best effort, not guaranteed

**Problem:** Script resolution, file-system state, or environment issues can still prevent a final save.

**Fix:** The hook logs warnings and exits cleanly instead of pretending persistence is guaranteed.

---

<details>
<summary>Files Changed (4)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/session-stop.ts` | Added async stop-hook handling, token extraction, and best-effort save logic. |
| `mcp_server/hooks/claude/claude-transcript.ts` | Added transcript parsing helpers for Claude JSONL logs. |
| `mcp_server/hooks/claude/hook-state.ts` | Extended session-state metrics written at stop time. |
| `mcp_server/hooks/claude/shared.ts` | Added shared pressure and summary helpers used by the stop path. |

</details>

---

## Upgrade

No migration required.
