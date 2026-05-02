# Changelog: 024/005-command-agent-alignment

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 005-command-agent-alignment — 2026-03-31

This phase aligned the command and agent surfaces with the hook-aware recovery model. Resume commands now request the compact brief format, memory-save flows avoid obvious double-save collisions, and agent definitions describe compaction recovery in the same language the runtime actually uses.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/005-command-agent-alignment/`

---

## Commands (2)

### Resume command profile fix

**Problem:** The command layer still used the old resume call shape, which returned verbose search-like payloads instead of the compact briefing needed after compaction.

**Fix:** Updated the resume command to request `profile: "resume"` so commands and hooks ask for the same brief output.

### Double-save prevention window

**Problem:** A stop hook and a manual `/memory:save` could both fire back-to-back and generate redundant saves.

**Fix:** Added a time-based merge window so obvious overlap is treated as the same save event.

---

## Agents (1)

### Hook-aware compaction recovery guidance

**Problem:** Agent definitions described recovery in generic terms and could drift away from the actual hook and resume workflow.

**Fix:** Updated agent prompts so compaction recovery, session resume, and tool routing all point back to the same packet behavior.

---

## Files Changed (4)

| File | What changed |
|------|-------------|
| `.opencode/command/spec_kit/resume.md` | Updated the resume command to use `profile: "resume"`. |
| `.opencode/command/memory/save.md` | Added guidance to avoid immediate duplicate saves. |
| `.opencode/agent/context.md` | Aligned agent guidance with hook-aware resume behavior. |
| `.codex/agents/context.toml` | Mirrored the same recovery wording in Codex agent definitions. |

---

## Upgrade

No migration required. Duplicate-save protection is time-window based and still intentionally lightweight.
