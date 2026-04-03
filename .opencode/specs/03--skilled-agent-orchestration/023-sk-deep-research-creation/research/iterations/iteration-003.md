# Iteration 003: autoresearch-opencode Deep Comparison

## Focus
Deep dive into dabiggm0e/autoresearch-opencode to understand how it relates to our deep-research system, its state management patterns, error handling/recovery architecture, and experiment execution strategies. This is a direct fork-analysis comparing their skill+command+plugin triad against our agent+command+skill approach.

## Findings

### F1: autoresearch-opencode is a pure-skill reimplementation that removed the MCP server dependency
The repo explicitly states it is a "REIMPLEMENTATION of pi-autoresearch that REMOVES the MCP server requirement, functioning as a pure skill with agent-executable instructions." Where pi-autoresearch required a running MCP server to manage state, autoresearch-opencode collapsed everything into three files: a 17KB SKILL.md (the autonomous logic), a 3KB command file (slash commands), and a 2KB TypeScript plugin (context auto-injection). This is architecturally simpler but less extensible than a server-based approach.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/README.md]

### F2: Their TypeScript plugin architecture provides automatic context injection -- a pattern we lack entirely
The `autoresearch-context.ts` plugin hooks into OpenCode's `tui.prompt.append` event to inject context into every prompt automatically when autoresearch mode is active. It uses a sentinel file (`.autoresearch-off`) to toggle behavior. This means the AI agent receives autoresearch instructions WITHOUT the orchestrator having to explicitly pass context each time. Our system relies on the orchestrator dispatching the @deep-research agent with full context in the prompt, which is more explicit but more fragile (context can be lost on compaction or if dispatch instructions are incomplete).
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/plugins/autoresearch-context.ts]

### F3: Their JSONL format is simpler but less analytically useful than ours
Their JSONL has two record types: a single config header (`{"type":"config","name":"bogo-sort-optimize","metricName":"runtime","metricUnit":"s","bestDirection":"lower"}`) followed by result entries with fields: `run`, `commit`, `metric`, `metrics` (nested), `status` (keep/discard), `description`, `timestamp`, `segment`. Our system uses `{"type":"config",...}` + `{"type":"iteration",...}` records with convergence-specific fields (`newInfoRatio`, `keyQuestions`, `answeredQuestions`, `durationMs`). Their format is optimized for numeric metric tracking (runtime, shuffle count), while ours is optimized for knowledge convergence detection. Neither is strictly "better" -- they solve different problems.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.jsonl]

### F4: Their data integrity approach uses backup scripts, not true atomic writes in practice
Despite SKILL.md describing an "atomic write pattern (temp file -> validate -> atomic move)," the actual implementation tells a different story. The `autoresearch.sh` benchmark script performs direct stdout output with no file persistence. The `backup-state.sh` script (11.6KB) uses `cp -p` for backups, not atomic moves. Backups follow a `filename.bak.YYYYMMDD_HHMMSS` convention with 5-backup rotation per file. Recovery has two modes: interactive (user selects which backup) and automatic (most recent backup). The gap between documented intent (atomic writes) and implementation (cp-based backups) suggests the atomic write pattern is aspirational within SKILL.md instructions for the AI agent, not enforced by tooling.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/scripts/backup-state.sh]
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.sh]

### F5: Their error recovery relies on a 3-tier strategy: backup restoration, git history, and manual rebuild
Recovery from state corruption follows this hierarchy: (1) Check for timestamped backups via backup-state.sh, restore most recent. (2) If no backups, reconstruct from git commit history (since every "keep" result is committed). (3) If neither works, present user with choice: fresh start, context-only restart, or locate a backup manually. Our system has a simpler recovery model: reconstruct from iteration files if JSONL is missing (documented in deep-research.md error handling table). Their approach is more robust because git commits serve as an implicit audit trail -- every kept experiment is a committed state. We lack this because our deep-research iterations are research, not code changes, so there is no natural git checkpoint per iteration.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/skills/autoresearch/SKILL.md -- Recovery section from reconnaissance data]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/deep-research.md:237-240]

### F6: Their sentinel-file pause mechanism is simpler but less informative than our convergence detection
They use a `.autoresearch-off` file as a binary toggle: exists = paused, absent = running. The plugin checks this file on every prompt event. Resumption simply deletes the sentinel. Our system uses convergence detection based on `newInfoRatio` dropping below a threshold (default 0.05) across consecutive iterations, which is analytically richer -- it measures when research is producing diminishing returns rather than relying on manual interruption. However, their approach is more responsive to user intent (instant pause/resume) whereas our convergence detection is about automatic stopping.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/plugins/autoresearch-context.ts -- checkSentinelFile()]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/research/deep-research-config.json -- convergenceThreshold: 0.10]

### F7: Their experiment execution uses a strict keep/discard/crash tristate with git as the undo mechanism
Each experiment run produces exactly one of three outcomes: `keep` (improved the metric, git commit the changes), `discard` (worse or equal, git revert + clean), `crash` (non-zero exit code, git revert + clean). This tristate maps cleanly to git operations. The benchmark script (`autoresearch.sh`) captures timing via grep/sed on stdout output (`METRIC runtime=Xs`), runs with a per-iteration timeout (2s), and handles timeout failures by recording default values (0 shuffles). Our system has no equivalent tristate because research iterations are additive (we never "discard" an iteration's findings -- even negative results are informative).
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.sh]
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/skills/autoresearch/SKILL.md -- Status section from reconnaissance data]

