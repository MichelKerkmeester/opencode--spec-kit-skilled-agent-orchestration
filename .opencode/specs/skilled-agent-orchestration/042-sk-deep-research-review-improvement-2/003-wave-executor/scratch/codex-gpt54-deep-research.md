Reading additional input from stdin...
OpenAI Codex v0.118.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d7748-7b0e-7312-8214-ecb545362f71
--------
user
You are a deep research agent. Run 10 research iterations on Phase 3 (Wave Executor) of packet 042.

Read the spec folder at .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/ — read spec.md, plan.md, tasks.md.

Then read the ACTUAL implementation to ground your research:
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml (how the orchestrator dispatches today)
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
- .opencode/skill/sk-deep-research/SKILL.md (LEAF constraint, experimental wave references)
- .opencode/skill/sk-deep-research/references/loop_protocol.md (segment/wave references)
- .opencode/skill/sk-deep-research/references/convergence.md (stuck recovery)
- .opencode/skill/sk-deep-review/references/loop_protocol.md
- .opencode/agent/deep-research.md
- .opencode/agent/deep-review.md

Also search for any existing wave/segment/parallel patterns in the codebase with targeted searches.

## RESEARCH QUESTIONS (10 iterations)

1. LEAF constraint compatibility: The agents cannot spawn sub-agents. How exactly does the orchestrator dispatch parallel iterations while keeping agents LEAF? What does the YAML workflow engine support?
2. Segment planning: For review, how should files be grouped into segments? By directory? By hotspot score? By dependency cluster? What data is available at init time?
3. Domain clustering for research: How should 50+ source domains be clustered? By topic? By authority level? By source type? What clustering algorithm fits packet-local constraints?
4. Wave lifecycle: What happens when one segment converges but others are still running? How does the coordination board track per-segment state without becoming the thing it coordinates?
5. Merge semantics: When segments complete, how do their findings merge? What about conflicting findings across segments? How does the JSONL lineage work with parallel segments?
6. Convergence per segment: Each segment needs its own convergence assessment. Should each segment have its own coverage graph instance? Or one graph with segment-scoped queries?
7. Coordination board design: The spec says packet-local structured artifact. What fields? What format? How does it differ from the strategy file?
8. Cost/benefit: How many iterations does wave execution save vs sequential? Under what conditions is the overhead of coordination worse than just running more sequential iterations?
9. Hotspot detection: For review, how do you identify hotspots before reviewing them? Git blame frequency? File size? Import count? What's available without expensive analysis?
10. Existing patterns: Search the broader AI agent ecosystem — how do LangGraph, CrewAI, AutoGen handle parallel task execution with shared state? What patterns translate to the LEAF model? Use --search for web research.

## OUTPUT FORMAT
For each iteration: title, focus, 3-5 key findings with file:line evidence, novel insight, open questions.
After all 10: synthesis with top recommendations, feasibility assessment, suggested spec changes.

Spec folder: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor (pre-approved, skip Gate 3)
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a packet-local deep research pass for Phase 3 of packet `042`, with the spec folder already approved. First I’m going to do the required routing and context checks, then I’ll read the phase docs and current implementation before running the 10 research iterations.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep research on Phase 3 Wave Executor of packet 042; read packet docs, implementation, search codebase for wave/segment/parallel patterns, and do web research on LangGraph CrewAI AutoGen shared-state parallel execution" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
 succeeded in 3008ms:
2026-04-10 14:05:52.909 xcodebuild[44226:32040823]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 14:05:53.143 xcodebuild[44226:32040822] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-8PGztxQQ' (errno=Operation not permitted)
2026-04-10 14:05:53.662 xcodebuild[44244:32040860]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 14:05:53.808 xcodebuild[44244:32040859] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "mcp-coco-index",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !implementation, !intent:semantic-code-search, !search codebase(phrase), code, codebase~"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep research(phrase), deep(name), research(name), search~, state"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: code(name), codebase~, implementation, phase~, project"
  },
  {
    "skill": "cli-codex",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: code, codebase, parallel, research, search~"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.94,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: code, codebase~, deep(name), find~, state"
  },
  {
    "skill": "cli-gemini",
    "kind": "skill",
    "confidence": 0.86,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: code, codebase, parallel, research, search"
  }
]

codex
The trigger-memory call didn’t come back cleanly, so I’m falling back to a lightweight local memory pass and finishing skill routing before I dig into the packet. After that I’ll read the phase docs and the live orchestrator files, then branch into codebase and web evidence.
exec
/bin/zsh -lc 'rg -n "042|wave executor|deep research review improvement|wave|segment|parallel" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
275:- Task sheet drift note: `003/.../006-memory-duplication-reduction/tasks.md` still reflects the older research wave; treat PR-12 implementation as primary and PR-13 migration as optional only if wrapper rollout is evidence-justified [Task 2]
486:## Task 5: Stage, commit, and push rename/cleanup waves directly to `main` with explicit branch-rule warning reporting, outcome success
510:- for large rename waves, verify staged rename mapping with `git diff --cached --name-status -M` before commit/push [Task 5]
641:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
645:- rollout_summaries/2026-04-03T06-52-50-dog7-deep_research_90_iter_external_wave.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T08-52-50-019d521d-afbc-7da0-817d-675090a19d1f.jsonl, updated_at=2026-04-03T08:23:39+00:00, thread_id=019d521d-afbc-7da0-817d-675090a19d1f)
649:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
679:- wave labeling that proved useful: 061-070 (Auto-Deep-Research-main portability/handoff), 071-080 (AutoAgent-main capability gating/workflow generation), 081-090 (autoresearch-master small mutable surface discipline) [Task 1]
686:- symptom: recommendation docs drift from requested basis; cause: docs written from partial wave context; fix: verify ledger count/`synthesis_complete` and explicitly tie recommendations to the full 90-iteration synthesis [Task 1]
777:- when user asked to “use max sub agents” for packet changelog synthesis, parallelize phase evidence gathering but keep output scoped to the requested packet `scratch/` folder [Task 6]
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
1837:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for similar "apply all fixes" audit waves in this repo, but keep edits scoped to the targeted phase folders
1839:## Task 1: Run governance/lifecycle audit orchestration with single-hop Codex+GPT review wave
1911:- when user requests delegated review wave with explicit depth constraints, keep single-hop orchestration (`Depth: 1 LEAF`, no nested sub-agents) [Task 1]
1932:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for audit/review waves in this checkout family, especially when user asks for “bug free + sk-code/sk-doc + playbook coverage”

codex
I’m using `sk-deep-research` here because the request is explicitly for a deep research run, and I’m grounding it against the phase packet plus the current orchestration assets before I answer the 10 questions. I’ve also found prior memory about external research waves and the “single-hop / LEAF” constraint, which I’ll use as background but I’ll verify against the live files.
Deep research pass for packet 042 / Phase 3 wave executor. I’ll gather packet + implementation context first, then targeted codebase patterns, then web patterns, and finally synthesize the 10-iteration output.
  → Read relevant memory snippets and deep-research skill instructions
  • Read phase 003 spec.md, plan.md, and tasks.md plus listed implementation files
  • Search codebase for wave, segment, and parallel execution patterns
  • Research external primary sources for LangGraph, CrewAI, and AutoGen parallel/shared-state patterns
  • Synthesize 10 iterations with evidence-backed recommendations and feasibility assessment
exec
/bin/zsh -lc "sed -n '635,652p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1907,1915p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- symptom: strict-link validation reports external wiki issues during packet checks; cause: unrelated global `mcp-figma` wikilink debt; fix: mark as out-of-scope noise unless packet directly touches those resources [Task 1]

# Task Group: Agent-Orchestration Packet 028 Deep-Research/Deep-Review Contract Hardening
scope: 90-iteration synthesis docs and phase-level contract hardening for `028-auto-deep-research-review-improvement` packets
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research-review-improvement; reuse_rule=reuse for packet 028 research/review closeout in this checkout, with packet-local docs/changelogs and strict validation evidence

## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T06-52-50-dog7-deep_research_90_iter_external_wave.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T08-52-50-019d521d-afbc-7da0-817d-675090a19d1f.jsonl, updated_at=2026-04-03T08:23:39+00:00, thread_id=019d521d-afbc-7da0-817d-675090a19d1f)

### keywords

- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave

## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success


 succeeded in 0ms:

- when user asks “Review all work done ... bug free ... aligned with sk-code--opencode ... manual_testing_playbook ... feature_catalog,” treat it as full code+tests+docs+playbook/catalog audit, not a narrow fix [Task 1][Task 3][Task 6]
- when user says “Apply all fixes” or “apply fixes to all findings,” execute end-to-end remediation (runtime, tests, docs, spec evidence) before closeout [Task 2][Task 3][Task 5]
- when user confirms an existing spec path (“yes use that one”), keep remediation in that same spec folder instead of creating a new packet [Task 1][Task 5]
- when user requests delegated review wave with explicit depth constraints, keep single-hop orchestration (`Depth: 1 LEAF`, no nested sub-agents) [Task 1]
- when verification gaps are called out and user says “please do,” run full-suite `npx vitest run` evidence rather than only targeted suites [Task 4]

## Reusable knowledge


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
/bin/zsh -lc 'rg -n "wave|segment|parallel|LEAF|experimental" .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/agent/deep-research.md .opencode/agent/deep-review.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/agent/deep-review.md:3:description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."
.opencode/agent/deep-review.md:37:This agent is LEAF-only. Nested sub-agent dispatch is illegal.
.opencode/agent/deep-review.md:253:> **Note:** The orchestrator enriches each iteration record with optional `segment` (default: 1) and `convergenceSignals` fields after the agent writes it. The agent does not write these fields.
.opencode/agent/deep-review.md:443:1. Dispatch sub-agents or use Task tool (LEAF-only)
.opencode/agent/deep-review.md:490:[x] No sub-agents dispatched (LEAF compliance)
.opencode/agent/deep-review.md:595:│  ├── LEAF-only (no sub-agents)           │
.opencode/skill/sk-deep-research/SKILL.md:5:# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
.opencode/skill/sk-deep-research/SKILL.md:159:    │    @deep-research (LEAF agent)  │  Layer 3: Agent
.opencode/skill/sk-deep-research/SKILL.md:248:1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
.opencode/skill/sk-deep-research/SKILL.md:266:1. **Wave orchestration** -- parallel question fan-out, pruning, and breakthrough logic
.opencode/skill/sk-deep-research/SKILL.md:268:3. **Wave orchestration on the same lineage** -- parallel fan-out remains reference-only
.opencode/skill/sk-deep-research/SKILL.md:346:- **Orchestrator**: @orchestrate dispatches @deep-research as LEAF agent
.opencode/skill/sk-deep-research/SKILL.md:420:| `@deep-research` | Single iteration executor (LEAF) |
.opencode/skill/sk-deep-review/references/loop_protocol.md:15:The deep review loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the `@deep-review` agent (LEAF-only, no WebFetch) executes individual review iterations with fresh context each time.
.opencode/skill/sk-deep-review/references/loop_protocol.md:47:| Agent | `@deep-review` (LEAF) | Single iteration executor; no sub-agents, no WebFetch |
.opencode/skill/sk-deep-review/references/loop_protocol.md:242:CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
.opencode/skill/sk-deep-review/references/loop_protocol.md:247:- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
.opencode/skill/sk-deep-review/references/loop_protocol.md:759:| `@deep-review` | `{runtime_dir}/deep-review.{ext}` | LEAF-only, no sub-agents, no WebFetch, target files read-only |
.opencode/agent/deep-research.md:38:This agent is LEAF-only. Nested sub-agent dispatch is illegal.
.opencode/agent/deep-research.md:189:> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
.opencode/agent/deep-research.md:327:- Dispatch sub-agents or use Task tool (LEAF-only)
.opencode/agent/deep-research.md:394:[x] No sub-agents dispatched (LEAF compliance)
.opencode/agent/deep-research.md:468:│  |-- LEAF-only: no sub-agent dispatch                                   │
.opencode/skill/sk-deep-research/references/convergence.md:23:> **Segment Awareness (REFERENCE-ONLY)**: When segments are explicitly enabled, `state.iterations` may be pre-filtered to the current segment. The live workflow uses a single segment by default.
.opencode/skill/sk-deep-research/references/convergence.md:29:  iterations = state.iterations  // single live segment; optional segment filtering is reference-only
.opencode/skill/sk-deep-research/references/convergence.md:311:| segment (on iteration records) | number | 1 | Segment this iteration belongs to |
.opencode/skill/sk-deep-research/references/convergence.md:312:| segment_start (event type) | event | -- | Marks the start of a new segment |
.opencode/skill/sk-deep-research/references/convergence.md:315:- Filter iterations by `segment === currentSegment`
.opencode/skill/sk-deep-research/references/convergence.md:316:- Hard stops (max iterations) count ALL iterations regardless of segment
.opencode/skill/sk-deep-research/references/convergence.md:317:- Cross-segment analysis: read full JSONL without segment filtering
.opencode/skill/sk-deep-research/references/convergence.md:607:Total iterations: N (segment: S)
.opencode/skill/sk-deep-research/references/loop_protocol.md:3:description: Canonical specification for the deep research loop lifecycle with 4 phases, reference-only wave orchestration, and error handling.
.opencode/skill/sk-deep-research/references/loop_protocol.md:91:- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
.opencode/skill/sk-deep-research/references/loop_protocol.md:150:Segment: {current_segment} | Iteration: {N} of {max}
.opencode/skill/sk-deep-research/references/loop_protocol.md:174:CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
.opencode/skill/sk-deep-research/references/loop_protocol.md:315:<!-- ANCHOR:wave-orchestration-protocol -->
.opencode/skill/sk-deep-research/references/loop_protocol.md:318:An optional parallel execution mode for research topics with multiple independent questions. Treat this as reference guidance unless the runtime explicitly supports it; the live workflow remains sequential.
.opencode/skill/sk-deep-research/references/loop_protocol.md:335:Scoring: Rank by newInfoRatio, prune below median when wave support is enabled
.opencode/skill/sk-deep-research/references/loop_protocol.md:346:After each wave completes:
.opencode/skill/sk-deep-research/references/loop_protocol.md:347:1. Rank all wave iterations by `newInfoRatio`
.opencode/skill/sk-deep-research/references/loop_protocol.md:348:2. Compute wave median: `median([i.newInfoRatio for i in wave_iterations])`
.opencode/skill/sk-deep-research/references/loop_protocol.md:349:3. **Prune**: Questions with newInfoRatio below median are deprioritized when wave support is enabled
.opencode/skill/sk-deep-research/references/loop_protocol.md:355:When any single iteration in a wave achieves `newInfoRatio > 2x wave_average`:
.opencode/skill/sk-deep-research/references/loop_protocol.md:359:3. Prioritize these adjacent questions in the next wave
.opencode/skill/sk-deep-research/references/loop_protocol.md:366:{"type":"iteration","run":N,"wave":1,"status":"complete",...}
.opencode/skill/sk-deep-research/references/loop_protocol.md:371:{"type":"event","event":"wave_complete","wave":1,"iterations":[1,2,3],"medianRatio":0.5}
.opencode/skill/sk-deep-research/references/loop_protocol.md:372:{"type":"event","event":"breakthrough","wave":1,"iteration":2,"ratio":0.95}
.opencode/skill/sk-deep-research/references/loop_protocol.md:380:- Sequential mode can spawn a wave when new independent questions emerge
.opencode/skill/sk-deep-research/references/loop_protocol.md:384:<!-- /ANCHOR:wave-orchestration-protocol -->
.opencode/skill/sk-deep-research/references/loop_protocol.md:656:CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents

exec
/bin/zsh -lc 'ls -la .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
total 96
drwxr-xr-x  10 michelkerkmeester  staff    320 Apr 10 14:04 .
drwxr-xr-x  16 michelkerkmeester  staff    512 Apr 10 14:02 ..
-rw-r--r--   1 michelkerkmeester  staff   2235 Apr 10 13:11 README.md
-rw-r--r--   1 michelkerkmeester  staff    504 Apr 10 14:04 description.json
-rw-r--r--@  1 michelkerkmeester  staff   3559 Apr 10 13:11 implementation-summary.md
drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 13:11 memory
-rw-r--r--@  1 michelkerkmeester  staff   8151 Apr 10 13:25 plan.md
drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 13:11 scratch
-rw-r--r--@  1 michelkerkmeester  staff  18116 Apr 10 13:25 spec.md
-rw-r--r--@  1 michelkerkmeester  staff   7555 Apr 10 13:20 tasks.md

codex
I’ve confirmed the phase folder and I’m now reading the packet docs alongside the live deep-research/deep-review orchestration materials. After that I’m going to do focused searches for wave, segment, reducer, registry, and parallel-dispatch patterns so the recommendations stay grounded in what the repo can actually support.
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Implementation Plan: Wave Executor [042.003]"
     3	description: "Deliver orchestrator-managed wave execution for deep research and deep review by adding segment planning, coordination-board tracking, and deterministic merge behavior on top of the Phase 002 graph substrate."
     4	trigger_phrases:
     5	  - "042.003"
     6	  - "implementation plan"
     7	  - "wave executor"
     8	  - "segment planner"
     9	  - "coordination board"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Implementation Plan: Wave Executor
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:summary -->
    21	## 1. SUMMARY
    22	
    23	### Technical Context
    24	
    25	| Aspect | Value |
    26	|--------|-------|
    27	| **Language/Stack** | YAML workflows, CommonJS orchestration helpers, Markdown runtime contracts, JSONL artifacts |
    28	| **Framework** | Spec Kit deep-loop orchestrator over LEAF research and review workers |
    29	| **Storage** | Packet-local segment JSONL, coordination board artifacts, and merged lineage outputs plus Phase 002 graph state |
    30	| **Testing** | Vitest lifecycle and merge suites plus strict packet validation |
    31	
    32	### Overview
    33	
    34	This phase scales deep research and deep review by adding orchestrator-managed wave execution rather than agent-managed spawning. The delivery order is intentional: define deterministic segmentation and state contracts first, then add lifecycle and board orchestration, then prove merge and resume behavior before exposing the mode broadly.
    35	<!-- /ANCHOR:summary -->
    36	
    37	---
    38	
    39	<!-- ANCHOR:quality-gates -->
    40	## 2. QUALITY GATES
    41	
    42	### Definition of Ready
    43	
    44	- [x] Phase 002 graph convergence is identified as the convergence authority for segments.
    45	- [x] The LEAF-worker rule is fixed and non-negotiable.
    46	- [x] Large-target triggers are defined for review and research.
    47	- [x] Segment, board, and merge artifacts are clearly packet-local.
    48	
    49	### Definition of Done
    50	
    51	- [ ] Deterministic segment planning exists for both review files and research domains.
    52	- [ ] Wave lifecycle ownership is explicit at the orchestrator or workflow layer.
    53	- [ ] Coordination-board state and segment JSONL contracts are documented and task-linked.
    54	- [ ] Merge behavior preserves provenance and conflict metadata.
    55	- [ ] Wave mode remains bounded to large targets and does not replace the default path.
    56	- [ ] Tests prove planner determinism, lifecycle correctness, merge idempotence, and resume behavior.
    57	<!-- /ANCHOR:quality-gates -->
    58	
    59	---
    60	
    61	<!-- ANCHOR:architecture -->
    62	## 3. ARCHITECTURE
    63	
    64	### Pattern
    65	
    66	Segmented fan-out orchestration with packet-local state and deterministic merge.
    67	
    68	### Key Components
    69	
    70	- **Wave segment planner**: produces stable review-file or research-domain segments.
    71	- **Wave lifecycle manager**: owns fan-out, prune, promote, merge, and resume transitions.
    72	- **Wave convergence layer**: wraps Phase 002 graph signals for per-segment decisions.
    73	- **Coordination board**: tracks segment state, dedupe, conflicts, and promoted findings.
    74	- **Segment state and merge layer**: keeps segment JSONL replayable and mergeable into the main lineage.
    75	
    76	### Data Flow
    77	
    78	```text
    79	Inventory target
    80	  -> plan deterministic segments
    81	  -> dispatch N parallel LEAF iterations
    82	  -> evaluate each segment with graph-backed convergence
    83	  -> prune converged or stuck segments
    84	  -> promote important findings to coordination board
    85	  -> merge segment lineage back into main packet state
    86	```
    87	<!-- /ANCHOR:architecture -->
    88	
    89	---
    90	
    91	<!-- ANCHOR:phases -->
    92	## 4. IMPLEMENTATION PHASES
    93	
    94	### Phase 1: Segment Planning and State Contracts
    95	
    96	**Scope**: REQ-001, REQ-003, REQ-004
    97	
    98	**Why first**: Parallelism is unsafe until segment boundaries, board state, and merge provenance are explicit and deterministic.
    99	
   100	**Files to change**:
   101	- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`
   102	- `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`
   103	- `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
   104	- `.opencode/skill/sk-deep-research/references/state_format.md`
   105	- `.opencode/skill/sk-deep-review/references/state_format.md`
   106	- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
   107	- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
   108	
   109	**Verification strategy**:
   110	- Prove planner determinism from the same inventory input.
   111	- Prove segment IDs and board row IDs remain stable across replay.
   112	
   113	### Phase 2: Wave Lifecycle Integration
   114	
   115	**Scope**: REQ-002, REQ-005, REQ-006
   116	
   117	**Why second**: Once state contracts are safe, the orchestrator can add fan-out, prune, promote, and merge behavior without asking the LEAF agents to become orchestration engines.
   118	
   119	**Files to change**:
   120	- `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`
   121	- `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`
   122	- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
   123	- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
   124	- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
   125	- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
   126	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   127	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   128	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   129	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   130	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   131	- `.opencode/command/spec_kit/deep-research.md`
   132	- `.opencode/command/spec_kit/deep-review.md`
   133	
   134	**Verification strategy**:
   135	- Prove wave mode only activates for large-target cases.
   136	- Prove prune and promote decisions reference Phase 002 graph signals rather than ad hoc heuristics.
   137	
   138	### Phase 3: Merge Proof and Recovery Hardening
   139	
   140	**Scope**: REQ-004, REQ-007
   141	
   142	**Why third**: Merge correctness and resume behavior are the operational guardrails that make wave mode safe to trust.
   143	
   144	**Files to change**:
   145	- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`
   146	- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts`
   147	- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`
   148	- `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`
   149	
   150	**Verification strategy**:
   151	- Prove segment-local lineage survives interruption and resume.
   152	- Prove merge stays idempotent and preserves conflict or dedupe metadata across repeated runs.
   153	<!-- /ANCHOR:phases -->
   154	
   155	---
   156	
   157	<!-- ANCHOR:testing -->
   158	## 5. TESTING STRATEGY
   159	
   160	| Test Type | Scope | Tools |
   161	|-----------|-------|-------|
   162	| Unit | Segment planner, board helpers, convergence wrappers | Vitest |
   163	| Integration | YAML lifecycle sequencing and command-mode activation | Vitest |
   164	| State/Replay | Segment JSONL isolation, merge idempotence, resume | Vitest |
   165	| Validation | Packet document structure and template compliance | `spec/validate.sh --strict` |
   166	<!-- /ANCHOR:testing -->
   167	
   168	---
   169	
   170	<!-- ANCHOR:dependencies -->
   171	## 6. DEPENDENCIES
   172	
   173	| Dependency | Type | Status | Impact if Blocked |
   174	|------------|------|--------|-------------------|
   175	| Phase 002 graph tools and convergence surfaces | Internal | Yellow | Wave pruning and promotion would lose their evidence-backed decision source. |
   176	| Phase 001 resume and journal model | Internal | Green | Segment-level recovery would become inconsistent with existing runtime truth. |
   177	| Deep research and review command workflows | Internal | Green | Wave mode would have no execution path. |
   178	| Packet-local artifact discipline | Internal | Green | Segment and board outputs would become hard to replay or merge safely. |
   179	<!-- /ANCHOR:dependencies -->
   180	
   181	---
   182	
   183	<!-- ANCHOR:rollback -->
   184	## 7. ROLLBACK PLAN
   185	
   186	- **Trigger**: Wave execution produces unstable segments, incorrect merge results, or leaks complexity into default single-stream runs.
   187	- **Procedure**: Disable wave mode in config or workflow routing, keep segment-planning helpers uninvoked, and preserve the single-stream runtime while planner and merge issues are corrected under test.
   188	- **Safety Note**: Rollback must keep segment artifacts readable for debugging even when wave mode is disabled.
   189	<!-- /ANCHOR:rollback -->

 succeeded in 0ms:
     1	---
     2	title: "Feature Specification: Wave Executor [042.003]"
     3	description: "Define orchestrator-managed parallel wave execution for deep research and deep review so large targets can be segmented, converged, and merged without turning LEAF agents into sub-agent managers."
     4	trigger_phrases:
     5	  - "042.003"
     6	  - "wave executor"
     7	  - "segment planner"
     8	  - "coordination board"
     9	  - "parallel deep loop"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Feature Specification: Wave Executor
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
    17	
    18	---
    19	
    20	## EXECUTIVE SUMMARY
    21	
    22	Phase 003 adds orchestrator-managed parallel wave execution so deep research and deep review can handle very large targets without abandoning the LEAF-worker model. It formalizes deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the coverage-graph foundation from Phase 002.
    23	
    24	<!-- ANCHOR:metadata -->
    25	## 1. METADATA
    26	
    27	| Field | Value |
    28	|-------|-------|
    29	| **Level** | 3 |
    30	| **Priority** | P1 |
    31	| **Status** | Draft |
    32	| **Created** | 2026-04-10 |
    33	| **Branch** | `042-sk-deep-research-review-improvement-2` |
    34	| **Parent Packet** | `../spec.md` |
    35	| **Parent Plan** | `../plan.md` |
    36	| **Phase** | 3 of 4 |
    37	| **Predecessor** | `002-semantic-coverage-graph` |
    38	| **Successor** | `004-offline-loop-optimizer` |
    39	| **Handoff Criteria** | Phase 004 can replay wave runs as deterministic, segment-aware traces with stable board and merge artifacts. |
    40	<!-- /ANCHOR:metadata -->
    41	
    42	<!-- ANCHOR:phase-context -->
    43	**Phase Context**: This phase adds orchestrator-managed parallel batches on top of the coverage-graph substrate from Phase 002. The goal is scale without architectural drift: the workers stay LEAF, while orchestration logic handles segmentation, fan-out, pruning, promotion, and merge.
    44	
    45	**Dependencies**:
    46	- Phase 002 graph tools, especially graph-backed convergence and gap detection.
    47	- Phase 001 stop reasons, journals, resume semantics, and reducer-owned sections.
    48	- Existing deep-research and deep-review command or YAML entrypoints.
    49	
    50	**Deliverables**:
    51	- Shared segment planner logic for hotspot-ranked review and authority-clustered research.
    52	- Wave lifecycle orchestration for plan, fan-out, prune, promote, and merge.
    53	- Packet-local coordination board and segment JSONL contract.
    54	- Verification for segment isolation, merge correctness, and default-path preservation.
    55	<!-- /ANCHOR:phase-context -->
    56	
    57	---
    58	
    59	<!-- ANCHOR:problem -->
    60	## 2. PROBLEM & PURPOSE
    61	
    62	### Problem Statement
    63	
    64	The deep-loop products are currently optimized for one iteration stream at a time. That works for moderate targets, but it becomes inefficient and hard to govern once a review scope crosses 1000 files or a research scope spans dozens of domains. Without a structured wave executor, operators must either accept slow sequential progress or invent ad hoc parallelism that risks duplicated work, conflicting findings, and unmergeable state.
    65	
    66	### Purpose
    67	
    68	Define an orchestrator-layer wave execution model that segments large review and research targets into bounded parallel batches, tracks each segment through convergence and promotion, and merges the results back into one auditable packet without changing the LEAF-worker rule.
    69	<!-- /ANCHOR:problem -->
    70	
    71	---
    72	
    73	<!-- ANCHOR:scope -->
    74	## 3. SCOPE
    75	
    76	### In Scope
    77	
    78	- Add shared CommonJS planners for review-file segmentation and research-domain clustering.
    79	- Define wave lifecycle steps: plan, fan-out, prune, promote, and merge.
    80	- Introduce packet-local coordination-board tracking for segment status, conflicts, deduplication, and promoted findings.
    81	- Define segment-local JSONL or state artifacts and deterministic merge rules into the main packet lineage.
    82	- Apply Phase 002 graph convergence per segment so pruning and promotion decisions are evidence-backed.
    83	- Add workflow, config, and strategy surfaces for wave-aware execution without changing the default small-target path.
    84	- Add tests for lifecycle correctness, segment isolation, merge idempotence, and resume or recovery behavior.
    85	
    86	### Out of Scope
    87	
    88	- Graph storage and graph-tool creation from Phase 002.
    89	- Offline replay optimization, config search, and promotion gates from Phase 004.
    90	- Allowing LEAF research or review agents to spawn child agents directly.
    91	- Replacing the existing single-stream path for small review or research runs.
    92	
    93	### Files to Change
    94	
    95	| File Path | Change Type | Description |
    96	|-----------|-------------|-------------|
    97	| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` | Create | Shared planner for hotspot-ranked review segments and authority-clustered research segments. |
    98	| `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` | Create | Orchestrator lifecycle helpers for fan-out, prune, promote, merge, and resume state transitions. |
    99	| `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs` | Create | Coordination-board schema, status transitions, conflict tracking, and renderer helpers. |
   100	| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs` | Create | Segment JSONL, lineage, and merge helpers. |
   101	| `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs` | Create | Segment-level convergence helpers that wrap Phase 002 graph metrics and stop traces. |
   102	| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document domain clustering, wave segmentation, prune or promote rules, and merge behavior for research. |
   103	| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add segment JSONL, board, and merge artifact contracts. |
   104	| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add wave mode, segment planner, and board configuration fields. |
   105	| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add segment plan, promoted findings, and merge checkpoints. |
   106	| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document inventory pass, hotspot segmentation, wave lifecycle, and merge behavior for review. |
   107	| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add segment JSONL, board, and merge artifact contracts. |
   108	| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add wave mode, segment planner, and board configuration fields. |
   109	| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add segment queues, conflict tracking, and merge checkpoints. |
   110	| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Define wave-aware review outputs and reducer-owned coordination sections. |
   111	| `.opencode/command/spec_kit/deep-research.md` | Modify | Document when wave mode is legal and how it changes execution surfaces. |
   112	| `.opencode/command/spec_kit/deep-review.md` | Modify | Document when wave mode is legal and how it changes execution surfaces. |
   113	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add segment planning, fan-out, prune, promote, and merge steps for research. |
   114	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode research flow aligned with wave lifecycle rules. |
   115	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add segment planning, fan-out, prune, promote, and merge steps for review. |
   116	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode review flow aligned with wave lifecycle rules. |
   117	| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts` | Create | Verify segment planning, ranking, and clustering behavior. |
   118	| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` | Create | Verify lifecycle transitions, prune rules, and promotion rules. |
   119	| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts` | Create | Verify segment isolation, deterministic merge, and idempotent replay behavior. |
   120	| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts` | Create | Verify wave interruption and resume behavior. |
   121	<!-- /ANCHOR:scope -->
   122	
   123	---
   124	
   125	<!-- ANCHOR:requirements -->
   126	## 4. REQUIREMENTS
   127	
   128	### P0 - Blockers (MUST complete)
   129	
   130	| ID | Requirement | Acceptance Criteria |
   131	|----|-------------|---------------------|
   132	| REQ-001 | The phase MUST define deterministic segment planning for both large review scopes and large research scopes. | Review planning includes inventory plus hotspot or cluster ranking; research planning includes domain authority or topic clustering; every segment receives stable identity, scope, and ordering metadata. |
   133	| REQ-002 | Parallelism MUST live at the orchestrator layer while LEAF agents remain non-spawning workers. | Wave lifecycle steps are owned by shared orchestration logic and YAML workflows; no requirement or task asks `@deep-research` or `@deep-review` workers to spawn child agents directly. |
   134	| REQ-003 | The phase MUST define a packet-local coordination board that tracks segment status, conflicts, dedupe signals, and promoted findings. | The board contract includes per-segment state, conflict notes, deduplication markers, and promotion outcomes; research and review can both render or consume the same board model. |
   135	| REQ-004 | Segment-local JSONL and merge rules MUST preserve auditability when wave results are merged back into the main packet lineage. | Segment artifacts remain replayable on their own, merge order is deterministic, and merged outputs preserve segment provenance instead of flattening everything into anonymous findings. |
   136	
   137	### P1 - Required (complete OR user-approved deferral)
   138	
   139	| ID | Requirement | Acceptance Criteria |
   140	|----|-------------|---------------------|
   141	| REQ-005 | Each segment MUST use Phase 002 graph signals independently for convergence, pruning, and promotion. | Segment convergence explicitly references coverage-graph status or convergence outputs; prune logic can retire converged or stuck segments without dropping unresolved global gaps silently. |
   142	| REQ-006 | Deep-research and deep-review workflows MUST expose wave execution as a bounded mode for large targets while preserving the default small-target path. | Command docs, YAML workflows, and config surfaces define when wave mode activates; normal runs continue to use the simpler single-stream flow unless segmentation is warranted. |
   143	| REQ-007 | Segment promotion and merge MUST preserve conflict and dedupe metadata instead of flattening segment results into one anonymous stream. | The coordination board and merge outputs explicitly keep `conflict`, `duplicate`, or `promoted` state so later synthesis and replay can explain where findings came from. |
   144	| REQ-008 | The phase MUST add verification for lifecycle correctness, segment isolation, merge correctness, and resume behavior. | Planned tests cover planner determinism, lifecycle transitions, merge idempotence, interruption or resume semantics, and protection against duplicate or conflicting promoted findings. |
   145	<!-- /ANCHOR:requirements -->
   146	
   147	---
   148	
   149	<!-- ANCHOR:success-criteria -->
   150	## 5. SUCCESS CRITERIA
   151	
   152	- **SC-001**: Research and review each have a documented segmentation strategy that scales to the large-target examples in the phase brief.
   153	- **SC-002**: The wave lifecycle is explicit and ordered: plan, fan-out, prune, promote, then merge.
   154	- **SC-003**: The coordination board is treated as a canonical packet-local artifact rather than an optional scratch note.
   155	- **SC-004**: Segment-local artifacts remain replayable and mergeable without losing segment provenance.
   156	- **SC-005**: Phase 002 graph convergence is reused per segment instead of redefined for wave mode.
   157	- **SC-006**: Default non-wave execution remains the canonical small-target path.
   158	- **SC-007**: Verification covers planner determinism, lifecycle behavior, merge correctness, and resume safety.
   159	
   160	### Acceptance Scenarios
   161	
   162	1. **Given** a review scope with more than 1000 files, **when** wave planning runs, **then** the planner emits stable hotspot-ranked segments instead of one monolithic file list.
   163	2. **Given** a research scope with more than 50 source domains, **when** wave planning runs, **then** domains are clustered into bounded segment scopes with stable identities.
   164	3. **Given** one segment converges early, **when** prune evaluation runs, **then** that segment can retire without making global STOP legal until remaining gaps are satisfied.
   165	4. **Given** two segments surface duplicate or conflicting findings, **when** promotion happens, **then** the coordination board preserves those states rather than silently collapsing them.
   166	5. **Given** a wave is interrupted mid-run, **when** resume starts, **then** only incomplete segment work is resumed and previously merged segment lineage remains intact.
   167	6. **Given** a small-target run, **when** deep research or deep review starts, **then** execution stays on the existing single-stream path and does not invoke wave machinery unnecessarily.
   168	<!-- /ANCHOR:success-criteria -->
   169	
   170	---
   171	
   172	<!-- ANCHOR:risks -->
   173	## 6. RISKS & DEPENDENCIES
   174	
   175	| Type | Item | Impact | Mitigation |
   176	|------|------|--------|------------|
   177	| Dependency | Phase 002 graph convergence must exist before segment pruning is trustworthy | High | Treat graph status and convergence as prerequisite surfaces for prune and promote decisions. |
   178	| Dependency | Phase 001 resume semantics remain the lineage authority | Medium | Build wave resume on top of the same typed stop and journal model rather than creating a second checkpoint system. |
   179	| Risk | Segment planners produce unstable partitions between runs | Medium | Require deterministic ranking and stable segment IDs based on scope metadata. |
   180	| Risk | Merge behavior duplicates or overwrites findings across segments | High | Preserve segment provenance, conflict markers, and dedupe metadata through merge rules and tests. |
   181	| Risk | Coordination-board maintenance becomes manual busywork | Medium | Keep it reducer- or workflow-generated, not human-maintained. |
   182	| Risk | Wave mode leaks into small-target defaults and makes normal runs harder to understand | Medium | Gate wave mode behind explicit large-target criteria and keep the default path unchanged. |
   183	<!-- /ANCHOR:risks -->
   184	
   185	---
   186	
   187	## 7. NON-FUNCTIONAL REQUIREMENTS
   188	
   189	### Performance
   190	
   191	- Segment planning should stay linear or near-linear in the size of the inventory so orchestration overhead does not dominate the run.
   192	- Merge and board updates must remain cheap enough to execute after each wave.
   193	
   194	### Reliability
   195	
   196	- Segment lineage must survive interruption and replay without losing provenance.
   197	- Default single-stream behavior must remain available when wave mode is disabled or inapplicable.
   198	
   199	### Maintainability
   200	
   201	- Planner, lifecycle, convergence, and merge logic should remain in shared helper modules rather than being embedded repeatedly in YAML.
   202	- Research and review should differ mainly in planner inputs and artifact naming, not in orchestration rules.
   203	
   204	---
   205	
   206	<!-- ANCHOR:edge-cases -->
   207	## 8. EDGE CASES
   208	
   209	- A repo hotspot spans multiple clusters and appears in more than one planned segment. Deduplication and promotion rules must prevent the same finding from being merged twice.
   210	- A research domain cluster converges quickly while a second cluster remains unresolved. Prune logic must retire the first segment without making global STOP legal yet.
   211	- A segment fails or stalls mid-wave. Resume behavior must restart only the affected segment or re-plan safely rather than invalidating the whole wave.
   212	- Merge happens after some segments promoted findings with contradictory evidence. The coordination board must preserve that conflict instead of flattening to one winner silently.
   213	- Small targets accidentally trigger the wave planner. Activation criteria must fall back to the single-stream path when segmentation adds no value.
   214	<!-- /ANCHOR:edge-cases -->
   215	
   216	---
   217	
   218	<!-- ANCHOR:complexity -->
   219	## 9. COMPLEXITY ASSESSMENT
   220	
   221	| Axis | Assessment |
   222	|------|------------|
   223	| **Planning** | High: deterministic segmentation for two different product types is non-trivial. |
   224	| **State Management** | High: segment-local JSONL plus merged lineage must stay replayable and auditable. |
   225	| **Workflow Orchestration** | High: fan-out, prune, promote, and merge add real lifecycle complexity. |
   226	| **Operator UX** | Medium: complexity is acceptable only if the default path remains simple. |
   227	| **Overall** | High: this phase introduces parallel execution semantics and must do so without weakening auditability. |
   228	<!-- /ANCHOR:complexity -->
   229	
   230	---
   231	
   232	## 10. RISK MATRIX
   233	
   234	| Risk | Likelihood | Impact | Response |
   235	|------|------------|--------|----------|
   236	| Planner instability across runs | Medium | High | Stabilize segment identity and ranking inputs before rollout. |
   237	| Merge drops provenance or dedupe state | Medium | High | Treat provenance preservation as a merge gate, not a nice-to-have. |
   238	| Wave mode changes default behavior | Low | High | Keep activation criteria explicit and covered by regression tests. |
   239	| Board state becomes manual | Medium | Medium | Generate and refresh it through shared runtime helpers. |
   240	
   241	---
   242	
   243	## 11. USER STORIES
   244	
   245	- As an operator reviewing a huge repository, I want the orchestrator to split work into bounded hotspots so I can trust progress without waiting for one giant sequential pass.
   246	- As an operator researching many domains, I want segment-level convergence and promotion so the loop can focus resources where uncertainty still exists.
   247	- As a future optimizer, I want segment-aware traces, board states, and merge metadata so I can replay and tune large-target behavior offline.
   248	
   249	---
   250	
   251	<!-- ANCHOR:questions -->
   252	## 12. OPEN QUESTIONS
   253	
   254	- No blocking open questions remain at planning time.
   255	<!-- /ANCHOR:questions -->
   256	
   257	---
   258	
   259	## 13. RELATED DOCUMENTS
   260	

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Tasks: Wave Executor [042.003]"
     3	description: "Task Format: T### [P?] Description (file path)"
     4	trigger_phrases:
     5	  - "042.003"
     6	  - "tasks"
     7	  - "wave executor"
     8	  - "segment planner"
     9	importance_tier: "important"
    10	contextType: "planning"
    11	---
    12	# Tasks: Wave Executor
    13	
    14	<!-- SPECKIT_LEVEL: 3 -->
    15	<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
    16	
    17	---
    18	
    19	<!-- ANCHOR:notation -->
    20	## Task Notation
    21	
    22	| Prefix | Meaning |
    23	|--------|---------|
    24	| `[ ]` | Pending |
    25	| `[x]` | Completed |
    26	| `[P]` | Parallelizable |
    27	| `[B]` | Blocked |
    28	
    29	**Task Format**: `T### [P?] Description (file path)`
    30	<!-- /ANCHOR:notation -->
    31	
    32	---
    33	
    34	### AI Execution Protocol
    35	
    36	### Pre-Task Checklist
    37	- Confirm whether the task touches planner logic, workflow lifecycle, or merge verification.
    38	- Confirm the exact large-target trigger being implemented for research or review.
    39	- Confirm how segment provenance will be preserved after merge.
    40	
    41	### Execution Rules
    42	
    43	| Rule | Requirement |
    44	|------|-------------|
    45	| `REQ-LINKED` | Every task must map to at least one wave-executor requirement. |
    46	| `LEAF-SAFE` | No task may move orchestration responsibilities into LEAF workers. |
    47	| `SEGMENT-DETERMINISTIC` | Segment identity and order must be reproducible from the same inputs. |
    48	| `MERGE-AUDITABLE` | Segment merge must preserve provenance, dedupe, and conflict metadata. |
    49	
    50	### Status Reporting Format
    51	- `pending`: task has not started and still fits the current phase scope.
    52	- `in-progress`: implementation or validation is underway.
    53	- `blocked`: a dependency such as graph convergence or merge semantics is unresolved.
    54	- `completed`: implementation and verification are both complete.
    55	
    56	### Blocked Task Protocol
    57	- If Phase 002 graph convergence is not ready, block prune/promote work instead of inventing stop heuristics.
    58	- If segment IDs are unstable between replay runs, block merge tasks until planner determinism is restored.
    59	- If wave mode begins to alter the default small-target path, block release until the routing boundary is corrected.
    60	
    61	---
    62	
    63	<!-- ANCHOR:phase-1 -->
    64	## Phase 1: Setup
    65	
    66	### Phase 1: Segment Planning and State Contracts
    67	
    68	| Task ID | Status | Parent REQ | Files |
    69	|---------|--------|------------|-------|
    70	| T001 | Pending | REQ-001 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/references/loop_protocol.md` |
    71	| T002 | Pending | REQ-001 | `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json` |
    72	| T003 | Pending | REQ-003, REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |
    73	
    74	- [ ] T001 Define deterministic segment planning for review files and research domains.
    75	- [ ] T002 Add segment-plan configuration and strategy surfaces for research and review.
    76	- [ ] T003 Define coordination-board and segment-state artifact contracts.
    77	<!-- /ANCHOR:phase-1 -->
    78	
    79	---
    80	
    81	<!-- ANCHOR:phase-2 -->
    82	## Phase 2: Implementation
    83	
    84	### Phase 2: Wave Lifecycle Integration
    85	
    86	| Task ID | Status | Parent REQ | Files |
    87	|---------|--------|------------|-------|
    88	| T004 | Pending | REQ-002 | `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
    89	| T005 | Pending | REQ-005 | `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
    90	| T006 | Pending | REQ-003, REQ-005 | `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` |
    91	| T007 | Pending | REQ-006 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json` |
    92	| T008 | Pending | REQ-006 | `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` |
    93	| T009 | Pending | REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |
    94	
    95	- [ ] T004 Implement the shared wave lifecycle manager for fan-out, prune, promote, and merge transitions.
    96	- [ ] T005 Wrap Phase 002 graph signals for per-segment convergence and pruning.
    97	- [ ] T006 Add coordination-board updates for conflicts, dedupe, and promoted findings.
    98	- [ ] T007 Wire research command and workflow surfaces for bounded wave mode.
    99	- [ ] T008 Wire review command and workflow surfaces for bounded wave mode.
   100	- [ ] T009 Implement segment JSONL lineage and deterministic merge helpers.
   101	<!-- /ANCHOR:phase-2 -->
   102	
   103	---
   104	
   105	<!-- ANCHOR:phase-3 -->
   106	## Phase 3: Verification
   107	
   108	### Phase 3: Merge Proof and Recovery Hardening
   109	
   110	| Task ID | Status | Parent REQ | Files |
   111	|---------|--------|------------|-------|
   112	| T010 | Pending | REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` |
   113	| T011 | Pending | REQ-004, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` |
   114	| T012 | Pending | REQ-006, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
   115	
   116	- [ ] T010 Create lifecycle and planner tests for deterministic segmentation and wave transitions.
   117	- [ ] T011 Create merge tests that prove provenance, dedupe, and conflict metadata survive repeated merges.
   118	- [ ] T012 Create resume and default-path regression tests so wave mode stays bounded to large-target execution.
   119	<!-- /ANCHOR:phase-3 -->
   120	
   121	---
   122	
   123	<!-- ANCHOR:completion -->
   124	## Completion Criteria
   125	
   126	- [ ] Every task remains mapped to a wave-executor requirement and concrete file set.
   127	- [ ] Wave orchestration stays outside LEAF worker responsibilities.
   128	- [ ] Segment provenance, dedupe, and conflict tracking survive merge.
   129	- [ ] Default single-stream deep research and deep review remain intact.
   130	<!-- /ANCHOR:completion -->
   131	
   132	---
   133	
   134	<!-- ANCHOR:cross-refs -->
   135	## Cross-References
   136	
   137	- **Specification**: See `spec.md`
   138	- **Implementation Plan**: See `plan.md`
   139	- **Parent Packet**: See `../spec.md`
   140	<!-- /ANCHOR:cross-refs -->

