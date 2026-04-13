---
iteration: 21
dimension: correctness
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
phase: post-fix-validation
startedAt: 2026-04-12T12:42:09Z
completedAt: 2026-04-12T12:47:04Z
---

# Deep Review Iteration 021 — correctness (Post-Fix Validation)

**Focus:** VALIDATION: Verify reducer fixes landed correctly. Check sk-deep-review/scripts/reduce-state.cjs for synthesis_complete parsing, lineage persistence, claim-adjudication finalSeverity handling, stale STOP veto guard, fail-closed corruption, and ACTIVE RISKS object rendering. Check sk-deep-research/scripts/reduce-state.cjs for synthesis_complete consumption, lineage persistence, and graph convergence blendedScore fallback. Check sk-improve-agent/scripts/reduce-state.cjs for schema alignment, mutation-coverage derivation, and new dashboard sections.

---

Reading additional input from stdin...
OpenAI Codex v0.120.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d81b6-bdf8-7141-93c7-25bc1b92c9c1
--------
user
You are a senior code reviewer executing POST-FIX VALIDATION iteration 21 of a deep review session (ID: rvw-2026-04-12T11-30-00Z).

CONTEXT: A prior 20-iteration review found 80 findings (0 P0, 67 P1, 13 P2) across 4 dimensions. Six fix batches were then applied via GitHub Copilot CLI with GPT 5.4. This iteration validates those fixes.

DIMENSION: correctness
VALIDATION: Verify reducer fixes landed correctly. Check sk-deep-review/scripts/reduce-state.cjs for synthesis_complete parsing, lineage persistence, claim-adjudication finalSeverity handling, stale STOP veto guard, fail-closed corruption, and ACTIVE RISKS object rendering. Check sk-deep-research/scripts/reduce-state.cjs for synthesis_complete consumption, lineage persistence, and graph convergence blendedScore fallback. Check sk-improve-agent/scripts/reduce-state.cjs for schema alignment, mutation-coverage derivation, and new dashboard sections.

INSTRUCTIONS:
1. Read the files mentioned and verify the fixes were correctly applied.
2. For each original finding, report: FIXED (correctly addressed), PARTIAL (partially fixed, issues remain), REGRESSED (fix introduced new problems), or OPEN (not addressed).
3. Report any NEW findings introduced by the fix batches at P0/P1/P2 severity.
4. For each new or partial finding, provide the same structured format: Finding ID (F-021-NNN), Severity, Dimension, File, Line, Title, Description, Evidence, Recommendation.

5. Provide:
   - FIX VALIDATION SUMMARY: how many original findings verified fixed vs partial vs open
   - NEW FINDINGS: any issues introduced by the fixes
   - CONFIDENCE: low/medium/high in the completeness of validation
   - RELEASE READINESS: assessment of whether the bundle is now shippable

Be thorough. Cite exact file paths and line numbers.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m validating the reducer fix bundle as a review pass, starting with the review workflow guardrails: skill routing, lightweight memory context, and then a read-only inspection of the three reducer files with exact line evidence.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "POST-FIX VALIDATION iteration 21 of deep review: validate reducer fixes in sk-deep-review/scripts/reduce-state.cjs, sk-deep-research/scripts/reduce-state.cjs, and sk-improve-agent/scripts/reduce-state.cjs; report fixed/partial/open/regressed and any new findings with exact file/line evidence" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 920ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-L5wyQGiv' (errno=Operation not permitted)
[
  {
    "skill": "sk-improve-agent",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !sk-improve-agent(explicit), !sk-improve-agent(phrase), improve(name)"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.94,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), !sk-deep-review(explicit), code, deep(name), findings"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.91,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-research(explicit), deep(name), iteration, research(name), state"
  },
  {
    "skill": "cli-codex",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !validate(multi), code, open~, research, review"
  },
  {
    "skill": "cli-claude-code",
    "kind": "skill",
    "confidence": 0.91,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !validate(multi), code(name), deep, review"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !improve(multi), !intent:implementation, code(name), debug~, implementation"
  },
  {
    "skill": "cli-gemini",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !validate(multi), code, research, validation"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: code(name), file~, implementation, implement~, test~"
  }
]

codex
Skill routing points to the reducer domains themselves, so I’m using `sk-deep-review` as the review workflow and sampling the `sk-deep-research` and `sk-improve-agent` skill notes only for reducer-specific expectations. I’m also doing a quick memory pass for prior reducer/fix context before I inspect the live files.
Read-only validation pass across three reducer scripts plus prior context lookup, then synthesize fixed/open/new findings with exact evidence.
  → Load relevant skill guidance and quick memory context for reducer fix expectations
  • Read the three reducer files and inspect the targeted fix areas with exact line references
  • Compare live code against the requested original findings and identify any partial/open/regressed items plus new issues
  • Write the validation report with summary, confidence, and release readiness
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.6.1.0
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

 succeeded in 0ms:
---
name: sk-deep-review
description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search]
# Note: Task tool is for the command executor (loop management). The @deep-review agent itself does NOT have Task (LEAF-only).
# No WebFetch: review is code-only and read-only. No external resource fetching.
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.3.1.0
---

<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code-review` instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code-opencode` or `/spec_kit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
LOCAL_REFS   = SKILL_ROOT / "references"
LOCAL_ASSETS = SKILL_ROOT / "assets"
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "code audit", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/loop_protocol.md",
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
        "assets/deep_review_strategy.md",
    ],
    "REVIEW_ITERATION":   [
        "references/loop_protocol.md",
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_REPORT":      [
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND":         [
        "references/loop_protocol.md",
        "references/state_format.md",
        "references/convergence.md",
    ],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active
```

### Phase Detection

Detect the current review phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists in `review/` | Loop protocol, state format, review contract |
| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, review contract |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Review contract, state format |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-review "target"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-review command  │  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (review-report)   │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-review (LEAF agent)    │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE review cycle    │
    │  - Writes: findings + state      │
    │  - Tools: Grep, Read, Glob, etc │
    │  - No WebFetch (code-only)      │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-review-config.json         │  Persists across iterations
    │  deep-review-state.jsonl        │
    │  deep-review-strategy.md        │
    │  deep-review-dashboard.md       │
    │  review/iterations/             │
    │    iteration-NNN.md             │
    │  review/review-report.md        │
    └─────────────────────────────────┘
```

### State Packet Location

The review state packet lives under `{spec_folder}/review/`:

```text
review/
  deep-review-config.json            # Immutable after init: review parameters
  deep-review-state.jsonl            # Append-only review iteration log
  deep-review-strategy.md            # Review dimensions, findings, next focus
  deep-review-dashboard.md           # Auto-generated review dashboard
  .deep-review-pause                 # Pause sentinel checked between iterations
  review-report.md                   # Final review report (synthesis output)
  iterations/
    iteration-NNN.md                 # Write-once review findings per iteration
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Data Flow

exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/sk-improve-agent/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-improve-agent
description: "Evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, packet-local candidates, and guarded promotion or rollback."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.1.0
triggers:
  - sk-improve-agent
  - agent improvement loop
  - bounded agent improvement
  - 5-dimension scoring
  - integration scanner
  - dynamic profiling
---

<!-- Keywords: sk-improve-agent, improve-agent, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

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

Use this skill to set up a proposal-first loop for any bounded agent file, write packet-local candidates, and record append-only evidence.

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

def route_recursive_agent_resources(task):
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

    return {"intents": intents, "resources": loaded, "runtime_assets": runtime_assets}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

exec
/bin/zsh -lc 'rg -n "reduce-state|synthesis_complete|lineage|finalSeverity|STOP veto|ACTIVE RISKS|mutation-coverage|dashboard|graph convergence|sk-deep-review|sk-deep-research|sk-improve-agent" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
93:## Task 1: Reopen completed `005-mempalace` lineage and gather evidence for a new segment, outcome partial
103:## Task 2: Repair and continue `003-modus-memory-main` toward canonical 20-iteration lineage, outcome partial
111:- 003-modus-memory-main, dont ask for spec folder, auto mode, validate.sh --strict, research/iterations/iteration-NNN.md, reduce-state.cjs, deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, max 6 agent threads
141:- 002-mex-main, unhashable type slice, deep-research-strategy anchors, key-questions answered-questions what-worked what-failed exhausted-approaches ruled-out-directions next-focus known-context, synthesis-v1 snapshot, deep-research-dashboard Status COMPLETE
146:- when the user says `continue` on an already-completed deep-research packet, default to extending the same lineage (`completed-continue`) instead of forking a new packet [Task 1][Task 3][Task 4][Task 5]
152:- canonical deep-research runtime packet shape is required for reducer continuity: `research/deep-research-config.json`, `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`, `research/findings-registry.json`, `research/deep-research-dashboard.md`, `research/iterations/iteration-NNN.md`, `research/research.md` [Task 2][Task 3][Task 4][Task 5]
153:- safe continuation sequence: validate packet shape first, repair missing Level 3 docs if needed, preserve existing synthesis/legacy transcripts, extend iterations, run `reduce-state.cjs`, then sync packet docs and rerun strict validation [Task 2][Task 3][Task 5]
300:- batch-phase-review-state.json, 026-graph-and-context-optimization/review/<phase-slug>, deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-dashboard.md, iteration-NNN.md, review-report.md, phasesCompleted 8/13
320:- extra stability passes, iteration-006..010, deep-review-state.jsonl append, deep-review-dashboard.md 10/10, deep-review-strategy.md max-iteration update, batch-phase-review-consolidated.md total iterations 83, no new findings
342:- required per-phase packet set under `review/<phase-slug>/`: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `review-report.md` [Task 1][Task 3][Task 4]
344:- extension workflow for confidence runs: add `iteration-006` through `iteration-010`, append JSONL rows, raise dashboard counters/convergence, refresh strategy + review report, then mirror new totals in batch state and consolidated report [Task 3][Task 4]
538:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems; reuse_rule=reuse for follow-up work inside this packet family when user requests prompt parity or extra deep-research iterations on an existing phase lineage
558:- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093
608:- 031-normalized-analytics-reader, spec status Complete, validate.sh --strict, check-completion.sh, checklist P0/P1 totals, description.json timestamp, memory_delete, memory_index_scan, lineage mismatch
623:- when the user asked "Run /spec_kit:deep-research ... get tot 20 total iterations so add 7 more," treat it as resume of the active lineage, not a fork [Task 2]
636:- deep-research extension runbook: align `maxIterations` in config/state/strategy first, keep lineage/execution mode unchanged, run reducer after each iteration (`node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`), then refresh synthesis/registry/dashboard artifacts [Task 2]
637:- closeout integration for this packet should update `research-v2.md`, `recommendations-v2.md`, `findings-registry-v2.json`, and `deep-research-dashboard.md` while leaving historical `research/research.md` snapshot content intact [Task 2][Task 4]
646:- if memory indexing flags lineage/template mismatches during closeout, remove stale rows with `memory_delete`, rerun forced `memory_index_scan` after cooldown, and verify clean reindex before final sign-off [Task 7]
655:- symptom: closeout validation passes but memory index reports lineage mismatch/stale packet rows; cause: old memory_index entries persisted through packet updates; fix: delete stale row IDs, wait out cooldown, then force `memory_index_scan` and confirm zero failed entries before marking complete [Task 7]
896:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
904:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
906:## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success
914:- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md
916:## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success
941:- symptom: recommendation docs drift from requested basis; cause: docs written from partial wave context; fix: verify ledger count/`synthesis_complete` and explicitly tie recommendations to the full 90-iteration synthesis [Task 1]
996:- changelog-root-esm-module-compliance.md, changelog-013-fts5-fix-and-search-dashboard.md, v1.1.0, 13 phases, validate.sh --recursive --strict
1389:- 012-pre-release-remediation, lineage, review-report, spec.md, plan.md, checklist.md
1424:- when packet identity drifted, user signaled to keep canonical naming and lineage truthful at the same time [Task 2]
1441:- symptom: JSON parse breaks after lineage edits; cause: trailing comma; fix: run `jq empty` immediately after list-item deletion [Task 1]
1488:- Review contract: config/state/strategy/dashboard/iterations/final report in `{spec_folder}/review/` [Task 1][Task 2]
1916:# Task Group: Documentation Enforcement Wiring and sk-deep-research Playbook Packaging
1930:## Task 2: Build sk-deep-research manual testing playbook (index + per-feature snippets)

