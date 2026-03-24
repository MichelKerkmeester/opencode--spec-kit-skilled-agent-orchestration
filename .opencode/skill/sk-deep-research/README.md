---
title: sk-deep-research
description: Autonomous deep research and review loop with iterative investigation, externalized state, and convergence detection
version: 1.2.0
---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Autonomous deep research and review loop that runs multi-iteration investigations with fresh context per cycle. Unlike single-pass research or review, it maintains continuity through file-based state while giving each iteration a clean context window.

Two functional modes: **Research** (investigate external topics via WebFetch) and **Review** (audit code quality via Read/Grep/Glob with P0/P1/P2 findings).

### Key Statistics

| Metric | Research Mode | Review Mode |
|--------|-------|------|
| Architecture | 3-layer (Command, Workflow, Agent) | Same |
| Agent | `@deep-research` (LEAF) | `@deep-review` (LEAF) |
| State files | 6 (config, JSONL, strategy, dashboard, iterations, research.md) | 6 (config, JSONL, strategy, dashboard, iterations, review-report.md) |
| Convergence signals | 3 (rolling avg 0.30, MAD 0.35, question entropy 0.35) | 3 (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) |
| Quality guards | 3 (source diversity, focus alignment, no single-weak-source) | 5 (evidence completeness, scope alignment, no inference-only, severity coverage, cross-reference) |
| Tool budget | 8-11 per iteration (max 12) | 9-12 per iteration (max 13) |
| Output | research.md (17-section synthesis) | review-report.md (11-section findings-first report) |

### Key Features

**Shared (both modes):**
- Fresh context per iteration prevents context degradation
- Externalized state via JSONL + strategy.md for cross-iteration continuity
- 3-signal composite convergence detection with configurable thresholds
- Persistent dashboard auto-generated after each iteration
- Negative knowledge (ruled-out directions) tracked as first-class output
- Extended iteration statuses (`insight`, `thought`) prevent premature convergence
- Novelty justification required on every iteration record
- Per-iteration time/tool budget enforcement
- Diagnosis-led recovery with failure mode classification for stuck iterations
- Progressive synthesis enabled by default
- Auto-resume from interrupted sessions

**Research mode specific:**
- Quality guards (source diversity, focus alignment, no single-weak-source)
- Research charter with explicit non-goals and stop conditions
- Source-hygiene confirmation (tentative findings excluded from coverage)
- Track labels for focus grouping and post-hoc analysis

**Review mode specific:**
- Severity-weighted `newFindingsRatio` with P0 override rule (single new P0 blocks convergence)
- 7 review dimensions: Correctness, Security, Spec Alignment, Completeness, Cross-Ref Integrity, Patterns, Documentation Quality
- 6 cross-reference verification protocols (spec vs code, checklist vs evidence, SKILL.md vs agent, cross-runtime, feature catalog, playbook)
- P0/P1/P2 severity classification with file:line evidence
- Hunter/Skeptic/Referee adversarial self-check (tiered: P0 in-iteration, P1 compact, full at synthesis)
- 5 quality guards (evidence completeness, scope alignment, no inference-only, severity coverage, cross-reference)
- 11-section review-report.md with release readiness verdict (PASS/PASS WITH NOTES/CONDITIONAL/FAIL)
- Review target is strictly read-only — never modifies code under review

<!-- ANCHOR:quick-start -->
## 2. QUICK START

30-second start -- run one of these commands:

```bash
# Research: Autonomous deep research (no approval gates)
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"

# Research: Interactive mode (approval at each iteration)
/spec_kit:deep-research:confirm "API performance optimization approaches"

# Research: With custom parameters
/spec_kit:deep-research:auto "distributed caching patterns" --max-iterations 15 --convergence 0.02

# Review: Autonomous code quality audit
/spec_kit:deep-research:review "skill:sk-deep-research"

# Review: Interactive with approval gates
/spec_kit:deep-research:review:confirm ".opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/"

# Review: Specific dimensions only
/spec_kit:deep-research:review:auto "agent:deep-research" --dimensions security,correctness
```

**Verify (research)**: Check `{spec_folder}/research.md` exists and `scratch/deep-research-state.jsonl` shows a `synthesis_complete` event.
**Verify (review)**: Check `{spec_folder}/review-report.md` exists with a Release Readiness Verdict section.

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
sk-deep-research/
  SKILL.md                              # 8-section protocol (entry point)
  README.md                             # This file
  references/
    loop_protocol.md                    # Loop lifecycle (4 phases + review mode loop)
    state_format.md                     # JSONL, strategy.md, config.json schemas (research + review)
    convergence.md                      # Convergence algorithm (research + review adaptation)
    quick_reference.md                  # One-page cheat sheet (both modes)
  assets/
    deep_research_config.json           # Loop configuration template (shared, mode field)
    deep_research_strategy.md           # Research strategy file template
    deep_research_dashboard.md          # Research dashboard template
    deep_review_strategy.md             # Review strategy file template (dimensions, findings)
    deep_review_dashboard.md            # Review dashboard template (severity, coverage)
