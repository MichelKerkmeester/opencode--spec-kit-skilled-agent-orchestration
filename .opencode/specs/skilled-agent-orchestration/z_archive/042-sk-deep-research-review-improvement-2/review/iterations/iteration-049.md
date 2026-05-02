---
iteration: 49
dimension: traceability
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-release-readiness
startedAt: 2026-04-12T18:44:27Z
completedAt: 2026-04-12T18:49:53Z
---

# Deep Review Iteration 049 — traceability (Round 3 Release)

**Focus:** RELEASE: Check root repo README.md for accuracy. Verify the deep-research, deep-review, and improve-agent sections match current capabilities. Check skill catalog entries have correct version numbers. Look for any remaining stale descriptions.

---

● skill(sk-code-review)

● skill(sk-code-opencode)

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 49: traceability re…
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

I’m checking the README against the live skill docs and catalog metadata now, with focus on the three sections you called out plus version labels.

● Search (grep)
  │ "deep-research|deep-review|improve-agent|skill catalog|version" (README.md)
  └ 89 lines found

● Read README.md
  └ L1:260 (260 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-deep-research/SKILL.md
  └ L1:260 (259 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-deep-review/SKILL.md
  └ L1:260 (260 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-improve-agent/SKILL.md
  └ L1:260 (259 lines read)

I’ve got the core skill docs loaded. Next I’m cross-checking the exact README sections and the source-of-truth catalog/command files for lifecycle modes and version strings.

● Read README.md
  └ L560:930 (348 lines read)

● Search (glob)
  │ "**/deep-research*.{yaml,yml,md,json}"
  └ 9 files found

● Search (glob)
  │ "**/*skill*catalog*.*"
  └ No matches found

● Search (glob)
  │ "**/deep-review*.{yaml,yml,md,json}"
  └ 9 files found

● Search (glob)
  │ "**/improve-agent*.{yaml,yml,md,json}"
  └ 3 files found

● Search (grep)
  │ "1\.6\.2\.0|1\.3\.2\.0|1\.2\.2\.0|sk-deep-research|sk-deep-review|sk-improve-agent" in
  │ **/*.{md,json,jsonc,yaml,yml}
  └ 7 lines found

● Read README.md
  └ L906:955 (50 lines read)

● Read deep-research.md
  │ .opencode/command/spec_kit/deep-research.md
  └ L1:260 (259 lines read)

● Read deep-review.md
  │ .opencode/command/spec_kit/deep-review.md
  └ L1:260 (260 lines read)

● Search (glob)
  │ "**/improve/agent*.md" in .opencode/command
  └ 1 file found

● Search (glob)
  │ "**/improve-agent*.md" in .opencode/command
  └ No matches found

● Read improve-agent.md
  │ .opencode/agent/improve-agent.md
  └ L1:220 (220 lines read)

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ L1:260 (259 lines read)

I’ve found one likely stale area already: the README’s top-level count blurbs disagree with each other. I’m verifying those counts against the actual repo layout so the report stays grounded.

● Search (grep)
  │ "11 Specialized Agents|11 custom specialists|12 specialized agents|21 command entry points|23
  │ command entry points|Documentation version: 4\.2" (README.md)
  └ 6 lines found

● Search (grep)
  │ "synthesis_complete|terminal stop metadata|finalSeverity|stale STOP veto|plateau|session-boundar
  │ y|legal_stop_evaluated|blocked_stop|resume|restart|fork|completed-continue" in
  │ {sk-deep-research,sk-deep-review,sk-improve-agent}/**/*.{md,ts,js,cjs,json,yaml,yml}
  │ (.opencode/skill)
  └ No matches found

● Search (grep)
  │ "version:\s*1\.6\.2\.0|version:\s*1\.3\.2\.0|version:\s*1\.2\.2\.0" in */SKILL.md
  │ (.opencode/skill)
  └ No matches found

● Count agents skills commands (shell)
  │ cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && printf 'agents=%s\n'
  │ "$(find .opencode/agent -maxdepth 1 -type f -name '*.md' | wc -l | tr -d ' ')" && printf
  │ 'skills=%s\n' "$(find .opencode/skill -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')" &&
  │ printf 'commands=%s\n' "$(find .opencode/command -type f -name '*.md' | wc -l | tr -d ' ')"
  └ 4 lines...

● Search (grep)
  │ "version:\s" (.opencode/skill/sk-deep-research/SKILL.md)
  └ 1 line found

● Search (grep)
  │ "version:\s" (.opencode/skill/sk-deep-review/SKILL.md)
  └ 1 line found

● Search (grep)
  │ "version:\s" (.opencode/skill/sk-improve-agent/SKILL.md)
  └ 1 line found

● Search (glob)
  │ ".opencode/agent/*.md"
  └ 12 files found

● Search (glob)
  │ ".opencode/skill/*/SKILL.md"
  └ 20 files found

● Search (glob)
  │ ".opencode/command/**/*.md"
  └ 24 files found

I’m validating the “fancy” capability bullets now—the ones most likely to drift from reality—rather than just trusting the section summaries.

● Search (grep)
  │ "sourceDiversity|evidenceDepth|graphEvents|blendedScore|quality
  │ guards|weak-source|progressiveSynthesis|completed-continue|fork" in
  │ **/*.{md,ts,js,cjs,json,yaml,yml} (.opencode/skill/sk-deep-research)
  └ 7 lines found

● Search (grep)
  │ "stale STOP|stale stop|finalSeverity|Hunter|Skeptic|Referee|graphEvents|legal-stop|quality
  │ gates|PASS|CONDITIONAL|FAIL" in **/*.{md,ts,js,cjs,json,yaml,yml}
  │ (.opencode/skill/sk-deep-review)
  └ 7 lines found

● Search (grep)
  │ "plateau|session-boundary|legal_stop_evaluated|blocked_stop|dynamic mode|static
  │ mode|generate-profile|no hardcoded profiles|repeatability|approval" in
  │ **/*.{md,ts,js,cjs,json,yaml,yml} (.opencode/skill/sk-improve-agent)
  └ 7 lines found

✗ Search (grep)
  │ "permission:|read-only|NEVER modifies|proposal-only|packet-local|canonical target"
  │ (.opencode/agent/{deep-research.md,deep-review.md,improve-agent.md})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/{deep-rese
    arch.md,deep-review.md,improve-agent.md}: IO error for operation on
    /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/{deep-research
    .md,deep-review.md,improve-agent.md}: No such file or directory (os error 2)

● Search (grep)
  │ "plateau|session-boundary|legal_stop_evaluated|blocked_stop|dynamic|static"
  │ (.opencode/command/improve/agent.md)
  └ 20 lines found

● Search (grep)
  │ "fork|completed-continue|resume|restart" in
  │ deep-research.md,assets/spec_kit_deep-research_*.yaml (.opencode/command/spec_kit)
  └ No matches found

● Search (grep)
  │ "permission:|proposal-only|NEVER modifies|read-only|canonical target|packet-local" in
  │ {deep-research,deep-review,improve-agent}.md (.opencode/agent)
  └ 30 lines found

● Search (grep)
  │ "plateau|sessionBoundary|session-boundary|repeatability|approval|dynamic mode|static
  │ mode|generate-profile|hardcoded profiles" in **/*.{md,js,cjs,json,yaml,yml}
  │ (.opencode/skill/sk-improve-agent)
  └ 7 lines found

● Read improvement_config.json
  │ .opencode/skill/sk-improve-agent/assets/improvement_config.json
  └ L1:220 (121 lines read)

● Search (grep)
  │ "static|handover|context-prime|profile=ID|promot|approval|repeatability|plateauWindow|sessionBou
  │ ndary|legal_stop_evaluated|blocked_stop" in **/*.{js,cjs,ts,py}
  │ (.opencode/skill/sk-improve-agent/scripts)
  └ 48 lines found

● Search (grep)
  │ "fork|completed-continue|sourceDiversity|evidenceDepth|blendedScore|graphEvents|synthesis_comple
  │ te" in **/*.{md,yaml,yml,json} (.opencode/command/spec_kit)
  └ 36 lines found

● Read deep-research.md
  │ .opencode/agent/deep-research.md
  └ L1:120 (120 lines read)

● Read deep-review.md
  │ .opencode/agent/deep-review.md
  └ L1:120 (119 lines read)

● Read README.md
  └ L1:80 (80 lines read)

● Search (grep)
  │ "supportedProfiles|promotionEligibleProfiles|targetProfile|dynamicProfileEnabled|static" in
  │ **/*.{json,jsonc,md,cjs,js} (.opencode/skill/sk-improve-agent)
  └ 30 lines found

● Search (grep)
  │ "21 commands|20 skills|11 Agents|11 Specialized Agents|23 command entry points" (README.md)
  └ 7 lines found

● Search (glob)
  │ ".opencode/skill/sk-improve-agent/assets/target-profiles/*"
  └ No matches found

One more drift surfaced while checking the count mismatch: the README still documents a **Prompt** create command, but I don’t see a corresponding `.opencode/command/create/prompt.md` entrypoint. I’m verifying that before I include it.

● Search (grep)
  │ "stale STOP veto|auto-clearing|finalSeverity|Hunter/Skeptic/Referee|Hunter|Skeptic|Referee|relea
  │ seReadinessState" in **/*.{md,js,cjs,json,yaml,yml} (.opencode/skill/sk-deep-review)
  └ 46 lines found

● Search (grep)
  │ "session-boundary|fresh-session|session boundary|plateau|coverage|journal|lineage" in
  │ **/*.{md,js,cjs,json} (.opencode/skill/sk-improve-agent)
  └ 6 lines found

● Search (glob)
  │ ".opencode/command/create/*.md"
  └ 6 files found

● Search (grep)
  │ "create:prompt|/create:prompt|command/create/prompt\.md|\*\*Prompt\*\*" in
  │ **/*.{md,json,jsonc,yaml,yml}
  └ 8 lines found

● Search (grep)
  │ "11 Agents|11 Specialized Agents|21 command entry points|21 commands" (README.md)
  └ 4 lines found

● Search (grep)
  │ "session-boundary|fresh-session|coverage graph|mutation-coverage|journal|lineage" in
  │ README.md,SKILL.md,assets/*.md,assets/*.json,references/*.md,scripts/*.cjs
  │ (.opencode/skill/sk-improve-agent)
  └ No matches found

● Search (grep)
  │ "Prompt\*\*|/create:prompt|create:prompt Command" in
  │ README.md,.opencode/install_guides/*.md,specs/descriptions.json
  └ No matches found

I’ve narrowed it down to documentation drift rather than capability drift in the three requested skill entries themselves. I’m grabbing the exact source lines for the contradictory command/docs surfaces before I write the findings.

● Read evaluator_contract.md
  │ .opencode/skill/sk-improve-agent/references/evaluator_contract.md
  └ L30:50 (21 lines read)

● Read improvement_config_reference.md
  │ .opencode/skill/sk-improve-agent/assets/improvement_config_reference.md
  └ L30:55 (26 lines read)

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ L229:235 (6 lines read)

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ L405:412 (8 lines read)

● Read README.md
  └ L758:771 (14 lines read)

● Read README.md
  └ L738:747 (9 lines read)

● Search (grep)
  │ "read-only|review target files are strictly READ-ONLY|finalSeverity|stale
  │ STOP|PASS/CONDITIONAL/FAIL" in README.md,SKILL.md,references/*.md,assets/*.yaml,assets/*.json
  │ (.opencode/skill/sk-deep-review)
  └ No matches found

● Search (grep)
  │ "session-boundary|fresh-session|boundary gate|fresh-session
  │ isolation|legal_stop_evaluated|blocked_stop|coverage graph|mutation-coverage" in
  │ **/*.{md,json,cjs,js} (.opencode/skill/sk-improve-agent)
  └ 7 lines found

● Search (grep)
  │ "sourceDiversity|evidenceDepth|graph convergence|progressive synthesis|negative
  │ knowledge|synthesis_complete" in README.md,SKILL.md,references/*.md,assets/*.md,assets/*.json
  │ (.opencode/skill/sk-deep-research)
  └ No matches found

● Search (grep)
  │ "read-only|READ-ONLY|finalSeverity|stale STOP|PASS/CONDITIONAL/FAIL"
  │ (.opencode/skill/sk-deep-review)
  └ 45 lines found

● Search (grep)
  │ "session-boundary|fresh-session|legal_stop_evaluated|blocked_stop|mutation-coverage|coverage
  │ graph" (.opencode/skill/sk-improve-agent)
  └ 7 lines found

● Search (grep)
  │ "sourceDiversity|evidenceDepth|progressive synthesis|negative knowledge|synthesis_complete"
  │ (.opencode/skill/sk-deep-research)
  └ 38 lines found

● Search (grep)
  │ "session-boundary|fresh-session isolation|session boundary" (.opencode/skill/sk-improve-agent)
  └ 1 line found

● Search (grep)
  │ "journal|lineage|coverage" (.opencode/skill/sk-improve-agent/README.md)
  └ 5 lines found

## Findings

### P1
- **F-049-001 — README still advertises a `Prompt` create command that is not shipped.**  
  `README.md:743-746` documents a `**Prompt**` entry under **CREATE**, but the shipped create entrypoints are only the six files under `.opencode/command/create/` (`agent.md`, `changelog.md`, `feature-catalog.md`, `folder_readme.md`, `sk-skill.md`, `testing-playbook.md`). This means a reader following the README to `/create:prompt` will hit a dead end.  
  **Risk:** release-facing docs direct users to a nonexistent command.  
  **Recommended fix:** either restore a real `.opencode/command/create/prompt.md` entrypoint or remove/rename the README entry.

### P2
- **F-049-002 — Root README count badges and summary lines are internally inconsistent.**  
  The same file says **12 agents** at `README.md:7` and `README.md:52`, but **11 agents** at `README.md:11` and `README.md:61`. It also says **21 command entry points / 21 commands** at `README.md:7`, `README.md:63`, and `README.md:1165`, while later claiming **23 command entry points** at `README.md:648`.  
  **Risk:** the root README is no longer a trustworthy source for high-level inventory counts.  
  **Recommended fix:** normalize the hero blurb, “At a Glance” table, and footer to one audited set of counts.

- **F-049-003 — Improve Agent traceability is split-brain between the README and the command entrypoint.**  
  The root README describes Improve Agent as a dynamic, any-agent workflow with “no hardcoded profiles needed” (`README.md:760-771`). That matches the current skill/reference truth: dynamic mode is the only supported scoring path in `sk-improve-agent/references/evaluator_contract.md:36-38` and `sk-improve-agent/assets/improvement_config_reference.md:35,50`. But the user-facing `/improve:agent` command still documents a legacy **Static** mode and “only handover target with static profile is promotion-eligible” in `.opencode/command/improve/agent.md:229-235` and `.opencode/command/improve/agent.md:408-410`.  
  **Risk:** operators get contradictory instructions depending on whether they start from the README or the command doc.  
  **Recommended fix:** remove the stale static-mode/handover-only promotion language from `/improve:agent`, or explicitly downgrade the README if static mode is still intentionally live.

## Iteration Summary

The requested **deep-research** and **deep-review** README sections look aligned with current skill/command surfaces. The **skill catalog version numbers** also check out: `sk-deep-research` `v1.6.2.0`, `sk-deep-review` `v1.3.2.0`, and `sk-improve-agent` `v1.2.2.0` match their `SKILL.md` frontmatter.

The remaining release-readiness drift is documentation traceability: one nonexistent create command, stale/inconsistent top-level counts, and an Improve Agent command doc that still describes a legacy static-mode contract.

## Coverage Assessment

Reviewed root `README.md` overview/counts, agent summaries, command architecture, and skills catalog sections; cross-checked against current `SKILL.md`, command entrypoints, and agent docs for `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent`.

## Confidence

**High** — the version checks and deep-research/deep-review capability checks are directly supported by current source docs, and the stale README items are either internal contradictions or contradicted by the shipped command/skill surfaces.


Changes   +0 -0
Requests  1 Premium (5m 24s)
Tokens    ↑ 2.1m • ↓ 15.6k • 2.0m (cached) • 9.5k (reasoning)