### F8: Their session state file (autoresearch.md) serves the same role as our strategy.md but with tighter constraints
`autoresearch.md` defines: objective, metrics (with direction), modifiable files, constraints, what has been tried, and instructions for the AI agent. It is described as "the heart of the session." Our `strategy.md` tracks: remaining questions, answered questions, what worked/failed, exhausted approaches, and next focus. Key difference: their file is more prescriptive (defines the problem space and constraints), while ours is more adaptive (tracks knowledge state and guides exploration). Their format suits optimization problems; ours suits open-ended research.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.md]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/research/deep-research-strategy.md]

### F9: Their worklog pattern provides rich narrative documentation that our iteration files approximate but do not match
The `experiments/worklog.md` (12.5KB) captures per-experiment entries with: approach number, description, code change details, runtime, shuffle count, status (KEEP/DISCARD), and detailed observations explaining WHY the result occurred. Each observation section analyzes root causes, trade-offs, and cumulative learnings. Failed experiments receive equally detailed treatment. Our `iteration-NNN.md` files capture findings and assessments but lack the explicit "why did this succeed/fail" analysis. Their worklog is a single file growing over time; our iterations are separate files requiring synthesis.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/experiments/worklog.md -- via WebFetch analysis]

### F10: Their install.sh copies files to ~/.config/opencode/ -- a global installation pattern we do not use
The install script (9.9KB) deploys plugin, skill, command, and utility script to OpenCode's global config directory (`~/.config/opencode/`). This enables autoresearch to work across any project. Our deep-research system is project-local (skill + command + agent files in the repository's .opencode/ and .claude/ directories). The global approach enables reuse but creates version management challenges; the local approach is more portable with the repository but requires per-project setup.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/scripts/install.sh]

### F11: Their ideas backlog system (autoresearch.ideas.md) is an explicit mechanism for user-guided exploration
The SKILL.md describes an `autoresearch.ideas.md` file where users can steer future experiments. During the resume flow, the system consults this file for inspiration. User messages during active experiments are treated as "steers" -- the system finishes the current iteration, then incorporates the user's direction into the next one. Our system handles this through the orchestrator's dispatch prompt and the `:confirm` mode, but lacks a persistent ideas file that survives across sessions.
[SOURCE: https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/skills/autoresearch/SKILL.md -- Ideas backlog from reconnaissance data]

## Sources Consulted
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.sh (benchmark runner)
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.md (session state)
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/worklog.md (experiment narrative)
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/autoresearch.jsonl (state format)
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/scripts/backup-state.sh (backup/recovery)
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/scripts/install.sh (installation)
- https://raw.githubusercontent.com/dabiggm0e/autoresearch-opencode/master/docs/BACKUP-USAGE.md (recovery docs)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/deep-research.md (our system)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/agents/deep-research.md (our agent)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/research/deep-research-strategy.md (our strategy)

## Architectural Comparison Summary

| Dimension | autoresearch-opencode | Our deep-research | Winner |
|-----------|----------------------|-------------------|--------|
| Architecture | skill + command + plugin | agent + command + skill | Ours (cleaner separation) |
| Context injection | Auto via plugin event hook | Explicit via dispatch prompt | Theirs (more reliable) |
| State format | JSONL (metric-focused) | JSONL (knowledge-focused) | Tied (different goals) |
| Data integrity | Backup scripts + git commits | Append-only JSONL | Theirs (git as checkpoint) |
| Error recovery | 3-tier (backup/git/manual) | Reconstruct from iteration files | Theirs (more robust) |
| Pause/resume | Sentinel file toggle | Convergence detection + :confirm | Both useful (different purposes) |
| Experiment model | keep/discard/crash tristate | Additive (all findings kept) | Ours for research, theirs for optimization |
| Session state | autoresearch.md (prescriptive) | strategy.md (adaptive) | Ours for research (more flexible) |
| Documentation | Single growing worklog | Per-iteration files | Theirs (richer narrative), ours (better for synthesis) |
| User steering | ideas.md + mid-experiment steers | :confirm mode + dispatch context | Theirs (more persistent) |
| Installation | Global (~/.config/opencode/) | Project-local (.opencode/) | Ours (more portable) |

## Assessment
- New information ratio: 0.85
- Questions addressed: Q3, Q4, Q6, Q7
- Questions answered: Q3 (fully -- relationship and differences mapped), Q4 (partially -- state management patterns compared but "better" depends on use case), Q6 (fully -- 3-tier recovery pattern documented), Q7 (partially -- experiment execution is optimization-specific, not directly applicable to research)

## Key Insights for Our System

1. **Adopt: Ideas backlog file.** A persistent `research-ideas.md` in scratch/ would let users steer research across sessions without relying on dispatch prompts.

2. **Adopt: Richer narrative in iteration files.** Adding explicit "Why did this work/fail?" sections to our iteration files would improve synthesis quality.

3. **Adopt: Git checkpoints per significant finding.** While we cannot use their keep/discard model, committing after each iteration would provide recovery points.

4. **Consider: Plugin-based context injection.** If OpenCode supports plugins in our environment, auto-injecting deep-research context would eliminate the context-loss-on-compaction problem.

5. **Consider: Sentinel-file pause.** Adding a `.deep-research-off` sentinel alongside our convergence detection would give users instant manual control.

6. **Skip: Their backup script approach.** Our append-only JSONL is inherently safer than their file-overwrite-plus-backup pattern. Append-only means partial writes do not corrupt prior data.

## Recommended Next Focus
Investigate AGR (Artificial-General-Research) for Q1 (loop architecture) and Q5 (parallel execution), as it is the most architecturally different of the three repos and may have novel patterns not found in the pi-autoresearch lineage. Also begin cross-cutting synthesis for Q8 (convergence algorithms) and Q9 (branching/backtracking strategies) drawing from all three repos.