```

### Runtime Path Resolution

Resource paths are resolved relative to the installed `sk-deep-research` directory, so `references/` and `assets/` links work regardless of the current working directory.

Agent definitions follow the active runtime:
- OpenCode / Copilot: `.opencode/agent/`
- ChatGPT: `.opencode/agent/chatgpt/`
- Claude: `.claude/agents/`
- Codex: `.codex/agents/`

### Key Files

| File | Purpose | When to Read |
|------|---------|-------------|
| `SKILL.md` | Full protocol with smart routing | Always (entry point) |
| `references/loop_protocol.md` | 4-phase loop lifecycle and dispatch contract | Setting up or debugging loops |
| `references/convergence.md` | Stop algorithms, stuck recovery, signal math | Tuning convergence behavior |
| `references/state_format.md` | JSONL schema, strategy format, file protection | Understanding state files |
| `references/quick_reference.md` | Commands, tuning, troubleshooting cheat sheet | Quick lookup during use |

<!-- ANCHOR:features -->
## 4. FEATURES

### 3-Layer Architecture

| Layer | Research Mode | Review Mode |
|-------|-----------|---------|
| Command | `/spec_kit:deep-research[:auto\|:confirm]` | `/spec_kit:deep-research:review[:auto\|:confirm]` |
| Workflow | `spec_kit_deep-research_auto.yaml` | `spec_kit_deep-research_review_auto.yaml` |
| Agent | `@deep-research` (LEAF) | `@deep-review` (LEAF) |

### Convergence Detection

Three independent signals cast weighted stop/continue votes:

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 3 | Recent information yield |
| MAD Noise Floor | 0.35 | 4 | Signal vs noise in newInfoRatio |
| Question Entropy | 0.35 | 1 | Coverage of research questions |

Loop stops when weighted stop-score exceeds 0.60, **but only after quality guards pass**. Three binary checks run before any convergence STOP: source diversity (>=2 distinct sources), focus alignment (iteration matched its assigned focus), and no single-weak-source reliance. If any guard fails, the STOP is overridden to CONTINUE.

### Execution Modes

| Mode | Command | Approval Gates |
|------|---------|---------------|
| Research Auto | `:auto` | None (fully autonomous) |
| Research Confirm | `:confirm` | After init, before/after each iteration, before/after synthesis |
| Review Auto | `:review` or `:review:auto` | None (fully autonomous) |
| Review Confirm | `:review:confirm` | After init, before/after each iteration, before/after synthesis |

### Review Mode: 7 Dimensions

When invoked with `:review`, iterations focus on one dimension at a time:

| Priority | Dimension | Checks |
|----------|-----------|--------|
| 1 | Correctness | Logic, edge cases, error handling |
| 2 | Security | Auth, injection, data exposure |
| 3 | Spec Alignment | Spec claims vs actual code |
| 4 | Completeness | Required files, tests, checklist items |
| 5 | Cross-Ref Integrity | IDs, links, runtime anchors |
| 6 | Patterns | Coding standards, template compliance |
| 7 | Documentation Quality | Accuracy, clarity, completeness |

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 10 | Maximum loop iterations (hard cap) |
| `--convergence` | 0.05 | Stop when avg newInfoRatio below this |
| `--spec-folder` | auto | Target spec folder path |
| `progressiveSynthesis` | true | Allow incremental `research.md` updates before final synthesis |

### State Files (Runtime)

All state files are created in `{spec_folder}/scratch/` during initialization.

| File | Format | Mutability | Purpose |
|------|--------|-----------|---------|
| `deep-research-config.json` | JSON | Immutable after init | Loop parameters |
| `deep-research-state.jsonl` | JSONL | Append-only | Structured iteration log (includes novelty justification, track labels, ruledOut) |
| `deep-research-strategy.md` | Markdown | Mutable | What worked/failed, next focus, non-goals, stop conditions (research charter) |
| `deep-research-dashboard.md` | Markdown | Auto-generated | Human-readable progress summary, regenerated each iteration |
| `iteration-NNN.md` | Markdown | Write-once | Per-iteration detailed findings (includes Ruled Out / Dead Ends sections) |
| `research.md` | Markdown | Mutable | Workflow-owned canonical synthesis output; agent may update it incrementally when `progressiveSynthesis` is true |

### Tuning Guide

| Goal | Adjustment |
|------|------------|
| Deeper research | Lower convergence (0.02), raise max iterations (15) |
| Faster completion | Raise convergence (0.10), lower max iterations (5) |
| Broader coverage | Start with broad topic, let iterations narrow |
| Specific answer | Start with specific question, lower max iterations (5) |

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Deep Research on Unknown Topic

1. `/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"`
2. Init creates config, strategy with 5 key questions
3. Iterations 1-3: Broad survey, official docs, codebase patterns
4. Iterations 4-6: Deep dive into specific strategies, edge cases
5. Iteration 7: Convergence detected after recent newInfoRatio values stay below the configured threshold
6. Synthesis produces research.md
7. Memory saved via generate-context.js

