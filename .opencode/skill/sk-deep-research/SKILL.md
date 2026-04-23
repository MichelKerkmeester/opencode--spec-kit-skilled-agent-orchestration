---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.6.2.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`
- Gemini runtime: `.gemini/agents/*.md`

Operator contract precedence for this skill surface:
- Command entrypoint syntax in `.opencode/command/spec_kit/deep-research.md`
- Convergence math in `references/convergence.md` and the deep-research YAML workflow
- Runtime agent inventories from the checked-in runtime directories above

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

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/spec_kit:deep-research` command. The command's YAML workflow owns state, dispatch, and convergence.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize iterations
- Invoke cli-copilot / cli-codex / cli-gemini / cli-claude-code directly in a loop to simulate iterations
- Manually write iteration prompts to `/tmp` and dispatch them via `copilot -p`
- Dispatch the `@deep-research` LEAF agent via the Task tool for iteration loops (the agent is LEAF — a single iteration — and MUST be driven by the command's workflow)
- Skip the state machine: `deep-research-state.jsonl`, `deep-research-config.json`, `deltas/`, `prompts/`, `logs/`
- Manage iteration state outside `{spec_folder}/research/` or `{spec_tree_root}/research/{phaseSlug}-pt-{NN}/`

**ALWAYS:**
- Invoke via `/spec_kit:deep-research:auto` or `/spec_kit:deep-research:confirm`
- Let the command's YAML workflow own dispatch (auto: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`)
- Let `scripts/reduce-state.cjs` be the SINGLE state writer
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'research')` from `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical research root

### Executor Selection Contract

The YAML workflow supports executor selection via `config.executor.kind`. Current shipped kinds:

| Kind | Dispatch | Required fields | Status |
|------|----------|----------------|--------|
| `native` | `@deep-research` agent via Task tool, `model: opus` | none (default) | Shipped. Default. |
| `cli-codex` | `codex exec` via stdin-piped rendered prompt | `model` (e.g. gpt-5.4) | Shipped (spec 018). |
| `cli-copilot` | Reserved | — | Shipped (spec 019). |
| `cli-gemini` | Reserved | — | Shipped (spec 019). |
| `cli-claude-code` | Reserved | — | Shipped (spec 019). |

#### Cross-CLI Delegation

Each CLI executor operates inside its own sandbox / permissions layer (codex `workspace-write`, copilot `allow-all-tools`, gemini `-y -s none`, claude-code `acceptEdits`). Within that sandbox, a running iteration CAN, in theory, shell out to other CLIs.

**What is possible**:
- A `cli-codex` iteration can invoke `gemini "..."`, `copilot -p ...`, or `claude -p ...` via its shell.
- A `cli-gemini` iteration can invoke `codex exec ...`, `copilot -p ...`, or `claude -p ...`.
- A `cli-copilot` iteration can invoke other CLIs through its tool-execution layer.
- A `cli-claude-code` iteration (with `acceptEdits` permission mode) can invoke other CLIs via shell.

**Anti-patterns** (each CLI's own SKILL.md warns against these):
- **Self-recursion**: do NOT invoke `codex` from within a `cli-codex` iteration; do NOT invoke `copilot` from within a `cli-copilot` iteration; same for gemini and claude-code. Each CLI's orchestration skill warns that self-invocation is circular and wasteful.
- **Auth propagation assumptions**: do NOT assume the parent executor's environment has credentials for child CLIs. Each CLI uses its own authentication layer (OPENAI_API_KEY for codex, GitHub OAuth for copilot, Google credentials for gemini, Anthropic API key for claude). Auth is a user-responsibility; the deep-loop workflow does not mediate.

**Runtime enforcement**: NONE. This is documented design intent, not a code path. If a user wires a recursive invocation, the `post_dispatch_validate` step will eventually catch repeated failures through the existing `schema_mismatch` → `stuck_recovery` flow, but the workflow does not detect or block cross-CLI delegation at dispatch time.

**Invariants** the executor MUST satisfy regardless of kind:

1. Produce an iteration markdown file at `{state_paths.iteration_pattern}` (non-empty).
2. Append a JSONL delta record to `{state_paths.state_log}` with required fields: `type`, `iteration`, `newInfoRatio`, `status`, `focus`. Optional: `graphEvents`.
3. Respect the LEAF-agent constraint: no sub-dispatch, no nested loops. Max 12 tool calls per iteration.

**Failure modes**:

- Missing iteration file → `iteration_file_missing` from `post-dispatch-validate.ts`, emits `schema_mismatch` conflict event.
- Empty iteration file → `iteration_file_empty`, same downstream.
- JSONL not appended → `jsonl_not_appended`.
- JSONL missing required fields → `jsonl_missing_fields`.
- JSONL malformed → `jsonl_parse_error`.
- 3 consecutive failures → existing `stuck_recovery` event (unchanged).

**JSONL audit field**: Non-native executor runs append an `executor: {kind, model, reasoningEffort, serviceTier}` block to the iteration's JSONL record via `executor-audit.ts`. Native runs are NOT audited (the default path is recoverable from YAML alone).

**Template**: The executor-agnostic iteration prompt lives at `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`. It is rendered by `prompt-pack.ts` before dispatch and either (a) injected as the agent's context (native) or (b) piped to `codex exec` stdin (cli-codex).

**Config surface**: Defined in `assets/deep_research_config.json` under the `executor` key. Schema is in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. CLI flag precedence is: `--executor/--model/--reasoning-effort/--service-tier/--executor-timeout > config file > schema default`.

**What NEVER changes regardless of executor kind**:

- YAML owns state (`deep-research-state.jsonl`, strategy.md, registry, dashboard).
- `reduce-state.cjs` is the single state writer.
- Convergence detection, lifecycle events (new/resume/restart), and stuck_recovery all stay YAML-driven.
- The `@deep-research` LEAF agent definition is untouched — it is the native executor, not the only one.

### Code-Graph Readiness TrustState Surface

On this skill surface, the live code-graph readiness contract only reaches four TrustState values: `live`, `stale`, `absent`, and `unavailable`.

`cached`, `imported`, `rebuilt`, and `rehomed` remain declared in the shared TrustState type for compatibility and downstream schema stability, but the seven code-graph handlers and readiness helpers used here do not emit them today.

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

Runtime-supported lifecycle modes (current release):
- `new` — first run against the spec folder
- `resume` — continue the active lineage; appends a typed `resumed` JSONL event with `sessionId`, `parentSessionId`, `lineageMode`, `continuedFromRun`, `generation`, `archivedPath` (null), and `timestamp`
- `restart` — archive the existing `research/` tree under `research_archive/{timestamp}/`, mint a fresh `sessionId`, increment `generation`, and append a typed `restarted` JSONL event with the same field set plus a non-null `archivedPath`

Deferred (reserved, not runtime-supported):
- `fork` — earlier drafts described a sibling-lineage branch; the workflow no longer exposes this as an option
- `completed-continue` — earlier drafts described snapshotting the prior synthesis as immutable `synthesis-v{generation}.md`; not runtime-wired

See `references/loop_protocol.md §Lifecycle Branches` for the canonical event contract and the rationale for the retraction.

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
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference", "resume deep research", "routing-accuracy iteration", "state log", "research/iterations", "deltas", "overnight research", "active lineage"],
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
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
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
    │  findings-registry.json          │
    │  research/iterations/iteration-NNN.md │
    │  research/research.md (workflow-owned │
    │  progressive synthesis)         │
    └─────────────────────────────────┘
```

### State Packet Location

The research state packet always lives in the spec tree root's `research/` folder. Root-spec targets use `{spec_folder}/research/`. Child-phase targets resolve `{spec_tree_root}/research/{phaseSlug}-pt-{NN}/`, where `{phaseSlug}` is the FULL immediate child-phase segment under the spec tree root (e.g. "019-system-hardening") and `{NN}` is a zero-padded sequential counter scoped to that phase within the artifact root.

Example: `.../026-graph.../019-system-hardening/001-initial-research/004-desc-regen/` → `research/019-system-hardening-pt-03/`

```text
research/
  [{phaseSlug}-pt-{NN}/]            # Present only when the target spec is a nested child phase
    deep-research-config.json        # Immutable after init: loop parameters
    deep-research-state.jsonl        # Append-only research iteration log
    deep-research-strategy.md        # Reducer-synchronized investigation plan
    findings-registry.json           # Reducer-owned registry of open and resolved questions
    deep-research-dashboard.md       # Auto-generated loop dashboard
    .deep-research-pause             # Pause sentinel checked between lifecycle turns
    .deep-research.lock              # Advisory lock held from late INIT through cleanup
    research.md                      # Workflow-owned final synthesis output
    iterations/
      iteration-NNN.md               # Write-once per-iteration findings
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
Synthesize --> Compile final research/research.md
  |
Save --> generate-context.js --> verify memory artifact
```

Late-INIT can also anchor the research run to `spec.md`: the workflow acquires the advisory lock, classifies `folder_state`, seeds or appends bounded context before LOOP, and then syncs one generated findings block back into `spec.md` during SYNTHESIS while keeping `research/research.md` canonical.

That contract is exact:
- `folder_state` is always one of `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`
- the advisory lock lives at `research/.deep-research.lock` from late INIT through save, skip-save, or cancel cleanup
- post-synthesis write-back replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` fence under the chosen host anchor
- the full bounded mutation rules live in [spec_check_protocol.md](references/spec_check_protocol.md)

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
| **JSONL log** | Append-only structured log for lineage and iteration data |
| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |
| **Progressive synthesis** | `progressiveSynthesis` defaults to `true`; the agent may update `research/research.md` incrementally, and the orchestrator always performs the final consolidation pass |

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
9. **Treat research/research.md as workflow-owned** -- Iteration findings feed synthesis; the workflow owns the canonical `research/research.md`
10. **Document ruled-out directions per iteration** -- Every iteration must include what was tried and failed
11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
13. **Respect reducer ownership** -- The workflow reducer, not the agent, is the source of truth for strategy machine-owned sections, dashboard metrics, and findings registry updates
14. **Use canonical packet names only** -- Write `deep-research-*` artifacts and `research/.deep-research-pause`; legacy names are read-only migration aliases

### NEVER

1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
2. **Hold findings in context** -- Write everything to files
3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
4. **Ask the user** -- Autonomous execution; make best-judgment decisions
5. **Skip convergence checks** -- Every iteration must be evaluated
6. **Modify config after init** -- Config is read-only after initialization
7. **Overwrite prior findings** -- Append to research/research.md, never replace

### Iteration Status Enum

`complete | timeout | error | stuck | insight | thought`

- `insight`: Low newInfoRatio but important conceptual breakthrough
- `thought`: Analytical-only iteration, no evidence gathering

### EXPERIMENTAL / REFERENCE-ONLY FEATURES

These concepts remain documented for future design work, but they are not part of the live executable contract for `/spec_kit:deep-research`:
1. **Wave orchestration** -- parallel question fan-out, pruning, and breakthrough logic
2. **Checkpoint commits** -- per-iteration git commits
3. **Wave orchestration on the same lineage** -- parallel fan-out remains reference-only
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
| [spec_check_protocol.md](references/spec_check_protocol.md) | Bounded `spec.md` integration contract | Locking, folder states, pre-init branches, generated-fence write-back |
| [state_format.md](references/state_format.md) | State file schemas | JSONL + strategy.md + config.json |
| [convergence.md](references/convergence.md) | Stop condition algorithms | shouldContinue(), stuck recovery |
| [quick_reference.md](references/quick_reference.md) | One-page cheat sheet | Commands, tuning, troubleshooting |

### Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [deep_research_config.json](assets/deep_research_config.json) | Loop configuration | Copied to `research/` during research init |
| [deep_research_strategy.md](assets/deep_research_strategy.md) | Strategy file | Copied to `research/` during research init |
| [deep_research_dashboard.md](assets/deep_research_dashboard.md) | Dashboard template | Auto-generated each iteration |

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Loop Completion
- Research loop ran to convergence or max iterations
- All state files present and consistent (config, JSONL, strategy)
- research/research.md produced with findings from all iterations
- Canonical continuity surfaces updated via generate-context.js

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-loop** | Config valid, strategy initialized, state log created | Yes |
| **Per-iteration** | iteration-NNN.md written, JSONL appended, reducer refreshes strategy/dashboard/registry | Yes |
| **Post-loop** | research/research.md exists with content, convergence report generated | Yes |
| **Quality guards** | Source diversity (>=2), focus alignment, no single-weak-source | Yes |
| **Continuity save** | Canonical packet continuity surfaces updated via generate-context.js | No |

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

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md, AGENTS.md, CODEX.md, or GEMINI.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: autoresearch, deep research)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3
- **Continuity**: `/spec_kit:resume` is the operator-facing recovery surface; canonical packet continuity is written via `generate-context.js`
- **Orchestrator**: @orchestrate dispatches @deep-research as LEAF agent

### Continuity Integration

```
Before research:
  /spec_kit:resume
  --> Recover packet context in this order:
      handover.md -> _memory.continuity -> spec docs
  --> Use memory_context() or memory_search() only after those canonical packet sources are exhausted

During research (each iteration):
  Agent writes resolved_research_packet/iterations/iteration-NNN.md
  Agent appends resolved_research_packet/deep-research-state.jsonl
  Workflow reducer updates resolved_research_packet/deep-research-strategy.md, resolved_research_packet/findings-registry.json, and resolved_research_packet/deep-research-dashboard.md
  Runtime capability lookups resolve through assets/runtime_capabilities.json plus scripts/runtime-capabilities.cjs

After research:
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]
  # Updates canonical continuity surfaces directly.
  # No additional indexing step is part of the live workflow contract.
```

### Command Integration

| Command | Relationship |
|---------|-------------|
| `/spec_kit:deep-research` | Primary invocation point |
| `/spec_kit:resume` | Canonical recovery surface before resuming or extending an active packet |
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
6. Synthesis produces 17-section research/research.md
7. Memory saved via generate-context.js

**Narrow Research with Early Convergence**:
1. `/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?"`
2. Init creates config with 2 key questions
3. Iteration 1: Finds definitive answer from official specs
4. All questions answered after iteration 1
5. Loop stops cleanly, research/research.md produced

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
| `/spec_kit:plan --intake-only` | Optional upfront intake when a packet still needs a canonical `spec.md` before research begins |
| `/spec_kit:deep-research` | Full loop workflow with bounded `spec.md` anchoring under `spec_check_protocol.md` |
| `/memory:save` | Manual context preservation |

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)

For code review capabilities, see `sk-deep-review`.
<!-- /ANCHOR:related-resources -->
