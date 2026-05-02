---
iteration: 22
dimension: security
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
phase: post-fix-validation
startedAt: 2026-04-12T12:47:04Z
completedAt: 2026-04-12T12:50:13Z
---

# Deep Review Iteration 022 — security (Post-Fix Validation)

**Focus:** VALIDATION: Verify namespace isolation fixes. Check coverage-graph-query.ts for full composite-key predicates in ALL NOT EXISTS subqueries and findContradictions joins. Check coverage-graph-signals.ts for namespace threading in edge lookups. Check handler files (query.ts, status.ts, convergence.ts) for mandatory sessionId. Check optimizer promote.cjs for path restriction, search.cjs for manifest enforcement, replay-corpus.cjs for root constraints.

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
session id: 019d81bb-3bb5-75d1-ad7c-19cb07eafcdd
--------
user
You are a senior code reviewer executing POST-FIX VALIDATION iteration 22 of a deep review session (ID: rvw-2026-04-12T11-30-00Z).

CONTEXT: A prior 20-iteration review found 80 findings (0 P0, 67 P1, 13 P2) across 4 dimensions. Six fix batches were then applied via GitHub Copilot CLI with GPT 5.4. This iteration validates those fixes.

DIMENSION: security
VALIDATION: Verify namespace isolation fixes. Check coverage-graph-query.ts for full composite-key predicates in ALL NOT EXISTS subqueries and findContradictions joins. Check coverage-graph-signals.ts for namespace threading in edge lookups. Check handler files (query.ts, status.ts, convergence.ts) for mandatory sessionId. Check optimizer promote.cjs for path restriction, search.cjs for manifest enforcement, replay-corpus.cjs for root constraints.

INSTRUCTIONS:
1. Read the files mentioned and verify the fixes were correctly applied.
2. For each original finding, report: FIXED (correctly addressed), PARTIAL (partially fixed, issues remain), REGRESSED (fix introduced new problems), or OPEN (not addressed).
3. Report any NEW findings introduced by the fix batches at P0/P1/P2 severity.
4. For each new or partial finding, provide the same structured format: Finding ID (F-022-NNN), Severity, Dimension, File, Line, Title, Description, Evidence, Recommendation.

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
I’m treating this as a findings-first post-fix validation pass on the security dimension. I’ll first load any relevant repo memory, run skill routing, and then inspect the exact files you named so we can verify each prior namespace-isolation fix against the code rather than assumptions.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"namespace isolation|coverage-graph-query|coverage-graph-signals|promote\\.cjs|search\\.cjs|replay-corpus\\.cjs|rvw-2026-04-12T11-30-00Z|security\" /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "POST-FIX VALIDATION iteration 22 of deep review session security validation for namespace isolation fixes in coverage graph query/signals handlers and optimizer scripts" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 392ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-hhtKW75A' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), code, context, deep(name), iteration"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), code(name), correct~"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !session, !session(multi), context, memory"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.88,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !intent:implementation, code(name), debug~, implementation"
  }
]

codex
Skill routing points strongly to `sk-deep-review` and `sk-code-review`, so I’m using those as the review baseline. I also retried memory lookup in a lightweight way; if there’s nothing relevant, I’ll stay grounded in the current code and validate directly from the files you named.
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
Synthesize --> Compile review/review-report.md (9 sections, verdict)
  |