### Narrow Research with Early Convergence

1. `/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?"`
2. Init creates config with 2 key questions
3. Iteration 1: Finds definitive answer from official specs
4. All questions answered after iteration 1
5. Loop stops cleanly, research.md produced

### Stuck Recovery

1. Iterations 4-6 all have newInfoRatio below the configured threshold
2. Stuck recovery triggers at iteration 7
3. Recovery widens focus to least-explored question
4. Iteration 7 finds new angle, newInfoRatio jumps to 0.4
5. Loop continues productively

### Review: Spec Folder Audit

1. `/spec_kit:deep-research:review ".opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/"`
2. Init discovers target files, orders dimensions (correctness → security → ...)
3. Iteration 1 (inventory): Maps artifact structure, identifies cross-reference targets
4. Iterations 2-4: Correctness, Security, Spec Alignment passes
5. Iteration 5: Cross-reference check finds checklist item marked [x] but missing evidence (P1)
6. Iteration 6-7: Remaining dimensions, no new P0/P1 findings
7. Convergence: all dimensions covered, newFindingsRatio < 0.08 for 2 iterations
8. Synthesis: review-report.md with verdict CONDITIONAL (1 P1 remaining)

### Review: Skill Quality Audit

1. `/spec_kit:deep-research:review:auto "skill:sk-deep-research"`
2. Scope discovery finds SKILL.md, references/, assets/, agents across 5 runtimes
3. Iterations focus on agent cross-runtime consistency, SKILL.md vs agent alignment
4. Finds P2: Codex agent TOML has slightly different wording in workflow step 3
5. All dimensions clean otherwise → verdict PASS WITH NOTES

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Stops too early | Convergence threshold too high | Lower `--convergence` from 0.05 to 0.02 |
| Repeats same research | Exhausted approaches not read | Check strategy.md "Exhausted Approaches" is populated |
| Agent ignores state | File paths wrong in dispatch | Verify paths in dispatch prompt match actual locations |
| State file corrupt | Partial write or crash | Validate JSONL: `cat scratch/deep-research-state.jsonl \| jq .` |
| Loop runs too long | Threshold too low or max too high | Set lower `--max-iterations` or higher `--convergence` |
| Agent dispatches sub-agents | LEAF constraint violated | Verify agent definition has `task: deny` |
| Review finds no issues | Clean codebase or scope too narrow | Verify scope includes all relevant files; check dimension coverage in dashboard |
| Review verdict wrong | Severity misclassification | Check adversarial self-check ran on P0/P1; review finding evidence |
| Review modifies code | Agent violated read-only rule | Verify @deep-review agent has review target as read-only in permissions |

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Can I pause a running autonomous research loop?**
A: Yes. Create a file at `scratch/.deep-research-pause` and the loop will halt between iterations. Delete the file to resume.

**Q: What happens if the agent crashes mid-iteration?**
A: The orchestrator first tries documented recovery tiers in order. If live recovery cannot continue safely, it halts for repair or user direction. Partial state is recoverable from iteration files.

**Q: How do I extend research after convergence?**
A: Increase `--max-iterations` and re-run. Auto-resume detects existing state and continues from the last completed iteration.

**Q: What is wave mode?**
A: Wave mode is currently reference-only. The live executable workflow stays sequential, but the design notes remain documented for future expansion.

**Q: How accurate is newInfoRatio?**
A: It is self-assessed by the agent. A simplicity bonus (+0.10) rewards iterations that consolidate findings. The MAD noise floor signal helps detect when ratios are indistinguishable from noise.

**Q: What is review mode?**
A: Review mode (`/spec_kit:deep-research:review`) reuses the iterative loop but audits code quality instead of researching external topics. It dispatches `@deep-review` agents that produce P0/P1/P2 findings with file:line evidence across 7 review dimensions.

**Q: Does review mode modify the code it reviews?**
A: No. The review target is strictly read-only. The agent only writes to scratch/ state files (iteration files, strategy, JSONL).

