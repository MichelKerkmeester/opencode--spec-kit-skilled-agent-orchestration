You are executing iteration 1 of 10 of a deep-research loop against the Codex CLI hook CONTRACT question. Operate as a LEAF agent — do not spawn sub-agents.

## TOPIC

What is the exact Codex CLI (codex-cli 0.122.0) hook contract that `~/.codex/hooks.json` registers commands against? Specifically: stdin payload format, stdout-to-model-context injection semantics, exit-code meaning, timeout budget, multi-hook ordering, full event taxonomy, UserPromptSubmit blocker/decline pattern, env var propagation.

Pre-research has confirmed: Codex natively supports hooks (schema in `~/.codex/hooks.json` matches Claude Code shape); three events wired today are SessionStart, UserPromptSubmit, Stop; the registered command is only Superset's notify.sh. The research target is the CONTRACT, not the transport's existence.

## CURRENT STATE

Iteration: 1 of 10
Convergence threshold: 0.05

Remaining key questions (unchecked):
- [ ] Q1: What stdin payload format (JSON, plain text, empty) does codex pass to SessionStart hook commands, and UserPromptSubmit hook commands?
- [ ] Q2: When a hook writes to stdout, does the content get injected into the model's context for the current turn? If yes — prepended, appended, or replacing? If no — is it purely notification/logged?
- [ ] Q3: Exit code semantics: does non-zero abort the turn (Claude's blocker pattern), short-circuit, or just log a warning?
- [ ] Q4: Timeout budget — how long before codex considers a hook stuck and kills/skips it? What happens on timeout?
- [ ] Q5: Concurrency/ordering when multiple hooks are registered for one event: serial in registration order? Parallel? Undefined?
- [ ] Q6: What events does codex expose beyond SessionStart/UserPromptSubmit/Stop (e.g., PostToolUse, PreCompact, PreToolUse, Error)?
- [ ] Q7: Can a UserPromptSubmit hook decline or transform the user's prompt before it's passed to the model (like Claude's blocking pattern)?
- [ ] Q8: Do hooks inherit the full parent env (HOME, PATH, OPENAI_API_KEY, custom env vars) or a sanitized subset?

Next focus area (from strategy):
Q1 + Q2: probe the stdin payload format and stdout injection semantics. Two paths: (a) fetch official Codex CLI docs at developers.openai.com/codex for hooks documentation; (b) install a throwaway test hook at /tmp/codex-probe-hook.sh registered alongside notify.sh in ~/.codex/hooks.json, run a codex session, observe what stdin it receives and whether stdout appears in the model's context.  

Last 3 iterations:
  (none yet — this is iteration 1)

## AUTHORITATIVE SOURCE CANDIDATES (prioritize these)

1. **openai/codex GitHub repository** — the canonical source for Codex CLI. Search for:
   - "hook", "hooks.json", "SessionStart", "UserPromptSubmit", "Stop" in source files
   - Issues/PRs mentioning hooks
   - README and docs/ within the repo
   - CHANGELOG.md entries mentioning hook features

2. **Official GitHub/OpenAI Codex CLI documentation** at developers.openai.com/codex or similar. Hooks may be documented under config, advanced, or scripting pages.

3. **Local evidence** (you have Read + Bash access):
   - `cat ~/.codex/hooks.json` — confirm schema
   - `cat ~/.superset/hooks/notify.sh` — observe a working hook script to reverse-engineer contract
   - `codex --help` and `codex exec --help` for flags relevant to hooks
   - `find ~/.codex -name '*.json' -o -name '*.toml'` for related config

4. **Claude Code's hook documentation** at docs.claude.com/en/docs/claude-code/hooks or similar — since the schemas match, the Claude contract likely informs Codex's (but don't assume; verify per-field).

## RESEARCH ACTIONS FOR THIS ITERATION

Budget: target 4-6 actions, max 12 tool calls, 15 min.

Use WebFetch, Bash (limited to workspace by `--sandbox workspace-write`), Read, Grep, Glob. Focus on the Next Focus area above, or if already covered, pick an unanswered question from the list.

Each finding must cite ≥1 primary source (GitHub repo, official docs, release notes, or empirical output). Prefer authoritative sources; community blog posts are supplementary only.

## OUTPUT CONTRACT (HARD REQUIREMENT)

You MUST produce exactly three artifacts. Missing or malformed artifacts cause post-dispatch validation to fail.

### 1. Iteration narrative (markdown)

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-02/iterations/iteration-1.md

Structure:
# Iteration 1: <focus-topic>
## Focus
<1-2 sentences>
## Actions Taken
<numbered list of what you did with primary-source URLs>
## Findings
<bullet list; each finding includes: statement + primary-source URL + relevance to one of Q1-Q8>
## Questions Answered
<list key-question IDs (Q1..Q8) this iteration advances, with the evidence>
## Questions Remaining
<list still-open key-questions>
## Next Focus
<one-sentence recommendation for iteration 2>

### 2. JSONL iteration record

APPEND (do not overwrite) one line to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-02/deep-research-state.jsonl

Record schema (use type "iteration" EXACTLY, not "iteration_delta"):
{"type":"iteration","run":1,"status":"insight"|"evidence"|"thought"|"dead-end","focus":"<short focus label>","findingsCount":<int>,"newInfoRatio":<0..1>,"citationCount":<int>,"primarySourceCount":<int>,"timestamp":"<ISO8601>","graphEvents":[]}

newInfoRatio guidance: 1.0 = all findings novel vs prior iterations; 0.0 = all redundant. Be honest; this drives convergence detection.

### 3. Per-iteration delta file

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-02/deltas/iter-1.jsonl

At least one JSONL record with type="iteration" (can mirror the state.jsonl record).

## CONSTRAINTS

- LEAF agent: do not spawn sub-agents.
- Write all findings to files. Do not hold in context.
- Do not modify `~/.codex/hooks.json` — that's a later implementation phase.
- Do not modify `~/.codex/AGENTS.md` (voice addendum, separate spec).
- Do not modify the root project `AGENTS.md`.
- If you find no new information, still write the three artifacts with status:"thought" and newInfoRatio:0.0.

Begin iteration 1 now. Produce the three artifacts.
