# Spec: CLI Self-Invocation Guards

## Problem

The 4 CLI orchestration skills (`cli-gemini`, `cli-codex`, `cli-claude-code`, `cli-copilot`) are designed for **cross-AI delegation** — an external AI delegates tasks TO a different CLI. However, the shared skill system (symlinked across all CLI environments) means `skill_advisor.py` can recommend a CLI skill to the very AI that IS that CLI.

This creates a **self-invocation anti-pattern**: Claude Code being told to invoke `cli-claude-code`, Gemini CLI being told to invoke `cli-gemini`, etc. This is circular, wasteful, and in some cases causes runtime errors (nesting).

### Current State

| Skill | Self-invocation guard | Gap |
|-------|----------------------|-----|
| `cli-claude-code` | Partial (nesting check via `$CLAUDECODE`) | Framed as "cannot nest" not "you ARE this CLI" |
| `cli-gemini` | None | No guard at all |
| `cli-codex` | None | No guard at all |
| `cli-copilot` | Minimal (mentions nesting, env check commented out) | Incomplete |

### Root Cause

The skill system is shared via symlinks:
- `.claude/skills` -> `.opencode/skill/`
- `.codex/skills` -> `.opencode/skill/`
- `.gemini/agents/` -> `.opencode/skill/`

`skill_advisor.py` scores by keyword match and does not know which runtime is active.

## Solution

Add explicit **self-invocation guards** to all 4 CLI SKILL.md files:

1. **"When NOT to Use"** section: Prominent entry explaining the guard and what to do instead (use native capabilities)
2. **"NEVER" rules**: Explicit rule against self-invocation
3. **Prerequisite Detection**: Env var checks where applicable

Each guard must be:
- **Conceptual** — AI reads and understands "I am this CLI, skip this skill"
- **Actionable** — tells the AI what to use instead (native capabilities)
- **Detectable** — env var checks where runtime provides them

## Scope

### In Scope
- Edit `SKILL.md` for all 4 CLI skills
- Add self-invocation guard to "When NOT to Use" sections
- Add NEVER rule to each skill's rules section
- Enhance prerequisite detection where applicable

### Out of Scope
- Changes to `skill_advisor.py` (runtime detection would be a separate effort)
- Changes to reference files or prompt templates
- New env var detection mechanisms

## Files Modified

- `.opencode/skill/cli-claude-code/SKILL.md`
- `.opencode/skill/cli-gemini/SKILL.md`
- `.opencode/skill/cli-codex/SKILL.md`
- `.opencode/skill/cli-copilot/SKILL.md`