**Q: What's the difference between review mode and @review agent?**
A: `@review` is a single-pass read-only reviewer. Review mode runs multiple iterations with convergence detection, cross-reference verification, dimension coverage tracking, and produces a comprehensive review-report.md with release readiness verdict.

**Q: What happens after review mode finds P0 issues?**
A: The verdict is FAIL and release is blocked. Run `/spec_kit:plan` to create a remediation plan from the review-report.md findings, then `/spec_kit:implement` to fix them, then re-run review mode to verify.

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | Path | Purpose |
|----------|------|---------|
| Agent definition (Claude) | `.claude/agents/deep-research.md` | Claude runtime agent |
| Agent definition (OpenCode) | `.opencode/agent/deep-research.md` | Default agent definition |
| Command definition | `.opencode/command/spec_kit/deep-research.md` | Command entry point |
| YAML workflow (auto) | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Autonomous loop workflow |
| YAML workflow (confirm) | `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Interactive loop workflow |
| YAML workflow (review auto) | `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | Autonomous review workflow |
| YAML workflow (review confirm) | `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` | Interactive review workflow |
| Agent definition (deep-review) | `.opencode/agent/deep-review.md` | Review LEAF agent |
| Review strategy template | `.opencode/skill/sk-deep-research/assets/deep_review_strategy.md` | Review strategy template |
| Review dashboard template | `.opencode/skill/sk-deep-research/assets/deep_review_dashboard.md` | Review dashboard template |
| Spec folder (creation) | `.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/` | Design docs |
| Spec folder (review mode) | `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/` | Review mode research + design |

### Design Origins

| Innovation | Source | Adaptation |
|------------|--------|------------|
| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch = fresh context |
| Strategy persistent brain | AGR | deep-research-strategy.md |
| JSONL state | pi-autoresearch | deep-research-state.jsonl |
| Stuck detection | AGR | Configurable consecutive-no-progress recovery |
| Context injection | autoresearch-opencode | Strategy file as agent context |

<!-- ANCHOR:version-history -->
## 10. VERSION HISTORY

### v1.2.0

- **Review mode**: New `:review` functional mode for iterative code quality auditing (`/spec_kit:deep-research:review`)
- **@deep-review agent**: Hybrid LEAF agent combining @review rubric (P0/P1/P2, 5-dimension scoring, Hunter/Skeptic/Referee) with @deep-research state protocol (JSONL, strategy, iteration lifecycle)
- **7 review dimensions**: Correctness, Security, Spec Alignment, Completeness, Cross-Ref Integrity, Patterns, Documentation Quality
- **6 cross-reference protocols**: Spec vs code, checklist vs evidence, SKILL.md vs agent, cross-runtime, feature catalog, playbook
- **Severity-weighted convergence**: `newFindingsRatio` with P0 override rule; adapted signal weights (rolling avg 0.30, MAD 0.25, dimension coverage 0.45)
- **5 review quality guards**: Evidence completeness, scope alignment, no inference-only, severity coverage, cross-reference
- **11-section review-report.md**: Findings-first output with release readiness verdict (PASS/PASS WITH NOTES/CONDITIONAL/FAIL)
- **Review strategy + dashboard templates**: Dimension tracking, running findings, cross-reference status, coverage map
- **Post-review workflow**: 4 verdicts with next-command recommendations

### v1.1.0

- **Persistent dashboard**: Auto-generated `deep-research-dashboard.md` refreshed after every iteration from JSONL + strategy data
- **Quality guards**: 3 binary checks (source diversity, focus alignment, no single-weak-source) must pass before convergence STOP can trigger
- **Negative knowledge**: Ruled-out directions and dead ends tracked as first-class output in iteration files and JSONL `ruledOut` field
- **Extended iteration statuses**: `insight` (conceptual breakthrough despite low ratio) and `thought` (analytical-only, no evidence gathering) prevent premature convergence
- **Novelty justification**: Every JSONL iteration record requires a 1-sentence explanation of what was genuinely new
- **Track labels**: Free-form `focusTrack` labels on iterations for grouping and dashboard filtering
- **Per-iteration time/tool budget**: Configurable budget enforcement per iteration
- **Diagnosis-led recovery**: Failure mode classification for stuck iterations guides targeted recovery actions
- **Research charter**: Strategy.md now includes Non-Goals and Stop Conditions sections validated at init
- **Source-hygiene confirmation**: Tentative findings excluded from answered-question coverage until independently confirmed

### v1.0.0

- Initial release: 3-layer architecture, JSONL state, 3-signal composite convergence, auto/confirm modes, progressive synthesis, auto-resume