exec
/bin/zsh -lc 'rg -n "workflow:|dispatch|agent:|loop|conver|iteration|Task|parallel|wave|segment|resume|synth|save" .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "workflow:|dispatch|agent:|loop|conver|iteration|Task|parallel|wave|segment|resume|synth|save" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
7:purpose: Iterative code/spec review with convergence detection across review dimensions
8:action: Run deep-review loop from initialization through synthesis
10:  workflow: iterative_loop
15:  validation: convergence_detection
21:  core: "Fresh context per iteration + externalized state = no context degradation"
22:  approach: "Dispatch focused review agent per dimension, evaluate convergence, repeat or stop"
33:  lineage_mode: "[auto|resume|restart|fork|completed-continue] - Session lifecycle intent. Default: auto."
34:  max_iterations: 7
35:  convergence_threshold: 0.10
59:    loop_protocol: .opencode/skill/sk-deep-review/references/loop_protocol.md
61:    convergence: .opencode/skill/sk-deep-review/references/convergence.md
70:  agent: deep-review
89:  iteration_pattern: "{spec_folder}/review/iterations/iteration-{NNN}.md"
95:workflow:
107:          - required_values_present: [review_target, review_target_type, review_dimensions, spec_folder, max_iterations, convergence_threshold]
115:        command: "mkdir -p {spec_folder}/review/iterations"
118:        action: "Rehome legacy review artifacts into review/iterations before session classification"
130:            - "{spec_folder}/scratch/iteration-*.md"
132:            - "{spec_folder}/review/iteration-*.md"
142:          - "{spec_folder}/scratch/iteration-*.md -> {spec_folder}/review/iterations/"
144:          - "{spec_folder}/review/iteration-*.md -> {spec_folder}/review/iterations/"
149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
160:          resume: "Config, JSONL, and strategy all exist and config.mode == 'review' and agree on target/spec folder"
164:          - session_state: "fresh | resume | completed-session | invalid-state"
165:        on_resume:
166:          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
167:          skip_to: phase_loop
169:          action: "Archive current review packet, increment generation, and create a new lineage segment"
173:          log: "Prior session already completed. Snapshot review synthesis and reopen via completed-continue."
174:          skip_to: phase_synthesis
195:          agent: |
216:          2. Subsequent iterations follow risk-ordered deep passes:
247:          maxIterations: "{max_iterations}"
248:          convergenceThreshold: "{convergence_threshold}"
260:        content: '{"type":"config","mode":"review","reviewTarget":"{review_target}","reviewTargetType":"{review_target_type}","reviewDimensions":"{review_dimensions}","sessionId":"{ISO_8601_NOW}","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
265:        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
277:          max_iterations: "{max_iterations}"
278:          convergence_threshold: "{convergence_threshold}"
289:        set: { current_iteration: 1, stuck_count: 0, p0_count: 0, p1_count: 0, p2_count: 0 }
294:  phase_loop:
295:    purpose: Dispatch review agent iterations until convergence
297:    max_repeats: "{max_iterations}"
308:          - iteration_count: "Count lines where type === 'iteration'"
309:          - current_iteration: "iteration_count + 1"
310:          - last_newFindingsRatio: "Extract newFindingsRatio from last iteration record"
311:          - last_focus: "Extract focus/dimension from latest iteration record, else 'none yet'"
312:          - ratio_prev: "Extract newFindingsRatio from second-latest iteration record, else 'N/A'"
313:          - ratio_latest: "Extract newFindingsRatio from latest iteration record, else 'N/A'"
319:          - p0_count: "Count P0 findings across all iterations"
320:          - p1_count: "Count P1 findings across all iterations"
321:          - p2_count: "Count P2 findings across all iterations"
322:          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: dimension (ratio, P0/P1/P2)'"
323:          - latest_status: "Extract status from latest iteration record, else 'none yet'"
330:          message: "Review paused. Delete review/.deep-review-pause to resume."
335:      step_check_convergence:
339:             a) if iteration_count >= max_iterations: STOP (max_iterations_reached)
345:               a) Rolling average (w=0.30, window=2, needs 2+ iterations):
348:               b) MAD noise floor (w=0.25, needs 3+ iterations):
370:      step_handle_convergence:
371:        action: "Act on convergence decision"
374:          skip_to: phase_synthesis
384:          log: "Iteration {current_iteration}: Continuing. Dimension: {next_dimension}"
387:        action: "Generate compact state summary for dispatch context (~200 tokens)"
390:          Iteration: {current_iteration} of {max_iterations}
400:      step_dispatch_iteration:
401:        action: "Dispatch @deep-review agent for one review iteration"
402:        dispatch:
403:          agent: deep-review
408:            REVIEW ITERATION {current_iteration} of {max_iterations}
428:              Write findings to: {spec_folder}/review/iterations/iteration-{NNN}.md
430:            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
439:        action: "Verify iteration outputs and extract metrics"
441:          - file_exists: "{spec_folder}/review/iterations/iteration-{NNN}.md"
442:          - jsonl_appended: "New iteration record in state.jsonl"
445:          - newFindingsRatio: "From latest JSONL iteration record"
446:          - findings_count: "From latest JSONL iteration record"
447:          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
448:          - dimensions: "From latest JSONL iteration record"
449:          - files_reviewed: "From latest JSONL iteration record"
450:          - status: "From latest JSONL iteration record"
451:          - reviewed_artifacts: "From latest JSONL iteration record"
452:          - traceability_checks: "From latest JSONL iteration record when present"
454:          action: "Mark iteration as 'error', continue to next"
455:          append_jsonl: '{"type":"iteration","run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
457:      step_post_iteration_claim_adjudication:
460:          - typed_packets_present: "Every new P0/P1 finding in review/iterations/iteration-{NNN}.md contains a claim-adjudication JSON block"
463:          action: "Mark the iteration as invalid for convergence and require rewrite before STOP is permitted"
466:          log: "Claim adjudication incomplete for new P0/P1 findings. Continue loop until packets are present. Set claim_adjudication_passed = false. This flag MUST be checked in convergence evaluation — STOP is blocked while claim_adjudication_passed == false."
472:          - "{spec_folder}/review/iterations/iteration-{NNN}.md"
486:          Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.
491:          - Iteration: {current_iteration} of {max_iterations}
515:          | [per iteration from JSONL] |
528:        action: "Update loop tracking variables"
530:          current_iteration: "{current_iteration + 1}"
541:      step_loop_decision:
542:        action: "Return to step_read_state for next iteration"
548:  phase_synthesis:
549:    purpose: Compile all iteration findings into review/review-report.md
553:        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
560:          - iteration_count: "Count lines where type === 'iteration'"
561:          - p0_count: "Total P0 findings across all iterations (deduped)"
562:          - p1_count: "Total P1 findings across all iterations (deduped)"
563:          - p2_count: "Total P2 findings across all iterations (deduped)"
566:          - last_3_summaries: "Summarize the latest 3 iteration records"
569:      step_read_all_iterations:
570:        action: "Read all iteration files and strategy"
571:        read_pattern: "{spec_folder}/review/iterations/iteration-*.md"
575:        action: "Build deduplicated finding registry from all iterations"
577:          1. Extract all findings from iteration files
585:             - Findings marked contested across iterations → referee pass
643:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
646:      step_convergence_report:
647:        action: "Append convergence report to JSONL"
648:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
659:  phase_save:
670:        note: "generate-context.js is the supported save boundary for this workflow"
672:      step_verify_save:
683:      Iterations: {iteration_count} | Stop reason: {reason}
688:        - review/review-report.md (compiled from {iteration_count} iterations)
689:        - {iteration_count} iteration files in review/iterations/
691:        - Memory context saved
698:      - "/memory:save {spec_folder} (manual memory save)"
704:  agent_dispatch_timeout: "Retry once with reduced scope (fewer files per iteration). If second timeout, mark as 'timeout' and continue."
705:  state_file_missing: "If JSONL missing during loop, reconstruct from iteration files. If strategy missing, create minimal version."
706:  consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings."
707:  memory_save_failure: "Preserve the review packet in review/ as backup. Log warning."
715:    - dispatch_deep_review_agent_per_iteration
716:    - check_convergence_before_each_iteration
718:    - save_memory_context_after_synthesis
719:    - respect_max_iterations_cap
721:    - deduplicate_findings_before_synthesis
724:    - skip_convergence_check
725:    - dispatch_non_leaf_agents
726:    - hold_iteration_findings_in_memory_only
740:      - "git add {spec_folder}/review/iterations/iteration-{NNN}.md {spec_folder}/review/deep-review-state.jsonl {spec_folder}/review/deep-review-findings-registry.json {spec_folder}/review/deep-review-strategy.md {spec_folder}/review/review-report.md"
741:      - 'git commit -m "chore(deep-review): iteration {NNN} complete"'
748:    p0_override: "If ANY new P0 discovered → newFindingsRatio = max(calculated, 0.50). A single new P0 blocks convergence."

 succeeded in 0ms:
7:purpose: Iterative deep research with convergence detection
8:action: Run deep-research loop from initialization through synthesis
10:  workflow: iterative_loop
15:  validation: convergence_detection
21:  core: "Fresh context per iteration + externalized state = no context degradation"
22:  approach: "Dispatch focused agent, evaluate convergence, repeat or stop"
31:  max_iterations: "[MAX_ITERATIONS] - Maximum loop iterations. Default: 10."
32:  convergence_threshold: "[CONVERGENCE_THRESHOLD] - Stop threshold. Default: 0.05."
56:    loop_protocol: .opencode/skill/sk-deep-research/references/loop_protocol.md
58:    convergence: .opencode/skill/sk-deep-research/references/convergence.md
67:  agent: deep-research
87:  synthesis_snapshot_pattern: "{spec_folder}/research/synthesis-v{generation}.md"
88:  iteration_pattern: "{spec_folder}/research/iterations/iteration-{NNN}.md"
94:workflow:
106:          - required_values_present: [research_topic, spec_folder, max_iterations, convergence_threshold]
114:        command: "mkdir -p {spec_folder}/research/iterations {spec_folder}/research/archive"
136:          resume: "Config, JSONL, and strategy all exist and agree on topic/spec folder"
140:          - session_state: "fresh | resume | completed-session | invalid-state"
141:        on_resume:
142:          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
143:          skip_to: phase_loop
145:          action: "Archive current packet, increment generation, and create a new lineage segment"
149:          log: "Prior session already completed. Snapshot synthesis and reopen via completed-continue."
150:          skip_to: phase_synthesis
162:          maxIterations: "{max_iterations}"
163:          convergenceThreshold: "{convergence_threshold}"
179:        content: '{"type":"config","topic":"{research_topic}","maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
190:          max_iterations: "{max_iterations}"
191:          convergence_threshold: "{convergence_threshold}"
196:        content: '{"openQuestions":[],"resolvedQuestions":[],"keyFindings":[],"ruledOutDirections":[],"metrics":{"iterationsCompleted":0,"openQuestions":0,"resolvedQuestions":0,"keyFindings":0,"convergenceScore":0,"coverageBySources":{}}}'
207:        set: { current_iteration: 1, current_segment: 1, stuck_count: 0 }
212:  phase_loop:
213:    purpose: Dispatch agent iterations until convergence
215:    max_repeats: "{max_iterations}"
224:          - iteration_count: "Count lines where type === 'iteration'"
225:          - current_iteration: "iteration_count + 1"
226:          - current_segment: "Latest segment_start event segment, else 1"
227:          - last_newInfoRatio: "Extract newInfoRatio from last iteration record"
228:          - last_focus: "Extract focus from latest iteration record, else 'none yet'"
229:          - ratio_prev: "Extract newInfoRatio from second-latest iteration record, else 'N/A'"
230:          - ratio_latest: "Extract newInfoRatio from latest iteration record, else 'N/A'"
236:          - least_explored: "First unanswered question not covered by the most recent iteration focus, else first unanswered question"
237:          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: focus (ratio)'"
238:          - latest_status: "Extract status from latest iteration record, else 'none yet'"
245:          message: "Research paused. Delete research/.deep-research-pause to resume."
250:      step_check_convergence:
253:          1. if iteration_count >= max_iterations: STOP (max_iterations_reached)
258:               Filter: exclude iterations where status == thought from signal inputs (use only evidence iterations)
259:               a) Rolling average (w=0.30, needs 3+ iterations):
261:                  stop if avg < convergence_threshold
262:               b) MAD noise floor (w=0.35, needs 4+ iterations):
269:               if weighted_stop_score > 0.60: STOP (composite_converged)
276:          See convergence.md for full pseudocode and signal definitions.
277:          Segment-aware convergence is experimental/reference-only; live workflow uses the current session as a single segment.
282:      step_handle_convergence:
283:        action: "Act on convergence decision"
286:          skip_to: phase_synthesis
292:          log: "Iteration {current_iteration}: Continuing. Focus: {next_focus}"
294:      step_dispatch_iteration:
295:        action: "Dispatch @deep-research agent for one iteration"
296:        dispatch:
297:          agent: deep-research
299:          pre_dispatch:
302:              Segment: {current_segment} | Iteration: {current_iteration} of {max_iterations}
310:            Iteration: {current_iteration} of {max_iterations}
320:              Write findings to: {spec_folder}/research/iterations/iteration-{NNN}.md
322:            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
332:          latestJSONLDelta: "Latest JSONL records written since the previous iteration"
333:          newIterationFile: "{spec_folder}/research/iterations/iteration-{NNN}.md"
341:          missing_iteration_file: "no-op + error"
346:        action: "Verify iteration outputs and extract metrics"
348:          - file_exists: "{spec_folder}/research/iterations/iteration-{NNN}.md"
349:          - jsonl_appended: "New iteration record in state.jsonl"
353:          - newInfoRatio: "From latest JSONL iteration record"
354:          - findings_count: "From latest JSONL iteration record"
355:          - status: "From latest JSONL iteration record"
356:          - latest_focus: "From latest JSONL iteration record"
358:          action: "Mark iteration as 'error', continue to next"
359:          append_jsonl: '{"type":"iteration","run":{current_iteration},"status":"error","focus":"{next_focus}","findingsCount":0,"newInfoRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
372:        action: "Update loop tracking variables"
374:          current_iteration: "{current_iteration + 1}"
375:          stuck_count: "if status == 'thought': unchanged (skip). if status == 'insight': 0 (reset). if newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"
378:      step_loop_decision:
379:        action: "Return to step_read_state for next iteration"
385:  phase_synthesis:
386:    purpose: Compile all iteration findings into final research/research.md
390:        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
397:          - iteration_count: "Count lines where type === 'iteration'"
398:          - current_iteration: "iteration_count + 1"
399:          - current_segment: "Latest segment_start event segment, else 1"
400:          - last_focus: "Extract focus from latest iteration record, else 'none yet'"
401:          - ratio_prev: "Extract newInfoRatio from second-latest iteration record, else 'N/A'"
402:          - ratio_latest: "Extract newInfoRatio from latest iteration record, else 'N/A'"
407:          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: focus (ratio)'"
408:          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
410:      step_read_all_iterations:
411:        action: "Read all iteration files and strategy"
412:        read_pattern: "{spec_folder}/research/iterations/iteration-*.md"
418:          If research/research.md exists (progressive synthesis was active):
420:            2. Consolidate and deduplicate findings across all iterations
421:            3. Fill any empty sections with findings from iteration files
423:            5. Add convergence report as appendix
427:            2. Populate sections from iteration files
430:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
433:      step_convergence_report:
434:        action: "Generate and append convergence report"
438:          - Total iterations: {iteration_count}
441:          - Last 3 iteration summaries: {last_3_summaries}
442:          - Convergence threshold: {convergence_threshold}
443:          - Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
444:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
454:  phase_save:
465:        note: "generate-context.js is the supported save boundary for this workflow"
467:      step_verify_save:
478:      Iterations: {iteration_count} | Stop reason: {reason}
482:        - research/research.md (compiled from {iteration_count} iterations)
483:        - {iteration_count} iteration files in research/
485:        - Memory context saved
491:      - "/memory:save {spec_folder} (manual memory save)"
497:  agent_dispatch_timeout: "Retry once with reduced scope (fewer research actions). If second timeout, mark as 'timeout' and continue."
498:  state_file_missing: "If JSONL missing during loop, reconstruct from iteration files. If strategy missing, create minimal version."
499:  consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings."
500:  memory_save_failure: "Preserve the research/ packet as backup. Log warning."
508:    - dispatch_deep_research_agent_per_iteration
509:    - check_convergence_before_each_iteration
511:    - save_memory_context_after_synthesis
512:    - respect_max_iterations_cap
514:    - skip_convergence_check
515:    - dispatch_non_leaf_agents
516:    - hold_iteration_findings_in_memory_only
528:      - "git add {spec_folder}/research/iterations/iteration-{NNN}.md {spec_folder}/research/deep-research-state.jsonl {spec_folder}/research/deep-research-strategy.md {spec_folder}/research/research.md"
529:      - 'git commit -m "chore(deep-research): iteration {NNN} complete"'
530:  wave_orchestration:
533:      - "Check whether 3+ independent unanswered questions justify a wave."
534:      - "Dispatch up to 3 parallel agents on distinct questions."
535:      - "Score wave results by median newInfoRatio and promote top branches."

exec
/bin/zsh -lc 'rg -n "wave|segment|parallel|LEAF|lineage|convergenceSignals|coordination|board|registry" .opencode/agent/deep-research.md .opencode/agent/deep-review.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-review/references/loop_protocol.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/references/convergence.md:15:Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.
.opencode/skill/sk-deep-research/references/convergence.md:23:> **Segment Awareness (REFERENCE-ONLY)**: When segments are explicitly enabled, `state.iterations` may be pre-filtered to the current segment. The live workflow uses a single segment by default.
.opencode/skill/sk-deep-research/references/convergence.md:29:  iterations = state.iterations  // single live segment; optional segment filtering is reference-only
.opencode/skill/sk-deep-research/references/convergence.md:62:- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/convergence.md:311:| segment (on iteration records) | number | 1 | Segment this iteration belongs to |
.opencode/skill/sk-deep-research/references/convergence.md:312:| segment_start (event type) | event | -- | Marks the start of a new segment |
.opencode/skill/sk-deep-research/references/convergence.md:315:- Filter iterations by `segment === currentSegment`
.opencode/skill/sk-deep-research/references/convergence.md:316:- Hard stops (max iterations) count ALL iterations regardless of segment
.opencode/skill/sk-deep-research/references/convergence.md:317:- Cross-segment analysis: read full JSONL without segment filtering
.opencode/skill/sk-deep-research/references/convergence.md:607:Total iterations: N (segment: S)
.opencode/agent/deep-review.md:3:description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."
.opencode/agent/deep-review.md:31:> **SPEC FOLDER PERMISSION:** @deep-review may write only `review/` artifacts inside the active spec folder (iteration artifacts, strategy, JSONL, dashboard, report). Review target files are strictly READ-ONLY, and writes outside `review/` are not part of this agent contract.
.opencode/agent/deep-review.md:37:This agent is LEAF-only. Nested sub-agent dispatch is illegal.
.opencode/agent/deep-review.md:64:- `review/deep-review-findings-registry.json` -- Read reducer-owned active finding state (read-only for this agent)
.opencode/agent/deep-review.md:66:- `review/deep-review-config.json` -- Read review configuration, lineage metadata, and release readiness state (read-only)
.opencode/agent/deep-review.md:253:> **Note:** The orchestrator enriches each iteration record with optional `segment` (default: 1) and `convergenceSignals` fields after the agent writes it. The agent does not write these fields.
.opencode/agent/deep-review.md:337:- `fork`: Start a child review session from an earlier lineage point.
.opencode/agent/deep-review.md:340:Always treat these config fields as required read-only lineage metadata:
.opencode/agent/deep-review.md:343:- `lineageMode`
.opencode/agent/deep-review.md:349:- `review/deep-review-findings-registry.json` is the canonical reducer-owned finding registry.
.opencode/agent/deep-review.md:350:- This leaf agent may READ the registry for continuity and deduplication context.
.opencode/agent/deep-review.md:351:- The orchestrator/reducer refreshes the registry after each iteration; do not overwrite it from this agent.
.opencode/agent/deep-review.md:365:| Findings registry | `review/deep-review-findings-registry.json` | Read only |
.opencode/agent/deep-review.md:443:1. Dispatch sub-agents or use Task tool (LEAF-only)
.opencode/agent/deep-review.md:475:[x] State files read at start (JSONL + findings registry + strategy + config)
.opencode/agent/deep-review.md:484:[x] Config lineage fields respected as read-only session contract
.opencode/agent/deep-review.md:485:[x] Findings registry treated as reducer-owned canonical state
.opencode/agent/deep-review.md:490:[x] No sub-agents dispatched (LEAF compliance)
.opencode/agent/deep-review.md:595:│  ├── LEAF-only (no sub-agents)           │
.opencode/agent/deep-research.md:38:This agent is LEAF-only. Nested sub-agent dispatch is illegal.
.opencode/agent/deep-research.md:58:6. REDUCER SYNC ────> Workflow refreshes strategy, registry, dashboard
.opencode/agent/deep-research.md:68:- `research/findings-registry.json` (if exists) -- Understand open/resolved questions and key findings
.opencode/agent/deep-research.md:76:- Lifecycle branch from `config.lineage.lineageMode` (`resume`, `restart`, `fork`, or `completed-continue`)
.opencode/agent/deep-research.md:160:Do not treat `research/deep-research-strategy.md`, `research/findings-registry.json`, or `research/deep-research-dashboard.md` as your primary write targets. The workflow reducer owns those synchronized packet surfaces.
.opencode/agent/deep-research.md:165:3. Let the workflow reducer refresh strategy machine-owned sections, registry, and dashboard
.opencode/agent/deep-research.md:189:> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
.opencode/agent/deep-research.md:212:#### Dashboard Awareness
.opencode/agent/deep-research.md:213:The orchestrator generates a research dashboard and findings registry after each iteration, summarizing progress, coverage, and convergence trends. The agent does not update those reducer-owned files directly. However, your iteration data (newInfoRatio, status, focus, ruledOut, focusTrack, toolsUsed, sourcesQueried) feeds directly into those synchronized outputs.
.opencode/agent/deep-research.md:293:| Findings registry | `research/findings-registry.json` | Read only |
.opencode/agent/deep-research.md:327:- Dispatch sub-agents or use Task tool (LEAF-only)
.opencode/agent/deep-research.md:363:- workflow reducer refreshes research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
.opencode/agent/deep-research.md:388:[x] Reducer-owned strategy/dashboard/registry will have enough data to sync
.opencode/agent/deep-research.md:394:[x] No sub-agents dispatched (LEAF compliance)
.opencode/agent/deep-research.md:468:│  |-- LEAF-only: no sub-agent dispatch                                   │
.opencode/skill/sk-deep-review/references/loop_protocol.md:15:The deep review loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the `@deep-review` agent (LEAF-only, no WebFetch) executes individual review iterations with fresh context each time.
.opencode/skill/sk-deep-review/references/loop_protocol.md:28:│              │     │  │ Dashboard Generation    │  │     │ Replay        │     │          │
.opencode/skill/sk-deep-review/references/loop_protocol.md:47:| Agent | `@deep-review` (LEAF) | Single iteration executor; no sub-agents, no WebFetch |
.opencode/skill/sk-deep-review/references/loop_protocol.md:106:6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
.opencode/skill/sk-deep-review/references/loop_protocol.md:108:7. **Initialize state log**: First line of `{spec_folder}/review/deep-review-state.jsonl` with config record including `mode: "review"` and the lineage fields.
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:125:11. **Resume only if config, JSONL, strategy, and findings registry agree**; otherwise halt for repair instead of guessing.
.opencode/skill/sk-deep-review/references/loop_protocol.md:133:| Registry | `{spec_folder}/review/deep-review-findings-registry.json` | Reducer-owned findings state |
.opencode/skill/sk-deep-review/references/loop_protocol.md:146:- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
.opencode/skill/sk-deep-review/references/loop_protocol.md:147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
.opencode/skill/sk-deep-review/references/loop_protocol.md:155:| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:239:  - Registry: {spec_folder}/review/deep-review-findings-registry.json
.opencode/skill/sk-deep-review/references/loop_protocol.md:242:CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
.opencode/skill/sk-deep-review/references/loop_protocol.md:247:- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
.opencode/skill/sk-deep-review/references/loop_protocol.md:319:#### Step 4b: Generate Dashboard
.opencode/skill/sk-deep-review/references/loop_protocol.md:321:Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
.opencode/skill/sk-deep-review/references/loop_protocol.md:332:Dashboard behavior:
.opencode/skill/sk-deep-review/references/loop_protocol.md:505:1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
.opencode/skill/sk-deep-review/references/loop_protocol.md:509:5. **Log resume**: Append resume event to JSONL with lineage metadata:
.opencode/skill/sk-deep-review/references/loop_protocol.md:511:   {"type":"event","event":"resumed","lineageMode":"resume","sessionId":"rvw-...","generation":1,"fromIteration":N}
.opencode/skill/sk-deep-review/references/loop_protocol.md:591:| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
.opencode/skill/sk-deep-review/references/loop_protocol.md:746:| Dashboard Template | `assets/deep_review_dashboard.md` | Template for auto-generated dashboard |
.opencode/skill/sk-deep-review/references/loop_protocol.md:759:| `@deep-review` | `{runtime_dir}/deep-review.{ext}` | LEAF-only, no sub-agents, no WebFetch, target files read-only |
.opencode/skill/sk-deep-research/references/loop_protocol.md:3:description: Canonical specification for the deep research loop lifecycle with 4 phases, reference-only wave orchestration, and error handling.
.opencode/skill/sk-deep-research/references/loop_protocol.md:63:7. **Initialize findings registry**: `research/findings-registry.json` with empty `openQuestions`, `resolvedQuestions`, `keyFindings`, and `ruledOutDirections`
.opencode/skill/sk-deep-research/references/loop_protocol.md:88:- `resume`: same `sessionId`, no archive, continue from the active lineage boundary
.opencode/skill/sk-deep-research/references/loop_protocol.md:91:- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
.opencode/skill/sk-deep-research/references/loop_protocol.md:150:Segment: {current_segment} | Iteration: {N} of {max}
.opencode/skill/sk-deep-research/references/loop_protocol.md:174:CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
.opencode/skill/sk-deep-research/references/loop_protocol.md:195:4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/loop_protocol.md:200:#### Step 4a: Generate Dashboard
.opencode/skill/sk-deep-research/references/loop_protocol.md:202:After evaluating iteration results, generate a human-readable dashboard:
.opencode/skill/sk-deep-research/references/loop_protocol.md:204:1. Read JSONL state log, findings registry, and strategy.md
.opencode/skill/sk-deep-research/references/loop_protocol.md:205:2. Generate or regenerate `research/deep-research-dashboard.md` with the following sections:
.opencode/skill/sk-deep-research/references/loop_protocol.md:212:3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:213:4. The dashboard is **auto-generated only** — never manually edited
.opencode/skill/sk-deep-research/references/loop_protocol.md:214:5. The dashboard file is overwritten each iteration (not appended)
.opencode/skill/sk-deep-research/references/loop_protocol.md:215:6. Dashboard generation is non-blocking: if it fails, log a warning and continue the loop
.opencode/skill/sk-deep-research/references/loop_protocol.md:217:In **confirm mode**, the dashboard is displayed to the user at each iteration approval gate. In **auto mode**, it is written silently for post-hoc review.
.opencode/skill/sk-deep-research/references/loop_protocol.md:230:   git add research/findings-registry.json
.opencode/skill/sk-deep-research/references/loop_protocol.md:231:   git add research/deep-research-dashboard.md
.opencode/skill/sk-deep-research/references/loop_protocol.md:315:<!-- ANCHOR:wave-orchestration-protocol -->
.opencode/skill/sk-deep-research/references/loop_protocol.md:318:An optional parallel execution mode for research topics with multiple independent questions. Treat this as reference guidance unless the runtime explicitly supports it; the live workflow remains sequential.
.opencode/skill/sk-deep-research/references/loop_protocol.md:335:Scoring: Rank by newInfoRatio, prune below median when wave support is enabled
.opencode/skill/sk-deep-research/references/loop_protocol.md:346:After each wave completes:
.opencode/skill/sk-deep-research/references/loop_protocol.md:347:1. Rank all wave iterations by `newInfoRatio`
.opencode/skill/sk-deep-research/references/loop_protocol.md:348:2. Compute wave median: `median([i.newInfoRatio for i in wave_iterations])`
.opencode/skill/sk-deep-research/references/loop_protocol.md:349:3. **Prune**: Questions with newInfoRatio below median are deprioritized when wave support is enabled
.opencode/skill/sk-deep-research/references/loop_protocol.md:355:When any single iteration in a wave achieves `newInfoRatio > 2x wave_average`:
.opencode/skill/sk-deep-research/references/loop_protocol.md:359:3. Prioritize these adjacent questions in the next wave
.opencode/skill/sk-deep-research/references/loop_protocol.md:366:{"type":"iteration","run":N,"wave":1,"status":"complete",...}
.opencode/skill/sk-deep-research/references/loop_protocol.md:371:{"type":"event","event":"wave_complete","wave":1,"iterations":[1,2,3],"medianRatio":0.5}
.opencode/skill/sk-deep-research/references/loop_protocol.md:372:{"type":"event","event":"breakthrough","wave":1,"iteration":2,"ratio":0.95}
.opencode/skill/sk-deep-research/references/loop_protocol.md:380:- Sequential mode can spawn a wave when new independent questions emerge
.opencode/skill/sk-deep-research/references/loop_protocol.md:384:<!-- /ANCHOR:wave-orchestration-protocol -->
.opencode/skill/sk-deep-research/references/loop_protocol.md:656:CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
.opencode/skill/sk-deep-research/references/loop_protocol.md:704:#### Step 4b: Generate Dashboard (adapted)
.opencode/skill/sk-deep-research/references/loop_protocol.md:705:Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
.opencode/skill/sk-deep-research/references/loop_protocol.md:721:3. **Finding registry dedup**: Consolidate findings across iterations:

