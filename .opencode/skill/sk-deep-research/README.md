---
title: sk-deep-research
description: Autonomous deep research and review loop with iterative investigation, externalized state, and convergence detection for fresh-context multi-round analysis.
trigger_phrases:
  - "deep research loop"
  - "autonomous iterative research"
  - "convergence detection research"
  - "deep code review audit"
  - "externalized state research agent"
---

# sk-deep-research

> Autonomous iterative research and code review loop that runs multiple investigation cycles with fresh context per iteration, file-based state continuity, and multi-signal convergence detection.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

`sk-deep-research` runs autonomous, multi-iteration investigation loops for topics that require more than a single pass to understand. Each iteration dispatches a fresh agent with no prior context, using file-based state (JSONL log, strategy file, iteration notes) to carry knowledge forward without degrading the context window. When information yield drops below a configurable threshold across multiple consecutive iterations, a 3-signal composite convergence algorithm stops the loop and triggers final synthesis.

The skill operates in two functional modes. Research mode investigates external topics using WebFetch, Grep, and Glob across web sources and the codebase, producing a `research.md` synthesis document. Review mode audits code quality using Read and Grep only, targeting a spec folder or skill package, and produces `{spec_folder}/review/review-report.md` with a binary release readiness verdict. Both modes share the same loop architecture, state format, and convergence detection. The divergence is in agent behavior and output format.

All continuity across iterations comes from disk, not agent memory. The orchestrating command reads JSONL state, checks convergence, and dispatches the next agent with the current strategy file as its only context. This approach eliminates context window exhaustion for long sessions and makes state fully inspectable, resumable, and recoverable.

### Key Statistics

| Metric | Research Mode | Review Mode |
|--------|--------------|-------------|
| Architecture layers | 3 (Command, Workflow, Agent) | 3 (Command, Workflow, Agent) |
| Agent | `@deep-research` (LEAF) | `@deep-review` (LEAF) |
| Default max iterations | 10 | 10 |
| State files | 6 | 6 |
| Convergence signals | 3 (rolling avg 0.30, MAD 0.35, question entropy 0.35) | 3 (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) |
| Quality guards | 3 binary checks (source diversity, focus alignment, no single-weak-source) | 3 binary gates (evidence, scope, coverage) |
| Tool budget per iteration | 8-11 (max 12) | 9-12 (max 13) |
| Output document | `research.md` (17-section synthesis) | `{spec_folder}/review/review-report.md` (9-section findings-first report) |
| Review dimensions | N/A | 4 (Correctness, Security, Traceability, Maintainability) |

### How This Compares

| Without sk-deep-research | With sk-deep-research |
|--------------------------|----------------------|
| Single-pass research that misses edge cases | Multi-iteration loop that narrows from broad survey to specific findings |
| Context window degradation over long sessions | Fresh context per iteration, state on disk |
| Manual tracking of what was tried and what failed | Automatic "Exhausted Approaches" list in strategy.md |
| No stop signal, loop runs forever or stops too early | 3-signal composite convergence with configurable thresholds |
| Code reviews that stop at obvious issues | Structured 4-dimension review with adversarial self-check on P0 findings |
| Research findings mixed with process notes | Separate iteration files, JSONL log, and canonical synthesis document |

### Key Features

| Feature | Description |
|---------|-------------|
| Fresh context per iteration | Each agent dispatch gets a clean context window. No compaction or degradation. |
| Externalized state | JSONL log, strategy.md, and iteration files persist everything across iterations |
| 3-signal convergence | Rolling average, MAD noise floor, and question entropy cast weighted votes |
| Quality guards | Binary pre-convergence checks block premature STOP if evidence is thin |
| Auto-resume | Detects existing state and continues from the last completed iteration |
| Progressive synthesis | Agent may update `research.md` incrementally. Workflow owns final consolidation. |
| Stuck recovery | Diagnosis-led failure classification triggers targeted recovery actions |
| Review mode | Iterative code audit with P0/P1/P2 severity, adversarial self-check, and release verdict |
| Negative knowledge | Ruled-out directions tracked as first-class output in iteration files and JSONL |
| Extended iteration statuses | `insight` and `thought` statuses prevent premature convergence on low-yield iterations |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Choose a mode.** Use Research mode for external topics or codebase exploration. Use Review mode for code quality audits or spec folder validation.

