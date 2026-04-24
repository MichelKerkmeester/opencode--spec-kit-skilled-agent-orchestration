You are executing iteration 7 of 10 of a deep-research loop against the Copilot CLI hook parity question. Operate as a LEAF agent — do not dispatch sub-agents.

## TOPIC

Does GitHub Copilot CLI 1.0.34 (April 2026) expose any mechanism — hook, pre-prompt script, plugin, agent extension, config file, env-var injection, or MCP integration — that would let the Spec Kit Memory MCP inject (a) a per-session "startup context" payload (code-graph freshness + structural highlights) and (b) a per-prompt "advisor brief" payload (format: "Advisor: <skill> <conf>/<uncert> <status>"), mirroring the working Claude Code behavior already wired via .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts?

## CURRENT STATE

Iteration: 7 of 10
Convergence threshold: 0.05

Remaining key questions (unchecked):
- [ ] Q1: Does Copilot CLI have a documented pre-prompt hook API, event hook system, or equivalent lifecycle extension point?
- [ ] Q2: What is the `/agent` / `--agent` extension model — can a custom agent inject system-prompt-level context at session start?
- [ ] Q3: What is the `/skills` extension model — is it comparable to Claude Code skills or different?
- [ ] Q4: What is the `/mcp` / `--additional-mcp-config` integration — can an MCP server push context (not just respond to tool calls)?
- [ ] Q5: Is there a user-config file (like `~/.copilot/AGENTS.md`, `~/.copilot/instructions.md`, system-prompt config key) that Copilot reads at session start and injects into the model context?
- [ ] Q6: Does `--acp` (Agent Client Protocol server mode) expose a bidirectional context injection channel we could exploit?
- [ ] Q7: What env vars does Copilot read at startup that could carry a payload?
- [ ] Q8: If hook/extension paths are absent, what's the least-friction shell-wrapper pattern (aliased `copilot` that prepends payload) and what breaks (TUI, stdin, token budget)?

Next focus area (from strategy):
Q1 + Q2: Map Copilot CLI's `--agent` / `--acp` / `/agent` surface. Fetch official docs at https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli and adjacent pages; inspect the github/copilot-cli repo or any public source for agent extension schema and lifecycle hooks. Also empirically probe `~/.copilot/` for additional config files.  

Last 3 iterations:
  run 4: instructions skills and acp (ratio=0.55)
  run 5: hook mutation and custom agent loading (ratio=0.45)
  run 6: instructions skills mcp and acp boundaries (ratio=0.4)

## PRE-RESEARCH DISCOVERIES (already in known context — do not redo)

From copilot --help (1.0.34):
- --effort/--reasoning-effort <low|medium|high|xhigh>
- --agent <agent>, --acp (Agent Client Protocol server)
- --additional-mcp-config <json>, default ~/.copilot/mcp-config.json
- --allow-tool, --deny-tool, --available-tools
- --config-dir (default ~/.copilot)
- --bash-env (on|off)
- --autopilot

Interactive slash commands: /agent, /skills, /mcp, /plan, /research, /diff, /pr, /review

Files at ~/.copilot/ (empirically verified 2026-04-22):
- config.json (auth + trustedFolders + banner only, no instructions)
- rules/ (Starlark execution policies)
- No AGENTS.md, no instructions.md, no CLAUDE.md equivalent found yet

## RESEARCH ACTIONS FOR THIS ITERATION

Budget: target 3-5 actions, max 12 tool calls, 15 min.

Use your available tools (WebFetch, Bash, Read, Grep, Glob) to investigate the topic. Focus on the "Next focus area" above, or if that's already covered, pick an unanswered question from the list. Good sources:
- https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli
- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/
- github/copilot-cli repo on GitHub (issues, PRs, discussions)
- Copilot CLI release notes
- Empirical probe: cat ~/.copilot/*.json, ls ~/.copilot/, copilot --help subcommands
- Env var probe: env | grep -i copilot; which shell setups does copilot honor?

Cite ≥2 primary sources per finding. Prefer official GitHub docs, repo issues/PRs, and release notes over blog posts.

## OUTPUT CONTRACT (HARD REQUIREMENT)

You MUST produce exactly three artifacts. Missing or malformed artifacts cause the post-dispatch validator to emit schema_mismatch.

### 1. Iteration narrative (markdown)

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-01/iterations/iteration-7.md

Structure:
# Iteration 7: <focus-topic>
## Focus
<1-2 sentences>
## Actions Taken
<numbered list of what you did with primary sources cited>
## Findings
<bullet list; each finding has a primary-source URL>
## Questions Answered
<list key-question IDs from strategy (Q1..Q8) that this iteration moved forward, with the evidence>
## Questions Remaining
<list still-open key-questions>
## Next Focus
<one-sentence recommendation for iteration 8>

### 2. JSONL iteration record

APPEND (do not overwrite) one line to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-01/deep-research-state.jsonl

Record schema (use type "iteration" exactly):
{"type":"iteration","run":7,"status":"insight"|"evidence"|"thought"|"dead-end","focus":"<short focus label>","findingsCount":<int>,"newInfoRatio":<0..1>,"citationCount":<int>,"primarySourceCount":<int>,"timestamp":"<ISO8601>","graphEvents":[]}

newInfoRatio guidance: 1.0 = all findings new; 0.0 = all redundant with prior iterations. Be honest.

### 3. Per-iteration delta file

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-01/deltas/iter-7.jsonl

Must contain at least one JSONL record with type="iteration" (can mirror the state.jsonl record plus any derived data).

## CONSTRAINTS

- LEAF agent: do not spawn sub-agents.
- Write all findings to files. Do not hold in context.
- If you find no new information in this iteration, still write the artifacts with status:"thought" and newInfoRatio:0.0 so the reducer sees the iteration happened.
- Do not modify the root AGENTS.md.
- Do not modify <repo>/.codex/AGENTS.md.

Begin iteration 7 now. Produce the three artifacts.