codex
I’ve got the packet requirements and the current workflows in view now. The important early signal is that the live YAML stays strictly sequential today while the research skill keeps wave orchestration as reference-only, so I’m now checking the broader codebase for any reusable planner, reducer, fan-out, or segment-state patterns before I look outside the repo.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"wave|segment|parallel|fan-out|prune|promote|coordination board|lineage|findings-registry|dashboard_generated|synthesis_complete|convergenceSignals\" .opencode | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 701ms:
lready exists   | Increment BUILD segment                              |
.opencode/specs/00--barter/001-tiktok-instagram-youtube-integration/research/iterations/iteration-015.md:47:f inventing a parallel system. [SOURCE: https://developers.tiktok.com/doc/content-sharing-guidelines/] [SOURCE: https://developers.tiktok.com/doc/content-posting-api-reference-direct-post?enter_method=left_navigation&from_seo_redirect=1] [SOURCE: https://developers.tiktok.com/doc/content-posting-api-reference-photo-post/?from_seo_redirect=1]
.opencode/skill/sk-code-web/SKILL.md:335:For complex codebase analysis, dispatch parallel agents:
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_20-18__speckit-plan-setup-no-feature-description-or-mode.md:287:This session followed a **Linear Sequential** conversation pattern with **2** phase segments across **2** unique phases.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:8:GPT Researcher documents a planner/executor/publisher architecture, then implements it as a Chief Editor workflow that runs `browser -> planner -> researcher -> writer -> publisher`. The planner turns initial research into a section list, and the editor dispatches one research subworkflow per section. This is a meaningful delta from Wave 1's mostly single-loop patterns because decomposition happens by report shard, not only by iteration. Inference: `sk-deep-research` could preserve its LEAF agent while letting the orchestrator generate branch briefs and merge branch outputs. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:54-67] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/orchestrator.py:52-81] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:22-50] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:175-210] [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md:47-58]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:11:The LangGraph editor creates one task input per section with only `task`, `topic`, and `title`, runs those tasks with `asyncio.gather`, and merges only the returned drafts. That is a low-conflict parallelism pattern: workers do not co-edit shared planning state while running. This matters for us because the current skill is explicitly LEAF-only and still treats wave orchestration as reference-only. Inference: if we add parallel fan-out later, the safe model is orchestrator-owned merge files plus immutable shard briefs, not shared `strategy.md` mutation by parallel workers. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:161-168] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:230-246]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:13:### 3. The deep-research traversal is a hybrid: concurrent breadth fan-out, then recursive drill-down
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:14:`DeepResearchSkill` generates multiple search queries, runs them under a semaphore, gathers the whole breadth layer, then recurses on each result with reduced breadth (`max(2, breadth // 2)`) and lower depth. That is not a pure breadth-first or depth-first tree; it is a batched fan-out followed by per-branch drilling. This is new versus Wave 1 because it provides a concrete depth/breadth policy rather than only branch labels or round transitions. Inference: `sk-deep-research` could borrow a frontier policy like this without adopting persistent live branch state. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:213-220] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:223-237] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:296-345]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:17:The multi-agent path does not only parallelize research; it wraps each section in a local `researcher -> reviewer -> reviser` loop, and the AG2 version makes the loop bound explicit with `max_revisions`. That is a stronger decomposition pattern than Wave 1's global guard-metric ideas because the review happens at the unit of decomposition before synthesis. Inference: a future `sk-deep-research` upgrade could add an optional reviewer pass over each iteration or track before findings count toward convergence. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/docs/docs/gpt-researcher/multi_agents/langgraph.md:14-48] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:126-144] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/README.md:46-56] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/agents/orchestrator.py:137-169]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:20:GPT Researcher keeps report writing and publishing as distinct stages: the writer builds introduction/conclusion/table of contents/source list from `research_data`, the publisher renders the assembled layout to output formats, and the prompt stack requires in-text citations, deduplicated references, branch integration, and preference for reliable/recent sources. Upstream of that, source curation can rank scraped material by relevance, credibility, currency, objectivity, and quantitative value before report generation. This is a real delta from Wave 1: not just better looping, but a multi-stage synthesis pipeline that could improve `research/research.md` quality without changing the LEAF contract. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/writer.py:32-67] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/publisher.py:16-61] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/researcher.py:193-197] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py:15-20] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py:33-85] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py:273-312] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py:414-483]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:23:- New patterns not in Wave 1: planner-owned section sharding; immutable shard briefs plus merge-at-end parallelism; hybrid breadth-fan-out then recursive drill-down traversal; shard-local reviewer/reviser loops; separate writer/publisher/source-curation pipeline.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:28:- `/tmp/deep-research-029-wave2/gpt-researcher/README.md`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:29:- `/tmp/deep-research-029-wave2/gpt-researcher/docs/docs/gpt-researcher/multi_agents/langgraph.md`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:30:- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:31:- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:32:- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/researcher.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:33:- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:34:- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/orchestrator.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:35:- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:36:- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/writer.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:37:- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/publisher.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:38:- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/README.md`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:39:- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/agents/orchestrator.py`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:47:- keyInsights: planner-owned shard orchestration is the cleanest transferable multi-agent pattern; the tree search uses hybrid breadth fan-out plus recursive drill-down rather than pure BFS or DFS; source curation plus a dedicated synthesis pipeline is a bigger delta than persistent branch state.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:50:- Q6: gpt-researcher adds a practical multi-agent decomposition model: planner-owned section sharding, parallel shard execution, shard-local review/revision, hybrid tree traversal, and a separate source-curation plus report-publication pipeline.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:55:- Would a frontier queue with bounded parallel shards be simpler than activating full live segments or branch state?
.opencode/specs/00--anobel.com/036-notification-toast-button/memory/04-04-26_15-09__planning-session-for-cms-driven-button-in.md:233:This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/deep-research-strategy.md:40:- [x] Q1 (iteration-001): 2 REUSE-AS-IS, 12 ADAPT, 1 REPLACE. Recommends parallel YAML workflows. Found 5 existing inconsistencies.
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/deep-research-strategy.md:58:(none — single wave was sufficient)
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/deep-research-strategy.md:100:- Convergence: all questions answered in single wave
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-002.md:18:### 2. The "one file, one metric, one loop" pattern should be adapted into a bounded research-segment contract
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-002.md:19:The core `autoresearch` constraint is short and memorable: "one file, one metric, one loop." In practice, that means a single editable file, a single measurable outcome, and a tightly bounded search space. `sk-deep-research` already has "one focus per iteration," but that is weaker than `autoresearch`'s overall run-level constraint. A useful upgrade would be to define one bounded research segment per round: one question cluster, one success scorecard, and one allowed evidence surface. That would reduce broad drift across long runs and make each segment easier to evaluate afterward. In other words, import the constraint discipline, not the literal single-file rule.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-002.md:54:`autoresearch` treats Round 2 as a different design problem, not just "more iterations." It explicitly says to read the prior log, use the "what didn't work" and "recommended next steps" sections to define the next round, preserve the same test data across rounds, and create new instructions, eval, JSONL, and dashboard files per round. The lessons file adds an important warning: sequential rounds can hit a co-optimization ceiling because Round 1 can overfit to the frozen state of other components. `sk-deep-research` has segment and wave ideas, but they are still mostly reference-only. A strong improvement would be to add a live round-transition protocol: carry forward the same key questions where comparability matters, require an explicit round hypothesis, and run a component-influence check before dedicating a new round to a subcomponent.

