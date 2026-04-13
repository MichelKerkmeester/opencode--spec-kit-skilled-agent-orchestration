---
iteration: 11
dimension: traceability
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T10:21:59Z
completedAt: 2026-04-12T10:26:42Z
---

# Deep Review Iteration 011 — traceability

**Focus:** Phase 005-006 decision records and implementation summaries: cross-reference 005-agent-improver-deep-loop-alignment/ and 006-graph-testing-and-playbook-alignment/ spec docs against changelog entries in .opencode/changelog/15--sk-improve-agent/ and actual test file existence.

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
session id: 019d8136-6825-7c40-ad4b-8526494be883
--------
user
You are a senior code reviewer executing iteration 11 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: traceability
FOCUS: Phase 005-006 decision records and implementation summaries: cross-reference 005-agent-improver-deep-loop-alignment/ and 006-graph-testing-and-playbook-alignment/ spec docs against changelog entries in .opencode/changelog/15--sk-improve-agent/ and actual test file existence.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for traceability issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-011-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: traceability
   - File: exact file path
   - Line: line number(s) if applicable
   - Title: brief descriptive title
   - Description: detailed explanation of the issue
   - Evidence: relevant code snippet or reference
   - Recommendation: specific fix or improvement

4. After listing all findings, provide:
   - ITERATION SUMMARY: total findings, breakdown by severity
   - COVERAGE ASSESSMENT: what percentage of the focus area was reviewed
   - CONFIDENCE: your confidence in the completeness of this iteration (low/medium/high)
   - NEXT PRIORITIES: what should the next iteration examine that you could not cover

Be thorough and precise. Cite exact file paths and line numbers. Do not report findings that require subjective style preferences — focus on functional correctness, security, traceability, and maintainability risks.

Prior session context: A previous 10-iteration review (rvw-2026-04-11T13-50-06Z) found 16 findings (0 P0 / 10 P1 / 6 P2) with CONDITIONAL verdict. That review led to a 5-lane remediation (REQ-026 through REQ-034). This session validates the remediation AND examines areas not previously covered.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a findings-first deep review pass on traceability for phase `005-006`, focused on whether the spec docs, implementation summaries, changelog entries, and claimed tests all line up with reality. I’ll start by loading any relevant prior context, route through the review skill guidance, then read the target spec and changelog files carefully before I check the referenced tests against the actual tree.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|005-agent-improver-deep-loop-alignment|006-graph-testing-and-playbook-alignment|15--sk-improve-agent" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "deep review iteration 11 traceability for 042-sk-deep-research-review-improvement-2 focusing on 005-agent-improver-deep-loop-alignment and 006-graph-testing-and-playbook-alignment, changelog parity, test file existence" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 553ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-P0YaoY6a' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-research(explicit), deep(name), iteration, loop, research(name)"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), iteration, loop, quality"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), review(name)"
  }
]

codex
Skill routing pointed strongly at `sk-deep-review` and `sk-code-review`, which matches your request, so I’m using those review workflows for this pass. The quick memory scan didn’t surface a directly relevant prior note for this exact packet/focus area, so I’m moving to primary evidence in the repo itself.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code-opencode, sk-code-web, and sk-code-full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code-review` and paired with one `sk-code-*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
- A workflow dispatches `@review` for pre-commit or gate validation.
- A user requests security/correctness risk analysis before merge.
- A user wants severity-ranked findings with file:line evidence.

### Keyword Triggers