codex
I’ve got the workflow context loaded. Next I’m reading the live reducer implementations and the exact touched regions so the verdicts are grounded in current code, not just the fix descriptions.
exec
/bin/zsh -lc 'rg -n "schema|mutation-coverage|coverage|dashboard|section|summary|candidate|improvement" .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "synthesis_complete|lineage|finalSeverity|STOP|ACTIVE RISKS|corrupt|corruption|veto|render|claim-adjudication" .opencode/skill/sk-deep-review/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "synthesis_complete|lineage|blendedScore|graph convergence|fallback|STOP|convergence" .opencode/skill/sk-deep-research/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
89: * @returns {Array<Object>} Parsed records (corrupt lines silently dropped — use parseJsonlDetailed for fail-closed behavior)
98: * Returns both the parsed records and a corruption warning list. The reducer
102: * @returns {{records: Array<Object>, corruptionWarnings: Array<{line: number, raw: string, error: string}>}}
106:  const corruptionWarnings = [];
119:      corruptionWarnings.push({
127:  return { records, corruptionWarnings };
319:    const finalSeverity = normalizeSeverity(getNestedField(record, 'finalSeverity'));
320:    if (!findingId || !finalSeverity) {
329:      finalSeverity,
353:    lineageMode: normalizeText(getNestedField(latestLifecycleEvent, 'lineageMode') || '')
354:      || normalizeText(config.lineageMode || '')
383:    if (record.event === 'synthesis_complete') {
422:function createCorruptionError(stateLogPath, corruptionWarnings) {
423:  const preview = corruptionWarnings
428:    `[sk-deep-review] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
429:    + 'Pass --lenient to the reducer CLI (or lenient:true to reduceReviewState) to ignore corruption.',
432:  error.corruptionWarnings = corruptionWarnings;
448:      const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
632: * the review dashboard cannot render `[object Object]` even if an older YAML
690:function buildRegistry(strategyDimensions, iterationFiles, iterationRecords, config, corruptionWarnings = []) {
691:  const lineage = buildLineageState(config, iterationRecords);
722:    sessionId: lineage.sessionId,
723:    parentSessionId: lineage.parentSessionId,
724:    generation: lineage.generation,
725:    lineageMode: lineage.lineageMode,
726:    continuedFromRun: lineage.continuedFromRun,
743:    corruptionWarnings,
883:function renderDashboard(config, registry, iterationRecords, iterationFiles) {
948:    `- Lifecycle Mode: ${registry.lineageMode || 'new'}`,
982:    '## 6. BLOCKED STOPS',
1025:    '<!-- ANCHOR:corruption-warnings -->',
1027:    ...(Array.isArray(registry.corruptionWarnings) && registry.corruptionWarnings.length > 0
1028:      ? registry.corruptionWarnings.map((w) => `- Line ${w.line}: ${w.error} (raw: ${w.raw})`)
1029:      : ['No corrupt JSONL lines detected.']),
1031:    '<!-- /ANCHOR:corruption-warnings -->',
1038:    '## 11. ACTIVE RISKS',
1044:      // claim-adjudication and legal-stop gate failures, not just severity.
1071:        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
1075:        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
1114:  const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
1115:  const lineage = buildLineageState(config, records);
1117:  config.sessionId = lineage.sessionId || config.sessionId || '';
1118:  config.parentSessionId = lineage.parentSessionId;
1119:  config.lineageMode = lineage.lineageMode;
1120:  config.generation = lineage.generation;
1121:  config.continuedFromRun = lineage.continuedFromRun;
1134:  const registry = buildRegistry(strategyDimensions, iterationFiles, records, config, corruptionWarnings);
1136:  const dashboard = renderDashboard(config, registry, records, iterationFiles);
1146:  if (corruptionWarnings.length > 0 && !lenient) {
1147:    throw createCorruptionError(stateLogPath, corruptionWarnings);
1159:    corruptionWarnings,
1160:    hasCorruption: corruptionWarnings.length > 0,
1194:          corruptionCount: result.corruptionWarnings.length,

 succeeded in 0ms:
104:  const candidates = [
115:  for (const candidate of candidates) {
116:    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
117:      return candidate;
119:    if (typeof candidate === 'string' && candidate.trim()) {
120:      return candidate;
247:    typeof node.candidateId === 'string'
248:      ? node.candidateId
266:    candidateId: id,
350:      coverageRatio: null,
356:    coverageRatio: exhaustedKeys.size / trackedKeys.size,
370:    coverageRatio: isFiniteNumber(metrics.coverageRatio)
371:      ? metrics.coverageRatio
372:      : derivedMetrics.coverageRatio,
518:  const candidateScore = Number(record.score ?? record.totals?.candidate ?? -Infinity);
519:  const currentScore = Number(bucket.bestPromptRecord?.score ?? bucket.bestPromptRecord?.totals?.candidate ?? -Infinity);
520:  if (candidateScore > currentScore) {
616:    if (record.type === 'accepted' || record.recommendation === 'candidate-acceptable' || record.recommendation === 'candidate-better') {
620:    } else if (record.type === 'rejected' || record.recommendation === 'candidate-worse' || record.recommendation === 'candidate-rejected' || record.recommendation === 'reject-candidate') {
827:- Accepted candidates: ${bucket.metrics.acceptedCount}
828:- Rejected candidates: ${bucket.metrics.rejectedCount}
832:- Best prompt score: ${bestPrompt ? Number(bestPrompt.score ?? bestPrompt.totals?.candidate ?? 0) : 'n/a'}
870:function renderJournalSummarySection(summary) {
871:  if (!summary) {
882:| Last session start | ${formatDashboardValue(summary.lastSessionStart)} |
883:| Last session end | ${formatDashboardValue(summary.lastSessionEnd)} |
884:| Total events | ${formatDashboardValue(summary.totalEvents)} |
885:| Stop reason | ${formatDashboardValue(summary.stopReason)} |
886:| Session outcome | ${formatDashboardValue(summary.sessionOutcome)} |
887:| Latest legal-stop evaluation | ${formatDashboardValue(summary.latestLegalStop?.timestamp)} |
888:| Latest blocked stop | ${formatDashboardValue(summary.latestBlockedStop?.timestamp)} |
892:${renderEventTypeCounts(summary.eventTypeCounts)}
894:${summary.latestLegalStop ? `### Latest legal-stop evaluation
896:- Gates: ${formatDashboardValue(Object.keys(summary.latestLegalStop.gateResults || {}).sort().join(', ') || 'none')}
898:${summary.latestBlockedStop ? `### Latest blocked stop
900:- Failed gates: ${formatDashboardValue(summary.latestBlockedStop.failedGates.join(', ') || 'none')}
901:- Reason: ${formatDashboardValue(summary.latestBlockedStop.reason)}
906:function renderCandidateLineageSection(summary) {
907:  if (!summary) {
918:| Lineage depth | ${formatDashboardValue(summary.lineageDepth)} |
919:| Total candidates | ${formatDashboardValue(summary.totalCandidates)} |
920:| Current leaf | ${formatDashboardValue(summary.currentLeaf)} |
924:function renderMutationCoverageSection(summary) {
925:  if (!summary) {
936:| Coverage ratio | ${formatDashboardValue(summary.coverageRatio)} |
937:| Uncovered mutations | ${formatDashboardValue(summary.uncoveredMutations)} |
942:  const sections = Object.values(registry.profiles)
958:    renderCandidateLineageSection(registry.candidateLineage),
972:| Accepted candidates | ${registry.globalMetrics.acceptedCount} |
973:| Rejected candidates | ${registry.globalMetrics.rejectedCount} |
995:${sections}
1010:    process.stderr.write('Usage: node reduce-state.cjs <improvement-runtime-root>\n');
1014:  const stateLogPath = path.join(runtimeRoot, 'agent-improvement-state.jsonl');
1016:  const dashboardPath = path.join(runtimeRoot, 'agent-improvement-dashboard.md');
1017:  const configPath = path.join(runtimeRoot, 'agent-improvement-config.json');
1019:  const journalPath = path.join(runtimeRoot, 'improvement-journal.jsonl');
1020:  const candidateLineagePath = path.join(runtimeRoot, 'candidate-lineage.json');
1021:  const mutationCoveragePath = path.join(runtimeRoot, 'mutation-coverage.json');
1026:  registry.candidateLineage = buildCandidateLineageSummary(candidateLineagePath);
1032:  const dashboard = renderDashboard(registry, sampleQuality);
1035:  writeUtf8(dashboardPath, dashboard);

 succeeded in 0ms:
226:  const namedScore = signals.blendedScore
228:    ?? signals.convergenceScore
247:  const latestGraphConvergence = eventRecords.filter((record) => record.event === 'graph_convergence').at(-1);
265:  const configLineage = config.lineage && typeof config.lineage === 'object'
266:    ? config.lineage
290:    lineageMode: typeof latestLifecycleEvent?.lineageMode === 'string' && latestLifecycleEvent.lineageMode
291:      ? latestLifecycleEvent.lineageMode
292:      : typeof configLineage.lineageMode === 'string' && configLineage.lineageMode
293:        ? configLineage.lineageMode
310:  const latestSynthesisComplete = eventRecords.filter((record) => record.event === 'synthesis_complete').at(-1);
521:  const convergenceScore =
522:    latestIteration?.convergenceSignals?.compositeStop
535:  const lineage = reducerState.lineage && typeof reducerState.lineage === 'object'
536:    ? reducerState.lineage
540:    sessionId: lineage.sessionId || '',
541:    parentSessionId: lineage.parentSessionId ?? null,
542:    lineageMode: lineage.lineageMode || 'new',
543:    generation: lineage.generation ?? 1,
544:    continuedFromRun: lineage.continuedFromRun ?? null,
569:      convergenceScore,
670:  const sessionId = registry.sessionId || config.lineage?.sessionId || '[Unknown session]';
671:  const parentSessionId = registry.parentSessionId ?? config.lineage?.parentSessionId ?? 'none';
672:  const lineageMode = registry.lineageMode || config.lineage?.lineageMode || 'new';
673:  const generation = registry.generation ?? config.lineage?.generation ?? 1;
674:  const continuedFromRun = registry.continuedFromRun ?? config.lineage?.continuedFromRun ?? 'none';
715:    `- Lifecycle Mode: ${lineageMode}`,
746:    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
770:    '## 9. BLOCKED STOPS',
781:    '<!-- ANCHOR:graph-convergence -->',
789:    '<!-- /ANCHOR:graph-convergence -->',
829:  const lineage = buildLineageState(config, events);
830:  config.lineage = {
831:    ...(config.lineage && typeof config.lineage === 'object' ? config.lineage : {}),
832:    sessionId: lineage.sessionId,
833:    parentSessionId: lineage.parentSessionId,
834:    lineageMode: lineage.lineageMode,
835:    generation: lineage.generation,
836:    continuedFromRun: lineage.continuedFromRun,
840:    lineage,

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '300,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '880,1165p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '620,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	
   301	function mergeTransitions(existingTransitions, incomingTransitions) {
   302	  return normalizeTransitions(
   303	    []
   304	      .concat(Array.isArray(existingTransitions) ? existingTransitions : [])
   305	      .concat(Array.isArray(incomingTransitions) ? incomingTransitions : []),
   306	    0,
   307	  );
   308	}
   309	
   310	function buildClaimAdjudicationByFinding(records) {
   311	  const adjudicationByFinding = new Map();
   312	
   313	  for (const record of records) {
   314	    if (record?.type !== 'event' || record?.event !== 'claim_adjudication') {
   315	      continue;
   316	    }
   317	
   318	    const findingId = normalizeText(getNestedField(record, 'findingId') || '');
   319	    const finalSeverity = normalizeSeverity(getNestedField(record, 'finalSeverity'));
   320	    if (!findingId || !finalSeverity) {
   321	      continue;
   322	    }
   323	
   324	    const run = isFiniteNumber(getNestedField(record, 'run'))
   325	      ? getNestedField(record, 'run')
   326	      : 0;
   327	    adjudicationByFinding.set(findingId, {
   328	      findingId,
   329	      finalSeverity,
   330	      transitions: normalizeTransitions(getNestedField(record, 'transitions'), run),
   331	      reason: normalizeText(getNestedField(record, 'reason') || ''),
   332	      run,
   333	      timestamp: normalizeText(getNestedField(record, 'timestamp') || ''),
   334	    });
   335	  }
   336	
   337	  return adjudicationByFinding;
   338	}
   339	
   340	function buildLineageState(config, records) {
   341	  const latestLifecycleEvent = records
   342	    .filter((record) => record?.type === 'event' && (record?.event === 'resumed' || record?.event === 'restarted'))
   343	    .at(-1);
   344	  const eventContinuedFromRun = latestLifecycleEvent
   345	    ? getNestedField(latestLifecycleEvent, 'continuedFromRun') ?? getNestedField(latestLifecycleEvent, 'fromIteration')
   346	    : undefined;
   347	
   348	  return {
   349	    sessionId: normalizeText(getNestedField(latestLifecycleEvent, 'sessionId') || '') || normalizeText(config.sessionId || '') || '',
   350	    parentSessionId: normalizeText(getNestedField(latestLifecycleEvent, 'parentSessionId') || '')
   351	      || normalizeText(config.parentSessionId || '')
   352	      || null,
   353	    lineageMode: normalizeText(getNestedField(latestLifecycleEvent, 'lineageMode') || '')
   354	      || normalizeText(config.lineageMode || '')
   355	      || 'new',
   356	    generation: isFiniteNumber(getNestedField(latestLifecycleEvent, 'generation'))
   357	      ? getNestedField(latestLifecycleEvent, 'generation')
   358	      : isFiniteNumber(config.generation)
   359	        ? config.generation
   360	        : 1,
   361	    continuedFromRun: isFiniteNumber(eventContinuedFromRun)
   362	      ? eventContinuedFromRun
   363	      : isFiniteNumber(config.continuedFromRun)
   364	        ? config.continuedFromRun
   365	        : null,
   366	  };
   367	}
   368	
   369	function buildTerminalStopState(records) {
   370	  let latestSynthesis = null;
   371	  let latestSynthesisIndex = -1;
   372	  let latestIterationIndex = -1;
   373	  let latestLifecycleIndex = -1;
   374	
   375	  records.forEach((record, index) => {
   376	    if (record?.type === 'iteration') {
   377	      latestIterationIndex = index;
   378	      return;
   379	    }
   380	    if (record?.type !== 'event') {
   381	      return;
   382	    }
   383	    if (record.event === 'synthesis_complete') {
   384	      latestSynthesis = record;
   385	      latestSynthesisIndex = index;
   386	    }
   387	    if (record.event === 'resumed' || record.event === 'restarted') {
   388	      latestLifecycleIndex = index;
   389	    }
   390	  });
   391	
   392	  if (!latestSynthesis) {
   393	    return null;
   394	  }
   395	  if (latestSynthesisIndex < Math.max(latestIterationIndex, latestLifecycleIndex)) {
   396	    return null;
   397	  }
   398	
   399	  return {
   400	    stopReason: normalizeText(getNestedField(latestSynthesis, 'stopReason') || '') || null,
   401	    totalIterations: isFiniteNumber(getNestedField(latestSynthesis, 'totalIterations'))
   402	      ? getNestedField(latestSynthesis, 'totalIterations')
   403	      : null,
   404	    timestamp: normalizeText(getNestedField(latestSynthesis, 'timestamp') || '') || null,
   405	  };
   406	}
   407	
   408	function deriveDashboardStatus(config, records, terminalStop) {
   409	  if (terminalStop) {
   410	    return 'COMPLETE';
   411	  }
   412	  const rawStatus = normalizeText(config.status || '').toLowerCase() || 'initialized';
   413	  if (rawStatus === 'complete' || rawStatus === 'completed') {
   414	    return 'COMPLETE';
   415	  }
   416	  if (rawStatus === 'running') {
   417	    return 'RUNNING';
   418	  }
   419	  return rawStatus.toUpperCase();
   420	}
   421	
   422	function createCorruptionError(stateLogPath, corruptionWarnings) {
   423	  const preview = corruptionWarnings
   424	    .slice(0, 3)
   425	    .map((warning) => `  - line ${warning.line}: ${warning.error}`)
   426	    .join('\n');
   427	  const error = new Error(
   428	    `[sk-deep-review] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
   429	    + 'Pass --lenient to the reducer CLI (or lenient:true to reduceReviewState) to ignore corruption.',
   430	  );
   431	  error.code = 'STATE_CORRUPTION';
   432	  error.corruptionWarnings = corruptionWarnings;
   433	  error.stateLogPath = stateLogPath;
   434	  return error;
   435	}
   436	
   437	// ─────────────────────────────────────────────────────────────────────────────
   438	// 5. CORE LOGIC
   439	// ─────────────────────────────────────────────────────────────────────────────
   440	
   441	function buildFindingRegistry(iterationFiles, iterationRecords) {
   442	  const findingById = new Map();
   443	  const claimAdjudicationByFinding = buildClaimAdjudicationByFinding(iterationRecords);
   444	
   445	  for (const iteration of iterationFiles) {
   446	    for (const finding of iteration.findings) {
   447	      const claimAdjudication = claimAdjudicationByFinding.get(finding.findingId);
   448	      const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
   449	      const existing = findingById.get(finding.findingId);
   450	      if (!existing) {
   451	        findingById.set(finding.findingId, {
   452	          ...finding,
   453	          severity: canonicalSeverity,
   454	          dimension: deriveDimension({ ...finding, severity: canonicalSeverity }, iteration),
   455	          firstSeen: iteration.run,
   456	          lastSeen: iteration.run,
   457	          status: 'active',
   458	          transitions: mergeTransitions(
   459	            [{
   460	              iteration: iteration.run,

 succeeded in 0ms:
   880	  return updated;
   881	}
   882	
   883	function renderDashboard(config, registry, iterationRecords, iterationFiles) {
   884	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   885	  const ratios = iterationRecords
   886	    .filter((record) => record.type === 'iteration')
   887	    .map((record) => (typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio : null))
   888	    .filter((value) => value !== null);
   889	  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
   890	  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   891	    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
   892	    || '[All dimensions covered]';
   893	
   894	  const severity = registry.findingsBySeverity;
   895	  const verdict = severity.P0 > 0
   896	    ? 'FAIL'
   897	    : severity.P1 > 0
   898	      ? 'CONDITIONAL'
   899	      : 'PASS';
   900	  const hasAdvisories = verdict === 'PASS' && severity.P2 > 0;
   901	
   902	  const progressRows = iterationRecords
   903	    .filter((record) => record.type === 'iteration')
   904	    .map((record) => {
   905	      const dimensions = Array.isArray(record.dimensions) ? record.dimensions.join('/') : '-';
   906	      const ratio = typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio.toFixed(2) : '0.00';
   907	      const summary = record.findingsSummary || {};
   908	      const findings = `${summary.P0 ?? 0}/${summary.P1 ?? 0}/${summary.P2 ?? 0}`;
   909	      return `| ${record.run} | ${record.focus || 'unknown'} | ${dimensions} | ${ratio} | ${findings} | ${record.status || 'complete'} |`;
   910	    })
   911	    .join('\n') || '| 0 | none yet | - | 0.00 | 0/0/0 | initialized |';
   912	
   913	  const dimensionRows = REQUIRED_DIMENSIONS
   914	    .map((dimension) => {
   915	      const covered = registry.dimensionCoverage[dimension];
   916	      const status = covered ? 'covered' : 'pending';
   917	      const openInDimension = registry.openFindings.filter((finding) => finding.dimension === dimension).length;
   918	      return `| ${dimension} | ${status} | ${openInDimension} |`;
   919	    })
   920	    .join('\n');
   921	
   922	  return [
   923	    '---',
   924	    'title: Deep Review Dashboard',
   925	    'description: Auto-generated reducer view over the review packet.',
   926	    '---',
   927	    '',
   928	    '# Deep Review Dashboard - Session Overview',
   929	    '',
   930	    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
   931	    '',
   932	    '<!-- ANCHOR:overview -->',
   933	    '## 1. OVERVIEW',
   934	    '',
   935	    'Reducer-generated observability surface for the active review packet.',
   936	    '',
   937	    '<!-- /ANCHOR:overview -->',
   938	    '<!-- ANCHOR:status -->',
   939	    '## 2. STATUS',
   940	    `- Review Target: ${config.reviewTarget || '[Unknown target]'} (${config.reviewTargetType || 'unknown'})`,
   941	    `- Started: ${config.createdAt || '[Unknown start]'}`,
   942	    `- Status: ${registry.status || String(config.status || 'initialized').toUpperCase()}`,
   943	    `- Iteration: ${iterationRecords.filter((record) => record.type === 'iteration').length} of ${config.maxIterations || 0}`,
   944	    `- Provisional Verdict: ${verdict}`,
   945	    `- hasAdvisories: ${hasAdvisories}`,
   946	    `- Session ID: ${registry.sessionId || '[Unknown session]'}`,
   947	    `- Parent Session: ${registry.parentSessionId ?? 'none'}`,
   948	    `- Lifecycle Mode: ${registry.lineageMode || 'new'}`,
   949	    `- Generation: ${registry.generation ?? 1}`,
   950	    `- continuedFromRun: ${registry.continuedFromRun ?? 'none'}`,
   951	    ...(registry.terminalStop?.stopReason ? [`- stopReason: ${registry.terminalStop.stopReason}`] : []),
   952	    '',
   953	    '<!-- /ANCHOR:status -->',
   954	    '<!-- ANCHOR:findings-summary -->',
   955	    '## 3. FINDINGS SUMMARY',
   956	    '',
   957	    '| Severity | Count |',
   958	    '|----------|------:|',
   959	    `| P0 (Blockers) | ${severity.P0} |`,
   960	    `| P1 (Required) | ${severity.P1} |`,
   961	    `| P2 (Suggestions) | ${severity.P2} |`,
   962	    `| Resolved | ${registry.resolvedFindingsCount} |`,
   963	    '',
   964	    '<!-- /ANCHOR:findings-summary -->',
   965	    '<!-- ANCHOR:progress -->',
   966	    '## 4. PROGRESS',
   967	    '',
   968	    '| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |',
   969	    '|---|-------|------------|-------|----------|--------|',
   970	    progressRows,
   971	    '',
   972	    '<!-- /ANCHOR:progress -->',
   973	    '<!-- ANCHOR:dimension-coverage -->',
   974	    '## 5. DIMENSION COVERAGE',
   975	    '',
   976	    '| Dimension | Status | Open findings |',
   977	    '|-----------|--------|--------------:|',
   978	    dimensionRows,
   979	    '',
   980	    '<!-- /ANCHOR:dimension-coverage -->',
   981	    '<!-- ANCHOR:blocked-stops -->',
   982	    '## 6. BLOCKED STOPS',
   983	    ...(registry.blockedStopHistory && registry.blockedStopHistory.length > 0
   984	      ? registry.blockedStopHistory.flatMap((entry) => {
   985	          const blockers = Array.isArray(entry.blockedBy) && entry.blockedBy.length > 0
   986	            ? entry.blockedBy.join(', ')
   987	            : 'unknown gates';
   988	          const gateSummary = entry.gateResults && typeof entry.gateResults === 'object'
   989	            ? Object.entries(entry.gateResults)
   990	                .map(([gate, result]) => {
   991	                  const pass = result && typeof result === 'object' && 'pass' in result ? result.pass : '?';
   992	                  return `${gate}: ${pass}`;
   993	                })
   994	                .join(', ')
   995	            : '[no gate results]';
   996	          return [
   997	            `### Iteration ${entry.run} — blocked by [${blockers}]`,
   998	            `- Recovery: ${entry.recoveryStrategy || '[no recovery strategy recorded]'}`,
   999	            `- Gate results: ${gateSummary}`,
  1000	            `- Timestamp: ${entry.timestamp || '[no timestamp]'}`,
  1001	            '',
  1002	          ];
  1003	        })
  1004	      : ['No blocked-stop events recorded.', '']),
  1005	    '<!-- /ANCHOR:blocked-stops -->',
  1006	    '<!-- ANCHOR:graph-convergence -->',
  1007	    '## 7. GRAPH CONVERGENCE',
  1008	    `- graphConvergenceScore: ${Number(registry.graphConvergenceScore || 0).toFixed(2)}`,
  1009	    `- graphDecision: ${registry.graphDecision || 'none'}`,
  1010	    ...(Array.isArray(registry.graphBlockers) && registry.graphBlockers.length > 0
  1011	      ? [`- graphBlockers: ${registry.graphBlockers.map((b) => (typeof b === 'string' ? b : JSON.stringify(b))).join(', ')}`]
  1012	      : ['- graphBlockers: none']),
  1013	    '',
  1014	    '<!-- /ANCHOR:graph-convergence -->',
  1015	    '<!-- ANCHOR:trend -->',
  1016	    '## 8. TREND',
  1017	    `- Last 3 ratios: ${lastThreeRatios}`,
  1018	    `- convergenceScore: ${Number(registry.convergenceScore || 0).toFixed(2)}`,
  1019	    `- openFindings: ${registry.openFindingsCount}`,
  1020	    `- persistentSameSeverity: ${(registry.persistentSameSeverity || []).length}`,
  1021	    `- severityChanged: ${(registry.severityChanged || []).length}`,
  1022	    `- repeatedFindings (deprecated combined bucket): ${registry.repeatedFindings.length}`,
  1023	    '',
  1024	    '<!-- /ANCHOR:trend -->',
  1025	    '<!-- ANCHOR:corruption-warnings -->',
  1026	    '## 9. CORRUPTION WARNINGS',
  1027	    ...(Array.isArray(registry.corruptionWarnings) && registry.corruptionWarnings.length > 0
  1028	      ? registry.corruptionWarnings.map((w) => `- Line ${w.line}: ${w.error} (raw: ${w.raw})`)
  1029	      : ['No corrupt JSONL lines detected.']),
  1030	    '',
  1031	    '<!-- /ANCHOR:corruption-warnings -->',
  1032	    '<!-- ANCHOR:next-focus -->',
  1033	    '## 10. NEXT FOCUS',
  1034	    nextFocus,
  1035	    '',
  1036	    '<!-- /ANCHOR:next-focus -->',
  1037	    '<!-- ANCHOR:active-risks -->',
  1038	    '## 11. ACTIVE RISKS',
  1039	    ...(function buildActiveRisks() {
  1040	      // REQ-034 (042 closing audit, F015): surface non-P0 release-readiness
  1041	      // debt alongside P0s so the dashboard cannot hide P1 debt behind a
  1042	      // "None active" summary when activeP0 == 0. Gate debt on the latest
  1043	      // `blocked_stop` and `claim_adjudication` events so operators see
  1044	      // claim-adjudication and legal-stop gate failures, not just severity.
  1045	      const lines = [];
  1046	      if (latestIteration?.status === 'error') {
  1047	        lines.push('- Latest iteration reported error status.');
  1048	      }
  1049	      if (severity.P0 > 0) {
  1050	        lines.push(`- ${severity.P0} active P0 finding(s) blocking release.`);
  1051	      }
  1052	      if (severity.P1 > 0) {
  1053	        lines.push(`- ${severity.P1} active P1 finding(s) — required before release; not a P0 but still blocks PASS.`);
  1054	      }
  1055	      const latestClaimAdjudication = [...iterationRecords]
  1056	        .reverse()
  1057	        .find((record) => record
  1058	          && record.type === 'event'
  1059	          && record.event === 'claim_adjudication'
  1060	          && typeof getNestedField(record, 'passed') === 'boolean'
  1061	          && !normalizeText(getNestedField(record, 'findingId') || ''));
  1062	      const activeP0P1 = severity.P0 + severity.P1;
  1063	      const adjudicationActiveCount = isFiniteNumber(getNestedField(latestClaimAdjudication, 'activeP0P1'))
  1064	        ? getNestedField(latestClaimAdjudication, 'activeP0P1')
  1065	        : activeP0P1;
  1066	      if (latestClaimAdjudication && getNestedField(latestClaimAdjudication, 'passed') === false && activeP0P1 > 0 && adjudicationActiveCount > 0) {
  1067	        const missingPackets = getNestedField(latestClaimAdjudication, 'missingPackets');
  1068	        const missing = Array.isArray(missingPackets) && missingPackets.length > 0
  1069	          ? ` (missing packets: ${missingPackets.join(', ')})`
  1070	          : '';
  1071	        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
  1072	      }
  1073	      const latestBlockedStop = registry.blockedStopHistory?.at(-1);
  1074	      if (latestBlockedStop && Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0) {
  1075	        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
  1076	      }
  1077	      if (severity.P2 > 0 && lines.length === 0) {
  1078	        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
  1079	      }
  1080	      if (lines.length === 0) {
  1081	        lines.push('- None active beyond normal review uncertainty.');
  1082	      }
  1083	      return lines;
  1084	    })(),
  1085	    '',
  1086	    '<!-- /ANCHOR:active-risks -->',
  1087	    '',
  1088	  ].join('\n');
  1089	}
  1090	
  1091	/**
  1092	 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
  1093	 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
  1094	 *
  1095	 * @param {string} specFolder - Path to the spec folder containing a review/ directory
  1096	 * @param {Object} [options] - Reducer options
  1097	 * @param {boolean} [options.write=true] - Write outputs to disk when true
  1098	 * @returns {Object} Paths and content for registry, strategy, and dashboard
  1099	 */
  1100	function reduceReviewState(specFolder, options = {}) {
  1101	  const write = options.write !== false;
  1102	  const lenient = Boolean(options.lenient);
  1103	  const createMissingAnchors = Boolean(options.createMissingAnchors);
  1104	  const resolvedSpecFolder = path.resolve(specFolder);
  1105	  const reviewDir = path.join(resolvedSpecFolder, 'review');
  1106	  const configPath = path.join(reviewDir, 'deep-review-config.json');
  1107	  const stateLogPath = path.join(reviewDir, 'deep-review-state.jsonl');
  1108	  const strategyPath = path.join(reviewDir, 'deep-review-strategy.md');
  1109	  const registryPath = path.join(reviewDir, 'deep-review-findings-registry.json');
  1110	  const dashboardPath = path.join(reviewDir, 'deep-review-dashboard.md');
  1111	  const iterationDir = path.join(reviewDir, 'iterations');
  1112	
  1113	  const config = readJson(configPath);
  1114	  const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
  1115	  const lineage = buildLineageState(config, records);
  1116	  const terminalStop = buildTerminalStopState(records);
  1117	  config.sessionId = lineage.sessionId || config.sessionId || '';
  1118	  config.parentSessionId = lineage.parentSessionId;
  1119	  config.lineageMode = lineage.lineageMode;
  1120	  config.generation = lineage.generation;
  1121	  config.continuedFromRun = lineage.continuedFromRun;
  1122	  if (terminalStop?.stopReason) {
  1123	    config.stopReason = terminalStop.stopReason;
  1124	  }
  1125	  const strategyContent = fs.existsSync(strategyPath) ? readUtf8(strategyPath) : '';
  1126	  const strategyDimensions = parseStrategyDimensions(strategyContent);
  1127	  const iterationFiles = fs.existsSync(iterationDir)
  1128	    ? fs.readdirSync(iterationDir)
  1129	        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
  1130	        .sort()
  1131	        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
  1132	    : [];
  1133	
  1134	  const registry = buildRegistry(strategyDimensions, iterationFiles, records, config, corruptionWarnings);
  1135	  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, { createMissingAnchors }, records);
  1136	  const dashboard = renderDashboard(config, registry, records, iterationFiles);
  1137	
  1138	  if (write) {
  1139	    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  1140	    if (strategyContent) {
  1141	      writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
  1142	    }
  1143	    writeUtf8(dashboardPath, dashboard);
  1144	  }
  1145	
  1146	  if (corruptionWarnings.length > 0 && !lenient) {
  1147	    throw createCorruptionError(stateLogPath, corruptionWarnings);
  1148	  }
  1149	
  1150	  return {
  1151	    configPath,
  1152	    stateLogPath,
  1153	    strategyPath,
  1154	    registryPath,
  1155	    dashboardPath,
  1156	    registry,
  1157	    strategy,
  1158	    dashboard,
  1159	    corruptionWarnings,
  1160	    hasCorruption: corruptionWarnings.length > 0,
  1161	  };
  1162	}
  1163	
  1164	// ─────────────────────────────────────────────────────────────────────────────
  1165	// 6. CLI ENTRY POINT

 succeeded in 0ms:
   620	    };
   621	  }
   622	
   623	  return {
   624	    score: computeGraphConvergenceScore(latest.signals),
   625	    decision: normalizeText(latest.decision || '') || null,
   626	    blockers: Array.isArray(latest.blockers) ? latest.blockers : [],
   627	  };
   628	}
   629	
   630	/**
   631	 * Phase 008 P1-02 closure: defensively normalize each entry in `blockedBy` so
   632	 * the review dashboard cannot render `[object Object]` even if an older YAML
   633	 * workflow accidentally passes structured graph blockers through the contract.
   634	 *
   635	 * Contract: `blockedBy` is `string[]` of gate names. If an entry is already a
   636	 * string, pass it through. If it is a structured graph blocker object
   637	 * (`{type, description, count, severity}`), prefer `.type`, then `.name`, then
   638	 * a short JSON preview. If it is anything else, stringify it.
   639	 */
   640	function normalizeBlockedByList(value, legacyLegalStop) {
   641	  const rawList = Array.isArray(value)
   642	    ? value
   643	    : Array.isArray(legacyLegalStop?.blockedBy)
   644	      ? legacyLegalStop.blockedBy
   645	      : [];
   646	
   647	  return rawList.map((entry) => {
   648	    if (typeof entry === 'string') return entry;
   649	    if (entry && typeof entry === 'object') {
   650	      if (typeof entry.type === 'string' && entry.type.length > 0) return entry.type;
   651	      if (typeof entry.name === 'string' && entry.name.length > 0) return entry.name;
   652	      return 'graph_blocker';
   653	    }
   654	    return String(entry);
   655	  });
   656	}
   657	
   658	function buildBlockedStopHistory(records) {
   659	  return records
   660	    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
   661	    .map((record) => {
   662	      const nestedLegalStop = getNestedField(record, 'legalStop');
   663	      const legacyLegalStop = nestedLegalStop && typeof nestedLegalStop === 'object'
   664	        ? nestedLegalStop
   665	        : {};
   666	      const blockedByValue = getNestedField(record, 'blockedBy');
   667	      const graphBlockerDetailValue = getNestedField(record, 'graphBlockerDetail');
   668	      const blockedBy = normalizeBlockedByList(blockedByValue, legacyLegalStop);
   669	      const graphBlockerDetail = Array.isArray(graphBlockerDetailValue)
   670	        ? graphBlockerDetailValue
   671	        : Array.isArray(blockedByValue) && blockedByValue.some((e) => e && typeof e === 'object')
   672	          ? blockedByValue
   673	          : [];
   674	
   675	      return {
   676	        run: isFiniteNumber(getNestedField(record, 'run')) ? getNestedField(record, 'run') : 0,
   677	        blockedBy,
   678	        graphBlockerDetail,
   679	        gateResults: getNestedField(record, 'gateResults') && typeof getNestedField(record, 'gateResults') === 'object'
   680	          ? getNestedField(record, 'gateResults')
   681	          : legacyLegalStop.gateResults && typeof legacyLegalStop.gateResults === 'object'
   682	            ? legacyLegalStop.gateResults
   683	            : {},
   684	        recoveryStrategy: normalizeText(getNestedField(record, 'recoveryStrategy') || ''),
   685	        timestamp: normalizeText(getNestedField(record, 'timestamp') || ''),
   686	      };
   687	    });
   688	}
   689	
   690	function buildRegistry(strategyDimensions, iterationFiles, iterationRecords, config, corruptionWarnings = []) {
   691	  const lineage = buildLineageState(config, iterationRecords);
   692	  const terminalStop = buildTerminalStopState(iterationRecords);
   693	  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
   694	  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
   695	  const findingsBySeverity = buildFindingsBySeverity(openFindings);
   696	  const convergenceScore = computeConvergenceScore(iterationRecords);
   697	  const graphConvergence = buildGraphConvergenceRollup(iterationRecords);
   698	  const blockedStopHistory = buildBlockedStopHistory(iterationRecords);
   699	  const status = deriveDashboardStatus(config, iterationRecords, terminalStop);
   700	
   701	  // Part C REQ-018: split repeatedFindings into two semantically distinct buckets
   702	  // so persistent-same-severity findings and severity-churn findings don't collapse.
   703	  const persistentSameSeverity = openFindings.filter((finding) => {
   704	    if (finding.lastSeen - finding.firstSeen < 1) return false;
   705	    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
   706	    // Exclude the initial discovery transition from the "no change" count
   707	    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
   708	    return nontrivialTransitions.length === 0;
   709	  });
   710	
   711	  const severityChanged = openFindings.filter((finding) => {
   712	    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
   713	    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
   714	    return nontrivialTransitions.length > 0;
   715	  });
   716	
   717	  // Deprecated: keep repeatedFindings for backward compatibility with older consumers.
   718	  // New code should read persistentSameSeverity + severityChanged directly.
   719	  const repeatedFindings = openFindings.filter((finding) => finding.lastSeen - finding.firstSeen >= 1);
   720	
   721	  return {
   722	    sessionId: lineage.sessionId,
   723	    parentSessionId: lineage.parentSessionId,
   724	    generation: lineage.generation,
   725	    lineageMode: lineage.lineageMode,
   726	    continuedFromRun: lineage.continuedFromRun,
   727	    terminalStop,
   728	    status,
   729	    openFindings,
   730	    resolvedFindings,
   731	    blockedStopHistory,
   732	    persistentSameSeverity,
   733	    severityChanged,
   734	    repeatedFindings,
   735	    dimensionCoverage,
   736	    findingsBySeverity,
   737	    openFindingsCount: openFindings.length,
   738	    resolvedFindingsCount: resolvedFindings.length,
   739	    convergenceScore,
   740	    graphConvergenceScore: graphConvergence.score,
   741	    graphDecision: graphConvergence.decision,
   742	    graphBlockers: graphConvergence.blockers,
   743	    corruptionWarnings,
   744	  };
   745	}
   746	
   747	function blockFromBulletList(items) {
   748	  if (!items.length) {
   749	    return '[None yet]';
   750	  }
   751	  return items.map((item) => `- ${item}`).join('\n');
   752	}
   753	
   754	function buildExhaustedApproaches(iterationFiles) {
   755	  const grouped = new Map();
   756	
   757	  for (const iteration of iterationFiles) {
   758	    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
   759	      const bucket = grouped.get(entry) || [];
   760	      bucket.push(iteration.run);

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '210,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '441,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '500,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   210	    seen.add(item.id);
   211	    result.push(item);
   212	  }
   213	
   214	  return result;
   215	}
   216	
   217	function isFiniteNumber(value) {
   218	  return typeof value === 'number' && Number.isFinite(value);
   219	}
   220	
   221	function computeGraphConvergenceScore(signals) {
   222	  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
   223	    return 0;
   224	  }
   225	
   226	  const namedScore = signals.blendedScore
   227	    ?? signals.score
   228	    ?? signals.convergenceScore
   229	    ?? signals.compositeScore
   230	    ?? signals.stopScore
   231	    ?? signals.decisionScore;
   232	  if (isFiniteNumber(namedScore)) {
   233	    return namedScore;
   234	  }
   235	
   236	  const numericSignals = Object.values(signals)
   237	    .filter((value) => isFiniteNumber(value));
   238	  if (!numericSignals.length) {
   239	    return 0;
   240	  }
   241	
   242	  const sum = numericSignals.reduce((total, value) => total + value, 0);
   243	  return sum / numericSignals.length;
   244	}
   245	
   246	function buildGraphConvergenceRollup(eventRecords) {
   247	  const latestGraphConvergence = eventRecords.filter((record) => record.event === 'graph_convergence').at(-1);
   248	  const signals = latestGraphConvergence?.signals && typeof latestGraphConvergence.signals === 'object'
   249	    ? latestGraphConvergence.signals
   250	    : {};
   251	  const blockers = Array.isArray(latestGraphConvergence?.blockers)
   252	    ? latestGraphConvergence.blockers
   253	    : [];
   254	
   255	  return {
   256	    graphConvergenceScore: computeGraphConvergenceScore(signals),
   257	    graphDecision: typeof latestGraphConvergence?.decision === 'string'
   258	      ? latestGraphConvergence.decision
   259	      : null,
   260	    graphBlockers: blockers,
   261	  };
   262	}
   263	
   264	function buildLineageState(config, eventRecords) {
   265	  const configLineage = config.lineage && typeof config.lineage === 'object'
   266	    ? config.lineage
   267	    : {};
   268	  const latestLifecycleEvent = eventRecords
   269	    .filter((record) => record.event === 'resumed' || record.event === 'restarted')
   270	    .at(-1);
   271	  const eventContinuedFromRun = latestLifecycleEvent
   272	    ? latestLifecycleEvent.continuedFromRun ?? latestLifecycleEvent.fromIteration
   273	    : undefined;
   274	  const eventHasParentSession = latestLifecycleEvent
   275	    && Object.prototype.hasOwnProperty.call(latestLifecycleEvent, 'parentSessionId');
   276	
   277	  return {
   278	    sessionId: typeof latestLifecycleEvent?.sessionId === 'string' && latestLifecycleEvent.sessionId
   279	      ? latestLifecycleEvent.sessionId
   280	      : typeof configLineage.sessionId === 'string' && configLineage.sessionId
   281	        ? configLineage.sessionId
   282	        : null,
   283	    parentSessionId: eventHasParentSession
   284	      ? (typeof latestLifecycleEvent.parentSessionId === 'string' && latestLifecycleEvent.parentSessionId
   285	          ? latestLifecycleEvent.parentSessionId
   286	          : null)
   287	      : typeof configLineage.parentSessionId === 'string' && configLineage.parentSessionId
   288	        ? configLineage.parentSessionId
   289	        : null,
   290	    lineageMode: typeof latestLifecycleEvent?.lineageMode === 'string' && latestLifecycleEvent.lineageMode
   291	      ? latestLifecycleEvent.lineageMode
   292	      : typeof configLineage.lineageMode === 'string' && configLineage.lineageMode
   293	        ? configLineage.lineageMode
   294	        : 'new',
   295	    generation: isFiniteNumber(latestLifecycleEvent?.generation)
   296	      ? latestLifecycleEvent.generation
   297	      : isFiniteNumber(configLineage.generation)
   298	        ? configLineage.generation
   299	        : 1,
   300	    continuedFromRun: eventContinuedFromRun !== undefined
   301	      ? (isFiniteNumber(eventContinuedFromRun) ? eventContinuedFromRun : null)
   302	      : isFiniteNumber(configLineage.continuedFromRun)
   303	        ? configLineage.continuedFromRun
   304	        : null,
   305	  };
   306	}
   307	
   308	function buildTerminalStopState(records) {
   309	  const eventRecords = records.filter((record) => record?.type === 'event');
   310	  const latestSynthesisComplete = eventRecords.filter((record) => record.event === 'synthesis_complete').at(-1);
   311	  if (!latestSynthesisComplete) {
   312	    return null;
   313	  }
   314	
   315	  const latestSynthesisIndex = records.lastIndexOf(latestSynthesisComplete);
   316	  const latestIterationIndex = Math.max(
   317	    records.findLastIndex((record) => record?.type === 'iteration'),
   318	    records.findLastIndex((record) => record?.type === 'event' && (record?.event === 'resumed' || record?.event === 'restarted')),
   319	  );
   320	  if (latestSynthesisIndex < latestIterationIndex) {
   321	    return null;
   322	  }
   323	
   324	  return {
   325	    stopReason: typeof latestSynthesisComplete.stopReason === 'string' && latestSynthesisComplete.stopReason
   326	      ? latestSynthesisComplete.stopReason
   327	      : null,
   328	    totalIterations: isFiniteNumber(latestSynthesisComplete.totalIterations)
   329	      ? latestSynthesisComplete.totalIterations
   330	      : null,
   331	    answeredCount: isFiniteNumber(latestSynthesisComplete.answeredCount)
   332	      ? latestSynthesisComplete.answeredCount
   333	      : null,
   334	    totalQuestions: isFiniteNumber(latestSynthesisComplete.totalQuestions)
   335	      ? latestSynthesisComplete.totalQuestions
   336	      : null,
   337	    timestamp: typeof latestSynthesisComplete.timestamp === 'string' && latestSynthesisComplete.timestamp
   338	      ? latestSynthesisComplete.timestamp
   339	      : null,
   340	  };

 succeeded in 0ms:
   441	function buildFindingRegistry(iterationFiles, iterationRecords) {
   442	  const findingById = new Map();
   443	  const claimAdjudicationByFinding = buildClaimAdjudicationByFinding(iterationRecords);
   444	
   445	  for (const iteration of iterationFiles) {
   446	    for (const finding of iteration.findings) {
   447	      const claimAdjudication = claimAdjudicationByFinding.get(finding.findingId);
   448	      const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
   449	      const existing = findingById.get(finding.findingId);
   450	      if (!existing) {
   451	        findingById.set(finding.findingId, {
   452	          ...finding,
   453	          severity: canonicalSeverity,
   454	          dimension: deriveDimension({ ...finding, severity: canonicalSeverity }, iteration),
   455	          firstSeen: iteration.run,
   456	          lastSeen: iteration.run,
   457	          status: 'active',
   458	          transitions: mergeTransitions(
   459	            [{
   460	              iteration: iteration.run,
   461	              from: null,
   462	              to: canonicalSeverity,
   463	              reason: 'Initial discovery',
   464	            }],
   465	            claimAdjudication?.transitions,
   466	          ),
   467	        });
   468	      } else {
   469	        existing.lastSeen = iteration.run;
   470	        if (existing.severity !== canonicalSeverity) {
   471	          existing.transitions.push({
   472	            iteration: iteration.run,
   473	            from: existing.severity,
   474	            to: canonicalSeverity,
   475	            reason: 'Severity adjusted in later iteration',
   476	          });
   477	          existing.severity = canonicalSeverity;
   478	        }
   479	        if (claimAdjudication?.transitions?.length) {
   480	          existing.transitions = mergeTransitions(existing.transitions, claimAdjudication.transitions);
   481	        }
   482	      }
   483	    }
   484	  }
   485	
   486	  const resolvedIdSet = new Set();
   487	  for (const record of iterationRecords) {
   488	    if (Array.isArray(record.resolvedFindings)) {
   489	      for (const id of record.resolvedFindings) {
   490	        resolvedIdSet.add(id);
   491	      }
   492	    }
   493	  }
   494	
   495	  const openFindings = [];
   496	  const resolvedFindings = [];
   497	  for (const finding of findingById.values()) {
   498	    if (resolvedIdSet.has(finding.findingId)) {
   499	      finding.status = 'resolved';
   500	      resolvedFindings.push(finding);
   501	    } else {
   502	      openFindings.push(finding);
   503	    }
   504	  }
   505	
   506	  openFindings.sort(compareFindings);
   507	  resolvedFindings.sort(compareFindings);
   508	
   509	  return { openFindings, resolvedFindings };
   510	}
   511	
   512	function compareFindings(left, right) {
   513	  const severityOrder = { P0: 0, P1: 1, P2: 2 };
   514	  const severityDiff = (severityOrder[left.severity] ?? 9) - (severityOrder[right.severity] ?? 9);
   515	  if (severityDiff !== 0) {
   516	    return severityDiff;
   517	  }
   518	  return left.findingId.localeCompare(right.findingId);
   519	}
   520	
   521	function deriveDimension(finding, iteration) {
   522	  const focus = `${iteration.focus} ${finding.title} ${finding.description}`.toLowerCase();
   523	  for (const dimension of REQUIRED_DIMENSIONS) {
   524	    if (focus.includes(dimension)) {
   525	      return dimension;
   526	    }
   527	  }
   528	  return iteration.dimensionsAddressed[0] || 'correctness';
   529	}
   530	
   531	function buildDimensionCoverage(iterationRecords, strategyDimensions) {
   532	  const covered = {};
   533	  for (const dimension of REQUIRED_DIMENSIONS) {
   534	    covered[dimension] = false;
   535	  }
   536	
   537	  for (const record of iterationRecords) {
   538	    if (!Array.isArray(record.dimensions)) {
   539	      continue;
   540	    }
   541	    for (const dimension of record.dimensions) {
   542	      const normalized = String(dimension).toLowerCase();
   543	      if (normalized in covered) {
   544	        covered[normalized] = true;
   545	      }
   546	    }
   547	  }
   548	
   549	  for (const entry of strategyDimensions) {
   550	    if (!entry.checked) {
   551	      continue;
   552	    }
   553	    const normalized = entry.text.toLowerCase();
   554	    for (const dimension of REQUIRED_DIMENSIONS) {
   555	      if (normalized.includes(dimension)) {
   556	        covered[dimension] = true;
   557	      }
   558	    }
   559	  }
   560	

 succeeded in 0ms:
   500	          addedAtIteration: iteration.run,
   501	          sources: iteration.sources,
   502	        })),
   503	      )
   504	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   505	  );
   506	
   507	  const ruledOutDirections = uniqueById(
   508	    iterationFiles
   509	      .flatMap((iteration) =>
   510	        iteration.deadEnds.concat(iteration.ruledOut).map((entry, index) => ({
   511	          id: `ruled-out-${iteration.run}-${index + 1}-${slugify(entry)}`,
   512	          text: entry,
   513	          addedAtIteration: iteration.run,
   514	        })),
   515	      )
   516	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   517	  );
   518	
   519	  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
   520	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   521	  const convergenceScore =
   522	    latestIteration?.convergenceSignals?.compositeStop
   523	    ?? latestIteration?.newInfoRatio
   524	    ?? 0;
   525	  const blockedStopHistory = eventRecords
   526	    .filter((record) => record.event === 'blocked_stop')
   527	    .map((record) => ({
   528	      run: typeof record.run === 'number' ? record.run : 0,
   529	      blockedBy: Array.isArray(record.blockedBy) ? record.blockedBy : [],
   530	      gateResults: record.gateResults && typeof record.gateResults === 'object' ? record.gateResults : {},
   531	      recoveryStrategy: typeof record.recoveryStrategy === 'string' ? record.recoveryStrategy : '',
   532	      timestamp: typeof record.timestamp === 'string' ? record.timestamp : '',
   533	    }));
   534	  const graphConvergence = buildGraphConvergenceRollup(eventRecords);
   535	  const lineage = reducerState.lineage && typeof reducerState.lineage === 'object'
   536	    ? reducerState.lineage
   537	    : {};
   538	
   539	  return {
   540	    sessionId: lineage.sessionId || '',
   541	    parentSessionId: lineage.parentSessionId ?? null,
   542	    lineageMode: lineage.lineageMode || 'new',
   543	    generation: lineage.generation ?? 1,
   544	    continuedFromRun: lineage.continuedFromRun ?? null,
   545	    terminalStop: reducerState.terminalStop || null,
   546	    openQuestions: keyedQuestions.filter((question) => !question.resolved).map((question) => ({
   547	      id: question.id,
   548	      text: question.text,
   549	      addedAtIteration: question.addedAtIteration,
   550	      resolvedAtIteration: null,
   551	    })),
   552	    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
   553	      id: question.id,
   554	      text: question.text,
   555	      addedAtIteration: question.addedAtIteration,
   556	      resolvedAtIteration: question.resolvedAtIteration,
   557	    })),
   558	    keyFindings,
   559	    ruledOutDirections,
   560	    blockedStopHistory,
   561	    graphConvergenceScore: graphConvergence.graphConvergenceScore,
   562	    graphDecision: graphConvergence.graphDecision,
   563	    graphBlockers: graphConvergence.graphBlockers,
   564	    metrics: {
   565	      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
   566	      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
   567	      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
   568	      keyFindings: keyFindings.length,
   569	      convergenceScore,
   570	      coverageBySources,
   571	    },
   572	  };
   573	}
   574	
   575	function blockFromBulletList(items) {
   576	  if (!items.length) {
   577	    return '[None yet]';
   578	  }
   579	
   580	  return items.map((item) => `- ${item}`).join('\n');
   581	}
   582	
   583	function buildExhaustedApproaches(iterationFiles) {
   584	  const grouped = new Map();
   585	
   586	  for (const iteration of iterationFiles) {
   587	    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
   588	      const key = entry;
   589	      const bucket = grouped.get(key) || [];
   590	      bucket.push(iteration.run);
   591	      grouped.set(key, bucket);
   592	    }
   593	  }
   594	
   595	  if (!grouped.size) {
   596	    return '[No exhausted approach categories yet]';
   597	  }
   598	
   599	  const blocked = Array.from(grouped.entries())
   600	    .sort(([left], [right]) => left.localeCompare(right))
   601	    .map(([entry, runs]) => {
   602	      const attemptCount = runs.length;
   603	      const lastRun = Math.max(...runs);
   604	      return [
   605	        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
   606	        `- What was tried: ${entry}`,
   607	        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
   608	        `- Do NOT retry: ${entry}`,
   609	      ].join('\n');
   610	    });
   611	
   612	  return blocked.join('\n\n');
   613	}
   614	
   615	function replaceAnchorSection(content, anchorId, heading, body) {
   616	  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
   617	  const replacement = [
   618	    `<!-- ANCHOR:${anchorId} -->`,
   619	    `## ${heading}`,
   620	    body.trim() ? body.trim() : '[None yet]',
   621	    '',
   622	    `<!-- /ANCHOR:${anchorId} -->`,
   623	  ].join('\n');
   624	
   625	  if (!pattern.test(content)) {
   626	    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
   627	  }
   628	
   629	  return content.replace(pattern, replacement);
   630	}
   631	
   632	function updateStrategyContent(strategyContent, registry, iterationFiles, iterationRecords) {
   633	  const answeredTexts = registry.resolvedQuestions.map((question) => question.text);
   634	  const questionEntries = parseStrategyQuestions(strategyContent);
   635	  const answeredSet = new Set(answeredTexts.map(normalizeText));
   636	  const rewrittenQuestionLines = questionEntries.map((question) => {
   637	    const checked = answeredSet.has(normalizeText(question.text));
   638	    return `- [${checked ? 'x' : ' '}] ${question.text}`;
   639	  });
   640	
   641	  const whatWorked = iterationFiles
   642	    .filter((iteration) => iteration.reflectionWorked)
   643	    .map((iteration) => `${iteration.reflectionWorked} (iteration ${iteration.run})`);
   644	  const whatFailed = iterationFiles
   645	    .filter((iteration) => iteration.reflectionFailed)
   646	    .map((iteration) => `${iteration.reflectionFailed} (iteration ${iteration.run})`);
   647	  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
   648	
   649	  let updated = strategyContent;
   650	  updated = replaceAnchorSection(updated, 'key-questions', '3. KEY QUESTIONS (remaining)', rewrittenQuestionLines.join('\n'));
   651	  updated = replaceAnchorSection(updated, 'answered-questions', '6. ANSWERED QUESTIONS', blockFromBulletList(answeredTexts));
   652	  updated = replaceAnchorSection(updated, 'what-worked', '7. WHAT WORKED', blockFromBulletList(whatWorked));
   653	  updated = replaceAnchorSection(updated, 'what-failed', '8. WHAT FAILED', blockFromBulletList(whatFailed));
   654	  updated = replaceAnchorSection(updated, 'exhausted-approaches', '9. EXHAUSTED APPROACHES (do not retry)', buildExhaustedApproaches(iterationFiles));
   655	  updated = replaceAnchorSection(
   656	    updated,
   657	    'ruled-out-directions',
   658	    '10. RULED OUT DIRECTIONS',
   659	    blockFromBulletList(registry.ruledOutDirections.map((entry) => `${entry.text} (iteration ${entry.addedAtIteration})`)),
   660	  );
   661	  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
   662	  return updated;
   663	}
   664	
   665	function renderDashboard(config, registry, iterationRecords, iterationFiles) {
   666	  const latestIteration = iterationRecords.at(-1);
   667	  const terminalStop = registry.terminalStop && typeof registry.terminalStop === 'object'
   668	    ? registry.terminalStop
   669	    : null;
   670	  const sessionId = registry.sessionId || config.lineage?.sessionId || '[Unknown session]';
   671	  const parentSessionId = registry.parentSessionId ?? config.lineage?.parentSessionId ?? 'none';
   672	  const lineageMode = registry.lineageMode || config.lineage?.lineageMode || 'new';
   673	  const generation = registry.generation ?? config.lineage?.generation ?? 1;
   674	  const continuedFromRun = registry.continuedFromRun ?? config.lineage?.continuedFromRun ?? 'none';
   675	  // Exclude "thought" iterations from rolling average — they are analytical-only
   676	  // and produce no evidence, so including them would artificially lower the ratio.
   677	  const evidenceRecords = iterationRecords.filter((record) => record.status !== 'thought');
   678	  const ratios = evidenceRecords
   679	    .map((record) => (typeof record.newInfoRatio === 'number' ? record.newInfoRatio : null))
   680	    .filter((value) => value !== null);
   681	  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
   682	  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
   683	  const progressRows = iterationRecords
   684	    .map((record) => {
   685	      const track = record.focusTrack || '-';
   686	      const ratio = typeof record.newInfoRatio === 'number' ? record.newInfoRatio.toFixed(2) : '0.00';
   687	      return `| ${record.run} | ${record.focus || 'unknown'} | ${track} | ${ratio} | ${record.findingsCount || 0} | ${record.status || 'complete'} |`;
   688	    })
   689	    .join('\n') || '| 0 | none yet | - | 0.00 | 0 | initialized |';
   690	
   691	  return [
   692	    '---',
   693	    'title: Deep Research Dashboard',
   694	    'description: Auto-generated reducer view over the research packet.',
   695	    '---',
   696	    '',
   697	    '# Deep Research Dashboard - Session Overview',
   698	    '',
   699	    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
   700	    '',
   701	    '<!-- ANCHOR:overview -->',
   702	    '## 1. OVERVIEW',
   703	    '',
   704	    'Reducer-generated observability surface for the active research packet.',
   705	    '',
   706	    '<!-- /ANCHOR:overview -->',
   707	    '<!-- ANCHOR:status -->',
   708	    '## 2. STATUS',
   709	    `- Topic: ${config.topic || '[Unknown topic]'}`,
   710	    `- Started: ${config.createdAt || '[Unknown start]'}`,
   711	    `- Status: ${registry.status || String(config.status || 'initialized').toUpperCase()}`,
   712	    `- Iteration: ${registry.metrics.iterationsCompleted} of ${config.maxIterations || 0}`,
   713	    `- Session ID: ${sessionId}`,
   714	    `- Parent Session: ${parentSessionId}`,
   715	    `- Lifecycle Mode: ${lineageMode}`,
   716	    `- Generation: ${generation}`,
   717	    `- continuedFromRun: ${continuedFromRun}`,
   718	    ...(terminalStop?.stopReason ? [`- stopReason: ${terminalStop.stopReason}`] : []),
   719	    '',
   720	    '<!-- /ANCHOR:status -->',
   721	    '<!-- ANCHOR:progress -->',
   722	    '## 3. PROGRESS',
   723	    '',
   724	    '| # | Focus | Track | Ratio | Findings | Status |',
   725	    '|---|-------|-------|-------|----------|--------|',
   726	    progressRows,
   727	    '',
   728	    `- iterationsCompleted: ${registry.metrics.iterationsCompleted}`,
   729	    `- keyFindings: ${registry.metrics.keyFindings}`,
   730	    `- openQuestions: ${registry.metrics.openQuestions}`,
   731	    `- resolvedQuestions: ${registry.metrics.resolvedQuestions}`,
   732	    '',
   733	    '<!-- /ANCHOR:progress -->',
   734	    '<!-- ANCHOR:questions -->',
   735	    '## 4. QUESTIONS',
   736	    `- Answered: ${registry.metrics.resolvedQuestions}/${registry.metrics.resolvedQuestions + registry.metrics.openQuestions}`,
   737	    ...registry.resolvedQuestions.map((question) => `- [x] ${question.text}`),
   738	    ...registry.openQuestions.map((question) => `- [ ] ${question.text}`),
   739	    '',
   740	    '<!-- /ANCHOR:questions -->',
   741	    '<!-- ANCHOR:trend -->',
   742	    '## 5. TREND',
   743	    `- Last 3 ratios: ${lastThreeRatios}`,
   744	    `- Stuck count: ${iterationRecords.filter((r) => r.status !== 'thought' && r.status !== 'insight' && (r.status === 'stuck' || (typeof r.newInfoRatio === 'number' && r.newInfoRatio === 0))).length}`,
   745	    '- Guard violations: none recorded by the reducer pass',
   746	    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
   747	    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
   748	    '',
   749	    '<!-- /ANCHOR:trend -->',
   750	    '<!-- ANCHOR:dead-ends -->',
   751	    '## 6. DEAD ENDS',
   752	    ...registry.ruledOutDirections.length
   753	      ? registry.ruledOutDirections.map((entry) => `- ${entry.text} (iteration ${entry.addedAtIteration})`)
   754	      : ['- None yet'],
   755	    '',
   756	    '<!-- /ANCHOR:dead-ends -->',
   757	    '<!-- ANCHOR:next-focus -->',
   758	    '## 7. NEXT FOCUS',
   759	    nextFocus,
   760	    '',
   761	    '<!-- /ANCHOR:next-focus -->',
   762	    '<!-- ANCHOR:active-risks -->',
   763	    '## 8. ACTIVE RISKS',
   764	    ...(latestIteration?.status === 'error'
   765	      ? ['- Latest iteration reported error status.']
   766	      : ['- None active beyond normal research uncertainty.']),
   767	    '',
   768	    '<!-- /ANCHOR:active-risks -->',
   769	    '<!-- ANCHOR:blocked-stops -->',
   770	    '## 9. BLOCKED STOPS',
   771	    ...(registry.blockedStopHistory.length
   772	      ? registry.blockedStopHistory.flatMap((entry) => ([
   773	          `### Iteration ${entry.run} — blocked by [${formatBlockedByList(entry.blockedBy)}]`,
   774	          `- Recovery: ${entry.recoveryStrategy || '[No recovery strategy recorded]'}`,
   775	          `- Gate results: ${summarizeGateResults(entry.gateResults)}`,
   776	          `- Timestamp: ${entry.timestamp || '[Unknown timestamp]'}`,
   777	          '',
   778	        ]))
   779	      : ['No blocked-stop events recorded.', '']),
   780	    '<!-- /ANCHOR:blocked-stops -->',
   781	    '<!-- ANCHOR:graph-convergence -->',
   782	    '## 10. GRAPH CONVERGENCE',
   783	    `- graphConvergenceScore: ${Number.isFinite(registry.graphConvergenceScore) ? registry.graphConvergenceScore.toFixed(2) : '[Not recorded]'}`,
   784	    `- graphDecision: ${registry.graphDecision || '[Not recorded]'}`,
   785	    ...(registry.graphBlockers.length
   786	      ? registry.graphBlockers.map((blocker) => `- Blocker: ${formatGraphBlocker(blocker)}`)
   787	      : ['- graphBlockers: none recorded']),
   788	    '',
   789	    '<!-- /ANCHOR:graph-convergence -->',
   790	    '',
   791	  ].join('\n');
   792	}
   793	
   794	/**
   795	 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
   796	 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
   797	 *
   798	 * @param {string} specFolder - Path to the spec folder containing a research/ directory
   799	 * @param {Object} [options] - Reducer options
   800	 * @param {boolean} [options.write=true] - Write outputs to disk when true
   801	 * @returns {Object} Paths and content for registry, strategy, and dashboard
   802	 */
   803	function reduceResearchState(specFolder, options = {}) {
   804	  const write = options.write !== false;
   805	  const lenient = Boolean(options.lenient);
   806	  const resolvedSpecFolder = path.resolve(specFolder);
   807	  const researchDir = path.join(resolvedSpecFolder, 'research');
   808	  const configPath = path.join(researchDir, 'deep-research-config.json');
   809	  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
   810	  const strategyPath = path.join(researchDir, 'deep-research-strategy.md');
   811	  const registryPath = path.join(researchDir, 'findings-registry.json');
   812	  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
   813	  const iterationDir = path.join(researchDir, 'iterations');
   814	
   815	  const config = readJson(configPath);
   816	  const { records: parsedRecords, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
   817	  const records = parsedRecords.filter((record) => record.type === 'iteration');
   818	  const events = parsedRecords.filter((record) => record.type === 'event');
   819	  const strategyContent = readUtf8(strategyPath);
   820	  const strategyQuestions = parseStrategyQuestions(strategyContent);
   821	  const iterationFiles = fs.existsSync(iterationDir)
   822	    ? fs.readdirSync(iterationDir)
   823	        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
   824	        .sort()
   825	        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
   826	    : [];
   827	
   828	  const terminalStop = buildTerminalStopState(parsedRecords);
   829	  const lineage = buildLineageState(config, events);
   830	  config.lineage = {
   831	    ...(config.lineage && typeof config.lineage === 'object' ? config.lineage : {}),
   832	    sessionId: lineage.sessionId,
   833	    parentSessionId: lineage.parentSessionId,
   834	    lineageMode: lineage.lineageMode,
   835	    generation: lineage.generation,
   836	    continuedFromRun: lineage.continuedFromRun,
   837	  };
   838	  const status = deriveDashboardStatus(config, records, events, terminalStop);
   839	  const registry = buildRegistry(strategyQuestions, iterationFiles, records, events, {
   840	    lineage,
   841	    terminalStop,
   842	    status,
   843	  });
   844	  // Expose corruptionWarnings as a top-level registry field for parity with
   845	  // sk-deep-review (phase 008 REQ-015 research-side follow-up).
   846	  registry.corruptionWarnings = corruptionWarnings;
   847	  registry.status = status;
   848	  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, records);
   849	  const dashboard = renderDashboard(config, registry, records, iterationFiles);
   850	
   851	  if (write) {
   852	    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
   853	    writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
   854	    writeUtf8(dashboardPath, dashboard);
   855	  }
   856	
   857	  // Fail-closed on corruption unless --lenient.
   858	  if (corruptionWarnings.length > 0 && !lenient) {
   859	    const preview = corruptionWarnings
   860	      .slice(0, 3)

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '857,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   857	  // Fail-closed on corruption unless --lenient.
   858	  if (corruptionWarnings.length > 0 && !lenient) {
   859	    const preview = corruptionWarnings
   860	      .slice(0, 3)
   861	      .map((w) => `  - line ${w.line}: ${w.error}`)
   862	      .join('\n');
   863	    process.stderr.write(
   864	      `[sk-deep-research] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
   865	      + 'Pass --lenient to the reducer CLI (or lenient:true to reduceResearchState) to ignore corruption.\n',
   866	    );
   867	  }
   868	
   869	  return {
   870	    configPath,
   871	    stateLogPath,
   872	    strategyPath,
   873	    registryPath,
   874	    dashboardPath,
   875	    registry,
   876	    strategy,
   877	    dashboard,
   878	    corruptionWarnings,
   879	    hasCorruption: corruptionWarnings.length > 0,
   880	  };
   881	}
   882	
   883	// ─────────────────────────────────────────────────────────────────────────────
   884	// 5. CLI ENTRY POINT
   885	// ─────────────────────────────────────────────────────────────────────────────
   886	
   887	if (require.main === module) {
   888	  const args = process.argv.slice(2);
   889	  const lenient = args.includes('--lenient');
   890	  const positional = args.filter((arg) => !arg.startsWith('--'));
   891	  const specFolder = positional[0];
   892	
   893	  if (!specFolder) {
   894	    process.stderr.write(
   895	      'Usage: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> [--lenient]\n',
   896	    );
   897	    process.exit(1);
   898	  }
   899	
   900	  try {
   901	    const result = reduceResearchState(specFolder, { write: true, lenient });
   902	    process.stdout.write(
   903	      `${JSON.stringify(
   904	        {
   905	          registryPath: result.registryPath,
   906	          dashboardPath: result.dashboardPath,
   907	          strategyPath: result.strategyPath,
   908	          iterationsCompleted: result.registry.metrics.iterationsCompleted,
   909	          corruptionCount: result.corruptionWarnings.length,
   910	        },
   911	        null,
   912	        2,
   913	      )}\n`,
   914	    );
   915	    // Fail-closed exit semantics matching sk-deep-review (phase 008 REQ-015 parity).
   916	    if (result.hasCorruption && !lenient) {
   917	      process.exit(2);
   918	    }
   919	  } catch (error) {
   920	    process.stderr.write(`[sk-deep-research] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
   921	    process.exit(3);
   922	  }
   923	}
   924	
   925	// ─────────────────────────────────────────────────────────────────────────────
   926	// 6. EXPORTS
   927	// ─────────────────────────────────────────────────────────────────────────────
   928	
   929	module.exports = {
   930	  buildGraphConvergenceRollup,

codex
I’m in the code now. The deep-review reducer has the targeted hooks in place, and I’m checking the remaining branches carefully to separate “landed” from “actually safe” before I write the verdicts.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Ledger Reducer — Dashboard and Registry Generator                        ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	// ─────────────────────────────────────────────────────────────────────────────
     7	// 1. IMPORTS
     8	// ─────────────────────────────────────────────────────────────────────────────
     9	
    10	const fs = require('node:fs');
    11	const path = require('node:path');
    12	
    13	// ─────────────────────────────────────────────────────────────────────────────
    14	// 2. HELPERS
    15	// ─────────────────────────────────────────────────────────────────────────────
    16	
    17	function readUtf8(filePath) {
    18	  return fs.readFileSync(filePath, 'utf8');
    19	}
    20	
    21	function readOptionalUtf8(filePath) {
    22	  try {
    23	    return readUtf8(filePath);
    24	  } catch (_error) {
    25	    return null;
    26	  }
    27	}
    28	
    29	function parseJson(content, fallback) {
    30	  try {
    31	    return JSON.parse(content);
    32	  } catch (_error) {
    33	    return fallback;
    34	  }
    35	}
    36	
    37	function readOptionalJson(filePath) {
    38	  const content = readOptionalUtf8(filePath);
    39	  if (content === null) {
    40	    return null;
    41	  }
    42	  return parseJson(content, null);
    43	}
    44	
    45	function writeUtf8(filePath, content) {
    46	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    47	  fs.writeFileSync(filePath, content, 'utf8');
    48	}
    49	
    50	function parseJsonl(content) {
    51	  return content
    52	    .split('\n')
    53	    .map((line) => line.trim())
    54	    .filter(Boolean)
    55	    .flatMap((line) => {
    56	      try {
    57	        return [JSON.parse(line)];
    58	      } catch (_error) {
    59	        return [];
    60	      }
    61	    });
    62	}
    63	
    64	function isPlainObject(value) {
    65	  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    66	}
    67	
    68	function isFiniteNumber(value) {
    69	  return typeof value === 'number' && Number.isFinite(value);
    70	}
    71	
    72	function sortObjectKeys(value) {
    73	  return Object.fromEntries(
    74	    Object.entries(value).sort((left, right) => left[0].localeCompare(right[0]))
    75	  );
    76	}
    77	
    78	function findNestedState(value, expectedState, seen = new Set()) {
    79	  if (!value || typeof value !== 'object') {
    80	    return null;
    81	  }
    82	
    83	  if (seen.has(value)) {
    84	    return null;
    85	  }
    86	  seen.add(value);
    87	
    88	  if (isPlainObject(value) && value.state === expectedState) {
    89	    return value;
    90	  }
    91	
    92	  const entries = Array.isArray(value) ? value : Object.values(value);
    93	  for (const entry of entries) {
    94	    const found = findNestedState(entry, expectedState, seen);
    95	    if (found) {
    96	      return found;
    97	    }
    98	  }
    99	
   100	  return null;
   101	}
   102	
   103	function inferRun(record, statePayload, fallbackIndex) {
   104	  const candidates = [
   105	    statePayload?.run,
   106	    statePayload?.iteration,
   107	    statePayload?.runNumber,
   108	    record?.run,
   109	    record?.iteration,
   110	    record?.runNumber,
   111	    record?.label,
   112	    fallbackIndex + 1,
   113	  ];
   114	
   115	  for (const candidate of candidates) {
   116	    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
   117	      return candidate;
   118	    }
   119	    if (typeof candidate === 'string' && candidate.trim()) {
   120	      return candidate;
   121	    }
   122	  }
   123	
   124	  return fallbackIndex + 1;
   125	}
   126	
   127	function extractInsufficientDataIteration(record, fallbackIndex) {
   128	  const statePayload = findNestedState(record, 'insufficientData');
   129	  if (
   130	    !statePayload ||
   131	    typeof statePayload.dataPoints !== 'number' ||
   132	    typeof statePayload.minRequired !== 'number'
   133	  ) {
   134	    return null;
   135	  }
   136	
   137	  return {
   138	    run: inferRun(record, statePayload, fallbackIndex),
   139	    dataPoints: statePayload.dataPoints,
   140	    minRequired: statePayload.minRequired,
   141	  };
   142	}
   143	
   144	function extractInsufficientSampleIteration(record, fallbackIndex) {
   145	  const statePayload = findNestedState(record, 'insufficientSample');
   146	  if (
   147	    !statePayload ||
   148	    typeof statePayload.replayCount !== 'number' ||
   149	    typeof statePayload.minRequired !== 'number'
   150	  ) {
   151	    return null;
   152	  }
   153	
   154	  return {
   155	    run: inferRun(record, statePayload, fallbackIndex),
   156	    replayCount: statePayload.replayCount,
   157	    minRequired: statePayload.minRequired,
   158	  };
   159	}
   160	
   161	function inferProfileId(record) {
   162	  if (record.profileId) {
   163	    return record.profileId;
   164	  }
   165	  return 'dynamic';
   166	}
   167	
   168	function inferFamily(record, profileId) {
   169	  if (record.family) return record.family;
   170	  return profileId;
   171	}
   172	
   173	function buildJournalSummary(filePath) {
   174	  const content = readOptionalUtf8(filePath);
   175	  if (content === null) {
   176	    return null;
   177	  }
   178	
   179	  const events = parseJsonl(content).filter((event) => isPlainObject(event));
   180	  const eventTypeCounts = {};
   181	  let lastSessionStart = null;
   182	  let lastSessionEnd = null;
   183	  let stopReason = null;
   184	  let sessionOutcome = null;
   185	  let latestLegalStop = null;
   186	  let latestBlockedStop = null;
   187	
   188	  for (const event of events) {
   189	    const eventType = typeof event.eventType === 'string' ? event.eventType : null;
   190	    const timestamp = typeof event.timestamp === 'string' ? event.timestamp : null;
   191	    const details = isPlainObject(event.details) ? event.details : {};
   192	
   193	    if (eventType) {
   194	      eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
   195	    }
   196	
   197	    if (eventType === 'session_start' && timestamp) {
   198	      lastSessionStart = timestamp;
   199	    }
   200	
   201	    if ((eventType === 'session_end' || eventType === 'session_ended') && timestamp) {
   202	      lastSessionEnd = timestamp;
   203	      stopReason =
   204	        typeof details.stopReason === 'string' && details.stopReason.trim()
   205	          ? details.stopReason
   206	          : stopReason;
   207	      sessionOutcome =
   208	        typeof details.sessionOutcome === 'string' && details.sessionOutcome.trim()
   209	          ? details.sessionOutcome
   210	          : sessionOutcome;
   211	    }
   212	
   213	    if (eventType === 'legal_stop_evaluated') {
   214	      latestLegalStop = {
   215	        timestamp,
   216	        gateResults: isPlainObject(details.gateResults) ? details.gateResults : {},
   217	      };
   218	    }
   219	
   220	    if (eventType === 'blocked_stop') {
   221	      latestBlockedStop = {
   222	        timestamp,
   223	        failedGates: Array.isArray(details.failedGates) ? details.failedGates : [],
   224	        reason: typeof details.reason === 'string' ? details.reason : null,
   225	      };
   226	    }
   227	  }
   228	
   229	  return {
   230	    lastSessionStart,
   231	    lastSessionEnd,
   232	    totalEvents: events.length,
   233	    eventTypeCounts: sortObjectKeys(eventTypeCounts),
   234	    stopReason,
   235	    sessionOutcome,
   236	    latestLegalStop,
   237	    latestBlockedStop,
   238	  };
   239	}
   240	
   241	function normalizeLineageNode(node) {
   242	  if (!isPlainObject(node)) {
   243	    return null;
   244	  }
   245	
   246	  const id =
   247	    typeof node.candidateId === 'string'
   248	      ? node.candidateId
   249	      : typeof node.id === 'string'
   250	        ? node.id
   251	        : null;
   252	  if (!id) {
   253	    return null;
   254	  }
   255	
   256	  const parentId =
   257	    typeof node.parentCandidateId === 'string'
   258	      ? node.parentCandidateId
   259	      : typeof node.parentId === 'string'
   260	        ? node.parentId
   261	        : null;
   262	
   263	  return {
   264	    id,
   265	    parentId,
   266	    candidateId: id,
   267	    parentCandidateId: parentId,
   268	  };
   269	}
   270	
   271	function buildCandidateLineageSummary(filePath) {
   272	  const data = readOptionalJson(filePath);
   273	  if (!isPlainObject(data) || !Array.isArray(data.nodes)) {
   274	    return null;
   275	  }
   276	
   277	  const nodes = data.nodes.map((node) => normalizeLineageNode(node)).filter(Boolean);
   278	  const nodeById = new Map(nodes.map((node) => [node.id, node]));
   279	  const memo = new Map();
   280	
   281	  function getDepth(nodeId, trail = new Set()) {
   282	    if (!nodeById.has(nodeId)) {
   283	      return 0;
   284	    }
   285	    if (memo.has(nodeId)) {
   286	      return memo.get(nodeId);
   287	    }
   288	    if (trail.has(nodeId)) {
   289	      return 0;
   290	    }
   291	
   292	    trail.add(nodeId);
   293	    const node = nodeById.get(nodeId);
   294	    const parentId = typeof node.parentId === 'string' ? node.parentId : null;
   295	    const depth = parentId ? getDepth(parentId, trail) + 1 : 0;
   296	    trail.delete(nodeId);
   297	    memo.set(nodeId, depth);
   298	    return depth;
   299	  }
   300	
   301	  let lineageDepth = 0;
   302	  for (const node of nodes) {
   303	    lineageDepth = Math.max(lineageDepth, getDepth(node.id));
   304	  }
   305	
   306	  return {
   307	    lineageDepth,
   308	    totalCandidates: nodes.length,
   309	    currentLeaf: nodes.length > 0 ? nodes[nodes.length - 1].id : null,
   310	  };
   311	}
   312	
   313	function buildMutationCoverageKey(entry) {
   314	  if (!isPlainObject(entry)) {
   315	    return null;
   316	  }
   317	
   318	  const dimension = typeof entry.dimension === 'string' ? entry.dimension : null;
   319	  const mutationType = typeof entry.mutationType === 'string' ? entry.mutationType : null;
   320	  if (!dimension || !mutationType) {
   321	    return null;
   322	  }
   323	
   324	  return `${dimension}::${mutationType}`;
   325	}
   326	
   327	function collectMutationCoverageKeys(entries) {
   328	  const keys = new Set();
   329	  if (!Array.isArray(entries)) {
   330	    return keys;
   331	  }
   332	
   333	  for (const entry of entries) {
   334	    const key = buildMutationCoverageKey(entry);
   335	    if (key) {
   336	      keys.add(key);
   337	    }
   338	  }
   339	
   340	  return keys;
   341	}
   342	
   343	function deriveMutationCoverageMetrics(data) {
   344	  const triedKeys = collectMutationCoverageKeys(data.mutations);
   345	  const exhaustedKeys = collectMutationCoverageKeys(data.exhausted);
   346	  const trackedKeys = new Set([...triedKeys, ...exhaustedKeys]);
   347	
   348	  if (trackedKeys.size === 0) {
   349	    return {
   350	      coverageRatio: null,
   351	      uncoveredMutations: null,
   352	    };
   353	  }
   354	
   355	  return {
   356	    coverageRatio: exhaustedKeys.size / trackedKeys.size,
   357	    uncoveredMutations: Math.max(trackedKeys.size - exhaustedKeys.size, 0),
   358	  };
   359	}
   360	
   361	function buildMutationCoverageSummary(filePath) {
   362	  const data = readOptionalJson(filePath);
   363	  if (!isPlainObject(data)) {
   364	    return null;
   365	  }
   366	
   367	  const metrics = isPlainObject(data.metrics) ? data.metrics : {};
   368	  const derivedMetrics = deriveMutationCoverageMetrics(data);
   369	  return {
   370	    coverageRatio: isFiniteNumber(metrics.coverageRatio)
   371	      ? metrics.coverageRatio
   372	      : derivedMetrics.coverageRatio,
   373	    uncoveredMutations: isFiniteNumber(metrics.uncoveredMutations)
   374	      ? metrics.uncoveredMutations
   375	      : derivedMetrics.uncoveredMutations,
   376	  };
   377	}
   378	
   379	function deriveReplayCountFromDimensions(dimensions) {
   380	  if (!isPlainObject(dimensions)) {
   381	    return null;
   382	  }
   383	
   384	  const samples = Object.values(dimensions)
   385	    .map((entry) => (isPlainObject(entry) && isFiniteNumber(entry.samples) ? entry.samples : null))
   386	    .filter((value) => value !== null);
   387	
   388	  if (samples.length === 0) {
   389	    return null;
   390	  }
   391	
   392	  return Math.max(...samples);
   393	}
   394	
   395	function deriveStabilityCoefficientFromDimensions(dimensions) {
   396	  if (!isPlainObject(dimensions)) {
   397	    return null;
   398	  }
   399	
   400	  const coefficients = Object.values(dimensions)
   401	    .map((entry) => (isPlainObject(entry) && isFiniteNumber(entry.coefficient) ? entry.coefficient : null))
   402	    .filter((value) => value !== null);
   403	
   404	  if (coefficients.length === 0) {
   405	    return null;
   406	  }
   407	
   408	  return Math.min(...coefficients);
   409	}
   410	
   411	function collectSampleQualityMatches(value, seen = new Set(), matches = []) {
   412	  if (!value || typeof value !== 'object') {
   413	    return matches;
   414	  }
   415	  if (seen.has(value)) {
   416	    return matches;
   417	  }
   418	  seen.add(value);
   419	
   420	  if (Array.isArray(value)) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs | sed -n '420,1080p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   420	  if (Array.isArray(value)) {
   421	    for (const entry of value) {
   422	      collectSampleQualityMatches(entry, seen, matches);
   423	    }
   424	    return matches;
   425	  }
   426	
   427	  const replayCount = isFiniteNumber(value.replayCount)
   428	    ? value.replayCount
   429	    : deriveReplayCountFromDimensions(value.dimensions);
   430	  const stabilityCoefficient = isFiniteNumber(value.stabilityCoefficient)
   431	    ? value.stabilityCoefficient
   432	    : deriveStabilityCoefficientFromDimensions(value.dimensions);
   433	  const isInsufficientSample = value.state === 'insufficientSample' && replayCount !== null;
   434	
   435	  if (isInsufficientSample || stabilityCoefficient !== null) {
   436	    matches.push({
   437	      replayCount: replayCount === null ? null : replayCount,
   438	      stabilityCoefficient: stabilityCoefficient === null ? null : stabilityCoefficient,
   439	    });
   440	  }
   441	
   442	  for (const entry of Object.values(value)) {
   443	    collectSampleQualityMatches(entry, seen, matches);
   444	  }
   445	
   446	  return matches;
   447	}
   448	
   449	function summarizeSampleQuality(records, registry) {
   450	  let latestSummary = null;
   451	
   452	  for (const record of records) {
   453	    const matches = collectSampleQualityMatches(record);
   454	    if (matches.length > 0) {
   455	      latestSummary = matches[matches.length - 1];
   456	    }
   457	  }
   458	
   459	  return {
   460	    replayCount: latestSummary?.replayCount ?? null,
   461	    stabilityCoefficient: latestSummary?.stabilityCoefficient ?? null,
   462	    insufficientSampleIterations: registry.insufficientSampleIterations.length,
   463	    insufficientDataIterations: registry.insufficientDataIterations.length,
   464	  };
   465	}
   466	
   467	// ─────────────────────────────────────────────────────────────────────────────
   468	// 3. PROFILE BUCKET
   469	// ─────────────────────────────────────────────────────────────────────────────
   470	
   471	function createProfileBucket(profileId, family) {
   472	  return {
   473	    profileId,
   474	    family,
   475	    latestRecord: null,
   476	    bestPromptRecord: null,
   477	    bestBenchmarkRecord: null,
   478	    acceptedCandidates: [],
   479	    rejectedCandidates: [],
   480	    benchmarkRuns: [],
   481	    infraFailures: [],
   482	    promptRecommendations: [],
   483	    benchmarkRecommendations: [],
   484	    failureModes: {},
   485	    metrics: {
   486	      totalRecords: 0,
   487	      promptRuns: 0,
   488	      benchmarkRuns: 0,
   489	      acceptedCount: 0,
   490	      rejectedCount: 0,
   491	      tieCount: 0,
   492	      keepBaselineCount: 0,
   493	      infraFailureCount: 0,
   494	      benchmarkPassCount: 0,
   495	      benchmarkFailCount: 0,
   496	    },
   497	    dimensionScores: {
   498	      structural: [],
   499	      ruleCoherence: [],
   500	      integration: [],
   501	      outputQuality: [],
   502	      systemFitness: [],
   503	    },
   504	    dimensionTrends: {},
   505	  };
   506	}
   507	
   508	function incrementFailureModes(bucket, record) {
   509	  for (const mode of record.failureModes || []) {
   510	    bucket.failureModes[mode] = (bucket.failureModes[mode] || 0) + 1;
   511	  }
   512	}
   513	
   514	function maybeSetBestPrompt(bucket, record) {
   515	  if (record.type === 'benchmark_run') {
   516	    return;
   517	  }
   518	  const candidateScore = Number(record.score ?? record.totals?.candidate ?? -Infinity);
   519	  const currentScore = Number(bucket.bestPromptRecord?.score ?? bucket.bestPromptRecord?.totals?.candidate ?? -Infinity);
   520	  if (candidateScore > currentScore) {
   521	    bucket.bestPromptRecord = record;
   522	  }
   523	}
   524	
   525	function maybeSetBestBenchmark(bucket, record) {
   526	  if (record.type !== 'benchmark_run') {
   527	    return;
   528	  }
   529	  const currentScore = Number(bucket.bestBenchmarkRecord?.aggregateScore ?? -Infinity);
   530	  if (Number(record.aggregateScore ?? -Infinity) > currentScore) {
   531	    bucket.bestBenchmarkRecord = record;
   532	  }
   533	}
   534	
   535	// ─────────────────────────────────────────────────────────────────────────────
   536	// 4. REGISTRY BUILDER
   537	// ─────────────────────────────────────────────────────────────────────────────
   538	
   539	function buildRegistry(records) {
   540	  const profiles = {};
   541	  const insufficientDataIterations = [];
   542	  const insufficientSampleIterations = [];
   543	  const globalMetrics = {
   544	    totalRecords: records.length,
   545	    targetProfiles: 0,
   546	    promptRuns: 0,
   547	    benchmarkRuns: 0,
   548	    acceptedCount: 0,
   549	    rejectedCount: 0,
   550	    tieCount: 0,
   551	    keepBaselineCount: 0,
   552	    infraFailureCount: 0,
   553	    benchmarkPassCount: 0,
   554	    benchmarkFailCount: 0,
   555	  };
   556	
   557	  for (const [index, record] of records.entries()) {
   558	    const profileId = inferProfileId(record);
   559	    const family = inferFamily(record, profileId);
   560	    if (!profiles[profileId]) {
   561	      profiles[profileId] = createProfileBucket(profileId, family);
   562	    }
   563	
   564	    const insufficientDataIteration = extractInsufficientDataIteration(record, index);
   565	    if (insufficientDataIteration) {
   566	      insufficientDataIterations.push(insufficientDataIteration);
   567	    }
   568	
   569	    const insufficientSampleIteration = extractInsufficientSampleIteration(record, index);
   570	    if (insufficientSampleIteration) {
   571	      insufficientSampleIterations.push(insufficientSampleIteration);
   572	    }
   573	
   574	    const bucket = profiles[profileId];
   575	    bucket.latestRecord = record;
   576	    bucket.metrics.totalRecords += 1;
   577	    incrementFailureModes(bucket, record);
   578	
   579	    if (record.type === 'benchmark_run') {
   580	      bucket.metrics.benchmarkRuns += 1;
   581	      globalMetrics.benchmarkRuns += 1;
   582	      bucket.benchmarkRuns.push(record);
   583	      bucket.benchmarkRecommendations.push(record.recommendation || 'unknown');
   584	      maybeSetBestBenchmark(bucket, record);
   585	      if (record.recommendation === 'benchmark-pass') {
   586	        bucket.metrics.benchmarkPassCount += 1;
   587	        globalMetrics.benchmarkPassCount += 1;
   588	      } else {
   589	        bucket.metrics.benchmarkFailCount += 1;
   590	        globalMetrics.benchmarkFailCount += 1;
   591	      }
   592	      continue;
   593	    }
   594	
   595	    if (record.type === 'infra_failure') {
   596	      bucket.metrics.infraFailureCount += 1;
   597	      globalMetrics.infraFailureCount += 1;
   598	      bucket.infraFailures.push(record);
   599	      continue;
   600	    }
   601	
   602	    bucket.metrics.promptRuns += 1;
   603	    globalMetrics.promptRuns += 1;
   604	    bucket.promptRecommendations.push(record.recommendation || 'unknown');
   605	    maybeSetBestPrompt(bucket, record);
   606	
   607	    if (record.dimensions) {
   608	      for (const dim of record.dimensions) {
   609	        const key = dim.name;
   610	        if (bucket.dimensionScores[key]) {
   611	          bucket.dimensionScores[key].push(dim.score);
   612	        }
   613	      }
   614	    }
   615	
   616	    if (record.type === 'accepted' || record.recommendation === 'candidate-acceptable' || record.recommendation === 'candidate-better') {
   617	      bucket.metrics.acceptedCount += 1;
   618	      globalMetrics.acceptedCount += 1;
   619	      bucket.acceptedCandidates.push(record);
   620	    } else if (record.type === 'rejected' || record.recommendation === 'candidate-worse' || record.recommendation === 'candidate-rejected' || record.recommendation === 'reject-candidate') {
   621	      bucket.metrics.rejectedCount += 1;
   622	      globalMetrics.rejectedCount += 1;
   623	      bucket.rejectedCandidates.push(record);
   624	    }
   625	
   626	    if (record.recommendation === 'tie') {
   627	      bucket.metrics.tieCount += 1;
   628	      globalMetrics.tieCount += 1;
   629	    } else if (record.recommendation === 'keep-baseline') {
   630	      bucket.metrics.keepBaselineCount += 1;
   631	      globalMetrics.keepBaselineCount += 1;
   632	    }
   633	  }
   634	
   635	  globalMetrics.targetProfiles = Object.keys(profiles).length;
   636	
   637	  return {
   638	    globalMetrics,
   639	    insufficientDataIterations,
   640	    insufficientSampleIterations,
   641	    profiles,
   642	  };
   643	}
   644	
   645	// ─────────────────────────────────────────────────────────────────────────────
   646	// 5. STOP STATUS
   647	// ─────────────────────────────────────────────────────────────────────────────
   648	
   649	function countTrailingMatches(items, expected) {
   650	  let count = 0;
   651	  for (let index = items.length - 1; index >= 0; index -= 1) {
   652	    if (items[index] !== expected) {
   653	      break;
   654	    }
   655	    count += 1;
   656	  }
   657	  return count;
   658	}
   659	
   660	function detectDriftAmbiguity(mirrorDriftReport) {
   661	  if (!mirrorDriftReport) {
   662	    return false;
   663	  }
   664	  return /manual-review-required|: missing|Undisclosed surfaces:\s*[1-9]/i.test(mirrorDriftReport);
   665	}
   666	
   667	function evaluateStopStatus(registry, config, mirrorDriftReport) {
   668	  const stopRules = config?.stopRules || {};
   669	  const profileStates = {};
   670	  let shouldStop = false;
   671	  const reasons = [];
   672	
   673	  for (const [profileId, bucket] of Object.entries(registry.profiles)) {
   674	    const state = {
   675	      shouldStop: false,
   676	      reasons: [],
   677	      counters: {
   678	        trailingTies: countTrailingMatches(bucket.promptRecommendations, 'tie'),
   679	        infraFailures: bucket.metrics.infraFailureCount,
   680	        weakBenchmarkRuns: bucket.metrics.benchmarkFailCount,
   681	      },
   682	    };
   683	
   684	    if (state.counters.trailingTies >= Number(stopRules.maxConsecutiveTies || Infinity)) {
   685	      state.shouldStop = true;
   686	      state.reasons.push(`trailing ties ${state.counters.trailingTies}/${stopRules.maxConsecutiveTies}`);
   687	    }
   688	
   689	    if (state.counters.infraFailures >= Number(stopRules.maxInfraFailuresPerProfile || Infinity)) {
   690	      state.shouldStop = true;
   691	      state.reasons.push(`infra failures ${state.counters.infraFailures}/${stopRules.maxInfraFailuresPerProfile}`);
   692	    }
   693	
   694	    if (state.counters.weakBenchmarkRuns >= Number(stopRules.maxWeakBenchmarkRunsPerProfile || Infinity)) {
   695	      state.shouldStop = true;
   696	      state.reasons.push(`weak benchmark runs ${state.counters.weakBenchmarkRuns}/${stopRules.maxWeakBenchmarkRunsPerProfile}`);
   697	    }
   698	
   699	    if (state.shouldStop) {
   700	      shouldStop = true;
   701	      reasons.push(`${profileId}: ${state.reasons.join(', ')}`);
   702	    }
   703	
   704	    profileStates[profileId] = state;
   705	  }
   706	
   707	  const driftAmbiguity = Boolean(stopRules.stopOnDriftAmbiguity) && detectDriftAmbiguity(mirrorDriftReport);
   708	  if (driftAmbiguity) {
   709	    shouldStop = true;
   710	    reasons.push('mirror drift ambiguity detected');
   711	  }
   712	
   713	  if (stopRules.stopOnDimensionPlateau) {
   714	    const plateauWindow = Number(stopRules.plateauWindow || 3);
   715	    for (const [profileId, bucket] of Object.entries(registry.profiles)) {
   716	      const dims = bucket.dimensionScores;
   717	      const dimsWithEnoughData = Object.entries(dims).filter(([, scores]) => scores.length >= plateauWindow);
   718	      if (dimsWithEnoughData.length > 0) {
   719	        const plateauDims = dimsWithEnoughData.filter(([, scores]) => {
   720	          const lastN = scores.slice(-plateauWindow);
   721	          return lastN.every((s) => s === lastN[0]);
   722	        });
   723	        if (plateauDims.length === dimsWithEnoughData.length) {
   724	          shouldStop = true;
   725	          reasons.push(`${profileId}: all dimensions plateaued`);
   726	          if (profileStates[profileId]) {
   727	            profileStates[profileId].shouldStop = true;
   728	            profileStates[profileId].reasons.push('all dimensions plateaued');
   729	          }
   730	        }
   731	      }
   732	    }
   733	  }
   734	
   735	  return {
   736	    shouldStop,
   737	    reasons,
   738	    driftAmbiguity,
   739	    profileStates,
   740	  };
   741	}
   742	
   743	// ─────────────────────────────────────────────────────────────────────────────
   744	// 6. DIMENSIONAL TRACKING
   745	// ─────────────────────────────────────────────────────────────────────────────
   746	
   747	function topFailureModes(failureModes) {
   748	  return Object.entries(failureModes)
   749	    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
   750	    .slice(0, 5);
   751	}
   752	
   753	function computeDimensionTrend(scores) {
   754	  if (scores.length < 2) {
   755	    return '\u2192';
   756	  }
   757	  const latest = scores[scores.length - 1];
   758	  const previous = scores[scores.length - 2];
   759	  if (latest > previous) {
   760	    return '\u2191';
   761	  }
   762	  if (latest < previous) {
   763	    return '\u2193';
   764	  }
   765	  return '\u2192';
   766	}
   767	
   768	function formatDimensionName(key) {
   769	  return key
   770	    .replace(/([A-Z])/g, ' $1')
   771	    .replace(/^./, (ch) => ch.toUpperCase())
   772	    .trim();
   773	}
   774	
   775	function formatDashboardValue(value) {
   776	  if (value === null || value === undefined) {
   777	    return 'n/a';
   778	  }
   779	  if (isFiniteNumber(value)) {
   780	    return Number.isInteger(value) ? String(value) : String(Math.round(value * 10000) / 10000);
   781	  }
   782	  return String(value);
   783	}
   784	
   785	// ─────────────────────────────────────────────────────────────────────────────
   786	// 7. DASHBOARD RENDERER
   787	// ─────────────────────────────────────────────────────────────────────────────
   788	
   789	function renderDimensionalProgress(bucket) {
   790	  const rows = [];
   791	  for (const [key, scores] of Object.entries(bucket.dimensionScores)) {
   792	    if (scores.length === 0) {
   793	      continue;
   794	    }
   795	    const latest = scores[scores.length - 1];
   796	    const best = Math.max(...scores);
   797	    const trend = computeDimensionTrend(scores);
   798	    bucket.dimensionTrends[key] = trend;
   799	    rows.push(`| ${formatDimensionName(key)} | ${latest} | ${best} | ${trend} |`);
   800	  }
   801	  if (rows.length === 0) {
   802	    return '';
   803	  }
   804	  return `### Dimensional Progress
   805	
   806	| Dimension | Latest | Best | Trend |
   807	| --- | --- | --- | --- |
   808	${rows.join('\n')}
   809	`;
   810	}
   811	
   812	function renderProfileSection(bucket) {
   813	  const failures = topFailureModes(bucket.failureModes);
   814	  const failureSummary =
   815	    failures.length > 0
   816	      ? failures.map(([mode, count]) => `- ${mode}: ${count}`).join('\n')
   817	      : '- none';
   818	  const latest = bucket.latestRecord;
   819	  const bestPrompt = bucket.bestPromptRecord;
   820	  const bestBenchmark = bucket.bestBenchmarkRecord;
   821	
   822	  return `## ${bucket.profileId}
   823	
   824	- Family: ${bucket.family}
   825	- Prompt runs: ${bucket.metrics.promptRuns}
   826	- Benchmark runs: ${bucket.metrics.benchmarkRuns}
   827	- Accepted candidates: ${bucket.metrics.acceptedCount}
   828	- Rejected candidates: ${bucket.metrics.rejectedCount}
   829	- Benchmark passes: ${bucket.metrics.benchmarkPassCount}
   830	- Benchmark fails: ${bucket.metrics.benchmarkFailCount}
   831	- Infra failures: ${bucket.metrics.infraFailureCount}
   832	- Best prompt score: ${bestPrompt ? Number(bestPrompt.score ?? bestPrompt.totals?.candidate ?? 0) : 'n/a'}
   833	- Best benchmark score: ${bestBenchmark ? Number(bestBenchmark.aggregateScore ?? 0) : 'n/a'}
   834	- Latest recommendation: ${latest?.recommendation || 'n/a'}
   835	
   836	### Repeated Failure Modes
   837	
   838	${failureSummary}
   839	
   840	${renderDimensionalProgress(bucket)}`;
   841	}
   842	
   843	function renderSampleQualitySection(sampleQuality) {
   844	  const hasInsufficientData =
   845	    sampleQuality.insufficientSampleIterations > 0 ||
   846	    sampleQuality.insufficientDataIterations > 0;
   847	  const explanation = hasInsufficientData
   848	    ? '\nSome iterations had insufficient data for trade-off / stability analysis. Review the specific iterations before trusting verdicts.\n'
   849	    : '';
   850	
   851	  return `## Sample Quality
   852	
   853	| Field | Value |
   854	| --- | --- |
   855	| replayCount | ${formatDashboardValue(sampleQuality.replayCount)} |
   856	| stabilityCoefficient | ${formatDashboardValue(sampleQuality.stabilityCoefficient)} |
   857	| insufficientSampleIterations | ${sampleQuality.insufficientSampleIterations} |
   858	| insufficientDataIterations | ${sampleQuality.insufficientDataIterations} |
   859	${explanation}`;
   860	}
   861	
   862	function renderEventTypeCounts(eventTypeCounts) {
   863	  const rows = Object.entries(eventTypeCounts || {});
   864	  if (rows.length === 0) {
   865	    return '- none';
   866	  }
   867	  return rows.map(([eventType, count]) => `- ${eventType}: ${count}`).join('\n');
   868	}
   869	
   870	function renderJournalSummarySection(summary) {
   871	  if (!summary) {
   872	    return `## Journal Summary
   873	
   874	- Not available.
   875	`;
   876	  }
   877	
   878	  return `## Journal Summary
   879	
   880	| Field | Value |
   881	| --- | --- |
   882	| Last session start | ${formatDashboardValue(summary.lastSessionStart)} |
   883	| Last session end | ${formatDashboardValue(summary.lastSessionEnd)} |
   884	| Total events | ${formatDashboardValue(summary.totalEvents)} |
   885	| Stop reason | ${formatDashboardValue(summary.stopReason)} |
   886	| Session outcome | ${formatDashboardValue(summary.sessionOutcome)} |
   887	| Latest legal-stop evaluation | ${formatDashboardValue(summary.latestLegalStop?.timestamp)} |
   888	| Latest blocked stop | ${formatDashboardValue(summary.latestBlockedStop?.timestamp)} |
   889	
   890	### Event Types
   891	
   892	${renderEventTypeCounts(summary.eventTypeCounts)}
   893	
   894	${summary.latestLegalStop ? `### Latest legal-stop evaluation
   895	
   896	- Gates: ${formatDashboardValue(Object.keys(summary.latestLegalStop.gateResults || {}).sort().join(', ') || 'none')}
   897	` : ''}
   898	${summary.latestBlockedStop ? `### Latest blocked stop
   899	
   900	- Failed gates: ${formatDashboardValue(summary.latestBlockedStop.failedGates.join(', ') || 'none')}
   901	- Reason: ${formatDashboardValue(summary.latestBlockedStop.reason)}
   902	` : ''}
   903	`;
   904	}
   905	
   906	function renderCandidateLineageSection(summary) {
   907	  if (!summary) {
   908	    return `## Candidate Lineage
   909	
   910	- Not available.
   911	`;
   912	  }
   913	
   914	  return `## Candidate Lineage
   915	
   916	| Field | Value |
   917	| --- | --- |
   918	| Lineage depth | ${formatDashboardValue(summary.lineageDepth)} |
   919	| Total candidates | ${formatDashboardValue(summary.totalCandidates)} |
   920	| Current leaf | ${formatDashboardValue(summary.currentLeaf)} |
   921	`;
   922	}
   923	
   924	function renderMutationCoverageSection(summary) {
   925	  if (!summary) {
   926	    return `## Mutation Coverage
   927	
   928	- Not available.
   929	`;
   930	  }
   931	
   932	  return `## Mutation Coverage
   933	
   934	| Field | Value |
   935	| --- | --- |
   936	| Coverage ratio | ${formatDashboardValue(summary.coverageRatio)} |
   937	| Uncovered mutations | ${formatDashboardValue(summary.uncoveredMutations)} |
   938	`;
   939	}
   940	
   941	function renderDashboard(registry, sampleQuality) {
   942	  const sections = Object.values(registry.profiles)
   943	    .sort((left, right) => left.profileId.localeCompare(right.profileId))
   944	    .map((bucket) => renderProfileSection(bucket))
   945	    .join('\n');
   946	
   947	  let recommendation = 'Continue only when the next run has a clearer signal than the current best-known state.';
   948	  if (registry.stopStatus?.shouldStop) {
   949	    recommendation = `Stop automatically: ${registry.stopStatus.reasons.join('; ')}`;
   950	  } else if (registry.globalMetrics.infraFailureCount > 0) {
   951	    recommendation = 'Stabilize infrastructure before trusting further comparisons.';
   952	  } else if (registry.globalMetrics.benchmarkFailCount > 0) {
   953	    recommendation = 'Fix repeated benchmark failures before broadening scope or promoting any target.';
   954	  }
   955	
   956	  const replayConsumerSections = [
   957	    renderJournalSummarySection(registry.journalSummary),
   958	    renderCandidateLineageSection(registry.candidateLineage),
   959	    renderMutationCoverageSection(registry.mutationCoverage),
   960	  ].join('\n');
   961	
   962	  return `# Agent Improvement Dashboard
   963	
   964	## Global Summary
   965	
   966	| Field | Value |
   967	| --- | --- |
   968	| Total records | ${registry.globalMetrics.totalRecords} |
   969	| Target profiles | ${registry.globalMetrics.targetProfiles} |
   970	| Prompt runs | ${registry.globalMetrics.promptRuns} |
   971	| Benchmark runs | ${registry.globalMetrics.benchmarkRuns} |
   972	| Accepted candidates | ${registry.globalMetrics.acceptedCount} |
   973	| Rejected candidates | ${registry.globalMetrics.rejectedCount} |
   974	| Ties | ${registry.globalMetrics.tieCount} |
   975	| Keep-baseline results | ${registry.globalMetrics.keepBaselineCount} |
   976	| Benchmark passes | ${registry.globalMetrics.benchmarkPassCount} |
   977	| Benchmark fails | ${registry.globalMetrics.benchmarkFailCount} |
   978	| Infra failures | ${registry.globalMetrics.infraFailureCount} |
   979	
   980	${renderSampleQualitySection(sampleQuality)}
   981	
   982	${replayConsumerSections}
   983	
   984	## Guardrails
   985	
   986	- All targets evaluated via dynamic mode; promotion requires explicit per-target approval
   987	- Mirror sync stays downstream packaging and is not counted as benchmark truth
   988	
   989	## Stop Status
   990	
   991	- Should stop: ${registry.stopStatus?.shouldStop ? 'yes' : 'no'}
   992	- Drift ambiguity: ${registry.stopStatus?.driftAmbiguity ? 'yes' : 'no'}
   993	- Reasons: ${registry.stopStatus?.reasons?.length ? registry.stopStatus.reasons.join('; ') : 'none'}
   994	
   995	${sections}
   996	
   997	## Recommendation
   998	
   999	${recommendation}
  1000	`;
  1001	}
  1002	
  1003	// ─────────────────────────────────────────────────────────────────────────────
  1004	// 8. MAIN
  1005	// ─────────────────────────────────────────────────────────────────────────────
  1006	
  1007	function main() {
  1008	  const runtimeRoot = process.argv[2];
  1009	  if (!runtimeRoot) {
  1010	    process.stderr.write('Usage: node reduce-state.cjs <improvement-runtime-root>\n');
  1011	    process.exit(2);
  1012	  }
  1013	
  1014	  const stateLogPath = path.join(runtimeRoot, 'agent-improvement-state.jsonl');
  1015	  const registryPath = path.join(runtimeRoot, 'experiment-registry.json');
  1016	  const dashboardPath = path.join(runtimeRoot, 'agent-improvement-dashboard.md');
  1017	  const configPath = path.join(runtimeRoot, 'agent-improvement-config.json');
  1018	  const mirrorDriftReportPath = path.join(runtimeRoot, 'mirror-drift-report.md');
  1019	  const journalPath = path.join(runtimeRoot, 'improvement-journal.jsonl');
  1020	  const candidateLineagePath = path.join(runtimeRoot, 'candidate-lineage.json');
  1021	  const mutationCoveragePath = path.join(runtimeRoot, 'mutation-coverage.json');
  1022	
  1023	  const records = parseJsonl(readUtf8(stateLogPath));
  1024	  const registry = buildRegistry(records);
  1025	  registry.journalSummary = buildJournalSummary(journalPath);
  1026	  registry.candidateLineage = buildCandidateLineageSummary(candidateLineagePath);
  1027	  registry.mutationCoverage = buildMutationCoverageSummary(mutationCoveragePath);
  1028	  const config = parseJson(readOptionalUtf8(configPath) || '{}', {});
  1029	  const mirrorDriftReport = readOptionalUtf8(mirrorDriftReportPath);
  1030	  registry.stopStatus = evaluateStopStatus(registry, config, mirrorDriftReport);
  1031	  const sampleQuality = summarizeSampleQuality(records, registry);
  1032	  const dashboard = renderDashboard(registry, sampleQuality);
  1033	
  1034	  writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  1035	  writeUtf8(dashboardPath, dashboard);
  1036	}
  1037	
  1038	main();

exec
/bin/zsh -lc 'git diff -- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead

codex
I’ve finished the first pass on the reducers themselves. I’m now cross-checking a few surrounding contracts and tests so I can say whether these fixes are merely present or actually aligned with the packet schemas they’re supposed to support.
exec
/bin/zsh -lc 'rg -n "reduce-state|mutation-coverage|candidate-lineage|blendedScore|synthesis_complete|finalSeverity|claim_adjudication|blocked_stop|ACTIVE RISKS" .opencode/skill/sk-deep-review .opencode/skill/sk-deep-research .opencode/skill/sk-improve-agent' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-improve-agent/assets/improvement_config.json:77:    "path": "improvement/mutation-coverage.json"
.opencode/skill/sk-improve-agent/assets/improvement_config.json:95:    "lineagePath": "improvement/candidate-lineage.json"
.opencode/skill/sk-improve-agent/assets/improvement_config.json:111:    "mutation-coverage.json": "mutable",
.opencode/skill/sk-improve-agent/assets/improvement_config.json:112:    "candidate-lineage.json": "mutable",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:45:  "reducerScriptPath": ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs",
.opencode/skill/sk-improve-agent/assets/improvement_charter.md:85:| Blocked stop | `blocked_stop` | failedGates[], reason |
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:94:## 8. ACTIVE RISKS
.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:114:[Reducer populates from mutation-coverage.json after each iteration]
.opencode/skill/sk-improve-agent/SKILL.md:197:7. Run `scripts/reduce-state.cjs` to refresh the dashboard and experiment registry.
.opencode/skill/sk-improve-agent/SKILL.md:267:Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`
.opencode/skill/sk-improve-agent/SKILL.md:289:If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `improve_improve-agent_{auto,confirm}.yaml`, reducer ancestry handling in `sk-improve-agent/scripts/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.
.opencode/skill/sk-improve-agent/SKILL.md:293:**Script**: `scripts/mutation-coverage.cjs`
.opencode/skill/sk-improve-agent/SKILL.md:309:**Script**: `scripts/candidate-lineage.cjs`
.opencode/skill/sk-improve-agent/SKILL.md:359:The reducer is the consumer for replay artifacts on refresh. Every `scripts/reduce-state.cjs` pass now attempts to read:
.opencode/skill/sk-improve-agent/SKILL.md:362:- `candidate-lineage.json`
.opencode/skill/sk-improve-agent/SKILL.md:363:- `mutation-coverage.json`
.opencode/skill/sk-improve-agent/SKILL.md:369:ADR-002 is implemented in the reducer via replay consumers instead of a separate orchestrator-only synthesis step. During each refresh pass, `scripts/reduce-state.cjs` now reads the following artifacts when present:
.opencode/skill/sk-improve-agent/SKILL.md:372:- `candidate-lineage.json` to summarize lineage depth, total candidate count, and the latest candidate leaf
.opencode/skill/sk-improve-agent/SKILL.md:373:- `mutation-coverage.json` to summarize mutation coverage ratio and uncovered mutations
.opencode/skill/sk-improve-agent/SKILL.md:437:| `scripts/reduce-state.cjs` | Ledger reducer and dashboard generator |
.opencode/skill/sk-improve-agent/SKILL.md:444:| `scripts/mutation-coverage.cjs` | Coverage graph reader/writer for explored dimensions and mutation tracking |
.opencode/skill/sk-improve-agent/SKILL.md:446:| `scripts/candidate-lineage.cjs` | Lineage graph for optional parallel candidate wave sessions |
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:226:  const namedScore = signals.blendedScore
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:310:  const latestSynthesisComplete = eventRecords.filter((record) => record.event === 'synthesis_complete').at(-1);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:526:    .filter((record) => record.event === 'blocked_stop')
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:763:    '## 8. ACTIVE RISKS',
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:895:      'Usage: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> [--lenient]\n',
.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:220:    if (eventType === 'blocked_stop') {
.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:1010:    process.stderr.write('Usage: node reduce-state.cjs <improvement-runtime-root>\n');
.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:1020:  const candidateLineagePath = path.join(runtimeRoot, 'candidate-lineage.json');
.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:1021:  const mutationCoveragePath = path.join(runtimeRoot, 'mutation-coverage.json');
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:314:    if (record?.type !== 'event' || record?.event !== 'claim_adjudication') {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:319:    const finalSeverity = normalizeSeverity(getNestedField(record, 'finalSeverity'));
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:320:    if (!findingId || !finalSeverity) {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:329:      finalSeverity,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:383:    if (record.event === 'synthesis_complete') {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:448:      const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:660:    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1038:    '## 11. ACTIVE RISKS',
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1043:      // `blocked_stop` and `claim_adjudication` events so operators see
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1059:          && record.event === 'claim_adjudication'
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1075:        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1177:      'Usage: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> [--lenient] [--create-missing-anchors]\n',
.opencode/skill/sk-deep-research/references/convergence.md:218:| Convergence Gate | The novelty score stays below `convergenceThreshold` for N consecutive evidence iterations | Block STOP, persist `blocked_stop`, continue |
.opencode/skill/sk-deep-research/references/convergence.md:219:| Coverage Gate | Every key question has at least one evidence-backed answer | Block STOP, persist `blocked_stop`, continue |
.opencode/skill/sk-deep-research/references/convergence.md:220:| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance all pass | Block STOP, persist `blocked_stop`, continue |
.opencode/skill/sk-deep-research/references/convergence.md:308:2. Append a first-class `blocked_stop` event with `stopReason: "blockedStop"`, `legalStop.blockedBy`, the full `legalStop.gateResults`, and a concrete `recoveryStrategy`.
.opencode/skill/sk-deep-research/references/convergence.md:426:The stop-decision event (`stop_decision` and `blocked_stop` JSONL records) includes which semantic signals supported or prevented STOP:
.opencode/skill/sk-deep-research/references/convergence.md:468:4.6. **Blocked-stop persistence** (if any legal-stop gate fails, persist `blocked_stop` with recovery strategy and continue)
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:114:| 07-004 | Legal-stop gates | `/improve:improve-agent ... --iterations=5` | `legal_stop_evaluated` with 5 gate bundles, `blocked_stop` on failure | `blockedStop` recorded when gates fail |
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:116:| 07-006 | Dimension trajectory | `node mutation-coverage.cjs` (unit) | Trajectory recorded, convergence requires 3+ stable points | Convergence rejected <3 points, accepted when stable |
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:119:| 07-009 | Insufficient sample propagation | `low-sample fixture -> trade-off-detector.cjs -> benchmark-stability.cjs -> reduce-state.cjs` | `insufficientData` and `insufficientSample` stay distinct in the registry and dashboard | Low-sample runtime truth stays diagnosable |
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:120:| 07-010 | Replay consumer artifact verification | `node reduce-state.cjs {spec}/improvement` plus one-artifact-missing reruns | Replay summaries populate when artifacts exist and resolve to `null` individually when one is missing | Replay-consumer degradation stays graceful |
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:161:| `06--end-to-end-loop/` | 020-full-pipeline, 021-any-agent, 022-mutation-coverage-graph-tracking, 023-trade-off-detection, 024-candidate-lineage |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md:50:| DR-033 | Research graph-aware stop gate surfaces convergence verdict and workflow hooks | Verify `graph_convergence` output appears in reducer artifacts and the auto workflow calls graph tools before the inline stop vote. | As a manual-testing orchestrator, validate graph-aware stop-gate integration for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph_convergence reducer output populates graphConvergenceScore, graphDecision, and graphBlockers, that the dashboard renders GRAPH CONVERGENCE, and that the research auto workflow calls deep_loop_graph_upsert plus deep_loop_graph_convergence before the inline 3-signal vote. Return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}` -> 2. `bash: cat {spec_folder}/research/findings-registry.json | jq '.graphConvergenceScore, .graphDecision, .graphBlockers'` -> 3. `bash: grep -A 3 "GRAPH CONVERGENCE" {spec_folder}/research/deep-research-dashboard.md` -> 4. `bash: grep -n "deep_loop_graph_upsert\\|deep_loop_graph_convergence" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Registry surfaces `graphConvergenceScore`, `graphDecision`, and `graphBlockers`; dashboard renders `GRAPH CONVERGENCE`; workflow YAML calls both graph tools before the inline 3-signal vote. | Capture the registry graph fields, the dashboard `GRAPH CONVERGENCE` excerpt, and the YAML lines that show `deep_loop_graph_upsert` and `deep_loop_graph_convergence`. | PASS if graph signals appear in the registry and dashboard and the workflow YAML still calls the graph tools in the graph-aware stop path; FAIL if graph data is missing from any reducer surface or the YAML no longer shows the graph-tool hooks. | Privilege reducer-owned registry output for surfaced state and the workflow YAML for live orchestration order. If reducer fields exist but the YAML lacks graph-tool calls, treat that as graph-aware stop-gate wiring drift rather than a reducer regression. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md:66:| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Canonical reducer implementation; surfaces `graphConvergenceScore`, `graphDecision`, `graphBlockers`, and dashboard `GRAPH CONVERGENCE` |
.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/research/iterations/iteration-001.md:18:- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts:14:  '.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs',
.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts:41:describe('mutation-coverage', () => {
.opencode/skill/sk-deep-research/references/state_format.md:279:| blocked_stop | workflow | active | Legal-stop candidate was blocked and the loop must continue | mode, run, blockedBy, gateResults, recoveryStrategy, timestamp, sessionId, generation |
.opencode/skill/sk-deep-research/references/state_format.md:291:| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:307:{"type":"event","event":"graph_convergence","mode":"research","run":7,"decision":"STOP_BLOCKED","signals":{"questionCoverage":0.86,"claimVerificationRate":0.78,"contradictionDensity":0.04,"blendedScore":0.68},"blockers":[{"name":"sourceDiversity","severity":"high","detail":"Only 2 distinct corroborating sources cover the active claim cluster."}],"timestamp":"2026-04-11T11:55:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:317:| signals | object | Yes | Graph signal bundle returned by `deep_loop_graph_convergence`, including `blendedScore` when available |
.opencode/skill/sk-deep-research/references/state_format.md:330:4. If the inline vote says STOP but the latest graph decision is `STOP_BLOCKED`, the workflow must emit `blocked_stop` and continue with the recovery strategy instead of stopping.
.opencode/skill/sk-deep-research/references/state_format.md:335:{"type":"event","event":"blocked_stop","mode":"research","run":7,"blockedBy":["keyQuestionCoverage","evidenceDensity"],"gateResults":{"convergence":{"pass":true,"score":0.72},"keyQuestionCoverage":{"pass":false,"answered":5,"total":7},"evidenceDensity":{"pass":false,"sources":2},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"Collect evidence for the remaining uncovered question cluster.","timestamp":"2026-04-11T12:00:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:341:| event | string | Yes | Always `blocked_stop` |
.opencode/skill/sk-deep-research/references/state_format.md:472:| blockedStopHistory | array | One entry per `blocked_stop` event promoted under REQ-014. Reducer preserves append order from the JSONL and exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp` for operator replay. |
.opencode/skill/sk-deep-research/references/state_format.md:587:When the most recent loop event is a `blocked_stop` (its timestamp is newer than the latest iteration record), the reducer may drive the `next-focus` anchor directly from that event instead of the last iteration file. In that case the anchor must surface:
.opencode/skill/sk-deep-research/references/state_format.md:816:  "event": "synthesis_complete",
.opencode/skill/sk-deep-research/references/loop_protocol.md:148:   - Persist the blocked legal-stop outcome: `{"type":"event","event":"blocked_stop","mode":"research","run":N,"blockedBy":["<gate>"],"gateResults":{"convergence":{"pass":true,"score":0.0},"keyQuestionCoverage":{"pass":false,"answered":X,"total":Y},"evidenceDensity":{"pass":false,"sources":N},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"<one-line hint>","timestamp":"<ISO8601>","sessionId":"<sid>","generation":G}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:153:If the legal-stop decision tree returns `blocked`, the workflow MUST append the `blocked_stop` JSONL event before continuing. Reducers and dashboards consume the persisted event; they must not infer blocked-stop state solely from prose logs.
.opencode/skill/sk-deep-research/references/loop_protocol.md:480:6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:717:- `finalSeverity`
.opencode/skill/sk-deep-research/references/loop_protocol.md:750:4. **Severity reconciliation**: Use adjudicated `finalSeverity` for any P0/P1 that changed during review
.opencode/skill/sk-deep-research/references/loop_protocol.md:767:9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md:36:- If no lineage graph is created: verify that `candidate-lineage.cjs` is invoked by the orchestrator after each candidate evaluation
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:3:description: "Verify that blocked_stop events become reducer-owned blockedStopHistory, render in the dashboard, and rewrite the strategy next-focus anchor with recovery guidance."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:14:This scenario validates blocked-stop reducer surfacing for `DR-032`. The objective is to verify that a research packet with at least one `blocked_stop` event surfaces that event into reducer-owned `blockedStopHistory`, the `BLOCKED STOPS` dashboard section, and the strategy `next-focus` anchor.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:27:- Given: A research packet with at least one `blocked_stop` event, using `.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/` once T048 lands or a hand-constructed minimal example that includes `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp`.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:28:- When: The operator runs `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>`.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:31:- Prompt: `As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> on a research packet with at least one blocked_stop event populates blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:50:| DR-032 | Research reducer surfaces blocked-stop history across registry, dashboard, and next-focus | Verify `blocked_stop` reducer output appears in `blockedStopHistory`, `BLOCKED STOPS`, and the strategy recovery anchor. | As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> on a research packet with at least one blocked_stop event populates blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}` -> 2. `bash: cat {spec_folder}/research/findings-registry.json | jq '.blockedStopHistory'` -> 3. `bash: grep -A 5 "BLOCKED STOPS" {spec_folder}/research/deep-research-dashboard.md` -> 4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/research/deep-research-strategy.md` | `blockedStopHistory` contains reducer-promoted blocked-stop entries; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record. | Capture the populated `blockedStopHistory` array, the dashboard `BLOCKED STOPS` excerpt, and the strategy `next-focus` anchor showing the recovery guidance. | PASS if all three surfaces show the same blocked-stop data and recovery hint; FAIL if any surface is missing the blocked-stop data or shows stale content after the reducer run. | Privilege `findings-registry.json` as the reducer-owned source of truth. If the registry is correct but the dashboard or strategy anchor is stale, treat that as reducer surfacing drift. If no canonical interrupted-session fixture exists yet, use a hand-constructed minimal packet and note the fixture gap in the operator verdict. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md:66:| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
.opencode/skill/sk-deep-review/references/convergence.md:44:Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus — when STOP is vetoed — a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path; earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.
.opencode/skill/sk-deep-review/references/convergence.md:58:#### blocked_stop Event (canonical, persisted)
.opencode/skill/sk-deep-review/references/convergence.md:60:`step_emit_blocked_stop` in both `spec_kit_deep-review_{auto,confirm}.yaml` appends the following record to `deep-review-state.jsonl` whenever the legal-stop decision tree vetoes STOP. The gate names and their shapes are load-bearing — the reducer reads them verbatim:
.opencode/skill/sk-deep-review/references/convergence.md:65:  "event": "blocked_stop",
.opencode/skill/sk-deep-review/references/convergence.md:89:- `blockedBy`: array of gate names that failed (string[] — never structured objects). Empty when STOP is legal, in which case no `blocked_stop` event is emitted.
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md:36:- If no graph file is created: verify that mutation-coverage.cjs is invoked by the orchestrator and writes to the configured path
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:116:## 9. ACTIVE RISKS
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:3:description: "Verify that blocked_stop events preserve the review gate bundle in blockedStopHistory, render in the dashboard, and rewrite the strategy next-focus anchor with recovery guidance."
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:14:This scenario validates blocked-stop reducer surfacing for `DRV-022`. The objective is to verify that a review packet with at least one `blocked_stop` event preserves the review-specific legal-stop bundle in `blockedStopHistory`, renders that blocked-stop evidence in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:27:- Given: A review packet with at least one `blocked_stop` event whose `blockedBy` and `gateResults` use the review-specific legal-stop names `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:28:- When: The operator runs `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:31:- Prompt: `As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> on a review packet with at least one blocked_stop event preserves the review gate bundle in blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.`
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:50:| DRV-022 | Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus | Verify review `blocked_stop` output appears in `blockedStopHistory`, `BLOCKED STOPS`, and the strategy recovery anchor. | As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> on a review packet with at least one blocked_stop event preserves the review gate bundle in blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {spec_folder}` -> 2. `bash: cat {spec_folder}/review/deep-review-findings-registry.json | jq '.blockedStopHistory'` -> 3. `bash: grep -A 5 "BLOCKED STOPS" {spec_folder}/review/deep-review-dashboard.md` -> 4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/review/deep-review-strategy.md` | `blockedStopHistory` contains reducer-promoted blocked-stop entries with the review gate names; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record. | Capture the populated `blockedStopHistory` array, the dashboard `BLOCKED STOPS` excerpt, and the strategy `next-focus` anchor showing the recovery guidance. | PASS if all three review surfaces show the same blocked-stop data and preserve the review gate names; FAIL if any surface is missing blocked-stop data or the gate bundle is incomplete after the reducer run. | Privilege `deep-review-findings-registry.json` as the reducer-owned source of truth. If the registry is correct but the dashboard or strategy anchor is stale, treat that as reducer surfacing drift rather than JSONL input failure. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:66:| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:68:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Review legal-stop workflow contract; defines the review-specific gate names used in `blocked_stop` events |
.opencode/skill/sk-deep-review/assets/deep_review_config.json:45:  "reducerScriptPath": ".opencode/skill/sk-deep-review/scripts/reduce-state.cjs",
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:29:blocked = [e for e in events if e['eventType'] == 'blocked_stop']
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:37:    print(f'blocked_stop found — failed gates: {failed}')
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:44:        print('INFO — no blocked_stop event found; may need scenario with intentional gate failure')
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:56:- When any gate fails: `blocked_stop` event emitted with `failedGates[]` and `reason`
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:63:When convergence math would trigger stop but at least one gate bundle fails, the journal contains a `blocked_stop` event with the failing gate names, and the session's `stopReason` is `blockedStop` -- the session does NOT claim `converged`.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:68:- If `blocked_stop` is missing when a gate fails: check the conditional that routes to `blocked_stop` vs `converged` based on gate results
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:79:[paste legal_stop_evaluated and/or blocked_stop event JSON]
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md:34:- Expected signals: `SOURCE_DIVERSITY_THRESHOLD = 0.4`; `evaluateGraphGates()` fails `sourceDiversity` when below threshold; research convergence docs map failed legal-stop gates to `stopReason: "blockedStop"` and `blocked_stop` persistence.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md:50:| DR-031 | Graph convergence signals act as STOP-blocking guards | Verify low `sourceDiversity` vetoes STOP and records blocked-stop evidence. | As a manual-testing orchestrator, validate the graph stop-blocking guard contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify SOURCE_DIVERSITY_THRESHOLD = 0.4 blocks STOP when unmet, and that the research convergence reference records blocked-stop persistence with stopReason: "blockedStop" when legal-stop gates fail. Return a concise operator-facing verdict. | 1. `bash: rg -n 'SOURCE_DIVERSITY_THRESHOLD|evaluateGraphGates|sourceDiversityGate|allPass' .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` -> 2. `bash: rg -n 'blockedStop|blocked_stop|graph-aware convergence|graphEvents|sourceDiversity' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: rg -n 'sourceDiversity|threshold: 0.4|blocking' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts` | `SOURCE_DIVERSITY_THRESHOLD = 0.4`; low `sourceDiversity` fails the guard; deep-research convergence persists blocked-stop state when legal-stop gates fail. | Capture the helper threshold definition, the `evaluateGraphGates()` pass/fail logic, the convergence reference blocked-stop persistence lines, and one test assertion showing the `0.4` threshold. | PASS if low `sourceDiversity` fails the graph stop gate and blocked-stop persistence is documented for failed legal-stop evaluation; FAIL if either the threshold enforcement or blocked-stop persistence is missing or contradictory. | Privilege `coverage-graph-convergence.cjs` for the enforcement contract and `references/convergence.md` for the deep-research stop-state behavior. If wording differs between `blocked_stop` event name and `blockedStop` stop reason, treat both as the same blocked-stop pathway and note the distinction in the operator verdict. |
.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/README.md:9:- `agent-improvement-state.jsonl` embeds both insufficient states in iteration records so `reduce-state.cjs` can surface `insufficientDataIterations` and `insufficientSampleIterations` in the generated registry.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md:12:When: the operator runs `trade-off-detector.cjs`, `benchmark-stability.cjs`, and `reduce-state.cjs` against that low-sample runtime.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md:57:node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs "$FIXTURE"
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md:69:- `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md:83:- If reducer fields are absent: inspect `reduce-state.cjs` for `extractInsufficientDataIteration()` and `extractInsufficientSampleIteration()` wiring
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/017-no-dimensions.md:24:node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-nodim
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/017-no-dimensions.md:43:- If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags)
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md:44:const cl = require('./.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs');
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md:45:const lineagePath = '{spec}/improvement/candidate-lineage.json';
.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts:14:  '.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs',
.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts:29:  lineagePath = path.join(tmpDir, 'candidate-lineage.json');
.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts:36:describe('candidate-lineage', () => {
.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/research/deep-research-state.jsonl:2:{"type":"iteration","mode":"research","run":1,"status":"complete","focus":"Map crash-safe resume requirements","findingsCount":3,"newInfoRatio":0.5,"answeredQuestions":["What state is safe to trust after an interrupted write?"],"keyQuestions":["What state is safe to trust after an interrupted write?","Which artifacts must fail closed?","How should resume pick the next focus?"],"sourcesQueried":[".opencode/skill/sk-deep-research/scripts/reduce-state.cjs",".opencode/skill/sk-deep-research/assets/deep_research_strategy.md"],"toolsUsed":["Read","Grep"],"timestamp":"2026-04-11T12:08:00Z","durationMs":180000}
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/019-plateau-detection.md:27:node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-plateau
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/019-plateau-detection.md:49:- If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags)
.opencode/skill/sk-deep-review/references/state_format.md:278:  "type": "event", "event": "synthesis_complete", "mode": "review",
.opencode/skill/sk-deep-review/references/state_format.md:290:When the review legal-stop decision tree returns `blocked`, append a first-class `blocked_stop` event instead of silently overriding STOP to CONTINUE.
.opencode/skill/sk-deep-review/references/state_format.md:295:  "event": "blocked_stop",
.opencode/skill/sk-deep-review/references/state_format.md:348:**Combined-stop rule:** Final STOP is legal only when the inline review convergence decision says STOP and the latest `graph_convergence.decision == "STOP_ALLOWED"`. If the latest graph decision is `STOP_BLOCKED`, set `stop_blocked=true`, emit `blocked_stop`, and continue recovery instead of stopping. If the latest graph decision is `CONTINUE`, downgrade the inline STOP candidate to CONTINUE.
.opencode/skill/sk-deep-review/references/state_format.md:533:| `blockedStopHistory` | array | One entry per `blocked_stop` JSONL event: `{run, blockedBy, gateResults, recoveryStrategy, timestamp}`. Rendered in the dashboard `BLOCKED STOPS` section and can drive the strategy `next-focus` anchor when blocked-stop is the most recent loop event. |
.opencode/skill/sk-deep-review/references/state_format.md:542:When no `blocked_stop` event has been recorded yet, `blockedStopHistory: []`.
.opencode/skill/sk-deep-review/references/state_format.md:550:- **Strategy next-focus override**: When the latest `blocked_stop` event timestamp is newer than the latest iteration timestamp, the reducer rewrites the strategy `next-focus` anchor to surface the blocking gates and recovery hint so operators see the blocker before choosing the next iteration direction.
.opencode/skill/sk-deep-review/references/state_format.md:674:Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`) — a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
.opencode/skill/sk-deep-review/references/state_format.md:690:  "finalSeverity": "P1",
.opencode/skill/sk-deep-review/references/state_format.md:708:| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication (may differ from the severity originally asserted) |
.opencode/skill/sk-deep-review/references/state_format.md:709:| `confidence` | number `[0, 1]` | Reviewer confidence in `finalSeverity` |
.opencode/skill/sk-deep-review/references/state_format.md:711:| `transitions` | object[] | Optional severity transition log; required when `finalSeverity` differs from the originally asserted severity |
.opencode/skill/sk-deep-review/references/state_format.md:713:### Validation Rules (enforced by `step_post_iteration_claim_adjudication`)
.opencode/skill/sk-deep-review/references/state_format.md:718:4. `finalSeverity` MUST match the severity the finding is registered under in the iteration's `Findings` section and in `deep-review-findings-registry.json`.
.opencode/skill/sk-deep-review/references/state_format.md:719:5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md:50:| DRV-023 | Review reducer fails closed on corruption and missing anchors | Verify corruption and missing anchors fail closed by default, with `--lenient` and `--create-missing-anchors` as explicit escape hatches. | As a manual-testing orchestrator, validate fail-closed reducer behavior for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify malformed JSONL exits with code 2 unless --lenient is passed, that missing machine-owned anchors throw Missing machine-owned anchor ... unless --create-missing-anchors is used, and that corruptionWarnings remains present after lenient recovery. Return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture}; echo "exit: $?"` -> 2. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'` -> 3. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture}; echo "exit: $?"` -> 4. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture} --lenient; echo "exit: $?"` -> 5. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'` -> 6. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture} --create-missing-anchors; echo "exit: $?"` -> 7. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {anchor_fixture}/review/deep-review-strategy.md` | Without `--lenient`, corrupt JSONL exits `2` and preserves `corruptionWarnings`; without `--create-missing-anchors`, the reducer throws `Missing machine-owned anchor ...`; with `--lenient`, the reducer exits `0` but preserves `corruptionWarnings`; with `--create-missing-anchors`, the missing anchor is created and the reducer proceeds. | Capture both exit codes, the missing-anchor stderr, the populated `.corruptionWarnings` field before and after `--lenient`, and the strategy `next-focus` anchor after `--create-missing-anchors`. | PASS if all four exit conditions match the documented contract and warning state is still visible after lenient recovery; FAIL if any exit code, error string, warning surface, or anchor bootstrap behavior differs. | Privilege `reduce-state.cjs` for exit semantics and `review-reducer-fail-closed.vitest.ts` for concrete expected behavior. If fixture preparation accidentally combines both failures in one directory, split into two fixture copies before judging the reducer. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md:66:| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; emits `corruptionWarnings`, exits non-zero on corruption, and enforces machine-owned anchor presence unless recovery flags are passed |
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md:9:Validates that `mutation-coverage.cjs` tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md:13:- Prompt: `As a manual-testing orchestrator, validate that mutation-coverage.cjs tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `recordTrajectory()` appends per-dimension scores with iteration number and timestamp. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md:19:const mc = require('./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs');
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md:42:const mc = require('./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs');
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:47:| DR-019 | Final synthesis plus memory save and guardrail behavior | Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features. | As a manual-testing orchestrator, validate the finalization and guardrail contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical research/research.md, memory save uses generate-context.js, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, :restart segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees. Return a concise operator verdict. | 1. `bash: rg -n 'generate-context.js|synthesis_complete|research/research.md|memory' .opencode/command/spec_kit/deep-research.md .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-research/README.md` -> 2. `bash: rg -n 'LEAF-only|Task tool|NEVER create sub-tasks|reference-only|Wave orchestration|Checkpoint Commit|Direct Mode Fallback|Segment Model' .codex/agents/deep-research.toml .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: rg -n 'phase_synthesis|phase_save|generate-context.js|synthesis_complete|wave|segment|direct_mode' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/skill/sk-deep-research/references/quick_reference.md` | Synthesis produces canonical `research/research.md`, memory save calls `generate-context.js`, the Codex runtime agent forbids nested delegation, and wave orchestration, checkpoint commits, segment transitions, and alternate CLI dispatch remain reference-only. | Capture the final synthesis/save contract, the runtime LEAF-only prohibition, and the reference-only feature markings in one evidence set. | PASS if finalization and memory save use the supported contract, LEAF-only behavior remains enforced, and reference-only features are clearly documented as non-live; FAIL if any non-live feature is presented as a shipped executable guarantee. | Privilege the Codex runtime agent and skill rules for LEAF-only behavior, and the loop/state references for reference-only boundaries. |
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/018-with-dimensions.md:24:node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-dim
.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/018-with-dimensions.md:46:- If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags)
.opencode/skill/sk-deep-review/references/loop_protocol.md:172:If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
.opencode/skill/sk-deep-review/references/loop_protocol.md:306:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.
.opencode/skill/sk-deep-review/references/loop_protocol.md:317:| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication |
.opencode/skill/sk-deep-review/references/loop_protocol.md:318:| `confidence` | number `[0, 1]` | Orchestrator confidence in `finalSeverity` |
.opencode/skill/sk-deep-review/references/loop_protocol.md:320:| `transitions` | object[] | Optional; required when `finalSeverity` differs from the originally asserted severity |
.opencode/skill/sk-deep-review/references/loop_protocol.md:328:5. Emit the typed packet inside the iteration file so `step_post_iteration_claim_adjudication` can parse it.
.opencode/skill/sk-deep-review/references/loop_protocol.md:330:**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
.opencode/skill/sk-deep-review/references/loop_protocol.md:414:Use adjudicated `finalSeverity` for any P0/P1 that was downgraded during claim adjudication (Step 4a of the iteration loop). The original severity from the iteration file is preserved in the audit appendix.
.opencode/skill/sk-deep-review/references/loop_protocol.md:465:     "event": "synthesis_complete",
.opencode/skill/sk-improve-agent/README.md:226:|   |-- reduce-state.cjs              Ledger reducer + dimensional dashboard
.opencode/skill/sk-improve-agent/README.md:250:| `reduce-state.cjs` | Refresh dashboard + registry from ledger | `RUNTIME_ROOT` (positional) |
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:9:Validates ADR-002 Option A replay-consumer behavior: `reduce-state.cjs` reads `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json`, writes their summaries into the registry, and degrades gracefully when any one artifact is missing.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:11:Given: an improvement runtime where `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` are all present.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:12:When: the operator runs `reduce-state.cjs` and then repeats the run with one artifact removed at a time from a disposable runtime copy.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:17:- Prompt: `As a manual-testing orchestrator, validate ADR-002 Option A replay-consumer behavior: reduce-state.cjs reads improvement-journal.jsonl, candidate-lineage.json, and mutation-coverage.json, writes their summaries into the registry, and degrades gracefully when any one artifact is missing against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify \`experiment-registry.json\` contains the replay-consumer summaries. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:22:node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs {spec}/improvement
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:31:node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs "$RUNTIME_COPY"
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:56:for artifact in improvement-journal.jsonl candidate-lineage.json mutation-coverage.json; do
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:60:  node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs "$TMP_CASE"
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:66:    candidate-lineage.json)
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:70:    mutation-coverage.json)
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:93:With all three replay artifacts present, `reduce-state.cjs` populates `journalSummary`, `candidateLineage`, and `mutationCoverage` in the registry. When any one artifact is missing, the reducer completes successfully and sets only the corresponding field to `null` while preserving the others.
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:97:- If any registry summary is missing with artifacts present: inspect `buildJournalSummary()`, `buildCandidateLineageSummary()`, or `buildMutationCoverageSummary()` in `reduce-state.cjs`
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:58:  'blocked_stop',
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:47:| DR-024 | Dashboard generation after iteration | Verify dashboard.md is auto-generated after iteration evaluation with correct content. | As a manual-testing orchestrator, validate the dashboard generation contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Step 4a\|Generate Dashboard\|dashboard_generated' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: sed -n '/ANCHOR:dashboard/,/\/ANCHOR:dashboard/p' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: cat .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` -> 4. `bash: rg -n 'step_reduce_state\|step_generate_dashboard\|reduce-state.cjs' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 5. `bash: rg -n 'renderDashboard\|dashboardPath' .opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | `research/deep-research-dashboard.md` exists after iteration evaluation; contains iteration table, question status (X/Y answered), trend (last 3 ratios with direction), dead ends (from ruledOut), next focus (from strategy.md), and active risks; file is overwritten (not appended) each iteration; dashboard generation is reducer-owned and idempotent. | Capture the loop protocol Step 4a excerpt, the state format dashboard section, the template content, the YAML step definitions for both reducer and dashboard, and the reducer script's `renderDashboard` function. | PASS if the dashboard file exists after iteration evaluation, contains all required sections, and is regenerated (not appended) each iteration; FAIL if the file is missing, sections are absent, or stale data persists from a prior iteration. | Privilege the loop protocol Step 4a for the generation contract, the reducer script for the live implementation, and the state format dashboard section for content requirements; use the template asset as the structural reference. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:67:| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Reducer script; `renderDashboard` generates the dashboard content; `reduceResearchState` writes it to disk |
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:3:description: "Verify that finding deduplication uses adjudicated finalSeverity and produces a clean Active Finding Registry in the review report."
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:14:This scenario validates finding deduplication and registry for `DRV-028`. The objective is to verify that the synthesis phase deduplicates findings across iterations using adjudicated `finalSeverity` and produces a clean Active Finding Registry in the review report.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:18:Multiple review iterations covering overlapping code areas will inevitably find the same issue more than once. Without deduplication, the report inflates finding counts, confuses remediation planning, and undermines operator trust. The `finalSeverity` adjudication ensures that when the same finding appears at different severities across iterations, the authoritative severity is used in the registry.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:26:- Objective: Verify finding deduplication uses adjudicated finalSeverity and produces clean registry.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:28:- Prompt: `As a manual-testing orchestrator, validate the finding deduplication contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify during synthesis, findings from all review/iterations/iteration-NNN.md files are compared for duplicates, that duplicate resolution uses adjudicated finalSeverity (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in review-report.md contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings. Return a concise operator-facing verdict.`
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:31:- Expected signals: Findings are compared across iterations by location and description, `finalSeverity` is the highest severity encountered, the Active Finding Registry contains unique entries only, P0 findings are never downgraded or discarded, and the registry includes file:line evidence for each finding.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:47:| DRV-028 | Finding deduplication and registry | Verify finding deduplication uses adjudicated finalSeverity and produces clean Active Finding Registry. | As a manual-testing orchestrator, validate the finding deduplication contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify during synthesis, findings from all review/iterations/iteration-NNN.md files are compared for duplicates, that duplicate resolution uses adjudicated finalSeverity (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in review-report.md contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings. Return a concise operator-facing verdict. | 1. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|Active Finding Registry|unique.*finding|merge.*finding|duplicate' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` -> 2. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|active_finding|merge|duplicate|unique' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Active Finding Registry|Dedup|finalSeverity|finding.*registry|finding.*evidence|unique.*finding' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Findings compared across iterations, `finalSeverity` is highest severity encountered, Active Finding Registry has unique entries, P0 never downgraded, evidence included. | Capture the deduplication rules from SKILL.md, the YAML synthesis deduplication logic, and the Active Finding Registry section definition from quick reference. | PASS if deduplication produces a clean registry with adjudicated severities; FAIL if duplicates appear in the registry or P0 findings are lost during deduplication. | Privilege the SKILL.md rules for deduplication logic and the quick reference for the Active Finding Registry section definition. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:32:- Expected execution process: Inspect the deep-review convergence reference for legal-stop gate behavior first, then the coverage-graph convergence handler for review `dimensionCoverage` thresholds, then fixture evidence for persisted `blocked_stop`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:34:- Expected signals: review convergence docs describe `blockedStop` when legal-stop gates fail; graph convergence handler enforces review `dimensionCoverage`; fixture evidence shows `blocked_stop` with `blockedBy: ["dimensionCoverage", ...]`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:50:| DRV-021 | Review graph convergence signals participate in legal-stop gates | Verify graph-backed dimension coverage can veto STOP after stability points toward convergence. | As a manual-testing orchestrator, validate the graph-backed legal-stop gate contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify graph-aware review convergence tracks graph dimension coverage, and that when legal-stop evaluation fails dimension coverage the review persists blocked-stop state instead of stopping. Return a concise operator-facing verdict. | 1. `bash: rg -n 'blockedStop|dimensionCoverage|buildReviewLegalStop|graphEvents|graph-aware review convergence' .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'dimensionCoverage|threshold|STOP_BLOCKED|blocking' .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` -> 3. `bash: rg -n 'blocked_stop|blockedStop|dimensionCoverage' .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl` | Legal-stop docs map failed gate evaluation to `blockedStop`; the graph convergence handler evaluates review `dimensionCoverage`; fixture evidence shows persisted `blocked_stop` blocked by `dimensionCoverage`. | Capture the review convergence legal-stop wording, the handler threshold/check for review `dimensionCoverage`, and the sample blocked-stop JSONL record naming `dimensionCoverage` in `blockedBy`. | PASS if the review docs, graph convergence handler, and blocked-stop fixture all agree that dimension-coverage failure prevents STOP even when other signals are favorable; FAIL if dimension-coverage failure is only advisory or not persisted. | Privilege `references/convergence.md` for the review stop contract and the fixture for concrete JSONL persistence. If the handler threshold and packet-level wording differ, flag threshold drift for follow-up. |
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md:47:| DRV-027 | Final synthesis memory save and guardrail behavior | Verify memory save via generate-context.js after review completion, LEAF-only enforcement, and read-only contract. | As a manual-testing orchestrator, validate the finalization and guardrail contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify synthesis produces canonical review/review-report.md, memory save uses generate-context.js (not manual Write tool), the runtime agent remains LEAF-only (no sub-agent dispatch), and that the review agent does not modify target files under review (read-only contract). Return a concise operator-facing verdict. | 1. `bash: rg -n 'generate-context.js|memory.*save|synthesis_complete|review-report|memory' .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` -> 2. `bash: rg -n 'LEAF-only|Task tool|NEVER.*sub|NEVER.*dispatch|read.only|NEVER.*modify|observation.*only' .claude/agents/deep-review.md .codex/agents/deep-review.toml .opencode/skill/sk-deep-review/SKILL.md` -> 3. `bash: rg -n 'phase_synthesis|phase_save|generate-context.js|synthesis_complete|memory_save|review-report' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Synthesis produces `review/review-report.md`, memory save calls `generate-context.js`, agent is LEAF-only, target files are read-only. | Capture the synthesis/save contract, the LEAF-only prohibition from agent definitions, and the read-only rule from SKILL.md. | PASS if finalization and memory save use the supported contract and LEAF-only plus read-only behavior remain enforced; FAIL if memory is saved via Write tool, the agent dispatches sub-agents, or target files are modified. | Privilege the agent definitions for LEAF-only behavior and the skill rules for read-only and memory save contracts. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:47:| DRV-012 | Adversarial self-check runs on P0 findings | Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them. | As a manual-testing orchestrator, validate the adversarial self-check contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify Rule 10 (adversarial self-check on P0 findings) is documented in the SKILL.md rules, enforced in the quick reference iteration checklist, and checked in the YAML post-iteration claim adjudication. Return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'adversarial\|self.check\|Hunter\|Skeptic\|Referee\|Rule 10\|re-read.*P0' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'adversarial\|self.check\|P0.*check\|claim_adjudication' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'adversarial\|self.check\|P0\|Hunter\|Skeptic\|Referee' .opencode/skill/sk-deep-review/references/quick_reference.md .codex/agents/deep-review.toml .claude/agents/deep-review.md` | Rule 10 in SKILL.md mandates adversarial self-check; iteration checklist includes it as step 5; YAML has claim adjudication; agent definitions describe the protocol. | Capture Rule 10, the checklist step, the claim adjudication YAML step, and the agent self-check instructions. | PASS if the adversarial self-check is documented, enforced in the iteration checklist, and checked in the YAML; FAIL if P0 findings can be recorded without a self-check. | If the agent definition lacks explicit Hunter/Skeptic/Referee roles, check whether the SKILL.md Rule 10 wording is sufficient to trigger the behavior implicitly. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Post-iteration claim adjudication; inspect `step_post_iteration_claim_adjudication` |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:47:| DR-008 | Iteration writes iteration-NNN.md, JSONL record, and reducer refresh | Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization. | As a manual-testing orchestrator, validate the iteration write-back contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md. Return a concise operator-facing verdict. | 1. `bash: rg -n 'iteration-{NNN}|Verify JSONL was appended|reducer refreshed' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'iteration-NNN|deep-research-state.jsonl|findings-registry.json|Reducer Contract' .opencode/skill/sk-deep-research/references/state_format.md .codex/agents/deep-research.toml` -> 3. `bash: rg -n 'step_reduce_state|reduce-state.cjs|findings-registry.json|deep-research-dashboard.md' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects. | Capture the iteration artifact, the JSONL append, and the reducer-owned refresh surfaces. | PASS if all sources require the iteration file, JSONL append, and reducer refresh together; FAIL if any source treats one of them as optional. | Use the reducer script and runtime agent write contract as the lower-level source of truth when the overview docs are concise. |
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:3:description: End-to-end fixture for the sk-deep-review blocked_stop reducer path.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:8:This fixture demonstrates the full `blocked_stop -> registry -> dashboard` reducer path for a review packet.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:13:- A complete `blocked_stop` bundle with all required `gateResults`
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:25:node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs \
.opencode/skill/sk-improve-agent/references/no_go_conditions.md:60:- `../scripts/reduce-state.cjs`
.opencode/skill/sk-improve-agent/references/loop_protocol.md:74:- Run `reduce-state.cjs`
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-progressive-synthesis-behavior-for-research-md.md:47:| DR-010 | Progressive synthesis behavior for research/research.md | Verify that `research/research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled. | As a manual-testing orchestrator, validate the progressive-synthesis contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify research/research.md is workflow-owned canonical output, that incremental updates are allowed when progressiveSynthesis is true, and that synthesis still finalizes the document. Return a concise verdict. | 1. `bash: rg -n 'progressiveSynthesis|workflow-owned|research/research.md' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/SKILL.md` -> 2. `bash: rg -n 'progressiveSynthesis|Update Research|research/research.md' .codex/agents/deep-research.toml` -> 3. `bash: rg -n 'phase_synthesis|research_output|synthesis_complete' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | The docs describe `research/research.md` as workflow-owned, `progressiveSynthesis` defaults to true, and the final synthesis phase still runs. | Capture the ownership wording, the progressive update rule, and the synthesis-phase contract together. | PASS if all sources agree that progressive updates may occur but final synthesis still owns canonical completion; FAIL if ownership of `research/research.md` is contradictory. | Use the runtime agent’s Step 7 and the README configuration table to resolve terse wording. |
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:97:## 11. ACTIVE RISKS
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl:5:{"type":"event","event":"blocked_stop","mode":"review","run":3,"blockedBy":["dimensionCoverageGate","p0ResolutionGate"],"gateResults":{"convergenceGate":{"pass":true,"score":0.15},"dimensionCoverageGate":{"pass":false,"covered":["correctness","security"],"missing":["traceability","maintainability"]},"p0ResolutionGate":{"pass":false,"activeP0":1},"evidenceDensityGate":{"pass":true,"avgEvidencePerFinding":1.5},"hotspotSaturationGate":{"pass":true}},"recoveryStrategy":"Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.","timestamp":"2026-04-11T12:45:00Z","sessionId":"rvw-blocked-stop-fixture","generation":1}

exec
/bin/zsh -lc 'rg --files . | rg "deep-review-reducer|deep-research-reducer|improve-agent.*reducer|reduce-state.*test|reduce-state.*vitest|agent-improvement|candidate-lineage|mutation-coverage"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 174ms:
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/agent-improvement-charter.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/agent-improvement-config.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/improvement/agent-improvement-strategy.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-charter.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-config.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-dashboard.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-strategy.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-charter.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-config.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-dashboard.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-strategy.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/improvement/agent-improvement-config-guardrail.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-charter.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-config.json
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-state.jsonl
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-dashboard.md
./.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/improvement/agent-improvement-strategy.md
./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs
./.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs
./.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
./.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/candidate-lineage.json
./.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/mutation-coverage.json
./.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl
./.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts
./.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md
./.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md
./.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/017-no-dimensions.md
./.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/019-plateau-detection.md
./.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/018-with-dimensions.md
./.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts
./.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    79	      // The write: field may be a scalar or a YAML list. Accept both forms
    80	      // so the reducer can evolve from single-file to multi-file writes
    81	      // without breaking the contract.
    82	      expect(
    83	        content,
    84	        `${docPath} workflow should write the findings registry`,
    85	      ).toMatch(
    86	        /write:[ \t]*(?:"[^"]*deep-review-findings-registry\.json"|\n(?:[ \t]+-[ \t]+"[^"]*"\n)*?[ \t]+-[ \t]+"[^"]*deep-review-findings-registry\.json")/,
    87	      );
    88	      expect(content, `${docPath} workflow should invoke the reducer script`).toContain(
    89	        'node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs',
    90	      );
    91	      expect(content, `${docPath} workflow should treat reducer reruns as idempotent`).toMatch(/[Ii]dempotent/);
    92	      expect(content, `${docPath} workflow should carry release readiness through synthesis`).toContain(
    93	        'releaseReadinessState',
    94	      );
    95	      // REQ-030 / REQ-034 retraction (042 closing audit, Lane 3 + Lane 5):
    96	      // the `completed-continue` lifecycle branch is now deferred, so the
    97	      // report-guidance passage no longer promises snapshot-and-reopen as a
    98	      // live runtime behavior. The assertion mirrors the retracted prose and
    99	      // still pins the "machine-owned markers" contract that the reducer
   100	      // depends on for idempotent re-runs.
   101	      expect(content, `${docPath} workflow should preserve machine-owned report markers`).toContain(
   102	        'Preserve machine-owned markers so the reducer-owned registry, dashboard, and strategy anchors can be refreshed on re-run without mutating prior synthesis.',
   103	      );
   104	      expect(content, `${docPath} workflow should document completed-continue as deferred`).toContain(
   105	        '`completed-continue` lineage branch is deferred',
   106	      );
   107	    }
   108	  });
   109	
   110	  it('documents reducer metrics and machine-owned report boundaries in the review references', () => {
   111	    const stateFormat = readWorkspaceFile('.opencode/skill/sk-deep-review/references/state_format.md');
   112	    const loopProtocol = readWorkspaceFile('.opencode/skill/sk-deep-review/references/loop_protocol.md');
   113	    const convergence = readWorkspaceFile('.opencode/skill/sk-deep-review/references/convergence.md');
   114	
   115	    expect(stateFormat).toContain('deep-review-findings-registry.json');
   116	    expect(stateFormat).toContain('releaseReadinessState');
   117	    expect(stateFormat).toContain('convergenceScore');
   118	    expect(stateFormat).toContain('review-report-v*.md');
   119	
   120	    expect(loopProtocol).toContain('latestJSONLDelta');
   121	    expect(loopProtocol).toContain('dashboardMetrics');
   122	    expect(loopProtocol).toContain('strategyUpdates');
   123	    expect(loopProtocol).toContain('completed-continue');
   124	
   125	    expect(convergence).toContain('release-blocking');
   126	    expect(convergence).toContain('converged');
   127	    expect(convergence).toContain('in-progress');
   128	  });
   129	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/SKILL.md | sed -n '280,390p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   260	
   261	  it('prefers the latest lifecycle lineage and latest active synthesis_complete stop state', () => {
   262	    const specFolder = makeFixtureSpecFolder();
   263	    writeFile(
   264	      path.join(specFolder, 'research', 'deep-research-state.jsonl'),
   265	      [
   266	        '{"type":"config","topic":"Reducer fixture topic","maxIterations":5,"convergenceThreshold":0.05,"createdAt":"2026-04-03T00:00:00Z","specFolder":"fixture"}',
   267	        '{"type":"iteration","run":1,"status":"complete","focus":"First pass","findingsCount":2,"newInfoRatio":0.8,"answeredQuestions":["Question A"],"keyQuestions":["Question A","Question B"],"sourcesQueried":["https://example.com/one"],"toolsUsed":["Read"],"timestamp":"2026-04-03T00:05:00Z","durationMs":1000}',
   268	        '{"type":"event","event":"synthesis_complete","sessionId":"session-002","stopReason":"stale-stop","totalIterations":1,"timestamp":"2026-04-03T00:06:00Z"}',
   269	        '{"type":"event","event":"resumed","sessionId":"session-003","parentSessionId":"session-002","lineageMode":"resume","generation":3,"fromIteration":2,"timestamp":"2026-04-03T00:07:00Z"}',
   270	        '{"type":"iteration","run":2,"status":"complete","focus":"Second pass","findingsCount":1,"newInfoRatio":0.2,"answeredQuestions":["Question B"],"keyQuestions":["Question B"],"sourcesQueried":["https://example.com/two"],"toolsUsed":["Read"],"timestamp":"2026-04-03T00:08:00Z","durationMs":1000}',
   271	        '{"type":"event","event":"synthesis_complete","sessionId":"session-003","stopReason":"plateau","totalIterations":2,"timestamp":"2026-04-03T00:09:00Z"}',
   272	        '',
   273	      ].join('\n'),
   274	    );
   275	
   276	    const result = reducerModule.reduceResearchState(specFolder, { write: true });
   277	    const dashboard = fs.readFileSync(result.dashboardPath, 'utf8');
   278	    const registry = JSON.parse(fs.readFileSync(result.registryPath, 'utf8')) as {
   279	      status: string;
   280	      sessionId: string;
   281	      parentSessionId: string | null;
   282	      continuedFromRun: number | null;
   283	      terminalStop: { stopReason: string | null } | null;
   284	    };
   285	
   286	    expect(registry.status).toBe('COMPLETE');
   287	    expect(registry.sessionId).toBe('session-003');
   288	    expect(registry.parentSessionId).toBe('session-002');
   289	    expect(registry.continuedFromRun).toBe(2);
   290	    expect(registry.terminalStop?.stopReason).toBe('plateau');
   291	
   292	    expect(dashboard).toContain('- Status: COMPLETE');
   293	    expect(dashboard).toContain('- Session ID: session-003');
   294	    expect(dashboard).toContain('- Parent Session: session-002');
   295	    expect(dashboard).toContain('- continuedFromRun: 2');
   296	    expect(dashboard).toContain('- stopReason: plateau');
   297	  });
   298	});

 succeeded in 0ms:
   280	
   281	Failed gates persist `blockedStop` with full gate results in the journal.
   282	
   283	### Resume/Continuation Semantics (current release)
   284	
   285	Sessions support a single lineage mode today: `new`. Every invocation of the `/improve:agent` workflow starts a fresh session with a new session id and generation 1. Multi-generation lineage modes (`resume`, `restart`, `fork`, `completed-continue`) were described in earlier drafts but have no shipped runtime wiring in the improve-agent workflow, reducer, or journal consumer.
   286	
   287	Operators who want to continue evaluating an agent after a prior session SHOULD archive the prior session folder (e.g. move `improve/` to `improve_archive/{timestamp}/`) and re-invoke the command, which starts a new `new`-mode session. The reducer treats each session independently and does not carry ancestry across sessions.
   288	
   289	If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `improve_improve-agent_{auto,confirm}.yaml`, reducer ancestry handling in `sk-improve-agent/scripts/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.
   290	
   291	### Mutation Coverage Graph
   292	
   293	**Script**: `scripts/mutation-coverage.cjs`
   294	
   295	Tracks explored dimensions, tried mutation types per dimension, and exhausted mutation sets using `loop_type: "improvement"` namespace isolation (ADR-002). The orchestrator skips mutation types already in the exhausted log.
   296	
   297	### Dimension Trajectory
   298	
   299	Trajectory data records per-iteration dimension scores. Convergence requires minimum 3 data points (ADR-003) with all dimension deltas within +/-2 across the last 3 points.
   300	
   301	### Trade-Off Detection
   302	
   303	**Script**: `scripts/trade-off-detector.cjs`
   304	
   305	Detects Pareto trade-offs: flags when improvement > +3 in one dimension causes regression < -3 in hard dimensions (structural, integration, systemFitness) or < -5 in soft dimensions (ruleCoherence, outputQuality). Blocks promotion for Pareto-dominated candidates.
   306	
   307	### Parallel Candidate Waves (Optional)
   308	
   309	**Script**: `scripts/candidate-lineage.cjs`
   310	
   311	Disabled by default (`parallelWaves.enabled: false` in config, ADR-004). When enabled, spawns 2-3 candidates with different mutation strategies. Activation requires: exploration-breadth score above threshold, 3+ unresolved mutation families, and 2 consecutive tie/plateau iterations.
   312	
   313	### Weight Optimizer (Advisory Only)
   314	
   315	**Script**: `scripts/benchmark-stability.cjs`
   316	
   317	Reads historical session data and emits a weight-recommendation report. Recommendations do NOT auto-apply (ADR-005). Requires minimum session count threshold before producing recommendations.
   318	
   319	---
   320	
   321	<!-- /ANCHOR:runtime-truth -->
   322	## Journal Wiring Contract
   323	
   324	Journal emission is orchestrator-only. The target agent being evaluated never writes journal rows directly; only the visible YAML workflow or an operator-side wrapper invokes `scripts/improvement-journal.cjs`.
   325	
   326	The CLI contract is:
   327	
   328	```bash
   329	node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit <eventType> --journal <journal_path> --details '<json>'
   330	```
   331	
   332	The helper validates event type plus `session_end` or `session_ended` details, and the CLI entrypoint stores boundary context under `details`. Top-level `iteration` and `candidateId` fields are available only through the JS API, not through the CLI wrapper used by the YAML workflows.
   333	
   334	### Boundary Points
   335	
   336	| Boundary | When It Fires | Event Types | Required Details |
   337	| --- | --- | --- | --- |
   338	| `session_start` | Once after baseline setup is recorded and before the first loop iteration begins | `session_start` | `sessionId`, `target`, `charter`, `startedAt` |
   339	| `iteration_boundary` | On every iteration after candidate generation, after candidate scoring, and after gate evaluation | `candidate_generated`, `candidate_scored`, `gate_evaluation` | Per-iteration context such as `sessionId`, `iteration`, `candidateId`, `candidatePath`, `scoreOutputPath`, `weightedScore`, and gate decision details |
   340	| `session_end` | Once after synthesis completes or the session reaches a terminal stop | `session_end` | `stopReason`, `sessionOutcome`, `endedAt`, `totalIterations` |
   341	
   342	### Frozen Helper Enums
   343	
   344	`improvement-journal.cjs` currently exports and validates the following enums:
   345	
   346	- `STOP_REASONS`: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`
   347	- `SESSION_OUTCOMES`: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`
   348	
   349	Keep session-end emissions aligned to those helper-owned values until the helper contract itself changes. Labels such as `convergedImprovement`, `benchmarkPlateau`, `rejected`, `deferred`, `blocked`, or `errored` are not accepted by the current CLI validator.
   350	
   351	### Orchestrator Ownership
   352	
   353	- Auto mode emits `session_start` after `step_record_baseline`, then emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop iteration, and finally emits `session_end` after synthesis.
   354	- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.
   355	- Operators invoking the helper manually must use the same boundary order so replay and reducer consumers see a consistent journal shape.
   356	
   357	### Reducer Consumer Side
   358	
   359	The reducer is the consumer for replay artifacts on refresh. Every `scripts/reduce-state.cjs` pass now attempts to read:
   360	
   361	- `improvement-journal.jsonl`
   362	- `candidate-lineage.json`
   363	- `mutation-coverage.json`
   364	
   365	These inputs remain optional. Missing files do not fail the reducer; the corresponding registry field is set to `null` so dashboard and registry refreshes still complete.
   366	
   367	## ADR-002: Journal Replay Consumer
   368	
   369	ADR-002 is implemented in the reducer via replay consumers instead of a separate orchestrator-only synthesis step. During each refresh pass, `scripts/reduce-state.cjs` now reads the following artifacts when present:
   370	
   371	- `improvement-journal.jsonl` to summarize last session boundaries, total replayed events, per-event counts, and terminal `stopReason` / `sessionOutcome`
   372	- `candidate-lineage.json` to summarize lineage depth, total candidate count, and the latest candidate leaf
   373	- `mutation-coverage.json` to summarize mutation coverage ratio and uncovered mutations
   374	
   375	The reducer writes these summaries into new top-level registry fields:
   376	
   377	- `journalSummary`
   378	- `candidateLineage`
   379	- `mutationCoverage`
   380	
   381	Graceful degradation is required: if any artifact is missing, unreadable, or not yet generated for the current runtime, the reducer preserves the rest of the registry and records `null` for that field instead of throwing.
   382	
   383	The dashboard now also includes a dedicated **Sample Quality** section. This separates replay/stability sample sufficiency from benchmark failures so operators can tell the difference between a true regression and an iteration that simply lacked enough data for trade-off or replay-stability trust.
   384	
   385	<!-- ANCHOR:rules -->
   386	## 5. RULES
   387	
   388	### ✅ ALWAYS
   389	
   390	- Read the charter, manifest, and target profile before creating a candidate

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/candidate-lineage.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Candidate Lineage — Track Candidate Derivation for Parallel Waves       ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	// ─────────────────────────────────────────────────────────────────────────────
     7	// 1. IMPORTS
     8	// ─────────────────────────────────────────────────────────────────────────────
     9	const fs = require('node:fs');
    10	const path = require('node:path');
    11	
    12	// ─────────────────────────────────────────────────────────────────────────────
    13	// 2. HELPERS
    14	// ─────────────────────────────────────────────────────────────────────────────
    15	
    16	function readJsonSafe(filePath) {
    17	  try {
    18	    const content = fs.readFileSync(filePath, 'utf8');
    19	    return JSON.parse(content);
    20	  } catch (_err) {
    21	    return null;
    22	  }
    23	}
    24	
    25	function writeJson(filePath, data) {
    26	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    27	  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    28	}
    29	
    30	// ─────────────────────────────────────────────────────────────────────────────
    31	// 3. LINEAGE GRAPH
    32	// ─────────────────────────────────────────────────────────────────────────────
    33	
    34	/**
    35	 * Create an empty lineage graph.
    36	 * @returns {object} Empty lineage graph structure
    37	 */
    38	function createLineageGraph() {
    39	  return {
    40	    nodes: [],
    41	    createdAt: new Date().toISOString(),
    42	    updatedAt: new Date().toISOString(),
    43	  };
    44	}
    45	
    46	/**
    47	 * Record a candidate in the lineage graph (REQ-AI-011).
    48	 * Each node stores session-id, wave-index, spawning mutation type, and parent reference.
    49	 *
    50	 * @param {string} lineagePath - Path to the lineage graph JSON file
    51	 * @param {object} candidate - { candidateId, sessionId, waveIndex, mutationType, parentCandidateId?, iteration?, scores? }
    52	 */
    53	function recordCandidate(lineagePath, candidate) {
    54	  let graph = readJsonSafe(lineagePath);
    55	  if (!graph) {
    56	    graph = createLineageGraph();
    57	  }
    58	
    59	  graph.nodes.push({
    60	    ...candidate,
    61	    parentCandidateId: candidate.parentCandidateId || null,
    62	    recordedAt: new Date().toISOString(),
    63	  });
    64	  graph.updatedAt = new Date().toISOString();
    65	
    66	  writeJson(lineagePath, graph);
    67	}
    68	
    69	/**
    70	 * Get the full lineage chain for a given candidate (REQ-AI-011).
    71	 * Traces derivation from the candidate back to the root.
    72	 *
    73	 * @param {string} lineagePath - Path to the lineage graph JSON file
    74	 * @param {string} candidateId - ID of the candidate to trace
    75	 * @returns {object[]} Array of candidate nodes from root to the target, or empty if not found
    76	 */
    77	function getLineage(lineagePath, candidateId) {
    78	  const graph = readJsonSafe(lineagePath);
    79	  if (!graph || !graph.nodes) {
    80	    return [];
    81	  }
    82	
    83	  const nodeMap = new Map();
    84	  for (const node of graph.nodes) {
    85	    nodeMap.set(node.candidateId, node);
    86	  }
    87	
    88	  // Trace from target to root
    89	  const chain = [];
    90	  let current = nodeMap.get(candidateId);
    91	
    92	  // Guard against circular references
    93	  const visited = new Set();
    94	
    95	  while (current) {
    96	    if (visited.has(current.candidateId)) {
    97	      break;
    98	    }
    99	    visited.add(current.candidateId);
   100	    chain.unshift(current);
   101	
   102	    if (!current.parentCandidateId) {
   103	      break;
   104	    }
   105	    current = nodeMap.get(current.parentCandidateId);
   106	  }
   107	
   108	  return chain;
   109	}
   110	
   111	/**
   112	 * Get all candidates for a specific wave in a session.
   113	 *
   114	 * @param {string} lineagePath - Path to the lineage graph JSON file
   115	 * @param {string} sessionId - Session ID to filter by
   116	 * @param {number} [waveIndex] - Optional wave index to filter by
   117	 * @returns {object[]} Array of matching candidate nodes
   118	 */
   119	function getCandidatesByWave(lineagePath, sessionId, waveIndex) {
   120	  const graph = readJsonSafe(lineagePath);
   121	  if (!graph || !graph.nodes) {
   122	    return [];
   123	  }
   124	
   125	  return graph.nodes.filter((node) => {
   126	    if (node.sessionId !== sessionId) {
   127	      return false;
   128	    }
   129	    if (typeof waveIndex === 'number' && node.waveIndex !== waveIndex) {
   130	      return false;
   131	    }
   132	    return true;
   133	  });
   134	}
   135	
   136	/**
   137	 * Get all root candidates (candidates with no parent).
   138	 *
   139	 * @param {string} lineagePath - Path to the lineage graph JSON file
   140	 * @returns {object[]} Array of root candidate nodes
   141	 */
   142	function getRootCandidates(lineagePath) {
   143	  const graph = readJsonSafe(lineagePath);
   144	  if (!graph || !graph.nodes) {
   145	    return [];
   146	  }
   147	
   148	  return graph.nodes.filter((node) => !node.parentCandidateId);
   149	}
   150	
   151	/**
   152	 * Get direct children of a candidate.
   153	 *
   154	 * @param {string} lineagePath - Path to the lineage graph JSON file
   155	 * @param {string} parentCandidateId - Parent candidate ID
   156	 * @returns {object[]} Array of child candidate nodes
   157	 */
   158	function getChildren(lineagePath, parentCandidateId) {
   159	  const graph = readJsonSafe(lineagePath);
   160	  if (!graph || !graph.nodes) {
   161	    return [];
   162	  }
   163	
   164	  return graph.nodes.filter(
   165	    (node) => node.parentCandidateId === parentCandidateId
   166	  );
   167	}
   168	
   169	// ─────────────────────────────────────────────────────────────────────────────
   170	// 4. EXPORTS
   171	// ─────────────────────────────────────────────────────────────────────────────
   172	
   173	module.exports = {
   174	  createLineageGraph,
   175	  recordCandidate,
   176	  getLineage,
   177	  getCandidatesByWave,
   178	  getRootCandidates,
   179	  getChildren,
   180	};

 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Mutation Coverage — Track Explored Mutations & Dimension Trajectories   ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	// ─────────────────────────────────────────────────────────────────────────────
     7	// 1. IMPORTS
     8	// ─────────────────────────────────────────────────────────────────────────────
     9	const fs = require('node:fs');
    10	const path = require('node:path');
    11	
    12	// ─────────────────────────────────────────────────────────────────────────────
    13	// 2. CONSTANTS
    14	// ─────────────────────────────────────────────────────────────────────────────
    15	
    16	/**
    17	 * Namespace for improvement loop coverage graph (ADR-002).
    18	 * Isolates from deep-research/review coverage graphs.
    19	 * @type {string}
    20	 */
    21	const LOOP_TYPE = 'improvement';
    22	
    23	/**
    24	 * Minimum data points required before convergence can be claimed (REQ-AI-007).
    25	 * Research finding: at least 3 scored evidence iterations.
    26	 * @type {number}
    27	 */
    28	const MIN_TRAJECTORY_POINTS = 3;
    29	
    30	/**
    31	 * Default stability threshold: all dimension deltas within +/- this value.
    32	 * Research finding: "stable" = 3+ scored iterations with deltas within +/-2.
    33	 * @type {number}
    34	 */
    35	const DEFAULT_STABILITY_DELTA = 2;
    36	
    37	// ─────────────────────────────────────────────────────────────────────────────
    38	// 3. HELPERS
    39	// ─────────────────────────────────────────────────────────────────────────────
    40	
    41	function readJsonSafe(filePath) {
    42	  try {
    43	    const content = fs.readFileSync(filePath, 'utf8');
    44	    return JSON.parse(content);
    45	  } catch (_err) {
    46	    return null;
    47	  }
    48	}
    49	
    50	function writeJson(filePath, data) {
    51	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    52	  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    53	}
    54	
    55	/**
    56	 * Create an empty coverage graph.
    57	 * @returns {object} Empty coverage graph structure
    58	 */
    59	function createCoverageGraph() {
    60	  return {
    61	    loopType: LOOP_TYPE,
    62	    mutations: [],
    63	    exhausted: [],
    64	    trajectory: [],
    65	    createdAt: new Date().toISOString(),
    66	    updatedAt: new Date().toISOString(),
    67	  };
    68	}
    69	
    70	// ─────────────────────────────────────────────────────────────────────────────
    71	// 4. MUTATION TRACKING
    72	// ─────────────────────────────────────────────────────────────────────────────
    73	
    74	/**
    75	 * Record a mutation attempt in the coverage graph (REQ-AI-006).
    76	 *
    77	 * @param {string} coveragePath - Path to the coverage graph JSON file
    78	 * @param {object} mutation - Mutation record: { dimension, mutationType, candidateId, iteration, outcome? }
    79	 */
    80	function recordMutation(coveragePath, mutation) {
    81	  let graph = readJsonSafe(coveragePath);
    82	  if (!graph) {
    83	    graph = createCoverageGraph();
    84	  }
    85	
    86	  graph.mutations.push({
    87	    ...mutation,
    88	    timestamp: new Date().toISOString(),
    89	  });
    90	  graph.updatedAt = new Date().toISOString();
    91	
    92	  writeJson(coveragePath, graph);
    93	}
    94	
    95	/**
    96	 * Get mutations already tried, to prevent redundant exploration (REQ-AI-009).
    97	 *
    98	 * @param {string} coveragePath - Path to the coverage graph JSON file
    99	 * @returns {object[]} Array of exhausted mutation records
   100	 */
   101	function getExhaustedMutations(coveragePath) {
   102	  const graph = readJsonSafe(coveragePath);
   103	  if (!graph) {
   104	    return [];
   105	  }
   106	  return graph.exhausted || [];
   107	}
   108	
   109	/**
   110	 * Mark a mutation type as exhausted for a given dimension (REQ-AI-009).
   111	 *
   112	 * @param {string} coveragePath - Path to the coverage graph JSON file
   113	 * @param {string} dimension - Dimension name
   114	 * @param {string} mutationType - Mutation type that has been fully explored
   115	 */
   116	function markExhausted(coveragePath, dimension, mutationType) {
   117	  let graph = readJsonSafe(coveragePath);
   118	  if (!graph) {
   119	    graph = createCoverageGraph();
   120	  }
   121	
   122	  const alreadyExhausted = (graph.exhausted || []).some(
   123	    (e) => e.dimension === dimension && e.mutationType === mutationType
   124	  );
   125	
   126	  if (!alreadyExhausted) {
   127	    graph.exhausted.push({
   128	      dimension,
   129	      mutationType,
   130	      exhaustedAt: new Date().toISOString(),
   131	    });
   132	  }
   133	
   134	  graph.updatedAt = new Date().toISOString();
   135	  writeJson(coveragePath, graph);
   136	}
   137	
   138	/**
   139	 * Get coverage statistics per dimension (REQ-AI-006).
   140	 *
   141	 * @param {string} coveragePath - Path to the coverage graph JSON file
   142	 * @returns {object} Coverage stats: { dimensions: { [dim]: { tried: string[], exhausted: string[], triedCount, exhaustedCount } } }
   143	 */
   144	function getMutationCoverage(coveragePath) {
   145	  const graph = readJsonSafe(coveragePath);
   146	  if (!graph) {
   147	    return { dimensions: {} };
   148	  }
   149	
   150	  const dimensions = {};
   151	
   152	  for (const mutation of graph.mutations || []) {
   153	    const dim = mutation.dimension || 'unknown';
   154	    if (!dimensions[dim]) {
   155	      dimensions[dim] = { tried: new Set(), exhausted: new Set() };
   156	    }
   157	    dimensions[dim].tried.add(mutation.mutationType);
   158	  }
   159	
   160	  for (const exhaust of graph.exhausted || []) {
   161	    const dim = exhaust.dimension || 'unknown';
   162	    if (!dimensions[dim]) {
   163	      dimensions[dim] = { tried: new Set(), exhausted: new Set() };
   164	    }
   165	    dimensions[dim].exhausted.add(exhaust.mutationType);
   166	  }
   167	
   168	  // Convert Sets to arrays for JSON serialization
   169	  const result = {};
   170	  for (const [dim, data] of Object.entries(dimensions)) {
   171	    result[dim] = {
   172	      tried: [...data.tried],
   173	      exhausted: [...data.exhausted],
   174	      triedCount: data.tried.size,
   175	      exhaustedCount: data.exhausted.size,
   176	    };
   177	  }
   178	
   179	  return { dimensions: result };
   180	}
   181	
   182	// ─────────────────────────────────────────────────────────────────────────────
   183	// 5. DIMENSION TRAJECTORY
   184	// ─────────────────────────────────────────────────────────────────────────────
   185	
   186	/**
   187	 * Record a trajectory data point with per-dimension scores (REQ-AI-007).
   188	 *
   189	 * @param {string} coveragePath - Path to the coverage graph JSON file
   190	 * @param {object} dataPoint - { iteration, scores: { structural, ruleCoherence, integration, outputQuality, systemFitness }, weightedScore?, gateResults? }
   191	 */
   192	function recordTrajectory(coveragePath, dataPoint) {
   193	  let graph = readJsonSafe(coveragePath);
   194	  if (!graph) {
   195	    graph = createCoverageGraph();
   196	  }
   197	
   198	  graph.trajectory.push({
   199	    ...dataPoint,
   200	    timestamp: new Date().toISOString(),
   201	  });
   202	  graph.updatedAt = new Date().toISOString();
   203	
   204	  writeJson(coveragePath, graph);
   205	}
   206	
   207	/**
   208	 * Get the full trajectory from the coverage graph.
   209	 *
   210	 * @param {string} coveragePath - Path to the coverage graph JSON file
   211	 * @returns {object[]} Array of trajectory data points
   212	 */
   213	function getTrajectory(coveragePath) {
   214	  const graph = readJsonSafe(coveragePath);
   215	  if (!graph) {
   216	    return [];
   217	  }
   218	  return graph.trajectory || [];
   219	}
   220	
   221	/**
   222	 * Check if convergence can be claimed based on trajectory data (REQ-AI-007).
   223	 * Research finding: "stable" = 3+ scored iterations with all dimension deltas within +/-2.
   224	 *
   225	 * @param {string} coveragePath - Path to the coverage graph JSON file
   226	 * @param {object} [options] - { minDataPoints?, stabilityDelta? }
   227	 * @returns {{ canConverge: boolean, reason: string, dataPoints: number }}
   228	 */
   229	function checkConvergenceEligibility(coveragePath, options) {
   230	  const opts = {
   231	    minDataPoints: MIN_TRAJECTORY_POINTS,
   232	    stabilityDelta: DEFAULT_STABILITY_DELTA,
   233	    ...options,
   234	  };
   235	
   236	  const trajectory = getTrajectory(coveragePath);
   237	
   238	  if (trajectory.length < opts.minDataPoints) {
   239	    return {
   240	      canConverge: false,
   241	      reason: `Insufficient data points: ${trajectory.length} < ${opts.minDataPoints}`,
   242	      dataPoints: trajectory.length,
   243	    };
   244	  }
   245	
   246	  // Check if the last minDataPoints entries are stable
   247	  const recent = trajectory.slice(-opts.minDataPoints);
   248	  const dimensions = ['structural', 'ruleCoherence', 'integration', 'outputQuality', 'systemFitness'];
   249	  const unstableDimensions = [];
   250	
   251	  for (const dim of dimensions) {
   252	    const scores = recent.map((p) => (p.scores && p.scores[dim]) || 0);
   253	    const maxScore = Math.max(...scores);
   254	    const minScore = Math.min(...scores);
   255	    if (maxScore - minScore > opts.stabilityDelta) {
   256	      unstableDimensions.push(dim);
   257	    }
   258	  }
   259	
   260	  if (unstableDimensions.length > 0) {

 succeeded in 0ms:
     1	{
     2	  "nodes": [
     3	    {
     4	      "id": "candidate-0",
     5	      "parentId": null,
     6	      "score": 7.0,
     7	      "dimensions": {
     8	        "correctness": 0.8,
     9	        "efficiency": 0.6
    10	      }
    11	    },
    12	    {
    13	      "id": "candidate-1",
    14	      "parentId": "candidate-0",
    15	      "score": 7.2,
    16	      "dimensions": {
    17	        "correctness": 0.82,
    18	        "efficiency": 0.61
    19	      }
    20	    },
    21	    {
    22	      "id": "candidate-2",
    23	      "parentId": "candidate-1",
    24	      "score": 7.1,
    25	      "dimensions": {
    26	        "correctness": 0.8,
    27	        "efficiency": 0.62
    28	      }
    29	    }
    30	  ],
    31	  "edges": [
    32	    {
    33	      "from": "candidate-0",
    34	      "to": "candidate-1",
    35	      "mutation": "prompt-tighten"
    36	    },
    37	    {
    38	      "from": "candidate-1",
    39	      "to": "candidate-2",
    40	      "mutation": "weight-rebalance"
    41	    }
    42	  ]
    43	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/mutation-coverage.json | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "nodes": [
     3	    {
     4	      "id": "m-1",
     5	      "kind": "mutation",
     6	      "label": "prompt-tighten"
     7	    },
     8	    {
     9	      "id": "m-2",
    10	      "kind": "mutation",
    11	      "label": "weight-rebalance"
    12	    }
    13	  ],
    14	  "edges": [],
    15	  "metrics": {
    16	    "coverageRatio": 0.33,
    17	    "uncoveredMutations": 4,
    18	    "sessionId": "imp-low-sample-fixture",
    19	    "loopType": "improvement"
    20	  }
    21	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '892,918p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   892	# Task Group: Agent-Orchestration Packet 028 Deep-Research/Deep-Review Contract Hardening
   893	scope: 90-iteration synthesis docs and phase-level contract hardening for `028-auto-deep-research-review-improvement` packets
   894	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research-review-improvement; reuse_rule=reuse for packet 028 research/review closeout in this checkout, with packet-local docs/changelogs and strict validation evidence
   895	
   896	## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
   897	
   898	### rollout_summary_files
   899	
   900	- rollout_summaries/2026-04-03T06-52-50-dog7-deep_research_90_iter_external_wave.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T08-52-50-019d521d-afbc-7da0-817d-675090a19d1f.jsonl, updated_at=2026-04-03T08:23:39+00:00, thread_id=019d521d-afbc-7da0-817d-675090a19d1f)
   901	
   902	### keywords
   903	
   904	- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
   905	
   906	## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success
   907	
   908	### rollout_summary_files
   909	
   910	- rollout_summaries/2026-04-03T08-52-11-1f0W-deep_research_phase1_100pct.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-52-11-019d528a-f2bc-7053-9269-e85eded82c3e.jsonl, updated_at=2026-04-03T09:49:06+00:00, thread_id=019d528a-f2bc-7053-9269-e85eded82c3e)
   911	
   912	### keywords
   913	
   914	- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md
   915	
   916	## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success
   917	
   918	### rollout_summary_files

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '916,946p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   916	## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success
   917	
   918	### rollout_summary_files
   919	
   920	- rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-53-06-019d528b-cc68-77b3-9b4d-8b5dc37b791e.jsonl, updated_at=2026-04-03T09:42:20+00:00, thread_id=019d528b-cc68-77b3-9b4d-8b5dc37b791e)
   921	
   922	### keywords
   923	
   924	- deep-review-reducer-schema.vitest.ts, release-blocking, .deep-review-pause, scratch/changelog, create:changelog gated
   925	
   926	## User preferences
   927	
   928	- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
   929	- when the user asked to “run /create:changelog ... in the phase folder used,” place changelog files under packet-local `scratch/changelog/` and include files-changed scope [Task 2][Task 3]
   930	- when the user added “also include files changed in it,” changelog drafts should list full touched-file scope rather than short samples [Task 2][Task 3]
   931	
   932	## Reusable knowledge
   933	
   934	- wave labeling that proved useful: 061-070 (Auto-Deep-Research-main portability/handoff), 071-080 (AutoAgent-main capability gating/workflow generation), 081-090 (autoresearch-master small mutable surface discipline) [Task 1]
   935	- packet 028 closeout now expects parity across docs/assets/workflows/runtime mirrors/helper scripts/tests, plus strict validation and parser checks before marking tasks complete [Task 2][Task 3]
   936	- `/create:changelog` may be write-agent gated in this repo; manual fallback is acceptable when documented and kept in the active phase folder [Task 3]
   937	
   938	## Failures and how to do differently
   939	
   940	- symptom: deep-review reducer-schema tests fail during closeout; cause: config metadata drift (`metrics` missing, `.deep-review-pause` mutability mismatch); fix: align config/docs with test schema before rerunning suites [Task 3]
   941	- symptom: recommendation docs drift from requested basis; cause: docs written from partial wave context; fix: verify ledger count/`synthesis_complete` and explicitly tie recommendations to the full 90-iteration synthesis [Task 1]
   942	
   943	
   944	# Task Group: System-Spec-Kit Packet 023/024 Deep Review, Validation, and Doc/Changelog Parity
   945	scope: deep-review closure, strict-validation remediation, changelog truth-sync, and README/recovery-contract doc parity for packet 023/024 work
   946	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for packet 023/024 review and documentation parity in this checkout, but keep packet-local scope and validate from the correct package roots

exec
/bin/zsh -lc "rg -n \"function formatBlockedByList|formatBlockedByList\\(\" .opencode/skill/sk-deep-review/scripts/reduce-state.cjs && nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '560,625p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
1075:        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
   560	
   561	  return covered;
   562	}
   563	
   564	function buildFindingsBySeverity(openFindings) {
   565	  const counts = zeroSeverityMap();
   566	  for (const finding of openFindings) {
   567	    if (SEVERITY_KEYS.includes(finding.severity)) {
   568	      counts[finding.severity] += 1;
   569	    }
   570	  }
   571	  return counts;
   572	}
   573	
   574	function computeConvergenceScore(iterationRecords) {
   575	  const latest = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   576	  if (!latest) {
   577	    return 0;
   578	  }
   579	  return (
   580	    latest?.convergenceSignals?.compositeStop
   581	    ?? (typeof latest?.newFindingsRatio === 'number' ? 1 - latest.newFindingsRatio : 0)
   582	    ?? 0
   583	  );
   584	}
   585	
   586	function computeGraphConvergenceScore(signals) {
   587	  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
   588	    return 0;
   589	  }
   590	
   591	  const namedScore = signals.score
   592	    ?? signals.convergenceScore
   593	    ?? signals.compositeScore
   594	    ?? signals.stopScore
   595	    ?? signals.decisionScore;
   596	  if (typeof namedScore === 'number' && Number.isFinite(namedScore)) {
   597	    return namedScore;
   598	  }
   599	
   600	  const numericSignals = Object.values(signals)
   601	    .filter((value) => typeof value === 'number' && Number.isFinite(value));
   602	  if (!numericSignals.length) {
   603	    return 0;
   604	  }
   605	
   606	  const sum = numericSignals.reduce((total, value) => total + value, 0);
   607	  return sum / numericSignals.length;
   608	}
   609	
   610	function buildGraphConvergenceRollup(records) {
   611	  const latest = records
   612	    .filter((record) => record?.type === 'event' && record?.event === 'graph_convergence')
   613	    .at(-1);
   614	
   615	  if (!latest) {
   616	    return {
   617	      score: 0,
   618	      decision: null,
   619	      blockers: [],
   620	    };
   621	  }
   622	
   623	  return {
   624	    score: computeGraphConvergenceScore(latest.signals),
   625	    decision: normalizeText(latest.decision || '') || null,

exec
/bin/zsh -lc 'rg -n "formatBlockedByList" .opencode/skill/sk-deep-review/scripts/reduce-state.cjs -A4 -B4' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
1071-        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
1072-      }
1073-      const latestBlockedStop = registry.blockedStopHistory?.at(-1);
1074-      if (latestBlockedStop && Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0) {
1075:        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
1076-      }
1077-      if (severity.P2 > 0 && lines.length === 0) {
1078-        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
1079-      }

exec
/bin/zsh -lc 'rg -n "function formatBlockedByList|const formatBlockedByList|formatBlockedByList =" .opencode/skill/sk-deep-review/scripts/reduce-state.cjs .opencode/skill/sk-deep-research/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:369:function formatBlockedByList(blockedBy) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '340,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	  };
   341	}
   342	
   343	function deriveDashboardStatus(config, iterationRecords, eventRecords, terminalStop) {
   344	  if (terminalStop) {
   345	    return 'COMPLETE';
   346	  }
   347	
   348	  const latestStuckRecovery = eventRecords.filter((record) => record.event === 'stuckRecovery').at(-1);
   349	  const latestIterationTimestamp = getTimestampValue(iterationRecords.at(-1)?.timestamp);
   350	  const latestRecoveryTimestamp = getTimestampValue(latestStuckRecovery?.timestamp);
   351	  if (latestRecoveryTimestamp >= latestIterationTimestamp && latestRecoveryTimestamp > Number.NEGATIVE_INFINITY) {
   352	    return 'STUCK_RECOVERY';
   353	  }
   354	
   355	  if (iterationRecords.at(-1)?.status === 'stuck') {
   356	    return 'STUCK_RECOVERY';
   357	  }
   358	
   359	  const rawStatus = String(config.status || 'initialized').toLowerCase();
   360	  if (rawStatus === 'running') {
   361	    return 'ITERATING';
   362	  }
   363	  if (rawStatus === 'complete' || rawStatus === 'completed') {
   364	    return 'COMPLETE';
   365	  }
   366	  return rawStatus.toUpperCase();
   367	}
   368	
   369	function formatBlockedByList(blockedBy) {
   370	  return Array.isArray(blockedBy) && blockedBy.length
   371	    ? blockedBy.join(', ')
   372	    : 'unspecified gates';
   373	}
   374	
   375	function formatSummaryValue(value) {
   376	  if (Array.isArray(value)) {
   377	    return value.map((entry) => formatSummaryValue(entry)).join(', ');
   378	  }
   379	
   380	  if (value && typeof value === 'object') {
   381	    return Object.keys(value)
   382	      .sort()
   383	      .map((key) => `${key}=${formatSummaryValue(value[key])}`)
   384	      .join(', ');
   385	  }
   386	
   387	  return String(value);
   388	}
   389	
   390	function summarizeGateResults(gateResults) {
   391	  if (!gateResults || typeof gateResults !== 'object' || !Object.keys(gateResults).length) {
   392	    return 'none recorded';
   393	  }
   394	
   395	  return Object.keys(gateResults)
   396	    .sort()
   397	    .map((gateName) => {
   398	      const result = gateResults[gateName];
   399	      if (!result || typeof result !== 'object') {
   400	        return `${gateName}=${formatSummaryValue(result)}`;
   401	      }
   402	
   403	      const status = typeof result.pass === 'boolean'
   404	        ? (result.pass ? 'pass' : 'fail')
   405	        : 'unknown';
   406	      const details = Object.keys(result)
   407	        .filter((key) => key !== 'pass' && result[key] !== undefined && result[key] !== null && result[key] !== '')
   408	        .sort()
   409	        .map((key) => `${key}=${formatSummaryValue(result[key])}`);
   410	
   411	      return details.length
   412	        ? `${gateName}=${status} (${details.join(', ')})`
   413	        : `${gateName}=${status}`;
   414	    })
   415	    .join('; ');
   416	}
   417	
   418	function formatGraphBlocker(blocker) {
   419	  if (!blocker || typeof blocker !== 'object') {
   420	    return formatSummaryValue(blocker);

exec
/bin/zsh -lc "rg -n \"coverage ratio|uncovered mutations|mutation coverage\" .opencode/skill/sk-improve-agent -g '*.md' -g '*.json'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-improve-agent/SKILL.md:373:- `mutation-coverage.json` to summarize mutation coverage ratio and uncovered mutations
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:38:| 06 End-to-End Loop | 5 | Full pipeline, any-agent support, mutation coverage, trade-offs, lineage |
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md:9:Validates that the improvement loop maintains a mutation coverage graph with `loop_type: "improvement"` namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations.
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md:13:- Prompt: `As a manual-testing orchestrator, validate that the improvement loop maintains a mutation coverage graph with loop_type: "improvement" namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md:28:- Dashboard reflects mutation coverage state per dimension

codex
I’ve got one concrete regression candidate already: the deep-review reducer calls `formatBlockedByList(...)` in `ACTIVE RISKS`, but that helper is not defined in that file. I’m doing a final syntax-level sweep and one more contract cross-check before I lock the report.
exec
/bin/zsh -lc 'node -c .opencode/skill/sk-deep-review/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'node -c .opencode/skill/sk-deep-research/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 succeeded in 0ms:
exec
/bin/zsh -lc 'node -c .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "rg -n \"blendedScore\" .opencode/skill/sk-deep-review .opencode/skill/system-spec-kit -g '*.md' -g '*.ts' -g '*.yaml'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:49:  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:199:      '{"type":"event","event":"graph_convergence","decision":"STOP_BLOCKED","signals":{"blendedScore":0.41},"blockers":[{"signal":"contradictionDensity","severity":"high"}],"timestamp":"2026-04-11T00:06:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:218:      '{"type":"event","event":"graph_convergence","decision":"STOP_BLOCKED","signals":{"blendedScore":0.33},"blockers":[{"signal":"questionCoverage","severity":"medium"}],"timestamp":"2026-04-11T00:06:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:219:      '{"type":"event","event":"graph_convergence","decision":"STOP_ALLOWED","signals":{"blendedScore":0.92},"blockers":[],"timestamp":"2026-04-11T00:07:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:250:    // relying on synthetic `blendedScore` aliases. This test seeds the exact
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:261:    // The reducer reads signals.score ?? signals.blendedScore ?? 0, so it
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:21:    blendedScore: number;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:172:    expect(result.blendedScore).toBe(result.graphScore);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:188:    expect(result.blendedScore).toBeGreaterThanOrEqual(result.graphScore);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:189:    expect(result.blendedScore).toBeLessThanOrEqual(0.8);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:69:  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:414:      expect(result.blendedScore).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:415:      expect(result.blendedScore).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:428:      expect(withPhase1.blendedScore).toBeGreaterThanOrEqual(withoutPhase1.graphScore * 0.5);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:508:      expect(convergence).toHaveProperty('blendedScore');
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:44:    blendedScore: number;
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:136:    blendedScore: round3((compositeStop * 0.6) + (graphScore * 0.4)),
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:250:      expect(cjsConvergence.blendedScore).toBe(tsEquivalentBlend.blendedScore);

codex
**Findings**
`F-021-001` | Severity `P1` | Dimension `correctness` | File [sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1138)  
Title: Corruption handling still writes machine-owned outputs before failing.  
Description: The reducer now detects corrupt JSONL and throws in non-lenient mode, but it does so only after writing the registry, strategy, and dashboard. That means a corrupted state log can still mutate reducer-owned artifacts before the failure is surfaced.  
Evidence: Corruption is parsed at [line 1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1114), outputs are written at [lines 1138-1143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1138), and the throw happens only at [lines 1146-1147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1146).  
Recommendation: Gate the write block behind the corruption check, or throw immediately when corruption is detected unless `lenient` is set.

`F-021-002` | Severity `P1` | Dimension `correctness` | File [sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1075)  
Title: `ACTIVE RISKS` blocked-stop path calls an undefined helper.  
Description: The new `ACTIVE RISKS` rendering path calls `formatBlockedByList(...)`, but that helper is not defined anywhere in the deep-review reducer. Any packet with a `blocked_stop` entry will hit a `ReferenceError` while rendering the dashboard.  
Evidence: The call site is at [line 1075](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1075). No definition exists in this file. The equivalent helper does exist in the research reducer at [sk-deep-research/scripts/reduce-state.cjs:369-372](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:369).  
Recommendation: Add a local `formatBlockedByList` helper or inline the joined-string logic already used elsewhere in the dashboard.

`F-021-003` | Severity `P1` | Dimension `correctness` | File [sk-deep-research/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:857)  
Title: Research reducer does not actually fail closed for API callers on corruption.  
Description: The reducer advertises fail-closed corruption handling, but the function only writes a warning to stderr and returns a normal result object. Only the CLI wrapper converts `hasCorruption` into a non-zero exit. Any JS caller of `reduceResearchState()` will still receive success and written outputs from corrupt input.  
Evidence: The non-lenient corruption branch at [lines 857-867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:857) only logs; the function still returns at [lines 869-880](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:869). The actual process failure is deferred to the CLI-only path at [lines 900-918](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:900).  
Recommendation: Throw a structured corruption error from `reduceResearchState()` itself before returning or writing, matching the deep-review API contract.

**Original Status**
- Deep-review `synthesis_complete` parsing: `FIXED` in [sk-deep-review/scripts/reduce-state.cjs:369-405](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:369).
- Deep-review lineage persistence: `FIXED` in [sk-deep-review/scripts/reduce-state.cjs:340-367](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:340) and [1115-1121](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1115).
- Deep-review claim-adjudication `finalSeverity` handling: `FIXED` in [310-337](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:310) and [441-480](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:441).
- Deep-review stale STOP veto guard: `FIXED` in [392-397](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:392).
- Deep-review fail-closed corruption: `PARTIAL` because detection exists, but writes still happen before failure at [1138-1147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1138).
- Deep-review `ACTIVE RISKS` object rendering: `REGRESSED` because the new blocked-stop rendering path now calls an undefined helper at [1073-1075](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1073).
- Deep-research `synthesis_complete` consumption: `FIXED` in [308-340](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:308).
- Deep-research lineage persistence: `FIXED` in [264-305](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:264) and [828-837](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:828).
- Deep-research graph convergence `blendedScore` fallback: `FIXED` in [221-244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:221).
- Improve-agent schema alignment: `FIXED` in [173-239](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173) and [241-268](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:241).
- Improve-agent mutation-coverage derivation: `FIXED` in [343-377](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:343).
- Improve-agent new dashboard sections: `FIXED` in [870-939](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:870) and [941-999](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:941).

**Verdict**
FIX VALIDATION SUMMARY: `10 FIXED`, `1 PARTIAL`, `0 OPEN`, `1 REGRESSED`.

NEW FINDINGS: `2` new P1s (`F-021-002`, `F-021-003`).

CONFIDENCE: `medium`. This is based on direct code inspection, contract/test cross-checks, and `node -c` syntax validation on all three reducers. I did not execute the reducers against live fixtures in this sandbox.

RELEASE READINESS: `not shippable yet`. Most targeted fixes landed, but the remaining correctness issues are release-blocking for reducer trust: deep-review still mutates outputs before failing on corruption, deep-review can crash on blocked-stop `ACTIVE RISKS`, and deep-research still does not fail closed for programmatic callers.


hook: Stop
hook: Stop Completed
tokens used
131,892
**Findings**
`F-021-001` | Severity `P1` | Dimension `correctness` | File [sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1138)  
Title: Corruption handling still writes machine-owned outputs before failing.  
Description: The reducer now detects corrupt JSONL and throws in non-lenient mode, but it does so only after writing the registry, strategy, and dashboard. That means a corrupted state log can still mutate reducer-owned artifacts before the failure is surfaced.  
Evidence: Corruption is parsed at [line 1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1114), outputs are written at [lines 1138-1143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1138), and the throw happens only at [lines 1146-1147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1146).  
Recommendation: Gate the write block behind the corruption check, or throw immediately when corruption is detected unless `lenient` is set.

`F-021-002` | Severity `P1` | Dimension `correctness` | File [sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1075)  
Title: `ACTIVE RISKS` blocked-stop path calls an undefined helper.  
Description: The new `ACTIVE RISKS` rendering path calls `formatBlockedByList(...)`, but that helper is not defined anywhere in the deep-review reducer. Any packet with a `blocked_stop` entry will hit a `ReferenceError` while rendering the dashboard.  
Evidence: The call site is at [line 1075](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1075). No definition exists in this file. The equivalent helper does exist in the research reducer at [sk-deep-research/scripts/reduce-state.cjs:369-372](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:369).  
Recommendation: Add a local `formatBlockedByList` helper or inline the joined-string logic already used elsewhere in the dashboard.

`F-021-003` | Severity `P1` | Dimension `correctness` | File [sk-deep-research/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:857)  
Title: Research reducer does not actually fail closed for API callers on corruption.  
Description: The reducer advertises fail-closed corruption handling, but the function only writes a warning to stderr and returns a normal result object. Only the CLI wrapper converts `hasCorruption` into a non-zero exit. Any JS caller of `reduceResearchState()` will still receive success and written outputs from corrupt input.  
Evidence: The non-lenient corruption branch at [lines 857-867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:857) only logs; the function still returns at [lines 869-880](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:869). The actual process failure is deferred to the CLI-only path at [lines 900-918](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:900).  
Recommendation: Throw a structured corruption error from `reduceResearchState()` itself before returning or writing, matching the deep-review API contract.

**Original Status**
- Deep-review `synthesis_complete` parsing: `FIXED` in [sk-deep-review/scripts/reduce-state.cjs:369-405](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:369).
- Deep-review lineage persistence: `FIXED` in [sk-deep-review/scripts/reduce-state.cjs:340-367](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:340) and [1115-1121](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1115).
- Deep-review claim-adjudication `finalSeverity` handling: `FIXED` in [310-337](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:310) and [441-480](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:441).
- Deep-review stale STOP veto guard: `FIXED` in [392-397](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:392).
- Deep-review fail-closed corruption: `PARTIAL` because detection exists, but writes still happen before failure at [1138-1147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1138).
- Deep-review `ACTIVE RISKS` object rendering: `REGRESSED` because the new blocked-stop rendering path now calls an undefined helper at [1073-1075](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1073).
- Deep-research `synthesis_complete` consumption: `FIXED` in [308-340](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:308).
- Deep-research lineage persistence: `FIXED` in [264-305](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:264) and [828-837](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:828).
- Deep-research graph convergence `blendedScore` fallback: `FIXED` in [221-244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:221).
- Improve-agent schema alignment: `FIXED` in [173-239](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173) and [241-268](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:241).
- Improve-agent mutation-coverage derivation: `FIXED` in [343-377](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:343).
- Improve-agent new dashboard sections: `FIXED` in [870-939](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:870) and [941-999](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:941).

**Verdict**
FIX VALIDATION SUMMARY: `10 FIXED`, `1 PARTIAL`, `0 OPEN`, `1 REGRESSED`.

NEW FINDINGS: `2` new P1s (`F-021-002`, `F-021-003`).

CONFIDENCE: `medium`. This is based on direct code inspection, contract/test cross-checks, and `node -c` syntax validation on all three reducers. I did not execute the reducers against live fixtures in this sandbox.

RELEASE READINESS: `not shippable yet`. Most targeted fixes landed, but the remaining correctness issues are release-blocking for reducer trust: deep-review still mutates outputs before failing on corruption, deep-review can crash on blocked-stop `ACTIVE RISKS`, and deep-research still does not fail closed for programmatic callers.