**Step 2: Invoke via command.** All invocations go through `/spec_kit:deep-research`. Append `:auto` for unattended runs or `:confirm` for approval gates between iterations.

```bash
# Research: fully autonomous, no approval gates
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"

# Research: interactive with approval at each step
/spec_kit:deep-research:confirm "API performance optimization approaches"

# Review: autonomous code quality audit of a skill
/spec_kit:deep-research:review:auto "skill:sk-deep-research"

# Review: interactive audit of a spec folder
/spec_kit:deep-research:review:confirm "specs/03--commands-and-skills/030-sk-deep-research-review-mode/"
```

**Step 3: Monitor progress.** The skill auto-generates `{spec_folder}/review/deep-review-dashboard.md` after each review iteration. Read it to see current iteration count, newFindingsRatio trend, and dimension coverage.

**Step 4: Verify output.** After the loop completes, confirm the output file exists and contains a convergence report.

```bash
# Research: verify synthesis was produced
cat {spec_folder}/research.md | head -30

# Review: verify report and verdict
grep "Release Readiness Verdict" {spec_folder}/review/review-report.md
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The core innovation in `sk-deep-research` is treating context as a liability, not an asset. Most AI research workflows accumulate context across steps, eventually compacting and losing precision. This skill inverts that: each iteration starts empty and reads only what the strategy file tells it to read. Knowledge transfers through disk, not memory. Long sessions produce just as sharp results as short ones.

Convergence detection avoids two failure modes that plague iterative loops: stopping too early when initial questions happen to be easy, and running forever when the topic is genuinely exhausted. Three independent signals (rolling average of information yield, median absolute deviation of that yield, and question entropy) each cast a weighted vote. The loop stops only when the weighted stop-score clears 0.60, and only after all quality guards pass. A single new primary finding blocks convergence in review mode regardless of other signals.

Stuck recovery goes beyond a simple retry. When consecutive iterations fall below the yield threshold without triggering convergence, the skill classifies the failure mode (exhausted approach, wrong focus, insufficient source diversity) and selects a targeted recovery action. This is diagnosis before prescription, not random widening.

Review mode reuses the same loop architecture but changes what the agent does inside each iteration. Instead of fetching and summarizing external sources, it reads code with Grep and Read, maps findings to four review dimensions (Correctness, Security, Traceability, Maintainability), and runs an adversarial self-check on any P0 finding before recording it. The synthesis produces a 9-section `{spec_folder}/review/review-report.md` with a three-way verdict: PASS, CONDITIONAL, or FAIL. A PASS verdict includes a `hasAdvisories` flag when P2 findings exist, so callers know the code ships clean but has non-blocking notes.

Progressive synthesis lets the agent update `research.md` incrementally during the loop, rather than waiting until all iterations complete. This means partial results are readable at any point. The orchestrator always performs a final consolidation pass regardless of how many partial updates occurred.

### 3.2 FEATURE REFERENCE

**Architecture layers**

| Layer | Research Mode | Review Mode |
|-------|--------------|-------------|
| Command | `/spec_kit:deep-research[:auto or :confirm]` | `/spec_kit:deep-research:review[:auto or :confirm]` |
| Workflow YAML | `spec_kit_deep-research_auto.yaml` | `spec_kit_deep-research_review_auto.yaml` |
| Agent | `@deep-research` (LEAF) | `@deep-review` (LEAF) |

**Convergence signals**

| Signal | Weight (Research) | Weight (Review) | Min Iterations | Measures |
|--------|------------------|-----------------|---------------|----------|
| Rolling Average | 0.30 | 0.30 | 3 | Recent information yield |
| MAD Noise Floor | 0.35 | 0.25 | 4 | Signal vs noise in newInfoRatio |
| Question Entropy / Dimension Coverage | 0.35 | 0.45 | 1 | Coverage of questions or review dimensions |

**Execution modes**

| Mode | Command Suffix | Approval Gates |
|------|---------------|----------------|
| Research Auto | `:auto` | None (fully autonomous) |
| Research Confirm | `:confirm` | After init, before and after each iteration, before and after synthesis |
| Review Auto | `:review` or `:review:auto` | None (fully autonomous) |
| Review Confirm | `:review:confirm` | After init, before and after each iteration, before and after synthesis |

**Review dimensions**

| Priority | Dimension | What It Checks |
|----------|-----------|---------------|
| 1 | Correctness | Logic, edge cases, error handling |
| 2 | Security | Auth, injection, data exposure |
| 3 | Traceability | Spec vs code alignment, checklist evidence, cross-reference integrity |
| 4 | Maintainability | Patterns, clarity, documentation quality, follow-on change cost |

**Iteration status values**

| Status | Meaning |
|--------|---------|
| `complete` | Normal iteration with new findings |
| `timeout` | Iteration exceeded time or tool budget |
| `error` | Unrecoverable error during iteration |
| `stuck` | No new information, recovery triggered |
| `insight` | Low newInfoRatio but genuine conceptual breakthrough |
| `thought` | Analytical-only iteration, no evidence gathered |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
.opencode/skill/sk-deep-research/
  SKILL.md                              # Entry point: 8-section protocol with smart routing
  README.md                             # This file
  references/
    loop_protocol.md                    # 4-phase loop lifecycle (init, iterate, synthesize, save)
    state_format.md                     # JSONL, strategy.md, and config.json schemas
    convergence.md                      # Stop algorithms, stuck recovery, signal math
    quick_reference.md                  # One-page cheat sheet for both modes
  assets/
    deep_research_config.json           # Loop configuration template (shared, mode field)
    deep_research_strategy.md           # Research strategy file template
    deep_research_dashboard.md          # Research dashboard template
    deep_review_strategy.md             # Review strategy file template
    deep_review_dashboard.md            # Review dashboard template
    review_mode_contract.yaml           # Review mode behavioral contract
```

