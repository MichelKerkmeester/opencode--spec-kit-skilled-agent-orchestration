---
title: sk-deep-research
description: Autonomous deep research loop with iterative investigation, externalized state, and convergence detection
---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Autonomous deep research loop that runs multi-iteration investigations with fresh context per cycle. Unlike single-pass research, it maintains continuity through file-based state while giving each iteration a clean context window.

### Key Statistics

| Metric | Value |
|--------|-------|
| Architecture | 3-layer (Command, Workflow, Agent) |
| State files | 5 (config, JSONL, strategy, iterations, research.md) |
| Convergence signals | 3 (rolling avg, MAD noise, question entropy) |
| Agent type | LEAF-only (no sub-agent dispatch) |
| Tool budget | 8-11 per iteration (max 12) |

### Key Features

- Fresh context per iteration prevents context degradation
- Externalized state via JSONL + strategy.md for cross-iteration continuity
- 3-signal composite convergence detection with configurable thresholds
- Progressive synthesis is enabled by default via `progressiveSynthesis: true`; the agent may update `research.md` incrementally and the orchestrator always finalizes it
- Auto-resume from interrupted sessions
- Reference-only notes cover `:restart`, segment partitioning, wave pruning, checkpoint commits, and alternate `claude -p` dispatch
- Recovery tiers are documented in strict escalation order; direct-mode fallback remains reference-only unless the runtime explicitly supports it

<!-- ANCHOR:quick-start -->
## 2. QUICK START

30-second start -- run one of these commands:

```bash
# Autonomous deep research (no approval gates)
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"

# Interactive mode (approval at each iteration)
/spec_kit:deep-research:confirm "API performance optimization approaches"

# With custom parameters
/spec_kit:deep-research:auto "distributed caching patterns" --max-iterations 15 --convergence 0.02
```

**Verify**: After completion, check `{spec_folder}/research.md` exists and `scratch/deep-research-state.jsonl` shows a `synthesis_complete` event.

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
sk-deep-research/
  SKILL.md                              # 8-section protocol (entry point)
  README.md                             # This file
  references/
    loop_protocol.md                    # Loop lifecycle (4 phases)
    state_format.md                     # JSONL, strategy.md, config.json schemas
    convergence.md                      # Convergence algorithm and tuning
    quick_reference.md                  # One-page cheat sheet
  assets/
    deep_research_config.json           # Loop configuration template
    deep_research_strategy.md           # Strategy file template
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

| Layer | Component | Purpose |
|-------|-----------|---------|
| Command | `/spec_kit:deep-research` | User-facing entry point with YAML workflow |
| Workflow | YAML loop engine | Init, dispatch, evaluate convergence, synthesize |
| Agent | `@deep-research` | LEAF agent executing single research iterations |

### Convergence Detection

Three independent signals cast weighted stop/continue votes:

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 3 | Recent information yield |
| MAD Noise Floor | 0.35 | 4 | Signal vs noise in newInfoRatio |
| Question Entropy | 0.35 | 1 | Coverage of research questions |

Loop stops when weighted stop-score exceeds 0.60.

### Execution Modes

| Mode | Command | Approval Gates |
|------|---------|---------------|
| Auto | `:auto` | None (fully autonomous) |
| Confirm | `:confirm` | After init, before/after each iteration, before/after synthesis |

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
| `deep-research-state.jsonl` | JSONL | Append-only | Structured iteration log |
| `deep-research-strategy.md` | Markdown | Mutable | What worked/failed, next focus |
| `iteration-NNN.md` | Markdown | Write-once | Per-iteration detailed findings |
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
| Spec folder | `.opencode/specs/04--agent-orchestration/028-auto-deep-research/` | Design docs |

### Design Origins

| Innovation | Source | Adaptation |
|------------|--------|------------|
| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch = fresh context |
| Strategy persistent brain | AGR | deep-research-strategy.md |
| JSONL state | pi-autoresearch | deep-research-state.jsonl |
| Stuck detection | AGR | Configurable consecutive-no-progress recovery |
| Context injection | autoresearch-opencode | Strategy file as agent context |
