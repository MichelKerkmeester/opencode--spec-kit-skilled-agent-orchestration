---
iteration: 4
dimension: maintainability
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:48:47Z
completedAt: 2026-04-12T09:53:22Z
---

# Deep Review Iteration 004 — maintainability

**Focus:** Phase 001-002 code structure: review 4 CJS shared libraries in .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs for module boundaries, error handling, function complexity, and export surface area. Check vitest coverage in scripts/tests/coverage-graph-*.vitest.ts files.

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
session id: 019d8118-00dc-7443-8d7f-6f028931c82b
--------
user
You are a senior code reviewer executing iteration 4 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: maintainability
FOCUS: Phase 001-002 code structure: review 4 CJS shared libraries in .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs for module boundaries, error handling, function complexity, and export surface area. Check vitest coverage in scripts/tests/coverage-graph-*.vitest.ts files.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for maintainability issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-004-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: maintainability
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
I’m treating this as a read-only deep-review pass focused on the four `coverage-graph-*.cjs` shared libraries and their Vitest coverage. I’ll load the relevant review guidance and prior context first, then inspect the implementation and tests closely for maintainability risks with exact file and line evidence.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "deep review maintainability review of .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs and scripts/tests/coverage-graph-*.vitest.ts" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 457ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-IKzw201K' (errno=Operation not permitted)
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, folder"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), opencode, review(name)"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), opencode~, review(name)"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !opencode, opencode(name), system"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
    "confidence": 0.82,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, kit(name), plan~, spec(name), specification~"
  }
]

codex
Skill routing points strongly to `sk-code-review` and `sk-deep-review`, so I’m using those review standards for this pass. I’m also doing a quick memory lookup for prior packet context, then I’ll read the target libraries and their tests line-by-line before drafting findings.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-review
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Select ONE dimension (from strategy "Next Focus")
  |                                         3. Review target code (read-only, 3-5 actions)
  |                                         4. Write iteration-NNN.md (P0/P1/P2 findings)
  |                                         5. Update deep-review-strategy.md
  |                                         6. Append deep-review-state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v

exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|coverage-graph|rvw-2026-04-11T13-50-06Z|rvw-2026-04-12T11-30-00Z" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
codex
I didn’t get anything useful from memory for this packet, so I’m staying grounded in the current tree. Next I’m mapping the exact library and test files, then I’ll inspect structure, exports, and assertion gaps together so the findings stay evidence-based.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts/lib scripts/tests | rg 'coverage-graph-.*\\.(cjs|vitest\\.ts)"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
rg: scripts/tests: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit | rg 'coverage-graph-.*vitest\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts

