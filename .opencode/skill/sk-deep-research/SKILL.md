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
- Manage iteration state outside the resolved local research packet under `{spec_folder}/research/`

**ALWAYS:**
- Invoke via `/spec_kit:deep-research:auto` or `/spec_kit:deep-research:confirm`
- Let the command's YAML workflow own dispatch (auto: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`)
- Let `scripts/reduce-state.cjs` be the SINGLE state writer
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'research')` from `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical research root

### Executor Selection Contract

The YAML workflow owns executor selection. Native `@deep-research` is the default path; CLI executors are routed through the workflow, not through ad hoc shell loops.

Cross-CLI delegation is possible inside each executor sandbox but discouraged. Do not invoke the same CLI from within itself, and do not assume auth from a parent executor propagates to child CLIs.

**Invariants** the executor MUST satisfy regardless of route:

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

**JSONL audit field**: Non-native executor runs append executor metadata (`model`, effort, tier) to the iteration's JSONL record via `executor-audit.ts`. Native runs are recoverable from YAML alone.

**Template**: The executor-agnostic iteration prompt lives at `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`. It is rendered by `prompt-pack.ts` before dispatch and either (a) injected as the agent's context (native) or (b) piped to `codex exec` stdin (cli-codex).

**Config surface**: Defined in `assets/deep_research_config.json` under the `executor` key. Schema is in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. CLI flag precedence is: `--executor/--model/--reasoning-effort/--service-tier/--executor-timeout > config file > schema default`.

**What NEVER changes regardless of executor route**:

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

## 2. SMART ROUTING


### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
| ON_DEMAND | Only on explicit request | Templates, detailed specifications |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - setup, iteration, convergence, and state intents route loop resources.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` asks for loop/setup/state disambiguation and missing intent routes return a "no knowledge base" notice.

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

### Scoped Guard and Loading

```python
UNKNOWN_FALLBACK = ["Confirm setup vs iteration vs convergence vs state recovery", "Confirm spec folder and research packet"]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def load_if_available(relative_path: str) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        seen.add(guarded)
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

## 3. HOW IT WORKS

### Resource Map Integration

When `{spec_folder}/resource-map.md` exists at init, deep research promotes it from ad hoc context to canonical packet state.

- Persist `resource_map_present: true` in `deep-research-config.json`.
- Read the map once during init and summarize it into `deep-research-strategy.md` `Known Context`.
- The snapshot MUST include per-section entry counts across `READMEs`, `Documents`, `Commands`, `Agents`, `Skills`, `Specs`, `Scripts`, `Tests`, `Config`, and `Meta`.
- The snapshot MUST also include a one-line theme summary for each resource-map section so later iterations inherit the map's structure without rereading the entire file.
- Per-iteration prompts surface `resource-map.md` as the exclusion set for previously inventoried files.
- Treat files already listed on the map as known inventory, not as net-new discoveries.
- Only flag files as gaps when they look relevant to the active investigation and are missing from the map.
- Final synthesis cites `{spec_folder}/resource-map.md` in `research.md` References when the map was present at init.
- Convergence also emits `{artifact_dir}/resource-map.md` from research delta evidence unless the operator passes `--no-resource-map`.

When `{spec_folder}/resource-map.md` is absent at init:

- Persist `resource_map_present: false`.
- Write `resource-map.md not present; skipping coverage gate` into `Known Context`.
- Omit the exclusion-set hint from iteration guidance.
- Continue the loop normally; absence is informational, not a failure.

### Architecture: 3-Layer Integration

`/spec_kit:deep-research` owns the YAML workflow, which initializes state, dispatches one LEAF iteration at a time, evaluates convergence, synthesizes `research/research.md`, and saves continuity. The `@deep-research` agent executes only one research cycle per dispatch.

### State Packet Location

The research state packet always lives under the target spec's local `research/` folder. Root-spec targets use `{spec_folder}/research/` directly. Child-phase and sub-phase targets use **flat-first**: a first run with an empty `research/` directory writes flat at `{spec_folder}/research/`. A `pt-NN` subfolder (`{basename(spec_folder)}-pt-{NN}`) is allocated only when prior content already exists in `research/` for a non-matching target (continuation runs reuse the existing flat artifact or matching `pt-NN` packet). This avoids the unnecessary `pt-01` wrapper on first runs.