codex
The repo search is useful: beyond the live deep-loop YAML, the only mature “wave” patterns I’m seeing are top-level orchestrator guidance and earlier packet research notes, not production wave helpers. I’m drilling into the current reducer/lineage helpers now so I can tell whether Phase 3 should extend existing state machinery or introduce a second coordination system.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/scripts/lib | rg "deep|review|research|lineage|registry|dashboard|conver|segment|wave|coverage|graph"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg -n \"registry|dashboard|lineage|convergence|segment|resume|merge|dedup|conflict\" .opencode/skill/system-spec-kit/scripts/lib .opencode/skill/system-spec-kit/scripts/tests | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:3:// Phase 004 CHK-021, CHK-042: Path fragments, short tokens, shingle dedup.
.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:71:    { name: 'resume', file: 'resume.md' },
.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:103:    'spec_kit_resume_auto.yaml',
.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:104:    'spec_kit_resume_confirm.yaml',
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:17:  deduplicateSubstrings,
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:269:  const deduplicated = deduplicateSubstrings(allCandidates);
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:270:  const techFiltered = filterTechStopWords(deduplicated);
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:278:  if (topPhrases.length < minPhraseCount && deduplicated.length > 0) {
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:279:    return deduplicated
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:298:  const deduplicated = deduplicateSubstrings(scoredCandidates);
.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:300:  return deduplicated
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:12:} from '../../mcp_server/handlers/session-resume.js';
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:264:      memory: { resumed: true },
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:286:          text: JSON.stringify({ status: 'ok', data: { resumed: true } }),
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:339:          '- Memory: startup summary only (resume on demand)',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:348:    const { handleSessionResume } = await import('../../mcp_server/handlers/session-resume.js');
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:386:        const resumeDecision = cachedResume.cachedSummary as { status?: string } | undefined;
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:389:        expect(resumeDecision?.status, `${scenario.name}:resume`).toBe(scenario.expectedDecision);
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:398:          expect(cachedResumePasses, `${scenario.name}:resume-pass-count`).toBeGreaterThanOrEqual(liveResumePasses + 1);
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:402:          expect(cachedResumePasses, `${scenario.name}:resume-pass-count`).toBe(liveResumePasses);
.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:13:  it('keeps the dashboard title free of filename suffix garbage', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:53:      expect(content, `${docPath} should mention the findings registry`).toContain('findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:65:      expect(content, `${docPath} should read the findings registry`).toContain('research/findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:78:      expect(content, `${docPath} should write the findings registry`).toContain('findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:42:      expect(content, `${docPath} should mention the findings registry`).toContain('deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:54:      expect(content, `${docPath} should mention the reducer-owned registry`).toContain('review/deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:56:      expect(content, `${docPath} should mention lineageMode`).toContain('lineageMode');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:74:      expect(content, `${docPath} should expose lifecycle mode input`).toContain('lineage_mode');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:77:      expect(content, `${docPath} should write the findings registry`).toContain('review/deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:105:    expect(confirmContent).toContain('options: [resume, restart, fork, completed-continue]');
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:10:  'memory dashboard',
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:54:    .flatMap((segment) => segment.replace(/^\d+--?/, '').split(/[-_]/))
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:171:    session_dedup: {
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:173:      dedup_savings_tokens: 144,
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:272:  // Covers: F-12 (Return empty decisions for null input; merge manual + observation decisions)
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:403:    expect(content).toContain('session_dedup:');
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:404:    expect(content).toContain('dedup_savings_tokens: 144');
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:470:  it.skip('resolves a multi-segment child path without prefix via basename fallback', async () => {
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:476:    // Multi-segment path without .opencode/specs/ prefix -- skips category prefix
.opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js:114:  const deduped = [];
.opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js:119:    deduped.push(item);
.opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js:122:  return deduped;
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:46:        stages: ['dedupe'],
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:54:      dedupe: {
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:71:    expect(pipeline.deduplicate([
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:262:function dedupeStrings(values: string[]): string[] {
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:712:    const segments = normalized.split('/').filter(Boolean);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:713:    const memoryIndex = segments.indexOf('memory');
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:716:      ? segments[memoryIndex - 1]
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:854:    return dedupeStrings(
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:862:    return dedupeStrings(
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:994:  const deduped = dedupeStrings(
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1000:  if (deduped.length === 0) {
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1004:  return deduped.slice(0, 8);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1220:    : ['memory dashboard', 'session summary', 'context template'];
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:18:    registry: {
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:27:    dashboardPath: string;
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:28:    registryPath: string;
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:49:        convergenceThreshold: 0.05,
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:53:        lineage: {
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:56:          lineageMode: 'resume',
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:69:      '{"type":"config","topic":"Reducer fixture topic","maxIterations":5,"convergenceThreshold":0.05,"createdAt":"2026-04-03T00:00:00Z","specFolder":"fixture"}',
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:71:      '{"type":"iteration","run":2,"status":"insight","focus":"Second pass","findingsCount":2,"newInfoRatio":0.4,"answeredQuestions":["Question B"],"keyQuestions":["Question B","Question C"],"sourcesQueried":["https://example.com/two","memory:previous-run"],"toolsUsed":["Read","Grep"],"convergenceSignals":{"compositeStop":0.61},"timestamp":"2026-04-03T00:10:00Z","durationMs":1200}',
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:207:- What worked and why: The second pass confirmed the lineage edge with a direct source.
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:209:- What I would do differently: Move directly to the unresolved question once the registry is stable.
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:226:  it('writes idempotent registry, strategy, and dashboard outputs from iteration state', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:230:    const firstRegistry = fs.readFileSync(firstRun.registryPath, 'utf8');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:232:    const firstDashboard = fs.readFileSync(firstRun.dashboardPath, 'utf8');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:235:    const secondRegistry = fs.readFileSync(secondRun.registryPath, 'utf8');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:237:    const secondDashboard = fs.readFileSync(secondRun.dashboardPath, 'utf8');
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:239:    expect(firstRun.registry.metrics.iterationsCompleted).toBe(2);
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:240:    expect(firstRun.registry.metrics.resolvedQuestions).toBe(2);
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:241:    expect(firstRun.registry.metrics.openQuestions).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:242:    expect(firstRun.registry.metrics.keyFindings).toBe(4);
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:257:    expect(firstDashboard).toContain('convergenceScore: 0.61');
.opencode/skill/system-spec-kit/scripts/tests/test-bug-regressions.js:140:  // Check 3: The resume keywords regex uses normalizedInput
.opencode/skill/system-spec-kit/scripts/tests/test-bug-regressions.js:141:  const resumeRegex = findInFile(source, /resume|continue|pick up|where was i/);
.opencode/skill/system-spec-kit/scripts/tests/test-bug-regressions.js:142:  if (resumeRegex.length > 0) {
.opencode/skill/system-spec-kit/scripts/tests/test-bug-regressions.js:143:    const line = resumeRegex[0];
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:66:  it('T2-A: detects /memory/ segment', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:103:  it('T4-A: file with 199 tokens is marked merged-into-parent', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:106:    expect(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:107:    expect(result.stats.mergedCount).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:110:  it('T4-B: file with exactly 200 tokens is NOT merged (boundary: < 200)', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:113:    // 200 tokens >= mergeThreshold(200), so falls into content-as-summary range
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:117:  it('T4-C: file with 1 token is merged', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:120:    expect(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:123:  it('T4-D: merged files produce a MergedFileEntry per parent directory', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:129:    expect(result.merged).toHaveLength(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:130:    expect(result.merged[0].childPaths).toHaveLength(2);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:139:    expect(result.merged).toHaveLength(2);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:140:    const parents = result.merged.map((m) => m.parentPath).sort();
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:168:    expect(result.stats.mergedCount).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:183:  it('T6-B: memory file with exactly 100 tokens is merged-into-parent (boundary: >= 100, < 150)', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:186:    expect(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:189:  it('T6-C: memory file with 149 tokens is merged-into-parent', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:192:    expect(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:208:    // Non-memory file with 99 tokens must be merged (< 200), not content-as-summary
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:211:    expect(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:216:   T7: No content loss during merge
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:219:describe('No content loss during merge', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:220:  it('T7-A: merged summary contains all child content', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:223:    // Force merge by using very short content (< 200 tokens)
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:227:    expect(result.merged).toHaveLength(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:228:    const mergedSummary = result.merged[0].mergedSummary;
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:229:    expect(mergedSummary).toContain('UNIQUE_CONTENT_A');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:230:    expect(mergedSummary).toContain('UNIQUE_CONTENT_B');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:233:  it('T7-B: merged summary contains source path references', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:238:    expect(result.merged[0].mergedSummary).toContain('specs/001/tiny.md');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:264:    expect(result.merged).toHaveLength(0);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:267:    expect(result.stats.mergedCount).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:289:      specFile('merged.md', 100),    // merged-into-parent
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:295:    expect(result.stats.mergedCount).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:344:      mergeThreshold: 50,
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:359:      specFile('small.md', 50),  // will be merged, not passed to Stage 1
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:378:      specFile('spec.md', 150),      // 150 < 200 → merged-into-parent
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:379:      memFile('ctx.md', 149),        // 100 <= 149 < 150 → merged-into-parent (memory)
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:387:    expect(actionMap['spec.md']).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:388:    expect(actionMap['ctx.md']).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:394:    expect(DEFAULT_THINNING_CONFIG.mergeThreshold).toBe(200);
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:126:  const segments = normalized.split('/').filter(Boolean);
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:129:  for (const segment of segments) {
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:130:    tokens.add(segment);
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:131:    tokens.add(segment.replace(/^\d+[-_]?/, ''));
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:133:    for (const token of segment.replace(/^\d+[-_]?/, '').split(/[^a-z0-9]+/)) {
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:185:  it('extracts trigger phrases from merged specs that embed a second frontmatter block', async () => {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:46:  dedupe: {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:99:  deduplicate(prompts: PromptItem[]): PromptItem[];
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:181:      stages: ['noise', 'dedupe', 'quality'],
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:189:    dedupe: {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:214:      // Deep merge: per-section merge preserves default properties not in user config
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:215:      const merged: Record<string, unknown> = { ...defaultConfig };
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:216:      for (const key of Object.keys(merged)) {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:221:          merged[key] = { ...(defaultVal as Record<string, unknown>), ...(userVal as Record<string, unknown>) };
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:223:          const mergedSection = merged[key] as Record<string, unknown>;
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:226:          for (const sub of Object.keys(mergedSection)) {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:229:              mergedSection[sub] = { ...(defaultSection[sub] as Record<string, unknown>), ...(userSection[sub] as Record<string, unknown>) };
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:233:          merged[key] = userVal;
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:238:      // The merge loop preserves defaultConfig's structure for every section.
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:239:      const mergedNoise = merged.noise as FilterConfig['noise'];
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:241:        pipeline: merged.pipeline as FilterConfig['pipeline'],
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:243:          ...mergedNoise,
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:244:          patterns: compileNoisePatterns(mergedNoise.patterns),
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:246:        dedupe: merged.dedupe as FilterConfig['dedupe'],
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:247:        quality: merged.quality as FilterConfig['quality'],
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:373:/** MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps) */
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:384:/** MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps) */
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:482:  // F-23 — Deep merge to preserve nested defaults (e.g., pipeline.stages).
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:498:    dedupe: {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:499:      ...defaults.dedupe,
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:500:      ...(customConfig.dedupe || {}),
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:530:      if (config.pipeline.stages.includes('dedupe') && config.dedupe?.enabled !== false) {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:531:        filtered = this.deduplicate(filtered);
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:603:    deduplicate(prompts: PromptItem[]): PromptItem[] {
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:611:        const hash: string = generateContentHash(content, config.dedupe?.hashLength || 200);
.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:622:          if (calculateSimilarity(content, prevContent) >= (config.dedupe?.similarityThreshold || 0.70)) {
.opencode/skill/system-spec-kit/scripts/lib/cli-capture-shared.ts:12:// Created as part of CODEX2-006 deduplication.
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:50:    (0, vitest_1.it)('T2-A: detects /memory/ segment', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:79:    (0, vitest_1.it)('T4-A: file with 199 tokens is marked merged-into-parent', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:82:        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:83:        (0, vitest_1.expect)(result.stats.mergedCount).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:85:    (0, vitest_1.it)('T4-B: file with exactly 200 tokens is NOT merged (boundary: < 200)', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:88:        // 200 tokens >= mergeThreshold(200), so falls into content-as-summary range
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:91:    (0, vitest_1.it)('T4-C: file with 1 token is merged', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:94:        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:96:    (0, vitest_1.it)('T4-D: merged files produce a MergedFileEntry per parent directory', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:102:        (0, vitest_1.expect)(result.merged).toHaveLength(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:103:        (0, vitest_1.expect)(result.merged[0].childPaths).toHaveLength(2);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:111:        (0, vitest_1.expect)(result.merged).toHaveLength(2);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:112:        const parents = result.merged.map((m) => m.parentPath).sort();
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:136:        (0, vitest_1.expect)(result.stats.mergedCount).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:148:    (0, vitest_1.it)('T6-B: memory file with exactly 100 tokens is merged-into-parent (boundary: >= 100, < 300)', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:151:        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:153:    (0, vitest_1.it)('T6-C: memory file with 299 tokens is merged-into-parent', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:156:        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:169:        // Non-memory file with 99 tokens must be merged (< 200), not content-as-summary
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:172:        (0, vitest_1.expect)(result.thinned[0].action).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:176:   T7: No content loss during merge
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:178:(0, vitest_1.describe)('No content loss during merge', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:179:    (0, vitest_1.it)('T7-A: merged summary contains all child content', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:182:        // Force merge by using very short content (< 200 tokens)
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:185:        (0, vitest_1.expect)(result.merged).toHaveLength(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:186:        const mergedSummary = result.merged[0].mergedSummary;
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:187:        (0, vitest_1.expect)(mergedSummary).toContain('UNIQUE_CONTENT_A');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:188:        (0, vitest_1.expect)(mergedSummary).toContain('UNIQUE_CONTENT_B');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:190:    (0, vitest_1.it)('T7-B: merged summary contains source path references', () => {
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:195:        (0, vitest_1.expect)(result.merged[0].mergedSummary).toContain('specs/001/tiny.md');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:218:        (0, vitest_1.expect)(result.merged).toHaveLength(0);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:221:        (0, vitest_1.expect)(result.stats.mergedCount).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:240:            specFile('merged.md', 100), // merged-into-parent
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:246:        (0, vitest_1.expect)(result.stats.mergedCount).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:289:            mergeThreshold: 50,
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:303:            specFile('small.md', 50), // will be merged, not passed to Stage 1
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:320:            specFile('spec.md', 150), // 150 < 200 → merged-into-parent
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:321:            memFile('ctx.md', 150), // 100 <= 150 < 300 → merged-into-parent (memory)
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:327:        (0, vitest_1.expect)(actionMap['spec.md']).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:328:        (0, vitest_1.expect)(actionMap['ctx.md']).toBe('merged-into-parent');
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:333:        (0, vitest_1.expect)(tree_thinning_1.DEFAULT_THINNING_CONFIG.mergeThreshold).toBe(200);
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:58:  // T-FMB-002: Unknown frontmatter keys are preserved during merge.
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:70:      fail('T-FMB-002: Unknown keys preserved', 'custom_meta missing after merge');
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:78:    const longTitle = '# This is an intentionally very long heading designed to exceed the normal dashboard title width for suffix retention tests\n\nBody.';
.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:119:function mergeVectors(target: WeightedVector, source: WeightedVector): WeightedVector {
.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:120:  const merged = new Map(target);
.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:122:    merged.set(key, (merged.get(key) ?? 0) + value);
.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:124:  return merged;
.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:484:      currentCluster.vector = mergeVectors(currentCluster.vector, exchange.signals.vector);
.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:485:      currentCluster.semanticVector = mergeVectors(currentCluster.semanticVector, exchange.signals.semanticVector);
.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts:48:  it('keeps non-contiguous phase returns as separate timeline segments', () => {
.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts:134:  it('merges the phase-parent addendum into spec contracts for phase parent folders', () => {
.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts:149:  it('merges the phase-child addendum into spec contracts for child phase folders', () => {
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer.vitest.ts:44:  it('deduplicates and preserves only kept phrases in wrapper output', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:241:    merged: [],
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:242:    stats: { totalFiles: 0, thinnedCount: 0, mergedCount: 0, tokensSaved: 0 },
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:5:describe('distinguishing evidence deduplication', () => {
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:6:  it('deduplicates repeated bullets and prefers file-line anchored evidence', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:184:  it.skip('F002.2 deduplicates proposition restatement across outcomes, decision titles, and fallback rationale while preserving authored rationale', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:228:  it.skip('F003.1 keeps one FILES row per path while moving verbose merged provenance into audit metadata', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:239:      merged_sources?: string[];
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:245:    expect((carrier.DESCRIPTION.match(/merged from/gi) ?? []).length).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:246:    expect(carrier.merged_sources).toEqual(fixture.expectedMergedSources);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:256:    const resumeContext = generateResumeContext([], [], fixture.observations as Observation[]);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:257:    const lastItem = resumeContext.find((item) => item.CONTEXT_ITEM.startsWith('Last: '));
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:19:    id: 'resume-structural-graph-ready',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:28:      continuationState: 'resume_ready',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:121:      continuationState: 'resume_ready',
.opencode/skill/system-spec-kit/scripts/tests/test-naming-migration.js:81:  ['mcp_server/lib/storage/lineage-state.ts', 12],
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:309:        sessionSummary: 'Continuation saves should carry supersedes lineage.',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:246:      expect(frontmatter).not.toContain('memory dashboard');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:436:      expect(rendered).not.toContain('memory dashboard');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:124:    // Test 2: CONFIG includes merged runtime numeric values
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:707:    if (pipeline.filter && pipeline.filterNoise && pipeline.deduplicate) {
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2223:    const longPath = '/root/very/long/path/with/many/segments/to/file.js';
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:755:    const dedupedManualResult = await extractDecisions({
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:776:    assertEqual(dedupedManualResult.DECISION_COUNT, 1, 'EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:824:    // Test file deduplication
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:831:    const dedupedFiles = extractFilesFromData(dupData, []);
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:832:    assertEqual(dedupedFiles.length, 1, 'EXT-File-016: Duplicate files deduplicated');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:841:    assertEqual(normalizedDedupedFiles.length, 1, 'EXT-File-016b: Normalized path-equivalent files deduplicated');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1032:      pass('EXT-Conv-023: Non-contiguous phases remain separate segments', iterativeConversation.PHASES.map((phase) => phase.PHASE_NAME).join(' -> '));
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1034:      fail('EXT-Conv-023: Non-contiguous phases remain separate segments', JSON.stringify(iterativeConversation.PHASES));
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1089:    // Test deduplication
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1094:    const dedupedBuilt = extractWhatBuilt(dupObs);
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1095:    assertEqual(dedupedBuilt.length, 1, 'EXT-Impl-016: Duplicate features deduplicated');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:35:      'dashboardMetrics',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:46:    expect(contract.contract.outputs.findingsRegistry.pathPattern).toContain('deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:52:    expect(config.reducer.outputs).toEqual(['findingsRegistry', 'dashboardMetrics', 'strategyUpdates']);
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:58:      'convergenceScore',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:60:    expect(config.fileProtection['deep-review-findings-registry.json']).toBe('auto-generated');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:76:      expect(content, `${docPath} workflow should read the findings registry`).toContain(
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:77:        '"{spec_folder}/review/deep-review-findings-registry.json"',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:79:      expect(content, `${docPath} workflow should write the findings registry`).toContain(
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:80:        'write: "{spec_folder}/review/deep-review-findings-registry.json"',
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:95:    const convergence = readWorkspaceFile('.opencode/skill/sk-deep-review/references/convergence.md');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:97:    expect(stateFormat).toContain('deep-review-findings-registry.json');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:99:    expect(stateFormat).toContain('convergenceScore');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:103:    expect(loopProtocol).toContain('dashboardMetrics');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:107:    expect(convergence).toContain('release-blocking');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:108:    expect(convergence).toContain('converged');
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:109:    expect(convergence).toContain('in-progress');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import os from 'node:os';
     3	import path from 'node:path';
     4	import { createRequire } from 'node:module';
     5	import { fileURLToPath } from 'node:url';
     6	
     7	import { afterEach, describe, expect, it } from 'vitest';
     8	
     9	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
    10	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    11	const require = createRequire(import.meta.url);
    12	
    13	const reducerModule = require(path.join(
    14	  WORKSPACE_ROOT,
    15	  '.opencode/skill/sk-deep-research/scripts/reduce-state.cjs',
    16	)) as {
    17	  reduceResearchState: (specFolder: string, options?: { write?: boolean }) => {
    18	    registry: {
    19	      metrics: {
    20	        iterationsCompleted: number;
    21	        openQuestions: number;
    22	        resolvedQuestions: number;
    23	        keyFindings: number;
    24	      };
    25	    };
    26	    strategyPath: string;
    27	    dashboardPath: string;
    28	    registryPath: string;
    29	  };
    30	};
    31	
    32	const tempDirs: string[] = [];
    33	
    34	function writeFile(filePath: string, content: string): void {
    35	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    36	  fs.writeFileSync(filePath, content, 'utf8');
    37	}
    38	
    39	function makeFixtureSpecFolder(): string {
    40	  const specFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'deep-research-reducer-'));
    41	  tempDirs.push(specFolder);
    42	
    43	  writeFile(
    44	    path.join(specFolder, 'research', 'deep-research-config.json'),
    45	    `${JSON.stringify(
    46	      {
    47	        topic: 'Reducer fixture topic',
    48	        maxIterations: 5,
    49	        convergenceThreshold: 0.05,
    50	        progressiveSynthesis: true,
    51	        createdAt: '2026-04-03T00:00:00Z',
    52	        status: 'running',
    53	        lineage: {
    54	          sessionId: 'session-001',
    55	          parentSessionId: null,
    56	          lineageMode: 'resume',
    57	          generation: 2,
    58	          continuedFromRun: 1,
    59	        },
    60	      },
    61	      null,
    62	      2,
    63	    )}\n`,
    64	  );
    65	
    66	  writeFile(
    67	    path.join(specFolder, 'research', 'deep-research-state.jsonl'),
    68	    [
    69	      '{"type":"config","topic":"Reducer fixture topic","maxIterations":5,"convergenceThreshold":0.05,"createdAt":"2026-04-03T00:00:00Z","specFolder":"fixture"}',
    70	      '{"type":"iteration","run":1,"status":"complete","focus":"First pass","findingsCount":2,"newInfoRatio":0.8,"answeredQuestions":["Question A"],"keyQuestions":["Question A","Question B"],"sourcesQueried":["https://example.com/one","src/feature.ts:10"],"toolsUsed":["Read","WebFetch"],"timestamp":"2026-04-03T00:05:00Z","durationMs":1000}',
    71	      '{"type":"iteration","run":2,"status":"insight","focus":"Second pass","findingsCount":2,"newInfoRatio":0.4,"answeredQuestions":["Question B"],"keyQuestions":["Question B","Question C"],"sourcesQueried":["https://example.com/two","memory:previous-run"],"toolsUsed":["Read","Grep"],"convergenceSignals":{"compositeStop":0.61},"timestamp":"2026-04-03T00:10:00Z","durationMs":1200}',
    72	      '',
    73	    ].join('\n'),
    74	  );
    75	
    76	  writeFile(
    77	    path.join(specFolder, 'research', 'deep-research-strategy.md'),
    78	    `---
    79	title: Fixture Strategy
    80	description: reducer fixture
    81	---
    82	
    83	# Deep Research Strategy - Session Tracking Template
    84	
    85	<!-- ANCHOR:overview -->
    86	## 1. OVERVIEW
    87	Fixture overview
    88	<!-- /ANCHOR:overview -->
    89	<!-- ANCHOR:topic -->
    90	## 2. TOPIC
    91	Reducer fixture topic
    92	<!-- /ANCHOR:topic -->
    93	<!-- ANCHOR:key-questions -->
    94	## 3. KEY QUESTIONS (remaining)
    95	- [ ] Question A
    96	- [ ] Question B
    97	- [ ] Question C
    98	<!-- /ANCHOR:key-questions -->
    99	<!-- ANCHOR:non-goals -->
   100	## 4. NON-GOALS
   101	None
   102	<!-- /ANCHOR:non-goals -->
   103	<!-- ANCHOR:stop-conditions -->
   104	## 5. STOP CONDITIONS
   105	Stop when enough evidence exists
   106	<!-- /ANCHOR:stop-conditions -->
   107	<!-- ANCHOR:answered-questions -->
   108	## 6. ANSWERED QUESTIONS
   109	[None yet]
   110	<!-- /ANCHOR:answered-questions -->
   111	<!-- MACHINE-OWNED: START -->
   112	<!-- ANCHOR:what-worked -->
   113	## 7. WHAT WORKED
   114	[None yet]
   115	<!-- /ANCHOR:what-worked -->
   116	<!-- ANCHOR:what-failed -->
   117	## 8. WHAT FAILED
   118	[None yet]
   119	<!-- /ANCHOR:what-failed -->
   120	<!-- ANCHOR:exhausted-approaches -->
   121	## 9. EXHAUSTED APPROACHES (do not retry)
   122	[None yet]
   123	<!-- /ANCHOR:exhausted-approaches -->
   124	<!-- ANCHOR:ruled-out-directions -->
   125	## 10. RULED OUT DIRECTIONS
   126	[None yet]
   127	<!-- /ANCHOR:ruled-out-directions -->
   128	<!-- ANCHOR:next-focus -->
   129	## 11. NEXT FOCUS
   130	[None yet]
   131	<!-- /ANCHOR:next-focus -->
   132	<!-- MACHINE-OWNED: END -->
   133	<!-- ANCHOR:known-context -->
   134	## 12. KNOWN CONTEXT
   135	Known context
   136	<!-- /ANCHOR:known-context -->
   137	<!-- ANCHOR:research-boundaries -->
   138	## 13. RESEARCH BOUNDARIES
   139	- Boundaries
   140	<!-- /ANCHOR:research-boundaries -->
   141	`,
   142	  );
   143	
   144	  writeFile(
   145	    path.join(specFolder, 'research', 'iterations', 'iteration-001.md'),
   146	    `# Iteration 1: First pass
   147	
   148	## Focus
   149	Survey the first research angle.
   150	
   151	## Findings
   152	1. Finding one from the first pass.
   153	2. Finding two from the first pass.
   154	
   155	## Ruled Out
   156	- Retrying the same endpoint without new instrumentation.
   157	
   158	## Dead Ends
   159	- Browser-only profiling for this server-side problem.
   160	
   161	## Sources Consulted
   162	- https://example.com/one
   163	- src/feature.ts:10
   164	
   165	## Assessment
   166	- New information ratio: 0.8
   167	- Questions addressed: Question A
   168	- Questions answered: Question A
   169	
   170	## Reflection
   171	- What worked and why: Broad source comparison revealed the first stable answer.
   172	- What did not work and why: Single-source assumptions missed the implementation detail.
   173	- What I would do differently: Start with mixed code and docs evidence earlier.
   174	
   175	## Recommended Next Focus
   176	Question C
   177	`,
   178	  );
   179	
   180	  writeFile(
   181	    path.join(specFolder, 'research', 'iterations', 'iteration-002.md'),
   182	    `# Iteration 2: Second pass
   183	
   184	## Focus
   185	Refine the remaining uncertainty.
   186	
   187	## Findings
   188	1. Finding three from the second pass.
   189	2. Finding four from the second pass.
   190	
   191	## Ruled Out
   192	- Re-reading the same migration note without new packet evidence.
   193	
   194	## Dead Ends
   195	- Browser-only profiling for this server-side problem.
   196	
   197	## Sources Consulted
   198	- https://example.com/two
   199	- memory:previous-run
   200	
   201	## Assessment
   202	- New information ratio: 0.4
   203	- Questions addressed: Question B
   204	- Questions answered: Question B
   205	
   206	## Reflection
   207	- What worked and why: The second pass confirmed the lineage edge with a direct source.
   208	- What did not work and why: Repeating weak evidence added no new confidence.
   209	- What I would do differently: Move directly to the unresolved question once the registry is stable.
   210	
   211	## Recommended Next Focus
   212	Question C
   213	`,
   214	  );
   215	
   216	  return specFolder;
   217	}
   218	
   219	afterEach(() => {
   220	  while (tempDirs.length) {
   221	    fs.rmSync(tempDirs.pop() as string, { recursive: true, force: true });
   222	  }
   223	});
   224	
   225	describe('deep-research reducer', () => {
   226	  it('writes idempotent registry, strategy, and dashboard outputs from iteration state', () => {
   227	    const specFolder = makeFixtureSpecFolder();
   228	
   229	    const firstRun = reducerModule.reduceResearchState(specFolder, { write: true });
   230	    const firstRegistry = fs.readFileSync(firstRun.registryPath, 'utf8');
   231	    const firstStrategy = fs.readFileSync(firstRun.strategyPath, 'utf8');
   232	    const firstDashboard = fs.readFileSync(firstRun.dashboardPath, 'utf8');
   233	
   234	    const secondRun = reducerModule.reduceResearchState(specFolder, { write: true });
   235	    const secondRegistry = fs.readFileSync(secondRun.registryPath, 'utf8');
   236	    const secondStrategy = fs.readFileSync(secondRun.strategyPath, 'utf8');
   237	    const secondDashboard = fs.readFileSync(secondRun.dashboardPath, 'utf8');
   238	
   239	    expect(firstRun.registry.metrics.iterationsCompleted).toBe(2);
   240	    expect(firstRun.registry.metrics.resolvedQuestions).toBe(2);
   241	    expect(firstRun.registry.metrics.openQuestions).toBe(1);
   242	    expect(firstRun.registry.metrics.keyFindings).toBe(4);
   243	
   244	    expect(firstRegistry).toBe(secondRegistry);
   245	    expect(firstStrategy).toBe(secondStrategy);
   246	    expect(firstDashboard).toBe(secondDashboard);
   247	
   248	    expect(firstStrategy).toContain('- [x] Question A');
   249	    expect(firstStrategy).toContain('- [x] Question B');
   250	    expect(firstStrategy).toContain('- [ ] Question C');
   251	    expect(firstStrategy).toContain('## 7. WHAT WORKED');
   252	    expect(firstStrategy).toContain('Broad source comparison revealed the first stable answer.');
   253	    expect(firstStrategy).toContain('## 10. RULED OUT DIRECTIONS');
   254	    expect(firstStrategy).toContain('Browser-only profiling for this server-side problem.');
   255	
   256	    expect(firstDashboard).toContain('Session ID: session-001');
   257	    expect(firstDashboard).toContain('convergenceScore: 0.61');
   258	    expect(firstDashboard).toContain('Question C');
   259	  });
   260	});

exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/scripts | rg "deep-research|deep-review|reducer|registry|dashboard|lineage-state"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts
.opencode/skill/system-spec-kit/scripts/scripts-registry.json
.opencode/skill/system-spec-kit/scripts/registry-loader.sh
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/memory/06-04-26_12-05__deep-research-run-8.md

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { fileURLToPath } from 'node:url';
     4	
     5	import yaml from 'js-yaml';
     6	import { describe, expect, it } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    10	
    11	function readWorkspaceFile(relativePath: string): string {
    12	  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
    13	}
    14	
    15	describe('deep-review reducer and schema contract', () => {
    16	  it('keeps reducer, severity, and release-readiness schemas stable in the canonical assets', () => {
    17	    const contract = yaml.load(
    18	      readWorkspaceFile('.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml'),
    19	    ) as Record<string, any>;
    20	    const config = JSON.parse(
    21	      readWorkspaceFile('.opencode/skill/sk-deep-review/assets/deep_review_config.json'),
    22	    ) as Record<string, any>;
    23	
    24	    expect(contract.contract.severities.map((item: { id: string }) => item.id)).toEqual(['P0', 'P1', 'P2']);
    25	    expect(contract.contract.severities.map((item: { weight: number }) => item.weight)).toEqual([10, 5, 1]);
    26	
    27	    expect(contract.contract.reducer.enabled).toBe(true);
    28	    expect(contract.contract.reducer.inputs).toEqual([
    29	      'latestJSONLDelta',
    30	      'newIterationFile',
    31	      'priorReducedState',
    32	    ]);
    33	    expect(contract.contract.reducer.outputs).toEqual([
    34	      'findingsRegistry',
    35	      'dashboardMetrics',
    36	      'strategyUpdates',
    37	    ]);
    38	    expect(contract.contract.reducer.idempotent).toBe(true);
    39	
    40	    expect(contract.contract.releaseReadinessStates.map((item: { id: string }) => item.id)).toEqual([
    41	      'in-progress',
    42	      'converged',
    43	      'release-blocking',
    44	    ]);
    45	    expect(contract.contract.outputs.config.pathPattern).toContain('deep-review-config.json');
    46	    expect(contract.contract.outputs.findingsRegistry.pathPattern).toContain('deep-review-findings-registry.json');
    47	    expect(contract.contract.outputs.pauseSentinel.pathPattern).toContain('.deep-review-pause');
    48	    expect(contract.contract.outputs.jsonl.pathPattern).toContain('deep-review-state.jsonl');
    49	
    50	    expect(config.releaseReadinessState).toBe('in-progress');
    51	    expect(config.reducer.inputs).toEqual(['latestJSONLDelta', 'newIterationFile', 'priorReducedState']);
    52	    expect(config.reducer.outputs).toEqual(['findingsRegistry', 'dashboardMetrics', 'strategyUpdates']);
    53	    expect(config.reducer.metrics).toEqual([
    54	      'dimensionsCovered',
    55	      'findingsBySeverity',
    56	      'openFindings',
    57	      'resolvedFindings',
    58	      'convergenceScore',
    59	    ]);
    60	    expect(config.fileProtection['deep-review-findings-registry.json']).toBe('auto-generated');
    61	    expect(config.fileProtection['.deep-review-pause']).toBe('operator-controlled');
    62	  });
    63	
    64	  it('wires reducer refresh and machine-owned report guidance into both review workflows', () => {
    65	    const autoYaml = readWorkspaceFile('.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml');
    66	    const confirmYaml = readWorkspaceFile('.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml');
    67	
    68	    for (const [docPath, content] of [
    69	      ['auto', autoYaml],
    70	      ['confirm', confirmYaml],
    71	    ] as const) {
    72	      expect(content, `${docPath} workflow should include reducer refresh step`).toContain('step_reduce_review_state:');
    73	      expect(content, `${docPath} workflow should read the canonical state log`).toContain(
    74	        '"{spec_folder}/review/deep-review-state.jsonl"',
    75	      );
    76	      expect(content, `${docPath} workflow should read the findings registry`).toContain(
    77	        '"{spec_folder}/review/deep-review-findings-registry.json"',
    78	      );
    79	      expect(content, `${docPath} workflow should write the findings registry`).toContain(
    80	        'write: "{spec_folder}/review/deep-review-findings-registry.json"',
    81	      );
    82	      expect(content, `${docPath} workflow should treat reducer reruns as idempotent`).toContain('idempotent');
    83	      expect(content, `${docPath} workflow should carry release readiness through synthesis`).toContain(
    84	        'releaseReadinessState',
    85	      );
    86	      expect(content, `${docPath} workflow should preserve machine-owned report markers`).toContain(
    87	        'Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.',
    88	      );
    89	    }
    90	  });
    91	
    92	  it('documents reducer metrics and machine-owned report boundaries in the review references', () => {
    93	    const stateFormat = readWorkspaceFile('.opencode/skill/sk-deep-review/references/state_format.md');
    94	    const loopProtocol = readWorkspaceFile('.opencode/skill/sk-deep-review/references/loop_protocol.md');
    95	    const convergence = readWorkspaceFile('.opencode/skill/sk-deep-review/references/convergence.md');
    96	
    97	    expect(stateFormat).toContain('deep-review-findings-registry.json');
    98	    expect(stateFormat).toContain('releaseReadinessState');
    99	    expect(stateFormat).toContain('convergenceScore');
   100	    expect(stateFormat).toContain('review-report-v*.md');
   101	
   102	    expect(loopProtocol).toContain('latestJSONLDelta');
   103	    expect(loopProtocol).toContain('dashboardMetrics');
   104	    expect(loopProtocol).toContain('strategyUpdates');
   105	    expect(loopProtocol).toContain('completed-continue');
   106	
   107	    expect(convergence).toContain('release-blocking');
   108	    expect(convergence).toContain('converged');
   109	    expect(convergence).toContain('in-progress');
   110	  });
   111	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/assets/deep_review_config.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "topic": "",
     3	  "sessionId": "",
     4	  "parentSessionId": null,
     5	  "lineageMode": "new",
     6	  "generation": 1,
     7	  "continuedFromRun": null,
     8	  "migrationWindowEndsAt": "",
     9	  "maxIterations": 7,
    10	  "convergenceThreshold": 0.10,
    11	  "stuckThreshold": 2,
    12	  "maxDurationMinutes": 120,
    13	  "maxToolCallsPerIteration": 12,
    14	  "maxMinutesPerIteration": 10,
    15	  "progressiveSynthesis": false,
    16	  "specFolder": "",
    17	  "createdAt": "",
    18	  "status": "initialized",
    19	  "releaseReadinessState": "in-progress",
    20	  "executionMode": "auto",
    21	  "mode": "review",
    22	  "reviewTarget": "",
    23	  "reviewTargetType": "spec-folder",
    24	  "reviewDimensions": [
    25	    "correctness",
    26	    "security",
    27	    "traceability",
    28	    "maintainability"
    29	  ],
    30	  "severityThreshold": "P2",
    31	  "crossReference": {
    32	    "core": [
    33	      "spec_code",
    34	      "checklist_evidence"
    35	    ],
    36	    "overlay": [
    37	      "skill_agent",
    38	      "agent_cross_runtime",
    39	      "feature_catalog_code",
    40	      "playbook_capability"
    41	    ]
    42	  },
    43	  "qualityGateThreshold": true,
    44	  "fileProtection": {
    45	    "deep-review-config.json": "immutable",
    46	    "deep-review-state.jsonl": "append-only",
    47	    "deep-review-findings-registry.json": "auto-generated",
    48	    "deep-review-strategy.md": "mutable",
    49	    "deep-review-dashboard.md": "auto-generated",
    50	    ".deep-review-pause": "operator-controlled",
    51	    "review-report.md": "mutable",
    52	    "review-report-v*.md": "write-once",
    53	    "iteration-*.md": "write-once"
    54	  },
    55	  "reducer": {
    56	    "enabled": true,
    57	    "inputs": [
    58	      "latestJSONLDelta",
    59	      "newIterationFile",
    60	      "priorReducedState"
    61	    ],
    62	    "outputs": [
    63	      "findingsRegistry",
    64	      "dashboardMetrics",
    65	      "strategyUpdates"
    66	    ],
    67	    "metrics": [
    68	      "dimensionsCovered",
    69	      "findingsBySeverity",
    70	      "openFindings",
    71	      "resolvedFindings",
    72	      "convergenceScore"
    73	    ]
    74	  }
    75	}

 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Deep Research State Reducer                                              ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	
     5	'use strict';
     6	
     7	// ─────────────────────────────────────────────────────────────────────────────
     8	// 1. IMPORTS
     9	// ─────────────────────────────────────────────────────────────────────────────
    10	
    11	const fs = require('node:fs');
    12	const path = require('node:path');
    13	
    14	// ─────────────────────────────────────────────────────────────────────────────
    15	// 2. HELPERS
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	
    18	function readUtf8(filePath) {
    19	  return fs.readFileSync(filePath, 'utf8');
    20	}
    21	
    22	function writeUtf8(filePath, content) {
    23	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    24	  fs.writeFileSync(filePath, content, 'utf8');
    25	}
    26	
    27	function readJson(filePath) {
    28	  return JSON.parse(readUtf8(filePath));
    29	}
    30	
    31	function slugify(value) {
    32	  return value
    33	    .toLowerCase()
    34	    .replace(/[^a-z0-9]+/g, '-')
    35	    .replace(/^-+|-+$/g, '')
    36	    .slice(0, 80) || 'entry';
    37	}
    38	
    39	function normalizeText(value) {
    40	  return value.replace(/\s+/g, ' ').trim();
    41	}
    42	
    43	function escapeRegExp(value) {
    44	  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    45	}
    46	
    47	// ─────────────────────────────────────────────────────────────────────────────
    48	// 3. PARSERS
    49	// ─────────────────────────────────────────────────────────────────────────────
    50	
    51	/**
    52	 * Parse JSONL content into an array of records, skipping malformed lines.
    53	 *
    54	 * @param {string} jsonlContent - Newline-delimited JSON string
    55	 * @returns {Array<Object>} Parsed records
    56	 */
    57	function parseJsonl(jsonlContent) {
    58	  const records = [];
    59	
    60	  for (const rawLine of jsonlContent.split('\n')) {
    61	    const line = rawLine.trim();
    62	    if (!line) {
    63	      continue;
    64	    }
    65	
    66	    try {
    67	      records.push(JSON.parse(line));
    68	    } catch (_error) {
    69	      continue;
    70	    }
    71	  }
    72	
    73	  return records;
    74	}
    75	
    76	function extractSection(markdown, heading) {
    77	  // Drop the `m` flag so `$` anchors to end-of-string, not end-of-line
    78	  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
    79	  const match = markdown.match(pattern);
    80	  return match ? match[1].trim() : '';
    81	}
    82	
    83	function extractListItems(sectionText) {
    84	  return sectionText
    85	    .split('\n')
    86	    .map((line) => line.trim())
    87	    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
    88	    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
    89	    .filter(Boolean);
    90	}
    91	
    92	function parseReflectionValue(sectionText, label) {
    93	  const match = sectionText.match(new RegExp(`-\\s+${escapeRegExp(label)}\\s*:\\s*(.+)`, 'i'));
    94	  return match ? normalizeText(match[1]) : null;
    95	}
    96	
    97	/**
    98	 * Parse a single iteration markdown file into a structured record.
    99	 *
   100	 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
   101	 * @returns {Object} Parsed iteration with focus, findings, sources, and reflection fields
   102	 */
   103	function parseIterationFile(iterationPath) {
   104	  const markdown = readUtf8(iterationPath);
   105	  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
   106	  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);
   107	  const focusSection = extractSection(markdown, 'Focus');
   108	  const findingsSection = extractSection(markdown, 'Findings');
   109	  const ruledOutSection = extractSection(markdown, 'Ruled Out');
   110	  const deadEndsSection = extractSection(markdown, 'Dead Ends');
   111	  const sourcesSection = extractSection(markdown, 'Sources Consulted');
   112	  const reflectionSection = extractSection(markdown, 'Reflection');
   113	  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
   114	
   115	  return {
   116	    path: iterationPath,
   117	    run: runMatch ? Number(runMatch[1]) : 0,
   118	    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
   119	    findings: extractListItems(findingsSection),
   120	    ruledOut: extractListItems(ruledOutSection),
   121	    deadEnds: extractListItems(deadEndsSection),
   122	    sources: extractListItems(sourcesSection),
   123	    reflectionWorked: parseReflectionValue(reflectionSection, 'What worked and why'),
   124	    reflectionFailed: parseReflectionValue(reflectionSection, 'What did not work and why'),
   125	    reflectionDifferent: parseReflectionValue(reflectionSection, 'What I would do differently'),
   126	    nextFocus: normalizeText(nextFocusSection),
   127	  };
   128	}
   129	
   130	function parseStrategyQuestions(strategyContent) {
   131	  const section = extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
   132	  return section
   133	    .split('\n')
   134	    .map((line) => line.trim())
   135	    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
   136	    .map((line) => {
   137	      const checked = /^- \[[xX]\]\s+/.test(line);
   138	      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
   139	      return {
   140	        checked,
   141	        text,
   142	      };
   143	    });
   144	}
   145	
   146	function buildCoverageBySources(iterationFiles, iterationRecords) {
   147	  const counter = {};
   148	  const seen = new Set();
   149	
   150	  for (const source of iterationFiles.flatMap((iteration) => iteration.sources).concat(
   151	    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),
   152	  )) {
   153	    const normalized = normalizeText(source);
   154	    if (!normalized || seen.has(normalized)) {
   155	      continue;
   156	    }
   157	    seen.add(normalized);
   158	
   159	    let key = 'other';
   160	    if (/^https?:\/\//i.test(normalized)) {
   161	      try {
   162	        key = new URL(normalized).hostname;
   163	      } catch (_error) {
   164	        key = 'web';
   165	      }
   166	    } else if (normalized.startsWith('memory:')) {
   167	      key = 'memory';
   168	    } else if (normalized.includes(':')) {
   169	      key = 'code';
   170	    }
   171	
   172	    counter[key] = (counter[key] || 0) + 1;
   173	  }
   174	
   175	  return Object.fromEntries(Object.entries(counter).sort(([left], [right]) => left.localeCompare(right)));
   176	}
   177	
   178	function uniqueById(items) {
   179	  const seen = new Set();
   180	  const result = [];
   181	
   182	  for (const item of items) {
   183	    if (seen.has(item.id)) {
   184	      continue;
   185	    }
   186	    seen.add(item.id);
   187	    result.push(item);
   188	  }
   189	
   190	  return result;
   191	}
   192	
   193	// ─────────────────────────────────────────────────────────────────────────────
   194	// 4. CORE LOGIC
   195	// ─────────────────────────────────────────────────────────────────────────────
   196	
   197	function buildRegistry(strategyQuestions, iterationFiles, iterationRecords) {
   198	  const answeredSet = new Set(
   199	    iterationRecords.flatMap((record) => (Array.isArray(record.answeredQuestions) ? record.answeredQuestions : [])).map(normalizeText),
   200	  );
   201	
   202	  const keyedQuestions = strategyQuestions.map((question, index) => {
   203	    const normalized = normalizeText(question.text);
   204	    const resolved = question.checked || answeredSet.has(normalized);
   205	    return {
   206	      id: `question-${index + 1}-${slugify(normalized)}`,
   207	      text: normalized,
   208	      addedAtIteration: 0,
   209	      resolvedAtIteration: resolved
   210	        ? iterationRecords.find((record) =>
   211	            Array.isArray(record.answeredQuestions)
   212	              && record.answeredQuestions.map(normalizeText).includes(normalized),
   213	          )?.run ?? 0
   214	        : null,
   215	      resolved,
   216	    };
   217	  });
   218	
   219	  const keyFindings = uniqueById(
   220	    iterationFiles
   221	      .flatMap((iteration) =>
   222	        iteration.findings.map((finding, index) => ({
   223	          id: `finding-${iteration.run}-${index + 1}-${slugify(finding)}`,
   224	          text: finding,
   225	          addedAtIteration: iteration.run,
   226	          sources: iteration.sources,
   227	        })),
   228	      )
   229	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   230	  );
   231	
   232	  const ruledOutDirections = uniqueById(
   233	    iterationFiles
   234	      .flatMap((iteration) =>
   235	        iteration.deadEnds.concat(iteration.ruledOut).map((entry, index) => ({
   236	          id: `ruled-out-${iteration.run}-${index + 1}-${slugify(entry)}`,
   237	          text: entry,
   238	          addedAtIteration: iteration.run,
   239	        })),
   240	      )
   241	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   242	  );
   243	
   244	  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
   245	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   246	  const convergenceScore =
   247	    latestIteration?.convergenceSignals?.compositeStop
   248	    ?? latestIteration?.newInfoRatio
   249	    ?? 0;
   250	
   251	  return {
   252	    openQuestions: keyedQuestions.filter((question) => !question.resolved).map((question) => ({
   253	      id: question.id,
   254	      text: question.text,
   255	      addedAtIteration: question.addedAtIteration,
   256	      resolvedAtIteration: null,
   257	    })),
   258	    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
   259	      id: question.id,
   260	      text: question.text,
   261	      addedAtIteration: question.addedAtIteration,
   262	      resolvedAtIteration: question.resolvedAtIteration,
   263	    })),
   264	    keyFindings,
   265	    ruledOutDirections,
   266	    metrics: {
   267	      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
   268	      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
   269	      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
   270	      keyFindings: keyFindings.length,
   271	      convergenceScore,
   272	      coverageBySources,
   273	    },
   274	  };
   275	}
   276	
   277	function blockFromBulletList(items) {
   278	  if (!items.length) {
   279	    return '[None yet]';
   280	  }

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Canonical review-mode contract for sk-deep-review.
     2	# This file is the single source of truth for review-mode taxonomy,
     3	# convergence settings, cross-reference protocols, downstream render targets,
     4	# and validation expectations.
     5	
     6	meta:
     7	  ownerSkill: sk-deep-review
     8	  reviewModeVersion: 2
     9	  generatedNotice:
    10	    warning: "Generated from review_mode_contract.yaml. Do not manually edit generated sections."
    11	    beginMarker: "<!-- BEGIN GENERATED: review-mode-contract -->"
    12	    endMarker: "<!-- END GENERATED: review-mode-contract -->"
    13	  sourceOfTruth: .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml
    14	
    15	# Core contract definitions consumed by workflows, agents, docs, and validators.
    16	contract:
    17	  defaultTargetType: spec-folder
    18	
    19	  # Review target taxonomy.
    20	  targetTypes:
    21	    - id: spec-folder
    22	      cliValue: spec-folder
    23	      label: Spec Folder
    24	      description: Review a single spec folder and its referenced implementation, tests, and release artifacts.
    25	    - id: skill
    26	      cliValue: skill
    27	      label: Skill
    28	      description: Review a skill package including SKILL.md, references, assets, scripts, and runtime integrations.
    29	    - id: agent
    30	      cliValue: agent
    31	      label: Agent
    32	      description: Review a named agent across runtime-specific definitions and capability parity surfaces.
    33	    - id: track
    34	      cliValue: track
    35	      label: Track
    36	      description: Review a spec track spanning multiple child spec folders and shared coordination artifacts.
    37	    - id: files
    38	      cliValue: files
    39	      label: Files
    40	      description: Review an explicit file set plus immediate cross-references required to evaluate shipped behavior.
    41	
    42	  # Simplified review dimensions. Traceability and maintainability absorb the
    43	  # prior seven-dimension model's overlap.
    44	  dimensions:
    45	    - id: correctness
    46	      priority: 1
    47	      label: Correctness
    48	      checks: Validate logic, invariants, state transitions, edge cases, and behavior against observable intent.
    49	      requiredForSeverityCoverage: true
    50	    - id: security
    51	      priority: 2
    52	      label: Security
    53	      checks: Validate trust boundaries, authz/authn behavior, input handling, secrets exposure, and exploit paths.
    54	      requiredForSeverityCoverage: true
    55	    - id: traceability
    56	      priority: 3
    57	      label: Traceability
    58	      checks: Validate spec alignment, completeness, checklist evidence, and cross-reference integrity across linked artifacts.
    59	      requiredForSeverityCoverage: false
    60	    - id: maintainability
    61	      priority: 4
    62	      label: Maintainability
    63	      checks: Validate codebase patterns, documentation quality, clarity, and ease of safe follow-on changes.
    64	      requiredForSeverityCoverage: false
    65	
    66	  # Severity contract stays stable across review outputs.
    67	  severities:
    68	    - id: P0
    69	      weight: 10.0
    70	      label: Blocker
    71	      requiresFileLineEvidence: true
    72	    - id: P1
    73	      weight: 5.0
    74	      label: Required
    75	      requiresFileLineEvidence: true
    76	    - id: P2
    77	      weight: 1.0
    78	      label: Suggestion
    79	      requiresFileLineEvidence: true
    80	
    81	  # Verdicts collapse PASS WITH NOTES into PASS + hasAdvisories metadata.
    82	  verdicts:
    83	    - id: FAIL
    84	      label: Fail
    85	      condition: "activeP0 > 0 OR any required quality gate fails"
    86	      nextCommand: /spec_kit:plan
    87	    - id: CONDITIONAL
    88	      label: Conditional
    89	      condition: "activeP0 == 0 AND activeP1 > 0"
    90	      nextCommand: /spec_kit:plan
    91	    - id: PASS
    92	      label: Pass
    93	      condition: "activeP0 == 0 AND activeP1 == 0"
    94	      hasAdvisoriesMetadata: "Set hasAdvisories=true when activeP2 > 0."
    95	      nextCommand: /create:changelog
    96	
    97	  # Binary gates applied after convergence math votes STOP.
    98	  qualityGates:
    99	    - id: evidence
   100	      label: Evidence
   101	      binary: true
   102	      combines:
   103	        - evidence-completeness
   104	        - no-inference-only
   105	      rule: Every active finding must be backed by concrete file:line evidence and may not rely only on inference.
   106	    - id: scope
   107	      label: Scope
   108	      binary: true
   109	      combines:
   110	        - scope-alignment
   111	      rule: Reviewed files, targets, and conclusions must stay inside the declared review scope.
   112	    - id: coverage
   113	      label: Coverage
   114	      binary: true
   115	      combines:
   116	        - severity-coverage
   117	        - cross-reference
   118	      rule: Required dimensions and required traceability protocols must be covered before STOP is allowed.
   119	
   120	  # Review-specific convergence settings calibrated from the v2 research.
   121	  convergence:
   122	    defaults:
   123	      maxIterations: 7
   124	      convergenceThreshold: 0.10
   125	      stuckThreshold: 2
   126	    signals:
   127	      - id: rolling-average
   128	        weight: 0.30
   129	        description: Rolling average of severity-weighted new findings across recent evidence-bearing iterations.
   130	      - id: mad-noise-floor
   131	        weight: 0.25
   132	        description: Robust noise-floor test comparing the latest severity-weighted ratio against MAD-derived churn.
   133	      - id: dimension-coverage
   134	        weight: 0.45
   135	        description: Coverage vote based on required dimension completion plus required protocol coverage stability.
   136	    severityMath:
   137	      refinementMultiplier: 0.5
   138	      p0OverrideMinRatio: 0.50
   139	      noFindingsRatio: 0.0
   140	    coverageAge:
   141	      minStabilizationPasses: 1
   142	    thresholds:
   143	      rollingStopThreshold: 0.08
   144	      noProgressThreshold: 0.05
   145	      compositeStopScore: 0.60
   146	
   147	  lifecycleModes:
   148	    - id: new
   149	      description: Create a brand-new review lineage with generation 1 and no parent session.
   150	    - id: resume
   151	      description: Continue the current review lineage without changing generation.
   152	    - id: restart
   153	      description: Start a new generation for the same target and archive the prior review packet state.
   154	    - id: fork
   155	      description: Start a new review branch with parent linkage and full ancestry preserved.
   156	    - id: completed-continue
   157	      description: Snapshot the completed report, reopen the lineage, and continue with amendment-only deltas.
   158	
   159	  lineageFields:
   160	    - sessionId
   161	    - parentSessionId
   162	    - lineageMode
   163	    - generation
   164	    - continuedFromRun
   165	
   166	  reducer:
   167	    enabled: true
   168	    inputs:
   169	      - latestJSONLDelta
   170	      - newIterationFile
   171	      - priorReducedState
   172	    outputs:
   173	      - findingsRegistry
   174	      - dashboardMetrics
   175	      - strategyUpdates
   176	    failureModes:
   177	      malformedDelta: skip-and-warn
   178	      missingIterationFile: no-op-with-error
   179	      schemaMismatch: reject-with-conflict-event
   180	    idempotent: true
   181	
   182	  releaseReadinessStates:
   183	    - id: in-progress
   184	      description: Review is ongoing or coverage is incomplete.
   185	    - id: converged
   186	      description: All dimensions are covered and no new P0/P1 findings appeared in the latest stabilization pass.
   187	    - id: release-blocking
   188	      description: At least one unresolved P0 finding is present.
   189	
   190	  # Cross-reference protocols are typed traceability checks. Core protocols are
   191	  # hard gates; overlay protocols apply only to matching target types.
   192	  crossReferenceProtocols:
   193	    - id: spec_code
   194	      dimension: traceability
   195	      level: core
   196	      appliesTo: [spec-folder, skill, agent, track, files]
   197	      gateClass: hard
   198	      passCriteria: All normative claims resolve to shipped behavior or explicitly documented non-applicability with evidence.
   199	      partialCriteria: Some claims resolve, but one or more claims remain ambiguous or blocked by missing evidence.
   200	      failCriteria: A normative claim contradicts shipped behavior, references missing implementation, or cannot be reconciled.
   201	    - id: checklist_evidence
   202	      dimension: traceability
   203	      level: core
   204	      appliesTo: [spec-folder, skill, agent, track, files]
   205	      gateClass: hard
   206	      passCriteria: Every checked checklist-style claim has supporting evidence and no unsupported completion marks remain.
   207	      partialCriteria: Evidence exists for part of the checked set, but some checked items remain unproven or weakly linked.
   208	      failCriteria: Checked items are unsupported, contradicted by evidence, or materially overstate completion.
   209	    - id: skill_agent
   210	      dimension: traceability
   211	      level: overlay
   212	      appliesTo: [skill]
   213	      gateClass: advisory
   214	      passCriteria: SKILL.md contracts, routing guidance, and referenced runtime agents agree on capabilities and boundaries.
   215	      partialCriteria: Shared intent is consistent, but one or more runtime contracts drift in wording, tools, or expectations.
   216	      failCriteria: SKILL.md and runtime agents materially disagree on capability, routing, permissions, or operating contract.
   217	    - id: agent_cross_runtime
   218	      dimension: traceability
   219	      level: overlay
   220	      appliesTo: [agent]

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml | sed -n '200,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	        action: "Ensure Known Context is written only after strategy.md exists"
   201	        condition: "prior_context_found"
   202	        edit: "{spec_folder}/research/deep-research-strategy.md"
   203	        note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
   204	
   205	      step_init_complete:
   206	        log: "Initialization complete. Config, state, and strategy files created."
   207	        set: { current_iteration: 1, current_segment: 1, stuck_count: 0 }
   208	
   209	  # ═══════════════════════════════════════════════════════════════
   210	  # PHASE 2: ITERATION LOOP
   211	  # ═══════════════════════════════════════════════════════════════
   212	  phase_loop:
   213	    purpose: Dispatch agent iterations until convergence
   214	    repeat: true
   215	    max_repeats: "{max_iterations}"
   216	    steps:
   217	
   218	      step_read_state:
   219	        action: "Read current state from JSONL and strategy"
   220	        read:
   221	          - "{spec_folder}/research/deep-research-state.jsonl"
   222	          - "{spec_folder}/research/deep-research-strategy.md"
   223	        extract:
   224	          - iteration_count: "Count lines where type === 'iteration'"
   225	          - current_iteration: "iteration_count + 1"
   226	          - current_segment: "Latest segment_start event segment, else 1"
   227	          - last_newInfoRatio: "Extract newInfoRatio from last iteration record"
   228	          - last_focus: "Extract focus from latest iteration record, else 'none yet'"
   229	          - ratio_prev: "Extract newInfoRatio from second-latest iteration record, else 'N/A'"
   230	          - ratio_latest: "Extract newInfoRatio from latest iteration record, else 'N/A'"
   231	          - next_focus: "Extract 'Next Focus' section from strategy.md"
   232	          - remaining_questions: "Count unchecked items in 'Key Questions'"
   233	          - remaining_questions_list: "List unchecked key questions from strategy.md"
   234	          - answered_count: "Count answered questions from strategy.md"
   235	          - total_questions: "Count total questions tracked in strategy.md"
   236	          - least_explored: "First unanswered question not covered by the most recent iteration focus, else first unanswered question"
   237	          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: focus (ratio)'"
   238	          - latest_status: "Extract status from latest iteration record, else 'none yet'"
   239	
   240	      step_check_pause_sentinel:
   241	        action: "Check for pause sentinel file"
   242	        check: "Does {spec_folder}/research/.deep-research-pause exist?"
   243	        if_exists:
   244	          log_event: '{"type":"event","event":"paused","reason":"sentinel file detected"}'
   245	          message: "Research paused. Delete research/.deep-research-pause to resume."
   246	          halt: true
   247	        if_not_exists:
   248	          proceed: true
   249	
   250	      step_check_convergence:
   251	        action: "Evaluate stop conditions"
   252	        algorithm: |
   253	          1. if iteration_count >= max_iterations: STOP (max_iterations_reached)
   254	          2. if remaining_questions == 0: STOP (all_questions_answered)
   255	          3. if stuck_count >= config.stuckThreshold: STUCK_RECOVERY
   256	          4. COMPOSITE CONVERGENCE (3-signal weighted vote):
   257	               signals = []
   258	               Filter: exclude iterations where status == thought from signal inputs (use only evidence iterations)
   259	               a) Rolling average (w=0.30, needs 3+ iterations):
   260	                  avg = mean(last 3 newInfoRatios)
   261	                  stop if avg < convergence_threshold
   262	               b) MAD noise floor (w=0.35, needs 4+ iterations):
   263	                  noiseFloor = MAD(all ratios) * 1.4826
   264	                  stop if latest ratio <= noiseFloor
   265	               c) Question entropy (w=0.35):
   266	                  coverage = answered / total questions
   267	                  stop if coverage >= 0.85
   268	               Redistribute weights for unavailable signals.
   269	               if weighted_stop_score > 0.60: STOP (composite_converged)
   270	          5. else: CONTINUE
   271	          6. if decision == "STOP":
   272	               guardResult = checkQualityGuards(state, strategy)
   273	               if not guardResult.passed:
   274	                 log: "Quality guard failed: {guardResult.violations}. Overriding STOP to CONTINUE."
   275	                 decision = "CONTINUE"
   276	          See convergence.md for full pseudocode and signal definitions.
   277	          Segment-aware convergence is experimental/reference-only; live workflow uses the current session as a single segment.
   278	        outputs:
   279	          - decision: "STOP | STUCK_RECOVERY | CONTINUE"
   280	          - reason: "Human-readable stop reason"
   281	
   282	      step_handle_convergence:
   283	        action: "Act on convergence decision"
   284	        if_stop:
   285	          log: "Loop stopping. Reason: {reason}"
   286	          skip_to: phase_synthesis
   287	        if_stuck_recovery:
   288	          log: "Stuck detected ({stuck_count} consecutive no-progress). Entering recovery."
   289	          set: { next_focus: "RECOVERY: Widen scope. Try fundamentally different approach. Least-explored question: {least_explored}" }
   290	          reset: { stuck_count: 0 }
   291	        if_continue:
   292	          log: "Iteration {current_iteration}: Continuing. Focus: {next_focus}"
   293	
   294	      step_dispatch_iteration:
   295	        action: "Dispatch @deep-research agent for one iteration"
   296	        dispatch:
   297	          agent: deep-research
   298	          model: opus
   299	          pre_dispatch:
   300	            generate_summary: |
   301	              STATE SUMMARY (auto-generated):
   302	              Segment: {current_segment} | Iteration: {current_iteration} of {max_iterations}
   303	              Questions: {answered_count}/{total_questions} answered | Last focus: {last_focus}
   304	              Last 2 ratios: {ratio_prev} -> {ratio_latest} | Stuck count: {stuck_count}
   305	              Next focus: {next_focus}
   306	          context: |
   307	            {state_summary}
   308	
   309	            Research Topic: {research_topic}
   310	            Iteration: {current_iteration} of {max_iterations}
   311	            Focus Area: {next_focus}
   312	            Remaining Key Questions: {remaining_questions_list}
   313	            Last 3 Iterations Summary: {last_3_summaries}
   314	
   315	            State Files (ALL paths relative to repo root):
   316	              Config: {spec_folder}/research/deep-research-config.json
   317	              State Log: {spec_folder}/research/deep-research-state.jsonl
   318	              Strategy: {spec_folder}/research/deep-research-strategy.md
   319	              Registry: {spec_folder}/research/findings-registry.json
   320	              Write findings to: {spec_folder}/research/iterations/iteration-{NNN}.md
   321	
   322	            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
   323	            CONSTRAINT: Target 3-5 research actions. Max 12 tool calls total.
   324	            CONSTRAINT: Write ALL findings to files. Do not hold in context.
   325	            CONSTRAINT: The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
   326	        wait_for_completion: true
   327	
   328	      step_reduce_state:
   329	        action: "Run the reducer to synchronize registry, dashboard, and strategy"
   330	        command: "node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}"
   331	        inputs:
   332	          latestJSONLDelta: "Latest JSONL records written since the previous iteration"
   333	          newIterationFile: "{spec_folder}/research/iterations/iteration-{NNN}.md"
   334	          priorReducedState: "{spec_folder}/research/findings-registry.json"
   335	        outputs:
   336	          - "{spec_folder}/research/findings-registry.json"
   337	          - "{spec_folder}/research/deep-research-dashboard.md"
   338	          - "{spec_folder}/research/deep-research-strategy.md"
   339	        failure_modes:
   340	          malformed_delta: "skip + warn"
   341	          missing_iteration_file: "no-op + error"
   342	          schema_mismatch: "reject + conflict event"
   343	        guarantee: "Idempotent for identical inputs"
   344	
   345	      step_evaluate_results:
   346	        action: "Verify iteration outputs and extract metrics"
   347	        verify:
   348	          - file_exists: "{spec_folder}/research/iterations/iteration-{NNN}.md"
   349	          - jsonl_appended: "New iteration record in state.jsonl"
   350	          - strategy_updated: "Reducer refreshed strategy machine-owned sections"
   351	          - registry_updated: "Reducer refreshed findings-registry.json"
   352	        extract:
   353	          - newInfoRatio: "From latest JSONL iteration record"
   354	          - findings_count: "From latest JSONL iteration record"
   355	          - status: "From latest JSONL iteration record"
   356	          - latest_focus: "From latest JSONL iteration record"
   357	        on_missing_outputs:
   358	          action: "Mark iteration as 'error', continue to next"
   359	          append_jsonl: '{"type":"iteration","run":{current_iteration},"status":"error","focus":"{next_focus}","findingsCount":0,"newInfoRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
   360	
   361	      step_generate_dashboard:
   362	        action: "Generate or refresh the human-readable dashboard"
   363	        read:
   364	          - "{spec_folder}/research/deep-research-state.jsonl"
   365	          - "{spec_folder}/research/findings-registry.json"
   366	          - "{spec_folder}/research/deep-research-strategy.md"
   367	        template: .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md
   368	        output: "{spec_folder}/research/deep-research-dashboard.md"
   369	        note: "Auto-generated from JSONL + reducer registry + strategy. Never manually edited."
   370	
   371	      step_update_tracking:
   372	        action: "Update loop tracking variables"
   373	        set:
   374	          current_iteration: "{current_iteration + 1}"
   375	          stuck_count: "if status == 'thought': unchanged (skip). if status == 'insight': 0 (reset). if newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"
   376	        log: "Iteration {N} complete. newInfoRatio: {newInfoRatio}. Findings: {findings_count}. Stuck count: {stuck_count}."
   377	
   378	      step_loop_decision:
   379	        action: "Return to step_read_state for next iteration"
   380	        goto: step_read_state
   381	
   382	  # ═══════════════════════════════════════════════════════════════
   383	  # PHASE 3: SYNTHESIS
   384	  # ═══════════════════════════════════════════════════════════════
   385	  phase_synthesis:
   386	    purpose: Compile all iteration findings into final research/research.md
   387	    steps:
   388	
   389	      step_hydrate_summary_metrics:
   390	        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
   391	        read:
   392	          - "{spec_folder}/research/deep-research-config.json"
   393	          - "{spec_folder}/research/deep-research-state.jsonl"
   394	          - "{spec_folder}/research/findings-registry.json"
   395	          - "{spec_folder}/research/deep-research-strategy.md"
   396	        extract:
   397	          - iteration_count: "Count lines where type === 'iteration'"
   398	          - current_iteration: "iteration_count + 1"
   399	          - current_segment: "Latest segment_start event segment, else 1"
   400	          - last_focus: "Extract focus from latest iteration record, else 'none yet'"
   401	          - ratio_prev: "Extract newInfoRatio from second-latest iteration record, else 'N/A'"
   402	          - ratio_latest: "Extract newInfoRatio from latest iteration record, else 'N/A'"
   403	          - remaining_questions: "Count unchecked items in 'Key Questions'"
   404	          - remaining_questions_list: "List unchecked key questions from strategy.md"
   405	          - answered_count: "Count answered questions from strategy.md"
   406	          - total_questions: "Count total questions tracked in strategy.md"
   407	          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: focus (ratio)'"
   408	          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
   409	
   410	      step_read_all_iterations:
   411	        action: "Read all iteration files and strategy"
   412	        read_pattern: "{spec_folder}/research/iterations/iteration-*.md"
   413	        read_also: "{spec_folder}/research/deep-research-strategy.md"
   414	
   415	      step_compile_research:
   416	        action: "Compile or finalize research/research.md"
   417	        instructions: |
   418	          If research/research.md exists (progressive synthesis was active):
   419	            1. Read current research/research.md
   420	            2. Consolidate and deduplicate findings across all iterations
   421	            3. Fill any empty sections with findings from iteration files
   422	            4. Remove redundancy while preserving all unique findings
   423	            5. Add convergence report as appendix
   424	
   425	          If research/research.md does not exist:
   426	            1. Create research/research.md following 17-section template
   427	            2. Populate sections from iteration files
   428	            3. Add citations from original sources
   429	            4. Note unanswered questions in Open Questions section
   430	          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
   431	        output: "{spec_folder}/research/research.md"
   432	
   433	      step_convergence_report:
   434	        action: "Generate and append convergence report"
   435	        report: |
   436	          ## Convergence Report
   437	          - Stop reason: {reason}
   438	          - Total iterations: {iteration_count}
   439	          - Questions answered: {answered_count} / {total_questions}
   440	          - Remaining questions: {remaining_questions}
   441	          - Last 3 iteration summaries: {last_3_summaries}
   442	          - Convergence threshold: {convergence_threshold}
   443	          - Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
   444	        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
   445	
   446	      step_update_config_status:
   447	        action: "Mark config as complete"
   448	        edit: "{spec_folder}/research/deep-research-config.json"
   449	        set_field: { status: "complete" }
   450	
   451	  # ═══════════════════════════════════════════════════════════════
   452	  # PHASE 4: SAVE
   453	  # ═══════════════════════════════════════════════════════════════
   454	  phase_save:
   455	    purpose: Preserve research context to memory system
   456	    steps:
   457	
   458	      step_generate_context:
   459	        action: "Save memory context via generate-context.js"
   460	        command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}"
   461	        critical_rule: "NEVER use Write tool directly for memory/ paths"
   462	
   463	      step_index_memory:
   464	        action: "No additional indexing step in the live contract"
   465	        note: "generate-context.js is the supported save boundary for this workflow"
   466	
   467	      step_verify_save:
   468	        action: "Verify memory file was created"
   469	        check: "Does {spec_folder}/memory/*.md exist?"
   470	        on_fail: "Log warning but do not block completion"
   471	
   472	  # ═══════════════════════════════════════════════════════════════
   473	  # COMPLETION
   474	  # ═══════════════════════════════════════════════════════════════
   475	  completion:
   476	    message: |
   477	      Deep research complete.
   478	      Iterations: {iteration_count} | Stop reason: {reason}
   479	      Questions answered: {answered_count}/{total_questions}
   480	
   481	      Artifacts:
   482	        - research/research.md (compiled from {iteration_count} iterations)
   483	        - {iteration_count} iteration files in research/
   484	        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
   485	        - Memory context saved
   486	
   487	      STATUS=OK PATH={spec_folder}
   488	    next_steps:
   489	      - "/spec_kit:plan [feature-description]"
   490	      - "/spec_kit:deep-research [new-topic] (for related deep research)"
   491	      - "/memory:save {spec_folder} (manual memory save)"
   492	
   493	# ─────────────────────────────────────────────────────────────────
   494	# ERROR RECOVERY
   495	# ─────────────────────────────────────────────────────────────────
   496	error_recovery:
   497	  agent_dispatch_timeout: "Retry once with reduced scope (fewer research actions). If second timeout, mark as 'timeout' and continue."
   498	  state_file_missing: "If JSONL missing during loop, reconstruct from iteration files. If strategy missing, create minimal version."
   499	  consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings."
   500	  memory_save_failure: "Preserve the research/ packet as backup. Log warning."
   501	
   502	# ─────────────────────────────────────────────────────────────────
   503	# RULES
   504	# ─────────────────────────────────────────────────────────────────
   505	rules:
   506	  ALWAYS:
   507	    - follow_workflow_phases_in_order
   508	    - dispatch_deep_research_agent_per_iteration
   509	    - check_convergence_before_each_iteration
   510	    - write_all_state_to_files
   511	    - save_memory_context_after_synthesis
   512	    - respect_max_iterations_cap
   513	  NEVER:
   514	    - skip_convergence_check
   515	    - dispatch_non_leaf_agents
   516	    - hold_iteration_findings_in_memory_only
   517	    - modify_config_after_initialization
   518	    - overwrite_jsonl_state_log
   519	    - proceed_without_state_file_verification
   520	
   521	# ─────────────────────────────────────────────────────────────────
   522	# REFERENCE-ONLY APPENDIX
   523	# ─────────────────────────────────────────────────────────────────
   524	reference_only_appendix:
   525	  checkpoint_commit:
   526	    note: "Checkpoint commits are intentionally excluded from workflow.steps."
   527	    commands:
   528	      - "git add {spec_folder}/research/iterations/iteration-{NNN}.md {spec_folder}/research/deep-research-state.jsonl {spec_folder}/research/deep-research-strategy.md {spec_folder}/research/research.md"
   529	      - 'git commit -m "chore(deep-research): iteration {NNN} complete"'
   530	  wave_orchestration:
   531	    note: "Wave execution is intentionally excluded from workflow.steps."
   532	    summary:
   533	      - "Check whether 3+ independent unanswered questions justify a wave."
   534	      - "Dispatch up to 3 parallel agents on distinct questions."
   535	      - "Score wave results by median newInfoRatio and promote top branches."

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '280,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	
   281	      step_enrich_strategy_context:
   282	        action: "Ensure Known Context is written only after strategy.md exists"
   283	        condition: "prior_context_found"
   284	        edit: "{spec_folder}/review/deep-review-strategy.md"
   285	        note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
   286	
   287	      step_init_complete:
   288	        log: "Initialization complete. Config, state, and strategy files created. Review scope: {review_scope_files_count} files, {dimension_queue_count} dimensions."
   289	        set: { current_iteration: 1, stuck_count: 0, p0_count: 0, p1_count: 0, p2_count: 0 }
   290	
   291	  # ═══════════════════════════════════════════════════════════════
   292	  # PHASE 2: ITERATION LOOP
   293	  # ═══════════════════════════════════════════════════════════════
   294	  phase_loop:
   295	    purpose: Dispatch review agent iterations until convergence
   296	    repeat: true
   297	    max_repeats: "{max_iterations}"
   298	    steps:
   299	
   300	      step_read_state:
   301	        action: "Read current state from JSONL, strategy, and config"
   302	        read:
   303	          - "{spec_folder}/review/deep-review-state.jsonl"
   304	          - "{spec_folder}/review/deep-review-findings-registry.json"
   305	          - "{spec_folder}/review/deep-review-strategy.md"
   306	          - "{spec_folder}/review/deep-review-config.json"
   307	        extract:
   308	          - iteration_count: "Count lines where type === 'iteration'"
   309	          - current_iteration: "iteration_count + 1"
   310	          - last_newFindingsRatio: "Extract newFindingsRatio from last iteration record"
   311	          - last_focus: "Extract focus/dimension from latest iteration record, else 'none yet'"
   312	          - ratio_prev: "Extract newFindingsRatio from second-latest iteration record, else 'N/A'"
   313	          - ratio_latest: "Extract newFindingsRatio from latest iteration record, else 'N/A'"
   314	          - next_dimension: "Next uncovered dimension from dimension_queue in strategy.md"
   315	          - dimensions_covered: "List of dimensions already reviewed"
   316	          - dimensions_remaining: "List of dimensions not yet reviewed"
   317	          - dimension_coverage: "covered / total dimensions"
   318	          - coverage_age: "Iterations since dimension coverage last changed; require >= 1 before STOP"
   319	          - p0_count: "Count P0 findings across all iterations"
   320	          - p1_count: "Count P1 findings across all iterations"
   321	          - p2_count: "Count P2 findings across all iterations"
   322	          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: dimension (ratio, P0/P1/P2)'"
   323	          - latest_status: "Extract status from latest iteration record, else 'none yet'"
   324	
   325	      step_check_pause_sentinel:
   326	        action: "Check for pause sentinel file"
   327	        check: "Does {spec_folder}/review/.deep-review-pause exist?"
   328	        if_exists:
   329	          log_event: '{"type":"event","event":"paused","reason":"sentinel file detected"}'
   330	          message: "Review paused. Delete review/.deep-review-pause to resume."
   331	          halt: true
   332	        if_not_exists:
   333	          proceed: true
   334	
   335	      step_check_convergence:
   336	        action: "Evaluate review-specific stop conditions"
   337	        algorithm: |
   338	          1. HARD STOPS:
   339	             a) if iteration_count >= max_iterations: STOP (max_iterations_reached)
   340	             b) if all dimensions clean AND required traceability protocols are covered AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass (evidence: every P0/P1 has file:line; scope: all findings within target; coverage: all dimensions reviewed): STOP (all_dimensions_clean)
   341	          2. STUCK DETECTION (threshold 2):
   342	             if stuck_count >= 2: STUCK_RECOVERY
   343	          3. COMPOSITE CONVERGENCE (3-signal weighted vote with split thresholds):
   344	               signals = []
   345	               a) Rolling average (w=0.30, window=2, needs 2+ iterations):
   346	                  avg = mean(last 2 newFindingsRatios)
   347	                  stop if avg <= 0.08
   348	               b) MAD noise floor (w=0.25, needs 3+ iterations):
   349	                  noiseFloor = MAD(all ratios) * 1.4826
   350	                  stop if latest ratio <= noiseFloor
   351	               c) Dimension coverage (w=0.45):
   352	                  coverage = dimensions_covered / total_dimensions
   353	                  stop if coverage >= 1.0 AND required traceability protocols are covered AND coverage_age >= 1
   354	               Redistribute weights for unavailable signals.
   355	               if latest ratio <= 0.05: mark no_progress_threshold_reached
   356	               if weighted_stop_score >= 0.60: check binary gates
   357	          4. QUALITY GUARDS (4 binary checks — ALL must pass to allow STOP):
   358	               a) Evidence: Every active finding has concrete file:line evidence and no active P0/P1 relies only on inference
   359	               b) Scope: All findings stay within declared review scope and target boundaries
   360	               c) Coverage: Configured dimensions and required traceability protocols covered, with coverage_age >= 1
   361	               d) Claim adjudication: claim_adjudication_passed != false (STOP is blocked while claim_adjudication_passed == false)
   362	             if not all guards passed:
   363	               log: "Quality guard failed: {violations}. Overriding STOP to CONTINUE."
   364	               decision = "CONTINUE"
   365	          5. else: CONTINUE
   366	        outputs:
   367	          - decision: "STOP | STUCK_RECOVERY | CONTINUE"
   368	          - reason: "Human-readable stop reason"
   369	
   370	      step_handle_convergence:
   371	        action: "Act on convergence decision"
   372	        if_stop:
   373	          log: "Loop stopping. Reason: {reason}"
   374	          skip_to: phase_synthesis
   375	        if_stuck_recovery:
   376	          log: "Stuck detected ({stuck_count} consecutive no-progress). Entering recovery."
   377	          recovery_strategies:
   378	            - "Change granularity: file-level → function-level → line-level review"
   379	            - "Traceability protocol replay: re-run unresolved core or overlay checks"
   380	            - "Escalate severity review: re-examine P2 findings for potential P1 upgrades"
   381	          set: { next_dimension: "RECOVERY: {recovery_strategy}. Least-explored dimension: {least_explored}" }
   382	          reset: { stuck_count: 0 }
   383	        if_continue:
   384	          log: "Iteration {current_iteration}: Continuing. Dimension: {next_dimension}"
   385	
   386	      step_generate_state_summary:
   387	        action: "Generate compact state summary for dispatch context (~200 tokens)"
   388	        generate: |
   389	          STATE SUMMARY (auto-generated):
   390	          Iteration: {current_iteration} of {max_iterations}
   391	          Dimension: {next_dimension}
   392	          Prior Findings: P0={p0_count} P1={p1_count} P2={p2_count}
   393	          Dimension Coverage: {dimensions_covered_list} ({dimension_coverage})
   394	          Traceability: core={core_protocol_status} overlay={overlay_protocol_status}
   395	          Coverage Age: {coverage_age}
   396	          Last 2 ratios: {ratio_prev} -> {ratio_latest}
   397	          Stuck count: {stuck_count}
   398	          Provisional Verdict: {PASS|CONDITIONAL|FAIL|PENDING} hasAdvisories={has_advisories}
   399	
   400	      step_dispatch_iteration:
   401	        action: "Dispatch @deep-review agent for one review iteration"
   402	        dispatch:
   403	          agent: deep-review
   404	          model: opus
   405	          context: |
   406	            {state_summary}
   407	
   408	            REVIEW ITERATION {current_iteration} of {max_iterations}
   409	            MODE: review
   410	            DIMENSION: {next_dimension}
   411	            REVIEW TARGET: {review_target}
   412	            REVIEW SCOPE FILES: {review_scope_files}
   413	            PRIOR FINDINGS: P0={p0_count} P1={p1_count} P2={p2_count}
   414	            SHARED DOCTRINE: Load .agents/skills/sk-code-review/references/review_core.md before final severity calls.
   415	            REVIEW DIMENSIONS: correctness, security, traceability, maintainability
   416	            TRACEABILITY PROTOCOLS:
   417	            - Core: spec_code, checklist_evidence
   418	            - Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
   419	            QUALITY GATES: evidence, scope, coverage
   420	            VERDICTS: FAIL | CONDITIONAL | PASS (PASS may set hasAdvisories=true when only P2 remain)
   421	            CLAIM ADJUDICATION: Every new P0/P1 must include claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.
   422	
   423	            State Files (ALL paths relative to repo root):
   424	              Config: {spec_folder}/review/deep-review-config.json
   425	              State Log: {spec_folder}/review/deep-review-state.jsonl
   426	              Findings Registry: {spec_folder}/review/deep-review-findings-registry.json
   427	              Strategy: {spec_folder}/review/deep-review-strategy.md
   428	              Write findings to: {spec_folder}/review/iterations/iteration-{NNN}.md
   429	
   430	            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
   431	            CONSTRAINT: Target 9 tool calls. Soft max 12, hard max 13.
   432	            CONSTRAINT: Write ALL findings to files. Do not hold in context.
   433	            CONSTRAINT: Review target is READ-ONLY. Do not modify reviewed files.
   434	            CONSTRAINT: Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, and newFindingsRatio.
   435	            CONSTRAINT: Update strategy.md dimension coverage, traceability status, and running findings.
   436	        wait_for_completion: true
   437	
   438	      step_evaluate_results:
   439	        action: "Verify iteration outputs and extract metrics"
   440	        verify:
   441	          - file_exists: "{spec_folder}/review/iterations/iteration-{NNN}.md"
   442	          - jsonl_appended: "New iteration record in state.jsonl"
   443	          - strategy_updated: "Strategy.md has been modified"
   444	        extract:
   445	          - newFindingsRatio: "From latest JSONL iteration record"
   446	          - findings_count: "From latest JSONL iteration record"
   447	          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
   448	          - dimensions: "From latest JSONL iteration record"
   449	          - files_reviewed: "From latest JSONL iteration record"
   450	          - status: "From latest JSONL iteration record"
   451	          - reviewed_artifacts: "From latest JSONL iteration record"
   452	          - traceability_checks: "From latest JSONL iteration record when present"
   453	        on_missing_outputs:
   454	          action: "Mark iteration as 'error', continue to next"
   455	          append_jsonl: '{"type":"iteration","run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
   456	
   457	      step_post_iteration_claim_adjudication:
   458	        action: "Validate typed claim-adjudication packets for any new P0/P1 findings"
   459	        verify:
   460	          - typed_packets_present: "Every new P0/P1 finding in review/iterations/iteration-{NNN}.md contains a claim-adjudication JSON block"
   461	          - packet_fields: "Each packet includes claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger"
   462	        on_fail:
   463	          action: "Mark the iteration as invalid for convergence and require rewrite before STOP is permitted"
   464	          set:
   465	            claim_adjudication_passed: false
   466	          log: "Claim adjudication incomplete for new P0/P1 findings. Continue loop until packets are present. Set claim_adjudication_passed = false. This flag MUST be checked in convergence evaluation — STOP is blocked while claim_adjudication_passed == false."
   467	
   468	      step_reduce_review_state:
   469	        action: "Run reducer to refresh the canonical findings registry before dashboard generation"
   470	        read:
   471	          - "{spec_folder}/review/deep-review-state.jsonl"
   472	          - "{spec_folder}/review/iterations/iteration-{NNN}.md"
   473	          - "{spec_folder}/review/deep-review-findings-registry.json"
   474	        write: "{spec_folder}/review/deep-review-findings-registry.json"
   475	        note: "Reducer outputs findingsRegistry, dashboardMetrics, and strategyUpdates. Re-running the same inputs must be idempotent."
   476	
   477	      step_generate_dashboard:
   478	        action: "Generate or refresh the review dashboard"
   479	        read:
   480	          - "{spec_folder}/review/deep-review-state.jsonl"
   481	          - "{spec_folder}/review/deep-review-findings-registry.json"
   482	          - "{spec_folder}/review/deep-review-strategy.md"
   483	        content: |
   484	          # Deep Review Dashboard - Session Overview
   485	
   486	          Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.
   487	
   488	          ## Status
   489	          - Review Target: {review_target} ({review_target_type})
   490	          - Status: [ITERATING | CONVERGING | STUCK_RECOVERY | COMPLETE]
   491	          - Iteration: {current_iteration} of {max_iterations}
   492	          - Provisional Verdict: [PASS | CONDITIONAL | FAIL | PENDING]
   493	          - hasAdvisories: {has_advisories}
   494	
   495	          ## Findings Summary
   496	          | Severity | Count | Trend |
   497	          |----------|------:|-------|
   498	          | P0 (Blockers) | {p0_count} | {p0_trend} |
   499	          | P1 (Required) | {p1_count} | {p1_trend} |
   500	          | P2 (Suggestions) | {p2_count} | {p2_trend} |
   501	
   502	          ## Dimension Coverage
   503	          | Dimension | Status | Iteration | Findings |
   504	          |-----------|--------|-----------|----------|
   505	          | [per dimension from strategy + JSONL] |
   506	
   507	          ## Traceability Coverage
   508	          | Protocol | Level | Status | Findings |
   509	          |----------|-------|--------|----------|
   510	          | [per protocol from traceabilityChecks] |
   511	
   512	          ## Progress
   513	          | # | Dimension | Ratio | P0/P1/P2 | Status |
   514	          |---|-----------|-------|----------|--------|
   515	          | [per iteration from JSONL] |
   516	
   517	          ## Trend
   518	          - Last 3 ratios: [{ratios}] [{trend}]
   519	          - Stuck count: {stuck_count}
   520	          - Gate violations: {guard_violations}
   521	
   522	          ## Next Focus
   523	          {next_dimension}
   524	        output: "{spec_folder}/review/deep-review-dashboard.md"
   525	        note: "Auto-generated from JSONL + strategy. Never manually edited."
   526	
   527	      step_update_tracking:
   528	        action: "Update loop tracking variables"
   529	        set:
   530	          current_iteration: "{current_iteration + 1}"
   531	          p0_count: "Accumulate from severity_counts"
   532	          p1_count: "Accumulate from severity_counts"
   533	          p2_count: "Accumulate from severity_counts"
   534	          stuck_count: |
   535	            if status == 'thought': unchanged (skip)
   536	            if status == 'insight': 0 (reset)
   537	            if newFindingsRatio <= 0.05: stuck_count + 1
   538	            else: 0
   539	        log: "Iteration {N} complete. Dimensions: {dimensions}. newFindingsRatio: {newFindingsRatio}. Findings: P0={severity_counts.P0} P1={severity_counts.P1} P2={severity_counts.P2}. Stuck count: {stuck_count}."
   540	
   541	      step_loop_decision:
   542	        action: "Return to step_read_state for next iteration"
   543	        goto: step_read_state
   544	
   545	  # ═══════════════════════════════════════════════════════════════
   546	  # PHASE 3: SYNTHESIS
   547	  # ═══════════════════════════════════════════════════════════════
   548	  phase_synthesis:
   549	    purpose: Compile all iteration findings into review/review-report.md
   550	    steps:
   551	
   552	      step_hydrate_summary_metrics:
   553	        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
   554	        read:
   555	          - "{spec_folder}/review/deep-review-config.json"
   556	          - "{spec_folder}/review/deep-review-state.jsonl"
   557	          - "{spec_folder}/review/deep-review-findings-registry.json"
   558	          - "{spec_folder}/review/deep-review-strategy.md"
   559	        extract:
   560	          - iteration_count: "Count lines where type === 'iteration'"
   561	          - p0_count: "Total P0 findings across all iterations (deduped)"
   562	          - p1_count: "Total P1 findings across all iterations (deduped)"
   563	          - p2_count: "Total P2 findings across all iterations (deduped)"
   564	          - dimensions_covered: "List of reviewed dimensions"
   565	          - dimension_coverage: "covered / total"
   566	          - last_3_summaries: "Summarize the latest 3 iteration records"
   567	          - reason: "Use the latest stop reason if present, else 'completed-continue'"
   568	
   569	      step_read_all_iterations:
   570	        action: "Read all iteration files and strategy"
   571	        read_pattern: "{spec_folder}/review/iterations/iteration-*.md"
   572	        read_also: "{spec_folder}/review/deep-review-strategy.md"
   573	
   574	      step_build_finding_registry:
   575	        action: "Build deduplicated finding registry from all iterations"
   576	        algorithm: |
   577	          1. Extract all findings from iteration files
   578	          2. Deduplicate by key: file:line + normalized_title
   579	             - Same file:line, multiple dimensions → single finding, multiple dimension tags
   580	             - Keep highest severity on duplicates
   581	          3. Track finding lifecycle:
   582	             - status: active | duplicate | upgraded | downgraded | contested | resolved_false_positive
   583	             - Record first_seen, upgraded_in, previous_severity for severity changes
   584	          4. Resolve contradictions:
   585	             - Findings marked contested across iterations → referee pass
   586	             - Determine final severity and status
   587	          5. Count only 'active' findings for totals
   588	        outputs:
   589	          - finding_registry: "Deduplicated list of all findings with metadata"
   590	          - active_p0: "Count of active P0 findings"
   591	          - active_p1: "Count of active P1 findings"
   592	          - active_p2: "Count of active P2 findings"
   593	
   594	      step_adversarial_selfcheck:
   595	        action: "Final adversarial self-check on all P0 and P1 findings"
   596	        algorithm: |
   597	          For each active P0/P1 finding:
   598	            1. Hunter: Re-verify finding against source code (re-read file:line)
   599	            2. Skeptic: Challenge severity — is this really P0/P1? Could it be P2?
   600	            3. Referee: Final call — confirm, downgrade, or mark false_positive
   601	          Update finding_registry with adjudicated results.
   602	
   603	      step_compile_review_report:
   604	        action: "Compile review/review-report.md with 9 sections and an embedded Planning Packet"
   605	        instructions: |
   606	          Create review/review-report.md with the following sections:
   607	
   608	          1. **Executive Summary**
   609	             - Overall verdict: PASS | CONDITIONAL | FAIL
   610	             - hasAdvisories: true when PASS carries active P2 items
   611	             - P0/P1/P2 counts (active only)
   612	             - Review scope summary
   613	
   614	          2. **Planning Trigger**
   615	             - State whether `/spec_kit:plan` is required
   616	             - Include a fenced `json` block labeled `Planning Packet`
   617	             - The packet MUST include: `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`
   618	
   619	          3. **Active Finding Registry**
   620	             - Unified registry for active P0/P1/P2 findings

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '300,390p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	3. Orchestrator absorbs the iteration work:
   301	   - Read state files (JSONL + strategy.md)
   302	   - Determine focus from strategy "Next Focus"
   303	   - Execute 3-5 research actions directly
   304	   - Write `research/iterations/iteration-NNN.md`
   305	   - Update strategy.md
   306	   - Append iteration record to JSONL
   307	4. Continue loop normally after direct-mode iteration completes
   308	5. If direct mode also fails, escalate to the final user-escalation tier
   309	
   310	**Note**: Direct mode iterations are logged with `"directMode": true` in their JSONL record for diagnostic tracking.
   311	
   312	---
   313	
   314	<!-- /ANCHOR:phase-iteration-loop -->
   315	<!-- ANCHOR:wave-orchestration-protocol -->
   316	## 3a. WAVE ORCHESTRATION PROTOCOL (REFERENCE-ONLY)
   317	
   318	An optional parallel execution mode for research topics with multiple independent questions. Treat this as reference guidance unless the runtime explicitly supports it; the live workflow remains sequential.
   319	
   320	### When to Use Waves
   321	
   322	- 3+ independent key questions identified during initialization
   323	- Questions do not depend on each other's answers
   324	- Parallelism is beneficial (time-constrained research, broad survey)
   325	
   326	### Wave Execution Model
   327	
   328	```
   329	Wave 1: Dispatch N agents on independent questions
   330	  |
   331	  +-- Agent A: Question 1 --> iteration-001.md (newInfoRatio: 0.8)
   332	  +-- Agent B: Question 2 --> iteration-002.md (newInfoRatio: 0.3)
   333	  +-- Agent C: Question 3 --> iteration-003.md (newInfoRatio: 0.7)
   334	  |
   335	Scoring: Rank by newInfoRatio, prune below median when wave support is enabled
   336	  |
   337	Wave 2: Follow-up on top-K questions (K = ceil(N/2))
   338	  +-- Agent A: Question 1 follow-up --> iteration-004.md
   339	  +-- Agent C: Question 3 follow-up --> iteration-005.md
   340	  |
   341	Repeat until convergence
   342	```
   343	
   344	### Scoring and Pruning
   345	
   346	After each wave completes:
   347	1. Rank all wave iterations by `newInfoRatio`
   348	2. Compute wave median: `median([i.newInfoRatio for i in wave_iterations])`
   349	3. **Prune**: Questions with newInfoRatio below median are deprioritized when wave support is enabled
   350	4. **Promote**: Top-K questions (K = ceil(N/2)) get follow-up iterations
   351	5. Pruned questions are moved to the ideas backlog, not discarded
   352	
   353	### Breakthrough Detection
   354	
   355	When any single iteration in a wave achieves `newInfoRatio > 2x wave_average`:
   356	
   357	1. Flag as **breakthrough**: `{"type":"event","event":"breakthrough","iteration":N,"ratio":X.XX}`
   358	2. Generate 2-3 adjacent questions from the breakthrough findings
   359	3. Prioritize these adjacent questions in the next wave
   360	4. Breakthrough iterations are NEVER pruned
   361	
   362	### Wave JSONL Records
   363	
   364	Wave iterations use standard iteration records with an additional field:
   365	```json
   366	{"type":"iteration","run":N,"wave":1,"status":"complete",...}
   367	```
   368	
   369	Wave events:
   370	```json
   371	{"type":"event","event":"wave_complete","wave":1,"iterations":[1,2,3],"medianRatio":0.5}
   372	{"type":"event","event":"breakthrough","wave":1,"iteration":2,"ratio":0.95}
   373	```
   374	
   375	### Integration with Sequential Loop
   376	
   377	- Waves are an ALTERNATIVE to sequential iteration, not a replacement
   378	- The convergence algorithm applies identically (uses all iteration records)
   379	- Wave mode can transition to sequential mode when questions narrow to 1-2
   380	- Sequential mode can spawn a wave when new independent questions emerge
   381	
   382	---
   383	
   384	<!-- /ANCHOR:wave-orchestration-protocol -->
   385	<!-- ANCHOR:context-isolation-dispatch -->
   386	## 3b. CONTEXT ISOLATION DISPATCH (EXPERIMENTAL, REFERENCE-ONLY)
   387	
   388	An alternative dispatch mechanism that guarantees fresh context per iteration by launching a new OS process. Treat this as reference-only unless the runtime explicitly implements alternate CLI dispatch.
   389	
   390	### Motivation

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/convergence.md | sed -n '300,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/convergence.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
   301	6. Proceed with valid entries only
   302	
   303	This ensures convergence checks continue even after partial state corruption. See state_format.md Section 3 for the full fault tolerance specification.
   304	
   305	### Segment Model (REFERENCE-ONLY)
   306	
   307	Segments partition a research session into logical phases without losing history when an implementation explicitly enables them.
   308	
   309	| Field | Type | Default | Description |
   310	|-------|------|---------|-------------|
   311	| segment (on iteration records) | number | 1 | Segment this iteration belongs to |
   312	| segment_start (event type) | event | -- | Marks the start of a new segment |
   313	
   314	When computing convergence signals:
   315	- Filter iterations by `segment === currentSegment`
   316	- Hard stops (max iterations) count ALL iterations regardless of segment
   317	- Cross-segment analysis: read full JSONL without segment filtering
   318	
   319	Segment transitions are triggered only when a runtime explicitly enables them:
   320	- `:restart` mode in an implementation that supports it
   321	- Explicit user request for a new research angle
   322	- Orchestrator judgment when research direction fundamentally shifts
   323	
   324	See state_format.md Section 3 for JSONL schema details.
   325	
   326	---
   327	
   328	<!-- /ANCHOR:signal-definitions -->
   329	<!-- ANCHOR:stuck-recovery-protocol -->
   330	## 4. STUCK RECOVERY PROTOCOL
   331	
   332	When `stuckCount >= stuckThreshold` (default 3):
   333	
   334	### Step 1: Analyze Why
   335	Read strategy.md to understand:
   336	- What approaches have been exhausted?
   337	- What questions remain unanswered?
   338	- What has NOT been tried?
   339	
   340	### Step 1.5: Classify Failure Mode

 succeeded in 0ms:
     1	---
     2	title: Convergence Detection Reference
     3	description: Algorithms and protocols for determining when the deep research loop should stop.
     4	---
     5	
     6	# Convergence Detection Reference
     7	
     8	Algorithms and protocols for determining when the deep research loop should stop.
     9	
    10	---
    11	
    12	<!-- ANCHOR:overview -->
    13	## 1. OVERVIEW
    14	
    15	Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.
    16	
    17	---
    18	
    19	<!-- /ANCHOR:overview -->
    20	<!-- ANCHOR:shouldcontinue-algorithm -->
    21	## 2. THE shouldContinue() ALGORITHM
    22	
    23	> **Segment Awareness (REFERENCE-ONLY)**: When segments are explicitly enabled, `state.iterations` may be pre-filtered to the current segment. The live workflow uses a single segment by default.
    24	
    25	### 2.1 Hard Stops (checked first, always apply)
    26	
    27	```
    28	function shouldContinue(state, config):
    29	  iterations = state.iterations  // single live segment; optional segment filtering is reference-only
    30	
    31	  // Hard stop: max iterations
    32	  if len(iterations) >= config.maxIterations:
    33	    return { action: "STOP", reason: "max_iterations_reached" }
    34	
    35	  // Hard stop: all questions answered
    36	  unanswered = countUnanswered(state.strategy.keyQuestions)
    37	  if unanswered == 0:
    38	    return { action: "STOP", reason: "all_questions_answered" }
    39	```
    40	
    41	### 2.2 Stuck Detection
    42	
    43	```
    44	  // Stuck detection: consecutive no-progress
    45	  stuckCount = countConsecutiveStuck(iterations)
    46	  if stuckCount >= config.stuckThreshold:
    47	    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }
    48	```
    49	
    50	### 2.3 Composite Convergence (3-Signal Weighted Vote)
    51	
    52	Three independent signals each cast a stop/continue vote. Stop when weighted stop-score exceeds the consensus threshold.
    53	
    54	| Signal | Weight | Min Iterations | Measures |
    55	|--------|--------|---------------|----------|
    56	| Rolling Average | 0.30 | 3 | Recent information yield |
    57	| MAD Noise Floor | 0.35 | 4 | Signal vs noise in newInfoRatio |
    58	| Question Entropy | 0.35 | 1 | Coverage of research questions |
    59	
    60	Reducer-owned metrics derived from these signals:
    61	
    62	- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
    63	- `coverageBySources`: per-question source coverage summary used by the quality guards
    64	
    65	```
    66	  // Filter: exclude "thought" iterations from convergence signals
    67	  // Thought iterations (analytical-only, no evidence) should not affect
    68	  // rolling average, MAD noise floor, or stuck detection.
    69	  // Insight iterations ARE included — they have low ratios but are not stuck.
    70	  evidenceIterations = [i for i in iterations if i.status != "thought"]
    71	
    72	  // Composite convergence: 3-signal weighted vote
    73	  signals = []
    74	  totalWeight = 0
    75	
    76	  // Signal 1: Rolling average of last N newInfoRatios (excludes thought)
    77	  if len(evidenceIterations) >= 3:
    78	    recent = evidenceIterations[-3:]
    79	    avgNewInfo = mean(i.newInfoRatio for i in recent)
    80	    rollingStop = avgNewInfo < config.convergenceThreshold
    81	    signals.push({ name: "rollingAvg", value: avgNewInfo, stop: rollingStop, weight: 0.30 })
    82	    totalWeight += 0.30
    83	
    84	  // Signal 2: MAD noise floor (needs 4+ data points, excludes thought)
    85	  if len(evidenceIterations) >= 4:
    86	    allRatios = [i.newInfoRatio for i in evidenceIterations]
    87	    med = median(allRatios)
    88	    mad = median([abs(r - med) for r in allRatios])
    89	    noiseFloor = mad * 1.4826  // consistent estimator for normal distribution
    90	    latestRatio = iterations[-1].newInfoRatio
    91	    madStop = latestRatio <= noiseFloor
    92	    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.35 })
    93	    totalWeight += 0.35
    94	
    95	  // Signal 3: Question entropy coverage
    96	  answered = countAnswered(state.strategy.keyQuestions)
    97	  total = countTotal(state.strategy.keyQuestions)
    98	  if total > 0:
    99	    coverage = answered / total
   100	    entropyStop = coverage >= 0.85  // 85%+ questions answered signals saturation
   101	    signals.push({ name: "entropyCoverage", value: coverage, stop: entropyStop, weight: 0.35 })
   102	    totalWeight += 0.35
   103	
   104	  // Compute weighted stop score
   105	  if totalWeight > 0:
   106	    // Redistribute weights to active signals
   107	    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
   108	    if stopScore > 0.60:
   109	      return { action: "STOP", reason: "composite_converged", stopScore, signals }
   110	
   111	  // Default: continue
   112	  return { action: "CONTINUE", unansweredCount: unanswered, signals }
   113	```
   114	
   115	### 2.4 Quality Guard Protocol
   116	
   117	After composite convergence votes STOP but before the decision is finalized, three binary guards must pass. If any guard fails, the STOP is overridden to CONTINUE and violations are logged.
   118	
   119	| Guard | Rule | Fail Action |
   120	|-------|------|-------------|

exec
/bin/zsh -lc "nl -ba .opencode/agent/deep-research.md | sed -n '170,220p'; nl -ba .opencode/agent/deep-review.md | sed -n '240,270p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   170	```json
   171	{"type":"iteration","run":N,"status":"complete","focus":"[focus area]","findingsCount":N,"newInfoRatio":0.XX,"noveltyJustification":"1-sentence explanation of newInfoRatio","keyQuestions":["q1","q2"],"answeredQuestions":["q1"],"ruledOut":["approach1","approach2"],"focusTrack":"optional-track-label","toolsUsed":["Read","WebFetch"],"sourcesQueried":["https://example.com/doc","src/file.ts:42"],"timestamp":"ISO-8601","durationMs":NNNNN}
   172	```
   173	
   174	**Status values**: `complete | timeout | error | stuck | insight | thought`
   175	- `complete`: Normal iteration with evidence gathering and new findings
   176	- `timeout`: Iteration exceeded time/tool budget before finishing
   177	- `error`: Unrecoverable failure during iteration
   178	- `stuck`: No productive research avenues remain for current focus
   179	- `insight`: Low newInfoRatio but important conceptual breakthrough discovered (e.g., a synthesis that reframes prior findings)
   180	- `thought`: Analytical-only iteration with no external evidence gathering (e.g., consolidation, contradiction resolution, model-building)
   181	
   182	**Required fields** :
   183	- `noveltyJustification`: 1-sentence explanation of how newInfoRatio was calculated (e.g., "2 of 4 findings were new, 1 partially new")
   184	- `ruledOut`: Array of approaches tried and failed this iteration (may be empty `[]`)
   185	
   186	**Optional fields** :
   187	- `focusTrack`: Label tagging this iteration to a research track (e.g., "architecture", "performance", "security"). Useful for multi-track research where iterations alternate between topics.
   188	
   189	> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
   190	
   191	**newInfoRatio calculation**:
   192	- Count total findings in this iteration
   193	- Count how many are genuinely new (not in prior iterations or strategy)
   194	- Count partially new findings (adds nuance to known info) as 0.5
   195	- `newInfoRatio = (fully_new + 0.5 * partially_new) / total_findings`
   196	- If no findings at all, set to 0.0
   197	
   198	**Simplicity bonus**: If this iteration consolidates, simplifies, or resolves contradictions in prior findings -- even without new external information -- apply a +0.10 bonus to newInfoRatio (capped at 1.0). Simplification counts as genuine value:
   199	- Reducing the number of open questions through synthesis
   200	- Resolving contradictions between prior iteration findings
   201	- Providing a cleaner, more parsimonious model of the research topic
   202	
   203	#### Step 7: Update Research (Progressive)
   204	Read `research/deep-research-config.json` before touching `research/research.md`.
   205	- If `progressiveSynthesis == true`:
   206	  - If `research/research.md` exists, add new findings to relevant sections without removing prior content.
   207	  - If `research/research.md` does not exist yet, create it with initial findings.
   208	- If `progressiveSynthesis == false`:
   209	  - Do not create or update `research/research.md` during the iteration.
   210	  - Leave `research/research.md` ownership to the synthesis phase.
   211	
   212	#### Dashboard Awareness
   213	The orchestrator generates a research dashboard and findings registry after each iteration, summarizing progress, coverage, and convergence trends. The agent does not update those reducer-owned files directly. However, your iteration data (newInfoRatio, status, focus, ruledOut, focusTrack, toolsUsed, sourcesQueried) feeds directly into those synchronized outputs.
   214	
   215	---
   216	
   217	## 2. CAPABILITY SCAN
   218	
   219	### Tools
   220	
   240	- `timeout`: Iteration exceeded time/tool budget before finishing
   241	- `error`: Unrecoverable failure during iteration
   242	- `stuck`: No productive review avenues remain for current focus
   243	- `insight`: Low newFindingsRatio but important conceptual finding (e.g., cross-reference contradiction)
   244	- `thought`: Analytical-only iteration (e.g., severity reassessment, deduplication)
   245	
   246	**Required fields**:
   247	- `noveltyJustification`: 1-sentence explanation of how newFindingsRatio was calculated
   248	- `ruledOut`: Array of items investigated but not an issue this iteration (may be empty `[]`)
   249	
   250	**Optional fields**:
   251	- `focusTrack`: Label tagging this iteration to a review track (e.g., "security", "correctness")
   252	
   253	> **Note:** The orchestrator enriches each iteration record with optional `segment` (default: 1) and `convergenceSignals` fields after the agent writes it. The agent does not write these fields.
   254	
   255	**newFindingsRatio calculation (severity-weighted)**:
   256	```
   257	SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
   258	weightedNew = sum(weight for each fully new finding)
   259	weightedRefinement = sum(weight * 0.5 for each refinement finding)
   260	weightedTotal = sum(weight for all findings this iteration)
   261	newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
   262	```
   263	- If no findings at all, set to 0.0
   264	- **P0 override rule**: If ANY new P0 discovered, set `newFindingsRatio = max(calculated, 0.50)`. A single new P0 blocks convergence.
   265	
   266	---
   267	
   268	## 2. CAPABILITY SCAN
   269	
   270	### Tools

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md | sed -n '95,150p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    95	## Strategy Insights
    96	
    97	### What Worked
    98	
    99	1. **WebFetch for GitHub raw content** -- 9/10 reliability across all iterations
   100	2. **Pre-fetched reconnaissance** in Phase 0 gave agents a head start
   101	3. **Parallel wave execution** with pre-assigned iteration numbers -- no file conflicts
   102	4. **Strategy.md "Next Focus" guidance** effectively directed agents between waves
   103	5. **Wave pattern: breadth -> depth -> synthesis** produced well-structured knowledge
   104	6. **External literature survey** (iteration 004) brought in convergence algorithms from Optuna, NIST, pi-autoresearch PR
   105	7. **GitHub Issues API exploration** discovered the MAD confidence PR in pi-autoresearch
   106	8. **Direct execution fallback** when sub-agents failed (Round 2) -- the system adapted
   107	
   108	### What Failed
   109	
   110	1. **Tool call budget** (8-12) was too low -- all 6 agents exceeded it (used 16-34 calls). Realistic minimum: 15-25.
   111	2. **JSONL ordering** -- parallel execution produced out-of-order records (runs 2,3,1 instead of 1,2,3)
   112	3. **Phase 0 over-coverage** of AGR reduced Agent A's discovery ratio (0.55 vs 0.85 for fresh repos)
   113	4. **529 API overload** blocked all 6 sub-agent launches in Round 2 (2 retry attempts failed)
   114	5. **Empty GitHub API responses** for repos with no issues (AGR, autoresearch-opencode have few/no issues)
   115	
   116	### What Was Exhausted
   117	
   118	- README-level analysis of all 4 repos
   119	- Convergence detection search (confirmed: none exists in any fork)
   120	- Parallel execution search (confirmed: none implemented in any repo)
   121	- Source code deep dives of all 3 fork repos
   122	- Community issues/PRs analysis for all 4 repos (322+ issues)
   123	- Real execution data (JSONL schemas, worklog patterns, results.tsv format)
   124	- Karpathy fork ecosystem (top forks are hardware portability only, 1 generalizes)
   125	
   126	### Remaining Questions (from strategy.md)
   127	
   128	Strategy.md marks "DONE" -- all 17 questions (Q1-Q17) answered. However, these areas were noted as partially explored or surface-level:
   129	
   130	1. **Long-running session behavior** -- How does convergence algorithm perform across 20+ iterations? Only tested with 7 and 14.
   131	2. **Multi-segment interaction** -- Segment 2 was manually triggered. Automated segment triggers are undefined.
   132	3. **Breakthrough detection** -- Iteration 012 found convergence is non-linear (incremental -> breakthrough -> plateau). Post-breakthrough refinements typically fail. The system has no breakthrough detector.
   133	4. **darwin-derby patterns** -- The only "research on anything" fork (12 stars) was noted but not deeply analyzed.
   134	
   135	---
   136	
   137	## Research Gaps
   138	
   139	### Not Covered by Spec 023
   140	
   141	1. **Implementation validation** -- All 18 proposals are theoretical. None has been implemented and tested against real research sessions.
   142	2. **Threshold tuning** -- Composite convergence (P1.2) proposes a 0.60 consensus threshold and signal weights (0.30/0.35/0.35) but these are untested guesses.
   143	3. **Inter-proposal dependencies** -- P2.5 (branching) depends on P2.4 (segments), but other dependency chains are not mapped.
   144	4. **Negative interactions** -- Could tiered error recovery (P1.1) conflict with convergence detection (P1.2)? E.g., recovery keeping a session alive past natural convergence.
   145	5. **Question-coverage entropy** -- The most novel signal in P1.2, but no mathematical specification. How to compute "residual entropy" from strategy.md's question lists?
   146	6. **Tool call budget increase** -- Identified as needed (15-25 vs 8-12) but not formalized as a proposal.
   147	7. **JSONL ordering normalization** -- Identified as needed after parallel waves but not in the 18 proposals.
   148	8. **Performance baseline** -- No quantitative baseline for current system performance to measure improvements against.

exec
/bin/zsh -lc "nl -ba .opencode/agent/orchestrate.md | sed -n '260,285p'; nl -ba .opencode/agent/orchestrate.md | sed -n '628,642p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	**DEFAULT TO FOCUSED EXECUTION**. Prefer single-agent execution first; use parallel dispatch only when independent workstreams are substantial.
   261	- **NO Dependency + Small Scope:** Keep one agent and bundle related operations
   262	- **NO Dependency + Substantial Scope:** Use parallel dispatch (typically 2 agents)
   263	- **YES Dependency:** Run sequentially (e.g., "Research Pattern" → "Implement Pattern")
   264	
   265	**BIAS FOR FOCUS**: When uncertain, use fewer agents with broader scope.
   266	
   267	**DEFAULT PARALLEL CEILING: 2 agents maximum** unless the user explicitly requests more or DEG criteria justify expansion.
   268	
   269	**CWB CEILING** (§8): Parallel-first applies **within each wave**, not across all agents. When expansion is required for 10+ agents, dispatch in waves of 5 — each wave runs in parallel, but waves execute sequentially with synthesis between waves.
   270	
   271	| Agent Count | Parallel Behavior                                                      |
   272	| ----------- | ---------------------------------------------------------------------- |
   273	| 1-2         | Full parallel, no restrictions **(DEFAULT CEILING)**                   |
   274	| 3-6         | Requires explicit DEG justification; prefer concise returns            |
   275	| 7-12        | Requires user override. Parallel within waves of 5, sequential between |
   276	
   277	### Sub-Orchestrator Pattern (Disabled)
   278	
   279	Sub-orchestrator fan-out is disabled in this Copilot profile because nested dispatch is illegal. When work is large, keep orchestration at depth 0 and run additional waves directly from the top-level orchestrator.
   280	
   281	### Conditional Branching
   282	
   283	Enable result-dependent task routing. Add a `Branch` field to the task format:
   284	
   285	```
   628	
   629	**Pre-Dispatch (MANDATORY for 5+ agents):** Count agents → look up collection mode → add Output Size + Write To constraints to every dispatch (§3).
   630	
   631	#### Collection Pattern Details
   632	
   633	- **Pattern A (1-3):** Standard parallel dispatch. Collect full results directly and synthesize.
   634	- **Pattern B (5-9):** Instruct each agent: "Return ONLY: (1) 3 key findings, (2) file paths found, (3) issues detected." Dispatch follow-up for deeper detail.
   635	- **Pattern C (10-20):** Agents write to `[spec-folder]/scratch/agent-N-[topic].md`, return 3-line summary. Between waves of 5, compress findings into running synthesis (~500 tokens) before next wave.
   636	
   637	#### CWB Enforcement Points
   638	
   639	| Step                | Check                                 | Action if Violated                        |
   640	| ------------------- | ------------------------------------- | ----------------------------------------- |
   641	| Step 5 (CWB CHECK)  | Agent count exceeds 4?                | Switch to summary-only or file-based mode |
   642	| Step 6 (DELEGATE)   | Dispatch includes output constraints? | HALT - add constraints before dispatching |

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md | sed -n '1,70p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Iteration 006 — gpt-researcher: Multi-Agent Decomposition
     2	
     3	## Focus
     4	Q6: Multi-agent decomposition patterns
     5	
     6	## Findings
     7	### 1. Planner-owned section sharding is the main decomposition pattern
     8	GPT Researcher documents a planner/executor/publisher architecture, then implements it as a Chief Editor workflow that runs `browser -> planner -> researcher -> writer -> publisher`. The planner turns initial research into a section list, and the editor dispatches one research subworkflow per section. This is a meaningful delta from Wave 1's mostly single-loop patterns because decomposition happens by report shard, not only by iteration. Inference: `sk-deep-research` could preserve its LEAF agent while letting the orchestrator generate branch briefs and merge branch outputs. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:54-67] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/orchestrator.py:52-81] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:22-50] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:175-210] [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md:47-58]
     9	
    10	### 2. Parallel agents coordinate by working on isolated shard inputs, then merging once
    11	The LangGraph editor creates one task input per section with only `task`, `topic`, and `title`, runs those tasks with `asyncio.gather`, and merges only the returned drafts. That is a low-conflict parallelism pattern: workers do not co-edit shared planning state while running. This matters for us because the current skill is explicitly LEAF-only and still treats wave orchestration as reference-only. Inference: if we add parallel fan-out later, the safe model is orchestrator-owned merge files plus immutable shard briefs, not shared `strategy.md` mutation by parallel workers. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:161-168] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:230-246]
    12	
    13	### 3. The deep-research traversal is a hybrid: concurrent breadth fan-out, then recursive drill-down
    14	`DeepResearchSkill` generates multiple search queries, runs them under a semaphore, gathers the whole breadth layer, then recurses on each result with reduced breadth (`max(2, breadth // 2)`) and lower depth. That is not a pure breadth-first or depth-first tree; it is a batched fan-out followed by per-branch drilling. This is new versus Wave 1 because it provides a concrete depth/breadth policy rather than only branch labels or round transitions. Inference: `sk-deep-research` could borrow a frontier policy like this without adopting persistent live branch state. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:213-220] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:223-237] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:296-345]
    15	
    16	### 4. Quality control is embedded as a shard-local review loop before final synthesis
    17	The multi-agent path does not only parallelize research; it wraps each section in a local `researcher -> reviewer -> reviser` loop, and the AG2 version makes the loop bound explicit with `max_revisions`. That is a stronger decomposition pattern than Wave 1's global guard-metric ideas because the review happens at the unit of decomposition before synthesis. Inference: a future `sk-deep-research` upgrade could add an optional reviewer pass over each iteration or track before findings count toward convergence. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/docs/docs/gpt-researcher/multi_agents/langgraph.md:14-48] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:126-144] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/README.md:46-56] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/agents/orchestrator.py:137-169]
    18	
    19	### 5. Report generation is its own pipeline, with source curation and citation rules separated from search
    20	GPT Researcher keeps report writing and publishing as distinct stages: the writer builds introduction/conclusion/table of contents/source list from `research_data`, the publisher renders the assembled layout to output formats, and the prompt stack requires in-text citations, deduplicated references, branch integration, and preference for reliable/recent sources. Upstream of that, source curation can rank scraped material by relevance, credibility, currency, objectivity, and quantitative value before report generation. This is a real delta from Wave 1: not just better looping, but a multi-stage synthesis pipeline that could improve `research/research.md` quality without changing the LEAF contract. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/writer.py:32-67] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/publisher.py:16-61] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/researcher.py:193-197] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py:15-20] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py:33-85] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py:273-312] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py:414-483]
    21	
    22	## Delta From Wave 1
    23	- New patterns not in Wave 1: planner-owned section sharding; immutable shard briefs plus merge-at-end parallelism; hybrid breadth-fan-out then recursive drill-down traversal; shard-local reviewer/reviser loops; separate writer/publisher/source-curation pipeline.
    24	- Confirms Wave 1 findings: quality protection should sit on top of search rather than only at stop time; final synthesis deserves its own workflow stage; live branch history is not required to get multi-angle coverage. [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md:12-19] [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md:145-156]
    25	- Contradicts Wave 1 findings: none directly. If anything, gpt-researcher further weakens the case for making persistent live branch state a first upgrade, because most of its decomposition value comes from planner-owned shards and merge stages rather than durable branch ledgers. [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md:147-155] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:242-246]
    26	
    27	## Sources Consulted
    28	- `/tmp/deep-research-029-wave2/gpt-researcher/README.md`
    29	- `/tmp/deep-research-029-wave2/gpt-researcher/docs/docs/gpt-researcher/multi_agents/langgraph.md`
    30	- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py`
    31	- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py`
    32	- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/researcher.py`
    33	- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py`
    34	- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/orchestrator.py`
    35	- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py`
    36	- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/writer.py`
    37	- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/publisher.py`
    38	- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/README.md`
    39	- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/agents/orchestrator.py`
    40	- `.opencode/skill/sk-deep-research/SKILL.md`
    41	- `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md`
    42	
    43	## Assessment
    44	- newInfoRatio: 0.77
    45	- findingsCount: 5
    46	- status: complete
    47	- keyInsights: planner-owned shard orchestration is the cleanest transferable multi-agent pattern; the tree search uses hybrid breadth fan-out plus recursive drill-down rather than pure BFS or DFS; source curation plus a dedicated synthesis pipeline is a bigger delta than persistent branch state.
    48	
    49	## Questions Answered
    50	- Q6: gpt-researcher adds a practical multi-agent decomposition model: planner-owned section sharding, parallel shard execution, shard-local review/revision, hybrid tree traversal, and a separate source-curation plus report-publication pipeline.
    51	
    52	## New Questions Raised
    53	- If we keep `@deep-research` LEAF-only, should the orchestrator create temporary shard briefs and aggregate shard findings into `research/research.md` after a merge pass?
    54	- Should review happen per iteration, per focus track, or only as a final synthesis gate?
    55	- Would a frontier queue with bounded parallel shards be simpler than activating full live segments or branch state?

web search: 
web search: LangGraph official docs parallel nodes shared state Send reducer StateGraph
web search: 
web search: LangGraph parallel branch shared state official Send reducer StateGraph
web search: 
web search: site:microsoft.github.io/autogen stable docs parallel team shared context AutoGen
web search: 
web search: site:docs.crewai.com parallel flows crewai shared state event driven
web search: 
web search: https://docs.langchain.com/oss/javascript/langgraph/graph-api
web search: 
web search: 'all of those destination nodes will be executed in parallel' in https://docs.langchain.com/oss/javascript/langgraph/graph-api
web search: 
web search: 'State Management' in https://docs.crewai.com/en/concepts/flows
codex
I’m into the design-specific questions now: segmentation, convergence, and merge semantics. The current implementation already has reducer-owned registry/dashboard state and optional per-iteration `segment` enrichment, so I’m checking whether hotspot and clustering recommendations can hook into those existing contracts instead of inventing a parallel-only side channel.
exec
/bin/zsh -lc "rg -n \"review_scope_files|filesReviewed|review_target_type|dimension_queue|traceabilityChecks|coverage_age|crossReferenceProtocols\" .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/agent/deep-review.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/agent/deep-review.md:235:{"type":"iteration","mode":"review","run":N,"status":"complete","focus":"[dimension - specific area]","dimension":"[dimension name]","dimensions":["[dimension name]"],"findingsCount":N,"newFindingsRatio":0.XX,"noveltyJustification":"...","findingsSummary":{"P0":N,"P1":N,"P2":N},"filesReviewed":["file1","file2"],"dimensionScores":{"correctness":N,"security":N,"traceability":N,"maintainability":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"findingsRefined":{"P0":N,"P1":N,"P2":N},"upgrades":[],"resolved":[],"findingRefs":["P1-001","P2-003"],"traceabilityChecks":{"summary":{"required":N,"executed":N,"pass":N,"partial":N,"fail":N,"blocked":N,"notApplicable":N,"gatingFailures":N},"results":[{"protocolId":"spec_code","status":"pass|partial|fail","gateClass":"hard|advisory","applicable":true,"counts":{"pass":N,"partial":N,"fail":N},"evidence":["path/to/file:line"],"findingRefs":["P1-001"],"summary":"One-line traceability result."}]},"coverage":{"filesReviewed":N,"filesTotal":N,"dimensionsComplete":[]},"ruledOut":["investigated-not-issue"],"focusTrack":"optional","timestamp":"ISO-8601","durationMs":NNNNN}
.opencode/agent/deep-review.md:486:[x] traceabilityChecks recorded when protocol evidence was reviewed
.opencode/skill/sk-deep-review/references/loop_protocol.md:146:- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
.opencode/skill/sk-deep-review/references/loop_protocol.md:254:During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.
.opencode/skill/sk-deep-review/references/loop_protocol.md:282:   - `filesReviewed` (array of file paths)
.opencode/skill/sk-deep-review/references/loop_protocol.md:285:   - `traceabilityChecks` (protocol results if applicable)
.opencode/skill/sk-deep-review/references/loop_protocol.md:366:  if hasRequiredProtocolPlateau(state.traceabilityChecks):
.opencode/skill/sk-deep-review/references/loop_protocol.md:409:3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:30:  review_target_type: "[spec-folder|skill|agent|track|files] - Target type for scope derivation. REQUIRED."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:107:          - required_values_present: [review_target, review_target_type, review_dimensions, spec_folder, max_iterations, convergence_threshold]
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:209:          - review_scope_files: "List of all files in review scope"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:222:          5. Store ordered list as dimension_queue
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:224:          - dimension_queue: "Ordered list of dimensions to review"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:239:          reviewTargetType: "{review_target_type}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:242:          reviewScopeFiles: "{review_scope_files}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260:        content: '{"type":"config","mode":"review","reviewTarget":"{review_target}","reviewTargetType":"{review_target_type}","reviewDimensions":"{review_dimensions}","sessionId":"{ISO_8601_NOW}","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:273:          review_target_type: "{review_target_type}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:274:          dimensions: "{dimension_queue}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:275:          scope_files: "{review_scope_files}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:288:        log: "Initialization complete. Config, state, and strategy files created. Review scope: {review_scope_files_count} files, {dimension_queue_count} dimensions."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:314:          - next_dimension: "Next uncovered dimension from dimension_queue in strategy.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:318:          - coverage_age: "Iterations since dimension coverage last changed; require >= 1 before STOP"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:340:             b) if all dimensions clean AND required traceability protocols are covered AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass (evidence: every P0/P1 has file:line; scope: all findings within target; coverage: all dimensions reviewed): STOP (all_dimensions_clean)
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:353:                  stop if coverage >= 1.0 AND required traceability protocols are covered AND coverage_age >= 1
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:360:               c) Coverage: Configured dimensions and required traceability protocols covered, with coverage_age >= 1
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:395:          Coverage Age: {coverage_age}
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:412:            REVIEW SCOPE FILES: {review_scope_files}
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:434:            CONSTRAINT: Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, and newFindingsRatio.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:455:          append_jsonl: '{"type":"iteration","run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:489:          - Review Target: {review_target} ({review_target_type})
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:510:          | [per protocol from traceabilityChecks] |

exec
/bin/zsh -lc "rg -n \"hotspot|hotspots|authority|cluster|clustering|dependency cluster|import count|git blame|fan-out|prune|promote|segment planner|coordination board\" .opencode/specs/skilled-agent-orchestration .opencode/skill .opencode/command | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/command/create/agent.md:284:[1-2 sentence intro based on purpose and authority]
.opencode/command/create/assets/create_agent_confirm.yaml:213:      enforcement: "MUST gather purpose, use cases, and authority"
.opencode/command/create/assets/create_agent_confirm.yaml:249:      purpose: "Capture the agent purpose, use cases, and operating authority"
.opencode/command/create/assets/create_agent_confirm.yaml:353:    purpose: Gather purpose, use cases, and authority (CRITICAL - DO NOT SKIP)
.opencode/command/create/assets/create_agent_confirm.yaml:359:    - Define authority and scope
.opencode/command/create/assets/create_agent_confirm.yaml:379:    - authority_defined: "scope and decision-making power"
.opencode/command/create/assets/create_agent_confirm.yaml:708:      promotion_note: "Use memory_update() to promote to 'critical' if this agent becomes widely used"
.opencode/command/create/assets/create_folder_readme_auto.yaml:702:      promotion_note: "Use memory_update() to promote to 'important' if README becomes a key reference"
.opencode/command/create/assets/create_folder_readme_auto.yaml:1159:      promotion_note: "Use memory_update() to promote to 'critical' if this becomes a frequently referenced guide"
.opencode/skill/cli-gemini/SKILL.md:454:- Keep Smart Routing (Section 2) as the single routing authority
.opencode/command/create/assets/create_agent_auto.yaml:198:      enforcement: "MUST gather purpose, use cases, and authority"
.opencode/command/create/assets/create_agent_auto.yaml:234:      purpose: "Capture the agent purpose, use cases, and operating authority"
.opencode/command/create/assets/create_agent_auto.yaml:317:    purpose: Gather purpose, use cases, and authority (CRITICAL - DO NOT SKIP)
.opencode/command/create/assets/create_agent_auto.yaml:323:    - Define authority and scope
.opencode/command/create/assets/create_agent_auto.yaml:343:    - authority_defined: "scope and decision-making power"
.opencode/command/create/assets/create_agent_auto.yaml:620:      promotion_note: "Use memory_update() to promote to 'critical' if this agent becomes widely used"
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:188:      step_promote_candidate:
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:191:        command: "node .opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs --candidate={candidate_path} --target={target_path} --score={score_output_path} --benchmark-report={benchmark_output_path} --repeatability-report={repeatability_output_path} --config={spec_folder}/improvement/agent-improvement-config.json --manifest={spec_folder}/improvement/target-manifest.jsonc --archive-dir={spec_folder}/improvement/archive --approve"
.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:200:        description: "Recommend continue, promote, or stop based on reducer output"
.opencode/specs/skilled-agent-orchestration/035-sk-deep-research-path-migration/spec.md:125:| REQ-013 | Keep review indexing semantics stable | Review iteration artifacts remain excluded working artifacts and the review report does not become a newly promoted spec-doc type unless a consumer proves that necessary |
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:6:action: Scan integration surfaces, generate dynamic profiles, score candidates across 5 dimensions, reduce evidence, and decide keep/reject/promote
.opencode/command/improve/assets/improve_agent-improver_auto.yaml:166:        description: "Recommend continue, promote, or stop based on reducer output"
.opencode/command/create/assets/create_folder_readme_confirm.yaml:704:      promotion_note: "Use memory_update() to promote to 'important' if README becomes a key reference"
.opencode/command/create/assets/create_folder_readme_confirm.yaml:1254:      promotion_note: "Use memory_update() to promote to 'critical' if this becomes a frequently referenced guide"
.opencode/command/improve/README.txt:116:Synthesis: final dashboard, recommendation (continue / promote / stop)
.opencode/skill/cli-gemini/references/agent_delegation.md:297:| Spec folder docs | @speckit | (none) | Exclusive spec authority |
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-005.md:145:4. Optional overlay protocols should never block convergence by default; they enrich the final report unless the active target type promotes them to required overlays.
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-005.md:146:5. For `agent` targets, `agent_cross_runtime` should be promoted from advisory overlay to convergence gate because runtime inconsistency is a contract contradiction, not a documentation nicety.
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:130:- Findings tend to cluster by dimension (security pass may find 0, correctness pass may find 5)
.opencode/command/improve/agent.md:292:- Recommendation: continue, promote (if eligible), or stop
.opencode/command/improve/agent.md:400:- Promoted a non-eligible target (only handover with static profile can promote)
.opencode/specs/skilled-agent-orchestration/033-skill-command-readme-rewrite/checklist.md:87:- [x] CHK-051 [P1] No temporary artifacts were promoted into packet docs as fake repo files [Reference review]
.opencode/skill/cli-copilot/assets/prompt_templates.md:252:copilot -p "Generate Terraform modules for an AWS EKS cluster. Requirements: private subnets, OIDC enabled, and managed node groups. Follow security best practices for AWS." \
.opencode/skill/cli-copilot/assets/prompt_templates.md:304:| `[cloud-resource]` | Cloud infrastructure resource | `"AWS EKS cluster"`, `"GCP Cloud Run"` |
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-008.md:24:- Optional preflight: orchestrator may run one `@review` pass before iteration 1 to seed hotspots and candidate findings.
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/research.md:118:- Overlay protocols → advisory unless target type promotes them to required
.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/research.md:186:- Optional: @review preflight pass seeds hotspots before deep review loop
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/spec.md:72:- Wave orchestration / parallel agent fan-out (P2.5) — flagged as Large effort, track only
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:535:      - "Score wave results by median newInfoRatio and promote top branches."
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-repo-recon.md:193:- **Ideas backlog**: Append to `autoresearch.ideas.md` when discovering complex ideas not worth pursuing immediately. On resume, prune stale/tried entries and experiment with the rest.
.opencode/skill/sk-git/assets/worktree_checklist.md:312:git worktree prune
.opencode/skill/sk-git/assets/worktree_checklist.md:391:git worktree prune
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-001.md:21:ResearcherSkill gives the agent a named library of ten move types: ablation, amplification, combination, inversion, isolation, analogy, simplification, scaling, decomposition, and sweep. The text frames them as tools rather than rigid rails, which keeps autonomy while still making search behavior legible. Our current stuck recovery is much narrower: try opposites, combine prior findings, or audit low-value iterations, selected from a small routing function. That is useful for recovery, but it is not a full strategy language for the whole loop. A practical improvement would be to promote strategy selection into a first-class field in state, so each iteration can declare a strategy such as `isolation` or `decomposition`, and the orchestrator can later analyze which moves are productive for which research topics. [SOURCE: /tmp/deep-research-029/ResearcherSkill/researcher.md:173-188; .opencode/skill/sk-deep-research/references/convergence.md:278-321]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:11:The LangGraph editor creates one task input per section with only `task`, `topic`, and `title`, runs those tasks with `asyncio.gather`, and merges only the returned drafts. That is a low-conflict parallelism pattern: workers do not co-edit shared planning state while running. This matters for us because the current skill is explicitly LEAF-only and still treats wave orchestration as reference-only. Inference: if we add parallel fan-out later, the safe model is orchestrator-owned merge files plus immutable shard briefs, not shared `strategy.md` mutation by parallel workers. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:161-168] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:230-246]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:13:### 3. The deep-research traversal is a hybrid: concurrent breadth fan-out, then recursive drill-down
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:14:`DeepResearchSkill` generates multiple search queries, runs them under a semaphore, gathers the whole breadth layer, then recurses on each result with reduced breadth (`max(2, breadth // 2)`) and lower depth. That is not a pure breadth-first or depth-first tree; it is a batched fan-out followed by per-branch drilling. This is new versus Wave 1 because it provides a concrete depth/breadth policy rather than only branch labels or round transitions. Inference: `sk-deep-research` could borrow a frontier policy like this without adopting persistent live branch state. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:213-220] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:223-237] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:296-345]
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:23:- New patterns not in Wave 1: planner-owned section sharding; immutable shard briefs plus merge-at-end parallelism; hybrid breadth-fan-out then recursive drill-down traversal; shard-local reviewer/reviser loops; separate writer/publisher/source-curation pipeline.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-006.md:47:- keyInsights: planner-owned shard orchestration is the cleanest transferable multi-agent pattern; the tree search uses hybrid breadth fan-out plus recursive drill-down rather than pure BFS or DFS; source curation plus a dedicated synthesis pipeline is a bigger delta than persistent branch state.
.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:508:      promotion_note: "Use memory_update() to promote to 'important' or 'critical' if warranted"
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md:302:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `step_check_convergence` | Wire comparative signal as advisory (not voting) initially; promote to 5th signal after validation data collected |
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-002.md:19:The core `autoresearch` constraint is short and memorable: "one file, one metric, one loop." In practice, that means a single editable file, a single measurable outcome, and a tightly bounded search space. `sk-deep-research` already has "one focus per iteration," but that is weaker than `autoresearch`'s overall run-level constraint. A useful upgrade would be to define one bounded research segment per round: one question cluster, one success scorecard, and one allowed evidence surface. That would reduce broad drift across long runs and make each segment easier to evaluate afterward. In other words, import the constraint discipline, not the literal single-file rule.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-002.md:63:`autoresearch-discover` is not just a convenience command; it formalizes how to find good optimization targets before launching an expensive unattended loop. It ranks candidates by tunability, metric clarity, eval feasibility, and likely impact. `sk-deep-research` currently initializes 3-5 key questions, but it does not have a discovery-oriented preflight that scores which question clusters or source domains are most researchable before the loop begins. A sibling mode like `deep-research-discover` could scan a topic or codebase for high-yield question clusters, available evidence surfaces, likely dead ends, and evaluation feasibility, then recommend the best starting focus for the main loop.
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/spec.md:91:- P2.5: Scored Branching with Pruning -- score parallel branches, prune low-value, breakthrough detection
.opencode/skill/sk-git/SKILL.md:345:3. **Worktree directory is locked or corrupted** - May require manual cleanup with `git worktree prune`
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-007.md:43:- Best recovered results are promoted back into Stage 14 so downstream writing uses the strongest available evidence.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-007.md:47:### Finding 5: Citation hygiene is implemented as a real verification-and-prune stage
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-007.md:52:- The pipeline also runs an LLM topical-relevance filter, drops low-relevance citations, enforces a hard bibliography cap, prunes uncited entries, and removes hallucinated or low-relevance inline citations from the paper.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/iterations/iteration-007.md:55:- **Transferable pattern**: If references matter, treat them as verifiable artifacts with a post-generation filter/prune step.
.opencode/skill/sk-git/README.md:353:| Worktree directory is locked or shows "already exists" | Previous worktree was not cleanly removed | Run `git worktree prune` then retry creation |
.opencode/skill/sk-git/README.md:379:A: Run `git worktree list` to see all active worktrees. Remove the stale one with `git worktree remove .worktrees/branch-name`. Then delete the local branch with `git branch -d branch-name` and the remote tracking branch with `git push origin --delete branch-name`. Run `git worktree prune` to clean up any metadata.
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/research/iterations/iteration-006.md:51:Optuna (hyperparameter optimization framework) implements two pruners relevant to our system:
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/research/iterations/iteration-006.md:53:- **PatientPruner:** A META-pruner that wraps another pruner and adds tolerance. The inner pruner votes "stop" but PatientPruner requires N consecutive stop votes before actually stopping. This is patience-on-top-of-convergence -- exactly what our composite algorithm does with its consensus threshold (0.60), but Optuna separates the concerns into composable layers.
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/research/iterations/iteration-006.md:59:[SOURCE: https://optuna.readthedocs.io/en/stable/reference/pruners.html -- Optuna pruners API]
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/research/iterations/iteration-006.md:113:- https://optuna.readthedocs.io/en/stable/reference/pruners.html -- Optuna pruners module
.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:554:      promotion_note: "Use memory_update() to promote to 'important' or 'critical' if warranted"
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:114:5. **Hypothesis strategy library** — 10 named move types (ablation, amplification, combination, inversion, isolation, analogy, simplification, scaling, decomposition, sweep). Our recovery has only 3 strategies. Upgrade: promote strategy selection to a first-class state field.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:130:2. **Bounded research-segment contract** — "One file, one metric, one loop" adapted to research = one question cluster, one success scorecard, one evidence surface per round. Upgrade: define bounded research segments with explicit constraints.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:140:7. **Discovery skill** — Preflight scan for good optimization targets before expensive loop. Our init generates questions but doesn't score researchability. Upgrade: add discovery/preflight scoring of question clusters and evidence surfaces.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:247:- **Key difference from original:** Does NOT promote full segment/branch support to live. Our "Next Focus" mechanism already handles direction changes. Formal branching conflates code-state branching (git-backed) with research-direction changes (focus-based).
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:276:- **Bounded research segments** — One question cluster + one scorecard + one evidence surface per round.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:277:- **Discovery/preflight mode** — Score question clusters and evidence surfaces for researchability before committing to a loop.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:392:4. **Negative knowledge promoted P1→P0** — Template change with near-zero cost and immediate synthesis value.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:420:- **Implication:** If we add parallel fan-out, use immutable shard briefs + merge-at-end, not shared strategy.md mutation.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:427:When experiments fail, a diagnosis system classifies the failure mode (missing deps, OOM, code crash, etc.), builds targeted repair prompts, runs bounded repair cycles, and promotes the best recovered state forward.
.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade/research/research.md:435:Real API-backed verification: DOI/CrossRef lookup, OpenAlex title search, arXiv search. Citations classified as VERIFIED/SUSPICIOUS/HALLUCINATED. Bad citations pruned from final output.
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/research/iterations/iteration-003.md:55:| **P2.5 Scored Branching with Pruning** | NOT IMPLEMENTED | The YAML workflow's reference_only_appendix mentions wave_orchestration (lines 459-465) with parallel dispatch, median newInfoRatio scoring, and top-branch promotion. State_format.md defines `wave_complete`, `wave_pruned`, and `breakthrough` event types. But all are explicitly "reference-only". No live workflow step implements scoring or pruning. The proposals's "score which parallel branches yielded the most information" logic does not exist in any runnable form. |
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/scratch/improvement-proposals.md:130:**Implementation sketch**: Extend the wave orchestration protocol: (1) Wave 1 dispatches N agents on independent questions; (2) After Wave 1 completes, rank all questions by their iteration's newInfoRatio; (3) Wave 2 dispatches follow-up agents for the top-K questions (K = ceil(N/2)), pruning low-value branches; (4) Repeat until convergence. This requires the orchestrator to implement a scoring+dispatch loop rather than pre-assigning all iteration focuses. The pruning threshold should be configurable (default: prune questions with newInfoRatio below the median of Wave 1 results).
.opencode/skill/sk-git/references/quick_reference.md:291:git worktree prune                     # Clean stale refs
.opencode/skill/sk-git/references/quick_reference.md:350:| Worktree creation fails | Check `git worktree list`, remove stale, `git worktree prune` |
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/tasks.md:179:  - Extend wave orchestration: Wave 1 → score all branches by newInfoRatio → Wave 2 prunes below-median
.opencode/skill/sk-git/references/finish_workflows.md:917:git worktree prune
.opencode/skill/sk-git/references/worktree_workflows.md:519:git worktree prune
.opencode/skill/sk-git/references/shared_patterns.md:127:git worktree prune
.opencode/skill/sk-git/references/shared_patterns.md:571:git worktree prune
.opencode/skill/cli-claude-code/SKILL.md:507:- Keep Smart Routing (Section 2) as the single routing authority
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/research/iterations/iteration-004.md:37:Ray Tune's `ExperimentPlateauStopper` uses a statistical clustering approach: monitor the **standard deviation among the top-K best results**. When std falls below a threshold (default 0.001) for `patience` consecutive checks, the experiment stops. Parameters:
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/research/iterations/iteration-004.md:42:This approach detects when the "frontier" of best results has clustered, meaning no more diversity in outcomes. It is model-free and requires no Gaussian Process fitting.
.opencode/specs/skilled-agent-orchestration/z_archive/018-sk-code-opencode-refinement/scratch/agent-2-139-quality-patterns.md:5:2. **Deep-mode pipeline-to-context fan-out gaps (FM-02) coupled with deferred handler coverage (FM-06).** Deep-mode expansion only activates when `memory_context` passes `'deep'`, but propagation tests and handler suites defer the core ranking paths, leaving repeated regression risk when hybrid search wiring changes. Source: same research doc (FM-02 + Test Coverage Observations).
.opencode/command/memory/manage.md:1138:> Memories with high confidence and validation counts may be promoted to critical tier via learned feedback.
.opencode/command/memory/manage.md:1170:3. After restore, manually re-promote critical rules if needed
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/research/iterations/iteration-014.md:67:- NEW: After a breakthrough iteration (newInfoRatio spike), DON'T prune that branch's refinements -- instead, explore ADJACENT branches (new questions suggested by the breakthrough)
.opencode/skill/cli-codex/SKILL.md:527:- Keep Smart Routing (Section 2) as the single routing authority
.opencode/skill/sk-doc/assets/agents/agent_template.md:10:Agents are specialized AI personas with defined authorities, tool permissions, and behavioral rules. Unlike skills (which provide knowledge and workflows), agents have **authority** to act and **tools** to execute.
.opencode/skill/sk-doc/assets/agents/agent_template.md:16:| **Purpose**     | Persona with authority to act           | Knowledge/workflow bundle    |
.opencode/skill/sk-doc/assets/agents/agent_template.md:28:- **Specialized persona** - A distinct role with defined authority
.opencode/skill/sk-doc/assets/agents/agent_template.md:328:[1-2 sentence description of the agent's purpose and authority.]
.opencode/skill/sk-doc/assets/agents/agent_template.md:352:Code review specialist with full authority over pattern validation, quality scoring, and standards enforcement.
.opencode/skill/sk-doc/assets/agents/agent_template.md:370:description: [One-line description of agent purpose and authority]
.opencode/skill/sk-doc/assets/agents/agent_template.md:391:[1-2 sentence description of the agent's purpose and authority.]
.opencode/skill/sk-doc/assets/agents/agent_template.md:679:- [ ] Summary ASCII box captures authority, workflow, limits
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/research/iterations/iteration-005.md:230:| 7 | **Scored branching with pruning** -- Extend parallel wave execution: score questions by newInfoRatio, prune low-value branches, spawn follow-ups for top-K | None (novel synthesis) | High | High | P2 | No external repo has this. Leverages our existing parallel wave advantage. High effort but unique capability. |
.opencode/skill/cli-claude-code/references/agent_delegation.md:226:claude -p "Compare Redis vs Memcached for our session storage needs. Consider: performance, clustering, persistence, data structures." \
.opencode/command/agent_router.md:54:**Core Principle:** The router BECOMES the target agent. After loading the System Prompt, you ARE that agent and execute directly with full authority.
.opencode/command/agent_router.md:318:   - You operate with full authority of that agent
.opencode/command/agent_router.md:396:- You have full authority to use all available tools
.opencode/command/agent_router.md:482:| Execute directly with full authority                  | Single primary agent architecture   |
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/research/iterations/iteration-011.md:71:This directly validates our Q9 finding (no branching/tree search) and P2.5 (Scored Branching with Pruning). The community solution is prompt-based nudging; our proposed solution is structural (score branches, prune low-value ones, allocate more iterations to high-value branches).
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:33:- Headline multipliers stay blocked unless prompt, completion, cache-read, and cache-write token fields all have `provider_counted` authority. Later packets should reuse `canPublishMultiplier()` instead of inventing packet-local gates.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:43:| `SPECKIT_EXTENDED_TELEMETRY` | Adds more detailed telemetry for later analysis, but does not change certainty or authority requirements. |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:45:| `SPECKIT_ABLATION` | Enables ablation studies, but any exported savings story still needs provider-counted authority plus methodology metadata. |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | string | Adaptive ranking mode: `shadow` (compute but do not apply) or `promoted` (apply to ranking). | `lib/cognitive/adaptive-ranking.ts` |
.opencode/skill/cli-codex/references/agent_delegation.md:363:| Spec folder docs         | @speckit               | (none)               | Exclusive spec authority             |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:3:description: "Define an offline replay and optimization loop that scores historical deep-loop runs, searches for better configurations, and promotes only replay-verified improvements into production."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:22:Phase 004 builds the offline compile/evaluate loop for deep research and deep review. It uses historical packet traces to score real behavior, search for better thresholds and prompts, replay those candidates deterministically, and promote only the candidates that improve baseline outcomes without breaking existing parity and behavioral gates.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:69:Define an offline replay optimizer that learns from real packet families, scores run quality against a shared rubric, searches for better configurations, and only promotes configurations that beat baseline behavior under deterministic replay plus existing parity and behavioral tests.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:89:- Replacing human review of promoted configs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:101:| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and enforce promotion gates. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:112:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify promotion gating, rollback behavior, and audit output. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:239:- As a release reviewer, I want every promoted candidate to show baseline comparison, audit reasoning, and passing test gates so promotion feels safe.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:34:This phase creates the deep-loop equivalent of an offline compiler: harvest real traces, score them with a rubric, search bounded config space, replay candidates deterministically, and only promote candidates that beat baseline without breaking existing safety nets. The sequence is intentionally conservative so governance and replay fidelity arrive before any config is considered promotable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:136:- `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:137:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:179:- **Trigger**: Replay fidelity is insufficient, rubric scoring is untrustworthy, or promoted candidates cannot stay within bounded config surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:108:| T008 | Pending | REQ-004, REQ-006 | `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:110:| T010 | Pending | REQ-004, REQ-007 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:111:| T011 | Pending | REQ-004, REQ-006, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/decision-record.md:340:| Markdown-only coordination board | Easy to read | Weak for dedupe/conflict/resource logic | 5/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/decision-record.md:618:**How it works**: Recovery escalates through five bounded tiers: query reformulation, authority/source diversification, decomposition or clustering, contradiction-resolution/adjudication, and graceful partial closeout. Each tier records why it was selected, what changed, and whether it helped so later replay or offline tuning can learn from it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:10:  - "coordination board"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:78:- Optional, explicit advanced modes: council-style synthesis and packet-level coordination boards for large multi-phase research.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:98:| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:101:| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add coverage/depth, domain clustering, promotion checkpoints, semantic convergence, and council/coordination planning sections. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:105:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:111:| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:122:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, inventory/hotspot workflow steps, and resume-from-run handling. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:129:| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:130:| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:147:| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:148:| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:176:| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:182:| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:193:- **SC-002**: The packet separates foundational runtime work from optional advanced modes, with council synthesis and coordination boards explicitly marked opt-in.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:215:6. **Given** a normal loop run, **When** council synthesis or a coordination board is not explicitly requested, **Then** no advanced-mode artifacts are created.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:229:| Risk | Council mode or coordination board becomes a default-path distraction | Medium | Mark both features explicitly opt-in and put them in the last delivery phase. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:266:- Claim has contradictory evidence across README and runtime code: ledger must mark `contradicted`, not silently promote the stronger claim.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:273:- Citation overlap is high within one research cluster but low across the full source set: cluster saturation cannot be treated as global convergence for 50+ domain research packets.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:274:- Review scope exceeds 1000 files with no hotspot ranking or stratified sampling plan: the workflow must force an inventory/decomposition step before claiming broad coverage.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:337:1. Given a normal research packet, when I run the default mode, then neither council synthesis nor the coordination board is required.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:346:- Q2: Should the coordination board live under `research/` as a large-run overlay or at the packet root as a cross-phase artifact?
.opencode/skill/sk-doc/assets/skill/skill_md_template.md:471:- Keep `SMART ROUTING` as the authority for loading rules.
.opencode/skill/sk-doc/assets/skill/skill_md_template.md:946:- Keep Smart Routing as the single routing authority.
.opencode/skill/sk-doc/assets/skill/skill_md_template.md:1051:8. Redundant routing tables → Keep routing authority in pseudocode
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:340:| Markdown-only coordination board | Easy to read | Weak for dedupe/conflict/resource logic | 5/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md:618:**How it works**: Recovery escalates through five bounded tiers: query reformulation, authority/source diversification, decomposition or clustering, contradiction-resolution/adjudication, and graceful partial closeout. Each tier records why it was selected, what changed, and whether it helped so later replay or offline tuning can learn from it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:10:  - "coordination board"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:78:- Optional, explicit advanced modes: council-style synthesis and packet-level coordination boards for large multi-phase research.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:98:| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:101:| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add coverage/depth, domain clustering, promotion checkpoints, semantic convergence, and council/coordination planning sections. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:105:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:111:| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:122:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, inventory/hotspot workflow steps, and resume-from-run handling. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:129:| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:130:| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:147:| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:148:| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:176:| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:182:| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:193:- **SC-002**: The packet separates foundational runtime work from optional advanced modes, with council synthesis and coordination boards explicitly marked opt-in.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:215:6. **Given** a normal loop run, **When** council synthesis or a coordination board is not explicitly requested, **Then** no advanced-mode artifacts are created.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:229:| Risk | Council mode or coordination board becomes a default-path distraction | Medium | Mark both features explicitly opt-in and put them in the last delivery phase. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:266:- Claim has contradictory evidence across README and runtime code: ledger must mark `contradicted`, not silently promote the stronger claim.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:273:- Citation overlap is high within one research cluster but low across the full source set: cluster saturation cannot be treated as global convergence for 50+ domain research packets.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:274:- Review scope exceeds 1000 files with no hotspot ranking or stratified sampling plan: the workflow must force an inventory/decomposition step before claiming broad coverage.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:337:1. Given a normal research packet, when I run the default mode, then neither council synthesis nor the coordination board is required.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:346:- Q2: Should the coordination board live under `research/` as a large-run overlay or at the packet root as a cross-phase artifact?
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:102:  -> packet-level coordination board
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:176:- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:182:**Why third**: Once the substrate is durable and observable, we can safely layer the trust surfaces that decide what evidence is promoted, what convergence means semantically, and which sections stay machine-owned.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:230:- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:231:- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:265:**Why last**: Council synthesis and coordination boards remain useful only after the default runtime path is durable, observable, behavior-tested, and parity-locked.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:312:| Large-target decomposition path | Prove review inventory/hotspot ranking and research domain clustering activate only for large scopes | Strategy/decomposition artifact plus fixture outputs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:365:- `in-progress`: name the active phase, requirement cluster, and target files.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:459:| M5: Optional Modes on Trusted Base | Council synthesis and coordination boards stay explicit opt-ins on top of the parity-locked runtime | Phase 5 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:469:| Optional advanced modes | All prior phases | Council profile and coordination board | None |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:505:**Context**: Council synthesis and coordination boards are valuable, but the consolidated report treats them as optional extensions rather than baseline fixes.
.opencode/skill/sk-improve-agent/assets/improvement_config_reference.md:39:| `proposalOnly` | boolean | When true, candidates cannot be promoted |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:60:- [ ] CHK-023 [P1] REQ-011 coordination board remains packet-local and optional [EVIDENCE: board schema/strategy sections and fixture output] [TESTS: `deep-research-behavioral.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md:62:- [ ] CHK-025 [P1] REQ-017 large-target decomposition rules exist for both 1000+ file review scopes and 50+ domain research scopes [EVIDENCE: review inventory/hotspot fields, research clustering/sampling fields, and large-scope fixture scenarios] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/z_archive/006-sk-git-superset-worktrees/plan.md:257:  5. `git worktree prune` (cleanup stale refs)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:76:- Research recovery has good failure-mode labels, but execution is still mostly "try a fundamentally different approach" once, then synthesize gaps. Add a staged ladder: reformulate query, authority escalation, decomposition, contradiction resolution, graceful partial closeout. Evidence: E4, E13.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:127:- Review needs a required inventory pass, hotspot ranking, and stratified coverage plan for large repos; flat iteration over a monolithic scope will waste runs. Evidence: E7, E14.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:128:- Research needs domain clustering by authority/source type before convergence is meaningful at 50+ domains; otherwise the loop mixes saturation in one cluster with ignorance in another. Evidence: E4, E13.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:135:**Open Questions:** What is the minimum viable "hotspot sampler" for review that stays explainable?
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:220:| 8 | Add large-target decomposition rules: inventory, hotspot ranking, clustering, sampling, and segment/wave governance | 4/5 | 4/5 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:234:1. **Segment/wave executor** with promotion, pruning, and packet-local coordination board for very large targets
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:242:- No explicit large-target decomposition policy beyond the optional coordination board
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md:251:4. **Keep council synthesis and coordination boards last**, but move large-target decomposition groundwork earlier if 1000-file or 50-domain runs are a real near-term target
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:116:- [ ] T029 Add large-target decomposition to deep review with inventory and hotspot ranking.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:117:- [ ] T030 Add domain clustering to deep research for large source sets.
.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:44:- candidate-only targets must never be promoted
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:252:import Supercluster from 'react-native-clusterer';
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:254:// Create a Supercluster instance
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:255:const superCluster = new Supercluster({
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:257:  maxZoom: 16,     // Maximum zoom to cluster points
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:258:  minZoom: 0,      // Minimum zoom to cluster points
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:259:  minPoints: 2,    // Minimum points to form a cluster
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:265:// Get clusters for current map region
.opencode/skill/sk-code-full-stack/references/mobile/react-native/native-modules.md:268:const clusters = superCluster.getClusters(bBox, zoom);
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:47:| DRV-015 | Stop on max iterations | Verify review stops at maxIterations (default 7) even if dimensions remain uncovered. | Validate the hard iteration cap contract for sk-deep-review. Confirm that `maxIterations` defaults to 7, that the loop exits unconditionally at that limit regardless of dimension coverage or convergence score, and that synthesis still runs after a hard stop, then return a concise operator-facing verdict. | 1. `bash: rg -n 'maxIterations|hard.stop|HARD_STOP|max_iterations|iteration.*cap' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'maxIterations|max_iterations|hard.stop|step_check_convergence|iteration_count' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'maxIterations|max-iterations|default.*7|hard stop' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced. | Capture the hard-stop condition from convergence.md, the YAML enforcement step, and the user-facing documentation of the default. | PASS if the hard cap is enforced unconditionally and synthesis still runs; FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop. | Privilege the convergence reference for exact algorithm and use YAML workflow steps as the enforcement authority. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:102:  -> packet-level coordination board
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:176:- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:182:**Why third**: Once the substrate is durable and observable, we can safely layer the trust surfaces that decide what evidence is promoted, what convergence means semantically, and which sections stay machine-owned.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:230:- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:231:- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:265:**Why last**: Council synthesis and coordination boards remain useful only after the default runtime path is durable, observable, behavior-tested, and parity-locked.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:312:| Large-target decomposition path | Prove review inventory/hotspot ranking and research domain clustering activate only for large scopes | Strategy/decomposition artifact plus fixture outputs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:365:- `in-progress`: name the active phase, requirement cluster, and target files.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:459:| M5: Optional Modes on Trusted Base | Council synthesis and coordination boards stay explicit opt-ins on top of the parity-locked runtime | Phase 5 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:469:| Optional advanced modes | All prior phases | Council profile and coordination board | None |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:505:**Context**: Council synthesis and coordination boards are valuable, but the consolidated report treats them as optional extensions rather than baseline fixes.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md:60:- [ ] CHK-023 [P1] REQ-011 coordination board remains packet-local and optional [EVIDENCE: board schema/strategy sections and fixture output] [TESTS: `deep-research-behavioral.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md:62:- [ ] CHK-025 [P1] REQ-017 large-target decomposition rules exist for both 1000+ file review scopes and 50+ domain research scopes [EVIDENCE: review inventory/hotspot fields, research clustering/sampling fields, and large-scope fixture scenarios] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
.opencode/skill/sk-improve-agent/SKILL.md:15:<!-- Keywords: sk-improve-agent, agent-improver, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->
.opencode/skill/sk-improve-agent/SKILL.md:95:    "PROMOTION_OPERATIONS": {"weight": 4, "keywords": ["promote", "rollback", "mirror drift", "approval gate"]},
.opencode/skill/sk-improve-agent/SKILL.md:223:2. Use `scripts/promote-candidate.cjs` for guarded canonical mutation.
.opencode/skill/sk-improve-agent/SKILL.md:281:| `references/promotion_rules.md` | Keep, reject, and promote policy |
.opencode/skill/sk-improve-agent/SKILL.md:297:| `scripts/promote-candidate.cjs` | Guarded canonical promotion helper |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:18:Composite convergence is the nuanced stop condition that decides whether diminishing returns in the review loop are genuine rather than just a transient pause between finding clusters. The severity-weighted newFindingsRatio is review-specific, ensuring that a single P0 finding prevents premature stop even when raw finding counts plateau.
.opencode/skill/sk-doc/SKILL.md:640:- [agent_creation.md](./references/specific/agent_creation.md) - agent authority, permissions, and creation workflow
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:76:- Research recovery has good failure-mode labels, but execution is still mostly "try a fundamentally different approach" once, then synthesize gaps. Add a staged ladder: reformulate query, authority escalation, decomposition, contradiction resolution, graceful partial closeout. Evidence: E4, E13.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:127:- Review needs a required inventory pass, hotspot ranking, and stratified coverage plan for large repos; flat iteration over a monolithic scope will waste runs. Evidence: E7, E14.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:128:- Research needs domain clustering by authority/source type before convergence is meaningful at 50+ domains; otherwise the loop mixes saturation in one cluster with ignorance in another. Evidence: E4, E13.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:135:**Open Questions:** What is the minimum viable "hotspot sampler" for review that stays explainable?
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:220:| 8 | Add large-target decomposition rules: inventory, hotspot ranking, clustering, sampling, and segment/wave governance | 4/5 | 4/5 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:234:1. **Segment/wave executor** with promotion, pruning, and packet-local coordination board for very large targets
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:242:- No explicit large-target decomposition policy beyond the optional coordination board
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:251:4. **Keep council synthesis and coordination boards last**, but move large-target decomposition groundwork earlier if 1000-file or 50-domain runs are a real near-term target
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:116:- [ ] T029 Add large-target decomposition to deep review with inventory and hotspot ranking.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:117:- [ ] T030 Add domain clustering to deep research for large source sets.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:7:  - "segment planner"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:8:  - "coordination board"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:43:**Phase Context**: This phase adds orchestrator-managed parallel batches on top of the coverage-graph substrate from Phase 002. The goal is scale without architectural drift: the workers stay LEAF, while orchestration logic handles segmentation, fan-out, pruning, promotion, and merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:51:- Shared segment planner logic for hotspot-ranked review and authority-clustered research.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:52:- Wave lifecycle orchestration for plan, fan-out, prune, promote, and merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:53:- Packet-local coordination board and segment JSONL contract.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:78:- Add shared CommonJS planners for review-file segmentation and research-domain clustering.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:79:- Define wave lifecycle steps: plan, fan-out, prune, promote, and merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:80:- Introduce packet-local coordination-board tracking for segment status, conflicts, deduplication, and promoted findings.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:97:| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` | Create | Shared planner for hotspot-ranked review segments and authority-clustered research segments. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:98:| `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` | Create | Orchestrator lifecycle helpers for fan-out, prune, promote, merge, and resume state transitions. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:102:| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document domain clustering, wave segmentation, prune or promote rules, and merge behavior for research. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:104:| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add wave mode, segment planner, and board configuration fields. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:105:| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add segment plan, promoted findings, and merge checkpoints. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:106:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document inventory pass, hotspot segmentation, wave lifecycle, and merge behavior for review. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:108:| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add wave mode, segment planner, and board configuration fields. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:113:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add segment planning, fan-out, prune, promote, and merge steps for research. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:115:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add segment planning, fan-out, prune, promote, and merge steps for review. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:117:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts` | Create | Verify segment planning, ranking, and clustering behavior. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:118:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` | Create | Verify lifecycle transitions, prune rules, and promotion rules. |

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '180,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   180	
   181	      step_scope_discovery:
   182	        action: "Resolve review target to a concrete file list based on target type"
   183	        resolve:
   184	          spec-folder: |
   185	            1. Read spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
   186	            2. Discover implementation files referenced in spec artifacts
   187	            3. Discover test files associated with implementation
   188	            4. Set scope = all discovered files
   189	          skill: |
   190	            1. Read SKILL.md from .opencode/skill/{skill_name}/
   191	            2. Discover references/, assets/, scripts/ contents
   192	            3. Find agent definitions referencing this skill across runtimes
   193	            4. Find command entry points referencing this skill
   194	            5. Set scope = all discovered files
   195	          agent: |
   196	            1. Find agent definition across all runtimes (.claude/agents/, .opencode/agent/, .codex/agents/, .agents/, .gemini/agents/)
   197	            2. Compare agent definitions for consistency
   198	            3. Set scope = all discovered agent files
   199	          track: |
   200	            1. List all child spec folders under specs/{track}/ or .opencode/specs/{track}/
   201	            2. For each: read spec.md + checklist.md
   202	            3. Set scope = all child spec artifacts
   203	          files: |
   204	            1. Expand glob patterns from review_target
   205	            2. Validate all files exist
   206	            3. Discover immediate cross-references (imports, links)
   207	            4. Set scope = expanded file list + cross-references
   208	        outputs:
   209	          - review_scope_files: "List of all files in review scope"
   210	          - cross_reference_targets: "{ spec_paths: [...], code_paths: [...], test_paths: [...] }"
   211	
   212	      step_order_dimensions:
   213	        action: "Order review dimensions based on risk priority"
   214	        algorithm: |
   215	          1. Iteration 0 (inventory pass): Build artifact map, identify file types, estimate complexity
   216	          2. Subsequent iterations follow risk-ordered deep passes:
   217	             correctness → security → traceability → maintainability
   218	          3. If review_dimensions != "all", filter to only requested dimensions
   219	          4. Derive traceability protocol plan:
   220	             - core: spec_code, checklist_evidence
   221	             - overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
   222	          5. Store ordered list as dimension_queue
   223	        outputs:
   224	          - dimension_queue: "Ordered list of dimensions to review"
   225	          - inventory_pass: true
   226	
   227	      step_create_config:
   228	        action: "Create deep-review-config.json from template with review-specific fields"
   229	        template: .opencode/skill/sk-deep-review/assets/deep_review_config.json
   230	        populate:
   231	          topic: "Review: {review_target}"
   232	          mode: "review"
   233	          sessionId: "{ISO_8601_NOW}"
   234	          parentSessionId: null
   235	          lineageMode: "new"
   236	          generation: 1
   237	          continuedFromRun: null
   238	          reviewTarget: "{review_target}"
   239	          reviewTargetType: "{review_target_type}"
   240	          # Normalize to JSON array before writing (expand "all" to ["correctness","security","traceability","maintainability"]).

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '240,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	          # Normalize to JSON array before writing (expand "all" to ["correctness","security","traceability","maintainability"]).
   241	          reviewDimensions: "{review_dimensions}"
   242	          reviewScopeFiles: "{review_scope_files}"
   243	          severityThreshold: "P2"
   244	          crossReference:
   245	            core: ["spec_code", "checklist_evidence"]
   246	            overlay: ["skill_agent", "agent_cross_runtime", "feature_catalog_code", "playbook_capability"]
   247	          maxIterations: "{max_iterations}"
   248	          convergenceThreshold: "{convergence_threshold}"
   249	          stuckThreshold: 2
   250	          maxDurationMinutes: 120
   251	          specFolder: "{spec_folder}"
   252	          createdAt: "{ISO_8601_NOW}"
   253	          status: "initialized"
   254	          releaseReadinessState: "in-progress"
   255	          executionMode: "auto"
   256	        output: "{spec_folder}/review/deep-review-config.json"
   257	
   258	      step_create_state_log:
   259	        action: "Initialize JSONL state log with config record including review fields and lineage metadata"
   260	        content: '{"type":"config","mode":"review","reviewTarget":"{review_target}","reviewTargetType":"{review_target_type}","reviewDimensions":"{review_dimensions}","sessionId":"{ISO_8601_NOW}","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
   261	        output: "{spec_folder}/review/deep-review-state.jsonl"
   262	
   263	      step_create_findings_registry:
   264	        action: "Initialize reducer-owned review findings registry"
   265	        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
   266	        output: "{spec_folder}/review/deep-review-findings-registry.json"
   267	
   268	      step_create_strategy:
   269	        action: "Create review strategy file from deep_review_strategy.md template"
   270	        template: .opencode/skill/sk-deep-review/assets/deep_review_strategy.md
   271	        populate:
   272	          review_target: "{review_target}"
   273	          review_target_type: "{review_target_type}"
   274	          dimensions: "{dimension_queue}"
   275	          scope_files: "{review_scope_files}"
   276	          cross_reference_targets: "{cross_reference_targets}"
   277	          max_iterations: "{max_iterations}"
   278	          convergence_threshold: "{convergence_threshold}"
   279	        output: "{spec_folder}/review/deep-review-strategy.md"
   280	

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml | sed -n '150,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	          skip_to: phase_synthesis
   151	        on_invalid_state:
   152	          halt: true
   153	          message: "Existing deep-research state is incomplete or contradictory. Repair or archive the invalid research packet before continuing."
   154	        on_fresh:
   155	          action: "Proceed with a new session"
   156	
   157	      step_create_config:
   158	        action: "Create deep-research-config.json from template"
   159	        template: .opencode/skill/sk-deep-research/assets/deep_research_config.json
   160	        populate:
   161	          topic: "{research_topic}"
   162	          maxIterations: "{max_iterations}"
   163	          convergenceThreshold: "{convergence_threshold}"
   164	          stuckThreshold: 3
   165	          maxDurationMinutes: 120
   166	          specFolder: "{spec_folder}"
   167	          createdAt: "{ISO_8601_NOW}"
   168	          status: "initialized"
   169	          executionMode: "auto"
   170	          lineage.sessionId: "{AUTO_SESSION_ID}"
   171	          lineage.parentSessionId: null
   172	          lineage.lineageMode: "new"
   173	          lineage.generation: 1
   174	          lineage.continuedFromRun: null
   175	        output: "{spec_folder}/research/deep-research-config.json"
   176	
   177	      step_create_state_log:
   178	        action: "Initialize JSONL state log with config record"
   179	        content: '{"type":"config","topic":"{research_topic}","maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
   180	        output: "{spec_folder}/research/deep-research-state.jsonl"
   181	
   182	      step_create_strategy:
   183	        action: "Create strategy file from template with initial questions"
   184	        template: .opencode/skill/sk-deep-research/assets/deep_research_strategy.md
   185	        populate:
   186	          topic: "{research_topic}"
   187	          key_questions: "Derive 3-5 key questions from the research topic"
   188	          known_context: "None"
   189	          known_context_summary: "None"
   190	          max_iterations: "{max_iterations}"
   191	          convergence_threshold: "{convergence_threshold}"
   192	        output: "{spec_folder}/research/deep-research-strategy.md"
   193	
   194	      step_create_registry:
   195	        action: "Initialize reducer-owned findings registry"
   196	        content: '{"openQuestions":[],"resolvedQuestions":[],"keyFindings":[],"ruledOutDirections":[],"metrics":{"iterationsCompleted":0,"openQuestions":0,"resolvedQuestions":0,"keyFindings":0,"convergenceScore":0,"coverageBySources":{}}}'
   197	        output: "{spec_folder}/research/findings-registry.json"
   198	
   199	      step_enrich_strategy_context:
   200	        action: "Ensure Known Context is written only after strategy.md exists"
   201	        condition: "prior_context_found"
   202	        edit: "{spec_folder}/research/deep-research-strategy.md"
   203	        note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
   204	
   205	      step_init_complete:
   206	        log: "Initialization complete. Config, state, and strategy files created."
   207	        set: { current_iteration: 1, current_segment: 1, stuck_count: 0 }
   208	
   209	  # ═══════════════════════════════════════════════════════════════
   210	  # PHASE 2: ITERATION LOOP

web search: 
web search: site:docs.langchain.com langgraph branching parallel reducer shared state
web search: 
web search: https://docs.langchain.com/oss/python/langgraph/use-graph-api
web search: 
web search: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/index.html
web search: 
web search: 'often in parallel' in https://docs.crewai.com/en/concepts/flows
web search: 
web search: site:microsoft.github.io/autogen stable topic subscription message passing shared state
web search: 
web search: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/concurrent-agents.html
web search: 
web search: 
web search: 
web search: 'The pattern consists of two types of agents' in https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/design-patterns/mixture-of-agents.html
web search: 
web search: 'updates from a parallel superstep may not be ordered consistently' in https://docs.langchain.com/oss/python/langgraph/use-graph-api
web search: 
web search: site:docs.crewai.com kickoff crew for each parallel docs
web search: 
web search: https://docs.crewai.com/learn/kickoff-async
codex
I’ve got enough of the live contract to see a pattern: review already has richer init-time scope data and a reducer schema, while research still starts from topic-derived questions and only learns source clusters after the loop begins. I’m filling that gap by checking the state-format and prior packet research notes so the segment and merge recommendations line up with the existing JSONL lineage model.
exec
/bin/zsh -lc "rg -n \"segment|wave|lineage|generation|parentSessionId|continuedFromRun|merge|conflict|duplicate|promoted\" .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-review/references/state_format.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/references/state_format.md:55:  "lineage": {
.opencode/skill/sk-deep-research/references/state_format.md:57:    "parentSessionId": null,
.opencode/skill/sk-deep-research/references/state_format.md:58:    "lineageMode": "new",
.opencode/skill/sk-deep-research/references/state_format.md:59:    "generation": 1,
.opencode/skill/sk-deep-research/references/state_format.md:60:    "continuedFromRun": null
.opencode/skill/sk-deep-research/references/state_format.md:77:| lineage.sessionId | string | Yes | -- | Stable identifier for the current lineage segment |
.opencode/skill/sk-deep-research/references/state_format.md:78:| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
.opencode/skill/sk-deep-research/references/state_format.md:79:| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
.opencode/skill/sk-deep-research/references/state_format.md:80:| lineage.generation | number | Yes | 1 | Monotonic generation counter |
.opencode/skill/sk-deep-research/references/state_format.md:81:| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
.opencode/skill/sk-deep-research/references/state_format.md:146:| segment | number | No | Segment number (default: 1). Groups iterations into logical phases |
.opencode/skill/sk-deep-research/references/state_format.md:238:| resumed | workflow | active | Resume after a prior active session | sessionId, continuedFromRun, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:239:| restarted | workflow | active | Start a new generation from prior state | sessionId, parentSessionId, generation, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:240:| forked | workflow | active | Create a new branch from current packet state | sessionId, parentSessionId, generation, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:241:| completed_continue | workflow | active | Reopen a completed lineage after immutable snapshotting | sessionId, parentSessionId, generation, continuedFromRun, completedAt, reopenedAt, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:246:| wave_complete | wave coordinator | reference-only | Parallel wave finished | wave, iterations, medianRatio, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:247:| wave_pruned | wave coordinator | reference-only | Low-value wave branch deprioritized | wave, prunedIterations, medianRatio, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:248:| breakthrough | wave coordinator | reference-only | Wave branch exceeded 2x average | wave, iteration, ratio, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:252:| segment_start | workflow | reference-only | Start of a new segment | segment, reason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:268:Every active packet must be reconstructable from these lineage keys:
.opencode/skill/sk-deep-research/references/state_format.md:272:| `sessionId` | Stable identifier for the active lineage segment |
.opencode/skill/sk-deep-research/references/state_format.md:273:| `parentSessionId` | Immediate parent lineage when a new segment or branch is created |
.opencode/skill/sk-deep-research/references/state_format.md:274:| `lineageMode` | How the current segment began |
.opencode/skill/sk-deep-research/references/state_format.md:275:| `generation` | Monotonic generation number across restarts and reopenings |
.opencode/skill/sk-deep-research/references/state_format.md:276:| `continuedFromRun` | Last completed run reused as the continuation boundary |
.opencode/skill/sk-deep-research/references/state_format.md:278:The workflow may read legacy filenames during migration, but lineage metadata must always be written under canonical names.
.opencode/skill/sk-deep-research/references/state_format.md:297:- schema mismatch -> reject + conflict event
.opencode/skill/sk-deep-research/references/state_format.md:309:- `segment` values must be >= 1
.opencode/skill/sk-deep-research/references/state_format.md:310:- `segment_start` events must have sequential segment numbers when segmenting is explicitly enabled
.opencode/skill/sk-deep-research/references/state_format.md:355:- **Default**: All iterations belong to segment 1
.opencode/skill/sk-deep-research/references/state_format.md:356:- **New segment**: Triggered only when an implementation explicitly enables segmenting. Current live workflow keeps a single segment.
.opencode/skill/sk-deep-research/references/state_format.md:357:- **Convergence filtering**: The convergence algorithm filters by current segment when computing signals
.opencode/skill/sk-deep-research/references/state_format.md:358:- **Cross-segment**: Full JSONL read (no segment filter) provides complete history for synthesis
.opencode/skill/sk-deep-research/references/state_format.md:359:- **Validation**: `segment` values must be >= 1 and sequential within a session
.opencode/skill/sk-deep-research/references/state_format.md:361:Example multi-segment session:
.opencode/skill/sk-deep-research/references/state_format.md:364:{"type":"iteration","run":1,"segment":1,"status":"complete",...}
.opencode/skill/sk-deep-research/references/state_format.md:365:{"type":"iteration","run":2,"segment":1,"status":"complete",...}
.opencode/skill/sk-deep-research/references/state_format.md:366:{"type":"event","event":"segment_start","segment":2,"reason":"Pivoting to caching strategies"}
.opencode/skill/sk-deep-research/references/state_format.md:367:{"type":"iteration","run":3,"segment":2,"status":"complete",...}
.opencode/skill/sk-deep-research/references/state_format.md:368:{"type":"iteration","run":4,"segment":2,"status":"complete",...}
.opencode/skill/sk-deep-research/references/state_format.md:785:Finding deduplication: when an iteration reports a finding with the same file, line range, and root cause as an existing finding, it is treated as a refinement (not a new finding) and the existing findingId is updated rather than creating a duplicate.
.opencode/skill/sk-deep-review/references/state_format.md:60:  "parentSessionId": null,
.opencode/skill/sk-deep-review/references/state_format.md:61:  "lineageMode": "new",
.opencode/skill/sk-deep-review/references/state_format.md:62:  "generation": 1,
.opencode/skill/sk-deep-review/references/state_format.md:63:  "continuedFromRun": null,
.opencode/skill/sk-deep-review/references/state_format.md:112:| sessionId | string | -- | Stable identifier for the current review lineage |
.opencode/skill/sk-deep-review/references/state_format.md:113:| parentSessionId | string \| null | `null` | Parent lineage reference for restart/fork flows |
.opencode/skill/sk-deep-review/references/state_format.md:114:| lineageMode | string | `"new"` | `new`, `resume`, `restart`, `fork`, `completed-continue` |
.opencode/skill/sk-deep-review/references/state_format.md:115:| generation | number | 1 | Lineage generation number |
.opencode/skill/sk-deep-review/references/state_format.md:116:| continuedFromRun | number \| null | `null` | Prior completed run reopened by completed-continue |
.opencode/skill/sk-deep-review/references/state_format.md:168:{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
.opencode/skill/sk-deep-review/references/state_format.md:180:  "parentSessionId": null,
.opencode/skill/sk-deep-review/references/state_format.md:181:  "lineageMode": "resume",
.opencode/skill/sk-deep-review/references/state_format.md:182:  "generation": 1,
.opencode/skill/sk-deep-review/references/state_format.md:183:  "continuedFromRun": null,
.opencode/skill/sk-deep-review/references/state_format.md:192:**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
.opencode/skill/sk-deep-review/references/state_format.md:194:**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`
.opencode/skill/sk-deep-review/references/state_format.md:201:| sessionId | string | Current lineage session identifier |
.opencode/skill/sk-deep-review/references/state_format.md:202:| generation | number | Lineage generation number |
.opencode/skill/sk-deep-review/references/state_format.md:203:| lineageMode | string | Lifecycle mode used for this run |
.opencode/skill/sk-deep-review/references/state_format.md:341:  "generation": 1,
.opencode/skill/sk-deep-review/references/state_format.md:342:  "lineageMode": "resume",

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '268,278p'; nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md | sed -n '172,178p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   268	- Promotion checkpoint fails minimum evidence threshold: recommendation stays informative, not adoptive.
   269	
   270	### Semantic and Decomposition Boundaries
   271	
   272	- Semantic novelty falls to zero but contradiction density rises: convergence must remain blocked until the contradiction path is resolved or explicitly downgraded in the stop-decision trace.
   273	- Citation overlap is high within one research cluster but low across the full source set: cluster saturation cannot be treated as global convergence for 50+ domain research packets.
   274	- Review scope exceeds 1000 files with no hotspot ranking or stratified sampling plan: the workflow must force an inventory/decomposition step before claiming broad coverage.
   275	
   276	### Optional Mode Boundaries
   277	
   278	- Council mode perspectives disagree irreconcilably: synthesis iteration must surface unresolved conflict instead of forcing a false consensus.
   172	
   173	**Verification strategy**:
   174	- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
   175	- Dashboard and schema tests assert timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and decomposition metadata.
   176	- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
   177	
   178	### Phase 2b: Trust Surfaces, Ledgers, and Critique

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md | sed -n '120,136p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	---
   121	
   122	## Iteration 6: Scaling to 1000 Files and 50 Domains
   123	
   124	**Focus**: Q6 (Scalability)
   125	
   126	**Key Findings:**
   127	- Review needs a required inventory pass, hotspot ranking, and stratified coverage plan for large repos; flat iteration over a monolithic scope will waste runs. Evidence: E7, E14.
   128	- Research needs domain clustering by authority/source type before convergence is meaningful at 50+ domains; otherwise the loop mixes saturation in one cluster with ignorance in another. Evidence: E4, E13.
   129	- The existing reference-only wave/segment ideas are the right direction, but should become orchestrator-managed batches that preserve LEAF semantics instead of nested agents. Evidence: E4, E13, W3, W4.
   130	
   131	**Novel Insight:** Scalability is mostly a decomposition problem, not a token-budget problem.
   132	
   133	**Connections:** REQ-011, REQ-014; T023 plus a missing foundational task.
   134	
   135	**Open Questions:** What is the minimum viable "hotspot sampler" for review that stays explainable?
   136	

web search: 
web search: 
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '188,206p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   188	  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
   189	}
   190	```
   191	
   192	**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
   193	
   194	**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`
   195	
   196	| Required Field | Type | Description |
   197	|---------------|------|-------------|
   198	| mode | `"review"` | Session mode discriminator |
   199	| dimensions | string[] | Review dimensions addressed this iteration |
   200	| filesReviewed | string[] | Files examined |
   201	| sessionId | string | Current lineage session identifier |
   202	| generation | number | Lineage generation number |
   203	| lineageMode | string | Lifecycle mode used for this run |
   204	| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
   205	| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
   206	| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '72,82p'; nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '240,248p'; nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '352,368p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    72	| progressiveSynthesis | boolean | No | true | Update research/research.md after each iteration; synthesis still performs a cleanup pass |
    73	| specFolder | string | Yes | -- | Spec folder path (relative to specs/) |
    74	| createdAt | ISO 8601 | Yes | -- | Session start timestamp |
    75	| status | string | Yes | "initialized" | initialized, running, converged, stuck, complete, error |
    76	| executionMode | string | No | "auto" | auto or confirm |
    77	| lineage.sessionId | string | Yes | -- | Stable identifier for the current lineage segment |
    78	| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
    79	| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
    80	| lineage.generation | number | Yes | 1 | Monotonic generation counter |
    81	| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
    82	| fileProtection | object | No | -- | Mutability declarations for state files (see below) |
   240	| forked | workflow | active | Create a new branch from current packet state | sessionId, parentSessionId, generation, timestamp |
   241	| completed_continue | workflow | active | Reopen a completed lineage after immutable snapshotting | sessionId, parentSessionId, generation, continuedFromRun, completedAt, reopenedAt, timestamp |
   242	| paused | workflow | active | Pause sentinel detected | reason, timestamp |
   243	| migration | workflow | active | Legacy artifact consumed and canonical name written | legacyPath, canonicalPath, timestamp |
   244	| direct_mode | workflow | reference-only | Orchestrator absorbed iteration work | iteration, reason, timestamp |
   245	| state_reconstructed | recovery | active | JSONL rebuilt from iteration files | iterationsRecovered, timestamp |
   246	| wave_complete | wave coordinator | reference-only | Parallel wave finished | wave, iterations, medianRatio, timestamp |
   247	| wave_pruned | wave coordinator | reference-only | Low-value wave branch deprioritized | wave, prunedIterations, medianRatio, timestamp |
   248	| breakthrough | wave coordinator | reference-only | Wave branch exceeded 2x average | wave, iteration, ratio, timestamp |
   352	
   353	Segments partition a research session into logical phases without losing history when the runtime supports them.
   354	
   355	- **Default**: All iterations belong to segment 1
   356	- **New segment**: Triggered only when an implementation explicitly enables segmenting. Current live workflow keeps a single segment.
   357	- **Convergence filtering**: The convergence algorithm filters by current segment when computing signals
   358	- **Cross-segment**: Full JSONL read (no segment filter) provides complete history for synthesis
   359	- **Validation**: `segment` values must be >= 1 and sequential within a session
   360	
   361	Example multi-segment session:
   362	```json
   363	{"type":"config","topic":"API optimization",...}
   364	{"type":"iteration","run":1,"segment":1,"status":"complete",...}
   365	{"type":"iteration","run":2,"segment":1,"status":"complete",...}
   366	{"type":"event","event":"segment_start","segment":2,"reason":"Pivoting to caching strategies"}
   367	{"type":"iteration","run":3,"segment":2,"status":"complete",...}
   368	{"type":"iteration","run":4,"segment":2,"status":"complete",...}

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/SKILL.md | sed -n '236,270p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   236	6. **Respect exhausted approaches** -- Never retry approaches in the "Exhausted" list
   237	7. **Cite sources** -- Every finding must cite `[SOURCE: url]` or `[SOURCE: file:line]`
   238	8. **Use generate-context.js for memory saves** -- Never manually create memory files
   239	9. **Treat research/research.md as workflow-owned** -- Iteration findings feed synthesis; the workflow owns the canonical `research/research.md`
   240	10. **Document ruled-out directions per iteration** -- Every iteration must include what was tried and failed
   241	11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
   242	12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
   243	13. **Respect reducer ownership** -- The workflow reducer, not the agent, is the source of truth for strategy machine-owned sections, dashboard metrics, and findings registry updates
   244	14. **Use canonical packet names only** -- Write `deep-research-*` artifacts and `research/.deep-research-pause`; legacy names are read-only migration aliases
   245	
   246	### NEVER
   247	
   248	1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
   249	2. **Hold findings in context** -- Write everything to files
   250	3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
   251	4. **Ask the user** -- Autonomous execution; make best-judgment decisions
   252	5. **Skip convergence checks** -- Every iteration must be evaluated
   253	6. **Modify config after init** -- Config is read-only after initialization
   254	7. **Overwrite prior findings** -- Append to research/research.md, never replace
   255	
   256	### Iteration Status Enum
   257	
   258	`complete | timeout | error | stuck | insight | thought`
   259	
   260	- `insight`: Low newInfoRatio but important conceptual breakthrough
   261	- `thought`: Analytical-only iteration, no evidence gathering
   262	
   263	### EXPERIMENTAL / REFERENCE-ONLY FEATURES
   264	
   265	These concepts remain documented for future design work, but they are not part of the live executable contract for `/spec_kit:deep-research`:
   266	1. **Wave orchestration** -- parallel question fan-out, pruning, and breakthrough logic
   267	2. **Checkpoint commits** -- per-iteration git commits
   268	3. **Wave orchestration on the same lineage** -- parallel fan-out remains reference-only
   269	4. **Alternate CLI dispatch** -- process-isolated `claude -p` or similar dispatch modes
   270	

web search: 
web search: 'processes will be executed in parallel'
web search: 
web search: 'Send takes two arguments'
web search: 
web search: site:docs.langchain.com/oss/python/langgraph/graph-api Send takes two arguments state to pass downstream node
web search: 
web search: https://docs.crewai.com/learn/kickoff-async
web search: 
web search: https://docs.langchain.com/oss/python/langgraph/graph-api
web search: 
web search: 'Send takes two arguments' in https://docs.langchain.com/oss/python/langgraph/graph-api
codex
**Iterations**

1. **LEAF compatibility**. Focus: how parallelism can exist without violating LEAF workers. Findings: both live workflows dispatch exactly one worker and immediately `wait_for_completion`, so the executable path is single-stream today ([spec_kit_deep-research_auto.yaml:294](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L294), [spec_kit_deep-review_auto.yaml:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L400)); the research skill still marks wave orchestration as reference-only ([SKILL.md:263](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md#L263), [loop_protocol.md:316](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L316)); both workers explicitly say the orchestrator adds `segment` and `convergenceSignals` after the fact ([deep-research.md:189](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L189), [deep-review.md:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L253)). Inference: I do not see a native parallel fan-out/join primitive in the current YAML surface. Novel insight: Phase 3 should keep workers unchanged and make “wave execution” an orchestrator concern over immutable segment briefs. Open question: does `wave-lifecycle.cjs` need to emulate batching because the YAML engine cannot join multiple dispatches itself?

2. **Segment planning for review**. Focus: how to split 1000+ files. Findings: review init already resolves a concrete file list plus cross-reference targets before iteration 1 ([spec_kit_deep-review_auto.yaml:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L181)); it already runs an inventory pass that builds an artifact map and estimates complexity ([spec_kit_deep-review_auto.yaml:212](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L212)); the runtime-truth packet already said large review scopes must force inventory plus hotspot ranking before broad-coverage claims ([spec.md:274](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L274), [codex-gpt54-deep-research.md:127](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md#L127)); review JSONL already records `filesReviewed`, per-dimension outputs, and traceability checks ([deep-review.md:235](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L235)). Novel insight: v1 should use deterministic heuristic segmentation first: spec-linked files, executable/test adjacency, file-type buckets, and prior finding density, then add graph clustering only if code-graph data is already cheap. Open question: should hotspot score live only on the coordination board, or also be written into segment manifests?

3. **Domain clustering for research**. Focus: how to cluster 50+ domains. Findings: current research init only creates topic, 3-5 key questions, and an empty registry; it does not build a source-domain inventory up front ([spec_kit_deep-research_auto.yaml:157](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L157), [spec_kit_deep-research_auto.yaml:182](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L182)); the reducer already computes `coverageBySources` by hostname plus coarse source class (`web`, `memory`, `code`) ([reduce-state.cjs:146](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L146), [reduce-state.cjs:244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L244)); packet 001 already warned that saturation inside one cluster cannot be treated as global convergence across a 50+ domain run ([spec.md:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L273), [codex-gpt54-deep-research.md:128](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md#L128)). Novel insight: research needs a mandatory “domain discovery wave 0” that produces a deterministic domain ledger before convergence math starts. Open question: the practical v1 cluster key looks like `topic x authority tier x source type`, but who assigns authority tier: heuristic host rules or operator hints?

4. **Wave lifecycle**. Focus: what happens when some segments finish early. Findings: the phase spec requires an explicit `plan -> fan-out -> prune -> promote -> merge` lifecycle ([spec.md:79](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md#L79), [plan.md:76](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md#L76)); live workflows only know `CONTINUE`, `STOP`, and stuck recovery on one active stream ([spec_kit_deep-research_auto.yaml:250](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L250), [spec_kit_deep-review_auto.yaml:335](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L335)); LangGraph’s superstep model is a close analogue: parallel branches execute together, downstream work waits for the superstep barrier, and failed branches can retry without redoing successful ones ([Graph API overview](https://docs.langchain.com/oss/python/langgraph/graph-api), [Use the graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)). Novel insight: converged segments should move to `retired` on the board while the global run remains `active` until unresolved gaps across other segments are cleared. Open question: should prune mean “stop scheduling this segment” or “demote it to background/watchlist”?

5. **Merge semantics**. Focus: how segment outputs merge without losing lineage. Findings: research state format already has lineage fields plus reference-only `wave_complete`, `wave_pruned`, `breakthrough`, and `segment_start` events ([state_format.md:77](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L77), [state_format.md:246](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L246), [state_format.md:353](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L353)); review synthesis already defines dedupe, contested findings, severity upgrades, and referee handling ([spec_kit_deep-review_auto.yaml:574](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L574)); prior wave work proved append order is unreliable under parallel execution because JSONL records arrived out of order ([wave1-prior-context.md:101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L101), [wave1-prior-context.md:111](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L111)). Novel insight: merge must be a deterministic reducer pass over normalized segment manifests, never raw append order. Open question: should run numbers stay globally monotonic, or should each segment get local run numbers plus a separate global event sequence?

6. **Convergence per segment**. Focus: whether each segment needs its own graph/coverage instance. Findings: convergence docs already say segment filtering should apply only to the current segment while hard stops still count all iterations and cross-segment analysis still reads the full JSONL ([convergence.md:23](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L23), [convergence.md:305](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L305)); the workers already expect the orchestrator to add `segment` and `convergenceSignals` to iteration records ([deep-research.md:189](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L189), [deep-review.md:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L253)); review STOP is explicitly global because it depends on total P0/P1 counts, full-dimension coverage, and global quality gates ([spec_kit_deep-review_auto.yaml:340](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L340)). Novel insight: one global coverage graph plus segment-scoped queries is cleaner than spinning up a separate graph per segment. Open question: how should unresolved nodes from retired segments contribute to the final global stop-decision trace?

7. **Coordination board design**. Focus: what fields belong on the packet-local board. Findings: the spec wants per-segment state, conflict notes, dedupe markers, and promotion outcomes in one packet-local artifact ([spec.md:133](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md#L133)); existing reducer contracts already distinguish config, registry, dashboard, and strategy ownership ([deep_review_config.json:44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/deep_review_config.json#L44), [review_mode_contract.yaml:166](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L166)); the plan already warns that board maintenance must not become manual busywork ([spec.md:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md#L181)). Novel insight: the board should be machine-first JSON with a rendered markdown mirror; recommended row fields are `segmentId`, `wave`, `status`, `scope`, `plannerScore`, `currentFocus`, `convergence`, `promotionState`, `dedupeRefs`, `conflictRefs`, `mergeState`, `artifactPaths`, and timestamps. Open question: should strategy keep only human steering, with all execution-state removed once the board exists?

8. **Cost/benefit of waves**. Focus: when wave mode beats sequential looping. Findings: orchestrate guidance already says to default to focused execution, use parallelism only for substantial independent work, and synthesize between waves ([orchestrate.md:260](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/orchestrate.md#L260), [orchestrate.md:633](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/orchestrate.md#L633)); prior wave evidence showed real gains from pre-assigned iteration numbers and breadth-to-depth sequencing, but also real overhead from JSONL normalization and provider overload ([wave1-prior-context.md:101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L101), [wave1-prior-context.md:110](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L110)); CrewAI and LangGraph both expose bounded concurrency controls rather than “infinite parallelism” ([Kickoff Crew Asynchronously](https://docs.crewai.com/en/learn/kickoff-async), [Use the graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)). Novel insight: wave mode should be gated by predicted savings, not just scope size; a good v1 rule is “only fan out when expected remaining sequential iterations exceeds branch count plus two reducer/synthesis passes.” Open question: should activation be entirely automatic, or require explicit `wave_mode=auto|force|off`?

9. **Hotspot detection**. Focus: what is available without expensive analysis. Findings: the review workflow already has the exact file inventory before the first real pass ([spec_kit_deep-review_auto.yaml:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L181)); the review iteration schema already records `filesReviewed`, per-severity counts, and coverage, so hotspot scoring can learn from earlier waves ([deep-review.md:235](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L235), [state_format.md:192](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/state_format.md#L192)); packet research explicitly asked for a minimum viable explainable hotspot sampler ([codex-gpt54-deep-research.md:135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md#L135)). Novel insight: v1 hotspot score should stay explainable: `spec-linked + executable/test adjacency + size bucket + prior finding density`, with import centrality only as an optional bonus when the graph is already warm. Open question: do we want a “coverage sampler” that deliberately reserves one low-score segment per wave to avoid tunnel vision?

10. **Existing ecosystem patterns**. Focus: what translates from LangGraph, CrewAI, and AutoGen. Findings: LangGraph natively models shared state, parallel supersteps, `Send`-based map-reduce fan-out, reducers for merge, and warns that parallel-update ordering is not stable ([Graph API overview](https://docs.langchain.com/oss/python/langgraph/graph-api), [Use the graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)); CrewAI Flows expose shared state, multiple `@start()` methods that can run in parallel, shared crew memory with optional scoped private memory, and true async multi-crew execution via `akickoff()`/`asyncio.gather()` ([Flows](https://docs.crewai.com/en/concepts/flows), [Memory](https://docs.crewai.com/en/concepts/memory), [Kickoff Crew Asynchronously](https://docs.crewai.com/en/learn/kickoff-async)); AutoGen Core is actor-model async messaging, and its Mixture-of-Agents pattern uses a single orchestrator dispatching workers layer by layer with synthesis between layers ([Core](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/index.html), [Mixture of Agents](https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/design-patterns/mixture-of-agents.html)). Novel insight: the transferable pattern is orchestrator-owned shard briefs plus deterministic reducer fan-in, not workers co-editing shared planning state. Open question: should Phase 3 intentionally emulate LangGraph-style reducer semantics, or stay with simpler append-only manifests and a custom merge pass?

**Synthesis**

Top recommendations:
- Keep wave execution strictly orchestrator-owned. Workers should receive immutable `segment brief + state summary` inputs and only write segment-local iteration outputs.
- Add a mandatory decomposition prepass for large targets: `hotspot-inventory.json` for review, `domain-ledger.json` for research.
- Make the coordination board reducer-owned and machine-first. Treat `strategy.md` as steering, `board.json` as execution ledger, and `dashboard.md` as human-readable render.
- Normalize merge on explicit keys: `sessionId`, `generation`, `segment`, `wave`, `run`, `findingId`. Never trust append order.
- Reuse one global convergence/coverage substrate with segment-scoped filtering instead of one graph instance per segment.

Feasibility:
- Review-side wave execution looks **medium-high feasibility** because the runtime already discovers concrete scope files, has reducer contracts, and records file-level evidence.
- Research-side wave execution looks **medium feasibility** because it lacks an init-time source/domain inventory; clustering needs a new discovery artifact before meaningful convergence.
- The biggest implementation risk is the workflow engine surface: based on the current YAML, native multi-dispatch/join support is not visible, so Phase 3 likely needs either helper-module orchestration or an engine extension.

Suggested spec changes:
- Add an explicit prerequisite requirement for “workflow fan-out/join capability” so the phase does not assume YAML support that is not yet proven.
- Split segmentation into `v1 deterministic heuristics` and `v2 graph/cluster enhancements`.
- Add required board schema fields and state ownership boundaries to the spec, not just the idea of a board.
- Add a global ordering rule for merged JSONL lineage and a rule for global vs segment-local run identity.
- Add activation gates: review `>=1000 files` plus hotspot spread; research `>=50 domains` plus cluster diversity; otherwise stay sequential.


hook: Stop
hook: Stop Completed
tokens used
278,958
**Iterations**

1. **LEAF compatibility**. Focus: how parallelism can exist without violating LEAF workers. Findings: both live workflows dispatch exactly one worker and immediately `wait_for_completion`, so the executable path is single-stream today ([spec_kit_deep-research_auto.yaml:294](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L294), [spec_kit_deep-review_auto.yaml:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L400)); the research skill still marks wave orchestration as reference-only ([SKILL.md:263](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md#L263), [loop_protocol.md:316](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L316)); both workers explicitly say the orchestrator adds `segment` and `convergenceSignals` after the fact ([deep-research.md:189](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L189), [deep-review.md:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L253)). Inference: I do not see a native parallel fan-out/join primitive in the current YAML surface. Novel insight: Phase 3 should keep workers unchanged and make “wave execution” an orchestrator concern over immutable segment briefs. Open question: does `wave-lifecycle.cjs` need to emulate batching because the YAML engine cannot join multiple dispatches itself?

2. **Segment planning for review**. Focus: how to split 1000+ files. Findings: review init already resolves a concrete file list plus cross-reference targets before iteration 1 ([spec_kit_deep-review_auto.yaml:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L181)); it already runs an inventory pass that builds an artifact map and estimates complexity ([spec_kit_deep-review_auto.yaml:212](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L212)); the runtime-truth packet already said large review scopes must force inventory plus hotspot ranking before broad-coverage claims ([spec.md:274](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L274), [codex-gpt54-deep-research.md:127](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md#L127)); review JSONL already records `filesReviewed`, per-dimension outputs, and traceability checks ([deep-review.md:235](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L235)). Novel insight: v1 should use deterministic heuristic segmentation first: spec-linked files, executable/test adjacency, file-type buckets, and prior finding density, then add graph clustering only if code-graph data is already cheap. Open question: should hotspot score live only on the coordination board, or also be written into segment manifests?

3. **Domain clustering for research**. Focus: how to cluster 50+ domains. Findings: current research init only creates topic, 3-5 key questions, and an empty registry; it does not build a source-domain inventory up front ([spec_kit_deep-research_auto.yaml:157](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L157), [spec_kit_deep-research_auto.yaml:182](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L182)); the reducer already computes `coverageBySources` by hostname plus coarse source class (`web`, `memory`, `code`) ([reduce-state.cjs:146](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L146), [reduce-state.cjs:244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L244)); packet 001 already warned that saturation inside one cluster cannot be treated as global convergence across a 50+ domain run ([spec.md:273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L273), [codex-gpt54-deep-research.md:128](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md#L128)). Novel insight: research needs a mandatory “domain discovery wave 0” that produces a deterministic domain ledger before convergence math starts. Open question: the practical v1 cluster key looks like `topic x authority tier x source type`, but who assigns authority tier: heuristic host rules or operator hints?

4. **Wave lifecycle**. Focus: what happens when some segments finish early. Findings: the phase spec requires an explicit `plan -> fan-out -> prune -> promote -> merge` lifecycle ([spec.md:79](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md#L79), [plan.md:76](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md#L76)); live workflows only know `CONTINUE`, `STOP`, and stuck recovery on one active stream ([spec_kit_deep-research_auto.yaml:250](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L250), [spec_kit_deep-review_auto.yaml:335](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L335)); LangGraph’s superstep model is a close analogue: parallel branches execute together, downstream work waits for the superstep barrier, and failed branches can retry without redoing successful ones ([Graph API overview](https://docs.langchain.com/oss/python/langgraph/graph-api), [Use the graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)). Novel insight: converged segments should move to `retired` on the board while the global run remains `active` until unresolved gaps across other segments are cleared. Open question: should prune mean “stop scheduling this segment” or “demote it to background/watchlist”?

5. **Merge semantics**. Focus: how segment outputs merge without losing lineage. Findings: research state format already has lineage fields plus reference-only `wave_complete`, `wave_pruned`, `breakthrough`, and `segment_start` events ([state_format.md:77](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L77), [state_format.md:246](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L246), [state_format.md:353](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L353)); review synthesis already defines dedupe, contested findings, severity upgrades, and referee handling ([spec_kit_deep-review_auto.yaml:574](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L574)); prior wave work proved append order is unreliable under parallel execution because JSONL records arrived out of order ([wave1-prior-context.md:101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L101), [wave1-prior-context.md:111](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L111)). Novel insight: merge must be a deterministic reducer pass over normalized segment manifests, never raw append order. Open question: should run numbers stay globally monotonic, or should each segment get local run numbers plus a separate global event sequence?

6. **Convergence per segment**. Focus: whether each segment needs its own graph/coverage instance. Findings: convergence docs already say segment filtering should apply only to the current segment while hard stops still count all iterations and cross-segment analysis still reads the full JSONL ([convergence.md:23](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L23), [convergence.md:305](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L305)); the workers already expect the orchestrator to add `segment` and `convergenceSignals` to iteration records ([deep-research.md:189](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L189), [deep-review.md:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L253)); review STOP is explicitly global because it depends on total P0/P1 counts, full-dimension coverage, and global quality gates ([spec_kit_deep-review_auto.yaml:340](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L340)). Novel insight: one global coverage graph plus segment-scoped queries is cleaner than spinning up a separate graph per segment. Open question: how should unresolved nodes from retired segments contribute to the final global stop-decision trace?

7. **Coordination board design**. Focus: what fields belong on the packet-local board. Findings: the spec wants per-segment state, conflict notes, dedupe markers, and promotion outcomes in one packet-local artifact ([spec.md:133](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md#L133)); existing reducer contracts already distinguish config, registry, dashboard, and strategy ownership ([deep_review_config.json:44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/deep_review_config.json#L44), [review_mode_contract.yaml:166](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L166)); the plan already warns that board maintenance must not become manual busywork ([spec.md:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md#L181)). Novel insight: the board should be machine-first JSON with a rendered markdown mirror; recommended row fields are `segmentId`, `wave`, `status`, `scope`, `plannerScore`, `currentFocus`, `convergence`, `promotionState`, `dedupeRefs`, `conflictRefs`, `mergeState`, `artifactPaths`, and timestamps. Open question: should strategy keep only human steering, with all execution-state removed once the board exists?

8. **Cost/benefit of waves**. Focus: when wave mode beats sequential looping. Findings: orchestrate guidance already says to default to focused execution, use parallelism only for substantial independent work, and synthesize between waves ([orchestrate.md:260](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/orchestrate.md#L260), [orchestrate.md:633](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/orchestrate.md#L633)); prior wave evidence showed real gains from pre-assigned iteration numbers and breadth-to-depth sequencing, but also real overhead from JSONL normalization and provider overload ([wave1-prior-context.md:101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L101), [wave1-prior-context.md:110](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-prior-context.md#L110)); CrewAI and LangGraph both expose bounded concurrency controls rather than “infinite parallelism” ([Kickoff Crew Asynchronously](https://docs.crewai.com/en/learn/kickoff-async), [Use the graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)). Novel insight: wave mode should be gated by predicted savings, not just scope size; a good v1 rule is “only fan out when expected remaining sequential iterations exceeds branch count plus two reducer/synthesis passes.” Open question: should activation be entirely automatic, or require explicit `wave_mode=auto|force|off`?

9. **Hotspot detection**. Focus: what is available without expensive analysis. Findings: the review workflow already has the exact file inventory before the first real pass ([spec_kit_deep-review_auto.yaml:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L181)); the review iteration schema already records `filesReviewed`, per-severity counts, and coverage, so hotspot scoring can learn from earlier waves ([deep-review.md:235](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L235), [state_format.md:192](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/state_format.md#L192)); packet research explicitly asked for a minimum viable explainable hotspot sampler ([codex-gpt54-deep-research.md:135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md#L135)). Novel insight: v1 hotspot score should stay explainable: `spec-linked + executable/test adjacency + size bucket + prior finding density`, with import centrality only as an optional bonus when the graph is already warm. Open question: do we want a “coverage sampler” that deliberately reserves one low-score segment per wave to avoid tunnel vision?

10. **Existing ecosystem patterns**. Focus: what translates from LangGraph, CrewAI, and AutoGen. Findings: LangGraph natively models shared state, parallel supersteps, `Send`-based map-reduce fan-out, reducers for merge, and warns that parallel-update ordering is not stable ([Graph API overview](https://docs.langchain.com/oss/python/langgraph/graph-api), [Use the graph API](https://docs.langchain.com/oss/python/langgraph/use-graph-api)); CrewAI Flows expose shared state, multiple `@start()` methods that can run in parallel, shared crew memory with optional scoped private memory, and true async multi-crew execution via `akickoff()`/`asyncio.gather()` ([Flows](https://docs.crewai.com/en/concepts/flows), [Memory](https://docs.crewai.com/en/concepts/memory), [Kickoff Crew Asynchronously](https://docs.crewai.com/en/learn/kickoff-async)); AutoGen Core is actor-model async messaging, and its Mixture-of-Agents pattern uses a single orchestrator dispatching workers layer by layer with synthesis between layers ([Core](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/index.html), [Mixture of Agents](https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/design-patterns/mixture-of-agents.html)). Novel insight: the transferable pattern is orchestrator-owned shard briefs plus deterministic reducer fan-in, not workers co-editing shared planning state. Open question: should Phase 3 intentionally emulate LangGraph-style reducer semantics, or stay with simpler append-only manifests and a custom merge pass?

**Synthesis**

Top recommendations:
- Keep wave execution strictly orchestrator-owned. Workers should receive immutable `segment brief + state summary` inputs and only write segment-local iteration outputs.
- Add a mandatory decomposition prepass for large targets: `hotspot-inventory.json` for review, `domain-ledger.json` for research.
- Make the coordination board reducer-owned and machine-first. Treat `strategy.md` as steering, `board.json` as execution ledger, and `dashboard.md` as human-readable render.
- Normalize merge on explicit keys: `sessionId`, `generation`, `segment`, `wave`, `run`, `findingId`. Never trust append order.
- Reuse one global convergence/coverage substrate with segment-scoped filtering instead of one graph instance per segment.

Feasibility:
- Review-side wave execution looks **medium-high feasibility** because the runtime already discovers concrete scope files, has reducer contracts, and records file-level evidence.
- Research-side wave execution looks **medium feasibility** because it lacks an init-time source/domain inventory; clustering needs a new discovery artifact before meaningful convergence.
- The biggest implementation risk is the workflow engine surface: based on the current YAML, native multi-dispatch/join support is not visible, so Phase 3 likely needs either helper-module orchestration or an engine extension.

Suggested spec changes:
- Add an explicit prerequisite requirement for “workflow fan-out/join capability” so the phase does not assume YAML support that is not yet proven.
- Split segmentation into `v1 deterministic heuristics` and `v2 graph/cluster enhancements`.
- Add required board schema fields and state ownership boundaries to the spec, not just the idea of a board.
- Add a global ordering rule for merged JSONL lineage and a rule for global vs segment-local run identity.
- Add activation gates: review `>=1000 files` plus hotspot spread; research `>=50 domains` plus cluster diversity; otherwise stay sequential.