exec
/bin/zsh -lc 'rg -n "coverage-graph-.*vitest" .opencode/skill/system-spec-kit' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
codex
The file map is a little uneven: there are four shared libraries, but only three directly named unit-test files plus broader integration/cross-layer/stress tests. I’m reading all of them now so I can judge whether the export surface and failure paths are actually covered, especially for `coverage-graph-contradictions.cjs`.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	'use strict';
     2	// ADR-001: sourceDiversity is an adapter replicating the MCP handler's canonical algorithm. Do not diverge. See ./mcp_server/lib/coverage-graph/coverage-graph-signals.ts for the authoritative implementation.
     3	
     4	// ---------------------------------------------------------------
     5	// MODULE: Coverage Graph Convergence (T005)
     6	// ---------------------------------------------------------------
     7	// Graph-aware convergence helpers that combine graph-structural
     8	// signals with Phase 1 stop-trace convergence scoring. Provides
     9	// STOP-BLOCKING guards (sourceDiversity, evidenceDepth) that must
    10	// pass before a deep-research or deep-review loop can terminate.
    11	// ---------------------------------------------------------------
    12	
    13	const { computeClusterMetrics } = require('./coverage-graph-signals.cjs');
    14	
    15	/**
    16	 * Check whether a value looks like an in-memory coverage graph.
    17	 * @param {unknown} graph
    18	 * @returns {boolean}
    19	 */
    20	function isValidGraph(graph) {
    21	  return !!graph &&
    22	    typeof graph === 'object' &&
    23	    graph.nodes instanceof Map &&
    24	    graph.edges instanceof Map;
    25	}
    26	
    27	/**
    28	 * Parse node metadata into a plain object. Invalid metadata is ignored to
    29	 * match the TS signal layer's tolerant behavior.
    30	 *
    31	 * @param {unknown} metadata
    32	 * @returns {object | null}
    33	 */
    34	function parseMetadata(metadata) {
    35	  if (!metadata) return null;
    36	  if (typeof metadata === 'string') {
    37	    try {
    38	      const parsed = JSON.parse(metadata);
    39	      return parsed && typeof parsed === 'object' ? parsed : null;
    40	    } catch {
    41	      return null;
    42	    }
    43	  }
    44	  return typeof metadata === 'object' ? metadata : null;
    45	}
    46	
    47	/**
    48	 * Normalize the in-memory graph into the canonical research-signal shape used
    49	 * by the MCP layer.
    50	 *
    51	 * @param {{ nodes: Map, edges: Map }} graph
    52	 * @returns {{ nodes: Array<{ id: string, kind: string, metadata: object | null }>, edges: Array<{ sourceId: string, targetId: string, relation: string }> }}
    53	 */
    54	function normalizeResearchGraph(graph) {
    55	  const normalized = {
    56	    nodes: [],
    57	    edges: [],
    58	  };
    59	
    60	  if (!isValidGraph(graph)) return normalized;
    61	
    62	  for (const [nodeId, rawNode] of graph.nodes.entries()) {
    63	    const id = typeof rawNode.id === 'string' ? rawNode.id : nodeId;
    64	    const rawKind = typeof rawNode.kind === 'string'
    65	      ? rawNode.kind
    66	      : typeof rawNode.type === 'string'
    67	        ? rawNode.type
    68	        : '';
    69	
    70	    normalized.nodes.push({
    71	      id,
    72	      kind: rawKind.toUpperCase(),
    73	      metadata: parseMetadata(rawNode.metadata),
    74	    });
    75	  }
    76	
    77	  for (const rawEdge of graph.edges.values()) {
    78	    normalized.edges.push({
    79	      sourceId: rawEdge.source,
    80	      targetId: rawEdge.target,
    81	      relation: rawEdge.relation,
    82	    });
    83	  }
    84	
    85	  return normalized;
    86	}
    87	
    88	/**
    89	 * Build question -> finding adjacency for ANSWERS paths.
    90	 *
    91	 * @param {Array<{ sourceId: string, targetId: string, relation: string }>} edges
    92	 * @returns {Map<string, string[]>}
    93	 */
    94	function buildAnsweringFindingsByQuestion(edges) {
    95	  const answeringFindings = new Map();
    96	
    97	  for (const edge of edges) {
    98	    if (edge.relation !== 'ANSWERS') continue;
    99	    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
   100	    answeringFindings.get(edge.targetId).push(edge.sourceId);
   101	  }
   102	
   103	  return answeringFindings;
   104	}
   105	
   106	/**
   107	 * Build finding -> source adjacency for CITES paths.
   108	 *
   109	 * @param {Array<{ sourceId: string, targetId: string, relation: string }>} edges
   110	 * @returns {Map<string, string[]>}
   111	 */
   112	function buildCitedSourcesByFinding(edges) {
   113	  const citedSources = new Map();
   114	
   115	  for (const edge of edges) {
   116	    if (edge.relation !== 'CITES') continue;
   117	    if (!citedSources.has(edge.sourceId)) citedSources.set(edge.sourceId, []);
   118	    citedSources.get(edge.sourceId).push(edge.targetId);
   119	  }
   120	
   121	  return citedSources;
   122	}
   123	
   124	/* ---------------------------------------------------------------
   125	   1. THRESHOLDS
   126	----------------------------------------------------------------*/
   127	
   128	/**
   129	 * Minimum source diversity required for the STOP gate to pass.
   130	 * Value: average 1.5 distinct source quality classes per question.
   131	 * @type {number}
   132	 */
   133	const SOURCE_DIVERSITY_THRESHOLD = 1.5;
   134	
   135	/**
   136	 * Minimum average evidence chain depth required for the STOP gate to pass.
   137	 * Value: evidence chains must average at least 1.5 hops deep.
   138	 * @type {number}
   139	 */
   140	const EVIDENCE_DEPTH_THRESHOLD = 1.5;
   141	
   142	/* ---------------------------------------------------------------
   143	   2. SOURCE DIVERSITY
   144	----------------------------------------------------------------*/
   145	
   146	/**
   147	 * Compute canonical research source diversity: for each question, count the
   148	 * distinct source quality classes reachable through ANSWERS -> CITES paths and
   149	 * average that count across all questions.
   150	 *
   151	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   152	 * @returns {number} Source diversity score
   153	 */
   154	function computeSourceDiversity(graph) {
   155	  const normalized = normalizeResearchGraph(graph);
   156	  const questionIds = normalized.nodes
   157	    .filter((node) => node.kind === 'QUESTION')
   158	    .map((node) => node.id);
   159	
   160	  if (questionIds.length === 0) return 0;
   161	
   162	  const answeringFindings = buildAnsweringFindingsByQuestion(normalized.edges);
   163	  const citedSources = buildCitedSourcesByFinding(normalized.edges);
   164	  const sourceMetadataById = new Map();
   165	
   166	  for (const node of normalized.nodes) {
   167	    if (node.kind !== 'SOURCE' || !node.metadata) continue;
   168	    sourceMetadataById.set(node.id, node.metadata);
   169	  }
   170	
   171	  let totalDiversity = 0;
   172	
   173	  for (const questionId of questionIds) {
   174	    const qualityClasses = new Set();
   175	
   176	    for (const findingId of answeringFindings.get(questionId) || []) {
   177	      for (const sourceId of citedSources.get(findingId) || []) {
   178	        const qualityClass = sourceMetadataById.get(sourceId)?.quality_class;
   179	        if (typeof qualityClass === 'string' && qualityClass.length > 0) {
   180	          qualityClasses.add(qualityClass);
   181	        }
   182	      }
   183	    }
   184	
   185	    totalDiversity += qualityClasses.size;
   186	  }
   187	
   188	  return totalDiversity / questionIds.length;
   189	}
   190	
   191	/* ---------------------------------------------------------------
   192	   3. EVIDENCE DEPTH
   193	----------------------------------------------------------------*/
   194	
   195	/**
   196	 * Compute canonical research evidence depth: average path length across all
   197	 * question -> finding paths, scoring 2 when the finding cites at least one
   198	 * source and 1 when it does not.
   199	 *
   200	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   201	 * @returns {number} Average evidence depth
   202	 */
   203	function computeEvidenceDepth(graph) {
   204	  const normalized = normalizeResearchGraph(graph);
   205	  const questionIds = normalized.nodes
   206	    .filter((node) => node.kind === 'QUESTION')
   207	    .map((node) => node.id);
   208	
   209	  if (questionIds.length === 0) return 0;
   210	
   211	  const answeringFindings = buildAnsweringFindingsByQuestion(normalized.edges);
   212	  const citedSources = buildCitedSourcesByFinding(normalized.edges);
   213	  let totalDepth = 0;
   214	  let pathCount = 0;
   215	
   216	  for (const questionId of questionIds) {
   217	    for (const findingId of answeringFindings.get(questionId) || []) {
   218	      totalDepth += (citedSources.get(findingId) || []).length > 0 ? 2 : 1;
   219	      pathCount++;
   220	    }
   221	  }
   222	
   223	  return pathCount > 0 ? totalDepth / pathCount : 0;
   224	}
   225	
   226	/* ---------------------------------------------------------------
   227	   4. QUESTION COVERAGE
   228	----------------------------------------------------------------*/
   229	
   230	/**
   231	 * Compute canonical research question coverage: questions with at least two
   232	 * ANSWERS edges divided by all questions.
   233	 *
   234	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   235	 * @returns {number} Coverage ratio in [0.0, 1.0]
   236	 */
   237	function computeQuestionCoverage(graph) {
   238	  const normalized = normalizeResearchGraph(graph);
   239	  const questionIds = normalized.nodes
   240	    .filter((node) => node.kind === 'QUESTION')
   241	    .map((node) => node.id);
   242	
   243	  if (questionIds.length === 0) return 0;
   244	
   245	  const answeringFindings = buildAnsweringFindingsByQuestion(normalized.edges);
   246	  let coveredQuestions = 0;
   247	
   248	  for (const questionId of questionIds) {
   249	    if ((answeringFindings.get(questionId) || []).length >= 2) {
   250	      coveredQuestions++;
   251	    }
   252	  }
   253	
   254	  return coveredQuestions / questionIds.length;
   255	}
   256	
   257	/**
   258	 * Compute canonical research contradiction density: CONTRADICTS edges divided
   259	 * by all edges.
   260	 *

 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Coverage Graph Core (T001 + T002)
     5	// ---------------------------------------------------------------
     6	// Extracted and adapted from mcp_server/lib/storage/causal-edges.ts
     7	// Provides edge management primitives for in-memory coverage graphs
     8	// used by deep-research and deep-review semantic coverage tracking.
     9	// ---------------------------------------------------------------
    10	
    11	/* ---------------------------------------------------------------
    12	   1. CONSTANTS
    13	----------------------------------------------------------------*/
    14	
    15	/**
    16	 * Research relation weight map.
    17	 * Higher values amplify propagated strength; values < 1.0 dampen it.
    18	 * @type {Readonly<Record<string, number>>}
    19	 */
    20	/* CALIBRATION-TODO: inherited from memory graph, recalibrate for coverage */
    21	const RESEARCH_RELATION_WEIGHTS = Object.freeze({
    22	  ANSWERS:      1.3,
    23	  SUPPORTS:     1.0,
    24	  CONTRADICTS:  0.8,
    25	  SUPERSEDES:   1.5,
    26	  DERIVED_FROM: 1.0,
    27	  COVERS:       1.1,
    28	  CITES:        1.0,
    29	});
    30	
    31	/**
    32	 * Review relation weight map.
    33	 * @type {Readonly<Record<string, number>>}
    34	 */
    35	/* CALIBRATION-TODO: inherited from memory graph, recalibrate for coverage */
    36	const REVIEW_RELATION_WEIGHTS = Object.freeze({
    37	  COVERS:       1.3,
    38	  SUPPORTS:     1.0,
    39	  DERIVED_FROM: 1.0,
    40	  EVIDENCE_FOR: 1.0,
    41	  CONTRADICTS:  0.8,
    42	  RESOLVES:     1.5,
    43	  CONFIRMS:     1.0,
    44	});
    45	
    46	const DEFAULT_MAX_DEPTH = 5;
    47	
    48	/** Next auto-incremented edge ID. */
    49	let nextEdgeId = 1;
    50	
    51	/* ---------------------------------------------------------------
    52	   2. HELPERS
    53	----------------------------------------------------------------*/
    54	
    55	/**
    56	 * Check whether a value looks like an in-memory coverage graph.
    57	 * @param {unknown} graph
    58	 * @returns {boolean}
    59	 */
    60	function isValidGraph(graph) {
    61	  return !!graph &&
    62	    typeof graph === 'object' &&
    63	    graph.nodes instanceof Map &&
    64	    graph.edges instanceof Map;
    65	}
    66	
    67	/**
    68	 * Clamp a weight value to the valid range [0.0, 2.0].
    69	 * Returns null for non-finite inputs.
    70	 * @param {number} weight
    71	 * @returns {number|null}
    72	 */
    73	function clampWeight(weight) {
    74	  if (typeof weight !== 'number' || !Number.isFinite(weight)) return null;
    75	  return Math.max(0.0, Math.min(2.0, weight));
    76	}
    77	
    78	/**
    79	 * Create a fresh, empty coverage graph.
    80	 * @returns {{ nodes: Map<string, object>, edges: Map<string, object> }}
    81	 */
    82	function createGraph() {
    83	  return {
    84	    nodes: new Map(),
    85	    edges: new Map(),
    86	  };
    87	}
    88	
    89	function getNodeSessionId(node) {
    90	  if (!node || typeof node !== 'object') return null;
    91	  if (typeof node.sessionId === 'string' && node.sessionId) return node.sessionId;
    92	  if (node.metadata && typeof node.metadata === 'object' && typeof node.metadata.sessionId === 'string' && node.metadata.sessionId) {
    93	    return node.metadata.sessionId;
    94	  }
    95	  return null;
    96	}
    97	
    98	function getEdgeSessionId(graph, edge) {
    99	  if (!edge || typeof edge !== 'object') return null;
   100	  if (typeof edge.sessionId === 'string' && edge.sessionId) return edge.sessionId;
   101	  if (edge.metadata && typeof edge.metadata === 'object' && typeof edge.metadata.sessionId === 'string' && edge.metadata.sessionId) {
   102	    return edge.metadata.sessionId;
   103	  }
   104	  const sourceSessionId = getNodeSessionId(graph.nodes.get(edge.source));
   105	  const targetSessionId = getNodeSessionId(graph.nodes.get(edge.target));
   106	  if (sourceSessionId && (!targetSessionId || targetSessionId === sourceSessionId)) return sourceSessionId;
   107	  return targetSessionId;
   108	}
   109	
   110	function matchesSession(graph, record, sessionId, recordType) {
   111	  if (!sessionId) return true;
   112	  const actualSessionId = recordType === 'edge'
   113	    ? getEdgeSessionId(graph, record)
   114	    : getNodeSessionId(record);
   115	  return actualSessionId === sessionId;
   116	}
   117	
   118	/* ---------------------------------------------------------------
   119	   3. EDGE OPERATIONS
   120	----------------------------------------------------------------*/
   121	
   122	/**
   123	 * Insert an edge into the coverage graph.
   124	 * Prevents self-loops (source === target).
   125	 *
   126	 * Adapted from causal-edges.ts insertEdge():
   127	 * - Self-loop prevention
   128	 * - Weight clamping (0.0-2.0 range for coverage, vs 0-1 for causal)
   129	 * - Auto-generated string edge IDs
   130	 *
   131	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   132	 * @param {string} source - Source node ID
   133	 * @param {string} target - Target node ID
   134	 * @param {string} relation - Relation type (e.g., ANSWERS, COVERS)
   135	 * @param {number} [weight=1.0] - Edge weight (clamped to 0.0-2.0)
   136	 * @param {object} [metadata={}] - Arbitrary metadata for the edge
   137	 * @returns {string|null} Edge ID if inserted, null if rejected
   138	 */
   139	function insertEdge(graph, source, target, relation, weight, metadata) {
   140	  if (!isValidGraph(graph)) return null;
   141	  if (typeof source !== 'string' || typeof target !== 'string' || typeof relation !== 'string') {
   142	    return null;
   143	  }
   144	  if (weight === undefined || weight === null) weight = 1.0;
   145	  if (!metadata) metadata = {};
   146	
   147	  // Prevent self-loops (adapted from causal-edges.ts line 179)
   148	  if (source === target) {
   149	    return null;
   150	  }
   151	
   152	  const clamped = clampWeight(weight);
   153	  if (clamped === null) {
   154	    return null;
   155	  }
   156	
   157	  const edgeId = `e-${nextEdgeId++}`;
   158	
   159	  // Ensure source and target nodes exist
   160	  if (!graph.nodes.has(source)) {
   161	    graph.nodes.set(source, { id: source, createdAt: new Date().toISOString() });
   162	  }
   163	  if (!graph.nodes.has(target)) {
   164	    graph.nodes.set(target, { id: target, createdAt: new Date().toISOString() });
   165	  }
   166	
   167	  graph.edges.set(edgeId, {
   168	    id: edgeId,
   169	    source,
   170	    target,
   171	    relation,
   172	    weight: clamped,
   173	    metadata,
   174	    sessionId: typeof metadata.sessionId === 'string' && metadata.sessionId ? metadata.sessionId : undefined,
   175	    createdAt: new Date().toISOString(),
   176	  });
   177	
   178	  return edgeId;
   179	}
   180	
   181	/**
   182	 * Update an existing edge in the coverage graph.
   183	 * Weight is clamped to [0.0, 2.0].
   184	 *
   185	 * Adapted from causal-edges.ts updateEdge():
   186	 * - Partial updates (weight and/or metadata)
   187	 * - Weight clamping on update
   188	 *
   189	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   190	 * @param {string} edgeId - Edge identifier
   191	 * @param {{ weight?: number, metadata?: object, relation?: string }} updates - Fields to update
   192	 * @returns {boolean} True if edge was found and updated
   193	 */
   194	function updateEdge(graph, edgeId, updates) {
   195	  if (!isValidGraph(graph) || typeof edgeId !== 'string') return false;
   196	  const edge = graph.edges.get(edgeId);
   197	  if (!edge) return false;
   198	
   199	  if (!updates || typeof updates !== 'object') return false;
   200	
   201	  let changed = false;
   202	
   203	  if (updates.weight !== undefined) {
   204	    const clamped = clampWeight(updates.weight);
   205	    if (clamped === null) return false;
   206	    edge.weight = clamped;
   207	    changed = true;
   208	  }
   209	
   210	  if (updates.metadata !== undefined) {
   211	    edge.metadata = { ...edge.metadata, ...updates.metadata };
   212	    changed = true;
   213	  }
   214	
   215	  if (updates.relation !== undefined) {
   216	    edge.relation = updates.relation;
   217	    changed = true;
   218	  }
   219	
   220	  return changed;
   221	}
   222	
   223	/**
   224	 * Delete an edge from the coverage graph.
   225	 *
   226	 * Adapted from causal-edges.ts deleteEdge().
   227	 *
   228	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   229	 * @param {string} edgeId - Edge identifier
   230	 * @returns {boolean} True if edge was found and deleted
   231	 */
   232	function deleteEdge(graph, edgeId) {
   233	  if (!isValidGraph(graph) || typeof edgeId !== 'string') return false;
   234	  return graph.edges.delete(edgeId);
   235	}
   236	
   237	/* ---------------------------------------------------------------
   238	   4. GRAPH TRAVERSAL
   239	----------------------------------------------------------------*/
   240	
   241	/**
   242	 * BFS traversal following provenance chains from a starting node.
   243	 * Returns all reachable nodes with their depth and traversal path.
   244	 *
   245	 * Adapted from causal-edges.ts getCausalChain():
   246	 * - BFS instead of DFS for breadth-first provenance
   247	 * - Cycle prevention via visited set
   248	 * - Depth limiting
   249	 *
   250	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   251	 * @param {string} nodeId - Starting node ID
   252	 * @param {number} [maxDepth=5] - Maximum traversal depth
   253	 * @returns {Array<{ id: string, depth: number, relation: string, weight: number, path: string[] }>}
   254	 */
   255	function traverseProvenance(graph, nodeId, maxDepth) {
   256	  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return [];
   257	  if (maxDepth === undefined || maxDepth === null) maxDepth = DEFAULT_MAX_DEPTH;
   258	  if (typeof maxDepth !== 'number' || !Number.isFinite(maxDepth) || maxDepth < 0) {
   259	    maxDepth = DEFAULT_MAX_DEPTH;
   260	  }

 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Coverage Graph Signals (T003)
     5	// ---------------------------------------------------------------
     6	// Extracted and adapted from mcp_server/lib/graph/graph-signals.ts
     7	// Provides signal computation for in-memory coverage graphs:
     8	// degree, depth, momentum, and cluster metrics.
     9	// ---------------------------------------------------------------
    10	
    11	/* ---------------------------------------------------------------
    12	   1. DEGREE
    13	----------------------------------------------------------------*/
    14	
    15	/**
    16	 * Check whether a value looks like an in-memory coverage graph.
    17	 * @param {unknown} graph
    18	 * @returns {boolean}
    19	 */
    20	function isValidGraph(graph) {
    21	  return !!graph &&
    22	    typeof graph === 'object' &&
    23	    graph.nodes instanceof Map &&
    24	    graph.edges instanceof Map;
    25	}
    26	
    27	function getNodeSessionId(node) {
    28	  if (!node || typeof node !== 'object') return null;
    29	  if (typeof node.sessionId === 'string' && node.sessionId) return node.sessionId;
    30	  if (node.metadata && typeof node.metadata === 'object' && typeof node.metadata.sessionId === 'string' && node.metadata.sessionId) {
    31	    return node.metadata.sessionId;
    32	  }
    33	  return null;
    34	}
    35	
    36	function getEdgeSessionId(graph, edge) {
    37	  if (!edge || typeof edge !== 'object') return null;
    38	  if (typeof edge.sessionId === 'string' && edge.sessionId) return edge.sessionId;
    39	  if (edge.metadata && typeof edge.metadata === 'object' && typeof edge.metadata.sessionId === 'string' && edge.metadata.sessionId) {
    40	    return edge.metadata.sessionId;
    41	  }
    42	  const sourceSessionId = getNodeSessionId(graph.nodes.get(edge.source));
    43	  const targetSessionId = getNodeSessionId(graph.nodes.get(edge.target));
    44	  if (sourceSessionId && (!targetSessionId || targetSessionId === sourceSessionId)) return sourceSessionId;
    45	  return targetSessionId;
    46	}
    47	
    48	function matchesSession(graph, record, sessionId, recordType) {
    49	  if (!sessionId) return true;
    50	  const actualSessionId = recordType === 'edge'
    51	    ? getEdgeSessionId(graph, record)
    52	    : getNodeSessionId(record);
    53	  return actualSessionId === sessionId;
    54	}
    55	
    56	function getFilteredNodeIds(graph, sessionId) {
    57	  const results = [];
    58	  if (!isValidGraph(graph)) return results;
    59	  for (const [nodeId, node] of graph.nodes.entries()) {
    60	    if (matchesSession(graph, node, sessionId, 'node')) results.push(nodeId);
    61	  }
    62	  return results;
    63	}
    64	
    65	function getFilteredEdges(graph, sessionId) {
    66	  const results = [];
    67	  if (!isValidGraph(graph)) return results;
    68	  for (const edge of graph.edges.values()) {
    69	    if (matchesSession(graph, edge, sessionId, 'edge')) results.push(edge);
    70	  }
    71	  return results;
    72	}
    73	
    74	/**
    75	 * Compute the degree of a node (in-degree + out-degree).
    76	 *
    77	 * Adapted from graph-signals.ts getCurrentDegree():
    78	 * - Counts both incoming and outgoing edges for a node
    79	 * - Pure in-memory computation (no DB)
    80	 *
    81	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
    82	 * @param {string} nodeId - Node identifier
    83	 * @returns {{ inDegree: number, outDegree: number, total: number }}
    84	 */
    85	function computeDegree(graph, nodeId, sessionId) {
    86	  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) {
    87	    return { inDegree: 0, outDegree: 0, total: 0 };
    88	  }
    89	  const node = graph.nodes.get(nodeId);
    90	  if (!node || !matchesSession(graph, node, sessionId, 'node')) {
    91	    return { inDegree: 0, outDegree: 0, total: 0 };
    92	  }
    93	  let inDegree = 0;
    94	  let outDegree = 0;
    95	
    96	  for (const edge of getFilteredEdges(graph, sessionId)) {
    97	    if (edge.target === nodeId) inDegree++;
    98	    if (edge.source === nodeId) outDegree++;
    99	  }
   100	
   101	  return { inDegree, outDegree, total: inDegree + outDegree };
   102	}
   103	
   104	/* ---------------------------------------------------------------
   105	   2. DEPTH
   106	----------------------------------------------------------------*/
   107	
   108	/**
   109	 * Build a forward adjacency list from the graph's edges.
   110	 * Also tracks in-degree for root detection.
   111	 *
   112	 * Adapted from graph-signals.ts buildAdjacencyList().
   113	 *
   114	 * @param {{ nodes: Map, edges: Map }} graph
   115	 * @returns {{ adjacency: Map<string, string[]>, inDegree: Map<string, number> }}
   116	 */
   117	function buildAdjacencyList(graph, sessionId) {
   118	  if (!isValidGraph(graph)) {
   119	    return { adjacency: new Map(), inDegree: new Map() };
   120	  }
   121	  const adjacency = new Map();
   122	  const inDegree = new Map();
   123	
   124	  // Initialize all nodes
   125	  for (const nodeId of getFilteredNodeIds(graph, sessionId)) {
   126	    adjacency.set(nodeId, []);
   127	    if (!inDegree.has(nodeId)) inDegree.set(nodeId, 0);
   128	  }
   129	
   130	  for (const edge of getFilteredEdges(graph, sessionId)) {
   131	    if (!adjacency.has(edge.source) || !adjacency.has(edge.target)) continue;
   132	    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
   133	    adjacency.get(edge.source).push(edge.target);
   134	
   135	    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
   136	    if (!inDegree.has(edge.source)) inDegree.set(edge.source, 0);
   137	  }
   138	
   139	  return { adjacency, inDegree };
   140	}
   141	
   142	/**
   143	 * Compute the longest path depth from any root node to the given node.
   144	 * Uses BFS-based topological longest-path on the DAG.
   145	 * Handles cycles by capping at the number of nodes (graceful degradation).
   146	 *
   147	 * Adapted from graph-signals.ts computeComponentDepths():
   148	 * - Simplified for in-memory graph without SCC decomposition
   149	 * - Uses Kahn's algorithm for topological ordering with longest-path tracking
   150	 *
   151	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   152	 * @param {string} nodeId - Node identifier
   153	 * @returns {number} Longest path depth from any root to this node
   154	 */
   155	function computeDepth(graph, nodeId, sessionId) {
   156	  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return 0;
   157	  if (!graph.nodes.has(nodeId)) return 0;
   158	  if (!matchesSession(graph, graph.nodes.get(nodeId), sessionId, 'node')) return 0;
   159	
   160	  const { adjacency, inDegree } = buildAdjacencyList(graph, sessionId);
   161	
   162	  // Kahn's algorithm with longest-path tracking
   163	  const depths = new Map();
   164	  const remaining = new Map(inDegree);
   165	  const queue = [];
   166	
   167	  // Seed roots (in-degree = 0)
   168	  for (const [id, deg] of remaining) {
   169	    if (deg === 0) {
   170	      depths.set(id, 0);
   171	      queue.push(id);
   172	    }
   173	  }
   174	
   175	  let queueIndex = 0;
   176	  while (queueIndex < queue.length) {
   177	    const current = queue[queueIndex++];
   178	    const currentDepth = depths.get(current) || 0;
   179	
   180	    for (const neighbor of (adjacency.get(current) || [])) {
   181	      const candidateDepth = currentDepth + 1;
   182	      if (candidateDepth > (depths.get(neighbor) || 0)) {
   183	        depths.set(neighbor, candidateDepth);
   184	      }
   185	
   186	      const nextDeg = (remaining.get(neighbor) || 0) - 1;
   187	      remaining.set(neighbor, nextDeg);
   188	      if (nextDeg === 0) {
   189	        queue.push(neighbor);
   190	      }
   191	    }
   192	  }
   193	
   194	  // For nodes in cycles that never reached in-degree 0, assign 0
   195	  return depths.get(nodeId) || 0;
   196	}
   197	
   198	/**
   199	 * Compute depths for all nodes in the graph.
   200	 *
   201	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   202	 * @returns {Map<string, number>} Map of nodeId -> depth
   203	 */
   204	function computeAllDepths(graph, sessionId) {
   205	  if (!isValidGraph(graph)) return new Map();
   206	  const { adjacency, inDegree } = buildAdjacencyList(graph, sessionId);
   207	  const depths = new Map();
   208	  const remaining = new Map(inDegree);
   209	  const queue = [];
   210	
   211	  for (const [id, deg] of remaining) {
   212	    if (deg === 0) {
   213	      depths.set(id, 0);
   214	      queue.push(id);
   215	    }
   216	  }
   217	
   218	  let queueIndex = 0;
   219	  while (queueIndex < queue.length) {
   220	    const current = queue[queueIndex++];
   221	    const currentDepth = depths.get(current) || 0;
   222	
   223	    for (const neighbor of (adjacency.get(current) || [])) {
   224	      const candidateDepth = currentDepth + 1;
   225	      if (candidateDepth > (depths.get(neighbor) || 0)) {
   226	        depths.set(neighbor, candidateDepth);
   227	      }
   228	
   229	      const nextDeg = (remaining.get(neighbor) || 0) - 1;
   230	      remaining.set(neighbor, nextDeg);
   231	      if (nextDeg === 0) {
   232	        queue.push(neighbor);
   233	      }
   234	    }
   235	  }
   236	
   237	  // Ensure every node has a depth entry
   238	  for (const nodeId of getFilteredNodeIds(graph, sessionId)) {
   239	    if (!depths.has(nodeId)) depths.set(nodeId, 0);
   240	  }
   241	
   242	  return depths;
   243	}
   244	
   245	/* ---------------------------------------------------------------
   246	   3. MOMENTUM
   247	----------------------------------------------------------------*/
   248	
   249	/**
   250	 * Compute momentum for a node: edge activity within a recent window.
   251	 * Counts edges created within the last `windowSize` milliseconds.
   252	 *
   253	 * Adapted from graph-signals.ts computeMomentum():
   254	 * - Uses edge createdAt timestamps instead of degree_snapshots table
   255	 * - Windowed activity count rather than delta comparison
   256	 *
   257	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   258	 * @param {string} nodeId - Node identifier
   259	 * @param {number} [windowSize=300000] - Window in milliseconds (default 5 minutes)
   260	 * @returns {number} Count of edges involving this node within the window

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Coverage Graph Contradictions (T004)
     5	// ---------------------------------------------------------------
     6	// Extracted and adapted from mcp_server/lib/graph/contradiction-detection.ts
     7	// Provides contradiction scanning and reporting for in-memory
     8	// coverage graphs used by deep-research and deep-review.
     9	// ---------------------------------------------------------------
    10	
    11	/* ---------------------------------------------------------------
    12	   1. CONSTANTS
    13	----------------------------------------------------------------*/
    14	
    15	/**
    16	 * The relation type that indicates a contradiction edge.
    17	 * @type {string}
    18	 */
    19	const CONTRADICTION_RELATION = 'CONTRADICTS';
    20	
    21	/* ---------------------------------------------------------------
    22	   2. SCAN
    23	----------------------------------------------------------------*/
    24	
    25	/**
    26	 * Check whether a value looks like an in-memory coverage graph.
    27	 * @param {unknown} graph
    28	 * @returns {boolean}
    29	 */
    30	function isValidGraph(graph) {
    31	  return !!graph &&
    32	    typeof graph === 'object' &&
    33	    graph.nodes instanceof Map &&
    34	    graph.edges instanceof Map;
    35	}
    36	
    37	function getNodeSessionId(node) {
    38	  if (!node || typeof node !== 'object') return null;
    39	  if (typeof node.sessionId === 'string' && node.sessionId) return node.sessionId;
    40	  if (node.metadata && typeof node.metadata === 'object' && typeof node.metadata.sessionId === 'string' && node.metadata.sessionId) {
    41	    return node.metadata.sessionId;
    42	  }
    43	  return null;
    44	}
    45	
    46	function getEdgeSessionId(graph, edge) {
    47	  if (!edge || typeof edge !== 'object') return null;
    48	  if (typeof edge.sessionId === 'string' && edge.sessionId) return edge.sessionId;
    49	  if (edge.metadata && typeof edge.metadata === 'object' && typeof edge.metadata.sessionId === 'string' && edge.metadata.sessionId) {
    50	    return edge.metadata.sessionId;
    51	  }
    52	  const sourceSessionId = getNodeSessionId(graph.nodes.get(edge.source));
    53	  const targetSessionId = getNodeSessionId(graph.nodes.get(edge.target));
    54	  if (sourceSessionId && (!targetSessionId || targetSessionId === sourceSessionId)) return sourceSessionId;
    55	  return targetSessionId;
    56	}
    57	
    58	function matchesSession(graph, edge, sessionId) {
    59	  if (!sessionId) return true;
    60	  return getEdgeSessionId(graph, edge) === sessionId;
    61	}
    62	
    63	/**
    64	 * Scan the graph for all CONTRADICTS edges and return contradiction pairs.
    65	 * Each pair includes the source node, target node, edge details, and any
    66	 * evidence metadata attached to the edge.
    67	 *
    68	 * Adapted from contradiction-detection.ts detectContradictions():
    69	 * - Scans all edges rather than checking a single new edge
    70	 * - Returns structured pairs for downstream analysis
    71	 * - No DB dependency; pure in-memory scan
    72	 *
    73	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
    74	 * @returns {Array<{ edgeId: string, source: string, target: string, weight: number, metadata: object }>}
    75	 */
    76	function scanContradictions(graph, sessionId) {
    77	  if (!isValidGraph(graph)) return [];
    78	  const contradictions = [];
    79	
    80	  for (const edge of graph.edges.values()) {
    81	    if (edge.relation !== CONTRADICTION_RELATION) continue;
    82	    if (!matchesSession(graph, edge, sessionId)) continue;
    83	
    84	    contradictions.push({
    85	      edgeId: edge.id,
    86	      source: edge.source,
    87	      target: edge.target,
    88	      weight: edge.weight,
    89	      metadata: edge.metadata || {},
    90	    });
    91	  }
    92	
    93	  return contradictions;
    94	}
    95	
    96	/* ---------------------------------------------------------------
    97	   3. REPORT
    98	----------------------------------------------------------------*/
    99	
   100	/**
   101	 * Generate a structured contradiction report with node details
   102	 * and evidence references.
   103	 *
   104	 * Adapted from contradiction-detection.ts's result structure:
   105	 * - Enriches each contradiction pair with source/target node data
   106	 * - Collects evidence references from edge metadata
   107	 * - Groups by affected node for summary view
   108	 *
   109	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   110	 * @returns {{ total: number, pairs: Array<object>, byNode: Map<string, object[]> }}
   111	 */
   112	function reportContradictions(graph, sessionId) {
   113	  if (!isValidGraph(graph)) {
   114	    return { total: 0, pairs: [], byNode: new Map() };
   115	  }
   116	  const raw = scanContradictions(graph, sessionId);
   117	
   118	  const pairs = raw.map((c) => {
   119	    const sourceNode = graph.nodes.get(c.source) || { id: c.source };
   120	    const targetNode = graph.nodes.get(c.target) || { id: c.target };
   121	
   122	    return {
   123	      edgeId: c.edgeId,
   124	      source: {
   125	        id: c.source,
   126	        ...sourceNode,
   127	      },
   128	      target: {
   129	        id: c.target,
   130	        ...targetNode,
   131	      },
   132	      weight: c.weight,
   133	      evidence: c.metadata.evidence || null,
   134	      reason: c.metadata.reason || null,
   135	    };
   136	  });
   137	
   138	  // Group contradictions by affected node (both sides)
   139	  const byNode = new Map();
   140	
   141	  for (const pair of pairs) {
   142	    // Source side
   143	    if (!byNode.has(pair.source.id)) byNode.set(pair.source.id, []);
   144	    byNode.get(pair.source.id).push(pair);
   145	
   146	    // Target side
   147	    if (!byNode.has(pair.target.id)) byNode.set(pair.target.id, []);
   148	    byNode.get(pair.target.id).push(pair);
   149	  }
   150	
   151	  return {
   152	    total: pairs.length,
   153	    pairs,
   154	    byNode,
   155	  };
   156	}
   157	
   158	/* ---------------------------------------------------------------
   159	   4. DENSITY
   160	----------------------------------------------------------------*/
   161	
   162	/**
   163	 * Compute the contradiction density: ratio of nodes involved in
   164	 * at least one contradiction to total node count.
   165	 *
   166	 * A density of 0.0 means no contradictions; 1.0 means every node
   167	 * is involved in at least one contradiction edge.
   168	 *
   169	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   170	 * @returns {number} Contradiction density in [0.0, 1.0]
   171	 */
   172	function contradictionDensity(graph, sessionId) {
   173	  if (!isValidGraph(graph)) return 0;
   174	  const scopedNodeIds = new Set();
   175	  for (const [nodeId, node] of graph.nodes.entries()) {
   176	    if (sessionId && getNodeSessionId(node) !== sessionId) continue;
   177	    scopedNodeIds.add(nodeId);
   178	  }
   179	  if (scopedNodeIds.size === 0) return 0;
   180	
   181	  const contradictedNodes = new Set();
   182	
   183	  for (const edge of graph.edges.values()) {
   184	    if (edge.relation !== CONTRADICTION_RELATION) continue;
   185	    if (!matchesSession(graph, edge, sessionId)) continue;
   186	    contradictedNodes.add(edge.source);
   187	    contradictedNodes.add(edge.target);
   188	  }
   189	
   190	  return contradictedNodes.size / scopedNodeIds.size;
   191	}
   192	
   193	/* ---------------------------------------------------------------
   194	   5. EXPORTS
   195	----------------------------------------------------------------*/
   196	
   197	module.exports = {
   198	  CONTRADICTION_RELATION,
   199	  scanContradictions,
   200	  reportContradictions,
   201	  contradictionDensity,
   202	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   261	
   262	  const results = [];
   263	  const visited = new Set();
   264	  visited.add(nodeId);
   265	
   266	  // BFS queue: each entry is { id, depth, relation, weight, path }
   267	  const queue = [{ id: nodeId, depth: 0, relation: 'ROOT', weight: 1.0, path: [nodeId] }];
   268	  let queueIndex = 0;
   269	
   270	  while (queueIndex < queue.length) {
   271	    const current = queue[queueIndex++];
   272	
   273	    if (current.depth > 0) {
   274	      results.push({
   275	        id: current.id,
   276	        depth: current.depth,
   277	        relation: current.relation,
   278	        weight: current.weight,
   279	        path: current.path,
   280	      });
   281	    }
   282	
   283	    if (current.depth >= maxDepth) continue;
   284	
   285	    // Find outgoing edges from current node
   286	    for (const edge of graph.edges.values()) {
   287	      if (edge.source !== current.id) continue;
   288	      if (visited.has(edge.target)) continue;
   289	
   290	      visited.add(edge.target);
   291	      queue.push({
   292	        id: edge.target,
   293	        depth: current.depth + 1,
   294	        relation: edge.relation,
   295	        weight: current.weight * edge.weight,
   296	        path: [...current.path, edge.target],
   297	      });
   298	    }
   299	  }
   300	
   301	  return results;
   302	}
   303	
   304	/**
   305	 * Get all edges originating from a given node.
   306	 *
   307	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   308	 * @param {string} nodeId - Source node ID
   309	 * @returns {Array<object>} Edges from this node
   310	 */
   311	function getNodes(graph, sessionId) {
   312	  if (!isValidGraph(graph)) return [];
   313	  const results = [];
   314	  for (const node of graph.nodes.values()) {
   315	    if (matchesSession(graph, node, sessionId, 'node')) results.push(node);
   316	  }
   317	  return results;
   318	}
   319	
   320	function getEdges(graph, sessionId) {
   321	  if (!isValidGraph(graph)) return [];
   322	  const results = [];
   323	  for (const edge of graph.edges.values()) {
   324	    if (matchesSession(graph, edge, sessionId, 'edge')) results.push(edge);
   325	  }
   326	  return results;
   327	}
   328	
   329	function getEdgesFrom(graph, nodeId, sessionId) {
   330	  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return [];
   331	  const results = [];
   332	  for (const edge of graph.edges.values()) {
   333	    if (edge.source === nodeId && matchesSession(graph, edge, sessionId, 'edge')) results.push(edge);
   334	  }
   335	  return results;
   336	}
   337	
   338	/**
   339	 * Get all edges pointing to a given node.
   340	 *
   341	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   342	 * @param {string} nodeId - Target node ID
   343	 * @returns {Array<object>} Edges to this node
   344	 */
   345	function getEdgesTo(graph, nodeId, sessionId) {
   346	  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return [];
   347	  const results = [];
   348	  for (const edge of graph.edges.values()) {
   349	    if (edge.target === nodeId && matchesSession(graph, edge, sessionId, 'edge')) results.push(edge);
   350	  }
   351	  return results;
   352	}
   353	
   354	/**
   355	 * Reset the internal edge ID counter. Useful for tests.
   356	 */
   357	function resetEdgeIdCounter() {
   358	  nextEdgeId = 1;
   359	}
   360	
   361	/* ---------------------------------------------------------------
   362	   5. EXPORTS
   363	----------------------------------------------------------------*/
   364	
   365	module.exports = {
   366	  // Constants
   367	  RESEARCH_RELATION_WEIGHTS,
   368	  REVIEW_RELATION_WEIGHTS,
   369	  DEFAULT_MAX_DEPTH,
   370	
   371	  // Factory
   372	  createGraph,
   373	
   374	  // Edge operations
   375	  insertEdge,
   376	  updateEdge,
   377	  deleteEdge,
   378	
   379	  // Traversal
   380	  traverseProvenance,
   381	  getNodes,
   382	  getEdges,
   383	  getEdgesFrom,
   384	  getEdgesTo,
   385	
   386	  // Helpers
   387	  clampWeight,
   388	  resetEdgeIdCounter,
   389	};

 succeeded in 0ms:
   261	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   262	 * @returns {number} Contradiction density in [0.0, 1.0]
   263	 */
   264	function computeContradictionDensity(graph) {
   265	  const normalized = normalizeResearchGraph(graph);
   266	  if (normalized.edges.length === 0) return 0;
   267	
   268	  let contradictionCount = 0;
   269	  for (const edge of normalized.edges) {
   270	    if (edge.relation === 'CONTRADICTS') contradictionCount++;
   271	  }
   272	
   273	  return contradictionCount / normalized.edges.length;
   274	}
   275	
   276	/* ---------------------------------------------------------------
   277	   5. GRAPH CONVERGENCE
   278	----------------------------------------------------------------*/
   279	
   280	/**
   281	 * Compute a combined graph convergence score that blends graph-structural
   282	 * signals with Phase 1 stop-trace signals.
   283	 *
   284	 * The graph convergence score supplements (does not replace) the existing
   285	 * compositeStop score from Phase 1. It adds structural awareness:
   286	 * - Cluster fragmentation penalty (many small disconnected components = low convergence)
   287	 * - Evidence depth bonus (deep chains = high convergence)
   288	 * - Question coverage (covered questions = progress toward convergence)
   289	 *
   290	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   291	 * @param {{ compositeStop?: number, rollingAvg?: number, madScore?: number }} [signals={}]
   292	 *   Phase 1 stop-trace signals to blend with graph signals
   293	 * @returns {{ graphScore: number, blendedScore: number, components: object }}
   294	 */
   295	function computeGraphConvergence(graph, signals) {
   296	  if (!isValidGraph(graph)) {
   297	    return {
   298	      graphScore: 0,
   299	      blendedScore: 0,
   300	      components: {
   301	        fragmentationScore: 0,
   302	        normalizedDepth: 0,
   303	        questionCoverage: 0,
   304	        contradictionDensity: 0,
   305	        evidenceDepth: 0,
   306	        sourceDiversity: 0,
   307	        compositeStop: null,
   308	      },
   309	    };
   310	  }
   311	  if (!signals) signals = {};
   312	
   313	  const cluster = computeClusterMetrics(graph);
   314	  const questionCoverage = computeQuestionCoverage(graph);
   315	  const contradictionDensity = computeContradictionDensity(graph);
   316	  const evidenceDepth = computeEvidenceDepth(graph);
   317	  const sourceDiversity = computeSourceDiversity(graph);
   318	
   319	  const nodeCount = graph.nodes.size;
   320	  const fragmentationScore = nodeCount > 0
   321	    ? 1.0 - (cluster.isolatedNodes / nodeCount)
   322	    : 0;
   323	
   324	  // Preserve the existing soft-cap behavior for the graph-only blend.
   325	  const normalizedDepth = Math.min(evidenceDepth / 5.0, 1.0);
   326	
   327	  const graphScore = (
   328	    (fragmentationScore * 0.25) +
   329	    (normalizedDepth * 0.25) +
   330	    (questionCoverage * 0.30) +
   331	    (sourceDiversity * 0.20)
   332	  );
   333	
   334	  const compositeStop = typeof signals.compositeStop === 'number' ? signals.compositeStop : null;
   335	  const blendedScore = compositeStop !== null
   336	    ? (compositeStop * 0.6) + (graphScore * 0.4)
   337	    : graphScore;
   338	
   339	  return {
   340	    graphScore: Math.round(graphScore * 1000) / 1000,
   341	    blendedScore: Math.round(blendedScore * 1000) / 1000,
   342	    components: {
   343	      fragmentationScore: Math.round(fragmentationScore * 1000) / 1000,
   344	      normalizedDepth: Math.round(normalizedDepth * 1000) / 1000,
   345	      questionCoverage: Math.round(questionCoverage * 1000) / 1000,
   346	      contradictionDensity: Math.round(contradictionDensity * 1000) / 1000,
   347	      evidenceDepth: Math.round(evidenceDepth * 1000) / 1000,
   348	      sourceDiversity: Math.round(sourceDiversity * 1000) / 1000,
   349	      compositeStop: compositeStop !== null ? compositeStop : null,
   350	    },
   351	  };
   352	}
   353	
   354	/* ---------------------------------------------------------------
   355	   6. STOP GATES
   356	----------------------------------------------------------------*/
   357	
   358	/**
   359	 * Evaluate the STOP-BLOCKING graph gates.
   360	 * Both gates must pass for the deep loop to be allowed to terminate.
   361	 *
   362	 * Gates:
   363	 * - sourceDiversity: average distinct source quality classes per question >= threshold
   364	 * - evidenceDepth: average evidence chain depth >= threshold
   365	 *
   366	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   367	 * @returns {{ sourceDiversity: { pass: boolean, value: number, threshold: number }, evidenceDepth: { pass: boolean, value: number, threshold: number }, allPass: boolean }}
   368	 */
   369	function evaluateGraphGates(graph) {
   370	  if (!isValidGraph(graph)) {
   371	    return {
   372	      sourceDiversity: { pass: false, value: 0, threshold: SOURCE_DIVERSITY_THRESHOLD },
   373	      evidenceDepth: { pass: false, value: 0, threshold: EVIDENCE_DEPTH_THRESHOLD },
   374	      allPass: false,
   375	    };
   376	  }
   377	  const diversity = computeSourceDiversity(graph);
   378	  const depth = computeEvidenceDepth(graph);
   379	
   380	  const sourceDiversityGate = {
   381	    pass: diversity >= SOURCE_DIVERSITY_THRESHOLD,
   382	    value: Math.round(diversity * 1000) / 1000,
   383	    threshold: SOURCE_DIVERSITY_THRESHOLD,
   384	  };
   385	
   386	  const evidenceDepthGate = {
   387	    pass: depth >= EVIDENCE_DEPTH_THRESHOLD,
   388	    value: Math.round(depth * 1000) / 1000,
   389	    threshold: EVIDENCE_DEPTH_THRESHOLD,
   390	  };
   391	
   392	  return {
   393	    sourceDiversity: sourceDiversityGate,
   394	    evidenceDepth: evidenceDepthGate,
   395	    allPass: sourceDiversityGate.pass && evidenceDepthGate.pass,
   396	  };
   397	}
   398	
   399	/* ---------------------------------------------------------------
   400	   7. EXPORTS
   401	----------------------------------------------------------------*/
   402	
   403	module.exports = {
   404	  // Thresholds
   405	  SOURCE_DIVERSITY_THRESHOLD,
   406	  EVIDENCE_DEPTH_THRESHOLD,
   407	
   408	  // Individual computations
   409	  computeSourceDiversity,
   410	  computeEvidenceDepth,
   411	  computeQuestionCoverage,
   412	  computeContradictionDensity,
   413	
   414	  // Combined convergence
   415	  computeGraphConvergence,
   416	
   417	  // Stop gates
   418	  evaluateGraphGates,
   419	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   261	 */
   262	function computeMomentum(graph, nodeId, windowSize, sessionId) {
   263	  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return 0;
   264	  const node = graph.nodes.get(nodeId);
   265	  if (!node || !matchesSession(graph, node, sessionId, 'node')) return 0;
   266	  if (windowSize === undefined || windowSize === null) windowSize = 300000; // 5 min default
   267	  if (typeof windowSize !== 'number' || !Number.isFinite(windowSize) || windowSize < 0) {
   268	    windowSize = 300000;
   269	  }
   270	
   271	  const cutoff = Date.now() - windowSize;
   272	  let count = 0;
   273	
   274	  for (const edge of getFilteredEdges(graph, sessionId)) {
   275	    if (edge.source !== nodeId && edge.target !== nodeId) continue;
   276	
   277	    const edgeTime = edge.createdAt ? new Date(edge.createdAt).getTime() : 0;
   278	    if (edgeTime >= cutoff) {
   279	      count++;
   280	    }
   281	  }
   282	
   283	  return count;
   284	}
   285	
   286	/* ---------------------------------------------------------------
   287	   4. CLUSTER METRICS
   288	----------------------------------------------------------------*/
   289	
   290	/**
   291	 * Compute connected component counts and sizes using BFS.
   292	 * Treats the graph as undirected for connectivity analysis.
   293	 *
   294	 * Adapted from community-detection.ts detectCommunitiesBFS():
   295	 * - BFS-based connected component discovery
   296	 * - Returns component count, sizes, and largest component size
   297	 *
   298	 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
   299	 * @returns {{ componentCount: number, sizes: number[], largestSize: number, isolatedNodes: number }}
   300	 */
   301	function computeClusterMetrics(graph, sessionId) {
   302	  if (!isValidGraph(graph)) {
   303	    return { componentCount: 0, sizes: [], largestSize: 0, isolatedNodes: 0 };
   304	  }
   305	  const filteredNodeIds = getFilteredNodeIds(graph, sessionId);
   306	  if (filteredNodeIds.length === 0) {
   307	    return { componentCount: 0, sizes: [], largestSize: 0, isolatedNodes: 0 };
   308	  }
   309	
   310	  // Build undirected adjacency
   311	  const undirected = new Map();
   312	  for (const nodeId of filteredNodeIds) {
   313	    undirected.set(nodeId, new Set());
   314	  }
   315	
   316	  for (const edge of getFilteredEdges(graph, sessionId)) {
   317	    if (!undirected.has(edge.source) || !undirected.has(edge.target)) continue;
   318	    undirected.get(edge.source).add(edge.target);
   319	    undirected.get(edge.target).add(edge.source);
   320	  }
   321	
   322	  const visited = new Set();
   323	  const sizes = [];
   324	  let isolatedNodes = 0;
   325	
   326	  for (const nodeId of filteredNodeIds) {
   327	    if (visited.has(nodeId)) continue;
   328	
   329	    // BFS from this node
   330	    const queue = [nodeId];
   331	    let queueIndex = 0;
   332	    visited.add(nodeId);
   333	    let size = 0;
   334	
   335	    while (queueIndex < queue.length) {
   336	      const current = queue[queueIndex++];
   337	      size++;
   338	
   339	      const neighbors = undirected.get(current);
   340	      if (!neighbors) continue;
   341	
   342	      for (const neighbor of neighbors) {
   343	        if (visited.has(neighbor)) continue;
   344	        visited.add(neighbor);
   345	        queue.push(neighbor);
   346	      }
   347	    }
   348	
   349	    sizes.push(size);
   350	    if (size === 1) isolatedNodes++;
   351	  }
   352	
   353	  // Sort sizes descending for convenience
   354	  sizes.sort((a, b) => b - a);
   355	
   356	  return {
   357	    componentCount: sizes.length,
   358	    sizes,
   359	    largestSize: sizes.length > 0 ? sizes[0] : 0,
   360	    isolatedNodes,
   361	  };
   362	}
   363	
   364	/* ---------------------------------------------------------------
   365	   5. EXPORTS
   366	----------------------------------------------------------------*/
   367	
   368	module.exports = {
   369	  computeDegree,
   370	  computeDepth,
   371	  computeAllDepths,
   372	  computeMomentum,
   373	  computeClusterMetrics,
   374	
   375	  // Internal helpers exposed for testing
   376	  __testables: {
   377	    buildAdjacencyList,
   378	  },
   379	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '..', '..');
     8	const require = createRequire(import.meta.url);
     9	
    10	const convergenceModule = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  'scripts/lib/coverage-graph-convergence.cjs',
    13	)) as {
    14	  SOURCE_DIVERSITY_THRESHOLD: number;
    15	  EVIDENCE_DEPTH_THRESHOLD: number;
    16	  computeSourceDiversity: (graph: Graph) => number;
    17	  computeEvidenceDepth: (graph: Graph) => number;
    18	  computeQuestionCoverage: (graph: Graph) => number;
    19	  computeGraphConvergence: (graph: Graph, signals?: { compositeStop?: number }) => {
    20	    graphScore: number;
    21	    blendedScore: number;
    22	    components: {
    23	      fragmentationScore: number;
    24	      normalizedDepth: number;
    25	      questionCoverage: number;
    26	      sourceDiversity: number;
    27	      compositeStop: number | null;
    28	    };
    29	  };
    30	  evaluateGraphGates: (graph: Graph) => {
    31	    sourceDiversity: { pass: boolean; value: number; threshold: number };
    32	    evidenceDepth: { pass: boolean; value: number; threshold: number };
    33	    allPass: boolean;
    34	  };
    35	};
    36	
    37	type GraphNode = {
    38	  id: string;
    39	  type?: 'question' | 'finding' | 'source' | 'claim';
    40	  kind?: 'QUESTION' | 'FINDING' | 'SOURCE' | 'CLAIM';
    41	  metadata?: Record<string, unknown>;
    42	};
    43	
    44	type GraphEdge = {
    45	  source: string;
    46	  target: string;
    47	  relation: string;
    48	  createdAt?: string;
    49	};
    50	
    51	type Graph = {
    52	  nodes: Map<string, GraphNode>;
    53	  edges: Map<string, GraphEdge>;
    54	};
    55	
    56	function makeGraph(nodes: GraphNode[], edges: GraphEdge[]): Graph {
    57	  return {
    58	    nodes: new Map(nodes.map((node) => [node.id, node])),
    59	    edges: new Map(edges.map((edge, index) => [`edge-${index}`, edge])),
    60	  };
    61	}
    62	
    63	/**
    64	 * Phase 008 ADR-001 canonicalization note: these tests exercise the CJS
    65	 * coverage-graph-convergence helper AFTER it was refactored into a thin
    66	 * adapter over the MCP canonical signal algorithms. The canonical definitions
    67	 * are question-centric:
    68	 *   - sourceDiversity: average distinct source quality classes per question
    69	 *     reachable via ANSWERS → CITES paths (default threshold 1.5)
    70	 *   - evidenceDepth: average path length per question → answering-finding
    71	 *     (scored 2 when finding has a CITES edge, 1 otherwise, default 1.5)
    72	 *   - questionCoverage: fraction of questions with ≥2 answering findings
    73	 * Old CJS-native semantics (edge/node ratios) are deprecated; do not re-introduce.
    74	 */
    75	describe('coverage-graph-convergence', () => {
    76	  it('exports the canonical stop-gate thresholds (ADR-001)', () => {
    77	    expect(convergenceModule.SOURCE_DIVERSITY_THRESHOLD).toBe(1.5);
    78	    expect(convergenceModule.EVIDENCE_DEPTH_THRESHOLD).toBe(1.5);
    79	  });
    80	
    81	  it('computes source diversity as distinct source quality classes per question', () => {
    82	    const graph = makeGraph(
    83	      [
    84	        { id: 'q-1', kind: 'QUESTION' },
    85	        { id: 'q-2', kind: 'QUESTION' },
    86	        { id: 'f-1', kind: 'FINDING' },
    87	        { id: 'f-2', kind: 'FINDING' },
    88	        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
    89	        { id: 's-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
    90	      ],
    91	      [
    92	        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
    93	        { source: 'f-2', target: 'q-2', relation: 'ANSWERS' },
    94	        { source: 'f-1', target: 's-1', relation: 'CITES' },
    95	        { source: 'f-2', target: 's-2', relation: 'CITES' },
    96	      ],
    97	    );
    98	
    99	    // q-1 reaches 1 quality class (primary), q-2 reaches 1 (secondary). Average = 1.
   100	    expect(convergenceModule.computeSourceDiversity(graph)).toBe(1);
   101	  });
   102	
   103	  it('returns zero source diversity for an empty graph', () => {
   104	    expect(convergenceModule.computeSourceDiversity(makeGraph([], []))).toBe(0);
   105	  });
   106	
   107	  it('computes average evidence depth from longest-path node depths', () => {
   108	    const graph = makeGraph(
   109	      [
   110	        { id: 'source-1', kind: 'SOURCE' },
   111	        { id: 'finding-1', kind: 'FINDING' },
   112	        { id: 'question-1', kind: 'QUESTION' },
   113	      ],
   114	      [
   115	        { source: 'source-1', target: 'finding-1', relation: 'SUPPORTS' },
   116	        { source: 'finding-1', target: 'question-1', relation: 'ANSWERS' },
   117	      ],
   118	    );
   119	
   120	    // 1 question, 1 answering finding with no CITES edges → depth 1.
   121	    expect(convergenceModule.computeEvidenceDepth(graph)).toBe(1);
   122	  });
   123	
   124	  it('computes question coverage from ANSWERS edges into question nodes (≥2 answers to count)', () => {
   125	    const graph = makeGraph(
   126	      [
   127	        { id: 'q-1', kind: 'QUESTION' },
   128	        { id: 'q-2', kind: 'QUESTION' },
   129	        { id: 'f-1', kind: 'FINDING' },
   130	        { id: 'f-2', kind: 'FINDING' },
   131	      ],
   132	      [
   133	        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
   134	        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
   135	      ],
   136	    );
   137	
   138	    // q-1 has 2 answering findings (covered). q-2 has 0 (not covered). 1/2 = 0.5.
   139	    expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0.5);
   140	  });
   141	
   142	  it('returns zero question coverage when no questions exist (empty-set fail-closed default)', () => {
   143	    const graph = makeGraph(
   144	      [{ id: 'finding-1', kind: 'FINDING' }],
   145	      [],
   146	    );
   147	
   148	    // ADR-001 canonical semantics: 0 questions → 0 coverage (not 1).
   149	    // This is the fail-closed default; stop gates should block when there's nothing to stop on.
   150	    expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0);
   151	  });
   152	
   153	  it('computes a graph-only convergence score when stop-trace signals are absent', () => {
   154	    const graph = makeGraph(
   155	      [
   156	        { id: 'q-1', kind: 'QUESTION' },
   157	        { id: 'q-2', kind: 'QUESTION' },
   158	        { id: 'f-1', kind: 'FINDING' },
   159	        { id: 'f-2', kind: 'FINDING' },
   160	        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
   161	      ],
   162	      [
   163	        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
   164	        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
   165	        { source: 'f-1', target: 's-1', relation: 'CITES' },
   166	      ],
   167	    );
   168	
   169	    const result = convergenceModule.computeGraphConvergence(graph);
   170	    // q-1 is covered (2 ANSWERS), q-2 is not → coverage = 0.5
   171	    // q-1 reaches 1 quality class via f-1→s-1, q-2 reaches 0 → diversity = 0.5
   172	    expect(result.blendedScore).toBe(result.graphScore);
   173	    expect(result.components.questionCoverage).toBe(0.5);
   174	    expect(result.components.sourceDiversity).toBe(0.5);
   175	  });
   176	
   177	  it('blends the graph score with compositeStop when stop-trace signals exist', () => {
   178	    const graph = makeGraph(
   179	      [
   180	        { id: 'q-1', type: 'question' },
   181	        { id: 'f-1', type: 'finding' },
   182	      ],
   183	      [{ source: 'f-1', target: 'q-1', relation: 'ANSWERS' }],
   184	    );
   185	
   186	    const result = convergenceModule.computeGraphConvergence(graph, { compositeStop: 0.8 });
   187	    expect(result.components.compositeStop).toBe(0.8);
   188	    expect(result.blendedScore).toBeGreaterThanOrEqual(result.graphScore);
   189	    expect(result.blendedScore).toBeLessThanOrEqual(0.8);
   190	  });
   191	
   192	  it('passes graph gates when both diversity and depth clear their thresholds', () => {
   193	    // Build a graph rich enough to clear BOTH canonical thresholds (1.5 each):
   194	    // 1 question, 2 answering findings, each CITES 2 sources with distinct quality classes.
   195	    // sourceDiversity: q-1 reaches 4 distinct quality classes = 4.0 average → >1.5 ✓
   196	    // evidenceDepth: 2 paths, both have CITES → 2.0 average → >1.5 ✓
   197	    const graph = makeGraph(
   198	      [
   199	        { id: 'q-1', kind: 'QUESTION' },
   200	        { id: 'f-1', kind: 'FINDING' },
   201	        { id: 'f-2', kind: 'FINDING' },
   202	        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
   203	        { id: 's-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
   204	        { id: 's-3', kind: 'SOURCE', metadata: { quality_class: 'tertiary' } },
   205	        { id: 's-4', kind: 'SOURCE', metadata: { quality_class: 'peer-reviewed' } },
   206	      ],
   207	      [
   208	        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
   209	        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
   210	        { source: 'f-1', target: 's-1', relation: 'CITES' },
   211	        { source: 'f-1', target: 's-2', relation: 'CITES' },
   212	        { source: 'f-2', target: 's-3', relation: 'CITES' },
   213	        { source: 'f-2', target: 's-4', relation: 'CITES' },
   214	      ],
   215	    );
   216	
   217	    const result = convergenceModule.evaluateGraphGates(graph);
   218	    expect(result.sourceDiversity.pass).toBe(true);
   219	    expect(result.evidenceDepth.pass).toBe(true);
   220	    expect(result.allPass).toBe(true);
   221	  });
   222	
   223	  it('fails the diversity gate when too few distinct quality classes are present', () => {
   224	    // 1 question, 2 answering findings, 1 shared source → only 1 quality class → diversity = 1.0 < 1.5
   225	    // Both findings have CITES → evidenceDepth = 2.0 ≥ 1.5 (depth gate passes, diversity fails).
   226	    const graph = makeGraph(
   227	      [
   228	        { id: 'q-1', kind: 'QUESTION' },
   229	        { id: 'f-1', kind: 'FINDING' },
   230	        { id: 'f-2', kind: 'FINDING' },
   231	        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
   232	      ],
   233	      [
   234	        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
   235	        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
   236	        { source: 'f-1', target: 's-1', relation: 'CITES' },
   237	        { source: 'f-2', target: 's-1', relation: 'CITES' },
   238	      ],
   239	    );
   240	
   241	    const result = convergenceModule.evaluateGraphGates(graph);
   242	    expect(result.sourceDiversity.pass).toBe(false);
   243	    expect(result.sourceDiversity.value).toBe(1);
   244	    expect(result.evidenceDepth.pass).toBe(true);
   245	    expect(result.allPass).toBe(false);
   246	  });
   247	
   248	  it('fails the depth gate when evidence chains are too shallow', () => {
   249	    // 1 question, 1 answering finding with NO CITES → depth = 1 < 1.5 (depth gate fails).
   250	    // Diversity must still pass (≥1.5) so we build a second question path with rich sources.
   251	    // Actually simpler: single question, single finding, no CITES anywhere → both fail.
   252	    // To isolate the depth-only failure we need a separate diversity-clearing path, which
   253	    // is structurally impossible without adding CITES that also boost depth. Accept the
   254	    // "both fail" variant that specifically proves shallow depth.
   255	    const graph = makeGraph(
   256	      [
   257	        { id: 'q-1', kind: 'QUESTION' },
   258	        { id: 'f-1', kind: 'FINDING' },
   259	      ],
   260	      [
   261	        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
   262	      ],
   263	    );
   264	
   265	    const result = convergenceModule.evaluateGraphGates(graph);
   266	    expect(result.sourceDiversity.pass).toBe(false);
   267	    expect(result.evidenceDepth.pass).toBe(false);
   268	    expect(result.evidenceDepth.value).toBe(1);
   269	    expect(result.allPass).toBe(false);
   270	  });
   271	});

 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it, beforeEach } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const coreModule = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
    13	)) as {
    14	  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
    15	  REVIEW_RELATION_WEIGHTS: Readonly<Record<string, number>>;
    16	  DEFAULT_MAX_DEPTH: number;
    17	  createGraph: () => { nodes: Map<string, object>; edges: Map<string, object> };
    18	  insertEdge: (graph: ReturnType<typeof coreModule.createGraph>, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
    19	  updateEdge: (graph: ReturnType<typeof coreModule.createGraph>, edgeId: string, updates: { weight?: number; metadata?: object; relation?: string }) => boolean;
    20	  deleteEdge: (graph: ReturnType<typeof coreModule.createGraph>, edgeId: string) => boolean;
    21	  traverseProvenance: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, maxDepth?: number) => Array<{ id: string; depth: number; relation: string; weight: number; path: string[] }>;
    22	  getEdgesFrom: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string) => Array<object>;
    23	  getEdgesTo: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string) => Array<object>;
    24	  clampWeight: (weight: number) => number | null;
    25	  resetEdgeIdCounter: () => void;
    26	};
    27	
    28	describe('coverage-graph-core', () => {
    29	  beforeEach(() => {
    30	    coreModule.resetEdgeIdCounter();
    31	  });
    32	
    33	  describe('constants', () => {
    34	    it('exports research relation weights', () => {
    35	      expect(coreModule.RESEARCH_RELATION_WEIGHTS).toBeDefined();
    36	      expect(coreModule.RESEARCH_RELATION_WEIGHTS.ANSWERS).toBe(1.3);
    37	      expect(coreModule.RESEARCH_RELATION_WEIGHTS.CONTRADICTS).toBe(0.8);
    38	      expect(coreModule.RESEARCH_RELATION_WEIGHTS.CITES).toBe(1.0);
    39	    });
    40	
    41	    it('exports review relation weights', () => {
    42	      expect(coreModule.REVIEW_RELATION_WEIGHTS).toBeDefined();
    43	      expect(coreModule.REVIEW_RELATION_WEIGHTS.COVERS).toBe(1.3);
    44	      expect(coreModule.REVIEW_RELATION_WEIGHTS.EVIDENCE_FOR).toBe(1.0);
    45	      expect(coreModule.REVIEW_RELATION_WEIGHTS.RESOLVES).toBe(1.5);
    46	      expect(coreModule.REVIEW_RELATION_WEIGHTS.CONFIRMS).toBe(1.0);
    47	    });
    48	
    49	    it('has default max depth of 5', () => {
    50	      expect(coreModule.DEFAULT_MAX_DEPTH).toBe(5);
    51	    });
    52	
    53	    it('relation weight maps are frozen', () => {
    54	      expect(Object.isFrozen(coreModule.RESEARCH_RELATION_WEIGHTS)).toBe(true);
    55	      expect(Object.isFrozen(coreModule.REVIEW_RELATION_WEIGHTS)).toBe(true);
    56	    });
    57	  });
    58	
    59	  describe('createGraph', () => {
    60	    it('returns an empty graph with Maps', () => {
    61	      const graph = coreModule.createGraph();
    62	      expect(graph.nodes).toBeInstanceOf(Map);
    63	      expect(graph.edges).toBeInstanceOf(Map);
    64	      expect(graph.nodes.size).toBe(0);
    65	      expect(graph.edges.size).toBe(0);
    66	    });
    67	  });
    68	
    69	  describe('clampWeight', () => {
    70	    it('clamps values within 0.0-2.0 range', () => {
    71	      expect(coreModule.clampWeight(1.0)).toBe(1.0);
    72	      expect(coreModule.clampWeight(0.0)).toBe(0.0);
    73	      expect(coreModule.clampWeight(2.0)).toBe(2.0);
    74	    });
    75	
    76	    it('clamps values above 2.0 to 2.0', () => {
    77	      expect(coreModule.clampWeight(3.0)).toBe(2.0);
    78	      expect(coreModule.clampWeight(100)).toBe(2.0);
    79	    });
    80	
    81	    it('clamps values below 0.0 to 0.0', () => {
    82	      expect(coreModule.clampWeight(-1.0)).toBe(0.0);
    83	      expect(coreModule.clampWeight(-100)).toBe(0.0);
    84	    });
    85	
    86	    it('returns null for non-finite inputs', () => {
    87	      expect(coreModule.clampWeight(NaN)).toBeNull();
    88	      expect(coreModule.clampWeight(Infinity)).toBeNull();
    89	      expect(coreModule.clampWeight(-Infinity)).toBeNull();
    90	    });
    91	  });
    92	
    93	  describe('insertEdge', () => {
    94	    it('inserts an edge and returns an edge ID', () => {
    95	      const graph = coreModule.createGraph();
    96	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.3);
    97	      expect(edgeId).toBeTruthy();
    98	      expect(graph.edges.size).toBe(1);
    99	      expect(graph.nodes.size).toBe(2);
   100	    });
   101	
   102	    it('prevents self-loops', () => {
   103	      const graph = coreModule.createGraph();
   104	      const edgeId = coreModule.insertEdge(graph, 'a', 'a', 'CITES', 1.0);
   105	      expect(edgeId).toBeNull();
   106	      expect(graph.edges.size).toBe(0);
   107	    });
   108	
   109	    it('auto-creates source and target nodes', () => {
   110	      const graph = coreModule.createGraph();
   111	      coreModule.insertEdge(graph, 'src', 'tgt', 'ANSWERS');
   112	      expect(graph.nodes.has('src')).toBe(true);
   113	      expect(graph.nodes.has('tgt')).toBe(true);
   114	    });
   115	
   116	    it('clamps edge weight to valid range', () => {
   117	      const graph = coreModule.createGraph();
   118	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES', 5.0);
   119	      expect(edgeId).toBeTruthy();
   120	      const edge = graph.edges.get(edgeId!) as { weight: number };
   121	      expect(edge.weight).toBe(2.0);
   122	    });
   123	
   124	    it('rejects non-finite weight', () => {
   125	      const graph = coreModule.createGraph();
   126	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES', NaN);
   127	      expect(edgeId).toBeNull();
   128	    });
   129	
   130	    it('defaults weight to 1.0 when omitted', () => {
   131	      const graph = coreModule.createGraph();
   132	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES');
   133	      const edge = graph.edges.get(edgeId!) as { weight: number };
   134	      expect(edge.weight).toBe(1.0);
   135	    });
   136	  });
   137	
   138	  describe('updateEdge', () => {
   139	    it('updates weight on an existing edge', () => {
   140	      const graph = coreModule.createGraph();
   141	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0)!;
   142	      const result = coreModule.updateEdge(graph, edgeId, { weight: 1.5 });
   143	      expect(result).toBe(true);
   144	      const edge = graph.edges.get(edgeId) as { weight: number };
   145	      expect(edge.weight).toBe(1.5);
   146	    });
   147	
   148	    it('returns false for non-existent edge', () => {
   149	      const graph = coreModule.createGraph();
   150	      expect(coreModule.updateEdge(graph, 'nonexistent', { weight: 1.0 })).toBe(false);
   151	    });
   152	
   153	    it('merges metadata', () => {
   154	      const graph = coreModule.createGraph();
   155	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'CITES', 1.0, { foo: 'bar' })!;
   156	      coreModule.updateEdge(graph, edgeId, { metadata: { baz: 'qux' } });
   157	      const edge = graph.edges.get(edgeId) as { metadata: Record<string, string> };
   158	      expect(edge.metadata.foo).toBe('bar');
   159	      expect(edge.metadata.baz).toBe('qux');
   160	    });
   161	  });
   162	
   163	  describe('deleteEdge', () => {
   164	    it('deletes an existing edge', () => {
   165	      const graph = coreModule.createGraph();
   166	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS')!;
   167	      expect(coreModule.deleteEdge(graph, edgeId)).toBe(true);
   168	      expect(graph.edges.size).toBe(0);
   169	    });
   170	
   171	    it('returns false for non-existent edge', () => {
   172	      const graph = coreModule.createGraph();
   173	      expect(coreModule.deleteEdge(graph, 'nonexistent')).toBe(false);
   174	    });
   175	  });
   176	
   177	  describe('traverseProvenance', () => {
   178	    it('traverses a linear chain', () => {
   179	      const graph = coreModule.createGraph();
   180	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0);
   181	      coreModule.insertEdge(graph, 'b', 'c', 'CITES', 1.0);
   182	      const result = coreModule.traverseProvenance(graph, 'a', 5);
   183	      expect(result.length).toBe(2);
   184	      expect(result[0].id).toBe('b');
   185	      expect(result[1].id).toBe('c');
   186	    });
   187	
   188	    it('respects max depth', () => {
   189	      const graph = coreModule.createGraph();
   190	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0);
   191	      coreModule.insertEdge(graph, 'b', 'c', 'CITES', 1.0);
   192	      coreModule.insertEdge(graph, 'c', 'd', 'EXTENDS', 1.0);
   193	      const result = coreModule.traverseProvenance(graph, 'a', 2);
   194	      expect(result.length).toBe(2);
   195	      expect(result.map((r) => r.id)).toContain('b');
   196	      expect(result.map((r) => r.id)).toContain('c');
   197	    });
   198	
   199	    it('handles cycles without infinite loops', () => {
   200	      const graph = coreModule.createGraph();
   201	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.0);
   202	      coreModule.insertEdge(graph, 'b', 'a', 'CONTRADICTS', 0.8);
   203	      const result = coreModule.traverseProvenance(graph, 'a', 5);
   204	      expect(result.length).toBe(1);
   205	      expect(result[0].id).toBe('b');
   206	    });
   207	
   208	    it('propagates weights through chains', () => {
   209	      const graph = coreModule.createGraph();
   210	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 1.3);
   211	      coreModule.insertEdge(graph, 'b', 'c', 'CITES', 0.5);
   212	      const result = coreModule.traverseProvenance(graph, 'a', 5);
   213	      const nodeC = result.find((r) => r.id === 'c')!;
   214	      expect(nodeC.weight).toBeCloseTo(0.65, 2);
   215	    });
   216	
   217	    it('returns empty for isolated node', () => {
   218	      const graph = coreModule.createGraph();
   219	      graph.nodes.set('isolated', { id: 'isolated' });
   220	      const result = coreModule.traverseProvenance(graph, 'isolated', 5);
   221	      expect(result.length).toBe(0);
   222	    });
   223	  });
   224	
   225	  describe('getEdgesFrom / getEdgesTo', () => {
   226	    it('returns outgoing edges', () => {
   227	      const graph = coreModule.createGraph();
   228	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   229	      coreModule.insertEdge(graph, 'a', 'c', 'CITES');
   230	      coreModule.insertEdge(graph, 'b', 'c', 'EXTENDS');
   231	      const from = coreModule.getEdgesFrom(graph, 'a');
   232	      expect(from.length).toBe(2);
   233	    });
   234	
   235	    it('returns incoming edges', () => {
   236	      const graph = coreModule.createGraph();
   237	      coreModule.insertEdge(graph, 'a', 'c', 'ANSWERS');
   238	      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
   239	      const to = coreModule.getEdgesTo(graph, 'c');
   240	      expect(to.length).toBe(2);
   241	    });
   242	
   243	    it('returns empty for node with no edges', () => {
   244	      const graph = coreModule.createGraph();
   245	      graph.nodes.set('lonely', { id: 'lonely' });
   246	      expect(coreModule.getEdgesFrom(graph, 'lonely').length).toBe(0);
   247	      expect(coreModule.getEdgesTo(graph, 'lonely').length).toBe(0);
   248	    });
   249	  });
   250	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it, beforeEach } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const coreModule = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
    13	)) as {
    14	  createGraph: () => { nodes: Map<string, object>; edges: Map<string, object> };
    15	  insertEdge: (graph: ReturnType<typeof coreModule.createGraph>, source: string, target: string, relation: string, weight?: number) => string | null;
    16	  resetEdgeIdCounter: () => void;
    17	};
    18	
    19	const signalsModule = require(path.join(
    20	  WORKSPACE_ROOT,
    21	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
    22	)) as {
    23	  computeDegree: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string) => { inDegree: number; outDegree: number; total: number };
    24	  computeDepth: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string) => number;
    25	  computeAllDepths: (graph: ReturnType<typeof coreModule.createGraph>) => Map<string, number>;
    26	  computeMomentum: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, windowSize?: number) => number;
    27	  computeClusterMetrics: (graph: ReturnType<typeof coreModule.createGraph>) => { componentCount: number; sizes: number[]; largestSize: number; isolatedNodes: number };
    28	};
    29	
    30	describe('coverage-graph-signals', () => {
    31	  beforeEach(() => {
    32	    coreModule.resetEdgeIdCounter();
    33	  });
    34	
    35	  describe('computeDegree', () => {
    36	    it('computes in-degree and out-degree', () => {
    37	      const graph = coreModule.createGraph();
    38	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
    39	      coreModule.insertEdge(graph, 'a', 'c', 'CITES');
    40	      coreModule.insertEdge(graph, 'b', 'c', 'EXTENDS');
    41	
    42	      const degreeA = signalsModule.computeDegree(graph, 'a');
    43	      expect(degreeA.outDegree).toBe(2);
    44	      expect(degreeA.inDegree).toBe(0);
    45	      expect(degreeA.total).toBe(2);
    46	
    47	      const degreeC = signalsModule.computeDegree(graph, 'c');
    48	      expect(degreeC.inDegree).toBe(2);
    49	      expect(degreeC.outDegree).toBe(0);
    50	      expect(degreeC.total).toBe(2);
    51	    });
    52	
    53	    it('returns zero for isolated node', () => {
    54	      const graph = coreModule.createGraph();
    55	      graph.nodes.set('lonely', { id: 'lonely' });
    56	      const degree = signalsModule.computeDegree(graph, 'lonely');
    57	      expect(degree.total).toBe(0);
    58	    });
    59	  });
    60	
    61	  describe('computeDepth', () => {
    62	    it('computes depth in a linear chain', () => {
    63	      const graph = coreModule.createGraph();
    64	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
    65	      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
    66	      coreModule.insertEdge(graph, 'c', 'd', 'EXTENDS');
    67	
    68	      expect(signalsModule.computeDepth(graph, 'a')).toBe(0);
    69	      expect(signalsModule.computeDepth(graph, 'b')).toBe(1);
    70	      expect(signalsModule.computeDepth(graph, 'c')).toBe(2);
    71	      expect(signalsModule.computeDepth(graph, 'd')).toBe(3);
    72	    });
    73	
    74	    it('returns 0 for root node', () => {
    75	      const graph = coreModule.createGraph();
    76	      coreModule.insertEdge(graph, 'root', 'child', 'ANSWERS');
    77	      expect(signalsModule.computeDepth(graph, 'root')).toBe(0);
    78	    });
    79	
    80	    it('returns 0 for non-existent node', () => {
    81	      const graph = coreModule.createGraph();
    82	      expect(signalsModule.computeDepth(graph, 'nonexistent')).toBe(0);
    83	    });
    84	
    85	    it('computes longest path depth for diamond DAG', () => {
    86	      const graph = coreModule.createGraph();
    87	      // a -> b -> d
    88	      // a -> c -> d
    89	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
    90	      coreModule.insertEdge(graph, 'a', 'c', 'ANSWERS');
    91	      coreModule.insertEdge(graph, 'b', 'd', 'CITES');
    92	      coreModule.insertEdge(graph, 'c', 'd', 'CITES');
    93	
    94	      expect(signalsModule.computeDepth(graph, 'd')).toBe(2);
    95	    });
    96	  });
    97	
    98	  describe('computeAllDepths', () => {
    99	    it('computes depths for all nodes', () => {
   100	      const graph = coreModule.createGraph();
   101	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   102	      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
   103	
   104	      const depths = signalsModule.computeAllDepths(graph);
   105	      expect(depths.get('a')).toBe(0);
   106	      expect(depths.get('b')).toBe(1);
   107	      expect(depths.get('c')).toBe(2);
   108	    });
   109	
   110	    it('returns empty map for empty graph', () => {
   111	      const graph = coreModule.createGraph();
   112	      const depths = signalsModule.computeAllDepths(graph);
   113	      expect(depths.size).toBe(0);
   114	    });
   115	  });
   116	
   117	  describe('computeMomentum', () => {
   118	    it('counts recent edges within window', () => {
   119	      const graph = coreModule.createGraph();
   120	      // Insert edges — they get current timestamps
   121	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   122	      coreModule.insertEdge(graph, 'a', 'c', 'CITES');
   123	
   124	      // With a large window, both edges should be counted
   125	      const momentum = signalsModule.computeMomentum(graph, 'a', 600000);
   126	      expect(momentum).toBe(2);
   127	    });
   128	
   129	    it('returns 0 for node with no recent edges', () => {
   130	      const graph = coreModule.createGraph();
   131	      graph.nodes.set('stale', { id: 'stale' });
   132	      const momentum = signalsModule.computeMomentum(graph, 'stale', 300000);
   133	      expect(momentum).toBe(0);
   134	    });
   135	
   136	    it('counts edges where node is target', () => {
   137	      const graph = coreModule.createGraph();
   138	      coreModule.insertEdge(graph, 'x', 'target', 'ANSWERS');
   139	      coreModule.insertEdge(graph, 'y', 'target', 'CITES');
   140	      const momentum = signalsModule.computeMomentum(graph, 'target', 600000);
   141	      expect(momentum).toBe(2);
   142	    });
   143	  });
   144	
   145	  describe('computeClusterMetrics', () => {
   146	    it('detects a single connected component', () => {
   147	      const graph = coreModule.createGraph();
   148	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   149	      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
   150	
   151	      const metrics = signalsModule.computeClusterMetrics(graph);
   152	      expect(metrics.componentCount).toBe(1);
   153	      expect(metrics.largestSize).toBe(3);
   154	      expect(metrics.isolatedNodes).toBe(0);
   155	    });
   156	
   157	    it('detects multiple components', () => {
   158	      const graph = coreModule.createGraph();
   159	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   160	      coreModule.insertEdge(graph, 'c', 'd', 'CITES');
   161	
   162	      const metrics = signalsModule.computeClusterMetrics(graph);
   163	      expect(metrics.componentCount).toBe(2);
   164	      expect(metrics.sizes).toEqual([2, 2]);
   165	    });
   166	
   167	    it('counts isolated nodes', () => {
   168	      const graph = coreModule.createGraph();
   169	      graph.nodes.set('x', { id: 'x' });
   170	      graph.nodes.set('y', { id: 'y' });
   171	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   172	
   173	      const metrics = signalsModule.computeClusterMetrics(graph);
   174	      expect(metrics.isolatedNodes).toBe(2);
   175	      expect(metrics.componentCount).toBe(3);
   176	    });
   177	
   178	    it('returns zeros for empty graph', () => {
   179	      const graph = coreModule.createGraph();
   180	      const metrics = signalsModule.computeClusterMetrics(graph);
   181	      expect(metrics.componentCount).toBe(0);
   182	      expect(metrics.largestSize).toBe(0);
   183	      expect(metrics.isolatedNodes).toBe(0);
   184	      expect(metrics.sizes).toEqual([]);
   185	    });
   186	
   187	    it('treats directed edges as undirected for connectivity', () => {
   188	      const graph = coreModule.createGraph();
   189	      // Only one direction, but they should be in the same component
   190	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   191	      const metrics = signalsModule.computeClusterMetrics(graph);
   192	      expect(metrics.componentCount).toBe(1);
   193	      expect(metrics.largestSize).toBe(2);
   194	    });
   195	  });
   196	});

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
   261	      const graph = coreModule.createGraph();
   262	      const edgeId = coreModule.insertEdge(graph, 'node-1', 'node-2', 'ANSWERS');
   263	      expect(edgeId).not.toBeNull();
   264	      expect(graph.edges.size).toBe(1);
   265	    });
   266	
   267	    it('TS schema has CHECK(source_id != target_id) constraint', () => {
   268	      // This is a contract verification — the TS SCHEMA_SQL contains:
   269	      // CHECK(source_id != target_id)
   270	      // We verify this by confirming the contract expectation
   271	      const selfLoopConstraintDocumented = true; // From reading coverage-graph-db.ts line 178
   272	      expect(selfLoopConstraintDocumented).toBe(true);
   273	    });
   274	
   275	    it('self-loop prevention works with empty string node IDs', () => {
   276	      const graph = coreModule.createGraph();
   277	      const edgeId = coreModule.insertEdge(graph, '', '', 'ANSWERS');
   278	      expect(edgeId).toBeNull();
   279	    });
   280	  });

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts | sed -n '281,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   281	
   282	  // ── REQ-GT-005: Namespace isolation ───────────────────────────
   283	
   284	  describe('REQ-GT-005: namespace isolation (loop_type)', () => {
   285	    it('CJS graphs are independent instances (research vs review)', () => {
   286	      const researchGraph = coreModule.createGraph();
   287	      const reviewGraph = coreModule.createGraph();
   288	
   289	      coreModule.insertEdge(researchGraph, 'q-1', 'f-1', 'ANSWERS');
   290	      coreModule.insertEdge(reviewGraph, 'd-1', 'file-1', 'COVERS');
   291	
   292	      expect(researchGraph.edges.size).toBe(1);
   293	      expect(reviewGraph.edges.size).toBe(1);
   294	
   295	      // Verify they are independent
   296	      const researchEdge = [...researchGraph.edges.values()][0];
   297	      const reviewEdge = [...reviewGraph.edges.values()][0];
   298	      expect(researchEdge.relation).toBe('ANSWERS');
   299	      expect(reviewEdge.relation).toBe('COVERS');
   300	    });
   301	
   302	    it('TS VALID_RELATIONS has separate entries for research and review', () => {
   303	      expect(TS_VALID_RELATIONS.research).toBeDefined();
   304	      expect(TS_VALID_RELATIONS.review).toBeDefined();
   305	      expect(TS_VALID_RELATIONS.research).not.toEqual(TS_VALID_RELATIONS.review);
   306	    });
   307	
   308	    it('research-only relations are not in review set', () => {
   309	      const researchOnly = ['ANSWERS', 'SUPERSEDES', 'DERIVED_FROM', 'CITES'];
   310	      const reviewRelations = new Set(TS_VALID_RELATIONS.review);
   311	
   312	      for (const rel of researchOnly) {
   313	        expect(reviewRelations.has(rel)).toBe(false);
   314	      }
   315	    });
   316	
   317	    it('review-only relations are not in research set', () => {
   318	      const reviewOnly = ['EVIDENCE_FOR', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE'];
   319	      const researchRelations = new Set(TS_VALID_RELATIONS.research);
   320	
   321	      for (const rel of reviewOnly) {
   322	        expect(researchRelations.has(rel)).toBe(false);
   323	      }
   324	    });
   325	
   326	    it('shared relations (COVERS, SUPPORTS, CONTRADICTS) exist in both sets', () => {
   327	      const shared = ['COVERS', 'CONTRADICTS'];
   328	      const researchSet = new Set(TS_VALID_RELATIONS.research);
   329	      const reviewSet = new Set(TS_VALID_RELATIONS.review);
   330	
   331	      for (const rel of shared) {
   332	        expect(researchSet.has(rel)).toBe(true);
   333	        expect(reviewSet.has(rel)).toBe(true);
   334	      }
   335	    });
   336	  });
   337	
   338	  // ── REQ-GT-006: Convergence signal alignment ─────────────────
   339	
   340	  describe('REQ-GT-006: convergence signal computation consistency', () => {
   341	    it('computeSourceDiversity returns 0 for empty graph', () => {
   342	      const graph = coreModule.createGraph();
   343	      expect(convergenceModule.computeSourceDiversity(graph)).toBe(0);
   344	    });
   345	
   346	    it('computeSourceDiversity returns canonical per-question average for populated graph', () => {
   347	      // ADR-001 canonical semantics: for each question, count distinct source
   348	      // quality classes reachable via ANSWERS → CITES paths, then average.
   349	      const graph = coreModule.createGraph();
   350	      graph.nodes.set('q-1', { id: 'q-1', kind: 'QUESTION' });
   351	      graph.nodes.set('f-1', { id: 'f-1', kind: 'FINDING' });
   352	      graph.nodes.set('s-1', { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } });
   353	      coreModule.insertEdge(graph, 'f-1', 'q-1', 'ANSWERS');
   354	      coreModule.insertEdge(graph, 'f-1', 's-1', 'CITES');
   355	      // q-1 reaches 1 quality class → average 1.0
   356	      const diversity = convergenceModule.computeSourceDiversity(graph);
   357	      expect(diversity).toBe(1);
   358	    });
   359	
   360	    it('computeEvidenceDepth returns 0 for empty graph', () => {
   361	      const graph = coreModule.createGraph();
   362	      expect(convergenceModule.computeEvidenceDepth(graph)).toBe(0);
   363	    });
   364	
   365	    it('computeQuestionCoverage returns 0 when no questions exist (ADR-001 fail-closed default)', () => {
   366	      const graph = coreModule.createGraph();
   367	      coreModule.insertEdge(graph, 'f-1', 'f-2', 'SUPPORTS');
   368	      // Canonical semantics: empty question set short-circuits to 0, not 1.
   369	      // Fail-closed default so stop gates block when there is no coverage target.
   370	      expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0);
   371	    });
   372	
   373	    it('computeGraphConvergence produces valid score range [0, 1]', () => {
   374	      const graph = coreModule.createGraph();
   375	      graph.nodes.set('q-1', { id: 'q-1', type: 'question' });
   376	      graph.nodes.set('f-1', { id: 'f-1', type: 'finding' });
   377	      coreModule.insertEdge(graph, 'f-1', 'q-1', 'ANSWERS');
   378	
   379	      const result = convergenceModule.computeGraphConvergence(graph);
   380	      expect(result.graphScore).toBeGreaterThanOrEqual(0);
   381	      expect(result.graphScore).toBeLessThanOrEqual(1);
   382	      expect(result.blendedScore).toBeGreaterThanOrEqual(0);
   383	      expect(result.blendedScore).toBeLessThanOrEqual(1);
   384	    });
   385	
   386	    it('computeGraphConvergence blends with Phase 1 compositeStop signal', () => {
   387	      const graph = coreModule.createGraph();
   388	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   389	
   390	      const withoutPhase1 = convergenceModule.computeGraphConvergence(graph);
   391	      const withPhase1 = convergenceModule.computeGraphConvergence(graph, {
   392	        compositeStop: 0.9,
   393	      });
   394	
   395	      // Blended score with high compositeStop should be >= graph-only score
   396	      expect(withPhase1.blendedScore).toBeGreaterThanOrEqual(withoutPhase1.graphScore * 0.5);
   397	    });
   398	
   399	    it('convergence thresholds are accessible (ADR-001 canonical values)', () => {
   400	      expect(convergenceModule.SOURCE_DIVERSITY_THRESHOLD).toBe(1.5);
   401	      expect(convergenceModule.EVIDENCE_DEPTH_THRESHOLD).toBe(1.5);
   402	    });
   403	
   404	    it('cluster metrics align with convergence expectations', () => {
   405	      const graph = coreModule.createGraph();
   406	      // Create two disconnected components
   407	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   408	      coreModule.insertEdge(graph, 'c', 'd', 'COVERS');
   409	
   410	      const metrics = signalsModule.computeClusterMetrics(graph);
   411	      expect(metrics.componentCount).toBe(2);
   412	      expect(metrics.isolatedNodes).toBe(0);
   413	      expect(metrics.largestSize).toBe(2);
   414	    });
   415	  });
   416	
   417	  // ── Cross-cutting: Contradiction scanning contract ────────────
   418	
   419	  describe('contradiction scanning contract alignment', () => {
   420	    it('scanContradictions uses CONTRADICTS relation from both weight maps', () => {
   421	      expect(coreModule.RESEARCH_RELATION_WEIGHTS).toHaveProperty('CONTRADICTS');
   422	      expect(coreModule.REVIEW_RELATION_WEIGHTS).toHaveProperty('CONTRADICTS');
   423	    });
   424	
   425	    it('scanContradictions returns structured pairs', () => {
   426	      const graph = coreModule.createGraph();
   427	      coreModule.insertEdge(graph, 'claim-1', 'claim-2', 'CONTRADICTS', 0.8);
   428	
   429	      const contradictions = contradictionsModule.scanContradictions(graph);
   430	      expect(contradictions.length).toBe(1);
   431	      expect(contradictions[0].source).toBe('claim-1');
   432	      expect(contradictions[0].target).toBe('claim-2');
   433	      expect(contradictions[0].weight).toBe(0.8);
   434	    });
   435	
   436	    it('reportContradictions includes total and pairs', () => {
   437	      const graph = coreModule.createGraph();
   438	      coreModule.insertEdge(graph, 'a', 'b', 'CONTRADICTS');
   439	      coreModule.insertEdge(graph, 'c', 'd', 'CONTRADICTS');
   440	
   441	      const report = contradictionsModule.reportContradictions(graph);
   442	      expect(report.total).toBe(2);
   443	      expect(report.pairs.length).toBe(2);
   444	    });
   445	  });
   446	
   447	  // ── Fallback authority chain ──────────────────────────────────
   448	
   449	  describe('fallback authority chain contract', () => {
   450	    it('CJS layer works standalone without MCP/SQLite dependency', () => {
   451	      // The CJS modules are pure in-memory and do not require better-sqlite3
   452	      const graph = coreModule.createGraph();
   453	      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   454	      expect(edgeId).not.toBeNull();
   455	      expect(graph.nodes.size).toBe(2);
   456	      expect(graph.edges.size).toBe(1);
   457	    });
   458	
   459	    it('signals layer computes from in-memory graph without DB', () => {
   460	      const graph = coreModule.createGraph();
   461	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   462	      coreModule.insertEdge(graph, 'b', 'c', 'CITES');
   463	
   464	      const degree = signalsModule.computeDegree(graph, 'b');
   465	      expect(degree.inDegree).toBe(1);
   466	      expect(degree.outDegree).toBe(1);
   467	      expect(degree.total).toBe(2);
   468	    });
   469	
   470	    it('convergence layer computes from in-memory graph without DB', () => {
   471	      const graph = coreModule.createGraph();
   472	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   473	
   474	      const convergence = convergenceModule.computeGraphConvergence(graph);
   475	      expect(convergence).toHaveProperty('graphScore');
   476	      expect(convergence).toHaveProperty('blendedScore');
   477	      expect(convergence).toHaveProperty('components');
   478	    });
   479	  });
   480	});

 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import os from 'node:os';
     3	import path from 'node:path';
     4	import { createRequire } from 'node:module';
     5	import { fileURLToPath } from 'node:url';
     6	import { afterEach, beforeEach, describe, expect, it } from 'vitest';
     7	
     8	import {
     9	  VALID_RELATIONS,
    10	  RESEARCH_WEIGHTS,
    11	  clampWeight as clampDbWeight,
    12	  closeDb,
    13	  getEdge,
    14	  getEdges,
    15	  getNodes,
    16	  initDb,
    17	  upsertEdge,
    18	  upsertNode,
    19	  type CoverageEdge,
    20	  type CoverageNode,
    21	  type Namespace,
    22	} from '../../mcp_server/lib/coverage-graph/coverage-graph-db.js';
    23	import {
    24	  findContradictions,
    25	  findCoverageGaps,
    26	} from '../../mcp_server/lib/coverage-graph/coverage-graph-query.js';
    27	import {
    28	  computeNodeSignals,
    29	  computeResearchSignals,
    30	  computeReviewSignals,
    31	} from '../../mcp_server/lib/coverage-graph/coverage-graph-signals.js';
    32	
    33	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
    34	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    35	const require = createRequire(import.meta.url);
    36	
    37	type CjsGraph = { nodes: Map<string, Record<string, unknown>>; edges: Map<string, Record<string, unknown>> };
    38	
    39	const coreModule = require(path.join(
    40	  WORKSPACE_ROOT,
    41	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
    42	)) as {
    43	  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
    44	  createGraph: () => CjsGraph;
    45	  insertEdge: (
    46	    graph: CjsGraph,
    47	    source: string,
    48	    target: string,
    49	    relation: string,
    50	    weight?: number,
    51	    metadata?: Record<string, unknown>,
    52	  ) => string | null;
    53	  clampWeight: (weight: number) => number | null;
    54	  resetEdgeIdCounter: () => void;
    55	};
    56	
    57	const cjsSignalsModule = require(path.join(
    58	  WORKSPACE_ROOT,
    59	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
    60	)) as {
    61	  computeDegree: (graph: CjsGraph, nodeId: string) => { inDegree: number; outDegree: number; total: number };
    62	  computeAllDepths: (graph: CjsGraph) => Map<string, number>;
    63	};
    64	
    65	const cjsContradictionsModule = require(path.join(
    66	  WORKSPACE_ROOT,
    67	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
    68	)) as {
    69	  scanContradictions: (graph: CjsGraph) => Array<{ edgeId: string; source: string; target: string }>;
    70	  reportContradictions: (graph: CjsGraph) => { total: number; pairs: unknown[]; byNode: Map<string, unknown[]> };
    71	  contradictionDensity: (graph: CjsGraph) => number;
    72	};
    73	
    74	const cjsConvergenceModule = require(path.join(
    75	  WORKSPACE_ROOT,
    76	  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
    77	)) as {
    78	  computeQuestionCoverage: (graph: CjsGraph) => number;
    79	  evaluateGraphGates: (graph: CjsGraph) => {
    80	    sourceDiversity: { pass: boolean; value: number; threshold: number };
    81	    evidenceDepth: { pass: boolean; value: number; threshold: number };
    82	    allPass: boolean;
    83	  };
    84	};
    85	
    86	function cjsNodeWeightSums(graph: CjsGraph): Map<string, number> {
    87	  const sums = new Map<string, number>();
    88	
    89	  for (const edge of graph.edges.values()) {
    90	    const weight = Number(edge.weight ?? 0);
    91	    const source = String(edge.source);
    92	    const target = String(edge.target);
    93	    sums.set(source, (sums.get(source) ?? 0) + weight);
    94	    sums.set(target, (sums.get(target) ?? 0) + weight);
    95	  }
    96	
    97	  return sums;
    98	}
    99	
   100	function makeResearchNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
   101	  return {
   102	    id,
   103	    specFolder,
   104	    loopType: 'research',
   105	    sessionId,
   106	    kind,
   107	    name,
   108	    metadata,
   109	  };
   110	}
   111	
   112	function makeReviewNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
   113	  return {
   114	    id,
   115	    specFolder,
   116	    loopType: 'review',
   117	    sessionId,
   118	    kind,
   119	    name,
   120	    metadata,
   121	  };
   122	}
   123	
   124	function makeEdge(edge: CoverageEdge): CoverageEdge {
   125	  return edge;
   126	}
   127	
   128	describe('coverage-graph cross-layer integration', () => {
   129	  let tempDir = '';
   130	
   131	  beforeEach(() => {
   132	    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-cross-layer-'));
   133	    initDb(tempDir);
   134	    coreModule.resetEdgeIdCounter();
   135	  });
   136	
   137	  afterEach(() => {
   138	    try {
   139	      closeDb();
   140	    } catch {
   141	      // best-effort cleanup for tests that intentionally close the DB
   142	    }
   143	    fs.rmSync(tempDir, { recursive: true, force: true });
   144	  });
   145	
   146	  it('keeps research relation names aligned between CJS weights and TS valid relations', () => {
   147	    const cjsRelations = Object.keys(coreModule.RESEARCH_RELATION_WEIGHTS).sort();
   148	    const tsRelations = [...VALID_RELATIONS.research].sort();
   149	    const tsWeightRelations = Object.keys(RESEARCH_WEIGHTS).sort();
   150	
   151	    expect(cjsRelations).toEqual(tsRelations);
   152	    expect(cjsRelations).toEqual(tsWeightRelations);
   153	  });
   154	
   155	  it('keeps clamping bounds consistent at 0.0-2.0 in both layers', () => {
   156	    expect(coreModule.clampWeight(-10)).toBe(0.0);
   157	    expect(coreModule.clampWeight(10)).toBe(2.0);
   158	    expect(clampDbWeight(-10)).toBe(0.0);
   159	    expect(clampDbWeight(10)).toBe(2.0);
   160	
   161	    upsertNode(makeResearchNode('spec-clamp', 'session-clamp', 'finding-clamp', 'FINDING', 'Clamp finding'));
   162	    upsertNode(makeResearchNode('spec-clamp', 'session-clamp', 'question-clamp', 'QUESTION', 'Clamp question'));
   163	
   164	    const edgeId = upsertEdge(makeEdge({
   165	      id: 'edge-clamp',
   166	      specFolder: 'spec-clamp',
   167	      loopType: 'research',
   168	      sessionId: 'session-clamp',
   169	      sourceId: 'finding-clamp',
   170	      targetId: 'question-clamp',
   171	      relation: 'ANSWERS',
   172	      weight: 9.9,
   173	    }));
   174	
   175	    expect(edgeId).toBe('edge-clamp');
   176	    expect(getEdge(
   177	      { specFolder: 'spec-clamp', loopType: 'research', sessionId: 'session-clamp' },
   178	      'edge-clamp',
   179	    )?.weight).toBe(2.0);
   180	  });
   181	
   182	  it('handles empty graphs without errors in both layers', () => {
   183	    const graph = coreModule.createGraph();
   184	    const emptyResearchNs: Namespace = {
   185	      specFolder: 'spec-empty',
   186	      loopType: 'research',
   187	      sessionId: 'session-empty',
   188	    };
   189	
   190	    expect(cjsSignalsModule.computeAllDepths(graph).size).toBe(0);
   191	    expect(cjsContradictionsModule.scanContradictions(graph)).toEqual([]);
   192	    expect(cjsContradictionsModule.reportContradictions(graph).total).toBe(0);
   193	    expect(cjsContradictionsModule.contradictionDensity(graph)).toBe(0);
   194	    // ADR-001 canonical thresholds: sourceDiversity 1.5, evidenceDepth 1.5
   195	    expect(cjsConvergenceModule.evaluateGraphGates(graph)).toMatchObject({
   196	      sourceDiversity: { pass: false, value: 0, threshold: 1.5 },
   197	      evidenceDepth: { pass: false, value: 0, threshold: 1.5 },
   198	      allPass: false,
   199	    });
   200	
   201	    expect(getNodes(emptyResearchNs)).toEqual([]);
   202	    expect(getEdges(emptyResearchNs)).toEqual([]);
   203	    expect(findCoverageGaps(emptyResearchNs)).toEqual([]);
   204	    expect(findContradictions(emptyResearchNs)).toEqual([]);
   205	    expect(computeNodeSignals(emptyResearchNs)).toEqual([]);
   206	    expect(computeResearchSignals(emptyResearchNs)).toEqual({
   207	      questionCoverage: 0,
   208	      claimVerificationRate: 0,
   209	      contradictionDensity: 0,
   210	      sourceDiversity: 0,
   211	      evidenceDepth: 0,
   212	    });
   213	  });
   214	
   215	  it('rejects self-loops in both layers', () => {
   216	    const graph = coreModule.createGraph();
   217	    const cjsEdgeId = coreModule.insertEdge(graph, 'loop-node', 'loop-node', 'CITES', 1.0);
   218	
   219	    upsertNode(makeResearchNode('spec-loop', 'session-loop', 'loop-node', 'SOURCE', 'Loop source'));
   220	    const tsEdgeId = upsertEdge(makeEdge({
   221	      id: 'edge-self-loop',
   222	      specFolder: 'spec-loop',
   223	      loopType: 'research',
   224	      sessionId: 'session-loop',
   225	      sourceId: 'loop-node',
   226	      targetId: 'loop-node',
   227	      relation: 'CITES',
   228	      weight: 1.0,
   229	    }));
   230	
   231	    expect(cjsEdgeId).toBeNull();
   232	    expect(graph.edges.size).toBe(0);
   233	    expect(tsEdgeId).toBeNull();
   234	    expect(getEdges({ specFolder: 'spec-loop', loopType: 'research', sessionId: 'session-loop' })).toEqual([]);
   235	  });
   236	
   237	  it('produces comparable structural and research signals for the same graph', () => {
   238	    const specFolder = 'spec-signals';
   239	    const sessionId = 'session-signals';
   240	    const ns: Namespace = { specFolder, loopType: 'research', sessionId };
   241	    const graph = coreModule.createGraph();
   242	
   243	    graph.nodes.set('question-1', { id: 'question-1', type: 'question' });
   244	    graph.nodes.set('finding-1', { id: 'finding-1', type: 'finding' });
   245	    graph.nodes.set('finding-2', { id: 'finding-2', type: 'finding' });
   246	    graph.nodes.set('source-1', { id: 'source-1', type: 'source' });
   247	    graph.nodes.set('source-2', { id: 'source-2', type: 'source' });
   248	
   249	    const cjsAnswer1 = coreModule.insertEdge(graph, 'finding-1', 'question-1', 'ANSWERS', 1.3);
   250	    const cjsAnswer2 = coreModule.insertEdge(graph, 'finding-2', 'question-1', 'ANSWERS', 1.0);
   251	    const cjsCite1 = coreModule.insertEdge(graph, 'finding-1', 'source-1', 'CITES', 0.9);
   252	    const cjsCite2 = coreModule.insertEdge(graph, 'finding-2', 'source-2', 'CITES', 1.1);
   253	    const cjsContradiction = coreModule.insertEdge(graph, 'finding-1', 'finding-2', 'CONTRADICTS', 0.8);
   254	
   255	    expect([cjsAnswer1, cjsAnswer2, cjsCite1, cjsCite2, cjsContradiction].every(Boolean)).toBe(true);
   256	
   257	    const nodes: CoverageNode[] = [
   258	      makeResearchNode(specFolder, sessionId, 'question-1', 'QUESTION', 'Question 1'),
   259	      makeResearchNode(specFolder, sessionId, 'finding-1', 'FINDING', 'Finding 1'),
   260	      makeResearchNode(specFolder, sessionId, 'finding-2', 'FINDING', 'Finding 2'),
   261	      makeResearchNode(specFolder, sessionId, 'source-1', 'SOURCE', 'Source 1', { quality_class: 'primary' }),
   262	      makeResearchNode(specFolder, sessionId, 'source-2', 'SOURCE', 'Source 2', { quality_class: 'secondary' }),
   263	    ];
   264	
   265	    const edges: CoverageEdge[] = [
   266	      makeEdge({
   267	        id: 'edge-answer-1',
   268	        specFolder,
   269	        loopType: 'research',
   270	        sessionId,
   271	        sourceId: 'finding-1',
   272	        targetId: 'question-1',
   273	        relation: 'ANSWERS',
   274	        weight: 1.3,
   275	      }),
   276	      makeEdge({
   277	        id: 'edge-answer-2',
   278	        specFolder,
   279	        loopType: 'research',
   280	        sessionId,
   281	        sourceId: 'finding-2',
   282	        targetId: 'question-1',
   283	        relation: 'ANSWERS',
   284	        weight: 1.0,
   285	      }),
   286	      makeEdge({
   287	        id: 'edge-cite-1',
   288	        specFolder,
   289	        loopType: 'research',
   290	        sessionId,
   291	        sourceId: 'finding-1',
   292	        targetId: 'source-1',
   293	        relation: 'CITES',
   294	        weight: 0.9,
   295	      }),
   296	      makeEdge({
   297	        id: 'edge-cite-2',
   298	        specFolder,
   299	        loopType: 'research',
   300	        sessionId,
   301	        sourceId: 'finding-2',
   302	        targetId: 'source-2',
   303	        relation: 'CITES',
   304	        weight: 1.1,
   305	      }),
   306	      makeEdge({
   307	        id: 'edge-contradiction-1',
   308	        specFolder,
   309	        loopType: 'research',
   310	        sessionId,
   311	        sourceId: 'finding-1',
   312	        targetId: 'finding-2',
   313	        relation: 'CONTRADICTS',
   314	        weight: 0.8,
   315	      }),
   316	    ];
   317	
   318	    for (const node of nodes) upsertNode(node);
   319	    for (const edge of edges) upsertEdge(edge);
   320	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   261	
   262	      const start = performance.now();
   263	      const report = contradictionsModule.reportContradictions(graph);
   264	      const elapsed = performance.now() - start;
   265	
   266	      expect(report.total).toBe(100);
   267	      expect(report.pairs.length).toBe(100);
   268	      expect(elapsed).toBeLessThan(1000);
   269	    });
   270	
   271	    it('contradiction scan returns empty array for graph with no contradictions', () => {
   272	      const graph = buildLargeGraph(500);
   273	
   274	      // buildLargeGraph uses mixed relations; filter out any accidental CONTRADICTS
   275	      // and verify the scan works correctly on a large graph
   276	      const contradictions = contradictionsModule.scanContradictions(graph);
   277	      // Some edges use CONTRADICTS from the round-robin relation picker
   278	      expect(Array.isArray(contradictions)).toBe(true);
   279	    });
   280	  });
   281	
   282	  // ── Provenance traversal at scale ─────────────────────────────
   283	
   284	  describe('provenance traversal at scale', () => {
   285	    it('traverses deep provenance chains (depth 50+)', () => {
   286	      const graph = coreModule.createGraph();
   287	
   288	      // Create a chain of 100 nodes
   289	      for (let i = 0; i < 99; i++) {
   290	        coreModule.insertEdge(graph, `n-${i}`, `n-${i + 1}`, 'DERIVED_FROM');
   291	      }
   292	
   293	      const start = performance.now();
   294	      const chain = coreModule.traverseProvenance(graph, 'n-0', 100);
   295	      const elapsed = performance.now() - start;
   296	
   297	      // Should reach nodes up to depth 100 or DEFAULT_MAX_DEPTH
   298	      expect(chain.length).toBeGreaterThan(0);
   299	      expect(elapsed).toBeLessThan(2000);
   300	    });
   301	
   302	    it('handles diamond-shaped provenance without infinite loops', () => {
   303	      const graph = coreModule.createGraph();
   304	
   305	      // Diamond: a → b, a → c, b → d, c → d
   306	      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
   307	      coreModule.insertEdge(graph, 'a', 'c', 'ANSWERS');
   308	      coreModule.insertEdge(graph, 'b', 'd', 'SUPPORTS');
   309	      coreModule.insertEdge(graph, 'c', 'd', 'SUPPORTS');
   310	
   311	      const chain = coreModule.traverseProvenance(graph, 'a');
   312	      // Should visit b, c, d without duplicates or infinite loop
   313	      const visitedIds = chain.map(n => n.id);
   314	      expect(visitedIds).toContain('b');
   315	      expect(visitedIds).toContain('c');
   316	      expect(visitedIds).toContain('d');
   317	    });
   318	
   319	    it('provenance traversal with 1000+ nodes completes in bounded time', () => {
   320	      const graph = buildLargeGraph(1000);
   321	
   322	      const start = performance.now();
   323	      const chain = coreModule.traverseProvenance(graph, 'node-0', 10);
   324	      const elapsed = performance.now() - start;
   325	
   326	      expect(chain.length).toBeGreaterThan(0);
   327	      expect(elapsed).toBeLessThan(5000);
   328	    });
   329	  });
   330	
   331	  // ── Multi-component stress ────────────────────────────────────
   332	
   333	  describe('multi-component graph stress', () => {
   334	    it('handles 100 disconnected components', () => {
   335	      const graph = coreModule.createGraph();
   336	
   337	      // Create 100 disconnected 5-node clusters
   338	      for (let c = 0; c < 100; c++) {
   339	        const base = c * 5;
   340	        for (let i = 0; i < 4; i++) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts | sed -n '341,640p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts | sed -n '321,640p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   341	          coreModule.insertEdge(
   342	            graph,
   343	            `cluster-${c}-node-${i}`,
   344	            `cluster-${c}-node-${i + 1}`,
   345	            'SUPPORTS',
   346	          );
   347	        }
   348	      }
   349	
   350	      expect(graph.nodes.size).toBe(500);
   351	
   352	      const start = performance.now();
   353	      const metrics = signalsModule.computeClusterMetrics(graph);
   354	      const elapsed = performance.now() - start;
   355	
   356	      expect(metrics.componentCount).toBe(100);
   357	      expect(metrics.largestSize).toBe(5);
   358	      expect(metrics.isolatedNodes).toBe(0);
   359	      expect(elapsed).toBeLessThan(5000);
   360	    });
   361	
   362	    it('handles graph with 200 isolated nodes plus 500 connected nodes', () => {
   363	      const graph = coreModule.createGraph();
   364	
   365	      // Add 200 isolated nodes
   366	      for (let i = 0; i < 200; i++) {
   367	        graph.nodes.set(`isolated-${i}`, { id: `isolated-${i}` });
   368	      }
   369	
   370	      // Add 499 edges connecting 500 nodes in a chain
   371	      for (let i = 0; i < 499; i++) {
   372	        coreModule.insertEdge(graph, `connected-${i}`, `connected-${i + 1}`, 'ANSWERS');
   373	      }
   374	
   375	      expect(graph.nodes.size).toBe(700);
   376	
   377	      const metrics = signalsModule.computeClusterMetrics(graph);
   378	      expect(metrics.isolatedNodes).toBe(200);
   379	      expect(metrics.largestSize).toBe(500);
   380	      // 1 big component + 200 isolated = 201 components
   381	      expect(metrics.componentCount).toBe(201);
   382	    });
   383	  });
   384	
   385	  // ── Question coverage at scale ────────────────────────────────
   386	
   387	  describe('question coverage at scale', () => {
   388	    it('tracks question coverage across 500 questions', () => {
   389	      const graph = coreModule.createGraph();
   390	
   391	      // Create 500 questions; cover 250 of them with TWO answering findings each
   392	      // (ADR-001 canonical semantics: a question needs ≥2 ANSWERS edges to count as covered).
   393	      for (let i = 0; i < 500; i++) {
   394	        graph.nodes.set(`q-${i}`, { id: `q-${i}`, kind: 'QUESTION' });
   395	      }
   396	
   397	      for (let i = 0; i < 250; i++) {
   398	        graph.nodes.set(`f-${i}a`, { id: `f-${i}a`, kind: 'FINDING' });
   399	        graph.nodes.set(`f-${i}b`, { id: `f-${i}b`, kind: 'FINDING' });
   400	        coreModule.insertEdge(graph, `f-${i}a`, `q-${i}`, 'ANSWERS');
   401	        coreModule.insertEdge(graph, `f-${i}b`, `q-${i}`, 'ANSWERS');
   402	      }
   403	
   404	      const start = performance.now();
   405	      const coverage = convergenceModule.computeQuestionCoverage(graph);
   406	      const elapsed = performance.now() - start;
   407	
   408	      expect(coverage).toBeCloseTo(0.5, 2); // 250 covered / 500 total
   409	      expect(elapsed).toBeLessThan(2000);
   410	    });
   411	  });
   412	});

 succeeded in 0ms:
   321	    const cjsDepths = cjsSignalsModule.computeAllDepths(graph);
   322	    const cjsWeights = cjsNodeWeightSums(graph);
   323	    const tsSignals = new Map(computeNodeSignals(ns).map(signal => [signal.nodeId, signal]));
   324	
   325	    for (const nodeId of graph.nodes.keys()) {
   326	      const cjsDegree = cjsSignalsModule.computeDegree(graph, nodeId);
   327	      const tsSignal = tsSignals.get(nodeId);
   328	
   329	      expect(tsSignal).toBeDefined();
   330	      expect(tsSignal).toMatchObject({
   331	        degree: cjsDegree.total,
   332	        inDegree: cjsDegree.inDegree,
   333	        outDegree: cjsDegree.outDegree,
   334	        depth: cjsDepths.get(nodeId) ?? 0,
   335	        weightSum: cjsWeights.get(nodeId) ?? 0,
   336	      });
   337	    }
   338	
   339	    expect(computeResearchSignals(ns).questionCoverage).toBe(cjsConvergenceModule.computeQuestionCoverage(graph));
   340	
   341	    const cjsContradictions = cjsContradictionsModule.scanContradictions(graph)
   342	      .map(edge => ({ source: edge.source, target: edge.target }))
   343	      .sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
   344	    const tsContradictions = findContradictions(ns)
   345	      .map(edge => ({ source: edge.sourceId, target: edge.targetId }))
   346	      .sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
   347	
   348	    expect(tsContradictions).toEqual(cjsContradictions);
   349	  });
   350	
   351	  it('keeps research data invisible to review queries in the same spec folder', () => {
   352	    const specFolder = 'spec-isolation';
   353	    const sessionId = 'session-isolation';
   354	    const researchNs: Namespace = { specFolder, loopType: 'research', sessionId };
   355	    const reviewNs: Namespace = { specFolder, loopType: 'review', sessionId };
   356	
   357	    upsertNode(makeResearchNode(specFolder, sessionId, 'research-question', 'QUESTION', 'Research question'));
   358	    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-a', 'FINDING', 'Research finding A'));
   359	    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-b', 'FINDING', 'Research finding B'));
   360	    upsertEdge(makeEdge({
   361	      id: 'research-contradiction',
   362	      specFolder,
   363	      loopType: 'research',
   364	      sessionId,
   365	      sourceId: 'research-finding-a',
   366	      targetId: 'research-finding-b',
   367	      relation: 'CONTRADICTS',
   368	      weight: 0.8,
   369	    }));
   370	
   371	    upsertNode(makeReviewNode(specFolder, sessionId, 'review-dimension', 'DIMENSION', 'Correctness'));
   372	    upsertNode(makeReviewNode(specFolder, sessionId, 'review-file', 'FILE', 'coverage-graph.ts', { hotspot_score: 2 }));
   373	    upsertNode(makeReviewNode(specFolder, sessionId, 'review-finding', 'FINDING', 'Review finding'));
   374	    upsertEdge(makeEdge({
   375	      id: 'review-cover',
   376	      specFolder,
   377	      loopType: 'review',
   378	      sessionId,
   379	      sourceId: 'review-dimension',
   380	      targetId: 'review-file',
   381	      relation: 'COVERS',
   382	      weight: 1.3,
   383	    }));
   384	
   385	    expect(getNodes(researchNs).map(node => node.id).sort()).toEqual([
   386	      'research-finding-a',
   387	      'research-finding-b',
   388	      'research-question',
   389	    ]);
   390	    expect(getNodes(reviewNs).map(node => node.id).sort()).toEqual([
   391	      'review-dimension',
   392	      'review-file',
   393	      'review-finding',
   394	    ]);
   395	
   396	    expect(findContradictions(reviewNs)).toEqual([]);
   397	    expect(findCoverageGaps(reviewNs)).toEqual([
   398	      {
   399	        nodeId: 'review-file',
   400	        kind: 'FILE',
   401	        name: 'coverage-graph.ts',
   402	        reason: 'No outgoing COVERS or EVIDENCE_FOR edges',
   403	      },
   404	    ]);
   405	    expect(computeReviewSignals(reviewNs)).toMatchObject({
   406	      dimensionCoverage: 1,
   407	      findingStability: 1,
   408	      evidenceDensity: 0,
   409	      hotspotSaturation: 0,
   410	    });
   411	
   412	    expect(findContradictions(researchNs)).toHaveLength(1);
   413	    expect(computeResearchSignals(researchNs).contradictionDensity).toBe(1);
   414	  });
   415	});

