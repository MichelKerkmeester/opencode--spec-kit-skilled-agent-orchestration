# sk-deep-research

> Autonomous deep research loop with iterative investigation, externalized state, and convergence detection.

## Overview

sk-deep-research enables multi-iteration deep research where each cycle builds on prior findings. Unlike single-pass research (`/spec_kit:research`), it runs autonomously for multiple rounds, using file-based state to maintain continuity across fresh agent contexts.

**Key features**:
- Fresh context per iteration (prevents context degradation)
- Externalized state via JSONL + strategy.md
- Convergence detection (diminishing returns, stuck recovery)
- Progressive synthesis (research.md updated each iteration)
- Auto-resume from interrupted sessions

## Quick Start

```bash
# Autonomous deep research (no approval gates)
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"

# Interactive mode (approval at each iteration)
/spec_kit:deep-research:confirm "API performance optimization approaches"

# With custom parameters
/spec_kit:deep-research:auto "distributed caching patterns" --max-iterations 15 --convergence 0.02
```

## Structure

```
sk-deep-research/
  SKILL.md                              # 8-section protocol (entry point)
  README.md                             # This file
  references/
    loop-protocol.md                    # Loop lifecycle (4 phases)
    state-format.md                     # JSONL, strategy.md, config.json schemas
    convergence.md                      # Convergence algorithm and tuning
    quick_reference.md                  # One-page cheat sheet
  templates/
    deep-research-config.json            # Loop configuration template
    deep-research-strategy.md            # Strategy file template
```

## Architecture

The system has 3 layers:

| Layer | Component | Purpose |
|-------|-----------|---------|
| Command | `/spec_kit:deep-research` | User-facing entry point with YAML workflow |
| Workflow | YAML loop engine | Init, dispatch, evaluate convergence, synthesize |
| Agent | `@deep-research` | LEAF agent executing single research iterations |

```
/spec_kit:deep-research --> YAML workflow --> @deep-research agent (LEAF)
                      |                      |
                      |                      +-- Read state
                      |                      +-- Research (3-5 actions)
                      |                      +-- Write findings
                      |                      +-- Update state
                      |
                      +-- Loop until convergence
                      +-- Synthesize final research.md
                      +-- Save memory context
```

## State Files

| File | Format | Purpose |
|------|--------|---------|
| `deep-research-config.json` | JSON | Loop parameters (max iterations, thresholds) |
| `deep-research-state.jsonl` | JSONL | Append-only iteration log |
| `deep-research-strategy.md` | Markdown | What worked/failed, next focus |
| `iteration-NNN.md` | Markdown | Per-iteration detailed findings |
| `research.md` | Markdown | Progressive synthesis output |

## When to Use

| Scenario | Use Deep Research | Use /spec_kit:research |
|----------|-----------------|----------------------|
| Unknown topic, need depth | Yes | No |
| 3+ domains to cover | Yes | No |
| Simple known question | No | Yes |
| Quick codebase survey | No | Yes (or @context) |
| Overnight unattended research | Yes | No |

## Design Origins

Adapted from 4 deep research repositories:
- **karpathy/autoresearch**: Core autonomous loop concept
- **AGR (Artificial General Research)**: Fresh context per iteration, strategy file, stuck detection
- **pi-autoresearch**: JSONL state persistence, quality gates
- **autoresearch-opencode**: Context injection, pause/resume

## Related

| Resource | Path |
|----------|------|
| Agent definition | `.claude/agents/deep-research.md` |
| Command definition | `.opencode/command/deep-research/deep-research.md` |
| YAML workflows | `.opencode/command/deep-research/assets/` |
| Research (design doc) | `.opencode/specs/05--agent-orchestration/028-auto-deep-research/research.md` |
| Spec folder | `.opencode/specs/05--agent-orchestration/028-auto-deep-research/` |