Save --> generate-context.js --> verify memory artifact
```

### Review Dimensions

The four primary review dimensions (configured in `assets/review_mode_contract.yaml`):

| Dimension | Focus | Key Questions |
|-----------|-------|---------------|
| **Correctness** | Logic, behavior, error handling | Does the code do what it claims? Are edge cases handled? |
| **Security** | Vulnerabilities, exposure, trust boundaries | Are inputs validated? Are credentials exposed? |
| **Spec-Alignment / Traceability** | Spec vs. implementation fidelity | Does code match spec.md? Are all planned items present? |
| **Completeness / Maintainability** | Coverage, dead code, documentation | Are TODOs resolved? Is the code self-documenting? |

### Lifecycle + Reducer Contract

Review mode is lineage-aware. Every packet uses canonical review-mode artifacts:
- `deep-review-config.json`

exec
/bin/zsh -lc "rg --files | rg '(coverage-graph-query\\.ts|coverage-graph-signals\\.ts|query\\.ts|status\\.ts|convergence\\.ts|promote\\.cjs|search\\.cjs|replay-corpus\\.cjs)"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 171ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/scripts/db-query.ts
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/console/app/src/routes/auth/status.ts
.opencode/specs/system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/status.ts
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/console/app/src/routes/auth/status.ts
.opencode/specs/system-spec-kit/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/opencode/src/session/status.ts

Running a targeted post-fix validation pass for the security dimension. I’ll verify the named namespace-isolation fixes in code, classify each original finding’s status, and then report any newly introduced issues with exact evidence.
  → Inspect the target coverage-graph libraries, handlers, and optimizer scripts for the specific namespace-isolation fixes
  • Assess each original finding area as FIXED, PARTIAL, OPEN, or REGRESSED and identify any new issues
  • Deliver a findings-first validation report with exact file/line evidence, confidence, and release readiness
codex
I’ve got the file map now. Next I’m reading the coverage-graph query/signals internals and the handler/optimizer surfaces side by side so we can verify not just that a guard exists, but that every namespace-sensitive path carries the full composite key all the way through.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Coverage Graph Signals
     3	// ───────────────────────────────────────────────────────────────
     4	// Server-side signal computation and snapshot generation for
     5	// research and review convergence metrics.
     6	// Follows graph-signals.ts patterns for degree, depth, and momentum.
     7	
     8	import Database from 'better-sqlite3';
     9	import {
    10	  getDb,
    11	  getNodes,
    12	  getEdges,
    13	  createSnapshot,
    14	  getStats,
    15	  type Namespace,
    16	  type LoopType,
    17	  type CoverageNode,
    18	  type CoverageEdge,
    19	} from './coverage-graph-db.js';
    20	
    21	// ───────────────────────────────────────────────────────────────
    22	// 1. TYPES
    23	// ───────────────────────────────────────────────────────────────
    24	
    25	export interface NodeSignal {
    26	  nodeId: string;
    27	  kind: string;
    28	  degree: number;
    29	  inDegree: number;
    30	  outDegree: number;
    31	  depth: number;
    32	  weightSum: number;
    33	}
    34	
    35	export interface ResearchConvergenceSignals {
    36	  questionCoverage: number;
    37	  claimVerificationRate: number;
    38	  contradictionDensity: number;
    39	  sourceDiversity: number;
    40	  evidenceDepth: number;
    41	}
    42	
    43	export interface ReviewConvergenceSignals {
    44	  dimensionCoverage: number;
    45	  findingStability: number;
    46	  p0ResolutionRate: number;
    47	  evidenceDensity: number;
    48	  hotspotSaturation: number;
    49	}
    50	
    51	export type ConvergenceSignals = ResearchConvergenceSignals | ReviewConvergenceSignals;
    52	
    53	export interface SignalSnapshot {
    54	  iteration: number;
    55	  signals: ConvergenceSignals;
    56	  nodeSignals: NodeSignal[];
    57	  nodeCount: number;
    58	  edgeCount: number;
    59	}
    60	
    61	type ResearchSignalNodeLike = {
    62	  id: string;
    63	  kind: string;
    64	  metadata?: CoverageNode['metadata'] | string | null;
    65	};
    66	
    67	type ResearchSignalEdgeLike = {
    68	  sourceId: string;
    69	  targetId: string;
    70	  relation: string;
    71	};
    72	
    73	interface SqlFragment {
    74	  clause: string;
    75	  params: unknown[];
    76	}
    77	
    78	function buildNamespacePredicate(alias: string, ns: Namespace): SqlFragment {
    79	  const prefix = alias ? `${alias}.` : '';
    80	  const clauses = [`${prefix}spec_folder = ?`, `${prefix}loop_type = ?`];
    81	  const params: unknown[] = [ns.specFolder, ns.loopType];
    82	
    83	  if (ns.sessionId) {
    84	    clauses.push(`${prefix}session_id = ?`);
    85	    params.push(ns.sessionId);
    86	  }
    87	
    88	  return {
    89	    clause: clauses.join(' AND '),
    90	    params,
    91	  };
    92	}
    93	
    94	function buildCompositeNodeJoin(
    95	  nodeAlias: string,
    96	  edgeAlias: string,
    97	  edgeNodeColumn: 'source_id' | 'target_id',
    98	): string {
    99	  return `${nodeAlias}.spec_folder = ${edgeAlias}.spec_folder
   100	      AND ${nodeAlias}.loop_type = ${edgeAlias}.loop_type
   101	      AND ${nodeAlias}.session_id = ${edgeAlias}.session_id
   102	      AND ${nodeAlias}.id = ${edgeAlias}.${edgeNodeColumn}`;
   103	}
   104	
   105	// ───────────────────────────────────────────────────────────────
   106	// 2. NODE-LEVEL SIGNALS
   107	// ───────────────────────────────────────────────────────────────
   108	
   109	/**
   110	 * Compute degree, depth, and weight signals for all nodes in a namespace.
   111	 */
   112	export function computeNodeSignals(ns: Namespace): NodeSignal[] {
   113	  const nodes = getNodes(ns);
   114	  const edges = getEdges(ns);
   115	
   116	  // Build adjacency maps
   117	  const inDegreeMap = new Map<string, number>();
   118	  const outDegreeMap = new Map<string, number>();
   119	  const weightSumMap = new Map<string, number>();
   120	
   121	  for (const edge of edges) {
   122	    outDegreeMap.set(edge.sourceId, (outDegreeMap.get(edge.sourceId) ?? 0) + 1);
   123	    inDegreeMap.set(edge.targetId, (inDegreeMap.get(edge.targetId) ?? 0) + 1);
   124	    weightSumMap.set(edge.sourceId, (weightSumMap.get(edge.sourceId) ?? 0) + edge.weight);
   125	    weightSumMap.set(edge.targetId, (weightSumMap.get(edge.targetId) ?? 0) + edge.weight);
   126	  }
   127	
   128	  // BFS depth from root nodes (nodes with no incoming edges)
   129	  const depthMap = computeDepths(nodes, edges);
   130	
   131	  return nodes.map(node => ({
   132	    nodeId: node.id,
   133	    kind: node.kind,
   134	    degree: (inDegreeMap.get(node.id) ?? 0) + (outDegreeMap.get(node.id) ?? 0),
   135	    inDegree: inDegreeMap.get(node.id) ?? 0,
   136	    outDegree: outDegreeMap.get(node.id) ?? 0,
   137	    depth: depthMap.get(node.id) ?? 0,
   138	    weightSum: weightSumMap.get(node.id) ?? 0,
   139	  }));
   140	}
   141	
   142	/**
   143	 * Compute longest-path depth for each node from any root node.
   144	 * Mirrors the in-memory CJS implementation so both layers report
   145	 * the same structural depth for DAG-shaped coverage graphs.
   146	 */
   147	function computeDepths(nodes: CoverageNode[], edges: CoverageEdge[]): Map<string, number> {
   148	  const adjacency = new Map<string, string[]>();
   149	  const inDegree = new Map<string, number>();
   150	
   151	  for (const node of nodes) {
   152	    adjacency.set(node.id, []);
   153	    inDegree.set(node.id, 0);
   154	  }
   155	
   156	  for (const edge of edges) {
   157	    if (!adjacency.has(edge.sourceId)) adjacency.set(edge.sourceId, []);
   158	    adjacency.get(edge.sourceId)!.push(edge.targetId);
   159	    inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
   160	    if (!inDegree.has(edge.sourceId)) inDegree.set(edge.sourceId, 0);
   161	  }
   162	
   163	  const depthMap = new Map<string, number>();
   164	  const remaining = new Map(inDegree);
   165	  const queue: string[] = [];
   166	
   167	  for (const [id, degree] of remaining) {
   168	    if (degree === 0) {
   169	      depthMap.set(id, 0);
   170	      queue.push(id);
   171	    }
   172	  }
   173	
   174	  let queueIndex = 0;
   175	  while (queueIndex < queue.length) {
   176	    const current = queue[queueIndex++];
   177	    const currentDepth = depthMap.get(current) ?? 0;
   178	
   179	    for (const childId of adjacency.get(current) ?? []) {
   180	      const candidateDepth = currentDepth + 1;
   181	      if (candidateDepth > (depthMap.get(childId) ?? 0)) {
   182	        depthMap.set(childId, candidateDepth);
   183	      }
   184	
   185	      const nextDegree = (remaining.get(childId) ?? 0) - 1;
   186	      remaining.set(childId, nextDegree);
   187	      if (nextDegree === 0) {
   188	        queue.push(childId);
   189	      }
   190	    }
   191	  }
   192	
   193	  for (const node of nodes) {
   194	    if (!depthMap.has(node.id)) depthMap.set(node.id, 0);
   195	  }
   196	
   197	  return depthMap;
   198	}
   199	
   200	// ───────────────────────────────────────────────────────────────
   201	// 3. RESEARCH CONVERGENCE SIGNALS
   202	// ───────────────────────────────────────────────────────────────
   203	
   204	/**
   205	 * Compute research convergence signals.
   206	 */
   207	export function computeResearchSignals(ns: Namespace): ResearchConvergenceSignals {
   208	  const nodes = getNodes(ns);
   209	  const edges = getEdges(ns);
   210	
   211	  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
   212	  const claimVerificationRate = computeResearchClaimVerificationRateFromData(nodes);
   213	  const contradictionDensity = computeResearchContradictionDensityFromData(edges);
   214	  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
   215	  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);
   216	
   217	  return {
   218	    questionCoverage,
   219	    claimVerificationRate,
   220	    contradictionDensity,
   221	    sourceDiversity,
   222	    evidenceDepth,
   223	  };
   224	}
   225	
   226	function parseNodeMetadata(metadata: CoverageNode['metadata'] | string | null | undefined): Record<string, unknown> | null {
   227	  if (!metadata) return null;
   228	  if (typeof metadata === 'string') {
   229	    try {
   230	      const parsed = JSON.parse(metadata) as unknown;
   231	      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
   232	    } catch {
   233	      return null;
   234	    }
   235	  }
   236	  return typeof metadata === 'object' ? metadata as Record<string, unknown> : null;
   237	}
   238	
   239	function buildAnsweringFindingsByQuestion(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
   240	  const answeringFindings = new Map<string, string[]>();
   241	
   242	  for (const edge of edges) {
   243	    if (edge.relation !== 'ANSWERS') continue;
   244	    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
   245	    answeringFindings.get(edge.targetId)!.push(edge.sourceId);
   246	  }
   247	
   248	  return answeringFindings;
   249	}
   250	
   251	function buildCitedSourcesByFinding(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
   252	  const citedSources = new Map<string, string[]>();
   253	
   254	  for (const edge of edges) {
   255	    if (edge.relation !== 'CITES') continue;
   256	    if (!citedSources.has(edge.sourceId)) citedSources.set(edge.sourceId, []);
   257	    citedSources.get(edge.sourceId)!.push(edge.targetId);
   258	  }
   259	
   260	  return citedSources;
   261	}
   262	
   263	/**
   264	 * Canonical research question coverage: questions with at least two ANSWERS
   265	 * edges divided by all research questions in the graph.
   266	 */
   267	export function computeResearchQuestionCoverageFromData(
   268	  nodes: ReadonlyArray<ResearchSignalNodeLike>,
   269	  edges: ReadonlyArray<ResearchSignalEdgeLike>,
   270	): number {
   271	  const questionIds = nodes
   272	    .filter(node => node.kind === 'QUESTION')
   273	    .map(node => node.id);
   274	
   275	  if (questionIds.length === 0) return 0;
   276	
   277	  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
   278	  let coveredQuestions = 0;
   279	
   280	  for (const questionId of questionIds) {
   281	    if ((answeringFindings.get(questionId) ?? []).length >= 2) {
   282	      coveredQuestions++;
   283	    }
   284	  }
   285	
   286	  return coveredQuestions / questionIds.length;
   287	}
   288	
   289	/**
   290	 * Canonical research claim verification rate: verified claims divided by all
   291	 * claim nodes, where verified means verification_status exists and is not
   292	 * "unresolved".
   293	 */
   294	export function computeResearchClaimVerificationRateFromData(
   295	  nodes: ReadonlyArray<ResearchSignalNodeLike>,
   296	): number {
   297	  const claims = nodes.filter(node => node.kind === 'CLAIM');
   298	  if (claims.length === 0) return 0;
   299	
   300	  let verifiedClaims = 0;
   301	  for (const claim of claims) {
   302	    const meta = parseNodeMetadata(claim.metadata);
   303	    if (meta?.verification_status && meta.verification_status !== 'unresolved') {
   304	      verifiedClaims++;
   305	    }
   306	  }
   307	
   308	  return verifiedClaims / claims.length;
   309	}
   310	
   311	/**
   312	 * Canonical research contradiction density: CONTRADICTS edges divided by all
   313	 * research edges in the graph.
   314	 */
   315	export function computeResearchContradictionDensityFromData(
   316	  edges: ReadonlyArray<ResearchSignalEdgeLike>,
   317	): number {
   318	  if (edges.length === 0) return 0;
   319	  let contradictionCount = 0;
   320	

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Coverage Graph Query Helpers
     3	// ───────────────────────────────────────────────────────────────
     4	// Structured query helpers for coverage gap detection, contradiction
     5	// lookup, provenance chains, unverified claims, and hot-node ranking.
     6	// Called by the coverage-graph MCP query handler.
     7	
     8	import {
     9	  getDb,
    10	  type Namespace,
    11	  type CoverageNode,
    12	  type CoverageEdge,
    13	} from './coverage-graph-db.js';
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	// 1. TYPES
    17	// ───────────────────────────────────────────────────────────────
    18	
    19	export interface CoverageGap {
    20	  nodeId: string;
    21	  kind: string;
    22	  name: string;
    23	  reason: string;
    24	}
    25	
    26	export interface ContradictionPair {
    27	  edgeId: string;
    28	  sourceId: string;
    29	  targetId: string;
    30	  sourceName: string;
    31	  targetName: string;
    32	  weight: number;
    33	  metadata?: Record<string, unknown>;
    34	}
    35	
    36	export interface ProvenanceStep {
    37	  nodeId: string;
    38	  kind: string;
    39	  name: string;
    40	  depth: number;
    41	  edgeRelation: string;
    42	  cumulativeWeight: number;
    43	}
    44	
    45	export interface HotNode {
    46	  nodeId: string;
    47	  kind: string;
    48	  name: string;
    49	  edgeCount: number;
    50	  weightSum: number;
    51	  score: number;
    52	}
    53	
    54	interface SqlFragment {
    55	  clause: string;
    56	  params: unknown[];
    57	}
    58	
    59	function buildNamespacePredicate(alias: string, ns: Namespace): SqlFragment {
    60	  const prefix = alias ? `${alias}.` : '';
    61	  const clauses = [`${prefix}spec_folder = ?`, `${prefix}loop_type = ?`];
    62	  const params: unknown[] = [ns.specFolder, ns.loopType];
    63	
    64	  if (ns.sessionId) {
    65	    clauses.push(`${prefix}session_id = ?`);
    66	    params.push(ns.sessionId);
    67	  }
    68	
    69	  return {
    70	    clause: clauses.join(' AND '),
    71	    params,
    72	  };
    73	}
    74	
    75	function buildCompositeNodeJoin(
    76	  nodeAlias: string,
    77	  edgeAlias: string,
    78	  edgeNodeColumn: 'source_id' | 'target_id',
    79	): string {
    80	  return `${nodeAlias}.spec_folder = ${edgeAlias}.spec_folder
    81	      AND ${nodeAlias}.loop_type = ${edgeAlias}.loop_type
    82	      AND ${nodeAlias}.session_id = ${edgeAlias}.session_id
    83	      AND ${nodeAlias}.id = ${edgeAlias}.${edgeNodeColumn}`;
    84	}
    85	
    86	// ───────────────────────────────────────────────────────────────
    87	// 2. COVERAGE GAPS
    88	// ───────────────────────────────────────────────────────────────
    89	
    90	/**
    91	 * Find nodes with coverage gaps.
    92	 * For research: questions that have no incoming ANSWERS or COVERS edges.
    93	 * For review: dimensions/files that are not sources of outgoing COVERS or EVIDENCE_FOR edges.
    94	 */
    95	export function findCoverageGaps(ns: Namespace): CoverageGap[] {
    96	  const d = getDb();
    97	  const { loopType } = ns;
    98	
    99	  const coverageRelations = loopType === 'research'
   100	    ? ['ANSWERS', 'COVERS']
   101	    : ['COVERS', 'EVIDENCE_FOR'];
   102	
   103	  const targetKinds = loopType === 'research'
   104	    ? ['QUESTION']
   105	    : ['DIMENSION', 'FILE'];
   106	
   107	  const gaps: CoverageGap[] = [];
   108	
   109	  if (loopType === 'review') {
   110	    // Review mode: dimensions/files are sources of outgoing COVERS edges.
   111	    // A gap means the node has no outgoing coverage edges.
   112	    for (const kind of targetKinds) {
   113	      const nodeNamespace = buildNamespacePredicate('n', ns);
   114	      const edgeNamespace = buildNamespacePredicate('e', ns);
   115	      const nodeRows = d.prepare(`
   116	        SELECT n.id, n.kind, n.name
   117	        FROM coverage_nodes n
   118	        WHERE ${nodeNamespace.clause}
   119	          AND n.kind = ?
   120	          AND NOT EXISTS (
   121	            SELECT 1 FROM coverage_edges e
   122	            WHERE ${edgeNamespace.clause}
   123	              AND e.source_id = n.id
   124	              AND e.relation IN (${coverageRelations.map(() => '?').join(',')})
   125	          )
   126	      `).all(
   127	        ...nodeNamespace.params,
   128	        kind,
   129	        ...edgeNamespace.params,
   130	        ...coverageRelations,
   131	      ) as Array<{ id: string; kind: string; name: string }>;
   132	
   133	      for (const row of nodeRows) {
   134	        gaps.push({
   135	          nodeId: row.id,
   136	          kind: row.kind,
   137	          name: row.name,
   138	          reason: `No outgoing ${coverageRelations.join(' or ')} edges`,
   139	        });
   140	      }
   141	    }
   142	  } else {
   143	    // Research mode: questions should have incoming ANSWERS edges.
   144	    for (const kind of targetKinds) {
   145	      const nodeNamespace = buildNamespacePredicate('n', ns);
   146	      const edgeNamespace = buildNamespacePredicate('e', ns);
   147	      const nodeRows = d.prepare(`
   148	        SELECT n.id, n.kind, n.name
   149	        FROM coverage_nodes n
   150	        WHERE ${nodeNamespace.clause}
   151	          AND n.kind = ?
   152	          AND NOT EXISTS (
   153	            SELECT 1 FROM coverage_edges e
   154	            WHERE ${edgeNamespace.clause}
   155	              AND e.target_id = n.id
   156	              AND e.relation IN (${coverageRelations.map(() => '?').join(',')})
   157	          )
   158	      `).all(
   159	        ...nodeNamespace.params,
   160	        kind,
   161	        ...edgeNamespace.params,
   162	        ...coverageRelations,
   163	      ) as Array<{ id: string; kind: string; name: string }>;
   164	
   165	      for (const row of nodeRows) {
   166	        gaps.push({
   167	          nodeId: row.id,
   168	          kind: row.kind,
   169	          name: row.name,
   170	          reason: `No incoming ${coverageRelations.join(' or ')} edges`,
   171	        });
   172	      }
   173	    }
   174	  }
   175	
   176	  return gaps;
   177	}
   178	
   179	// ───────────────────────────────────────────────────────────────
   180	// 3. CONTRADICTIONS
   181	// ───────────────────────────────────────────────────────────────
   182	
   183	/**
   184	 * Find all CONTRADICTS edge pairs in a namespace.
   185	 */
   186	export function findContradictions(ns: Namespace): ContradictionPair[] {
   187	  const d = getDb();
   188	  const edgeNamespace = buildNamespacePredicate('e', ns);
   189	
   190	  const rows = d.prepare(`
   191	    SELECT e.id, e.source_id, e.target_id, e.weight, e.metadata,
   192	           s.name AS source_name, t.name AS target_name
   193	    FROM coverage_edges e
   194	    JOIN coverage_nodes s ON ${buildCompositeNodeJoin('s', 'e', 'source_id')}
   195	    JOIN coverage_nodes t ON ${buildCompositeNodeJoin('t', 'e', 'target_id')}
   196	    WHERE ${edgeNamespace.clause}
   197	      AND e.relation = 'CONTRADICTS'
   198	  `).all(...edgeNamespace.params) as Array<{
   199	    id: string;
   200	    source_id: string;
   201	    target_id: string;
   202	    weight: number;
   203	    metadata: string | null;
   204	    source_name: string;
   205	    target_name: string;
   206	  }>;
   207	
   208	  return rows.map(row => ({
   209	    edgeId: row.id,
   210	    sourceId: row.source_id,
   211	    targetId: row.target_id,
   212	    sourceName: row.source_name,
   213	    targetName: row.target_name,
   214	    weight: row.weight,
   215	    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
   216	  }));
   217	}
   218	
   219	// ───────────────────────────────────────────────────────────────
   220	// 4. PROVENANCE CHAIN
   221	// ───────────────────────────────────────────────────────────────
   222	
   223	/**
   224	 * BFS from a node following CITES/EVIDENCES/DERIVED_FROM/SUPPORTS edges.
   225	 * Detects cycles and returns cumulative path strength.
   226	 */
   227	export function findProvenanceChain(ns: Namespace, nodeId: string, maxDepth: number = 10): ProvenanceStep[] {
   228	  const provenanceRelations = ns.loopType === 'research'
   229	    ? ['CITES', 'DERIVED_FROM', 'SUPPORTS']
   230	    : ['EVIDENCE_FOR', 'CONFIRMS'];
   231	
   232	  const visited = new Set<string>();
   233	  const results: ProvenanceStep[] = [];
   234	  let frontier: Array<{ id: string; depth: number; cumulativeWeight: number }> = [
   235	    { id: nodeId, depth: 0, cumulativeWeight: 1.0 },
   236	  ];
   237	
   238	  while (frontier.length > 0) {
   239	    const next: typeof frontier = [];
   240	
   241	    for (const item of frontier) {
   242	      if (visited.has(item.id) || item.depth >= maxDepth) continue;
   243	      visited.add(item.id);
   244	
   245	      // Phase 008 P1-04 closure: the provenance helpers must constrain by
   246	      // specFolder + loopType + sessionId (full namespace) so provenance reads
   247	      // cannot cross the packet boundary even when sessionId is present.
   248	      const edges = getEdgesFromNode(item.id, ns);
   249	      for (const edge of edges) {
   250	        if (!provenanceRelations.includes(edge.relation)) continue;
   251	        if (visited.has(edge.targetId)) continue;
   252	
   253	        const targetNode = getNodeById(edge.targetId, ns);
   254	        if (!targetNode) continue;
   255	
   256	        const cumWeight = item.cumulativeWeight * edge.weight;
   257	        results.push({
   258	          nodeId: edge.targetId,
   259	          kind: targetNode.kind,
   260	          name: targetNode.name,
   261	          depth: item.depth + 1,
   262	          edgeRelation: edge.relation,
   263	          cumulativeWeight: cumWeight,
   264	        });
   265	
   266	        next.push({ id: edge.targetId, depth: item.depth + 1, cumulativeWeight: cumWeight });
   267	      }
   268	    }
   269	
   270	    frontier = next;
   271	  }
   272	
   273	  return results;
   274	}
   275	
   276	/**
   277	 * Internal helper: get node by ID for provenance chain.
   278	 *
   279	 * Phase 008 P1-04 closure: constrain reads by the full namespace
   280	 * (specFolder + loopType + sessionId) rather than sessionId alone, so
   281	 * provenance cannot cross packet boundaries.
   282	 */
   283	function getNodeById(id: string, ns: Namespace): { kind: string; name: string } | null {
   284	  const d = getDb();
   285	  const nodeNamespace = buildNamespacePredicate('', ns);
   286	  const row = d.prepare(`
   287	    SELECT kind, name
   288	    FROM coverage_nodes
   289	    WHERE id = ?
   290	      AND ${nodeNamespace.clause}
   291	  `).get(id, ...nodeNamespace.params) as { kind: string; name: string } | undefined;
   292	  return row ?? null;
   293	}
   294	
   295	function getEdgesFromNode(sourceId: string, ns: Namespace): CoverageEdge[] {
   296	  const d = getDb();
   297	  const edgeNamespace = buildNamespacePredicate('', ns);
   298	  const rows = d.prepare(`
   299	    SELECT *
   300	    FROM coverage_edges
   301	    WHERE source_id = ?
   302	      AND ${edgeNamespace.clause}
   303	  `).all(sourceId, ...edgeNamespace.params) as Record<string, unknown>[];
   304	
   305	  return rows.map(row => ({
   306	    id: row.id as string,
   307	    specFolder: row.spec_folder as string,
   308	    loopType: row.loop_type as Namespace['loopType'],
   309	    sessionId: row.session_id as string,
   310	    sourceId: row.source_id as string,
   311	    targetId: row.target_id as string,
   312	    relation: row.relation as CoverageEdge['relation'],
   313	    weight: row.weight as number,
   314	    metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
   315	    createdAt: row.created_at as string | undefined,
   316	  }));
   317	}
   318	
   319	// ───────────────────────────────────────────────────────────────
   320	// 5. UNVERIFIED CLAIMS

exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts; do echo "FILE: $f"; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
FILE: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Coverage Graph Query Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// MCP tool handler for deep_loop_graph_query — structured analysis
     5	// of coverage graph state.
     6	
     7	import type { LoopType, Namespace } from '../../lib/coverage-graph/coverage-graph-db.js';
     8	import {
     9	  findCoverageGaps,
    10	  findContradictions,
    11	  findProvenanceChain,
    12	  findUnverifiedClaims,
    13	  rankHotNodes,
    14	} from '../../lib/coverage-graph/coverage-graph-query.js';
    15	
    16	// ───────────────────────────────────────────────────────────────
    17	// 1. TYPES
    18	// ───────────────────────────────────────────────────────────────
    19	
    20	export type QueryType =
    21	  | 'uncovered_questions'
    22	  | 'unverified_claims'
    23	  | 'contradictions'
    24	  | 'provenance_chain'
    25	  | 'coverage_gaps'
    26	  | 'hot_nodes';
    27	
    28	export interface QueryArgs {
    29	  specFolder: string;
    30	  loopType: LoopType;
    31	  queryType: QueryType;
    32	  nodeId?: string;
    33	  sessionId: string;
    34	  limit?: number;
    35	  maxDepth?: number;
    36	}
    37	
    38	// ───────────────────────────────────────────────────────────────
    39	// 2. HANDLER
    40	// ───────────────────────────────────────────────────────────────
    41	
    42	/** Handle deep_loop_graph_query tool call */
    43	export async function handleCoverageGraphQuery(
    44	  args: QueryArgs,
    45	): Promise<{ content: Array<{ type: string; text: string }> }> {
    46	  try {
    47	    // Validate required fields
    48	    if (!args.specFolder || typeof args.specFolder !== 'string') {
    49	      return errorResponse('specFolder is required');
    50	    }
    51	    if (args.loopType !== 'research' && args.loopType !== 'review') {
    52	      return errorResponse('loopType must be "research" or "review"');
    53	    }
    54	    if (!args.sessionId || typeof args.sessionId !== 'string') {
    55	      return errorResponse('sessionId is required for non-admin reads');
    56	    }
    57	
    58	    const ns: Namespace = {
    59	      specFolder: args.specFolder,
    60	      loopType: args.loopType,
    61	      sessionId: args.sessionId,
    62	    };
    63	
    64	    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
    65	
    66	    switch (args.queryType) {
    67	      case 'uncovered_questions':
    68	      case 'coverage_gaps': {
    69	        const gaps = findCoverageGaps(ns);
    70	        return okResponse({
    71	          queryType: args.queryType,
    72	          namespace: buildNamespacePayload(ns),
    73	          scopeMode: 'session',
    74	          gaps: gaps.slice(0, limit),
    75	          totalGaps: gaps.length,
    76	        });
    77	      }
    78	
    79	      case 'unverified_claims': {
    80	        const claims = findUnverifiedClaims(ns);
    81	        return okResponse({
    82	          queryType: 'unverified_claims',
    83	          namespace: buildNamespacePayload(ns),
    84	          scopeMode: 'session',
    85	          claims: claims.slice(0, limit).map(c => ({
    86	            id: c.id,
    87	            kind: c.kind,
    88	            name: c.name,
    89	            iteration: c.iteration,
    90	            metadata: c.metadata,
    91	          })),
    92	          totalUnverified: claims.length,
    93	        });
    94	      }
    95	
    96	      case 'contradictions': {
    97	        const contradictions = findContradictions(ns);
    98	        return okResponse({
    99	          queryType: 'contradictions',
   100	          namespace: buildNamespacePayload(ns),
   101	          scopeMode: 'session',
   102	          contradictions: contradictions.slice(0, limit),
   103	          totalContradictions: contradictions.length,
   104	        });
   105	      }
   106	
   107	      case 'provenance_chain': {
   108	        if (!args.nodeId) {
   109	          return errorResponse('nodeId is required for provenance_chain query');
   110	        }
   111	        const maxDepth = Math.min(Math.max(args.maxDepth ?? 10, 1), 20);
   112	        const chain = findProvenanceChain(ns, args.nodeId, maxDepth);
   113	        return okResponse({
   114	          queryType: 'provenance_chain',
   115	          namespace: buildNamespacePayload(ns),
   116	          scopeMode: 'session',
   117	          rootNodeId: args.nodeId,
   118	          chain: chain.slice(0, limit),
   119	          totalSteps: chain.length,
   120	          maxDepth,
   121	        });
   122	      }
   123	
   124	      case 'hot_nodes': {
   125	        const hotNodes = rankHotNodes(ns, limit);
   126	        return okResponse({
   127	          queryType: 'hot_nodes',
   128	          namespace: buildNamespacePayload(ns),
   129	          scopeMode: 'session',
   130	          hotNodes,
   131	          totalReturned: hotNodes.length,
   132	        });
   133	      }
   134	
   135	      default:
   136	        return errorResponse(
   137	          `Unknown queryType: "${args.queryType}". Valid types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes`,
   138	        );
   139	    }
   140	  } catch (err: unknown) {
   141	    return errorResponse(
   142	      `Query failed: ${err instanceof Error ? err.message : String(err)}`,
   143	    );
   144	  }
   145	}
   146	
   147	function buildNamespacePayload(ns: Namespace): Record<string, unknown> {
   148	  return {
   149	    specFolder: ns.specFolder,
   150	    loopType: ns.loopType,
   151	    ...(ns.sessionId ? { sessionId: ns.sessionId } : {}),
   152	  };
   153	}
   154	
   155	// ───────────────────────────────────────────────────────────────
   156	// 3. RESPONSE HELPERS
   157	// ───────────────────────────────────────────────────────────────
   158	
   159	function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
   160	  return {
   161	    content: [{
   162	      type: 'text',
   163	      text: JSON.stringify({ status: 'ok', data }, null, 2),
   164	    }],
   165	  };
   166	}
   167	
   168	function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
   169	  return {
   170	    content: [{
   171	      type: 'text',
   172	      text: JSON.stringify({ status: 'error', error }),
   173	    }],
   174	  };
   175	}
FILE: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Coverage Graph Status Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// MCP tool handler for deep_loop_graph_status — reports graph
     5	// health, counts, relation breakdowns, and signal summaries.
     6	
     7	import type { LoopType, Namespace } from '../../lib/coverage-graph/coverage-graph-db.js';
     8	import {
     9	  computeScopedMomentum,
    10	  computeScopedSignals,
    11	  computeScopedStats,
    12	} from './convergence.js';
    13	
    14	// ───────────────────────────────────────────────────────────────
    15	// 1. TYPES
    16	// ───────────────────────────────────────────────────────────────
    17	
    18	export interface StatusArgs {
    19	  specFolder: string;
    20	  loopType: LoopType;
    21	  sessionId: string;
    22	}
    23	
    24	// ───────────────────────────────────────────────────────────────
    25	// 2. HANDLER
    26	// ───────────────────────────────────────────────────────────────
    27	
    28	/** Handle deep_loop_graph_status tool call */
    29	export async function handleCoverageGraphStatus(
    30	  args: StatusArgs,
    31	): Promise<{ content: Array<{ type: string; text: string }> }> {
    32	  try {
    33	    if (!args.specFolder || typeof args.specFolder !== 'string') {
    34	      return errorResponse('specFolder is required');
    35	    }
    36	    if (args.loopType !== 'research' && args.loopType !== 'review') {
    37	      return errorResponse('loopType must be "research" or "review"');
    38	    }
    39	    if (!args.sessionId || typeof args.sessionId !== 'string') {
    40	      return errorResponse('sessionId is required for non-admin reads');
    41	    }
    42	
    43	    const ns: Namespace = {
    44	      specFolder: args.specFolder,
    45	      loopType: args.loopType,
    46	      sessionId: args.sessionId,
    47	    };
    48	    const stats = computeScopedStats(ns);
    49	
    50	    // Compute current signals (safe for empty graphs)
    51	    let signals = null;
    52	    let momentum = null;
    53	
    54	    if (stats.totalNodes > 0) {
    55	      try {
    56	        signals = computeScopedSignals(ns);
    57	        momentum = computeScopedMomentum(ns);
    58	      } catch {
    59	        // Non-blocking: continue with null signals
    60	      }
    61	    }
    62	
    63	    return {
    64	      content: [{
    65	        type: 'text',
    66	        text: JSON.stringify({
    67	          status: 'ok',
    68	          data: {
    69	            namespace: {
    70	              specFolder: args.specFolder,
    71	              loopType: args.loopType,
    72	              sessionId: args.sessionId,
    73	            },
    74	            scopeMode: 'session',
    75	            notes: ['Status metrics were computed from the session-scoped subgraph only.'],
    76	            totalNodes: stats.totalNodes,
    77	            totalEdges: stats.totalEdges,
    78	            nodesByKind: stats.nodesByKind,
    79	            edgesByRelation: stats.edgesByRelation,
    80	            lastIteration: stats.lastIteration,
    81	            signals,
    82	            momentum,
    83	          },
    84	        }, null, 2),
    85	      }],
    86	    };
    87	  } catch (err: unknown) {
    88	    return errorResponse(
    89	      `Status check failed: ${err instanceof Error ? err.message : String(err)}`,
    90	    );
    91	  }
    92	}
    93	
    94	function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
    95	  return {
    96	    content: [{
    97	      type: 'text',
    98	      text: JSON.stringify({ status: 'error', error }),
    99	    }],
   100	  };
   101	}
FILE: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Coverage Graph Convergence Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// MCP tool handler for deep_loop_graph_convergence — composite
     5	// convergence assessment with typed decision, signals, blockers,
     6	// and trace.
     7	
     8	import {
     9	  createSnapshot,
    10	  getEdges,
    11	  getNodes,
    12	  getSnapshots,
    13	  type LoopType,
    14	  type CoverageNode,
    15	  type Namespace,
    16	} from '../../lib/coverage-graph/coverage-graph-db.js';
    17	import {
    18	  computeSignals,
    19	  type ConvergenceSignals,
    20	  type ResearchConvergenceSignals,
    21	  type ReviewConvergenceSignals,
    22	  computeResearchQuestionCoverageFromData,
    23	  computeResearchClaimVerificationRateFromData,
    24	  computeResearchContradictionDensityFromData,
    25	  computeResearchSourceDiversityFromData,
    26	  computeResearchEvidenceDepthFromData,
    27	} from '../../lib/coverage-graph/coverage-graph-signals.js';
    28	import {
    29	  findCoverageGaps,
    30	  findContradictions,
    31	  findUnverifiedClaims,
    32	} from '../../lib/coverage-graph/coverage-graph-query.js';
    33	
    34	// ───────────────────────────────────────────────────────────────
    35	// 1. TYPES
    36	// ───────────────────────────────────────────────────────────────
    37	
    38	export type ConvergenceDecision = 'CONTINUE' | 'STOP_ALLOWED' | 'STOP_BLOCKED';
    39	
    40	export interface ConvergenceBlocker {
    41	  type: string;
    42	  description: string;
    43	  count: number;
    44	  severity: 'blocking' | 'warning';
    45	}
    46	
    47	export interface ConvergenceTraceEntry {
    48	  signal: string;
    49	  value: number;
    50	  threshold: number;
    51	  passed: boolean;
    52	  role: 'weighted' | 'blocking_guard';
    53	}
    54	
    55	/**
    56	 * Compute a canonical numeric composite score from convergence signals.
    57	 *
    58	 * Phase 008 P1-01 closure: reducers previously either recorded 0 (research)
    59	 * or averaged raw signal values (review) because the handler did not emit a
    60	 * composite score. This helper produces the single authoritative numeric
    61	 * value the reducer-owned `graphConvergenceScore` field should expose.
    62	 *
    63	 * Research signals are weighted as: questionCoverage 0.30, claimVerification
    64	 * 0.25, (1 - contradictionDensity) 0.15, sourceDiversity (capped /3) 0.15,
    65	 * evidenceDepth (capped /5) 0.15. All output is clamped to [0.0, 1.0].
    66	 *
    67	 * Review signals are weighted as: dimensionCoverage 0.25, findingStability
    68	 * 0.20, p0ResolutionRate 0.25, evidenceDensity 0.15, hotspotSaturation 0.15.
    69	 */
    70	function computeCompositeScore(
    71	  signals: ConvergenceSignals,
    72	  loopType: LoopType,
    73	): number {
    74	  if (!signals || typeof signals !== 'object') return 0;
    75	
    76	  const clamp = (value: number) => Math.max(0, Math.min(1, value));
    77	  const safe = (value: unknown): number =>
    78	    typeof value === 'number' && Number.isFinite(value) ? value : 0;
    79	
    80	  if (loopType === 'research') {
    81	    const r = signals as ResearchConvergenceSignals;
    82	    const normalizedDiversity = Math.min(safe(r.sourceDiversity) / 3.0, 1.0);
    83	    const normalizedDepth = Math.min(safe(r.evidenceDepth) / 5.0, 1.0);
    84	    const invertedContradictions = 1.0 - clamp(safe(r.contradictionDensity));
    85	    const score =
    86	      clamp(safe(r.questionCoverage)) * 0.30 +
    87	      clamp(safe(r.claimVerificationRate)) * 0.25 +
    88	      invertedContradictions * 0.15 +
    89	      normalizedDiversity * 0.15 +
    90	      normalizedDepth * 0.15;
    91	    return Math.round(clamp(score) * 1000) / 1000;
    92	  }
    93	
    94	  const v = signals as ReviewConvergenceSignals;
    95	  const score =
    96	    clamp(safe(v.dimensionCoverage)) * 0.25 +
    97	    clamp(safe(v.findingStability)) * 0.20 +
    98	    clamp(safe(v.p0ResolutionRate)) * 0.25 +
    99	    clamp(safe(v.evidenceDensity)) * 0.15 +
   100	    clamp(safe(v.hotspotSaturation)) * 0.15;
   101	  return Math.round(clamp(score) * 1000) / 1000;
   102	}
   103	
   104	export interface ConvergenceArgs {
   105	  specFolder: string;
   106	  loopType: LoopType;
   107	  sessionId: string;
   108	  iteration?: number;
   109	  persistSnapshot?: boolean;
   110	}
   111	
   112	export interface ScopedCoverageStats {
   113	  totalNodes: number;
   114	  totalEdges: number;
   115	  nodesByKind: Record<string, number>;
   116	  edgesByRelation: Record<string, number>;
   117	  lastIteration: number | null;
   118	}
   119	
   120	// ───────────────────────────────────────────────────────────────
   121	// 2. THRESHOLDS
   122	// ───────────────────────────────────────────────────────────────
   123	
   124	/** Research convergence thresholds */
   125	const RESEARCH_THRESHOLDS = {
   126	  questionCoverage: 0.7,
   127	  claimVerificationRate: 0.6,
   128	  contradictionDensity: 0.15, // max allowed
   129	  sourceDiversity: 1.5,      // blocking guard
   130	  evidenceDepth: 1.5,        // blocking guard
   131	};
   132	
   133	/** Review convergence thresholds */
   134	const REVIEW_THRESHOLDS = {
   135	  dimensionCoverage: 0.8,
   136	  findingStability: 0.7,
   137	  p0ResolutionRate: 0.9,
   138	  evidenceDensity: 1.0,
   139	  hotspotSaturation: 0.6,
   140	};
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. HANDLER
   144	// ───────────────────────────────────────────────────────────────
   145	
   146	/** Handle deep_loop_graph_convergence tool call */
   147	export async function handleCoverageGraphConvergence(
   148	  args: ConvergenceArgs,
   149	): Promise<{ content: Array<{ type: string; text: string }> }> {
   150	  try {
   151	    if (!args.specFolder || typeof args.specFolder !== 'string') {
   152	      return errorResponse('specFolder is required');
   153	    }
   154	    if (args.loopType !== 'research' && args.loopType !== 'review') {
   155	      return errorResponse('loopType must be "research" or "review"');
   156	    }
   157	    if (!args.sessionId || typeof args.sessionId !== 'string') {
   158	      return errorResponse('sessionId is required for non-admin reads');
   159	    }
   160	
   161	    const ns: Namespace = {
   162	      specFolder: args.specFolder,
   163	      loopType: args.loopType,
   164	      sessionId: args.sessionId,
   165	    };
   166	    const stats = computeScopedStats(ns);
   167	
   168	    // Empty graph: can't make convergence decisions
   169	    if (stats.totalNodes === 0) {
   170	      return okResponse({
   171	        decision: 'CONTINUE' as ConvergenceDecision,
   172	        reason: 'Graph is empty; insufficient data for convergence assessment',
   173	        signals: null,
   174	        blockers: [],
   175	        trace: [],
   176	        namespace: buildNamespacePayload(ns),
   177	        scopeMode: 'session',
   178	        nodeCount: 0,
   179	        edgeCount: 0,
   180	      });
   181	    }
   182	
   183	    // Compute signals
   184	    const signals = computeScopedSignals(ns);
   185	    const momentum = computeScopedMomentum(ns);
   186	
   187	    // Persist snapshot if requested
   188	    if (args.persistSnapshot && args.iteration !== undefined) {
   189	      createSnapshot({
   190	        specFolder: args.specFolder,
   191	        loopType: args.loopType,
   192	        sessionId: args.sessionId,
   193	        iteration: args.iteration,
   194	        metrics: {
   195	          ...signals,
   196	          nodeCount: stats.totalNodes,
   197	          edgeCount: stats.totalEdges,
   198	        },
   199	        nodeCount: stats.totalNodes,
   200	        edgeCount: stats.totalEdges,
   201	      });
   202	    }
   203	
   204	    // Evaluate convergence
   205	    const blockers: ConvergenceBlocker[] = [];
   206	    const trace: ConvergenceTraceEntry[] = [];
   207	
   208	    if (args.loopType === 'research') {
   209	      evaluateResearchConvergence(
   210	        signals as ResearchConvergenceSignals,
   211	        ns,
   212	        blockers,
   213	        trace,
   214	      );
   215	    } else {
   216	      evaluateReviewConvergence(
   217	        signals as ReviewConvergenceSignals,
   218	        ns,
   219	        blockers,
   220	        trace,

exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs; do echo "FILE: $f"; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
FILE: .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Advisory Promotion Gate (T007)
     5	// ---------------------------------------------------------------
     6	// Evaluates candidates against baseline and produces advisory-only
     7	// promotion reports. NEVER auto-promotes. Production promotion is
     8	// blocked until Phase 1 replay fixtures AND Phase 3 behavioral
     9	// suites exist (REQ-006).
    10	// ---------------------------------------------------------------
    11	
    12	const fs = require('fs');
    13	const path = require('path');
    14	
    15	/* ---------------------------------------------------------------
    16	   1. CONSTANTS
    17	----------------------------------------------------------------*/
    18	
    19	/**
    20	 * Prerequisite checks for production promotion.
    21	 * All must pass before promotion graduates beyond advisory.
    22	 * @type {ReadonlyArray<string>}
    23	 */
    24	const PROMOTION_PREREQUISITES = Object.freeze([
    25	  'replayFixturesExist',
    26	  'behavioralSuitesExist',
    27	]);
    28	
    29	/**
    30	 * Promotion decision enum values.
    31	 * @type {Readonly<Record<string, string>>}
    32	 */
    33	const PROMOTION_DECISIONS = Object.freeze({
    34	  ADVISORY_ACCEPT: 'advisory-accept',
    35	  ADVISORY_REJECT: 'advisory-reject',
    36	  BLOCKED: 'blocked',
    37	});
    38	
    39	const PROMOTION_AUDIT_DIR = path.resolve(__dirname, 'audit', 'promotion-reports');
    40	
    41	function isPathWithin(candidatePath, rootPath) {
    42	  const relative = path.relative(rootPath, candidatePath);
    43	  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
    44	}
    45	
    46	function ensureCanonicalDirectory(dirPath, label) {
    47	  fs.mkdirSync(dirPath, { recursive: true });
    48	  const resolvedPath = path.resolve(dirPath);
    49	  const realPath = fs.realpathSync(dirPath);
    50	
    51	  if (path.normalize(realPath) !== path.normalize(resolvedPath)) {
    52	    throw new Error(`${label} must not traverse symlinks`);
    53	  }
    54	
    55	  return realPath;
    56	}
    57	
    58	function resolvePromotionAuditPath(outputPath) {
    59	  const auditRoot = ensureCanonicalDirectory(PROMOTION_AUDIT_DIR, 'Promotion audit directory');
    60	  const candidatePath = path.isAbsolute(outputPath)
    61	    ? path.resolve(outputPath)
    62	    : path.resolve(auditRoot, outputPath);
    63	
    64	  if (!isPathWithin(candidatePath, auditRoot)) {
    65	    throw new Error(`Promotion reports must be saved under ${auditRoot}`);
    66	  }
    67	
    68	  const parentDir = ensureCanonicalDirectory(path.dirname(candidatePath), 'Promotion audit parent directory');
    69	  if (!isPathWithin(parentDir, auditRoot)) {
    70	    throw new Error(`Promotion report parent directory must stay under ${auditRoot}`);
    71	  }
    72	
    73	  if (fs.existsSync(candidatePath) && fs.lstatSync(candidatePath).isSymbolicLink()) {
    74	    throw new Error('Promotion report output path must not be a symlink');
    75	  }
    76	
    77	  return candidatePath;
    78	}
    79	
    80	/* ---------------------------------------------------------------
    81	   2. PREREQUISITE CHECKING
    82	----------------------------------------------------------------*/
    83	
    84	/**
    85	 * Check whether production promotion prerequisites exist.
    86	 * Until both replay fixtures and behavioral suites exist,
    87	 * promotion is advisory-only.
    88	 *
    89	 * @param {object} [context={}] - Context for checking prerequisites.
    90	 * @param {boolean} [context.replayFixturesExist=false] - Whether Phase 1 replay fixtures exist.
    91	 * @param {boolean} [context.behavioralSuitesExist=false] - Whether Phase 3 behavioral suites exist.
    92	 * @returns {{ allMet: boolean; results: Record<string, boolean>; missing: string[] }}
    93	 */
    94	function checkPrerequisites(context) {
    95	  const ctx = context || {};
    96	
    97	  const results = {
    98	    replayFixturesExist: !!ctx.replayFixturesExist,
    99	    behavioralSuitesExist: !!ctx.behavioralSuitesExist,
   100	  };
   101	
   102	  const missing = PROMOTION_PREREQUISITES.filter((p) => !results[p]);
   103	  const allMet = missing.length === 0;
   104	
   105	  return { allMet, results, missing };
   106	}
   107	
   108	/* ---------------------------------------------------------------
   109	   3. MANIFEST BOUNDARY CHECKING
   110	----------------------------------------------------------------*/
   111	
   112	/**
   113	 * Check whether a candidate config only touches tunable fields
   114	 * (not locked contract fields), and validate value types and ranges
   115	 * against the manifest definitions.
   116	 *
   117	 * @param {object} candidate - The candidate config.
   118	 * @param {object} manifest - The optimizer manifest.
   119	 * @returns {{ valid: boolean; violations: string[] }}
   120	 */
   121	function checkManifestBoundary(candidate, manifest) {
   122	  if (!candidate || typeof candidate !== 'object' || !manifest || typeof manifest !== 'object') {
   123	    return { valid: false, violations: ['Candidate and manifest objects are required'] };
   124	  }
   125	  const violations = [];
   126	  const tunableFieldMap = new Map();
   127	  for (const f of manifest.tunableFields || []) {
   128	    const name = f.name || f;
   129	    tunableFieldMap.set(name, f);
   130	  }
   131	  const lockedFields = new Set(
   132	    (manifest.lockedFields || []).map((f) => f.name || f),
   133	  );
   134	
   135	  for (const [field, value] of Object.entries(candidate)) {
   136	    if (lockedFields.has(field)) {
   137	      violations.push(`Field "${field}" is a locked contract field and cannot be modified by the optimizer`);
   138	    } else if (!tunableFieldMap.has(field)) {
   139	      violations.push(`Field "${field}" is not listed as tunable in the optimizer manifest`);
   140	    } else {
   141	      // Validate type and range against manifest definition
   142	      const def = tunableFieldMap.get(field);
   143	      if (def && typeof def === 'object') {
   144	        // Type validation
   145	        if (def.type === 'number' || def.type === 'integer') {
   146	          if (typeof value !== 'number') {
   147	            violations.push(`Field "${field}" must be a ${def.type}, got ${typeof value}`);
   148	          } else if (def.type === 'integer' && !Number.isInteger(value)) {
   149	            violations.push(`Field "${field}" must be an integer, got ${value}`);
   150	          }
   151	        }
   152	        // Range validation
   153	        if (def.range && typeof value === 'number') {
   154	          if (def.range.min !== undefined && value < def.range.min) {
   155	            violations.push(`Field "${field}" value ${value} is below manifest minimum ${def.range.min}`);
   156	          }
   157	          if (def.range.max !== undefined && value > def.range.max) {
   158	            violations.push(`Field "${field}" value ${value} is above manifest maximum ${def.range.max}`);
   159	          }
   160	        }
   161	      }
   162	    }
   163	  }
   164	
   165	  return {
   166	    valid: violations.length === 0,
   167	    violations,
   168	  };
   169	}
   170	
   171	/* ---------------------------------------------------------------
   172	   4. CANDIDATE EVALUATION
   173	----------------------------------------------------------------*/
   174	
   175	/**
   176	 * Evaluate a candidate against the baseline score.
   177	 *
   178	 * @param {object} candidate - The candidate config + score.
   179	 * @param {object} candidate.config - The config values.
   180	 * @param {object} candidate.score - The rubric score result.
   181	 * @param {object} baselineScore - The baseline rubric score result.
   182	 * @param {object} [options={}] - Additional options.
   183	 * @param {object} options.manifest - Optimizer manifest for boundary checking.
   184	 * @returns {{ decision: string; improved: boolean; regressions: string[]; improvements: string[]; manifestCheck: object|null; prerequisiteCheck: object; advisoryOnly: boolean }}
   185	 */
   186	function evaluateCandidate(candidate, baselineScore, options) {
   187	  if (!candidate || typeof candidate !== 'object' || !candidate.score || !baselineScore || typeof baselineScore !== 'object') {
   188	    return {
   189	      decision: PROMOTION_DECISIONS.BLOCKED,
   190	      improved: false,
   191	      regressions: ['Candidate and baselineScore are required'],
   192	      improvements: [],
   193	      manifestCheck: null,
   194	      prerequisiteCheck: checkPrerequisites(),
   195	      advisoryOnly: true,
   196	    };
   197	  }
   198	  const opts = options || {};
   199	
   200	  // Always check prerequisites
   201	  const prerequisiteCheck = checkPrerequisites(opts.prerequisites || {});
   202	  // Manifest governance: promotionMode is advisory-only and autoPromotionAllowed is false.
   203	  // advisoryOnly is ALWAYS true regardless of prerequisite state.
   204	  const advisoryOnly = true;
   205	
   206	  let manifestCheck;
   207	  if (!opts.manifest || typeof opts.manifest !== 'object') {
   208	    manifestCheck = {
   209	      valid: false,
   210	      violations: ['Canonical optimizer manifest is required'],
   211	    };
   212	  } else {
   213	    manifestCheck = checkManifestBoundary(candidate.config, opts.manifest);
   214	  }
   215	  if (!manifestCheck.valid) {
   216	    return {
   217	      decision: PROMOTION_DECISIONS.BLOCKED,
   218	      improved: false,
   219	      regressions: manifestCheck.violations,
   220	      improvements: [],
   221	      manifestCheck,
   222	      prerequisiteCheck,
   223	      advisoryOnly: true,
   224	    };
   225	  }
   226	
   227	  // Compare scores
   228	  const improvements = [];
   229	  const regressions = [];
   230	
   231	  const candidateComposite = candidate.score.composite;
   232	  const baselineComposite = baselineScore.composite;
   233	
   234	  if (candidateComposite > baselineComposite) {
   235	    improvements.push(
   236	      `Composite score improved: ${baselineComposite.toFixed(3)} -> ${candidateComposite.toFixed(3)}`,
   237	    );
   238	  } else if (candidateComposite < baselineComposite) {
   239	    regressions.push(
   240	      `Composite score regressed: ${baselineComposite.toFixed(3)} -> ${candidateComposite.toFixed(3)}`,
   241	    );
   242	  }
   243	
   244	  // Per-dimension comparison
   245	  if (candidate.score.perDimension && baselineScore.perDimension) {
   246	    for (const [name, candidateDim] of Object.entries(candidate.score.perDimension)) {
   247	      const baselineDim = baselineScore.perDimension[name];
   248	      if (!baselineDim || !baselineDim.available || !candidateDim.available) continue;
   249	
   250	      if (candidateDim.score < baselineDim.score - 0.01) {
   251	        regressions.push(
   252	          `${name} regressed: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   253	        );
   254	      } else if (candidateDim.score > baselineDim.score + 0.01) {
   255	        improvements.push(
   256	          `${name} improved: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   257	        );
   258	      }
   259	    }
   260	  }
FILE: .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Random Search Optimizer (T004 + T005)
     5	// ---------------------------------------------------------------
     6	// Searches bounded deterministic numeric config space via random
     7	// sampling. Records an audit trail for ALL candidates, both
     8	// accepted and rejected (REQ-007, REQ-008).
     9	// ---------------------------------------------------------------
    10	
    11	const fs = require('fs');
    12	const path = require('path');
    13	
    14	const { replayRun } = require('./replay-runner.cjs');
    15	const { scoreRun } = require('./rubric.cjs');
    16	
    17	/* ---------------------------------------------------------------
    18	   1. CONSTANTS
    19	----------------------------------------------------------------*/
    20	
    21	/**
    22	 * Step sizes for the manifest-declared tunable search space.
    23	 * @type {Readonly<Record<string, number>>}
    24	 */
    25	const SEARCH_STEP_OVERRIDES = Object.freeze({
    26	  convergenceThreshold: 0.01,
    27	  stuckThreshold: 1,
    28	  noProgressThreshold: 0.01,
    29	  compositeStopScore: 0.05,
    30	  maxIterations: 1,
    31	});
    32	
    33	const CANONICAL_MANIFEST_PATH = path.join(__dirname, 'optimizer-manifest.json');
    34	
    35	function loadCanonicalManifest() {
    36	  return JSON.parse(fs.readFileSync(CANONICAL_MANIFEST_PATH, 'utf8'));
    37	}
    38	
    39	function deriveParamSpaceFromManifest(manifest) {
    40	  if (!manifest || typeof manifest !== 'object') {
    41	    throw new Error('Canonical optimizer manifest is required');
    42	  }
    43	
    44	  const paramSpace = {};
    45	  for (const field of manifest.tunableFields || []) {
    46	    const name = field && typeof field === 'object' ? field.name : null;
    47	    if (!name) continue;
    48	
    49	    const range = field.range;
    50	    const type = field.type;
    51	    if (!range || typeof range.min !== 'number' || typeof range.max !== 'number') {
    52	      continue;
    53	    }
    54	    if (type !== 'number' && type !== 'integer') {
    55	      continue;
    56	    }
    57	
    58	    const step = SEARCH_STEP_OVERRIDES[name];
    59	    if (typeof step !== 'number' || !Number.isFinite(step) || step <= 0) {
    60	      throw new Error(`Tunable field "${name}" is missing a canonical search step`);
    61	    }
    62	
    63	    paramSpace[name] = {
    64	      min: range.min,
    65	      max: range.max,
    66	      step,
    67	    };
    68	  }
    69	
    70	  return paramSpace;
    71	}
    72	
    73	function validateParamSpaceAgainstManifest(paramSpace, manifest) {
    74	  if (!paramSpace || typeof paramSpace !== 'object') {
    75	    return { valid: false, violations: ['Parameter space must be an object'] };
    76	  }
    77	  if (!manifest || typeof manifest !== 'object') {
    78	    return { valid: false, violations: ['Canonical optimizer manifest is required'] };
    79	  }
    80	
    81	  const violations = [];
    82	  const tunableFields = new Map();
    83	  for (const field of manifest.tunableFields || []) {
    84	    if (field && typeof field === 'object' && field.name) {
    85	      tunableFields.set(field.name, field);
    86	    }
    87	  }
    88	
    89	  const lockedFields = new Set(
    90	    (manifest.lockedFields || [])
    91	      .map((field) => (field && typeof field === 'object' ? field.name : null))
    92	      .filter(Boolean),
    93	  );
    94	
    95	  for (const [name, bounds] of Object.entries(paramSpace)) {
    96	    if (lockedFields.has(name)) {
    97	      violations.push(`Field "${name}" is locked and cannot be searched`);
    98	      continue;
    99	    }
   100	
   101	    const manifestField = tunableFields.get(name);
   102	    if (!manifestField) {
   103	      violations.push(`Field "${name}" is not declared tunable in the canonical manifest`);
   104	      continue;
   105	    }
   106	
   107	    if (!bounds || typeof bounds !== 'object') {
   108	      violations.push(`Field "${name}" must define min/max/step bounds`);
   109	      continue;
   110	    }
   111	
   112	    const { min, max, step } = bounds;
   113	    if (typeof min !== 'number' || typeof max !== 'number' || typeof step !== 'number') {
   114	      violations.push(`Field "${name}" must use numeric min/max/step bounds`);
   115	      continue;
   116	    }
   117	    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || step <= 0) {
   118	      violations.push(`Field "${name}" must use finite bounds and a positive step`);
   119	      continue;
   120	    }
   121	
   122	    const manifestRange = manifestField.range || {};
   123	    if (typeof manifestRange.min === 'number' && min < manifestRange.min) {
   124	      violations.push(`Field "${name}" minimum ${min} is below manifest minimum ${manifestRange.min}`);
   125	    }
   126	    if (typeof manifestRange.max === 'number' && max > manifestRange.max) {
   127	      violations.push(`Field "${name}" maximum ${max} exceeds manifest maximum ${manifestRange.max}`);
   128	    }
   129	    if (min > max) {
   130	      violations.push(`Field "${name}" has min ${min} greater than max ${max}`);
   131	    }
   132	    if (manifestField.type === 'integer' && (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(step))) {
   133	      violations.push(`Field "${name}" requires integer min/max/step bounds`);
   134	    }
   135	  }
   136	
   137	  return {
   138	    valid: violations.length === 0,
   139	    violations,
   140	  };
   141	}
   142	
   143	const CANONICAL_MANIFEST = loadCanonicalManifest();
   144	
   145	/**
   146	 * Default parameter space for numeric thresholds.
   147	 * Each entry defines min, max, and step for a tunable field.
   148	 * @type {Readonly<Record<string, { min: number; max: number; step: number }>>}
   149	 */
   150	const DEFAULT_PARAM_SPACE = Object.freeze(deriveParamSpaceFromManifest(CANONICAL_MANIFEST));
   151	
   152	/* ---------------------------------------------------------------
   153	   2. PARAMETER SAMPLING
   154	----------------------------------------------------------------*/
   155	
   156	/**
   157	 * Deterministic pseudo-random number generator (mulberry32).
   158	 * Produces repeatable sequences given the same seed.
   159	 *
   160	 * @param {number} seed
   161	 * @returns {() => number} A function that returns the next random value in [0, 1).
   162	 */
   163	function createRNG(seed) {
   164	  if (typeof seed !== 'number' || !Number.isFinite(seed)) seed = 42;
   165	  let state = seed | 0;
   166	  return function () {
   167	    state = (state + 0x6D2B79F5) | 0;
   168	    let t = Math.imul(state ^ (state >>> 15), 1 | state);
   169	    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
   170	    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   171	  };
   172	}
   173	
   174	/**
   175	 * Sample a random config from the parameter space.
   176	 *
   177	 * @param {Record<string, { min: number; max: number; step: number }>} paramSpace
   178	 * @param {() => number} rng - Random number generator.
   179	 * @returns {Record<string, number>}
   180	 */
   181	function sampleConfig(paramSpace, rng) {
   182	  if (!paramSpace || typeof paramSpace !== 'object' || typeof rng !== 'function') return {};
   183	  const config = {};
   184	
   185	  for (const [name, bounds] of Object.entries(paramSpace)) {
   186	    const range = bounds.max - bounds.min;
   187	    const steps = Math.round(range / bounds.step);
   188	    const stepIndex = Math.floor(rng() * (steps + 1));
   189	    const value = bounds.min + stepIndex * bounds.step;
   190	
   191	    // Round to avoid floating point drift
   192	    const decimals = countDecimals(bounds.step);
   193	    config[name] = Number(value.toFixed(decimals));
   194	  }
   195	
   196	  return config;
   197	}
   198	
   199	/**
   200	 * Count decimal places in a number.
   201	 * @param {number} n
   202	 * @returns {number}
   203	 */
   204	function countDecimals(n) {
   205	  if (typeof n !== 'number' || !Number.isFinite(n)) return 0;
   206	  const str = n.toString();
   207	  const dotIndex = str.indexOf('.');
   208	  return dotIndex < 0 ? 0 : str.length - dotIndex - 1;
   209	}
   210	
   211	/* ---------------------------------------------------------------
   212	   3. AUDIT TRAIL
   213	----------------------------------------------------------------*/
   214	
   215	/**
   216	 * Record a candidate to the audit trail.
   217	 *
   218	 * @param {object} candidate - The candidate config.
   219	 * @param {object} score - The rubric score result.
   220	 * @param {boolean} accepted - Whether the candidate was accepted.
   221	 * @param {object} [comparison] - Optional comparison details.
   222	 * @param {object} [options] - Additional options.
   223	 * @param {string} [options.timestamp] - Override timestamp for deterministic replay. Defaults to current time.
   224	 * @returns {object} An audit record.
   225	 */
   226	function recordCandidate(candidate, score, accepted, comparison, options) {
   227	  if (!score || typeof score !== 'object') {
   228	    score = { composite: 0, perDimension: {}, unavailableDimensions: [] };
   229	  }
   230	  const opts = options || {};
   231	  return {
   232	    timestamp: opts.timestamp || new Date().toISOString(),
   233	    candidate,
   234	    score: {
   235	      composite: score.composite,
   236	      perDimension: score.perDimension,
   237	      unavailableDimensions: score.unavailableDimensions,
   238	    },
   239	    accepted,
   240	    comparison: comparison || null,
   241	    reason: accepted
   242	      ? 'Candidate improved composite score without regressions'
   243	      : comparison && comparison.regressions && comparison.regressions.length > 0
   244	        ? `Rejected: ${comparison.regressions.join('; ')}`
   245	        : 'Rejected: no improvement over baseline',
   246	  };
   247	}
   248	
   249	/* ---------------------------------------------------------------
   250	   4. RANDOM SEARCH
   251	----------------------------------------------------------------*/
   252	
   253	/**
   254	 * Run random search over the config space, evaluating each
   255	 * candidate against the corpus using replay and rubric scoring.
   256	 *
   257	 * @param {object[]} corpus - Array of corpus entries.
   258	 * @param {object} rubric - A rubric from defineRubric().
   259	 * @param {Record<string, { min: number; max: number; step: number }>} [paramSpace] - Parameter space definition.
   260	 * @param {number} [iterations=20] - Number of random candidates to try.
FILE: .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Replay Corpus Builder (T001)
     5	// ---------------------------------------------------------------
     6	// Extracts replay corpus from packet JSONL data for offline
     7	// loop optimization. Packet family 040 is REQUIRED. 028 is an
     8	// optional holdout. 042 is excluded until traces exist.
     9	// ---------------------------------------------------------------
    10	
    11	const fs = require('fs');
    12	const path = require('path');
    13	
    14	/* ---------------------------------------------------------------
    15	   1. CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	/**
    19	 * Supported packet families and their corpus roles.
    20	 * @type {Readonly<Record<string, { role: string; required: boolean; compatibilityGrade: string }>>}
    21	 */
    22	const PACKET_FAMILIES = Object.freeze({
    23	  '040': { role: 'primary', required: true, compatibilityGrade: 'full' },
    24	  '028': { role: 'holdout', required: false, compatibilityGrade: 'legacy' },
    25	  '042': { role: 'excluded', required: false, compatibilityGrade: 'none' },
    26	});
    27	
    28	/**
    29	 * Required fields for a valid corpus entry.
    30	 * @type {ReadonlyArray<string>}
    31	 */
    32	const REQUIRED_ENTRY_FIELDS = Object.freeze([
    33	  'id',
    34	  'packetFamily',
    35	  'sourceRun',
    36	  'config',
    37	  'iterations',
    38	  'stopOutcome',
    39	]);
    40	
    41	/**
    42	 * JSONL record types that carry iteration data.
    43	 * @type {ReadonlySet<string>}
    44	 */
    45	const ITERATION_TYPES = new Set(['iteration']);
    46	
    47	/**
    48	 * JSONL record types that carry stop/event data.
    49	 * @type {ReadonlySet<string>}
    50	 */
    51	const EVENT_TYPES = new Set(['event']);
    52	
    53	const REPO_ROOT = path.resolve(__dirname, '../../../../..');
    54	const APPROVED_CORPUS_ROOTS = Object.freeze([
    55	  path.join(REPO_ROOT, '.opencode', 'specs'),
    56	  path.join(REPO_ROOT, 'specs'),
    57	  path.resolve(__dirname, '../tests/fixtures/deep-loop-replay'),
    58	]);
    59	
    60	function isPathWithin(candidatePath, rootPath) {
    61	  const relative = path.relative(rootPath, candidatePath);
    62	  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
    63	}
    64	
    65	function getApprovedCorpusRoots() {
    66	  return APPROVED_CORPUS_ROOTS
    67	    .filter((rootPath) => fs.existsSync(rootPath))
    68	    .map((rootPath) => fs.realpathSync(rootPath));
    69	}
    70	
    71	function resolveApprovedCorpusPath(rawPath, label, expectedType) {
    72	  const candidatePath = path.resolve(rawPath);
    73	
    74	  if (!fs.existsSync(candidatePath)) {
    75	    throw new Error(`${label} does not exist: ${rawPath}`);
    76	  }
    77	
    78	  const stats = fs.lstatSync(candidatePath);
    79	  if (stats.isSymbolicLink()) {
    80	    throw new Error(`${label} must not be a symlink: ${rawPath}`);
    81	  }
    82	
    83	  const realPath = fs.realpathSync(candidatePath);
    84	
    85	  if (expectedType === 'dir' && !stats.isDirectory()) {
    86	    throw new Error(`${label} must be a directory: ${rawPath}`);
    87	  }
    88	  if (expectedType === 'file' && !stats.isFile()) {
    89	    throw new Error(`${label} must be a file: ${rawPath}`);
    90	  }
    91	
    92	  const approvedRoots = getApprovedCorpusRoots();
    93	  if (!approvedRoots.some((rootPath) => isPathWithin(realPath, rootPath))) {
    94	    throw new Error(`${label} must resolve under an approved corpus root`);
    95	  }
    96	
    97	  return realPath;
    98	}
    99	
   100	function findLastRecord(records, predicate) {
   101	  if (!Array.isArray(records)) return null;
   102	  for (let index = records.length - 1; index >= 0; index--) {
   103	    const record = records[index];
   104	    if (predicate(record)) return record;
   105	  }
   106	  return null;
   107	}
   108	
   109	function getFiniteMetric(value) {
   110	  return typeof value === 'number' && Number.isFinite(value) ? value : null;
   111	}
   112	
   113	function pickFiniteMetric(candidates) {
   114	  for (const candidate of candidates) {
   115	    const metric = getFiniteMetric(candidate);
   116	    if (metric !== null) return metric;
   117	  }
   118	  return null;
   119	}
   120	
   121	function extractReplayMetrics(iterations, events, stopEvent) {
   122	  const latestIterationWithSignals = findLastRecord(
   123	    iterations,
   124	    (iteration) => iteration && iteration.convergenceSignals && typeof iteration.convergenceSignals === 'object',
   125	  );
   126	  const latestSignals = latestIterationWithSignals && latestIterationWithSignals.convergenceSignals
   127	    ? latestIterationWithSignals.convergenceSignals
   128	    : {};
   129	  const latestGraphEvent = findLastRecord(
   130	    events,
   131	    (eventRecord) => eventRecord && eventRecord.event === 'graph_convergence',
   132	  );
   133	
   134	  const graphConvergence = pickFiniteMetric([
   135	    latestGraphEvent && latestGraphEvent.score,
   136	    latestGraphEvent && latestGraphEvent.signals && latestGraphEvent.signals.score,
   137	    latestGraphEvent && latestGraphEvent.signals && latestGraphEvent.signals.blendedScore,
   138	    latestSignals.graphConvergence,
   139	  ]);
   140	  const convergenceScore = pickFiniteMetric([
   141	    latestSignals.compositeStop,
   142	    stopEvent && stopEvent.legalStop && stopEvent.legalStop.replayInputs && stopEvent.legalStop.replayInputs.stopScore,
   143	  ]);
   144	
   145	  return {
   146	    graphMetrics: graphConvergence === null ? null : { graphConvergence },
   147	    waveMetrics: convergenceScore === null ? null : { convergenceScore },
   148	  };
   149	}
   150	
   151	/* ---------------------------------------------------------------
   152	   2. CORPUS ENTRY SCHEMA
   153	----------------------------------------------------------------*/
   154	
   155	/**
   156	 * Validate a single corpus entry against the expected schema.
   157	 *
   158	 * @param {object} entry - The corpus entry to validate.
   159	 * @returns {{ valid: boolean; errors: string[] }}
   160	 */
   161	function validateCorpusEntry(entry) {
   162	  const errors = [];
   163	
   164	  if (!entry || typeof entry !== 'object') {
   165	    return { valid: false, errors: ['Entry must be a non-null object'] };
   166	  }
   167	
   168	  for (const field of REQUIRED_ENTRY_FIELDS) {
   169	    if (entry[field] === undefined || entry[field] === null) {
   170	      errors.push(`Missing required field: ${field}`);
   171	    }
   172	  }
   173	
   174	  if (entry.packetFamily && !PACKET_FAMILIES[entry.packetFamily]) {
   175	    errors.push(`Unknown packet family: ${entry.packetFamily}`);
   176	  }
   177	
   178	  if (entry.packetFamily === '042') {
   179	    errors.push('Packet family 042 is excluded until implementation traces exist');
   180	  }
   181	
   182	  if (entry.iterations && !Array.isArray(entry.iterations)) {
   183	    errors.push('iterations must be an array');
   184	  }
   185	
   186	  if (entry.iterations && Array.isArray(entry.iterations) && entry.iterations.length === 0) {
   187	    errors.push('iterations must not be empty');
   188	  }
   189	
   190	  if (entry.config && typeof entry.config !== 'object') {
   191	    errors.push('config must be an object');
   192	  }
   193	
   194	  if (entry.stopOutcome && typeof entry.stopOutcome !== 'object') {
   195	    errors.push('stopOutcome must be an object');
   196	  }
   197	
   198	  if (entry.graphMetrics !== undefined && entry.graphMetrics !== null && typeof entry.graphMetrics !== 'object') {
   199	    errors.push('graphMetrics must be an object when provided');
   200	  }
   201	
   202	  if (entry.waveMetrics !== undefined && entry.waveMetrics !== null && typeof entry.waveMetrics !== 'object') {
   203	    errors.push('waveMetrics must be an object when provided');
   204	  }
   205	
   206	  return { valid: errors.length === 0, errors };
   207	}
   208	
   209	/* ---------------------------------------------------------------
   210	   3. JSONL PARSING
   211	----------------------------------------------------------------*/
   212	
   213	/**
   214	 * Parse JSONL content into an array of records.
   215	 * Tracks skipped/malformed lines for diagnostics.
   216	 *
   217	 * @param {string} content - Raw JSONL string.
   218	 * @returns {{ records: object[]; skippedLines: Array<{ lineNumber: number; content: string; error: string }>; totalLines: number }} Parsed records with skip metadata.
   219	 */
   220	function parseJSONL(content) {
   221	  const lines = content.trim().split('\n');
   222	  const records = [];
   223	  const skippedLines = [];
   224	  let nonBlankCount = 0;
   225	
   226	  for (let i = 0; i < lines.length; i++) {
   227	    const trimmed = lines[i].trim();
   228	    if (!trimmed) continue;
   229	    nonBlankCount++;
   230	    try {
   231	      records.push(JSON.parse(trimmed));
   232	    } catch (err) {
   233	      skippedLines.push({
   234	        lineNumber: i + 1,
   235	        content: trimmed.length > 200 ? trimmed.slice(0, 200) + '...' : trimmed,
   236	        error: err instanceof Error ? err.message : String(err),
   237	      });
   238	    }
   239	  }
   240	
   241	  return { records, skippedLines, totalLines: nonBlankCount };
   242	}
   243	
   244	/* ---------------------------------------------------------------
   245	   4. CORPUS BUILDING
   246	----------------------------------------------------------------*/
   247	
   248	/**
   249	 * Extract a single corpus entry from a set of parsed JSONL records.
   250	 *
   251	 * @param {object[]} records - Parsed JSONL records from a single run.
   252	 * @param {string} packetFamily - The packet family identifier (e.g., '040').
   253	 * @param {string} sourceRunId - Identifier for the source run.
   254	 * @param {object} [options={}] - Extraction options.
   255	 * @param {string} [options.timestamp] - Override timestamp for deterministic replay. Defaults to current time.
   256	 * @returns {object} A corpus entry.
   257	 */
   258	function extractCorpusEntry(records, packetFamily, sourceRunId, options) {
   259	  const opts = options || {};
   260	  const extractedAt = opts.timestamp || new Date().toISOString();

codex
The first pass looks promising in a few places, but I still need the lower sections where the helper functions actually hit the database and the convergence/status handlers thread namespace through shared helpers. I’m drilling into those now so we don’t miss a partial fix hiding behind a safe-looking top-level signature.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	// 5. UNVERIFIED CLAIMS
   321	// ───────────────────────────────────────────────────────────────
   322	
   323	/**
   324	 * Find claim nodes whose metadata verification_status is not 'verified'.
   325	 * For research: CLAIM nodes with status != 'verified'.
   326	 * For review: FINDING nodes with no RESOLVES edges.
   327	 */
   328	export function findUnverifiedClaims(ns: Namespace): CoverageNode[] {
   329	  const d = getDb();
   330	  const { loopType } = ns;
   331	
   332	  if (loopType === 'research') {
   333	    // Schema note: coverage graph tables already include a real session_id
   334	    // column, so session-scoped reads can stay in SQL.
   335	    // Research: CLAIM nodes where metadata.verification_status != 'verified'
   336	    const nodeNamespace = buildNamespacePredicate('', ns);
   337	    const rows = d.prepare(`
   338	      SELECT * FROM coverage_nodes
   339	      WHERE ${nodeNamespace.clause}
   340	        AND kind = 'CLAIM'
   341	    `).all(...nodeNamespace.params) as Record<string, unknown>[];
   342	
   343	    return rows
   344	      .map(r => ({
   345	        id: r.id as string,
   346	        specFolder: r.spec_folder as string,
   347	        loopType: r.loop_type as string,
   348	        sessionId: r.session_id as string,
   349	        kind: r.kind as string,
   350	        name: r.name as string,
   351	        contentHash: r.content_hash as string | undefined,
   352	        iteration: r.iteration as number | undefined,
   353	        metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
   354	        createdAt: r.created_at as string | undefined,
   355	        updatedAt: r.updated_at as string | undefined,
   356	      }))
   357	      .filter(n => {
   358	        const status = n.metadata?.verification_status;
   359	        return status !== 'verified';
   360	      }) as CoverageNode[];
   361	  }
   362	
   363	  // Review: FINDING nodes with no RESOLVES incoming edge
   364	  const reviewNodeNamespace = buildNamespacePredicate('n', ns);
   365	  const reviewEdgeNamespace = buildNamespacePredicate('e', ns);
   366	  const rows = d.prepare(`
   367	    SELECT n.* FROM coverage_nodes n
   368	    WHERE ${reviewNodeNamespace.clause}
   369	      AND n.kind = 'FINDING'
   370	      AND NOT EXISTS (
   371	        SELECT 1 FROM coverage_edges e
   372	        WHERE ${reviewEdgeNamespace.clause}
   373	          AND e.target_id = n.id
   374	          AND e.relation = 'RESOLVES'
   375	      )
   376	  `).all(
   377	    ...reviewNodeNamespace.params,
   378	    ...reviewEdgeNamespace.params,
   379	  ) as Record<string, unknown>[];
   380	
   381	  return rows.map(r => ({
   382	    id: r.id as string,
   383	    specFolder: r.spec_folder as string,
   384	    loopType: r.loop_type as string,
   385	    sessionId: r.session_id as string,
   386	    kind: r.kind as string,
   387	    name: r.name as string,
   388	    contentHash: r.content_hash as string | undefined,
   389	    iteration: r.iteration as number | undefined,
   390	    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
   391	    createdAt: r.created_at as string | undefined,
   392	    updatedAt: r.updated_at as string | undefined,
   393	  })) as CoverageNode[];
   394	}
   395	
   396	// ───────────────────────────────────────────────────────────────
   397	// 6. HOT NODES
   398	// ───────────────────────────────────────────────────────────────
   399	
   400	/**
   401	 * Rank nodes by edge count + weight sum.
   402	 * Hot nodes are those with the most connections and highest total edge weight.
   403	 */
   404	export function rankHotNodes(ns: Namespace, limit: number = 10): HotNode[] {
   405	  const d = getDb();
   406	  const edgeNamespace = buildNamespacePredicate('e', ns);
   407	  const nodeNamespace = buildNamespacePredicate('n', ns);
   408	
   409	  const rows = d.prepare(`
   410	    WITH node_edges AS (
   411	      SELECT n.id, n.kind, n.name,
   412	        (
   413	          SELECT COUNT(*) FROM coverage_edges e
   414	          WHERE (e.source_id = n.id OR e.target_id = n.id)
   415	            AND ${edgeNamespace.clause}
   416	        ) AS edge_count,
   417	        (
   418	          SELECT COALESCE(SUM(e.weight), 0) FROM coverage_edges e
   419	          WHERE (e.source_id = n.id OR e.target_id = n.id)
   420	            AND ${edgeNamespace.clause}
   421	        ) AS weight_sum
   422	      FROM coverage_nodes n
   423	      WHERE ${nodeNamespace.clause}
   424	    )
   425	    SELECT id, kind, name, edge_count, weight_sum,
   426	      (edge_count * 1.0 + weight_sum * 0.5) AS score
   427	    FROM node_edges
   428	    WHERE edge_count > 0
   429	    ORDER BY score DESC
   430	    LIMIT ?
   431	  `).all(
   432	    ...edgeNamespace.params,
   433	    ...edgeNamespace.params,
   434	    ...nodeNamespace.params,
   435	    limit,
   436	  ) as Array<{
   437	    id: string;
   438	    kind: string;
   439	    name: string;
   440	    edge_count: number;
   441	    weight_sum: number;
   442	    score: number;
   443	  }>;
   444	
   445	  return rows.map(row => ({
   446	    nodeId: row.id,
   447	    kind: row.kind,
   448	    name: row.name,
   449	    edgeCount: row.edge_count,
   450	    weightSum: row.weight_sum,
   451	    score: row.score,
   452	  }));
   453	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts | sed -n '320,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	
   321	  for (const edge of edges) {
   322	    if (edge.relation === 'CONTRADICTS') contradictionCount++;
   323	  }
   324	
   325	  return contradictionCount / edges.length;
   326	}
   327	
   328	/**
   329	 * Canonical research source diversity: for each question, count distinct
   330	 * source metadata quality classes reachable through ANSWERS -> CITES paths,
   331	 * then average that count across all questions.
   332	 */
   333	export function computeResearchSourceDiversityFromData(
   334	  nodes: ReadonlyArray<ResearchSignalNodeLike>,
   335	  edges: ReadonlyArray<ResearchSignalEdgeLike>,
   336	): number {
   337	  const questionIds = nodes
   338	    .filter(node => node.kind === 'QUESTION')
   339	    .map(node => node.id);
   340	
   341	  if (questionIds.length === 0) return 0;
   342	
   343	  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
   344	  const citedSources = buildCitedSourcesByFinding(edges);
   345	  const sourceMetadataById = new Map<string, Record<string, unknown>>();
   346	
   347	  for (const node of nodes) {
   348	    if (node.kind !== 'SOURCE') continue;
   349	    const meta = parseNodeMetadata(node.metadata);
   350	    if (meta) sourceMetadataById.set(node.id, meta);
   351	  }
   352	
   353	  let totalDiversity = 0;
   354	
   355	  for (const questionId of questionIds) {
   356	    const qualityClasses = new Set<string>();
   357	
   358	    for (const findingId of answeringFindings.get(questionId) ?? []) {
   359	      for (const sourceId of citedSources.get(findingId) ?? []) {
   360	        const qualityClass = sourceMetadataById.get(sourceId)?.quality_class;
   361	        if (typeof qualityClass === 'string' && qualityClass.length > 0) {
   362	          qualityClasses.add(qualityClass);
   363	        }
   364	      }
   365	    }
   366	
   367	    totalDiversity += qualityClasses.size;
   368	  }
   369	
   370	  return totalDiversity / questionIds.length;
   371	}
   372	
   373	/**
   374	 * Canonical research evidence depth: average path length across all
   375	 * question -> finding paths, scoring 2 when the finding cites at least one
   376	 * source and 1 when it does not.
   377	 */
   378	export function computeResearchEvidenceDepthFromData(
   379	  nodes: ReadonlyArray<ResearchSignalNodeLike>,
   380	  edges: ReadonlyArray<ResearchSignalEdgeLike>,
   381	): number {
   382	  const questionIds = nodes
   383	    .filter(node => node.kind === 'QUESTION')
   384	    .map(node => node.id);
   385	
   386	  if (questionIds.length === 0) return 0;
   387	
   388	  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
   389	  const citedSources = buildCitedSourcesByFinding(edges);
   390	  let totalDepth = 0;
   391	  let pathCount = 0;
   392	
   393	  for (const questionId of questionIds) {
   394	    for (const findingId of answeringFindings.get(questionId) ?? []) {
   395	      totalDepth += (citedSources.get(findingId) ?? []).length > 0 ? 2 : 1;
   396	      pathCount++;
   397	    }
   398	  }
   399	
   400	  return pathCount > 0 ? totalDepth / pathCount : 0;
   401	}
   402	
   403	// ───────────────────────────────────────────────────────────────
   404	// 4. REVIEW CONVERGENCE SIGNALS
   405	// ───────────────────────────────────────────────────────────────
   406	
   407	/**
   408	 * Compute review convergence signals.
   409	 */
   410	export function computeReviewSignals(ns: Namespace): ReviewConvergenceSignals {
   411	  const d = getDb();
   412	  const nodeNamespace = buildNamespacePredicate('', ns);
   413	  const scopedNodeNamespace = buildNamespacePredicate('n', ns);
   414	  const edgeNamespace = buildNamespacePredicate('e', ns);
   415	  const bareEdgeNamespace = buildNamespacePredicate('', ns);
   416	
   417	  // dimensionCoverage: dimensions with >= 1 COVERS edge / all dimensions
   418	  const allDimensions = (d.prepare(
   419	    `SELECT COUNT(*) as c FROM coverage_nodes WHERE ${nodeNamespace.clause} AND kind = 'DIMENSION'`,
   420	  ).get(...nodeNamespace.params) as { c: number }).c;
   421	
   422	  const coveredDimensions = (d.prepare(`
   423	    SELECT COUNT(*) as c FROM coverage_nodes n
   424	    WHERE ${scopedNodeNamespace.clause} AND n.kind = 'DIMENSION'
   425	      AND EXISTS (
   426	        SELECT 1 FROM coverage_edges e
   427	        WHERE ${edgeNamespace.clause}
   428	          AND e.source_id = n.id
   429	          AND e.relation = 'COVERS'
   430	      )
   431	  `).get(...scopedNodeNamespace.params, ...edgeNamespace.params) as { c: number }).c;
   432	
   433	  const dimensionCoverage = allDimensions > 0 ? coveredDimensions / allDimensions : 0;
   434	
   435	  // findingStability: findings with 0 CONTRADICTS edges / all findings
   436	  const allFindings = (d.prepare(
   437	    `SELECT COUNT(*) as c FROM coverage_nodes WHERE ${nodeNamespace.clause} AND kind = 'FINDING'`,
   438	  ).get(...nodeNamespace.params) as { c: number }).c;
   439	
   440	  const stableFindings = (d.prepare(`
   441	    SELECT COUNT(*) as c FROM coverage_nodes n
   442	    WHERE ${scopedNodeNamespace.clause} AND n.kind = 'FINDING'
   443	      AND NOT EXISTS (
   444	        SELECT 1 FROM coverage_edges e
   445	        WHERE ${edgeNamespace.clause}
   446	          AND (e.source_id = n.id OR e.target_id = n.id)
   447	          AND e.relation = 'CONTRADICTS'
   448	      )
   449	  `).get(...scopedNodeNamespace.params, ...edgeNamespace.params) as { c: number }).c;
   450	
   451	  const findingStability = allFindings > 0 ? stableFindings / allFindings : 0;
   452	
   453	  // p0ResolutionRate: P0 findings with RESOLVES edge / P0 findings
   454	  const allP0 = d.prepare(`
   455	    SELECT id, metadata FROM coverage_nodes
   456	    WHERE ${nodeNamespace.clause} AND kind = 'FINDING'
   457	  `).all(...nodeNamespace.params) as Array<{ id: string; metadata: string | null }>;
   458	
   459	  let p0Count = 0;
   460	  let p0Resolved = 0;
   461	
   462	  for (const finding of allP0) {
   463	    if (finding.metadata) {
   464	      try {
   465	        const meta = JSON.parse(finding.metadata);
   466	        if (meta.severity === 'P0') {
   467	          p0Count++;
   468	          const hasResolve = (d.prepare(
   469	            `SELECT COUNT(*) as c FROM coverage_edges e WHERE ${edgeNamespace.clause} AND e.target_id = ? AND e.relation = 'RESOLVES'`,
   470	          ).get(...edgeNamespace.params, finding.id) as { c: number }).c;
   471	          if (hasResolve > 0) p0Resolved++;
   472	        }
   473	      } catch { /* skip */ }
   474	    }
   475	  }
   476	
   477	  const p0ResolutionRate = p0Count > 0 ? p0Resolved / p0Count : 1.0; // No P0s = fully resolved
   478	
   479	  // evidenceDensity: average EVIDENCE_FOR edges per finding
   480	  const totalEvidenceEdges = (d.prepare(
   481	    `SELECT COUNT(*) as c FROM coverage_edges WHERE ${bareEdgeNamespace.clause} AND relation = 'EVIDENCE_FOR'`,
   482	  ).get(...bareEdgeNamespace.params) as { c: number }).c;
   483	
   484	  const evidenceDensity = allFindings > 0 ? totalEvidenceEdges / allFindings : 0;
   485	
   486	  // hotspotSaturation: hotspot files with >= 2 dimension coverage / hotspot files
   487	  const hotspotSaturation = computeHotspotSaturation(d, ns);
   488	
   489	  return {
   490	    dimensionCoverage,
   491	    findingStability,
   492	    p0ResolutionRate,
   493	    evidenceDensity,
   494	    hotspotSaturation,
   495	  };
   496	}
   497	
   498	function computeHotspotSaturation(d: Database.Database, ns: Namespace): number {
   499	  const nodeNamespace = buildNamespacePredicate('', ns);
   500	  const edgeNamespace = buildNamespacePredicate('e', ns);
   501	  // Find FILE nodes with hotspot_score > 0 in metadata
   502	  const files = d.prepare(`
   503	    SELECT id, metadata FROM coverage_nodes
   504	    WHERE ${nodeNamespace.clause} AND kind = 'FILE'
   505	  `).all(...nodeNamespace.params) as Array<{ id: string; metadata: string | null }>;
   506	
   507	  const hotspotFiles: string[] = [];
   508	  for (const f of files) {
   509	    if (f.metadata) {
   510	      try {
   511	        const meta = JSON.parse(f.metadata);
   512	        if (meta.hotspot_score && meta.hotspot_score > 0) {
   513	          hotspotFiles.push(f.id);
   514	        }
   515	      } catch { /* skip */ }
   516	    }
   517	  }
   518	
   519	  if (hotspotFiles.length === 0) return 1.0; // No hotspots = fully saturated
   520	
   521	  let saturated = 0;
   522	  for (const fileId of hotspotFiles) {
   523	    // Count distinct dimensions that COVER this file
   524	    const dimCoverage = (d.prepare(`
   525	      SELECT COUNT(DISTINCT e.source_id) as c
   526	      FROM coverage_edges e
   527	      JOIN coverage_nodes n ON ${buildCompositeNodeJoin('n', 'e', 'source_id')}
   528	      WHERE ${edgeNamespace.clause}
   529	        AND e.target_id = ?
   530	        AND e.relation = 'COVERS'
   531	        AND n.kind = 'DIMENSION'
   532	    `).get(...edgeNamespace.params, fileId) as { c: number }).c;
   533	
   534	    if (dimCoverage >= 2) saturated++;
   535	  }
   536	
   537	  return hotspotFiles.length > 0 ? saturated / hotspotFiles.length : 1.0;
   538	}
   539	
   540	// ───────────────────────────────────────────────────────────────
   541	// 5. COMPOSITE SIGNAL COMPUTATION
   542	// ───────────────────────────────────────────────────────────────
   543	
   544	/**
   545	 * Compute all convergence signals for a namespace.
   546	 * Dispatches to research or review signal computation based on loop type.
   547	 */
   548	export function computeSignals(ns: Namespace): ConvergenceSignals {
   549	  if (ns.loopType === 'research') {
   550	    return computeResearchSignals(ns);
   551	  }
   552	  return computeReviewSignals(ns);
   553	}
   554	
   555	/**
   556	 * Create a signal snapshot for a given iteration.
   557	 * Persists convergence signals and node-level signals.
   558	 */
   559	export function createSignalSnapshot(ns: Namespace, iteration: number): SignalSnapshot {
   560	  const signals = computeSignals(ns);
   561	  const nodeSignals = computeNodeSignals(ns);
   562	  const stats = getStats(ns.specFolder, ns.loopType);
   563	
   564	  const snapshot: SignalSnapshot = {
   565	    iteration,
   566	    signals,
   567	    nodeSignals,
   568	    nodeCount: stats.totalNodes,
   569	    edgeCount: stats.totalEdges,
   570	  };
   571	
   572	  // Persist to database. CoverageSnapshot requires a concrete sessionId; the
   573	  // Namespace may still carry undefined in bootstrap/debug contexts, so fall
   574	  // back to a 'legacy' sentinel so pre-ADR-001 aggregations still persist
   575	  // without violating the type.
   576	  createSnapshot({
   577	    specFolder: ns.specFolder,
   578	    loopType: ns.loopType,
   579	    sessionId: ns.sessionId ?? 'legacy',
   580	    iteration,
   581	    metrics: {
   582	      ...signals,
   583	      nodeCount: stats.totalNodes,
   584	      edgeCount: stats.totalEdges,
   585	    },
   586	    nodeCount: stats.totalNodes,
   587	    edgeCount: stats.totalEdges,
   588	  });
   589	
   590	  return snapshot;
   591	}
   592	
   593	// ───────────────────────────────────────────────────────────────
   594	// 6. MOMENTUM (DELTA BETWEEN SNAPSHOTS)
   595	// ───────────────────────────────────────────────────────────────
   596	
   597	/**
   598	 * Compute momentum (change rate) between the latest and previous snapshots.
   599	 */
   600	export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
   601	  const d = getDb();
   602	  const snapshots = d.prepare(`
   603	    SELECT metrics FROM coverage_snapshots
   604	    WHERE spec_folder = ? AND loop_type = ?
   605	    ORDER BY iteration DESC LIMIT 2
   606	  `).all(specFolder, loopType) as Array<{ metrics: string }>;
   607	
   608	  if (snapshots.length < 2) return null;
   609	
   610	  const latest = JSON.parse(snapshots[0].metrics) as Record<string, number>;
   611	  const previous = JSON.parse(snapshots[1].metrics) as Record<string, number>;
   612	
   613	  const momentum: Record<string, number> = {};
   614	  for (const key of Object.keys(latest)) {
   615	    if (typeof latest[key] === 'number' && typeof previous[key] === 'number') {
   616	      momentum[key] = latest[key] - previous[key];
   617	    }
   618	  }
   619	
   620	  return momentum;

exec
/bin/zsh -lc 'rg -n "computeScoped|getEdgesByRelation|getEdgesForNode|SELECT .*coverage_edges|session_id|buildCompositeNodeJoin|buildNamespacePredicate" .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:166:    const stats = computeScopedStats(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:184:    const signals = computeScopedSignals(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:185:    const momentum = computeScopedMomentum(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:279:export function computeScopedStats(ns: Namespace): ScopedCoverageStats {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:303:function computeScopedResearchSignals(ns: Namespace): ResearchConvergenceSignals {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:316:function computeScopedReviewSignals(ns: Namespace): ReviewConvergenceSignals {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:372:export function computeScopedSignals(ns: Namespace): ConvergenceSignals {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:377:    ? computeScopedResearchSignals(ns)
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:378:    : computeScopedReviewSignals(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:381:export function computeScopedMomentum(ns: Namespace): Record<string, number> | null {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:78:function buildNamespacePredicate(alias: string, ns: Namespace): SqlFragment {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:84:    clauses.push(`${prefix}session_id = ?`);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:94:function buildCompositeNodeJoin(
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:101:      AND ${nodeAlias}.session_id = ${edgeAlias}.session_id
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:412:  const nodeNamespace = buildNamespacePredicate('', ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:413:  const scopedNodeNamespace = buildNamespacePredicate('n', ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:414:  const edgeNamespace = buildNamespacePredicate('e', ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:415:  const bareEdgeNamespace = buildNamespacePredicate('', ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:426:        SELECT 1 FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:444:        SELECT 1 FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:469:            `SELECT COUNT(*) as c FROM coverage_edges e WHERE ${edgeNamespace.clause} AND e.target_id = ? AND e.relation = 'RESOLVES'`,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:481:    `SELECT COUNT(*) as c FROM coverage_edges WHERE ${bareEdgeNamespace.clause} AND relation = 'EVIDENCE_FOR'`,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:499:  const nodeNamespace = buildNamespacePredicate('', ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:500:  const edgeNamespace = buildNamespacePredicate('e', ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:527:      JOIN coverage_nodes n ON ${buildCompositeNodeJoin('n', 'e', 'source_id')}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts | sed -n '220,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	        trace,
   221	      );
   222	    }
   223	
   224	    // Determine decision
   225	    const blockingBlockers = blockers.filter(b => b.severity === 'blocking');
   226	    let decision: ConvergenceDecision;
   227	
   228	    if (blockingBlockers.length > 0) {
   229	      decision = 'STOP_BLOCKED';
   230	    } else if (trace.every(t => t.passed)) {
   231	      decision = 'STOP_ALLOWED';
   232	    } else {
   233	      decision = 'CONTINUE';
   234	    }
   235	
   236	    const reason = buildDecisionReason(decision, blockingBlockers, trace);
   237	
   238	    // Phase 008 P1-01: emit a single canonical numeric score alongside the
   239	    // raw signals so reducer-owned `graphConvergenceScore` can consume it
   240	    // directly without fallback math.
   241	    const score = computeCompositeScore(signals, args.loopType);
   242	    const signalsWithScore = { ...signals, score };
   243	
   244	    return okResponse({
   245	      decision,
   246	      reason,
   247	      score,
   248	      signals: signalsWithScore,
   249	      blockers,
   250	      trace,
   251	      momentum,
   252	      namespace: buildNamespacePayload(ns),
   253	      scopeMode: 'session',
   254	      notes: ['Convergence signals were computed from the session-scoped subgraph only.'],
   255	      snapshotPersistence: args.persistSnapshot ? 'persisted' : 'not_requested',
   256	      nodeCount: stats.totalNodes,
   257	      edgeCount: stats.totalEdges,
   258	      lastIteration: stats.lastIteration,
   259	    });
   260	  } catch (err: unknown) {
   261	    return errorResponse(
   262	      `Convergence assessment failed: ${err instanceof Error ? err.message : String(err)}`,
   263	    );
   264	  }
   265	}
   266	
   267	function buildNamespacePayload(ns: Namespace): Record<string, unknown> {
   268	  return {
   269	    specFolder: ns.specFolder,
   270	    loopType: ns.loopType,
   271	    ...(ns.sessionId ? { sessionId: ns.sessionId } : {}),
   272	  };
   273	}
   274	
   275	function parseMetadata(metadata: CoverageNode['metadata']): Record<string, unknown> {
   276	  return metadata && typeof metadata === 'object' ? metadata : {};
   277	}
   278	
   279	export function computeScopedStats(ns: Namespace): ScopedCoverageStats {
   280	  const nodes = getNodes(ns);
   281	  const edges = getEdges(ns);
   282	  const snapshots = getSnapshots(ns.specFolder, ns.loopType, ns.sessionId);
   283	
   284	  const nodesByKind: Record<string, number> = {};
   285	  for (const node of nodes) {
   286	    nodesByKind[node.kind] = (nodesByKind[node.kind] ?? 0) + 1;
   287	  }
   288	
   289	  const edgesByRelation: Record<string, number> = {};
   290	  for (const edge of edges) {
   291	    edgesByRelation[edge.relation] = (edgesByRelation[edge.relation] ?? 0) + 1;
   292	  }
   293	
   294	  return {
   295	    totalNodes: nodes.length,
   296	    totalEdges: edges.length,
   297	    nodesByKind,
   298	    edgesByRelation,
   299	    lastIteration: snapshots.length > 0 ? snapshots[snapshots.length - 1].iteration : null,
   300	  };
   301	}
   302	
   303	function computeScopedResearchSignals(ns: Namespace): ResearchConvergenceSignals {
   304	  const nodes = getNodes(ns);
   305	  const edges = getEdges(ns);
   306	
   307	  return {
   308	    questionCoverage: computeResearchQuestionCoverageFromData(nodes, edges),
   309	    claimVerificationRate: computeResearchClaimVerificationRateFromData(nodes),
   310	    contradictionDensity: computeResearchContradictionDensityFromData(edges),
   311	    sourceDiversity: computeResearchSourceDiversityFromData(nodes, edges),
   312	    evidenceDepth: computeResearchEvidenceDepthFromData(nodes, edges),
   313	  };
   314	}
   315	
   316	function computeScopedReviewSignals(ns: Namespace): ReviewConvergenceSignals {
   317	  const nodes = getNodes(ns);
   318	  const edges = getEdges(ns);
   319	
   320	  const dimensionIds = new Set(nodes.filter(node => node.kind === 'DIMENSION').map(node => node.id));
   321	  const findingNodes = nodes.filter(node => node.kind === 'FINDING');
   322	  const fileNodes = nodes.filter(node => node.kind === 'FILE');
   323	
   324	  const coversEdges = edges.filter(edge => edge.relation === 'COVERS');
   325	  const contradictionEdges = edges.filter(edge => edge.relation === 'CONTRADICTS');
   326	  const evidenceEdges = edges.filter(edge => edge.relation === 'EVIDENCE_FOR');
   327	  const resolvesTargetIds = new Set(
   328	    edges.filter(edge => edge.relation === 'RESOLVES').map(edge => edge.targetId),
   329	  );
   330	
   331	  const coveredDimensionIds = new Set(
   332	    coversEdges.map(edge => edge.sourceId).filter(sourceId => dimensionIds.has(sourceId)),
   333	  );
   334	
   335	  const contradictionNodeIds = new Set<string>();
   336	  for (const edge of contradictionEdges) {
   337	    contradictionNodeIds.add(edge.sourceId);
   338	    contradictionNodeIds.add(edge.targetId);
   339	  }
   340	
   341	  const p0Findings = findingNodes.filter(node => parseMetadata(node.metadata).severity === 'P0');
   342	
   343	  const hotspotFiles = fileNodes.filter(node => {
   344	    const hotspotScore = parseMetadata(node.metadata).hotspot_score;
   345	    return typeof hotspotScore === 'number' && hotspotScore > 0;
   346	  });
   347	
   348	  let saturatedHotspots = 0;
   349	  for (const file of hotspotFiles) {
   350	    const coveringDimensions = new Set(
   351	      coversEdges
   352	        .filter(edge => edge.targetId === file.id)
   353	        .map(edge => edge.sourceId)
   354	        .filter(sourceId => dimensionIds.has(sourceId)),
   355	    );
   356	    if (coveringDimensions.size >= 2) saturatedHotspots++;
   357	  }
   358	
   359	  return {
   360	    dimensionCoverage: dimensionIds.size > 0 ? coveredDimensionIds.size / dimensionIds.size : 0,
   361	    findingStability: findingNodes.length > 0
   362	      ? findingNodes.filter(node => !contradictionNodeIds.has(node.id)).length / findingNodes.length
   363	      : 0,
   364	    p0ResolutionRate: p0Findings.length > 0
   365	      ? p0Findings.filter(node => resolvesTargetIds.has(node.id)).length / p0Findings.length
   366	      : 1,
   367	    evidenceDensity: findingNodes.length > 0 ? evidenceEdges.length / findingNodes.length : 0,
   368	    hotspotSaturation: hotspotFiles.length > 0 ? saturatedHotspots / hotspotFiles.length : 1,
   369	  };
   370	}
   371	
   372	export function computeScopedSignals(ns: Namespace): ConvergenceSignals {
   373	  if (!ns.sessionId) {
   374	    return computeSignals(ns);
   375	  }
   376	  return ns.loopType === 'research'
   377	    ? computeScopedResearchSignals(ns)
   378	    : computeScopedReviewSignals(ns);
   379	}
   380	
   381	export function computeScopedMomentum(ns: Namespace): Record<string, number> | null {
   382	  const snapshots = getSnapshots(ns.specFolder, ns.loopType, ns.sessionId);
   383	  if (snapshots.length < 2) return null;
   384	
   385	  const latest = snapshots[snapshots.length - 1]?.metrics ?? {};
   386	  const previous = snapshots[snapshots.length - 2]?.metrics ?? {};
   387	  const momentum: Record<string, number> = {};
   388	
   389	  for (const key of Object.keys(latest)) {
   390	    const latestValue = latest[key];
   391	    const previousValue = previous[key];
   392	    if (typeof latestValue === 'number' && typeof previousValue === 'number') {
   393	      momentum[key] = latestValue - previousValue;
   394	    }
   395	  }
   396	
   397	  return Object.keys(momentum).length > 0 ? momentum : null;
   398	}
   399	
   400	// ───────────────────────────────────────────────────────────────
   401	// 4. RESEARCH CONVERGENCE EVALUATION
   402	// ───────────────────────────────────────────────────────────────
   403	
   404	function evaluateResearchConvergence(
   405	  signals: ResearchConvergenceSignals,
   406	  ns: Namespace,
   407	  blockers: ConvergenceBlocker[],
   408	  trace: ConvergenceTraceEntry[],
   409	): void {
   410	  const t = RESEARCH_THRESHOLDS;
   411	
   412	  // Weighted signals
   413	  trace.push({
   414	    signal: 'questionCoverage',
   415	    value: signals.questionCoverage,
   416	    threshold: t.questionCoverage,
   417	    passed: signals.questionCoverage >= t.questionCoverage,
   418	    role: 'weighted',
   419	  });
   420	
   421	  trace.push({
   422	    signal: 'claimVerificationRate',
   423	    value: signals.claimVerificationRate,
   424	    threshold: t.claimVerificationRate,
   425	    passed: signals.claimVerificationRate >= t.claimVerificationRate,
   426	    role: 'weighted',
   427	  });
   428	
   429	  trace.push({
   430	    signal: 'contradictionDensity',
   431	    value: signals.contradictionDensity,
   432	    threshold: t.contradictionDensity,
   433	    passed: signals.contradictionDensity <= t.contradictionDensity,
   434	    role: 'weighted',
   435	  });
   436	
   437	  // Blocking guards
   438	  trace.push({
   439	    signal: 'sourceDiversity',
   440	    value: signals.sourceDiversity,
   441	    threshold: t.sourceDiversity,
   442	    passed: signals.sourceDiversity >= t.sourceDiversity,
   443	    role: 'blocking_guard',
   444	  });
   445	
   446	  trace.push({
   447	    signal: 'evidenceDepth',
   448	    value: signals.evidenceDepth,
   449	    threshold: t.evidenceDepth,
   450	    passed: signals.evidenceDepth >= t.evidenceDepth,
   451	    role: 'blocking_guard',
   452	  });
   453	
   454	  // Check blocking guards
   455	  if (signals.sourceDiversity < t.sourceDiversity) {
   456	    blockers.push({
   457	      type: 'source_diversity_guard',
   458	      description: `Source diversity (${signals.sourceDiversity.toFixed(2)}) is below the blocking threshold (${t.sourceDiversity}). STOP is blocked until diverse sources cover key questions.`,
   459	      count: 1,
   460	      severity: 'blocking',
   461	    });
   462	  }
   463	
   464	  if (signals.evidenceDepth < t.evidenceDepth) {
   465	    blockers.push({
   466	      type: 'evidence_depth_guard',
   467	      description: `Evidence depth (${signals.evidenceDepth.toFixed(2)}) is below the blocking threshold (${t.evidenceDepth}). STOP is blocked until question->finding->source chains are deeper.`,
   468	      count: 1,
   469	      severity: 'blocking',
   470	    });
   471	  }
   472	
   473	  // Check for uncovered questions as warnings
   474	  const gaps = findCoverageGaps(ns);
   475	  if (gaps.length > 0) {
   476	    blockers.push({
   477	      type: 'uncovered_questions',
   478	      description: `${gaps.length} question(s) have no coverage edges`,
   479	      count: gaps.length,
   480	      severity: signals.questionCoverage < t.questionCoverage ? 'blocking' : 'warning',
   481	    });
   482	  }
   483	
   484	  // Check for active contradictions
   485	  const contradictions = findContradictions(ns);
   486	  if (contradictions.length > 0 && signals.contradictionDensity > t.contradictionDensity) {
   487	    blockers.push({
   488	      type: 'high_contradiction_density',
   489	      description: `${contradictions.length} contradiction(s) detected with density above threshold`,
   490	      count: contradictions.length,
   491	      severity: 'blocking',
   492	    });
   493	  }
   494	
   495	  // Check for unverified claims
   496	  const unverified = findUnverifiedClaims(ns);
   497	  if (unverified.length > 0) {
   498	    blockers.push({
   499	      type: 'unverified_claims',
   500	      description: `${unverified.length} claim(s) remain unverified`,
   501	      count: unverified.length,
   502	      severity: signals.claimVerificationRate < t.claimVerificationRate ? 'blocking' : 'warning',
   503	    });
   504	  }
   505	}
   506	
   507	// ───────────────────────────────────────────────────────────────
   508	// 5. REVIEW CONVERGENCE EVALUATION
   509	// ───────────────────────────────────────────────────────────────
   510	
   511	function evaluateReviewConvergence(
   512	  signals: ReviewConvergenceSignals,
   513	  ns: Namespace,
   514	  blockers: ConvergenceBlocker[],
   515	  trace: ConvergenceTraceEntry[],
   516	): void {
   517	  const t = REVIEW_THRESHOLDS;
   518	
   519	  trace.push({
   520	    signal: 'dimensionCoverage',

codex
I’ve reached the point where the helper implementations matter more than the signatures. I’m checking the DB-layer contracts and the actual call sites in the optimizer scripts now, because a safe helper that never gets used would still leave the original finding effectively open.
exec
/bin/zsh -lc 'rg -n "resolveApprovedCorpusPath|APPROVED_CORPUS_ROOTS|REPO_ROOT|readFileSync|readdirSync|walk|jsonl|sourceDir|root" .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "function getNodes|function getEdges|function getSnapshots|function getStats|interface Namespace|type Namespace|sessionId" .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
53:const REPO_ROOT = path.resolve(__dirname, '../../../../..');
54:const APPROVED_CORPUS_ROOTS = Object.freeze([
55:  path.join(REPO_ROOT, '.opencode', 'specs'),
56:  path.join(REPO_ROOT, 'specs'),
60:function isPathWithin(candidatePath, rootPath) {
61:  const relative = path.relative(rootPath, candidatePath);
66:  return APPROVED_CORPUS_ROOTS
67:    .filter((rootPath) => fs.existsSync(rootPath))
68:    .map((rootPath) => fs.realpathSync(rootPath));
71:function resolveApprovedCorpusPath(rawPath, label, expectedType) {
93:  if (!approvedRoots.some((rootPath) => isPathWithin(realPath, rootPath))) {
94:    throw new Error(`${label} must resolve under an approved corpus root`);
337: * @param {string} [options.jsonlContent] - Raw JSONL content (alternative to reading from disk).
371:  if (options.jsonlContent) {
372:    parsed = parseJSONL(options.jsonlContent);
376:      fixturesRoot = resolveApprovedCorpusPath(options.fixturesDir, 'Corpus fixtures directory', 'dir');
382:    const jsonlPath = path.join(fixturesRoot, packetFamily, 'sample-iterations.jsonl');
385:      resolvedJsonlPath = resolveApprovedCorpusPath(jsonlPath, 'Corpus JSONL fixture', 'file');
390:    const content = fs.readFileSync(resolvedJsonlPath, 'utf8');
393:    errors.push('Either fixturesDir or jsonlContent must be provided');
488:    const content = fs.readFileSync(corpusPath, 'utf8');

 exited 2 in 0ms:
rg: .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.js: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:57:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:72:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:86:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:95:export interface Namespace {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:98:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:306:  if (ns.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:308:    params.push(ns.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:328: * Insert or update a node scoped to `(specFolder, loopType, sessionId, id)`.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:339:  ).get(node.specFolder, node.loopType, node.sessionId, node.id) as { id: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:349:      node.specFolder, node.loopType, node.sessionId, node.id,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:361:    node.specFolder, node.loopType, node.sessionId, node.id,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370:  if (!ns.sessionId) return null;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:374:  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:379:export function getNodes(ns: Namespace): CoverageNode[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:387:export function getNodesByKind(ns: Namespace, kind: NodeKind): CoverageNode[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:396:  if (!ns.sessionId) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:401:    ).run(ns.specFolder, ns.loopType, ns.sessionId, id, id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:404:    ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:415: * Insert or update an edge scoped to `(specFolder, loopType, sessionId, id)`.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:433:  ).get(edge.specFolder, edge.loopType, edge.sessionId, edge.id) as { id: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:441:      edge.specFolder, edge.loopType, edge.sessionId, edge.id,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:453:    edge.specFolder, edge.loopType, edge.sessionId, edge.id,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:462:  if (!ns.sessionId) return null;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:466:  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:471:export function getEdges(ns: Namespace): CoverageEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:479:export function getEdgesFrom(ns: Namespace, sourceId: string): CoverageEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:480:  if (!ns.sessionId) return [];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:484:  ).all(ns.specFolder, ns.loopType, ns.sessionId, sourceId) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:489:export function getEdgesTo(ns: Namespace, targetId: string): CoverageEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:490:  if (!ns.sessionId) return [];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:494:  ).all(ns.specFolder, ns.loopType, ns.sessionId, targetId) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:504:  if (!ns.sessionId) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:508:  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:516:  ).run(weight, metadataStr, ns.specFolder, ns.loopType, ns.sessionId, id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:522:  if (!ns.sessionId) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:526:  ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:549:    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:556:export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:558:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:563:    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:575:export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:577:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:582:    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:598:export function getStats(specFolder: string, loopType: LoopType): {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:692:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:708:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:723:    sessionId: r.session_id as string,

exec
/bin/zsh -lc 'rg -n "resolvePromotionAuditPath|PROMOTION_AUDIT_DIR|writeFileSync|outputPath|manifest|checkManifestBoundary|validateParamSpaceAgainstManifest|DEFAULT_PARAM_SPACE|paramSpace|loadCanonicalManifest" .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:22: * Step sizes for the manifest-declared tunable search space.
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:33:const CANONICAL_MANIFEST_PATH = path.join(__dirname, 'optimizer-manifest.json');
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:35:function loadCanonicalManifest() {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:39:function deriveParamSpaceFromManifest(manifest) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:40:  if (!manifest || typeof manifest !== 'object') {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:41:    throw new Error('Canonical optimizer manifest is required');
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:44:  const paramSpace = {};
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:45:  for (const field of manifest.tunableFields || []) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:63:    paramSpace[name] = {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:70:  return paramSpace;
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:73:function validateParamSpaceAgainstManifest(paramSpace, manifest) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:74:  if (!paramSpace || typeof paramSpace !== 'object') {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:77:  if (!manifest || typeof manifest !== 'object') {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:78:    return { valid: false, violations: ['Canonical optimizer manifest is required'] };
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:83:  for (const field of manifest.tunableFields || []) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:90:    (manifest.lockedFields || [])
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:95:  for (const [name, bounds] of Object.entries(paramSpace)) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:101:    const manifestField = tunableFields.get(name);
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:102:    if (!manifestField) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:103:      violations.push(`Field "${name}" is not declared tunable in the canonical manifest`);
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:122:    const manifestRange = manifestField.range || {};
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:123:    if (typeof manifestRange.min === 'number' && min < manifestRange.min) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:124:      violations.push(`Field "${name}" minimum ${min} is below manifest minimum ${manifestRange.min}`);
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:126:    if (typeof manifestRange.max === 'number' && max > manifestRange.max) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:127:      violations.push(`Field "${name}" maximum ${max} exceeds manifest maximum ${manifestRange.max}`);
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:132:    if (manifestField.type === 'integer' && (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(step))) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:143:const CANONICAL_MANIFEST = loadCanonicalManifest();
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:150:const DEFAULT_PARAM_SPACE = Object.freeze(deriveParamSpaceFromManifest(CANONICAL_MANIFEST));
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:177: * @param {Record<string, { min: number; max: number; step: number }>} paramSpace
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:181:function sampleConfig(paramSpace, rng) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:182:  if (!paramSpace || typeof paramSpace !== 'object' || typeof rng !== 'function') return {};
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:185:  for (const [name, bounds] of Object.entries(paramSpace)) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:259: * @param {Record<string, { min: number; max: number; step: number }>} [paramSpace] - Parameter space definition.
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:266:function randomSearch(corpus, rubric, paramSpace, iterations, options) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:277:  let space = DEFAULT_PARAM_SPACE;
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:278:  if (paramSpace !== undefined) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:279:    const validation = validateParamSpaceAgainstManifest(paramSpace, CANONICAL_MANIFEST);
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:283:    space = paramSpace;
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:455:  DEFAULT_PARAM_SPACE,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:39:const PROMOTION_AUDIT_DIR = path.resolve(__dirname, 'audit', 'promotion-reports');
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:58:function resolvePromotionAuditPath(outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:59:  const auditRoot = ensureCanonicalDirectory(PROMOTION_AUDIT_DIR, 'Promotion audit directory');
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:60:  const candidatePath = path.isAbsolute(outputPath)
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:61:    ? path.resolve(outputPath)
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:62:    : path.resolve(auditRoot, outputPath);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:115: * against the manifest definitions.
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:118: * @param {object} manifest - The optimizer manifest.
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:121:function checkManifestBoundary(candidate, manifest) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:122:  if (!candidate || typeof candidate !== 'object' || !manifest || typeof manifest !== 'object') {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:123:    return { valid: false, violations: ['Candidate and manifest objects are required'] };
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:127:  for (const f of manifest.tunableFields || []) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:132:    (manifest.lockedFields || []).map((f) => f.name || f),
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:139:      violations.push(`Field "${field}" is not listed as tunable in the optimizer manifest`);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:141:      // Validate type and range against manifest definition
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:155:            violations.push(`Field "${field}" value ${value} is below manifest minimum ${def.range.min}`);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:158:            violations.push(`Field "${field}" value ${value} is above manifest maximum ${def.range.max}`);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:183: * @param {object} options.manifest - Optimizer manifest for boundary checking.
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:184: * @returns {{ decision: string; improved: boolean; regressions: string[]; improvements: string[]; manifestCheck: object|null; prerequisiteCheck: object; advisoryOnly: boolean }}
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:193:      manifestCheck: null,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:206:  let manifestCheck;
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:207:  if (!opts.manifest || typeof opts.manifest !== 'object') {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:208:    manifestCheck = {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:210:      violations: ['Canonical optimizer manifest is required'],
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:213:    manifestCheck = checkManifestBoundary(candidate.config, opts.manifest);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:215:  if (!manifestCheck.valid) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:219:      regressions: manifestCheck.violations,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:221:      manifestCheck,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:276:    manifestCheck,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:333:    manifestBoundary: opts.manifestCheck || null,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:360: * @param {string} outputPath - File path for the output.
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:362:function savePromotionReport(report, outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:363:  if (!report || typeof report !== 'object' || typeof outputPath !== 'string' || !outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:366:  const resolvedOutputPath = resolvePromotionAuditPath(outputPath);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:367:  fs.writeFileSync(resolvedOutputPath, JSON.stringify(report, null, 2), 'utf8');
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:378:  PROMOTION_AUDIT_DIR,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:380:  checkManifestBoundary,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts | sed -n '90,170p;300,330p;370,490p;556,635p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs | sed -n '260,340p;440,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	 * @param {number} [iterations=20] - Number of random candidates to try.
   261	 * @param {object} [options={}] - Additional options.
   262	 * @param {number} [options.seed=42] - RNG seed for reproducibility.
   263	 * @param {object} [options.baselineConfig] - Baseline config for comparison.
   264	 * @returns {{ bestCandidate: object|null; bestScore: object|null; auditTrail: object[]; baselineScore: object|null; iterations: number }}
   265	 */
   266	function randomSearch(corpus, rubric, paramSpace, iterations, options) {
   267	  if (!Array.isArray(corpus) || !rubric || typeof rubric !== 'object') {
   268	    return {
   269	      bestCandidate: null,
   270	      bestScore: null,
   271	      auditTrail: [],
   272	      baselineScore: null,
   273	      iterations: 0,
   274	    };
   275	  }
   276	  const opts = options || {};
   277	  let space = DEFAULT_PARAM_SPACE;
   278	  if (paramSpace !== undefined) {
   279	    const validation = validateParamSpaceAgainstManifest(paramSpace, CANONICAL_MANIFEST);
   280	    if (!validation.valid) {
   281	      throw new Error(`Invalid optimizer parameter space: ${validation.violations.join('; ')}`);
   282	    }
   283	    space = paramSpace;
   284	  }
   285	  const maxIter = typeof iterations === 'number' && iterations > 0 ? iterations : 20;
   286	  const seed = opts.seed ?? 42;
   287	  const rng = createRNG(seed);
   288	
   289	  const auditTrail = [];
   290	  let bestCandidate = null;
   291	  let bestScore = null;
   292	  let baselineScore = null;
   293	
   294	  // Compute baseline if provided
   295	  if (opts.baselineConfig) {
   296	    const baselineResults = evaluateConfig(corpus, opts.baselineConfig, rubric);
   297	    baselineScore = baselineResults;
   298	    // Initialize best to baseline so first candidate must beat it
   299	    bestScore = baselineResults;
   300	    bestCandidate = opts.baselineConfig;
   301	  }
   302	
   303	  for (let i = 0; i < maxIter; i++) {
   304	    const candidateConfig = sampleConfig(space, rng);
   305	    const candidateResults = evaluateConfig(corpus, candidateConfig, rubric);
   306	
   307	    let accepted = false;
   308	    let comparison = null;
   309	
   310	    if (bestScore === null) {
   311	      // First candidate is accepted as initial best only when no baseline was provided
   312	      accepted = true;
   313	      bestCandidate = candidateConfig;
   314	      bestScore = candidateResults;
   315	    } else if (candidateResults.composite > bestScore.composite) {
   316	      // Check for regressions against baseline if available
   317	      if (baselineScore) {
   318	        comparison = compareScores(baselineScore, candidateResults);
   319	        // Only accept if no critical regressions
   320	        if (comparison.regressions.length === 0) {
   321	          accepted = true;
   322	          bestCandidate = candidateConfig;
   323	          bestScore = candidateResults;
   324	        }
   325	      } else {
   326	        comparison = compareScores(bestScore, candidateResults);
   327	        accepted = true;
   328	        bestCandidate = candidateConfig;
   329	        bestScore = candidateResults;
   330	      }
   331	    } else {
   332	      comparison = compareScores(bestScore || baselineScore, candidateResults);
   333	    }
   334	
   335	    auditTrail.push(
   336	      recordCandidate(candidateConfig, candidateResults, accepted, comparison, { timestamp: opts.timestamp }),
   337	    );
   338	  }
   339	
   340	  return {
   440	    } else if (candidateDim.score > baselineDim.score + 0.05) {
   441	      improvements.push(
   442	        `${name} improved: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   443	      );
   444	    }
   445	  }
   446	
   447	  return { improvements, regressions };
   448	}
   449	
   450	/* ---------------------------------------------------------------
   451	   5. EXPORTS
   452	----------------------------------------------------------------*/
   453	
   454	module.exports = {
   455	  DEFAULT_PARAM_SPACE,
   456	  createRNG,
   457	  sampleConfig,
   458	  recordCandidate,
   459	  randomSearch,
   460	  evaluateConfig,
   461	  compareScores,
   462	  countDecimals,
   463	};

 succeeded in 0ms:
    90	  edgeCount: number;
    91	  createdAt?: string;
    92	}
    93	
    94	/** Namespace components for isolation */
    95	export interface Namespace {
    96	  specFolder: string;
    97	  loopType: LoopType;
    98	  sessionId?: string;
    99	}
   100	
   101	// ───────────────────────────────────────────────────────────────
   102	// 2. CONSTANTS
   103	// ───────────────────────────────────────────────────────────────
   104	
   105	export const SCHEMA_VERSION = 2;
   106	
   107	const DB_FILENAME = 'deep-loop-graph.sqlite';
   108	
   109	/** Weight clamping bounds */
   110	const MIN_WEIGHT = 0.0;
   111	const MAX_WEIGHT = 2.0;
   112	
   113	/** Initial weight estimates for research relations */
   114	export const RESEARCH_WEIGHTS: Record<ResearchRelation, number> = {
   115	  ANSWERS: 1.3,
   116	  SUPPORTS: 1.0,
   117	  CONTRADICTS: 0.8,
   118	  SUPERSEDES: 1.5,
   119	  DERIVED_FROM: 1.0,
   120	  COVERS: 1.1,
   121	  CITES: 1.0,
   122	};
   123	
   124	/** Initial weight estimates for review relations */
   125	export const REVIEW_WEIGHTS: Record<ReviewRelation, number> = {
   126	  COVERS: 1.3,
   127	  EVIDENCE_FOR: 1.0,
   128	  CONTRADICTS: 0.8,
   129	  RESOLVES: 1.5,
   130	  CONFIRMS: 1.0,
   131	  ESCALATES: 1.2,
   132	  IN_DIMENSION: 1.0,
   133	  IN_FILE: 1.0,
   134	};
   135	
   136	/** Valid node kinds by loop type */
   137	export const VALID_KINDS: Record<LoopType, readonly string[]> = {
   138	  research: ['QUESTION', 'FINDING', 'CLAIM', 'SOURCE'] as const,
   139	  review: ['DIMENSION', 'FILE', 'FINDING', 'EVIDENCE', 'REMEDIATION'] as const,
   140	};
   141	
   142	/** Valid relation types by loop type */
   143	export const VALID_RELATIONS: Record<LoopType, readonly string[]> = {
   144	  research: ['ANSWERS', 'SUPPORTS', 'CONTRADICTS', 'SUPERSEDES', 'DERIVED_FROM', 'COVERS', 'CITES'] as const,
   145	  review: ['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE'] as const,
   146	};
   147	
   148	// ───────────────────────────────────────────────────────────────
   149	// 3. SCHEMA
   150	// ───────────────────────────────────────────────────────────────
   151	
   152	// Schema v2 (REQ-028): primary keys are composite
   153	// `(spec_folder, loop_type, session_id, id)` so two sessions can reuse the
   154	// same logical node/edge ID without overwriting each other's rows. Every
   155	// read, write, update, and delete must scope the bare id by namespace.
   156	const SCHEMA_SQL = `
   157	  CREATE TABLE IF NOT EXISTS coverage_nodes (
   158	    spec_folder TEXT NOT NULL,
   159	    loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review')),
   160	    session_id TEXT NOT NULL,
   161	    id TEXT NOT NULL,
   162	    kind TEXT NOT NULL,
   163	    name TEXT NOT NULL,
   164	    content_hash TEXT,
   165	    iteration INTEGER,
   166	    metadata TEXT,
   167	    created_at TEXT DEFAULT (datetime('now')),
   168	    updated_at TEXT DEFAULT (datetime('now')),
   169	    PRIMARY KEY (spec_folder, loop_type, session_id, id)
   170	  );
   300	}
   301	
   302	/** Build a namespace filter clause for SQL queries */
   303	function buildNamespaceWhere(ns: Namespace): { clause: string; params: unknown[] } {
   304	  const parts: string[] = ['spec_folder = ?', 'loop_type = ?'];
   305	  const params: unknown[] = [ns.specFolder, ns.loopType];
   306	  if (ns.sessionId) {
   307	    parts.push('session_id = ?');
   308	    params.push(ns.sessionId);
   309	  }
   310	  return { clause: parts.join(' AND '), params };
   311	}
   312	
   313	// ───────────────────────────────────────────────────────────────
   314	// 5. WEIGHT CLAMPING
   315	// ───────────────────────────────────────────────────────────────
   316	
   317	/** Clamp weight to valid range [0.0, 2.0] */
   318	export function clampWeight(weight: number): number {
   319	  if (!Number.isFinite(weight)) return 1.0;
   320	  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
   321	}
   322	
   323	// ───────────────────────────────────────────────────────────────
   324	// 6. NODE OPERATIONS
   325	// ───────────────────────────────────────────────────────────────
   326	
   327	/**
   328	 * Insert or update a node scoped to `(specFolder, loopType, sessionId, id)`.
   329	 * Returns the node ID. Every existence check is namespace-qualified so two
   330	 * sessions reusing the same logical id cannot collide (REQ-028).
   370	  if (!ns.sessionId) return null;
   371	  const d = getDb();
   372	  const row = d.prepare(
   373	    'SELECT * FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   374	  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
   375	  return row ? rowToNode(row) : null;
   376	}
   377	
   378	/** Get all nodes in a namespace */
   379	export function getNodes(ns: Namespace): CoverageNode[] {
   380	  const d = getDb();
   381	  const { clause, params } = buildNamespaceWhere(ns);
   382	  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause}`).all(...params) as Record<string, unknown>[];
   383	  return rows.map(rowToNode);
   384	}
   385	
   386	/** Get nodes of a specific kind in a namespace */
   387	export function getNodesByKind(ns: Namespace, kind: NodeKind): CoverageNode[] {
   388	  const d = getDb();
   389	  const { clause, params } = buildNamespaceWhere(ns);
   390	  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause} AND kind = ?`).all(...params, kind) as Record<string, unknown>[];
   391	  return rows.map(rowToNode);
   392	}
   393	
   394	/** Delete a node and its connected edges inside a namespace. */
   395	export function deleteNode(ns: Namespace, id: string): boolean {
   396	  if (!ns.sessionId) return false;
   397	  const d = getDb();
   398	  const tx = d.transaction(() => {
   399	    d.prepare(
   400	      'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND (source_id = ? OR target_id = ?)',
   401	    ).run(ns.specFolder, ns.loopType, ns.sessionId, id, id);
   402	    const result = d.prepare(
   403	      'DELETE FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   404	    ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
   405	    return result.changes > 0;
   406	  });
   407	  return tx();
   408	}
   409	
   410	// ───────────────────────────────────────────────────────────────
   411	// 7. EDGE OPERATIONS
   412	// ───────────────────────────────────────────────────────────────
   413	
   414	/**
   415	 * Insert or update an edge scoped to `(specFolder, loopType, sessionId, id)`.
   416	 * Rejects self-loops and clamps weights. Returns the edge ID or null if
   417	 * rejected. Namespace scoping is load-bearing: two sessions that both emit
   418	 * an edge with the same logical id get independent rows (REQ-028).
   419	 */
   420	export function upsertEdge(edge: CoverageEdge): string | null {
   421	  // Self-loop rejection
   422	  if (edge.sourceId === edge.targetId) {
   423	    return null;
   424	  }
   425	
   426	  const d = getDb();
   427	  const weight = clampWeight(edge.weight);
   428	  const now = new Date().toISOString();
   429	  const metadataStr = edge.metadata ? JSON.stringify(edge.metadata) : null;
   430	
   431	  const existing = d.prepare(
   432	    'SELECT id FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   433	  ).get(edge.specFolder, edge.loopType, edge.sessionId, edge.id) as { id: string } | undefined;
   434	  if (existing) {
   435	    d.prepare(`
   436	      UPDATE coverage_edges SET
   437	        relation = ?, weight = ?, metadata = ?
   438	      WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?
   439	    `).run(
   440	      edge.relation, weight, metadataStr,
   441	      edge.specFolder, edge.loopType, edge.sessionId, edge.id,
   442	    );
   443	    return edge.id;
   444	  }
   445	
   446	  d.prepare(`
   447	    INSERT INTO coverage_edges (
   448	      spec_folder, loop_type, session_id, id, source_id, target_id,
   449	      relation, weight, metadata, created_at
   450	    )
   451	    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   452	  `).run(
   453	    edge.specFolder, edge.loopType, edge.sessionId, edge.id,
   454	    edge.sourceId, edge.targetId,
   455	    edge.relation, weight, metadataStr, now,
   456	  );
   457	  return edge.id;
   458	}
   459	
   460	/** Get an edge by ID inside a namespace. */
   461	export function getEdge(ns: Namespace, id: string): CoverageEdge | null {
   462	  if (!ns.sessionId) return null;
   463	  const d = getDb();
   464	  const row = d.prepare(
   465	    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   466	  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
   467	  return row ? rowToEdge(row) : null;
   468	}
   469	
   470	/** Get all edges in a namespace */
   471	export function getEdges(ns: Namespace): CoverageEdge[] {
   472	  const d = getDb();
   473	  const { clause, params } = buildNamespaceWhere(ns);
   474	  const rows = d.prepare(`SELECT * FROM coverage_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
   475	  return rows.map(rowToEdge);
   476	}
   477	
   478	/** Get edges from a source node inside a namespace. */
   479	export function getEdgesFrom(ns: Namespace, sourceId: string): CoverageEdge[] {
   480	  if (!ns.sessionId) return [];
   481	  const d = getDb();
   482	  const rows = d.prepare(
   483	    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND source_id = ?',
   484	  ).all(ns.specFolder, ns.loopType, ns.sessionId, sourceId) as Record<string, unknown>[];
   485	  return rows.map(rowToEdge);
   486	}
   487	
   488	/** Get edges to a target node inside a namespace. */
   489	export function getEdgesTo(ns: Namespace, targetId: string): CoverageEdge[] {
   490	  if (!ns.sessionId) return [];
   556	export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
   557	  const d = getDb();
   558	  if (sessionId) {
   559	    const row = d.prepare(`
   560	      SELECT * FROM coverage_snapshots
   561	      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
   562	      ORDER BY iteration DESC LIMIT 1
   563	    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
   564	    return row ? rowToSnapshot(row) : null;
   565	  }
   566	  const row = d.prepare(`
   567	    SELECT * FROM coverage_snapshots
   568	    WHERE spec_folder = ? AND loop_type = ?
   569	    ORDER BY iteration DESC LIMIT 1
   570	  `).get(specFolder, loopType) as Record<string, unknown> | undefined;
   571	  return row ? rowToSnapshot(row) : null;
   572	}
   573	
   574	/** Get all snapshots for a namespace (ordered by iteration) */
   575	export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
   576	  const d = getDb();
   577	  if (sessionId) {
   578	    const rows = d.prepare(`
   579	      SELECT * FROM coverage_snapshots
   580	      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
   581	      ORDER BY iteration ASC
   582	    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
   583	    return rows.map(rowToSnapshot);
   584	  }
   585	  const rows = d.prepare(`
   586	    SELECT * FROM coverage_snapshots
   587	    WHERE spec_folder = ? AND loop_type = ?
   588	    ORDER BY iteration ASC
   589	  `).all(specFolder, loopType) as Record<string, unknown>[];
   590	  return rows.map(rowToSnapshot);
   591	}
   592	
   593	// ───────────────────────────────────────────────────────────────
   594	// 9. STATS AND COUNTS
   595	// ───────────────────────────────────────────────────────────────
   596	
   597	/** Get graph statistics for a namespace */
   598	export function getStats(specFolder: string, loopType: LoopType): {
   599	  totalNodes: number;
   600	  totalEdges: number;
   601	  nodesByKind: Record<string, number>;
   602	  edgesByRelation: Record<string, number>;
   603	  lastIteration: number | null;
   604	  schemaVersion: number;
   605	  dbFileSize: number | null;
   606	} {
   607	  const d = getDb();
   608	
   609	  const totalNodes = (d.prepare(
   610	    'SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ?',
   611	  ).get(specFolder, loopType) as { c: number }).c;
   612	
   613	  const totalEdges = (d.prepare(
   614	    'SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ?',
   615	  ).get(specFolder, loopType) as { c: number }).c;
   616	
   617	  const nodesByKind: Record<string, number> = {};
   618	  const kindRows = d.prepare(
   619	    'SELECT kind, COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? GROUP BY kind',
   620	  ).all(specFolder, loopType) as { kind: string; c: number }[];
   621	  for (const r of kindRows) nodesByKind[r.kind] = r.c;
   622	
   623	  const edgesByRelation: Record<string, number> = {};
   624	  const relRows = d.prepare(
   625	    'SELECT relation, COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? GROUP BY relation',
   626	  ).all(specFolder, loopType) as { relation: string; c: number }[];
   627	  for (const r of relRows) edgesByRelation[r.relation] = r.c;
   628	
   629	  const lastIterRow = d.prepare(
   630	    'SELECT MAX(iteration) as max_iter FROM coverage_snapshots WHERE spec_folder = ? AND loop_type = ?',
   631	  ).get(specFolder, loopType) as { max_iter: number | null } | undefined;
   632	  const lastIteration = lastIterRow?.max_iter ?? null;
   633	
   634	  let dbFileSize: number | null = null;
   635	  if (dbPath) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs | sed -n '330,420p;470,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs | sed -n '320,390p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   330	
   331	/**
   332	 * Build a replay corpus from a packet family's JSONL data.
   333	 *
   334	 * @param {string} packetFamily - The packet family identifier ('040', '028', '042').
   335	 * @param {object} [options={}] - Options.
   336	 * @param {string} [options.fixturesDir] - Path to the fixtures directory.
   337	 * @param {string} [options.jsonlContent] - Raw JSONL content (alternative to reading from disk).
   338	 * @param {string} [options.sourceRunId] - Run identifier for the corpus entry.
   339	 * @param {string} [options.timestamp] - Override timestamp for deterministic replay.
   340	 * @returns {{ corpus: object[]; errors: string[]; warnings: string[]; familyInfo: object }}
   341	 */
   342	function buildCorpus(packetFamily, options = {}) {
   343	  const errors = [];
   344	  const warnings = [];
   345	  const corpus = [];
   346	
   347	  // Check family validity
   348	  const familyInfo = PACKET_FAMILIES[packetFamily];
   349	  if (!familyInfo) {
   350	    errors.push(`Unknown packet family: ${packetFamily}`);
   351	    return { corpus, errors, warnings, familyInfo: null };
   352	  }
   353	
   354	  // 042 is excluded
   355	  if (packetFamily === '042') {
   356	    errors.push(
   357	      'Packet family 042 is excluded until implementation traces exist',
   358	    );
   359	    return { corpus, errors, warnings, familyInfo };
   360	  }
   361	
   362	  // 028 holdout warning
   363	  if (packetFamily === '028') {
   364	    warnings.push(
   365	      'Packet family 028 is an optional holdout with legacy compatibility grading',
   366	    );
   367	  }
   368	
   369	  let parsed;
   370	
   371	  if (options.jsonlContent) {
   372	    parsed = parseJSONL(options.jsonlContent);
   373	  } else if (options.fixturesDir) {
   374	    let fixturesRoot;
   375	    try {
   376	      fixturesRoot = resolveApprovedCorpusPath(options.fixturesDir, 'Corpus fixtures directory', 'dir');
   377	    } catch (error) {
   378	      errors.push(`Corpus integrity error: ${error instanceof Error ? error.message : String(error)}`);
   379	      return { corpus, errors, warnings, familyInfo };
   380	    }
   381	
   382	    const jsonlPath = path.join(fixturesRoot, packetFamily, 'sample-iterations.jsonl');
   383	    let resolvedJsonlPath;
   384	    try {
   385	      resolvedJsonlPath = resolveApprovedCorpusPath(jsonlPath, 'Corpus JSONL fixture', 'file');
   386	    } catch (error) {
   387	      errors.push(`Corpus integrity error: ${error instanceof Error ? error.message : String(error)}`);
   388	      return { corpus, errors, warnings, familyInfo };
   389	    }
   390	    const content = fs.readFileSync(resolvedJsonlPath, 'utf8');
   391	    parsed = parseJSONL(content);
   392	  } else {
   393	    errors.push('Either fixturesDir or jsonlContent must be provided');
   394	    return { corpus, errors, warnings, familyInfo };
   395	  }
   396	
   397	  const { records, skippedLines, totalLines } = parsed;
   398	
   399	  // P1-4: Reject traces where >20% of non-blank lines are malformed
   400	  if (totalLines > 0 && skippedLines.length / totalLines > 0.20) {
   401	    errors.push(
   402	      `Too many malformed JSONL lines: ${skippedLines.length}/${totalLines} (${(skippedLines.length / totalLines * 100).toFixed(1)}%) exceeds 20% threshold`,
   403	    );
   404	    return { corpus, errors, warnings, familyInfo };
   405	  }
   406	
   407	  if (skippedLines.length > 0) {
   408	    warnings.push(
   409	      `Skipped ${skippedLines.length} malformed JSONL line(s) out of ${totalLines}`,
   410	    );
   411	  }
   412	
   413	  if (records.length === 0) {
   414	    errors.push('No valid JSONL records found');
   415	    return { corpus, errors, warnings, familyInfo };
   416	  }
   417	
   418	  const sourceRunId =
   419	    options.sourceRunId ||
   420	    (records.find((r) => r.sessionId) || {}).sessionId ||
   470	  if (!fs.existsSync(dir)) {
   471	    fs.mkdirSync(dir, { recursive: true });
   472	  }
   473	  fs.writeFileSync(outputPath, JSON.stringify(corpus, null, 2), 'utf8');
   474	  return true;
   475	}
   476	
   477	/**
   478	 * Load a saved corpus from disk.
   479	 *
   480	 * @param {string} corpusPath - Path to the corpus JSON file.
   481	 * @returns {object[]} The loaded corpus entries.
   482	 */
   483	function loadCorpus(corpusPath) {
   484	  if (typeof corpusPath !== 'string' || !corpusPath || !fs.existsSync(corpusPath)) {
   485	    return [];
   486	  }
   487	  try {
   488	    const content = fs.readFileSync(corpusPath, 'utf8');
   489	    const parsed = JSON.parse(content);
   490	    return Array.isArray(parsed) ? parsed : [];
   491	  } catch (_error) {
   492	    return [];
   493	  }
   494	}
   495	
   496	/* ---------------------------------------------------------------
   497	   6. EXPORTS
   498	----------------------------------------------------------------*/
   499	
   500	module.exports = {
   501	  PACKET_FAMILIES,
   502	  REQUIRED_ENTRY_FIELDS,
   503	  buildCorpus,
   504	  validateCorpusEntry,
   505	  extractCorpusEntry,
   506	  parseJSONL,
   507	  saveCorpus,
   508	  loadCorpus,
   509	};

 succeeded in 0ms:
   320	      improvements: opts.improvements || [],
   321	      regressions: opts.regressions || [],
   322	    },
   323	
   324	    prerequisites: opts.prerequisiteCheck || {
   325	      allMet: false,
   326	      results: {
   327	        replayFixturesExist: false,
   328	        behavioralSuitesExist: false,
   329	      },
   330	      missing: ['replayFixturesExist', 'behavioralSuitesExist'],
   331	    },
   332	
   333	    manifestBoundary: opts.manifestCheck || null,
   334	
   335	    recommendation:
   336	      decision === PROMOTION_DECISIONS.ADVISORY_ACCEPT
   337	        ? 'Candidate shows improvement in replay. Review the per-dimension breakdown and audit trail before manual promotion.'
   338	        : decision === PROMOTION_DECISIONS.BLOCKED
   339	          ? 'Candidate touches locked or non-tunable fields. Promotion is blocked.'
   340	          : 'Candidate does not improve over baseline or has regressions. Not recommended for promotion.',
   341	
   342	    humanReviewRequired: true,
   343	    nextSteps: [
   344	      'Review per-dimension score breakdown',
   345	      'Inspect audit trail for rejected candidates',
   346	      'Verify no locked fields were modified',
   347	      ...(opts.prerequisiteCheck && !opts.prerequisiteCheck.allMet
   348	        ? ['Complete prerequisite replay fixtures and behavioral suites before production promotion']
   349	        : []),
   350	    ],
   351	  };
   352	
   353	  return report;
   354	}
   355	
   356	/**
   357	 * Save a promotion report to disk.
   358	 *
   359	 * @param {object} report - The promotion report.
   360	 * @param {string} outputPath - File path for the output.
   361	 */
   362	function savePromotionReport(report, outputPath) {
   363	  if (!report || typeof report !== 'object' || typeof outputPath !== 'string' || !outputPath) {
   364	    return false;
   365	  }
   366	  const resolvedOutputPath = resolvePromotionAuditPath(outputPath);
   367	  fs.writeFileSync(resolvedOutputPath, JSON.stringify(report, null, 2), 'utf8');
   368	  return true;
   369	}
   370	
   371	/* ---------------------------------------------------------------
   372	   6. EXPORTS
   373	----------------------------------------------------------------*/
   374	
   375	module.exports = {
   376	  PROMOTION_PREREQUISITES,
   377	  PROMOTION_DECISIONS,
   378	  PROMOTION_AUDIT_DIR,
   379	  checkPrerequisites,
   380	  checkManifestBoundary,
   381	  evaluateCandidate,
   382	  generatePromotionReport,
   383	  savePromotionReport,
   384	};