`review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `request changes`, `findings`, `blocking issues`, `merge readiness`

### Use Cases

1. Review-only pass: findings-first output with no code edits.
2. Gate validation: score + pass/fail recommendation for orchestrated workflows.
3. Focused risk pass: security, concurrency, correctness, or removal-focused review.

### When NOT to Use

- Feature implementation without review intent.
- Pure documentation editing where code behavior is not being assessed.
- Git-only workflow tasks (branching, rebasing, commit hygiene) without code-quality evaluation intent.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Primary Detection Signal

Review behavior follows a baseline+overlay model:

- Baseline (always): `sk-code` (implemented by this skill: `sk-code-review`)
- Overlay (exactly one `sk-code-*`):
  - OpenCode system context -> `sk-code-opencode`
  - Frontend/web context -> `sk-code-web`
  - Default/other stacks -> `sk-code-full-stack`

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect `sk-code` baseline + one `sk-code-*` overlay
    +- STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
    +- Phase 1: Scope and baseline checks
    +- Phase 2: Overlay alignment
    +- Phase 3: Findings-first analysis
    +- Phase 4: Output contract and next action
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies weighted intent scoring.

Knowledge is organized by domain mapping:

```text
references/review_core.md
references/review_ux_single_pass.md
references/*_checklist.md
assets/review/...
```

- `references/review_core.md` for shared doctrine consumed by both `@review` and `@deep-review`.
- `references/review_ux_single_pass.md` for interactive single-pass review behavior.
- `references/` for baseline review flow, severity contracts, and risk checklists.
- `assets/` for optional reusable templates/checklists (if present in this skill).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | `references/review_core.md`, `references/review_ux_single_pass.md`, `references/security_checklist.md`, `references/code_quality_checklist.md` |
| CONDITIONAL | Intent score indicates need | `references/solid_checklist.md`, `references/code_quality_checklist.md`, `references/removal_plan.md`, `references/test_quality_checklist.md` |
| ON_DEMAND | Explicit deep-dive request | Full mapped reference set |

### Precedence Matrix

| Rule Type | Source of Truth | Behavior |
| --- | --- | --- |
| Security/correctness minimums | `sk-code` baseline (`sk-code-review`) | Always enforced; never relaxed by overlay |
| Stack style/process conventions | Overlay skill | Overlay guidance overrides baseline generic style/process advice |
| Verification/build/test commands | Overlay skill | Overlay commands are authoritative for the detected stack |
| Ambiguous conflicts | Escalation | Ask for clarification; do not guess |

### Unknown Fallback Checklist

If intent/stack detection is unclear, request:

1. Review target scope (full diff, staged files, commit range, or explicit file list).
2. Primary risk class (security, correctness, performance, maintainability).
3. Architecture lens priority (KISS/DRY/SOLID strict or optional).
4. Stack/context (OpenCode system code, web/frontend, or other/full-stack).
5. Desired output mode (findings-only or findings + gated fix follow-up).

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# Discover resources recursively across references and assets.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCES = [
    "references/review_core.md",
    "references/review_ux_single_pass.md",
    "references/security_checklist.md",
    "references/code_quality_checklist.md",
]

INTENT_SIGNALS = {
    "SECURITY": {"weight": 5, "keywords": ["security", "auth", "injection", "vulnerability", "race"]},
    "QUALITY": {"weight": 4, "keywords": ["correctness", "bug", "regression", "performance", "boundary", "contract", "breaking change", "backward compatible", "compatibility"]},
    "KISS": {"weight": 3, "keywords": ["kiss", "simple", "simplicity", "over-engineer", "overengineering"]},
    "DRY": {"weight": 3, "keywords": ["dry", "duplication", "duplicate", "copy-paste", "repeated logic"]},
    "SOLID": {"weight": 3, "keywords": ["solid", "architecture", "design", "coupling", "cohesion", "module", "adapter", "interface", "abstraction", "responsibility", "dependency", "boundary"]},
    "REMOVAL": {"weight": 3, "keywords": ["remove", "dead code", "cleanup", "deprecate"]},
    "TESTING": {"weight": 3, "keywords": ["test", "tests", "testing", "coverage", "assertion", "mock", "stub", "fixture", "test quality", "brittle"]},
}

RESOURCE_MAP = {
    "SECURITY": ["references/security_checklist.md"],
    "QUALITY": ["references/code_quality_checklist.md"],
    "KISS": ["references/code_quality_checklist.md"],
    "DRY": ["references/code_quality_checklist.md"],
    "SOLID": ["references/solid_checklist.md"],
    "REMOVAL": ["references/removal_plan.md"],
    "TESTING": ["references/test_quality_checklist.md"],
}

ON_DEMAND_KEYWORDS = ["deep review", "full review", "all checks", "comprehensive"]
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm review scope (diff/staged/files/commit range)",
    "Confirm risk priority (security/correctness/performance/maintainability/test quality/contract safety)",
    "Confirm architecture lens (KISS/DRY/SOLID required or optional)",
    "Confirm stack context (opencode/web/full-stack)",
    "Confirm findings-only vs findings+fix follow-up",
]


def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "description", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()


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
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
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
        return ["QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]


def detect_overlay_skill(task, workspace_files=None, changed_files=None) -> str:
    text = _task_text(task)
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if "opencode" in text or ".opencode/" in files or "jsonc" in text or "mcp" in text:
        return "sk-code-opencode"
    if any(term in text for term in ["frontend", "web", "css", "dom", "browser", "webflow"]) or any(
        marker in files for marker in ["next.config", "vite.config", "package.json", "src/"]
    ):
        return "sk-code-web"
    return "sk-code-full-stack"


def route_review_resources(task, workspace_files=None, changed_files=None):
    inventory = discover_markdown_resources()
    text = _task_text(task)

exec
/bin/zsh -lc "rg --files | rg '042-sk-deep-research-review-improvement-2|15--sk-improve-agent|AGENTS\\.md"'$|CLAUDE'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 202ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-016.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-002.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-012.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-003.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-013.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-007.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-017.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-008.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-018.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-019.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/research.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-config.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/findings-registry.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md
.opencode/changelog/15--sk-improve-agent/v1.0.0.0.md
.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md
.opencode/changelog/15--sk-improve-agent/v1.0.1.0.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/AGENTS.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/desktop/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-github/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/app/e2e/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/opencode/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/app/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/opencode/test/AGENTS.md
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/desktop-electron/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md

codex
I’ve loaded the deep-review and code-review contracts and located the exact phase folders and changelog bundle. Next I’m reading the packet docs and changelog side by side, then I’ll verify every claimed test artifact against the real filesystem so any traceability gaps are evidence-backed rather than inferred.
exec
/bin/zsh -lc "sed -n '1,220p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/decision-record.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Decision Record: Agent-Improver Deep-Loop Alignment [005]"
     3	description: "Consolidated decision record preserving the five accepted architectural choices from the improve-agent runtime-truth alignment."
     4	trigger_phrases:
     5	  - "005"
     6	  - "agent improver ADR"
     7	  - "sk-improve-agent decision record"
     8	importance_tier: "important"
     9	contextType: "implementation"
    10	---
    11	# Decision Record: Agent-Improver Deep-Loop Alignment
    12	
    13	<!-- SPECKIT_LEVEL: 3 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
    15	
    16	---
    17	
    18	<!-- ANCHOR:adr-001 -->
    19	## ADR-001: Consolidated Runtime-Truth Alignment Decisions
    20	
    21	### Metadata
    22	
    23	| Field | Value |
    24	|-------|-------|
    25	| **Status** | Accepted |
    26	| **Date** | 2026-04-10 |
    27	| **Deciders** | michelkerkmeester-barter |
    28	| **Superseded Guidance** | Lifecycle wording later narrowed by `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md` |
    29	
    30	### Context
    31	
    32	Phase 005 introduced runtime-truth infrastructure for the improve-agent loop. The original packet spread the rationale across five ADRs. This closeout packet keeps those decisions intact but consolidates them under one template-compliant decision header so the packet validates cleanly while still preserving the substantive reasoning.
    33	
    34	### Decision
    35	
    36	The accepted decision set for Phase 005 is:
    37	
    38	#### Decision Set 1: Keep journal emission in the orchestrator
    39	
    40	- **Why**: the proposal agent stays side-effect free, preserving the evaluator-first model.
    41	- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` explicitly states the orchestrator-only constraint is preserved.
    42	
    43	#### Decision Set 2: Reuse graph-style coverage tracking for improve-agent
    44	
    45	- **Why**: improvement sessions needed explainable coverage without inventing an entirely separate persistence model.
    46	- **Evidence**: `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` plus the `v1.1.0.0` release note describe the improvement-scoped mutation coverage graph.
    47	
    48	#### Decision Set 3: Treat trajectory as a first-class convergence input
    49	
    50	- **Why**: absolute scores alone can hide instability or short-lived spikes; trajectory data makes convergence more explainable.
    51	- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` and the runtime-truth playbook scenarios document dimension trajectory as a visible operator surface.
    52	
    53	#### Decision Set 4: Keep parallel candidates opt-in
    54	
    55	- **Why**: branching candidate exploration increases complexity and should not become the default path for every improve-agent run.
    56	- **Evidence**: `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md`
    57	
    58	#### Decision Set 5: Preserve backward compatibility through additive config defaults
    59	
    60	- **Why**: the improve-agent runtime already existed in active use, so new runtime-truth fields had to remain additive.
    61	- **Evidence**: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` states backward compatibility was verified; the later `v1.2.1.0` patch shows wording could still be corrected without reopening the runtime surface.
    62	
    63	### Alternatives Considered
    64	
    65	| Option | Pros | Cons | Outcome |
    66	|--------|------|------|---------|
    67	| Orchestrator-owned journal, additive helpers, optional parallel mode | Preserves existing evaluator-first model; keeps runtime changes additive | More moving parts across scripts and docs | Chosen |
    68	| Let the target agent own journal writes | Simpler local event emission | Violates proposal-only boundary | Rejected |
    69	| Keep improve-agent on a simpler non-graph path | Less implementation work | Leaves the loop opaque and misaligned with 042 runtime-truth goals | Rejected |
    70	| Make parallel candidates the default | Broader exploration by default | Higher cost and complexity on every run | Rejected |
    71	| Use hardcoded static target-profile wording as the durable contract | Easy to document | Drifted from later dynamic-mode positioning and would age poorly | Rejected for closeout wording |
    72	
    73	### Consequences
    74	
    75	**Positive**
    76	
    77	- The phase shipped auditable helper modules instead of undocumented ad hoc logic.
    78	- The packet can now point to current `sk-improve-agent` paths without losing the architectural rationale.
    79	- The closeout can acknowledge later lifecycle wording corrections without invalidating the Phase 005 runtime delivery.
    80	
    81	**Tradeoffs**
    82	
    83	- Historical release text still exists and needed careful interpretation during closeout.
    84	- The current packet has to distinguish between what Phase 005 shipped and what later follow-on releases narrowed or renamed.
    85	
    86	### Verification
    87	
    88	- [x] The five accepted decisions remain represented in this packet. `[EVIDENCE: decision sets 1-5 above]`
    89	- [x] The packet uses one template-compliant ADR header instead of multiple custom top-level ADR headers. `[EVIDENCE: this file; strict validation]`
    90	- [x] Later lifecycle wording drift is acknowledged rather than silently repeated. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`
    91	
    92	### Rollback
    93	
    94	If future packet curation needs the original ADR breakdown, the detailed historical wording remains recoverable from git history and the preserved scratch research file. This closeout record intentionally optimizes for current template compliance and accurate historical framing.
    95	<!-- /ANCHOR:adr-001 -->

 succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work. Memory saves use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for DB indexing, embedding generation, and `description.json` refresh. AI may directly edit `_memory.continuity` frontmatter blocks in spec docs for session continuity updates, but must NEVER manually author standalone packet continuity artifacts under `memory/`.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **Code Search Decision Tree** (MANDATORY):
  - Semantic/concept search → `mcp__cocoindex_code__search` (CocoIndex). Skill: `.opencode/skill/mcp-coco-index/`
  - Structural queries (callers, imports, deps) → `code_graph_query` (Code Graph)
  - Exact text/regex → `Grep`

**GIT WORKFLOW:** 
Full details: `.opencode/skill/sk-git/`
- Worktree setup, conventional commits, PR creation, branch management
- Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | Semantic/concept → `CocoIndex search` · Structural (callers/imports/deps) → `code_graph_query` · Exact text → `Grep` · File paths → `Glob` · Read contents → `Read` |
| **Resume prior work**     | `/spec_kit:resume` → Rebuild context from `handover.md` → `_memory.continuity` → canonical spec docs → Review checklist → Continue |
| **Save context**          | Continuity-only `_memory.continuity` updates may be edited directly in canonical spec docs; use `/memory:save` or `generate-context.js --json '<data>' [spec-folder]` for indexed saves |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify                            |
| **Web code**              | sk-code-web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → `create.sh --phase` → Populate → Plan first child  |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init state → Loop (@deep-research iterations) → Convergence → Synthesize → Memory save                            |
| **Deep review**           | `/spec_kit:deep-review` → Init state → Loop (@deep-review iterations) → Convergence → Synthesize → Memory save                                |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                            |
| **Constitutional memory** | `/memory:learn` → Constitutional memory manager: create, list, edit, remove, budget                                               |
| **Shared memory**         | `/memory:manage shared` → Shared-memory lifecycle: create spaces, manage memberships, inspect rollout                                    |

## Context Recovery

These recovery steps are universal across Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI.

### After Context Compaction Or `/clear`

1. **FIRST ACTION** — use `/spec_kit:resume` as the canonical recovery surface
2. Rebuild prior work in this order: `handover.md` → `_memory.continuity` → canonical spec docs (`implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`)
3. Use `memory_context()` or `memory_search()` only when those packet-local continuity sources do not answer the question
4. Re-read the active runtime-specific instructions if they exist (`CODEX.md`, `GEMINI.md`, `.claude/CLAUDE.md`, runtime agent docs)
5. Present a concise recovered summary and WAIT for confirmation before proceeding

### Coding Analysis Lenses 

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

#### GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT] BLOCK
Trigger: EACH new user message (re-evaluate even in ongoing conversations)
1. Call `memory_match_triggers(prompt)` → Surface relevant context
2. Classify intent: Research or Implementation
3. Parse request → Check confidence AND uncertainty (see §4)
4. **Dual-threshold:** confidence ≥ 0.70 AND uncertainty ≤ 0.35 → PROCEED. Either fails → INVESTIGATE (max 3 iterations) → ESCALATE. Simple: <40% ASK | 40-69% CAUTION | ≥70% PASS

> Gate 1 is SOFT — if file modification detected, Gate 3 (HARD) takes precedence. Ask spec folder question BEFORE analysis.

####  GATE 2: SKILL ROUTING [REQUIRED for non-trivial tasks]
1. A) Run: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "[request]" --threshold 0.8`
2. B) Cite user's explicit direction: "User specified: [exact quote]"
- Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed
- Output: `SKILL ROUTING: [result]` or `SKILL ROUTING: User directed → [name]`
- Skip: trivial queries only (greetings, single-line questions)

#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK — PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Triggers:** rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase — or any task resulting in file changes
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **DO NOT** use Read/Edit/Write/Bash (except Gate Actions) before asking. ASK FIRST, wait for response, THEN proceed
- **Phase boundary:** Gate 3 answers apply ONLY within current workflow phase. Plan→implement transition MUST re-evaluate. Exception: carry-over IS valid for Memory Save Rule

#### CONSOLIDATED QUESTION PROTOCOL
When multiple inputs are needed, consolidate into a SINGLE prompt — never split across messages. Include only applicable questions; omit when pre-determined.
- **Round-trip optimization** — Only 1 user interaction needed for setup
- **First Message Protocol** — ALL questions asked BEFORE any analysis or tool calls
- **Violation:** Multiple separate prompts → STOP, apologize, re-present as single prompt
- **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading; Level 1 tasks skip completion verification

---

### 🔒 POST-EXECUTION RULES

#### MEMORY SAVE RULE [HARD] BLOCK
Trigger: "save context", "save memory", `/memory:save`, continuity support artifact refresh
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Script:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - Use this for DB indexing, embedding generation, and `description.json` refresh. AI may directly edit `_memory.continuity` frontmatter blocks in spec docs when only the doc-local continuity hints need updating.
  - AI composes structured JSON with session context, writes to `/tmp/save-context-data.json`, passes as first arg. Alternatively use `--json '<inline-json>'` or `--stdin`. The AI has strictly better information about its own session than any DB extraction.
  - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents)
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()`
- **Violation:** Manually authored standalone continuity support artifact under `memory/` → DELETE and re-run via script
- **Post-Save Review:** After `generate-context.js` completes, check the POST-SAVE QUALITY REVIEW output.
  - **HIGH** issues: MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)
  - **MEDIUM** issues: patch when practical
  - **PASSED/SKIPPED**: no action needed

#### COMPLETION VERIFICATION RULE [HARD] BLOCK
Trigger: Claiming "done", "complete", "finished", "works"
1. Validation runs automatically on spec folder (if exists)
2. Load `checklist.md` → Verify ALL items → Mark `[x]` with evidence
- Skip: Level 1 tasks (no checklist.md required) | Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix)

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT

#### Self-Check (before ANY tool-using response):
- [ ] File modification? Asked spec folder question?
- [ ] Skill routing verified?
- [ ] Saving indexed memory? Using `generate-context.js` and avoiding standalone `memory/` files?
- [ ] Aligned with ORIGINAL request? No scope drift?
- [ ] Claiming completion? `checklist.md` verified?

---

## 3. 📝 CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details:** system-spec-kit SKILL.md (§1 When to Use, §3 How it Works, §4 Rules)

### Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500           | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

> **Note:** `implementation-summary.md` is REQUIRED for all levels but created **after implementation completes**, not at spec folder creation time. See SKILL.md §4 Rule 13.

**Rules:** When in doubt → higher level. LOC is soft guidance (risk/complexity can override). Single typo/whitespace fixes (<5 characters in one file) are exempt.

**Spec folder path:** `specs/[###-short-name]/` | **Templates:** `.opencode/skill/system-spec-kit/templates/`

**For details on:** folder structure, `scratch/` vs `memory/` usage, sub-folder versioning, checklist verification (P0/P1/P2), and completion workflow — see system-spec-kit SKILL.md §3.

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

**Core Principle:** If confidence < 80%, pause and ask for clarification with multiple-choice options.

| Confidence   | Action                                       |
| ------------ | -------------------------------------------- |
| **≥80%**     | Proceed with citable source                  |
| **40-79%**   | Proceed with caveats                         |
| **<40%**     | Ask for clarification or mark "UNKNOWN"      |
| **Override** | Blockers/conflicts → ask regardless of score |

**Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?"

**Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step.

---


exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/decision-record.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/decision-record.md: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Implementation Summary: Agent-Improver Deep-Loop Alignment [005]"
     3	description: "Completed implementation summary for the improve-agent runtime-truth alignment phase, grounded in the landing commit, release note, and current runtime paths."
     4	trigger_phrases:
     5	  - "005"
     6	  - "agent improver implementation summary"
     7	  - "sk-improve-agent implementation summary"
     8	importance_tier: "normal"
     9	contextType: "implementation"
    10	---
    11	# Implementation Summary: Agent-Improver Deep-Loop Alignment
    12	
    13	<!-- SPECKIT_LEVEL: 3 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
    15	
    16	---
    17	
    18	<!-- ANCHOR:metadata -->
    19	## Metadata
    20	
    21	| Field | Value |
    22	|-------|-------|
    23	| **Spec Folder** | 005-agent-improver-deep-loop-alignment |
    24	| **Completed** | 2026-04-11 |
    25	| **Level** | 3 |
    26	| **Landing Commit** | `080cf549e` |
    27	| **Primary Release Note** | `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` |
    28	| **Follow-on Correction** | `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md` |
    29	<!-- /ANCHOR:metadata -->
    30	
    31	---
    32	
    33	<!-- ANCHOR:what-built -->
    34	## What Was Built
    35	
    36	Phase 005 brought the improve-agent loop into the same runtime-truth family as the deeper research and review loops. The work landed five helper modules, dedicated tests, supporting playbook scenarios, and command plus skill documentation updates so improve-agent sessions could be audited, reasoned about, and explained with concrete artifacts instead of opaque reducer-only summaries.
    37	
    38	### Stop-Reason Taxonomy and Audit Journal
    39	
    40	The phase added `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` and published the surrounding runtime-truth contract through `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/command/improve/agent.md`, and `.opencode/agent/improve-agent.md`. The journal gave the loop an append-only event stream and kept the write path outside the proposal agent so the evaluator-first model stayed intact.
    41	
    42	### Mutation Coverage and Trade-Off Detection
    43	
    44	The phase added `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` and `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`. Together they made the loop explainable: maintainers could see which dimensions and mutation types had already been explored, and they could detect when a candidate improved one dimension by regressing another.
    45	
    46	### Optional Parallel Candidate Waves
    47	
    48	The phase added `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs` plus supporting playbook scenarios. That let the loop track optional branch exploration without turning parallelism into the mandatory default path.
    49	
    50	### Stability Scoring and Advisory Optimization
    51	
    52	The phase added `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` so repeated benchmark behavior could be measured instead of assumed. The same helper family also exposed advisory optimizer-facing outputs, which later phases refined further rather than replacing.
    53	<!-- /ANCHOR:what-built -->
    54	
    55	---
    56	
    57	<!-- ANCHOR:how-delivered -->
    58	## How It Was Delivered
    59	
    60	The implementation landed in commit `080cf549e`, which records the five helper scripts, the five dedicated test files, and the asset plus command updates. The shipped outcome was then documented in `v1.1.0.0`, which records:
    61	
    62	- the runtime-truth helper surface
    63	- the improve-agent rename completion
    64	- the 31/31 manual playbook pass
    65	- the 10,335-test Vitest result recorded at ship time
    66	
    67	Later on the packet family corrected one important documentation drift: `v1.2.1.0` explicitly retracted a multi-session lifecycle contract that had been documented but not actually wired. This closeout packet reflects that later correction so Phase 005 is recorded as shipped without silently preserving superseded lifecycle claims.
    68	<!-- /ANCHOR:how-delivered -->
    69	
    70	---
    71	
    72	<!-- ANCHOR:decisions -->
    73	## Key Decisions
    74	
    75	| Decision | Why |
    76	|----------|-----|
    77	| Journal writes stay orchestrator-owned | Preserves the proposal-only target-agent boundary while still recording session lifecycle evidence. |
    78	| Coverage tracking is part of improve-agent runtime truth | Makes the loop explainable instead of opaque. |
    79	| Trajectory and trade-off analysis belong in the shipped loop | Prevents aggregate scores from hiding unstable or regressive improvements. |
    80	| Parallel candidates stay opt-in | Keeps advanced exploration available without forcing extra complexity into every run. |
    81	| New runtime-truth settings remain additive | Protects existing improve-agent usage while allowing the runtime surface to grow. |
    82	<!-- /ANCHOR:decisions -->
    83	
    84	---
    85	
    86	<!-- ANCHOR:verification -->
    87	## Verification
    88	
    89	| Check | Result |
    90	|-------|--------|
    91	| `improvement-journal.vitest.ts` exists | PASS |
    92	| `mutation-coverage.vitest.ts` exists | PASS |
    93	| `trade-off-detector.vitest.ts` exists | PASS |
    94	| `candidate-lineage.vitest.ts` exists | PASS |
    95	| `benchmark-stability.vitest.ts` exists | PASS |
    96	| Runtime-truth playbook category `07--runtime-truth/` exists | PASS |
    97	| End-to-end playbook scenarios `022-024` exist | PASS |
    98	| Landing release note recorded shipped verification | PASS |
    99	| Phase packet strict validation | PASS |
   100	
   101	Verification evidence for the shipped runtime lives in `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`. Verification evidence for the later lifecycle wording correction lives in `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md`.
   102	<!-- /ANCHOR:verification -->
   103	
   104	---
   105	
   106	<!-- ANCHOR:limitations -->
   107	## Known Limitations
   108	
   109	1. The historical phase slug still uses `agent-improver`, while the live runtime surface is now `sk-improve-agent`.
   110	2. `v1.1.0.0` documented broader lifecycle semantics than the runtime actually shipped; `v1.2.1.0` later narrowed that wording to current reality.
   111	3. This closeout pass documents shipped evidence and packet validity; it does not re-run the original Phase 005 runtime implementation work.
   112	<!-- /ANCHOR:limitations -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Implementation Summary: Graph Testing and Playbook Alignment [042.006]"
     3	description: "This phase records the delivered graph verification surface: dedicated integration and stress suites, graph-specific manual playbooks, and README updates that expose the graph runtime to operators."
     4	trigger_phrases:
     5	  - "042.006"
     6	  - "graph testing implementation summary"
     7	importance_tier: "important"
     8	contextType: "implementation-summary"
     9	---
    10	# Implementation Summary: Graph Testing and Playbook Alignment
    11	
    12	<!-- SPECKIT_LEVEL: 2 -->
    13	<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
    14	
    15	---
    16	
    17	<!-- ANCHOR:metadata -->
    18	## Metadata
    19	
    20	| Field | Value |
    21	|-------|-------|
    22	| **Spec Folder** | 006-graph-testing-and-playbook-alignment |
    23	| **Completed** | 2026-04-10 |
    24	| **Level** | 2 |
    25	<!-- /ANCHOR:metadata -->
    26	
    27	---
    28	
    29	<!-- ANCHOR:what-built -->
    30	## What Was Built
    31	
    32	This phase gave the coverage-graph runtime the verification layer it needed after the Phase 002 runtime landed. You can now find dedicated automated suites for graph contract alignment and larger-graph stress coverage, plus graph-specific manual playbook scenarios across the research, review, and improve-agent loop families.
    33	
    34	### Verification Surface
    35	
    36	| File | Action | Purpose |
    37	|------|--------|---------|
    38	| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Created | Verifies cross-layer graph contract alignment |
    39	| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` | Created | Exercises larger graph workloads and contradiction scanning |
    40	| Research graph playbooks | Created | Add operator scenarios for graph convergence and `graphEvents` emission |
    41	| Review graph playbooks | Created | Add operator scenarios for graph convergence and `graphEvents` emission |
    42	| Improve-agent graph playbooks | Created | Add operator scenarios for mutation coverage, trade-off detection, and candidate lineage |
    43	| Three skill READMEs | Modified | Surface graph capability coverage where it was previously missing |
    44	<!-- /ANCHOR:what-built -->
    45	
    46	---
    47	
    48	<!-- ANCHOR:how-delivered -->
    49	## How It Was Delivered
    50	
    51	The work followed the verification surface itself. First, the CommonJS and TypeScript graph layers were identified as the two sides of the contract that needed automated coverage. Then the graph-specific playbook files were located and confirmed under the live skill trees. Finally, the packet was rebuilt in the current Level 2 template so the delivered verification surface, README alignment, and phase-closeout evidence all live in one place.
    52	<!-- /ANCHOR:how-delivered -->
    53	
    54	---
    55	
    56	<!-- ANCHOR:decisions -->
    57	## Key Decisions
    58	
    59	| Decision | Why |
    60	|----------|-----|
    61	| Keep Phase 006 verification-only | The graph runtime already existed; this phase needed to prove and document it rather than widen scope into new graph features. |
    62	| Cite the live playbook files directly | Those paths are the operator-facing verification surface and should stay obvious in the packet. |
    63	| Treat README updates as part of the verification surface | Graph capability coverage is incomplete if operators cannot discover it in the skill docs. |
    64	<!-- /ANCHOR:decisions -->
    65	
    66	---
    67	
    68	<!-- ANCHOR:verification -->
    69	## Verification
    70	
    71	| Check | Result |
    72	|-------|--------|
    73	| Graph integration suite present | PASS - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` |
    74	| Graph stress suite present | PASS - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` |
    75	| Research graph playbooks present | PASS - `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` and `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md` |
    76	| Review graph playbooks present | PASS - `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` and `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md` |
    77	| Improve-agent graph playbooks present | PASS - `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`, and `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md` |
    78	| README graph references captured | PASS - `.opencode/skill/sk-deep-research/README.md`, `.opencode/skill/sk-deep-review/README.md`, and `.opencode/skill/sk-improve-agent/README.md` cited in the packet |
    79	| Strict phase validation | PASS after packet rewrite |
    80	<!-- /ANCHOR:verification -->
    81	
    82	---
    83	
    84	<!-- ANCHOR:limitations -->
    85	## Known Limitations
    86	
    87	1. **This packet records the delivered verification surface, not the original test-command output.** It is meant to preserve closeout truth, not replay the original implementation session verbatim.
    88	2. **If later phases move playbook or README paths, this packet will need another documentation pass.** The paths cited here match the delivered state captured by Phase 006.
    89	<!-- /ANCHOR:limitations -->

exec
/bin/zsh -lc 'for f in .opencode/changelog/15--sk-improve-agent/*.md; do echo "===== $f"; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/changelog/15--sk-improve-agent/v1.0.0.0.md
     1	# v1.0.0.0
     2	
     3	> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)
     4	
     5	---
     6	
     7	## [**1.0.0.0**] - 2026-04-04
     8	
     9	Initial release of `sk-improve-agent` -- an evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, deterministic benchmarks, and guarded promotion. The skill evaluates any agent across its full system integration surface rather than just checking keyword presence in the markdown file. Developed across 8 phases under spec folder `041-sk-recursive-agent-loop`, originally as `sk-recursive-agent` and renamed in Phase 008.
    10	
    11	> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop` (Level 2, 8 phases)
    12	
    13	---
    14	
    15	## Evaluator-First Architecture (Phase 001-002)
    16	
    17	---
    18	
    19	### Proposal-Only Improvement Loop
    20	
    21	The skill writes candidates to packet-local runtime areas instead of editing canonical agent files directly. Each candidate is scored independently by a deterministic evaluator, benchmarked against target-specific fixture sets, and tracked in an append-only JSONL ledger. Promotion to the canonical target requires passing all evidence gates plus explicit operator approval.
    22	
    23	---
    24	
    25	### Target Profiles and Benchmarks
    26	
    27	Two target agents are supported with static profiles: `handover` (promotion-eligible) and `context-prime` (candidate-only). Each profile defines its own scoring rubric, fixture directory, aggregate score threshold, and repeatability tolerance. The benchmark runner (`run-benchmark.cjs`) scores fixture outputs against required headings, required patterns, and forbidden patterns.
    28	
    29	---
    30	
    31	### Guarded Promotion and Rollback
    32	
    33	Canonical mutation requires a `candidate-better` score, passing benchmark report, repeatability evidence, manifest boundary compliance, and explicit approval. Rollback restores the archived pre-promotion backup and records a post-rollback comparison for audit continuity.
    34	
    35	---
    36	
    37	## 5-Dimension Holistic Evaluation (Phase 008)
    38	
    39	---
    40	
    41	### Integration Scanner
    42	
    43	The `scan-integration.cjs` script discovers every surface an agent touches across the repo: canonical definition, 3 runtime mirrors (Claude, Codex, .agents), command dispatch references, YAML workflow references, skill mentions, global doc references, and skill advisor routing entries. Mirror sync is detected by signal-string matching against the canonical body.
    44	
    45	---
    46	
    47	### Dynamic Profile Generator
    48	
    49	The `generate-profile.cjs` script derives a scoring profile from any agent's own structure -- parsing YAML frontmatter, ALWAYS/NEVER/ESCALATE IF rules, output verification checklist, capability scan, anti-patterns, and related resources. This eliminates the need for manually created profiles and makes any agent in `.opencode/agent/` a valid evaluation target.
    50	
    51	---
    52	
    53	### 5-Dimension Scoring Framework
    54	
    55	The refactored `score-candidate.cjs` scores candidates across 5 weighted dimensions when invoked with `--dynamic`:
    56	
    57	| Dimension | Weight | What It Measures |
    58	| --- | --- | --- |
    59	| Structural Integrity | 0.20 | Agent template compliance (required sections) |
    60	| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
    61	| Integration Consistency | 0.25 | Mirror sync, command coverage, skill references |
    62	| Output Quality | 0.15 | Output verification items present, no placeholders |
    63	| System Fitness | 0.15 | Permission-capability alignment, resource references valid |
    64	
    65	Legacy `--profile` mode with hardcoded keyword checks remains available and backward compatible.
    66	
    67	---
    68	
    69	### Dimensional Progress Tracking
    70	
    71	The refactored `reduce-state.cjs` tracks per-dimension scores across iterations, renders a Dimensional Progress table in the dashboard, and detects when all dimensions plateau (3+ identical scores) to trigger an automatic stop condition.
    72	
    73	---
    74	
    75	## Documentation and Packaging (Phases 003-007)
    76	
    77	---
    78	
    79	### sk-doc Alignment
    80	
    81	All skill documentation surfaces (SKILL.md, README.md, 11 references, 4 markdown assets, command, agent) follow sk-doc template standards with retrieval anchors, frontmatter, section dividers, and HVR-compliant language.
    82	
    83	---
    84	
    85	### Runtime Parity
    86	
    87	The `@agent-improver` agent and `/improve:agent` command are mirrored across all 5 runtimes (OpenCode, Claude, Codex, .agents, Gemini). The integration scanner checks mirror parity automatically.
    88	
    89	---
    90	
    91	### Manual Testing Playbook
    92	
    93	A 21-scenario testing playbook covers 6 categories: integration scanner, profile generator, 5D scorer, benchmark integration, reducer dimensions, and end-to-end loop. Each scenario has copy-pasteable commands and verification one-liners.
    94	
    95	---
    96	
    97	## Skill Rename (Phase 008)
    98	
    99	Renamed from `sk-recursive-agent` to `sk-improve-agent` across 187+ files and 1129+ occurrences. Command moved from `/spec_kit:recursive-agent` to `/improve:agent`. Agent renamed from `@recursive-agent` to `@agent-improver`. Zero stale references remaining (verified by fresh sub-agent audit).
   100	
   101	---
   102	
   103	## Files Changed
   104	
   105	| File | Action | Description |
   106	| --- | --- | --- |
   107	| `.opencode/skill/sk-improve-agent/` | Created | Skill package: SKILL.md, README.md, 11 references, 6 assets, 8 scripts, 22 playbook files |
   108	| `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` | Created | Integration surface scanner |
   109	| `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs` | Created | Dynamic target profile generator |
   110	| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Modified | Added 5-dimension framework + `--dynamic` flag |
   111	| `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` | Modified | Added `--integration-report` flag |
   112	| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Modified | Added dimensional tracking + plateau stop |
   113	| `.opencode/agent/agent-improver.md` | Created | Canonical agent with v1.1.1 frontmatter |
   114	| `.opencode/command/improve/agent.md` | Created | Full command with Phase 0, Setup, violations |
   115	| `.opencode/command/improve/assets/improve_agent-improver_*.yaml` | Created | Auto + confirm YAML workflows |
   116	| `.opencode/command/improve/README.txt` | Created | Command group index |
   117	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/` | Created | 21 test scenarios across 6 categories |
   118	
   119	---
   120	
   121	## Upgrade
   122	
   123	No migration required. This is the initial release. If you have existing `sk-recursive-agent` references in custom scripts or memory files, update them to `sk-improve-agent`.
===== .opencode/changelog/15--sk-improve-agent/v1.0.1.0.md
     1	# v1.0.1.0
     2	
     3	> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)
     4	
     5	---
     6	
     7	## [**1.0.1.0**] - 2026-04-04
     8	
     9	Self-test, bug fixes, reducer improvements, and skill advisor routing sync for `sk-improve-agent`. Phase 009 ran the improvement loop on the agent-improver's own definition and found a real bug (stale command path). Phase 010 fixed that bug plus 4 reducer issues and promoted the best candidate improvements. Phase 011 updated the skill advisor routing and README documentation.
    10	
    11	> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop` (Phases 009-011)
    12	
    13	---
    14	
    15	## What Changed
    16	
    17	- **Self-test completed** (Phase 009): Ran `/improve:agent` targeting `agent-improver.md` itself. 3 iterations, baseline 99→100, all 5 dimensions converged at 100. First real end-to-end validation of the skill on its own agent.
    18	- **Stale command path fixed** (Phase 010): Canonical agent-improver.md had `/improve:agent-improver` pointing to a nonexistent file. Fixed to `/improve:agent` → `.opencode/command/improve/agent.md`. Synced to all 4 mirrors.
    19	- **Reducer family fix** (Phase 010): `inferFamily()` no longer hardcodes `session-handover` for every profile. Agent-improver now shows its own name in the dashboard.
    20	- **Configurable plateau window** (Phase 010): Plateau detector reads `stopRules.plateauWindow` from config (default 3). Short runs can now use a window of 2.
    21	- **Accepted counting fix** (Phase 010): Dashboard now counts `candidate-acceptable` and `candidate-better` recommendations as accepted (previously always showed 0).
    22	- **Candidate improvements promoted** (Phase 010): Halt condition for missing inputs, merged checklists, checkbox self-validation, 4th anti-pattern, scan report provenance note, summary box label update.
    23	- **Skill advisor routing** (Phase 011): Added 7 INTENT_BOOSTERS, 13 PHRASE_INTENT_BOOSTERS, 8 COMMAND_BRIDGES for 5D scoring, integration scanning, dynamic profiling, and all `/improve:` + `/create:` slash commands.
    24	- **README updates** (Phase 011): Skill README bumped to v1.0.0.0. Root README added Context-Prime and Agent-Improver to Agent Network, rewrote Improve Agent command description. 5 command README.txt files fixed.
    25	- **Gemini mirror fix**: Canonical path reference corrected from `.agents/agents/*.md` to `.gemini/agents/*.md`.
    26	
    27	---
    28	
    29	## Files Changed
    30	
    31	| File | Action | Description |
    32	| --- | --- | --- |
    33	| `.opencode/agent/agent-improver.md` | Modified | Fixed command path, promoted candidate improvements (halt condition, merged checklists, 4th anti-pattern) |
    34	| `.claude/agents/agent-improver.md` | Modified | Mirror sync |
    35	| `.agents/agents/agent-improver.md` | Modified | Mirror sync |
    36	| `.codex/agents/agent-improver.toml` | Modified | Mirror sync, wording fix |
    37	| `.gemini/agents/agent-improver.md` | Modified | Mirror sync, path reference fix |
    38	| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Modified | Family derivation, configurable plateau window, accepted counting |
    39	| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Modified | Added `plateauWindow` field |
    40	| `.opencode/skill/sk-improve-agent/assets/improvement_config_reference.md` | Modified | Documented `plateauWindow` |
    41	| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modified | Phase 008+ routing entries + COMMAND_BRIDGES |
    42	| `.opencode/skill/README.md` | Modified | Version bump to 1.0.0.0 |
    43	| `README.md` | Modified | Added Context-Prime and Agent-Improver agents, rewrote Improve commands |
    44	| `.opencode/command/README.txt` | Modified | Added improve group, fixed command counts |
    45	| `.opencode/command/spec_kit/README.txt` | Modified | Added deep-review command |
    46	| `.opencode/command/create/README.txt` | Modified | Removed prompt (moved to improve), added changelog |
    47	
    48	---
    49	
    50	## Upgrade
    51	
    52	No migration required. The `plateauWindow` config field defaults to 3 (same as the previous hardcoded value). Existing runtime configs without the field continue working identically.
===== .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md
     1	## [**1.1.0.0**] - 2026-04-11
     2	
     3	This release lands the 042 Phase 5 "agent-improver deep-loop alignment" work plus the `sk-agent-improver → sk-improve-agent` rename. The improver now has its own frozen stop-reason taxonomy, append-only audit journal, mutation coverage graph with trade-off detection, directed candidate lineage, and benchmark stability scoring — aligning its runtime truth model with `sk-deep-research` and `sk-deep-review`. The proposal-only agent constraint is preserved: all new journaling happens orchestrator-side, never from the improver itself.
     4	
     5	---
     6	
     7	### Skill Rename: sk-agent-improver → sk-improve-agent
     8	
     9	- The skill and its sibling `sk-prompt-improver → sk-improve-prompt` were renamed to the verb-first `improve:*` convention used by the other `/improve:*` slash commands.
    10	- Every playbook scenario, agent mirror, command doc, YAML workflow, asset, and reference path was updated. Legacy `sk-agent-improver` paths are fully removed from live surfaces.
    11	- The `/improve:agent` command continues to drive the loop; no operator-facing command changed.
    12	
    13	---
    14	
    15	### Stop-Reason Taxonomy and Audit Journal
    16	
    17	- Frozen `STOP_REASONS` enum published alongside a `SESSION_OUTCOMES` enum so improvement sessions report the exact gate that tripped (`convergedImprovement`, `benchmarkPlateau`, `rejectCandidate`, `blockedStop`, `maxIterationsReached`, `rollbackTriggered`, `manualStop`, `error`).
    18	- Added `scripts/improvement-journal.cjs` — append-only JSONL journal with event-type validation. Event types: `session_start`, `candidate_generated`, `scored`, `gate_evaluation`, `session_end`. `session_ended` requires `stopReason` and `sessionOutcome`.
    19	- Journal emission is **orchestrator-only** so the proposal-only agent constraint (ADR-001) is preserved — the improver never writes its own audit trail.
    20	- A CLI entrypoint (`node .../improvement-journal.cjs --emit <event-json> | --read <session>`) allows replay tools and tests to consume the journal directly.
    21	
    22	---
    23	
    24	### Mutation Coverage and Trade-Off Detection
    25	
    26	- Added `scripts/mutation-coverage.cjs` — coverage graph for candidate mutations, namespaced via `loop_type: "improvement"` so it shares the same SQLite-backed graph store used by the deep-research and deep-review loops without collisions.
    27	- Added `scripts/trade-off-detector.cjs` — Pareto-aware dimension trade-off detection. When a candidate improves one dimension but regresses another, the detector surfaces the trade-off rather than silently accepting the regression.
    28	- Added `scripts/candidate-lineage.cjs` — directed lineage graph for candidate genealogy, so promotion decisions can trace back through the full derivation history of a proposed candidate.
    29	- Added `scripts/benchmark-stability.cjs` — benchmark stability coefficient computed as `1 - (stddev / mean)` across replicate runs, gating promotion on measurement reliability.
    30	
    31	---
    32	
    33	### Scoring Weight Optimizer and Benchmark Stability
    34	
    35	- `scoreDynamic()` now accepts a `weights` override so evaluators can tune the 5-dimension scoring per target profile without forking the base scorer.
    36	- The benchmark scanner output format was mapped into `run-benchmark.cjs` so the coverage graph can ingest actual run results rather than synthesized metrics.
    37	- Reducer rejection enum gained `reject-candidate` so a failed candidate can be cleanly journaled without appearing as an error.
    38	
    39	---
    40	
    41	### Playbook and Operator Guidance
    42	
    43	- Added a new `07--runtime-truth/` playbook category with seven scenarios (`025-stop-reason-taxonomy.md` through `031-parallel-candidates-opt-in.md`) covering the full runtime truth contract: stop reasons, audit journal, resume semantics, legal-stop gates, benchmark stability, dimension trajectory, and opt-in parallel candidates.
    44	- Added three graph-era scenarios under `06--end-to-end-loop/`: mutation coverage tracking (`022`), trade-off detection (`023`), and candidate lineage (`024`).
    45	- Every playbook scenario was executed against the updated runtime — **31/31 PASS**, covering both pre-existing loop scenarios and all new Phase 5 additions.
    46	
    47	---
    48	
    49	### Verification
    50	
    51	- New vitest coverage under `scripts/tests/`: `improvement-journal.vitest.ts`, `mutation-coverage.vitest.ts`, `trade-off-detector.vitest.ts`, `candidate-lineage.vitest.ts`, `benchmark-stability.vitest.ts`.
    52	- Five P1 review findings from the ten-iteration deep-review pass were closed: CLI entrypoint, reducer rejection enum, required stopReason/sessionOutcome, scanner output mapping, scoreDynamic weights override.
    53	- Full vitest suite green (10,335 passing, 0 failing).
    54	- Backward compatibility verified: existing sessions without new config fields still run to completion.
    55	
    56	---
    57	
    58	## Files Changed
    59	
    60	| File                                                                                                                     | Action   | Description                                                                                   |
    61	| ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------- |
    62	| `.opencode/skill/sk-improve-agent/SKILL.md`                                                                              | Modified | Bumped version to 1.1.0.0 and published stop-reason taxonomy, journal, graph, and trade-off guidance |
    63	| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`                                                       | Created  | Append-only JSONL audit journal with frozen enums and CLI entrypoint                          |
    64	| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs`                                                         | Created  | Mutation coverage graph (loop_type "improvement" namespace)                                   |
    65	| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`                                                        | Created  | Pareto-aware dimension trade-off detection                                                    |
    66	| `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs`                                                         | Created  | Directed candidate lineage graph                                                              |
    67	| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs`                                                       | Created  | Benchmark stability coefficient scoring                                                       |
    68	| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`                                           | Created  | Vitest coverage for journal append/replay and enum validation                                 |
    69	| `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts`                                             | Created  | Vitest coverage for coverage graph                                                            |
    70	| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts`                                            | Created  | Vitest coverage for trade-off detection                                                       |
    71	| `.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts`                                             | Created  | Vitest coverage for lineage graph                                                             |
    72	| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts`                                           | Created  | Vitest coverage for stability scoring                                                         |
    73	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`   | Created  | Playbook: mutation coverage graph tracking                                                    |
    74	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`                | Created  | Playbook: trade-off detection                                                                 |
    75	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`                  | Created  | Playbook: candidate lineage                                                                   |
    76	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md`                 | Created  | Playbook: stop-reason taxonomy                                                                |
    77	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/026-audit-journal-emission.md`               | Created  | Playbook: audit journal emission                                                              |
    78	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md`                  | Created  | Playbook: resume continuation                                                                 |
    79	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md`                     | Created  | Playbook: legal-stop gates                                                                    |
    80	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/029-benchmark-stability.md`                  | Created  | Playbook: benchmark stability                                                                 |
    81	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md`                 | Created  | Playbook: dimension trajectory                                                                |
    82	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md`           | Created  | Playbook: opt-in parallel candidates                                                          |
    83	| `.opencode/skill/sk-improve-agent/assets/*`                                                                              | Renamed  | Asset tree migrated from `sk-agent-improver` namespace                                        |
    84	| `.opencode/command/improve/agent.md`                                                                                     | Modified | Documented stop-reason taxonomy, journal, and promotion gates                                 |
    85	| `.opencode/command/improve/assets/improve_agent-improver_auto.yaml`                                                      | Modified | Wired journal emission and legal-stop evaluation in auto mode                                 |
    86	| `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml`                                                   | Modified | Mirrored the same runtime truth contract in confirm mode                                      |
    87	| `.opencode/agent/agent-improver.md`                                                                                      | Modified | Aligned OpenCode runtime mirror with the proposal-only + journal model                        |
    88	
    89	---
    90	
    91	## Upgrade
    92	
    93	Existing improvement sessions without the new runtime-truth fields continue to run unchanged (backward compatible). Operators invoking `/improve:agent` now get a reviewable audit journal, mutation coverage graph, trade-off detection, and stability-aware promotion gates — all enforced orchestrator-side so the proposal-only agent constraint is preserved. Legacy `sk-agent-improver` paths are fully removed; update any external references to `sk-improve-agent`.
    94	
    95	---
    96	
    97	> **Update (post-release) — 2026-04-11:**
    98	>
    99	> This release documented four lifecycle modes for re-entering an `/improve:agent` session: `resume`, `restart`, `fork`, and `completed-continue`. None of the four were ever wired up. The command has no input for lineage mode, the reducer does not carry ancestry across sessions, and the journal helper has no multi-session boundary event. Every invocation is a fresh `new` session.
   100	>
   101	> Release `v1.2.1.0` retracts the promise. Operators who want to continue evaluating an agent across sessions should archive the prior `improve/` folder under a timestamped path and re-invoke the command. See `v1.2.1.0.md` for the full story.
===== .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md
     1	## [**1.2.0.0**] - 2026-04-11
     2	
     3	This release lands Phase 008 of the 042 Deep Research & Review Runtime Improvement Bundle for `sk-improve-agent`. The skill now (a) actually calls `improvement-journal.cjs` from the visible `/improve:agent` YAML workflow at every iteration boundary, (b) enforces minimum sample sizes before trade-off and stability verdicts, and (c) implements ADR-002 Option A by reading `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` during reducer refresh. The visible operator path now emits the richer runtime-truth state the v1.1.0.0 contract promised.
     4	
     5	---
     6	
     7	### Journal Wiring (REQ-004, REQ-005)
     8	
     9	- `improve_agent-improver_{auto,confirm}.yaml` now invoke `improvement-journal.cjs` at three boundary points: session start, every iteration boundary (candidate generated → scored → gate evaluation), and session end. The orchestrator-only constraint is preserved — the proposal-only agent still never writes journal rows itself.
    10	- The malformed `--event=session_initialized` CLI example in `.opencode/command/improve/agent.md` is fixed. The working form is `--emit session_start --payload '<json>'` matching the helper's actual interface.
    11	- `SKILL.md` adds a new "Journal Wiring Contract" section documenting the three boundary points, the frozen `STOP_REASONS` / `SESSION_OUTCOMES` enums (aligned to the helper's actual validator: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery` / `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`), and the orchestrator-only emission rule.
    12	
    13	---
    14	
    15	### Sample-Size Enforcement (REQ-006, REQ-007)
    16	
    17	- `trade-off-detector.cjs` now requires `minDataPoints` (default: 3, env-overridable) before reporting a trade-off. Below threshold, returns `{state: "insufficientData", dataPoints: n, minRequired: 3}` instead of fabricating confidence from 2 points. Exports `MIN_DATA_POINTS_DEFAULT = 3`.
    18	- `benchmark-stability.cjs` now requires `minReplayCount` (default: 3). Below threshold, returns `{state: "insufficientSample", replayCount: n, minRequired: 3}` and treats that state as "not stable" in `isStable()`. Exports `MIN_REPLAY_COUNT_DEFAULT = 3`.
    19	- Corresponding vitest updates: `tests/trade-off-detector.vitest.ts` (17 passing) and `tests/benchmark-stability.vitest.ts` (23 passing) now assert the new insufficient states AND validate configurable overrides.
    20	
    21	---
    22	
    23	### ADR-002 Replay Consumer Implementation
    24	
    25	- **ADR-002 Option A accepted: implement replay consumers** (rather than downgrading docs to ledger-only reality).
    26	- `scripts/reduce-state.cjs` now reads three additional artifacts during each refresh pass:
    27	  - `improvement-journal.jsonl` → extracts `lastSessionStart`, `lastSessionEnd`, `totalEvents`, `eventTypeCounts`, and terminal `stopReason` + `sessionOutcome` from the latest session_end event.
    28	  - `candidate-lineage.json` → extracts `lineageDepth` (max depth from root), `totalCandidates`, `currentLeaf`.
    29	  - `mutation-coverage.json` → extracts `coverageRatio` and `uncoveredMutations`.
    30	- Each artifact gracefully defaults to `null` when absent — no throw. Registry exposes them as top-level fields: `journalSummary`, `candidateLineage`, `mutationCoverage`.
    31	- The reducer also surfaces `insufficientDataIterations` and `insufficientSampleIterations` as new registry fields, propagated from the Part A sample-size gates.
    32	
    33	---
    34	
    35	### Sample Quality Dashboard Section (REQ-019)
    36	
    37	- Reducer dashboard gains a new **Sample Quality** section that renders `replayCount`, `stabilityCoefficient`, `insufficientSampleIterations` count, and `insufficientDataIterations` count as distinct fields, separate from generic benchmark failure counters. Operators can now distinguish "real regression" from "not enough samples to decide".
    38	- When either insufficient count is > 0, the section includes an explicit operator guidance note.
    39	
    40	---
    41	
    42	### Fixtures and Regression Coverage
    43	
    44	- New fixture: `scripts/tests/fixtures/low-sample-benchmark/` — a candidate session with 1 replay + 2-point trade-off trajectory + complete journal/lineage/coverage artifacts. Validates that helper smoke tests return `{state: "insufficientSample", replayCount: 1, minRequired: 3}` and `{state: "insufficientData", dataPoints: 2, minRequired: 3}` as expected.
    45	- Three new playbook scenarios under `manual_testing_playbook/07--runtime-truth/`:
    46	  - `032-journal-wiring.md` — verify YAML workflow calls journal helper at all boundaries
    47	  - `033-insufficient-sample.md` — verify insufficient-sample state propagation through dashboard
    48	  - `034-replay-consumer.md` — verify ADR-002 consumer path + graceful degradation on missing artifacts
    49	
    50	---
    51	
    52	### Verification
    53	
    54	- Phase 008 vitest runs: trade-off-detector (17/17), benchmark-stability (23/23) — all passing with new insufficient-state assertions.
    55	- Phase 008 full vitest suite: 12/12 across 4 new phase 008 suites.
    56	- Journal wiring end-to-end: YAML workflow confirmed to call `improvement-journal.cjs --emit` at session_start + iteration boundary + session_end.
    57	- CLI example verification: copy-paste `node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --payload '...'` from the fixed command doc — runs clean.
    58	
    59	---
    60	
    61	## Files Changed
    62	
    63	| File | Action | Description |
    64	| ---- | ------ | ----------- |
    65	| `.opencode/skill/sk-improve-agent/SKILL.md` | Modified | Bumped version to 1.2.0.0 + added Journal Wiring Contract + ADR-002 Consumer + Sample Quality sections |
    66	| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Modified | minDataPoints=3 default, insufficientData state, MIN_DATA_POINTS_DEFAULT export |
    67	| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Modified | minReplayCount=3 default, insufficientSample state, MIN_REPLAY_COUNT_DEFAULT export |
    68	| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Modified | ADR-002 replay consumer (journal + lineage + coverage reads); insufficient-state propagation; Sample Quality dashboard section |
    69	| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` | Modified | Asserts insufficientData state (17/17 passing) |
    70	| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` | Modified | Asserts insufficientSample state (23/23 passing) |
    71	| `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/*` | Created | Durable fixture for insufficient-sample states |
    72	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md` | Created | Manual test for journal wiring end-to-end |
    73	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md` | Created | Manual test for insufficient-sample propagation |
    74	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` | Created | Manual test for ADR-002 replay consumer + graceful degradation |
    75	| `.opencode/command/improve/assets/improve_agent-improver_auto.yaml` | Modified | Wired step_emit_journal_event at session_start + iteration + session_end |
    76	| `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml` | Modified | Mirrored the same journal wiring in confirm mode |
    77	| `.opencode/command/improve/agent.md` | Modified | Fixed malformed `--event=session_initialized` → `--emit session_start --payload '...'` CLI example |
    78	
    79	---
    80	
    81	## Upgrade
    82	
    83	**Backward-compatible.** Existing sessions without the three new replay artifacts (journal, lineage, mutation-coverage) still work — the reducer defaults each consumer field to `null` when the artifact is absent. The `trade-off-detector` and `benchmark-stability` default thresholds (3 data points / 3 replays) are enforced on new sessions but can be overridden via `minDataPoints` / `minReplayCount` constructor options or env variables for legacy replay flows.
    84	
    85	Operators invoking `/improve:agent` now see a richer dashboard with the Sample Quality section and the full journal/lineage/coverage summary. The visible workflow emits the journal events the v1.1.0.0 contract already promised — the contract break that Phase 008 Part A surfaced is now closed.
===== .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md
     1	# v1.2.1.0
     2	
     3	> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)
     4	
     5	---
     6	
     7	## [**1.2.1.0**] - 2026-04-11
     8	
     9	Patch release that retracts a multi-session lifecycle contract `sk-improve-agent` had documented but never actually shipped. The 042 closing audit flagged the gap. This release is documentation-only — no runtime behavior changes, no new tests, and the full `scripts/tests/` vitest suite still reports 908 passing.
    10	
    11	> Spec folder: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/` (Level 3)
    12	
    13	---
    14	
    15	## What Changed
    16	
    17	### Bug Fixes
    18	
    19	- **Resume/continuation contract retracted to match reality** -- The skill's runtime-truth section and the `/improve:agent` command definition both listed `resume`, `restart`, `fork`, and `completed-continue` as supported lifecycle modes for evaluating an agent across multiple sessions. The shipped workflow has no inputs for any of them, the reducer does not produce ancestry output, and the journal helper has no boundary event for a multi-session lineage. The only thing the runtime actually supports is `new` — every `/improve:agent` invocation starts a fresh session with generation 1. The documentation now says so explicitly. Operators who want to continue an evaluation should archive the prior `improve/` folder under a timestamped path and re-invoke the command. A future release that ships real multi-session lineage will arrive with first-class event emission, reducer ancestry output, and replay coverage; until then, treat every invocation as a standalone evaluation.
    20	
    21	---
    22	
    23	## Files Changed
    24	
    25	| File                                                           | What changed                                                                             |
    26	| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
    27	| `.opencode/skill/sk-improve-agent/SKILL.md`                    | Version bump 1.2.0.0 → 1.2.1.0; Resume/Continuation Semantics rewritten to `new`-only    |
    28	| `.opencode/command/improve/agent.md`                           | Line 339 Supported lineage modes narrowed to `new`; deferred note added                  |
    29	| `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`         | Append-only "Update (post-release)" block pointing at this release                       |
    30	
    31	---
    32	
    33	## Upgrade
    34	
    35	No migration required. Existing `improve/` session folders continue to read exactly as before.

codex
One thing surfaced immediately: Phase `006` doesn’t appear to have a `decision-record.md` at all, so I’m checking whether that’s an intentional Level 2 omission or an untracked traceability gap relative to the review brief and the packet’s own references. I’m now reading the phase specs and checking the exact test and playbook paths each summary/changelog claims exist.
exec
/bin/zsh -lc 'rg --files .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/plan.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/checklist.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/tasks.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Feature Specification: Graph Testing and Playbook Alignment [042.006]"
     3	description: "Capture the completed graph-contract verification work that added cross-layer integration tests, stress coverage, and graph-specific manual playbook scenarios across the deep-loop skills."
     4	trigger_phrases:
     5	  - "042.006"
     6	  - "graph testing"
     7	  - "playbook alignment"
     8	  - "coverage graph integration"
     9	  - "graph stress tests"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Feature Specification: Graph Testing and Playbook Alignment
    14	
    15	<!-- SPECKIT_LEVEL: 2 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:metadata -->
    21	## 1. METADATA
    22	
    23	| Field | Value |
    24	|-------|-------|
    25	| **Level** | 2 |
    26	| **Priority** | P1 |
    27	| **Status** | Complete |
    28	| **Created** | 2026-04-10 |
    29	| **Branch** | `system-speckit/026-graph-and-context-optimization` |
    30	| **Parent Spec** | `../spec.md` |
    31	| **Parent Plan** | `../plan.md` |
    32	| **Phase** | 6 of 8 |
    33	| **Predecessor** | `../005-agent-improver-deep-loop-alignment/spec.md` |
    34	| **Successor** | `../007-skill-rename-improve-agent-prompt/spec.md` |
    35	| **Handoff Criteria** | Graph integration tests, stress coverage, playbook scenarios, and README references are in place so later phases can rely on the graph contract without re-auditing basic coverage. |
    36	<!-- /ANCHOR:metadata -->
    37	
    38	---
    39	
    40	<!-- ANCHOR:problem -->
    41	## 2. PROBLEM & PURPOSE
    42	
    43	### Problem Statement
    44	Phase 002 introduced the coverage-graph runtime, but the supporting verification surface was incomplete. The repo needed one phase that proved the CommonJS and TypeScript graph layers stayed aligned, that graph operations held up under larger loads, and that human-run playbooks across `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent` covered the new graph behaviors.
    45	
    46	### Purpose
    47	Document the completed verification pass that added graph integration tests, graph stress tests, graph-specific manual playbook scenarios, and README updates so the graph runtime is both testable and operator-visible.
    48	<!-- /ANCHOR:problem -->
    49	
    50	---
    51	
    52	<!-- ANCHOR:scope -->
    53	## 3. SCOPE
    54	
    55	### In Scope
    56	- Cross-layer graph integration coverage between the CommonJS helper layer and the TypeScript MCP layer.
    57	- Stress coverage for larger graph sizes and contradiction scanning.
    58	- Manual playbook scenarios for graph convergence and graph-event emission in `sk-deep-research` and `sk-deep-review`.
    59	- Manual playbook scenarios for mutation-coverage graph tracking, trade-off detection, and candidate lineage in `sk-improve-agent`.
    60	- README updates that surface graph capabilities where they were previously missing.
    61	
    62	### Out of Scope
    63	- New graph features or schema changes.
    64	- Changes to the four Phase 002 graph-tool contracts.
    65	- Broad README rewrites outside the three affected skill surfaces.
    66	
    67	### Files to Change
    68	
    69	| File Path | Change Type | Description |
    70	|-----------|-------------|-------------|
    71	| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Create | Verify relation names, weight clamping, self-loop handling, and namespace alignment across layers. |
    72	| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` | Create | Exercise large-node graphs, contradiction scanning, and traversal behavior under load. |
    73	| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Create | Research playbook for graph-aware convergence. |
    74	| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md` | Create | Research playbook for `graphEvents` emission. |
    75	| `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` | Create | Review playbook for graph-aware convergence. |
    76	| `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md` | Create | Review playbook for `graphEvents` emission. |
    77	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md` | Create | Improve-agent playbook for mutation-coverage graph tracking. |
    78	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md` | Create | Improve-agent playbook for trade-off detection. |
    79	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md` | Create | Improve-agent playbook for candidate-lineage tracking. |
    80	| `.opencode/skill/sk-deep-research/README.md` | Modify | Surface graph capability coverage. |
    81	| `.opencode/skill/sk-deep-review/README.md` | Modify | Surface graph capability coverage. |
    82	| `.opencode/skill/sk-improve-agent/README.md` | Modify | Surface graph capability coverage. |
    83	<!-- /ANCHOR:scope -->
    84	
    85	---
    86	
    87	<!-- ANCHOR:requirements -->
    88	## 4. REQUIREMENTS
    89	
    90	### P0 - Blockers (MUST complete)
    91	
    92	| ID | Requirement | Acceptance Criteria |
    93	|----|-------------|---------------------|
    94	| REQ-001 | Integration coverage must prove CommonJS and TypeScript graph contracts stay aligned. | `coverage-graph-integration.vitest.ts` verifies relation alignment, weight clamping, self-loop rejection, namespace isolation, and convergence-signal parity. |
    95	| REQ-002 | Stress coverage must exercise larger graph workloads. | `coverage-graph-stress.vitest.ts` covers large graph construction, contradiction scanning, and traversal behavior at scale. |
    96	| REQ-003 | Research and review playbooks must include graph-specific operator scenarios. | The four graph playbook files exist under the live `sk-deep-research` and `sk-deep-review` playbook trees. |
    97	
    98	### P1 - Required (complete OR user-approved deferral)
    99	
   100	| ID | Requirement | Acceptance Criteria |
   101	|----|-------------|---------------------|
   102	| REQ-004 | Improve-agent playbooks must cover graph-adjacent runtime behaviors. | The three improve-agent playbook files exist under `06--end-to-end-loop/`. |
   103	| REQ-005 | README surfaces must mention graph capability coverage where needed. | The three affected skill READMEs carry the updated graph references. |
   104	| REQ-006 | The phase packet must satisfy the current Level 2 template contract. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` validate cleanly under `validate.sh --strict`. |
   105	<!-- /ANCHOR:requirements -->
   106	
   107	---
   108	
   109	<!-- ANCHOR:success-criteria -->
   110	## 5. SUCCESS CRITERIA
   111	
   112	- **SC-001**: Cross-layer graph behavior is covered by dedicated integration tests.
   113	- **SC-002**: Large-graph and contradiction-heavy workloads are covered by stress tests.
   114	- **SC-003**: Research, review, and improve-agent operators each have graph-related manual playbook scenarios.
   115	- **SC-004**: The phase packet validates cleanly and records the delivered verification surface accurately.
   116	
   117	### Acceptance Scenarios
   118	
   119	1. **Given** a maintainer changes graph relation definitions, **when** they run the integration suite, **then** a drift between CommonJS and TypeScript surfaces is caught immediately.
   120	2. **Given** a maintainer needs to reason about larger graph workloads, **when** they run the stress suite, **then** the graph runtime is exercised beyond small fixture sizes.
   121	3. **Given** an operator needs to verify graph convergence by hand, **when** they open the deep-research or deep-review playbook trees, **then** they find dedicated graph convergence and graph-event scenarios.
   122	4. **Given** an operator needs to verify improve-agent graph-adjacent behaviors, **when** they open the improve-agent playbook tree, **then** they find scenarios for mutation coverage, trade-off detection, and candidate lineage.
   123	<!-- /ANCHOR:success-criteria -->
   124	
   125	---
   126	
   127	<!-- ANCHOR:risks -->
   128	## 6. RISKS & DEPENDENCIES
   129	
   130	| Type | Item | Impact | Mitigation |
   131	|------|------|--------|------------|
   132	| Dependency | Phase 002 graph surfaces remain the source of truth. | High | Keep this phase verification-only and ground every claim in the shipped graph files. |
   133	| Risk | Integration coverage becomes outdated as relation sets evolve. | Medium | Keep the integration suite focused on canonical relation, weight, and namespace contracts. |
   134	| Risk | Manual playbooks drift away from live runtime behavior. | Medium | Point every playbook reference at the current live paths and keep the phase packet validation-driven. |
   135	| Risk | Documentation closeout drifts behind the shipped verification surface. | Low | Rebuild the phase packet around the current Level 2 contract and strict validation. |
   136	<!-- /ANCHOR:risks -->
   137	
   138	---
   139	
   140	<!-- ANCHOR:questions -->
   141	## 10. OPEN QUESTIONS
   142	
   143	- None. The graph verification and playbook alignment work is complete, and this packet records the completed-state surface only.
   144	<!-- /ANCHOR:questions -->
   145	
   146	---
   147	
   148	<!-- ANCHOR:nfr -->
   149	## L2: NON-FUNCTIONAL REQUIREMENTS
   150	
   151	### Performance
   152	- **NFR-P01**: Stress coverage must exercise larger graph sizes without introducing new runtime behavior.
   153	- **NFR-P02**: Validation of this phase remains documentation-only and lightweight.
   154	
   155	### Security
   156	- **NFR-S01**: Playbooks and tests must reference public repo paths only.
   157	- **NFR-S02**: No secret-bearing or environment-specific values should be added to the packet docs.
   158	
   159	### Reliability
   160	- **NFR-R01**: The phase packet should be enough for future maintainers to locate the shipped graph verification surfaces directly.
   161	- **NFR-R02**: Cross-layer graph contract checks should remain discoverable from the packet without external context.
   162	<!-- /ANCHOR:nfr -->
   163	
   164	---
   165	
   166	<!-- ANCHOR:edge-cases -->
   167	## L2: EDGE CASES
   168	
   169	### Data Boundaries
   170	- Integration coverage must account for relation-set differences that are intentional adapters rather than bugs.
   171	- Stress coverage must handle empty or zero-state graph cases safely alongside large graph cases.
   172	
   173	### Error Scenarios
   174	- If a playbook path moves in a later phase, this packet must be updated or it will become misleading.
   175	- If the CommonJS and TypeScript graph layers intentionally diverge in the future, the integration suite must be updated to reflect the new contract explicitly.
   176	
   177	### State Transitions
   178	- The phase remains the verification baseline for the graph runtime until a later packet supersedes it.
   179	- If graph tools change shape in a later phase, this packet still documents the original verification surfaces delivered in Phase 006.
   180	<!-- /ANCHOR:edge-cases -->
   181	
   182	---
   183	
   184	<!-- ANCHOR:complexity -->
   185	## L2: COMPLEXITY ASSESSMENT
   186	
   187	| Dimension | Score | Notes |
   188	|-----------|-------|-------|
   189	| Scope | 17/25 | Cross-skill verification, playbook updates, and README alignment across three skill families. |
   190	| Risk | 13/25 | Mostly contract-drift and coverage-drift risk rather than direct runtime-change risk. |
   191	| Research | 8/20 | Low-to-medium because live paths and delivered surfaces are already known. |
   192	| **Total** | **38/70** | **Level 2** |
   193	<!-- /ANCHOR:complexity -->

 succeeded in 0ms:
     1	---
     2	title: "Feature Specification: Agent-Improver Deep-Loop Alignment [005]"
     3	description: "Completed Level 3 phase packet for the deep-loop runtime-truth alignment that introduced journal wiring, mutation coverage, trade-off detection, candidate lineage, and benchmark stability for the skill now published as sk-improve-agent."
     4	trigger_phrases:
     5	  - "005"
     6	  - "agent improver"
     7	  - "sk-improve-agent"
     8	  - "deep loop alignment"
     9	  - "mutation coverage"
    10	  - "benchmark stability"
    11	importance_tier: "important"
    12	contextType: "implementation"
    13	---
    14	# Feature Specification: Agent-Improver Deep-Loop Alignment
    15	
    16	<!-- SPECKIT_LEVEL: 3 -->
    17	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
    18	
    19	---
    20	
    21	## EXECUTIVE SUMMARY
    22	
    23	Phase 005 completed the runtime-truth alignment for the improve-agent skill family. The delivered work added an append-only audit journal, an improvement-scoped mutation coverage graph, dimension trade-off detection, candidate lineage tracking for optional parallel waves, and benchmark stability scoring so the improver loop could behave like the deeper research and review loops instead of remaining an isolated evaluator.
    24	
    25	The implementation landed in commit `080cf549e` and shipped in `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`. Phase 007 later renamed the live skill surface from `sk-agent-improver` to `sk-improve-agent`, so this closeout packet now points at the current runtime paths while preserving the historical phase slug.
    26	
    27	---
    28	
    29	<!-- ANCHOR:metadata -->
    30	## 1. METADATA
    31	
    32	| Field | Value |
    33	|-------|-------|
    34	| **Level** | 3 |
    35	| **Priority** | P1 |
    36	| **Status** | Complete |
    37	| **Created** | 2026-04-10 |
    38	| **Completed** | 2026-04-11 |
    39	| **Branch** | `system-speckit/026-graph-and-context-optimization` |
    40	| **Parent Spec** | `../spec.md` |
    41	| **Parent Plan** | `../plan.md` |
    42	| **Phase** | 5 of 8 |
    43	| **Predecessor** | `../004-offline-loop-optimizer/spec.md` |
    44	| **Successor** | `../006-graph-testing-and-playbook-alignment/spec.md` |
    45	| **Runtime Target** | `.opencode/skill/sk-improve-agent/` |
    46	| **Historical Note** | The phase slug keeps `agent-improver`, but the active runtime surface was renamed to `sk-improve-agent` in Phase 007. |
    47	<!-- /ANCHOR:metadata -->
    48	
    49	---
    50	
    51	<!-- ANCHOR:problem -->
    52	## 2. PROBLEM & PURPOSE
    53	
    54	### Problem Statement
    55	
    56	Before this phase shipped, the improve-agent loop had strong evaluator logic but weak runtime truth. It lacked a dedicated audit journal, had no improvement-scoped coverage graph, could not detect cross-dimension trade-offs, had no candidate-lineage model for parallel exploration, and could not measure benchmark replay stability. That left the loop harder to audit, less explainable, and less aligned with the runtime-truth contracts already established for `sk-deep-research` and `sk-deep-review`.
    57	
    58	### Purpose
    59	
    60	Record the delivered alignment work as a completed Level 3 packet so the spec accurately reflects what landed:
    61	
    62	- append-only journal wiring through `improvement-journal.cjs`
    63	- coverage tracking through `mutation-coverage.cjs`
    64	- trade-off analysis through `trade-off-detector.cjs`
    65	- optional parallel-wave lineage through `candidate-lineage.cjs`
    66	- stability and advisory optimizer support through `benchmark-stability.cjs`
    67	
    68	This closeout packet also avoids reintroducing stale static-profile wording. The current packet describes the shipped runtime in current `sk-improve-agent` terms and uses dynamic target-family language rather than freezing older `context-prime` or static `handover` examples as the canonical contract.
    69	<!-- /ANCHOR:problem -->
    70	
    71	---
    72	
    73	<!-- ANCHOR:scope -->
    74	## 3. SCOPE
    75	
    76	### In Scope
    77	
    78	- Document the delivered journal, coverage, trade-off, lineage, and stability runtime surfaces now living under `.opencode/skill/sk-improve-agent/`.
    79	- Document the delivered command and runtime-agent updates for `.opencode/command/improve/agent.md` and `.opencode/agent/improve-agent.md`.
    80	- Record the shipped verification surfaces: 5 dedicated Vitest suites, playbook scenarios, changelog evidence, and implementation commit.
    81	- Bring the phase packet into current Level 3 template alignment with completed-state metadata, evidence-backed tasks, and verification checklist items.
    82	
    83	### Out of Scope
    84	
    85	- Changing the shipped improve-agent runtime behavior.
    86	- Reopening the later lifecycle-contract retraction captured in `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md`.
    87	- Updating current repo files outside this phase folder.
    88	- Renaming the historical phase slug.
    89	
    90	### Files Delivered by the Phase
    91	
    92	| File Path | Change Type | Description |
    93	|-----------|-------------|-------------|
    94	| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Created | Append-only improvement-session journal with validated event types. |
    95	| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` | Created | Improvement-scoped coverage graph and exhausted-mutation tracking. |
    96	| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Created | Pareto-aware cross-dimension trade-off detection. |
    97	| `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs` | Created | Directed lineage graph for optional parallel candidates. |
    98	| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Created | Replay stability scoring and advisory optimizer support. |
    99	| `.opencode/skill/sk-improve-agent/scripts/tests/*.vitest.ts` | Created | Dedicated tests for each new runtime-truth helper. |
   100	| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Modified | Added journal, coverage, trajectory, parallel-wave, and optimizer settings. |
   101	| `.opencode/skill/sk-improve-agent/assets/improvement_charter.md` | Modified | Added audit-trail and legal-stop obligations. |
   102	| `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md` | Modified | Added convergence, trade-off, and exhaustion guidance. |
   103	| `.opencode/skill/sk-improve-agent/SKILL.md` | Modified | Published the runtime-truth contract for improve-agent. |
   104	| `.opencode/agent/improve-agent.md` | Modified | Kept journaling orchestrator-side and aligned the runtime mirror. |
   105	| `.opencode/command/improve/agent.md` | Modified | Documented journal emission, stop-state reporting, and runtime-truth workflow steps. |
   106	<!-- /ANCHOR:scope -->
   107	
   108	---
   109	
   110	<!-- ANCHOR:requirements -->
   111	## 4. REQUIREMENTS
   112	
   113	### P0 - Blockers (MUST complete)
   114	
   115	| ID | Requirement | Acceptance Criteria |
   116	|----|-------------|---------------------|
   117	| REQ-001 | The phase must add a dedicated audit journal for improve-agent sessions. | `improvement-journal.cjs` exists and the release notes describe orchestrator-owned journal emission. |
   118	| REQ-002 | The phase must add improvement-scoped mutation coverage tracking. | `mutation-coverage.cjs` exists and uses the improvement loop namespace described in the release evidence. |
   119	| REQ-003 | The phase must add dimension-aware trade-off detection. | `trade-off-detector.cjs` exists and shipped with dedicated test coverage. |
   120	| REQ-004 | The phase must add candidate-lineage tracking for optional parallel exploration. | `candidate-lineage.cjs` exists, with supporting tests and playbook coverage. |
   121	| REQ-005 | The phase must add benchmark stability measurement for replay quality. | `benchmark-stability.cjs` exists and is referenced in changelog and test evidence. |
   122	| REQ-006 | The phase packet must reflect the current runtime surface names. | Phase documentation points to `.opencode/skill/sk-improve-agent/` and `.opencode/agent/improve-agent.md`, not missing `agent-improver` runtime paths. |
   123	| REQ-007 | The phase packet must satisfy the current Level 3 contract. | `validate.sh --strict` passes for this phase folder with all required headings, anchors, and template markers present. |
   124	
   125	### P1 - Required (complete OR user-approved deferral)
   126	
   127	| ID | Requirement | Acceptance Criteria |
   128	|----|-------------|---------------------|
   129	| REQ-008 | The packet must preserve the five architectural decisions from the original phase. | `decision-record.md` captures journal ownership, graph reuse, trajectory gating, opt-in parallel waves, and backward-compatible config defaults. |
   130	| REQ-009 | Verification evidence must show the work landed, not just that files exist. | Tasks and checklist entries cite commit `080cf549e`, changelog `v1.1.0.0`, post-release note `v1.2.1.0`, or concrete repo paths. |
   131	| REQ-010 | The packet must use current dynamic-mode language. | The packet avoids presenting `context-prime` or static `handover` profiles as the live canonical contract. |
   132	| REQ-011 | The packet must record follow-on reality where later releases narrowed unsupported lifecycle promises. | `implementation-summary.md` and `decision-record.md` mention the later `v1.2.1.0` retraction so this packet does not re-freeze superseded lifecycle wording. |
   133	<!-- /ANCHOR:requirements -->
   134	
   135	---
   136	
   137	<!-- ANCHOR:success-criteria -->
   138	## 5. SUCCESS CRITERIA
   139	
   140	- **SC-001**: The phase packet validates strictly as a Level 3 child phase.
   141	- **SC-002**: The packet records the five delivered runtime-truth helpers and their live `sk-improve-agent` paths.
   142	- **SC-003**: The packet shows evidence for the landing commit, release note, playbook additions, and dedicated test surfaces.
   143	- **SC-004**: The packet preserves the important design choices without reintroducing stale static-profile or unsupported lifecycle claims.
   144	- **SC-005**: Parent and successor cross-links resolve cleanly for downstream packet navigation.
   145	
   146	### Acceptance Scenarios
   147	
   148	1. **Given** a maintainer opens Phase 005 to understand the improve-agent runtime-truth work, **when** they inspect the packet, **then** they see the current `sk-improve-agent` paths, the shipped helper files, and the release evidence in one place.
   149	2. **Given** a validator checks this phase, **when** strict validation runs, **then** the packet satisfies the Level 3 template with no blocking integrity errors.
   150	3. **Given** a reader needs the architectural rationale, **when** they open `decision-record.md`, **then** they can see why journal writes stayed in the orchestrator, why coverage graph reuse was chosen, and how backward compatibility was protected.
   151	4. **Given** a future audit compares phase docs against current runtime naming, **when** it reads this packet, **then** it is not sent to retired runtime-mirror paths or static-profile wording that no longer represents the live surface.
   152	5. **Given** a release auditor wants proof that the phase shipped, **when** they inspect the packet, **then** they can trace the delivery through commit `080cf549e`, `v1.1.0.0`, and the live helper files.
   153	6. **Given** a maintainer checks whether later packet work changed the Phase 005 story, **when** they read this packet, **then** they can see that Phase 007 renamed live surfaces and `v1.2.1.0` narrowed unsupported lifecycle wording without undoing the runtime delivery.
   154	<!-- /ANCHOR:success-criteria -->
   155	
   156	---
   157	
   158	<!-- ANCHOR:risks -->
   159	## 6. RISKS & DEPENDENCIES
   160	
   161	| Type | Item | Impact | Mitigation |
   162	|------|------|--------|------------|
   163	| Dependency | Commit `080cf549e` is the primary landing point for the phase. | High | Cite the commit directly and tie closeout evidence to live repo paths plus `v1.1.0.0`. |
   164	| Dependency | Phase 007 renamed the active runtime surfaces after Phase 005 landed. | Medium | Preserve historical context in prose, but point all live references at `sk-improve-agent` and `.opencode/agent/improve-agent.md`. |
   165	| Risk | Packet docs can accidentally reintroduce the retired `agent-improver` runtime path. | Medium | Use only live runtime paths in specs, tasks, checklist, and implementation summary. |
   166	| Risk | Packet docs can freeze unsupported lifecycle wording that `v1.2.1.0` later retracted. | Medium | Explicitly note that the later patch release narrowed the lifecycle surface and keep this packet aligned to current reality. |
   167	| Risk | Static-profile examples from older improve-agent docs could be copied forward as canon. | Low | Use dynamic target-family wording and cite current `supportedProfiles: []` state in the active config. |
   168	<!-- /ANCHOR:risks -->
   169	
   170	---
   171	
   172	## 7. NON-FUNCTIONAL REQUIREMENTS
   173	
   174	### Performance
   175	
   176	- **NFR-P01**: The packet remains documentation-only and does not introduce runtime changes.
   177	- **NFR-P02**: Verification remains file-, commit-, changelog-, and validator-driven so packet closeout stays fast and auditable.
   178	
   179	### Reliability
   180	
   181	- **NFR-R01**: The packet must be sufficient for future maintainers to locate the shipped helper files and release evidence without reconstructing repo history.
   182	- **NFR-R02**: Cross-links to parent and successor phases must remain valid after strict validation.
   183	
   184	### Maintainability
   185	
   186	- **NFR-M01**: The packet must preserve substantive phase content while normalizing it to the current Level 3 template.
   187	- **NFR-M02**: The packet must avoid stale terminology that no longer matches current improve-agent naming and dynamic-mode positioning.
   188	---
   189	
   190	## 8. EDGE CASES
   191	
   192	### Historical Naming
   193	
   194	- The phase slug still says `agent-improver`, but the active skill and runtime files are now `sk-improve-agent` and `.opencode/agent/improve-agent.md`.
   195	- The landing commit created files under the pre-rename skill path; Phase 007 later renamed those runtime surfaces without invalidating the phase outcome.
   196	
   197	### Lifecycle Drift
   198	
   199	- `v1.1.0.0` documented broader lifecycle semantics that `v1.2.1.0` later retracted. The packet must not present those superseded lifecycle modes as current runtime truth.
   200	
   201	### Verification Drift
   202	
   203	- A file can exist without proving the phase shipped correctly. This packet treats file existence as supporting evidence and relies on commit/release evidence for closure, not on filename checks alone.
   204	---
   205	
   206	## 9. COMPLEXITY ASSESSMENT
   207	
   208	| Dimension | Score | Triggers |
   209	|-----------|-------|----------|
   210	| Scope | 18/25 | 5 new runtime helpers, 5 dedicated test files, multiple asset and command updates. |
   211	| Risk | 15/25 | Runtime-truth changes touched promotion, journaling, coverage, and benchmark evaluation. |
   212	| Research | 12/20 | The phase adapted patterns from earlier 042 work and introduced improve-agent-specific decisions. |
   213	| Multi-Agent | 9/15 | Orchestrator-owned journaling and optional parallel candidates created coordination complexity. |
   214	| Coordination | 9/15 | Later rename and lifecycle retraction required careful closeout wording. |
   215	| **Total** | **63/100** | **Level 3** |
   216	---
   217	
   218	## 10. RISK MATRIX
   219	
   220	| Risk ID | Description | Impact | Likelihood | Mitigation |
   221	|---------|-------------|--------|------------|------------|
   222	| R-001 | Packet points to retired `agent-improver` runtime paths. | High | All live references now target `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`. |
   223	| R-002 | Packet repeats unsupported multi-session lifecycle promises. | Medium | Current packet cites the `v1.2.1.0` retraction and avoids freezing superseded wording. |
   224	| R-003 | Architectural rationale is lost during template cleanup. | Medium | `decision-record.md` consolidates the five accepted phase decisions with rationale and consequences. |
   225	| R-004 | Phase evidence appears weak because the packet only cites files. | Medium | Tasks and checklist items cite commit `080cf549e`, `v1.1.0.0`, current file paths, and strict validation. |
   226	| R-005 | Parent packet navigation breaks. | Low | Parent and successor links use explicit relative spec paths. |
   227	---
   228	
   229	## 11. USER STORIES
   230	
   231	- As a maintainer, I want a single packet that shows what Phase 005 actually delivered so I can audit improve-agent runtime-truth work without replaying git history.
   232	- As a validator, I want the phase packet to follow the current Level 3 contract so recursive strict validation passes cleanly.
   233	- As a future closeout editor, I want the packet to use current runtime names so I do not get sent to retired improve-agent runtime paths.
   234	- As a release auditor, I want commit and changelog evidence embedded in the packet so completed-state checklist items are traceable.
   235	---
   236	
   237	<!-- ANCHOR:questions -->
   238	## 12. OPEN QUESTIONS
   239	
   240	- None for packet closeout. The delivered runtime work is already shipped; this phase only needed documentation alignment to current template and naming reality.
   241	<!-- /ANCHOR:questions -->
   242	
   243	---
   244	
   245	---
   246	
   247	## 13. RELATED DOCUMENTS
   248	
   249	- `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`
   250	- `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md`
   251	- `.opencode/skill/sk-improve-agent/SKILL.md`
   252	- `.opencode/skill/sk-improve-agent/assets/improvement_config.json`
   253	- `.opencode/skill/sk-improve-agent/assets/improvement_charter.md`
   254	- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md`
   255	- `.opencode/skill/sk-improve-agent/references/loop_protocol.md`
   256	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`
   257	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`
   258	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`
   259	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md`
   260	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/026-audit-journal-emission.md`

exec
/bin/zsh -lc "rg --files .opencode/skill | rg 'improvement-journal\\.vitest\\.ts|mutation-coverage\\.vitest\\.ts|trade-off-detector\\.vitest\\.ts|candidate-lineage\\.vitest\\.ts|benchmark-stability\\.vitest\\.ts|coverage-graph-integration\\.vitest\\.ts|coverage-graph-stress\\.vitest\\.ts|022-mutation-coverage-graph-tracking\\.md|023-trade-off-detection\\.md|024-candidate-lineage\\.md|025-stop-reason-taxonomy\\.md|026-audit-journal-emission\\.md|027-resume-continuation\\.md|028-legal-stop-gates\\.md|029-benchmark-stability\\.md|030-dimension-trajectory\\.md|031-parallel-candidates-opt-in\\.md|032-journal-wiring\\.md|033-insufficient-sample\\.md|034-replay-consumer\\.md|031-graph-convergence-signals\\.md|029-graph-events-emission\\.md|021-graph-convergence-review\\.md|015-graph-events-review\\.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md
.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/029-benchmark-stability.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/026-audit-journal-emission.md
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts

exec
/bin/zsh -lc "rg -n \"improvement-journal\\.vitest\\.ts|mutation-coverage\\.vitest\\.ts|trade-off-detector\\.vitest\\.ts|candidate-lineage\\.vitest\\.ts|benchmark-stability\\.vitest\\.ts|coverage-graph-integration\\.vitest\\.ts|coverage-graph-stress\\.vitest\\.ts|022-mutation-coverage-graph-tracking\\.md|023-trade-off-detection\\.md|024-candidate-lineage\\.md|025-stop-reason-taxonomy\\.md|026-audit-journal-emission\\.md|027-resume-continuation\\.md|028-legal-stop-gates\\.md|029-benchmark-stability\\.md|030-dimension-trajectory\\.md|031-parallel-candidates-opt-in\\.md|032-journal-wiring\\.md|033-insufficient-sample\\.md|034-replay-consumer\\.md|031-graph-convergence-signals\\.md|029-graph-events-emission\\.md|021-graph-convergence-review\\.md|015-graph-events-review\\.md\" .opencode/skill" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/README.md:381:| Graph playbook  | `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` | Operator test case for graph-backed legal-stop behavior |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:77:- Feature file path: `04--convergence-and-recovery/021-graph-convergence-review.md`
.opencode/skill/sk-deep-research/README.md:219:| `manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Operator test case for graph stop guards and blocked-stop behavior |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md:77:- Feature file path: `03--iteration-execution-and-state-discipline/015-graph-events-review.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md:77:- Feature file path: `04--convergence-and-recovery/031-graph-convergence-signals.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md:77:- Feature file path: `03--iteration-execution-and-state-discipline/029-graph-events-emission.md`

exec
/bin/zsh -lc "rg --files .opencode/agent | rg 'improve-agent|agent-improver'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/agent/improve-agent.md

exec
/bin/zsh -lc "rg -n \"\\.opencode/agent/improve-agent\\.md|\\.opencode/agent/agent-improver\\.md|improvement-journal|coverage-graph-integration|coverage-graph-stress|31/31|10,335|908 passing|12/12 across 4 new phase 008 suites|032-journal-wiring|033-insufficient-sample|034-replay-consumer\" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment .opencode/changelog/15--sk-improve-agent" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:18:- Added `scripts/improvement-journal.cjs` — append-only JSONL journal with event-type validation. Event types: `session_start`, `candidate_generated`, `scored`, `gate_evaluation`, `session_end`. `session_ended` requires `stopReason` and `sessionOutcome`.
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:20:- A CLI entrypoint (`node .../improvement-journal.cjs --emit <event-json> | --read <session>`) allows replay tools and tests to consume the journal directly.
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:45:- Every playbook scenario was executed against the updated runtime — **31/31 PASS**, covering both pre-existing loop scenarios and all new Phase 5 additions.
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:51:- New vitest coverage under `scripts/tests/`: `improvement-journal.vitest.ts`, `mutation-coverage.vitest.ts`, `trade-off-detector.vitest.ts`, `candidate-lineage.vitest.ts`, `benchmark-stability.vitest.ts`.
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:53:- Full vitest suite green (10,335 passing, 0 failing).
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:63:| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`                                                       | Created  | Append-only JSONL audit journal with frozen enums and CLI entrypoint                          |
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:68:| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`                                           | Created  | Vitest coverage for journal append/replay and enum validation                                 |
.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:87:| `.opencode/agent/agent-improver.md`                                                                                      | Modified | Aligned OpenCode runtime mirror with the proposal-only + journal model                        |
.opencode/changelog/15--sk-improve-agent/v1.0.0.0.md:113:| `.opencode/agent/agent-improver.md` | Created | Canonical agent with v1.1.1 frontmatter |
.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md:9:Patch release that retracts a multi-session lifecycle contract `sk-improve-agent` had documented but never actually shipped. The 042 closing audit flagged the gap. This release is documentation-only — no runtime behavior changes, no new tests, and the full `scripts/tests/` vitest suite still reports 908 passing.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md:71:| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Create | Verify relation names, weight clamping, self-loop handling, and namespace alignment across layers. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md:72:| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` | Create | Exercise large-node graphs, contradiction scanning, and traversal behavior under load. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md:94:| REQ-001 | Integration coverage must prove CommonJS and TypeScript graph contracts stay aligned. | `coverage-graph-integration.vitest.ts` verifies relation alignment, weight clamping, self-loop rejection, namespace isolation, and convergence-signal parity. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md:95:| REQ-002 | Stress coverage must exercise larger graph workloads. | `coverage-graph-stress.vitest.ts` covers large graph construction, contradiction scanning, and traversal behavior at scale. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:62:- append-only journal wiring through `improvement-journal.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:79:- Document the delivered command and runtime-agent updates for `.opencode/command/improve/agent.md` and `.opencode/agent/improve-agent.md`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:94:| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Created | Append-only improvement-session journal with validated event types. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:104:| `.opencode/agent/improve-agent.md` | Modified | Kept journaling orchestrator-side and aligned the runtime mirror. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:117:| REQ-001 | The phase must add a dedicated audit journal for improve-agent sessions. | `improvement-journal.cjs` exists and the release notes describe orchestrator-owned journal emission. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:122:| REQ-006 | The phase packet must reflect the current runtime surface names. | Phase documentation points to `.opencode/skill/sk-improve-agent/` and `.opencode/agent/improve-agent.md`, not missing `agent-improver` runtime paths. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:164:| Dependency | Phase 007 renamed the active runtime surfaces after Phase 005 landed. | Medium | Preserve historical context in prose, but point all live references at `sk-improve-agent` and `.opencode/agent/improve-agent.md`. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:194:- The phase slug still says `agent-improver`, but the active skill and runtime files are now `sk-improve-agent` and `.opencode/agent/improve-agent.md`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:222:| R-001 | Packet points to retired `agent-improver` runtime paths. | High | All live references now target `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`. |
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:3:This release lands Phase 008 of the 042 Deep Research & Review Runtime Improvement Bundle for `sk-improve-agent`. The skill now (a) actually calls `improvement-journal.cjs` from the visible `/improve:agent` YAML workflow at every iteration boundary, (b) enforces minimum sample sizes before trade-off and stability verdicts, and (c) implements ADR-002 Option A by reading `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` during reducer refresh. The visible operator path now emits the richer runtime-truth state the v1.1.0.0 contract promised.
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:9:- `improve_agent-improver_{auto,confirm}.yaml` now invoke `improvement-journal.cjs` at three boundary points: session start, every iteration boundary (candidate generated → scored → gate evaluation), and session end. The orchestrator-only constraint is preserved — the proposal-only agent still never writes journal rows itself.
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:27:  - `improvement-journal.jsonl` → extracts `lastSessionStart`, `lastSessionEnd`, `totalEvents`, `eventTypeCounts`, and terminal `stopReason` + `sessionOutcome` from the latest session_end event.
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:46:  - `032-journal-wiring.md` — verify YAML workflow calls journal helper at all boundaries
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:47:  - `033-insufficient-sample.md` — verify insufficient-sample state propagation through dashboard
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:48:  - `034-replay-consumer.md` — verify ADR-002 consumer path + graceful degradation on missing artifacts
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:55:- Phase 008 full vitest suite: 12/12 across 4 new phase 008 suites.
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:56:- Journal wiring end-to-end: YAML workflow confirmed to call `improvement-journal.cjs --emit` at session_start + iteration boundary + session_end.
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:57:- CLI example verification: copy-paste `node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --payload '...'` from the fixed command doc — runs clean.
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:72:| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md` | Created | Manual test for journal wiring end-to-end |
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:73:| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md` | Created | Manual test for insufficient-sample propagation |
.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:74:| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` | Created | Manual test for ADR-002 replay consumer + graceful degradation |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/plan.md:79:- [x] Add `coverage-graph-integration.vitest.ts` and `coverage-graph-stress.vitest.ts`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:27:| **Runtime Mirrors** | `.opencode/agent/improve-agent.md` and improve command docs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:56:- [x] Five runtime-truth helper scripts landed. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; mutation-coverage.cjs; trade-off-detector.cjs; candidate-lineage.cjs; benchmark-stability.cjs]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:57:- [x] Five dedicated Vitest suites landed alongside the helpers. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts; mutation-coverage.vitest.ts; trade-off-detector.vitest.ts; candidate-lineage.vitest.ts; benchmark-stability.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:74:- `improvement-journal.cjs`: append-only event capture for improvement sessions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:96:- [x] Journal helper created and wired into the improve-agent workflow. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:97:- [x] Runtime mirror and command docs were updated to publish the new contract. `[EVIDENCE: .opencode/agent/improve-agent.md; .opencode/command/improve/agent.md; commit 080cf549e]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:229:improvement-journal.cjs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:246:| `improvement-journal.cjs` | Session payloads | Journal rows | Orchestrator and reducers |
.opencode/changelog/15--sk-improve-agent/v1.0.1.0.md:33:| `.opencode/agent/agent-improver.md` | Modified | Fixed command path, promoted candidate improvements (halt condition, merged checklists, 4th anti-pattern) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/checklist.md:40:- [x] CHK-004 [P0] `coverage-graph-integration.vitest.ts` exists as the cross-layer contract suite. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/checklist.md:41:- [x] CHK-005 [P0] `coverage-graph-stress.vitest.ts` exists as the larger-graph stress suite. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts`]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:46:- [x] CHK-010 [P0] `improvement-journal.cjs` exists and is part of the shipped helper set. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:61:- [x] CHK-020 [P0] Dedicated journal tests exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:66:- [x] CHK-025 [P1] Shipped release evidence records the broader verification result. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "31/31 PASS"; "10,335 passing, 0 failing"]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:78:- [x] CHK-031 [P1] The closeout packet avoids dead runtime references that could misdirect future operators. `[EVIDENCE: phase docs point at `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:38:| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Created | Verifies cross-layer graph contract alignment |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:39:| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` | Created | Exercises larger graph workloads and contradiction scanning |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:73:| Graph integration suite present | PASS - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:74:| Graph stress suite present | PASS - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/tasks.md:45:- [x] T004 Add the graph integration suite. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/tasks.md:46:- [x] T005 Add the graph stress suite. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:42:      ".opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:43:      ".opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:54:      "coverage-graph-integration.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:55:      "coverage-graph-stress.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:65:        "name": "coverage-graph-integration.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:67:        "path": ".opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:71:        "name": "coverage-graph-stress.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:73:        "path": ".opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:137:        "name": "coverage-graph-integration.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:139:        "path": "coverage-graph-integration.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:143:        "name": "coverage-graph-stress.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/graph-metadata.json:145:        "path": "coverage-graph-stress.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:40:The phase added `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` and published the surrounding runtime-truth contract through `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/command/improve/agent.md`, and `.opencode/agent/improve-agent.md`. The journal gave the loop an append-only event stream and kept the write path outside the proposal agent so the evaluator-first model stayed intact.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:64:- the 31/31 manual playbook pass
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:65:- the 10,335-test Vitest result recorded at ship time
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:91:| `improvement-journal.vitest.ts` exists | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:50:      ".opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:53:      ".opencode/agent/improve-agent.md",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:60:      "improvement-journal.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:65:      "improvement-journal.cjs",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:83:        "name": "improvement-journal.cjs",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:85:        "path": ".opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:103:        "path": ".opencode/agent/improve-agent.md",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:143:        "name": "improvement-journal.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/graph-metadata.json:145:        "path": "improvement-journal.vitest.ts",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:36:- [x] T003 Preserved the proposal-only model by keeping journal writes in orchestrator-owned surfaces instead of the target agent body. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "orchestrator-only constraint is preserved"; .opencode/agent/improve-agent.md]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:37:- [x] T004 Defined the delivered helper surface for the phase: journal, coverage, trade-off, lineage, and stability modules. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; mutation-coverage.cjs; trade-off-detector.cjs; candidate-lineage.cjs; benchmark-stability.cjs]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:46:- [x] T006 Created the append-only improvement journal helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:56:- [x] T016 Updated the runtime mirror document at the current path. `[EVIDENCE: .opencode/agent/improve-agent.md]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:67:- [x] T020 Added dedicated Vitest coverage for the journal helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:72:- [x] T025 Recorded the shipped verification summary in the release note. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "31/31 PASS" and "10,335 passing"]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:107:- [x] Keep documentation aligned to live `sk-improve-agent` naming. `[EVIDENCE: packet docs reference `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:115:| TASK-NAMING | Current runtime references use `sk-improve-agent` and `.opencode/agent/improve-agent.md`. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/description.json:9:    "improvement-journal",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:26:- .opencode/agent/agent-improver.md (the LEAF agent)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:452:- Audit journal (`improvement-journal.jsonl`) capturing all session events
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:480:| `.opencode/agent/agent-improver.md` | Modify | Add journal emission protocol, legal-stop gate checks, coverage graph update calls |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:482:| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Create | Append-only JSONL event emitter for improvement session events |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:487:| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts` | Create | Tests for journal emit, append-only enforcement, event schema |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:506:| REQ-AI-004 | Audit journal (`improvement-journal.jsonl`) capturing all events (iteration-started, candidate-proposed, candidate-evaluated, promotion-gate-checked, session-ended) | All five event types appear in the journal for every completed session; file is append-only and survives process restart |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:675:- **improvement-journal.cjs**: Append-only JSONL emitter. Receives structured event objects from the orchestrator and appends them to the session journal file. Enforces the event schema and blocks invalid event types.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:683:Orchestrator receives improvement session trigger → reads prior journal (if resume) → enters iteration loop → calls agent-improver (proposal-only) → evaluates candidate using 5-dimension scoring → calls trade-off-detector → appends events to journal via improvement-journal.cjs → updates mutation-coverage.cjs → checks legal-stop gates → emits stop-reason and session-ended event → optionally triggers benchmark-stability.cjs post-session → optionally triggers weight optimizer (separate invocation).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:698:- [ ] Create `improvement-journal.cjs` with append-only JSONL emit (REQ-AI-004)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:702:- [ ] Write `improvement-journal.vitest.ts` test suite
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:911:- [ ] T004 Add legal-stop gate protocol to agent-improver.md orchestrator section: gate conditions for `converged` and `promoted` using 5-dimension stability + no regression + promotion criteria (`.opencode/agent/agent-improver.md`) (REQ-AI-002)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:913:- [ ] T006 Create `improvement-journal.cjs`: append-only JSONL emitter with event schema validation for `iteration-started`, `candidate-proposed`, `candidate-evaluated`, `promotion-gate-checked`, `trade-off-detected`, `session-ended` event types (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-004)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:914:- [ ] T007 Add hypothesis verification ledger schema to `improvement-journal.cjs`: `mutation-proposed` and `mutation-outcome` event types capturing proposed mutation, accepted/rejected status, rejection reason, and scored dimensions (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-005)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:917:- [ ] T010 Write `improvement-journal.vitest.ts`: test event emit, append-only enforcement (second write appends not overwrites), invalid event type rejection, resume journal read, session-ended event schema (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:948:- [ ] T020 [P] Add parallel wave orchestration branch to agent-improver.md: activation check against `parallelWaves.enabled` and `explorationBreadthScore >= activationThreshold`; spawn 2-3 candidates with different strategies; merge results by selecting highest non-regressive score (`.opencode/agent/agent-improver.md`) (REQ-AI-010)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:976:- [ ] All 5 Vitest suites (`improvement-journal`, `mutation-coverage`, `trade-off-detector`, `candidate-lineage`, `benchmark-stability`) pass with zero failures across 3 consecutive runs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:1123:/bin/zsh -lc "printf '\\n--- agent-improver.md ---\\n'; sed -n '1,260p' .opencode/agent/agent-improver.md; printf '\\n--- command improve/agent.md ---\\n'; sed -n '1,260p' .opencode/command/improve/agent.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2425:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:69:- Audit journal (`improvement-journal.jsonl`) capturing all session events
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2433:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:97:| `.opencode/agent/agent-improver.md` | Modify | Add journal emission protocol, legal-stop gate checks, coverage graph update calls |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2435:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:99:| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Create | Append-only JSONL event emitter for improvement session events |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2437:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:104:| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts` | Create | Tests for journal emit, append-only enforcement, event schema |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2442:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md:123:| REQ-AI-004 | Audit journal (`improvement-journal.jsonl`) capturing all events (iteration-started, candidate-proposed, candidate-evaluated, promotion-gate-checked, session-ended) | All five event types appear in the journal for every completed session; file is append-only and survives process restart |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2494:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:70:- **improvement-journal.cjs**: Append-only JSONL emitter. Receives structured event objects from the orchestrator and appends them to the session journal file. Enforces the event schema and blocks invalid event types.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2499:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:78:Orchestrator receives improvement session trigger → reads prior journal (if resume) → enters iteration loop → calls agent-improver (proposal-only) → evaluates candidate using 5-dimension scoring → calls trade-off-detector → appends events to journal via improvement-journal.cjs → updates mutation-coverage.cjs → checks legal-stop gates → emits stop-reason and session-ended event → optionally triggers benchmark-stability.cjs post-session → optionally triggers weight optimizer (separate invocation).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2502:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:93:- [ ] Create `improvement-journal.cjs` with append-only JSONL emit (REQ-AI-004)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2504:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/plan.md:97:- [ ] Write `improvement-journal.vitest.ts` test suite
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2544:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:49:- [ ] CHK-010 [P0] All 5 new CJS scripts (`improvement-journal.cjs`, `mutation-coverage.cjs`, `trade-off-detector.cjs`, `candidate-lineage.cjs`, `benchmark-stability.cjs`) follow existing sk-improve-agent script module pattern
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2545:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:51:- [ ] CHK-012 [P0] Journal emitter enforces append-only discipline: no overwrite code path exists in improvement-journal.cjs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2547:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:63:- [ ] CHK-020 [P0] `improvement-journal.vitest.ts` passes: event emit, append-only enforcement, invalid event rejection, resume journal read, session-ended schema
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2561:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md:163:- [ ] CHK-131 [P1] Append-only journal discipline verified: no code path in improvement-journal.cjs opens files in overwrite mode
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2567:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:46:- [ ] T006 Create `improvement-journal.cjs`: append-only JSONL emitter with event schema validation for `iteration-started`, `candidate-proposed`, `candidate-evaluated`, `promotion-gate-checked`, `trade-off-detected`, `session-ended` event types (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-004)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2568:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:47:- [ ] T007 Add hypothesis verification ledger schema to `improvement-journal.cjs`: `mutation-proposed` and `mutation-outcome` event types capturing proposed mutation, accepted/rejected status, rejection reason, and scored dimensions (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`) (REQ-AI-005)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2571:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:50:- [ ] T010 Write `improvement-journal.vitest.ts`: test event emit, append-only enforcement (second write appends not overwrites), invalid event type rejection, resume journal read, session-ended event schema (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:2584:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md:81:- [ ] T020 [P] Add parallel wave orchestration branch to agent-improver.md: activation check against `parallelWaves.enabled` and `explorationBreadthScore >= activationThreshold`; spawn 2-3 candidates with different strategies; merge results by selecting highest non-regressive score (`.opencode/agent/agent-improver.md`) (REQ-AI-010)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:8645:P0: formalize runtime truth before adding new intelligence. That means a typed stop contract, a real resume classifier, and separate journal vs mutation ledger in [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/SKILL.md), [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), [agent-improver.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/agent-improver.md), and [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:8659:4. Audit journal. Today the improver mixes baseline, candidate, rejected, and benchmark records into one state log; that is too coarse for runtime truth. Add `improvement-journal.jsonl` for lifecycle and stop decisions, plus `mutation-ledger.jsonl` for proposal/evaluation outcomes in [scripts/](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts); journal events should include `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempted`, `promotion_result`, `rollback_result`, and `session_ended`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:8682:P0: formalize runtime truth before adding new intelligence. That means a typed stop contract, a real resume classifier, and separate journal vs mutation ledger in [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/SKILL.md), [improvement_config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/assets/improvement_config.json), [agent-improver.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/agent-improver.md), and [agent.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/improve/agent.md).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/scratch/codex-gpt54-deep-research.md:8696:4. Audit journal. Today the improver mixes baseline, candidate, rejected, and benchmark records into one state log; that is too coarse for runtime truth. Add `improvement-journal.jsonl` for lifecycle and stop decisions, plus `mutation-ledger.jsonl` for proposal/evaluation outcomes in [scripts/](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts); journal events should include `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempted`, `promotion_result`, `rollback_result`, and `session_ended`.

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/tasks.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Tasks: Agent-Improver Deep-Loop Alignment [005]"
     3	description: "Completed task record for the improve-agent runtime-truth alignment, rewritten to the current Level 3 tasks template with evidence."
     4	trigger_phrases:
     5	  - "005"
     6	  - "agent improver tasks"
     7	  - "sk-improve-agent tasks"
     8	importance_tier: "important"
     9	contextType: "implementation"
    10	---
    11	# Tasks: Agent-Improver Deep-Loop Alignment
    12	
    13	<!-- SPECKIT_LEVEL: 3 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
    15	
    16	---
    17	
    18	<!-- ANCHOR:notation -->
    19	## Task Notation
    20	
    21	| Prefix | Meaning |
    22	|--------|---------|
    23	| `[x]` | Completed |
    24	| `[P]` | Parallelizable at implementation time |
    25	
    26	**Task Format**: `T### Description` followed by evidence in brackets.
    27	<!-- /ANCHOR:notation -->
    28	
    29	---
    30	
    31	<!-- ANCHOR:phase-1 -->
    32	## Phase 1: Setup
    33	
    34	- [x] T001 Read the earlier 042 runtime-truth phases and mapped the improve-agent work to those patterns. `[EVIDENCE: ../001-runtime-truth-foundation/spec.md; ../002-semantic-coverage-graph/spec.md; commit 080cf549e summary]`
    35	- [x] T002 Identified the improve-agent surfaces that needed alignment: skill, assets, command, runtime mirror, scripts, tests, and playbooks. `[EVIDENCE: commit 080cf549e summary; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
    36	- [x] T003 Preserved the proposal-only model by keeping journal writes in orchestrator-owned surfaces instead of the target agent body. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "orchestrator-only constraint is preserved"; .opencode/agent/improve-agent.md]`
    37	- [x] T004 Defined the delivered helper surface for the phase: journal, coverage, trade-off, lineage, and stability modules. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; mutation-coverage.cjs; trade-off-detector.cjs; candidate-lineage.cjs; benchmark-stability.cjs]`
    38	- [x] T005 Established release evidence for packet closeout. `[EVIDENCE: commit 080cf549e; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
    39	<!-- /ANCHOR:phase-1 -->
    40	
    41	---
    42	
    43	<!-- ANCHOR:phase-2 -->
    44	## Phase 2: Implementation
    45	
    46	- [x] T006 Created the append-only improvement journal helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs]`
    47	- [x] T007 Created the mutation coverage helper for improvement sessions. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs]`
    48	- [x] T008 Created the trade-off detector helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs]`
    49	- [x] T009 Created the candidate-lineage helper for optional parallel exploration. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs]`
    50	- [x] T010 Created the benchmark stability helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs]`
    51	- [x] T011 Updated improve-agent configuration to carry runtime-truth settings. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_config.json]`
    52	- [x] T012 Updated the improve-agent charter with audit-trail and legal-stop obligations. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_charter.md]`
    53	- [x] T013 Updated the improve-agent strategy asset with convergence, exhaustion, and trade-off guidance. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_strategy.md]`
    54	- [x] T014 Published the runtime-truth contract in the skill documentation. `[EVIDENCE: .opencode/skill/sk-improve-agent/SKILL.md; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
    55	- [x] T015 Updated the visible improve command documentation. `[EVIDENCE: .opencode/command/improve/agent.md; commit 080cf549e summary]`
    56	- [x] T016 Updated the runtime mirror document at the current path. `[EVIDENCE: .opencode/agent/improve-agent.md]`
    57	- [x] T017 Added end-to-end playbook scenarios for mutation coverage, trade-off detection, and candidate lineage. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md; 023-trade-off-detection.md; 024-candidate-lineage.md]`
    58	- [x] T018 Added runtime-truth playbook scenarios for stop reasons, journal emission, legal-stop gates, stability, trajectory, and optional parallel candidates. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md through 031-parallel-candidates-opt-in.md]`
    59	- [x] T019 Captured the delivered work in the release note for `v1.1.0.0`. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
    60	<!-- /ANCHOR:phase-2 -->
    61	
    62	---
    63	
    64	<!-- ANCHOR:phase-3 -->
    65	## Phase 3: Verification
    66	
    67	- [x] T020 Added dedicated Vitest coverage for the journal helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts]`
    68	- [x] T021 Added dedicated Vitest coverage for the coverage helper. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts]`
    69	- [x] T022 Added dedicated Vitest coverage for the trade-off detector. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts]`
    70	- [x] T023 Added dedicated Vitest coverage for candidate lineage. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts]`
    71	- [x] T024 Added dedicated Vitest coverage for benchmark stability. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts]`
    72	- [x] T025 Recorded the shipped verification summary in the release note. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "31/31 PASS" and "10,335 passing"]`
    73	- [x] T026 Recorded the later lifecycle-contract correction so the packet closeout matches current reality. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`
    74	- [x] T027 Normalized the phase packet to the current Level 3 template. `[EVIDENCE: this phase folder; validate.sh --strict]`
    75	<!-- /ANCHOR:phase-3 -->
    76	
    77	---
    78	
    79	<!-- ANCHOR:completion -->
    80	## Completion Criteria
    81	
    82	- [x] All required runtime-truth helper files are present at current `sk-improve-agent` paths. `[EVIDENCE: T006-T010]`
    83	- [x] Skill, asset, command, and runtime mirror docs are aligned to the delivered phase outcome. `[EVIDENCE: T011-T016]`
    84	- [x] Dedicated test and playbook coverage exists for the phase additions. `[EVIDENCE: T017-T025]`
    85	- [x] The packet uses current runtime naming and avoids stale static-profile wording. `[EVIDENCE: spec.md, plan.md, implementation-summary.md]`
    86	- [x] Strict validation passes for this phase folder. `[EVIDENCE: validate.sh --strict]`
    87	<!-- /ANCHOR:completion -->
    88	
    89	---
    90	
    91	<!-- ANCHOR:cross-refs -->
    92	## Cross-References
    93	
    94	| Document | Purpose |
    95	|----------|---------|
    96	| `spec.md` | Final requirement and success-criteria record for the delivered phase |
    97	| `plan.md` | Delivered implementation-phases view and dependency graph |
    98	| `checklist.md` | Evidence-backed verification record |
    99	| `decision-record.md` | Consolidated architectural rationale for the five accepted decisions |
   100	| `implementation-summary.md` | Completed-state narrative and verification summary |
   101	
   102	### AI Execution Protocol
   103	
   104	#### Pre-Task Checklist
   105	
   106	- [x] Read packet docs and live runtime surfaces before editing. `[EVIDENCE: packet rewrite grounded in current file inventory and release artifacts]`
   107	- [x] Keep documentation aligned to live `sk-improve-agent` naming. `[EVIDENCE: packet docs reference `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`]`
   108	
   109	#### Execution Rules
   110	
   111	| Rule | Description |
   112	|------|-------------|
   113	| TASK-SCOPE | Only phase-folder docs are edited during closeout. |
   114	| TASK-EVIDENCE | Every completed task uses a concrete file, commit, changelog, or validator citation. |
   115	| TASK-NAMING | Current runtime references use `sk-improve-agent` and `.opencode/agent/improve-agent.md`. |
   116	| TASK-HISTORY | Historical outcomes are preserved, but superseded lifecycle claims are not reintroduced as current truth. |
   117	
   118	#### Status Reporting Format
   119	
   120	`Phase 005 [COMPLETE] — packet aligned, evidence added, strict validation passed`
   121	
   122	#### Blocked Task Protocol
   123	
   124	No blocked tasks remain in this closeout pass.
   125	<!-- /ANCHOR:cross-refs -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/tasks.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/checklist.md | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Tasks: Graph Testing and Playbook Alignment [042.006]"
     3	description: "Completed task log for the graph verification and playbook alignment phase."
     4	trigger_phrases:
     5	  - "042.006"
     6	  - "graph testing tasks"
     7	importance_tier: "important"
     8	contextType: "tasks"
     9	---
    10	# Tasks: Graph Testing and Playbook Alignment
    11	
    12	<!-- SPECKIT_LEVEL: 2 -->
    13	<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
    14	
    15	---
    16	
    17	<!-- ANCHOR:notation -->
    18	## Task Notation
    19	
    20	| Prefix | Meaning |
    21	|--------|---------|
    22	| `[ ]` | Pending |
    23	| `[x]` | Completed |
    24	| `[P]` | Parallelizable |
    25	| `[B]` | Blocked |
    26	
    27	**Task Format**: `T### [P?] Description (file path)`
    28	<!-- /ANCHOR:notation -->
    29	
    30	---
    31	
    32	<!-- ANCHOR:phase-1 -->
    33	## Phase 1: Setup
    34	
    35	- [x] T001 Read the Phase 002 graph-runtime surfaces and identify the CommonJS and TypeScript contracts that need integration coverage. (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`)
    36	- [x] T002 Locate the live playbook trees and README files that need graph capability updates. (`sk-deep-research`; `sk-deep-review`; `sk-improve-agent`)
    37	- [x] T003 Confirm the exact playbook filenames and verification-surface paths before packet closeout. (the seven graph-related playbook files plus the two Vitest suites)
    38	<!-- /ANCHOR:phase-1 -->
    39	
    40	---
    41	
    42	<!-- ANCHOR:phase-2 -->
    43	## Phase 2: Implementation
    44	
    45	- [x] T004 Add the graph integration suite. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`)
    46	- [x] T005 Add the graph stress suite. (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts`)
    47	- [x] T006 Add research graph playbooks. (`.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md`; `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md`)
    48	- [x] T007 Add review graph playbooks. (`.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md`; `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md`)
    49	- [x] T008 Add improve-agent graph-adjacent playbooks. (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`)
    50	- [x] T009 Update graph capability references in the three affected skill READMEs. (`.opencode/skill/sk-deep-research/README.md`; `.opencode/skill/sk-deep-review/README.md`; `.opencode/skill/sk-improve-agent/README.md`)
    51	<!-- /ANCHOR:phase-2 -->
    52	
    53	---
    54	
    55	<!-- ANCHOR:phase-3 -->
    56	## Phase 3: Verification
    57	
    58	- [x] T010 Confirm the two Vitest suites and seven playbook files exist at the documented paths. (all paths cited in `spec.md` and `implementation-summary.md`)
    59	- [x] T011 Record the verification surfaces and README updates in the packet docs with evidence. (`checklist.md`; `implementation-summary.md`)
    60	- [x] T012 Run strict validation on the phase folder until it passes cleanly. (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --strict`)
    61	<!-- /ANCHOR:phase-3 -->
    62	
    63	---
    64	
    65	<!-- ANCHOR:completion -->
    66	## Completion Criteria
    67	
    68	- [x] All tasks marked `[x]`
    69	- [x] No `[B]` blocked tasks remaining
    70	- [x] Graph verification surfaces and playbook files recorded at live repo paths
    71	- [x] Strict validation passes for the phase packet
    72	<!-- /ANCHOR:completion -->
    73	
    74	---
    75	
    76	<!-- ANCHOR:cross-refs -->
    77	## Cross-References
    78	
    79	- **Specification**: See `spec.md`
    80	- **Plan**: See `plan.md`
    81	- **Verification Checklist**: See `checklist.md`
    82	- **Implementation Summary**: See `implementation-summary.md`
    83	<!-- /ANCHOR:cross-refs -->

 succeeded in 0ms:
     1	---
     2	title: "Verification Checklist: Graph Testing and Playbook Alignment [042.006]"
     3	description: "Completed verification checklist for the graph testing and playbook alignment phase."
     4	trigger_phrases:
     5	  - "042.006"
     6	  - "graph testing checklist"
     7	importance_tier: "important"
     8	contextType: "checklist"
     9	---
    10	# Verification Checklist: Graph Testing and Playbook Alignment
    11	
    12	<!-- SPECKIT_LEVEL: 2 -->
    13	<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
    14	
    15	---
    16	
    17	<!-- ANCHOR:protocol -->
    18	## Verification Protocol
    19	
    20	- P0 items MUST be `[x]` with evidence before the phase is complete.
    21	- P1 items MUST be `[x]` or carry an explicit deferral reason.
    22	- Evidence must cite the live test, playbook, README, or validation surfaces.
    23	<!-- /ANCHOR:protocol -->
    24	
    25	---
    26	
    27	<!-- ANCHOR:pre-impl -->
    28	## Pre-Implementation
    29	
    30	- [x] CHK-001 [P0] CommonJS coverage-graph helper surfaces were identified before closeout. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs`]
    31	- [x] CHK-002 [P0] TypeScript graph DB surface was identified before closeout. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`]
    32	- [x] CHK-003 [P1] Existing playbook trees were confirmed before recording the delivered scenarios. [EVIDENCE: `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent` playbook directories]
    33	<!-- /ANCHOR:pre-impl -->
    34	
    35	---
    36	
    37	<!-- ANCHOR:code-quality -->
    38	## Code Quality
    39	
    40	- [x] CHK-004 [P0] `coverage-graph-integration.vitest.ts` exists as the cross-layer contract suite. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`]
    41	- [x] CHK-005 [P0] `coverage-graph-stress.vitest.ts` exists as the larger-graph stress suite. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts`]
    42	- [x] CHK-006 [P1] The phase packet uses the current Level 2 template markers and anchors. [EVIDENCE: packet docs include `SPECKIT_LEVEL`, `SPECKIT_TEMPLATE_SOURCE`, and required anchor blocks]
    43	<!-- /ANCHOR:code-quality -->
    44	
    45	---
    46	
    47	<!-- ANCHOR:testing -->
    48	## Testing
    49	
    50	- [x] CHK-007 [P0] Research graph-convergence playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md`]
    51	- [x] CHK-008 [P0] Research graph-events playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md`]
    52	- [x] CHK-009 [P0] Review graph-convergence playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md`]
    53	- [x] CHK-010 [P0] Review graph-events playbook exists. [EVIDENCE: `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md`]
    54	- [x] CHK-011 [P1] Improve-agent mutation-coverage playbook exists. [EVIDENCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`]
    55	- [x] CHK-012 [P1] Improve-agent trade-off-detection playbook exists. [EVIDENCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`]
    56	- [x] CHK-013 [P1] Improve-agent candidate-lineage playbook exists. [EVIDENCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`]
    57	- [x] CHK-014 [P1] Strict phase validation passes after packet rewrite. [EVIDENCE: `validate.sh --strict` result]
    58	<!-- /ANCHOR:testing -->
    59	
    60	---
    61	
    62	<!-- ANCHOR:security -->
    63	## Security
    64	
    65	- [x] CHK-015 [P1] The packet introduces no secret-bearing paths or environment-specific credentials. [EVIDENCE: only repo-relative test, playbook, README, and validation paths are cited]
    66	<!-- /ANCHOR:security -->
    67	
    68	---
    69	
    70	<!-- ANCHOR:docs -->
    71	## Documentation
    72	
    73	- [x] CHK-016 [P0] The deep-research README is documented as a graph-capability surface. [EVIDENCE: `.opencode/skill/sk-deep-research/README.md`]
    74	- [x] CHK-017 [P0] The deep-review README is documented as a graph-capability surface. [EVIDENCE: `.opencode/skill/sk-deep-review/README.md`]
    75	- [x] CHK-018 [P1] The improve-agent README is documented as a graph-capability surface. [EVIDENCE: `.opencode/skill/sk-improve-agent/README.md`]
    76	- [x] CHK-019 [P1] `implementation-summary.md` records the delivered tests, playbooks, and README updates. [EVIDENCE: `implementation-summary.md` sections `What Was Built`, `How It Was Delivered`, and `Verification`]
    77	<!-- /ANCHOR:docs -->
    78	
    79	---
    80	
    81	<!-- ANCHOR:file-org -->
    82	## File Organization
    83	
    84	- [x] CHK-020 [P0] The phase includes the required Level 2 packet files. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` present]
    85	- [x] CHK-021 [P1] The phase memory folder remains untouched. [EVIDENCE: `memory/.gitkeep` retained; no memory files modified]
    86	<!-- /ANCHOR:file-org -->
    87	
    88	---
    89	
    90	<!-- ANCHOR:summary -->
    91	## Verification Summary
    92	
    93	- Total P0 items: 11
    94	- Total P1 items: 10
    95	- Status: Complete
    96	- Closeout standard: live-path verification plus strict phase validation
    97	<!-- /ANCHOR:summary -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/checklist.md | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Verification Checklist: Agent-Improver Deep-Loop Alignment [005]"
     3	description: "Completed verification checklist for the improve-agent runtime-truth alignment with evidence grounded in shipped files, releases, and validator output."
     4	trigger_phrases:
     5	  - "005"
     6	  - "agent improver checklist"
     7	  - "sk-improve-agent checklist"
     8	importance_tier: "important"
     9	contextType: "implementation"
    10	---
    11	# Verification Checklist: Agent-Improver Deep-Loop Alignment
    12	
    13	<!-- SPECKIT_LEVEL: 3 -->
    14	<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
    15	
    16	---
    17	
    18	<!-- ANCHOR:protocol -->
    19	## Verification Protocol
    20	
    21	| Priority | Handling | Completion Impact |
    22	|----------|----------|-------------------|
    23	| **[P0]** | Hard blocker | Required for phase closeout |
    24	| **[P1]** | Required | Must be evidenced before marking complete |
    25	| **[P2]** | Supporting | Captures additional confidence and historical context |
    26	
    27	Evidence uses file paths, commit IDs, changelog entries, or strict validator results.
    28	<!-- /ANCHOR:protocol -->
    29	
    30	---
    31	
    32	<!-- ANCHOR:pre-impl -->
    33	## Pre-Implementation
    34	
    35	- [x] CHK-001 [P0] Earlier 042 runtime-truth work was available to adapt. `[EVIDENCE: ../001-runtime-truth-foundation/spec.md; ../002-semantic-coverage-graph/spec.md]`
    36	- [x] CHK-002 [P0] The improve-agent runtime surfaces were identified before the phase landed. `[EVIDENCE: commit 080cf549e summary]`
    37	- [x] CHK-003 [P1] The phase landing is traceable to a concrete implementation commit. `[EVIDENCE: 080cf549e feat(042): implement Phase 005 Agent Improver Deep Loop Alignment]`
    38	- [x] CHK-004 [P1] The release packaging recorded the delivered outcome. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
    39	<!-- /ANCHOR:pre-impl -->
    40	
    41	---
    42	
    43	<!-- ANCHOR:code-quality -->
    44	## Code Quality
    45	
    46	- [x] CHK-010 [P0] `improvement-journal.cjs` exists and is part of the shipped helper set. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs]`
    47	- [x] CHK-011 [P0] `mutation-coverage.cjs` exists and is part of the shipped helper set. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs]`
    48	- [x] CHK-012 [P0] `trade-off-detector.cjs` exists and is part of the shipped helper set. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs]`
    49	- [x] CHK-013 [P0] `candidate-lineage.cjs` exists and is part of the shipped helper set. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs]`
    50	- [x] CHK-014 [P0] `benchmark-stability.cjs` exists and is part of the shipped helper set. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs]`
    51	- [x] CHK-015 [P1] Improve-agent config and strategy assets were expanded for runtime truth. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_config.json; improvement_strategy.md; improvement_charter.md]`
    52	- [x] CHK-016 [P1] The skill documentation published the runtime-truth contract. `[EVIDENCE: .opencode/skill/sk-improve-agent/SKILL.md; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
    53	- [x] CHK-017 [P2] The packet closeout uses current dynamic-mode naming rather than stale static-profile wording. `[EVIDENCE: spec.md §2; REQ-010]`
    54	<!-- /ANCHOR:code-quality -->
    55	
    56	---
    57	
    58	<!-- ANCHOR:testing -->
    59	## Testing
    60	
    61	- [x] CHK-020 [P0] Dedicated journal tests exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts]`
    62	- [x] CHK-021 [P0] Dedicated mutation-coverage tests exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts]`
    63	- [x] CHK-022 [P0] Dedicated trade-off tests exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts]`
    64	- [x] CHK-023 [P0] Dedicated lineage tests exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts]`
    65	- [x] CHK-024 [P0] Dedicated stability tests exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts]`
    66	- [x] CHK-025 [P1] Shipped release evidence records the broader verification result. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md "31/31 PASS"; "10,335 passing, 0 failing"]`
    67	- [x] CHK-026 [P1] Runtime-truth manual scenarios exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md through 031-parallel-candidates-opt-in.md]`
    68	- [x] CHK-027 [P1] End-to-end coverage, trade-off, and lineage scenarios exist. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md; 023-trade-off-detection.md; 024-candidate-lineage.md]`
    69	- [x] CHK-028 [P2] Later lifecycle wording correction was captured so test evidence is not overstated. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`
    70	<!-- /ANCHOR:testing -->
    71	
    72	---
    73	
    74	<!-- ANCHOR:security -->
    75	## Security
    76	
    77	- [x] CHK-030 [P0] The phase packet does not introduce secrets or private runtime paths. `[EVIDENCE: phase-folder docs only reference repo paths and release artifacts]`
    78	- [x] CHK-031 [P1] The closeout packet avoids dead runtime references that could misdirect future operators. `[EVIDENCE: phase docs point at `.opencode/agent/improve-agent.md` and `.opencode/skill/sk-improve-agent/`]`
    79	- [x] CHK-032 [P1] Historical wording is framed as history, not current live contract. `[EVIDENCE: implementation-summary.md; decision-record.md; v1.2.1.0 citation]`
    80	<!-- /ANCHOR:security -->
    81	
    82	---
    83	
    84	<!-- ANCHOR:docs -->
    85	## Documentation
    86	
    87	- [x] CHK-040 [P0] `spec.md` records the delivered runtime-truth helpers, current runtime names, and closeout requirements. `[EVIDENCE: spec.md]`
    88	- [x] CHK-041 [P0] `plan.md` uses the current Level 3 structure and shows the delivered phases. `[EVIDENCE: plan.md]`
    89	- [x] CHK-042 [P0] `tasks.md` records completed work with evidence. `[EVIDENCE: tasks.md]`
    90	- [x] CHK-043 [P0] `checklist.md` records completed verification with evidence. `[EVIDENCE: checklist.md]`
    91	- [x] CHK-044 [P1] `decision-record.md` preserves the five accepted decisions without non-template top-level drift. `[EVIDENCE: decision-record.md]`
    92	- [x] CHK-045 [P1] `implementation-summary.md` explains what shipped and how later releases narrowed unsupported claims. `[EVIDENCE: implementation-summary.md]`
    93	- [x] CHK-046 [P1] `description.json` exists for packet metadata discovery. `[EVIDENCE: description.json]`
    94	<!-- /ANCHOR:docs -->
    95	
    96	---
    97	
    98	<!-- ANCHOR:file-org -->
    99	## File Organization
   100	
   101	- [x] CHK-050 [P1] Phase packet contains the full Level 3 document set. `[EVIDENCE: spec.md; plan.md; tasks.md; checklist.md; decision-record.md; implementation-summary.md]`
   102	- [x] CHK-051 [P1] Memory contents remain untouched. `[EVIDENCE: memory/.gitkeep unchanged; no edits under memory/]`
   103	- [x] CHK-052 [P1] Packet links point to current improve-agent runtime surfaces. `[EVIDENCE: spec.md §3 and §13; implementation-summary.md]`
   104	- [x] CHK-053 [P2] Historical scratch research remains preserved without being promoted to current truth. `[EVIDENCE: scratch/codex-gpt54-deep-research.md retained; packet cites current release artifacts instead]`
   105	<!-- /ANCHOR:file-org -->
   106	
   107	---
   108	
   109	<!-- ANCHOR:summary -->
   110	## Verification Summary
   111	
   112	| Category | Total | Verified |
   113	|----------|-------|----------|
   114	| P0 Items | 16 | 16/16 |
   115	| P1 Items | 14 | 14/14 |
   116	| P2 Items | 4 | 4/4 |
   117	
   118	**Verification Date**: 2026-04-11
   119	<!-- /ANCHOR:summary -->
   120	
   121	---
   122	
   123	<!-- ANCHOR:arch-verify -->
   124	## L3+: ARCHITECTURE VERIFICATION
   125	
   126	- [x] CHK-100 [P0] Journal ownership stayed outside the proposal agent. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md; decision-record.md ADR set 1]`
   127	- [x] CHK-101 [P0] Coverage graph reuse remained improvement-scoped rather than inventing a parallel system. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs; decision-record.md ADR set 2]`
   128	- [x] CHK-102 [P1] Trajectory gating was treated as a first-class convergence input. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md; decision-record.md ADR set 3]`
   129	- [x] CHK-103 [P1] Optional parallel candidates were kept opt-in. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md; decision-record.md ADR set 4]`
   130	- [x] CHK-104 [P1] Backward-compatible config defaults remained part of the delivered design. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md; decision-record.md ADR set 5]`
   131	<!-- /ANCHOR:arch-verify -->
   132	
   133	---
   134	
   135	<!-- ANCHOR:perf-verify -->
   136	## L3+: PERFORMANCE VERIFICATION
   137	
   138	- [x] CHK-110 [P1] Stability and replay behavior shipped with dedicated verification surfaces rather than ad hoc operator checks. `[EVIDENCE: benchmark-stability.vitest.ts; v1.1.0.0.md]`
   139	- [x] CHK-111 [P1] The packet closeout does not add new runtime overhead because it is documentation-only. `[EVIDENCE: only phase-folder docs edited in this pass]`
   140	- [x] CHK-112 [P2] Later releases could refine wording without reopening the whole runtime surface. `[EVIDENCE: v1.2.1.0 documentation-only patch]`
   141	<!-- /ANCHOR:perf-verify -->
   142	
   143	---
   144	
   145	<!-- ANCHOR:deploy-ready -->
   146	## L3+: DEPLOYMENT READINESS
   147	
   148	- [x] CHK-120 [P0] The landing release for the phase is recorded. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
   149	- [x] CHK-121 [P1] The later documentation correction release is recorded. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`
   150	- [x] CHK-122 [P1] Parent and successor navigation is present for packet sequencing. `[EVIDENCE: spec.md metadata table]`
   151	<!-- /ANCHOR:deploy-ready -->
   152	
   153	---
   154	
   155	<!-- ANCHOR:compliance-verify -->
   156	## L3+: COMPLIANCE VERIFICATION
   157	
   158	- [x] CHK-130 [P1] All required Level 3 packet files are present. `[EVIDENCE: packet file inventory]`
   159	- [x] CHK-131 [P1] The packet uses the current system-spec-kit template markers and anchors. `[EVIDENCE: all phase docs in this folder]`
   160	- [x] CHK-132 [P2] The phase no longer depends on missing runtime-path references. `[EVIDENCE: strict validation on this phase]`
   161	<!-- /ANCHOR:compliance-verify -->
   162	
   163	---
   164	
   165	<!-- ANCHOR:docs-verify -->
   166	## L3+: DOCUMENTATION VERIFICATION
   167	
   168	- [x] CHK-140 [P1] Cross-document terminology is aligned on `sk-improve-agent`. `[EVIDENCE: spec.md; plan.md; tasks.md; implementation-summary.md]`
   169	- [x] CHK-141 [P1] Historical context is preserved without overriding current truth. `[EVIDENCE: implementation-summary.md; decision-record.md]`
   170	- [x] CHK-142 [P2] Parent/successor references are present for recursive validation and packet navigation. `[EVIDENCE: spec.md metadata table]`
   171	<!-- /ANCHOR:docs-verify -->

codex
I’ve found one substantive drift already: the Phase `005` packet presents the journal as shipped runtime behavior, but the later `v1.2.0.0` changelog says the visible `/improve:agent` workflow only started emitting journal events in Phase `008`. I’m validating that against the actual test files now so I can separate “file exists” from “packet accurately traces when behavior became real.”
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import path from 'node:path';
     2	import fs from 'node:fs';
     3	import os from 'node:os';
     4	import { createRequire } from 'node:module';
     5	import { fileURLToPath } from 'node:url';
     6	import { describe, expect, it, beforeEach, afterEach } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
    10	const require = createRequire(import.meta.url);
    11	
    12	const journal = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs',
    15	)) as {
    16	  STOP_REASONS: Readonly<Record<string, string>>;
    17	  SESSION_OUTCOMES: Readonly<Record<string, string>>;
    18	  VALID_EVENT_TYPES: readonly string[];
    19	  validateEvent: (event: object) => { valid: boolean; errors: string[] };
    20	  emitEvent: (journalPath: string, event: object) => { success: boolean; errors?: string[] };
    21	  readJournal: (journalPath: string) => object[];
    22	  getLastIteration: (journalPath: string) => number;
    23	  getSessionResult: (journalPath: string) => { stopReason: string | null; sessionOutcome: string | null };
    24	};
    25	
    26	let tmpDir: string;
    27	let journalPath: string;
    28	
    29	beforeEach(() => {
    30	  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'journal-test-'));
    31	  journalPath = path.join(tmpDir, 'improvement-journal.jsonl');
    32	});
    33	
    34	afterEach(() => {
    35	  fs.rmSync(tmpDir, { recursive: true, force: true });
    36	});
    37	
    38	describe('improvement-journal', () => {
    39	  describe('constants', () => {
    40	    it('exports frozen STOP_REASONS', () => {
    41	      expect(journal.STOP_REASONS).toBeDefined();
    42	      expect(Object.isFrozen(journal.STOP_REASONS)).toBe(true);
    43	      expect(journal.STOP_REASONS.converged).toBe('converged');
    44	      expect(journal.STOP_REASONS.maxIterationsReached).toBe('maxIterationsReached');
    45	      expect(journal.STOP_REASONS.blockedStop).toBe('blockedStop');
    46	      expect(journal.STOP_REASONS.manualStop).toBe('manualStop');
    47	      expect(journal.STOP_REASONS.error).toBe('error');
    48	      expect(journal.STOP_REASONS.stuckRecovery).toBe('stuckRecovery');
    49	    });
    50	
    51	    it('exports frozen SESSION_OUTCOMES', () => {
    52	      expect(journal.SESSION_OUTCOMES).toBeDefined();
    53	      expect(Object.isFrozen(journal.SESSION_OUTCOMES)).toBe(true);
    54	      expect(journal.SESSION_OUTCOMES.keptBaseline).toBe('keptBaseline');
    55	      expect(journal.SESSION_OUTCOMES.promoted).toBe('promoted');
    56	      expect(journal.SESSION_OUTCOMES.rolledBack).toBe('rolledBack');
    57	      expect(journal.SESSION_OUTCOMES.advisoryOnly).toBe('advisoryOnly');
    58	    });
    59	
    60	    it('exports VALID_EVENT_TYPES array', () => {
    61	      expect(Array.isArray(journal.VALID_EVENT_TYPES)).toBe(true);
    62	      expect(journal.VALID_EVENT_TYPES).toContain('session_start');
    63	      expect(journal.VALID_EVENT_TYPES).toContain('candidate_generated');
    64	      expect(journal.VALID_EVENT_TYPES).toContain('candidate_scored');
    65	      expect(journal.VALID_EVENT_TYPES).toContain('session_ended');
    66	      expect(journal.VALID_EVENT_TYPES).toContain('trade_off_detected');
    67	    });
    68	  });
    69	
    70	  describe('validateEvent', () => {
    71	    it('accepts valid event types', () => {
    72	      const result = journal.validateEvent({ eventType: 'session_start' });
    73	      expect(result.valid).toBe(true);
    74	      expect(result.errors).toHaveLength(0);
    75	    });
    76	
    77	    it('rejects invalid event types', () => {
    78	      const result = journal.validateEvent({ eventType: 'invalid_type' });
    79	      expect(result.valid).toBe(false);
    80	      expect(result.errors.length).toBeGreaterThan(0);
    81	      expect(result.errors[0]).toContain('Invalid eventType');
    82	    });
    83	
    84	    it('rejects null events', () => {
    85	      const result = journal.validateEvent(null as unknown as object);
    86	      expect(result.valid).toBe(false);
    87	    });
    88	
    89	    it('validates stopReason on session_ended events', () => {
    90	      const valid = journal.validateEvent({
    91	        eventType: 'session_ended',
    92	        details: { stopReason: 'converged', sessionOutcome: 'promoted' },
    93	      });
    94	      expect(valid.valid).toBe(true);
    95	
    96	      const invalid = journal.validateEvent({
    97	        eventType: 'session_ended',
    98	        details: { stopReason: 'madeUpReason' },
    99	      });
   100	      expect(invalid.valid).toBe(false);
   101	    });
   102	  });
   103	
   104	  describe('emitEvent', () => {
   105	    it('creates journal file and appends event', () => {
   106	      const result = journal.emitEvent(journalPath, {
   107	        eventType: 'session_start',
   108	        iteration: 1,
   109	        details: { sessionId: 'test-session' },
   110	      });
   111	      expect(result.success).toBe(true);
   112	      expect(fs.existsSync(journalPath)).toBe(true);
   113	
   114	      const content = fs.readFileSync(journalPath, 'utf8');
   115	      const parsed = JSON.parse(content.trim());
   116	      expect(parsed.eventType).toBe('session_start');
   117	      expect(parsed.timestamp).toBeDefined();
   118	    });
   119	
   120	    it('appends to existing journal (append-only)', () => {
   121	      journal.emitEvent(journalPath, { eventType: 'session_start', iteration: 1 });
   122	      journal.emitEvent(journalPath, { eventType: 'candidate_generated', iteration: 1 });
   123	
   124	      const lines = fs.readFileSync(journalPath, 'utf8').trim().split('\n');
   125	      expect(lines).toHaveLength(2);
   126	
   127	      const first = JSON.parse(lines[0]);
   128	      const second = JSON.parse(lines[1]);
   129	      expect(first.eventType).toBe('session_start');
   130	      expect(second.eventType).toBe('candidate_generated');
   131	    });
   132	
   133	    it('rejects invalid event types', () => {
   134	      const result = journal.emitEvent(journalPath, { eventType: 'not_real' });
   135	      expect(result.success).toBe(false);
   136	      expect(result.errors).toBeDefined();
   137	      expect(result.errors!.length).toBeGreaterThan(0);
   138	
   139	      // File should not be created for invalid events
   140	      expect(fs.existsSync(journalPath)).toBe(false);
   141	    });
   142	
   143	    it('adds timestamp automatically', () => {
   144	      journal.emitEvent(journalPath, { eventType: 'session_start' });
   145	      const events = journal.readJournal(journalPath);
   146	      expect(events[0]).toHaveProperty('timestamp');
   147	    });
   148	  });
   149	
   150	  describe('readJournal', () => {
   151	    it('returns empty array for non-existent file', () => {
   152	      const events = journal.readJournal('/nonexistent/path.jsonl');
   153	      expect(events).toEqual([]);
   154	    });
   155	
   156	    it('reads all events from journal', () => {
   157	      journal.emitEvent(journalPath, { eventType: 'session_start', iteration: 0 });
   158	      journal.emitEvent(journalPath, { eventType: 'candidate_generated', iteration: 1 });
   159	      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 1 });
   160	
   161	      const events = journal.readJournal(journalPath);
   162	      expect(events).toHaveLength(3);
   163	    });
   164	  });
   165	
   166	  describe('getLastIteration', () => {
   167	    it('returns 0 for empty journal', () => {
   168	      expect(journal.getLastIteration(journalPath)).toBe(0);
   169	    });
   170	
   171	    it('returns highest iteration number', () => {
   172	      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 1 });
   173	      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 3 });
   174	      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 2 });
   175	
   176	      expect(journal.getLastIteration(journalPath)).toBe(3);
   177	    });
   178	  });
   179	
   180	  describe('getSessionResult', () => {
   181	    it('returns nulls when no session_ended event', () => {
   182	      journal.emitEvent(journalPath, { eventType: 'session_start' });
   183	      const result = journal.getSessionResult(journalPath);
   184	      expect(result.stopReason).toBeNull();
   185	      expect(result.sessionOutcome).toBeNull();
   186	    });
   187	
   188	    it('returns stop reason and outcome from session_ended', () => {
   189	      journal.emitEvent(journalPath, {
   190	        eventType: 'session_ended',
   191	        details: {
   192	          stopReason: 'converged',
   193	          sessionOutcome: 'promoted',
   194	        },
   195	      });
   196	
   197	      const result = journal.getSessionResult(journalPath);
   198	      expect(result.stopReason).toBe('converged');
   199	      expect(result.sessionOutcome).toBe('promoted');
   200	    });
   201	  });
   202	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	/**
     2	 * Coverage Graph Integration Tests (Phase 006 — REQ-GT-001 through REQ-GT-006)
     3	 *
     4	 * Cross-layer contract verification between:
     5	 *   - CJS modules: coverage-graph-core.cjs, coverage-graph-signals.cjs,
     6	 *     coverage-graph-convergence.cjs, coverage-graph-contradictions.cjs
     7	 *   - TS/MCP layer: coverage-graph-db.ts (types and constants)
     8	 *
     9	 * These tests verify that relation names, weight ranges, clamping behavior,
    10	 * self-loop prevention, namespace isolation, and convergence signals are
    11	 * consistent across the CJS and TS layers.
    12	 */
    13	
    14	import path from 'node:path';
    15	import { createRequire } from 'node:module';
    16	import { fileURLToPath } from 'node:url';
    17	import { describe, expect, it, beforeEach } from 'vitest';
    18	
    19	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
    20	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    21	const require = createRequire(import.meta.url);
    22	
    23	// ── CJS layer imports ────────────────────────────────────────────
    24	
    25	const coreModule = require(path.join(
    26	  WORKSPACE_ROOT,
    27	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
    28	)) as {
    29	  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
    30	  REVIEW_RELATION_WEIGHTS: Readonly<Record<string, number>>;
    31	  DEFAULT_MAX_DEPTH: number;
    32	  createGraph: () => { nodes: Map<string, any>; edges: Map<string, any> };
    33	  insertEdge: (graph: any, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
    34	  clampWeight: (weight: number) => number | null;
    35	  resetEdgeIdCounter: () => void;
    36	};
    37	
    38	const signalsModule = require(path.join(
    39	  WORKSPACE_ROOT,
    40	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
    41	)) as {
    42	  computeDegree: (graph: any, nodeId: string) => { inDegree: number; outDegree: number; total: number };
    43	  computeAllDepths: (graph: any) => Map<string, number>;
    44	  computeClusterMetrics: (graph: any) => { componentCount: number; sizes: number[]; largestSize: number; isolatedNodes: number };
    45	};
    46	
    47	const convergenceModule = require(path.join(
    48	  WORKSPACE_ROOT,
    49	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
    50	)) as {
    51	  computeSourceDiversity: (graph: any) => number;
    52	  computeEvidenceDepth: (graph: any) => number;
    53	  computeQuestionCoverage: (graph: any) => number;
    54	  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
    55	  SOURCE_DIVERSITY_THRESHOLD: number;
    56	  EVIDENCE_DEPTH_THRESHOLD: number;
    57	};
    58	
    59	const contradictionsModule = require(path.join(
    60	  WORKSPACE_ROOT,
    61	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
    62	)) as {
    63	  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
    64	  reportContradictions: (graph: any) => { total: number; pairs: Array<object>; byNode: Map<string, object[]> };
    65	};
    66	
    67	// ── TS layer constants (extracted statically to avoid better-sqlite3 dep) ──
    68	
    69	/**
    70	 * These constants mirror the VALID_RELATIONS and weight maps from
    71	 * coverage-graph-db.ts. We define them here as test fixtures so we
    72	 * do not need to import the TS module (which depends on better-sqlite3).
    73	 *
    74	 * IMPORTANT: If coverage-graph-db.ts changes, these must be updated.
    75	 * The test suite below will catch any drift.
    76	 */
    77	const TS_VALID_RELATIONS = {
    78	  research: ['ANSWERS', 'SUPPORTS', 'CONTRADICTS', 'SUPERSEDES', 'DERIVED_FROM', 'COVERS', 'CITES'] as const,
    79	  review: ['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE'] as const,
    80	};
    81	
    82	const TS_RESEARCH_WEIGHTS: Record<string, number> = {
    83	  ANSWERS: 1.3,
    84	  SUPPORTS: 1.0,
    85	  CONTRADICTS: 0.8,
    86	  SUPERSEDES: 1.5,
    87	  DERIVED_FROM: 1.0,
    88	  COVERS: 1.1,
    89	  CITES: 1.0,
    90	};
    91	
    92	const TS_REVIEW_WEIGHTS: Record<string, number> = {
    93	  COVERS: 1.3,
    94	  EVIDENCE_FOR: 1.0,
    95	  CONTRADICTS: 0.8,
    96	  RESOLVES: 1.5,
    97	  CONFIRMS: 1.0,
    98	  ESCALATES: 1.2,
    99	  IN_DIMENSION: 1.0,
   100	  IN_FILE: 1.0,
   101	};
   102	
   103	// Weight bounds matching both layers
   104	const MIN_WEIGHT = 0.0;
   105	const MAX_WEIGHT = 2.0;
   106	
   107	// ═════════════════════════════════════════════════════════════════
   108	// TEST SUITES
   109	// ═════════════════════════════════════════════════════════════════
   110	
   111	describe('coverage-graph-integration: CJS ↔ TS contract alignment', () => {
   112	  beforeEach(() => {
   113	    coreModule.resetEdgeIdCounter();
   114	  });
   115	
   116	  // ── REQ-GT-001: Research relation name alignment ──────────────
   117	
   118	  describe('REQ-GT-001: research relation name alignment', () => {
   119	    it('CJS RESEARCH_RELATION_WEIGHTS keys match TS VALID_RELATIONS.research', () => {
   120	      const cjsRelations = Object.keys(coreModule.RESEARCH_RELATION_WEIGHTS).sort();
   121	      const tsRelations = [...TS_VALID_RELATIONS.research].sort();
   122	      expect(cjsRelations).toEqual(tsRelations);
   123	    });
   124	
   125	    it('CJS research weight values match TS RESEARCH_WEIGHTS', () => {
   126	      for (const [relation, cjsWeight] of Object.entries(coreModule.RESEARCH_RELATION_WEIGHTS)) {
   127	        expect(TS_RESEARCH_WEIGHTS[relation]).toBe(cjsWeight);
   128	      }
   129	    });
   130	
   131	    it('all research relations are non-empty strings', () => {
   132	      for (const relation of Object.keys(coreModule.RESEARCH_RELATION_WEIGHTS)) {
   133	        expect(relation).toBeTruthy();
   134	        expect(typeof relation).toBe('string');
   135	        expect(relation).toBe(relation.toUpperCase()); // SCREAMING_SNAKE_CASE
   136	      }
   137	    });
   138	  });
   139	
   140	  // ── REQ-GT-002: Review relation name alignment ────────────────
   141	
   142	  describe('REQ-GT-002: review relation name alignment', () => {
   143	    it('CJS and TS review sets share core relations (COVERS, EVIDENCE_FOR, CONTRADICTS, RESOLVES, CONFIRMS)', () => {
   144	      const cjsRelations = new Set(Object.keys(coreModule.REVIEW_RELATION_WEIGHTS));
   145	      const tsRelations = new Set(TS_VALID_RELATIONS.review);
   146	      const expectedShared = ['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS'];
   147	
   148	      for (const rel of expectedShared) {
   149	        expect(cjsRelations.has(rel)).toBe(true);
   150	        expect(tsRelations.has(rel)).toBe(true);
   151	      }
   152	    });
   153	
   154	    it('CJS review has in-memory-only relations (SUPPORTS, DERIVED_FROM) not in TS DB set', () => {
   155	      const tsRelations = new Set(TS_VALID_RELATIONS.review);
   156	      const cjsOnlyRelations = Object.keys(coreModule.REVIEW_RELATION_WEIGHTS)
   157	        .filter(r => !tsRelations.has(r));
   158	
   159	      // SUPPORTS and DERIVED_FROM are used in CJS in-memory graphs but not projected to SQLite
   160	      expect(cjsOnlyRelations.sort()).toEqual(['DERIVED_FROM', 'SUPPORTS'].sort());
   161	    });
   162	
   163	    it('TS review relations include additional DB-only relations (ESCALATES, IN_DIMENSION, IN_FILE)', () => {
   164	      const cjsRelations = new Set(Object.keys(coreModule.REVIEW_RELATION_WEIGHTS));
   165	      const tsOnlyRelations = [...TS_VALID_RELATIONS.review].filter(r => !cjsRelations.has(r));
   166	
   167	      // These are expected TS-only relations for DB projection (structural, not semantic)
   168	      expect(tsOnlyRelations.sort()).toEqual(['ESCALATES', 'IN_DIMENSION', 'IN_FILE'].sort());
   169	    });
   170	
   171	    it('shared review relations have matching weights', () => {
   172	      const cjsRelations = Object.keys(coreModule.REVIEW_RELATION_WEIGHTS);
   173	      for (const relation of cjsRelations) {
   174	        if (TS_REVIEW_WEIGHTS[relation] !== undefined) {
   175	          expect(TS_REVIEW_WEIGHTS[relation]).toBe(
   176	            coreModule.REVIEW_RELATION_WEIGHTS[relation],
   177	          );
   178	        }
   179	      }
   180	    });
   181	
   182	    it('CJS review has EVIDENCE_FOR but TS DB may map to EVIDENCES (naming check)', () => {
   183	      // The CJS core module uses EVIDENCE_FOR; verify it is present
   184	      expect(coreModule.REVIEW_RELATION_WEIGHTS).toHaveProperty('EVIDENCE_FOR');
   185	    });
   186	  });
   187	
   188	  // ── REQ-GT-003: Weight clamping consistency ───────────────────
   189	
   190	  describe('REQ-GT-003: weight clamping consistency', () => {
   191	    it('CJS clampWeight clamps to [0.0, 2.0]', () => {
   192	      expect(coreModule.clampWeight(0.0)).toBe(0.0);
   193	      expect(coreModule.clampWeight(1.0)).toBe(1.0);
   194	      expect(coreModule.clampWeight(2.0)).toBe(2.0);
   195	      expect(coreModule.clampWeight(-1.0)).toBe(0.0);
   196	      expect(coreModule.clampWeight(3.0)).toBe(2.0);
   197	      expect(coreModule.clampWeight(100)).toBe(2.0);
   198	      expect(coreModule.clampWeight(-50)).toBe(0.0);
   199	    });
   200	
   201	    it('CJS clampWeight returns null for non-finite inputs', () => {
   202	      expect(coreModule.clampWeight(NaN)).toBeNull();
   203	      expect(coreModule.clampWeight(Infinity)).toBeNull();
   204	      expect(coreModule.clampWeight(-Infinity)).toBeNull();
   205	    });
   206	
   207	    it('TS layer uses same [0.0, 2.0] bounds via CHECK constraint', () => {
   208	      // Verify the TS constants match
   209	      expect(MIN_WEIGHT).toBe(0.0);
   210	      expect(MAX_WEIGHT).toBe(2.0);
   211	    });
   212	
   213	    it('all CJS default relation weights are within [0.0, 2.0]', () => {
   214	      for (const w of Object.values(coreModule.RESEARCH_RELATION_WEIGHTS)) {
   215	        expect(w).toBeGreaterThanOrEqual(MIN_WEIGHT);
   216	        expect(w).toBeLessThanOrEqual(MAX_WEIGHT);
   217	      }
   218	      for (const w of Object.values(coreModule.REVIEW_RELATION_WEIGHTS)) {
   219	        expect(w).toBeGreaterThanOrEqual(MIN_WEIGHT);
   220	        expect(w).toBeLessThanOrEqual(MAX_WEIGHT);
   221	      }
   222	    });
   223	
   224	    it('all TS default relation weights are within [0.0, 2.0]', () => {
   225	      for (const w of Object.values(TS_RESEARCH_WEIGHTS)) {
   226	        expect(w).toBeGreaterThanOrEqual(MIN_WEIGHT);
   227	        expect(w).toBeLessThanOrEqual(MAX_WEIGHT);
   228	      }
   229	      for (const w of Object.values(TS_REVIEW_WEIGHTS)) {
   230	        expect(w).toBeGreaterThanOrEqual(MIN_WEIGHT);
   231	        expect(w).toBeLessThanOrEqual(MAX_WEIGHT);
   232	      }
   233	    });
   234	
   235	    it('insertEdge clamps weight during insertion', () => {
   236	      const graph = coreModule.createGraph();
   237	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 5.0);
   238	      expect(edgeId).not.toBeNull();
   239	      const edge = graph.edges.get(edgeId!);
   240	      expect(edge.weight).toBe(2.0); // clamped from 5.0
   241	    });
   242	
   243	    it('insertEdge rejects NaN weight', () => {
   244	      const graph = coreModule.createGraph();
   245	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', NaN);
   246	      expect(edgeId).toBeNull();
   247	    });
   248	  });
   249	
   250	  // ── REQ-GT-004: Self-loop prevention ──────────────────────────
   251	
   252	  describe('REQ-GT-004: self-loop prevention', () => {
   253	    it('CJS insertEdge rejects self-loops (source === target)', () => {
   254	      const graph = coreModule.createGraph();
   255	      const edgeId = coreModule.insertEdge(graph, 'node-1', 'node-1', 'ANSWERS');
   256	      expect(edgeId).toBeNull();
   257	      expect(graph.edges.size).toBe(0);
   258	    });
   259	
   260	    it('CJS insertEdge allows edges between different nodes', () => {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	/**
     2	 * Coverage Graph Stress Tests (Phase 006 — REQ-GT-007, REQ-GT-008)
     3	 *
     4	 * Performance and correctness validation at scale:
     5	 *   - 1000+ node graph construction and query
     6	 *   - Contradiction scanning with 500+ edges
     7	 *   - Provenance traversal in deep chains
     8	 *   - Cluster metrics with complex topologies
     9	 */
    10	
    11	import path from 'node:path';
    12	import { createRequire } from 'node:module';
    13	import { fileURLToPath } from 'node:url';
    14	import { describe, expect, it, beforeEach } from 'vitest';
    15	
    16	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
    17	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    18	const require = createRequire(import.meta.url);
    19	
    20	// ── CJS layer imports ────────────────────────────────────────────
    21	
    22	const coreModule = require(path.join(
    23	  WORKSPACE_ROOT,
    24	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
    25	)) as {
    26	  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
    27	  createGraph: () => { nodes: Map<string, any>; edges: Map<string, any> };
    28	  insertEdge: (graph: any, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
    29	  traverseProvenance: (graph: any, nodeId: string, maxDepth?: number) => Array<{ id: string; depth: number; relation: string; weight: number; path: string[] }>;
    30	  resetEdgeIdCounter: () => void;
    31	};
    32	
    33	const signalsModule = require(path.join(
    34	  WORKSPACE_ROOT,
    35	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
    36	)) as {
    37	  computeDegree: (graph: any, nodeId: string) => { inDegree: number; outDegree: number; total: number };
    38	  computeAllDepths: (graph: any) => Map<string, number>;
    39	  computeClusterMetrics: (graph: any) => { componentCount: number; sizes: number[]; largestSize: number; isolatedNodes: number };
    40	};
    41	
    42	const convergenceModule = require(path.join(
    43	  WORKSPACE_ROOT,
    44	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
    45	)) as {
    46	  computeSourceDiversity: (graph: any) => number;
    47	  computeEvidenceDepth: (graph: any) => number;
    48	  computeQuestionCoverage: (graph: any) => number;
    49	  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
    50	};
    51	
    52	const contradictionsModule = require(path.join(
    53	  WORKSPACE_ROOT,
    54	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
    55	)) as {
    56	  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
    57	  reportContradictions: (graph: any) => { total: number; pairs: Array<object>; byNode: Map<string, object[]> };
    58	};
    59	
    60	// ── Helpers ──────────────────────────────────────────────────────
    61	
    62	const RELATIONS = ['ANSWERS', 'SUPPORTS', 'CONTRADICTS', 'CITES', 'COVERS', 'DERIVED_FROM', 'SUPERSEDES'];
    63	
    64	function pickRelation(i: number): string {
    65	  return RELATIONS[i % RELATIONS.length];
    66	}
    67	
    68	/**
    69	 * Build a large graph with N nodes and approximately N edges.
    70	 * Creates a mix of chains and cross-links to produce realistic topology.
    71	 */
    72	function buildLargeGraph(nodeCount: number): ReturnType<typeof coreModule.createGraph> {
    73	  const graph = coreModule.createGraph();
    74	
    75	  // Create a backbone chain: node-0 → node-1 → ... → node-(N-1)
    76	  for (let i = 0; i < nodeCount - 1; i++) {
    77	    coreModule.insertEdge(
    78	      graph,
    79	      `node-${i}`,
    80	      `node-${i + 1}`,
    81	      pickRelation(i),
    82	    );
    83	  }
    84	
    85	  // Add cross-links: every 10th node links to a node 5 positions ahead
    86	  for (let i = 0; i < nodeCount - 5; i += 10) {
    87	    coreModule.insertEdge(
    88	      graph,
    89	      `node-${i}`,
    90	      `node-${i + 5}`,
    91	      'SUPPORTS',
    92	    );
    93	  }
    94	
    95	  return graph;
    96	}
    97	
    98	// ═════════════════════════════════════════════════════════════════
    99	// TEST SUITES
   100	// ═════════════════════════════════════════════════════════════════
   101	
   102	describe('coverage-graph-stress', () => {
   103	  beforeEach(() => {
   104	    coreModule.resetEdgeIdCounter();
   105	  });
   106	
   107	  // ── REQ-GT-007: 1000+ node graph ─────────────────────────────
   108	
   109	  describe('REQ-GT-007: 1000+ node graph construction and query', () => {
   110	    it('inserts 1000 nodes with edges correctly', () => {
   111	      const graph = buildLargeGraph(1000);
   112	
   113	      expect(graph.nodes.size).toBe(1000);
   114	      // 999 backbone edges + ~100 cross-links
   115	      expect(graph.edges.size).toBeGreaterThanOrEqual(999);
   116	      expect(graph.edges.size).toBeLessThan(1200);
   117	    });
   118	
   119	    it('inserts 2000 nodes within acceptable time (<2s)', () => {
   120	      const start = performance.now();
   121	      const graph = buildLargeGraph(2000);
   122	      const elapsed = performance.now() - start;
   123	
   124	      expect(graph.nodes.size).toBe(2000);
   125	      expect(elapsed).toBeLessThan(2000); // under 2 seconds
   126	    });
   127	
   128	    it('degree computation scales to 1000+ nodes', () => {
   129	      const graph = buildLargeGraph(1000);
   130	
   131	      const start = performance.now();
   132	      // Query degree for 100 random nodes
   133	      for (let i = 0; i < 1000; i += 10) {
   134	        const degree = signalsModule.computeDegree(graph, `node-${i}`);
   135	        expect(degree.total).toBeGreaterThanOrEqual(1);
   136	      }
   137	      const elapsed = performance.now() - start;
   138	
   139	      expect(elapsed).toBeLessThan(5000); // under 5 seconds for 100 queries
   140	    });
   141	
   142	    it('computeAllDepths scales to 1000+ nodes', () => {
   143	      const graph = buildLargeGraph(1000);
   144	
   145	      const start = performance.now();
   146	      const depths = signalsModule.computeAllDepths(graph);
   147	      const elapsed = performance.now() - start;
   148	
   149	      expect(depths.size).toBe(1000);
   150	      expect(elapsed).toBeLessThan(5000); // under 5 seconds
   151	    });
   152	
   153	    it('cluster metrics scale to 1000+ nodes', () => {
   154	      const graph = buildLargeGraph(1000);
   155	
   156	      const start = performance.now();
   157	      const metrics = signalsModule.computeClusterMetrics(graph);
   158	      const elapsed = performance.now() - start;
   159	
   160	      // Single connected component (backbone chain connects everything)
   161	      expect(metrics.componentCount).toBe(1);
   162	      expect(metrics.largestSize).toBe(1000);
   163	      expect(metrics.isolatedNodes).toBe(0);
   164	      expect(elapsed).toBeLessThan(5000);
   165	    });
   166	
   167	    it('source diversity scales to 1000+ nodes', () => {
   168	      // ADR-001 canonical semantics: the signal is question-centric, so a
   169	      // buildLargeGraph() output with no QUESTION-kind nodes returns 0. That
   170	      // is semantically correct and cheap; the stress bound we care about
   171	      // here is runtime, not the numeric output.
   172	      const graph = buildLargeGraph(1000);
   173	
   174	      const start = performance.now();
   175	      const diversity = convergenceModule.computeSourceDiversity(graph);
   176	      const elapsed = performance.now() - start;
   177	
   178	      expect(diversity).toBeGreaterThanOrEqual(0);
   179	      expect(diversity).toBeLessThanOrEqual(100); // absurd upper bound, just a sanity check
   180	      expect(elapsed).toBeLessThan(2000);
   181	    });
   182	
   183	    it('evidence depth scales to 1000+ nodes', () => {
   184	      // Same as diversity: canonical returns 0 for graphs with no QUESTION
   185	      // nodes. The stress bound is runtime.
   186	      const graph = buildLargeGraph(1000);
   187	
   188	      const start = performance.now();
   189	      const depth = convergenceModule.computeEvidenceDepth(graph);
   190	      const elapsed = performance.now() - start;
   191	
   192	      expect(depth).toBeGreaterThanOrEqual(0);
   193	      expect(elapsed).toBeLessThan(5000);
   194	    });
   195	
   196	    it('full graph convergence computation scales to 1000+ nodes', () => {
   197	      const graph = buildLargeGraph(1000);
   198	
   199	      const start = performance.now();
   200	      const convergence = convergenceModule.computeGraphConvergence(graph, {
   201	        compositeStop: 0.5,
   202	      });
   203	      const elapsed = performance.now() - start;
   204	
   205	      expect(convergence.graphScore).toBeGreaterThanOrEqual(0);
   206	      expect(convergence.graphScore).toBeLessThanOrEqual(1);
   207	      expect(elapsed).toBeLessThan(10000); // under 10 seconds for full convergence
   208	    });
   209	  });
   210	
   211	  // ── REQ-GT-008: Contradiction scanning at scale ───────────────
   212	
   213	  describe('REQ-GT-008: contradiction scanning at scale', () => {
   214	    it('scans contradictions in a 500+ edge graph', () => {
   215	      const graph = coreModule.createGraph();
   216	
   217	      // Insert 200 CONTRADICTS edges among 400 nodes
   218	      for (let i = 0; i < 200; i++) {
   219	        coreModule.insertEdge(
   220	          graph,
   221	          `claim-${i}`,
   222	          `claim-${i + 200}`,
   223	          'CONTRADICTS',
   224	          0.8,
   225	        );
   226	      }
   227	
   228	      // Insert 300+ non-contradiction edges
   229	      for (let i = 0; i < 300; i++) {
   230	        coreModule.insertEdge(
   231	          graph,
   232	          `finding-${i}`,
   233	          `question-${i}`,
   234	          'ANSWERS',
   235	          1.3,
   236	        );
   237	      }
   238	
   239	      expect(graph.edges.size).toBe(500);
   240	
   241	      const start = performance.now();
   242	      const contradictions = contradictionsModule.scanContradictions(graph);
   243	      const elapsed = performance.now() - start;
   244	
   245	      expect(contradictions.length).toBe(200);
   246	      expect(elapsed).toBeLessThan(1000); // under 1 second
   247	    });
   248	
   249	    it('reportContradictions handles large contradiction sets', () => {
   250	      const graph = coreModule.createGraph();
   251	
   252	      for (let i = 0; i < 100; i++) {
   253	        coreModule.insertEdge(
   254	          graph,
   255	          `a-${i}`,
   256	          `b-${i}`,
   257	          'CONTRADICTS',
   258	          0.8,
   259	        );
   260	      }

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Trade-Off Detector — Cross-Dimension Regression Detection               ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	// ─────────────────────────────────────────────────────────────────────────────
     7	// 1. IMPORTS
     8	// ─────────────────────────────────────────────────────────────────────────────
     9	const fs = require('node:fs');
    10	
    11	// ─────────────────────────────────────────────────────────────────────────────
    12	// 2. CONSTANTS
    13	// ─────────────────────────────────────────────────────────────────────────────
    14	
    15	/**
    16	 * Hard dimensions: structural integrity matters more, lower regression tolerance.
    17	 * Research finding: use < -3 threshold for hard dimensions (P1).
    18	 * @type {Readonly<string[]>}
    19	 */
    20	const HARD_DIMENSIONS = Object.freeze([
    21	  'structural',
    22	  'integration',
    23	  'systemFitness',
    24	]);
    25	
    26	/**
    27	 * Soft dimensions: more tolerance for regressions.
    28	 * Research finding: use < -5 threshold for soft dimensions (P1).
    29	 * @type {Readonly<string[]>}
    30	 */
    31	const SOFT_DIMENSIONS = Object.freeze([
    32	  'ruleCoherence',
    33	  'outputQuality',
    34	]);
    35	
    36	/**
    37	 * Default threshold for improvement detection.
    38	 * @type {number}
    39	 */
    40	const DEFAULT_IMPROVEMENT_THRESHOLD = 3;
    41	
    42	/**
    43	 * Default minimum number of trajectory points required before trade-off analysis.
    44	 * @type {number}
    45	 */
    46	const MIN_DATA_POINTS_DEFAULT = 3;
    47	
    48	/**
    49	 * Default regression thresholds.
    50	 * Research finding: +3/-3 for hard dims, +3/-5 for soft dims.
    51	 * @type {{ hard: number, soft: number }}
    52	 */
    53	const DEFAULT_REGRESSION_THRESHOLDS = Object.freeze({
    54	  hard: -3,
    55	  soft: -5,
    56	});
    57	
    58	function resolveMinDataPoints(options) {
    59	  if (Number.isInteger(options?.minDataPoints) && options.minDataPoints > 0) {
    60	    return options.minDataPoints;
    61	  }
    62	
    63	  const envValue = Number.parseInt(
    64	    process.env.SK_IMPROVE_AGENT_TRADE_OFF_MIN_DATA_POINTS || '',
    65	    10
    66	  );
    67	  if (Number.isInteger(envValue) && envValue > 0) {
    68	    return envValue;
    69	  }
    70	
    71	  return MIN_DATA_POINTS_DEFAULT;
    72	}
    73	
    74	// ─────────────────────────────────────────────────────────────────────────────
    75	// 3. CORE API
    76	// ─────────────────────────────────────────────────────────────────────────────
    77	
    78	/**
    79	 * Detect trade-offs between dimensions in trajectory data (REQ-AI-008).
    80	 * A trade-off exists when one dimension improves significantly while another regresses.
    81	 *
    82	 * @param {object[]} trajectoryData - Array of trajectory data points with { scores: { dim: number } }
    83	 * @param {object} [options] - { improvementThreshold?, minDataPoints?, regressionThresholds?: { hard?, soft? } }
    84	 * @returns {object[]|{state: string, dataPoints: number, minRequired: number, reason: string}} Array of detected trade-offs or insufficient-data state
    85	 */
    86	function detectTradeOffs(trajectoryData, options) {
    87	  const dataPoints = Array.isArray(trajectoryData) ? trajectoryData.length : 0;
    88	  const minDataPoints = resolveMinDataPoints(options);
    89	  if (dataPoints < minDataPoints) {
    90	    return {
    91	      state: 'insufficientData',
    92	      dataPoints,
    93	      minRequired: minDataPoints,
    94	      reason: `Trade-off detection requires at least ${minDataPoints} data points before analysis`,
    95	    };
    96	  }
    97	
    98	  const opts = {
    99	    improvementThreshold: DEFAULT_IMPROVEMENT_THRESHOLD,
   100	    minDataPoints,
   101	    regressionThresholds: { ...DEFAULT_REGRESSION_THRESHOLDS },
   102	    ...options,
   103	  };
   104	
   105	  if (options && options.regressionThresholds) {
   106	    opts.regressionThresholds = {
   107	      ...DEFAULT_REGRESSION_THRESHOLDS,
   108	      ...options.regressionThresholds,
   109	    };
   110	  }
   111	
   112	  const tradeOffs = [];
   113	  const allDimensions = [...HARD_DIMENSIONS, ...SOFT_DIMENSIONS];
   114	
   115	  // Compare consecutive trajectory points
   116	  for (let i = 1; i < trajectoryData.length; i++) {
   117	    const prev = trajectoryData[i - 1].scores || {};
   118	    const curr = trajectoryData[i].scores || {};
   119	
   120	    // Compute deltas
   121	    const deltas = {};
   122	    for (const dim of allDimensions) {
   123	      const prevScore = typeof prev[dim] === 'number' ? prev[dim] : 0;
   124	      const currScore = typeof curr[dim] === 'number' ? curr[dim] : 0;
   125	      deltas[dim] = currScore - prevScore;
   126	    }
   127	
   128	    // Find improving dimensions
   129	    const improving = allDimensions.filter(
   130	      (dim) => deltas[dim] > opts.improvementThreshold
   131	    );
   132	
   133	    // Find regressing dimensions
   134	    const regressing = allDimensions.filter((dim) => {
   135	      const threshold = HARD_DIMENSIONS.includes(dim)
   136	        ? opts.regressionThresholds.hard
   137	        : opts.regressionThresholds.soft;
   138	      return deltas[dim] < threshold;
   139	    });
   140	
   141	    // A trade-off exists when both improving and regressing dimensions are found
   142	    if (improving.length > 0 && regressing.length > 0) {
   143	      for (const impDim of improving) {
   144	        for (const regDim of regressing) {
   145	          tradeOffs.push({
   146	            improving: impDim,
   147	            regressing: regDim,
   148	            improvementDelta: deltas[impDim],
   149	            regressionDelta: deltas[regDim],
   150	            iteration: trajectoryData[i].iteration || i,
   151	          });
   152	        }
   153	      }
   154	    }
   155	  }
   156	
   157	  return tradeOffs;
   158	}
   159	
   160	/**
   161	 * Extract per-dimension score history from journal events.
   162	 *
   163	 * @param {string} journalPath - Path to the improvement-journal.jsonl file
   164	 * @returns {object[]} Array of trajectory-like objects: { iteration, scores: { dim: number } }
   165	 */
   166	function getTrajectory(journalPath) {
   167	  try {
   168	    const content = fs.readFileSync(journalPath, 'utf8');
   169	    const events = content
   170	      .split('\n')
   171	      .map((line) => line.trim())
   172	      .filter(Boolean)
   173	      .flatMap((line) => {
   174	        try {
   175	          return [JSON.parse(line)];
   176	        } catch (_err) {
   177	          return [];
   178	        }
   179	      });
   180	
   181	    // Extract score data from candidate_scored events
   182	    return events
   183	      .filter(
   184	        (e) =>
   185	          e.eventType === 'candidate_scored' &&
   186	          e.details &&
   187	          e.details.dimensions
   188	      )
   189	      .map((e) => {
   190	        const scores = {};
   191	        for (const dim of e.details.dimensions) {
   192	          scores[dim.name] = dim.score;
   193	        }
   194	        return {
   195	          iteration: e.iteration || 0,
   196	          scores,
   197	        };
   198	      });
   199	  } catch (_err) {
   200	    return [];
   201	  }
   202	}
   203	
   204	/**
   205	 * Check if a candidate is Pareto-dominated (REQ-AI-008).
   206	 * A candidate is dominated if another candidate is at least as good in all dimensions
   207	 * and strictly better in at least one.
   208	 *
   209	 * @param {object} candidateScores - { structural, ruleCoherence, integration, outputQuality, systemFitness }
   210	 * @param {object} baselineScores - { structural, ruleCoherence, integration, outputQuality, systemFitness }
   211	 * @returns {{ dominated: boolean, dominatingDimensions: string[], regressions: string[] }}
   212	 */
   213	function checkParetoDominance(candidateScores, baselineScores) {
   214	  const allDimensions = [...HARD_DIMENSIONS, ...SOFT_DIMENSIONS];
   215	  const regressions = [];
   216	  const improvements = [];
   217	
   218	  for (const dim of allDimensions) {
   219	    const cand = candidateScores[dim] || 0;
   220	    const base = baselineScores[dim] || 0;
   221	    if (cand < base) {
   222	      regressions.push(dim);
   223	    } else if (cand > base) {
   224	      improvements.push(dim);
   225	    }
   226	  }
   227	
   228	  // Candidate is dominated by baseline if baseline is better in at least one dim
   229	  // and at least as good in all others
   230	  const dominated = regressions.length > 0 && improvements.length === 0;
   231	
   232	  return {
   233	    dominated,
   234	    dominatingDimensions: regressions,
   235	    regressions,
   236	  };
   237	}
   238	
   239	// ─────────────────────────────────────────────────────────────────────────────
   240	// 4. EXPORTS
   241	// ─────────────────────────────────────────────────────────────────────────────
   242	
   243	module.exports = {
   244	  HARD_DIMENSIONS,
   245	  SOFT_DIMENSIONS,
   246	  DEFAULT_IMPROVEMENT_THRESHOLD,
   247	  MIN_DATA_POINTS_DEFAULT,
   248	  DEFAULT_REGRESSION_THRESHOLDS,
   249	  detectTradeOffs,
   250	  getTrajectory,
   251	  checkParetoDominance,
   252	};

 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Benchmark Stability — Score Variance & Weight Optimization Advisory     ║
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
    17	 * Default number of replay runs for stability measurement.
    18	 * @type {number}
    19	 */
    20	const MIN_REPLAY_COUNT_DEFAULT = 3;
    21	const DEFAULT_REPLAY_COUNT = MIN_REPLAY_COUNT_DEFAULT;
    22	
    23	/**
    24	 * Default stability warning threshold. Below this coefficient, a warning is emitted.
    25	 * Coefficient = 1 - (stddev / mean). Perfect stability = 1.0.
    26	 * @type {number}
    27	 */
    28	const DEFAULT_WARNING_THRESHOLD = 0.95;
    29	
    30	/**
    31	 * Default minimum session count before weight optimizer produces recommendations.
    32	 * Research finding (P2): refuse auto-apply until sufficient run history.
    33	 * @type {number}
    34	 */
    35	const DEFAULT_SESSION_COUNT_THRESHOLD = 5;
    36	
    37	/**
    38	 * The 5 scoring dimensions.
    39	 * @type {Readonly<string[]>}
    40	 */
    41	const DIMENSIONS = Object.freeze([
    42	  'structural',
    43	  'ruleCoherence',
    44	  'integration',
    45	  'outputQuality',
    46	  'systemFitness',
    47	]);
    48	
    49	function resolveMinReplayCount(config) {
    50	  if (Number.isInteger(config?.minReplayCount) && config.minReplayCount > 0) {
    51	    return config.minReplayCount;
    52	  }
    53	
    54	  const envValue = Number.parseInt(
    55	    process.env.SK_IMPROVE_AGENT_BENCHMARK_MIN_REPLAY_COUNT || '',
    56	    10
    57	  );
    58	  if (Number.isInteger(envValue) && envValue > 0) {
    59	    return envValue;
    60	  }
    61	
    62	  return MIN_REPLAY_COUNT_DEFAULT;
    63	}
    64	
    65	// ─────────────────────────────────────────────────────────────────────────────
    66	// 3. STABILITY MEASUREMENT
    67	// ─────────────────────────────────────────────────────────────────────────────
    68	
    69	/**
    70	 * Compute mean of an array of numbers.
    71	 * @param {number[]} values
    72	 * @returns {number}
    73	 */
    74	function mean(values) {
    75	  if (values.length === 0) {
    76	    return 0;
    77	  }
    78	  return values.reduce((sum, v) => sum + v, 0) / values.length;
    79	}
    80	
    81	/**
    82	 * Compute standard deviation of an array of numbers.
    83	 * @param {number[]} values
    84	 * @returns {number}
    85	 */
    86	function stddev(values) {
    87	  if (values.length <= 1) {
    88	    return 0;
    89	  }
    90	  const m = mean(values);
    91	  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
    92	  return Math.sqrt(variance);
    93	}
    94	
    95	/**
    96	 * Compute stability coefficient: 1 - (stddev / mean).
    97	 * Perfect stability = 1.0, high variance = low coefficient.
    98	 *
    99	 * @param {number[]} values - Array of score values from replays
   100	 * @returns {number} Stability coefficient (0.0 to 1.0, or 1.0 if mean is 0)
   101	 */
   102	function stabilityCoefficient(values) {
   103	  const m = mean(values);
   104	  if (m === 0) {
   105	    return 1.0;
   106	  }
   107	  const sd = stddev(values);
   108	  return Math.max(0, 1 - sd / Math.abs(m));
   109	}
   110	
   111	/**
   112	 * Run stability measurement on benchmark results (REQ-AI-013).
   113	 * Accepts an array of result sets from identical replays and computes
   114	 * per-dimension stability coefficients.
   115	 *
   116	 * @param {object[]} results - Array of benchmark result objects, each with { dimensions: [{ name, score }] } or { scores: { dim: number } }
   117	 * @param {object} [config] - { warningThreshold?, minReplayCount? }
   118	 * @returns {{ dimensions: object, stable: boolean, warnings: string[] }|{state: string, replayCount: number, minRequired: number, reason: string}}
   119	 */
   120	function measureStability(results, config) {
   121	  const replayCount = Array.isArray(results) ? results.length : 0;
   122	  const opts = {
   123	    warningThreshold: DEFAULT_WARNING_THRESHOLD,
   124	    minReplayCount: resolveMinReplayCount(config),
   125	    ...config,
   126	  };
   127	
   128	  if (replayCount < opts.minReplayCount) {
   129	    return {
   130	      state: 'insufficientSample',
   131	      replayCount,
   132	      minRequired: opts.minReplayCount,
   133	      reason: `Benchmark stability requires at least ${opts.minReplayCount} replays before verdict`,
   134	    };
   135	  }
   136	
   137	  const dimensionScores = {};
   138	  for (const dim of DIMENSIONS) {
   139	    dimensionScores[dim] = [];
   140	  }
   141	
   142	  // Extract scores from results
   143	  for (const result of results) {
   144	    if (result.dimensions && Array.isArray(result.dimensions)) {
   145	      for (const dim of result.dimensions) {
   146	        if (dimensionScores[dim.name] !== undefined) {
   147	          dimensionScores[dim.name].push(dim.score);
   148	        }
   149	      }
   150	    } else if (result.scores) {
   151	      for (const dim of DIMENSIONS) {
   152	        if (typeof result.scores[dim] === 'number') {
   153	          dimensionScores[dim].push(result.scores[dim]);
   154	        }
   155	      }
   156	    }
   157	  }
   158	
   159	  const dimensionResults = {};
   160	  const warnings = [];
   161	  let allStable = true;
   162	
   163	  for (const dim of DIMENSIONS) {
   164	    const scores = dimensionScores[dim];
   165	    if (scores.length === 0) {
   166	      dimensionResults[dim] = { coefficient: 1.0, mean: 0, stddev: 0, samples: 0 };
   167	      continue;
   168	    }
   169	
   170	    const coeff = stabilityCoefficient(scores);
   171	    const m = mean(scores);
   172	    const sd = stddev(scores);
   173	
   174	    dimensionResults[dim] = {
   175	      coefficient: Math.round(coeff * 10000) / 10000,
   176	      mean: Math.round(m * 100) / 100,
   177	      stddev: Math.round(sd * 100) / 100,
   178	      samples: scores.length,
   179	    };
   180	
   181	    if (coeff < opts.warningThreshold) {
   182	      allStable = false;
   183	      warnings.push(`stabilityWarning: ${dim} coefficient ${coeff.toFixed(4)} < threshold ${opts.warningThreshold}`);
   184	    }
   185	  }
   186	
   187	  return {
   188	    dimensions: dimensionResults,
   189	    stable: allStable,
   190	    warnings,
   191	  };
   192	}
   193	
   194	/**
   195	 * Check if stability results are acceptable.
   196	 *
   197	 * @param {object} stabilityResult - Result from measureStability
   198	 * @param {number} [maxVariance] - Maximum acceptable variance (1 - coefficient). Default: 0.05.
   199	 * @returns {boolean} True if all dimensions have acceptable variance
   200	 */
   201	function isStable(stabilityResult, maxVariance) {
   202	  if (stabilityResult?.state === 'insufficientSample') {
   203	    return false;
   204	  }
   205	
   206	  const threshold = typeof maxVariance === 'number' ? maxVariance : 0.05;
   207	
   208	  for (const dim of DIMENSIONS) {
   209	    const dimResult = stabilityResult.dimensions[dim];
   210	    if (dimResult && (1 - dimResult.coefficient) > threshold) {
   211	      return false;
   212	    }
   213	  }
   214	  return true;
   215	}
   216	
   217	// ─────────────────────────────────────────────────────────────────────────────
   218	// 4. WEIGHT OPTIMIZER (Advisory Only — REQ-AI-012)
   219	// ─────────────────────────────────────────────────────────────────────────────
   220	
   221	/**
   222	 * Generate weight optimization recommendations based on historical session data.
   223	 * Research finding (P2): advisory-only, never auto-apply.
   224	 *
   225	 * @param {object[]} sessionHistory - Array of session summary objects with { dimensions: [{ name, score }], outcome? }
   226	 * @param {object} currentWeights - Current dimension weights: { structural, ruleCoherence, integration, outputQuality, systemFitness }
   227	 * @param {object} [config] - { sessionCountThreshold? }
   228	 * @returns {{ recommendations: object, sufficient: boolean, report: string }}
   229	 */
   230	function generateWeightRecommendations(sessionHistory, currentWeights, config) {
   231	  const opts = {
   232	    sessionCountThreshold: DEFAULT_SESSION_COUNT_THRESHOLD,
   233	    ...config,
   234	  };
   235	
   236	  if (!sessionHistory || sessionHistory.length < opts.sessionCountThreshold) {
   237	    return {
   238	      recommendations: null,
   239	      sufficient: false,
   240	      report: `Insufficient session history: ${(sessionHistory || []).length} < ${opts.sessionCountThreshold}. Recommendations require at least ${opts.sessionCountThreshold} sessions.`,
   241	    };
   242	  }
   243	
   244	  // Compute per-dimension variance across sessions
   245	  const dimensionVariances = {};
   246	  for (const dim of DIMENSIONS) {
   247	    const scores = [];
   248	    for (const session of sessionHistory) {
   249	      if (session.dimensions && Array.isArray(session.dimensions)) {
   250	        const dimEntry = session.dimensions.find((d) => d.name === dim);
   251	        if (dimEntry) {
   252	          scores.push(dimEntry.score);
   253	        }
   254	      } else if (session.scores && typeof session.scores[dim] === 'number') {
   255	        scores.push(session.scores[dim]);
   256	      }
   257	    }
   258	    dimensionVariances[dim] = {
   259	      mean: mean(scores),
   260	      stddev: stddev(scores),

exec
/bin/zsh -lc "nl -ba .opencode/command/improve/assets/improve_agent-improver_auto.yaml | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/command/improve/assets/improve_agent-improver_auto.yaml: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Improvement Journal — Append-Only Audit Journal for Improvement Sessions║
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
    13	// 2. CONSTANTS — Stop-Reason Taxonomy & Session Outcomes
    14	// ─────────────────────────────────────────────────────────────────────────────
    15	
    16	/**
    17	 * Stop reasons explain WHY a session terminated.
    18	 * Research finding (P0): do not overload stopReason with outcome semantics.
    19	 * @type {Readonly<Record<string, string>>}
    20	 */
    21	const STOP_REASONS = Object.freeze({
    22	  converged: 'converged',
    23	  maxIterationsReached: 'maxIterationsReached',
    24	  blockedStop: 'blockedStop',
    25	  manualStop: 'manualStop',
    26	  error: 'error',
    27	  stuckRecovery: 'stuckRecovery',
    28	});
    29	
    30	/**
    31	 * Session outcomes explain WHAT happened to the candidate.
    32	 * Separate from stopReason per research finding (P0).
    33	 * @type {Readonly<Record<string, string>>}
    34	 */
    35	const SESSION_OUTCOMES = Object.freeze({
    36	  keptBaseline: 'keptBaseline',
    37	  promoted: 'promoted',
    38	  rolledBack: 'rolledBack',
    39	  advisoryOnly: 'advisoryOnly',
    40	});
    41	
    42	/**
    43	 * Valid event types for the improvement journal.
    44	 * Journal captures lifecycle events and stop decisions (ADR-001: orchestrator only).
    45	 * @type {Readonly<string[]>}
    46	 */
    47	const VALID_EVENT_TYPES = Object.freeze([
    48	  'session_start',
    49	  'session_initialized',
    50	  'integration_scanned',
    51	  'candidate_generated',
    52	  'candidate_scored',
    53	  'benchmark_completed',
    54	  'gate_evaluation',
    55	  'legal_stop_evaluated',
    56	  'blocked_stop',
    57	  'promotion_attempt',
    58	  'promotion_attempted',
    59	  'promotion_result',
    60	  'rollback',
    61	  'rollback_result',
    62	  'trade_off_detected',
    63	  'mutation_proposed',
    64	  'mutation_outcome',
    65	  'session_ended',
    66	  'session_end',
    67	]);
    68	
    69	// ─────────────────────────────────────────────────────────────────────────────
    70	// 3. HELPERS
    71	// ─────────────────────────────────────────────────────────────────────────────
    72	
    73	/**
    74	 * Validate that an event object has the required fields and a valid event type.
    75	 * @param {object} event - Event to validate
    76	 * @returns {{ valid: boolean, errors: string[] }}
    77	 */
    78	function validateEvent(event) {
    79	  const errors = [];
    80	
    81	  if (!event || typeof event !== 'object') {
    82	    return { valid: false, errors: ['Event must be a non-null object'] };
    83	  }
    84	
    85	  if (!event.eventType || typeof event.eventType !== 'string') {
    86	    errors.push('Event must have a string eventType');
    87	  } else if (!VALID_EVENT_TYPES.includes(event.eventType)) {
    88	    errors.push(`Invalid eventType: "${event.eventType}". Valid types: ${VALID_EVENT_TYPES.join(', ')}`);
    89	  }
    90	
    91	  if (event.eventType === 'session_ended' || event.eventType === 'session_end') {
    92	    if (!event.details || !event.details.stopReason) {
    93	      errors.push('session_ended/session_end events MUST include details.stopReason');
    94	    } else if (!Object.values(STOP_REASONS).includes(event.details.stopReason)) {
    95	      errors.push(`Invalid stopReason: "${event.details.stopReason}". Valid reasons: ${Object.values(STOP_REASONS).join(', ')}`);
    96	    }
    97	    if (!event.details || !event.details.sessionOutcome) {
    98	      errors.push('session_ended/session_end events MUST include details.sessionOutcome');
    99	    } else if (!Object.values(SESSION_OUTCOMES).includes(event.details.sessionOutcome)) {
   100	      errors.push(`Invalid sessionOutcome: "${event.details.sessionOutcome}". Valid outcomes: ${Object.values(SESSION_OUTCOMES).join(', ')}`);
   101	    }
   102	  }
   103	
   104	  return { valid: errors.length === 0, errors };
   105	}
   106	
   107	// ─────────────────────────────────────────────────────────────────────────────
   108	// 4. CORE API
   109	// ─────────────────────────────────────────────────────────────────────────────
   110	
   111	/**
   112	 * Append an event to the improvement journal (append-only JSONL).
   113	 * ADR-001: Journal emission is orchestrator-only; this function is the single write point.
   114	 *
   115	 * @param {string} journalPath - Path to the improvement-journal.jsonl file
   116	 * @param {object} event - Event object with { eventType, iteration?, candidateId?, details? }
   117	 * @returns {{ success: boolean, errors?: string[] }}
   118	 */
   119	function emitEvent(journalPath, event) {
   120	  const enrichedEvent = {
   121	    timestamp: new Date().toISOString(),
   122	    ...event,
   123	  };
   124	
   125	  const validation = validateEvent(enrichedEvent);
   126	  if (!validation.valid) {
   127	    return { success: false, errors: validation.errors };
   128	  }
   129	
   130	  // Ensure directory exists
   131	  const dir = path.dirname(journalPath);
   132	  fs.mkdirSync(dir, { recursive: true });
   133	
   134	  // Append-only: use 'a' flag (NFR-R01: survives process restart, no in-memory buffering)
   135	  const line = JSON.stringify(enrichedEvent) + '\n';
   136	  fs.appendFileSync(journalPath, line, 'utf8');
   137	
   138	  return { success: true };
   139	}
   140	
   141	/**
   142	 * Read all events from a journal file.
   143	 * Used for resume/replay semantics (REQ-AI-003).
   144	 *
   145	 * @param {string} journalPath - Path to the improvement-journal.jsonl file
   146	 * @returns {object[]} Array of parsed event objects
   147	 */
   148	function readJournal(journalPath) {
   149	  try {
   150	    const content = fs.readFileSync(journalPath, 'utf8');
   151	    return content
   152	      .split('\n')
   153	      .map((line) => line.trim())
   154	      .filter(Boolean)
   155	      .flatMap((line) => {
   156	        try {
   157	          return [JSON.parse(line)];
   158	        } catch (_err) {
   159	          return [];
   160	        }
   161	      });
   162	  } catch (_err) {
   163	    return [];
   164	  }
   165	}
   166	
   167	/**
   168	 * Get the last completed iteration number from a journal.
   169	 * Used for resume semantics — continuedFromIteration field.
   170	 *
   171	 * @param {string} journalPath - Path to the improvement-journal.jsonl file
   172	 * @returns {number} Last completed iteration number, or 0 if none
   173	 */
   174	function getLastIteration(journalPath) {
   175	  const events = readJournal(journalPath);
   176	  let maxIteration = 0;
   177	  for (const event of events) {
   178	    if (typeof event.iteration === 'number' && event.iteration > maxIteration) {
   179	      maxIteration = event.iteration;
   180	    }
   181	  }
   182	  return maxIteration;
   183	}
   184	
   185	/**
   186	 * Get the stop reason from the last session_ended event.
   187	 *
   188	 * @param {string} journalPath - Path to the improvement-journal.jsonl file
   189	 * @returns {{ stopReason: string|null, sessionOutcome: string|null }}
   190	 */
   191	function getSessionResult(journalPath) {
   192	  const events = readJournal(journalPath);
   193	  const endEvents = events.filter(
   194	    (e) => e.eventType === 'session_ended' || e.eventType === 'session_end'
   195	  );
   196	  if (endEvents.length === 0) {
   197	    return { stopReason: null, sessionOutcome: null };
   198	  }
   199	  const last = endEvents[endEvents.length - 1];
   200	  return {
   201	    stopReason: (last.details && last.details.stopReason) || null,
   202	    sessionOutcome: (last.details && last.details.sessionOutcome) || null,
   203	  };
   204	}
   205	
   206	// ─────────────────────────────────────────────────────────────────────────────
   207	// 5. EXPORTS
   208	// ─────────────────────────────────────────────────────────────────────────────
   209	
   210	module.exports = {
   211	  STOP_REASONS,
   212	  SESSION_OUTCOMES,
   213	  VALID_EVENT_TYPES,
   214	  validateEvent,
   215	  emitEvent,
   216	  readJournal,
   217	  getLastIteration,
   218	  getSessionResult,
   219	};
   220	
   221	// ─────────────────────────────────────────────────────────────────────────────
   222	// 6. CLI ENTRYPOINT
   223	// ─────────────────────────────────────────────────────────────────────────────
   224	
   225	if (require.main === module) {
   226	  const args = process.argv.slice(2);
   227	
   228	  function findArg(name) {
   229	    const prefix = `--${name}=`;
   230	    for (const arg of args) {
   231	      if (arg.startsWith(prefix)) {
   232	        return arg.slice(prefix.length);
   233	      }
   234	    }
   235	    const idx = args.indexOf(`--${name}`);
   236	    if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
   237	      return args[idx + 1];
   238	    }
   239	    return undefined;
   240	  }
   241	
   242	  const readPath = findArg('read');
   243	  const emitType = findArg('emit');
   244	  const journalPath = findArg('journal');
   245	  const detailsRaw = findArg('details');
   246	
   247	  if (readPath) {
   248	    // --read <path>: Read and dump journal as JSON array
   249	    const events = readJournal(readPath);
   250	    process.stdout.write(JSON.stringify(events, null, 2) + '\n');
   251	  } else if (emitType && journalPath) {
   252	    // --emit <eventType> --journal <path> [--details <json>]
   253	    let details = {};
   254	    if (detailsRaw) {
   255	      try {
   256	        details = JSON.parse(detailsRaw);
   257	      } catch (err) {
   258	        process.stderr.write(`Failed to parse --details JSON: ${err.message}\n`);
   259	        process.exit(2);
   260	      }

exec
/bin/zsh -lc 'rg --files .opencode/command/improve/assets' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/command/improve/assets/improve_improve-agent_confirm.yaml
.opencode/command/improve/assets/improve_improve-agent_auto.yaml

exec
/bin/zsh -lc 'rg -n "session_end|session_ended|candidate_scored|scored|gate_evaluation|trade_off_detected|VALID_EVENT_TYPES|STOP_REASONS|SESSION_OUTCOMES" .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs .opencode/skill/sk-improve-agent/SKILL.md .opencode/command/improve/agent.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-improve-agent/SKILL.md:267:Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`
.opencode/skill/sk-improve-agent/SKILL.md:332:The helper validates event type plus `session_end` or `session_ended` details, and the CLI entrypoint stores boundary context under `details`. Top-level `iteration` and `candidateId` fields are available only through the JS API, not through the CLI wrapper used by the YAML workflows.
.opencode/skill/sk-improve-agent/SKILL.md:339:| `iteration_boundary` | On every iteration after candidate generation, after candidate scoring, and after gate evaluation | `candidate_generated`, `candidate_scored`, `gate_evaluation` | Per-iteration context such as `sessionId`, `iteration`, `candidateId`, `candidatePath`, `scoreOutputPath`, `weightedScore`, and gate decision details |
.opencode/skill/sk-improve-agent/SKILL.md:340:| `session_end` | Once after synthesis completes or the session reaches a terminal stop | `session_end` | `stopReason`, `sessionOutcome`, `endedAt`, `totalIterations` |
.opencode/skill/sk-improve-agent/SKILL.md:346:- `STOP_REASONS`: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`
.opencode/skill/sk-improve-agent/SKILL.md:347:- `SESSION_OUTCOMES`: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`
.opencode/skill/sk-improve-agent/SKILL.md:353:- Auto mode emits `session_start` after `step_record_baseline`, then emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop iteration, and finally emits `session_end` after synthesis.
.opencode/skill/sk-improve-agent/SKILL.md:354:- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21:const STOP_REASONS = Object.freeze({
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:35:const SESSION_OUTCOMES = Object.freeze({
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47:const VALID_EVENT_TYPES = Object.freeze([
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:52:  'candidate_scored',
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:54:  'gate_evaluation',
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:62:  'trade_off_detected',
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:65:  'session_ended',
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:66:  'session_end',
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:87:  } else if (!VALID_EVENT_TYPES.includes(event.eventType)) {
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:88:    errors.push(`Invalid eventType: "${event.eventType}". Valid types: ${VALID_EVENT_TYPES.join(', ')}`);
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:91:  if (event.eventType === 'session_ended' || event.eventType === 'session_end') {
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:93:      errors.push('session_ended/session_end events MUST include details.stopReason');
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:94:    } else if (!Object.values(STOP_REASONS).includes(event.details.stopReason)) {
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:95:      errors.push(`Invalid stopReason: "${event.details.stopReason}". Valid reasons: ${Object.values(STOP_REASONS).join(', ')}`);
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:98:      errors.push('session_ended/session_end events MUST include details.sessionOutcome');
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:99:    } else if (!Object.values(SESSION_OUTCOMES).includes(event.details.sessionOutcome)) {
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:100:      errors.push(`Invalid sessionOutcome: "${event.details.sessionOutcome}". Valid outcomes: ${Object.values(SESSION_OUTCOMES).join(', ')}`);
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:186: * Get the stop reason from the last session_ended event.
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:194:    (e) => e.eventType === 'session_ended' || e.eventType === 'session_end'
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:211:  STOP_REASONS,
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:212:  SESSION_OUTCOMES,
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:213:  VALID_EVENT_TYPES,
.opencode/command/improve/agent.md:304:# candidate_scored after scoring completes
.opencode/command/improve/agent.md:305:# gate_evaluation after stop-check or operator-gate evaluation
.opencode/command/improve/agent.md:309:# node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_end --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{"stopReason":"blockedStop","sessionOutcome":"advisoryOnly","endedAt":"2026-04-11T12:05:00Z","totalIterations":3}'

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/SKILL.md | sed -n '260,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/command/improve/agent.md | sed -n '292,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	
   261	### Audit Journal Protocol
   262	
   263	All journal emission is orchestrator-only (ADR-001). The journal (`improvement-journal.jsonl`) is an append-only JSONL file capturing lifecycle events. Separate from the existing `agent-improvement-state.jsonl` which tracks proposal/evaluation data.
   264	
   265	**Script**: `scripts/improvement-journal.cjs`
   266	
   267	Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`
   268	
   269	### Legal-Stop Gate Bundles
   270	
   271	A session may NOT claim `converged` unless ALL gate bundles pass:
   272	
   273	| Gate Bundle | Conditions |
   274	| --- | --- |
   275	| `contractGate` | structural >= 90 AND systemFitness >= 90 |
   276	| `behaviorGate` | ruleCoherence >= 85 AND outputQuality >= 85 |
   277	| `integrationGate` | integration >= 90 AND no drift ambiguity |
   278	| `evidenceGate` | benchmark pass AND repeatability pass |
   279	| `improvementGate` | weighted delta >= `scoring.thresholdDelta` |
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

 succeeded in 0ms:
   292	- Recommendation: continue, promote (if eligible), or stop
   293	
   294	### Step 6B: Journal Emission (Phase 005)
   295	
   296	At each journal boundary, the orchestrator MUST emit events via `improvement-journal.cjs`. The CLI entrypoint accepts `--emit`, `--journal`, and `--details`:
   297	
   298	```bash
   299	# At session start:
   300	node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --journal specs/042/008/improvement/improvement-journal.jsonl --details '{"sessionId":"imp-2026-04-11T12-00-00Z","target":"deep-research","charter":"...","startedAt":"2026-04-11T12:00:00Z"}'
   301	
   302	# At iteration boundaries:
   303	# candidate_generated after the candidate is written
   304	# candidate_scored after scoring completes
   305	# gate_evaluation after stop-check or operator-gate evaluation
   306	# The CLI form carries boundary metadata inside details because the helper's CLI does not expose top-level iteration/candidate fields.
   307	
   308	# At session end:
   309	# node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_end --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{"stopReason":"blockedStop","sessionOutcome":"advisoryOnly","endedAt":"2026-04-11T12:05:00Z","totalIterations":3}'
   310	```
   311	
   312	### Step 6C: Stop-Reason Reporting (Phase 005)
   313	
   314	After loop exits, classify the termination:
   315	
   316	**stopReason** (WHY):
   317	- `converged` — All legal-stop gate bundles passed
   318	- `maxIterationsReached` — Hit `max_iterations` limit
   319	- `blockedStop` — Convergence math triggered but gate bundles failed
   320	- `manualStop` — User cancelled

exec
/bin/zsh -lc "nl -ba .opencode/command/improve/assets/improve_improve-agent_confirm.yaml | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/command/improve/assets/improve_improve-agent_auto.yaml | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# ─────────────────────────────────────────────────────────────────
     2	# AGENT IMPROVER: EVALUATION LOOP (AUTONOMOUS MODE)
     3	# ─────────────────────────────────────────────────────────────────
     4	role: Agent Improvement Specialist using sk-improve-agent autonomously
     5	purpose: Integration-aware agent evaluation with 5-dimension scoring, deterministic benchmarks, and guarded promotion
     6	action: Scan integration surfaces, generate dynamic profiles, score candidates across 5 dimensions, reduce evidence, and decide keep/reject/promote
     7	
     8	# ─────────────────────────────────────────────────────────────────
     9	# OPERATING MODE
    10	# ─────────────────────────────────────────────────────────────────
    11	operating_mode:
    12	  workflow: iterative_evaluation_loop
    13	  workflow_compliance: MANDATORY
    14	  workflow_execution: autonomous
    15	  approvals: none
    16	  tracking: append_only_jsonl_ledger
    17	  validation: 5_dimension_deterministic_scoring
    18	  promotion: guarded_canonical_only
    19	  description: |
    20	    Executes the agent improvement loop without step-by-step approval.
    21	    Each iteration: scan integration -> propose candidate -> score across 5 dimensions -> benchmark -> reduce -> decide.
    22	    Stops when: max iterations reached, all dimensions plateau (3+ identical scores),
    23	    infra failures exceed threshold, or reducer signals shouldStop.
    24	
    25	# ─────────────────────────────────────────────────────────────────
    26	# EVALUATION PHILOSOPHY
    27	# ─────────────────────────────────────────────────────────────────
    28	evaluation_philosophy:
    29	  principle: "Prove improvement before mutation"
    30	  approach: "Integration-aware 5-dimension evaluation with deterministic scoring"
    31	  mandate: "Every candidate is bounded, every score is repeatable, every decision is auditable"
    32	
    33	# ─────────────────────────────────────────────────────────────────
    34	# USER INPUTS
    35	# ─────────────────────────────────────────────────────────────────
    36	user_inputs:
    37	  target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .opencode/agent/*.md."
    38	  target_profile: "[TARGET_PROFILE] - Profile ID: handover, context-prime, or dynamic. Auto-derived from target_path if not explicit."
    39	  scoring_mode: "[SCORING_MODE] - 'dynamic' for 5-dimension any-agent scoring, 'static' for legacy keyword profiles. Default: dynamic."
    40	  spec_folder: "[SPEC_FOLDER] - Spec folder path for improvement runtime. REQUIRED."
    41	  max_iterations: "[MAX_ITERATIONS] - Maximum loop iterations before forced stop. Default: 5."
    42	  execution_mode: "[EXECUTION_MODE] - AUTONOMOUS or INTERACTIVE. Derived from :auto/:confirm suffix."
    43	
    44	# ─────────────────────────────────────────────────────────────────
    45	# FIELD HANDLING
    46	# ─────────────────────────────────────────────────────────────────
    47	field_handling:
    48	  # Field mapping: target_path -> target_profile (inferred), agent_name (basename without .md)
    49	  defaults:
    50	    scoring_mode_empty: "dynamic"
    51	    max_iterations_empty: "5"
    52	    target_profile_empty: "Derive from target_path: handover -> handover, context-prime -> context-prime, anything else -> dynamic"
    53	  validation:
    54	    target_path_required: true
    55	    spec_folder_required: true
    56	    target_path_must_exist: true
    57	    target_path_must_be_agent: "Must match .opencode/agent/*.md pattern"
    58	
    59	# ─────────────────────────────────────────────────────────────────
    60	# CONTEXT LOADING
    61	# ─────────────────────────────────────────────────────────────────
    62	context_loading:
    63	  trigger: "At workflow START, before phase_init"
    64	  mcp_integration:
    65	    tool: memory_search
    66	    note: "Call MCP tools directly - NEVER through Code Mode"
    67	    parameters: { query: "agent improvement context for {agent_name}", specFolder: "{spec_folder}", anchors: ['summary', 'decisions', 'state', 'improvement'] }
    68	  command_reference: "/memory:search"
    69	  when_to_skip: ["First-time evaluation of this agent", "User explicitly says 'skip context' or 'fresh start'", "No spec folder context exists"]
    70	  behavior:
    71	    if_context_found: "Surface prior improvement history, best-known scores, and dimensional trends before first iteration"
    72	    if_no_context: "Proceed to phase_init without delay"
    73	
    74	# ─────────────────────────────────────────────────────────────────
    75	# SKILL REFERENCE
    76	# ─────────────────────────────────────────────────────────────────
    77	skill_reference:
    78	  skill: sk-improve-agent
    79	  skill_md: .opencode/skill/sk-improve-agent/SKILL.md
    80	  templates:
    81	    config: .opencode/skill/sk-improve-agent/assets/improvement_config.json
    82	    strategy: .opencode/skill/sk-improve-agent/assets/improvement_strategy.md
    83	    charter: .opencode/skill/sk-improve-agent/assets/improvement_charter.md
    84	    manifest: .opencode/skill/sk-improve-agent/assets/target_manifest.jsonc
    85	  scripts:
    86	    scanner: .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
    87	    profiler: .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs
    88	    scorer: .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs
    89	    benchmark: .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs
    90	    journal: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs
    91	    reducer: .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
    92	
    93	# ─────────────────────────────────────────────────────────────────
    94	# STATE PATHS
    95	# ─────────────────────────────────────────────────────────────────
    96	state_paths:
    97	  runtime_root: "{spec_folder}/improvement"
    98	  candidates_root: "{spec_folder}/improvement/candidates"
    99	  config: "{spec_folder}/improvement/agent-improvement-config.json"
   100	  state_log: "{spec_folder}/improvement/agent-improvement-state.jsonl"
   101	  strategy: "{spec_folder}/improvement/agent-improvement-strategy.md"
   102	  charter: "{spec_folder}/improvement/agent-improvement-charter.md"
   103	  manifest: "{spec_folder}/improvement/target-manifest.jsonc"
   104	  dashboard: "{spec_folder}/improvement/agent-improvement-dashboard.md"
   105	  registry: "{spec_folder}/improvement/experiment-registry.json"
   106	  integration_report: "{spec_folder}/improvement/integration-report.json"
   107	  benchmark_root: "{spec_folder}/improvement/benchmark-runs/{target_profile}"
   108	
   109	# ─────────────────────────────────────────────────────────────────
   110	# WORKFLOW
   111	# ─────────────────────────────────────────────────────────────────
   112	workflow:
   113	  phase_init:
   114	    description: "Create runtime structure, scan integration surfaces, record baseline"
   115	    steps:
   116	      step_create_directories:
   117	        description: "Create improvement runtime directories"
   118	        command: "mkdir -p {spec_folder}/improvement/candidates {spec_folder}/improvement/benchmark-runs/{target_profile}"
   119	      step_scan_integration:
   120	        description: "Map all surfaces the target agent touches across the repo"

 succeeded in 0ms:
     1	# ─────────────────────────────────────────────────────────────────
     2	# AGENT IMPROVER: EVALUATION LOOP (INTERACTIVE MODE)
     3	# ─────────────────────────────────────────────────────────────────
     4	role: Agent Improvement Specialist using sk-improve-agent with operator approval
     5	purpose: Integration-aware agent evaluation with 5-dimension scoring, deterministic benchmarks, and guarded promotion
     6	action: Scan integration surfaces, generate dynamic profiles, score candidates across 5 dimensions, reduce evidence, and pause at each decision gate
     7	
     8	# ─────────────────────────────────────────────────────────────────
     9	# OPERATING MODE
    10	# ─────────────────────────────────────────────────────────────────
    11	operating_mode:
    12	  workflow: iterative_evaluation_loop
    13	  workflow_compliance: MANDATORY
    14	  workflow_execution: interactive
    15	  approvals: multi_gate
    16	  tracking: append_only_jsonl_ledger
    17	  validation: 5_dimension_deterministic_scoring
    18	  promotion: guarded_canonical_only
    19	  description: |
    20	    Executes the agent improvement loop with operator approval gates at key decision points.
    21	    Each iteration: scan integration -> propose candidate -> score across 5 dimensions -> benchmark -> reduce -> present gate.
    22	    The operator controls progression: approve each candidate generation, review scores before continuing,
    23	    and explicitly authorize any promotion. Stops when: operator chooses stop, max iterations reached,
    24	    all dimensions plateau (3+ identical scores), infra failures exceed threshold, or reducer signals shouldStop.
    25	
    26	# ─────────────────────────────────────────────────────────────────
    27	# EVALUATION PHILOSOPHY
    28	# ─────────────────────────────────────────────────────────────────
    29	evaluation_philosophy:
    30	  principle: "Prove improvement before mutation"
    31	  approach: "Integration-aware 5-dimension evaluation with deterministic scoring"
    32	  mandate: "Every candidate is bounded, every score is repeatable, every decision is auditable"
    33	
    34	# ─────────────────────────────────────────────────────────────────
    35	# USER INPUTS
    36	# ─────────────────────────────────────────────────────────────────
    37	user_inputs:
    38	  target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .opencode/agent/*.md."
    39	  target_profile: "[TARGET_PROFILE] - Profile ID: handover, context-prime, or dynamic. Auto-derived from target_path if not explicit."
    40	  scoring_mode: "[SCORING_MODE] - 'dynamic' for 5-dimension any-agent scoring, 'static' for legacy keyword profiles. Default: dynamic."
    41	  spec_folder: "[SPEC_FOLDER] - Spec folder path for improvement runtime. REQUIRED."
    42	  max_iterations: "[MAX_ITERATIONS] - Maximum loop iterations before forced stop. Default: 5."
    43	  execution_mode: "[EXECUTION_MODE] - AUTONOMOUS or INTERACTIVE. Derived from :auto/:confirm suffix."
    44	
    45	# ─────────────────────────────────────────────────────────────────
    46	# FIELD HANDLING
    47	# ─────────────────────────────────────────────────────────────────
    48	field_handling:
    49	  # Field mapping: target_path -> target_profile (inferred), agent_name (basename without .md)
    50	  defaults:
    51	    scoring_mode_empty: "dynamic"
    52	    max_iterations_empty: "5"
    53	    target_profile_empty: "Derive from target_path: handover -> handover, context-prime -> context-prime, anything else -> dynamic"
    54	  validation:
    55	    target_path_required: true
    56	    spec_folder_required: true
    57	    target_path_must_exist: true
    58	    target_path_must_be_agent: "Must match .opencode/agent/*.md pattern"
    59	
    60	# ─────────────────────────────────────────────────────────────────
    61	# CONTEXT LOADING
    62	# ─────────────────────────────────────────────────────────────────
    63	context_loading:
    64	  trigger: "At workflow START, before phase_init"
    65	  mcp_integration:
    66	    tool: memory_search
    67	    note: "Call MCP tools directly - NEVER through Code Mode"
    68	    parameters: { query: "agent improvement context for {agent_name}", specFolder: "{spec_folder}", anchors: ['summary', 'decisions', 'state', 'improvement'] }
    69	  command_reference: "/memory:search"
    70	  when_to_skip: ["First-time evaluation of this agent", "User explicitly says 'skip context' or 'fresh start'", "No spec folder context exists"]
    71	  behavior:
    72	    if_context_found: "Surface prior improvement history, best-known scores, and dimensional trends before first iteration"
    73	    if_no_context: "Proceed to phase_init without delay"
    74	  checkpoint:
    75	    question: "Prior improvement context found for this agent. Load it?"
    76	    options:
    77	      - { label: "A) Load context", description: "Review prior scores and improvement history" }
    78	      - { label: "B) Skip", description: "Start fresh without prior context" }
    79	
    80	# ─────────────────────────────────────────────────────────────────
    81	# SKILL REFERENCE
    82	# ─────────────────────────────────────────────────────────────────
    83	skill_reference:
    84	  skill: sk-improve-agent
    85	  skill_md: .opencode/skill/sk-improve-agent/SKILL.md
    86	  templates:
    87	    config: .opencode/skill/sk-improve-agent/assets/improvement_config.json
    88	    strategy: .opencode/skill/sk-improve-agent/assets/improvement_strategy.md
    89	    charter: .opencode/skill/sk-improve-agent/assets/improvement_charter.md
    90	    manifest: .opencode/skill/sk-improve-agent/assets/target_manifest.jsonc
    91	  scripts:
    92	    scanner: .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
    93	    profiler: .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs
    94	    scorer: .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs
    95	    benchmark: .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs
    96	    journal: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs
    97	    reducer: .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
    98	
    99	# ─────────────────────────────────────────────────────────────────
   100	# STATE PATHS
   101	# ─────────────────────────────────────────────────────────────────
   102	state_paths:
   103	  runtime_root: "{spec_folder}/improvement"
   104	  candidates_root: "{spec_folder}/improvement/candidates"
   105	  config: "{spec_folder}/improvement/agent-improvement-config.json"
   106	  state_log: "{spec_folder}/improvement/agent-improvement-state.jsonl"
   107	  strategy: "{spec_folder}/improvement/agent-improvement-strategy.md"
   108	  charter: "{spec_folder}/improvement/agent-improvement-charter.md"
   109	  manifest: "{spec_folder}/improvement/target-manifest.jsonc"
   110	  dashboard: "{spec_folder}/improvement/agent-improvement-dashboard.md"
   111	  registry: "{spec_folder}/improvement/experiment-registry.json"
   112	  integration_report: "{spec_folder}/improvement/integration-report.json"
   113	  benchmark_root: "{spec_folder}/improvement/benchmark-runs/{target_profile}"
   114	
   115	# ─────────────────────────────────────────────────────────────────
   116	# WORKFLOW
   117	# ─────────────────────────────────────────────────────────────────
   118	workflow:
   119	  phase_init:
   120	    description: "Create runtime structure, scan integration surfaces, present init gate, record baseline"

exec
/bin/zsh -lc "rg -n \"032-journal-wiring|033-insufficient-sample|034-replay-consumer|v1\\.1\\.0\\.0|v1\\.2\\.0\\.0|v1\\.2\\.1\\.0|agent-improver\\.md|improve-agent\\.md\" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:27:| **Primary Release Note** | `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:28:| **Follow-on Correction** | `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:40:The phase added `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` and published the surrounding runtime-truth contract through `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/command/improve/agent.md`, and `.opencode/agent/improve-agent.md`. The journal gave the loop an append-only event stream and kept the write path outside the proposal agent so the evaluator-first model stayed intact.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:60:The implementation landed in commit `080cf549e`, which records the five helper scripts, the five dedicated test files, and the asset plus command updates. The shipped outcome was then documented in `v1.1.0.0`, which records:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:67:Later on the packet family corrected one important documentation drift: `v1.2.1.0` explicitly retracted a multi-session lifecycle contract that had been documented but not actually wired. This closeout packet reflects that later correction so Phase 005 is recorded as shipped without silently preserving superseded lifecycle claims.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:101:Verification evidence for the shipped runtime lives in `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md`. Verification evidence for the later lifecycle wording correction lives in `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:110:2. `v1.1.0.0` documented broader lifecycle semantics than the runtime actually shipped; `v1.2.1.0` later narrowed that wording to current reality.

exec
/bin/zsh -lc 'rg -n "graph" .opencode/skill/sk-improve-agent/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
67:| Mutation coverage graph | Tracks explored dimensions and tried mutation types via a coverage graph with `loop_type: "improvement"` namespace, preventing re-exploration of exhausted mutations |
69:| Candidate lineage | Maintains a directed graph of candidate proposals across iterations, tracking session-id, wave-index, spawning mutation type, and parent references |

exec
/bin/zsh -lc "rg -n \"v1\\.1\\.0\\.0|v1\\.2\\.0\\.0|v1\\.2\\.1\\.0|changelog\" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/*" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg -n \"coverage-graph-db\\.ts|VALID_RELATIONS|TS_VALID_RELATIONS|IMPORTANT: If coverage-graph-db\\.ts changes, these must be updated|do not need to import the TS module\" .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
7: *   - TS/MCP layer: coverage-graph-db.ts (types and constants)
70: * These constants mirror the VALID_RELATIONS and weight maps from
71: * coverage-graph-db.ts. We define them here as test fixtures so we
72: * do not need to import the TS module (which depends on better-sqlite3).
74: * IMPORTANT: If coverage-graph-db.ts changes, these must be updated.
77:const TS_VALID_RELATIONS = {
119:    it('CJS RESEARCH_RELATION_WEIGHTS keys match TS VALID_RELATIONS.research', () => {
121:      const tsRelations = [...TS_VALID_RELATIONS.research].sort();
145:      const tsRelations = new Set(TS_VALID_RELATIONS.review);
155:      const tsRelations = new Set(TS_VALID_RELATIONS.review);
165:      const tsOnlyRelations = [...TS_VALID_RELATIONS.review].filter(r => !cjsRelations.has(r));
271:      const selfLoopConstraintDocumented = true; // From reading coverage-graph-db.ts line 178
302:    it('TS VALID_RELATIONS has separate entries for research and review', () => {
303:      expect(TS_VALID_RELATIONS.research).toBeDefined();
304:      expect(TS_VALID_RELATIONS.review).toBeDefined();
305:      expect(TS_VALID_RELATIONS.research).not.toEqual(TS_VALID_RELATIONS.review);
310:      const reviewRelations = new Set(TS_VALID_RELATIONS.review);
319:      const researchRelations = new Set(TS_VALID_RELATIONS.research);
328:      const researchSet = new Set(TS_VALID_RELATIONS.research);
329:      const reviewSet = new Set(TS_VALID_RELATIONS.review);

codex
I’ve narrowed this to four concrete traceability problems rather than broad “docs feel off” feedback: one overstatement in the Phase `005` summary, one phase-ownership collision between `005` and `006`, one cross-layer test that isn’t actually tied to the live TS contract, and one set of stale changelog paths/contracts. I’m grabbing one last bit of line-level evidence from the live mirror file so the final report can stay precise.
exec
/bin/zsh -lc "nl -ba .opencode/agent/improve-agent.md | sed -n '1,40p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md | sed -n '15,25p;41,55p;58,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: improve-agent
     3	description: Proposal-only mutator for bounded improve-agent candidate generation with evaluator-first rules
     4	mode: subagent
     5	temperature: 0.2
     6	permission:
     7	  read: allow
     8	  write: allow
     9	  edit: allow
    10	  bash: allow
    11	  grep: allow
    12	  glob: allow
    13	  webfetch: deny
    14	  memory: deny
    15	  chrome_devtools: deny
    16	  task: deny
    17	  list: allow
    18	  patch: deny
    19	  external_directory: allow
    20	---
    21	
    22	# The Recursive Agent: Proposal-Only Mutator
    23	
    24	Proposal-only mutator for bounded improve-agent experiments. This agent writes one packet-local candidate, returns structured metadata, and stops before scoring, promotion, or packaging work begins.
    25	
    26	**CRITICAL**: This agent MUST stay proposal-only. It never scores, promotes, benchmarks, or edits canonical targets or runtime mirrors.
    27	
    28	**IMPORTANT**: Use `.opencode/agent/*.md` as the canonical runtime path reference. Runtime mirrors are downstream packaging concerns.
    29	
    30	---
    31	
    32	## 1. CORE WORKFLOW
    33	
    34	### Proposal-Only Candidate Generation
    35	
    36	1. **READ THE CONTROL BUNDLE** -> Read the copied charter and manifest before generating any candidate.
    37	2. **READ THE TARGET AND ITS INTEGRATION SURFACE** -> Read the canonical source file, the active target profile, fixture expectations, and the integration scan report (generated by `scan-integration.cjs`) to understand how the agent connects across the system.
    38	3. **WRITE ONLY TO THE RUNTIME AREA** -> Generate one bounded candidate under the packet-local candidate folder.
    39	4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, and change summary in machine-readable JSON.
    40	5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.

 succeeded in 0ms:
    15	### Stop-Reason Taxonomy and Audit Journal
    16	
    17	- Frozen `STOP_REASONS` enum published alongside a `SESSION_OUTCOMES` enum so improvement sessions report the exact gate that tripped (`convergedImprovement`, `benchmarkPlateau`, `rejectCandidate`, `blockedStop`, `maxIterationsReached`, `rollbackTriggered`, `manualStop`, `error`).
    18	- Added `scripts/improvement-journal.cjs` — append-only JSONL journal with event-type validation. Event types: `session_start`, `candidate_generated`, `scored`, `gate_evaluation`, `session_end`. `session_ended` requires `stopReason` and `sessionOutcome`.
    19	- Journal emission is **orchestrator-only** so the proposal-only agent constraint (ADR-001) is preserved — the improver never writes its own audit trail.
    20	- A CLI entrypoint (`node .../improvement-journal.cjs --emit <event-json> | --read <session>`) allows replay tools and tests to consume the journal directly.
    21	
    22	---
    23	
    24	### Mutation Coverage and Trade-Off Detection
    25	
    41	### Playbook and Operator Guidance
    42	
    43	- Added a new `07--runtime-truth/` playbook category with seven scenarios (`025-stop-reason-taxonomy.md` through `031-parallel-candidates-opt-in.md`) covering the full runtime truth contract: stop reasons, audit journal, resume semantics, legal-stop gates, benchmark stability, dimension trajectory, and opt-in parallel candidates.
    44	- Added three graph-era scenarios under `06--end-to-end-loop/`: mutation coverage tracking (`022`), trade-off detection (`023`), and candidate lineage (`024`).
    45	- Every playbook scenario was executed against the updated runtime — **31/31 PASS**, covering both pre-existing loop scenarios and all new Phase 5 additions.
    46	
    47	---
    48	
    49	### Verification
    50	
    51	- New vitest coverage under `scripts/tests/`: `improvement-journal.vitest.ts`, `mutation-coverage.vitest.ts`, `trade-off-detector.vitest.ts`, `candidate-lineage.vitest.ts`, `benchmark-stability.vitest.ts`.
    52	- Five P1 review findings from the ten-iteration deep-review pass were closed: CLI entrypoint, reducer rejection enum, required stopReason/sessionOutcome, scanner output mapping, scoreDynamic weights override.
    53	- Full vitest suite green (10,335 passing, 0 failing).
    54	- Backward compatibility verified: existing sessions without new config fields still run to completion.
    55	
    58	## Files Changed
    59	
    60	| File                                                                                                                     | Action   | Description                                                                                   |
    61	| ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------- |
    62	| `.opencode/skill/sk-improve-agent/SKILL.md`                                                                              | Modified | Bumped version to 1.1.0.0 and published stop-reason taxonomy, journal, graph, and trade-off guidance |
    63	| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`                                                       | Created  | Append-only JSONL audit journal with frozen enums and CLI entrypoint                          |
    64	| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs`                                                         | Created  | Mutation coverage graph (loop_type "improvement" namespace)                                   |
    65	| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`                                                        | Created  | Pareto-aware dimension trade-off detection                                                    |
    66	| `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs`                                                         | Created  | Directed candidate lineage graph                                                              |
    67	| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs`                                                       | Created  | Benchmark stability coefficient scoring                                                       |
    68	| `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`                                           | Created  | Vitest coverage for journal append/replay and enum validation                                 |
    69	| `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts`                                             | Created  | Vitest coverage for coverage graph                                                            |
    70	| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts`                                            | Created  | Vitest coverage for trade-off detection                                                       |
    71	| `.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts`                                             | Created  | Vitest coverage for lineage graph                                                             |
    72	| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts`                                           | Created  | Vitest coverage for stability scoring                                                         |
    73	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`   | Created  | Playbook: mutation coverage graph tracking                                                    |
    74	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`                | Created  | Playbook: trade-off detection                                                                 |
    75	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md`                  | Created  | Playbook: candidate lineage                                                                   |
    76	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md`                 | Created  | Playbook: stop-reason taxonomy                                                                |
    77	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/026-audit-journal-emission.md`               | Created  | Playbook: audit journal emission                                                              |
    78	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md`                  | Created  | Playbook: resume continuation                                                                 |
    79	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md`                     | Created  | Playbook: legal-stop gates                                                                    |
    80	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/029-benchmark-stability.md`                  | Created  | Playbook: benchmark stability                                                                 |
    81	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md`                 | Created  | Playbook: dimension trajectory                                                                |
    82	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/031-parallel-candidates-opt-in.md`           | Created  | Playbook: opt-in parallel candidates                                                          |
    83	| `.opencode/skill/sk-improve-agent/assets/*`                                                                              | Renamed  | Asset tree migrated from `sk-agent-improver` namespace                                        |
    84	| `.opencode/command/improve/agent.md`                                                                                     | Modified | Documented stop-reason taxonomy, journal, and promotion gates                                 |
    85	| `.opencode/command/improve/assets/improve_agent-improver_auto.yaml`                                                      | Modified | Wired journal emission and legal-stop evaluation in auto mode                                 |
    86	| `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml`                                                   | Modified | Mirrored the same runtime truth contract in confirm mode                                      |
    87	| `.opencode/agent/agent-improver.md`                                                                                      | Modified | Aligned OpenCode runtime mirror with the proposal-only + journal model                        |
    88	
    89	---
    90	

exec
/bin/zsh -lc "nl -ba .opencode/changelog/15--sk-improve-agent/v1.2.0.0.md | sed -n '1,20p;42,78p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md | sed -n '30,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    30	## What Was Built
    31	
    32	This phase gave the coverage-graph runtime the verification layer it needed after the Phase 002 runtime landed. You can now find dedicated automated suites for graph contract alignment and larger-graph stress coverage, plus graph-specific manual playbook scenarios across the research, review, and improve-agent loop families.
    33	
    34	### Verification Surface
    35	
    36	| File | Action | Purpose |
    37	|------|--------|---------|
    38	| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Created | Verifies cross-layer graph contract alignment |
    39	| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` | Created | Exercises larger graph workloads and contradiction scanning |
    40	| Research graph playbooks | Created | Add operator scenarios for graph convergence and `graphEvents` emission |
    41	| Review graph playbooks | Created | Add operator scenarios for graph convergence and `graphEvents` emission |
    42	| Improve-agent graph playbooks | Created | Add operator scenarios for mutation coverage, trade-off detection, and candidate lineage |
    43	| Three skill READMEs | Modified | Surface graph capability coverage where it was previously missing |
    44	<!-- /ANCHOR:what-built -->
    45	
    46	---
    47	
    48	<!-- ANCHOR:how-delivered -->
    49	## How It Was Delivered
    50	
    51	The work followed the verification surface itself. First, the CommonJS and TypeScript graph layers were identified as the two sides of the contract that needed automated coverage. Then the graph-specific playbook files were located and confirmed under the live skill trees. Finally, the packet was rebuilt in the current Level 2 template so the delivered verification surface, README alignment, and phase-closeout evidence all live in one place.
    52	<!-- /ANCHOR:how-delivered -->
    53	
    54	---
    55	
    56	<!-- ANCHOR:decisions -->
    57	## Key Decisions
    58	
    59	| Decision | Why |
    60	|----------|-----|
    61	| Keep Phase 006 verification-only | The graph runtime already existed; this phase needed to prove and document it rather than widen scope into new graph features. |
    62	| Cite the live playbook files directly | Those paths are the operator-facing verification surface and should stay obvious in the packet. |
    63	| Treat README updates as part of the verification surface | Graph capability coverage is incomplete if operators cannot discover it in the skill docs. |
    64	<!-- /ANCHOR:decisions -->
    65	
    66	---
    67	
    68	<!-- ANCHOR:verification -->
    69	## Verification
    70	
    71	| Check | Result |
    72	|-------|--------|
    73	| Graph integration suite present | PASS - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` |
    74	| Graph stress suite present | PASS - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts` |
    75	| Research graph playbooks present | PASS - `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` and `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md` |
    76	| Review graph playbooks present | PASS - `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` and `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md` |
    77	| Improve-agent graph playbooks present | PASS - `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md`, and `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md` |
    78	| README graph references captured | PASS - `.opencode/skill/sk-deep-research/README.md`, `.opencode/skill/sk-deep-review/README.md`, and `.opencode/skill/sk-improve-agent/README.md` cited in the packet |
    79	| Strict phase validation | PASS after packet rewrite |
    80	<!-- /ANCHOR:verification -->

 succeeded in 0ms:
     1	## [**1.2.0.0**] - 2026-04-11
     2	
     3	This release lands Phase 008 of the 042 Deep Research & Review Runtime Improvement Bundle for `sk-improve-agent`. The skill now (a) actually calls `improvement-journal.cjs` from the visible `/improve:agent` YAML workflow at every iteration boundary, (b) enforces minimum sample sizes before trade-off and stability verdicts, and (c) implements ADR-002 Option A by reading `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` during reducer refresh. The visible operator path now emits the richer runtime-truth state the v1.1.0.0 contract promised.
     4	
     5	---
     6	
     7	### Journal Wiring (REQ-004, REQ-005)
     8	
     9	- `improve_agent-improver_{auto,confirm}.yaml` now invoke `improvement-journal.cjs` at three boundary points: session start, every iteration boundary (candidate generated → scored → gate evaluation), and session end. The orchestrator-only constraint is preserved — the proposal-only agent still never writes journal rows itself.
    10	- The malformed `--event=session_initialized` CLI example in `.opencode/command/improve/agent.md` is fixed. The working form is `--emit session_start --payload '<json>'` matching the helper's actual interface.
    11	- `SKILL.md` adds a new "Journal Wiring Contract" section documenting the three boundary points, the frozen `STOP_REASONS` / `SESSION_OUTCOMES` enums (aligned to the helper's actual validator: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery` / `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`), and the orchestrator-only emission rule.
    12	
    13	---
    14	
    15	### Sample-Size Enforcement (REQ-006, REQ-007)
    16	
    17	- `trade-off-detector.cjs` now requires `minDataPoints` (default: 3, env-overridable) before reporting a trade-off. Below threshold, returns `{state: "insufficientData", dataPoints: n, minRequired: 3}` instead of fabricating confidence from 2 points. Exports `MIN_DATA_POINTS_DEFAULT = 3`.
    18	- `benchmark-stability.cjs` now requires `minReplayCount` (default: 3). Below threshold, returns `{state: "insufficientSample", replayCount: n, minRequired: 3}` and treats that state as "not stable" in `isStable()`. Exports `MIN_REPLAY_COUNT_DEFAULT = 3`.
    19	- Corresponding vitest updates: `tests/trade-off-detector.vitest.ts` (17 passing) and `tests/benchmark-stability.vitest.ts` (23 passing) now assert the new insufficient states AND validate configurable overrides.
    20	
    42	### Fixtures and Regression Coverage
    43	
    44	- New fixture: `scripts/tests/fixtures/low-sample-benchmark/` — a candidate session with 1 replay + 2-point trade-off trajectory + complete journal/lineage/coverage artifacts. Validates that helper smoke tests return `{state: "insufficientSample", replayCount: 1, minRequired: 3}` and `{state: "insufficientData", dataPoints: 2, minRequired: 3}` as expected.
    45	- Three new playbook scenarios under `manual_testing_playbook/07--runtime-truth/`:
    46	  - `032-journal-wiring.md` — verify YAML workflow calls journal helper at all boundaries
    47	  - `033-insufficient-sample.md` — verify insufficient-sample state propagation through dashboard
    48	  - `034-replay-consumer.md` — verify ADR-002 consumer path + graceful degradation on missing artifacts
    49	
    50	---
    51	
    52	### Verification
    53	
    54	- Phase 008 vitest runs: trade-off-detector (17/17), benchmark-stability (23/23) — all passing with new insufficient-state assertions.
    55	- Phase 008 full vitest suite: 12/12 across 4 new phase 008 suites.
    56	- Journal wiring end-to-end: YAML workflow confirmed to call `improvement-journal.cjs --emit` at session_start + iteration boundary + session_end.
    57	- CLI example verification: copy-paste `node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --payload '...'` from the fixed command doc — runs clean.
    58	
    59	---
    60	
    61	## Files Changed
    62	
    63	| File | Action | Description |
    64	| ---- | ------ | ----------- |
    65	| `.opencode/skill/sk-improve-agent/SKILL.md` | Modified | Bumped version to 1.2.0.0 + added Journal Wiring Contract + ADR-002 Consumer + Sample Quality sections |
    66	| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Modified | minDataPoints=3 default, insufficientData state, MIN_DATA_POINTS_DEFAULT export |
    67	| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Modified | minReplayCount=3 default, insufficientSample state, MIN_REPLAY_COUNT_DEFAULT export |
    68	| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Modified | ADR-002 replay consumer (journal + lineage + coverage reads); insufficient-state propagation; Sample Quality dashboard section |
    69	| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` | Modified | Asserts insufficientData state (17/17 passing) |
    70	| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` | Modified | Asserts insufficientSample state (23/23 passing) |
    71	| `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/*` | Created | Durable fixture for insufficient-sample states |
    72	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md` | Created | Manual test for journal wiring end-to-end |
    73	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md` | Created | Manual test for insufficient-sample propagation |
    74	| `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` | Created | Manual test for ADR-002 replay consumer + graceful degradation |
    75	| `.opencode/command/improve/assets/improve_agent-improver_auto.yaml` | Modified | Wired step_emit_journal_event at session_start + iteration + session_end |
    76	| `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml` | Modified | Mirrored the same journal wiring in confirm mode |
    77	| `.opencode/command/improve/agent.md` | Modified | Fixed malformed `--event=session_initialized` → `--emit session_start --payload '...'` CLI example |
    78	

codex
**Findings**
1. `F-011-001`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:40,60-67`; `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:3,7-11`
Title: Phase 005 summary attributes visible journaled runtime to the wrong release
Description: The Phase 005 summary says the journal “gave the loop an append-only event stream” and treats `v1.1.0.0` as the shipped runtime-truth evidence. But `v1.2.0.0` explicitly says Phase 008 is when the visible `/improve:agent` workflow “actually calls `improvement-journal.cjs`” and that the operator path only then emits the richer state promised earlier. That collapses “helper files existed in Phase 005” with “workflow wiring became real in Phase 008,” so the packet currently overstates what Phase 005 delivered.
Evidence: `implementation-summary.md:40` says the journal gave the loop an event stream; `implementation-summary.md:60-67` treats `v1.1.0.0` as shipped outcome; `v1.2.0.0:3,9-11` says journal wiring and helper-aligned enums landed later.
Recommendation: Reword Phase 005 to distinguish helper/module delivery from later workflow wiring, and cite `v1.2.0.0` as the follow-on release that made journal emission true on the visible operator path.

2. `F-011-002`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:40-42,77`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:46-49,97`; `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:43-45,73-75`
Title: Phase 006 claims ownership of improve-agent playbooks already attributed to Phase 005
Description: Phase 006 says the improve-agent graph playbooks were “Created,” but Phase 005 already claims those same `022-024` playbooks as part of its delivered runtime-truth surface, and the `v1.1.0.0` release note also records them there. Two phases claiming creation of the same files makes the audit trail ambiguous and weakens phase-to-artifact lineage.
Evidence: `006 implementation-summary.md:40-42` marks improve-agent graph playbooks “Created”; `005 implementation-summary.md:46-49` says Phase 005 added the same playbook scenarios; `v1.1.0.0:43-45,73-75` also attributes `022-024` to the Phase 005 release.
Recommendation: Change Phase 006 wording from “Created” to “validated/cross-referenced” for `022-024`, or explicitly note that those files were introduced in Phase 005 and only audited as part of the broader graph-verification pass in Phase 006.

3. `F-011-003`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:70-76`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md:94-95`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:38-39`
Title: The “integration” suite does not verify the live TypeScript contract it claims to cover
Description: The Phase 006 packet says `coverage-graph-integration.vitest.ts` proves CommonJS/TypeScript graph-contract alignment, but the test hardcodes `TS_VALID_RELATIONS` and weight maps instead of reading `coverage-graph-db.ts`. The file itself states those constants “must be updated” manually. That means the suite is checking CJS against an inline snapshot, not against the authoritative live TS contract, so the packet overstates the suite’s traceability value.
Evidence: `coverage-graph-integration.vitest.ts:70-76` says the TS constants are mirrored test fixtures and are not imported from the TS module; `spec.md:94-95` and `implementation-summary.md:38-39` describe the suite as cross-layer alignment proof.
Recommendation: Replace the frozen inline TS fixture with a generated/shared contract artifact or a real parse/import of the authoritative TS contract so the suite fails when the live TS layer drifts.

4. `F-011-004`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:17-20`; `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-28,47-67,242-259`; `.opencode/skill/sk-improve-agent/SKILL.md:326-349`
Title: The primary Phase 005 changelog records a journal contract that does not match the shipped helper
Description: `v1.1.0.0` documents stop reasons such as `convergedImprovement` and `benchmarkPlateau`, lists event `scored`, and describes a CLI shape of `--emit <event-json> | --read <session>`. The live helper and skill contract instead use `converged`, `candidate_scored`, and `--emit <eventType> --journal <path> --details '<json>'`. Because the Phase 005 summary points to `v1.1.0.0` as its primary release note, auditors following that artifact are led to the wrong runtime-truth contract.
Evidence: `v1.1.0.0:17-20` vs `improvement-journal.cjs:21-28,47-67,242-259` and `SKILL.md:326-349`.
Recommendation: Append a correction note to `v1.1.0.0` or change the Phase 005 packet to treat `v1.1.0.0` as historical helper-delivery evidence only, with the helper contract sourced from the live `SKILL.md`/helper or the later corrective changelog.

**ITERATION SUMMARY**
Total findings: 4
Breakdown: `0 P0`, `4 P1`, `0 P2`

**COVERAGE ASSESSMENT**
About `95%` of the requested focus area. I reviewed the Phase 005 decision record and implementation summary, the Phase 006 implementation summary and supporting packet docs, the full `15--sk-improve-agent` changelog bundle relevant to these phases (`v1.1.0.0`, `v1.2.0.0`, `v1.2.1.0`), and the referenced live test/helper files. I also verified that all explicitly cited test/playbook files in this focus area do exist; the issues above are about attribution and contract accuracy, not missing files.

**CONFIDENCE**
`High`

**NEXT PRIORITIES**
1. Validate whether Phase 007-008 closeout docs repeat the same stale path/contract references now visible in the `15--sk-improve-agent` changelog chain.
2. Check whether any other “cross-layer alignment” suites in the bundle use frozen snapshots instead of authoritative live contracts.
3. If you want the next pass to stay in `traceability`, audit the historical verification counts (`31/31`, `10,335 passing`, `12/12`, `908 passing`) against preserved test logs or packet-local evidence, since I did not have raw run artifacts in this iteration.
hook: Stop
hook: Stop Completed
tokens used
153,236
**Findings**
1. `F-011-001`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:40,60-67`; `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md:3,7-11`
Title: Phase 005 summary attributes visible journaled runtime to the wrong release
Description: The Phase 005 summary says the journal “gave the loop an append-only event stream” and treats `v1.1.0.0` as the shipped runtime-truth evidence. But `v1.2.0.0` explicitly says Phase 008 is when the visible `/improve:agent` workflow “actually calls `improvement-journal.cjs`” and that the operator path only then emits the richer state promised earlier. That collapses “helper files existed in Phase 005” with “workflow wiring became real in Phase 008,” so the packet currently overstates what Phase 005 delivered.
Evidence: `implementation-summary.md:40` says the journal gave the loop an event stream; `implementation-summary.md:60-67` treats `v1.1.0.0` as shipped outcome; `v1.2.0.0:3,9-11` says journal wiring and helper-aligned enums landed later.
Recommendation: Reword Phase 005 to distinguish helper/module delivery from later workflow wiring, and cite `v1.2.0.0` as the follow-on release that made journal emission true on the visible operator path.

2. `F-011-002`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:40-42,77`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:46-49,97`; `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:43-45,73-75`
Title: Phase 006 claims ownership of improve-agent playbooks already attributed to Phase 005
Description: Phase 006 says the improve-agent graph playbooks were “Created,” but Phase 005 already claims those same `022-024` playbooks as part of its delivered runtime-truth surface, and the `v1.1.0.0` release note also records them there. Two phases claiming creation of the same files makes the audit trail ambiguous and weakens phase-to-artifact lineage.
Evidence: `006 implementation-summary.md:40-42` marks improve-agent graph playbooks “Created”; `005 implementation-summary.md:46-49` says Phase 005 added the same playbook scenarios; `v1.1.0.0:43-45,73-75` also attributes `022-024` to the Phase 005 release.
Recommendation: Change Phase 006 wording from “Created” to “validated/cross-referenced” for `022-024`, or explicitly note that those files were introduced in Phase 005 and only audited as part of the broader graph-verification pass in Phase 006.

3. `F-011-003`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:70-76`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md:94-95`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:38-39`
Title: The “integration” suite does not verify the live TypeScript contract it claims to cover
Description: The Phase 006 packet says `coverage-graph-integration.vitest.ts` proves CommonJS/TypeScript graph-contract alignment, but the test hardcodes `TS_VALID_RELATIONS` and weight maps instead of reading `coverage-graph-db.ts`. The file itself states those constants “must be updated” manually. That means the suite is checking CJS against an inline snapshot, not against the authoritative live TS contract, so the packet overstates the suite’s traceability value.
Evidence: `coverage-graph-integration.vitest.ts:70-76` says the TS constants are mirrored test fixtures and are not imported from the TS module; `spec.md:94-95` and `implementation-summary.md:38-39` describe the suite as cross-layer alignment proof.
Recommendation: Replace the frozen inline TS fixture with a generated/shared contract artifact or a real parse/import of the authoritative TS contract so the suite fails when the live TS layer drifts.

4. `F-011-004`
Severity: `P1`
Dimension: `traceability`
File: `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:17-20`; `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-28,47-67,242-259`; `.opencode/skill/sk-improve-agent/SKILL.md:326-349`
Title: The primary Phase 005 changelog records a journal contract that does not match the shipped helper
Description: `v1.1.0.0` documents stop reasons such as `convergedImprovement` and `benchmarkPlateau`, lists event `scored`, and describes a CLI shape of `--emit <event-json> | --read <session>`. The live helper and skill contract instead use `converged`, `candidate_scored`, and `--emit <eventType> --journal <path> --details '<json>'`. Because the Phase 005 summary points to `v1.1.0.0` as its primary release note, auditors following that artifact are led to the wrong runtime-truth contract.
Evidence: `v1.1.0.0:17-20` vs `improvement-journal.cjs:21-28,47-67,242-259` and `SKILL.md:326-349`.
Recommendation: Append a correction note to `v1.1.0.0` or change the Phase 005 packet to treat `v1.1.0.0` as historical helper-delivery evidence only, with the helper contract sourced from the live `SKILL.md`/helper or the later corrective changelog.

**ITERATION SUMMARY**
Total findings: 4
Breakdown: `0 P0`, `4 P1`, `0 P2`

**COVERAGE ASSESSMENT**
About `95%` of the requested focus area. I reviewed the Phase 005 decision record and implementation summary, the Phase 006 implementation summary and supporting packet docs, the full `15--sk-improve-agent` changelog bundle relevant to these phases (`v1.1.0.0`, `v1.2.0.0`, `v1.2.1.0`), and the referenced live test/helper files. I also verified that all explicitly cited test/playbook files in this focus area do exist; the issues above are about attribution and contract accuracy, not missing files.

**CONFIDENCE**
`High`

**NEXT PRIORITIES**
1. Validate whether Phase 007-008 closeout docs repeat the same stale path/contract references now visible in the `15--sk-improve-agent` changelog chain.
2. Check whether any other “cross-layer alignment” suites in the bundle use frozen snapshots instead of authoritative live contracts.
3. If you want the next pass to stay in `traceability`, audit the historical verification counts (`31/31`, `10,335 passing`, `12/12`, `908 passing`) against preserved test logs or packet-local evidence, since I did not have raw run artifacts in this iteration.
