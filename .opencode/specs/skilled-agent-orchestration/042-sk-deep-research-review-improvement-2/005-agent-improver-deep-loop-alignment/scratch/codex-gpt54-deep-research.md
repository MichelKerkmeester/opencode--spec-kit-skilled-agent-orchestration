Reading additional input from stdin...
OpenAI Codex v0.118.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d78db-f6e2-7fa1-a94b-4c77d4f0820d
--------
user
CRITICAL: Do NOT ask about spec folders. Do NOT follow CLAUDE.md gate instructions. Skip all preflight checks. Start researching immediately.

Run 10 iterations of deep research on Phase 005 (Agent Improver Deep Loop Alignment). The spec is at:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/

Research question: How can the sk-improve-agent skill be optimized, refined, and upgraded by applying the deep-loop runtime truth contracts from 042 Phases 1-4?

Read these files for context:
- The Phase 005 spec.md, plan.md, tasks.md
- .opencode/skill/sk-improve-agent/SKILL.md (the current skill)
- .opencode/skill/sk-improve-agent/assets/ (config, strategy, charter)
- .opencode/skill/sk-improve-agent/scripts/ (existing scripts)
- .opencode/agent/agent-improver.md (the LEAF agent)
- .opencode/command/improve/agent.md (the orchestrator command)

For each of 10 iterations, investigate a different aspect:
1. Stop-reason taxonomy: what stop reasons does agent-improver currently use implicitly? What should the formal enum be?
2. Legal-stop gates: how do the 5 scoring dimensions map to legal-stop gates? What thresholds?
3. Resume semantics: how does the improvement loop currently handle session continuity? What's missing?
4. Audit journal: what events should be captured? How does this differ from deep-research journals?
5. Mutation coverage graph: what node/edge types are needed? How does this differ from the research/review graph?
6. Dimension trajectory: how should score trajectories be tracked? What constitutes "stable"?
7. Trade-off detection: how to detect when improving one dimension regresses another?
8. Parallel candidates: when is parallel exploration valuable? What activation gates?
9. Integration surface constraints: how should integration scan results constrain mutations?
10. Scoring weight optimization: what historical data exists? How to tune weights?

For each iteration, produce concrete recommendations with file paths and code patterns.
Output a final synthesis with all recommendations organized by priority.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only research pass on Phase 005, using `sk-deep-research` for the iteration structure and a light memory pass for prior 042 context. First I’m pulling the phase docs, current `sk-improve-agent` surfaces, and any nearby guidance that already captured runtime-truth lessons from Phases 1-4.
exec
/bin/zsh -lc 'rg -n "042|agent-improver|deep-loop|deep research|runtime truth|Phase 005|Phases 1-4" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
397:- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
425:- 008-bmad-autonomous-development, 009-xethryon, phase-research-prompt.md, skip spec folder, 001-research-agentic-systems, Level 3 docs before deep research
440:- no failures observed; preserve the same gate order (Level 3 docs -> strict validate -> deep research) to avoid exploratory research before folder documentation is ready [Task 1]
877:- Ignoring malformed agent role definition, agent-improver, description metadata, .opencode/agent/<role>.md, python3.11 tomllib, rg -L '^description\\s*=\\s*\".+\"$'
879:## Task 3: Apply direct `agent-improver` metadata hotfix after explicit skip-spec-folder choice, outcome success
887:- fix malformed agent role definition of agent-improver, .codex/agents/agent-improver.toml, description key, python3.11 tomllib, direct fix option D

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.4.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
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

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

Live lifecycle branches:
- `resume` — continue the active lineage
- `restart` — start a new generation with explicit parent linkage
- `fork` — branch from the current packet state
- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting

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

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
| **JSONL log** | Append-only structured log for lineage and iteration data |
| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |

exec
/bin/zsh -lc 'find .. -name AGENTS.md -print' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2191ms:
../Barter/coder/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
../Public/.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
../Public/AGENTS.md

codex
I’ve got the deep-research protocol in view now, and I’m checking whether any deeper `AGENTS.md` files narrow the rules for the exact Phase 005 and skill paths before I read the target materials. After that I’ll map the phase docs against the current `sk-improve-agent` runtime surfaces and lock in the 10-iteration structure.
codex
The first memory pass suggests one important prior lesson: in this repo’s 042 train, the expected order was “Level 3 docs first, then strict validate, then deep research,” which matches your Phase 005 folder already existing. I’m moving into the concrete sources now: phase docs, the current skill assets/scripts, and the agent/command pair that drive the loop.
exec
/bin/zsh -lc "sed -n '390,450p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- `031-normalized-analytics-reader` closeout runbook: mark `spec.md` status `Complete`, align checklist P0/P1 totals to actual counts, refresh `description.json` timestamp/description, then run strict validation plus completion checks before closure [Task 7]
- if memory indexing flags lineage/template mismatches during closeout, remove stale rows with `memory_delete`, rerun forced `memory_index_scan` after cooldown, and verify clean reindex before final sign-off [Task 7]
- follow-on phase train now implemented as: `026/005` measurement contract -> `026/006` trust-axis contract -> `026/007` detector floor -> `026/008` graph hint nudge -> `026/009` auditable publication -> `024/032` cached-summary consumer -> `024/033` optional FTS hardening -> `024/034` workflow/token-insight split [Task 8]
- for newly created child packets, keep full Level 3 artifacts (`spec/plan/tasks/checklist/decision-record/implementation-summary/description`), remove README scaffolds, run strict validation per child, then validate parent with `--no-recursive` to confirm phase-link and parent metadata wiring [Task 8]

## Failures and how to do differently

- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
- symptom: strict validation shows `ANCHORS_VALID` warnings in `decision-record.md`; cause: extra non-template `adr-*` anchor comment lines; fix: remove only the extra comment anchors (not the ADR sections), then rerun recursive `validate.sh --strict` to confirm 0 errors/0 warnings [Task 5]
- symptom: large multi-file memory patch fails to apply cleanly; cause: generated memory snapshots drift from expected formatting; fix: use smaller per-file patches on the latest packet snapshots and revalidate after each batch [Task 5]
- symptom: closeout validation passes but memory index reports lineage mismatch/stale packet rows; cause: old memory_index entries persisted through packet updates; fix: delete stale row IDs, wait out cooldown, then force `memory_index_scan` and confirm zero failed entries before marking complete [Task 7]
- symptom: new phase packets fail strict checks with `AI_PROTOCOL`, `SECTION_COUNTS`, or `SPEC_DOC_INTEGRITY`; cause: scaffold docs left template-thin (missing AI Execution Protocol blocks, acceptance scenarios, anchors) or README placeholders were kept; fix: fill Level 3 templates immediately and delete scaffold READMEs before rerunning strict validation [Task 8]

# Task Group: Research-Agentic-Systems Phase Prompt Gating (Level 3 Before Deep Research)
scope: per-phase prompt artifacts that enforce Level 3 Spec Kit documentation before `spec_kit:deep-research` against each phase `external/` tree
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems; reuse_rule=reuse for this phase-family prompt workflow in this checkout, keeping prompt artifacts as `phase-research-prompt.md` in each phase root and research outputs in packet docs

## Task 1: Add `phase-research-prompt.md` in phases 001-007 with Level 3-before-research gates, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-04T15-43-31-Svpz-research_agentic_system_phase_prompts.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T17-43-31-019d5929-e78c-73c1-bd08-74488a2b61bd.jsonl, updated_at=2026-04-04T15:53:59+00:00, thread_id=019d5929-e78c-73c1-bd08-74488a2b61bd)

### keywords

- 999-feature-roadmap, 001-research-agentic-systems, phase-research-prompt.md, Level 3 Spec Kit docs, spec_kit:deep-research, external/

## Task 2: Replicate `phase-research-prompt.md` for phases 008/009 in phase roots and keep skip-spec-folder scope, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)

### keywords

- 008-bmad-autonomous-development, 009-xethryon, phase-research-prompt.md, skip spec folder, 001-research-agentic-systems, Level 3 docs before deep research

## User preferences

- when the user asked to “Add a prompt in each phase folder ... create level 3 speckit documentation ... utilize spec_kit:deep-research BUT need to create proper spec documentation in the folder first,” prompts should enforce: use the existing phase folder, author Level 3 docs first, then research that phase `external/` tree with evidence-backed outcomes and checklist/implementation-summary/memory updates [Task 1]
- when the user asked to “create a similar prompt ... in their root folders | skip spec folder,” place `phase-research-prompt.md` in each phase root and avoid spinning up new spec-folder scaffolding [Task 2]

## Reusable knowledge

- in this repo `specs/` is a symlink to `.opencode/specs`; phase prompt/spec work should be applied under `.opencode/specs/...` paths [Task 1]
- prompt artifact placement for this phase family is phase-root `phase-research-prompt.md` (not `scratch/`) and should reference that phase’s own `external/` tree [Task 1][Task 2]
- gate sequence that worked: validate phase docs first with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-path> --strict`, then run `spec_kit:deep-research`, then generate context/memory artifacts [Task 1][Task 2]

## Failures and how to do differently

- no failures observed; preserve the same gate order (Level 3 docs -> strict validate -> deep research) to avoid exploratory research before folder documentation is ready [Task 1]

# Task Group: Spec Packet Renames, Slug Sweeps, and Reindex Closure (Code_Environment/Public)
scope: packet/folder renames with full reference rewrites, descriptions cache refresh, memory reindex, and changelog path cleanup
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for rename-and-reindex tasks in this checkout, but keep historical branch/memory references untouched unless explicitly requested

## Task 1: Rename packet `041-sk-auto-agent-improvement` to `041-sk-recursive-agent-loop`, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T11-59-45-KehP-041_recursive_agent_loop_rename.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-59-45-019d5336-ad92-7812-9658-b4a1b290dbb9.jsonl, updated_at=2026-04-04T07:00:23+00:00, thread_id=019d5336-ad92-7812-9658-b4a1b290dbb9)

exec
/bin/zsh -lc "printf '\\n--- spec.md ---\\n'; sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md; printf '\\n--- plan.md ---\\n'; sed -n '1,260p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md; printf '\\n--- tasks.md ---\\n'; sed -n '1,260p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

--- spec.md ---
---
title: "Feature Specification: Agent-Improver Deep-Loop Alignment [005]"
description: "Transfer the proven deep-loop runtime truth contracts from 042 Phases 1-4 to the sk-improve-agent skill, adding stop-reason taxonomy, audit journaling, mutation coverage tracking, trade-off detection, optional parallel candidates, and scoring weight optimization."
trigger_phrases:
  - "005"
  - "agent improver"
  - "deep loop alignment"
  - "improvement journal"
  - "mutation coverage"
  - "trade-off detection"
  - "benchmark stability"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The sk-improve-agent skill runs bounded improvement loops over agent packets, but it currently lacks the runtime truth infrastructure proven in 042 Phases 1-4 for deep-research and deep-review. This phase ports those contracts into agent-improver: a well-formed stop-reason taxonomy, legal-stop gates, audit journaling, mutation coverage tracking, dimension trajectory analysis, trade-off detection, optional parallel candidate waves, and scoring weight optimization based on session history.

**Key Decisions**: emit journal events in the orchestrator (not in the proposal-only agent); reuse the existing coverage graph infrastructure with an improvement-specific namespace; treat dimension trajectory as a first-class convergence signal; keep parallel candidate waves opt-in behind an exploration-breadth gate.

**Critical Dependencies**: 042 Phase 1 runtime truth foundation (stop-reason taxonomy, event journal schema); 042 Phase 2 semantic coverage graph (reused with `loop_type: "improvement"`); existing sk-improve-agent 5-dimension scoring and packet-local candidate generation discipline.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-10 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Packet** | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/` |
| **Predecessor Phases** | `001-runtime-truth-foundation`, `002-semantic-coverage-graph`, `003-wave-executor`, `004-offline-loop-optimizer` |
| **Skill Target** | `.opencode/skill/sk-improve-agent/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-improve-agent skill runs bounded improvement loops that surface no reliable stop-reason, leave no audit trail, do not track which mutation dimensions have been explored, and cannot detect when one dimension improves at the cost of another. Sessions are opaque, non-resumable, and produce no data that could inform future scoring weight calibration. The 042 bundle already solved these problems for deep-research and deep-review, but agent-improver was left behind.

### Purpose

Apply the same runtime truth contracts to agent-improver so that every improvement session is auditable, resumable, convergence-aware, and self-improving over time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Stop-reason taxonomy and legal-stop gates adapted for improvement loop semantics
- Audit journal (`improvement-journal.jsonl`) capturing all session events
- Hypothesis verification ledger for mutation outcomes
- Mutation coverage graph tracking explored dimensions, tried mutations, and integration surfaces
- Dimension trajectory tracking (per-dimension score trends across iterations)
- Trade-off detector flagging when one dimension improves while another regresses
- Exhausted-mutations log to prevent redundant exploration
- Optional parallel candidate waves (2-3 strategies, opt-in via exploration-breadth gate)
- Candidate lineage graph for parallel waves
- Scoring weight optimizer using historical session data
- Benchmark replay stability measurement
- 5 new CJS scripts and 5 matching Vitest test suites
- Updates to SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, and agent.md command

### Out of Scope

- Changes to the 5-dimension scoring formula itself (weights only, not formula)
- Changes to the packet-local candidate generation model (proposal-only constraint preserved)
- Full council/synthesis layer (deep-research/review feature, not relevant here)
- New UI or dashboard surfaces (runtime data emitted to JSONL; visualization is a separate concern)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | Add stop-reason taxonomy, journal protocol, coverage graph, trajectory, trade-off, parallel wave, and weight-optimizer sections |
| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Modify | Add config fields for journal path, coverage graph path, wave activation gate, weight optimizer settings (all optional with defaults) |
| `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md` | Modify | Add mutation exhaustion guidance, trajectory-based convergence criteria, trade-off resolution guidance |
| `.opencode/skill/sk-improve-agent/assets/improvement_charter.md` | Modify | Add audit trail requirements, legal-stop gate obligations |
| `.opencode/agent/agent-improver.md` | Modify | Add journal emission protocol, legal-stop gate checks, coverage graph update calls |
| `.opencode/command/improve/agent.md` | Modify | Add resume semantics, session-id propagation, weight optimizer invocation |
| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Create | Append-only JSONL event emitter for improvement session events |
| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` | Create | Coverage graph reader/writer for explored dimensions and tried mutations |
| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Create | Cross-dimension regression detector using trajectory data |
| `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs` | Create | Lineage graph for parallel candidate waves |
| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Create | Benchmark replay stability measurement and reporting |
| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts` | Create | Tests for journal emit, append-only enforcement, event schema |
| `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts` | Create | Tests for coverage graph read/write and namespace isolation |
| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` | Create | Tests for regression detection and threshold configuration |
| `.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts` | Create | Tests for lineage graph construction and parent-child linkage |
| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` | Create | Tests for stability scoring and replay consistency |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Tier 1: Runtime Truth Alignment (from 042 Phase 1)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-001 | Stop-reason taxonomy: `converged`, `promoted`, `rolledBack`, `maxIterationsReached`, `regressionDetected`, `manualStop`, `error` | Every session termination emits exactly one stop-reason matching the taxonomy; no session ends without a logged stop-reason |
| REQ-AI-002 | Legal-stop gates using 5-dimension stability + no regression + promotion criteria | A session may not claim `converged` or `promoted` unless all gate conditions pass; violations emit `regressionDetected` or continue the loop |
| REQ-AI-003 | Resume/continuation semantics for improvement sessions | A session started with a prior session-id replays journal state and resumes from the last checkpoint without repeating completed iterations |
| REQ-AI-004 | Audit journal (`improvement-journal.jsonl`) capturing all events (iteration-started, candidate-proposed, candidate-evaluated, promotion-gate-checked, session-ended) | All five event types appear in the journal for every completed session; file is append-only and survives process restart |
| REQ-AI-005 | Hypothesis verification ledger tracking mutation outcomes (proposed, accepted, rejected with reason) | Every candidate proposal appears in the ledger with its final outcome and the scored dimensions |

### Tier 2: Improvement Intelligence (from 042 Phase 2 + unique)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-006 | Mutation coverage graph tracking explored dimensions, tried mutations, and integration surfaces using `loop_type: "improvement"` namespace | After each iteration the coverage graph is updated; querying it returns accurate explored/remaining sets per dimension |
| REQ-AI-007 | Dimension trajectory tracking (per-dimension score history across iterations) | For each active session the trajectory file contains a time-ordered score vector per dimension; minimum 3 data points before convergence can be claimed |
| REQ-AI-008 | Trade-off detection flagging when dimension A improves by >threshold while dimension B regresses by >threshold | The detector emits a `trade-off-detected` event to the journal whenever thresholds are crossed; thresholds are configurable |
| REQ-AI-009 | Exhausted-mutations log preventing redundant exploration | The coverage graph writer records exhausted mutation types per dimension; the orchestrator skips mutation types already in the exhausted log |

### Tier 3: Parallel Experimentation (from 042 Phase 3, adapted)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-010 | Optional parallel candidate waves (2-3 candidates with different strategies), activated when exploration-breadth config gate is met | Parallel waves only activate when `parallelWaves.enabled: true` and `explorationBreadthScore` exceeds `activationThreshold`; single-wave behavior is unchanged when gate is not met |
| REQ-AI-011 | Candidate lineage graph linking each candidate to its parent session, wave index, and spawning mutation | The lineage graph for any parallel-wave session can be traversed from root to leaf; each node contains session-id, wave-index, and mutation-type |

### Tier 4: Scoring Optimization (from 042 Phase 4)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-012 | Scoring weight optimizer using historical session data to recommend per-dimension weight adjustments | After a configurable number of sessions the optimizer reads the journal history and emits a weight-recommendation report; recommendations do not auto-apply without explicit approval |
| REQ-AI-013 | Benchmark replay stability measurement confirming consistent scores across identical replays | The benchmark-stability script reports a stability coefficient for each dimension; sessions with coefficient below threshold emit a `stabilityWarning` to the journal |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every improvement session termination produces a journal entry with exactly one stop-reason from the approved taxonomy.
- **SC-002**: Legal-stop gates block premature `converged` or `promoted` claims in all test scenarios.
- **SC-003**: A session resumed from a prior session-id replays correctly and does not duplicate iteration events.
- **SC-004**: The mutation coverage graph accurately reflects explored and remaining mutation space after each iteration.
- **SC-005**: Trade-off detection fires within the same iteration that the threshold crossing occurs.
- **SC-006**: Parallel candidate waves do not activate unless the exploration-breadth gate condition is satisfied.
- **SC-007**: The scoring weight optimizer produces a recommendation report after the configured session count threshold is reached.
- **SC-008**: All 5 new scripts have passing Vitest suites with zero flaky tests across 3 consecutive runs.
- **SC-009**: Backward compatibility is maintained: existing improvement sessions with no new config fields behave identically to pre-phase behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 042 Phase 1 journal schema | Journal emit contract must be compatible | Use same event schema from Phase 1; document any improvement-specific extensions |
| Dependency | 042 Phase 2 coverage graph | Coverage graph namespace and API must support `loop_type: "improvement"` | Add namespace field to existing graph writers; verify no breaking change to deep-research/review paths |
| Dependency | sk-improve-agent proposal-only constraint | Orchestrator must own journal emission; agent must not write state | ADR-001 enforces this; enforce via code review gate |
| Risk | Trajectory-based convergence false positives | Session terminates too early on noisy score data | Require minimum 3 trajectory data points before convergence claim (REQ-AI-007) |
| Risk | Parallel wave complexity overloading LLM context | Parallel waves increase context length per session | Keep parallel waves strictly opt-in; default config disables them |
| Risk | Weight optimizer recommendations applied without review | Auto-applied weight changes could degrade scoring over time | REQ-AI-012 explicitly blocks auto-apply; require explicit approval |
| Risk | Backward compatibility breakage | New config fields could change default behavior | All new config fields are optional with documented defaults (ADR-005) |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Journal append operations must complete in under 50ms per event to avoid blocking iteration cycles.
- **NFR-P02**: Coverage graph read/write must not add more than 100ms total overhead per iteration.

### Reliability

- **NFR-R01**: Journal file must be append-only and survive process restart without data loss; no in-memory-only buffering.
- **NFR-R02**: All new scripts must be idempotent: running them twice with the same input produces the same output.

### Maintainability

- **NFR-M01**: All new CJS scripts must follow the same module pattern used in 042 Phase 1-4 scripts.
- **NFR-M02**: Config fields introduced in this phase must include JSDoc comments documenting type, default, and valid range.

---

## 8. EDGE CASES

### Session Boundaries

- Session with zero completed iterations hitting `maxIterationsReached`: emit stop-reason with 0-iteration count and empty trajectory.
- Resume of a session that previously ended with `error`: replay up to the last successful checkpoint, then continue.

### Coverage Graph

- All mutation types exhausted before convergence: emit `maxIterationsReached` with exhausted-mutations annotation; do not loop indefinitely.
- Coverage graph file missing at session start: create a fresh graph; do not error.

### Trade-Off Detection

- All dimensions improving simultaneously: no trade-off event emitted; this is the ideal case.
- Threshold set to 0.0: every score change triggers trade-off detection; document this footgun in config comments.

### Parallel Waves

--- plan.md ---
---
title: "Implementation Plan: Agent-Improver Deep-Loop Alignment [005]"
description: "4-sub-phase plan porting 042 runtime truth contracts to sk-improve-agent: stop-reason taxonomy, audit journal, mutation coverage graph, trade-off detection, optional parallel candidate waves, and scoring weight optimization."
trigger_phrases:
  - "005"
  - "agent improver plan"
  - "improvement journal implementation"
  - "mutation coverage implementation"
  - "benchmark stability implementation"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CJS (scripts), TypeScript (tests), Markdown (skill/agent docs) |
| **Framework** | Vitest (tests), existing sk-improve-agent runtime |
| **Storage** | JSONL files (journal, ledger), JSON files (coverage graph, lineage, trajectory) |
| **Testing** | Vitest with 5 test suites; manual integration verification |

### Overview

This plan ports the runtime truth infrastructure proven in 042 Phases 1-4 into the sk-improve-agent skill across four sub-phases. Sub-phase 5a delivers the core runtime contracts (stop-reason taxonomy, legal-stop gates, audit journal, hypothesis ledger). Sub-phase 5b adds improvement intelligence (mutation coverage graph, dimension trajectory, trade-off detection, exhausted-mutations log). Sub-phase 5c adds optional parallel candidate waves and candidate lineage. Sub-phase 5d adds scoring weight optimization and benchmark replay stability. All new config fields are optional with defaults, preserving backward compatibility.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] 042 Phase 1 journal schema confirmed and compatible with improvement events
- [ ] 042 Phase 2 coverage graph API confirmed to support `loop_type` namespace parameter
- [ ] Existing sk-improve-agent SKILL.md and improvement_config.json read and understood
- [ ] All 13 requirements documented in spec.md with measurable acceptance criteria

### Definition of Done

- [ ] All 13 requirements (REQ-AI-001 through REQ-AI-013) have passing acceptance criteria
- [ ] 5 new CJS scripts created and all 5 Vitest suites pass with zero flaky tests across 3 runs
- [ ] SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, and agent.md updated
- [ ] Backward compatibility verified: existing improvement sessions with no new config fields behave identically
- [ ] All ADRs (001-005) documented in decision-record.md and marked Accepted
- [ ] checklist.md fully verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Event-sourced improvement loop with packet-local append-only state. The orchestrator owns all state writes; the proposal-only agent remains read-only relative to journals and graphs.

### Key Components

- **improvement-journal.cjs**: Append-only JSONL emitter. Receives structured event objects from the orchestrator and appends them to the session journal file. Enforces the event schema and blocks invalid event types.
- **mutation-coverage.cjs**: Coverage graph reader/writer. Tracks explored dimensions, tried mutation types per dimension, integration surfaces touched, and exhausted mutation sets. Uses `loop_type: "improvement"` namespace to isolate from deep-research/review paths.
- **trade-off-detector.cjs**: Reads the current dimension trajectory and compares per-dimension deltas against configured thresholds. Emits a structured trade-off report when thresholds are crossed; used by the orchestrator to decide whether to journal a `trade-off-detected` event.
- **candidate-lineage.cjs**: Builds and queries a directed graph of candidate proposals across parallel wave sessions. Links each node to its parent session-id, wave index, and spawning mutation type.
- **benchmark-stability.cjs**: Accepts a benchmark result set from multiple replays of identical input, computes per-dimension stability coefficients, and emits a stability report. Stability coefficient is defined as 1 - (stddev / mean) per dimension.

### Data Flow

Orchestrator receives improvement session trigger → reads prior journal (if resume) → enters iteration loop → calls agent-improver (proposal-only) → evaluates candidate using 5-dimension scoring → calls trade-off-detector → appends events to journal via improvement-journal.cjs → updates mutation-coverage.cjs → checks legal-stop gates → emits stop-reason and session-ended event → optionally triggers benchmark-stability.cjs post-session → optionally triggers weight optimizer (separate invocation).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sub-Phase 5a: Runtime Truth Alignment (~10 tasks)

Deliver the core runtime contracts: stop-reason taxonomy, legal-stop gates, resume semantics, audit journal, and hypothesis verification ledger. This sub-phase maps directly to 042 Phase 1 but is adapted for improvement loop semantics (e.g., `promoted` and `rolledBack` replace deep-research `synthesized` states).

- [ ] Define stop-reason taxonomy in SKILL.md (REQ-AI-001)
- [ ] Implement legal-stop gate logic in agent-improver.md orchestrator section (REQ-AI-002)
- [ ] Add resume/continuation protocol to agent.md command (REQ-AI-003)
- [ ] Create `improvement-journal.cjs` with append-only JSONL emit (REQ-AI-004)
- [ ] Create hypothesis verification ledger schema and writer in journal script (REQ-AI-005)
- [ ] Update improvement_charter.md with audit trail obligations
- [ ] Add session-id propagation to improvement_config.json
- [ ] Write `improvement-journal.vitest.ts` test suite
- [ ] Verify backward compatibility: session without session-id runs as before
- [ ] Manual integration test: run a session and confirm journal output

### Sub-Phase 5b: Improvement Intelligence (~8 tasks)

Add mutation coverage tracking, dimension trajectory, trade-off detection, and exhausted-mutations logging. Reuses the Phase 2 coverage graph infrastructure via namespace isolation.

- [ ] Create `mutation-coverage.cjs` with `loop_type: "improvement"` namespace (REQ-AI-006)
- [ ] Implement dimension trajectory writer and reader (REQ-AI-007)
- [ ] Create `trade-off-detector.cjs` with configurable thresholds (REQ-AI-008)
- [ ] Implement exhausted-mutations log in mutation-coverage.cjs (REQ-AI-009)
- [ ] Update improvement_strategy.md with trajectory-based convergence criteria
- [ ] Update improvement_config.json with coverage graph path and trade-off thresholds
- [ ] Write `mutation-coverage.vitest.ts` and `trade-off-detector.vitest.ts` test suites
- [ ] Manual integration test: run 3-iteration session and inspect coverage graph

### Sub-Phase 5c: Parallel Candidates (~5 tasks)

Add optional parallel candidate wave support and candidate lineage graph. Gate activation on the exploration-breadth config threshold.

- [ ] Create `candidate-lineage.cjs` for wave session graph (REQ-AI-011)
- [ ] Implement parallel wave orchestration branch in agent-improver.md (REQ-AI-010)
- [ ] Add `parallelWaves` config block to improvement_config.json with `enabled: false` default
- [ ] Write `candidate-lineage.vitest.ts` test suite
- [ ] Manual test: verify single-wave behavior unchanged when `enabled: false`

### Sub-Phase 5d: Scoring Optimization (~5 tasks)

Add scoring weight optimizer using historical session data and benchmark replay stability measurement.

- [ ] Create `benchmark-stability.cjs` with stability coefficient computation (REQ-AI-013)
- [ ] Implement weight optimizer read-and-recommend logic (REQ-AI-012) — recommendation only, no auto-apply
- [ ] Update SKILL.md with weight optimizer invocation guidance
- [ ] Write `benchmark-stability.vitest.ts` test suite
- [ ] Manual test: run optimizer after 3 artificial sessions and verify report format
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | All 5 new CJS scripts: event schema validation, graph read/write, trade-off thresholds, lineage linkage, stability coefficient math | Vitest |
| Integration | Orchestrator loop with journal emit, coverage graph update, legal-stop gate | Manual session run + journal inspection |
| Backward compat | Existing improvement session with no new config fields | Manual session run without new config fields |
| Regression | Parallel wave disabled by default | Config validation test in improvement_config tests |
| Replay stability | Identical input replayed 3 times; coefficient variance < 0.05 | benchmark-stability.cjs + manual verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 042 Phase 1 journal schema | Internal | Green | Cannot finalize journal event types without schema contract |
| 042 Phase 2 coverage graph API | Internal | Green | Must confirm `loop_type` param support before mutation-coverage.cjs |
| sk-improve-agent SKILL.md current state | Internal | Green | Must read before modifying |
| Vitest (test runner) | External | Green | Required for 5 test suites; already used in project |
| Node.js CJS module conventions | Internal | Green | All new scripts follow existing sk-improve-agent script patterns |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any sub-phase introduces regressions in existing improvement session behavior, or legal-stop gates block valid sessions.
- **Procedure**: All new config fields have defaults; removing or nulling new fields restores prior behavior. New scripts are additive and not imported by existing code paths until SKILL.md is updated. Revert SKILL.md, improvement_config.json, and agent-improver.md to their pre-phase state to fully restore prior behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
5a: Runtime Truth ────────────┐
                              ├──► 5b: Improvement Intelligence ──► 5d: Scoring Optimization
                              │
                              └──► 5c: Parallel Candidates
```

| Sub-Phase | Depends On | Blocks |
|-----------|------------|--------|
| 5a Runtime Truth | None (reads 042 schema) | 5b, 5c, 5d |
| 5b Improvement Intelligence | 5a (journal, coverage graph pattern) | 5d |
| 5c Parallel Candidates | 5a (journal emit protocol) | None |
| 5d Scoring Optimization | 5a (journal history), 5b (trajectory data) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Sub-Phase | Complexity | Estimated Effort |
|-----------|------------|------------------|
| 5a Runtime Truth Alignment | High | 6-8 hours |
| 5b Improvement Intelligence | High | 6-8 hours |
| 5c Parallel Candidates | Medium | 3-4 hours |
| 5d Scoring Optimization | Medium | 3-4 hours |
| **Total** | | **18-24 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup current SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, agent.md
- [ ] Confirm 042 Phase 1 journal schema version pinned
- [ ] Confirm coverage graph `loop_type` namespace does not collide with existing namespaces

### Rollback Procedure

1. Revert SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, and agent.md to pre-phase state using git revert or file restore
2. Remove new scripts from `.opencode/skill/sk-improve-agent/scripts/` (they are not imported by existing code)
3. Remove new test files from `scripts/tests/`
4. Verify an existing improvement session runs without error

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: JSONL journal files and coverage graph files are new additions with no schema migration; deleting them fully reverts to pre-phase state
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌───────────────────────┐     ┌──────────────────────────┐
│ 5a Runtime Truth │────►│ 5b Improvement Intel   │────►│ 5d Scoring Optimization  │
│ - journal.cjs    │     │ - mutation-coverage.cjs│     │ - benchmark-stability.cjs│
│ - stop-reasons   │     │ - trade-off-detector   │     │ - weight optimizer       │
│ - legal-stop     │     │ - trajectory tracking  │     └──────────────────────────┘
│ - resume proto   │     └───────────────────────┘
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ 5c Parallel Cand │
│ - lineage.cjs    │
│ - wave branch    │
└──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 5a Runtime Truth | 042 Phase 1 schema | journal.cjs, stop-reason taxonomy, resume protocol | 5b, 5c, 5d |
| 5b Improvement Intel | 5a (journal emit) | mutation-coverage.cjs, trade-off-detector.cjs, trajectory files | 5d |
| 5c Parallel Cand | 5a (journal emit) | candidate-lineage.cjs, wave orchestration branch | None |
| 5d Scoring Opt | 5a (journal history), 5b (trajectory) | benchmark-stability.cjs, weight optimizer report | None |
<!-- /ANCHOR:dependency-graph -->

--- tasks.md ---
---
title: "Tasks: Agent-Improver Deep-Loop Alignment [005]"
description: "24 tasks across 4 sub-phases mapping 13 requirements to concrete implementation steps for the sk-improve-agent runtime truth alignment."
trigger_phrases:
  - "005"
  - "agent improver tasks"
  - "improvement journal tasks"
  - "mutation coverage tasks"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` — REQ reference in parentheses indicates the requirement satisfied.

**Sub-phase prefix**: Tasks are grouped by sub-phase (5a/5b/5c/5d). Within a sub-phase, tasks are ordered by dependency.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Sub-Phase 5a: Runtime Truth Alignment

*Delivers: stop-reason taxonomy, legal-stop gates, resume semantics, audit journal, hypothesis verification ledger.*

- [ ] T001 Read existing sk-improve-agent SKILL.md, improvement_config.json, improvement_charter.md, improvement_strategy.md and agent-improver.md to understand current state before modifying (all skill files)
- [ ] T002 Read 042 Phase 1 journal schema from `../001-runtime-truth-foundation/` to confirm event type contract before writing journal script
- [ ] T003 Add stop-reason taxonomy section to SKILL.md: define `converged`, `promoted`, `rolledBack`, `maxIterationsReached`, `regressionDetected`, `manualStop`, `error` with trigger conditions (`.opencode/skill/sk-improve-agent/SKILL.md`) (REQ-AI-001)
- [ ] T004 Add legal-stop gate protocol to agent-improver.md orchestrator section: gate conditions for `converged` and `promoted` using 5-dimension stability + no regression + promotion criteria (`.opencode/agent/agent-improver.md`) (REQ-AI-002)
- [ ] T005 Add resume/continuation semantics to agent.md command: session-id parameter, journal replay on resume, iteration counter carry-over (`.opencode/command/improve/agent.md`) (REQ-AI-003)
- [ ] T006 Create `improvement-journal.cjs`: append-only JSONL emitter with event schema validation for `iteration-started`, `candidate-proposed`, `candidate-evaluated`, `promotion-gate-checked`, `trade-off-detected`, `session-ended` event types (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-004)
- [ ] T007 Add hypothesis verification ledger schema to `improvement-journal.cjs`: `mutation-proposed` and `mutation-outcome` event types capturing proposed mutation, accepted/rejected status, rejection reason, and scored dimensions (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-005)
- [ ] T008 Update improvement_charter.md: add audit trail obligations section specifying that the orchestrator must emit journal events at each iteration boundary (`.opencode/skill/sk-improve-agent/assets/improvement_charter.md`)
- [ ] T009 Update improvement_config.json: add optional `journal.path`, `journal.sessionId`, `sessionResume.enabled` fields with documented defaults (`.opencode/skill/sk-improve-agent/assets/improvement_config.json`)
- [ ] T010 Write `improvement-journal.vitest.ts`: test event emit, append-only enforcement (second write appends not overwrites), invalid event type rejection, resume journal read, session-ended event schema (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Sub-Phase 5b: Improvement Intelligence

*Delivers: mutation coverage graph, dimension trajectory tracking, trade-off detection, exhausted-mutations log.*
*Depends on: T006 (journal emit for trade-off events).*

- [ ] T011 [P] Read 042 Phase 2 coverage graph API from `../002-semantic-coverage-graph/` to confirm `loop_type` namespace parameter support before implementing mutation-coverage.cjs
- [ ] T012 Create `mutation-coverage.cjs`: coverage graph reader/writer with `loop_type: "improvement"` namespace; tracks explored dimensions, tried mutation types per dimension, integration surfaces, exhausted mutation sets (`.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs`) (REQ-AI-006, REQ-AI-009)
- [ ] T013 Add dimension trajectory writer to `mutation-coverage.cjs` or as a co-located module: time-ordered score vector per dimension, enforces minimum 3 data points before convergence claim (REQ-AI-007)
- [ ] T014 Create `trade-off-detector.cjs`: reads current trajectory, computes per-dimension deltas, compares against configurable thresholds, returns structured trade-off report (`.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`) (REQ-AI-008)
- [ ] T015 Update improvement_strategy.md: add trajectory-based convergence criteria (minimum 3 data points, stabilization threshold), mutation exhaustion guidance (skip exhausted types, annotate journal), trade-off resolution guidance (`.opencode/skill/sk-improve-agent/assets/improvement_strategy.md`)
- [ ] T016 Update improvement_config.json: add optional `coverageGraph.path`, `trajectory.minDataPoints`, `tradeOff.thresholds` config block with documented defaults (`.opencode/skill/sk-improve-agent/assets/improvement_config.json`)
- [ ] T017 Write `mutation-coverage.vitest.ts`: test namespace isolation, graph read/write round-trip, exhausted-mutations marking, trajectory append and minimum data-point enforcement (`.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts`)
- [ ] T018 Write `trade-off-detector.vitest.ts`: test threshold crossing detection, no-event-when-below-threshold, configurable threshold values, empty trajectory handling (`.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Sub-Phase 5c: Parallel Candidates

*Delivers: optional parallel candidate waves with exploration-breadth gate, candidate lineage graph.*
*Depends on: T006 (journal emit); T003 (SKILL.md updated).*
*Can run in parallel with Sub-Phase 5b after 5a completes.*

- [ ] T019 [P] Create `candidate-lineage.cjs`: directed graph of candidate proposals across parallel wave sessions; each node stores session-id, wave-index, spawning mutation type, and parent node reference (`.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs`) (REQ-AI-011)
- [ ] T020 [P] Add parallel wave orchestration branch to agent-improver.md: activation check against `parallelWaves.enabled` and `explorationBreadthScore >= activationThreshold`; spawn 2-3 candidates with different strategies; merge results by selecting highest non-regressive score (`.opencode/agent/agent-improver.md`) (REQ-AI-010)
- [ ] T021 Update improvement_config.json: add `parallelWaves` config block with `enabled: false`, `activationThreshold`, `maxCandidates` fields and JSDoc comments (`.opencode/skill/sk-improve-agent/assets/improvement_config.json`)
- [ ] T022 Write `candidate-lineage.vitest.ts`: test node creation, parent-child linkage, root-to-leaf traversal, wave-index assignment, session-id isolation (`.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts`)
- [ ] T023 [P] Manual verification: run an improvement session with `parallelWaves.enabled: false` (default) and confirm single-wave behavior is unchanged; confirm no lineage graph is written when parallel mode is off
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Sub-Phase 5d: Scoring Optimization

*Delivers: scoring weight optimizer (recommendation only), benchmark replay stability measurement.*
*Depends on: T006 (journal history), T013 (trajectory data).*

- [ ] T024 Create `benchmark-stability.cjs`: accepts array of benchmark result sets from identical replays, computes per-dimension stability coefficient (1 - stddev/mean), emits stability report JSON, appends `stabilityWarning` to journal if any coefficient is below configured threshold (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs`) (REQ-AI-013)
- [ ] T025 Implement weight optimizer logic in `benchmark-stability.cjs` or co-located module: reads historical journal files after session count threshold, computes per-dimension performance patterns, emits weight-recommendation report file (not auto-applied) (REQ-AI-012)
- [ ] T026 Update SKILL.md: add weight optimizer invocation guidance (when to run, what the report contains, how to apply recommendations manually), benchmark stability interpretation guide (`.opencode/skill/sk-improve-agent/SKILL.md`)
- [ ] T027 Update improvement_config.json: add `weightOptimizer.sessionCountThreshold`, `weightOptimizer.reportPath`, `benchmarkStability.replayCount`, `benchmarkStability.warningThreshold` optional config fields (`.opencode/skill/sk-improve-agent/assets/improvement_config.json`)
- [ ] T028 Write `benchmark-stability.vitest.ts`: test stability coefficient math (perfect stability = 1.0, high variance = low coefficient), stability warning threshold triggering, weight recommendation report format, multi-session history aggregation (`.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T028 marked `[x]` (or explicitly deferred with user approval for P2 items)
- [ ] No `[B]` blocked tasks remaining
- [ ] All 5 Vitest suites (`improvement-journal`, `mutation-coverage`, `trade-off-detector`, `candidate-lineage`, `benchmark-stability`) pass with zero failures across 3 consecutive runs
- [ ] Backward compatibility verified: improvement session run without any new config fields produces identical output to pre-phase behavior
- [ ] SKILL.md, all 4 asset files, agent-improver.md, and agent.md updated and synchronized with spec.md requirements
- [ ] checklist.md verification complete with evidence for all P0 and P1 items
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Document | Purpose |
|----------|---------|
| `spec.md` | Full requirements (REQ-AI-001 through REQ-AI-013) and acceptance criteria |
| `plan.md` | Sub-phase architecture, effort estimates, dependency graph, and milestones |
| `checklist.md` | Verification gate items (CHK-* series) to mark as evidence accrues |
| `decision-record.md` | ADR-001 through ADR-005 with full rationale and alternatives |
| `../001-runtime-truth-foundation/` | 042 Phase 1 journal schema — primary dependency for Sub-Phase 5a |
| `../002-semantic-coverage-graph/` | 042 Phase 2 coverage graph API — primary dependency for Sub-Phase 5b |
| `../003-wave-executor/` | 042 Phase 3 wave executor — reference for Sub-Phase 5c parallel candidate gate |
| `../004-offline-loop-optimizer/` | 042 Phase 4 optimizer patterns — reference for Sub-Phase 5d |
<!-- /ANCHOR:cross-refs -->

exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' . .." in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 181ms:
../Public/AGENTS.md
./AGENTS.md
../Barter/coder/AGENTS.md
./.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
../Public/.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
../Public/.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
../Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md

codex
The Phase 005 packet is explicit about the intended port: it wants Phase 1 journaling/stop contracts, Phase 2 coverage semantics, Phase 3 wave gating, and Phase 4 optimizer logic applied to `sk-improve-agent`. I’m now reading the current runtime surfaces to separate “already implicit today” from “missing and should be formalized,” which will make the 10 iteration recommendations concrete instead of theoretical.
exec
/bin/zsh -lc "printf '--- skill tree ---\\n'; find .opencode/skill/sk-improve-agent -maxdepth 3 -type f | sort; printf '\\n--- phase dirs ---\\n'; find .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 -maxdepth 2 -mindepth 1 -type d | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- skill tree ---
.opencode/skill/sk-improve-agent/README.md
.opencode/skill/sk-improve-agent/SKILL.md
.opencode/skill/sk-improve-agent/assets/improvement_charter.md
.opencode/skill/sk-improve-agent/assets/improvement_config.json
.opencode/skill/sk-improve-agent/assets/improvement_config_reference.md
.opencode/skill/sk-improve-agent/assets/improvement_strategy.md
.opencode/skill/sk-improve-agent/assets/target-profiles/context-prime.json
.opencode/skill/sk-improve-agent/assets/target-profiles/handover.json
.opencode/skill/sk-improve-agent/assets/target_manifest.jsonc
.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/002-scan-missing-agent.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/003-scan-diverse-agent.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/004-json-output-file.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/02--profile-generator/005-rules-extraction.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/02--profile-generator/006-output-checks.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/02--profile-generator/007-inline-rules-fallback.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/02--profile-generator/008-file-output.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/03--5d-scorer/009-dynamic-handover.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/03--5d-scorer/010-dynamic-arbitrary.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/03--5d-scorer/011-legacy-unchanged.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/03--5d-scorer/012-dimension-details.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/03--5d-scorer/013-missing-candidate.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/04--benchmark-integration/014-without-integration.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/04--benchmark-integration/015-with-integration.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/04--benchmark-integration/016-fixture-regression.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/017-no-dimensions.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/018-with-dimensions.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/019-plateau-detection.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/021-any-agent.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md
.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md
.opencode/skill/sk-improve-agent/references/evaluator_contract.md
.opencode/skill/sk-improve-agent/references/integration_scanning.md
.opencode/skill/sk-improve-agent/references/loop_protocol.md
.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md
.opencode/skill/sk-improve-agent/references/no_go_conditions.md
.opencode/skill/sk-improve-agent/references/promotion_rules.md
.opencode/skill/sk-improve-agent/references/quick_reference.md
.opencode/skill/sk-improve-agent/references/rollback_runbook.md
.opencode/skill/sk-improve-agent/references/second_target_evaluation.md
.opencode/skill/sk-improve-agent/references/target_onboarding.md
.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs
.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs
.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs
.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
.opencode/skill/sk-improve-agent/scripts/rollback-candidate.cjs
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs
.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs

--- phase dirs ---
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/memory
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/memory
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/scratch
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/memory
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/scratch
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/memory
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/memory
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch

exec
/bin/zsh -lc "printf '\\n--- agent-improver.md ---\\n'; sed -n '1,260p' .opencode/agent/agent-improver.md; printf '\\n--- command improve/agent.md ---\\n'; sed -n '1,260p' .opencode/command/improve/agent.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

--- agent-improver.md ---
---
name: agent-improver
description: Proposal-only mutator for bounded agent-improver candidate generation with evaluator-first rules
mode: subagent
temperature: 0.2
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: deny
  chrome_devtools: deny
  task: deny
  list: allow
  patch: deny
  external_directory: allow
---

# The Recursive Agent: Proposal-Only Mutator

Proposal-only mutator for bounded agent-improver experiments. This agent writes one packet-local candidate, returns structured metadata, and stops before scoring, promotion, or packaging work begins.

**CRITICAL**: This agent MUST stay proposal-only. It never scores, promotes, benchmarks, or edits canonical targets or runtime mirrors.

**IMPORTANT**: Use `.opencode/agent/*.md` as the canonical runtime path reference. Runtime mirrors are downstream packaging concerns.

---

## 1. CORE WORKFLOW

### Proposal-Only Candidate Generation

1. **READ THE CONTROL BUNDLE** -> Read the copied charter and manifest before generating any candidate.
2. **READ THE TARGET AND ITS INTEGRATION SURFACE** -> Read the canonical source file, the active target profile, fixture expectations, and the integration scan report (generated by `scan-integration.cjs`) to understand how the agent connects across the system.
3. **WRITE ONLY TO THE RUNTIME AREA** -> Generate one bounded candidate under the packet-local candidate folder.
4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, and change summary in machine-readable JSON.
5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.

**Key Principle**: This is a leaf mutator. It proposes one bounded candidate and leaves scoring, benchmarking, promotion, rollback, and packaging to other surfaces.

---

## 2. CAPABILITY SCAN

### Skills

| Skill | Domain | Use When | Key Features |
| ----- | ------ | -------- | ------------ |
| `sk-improve-agent` | Improvement loop protocol | Always | Charter, manifest, target-profile, evaluator, and promotion guidance |
| `sk-doc` | Documentation quality | When candidate language must stay crisp and explicit | Template alignment and validator-backed clarity |
| `system-spec-kit` | Packet discipline | When operating inside a spec folder | Phase-aware evidence handling and validation rules |

### Tools

| Tool | Purpose | When to Use |
| ---- | ------- | ----------- |
| `read` | Read charter, manifest, target, and profile context | Always before proposing changes |
| `grep` | Confirm exact strings or anchors in the target surface | When checking structure quickly |
| `glob` | Locate packet-local runtime paths and manifest or profile files | During runtime setup verification |
| `edit` / `write` | Write the candidate artifact into the runtime area | Only after the target and rules are understood |
| `bash` | Run lightweight local checks on runtime paths when needed | Only for bounded verification |
| `list` | Inspect runtime directories | When packet-local structure is unclear |
| `bash` (node) | Run scan-integration and generate-profile scripts | When integration surface or dynamic profile is needed |

---

## 3. OPERATING RULES

### Required Inputs

- Runtime root for the current experiment
- Path to the copied charter
- Path to the copied manifest
- Path to the canonical target
- Candidate output path

**HALT CONDITION — Missing Required Input**: If ANY of the five inputs above is absent or unresolvable before Step 1 of the Core Workflow, STOP immediately. Do NOT proceed to read any file. Return the following error JSON and take no further action:

```json
{
  "status": "error",
  "error": "missing-required-input",
  "missing": ["<list each absent input by name>"],
  "action": "Provide all required inputs before re-invoking this agent.",
  "candidate_path": null,
  "target": null
}
```

This halt is non-negotiable. An agent that proceeds without its control bundle cannot guarantee proposal-only discipline.

### Always

- Read the charter first
- Read the manifest first
- Read the canonical target before proposing changes
- Stay proposal-only
- Keep scope narrow and explicit
- Return structured metadata about what changed and why

### Never

- Edit the canonical target
- Edit runtime mirrors
- Expand scope beyond the manifest
- Score the candidate yourself
- Hide uncertainty or fabricate evidence

---

## 4. OUTPUT VERIFICATION

**CRITICAL**: Before claiming completion, verify that the candidate stayed proposal-only and that the returned JSON matches the actual runtime paths.

### Pre-Delivery Verification Checklist

```text
RECURSIVE-AGENT VERIFICATION (MANDATORY):
□ Read the charter and manifest before writing the candidate
□ Candidate path points to the packet-local runtime area, not the canonical target
□ Returned target matches the manifest-approved target for this run
□ JSON output includes status, candidate_path, target, change_summary, and notes
□ No claim implies canonical mutation
□ No placeholder output remains in the JSON response
□ Any uncertainty is stated explicitly
```

### Self-Validation Protocol

```text
SELF-CHECK:
□ Did I receive all five required inputs before starting?
□ Did I read the control bundle before writing?
□ Did I avoid editing the canonical target and runtime mirrors?
□ Does the candidate live only in the packet-local runtime area?
□ Did I return the required JSON fields with real paths?

If ANY box is unchecked -> DO NOT CLAIM COMPLETION
Fix the proposal boundary first
```

### The Iron Law

> NEVER CLAIM COMPLETION WITHOUT PROVING THE CANDIDATE STAYED PROPOSAL-ONLY

---

## 5. ANTI-PATTERNS

❌ **Never promote from inside this agent**
- Promotion requires separate scorer, benchmark, repeatability, and approval evidence.

❌ **Never treat mirrors as equivalent to the canonical target**
- Mirror surfaces are downstream packaging concerns, not candidate-generation targets in this phase.

❌ **Never broaden the candidate beyond the manifest**
- A prompt that crosses the declared boundary is a failed run, not a win.

❌ **Never proceed when required inputs are missing**
- Return the structured error JSON and stop. Do not attempt to infer or substitute missing paths.

---

## 6. RELATED RESOURCES

### Commands

| Command | Purpose | Path |
| ------- | ------- | ---- |
| `/improve:agent` | Initializes and runs the bounded agent-improver workflow | `.opencode/command/improve/agent.md` |

### Skills

| Skill | Purpose |
| ----- | ------- |
| `sk-improve-agent` | Main loop protocol, routing, references, and assets |
| `sk-doc` | Documentation-shape guidance for prompt and package clarity |
| `system-spec-kit` | Packet workflow, validation, and evidence discipline |

### Agents

| Agent | Purpose |
| ----- | ------- |
| `agent-improver` | Proposal-only mutator for bounded candidate generation |
| `review` | Independent read-only review when a follow-up quality pass is needed |

---

## 7. SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│              THE RECURSIVE AGENT: PROPOSAL-ONLY MUTATOR                 │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Read the control bundle and target surface                         │
│  ├─► Generate one bounded candidate in the packet-local runtime area    │
│  └─► Return structured proposal metadata                                │
│                                                                         │
│  WORKFLOW (5 Steps)                                                     │
│  ├─► 1. Read charter and manifest                                       │
│  ├─► 2. Read target, profile context, and integration scan report        │
│  ├─► 3. Write one packet-local candidate                                │
│  ├─► 4. Return structured JSON                                          │
│  └─► 5. Stop                                                            │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► No canonical mutation                                              │
│  ├─► No scoring or promotion                                            │
│  └─► No runtime mirror edits                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

--- command improve/agent.md ---
---
description: "Evaluate and improve any agent across 5 integration-aware dimensions with proposal-first candidates, deterministic scoring, and guarded promotion — supports :auto and :confirm modes"
argument-hint: "<agent_path> [:auto|:confirm] [--spec-folder=PATH] [--iterations=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load matching YAML workflow and execute
>
> This command is **general-agent based** and does **not** require `@write`.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You were invoked without @write-only constraints
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates sk-improve-agent skill          │
    │   │ invocation and does not require @write routing.            │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /improve:agent [arguments]                               │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction for setup.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains an agent path:
   ├─ IF present (.opencode/agent/*.md) → target_path = detected value, omit Q0
   └─ IF missing → include Q0 in prompt

3. CHECK for --spec-folder flag:
   ├─ IF present → spec_folder = value, omit Q1
   └─ IF missing → include Q1 in prompt

4. CHECK for --iterations flag:
   ├─ IF present → max_iterations = value
   └─ IF missing → max_iterations = 5 (default)

5. List available agents for Q0:
   $ ls .opencode/agent/*.md

6. List recent spec folders for Q1:
   $ ls -d specs/*/ 2>/dev/null | tail -10

7. ASK user with SINGLE consolidated prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Target Agent** (if not provided in command):             │
   │    Which agent would you like to evaluate and improve?         │
   │    [list agents found above]                                   │
   │                                                                │
   │ **Q1. Spec Folder** (if no --spec-folder flag):                 │
   │    A) Use existing spec folder: [list if found]                │
   │    B) Create new spec folder                                   │
   │    C) Use temporary directory                                  │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous — run loop without approval gates             │
   │    B) Interactive — confirm at each iteration                   │
   │                                                                │
   │ **Q3. Scoring Mode**:                                          │
   │    A) Dynamic — 5-dimension integration-aware (any agent)      │
   │    B) Static — legacy profile (handover/context-prime only)     │
   │                                                                │
   │ Reply format: "handover, A, A, A" or                           │
   │ ".opencode/agent/debug.md, B, B, A"                            │
   └────────────────────────────────────────────────────────────────┘

8. WAIT for user response (DO NOT PROCEED)

9. Parse response and store ALL results:
   - target_path = [from Q0 or $ARGUMENTS]
   - target_profile = [derived: handover, context-prime, or dynamic]
   - spec_folder = [from Q1 or --spec-folder]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - scoring_mode = [dynamic/static from Q3]
   - max_iterations = [from --iterations or default 5]

10. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER infer target agent from context, screenshots, or conversation history
⛔ NEVER auto-select spec folder without user confirmation
⛔ NEVER split these questions into multiple prompts
⛔ NEVER assume what the user wants based on open files or recent activity
```

**Phase Output:**
- `general_agent_verified = ________________`
- `target_path = ________________`
- `target_profile = ________________`
- `spec_folder = ________________`
- `execution_mode = ________________`
- `scoring_mode = ________________`
- `max_iterations = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| target_path            | ✅ Yes         | ______     | Q0 or $ARGUMENTS        |
| target_profile         | ✅ Yes         | ______     | Derived from target     |
| spec_folder            | ✅ Yes         | ______     | Q1 or --spec-folder     |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2            |
| scoring_mode           | ✅ Yes         | ______     | Q3                      |
| max_iterations         | ✅ Yes         | ______     | --iterations or 5       |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **DO NOT** infer target agent from context, screenshots, or conversation history
- **DO NOT** start the loop without all setup values resolved
- **FIRST ACTION** is always: run Phase 0, run Setup, then load YAML workflow

---

# Improve Agent

Evaluate and improve any agent across 5 integration-aware dimensions. The skill scans all surfaces the agent touches, derives a scoring profile from the agent's own rules, writes packet-local candidates, scores them deterministically, and only allows promotion when evidence and approval gates are satisfied.

---

## 1. PURPOSE

Run a bounded evaluator-first loop that:
1. Scans the target agent's full integration surface (mirrors, commands, YAML workflows, skills)
2. Generates a dynamic scoring profile from the agent's own ALWAYS/NEVER/ESCALATE IF rules
3. Proposes packet-local candidates without mutating the canonical target
4. Scores candidates across 5 weighted dimensions (structural, ruleCoherence, integration, outputQuality, systemFitness)
5. Runs fixture benchmarks against target-specific test sets
6. Reduces evidence into a dimensional dashboard with plateau detection
7. Stops when improvement plateaus, max iterations reached, or operator decides

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — agent path, optional mode suffix, optional spec folder, optional iteration count
**Outputs:** improvement packet state under `{spec_folder}/improvement/` + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 5-DIMENSION REFERENCE

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (required sections) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent, skills reference agent |
| Output Quality | 0.15 | Output verification items present, no placeholder content |
| System Fitness | 0.15 | Permission-capability alignment, resource references valid |

### Scoring Modes

| Mode | Flag | Profiles | Use When |
| --- | --- | --- | --- |
| Dynamic | `--dynamic` | Any agent (generated on-the-fly) | Evaluating arbitrary agents, integration health checks |
| Static | `--profile=ID` | handover, context-prime (hardcoded) | Promotion workflows with static fixture sets |

---

## 4. WORKFLOW STEPS

### Step 1: Load sk-improve-agent Skill

```
Read(".opencode/skill/sk-improve-agent/SKILL.md")
```

### Step 2: Run Integration Scan

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent={agent_name} --output={spec_folder}/improvement/integration-report.json
```

Review the integration report: mirror sync status, command coverage, skill references.

### Step 3: Generate or Load Profile

**Dynamic mode (scoring_mode = dynamic):**
```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent={target_path} --output={spec_folder}/improvement/dynamic-profile.json
```


exec
/bin/zsh -lc "printf '\\n--- SKILL.md ---\\n'; sed -n '1,260p' .opencode/skill/sk-improve-agent/SKILL.md; printf '\\n--- improvement_config.json ---\\n'; sed -n '1,260p' .opencode/skill/sk-improve-agent/assets/improvement_config.json; printf '\\n--- improvement_strategy.md ---\\n'; sed -n '1,260p' .opencode/skill/sk-improve-agent/assets/improvement_strategy.md; printf '\\n--- improvement_charter.md ---\\n'; sed -n '1,260p' .opencode/skill/sk-improve-agent/assets/improvement_charter.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

--- SKILL.md ---
---
name: sk-improve-agent
description: "Evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, packet-local candidates, and guarded promotion or rollback."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0
triggers:
  - sk-improve-agent
  - agent improvement loop
  - bounded agent improvement
  - 5-dimension scoring
  - integration scanner
  - dynamic profiling
---

<!-- Keywords: sk-improve-agent, agent-improver, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- You want to test whether an agent prompt or instruction surface can be improved
- The mutation boundary is explicit and narrow
- You need packet-local evidence instead of ad hoc prompt tweaking
- You need target-specific benchmark or scoring rules before any canonical mutation
- Promotion must stay gated behind independent evidence plus operator approval

### Primary Use Cases

#### Bounded Agent Improvement

Use this skill to set up a proposal-first loop for a single target such as `.opencode/agent/handover.md` or `.opencode/agent/context-prime.md`, write packet-local candidates, and record append-only evidence.

#### Benchmark-Backed Evaluation

Use this skill when candidate quality must be judged by produced artifacts and repeatability reports, not just by how a prompt file reads in isolation.

#### Promotion and Rollback Verification

Use this skill when you need to prove that guarded promotion, validation, rollback, and post-rollback comparison all work end to end without leaving hidden drift behind.

### When NOT to Use

Do not use this skill for:
- Open-ended prompt rewrites across multiple agent families at once
- Direct canonical edits without a packet-local candidate and evaluator evidence
- Broad runtime-mirror synchronization work presented as benchmark truth
- General packet planning that belongs in `/spec_kit:plan` or implementation that does not need an improvement loop

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring so only the guidance that matches the current task is loaded.

- `references/` for operator workflows, evaluator policy, promotion or rollback rules, target onboarding, and quick-reference guidance
- `assets/` for reusable runtime templates such as the charter and strategy markdown files
- `assets/target-profiles/` and `assets/fixtures/` for non-markdown runtime inputs loaded directly by the workflow, not by markdown discovery
- `scripts/` for deterministic benchmark, scoring, reduction, promotion, rollback, and drift-check helpers

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Workflow, policy, or onboarding references |
| ON_DEMAND | Only on explicit request or full setup | Markdown runtime templates in `assets/` |

### Smart Router Pseudocode

The authoritative routing logic for scoped markdown loading and explicit runtime-asset loading.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "QUICK_REFERENCE": {"weight": 3, "keywords": ["quick reference", "short reminder", "command example"]},
    "LOOP_EXECUTION": {"weight": 4, "keywords": ["run loop", "proposal", "candidate", "score candidate", "benchmark"]},
    "EVALUATION_POLICY": {"weight": 4, "keywords": ["evaluator", "rubric", "contract", "repeatability", "no-go"]},
    "PROMOTION_OPERATIONS": {"weight": 4, "keywords": ["promote", "rollback", "mirror drift", "approval gate"]},
    "TARGET_ONBOARDING": {"weight": 4, "keywords": ["new target", "target profile", "onboarding", "second target"]},
    "INTEGRATION_SCAN": {"weight": 4, "keywords": ["integration", "scan surfaces", "mirror sync", "dynamic profile", "5-dimension"]},
    "FULL_SETUP": {"weight": 3, "keywords": ["full setup", "initialize runtime", "charter", "strategy"]},
}

RESOURCE_MAP = {
    "QUICK_REFERENCE": ["references/quick_reference.md"],
    "LOOP_EXECUTION": ["references/loop_protocol.md", "references/benchmark_operator_guide.md"],
    "EVALUATION_POLICY": ["references/evaluator_contract.md", "references/no_go_conditions.md", "references/promotion_rules.md"],
    "PROMOTION_OPERATIONS": ["references/rollback_runbook.md", "references/mirror_drift_policy.md", "references/promotion_rules.md"],
    "TARGET_ONBOARDING": ["references/target_onboarding.md", "references/second_target_evaluation.md"],
    "INTEGRATION_SCAN": ["references/integration_scanning.md", "references/evaluator_contract.md"],
    "FULL_SETUP": ["assets/improvement_charter.md", "assets/improvement_strategy.md"],
}

RUNTIME_ASSETS = {
    "ALWAYS": ["assets/improvement_config.json", "assets/target_manifest.jsonc"],
    "PROFILE_RUNTIME": {
        "handover": ["assets/target-profiles/handover.json", "assets/fixtures/handover/"],
        "context-prime": ["assets/target-profiles/context-prime.json", "assets/fixtures/context-prime/"],
    },
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_markdown(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routed here: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUICK_REFERENCE"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_recursive_agent_resources(task, profile_id: str | None = None):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task))
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_markdown(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    runtime_assets = list(RUNTIME_ASSETS["ALWAYS"])
    if profile_id in RUNTIME_ASSETS["PROFILE_RUNTIME"]:
        runtime_assets.extend(RUNTIME_ASSETS["PROFILE_RUNTIME"][profile_id])

    return {"intents": intents, "resources": loaded, "runtime_assets": runtime_assets}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Mode 1: Runtime Initialization

1. Confirm the spec folder, target path, execution mode, and active target profile.
2. Create `{spec_folder}/improvement/` plus the packet-local `candidates/`, `benchmark-runs/`, and `archive/` directories when needed.
3. Copy in the runtime config, charter, strategy, and manifest templates.
4. Record baseline state in the append-only ledger before the first candidate run.

### Mode 2: Proposal and Evaluation

1. Read the charter, manifest, target profile, and canonical target surface.
2. Run `scripts/scan-integration.cjs` to discover all surfaces the target agent touches.
3. Write exactly one bounded candidate under the packet-local `candidates/` directory.
4. Run `scripts/score-candidate.cjs` to compare the candidate to the baseline. Use `--dynamic` for 5-dimension scoring or `--profile` for legacy keyword checks.
5. Run `scripts/run-benchmark.cjs` to measure produced outputs against the active fixture set.
6. Append score and benchmark results to the packet-local ledger.
7. Run `scripts/reduce-state.cjs` to refresh the dashboard and experiment registry.

### 5-Dimension Evaluation Framework

When `--dynamic` is used, scoring evaluates five dimensions instead of keyword presence:

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (required sections present) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent, skills reference agent |
| Output Quality | 0.15 | Output verification items present, no placeholder content |
| System Fitness | 0.15 | Permission-capability alignment, resource references valid, frontmatter complete |

Dynamic profiles are generated on the fly from any agent file via `scripts/generate-profile.cjs`, eliminating the need for hardcoded target profiles.

### Mode 3: Promotion and Recovery

1. Promote only when prompt scoring, benchmark status, repeatability, manifest boundary, and approval gates all pass.
2. Use `scripts/promote-candidate.cjs` for guarded canonical mutation.
3. Use `scripts/rollback-candidate.cjs` plus direct comparison evidence when the canonical target must be restored.
4. Treat mirror drift as downstream packaging work and review it separately with `scripts/check-mirror-drift.cjs`.

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

- The loop stays proposal-first unless an explicit guarded promotion path is requested
- Benchmark evidence, prompt scoring, and mirror-sync evidence remain separate
- Reducer outputs make the best-known state, rejected runs, infrastructure failures, and stop conditions easy to review
- Operators can onboard a bounded target without weakening manifest or evaluator guardrails

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:rules -->
## 5. RULES

### ✅ ALWAYS

- Read the charter, manifest, and target profile before creating a candidate
- Keep the ledger append-only
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work

### ❌ NEVER

- Mutate the canonical target during proposal-only mode
- Broaden scope beyond the active manifest boundary
- Treat runtime mirrors as experiment truth in the same phase as canonical evaluation
- Hide rejected runs, weak benchmark results, or infra failures
- Promote non-canonical targets even if they benchmark well


--- improvement_config.json ---
{
  "target": ".opencode/agent/handover.md",
  "targetProfile": "handover",
  "targetKind": "canonical-agent",
  "maxIterations": 5,
  "maxCandidatesPerIteration": 1,
  "executionMode": "confirm",
  "proposalOnly": true,
  "promotionEnabled": false,
  "baselineRequired": true,
  "specFolder": "",
  "createdAt": "",
  "status": "initialized",
  "lineage": {
    "sessionId": "",
    "parentSessionId": null,
    "lineageMode": "new",
    "allowedModes": [
      "new",
      "resume",
      "restart",
      "fork"
    ],
    "generation": 1
  },
  "paths": {
    "runtimeRoot": "improvement",
    "stateLog": "improvement/agent-improvement-state.jsonl",
    "strategy": "improvement/agent-improvement-strategy.md",
    "dashboard": "improvement/agent-improvement-dashboard.md",
    "registry": "improvement/experiment-registry.json",
    "charter": "improvement/agent-improvement-charter.md",
    "manifest": "improvement/target-manifest.jsonc",
    "candidates": "improvement/candidates",
    "benchmarkRoot": "improvement/benchmark-runs",
    "targetProfiles": ".opencode/skill/sk-improve-agent/assets/target-profiles",
    "fixtureCatalog": ".opencode/skill/sk-improve-agent/assets/fixtures"
  },
  "targets": {
    "activeProfile": "handover",
    "supportedProfiles": [
      "handover",
      "context-prime"
    ],
    "promotionEligibleProfiles": [
      "handover"
    ]
  },
  "scoring": {
    "thresholdDelta": 2,
    "hardRejectOnMissingTemplate": true,
    "hardRejectOnNestedDelegation": true,
    "simplicityTieBreak": true,
    "dynamicProfileEnabled": true,
    "dimensionWeights": {
      "structural": 0.20,
      "ruleCoherence": 0.25,
      "integration": 0.25,
      "outputQuality": 0.15,
      "systemFitness": 0.15
    }
  },
  "benchmarks": {
    "requiredForProfiles": [
      "handover",
      "context-prime"
    ],
    "minimumAggregateScore": 85,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0
  },
  "stopRules": {
    "maxConsecutiveTies": 2,
    "maxInfraFailuresPerProfile": 2,
    "maxWeakBenchmarkRunsPerProfile": 2,
    "stopOnDriftAmbiguity": true,
    "stopOnDimensionPlateau": true,
    "plateauWindow": 3
  },
  "fileProtection": {
    "agent-improvement-config.json": "immutable",
    "agent-improvement-state.jsonl": "append-only",
    "agent-improvement-strategy.md": "mutable",
    "agent-improvement-dashboard.md": "auto-generated",
    "experiment-registry.json": "auto-generated",
    "candidates/*": "write-once",
    "benchmark-runs/*": "write-many-evidence",
    "agent-improvement-charter.md": "immutable",
    "target-manifest.jsonc": "immutable"
  }
}

--- improvement_strategy.md ---
---
title: Recursive Agent Strategy Template
description: Mutable runtime strategy template for agent-improver sessions.
---

# Recursive Agent Strategy

Mutable strategy template for a agent-improver run. Use it to capture the operator-owned goal and hypothesis while reserving the machine-owned sections for reducer updates after scoring and benchmarking.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides the working strategy file for a agent-improver run.

### Usage

Copy this file into the runtime area, fill the operator-owned fields before the run, and let the reducer update the machine-owned status sections after each score or benchmark cycle.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:operator-owned -->
## 2. OPERATOR-OWNED FIELDS

### Target

[Set during initialization]

### Target Profile

[handover, context-prime, or dynamic (any agent)]

### Goal

[What improvement should be tested]

### Constraints

- promotion allowed only for the single canonical handover target
- candidate-only targets must never be promoted
- runtime mirrors excluded from benchmark truth
- no promotion without explicit later-phase gate
- stop when no-go or repeatability rules fail

### Current Hypothesis

[Why the current baseline may be improvable]

### Candidate Focus

[What the next candidate should change]

### Benchmark Focus

[Which fixture behaviors are being improved or protected]

### Integration Focus

[Which integration dimensions need attention: mirror sync, command coverage, permission alignment, resource references]

---

<!-- /ANCHOR:operator-owned -->
<!-- ANCHOR:machine-owned -->
## 3. MACHINE-OWNED FIELDS

<!-- MACHINE-OWNED: START -->
### What Improved

[Reducer updates after scoring and benchmarking]

### Dimensional Scores

| Dimension | Latest | Best | Trend |
| --- | --- | --- | --- |
| Structural | - | - | - |
| Rule Coherence | - | - | - |
| Integration | - | - | - |
| Output Quality | - | - | - |
| System Fitness | - | - | - |

[Reducer populates this table after each scored iteration]

### What Failed

[Reducer updates after scoring and benchmarking]

### Best Known State

[Reducer names the current best state]

### Next Recommendation

[Reducer recommends continue, stop, or hold]

### Packaging Follow-Up

[Reducer records downstream mirror-sync or parity debt separately]
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:machine-owned -->
<!-- ANCHOR:related-resources -->
## 4. RELATED RESOURCES

- `improvement_charter.md`
- `../references/loop_protocol.md`
- `target_manifest.jsonc`

<!-- /ANCHOR:related-resources -->

--- improvement_charter.md ---
---
title: Recursive Agent Charter
description: Fixed policy charter for a agent-improver run.
---

# Recursive Agent Charter

Fixed policy template for a agent-improver run. Use it as the non-negotiable control layer that tells the mutator, scorer, reducer, and operator what kind of improvement workflow is allowed.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the fixed policy boundary for a agent-improver run.

### Usage

Copy this file into the packet-local runtime area and treat it as the stable policy layer for that run. Do not let the mutator rewrite the charter during proposal generation.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:mission -->
## 2. MISSION

Build a trustworthy improvement loop for agent surfaces by proving evaluation discipline before allowing self-editing. Evaluate agents holistically across their full integration surface — not just the prompt file, but the complete system of mirrors, commands, YAML workflows, skills, and gate routing that together define agent behavior.

---

<!-- /ANCHOR:mission -->
<!-- ANCHOR:targets -->
## 3. TARGETS

### Canonical Benchmark Seed

- canonical source under test: `.opencode/agent/handover.md`
- reason: structured prompt surface, narrow scope, clear downstream artifact contract

### Additional Bounded Target

- candidate-only source under test: `.opencode/agent/context-prime.md`
- reason: structured, read-only Prime Package contract with a smaller and safer output surface than broad orchestration agents

---

<!-- /ANCHOR:targets -->
<!-- ANCHOR:policy -->
## 4. POLICY

- proposal-only mode is mandatory
- the mutator and scorer are separate roles
- benchmark evidence is required for target profiles that declare fixtures
- all attempts are logged append-only
- runtime mirrors are downstream packaging surfaces, not benchmark truth
- human approval is required before any canonical promotion
- only the handover target is promotion-eligible in this packet
- evaluation uses 5 deterministic dimensions (structural integrity, rule coherence, integration consistency, output quality, system fitness) — each scored independently, weighted, and tracked per iteration

---

<!-- /ANCHOR:policy -->
<!-- ANCHOR:keep-discard -->
## 5. KEEP OR DISCARD RULE

- keep the baseline when the candidate is weaker, noisier, or broader
- keep the candidate only when it scores higher without violating policy
- prefer the simpler option on ties

---

<!-- /ANCHOR:keep-discard -->
<!-- ANCHOR:out-of-scope -->
## 6. OUT OF SCOPE

- multi-canonical promotion
- runtime-mirror mutation as experiment evidence
- open-ended multi-target rollout
- self-grading mutators

---

<!-- /ANCHOR:out-of-scope -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- `../references/promotion_rules.md`
- `../references/no_go_conditions.md`
- `target_manifest.jsonc`

<!-- /ANCHOR:related-resources -->

codex
I’ve confirmed the current `sk-improve-agent` runtime already has some implicit loop semantics: lineage modes, plateau stopping, append-only state, 5 weighted dimensions, and a reducer-driven “best known state.” What it does not yet have is the explicit truth-contract layer the Phase 005 spec is asking for, so the next pass is into the earlier 042 phases and any live code/docs where those contracts already exist in deep-research or deep-review.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "stop[- ]reason|session-ended|journal|jsonl|coverage graph|loop_type|parallel wave|weight optimizer|stability coefficient|trade-off|trajectory|plateau" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 .opencode/skill .opencode/command .opencode/agent | head -n 400' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/agent/deep-research.md:66:- `research/deep-research-state.jsonl` -- Understand iteration history
.opencode/agent/deep-research.md:168:Append ONE line to `research/deep-research-state.jsonl`:
.opencode/agent/deep-research.md:291:| State log | `research/deep-research-state.jsonl` | Read + Append |
.opencode/agent/deep-research.md:331:- Overwrite deep-research-state.jsonl (append-only)
.opencode/agent/deep-research.md:362:- research/deep-research-state.jsonl (appended)
.opencode/agent/deep-research.md:389:[x] deep-research-state.jsonl appended with iteration record
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:166:4. **Given** a candidate config improves convergence efficiency but harms accuracy, **when** rubric scoring runs, **then** the breakdown shows the trade-off explicitly instead of hiding it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:218:- A candidate improves convergence efficiency but harms finding accuracy. Promotion must reject that trade-off unless the rubric explicitly preserves overall quality.
.opencode/agent/ultra-think.md:166:3. Identify risks and trade-offs from YOUR perspective
.opencode/agent/ultra-think.md:254:- Ask: "Is this a real weakness or an intentional trade-off?"
.opencode/agent/ultra-think.md:274:| Contradictory approaches      | Present both to user with trade-off analysis     |
.opencode/agent/ultra-think.md:445:  - Present both solutions with full trade-off analysis
.opencode/agent/ultra-think.md:463:| **Convergence Sycophancy**   | All strategies artificially agree, masking real trade-offs | Run cross-critique (§6) when scores within 15 pts |
.opencode/agent/deep-review.md:63:- `review/deep-review-state.jsonl` -- Understand iteration history
.opencode/agent/deep-review.md:232:Append ONE line to `review/deep-review-state.jsonl`:
.opencode/agent/deep-review.md:364:| State log | `review/deep-review-state.jsonl` | Read + Append |
.opencode/agent/deep-review.md:384:- Only write to: `review/iterations/iteration-NNN.md`, `review/deep-review-strategy.md`, `review/deep-review-state.jsonl`
.opencode/agent/deep-review.md:451:9. Overwrite deep-review-state.jsonl (append-only)
.opencode/agent/deep-review.md:483:[x] deep-review-state.jsonl appended with exactly ONE record
.opencode/agent/deep-review.md:511:- review/deep-review-state.jsonl (appended)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:302:   170	    │  deep-research-state.jsonl      │
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:320:   188	Init --> Create config.json, strategy.md, state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:331:   199	  |                                         6. Append state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:583:45:- batch-phase-review-state.json, 026-graph-and-context-optimization/review/<phase-slug>, deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-dashboard.md, iteration-NNN.md, review-report.md, phasesCompleted 8/13
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:584:65:- extra stability passes, iteration-006..010, deep-review-state.jsonl append, deep-review-dashboard.md 10/10, deep-review-strategy.md max-iteration update, batch-phase-review-consolidated.md total iterations 83, no new findings
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:585:75:- batch-b, 006-010, deep-review-config.json maxIterations 10, deep-review-state.jsonl, iteration-006..010, deep-review-findings-registry.json convergenceScore 1.0, batch-phase-review-state.json, batch-phase-review-consolidated.md, total iterations 108
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:586:87:- required per-phase packet set under `review/<phase-slug>/`: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `review-report.md` [Task 1][Task 3][Task 4]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:594:649:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:663:    46	    "deep-review-state.jsonl": "append-only",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:978:.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1411:    54	 * @param {string} jsonlContent - Newline-delimited JSON string
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1414:    57	function parseJsonl(jsonlContent) {
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1417:    60	  for (const rawLine of jsonlContent.split('\n')) {
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1680:/bin/zsh -lc "printf 'JSONL files by packet family\\n'; find .opencode/specs/skilled-agent-orchestration -type f \\( -name '*.jsonl' -o -name '*.json' \\) | rg '/(028|040|042)-' | sort; printf '\\nIteration markdown counts by packet family\\n'; for fam in 028 040 042; do printf \"FAMILY %s\\n\" \""'$fam"; find .opencode/specs/skilled-agent-orchestration -type f -path "*${fam}-*/*iteration-*.md" | wc -l; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1701:.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1717:The first corpus inventory was too noisy because it pulled unrelated JSON from `external/` mirrors, so I’m tightening that to actual deep-loop runtime artifacts only: `deep-*-state.jsonl`, `findings-registry`, dashboards, and iteration folders. I’m also finishing the reducer read, because the optimizer’s real search space depends on what the reducer actually computes today versus what the phase spec assumes it can tune.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1880:   480	  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2051:/bin/zsh -lc "printf '040 state line count: '; wc -l .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl; printf '\\n040 iteration files: '; find .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations -type f -name 'iteration-*.md' | wc -l; printf '\\nRecent 040 state sample\\n'; nl -ba .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl | sed -n '1,20p'; printf '\\n... tail ...\\n'; nl -ba .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl | tail -n 20" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2053:040 state line count:       96 .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2102:/bin/zsh -lc 'for fam in 028 040 042; do echo "===== FAMILY $fam ====="; find .opencode/specs/skilled-agent-orchestration -type f '"\\( -path \"*"'${fam}-*/research/deep-research-state.jsonl" -o -path "*${fam}-*/review/deep-review-state.jsonl" -o -path "*${fam}-*/research/findings-registry.json" -o -path "*${fam}-*/review/deep-review-findings-registry.json" -o -path "*${fam}-*/research/deep-research-dashboard.md" -o -path "*${fam}-*/review/deep-review-dashboard.md" -o -path "*${fam}-*/research/iterations/iteration-*.md" -o -path "*${fam}-*/review/iterations/iteration-*.md" '"\\) | sort; echo; echo 'counts'; printf 'research state jsonl: '; find .opencode/specs/skilled-agent-orchestration -type f -path \"*"'${fam}-*/research/deep-research-state.jsonl" | wc -l; printf '"'review state jsonl: '; find .opencode/specs/skilled-agent-orchestration -type f -path \"*"'${fam}-*/review/deep-review-state.jsonl" | wc -l; printf '"'research iterations: '; find .opencode/specs/skilled-agent-orchestration -type f -path \"*"'${fam}-*/research/iterations/iteration-*.md" | wc -l; printf '"'review iterations: '; find .opencode/specs/skilled-agent-orchestration -type f -path \"*"'${fam}-*/review/iterations/iteration-*.md" | wc -l; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2105:.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2198:research state jsonl:        1
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2199:review state jsonl:        0
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2206:research state jsonl:        0
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:2207:review state jsonl:        0
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3558:/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json; do echo "===== $f ====="; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3678:===== .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:4599:    66	- `research/deep-research-state.jsonl` -- Understand iteration history
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:4701:   168	Append ONE line to `research/deep-research-state.jsonl`:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:4857:    63	- `review/deep-review-state.jsonl` -- Understand iteration history
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:5026:   232	Append ONE line to `review/deep-review-state.jsonl`:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:5435:   788	1. Read `deep-research-state.jsonl` and select review-mode iteration records in run order.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:5439:   792	5. Compare the replayed decision and stop reason to the recorded synthesis event.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:5452:   805	| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:5499:   852	- Replay validation must reproduce the same stop reason from JSONL state
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6196:p = Path('.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl')
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6522:    23	This packet converts the consolidated agentic-systems research into one implementation plan for the two autonomous deep-loop products: `sk-deep-research` and `sk-deep-review`. The work is centered on runtime truth, not feature sprawl: real stop reasons, legal completion gates, resume-from-run semantics, auditability, claim verification, behavior-first tests, and richer dashboards that make loop state easier to trust and resume.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6524:    25	**Key Decisions**: keep research and review as explicit products instead of collapsing them into a generic workflow DSL; make council synthesis and coordination-board support opt-in instead of default; treat journals, ledgers, and behavior tests as first-class runtime artifacts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6552:    53	The current deep-loop stack is functional, but it still treats "converged" as a mostly inferred state instead of a strongly explained runtime truth. Deep research and deep review already have JSONL state, dashboards, and reducer/parity coverage, yet the consolidated research shows clear gaps around stop-reason taxonomy, legal done gates, resume/start-from behavior, research claim verification, audit trails, richer dashboards, behavior-first test coverage, and large-run coordination.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6568:    69	- Real completion-gate planning for both deep-loop products, including named stop reasons, binary done checks, and resume-from-run semantics.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6571:    72	- Append-only audit-journal planning for both loops.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6594:    95	| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add the new completion-gate contract, ledger/journal behavior, optional council mode, and updated testing/runtime expectations. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6595:    96	| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, and resume-from-run lifecycle steps. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6596:    97	| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define stop-reason taxonomy, binary done gate, liveness, blocked-stop handling, and semantic convergence signals. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6597:    98	| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6599:   100	| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and optional-mode configuration keys. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6602:   103	| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Extend reducer outputs for delta replay, snapshot/compaction, dashboard metrics, observability rollups, ledger rollups, journal rollups, and resume/stop metadata. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6603:   104	| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Add the real done-gate contract, journal behavior, richer dashboard expectations, and behavior-test posture. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6604:   105	| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6605:   106	| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define stop-reason taxonomy, all-dimensions-clean semantics, liveness, blocked-stop handling, and semantic convergence signals. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6606:   107	| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, replay snapshots, observability events, decomposition metadata, time/token metrics, and coverage depth. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6608:   109	| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Make stop reasons, typed stop-decision events, done-gate conditions, reducer-owned machine sections, dashboard metrics, and audit-journal outputs canonical. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6609:   110	| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and resume cursor fields. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6610:   111	| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6628:   129	| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6629:   130	| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6642:   143	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Extend reducer coverage for journal, ledger, stop-reason, delta replay, snapshot/compaction, semantic convergence, and dashboard observability metrics. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6643:   144	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | Modify | Extend schema/contract coverage for stop reasons, journals, reducer-owned machine sections, snapshot/compaction, observability metrics, decomposition metadata, and resume cursor fields. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6646:   147	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6647:   148	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6660:   161	| REQ-001 | Both deep-loop products MUST use a shared named stop-reason taxonomy: `max_iterations`, `converged`, `all_dimensions_clean`, `insufficient_evidence`, `user_stopped`, and `error_budget_exhausted`. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy; any legacy stop labels are either removed or mapped into this taxonomy. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6663:   164	| REQ-004 | Both loops MUST produce append-only audit journals that capture file reads, searches, evidence extraction, focus/dimension rotation decisions, and convergence-calculation inputs. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6665:   166	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6671:   172	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6673:   174	| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6677:   178	| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6678:   179	| REQ-014 | Shared loop-runtime changes MUST preserve packet-local, explicit deep-loop products and avoid introducing a hidden generic DSL or non-auditable state channel. | The implementation plan keeps reducers, journals, ledgers, and dashboards explicit inside the research/review packets; shared helpers may be extracted, but domain-specific artifacts and LEAF semantics remain visible and testable. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:467-471`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6691:   192	- **SC-001**: The packet defines a single shared stop-reason taxonomy and legal done-gate model for both deep research and deep review.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6709:   210	1. **Given** either loop finishes, **When** an operator opens the dashboard or synthesis output, **Then** the packet shows a named stop reason from the shared taxonomy.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6809:    89	  -> add journals, snapshot/compaction, reducer durability, observability rollups, and decomposition scaffolding
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6894:   174	- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6965:.opencode/skill/sk-deep-research/references/state_format.md:495:1. Read `deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md` as canonical inputs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7062:/bin/zsh -lc "python3 -c \"import json,collections,pathlib; p=pathlib.Path('.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl'); records=[json.loads(line) for line in p.read_text().splitlines() if line.strip()]; iters=[r for r in records if r.get('type')=='iteration']; tracks=collections.Counter(r.get('focusTrack','<none>') for r in iters); status=collections.Counter(r.get('status','<none>') for r in iters); answered=sum(len(r.get('answeredQuestions',[])) for r in iters); ruled=sum(len(r.get('ruledOut',[])) for r in iters); ratios=[r.get('newInfoRatio',0) for r in iters]; print('iterations',len(iters)); print('statuses',dict(status)); print('tracks',dict(tracks)); print('unique_tracks',len(tracks)); print('answered_questions_total',answered); print('ruled_out_total',ruled); print('avg_newInfoRatio',round(sum(ratios)/len(ratios),3)); print('min_ratio',min(ratios)); print('max_ratio',max(ratios));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7096:.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7244:    49	- State ledger: `research/deep-research-state.jsonl`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7420:   480	  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7471:   232	Append ONE line to `review/deep-review-state.jsonl`:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7541:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:89:  -> add journals, snapshot/compaction, reducer durability, observability rollups, and decomposition scaffolding
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7551:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:174:- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7565:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:230:- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7566:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:231:- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7578:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:297:| Behavioral | Research/review runtime behavior, stop reasons, journals, snapshots, replay corpus, observability, decomposition, and semantic convergence | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7581:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:306:| Review all-dimensions-clean path | Prove review can stop only after dimension coverage and quality gates pass | JSONL stop reason, dashboard coverage section, behavior test fixture |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7583:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:309:| Audit-journal path | Prove reads/searches/evidence extraction and convergence math are recorded append-only | Journal artifact plus reducer summary |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7593:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:341:  2. Roll back stop/journal/ledger changes by feature group, not as a single monolith, so trusted baseline behavior can be restored incrementally.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7643:.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/019-plateau-detection.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7754:    41	      expect(content, `${docPath} should mention the canonical state log`).toContain('deep-review-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7766:    53	      expect(content, `${docPath} should read the canonical state log`).toContain('review/deep-review-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7775:    62	        'review/deep-research-state.jsonl',
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7789:    76	      expect(content, `${docPath} should write the canonical state log`).toContain('review/deep-review-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7797:    84	        'scratch/deep-research-state.jsonl',
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7806:    93	        'review/deep-research-state.jsonl',
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7869:    48	    expect(contract.contract.outputs.jsonl.pathPattern).toContain('deep-review-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7895:    74	        '"{spec_folder}/review/deep-review-state.jsonl"',
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8000:    67	    path.join(specFolder, 'research', 'deep-research-state.jsonl'),
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8206:    52	      expect(content, `${docPath} should mention the canonical state log`).toContain('deep-research-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8218:    64	      expect(content, `${docPath} should read the canonical state log`).toContain('research/deep-research-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8727:    48	    expect(contract.contract.outputs.jsonl.pathPattern).toContain('deep-review-state.jsonl');
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8753:    74	        '"{spec_folder}/review/deep-review-state.jsonl"',
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8912:- The `040` ledger already carries some learnable metadata: `focusTrack`, answered questions, ruled-out directions, sources, and durations [deep-research-state.jsonl](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl#L2), [deep-research-state.jsonl](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl#L96), [deep-research agent](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L171).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:9018:- The `040` ledger already carries some learnable metadata: `focusTrack`, answered questions, ruled-out directions, sources, and durations [deep-research-state.jsonl](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl#L2), [deep-research-state.jsonl](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-state.jsonl#L96), [deep-research agent](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L171).
.opencode/command/improve/agent.md:201:6. Reduces evidence into a dimensional dashboard with plateau detection
.opencode/command/improve/agent.md:202:7. Stops when improvement plateaus, max iterations reached, or operator decides
.opencode/command/improve/agent.md:285:7. Check stop conditions (plateau, max iterations, infra failure)
.opencode/command/improve/agent.md:299:- Plateau: `STATUS=OK REASON="all_dimensions_plateaued"`
.opencode/command/improve/agent.md:352:Stop Reason: All dimensions plateaued after 3 iterations
.opencode/command/improve/agent.md:359:STATUS=OK ITERATIONS=3 BEST_SCORE=97 REASON="all_dimensions_plateaued"
.opencode/command/improve/agent.md:369:- **Stop rules**: Loop stops on dimension plateau (3+ identical scores), max iterations, or infra failure threshold.
.opencode/command/spec_kit/plan.md:337:| 2 | Beyond Local Max?  | >=2 alternatives with trade-offs           |
.opencode/command/improve/README.txt:216:When max iterations is reached, all 5 dimensions plateau (3+ identical scores), infra failures exceed threshold, or the reducer signals shouldStop.
.opencode/command/improve/README.txt:234:| All dimensions plateaued | Loop exhausted current hypothesis | Update `improvement_strategy.md` and restart |
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:16:  tracking: append_only_jsonl_ledger
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:24:    all dimensions plateau (3+ identical scores), infra failures exceed threshold, or reducer signals shouldStop.
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:105:  state_log: "{spec_folder}/improvement/agent-improvement-state.jsonl"
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:146:        action: "Append a baseline record for {target_path} into agent-improvement-state.jsonl"
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:175:        action: "Append prompt-score and benchmark records into agent-improvement-state.jsonl"
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:197:        description: "Present final dashboard with per-dimension trends and stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81:  state_log: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:120:          - "{spec_folder}/research/state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:126:          append_jsonl: '{"type":"event","event":"migration","legacyPath":"{legacy_path}","canonicalPath":"{canonical_path}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:132:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:180:        output: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:221:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:280:          - reason: "Human-readable stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:317:              State Log: {spec_folder}/research/deep-research-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:349:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:359:          append_jsonl: '{"type":"iteration","run":{current_iteration},"status":"error","focus":"{next_focus}","findingsCount":0,"newInfoRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:364:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:393:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:408:          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:444:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:484:        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:518:    - overwrite_jsonl_state_log
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:528:      - "git add {spec_folder}/research/iterations/iteration-{NNN}.md {spec_folder}/research/deep-research-state.jsonl {spec_folder}/research/deep-research-strategy.md {spec_folder}/research/research.md"
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:16:  tracking: append_only_jsonl_ledger
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:22:    Stops when: max iterations reached, all dimensions plateau (3+ identical scores),
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:99:  state_log: "{spec_folder}/improvement/agent-improvement-state.jsonl"
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:130:        action: "Append a baseline record for {target_path} into agent-improvement-state.jsonl"
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:151:        action: "Append prompt-score and benchmark records into agent-improvement-state.jsonl"
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:156:        description: "Evaluate stop conditions: dimension plateau, infra failure, weak benchmarks, max iterations"
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:163:        description: "Present final dashboard with per-dimension trends and stop reason"
.opencode/command/spec_kit/complete.md:442:| 2 | Beyond Local Max? | Explored alternatives? | >=2 alternatives with trade-offs |
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:81:  state_log: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:120:          - "{spec_folder}/research/state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:126:          append_jsonl: '{"type":"event","event":"migration","legacyPath":"{legacy_path}","canonicalPath":"{canonical_path}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:132:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:179:        output: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:241:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:300:          - reason: "Human-readable stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:360:              State Log: {spec_folder}/research/deep-research-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:392:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:434:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:466:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:481:          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:540:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:600:        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:616:      - "git add {spec_folder}/research/iterations/iteration-{NNN}.md {spec_folder}/research/deep-research-state.jsonl {spec_folder}/research/deep-research-strategy.md {spec_folder}/research/research.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:646:    - overwrite_jsonl_state_log
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:85:  state_log: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:122:            - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:127:            - "{spec_folder}/scratch/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:136:            - "scratch/deep-research-config.json declares mode == 'review' OR scratch/deep-research-state.jsonl contains mode == 'review'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:139:          - "{spec_folder}/scratch/deep-research-state.jsonl -> {spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:155:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:260:        output: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:327:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:392:          - reason: "Human-readable stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:472:              State Log: {spec_folder}/review/deep-review-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:489:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:517:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:556:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:631:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:642:          - reason: "Use the latest stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:747:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:814:        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:831:      - "git add {spec_folder}/review/iterations/iteration-{NNN}.md {spec_folder}/review/deep-review-state.jsonl {spec_folder}/review/deep-review-findings-registry.json {spec_folder}/review/deep-review-strategy.md {spec_folder}/review/review-report.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:889:    - overwrite_jsonl_state_log
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:85:  state_log: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:122:            - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:127:            - "{spec_folder}/scratch/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:136:            - "scratch/deep-research-config.json declares mode == 'review' OR scratch/deep-research-state.jsonl contains mode == 'review'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:139:          - "{spec_folder}/scratch/deep-research-state.jsonl -> {spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:261:        output: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:303:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:368:          - reason: "Human-readable stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:425:              State Log: {spec_folder}/review/deep-review-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:442:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:455:          append_jsonl: '{"type":"iteration","run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:471:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:480:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:556:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:567:          - reason: "Use the latest stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:648:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:690:        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:728:    - overwrite_jsonl_state_log
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:740:      - "git add {spec_folder}/review/iterations/iteration-{NNN}.md {spec_folder}/review/deep-review-state.jsonl {spec_folder}/review/deep-review-findings-registry.json {spec_folder}/review/deep-review-strategy.md {spec_folder}/review/review-report.md"
.opencode/skill/cli-claude-code/README.md:74:| **Extended Thinking** | Deep chain-of-thought reasoning via `--effort high` with Opus for complex trade-off analysis |
.opencode/skill/cli-claude-code/README.md:134:Extended thinking is the headline capability. When Opus receives a complex prompt with `--effort high`, it generates an internal chain-of-thought before responding. This matters for architecture trade-off analysis, root cause debugging, and multi-dimensional decision-making where surface-level pattern matching falls short. The reasoning is not just longer responses. It is a fundamentally different processing mode that considers alternatives, backtracks, and synthesizes before committing to an answer.
.opencode/skill/cli-claude-code/README.md:242:claude -p "Analyze the trade-offs between microservices and monolith for this project. \
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/decision-record.md:21:**Context**: The agent-improver agent is deliberately proposal-only (LEAF constraint). Adding journal emission could blur this boundary.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/decision-record.md:30:**Context**: Phase 2 built a coverage graph in `deep-loop-graph.sqlite`. Agent-improver needs similar mutation tracking.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/decision-record.md:31:**Decision**: Reuse the same SQLite database with `loop_type: "improvement"` namespace. Node kinds: dimension, mutation_type, integration_surface, candidate.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/decision-record.md:41:**Consequences**: Richer convergence model than simple score plateau. Enables trade-off detection.
.opencode/skill/cli-claude-code/SKILL.md:125:    "DEEP_REASONING":    {"weight": 4, "keywords": ["reason", "think", "analyze", "trade-off", "architecture", "extended thinking", "chain-of-thought"]},
.opencode/skill/cli-claude-code/SKILL.md:348:claude -p "Analyze the trade-offs between microservices and monolith for this project. Consider scalability, team size, deployment complexity." \
.opencode/skill/cli-claude-code/assets/prompt_templates.md:153:claude -p "Analyze trade-offs between [option A] and [option B] for [context]. Evaluate across: [dimensions]. Recommend with confidence level and reasoning." \
.opencode/skill/cli-claude-code/assets/prompt_templates.md:160:claude -p "Analyze trade-offs between microservices and modular monolith for our e-commerce platform. Evaluate across: scalability, team autonomy, operational complexity, data consistency, deployment speed, debugging difficulty. Recommend with confidence level and reasoning." \
.opencode/skill/cli-claude-code/references/integration_patterns.md:88:claude -p "We need to choose between event sourcing and CRUD for order management. Analyze trade-offs across: data consistency, query performance, team learning curve, operational complexity, and future scalability. Recommend with confidence level." \
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:3:description: "Transfer the proven deep-loop runtime truth contracts from 042 Phases 1-4 to the sk-improve-agent skill, adding stop-reason taxonomy, audit journaling, mutation coverage tracking, trade-off detection, optional parallel candidates, and scoring weight optimization."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:8:  - "improvement journal"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:10:  - "trade-off detection"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:24:The sk-improve-agent skill runs bounded improvement loops over agent packets, but it currently lacks the runtime truth infrastructure proven in 042 Phases 1-4 for deep-research and deep-review. This phase ports those contracts into agent-improver: a well-formed stop-reason taxonomy, legal-stop gates, audit journaling, mutation coverage tracking, dimension trajectory analysis, trade-off detection, optional parallel candidate waves, and scoring weight optimization based on session history.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:26:**Key Decisions**: emit journal events in the orchestrator (not in the proposal-only agent); reuse the existing coverage graph infrastructure with an improvement-specific namespace; treat dimension trajectory as a first-class convergence signal; keep parallel candidate waves opt-in behind an exploration-breadth gate.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:28:**Critical Dependencies**: 042 Phase 1 runtime truth foundation (stop-reason taxonomy, event journal schema); 042 Phase 2 semantic coverage graph (reused with `loop_type: "improvement"`); existing sk-improve-agent 5-dimension scoring and packet-local candidate generation discipline.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:54:The sk-improve-agent skill runs bounded improvement loops that surface no reliable stop-reason, leave no audit trail, do not track which mutation dimensions have been explored, and cannot detect when one dimension improves at the cost of another. Sessions are opaque, non-resumable, and produce no data that could inform future scoring weight calibration. The 042 bundle already solved these problems for deep-research and deep-review, but agent-improver was left behind.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:69:- Audit journal (`improvement-journal.jsonl`) capturing all session events
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:71:- Mutation coverage graph tracking explored dimensions, tried mutations, and integration surfaces
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:72:- Dimension trajectory tracking (per-dimension score trends across iterations)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:76:- Candidate lineage graph for parallel waves
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:77:- Scoring weight optimizer using historical session data
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:93:| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | Add stop-reason taxonomy, journal protocol, coverage graph, trajectory, trade-off, parallel wave, and weight-optimizer sections |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:94:| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Modify | Add config fields for journal path, coverage graph path, wave activation gate, weight optimizer settings (all optional with defaults) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:95:| `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md` | Modify | Add mutation exhaustion guidance, trajectory-based convergence criteria, trade-off resolution guidance |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:97:| `.opencode/agent/agent-improver.md` | Modify | Add journal emission protocol, legal-stop gate checks, coverage graph update calls |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:98:| `.opencode/command/improve/agent.md` | Modify | Add resume semantics, session-id propagation, weight optimizer invocation |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:99:| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Create | Append-only JSONL event emitter for improvement session events |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:101:| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Create | Cross-dimension regression detector using trajectory data |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:104:| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts` | Create | Tests for journal emit, append-only enforcement, event schema |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:105:| `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts` | Create | Tests for coverage graph read/write and namespace isolation |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:106:| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` | Create | Tests for regression detection and threshold configuration |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:120:| REQ-AI-001 | Stop-reason taxonomy: `converged`, `promoted`, `rolledBack`, `maxIterationsReached`, `regressionDetected`, `manualStop`, `error` | Every session termination emits exactly one stop-reason matching the taxonomy; no session ends without a logged stop-reason |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:122:| REQ-AI-003 | Resume/continuation semantics for improvement sessions | A session started with a prior session-id replays journal state and resumes from the last checkpoint without repeating completed iterations |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:123:| REQ-AI-004 | Audit journal (`improvement-journal.jsonl`) capturing all events (iteration-started, candidate-proposed, candidate-evaluated, promotion-gate-checked, session-ended) | All five event types appear in the journal for every completed session; file is append-only and survives process restart |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:130:| REQ-AI-006 | Mutation coverage graph tracking explored dimensions, tried mutations, and integration surfaces using `loop_type: "improvement"` namespace | After each iteration the coverage graph is updated; querying it returns accurate explored/remaining sets per dimension |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:131:| REQ-AI-007 | Dimension trajectory tracking (per-dimension score history across iterations) | For each active session the trajectory file contains a time-ordered score vector per dimension; minimum 3 data points before convergence can be claimed |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:132:| REQ-AI-008 | Trade-off detection flagging when dimension A improves by >threshold while dimension B regresses by >threshold | The detector emits a `trade-off-detected` event to the journal whenever thresholds are crossed; thresholds are configurable |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:133:| REQ-AI-009 | Exhausted-mutations log preventing redundant exploration | The coverage graph writer records exhausted mutation types per dimension; the orchestrator skips mutation types already in the exhausted log |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:146:| REQ-AI-012 | Scoring weight optimizer using historical session data to recommend per-dimension weight adjustments | After a configurable number of sessions the optimizer reads the journal history and emits a weight-recommendation report; recommendations do not auto-apply without explicit approval |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:147:| REQ-AI-013 | Benchmark replay stability measurement confirming consistent scores across identical replays | The benchmark-stability script reports a stability coefficient for each dimension; sessions with coefficient below threshold emit a `stabilityWarning` to the journal |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:155:- **SC-001**: Every improvement session termination produces a journal entry with exactly one stop-reason from the approved taxonomy.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:158:- **SC-004**: The mutation coverage graph accurately reflects explored and remaining mutation space after each iteration.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:161:- **SC-007**: The scoring weight optimizer produces a recommendation report after the configured session count threshold is reached.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:173:| Dependency | 042 Phase 1 journal schema | Journal emit contract must be compatible | Use same event schema from Phase 1; document any improvement-specific extensions |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:174:| Dependency | 042 Phase 2 coverage graph | Coverage graph namespace and API must support `loop_type: "improvement"` | Add namespace field to existing graph writers; verify no breaking change to deep-research/review paths |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:175:| Dependency | sk-improve-agent proposal-only constraint | Orchestrator must own journal emission; agent must not write state | ADR-001 enforces this; enforce via code review gate |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:176:| Risk | Trajectory-based convergence false positives | Session terminates too early on noisy score data | Require minimum 3 trajectory data points before convergence claim (REQ-AI-007) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:177:| Risk | Parallel wave complexity overloading LLM context | Parallel waves increase context length per session | Keep parallel waves strictly opt-in; default config disables them |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:207:- Session with zero completed iterations hitting `maxIterationsReached`: emit stop-reason with 0-iteration count and empty trajectory.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:217:- All dimensions improving simultaneously: no trade-off event emitted; this is the ideal case.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:218:- Threshold set to 0.0: every score change triggers trade-off detection; document this footgun in config comments.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:222:- Parallel wave with 2 candidates where both produce regressions: select the least-regressive candidate; emit `regressionDetected` stop-reason if neither exceeds baseline.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:223:- Wave executor unavailable: fall back to single-wave behavior silently; emit a `parallelWaveFallback` journal event.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:231:| Scope | 20/25 | Files: 16, LOC estimate: ~700, Systems: sk-improve-agent + coverage graph + journal |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:234:| Multi-Agent | 10/15 | Orchestrator + proposal-only agent + journal emit separation |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:235:| Coordination | 10/15 | Dependencies on 042 Phase 1 journal schema and Phase 2 graph API |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:244:| R-001 | Proposal-only constraint violated if journal emit moves into agent | High | Low | ADR-001; orchestrator-only journal write enforced via code review |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:245:| R-002 | Coverage graph namespace collision with deep-research/review paths | Medium | Low | `loop_type: "improvement"` namespace isolation; tested in mutation-coverage.vitest.ts |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:256:**As a** developer running an agent improvement session, **I want** every session to produce a structured audit journal, **so that** I can reconstruct exactly what mutations were tried, how they scored, and why the session stopped.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:259:1. Given a completed improvement session, When I read the journal file, Then it contains at least one event per iteration plus a session-ended event with a stop-reason.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:260:2. Given a session that terminated due to a regression, When I read the journal, Then the stop-reason is `regressionDetected` and the offending dimension scores are recorded.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:269:1. Given a session-id from a prior partial run, When I start a new session with that id, Then the orchestrator replays journal state and the iteration counter starts where the prior run left off.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:270:2. Given a resumed session, When it completes, Then the final journal contains events from both the prior run and the resumed run in chronological order.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:276:**As a** developer reviewing improvement results, **I want** the system to flag when one dimension improves at the cost of another, **so that** I can make an informed decision about whether to accept the trade-off.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:279:1. Given a candidate where clarity improves by 0.15 and integration regresses by 0.12 (above default threshold), When the trade-off detector runs, Then a `trade-off-detected` event appears in the journal with both dimensions named.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:280:2. Given thresholds configured at 0.20, When both deltas are below 0.20, Then no trade-off event is emitted.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:289:1. Given all mutation types for a dimension marked exhausted, When the orchestrator selects the next mutation, Then it skips exhausted types and annotates the journal with the exhausted-mutations set.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:299:1. Given the configured session count threshold is reached, When the weight optimizer runs, Then it emits a weight-recommendation report showing current vs. recommended weights with supporting evidence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:309:1. Given a benchmark replayed 3 times with identical input, When stability is measured, Then the script reports a stability coefficient per dimension.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:310:2. Given a coefficient below the configured threshold, When the session runs, Then a `stabilityWarning` event appears in the journal.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:317:- Should the improvement journal share the same file path convention as the deep-research/deep-review journals, or use a separate directory under the skill? Recommendation: use a skill-local path (`~/.agent-improver/sessions/{session-id}/`) consistent with the packet-local discipline.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:318:- What is the correct exploration-breadth score formula for the parallel wave activation gate? The 042 Phase 3 wave executor provides a reference; align or adapt?
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:319:- Should the weight optimizer write its recommendations into the journal or into a separate report file? Separate file is cleaner for human review; journal entry for machine auditability.
.opencode/skill/cli-claude-code/references/cli_reference.md:211:| **Opus** | `claude-opus-4-6` | Deepest reasoning, highest quality | Highest | Architecture decisions, complex trade-offs, extended thinking |
.opencode/skill/cli-claude-code/references/cli_reference.md:218:Is the task complex (architecture, trade-offs, multi-step reasoning)?
.opencode/skill/cli-claude-code/references/claude_tools.md:43:- Complex trade-off analysis across multiple dimensions
.opencode/skill/cli-claude-code/references/claude_tools.md:56:claude -p "Analyze the trade-offs of our current caching strategy" \
.opencode/skill/cli-claude-code/references/claude_tools.md:66:**Compared to other CLIs:** Gemini CLI and Codex CLI have reasoning capabilities, but Claude's extended thinking produces explicit, visible chain-of-thought that is especially strong for multi-dimensional trade-off analysis.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:3:description: "4-sub-phase plan porting 042 runtime truth contracts to sk-improve-agent: stop-reason taxonomy, audit journal, mutation coverage graph, trade-off detection, optional parallel candidate waves, and scoring weight optimization."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:7:  - "improvement journal implementation"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:29:| **Storage** | JSONL files (journal, ledger), JSON files (coverage graph, lineage, trajectory) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:34:This plan ports the runtime truth infrastructure proven in 042 Phases 1-4 into the sk-improve-agent skill across four sub-phases. Sub-phase 5a delivers the core runtime contracts (stop-reason taxonomy, legal-stop gates, audit journal, hypothesis ledger). Sub-phase 5b adds improvement intelligence (mutation coverage graph, dimension trajectory, trade-off detection, exhausted-mutations log). Sub-phase 5c adds optional parallel candidate waves and candidate lineage. Sub-phase 5d adds scoring weight optimization and benchmark replay stability. All new config fields are optional with defaults, preserving backward compatibility.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:44:- [ ] 042 Phase 1 journal schema confirmed and compatible with improvement events
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:45:- [ ] 042 Phase 2 coverage graph API confirmed to support `loop_type` namespace parameter
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:66:Event-sourced improvement loop with packet-local append-only state. The orchestrator owns all state writes; the proposal-only agent remains read-only relative to journals and graphs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:70:- **improvement-journal.cjs**: Append-only JSONL emitter. Receives structured event objects from the orchestrator and appends them to the session journal file. Enforces the event schema and blocks invalid event types.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:71:- **mutation-coverage.cjs**: Coverage graph reader/writer. Tracks explored dimensions, tried mutation types per dimension, integration surfaces touched, and exhausted mutation sets. Uses `loop_type: "improvement"` namespace to isolate from deep-research/review paths.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:72:- **trade-off-detector.cjs**: Reads the current dimension trajectory and compares per-dimension deltas against configured thresholds. Emits a structured trade-off report when thresholds are crossed; used by the orchestrator to decide whether to journal a `trade-off-detected` event.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:73:- **candidate-lineage.cjs**: Builds and queries a directed graph of candidate proposals across parallel wave sessions. Links each node to its parent session-id, wave index, and spawning mutation type.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:74:- **benchmark-stability.cjs**: Accepts a benchmark result set from multiple replays of identical input, computes per-dimension stability coefficients, and emits a stability report. Stability coefficient is defined as 1 - (stddev / mean) per dimension.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:78:Orchestrator receives improvement session trigger → reads prior journal (if resume) → enters iteration loop → calls agent-improver (proposal-only) → evaluates candidate using 5-dimension scoring → calls trade-off-detector → appends events to journal via improvement-journal.cjs → updates mutation-coverage.cjs → checks legal-stop gates → emits stop-reason and session-ended event → optionally triggers benchmark-stability.cjs post-session → optionally triggers weight optimizer (separate invocation).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:88:Deliver the core runtime contracts: stop-reason taxonomy, legal-stop gates, resume semantics, audit journal, and hypothesis verification ledger. This sub-phase maps directly to 042 Phase 1 but is adapted for improvement loop semantics (e.g., `promoted` and `rolledBack` replace deep-research `synthesized` states).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:90:- [ ] Define stop-reason taxonomy in SKILL.md (REQ-AI-001)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:93:- [ ] Create `improvement-journal.cjs` with append-only JSONL emit (REQ-AI-004)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:94:- [ ] Create hypothesis verification ledger schema and writer in journal script (REQ-AI-005)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:97:- [ ] Write `improvement-journal.vitest.ts` test suite
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:99:- [ ] Manual integration test: run a session and confirm journal output
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:103:Add mutation coverage tracking, dimension trajectory, trade-off detection, and exhausted-mutations logging. Reuses the Phase 2 coverage graph infrastructure via namespace isolation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:105:- [ ] Create `mutation-coverage.cjs` with `loop_type: "improvement"` namespace (REQ-AI-006)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:106:- [ ] Implement dimension trajectory writer and reader (REQ-AI-007)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:107:- [ ] Create `trade-off-detector.cjs` with configurable thresholds (REQ-AI-008)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:109:- [ ] Update improvement_strategy.md with trajectory-based convergence criteria
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:110:- [ ] Update improvement_config.json with coverage graph path and trade-off thresholds
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:111:- [ ] Write `mutation-coverage.vitest.ts` and `trade-off-detector.vitest.ts` test suites
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:112:- [ ] Manual integration test: run 3-iteration session and inspect coverage graph
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:119:- [ ] Implement parallel wave orchestration branch in agent-improver.md (REQ-AI-010)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:126:Add scoring weight optimizer using historical session data and benchmark replay stability measurement.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:128:- [ ] Create `benchmark-stability.cjs` with stability coefficient computation (REQ-AI-013)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:129:- [ ] Implement weight optimizer read-and-recommend logic (REQ-AI-012) — recommendation only, no auto-apply
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:130:- [ ] Update SKILL.md with weight optimizer invocation guidance
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:142:| Unit | All 5 new CJS scripts: event schema validation, graph read/write, trade-off thresholds, lineage linkage, stability coefficient math | Vitest |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:143:| Integration | Orchestrator loop with journal emit, coverage graph update, legal-stop gate | Manual session run + journal inspection |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:156:| 042 Phase 1 journal schema | Internal | Green | Cannot finalize journal event types without schema contract |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:157:| 042 Phase 2 coverage graph API | Internal | Green | Must confirm `loop_type` param support before mutation-coverage.cjs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:187:| 5b Improvement Intelligence | 5a (journal, coverage graph pattern) | 5d |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:188:| 5c Parallel Candidates | 5a (journal emit protocol) | None |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:189:| 5d Scoring Optimization | 5a (journal history), 5b (trajectory data) | None |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:214:- [ ] Confirm 042 Phase 1 journal schema version pinned
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:215:- [ ] Confirm coverage graph `loop_type` namespace does not collide with existing namespaces
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:227:- **Reversal procedure**: JSONL journal files and coverage graph files are new additions with no schema migration; deleting them fully reverts to pre-phase state
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:238:│ - journal.cjs    │     │ - mutation-coverage.cjs│     │ - benchmark-stability.cjs│
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:239:│ - stop-reasons   │     │ - trade-off-detector   │     │ - weight optimizer       │
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:240:│ - legal-stop     │     │ - trajectory tracking  │     └──────────────────────────┘
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:256:| 5a Runtime Truth | 042 Phase 1 schema | journal.cjs, stop-reason taxonomy, resume protocol | 5b, 5c, 5d |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:257:| 5b Improvement Intel | 5a (journal emit) | mutation-coverage.cjs, trade-off-detector.cjs, trajectory files | 5d |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:258:| 5c Parallel Cand | 5a (journal emit) | candidate-lineage.cjs, wave orchestration branch | None |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:259:| 5d Scoring Opt | 5a (journal history), 5b (trajectory) | benchmark-stability.cjs, weight optimizer report | None |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:285:| M1 | 5a Complete | Journal emits stop-reason events; legal-stop gates pass; resume works | End of sub-phase 5a |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:286:| M2 | 5b Complete | Coverage graph, trajectory, trade-off detector all passing tests | End of sub-phase 5b |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:288:| M4 | 5d Complete | Weight optimizer report produced; benchmark stability coefficients computed | End of sub-phase 5d |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:302:**Decision**: All journal write operations are performed by the orchestrator, not the agent, to preserve the proposal-only constraint on agent-improver.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:308:**Decision**: Reuse the existing 042 Phase 2 coverage graph infrastructure with `loop_type: "improvement"` namespace isolation rather than building a separate graph system.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:314:**Decision**: Treat dimension trajectory (per-dimension score history) as a first-class convergence signal, requiring minimum 3 data points before convergence can be claimed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:38:- [ ] CHK-003 [P0] 042 Phase 1 journal schema read and confirmed compatible with improvement events
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:39:- [ ] CHK-004 [P0] 042 Phase 2 coverage graph API confirmed to support `loop_type` namespace parameter
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:49:- [ ] CHK-010 [P0] All 5 new CJS scripts (`improvement-journal.cjs`, `mutation-coverage.cjs`, `trade-off-detector.cjs`, `candidate-lineage.cjs`, `benchmark-stability.cjs`) follow existing sk-improve-agent script module pattern
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:51:- [ ] CHK-012 [P0] Journal emitter enforces append-only discipline: no overwrite code path exists in improvement-journal.cjs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:54:- [ ] CHK-015 [P1] Coverage graph writer uses `loop_type: "improvement"` namespace on all write operations; no cross-contamination with deep-research/review namespaces
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:63:- [ ] CHK-020 [P0] `improvement-journal.vitest.ts` passes: event emit, append-only enforcement, invalid event rejection, resume journal read, session-ended schema
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:64:- [ ] CHK-021 [P0] `mutation-coverage.vitest.ts` passes: namespace isolation, round-trip read/write, exhausted-mutations marking, trajectory minimum data-point enforcement
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:65:- [ ] CHK-022 [P0] `trade-off-detector.vitest.ts` passes: threshold crossing detection, no-event-when-below-threshold, configurable thresholds, empty trajectory handling
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:67:- [ ] CHK-024 [P0] `benchmark-stability.vitest.ts` passes: stability coefficient math (perfect = 1.0), warning threshold triggering, weight recommendation report format
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:69:- [ ] CHK-026 [P1] Manual integration test: run a complete improvement session and confirm journal file contains all required event types
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:72:- [ ] CHK-029 [P2] Benchmark stability replay test: replay identical benchmark input 3 times; confirm stability coefficients are reported and consistent
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:82:- [ ] CHK-032 [P1] Coverage graph file paths validated before read/write: no arbitrary filesystem access via loop_type parameter
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:90:- [ ] CHK-040 [P0] SKILL.md updated with stop-reason taxonomy, journal protocol, coverage graph, trajectory, trade-off, parallel wave, and weight optimizer sections
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:92:- [ ] CHK-042 [P0] improvement_strategy.md updated with trajectory-based convergence criteria and trade-off resolution guidance
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:93:- [ ] CHK-043 [P1] agent-improver.md updated with legal-stop gate protocol and parallel wave orchestration branch
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:94:- [ ] CHK-044 [P1] agent.md command updated with resume/session-id semantics and weight optimizer invocation guidance
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:129:- [ ] CHK-100 [P0] ADR-001 (journal emission in orchestrator) documented in decision-record.md and enforced: no journal write calls exist inside the agent-improver proposal agent
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:130:- [ ] CHK-101 [P0] ADR-002 (coverage graph namespace reuse) documented: `loop_type: "improvement"` confirmed in mutation-coverage.cjs; no separate graph infrastructure created
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:131:- [ ] CHK-102 [P1] ADR-003 (trajectory as convergence signal) documented: minimum 3 data-point requirement enforced in mutation-coverage.cjs and SKILL.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:163:- [ ] CHK-131 [P1] Append-only journal discipline verified: no code path in improvement-journal.cjs opens files in overwrite mode
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:7:  - "improvement journal tasks"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:39:*Delivers: stop-reason taxonomy, legal-stop gates, resume semantics, audit journal, hypothesis verification ledger.*
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:42:- [ ] T002 Read 042 Phase 1 journal schema from `../001-runtime-truth-foundation/` to confirm event type contract before writing journal script
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:43:- [ ] T003 Add stop-reason taxonomy section to SKILL.md: define `converged`, `promoted`, `rolledBack`, `maxIterationsReached`, `regressionDetected`, `manualStop`, `error` with trigger conditions (`.opencode/skill/sk-improve-agent/SKILL.md`) (REQ-AI-001)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:45:- [ ] T005 Add resume/continuation semantics to agent.md command: session-id parameter, journal replay on resume, iteration counter carry-over (`.opencode/command/improve/agent.md`) (REQ-AI-003)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:46:- [ ] T006 Create `improvement-journal.cjs`: append-only JSONL emitter with event schema validation for `iteration-started`, `candidate-proposed`, `candidate-evaluated`, `promotion-gate-checked`, `trade-off-detected`, `session-ended` event types (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-004)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:47:- [ ] T007 Add hypothesis verification ledger schema to `improvement-journal.cjs`: `mutation-proposed` and `mutation-outcome` event types capturing proposed mutation, accepted/rejected status, rejection reason, and scored dimensions (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-005)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:48:- [ ] T008 Update improvement_charter.md: add audit trail obligations section specifying that the orchestrator must emit journal events at each iteration boundary (`.opencode/skill/sk-improve-agent/assets/improvement_charter.md`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:49:- [ ] T009 Update improvement_config.json: add optional `journal.path`, `journal.sessionId`, `sessionResume.enabled` fields with documented defaults (`.opencode/skill/sk-improve-agent/assets/improvement_config.json`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:50:- [ ] T010 Write `improvement-journal.vitest.ts`: test event emit, append-only enforcement (second write appends not overwrites), invalid event type rejection, resume journal read, session-ended event schema (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:58:*Delivers: mutation coverage graph, dimension trajectory tracking, trade-off detection, exhausted-mutations log.*
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:59:*Depends on: T006 (journal emit for trade-off events).*
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:61:- [ ] T011 [P] Read 042 Phase 2 coverage graph API from `../002-semantic-coverage-graph/` to confirm `loop_type` namespace parameter support before implementing mutation-coverage.cjs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:62:- [ ] T012 Create `mutation-coverage.cjs`: coverage graph reader/writer with `loop_type: "improvement"` namespace; tracks explored dimensions, tried mutation types per dimension, integration surfaces, exhausted mutation sets (`.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs`) (REQ-AI-006, REQ-AI-009)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:63:- [ ] T013 Add dimension trajectory writer to `mutation-coverage.cjs` or as a co-located module: time-ordered score vector per dimension, enforces minimum 3 data points before convergence claim (REQ-AI-007)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:64:- [ ] T014 Create `trade-off-detector.cjs`: reads current trajectory, computes per-dimension deltas, compares against configurable thresholds, returns structured trade-off report (`.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`) (REQ-AI-008)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:65:- [ ] T015 Update improvement_strategy.md: add trajectory-based convergence criteria (minimum 3 data points, stabilization threshold), mutation exhaustion guidance (skip exhausted types, annotate journal), trade-off resolution guidance (`.opencode/skill/sk-improve-agent/assets/improvement_strategy.md`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:66:- [ ] T016 Update improvement_config.json: add optional `coverageGraph.path`, `trajectory.minDataPoints`, `tradeOff.thresholds` config block with documented defaults (`.opencode/skill/sk-improve-agent/assets/improvement_config.json`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:67:- [ ] T017 Write `mutation-coverage.vitest.ts`: test namespace isolation, graph read/write round-trip, exhausted-mutations marking, trajectory append and minimum data-point enforcement (`.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:68:- [ ] T018 Write `trade-off-detector.vitest.ts`: test threshold crossing detection, no-event-when-below-threshold, configurable threshold values, empty trajectory handling (`.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:77:*Depends on: T006 (journal emit); T003 (SKILL.md updated).*
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:80:- [ ] T019 [P] Create `candidate-lineage.cjs`: directed graph of candidate proposals across parallel wave sessions; each node stores session-id, wave-index, spawning mutation type, and parent node reference (`.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs`) (REQ-AI-011)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:81:- [ ] T020 [P] Add parallel wave orchestration branch to agent-improver.md: activation check against `parallelWaves.enabled` and `explorationBreadthScore >= activationThreshold`; spawn 2-3 candidates with different strategies; merge results by selecting highest non-regressive score (`.opencode/agent/agent-improver.md`) (REQ-AI-010)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:92:*Delivers: scoring weight optimizer (recommendation only), benchmark replay stability measurement.*
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:93:*Depends on: T006 (journal history), T013 (trajectory data).*

Research-only pass for Phase 005. I’m structuring this like a 10-iteration deep-research run: current-state extraction, predecessor-contract extraction, then per-aspect synthesis and final prioritization.
  ✓ Read current sk-improve-agent runtime docs and scripts to extract implicit loop behavior
  → Read 042 Phases 1-4 contracts and live deep-research/deep-review runtime surfaces
  • Map findings into 10 iteration topics with concrete file-level recommendations
  • Cross-check recommendations against current agent-improver constraints and existing code patterns
  • Produce final priority-ordered synthesis with per-iteration outputs
codex
I’ve got enough of the current agent-improver surface to start contrasting it with the 042 contracts. This next pass is where the research gets sharper: I’m reading the exact Phase 1-4 artifacts and the live deep-research/deep-review protocol files they were meant to shape, so each recommendation can point to a real pattern that already exists somewhere in the repo.
exec
/bin/zsh -lc 'for d in 001-runtime-truth-foundation 002-semantic-coverage-graph 003-wave-executor 004-offline-loop-optimizer; do base=.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/$d; echo "===== $d spec anchors ====="; rg -n "stop-reason|legal stop|resume|journal|ledger|coverage graph|loop_type|wave|parallel|optimizer|weight|stability|trade-off|trajectory|convergence|replay" "$base"/{spec.md,plan.md,decision-record.md,implementation-summary.md,checklist.md} 2>/dev/null | head -n 120; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== 001-runtime-truth-foundation spec anchors =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:34:- [x] CHK-001 [P0] REQ-001 stop contract is documented consistently across both loop products with `stopReason`, `legalStop`, and a legacy mapping table [EVIDENCE: exact artifact paths and JSON field names for `stopReason`, `legalStop.blockedBy`, `legalStop.gateResults`, `legalStop.replayInputs`, plus convergence-doc mapping table] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:35:- [x] CHK-002 [P0] REQ-002a legal-stop gate design requires convergence, coverage, and quality gates to pass together [EVIDENCE: workflow/state excerpts showing the combined gate bundle rather than scalar-only STOP] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:36:- [x] CHK-003 [P0] REQ-002b blocked-stop persistence and replay are first-class contracts [EVIDENCE: workflow steps and fixture outputs showing a persisted blocked-stop event with reason, gate results, and recovery path rather than silent termination] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:37:- [x] CHK-004 [P0] REQ-003 `continuedFromRun` semantics are defined consistently for both active resume and completed-continue flows [EVIDENCE: command/state excerpts naming `continuedFromRun` or equivalent cursor fields across both continuation modes] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:47:- [x] CHK-010 [P0] REQ-004 audit journals are separate packet-local append-only artifacts in both loop contracts [EVIDENCE: journal path, append-only rules, JSONL/event-stream separation, and reducer/dashboard references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:48:- [x] CHK-011 [P0] REQ-005 claim-verification ledger is defined with `verified`, `contradicted`, and `unresolved` statuses [EVIDENCE: ledger schema/path and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-reducer.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:50:- [x] CHK-013 [P1] REQ-015 delta replay plus periodic snapshot/compaction is defined for both loops [EVIDENCE: snapshot artifact path, compaction trigger policy, and replay-equivalence statement] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:65:- [x] CHK-026 [P1] REQ-018 semantic convergence participates in typed stop-decision traces instead of scalar-only thresholds [EVIDENCE: semantic novelty, contradiction density, citation-overlap fields, and blocked-stop examples] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`; `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:73:- [x] CHK-030 [P0] REQ-002a, REQ-002b, and REQ-014 keep STOP legality, blocked-stop persistence, and state truth explicit enough to avoid hidden runtime state or non-auditable termination behavior [EVIDENCE: explicit stop-gate, blocked-stop artifact, and packet-local replay rules] [TESTS: behavior and parity suites]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:3:description: "Deep-loop runtime contracts, stop-reason taxonomy, legal-stop gates, resume semantics, journals, dashboards, and behavior-first test coverage for sk-deep-research and sk-deep-review."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:9:  - "legal stop"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:35:Deep research and deep review now have explicit, auditable runtime truth. Every loop stop reports a named reason from a shared taxonomy, every stop decision passes through a legal-stop gate that checks convergence, coverage, and quality together, and every session carries a resume cursor that makes continuation deterministic rather than inferred.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:39:Both deep-loop products share a typed stop-reason taxonomy with named reasons (`converged`, `max_iterations`, `blocked`, `user_stop`, `error`). The legal-stop gate bundles convergence, coverage, and quality checks into a single binary decision. Blocked-stop events persist with gate results and recovery paths rather than silently terminating. The stop contract uses `stopReason`, `legalStop.blockedBy`, `legalStop.gateResults`, and `legalStop.replayInputs` fields.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:43:Sessions now carry `continuedFromRun` semantics that work for both active resume (loop was blocked and continues) and completed-continue (loop finished and a new session extends the prior work). This lineage is explicit in commands, workflows, state contracts, and agent instructions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:47:Separate append-only journal artifacts track lifecycle events, stop decisions, and recovery actions. Dashboard upgrades expose timing/tool/token histograms, state diffs, anomaly flags, convergence trends, and stop-decision drill-down. Reducer snapshot/compaction ensures durability for 100+ iteration packets with delta replay and periodic snapshot equivalence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:59:Behavioral test suites cover lifecycle, blocked-stop, replay, resume, compaction equivalence, and semantic convergence scenarios for both loops. Contract parity tests enforce alignment across commands, skills, agents, and runtime mirrors.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:77:| Shared stop-reason taxonomy across both loops | One auditable vocabulary without pretending research and review are the same workflow (ADR-001) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:78:| Legal-stop gate bundles convergence + coverage + quality | Prevents premature STOP when only one metric is favorable (ADR-001) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:79:| Claim-verification ledger uses JSONL canonical storage | Append-only, replayable, and machine-parseable without adding a database dependency (ADR-002) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:82:| Journals and ledgers stay separate append-only artifacts | Separation preserves clear lifecycle boundaries and replay independence (ADR-010) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:84:| Semantic convergence uses typed decision traces | Makes stop decisions explainable and auditable rather than hidden in scalar thresholds (ADR-008) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:95:| Legal-stop gate requires convergence + coverage + quality together | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:97:| `continuedFromRun` semantics for active resume and completed-continue | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:99:| Semantic convergence participates in typed stop-decision traces | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:103:| Behavioral tests cover lifecycle, blocked-stop, replay, resume | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md:112:1. **Phase 4b replay fixtures do not yet exist.** Deterministic replay gating for production promotion remains advisory-only until replay fixtures from Phase 1 traces are generated.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:8:  - "claim ledger"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:33:We need a runtime answer to "why did this loop stop?" that works across both deep research and deep review. Right now stop behavior is partly implied by convergence math, partly spread across workflow steps, and not strong enough for recovery, dashboards, or user trust.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:42:**We chose**: a shared named stop-reason taxonomy plus a separate legal done gate.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:52:| Separate taxonomies for research and review | Preserves product differences | Harder parity and resume behavior, more operator confusion | 5/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:59:- Dashboards, synthesis, and journals can report a single reason vocabulary.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:60:- Blocked-stop cases become explicit instead of hidden in convergence math.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:63:- We need synchronized changes across commands, assets, agents, and tests. Mitigation: make parity tests part of the same wave.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:87:- Reducer/test surfaces learn blocked-stop reporting and resume-safe stop metadata.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:106:Research packets need a durable way to show whether major claims were verified, contradicted, or left unresolved. A ledger must be machine-friendly enough for reducers and synthesis, but still readable in packet outputs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:110:- The ledger must be append-friendly and packet-local.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:115:**We chose**: JSONL as the canonical ledger format, with rendered markdown summaries in synthesis/dashboard outputs when needed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:117:**How it works**: The runtime writes structured ledger entries as JSONL so reducers and tests can reason over them. Research synthesis can then summarize those entries in human-readable tables or narrative sections without making markdown the source of truth.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:133:- Research summaries can cite the ledger without becoming hand-maintained ledgers themselves.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:159:- Research state docs, reducer logic, and synthesis contracts define the ledger path and entry schema.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:162:**How to roll back**: Remove the JSONL ledger artifact and revert synthesis/dashboard references to the prior citation-only model.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:189:**How it works**: Reducers compute metrics from JSONL, journals, ledgers, and strategy/config files. Generated markdown remains the human-facing dashboard, while machine-readable sources stay authoritative underneath.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:254:- We need optional perspective isolation without creating a separate parallel product.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:394:The research pass found that deep-research still reparses full iteration markdown and rewrites derived artifacts on each reducer run, which will degrade badly on 100+ iteration packets. We need a durability strategy that keeps append-only truth while making replay and reducer regeneration affordable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:398:- The authoritative lineage must remain packet-local and replayable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:403:**We chose**: delta replay plus periodic packet snapshots and compaction, with compaction triggered by explicit thresholds such as run count or JSONL size.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:405:**How it works**: Append-only events remain canonical. Reducers consume only the latest delta after a trusted snapshot, while replay validation confirms that post-compaction outputs match a full replay. Trigger policy stays configurable so we can tune by run count, JSONL size, or both without changing the contract.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:411:| **Delta replay + periodic snapshots/compaction** | Preserves lineage truth, scales long packets, supports replay validation | Adds snapshot lifecycle and equivalence testing | 9/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:412:| Full replay on every reducer run | Simplest conceptual model | Degrades with packet size, expensive for 100+ iterations | 4/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:413:| Keep only latest reduced state, drop historical replay | Fast reducer path | Breaks auditability and replay confidence | 3/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:424:- Snapshot lifecycle, equivalence checks, and compaction triggers must be documented and tested together. Mitigation: make replay validation part of the compaction contract.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:430:| Compaction accidentally drops recoverable lineage detail | High | Keep append-only truth canonical and block compaction finalization until replay equivalence passes. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:437:| 2 | **Beyond Local Maxima?** | PASS | We compared full replay and reduced-state-only shortcuts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:438:| 3 | **Sufficient?** | PASS | Delta replay plus snapshots covers scale without sacrificing packet-local truth. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:447:- Config/state docs, reducer logic, dashboards, and workflow assets define snapshot metadata, compaction triggers, and replay validation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:448:- Reducer/schema tests add equivalence coverage for invalid-state, resume, completed-continue, and compaction cases.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:450:**How to roll back**: Disable snapshot/compaction triggers, restore full replay, and remove compaction-specific test and dashboard surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:465:The original packet placed behavior-first testing after most runtime changes. The research pass found that this leaves early contract work underprotected, especially for replay, invalid-state handling, blocked-stop behavior, and reducer durability.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:474:**We chose**: start behavior/replay harness work immediately after Phase 1 contracts stabilize, and keep it running ahead of later substrate and trust-surface changes.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:476:**How it works**: Phase 3 begins once the typed event schema exists. Thin replay fixtures and end-to-end harnesses are added early, then expanded as Phase 2a and 2b land. Parity alignment remains later, but it inherits a tested contract instead of defining one by prose alone.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:482:| **Move behavior/replay harnesses earlier** | Protects contract work, catches substrate drift sooner, supports replay corpus growth | Requires parallel coordination with active runtime changes | 9/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:483:| Keep behavior tests after most runtime work | Simpler sequencing | Leaves early contracts unguarded and delays replay confidence | 4/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:484:| Rely on parity/schema tests only | Fastest to wire | Misses runtime behavior and replay regressions | 5/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:511:| 5 | **Open Horizons?** | PASS | Replay corpora can later feed offline optimizer work. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:518:- The plan and tasks move replay corpus and behavioral harness creation ahead of parity lock.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:519:- Behavioral suites gain invalid-state, resume, completed-continue, blocked-stop, and compaction-equivalence fixtures before optional-mode coverage expands.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:536:Current convergence is stronger than threshold-only math, but it is still mostly statistical plus coverage-based. The research pass showed that large packets need semantic novelty, contradiction density, and citation overlap to explain why the workflow decided to stop or continue.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:540:- The result must stay packet-local and replayable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:553:| **Typed semantic decision trace** | Auditable, replayable, good debugging surface, supports future tuning | More schema fields and dashboard sections to maintain | 9/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:554:| Scalar-only convergence score | Compact and easy to compare | Hides why STOP happened and why it was blocked | 4/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:555:| Human-written semantic notes only | Flexible prose | Not machine-checkable, weak for replay and testing | 5/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:582:| 5 | **Open Horizons?** | PASS | Typed traces can later feed offline optimizer work. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:618:**How it works**: Recovery escalates through five bounded tiers: query reformulation, authority/source diversification, decomposition or clustering, contradiction-resolution/adjudication, and graceful partial closeout. Each tier records why it was selected, what changed, and whether it helped so later replay or offline tuning can learn from it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:624:| **Five-tier recovery ladder with provenance** | Clear escalation path, auditable, replay-friendly, useful for later tuning | More structured recovery events to maintain | 9/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:637:- More recovery metadata in journals and dashboards. Mitigation: keep the first ladder compact and packet-local.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:653:| 5 | **Open Horizons?** | PASS | Provenance can later feed offline compiler/optimizer work. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:660:- Loop protocol, state schema, journals, dashboards, and behavioral fixtures define the five recovery tiers and their provenance fields.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:679:This packet now needs both provenance-oriented journals and verification-oriented ledgers. They are related, but they serve different access patterns and lifecycle needs. If we overload the iteration JSONL stream or hide them inside a hand-edited strategy document, replay, auditing, and reducer ownership all become less clear.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:683:- Journals and ledgers must stay packet-local and append-only.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:689:**We chose**: journals and ledgers are separate packet-local append-only files, not embedded in iteration JSONL.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:697:| **Separate packet-local append-only journals and ledgers** | Clean separation of concerns, clearer replay, better reducer ownership, easier audit access patterns | Adds two explicit artifact contracts to maintain | 9/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:698:| Embed journals and ledgers in iteration JSONL | Single file surface | Overloads the event stream, blurs artifact purpose, harder replay and tooling ergonomics | 4/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:699:| Embed journals and ledgers in a hand-edited strategy document | Human-visible location | Not append-only, conflicts with reducer-owned sections, weak machine contract | 3/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:701:**Why this one**: JSONL should stay focused on iteration events. Provenance concerns and verification-state concerns need different append-only artifacts so replay and auditability stay explicit.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:706:- Packet replay can reason about iteration events, provenance, and verification state separately.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:707:- Reducer ownership stays clearer because journals and ledgers no longer compete with hand-edited strategy sections.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:725:| 4 | **Fits Goal?** | PASS | Runtime truth depends on clear artifact ownership and replayable state. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:726:| 5 | **Open Horizons?** | PASS | Separate artifacts leave room for richer dashboards and replay tooling later. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:733:- State-format, loop-protocol, reducer, and dashboard docs define journals and ledgers as separate packet-local append-only artifacts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:734:- Behavioral and parity coverage assert that iteration JSONL remains focused on iteration events while journals and ledgers own their respective concerns.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:34:This implementation plan ships the deep-loop improvements in five phases. The sequence now incorporates the new research-driven gaps around snapshot/compaction durability, packet-local observability, large-target decomposition, semantic convergence, deep-review reducer ownership, and upfront agent-instruction cleanup. Phase 2 is split into `2a` and `2b`, while behavior/replay verification moves forward so it can protect contract work soon after the shared runtime foundation lands.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:57:- [x] Journals, dashboards, observability surfaces, and claim-ledger artifacts are defined and behavior-tested where applicable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:58:- [x] Snapshot/compaction, replay validation, and large-target decomposition rules are designed before optional advanced modes begin.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:59:- [x] Semantic convergence and reducer-owned machine-section boundaries are documented across both loop products.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:88:  -> define typed stop-decision events, legal done gates, blocked-stop persistence, resume cursor, and replayable lineage schema
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:91:  -> add separate journal artifacts, snapshot/compaction, reducer durability, observability rollups, and decomposition scaffolding
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:94:  -> add claim ledger, ledger transition rules, publication critique, promotion checkpoints, semantic convergence, and reducer-owned review machine sections
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:97:  -> start thin lifecycle/blocked-stop/replay harnesses immediately after the Phase 1 lock
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:98:  -> then expand into reducer/schema extensions, semantic convergence, and wider integration fixtures
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:118:**Why first**: Every later improvement depends on a trusted answer to four questions: why did the loop stop, was STOP legal, where can a session resume, and can the stop decision be replayed from packet-local state. The agent instructions also need to stop fighting the reducer contract before broader runtime work begins.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:123:- `.opencode/skill/sk-deep-research/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:128:- `.opencode/skill/sk-deep-review/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:146:- Add fixture-based cases that prove blocked-stop behavior and replayable stop-decision logging when convergence math passes but quality gates fail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:153:**Why second**: Separate journal artifacts, compaction, observability, and large-target decomposition all build on the Phase 1 event schema and need to exist before trust surfaces or optional modes can be trusted at scale. Journals land here as their own packet-local append-only files; ledgers stay deferred to Phase 2b.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:178:- Reducer fixtures prove separate append-only journal artifacts, journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:186:**Why third**: Once the substrate is durable and observable, we can safely layer the trust surfaces that decide what evidence is promoted, how ledger transitions work, what convergence means semantically, and which sections stay machine-owned.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:190:- `.opencode/skill/sk-deep-research/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:196:- `.opencode/skill/sk-deep-review/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:212:- Semantic convergence fixtures assert novelty, contradiction density, and citation overlap participate in typed stop-decision traces instead of scalar-only thresholds.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:219:**Why now**: This phase starts immediately after the Phase 1 lock so replay harnesses can protect substrate and trust-surface work while those phases are still being implemented. The first fixture slice stays narrow on lifecycle, blocked-stop, and replay before it expands into semantic convergence and richer trust-surface scenarios.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:226:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:227:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:228:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:233:- Create thin end-to-end harnesses first for invalid-state, active resume, completed-continue, blocked-stop, and compaction-equivalence replay.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:234:- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:235:- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:241:**Why after early verification**: Once the foundational and trust contracts have replay-backed coverage, parity and mirror alignment can move as one bounded follow-on without guessing at unstable interim surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:262:- Operator-facing command examples should remain compact while replay, observability, and advanced modes are discoverable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:301:| Behavioral | Research/review runtime behavior, stop reasons, journals, snapshots, replay corpus, observability, decomposition, and semantic convergence | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:302:| Integration | Auto and confirm YAML flows across resume/blocked-stop/optional-mode scenarios | Workflow fixtures plus targeted `pnpm vitest` integration cases added in this packet's implementation phase |

===== 002-semantic-coverage-graph spec anchors =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:3:description: "Deliver the deep-loop coverage graph substrate by extracting shared graph primitives, adding dedicated storage and MCP tools, and wiring graph-backed convergence into deep research and deep review."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:7:  - "semantic coverage graph"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:9:  - "deep_loop_graph_convergence"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:36:This phase is a concrete build plan, not a moonshot placeholder. We already know which graph primitives exist, how they map to coverage semantics, which tables are required, what the MCP tools need to do, and how graph convergence must interact with Phase 001 runtime truth. Research findings also show that reuse is narrower than first estimated, so the plan now makes adaptation work explicit instead of treating it as incidental. The sequence is:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:42:5. Wire reducer ingestion, fallback behavior, weight calibration, and convergence decisions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:53:- [x] Parent packet 042 is in place and defines why semantic convergence matters.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:56:- [x] Research and review relation maps and initial weight estimates are fixed enough to start calibration work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:65:- [x] The reducer/MCP contract is defined explicitly, including payload shape, authority order, latency budget, and replay behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:66:- [x] `reduce-state.cjs` ingests `graphEvents`, performs MCP upsert/convergence when available, recalibrates inherited weights for coverage semantics, and preserves local fallback behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:67:- [x] Deep-research and deep-review references and agent prompts document graph event emission and graph-aware convergence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:68:- [x] The five named test files cover core logic, signals, convergence, DB behavior, and tool behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:84:- **Coverage graph signals**: reusable signal computations for degree, depth, momentum, and higher-level convergence inputs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:86:- **Coverage graph convergence**: loop-type-aware decision helper that computes graph metrics and produces typed blocker traces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:97:| `lib/storage/causal-edges.ts` | Edge insertion/update/delete, weight clamping, self-loop prevention, BFS traversal, cumulative path strength | `coverage-graph-core.cjs` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:109:  -> deep_loop_graph_convergence returns decision + blockers + trace
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:111:  -> status/convergence summaries feed dashboards and synthesis outputs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:131:- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:135:- Map existing memory relations to research/review relation enums inside the coverage layer, but treat current weight values as provisional inputs to later calibration.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:146:- `coverage-graph-convergence.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:171:- Targeted signal and convergence tests against persisted graph fixtures
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:178:**Goal**: Surface the coverage graph through four stable MCP tools on the existing Spec Kit Memory MCP server.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:184:- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:190:- `deep_loop_graph_convergence` must return a typed `decision`, `signals`, `blockers`, and `trace`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:212:1. Define the reducer/MCP contract: payload shape, sync-vs-async behavior, latency budget, authority order, and replay semantics.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:213:2. Calibrate coverage-specific edge weights against reducer outputs and convergence behavior instead of blindly inheriting memory-causal values.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:216:- Start from authoritative JSONL replay and reducer-local graph rebuild, then mirror into MCP projection state when available.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:218:- Upsert graph nodes/edges before computing final convergence, but fall back to reducer-local state whenever MCP exceeds the defined latency budget or is unavailable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:219:- Merge graph convergence with the Phase 001 `shouldContinue` decision instead of bypassing it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:221:- Record calibrated relation weights and guard thresholds as implementation outputs of this phase, not post-hoc tuning work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:225:- Reducer can persist graph state, read graph convergence, and explain STOP blockers with graph context.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:226:- Fallback path is explicit, replay-safe, and ordered `JSONL -> local JSON -> SQLite projection`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:230:- Named coverage-graph convergence/tool suites
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:237:**Goal**: Make graph events and graph-aware convergence part of the human- and agent-facing loop contract.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:241:- `.opencode/skill/sk-deep-research/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:243:- `.opencode/skill/sk-deep-review/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:258:- Contract sanity checks through the named convergence/tool suites
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:268:| Unit | Edge manager behavior, traversal, signal math, contradiction handling, convergence helpers | `coverage-graph-core.vitest.ts`, `coverage-graph-signals.vitest.ts`, `coverage-graph-convergence.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:270:| MCP Tool | Input validation, query dispatch, status output, and convergence output contracts | `coverage-graph-tools.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:283:| Phase `001-runtime-truth-foundation` | Internal | Green | Graph convergence would have no legal stop-decision envelope to extend. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:304:- **Trigger**: Graph extraction breaks existing graph behavior, or graph convergence produces incorrect legal STOP decisions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:307:  2. Revert reducer convergence back to Phase 001 scalar-only behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md:308:  3. Leave the dedicated graph store and extracted helper files isolated until behavior is corrected and replay-tested.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:3:description: "Coverage-graph substrate for deep-loop convergence: 4 CJS shared libraries, dedicated SQLite database, 4 MCP tools, reducer integration seam, and 101 graph tests."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:7:  - "semantic coverage graph"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:9:  - "coverage graph"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:35:Semantic convergence now has a concrete graph substrate. Deep research and deep review can track coverage gaps, contradictions, provenance chains, and unverified claims through a dedicated SQLite database and four MCP tools, all backed by shared CJS libraries extracted from the existing Spec Kit Memory graph infrastructure.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:39:Four CommonJS shared libraries were extracted and adapted from existing graph modules: `coverage-graph-core.cjs` (edge management, weight clamping, self-loop prevention, provenance traversal), `coverage-graph-signals.cjs` (degree, depth, momentum, cluster metrics), `coverage-graph-contradictions.cjs` (CONTRADICTS-edge scanning, contradiction-pair reporting), and `coverage-graph-convergence.cjs` (graph-aware convergence helpers combining graph signals with Phase 001 stop-trace inputs). Reuse posture was 35-45% direct, 25-30% adapted, with the remainder genuinely new loop semantics.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:43:A dedicated `deep-loop-graph.sqlite` database stores coverage nodes, edges, and snapshots with schema versioning, migrations, indexes, and namespace isolation by `spec_folder + loop_type + session_id`. Research and review ontologies maintain separate relation maps and weight estimates.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47:Four MCP handlers were added to the existing Spec Kit Memory server: `deep_loop_graph_upsert` (idempotent node/edge creation with self-loop rejection and clamped weights), `deep_loop_graph_query` (structured queries for uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps, and hot nodes), `deep_loop_graph_status` (grouped counts and signal values), and `deep_loop_graph_convergence` (blockers and typed decision traces).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:51:The reducer/MCP contract defines explicit payload inputs/outputs, latency budget, replay semantics, and fallback behavior. The reducer parses iteration `graphEvents`, normalizes payloads, and calls `deep_loop_graph_upsert`. Convergence decisions merge graph blockers into `shouldContinue` with a local JSON graph fallback when MCP is unavailable. The fallback authority chain is `JSONL -> local JSON graph -> SQLite projection`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:55:Both deep-loop agent prompts now emit structured graph events (research: question, finding, claim, source; review: dimension, file, finding, evidence, remediation). Contract docs define the `graphEvents` JSONL format and graph-aware convergence model for each loop.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:63:Implementation proceeded through 5 sub-phases: extract graph primitives, build coverage graph database, add MCP tools, define reducer/MCP contract and integrate reducer, and agent/convergence integration. 25 files were touched (17 new), adding approximately 5,200 lines. 101 tests cover edge management, signals, graph-aware convergence, MCP DB behavior, and tool integration.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:73:| Reuse-first extraction from existing graph modules | Avoids greenfield duplication while acknowledging that reducer/convergence work is not plug-and-play |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:74:| Dedicated `deep-loop-graph.sqlite` rather than sharing the memory graph DB | Keeps coverage graph namespace-isolated and independently evolvable |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:76:| Explicit reducer/MCP contract with latency budget | Prevents silent timeouts from degrading convergence decisions |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:78:| Coverage-specific weight calibration | Inherited memory weights replaced by coverage-aware values before convergence is finalized |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:88:| Edge management, signals, and convergence unit tests | PASS (101 tests) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:89:| MCP DB schema behavior and upsert/query/status/convergence tools | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:102:2. **Weight calibration uses initial estimates.** Coverage-specific edge weights are set with initial calibration values; real calibration data from production runs will refine them.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:3:description: "Define the coverage-graph substrate for deep research and deep review by extracting reusable graph primitives from the Spec Kit Memory MCP server and applying them to deep-loop convergence."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:6:  - "semantic coverage graph"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:8:  - "deep_loop_graph_convergence"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:22:Phase 002 turns semantic convergence from an abstract idea into a concrete implementation plan. The coverage graph is the fourth graph system in the existing Spec Kit Memory stack, following the causal graph, the code structural graph, and the graph-signal layer already present under `.opencode/skill/system-spec-kit/mcp_server/`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:24:The design target is explicit reuse, not greenfield invention. Research findings revise the reuse estimate to roughly 35-45% direct reuse, 25-30% adapted reuse, and the remainder genuinely new loop semantics. Edge management from `causal-edges.ts`, degree/depth metrics from `graph-signals.ts`, contradiction-reporting patterns from `contradiction-detection.ts`, and SQLite setup patterns from `code-graph-db.ts` transfer well, but contradiction adjudication, convergence design, and reducer/MCP integration are not plug-and-play. Phase 001 remains the legal stop-decision foundation. Phase 002 adds graph context so low novelty only permits STOP when coverage, verification, and contradiction state agree.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:40:| **Successor** | `../003-wave-executor/spec.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:41:| **Handoff Criteria** | Phase 003 can consume graph-backed coverage, contradiction, provenance, and convergence signals without introducing a second graph model. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:47:**Role in Packet 042**: Phase 001 established legal stop reasons, typed convergence traces, and reducer ownership. Phase 002 adds the semantic substrate needed to explain whether the loop has actually covered the problem space. Phase 003 depends on this phase to drive wave and segment decisions. Phase 004 depends on the persisted graph and snapshots for offline optimization and replay analysis.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:55:- Shared coverage-graph CommonJS helpers for edge management, signals, contradictions, and convergence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:57:- Four new `deep_loop_graph_*` MCP tools on the existing Spec Kit Memory MCP server: `upsert`, `query`, `status`, and `convergence`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:58:- Reducer integration that defines the reducer/MCP seam explicitly, writes graph deltas after each iteration, and queries graph-aware convergence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:76:This is not a missing-technology problem. The existing Spec Kit Memory MCP server already contains mature graph patterns for typed weighted edges, breadth-first traversal, contradiction detection, degree and depth signals, historical momentum, and SQLite-backed graph storage. What is missing is a loop-native graph ontology and persistence layer that applies those patterns to deep research and deep review.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:80:Define an implementation-ready semantic coverage graph that reuses existing graph infrastructure, persists loop-scoped graph state in `deep-loop-graph.sqlite`, and feeds graph-backed convergence into the existing Phase 001 stop-decision logic without replacing `newInfoRatio` or other established runtime-truth signals.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:91:- Define research and review graph ontologies, including node kinds, relation types, initial weight estimates, metadata contracts, and convergence metrics.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:94:- Calibrate coverage-specific edge weights during implementation instead of treating inherited memory-causal weights as final.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:95:- Modify the deep-research reducer so it consumes iteration `graphEvents`, defines the reducer/MCP contract explicitly, upserts graph state, queries graph convergence, and falls back to a local JSON graph file when MCP is unavailable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:96:- Update the deep-research and deep-review reference docs and agent prompts so iterations emit graph events and use graph-aware convergence language.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:97:- Add the listed unit and integration tests for graph core logic, signals, convergence, DB behavior, and tool behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:101:- Phase 003 wave scheduling, segment partitioning, or multi-wave orchestration logic.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:102:- Phase 004 replay optimization, threshold tuning, or promotion heuristics derived from graph history.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:113:| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs` | Create | Shared edge manager, relation-weight maps, clamping, self-loop prevention, edge update history, and provenance traversal helpers extracted from `causal-edges.ts`. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:116:| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` | Create | Research/review convergence-signal assembly and typed decision-trace helpers. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:128:| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` | Create | Handler for typed graph-aware convergence assessment and blocker reporting. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:135:| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Ingest iteration `graphEvents`, define the reducer/MCP contract, push graph deltas to MCP, query convergence, enforce the fallback authority chain, and keep a local JSON fallback path. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:137:| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define graph-aware convergence language, decision interplay with `newInfoRatio`, and legal STOP semantics. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:139:| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define graph-aware review convergence signals and contradiction handling. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:149:| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | Create | Verify research/review convergence signals and typed STOP decisions. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:155:Research findings revise the original reuse estimate downward: Phase 002 is now planned as 35-45% direct reuse, 25-30% adapted reuse, and the remainder genuinely new loop semantics. Direct reuse is concentrated in graph primitives and DB lifecycle patterns; adapted work is concentrated in contradiction handling, convergence design, and reducer/MCP integration.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:166:The weights below are initial estimates inherited from memory-causal graph heuristics. They are implementation starting points, not final truth constants, and MUST be recalibrated for coverage semantics before convergence thresholds are considered stable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:180:These review weights are also initial estimates inherited from memory-causal graph behavior. Implementation MUST validate whether they should influence traversal only, convergence scoring, or both, and recalibrate them accordingly.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:198:- Namespace boundary: `spec_folder + loop_type + session_id`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:205:- `loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review'))`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:216:- `idx_coverage_folder_type(spec_folder, loop_type)`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:238:- `loop_type TEXT NOT NULL`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:242:- `weight REAL DEFAULT 1.0 CHECK(weight >= 0.0 AND weight <= 1.5)`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:251:- `idx_coverage_edge_folder_type(spec_folder, loop_type)`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:257:- `loop_type TEXT NOT NULL`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:263:- `UNIQUE(spec_folder, loop_type, iteration)`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:287:| `deep_loop_graph_upsert` | Reducer writes graph deltas after each iteration | Idempotent node/edge upsert, clamped weights, self-loop rejection, metadata updates on repeated IDs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:290:| `deep_loop_graph_convergence` | Composite convergence assessment | Return `decision`, `signals`, `blockers`, and a typed `trace` explaining STOP legality |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:292:Standalone visualization is explicitly deferred to a later phase. Phase 002 only requires the four reducer-facing MCP tools above; dashboards can render summaries from status/convergence outputs and the local derived graph state.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:307:`sourceDiversity` and `evidenceDepth` are blocking guards, not informational votes. STOP remains blocked when either guard is below threshold, even if the weighted signals look favorable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:321:When MCP is unavailable, truth flows in this order: append-only iteration JSONL (`graphEvents`) -> local derived JSON graph rebuilt by the reducer -> SQLite projection maintained by MCP. The current spec deliberately calls out that the reducer/MCP seam is under-specified today; implementation MUST define the exact contract for payload shape, sync model, latency budget, fallback behavior, and replay semantics before reducer integration is considered complete.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:326:4. Reducer calls `deep_loop_graph_convergence`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:328:6. Dashboard/synthesis surfaces consume status/convergence summaries plus locally derived graph context.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:329:7. If MCP is unavailable, reducer preserves replayability from JSONL plus the local JSON graph artifact until MCP recovers.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:343:| REQ-003 | Research coverage graphs MUST use the defined node kinds, relation types, initial weight estimates, and metadata contract. | `QUESTION`, `FINDING`, `CLAIM`, and `SOURCE` are canonical; all listed research relations appear unchanged; initial weight estimates are documented as inherited starting points and a calibration task is carried through plan/tasks; research metrics use the defined formulas. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:344:| REQ-004 | Review coverage graphs MUST use the defined node kinds, relation types, initial weight estimates, and metadata contract. | `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, and `REMEDIATION` are canonical; all listed review relations appear unchanged; initial weight estimates are documented as inherited starting points and a calibration task is carried through plan/tasks; review metrics use the defined formulas. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:345:| REQ-005 | The Spec Kit Memory MCP server MUST expose the four `deep_loop_graph_*` tools with the contracts defined in this phase. | `upsert`, `query`, `status`, and `convergence` are all represented in handler scope and `tool-schemas.ts`; query types and output shapes are explicit; visualization is explicitly deferred. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:346:| REQ-006 | Graph convergence MUST contextualize Phase 001 stop logic without replacing `newInfoRatio`. | The phase explicitly states that low novelty plus strong coverage can allow legal STOP, while low novelty plus uncovered questions, unresolved contradictions, or failed coverage guards (`sourceDiversity`, `evidenceDepth`) must block legal STOP. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:352:| REQ-007 | The deep-research reducer MUST ingest `graphEvents`, persist them, and query graph convergence after each iteration. | `reduce-state.cjs` is named in scope; reducer flow is documented step by step; fallback behavior is defined for MCP-unavailable runs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:353:| REQ-008 | Deep-research and deep-review state/convergence references and agents MUST emit graph-native artifacts. | Both state-format reference files document `graphEvents`; both convergence reference files explain graph-aware signals; both agent files instruct iterations to emit graph nodes and edges. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:354:| REQ-009 | The phase MUST add the listed verification files for shared graph logic and MCP behavior. | `coverage-graph-core.vitest.ts`, `coverage-graph-signals.vitest.ts`, `coverage-graph-convergence.vitest.ts`, `coverage-graph-db.vitest.ts`, and `coverage-graph-tools.vitest.ts` all appear in scope and tasks with clear verification targets. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:363:- **SC-001**: The phase documents the coverage graph as the fourth graph system in the Spec Kit Memory stack and clearly reuses existing graph patterns.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:365:- **SC-003**: Research and review graph ontologies are fully specified, including kinds, relations, initial weight estimates, metadata, convergence metrics, and the requirement to calibrate weights during implementation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:367:- **SC-005**: The reducer integration path explains the reducer/MCP contract, when graph upsert happens, when convergence is queried, and how fallback authority works.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:369:- **SC-007**: Graph-aware convergence is explicitly additive to Phase 001 runtime truth rather than a competing decision channel.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:374:1. **Given** a research packet with low novelty and high question coverage, **when** `deep_loop_graph_convergence` runs, **then** it can support legal STOP only if claims are verified and contradictions are within tolerance.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:375:2. **Given** a research packet with low novelty but uncovered questions, **when** convergence is evaluated, **then** the decision must be `STOP_BLOCKED` and the blockers must name the uncovered questions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:376:3. **Given** a review packet with unresolved contradictory findings, **when** convergence is evaluated, **then** legal STOP is blocked even if iteration novelty has fallen.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md:377:4. **Given** the reducer replays the same `graphEvents` twice, **when** `deep_loop_graph_upsert` runs twice, **then** graph state remains idempotent and weights stay clamped.

===== 003-wave-executor spec anchors =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:3:description: "Orchestrator-managed parallel wave execution for deep research and deep review: fan-out/join proof, deterministic segmentation, activation gates, keyed merge, and 97 tests."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:7:  - "wave executor"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:25:| **Spec Folder** | 042-sk-deep-research-review-improvement-2/003-wave-executor |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:35:Deep research and deep review can now handle very large targets through orchestrator-managed parallel wave execution without abandoning the LEAF-worker model. The implementation adds deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the Phase 002 coverage-graph foundation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:39:Workflow fan-out/join capability was proven through helper-module orchestration that safely performs parallel dispatch and join outside the YAML workflow surface. This was the hard prerequisite that blocked all wave-mode runtime work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:43:The v1 deterministic heuristic segmentation produces reproducible segment identity and ordering for both review files and research domains. Review targets get `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities. Research targets get `domain-ledger.json` with source domains, authority levels, and cluster assignments. Segment-plan versioning and activation-gate configuration are exposed through strategy and config surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:47:The v2 graph-enhanced segmentation wraps Phase 002 graph signals for per-segment convergence, pruning, and promotion decisions. The shared wave lifecycle manager handles fan-out, join, prune, promote, and merge transitions. The reducer-owned `board.json` tracks conflicts, dedupe, and promoted findings, while `dashboard.md` is derived and never directly maintained.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:55:The JSONL merge contract uses explicit key ordering by `sessionId`, `generation`, `segment`, `wave`, and `findingId` rather than append order. Segment provenance, dedupe, and conflict metadata survive repeated merges. Segment JSONL lineage is deterministic and auditable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:63:Implementation proceeded through 3 sub-phases: fan-out/join prerequisite proof, heuristic segmentation with prepass artifacts, and graph-enhanced segmentation with lifecycle integration. 11 files were touched (9 new), adding approximately 3,300 lines. 97 tests cover planner determinism, lifecycle transitions, keyed merge provenance, resume safety, and default-path regression.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:73:| Helper-module orchestration for fan-out/join | The YAML workflow engine has no native parallel dispatch, so orchestration logic lives in CJS helpers |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:74:| Orchestrator-layer parallelism, not LEAF-agent spawning | Workers stay LEAF; orchestration handles segmentation, fan-out, pruning, promotion, and merge |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:76:| Deterministic keyed merge by explicit identifiers | Append-order dependence would break replay and produce non-deterministic merged outputs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:77:| Activation gates with explicit large-target thresholds | Prevents wave overhead for small targets where single-stream execution is already optimal |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:89:| Activation gates prevent wave mode for small targets | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md:101:1. **V2 graph-enhanced segmentation depends on Phase 002 graph readiness.** If graph convergence signals are unavailable, segmentation falls back to v1 heuristic mode.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:3:description: "Deliver orchestrator-managed wave execution for deep research and deep review by adding segment planning, coordination-board tracking, and deterministic merge behavior on top of the Phase 002 graph substrate."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:7:  - "wave executor"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:34:This phase scales deep research and deep review by adding orchestrator-managed wave execution rather than agent-managed spawning. The delivery order is intentionally front-loaded around the biggest risk: first prove workflow fan-out/join capability on top of the current YAML engine, then ship v1 heuristic segmentation plus prepass artifacts, then layer v2 graph-enhanced segmentation once Phase 002 is operational, and only then harden merge and resume behavior for broader activation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:45:- [x] Phase 002 graph convergence is identified as the convergence authority for segments.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:53:- [x] `hotspot-inventory.json` and `domain-ledger.json` are defined as mandatory prepass artifacts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:58:- [x] Tests prove planner determinism, lifecycle correctness, merge idempotence, and resume behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:68:Segmented fan-out orchestration with packet-local state, reducer-owned execution ledgering, and deterministic keyed merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:72:- **Fan-out/join proof layer**: establishes the canonical orchestration path for parallel dispatch and join on top of today's YAML workflow engine.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:74:- **Decomposition prepass**: emits `hotspot-inventory.json` for review and `domain-ledger.json` for research before any wave dispatch.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:75:- **Wave lifecycle manager**: owns fan-out, join, prune, promote, merge, and resume transitions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:76:- **Wave convergence layer**: wraps Phase 002 graph signals for per-segment decisions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:77:- **Coordination board**: keeps `board.json` as the canonical execution ledger and `dashboard.md` as a derived human-readable render.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:78:- **Segment state and merge layer**: keeps segment JSONL replayable and mergeable into the main lineage.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:85:  -> emit hotspot-inventory.json or domain-ledger.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:89:  -> dispatch N parallel LEAF iterations
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:90:  -> evaluate each segment with graph-backed convergence
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:93:  -> join segment waves
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:107:**Why first**: Wave execution is blocked until the system can prove a safe fan-out/join path. The current YAML engine has no native parallel dispatch, so this proof must land before any segmentation or merge design can be treated as buildable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:110:- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:120:- Prove one canonical replacement path, either helper-module orchestration or engine extension, can fan out and join without breaking reducer or resume contracts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:131:- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:132:- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:133:- `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:141:- Prove `hotspot-inventory.json` and `domain-ledger.json` are emitted before dispatch.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:142:- Prove segment IDs and board row IDs remain stable across replay.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:154:- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:155:- `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:171:**Why fourth**: Merge correctness, join safety, and resume behavior are the operational guardrails that make wave mode safe to trust after the prerequisite and segmentation layers are in place.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:174:- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:175:- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:176:- `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:186:- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:187:- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:188:- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:189:- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:192:- Prove segment-local lineage survives interruption and resume.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:206:| Unit | Segment planner, board helpers, convergence wrappers, keyed merge helpers | Vitest |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:208:| State/Replay | Segment JSONL isolation, merge idempotence, keyed identity, and resume | Vitest |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:220:| Phase 002 graph tools and convergence surfaces | Internal | Yellow | Phase 3b graph-enhanced segmentation and graph-backed pruning would be blocked. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:221:| Phase 001 resume and journal model | Internal | Green | Segment-level recovery would become inconsistent with existing runtime truth. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:223:| Packet-local artifact discipline | Internal | Green | Segment, `board.json`, and merge outputs would become hard to replay or merge safely. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:231:- **Trigger**: Fan-out/join proof fails, wave execution produces unstable segments, incorrect merge results, or leaks complexity into default single-stream runs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:232:- **Procedure**: Disable wave mode in config or workflow routing, keep segment-planning helpers uninvoked, fall back to sequential execution, and preserve the single-stream runtime while prerequisite or merge issues are corrected under test.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:233:- **Safety Note**: Rollback must keep prepass artifacts and segment artifacts readable for debugging even when wave mode is disabled.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:243:| Phase 3a heuristic segmentation and prepass artifacts | Medium | Review-side work is concrete, but research still needs a new discovery ledger surface. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:244:| Phase 3b graph-enhanced segmentation | Medium | Depends on Phase 002 coverage graph being operational and stable enough to refine v1 safely. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md:245:| Phase 3c lifecycle, merge, and recovery hardening | Medium-High | Join semantics, keyed merge guarantees, and resume safety all need integration and regression coverage. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:3:description: "Define orchestrator-managed parallel wave execution for deep research and deep review so large targets can be segmented, converged, and merged without turning LEAF agents into sub-agent managers."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:6:  - "wave executor"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:9:  - "parallel deep loop"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:22:Phase 003 adds orchestrator-managed parallel wave execution so deep research and deep review can handle very large targets without abandoning the LEAF-worker model. It formalizes deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the coverage-graph foundation from Phase 002.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:24:Critical prerequisite: workflow fan-out/join capability must be proven before wave execution can be built. The current YAML workflow engine has no native parallel dispatch, so this phase must first establish either helper-module orchestration that safely performs fan-out/join outside the YAML surface or an explicit engine extension that makes parallel dispatch and join first-class.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:40:| **Successor** | `004-offline-loop-optimizer` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:41:| **Handoff Criteria** | Phase 004 can replay wave runs as deterministic, segment-aware traces with stable board and merge artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:45:**Phase Context**: This phase adds orchestrator-managed parallel batches on top of the coverage-graph substrate from Phase 002. The goal is scale without architectural drift: the workers stay LEAF, while orchestration logic handles segmentation, fan-out, pruning, promotion, and merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:49:- Phase 002 graph tools, especially graph-backed convergence and gap detection.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:50:- Phase 001 stop reasons, journals, resume semantics, and reducer-owned sections.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:54:- Proven workflow fan-out/join path before any wave-mode runtime wiring proceeds.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:56:- v2 graph/cluster-enhanced segmentation using the Phase 002 coverage graph once the graph surfaces are operational.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:58:- Mandatory decomposition prepass artifacts: `hotspot-inventory.json` for review and `domain-ledger.json` for research.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:59:- Reducer-owned `board.json` execution ledger plus derived human-readable `dashboard.md` render.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:71:The deep-loop products are currently optimized for one iteration stream at a time. That works for moderate targets, but it becomes inefficient and hard to govern once a review scope crosses 1000 files or a research scope spans dozens of domains. Without a structured wave executor, operators must either accept slow sequential progress or invent ad hoc parallelism that risks duplicated work, conflicting findings, and unmergeable state. The problem is amplified by the current YAML workflow engine, which has no native parallel dispatch or join capability today.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:75:Define an orchestrator-layer wave execution model that segments large review and research targets into bounded parallel batches, tracks each segment through convergence and promotion, and merges the results back into one auditable packet without changing the LEAF-worker rule.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:85:- Prove workflow fan-out/join capability before wave execution is wired into deep research or deep review.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:87:- Add v2 graph/cluster-enhanced segmentation that refines decomposition using the Phase 002 coverage graph once it is operational.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:88:- Define wave lifecycle steps: plan, fan-out, prune, promote, and merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:89:- Introduce machine-first, reducer-owned packet-local coordination tracking with `board.json` as the canonical execution ledger and `dashboard.md` as a derived human-readable render.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:90:- Define mandatory decomposition prepass artifacts: `hotspot-inventory.json` for review and `domain-ledger.json` for research.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:91:- Define segment-local JSONL or state artifacts and deterministic merge rules into the main packet lineage using explicit keys: `sessionId`, `generation`, `segment`, `wave`, and `findingId`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:92:- Apply Phase 002 graph convergence per segment so pruning and promotion decisions are evidence-backed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:93:- Add activation gates so wave execution only activates for review scopes with at least 1000 files plus hotspot spread, or research scopes with at least 50 domains plus cluster diversity; otherwise the default sequential path remains unchanged.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:94:- Add workflow, config, and strategy surfaces for wave-aware execution without changing the default small-target path.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:95:- Add tests for lifecycle correctness, segment isolation, merge idempotence, and resume or recovery behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:100:- Offline replay optimization, config search, and promotion gates from Phase 004.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:108:| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` | Create | Shared planner for v1 heuristic segmentation and v2 graph-enhanced review or research segments. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:109:| `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` | Create | Orchestrator lifecycle helpers for fan-out, join, prune, promote, merge, and resume state transitions. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:110:| `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs` | Create | Reducer-owned `board.json` execution-ledger schema, status transitions, conflict tracking, and derived dashboard renderer helpers. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:111:| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs` | Create | Segment JSONL, lineage, and merge helpers keyed by explicit segment identifiers. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:112:| `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs` | Create | Segment-level convergence helpers that wrap Phase 002 graph metrics and stop traces. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:113:| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document domain-ledger prepass, activation gates, v1/v2 segmentation, fan-out/join, prune or promote rules, and merge behavior for research. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:114:| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add `domain-ledger.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:115:| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:116:| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add segment plan, promoted findings, and merge checkpoints while keeping execution-ledger ownership machine-first. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:117:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document `hotspot-inventory.json`, activation gates, v1/v2 segmentation, wave lifecycle, and merge behavior for review. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:119:| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:120:| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add segment queues, conflict tracking, and merge checkpoints while keeping execution-ledger ownership machine-first. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:121:| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Define wave-aware review outputs and reducer-owned coordination sections. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:122:| `.opencode/command/spec_kit/deep-research.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for research. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:123:| `.opencode/command/spec_kit/deep-review.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for review. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:124:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add domain-ledger prepass, fan-out/join, prune, promote, and keyed merge steps for research. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:125:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode research flow aligned with activation-gated wave lifecycle rules. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:127:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode review flow aligned with activation-gated wave lifecycle rules. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:128:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts` | Create | Verify segment planning, ranking, and clustering behavior. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:129:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` | Create | Verify lifecycle transitions, prune rules, and promotion rules. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:130:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts` | Create | Verify segment isolation, deterministic merge, and idempotent replay behavior. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:131:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts` | Create | Verify wave interruption and resume behavior. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:143:| REQ-000 | Workflow fan-out/join capability MUST be proven before wave execution can be built. | The packet defines and verifies one canonical path for parallel dispatch plus join, either through helper-module orchestration or a YAML engine extension; until that proof exists, wave execution remains blocked and the default sequential path stays authoritative. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:146:| REQ-003 | The phase MUST define a packet-local coordination board that is reducer-owned and machine-first. | `board.json` is the canonical execution ledger for per-segment state, conflict notes, deduplication markers, and promotion outcomes; `dashboard.md` is a derived human-readable render and not a human-edited strategy surface. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:147:| REQ-004 | Segment-local JSONL and merge rules MUST preserve auditability when wave results are merged back into the main packet lineage. | Segment artifacts remain replayable on their own, merged records always include explicit keys `sessionId`, `generation`, `segment`, `wave`, and `findingId`, and merge logic never relies on append order as the source of truth. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:153:| REQ-005 | Each segment MUST use Phase 002 graph signals independently for convergence, pruning, promotion, and v2 decomposition upgrades. | Segment convergence explicitly references coverage-graph status or convergence outputs; prune logic can retire converged or stuck segments without dropping unresolved global gaps silently; graph-enhanced segmentation is blocked until the Phase 002 coverage graph is operational. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:154:| REQ-006 | Deep-research and deep-review workflows MUST expose wave execution as a bounded mode for large targets while preserving the default small-target path. | Wave mode activates only when review targets have at least 1000 files with hotspot spread or research targets have at least 50 domains with cluster diversity; otherwise command docs, YAML workflows, and config surfaces keep the normal single-stream flow as the default path. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:155:| REQ-007 | Wave planning MUST emit mandatory decomposition prepass artifacts before any segment fan-out occurs. | Review writes `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities; research writes `domain-ledger.json` with source domains, authority levels, and cluster assignments; both artifacts are consumed by later wave steps rather than treated as optional notes. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:156:| REQ-008 | Segment promotion and merge MUST preserve conflict and dedupe metadata instead of flattening segment results into one anonymous stream. | The coordination board and merge outputs explicitly keep `conflict`, `duplicate`, or `promoted` state so later synthesis and replay can explain where findings came from. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:157:| REQ-009 | The phase MUST add verification for lifecycle correctness, segment isolation, merge correctness, and resume behavior. | Planned tests cover fan-out/join proof, planner determinism, lifecycle transitions, keyed merge idempotence, interruption or resume semantics, activation-gate fallbacks, and protection against duplicate or conflicting promoted findings. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:165:- **SC-001**: Fan-out/join capability is proven before wave mode is wired into deep research or deep review.

===== 004-offline-loop-optimizer spec anchors =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:3:description: "Deliver Phase 4a as a deterministic offline config optimizer with advisory-only outputs now, and defer Phase 4b prompt/meta optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:7:  - "offline loop optimizer"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:27:| **Language/Stack** | CommonJS optimizer scripts, JSON or JSONL replay artifacts, Markdown runtime docs, existing deep-loop config assets |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:30:| **Testing** | Vitest component suites, replay comparison tests, parity and behavioral gates, strict packet validation |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:34:This phase now splits into two tracks. Phase 4a is the realistic near-term work: harvest real traces, score them with a rubric, search bounded deterministic config space, replay candidates deterministically, and emit advisory candidate patches with a full audit trail. Phase 4b remains deliberately deferred until replay fixtures, behavioral suites, and multi-family corpus coverage exist for safe prompt and meta-optimization.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:45:- [x] Packet family `040` is identified as the required real replay corpus.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:48:- [x] Phase 001 replay fixtures exist for production-grade replay gating.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:55:- [x] Rubric scoring exposes per-dimension outputs and clear weighting.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:60:- [x] Promotion gate emits advisory-only outputs until replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:74:- **Replay corpus builder**: normalizes real packet-family traces into replayable datasets, with `040` required and `028` optional as a compatibility holdout.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:75:- **Rubric engine**: scores replay outcomes across multiple quality dimensions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:76:- **Replay runner**: re-evaluates reducer and convergence logic under alternate candidates.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:87:  -> normalize replay corpus
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:89:  -> replay deterministic baselines
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:91:  -> replay candidates deterministically
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:95:  -> require replay fixtures + behavioral gates before any future production promotion
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:115:- Phase 1 replay fixtures for production-grade replay validation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:127:- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:128:- `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:129:- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:130:- `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:131:- `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:132:- `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:135:- `.opencode/skill/sk-deep-research/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:136:- `.opencode/skill/sk-deep-review/references/convergence.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:139:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:140:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:141:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:142:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:143:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:144:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:148:- Prove rubric dimensions and weights produce stable, inspectable scores.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:149:- Prove replay outcomes remain deterministic for the same corpus and candidate config.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:151:- Prove promotion stays advisory-only while prerequisite replay fixtures and behavioral suites are still missing.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:161:**Why deferred**: Full prompt optimization, cross-packet meta-learning, and automatic promotion are premature today because the corpus is effectively single-family, the optimizer script tree does not exist yet, and the behavioral replay fixtures are still future work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:189:| Replay | Deterministic candidate replay and baseline comparison | Vitest |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:202:| Phase 001 replay fixtures | Internal | Red | Phase 4a cannot graduate beyond advisory reporting without them. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:203:| Phase 002 graph metrics | Internal | Yellow | Optimizer would lose important semantic convergence signals. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:204:| Phase 003 wave artifacts | Internal | Yellow | Corpus would miss richer segment-level evidence for large-target runs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:206:| Required `040` corpus | Internal | Green | The deterministic optimizer would have no real replay base without it. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:216:- **Procedure**: Keep optimizer outputs advisory only, reject production promotion, and leave canonical deep-loop configs unchanged until replay or governance gaps are fixed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:225:- **Session 2**: implement rubric scoring and deterministic replay against stored traces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:226:- **Session 3**: add random search, audit output, and the optimizer manifest that marks tunable vs locked fields.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:227:- **Session 4**: finish the advisory-only promotion gate, docs, and replay-oriented verification. If prerequisite fixtures still do not exist, stop at advisory outputs and do not widen scope into Phase 4b.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:3:description: "Phase 4a: offline replay optimizer with deterministic config tuning, advisory promotion gate, and full audit trail. Phase 4b prompt/meta optimization remains deferred."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:7:  - "offline loop optimizer"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:8:  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:25:| **Spec Folder** | 042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:35:Deep-loop configs can now be tuned offline against real packet traces without experimenting live in production. Phase 4a delivers a complete compile/evaluate loop: harvest traces, score them with a rubric, search bounded deterministic config space, replay candidates, and emit advisory candidate patches with a full audit trail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:39:The `040` replay corpus extractor harvests real traces from packet family `040` as the required corpus. Packet family `028` is supported as an optional compatibility-graded holdout. Packet family `042` is explicitly excluded until implementation traces exist. The corpus includes structured JSONL artifacts with iteration metadata, convergence signals, and stop decisions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:43:A multi-dimensional rubric scores convergence efficiency, recovery success rate, finding accuracy, and synthesis quality. Each dimension produces a normalized score that feeds into the search and promotion stages.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:47:The replay runner executes baseline and candidate configs against the same corpus traces deterministically. Replay results are comparable across runs because the runner controls all non-deterministic inputs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:51:The search module generates candidate configs by perturbing bounded deterministic numeric fields within the optimizer-managed config surface. Only fields declared tunable in the optimizer manifest are eligible for mutation. Locked contract fields and future prompt-pack entrypoints are explicitly excluded.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:55:Every optimization run produces durable audit output covering both accepted and rejected candidates. Advisory patch artifacts include the candidate config diff, rubric scores, replay comparison, and a human-readable recommendation. Rejected candidates are preserved with the same audit detail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:59:The promotion gate refuses production mutation until replay fixtures and behavioral suites exist. All current outputs are advisory-only candidate patches that require human review before any canonical config is changed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:67:Implementation proceeded through 3 sub-phases: corpus/rubric/replay foundation, search/audit/manifest, and advisory promotion gate. 20 files were touched (14 new), adding approximately 3,800 lines. 91 tests cover corpus extraction, rubric scoring, replay determinism, search boundaries, audit persistence, and promotion gate behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:77:| Deterministic `4a` now, `4b` deferred | Safe near-term scope is narrower than originally drafted; prompt/meta optimization needs replay fixtures and behavioral suites first |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:78:| Advisory-only promotion until prerequisites exist | Prevents unsafe live mutation from an optimizer that lacks production-grade replay validation |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:79:| Optimizer manifest separates tunable vs locked fields | Config governance prevents optimizer from mutating runtime contracts or non-numeric surfaces |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:81:| Prompt work via packs/patches, not direct agent markdown edits | Keeps prompt changes replayable, rollback-safe, and auditable |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:93:| Deterministic replay produces comparable results | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:94:| Search stays within optimizer-managed config boundaries | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:107:3. **Corpus is limited to `040` family.** Broader corpus coverage from additional packet families will improve optimizer confidence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:3:description: "Define an offline replay optimizer that tunes deterministic deep-loop configs against real packet traces now, while deferring prompt and meta-optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:6:  - "offline loop optimizer"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:7:  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:8:  - "optimizer manifest"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:22:Phase 004 is now explicitly split into two sub-phases. Phase 4a is the realistic near-term deliverable: build an offline compile/evaluate loop that replays real packet traces, tunes deterministic numeric config thresholds, and emits advisory patch recommendations with a full audit trail. Phase 4b is deferred future work for prompt-pack and meta-optimization once replay fixtures, behavioral suites, and multi-family corpus coverage actually exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:37:| **Predecessor** | `003-wave-executor` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:39:| **Handoff Criteria** | Phase 4a outputs are replay-verified, audit-trailed, and emitted as advisory-only candidate patches until Phase 1 replay fixtures and Phase 3 behavioral suites exist. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:43:**Phase Context**: This phase closes the moonshot chain by turning prior run traces into an offline improvement engine, but the research findings show the safe near-term scope is narrower than originally drafted. Phases 001 through 003 make deep-loop behavior explicit, graph-aware, and segment-capable; Phase 4a should use those artifacts to tune deterministic thresholds and recovery settings without experimenting live in production, while Phase 4b stays deferred until the replay and behavioral foundations are real.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:48:- Phase 003 richer wave-run traces and segment-aware artifacts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:49:- Phase 001 replay fixtures must exist before any production-grade replay or promotion claim is credible.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:53:- **Phase 4a**: replay corpus builder with `040` required, `028` optional as an older holdout, and `042` excluded until it has implementation traces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:54:- **Phase 4a**: rubric and scoring framework for run quality, deterministic replay runner, random-search baseline, optimizer manifest, and audit-trailed advisory candidate reports.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:65:The deep-loop products now have richer runtime state, but tuning them is still largely manual: convergence thresholds, stuck detection, recovery escalation, and related numeric controls are adjusted by human judgment and one-off testing. That is expensive, hard to compare rigorously, and vulnerable to regressions because the system has no offline compile/evaluate loop that can replay historical traces, score outcomes, and prove that a new deterministic configuration is actually better before it is even considered for production.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:69:Define an offline replay optimizer that learns from real packet traces, scores run quality against a shared rubric, searches bounded deterministic config space, and emits advisory candidate patches only. Production promotion remains out of scope until Phase 1 replay fixtures and Phase 3 behavioral suites exist, and prompt or meta-optimization remains deferred future work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:79:- Build a replay corpus with packet family `040` as the required source, packet family `028` as an optional structurally older holdout, and packet family `042` excluded until it has real implementation traces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:80:- Define a rubric for finding accuracy, convergence efficiency, recovery success rate, and synthesis quality.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:81:- Add configuration-search logic for deterministic numeric settings such as convergence thresholds, stuck detection, and recovery escalation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:82:- Add a deterministic replay runner for reducer and convergence logic under alternate configs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:83:- Add a canonical optimizer manifest that declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:93:- Direct mutation of canonical agent `.md` files during optimization. Agent markdown remains behavior documentation, not an optimizer template surface.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:100:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:101:| `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs` | Create | Score runs across accuracy, convergence efficiency, recovery success, and synthesis quality. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:102:| `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs` | Create | Search bounded deterministic numeric config candidates. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:103:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:104:| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and emit advisory-only candidate patches. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:105:| `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Create | Canonical manifest of tunable fields, locked contract fields, and future prompt-pack entrypoints. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:106:| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:107:| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:108:| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:109:| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:112:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:113:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts` | Create | Verify scoring rules and metric weighting behavior. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:114:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` | Create | Verify search-space handling and candidate bookkeeping. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:115:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:116:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify advisory promotion gating, rollback behavior, and audit output. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:117:| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures, optimization-result snapshots, and advisory patch artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:129:| REQ-001 | Phase 4a MUST build a replay corpus with packet family `040` as the required source corpus. | Corpus inputs are tied to real `040` packet artifacts, normalized into a deterministic replay format, and traceable back to their source runs and metadata. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:131:| REQ-003 | The optimizer MUST define a rubric that scores run quality across finding accuracy, convergence efficiency, recovery success rate, and synthesis quality. | The rubric exposes explicit metric definitions, weighting, and score outputs; the phase does not rely on one opaque "goodness" number. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:132:| REQ-004 | Phase 4a MUST provide a deterministic replay runner that can evaluate alternate configs without running live agent iterations. | Replay consumes stored traces and config candidates, produces repeatable outputs, and isolates replay from live network or human-in-the-loop variability. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:133:| REQ-005 | The phase MUST define a canonical optimizer manifest that separates tunable fields, locked contract fields, and prompt-pack entrypoints. | A single manifest names each optimizer-managed field family, each locked lifecycle or schema contract field, and each future prompt-pack insertion point. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:134:| REQ-006 | No production promotion is allowed until the replay fixtures planned in Phase 1 and the behavioral suites planned in Phase 3 actually exist. | Until both prerequisite surfaces exist, all optimizer outputs are advisory-only candidate patches or reports and must not directly mutate canonical production configs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:140:| REQ-007 | Phase 4a search MUST stay within deterministic numeric config families such as convergence thresholds, stuck sensitivity, and recovery escalation. | Search configuration covers the allowed deterministic tunable dimensions, excludes locked contract fields, and records which candidates touched which parameter families. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:142:| REQ-009 | Optimizer scoring MUST incorporate graph and wave metrics when those traces are available, without inventing fake values for older runs. | The corpus and rubric can consume Phase 002 or Phase 003 signals when present, and explicitly mark them unavailable for older traces instead of fabricating them. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:143:| REQ-010 | If prompt optimization remains in scope for deferred Phase 4b, it MUST operate on generated prompt packs or patch artifacts rather than directly mutating agent `.md` files. | Prompt candidates are expressed as generated pack outputs or patch artifacts that can be replayed, diffed, tested, and rolled back independently of canonical agent markdown. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:152:- **SC-001**: The optimizer corpus is built from real packet traces, with `040` as the required source family.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:156:- **SC-005**: Promotion remains advisory-only until replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:158:- **SC-007**: The optimizer manifest keeps tunable and locked fields explicit and rollback-friendly.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:163:1. **Given** packet family `040`, **when** the corpus builder runs, **then** it emits deterministic replay inputs tied back to its source runs and metadata.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:165:3. **Given** packet family `042`, **when** corpus intake is evaluated, **then** the optimizer refuses to treat it as replay corpus until implementation traces exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:166:4. **Given** a candidate config improves convergence efficiency but harms accuracy, **when** rubric scoring runs, **then** the breakdown shows the trade-off explicitly instead of hiding it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:167:5. **Given** the same baseline trace and candidate config, **when** replay runs twice, **then** the resulting score and decision outputs remain stable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:168:6. **Given** a candidate outperforms baseline in replay but the Phase 1 replay fixtures or Phase 3 behavioral suites do not yet exist, **when** promotion runs, **then** the optimizer emits only an advisory patch or report and refuses production promotion.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:169:7. **Given** an older packet trace lacks graph or wave metrics, **when** scoring runs, **then** the audit trail marks those dimensions unavailable rather than inventing placeholder values.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:170:8. **Given** a candidate touches a non-tunable contract field, **when** promotion eligibility is checked, **then** the optimizer rejects the candidate as out of bounds.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:182:| Dependency | Phase 001 replay fixtures must exist before promotion can graduate beyond advisory reports | High | Treat missing replay fixtures as a hard promotion block and keep outputs patch-only. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:184:| Risk | Replay fidelity is too low to support fair candidate comparisons | High | Keep replay deterministic, tie it to stored traces, and reject promotion when fidelity is insufficient. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:187:| Risk | Optimizer starts changing fields that should remain human-governed | Medium | Mark optimizer-managed fields explicitly in runtime configs and docs. |


exec
/bin/zsh -lc "printf '===== deep-research refs =====\\n'; for f in .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/assets/deep_research_config.json .opencode/agent/deep-research.md; do echo \"--- "'$f ---"; rg -n "stop|reason|resume|journal|ledger|event|lifecycle|convergence|snapshot|replay|wave|parallel|optimizer|stability|coverage|inventory|question|blocked|synth|session" "$f" | head -n 120; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== deep-research refs =====
--- .opencode/skill/sk-deep-research/references/loop_protocol.md ---
3:description: Canonical specification for the deep research loop lifecycle with 4 phases, reference-only wave orchestration, and error handling.
8:Canonical specification for the deep research loop lifecycle.
15:The deep research loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the @deep-research agent executes individual iterations; the reducer synchronizes packet state after each iteration and lifecycle transition.
42:Set up all state files for a new research session.
46:1. **Classify session state before writing**:
48:   - `resume`: config + state + strategy all exist and agree
49:   - `completed-session`: consistent prior state with `config.status == "complete"`
54:   - Emit a `migration` event for every legacy alias consumed
60:   - Initial key questions (3-5, from topic analysis)
68:   - In **confirm mode**: present the charter (topic, key questions, non-goals, stop conditions) for user review before proceeding
78:If state files already exist from a prior session:
83:5. Log resume event to JSONL: `{"type":"event","event":"resumed","fromIteration":N}`
88:- `resume`: same `sessionId`, no archive, continue from the active lineage boundary
89:- `restart`: new `sessionId`, incremented `generation`, archive prior packet under `research/archive/{oldSessionId}/`
90:- `fork`: new `sessionId`, preserve parent linkage, copy current state as branch baseline
91:- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
99:### Loop Steps (repeated until convergence)
103:- Read `deep-research-strategy.md` -- get next focus, remaining questions
106:Run the convergence algorithm (see convergence.md):
110:- All questions answered? STOP
115:When the convergence algorithm returns STOP:
116:1. Run quality guard checks (see convergence.md §2.4)
117:2. Verify minimum coverage, source diversity, and question resolution thresholds
118:3. If **all guards pass**: proceed with STOP, exit to synthesis
120:   - Log each violation: `{"type":"event","event":"guard_violation","guard":"<name>","iteration":N,"detail":"<reason>"}`
122:5. The loop continues until BOTH convergence AND quality guards pass simultaneously
131:   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
134:     Research paused. Delete research/.deep-research-pause to resume.
135:     Current state: Iteration {N}, {remaining} questions remaining.
137:   - Do NOT exit to synthesis -- the loop is suspended, not stopped
138:3. On resume (file deleted and loop restarted):
139:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
186:  2. Log event: `{"type":"event","event":"iteration_timeout","iteration":N,"reason":"tool_calls|elapsed_time"}`
198:7. Track stuck count: skip if `status == "thought"` (no change), reset to 0 if `status == "insight"` (breakthrough counts as progress), increment if `newInfoRatio < config.convergenceThreshold`, reset otherwise
212:3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
241:- If convergence check returns STOP: exit to synthesis
253:1. **Init**: During strategy initialization, if `research/research-ideas.md` exists from a prior session, read it and incorporate relevant ideas into the initial key questions or "Next Focus"
254:2. **Stuck**: During stuck recovery (Step 2a of the recovery protocol in convergence.md), check ideas backlog before defaulting to generic recovery strategies. Deferred ideas often provide the best escape from stuck states
255:3. **Resume**: On auto-resume, read the ideas file alongside JSONL and strategy.md to restore full context
270:Users can edit `research-ideas.md` between sessions to steer future iterations. Agents append new ideas during iterations when they encounter promising tangents that fall outside the current focus.
284:3. Select a targeted recovery prompt based on the classification (see convergence.md §4 for category-specific strategies)
285:4. Log classification: `{"type":"event","event":"stuck_classified","mode":"<classification>","iteration":N}`
289:2. Identify least-explored question from "Key Questions"
292:5. If recovery iteration also shows no progress: exit to synthesis with gaps documented
299:2. Log event: `{"type":"event","event":"direct_mode","iteration":N,"reason":"dispatch_failure"}`
315:<!-- ANCHOR:wave-orchestration-protocol -->
318:An optional parallel execution mode for research topics with multiple independent questions. Treat this as reference guidance unless the runtime explicitly supports it; the live workflow remains sequential.
322:- 3+ independent key questions identified during initialization
329:Wave 1: Dispatch N agents on independent questions
335:Scoring: Rank by newInfoRatio, prune below median when wave support is enabled
337:Wave 2: Follow-up on top-K questions (K = ceil(N/2))
341:Repeat until convergence
346:After each wave completes:
347:1. Rank all wave iterations by `newInfoRatio`
348:2. Compute wave median: `median([i.newInfoRatio for i in wave_iterations])`
349:3. **Prune**: Questions with newInfoRatio below median are deprioritized when wave support is enabled
350:4. **Promote**: Top-K questions (K = ceil(N/2)) get follow-up iterations
351:5. Pruned questions are moved to the ideas backlog, not discarded
355:When any single iteration in a wave achieves `newInfoRatio > 2x wave_average`:
357:1. Flag as **breakthrough**: `{"type":"event","event":"breakthrough","iteration":N,"ratio":X.XX}`
358:2. Generate 2-3 adjacent questions from the breakthrough findings
359:3. Prioritize these adjacent questions in the next wave
366:{"type":"iteration","run":N,"wave":1,"status":"complete",...}
369:Wave events:
371:{"type":"event","event":"wave_complete","wave":1,"iterations":[1,2,3],"medianRatio":0.5}
372:{"type":"event","event":"breakthrough","wave":1,"iteration":2,"ratio":0.95}
378:- The convergence algorithm applies identically (uses all iteration records)
379:- Wave mode can transition to sequential mode when questions narrow to 1-2
380:- Sequential mode can spawn a wave when new independent questions emerge
384:<!-- /ANCHOR:wave-orchestration-protocol -->
392:The standard dispatch (Task tool) shares the parent session's token budget. In long research sessions (10+ iterations), this may cause context compression that degrades reasoning quality. Process-level isolation eliminates this risk.
422:- Autonomous/unattended research sessions (overnight runs)
424:- Critical research where reasoning quality must not degrade
426:**Status**: Reference-only. Track adoption based on need for fully autonomous overnight research sessions.
431:<!-- ANCHOR:phase-synthesis -->
435:Compile all iteration findings into final research/research.md. The synthesis workflow owns the canonical `research/research.md` output.
440:2. **Read strategy.md**: Final state of questions, approaches
445:   - Note unanswered questions in Section 12 (Open Questions)
453:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
455:6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
458:- If `progressiveSynthesis: true` (default): research/research.md was updated each iteration. Final synthesis is a cleanup pass.
459:- If `progressiveSynthesis: false`: research/research.md is created from scratch during synthesis.
463:<!-- /ANCHOR:phase-synthesis -->
487:[EVALUATING] --> iteration complete, checking convergence
505:Hook-capable and non-hook runtimes must follow the same state machine. Hooks may pre-prime context, but they must not change which lifecycle branch the packet selects.
519:| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
530:| 2 (Strategy rebuild) | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract questions, focus areas, newInfoRatio trend. Create minimal strategy.md |
532:| 4 (Config-only restart) | Only config.json remains | Restart from initialization phase using config parameters. Log: `{"type":"event","event":"fresh_restart","reason":"state_files_missing"}` |
548:| After each iteration | Show iteration findings and convergence status. Options: Continue, Adjust Focus, Stop |
549:| Before synthesis | Show summary of all iterations. Wait for approval to synthesize |
550:| After synthesis | Show final research/research.md summary. Approve or request revisions |
559:When `config.mode == "review"`, the loop protocol adapts from research to code/spec review. The 4-phase structure (init, loop, synthesis, save) is preserved, but review mode uses the simplified four-dimension taxonomy, three binary gates, and machine-verifiable traceability state.
564:Set up all state files for a new review session. Discover the scope, order dimensions, and establish the traceability protocol plan.
568:1. **Classify session state**: Same as research mode (fresh, resume, completed-session, invalid-state)
612:Run `shouldContinue_review()` (see convergence.md Section 10.3):
615:- Composite convergence votes `STOP` only after:
617:  - dimension coverage reaches 100% across the 4-dimension model
618:  - coverage has aged through `minStabilizationPasses >= 1`
620:  - evidence, scope, and coverage gates pass
685:Before the next convergence pass, the orchestrator adjudicates every new P0/P1.
700:4. Confirm or downgrade severity before the finding becomes convergence-visible.
702:This adjudication step happens after iteration evaluation and before the next convergence math run.
710:- Trend (`newFindingsRatio`, severity, traceability stability)
720:2. **Read strategy**: Final state of dimensions, findings, coverage, and protocol status
726:5. **Replay validation**: Recompute the convergence outcome from JSONL state before finalizing the report
742:9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`

--- .opencode/skill/sk-deep-research/references/convergence.md ---
3:description: Algorithms and protocols for determining when the deep research loop should stop.
8:Algorithms and protocols for determining when the deep research loop should stop.
15:Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.
19:Both deep-loop products normalize their terminal and blocked-stop outcomes through the same completion-gate contract before any stop decision is persisted to JSONL, dashboards, or synthesis output.
21:#### `stopReason` enum
25:| `converged` | The legal-stop bundle passed and the loop may exit normally |
26:| `maxIterationsReached` | The loop hit its configured iteration cap before legal convergence |
28:| `blockedStop` | Convergence or coverage wanted to stop, but one or more legal-stop gates failed |
31:| `manualStop` | An operator explicitly halted the loop outside automatic convergence |
44:  blockedBy: string[];
46:    convergenceGate: GateResult;
47:    coverageGate: GateResult;
50:  replayInputs: {
55:    activeSignals?: Array<{ name: string; value: number; stop: boolean; weight: number }>;
58:      | "question_coverage"
59:      | "composite_convergence"
69:- `blockedBy` lists the gate names that prevented a legal STOP. Use an empty array when STOP is legal.
70:- `gateResults` is the replayable legal-stop bundle. Canonical research gates are `convergenceGate`, `coverageGate`, and `qualityGate`; the `qualityGate.checks` map carries the subordinate `sourceDiversity`, `focusAlignment`, and `singleWeakSourceDominance` results.
71:- `replayInputs` snapshots the exact stop-decision inputs so the reducer and dashboards can replay the outcome from packet-local artifacts only.
77:| Legacy label or phrase | New `stopReason` | Normalization note |
79:| `composite_converged` | `converged` | Weighted convergence vote passed and legal-stop gates passed |
80:| `novelty below threshold` | `converged` | Legacy prose alias for the rolling-average or composite stop path |
81:| `all_questions_answered` | `converged` | Coverage-driven stop becomes `blockedStop` instead if legal-stop gates fail |
86:| `guard_override` | `blockedStop` | STOP candidate was vetoed by legal-stop gates |
87:| `guard_violation` | `blockedStop` | Guard failure record that blocks legal STOP |
90:| `manual_stop` | `manualStop` | Operator halted the loop |
93:Deep review uses the same `stopReason` enum and `legalStop` record, even though its convergence signals differ.
109:  // Hard stop: max iterations
113:      stopReason: "maxIterationsReached",
117:  // Hard stop: all questions answered
122:      stopReason: "converged",
123:      legacyStopLabel: "all_questions_answered"
135:      stopReason: "stuckRecovery",
143:Three independent signals each cast a stop/continue vote. Stop when weighted stop-score exceeds the consensus threshold.
149:| Question Entropy | 0.35 | 1 | Coverage of research questions |
153:- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
154:- `coverageBySources`: per-question source coverage summary used by the quality guards
157:  // Filter: exclude "thought" iterations from convergence signals
163:  // Composite convergence: 3-signal weighted vote
171:    rollingStop = avgNewInfo < config.convergenceThreshold
172:    signals.push({ name: "rollingAvg", value: avgNewInfo, stop: rollingStop, weight: 0.30 })
183:    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.35 })
186:  // Signal 3: Question entropy coverage
190:    coverage = answered / total
191:    entropyStop = coverage >= 0.85  // 85%+ questions answered signals saturation
192:    signals.push({ name: "entropyCoverage", value: coverage, stop: entropyStop, weight: 0.35 })
195:  // Compute weighted stop score
198:    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
199:    if stopScore > 0.60:
202:        stopReason: "converged",
204:        stopScore,
214:After composite convergence or full-question coverage nominates STOP, the loop MUST evaluate the full legal-stop bundle before STOP becomes final. STOP is never legal on novelty math alone. The replayable `legalStop.gateResults` bundle for deep research is:
218:| Convergence Gate | The novelty score stays below `convergenceThreshold` for N consecutive evidence iterations | Block STOP, persist `blocked_stop`, continue |
219:| Coverage Gate | Every key question has at least one evidence-backed answer | Block STOP, persist `blocked_stop`, continue |
220:| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance all pass | Block STOP, persist `blocked_stop`, continue |
222:`N` comes from the reducer-or-workflow legal-stop policy (default 2 consecutive evidence iterations unless a packet config raises it). The bundle is evaluated together; no single gate can authorize STOP by itself.
225:function evaluateLegalStop(state, strategy, config, stopCandidate):
231:  convergenceGate = {
233:      all(i.newInfoRatio < config.convergenceThreshold for i in recentEvidence),
238:  coverageGate = {
241:      "Every key question has an evidence-backed answer" :
243:    recoveryHint: "Target unanswered or weakly answered key questions next"
263:  blockedBy = []
265:    convergenceGate,
266:    coverageGate,
270:      blockedBy.push(gateName)
273:    blockedBy,
274:    gateResults: { convergenceGate, coverageGate, qualityGate },
275:    replayInputs: buildReplayInputs(state, stopCandidate)
278:  if len(blockedBy) == 0:
281:      stopReason: "converged",
282:      candidateStopReason: stopCandidate.stopReason,
288:    stopReason: "blockedStop",
289:    candidateStopReason: stopCandidate.stopReason,
298:- **Coverage Gate**: Every initialized key question must have at least one answer backed by evidence from the iteration artifacts.
299:- **Source Diversity**: For each answered question, count distinct independent sources. Require the configured minimum (default 2).
300:- **Focus Alignment**: Compare answered question labels against the initialized key-question set. Flag any answer outside the declared scope.
301:- **No Single-Weak-Source**: No answered question may depend entirely on a single tentative or otherwise weak source.
303:`qualityGate.checks` is the replayable quality bundle. Reducers and dashboards must be able to explain a quality pass or failure from packet-local artifacts only.
307:1. Append a `stop_decision` snapshot with the attempted stop bundle.
308:2. Append a first-class `blocked_stop` event with `stopReason: "blockedStop"`, `legalStop.blockedBy`, the full `legalStop.gateResults`, and a concrete `recoveryStrategy`.
312:Recommended blocked-stop recovery mapping:
316:| `convergenceGate` | `widenFocus` to gather another evidence iteration before retrying STOP |
317:| `coverageGate` | `answerMissingQuestions` for unanswered or tentative-only questions |
325:When the proportion of identified approaches that have been either validated or eliminated reaches a high threshold, this could serve as an additional convergence signal indicating the research space has been thoroughly explored.
339:Three additional signals provide deeper semantic analysis of iteration quality. These signals are ADDITIONAL to the 3-signal composite vote above and participate in the legal-stop gate evaluation rather than the composite stop-score.
385:- `contradictionDensity > 0.25` blocks STOP: unresolved contradictions suggest the research space is not yet stable. The legal-stop gate records this as a `qualityGate` sub-check failure.
409:- `citationOverlap < 0.30` prevents STOP: the iteration discovered substantially new sources that may yield fresh findings.
413:The three semantic signals combine with the existing legal-stop gates as follows:
416:2. **Coverage Gate** (existing): Key questions answered with evidence.
426:The stop-decision event (`stop_decision` and `blocked_stop` JSONL records) includes which semantic signals supported or prevented STOP:
430:  "type": "event",
431:  "event": "stop_decision",
437:  "semanticVerdict": "all_support_stop",
444:| `all_support_stop` | All 3 semantic signals support stopping |
445:| `mixed` | Some signals support stop, others do not |
446:| `all_prevent_stop` | All 3 semantic signals indicate more work is needed |
453:| 1-2 | Entropy only (weight 1.0) | Very unlikely to stop (need 85%+ coverage) |
457:Semantic convergence signals (`semanticNovelty`, `contradictionDensity`, `citationOverlap`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.
464:2. **All questions answered** (coverage-driven stop candidate)
466:4. **Composite convergence** (3-signal weighted vote, threshold 0.60)
467:4.5. **Legal-stop gate bundle** (`convergenceGate` + `coverageGate` + `qualityGate` must all pass together)
468:4.6. **Blocked-stop persistence** (if any legal-stop gate fails, persist `blocked_stop` with recovery strategy and continue)
514:    if i.newInfoRatio < config.convergenceThreshold or i.status == "stuck":
522:- `newInfoRatio < config.convergenceThreshold` (below the configured no-progress threshold)
542:The MAD noise floor represents the minimum change needed to distinguish signal from noise. When the latest newInfoRatio falls at or below the noise floor, the MAD signal votes "stop".
550:Computed from strategy.md's question state.
556:  if total == 0: return 1.0  // no questions = fully covered
566:The 0.85 threshold accounts for questions that may be unanswerable or out of scope. Research that has answered 85%+ of its questions is likely saturated.
568:> **Source-Hygiene Note:** Tentative findings (`sourceStrength == "tentative"`) do not count toward answered-question coverage unless confirmed by an independent source in a later iteration. When computing `answered / total`, exclude any question whose only supporting evidence has tentative strength. This prevents premature convergence based on unverified or low-confidence information.
587:This ensures convergence checks continue even after partial state corruption. See state_format.md Section 3 for the full fault tolerance specification.
591:Segments partition a research session into logical phases without losing history when an implementation explicitly enables them.
596:| segment_start (event type) | event | -- | Marks the start of a new segment |
598:When computing convergence signals:
600:- Hard stops (max iterations) count ALL iterations regardless of segment
621:- What questions remain unanswered?
631:| Contradictory evidence | Strategy shows conflicting findings on same question | "Isolate the contradiction. Find a tiebreaker source or document both positions with evidence quality" |
632:| Topic too broad | Focus area unchanged for 3+ iterations with declining ratio | "Decompose into 2-3 sub-questions. Pick the most specific one" |
650:- If prior iterations were broad, narrow to a specific sub-question
668:**Action**: Synthesize the two highest-newInfoRatio iterations into a new composite question.

--- .opencode/skill/sk-deep-research/references/state_format.md ---
22:| `deep-research-dashboard.md` | Markdown | Auto-generated session summary | Auto-generated (read-only) |
23:| `findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings | Auto-generated (read-only) |
25:| `research/research.md` | Markdown | Workflow-owned canonical synthesis output | Updated incrementally only when `progressiveSynthesis` is enabled |
27:Research mode stores its runtime packet under `{spec_folder}/research/`, with iteration findings under `{spec_folder}/research/iterations/` and canonical synthesis at `{spec_folder}/research/research.md`. `research/research.md` is workflow-owned canonical synthesis output.
47:  "convergenceThreshold": 0.05,
56:    "sessionId": "dr-2026-03-18T10-00-00Z",
67:| topic | string | Yes | -- | Research topic or question |
69:| convergenceThreshold | number | No | 0.05 | Stop when avg newInfoRatio below this |
72:| progressiveSynthesis | boolean | No | true | Update research/research.md after each iteration; synthesis still performs a cleanup pass |
77:| lineage.sessionId | string | Yes | -- | Stable identifier for the current lineage segment |
79:| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
81:| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
123:{"type":"config","topic":"API response time optimization","maxIterations":10,"convergenceThreshold":0.05,"createdAt":"2026-03-18T10:00:00Z","specFolder":"028-auto-deep-research"}
134:| type | "config", "iteration", or "event" | Yes | Record type discriminator |
147:| convergenceSignals | object | No | Composite convergence signal values (see below) |
154:When the composite convergence algorithm runs (see convergence.md), signal values are recorded in the iteration record:
157:{"type":"iteration","run":5,...,"convergenceSignals":{"rollingAvg":0.12,"madScore":0.08,"entropyCoverage":0.71,"compositeStop":0.42}}
164:| entropyCoverage | number | Question coverage ratio (0.0-1.0) |
165:| compositeStop | number | Weighted stop score (stop if > 0.60) |
174:{"type":"iteration","run":3,"status":"complete","focus":"Connection pooling","findingsCount":3,"newInfoRatio":0.4,"ruledOut":[{"approach":"HTTP/3 multiplexing","reason":"No server-side support in target environment","evidence":"docs.example.com/protocols#supported"}],"keyQuestions":["What causes latency?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":52000}
180:| reason | string | Yes | Why it was ruled out |
183:Iteration files (`research/iterations/iteration-NNN.md`) MUST include `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured. These sections feed reducer-owned strategy and registry refreshes and prevent future iterations from re-exploring eliminated paths.
193:This field aids post-hoc analysis and helps subsequent iterations calibrate expectations. It is not used in convergence computation.
203:Track labels are free-form strings used for filtering and grouping in dashboards and analysis. They are not used for orchestration or convergence decisions. Multiple iterations may share the same track label.
211:| `primary` | Authoritative, verified by multiple sources | Counts toward question coverage |
212:| `secondary` | Corroborating evidence, supports a primary finding | Counts toward question coverage |
213:| `tentative` | Single source, unverified | Does NOT count toward question coverage |
215:In iteration file findings sections, annotate inline: `[Finding text] (sourceStrength: primary)`. In JSONL records, source strength is tracked implicitly through the `newInfoRatio` -- tentative findings contribute less to the ratio. The convergence algorithm excludes tentative-only findings when computing `entropyCoverage`.
228:| `thought` | Analytical-only iteration with reasoning or synthesis but no evidence gathering |
230:The `insight` status prevents premature convergence when a conceptually significant iteration would otherwise trigger the stuck counter. The `thought` status marks planning or meta-reasoning iterations that should not affect convergence signals.
234:Events are written by the YAML workflow or diagnostics layer for lifecycle tracking. Canonical coverage includes:
238:| resumed | workflow | active | Resume after a prior active session | sessionId, continuedFromRun, timestamp |
239:| restarted | workflow | active | Start a new generation from prior state | sessionId, parentSessionId, generation, timestamp |
240:| forked | workflow | active | Create a new branch from current packet state | sessionId, parentSessionId, generation, timestamp |
241:| completed_continue | workflow | active | Reopen a completed lineage after immutable snapshotting | sessionId, parentSessionId, generation, continuedFromRun, completedAt, reopenedAt, timestamp |
242:| paused | workflow | active | Pause sentinel detected | reason, timestamp |
244:| direct_mode | workflow | reference-only | Orchestrator absorbed iteration work | iteration, reason, timestamp |
246:| wave_complete | wave coordinator | reference-only | Parallel wave finished | wave, iterations, medianRatio, timestamp |
247:| wave_pruned | wave coordinator | reference-only | Low-value wave branch deprioritized | wave, prunedIterations, medianRatio, timestamp |
248:| breakthrough | wave coordinator | reference-only | Wave branch exceeded 2x average | wave, iteration, ratio, timestamp |
252:| segment_start | workflow | reference-only | Start of a new segment | segment, reason, timestamp |
253:| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
254:| guard_violation | guard system | active | Research guard constraint violated | guard, question, detail, timestamp |
256:Guard violation events are emitted when a research guard detects a quality constraint breach. The `guard` field identifies which guard fired:
259:{"type":"event","event":"guard_violation","guard":"source_diversity","question":"Q1","detail":"Only 1 source for Q1","timestamp":"2026-03-18T10:20:00Z"}
262:Supported guard values: `source_diversity`, `focus_alignment`, `single_weak_source`. These events are informational and do not halt the loop, but the orchestrator may use them to adjust subsequent iteration focus.
264:Additional event-specific fields may appear on the JSON line, but the table above is the canonical coverage for emitted events.
272:| `sessionId` | Stable identifier for the active lineage segment |
282:The reducer is the synchronization pass that runs after each successful iteration and after each lifecycle transition.
295:- malformed delta -> skip + warning event
296:- missing iteration file -> no-op + error event
297:- schema mismatch -> reject + conflict event
310:- `segment_start` events must have sequential segment numbers when segmenting is explicitly enabled
329:This ensures the research loop continues even after partial state corruption. The convergence algorithm operates on valid entries only.
347:7. **Log** event: `{"type":"event","event":"state_reconstructed","iterationsRecovered":N}`
349:**Limitations**: Reconstructed state lacks `durationMs`, exact `timestamp`, and `findingsCount`. The `status: "reconstructed"` flag distinguishes recovered records from originals. The convergence algorithm treats reconstructed records identically to complete records for signal computation.
353:Segments partition a research session into logical phases without losing history when the runtime supports them.
357:- **Convergence filtering**: The convergence algorithm filters by current segment when computing signals
358:- **Cross-segment**: Full JSONL read (no segment filter) provides complete history for synthesis
359:- **Validation**: `segment` values must be >= 1 and sequential within a session
361:Example multi-segment session:
366:{"type":"event","event":"segment_start","segment":2,"reason":"Pivoting to caching strategies"}
384:| Key Questions (remaining) | Each iteration | Unchecked questions drive next focus |
385:| Answered Questions | Each iteration | Checked questions with answer summary |
397:3. Move newly answered questions from "remaining" to "answered" with `[x]` and summary
400:6. Set "Next Focus" based on remaining questions and successful approaches
455:Progressive synthesis updated after each iteration when `progressiveSynthesis` is enabled. Follows the standard 17-section research template. Lives at `{spec_folder}/research/research.md` (not in scratch/). `research/research.md` is workflow-owned canonical synthesis output.
461:- After convergence: Final synthesis pass to consolidate and remove redundancy
463:- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
471:Auto-generated summary view of the research session. Never manually edited.
487:| Question Status | Strategy + registry | Each key question with answered/open status and coverage % |
488:| Convergence Trend | JSONL convergenceSignals + reducer | Rolling average, composite stop score, trajectory |
489:| Dead Ends | JSONL ruledOut + strategy | Accumulated ruled-out approaches with reasons |
491:| Source Diversity | Registry metrics | Source count per question and `coverageBySources` summary |
496:2. Compute all derived values (coverage %, trend direction) from raw data
525:    research/research.md               # Workflow-owned progressive synthesis
529:    deep-research-dashboard.md         # Auto-generated session summary (read-only)
530:    findings-registry.json             # Reducer-owned question/finding registry
544:When `config.mode == "review"`, the state system adapts to track findings, dimensions, traceability coverage, and adjudicated severity instead of research questions and `newInfoRatio`.
572:      "blocked": 0,
609:The final review synthesis appends a review-mode event with machine-verifiable verdict state:
613:  "type": "event",
614:  "event": "synthesis_complete",
622:  "stopReason": "composite_converged",
629:| activeP0 | number | Yes | Active blocker findings at synthesis time |
630:| activeP1 | number | Yes | Active required findings at synthesis time |
631:| activeP2 | number | Yes | Active advisory findings at synthesis time |
632:| dimensionCoverage | number | Yes | Final dimension coverage ratio (0.0-1.0) |
647:      "blocked": 0,
674:| summary.blocked | number | Yes | Protocols blocked by missing context or artifacts |
678:| results[].status | string | Yes | `pass`, `partial`, `fail`, `blocked`, or `notApplicable` |
729:| Files Under Review | (none) | Per-file coverage state table |
736:The review synthesis output (`{spec_folder}/review/review-report.md`) contains 9 sections:
747:| 8 | Deferred Items | Advisory findings, blocked items, and follow-up checks |
748:| 9 | Audit Appendix | Coverage, convergence replay, and supporting audit detail |
766:    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery" },
767:    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed exploitable via boundary test" }

--- .opencode/skill/sk-deep-research/assets/deep_research_config.json ---
4:  "convergenceThreshold": 0.05,
15:    "sessionId": "",
20:      "resume",
35:      "key-questions",
36:      "answered-questions",
60:  "_optimizerManaged": {
61:    "description": "Fields managed by the offline loop optimizer (042.004). See optimizer-manifest.json for the canonical tunable/locked field registry.",
62:    "manifestPath": ".opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json",
63:    "tunableFields": ["convergenceThreshold", "stuckThreshold", "maxIterations"],
64:    "lockedFields": ["lineage", "reducer", "fileProtection", "sessionId", "status"],

--- .opencode/agent/deep-research.md ---
32:> **SPEC FOLDER PERMISSION:** @deep-research has explicit permission to write the `research/` packet, including `research/research.md`, inside spec folders. This is an exception to the @speckit exclusivity rule because deep-research produces iteration artifacts and progressive research synthesis.
41:- If a research question requires delegation, document it in findings and recommend it for a future iteration.
68:- `research/findings-registry.json` (if exists) -- Understand open/resolved questions and key findings
73:- Remaining key questions
76:- Lifecycle branch from `config.lineage.lineageMode` (`resume`, `restart`, `fork`, or `completed-continue`)
82:- Any category marked `PRODUCTIVE` -- PREFER these for related questions
88:- Pick the first unchecked question from "Key Questions (remaining)"
89:- If no questions remain, investigate areas with lowest coverage
119:**Source Diversity Rule** : Aim to cite **>=2 independent sources** per key finding. The orchestrator runs quality guards before accepting convergence that check source diversity, focus alignment, and single-weak-source answers. Findings backed by only one source are flagged.
163:1. Put worked/failed guidance, answered questions, and next-focus recommendations into the iteration file
179:- `insight`: Low newInfoRatio but important conceptual breakthrough discovered (e.g., a synthesis that reframes prior findings)
189:> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
199:- Reducing the number of open questions through synthesis
210:  - Leave `research/research.md` ownership to the synthesis phase.
213:The orchestrator generates a research dashboard and findings registry after each iteration, summarizing progress, coverage, and convergence trends. The agent does not update those reducer-owned files directly. However, your iteration data (newInfoRatio, status, focus, ruledOut, focusTrack, toolsUsed, sourcesQueried) feeds directly into those synchronized outputs.
248:    No questions? --> Investigate lowest-coverage area
249:      No coverage data? --> Report stuck (newInfoRatio = 0.0)
278:If approaching 12 tool calls, stop research and proceed to writing findings.
332:- Ask the user questions (autonomous execution)
337:- If all approaches exhausted and questions remain, document in findings
340:- If tool failures prevent any research, report timeout status
384:[x] Focus determined from strategy or key questions
393:[x] research/research.md updated (if progressive synthesis enabled)
407:| Inflate newInfoRatio | Delays convergence, wastes iterations | Calculate honestly from actual findings |
440:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
442:Route queries by intent: CocoIndex (`mcp__cocoindex_code__search`) for semantic discovery, Code Graph (`code_graph_query`/`code_graph_context`) for structural navigation, Memory (`memory_search`/`memory_context`) for session continuity.
456:│  +-- Report newInfoRatio for convergence detection                      │
460:│  |-- 2. Determine focus (from strategy or key questions)                │


exec
/bin/zsh -lc "printf '===== deep-review refs =====\\n'; for f in .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/convergence.md .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml .opencode/skill/sk-deep-review/assets/deep_review_config.json .opencode/agent/deep-review.md; do echo \"--- "'$f ---"; rg -n "stop|reason|resume|journal|event|lifecycle|convergence|snapshot|replay|wave|parallel|coverage|hotspot|inventory|finding|blocked|session" "$f" | head -n 120; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== deep-review refs =====
--- .opencode/skill/sk-deep-review/references/loop_protocol.md ---
3:description: Complete lifecycle specification for the autonomous deep review loop — initialization, iteration, convergence, synthesis, and save phases.
8:Complete lifecycle specification for the autonomous deep review loop.
15:The deep review loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the `@deep-review` agent (LEAF-only, no WebFetch) executes individual review iterations with fresh context each time.
38:Each agent dispatch gets a fresh context window. State continuity comes from files on disk, not in-context memory. This eliminates context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.
58:Set up all state files for a new review session. Discover the scope, order dimensions by risk priority, establish the traceability protocol plan, and create the review state packet.
62:1. **Classify session state before writing**:
64:   - `resume`: config + state + strategy all exist and agree
65:   - `completed-session`: consistent prior state with `config.status == "complete"`
106:6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
125:11. **Resume only if config, JSONL, strategy, and findings registry agree**; otherwise halt for repair instead of guessing.
133:| Registry | `{spec_folder}/review/deep-review-findings-registry.json` | Reducer-owned findings state |
134:| Strategy | `{spec_folder}/review/deep-review-strategy.md` | Dimensions, findings, next focus |
142:### Loop Steps (repeated until convergence)
146:- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
154:| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
155:| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
160:Run `shouldContinue_review()` (see `../sk-deep-research/references/convergence.md` Section 10.3):
164:- Composite convergence votes `STOP` only after:
166:  - Dimension coverage reaches 100% across the 4-dimension model
169:  - Evidence, scope, and coverage gates pass
180:**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.
188:   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
191:     Review paused. Delete review/.deep-review-pause to resume.
192:     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
194:   - Do NOT exit to synthesis -- the loop is suspended, not stopped
195:3. On resume (file deleted and loop restarted):
196:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
235:Active Findings: {findingsSummary}
239:  - Registry: {spec_folder}/review/deep-review-findings-registry.json
241:Output: Write findings to {spec_folder}/review/iterations/iteration-{NNN}.md
272:- `findingRefs`: Array of finding IDs generated from this protocol
283:   - `findingsSummary` (cumulative P0/P1/P2 counts)
284:   - `findingsNew` (this iteration's new findings)
286:3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
296:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding. This step prevents false positives from inflating severity and distorting convergence.
302:| `claim` | The specific assertion made by the finding |
315:4. Confirm or downgrade severity before the finding becomes convergence-visible
317:This adjudication step happens after iteration evaluation and before the next convergence math run. Findings that are downgraded have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
327:| Progress Table | Iteration number, focus dimension, `newFindingsRatio`, findings count, status |
341:- If convergence check returns STOP: exit to synthesis
352:| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay**: re-run the unresolved traceability protocol directly against the conflicting artifacts |
367:    return { strategy: "protocol_first_replay" }
374:- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
385:Compile all iteration findings into the final `{spec_folder}/review/review-report.md`. The synthesis phase owns the canonical review report output.
391:Consolidate findings across all iterations:
394:2. Group findings by file + line range + root cause
396:4. Assign final finding IDs: `F001`, `F002`, ...
397:5. Preserve the audit trail: note which iterations contributed to each merged finding
405:Recompute the convergence outcome from JSONL state before finalizing the report:
408:2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
409:3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
410:4. Re-run the evidence, scope, and coverage gates against stored findings and scope data
411:5. Compare the replayed decision and stop reason to the recorded synthesis event
413:Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result. If replay fails, log a warning in the audit appendix but proceed with synthesis.
423:| 3 | Active Finding Registry | Deduplicated active findings with evidence and final severity |
424:| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
428:| 8 | Deferred Items | P2 advisories, blocked checks, and follow-up items |
429:| 9 | Audit Appendix | Coverage, replay validation, convergence evidence |
441:When `PASS` verdict is issued and active P2 findings remain, set `hasAdvisories = true` in the report metadata.
449:     "type": "event",
450:     "event": "synthesis_complete",
458:     "stopReason": "...",
471:Preserve review context to the memory system for future session recovery and cross-session continuity.
494:<!-- ANCHOR:auto-resume-protocol -->
499:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
503:If state files already exist from a prior session:
505:1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
507:3. **Read strategy**: Load current dimension progress, findings, and next focus from `deep-review-strategy.md`
509:5. **Log resume**: Append resume event to JSONL with lineage metadata:
511:   {"type":"event","event":"resumed","lineageMode":"resume","sessionId":"rvw-...","generation":1,"fromIteration":N}
519:| `resume` | Continue the same `sessionId` and generation. |
520:| `restart` | Archive current review state, start a new `sessionId`, increment generation, and set `parentSessionId`. |
521:| `fork` | Copy current state as baseline, create a new `sessionId`, preserve ancestry, and continue on a new branch. |
528:| Config + JSONL + strategy all exist and agree | `resume` | Continue from last iteration + 1 |
529:| All exist, config says `status: "complete"` | `completed-session` | Report completion, ask user if re-review desired |
540:| 2 | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract dimensions, findings, coverage |
549:<!-- /ANCHOR:auto-resume-protocol -->
550:<!-- ANCHOR:pause-resume -->
568:- A paused event is logged to JSONL
569:- The user is notified with current state (iteration count, dimensions covered, findings)
580:- The auto-resume protocol (Section 6) detects the existing state
581:- A resumed event is logged to JSONL
591:| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
597:<!-- /ANCHOR:pause-resume -->
606:[EVALUATING] --> iteration complete, checking convergence
613:[STUCK_RECOVERY] --> change granularity / protocol replay / escalate severity
615:    |-- recovered (new P0/P1 or coverage advance) --> [ITERATING]
621:    |-- sentinel removed --> [ITERATING] (resume)
623:[SYNTHESIZING] --> finding dedup, severity reconcile, replay validate, compile report
634:- `complete`: Normal iteration with findings processed
637:- `stuck`: Iteration produced no meaningful new findings
638:- `insight`: Low `newFindingsRatio` but important finding that changes the verdict trajectory
651:| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
674:Three binary gates must pass before a STOP decision is finalized. These gates are defined in `review_mode_contract.yaml` under `qualityGates` and are evaluated after the composite convergence score exceeds the `compositeStopScore` threshold.
680:| **Evidence** | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, log `guard_violation`, continue loop |
687:function checkReviewQualityGates(state, config, coverage):
691:  for f in state.findings where f.status == "active":
693:      violations.push({ gate: "evidence", findingId: f.id,
694:                        detail: "Active finding lacks evidence or is inference-only" })
698:  for f in state.findings where f.status == "active":
700:      violations.push({ gate: "scope", findingId: f.id,
704:  if coverage.dimensionCoverage < 1.0:
705:    violations.push({ gate: "coverage",
707:  if not coverage.requiredProtocolsCovered:
708:    violations.push({ gate: "coverage",
719:{"type":"event","event":"guard_violation","gate":"<name>","iteration":N,"detail":"<reason>"}
734:| Loop Protocol (research) | `../sk-deep-research/references/loop_protocol.md` | Research loop lifecycle (this file adapts Section 9) |
736:| Convergence | `../sk-deep-research/references/convergence.md` | `shouldContinue_review()` (Section 10), stuck recovery, quality guards |

--- .opencode/skill/sk-deep-review/references/convergence.md ---
15:Convergence detection determines when the autonomous review loop should stop iterating. After every iteration the orchestrator evaluates three possible outcomes:
19:| **CONTINUE** | More review work is expected to yield meaningful new findings. Dispatch the next iteration. |
23:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
25:Release-readiness states are derived alongside convergence:
26:- `in-progress` while coverage is incomplete or new P0/P1 findings are still appearing
27:- `converged` once coverage and stabilization pass without new P0/P1 findings
28:- `release-blocking` whenever unresolved P0 findings remain active
35:| `convergenceThreshold` | 0.10 | General convergence sensitivity |
40:| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |
44:Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus a typed `legalStop` record.
46:#### stopReason Enum
48:| `stopReason` | Meaning |
50:| `converged` | All convergence signals met and legal-stop gates passed. |
51:| `maxIterationsReached` | Iteration limit hit before convergence. |
53:| `blockedStop` | Convergence math voted stop but legal-stop gates failed. |
62:  "blockedBy": ["dimensionCoverage", "p0Resolution"],
64:    "findingStability": { "pass": true, "detail": "Rolling average, MAD noise floor, and novelty ratio all voted STOP." },
65:    "dimensionCoverage": { "pass": false, "detail": "Maintainability has not been examined yet and required review coverage is incomplete." },
66:    "p0Resolution": { "pass": false, "detail": "1 unresolved P0 finding remains active." },
67:    "evidenceDensity": { "pass": true, "detail": "Evidence density met the configured threshold across active findings." },
68:    "hotspotSaturation": { "pass": true, "detail": "Priority hotspots were revisited enough times to satisfy saturation." }
70:  "replayInputs": {
78:    "hotspotCoverage": { "saturated": 2, "required": 2 },
84:- `blockedBy`: Array of gate names that failed. Empty when STOP is legal.
85:- `gateResults`: Map of review-specific gate name to pass/fail plus detail. Deep review records `findingStability`, `dimensionCoverage`, `p0Resolution`, `evidenceDensity`, and `hotspotSaturation`.
86:- `replayInputs`: Snapshot of the concrete inputs used to replay the stop decision.
87:- Blocked-stop events also persist a top-level `recoveryStrategy` describing what the next iteration should do before another stop attempt.
96:4. **Composite convergence** -- 3-signal weighted vote with threshold 0.60.
97:5. **Legal-stop gate bundle** -- review-specific stop gates; if a stop vote fails any gate, persist `stopReason=blockedStop` and continue.
103:<!-- ANCHOR:hard-stops -->
106:Hard stops are evaluated first and override all other signals.
112:  return { action: "STOP", stopReason: "maxIterationsReached" }
115:The loop stops unconditionally. Synthesis runs with whatever findings exist.
120:if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
121:  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
122:    if buildReviewLegalStop(state, config, coverage).passed:
123:      return { action: "STOP", stopReason: "converged" }
126:Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and the 5-gate legal-stop bundle passes. If gates fail, the loop records `stopReason=blockedStop` and continues despite full coverage.
130:<!-- /ANCHOR:hard-stops -->
155:When `stuckCount >= stuckThreshold`, the orchestrator invokes the recovery protocol (Section 8) before deciding whether to continue or stop.
157:The recovery entry uses `stopReason=stuckRecovery` while the loop is in recovery. If recovery later terminates the run, the terminal record keeps the same shared enum value instead of minting a review-only label.
162:<!-- ANCHOR:composite-convergence -->
165:Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold.
169:| Rolling Average | 0.30 | 2 | Recent severity-weighted finding yield |
171:| Novelty Ratio | 0.45 | 1 | Latest severity-weighted novelty ratio against `convergenceThreshold` |
199:Highest-weight signal. Votes STOP when the latest severity-weighted novelty ratio falls at or below `convergenceThreshold` (default 0.10).
202:noveltyStop = latestRatio <= config.convergenceThreshold
208:stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
209:if stopScore >= 0.60:   // proceed to quality gate evaluation
216:Two additional signals provide deeper semantic analysis of review iteration quality. These signals are ADDITIONAL to the 3-signal composite vote above and participate in the legal-stop gate evaluation rather than the composite stop-score.
220:Measures how much genuinely new review insight each iteration contributes beyond surface-level overlap with prior findings. Unlike `newFindingsRatio` (which is severity-weighted), `semanticNovelty` evaluates the conceptual novelty of findings independent of severity weighting.
225:| 0.4-0.7 | Mix of new review insights and restatements of prior findings |
227:| 0.0 | No semantically novel findings detected |
240:#### findingStability (0.0-1.0)
242:Measures how stable the cumulative finding set is across iterations. A high stability score means the finding registry is not materially changing between iterations -- findings are not being added, upgraded, downgraded, or invalidated at a significant rate.
247:| 0.6-0.8 | Moderate stability; some findings still evolving |
248:| 0.3-0.5 | Active churn; findings being added, merged, or reclassified frequently |
264:- `findingStability >= 0.85` supports STOP: the finding set has stabilized and further iterations are unlikely to materially change the review outcome.
265:- `findingStability < 0.50` prevents STOP: the finding set is still in flux and the review has not reached a stable assessment.
269:The two semantic signals integrate with the existing 5-gate legal-stop bundle (Section 6):
271:1. **findingStability gate** (existing): The existing `findingStability` gate already evaluates rolling average, MAD noise floor, and novelty ratio. The new `semanticNovelty` signal adds a sub-check:
275:2. **findingStability signal** (new): The `findingStability` metric (0.0-1.0) is surfaced alongside the existing convergence signals. It supports the `findingStability` gate evaluation by providing a registry-level stability measure that complements the ratio-based churn signals.
277:The gate passes only when both the existing churn-based checks AND the semantic stability checks agree. When a semantic check fails, the `legalStop.gateResults.findingStability` detail string includes the semantic signal values.
281:The stop-decision event includes which semantic signals supported or prevented STOP:
285:  "type": "event",
286:  "event": "stop_decision",
289:    "findingStability": { "value": 0.92, "supportsStop": true }
291:  "semanticVerdict": "all_support_stop",
298:| `all_support_stop` | Both semantic signals support stopping |
299:| `mixed` | One signal supports stop, the other does not |
300:| `all_prevent_stop` | Both semantic signals indicate more work is needed |
307:| 1 | Novelty ratio only (weight 1.0) | Very unlikely to stop without later confirmation from rolling churn signals |
311:Semantic convergence signals (`semanticNovelty`, `findingStability`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.
315:<!-- /ANCHOR:composite-convergence -->
319:The review loop uses `newFindingsRatio` instead of `newInfoRatio`. It weights findings by severity so that critical discoveries count far more than minor suggestions.
335:weightedNew       = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
336:weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
337:weightedTotal     = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)
342:- `fully_new_findings` -- findings not present in any prior iteration (new findingId).
343:- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
352:if total_findings == 0:
356:A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.
364:Deep review treats STOP as legal only when the full review-specific gate bundle passes together. Convergence math may request STOP, but the workflow must still evaluate these 5 gates and persist a blocked-stop event when any gate fails.
368:| **findingStability** | Rolling average, MAD noise floor, and novelty ratio must all indicate low-yield review churn | Block STOP, persist `blockedStop` |
369:| **dimensionCoverage** | Every configured review dimension must have been examined at least once, with required traceability coverage stabilized | Block STOP, persist `blockedStop` |
370:| **p0Resolution** | No unresolved P0 findings may remain active at stop time | Block STOP, persist `blockedStop` |
371:| **evidenceDensity** | Evidence density across active findings must meet the configured threshold | Block STOP, persist `blockedStop` |
372:| **hotspotSaturation** | Review hotspots must be revisited enough times to satisfy the saturation heuristic | Block STOP, persist `blockedStop` |
377:function buildReviewLegalStop(state, config, coverage):
379:    findingStability: {
380:      pass: rollingStop and madStop and state.latestNoveltyRatio <= config.convergenceThreshold,
381:      detail: "Rolling average, MAD noise floor, and novelty ratio are all below stop thresholds."
384:      pass: everyConfiguredDimensionExaminedAtLeastOnce(coverage, config.reviewDimensions) and
385:            coverage.requiredProtocolsCovered and
386:            coverage.stabilizationPasses >= 1,
387:      detail: "All configured review dimensions have been examined, required traceability protocols are covered, and stabilization has aged enough to stop."
391:      detail: "No unresolved P0 findings remain and blocker adjudication is complete."
395:      detail: "Evidence density meets the configured threshold for active findings."
397:    hotspotSaturation: {
398:      pass: computeHotspotSaturation(state.hotspots) >= config.hotspotSaturationThreshold,
399:      detail: "Priority hotspots received enough revisits to satisfy saturation."
403:  blockedBy = [name for name, result in gateResults.items() if not result.pass]
405:    pass: len(blockedBy) == 0,
406:    blockedBy,
411:When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class blocked-stop decision with `stopReason=blockedStop`, populate `legalStop.blockedBy` from the failing gates, copy the full `gateResults`, snapshot the replay inputs, and attach a `recoveryStrategy` describing the next review action before overriding the decision to CONTINUE.
417:| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
420:| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
421:| `hotspotSaturation` | Revisit undersampled hotspots or adjacent call sites until the saturation heuristic passes. |
425:Use this table when replaying old packets or translating older prose/docs into the shared stop contract.
427:| Legacy label | New `stopReason` | Mapping note |
430:| `composite_converged` | `converged` | Legacy convergence-math wording now rolls into shared terminal success. |
431:| `all dimensions clean` | `converged` | Old operator-facing prose for the same successful stop. |
433:| `max iterations` | `maxIterationsReached` | Old operator-facing hard-stop wording. |
434:| `pause sentinel detected` | `userPaused` | Sentinel pause is now a shared user-directed stop reason. |
435:| `guard_override` | `blockedStop` | Legacy continue override when a stop vote failed legal gates. |
436:| `quality guard failed` | `blockedStop` | Older prose for the same blocked-stop outcome. |
437:| `P0 override blocks convergence` | `blockedStop` | Legacy review wording for a stop attempt that was not legal to finalize. |
448:The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.
452:| **FAIL** | `activeP0 > 0` OR any legal-stop gate fails at terminal stop time | Does not meet quality standards. Blocks release. |
477:| FAIL | `/spec_kit:plan` -- create remediation plan from findings |

--- .opencode/skill/sk-deep-review/references/state_format.md ---
21:| `deep-review-findings-registry.json` | JSON | Auto-generated reducer state |
33:    deep-review-findings-registry.json
59:  "sessionId": "rvw-2026-04-03T12-00-00Z",
65:  "convergenceThreshold": 0.10,
81:    "deep-review-findings-registry.json": "auto-generated",
92:    "outputs": ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
95:      "findingsBySeverity",
98:      "convergenceScore"
112:| sessionId | string | -- | Stable identifier for the current review lineage |
114:| lineageMode | string | `"new"` | `new`, `resume`, `restart`, `fork`, `completed-continue` |
118:| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
168:{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
179:  "sessionId": "rvw-2026-04-03T12-00-00Z",
181:  "lineageMode": "resume",
184:  "findingsCount": 4,
185:  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
186:  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
192:**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
194:**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`
201:| sessionId | string | Current lineage session identifier |
204:| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
205:| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
206:| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |
212:| rollingAvg | 0.30 | Rolling average of severity-weighted new findings |
214:| dimensionCoverage | 0.45 | Required dimension + protocol coverage stability |
215:| compositeStop | -- | Weighted stop score (stop if > 0.60) |
223:  "type": "event", "event": "synthesis_complete", "mode": "review",
226:  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
231:**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
250:      "fail": 1, "blocked": 0, "notApplicable": 0, "gatingFailures": 1
255:      "evidence": ["README.md:48"], "findingRefs": ["F004"],
264:| summary.required / executed / pass / partial / fail / blocked / notApplicable | number | Yes | Protocol execution counts |
267:| results[].status | string | Yes | `pass`, `partial`, `fail`, `blocked`, `notApplicable` |
272:| results[].findingRefs | string[] | No | Related finding identifiers |
280:- `findingsSummary` and `findingsNew` must each contain `P0`, `P1`, `P2` keys
297:| running-findings | Each iteration | P0/P1/P2 active counts + deltas |
301:| ruled-out-directions | Each iteration | Eliminated directions with reasons |
305:| files-under-review | Each iteration | Per-file coverage state table |
314:| running-findings | _(none — review-specific)_ |
325:3. Update running-findings with P0/P1/P2 counts and deltas
328:6. Set next-focus based on remaining dimensions and open findings
333:<!-- ANCHOR:findings-registry -->
334:## 5. FINDINGS REGISTRY (deep-review-findings-registry.json)
336:Reducer-owned JSON document regenerated after every iteration and lifecycle transition.
340:  "sessionId": "rvw-2026-04-03T12-00-00Z",
342:  "lineageMode": "resume",
352:  "findingsBySeverity": {
359:  "convergenceScore": 0.44
367:<!-- /ANCHOR:findings-registry -->
384:- New findings: P0=[n] P1=[n] P2=[n]
385:- Refined findings: P0=[n] P1=[n] P2=[n]
386:- New findings ratio: [0.0-1.0]
405:- New findings ratio: [0.0-1.0]
419:Every finding must include: unique ID (`F001`...), severity (`P0`/`P1`/`P2`), concrete `file:line` evidence, and dimension tag.
433:| 3 | Active Finding Registry | Deduped active findings with evidence, severity, dimension |
435:| 5 | Spec Seed | Minimal spec updates implied by findings |
436:| 6 | Plan Seed | Initial remediation tasks from findings |
438:| 8 | Deferred Items | Advisory findings, blocked items, follow-up checks |
439:| 9 | Audit Appendix | Coverage, convergence replay, audit detail |
441:**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.
445:**Active Finding Registry** lists each active finding with findingId, severity, dimension, title, file:line evidence, first/last seen iteration, and status.
447:**Remediation Workstreams** group related findings into ordered lanes with constituent finding IDs and execution order.
449:**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.
453:**Deferred Items** captures advisory findings, blocked protocols, and future follow-up checks.
455:**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.
466:- **Generated from**: JSONL state log + strategy + findings registry
476:| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
477:| Trend | JSONL signals | Rolling average, composite stop score, trajectory |
487:When a finding's severity is ambiguous, apply structured adjudication before finalizing.
499:3. **Alternative explanation**: [Legitimate reason for the behavior?]
509:| Re-verify evidence | Confirm finding is real and reproducible |
519:- Every transition is recorded in the finding's `transitions` array
524:<!-- ANCHOR:finding-registry -->
527:Each finding is tracked with a unique identifier enabling deduplication, severity transitions, and status lifecycle.
533:  "findingId": "F003",
543:    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery" },
544:    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed exploitable" }
551:| findingId | string | Sequential unique ID: `F001`, `F002`, ... |
580:Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.
597:| Evidence | Every active finding backed by concrete file:line evidence |
601:All three gates must pass before STOP. Gate failure forces `verdict: "FAIL"` regardless of finding counts.
605:<!-- /ANCHOR:finding-registry -->

--- .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml ---
3:# convergence settings, cross-reference protocols, downstream render targets,
97:  # Binary gates applied after convergence math votes STOP.
105:      rule: Every active finding must be backed by concrete file:line evidence and may not rely only on inference.
112:    - id: coverage
116:        - severity-coverage
120:  # Review-specific convergence settings calibrated from the v2 research.
121:  convergence:
124:      convergenceThreshold: 0.10
129:        description: Rolling average of severity-weighted new findings across recent evidence-bearing iterations.
133:      - id: dimension-coverage
135:        description: Coverage vote based on required dimension completion plus required protocol coverage stability.
140:    coverageAge:
147:  lifecycleModes:
149:      description: Create a brand-new review lineage with generation 1 and no parent session.
150:    - id: resume
160:    - sessionId
173:      - findingsRegistry
179:      schemaMismatch: reject-with-conflict-event
184:      description: Review is ongoing or coverage is incomplete.
186:      description: All dimensions are covered and no new P0/P1 findings appeared in the latest stabilization pass.
188:      description: At least one unresolved P0 finding is present.
199:      partialCriteria: Some claims resolve, but one or more claims remain ambiguous or blocked by missing evidence.
231:      partialCriteria: Catalog coverage is incomplete or stale, but no confirmed contradiction to shipped behavior is present.
242:  # Output contracts consumed by synthesis and replay tooling.
248:        - sessionId
254:    findingsRegistry:
255:      pathPattern: "{spec_folder}/review/deep-review-findings-registry.json"
262:        - findingsBySeverity
263:        - convergenceScore
269:        - active-finding-registry
282:        - running-findings
297:        - findings-summary
298:        - dimension-coverage
316:          - findingsCount
317:          - findingsSummary
318:          - findingsNew
320:          - sessionId
328:          - findingsRefined
329:          - findingRefs
331:          - coverage
337:          - convergenceSignals
341:          - event
349:          - stopReason
367:        - convergence
381:        - convergence
448:    - id: review-contract-snapshot
449:      path: .opencode/skill/sk-deep-review/assets/review_mode_contract_snapshot.md
453:        begin: "<!-- BEGIN GENERATED: review-mode-contract/snapshot -->"
454:        end: "<!-- END GENERATED: review-mode-contract/snapshot -->"
462:        - convergence
480:      description: Ensure JSONL iteration and synthesis-event fields match the outputs contract.
481:    - id: lifecycle-parity
482:      description: Ensure lifecycle mode docs and workflow branches agree on new, resume, restart, fork, and completed-continue semantics.
484:      description: Ensure reducer inputs, outputs, and findings-registry metrics are documented consistently across assets and runtime mirrors.
487:    - id: runtime-coverage
488:      description: Ensure every supported runtime deep-review agent has a declared render artifact and parity coverage.

--- .opencode/skill/sk-deep-review/assets/deep_review_config.json ---
3:  "sessionId": "",
10:  "convergenceThreshold": 0.10,
47:    "deep-review-findings-registry.json": "auto-generated",
63:      "findingsRegistry",
69:      "findingsBySeverity",
72:      "convergenceScore"
78:    "tunableFields": ["convergenceThreshold", "stuckThreshold", "maxIterations"],
79:    "lockedFields": ["lineageMode", "reducer", "fileProtection", "sessionId", "mode", "reviewDimensions"],

--- .opencode/agent/deep-review.md ---
3:description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."
23:Executes ONE review iteration within an autonomous review loop. Reads externalized state, reviews code quality across one dimension, produces P0/P1/P2 findings with file:line evidence, and updates state for the next iteration.
29:**IMPORTANT**: This agent is a hybrid of @review (quality rubric, severity classification, adversarial self-check) and the deep-review loop contract (state protocol, JSONL, lifecycle continuity). It reviews code but does NOT modify it.
40:- If a review question requires delegation, document it in findings and recommend it for a future iteration.
64:- `review/deep-review-findings-registry.json` -- Read reducer-owned active finding state (read-only for this agent)
71:- Prior findings (P0/P1/P2 counts)
93:- Escalate severity review of existing P2 findings
104:| memory_search | Check prior research findings | Find related spec folder work |
112:**Budget**: Choose a budget profile before starting review actions: `scan` (9-11 calls), `verify` (11-13 calls), or `adjudicate` (8-10 calls). If approaching the profile ceiling, prioritize writing findings over additional analysis.
114:**Quality Rule**: Every finding must cite a source:
122:Use the shared `P0` / `P1` / `P2` definitions and evidence requirements from `review_core.md`, then tag each finding with one primary review dimension: `correctness`, `security`, `traceability`, or `maintainability`.
124:Every new `P0` or `P1` finding MUST include a typed claim-adjudication packet in the iteration artifact:
129:  "claim": "One-sentence statement of the finding being adjudicated.",
131:  "counterevidenceSought": "What contradictory evidence was checked before confirming the finding.",
135:  "downgradeTrigger": "What evidence would justify downgrading or dismissing this finding."
169:- Hunter: [finding assessment]
183:{"type":"claim-adjudication","claim":"One-sentence statement of the P0/P1 finding being adjudicated.","evidenceRefs":["path/to/file:line"],"counterevidenceSought":"Adjacent code, docs, and prior iterations checked for contradictory evidence.","alternativeExplanation":"Most plausible non-bug explanation considered during skeptic/referee review.","finalSeverity":"P0|P1","confidence":0.90,"downgradeTrigger":"What evidence would justify reducing severity or marking this a false positive."}
204:[Investigated but not an issue, with reasoning]
210:- Confirmed findings: [N]
211:- New findings ratio: [0.XX]
235:{"type":"iteration","mode":"review","run":N,"status":"complete","focus":"[dimension - specific area]","dimension":"[dimension name]","dimensions":["[dimension name]"],"findingsCount":N,"newFindingsRatio":0.XX,"noveltyJustification":"...","findingsSummary":{"P0":N,"P1":N,"P2":N},"filesReviewed":["file1","file2"],"dimensionScores":{"correctness":N,"security":N,"traceability":N,"maintainability":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"findingsRefined":{"P0":N,"P1":N,"P2":N},"upgrades":[],"resolved":[],"findingRefs":["P1-001","P2-003"],"traceabilityChecks":{"summary":{"required":N,"executed":N,"pass":N,"partial":N,"fail":N,"blocked":N,"notApplicable":N,"gatingFailures":N},"results":[{"protocolId":"spec_code","status":"pass|partial|fail","gateClass":"hard|advisory","applicable":true,"counts":{"pass":N,"partial":N,"fail":N},"evidence":["path/to/file:line"],"findingRefs":["P1-001"],"summary":"One-line traceability result."}]},"coverage":{"filesReviewed":N,"filesTotal":N,"dimensionsComplete":[]},"ruledOut":["investigated-not-issue"],"focusTrack":"optional","timestamp":"ISO-8601","durationMs":NNNNN}
239:- `complete`: Normal iteration with evidence gathering and findings
243:- `insight`: Low newFindingsRatio but important conceptual finding (e.g., cross-reference contradiction)
253:> **Note:** The orchestrator enriches each iteration record with optional `segment` (default: 1) and `convergenceSignals` fields after the agent writes it. The agent does not write these fields.
258:weightedNew = sum(weight for each fully new finding)
259:weightedRefinement = sum(weight * 0.5 for each refinement finding)
260:weightedTotal = sum(weight for all findings this iteration)
263:- If no findings at all, set to 0.0
264:- **P0 override rule**: If ANY new P0 discovered, set `newFindingsRatio = max(calculated, 0.50)`. A single new P0 blocks convergence.
314:| **Evidence** | Every active finding is backed by concrete `file:line` evidence; no active `P0`/`P1` relies only on inference |
334:The orchestrator may enter this agent through any of these lifecycle modes:
335:- `resume`: Continue the active review session.
337:- `fork`: Start a child review session from an earlier lineage point.
338:- `completed-continue`: Re-open a previously completed session for additional review coverage.
341:- `sessionId`
349:- `review/deep-review-findings-registry.json` is the canonical reducer-owned finding registry.
365:| Findings registry | `review/deep-review-findings-registry.json` | Read only |
367:| Iteration findings | `review/iterations/iteration-{NNN}.md` | Write (create new) |
395:- Scoring mindset: +1 minor, +5 moderate, +10 critical finding
396:- Cast wide net. Include borderline findings. Err on the side of flagging
399:**Pass 2 -- SKEPTIC** (bias: disprove findings)
400:- Scoring mindset: +score for each disproved finding, -2x penalty for wrong dismissals
401:- Challenge each Hunter finding: "Is there codebase context making this acceptable?"
406:- Weigh Hunter evidence vs Skeptic challenge for each finding
407:- Only CONFIRMED findings enter the iteration file
408:- If unsure: keep the finding but downgrade severity
413:- Document in finding entry
424:**Sycophancy Warning:** If you notice yourself wanting to inflate findings to seem thorough or dismiss issues to avoid conflict -- that is the bias this protocol exists to catch. Trust the evidence, not your inclination.
433:3. Externalize all findings to iteration file (never hold in context)
436:6. Cite file:line evidence for every finding
444:2. Hold findings in context without writing to files
447:5. Skip convergence evaluation data (newFindingsRatio, noveltyJustification)
450:8. Fabricate findings or inflate severity (phantom issues)
456:2. When findings contradict prior iteration conclusions
459:5. If tool failures prevent any review, report timeout status
475:[x] State files read at start (JSONL + findings registry + strategy + config)
478:[x] All findings cite file:line evidence
480:[x] New P0/P1 findings include typed claim-adjudication packets
482:[x] review/deep-review-strategy.md updated (dimensions, findings, next focus)
484:[x] Config lineage fields respected as read-only session contract
503:**Findings**: [N] findings (P0: [X], P1: [Y], P2: [Z])
524:| Inflating findings | Phantom issues delay convergence, erode trust | Honest severity based on evidence |
527:| Generic findings | Unactionable without specific location | Every finding must cite file:line |
530:| Hold findings in memory | Lost when context ends, no continuity | Write everything to iteration-NNN.md |
564:| `references/convergence.md` | Convergence algorithm details |
570:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
572:Route queries by intent: CocoIndex (`mcp__cocoindex_code__search`) for semantic discovery, Code Graph (`code_graph_query`/`code_graph_context`) for structural navigation, Memory (`memory_search`/`memory_context`) for session continuity.
584:│  ├── Produce P0/P1/P2 findings            │


exec
/bin/zsh -lc "sed -n '260,520p' .opencode/command/improve/agent.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

**Static mode (scoring_mode = static):**
Load profile from `.opencode/skill/sk-improve-agent/assets/target-profiles/{target_profile}.json`

### Step 4: Initialize Runtime

Create the improvement directory structure and copy templates:
```bash
mkdir -p {spec_folder}/improvement/candidates {spec_folder}/improvement/benchmark-runs/{target_profile}
```
Copy config, strategy, charter, and manifest from skill assets into runtime root.

### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/improve_agent-improver_auto.yaml`
- **INTERACTIVE** -> `assets/improve_agent-improver_confirm.yaml`

Execute the YAML workflow step by step. Each iteration:
1. Scan integration surfaces (refresh)
2. Dispatch `@agent-improver` to write one bounded candidate
3. Score candidate (dynamic 5D or static profile)
4. Run benchmark fixtures
5. Append results to JSONL ledger
6. Reduce state, refresh dashboard
7. Check stop conditions (plateau, max iterations, infra failure)

### Step 6: Review Results

After loop exits, present:
- `{spec_folder}/improvement/agent-improvement-dashboard.md` — dimensional progress + stop status
- `{spec_folder}/improvement/experiment-registry.json` — per-profile metrics + best-known state
- Recommendation: continue, promote (if eligible), or stop

### Step 7: Return Status

- Completed normally: `STATUS=OK ITERATIONS={N} BEST_SCORE={score}`
- User cancelled: `STATUS=CANCELLED`
- Max iterations: `STATUS=OK REASON="max_iterations_reached"`
- Plateau: `STATUS=OK REASON="all_dimensions_plateaued"`
- Error: `STATUS=FAIL ERROR="{message}"`

---

## 5. EXAMPLES

### Evaluate Handover Agent (Static Profile, Interactive)

```
/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder=specs/041/008
```

### Evaluate Any Agent (Dynamic Profile, Autonomous)

```
/improve:agent ".opencode/agent/debug.md" :auto --iterations=3
```

### Quick Integration Health Check

```
/improve:agent ".opencode/agent/review.md" :auto --iterations=1
```

### Prompt for Target Selection

```
/improve:agent :confirm
```
Setup phase lists available agents and asks for selection.

---

## 6. EXAMPLE OUTPUT

```
Agent Improvement Loop Complete
────────────────────────────────

Target: .opencode/agent/handover.md
Profile: handover (static)
Scoring: 5-dimension dynamic
Iterations: 3

Dimensional Scores (final):
  Structural:    100 (best: 100, trend: ->)
  Rule Coherence: 95 (best: 95, trend: ->)
  Integration:   100 (best: 100, trend: ->)
  Output Quality:  90 (best: 95, trend: down)
  System Fitness: 100 (best: 100, trend: ->)

Weighted Score: 97/100
Stop Reason: All dimensions plateaued after 3 iterations

Artifacts:
  Dashboard: specs/041/008/improvement/agent-improvement-dashboard.md
  Registry:  specs/041/008/improvement/experiment-registry.json
  Candidates: 3 written to specs/041/008/improvement/candidates/

STATUS=OK ITERATIONS=3 BEST_SCORE=97 REASON="all_dimensions_plateaued"
```

---

## 7. NOTES

- **Skill dependency**: Requires `sk-improve-agent` at `.opencode/skill/sk-improve-agent/`
- **Promotion**: Only handover target with static profile is promotion-eligible. Dynamic profiles produce assessment only.
- **Scoring**: All 5 dimensions are deterministic (regex, string matching, file existence). No LLM-as-judge.
- **Stop rules**: Loop stops on dimension plateau (3+ identical scores), max iterations, or infra failure threshold.
- **Runtime parity**: Agent exists across 4 runtimes (.opencode, .claude, .codex, .agents). Scanner checks all.

---

## 8. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/spec_kit:complete` | Full spec-driven development workflow |
| `/spec_kit:handover` | Create session handover for continuing work |
| `/improve:prompt` | Improve AI prompts with DEPTH + CLEAR scoring |
| `/spec_kit:deep-review` | Iterative code review with convergence detection |

---

## 9. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed workflow without @general agent verification
- Started executing steps before all Setup Phase fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Inferred target agent from context, screenshots, or conversation history
- Auto-selected spec folder without user confirmation

**Workflow Violations (Steps 1-7):**
- Skipped integration scan before candidate generation
- Loaded wrong YAML workflow for execution mode
- Dispatched agents from this markdown command body (YAML owns loop execution)
- Promoted a non-eligible target (only handover with static profile can promote)
- Modified canonical agent file directly instead of writing packet-local candidate

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately
2. STATE: "I [specific violation]. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. CONTINUE to next step in sequence
```

**If ANY violation:** STOP -> State violation -> Return to correct step -> Complete properly

exec
/bin/zsh -lc "printf '===== improver scripts =====\\n'; for f in .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs .opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs .opencode/skill/sk-improve-agent/scripts/rollback-candidate.cjs; do echo \"--- "'$f ---"; sed -n '"'1,260p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== improver scripts =====
--- .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Integration Surface Scanner for sk-improve-agent                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.agents/agents/{name}.md',
];
const GLOBAL_DOC_PATHS = ['CLAUDE.md', '.claude/CLAUDE.md'];
const SKILL_ADVISOR_PATH = '.opencode/skill/scripts/skill_advisor.py';

// ─────────────────────────────────────────────────────────────────────────────
// 3. UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) continue;
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readOptional(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch (_e) { return null; }
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n/, '');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = val;
  }
  return fm;
}

function collectFiles(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  const files = [];
  walk(rootDir, files);
  return files;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SIGNAL-BASED MIRROR SYNC CHECK
// ─────────────────────────────────────────────────────────────────────────────
function extractSignals(body) {
  const signals = [];
  const re = /\*\*(.+?)\*\*/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    if (m[1].length > 20 && signals.length < 3) signals.push(m[1]);
  }
  return signals;
}

function checkMirrorSync(canonicalBody, mirrorContent) {
  if (mirrorContent === null) return 'missing';
  const signals = extractSignals(canonicalBody);
  if (signals.length === 0) return 'aligned';
  const mirrorBody = stripFrontmatter(mirrorContent);
  const hits = signals.filter((s) => mirrorBody.includes(s)).length;
  return hits >= 2 ? 'aligned' : 'diverged';
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SURFACE SCANNERS
// ─────────────────────────────────────────────────────────────────────────────
function scanCanonical(repoRoot, agentName) {
  const relPath = `.opencode/agent/${agentName}.md`;
  const content = readOptional(path.join(repoRoot, relPath));
  return { path: relPath, exists: content !== null, frontmatter: content ? parseFrontmatter(content) : null };
}

function scanMirrors(repoRoot, agentName, canonicalBody) {
  return MIRROR_TEMPLATES.map((tpl) => {
    const relPath = tpl.replace('{name}', agentName);
    const content = readOptional(path.join(repoRoot, relPath));
    return { path: relPath, exists: content !== null, syncStatus: checkMirrorSync(canonicalBody, content) };
  });
}

function scanFilesByExt(repoRoot, agentName, ext, patternFn) {
  const files = collectFiles(path.join(repoRoot, '.opencode/command'));
  const pattern = patternFn(agentName);
  const results = [];
  for (const file of files) {
    if (!file.endsWith(ext)) continue;
    const content = readOptional(file);
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      results.push({ path: path.relative(repoRoot, file), references: [...new Set(matches)] });
    }
  }
  return results;
}

function scanCommands(repoRoot, agentName) {
  return scanFilesByExt(repoRoot, agentName, '.md', (n) => new RegExp(`@${n}\\b`, 'g'));
}

function scanYamlWorkflows(repoRoot, agentName) {
  const yamlFiles = collectFiles(path.join(repoRoot, '.opencode/command'));
  const pattern = new RegExp(`(?:@${agentName}|\\b${agentName}\\b)`, 'g');
  const results = [];
  for (const file of yamlFiles) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    const content = readOptional(file);
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      results.push({ path: path.relative(repoRoot, file), references: [...new Set(matches)] });
    }
  }
  return results;
}

function scanSkills(repoRoot, agentName) {
  const skillDir = path.join(repoRoot, '.opencode/skill');
  if (!fs.existsSync(skillDir)) return [];
  const pattern = new RegExp(`\\b${agentName}\\b`, 'gi');
  const results = [];
  for (const entry of fs.readdirSync(skillDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(skillDir, entry.name, 'SKILL.md');
    const content = readOptional(skillMd);
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches) results.push({ path: path.relative(repoRoot, skillMd), referenceCount: matches.length });
  }
  return results;
}

function scanGlobalDocs(repoRoot, agentName) {
  const pattern = new RegExp(`\\b${agentName}\\b`, 'gi');
  const results = [];
  for (const relPath of GLOBAL_DOC_PATHS) {
    const content = readOptional(path.join(repoRoot, relPath));
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches) results.push({ path: relPath, referenceCount: matches.length });
  }
  return results;
}

function scanSkillAdvisor(repoRoot, agentName) {
  const content = readOptional(path.join(repoRoot, SKILL_ADVISOR_PATH));
  return { path: SKILL_ADVISOR_PATH, matched: content !== null && new RegExp(`\\b${agentName}\\b`, 'i').test(content) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv.slice(2));
  const agentName = args.agent;
  const repoRoot = path.resolve(args['repo-root'] || '.');
  const outputPath = args.output;

  if (!agentName) {
    process.stderr.write('Usage: node scan-integration.cjs --agent=<name> [--repo-root=.] [--output=path.json]\n');
    process.exit(2);
  }

  const canonical = scanCanonical(repoRoot, agentName);
  const canonicalContent = readOptional(path.join(repoRoot, canonical.path));
  const canonicalBody = canonicalContent ? stripFrontmatter(canonicalContent) : '';
  const mirrors = scanMirrors(repoRoot, agentName, canonicalBody);
  const commands = scanCommands(repoRoot, agentName);
  const yamlWorkflows = scanYamlWorkflows(repoRoot, agentName);
  const skills = scanSkills(repoRoot, agentName);
  const globalDocs = scanGlobalDocs(repoRoot, agentName);
  const skillAdvisor = scanSkillAdvisor(repoRoot, agentName);

  const existingMirrors = mirrors.filter((m) => m.exists).length;
  const missingMirrors = mirrors.filter((m) => m.syncStatus === 'missing').length;
  const divergedMirrors = mirrors.filter((m) => m.syncStatus === 'diverged').length;
  const totalSurfaces = (canonical.exists ? 1 : 0) + existingMirrors
    + commands.length + yamlWorkflows.length + skills.length
    + globalDocs.length + (skillAdvisor.matched ? 1 : 0);

  let mirrorSyncStatus = 'all-aligned';
  if (missingMirrors > 0) mirrorSyncStatus = 'has-missing';
  else if (divergedMirrors > 0) mirrorSyncStatus = 'has-divergence';

  const result = {
    status: 'complete',
    agent: agentName,
    timestamp: new Date().toISOString(),
    surfaces: { canonical, mirrors, commands, yamlWorkflows, skills, globalDocs, skillAdvisor },
    summary: {
      totalSurfaces,
      existingCount: totalSurfaces,
      missingCount: missingMirrors + (canonical.exists ? 0 : 1),
      mirrorSyncStatus,
      commandCount: commands.length,
      skillCount: skills.length,
    },
  };

  const json = JSON.stringify(result, null, 2) + '\n';
  process.stdout.write(json);
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), json, 'utf8');
  }
}

main();

--- .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Dynamic Target Profile Generator                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const W_STRUCT = 10;
const W_RULE = 8;
const W_CHECK = 5;
const W_ANTI = 8;
const SECTION_RE = /^## (\d+)\.\s+(.+)$/gm;
const H3_RE = /^### (.+)$/gm;
const CHECKLIST_RE = /^[□☐]\s+(.+)$/gm;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (const e of argv) {
    if (!e.startsWith('--')) { continue; }
    const [k, ...r] = e.slice(2).split('=');
    args[k] = r.length > 0 ? r.join('=') : true;
  }
  return args;
}

function writeJson(fp, v) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, `${JSON.stringify(v, null, 2)}\n`, 'utf8');
}

function allMatches(re, text) {
  const out = []; let m;
  const r = new RegExp(re.source, re.flags);
  while ((m = r.exec(text)) !== null) { out.push(m); }
  return out;
}

function listItems(text) {
  return text.split('\n')
    .filter((l) => /^[-*]\s+/.test(l.trim()))
    .map((l) => l.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRONTMATTER PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { return {}; }
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s+(.+)$/);
    if (kv && kv[2].trim()) { meta[kv[1]] = kv[2].trim(); }
  }
  return meta;
}

function parsePermissions(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { return {}; }
  const pb = fm[1].match(/permission:\s*\n((?:\s+\w+:\s+\w+\n?)+)/);
  if (!pb) { return {}; }
  const perms = {};
  for (const line of pb[1].split('\n')) {
    const m = line.trim().match(/^(\w+):\s+(\w+)$/);
    if (m) { perms[m[1]] = m[2]; }
  }
  return perms;
}

function permSummary(perms) {
  const allowed = [], denied = [];
  for (const [k, v] of Object.entries(perms)) {
    (v === 'allow' ? allowed : denied).push(k);
  }
  return { allowed, denied };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SECTION PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseSections(content) {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const marks = allMatches(SECTION_RE, body);
  const secs = {};
  for (let i = 0; i < marks.length; i++) {
    const name = marks[i][2].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const start = marks[i].index + marks[i][0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : body.length;
    secs[name] = body.slice(start, end).trim();
  }
  return secs;
}

function getSection(secs, ...names) {
  for (const n of names) {
    const key = Object.keys(secs).find((k) => k.includes(n.toUpperCase()));
    if (key) { return secs[key]; }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DERIVED CHECK EXTRACTORS
// ─────────────────────────────────────────────────────────────────────────────
function deriveStructural(secs) {
  const probes = [
    ['has-core-workflow', 'CORE WORKFLOW'], ['has-output-verification', 'OUTPUT VERIFICATION'],
    ['has-anti-patterns', 'ANTI'], ['has-capability-scan', 'CAPABILITY SCAN'],
    ['has-rules', 'RULES'], ['has-related-resources', 'RELATED RESOURCES'],
  ];
  return probes
    .filter(([, label]) => Object.keys(secs).some((k) => k.includes(label.toUpperCase())))
    .map(([id, label]) => ({ id, description: `Agent has ${label} section`, weight: id.includes('anti') ? 5 : W_STRUCT }));
}

function extractRuleBlock(text, heading) {
  const re = new RegExp(`###\\s+(?:${heading})\\s*\\n([\\s\\S]*?)(?=\\n###|\\n##|\\n$|$)`, 'i');
  const m = text.match(re);
  return m ? listItems(m[1]) : [];
}

function deriveRules(secs) {
  const rc = getSection(secs, 'RULES') || getSection(secs, 'OPERATING RULES') || '';
  const checks = [];
  extractRuleBlock(rc, 'ALWAYS|Always|✅\\s*ALWAYS').forEach((rule, i) => {
    checks.push({ id: `always-rule-${i}`, rule, type: 'always', weight: W_RULE });
  });
  extractRuleBlock(rc, 'NEVER|Never|❌\\s*NEVER').forEach((rule, i) => {
    checks.push({ id: `never-rule-${i}`, rule, type: 'never', weight: W_RULE });
  });
  extractRuleBlock(rc, '(?:⚠️\\s*)?ESCALATE\\s+(?:IF|WHEN)').forEach((rule, i) => {
    checks.push({ id: `escalate-${i}`, rule, type: 'escalate', weight: 3 });
  });
  return checks;
}

function deriveOutputChecks(secs) {
  const vc = getSection(secs, 'OUTPUT VERIFICATION', 'VERIFICATION');
  if (!vc) { return []; }
  const checks = [];
  const items = allMatches(CHECKLIST_RE, vc);
  items.forEach((m, i) => checks.push({ id: `checklist-${i}`, check: m[1].trim(), weight: W_CHECK }));
  const brackets = allMatches(/^\[]\s+(.+)$/gm, vc);
  brackets.forEach((m, i) => checks.push({ id: `checklist-${items.length + i}`, check: m[1].trim(), weight: W_CHECK }));
  return checks;
}

function deriveForbidden(secs) {
  const ac = getSection(secs, 'ANTI');
  if (!ac) { return []; }
  return ac.split('\n')
    .filter((l) => /^[-*]\s+\*\*[Nn]ever\b/.test(l.trim()))
    .map((l, i) => ({ id: `anti-${i}`, pattern: l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim(), weight: W_ANTI }));
}

function tableNames(text) {
  return text.split('\n')
    .filter((l) => /^\|/.test(l.trim()) && !/^\|[-\s|]+$/.test(l) && !/^\|\s*(Skill|Agent|Command|Purpose|Path)\s*\|/i.test(l))
    .map((r) => { const c = r.split('|').map((s) => s.trim()).filter(Boolean); return c.length ? c[0].replace(/`/g, '').replace(/^@/, '').trim() : null; })
    .filter(Boolean);
}

function deriveIntegration(secs) {
  const result = { commands: [], skills: [], agents: [] };
  const rc = getSection(secs, 'RELATED RESOURCES');
  if (!rc) { return result; }
  const subs = {};
  const h3s = allMatches(H3_RE, rc);
  for (let i = 0; i < h3s.length; i++) {
    const label = h3s[i][1].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const start = h3s[i].index + h3s[i][0].length;
    const end = i + 1 < h3s.length ? h3s[i + 1].index : rc.length;
    subs[label] = rc.slice(start, end).trim();
  }
  const addUnique = (arr, val) => { if (!arr.includes(val)) { arr.push(val); } };
  const cmdKey = Object.keys(subs).find((k) => k.includes('COMMAND'));
  if (cmdKey) { allMatches(/`(\/[^`]+)`/g, subs[cmdKey]).forEach((m) => addUnique(result.commands, m[1])); }
  const skillKey = Object.keys(subs).find((k) => k.includes('SKILL'));
  if (skillKey) { tableNames(subs[skillKey]).forEach((n) => addUnique(result.skills, n)); }
  const agentKey = Object.keys(subs).find((k) => k.includes('AGENT'));
  if (agentKey) { tableNames(subs[agentKey]).forEach((n) => addUnique(result.agents, n)); }
  return result;
}

function deriveMismatches(secs, perms) {
  const cc = getSection(secs, 'CAPABILITY SCAN');
  if (!cc) { return []; }
  const out = [];
  for (const row of cc.split('\n').filter((l) => /^\|\s*`/.test(l.trim()))) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) { continue; }
    const tool = cells[0].replace(/`/g, '');
    const norm = tool.replace(/_/g, '').toLowerCase();
    for (const [perm, val] of Object.entries(perms)) {
      if (val === 'deny' && norm.includes(perm.toLowerCase())) {
        out.push({ tool, permission: perm, status: 'deny' });
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROFILE BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildProfile(agentPath, content) {
  const meta = parseFrontmatter(content);
  const perms = parsePermissions(content);
  const secs = parseSections(content);
  const id = meta.name || path.basename(agentPath, '.md');
  return {
    id, family: 'derived', targetPath: agentPath, outputKind: 'markdown',
    promotionEligible: false, generated: true, generatedAt: new Date().toISOString(),
    agentMeta: {
      name: id, mode: meta.mode || 'subagent',
      temperature: parseFloat(meta.temperature) || 0.1,
      permissionSummary: permSummary(perms),
    },
    derivedChecks: {
      structural: deriveStructural(secs), ruleCoherence: deriveRules(secs),
      outputChecks: deriveOutputChecks(secs), forbiddenBehaviors: deriveForbidden(secs),
      integrationPoints: deriveIntegration(secs), capabilityMismatches: deriveMismatches(secs, perms),
    },
    benchmark: { fixtureDir: null, requiredAggregateScore: 75, minimumFixtureScore: 60, repeatabilityTolerance: 0 },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.agent) {
    process.stderr.write('Usage: node generate-profile.cjs --agent=<path-to-agent.md> [--output=<path.json>]\n');
    process.exit(2);
  }
  let content;
  try { content = fs.readFileSync(args.agent, 'utf8'); } catch (err) {
    process.stderr.write(`Failed to read agent file: ${err.message}\n`);
    process.exit(1);
  }
  const profile = buildProfile(args.agent, content);
  const json = `${JSON.stringify(profile, null, 2)}\n`;
  if (args.output) { writeJson(args.output, profile); }
  process.stdout.write(json);
}

main();

--- .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Candidate Scorer — 5-Dimension Evaluation Framework                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function safeRead(filePath) {
  try {
    return readUtf8(filePath);
  } catch (error) {
    return { error: error.message };
  }
}

function stripJsonComments(content) {
  return content
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function loadManifest(manifestPath) {
  if (!manifestPath) {
    return null;
  }
  const raw = safeRead(manifestPath);
  if (typeof raw !== 'string') {
    return { error: raw.error };
  }
  try {
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    return { error: `Manifest parse failed: ${error.message}` };
  }
}

function inferProfileId(targetPath, explicitProfile, manifest) {
  if (explicitProfile) {
    return explicitProfile;
  }
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.profileId) {
    return manifestTarget.profileId;
  }
  if (/context-prime/i.test(targetPath || '')) {
    return 'context-prime';
  }
  return 'handover';
}

function inferFamily(profileId, manifest, targetPath) {
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.family) {
    return manifestTarget.family;
  }
  return profileId === 'context-prime' ? 'session-bootstrap' : 'session-handover';
}

function buildScore(checkSpecs, content) {
  const lower = content.toLowerCase();
  const checks = [];
  const reasons = [];
  let total = 0;
  let hardReject = false;

  for (const spec of checkSpecs.weightedChecks) {
    const pass = spec.test(content, lower);
    checks.push({ key: spec.key, pass, weight: spec.weight });
    if (pass) {
      total += spec.weight;
    } else {
      reasons.push(`Missing or weak: ${spec.key}`);
      if (spec.hardReject) {
        reasons.push(`Hard reject: ${spec.key}`);
        hardReject = true;
      }
    }
  }

  for (const spec of checkSpecs.warningChecks) {
    const pass = spec.test(content, lower);
    checks.push({ key: spec.key, pass, weight: 0 });
    if (!pass) {
      reasons.push(`Warning: ${spec.key}`);
    }
  }

  for (const spec of checkSpecs.forbiddenChecks) {
    const pass = !spec.test(content, lower);
    checks.push({ key: spec.key, pass, weight: 0 });
    if (!pass) {
      reasons.push(`Hard reject: ${spec.key}`);
      hardReject = true;
    }
  }

  return {
    total,
    checks,
    reasons,
    hardReject,
  };
}

function createHandoverChecks() {
  return {
    weightedChecks: [
      {
        key: 'mentions-spec-files',
        weight: 15,
        hardReject: true,
        test: (_content, lower) => /spec\.md/.test(lower) && /plan\.md/.test(lower) && /tasks\.md/.test(lower),
      },
      {
        key: 'mentions-checklist-and-memory',
        weight: 15,
        hardReject: true,
        test: (_content, lower) => /checklist\.md/.test(lower) && /memory\//.test(lower),
      },
      {
        key: 'references-template',
        weight: 15,
        hardReject: true,
        test: (content) => /\.opencode\/skill\/system-spec-kit\/templates\/handover\.md/.test(content),
      },
      {
        key: 'leaf-only',
        weight: 10,
        test: (_content, lower) => /leaf-only/.test(lower) || /illegal nesting/.test(lower),
      },
      {
        key: 'no-fabrication-rule',
        weight: 10,
        test: (content) => /never create handovers without reading actual session state/i.test(content) || /never fabricate/i.test(content),
      },
      {
        key: 'path-convention',
        weight: 10,
        test: (content) => /path convention/i.test(content) && /\.opencode\/agent\/\*\.md/i.test(content),
      },
      {
        key: 'structured-output',
        weight: 10,
        test: (content, lower) => /"status"/.test(content) && /filepath/.test(lower) && /attempt_number/.test(lower),
      },
      {
        key: 'actual-source-reading',
        weight: 10,
        test: (_content, lower) => /read spec folder files before/i.test(lower) || /required context sources/i.test(lower),
      },
      {
        key: 'capability-scan',
        weight: 3,
        test: (_content, lower) => /capability scan/.test(lower),
      },
      {
        key: 'output-verification',
        weight: 3,
        test: (_content, lower) => /output verification/.test(lower) || /verification before return/.test(lower),
      },
      {
        key: 'related-resources',
        weight: 3,
        test: (_content, lower) => /related resources/.test(lower),
      },
      {
        key: 'simplicity',
        weight: 5,
        test: (content) => content.length < 14000,
      },
    ],
    warningChecks: [
      {
        key: 'placeholder-heavy',
        test: (content) => (content.match(/\[(actual extracted value|spec_path|spec_folder|action|task|N|extracted from context)\]/gi) || []).length <= 10,
      },
      {
        key: 'no-permissive-skip-context-language',
        test: (content) => !/(you may|can|should).{0,40}(skip reading|without reading)/i.test(content),
      },
    ],
    forbiddenChecks: [
      {
        key: 'nested-delegation',
        test: (content, lower) => /dispatch sub-agents/i.test(content) && !/illegal/.test(lower),
      },
    ],
  };
}

function createContextPrimeChecks() {
  return {
    weightedChecks: [
      {
        key: 'session-bootstrap-tools',
        weight: 20,
        hardReject: true,
        test: (_content, lower) => /session_bootstrap/.test(lower) && /session_health/.test(lower),
      },
      {
        key: 'read-only-contract',
        weight: 15,
        hardReject: true,
        test: (content, lower) => /read-only/.test(lower) || /cannot modify files/.test(lower),
      },
      {
        key: 'prime-package-format',
        weight: 15,
        hardReject: true,
        test: (content) =>
          content.includes('## Session Context') &&
          content.includes('## System Health') &&
          content.includes('## Structural Context') &&
          content.includes('## Recommended Next Steps') &&
          content.includes('## Tool Routing'),
      },
      {
        key: 'urgency-skip',
        weight: 10,
        test: (_content, lower) => /urgent/.test(lower) && /skip bootstrap/.test(lower),
      },
      {
        key: 'time-budget',
        weight: 10,
        test: (_content, lower) => /under 15 seconds/.test(lower),
      },
      {
        key: 'graceful-failure',
        weight: 10,
        test: (_content, lower) => /unavailable/.test(lower) && /never block/i.test(lower),
      },
      {
        key: 'bootstrap-fallback',
        weight: 5,

--- .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Benchmark Runner — Fixture and Integration Scoring                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function listJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter((entry) => entry.endsWith('.json'))
    .sort()
    .map((entry) => path.join(dir, entry));
}

function loadProfile(profileId, profilesDir) {
  const profilePath = path.join(profilesDir, `${profileId}.json`);
  return readJson(profilePath);
}

function compilePatterns(patterns) {
  return (patterns || []).map((value) => new RegExp(value, 'i'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE SCORING
// ─────────────────────────────────────────────────────────────────────────────

function scoreFixture(fixture, outputPath) {
  if (!fs.existsSync(outputPath)) {
    return {
      id: fixture.id,
      outputPath,
      score: 0,
      maxScore: 100,
      passed: false,
      missingHeadings: fixture.requiredHeadings || [],
      missingPatterns: fixture.requiredPatterns || [],
      forbiddenMatches: [],
      failureModes: ['missing-output'],
    };
  }

  const content = fs.readFileSync(outputPath, 'utf8');
  const missingHeadings = (fixture.requiredHeadings || []).filter((heading) => !content.includes(heading));
  const patternRegexes = compilePatterns(fixture.requiredPatterns);
  const missingPatterns = patternRegexes
    .map((regex, index) => ({ regex, source: fixture.requiredPatterns[index] }))
    .filter((entry) => !entry.regex.test(content))
    .map((entry) => entry.source);
  const forbiddenRegexes = compilePatterns(fixture.forbiddenPatterns);
  const forbiddenMatches = forbiddenRegexes
    .map((regex, index) => ({ regex, source: fixture.forbiddenPatterns[index] }))
    .filter((entry) => entry.regex.test(content))
    .map((entry) => entry.source);

  const headingScore =
    (fixture.requiredHeadings || []).length === 0
      ? 45
      : Math.round(45 * (((fixture.requiredHeadings || []).length - missingHeadings.length) / (fixture.requiredHeadings || []).length));
  const patternScore =
    (fixture.requiredPatterns || []).length === 0
      ? 35
      : Math.round(35 * (((fixture.requiredPatterns || []).length - missingPatterns.length) / (fixture.requiredPatterns || []).length));
  const cleanScore =
    (fixture.forbiddenPatterns || []).length === 0
      ? 20
      : Math.round(20 * (((fixture.forbiddenPatterns || []).length - forbiddenMatches.length) / (fixture.forbiddenPatterns || []).length));

  const score = headingScore + patternScore + cleanScore;
  const failureModes = [];
  if (missingHeadings.length > 0) {
    failureModes.push('missing-headings');
  }
  if (missingPatterns.length > 0) {
    failureModes.push('missing-required-patterns');
  }
  if (forbiddenMatches.length > 0) {
    failureModes.push('forbidden-patterns');
  }

  return {
    id: fixture.id,
    outputPath,
    score,
    maxScore: 100,
    passed: failureModes.length === 0,
    missingHeadings,
    missingPatterns,
    forbiddenMatches,
    failureModes,
  };
}

function aggregateFailureModes(fixtures) {
  const counts = {};
  for (const fixture of fixtures) {
    for (const mode of fixture.failureModes || []) {
      counts[mode] = (counts[mode] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([mode]) => mode);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INTEGRATION SCORING
// ─────────────────────────────────────────────────────────────────────────────

function scoreIntegration(integrationReportPath) {
  const data = readJson(integrationReportPath);

  // --- Mirror sync score (base 100, penalize diverged/missing) ---
  const mirrors = data.mirrors || [];
  let mirrorScore = 100;
  for (const mirror of mirrors) {
    if (mirror.status === 'missing') {
      mirrorScore -= 30;
    } else if (mirror.status === 'diverged') {
      mirrorScore -= 20;
    }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const mirrorStatus =
    mirrorScore === 100
      ? 'all-aligned'
      : mirrors.some((entry) => entry.status === 'missing')
        ? 'has-missing'
        : 'has-divergence';

  // --- Command coverage (binary: at least 1 reference = 10 pts) ---
  const commandRefs = data.commandReferences || [];
  const commandCount = commandRefs.length;
  const commandScore = commandCount >= 1 ? 100 : 0;

  // --- Skill coverage (binary: at least 1 reference = 10 pts) ---
  const skillRefs = data.skillReferences || [];
  const skillCount = skillRefs.length;
  const skillScore = skillCount >= 1 ? 100 : 0;

  // --- Weighted average (mirror: 60%, command: 20%, skill: 20%) ---
  const integrationScore = Math.round(
    mirrorScore * 0.6 + commandScore * 0.2 + skillScore * 0.2
  );

  return {
    integrationScore,
    integrationDetails: {
      mirrorScore,
      commandScore,
      skillScore,
      mirrorStatus,
      commandCount,
      skillCount,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profileId = args.profile;
  const outputsDir = args['outputs-dir'];
  const outputPath = args.output;
  const stateLogPath = args['state-log'];
  const label = args.label || `${profileId}-benchmark`;
  const profilesDir = args['profiles-dir'] || '.opencode/skill/sk-improve-agent/assets/target-profiles';
  const integrationReportPath = args['integration-report'] || null;

  if (!profileId || !outputsDir || !outputPath) {
    process.stderr.write('Usage: node run-benchmark.cjs --profile=ID --outputs-dir=PATH --output=PATH [--state-log=PATH] [--label=STRING] [--profiles-dir=PATH] [--integration-report=PATH]\n');
    process.exit(2);
  }

  try {
    const profile = loadProfile(profileId, profilesDir);
    const fixtureFiles = listJsonFiles(profile.benchmark.fixtureDir);
    const fixtures = fixtureFiles.map((filePath) => readJson(filePath));
    const results = fixtures.map((fixture) => scoreFixture(fixture, path.join(outputsDir, `${fixture.id}.md`)));
    const aggregateScore = results.length === 0
      ? 0
      : Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length);
    const minimumFixtureScore = profile.benchmark.minimumFixtureScore;
    const aggregateThreshold = profile.benchmark.requiredAggregateScore;
    const recommendation =
      aggregateScore >= aggregateThreshold && results.every((entry) => entry.score >= minimumFixtureScore)
        ? 'benchmark-pass'
        : 'benchmark-fail';
    const report = {
      status: 'benchmark-complete',
      profileId: profile.id,
      family: profile.family,
      target: profile.targetPath,
      label,
      aggregateScore,
      maxScore: 100,
      recommendation,
      thresholds: {
        requiredAggregateScore: aggregateThreshold,
        minimumFixtureScore,
        repeatabilityTolerance: profile.benchmark.repeatabilityTolerance,
      },
      fixtures: results,
      failureModes: aggregateFailureModes(results),
    };

    if (integrationReportPath) {
      const integration = scoreIntegration(integrationReportPath);
      report.integrationScore = integration.integrationScore;
      report.integrationDetails = integration.integrationDetails;
    }

    writeJson(outputPath, report);

    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'benchmark_run',
        profileId: profile.id,
        family: profile.family,
        target: profile.targetPath,
        label,
        outputDir: outputsDir,

--- .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Ledger Reducer — Dashboard and Registry Generator                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readOptionalUtf8(filePath) {
  try {
    return readUtf8(filePath);
  } catch (_error) {
    return null;
  }
}

function parseJson(content, fallback) {
  try {
    return JSON.parse(content);
  } catch (_error) {
    return fallback;
  }
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function parseJsonl(content) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch (_error) {
        return [];
      }
    });
}

function inferProfileId(record) {
  if (record.profileId) {
    return record.profileId;
  }
  if (/context-prime/i.test(record.path || '') || /context-prime/i.test(record.target || '')) {
    return 'context-prime';
  }
  return 'handover';
}

function inferFamily(record, profileId) {
  if (record.family) return record.family;
  if (profileId === 'context-prime') return 'session-bootstrap';
  if (profileId === 'handover') return 'session-handover';
  return profileId;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROFILE BUCKET
// ─────────────────────────────────────────────────────────────────────────────

function createProfileBucket(profileId, family) {
  return {
    profileId,
    family,
    latestRecord: null,
    bestPromptRecord: null,
    bestBenchmarkRecord: null,
    acceptedCandidates: [],
    rejectedCandidates: [],
    benchmarkRuns: [],
    infraFailures: [],
    promptRecommendations: [],
    benchmarkRecommendations: [],
    failureModes: {},
    metrics: {
      totalRecords: 0,
      promptRuns: 0,
      benchmarkRuns: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      tieCount: 0,
      keepBaselineCount: 0,
      infraFailureCount: 0,
      benchmarkPassCount: 0,
      benchmarkFailCount: 0,
    },
    dimensionScores: {
      structural: [],
      ruleCoherence: [],
      integration: [],
      outputQuality: [],
      systemFitness: [],
    },
    dimensionTrends: {},
  };
}

function incrementFailureModes(bucket, record) {
  for (const mode of record.failureModes || []) {
    bucket.failureModes[mode] = (bucket.failureModes[mode] || 0) + 1;
  }
}

function maybeSetBestPrompt(bucket, record) {
  if (record.type === 'benchmark_run') {
    return;
  }
  const candidateScore = Number(record.score ?? record.totals?.candidate ?? -Infinity);
  const currentScore = Number(bucket.bestPromptRecord?.score ?? bucket.bestPromptRecord?.totals?.candidate ?? -Infinity);
  if (candidateScore > currentScore) {
    bucket.bestPromptRecord = record;
  }
}

function maybeSetBestBenchmark(bucket, record) {
  if (record.type !== 'benchmark_run') {
    return;
  }
  const currentScore = Number(bucket.bestBenchmarkRecord?.aggregateScore ?? -Infinity);
  if (Number(record.aggregateScore ?? -Infinity) > currentScore) {
    bucket.bestBenchmarkRecord = record;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGISTRY BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildRegistry(records) {
  const profiles = {};
  const globalMetrics = {
    totalRecords: records.length,
    targetProfiles: 0,
    promptRuns: 0,
    benchmarkRuns: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    tieCount: 0,
    keepBaselineCount: 0,
    infraFailureCount: 0,
    benchmarkPassCount: 0,
    benchmarkFailCount: 0,
  };

  for (const record of records) {
    const profileId = inferProfileId(record);
    const family = inferFamily(record, profileId);
    if (!profiles[profileId]) {
      profiles[profileId] = createProfileBucket(profileId, family);
    }

    const bucket = profiles[profileId];
    bucket.latestRecord = record;
    bucket.metrics.totalRecords += 1;
    incrementFailureModes(bucket, record);

    if (record.type === 'benchmark_run') {
      bucket.metrics.benchmarkRuns += 1;
      globalMetrics.benchmarkRuns += 1;
      bucket.benchmarkRuns.push(record);
      bucket.benchmarkRecommendations.push(record.recommendation || 'unknown');
      maybeSetBestBenchmark(bucket, record);
      if (record.recommendation === 'benchmark-pass') {
        bucket.metrics.benchmarkPassCount += 1;
        globalMetrics.benchmarkPassCount += 1;
      } else {
        bucket.metrics.benchmarkFailCount += 1;
        globalMetrics.benchmarkFailCount += 1;
      }
      continue;
    }

    if (record.type === 'infra_failure') {
      bucket.metrics.infraFailureCount += 1;
      globalMetrics.infraFailureCount += 1;
      bucket.infraFailures.push(record);
      continue;
    }

    bucket.metrics.promptRuns += 1;
    globalMetrics.promptRuns += 1;
    bucket.promptRecommendations.push(record.recommendation || 'unknown');
    maybeSetBestPrompt(bucket, record);

    if (record.dimensions) {
      for (const dim of record.dimensions) {
        const key = dim.name;
        if (bucket.dimensionScores[key]) {
          bucket.dimensionScores[key].push(dim.score);
        }
      }
    }

    if (record.type === 'accepted' || record.recommendation === 'candidate-acceptable' || record.recommendation === 'candidate-better') {
      bucket.metrics.acceptedCount += 1;
      globalMetrics.acceptedCount += 1;
      bucket.acceptedCandidates.push(record);
    } else if (record.type === 'rejected' || record.recommendation === 'candidate-worse' || record.recommendation === 'candidate-rejected') {
      bucket.metrics.rejectedCount += 1;
      globalMetrics.rejectedCount += 1;
      bucket.rejectedCandidates.push(record);
    }

    if (record.recommendation === 'tie') {
      bucket.metrics.tieCount += 1;
      globalMetrics.tieCount += 1;
    } else if (record.recommendation === 'keep-baseline') {
      bucket.metrics.keepBaselineCount += 1;
      globalMetrics.keepBaselineCount += 1;
    }
  }

  globalMetrics.targetProfiles = Object.keys(profiles).length;

  return {
    globalMetrics,
    profiles,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STOP STATUS
// ─────────────────────────────────────────────────────────────────────────────

function countTrailingMatches(items, expected) {
  let count = 0;
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index] !== expected) {
      break;
    }
    count += 1;
  }
  return count;
}

function detectDriftAmbiguity(mirrorDriftReport) {
  if (!mirrorDriftReport) {
    return false;
  }
  return /manual-review-required|: missing|Undisclosed surfaces:\s*[1-9]/i.test(mirrorDriftReport);
}

function evaluateStopStatus(registry, config, mirrorDriftReport) {
  const stopRules = config?.stopRules || {};

--- .opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Guarded Canonical Promotion Helper                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readOptionalJson(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    process.stderr.write(`Cannot promote: expected exactly one canonical target in manifest, found ${canonicalTargets.length}\n`);
    process.exit(1);
  }
  return canonicalTargets[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidate = args.candidate;
  const target = args.target;
  const scorePath = args.score;
  const benchmarkReportPath = args['benchmark-report'];
  const repeatabilityReportPath = args['repeatability-report'];
  const configPath = args.config;
  const manifestPath = args.manifest;
  const archiveDir = args['archive-dir'];
  const approve = args.approve === true || args.approve === 'true';

  if (!candidate || !target || !scorePath || !benchmarkReportPath || !configPath || !manifestPath || !archiveDir || !approve) {
    process.stderr.write('Usage: node promote-candidate.cjs --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve\n');
    process.exit(2);
  }

  const score = readJson(scorePath);
  const benchmarkReport = readJson(benchmarkReportPath);
  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
  const config = readJson(configPath);
  const allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);
  const threshold = Number(config?.scoring?.thresholdDelta || 1);
  const proposalOnly = config?.proposalOnly;
  const promotionEnabled = config?.promotionEnabled;

  if (score.status !== 'scored') {
    process.stderr.write('Cannot promote: score file is not in scored state\n');
    process.exit(1);
  }

  if (proposalOnly !== false) {
    process.stderr.write('Cannot promote: runtime config is still in proposal-only mode\n');
    process.exit(1);
  }

  if (promotionEnabled !== true) {
    process.stderr.write('Cannot promote: promotionEnabled is not true in runtime config\n');
    process.exit(1);
  }

  if (config?.target && target !== config.target) {
    process.stderr.write(`Cannot promote: target ${target} does not match runtime config target ${config.target}\n`);
    process.exit(1);
  }

  if (config?.targetProfile && benchmarkReport.profileId !== config.targetProfile) {
    process.stderr.write(`Cannot promote: benchmark profile ${benchmarkReport.profileId} does not match runtime config target profile ${config.targetProfile}\n`);
    process.exit(1);
  }

  if (benchmarkReport.status !== 'benchmark-complete') {
    process.stderr.write('Cannot promote: benchmark report is not in benchmark-complete state\n');
    process.exit(1);
  }

  if (benchmarkReport.target !== target) {
    process.stderr.write(`Cannot promote: benchmark report target ${benchmarkReport.target} does not match requested target ${target}\n`);
    process.exit(1);
  }

  if (benchmarkReport.recommendation !== 'benchmark-pass') {
    process.stderr.write(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}\n`);
    process.exit(1);
  }

  if (!repeatabilityReport) {
    process.stderr.write(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}\n`);
    process.exit(1);
  }

  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
    process.stderr.write(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}\n`);
    process.exit(1);
  }

  if (repeatabilityReport.passed !== true) {
    process.stderr.write('Cannot promote: repeatability check did not pass\n');
    process.exit(1);
  }

  if (target !== allowedCanonicalTarget) {
    process.stderr.write(`Cannot promote: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}\n`);
    process.exit(1);
  }

  if (score.recommendation !== 'candidate-better') {
    process.stderr.write(`Cannot promote: recommendation is ${score.recommendation}\n`);
    process.exit(1);
  }

  if (Number(score.delta || 0) < threshold) {
    process.stderr.write(`Cannot promote: delta ${score.delta} below threshold ${threshold}\n`);
    process.exit(1);
  }

  ensureParent(path.join(archiveDir, 'placeholder'));
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  const backupPath = path.join(archiveDir, `${path.basename(target)}.${timestamp}.bak`);

  fs.copyFileSync(target, backupPath);
  fs.copyFileSync(candidate, target);

  const result = {
    status: 'promoted',
    target,
    candidate,
    backupPath,
    benchmarkReport: benchmarkReportPath,
    repeatabilityReport: resolvedRepeatabilityReportPath,
    delta: score.delta,
    threshold,
    timestamp: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();

--- .opencode/skill/sk-improve-agent/scripts/rollback-candidate.cjs ---
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Canonical Rollback Helper                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    process.stderr.write(`Cannot roll back: expected exactly one canonical target in manifest, found ${canonicalTargets.length}\n`);
    process.exit(1);
  }
  return canonicalTargets[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const target = args.target;
  const backup = args.backup;
  const configPath = args.config;
  const manifestPath = args.manifest;

  if (!target || !backup || !configPath || !manifestPath) {
    process.stderr.write('Usage: node rollback-candidate.cjs --target=... --backup=... --config=... --manifest=...\n');
    process.exit(2);
  }

  const config = readJson(configPath);
  const allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);

  if (config?.target && target !== config.target) {
    process.stderr.write(`Cannot roll back: target ${target} does not match runtime config target ${config.target}\n`);
    process.exit(1);
  }

  if (target !== allowedCanonicalTarget) {
    process.stderr.write(`Cannot roll back: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}\n`);
    process.exit(1);
  }

  fs.copyFileSync(backup, target);
  process.stdout.write(`${JSON.stringify({ status: 'rolled_back', target, backup }, null, 2)}\n`);
}

main();


exec
/bin/zsh -lc "printf '===== improver references =====\\n'; for f in .opencode/skill/sk-improve-agent/references/loop_protocol.md .opencode/skill/sk-improve-agent/references/evaluator_contract.md .opencode/skill/sk-improve-agent/references/integration_scanning.md .opencode/skill/sk-improve-agent/references/no_go_conditions.md .opencode/skill/sk-improve-agent/references/promotion_rules.md .opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md; do echo \"--- "'$f ---"; rg -n "stop|plateau|tie|benchmark|promot|rollback|session|lineage|resume|state|append|registry|dashboard|dimension|integration|weak|failure|candidate|score" "$f" | head -n 120; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== improver references =====
--- .opencode/skill/sk-improve-agent/references/loop_protocol.md ---
3:description: End-to-end agent-improver workflow from initialization through guarded promotion or stop decisions.
8:End-to-end operator view of how the agent-improver command, mutator, scorer, benchmark runner, reducer, and approval gates fit together. Use it when you need the full lifecycle, not just a quick command reminder.
17:Describes the normal agent-improver loop from packet initialization through reduction, stop decisions, and guarded promotion.
23:- Explaining how candidates move through score, benchmark, and reducer stages
24:- Checking where promotion and rollback sit in the workflow
28:The loop is evaluator-first. Candidate generation, scoring, benchmarking, reduction, and promotion must stay separated so each stage can be trusted.
38:- Run `scan-integration.cjs` to map the target's full integration surface
40:- Create `{spec_folder}/improvement/`, `candidates/`, and `benchmark-runs/`
42:- Record the baseline candidate in `agent-improvement-state.jsonl`
53:- Generate one bounded candidate artifact
54:- Write it under `improvement/candidates/` only
59:<!-- ANCHOR:score-and-benchmark -->
62:- Run `score-candidate.cjs` against the candidate (use `--dynamic` for 5-dimension scoring or `--profile` for legacy keyword checks)
63:- Run `run-benchmark.cjs` against the packet-local output set for the active profile (use `--integration-report` to include integration consistency scoring)
64:- Keep scorer execution separate from the mutator step
65:- Record baseline, candidate, benchmark run, rejected, accepted, or infra-failure events in the ledger
66:- When using dynamic mode, the scorer produces per-dimension scores (structural, ruleCoherence, integration, outputQuality, systemFitness)
70:<!-- /ANCHOR:score-and-benchmark -->
74:- Run `reduce-state.cjs`
75:- Refresh `agent-improvement-dashboard.md`
76:- Refresh `experiment-registry.json`
77:- Continue if the score delta is meaningful, the benchmark passes, and the manifest boundary was respected
78:- Reject if the scorer flags structure, safety, or scope issues
79:- Keep the simpler candidate when score deltas tie
80:- Stop when repeatability, weak-benchmark, or infra-failure no-go rules trigger
85:<!-- ANCHOR:promote -->
88:Only the canonical handover target can promote. Promotion remains a guarded later-phase workflow requiring:
91:- benchmark evidence already present
92:- rollback plan available
97:<!-- /ANCHOR:promote -->
103:- `integration_scanning.md`
104:- `benchmark_operator_guide.md`
105:- `rollback_runbook.md`

--- .opencode/skill/sk-improve-agent/references/evaluator_contract.md ---
3:description: Deterministic scoring and benchmark contract for target-profiled agent-improver experiments.
8:Contract for how `sk-improve-agent` scores candidates and benchmarks packet-local outputs. Use it when you need the exact evaluator inputs, outputs, rubric dimensions, and hard rejection behavior.
17:Defines the input and output contract for the prompt-surface scorer and the output benchmark runner so agent-improver runs remain deterministic enough for bounded local experimentation.
22:- Updating scoring logic or benchmark rules
23:- Explaining why a candidate was kept, rejected, or marked infra-failure
28:Weak candidates and infrastructure failures must be distinguishable. The contract exists so a broken tool path is not mistaken for a bad prompt and vice versa.
43:Any agent file in `.opencode/agent/*.md` can be evaluated using `--dynamic` mode. The scorer generates a profile on the fly from the agent's own structure, rules, and permissions using `generate-profile.cjs`.
53:The prompt scorer expects:
54:- `--candidate=PATH`
61:### Dynamic Mode (5-dimension)
63:The scorer accepts `--dynamic` to enable integration-aware evaluation:
64:- `--candidate=PATH` required (path to the agent .md file)
65:- `--dynamic` flag to enable 5-dimension scoring
68:The benchmark runner expects:
73:- `--state-log=PATH` optional
81:The scorer emits JSON with:
86:- `candidate`
94:The benchmark runner emits JSON with:
103:- `failureModes`
107:When `--dynamic` is used, the scorer additionally emits:
109:- `dimensions`: array of 5 dimension objects, each with `name`, `score`, `weight`, `details`
110:- `legacyScore`: legacy scorer result (only for handover/context-prime targets)
111:- `recommendation`: `"candidate-acceptable"` or `"needs-improvement"` (based on weighted score >= 70)
124:| Rule Coherence | 0.25 | ALWAYS/NEVER/ESCALATE IF rules align with workflow steps and instructions; keyword match against the agent's own stated rules |
125:| Integration Consistency | 0.25 | Runtime mirrors in sync, commands reference agent, skills reference agent; scored via `scan-integration.cjs` (mirror 60%, command 20%, skill 20%) |
146:| Integration | optional | Mirror parity, command alignment, skill coverage (via `--integration-report`) |
151:<!-- ANCHOR:rejection-and-failure -->
156:- the candidate omits the target's mandatory contract anchors
160:- a benchmark run drops below the profile minimum fixture or aggregate score
162:Use `infra_failure` only when the scorer or benchmark runner cannot read files, parse the manifest or profile, or load the fixture or output set.
166:<!-- /ANCHOR:rejection-and-failure -->
170:- `benchmark_operator_guide.md`
171:- `promotion_rules.md`
173:- `../scripts/score-candidate.cjs`
174:- `../scripts/scan-integration.cjs`

--- .opencode/skill/sk-improve-agent/references/integration_scanning.md ---
3:description: How the integration scanner discovers all surfaces an agent touches across the repo.
8:How `scan-integration.cjs` discovers the full integration surface of any agent across the repository.
17:Provides a complete inventory of every file and surface that references or depends on a given agent, so the evaluator can measure integration consistency rather than just prompt-file quality.
23:- Understanding why the integration dimension scored low
69:node scripts/scan-integration.cjs --agent=handover [--repo-root=.] [--output=path.json]
106:- `evaluator_contract.md` for the 5-dimension scoring rubric
107:- `../scripts/scan-integration.cjs` for the implementation

--- .opencode/skill/sk-improve-agent/references/no_go_conditions.md ---
8:Safety-brake reference for deciding when agent-improver must stop or refuse broader rollout. Use it when a packet is accumulating weak evidence, unstable repeatability, or blurred boundaries.
17:Defines the conditions that force the loop to stop or refuse broader rollout.
22:- checking reducer stop rules
28:The loop should stop before evaluator quality becomes weaker than the autonomy being requested.
38:- the scorer cannot reliably separate a weak candidate from the baseline
39:- the benchmark runner cannot produce stable scores across repeat runs
40:- promotion cannot be rolled back quickly
43:- the mutator and scorer boundaries blur
45:- benchmark evidence and mirror-sync evidence are being mixed together
46:- a profile exceeds the configured infra-failure or weak-benchmark limits
47:- All 5 evaluation dimensions have plateaued (3+ consecutive identical scores per dimension) — indicates the improvement loop has exhausted its current approach. Stop and reassess the hypothesis or target.
49:The reducer consumes these configured stop rules and marks the runtime `shouldStop` when the packet crosses them.
58:- `promotion_rules.md`
60:- `../scripts/reduce-state.cjs`

--- .opencode/skill/sk-improve-agent/references/promotion_rules.md ---
3:description: Keep, reject, and guarded promotion rules for agent-improver candidates.
8:Policy reference for deciding whether a agent-improver candidate stays baseline-only, is rejected, or becomes promotion-eligible. Use it when score and benchmark evidence exist and you need the decision rule, not just the raw metrics.
17:Defines the difference between an interesting candidate, an acceptable candidate, and a promotable candidate.
22:- Reviewing score and benchmark outputs
23:- Explaining why a candidate tied, lost, or won
24:- Checking whether promotion prerequisites are actually satisfied
28:Promotion stays intentionally narrower than scoring and benchmarking. A candidate can be promising without being safe to promote.
36:Candidates may be scored and benchmarked across two profiles, but only the canonical handover target may be promoted in the current packet.
38:When promotion is enabled, the shipped promotion script enforces:
39:- `candidate-better` prompt scoring
40:- a matching `benchmark-pass` report for the active profile
46:Agents evaluated via dynamic profiles (`--dynamic` mode) are not currently promotion-eligible. Dynamic scoring provides integration health assessment but does not replace the hardcoded profile checks required for canonical mutation. Only targets with static profiles (handover) can be promoted.
55:- the candidate score is lower
56:- the candidate violates the manifest
57:- the candidate only adds noise
59:Reject the candidate when:
61:- the run is an infra failure
62:- the candidate broadens scope
64:Prefer the candidate only when:
65:- the candidate score is higher
72:<!-- ANCHOR:tie-break -->
75:When scores tie, prefer the simpler option:
83:<!-- /ANCHOR:tie-break -->
89:- repeatability is proven for the active benchmark set
90:- rollback steps are documented
101:- `rollback_runbook.md`
103:- `../scripts/promote-candidate.cjs`

--- .opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md ---
3:description: Step-by-step guide for running repeatable fixture benchmarks for sk-improve-agent target profiles.
8:Operational guide for running agent-improver benchmarks against packet-local outputs. Use it when you need deterministic evidence that a target profile still behaves consistently across repeated runs.
17:Explains how to run deterministic fixture benchmarks, where to store the resulting evidence, and how to interpret repeatability.
22:- Running the benchmark runner for `handover` or `context-prime`
23:- Building repeatability evidence for a promotion gate
39:node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
41:  --outputs-dir={spec_folder}/improvement/benchmark-runs/handover/baseline \
42:  --output={spec_folder}/improvement/benchmark-runs/handover/run-001.json \
43:  --state-log={spec_folder}/improvement/agent-improvement-state.jsonl \
49:When running with an integration report, add the `--integration-report` flag:
52:node scripts/run-benchmark.cjs --profile=handover --outputs-dir=... --output=... --integration-report=integration-report.json
55:The integration report adds `integrationScore` and `integrationDetails` to the benchmark output:
68:{spec_folder}/improvement/benchmark-runs/
71:    candidate-weak/
72:    candidate-strong/
75:    candidate-weak/
86:- If scores drift, stop and treat the harness as unstable
95:- aggregate score meets the profile threshold
96:- no fixture falls below the profile minimum fixture score
98:- the benchmark record is appended to the packet-local ledger
102:- a prompt-surface score exists with no benchmark evidence
103:- a benchmark run passed only once
113:- `promotion_rules.md`


codex
The improver loop is more mature than its top-level docs suggest: there is already a reducer that tracks per-dimension histories and derives stop conditions, but the command/skill surface still exposes those as informal reasons like plateau, weak benchmarks, or infra failure instead of a typed contract. I’m drilling into those reducer branches now, because that’s where the “implicit taxonomy” and legal gate mapping really live.
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "evaluateStopStatus|shouldStop|plateau|weakBenchmark|infraFailure|maxIterations|reason|dimensionTrends|stopRules|tie" .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
87:    infraFailures: [],
97:      tieCount: 0,
99:      infraFailureCount: 0,
110:    dimensionTrends: {},
154:    tieCount: 0,
156:    infraFailureCount: 0,
190:      bucket.metrics.infraFailureCount += 1;
191:      globalMetrics.infraFailureCount += 1;
192:      bucket.infraFailures.push(record);
220:    if (record.recommendation === 'tie') {
221:      bucket.metrics.tieCount += 1;
222:      globalMetrics.tieCount += 1;
259:function evaluateStopStatus(registry, config, mirrorDriftReport) {
260:  const stopRules = config?.stopRules || {};
262:  let shouldStop = false;
263:  const reasons = [];
267:      shouldStop: false,
268:      reasons: [],
270:        trailingTies: countTrailingMatches(bucket.promptRecommendations, 'tie'),
271:        infraFailures: bucket.metrics.infraFailureCount,
272:        weakBenchmarkRuns: bucket.metrics.benchmarkFailCount,
276:    if (state.counters.trailingTies >= Number(stopRules.maxConsecutiveTies || Infinity)) {
277:      state.shouldStop = true;
278:      state.reasons.push(`trailing ties ${state.counters.trailingTies}/${stopRules.maxConsecutiveTies}`);
281:    if (state.counters.infraFailures >= Number(stopRules.maxInfraFailuresPerProfile || Infinity)) {
282:      state.shouldStop = true;
283:      state.reasons.push(`infra failures ${state.counters.infraFailures}/${stopRules.maxInfraFailuresPerProfile}`);
286:    if (state.counters.weakBenchmarkRuns >= Number(stopRules.maxWeakBenchmarkRunsPerProfile || Infinity)) {
287:      state.shouldStop = true;
288:      state.reasons.push(`weak benchmark runs ${state.counters.weakBenchmarkRuns}/${stopRules.maxWeakBenchmarkRunsPerProfile}`);
291:    if (state.shouldStop) {
292:      shouldStop = true;
293:      reasons.push(`${profileId}: ${state.reasons.join(', ')}`);
299:  const driftAmbiguity = Boolean(stopRules.stopOnDriftAmbiguity) && detectDriftAmbiguity(mirrorDriftReport);
301:    shouldStop = true;
302:    reasons.push('mirror drift ambiguity detected');
305:  if (stopRules.stopOnDimensionPlateau) {
306:    const plateauWindow = Number(stopRules.plateauWindow || 3);
309:      const dimsWithEnoughData = Object.entries(dims).filter(([, scores]) => scores.length >= plateauWindow);
311:        const plateauDims = dimsWithEnoughData.filter(([, scores]) => {
312:          const lastN = scores.slice(-plateauWindow);
315:        if (plateauDims.length === dimsWithEnoughData.length) {
316:          shouldStop = true;
317:          reasons.push(`${profileId}: all dimensions plateaued`);
319:            profileStates[profileId].shouldStop = true;
320:            profileStates[profileId].reasons.push('all dimensions plateaued');
328:    shouldStop,
329:    reasons,
380:    bucket.dimensionTrends[key] = trend;
413:- Infra failures: ${bucket.metrics.infraFailureCount}
432:  if (registry.stopStatus?.shouldStop) {
433:    recommendation = `Stop automatically: ${registry.stopStatus.reasons.join('; ')}`;
434:  } else if (registry.globalMetrics.infraFailureCount > 0) {
452:| Ties | ${registry.globalMetrics.tieCount} |
456:| Infra failures | ${registry.globalMetrics.infraFailureCount} |
466:- Should stop: ${registry.stopStatus?.shouldStop ? 'yes' : 'no'}
468:- Reasons: ${registry.stopStatus?.reasons?.length ? registry.stopStatus.reasons.join('; ') : 'none'}
499:  registry.stopStatus = evaluateStopStatus(registry, config, mirrorDriftReport);

 succeeded in 0ms:
  const stopRules = config?.stopRules || {};
  const profileStates = {};
  let shouldStop = false;
  const reasons = [];

  for (const [profileId, bucket] of Object.entries(registry.profiles)) {
    const state = {
      shouldStop: false,
      reasons: [],
      counters: {
        trailingTies: countTrailingMatches(bucket.promptRecommendations, 'tie'),
        infraFailures: bucket.metrics.infraFailureCount,
        weakBenchmarkRuns: bucket.metrics.benchmarkFailCount,
      },
    };

    if (state.counters.trailingTies >= Number(stopRules.maxConsecutiveTies || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`trailing ties ${state.counters.trailingTies}/${stopRules.maxConsecutiveTies}`);
    }

    if (state.counters.infraFailures >= Number(stopRules.maxInfraFailuresPerProfile || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`infra failures ${state.counters.infraFailures}/${stopRules.maxInfraFailuresPerProfile}`);
    }

    if (state.counters.weakBenchmarkRuns >= Number(stopRules.maxWeakBenchmarkRunsPerProfile || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`weak benchmark runs ${state.counters.weakBenchmarkRuns}/${stopRules.maxWeakBenchmarkRunsPerProfile}`);
    }

    if (state.shouldStop) {
      shouldStop = true;
      reasons.push(`${profileId}: ${state.reasons.join(', ')}`);
    }

    profileStates[profileId] = state;
  }

  const driftAmbiguity = Boolean(stopRules.stopOnDriftAmbiguity) && detectDriftAmbiguity(mirrorDriftReport);
  if (driftAmbiguity) {
    shouldStop = true;
    reasons.push('mirror drift ambiguity detected');
  }

  if (stopRules.stopOnDimensionPlateau) {
    const plateauWindow = Number(stopRules.plateauWindow || 3);
    for (const [profileId, bucket] of Object.entries(registry.profiles)) {
      const dims = bucket.dimensionScores;
      const dimsWithEnoughData = Object.entries(dims).filter(([, scores]) => scores.length >= plateauWindow);
      if (dimsWithEnoughData.length > 0) {
        const plateauDims = dimsWithEnoughData.filter(([, scores]) => {
          const lastN = scores.slice(-plateauWindow);
          return lastN.every((s) => s === lastN[0]);
        });
        if (plateauDims.length === dimsWithEnoughData.length) {
          shouldStop = true;
          reasons.push(`${profileId}: all dimensions plateaued`);
          if (profileStates[profileId]) {
            profileStates[profileId].shouldStop = true;
            profileStates[profileId].reasons.push('all dimensions plateaued');
          }
        }
      }
    }
  }

  return {
    shouldStop,
    reasons,
    driftAmbiguity,
    profileStates,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DIMENSIONAL TRACKING
// ─────────────────────────────────────────────────────────────────────────────

function topFailureModes(failureModes) {
  return Object.entries(failureModes)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 5);
}

function computeDimensionTrend(scores) {
  if (scores.length < 2) {
    return '\u2192';
  }
  const latest = scores[scores.length - 1];
  const previous = scores[scores.length - 2];
  if (latest > previous) {
    return '\u2191';
  }
  if (latest < previous) {
    return '\u2193';
  }
  return '\u2192';
}

function formatDimensionName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (ch) => ch.toUpperCase())
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. DASHBOARD RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderDimensionalProgress(bucket) {
  const rows = [];
  for (const [key, scores] of Object.entries(bucket.dimensionScores)) {
    if (scores.length === 0) {
      continue;
    }
    const latest = scores[scores.length - 1];
    const best = Math.max(...scores);
    const trend = computeDimensionTrend(scores);
    bucket.dimensionTrends[key] = trend;
    rows.push(`| ${formatDimensionName(key)} | ${latest} | ${best} | ${trend} |`);
  }
  if (rows.length === 0) {
    return '';
  }
  return `### Dimensional Progress

| Dimension | Latest | Best | Trend |
| --- | --- | --- | --- |
${rows.join('\n')}
`;
}

function renderProfileSection(bucket) {
  const failures = topFailureModes(bucket.failureModes);
  const failureSummary =
    failures.length > 0
      ? failures.map(([mode, count]) => `- ${mode}: ${count}`).join('\n')
      : '- none';
  const latest = bucket.latestRecord;
  const bestPrompt = bucket.bestPromptRecord;
  const bestBenchmark = bucket.bestBenchmarkRecord;

  return `## ${bucket.profileId}

- Family: ${bucket.family}
- Prompt runs: ${bucket.metrics.promptRuns}
- Benchmark runs: ${bucket.metrics.benchmarkRuns}
- Accepted candidates: ${bucket.metrics.acceptedCount}
- Rejected candidates: ${bucket.metrics.rejectedCount}
- Benchmark passes: ${bucket.metrics.benchmarkPassCount}
- Benchmark fails: ${bucket.metrics.benchmarkFailCount}
- Infra failures: ${bucket.metrics.infraFailureCount}
- Best prompt score: ${bestPrompt ? Number(bestPrompt.score ?? bestPrompt.totals?.candidate ?? 0) : 'n/a'}
- Best benchmark score: ${bestBenchmark ? Number(bestBenchmark.aggregateScore ?? 0) : 'n/a'}
- Latest recommendation: ${latest?.recommendation || 'n/a'}

### Repeated Failure Modes

${failureSummary}

${renderDimensionalProgress(bucket)}`;
}

function renderDashboard(registry) {
  const sections = Object.values(registry.profiles)
    .sort((left, right) => left.profileId.localeCompare(right.profileId))
    .map((bucket) => renderProfileSection(bucket))
    .join('\n');

  let recommendation = 'Continue only when the next run has a clearer signal than the current best-known state.';
  if (registry.stopStatus?.shouldStop) {
    recommendation = `Stop automatically: ${registry.stopStatus.reasons.join('; ')}`;
  } else if (registry.globalMetrics.infraFailureCount > 0) {
    recommendation = 'Stabilize infrastructure before trusting further comparisons.';
  } else if (registry.globalMetrics.benchmarkFailCount > 0) {
    recommendation = 'Fix repeated benchmark failures before broadening scope or promoting any target.';
  }

  return `# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | ${registry.globalMetrics.totalRecords} |
| Target profiles | ${registry.globalMetrics.targetProfiles} |
| Prompt runs | ${registry.globalMetrics.promptRuns} |
| Benchmark runs | ${registry.globalMetrics.benchmarkRuns} |
| Accepted candidates | ${registry.globalMetrics.acceptedCount} |
| Rejected candidates | ${registry.globalMetrics.rejectedCount} |
| Ties | ${registry.globalMetrics.tieCount} |
| Keep-baseline results | ${registry.globalMetrics.keepBaselineCount} |
| Benchmark passes | ${registry.globalMetrics.benchmarkPassCount} |
| Benchmark fails | ${registry.globalMetrics.benchmarkFailCount} |
| Infra failures | ${registry.globalMetrics.infraFailureCount} |

## Guardrails

- Canonical promotion target remains ".opencode/agent/handover.md"
- Candidate-only target remains ".opencode/agent/context-prime.md"
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: ${registry.stopStatus?.shouldStop ? 'yes' : 'no'}
- Drift ambiguity: ${registry.stopStatus?.driftAmbiguity ? 'yes' : 'no'}
- Reasons: ${registry.stopStatus?.reasons?.length ? registry.stopStatus.reasons.join('; ') : 'none'}

${sections}

## Recommendation

${recommendation}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const runtimeRoot = process.argv[2];
  if (!runtimeRoot) {
    process.stderr.write('Usage: node reduce-state.cjs <improvement-runtime-root>\n');
    process.exit(2);
  }

  const stateLogPath = path.join(runtimeRoot, 'agent-improvement-state.jsonl');
  const registryPath = path.join(runtimeRoot, 'experiment-registry.json');
  const dashboardPath = path.join(runtimeRoot, 'agent-improvement-dashboard.md');
  const configPath = path.join(runtimeRoot, 'agent-improvement-config.json');
  const mirrorDriftReportPath = path.join(runtimeRoot, 'mirror-drift-report.md');

  const records = parseJsonl(readUtf8(stateLogPath));
  const registry = buildRegistry(records);
  const config = parseJson(readOptionalUtf8(configPath) || '{}', {});
  const mirrorDriftReport = readOptionalUtf8(mirrorDriftReportPath);
  registry.stopStatus = evaluateStopStatus(registry, config, mirrorDriftReport);
  const dashboard = renderDashboard(registry);

  writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  writeUtf8(dashboardPath, dashboard);
}

main();

exec
/bin/zsh -lc 'rg -n "recommendation|candidate-better|candidate-acceptable|candidate-worse|candidate-rejected|delta|dimensions|integrationScore|benchmark-pass|benchmark-fail|infra_failure|appendJsonl|type:" .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:38:function appendJsonl(filePath, value) {
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:177:  const integrationScore = Math.round(
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:182:    integrationScore,
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:223:    const recommendation =
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:225:        ? 'benchmark-pass'
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:226:        : 'benchmark-fail';
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:235:      recommendation,
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:247:      report.integrationScore = integration.integrationScore;
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:254:      appendJsonl(stateLogPath, {
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:255:        type: 'benchmark_run',
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:263:        recommendation,
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:269:      status: 'infra_failure',
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:279:      appendJsonl(stateLogPath, {
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:280:        type: 'infra_failure',
.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:283:        recommendation: 'infra_failure',
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:380:    details.push({ id: rule.id, type: rule.type, rule: rule.rule, pass, matchRatio: keywords.length > 0 ? matchCount / keywords.length : 0 });
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:487:  const dimensions = [
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:496:    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0),
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:499:  return { weightedScore, dimensions };
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:522:      status: 'infra_failure',
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:544:        status: 'infra_failure',
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:571:      dimensions: dynamicResult.dimensions,
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:573:      recommendation: dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement',
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:574:      failureModes: dynamicResult.dimensions
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:587:      status: 'infra_failure',
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:616:  const delta = baselineTotal === null ? null : candidateTotal - baselineTotal;
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:618:  let recommendation = 'candidate-better';
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:620:    recommendation = 'reject-candidate';
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:621:  } else if (baselineTotal !== null && delta < 0) {
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:622:    recommendation = 'keep-baseline';
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:623:  } else if (baselineTotal !== null && delta === 0) {
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:624:    recommendation = 'tie';
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:640:    delta,
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:641:    recommendation,

exec
/bin/zsh -lc "sed -n '470,660p' .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  const hasName = /^name:\s+\S/m.test(content);
  const hasMode = /^mode:\s+\S/m.test(content);
  const hasPermission = /^permission:\s*$/m.test(content);
  const fmScore = [hasFrontmatter, hasName, hasMode, hasPermission].filter(Boolean).length * 7.5;
  earned += fmScore;
  details.push({ id: 'frontmatter-complete', pass: fmScore >= 30, score: fmScore });

  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDynamic(candidateContent, agentName, profile) {
  const structural = scoreDimStructural(profile, candidateContent);
  const ruleCoherence = scoreDimRuleCoherence(profile, candidateContent);
  const integration = scoreDimIntegration(agentName);
  const outputQuality = scoreDimOutputQuality(profile, candidateContent);
  const systemFitness = scoreDimSystemFitness(profile, candidateContent);

  const dimensions = [
    { name: 'structural', score: structural.score, weight: DIMENSION_WEIGHTS.structural, details: structural.details },
    { name: 'ruleCoherence', score: ruleCoherence.score, weight: DIMENSION_WEIGHTS.ruleCoherence, details: ruleCoherence.details },
    { name: 'integration', score: integration.score, weight: DIMENSION_WEIGHTS.integration, details: integration.details },
    { name: 'outputQuality', score: outputQuality.score, weight: DIMENSION_WEIGHTS.outputQuality, details: outputQuality.details },
    { name: 'systemFitness', score: systemFitness.score, weight: DIMENSION_WEIGHTS.systemFitness, details: systemFitness.details },
  ];

  const weightedScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0),
  );

  return { weightedScore, dimensions };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidatePath = args.candidate;
  const baselinePath = args.baseline;
  const manifestPath = args.manifest;
  const targetPath = args.target || '.opencode/agent/handover.md';
  const outputPath = args.output;

  if (!candidatePath) {
    process.stderr.write('Missing required --candidate argument\n');
    process.exit(2);
  }

  const candidateContent = safeRead(candidatePath);
  if (typeof candidateContent !== 'string') {
    const failure = {
      status: 'infra_failure',
      profileId: args.profile || null,
      family: null,
      evaluationMode: 'prompt-surface',
      target: targetPath,
      candidate: candidatePath,
      error: candidateContent.error,
      failureModes: ['candidate-read-failure'],
    };
    if (outputPath) {
      writeJson(outputPath, failure);
    } else {
      process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
    }
    process.exit(1);
  }

  // Dynamic mode: use generate-profile.cjs + 5-dimension scoring
  if (args.dynamic) {
    const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
    if (!profile || !profile.id) {
      const failure = {
        status: 'infra_failure',
        evaluationMode: 'dynamic-5d',
        target: targetPath,
        candidate: candidatePath,
        error: 'Failed to generate dynamic profile',
        failureModes: ['profile-generation-failure'],
      };
      if (outputPath) { writeJson(outputPath, failure); } else { process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`); }
      process.exit(1);
    }
    const agentName = profile.id;
    const dynamicResult = scoreDynamic(candidateContent, agentName, profile);

    // Also run legacy scoring if profile matches a known profile
    let legacyScore = null;
    if (profile.id === 'handover' || profile.id === 'context-prime') {
      legacyScore = scorePrompt(candidateContent, null, profile.id);
    }

    const result = {
      status: 'scored',
      profileId: profile.id,
      family: profile.family,
      evaluationMode: 'dynamic-5d',
      target: targetPath,
      candidate: candidatePath,
      score: dynamicResult.weightedScore,
      dimensions: dynamicResult.dimensions,
      legacyScore: legacyScore ? { total: legacyScore.hardReject ? 0 : legacyScore.total, checks: legacyScore.checks } : null,
      recommendation: dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement',
      failureModes: dynamicResult.dimensions
        .filter((d) => d.score < 60)
        .map((d) => `weak-${d.name}`),
    };

    if (outputPath) { writeJson(outputPath, result); } else { process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); }
    return;
  }

  const baselineContent = baselinePath ? safeRead(baselinePath) : null;
  const manifest = loadManifest(manifestPath);
  if (manifest && manifest.error) {
    const failure = {
      status: 'infra_failure',
      profileId: args.profile || null,
      family: null,
      evaluationMode: 'prompt-surface',
      target: targetPath,
      candidate: candidatePath,
      baseline: baselinePath || null,
      error: manifest.error,
      failureModes: ['manifest-parse-failure'],
    };
    if (outputPath) {
      writeJson(outputPath, failure);
    } else {
      process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
    }
    process.exit(1);
  }

  const profileId = inferProfileId(targetPath, args.profile, manifest);
  const family = inferFamily(profileId, manifest, targetPath);
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath) || null;
  const candidateScore = scorePrompt(candidateContent, manifestTarget, profileId);
  const baselineScore =
    typeof baselineContent === 'string'
      ? scorePrompt(baselineContent, manifestTarget, profileId)
      : null;

  const candidateTotal = candidateScore.hardReject ? 0 : candidateScore.total;
  const baselineTotal = baselineScore ? (baselineScore.hardReject ? 0 : baselineScore.total) : null;
  const delta = baselineTotal === null ? null : candidateTotal - baselineTotal;

  let recommendation = 'candidate-better';
  if (candidateScore.hardReject) {
    recommendation = 'reject-candidate';
  } else if (baselineTotal !== null && delta < 0) {
    recommendation = 'keep-baseline';
  } else if (baselineTotal !== null && delta === 0) {
    recommendation = 'tie';
  }

  const result = {
    status: 'scored',
    profileId,
    family,
    evaluationMode: 'prompt-surface',
    target: targetPath,
    candidate: candidatePath,
    baseline: baselinePath || null,
    score: candidateTotal,
    totals: {
      candidate: candidateTotal,
      baseline: baselineTotal,
    },
    delta,
    recommendation,
    checks: {
      candidate: candidateScore.checks,
      baseline: baselineScore ? baselineScore.checks : [],
    },
    reasons: {
      candidate: candidateScore.reasons,
      baseline: baselineScore ? baselineScore.reasons : [],
    },
    failureModes: collectFailureModes(candidateScore),
  };

  if (outputPath) {
    writeJson(outputPath, result);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

main();

exec
/bin/zsh -lc "sed -n '150,320p' .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  let mirrorScore = 100;
  for (const mirror of mirrors) {
    if (mirror.status === 'missing') {
      mirrorScore -= 30;
    } else if (mirror.status === 'diverged') {
      mirrorScore -= 20;
    }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const mirrorStatus =
    mirrorScore === 100
      ? 'all-aligned'
      : mirrors.some((entry) => entry.status === 'missing')
        ? 'has-missing'
        : 'has-divergence';

  // --- Command coverage (binary: at least 1 reference = 10 pts) ---
  const commandRefs = data.commandReferences || [];
  const commandCount = commandRefs.length;
  const commandScore = commandCount >= 1 ? 100 : 0;

  // --- Skill coverage (binary: at least 1 reference = 10 pts) ---
  const skillRefs = data.skillReferences || [];
  const skillCount = skillRefs.length;
  const skillScore = skillCount >= 1 ? 100 : 0;

  // --- Weighted average (mirror: 60%, command: 20%, skill: 20%) ---
  const integrationScore = Math.round(
    mirrorScore * 0.6 + commandScore * 0.2 + skillScore * 0.2
  );

  return {
    integrationScore,
    integrationDetails: {
      mirrorScore,
      commandScore,
      skillScore,
      mirrorStatus,
      commandCount,
      skillCount,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profileId = args.profile;
  const outputsDir = args['outputs-dir'];
  const outputPath = args.output;
  const stateLogPath = args['state-log'];
  const label = args.label || `${profileId}-benchmark`;
  const profilesDir = args['profiles-dir'] || '.opencode/skill/sk-improve-agent/assets/target-profiles';
  const integrationReportPath = args['integration-report'] || null;

  if (!profileId || !outputsDir || !outputPath) {
    process.stderr.write('Usage: node run-benchmark.cjs --profile=ID --outputs-dir=PATH --output=PATH [--state-log=PATH] [--label=STRING] [--profiles-dir=PATH] [--integration-report=PATH]\n');
    process.exit(2);
  }

  try {
    const profile = loadProfile(profileId, profilesDir);
    const fixtureFiles = listJsonFiles(profile.benchmark.fixtureDir);
    const fixtures = fixtureFiles.map((filePath) => readJson(filePath));
    const results = fixtures.map((fixture) => scoreFixture(fixture, path.join(outputsDir, `${fixture.id}.md`)));
    const aggregateScore = results.length === 0
      ? 0
      : Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length);
    const minimumFixtureScore = profile.benchmark.minimumFixtureScore;
    const aggregateThreshold = profile.benchmark.requiredAggregateScore;
    const recommendation =
      aggregateScore >= aggregateThreshold && results.every((entry) => entry.score >= minimumFixtureScore)
        ? 'benchmark-pass'
        : 'benchmark-fail';
    const report = {
      status: 'benchmark-complete',
      profileId: profile.id,
      family: profile.family,
      target: profile.targetPath,
      label,
      aggregateScore,
      maxScore: 100,
      recommendation,
      thresholds: {
        requiredAggregateScore: aggregateThreshold,
        minimumFixtureScore,
        repeatabilityTolerance: profile.benchmark.repeatabilityTolerance,
      },
      fixtures: results,
      failureModes: aggregateFailureModes(results),
    };

    if (integrationReportPath) {
      const integration = scoreIntegration(integrationReportPath);
      report.integrationScore = integration.integrationScore;
      report.integrationDetails = integration.integrationDetails;
    }

    writeJson(outputPath, report);

    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'benchmark_run',
        profileId: profile.id,
        family: profile.family,
        target: profile.targetPath,
        label,
        outputDir: outputsDir,
        report: outputPath,
        aggregateScore,
        recommendation,
        failureModes: report.failureModes,
      });
    }
  } catch (error) {
    const failure = {
      status: 'infra_failure',
      profileId,
      family: null,
      evaluationMode: 'benchmark',
      outputsDir,
      error: error.message,
      failureModes: ['benchmark-runner-failure'],
    };
    writeJson(outputPath, failure);
    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'infra_failure',
        profileId,
        family: null,
        recommendation: 'infra_failure',
        error: error.message,
        failureModes: ['benchmark-runner-failure'],
      });
    }
    process.exit(1);
  }
}

main();

exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md; do echo "--- $f ---"; sed -n '"'1,220p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md ---
---
title: "Implementation Summary: Semantic Coverage Graph [042.002]"
description: "Coverage-graph substrate for deep-loop convergence: 4 CJS shared libraries, dedicated SQLite database, 4 MCP tools, reducer integration seam, and 101 graph tests."
trigger_phrases:
  - "042.002"
  - "implementation summary"
  - "semantic coverage graph"
  - "deep-loop-graph.sqlite"
  - "coverage graph"
importance_tier: "important"
contextType: "planning"
---
# Implementation Summary: Semantic Coverage Graph

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph |
| **Completed** | 2026-04-10 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Semantic convergence now has a concrete graph substrate. Deep research and deep review can track coverage gaps, contradictions, provenance chains, and unverified claims through a dedicated SQLite database and four MCP tools, all backed by shared CJS libraries extracted from the existing Spec Kit Memory graph infrastructure.

### Coverage Graph Core Libraries

Four CommonJS shared libraries were extracted and adapted from existing graph modules: `coverage-graph-core.cjs` (edge management, weight clamping, self-loop prevention, provenance traversal), `coverage-graph-signals.cjs` (degree, depth, momentum, cluster metrics), `coverage-graph-contradictions.cjs` (CONTRADICTS-edge scanning, contradiction-pair reporting), and `coverage-graph-convergence.cjs` (graph-aware convergence helpers combining graph signals with Phase 001 stop-trace inputs). Reuse posture was 35-45% direct, 25-30% adapted, with the remainder genuinely new loop semantics.

### Coverage Graph Database

A dedicated `deep-loop-graph.sqlite` database stores coverage nodes, edges, and snapshots with schema versioning, migrations, indexes, and namespace isolation by `spec_folder + loop_type + session_id`. Research and review ontologies maintain separate relation maps and weight estimates.

### MCP Tools

Four MCP handlers were added to the existing Spec Kit Memory server: `deep_loop_graph_upsert` (idempotent node/edge creation with self-loop rejection and clamped weights), `deep_loop_graph_query` (structured queries for uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps, and hot nodes), `deep_loop_graph_status` (grouped counts and signal values), and `deep_loop_graph_convergence` (blockers and typed decision traces).

### Reducer/MCP Integration

The reducer/MCP contract defines explicit payload inputs/outputs, latency budget, replay semantics, and fallback behavior. The reducer parses iteration `graphEvents`, normalizes payloads, and calls `deep_loop_graph_upsert`. Convergence decisions merge graph blockers into `shouldContinue` with a local JSON graph fallback when MCP is unavailable. The fallback authority chain is `JSONL -> local JSON graph -> SQLite projection`.

### Agent and Convergence Integration

Both deep-loop agent prompts now emit structured graph events (research: question, finding, claim, source; review: dimension, file, finding, evidence, remediation). Contract docs define the `graphEvents` JSONL format and graph-aware convergence model for each loop.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded through 5 sub-phases: extract graph primitives, build coverage graph database, add MCP tools, define reducer/MCP contract and integrate reducer, and agent/convergence integration. 25 files were touched (17 new), adding approximately 5,200 lines. 101 tests cover edge management, signals, graph-aware convergence, MCP DB behavior, and tool integration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse-first extraction from existing graph modules | Avoids greenfield duplication while acknowledging that reducer/convergence work is not plug-and-play |
| Dedicated `deep-loop-graph.sqlite` rather than sharing the memory graph DB | Keeps coverage graph namespace-isolated and independently evolvable |
| Four focused MCP tools rather than a single generic graph tool | Each tool has a clear contract and latency expectation |
| Explicit reducer/MCP contract with latency budget | Prevents silent timeouts from degrading convergence decisions |
| Fallback authority chain (JSONL -> local JSON -> SQLite) | MCP loss degrades cleanly without changing truth ownership |
| Coverage-specific weight calibration | Inherited memory weights replaced by coverage-aware values before convergence is finalized |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Edge management, signals, and convergence unit tests | PASS (101 tests) |
| MCP DB schema behavior and upsert/query/status/convergence tools | PASS |
| Reducer graph ingestion with normalized payloads | PASS |
| Fallback behavior when MCP unavailable | PASS |
| Research and review agent prompts emit graphEvents | PASS |
| Strict phase validation | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Visualization is deferred.** Graph visualization tools are intentionally removed from the Phase 002 critical path and will follow in a later phase.
2. **Weight calibration uses initial estimates.** Coverage-specific edge weights are set with initial calibration values; real calibration data from production runs will refine them.
<!-- /ANCHOR:limitations -->

--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md ---
---
title: "Implementation Summary: Wave Executor [042.003]"
description: "Orchestrator-managed parallel wave execution for deep research and deep review: fan-out/join proof, deterministic segmentation, activation gates, keyed merge, and 97 tests."
trigger_phrases:
  - "042.003"
  - "implementation summary"
  - "wave executor"
  - "segment planner"
  - "coordination board"
importance_tier: "important"
contextType: "planning"
---
# Implementation Summary: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-sk-deep-research-review-improvement-2/003-wave-executor |
| **Completed** | 2026-04-10 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep research and deep review can now handle very large targets through orchestrator-managed parallel wave execution without abandoning the LEAF-worker model. The implementation adds deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the Phase 002 coverage-graph foundation.

### Fan-Out/Join Proof

Workflow fan-out/join capability was proven through helper-module orchestration that safely performs parallel dispatch and join outside the YAML workflow surface. This was the hard prerequisite that blocked all wave-mode runtime work.

### Heuristic Segmentation and Prepass Artifacts

The v1 deterministic heuristic segmentation produces reproducible segment identity and ordering for both review files and research domains. Review targets get `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities. Research targets get `domain-ledger.json` with source domains, authority levels, and cluster assignments. Segment-plan versioning and activation-gate configuration are exposed through strategy and config surfaces.

### Graph-Enhanced Segmentation and Lifecycle

The v2 graph-enhanced segmentation wraps Phase 002 graph signals for per-segment convergence, pruning, and promotion decisions. The shared wave lifecycle manager handles fan-out, join, prune, promote, and merge transitions. The reducer-owned `board.json` tracks conflicts, dedupe, and promoted findings, while `dashboard.md` is derived and never directly maintained.

### Activation Gates

Wave mode only activates for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity. Default single-stream deep research and deep review remain completely intact for smaller targets.

### Keyed Merge and Segment Lineage

The JSONL merge contract uses explicit key ordering by `sessionId`, `generation`, `segment`, `wave`, and `findingId` rather than append order. Segment provenance, dedupe, and conflict metadata survive repeated merges. Segment JSONL lineage is deterministic and auditable.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded through 3 sub-phases: fan-out/join prerequisite proof, heuristic segmentation with prepass artifacts, and graph-enhanced segmentation with lifecycle integration. 11 files were touched (9 new), adding approximately 3,300 lines. 97 tests cover planner determinism, lifecycle transitions, keyed merge provenance, resume safety, and default-path regression.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Helper-module orchestration for fan-out/join | The YAML workflow engine has no native parallel dispatch, so orchestration logic lives in CJS helpers |
| Orchestrator-layer parallelism, not LEAF-agent spawning | Workers stay LEAF; orchestration handles segmentation, fan-out, pruning, promotion, and merge |
| Reducer-owned `board.json` with derived `dashboard.md` | Board is the machine source of truth; dashboard is a human-readable projection |
| Deterministic keyed merge by explicit identifiers | Append-order dependence would break replay and produce non-deterministic merged outputs |
| Activation gates with explicit large-target thresholds | Prevents wave overhead for small targets where single-stream execution is already optimal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out/join proof via helper-module orchestration | PASS |
| Deterministic v1 segmentation for review and research | PASS (97 tests) |
| Activation gates prevent wave mode for small targets | PASS |
| Keyed merge preserves provenance, dedupe, and conflict metadata | PASS |
| `board.json` is reducer-owned, `dashboard.md` is derived | PASS |
| Default single-stream paths remain intact | PASS |
| Resume and fallback regression tests | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **V2 graph-enhanced segmentation depends on Phase 002 graph readiness.** If graph convergence signals are unavailable, segmentation falls back to v1 heuristic mode.
2. **Wave mode has not been exercised on production-scale targets yet.** Activation thresholds (1000+ files / 50+ domains) are based on design estimates; real production runs will validate them.
<!-- /ANCHOR:limitations -->


codex
I’ve now got the Phase 1-4 implementation summaries alongside the live deep-research/deep-review contracts. The broad pattern is clear: the earlier phases promoted “reasoned runtime state” from prose into typed artifacts, and Phase 005 should do the same for agent-improver rather than inventing a parallel, incompatible loop. The last gap I’m checking is evidence availability: what real historical improver data already exists for weight tuning, and where the current loop is still only spec-intent rather than live runtime fact.
exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md; do echo "--- $f ---"; rg -n "stopReason|legalStop|blockedStop|continuedFromRun|journal|ledger|snapshot|compaction|semantic convergence|optimizer|tunable|locked|advisory|replay corpus|rubric|audit trail" "$f" | head -n 120; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'for f in .opencode/skill/sk-improve-agent/assets/improvement_config_reference.md .opencode/skill/sk-improve-agent/README.md .opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md; do echo "--- $f ---"; sed -n '"'1,240p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md ---
3:description: "Deep-loop runtime contracts, stop-reason taxonomy, legal-stop gates, resume semantics, journals, dashboards, and behavior-first test coverage for sk-deep-research and sk-deep-review."
39:Both deep-loop products share a typed stop-reason taxonomy with named reasons (`converged`, `max_iterations`, `blocked`, `user_stop`, `error`). The legal-stop gate bundles convergence, coverage, and quality checks into a single binary decision. Blocked-stop events persist with gate results and recovery paths rather than silently terminating. The stop contract uses `stopReason`, `legalStop.blockedBy`, `legalStop.gateResults`, and `legalStop.replayInputs` fields.
43:Sessions now carry `continuedFromRun` semantics that work for both active resume (loop was blocked and continues) and completed-continue (loop finished and a new session extends the prior work). This lineage is explicit in commands, workflows, state contracts, and agent instructions.
47:Separate append-only journal artifacts track lifecycle events, stop decisions, and recovery actions. Dashboard upgrades expose timing/tool/token histograms, state diffs, anomaly flags, convergence trends, and stop-decision drill-down. Reducer snapshot/compaction ensures durability for 100+ iteration packets with delta replay and periodic snapshot equivalence.
59:Behavioral test suites cover lifecycle, blocked-stop, replay, resume, compaction equivalence, and semantic convergence scenarios for both loops. Contract parity tests enforce alignment across commands, skills, agents, and runtime mirrors.
79:| Claim-verification ledger uses JSONL canonical storage | Append-only, replayable, and machine-parseable without adding a database dependency (ADR-002) |
82:| Journals and ledgers stay separate append-only artifacts | Separation preserves clear lifecycle boundaries and replay independence (ADR-010) |
96:| Blocked-stop persistence with gate results and recovery path | PASS |
97:| `continuedFromRun` semantics for active resume and completed-continue | PASS |
103:| Behavioral tests cover lifecycle, blocked-stop, replay, resume | PASS |
112:1. **Phase 4b replay fixtures do not yet exist.** Deterministic replay gating for production promotion remains advisory-only until replay fixtures from Phase 1 traces are generated.

--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md ---
8:  - "claim ledger"
44:**How it works**: Each loop records `stopReason` from the same small taxonomy, while the legal done gate decides whether STOP is actually allowed. This keeps reason reporting simple and keeps the enforcement logic explicit.
59:- Dashboards, synthesis, and journals can report a single reason vocabulary.
60:- Blocked-stop cases become explicit instead of hidden in convergence math.
87:- Reducer/test surfaces learn blocked-stop reporting and resume-safe stop metadata.
106:Research packets need a durable way to show whether major claims were verified, contradicted, or left unresolved. A ledger must be machine-friendly enough for reducers and synthesis, but still readable in packet outputs.
110:- The ledger must be append-friendly and packet-local.
115:**We chose**: JSONL as the canonical ledger format, with rendered markdown summaries in synthesis/dashboard outputs when needed.
117:**How it works**: The runtime writes structured ledger entries as JSONL so reducers and tests can reason over them. Research synthesis can then summarize those entries in human-readable tables or narrative sections without making markdown the source of truth.
133:- Research summaries can cite the ledger without becoming hand-maintained ledgers themselves.
159:- Research state docs, reducer logic, and synthesis contracts define the ledger path and entry schema.
162:**How to roll back**: Remove the JSONL ledger artifact and revert synthesis/dashboard references to the prior citation-only model.
189:**How it works**: Reducers compute metrics from JSONL, journals, ledgers, and strategy/config files. Generated markdown remains the human-facing dashboard, while machine-readable sources stay authoritative underneath.
403:**We chose**: delta replay plus periodic packet snapshots and compaction, with compaction triggered by explicit thresholds such as run count or JSONL size.
405:**How it works**: Append-only events remain canonical. Reducers consume only the latest delta after a trusted snapshot, while replay validation confirms that post-compaction outputs match a full replay. Trigger policy stays configurable so we can tune by run count, JSONL size, or both without changing the contract.
411:| **Delta replay + periodic snapshots/compaction** | Preserves lineage truth, scales long packets, supports replay validation | Adds snapshot lifecycle and equivalence testing | 9/10 |
421:- Replay tests can compare pre- and post-compaction outputs deterministically.
424:- Snapshot lifecycle, equivalence checks, and compaction triggers must be documented and tested together. Mitigation: make replay validation part of the compaction contract.
430:| Compaction accidentally drops recoverable lineage detail | High | Keep append-only truth canonical and block compaction finalization until replay equivalence passes. |
438:| 3 | **Sufficient?** | PASS | Delta replay plus snapshots covers scale without sacrificing packet-local truth. |
447:- Config/state docs, reducer logic, dashboards, and workflow assets define snapshot metadata, compaction triggers, and replay validation.
448:- Reducer/schema tests add equivalence coverage for invalid-state, resume, completed-continue, and compaction cases.
450:**How to roll back**: Disable snapshot/compaction triggers, restore full replay, and remove compaction-specific test and dashboard surfaces.
465:The original packet placed behavior-first testing after most runtime changes. The research pass found that this leaves early contract work underprotected, especially for replay, invalid-state handling, blocked-stop behavior, and reducer durability.
482:| **Move behavior/replay harnesses earlier** | Protects contract work, catches substrate drift sooner, supports replay corpus growth | Requires parallel coordination with active runtime changes | 9/10 |
501:| Early tests overfit unstable wording instead of stable contract signals | Medium | Prefer fixture semantics, typed fields, and reducer outputs over brittle text snapshots. |
511:| 5 | **Open Horizons?** | PASS | Replay corpora can later feed offline optimizer work. |
518:- The plan and tasks move replay corpus and behavioral harness creation ahead of parity lock.
519:- Behavioral suites gain invalid-state, resume, completed-continue, blocked-stop, and compaction-equivalence fixtures before optional-mode coverage expands.
545:**We chose**: a typed stop-decision trace that records semantic novelty, contradiction density, citation overlap, and blocked-stop details alongside the existing statistical signals.
547:**How it works**: Convergence remains multi-signal, but instead of collapsing meaning into a single score, the runtime records which semantic signals supported or blocked STOP. This keeps dashboards and recovery traces auditable and helps future tuning without inventing a hidden controller.
554:| Scalar-only convergence score | Compact and easy to compare | Hides why STOP happened and why it was blocked | 4/10 |
582:| 5 | **Open Horizons?** | PASS | Typed traces can later feed offline optimizer work. |
589:- Convergence docs, workflow assets, dashboards, reducers, and tests define novelty, contradiction, and citation-overlap fields plus blocked-stop explanations.
590:- Behavioral fixtures prove that semantic contradictions can keep STOP blocked even when scalar novelty is low.
637:- More recovery metadata in journals and dashboards. Mitigation: keep the first ladder compact and packet-local.
653:| 5 | **Open Horizons?** | PASS | Provenance can later feed offline compiler/optimizer work. |
660:- Loop protocol, state schema, journals, dashboards, and behavioral fixtures define the five recovery tiers and their provenance fields.
679:This packet now needs both provenance-oriented journals and verification-oriented ledgers. They are related, but they serve different access patterns and lifecycle needs. If we overload the iteration JSONL stream or hide them inside a hand-edited strategy document, replay, auditing, and reducer ownership all become less clear.
683:- Journals and ledgers must stay packet-local and append-only.
689:**We chose**: journals and ledgers are separate packet-local append-only files, not embedded in iteration JSONL.
697:| **Separate packet-local append-only journals and ledgers** | Clean separation of concerns, clearer replay, better reducer ownership, easier audit access patterns | Adds two explicit artifact contracts to maintain | 9/10 |
698:| Embed journals and ledgers in iteration JSONL | Single file surface | Overloads the event stream, blurs artifact purpose, harder replay and tooling ergonomics | 4/10 |
699:| Embed journals and ledgers in a hand-edited strategy document | Human-visible location | Not append-only, conflicts with reducer-owned sections, weak machine contract | 3/10 |
707:- Reducer ownership stays clearer because journals and ledgers no longer compete with hand-edited strategy sections.
733:- State-format, loop-protocol, reducer, and dashboard docs define journals and ledgers as separate packet-local append-only artifacts.
734:- Behavioral and parity coverage assert that iteration JSONL remains focused on iteration events while journals and ledgers own their respective concerns.

--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md ---
3:description: "Phase 4a: offline replay optimizer with deterministic config tuning, advisory promotion gate, and full audit trail. Phase 4b prompt/meta optimization remains deferred."
7:  - "offline loop optimizer"
8:  - "replay corpus"
9:  - "advisory promotion"
25:| **Spec Folder** | 042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer |
35:Deep-loop configs can now be tuned offline against real packet traces without experimenting live in production. Phase 4a delivers a complete compile/evaluate loop: harvest traces, score them with a rubric, search bounded deterministic config space, replay candidates, and emit advisory candidate patches with a full audit trail.
39:The `040` replay corpus extractor harvests real traces from packet family `040` as the required corpus. Packet family `028` is supported as an optional compatibility-graded holdout. Packet family `042` is explicitly excluded until implementation traces exist. The corpus includes structured JSONL artifacts with iteration metadata, convergence signals, and stop decisions.
43:A multi-dimensional rubric scores convergence efficiency, recovery success rate, finding accuracy, and synthesis quality. Each dimension produces a normalized score that feeds into the search and promotion stages.
51:The search module generates candidate configs by perturbing bounded deterministic numeric fields within the optimizer-managed config surface. Only fields declared tunable in the optimizer manifest are eligible for mutation. Locked contract fields and future prompt-pack entrypoints are explicitly excluded.
55:Every optimization run produces durable audit output covering both accepted and rejected candidates. Advisory patch artifacts include the candidate config diff, rubric scores, replay comparison, and a human-readable recommendation. Rejected candidates are preserved with the same audit detail.
59:The promotion gate refuses production mutation until replay fixtures and behavioral suites exist. All current outputs are advisory-only candidate patches that require human review before any canonical config is changed.
67:Implementation proceeded through 3 sub-phases: corpus/rubric/replay foundation, search/audit/manifest, and advisory promotion gate. 20 files were touched (14 new), adding approximately 3,800 lines. 91 tests cover corpus extraction, rubric scoring, replay determinism, search boundaries, audit persistence, and promotion gate behavior.
78:| Advisory-only promotion until prerequisites exist | Prevents unsafe live mutation from an optimizer that lacks production-grade replay validation |
79:| Optimizer manifest separates tunable vs locked fields | Config governance prevents optimizer from mutating runtime contracts or non-numeric surfaces |
92:| Quality rubric multi-dimensional scoring | PASS |
94:| Search stays within optimizer-managed config boundaries | PASS |
97:| Phase 4b tasks remain blocked with explicit prerequisites | PASS |
105:1. **Phase 4b is deferred.** Prompt-pack generation, cross-packet meta-learning, and automatic promotion remain blocked until behavioral test suites and 2+ compatible corpus families exist.
107:3. **Corpus is limited to `040` family.** Broader corpus coverage from additional packet families will improve optimizer confidence.


 succeeded in 0ms:
--- .opencode/skill/sk-improve-agent/assets/improvement_config_reference.md ---
---
title: Improvement Config Reference
description: Field-level documentation for improvement_config.json runtime configuration.
---

# Improvement Config Reference

Field-level reference for `improvement_config.json`. Use this when modifying runtime configuration for a agent-improver packet.

---

## 1. OVERVIEW

### Purpose

Documents each field in `improvement_config.json` so operators can tune scoring, benchmarking, stop rules, and file protection without guessing.

### When to Use

Use this reference when:
- Adjusting dimension weights for a specific target
- Changing stop rule thresholds
- Enabling or disabling dynamic profiling
- Understanding what each config section controls

---

## 2. FIELDS

### Top-Level

| Field | Type | Description |
| --- | --- | --- |
| `target` | string | Path to the canonical target agent file |
| `targetProfile` | string | Active profile ID (handover, context-prime, or dynamic) |
| `targetKind` | string | Classification: canonical, derived, or candidate-only |
| `maxIterations` | number | Maximum loop iterations before forced stop |
| `executionMode` | string | AUTONOMOUS or INTERACTIVE |
| `proposalOnly` | boolean | When true, candidates cannot be promoted |
| `promotionEnabled` | boolean | When true, guarded promotion is available |

### Scoring

| Field | Type | Description |
| --- | --- | --- |
| `thresholdDelta` | number | Minimum score improvement for candidate-better recommendation |
| `hardRejectOnMissingTemplate` | boolean | Reject if required template references are absent |
| `hardRejectOnNestedDelegation` | boolean | Reject if nested delegation is detected |
| `simplicityTieBreak` | boolean | Prefer simpler candidate when scores tie |
| `dynamicProfileEnabled` | boolean | Allow --dynamic mode with generate-profile.cjs |
| `dimensionWeights` | object | Per-dimension weights for 5D scoring (must sum to 1.0) |

### Stop Rules

| Field | Type | Description |
| --- | --- | --- |
| `maxConsecutiveTies` | number | Stop after N consecutive tie scores |
| `maxInfraFailuresPerProfile` | number | Stop after N infrastructure failures |
| `maxWeakBenchmarkRunsPerProfile` | number | Stop after N weak benchmark results |
| `stopOnDriftAmbiguity` | boolean | Stop if mirror drift report is ambiguous |
| `stopOnDimensionPlateau` | boolean | Stop if all 5 dimensions plateau (identical scores over the plateau window) |
| `plateauWindow` | number | Number of trailing scores to compare for plateau detection (default: 3) |

---

## 3. RELATED RESOURCES

- `improvement_config.json` — the actual config file
- `../references/evaluator_contract.md` — scoring rubric details
- `../references/no_go_conditions.md` — stop condition reference

--- .opencode/skill/sk-improve-agent/README.md ---
---
title: "sk-improve-agent"
description: "Evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, packet-local candidates, and guarded promotion or rollback."
trigger_phrases:
  - "sk-improve-agent"
  - "recursive agent"
  - "agent improvement loop"
  - "bounded agent improvement"
  - "5-dimension scoring"
  - "integration scanner"
---

# sk-improve-agent

Evaluator-first workflow for improving agents across their full integration surface. Instead of editing the canonical target first, it scans all surfaces an agent touches, derives a scoring profile from the agent's own rules, writes packet-local candidates, scores them across 5 deterministic dimensions, and only allows promotion when evidence and approval gates are both satisfied.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. 5-DIMENSION EVALUATION](#4-5-dimension-evaluation)
- [5. STRUCTURE](#5-structure)
- [6. SCRIPTS](#6-scripts)
- [7. CONFIGURATION](#7-configuration)
- [8. USAGE EXAMPLES](#8-usage-examples)
- [9. RUNTIME PARITY](#9-runtime-parity)
- [10. TROUBLESHOOTING](#10-troubleshooting)
- [11. FAQ](#11-faq)
- [12. RELATED DOCUMENTS](#12-related-documents)

---

## 1. OVERVIEW

`sk-improve-agent` helps operators improve agent surfaces safely by proving improvement before mutation. It treats agent improvement as a measurable optimization problem — not ad-hoc prompt tweaking — by scanning integration surfaces, deriving scoring profiles, and maintaining an append-only evidence trail.

| Item | Value |
| --- | --- |
| Primary mode | Proposal-only by default |
| Evaluation | 5-dimension integration-aware scoring |
| Target support | Any agent in `.opencode/agent/` (dynamic profiling) |
| Static profiles | `handover` (promotion-eligible) |
| Runtime area | `{spec_folder}/improvement/` |
| Evidence style | Append-only JSONL ledger + reducer dashboard |

### What Changes With This Skill

| Without sk-improve-agent | With sk-improve-agent |
| --- | --- |
| Prompt edits are ad hoc and untracked | Every candidate is packet-local and evidence-backed |
| Quality is judged by reading the prompt file | Quality is scored across 5 deterministic dimensions |
| Integration drift goes undetected | Scanner checks mirrors, commands, skills, and routing |
| Promotion risk is hard to audit | Promotion, rollback, and drift review produce explicit artifacts |
| Only specific agents can be evaluated | Any agent can be evaluated via dynamic profiling |

### Key Capabilities

| Capability | What It Gives You |
| --- | --- |
| Integration scanning | Maps every surface an agent touches across the repo |
| Dynamic profiling | Derives scoring rules from any agent's own ALWAYS/NEVER/ESCALATE IF sections |
| 5-dimension scoring | Measures structural integrity, rule coherence, integration consistency, output quality, and system fitness |
| Fixture benchmarks | Output-based proof using target-specific fixture sets |
| Dimensional tracking | Per-dimension progress in dashboard with plateau detection |
| Guarded promotion | Canonical mutation only after approval and passing evidence |
| Rollback | Explicit restore with post-rollback dimensional verification |

### Requirements

- An existing spec folder for the improvement run
- Node.js 18+ (for running `.cjs` scripts)
- A target agent file in `.opencode/agent/` (any agent, not just handover)
- Packet-local runtime write access

---

## 2. QUICK START

### 30-Second Setup

1. Choose or create the phase spec folder where the run will live
2. Pick the target agent you want to evaluate
3. Run the loop command

```text
# Evaluate handover agent (static profile)
/improve:agent-improver ".opencode/agent/handover.md" :confirm --spec-folder={spec_folder}

# Evaluate any agent (dynamic profile)
/improve:agent-improver ".opencode/agent/debug.md" :confirm --spec-folder={spec_folder}
```

### Standalone Script Usage

Run individual scripts without the full loop:

```text
# Scan integration surfaces
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=handover

# Generate dynamic profile from any agent
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/debug.md

# Score with 5 dimensions
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --dynamic

# Score with legacy profile (backward compatible)
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --profile=handover --target=.opencode/agent/handover.md
```

### Verify the Runtime Area

After initialization, the runtime folder should contain:

```text
{spec_folder}/improvement/
  agent-improvement-config.json
  agent-improvement-state.jsonl
  agent-improvement-strategy.md
  agent-improvement-dashboard.md
  integration-report.json
  candidates/
  benchmark-runs/
```

### First Successful Outcome

A healthy first iteration produces:
- An integration scan report (JSON)
- A packet-local candidate under `candidates/`
- A score JSON artifact with 5-dimension breakdown
- A benchmark JSON artifact with fixture results
- A refreshed dashboard showing dimensional progress

---

## 3. FEATURES

### 3.1 INTEGRATION-AWARE EVALUATION

The skill evaluates agents across their full system integration surface, not just the `.md` file. The integration scanner discovers all surfaces an agent touches: canonical definition, runtime mirrors (Claude, Codex, .agents), command dispatch references, YAML workflow references, skill mentions, and global doc references.

### 3.2 DYNAMIC PROFILING

Any agent in `.opencode/agent/` can be evaluated without writing a custom profile. The profile generator parses the agent's own frontmatter, ALWAYS/NEVER/ESCALATE IF rules, output verification checklist, capability scan, anti-patterns, and related resources to derive a scoring profile automatically.

### 3.3 5-DIMENSION SCORING

Each candidate is scored across 5 weighted dimensions (see Section 4). This replaces the original keyword-presence checks with integration-aware evaluation that measures structural compliance, rule-workflow alignment, mirror parity, output quality, and system fitness.

### 3.4 PROPOSAL-FIRST IMPROVEMENT

All candidates are written to packet-local runtime areas, never to the canonical target. Experiments are reversible, auditable, and easy to compare. The original target file stays untouched until guarded promotion is explicitly triggered.

### 3.5 GUARDED PROMOTION AND ROLLBACK

Promotion requires passing prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval. Rollback restores the pre-promotion backup and records a post-rollback dimensional snapshot for audit continuity.

### 3.6 DIMENSIONAL PROGRESS TRACKING

The reducer tracks per-dimension scores across iterations, rendering a Dimensional Progress table in the dashboard. It detects when all dimensions have plateaued (3+ identical scores) and triggers a stop condition, preventing endless loops without improvement.

### 3.7 MIRROR DRIFT AS PACKAGING WORK

Runtime mirrors are downstream packaging surfaces. The skill treats them as follow-up parity work, not as proof that the benchmark result was real. The integration scanner reports drift status so it can be addressed separately.

---

## 4. 5-DIMENSION EVALUATION

The scorer evaluates candidates across 5 weighted dimensions. All checks are deterministic (regex, string matching, file existence) — no LLM-as-judge scoring.

| Dimension | Weight | What It Measures | How |
| --- | --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance | Checks for required sections (CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with content | Extracts rules from the agent, checks keyword presence in workflow instructions |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent | Runs `scan-integration.cjs`, scores: mirror parity (60%), command coverage (20%), skill coverage (20%) |
| Output Quality | 0.15 | Output contract compliance | Checks output verification items present in instructions, penalizes placeholder content |
| System Fitness | 0.15 | Permission-capability alignment | Verifies tools listed in capability scan match permission model, resource references exist, frontmatter complete |

### Scoring Modes

| Mode | Flag | Profiles | Use When |
| --- | --- | --- | --- |
| Dynamic | `--dynamic` | Any agent (generated on-the-fly) | Evaluating arbitrary agents, integration health checks |
| Legacy | `--profile=ID` | handover (hardcoded) | Promotion workflows with static fixture sets |

### Weighted Score

The weighted score is computed as:

```text
score = structural * 0.20 + ruleCoherence * 0.25 + integration * 0.25 + outputQuality * 0.15 + systemFitness * 0.15
```

A weighted score >= 70 produces a `candidate-acceptable` recommendation. Below 70 produces `needs-improvement`.

---

## 5. STRUCTURE

```text
.opencode/skill/sk-improve-agent/
|-- SKILL.md                          Skill router and core instructions
|-- README.md                         Human-facing overview (this file)
|-- references/
|   |-- quick_reference.md            Command and dimension reminder
|   |-- loop_protocol.md              End-to-end operator workflow
|   |-- evaluator_contract.md         Scoring and benchmark contract
|   |-- benchmark_operator_guide.md   Fixture benchmark execution
|   |-- promotion_rules.md            Keep, reject, promote decisions
|   |-- rollback_runbook.md           Promotion rollback procedure
|   |-- mirror_drift_policy.md        Mirror packaging policy
|   |-- no_go_conditions.md           Stop and expansion blockers
|   |-- target_onboarding.md          Adding new bounded targets
|   `-- integration_scanning.md       Integration scanner documentation
|-- assets/
|   |-- improvement_charter.md        Fixed policy charter template
|   |-- improvement_strategy.md       Mutable runtime strategy template
|   |-- improvement_config.json       Runtime configuration
|   |-- improvement_config_reference.md  Config field documentation
|   |-- target_manifest.jsonc         Surface classification manifest
|   |-- target-profiles/
|   |   |-- handover.json             Canonical handover profile
|   `-- fixtures/
|       |-- handover/                 Handover output fixtures
|-- scripts/
|   |-- scan-integration.cjs          Integration surface scanner
|   |-- generate-profile.cjs          Dynamic target profile generator
|   |-- score-candidate.cjs           5-dimension candidate scorer
|   |-- run-benchmark.cjs             Fixture + integration benchmark runner
|   |-- reduce-state.cjs              Ledger reducer + dimensional dashboard
|   |-- promote-candidate.cjs         Guarded canonical promotion
|   |-- rollback-candidate.cjs        Canonical rollback helper
|   `-- check-mirror-drift.cjs        Mirror drift report
`-- manual_testing_playbook/
    |-- MANUAL_TESTING_PLAYBOOK.md     Test matrix root (21 scenarios)
    |-- 01--integration-scanner/       Scanner test scenarios
    |-- 02--profile-generator/         Profile generator tests

--- .opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md ---
---
title: sk-improve-agent Manual Testing Playbook
description: Operator-facing validation matrix for the sk-improve-agent skill covering integration scanning, dynamic profiling, 5-dimension scoring, benchmark integration, reducer dimensions, and end-to-end loop execution.
version: 1.0.0
---

# sk-improve-agent Manual Testing Playbook

Manual validation matrix for the holistic agent evaluation framework. Each scenario has an exact command, expected output signals, and pass/fail criteria.

---

## 1. OVERVIEW

### Purpose

Validates that the sk-improve-agent skill correctly discovers integration surfaces, generates dynamic profiles, scores agents across 5 dimensions, integrates with benchmarks, tracks dimensional progress, and runs end-to-end loops.

### Scope

| Category | Scenarios | Focus |
| --- | --- | --- |
| 01 Integration Scanner | 4 | Surface discovery, mirror sync, missing agents, JSON output |
| 02 Profile Generator | 4 | Rule extraction, permission parsing, capability mismatches, edge cases |
| 03 5-Dimension Scorer | 5 | Dynamic mode, legacy mode, dimension breakdown, backward compat, error handling |
| 04 Benchmark Integration | 3 | Integration report flag, backward compat without flag, scoring formula |
| 05 Reducer Dimensions | 3 | Dimensional tracking, dashboard rendering, plateau stop |
| 06 End-to-End Loop | 2 | Full pipeline, any-agent support |

### Prerequisites

- Node.js available (v18+)
- Working directory is the repo root
- All 8 `.cjs` scripts in `.opencode/skill/sk-improve-agent/scripts/` parse without errors
- `package_skill.py --check` passes for sk-improve-agent

### How to Execute

Run each scenario command from the repo root. Compare output against expected signals. Record verdict (PASS/FAIL) with evidence.

---

## 2. TEST MATRIX

### 01 Integration Scanner

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 01-001 | Scan known agent (handover) | `node scripts/scan-integration.cjs --agent=handover` | `status: "complete"`, `mirrors: [...aligned...]`, `commandCount > 0`, `skillCount > 0` | All mirrors aligned, non-zero command and skill counts |
| 01-002 | Scan agent with no mirrors | `node scripts/scan-integration.cjs --agent=nonexistent` | `status: "complete"`, canonical `exists: false`, mirrors all `missing` | Script completes without error, reports missing surfaces |
| 01-003 | Scan diverse agent (debug) | `node scripts/scan-integration.cjs --agent=debug` | `totalSurfaces >= 20`, mirrors aligned | Finds surfaces across commands, skills, global docs |
| 01-004 | JSON output to file | `node scripts/scan-integration.cjs --agent=handover --output=/tmp/scan-test.json` | File written, valid JSON, same content as stdout | File exists and parses as JSON |

### 02 Profile Generator

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 02-001 | Profile with ALWAYS/NEVER rules | `node scripts/generate-profile.cjs --agent=.opencode/agent/handover.md` | `ruleCoherence` array has rules with type `always` and `never` | At least 3 always + 2 never rules extracted |
| 02-002 | Profile with OUTPUT VERIFICATION | `node scripts/generate-profile.cjs --agent=.opencode/agent/debug.md` | `outputChecks` array non-empty | At least 5 output checklist items extracted |
| 02-003 | Agent with no dedicated RULES section | `node scripts/generate-profile.cjs --agent=.opencode/agent/debug.md` | Falls back to inline NEVER extraction | At least 1 never-rule extracted from body scan |
| 02-004 | Output to file | `node scripts/generate-profile.cjs --agent=.opencode/agent/review.md --output=/tmp/profile-test.json` | File written, valid JSON | File exists, has `id`, `derivedChecks`, `agentMeta` |

### 03 5-Dimension Scorer

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 03-001 | Dynamic mode on handover | `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --dynamic` | `evaluationMode: "dynamic-5d"`, 5 dimensions, `legacyScore` present | All 5 dimensions scored, weighted score >= 70 |
| 03-002 | Dynamic mode on arbitrary agent | `node scripts/score-candidate.cjs --candidate=.opencode/agent/orchestrate.md --dynamic` | `evaluationMode: "dynamic-5d"`, `profileId` matches agent name | Produces valid score without hardcoded profile |
| 03-003 | Legacy mode unchanged | `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --profile=handover --target=.opencode/agent/handover.md` | `evaluationMode: "prompt-surface"`, no `dimensions` field | Score identical to pre-refactor behavior |
| 03-004 | Dimension breakdown meaningful | `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --dynamic` | Each dimension has `details` array with individual checks | Details show which checks passed/failed per dimension |
| 03-005 | Missing candidate file | `node scripts/score-candidate.cjs --candidate=nonexistent.md --dynamic` | `status: "infra_failure"`, exit code 1 | Graceful error, not crash |

### 04 Benchmark Integration

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 04-001 | Existing benchmark without integration | `node scripts/run-benchmark.cjs --profile=handover --outputs-dir=/tmp/bench-test --output=/tmp/bench-out.json` | No `integrationScore` field in output | Backward compatible, no integration fields |
| 04-002 | Benchmark with integration report | (Requires integration-report JSON) | `integrationScore` present, `integrationDetails` with mirrorScore, commandScore, skillScore | Integration score is weighted average |
| 04-003 | Existing fixtures still pass | `node scripts/run-benchmark.cjs --profile=handover --outputs-dir=... --output=...` | Existing handover fixtures produce expected scores | No regression from pre-refactor behavior |

### 05 Reducer Dimensions

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 05-001 | Records without dimensions | (Feed JSONL without dimensions field) | Dashboard renders normally, no dimension table | Backward compatible, no errors |
| 05-002 | Records with dimensions | (Feed JSONL with dimensions array) | Dashboard includes "Dimensional Progress" table | Shows Latest, Best, Trend per dimension |
| 05-003 | Plateau detection | (Feed 3+ identical dimension scores) | `stopOnDimensionPlateau` triggers | Stop status reports "All dimensions plateaued" |

### 06 End-to-End Loop

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 06-001 | Full pipeline handover | `/improve:agent-improver ".opencode/agent/handover.md" :confirm --spec-folder={spec}` | Init creates runtime, scan runs, candidate generated, scored with dimensions | All phases complete without error |
| 06-002 | Any-agent pipeline | `/improve:agent-improver ".opencode/agent/debug.md" :confirm --spec-folder={spec}` | Dynamic profile generated, 5-dimension scores produced | Non-hardcoded agent evaluates successfully |

---

## 3. REVIEW PROTOCOL

### Evidence Collection

For each scenario:
1. Run the command
2. Capture stdout (or output file)
3. Record: scenario ID, verdict (PASS/FAIL), captured output excerpt, tester, date

### Failure Triage

| Failure Type | Action |
| --- | --- |
| Script parse error | Check Node.js version, run `node -c script.cjs` |
| Missing fields in output | Check if script was refactored correctly, compare against expected JSON shape |
| Wrong score values | Check dimension weights sum to 1.0, check profile generation logic |
| Integration scanner finds 0 surfaces | Check `--agent` argument matches the agent filename (no extension) |
| Profile generator extracts 0 rules | Check agent uses standard RULES/ALWAYS/NEVER section structure |

### Regression Indicators

- Legacy mode (`--profile`) produces different scores than before refactor
- Benchmark fixtures that previously passed now fail
- Scanner misses known mirror files
- JSON output shape changes break downstream consumers

---

## 4. FEATURE FILES

| Category | Files |
| --- | --- |
| `01--integration-scanner/` | 001-scan-known-agent, 002-scan-missing-agent, 003-scan-diverse-agent, 004-json-output-file |
| `02--profile-generator/` | 005-rules-extraction, 006-output-checks, 007-inline-rules-fallback, 008-file-output |
| `03--5d-scorer/` | 009-dynamic-handover, 010-dynamic-arbitrary, 011-legacy-unchanged, 012-dimension-details, 013-missing-candidate |
| `04--benchmark-integration/` | 014-without-integration, 015-with-integration, 016-fixture-regression |
| `05--reducer-dimensions/` | 017-no-dimensions, 018-with-dimensions, 019-plateau-detection |
| `06--end-to-end-loop/` | 020-full-pipeline, 021-any-agent |

---

## 5. RELATED RESOURCES

- `SKILL.md` — Skill router and 5-dimension framework
- `references/evaluator_contract.md` — Scoring rubric
- `references/integration_scanning.md` — Scanner documentation
- `references/quick_reference.md` — Command examples


exec
/bin/zsh -lc "find . -path '*agent-improvement-state.jsonl' -o -path '*experiment-registry.json' -o -path '*agent-improvement-dashboard.md' -o -path '*benchmark-runs/*.json' | sort | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1513ms:
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-dashboard.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/experiment-registry.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-dashboard.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/context-prime/run-001.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/context-prime/run-candidate-weak.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/repeatability.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-001.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-002.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-candidate-weak.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/experiment-registry.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/benchmark-runs/context-prime/repeatability.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/benchmark-runs/context-prime/run-001.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/benchmark-runs/context-prime/run-002.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/benchmark-runs/handover/repeatability.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/benchmark-runs/handover/run-001.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/benchmark-runs/handover/run-002.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-dashboard.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/experiment-registry.json

codex
There is useful real data for Phase 10 after all: prior `041` packets already contain improver runtime artifacts, including state logs, registries, dashboards, and benchmark runs. I’m sampling those now so the optimizer recommendations are based on actual historical fields and not just what the current config reference says should exist.
exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/experiment-registry.json .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/experiment-registry.json; do echo "--- $f ---"; nl -ba "$f" | sed -n '"'1,120p'; echo; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl ---
     1	{"type":"benchmark_run","profileId":"handover","family":"session-handover","target":".opencode/agent/handover.md","label":"handover-baseline-run-001","outputDir":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/baseline","report":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-001.json","aggregateScore":100,"recommendation":"benchmark-pass","failureModes":[]}
     2	{"type":"benchmark_run","profileId":"handover","family":"session-handover","target":".opencode/agent/handover.md","label":"handover-baseline-run-002","outputDir":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/baseline","report":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-002.json","aggregateScore":100,"recommendation":"benchmark-pass","failureModes":[]}
     3	{"type":"benchmark_run","profileId":"handover","family":"session-handover","target":".opencode/agent/handover.md","label":"handover-candidate-weak","outputDir":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/candidate-weak","report":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-candidate-weak.json","aggregateScore":69,"recommendation":"benchmark-fail","failureModes":["forbidden-patterns","missing-headings","missing-required-patterns"]}
     4	{"type":"benchmark_run","profileId":"context-prime","family":"session-bootstrap","target":".opencode/agent/context-prime.md","label":"context-prime-baseline-run-001","outputDir":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/context-prime/baseline","report":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/context-prime/run-001.json","aggregateScore":100,"recommendation":"benchmark-pass","failureModes":[]}
     5	{"type":"benchmark_run","profileId":"context-prime","family":"session-bootstrap","target":".opencode/agent/context-prime.md","label":"context-prime-candidate-weak","outputDir":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/context-prime/candidate-weak","report":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/context-prime/run-candidate-weak.json","aggregateScore":57,"recommendation":"benchmark-fail","failureModes":["forbidden-patterns","missing-headings","missing-required-patterns"]}
     6	{"type":"baseline","profileId":"handover","family":"session-handover","target":".opencode/agent/handover.md","path":".opencode/agent/handover.md","score":100,"recommendation":"baseline-reference","failureModes":[]}
     7	{"type":"candidate","profileId":"handover","family":"session-handover","target":".opencode/agent/handover.md","path":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/candidates/handover-candidate-001.md","score":50,"delta":-50,"recommendation":"keep-baseline","failureModes":["leaf-only","no-fabrication-rule","path-convention","structured-output","actual-source-reading","no-permissive-skip-context-language"]}
     8	{"type":"baseline","profileId":"context-prime","family":"session-bootstrap","target":".opencode/agent/context-prime.md","path":".opencode/agent/context-prime.md","score":100,"recommendation":"baseline-reference","failureModes":[]}
     9	{"type":"rejected","profileId":"context-prime","family":"session-bootstrap","target":".opencode/agent/context-prime.md","path":".opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/candidates/context-prime-candidate-001.md","score":0,"delta":-100,"recommendation":"reject-candidate","failureModes":["session-bootstrap-tools","read-only-contract","prime-package-format","urgency-skip","time-budget","graceful-failure","routing-guidance","no-indexing","writes-files","runs-indexing"]}

--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/experiment-registry.json ---
     1	{
     2	  "globalMetrics": {
     3	    "totalRecords": 9,
     4	    "targetProfiles": 2,
     5	    "promptRuns": 4,
     6	    "benchmarkRuns": 5,
     7	    "acceptedCount": 0,
     8	    "rejectedCount": 1,
     9	    "tieCount": 0,
    10	    "keepBaselineCount": 1,
    11	    "infraFailureCount": 0,
    12	    "benchmarkPassCount": 3,
    13	    "benchmarkFailCount": 2
    14	  },
    15	  "profiles": {
    16	    "handover": {
    17	      "profileId": "handover",
    18	      "family": "session-handover",
    19	      "latestRecord": {
    20	        "type": "candidate",
    21	        "profileId": "handover",
    22	        "family": "session-handover",
    23	        "target": ".opencode/agent/handover.md",
    24	        "path": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/candidates/handover-candidate-001.md",
    25	        "score": 50,
    26	        "delta": -50,
    27	        "recommendation": "keep-baseline",
    28	        "failureModes": [
    29	          "leaf-only",
    30	          "no-fabrication-rule",
    31	          "path-convention",
    32	          "structured-output",
    33	          "actual-source-reading",
    34	          "no-permissive-skip-context-language"
    35	        ]
    36	      },
    37	      "bestPromptRecord": {
    38	        "type": "baseline",
    39	        "profileId": "handover",
    40	        "family": "session-handover",
    41	        "target": ".opencode/agent/handover.md",
    42	        "path": ".opencode/agent/handover.md",
    43	        "score": 100,
    44	        "recommendation": "baseline-reference",
    45	        "failureModes": []
    46	      },
    47	      "bestBenchmarkRecord": {
    48	        "type": "benchmark_run",
    49	        "profileId": "handover",
    50	        "family": "session-handover",
    51	        "target": ".opencode/agent/handover.md",
    52	        "label": "handover-baseline-run-001",
    53	        "outputDir": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline",
    54	        "report": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/run-001.json",
    55	        "aggregateScore": 100,
    56	        "recommendation": "benchmark-pass",
    57	        "failureModes": []
    58	      },
    59	      "acceptedCandidates": [],
    60	      "rejectedCandidates": [],
    61	      "benchmarkRuns": [
    62	        {
    63	          "type": "benchmark_run",
    64	          "profileId": "handover",
    65	          "family": "session-handover",
    66	          "target": ".opencode/agent/handover.md",
    67	          "label": "handover-baseline-run-001",
    68	          "outputDir": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline",
    69	          "report": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/run-001.json",
    70	          "aggregateScore": 100,
    71	          "recommendation": "benchmark-pass",
    72	          "failureModes": []
    73	        },
    74	        {
    75	          "type": "benchmark_run",
    76	          "profileId": "handover",
    77	          "family": "session-handover",
    78	          "target": ".opencode/agent/handover.md",
    79	          "label": "handover-baseline-run-002",
    80	          "outputDir": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline",
    81	          "report": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/run-002.json",
    82	          "aggregateScore": 100,
    83	          "recommendation": "benchmark-pass",
    84	          "failureModes": []
    85	        },
    86	        {
    87	          "type": "benchmark_run",
    88	          "profileId": "handover",
    89	          "family": "session-handover",
    90	          "target": ".opencode/agent/handover.md",
    91	          "label": "handover-candidate-weak",
    92	          "outputDir": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/candidate-weak",
    93	          "report": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/run-candidate-weak.json",
    94	          "aggregateScore": 69,
    95	          "recommendation": "benchmark-fail",
    96	          "failureModes": [
    97	            "forbidden-patterns",
    98	            "missing-headings",
    99	            "missing-required-patterns"
   100	          ]
   101	        }
   102	      ],
   103	      "infraFailures": [],
   104	      "promptRecommendations": [
   105	        "baseline-reference",
   106	        "keep-baseline"
   107	      ],
   108	      "benchmarkRecommendations": [
   109	        "benchmark-pass",
   110	        "benchmark-pass",
   111	        "benchmark-fail"
   112	      ],
   113	      "failureModes": {
   114	        "forbidden-patterns": 1,
   115	        "missing-headings": 1,
   116	        "missing-required-patterns": 1,
   117	        "leaf-only": 1,
   118	        "no-fabrication-rule": 1,
   119	        "path-convention": 1,
   120	        "structured-output": 1,

--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl ---
     1	{"iteration":1,"candidateFile":"candidates/candidate-001.md","score":99,"recommendation":"candidate-acceptable","profileId":"agent-improver","evaluationMode":"dynamic-5d","dimensions":[{"name":"structural","score":100,"weight":0.2},{"name":"ruleCoherence","score":100,"weight":0.25},{"name":"integration","score":100,"weight":0.25},{"name":"outputQuality","score":100,"weight":0.15},{"name":"systemFitness","score":93,"weight":0.15}],"timestamp":"2026-04-04T11:25:00Z"}
     2	{"iteration":2,"candidateFile":"candidates/candidate-002.md","score":100,"recommendation":"candidate-acceptable","profileId":"agent-improver","evaluationMode":"dynamic-5d","dimensions":[{"name":"structural","score":100,"weight":0.2},{"name":"ruleCoherence","score":100,"weight":0.25},{"name":"integration","score":100,"weight":0.25},{"name":"outputQuality","score":100,"weight":0.15},{"name":"systemFitness","score":100,"weight":0.15}],"timestamp":"2026-04-04T11:30:00Z"}
     3	{"iteration":3,"candidateFile":"candidates/candidate-003.md","score":100,"recommendation":"candidate-acceptable","profileId":"agent-improver","evaluationMode":"dynamic-5d","dimensions":[{"name":"structural","score":100,"weight":0.2},{"name":"ruleCoherence","score":100,"weight":0.25},{"name":"integration","score":100,"weight":0.25},{"name":"outputQuality","score":100,"weight":0.15},{"name":"systemFitness","score":100,"weight":0.15}],"timestamp":"2026-04-04T11:35:00Z"}

--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/experiment-registry.json ---
     1	{
     2	  "globalMetrics": {
     3	    "totalRecords": 3,
     4	    "targetProfiles": 1,
     5	    "promptRuns": 3,
     6	    "benchmarkRuns": 0,
     7	    "acceptedCount": 3,
     8	    "rejectedCount": 0,
     9	    "tieCount": 0,
    10	    "keepBaselineCount": 0,
    11	    "infraFailureCount": 0,
    12	    "benchmarkPassCount": 0,
    13	    "benchmarkFailCount": 0
    14	  },
    15	  "profiles": {
    16	    "agent-improver": {
    17	      "profileId": "agent-improver",
    18	      "family": "agent-improver",
    19	      "latestRecord": {
    20	        "iteration": 3,
    21	        "candidateFile": "candidates/candidate-003.md",
    22	        "score": 100,
    23	        "recommendation": "candidate-acceptable",
    24	        "profileId": "agent-improver",
    25	        "evaluationMode": "dynamic-5d",
    26	        "dimensions": [
    27	          {
    28	            "name": "structural",
    29	            "score": 100,
    30	            "weight": 0.2
    31	          },
    32	          {
    33	            "name": "ruleCoherence",
    34	            "score": 100,
    35	            "weight": 0.25
    36	          },
    37	          {
    38	            "name": "integration",
    39	            "score": 100,
    40	            "weight": 0.25
    41	          },
    42	          {
    43	            "name": "outputQuality",
    44	            "score": 100,
    45	            "weight": 0.15
    46	          },
    47	          {
    48	            "name": "systemFitness",
    49	            "score": 100,
    50	            "weight": 0.15
    51	          }
    52	        ],
    53	        "timestamp": "2026-04-04T11:35:00Z"
    54	      },
    55	      "bestPromptRecord": {
    56	        "iteration": 2,
    57	        "candidateFile": "candidates/candidate-002.md",
    58	        "score": 100,
    59	        "recommendation": "candidate-acceptable",
    60	        "profileId": "agent-improver",
    61	        "evaluationMode": "dynamic-5d",
    62	        "dimensions": [
    63	          {
    64	            "name": "structural",
    65	            "score": 100,
    66	            "weight": 0.2
    67	          },
    68	          {
    69	            "name": "ruleCoherence",
    70	            "score": 100,
    71	            "weight": 0.25
    72	          },
    73	          {
    74	            "name": "integration",
    75	            "score": 100,
    76	            "weight": 0.25
    77	          },
    78	          {
    79	            "name": "outputQuality",
    80	            "score": 100,
    81	            "weight": 0.15
    82	          },
    83	          {
    84	            "name": "systemFitness",
    85	            "score": 100,
    86	            "weight": 0.15
    87	          }
    88	        ],
    89	        "timestamp": "2026-04-04T11:30:00Z"
    90	      },
    91	      "bestBenchmarkRecord": null,
    92	      "acceptedCandidates": [
    93	        {
    94	          "iteration": 1,
    95	          "candidateFile": "candidates/candidate-001.md",
    96	          "score": 99,
    97	          "recommendation": "candidate-acceptable",
    98	          "profileId": "agent-improver",
    99	          "evaluationMode": "dynamic-5d",
   100	          "dimensions": [
   101	            {
   102	              "name": "structural",
   103	              "score": 100,
   104	              "weight": 0.2
   105	            },
   106	            {
   107	              "name": "ruleCoherence",
   108	              "score": 100,
   109	              "weight": 0.25
   110	            },
   111	            {
   112	              "name": "integration",
   113	              "score": 100,
   114	              "weight": 0.25
   115	            },
   116	            {
   117	              "name": "outputQuality",
   118	              "score": 100,
   119	              "weight": 0.15
   120	            },


exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-dashboard.md .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-dashboard.md; do echo "--- $f ---"; sed -n '"'1,220p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-dashboard.md ---
# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | 9 |
| Target profiles | 2 |
| Prompt runs | 4 |
| Benchmark runs | 5 |
| Accepted candidates | 0 |
| Rejected candidates | 1 |
| Ties | 0 |
| Keep-baseline results | 1 |
| Benchmark passes | 3 |
| Benchmark fails | 2 |
| Infra failures | 0 |

## Guardrails

- Canonical promotion target remains ".opencode/agent/handover.md"
- Candidate-only target remains ".opencode/agent/context-prime.md"
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: no
- Drift ambiguity: no
- Reasons: none

## context-prime

- Family: session-bootstrap
- Prompt runs: 2
- Benchmark runs: 2
- Accepted candidates: 0
- Rejected candidates: 1
- Benchmark passes: 1
- Benchmark fails: 1
- Infra failures: 0
- Best prompt score: 100
- Best benchmark score: 100
- Latest recommendation: reject-candidate

### Repeated Failure Modes

- forbidden-patterns: 1
- graceful-failure: 1
- missing-headings: 1
- missing-required-patterns: 1
- no-indexing: 1

## handover

- Family: session-handover
- Prompt runs: 2
- Benchmark runs: 3
- Accepted candidates: 0
- Rejected candidates: 0
- Benchmark passes: 2
- Benchmark fails: 1
- Infra failures: 0
- Best prompt score: 100
- Best benchmark score: 100
- Latest recommendation: keep-baseline

### Repeated Failure Modes

- actual-source-reading: 1
- forbidden-patterns: 1
- leaf-only: 1
- missing-headings: 1
- missing-required-patterns: 1


## Recommendation

Fix repeated benchmark failures before broadening scope or promoting any target.

--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-dashboard.md ---
# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | 3 |
| Target profiles | 1 |
| Prompt runs | 3 |
| Benchmark runs | 0 |
| Accepted candidates | 3 |
| Rejected candidates | 0 |
| Ties | 0 |
| Keep-baseline results | 0 |
| Benchmark passes | 0 |
| Benchmark fails | 0 |
| Infra failures | 0 |

## Guardrails

- Canonical promotion target remains ".opencode/agent/handover.md"
- Candidate-only target remains ".opencode/agent/context-prime.md"
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: no
- Drift ambiguity: no
- Reasons: none

## agent-improver

- Family: agent-improver
- Prompt runs: 3
- Benchmark runs: 0
- Accepted candidates: 3
- Rejected candidates: 0
- Benchmark passes: 0
- Benchmark fails: 0
- Infra failures: 0
- Best prompt score: 100
- Best benchmark score: n/a
- Latest recommendation: candidate-acceptable

### Repeated Failure Modes

- none

### Dimensional Progress

| Dimension | Latest | Best | Trend |
| --- | --- | --- | --- |
| Structural | 100 | 100 | → |
| Rule Coherence | 100 | 100 | → |
| Integration | 100 | 100 | → |
| Output Quality | 100 | 100 | → |
| System Fitness | 100 | 100 | → |


## Recommendation

Continue only when the next run has a clearer signal than the current best-known state.


exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-001.json .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-002.json .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/repeatability.json; do echo "--- $f ---"; sed -n '"'1,220p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-001.json ---
{
  "status": "benchmark-complete",
  "profileId": "handover",
  "family": "session-handover",
  "target": ".opencode/agent/handover.md",
  "label": "handover-baseline-run-001",
  "aggregateScore": 100,
  "maxScore": 100,
  "recommendation": "benchmark-pass",
  "thresholds": {
    "requiredAggregateScore": 85,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0
  },
  "fixtures": [
    {
      "id": "completion-ready",
      "outputPath": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline/completion-ready.md",
      "score": 100,
      "maxScore": 100,
      "passed": true,
      "missingHeadings": [],
      "missingPatterns": [],
      "forbiddenMatches": [],
      "failureModes": []
    },
    {
      "id": "implementation-progress",
      "outputPath": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline/implementation-progress.md",
      "score": 100,
      "maxScore": 100,
      "passed": true,
      "missingHeadings": [],
      "missingPatterns": [],
      "forbiddenMatches": [],
      "failureModes": []
    },
    {
      "id": "verification-blocker",
      "outputPath": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline/verification-blocker.md",
      "score": 100,
      "maxScore": 100,
      "passed": true,
      "missingHeadings": [],
      "missingPatterns": [],
      "forbiddenMatches": [],
      "failureModes": []
    }
  ],
  "failureModes": []
}

--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/run-002.json ---
{
  "status": "benchmark-complete",
  "profileId": "handover",
  "family": "session-handover",
  "target": ".opencode/agent/handover.md",
  "label": "handover-baseline-run-002",
  "aggregateScore": 100,
  "maxScore": 100,
  "recommendation": "benchmark-pass",
  "thresholds": {
    "requiredAggregateScore": 85,
    "minimumFixtureScore": 70,
    "repeatabilityTolerance": 0
  },
  "fixtures": [
    {
      "id": "completion-ready",
      "outputPath": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline/completion-ready.md",
      "score": 100,
      "maxScore": 100,
      "passed": true,
      "missingHeadings": [],
      "missingPatterns": [],
      "forbiddenMatches": [],
      "failureModes": []
    },
    {
      "id": "implementation-progress",
      "outputPath": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline/implementation-progress.md",
      "score": 100,
      "maxScore": 100,
      "passed": true,
      "missingHeadings": [],
      "missingPatterns": [],
      "forbiddenMatches": [],
      "failureModes": []
    },
    {
      "id": "verification-blocker",
      "outputPath": ".opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/improvement/benchmark-runs/handover/baseline/verification-blocker.md",
      "score": 100,
      "maxScore": 100,
      "passed": true,
      "missingHeadings": [],
      "missingPatterns": [],
      "forbiddenMatches": [],
      "failureModes": []
    }
  ],
  "failureModes": []
}

--- .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/benchmark-runs/handover/repeatability.json ---
{
  "profileId": "handover",
  "runsCompared": [
    "run-001",
    "run-002"
  ],
  "aggregateScores": [
    100,
    100
  ],
  "recommendationPairs": [
    "benchmark-pass",
    "benchmark-pass"
  ],
  "passed": true,
  "tolerance": 0
}


exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/decision-record.md; do echo "--- $f ---"; rg -n "node|edge|relation|ontology|loop_type|session_id|contradiction|claim|question|finding|evidence|provenance|namespace|coverage gap|unverified|hot node" "$f" | head -n 160; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md; do echo "--- $f ---"; rg -n "activation|threshold|1000|50'"\\+|segment|wave|fan-out|merge|sessionId|generation|segment|provenance|promotion|prune|board.json|dashboard.md|deterministic\" \""'$f" | head -n 200; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md ---
24:The design target is explicit reuse, not greenfield invention. Research findings revise the reuse estimate to roughly 35-45% direct reuse, 25-30% adapted reuse, and the remainder genuinely new loop semantics. Edge management from `causal-edges.ts`, degree/depth metrics from `graph-signals.ts`, contradiction-reporting patterns from `contradiction-detection.ts`, and SQLite setup patterns from `code-graph-db.ts` transfer well, but contradiction adjudication, convergence design, and reducer/MCP integration are not plug-and-play. Phase 001 remains the legal stop-decision foundation. Phase 002 adds graph context so low novelty only permits STOP when coverage, verification, and contradiction state agree.
41:| **Handoff Criteria** | Phase 003 can consume graph-backed coverage, contradiction, provenance, and convergence signals without introducing a second graph model. |
55:- Shared coverage-graph CommonJS helpers for edge management, signals, contradictions, and convergence.
56:- A dedicated `deep-loop-graph.sqlite` store with `coverage_nodes`, `coverage_edges`, and `coverage_snapshots`.
69:Deep research and deep review currently know a great deal about iteration counts, novelty, and state transitions, but they still lack a first-class semantic model of coverage. The runtime can tell us progress is slowing down, yet it cannot answer the harder questions that matter for legal STOP:
71:- Have the important questions been answered by more than one finding?
72:- Are key claims verified or still unresolved?
73:- Are contradictions isolated and explained, or silently accumulating?
76:This is not a missing-technology problem. The existing Spec Kit Memory MCP server already contains mature graph patterns for typed weighted edges, breadth-first traversal, contradiction detection, degree and depth signals, historical momentum, and SQLite-backed graph storage. What is missing is a loop-native graph ontology and persistence layer that applies those patterns to deep research and deep review.
91:- Define research and review graph ontologies, including node kinds, relation types, initial weight estimates, metadata contracts, and convergence metrics.
94:- Calibrate coverage-specific edge weights during implementation instead of treating inherited memory-causal weights as final.
113:| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs` | Create | Shared edge manager, relation-weight maps, clamping, self-loop prevention, edge update history, and provenance traversal helpers extracted from `causal-edges.ts`. |
115:| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs` | Create | CONTRADICTS-edge discovery and reporting helpers specialized for deep-loop semantics. |
123:| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts` | Create | Query engine for gap detection, provenance chains, contradiction lookup, and hot-node ranking. |
125:| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` | Create | Handler for bulk node/edge upserts with idempotency, clamping, and self-loop rejection. |
127:| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts` | Create | Handler for graph health, counts, relation breakdowns, and signal summaries. |
139:| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define graph-aware review convergence signals and contradiction handling. |
140:| `.opencode/agent/deep-research.md` | Modify | Require research iterations to emit graph nodes and edges into JSONL state. |
141:| `.opencode/agent/deep-review.md` | Modify | Require review iterations to emit graph nodes and edges into JSONL state. |
147:| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts` | Create | Verify edge insertion, update, deletion, self-loop prevention, and provenance traversal. |
150:| `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` | Create | Verify schema creation, namespace isolation, idempotent upsert behavior, and snapshot persistence. |
155:Research findings revise the original reuse estimate downward: Phase 002 is now planned as 35-45% direct reuse, 25-30% adapted reuse, and the remainder genuinely new loop semantics. Direct reuse is concentrated in graph primitives and DB lifecycle patterns; adapted work is concentrated in contradiction handling, convergence design, and reducer/MCP integration.
159:| Memory causal graph | `lib/storage/causal-edges.ts` | `coverage-graph-core.cjs` | Reuse typed edge insertion/update/delete, strength clamping, self-loop prevention, update history, and BFS traversal. |
161:| Contradiction detector | `lib/graph/contradiction-detection.ts` | `coverage-graph-contradictions.cjs` | Reuse CONTRADICTS-edge scanning and paired reporting. |
170:| `caused` | `ANSWERS` | 1.3 | Question to finding |
171:| `supports` | `SUPPORTS` | 1.0 | Finding to claim |
172:| `contradicts` | `CONTRADICTS` | 0.8 | Finding to finding |
173:| `supersedes` | `SUPERSEDES` | 1.5 | Claim to claim |
174:| `derived_from` | `DERIVED_FROM` | 1.0 | Claim to finding |
175:| `enabled` | `COVERS` | 1.1 | Question to question |
185:| `supports` | `EVIDENCE_FOR` | 1.0 | Evidence to finding |
186:| `contradicts` | `CONTRADICTS` | 0.8 | Finding to finding |
187:| `supersedes` | `RESOLVES` | 1.5 | Remediation to finding |
188:| `derived_from` | `CONFIRMS` | 1.0 | Finding to finding |
189:| `enabled` | `ESCALATES` | 1.2 | Finding to finding |
198:- Namespace boundary: `spec_folder + loop_type + session_id`
201:#### Table: `coverage_nodes`
205:- `loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review'))`
206:- `session_id TEXT NOT NULL`
216:- `idx_coverage_folder_type(spec_folder, loop_type)`
218:- `idx_coverage_session(session_id)`
221:Research node kinds and metadata:
227:Review node kinds and metadata:
232:- `REMEDIATION`: `{ text, finding_id, status }`
234:#### Table: `coverage_edges`
238:- `loop_type TEXT NOT NULL`
239:- `source_id TEXT NOT NULL REFERENCES coverage_nodes(id)`
240:- `target_id TEXT NOT NULL REFERENCES coverage_nodes(id)`
241:- `relation TEXT NOT NULL`
248:- `idx_coverage_edge_source(source_id)`
249:- `idx_coverage_edge_target(target_id)`
250:- `idx_coverage_edge_relation(relation)`
251:- `idx_coverage_edge_folder_type(spec_folder, loop_type)`
257:- `loop_type TEXT NOT NULL`
260:- `node_count INTEGER`
261:- `edge_count INTEGER`
263:- `UNIQUE(spec_folder, loop_type, iteration)`
266:- `questionCoverage`
267:- `claimVerificationRate`
268:- `contradictionDensity`
270:- `evidenceDepth`
271:- `nodeCount`
272:- `edgeCount`
276:- `findingStability`
278:- `evidenceDensity`
280:- `nodeCount`
281:- `edgeCount`
287:| `deep_loop_graph_upsert` | Reducer writes graph deltas after each iteration | Idempotent node/edge upsert, clamped weights, self-loop rejection, metadata updates on repeated IDs |
288:| `deep_loop_graph_query` | Structured analysis of graph state | Support `uncovered_questions`, `unverified_claims`, `contradictions`, `provenance_chain`, `coverage_gaps`, and `hot_nodes` |
289:| `deep_loop_graph_status` | Health and metrics overview | Return node/edge counts, grouped counts, signal values, last iteration, and schema version |
299:1. `questionCoverage = count(questions with >= 2 ANSWERS edges) / count(all questions)`
300:2. `claimVerificationRate = count(claims with status != "unresolved") / count(all claims)`
301:3. `contradictionDensity = count(CONTRADICTS edges) / count(all edges)`
304:4. `sourceDiversity = average distinct source quality classes per question`
305:5. `evidenceDepth = average path length from question -> finding -> source`
307:`sourceDiversity` and `evidenceDepth` are blocking guards, not informational votes. STOP remains blocked when either guard is below threshold, even if the weighted signals look favorable.
311:1. `dimensionCoverage = count(dimensions with >= 1 COVERS edge) / count(all dimensions)`
312:2. `findingStability = count(findings with 0 CONTRADICTS edges) / count(all findings)`
313:3. `p0ResolutionRate = count(P0 findings with RESOLVES edge) / count(P0 findings)`
314:4. `evidenceDensity = average EVIDENCE_FOR edges per finding`
341:| REQ-001 | Phase 002 MUST reuse existing Spec Kit Memory graph primitives instead of inventing a second edge or traversal stack. | The implementation plan names `causal-edges.ts`, `graph-signals.ts`, `contradiction-detection.ts`, and `code-graph-db.ts` as the extraction baseline; shared coverage-graph helper files own the adapted logic. |
342:| REQ-002 | The phase MUST define `deep-loop-graph.sqlite` with the exact `coverage_nodes`, `coverage_edges`, and `coverage_snapshots` schema described in this spec. | Table names, loop-type constraints, unique snapshot key, no-self-loop rule, and indexes are all documented and carried through plan/tasks. |
343:| REQ-003 | Research coverage graphs MUST use the defined node kinds, relation types, initial weight estimates, and metadata contract. | `QUESTION`, `FINDING`, `CLAIM`, and `SOURCE` are canonical; all listed research relations appear unchanged; initial weight estimates are documented as inherited starting points and a calibration task is carried through plan/tasks; research metrics use the defined formulas. |
344:| REQ-004 | Review coverage graphs MUST use the defined node kinds, relation types, initial weight estimates, and metadata contract. | `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, and `REMEDIATION` are canonical; all listed review relations appear unchanged; initial weight estimates are documented as inherited starting points and a calibration task is carried through plan/tasks; review metrics use the defined formulas. |
346:| REQ-006 | Graph convergence MUST contextualize Phase 001 stop logic without replacing `newInfoRatio`. | The phase explicitly states that low novelty plus strong coverage can allow legal STOP, while low novelty plus uncovered questions, unresolved contradictions, or failed coverage guards (`sourceDiversity`, `evidenceDepth`) must block legal STOP. |
353:| REQ-008 | Deep-research and deep-review state/convergence references and agents MUST emit graph-native artifacts. | Both state-format reference files document `graphEvents`; both convergence reference files explain graph-aware signals; both agent files instruct iterations to emit graph nodes and edges. |
365:- **SC-003**: Research and review graph ontologies are fully specified, including kinds, relations, initial weight estimates, metadata, convergence metrics, and the requirement to calibrate weights during implementation.
374:1. **Given** a research packet with low novelty and high question coverage, **when** `deep_loop_graph_convergence` runs, **then** it can support legal STOP only if claims are verified and contradictions are within tolerance.
375:2. **Given** a research packet with low novelty but uncovered questions, **when** convergence is evaluated, **then** the decision must be `STOP_BLOCKED` and the blockers must name the uncovered questions.
376:3. **Given** a review packet with unresolved contradictory findings, **when** convergence is evaluated, **then** legal STOP is blocked even if iteration novelty has fallen.
393:| Risk | Research and review relations diverge in hidden ways | Medium | Centralize relation maps and convergence formulas so only domain ontology changes between loop types. |
418:- Research/review specialization must happen through explicit relation maps and metric formulas.
422:<!-- ANCHOR:edge-cases -->
425:- A node is emitted with the same ID but updated metadata on a later iteration. Upsert must merge the update without duplicating the node.
426:- An edge attempts to reference its own source node as target. The upsert contract must reject the self-loop.
427:- A packet stores both research and review graph data under the same `spec_folder`. `loop_type` isolation must prevent query bleed.
428:- A graph contains zero questions or zero dimensions. Convergence code must return safe zero-state metrics instead of dividing by zero.
429:- Contradictions exist but are only partially resolved. Convergence must surface unresolved blockers instead of treating any contradiction edge as a full stop.
430:- A provenance chain spans repeated nodes. Traversal must detect cycles and return cumulative path strength without infinite recursion.
431:<!-- /ANCHOR:edge-cases -->
441:| **Schema Design** | Medium-High: the schema is concrete, but it must serve both research and review without leaking one ontology into the other. |
449:<!-- ANCHOR:questions -->
452:- No blocking product-scope questions remain for planning.
455:<!-- /ANCHOR:questions -->

--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/decision-record.md ---
rg: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/decision-record.md: IO error for operation on .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/decision-record.md: No such file or directory (os error 2)


 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md ---
3:description: "Define orchestrator-managed parallel wave execution for deep research and deep review so large targets can be segmented, converged, and merged without turning LEAF agents into sub-agent managers."
6:  - "wave executor"
7:  - "segment planner"
22:Phase 003 adds orchestrator-managed parallel wave execution so deep research and deep review can handle very large targets without abandoning the LEAF-worker model. It formalizes deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the coverage-graph foundation from Phase 002.
24:Critical prerequisite: workflow fan-out/join capability must be proven before wave execution can be built. The current YAML workflow engine has no native parallel dispatch, so this phase must first establish either helper-module orchestration that safely performs fan-out/join outside the YAML surface or an explicit engine extension that makes parallel dispatch and join first-class.
41:| **Handoff Criteria** | Phase 004 can replay wave runs as deterministic, segment-aware traces with stable board and merge artifacts. |
45:**Phase Context**: This phase adds orchestrator-managed parallel batches on top of the coverage-graph substrate from Phase 002. The goal is scale without architectural drift: the workers stay LEAF, while orchestration logic handles segmentation, fan-out, pruning, promotion, and merge.
48:- Proven fan-out/join capability via helper-module orchestration or YAML workflow engine extension.
54:- Proven workflow fan-out/join path before any wave-mode runtime wiring proceeds.
55:- v1 deterministic segmentation using heuristics: file-count thresholds, directory grouping, simple hotspot ranking, and stable segment identities.
56:- v2 graph/cluster-enhanced segmentation using the Phase 002 coverage graph once the graph surfaces are operational.
57:- Wave lifecycle orchestration for plan, fan-out, prune, promote, and merge.
59:- Reducer-owned `board.json` execution ledger plus derived human-readable `dashboard.md` render.
60:- Segment JSONL contract and merge rules keyed by explicit identifiers rather than append order.
61:- Verification for segment isolation, merge correctness, and default-path preservation.
71:The deep-loop products are currently optimized for one iteration stream at a time. That works for moderate targets, but it becomes inefficient and hard to govern once a review scope crosses 1000 files or a research scope spans dozens of domains. Without a structured wave executor, operators must either accept slow sequential progress or invent ad hoc parallelism that risks duplicated work, conflicting findings, and unmergeable state. The problem is amplified by the current YAML workflow engine, which has no native parallel dispatch or join capability today.
75:Define an orchestrator-layer wave execution model that segments large review and research targets into bounded parallel batches, tracks each segment through convergence and promotion, and merges the results back into one auditable packet without changing the LEAF-worker rule.
85:- Prove workflow fan-out/join capability before wave execution is wired into deep research or deep review.
86:- Add shared CommonJS planners for v1 deterministic review-file segmentation and research-domain segmentation.
87:- Add v2 graph/cluster-enhanced segmentation that refines decomposition using the Phase 002 coverage graph once it is operational.
88:- Define wave lifecycle steps: plan, fan-out, prune, promote, and merge.
89:- Introduce machine-first, reducer-owned packet-local coordination tracking with `board.json` as the canonical execution ledger and `dashboard.md` as a derived human-readable render.
91:- Define segment-local JSONL or state artifacts and deterministic merge rules into the main packet lineage using explicit keys: `sessionId`, `generation`, `segment`, `wave`, and `findingId`.
92:- Apply Phase 002 graph convergence per segment so pruning and promotion decisions are evidence-backed.
93:- Add activation gates so wave execution only activates for review scopes with at least 1000 files plus hotspot spread, or research scopes with at least 50 domains plus cluster diversity; otherwise the default sequential path remains unchanged.
94:- Add workflow, config, and strategy surfaces for wave-aware execution without changing the default small-target path.
95:- Add tests for lifecycle correctness, segment isolation, merge idempotence, and resume or recovery behavior.
100:- Offline replay optimization, config search, and promotion gates from Phase 004.
108:| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` | Create | Shared planner for v1 heuristic segmentation and v2 graph-enhanced review or research segments. |
109:| `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` | Create | Orchestrator lifecycle helpers for fan-out, join, prune, promote, merge, and resume state transitions. |
110:| `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs` | Create | Reducer-owned `board.json` execution-ledger schema, status transitions, conflict tracking, and derived dashboard renderer helpers. |
111:| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs` | Create | Segment JSONL, lineage, and merge helpers keyed by explicit segment identifiers. |
112:| `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs` | Create | Segment-level convergence helpers that wrap Phase 002 graph metrics and stop traces. |
113:| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document domain-ledger prepass, activation gates, v1/v2 segmentation, fan-out/join, prune or promote rules, and merge behavior for research. |
114:| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add `domain-ledger.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
115:| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
116:| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add segment plan, promoted findings, and merge checkpoints while keeping execution-ledger ownership machine-first. |
117:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document `hotspot-inventory.json`, activation gates, v1/v2 segmentation, wave lifecycle, and merge behavior for review. |
118:| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add `hotspot-inventory.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
119:| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
120:| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add segment queues, conflict tracking, and merge checkpoints while keeping execution-ledger ownership machine-first. |
121:| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Define wave-aware review outputs and reducer-owned coordination sections. |
122:| `.opencode/command/spec_kit/deep-research.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for research. |
123:| `.opencode/command/spec_kit/deep-review.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for review. |
124:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add domain-ledger prepass, fan-out/join, prune, promote, and keyed merge steps for research. |
125:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode research flow aligned with activation-gated wave lifecycle rules. |
126:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add hotspot-inventory prepass, fan-out/join, prune, promote, and keyed merge steps for review. |
127:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode review flow aligned with activation-gated wave lifecycle rules. |
128:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts` | Create | Verify segment planning, ranking, and clustering behavior. |
129:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` | Create | Verify lifecycle transitions, prune rules, and promotion rules. |
130:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts` | Create | Verify segment isolation, deterministic merge, and idempotent replay behavior. |
131:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts` | Create | Verify wave interruption and resume behavior. |
143:| REQ-000 | Workflow fan-out/join capability MUST be proven before wave execution can be built. | The packet defines and verifies one canonical path for parallel dispatch plus join, either through helper-module orchestration or a YAML engine extension; until that proof exists, wave execution remains blocked and the default sequential path stays authoritative. |
144:| REQ-001 | The phase MUST define two segmentation versions for both large review scopes and large research scopes. | v1 uses deterministic heuristics such as file-count thresholds, directory grouping, simple hotspot ranking, domain counts, authority levels, and stable cluster assignment; v2 explicitly layers Phase 002 coverage-graph or cluster signals on top of v1 once the graph surfaces are operational. |
146:| REQ-003 | The phase MUST define a packet-local coordination board that is reducer-owned and machine-first. | `board.json` is the canonical execution ledger for per-segment state, conflict notes, deduplication markers, and promotion outcomes; `dashboard.md` is a derived human-readable render and not a human-edited strategy surface. |
147:| REQ-004 | Segment-local JSONL and merge rules MUST preserve auditability when wave results are merged back into the main packet lineage. | Segment artifacts remain replayable on their own, merged records always include explicit keys `sessionId`, `generation`, `segment`, `wave`, and `findingId`, and merge logic never relies on append order as the source of truth. |
153:| REQ-005 | Each segment MUST use Phase 002 graph signals independently for convergence, pruning, promotion, and v2 decomposition upgrades. | Segment convergence explicitly references coverage-graph status or convergence outputs; prune logic can retire converged or stuck segments without dropping unresolved global gaps silently; graph-enhanced segmentation is blocked until the Phase 002 coverage graph is operational. |
154:| REQ-006 | Deep-research and deep-review workflows MUST expose wave execution as a bounded mode for large targets while preserving the default small-target path. | Wave mode activates only when review targets have at least 1000 files with hotspot spread or research targets have at least 50 domains with cluster diversity; otherwise command docs, YAML workflows, and config surfaces keep the normal single-stream flow as the default path. |
155:| REQ-007 | Wave planning MUST emit mandatory decomposition prepass artifacts before any segment fan-out occurs. | Review writes `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities; research writes `domain-ledger.json` with source domains, authority levels, and cluster assignments; both artifacts are consumed by later wave steps rather than treated as optional notes. |
156:| REQ-008 | Segment promotion and merge MUST preserve conflict and dedupe metadata instead of flattening segment results into one anonymous stream. | The coordination board and merge outputs explicitly keep `conflict`, `duplicate`, or `promoted` state so later synthesis and replay can explain where findings came from. |
157:| REQ-009 | The phase MUST add verification for lifecycle correctness, segment isolation, merge correctness, and resume behavior. | Planned tests cover fan-out/join proof, planner determinism, lifecycle transitions, keyed merge idempotence, interruption or resume semantics, activation-gate fallbacks, and protection against duplicate or conflicting promoted findings. |
165:- **SC-001**: Fan-out/join capability is proven before wave mode is wired into deep research or deep review.
166:- **SC-002**: Research and review each have documented v1 heuristic segmentation plus v2 graph-enhanced segmentation that scale to the large-target examples in the phase brief.
167:- **SC-003**: The wave lifecycle is explicit and ordered: prepass, plan, fan-out, prune, promote, join, then merge.
168:- **SC-004**: `board.json` is treated as the canonical packet-local execution ledger and `dashboard.md` is clearly derived from it.
169:- **SC-005**: `hotspot-inventory.json` and `domain-ledger.json` are mandatory prepass artifacts before wave dispatch.
170:- **SC-006**: Segment-local artifacts remain replayable and mergeable without losing segment provenance or keyed identity.
171:- **SC-007**: Phase 002 graph convergence is reused per segment in v2 rather than redefined for wave mode.
172:- **SC-008**: Default non-wave execution remains the canonical small-target path.
173:- **SC-009**: Verification covers fan-out/join proof, planner determinism, lifecycle behavior, merge correctness, activation gates, and resume safety.
177:1. **Given** the current YAML workflow engine has no native parallel dispatch, **when** this phase begins implementation, **then** a helper-module orchestration proof or engine extension must be chosen and validated before wave execution is treated as buildable.
178:2. **Given** a review scope with at least 1000 files and meaningful hotspot spread, **when** wave planning runs, **then** the review prepass emits `hotspot-inventory.json` and the planner emits stable v1 hotspot-ranked segments instead of one monolithic file list.
179:3. **Given** a research scope with at least 50 source domains and cluster diversity, **when** wave planning runs, **then** the research prepass emits `domain-ledger.json` and the planner emits bounded domain clusters with stable identities.
180:4. **Given** Phase 002 graph signals are operational, **when** v2 segmentation runs, **then** the planner refines decomposition using graph coverage or cluster signals rather than replacing the v1 heuristic baseline blindly.
181:5. **Given** one segment converges early, **when** prune evaluation runs, **then** that segment can retire without making global STOP legal until remaining gaps are satisfied.
182:6. **Given** two segments surface duplicate or conflicting findings, **when** promotion and merge happen, **then** the coordination board preserves those states and the merged JSONL remains keyed by explicit identifiers rather than append order.
183:7. **Given** a wave is interrupted mid-run, **when** resume starts, **then** only incomplete segment work is resumed and previously merged segment lineage remains intact.
184:8. **Given** a small-target run or a large target that lacks hotspot spread or cluster diversity, **when** deep research or deep review starts, **then** execution stays on the existing single-stream path and does not invoke wave machinery unnecessarily.
194:| Dependency | Workflow fan-out/join capability is not yet native in the YAML workflow engine | High | Treat proof of helper-module orchestration or engine extension as the first blocking deliverable before any wave runtime build begins. |
195:| Dependency | Phase 002 graph convergence must exist before segment pruning is trustworthy | High | Treat graph status and convergence as prerequisite surfaces for prune and promote decisions. |
196:| Dependency | Phase 001 resume semantics remain the lineage authority | Medium | Build wave resume on top of the same typed stop and journal model rather than creating a second checkpoint system. |
197:| Risk | Segment planners produce unstable partitions between runs | Medium | Require deterministic ranking and stable segment IDs based on scope metadata. |
198:| Risk | Merge behavior duplicates or overwrites findings across segments | High | Preserve segment provenance, conflict markers, and dedupe metadata through merge rules and tests. |
199:| Risk | Coordination-board maintenance becomes manual busywork | Medium | Keep `board.json` reducer-owned and generate `dashboard.md` as a derived render, not a human-maintained strategy surface. |
200:| Risk | Wave mode leaks into small-target defaults and makes normal runs harder to understand | Medium | Gate wave mode behind explicit large-target criteria and keep the default path unchanged. |
201:| Risk | YAML workflow engine needs extension work before fan-out/join is trustworthy | High | Treat engine extension or helper-orchestration proof as the biggest implementation risk and keep sequential execution as the fallback until it is validated. |
211:- Merge and board updates must remain cheap enough to execute after each wave.
215:- Segment lineage must survive interruption and replay without losing provenance.
216:- Default single-stream behavior must remain available when wave mode is disabled or inapplicable.
221:- Planner, lifecycle, convergence, and merge logic should remain in shared helper modules rather than being embedded repeatedly in YAML.
229:- A repo hotspot spans multiple clusters and appears in more than one planned segment. Deduplication and promotion rules must prevent the same finding from being merged twice.
230:- A research domain cluster converges quickly while a second cluster remains unresolved. Prune logic must retire the first segment without making global STOP legal yet.
231:- A segment fails or stalls mid-wave. Resume behavior must restart only the affected segment or re-plan safely rather than invalidating the whole wave.
232:- Merge happens after some segments promoted findings with contradictory evidence. The coordination board must preserve that conflict instead of flattening to one winner silently.
233:- Small targets accidentally trigger the wave planner. Activation criteria must fall back to the single-stream path when segmentation adds no value.
235:- JSONL append order differs from logical merge order after retries or resumed segments. Merge must sort and dedupe by explicit keys rather than line position.
245:| **Planning** | High: deterministic segmentation for two different product types is non-trivial. |
246:| **State Management** | High: segment-local JSONL plus merged lineage must stay replayable and auditable. |
247:| **Workflow Orchestration** | High: fan-out, prune, promote, and merge add real lifecycle complexity. |
248:| **Review Feasibility** | Medium-High: review-side wave execution is comparatively concrete because the inputs are files, reducer contracts already exist, and evidence can stay file-level and auditable. |
249:| **Research Feasibility** | Medium: research-side wave execution needs a discovery artifact that does not exist yet today, and there is no init-time source inventory to segment from without first building `domain-ledger.json`. |
260:| Fan-out/join proof fails on current YAML engine | High | High | Block wave execution until helper orchestration or engine extension is validated. |
261:| Planner instability across runs | Medium | High | Stabilize segment identity and ranking inputs before rollout. |
262:| Merge drops provenance or dedupe state | Medium | High | Treat provenance preservation as a merge gate, not a nice-to-have. |
263:| Wave mode changes default behavior | Low | High | Keep activation criteria explicit and covered by regression tests. |
264:| Board state becomes manual | Medium | Medium | Generate `board.json` and refresh the derived dashboard through shared runtime helpers. |
271:- As an operator researching many domains, I want segment-level convergence and promotion so the loop can focus resources where uncertainty still exists.
272:- As a future optimizer, I want segment-aware traces, board states, and merge metadata so I can replay and tune large-target behavior offline.
279:- Which fan-out/join proof path becomes canonical for this phase: helper-module orchestration wrapped around today's YAML engine, or a direct YAML workflow engine extension? This is a blocking prerequisite, not optional follow-up work.

--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md ---
rg: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md: IO error for operation on .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md: No such file or directory (os error 2)


exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md; do echo "--- $f ---"; rg -n "rubric|weight|tunable|locked|audit|advisory|prompt-pack|patch artifact|candidate patch|replay|corpus|dimension|trade-off|stability|promotion" "$f" | head -n 200; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md ---
3:description: "Define an offline replay optimizer that tunes deterministic deep-loop configs against real packet traces now, while deferring prompt and meta-optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
7:  - "replay corpus"
9:  - "advisory promotion gate"
22:Phase 004 is now explicitly split into two sub-phases. Phase 4a is the realistic near-term deliverable: build an offline compile/evaluate loop that replays real packet traces, tunes deterministic numeric config thresholds, and emits advisory patch recommendations with a full audit trail. Phase 4b is deferred future work for prompt-pack and meta-optimization once replay fixtures, behavioral suites, and multi-family corpus coverage actually exist.
39:| **Handoff Criteria** | Phase 4a outputs are replay-verified, audit-trailed, and emitted as advisory-only candidate patches until Phase 1 replay fixtures and Phase 3 behavioral suites exist. |
43:**Phase Context**: This phase closes the moonshot chain by turning prior run traces into an offline improvement engine, but the research findings show the safe near-term scope is narrower than originally drafted. Phases 001 through 003 make deep-loop behavior explicit, graph-aware, and segment-capable; Phase 4a should use those artifacts to tune deterministic thresholds and recovery settings without experimenting live in production, while Phase 4b stays deferred until the replay and behavioral foundations are real.
49:- Phase 001 replay fixtures must exist before any production-grade replay or promotion claim is credible.
50:- Phase 003 behavioral suites must exist before any non-advisory promotion is allowed.
53:- **Phase 4a**: replay corpus builder with `040` required, `028` optional as an older holdout, and `042` excluded until it has implementation traces.
54:- **Phase 4a**: rubric and scoring framework for run quality, deterministic replay runner, random-search baseline, optimizer manifest, and audit-trailed advisory candidate reports.
55:- **Phase 4b (deferred)**: prompt-pack optimization, task-shape-aware meta-learning, and gated production promotion after prerequisite suites and corpus diversity exist.
65:The deep-loop products now have richer runtime state, but tuning them is still largely manual: convergence thresholds, stuck detection, recovery escalation, and related numeric controls are adjusted by human judgment and one-off testing. That is expensive, hard to compare rigorously, and vulnerable to regressions because the system has no offline compile/evaluate loop that can replay historical traces, score outcomes, and prove that a new deterministic configuration is actually better before it is even considered for production.
69:Define an offline replay optimizer that learns from real packet traces, scores run quality against a shared rubric, searches bounded deterministic config space, and emits advisory candidate patches only. Production promotion remains out of scope until Phase 1 replay fixtures and Phase 3 behavioral suites exist, and prompt or meta-optimization remains deferred future work.
79:- Build a replay corpus with packet family `040` as the required source, packet family `028` as an optional structurally older holdout, and packet family `042` excluded until it has real implementation traces.
80:- Define a rubric for finding accuracy, convergence efficiency, recovery success rate, and synthesis quality.
82:- Add a deterministic replay runner for reducer and convergence logic under alternate configs.
83:- Add a canonical optimizer manifest that declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
84:- Add an advisory-only promotion gate that never mutates production config directly while prerequisite fixtures and suites are still missing.
85:- Record a full audit trail for every optimization attempt, including rejected candidates and patch-style recommendations.
94:- Full prompt optimization, cross-packet meta-learning, and automatic production promotion in the current phase scope.
100:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
101:| `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs` | Create | Score runs across accuracy, convergence efficiency, recovery success, and synthesis quality. |
103:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
104:| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and emit advisory-only candidate patches. |
105:| `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Create | Canonical manifest of tunable fields, locked contract fields, and future prompt-pack entrypoints. |
106:| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
107:| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
108:| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
109:| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
110:| `.opencode/command/spec_kit/deep-research.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
111:| `.opencode/command/spec_kit/deep-review.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
112:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
113:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts` | Create | Verify scoring rules and metric weighting behavior. |
115:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
116:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify advisory promotion gating, rollback behavior, and audit output. |
117:| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures, optimization-result snapshots, and advisory patch artifacts. |
129:| REQ-001 | Phase 4a MUST build a replay corpus with packet family `040` as the required source corpus. | Corpus inputs are tied to real `040` packet artifacts, normalized into a deterministic replay format, and traceable back to their source runs and metadata. |
130:| REQ-002 | Packet family `028` MAY be ingested as an optional holdout corpus, but only with compatibility grading because it is older and structurally different; packet family `042` MUST NOT be treated as corpus input until it has real implementation traces. | Corpus ingestion records source-family compatibility, marks `028` as optional holdout only, and rejects `042` as a training corpus until live traces exist. |
131:| REQ-003 | The optimizer MUST define a rubric that scores run quality across finding accuracy, convergence efficiency, recovery success rate, and synthesis quality. | The rubric exposes explicit metric definitions, weighting, and score outputs; the phase does not rely on one opaque "goodness" number. |
132:| REQ-004 | Phase 4a MUST provide a deterministic replay runner that can evaluate alternate configs without running live agent iterations. | Replay consumes stored traces and config candidates, produces repeatable outputs, and isolates replay from live network or human-in-the-loop variability. |
133:| REQ-005 | The phase MUST define a canonical optimizer manifest that separates tunable fields, locked contract fields, and prompt-pack entrypoints. | A single manifest names each optimizer-managed field family, each locked lifecycle or schema contract field, and each future prompt-pack insertion point. |
134:| REQ-006 | No production promotion is allowed until the replay fixtures planned in Phase 1 and the behavioral suites planned in Phase 3 actually exist. | Until both prerequisite surfaces exist, all optimizer outputs are advisory-only candidate patches or reports and must not directly mutate canonical production configs. |
140:| REQ-007 | Phase 4a search MUST stay within deterministic numeric config families such as convergence thresholds, stuck sensitivity, and recovery escalation. | Search configuration covers the allowed deterministic tunable dimensions, excludes locked contract fields, and records which candidates touched which parameter families. |
141:| REQ-008 | Every optimization run MUST emit an audit trail that records what was tried, what improved, what regressed, and why a candidate was accepted or rejected. | Audit output exists for every run, including failed searches and rejected advisory promotions, and captures both candidate settings and evaluation outcomes. |
142:| REQ-009 | Optimizer scoring MUST incorporate graph and wave metrics when those traces are available, without inventing fake values for older runs. | The corpus and rubric can consume Phase 002 or Phase 003 signals when present, and explicitly mark them unavailable for older traces instead of fabricating them. |
143:| REQ-010 | If prompt optimization remains in scope for deferred Phase 4b, it MUST operate on generated prompt packs or patch artifacts rather than directly mutating agent `.md` files. | Prompt candidates are expressed as generated pack outputs or patch artifacts that can be replayed, diffed, tested, and rolled back independently of canonical agent markdown. |
152:- **SC-001**: The optimizer corpus is built from real packet traces, with `040` as the required source family.
153:- **SC-002**: Rubric scores are broken down by quality dimension, not hidden behind one opaque number.
156:- **SC-005**: Promotion remains advisory-only until replay fixtures and behavioral suites exist.
157:- **SC-006**: Every optimization run produces a reviewable audit trail.
158:- **SC-007**: The optimizer manifest keeps tunable and locked fields explicit and rollback-friendly.
159:- **SC-008**: Any future prompt optimization route is expressed as prompt packs or patch artifacts rather than direct agent-markdown mutation.
163:1. **Given** packet family `040`, **when** the corpus builder runs, **then** it emits deterministic replay inputs tied back to its source runs and metadata.
164:2. **Given** packet family `028`, **when** the corpus builder attempts ingestion, **then** it records compatibility grading and treats `028` as an optional holdout instead of a required training corpus.
165:3. **Given** packet family `042`, **when** corpus intake is evaluated, **then** the optimizer refuses to treat it as replay corpus until implementation traces exist.
166:4. **Given** a candidate config improves convergence efficiency but harms accuracy, **when** rubric scoring runs, **then** the breakdown shows the trade-off explicitly instead of hiding it.
167:5. **Given** the same baseline trace and candidate config, **when** replay runs twice, **then** the resulting score and decision outputs remain stable.
168:6. **Given** a candidate outperforms baseline in replay but the Phase 1 replay fixtures or Phase 3 behavioral suites do not yet exist, **when** promotion runs, **then** the optimizer emits only an advisory patch or report and refuses production promotion.
169:7. **Given** an older packet trace lacks graph or wave metrics, **when** scoring runs, **then** the audit trail marks those dimensions unavailable rather than inventing placeholder values.
170:8. **Given** a candidate touches a non-tunable contract field, **when** promotion eligibility is checked, **then** the optimizer rejects the candidate as out of bounds.
171:9. **Given** a future prompt candidate, **when** optimization is attempted, **then** the system works through a generated prompt pack or patch artifact rather than mutating agent `.md` files directly.
181:| Dependency | Phase 001-003 traces must be stable and sufficiently rich | High | Limit corpus intake to runs with trustworthy runtime artifacts and record gaps explicitly. |
182:| Dependency | Phase 001 replay fixtures must exist before promotion can graduate beyond advisory reports | High | Treat missing replay fixtures as a hard promotion block and keep outputs patch-only. |
183:| Dependency | Phase 003 behavioral suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
184:| Risk | Replay fidelity is too low to support fair candidate comparisons | High | Keep replay deterministic, tie it to stored traces, and reject promotion when fidelity is insufficient. |
185:| Risk | Optimization without behavioral tests could promote broken configs | High | Keep promotion advisory-only until the behavioral suite exists and passes. |
186:| Risk | Search space grows too broad and hides why a candidate improved | Medium | Start with bounded numeric parameter families and require audit logs for every search step. |
188:| Risk | Single-family corpus limits generalization | High | Treat `040` as a pilot corpus, treat `028` as optional holdout only, and defer meta-learning until 2+ compatible families exist. |
189:| Risk | Optional holdout `028` is structurally incompatible with modern replay assumptions | Medium | Compatibility-grade it explicitly and never require it for Phase 4a success. |
198:- Offline search and replay should remain bounded enough to run in routine maintenance windows without monopolizing the developer environment.
204:- Promotion must fail closed when replay fidelity, rubric coverage, or downstream tests are insufficient.
205:- Advisory-only promotion must be the default behavior until the prerequisite replay fixtures and behavioral suites exist.
211:- Canonical agent markdown must remain behavior documentation; optimizer experimentation belongs in generated prompt packs or patch artifacts.
218:- A candidate improves convergence efficiency but harms finding accuracy. Promotion must reject that trade-off unless the rubric explicitly preserves overall quality.
220:- Two candidate configs tie on rubric score but differ in risk. The promotion gate must keep the safer or more explainable candidate, or refuse promotion.
221:- Replay reveals that optional holdout `028` behaves differently from required corpus `040`. Audit output must preserve that split rather than averaging it away.
222:- A candidate modifies an optimizer-managed threshold and a non-tunable contract field together. Promotion must reject the candidate as out of bounds.
223:- A candidate improves replay score before behavioral suites exist. The optimizer must emit only an advisory report or patch artifact and refuse production promotion.
224:- A prompt experiment tries to write directly into an agent markdown file. The optimizer must reject it and require a generated prompt pack or patch artifact instead.
236:| **Replay Fidelity** | High: deterministic replay is the whole safety story for Phase 4a. |
237:| **Governance** | High: advisory-only promotion, manifest boundaries, and rollback semantics must stay explicit. |
238:| **Deferred Scope** | Very High: prompt optimization and meta-learning are materially premature until behavioral suites and broader corpus coverage exist. |
248:| Replay fidelity is insufficient | Medium | High | Reject promotion and keep optimizer output advisory only. |
249:| Search explores out-of-bounds fields | Low | High | Enforce optimizer-managed field allowlists in search and promotion logic. |
250:| Single-family corpus bias skews candidate selection | High | Medium | Treat `040` as a pilot corpus, keep `028` holdout results separate, and defer meta-learning. |
251:| Missing behavioral tests would allow broken configs through | Medium | High | Keep promotion advisory-only until those suites exist and pass. |
252:| Audit trail is too weak to explain a promotion | Medium | Medium | Treat missing audit detail as a promotion failure. |
259:- As a release reviewer, I want every candidate to show baseline comparison, audit reasoning, and explicit advisory-only status until replay and behavioral gates are real.
260:- As a future runtime maintainer, I want optimizer-managed fields clearly separated from hard runtime contracts and future prompt-pack entrypoints so rollback stays simple.
268:- Phase 4b stays intentionally deferred until the behavioral test suite exists and at least two compatible corpus families support broader learning.
279:- Real corpus source today: `../../040-sk-deep-research-review-improvement-1/research/research.md`

--- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md ---
rg: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md: IO error for operation on .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md: No such file or directory (os error 2)


codex
One important nuance is emerging: the 042 packet literature describes separate journals and ledgers as the desired runtime truth, but the currently shipped deep-research/deep-review references still lean heavily on the main state JSONL as the active event stream. That matters for Phase 005, because agent-improver should follow the mature contract direction without pretending every predecessor surface is already fully split out in live code.
exec
/bin/zsh -lc 'rg -n "journal|ledger|journalPath|claim-verification|verification ledger|state.jsonl|findings-registry|board.json|snapshot|compaction" .opencode/skill/sk-deep-research .opencode/skill/sk-deep-review .opencode/command/spec_kit .opencode/skill/system-spec-kit/scripts | head -n 400' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/command/spec_kit/handover.md:293:On context compaction detection ("Please continue the conversation..."):
.opencode/skill/sk-deep-research/assets/deep_research_config.json:31:    "registryFile": "research/findings-registry.json",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:53:    "deep-research-state.jsonl": "append-only",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:56:    "findings-registry.json": "auto-generated",
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:17:2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:24:- **Data sources:** `deep-research-state.jsonl` + `findings-registry.json` + `deep-research-strategy.md`
.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:176:  when_to_use: ["Session interrupted unexpectedly", "Context compaction detected", "Need to recover without handover.md"]
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:82:[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:184:- Findings registry: `deep-review-findings-registry.json`
.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:243:  when_to_use: ["Session interrupted unexpectedly", "Context compaction detected", "Need to recover without handover.md"]
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:255:      pathPattern: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:306:      pathPattern: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:448:    - id: review-contract-snapshot
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:449:      path: .opencode/skill/sk-deep-review/assets/review_mode_contract_snapshot.md
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:453:        begin: "<!-- BEGIN GENERATED: review-mode-contract/snapshot -->"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:454:        end: "<!-- END GENERATED: review-mode-contract/snapshot -->"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:484:      description: Ensure reducer inputs, outputs, and findings-registry metrics are documented consistently across assets and runtime mirrors.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81:  state_log: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:83:  registry: "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:87:  synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:120:          - "{spec_folder}/research/state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:132:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:180:        output: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197:        output: "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:221:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:317:              State Log: {spec_folder}/research/deep-research-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:319:              Registry: {spec_folder}/research/findings-registry.json
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:334:          priorReducedState: "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:336:          - "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:349:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:351:          - registry_updated: "Reducer refreshed findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:364:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:365:          - "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:393:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:394:          - "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:430:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:484:        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:528:      - "git add {spec_folder}/research/iterations/iteration-{NNN}.md {spec_folder}/research/deep-research-state.jsonl {spec_folder}/research/deep-research-strategy.md {spec_folder}/research/research.md"
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:17:2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:24:- **Data sources:** `deep-review-state.jsonl` + `deep-review-strategy.md` + `deep-review-findings-registry.json`
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:81:  state_log: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:83:  registry: "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:87:  synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:120:          - "{spec_folder}/research/state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:132:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:143:          ask: "Resume, restart (archive old state), fork (new angle from current state), or completed-continue (snapshot prior synthesis and reopen)?"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:179:        output: "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:196:        output: "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:217:          Reducer-owned state will live in `{spec_folder}/research/findings-registry.json` and `{spec_folder}/research/deep-research-dashboard.md`.
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:241:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:360:              State Log: {spec_folder}/research/deep-research-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:362:              Registry: {spec_folder}/research/findings-registry.json
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:377:          priorReducedState: "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:379:          - "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:392:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:394:          - registry_updated: "Reducer refreshed findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:434:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:435:          - "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:466:          - "{spec_folder}/research/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:467:          - "{spec_folder}/research/findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:526:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:600:        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:616:      - "git add {spec_folder}/research/iterations/iteration-{NNN}.md {spec_folder}/research/deep-research-state.jsonl {spec_folder}/research/deep-research-strategy.md {spec_folder}/research/research.md"
.opencode/skill/sk-deep-review/assets/deep_review_config.json:46:    "deep-review-state.jsonl": "append-only",
.opencode/skill/sk-deep-review/assets/deep_review_config.json:47:    "deep-review-findings-registry.json": "auto-generated",
.opencode/skill/sk-deep-review/SKILL.md:191:    │  deep-review-state.jsonl        │
.opencode/skill/sk-deep-review/SKILL.md:207:  deep-review-state.jsonl            # Append-only review iteration log
.opencode/skill/sk-deep-review/SKILL.md:223:Init --> Create config.json, strategy.md, state.jsonl
.opencode/skill/sk-deep-review/SKILL.md:234:  |                                         6. Append deep-review-state.jsonl
.opencode/skill/sk-deep-review/SKILL.md:261:- `deep-review-state.jsonl`
.opencode/skill/sk-deep-review/SKILL.md:262:- `deep-review-findings-registry.json`
.opencode/skill/sk-deep-review/SKILL.md:400:- All state files present and consistent (`config.json`, `state.jsonl`, `strategy.md`)
.opencode/skill/sk-deep-review/SKILL.md:460:  Agent appends {spec_folder}/review/deep-review-state.jsonl
.opencode/skill/sk-deep-review/SKILL.md:506:| JSONL state | pi-autoresearch | `deep-review-state.jsonl` (append-only audit log) |
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:68:/** Input parameters required to build a project state snapshot. */
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:616: * Assemble a complete project state snapshot from session parameters.
.opencode/skill/system-spec-kit/scripts/README.md:18:- [2. INVENTORY SNAPSHOT](#2--inventory-snapshot)
.opencode/skill/system-spec-kit/scripts/README.md:30:<!-- ANCHOR:inventory-snapshot -->
.opencode/skill/system-spec-kit/scripts/README.md:69:<!-- /ANCHOR:inventory-snapshot -->
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:85:  state_log: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:86:  findings_registry: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:122:            - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:123:            - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:127:            - "{spec_folder}/scratch/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:136:            - "scratch/deep-research-config.json declares mode == 'review' OR scratch/deep-research-state.jsonl contains mode == 'review'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:139:          - "{spec_folder}/scratch/deep-research-state.jsonl -> {spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:156:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:261:        output: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:266:        output: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:303:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:304:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:425:              State Log: {spec_folder}/review/deep-review-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:426:              Findings Registry: {spec_folder}/review/deep-review-findings-registry.json
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:442:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:471:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:473:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:474:        write: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:480:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:481:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:556:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:557:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:643:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:690:        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:740:      - "git add {spec_folder}/review/iterations/iteration-{NNN}.md {spec_folder}/review/deep-review-state.jsonl {spec_folder}/review/deep-review-findings-registry.json {spec_folder}/review/deep-review-strategy.md {spec_folder}/review/review-report.md"
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:5:// snapshot construction. Extracted from workflow.ts to reduce module size.
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:10:FAILURE_CLASS="ledger-mismatch"
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:21:heal-ledger-mismatch.sh - Deterministic auto-remediation for mutation ledger mismatch
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:24:  ./heal-ledger-mismatch.sh [OPTIONS]
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:97:    ops_run_step "$FAILURE_CLASS" "detect-ledger-divergence" "$MAX_ATTEMPTS" "$BACKOFF_SECONDS" "$DETECT_FAILURES" "$OWNER" \
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:98:        "node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict" || exit 1
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:100:    ops_run_step "$FAILURE_CLASS" "replay-ledger" "$MAX_ATTEMPTS" "$BACKOFF_SECONDS" "$REPAIR_FAILURES" "$OWNER" \
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:101:        "node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay" || exit 1
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:103:    ops_emit_success "$FAILURE_CLASS" "$OWNER" "ledger replay consistency restored"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:85:  state_log: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:86:  findings_registry: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:122:            - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:123:            - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:127:            - "{spec_folder}/scratch/deep-research-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:136:            - "scratch/deep-research-config.json declares mode == 'review' OR scratch/deep-research-state.jsonl contains mode == 'review'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:139:          - "{spec_folder}/scratch/deep-research-state.jsonl -> {spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:155:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:156:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167:          ask: "Resume, restart (archive old state), fork (new angle from current state), or completed-continue (snapshot prior review and reopen)?"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:260:        output: "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:265:        output: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:327:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:328:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:472:              State Log: {spec_folder}/review/deep-review-state.jsonl
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:473:              Findings Registry: {spec_folder}/review/deep-review-findings-registry.json
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:489:          - jsonl_appended: "New iteration record in state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:517:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:519:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:520:        write: "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:556:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:557:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:631:          - "{spec_folder}/review/deep-review-state.jsonl"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:632:          - "{spec_folder}/review/deep-review-findings-registry.json"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:742:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:814:        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:831:      - "git add {spec_folder}/review/iterations/iteration-{NNN}.md {spec_folder}/review/deep-review-state.jsonl {spec_folder}/review/deep-review-findings-registry.json {spec_folder}/review/deep-review-strategy.md {spec_folder}/review/review-report.md"
.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:15:  'deep-research-state.jsonl',
.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:83:    [/scratch\/deep-research-state\.jsonl/g, 'research/deep-research-state.jsonl'],
.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:18://   - Records results to speckit-eval.db (eval_metric_snapshots)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1475:  // Project state snapshot must run BEFORE distinguishing-evidence because
.opencode/skill/system-spec-kit/scripts/ops/README.md:80:3. `ledger-mismatch`
.opencode/skill/system-spec-kit/scripts/ops/README.md:96:| `heal-ledger-mismatch.sh` | Run ledger-mismatch remediation workflow |
.opencode/command/spec_kit/resume.md:365:- If a context-compaction continuation prompt is detected, stop and present current task/state summary before taking actions.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:14:This scenario validates fresh review initialization creates canonical state files for `DRV-004`. The objective is to verify that a fresh session creates the canonical `review/deep-review-config.json`, `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `review/deep-review-strategy.md`, and `review/iterations/` directory from the shipped assets.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:28:- Orchestrator prompt: Validate the fresh-initialization contract for sk-deep-review. Confirm that initialization creates `review/deep-review-config.json`, `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `review/deep-review-strategy.md`, and `review/iterations/` from the live templates, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:47:| DRV-004 | Fresh review initialization creates canonical state files | Verify that a fresh session creates the canonical config, JSONL, registry, strategy, and iteration directory from the shipped assets. | Validate the fresh-initialization contract for sk-deep-review. Confirm that initialization creates `review/deep-review-config.json`, `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `review/deep-review-strategy.md`, and `review/iterations/` from the live templates, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'step_create_directories|step_create_config|step_create_state_log|step_create_findings_registry|step_create_strategy' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 2. `bash: sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_config.json && sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` -> 3. `bash: rg -n 'state_paths|config:|state_log:|findings_registry:|strategy:|iteration_pattern' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | The review/ directory is created, config comes from the shared config template, the findings registry comes from the reducer contract, strategy comes from the sk-deep-review strategy template, and the JSONL begins with a config record. | Capture the initialization step names, the live template files, and the state_paths contract in one evidence bundle. | PASS if protocol, YAML, and asset templates agree on the initial review artifacts and their roles; FAIL if the artifact list or template sources drift. | Check both YAML variants, verify the JSONL init step writes a config record, confirm the reducer registry is created, and confirm the assets live under `assets/`. |
.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts:19://   - Records results to speckit-eval.db (eval_metric_snapshots)
.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts:73:  prodDb.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:38:        ledger-mismatch) echo "${SCRIPT_DIR}/heal-ledger-mismatch.sh" ;;
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:64:        ledger-mismatch)
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:66:CLASS: ledger-mismatch
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:67:TRIGGER: mutation ledger parity mismatch or replay consistency failure
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:70:DRILL: ./runbook.sh drill ledger-mismatch --scenario success
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:105:        for failure_class in index-drift session-ambiguity ledger-mismatch telemetry-drift; do
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh:136:ledger-mismatch
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:28:- Orchestrator prompt: Validate the resume-after-pause contract for sk-deep-review. Confirm that when the operator removes `review/.deep-review-pause`, the review loop re-reads `deep-review-state.jsonl` and `deep-review-strategy.md`, determines the correct iteration number, and resumes dispatching from the next iteration without re-running completed iterations, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:47:| DRV-022 | Resume after pause sentinel removal | Verify removing pause sentinel lets review resume from read-state without re-running completed iterations. | Validate the resume-after-pause contract for sk-deep-review. Confirm that when the operator removes `review/.deep-review-pause`, the review loop re-reads `deep-review-state.jsonl` and `deep-review-strategy.md`, determines the correct iteration number, and resumes dispatching from the next iteration without re-running completed iterations, then return a concise operator-facing verdict. | 1. `bash: rg -n 'resume|re-read|read.state|iteration.*count|last.*iteration|Delete.*pause|sentinel.*removal' .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/state_format.md` -> 2. `bash: rg -n 'resume|read_state|re_read|iteration_count|last_iteration|pause.*removed|sentinel.*delete' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'resume|pause.*delete|pick up|restart|continue.*review' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md` | Removing sentinel triggers loop re-entry, JSONL re-read determines last iteration, strategy.md provides dimension state, no iterations re-run, and resume event logged. | Capture the resume flow from loop protocol, the YAML state re-read mechanism, and the user-facing resume instructions. | PASS if removing the sentinel resumes correctly from persisted state; FAIL if the loop restarts from iteration 1 or loses prior findings. | Privilege the loop protocol for resume flow and the state format reference for JSONL iteration counting; use YAML as enforcement confirmation. |
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:246:  status?: 'pending' | 'completed' | 'error' | 'snapshot' | 'unknown';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1682:    // Exclude snapshot tool calls from FILES — they inflate capturedFileCount
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1684:    if (tool.status === 'snapshot') {
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:14:This scenario validates malformed JSONL lines are skipped with defaults for `DRV-023`. The objective is to verify that when the review state log (`deep-review-state.jsonl`) contains malformed or unparseable lines, they are skipped gracefully and sensible defaults are applied so the loop can continue.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:28:- Orchestrator prompt: Validate the malformed JSONL handling contract for sk-deep-review. Confirm that when `review/deep-review-state.jsonl` contains unparseable lines, those lines are skipped without halting the loop, that sensible defaults (e.g., `newFindingsRatio = 1.0`) are used to prevent premature convergence, and that the skip is logged or visible in the state, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:47:| DRV-023 | Malformed JSONL lines are skipped with defaults | Verify malformed JSONL lines in review state are skipped gracefully with sensible defaults. | Validate the malformed JSONL handling contract for sk-deep-review. Confirm that unparseable lines in `review/deep-review-state.jsonl` are skipped without halting the loop, that sensible defaults (e.g., `newFindingsRatio = 1.0`) are used to prevent premature convergence, and that the skip is logged or visible, then return a concise operator-facing verdict. | 1. `bash: rg -n 'malformed|unparseable|skip.*line|parse.*error|JSON.*parse|graceful|default.*ratio|newFindingsRatio.*1\.0' .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'malformed|parse_error|skip_line|graceful|default|JSON.*parse|error_handling' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'malformed|corrupt|graceful|JSONL.*error|parse.*fail|default|error handling|fault tolerance' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md` | Malformed lines skipped, defaults applied (`newFindingsRatio = 1.0`), iteration count from valid lines, skip is observable. | Capture the JSONL parsing contract from state format, the error handling rules from YAML or loop protocol, and the default values applied on parse failure. | PASS if malformed lines are skipped with conservative defaults; FAIL if a bad line crashes the loop or causes false convergence. | Privilege the state format reference for JSONL schema rules and the convergence reference for default values on degraded input. |
.opencode/skill/sk-deep-review/references/quick_reference.md:75:| State | `review/deep-review-state.jsonl` | JSONL | Iteration log (append-only) |
.opencode/skill/sk-deep-review/references/quick_reference.md:76:| Registry | `review/deep-review-findings-registry.json` | JSON | Reducer-owned finding registry |
.opencode/skill/sk-deep-review/references/quick_reference.md:162:1. Read `deep-review-state.jsonl`, `deep-review-findings-registry.json`, and `deep-review-strategy.md`
.opencode/skill/sk-deep-review/references/quick_reference.md:168:7. Append iteration record to `deep-review-state.jsonl`
.opencode/skill/sk-deep-review/references/quick_reference.md:212:| Review-report missing sections | Verify synthesis phase completed (check state.jsonl for synthesis event) |
.opencode/skill/system-spec-kit/scripts/utils/tool-sanitizer.ts:18:type ToolStatus = 'pending' | 'completed' | 'error' | 'snapshot' | 'unknown';
.opencode/skill/system-spec-kit/scripts/utils/tool-sanitizer.ts:91:  'pending', 'completed', 'error', 'snapshot', 'unknown',
.opencode/skill/system-spec-kit/scripts/core/README.md:40:- `memory-metadata.ts` - memory classification, session dedup, causal links, and evidence snapshot assembly
.opencode/skill/sk-deep-review/references/convergence.md:23:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
.opencode/skill/sk-deep-review/references/convergence.md:411:When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class blocked-stop decision with `stopReason=blockedStop`, populate `legalStop.blockedBy` from the failing gates, copy the full `gateResults`, snapshot the replay inputs, and attach a `recoveryStrategy` describing the next review action before overriding the decision to CONTINUE.
.opencode/skill/sk-deep-review/references/convergence.md:587:  replayInputs: [snapshot of ratios, coverage, and gate inputs]
.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:30:  /^(?:modified during session|tracked file history snapshot)$/i,
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:18:The write-once iteration files serve as a redundant record of each review cycle. If `deep-review-state.jsonl` is lost or corrupted beyond what graceful degradation can handle, the iteration files provide the raw material to reconstruct the state log and resume the review without starting over.
.opencode/skill/sk-deep-research/SKILL.md:53:- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting
.opencode/skill/sk-deep-research/SKILL.md:170:    │  deep-research-state.jsonl      │
.opencode/skill/sk-deep-research/SKILL.md:172:    │  findings-registry.json          │
.opencode/skill/sk-deep-research/SKILL.md:188:Init --> Create config.json, strategy.md, state.jsonl
.opencode/skill/sk-deep-research/SKILL.md:199:  |                                         6. Append state.jsonl
.opencode/skill/sk-deep-research/SKILL.md:357:  Agent appends research/deep-research-state.jsonl
.opencode/skill/sk-deep-research/SKILL.md:358:  Workflow reducer updates research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
.opencode/skill/sk-deep-research/SKILL.md:412:| JSONL state | pi-autoresearch | deep-research-state.jsonl |
.opencode/skill/sk-deep-review/references/state_format.md:20:| `deep-review-state.jsonl` | JSON Lines | Append-only |
.opencode/skill/sk-deep-review/references/state_format.md:21:| `deep-review-findings-registry.json` | JSON | Auto-generated reducer state |
.opencode/skill/sk-deep-review/references/state_format.md:32:    deep-review-state.jsonl
.opencode/skill/sk-deep-review/references/state_format.md:33:    deep-review-findings-registry.json
.opencode/skill/sk-deep-review/references/state_format.md:80:    "deep-review-state.jsonl": "append-only",
.opencode/skill/sk-deep-review/references/state_format.md:81:    "deep-review-findings-registry.json": "auto-generated",
.opencode/skill/sk-deep-review/references/state_format.md:161:## 3. STATE LOG (deep-review-state.jsonl)
.opencode/skill/sk-deep-review/references/state_format.md:333:<!-- ANCHOR:findings-registry -->
.opencode/skill/sk-deep-review/references/state_format.md:334:## 5. FINDINGS REGISTRY (deep-review-findings-registry.json)
.opencode/skill/sk-deep-review/references/state_format.md:367:<!-- /ANCHOR:findings-registry -->
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:146:    '<!-- ANCHOR:project-state-snapshot -->',
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:241:    for (const record of (state.jsonlRecords || [])) {
.opencode/skill/sk-deep-review/references/loop_protocol.md:108:7. **Initialize state log**: First line of `{spec_folder}/review/deep-review-state.jsonl` with config record including `mode: "review"` and the lineage fields.
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:132:| State | `{spec_folder}/review/deep-review-state.jsonl` | Iteration log (1 initial line) |
.opencode/skill/sk-deep-review/references/loop_protocol.md:133:| Registry | `{spec_folder}/review/deep-review-findings-registry.json` | Reducer-owned findings state |
.opencode/skill/sk-deep-review/references/loop_protocol.md:146:- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
.opencode/skill/sk-deep-review/references/loop_protocol.md:147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
.opencode/skill/sk-deep-review/references/loop_protocol.md:238:  - State: {spec_folder}/review/deep-review-state.jsonl
.opencode/skill/sk-deep-review/references/loop_protocol.md:239:  - Registry: {spec_folder}/review/deep-review-findings-registry.json
.opencode/skill/sk-deep-review/references/loop_protocol.md:407:1. Read `deep-review-state.jsonl` and select review-mode iteration records in run order
.opencode/skill/sk-deep-review/references/loop_protocol.md:499:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
.opencode/skill/sk-deep-review/README.md:134:Each `@deep-review` agent dispatch gets a clean context window. No compaction or memory degradation across iterations. Knowledge transfers through the strategy file and JSONL state on disk.
.opencode/skill/sk-deep-review/README.md:196:├── deep-review-state.jsonl         # Append-only structured log of all iterations
.opencode/skill/sk-deep-review/README.md:197:├── deep-review-findings-registry.json  # Reducer-owned canonical findings state
.opencode/skill/sk-deep-review/README.md:202:├── review-report-v{generation}.md  # Immutable snapshot when completed-continue reopens a finished review
.opencode/skill/sk-deep-review/README.md:412:| State log         | `review/deep-review-state.jsonl`                                                                                                     |
.opencode/skill/sk-deep-review/README.md:413:| Findings registry | `review/deep-review-findings-registry.json`                                                                                          |
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:41:      expect(content, `${docPath} should mention the canonical state log`).toContain('deep-review-state.jsonl');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:42:      expect(content, `${docPath} should mention the findings registry`).toContain('deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:53:      expect(content, `${docPath} should read the canonical state log`).toContain('review/deep-review-state.jsonl');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:54:      expect(content, `${docPath} should mention the reducer-owned registry`).toContain('review/deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:62:        'review/deep-research-state.jsonl',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:76:      expect(content, `${docPath} should write the canonical state log`).toContain('review/deep-review-state.jsonl');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:77:      expect(content, `${docPath} should write the findings registry`).toContain('review/deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:84:        'scratch/deep-research-state.jsonl',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:93:        'review/deep-research-state.jsonl',
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:181: * - Uses edge createdAt timestamps instead of degree_snapshots table
.opencode/skill/sk-deep-research/README.md:41:The packet is also reducer-synchronized. The agent writes the iteration file plus the JSONL record. The workflow reducer then updates the machine-owned packet surfaces so `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, and synthesis metadata cannot drift apart.
.opencode/skill/sk-deep-research/README.md:60:- `deep-research-state.jsonl`
.opencode/skill/sk-deep-research/README.md:62:- `findings-registry.json`
.opencode/skill/sk-deep-research/README.md:113:  deep-research-state.jsonl
.opencode/skill/sk-deep-research/README.md:115:  findings-registry.json
.opencode/skill/sk-deep-research/README.md:129:- Reducer-owned writes: `deep-research-strategy.md` machine-owned sections, `findings-registry.json`, `deep-research-dashboard.md`.
.opencode/skill/sk-deep-research/README.md:130:- Workflow-owned output: `research.md` and lifecycle snapshot files such as `synthesis-v{generation}.md`.
.opencode/skill/sk-deep-research/README.md:143:| `completed-continue` | Reopen a completed lineage only after snapshotting the prior synthesis as immutable `synthesis-v{generation}.md`. |
.opencode/skill/sk-deep-research/README.md:172:| Packet resumes when you expected a new run | Inspect `config.lineage` and the latest lifecycle event in `deep-research-state.jsonl`. |
.opencode/skill/sk-deep-research/README.md:173:| Strategy/dashboard drift | Confirm the reducer ran and regenerated `findings-registry.json` and `deep-research-dashboard.md`. |
.opencode/skill/sk-deep-research/README.md:174:| JSONL parse failure | Run `cat research/deep-research-state.jsonl | jq .` and fall back to iteration-file reconstruction if needed. |
.opencode/skill/sk-deep-research/README.md:188:A: `restart` begins a new generation from an active or inactive packet and archives prior state. `completed-continue` reopens a completed lineage after snapshotting the old synthesis boundary.
.opencode/skill/sk-deep-research/references/quick_reference.md:76:| State | `research/deep-research-state.jsonl` | JSONL | Iteration log (append-only) |
.opencode/skill/sk-deep-research/references/quick_reference.md:78:| Registry | `research/findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings |
.opencode/skill/sk-deep-research/references/quick_reference.md:137:1. Read `deep-research-state.jsonl` and `deep-research-strategy.md`
.opencode/skill/sk-deep-research/references/quick_reference.md:141:5. Append iteration record to `deep-research-state.jsonl`
.opencode/skill/sk-deep-research/references/quick_reference.md:142:6. Let the workflow reducer update `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/quick_reference.md:169:| State file corrupt | Validate JSONL: `cat research/deep-research-state.jsonl \| jq .` |
.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:1027:      contextTemplate.includes('[PROJECT STATE SNAPSHOT](#project-state-snapshot)') &&
.opencode/skill/sk-deep-research/references/convergence.md:71:- `replayInputs` snapshots the exact stop-decision inputs so the reducer and dashboards can replay the outcome from packet-local artifacts only.
.opencode/skill/sk-deep-research/references/convergence.md:153:- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/convergence.md:307:1. Append a `stop_decision` snapshot with the attempted stop bundle.
.opencode/skill/sk-deep-research/references/convergence.md:572:When reading `deep-research-state.jsonl`, parse defensively:
.opencode/skill/sk-deep-research/references/convergence.md:1109:1. Read `deep-research-state.jsonl` and select review-mode iteration records in run order.
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:75:  db.pragma('journal_mode = WAL');
.opencode/skill/sk-deep-research/references/capability_matrix.md:25:2. Canonical packet paths under `{spec_folder}/research/`, especially `research/deep-research-state.jsonl` and `research/findings-registry.json`.
.opencode/skill/sk-deep-research/references/state_format.md:20:| `deep-research-state.jsonl` | JSON Lines | Structured iteration log | Append-only |
.opencode/skill/sk-deep-research/references/state_format.md:23:| `findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings | Auto-generated (read-only) |
.opencode/skill/sk-deep-research/references/state_format.md:94:    "deep-research-state.jsonl": "append-only",
.opencode/skill/sk-deep-research/references/state_format.md:116:## 3. STATE LOG (deep-research-state.jsonl)
.opencode/skill/sk-deep-research/references/state_format.md:241:| completed_continue | workflow | active | Reopen a completed lineage after immutable snapshotting | sessionId, parentSessionId, generation, continuedFromRun, completedAt, reopenedAt, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:314:When parsing `deep-research-state.jsonl`, apply defensive reading:
.opencode/skill/sk-deep-research/references/state_format.md:463:- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
.opencode/skill/sk-deep-research/references/state_format.md:495:1. Read `deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md` as canonical inputs
.opencode/skill/sk-deep-research/references/state_format.md:509:    "findings-registry.json": "auto-generated"
.opencode/skill/sk-deep-research/references/state_format.md:527:    deep-research-state.jsonl          # Structured iteration log
.opencode/skill/sk-deep-research/references/state_format.md:530:    findings-registry.json             # Reducer-owned question/finding registry
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:46:    expect(contract.contract.outputs.findingsRegistry.pathPattern).toContain('deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:48:    expect(contract.contract.outputs.jsonl.pathPattern).toContain('deep-review-state.jsonl');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:60:    expect(config.fileProtection['deep-review-findings-registry.json']).toBe('auto-generated');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:74:        '"{spec_folder}/review/deep-review-state.jsonl"',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:77:        '"{spec_folder}/review/deep-review-findings-registry.json"',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:80:        'write: "{spec_folder}/review/deep-review-findings-registry.json"',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:87:        'Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:97:    expect(stateFormat).toContain('deep-review-findings-registry.json');
.opencode/skill/sk-deep-research/references/loop_protocol.md:57:5. **Initialize state log**: First line of `research/deep-research-state.jsonl` with config record
.opencode/skill/sk-deep-research/references/loop_protocol.md:63:7. **Initialize findings registry**: `research/findings-registry.json` with empty `openQuestions`, `resolvedQuestions`, `keyFindings`, and `ruledOutDirections`
.opencode/skill/sk-deep-research/references/loop_protocol.md:74:- `research/deep-research-state.jsonl` (1 line)
.opencode/skill/sk-deep-research/references/loop_protocol.md:91:- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
.opencode/skill/sk-deep-research/references/loop_protocol.md:102:- Read `deep-research-state.jsonl` -- count iterations, get last newInfoRatio
.opencode/skill/sk-deep-research/references/loop_protocol.md:171:  - State: {spec_folder}/research/deep-research-state.jsonl
.opencode/skill/sk-deep-research/references/loop_protocol.md:195:4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/loop_protocol.md:228:   git add research/deep-research-state.jsonl
.opencode/skill/sk-deep-research/references/loop_protocol.md:230:   git add research/findings-registry.json
.opencode/skill/sk-deep-research/references/loop_protocol.md:238:Checkpoint commits provide rollback points: `git log -- research/` shows the last good state for the research packet. If state corruption occurs, `git checkout HEAD~1 -- research/deep-research-state.jsonl` restores the previous version.
.opencode/skill/sk-deep-research/references/loop_protocol.md:453:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
.opencode/skill/sk-deep-research/references/loop_protocol.md:600:- `{spec_folder}/review/deep-research-state.jsonl` (1 line)
.opencode/skill/sk-deep-research/references/loop_protocol.md:653:  - State: {spec_folder}/review/deep-research-state.jsonl
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:220:    expect(countOccurrences(targetedSurface, 'Keep canonical evidence snapshots')).toBe(1);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:480:  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:482:  const registryPath = path.join(researchDir, 'findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/tool-sanitizer.vitest.ts:98:    expect(normalizeToolStatus('snapshot')).toBe('snapshot');
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:6:// Reducer-owned board.json execution ledger, status transitions,
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:9:// board.json is the canonical execution ledger.
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:56: * @returns {object} Board object (serializable to board.json)
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:271: * Generate dashboard.md content from board.json.
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:284:  lines.push('> Auto-generated from board.json. Do not edit manually.');
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:136:        { path: 'scripts/utils/input-normalizer.ts', description: 'Tracked file history snapshot', specRelevant: true },
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:228: * Generate domain-ledger.json for research.
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:240: * @returns {object} Domain ledger artifact
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:421: * segment identities reproducible from the same ledger.
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:423: * @param {object} domainLedger - Domain ledger from generateDomainLedger
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1832:    const snapshotInput = {
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1841:    const snapshot = sessionExtractor.buildProjectStateSnapshot(snapshotInput);
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1842:    if (snapshot.projectPhase && snapshot.activeFile && snapshot.lastAction &&
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1843:        snapshot.nextAction && snapshot.blockers !== undefined && snapshot.fileProgress) {
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1844:      pass('T-027x: buildProjectStateSnapshot returns complete object', snapshot.projectPhase);
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:558:  it('prefers live observations over synthetic enrichment for project state snapshots', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:559:    const snapshot = buildProjectStateSnapshot({
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:584:    expect(snapshot.activeFile).toBe('scripts/core/workflow.ts');
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:585:    expect(snapshot.lastAction).toBe('Adjusted workflow alignment logic');
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:28:- Orchestrator prompt: Validate the fresh-initialization contract for sk-deep-research. Confirm that initialization creates deep-research-config.json, deep-research-state.jsonl, and deep-research-strategy.md from the live templates, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:47:| DR-004 | Fresh initialization creates canonical state files | Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets. | Validate the fresh-initialization contract for sk-deep-research. Confirm that initialization creates `deep-research-config.json`, `deep-research-state.jsonl`, and `deep-research-strategy.md` from the live templates, then return a concise user-facing pass/fail verdict. | 1. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'step_create_directories|step_create_config|step_create_state_log|step_create_strategy' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/assets/deep_research_config.json && sed -n '1,220p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record. | Capture the initialization outputs, the explicit create steps, and the live template files in one evidence bundle. | PASS if protocol, YAML, and asset templates agree on the initial scratch artifacts and their roles; FAIL if the artifact list or template sources drift. | Check both YAML variants, verify the JSONL init step writes a config record, and confirm the assets live under `assets/`. |
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts:177:  describe('project state snapshot integration', () => {
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts:178:    it('honors explicit projectPhase overrides when building the snapshot', () => {
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts:179:      const snapshot = buildProjectStateSnapshot({
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts:189:      expect(snapshot.projectPhase).toBe('IMPLEMENTATION');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:67:    path.join(specFolder, 'research', 'deep-research-state.jsonl'),
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:52:      expect(content, `${docPath} should mention the canonical state log`).toContain('deep-research-state.jsonl');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:53:      expect(content, `${docPath} should mention the findings registry`).toContain('findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:64:      expect(content, `${docPath} should read the canonical state log`).toContain('research/deep-research-state.jsonl');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:65:      expect(content, `${docPath} should read the findings registry`).toContain('research/findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:78:      expect(content, `${docPath} should write the findings registry`).toContain('findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:53:    '- Removed project-state-snapshot, decisions, conversation',
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:219:    it('allows memory without project-state-snapshot (no longer mandatory)', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:224:      expect(result.missingAnchors).not.toContain('project-state-snapshot');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:26:  segmentForResearch: (ledger: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:160:  describe('domain ledger (generateDomainLedger)', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:161:    it('returns empty ledger for null input', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:162:      const ledger = planner.generateDomainLedger(null as any);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:163:      expect(ledger.domains).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:164:      expect(ledger.version).toBe('v1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:173:      const ledger = planner.generateDomainLedger(sources);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:174:      expect(ledger.domains.length).toBe(3);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:175:      expect((ledger.domains[0] as any).domain).toBe('high.example.com');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:184:      const ledger = planner.generateDomainLedger(sources);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:185:      expect(ledger.clusters.length).toBe(2);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:190:      const ledger1 = planner.generateDomainLedger(sources);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:191:      const ledger2 = planner.generateDomainLedger(sources);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:192:      const domains1 = ledger1.domains.map((d: any) => d.domain);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:193:      const domains2 = ledger2.domains.map((d: any) => d.domain);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:231:    it('returns empty array for null ledger', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:236:      const ledger = planner.generateDomainLedger(makeDomains(60, { diverse: true }));
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:237:      const segments = planner.segmentForResearch(ledger, { segmentSize: 10 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:245:      const ledger = planner.generateDomainLedger(makeDomains(60, { diverse: true }));
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:246:      const seg1 = planner.segmentForResearch(ledger, { segmentSize: 10 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:247:      const seg2 = planner.segmentForResearch(ledger, { segmentSize: 10 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:218:      expect(state.jsonlRecords.length).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:219:      expect(state.jsonlRecords[0].sessionId).toBe('s1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:220:      expect(state.jsonlRecords[0].segment).toBe('seg-1');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:165:    const snapshotInput: Array<Record<string, unknown>> = [];
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:190:          snapshotInput.push(JSON.parse(JSON.stringify({
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:210:      expect(snapshotInput).toHaveLength(1);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:211:      expect(snapshotInput[0].headRef).toBe('HEAD');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:212:      expect(snapshotInput[0].commitRef).toBe('abc1234');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:213:      expect(snapshotInput[0].repositoryState).toBe('dirty');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:214:      expect(snapshotInput[0].isDetachedHead).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:215:      expect(snapshotInput[0].SUMMARY).toBe(normalized.SUMMARY);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:216:      expect(snapshotInput[0].observations).toEqual(normalized.observations);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:217:      expect(snapshotInput[0]._manualDecisions).toEqual((normalized as Record<string, unknown>)._manualDecisions);
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:310:    vi.doMock('../../mcp_server/lib/session/session-snapshot.js', () => ({
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:601:    const snapshot = buildProjectStateSnapshot({
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:610:    assertExists(snapshot.projectPhase, 'EXT-Session-054: Snapshot has projectPhase');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:611:    assertExists(snapshot.activeFile, 'EXT-Session-055: Snapshot has activeFile');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:612:    assertExists(snapshot.lastAction, 'EXT-Session-056: Snapshot has lastAction');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:613:    assertExists(snapshot.nextAction, 'EXT-Session-057: Snapshot has nextAction');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:614:    assertExists(snapshot.blockers, 'EXT-Session-058: Snapshot has blockers');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:615:    assertArray(snapshot.fileProgress, 'EXT-Session-059: Snapshot has fileProgress array');
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:28:- Orchestrator prompt: Validate the iteration write-back contract for sk-deep-research. Confirm that each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:47:| DR-008 | Iteration writes iteration-NNN.md, JSONL record, and reducer refresh | Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization. | Validate the iteration write-back contract for sk-deep-research. Confirm that each iteration writes `iteration-NNN.md`, appends a JSONL iteration record, and refreshes reducer-owned `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`, then return a concise operator-facing verdict. | 1. `bash: rg -n 'iteration-{NNN}|Verify JSONL was appended|reducer refreshed' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'iteration-NNN|deep-research-state.jsonl|findings-registry.json|Reducer Contract' .opencode/skill/sk-deep-research/references/state_format.md .codex/agents/deep-research.toml` -> 3. `bash: rg -n 'step_reduce_state|reduce-state.cjs|findings-registry.json|deep-research-dashboard.md' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects. | Capture the iteration artifact, the JSONL append, and the reducer-owned refresh surfaces. | PASS if all sources require the iteration file, JSONL append, and reducer refresh together; FAIL if any source treats one of them as optional. | Use the reducer script and runtime agent write contract as the lower-level source of truth when the overview docs are concise. |
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/checklist.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/checklist.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/plan.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/tasks.md:1:<!-- FIXTURE: Golden-file snapshot for create.sh --phase testing -->
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:21:      "title": "Keep canonical evidence snapshots",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:41:      "decision": "Keep canonical evidence snapshots",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-005a-anchor-scaffolding.json:26:    "project-state-snapshot",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-003-tree-thinning-files.json:14:      "FILE_PATH": "research/deep-research-state.jsonl",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-003-tree-thinning-files.json:20:      "DESCRIPTION": "Deep research config snapshot.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-003-tree-thinning-files.json:39:        "path": "research/deep-research-state.jsonl",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-003-tree-thinning-files.json:56:          "research/deep-research-state.jsonl",

exec
/bin/zsh -lc "find .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 -path '*scratch*' -type f | sort | head -n 60" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/.gitkeep
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/scratch/.gitkeep
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/scratch/codex-gpt54-deep-research.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/scratch/.gitkeep
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/scratch/codex-gpt54-deep-research.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/.gitkeep
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/.gitkeep
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md

exec
/bin/zsh -lc "python3 - <<'PY'
import json, pathlib
files = [
'.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl',
'.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl'
]
for fp in files:
    path = pathlib.Path(fp)
    rows=[]
    for line in path.read_text().splitlines():
        if line.strip():
            rows.append(json.loads(line))
    print('FILE', fp)
    print('count', len(rows))
    print('types', sorted({r.get('type','<none>') for r in rows}))
    print('profiles', sorted({r.get('profileId','<none>') for r in rows}))
    dims=[]
    for r in rows:
        for d in r.get('dimensions',[]) or []:
            dims.append((r.get('iteration') or r.get('type'), d['name'], d['score']))
    print('dimension_samples', dims[:10])
    print()
PY" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
FILE .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl
count 9
types ['baseline', 'benchmark_run', 'candidate', 'rejected']
profiles ['context-prime', 'handover']
dimension_samples []

FILE .opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl
count 3
types ['<none>']
profiles ['agent-improver']
dimension_samples [(1, 'structural', 100), (1, 'ruleCoherence', 100), (1, 'integration', 100), (1, 'outputQuality', 100), (1, 'systemFitness', 93), (2, 'structural', 100), (2, 'ruleCoherence', 100), (2, 'integration', 100), (2, 'outputQuality', 100), (2, 'systemFitness', 100)]


Research pass is complete. I read the Phase 005 packet, current sk-improve-agent surfaces, Phase 1-4 contract docs, live deep-research/deep-review runtime references, and historical 041 improvement artifacts to ground the recommendations.
  ✓ Read current sk-improve-agent runtime docs and scripts to extract implicit loop behavior
  ✓ Read 042 Phases 1-4 contracts and live deep-research/deep-review runtime surfaces
  ✓ Map findings into 10 iteration topics with concrete file-level recommendations
  ✓ Cross-check recommendations against current agent-improver constraints and existing code patterns
  ✓ Produce final priority-ordered synthesis with per-iteration outputs
codex
**Priority**

P0: formalize runtime truth before adding new intelligence. That means a typed stop contract, a real resume classifier, and separate journal vs mutation ledger in [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/SKILL.md), [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), [agent-improver.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/agent-improver.md), and [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md).

P1: make the loop explainable and replayable. Add mutation coverage, full dimension trajectories, trade-off detection, and integration-scan constraints via [reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs), [scan-integration.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs), and the new scripts Phase 005 already names.

P2: keep advanced exploration advisory and gated. Parallel candidates and weight optimization should stay off by default, reuse Phase 003/004 patterns, and never auto-promote.

**10 Iterations**

1. Stop-reason taxonomy. Current implicit stops are in [reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs), [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), and [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md): trailing ties, infra failures, weak benchmarks, drift ambiguity, plateau, max iterations, cancel, error. I would not use `promoted` or `rolledBack` as `stopReason`; split this into `stopReason = converged | maxIterationsReached | blockedStop | manualStop | error | stuckRecovery` and `sessionOutcome = keptBaseline | promoted | rolledBack | advisoryOnly`. Pattern: `const STOP_REASONS = Object.freeze({...})` plus `const SESSION_OUTCOMES = Object.freeze({...})`.

2. Legal-stop gates. Do not map one gate per score; map dimensions into gate bundles. Recommended promote gate: `contractGate` (`structural >= 90 && systemFitness >= 90`), `behaviorGate` (`ruleCoherence >= 85 && outputQuality >= 85`), `integrationGate` (`integration >= 90 && no drift ambiguity`), `evidenceGate` (`benchmark-pass && repeatability-pass`), and `improvementGate` (`weighted delta >= 2` from [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json)); any failed gate should persist `blockedStop`, not invent a new stop label.

3. Resume semantics. The lineage block already exists in [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), but the command still behaves like a fresh-start workflow in [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md). Port Phase 001’s classifier directly: `new | resume | restart | fork | completed-continue`, add `continuedFromRun` or `continuedFromIteration`, archive old runtime on restart, and replay journal + mutation ledger + coverage graph + registry before dispatch.

4. Audit journal. Today the improver mixes baseline, candidate, rejected, and benchmark records into one state log; that is too coarse for runtime truth. Add `improvement-journal.jsonl` for lifecycle and stop decisions, plus `mutation-ledger.jsonl` for proposal/evaluation outcomes in [scripts/](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts); journal events should include `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempted`, `promotion_result`, `rollback_result`, and `session_ended`.

5. Mutation coverage graph. Reuse the Phase 002 namespace model from [042.002 spec](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md): `spec_folder + loop_type + session_id`. For improver, use nodes like `TARGET`, `CANDIDATE`, `MUTATION`, `DIMENSION`, `INTEGRATION_SURFACE`, `BENCHMARK_FIXTURE`, `FAILURE_MODE`, and `HYPOTHESIS`, with edges like `MUTATES`, `TOUCHES`, `IMPROVES`, `REGRESSES`, `VALIDATES`, `BLOCKED_BY`, `DERIVED_FROM`, and `EXHAUSTS`; this graph is about mutation-space coverage, not research/review epistemic coverage.

6. Dimension trajectory. Current reducer only renders latest/best/trend arrows in [reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs). Add full per-iteration vectors, weighted score, benchmark aggregate, and gate outcomes to a trajectory artifact, and define “stable” as at least 3 scored evidence iterations with all dimension deltas within `±2`, repeatability variance within tolerance, and no unexplored high-value mutation family remaining.

7. Trade-off detection. Weighted totals are not enough; agent-improver needs Pareto awareness. Add `trade-off-detector.cjs` that compares candidate vectors and emits `tradeoff_detected` when an improvement of `> +3` in one dimension causes a regression of `< -3` in hard dimensions (`structural`, `integration`, `systemFitness`) or `< -5` in soft ones, and block promotion for dominated candidates even if the weighted sum went up.

8. Parallel candidates. Keep the agent LEAF-only and put branching in orchestration, following the Phase 003 pattern from [042.003 spec](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md). Recommended activation gate: only enable 2-3 candidates when there are 3+ unresolved mutation families, 2 consecutive tie/plateau iterations, and a wide integration surface from [scan-integration.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs); persist a reducer-owned `candidate-board.json`, not ad hoc branch notes.

9. Integration surface constraints. The scan already finds canonical, mirrors, commands, YAML, skills, global docs, and skill-advisor references in [scan-integration.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs). Use that output as a mutation allowlist and risk map: pin an `integrationReportHash` into score/benchmark/journal events, require rescan before scoring if the candidate changes routing or command-facing instructions, and treat missing coverage as a promotion block rather than benchmark truth.

10. Scoring weight optimization. Real historical data exists in `041` improvement artifacts like [002 state log](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl), [009 state log](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl), and the corresponding registries and benchmark runs, but it is sparse and inconsistent today. Follow Phase 004’s advisory-only optimizer model from [042.004 spec](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md): keep `dimensionWeights` tunable, keep stop contract fields locked, build a replayable corpus first, and refuse auto-apply until there are at least 2 compatible target families and a materially larger run history.

Read-only conclusion: the best upgrade is not “add five new scripts” in isolation, but “turn improver into a typed deep-loop product.” The cleanest implementation order is `stop contract -> resume/journal split -> coverage/trajectory/trade-off -> integration-hash gating -> optional parallel board -> advisory optimizer`. No files were changed, and I did not run the loop or tests in this pass.


hook: Stop
hook: Stop Completed
tokens used
167,721
**Priority**

P0: formalize runtime truth before adding new intelligence. That means a typed stop contract, a real resume classifier, and separate journal vs mutation ledger in [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/SKILL.md), [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), [agent-improver.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/agent-improver.md), and [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md).

P1: make the loop explainable and replayable. Add mutation coverage, full dimension trajectories, trade-off detection, and integration-scan constraints via [reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs), [scan-integration.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs), and the new scripts Phase 005 already names.

P2: keep advanced exploration advisory and gated. Parallel candidates and weight optimization should stay off by default, reuse Phase 003/004 patterns, and never auto-promote.

**10 Iterations**

1. Stop-reason taxonomy. Current implicit stops are in [reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs), [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), and [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md): trailing ties, infra failures, weak benchmarks, drift ambiguity, plateau, max iterations, cancel, error. I would not use `promoted` or `rolledBack` as `stopReason`; split this into `stopReason = converged | maxIterationsReached | blockedStop | manualStop | error | stuckRecovery` and `sessionOutcome = keptBaseline | promoted | rolledBack | advisoryOnly`. Pattern: `const STOP_REASONS = Object.freeze({...})` plus `const SESSION_OUTCOMES = Object.freeze({...})`.

2. Legal-stop gates. Do not map one gate per score; map dimensions into gate bundles. Recommended promote gate: `contractGate` (`structural >= 90 && systemFitness >= 90`), `behaviorGate` (`ruleCoherence >= 85 && outputQuality >= 85`), `integrationGate` (`integration >= 90 && no drift ambiguity`), `evidenceGate` (`benchmark-pass && repeatability-pass`), and `improvementGate` (`weighted delta >= 2` from [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json)); any failed gate should persist `blockedStop`, not invent a new stop label.

3. Resume semantics. The lineage block already exists in [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), but the command still behaves like a fresh-start workflow in [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md). Port Phase 001’s classifier directly: `new | resume | restart | fork | completed-continue`, add `continuedFromRun` or `continuedFromIteration`, archive old runtime on restart, and replay journal + mutation ledger + coverage graph + registry before dispatch.

4. Audit journal. Today the improver mixes baseline, candidate, rejected, and benchmark records into one state log; that is too coarse for runtime truth. Add `improvement-journal.jsonl` for lifecycle and stop decisions, plus `mutation-ledger.jsonl` for proposal/evaluation outcomes in [scripts/](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts); journal events should include `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempted`, `promotion_result`, `rollback_result`, and `session_ended`.

5. Mutation coverage graph. Reuse the Phase 002 namespace model from [042.002 spec](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md): `spec_folder + loop_type + session_id`. For improver, use nodes like `TARGET`, `CANDIDATE`, `MUTATION`, `DIMENSION`, `INTEGRATION_SURFACE`, `BENCHMARK_FIXTURE`, `FAILURE_MODE`, and `HYPOTHESIS`, with edges like `MUTATES`, `TOUCHES`, `IMPROVES`, `REGRESSES`, `VALIDATES`, `BLOCKED_BY`, `DERIVED_FROM`, and `EXHAUSTS`; this graph is about mutation-space coverage, not research/review epistemic coverage.

6. Dimension trajectory. Current reducer only renders latest/best/trend arrows in [reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs). Add full per-iteration vectors, weighted score, benchmark aggregate, and gate outcomes to a trajectory artifact, and define “stable” as at least 3 scored evidence iterations with all dimension deltas within `±2`, repeatability variance within tolerance, and no unexplored high-value mutation family remaining.

7. Trade-off detection. Weighted totals are not enough; agent-improver needs Pareto awareness. Add `trade-off-detector.cjs` that compares candidate vectors and emits `tradeoff_detected` when an improvement of `> +3` in one dimension causes a regression of `< -3` in hard dimensions (`structural`, `integration`, `systemFitness`) or `< -5` in soft ones, and block promotion for dominated candidates even if the weighted sum went up.

8. Parallel candidates. Keep the agent LEAF-only and put branching in orchestration, following the Phase 003 pattern from [042.003 spec](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md). Recommended activation gate: only enable 2-3 candidates when there are 3+ unresolved mutation families, 2 consecutive tie/plateau iterations, and a wide integration surface from [scan-integration.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs); persist a reducer-owned `candidate-board.json`, not ad hoc branch notes.

9. Integration surface constraints. The scan already finds canonical, mirrors, commands, YAML, skills, global docs, and skill-advisor references in [scan-integration.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs). Use that output as a mutation allowlist and risk map: pin an `integrationReportHash` into score/benchmark/journal events, require rescan before scoring if the candidate changes routing or command-facing instructions, and treat missing coverage as a promotion block rather than benchmark truth.

10. Scoring weight optimization. Real historical data exists in `041` improvement artifacts like [002 state log](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl), [009 state log](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-improve-agent-self-test/improvement/agent-improvement-state.jsonl), and the corresponding registries and benchmark runs, but it is sparse and inconsistent today. Follow Phase 004’s advisory-only optimizer model from [042.004 spec](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md): keep `dimensionWeights` tunable, keep stop contract fields locked, build a replayable corpus first, and refuse auto-apply until there are at least 2 compatible target families and a materially larger run history.

Read-only conclusion: the best upgrade is not “add five new scripts” in isolation, but “turn improver into a typed deep-loop product.” The cleanest implementation order is `stop contract -> resume/journal split -> coverage/trajectory/trade-off -> integration-hash gating -> optional parallel board -> advisory optimizer`. No files were changed, and I did not run the loop or tests in this pass.