exec
/bin/zsh -lc "rg -n \"computeReviewSignals\\(|computeSignals\\(|createSignalSnapshot\\(|computeMomentum\\(|handleCoverageGraph(Query|Status|Convergence)\\(\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:147:export async function handleCoverageGraphConvergence(
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:374:    return computeSignals(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:43:export async function handleCoverageGraphQuery(
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:29:export async function handleCoverageGraphStatus(
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:406:    expect(computeReviewSignals(reviewNs)).toMatchObject({
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:457:    expect(computeReviewSignals(alphaNs)).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:213:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:229:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:244:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:255:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:261:      const momentum = computeMomentum(db, 999);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:896:      const momentum = computeMomentum(db, 9999);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:919:      const momentum = computeMomentum(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:941:      expect(() => computeMomentum(db, 100)).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:158:export function computeMomentum(db: Database.Database, memoryId: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:186:    const momentum = computeMomentum(db, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:410:export function computeReviewSignals(ns: Namespace): ReviewConvergenceSignals {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:548:export function computeSignals(ns: Namespace): ConvergenceSignals {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:552:  return computeReviewSignals(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:559:export function createSignalSnapshot(ns: Namespace, iteration: number): SignalSnapshot {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:560:  const signals = computeSignals(ns);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:600:export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts:158:      expect(signalsModule.computeMomentum(graph, 'a', 600000)).toBe(activity);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:172:    const scopedData = parseHandlerData(await handleCoverageGraphConvergence({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:191:    const queryError = parseHandlerError(await handleCoverageGraphQuery({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:196:    const statusError = parseHandlerError(await handleCoverageGraphStatus({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:200:    const convergenceError = parseHandlerError(await handleCoverageGraphConvergence({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:414:    const queryX = parseHandlerData(await handleCoverageGraphQuery({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:420:    const queryY = parseHandlerData(await handleCoverageGraphQuery({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:426:    const statusX = parseHandlerData(await handleCoverageGraphStatus({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:431:    const statusY = parseHandlerData(await handleCoverageGraphStatus({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:436:    const convergenceX = parseHandlerData(await handleCoverageGraphConvergence({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:441:    const convergenceY = parseHandlerData(await handleCoverageGraphConvergence({
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1583:Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:21:Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.

codex
I’ve confirmed there are dedicated session-isolation tests touching these handlers, which helps anchor intent. I’m sampling those assertions now to distinguish “fix was meant to cover this exact path” from “this helper is still intentionally legacy,” especially around the optimizer and snapshot code paths.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts | sed -n '150,240p;400,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	    expect(sessionEdges.map(edge => edge.id).sort()).toEqual([
   151	      'a-answers-1',
   152	      'a-answers-2',
   153	      'a-cites-1',
   154	      'a-cites-2',
   155	    ]);
   156	
   157	    const aggregateEdges = getEdges({
   158	      specFolder: SPEC_FOLDER,
   159	      loopType: LOOP_TYPE,
   160	    });
   161	
   162	    expect(aggregateEdges.map(edge => edge.id).sort()).toEqual([
   163	      'a-answers-1',
   164	      'a-answers-2',
   165	      'a-cites-1',
   166	      'a-cites-2',
   167	      'b-answers-1',
   168	    ]);
   169	  });
   170	
   171	  it('computes convergence from the session-scoped subset', async () => {
   172	    const scopedData = parseHandlerData(await handleCoverageGraphConvergence({
   173	      specFolder: SPEC_FOLDER,
   174	      loopType: LOOP_TYPE,
   175	      sessionId: SESSION_A,
   176	    }));
   177	
   178	    expect(scopedData.namespace).toMatchObject({
   179	      specFolder: SPEC_FOLDER,
   180	      loopType: LOOP_TYPE,
   181	      sessionId: SESSION_A,
   182	    });
   183	    expect(scopedData.scopeMode).toBe('session');
   184	    expect(scopedData.nodeCount).toBe(5);
   185	    expect(scopedData.edgeCount).toBe(4);
   186	    expect(scopedData.signals.questionCoverage).toBe(1);
   187	    expect(scopedData.signals.sourceDiversity).toBe(2);
   188	  });
   189	
   190	  it('requires sessionId for public coverage graph read handlers', async () => {
   191	    const queryError = parseHandlerError(await handleCoverageGraphQuery({
   192	      specFolder: SPEC_FOLDER,
   193	      loopType: LOOP_TYPE,
   194	      queryType: 'coverage_gaps',
   195	    } as any));
   196	    const statusError = parseHandlerError(await handleCoverageGraphStatus({
   197	      specFolder: SPEC_FOLDER,
   198	      loopType: LOOP_TYPE,
   199	    } as any));
   200	    const convergenceError = parseHandlerError(await handleCoverageGraphConvergence({
   201	      specFolder: SPEC_FOLDER,
   202	      loopType: LOOP_TYPE,
   203	    } as any));
   204	
   205	    expect(queryError).toContain('sessionId is required');
   206	    expect(statusError).toContain('sessionId is required');
   207	    expect(convergenceError).toContain('sessionId is required');
   208	  });
   209	});
   210	
   211	// ───────────────────────────────────────────────────────────────
   212	// REQ-028 (F004, F005 in the 042 closing audit): shared-ID
   213	// collision regression. Two sessions intentionally reuse the same
   214	// logical node and edge IDs, upsert independently, and the DB must
   215	// keep them as disjoint rows — an upsert in session B must never
   216	// overwrite the matching row in session A. The earlier suite only
   217	// exercised filtered reads over disjoint fixtures, so it would have
   218	// passed against the broken v1 schema too. This suite fails before
   219	// the composite-key migration and passes after.
   220	// ───────────────────────────────────────────────────────────────
   221	describe('coverage graph session isolation — shared-ID collisions', () => {
   222	  const SHARED_SPEC = 'specs/042-session-collision';
   223	  const SHARED_LOOP_TYPE: CoverageNode['loopType'] = 'research';
   224	  const SESSION_X = 'session-x';
   225	  const SESSION_Y = 'session-y';
   226	
   227	  const nsX = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_X };
   228	  const nsY = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_Y };
   229	
   230	  function collisionNode(sessionId: string, id: string, name: string): CoverageNode {
   231	    return {
   232	      id,
   233	      specFolder: SHARED_SPEC,
   234	      loopType: SHARED_LOOP_TYPE,
   235	      sessionId,
   236	      kind: 'QUESTION',
   237	      name,
   238	    };
   239	  }
   240	
   400	      collisionTypedEdge(SESSION_X, 'cites-shared-2', sharedFindingTwoId, sharedSourceTwoId, 'CITES'),
   401	      collisionTypedEdge(SESSION_X, 'contradiction-shared', sharedClaimSourceId, sharedClaimTargetId, 'CONTRADICTS'),
   402	    ];
   403	    const sessionYEdges: CoverageEdge[] = [
   404	      collisionEdge(SESSION_Y, 'answers-shared-1', sharedFindingOneId, sharedQuestionId),
   405	    ];
   406	
   407	    for (const node of [...sessionXNodes, ...sessionYNodes]) {
   408	      upsertNode(node);
   409	    }
   410	    for (const edge of [...sessionXEdges, ...sessionYEdges]) {
   411	      upsertEdge(edge);
   412	    }
   413	
   414	    const queryX = parseHandlerData(await handleCoverageGraphQuery({
   415	      specFolder: SHARED_SPEC,
   416	      loopType: SHARED_LOOP_TYPE,
   417	      sessionId: SESSION_X,
   418	      queryType: 'contradictions',
   419	    }));
   420	    const queryY = parseHandlerData(await handleCoverageGraphQuery({
   421	      specFolder: SHARED_SPEC,
   422	      loopType: SHARED_LOOP_TYPE,
   423	      sessionId: SESSION_Y,
   424	      queryType: 'contradictions',
   425	    }));
   426	    const statusX = parseHandlerData(await handleCoverageGraphStatus({
   427	      specFolder: SHARED_SPEC,
   428	      loopType: SHARED_LOOP_TYPE,
   429	      sessionId: SESSION_X,
   430	    }));
   431	    const statusY = parseHandlerData(await handleCoverageGraphStatus({
   432	      specFolder: SHARED_SPEC,
   433	      loopType: SHARED_LOOP_TYPE,
   434	      sessionId: SESSION_Y,
   435	    }));
   436	    const convergenceX = parseHandlerData(await handleCoverageGraphConvergence({
   437	      specFolder: SHARED_SPEC,
   438	      loopType: SHARED_LOOP_TYPE,
   439	      sessionId: SESSION_X,
   440	    }));
   441	    const convergenceY = parseHandlerData(await handleCoverageGraphConvergence({
   442	      specFolder: SHARED_SPEC,
   443	      loopType: SHARED_LOOP_TYPE,
   444	      sessionId: SESSION_Y,
   445	    }));
   446	
   447	    expect(queryX.totalContradictions).toBe(1);
   448	    expect(queryX.contradictions).toEqual([
   449	      expect.objectContaining({
   450	        edgeId: 'contradiction-shared',
   451	        sourceId: sharedClaimSourceId,
   452	        targetId: sharedClaimTargetId,
   453	        sourceName: 'Claim X A',
   454	        targetName: 'Claim X B',
   455	      }),
   456	    ]);
   457	    expect(queryY.totalContradictions).toBe(0);
   458	    expect(queryY.contradictions).toEqual([]);
   459	
   460	    expect(statusX.totalNodes).toBe(sessionXNodes.length);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts | sed -n '430,480p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   430	
   431	    upsertEdge(makeEdge({
   432	      id: 'beta-cover',
   433	      specFolder: betaNs.specFolder,
   434	      loopType: betaNs.loopType,
   435	      sessionId,
   436	      sourceId: 'shared-dimension',
   437	      targetId: 'shared-file',
   438	      relation: 'COVERS',
   439	      weight: 1.3,
   440	    }));
   441	    upsertEdge(makeEdge({
   442	      id: 'beta-resolve',
   443	      specFolder: betaNs.specFolder,
   444	      loopType: betaNs.loopType,
   445	      sessionId,
   446	      sourceId: 'beta-remediation',
   447	      targetId: 'shared-finding',
   448	      relation: 'RESOLVES',
   449	      weight: 1.5,
   450	    }));
   451	
   452	    expect(findCoverageGaps(alphaNs).map(gap => gap.nodeId).sort()).toEqual([
   453	      'shared-dimension',
   454	      'shared-file',
   455	    ]);
   456	    expect(findUnverifiedClaims(alphaNs).map(node => node.id)).toEqual(['shared-finding']);
   457	    expect(computeReviewSignals(alphaNs)).toMatchObject({
   458	      dimensionCoverage: 0,
   459	      p0ResolutionRate: 0,
   460	      hotspotSaturation: 0,
   461	    });
   462	  });
   463	
   464	  it('joins contradiction nodes on the full composite namespace key', () => {
   465	    const sessionId = 'shared-research-session';
   466	    const alphaNs: Namespace = { specFolder: 'spec-research-alpha', loopType: 'research', sessionId };
   467	    const betaNs: Namespace = { specFolder: 'spec-research-beta', loopType: 'research', sessionId };
   468	
   469	    upsertNode(makeResearchNode(alphaNs.specFolder, sessionId, 'shared-source', 'FINDING', 'Alpha source'));
   470	    upsertNode(makeResearchNode(alphaNs.specFolder, sessionId, 'shared-target', 'FINDING', 'Alpha target'));
   471	    upsertEdge(makeEdge({
   472	      id: 'alpha-contradiction',
   473	      specFolder: alphaNs.specFolder,
   474	      loopType: alphaNs.loopType,
   475	      sessionId,
   476	      sourceId: 'shared-source',
   477	      targetId: 'shared-target',
   478	      relation: 'CONTRADICTS',
   479	      weight: 0.8,
   480	    }));

exec
/bin/zsh -lc "rg -n \"replay-corpus|saveCorpus|loadCorpus|promotion-reports|randomSearch\\(\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:15:  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:26:  saveCorpus: (corpus: object[], outputPath: string) => void;
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:27:  loadCorpus: (corpusPath: string) => object[];
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:284:  describe('saveCorpus / loadCorpus', () => {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:302:        replayCorpus.saveCorpus(corpus, tmpPath);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:304:        const loaded = replayCorpus.loadCorpus(tmpPath);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:312:      expect(replayCorpus.loadCorpus('/nonexistent/path.json')).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:56:  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:191:      const result = search.randomSearch(corpus, testRubric, undefined, iterations, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:203:      const result1 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:204:      const result2 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:214:      const result = search.randomSearch(corpus, testRubric, undefined, 10, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:231:      const result = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:252:      const result = search.randomSearch(corpus, testRubric, undefined, 3, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:359:      expect(() => search.randomSearch(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:372:      expect(() => search.randomSearch(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts:51:  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts | sed -n '1,220p;240,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import os from 'node:os';
     3	import path from 'node:path';
     4	import { createRequire } from 'node:module';
     5	import { fileURLToPath } from 'node:url';
     6	
     7	import { describe, expect, it } from 'vitest';
     8	
     9	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
    10	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    11	const require = createRequire(import.meta.url);
    12	
    13	const replayCorpus = require(path.join(
    14	  WORKSPACE_ROOT,
    15	  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
    16	)) as {
    17	  PACKET_FAMILIES: Record<string, { role: string; required: boolean; compatibilityGrade: string }>;
    18	  REQUIRED_ENTRY_FIELDS: readonly string[];
    19	  buildCorpus: (
    20	    packetFamily: string,
    21	    options?: { fixturesDir?: string; jsonlContent?: string; sourceRunId?: string; timestamp?: string },
    22	  ) => { corpus: Array<Record<string, any>>; errors: string[]; warnings: string[]; familyInfo: object | null };
    23	  validateCorpusEntry: (entry: object) => { valid: boolean; errors: string[] };
    24	  extractCorpusEntry: (records: object[], packetFamily: string, sourceRunId: string, options?: { timestamp?: string }) => Record<string, any>;
    25	  parseJSONL: (content: string) => { records: object[]; skippedLines: Array<{ lineNumber: number; content: string; error: string }>; totalLines: number };
    26	  saveCorpus: (corpus: object[], outputPath: string) => void;
    27	  loadCorpus: (corpusPath: string) => object[];
    28	};
    29	
    30	const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');
    31	const REPLAY_FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-replay');
    32	
    33	describe('Replay Corpus Builder (T001)', () => {
    34	  describe('PACKET_FAMILIES', () => {
    35	    it('should define 040 as the required primary corpus', () => {
    36	      const family = replayCorpus.PACKET_FAMILIES['040'];
    37	      expect(family).toBeDefined();
    38	      expect(family.role).toBe('primary');
    39	      expect(family.required).toBe(true);
    40	      expect(family.compatibilityGrade).toBe('full');
    41	    });
    42	
    43	    it('should define 028 as an optional holdout', () => {
    44	      const family = replayCorpus.PACKET_FAMILIES['028'];
    45	      expect(family).toBeDefined();
    46	      expect(family.role).toBe('holdout');
    47	      expect(family.required).toBe(false);
    48	      expect(family.compatibilityGrade).toBe('legacy');
    49	    });
    50	
    51	    it('should define 042 as excluded', () => {
    52	      const family = replayCorpus.PACKET_FAMILIES['042'];
    53	      expect(family).toBeDefined();
    54	      expect(family.role).toBe('excluded');
    55	      expect(family.required).toBe(false);
    56	      expect(family.compatibilityGrade).toBe('none');
    57	    });
    58	  });
    59	
    60	  describe('parseJSONL', () => {
    61	    it('should parse valid JSONL content', () => {
    62	      const content = '{"type":"config","topic":"test"}\n{"type":"iteration","run":1}\n';
    63	      const result = replayCorpus.parseJSONL(content);
    64	      expect(result.records).toHaveLength(2);
    65	      expect(result.records[0]).toEqual({ type: 'config', topic: 'test' });
    66	      expect(result.records[1]).toEqual({ type: 'iteration', run: 1 });
    67	      expect(result.skippedLines).toHaveLength(0);
    68	      expect(result.totalLines).toBe(2);
    69	    });
    70	
    71	    it('should skip blank lines', () => {
    72	      const content = '{"type":"config"}\n\n{"type":"iteration"}\n\n';
    73	      const result = replayCorpus.parseJSONL(content);
    74	      expect(result.records).toHaveLength(2);
    75	      expect(result.totalLines).toBe(2);
    76	    });
    77	
    78	    it('should track malformed lines with metadata (P1-4)', () => {
    79	      const content = '{"type":"config"}\nnot-json\n{"type":"iteration"}\n';
    80	      const result = replayCorpus.parseJSONL(content);
    81	      expect(result.records).toHaveLength(2);
    82	      expect(result.skippedLines).toHaveLength(1);
    83	      expect(result.skippedLines[0].lineNumber).toBe(2);
    84	      expect(result.skippedLines[0].content).toBe('not-json');
    85	      expect(result.skippedLines[0].error).toBeDefined();
    86	      expect(result.totalLines).toBe(3);
    87	    });
    88	
    89	    it('should truncate long malformed line content to 200 chars (P1-4)', () => {
    90	      const longLine = 'x'.repeat(300);
    91	      const content = `{"type":"config"}\n${longLine}\n`;
    92	      const result = replayCorpus.parseJSONL(content);
    93	      expect(result.skippedLines).toHaveLength(1);
    94	      expect(result.skippedLines[0].content.length).toBeLessThanOrEqual(203); // 200 + '...'
    95	    });
    96	  });
    97	
    98	  describe('validateCorpusEntry', () => {
    99	    it('should accept a valid entry', () => {
   100	      const entry = {
   101	        id: '040-run-1',
   102	        packetFamily: '040',
   103	        sourceRun: 'run-1',
   104	        config: { maxIterations: 7 },
   105	        iterations: [{ run: 1 }],
   106	        stopOutcome: { stopReason: 'converged' },
   107	      };
   108	      const result = replayCorpus.validateCorpusEntry(entry);
   109	      expect(result.valid).toBe(true);
   110	      expect(result.errors).toHaveLength(0);
   111	    });
   112	
   113	    it('should reject null input', () => {
   114	      const result = replayCorpus.validateCorpusEntry(null as any);
   115	      expect(result.valid).toBe(false);
   116	    });
   117	
   118	    it('should report missing required fields', () => {
   119	      const result = replayCorpus.validateCorpusEntry({});
   120	      expect(result.valid).toBe(false);
   121	      expect(result.errors.length).toBeGreaterThan(0);
   122	      for (const field of replayCorpus.REQUIRED_ENTRY_FIELDS) {
   123	        expect(result.errors.some((e: string) => e.includes(field))).toBe(true);
   124	      }
   125	    });
   126	
   127	    it('should reject packet family 042', () => {
   128	      const entry = {
   129	        id: '042-run-1',
   130	        packetFamily: '042',
   131	        sourceRun: 'run-1',
   132	        config: {},
   133	        iterations: [{ run: 1 }],
   134	        stopOutcome: { stopReason: 'converged' },
   135	      };
   136	      const result = replayCorpus.validateCorpusEntry(entry);
   137	      expect(result.valid).toBe(false);
   138	      expect(result.errors.some((e: string) => e.includes('042'))).toBe(true);
   139	    });
   140	
   141	    it('should reject empty iterations array', () => {
   142	      const entry = {
   143	        id: '040-run-1',
   144	        packetFamily: '040',
   145	        sourceRun: 'run-1',
   146	        config: {},
   147	        iterations: [],
   148	        stopOutcome: { stopReason: 'converged' },
   149	      };
   150	      const result = replayCorpus.validateCorpusEntry(entry);
   151	      expect(result.valid).toBe(false);
   152	      expect(result.errors.some((e: string) => e.includes('empty'))).toBe(true);
   153	    });
   154	  });
   155	
   156	  describe('buildCorpus', () => {
   157	    it('should build corpus from 040 JSONL fixtures', () => {
   158	      const result = replayCorpus.buildCorpus('040', {
   159	        fixturesDir: REPLAY_FIXTURES_DIR,
   160	      });
   161	      expect(result.errors).toHaveLength(0);
   162	      expect(result.corpus).toHaveLength(1);
   163	      expect(result.familyInfo).toBeDefined();
   164	      expect(result.familyInfo!.role).toBe('primary');
   165	    });
   166	
   167	    it('should build corpus from 028 with holdout warning', () => {
   168	      const result = replayCorpus.buildCorpus('028', {
   169	        fixturesDir: REPLAY_FIXTURES_DIR,
   170	      });
   171	      expect(result.errors).toHaveLength(0);
   172	      expect(result.corpus).toHaveLength(1);
   173	      expect(result.warnings.some((w: string) => w.includes('holdout'))).toBe(true);
   174	    });
   175	
   176	    it('should reject 042 corpus building', () => {
   177	      const result = replayCorpus.buildCorpus('042', {
   178	        fixturesDir: REPLAY_FIXTURES_DIR,
   179	      });
   180	      expect(result.errors.length).toBeGreaterThan(0);
   181	      expect(result.errors.some((e: string) => e.includes('042'))).toBe(true);
   182	      expect(result.corpus).toHaveLength(0);
   183	    });
   184	
   185	    it('should reject unknown packet family', () => {
   186	      const result = replayCorpus.buildCorpus('999', {
   187	        fixturesDir: REPLAY_FIXTURES_DIR,
   188	      });
   189	      expect(result.errors.length).toBeGreaterThan(0);
   190	      expect(result.familyInfo).toBeNull();
   191	    });
   192	
   193	    it('should build corpus from raw JSONL content', () => {
   194	      const content = fs.readFileSync(
   195	        path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
   196	        'utf8',
   197	      );
   198	      const result = replayCorpus.buildCorpus('040', {
   199	        jsonlContent: content,
   200	        sourceRunId: 'test-run-1',
   201	      });
   202	      expect(result.errors).toHaveLength(0);
   203	      expect(result.corpus).toHaveLength(1);
   204	      const entry = result.corpus[0] as Record<string, any>;
   205	      expect(entry.id).toBe('040-test-run-1');
   206	    });
   207	
   208	    it('should warn when graph metrics are unavailable (REQ-009)', () => {
   209	      const content = fs.readFileSync(
   210	        path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
   211	        'utf8',
   212	      );
   213	      const result = replayCorpus.buildCorpus('040', {
   214	        jsonlContent: content,
   215	      });
   216	      // Our sample data does not have graphCoverage, so expect warning
   217	      expect(result.warnings.some((w: string) => w.includes('graph metrics unavailable'))).toBe(true);
   218	    });
   219	
   220	    it('emits replay metrics in the shape consumed by replayRun', () => {
   240	      expect(result.errors.some((e: string) => e.includes('fixturesDir'))).toBe(true);
   241	    });
   242	
   243	    it('should reject fixtures outside approved corpus roots', () => {
   244	      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'optimizer-corpus-outside-'));
   245	      const packetDir = path.join(tempDir, '040');
   246	
   247	      try {
   248	        fs.mkdirSync(packetDir, { recursive: true });
   249	        fs.writeFileSync(
   250	          path.join(packetDir, 'sample-iterations.jsonl'),
   251	          '{"type":"config","maxIterations":7}\n{"type":"iteration","run":1,"status":"complete"}\n{"type":"event","event":"synthesis_complete","stopReason":"converged","totalIterations":1}\n',
   252	          'utf8',
   253	        );
   254	
   255	        const result = replayCorpus.buildCorpus('040', {
   256	          fixturesDir: tempDir,
   257	        });
   258	
   259	        expect(result.errors.some((e: string) => e.includes('Corpus integrity error'))).toBe(true);
   260	        expect(result.errors.some((e: string) => e.includes('approved corpus root'))).toBe(true);
   261	      } finally {
   262	        fs.rmSync(tempDir, { recursive: true, force: true });
   263	      }
   264	    });
   265	
   266	    it('should reject symlinked fixtures directories', () => {
   267	      const symlinkPath = path.join(os.tmpdir(), `optimizer-corpus-link-${Date.now()}`);
   268	
   269	      try {
   270	        fs.symlinkSync(REPLAY_FIXTURES_DIR, symlinkPath);
   271	
   272	        const result = replayCorpus.buildCorpus('040', {
   273	          fixturesDir: symlinkPath,
   274	        });
   275	
   276	        expect(result.errors.some((e: string) => e.includes('Corpus integrity error'))).toBe(true);
   277	        expect(result.errors.some((e: string) => e.includes('symlink'))).toBe(true);
   278	      } finally {
   279	        if (fs.existsSync(symlinkPath)) fs.unlinkSync(symlinkPath);
   280	      }
   281	    });
   282	  });
   283	
   284	  describe('saveCorpus / loadCorpus', () => {
   285	    it('should round-trip corpus through disk', () => {
   286	      const corpus = [
   287	        {
   288	          id: '040-test',
   289	          packetFamily: '040',
   290	          sourceRun: 'test',
   291	          config: { maxIterations: 7 },
   292	          iterations: [{ run: 1 }],
   293	          stopOutcome: { stopReason: 'converged' },
   294	        },
   295	      ];
   296	      const tmpPath = path.join(
   297	        process.env.TMPDIR || '/tmp',
   298	        `corpus-test-${Date.now()}.json`,
   299	      );
   300	
   301	      try {
   302	        replayCorpus.saveCorpus(corpus, tmpPath);
   303	        expect(fs.existsSync(tmpPath)).toBe(true);
   304	        const loaded = replayCorpus.loadCorpus(tmpPath);
   305	        expect(loaded).toEqual(corpus);
   306	      } finally {
   307	        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
   308	      }
   309	    });
   310	
   311	    it('should return an empty corpus for a missing corpus file', () => {
   312	      expect(replayCorpus.loadCorpus('/nonexistent/path.json')).toEqual([]);
   313	    });
   314	  });
   315	
   316	  describe('P1-1: deterministic timestamps', () => {
   317	    it('should use provided timestamp in extractCorpusEntry', () => {
   318	      const records = [
   319	        { type: 'config', maxIterations: 7 },
   320	        { type: 'iteration', run: 1, status: 'complete' },
   321	        { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 1 },
   322	      ];
   323	      const fixedTime = '2026-01-01T00:00:00.000Z';
   324	      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-1', { timestamp: fixedTime });
   325	      expect(entry.metadata.extractedAt).toBe(fixedTime);
   326	    });
   327	
   328	    it('should default to current time when no timestamp override', () => {
   329	      const records = [
   330	        { type: 'config', maxIterations: 7 },

codex
The code paths are mostly lining up with the intended isolation model, and I want one more layer of evidence before I close the call. I’m running the targeted review/session-isolation test files that exercise these handlers and optimizer guards; if the sandbox blocks them, I’ll call that out explicitly instead of overstating confidence.
exec
/bin/zsh -lc 'pnpm vitest run .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 127 in 0ms:
zsh:1: command not found: pnpm

codex
The test runner isn’t available via `pnpm` in this shell, so I’m doing one quick fallback check for a local `vitest` binary before I decide whether verification stays static-analysis-only. I’d rather be explicit about tool limits than imply we executed something we didn’t.
exec
/bin/zsh -lc 'test -x node_modules/.bin/vitest && echo node_modules/.bin/vitest || true' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc 'which vitest || true' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
vitest not found

exec
/bin/zsh -lc 'ls package.json node_modules >/dev/null 2>&1; echo $?' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
0

Finished targeted code inspection and supporting test-surface review. I’m synthesizing the original finding statuses now and checking whether any remaining issues are true residuals versus out-of-scope legacy behavior.
  ✓ Inspect the target coverage-graph libraries, handlers, and optimizer scripts for the specific namespace-isolation fixes
  → Assess each original finding area as FIXED, PARTIAL, OPEN, or REGRESSED and identify any new issues
  • Deliver a findings-first validation report with exact file/line evidence, confidence, and release readiness
codex
**Findings**
No new P0/P1/P2 findings in the requested validation slice. I did not find any `PARTIAL`, `OPEN`, or `REGRESSED` items among the specific namespace-isolation fixes you asked me to validate.

**Original Finding Status**
1. `FIXED` — Review-mode coverage-gap `NOT EXISTS` subquery now scopes edge reads with the full namespace via `buildNamespacePredicate('e', ns)` in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:113) and uses that predicate inside the subquery at lines 120-125.
2. `FIXED` — Research-mode coverage-gap `NOT EXISTS` subquery applies the same namespace-qualified edge predicate in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:145) with the guarded subquery at lines 152-157.
3. `FIXED` — Review-mode unverified-claims `NOT EXISTS` subquery is namespace-scoped through `reviewEdgeNamespace` in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:364) and applies it at lines 370-375.
4. `FIXED` — Contradiction lookup now joins source/target nodes on the full composite key, including `session_id`, via `buildCompositeNodeJoin()` in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:75) and uses that join in `findContradictions()` at lines 194-196.
5. `FIXED` — Review signal edge lookups in [coverage-graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:410) are threaded through session-aware namespace predicates for `COVERS`, `CONTRADICTS`, `RESOLVES`, `EVIDENCE_FOR`, and hotspot joins at lines 422-487 and 499-537.
6. `FIXED` — `deep_loop_graph_query` now makes `sessionId` mandatory in [query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:28) and rejects missing values at lines 54-62.
7. `FIXED` — `deep_loop_graph_status` now makes `sessionId` mandatory in [status.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:18) and rejects missing values at lines 39-47.
8. `FIXED` — `deep_loop_graph_convergence` now makes `sessionId` mandatory in [convergence.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:104) and rejects missing values at lines 157-165.
9. `FIXED` — Promotion report output is now restricted to the canonical audit directory with traversal and symlink guards in [promote.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:39), enforced by `resolvePromotionAuditPath()` at lines 58-78 and used in `savePromotionReport()` at lines 362-367.
10. `FIXED` — Optimizer search now enforces the canonical manifest by deriving defaults from `optimizer-manifest.json` and validating caller-supplied parameter spaces in [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:33), [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:73), and [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:277).
11. `FIXED` — Replay corpus fixture loading is now constrained to approved roots and rejects symlinked/out-of-root fixture paths in [replay-corpus.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:53), with enforcement in `resolveApprovedCorpusPath()` at lines 71-98 and `buildCorpus()` at lines 373-389.

**New Findings**
None.

**Fix Validation Summary**
11 original findings validated `FIXED`, 0 `PARTIAL`, 0 `OPEN`, 0 `REGRESSED`.

**Confidence**
Medium. The static code review is strong and the repository contains targeted intent-matching tests for these paths, but I could not execute them in this shell because neither `pnpm` nor a `vitest` binary was available.

**Release Readiness**
Shippable for the security fixes in this validation bundle. I did not find a remaining namespace-isolation defect in the requested files; the only residual caveat is the missing local test runner, so runtime confirmation was not possible in this session.
hook: Stop
hook: Stop Completed
tokens used
116,790
**Findings**
No new P0/P1/P2 findings in the requested validation slice. I did not find any `PARTIAL`, `OPEN`, or `REGRESSED` items among the specific namespace-isolation fixes you asked me to validate.

**Original Finding Status**
1. `FIXED` — Review-mode coverage-gap `NOT EXISTS` subquery now scopes edge reads with the full namespace via `buildNamespacePredicate('e', ns)` in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:113) and uses that predicate inside the subquery at lines 120-125.
2. `FIXED` — Research-mode coverage-gap `NOT EXISTS` subquery applies the same namespace-qualified edge predicate in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:145) with the guarded subquery at lines 152-157.
3. `FIXED` — Review-mode unverified-claims `NOT EXISTS` subquery is namespace-scoped through `reviewEdgeNamespace` in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:364) and applies it at lines 370-375.
4. `FIXED` — Contradiction lookup now joins source/target nodes on the full composite key, including `session_id`, via `buildCompositeNodeJoin()` in [coverage-graph-query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:75) and uses that join in `findContradictions()` at lines 194-196.
5. `FIXED` — Review signal edge lookups in [coverage-graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:410) are threaded through session-aware namespace predicates for `COVERS`, `CONTRADICTS`, `RESOLVES`, `EVIDENCE_FOR`, and hotspot joins at lines 422-487 and 499-537.
6. `FIXED` — `deep_loop_graph_query` now makes `sessionId` mandatory in [query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:28) and rejects missing values at lines 54-62.
7. `FIXED` — `deep_loop_graph_status` now makes `sessionId` mandatory in [status.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:18) and rejects missing values at lines 39-47.
8. `FIXED` — `deep_loop_graph_convergence` now makes `sessionId` mandatory in [convergence.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:104) and rejects missing values at lines 157-165.
9. `FIXED` — Promotion report output is now restricted to the canonical audit directory with traversal and symlink guards in [promote.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:39), enforced by `resolvePromotionAuditPath()` at lines 58-78 and used in `savePromotionReport()` at lines 362-367.
10. `FIXED` — Optimizer search now enforces the canonical manifest by deriving defaults from `optimizer-manifest.json` and validating caller-supplied parameter spaces in [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:33), [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:73), and [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:277).
11. `FIXED` — Replay corpus fixture loading is now constrained to approved roots and rejects symlinked/out-of-root fixture paths in [replay-corpus.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:53), with enforcement in `resolveApprovedCorpusPath()` at lines 71-98 and `buildCorpus()` at lines 373-389.

**New Findings**
None.

**Fix Validation Summary**
11 original findings validated `FIXED`, 0 `PARTIAL`, 0 `OPEN`, 0 `REGRESSED`.

**Confidence**
Medium. The static code review is strong and the repository contains targeted intent-matching tests for these paths, but I could not execute them in this shell because neither `pnpm` nor a `vitest` binary was available.

**Release Readiness**
Shippable for the security fixes in this validation bundle. I did not find a remaining namespace-isolation defect in the requested files; the only residual caveat is the missing local test runner, so runtime confirmation was not possible in this session.