**Research runtime state files** (created in `{spec_folder}/scratch/` during init)

```
scratch/
  deep-research-config.json            # Immutable after init: loop parameters
  deep-research-state.jsonl            # Append-only structured log of all research iterations
  deep-research-strategy.md            # Mutable: what worked, what failed, next focus
  deep-research-dashboard.md           # Auto-regenerated each research iteration
  iteration-NNN.md                     # Write-once per-iteration detailed findings
research.md                            # Workflow-owned canonical synthesis output

**Review runtime state files** (created in `{spec_folder}/review/` during init)

review/
  deep-research-config.json            # Immutable after init: review parameters
  deep-research-state.jsonl            # Append-only structured log of all review iterations
  deep-review-strategy.md               # Mutable: review dimensions, findings, next focus
  deep-review-dashboard.md              # Auto-regenerated after each review iteration
  iteration-NNN.md                     # Write-once per-iteration detailed findings
  .deep-research-pause                 # Pause sentinel checked between review iterations
  review-report.md                     # Review mode: 9-section findings-first report
```

**Agent definitions** (resolved by active runtime)

| Runtime | Path |
|---------|------|
| OpenCode / Copilot | `.opencode/agent/deep-research.md` and `.opencode/agent/deep-review.md` |
| Claude | `.claude/agents/deep-research.md` and `.claude/agents/deep-review.md` |
| Codex | `.codex/agents/deep-research.toml` |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Command Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 10 | Hard cap on loop iterations |
| `--convergence` | 0.05 | Stop when rolling avg newInfoRatio falls below this value |
| `--spec-folder` | auto-detected | Target spec folder for state and output files |
| `--dimensions` | all | Review mode only: comma-separated list to limit review dimensions |

### Config File Fields (`deep-research-config.json`)

| Field | Type | Description |
|-------|------|-------------|
| `mode` | string | `"research"` or `"review"` |
| `maxIterations` | number | Hard cap copied from command parameter |
| `convergenceThreshold` | number | Rolling avg threshold copied from command parameter |
| `progressiveSynthesis` | boolean | Allow agent to update `research.md` incrementally (default `true`) |
| `specFolder` | string | Resolved spec folder path |
| `topic` | string | Research topic or review target passed at invocation |

