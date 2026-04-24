## Iteration 02

### Focus
Runtime-directory README drift after the handover/speckit cleanup work.

### Findings
- OpenCode, Codex, and Gemini runtime READMEs still list `handover` and `speckit` as active agents (`.opencode/agent/README.txt:10-20`, `.codex/agents/README.txt:10-20`, `.gemini/agents/README.txt:10-20`).
- Claude's runtime README has already moved to a different live set, omitting those deleted agents and including `improve-agent`/`improve-prompt` (`.claude/agents/README.txt:10-20`).
- The stale READMEs still frame themselves as authoritative runtime indexes by saying each directory contains the runtime's agent definitions and is mirrored across runtimes (`.opencode/agent/README.txt:4-8`, `.codex/agents/README.txt:4-8`, `.gemini/agents/README.txt:4-8`).

### New Questions
- Was the cleanup packet supposed to update these README surfaces, or were they missed during the sweep?
- Do the stale runtime indexes line up with the phase 002 completion claims, or do they contradict them?
- Are any other runtime-facing docs still advertising deleted agents or commands?

### Status
new-territory