Example (first run on a child phase): `.../026-graph.../019-system-hardening/001-initial-research/004-desc-regen/` → `004-desc-regen/research/` (flat, no subfolder).

Example (subsequent run with prior content for a different target): `004-desc-regen/research/004-desc-regen-pt-02/` (pt-NN allocated as a sibling to the prior content).

State files include `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, `.deep-research-pause`, `.deep-research.lock`, `resource-map.md`, `research.md`, and `iterations/iteration-NNN.md`.

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.

Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).

### Data Flow

Init creates config, strategy, and state logs. Each loop reads state, checks convergence, dispatches `@deep-research`, writes iteration markdown and JSONL deltas, refreshes reducer-owned state, and either continues or synthesizes and saves continuity.

Late-INIT can also anchor the research run to `spec.md`: the workflow acquires the advisory lock, classifies `folder_state`, seeds or appends bounded context before LOOP, and then syncs one generated findings block back into `spec.md` during SYNTHESIS while keeping `research/research.md` canonical.

That contract is exact:
- `folder_state` is always one of `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`
- the advisory lock lives at `research/.deep-research.lock` from late INIT through save, skip-save, or cancel cleanup
- post-synthesis write-back replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` fence under the chosen host anchor
- the full bounded mutation rules live in [spec_check_protocol.md](references/spec_check_protocol.md)

### Key Concepts

Research continuity is externalized to files, each iteration starts fresh, convergence uses newInfoRatio/stuck/question signals, strategy and registry are reducer-owned, JSONL remains append-only, and final synthesis consolidates `research/research.md`.

---

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

## 5. REFERENCES

Core documentation: `references/loop_protocol.md`, `references/spec_check_protocol.md`, `references/state_format.md`, `references/convergence.md`, and `references/quick_reference.md`.

Templates: `assets/deep_research_config.json`, `assets/deep_research_strategy.md`, and `assets/deep_research_dashboard.md`.

---

## 6. SUCCESS CRITERIA

### Loop Completion
- Research loop ran to convergence or max iterations
- All state files present and consistent (config, JSONL, strategy)
- research/resource-map.md produced from converged deltas unless `config.resource_map.emit == false` (operator flag: `--no-resource-map`)
- research/research.md produced with findings from all iterations
- Canonical continuity surfaces updated via generate-context.js

### Quality Gates

Blocking gates: valid config/strategy/state before loop, iteration markdown plus JSONL plus reducer refresh per iteration, final `research/research.md` and convergence report after loop, and quality guards for source diversity/focus/no weak single source. Continuity save is expected but non-blocking.

### Convergence Report

Every completed loop produces a convergence report:
- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
- Total iterations completed
- Questions answered ratio
- Average newInfoRatio trend

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md, AGENTS.md, CODEX.md, or GEMINI.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: autoresearch, deep research)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3
- **Continuity**: `/spec_kit:resume` is the operator-facing recovery surface; canonical packet continuity is written via `generate-context.js`
- **Orchestrator**: @orchestrate dispatches @deep-research as LEAF agent

### Continuity Integration

Before research, recover context with `/spec_kit:resume` using `handover.md -> _memory.continuity -> spec docs`. During each iteration, write `iterations/iteration-NNN.md`, append JSONL, and let the reducer refresh strategy/registry/dashboard. After research, save continuity through `generate-context.js`.

### Command Integration

| Command | Relationship |
|---------|-------------|
| `/spec_kit:deep-research` | Primary invocation point |
| `/spec_kit:resume` | Canonical recovery surface before resuming or extending an active packet |
| `/spec_kit:plan` | Next step after deep research completes |
| `/memory:save` | Manual memory save (deep research auto-saves) |

---

## 8. RELATED RESOURCES

### Worked Examples and Commands

Use `/spec_kit:deep-research:auto "<topic>"` for broad or narrow research; convergence may stop early when questions are answered or trigger stuck recovery when novelty stays low. Related commands are `/spec_kit:plan --intake-only`, `/spec_kit:deep-research`, and `/memory:save`; `@deep-research` remains a single-iteration LEAF executor.

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)

For code review capabilities, see `sk-deep-review`.