### Tuning Guide

| Goal | Adjustment |
|------|------------|
| Deeper research | Lower `--convergence` to 0.02, raise `--max-iterations` to 15 |
| Faster completion | Raise `--convergence` to 0.10, lower `--max-iterations` to 5 |
| Specific narrow answer | Set `--max-iterations 3` to force early synthesis |
| Full review audit | Use default dimensions (all four) and default max iterations |
| Targeted review | Pass `--dimensions correctness,security` to focus first |

### Pause and Resume

Create a file at `scratch/.deep-research-pause` during a running research loop to halt between iterations. Delete the file to resume. Auto-resume detects existing JSONL state on reinvocation and continues from the last completed iteration without re-running prior work. For review mode, use `{spec_folder}/review/.deep-research-pause`.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Deep Research on an Unknown Topic

Run an autonomous research loop on a broad technical topic. The loop will survey multiple sources, narrow its focus through successive iterations, and stop when information yield drops consistently.

```bash
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers" --max-iterations 12
```

Expected progression:
- Init creates `config.json`, `strategy.md` with 5 key questions
- Iterations 1-3: broad survey across official docs, MDN, codebase patterns
- Iterations 4-7: deep dive into specific reconnection strategies and browser edge cases
- Iteration 8: convergence detected (rolling avg newInfoRatio below 0.05 for 3 iterations)
- Synthesis produces `research.md` with full findings
- Memory saved via `generate-context.js`

### Example 2: Narrow Research with Early Convergence

When the topic has a definitive answer, the loop stops after the first iteration that answers all questions.

```bash
/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?" --max-iterations 5
```

Expected progression:
- Init creates config with 2 key questions
- Iteration 1: finds definitive answer from official browser specs
- Question entropy signal votes STOP (all questions answered)
- Loop stops cleanly after 1 iteration
- Synthesis produces compact `research.md`

### Example 3: Iterative Code Quality Review

Run a full 4-dimension review of a skill package, producing a release readiness verdict.

```bash
/spec_kit:deep-research:review:auto "skill:sk-deep-research"
```

Expected progression:
- Init discovers all files in the skill package across all runtimes
- Iteration 1 (inventory): maps artifact structure, identifies cross-reference targets
- Iterations 2-5: Correctness, Security, Traceability, Maintainability passes
- Iteration 6: stabilization pass confirms no new findings across all dimensions
- Convergence: all dimensions covered, binary gates pass, stabilization requirement met
- Synthesis produces `{spec_folder}/review/review-report.md` with verdict PASS or CONDITIONAL

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What you see | Common causes | Fix |
|-------------|---------------|-----|
| Loop stops after 1-2 iterations | Convergence threshold too high, or initial questions answered immediately | Lower `--convergence` from 0.05 to 0.02 and re-run |
| Loop repeats the same research | Exhausted approaches not tracked, or strategy.md not being read | Check that `strategy.md` "Exhausted Approaches" section is populated after each iteration |
| Agent ignores state files | File paths in dispatch prompt do not match actual locations | Verify JSONL and strategy.md paths in the dispatch context match `{spec_folder}/scratch/` for research or `{spec_folder}/review/` for review |
| JSONL parse error on resume | Partial write due to crash or interruption | Validate with `cat scratch/deep-research-state.jsonl \| jq .` for research, or the corresponding review JSONL under `{spec_folder}/review/` |
| Loop runs to max iterations without converging | Threshold too low or topic genuinely exhausted | Raise `--convergence` to 0.08 or 0.10 and re-run with auto-resume |
| Agent dispatches a sub-agent | LEAF constraint violated in agent definition | Verify agent definition contains `task: deny` in its allowed-tools list |
| Review finds no issues on known-bad code | Scope too narrow or files not discovered | Confirm scope includes all relevant files. Check dimension coverage in `{spec_folder}/review/deep-review-dashboard.md`. |
| Review verdict appears wrong | P0 finding severity misclassified | Confirm adversarial self-check ran on the P0 finding in the relevant iteration file |
| `research.md` is empty after synthesis | Progressive synthesis produced no content and final pass also failed | Check `scratch/iteration-NNN.md` files for content. Re-run synthesis step manually. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Can I pause a running autonomous research loop?**
A: Yes. Create a file at `scratch/.deep-research-pause` during the research loop. The orchestrator checks for this file between iterations and halts cleanly if it finds it. For review mode, use `{spec_folder}/review/.deep-research-pause`. Delete the file to continue.

