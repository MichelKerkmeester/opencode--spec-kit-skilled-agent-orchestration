# Changelog: 024/026-session-start-injection-debug

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 026-session-start-injection-debug — 2026-04-02

Startup injection for hook runtimes was still too thin to orient the AI well at the beginning of a session. This follow-on phase added a shared startup brief that combines structural code-graph highlights with recent-session continuity, then wired that brief into both Claude and Gemini startup hooks while keeping the hookless contract work cleanly handed off to Phase 027.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/026-session-start-injection-debug/`

---

## New Features (3)

### Shared startup brief builder

**Problem:** Startup hooks knew that recovery existed, but they did not yet have a compact, reusable way to explain what the codebase looked like right now and what the last session had been doing.

**Fix:** Added `startup-brief.ts` with `buildStartupBrief()`, which combines code-graph outline data and recent continuity details into one compact startup payload with graceful fallbacks when the graph is empty or missing.

### Cross-session continuity reuse

**Problem:** Hook startup could only rely on the current session file, which meant a fresh session often missed the most recent useful state even when it lived in a sibling session under the same project.

**Fix:** Added `loadMostRecentState()` so startup can reuse the newest state file for the project hash when it is still recent enough to be useful.

### Hook-runtime startup parity for Claude and Gemini

**Problem:** Claude and Gemini had related startup needs, but the brief-building logic was still scattered and uneven.

**Fix:** Wired both `hooks/claude/session-prime.ts` and `hooks/gemini/session-prime.ts` to the same shared startup brief contract so both runtimes can inject structural orientation plus continuity instead of separate ad hoc startup text.

---

## Architecture (2)

### Hook-runtime scope kept explicit

**Problem:** This follow-on work could easily have blurred into the broader hookless bootstrap contract, making the packet harder to reason about.

**Fix:** The phase kept its scope narrow: startup brief transport for hook runtimes only. The non-hook contract, payload vocabulary, and recovery semantics stayed delegated to the sibling `027-opencode-structural-priming` phase.

### Empty graph treated as a real startup state

**Problem:** An empty graph can look like a silent failure unless the startup surface distinguishes "no graph yet" from "hook broke".

**Fix:** The startup brief now treats empty graph state explicitly so the AI can tell the difference between "index not ready yet" and "startup injection failed".

---

## Testing (2)

### Targeted startup brief coverage

**Problem:** This phase changed startup behavior in a place that is easy to get subtly wrong and hard to validate by inspection alone.

**Fix:** Added focused tests for startup-brief ready/empty/missing states and recency filtering in hook-state so the new behavior is covered by automated checks instead of a one-off manual run.

### Full runtime verification lane

**Problem:** Startup changes can pass narrow tests while still failing in shared runtime code paths.

**Fix:** Re-ran the broader hook/session/runtime suite, including hook-state, session-start, startup-brief, session-resume, lifecycle, session-state, context-server, startup-checks, and memory-health edge tests. The phase summary records 9 files and 502 tests passing.

---

<details>
<summary>Files Changed (7)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/hook-state.ts` | Added `loadMostRecentState()` for recency-based continuity reuse. |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Added `queryStartupHighlights()` against the existing graph schema. |
| `mcp_server/lib/code-graph/startup-brief.ts` | New shared startup brief builder with graph and continuity fallbacks. |
| `mcp_server/hooks/claude/session-prime.ts` | Wired Claude startup injection to the shared brief. |
| `mcp_server/hooks/gemini/session-prime.ts` | Wired Gemini startup injection to the shared brief. |
| `README.md` | Updated packet scope to describe hook-runtime startup work and 027 handoff. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Synchronized packet docs to the delivered scope. |

</details>

---

## Upgrade

No migration required. This phase improves startup orientation for hook runtimes only; hookless bootstrap contract changes remain in Phase 027.
