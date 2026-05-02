# Changelog: 024/004-cross-runtime-fallback

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 004-cross-runtime-fallback — 2026-03-28

This phase made the compact-context design usable outside Claude hooks. Runtime detection now distinguishes hook-capable and hookless environments, and the instruction files tell Codex, Copilot, Gemini, and OpenCode how to recover with tools when native hook transport is unavailable.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/`

---

## New Features (2)

### Runtime and hook-policy detection

**Problem:** Cross-runtime recovery logic could not make good decisions because it did not know whether the active runtime had hook support, hook support disabled by policy, or no usable hook setup at all.

**Fix:** Added `runtime-detection.ts` so the system now reports both the runtime identity and a `hookPolicy` value, giving downstream instructions and handlers a clear transport decision.

### Tool-based fallback recovery

**Problem:** Non-Claude runtimes had no automatic path to regain context after compaction or on first turn.

**Fix:** Updated instruction files to steer those runtimes toward Gate 1 memory surfacing and `memory_context({ mode: "resume", profile: "resume" })` instead of pretending hook transport exists everywhere.

---

## Deferred (2)

### MCP-level compaction detection

**Problem:** The original design considered time-gap heuristics for detecting compaction in hookless runtimes.

**Status:** Deferred because the current runtime SDKs do not expose the lifecycle hooks needed to make that reliable.

### Copilot and Gemini hook adapters

**Problem:** Those runtimes were not yet wired with first-class hook adapters in this phase.

**Status:** Left as follow-on work, with safe tool fallback used in the meantime.

---

## Files Changed (4)

| File | What changed |
|------|-------------|
| `mcp_server/lib/runtime-detection.ts` | Added runtime and hook-policy classification. |
| `CLAUDE.md` | Added fallback recovery instructions for non-hook scenarios. |
| `.codex/CODEX.md` | Added tool-based recovery guidance for hookless sessions. |
| `GEMINI.md` | Added runtime-specific fallback instructions for Gemini flows. |

---

## Upgrade

No migration required.
