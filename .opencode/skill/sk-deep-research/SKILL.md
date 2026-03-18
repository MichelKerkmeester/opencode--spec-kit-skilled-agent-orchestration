---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Deep investigation requiring multiple rounds of discovery
- Topic spans 3+ technical domains or sources
- Initial findings need progressive refinement
- Overnight or unattended research sessions
- Research where prior findings inform subsequent queries

### When NOT to Use

- Simple, single-question research (use `/spec_kit:research`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
| ON_DEMAND | Only on explicit request | Templates, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "templates")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research"]},
    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle"]},
    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
}

NOISY_SYNONYMS = {
    "LOOP_SETUP": {"run research": 2.0, "investigate deeply": 1.8, "overnight research": 1.5},
    "ITERATION": {"another pass": 1.5, "keep searching": 1.4, "dig deeper": 1.6},
    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
}

RESOURCE_MAP = {
    "LOOP_SETUP": ["references/loop-protocol.md", "references/state-format.md", "templates/deep-research-config.json"],
    "ITERATION": ["references/loop-protocol.md", "references/convergence.md"],
    "CONVERGENCE": ["references/convergence.md"],
    "STATE": ["references/state-format.md", "templates/deep-research-strategy.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND": ["references/loop-protocol.md", "references/state-format.md", "references/convergence.md"],
}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-research "topic"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-research command│  Layer 1: Command
    │  (YAML workflow + loop config)  │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)      │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (final output)    │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-research (LEAF agent)   │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE research cycle  │
    │  - Writes: findings + state     │
    │  - Tools: WebFetch, Grep, etc.  │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-research-config.json       │  Persists across iterations
    │  deep-research-state.jsonl       │
    │  deep-research-strategy.md       │
    │  scratch/iteration-NNN.md       │
    │  research.md (progressive)      │
    └─────────────────────────────────┘
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.

Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-research
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Determine focus
  |                                         3. Research (3-5 actions)
  |                                         4. Write iteration-NNN.md
  |                                         5. Update strategy.md
  |                                         6. Append state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile final research.md
  |
Save --> generate-context.js --> memory_index_scan
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | "Persistent brain" recording what worked, failed, and where to look next |
| **JSONL log** | Append-only structured log for machine-parseable iteration data |
| **Progressive synthesis** | research.md updated each iteration, not just at the end |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. **Read state first** -- Agent must read JSONL and strategy.md before any research action
2. **One focus per iteration** -- Pick ONE research sub-topic from strategy.md "Next Focus"
3. **Externalize findings** -- Write to iteration-NNN.md, not held in agent context
4. **Update strategy** -- Append to "What Worked"/"What Failed", update "Next Focus"
5. **Report newInfoRatio** -- Every iteration JSONL record must include newInfoRatio
6. **Respect exhausted approaches** -- Never retry approaches in the "Exhausted" list
7. **Cite sources** -- Every finding must cite `[SOURCE: url]` or `[SOURCE: file:line]`
8. **Use generate-context.js for memory saves** -- Never manually create memory files

### NEVER

1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
2. **Hold findings in context** -- Write everything to files
3. **Exceed TCB** -- Target 6-8 tool calls per iteration (max 12 with Self-Governance Footer)
4. **Ask the user** -- Autonomous execution; make best-judgment decisions
5. **Skip convergence checks** -- Every iteration must be evaluated
6. **Modify config after init** -- Config is read-only after initialization
7. **Overwrite prior findings** -- Append to research.md, never replace

### WAVE ORCHESTRATION RULES

When using parallel wave execution (see loop-protocol.md Section 3a):
1. **Score every wave iteration** -- Rank by newInfoRatio before dispatching follow-ups
2. **Prune below median** -- Questions scoring below wave median are deprioritized to ideas backlog
3. **Never prune breakthroughs** -- Any iteration with newInfoRatio > 2x wave average is protected
4. **Generate adjacent questions** -- Breakthrough iterations spawn 2-3 follow-up questions
5. **Transition to sequential** -- When questions narrow to 1-2, switch from wave to sequential mode
6. **Wave convergence** -- Standard composite convergence applies across all wave iterations

### ESCALATE IF

