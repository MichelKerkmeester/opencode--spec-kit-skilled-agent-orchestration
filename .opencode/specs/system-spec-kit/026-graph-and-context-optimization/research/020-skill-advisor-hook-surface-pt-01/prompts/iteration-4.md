# Deep-Research Iteration 4 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.

## STATE

Iteration: 4 of 10. Last focus: empirical cache/TTL + brief-length measurement (iter 3).

Focus Area (iter 4): **Codex CLI hook surface investigation (Q1).** Work:
- Search `.opencode/` for any Codex-specific hook infrastructure: `grep -r "codex" .opencode/skill/system-spec-kit/mcp_server/hooks/` and similar
- Check `.opencode/skill/cli-codex/` for any hook contract docs
- Check OpenCode / claude-code harness docs if accessible
- Specifically: does Codex CLI have an equivalent to Claude's UserPromptSubmit / PreToolUse / SessionStart hooks?
- If no: what's the wrapper strategy? (e.g., prompt-wrapping prepends advisor brief to user prompt; alternatively session-start preamble)
- Document concrete evidence for each claim (file:line references)

Answers Q1 (Codex hook gap — THE architectural unknown).

## STATE FILES

Standard. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-004.md`: Codex hook audit with evidence; wrapper-strategy proposal if hook gap confirmed.
2. Canonical JSONL.
3. `deltas/iter-004.jsonl`.
