---
title: "Improve Commands"
description: "Slash commands for evaluating, improving, and optimizing AI agents and prompts with structured workflows, deterministic scoring, and quality gates."
trigger_phrases:
  - "improve command"
  - "improve agent"
  - "improve prompt"
  - "agent improvement"
  - "prompt improvement"
  - "5-dimension scoring"
  - "agent evaluation"
---

# Improve Commands

> Slash commands for evaluating and improving AI agents and prompts with structured workflows, deterministic scoring, and quality gates.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. COMMANDS](#2--commands)
- [3. STRUCTURE](#3--structure)
- [4. WORKFLOW PROGRESSION](#4--workflow-progression)
- [5. EXECUTION MODES](#5--execution-modes)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. FAQ](#7--faq)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `improve` command group evaluates and improves AI agents and prompts. Each command follows a structured workflow with Phase 0 verification, a consolidated setup prompt, and step-by-step execution.

- `/improve:agent` runs an evaluator-first loop that scores agents across 5 integration-aware dimensions, generates improvement candidates, and tracks progress with dimensional dashboards.
- `/improve:prompt` transforms vague requests into structured, scored AI prompts using proven frameworks and DEPTH thinking methodology.

Both commands support `:auto` and `:confirm` execution modes.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **agent** | `/improve:agent <agent_path> [:auto\|:confirm] [--spec-folder=PATH] [--iterations=N]` | Evaluate and improve any agent across 5 dimensions (structural, ruleCoherence, integration, outputQuality, systemFitness) with proposal-first candidates and guarded promotion |
| **prompt** | `/improve:prompt <prompt_or_topic> [$mode] [:auto\|:confirm]` | Create or improve AI prompts using 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH thinking, and CLEAR scoring |

### Command Dependencies

| Command | Requires |
|---------|----------|
| `agent` | Target agent file in `.opencode/agent/*.md`, spec folder for runtime |
| `prompt` | Prompt text or topic description |

### Skills Used

| Command | Skill | Purpose |
|---------|-------|---------|
| `agent` | `sk-improve-agent` | Integration scanning, dynamic profiling, 5D scoring, benchmarks, promotion |
| `prompt` | `sk-improve-prompt` | Framework selection, DEPTH rounds, CLEAR scoring |

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```text
improve/
+-- README.txt                              # This file
+-- agent.md                                # /improve:agent command
+-- prompt.md                               # /improve:prompt command
+-- assets/                                 # YAML workflow definitions
    +-- improve_improve-agent_auto.yaml     # Agent improvement (autonomous)
    +-- improve_improve-agent_confirm.yaml  # Agent improvement (interactive)
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:workflow-progression -->
## 4. WORKFLOW PROGRESSION

### Agent Improvement Loop

```text
/improve:agent ".opencode/agent/handover.md" :confirm
    |
    v
Phase 0: @general agent verification
    |
    v
Setup: consolidated prompt (target, spec folder, mode, scoring)
    |
    v
Init: scan integration surfaces, generate profile, create runtime
    |
    v
Loop (per iteration):
    scan -> propose candidate -> score (5D) -> benchmark -> reduce -> decide
    |
    v
Synthesis: final dashboard, recommendation (continue / promote / stop)
```

### Prompt Improvement Pipeline

```text
/improve:prompt "Write a code review prompt" :auto
    |
    v
Phase 0: @general agent verification
    |
    v
Setup: consolidated prompt (text, mode, save location, execution)
    |
    v
DEPTH pipeline: Discover -> Engineer -> Prototype -> Test -> Harmonize
    |
    v
CLEAR scoring: Correctness, Logic, Expression, Arrangement, Reusability
    |
    v
Delivery: enhanced prompt + transparency report + optional save
```

### Agent Delegation

| Command | Delegates To |
|---------|-------------|
| agent | @improve-agent (proposal-only candidate generation) |
| prompt | Inline @general workflow (no sub-agent dispatch) |

<!-- /ANCHOR:workflow-progression -->

---

<!-- ANCHOR:execution-modes -->
## 5. EXECUTION MODES

| Mode | Suffix | Behavior |
|------|--------|----------|
| **Auto** | `:auto` | Execute all steps without approval prompts |
| **Confirm** | `:confirm` | Pause at each step and wait for user approval |

Each mode maps to a YAML workflow file in `assets/`:
- Auto: `improve_improve-agent_auto.yaml`
- Confirm: `improve_improve-agent_confirm.yaml`

`/improve:prompt` is an inline command that does not load YAML assets.

### Agent Improvement Scoring Modes

| Mode | Flag | Profiles | Promotion |
|------|------|----------|-----------|
| **Dynamic** | `--dynamic` | Any agent (generated on-the-fly) | Assessment only |
| **Static** | `--profile=ID` | handover | handover is promotion-eligible |

<!-- /ANCHOR:execution-modes -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

```bash
# Evaluate handover agent with interactive approval
/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder=specs/041/008

# Evaluate any agent autonomously with 3 iterations
/improve:agent ".opencode/agent/debug.md" :auto --iterations=3

# Quick integration health check (1 iteration)
/improve:agent ".opencode/agent/review.md" :auto --iterations=1

# Improve a prompt with auto-detection
/improve:prompt "Write a blog post about AI" :auto

# Improve a prompt with specific framework
/improve:prompt $improve "Help users understand our API auth flow" :confirm

# Quick prompt refinement
/improve:prompt $short "Generate test data for user registration"
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:faq -->
## 7. FAQ

**Q: Can I evaluate any agent, not just handover?**

Yes. `/improve:agent` supports dynamic profiling via `generate-profile.cjs`, which derives scoring rules from any agent's own ALWAYS/NEVER/ESCALATE IF sections. Any file in `.opencode/agent/*.md` is a valid target.

**Q: What are the 5 scoring dimensions?**

Structural Integrity (0.20), Rule Coherence (0.25), Integration Consistency (0.25), Output Quality (0.15), System Fitness (0.15). All checks are deterministic.

**Q: When does the improvement loop stop?**

When max iterations is reached, all 5 dimensions plateau (3+ identical scores), infra failures exceed threshold, or the reducer signals shouldStop.

**Q: What is the difference between `/improve:prompt` and `/improve:agent`?**

`/improve:prompt` enhances text prompts using frameworks and DEPTH methodology. `/improve:agent` evaluates and improves agent definition files across their full integration surface.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| Phase 0 fails | @general agent not available | Restart with the correct command invocation |
| Dynamic scorer returns 0 | Profile generation failed | Run `generate-profile.cjs` directly and check for parse errors |
| Integration dimension low | Mirrors diverged or missing | Run `scan-integration.cjs`, sync mirrors, rescore |
| All dimensions plateaued | Loop exhausted current hypothesis | Update `improvement_strategy.md` and restart |
| YAML workflow not found | Missing asset file | Verify `assets/` contains the matching YAML |
| CLEAR score below threshold | Prompt quality insufficient | Iterate with a different framework or mode |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.md) | Overview of all command groups |
| [sk-improve-agent SKILL.md](../../skill/sk-improve-agent/SKILL.md) | Agent improvement skill with 5D evaluation |
| [sk-improve-prompt SKILL.md](../../skill/sk-improve-prompt/SKILL.md) | Prompt improvement skill with DEPTH/CLEAR |
| [Spec Kit Commands](../spec_kit/README.txt) | Spec folder lifecycle commands |
| [Create Commands](../create/README.txt) | Component scaffolding commands |

<!-- /ANCHOR:related-documents -->