exec
/bin/zsh -lc "rg -n \"coverage-graph-(core|convergence|signals|contradictions)\\.cjs|computeSourceDiversity|computeGraphConvergence|scanContradictions|computeMomentum|traverseProvenance\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1601:Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1603:The momentum signal applies as an additive bonus in Stage 2 of the pipeline, capped at +0.05 per result. Batch computation via `computeMomentumScores()` is session-cached to avoid repeated database queries within a single search request. Cache invalidation follows the established pattern from `graph-search-fn.ts`: caches clear on edge mutations via `clearGraphSignalsCache()`.
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:21:Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:23:The momentum signal applies as an additive bonus in Stage 2 of the pipeline, capped at +0.05 per result. Batch computation via `computeMomentumScores()` is session-cached to avoid repeated database queries within a single search request. Cache invalidation follows the established pattern from `graph-search-fn.ts`: caches clear on edge mutations via `clearGraphSignalsCache()`.
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:2:// Covers: snapshotDegrees, computeMomentum,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:9:  computeMomentum,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:10:  computeMomentumScores,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:109:  computeMomentumScores(db, memoryIds);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:210:  // 2. computeMomentum
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:211:  describe('computeMomentum', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:213:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:229:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:244:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:255:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:261:      const momentum = computeMomentum(db, 999);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:266:  // 3. computeMomentumScores
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:267:  describe('computeMomentumScores', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:272:      const scores = computeMomentumScores(db, [1, 2, 3]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:283:      const scores1 = computeMomentumScores(db, [1, 2]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:286:      const scores2 = computeMomentumScores(db, [1, 2]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:294:      const scores = computeMomentumScores(db, []);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:645:      computeMomentumScores(db, [1, 2]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:665:      const scores1 = computeMomentumScores(db, [1]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:672:      const stale = computeMomentumScores(db, [1]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:677:      const fresh = computeMomentumScores(db, [1]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:709:      const momentumBefore = computeMomentumScores(db, [1]).get(1) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:716:      const momentumAfter = computeMomentumScores(db, [1]).get(1) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:741:      const momentumBefore = computeMomentumScores(db, [1]).get(1) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:754:      const momentumAfterInsert = computeMomentumScores(db, [1]).get(1) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:768:      const momentumAfterUndo = computeMomentumScores(db, [1]).get(1) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:896:      const momentum = computeMomentum(db, 9999);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:919:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:941:      expect(() => computeMomentum(db, 100)).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:8:  scanContradictions,
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:143:  it('T-N3-06: scanContradictions with heuristic (no vec)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:148:    const pairs = scanContradictions(db);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:156:  it('T-N3-07: scanContradictions returns empty on no data', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:160:    const pairs = scanContradictions(db);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:13:const { computeClusterMetrics } = require('./coverage-graph-signals.cjs');
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:154:function computeSourceDiversity(graph) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:295:function computeGraphConvergence(graph, signals) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:317:  const sourceDiversity = computeSourceDiversity(graph);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:377:  const diversity = computeSourceDiversity(graph);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:409:  computeSourceDiversity,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:415:  computeGraphConvergence,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:253: * Adapted from graph-signals.ts computeMomentum():
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:262:function computeMomentum(graph, nodeId, windowSize, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:372:  computeMomentum,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:255:function traverseProvenance(graph, nodeId, maxDepth) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:380:  traverseProvenance,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:76:function scanContradictions(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:116:  const raw = scanContradictions(graph, sessionId);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:199:  scanContradictions,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:158:export function computeMomentum(db: Database.Database, memoryId: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:166:    console.warn(`[graph-signals] computeMomentum failed for ${memoryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:175:export function computeMomentumScores(db: Database.Database, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:186:    const momentum = computeMomentum(db, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:574:    const momentumScores = computeMomentumScores(db, ids);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:41:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:59:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:67:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:69:  scanContradictions: (graph: CjsGraph) => Array<{ edgeId: string; source: string; target: string }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:76:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:191:    expect(cjsContradictionsModule.scanContradictions(graph)).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:341:    const cjsContradictions = cjsContradictionsModule.scanContradictions(graph)
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:5: *   - CJS modules: coverage-graph-core.cjs, coverage-graph-signals.cjs,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:6: *     coverage-graph-convergence.cjs, coverage-graph-contradictions.cjs
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:27:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:40:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:49:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:51:  computeSourceDiversity: (graph: any) => number;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:54:  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:61:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:63:  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:341:    it('computeSourceDiversity returns 0 for empty graph', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:343:      expect(convergenceModule.computeSourceDiversity(graph)).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:346:    it('computeSourceDiversity returns canonical per-question average for populated graph', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:356:      const diversity = convergenceModule.computeSourceDiversity(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:373:    it('computeGraphConvergence produces valid score range [0, 1]', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:379:      const result = convergenceModule.computeGraphConvergence(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:386:    it('computeGraphConvergence blends with Phase 1 compositeStop signal', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:390:      const withoutPhase1 = convergenceModule.computeGraphConvergence(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:391:      const withPhase1 = convergenceModule.computeGraphConvergence(graph, {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:420:    it('scanContradictions uses CONTRADICTS relation from both weight maps', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:425:    it('scanContradictions returns structured pairs', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:429:      const contradictions = contradictionsModule.scanContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:474:      const convergence = convergenceModule.computeGraphConvergence(graph);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:104:| `computeMomentum` | graph-signals.ts | Computes single-node momentum from recent degree deltas |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:105:| `computeMomentumScores` | graph-signals.ts | Batch momentum computation with session caching |
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:36:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:38:  computeSourceDiversity: (graph: CjsGraph) => number;
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:42:  computeGraphConvergence: (graph: CjsGraph, signals?: { compositeStop?: number }) => {
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:214:      const cjsSourceDiversity = convergenceModule.computeSourceDiversity(graph);
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:218:      const cjsConvergence = convergenceModule.computeGraphConvergence(graph, {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:12:  'scripts/lib/coverage-graph-convergence.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:16:  computeSourceDiversity: (graph: Graph) => number;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:19:  computeGraphConvergence: (graph: Graph, signals?: { compositeStop?: number }) => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:100:    expect(convergenceModule.computeSourceDiversity(graph)).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:104:    expect(convergenceModule.computeSourceDiversity(makeGraph([], []))).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:169:    const result = convergenceModule.computeGraphConvergence(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:186:    const result = convergenceModule.computeGraphConvergence(graph, { compositeStop: 0.8 });
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:24:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:29:  traverseProvenance: (graph: any, nodeId: string, maxDepth?: number) => Array<{ id: string; depth: number; relation: string; weight: number; path: string[] }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:35:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:44:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:46:  computeSourceDiversity: (graph: any) => number;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:49:  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:54:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:56:  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:175:      const diversity = convergenceModule.computeSourceDiversity(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:200:      const convergence = convergenceModule.computeGraphConvergence(graph, {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:242:      const contradictions = contradictionsModule.scanContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:276:      const contradictions = contradictionsModule.scanContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:294:      const chain = coreModule.traverseProvenance(graph, 'n-0', 100);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:311:      const chain = coreModule.traverseProvenance(graph, 'a');
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:323:      const chain = coreModule.traverseProvenance(graph, 'node-0', 10);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:555:export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:12:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:21:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:26:  computeMomentum: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, windowSize?: number) => number;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:117:  describe('computeMomentum', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:125:      const momentum = signalsModule.computeMomentum(graph, 'a', 600000);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:132:      const momentum = signalsModule.computeMomentum(graph, 'stale', 300000);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:140:      const momentum = signalsModule.computeMomentum(graph, 'target', 600000);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:12:  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:21:  traverseProvenance: (graph: ReturnType<typeof coreModule.createGraph>, nodeId: string, maxDepth?: number) => Array<{ id: string; depth: number; relation: string; weight: number; path: string[] }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:177:  describe('traverseProvenance', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:182:      const result = coreModule.traverseProvenance(graph, 'a', 5);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:193:      const result = coreModule.traverseProvenance(graph, 'a', 2);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:203:      const result = coreModule.traverseProvenance(graph, 'a', 5);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:212:      const result = coreModule.traverseProvenance(graph, 'a', 5);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:220:      const result = coreModule.traverseProvenance(graph, 'isolated', 5);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:88:export function scanContradictions(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:99:      pairs.push(...scanContradictionsVector(database));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:101:      pairs.push(...scanContradictionsHeuristic(database));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:105:    console.warn(`[consolidation] scanContradictions error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:125:function scanContradictionsVector(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:188:function scanContradictionsHeuristic(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:440:  const contradictionPairs = scanContradictions(database);

codex
I’ve got the code and test surface loaded now. I’m checking a couple of branch-level behaviors against how these helpers are actually consumed, because the maintainability risks here look more like drift and untested boundary contracts than cosmetic structure issues.
exec
/bin/zsh -lc "sed -n '520,660p' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    iteration,
    signals,
    nodeSignals,
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
  };

  // Persist to database. CoverageSnapshot requires a concrete sessionId; the
  // Namespace may still carry undefined in bootstrap/debug contexts, so fall
  // back to a 'legacy' sentinel so pre-ADR-001 aggregations still persist
  // without violating the type.
  createSnapshot({
    specFolder: ns.specFolder,
    loopType: ns.loopType,
    sessionId: ns.sessionId ?? 'legacy',
    iteration,
    metrics: {
      ...signals,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
    },
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
  });

  return snapshot;
}

// ───────────────────────────────────────────────────────────────
// 6. MOMENTUM (DELTA BETWEEN SNAPSHOTS)
// ───────────────────────────────────────────────────────────────

/**
 * Compute momentum (change rate) between the latest and previous snapshots.
 */
export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
  const d = getDb();
  const snapshots = d.prepare(`
    SELECT metrics FROM coverage_snapshots
    WHERE spec_folder = ? AND loop_type = ?
    ORDER BY iteration DESC LIMIT 2
  `).all(specFolder, loopType) as Array<{ metrics: string }>;

  if (snapshots.length < 2) return null;

  const latest = JSON.parse(snapshots[0].metrics) as Record<string, number>;
  const previous = JSON.parse(snapshots[1].metrics) as Record<string, number>;

  const momentum: Record<string, number> = {};
  for (const key of Object.keys(latest)) {
    if (typeof latest[key] === 'number' && typeof previous[key] === 'number') {
      momentum[key] = latest[key] - previous[key];
    }
  }

  return momentum;
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  computeResearchContradictionDensityFromData,
  computeResearchEvidenceDepthFromData,
  computeResearchQuestionCoverageFromData,
  computeResearchSourceDiversityFromData,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-signals.js';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

type ResearchNode = {
  id: string;
  kind: 'QUESTION' | 'FINDING' | 'SOURCE';
  metadata?: Record<string, unknown>;
};

type ResearchEdge = {
  sourceId: string;
  targetId: string;
  relation: string;
};

type CjsGraph = {
  nodes: Map<string, Record<string, unknown>>;
  edges: Map<string, Record<string, unknown>>;
};

const convergenceModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
)) as {
  computeSourceDiversity: (graph: CjsGraph) => number;
  computeEvidenceDepth: (graph: CjsGraph) => number;
  computeQuestionCoverage: (graph: CjsGraph) => number;
  computeContradictionDensity: (graph: CjsGraph) => number;
  computeGraphConvergence: (graph: CjsGraph, signals?: { compositeStop?: number }) => {
    graphScore: number;
    blendedScore: number;
    components: {
      fragmentationScore: number;
      normalizedDepth: number;
      questionCoverage: number;
      contradictionDensity: number;
      evidenceDepth: number;
      sourceDiversity: number;
      compositeStop: number | null;
    };
  };
};

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function makeGraph(nodes: ResearchNode[], edges: ResearchEdge[]): CjsGraph {
  return {
    nodes: new Map(nodes.map((node) => [node.id, {
      id: node.id,
      kind: node.kind,
      type: node.kind.toLowerCase(),
      metadata: node.metadata ?? null,
    }])),
    edges: new Map(edges.map((edge, index) => [`edge-${index}`, {
      id: `edge-${index}`,
      source: edge.sourceId,
      target: edge.targetId,
      relation: edge.relation,
    }])),
  };
}

function computeIsolatedNodeCount(graph: CjsGraph): number {
  if (graph.nodes.size === 0) return 0;

  const undirected = new Map<string, Set<string>>();
  for (const nodeId of graph.nodes.keys()) {
    undirected.set(nodeId, new Set());
  }

  for (const edge of graph.edges.values()) {
    undirected.get(String(edge.source))?.add(String(edge.target));
    undirected.get(String(edge.target))?.add(String(edge.source));
  }

  let isolatedNodes = 0;
  const visited = new Set<string>();

  for (const nodeId of undirected.keys()) {
    if (visited.has(nodeId)) continue;

    const queue = [nodeId];
    visited.add(nodeId);
    let componentSize = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      componentSize++;

      for (const neighbor of undirected.get(current) ?? []) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }

    if (componentSize === 1) isolatedNodes++;
  }

  return isolatedNodes;
}

function computeTsEquivalentBlend(nodes: ResearchNode[], edges: ResearchEdge[], compositeStop: number) {
  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);
  const graph = makeGraph(nodes, edges);
  const fragmentationScore = nodes.length > 0
    ? 1 - (computeIsolatedNodeCount(graph) / nodes.length)
    : 0;
  const normalizedDepth = Math.min(evidenceDepth / 5, 1);
  const graphScore = (
    (fragmentationScore * 0.25) +
    (normalizedDepth * 0.25) +
    (questionCoverage * 0.30) +
    (sourceDiversity * 0.20)
  );

  return {
    graphScore: round3(graphScore),
    blendedScore: round3((compositeStop * 0.6) + (graphScore * 0.4)),
  };
}

describe('graph-convergence parity', () => {
  const cases: Array<{
    name: string;
    compositeStop: number;
    nodes: ResearchNode[];
    edges: ResearchEdge[];
    expected: {
      sourceDiversity: number;
      contradictionDensity: number;
      questionCoverage: number;
      evidenceDepth: number;
    };
  }> = [
    {
      name: 'empty graph',
      compositeStop: 0.2,
      nodes: [],
      edges: [],
      expected: {
        sourceDiversity: 0,
        contradictionDensity: 0,
        questionCoverage: 0,
        evidenceDepth: 0,
      },
    },
    {
      name: 'single-source graph',
      compositeStop: 0.55,
      nodes: [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
      ],
      edges: [
        { sourceId: 'f-1', targetId: 'q-1', relation: 'ANSWERS' },
        { sourceId: 'f-1', targetId: 's-1', relation: 'CITES' },
      ],
      expected: {
        sourceDiversity: 1,
        contradictionDensity: 0,
        questionCoverage: 0,
        evidenceDepth: 2,
      },
    },
    {
      name: 'multi-source graph with contradictions',
      compositeStop: 0.9,
      nodes: [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
        { id: 's-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
      ],
      edges: [
        { sourceId: 'f-1', targetId: 'q-1', relation: 'ANSWERS' },
        { sourceId: 'f-2', targetId: 'q-1', relation: 'ANSWERS' },
        { sourceId: 'f-1', targetId: 's-1', relation: 'CITES' },
        { sourceId: 'f-2', targetId: 's-2', relation: 'CITES' },
        { sourceId: 'f-1', targetId: 'f-2', relation: 'CONTRADICTS' },
      ],
      expected: {
        sourceDiversity: 2,
        contradictionDensity: 0.2,
        questionCoverage: 1,
        evidenceDepth: 2,
      },
    },
  ];

  for (const testCase of cases) {
    it(`keeps CJS parity with canonical TS research signals for ${testCase.name}`, () => {
      const graph = makeGraph(testCase.nodes, testCase.edges);

      const cjsSourceDiversity = convergenceModule.computeSourceDiversity(graph);
      const cjsContradictionDensity = convergenceModule.computeContradictionDensity(graph);
      const cjsQuestionCoverage = convergenceModule.computeQuestionCoverage(graph);
      const cjsEvidenceDepth = convergenceModule.computeEvidenceDepth(graph);
      const cjsConvergence = convergenceModule.computeGraphConvergence(graph, {
        compositeStop: testCase.compositeStop,
      });

      const tsSourceDiversity = computeResearchSourceDiversityFromData(testCase.nodes, testCase.edges);
      const tsContradictionDensity = computeResearchContradictionDensityFromData(testCase.edges);
      const tsQuestionCoverage = computeResearchQuestionCoverageFromData(testCase.nodes, testCase.edges);
      const tsEvidenceDepth = computeResearchEvidenceDepthFromData(testCase.nodes, testCase.edges);
      const tsEquivalentBlend = computeTsEquivalentBlend(
        testCase.nodes,
        testCase.edges,
        testCase.compositeStop,
      );

      expect(cjsSourceDiversity).toBe(testCase.expected.sourceDiversity);
      expect(tsSourceDiversity).toBe(testCase.expected.sourceDiversity);
      expect(cjsSourceDiversity).toBe(tsSourceDiversity);

      expect(cjsContradictionDensity).toBe(testCase.expected.contradictionDensity);
      expect(tsContradictionDensity).toBe(testCase.expected.contradictionDensity);
      expect(cjsContradictionDensity).toBe(tsContradictionDensity);

      expect(cjsQuestionCoverage).toBe(testCase.expected.questionCoverage);
      expect(tsQuestionCoverage).toBe(testCase.expected.questionCoverage);
      expect(cjsQuestionCoverage).toBe(tsQuestionCoverage);

      expect(cjsEvidenceDepth).toBe(testCase.expected.evidenceDepth);
      expect(tsEvidenceDepth).toBe(testCase.expected.evidenceDepth);
      expect(cjsEvidenceDepth).toBe(tsEvidenceDepth);

      expect(cjsConvergence.components.sourceDiversity).toBe(tsSourceDiversity);
      expect(cjsConvergence.components.contradictionDensity).toBe(tsContradictionDensity);
      expect(cjsConvergence.blendedScore).toBe(tsEquivalentBlend.blendedScore);
      expect(cjsConvergence.graphScore).toBe(tsEquivalentBlend.graphScore);
    });
  }
});

exec
/bin/zsh -lc "rg -n \"getNodes\\(|getEdges\\(|getEdgesFrom\\(|getEdgesTo\\(|computeDegree\\(|computeDepth\\(|computeAllDepths\\(|computeMomentum\\(|computeClusterMetrics\\(|evaluateGraphGates\\(|scanContradictions\\(|reportContradictions\\(|contradictionDensity\\(|traverseProvenance\\(\" .opencode/skill/system-spec-kit -g '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:283:  const nodes = getNodes(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:284:  const edges = getEdges(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:307:  const nodes = getNodes(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:308:  const edges = getEdges(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:320:  const nodes = getNodes(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:321:  const edges = getEdges(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:158:export function computeMomentum(db: Database.Database, memoryId: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:186:    const momentum = computeMomentum(db, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:81:  const nodes = getNodes(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:82:  const edges = getEdges(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:176:  const nodes = getNodes(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:177:  const edges = getEdges(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:555:export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:379:export function getNodes(ns: Namespace): CoverageNode[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:471:export function getEdges(ns: Namespace): CoverageEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:479:export function getEdgesFrom(ns: Namespace, sourceId: string): CoverageEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:489:export function getEdgesTo(ns: Namespace, targetId: string): CoverageEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:427:function getEdgesFrom(sourceId: string, limit: number = MAX_EDGES_LIMIT): EdgeQueryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:452:function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): EdgeQueryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:522:      ? getEdgesFrom(node.id, edgeLimit)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:523:      : getEdgesTo(node.id, edgeLimit);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:88:export function scanContradictions(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:440:  const contradictionPairs = scanContradictions(database);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:313:  const cluster = computeClusterMetrics(graph);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:369:function evaluateGraphGates(graph) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:85:function computeDegree(graph, nodeId, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:155:function computeDepth(graph, nodeId, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:204:function computeAllDepths(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:253: * Adapted from graph-signals.ts computeMomentum():
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:262:function computeMomentum(graph, nodeId, windowSize, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:301:function computeClusterMetrics(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:255:function traverseProvenance(graph, nodeId, maxDepth) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:311:function getNodes(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:320:function getEdges(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:329:function getEdgesFrom(graph, nodeId, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:345:function getEdgesTo(graph, nodeId, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:76:function scanContradictions(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:112:function reportContradictions(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:116:  const raw = scanContradictions(graph, sessionId);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:172:function contradictionDensity(graph, sessionId) {
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1601:Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:21:Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.

exec
/bin/zsh -lc "sed -n '250,360p' .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Signals
// ───────────────────────────────────────────────────────────────
// Server-side signal computation and snapshot generation for
// research and review convergence metrics.
// Follows graph-signals.ts patterns for degree, depth, and momentum.

import Database from 'better-sqlite3';
import {
  getDb,
  getNodes,
  getEdges,
  createSnapshot,
  getStats,
  type Namespace,
  type LoopType,
  type CoverageNode,
  type CoverageEdge,
} from './coverage-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface NodeSignal {
  nodeId: string;
  kind: string;
  degree: number;
  inDegree: number;
  outDegree: number;
  depth: number;
  weightSum: number;
}

export interface ResearchConvergenceSignals {
  questionCoverage: number;
  claimVerificationRate: number;
  contradictionDensity: number;
  sourceDiversity: number;
  evidenceDepth: number;
}

export interface ReviewConvergenceSignals {
  dimensionCoverage: number;
  findingStability: number;
  p0ResolutionRate: number;
  evidenceDensity: number;
  hotspotSaturation: number;
}

export type ConvergenceSignals = ResearchConvergenceSignals | ReviewConvergenceSignals;

export interface SignalSnapshot {
  iteration: number;
  signals: ConvergenceSignals;
  nodeSignals: NodeSignal[];
  nodeCount: number;
  edgeCount: number;
}

type ResearchSignalNodeLike = {
  id: string;
  kind: string;
  metadata?: CoverageNode['metadata'] | string | null;
};

type ResearchSignalEdgeLike = {
  sourceId: string;
  targetId: string;
  relation: string;
};

// ───────────────────────────────────────────────────────────────
// 2. NODE-LEVEL SIGNALS
// ───────────────────────────────────────────────────────────────

/**
 * Compute degree, depth, and weight signals for all nodes in a namespace.
 */
export function computeNodeSignals(ns: Namespace): NodeSignal[] {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  // Build adjacency maps
  const inDegreeMap = new Map<string, number>();
  const outDegreeMap = new Map<string, number>();
  const weightSumMap = new Map<string, number>();

  for (const edge of edges) {
    outDegreeMap.set(edge.sourceId, (outDegreeMap.get(edge.sourceId) ?? 0) + 1);
    inDegreeMap.set(edge.targetId, (inDegreeMap.get(edge.targetId) ?? 0) + 1);
    weightSumMap.set(edge.sourceId, (weightSumMap.get(edge.sourceId) ?? 0) + edge.weight);
    weightSumMap.set(edge.targetId, (weightSumMap.get(edge.targetId) ?? 0) + edge.weight);
  }

  // BFS depth from root nodes (nodes with no incoming edges)
  const depthMap = computeDepths(nodes, edges);

  return nodes.map(node => ({
    nodeId: node.id,
    kind: node.kind,
    degree: (inDegreeMap.get(node.id) ?? 0) + (outDegreeMap.get(node.id) ?? 0),
    inDegree: inDegreeMap.get(node.id) ?? 0,
    outDegree: outDegreeMap.get(node.id) ?? 0,
    depth: depthMap.get(node.id) ?? 0,
    weightSum: weightSumMap.get(node.id) ?? 0,
  }));
}

/**
 * Compute longest-path depth for each node from any root node.
 * Mirrors the in-memory CJS implementation so both layers report
 * the same structural depth for DAG-shaped coverage graphs.
 */
function computeDepths(nodes: CoverageNode[], edges: CoverageEdge[]): Map<string, number> {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    if (!adjacency.has(edge.sourceId)) adjacency.set(edge.sourceId, []);
    adjacency.get(edge.sourceId)!.push(edge.targetId);
    inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
    if (!inDegree.has(edge.sourceId)) inDegree.set(edge.sourceId, 0);
  }

  const depthMap = new Map<string, number>();
  const remaining = new Map(inDegree);
  const queue: string[] = [];

  for (const [id, degree] of remaining) {
    if (degree === 0) {
      depthMap.set(id, 0);
      queue.push(id);
    }
  }

  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const currentDepth = depthMap.get(current) ?? 0;

    for (const childId of adjacency.get(current) ?? []) {
      const candidateDepth = currentDepth + 1;
      if (candidateDepth > (depthMap.get(childId) ?? 0)) {
        depthMap.set(childId, candidateDepth);
      }

      const nextDegree = (remaining.get(childId) ?? 0) - 1;
      remaining.set(childId, nextDegree);
      if (nextDegree === 0) {
        queue.push(childId);
      }
    }
  }

  for (const node of nodes) {
    if (!depthMap.has(node.id)) depthMap.set(node.id, 0);
  }

  return depthMap;
}

// ───────────────────────────────────────────────────────────────
// 3. RESEARCH CONVERGENCE SIGNALS
// ───────────────────────────────────────────────────────────────

/**
 * Compute research convergence signals.
 */
export function computeResearchSignals(ns: Namespace): ResearchConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
  const claimVerificationRate = computeResearchClaimVerificationRateFromData(nodes);
  const contradictionDensity = computeResearchContradictionDensityFromData(edges);
  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);

  return {
    questionCoverage,
    claimVerificationRate,
    contradictionDensity,
    sourceDiversity,
    evidenceDepth,
  };
}

function parseNodeMetadata(metadata: CoverageNode['metadata'] | string | null | undefined): Record<string, unknown> | null {
  if (!metadata) return null;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata) as unknown;
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
  return typeof metadata === 'object' ? metadata as Record<string, unknown> : null;
}

function buildAnsweringFindingsByQuestion(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
  const answeringFindings = new Map<string, string[]>();

  for (const edge of edges) {
    if (edge.relation !== 'ANSWERS') continue;
    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
    answeringFindings.get(edge.targetId)!.push(edge.sourceId);
  }

  return answeringFindings;
}

function buildCitedSourcesByFinding(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
  const citedSources = new Map<string, string[]>();

 succeeded in 0ms:
      momentum,
      namespace: buildNamespacePayload(ns),
      scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
      notes: args.sessionId
        ? ['Convergence signals were computed from the session-scoped subgraph only.']
        : ['No sessionId provided; convergence falls back to specFolder + loopType aggregation across all sessions for bootstrap/debugging use.'],
      snapshotPersistence: args.persistSnapshot && !args.sessionId
        ? 'skipped_without_sessionId'
        : (args.persistSnapshot ? 'persisted' : 'not_requested'),
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      lastIteration: stats.lastIteration,
    });
  } catch (err: unknown) {
    return errorResponse(
      `Convergence assessment failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

function buildNamespacePayload(ns: Namespace): Record<string, unknown> {
  return {
    specFolder: ns.specFolder,
    loopType: ns.loopType,
    ...(ns.sessionId ? { sessionId: ns.sessionId } : {}),
  };
}

function parseMetadata(metadata: CoverageNode['metadata']): Record<string, unknown> {
  return metadata && typeof metadata === 'object' ? metadata : {};
}

export function computeScopedStats(ns: Namespace): ScopedCoverageStats {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);
  const snapshots = getSnapshots(ns.specFolder, ns.loopType, ns.sessionId);

  const nodesByKind: Record<string, number> = {};
  for (const node of nodes) {
    nodesByKind[node.kind] = (nodesByKind[node.kind] ?? 0) + 1;
  }

  const edgesByRelation: Record<string, number> = {};
  for (const edge of edges) {
    edgesByRelation[edge.relation] = (edgesByRelation[edge.relation] ?? 0) + 1;
  }

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodesByKind,
    edgesByRelation,
    lastIteration: snapshots.length > 0 ? snapshots[snapshots.length - 1].iteration : null,
  };
}

function computeScopedResearchSignals(ns: Namespace): ResearchConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  return {
    questionCoverage: computeResearchQuestionCoverageFromData(nodes, edges),
    claimVerificationRate: computeResearchClaimVerificationRateFromData(nodes),
    contradictionDensity: computeResearchContradictionDensityFromData(edges),
    sourceDiversity: computeResearchSourceDiversityFromData(nodes, edges),
    evidenceDepth: computeResearchEvidenceDepthFromData(nodes, edges),
  };
}

function computeScopedReviewSignals(ns: Namespace): ReviewConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  const dimensionIds = new Set(nodes.filter(node => node.kind === 'DIMENSION').map(node => node.id));
  const findingNodes = nodes.filter(node => node.kind === 'FINDING');
  const fileNodes = nodes.filter(node => node.kind === 'FILE');

  const coversEdges = edges.filter(edge => edge.relation === 'COVERS');
  const contradictionEdges = edges.filter(edge => edge.relation === 'CONTRADICTS');
  const evidenceEdges = edges.filter(edge => edge.relation === 'EVIDENCE_FOR');
  const resolvesTargetIds = new Set(
    edges.filter(edge => edge.relation === 'RESOLVES').map(edge => edge.targetId),
  );

  const coveredDimensionIds = new Set(
    coversEdges.map(edge => edge.sourceId).filter(sourceId => dimensionIds.has(sourceId)),
  );

  const contradictionNodeIds = new Set<string>();
  for (const edge of contradictionEdges) {
    contradictionNodeIds.add(edge.sourceId);
    contradictionNodeIds.add(edge.targetId);
  }

  const p0Findings = findingNodes.filter(node => parseMetadata(node.metadata).severity === 'P0');

  const hotspotFiles = fileNodes.filter(node => {
    const hotspotScore = parseMetadata(node.metadata).hotspot_score;
    return typeof hotspotScore === 'number' && hotspotScore > 0;
  });

  let saturatedHotspots = 0;
  for (const file of hotspotFiles) {
    const coveringDimensions = new Set(
      coversEdges
        .filter(edge => edge.targetId === file.id)
        .map(edge => edge.sourceId)
        .filter(sourceId => dimensionIds.has(sourceId)),
    );
    if (coveringDimensions.size >= 2) saturatedHotspots++;
  }

exec
/bin/zsh -lc "rg -n \"resetEdgeIdCounter|__testables|buildAdjacencyList\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1349:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1501:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:514: * Internal helpers exported for testing via __testables.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:516:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts:9:import { __testables } from '../lib/search/cross-encoder';
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts:19:} = __testables;
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:23:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:31:const { tokenize, keywordOverlap, MAX_SURROGATE_QUESTIONS, MIN_SURROGATE_QUESTIONS, MAX_SUMMARY_LENGTH, MIN_MATCH_THRESHOLD } = __testables;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:11:  Parameters<typeof handler.__testables.collapseAndReassembleChunkResults>[0][number];
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:327:   collapseAndReassembleChunkResults is exported via __testables.
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:331:  const { collapseAndReassembleChunkResults } = handler.__testables;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:404:  it('T002-7: collapseAndReassembleChunkResults is exported via __testables', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:17:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:725:// 9. __testables.deduplicateEntities (internal helper)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:728:describe('__testables.deduplicateEntities', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:735:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:744:    const result = __testables.deduplicateEntities([]);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:754:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:764:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:24:import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:135:    const { __testables } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:142:    const adjusted = __testables.applyFeedbackSignals(
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:143:      results as Parameters<typeof __testables.applyFeedbackSignals>[0],
.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:69:| `file-watcher.ts` | `startFileWatcher()`, `WatcherConfig`, `FSWatcher`, `__testables` |
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:484:    const prepared = memorySearch.__testables.collapseAndReassembleChunkResults([
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:470: * Defines the __testables constant.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:472:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:409:        hybridSearch.__testables.canonicalResultId(r.id as number | string)
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:614:      const canonicalIds = results.map((r) => hybridSearch.__testables.canonicalResultId(r.id));
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1024:  const { mergeRawCandidate } = hybridSearch.__testables;
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:502:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:26:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:184:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:189:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:219:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:339:    __testables.registerGlobalRefreshFn(() => {});
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:368:    __testables.registerGlobalRefreshFn(() => { called.push(Date.now()); });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:385:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:391:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:578:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:584:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:638:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:645:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:730:    __testables.registerLlmBackfillFn((id) => { backfilledIds.push(id); });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:742:    __testables.registerLlmBackfillFn((id) => { backfilledIds.push(id); });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:760:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:766:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:796:    __testables.registerGlobalRefreshFn(() => { log.push('global-refresh'); });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:815:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:822:    __testables.clearDirtyNodes();
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:781:  return results.map((result) => hybridSearch.__testables.canonicalResultId(result.id));
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:9:// We test the internal helpers via __testables and mock external deps
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:13:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:301:    const merged = __testables.mergeResults(
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:311:    const healthy = __testables.checkDegradation([
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:318:    const weak = __testables.checkDegradation([
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:341:    const calibrated = __testables.calibrateTier3Scores(existing, structural);
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:365:    const limited = __testables.applyResultLimit(rows, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:8:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:12:const { MIN_FRAGMENT_TOKEN_COUNT, MIN_QUERY_LENGTH_FOR_DECOMPOSITION } = __testables;
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:5:import { __testables } from '../lib/search/pipeline/stage1-candidate-gen';
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:27:    expect(__testables.decomposeQueryFacets('graph pruning')).toEqual(['graph pruning']);
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:32:      __testables.decomposeQueryFacets(
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:40:      __testables.decomposeQueryFacets(
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:47:    const facets = __testables.decomposeQueryFacets(
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:51:    expect(facets).toHaveLength(__testables.MAX_QUERY_DECOMPOSITION_FACETS);
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:56:    const merged = __testables.mergeByFacetCoverage([
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:72:    const pool = __testables.buildQueryDecompositionPool(
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:83:    const pool = __testables.buildQueryDecompositionPool(
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:94:    const pool = __testables.buildQueryDecompositionPool(
.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:7:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:10:const { BUILTIN_CONCEPT_ALIASES, MIN_NOUN_PHRASE_TOKEN_LENGTH, MAX_CONCEPTS_PER_QUERY } = __testables;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2452:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:8:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:165:    expect(__testables.isDotfilePath('/workspace/.opencode/specs/001-test/spec.md')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:169:    expect(__testables.isDotfilePath('/workspace/specs/001-test/.DS_Store')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:170:    expect(__testables.isDotfilePath('/workspace/specs/001-test/.git/config')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:174:    expect(__testables.shouldIgnoreWatchTarget('/workspace/.opencode/specs')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:175:    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:176:    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs/001-test/spec.txt')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:182:    const scopedPath = __testables.getWatchScopedPath(filePath, [watchRoot]);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:185:    expect(__testables.shouldIgnoreWatchTarget(scopedPath ?? filePath)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:189:    expect(__testables.isMarkdownPath('/workspace/specs/001-test/spec.md')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:190:    expect(__testables.isMarkdownPath('/workspace/specs/001-test/spec.txt')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:14:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:111:  expect(__testables.momentumCache.size).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:112:  expect(__testables.depthCache.size).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:116:  expect(__testables.momentumCache.size).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:117:  expect(__testables.depthCache.size).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:648:      expect(__testables.momentumCache.size).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:649:      expect(__testables.depthCache.size).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:653:      expect(__testables.momentumCache.size).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:654:      expect(__testables.depthCache.size).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:687:      expect(__testables.momentumCache.size).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:688:      expect(__testables.depthCache.size).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:915:      const degree = __testables.getCurrentDegree(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:952:  // 9. __testables internal helpers
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:953:  describe('__testables internal helpers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:959:      expect(__testables.getCurrentDegree(db, 1)).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:960:      expect(__testables.getCurrentDegree(db, 2)).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:961:      expect(__testables.getCurrentDegree(db, 4)).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:962:      expect(__testables.getCurrentDegree(db, 999)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:971:      expect(__testables.getPastDegree(db, 1)).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:977:      expect(__testables.getPastDegree(db, 1)).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:980:    it('buildAdjacencyList constructs correct graph structure', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:985:      const { adjacency, allNodes, inDegree } = __testables.buildAdjacencyList(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1005:      const { adjacency } = __testables.buildAdjacencyList(db);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1006:      const undirected = __testables.buildUndirectedAdjacency(adjacency);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1018:      const scores = __testables.computeGraphWalkScores(db, [10, 20, 30]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1029:      const scores = __testables.computeGraphWalkScores(db, [2]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1035:      expect(__testables.clamp(0.5, 0, 1)).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1036:      expect(__testables.clamp(-1, 0, 1)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1037:      expect(__testables.clamp(2, 0, 1)).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1038:      expect(__testables.clamp(0.03, 0, 0.05)).toBe(0.03);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1039:      expect(__testables.clamp(0.1, 0, 0.05)).toBe(0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:1040:      expect(__testables.clamp(-0.5, 0, 0.05)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:446:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:3:import { __testables, truncateToBudget, estimateResultTokens } from '../lib/search/hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:5:type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:6:type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:30:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:53:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:99:    const injected = truncated.results.map((row) => __testables.injectContextualTree(row, cache));
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:135:    const injected = truncated.results.map((row) => __testables.injectContextualTree(row, cache));
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:156:    const injected = __testables.injectContextualTree(row, emptyCache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:180:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:200:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:35:  resetEdgeIdCounter: () => void;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:113:    coreModule.resetEdgeIdCounter();
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:6:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:132:    const merged = __testables.mergeSmallCommunities(groups, adjacency);
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:187:    const communities = __testables.buildCommunitiesFromAssignments(db, communityAssignments);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:649:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:3:import { __testables } from '../handlers/memory-search';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:14:} = __testables;
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:238:export const __testables = {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:112: * Adapted from graph-signals.ts buildAdjacencyList().
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:117:function buildAdjacencyList(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:160:  const { adjacency, inDegree } = buildAdjacencyList(graph, sessionId);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:206:  const { adjacency, inDegree } = buildAdjacencyList(graph, sessionId);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:376:  __testables: {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:377:    buildAdjacencyList,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:104:import { handleMemorySearch, __testables } from '../handlers/memory-search';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:139:    const payloads = __testables.buildEvalChannelPayloads([
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:54:  resetEdgeIdCounter: () => void;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:134:    coreModule.resetEdgeIdCounter();
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:535:export const __testables = {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:357:function resetEdgeIdCounter() {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:388:  resetEdgeIdCounter,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:290:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:10:  __testables as tfidfTestables,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:17:  __testables as summaryTestables,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:582:   7. Cosine Similarity (via __testables)
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:16:  resetEdgeIdCounter: () => void;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:32:    coreModule.resetEdgeIdCounter();
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:30:  resetEdgeIdCounter: () => void;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:104:    coreModule.resetEdgeIdCounter();
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:25:  resetEdgeIdCounter: () => void;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts:30:    coreModule.resetEdgeIdCounter();
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:1146:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:15:  __testables,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:302:      const matches = __testables.findCrossDocumentMatchesForMemory(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:322:      const matches = __testables.findCrossDocumentMatchesForMemory(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:497:      const { MAX_EDGES_PER_NODE } = __testables;
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:866:  describe('__testables', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:868:      expect(__testables.MAX_EDGES_PER_NODE).toBe(20);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:872:      expect(typeof __testables.normalizeEntityName).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:873:      expect(__testables.normalizeEntityName('TEST')).toBe('test');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:877:      expect(typeof __testables.sanitizeDensityThreshold).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:878:      expect(typeof __testables.getEntityLinkingDensityThreshold).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:879:      expect(typeof __testables.getGlobalEdgeDensityStats).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:883:      expect(typeof __testables.getEdgeCount).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:886:      const count = __testables.getEdgeCount(db, '1');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:891:      expect(__testables.getEdgeCount(db, '1')).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:892:      expect(__testables.getEdgeCount(db, '2')).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:896:      expect(typeof __testables.getSpecFolder).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:899:      expect(__testables.getSpecFolder(db, 999)).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:903:      expect(__testables.getSpecFolder(db, 1)).toBe('specs/001-test');
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:244:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:7:import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts:11:import { __testables as stage1Testables } from '../lib/search/pipeline/stage1-candidate-gen.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:573:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:382:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:39:import { __testables } from '../lib/search/pipeline/stage3-rerank';
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:70:    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:93:    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:116:    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:4:import { __testables } from '../lib/search/local-reranker';
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:10:    expect(__testables.extractNumericScore({ score: 0.75 })).toBe(0.75);
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:11:    expect(__testables.extractNumericScore({ relevance: '0.5' })).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:15:    expect(__testables.extractNumericScore([0.1, 0.2, 0.3])).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:16:    expect(__testables.extractNumericScore({ embedding: [0.1, 0.2, 0.3] })).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:22:    const score = await __testables.scorePrompt({
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:31:    await expect(__testables.scorePrompt({
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:53:      await __testables.scorePrompt(mockContext, `query: test query\ndocument: candidate document ${i}`);
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:293:    // __testables.resolveRowText works for all candidates and that the source code
.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:304:    expect(mod.__testables.resolveModelPath).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1443:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:715:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1173:      const testables = (module as { __testables?: { main?: () => Promise<void> } }).__testables
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1207:        testables: (module as { __testables?: RuntimeHarness['testables'] }).__testables,
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:359:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:435:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:31:import { __testables as stage4Testables } from '../lib/search/pipeline/stage4-filter';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:587:// -- Exported internal functions (also exposed via __testables) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1386:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:362:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:54:function buildAdjacencyList(db: Database.Database): WeightedAdjacencyList {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:380:  const adjacency = buildAdjacencyList(db);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:421:  const adjacency = buildLegacyAdjacency(buildAdjacencyList(db));
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:549:    const adjacency = buildAdjacencyList(db);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:705:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:706:  buildAdjacencyList,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:202:function buildAdjacencyList(db: Database.Database): { adjacency: Map<number, number[]>; allNodes: Set<number>; inDegree: Map<number, number> } {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:232:    console.warn(`[graph-signals] buildAdjacencyList failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:273:  const { adjacency } = buildAdjacencyList(db);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:504:    const { adjacency, allNodes } = buildAdjacencyList(db);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:634:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:637:  buildAdjacencyList,
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:209:export const __testables = {

exec
/bin/zsh -lc "rg -n \"computeMomentum\\(|evaluateGraphGates\\(|scanContradictions\\(|reportContradictions\\(|contradictionDensity\\(\" .opencode/skill/system-spec-kit/scripts -g '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:369:function evaluateGraphGates(graph) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:253: * Adapted from graph-signals.ts computeMomentum():
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:262:function computeMomentum(graph, nodeId, windowSize, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:76:function scanContradictions(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:112:function reportContradictions(graph, sessionId) {
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:116:  const raw = scanContradictions(graph, sessionId);
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:172:function contradictionDensity(graph, sessionId) {

exec
/bin/zsh -lc "rg -n \"coverage-graph-core\\.cjs|coverage-graph-signals\\.cjs|coverage-graph-convergence\\.cjs|coverage-graph-contradictions\\.cjs\" .opencode/skill/system-spec-kit -g '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:13:const { computeClusterMetrics } = require('./coverage-graph-signals.cjs');

codex
I’ve narrowed the likely issues to a few concrete contract risks rather than broad style concerns. I’m doing one last pass on actual consumers and test execution now, mainly to distinguish “untested but unused” from “untested and easy to regress.”
exec
/bin/zsh -lc "rg -n '\"test\"|vitest' package.json .opencode/skill/system-spec-kit/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/package.json:20:    "test": "npm run --workspaces=false test:root",
.opencode/skill/system-spec-kit/package.json:24:    "test:task-enrichment": "node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts",

exec
/bin/zsh -lc 'git diff --no-ext-diff --stat' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
 .../review/deep-review-state.jsonl                                    | 1 +
 .../042-sk-deep-research-review-improvement-2/review/dispatch-log.txt | 4 ++++
 2 files changed, 5 insertions(+)

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "name": "system-spec-kit",
  "version": "1.7.2",
  "private": true,
  "description": "Unified workspace for Semantic Memory MCP server and CLI tools",
  "workspaces": [
    "shared",
    "mcp_server",
    "scripts"
  ],
  "engines": {
    "node": ">=20.11.0"
  },
  "scripts": {
    "start": "npm run start --workspace=@spec-kit/mcp-server",
    "build": "tsc --build",
    "typecheck": "npm run --workspaces=false typecheck:root",
    "typecheck:root": "tsc -p shared/tsconfig.json && tsc --noEmit --composite false -p mcp_server/tsconfig.json && tsc --noEmit --composite false -p scripts/tsconfig.json",
    "build:watch": "tsc --build --watch",
    "test": "npm run --workspaces=false test:root",
    "test:root": "node scripts/dist/memory/generate-context.js --help && echo 'CLI smoke test passed' && node scripts/tests/test-embeddings-factory.js && npm run test --workspace=@spec-kit/mcp-server && npm run test --workspace=@spec-kit/scripts",
    "test:mcp": "npm run test --workspace=@spec-kit/mcp-server",
    "test:cli": "node scripts/dist/memory/generate-context.js --help && echo 'CLI smoke test passed'",
    "test:task-enrichment": "node mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts",
    "test:embeddings": "node scripts/tests/test-embeddings-factory.js",
    "postinstall": "node scripts/setup/record-node-version.js"
  },
  "overrides": {
    "hono": "^4.12.12",
    "@hono/node-server": "^1.19.13",
    "vite": "^8.0.5",
    "picomatch": "^4.0.4",
    "path-to-regexp": "^8.4.0",
    "@modelcontextprotocol/sdk": {
      "hono": "^4.12.12",
      "@hono/node-server": "^1.19.13"
    },
    "onnxruntime-node": {
      "tar": "^7.5.8"
    }
  },
  "devDependencies": {
    "@huggingface/transformers": "^3.8.1",
    "@types/better-sqlite3": "^7.6.13",
    "@types/node": "^25.2.1",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "onnxruntime-common": "^1.21.0"
  }
}

exec
/bin/zsh -lc 'node .opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/coverage-graph-core.vitest.ts scripts/tests/coverage-graph-signals.vitest.ts scripts/tests/coverage-graph-convergence.vitest.ts scripts/tests/coverage-graph-integration.vitest.ts scripts/tests/coverage-graph-cross-layer.vitest.ts scripts/tests/coverage-graph-stress.vitest.ts --root .opencode/skill/system-spec-kit --config mcp_server/vitest.config.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
2026-04-12T09:51:08.417868Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc 'node .opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/coverage-graph-core.vitest.ts scripts/tests/coverage-graph-signals.vitest.ts scripts/tests/coverage-graph-convergence.vitest.ts scripts/tests/coverage-graph-integration.vitest.ts scripts/tests/coverage-graph-cross-layer.vitest.ts scripts/tests/coverage-graph-stress.vitest.ts --root .opencode/skill/system-spec-kit --config mcp_server/vitest.config.ts'`: SandboxDenied { message: "failed to load config from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts\n\n⎯⎯⎯⎯⎯⎯⎯ Startup Error ⎯⎯⎯⎯⎯⎯⎯⎯\nError: EPERM: operation not permitted, open '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'\n    at async open (node:internal/fs/promises:636:25)\n    at async Object.writeFile (node:internal/fs/promises:1239:14)\n    at async loadConfigFromBundledFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34665:3)\n    at async bundleAndLoadConfigFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34528:17)\n    at async loadConfigFromFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34495:42)\n    at async resolveConfig (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34119:22)\n    at async _createServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:25993:65)\n    at async createViteServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:8820:17)\n    at async createVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14161:18)\n    at async prepareVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14528:14) {\n  errno: -1,\n  code: 'EPERM',\n  syscall: 'open',\n  path: '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'\n}\n\n\n\n", output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: "", truncated_after_lines: None }, stderr: StreamOutput { text: "failed to load config from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts\n\n⎯⎯⎯⎯⎯⎯⎯ Startup Error ⎯⎯⎯⎯⎯⎯⎯⎯\nError: EPERM: operation not permitted, open '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'\n    at async open (node:internal/fs/promises:636:25)\n    at async Object.writeFile (node:internal/fs/promises:1239:14)\n    at async loadConfigFromBundledFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34665:3)\n    at async bundleAndLoadConfigFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34528:17)\n    at async loadConfigFromFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34495:42)\n    at async resolveConfig (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34119:22)\n    at async _createServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:25993:65)\n    at async createViteServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:8820:17)\n    at async createVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14161:18)\n    at async prepareVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14528:14) {\n  errno: -1,\n  code: 'EPERM',\n  syscall: 'open',\n  path: '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'\n}\n\n\n\n", truncated_after_lines: None }, aggregated_output: StreamOutput { text: "failed to load config from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts\n\n⎯⎯⎯⎯⎯⎯⎯ Startup Error ⎯⎯⎯⎯⎯⎯⎯⎯\nError: EPERM: operation not permitted, open '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'\n    at async open (node:internal/fs/promises:636:25)\n    at async Object.writeFile (node:internal/fs/promises:1239:14)\n    at async loadConfigFromBundledFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34665:3)\n    at async bundleAndLoadConfigFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34528:17)\n    at async loadConfigFromFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34495:42)\n    at async resolveConfig (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34119:22)\n    at async _createServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:25993:65)\n    at async createViteServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:8820:17)\n    at async createVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14161:18)\n    at async prepareVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14528:14) {\n  errno: -1,\n  code: 'EPERM',\n  syscall: 'open',\n  path: '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'\n}\n\n\n\n", truncated_after_lines: None }, duration: 0ns, timed_out: false } }
 exited 1 in 136ms:
failed to load config from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts

⎯⎯⎯⎯⎯⎯⎯ Startup Error ⎯⎯⎯⎯⎯⎯⎯⎯
Error: EPERM: operation not permitted, open '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'
    at async open (node:internal/fs/promises:636:25)
    at async Object.writeFile (node:internal/fs/promises:1239:14)
    at async loadConfigFromBundledFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34665:3)
    at async bundleAndLoadConfigFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34528:17)
    at async loadConfigFromFile (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34495:42)
    at async resolveConfig (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:34119:22)
    at async _createServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:25993:65)
    at async createViteServer (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:8820:17)
    at async createVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14161:18)
    at async prepareVitest (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/vitest/dist/chunks/cli-api.Bxr1Nn49.js:14528:14) {
  errno: -1,
  code: 'EPERM',
  syscall: 'open',
  path: '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/node_modules/.vite-temp/vitest.config.ts.timestamp-1775987468411-de2428259a7bb.mjs'
}




exec
/bin/zsh -lc "sed -n '460,520p' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "sessionId|session_id|session" .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '360,460p' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/** Get an edge by ID inside a namespace. */
export function getEdge(ns: Namespace, id: string): CoverageEdge | null {
  if (!ns.sessionId) return null;
  const d = getDb();
  const row = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
  return row ? rowToEdge(row) : null;
}

/** Get all edges in a namespace */
export function getEdges(ns: Namespace): CoverageEdge[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Get edges from a source node inside a namespace. */
export function getEdgesFrom(ns: Namespace, sourceId: string): CoverageEdge[] {
  if (!ns.sessionId) return [];
  const d = getDb();
  const rows = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND source_id = ?',
  ).all(ns.specFolder, ns.loopType, ns.sessionId, sourceId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Get edges to a target node inside a namespace. */
export function getEdgesTo(ns: Namespace, targetId: string): CoverageEdge[] {
  if (!ns.sessionId) return [];
  const d = getDb();
  const rows = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND target_id = ?',
  ).all(ns.specFolder, ns.loopType, ns.sessionId, targetId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/** Update an edge's weight and/or metadata inside a namespace. */
export function updateEdge(
  ns: Namespace,
  id: string,
  updates: { weight?: number; metadata?: Record<string, unknown> },
): boolean {
  if (!ns.sessionId) return false;
  const d = getDb();
  const existing = d.prepare(
    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
  if (!existing) return false;

  const weight = updates.weight !== undefined ? clampWeight(updates.weight) : existing.weight as number;
  const metadataStr = updates.metadata ? JSON.stringify(updates.metadata) : existing.metadata as string | null;

  d.prepare(
    'UPDATE coverage_edges SET weight = ?, metadata = ? WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).run(weight, metadataStr, ns.specFolder, ns.loopType, ns.sessionId, id);
  return true;
}

/** Delete an edge by ID inside a namespace. */

 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:100:function makeResearchNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:105:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:112:function makeReviewNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:117:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:161:    upsertNode(makeResearchNode('spec-clamp', 'session-clamp', 'finding-clamp', 'FINDING', 'Clamp finding'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:162:    upsertNode(makeResearchNode('spec-clamp', 'session-clamp', 'question-clamp', 'QUESTION', 'Clamp question'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:168:      sessionId: 'session-clamp',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:177:      { specFolder: 'spec-clamp', loopType: 'research', sessionId: 'session-clamp' },
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:187:      sessionId: 'session-empty',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:219:    upsertNode(makeResearchNode('spec-loop', 'session-loop', 'loop-node', 'SOURCE', 'Loop source'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:224:      sessionId: 'session-loop',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:234:    expect(getEdges({ specFolder: 'spec-loop', loopType: 'research', sessionId: 'session-loop' })).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:239:    const sessionId = 'session-signals';
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:240:    const ns: Namespace = { specFolder, loopType: 'research', sessionId };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:258:      makeResearchNode(specFolder, sessionId, 'question-1', 'QUESTION', 'Question 1'),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:259:      makeResearchNode(specFolder, sessionId, 'finding-1', 'FINDING', 'Finding 1'),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:260:      makeResearchNode(specFolder, sessionId, 'finding-2', 'FINDING', 'Finding 2'),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:261:      makeResearchNode(specFolder, sessionId, 'source-1', 'SOURCE', 'Source 1', { quality_class: 'primary' }),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:262:      makeResearchNode(specFolder, sessionId, 'source-2', 'SOURCE', 'Source 2', { quality_class: 'secondary' }),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:270:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:280:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:290:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:300:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:310:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:353:    const sessionId = 'session-isolation';
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:354:    const researchNs: Namespace = { specFolder, loopType: 'research', sessionId };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:355:    const reviewNs: Namespace = { specFolder, loopType: 'review', sessionId };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:357:    upsertNode(makeResearchNode(specFolder, sessionId, 'research-question', 'QUESTION', 'Research question'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:358:    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-a', 'FINDING', 'Research finding A'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:359:    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-b', 'FINDING', 'Research finding B'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:364:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:371:    upsertNode(makeReviewNode(specFolder, sessionId, 'review-dimension', 'DIMENSION', 'Correctness'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:372:    upsertNode(makeReviewNode(specFolder, sessionId, 'review-file', 'FILE', 'coverage-graph.ts', { hotspot_score: 2 }));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:373:    upsertNode(makeReviewNode(specFolder, sessionId, 'review-finding', 'FINDING', 'Review finding'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:378:      sessionId,

 succeeded in 0ms:
  `).run(
    node.specFolder, node.loopType, node.sessionId, node.id,
    node.kind, node.name, node.contentHash ?? null,
    node.iteration ?? null, metadataStr, now, now,
  );
  return node.id;
}

/** Get a node by ID inside a namespace. */
export function getNode(ns: Namespace, id: string): CoverageNode | null {
  if (!ns.sessionId) return null;
  const d = getDb();
  const row = d.prepare(
    'SELECT * FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
  return row ? rowToNode(row) : null;
}

/** Get all nodes in a namespace */
export function getNodes(ns: Namespace): CoverageNode[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

/** Get nodes of a specific kind in a namespace */
export function getNodesByKind(ns: Namespace, kind: NodeKind): CoverageNode[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause} AND kind = ?`).all(...params, kind) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

/** Delete a node and its connected edges inside a namespace. */
export function deleteNode(ns: Namespace, id: string): boolean {
  if (!ns.sessionId) return false;
  const d = getDb();
  const tx = d.transaction(() => {
    d.prepare(
      'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND (source_id = ? OR target_id = ?)',
    ).run(ns.specFolder, ns.loopType, ns.sessionId, id, id);
    const result = d.prepare(
      'DELETE FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
    ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
    return result.changes > 0;
  });
  return tx();
}

// ───────────────────────────────────────────────────────────────
// 7. EDGE OPERATIONS
// ───────────────────────────────────────────────────────────────

/**
 * Insert or update an edge scoped to `(specFolder, loopType, sessionId, id)`.
 * Rejects self-loops and clamps weights. Returns the edge ID or null if
 * rejected. Namespace scoping is load-bearing: two sessions that both emit
 * an edge with the same logical id get independent rows (REQ-028).
 */
export function upsertEdge(edge: CoverageEdge): string | null {
  // Self-loop rejection
  if (edge.sourceId === edge.targetId) {
    return null;
  }

  const d = getDb();
  const weight = clampWeight(edge.weight);
  const now = new Date().toISOString();
  const metadataStr = edge.metadata ? JSON.stringify(edge.metadata) : null;

  const existing = d.prepare(
    'SELECT id FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
  ).get(edge.specFolder, edge.loopType, edge.sessionId, edge.id) as { id: string } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE coverage_edges SET
        relation = ?, weight = ?, metadata = ?
      WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?
    `).run(
      edge.relation, weight, metadataStr,
      edge.specFolder, edge.loopType, edge.sessionId, edge.id,
    );
    return edge.id;
  }

  d.prepare(`
    INSERT INTO coverage_edges (
      spec_folder, loop_type, session_id, id, source_id, target_id,
      relation, weight, metadata, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    edge.specFolder, edge.loopType, edge.sessionId, edge.id,
    edge.sourceId, edge.targetId,
    edge.relation, weight, metadataStr, now,
  );
  return edge.id;
}

/** Get an edge by ID inside a namespace. */

exec
/bin/zsh -lc "rg -n \"contradictionDensity|reportContradictions|scanContradictions|computeMomentum\\(|sessionId\" .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-*.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:125:      const momentum = signalsModule.computeMomentum(graph, 'a', 600000);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:132:      const momentum = signalsModule.computeMomentum(graph, 'stale', 300000);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:140:      const momentum = signalsModule.computeMomentum(graph, 'target', 600000);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:63:  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:64:  reportContradictions: (graph: any) => { total: number; pairs: Array<object>; byNode: Map<string, object[]> };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:420:    it('scanContradictions uses CONTRADICTS relation from both weight maps', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:425:    it('scanContradictions returns structured pairs', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:429:      const contradictions = contradictionsModule.scanContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:436:    it('reportContradictions includes total and pairs', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:441:      const report = contradictionsModule.reportContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:56:  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:57:  reportContradictions: (graph: any) => { total: number; pairs: Array<object>; byNode: Map<string, object[]> };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:242:      const contradictions = contradictionsModule.scanContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:249:    it('reportContradictions handles large contradiction sets', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:263:      const report = contradictionsModule.reportContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:276:      const contradictions = contradictionsModule.scanContradictions(graph);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:69:  scanContradictions: (graph: CjsGraph) => Array<{ edgeId: string; source: string; target: string }>;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:70:  reportContradictions: (graph: CjsGraph) => { total: number; pairs: unknown[]; byNode: Map<string, unknown[]> };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:71:  contradictionDensity: (graph: CjsGraph) => number;
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:100:function makeResearchNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:105:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:112:function makeReviewNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:117:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:168:      sessionId: 'session-clamp',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:177:      { specFolder: 'spec-clamp', loopType: 'research', sessionId: 'session-clamp' },
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:187:      sessionId: 'session-empty',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:191:    expect(cjsContradictionsModule.scanContradictions(graph)).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:192:    expect(cjsContradictionsModule.reportContradictions(graph).total).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:193:    expect(cjsContradictionsModule.contradictionDensity(graph)).toBe(0);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:209:      contradictionDensity: 0,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:224:      sessionId: 'session-loop',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:234:    expect(getEdges({ specFolder: 'spec-loop', loopType: 'research', sessionId: 'session-loop' })).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:239:    const sessionId = 'session-signals';
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:240:    const ns: Namespace = { specFolder, loopType: 'research', sessionId };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:258:      makeResearchNode(specFolder, sessionId, 'question-1', 'QUESTION', 'Question 1'),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:259:      makeResearchNode(specFolder, sessionId, 'finding-1', 'FINDING', 'Finding 1'),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:260:      makeResearchNode(specFolder, sessionId, 'finding-2', 'FINDING', 'Finding 2'),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:261:      makeResearchNode(specFolder, sessionId, 'source-1', 'SOURCE', 'Source 1', { quality_class: 'primary' }),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:262:      makeResearchNode(specFolder, sessionId, 'source-2', 'SOURCE', 'Source 2', { quality_class: 'secondary' }),
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:270:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:280:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:290:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:300:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:310:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:341:    const cjsContradictions = cjsContradictionsModule.scanContradictions(graph)
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:353:    const sessionId = 'session-isolation';
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:354:    const researchNs: Namespace = { specFolder, loopType: 'research', sessionId };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:355:    const reviewNs: Namespace = { specFolder, loopType: 'review', sessionId };
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:357:    upsertNode(makeResearchNode(specFolder, sessionId, 'research-question', 'QUESTION', 'Research question'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:358:    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-a', 'FINDING', 'Research finding A'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:359:    upsertNode(makeResearchNode(specFolder, sessionId, 'research-finding-b', 'FINDING', 'Research finding B'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:364:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:371:    upsertNode(makeReviewNode(specFolder, sessionId, 'review-dimension', 'DIMENSION', 'Correctness'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:372:    upsertNode(makeReviewNode(specFolder, sessionId, 'review-file', 'FILE', 'coverage-graph.ts', { hotspot_score: 2 }));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:373:    upsertNode(makeReviewNode(specFolder, sessionId, 'review-finding', 'FINDING', 'Review finding'));
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:378:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:413:    expect(computeResearchSignals(researchNs).contradictionDensity).toBe(1);

exec
/bin/zsh -lc "rg -n \"computeDepth\\(|computeAllDepths\\(\" .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
68:      expect(signalsModule.computeDepth(graph, 'a')).toBe(0);
69:      expect(signalsModule.computeDepth(graph, 'b')).toBe(1);
70:      expect(signalsModule.computeDepth(graph, 'c')).toBe(2);
71:      expect(signalsModule.computeDepth(graph, 'd')).toBe(3);
77:      expect(signalsModule.computeDepth(graph, 'root')).toBe(0);
82:      expect(signalsModule.computeDepth(graph, 'nonexistent')).toBe(0);
94:      expect(signalsModule.computeDepth(graph, 'd')).toBe(2);
104:      const depths = signalsModule.computeAllDepths(graph);
112:      const depths = signalsModule.computeAllDepths(graph);

codex
1. Finding ID: `F-004-001`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:89)  
Line: `89-116, 159-176, 311-349`  
Title: Session-scoped reads are inconsistent with the module’s own auto-created nodes  
Description: `insertEdge()` synthesizes missing nodes without any `sessionId`, but every session-aware reader/filter only trusts `node.sessionId` or `node.metadata.sessionId`. That means a caller can build a graph entirely through the public insert API, attach `metadata.sessionId` to edges, and still lose those nodes from `getNodes()` and any signal helper that depends on node-level session matching. This makes the session-aware export surface easy to misuse and hard to reason about.  
Evidence:
```js
if (!graph.nodes.has(source)) {
  graph.nodes.set(source, { id: source, createdAt: new Date().toISOString() });
}
...
sessionId: typeof metadata.sessionId === 'string' && metadata.sessionId ? metadata.sessionId : undefined,
```
```js
if (typeof node.sessionId === 'string' && node.sessionId) return node.sessionId;
...
if (matchesSession(graph, node, sessionId, 'node')) results.push(node);
```  
Recommendation: Centralize graph/session normalization in one shared helper and either propagate `metadata.sessionId` into synthesized nodes or add an explicit node upsert API. Add direct session-scoped tests for `getNodes()`, `getEdges()`, `getEdgesFrom()`, `getEdgesTo()`, and the signal helpers.

2. Finding ID: `F-004-002`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:253)  
Line: `253-283`  
Title: `computeMomentum` has drifted away from the canonical runtime contract  
Description: The CJS helper exports `computeMomentum(graph, nodeId, windowSize, sessionId)` as a recent-edge counter, while the canonical runtime implementation exports `computeMomentum(specFolder, loopType)` as a snapshot-to-snapshot delta calculator in [.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:555). Same name, different meaning. That is a long-term drift trap for maintainers, especially because the requested test suite only validates the CJS behavior in [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:117).  
Evidence:
```js
// CJS
function computeMomentum(graph, nodeId, windowSize, sessionId) {
  ...
  if (edgeTime >= cutoff) {
    count++;
  }
}
```
```ts
// TS canonical
export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
  ...
  momentum[key] = latest[key] - previous[key];
}
```  
Recommendation: Rename the CJS helper to something contract-specific like `computeRecentEdgeActivity`, or move both layers behind one shared abstraction with parity tests that explicitly guard expected differences.

3. Finding ID: `F-004-003`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:143)  
Line: `143-146, 194-195`  
Title: Cycle-handling contract is documented one way and implemented another  
Description: The depth routine claims cycles are handled by “capping at the number of nodes,” but the implementation actually assigns `0` to nodes that never reach zero in-degree. That is not a harmless comment mismatch: it makes cyclic nodes indistinguishable from roots and hides complexity from downstream consumers. The requested unit tests only cover DAGs and empty graphs, so this divergence is currently unguarded.  
Evidence:
```js
 * Handles cycles by capping at the number of nodes (graceful degradation).
...
// For nodes in cycles that never reached in-degree 0, assign 0
return depths.get(nodeId) || 0;
```  
Recommendation: Either implement the documented fallback for cyclic components or update the contract and add explicit cycle tests for `computeDepth()` and `computeAllDepths()`.

4. Finding ID: `F-004-004`  
Severity: `P2`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:112)  
Line: `112-190`  
Title: The contradictions module’s higher-risk branches are only lightly covered  
Description: This module exposes session-aware scanning, enriched reporting, and density calculation, but the requested `coverage-graph-*.vitest.ts` suite never gives it the same direct coverage that `core`, `signals`, and `convergence` receive. In the requested files, `contradictionDensity()` is only asserted for the empty graph case, and there is no targeted check for session filtering, `byNode` grouping behavior, or evidence/reason propagation. That makes the export surface harder to refactor safely.  
Evidence:
```js
function reportContradictions(graph, sessionId) {
  ...
  evidence: c.metadata.evidence || null,
  reason: c.metadata.reason || null,
}
...
function contradictionDensity(graph, sessionId) {
  ...
  return contradictedNodes.size / scopedNodeIds.size;
}
```
Requested test coverage is limited to:
- [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:191)
- [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:425)
- [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:242)  
Recommendation: Add a dedicated `coverage-graph-contradictions.vitest.ts` or expand the existing suite with session-scoped contradiction graphs, non-empty `contradictionDensity()` assertions, and `reportContradictions()` enrichment checks.

**ITERATION SUMMARY**  
`4 findings total: 0 P0, 3 P1, 1 P2`

**COVERAGE ASSESSMENT**  
`100% of the requested focus area reviewed: all 4 target CJS libraries and all 6 requested scripts/tests/coverage-graph-*.vitest.ts files.`

**CONFIDENCE**  
`Medium` — code coverage review is complete, but I could not execute the targeted Vitest suite because the read-only sandbox blocked Vite from creating `.vite-temp` files.

**NEXT PRIORITIES**  
Inspect the runtime TS coverage-graph handlers and DB/query layer for the same contract seams, especially session scoping, momentum naming/semantics, and cycle behavior. The next pass should also verify whether any non-test consumers depend on these CJS exports, because that changes the remediation priority significantly.

Verification note: targeted Vitest execution was blocked by sandbox `EPERM` while opening `.../mcp_server/node_modules/.vite-temp/...`.
hook: Stop
hook: Stop Completed
tokens used
138,176
1. Finding ID: `F-004-001`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:89)  
Line: `89-116, 159-176, 311-349`  
Title: Session-scoped reads are inconsistent with the module’s own auto-created nodes  
Description: `insertEdge()` synthesizes missing nodes without any `sessionId`, but every session-aware reader/filter only trusts `node.sessionId` or `node.metadata.sessionId`. That means a caller can build a graph entirely through the public insert API, attach `metadata.sessionId` to edges, and still lose those nodes from `getNodes()` and any signal helper that depends on node-level session matching. This makes the session-aware export surface easy to misuse and hard to reason about.  
Evidence:
```js
if (!graph.nodes.has(source)) {
  graph.nodes.set(source, { id: source, createdAt: new Date().toISOString() });
}
...
sessionId: typeof metadata.sessionId === 'string' && metadata.sessionId ? metadata.sessionId : undefined,
```
```js
if (typeof node.sessionId === 'string' && node.sessionId) return node.sessionId;
...
if (matchesSession(graph, node, sessionId, 'node')) results.push(node);
```  
Recommendation: Centralize graph/session normalization in one shared helper and either propagate `metadata.sessionId` into synthesized nodes or add an explicit node upsert API. Add direct session-scoped tests for `getNodes()`, `getEdges()`, `getEdgesFrom()`, `getEdgesTo()`, and the signal helpers.

2. Finding ID: `F-004-002`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:253)  
Line: `253-283`  
Title: `computeMomentum` has drifted away from the canonical runtime contract  
Description: The CJS helper exports `computeMomentum(graph, nodeId, windowSize, sessionId)` as a recent-edge counter, while the canonical runtime implementation exports `computeMomentum(specFolder, loopType)` as a snapshot-to-snapshot delta calculator in [.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:555). Same name, different meaning. That is a long-term drift trap for maintainers, especially because the requested test suite only validates the CJS behavior in [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:117).  
Evidence:
```js
// CJS
function computeMomentum(graph, nodeId, windowSize, sessionId) {
  ...
  if (edgeTime >= cutoff) {
    count++;
  }
}
```
```ts
// TS canonical
export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
  ...
  momentum[key] = latest[key] - previous[key];
}
```  
Recommendation: Rename the CJS helper to something contract-specific like `computeRecentEdgeActivity`, or move both layers behind one shared abstraction with parity tests that explicitly guard expected differences.

3. Finding ID: `F-004-003`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:143)  
Line: `143-146, 194-195`  
Title: Cycle-handling contract is documented one way and implemented another  
Description: The depth routine claims cycles are handled by “capping at the number of nodes,” but the implementation actually assigns `0` to nodes that never reach zero in-degree. That is not a harmless comment mismatch: it makes cyclic nodes indistinguishable from roots and hides complexity from downstream consumers. The requested unit tests only cover DAGs and empty graphs, so this divergence is currently unguarded.  
Evidence:
```js
 * Handles cycles by capping at the number of nodes (graceful degradation).
...
// For nodes in cycles that never reached in-degree 0, assign 0
return depths.get(nodeId) || 0;
```  
Recommendation: Either implement the documented fallback for cyclic components or update the contract and add explicit cycle tests for `computeDepth()` and `computeAllDepths()`.

4. Finding ID: `F-004-004`  
Severity: `P2`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:112)  
Line: `112-190`  
Title: The contradictions module’s higher-risk branches are only lightly covered  
Description: This module exposes session-aware scanning, enriched reporting, and density calculation, but the requested `coverage-graph-*.vitest.ts` suite never gives it the same direct coverage that `core`, `signals`, and `convergence` receive. In the requested files, `contradictionDensity()` is only asserted for the empty graph case, and there is no targeted check for session filtering, `byNode` grouping behavior, or evidence/reason propagation. That makes the export surface harder to refactor safely.  
Evidence:
```js
function reportContradictions(graph, sessionId) {
  ...
  evidence: c.metadata.evidence || null,
  reason: c.metadata.reason || null,
}
...
function contradictionDensity(graph, sessionId) {
  ...
  return contradictedNodes.size / scopedNodeIds.size;
}
```
Requested test coverage is limited to:
- [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:191)
- [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:425)
- [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:242)  
Recommendation: Add a dedicated `coverage-graph-contradictions.vitest.ts` or expand the existing suite with session-scoped contradiction graphs, non-empty `contradictionDensity()` assertions, and `reportContradictions()` enrichment checks.

**ITERATION SUMMARY**  
`4 findings total: 0 P0, 3 P1, 1 P2`

**COVERAGE ASSESSMENT**  
`100% of the requested focus area reviewed: all 4 target CJS libraries and all 6 requested scripts/tests/coverage-graph-*.vitest.ts files.`

**CONFIDENCE**  
`Medium` — code coverage review is complete, but I could not execute the targeted Vitest suite because the read-only sandbox blocked Vite from creating `.vite-temp` files.

**NEXT PRIORITIES**  
Inspect the runtime TS coverage-graph handlers and DB/query layer for the same contract seams, especially session scoping, momentum naming/semantics, and cycle behavior. The next pass should also verify whether any non-test consumers depend on these CJS exports, because that changes the remediation priority significantly.

Verification note: targeted Vitest execution was blocked by sandbox `EPERM` while opening `.../mcp_server/node_modules/.vite-temp/...`.
