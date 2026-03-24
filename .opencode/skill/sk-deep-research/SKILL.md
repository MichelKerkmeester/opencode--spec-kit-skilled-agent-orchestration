---
name: sk-deep-research
description: "Autonomous deep research and review loop protocol with iterative investigation or code quality auditing, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic|target] [:auto|:confirm|:review|:review:auto|:review:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.2.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- ChatGPT runtime: `.opencode/agent/chatgpt/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

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

- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Review Mode Triggers

Use the review mode variant when:
- "review code quality" or "audit this code"
- "audit spec folder" or "validate spec completeness"
- "release readiness check" or "pre-release review"
- "find misalignments" between spec and implementation
- "verify cross-references" across documentation and code

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`, `review code quality`, `audit spec folder`, `release readiness check`, `find misalignments`, `verify cross-references`

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
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
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
    "LOOP_SETUP": ["references/loop_protocol.md", "references/state_format.md", "assets/deep_research_config.json"],
    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
    "CONVERGENCE": ["references/convergence.md"],
    "STATE": ["references/state_format.md", "assets/deep_research_strategy.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active

def discover_markdown_resources(base_path: Path) -> list[str]:
    """Discover all .md files in the assets directory."""
    return sorted(str(p.relative_to(base_path)) for p in (base_path / "references").glob("*.md"))
```

### Phase Detection

Detect the current research phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists | Loop protocol, state format |
| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Quick reference |

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
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (final output)     │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-research (LEAF agent)  │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE research cycle  │
    │  - Writes: findings + state      │
    │  - Tools: WebFetch, Grep, etc.  │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-research-config.json       │  Persists across iterations
    │  deep-research-state.jsonl      │
    │  deep-research-strategy.md      │
    │  scratch/iteration-NNN.md       │
    │  research.md (workflow-owned     │
    │  progressive synthesis)         │
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
Save --> generate-context.js --> verify memory artifact
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | "Persistent brain" recording what worked, failed, and where to look next |
| **JSONL log** | Append-only structured log for machine-parseable iteration data |
| **Progressive synthesis** | `progressiveSynthesis` defaults to `true`; the agent may update `research.md` incrementally, and the orchestrator always performs the final consolidation pass |

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
9. **Treat research.md as workflow-owned** -- Iteration findings feed synthesis; the workflow owns the canonical `research.md`
10. **Document ruled-out directions per iteration** -- Every iteration must include what was tried and failed
11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
12. **Quality guards must pass before convergence** -- Research mode: source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger. Review mode: evidence completeness, scope alignment, no inference-only, severity coverage, and cross-reference checks must pass (see convergence.md Section 10.4)
13. **Review target files are read-only** -- Never modify code under review; review mode is observation-only
14. **Run adversarial self-check on P0 findings before recording** -- Re-read cited code to confirm P0 severity is genuine
15. **Report severity counts (P0/P1/P2) in every review iteration JSONL record** -- `findingsSummary` and `findingsNew` are required fields

### NEVER

1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
2. **Hold findings in context** -- Write everything to files
3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
4. **Ask the user** -- Autonomous execution; make best-judgment decisions
5. **Skip convergence checks** -- Every iteration must be evaluated
6. **Modify config after init** -- Config is read-only after initialization
7. **Overwrite prior findings** -- Append to research.md, never replace

### Iteration Status Enum

`complete | timeout | error | stuck | insight | thought`

- `insight`: Low newInfoRatio but important conceptual breakthrough
- `thought`: Analytical-only iteration, no evidence gathering

### EXPERIMENTAL / REFERENCE-ONLY FEATURES

These concepts remain documented for future design work, but they are not part of the live executable contract for `/spec_kit:deep-research`:
1. **Wave orchestration** -- parallel question fan-out, pruning, and breakthrough logic
2. **Checkpoint commits** -- per-iteration git commits
3. **Segment transitions / `:restart`** -- multi-segment session partitioning
4. **Alternate CLI dispatch** -- process-isolated `claude -p` or similar dispatch modes

### ESCALATE IF

1. **3+ consecutive timeouts** -- Infrastructure issue, not research problem
2. **State file corruption unrecoverable** -- Cannot reconstruct from JSONL or iteration files
3. **All approaches exhausted with questions remaining** -- Research may need human guidance
4. **Security concern in findings** -- Proprietary code or credentials discovered
5. **All recovery tiers exhausted** -- No automatic recovery path remaining

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core Documentation

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [loop_protocol.md](references/loop_protocol.md) | Loop lifecycle (4 phases) | Init, iterate, synthesize, save |
| [state_format.md](references/state_format.md) | State file schemas | JSONL + strategy.md + config.json |
| [convergence.md](references/convergence.md) | Stop condition algorithms | shouldContinue(), stuck recovery |
| [quick_reference.md](references/quick_reference.md) | One-page cheat sheet | Commands, tuning, troubleshooting |

### Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [deep_research_config.json](assets/deep_research_config.json) | Loop configuration | Copied to scratch/ during init |
| [deep_research_strategy.md](assets/deep_research_strategy.md) | Strategy file | Copied to scratch/ during init |
| [deep_research_dashboard.md](assets/deep_research_dashboard.md) | Dashboard template | Auto-generated each iteration |
| [deep_review_strategy.md](assets/deep_review_strategy.md) | Review strategy file | Copied to scratch/ during review init |
| [deep_review_dashboard.md](assets/deep_review_dashboard.md) | Review dashboard template | Auto-generated each review iteration |

### Review Mode Resources

| Resource | Purpose |
|----------|---------|
| `@deep-review` agent | Single review iteration executor (LEAF) |
| Review auto YAML | `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` |
| Review confirm YAML | `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` |

Agent runtime paths:
- OpenCode/Copilot: `.opencode/agent/deep-review.md`
- ChatGPT: `.opencode/agent/chatgpt/deep-review.md`
- Claude: `.claude/agents/deep-review.md`
- Codex: `.codex/agents/deep-review.toml`

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
| **Quality guards** | Source diversity (>=2), focus alignment, no single-weak-source | Yes |
| **Memory save** | memory/*.md created via generate-context.js | No |

### Convergence Report

Every completed loop produces a convergence report:
- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
- Total iterations completed
- Questions answered ratio
- Average newInfoRatio trend

### Review Mode Success Criteria

| Criteria | Requirement |
|----------|-------------|
| Dimension coverage | All configured review dimensions reviewed with evidence |
| Finding citations | P0/P1 findings include `file:line` citations |
| Report completeness | `review-report.md` has all 9 sections |
| Verdict justification | Release readiness verdict (PASS/CONDITIONAL/FAIL) is justified with findings; PASS includes hasAdvisories metadata when P2 findings exist |
| Adversarial recheck | P0 findings confirmed via adversarial self-check before final report |

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
  # No additional indexing step is part of the live workflow contract.
```

### Command Integration

| Command | Relationship |
|---------|-------------|
| `/spec_kit:deep-research` | Primary invocation point |
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
5. Iteration 7: Convergence detected after recent newInfoRatio values stay below the configured threshold
6. Synthesis produces 17-section research.md
7. Memory saved via generate-context.js

**Narrow Research with Early Convergence**:
1. `/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?"`
2. Init creates config with 2 key questions
3. Iteration 1: Finds definitive answer from official specs
4. All questions answered after iteration 1
5. Loop stops cleanly, research.md produced

**Stuck Recovery Example**:
1. Iterations 4-6 all have newInfoRatio below the configured threshold
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

### Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:deep-research` | Full loop workflow |
| `/memory:save` | Manual context preservation |

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)
<!-- /ANCHOR:related-resources -->
