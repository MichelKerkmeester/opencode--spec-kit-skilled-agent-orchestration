# Changelog: 024/002-session-start-hook

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 002-session-start-hook — 2026-03-31

This phase turned SessionStart into a source-aware recovery surface instead of a one-size-fits-all banner. Startup, resume, clear, and compact sessions now each get the right guidance, and resume flows consistently request the compact `profile: "resume"` briefing that fits inside the preserved-context budget.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/`

---

## New Features (4)

### Source-aware session routing

**Problem:** SessionStart treated every launch the same, even though a compact restart, a fresh startup, a resume, and a `/clear` recovery need different behavior.

**Fix:** Added explicit handling for `source=compact`, `startup`, `resume`, and `clear`. Compact sessions restore cached context, startup sessions surface tool and freshness guidance, resumes point the AI at the resume flow, and clear sessions stay minimal.

### Resume profile correction

**Problem:** Resume surfaces were still returning search-style payloads instead of the compact resume brief because they missed `profile: "resume"`.

**Fix:** Standardized resume guidance so the hook path and `/spec_kit:resume` both use the brief profile that returns state, next steps, and blockers.

### Pressure-aware startup budgets

**Problem:** Session-start output could stay too large even when the conversation was already under token pressure.

**Fix:** Added `calculatePressureBudget()` so the startup payload shrinks when the context window is already filling.

### Spec-folder continuity

**Problem:** Fresh and resumed sessions had no reliable way to surface the current or last active spec folder.

**Fix:** Added spec-folder detection and persisted `lastSpecFolder` in hook state so startup and resume guidance can point back to the right packet.

---

## Files Changed (4)

| File | What changed |
|------|-------------|
| `mcp_server/hooks/claude/session-prime.ts` | Added source-specific startup, resume, clear, and compact handling. |
| `mcp_server/hooks/claude/shared.ts` | Added pressure-budget helpers used by startup injection. |
| `mcp_server/hooks/claude/hook-state.ts` | Persisted `lastSpecFolder` for cross-session continuity. |
| `.opencode/command/spec_kit/resume.md` | Updated resume guidance to use `profile: "resume"`. |

---

## Upgrade

No migration required.