**Q: What happens if the agent crashes mid-iteration?**
A: The orchestrator attempts documented recovery tiers in order. If live recovery cannot continue safely, it halts and reports the failure. Partial state is recoverable from iteration files in `scratch/`. Re-invocation triggers auto-resume from the last completed iteration.

**Q: How do I extend research after convergence?**
A: Raise `--max-iterations` above the number of completed iterations and re-invoke with the same topic. Auto-resume detects existing JSONL state and continues without repeating prior iterations.

**Q: Does review mode modify the code it reviews?**
A: No. The review target is strictly read-only. The `@deep-review` agent writes only to the dedicated `{spec_folder}/review/` packet. It never edits, creates, or deletes any file in the review target.

**Q: What is the difference between review mode and the `@review` agent?**
A: `@review` is a single-pass read-only reviewer. Review mode runs multiple iterations with convergence detection, dimension coverage tracking, cross-reference verification, and produces `{spec_folder}/review/review-report.md` with a three-way verdict (PASS, CONDITIONAL, FAIL). Use `@review` for quick checks and review mode for release gates.

**Q: What happens after review mode finds P0 issues?**
A: The verdict is FAIL and release is blocked. Run `/spec_kit:plan` to create a remediation plan from the findings in `{spec_folder}/review/review-report.md`, implement the fixes, then re-run review mode to confirm resolution.

**Q: How accurate is the newInfoRatio?**
A: The agent self-assesses newInfoRatio each iteration. A simplicity bonus of +0.10 rewards iterations that consolidate or organize prior findings. The MAD noise floor signal detects when ratios are fluctuating too randomly to carry signal, preventing false convergence on noisy data.

**Q: What is wave mode?**
A: Wave mode is documented for future design work only. It is not part of the live executable contract for `/spec_kit:deep-research`. The current live workflow is strictly sequential iteration dispatch.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill References

| Document | Path | Purpose |
|----------|------|---------|
| Loop protocol | `.opencode/skill/sk-deep-research/references/loop_protocol.md` | 4-phase lifecycle: init, iterate, synthesize, save |
| State format | `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL schema, strategy.md format, config.json fields |
| Convergence | `.opencode/skill/sk-deep-research/references/convergence.md` | Stop algorithms, stuck recovery, signal math |
| Quick reference | `.opencode/skill/sk-deep-research/references/quick_reference.md` | One-page cheat sheet for commands and tuning |

### Agent Definitions

| Runtime | Research Agent | Review Agent |
|---------|---------------|-------------|
| Claude | `.claude/agents/deep-research.md` | `.claude/agents/deep-review.md` |
| OpenCode | `.opencode/agent/deep-research.md` | `.opencode/agent/deep-review.md` |
| Codex | `.codex/agents/deep-research.toml` | N/A |

### Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:deep-research` | Primary invocation point for both research and review modes |
| `/spec_kit:plan` | Next step after deep research completes, or after review finds findings |
| `/memory:save` | Manual context preservation (deep research auto-saves on completion) |

### Spec Folders

| Folder | Purpose |
|--------|---------|
| `.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/` | Original design and creation docs |
| `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/` | Review mode research and design docs |

### Design Origins

| Innovation | Source | Adaptation |
|------------|--------|------------|
| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch gives each agent a fresh context |
| Persistent strategy brain | AGR | `deep-research-strategy.md` |
| JSONL state | pi-autoresearch | `deep-research-state.jsonl` |
| Stuck detection | AGR | Configurable consecutive-no-progress recovery |
| Context injection | autoresearch-opencode | Strategy file as agent context seed |

<!-- /ANCHOR:related-documents -->
