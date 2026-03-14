# Plan: CLI Self-Invocation Guards

## Approach

Add consistent self-invocation guards to all 4 CLI SKILL.md files. Each guard follows the same pattern but is customized with CLI-specific native capabilities and env var detection.

## Guard Template

Each skill gets:

1. **"When NOT to Use" entry** (first item, most prominent):
   - States: "If you ARE [CLI], do not use this skill"
   - Lists native capabilities the AI should use instead
   - References env var detection where known

2. **NEVER rule**:
   - Explicit rule: "NEVER invoke this skill from within [CLI] itself"
   - Explanation: native access exists, self-delegation is circular

3. **Prerequisite Detection** (where applicable):
   - Env var checks for runtime detection

## Per-Skill Customization

### cli-claude-code
- Enhance existing nesting guard to broader self-invocation guard
- Native alternatives: Edit tool, Agent tool, extended thinking, structured output, skills
- Detection: `$CLAUDECODE` env var (already exists)
- Enhance existing NEVER rule #2

### cli-gemini
- Add new guard (none exists)
- Native alternatives: google_web_search, codebase_investigator, save_memory, agents
- Detection: no known env var — conceptual guard only

### cli-codex
- Add new guard (none exists)
- Native alternatives: sandbox execution, /review, --search, session management, profiles
- Detection: no known env var — conceptual guard only

### cli-copilot
- Enhance existing minimal guard
- Native alternatives: Autopilot, Explore/Task agents, cloud delegation, repo memory
- Detection: uncomment `$COPILOT_SESSION` check

## Execution Order

1. Edit cli-claude-code (enhance existing guards)
2. Edit cli-gemini (add new guards)
3. Edit cli-codex (add new guards)
4. Edit cli-copilot (enhance existing guards)
5. Write implementation-summary.md