1. **3+ consecutive timeouts** -- Infrastructure issue, not research problem
2. **State file corruption unrecoverable** -- Cannot reconstruct from JSONL or iteration files
3. **All approaches exhausted with questions remaining** -- Research may need human guidance
4. **Security concern in findings** -- Proprietary code or credentials discovered
5. **All 5 error recovery tiers exhausted** -- No automatic recovery path remaining

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core Documentation

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [loop-protocol.md](references/loop-protocol.md) | Loop lifecycle (4 phases) | Init, iterate, synthesize, save |
| [state-format.md](references/state-format.md) | State file schemas | JSONL + strategy.md + config.json |
| [convergence.md](references/convergence.md) | Stop condition algorithms | shouldContinue(), stuck recovery |
| [quick_reference.md](references/quick_reference.md) | One-page cheat sheet | Commands, tuning, troubleshooting |

### Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [deep-research-config.json](templates/deep-research-config.json) | Loop configuration | Copied to scratch/ during init |
| [deep-research-strategy.md](templates/deep-research-strategy.md) | Strategy file | Copied to scratch/ during init |

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Loop Completion
- Research loop ran to convergence or max iterations
- All state files present and consistent (config, JSONL, strategy)
- research.md produced with findings from all iterations
- Memory context saved via generate-context.js

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-loop** | Config valid, strategy initialized, state log created | Yes |
| **Per-iteration** | iteration-NNN.md written, JSONL appended, strategy updated | Yes |
| **Post-loop** | research.md exists with content, convergence report generated | Yes |
| **Memory save** | memory/*.md created via generate-context.js | No |

### Convergence Report

Every completed loop produces a convergence report:
- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
- Total iterations completed
- Questions answered ratio
- Average newInfoRatio trend

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in CLAUDE.md.

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: autoresearch, deep research)
- **Gate 3**: File modifications require spec folder question per CLAUDE.md Gate 3
- **Memory**: Context preserved via Spec Kit Memory MCP (generate-context.js)
- **Orchestrator**: @orchestrate dispatches @deep-research as LEAF agent

### Memory Integration

```
Before research:
  memory_context({ input: topic, mode: "deep", intent: "understand" })
  --> Loads prior research into strategy.md "Known Context"

During research (each iteration):
  Agent writes scratch/iteration-NNN.md
  Agent updates scratch/deep-research-strategy.md
  Agent appends scratch/deep-research-state.jsonl

After research:
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]
  memory_index_scan({ specFolder: "028-auto-deep-research" })
```

### Command Integration

| Command | Relationship |
|---------|-------------|
| `/spec_kit:deep-research` | Primary invocation point |
| `/spec_kit:research` | Single-pass alternative (not iterative) |
| `/spec_kit:plan` | Next step after deep research completes |
| `/memory:save` | Manual memory save (deep research auto-saves) |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Worked Examples

**Deep Research on Unknown Topic**:
1. `/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"`
2. Init creates config, strategy with 5 key questions
3. Iterations 1-3: Broad survey, official docs, codebase patterns
4. Iterations 4-6: Deep dive into specific strategies, edge cases
5. Iteration 7: Convergence detected (avg newInfoRatio < 0.05)
6. Synthesis produces 17-section research.md
7. Memory saved via generate-context.js

**Narrow Research with Early Convergence**:
1. `/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?"`
2. Init creates config with 2 key questions
3. Iteration 1: Finds definitive answer from official specs
4. All questions answered after iteration 1
5. Loop stops cleanly, research.md produced

**Stuck Recovery Example**:
1. Iterations 4-6 all have newInfoRatio < 0.05
2. Stuck recovery triggers at iteration 7
3. Recovery widens focus to least-explored question
4. Iteration 7 finds new angle, newInfoRatio jumps to 0.4
5. Loop continues productively

### Design Origins

| Innovation | Source | Our Adaptation |
|------------|--------|----------------|
| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch = fresh context |
| STRATEGY.md persistent brain | AGR | deep-research-strategy.md |
| JSONL state | pi-autoresearch | deep-research-state.jsonl |
| Stuck detection | AGR | 3-consecutive-no-progress recovery |
| Context injection | autoresearch-opencode | Strategy file as agent context |

### Agents

| Agent | Purpose |
|-------|---------|
| `@deep-research` | Single iteration executor (LEAF) |
| `@orchestrate` | Loop coordination (when dispatched externally) |
| `@research` | Single-pass research (alternative) |

### Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:deep-research` | Full loop workflow |
| `/spec_kit:research` | Single-pass research |
| `/memory:save` | Manual context preservation |

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)
<!-- /ANCHOR:related-resources -->
