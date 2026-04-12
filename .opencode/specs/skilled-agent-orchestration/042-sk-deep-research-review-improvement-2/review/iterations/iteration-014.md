---
iteration: 14
dimension: security
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T10:34:34Z
completedAt: 2026-04-12T10:38:33Z
---

# Deep Review Iteration 014 — security

**Focus:** Phase 007-008 database migrations: verify .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts v2 schema migration (drop-and-recreate) is safe, composite primary key correctness, and that .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts covers shared-ID collision regression.

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
session id: 019d8141-ecc3-7842-a168-4830579acda7
--------
user
You are a senior code reviewer executing iteration 14 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: security
FOCUS: Phase 007-008 database migrations: verify .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts v2 schema migration (drop-and-recreate) is safe, composite primary key correctness, and that .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts covers shared-ID collision regression.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for security issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-014-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: security
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
Reviewing the Phase 007-008 migration and session-isolation surfaces now, with attention on security-impacting failure modes in the v2 coverage-graph schema path and the regression test coverage around shared IDs.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep review iteration 14 for spec folder 042-sk-deep-research-review-improvement-2 focusing on security review of coverage-graph-db.ts v2 schema migration drop-and-recreate safety, composite primary key correctness, and session-isolation.vitest.ts shared-ID collision regression coverage." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 633ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-Ff8yrpJX' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.86,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-research(explicit), context, deep(name), iteration, loop"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !folder, !intent:memory, !session, !session(multi), !spec"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.86,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), context, deep(name), iteration, loop"
  },
  {
    "skill": "command-create-folder-readme",
    "kind": "command",
    "confidence": 0.8,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create(name), document~, folder(name), recreate~"
  }
]

codex
I’ve routed this as a deep-review pass rather than a general audit. Next I’m pulling the relevant skill guidance and prior memory references, then I’ll inspect the migration code and the isolation test line-by-line.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|coverage-graph|session-isolation|deep-review|Phase 007|Phase 008" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
257:scope: remediation pass that closes active P1 findings documented in parent `review/review-report.md` without rerunning deep-review iterations
289:scope: per-phase deep-review packet execution under `026-graph-and-context-optimization/review/` with strict write-scope boundaries, shared-state synchronization, and continuation/extension handling
300:- batch-phase-review-state.json, 026-graph-and-context-optimization/review/<phase-slug>, deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-dashboard.md, iteration-NNN.md, review-report.md, phasesCompleted 8/13
320:- extra stability passes, iteration-006..010, deep-review-state.jsonl append, deep-review-dashboard.md 10/10, deep-review-strategy.md max-iteration update, batch-phase-review-consolidated.md total iterations 83, no new findings
330:- batch-b, 006-010, deep-review-config.json maxIterations 10, deep-review-state.jsonl, iteration-006..010, deep-review-findings-registry.json convergenceScore 1.0, batch-phase-review-state.json, batch-phase-review-consolidated.md, total iterations 108
342:- required per-phase packet set under `review/<phase-slug>/`: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `review-report.md` [Task 1][Task 3][Task 4]
346:- after extension passes, run a quick Python integrity check to confirm each phase packet has 10 iteration files and `deep-review-findings-registry.json` reports `convergenceScore: 1.0` before finalizing shared-state/consolidated totals [Task 4]
896:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
904:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
916:## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success
924:- deep-review-reducer-schema.vitest.ts, release-blocking, .deep-review-pause, scratch/changelog, create:changelog gated
940:- symptom: deep-review reducer-schema tests fail during closeout; cause: config metadata drift (`metrics` missing, `.deep-review-pause` mutability mismatch); fix: align config/docs with test schema before rerunning suites [Task 3]
945:scope: deep-review closure, strict-validation remediation, changelog truth-sync, and README/recovery-contract doc parity for packet 023/024 work
956:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
1448:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for deep-review/release-readiness runs in this repo, but keep unresolved checks explicitly pending until rerun evidence exists
1980:## Task 2: Add missing `description` to `.codex/agents/deep-review.toml`
1988:- deep-review.toml, description metadata, malformed agent role definition

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

codex
I’ve got the review protocol loaded. I’m now tracing the exact migration path and the phase packet references so the findings stay anchored to intended behavior, not just the raw implementation.
exec
/bin/zsh -lc 'rg -n "007|008|coverage-graph|session-isolation|shared-ID|collision|migration|v2 schema|drop-and-recreate" specs/042-sk-deep-research-review-improvement-2' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: specs/042-sk-deep-research-review-improvement-2: IO error for operation on specs/042-sk-deep-research-review-improvement-2: No such file or directory (os error 2)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Coverage Graph Database
     3	// ───────────────────────────────────────────────────────────────
     4	// SQLite storage for deep-loop coverage graphs (nodes + edges + snapshots).
     5	// Uses dedicated deep-loop-graph.sqlite alongside the memory index DB.
     6	// Follows code-graph-db.ts patterns for schema versioning and transaction safety.
     7	
     8	import Database from 'better-sqlite3';
     9	import { join } from 'node:path';
    10	import { statSync } from 'node:fs';
    11	import { DATABASE_DIR } from '../../core/config.js';
    12	
    13	// ───────────────────────────────────────────────────────────────
    14	// 1. TYPES
    15	// ───────────────────────────────────────────────────────────────
    16	
    17	export type LoopType = 'research' | 'review';
    18	
    19	/** Research node kinds */
    20	export type ResearchNodeKind = 'QUESTION' | 'FINDING' | 'CLAIM' | 'SOURCE';
    21	
    22	/** Review node kinds */
    23	export type ReviewNodeKind = 'DIMENSION' | 'FILE' | 'FINDING' | 'EVIDENCE' | 'REMEDIATION';
    24	
    25	/** All valid node kinds across both loop types */
    26	export type NodeKind = ResearchNodeKind | ReviewNodeKind;
    27	
    28	/** Research edge relation types */
    29	export type ResearchRelation =
    30	  | 'ANSWERS'
    31	  | 'SUPPORTS'
    32	  | 'CONTRADICTS'
    33	  | 'SUPERSEDES'
    34	  | 'DERIVED_FROM'
    35	  | 'COVERS'
    36	  | 'CITES';
    37	
    38	/** Review edge relation types */
    39	export type ReviewRelation =
    40	  | 'COVERS'
    41	  | 'EVIDENCE_FOR'
    42	  | 'CONTRADICTS'
    43	  | 'RESOLVES'
    44	  | 'CONFIRMS'
    45	  | 'ESCALATES'
    46	  | 'IN_DIMENSION'
    47	  | 'IN_FILE';
    48	
    49	/** All valid relation types */
    50	export type Relation = ResearchRelation | ReviewRelation;
    51	
    52	/** A coverage graph node */
    53	export interface CoverageNode {
    54	  id: string;
    55	  specFolder: string;
    56	  loopType: LoopType;
    57	  sessionId: string;
    58	  kind: NodeKind;
    59	  name: string;
    60	  contentHash?: string;
    61	  iteration?: number;
    62	  metadata?: Record<string, unknown>;
    63	  createdAt?: string;
    64	  updatedAt?: string;
    65	}
    66	
    67	/** A coverage graph edge */
    68	export interface CoverageEdge {
    69	  id: string;
    70	  specFolder: string;
    71	  loopType: LoopType;
    72	  sessionId: string;
    73	  sourceId: string;
    74	  targetId: string;
    75	  relation: Relation;
    76	  weight: number;
    77	  metadata?: Record<string, unknown>;
    78	  createdAt?: string;
    79	}
    80	
    81	/** A coverage snapshot (per-iteration metrics) */
    82	export interface CoverageSnapshot {
    83	  id?: number;
    84	  specFolder: string;
    85	  loopType: LoopType;
    86	  sessionId: string;
    87	  iteration: number;
    88	  metrics: Record<string, unknown>;
    89	  nodeCount: number;
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
   171	
   172	  CREATE TABLE IF NOT EXISTS coverage_edges (
   173	    spec_folder TEXT NOT NULL,
   174	    loop_type TEXT NOT NULL,
   175	    session_id TEXT NOT NULL,
   176	    id TEXT NOT NULL,
   177	    source_id TEXT NOT NULL,
   178	    target_id TEXT NOT NULL,
   179	    relation TEXT NOT NULL,
   180	    weight REAL DEFAULT 1.0 CHECK(weight >= 0.0 AND weight <= 2.0),
   181	    metadata TEXT,
   182	    created_at TEXT DEFAULT (datetime('now')),
   183	    CHECK(source_id != target_id),
   184	    PRIMARY KEY (spec_folder, loop_type, session_id, id),
   185	    FOREIGN KEY (spec_folder, loop_type, session_id, source_id)
   186	      REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id),
   187	    FOREIGN KEY (spec_folder, loop_type, session_id, target_id)
   188	      REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id)
   189	  );
   190	
   191	  CREATE TABLE IF NOT EXISTS coverage_snapshots (
   192	    id INTEGER PRIMARY KEY AUTOINCREMENT,
   193	    spec_folder TEXT NOT NULL,
   194	    loop_type TEXT NOT NULL,
   195	    session_id TEXT NOT NULL,
   196	    iteration INTEGER NOT NULL,
   197	    metrics TEXT,
   198	    node_count INTEGER,
   199	    edge_count INTEGER,
   200	    created_at TEXT DEFAULT (datetime('now')),
   201	    UNIQUE(spec_folder, loop_type, session_id, iteration)
   202	  );
   203	
   204	  CREATE TABLE IF NOT EXISTS schema_version (
   205	    version INTEGER NOT NULL
   206	  );
   207	
   208	  CREATE INDEX IF NOT EXISTS idx_coverage_folder_type ON coverage_nodes(spec_folder, loop_type);
   209	  CREATE INDEX IF NOT EXISTS idx_coverage_kind ON coverage_nodes(kind);
   210	  CREATE INDEX IF NOT EXISTS idx_coverage_session ON coverage_nodes(spec_folder, loop_type, session_id);
   211	  CREATE INDEX IF NOT EXISTS idx_coverage_iteration ON coverage_nodes(iteration);
   212	  CREATE INDEX IF NOT EXISTS idx_coverage_edge_source ON coverage_edges(spec_folder, loop_type, session_id, source_id);
   213	  CREATE INDEX IF NOT EXISTS idx_coverage_edge_target ON coverage_edges(spec_folder, loop_type, session_id, target_id);
   214	  CREATE INDEX IF NOT EXISTS idx_coverage_edge_relation ON coverage_edges(relation);
   215	  CREATE INDEX IF NOT EXISTS idx_coverage_edge_folder_type ON coverage_edges(spec_folder, loop_type);
   216	  CREATE INDEX IF NOT EXISTS idx_coverage_edge_session ON coverage_edges(spec_folder, loop_type, session_id);
   217	  CREATE INDEX IF NOT EXISTS idx_coverage_snapshot_session ON coverage_snapshots(session_id);
   218	`;
   219	
   220	// ───────────────────────────────────────────────────────────────
   221	// 4. DATABASE LIFECYCLE
   222	// ───────────────────────────────────────────────────────────────
   223	
   224	let db: Database.Database | null = null;
   225	let dbPath: string | null = null;
   226	
   227	/** Initialize (or get) the coverage graph database */
   228	export function initDb(dbDir: string): Database.Database {
   229	  if (db) return db;
   230	
   231	  try {
   232	    dbPath = join(dbDir, DB_FILENAME);
   233	    db = new Database(dbPath);
   234	    db.pragma('journal_mode = WAL');
   235	    db.pragma('foreign_keys = ON');
   236	
   237	    // Schema migration: v1 used a single `id TEXT PRIMARY KEY`, which let
   238	    // two sessions with the same logical node/edge id overwrite each other
   239	    // (REQ-028 / F004 in the 042 closing audit). v2 switches to a composite
   240	    // primary key of (spec_folder, loop_type, session_id, id). Live upgrades
   241	    // drop the v1 tables before creating the v2 schema — this is a dev-only
   242	    // coverage cache, not durable state, so a drop is safe and idempotent.
   243	    const schemaTableExists = db.prepare(
   244	      "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'",
   245	    ).get() as { name: string } | undefined;
   246	    if (schemaTableExists) {
   247	      const existing = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
   248	      if (existing && existing.version < SCHEMA_VERSION) {
   249	        db.exec(`
   250	          DROP INDEX IF EXISTS idx_coverage_folder_type;
   251	          DROP INDEX IF EXISTS idx_coverage_kind;
   252	          DROP INDEX IF EXISTS idx_coverage_session;
   253	          DROP INDEX IF EXISTS idx_coverage_iteration;
   254	          DROP INDEX IF EXISTS idx_coverage_edge_source;
   255	          DROP INDEX IF EXISTS idx_coverage_edge_target;
   256	          DROP INDEX IF EXISTS idx_coverage_edge_relation;
   257	          DROP INDEX IF EXISTS idx_coverage_edge_folder_type;
   258	          DROP INDEX IF EXISTS idx_coverage_edge_session;
   259	          DROP INDEX IF EXISTS idx_coverage_snapshot_session;
   260	          DROP TABLE IF EXISTS coverage_edges;
   261	          DROP TABLE IF EXISTS coverage_nodes;
   262	          DROP TABLE IF EXISTS coverage_snapshots;
   263	        `);
   264	      }
   265	    }
   266	
   267	    db.exec(SCHEMA_SQL);
   268	
   269	    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
   270	    if (!versionRow) {
   271	      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
   272	    } else if (versionRow.version < SCHEMA_VERSION) {
   273	      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
   274	    }
   275	
   276	    return db;
   277	  } catch (err) {
   278	    if (db) {
   279	      try { db.close(); } catch { /* best effort cleanup */ }
   280	    }
   281	    db = null;
   282	    dbPath = null;
   283	    throw err;
   284	  }
   285	}
   286	
   287	/** Get the current database instance (lazy-initializes if needed) */
   288	export function getDb(): Database.Database {
   289	  if (!db) initDb(DATABASE_DIR);
   290	  return db!;
   291	}
   292	
   293	/** Close the database connection */
   294	export function closeDb(): void {
   295	  if (db) {
   296	    db.close();
   297	    db = null;
   298	    dbPath = null;
   299	  }
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

 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import os from 'node:os';
     3	import path from 'node:path';
     4	import { afterEach, beforeEach, describe, expect, it } from 'vitest';
     5	
     6	import {
     7	  closeDb,
     8	  getEdge,
     9	  getEdges,
    10	  getEdgesFrom,
    11	  getNode,
    12	  getNodes,
    13	  initDb,
    14	  upsertEdge,
    15	  upsertNode,
    16	  type CoverageEdge,
    17	  type CoverageNode,
    18	} from '../../mcp_server/lib/coverage-graph/coverage-graph-db.js';
    19	import { handleCoverageGraphConvergence } from '../../mcp_server/handlers/coverage-graph/convergence.js';
    20	
    21	const SPEC_FOLDER = 'specs/042-session-scope';
    22	const LOOP_TYPE = 'research';
    23	const SESSION_A = 'session-a';
    24	const SESSION_B = 'session-b';
    25	
    26	function makeNode(id: string, sessionId: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
    27	  return {
    28	    id,
    29	    specFolder: SPEC_FOLDER,
    30	    loopType: LOOP_TYPE,
    31	    sessionId,
    32	    kind,
    33	    name,
    34	    metadata,
    35	  };
    36	}
    37	
    38	function makeEdge(id: string, sessionId: string, sourceId: string, targetId: string, relation: CoverageEdge['relation']): CoverageEdge {
    39	  return {
    40	    id,
    41	    specFolder: SPEC_FOLDER,
    42	    loopType: LOOP_TYPE,
    43	    sessionId,
    44	    sourceId,
    45	    targetId,
    46	    relation,
    47	    weight: 1,
    48	  };
    49	}
    50	
    51	function parseHandlerData(
    52	  response: Awaited<ReturnType<typeof handleCoverageGraphConvergence>>,
    53	): Record<string, any> {
    54	  return JSON.parse(response.content[0]?.text ?? '{}').data ?? {};
    55	}
    56	
    57	describe('coverage graph session isolation', () => {
    58	  let tempDir = '';
    59	
    60	  beforeEach(() => {
    61	    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-session-isolation-'));
    62	    initDb(tempDir);
    63	
    64	    const sessionANodes: CoverageNode[] = [
    65	      makeNode('q-a', SESSION_A, 'QUESTION', 'Question A'),
    66	      makeNode('f-a-1', SESSION_A, 'FINDING', 'Finding A1'),
    67	      makeNode('f-a-2', SESSION_A, 'FINDING', 'Finding A2'),
    68	      makeNode('s-a-1', SESSION_A, 'SOURCE', 'Source A1', { quality_class: 'primary' }),
    69	      makeNode('s-a-2', SESSION_A, 'SOURCE', 'Source A2', { quality_class: 'secondary' }),
    70	    ];
    71	
    72	    const sessionBNodes: CoverageNode[] = [
    73	      makeNode('q-b', SESSION_B, 'QUESTION', 'Question B'),
    74	      makeNode('f-b-1', SESSION_B, 'FINDING', 'Finding B1'),
    75	    ];
    76	
    77	    const sessionAEdges: CoverageEdge[] = [
    78	      makeEdge('a-answers-1', SESSION_A, 'f-a-1', 'q-a', 'ANSWERS'),
    79	      makeEdge('a-answers-2', SESSION_A, 'f-a-2', 'q-a', 'ANSWERS'),
    80	      makeEdge('a-cites-1', SESSION_A, 'f-a-1', 's-a-1', 'CITES'),
    81	      makeEdge('a-cites-2', SESSION_A, 'f-a-2', 's-a-2', 'CITES'),
    82	    ];
    83	
    84	    const sessionBEdges: CoverageEdge[] = [
    85	      makeEdge('b-answers-1', SESSION_B, 'f-b-1', 'q-b', 'ANSWERS'),
    86	    ];
    87	
    88	    for (const node of [...sessionANodes, ...sessionBNodes]) {
    89	      upsertNode(node);
    90	    }
    91	
    92	    for (const edge of [...sessionAEdges, ...sessionBEdges]) {
    93	      upsertEdge(edge);
    94	    }
    95	  });
    96	
    97	  afterEach(() => {
    98	    try {
    99	      closeDb();
   100	    } catch {
   101	      // best effort cleanup
   102	    }
   103	    fs.rmSync(tempDir, { recursive: true, force: true });
   104	  });
   105	
   106	  it('returns only the requested session nodes when sessionId is provided', () => {
   107	    const sessionNodes = getNodes({
   108	      specFolder: SPEC_FOLDER,
   109	      loopType: LOOP_TYPE,
   110	      sessionId: SESSION_A,
   111	    });
   112	
   113	    expect(sessionNodes.map(node => node.id).sort()).toEqual([
   114	      'f-a-1',
   115	      'f-a-2',
   116	      'q-a',
   117	      's-a-1',
   118	      's-a-2',
   119	    ]);
   120	
   121	    const aggregateNodes = getNodes({
   122	      specFolder: SPEC_FOLDER,
   123	      loopType: LOOP_TYPE,
   124	    });
   125	
   126	    expect(aggregateNodes.map(node => node.id).sort()).toEqual([
   127	      'f-a-1',
   128	      'f-a-2',
   129	      'f-b-1',
   130	      'q-a',
   131	      'q-b',
   132	      's-a-1',
   133	      's-a-2',
   134	    ]);
   135	  });
   136	
   137	  it('returns only the requested session edges when sessionId is provided', () => {
   138	    const sessionEdges = getEdges({
   139	      specFolder: SPEC_FOLDER,
   140	      loopType: LOOP_TYPE,
   141	      sessionId: SESSION_A,
   142	    });
   143	
   144	    expect(sessionEdges.map(edge => edge.id).sort()).toEqual([
   145	      'a-answers-1',
   146	      'a-answers-2',
   147	      'a-cites-1',
   148	      'a-cites-2',
   149	    ]);
   150	
   151	    const aggregateEdges = getEdges({
   152	      specFolder: SPEC_FOLDER,
   153	      loopType: LOOP_TYPE,
   154	    });
   155	
   156	    expect(aggregateEdges.map(edge => edge.id).sort()).toEqual([
   157	      'a-answers-1',
   158	      'a-answers-2',
   159	      'a-cites-1',
   160	      'a-cites-2',
   161	      'b-answers-1',
   162	    ]);
   163	  });
   164	
   165	  it('computes convergence from the session-scoped subset and defaults to all sessions when sessionId is omitted', async () => {
   166	    const scopedData = parseHandlerData(await handleCoverageGraphConvergence({
   167	      specFolder: SPEC_FOLDER,
   168	      loopType: LOOP_TYPE,
   169	      sessionId: SESSION_A,
   170	    }));
   171	
   172	    expect(scopedData.namespace).toMatchObject({
   173	      specFolder: SPEC_FOLDER,
   174	      loopType: LOOP_TYPE,
   175	      sessionId: SESSION_A,
   176	    });
   177	    expect(scopedData.scopeMode).toBe('session');
   178	    expect(scopedData.nodeCount).toBe(5);
   179	    expect(scopedData.edgeCount).toBe(4);
   180	    expect(scopedData.signals.questionCoverage).toBe(1);
   181	    expect(scopedData.signals.sourceDiversity).toBe(2);
   182	
   183	    const aggregateData = parseHandlerData(await handleCoverageGraphConvergence({
   184	      specFolder: SPEC_FOLDER,
   185	      loopType: LOOP_TYPE,
   186	    }));
   187	
   188	    expect(aggregateData.namespace).toMatchObject({
   189	      specFolder: SPEC_FOLDER,
   190	      loopType: LOOP_TYPE,
   191	    });
   192	    expect(aggregateData.namespace.sessionId).toBeUndefined();
   193	    expect(aggregateData.scopeMode).toBe('all_sessions_default');
   194	    expect(aggregateData.nodeCount).toBe(7);
   195	    expect(aggregateData.edgeCount).toBe(5);
   196	    expect(aggregateData.signals.questionCoverage).toBe(0.5);
   197	  });
   198	});
   199	
   200	// ───────────────────────────────────────────────────────────────
   201	// REQ-028 (F004, F005 in the 042 closing audit): shared-ID
   202	// collision regression. Two sessions intentionally reuse the same
   203	// logical node and edge IDs, upsert independently, and the DB must
   204	// keep them as disjoint rows — an upsert in session B must never
   205	// overwrite the matching row in session A. The earlier suite only
   206	// exercised filtered reads over disjoint fixtures, so it would have
   207	// passed against the broken v1 schema too. This suite fails before
   208	// the composite-key migration and passes after.
   209	// ───────────────────────────────────────────────────────────────
   210	describe('coverage graph session isolation — shared-ID collisions', () => {
   211	  const SHARED_SPEC = 'specs/042-session-collision';
   212	  const SHARED_LOOP_TYPE: CoverageNode['loopType'] = 'research';
   213	  const SESSION_X = 'session-x';
   214	  const SESSION_Y = 'session-y';
   215	
   216	  const nsX = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_X };
   217	  const nsY = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_Y };
   218	
   219	  function collisionNode(sessionId: string, id: string, name: string): CoverageNode {
   220	    return {
   221	      id,
   222	      specFolder: SHARED_SPEC,
   223	      loopType: SHARED_LOOP_TYPE,
   224	      sessionId,
   225	      kind: 'QUESTION',
   226	      name,
   227	    };
   228	  }
   229	
   230	  function collisionEdge(sessionId: string, id: string, sourceId: string, targetId: string): CoverageEdge {
   231	    return {
   232	      id,
   233	      specFolder: SHARED_SPEC,
   234	      loopType: SHARED_LOOP_TYPE,
   235	      sessionId,
   236	      sourceId,
   237	      targetId,
   238	      relation: 'ANSWERS',
   239	      weight: 1,
   240	    };
   241	  }
   242	
   243	  let tempDir = '';
   244	
   245	  beforeEach(() => {
   246	    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-collision-'));
   247	    initDb(tempDir);
   248	  });
   249	
   250	  afterEach(() => {
   251	    try {
   252	      closeDb();
   253	    } catch {
   254	      // best effort cleanup
   255	    }
   256	    fs.rmSync(tempDir, { recursive: true, force: true });
   257	  });
   258	
   259	  it('keeps session rows disjoint when two sessions upsert the same node id', () => {
   260	    // Session X writes "q-shared" first with one name.
   261	    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X text'));
   262	    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X text');
   263	    expect(getNode(nsY, 'q-shared')).toBeNull();
   264	
   265	    // Session Y upserts the same logical id with a different name.
   266	    // Under the v1 bare-`id` primary key this overwrote session X's row;
   267	    // under v2 it must create an independent session-Y row.
   268	    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y text'));
   269	
   270	    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X text');
   271	    expect(getNode(nsY, 'q-shared')?.name).toBe('Question Y text');
   272	
   273	    const allSessionX = getNodes(nsX).map((n) => n.id);
   274	    const allSessionY = getNodes(nsY).map((n) => n.id);
   275	    expect(allSessionX).toEqual(['q-shared']);
   276	    expect(allSessionY).toEqual(['q-shared']);
   277	
   278	    const aggregate = getNodes({ specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE });
   279	    // Two distinct rows even though the logical id is identical.
   280	    expect(aggregate.length).toBe(2);
   281	  });
   282	
   283	  it('keeps session rows disjoint when two sessions upsert the same edge id', () => {
   284	    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X'));
   285	    upsertNode(collisionNode(SESSION_X, 'f-shared', 'Finding X'));
   286	    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y'));
   287	    upsertNode(collisionNode(SESSION_Y, 'f-shared', 'Finding Y'));
   288	
   289	    upsertEdge(collisionEdge(SESSION_X, 'answers-shared', 'f-shared', 'q-shared'));
   290	    expect(getEdge(nsX, 'answers-shared')).toBeTruthy();
   291	    expect(getEdge(nsY, 'answers-shared')).toBeNull();
   292	
   293	    // The same logical edge id in session Y must not overwrite session X.
   294	    upsertEdge(collisionEdge(SESSION_Y, 'answers-shared', 'f-shared', 'q-shared'));
   295	
   296	    const edgeX = getEdge(nsX, 'answers-shared');
   297	    const edgeY = getEdge(nsY, 'answers-shared');
   298	    expect(edgeX).toBeTruthy();
   299	    expect(edgeY).toBeTruthy();
   300	    expect(edgeX?.sessionId).toBe(SESSION_X);
   301	    expect(edgeY?.sessionId).toBe(SESSION_Y);
   302	
   303	    const aggregate = getEdges({ specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE });
   304	    // Two independent edge rows.
   305	    expect(aggregate.length).toBe(2);
   306	
   307	    // Namespace-scoped traversal reflects the same isolation.
   308	    expect(getEdgesFrom(nsX, 'f-shared').map((e) => e.id)).toEqual(['answers-shared']);
   309	    expect(getEdgesFrom(nsY, 'f-shared').map((e) => e.id)).toEqual(['answers-shared']);
   310	  });
   311	
   312	  it('updating a collided node in one session leaves the other session untouched', () => {
   313	    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X v1'));
   314	    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y v1'));
   315	
   316	    // Upsert-update in session X.
   317	    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X v2'));
   318	
   319	    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X v2');
   320	    expect(getNode(nsY, 'q-shared')?.name).toBe('Question Y v1');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts | sed -n '321,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   321	  });
   322	});

exec
/bin/zsh -lc 'rg --files | rg "042-sk-deep-research-review-improvement-2"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 208ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-006.md
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

exec
/bin/zsh -lc 'find .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 -maxdepth 1 -mindepth 1 -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch

exec
/bin/zsh -lc 'rg -n "coverage-graph-db|session-isolation|REQ-028|shared-ID|collision|composite primary key|drop-and-recreate|schema version" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-* .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-* .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-state.jsonl' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:1464:.opencode/skill/sk-deep-review/references/state_format.md:683:  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:1516:.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md:50:| DRV-015 | Review iterations emit structured graphEvents | Verify completed review iterations emit `graphEvents` with `dimension_node`, `file_node`, and `finding_node` coverage. | Validate the structured `graphEvents` contract for sk-deep-review. Confirm that graph-aware review convergence expects `graphEvents` in iteration records, and that the graph replay tests show review JSONL records carrying `dimension_node`, `file_node`, and `finding_node` entries, then return a concise operator-facing verdict. | 1. `bash: rg -n 'graphEvents|review iteration records|graph-aware review convergence' .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'graphEvents|dimension_node|file_node|finding_node|reviewNodeTypes' .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` -> 3. `bash: rg -n 'graphEvents|finding_node' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | `graphEvents` used as iteration-record input; replay tests show review node-type coverage including `dimension_node`, `file_node`, and `finding_node`. | Capture the convergence reference lines that describe `graphEvents` in review iteration records, the review node-type list, and one replay example showing JSONL-shaped `graphEvents`. | PASS if the convergence reference and replay tests agree that completed review iterations emit `graphEvents` and that review graph node coverage includes `dimension_node`, `file_node`, and `finding_node`; FAIL if any of those pieces are missing or contradictory. | Privilege the convergence reference for the contract and the replay tests for concrete review node-type evidence. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:2510:   683	  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:2512:   685	    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:2513:   686	    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:2515:   688	  "counterevidenceSought": "Grepped the module for compound-key upserts, checked migration scripts, and inspected session-isolation.vitest.ts for a collision regression — none found.",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md:2519:   692	  "downgradeTrigger": "If a composite primary key `(spec_folder, loop_type, session_id, id)` lands and a collision regression covers the ID-reuse path, downgrade to P2 tech-debt.",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:263:- `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/plan.md:105:- [x] Session isolation and graph-aware stop tests were added. `[EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts; graph-aware-stop.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/checklist.md:59:- [x] CHK-021 [P0] Dedicated session-isolation coverage exists. `[EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/scratch/closing-review.md:83:  - `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:162-194`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/scratch/closing-review.md:86:  - The dedicated session-isolation test currently locks this fallback behavior in as expected output.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/scratch/closing-review.md:121:| REQ-024 | Pass with test blind spot | `session-isolation.vitest.ts` exists, but it explicitly blesses the `all_sessions_default` fallback when `sessionId` is omitted: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:162-194`. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/tasks.md:57:- [x] T013 Added session-scoped graph reads and dedicated isolation coverage. `[EVIDENCE: v1.6.0.0; v1.3.0.0; .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/tasks.md:83:- [x] T026 Dedicated graph and reducer suites exist for the phase. `[EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts; session-isolation.vitest.ts]`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/graph-metadata.json:61:      ".opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts",

codex
I’ve reached the implementation path that actually enforces the composite key. I’m reading the upsert and lookup code next to confirm the schema fix wasn’t only declarative, and to see whether the new test would have caught the old collision bug.
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md | sed -n '220,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts | sed -n '320,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	
   221	| Risk ID | Description | Impact | Likelihood | Mitigation |
   222	|---------|-------------|--------|------------|------------|
   223	| R-001 | Graph integration is described as active, but packet references are incomplete or broken. | High | Use the three release notes and explicit phase-local evidence. |
   224	| R-002 | Closing-audit fixes are lost during packet cleanup. | Medium | Keep `scratch/closing-review.md`, `c07c9fbcf`, and `f99739742` in the packet evidence chain. |
   225	| R-003 | The packet preserves planning language instead of shipped reality. | Medium | Reframe the packet as completed delivery plus remediation. |
   226	| R-004 | Validator failures recur because of shorthand references. | Medium | Use explicit repo-relative paths and current packet-local links only. |
   227	| R-005 | Future maintainers cannot tell whether the packet was actually finished. | Low | Mark every task and checklist item complete with concrete evidence, plus include strict-validation proof. |
   228	
   229	---
   230	
   231	## 11. USER STORIES
   232	
   233	- As a maintainer, I want one clean phase packet that shows what Phase 008 actually shipped so I can audit the runtime-truth changes quickly.
   234	- As a reviewer, I want the packet to show both the initial release and the later closing-audit remediation so I can trust the release-readiness story.
   235	- As a validator, I want the packet to follow the current Level 3 template so recursive strict validation passes cleanly.
   236	- As a future operator, I want the packet to point me at the correct release notes, fixtures, playbooks, and closing-review artifact instead of dead shorthand paths.
   237	
   238	---
   239	
   240	<!-- ANCHOR:questions -->
   241	## 12. OPEN QUESTIONS
   242	
   243	- None for packet closeout. The implementation and the release-readiness remediation are already shipped; this pass only reconciles the phase docs to the current template and evidence chain.
   244	<!-- /ANCHOR:questions -->
   245	
   246	---
   247	
   248	## 13. RELATED DOCUMENTS
   249	
   250	- `../research/research.md`
   251	- `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md`
   252	- `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md`
   253	- `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md`
   254	- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/scratch/closing-review.md`
   255	- `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md`
   256	- `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md`
   257	- `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md`
   258	- `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md`
   259	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md`
   260	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/033-insufficient-sample.md`
   261	- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md`
   262	- `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts`
   263	- `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`

 succeeded in 0ms:
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
   331	 */
   332	export function upsertNode(node: CoverageNode): string {
   333	  const d = getDb();
   334	  const now = new Date().toISOString();
   335	  const metadataStr = node.metadata ? JSON.stringify(node.metadata) : null;
   336	
   337	  const existing = d.prepare(
   338	    'SELECT id FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   339	  ).get(node.specFolder, node.loopType, node.sessionId, node.id) as { id: string } | undefined;
   340	  if (existing) {
   341	    d.prepare(`
   342	      UPDATE coverage_nodes SET
   343	        kind = ?, name = ?, content_hash = ?, iteration = ?,
   344	        metadata = ?, updated_at = ?
   345	      WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?
   346	    `).run(
   347	      node.kind, node.name, node.contentHash ?? null, node.iteration ?? null,
   348	      metadataStr, now,
   349	      node.specFolder, node.loopType, node.sessionId, node.id,
   350	    );
   351	    return node.id;
   352	  }
   353	
   354	  d.prepare(`
   355	    INSERT INTO coverage_nodes (
   356	      spec_folder, loop_type, session_id, id, kind, name,
   357	      content_hash, iteration, metadata, created_at, updated_at
   358	    )
   359	    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   360	  `).run(
   361	    node.specFolder, node.loopType, node.sessionId, node.id,
   362	    node.kind, node.name, node.contentHash ?? null,
   363	    node.iteration ?? null, metadataStr, now, now,
   364	  );
   365	  return node.id;
   366	}
   367	
   368	/** Get a node by ID inside a namespace. */
   369	export function getNode(ns: Namespace, id: string): CoverageNode | null {
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
   491	  const d = getDb();
   492	  const rows = d.prepare(
   493	    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND target_id = ?',
   494	  ).all(ns.specFolder, ns.loopType, ns.sessionId, targetId) as Record<string, unknown>[];
   495	  return rows.map(rowToEdge);
   496	}
   497	
   498	/** Update an edge's weight and/or metadata inside a namespace. */
   499	export function updateEdge(
   500	  ns: Namespace,
   501	  id: string,
   502	  updates: { weight?: number; metadata?: Record<string, unknown> },
   503	): boolean {
   504	  if (!ns.sessionId) return false;
   505	  const d = getDb();
   506	  const existing = d.prepare(
   507	    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   508	  ).get(ns.specFolder, ns.loopType, ns.sessionId, id) as Record<string, unknown> | undefined;
   509	  if (!existing) return false;
   510	
   511	  const weight = updates.weight !== undefined ? clampWeight(updates.weight) : existing.weight as number;
   512	  const metadataStr = updates.metadata ? JSON.stringify(updates.metadata) : existing.metadata as string | null;
   513	
   514	  d.prepare(
   515	    'UPDATE coverage_edges SET weight = ?, metadata = ? WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   516	  ).run(weight, metadataStr, ns.specFolder, ns.loopType, ns.sessionId, id);
   517	  return true;
   518	}
   519	
   520	/** Delete an edge by ID inside a namespace. */
   521	export function deleteEdge(ns: Namespace, id: string): boolean {
   522	  if (!ns.sessionId) return false;
   523	  const d = getDb();
   524	  const result = d.prepare(
   525	    'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
   526	  ).run(ns.specFolder, ns.loopType, ns.sessionId, id);
   527	  return result.changes > 0;
   528	}
   529	
   530	// ───────────────────────────────────────────────────────────────
   531	// 8. SNAPSHOT OPERATIONS
   532	// ───────────────────────────────────────────────────────────────
   533	
   534	/** Create a coverage snapshot for a given iteration */
   535	export function createSnapshot(snapshot: CoverageSnapshot): number {
   536	  const d = getDb();
   537	  const metricsStr = JSON.stringify(snapshot.metrics);
   538	
   539	  const result = d.prepare(`
   540	    INSERT INTO coverage_snapshots (
   541	      spec_folder, loop_type, session_id, iteration, metrics, node_count, edge_count
   542	    )
   543	    VALUES (?, ?, ?, ?, ?, ?, ?)
   544	    ON CONFLICT(spec_folder, loop_type, session_id, iteration) DO UPDATE SET
   545	      metrics = excluded.metrics,
   546	      node_count = excluded.node_count,
   547	      edge_count = excluded.edge_count
   548	  `).run(
   549	    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
   550	    metricsStr, snapshot.nodeCount, snapshot.edgeCount,
   551	  );
   552	  return Number(result.lastInsertRowid);
   553	}
   554	
   555	/** Get the latest snapshot for a namespace */
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
   636	    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
   637	  }
   638	
   639	  return {
   640	    totalNodes,
   641	    totalEdges,
   642	    nodesByKind,
   643	    edgesByRelation,
   644	    lastIteration,
   645	    schemaVersion: SCHEMA_VERSION,
   646	    dbFileSize,
   647	  };
   648	}
   649	
   650	// ───────────────────────────────────────────────────────────────
   651	// 10. BATCH UPSERT (TRANSACTION)
   652	// ───────────────────────────────────────────────────────────────
   653	
   654	/** Batch upsert nodes and edges in a single transaction */
   655	export function batchUpsert(
   656	  nodes: CoverageNode[],
   657	  edges: CoverageEdge[],
   658	): { insertedNodes: number; insertedEdges: number; rejectedEdges: number } {
   659	  const d = getDb();
   660	  let insertedNodes = 0;
   661	  let insertedEdges = 0;
   662	  let rejectedEdges = 0;
   663	
   664	  const tx = d.transaction(() => {
   665	    for (const node of nodes) {
   666	      upsertNode(node);
   667	      insertedNodes++;
   668	    }
   669	    for (const edge of edges) {
   670	      const result = upsertEdge(edge);
   671	      if (result) {
   672	        insertedEdges++;
   673	      } else {
   674	        rejectedEdges++;
   675	      }
   676	    }
   677	  });
   678	  tx();
   679	
   680	  return { insertedNodes, insertedEdges, rejectedEdges };
   681	}
   682	
   683	// ───────────────────────────────────────────────────────────────
   684	// 11. ROW CONVERTERS
   685	// ───────────────────────────────────────────────────────────────
   686	
   687	function rowToNode(r: Record<string, unknown>): CoverageNode {
   688	  return {
   689	    id: r.id as string,
   690	    specFolder: r.spec_folder as string,
   691	    loopType: r.loop_type as LoopType,
   692	    sessionId: r.session_id as string,
   693	    kind: r.kind as NodeKind,
   694	    name: r.name as string,
   695	    contentHash: r.content_hash as string | undefined,
   696	    iteration: r.iteration as number | undefined,
   697	    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
   698	    createdAt: r.created_at as string | undefined,
   699	    updatedAt: r.updated_at as string | undefined,
   700	  };
   701	}
   702	
   703	function rowToEdge(r: Record<string, unknown>): CoverageEdge {
   704	  return {
   705	    id: r.id as string,
   706	    specFolder: r.spec_folder as string,
   707	    loopType: r.loop_type as LoopType,
   708	    sessionId: r.session_id as string,
   709	    sourceId: r.source_id as string,
   710	    targetId: r.target_id as string,
   711	    relation: r.relation as Relation,
   712	    weight: r.weight as number,
   713	    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
   714	    createdAt: r.created_at as string | undefined,
   715	  };
   716	}
   717	
   718	function rowToSnapshot(r: Record<string, unknown>): CoverageSnapshot {
   719	  return {
   720	    id: r.id as number,
   721	    specFolder: r.spec_folder as string,
   722	    loopType: r.loop_type as LoopType,
   723	    sessionId: r.session_id as string,
   724	    iteration: r.iteration as number,
   725	    metrics: r.metrics ? JSON.parse(r.metrics as string) : {},
   726	    nodeCount: r.node_count as number,
   727	    edgeCount: r.edge_count as number,
   728	    createdAt: r.created_at as string | undefined,
   729	  };
   730	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-013.md | sed -n '2498,2524p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2498	   671	<!-- ANCHOR:claim-adjudication -->
  2499	   672	## 9. CLAIM ADJUDICATION
  2500	   673	
  2501	   674	Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`) — a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
  2502	   675	
  2503	   676	### Typed Packet Schema (required)
  2504	   677	
  2505	   678	Embed the packet inside the iteration file for each new P0/P1 finding. The orchestrator parses it after evaluation and persists the validation result.
  2506	   679	
  2507	   680	```json
  2508	   681	{
  2509	   682	  "findingId": "F003",
  2510	   683	  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
  2511	   684	  "evidenceRefs": [
  2512	   685	    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154",
  2513	   686	    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302"
  2514	   687	  ],
  2515	   688	  "counterevidenceSought": "Grepped the module for compound-key upserts, checked migration scripts, and inspected session-isolation.vitest.ts for a collision regression — none found.",
  2516	   689	  "alternativeExplanation": "Could be intentional single-tenant design, but phase 008 REQ-024 explicitly requires session isolation, so this is rejected.",
  2517	   690	  "finalSeverity": "P1",
  2518	   691	  "confidence": 0.86,
  2519	   692	  "downgradeTrigger": "If a composite primary key `(spec_folder, loop_type, session_id, id)` lands and a collision regression covers the ID-reuse path, downgrade to P2 tech-debt.",
  2520	   693	  "transitions": [
  2521	   694	    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  2522	   695	  ]
  2523	   696	}
  2524	   697	```

codex
The phase docs confirm this area was a remediation target of an earlier P1. I’m checking whether the shipped migration and the new regression suite really close that security boundary, or whether they still leave a reachable collision or data-destruction path.
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/scratch/closing-review.md | sed -n '70,135p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    70	- Recommended fix:
    71	  - Source recency from the JSONL iteration records rather than markdown iteration files, or parse/store iteration timestamps in `parseIterationFile()` before comparing blocked-stop freshness.
    72	
    73	### P1-04: Session isolation is still optional and incomplete in shared coverage-graph reads
    74	
    75	- Severity: P1
    76	- Dimension: traceability
    77	- Evidence:
    78	  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:99`
    79	  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/decision-record.md:169-170`
    80	  - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:196-199`
    81	  - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-73`
    82	  - `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:226-273`
    83	  - `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:162-194`
    84	- Description:
    85	  - REQ-012 and ADR-001/003 treat `specFolder + loopType + sessionId` scoping as mandatory, but the handlers still intentionally fall back to `all_sessions_default` aggregation when `sessionId` is omitted. More importantly, `findProvenanceChain()` delegates to helpers that filter by `sessionId` only and do not constrain by `specFolder` or `loopType`, so provenance reads are not fully namespaced even when a namespace object is already available.
    86	  - The dedicated session-isolation test currently locks this fallback behavior in as expected output.
    87	- Recommended fix:
    88	  - Remove the cross-session default from the phase-008 coverage-graph read surfaces, make `sessionId` mandatory on these handlers/helpers, and thread `specFolder` + `loopType` through the provenance helper queries as well.
    89	
    90	## P2 Findings (advisory)
    91	
    92	None found.
    93	
    94	## Contract Self-Compliance Check
    95	
    96	| REQ | Status | Evidence / Notes |
    97	|-----|--------|------------------|
    98	| REQ-001 | Pass | Research auto/confirm add first-class `blocked_stop` emission: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:330-338`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:350-358`. |
    99	| REQ-002 | Pass | Research pause/recovery normalization is present: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:353-361`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:373-381`. |
   100	| REQ-003 | Pass | Review auto/confirm add blocked-stop and normalized pause/recovery flow: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:471-518`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:471-518`. |
   101	| REQ-004 | Pass | Improve-agent auto/confirm wire journal events at start, iteration boundaries, and end: `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:132-183`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml` mirrors. |
   102	| REQ-005 | Pass | CLI example corrected in `.opencode/command/improve/agent.md` and implementation summary documents the fix: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:48-50`. |
   103	| REQ-006 | Pass | `trade-off-detector.cjs` min data gate shipped and reducer surfaces `insufficientData`: see implementation summary `.opencode/specs/.../implementation-summary.md:49-50`, reducer `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:127-142,443-476`. |
   104	| REQ-007 | Pass | `benchmark-stability.cjs` min replay gate shipped and reducer surfaces `insufficientSample`: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:144-159,443-476`. |
   105	| REQ-008 | Pass | ADR-001 chooses MCP handler canonical: `.opencode/specs/.../decision-record.md:36-77`. |
   106	| REQ-009 | Pass | Live YAML path genuinely calls graph convergence before stop vote and graph upsert after reduction in both loop families: research `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-266,415-433`; review `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:339-360,600-619`. |
   107	| REQ-010 | Pass | CJS/TS parity work landed and is guarded by parity tests: `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:1-3`, `.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:210-252`. |
   108	| REQ-011 | Pass | Decision record and implementation summary both say the structural tools were provisioned on the live path: `.opencode/specs/.../decision-record.md:125-159`, `.opencode/specs/.../implementation-summary.md:59-60`. |
   109	| REQ-012 | **Gap** | Session scoping is still optional and incomplete. Handlers intentionally allow `all_sessions_default`, and provenance helpers only filter by `sessionId`: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:196-199`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-73`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:226-273`. |
   110	| REQ-013 | **Gap** | Reducers expose `graphConvergenceScore`, but not as the real handler output. Research falls back to `0`; review averages raw signal values: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:217-237`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:392-413`, handler output `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:188-205`. |
   111	| REQ-014 | **Gap** | Blocked-stop promotion exists, but review live-path graph blockers can violate the `blockedBy: string[]` contract and the strategy can keep stale blocked-stop guidance: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:417-450`, `.opencode/skill/sk-deep-review/references/state_format.md:237-262`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:604-623,737-753`. |
   112	| REQ-015 | Pass | Review reducer now records `corruptionWarnings` and exits non-zero unless `--lenient`: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:74-106,827-857,911-914`. |
   113	| REQ-016 | Pass | Missing anchors now throw unless `--create-missing-anchors` is supplied: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:548-569,880-888`. |
   114	| REQ-017 | Pass | ADR-002 chose replay consumers and reducer now reads journal/lineage/coverage artifacts: `.opencode/specs/.../decision-record.md:80-121`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:178-281,841-849`. |
   115	| REQ-018 | Pass | `persistentSameSeverity` and `severityChanged` arrays shipped: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:469-509,774-776`. |
   116	| REQ-019 | Pass | Improve-agent dashboard includes distinct Sample Quality section: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:747-763,781-818`. |
   117	| REQ-020 | Pass | Interrupted-session fixture exists: `.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/README.md:1-1` and spec summary `.opencode/specs/.../implementation-summary.md:77-79`. |
   118	| REQ-021 | Pass | Review blocked-stop fixture exists and exercises reducer surfacing: `.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:1-24`. |
   119	| REQ-022 | Pass | Low-sample improve-agent fixture exists per implementation summary and fixture tree: `.opencode/specs/.../implementation-summary.md:79-80`. |
   120	| REQ-023 | Pass with test blind spot | `graph-aware-stop.vitest.ts` exists, but it seeds synthetic `signals.blendedScore` instead of the real handler shape: `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:195-244`. |
   121	| REQ-024 | Pass with test blind spot | `session-isolation.vitest.ts` exists, but it explicitly blesses the `all_sessions_default` fallback when `sessionId` is omitted: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:162-194`. |
   122	| REQ-025 | Pass | New manual testing playbooks exist across all three loop families: see implementation summary `.opencode/specs/.../implementation-summary.md:81-88`. |
   123	
   124	## Graph Integration Quality Check
   125	
   126	`deep_loop_graph_upsert` and `deep_loop_graph_convergence` are genuinely on the live YAML path, so the graph is not just emitted on paper. Research calls convergence before the inline stop vote and upsert after reducer refresh at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-266,415-433`; review mirrors that at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:339-360,600-619`. On the "actively and smartly utilized" criterion, the answer is therefore **yes for live stop gating**.
   127	
   128	The surfacing half is not honest enough yet. `graphConvergenceScore` is exposed in both reducers, but it is not the canonical convergence output:
   129	
   130	- Research reducer expects `signals.blendedScore` or `signals.score` and otherwise records `0`: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:225-229`.
   131	- Review reducer averages raw numeric signals when no score field exists: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:397-413`.
   132	- The canonical handler returns raw `signals` plus `decision`/`blockers`, not a numeric score field: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:188-205`.
   133	
   134	So the graph is actively consulted on the live path, but the reducer-owned score that is supposed to prove that consultation is not yet a trustworthy representation of the handler output.
   135	

exec
/bin/zsh -lc "rg -n \"getNode\\(|getNodes\\(|getEdges\\(|getLatestSnapshot\\(|getSnapshots\\(|coverage_graph|deep-loop-graph|sessionId\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:206:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:209:  let sessionId: string | undefined = rawSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:217:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:228:    sessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:273:    sessionId &&
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:280:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:340:          sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:367:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:395:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:466:      sessionId: sessionId!,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:  if (!useCognitive && sessionId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:537:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:127:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:145:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:207:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:243:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:321:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:332:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:385:  sessionId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:449:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:450:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:453:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'routeAs', 'mergeModeHint', 'tenantId', 'userId', 'agentId', 'sessionId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:459:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:474:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1231:  const sessionId: string = (
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1246:      sessionId,
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1296:    : typeof data._sessionId === 'string'
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1297:      ? data._sessionId
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1574:    SESSION_ID: sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:187:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:218:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:219:    sessionId,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:262:  sessionId?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274:  _sessionId?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1408:    sessionId: capture.sessionId ?? (raw.session_id as string | undefined),
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1706:    _sessionId: normalizedCapture.sessionId,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1719:      : normalizedCapture.sessionId,
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:68:  sessionId: string = 'replay-session',
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:99:        const statePath = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:101:        const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:168:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:212:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:74:      sessionId: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:81:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, routeAs: { type: 'string', enum: ['narrative_progress', 'narrative_delivery', 'decision', 'handover_state', 'research_finding', 'task_update', 'metadata_only', 'drop'], description: 'Optional routing override hint for canonical continuity saves.' }, mergeModeHint: { type: 'string', enum: ['append-as-paragraph', 'insert-new-adr', 'append-table-row', 'update-in-place', 'append-section'], description: 'Optional merge-mode hint for routed canonical continuity saves.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:310:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:400:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:406:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:497:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:708:  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:714:      sessionId: { type: 'string', minLength: 1, description: 'Session identifier for namespace isolation (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:748:    required: ['specFolder', 'loopType', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:762:      sessionId: { type: 'string', description: 'Optional session filter' },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/README.md:564:| `sessionId` | string | Session ID for deduplication across turns |
.opencode/skill/system-spec-kit/mcp_server/README.md:696:| `sessionId` | string | Session attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:888:| `sessionId` | string | Session identifier |
.opencode/skill/system-spec-kit/mcp_server/README.md:1042:| `sessionId` | string | Filter by session |
.opencode/skill/system-spec-kit/scripts/utils/fact-coercion.ts:27:  sessionId?: string;
.opencode/skill/system-spec-kit/scripts/utils/fact-coercion.ts:95:      sessionId: ctx.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:66:    sessionId: normalizeScopeMatchValue(scope.sessionId),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:43:function handleCompact(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:45:  const pendingCompactPrime = readCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120:    claudeSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:177:function handleResume(sessionId: string): OutputSection[] {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:178:  const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:215:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:217:  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:224:      sections = handleCompact(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:232:      sections = handleResume(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:261:    clearCompactPrime(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:116:function recordToolCall(sessionId?: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:118:  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:119:    lastActiveSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132:function isSessionPrimed(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:133:  return primedSessionIds.has(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:137:function markSessionPrimed(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:138:  primedSessionIds.add(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:139:  lastActiveSessionId = sessionId;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:492:  sessionId?: string,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:494:  // Derive a session key from explicit sessionId or tool args.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:495:  const effectiveSessionId = sessionId
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:496:    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:560: * Reset priming state. When called with a sessionId, clears only that session.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:563:function resetSessionPrimed(sessionId?: string): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:564:  if (sessionId) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:565:    primedSessionIds.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:66:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:128:    claudeSessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:142:const { filtered, dedupStats } = filterSearchResults(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:148:markResultsSent(sessionId, filtered);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:166:  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:176:saveSessionState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:185:checkpointSession(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:196:| Check if should send | `shouldSendMemory(sessionId, memory)` | Before returning single memory |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:197:| Batch check | `shouldSendMemoriesBatch(sessionId, memories)` | Before returning multiple memories |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:198:| Mark single sent | `markMemorySent(sessionId, memory)` | After returning a memory |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:199:| Mark batch sent | `markMemoriesSentBatch(sessionId, memories)` | After returning multiple memories |

exec
/bin/zsh -lc "rg -n \"SCHEMA_VERSION|schema_version|DROP TABLE IF EXISTS coverage_|DROP INDEX IF EXISTS idx_coverage_|initDb\\(|coverage_nodes|coverage_edges|coverage_snapshots\" .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/scripts/tests" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:93:        FROM coverage_nodes n
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:97:            SELECT 1 FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:127:        FROM coverage_nodes n
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:131:            SELECT 1 FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:174:    FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:175:    JOIN coverage_nodes s ON s.id = e.source_id
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:176:    JOIN coverage_nodes t ON t.id = e.target_id
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:269:    FROM coverage_nodes
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:282:    FROM coverage_edges
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:321:      SELECT * FROM coverage_nodes
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:350:    SELECT n.* FROM coverage_nodes n
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:354:        SELECT 1 FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:399:          SELECT COUNT(*) FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:405:          SELECT COALESCE(SUM(e.weight), 0) FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:410:      FROM coverage_nodes n
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:384:    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'DIMENSION'`,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:388:    SELECT COUNT(*) as c FROM coverage_nodes n
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:391:        SELECT 1 FROM coverage_edges e WHERE e.source_id = n.id AND e.relation = 'COVERS'
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:399:    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'`,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:403:    SELECT COUNT(*) as c FROM coverage_nodes n
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:406:        SELECT 1 FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:415:    SELECT id, metadata FROM coverage_nodes
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:429:            `SELECT COUNT(*) as c FROM coverage_edges WHERE target_id = ? AND relation = 'RESOLVES'`,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:441:    `SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND relation = 'EVIDENCE_FOR'`,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:461:    SELECT id, metadata FROM coverage_nodes
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:484:      FROM coverage_edges e
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:485:      JOIN coverage_nodes n ON n.id = e.source_id
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:558:    SELECT metrics FROM coverage_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:105:export const SCHEMA_VERSION = 2;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:157:  CREATE TABLE IF NOT EXISTS coverage_nodes (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:172:  CREATE TABLE IF NOT EXISTS coverage_edges (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:186:      REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id),
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:188:      REFERENCES coverage_nodes (spec_folder, loop_type, session_id, id)
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:191:  CREATE TABLE IF NOT EXISTS coverage_snapshots (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:204:  CREATE TABLE IF NOT EXISTS schema_version (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:208:  CREATE INDEX IF NOT EXISTS idx_coverage_folder_type ON coverage_nodes(spec_folder, loop_type);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:209:  CREATE INDEX IF NOT EXISTS idx_coverage_kind ON coverage_nodes(kind);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:210:  CREATE INDEX IF NOT EXISTS idx_coverage_session ON coverage_nodes(spec_folder, loop_type, session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:211:  CREATE INDEX IF NOT EXISTS idx_coverage_iteration ON coverage_nodes(iteration);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:212:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_source ON coverage_edges(spec_folder, loop_type, session_id, source_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:213:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_target ON coverage_edges(spec_folder, loop_type, session_id, target_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:214:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_relation ON coverage_edges(relation);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:215:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_folder_type ON coverage_edges(spec_folder, loop_type);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:216:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_session ON coverage_edges(spec_folder, loop_type, session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:217:  CREATE INDEX IF NOT EXISTS idx_coverage_snapshot_session ON coverage_snapshots(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:228:export function initDb(dbDir: string): Database.Database {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:244:      "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_version'",
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:247:      const existing = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:248:      if (existing && existing.version < SCHEMA_VERSION) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:250:          DROP INDEX IF EXISTS idx_coverage_folder_type;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:251:          DROP INDEX IF EXISTS idx_coverage_kind;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:252:          DROP INDEX IF EXISTS idx_coverage_session;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:253:          DROP INDEX IF EXISTS idx_coverage_iteration;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:254:          DROP INDEX IF EXISTS idx_coverage_edge_source;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:255:          DROP INDEX IF EXISTS idx_coverage_edge_target;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:256:          DROP INDEX IF EXISTS idx_coverage_edge_relation;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:257:          DROP INDEX IF EXISTS idx_coverage_edge_folder_type;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:258:          DROP INDEX IF EXISTS idx_coverage_edge_session;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:259:          DROP INDEX IF EXISTS idx_coverage_snapshot_session;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:260:          DROP TABLE IF EXISTS coverage_edges;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:261:          DROP TABLE IF EXISTS coverage_nodes;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:262:          DROP TABLE IF EXISTS coverage_snapshots;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:269:    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:271:      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:272:    } else if (versionRow.version < SCHEMA_VERSION) {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:273:      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:289:  if (!db) initDb(DATABASE_DIR);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:338:    'SELECT id FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:342:      UPDATE coverage_nodes SET
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:355:    INSERT INTO coverage_nodes (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:373:    'SELECT * FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:382:  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause}`).all(...params) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:390:  const rows = d.prepare(`SELECT * FROM coverage_nodes WHERE ${clause} AND kind = ?`).all(...params, kind) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:400:      'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND (source_id = ? OR target_id = ?)',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:403:      'DELETE FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:432:    'SELECT id FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:436:      UPDATE coverage_edges SET
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:447:    INSERT INTO coverage_edges (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:465:    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:474:  const rows = d.prepare(`SELECT * FROM coverage_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:483:    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND source_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:493:    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND target_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:507:    'SELECT * FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:515:    'UPDATE coverage_edges SET weight = ?, metadata = ? WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:525:    'DELETE FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:540:    INSERT INTO coverage_snapshots (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:560:      SELECT * FROM coverage_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:567:    SELECT * FROM coverage_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:579:      SELECT * FROM coverage_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:586:    SELECT * FROM coverage_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:610:    'SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:614:    'SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:619:    'SELECT kind, COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? GROUP BY kind',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:625:    'SELECT relation, COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? GROUP BY relation',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:630:    'SELECT MAX(iteration) as max_iter FROM coverage_snapshots WHERE spec_folder = ? AND loop_type = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:645:    schemaVersion: SCHEMA_VERSION,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:133:    initDb(tempDir);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62:    initDb(tempDir);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:247:    initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:318:    expect(byId.get(303)).toMatchObject({ publishable: false, exclusionReason: 'missing_schema_version' });
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:9:  CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:188:      schemaVersion: options.schemaVersion ?? CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:230:          schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION + 1,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:233:        expected: { status: 'rejected', category: 'fidelity', reason: 'schema_version_mismatch' },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:153:    const versionRow = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:419:    const beforeVersion = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:423:    db.prepare('UPDATE schema_version SET version = 16 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:430:    const afterVersion = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:32:  SCHEMA_VERSION,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:886:    const db = initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:892:    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:898:    initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:901:    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:906:    initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:943:    initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:963:      initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:980:    initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:10:  GRAPH_METADATA_SCHEMA_VERSION,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:78:    expect(metadata.schema_version).toBe(GRAPH_METADATA_SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:118:      schema_version: 2,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:128:    expect(validation.errors.join(' ')).toContain('schema_version');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:23:    initDb(tempDir);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:400:      const versionRow = db!.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:13:      CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:17:      INSERT INTO schema_version (id, version) VALUES (1, 21);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts:22:    schema_version: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:33:      exclusionReason: 'missing_schema_version',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:3:import { SCHEMA_VERSION, validateBackwardCompatibility } from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:11:      expect(report.missingTables).toEqual(['memory_index', 'schema_version']);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:22:        CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:27:        INSERT INTO schema_version (id, version, updated_at) VALUES (1, ${SCHEMA_VERSION}, datetime('now'));
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:107:      expect(report.schemaVersion).toBe(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:13:      CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:17:      INSERT INTO schema_version (id, version) VALUES (1, 21);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:32:  it('keeps schema_version unchanged when a required migration index build fails', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:37:    database.prepare('UPDATE schema_version SET version = 14 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:49:    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:102:    database.prepare('UPDATE schema_version SET version = 22 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:126:    database.prepare('UPDATE schema_version SET version = 23 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:144:      CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:149:      INSERT INTO schema_version (id, version, updated_at) VALUES (1, 25, datetime('now'));
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:54:  'schema_version',

codex
The database schema itself looks scoped, but I’m seeing query-side joins that may still ignore the new composite identity. I’m reading those call sites carefully, because a correct primary key is not enough if higher-level reads still re-associate rows by bare `id`.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts | sed -n '150,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	          reason: `No incoming ${coverageRelations.join(' or ')} edges`,
   151	        });
   152	      }
   153	    }
   154	  }
   155	
   156	  return gaps;
   157	}
   158	
   159	// ───────────────────────────────────────────────────────────────
   160	// 3. CONTRADICTIONS
   161	// ───────────────────────────────────────────────────────────────
   162	
   163	/**
   164	 * Find all CONTRADICTS edge pairs in a namespace.
   165	 */
   166	export function findContradictions(ns: Namespace): ContradictionPair[] {
   167	  const d = getDb();
   168	  const { specFolder, loopType, sessionId } = ns;
   169	  const edgeFilter = buildSessionFilter('e.session_id', sessionId);
   170	
   171	  const rows = d.prepare(`
   172	    SELECT e.id, e.source_id, e.target_id, e.weight, e.metadata,
   173	           s.name AS source_name, t.name AS target_name
   174	    FROM coverage_edges e
   175	    JOIN coverage_nodes s ON s.id = e.source_id
   176	    JOIN coverage_nodes t ON t.id = e.target_id
   177	    WHERE e.spec_folder = ? AND e.loop_type = ? AND e.relation = 'CONTRADICTS'
   178	      ${edgeFilter.clause}
   179	  `).all(specFolder, loopType, ...edgeFilter.params) as Array<{
   180	    id: string;
   181	    source_id: string;
   182	    target_id: string;
   183	    weight: number;
   184	    metadata: string | null;
   185	    source_name: string;
   186	    target_name: string;
   187	  }>;
   188	
   189	  return rows.map(row => ({
   190	    edgeId: row.id,
   191	    sourceId: row.source_id,
   192	    targetId: row.target_id,
   193	    sourceName: row.source_name,
   194	    targetName: row.target_name,
   195	    weight: row.weight,
   196	    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
   197	  }));
   198	}
   199	
   200	// ───────────────────────────────────────────────────────────────
   201	// 4. PROVENANCE CHAIN
   202	// ───────────────────────────────────────────────────────────────
   203	
   204	/**
   205	 * BFS from a node following CITES/EVIDENCES/DERIVED_FROM/SUPPORTS edges.
   206	 * Detects cycles and returns cumulative path strength.
   207	 */
   208	export function findProvenanceChain(ns: Namespace, nodeId: string, maxDepth: number = 10): ProvenanceStep[] {
   209	  const provenanceRelations = ns.loopType === 'research'
   210	    ? ['CITES', 'DERIVED_FROM', 'SUPPORTS']
   211	    : ['EVIDENCE_FOR', 'CONFIRMS'];
   212	
   213	  const visited = new Set<string>();
   214	  const results: ProvenanceStep[] = [];
   215	  let frontier: Array<{ id: string; depth: number; cumulativeWeight: number }> = [
   216	    { id: nodeId, depth: 0, cumulativeWeight: 1.0 },
   217	  ];
   218	
   219	  while (frontier.length > 0) {
   220	    const next: typeof frontier = [];
   221	
   222	    for (const item of frontier) {
   223	      if (visited.has(item.id) || item.depth >= maxDepth) continue;
   224	      visited.add(item.id);
   225	
   226	      // Phase 008 P1-04 closure: the provenance helpers must constrain by
   227	      // specFolder + loopType + sessionId (full namespace) so provenance reads
   228	      // cannot cross the packet boundary even when sessionId is present.
   229	      const edges = getEdgesFromNode(item.id, ns);
   230	      for (const edge of edges) {
   231	        if (!provenanceRelations.includes(edge.relation)) continue;
   232	        if (visited.has(edge.targetId)) continue;
   233	
   234	        const targetNode = getNodeById(edge.targetId, ns);
   235	        if (!targetNode) continue;
   236	
   237	        const cumWeight = item.cumulativeWeight * edge.weight;
   238	        results.push({
   239	          nodeId: edge.targetId,
   240	          kind: targetNode.kind,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts | sed -n '240,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	          kind: targetNode.kind,
   241	          name: targetNode.name,
   242	          depth: item.depth + 1,
   243	          edgeRelation: edge.relation,
   244	          cumulativeWeight: cumWeight,
   245	        });
   246	
   247	        next.push({ id: edge.targetId, depth: item.depth + 1, cumulativeWeight: cumWeight });
   248	      }
   249	    }
   250	
   251	    frontier = next;
   252	  }
   253	
   254	  return results;
   255	}
   256	
   257	/**
   258	 * Internal helper: get node by ID for provenance chain.
   259	 *
   260	 * Phase 008 P1-04 closure: constrain reads by the full namespace
   261	 * (specFolder + loopType + sessionId) rather than sessionId alone, so
   262	 * provenance cannot cross packet boundaries.
   263	 */
   264	function getNodeById(id: string, ns: Namespace): { kind: string; name: string } | null {
   265	  const d = getDb();
   266	  const sessionFilter = buildSessionFilter('session_id', ns.sessionId);
   267	  const row = d.prepare(`
   268	    SELECT kind, name
   269	    FROM coverage_nodes
   270	    WHERE id = ?
   271	      AND spec_folder = ?
   272	      AND loop_type = ?${sessionFilter.clause}
   273	  `).get(id, ns.specFolder, ns.loopType, ...sessionFilter.params) as { kind: string; name: string } | undefined;
   274	  return row ?? null;
   275	}
   276	
   277	function getEdgesFromNode(sourceId: string, ns: Namespace): CoverageEdge[] {
   278	  const d = getDb();
   279	  const sessionFilter = buildSessionFilter('session_id', ns.sessionId);
   280	  const rows = d.prepare(`
   281	    SELECT *
   282	    FROM coverage_edges
   283	    WHERE source_id = ?
   284	      AND spec_folder = ?
   285	      AND loop_type = ?${sessionFilter.clause}
   286	  `).all(sourceId, ns.specFolder, ns.loopType, ...sessionFilter.params) as Record<string, unknown>[];
   287	
   288	  return rows.map(row => ({
   289	    id: row.id as string,
   290	    specFolder: row.spec_folder as string,
   291	    loopType: row.loop_type as Namespace['loopType'],
   292	    sessionId: row.session_id as string,
   293	    sourceId: row.source_id as string,
   294	    targetId: row.target_id as string,
   295	    relation: row.relation as CoverageEdge['relation'],
   296	    weight: row.weight as number,
   297	    metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
   298	    createdAt: row.created_at as string | undefined,
   299	  }));
   300	}
   301	
   302	// ───────────────────────────────────────────────────────────────
   303	// 5. UNVERIFIED CLAIMS
   304	// ───────────────────────────────────────────────────────────────
   305	
   306	/**
   307	 * Find claim nodes whose metadata verification_status is not 'verified'.
   308	 * For research: CLAIM nodes with status != 'verified'.
   309	 * For review: FINDING nodes with no RESOLVES edges.
   310	 */
   311	export function findUnverifiedClaims(ns: Namespace): CoverageNode[] {
   312	  const d = getDb();
   313	  const { specFolder, loopType, sessionId } = ns;
   314	  const nodeFilter = buildSessionFilter('session_id', sessionId);
   315	
   316	  if (loopType === 'research') {
   317	    // Schema note: coverage graph tables already include a real session_id
   318	    // column, so session-scoped reads can stay in SQL.
   319	    // Research: CLAIM nodes where metadata.verification_status != 'verified'
   320	    const rows = d.prepare(`
   321	      SELECT * FROM coverage_nodes
   322	      WHERE spec_folder = ? AND loop_type = ? AND kind = 'CLAIM'
   323	        ${nodeFilter.clause}
   324	    `).all(specFolder, loopType, ...nodeFilter.params) as Record<string, unknown>[];
   325	
   326	    return rows
   327	      .map(r => ({
   328	        id: r.id as string,
   329	        specFolder: r.spec_folder as string,
   330	        loopType: r.loop_type as string,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts | sed -n '380,510p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   380	  const { specFolder, loopType } = ns;
   381	
   382	  // dimensionCoverage: dimensions with >= 1 COVERS edge / all dimensions
   383	  const allDimensions = (d.prepare(
   384	    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'DIMENSION'`,
   385	  ).get(specFolder, loopType) as { c: number }).c;
   386	
   387	  const coveredDimensions = (d.prepare(`
   388	    SELECT COUNT(*) as c FROM coverage_nodes n
   389	    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'DIMENSION'
   390	      AND EXISTS (
   391	        SELECT 1 FROM coverage_edges e WHERE e.source_id = n.id AND e.relation = 'COVERS'
   392	      )
   393	  `).get(specFolder, loopType) as { c: number }).c;
   394	
   395	  const dimensionCoverage = allDimensions > 0 ? coveredDimensions / allDimensions : 0;
   396	
   397	  // findingStability: findings with 0 CONTRADICTS edges / all findings
   398	  const allFindings = (d.prepare(
   399	    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'`,
   400	  ).get(specFolder, loopType) as { c: number }).c;
   401	
   402	  const stableFindings = (d.prepare(`
   403	    SELECT COUNT(*) as c FROM coverage_nodes n
   404	    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'FINDING'
   405	      AND NOT EXISTS (
   406	        SELECT 1 FROM coverage_edges e
   407	        WHERE (e.source_id = n.id OR e.target_id = n.id) AND e.relation = 'CONTRADICTS'
   408	      )
   409	  `).get(specFolder, loopType) as { c: number }).c;
   410	
   411	  const findingStability = allFindings > 0 ? stableFindings / allFindings : 0;
   412	
   413	  // p0ResolutionRate: P0 findings with RESOLVES edge / P0 findings
   414	  const allP0 = d.prepare(`
   415	    SELECT id, metadata FROM coverage_nodes
   416	    WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'
   417	  `).all(specFolder, loopType) as Array<{ id: string; metadata: string | null }>;
   418	
   419	  let p0Count = 0;
   420	  let p0Resolved = 0;
   421	
   422	  for (const finding of allP0) {
   423	    if (finding.metadata) {
   424	      try {
   425	        const meta = JSON.parse(finding.metadata);
   426	        if (meta.severity === 'P0') {
   427	          p0Count++;
   428	          const hasResolve = (d.prepare(
   429	            `SELECT COUNT(*) as c FROM coverage_edges WHERE target_id = ? AND relation = 'RESOLVES'`,
   430	          ).get(finding.id) as { c: number }).c;
   431	          if (hasResolve > 0) p0Resolved++;
   432	        }
   433	      } catch { /* skip */ }
   434	    }
   435	  }
   436	
   437	  const p0ResolutionRate = p0Count > 0 ? p0Resolved / p0Count : 1.0; // No P0s = fully resolved
   438	
   439	  // evidenceDensity: average EVIDENCE_FOR edges per finding
   440	  const totalEvidenceEdges = (d.prepare(
   441	    `SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND relation = 'EVIDENCE_FOR'`,
   442	  ).get(specFolder, loopType) as { c: number }).c;
   443	
   444	  const evidenceDensity = allFindings > 0 ? totalEvidenceEdges / allFindings : 0;
   445	
   446	  // hotspotSaturation: hotspot files with >= 2 dimension coverage / hotspot files
   447	  const hotspotSaturation = computeHotspotSaturation(d, specFolder, loopType);
   448	
   449	  return {
   450	    dimensionCoverage,
   451	    findingStability,
   452	    p0ResolutionRate,
   453	    evidenceDensity,
   454	    hotspotSaturation,
   455	  };
   456	}
   457	
   458	function computeHotspotSaturation(d: Database.Database, specFolder: string, loopType: string): number {
   459	  // Find FILE nodes with hotspot_score > 0 in metadata
   460	  const files = d.prepare(`
   461	    SELECT id, metadata FROM coverage_nodes
   462	    WHERE spec_folder = ? AND loop_type = ? AND kind = 'FILE'
   463	  `).all(specFolder, loopType) as Array<{ id: string; metadata: string | null }>;
   464	
   465	  const hotspotFiles: string[] = [];
   466	  for (const f of files) {
   467	    if (f.metadata) {
   468	      try {
   469	        const meta = JSON.parse(f.metadata);
   470	        if (meta.hotspot_score && meta.hotspot_score > 0) {
   471	          hotspotFiles.push(f.id);
   472	        }
   473	      } catch { /* skip */ }
   474	    }
   475	  }
   476	
   477	  if (hotspotFiles.length === 0) return 1.0; // No hotspots = fully saturated
   478	
   479	  let saturated = 0;
   480	  for (const fileId of hotspotFiles) {
   481	    // Count distinct dimensions that COVER this file
   482	    const dimCoverage = (d.prepare(`
   483	      SELECT COUNT(DISTINCT e.source_id) as c
   484	      FROM coverage_edges e
   485	      JOIN coverage_nodes n ON n.id = e.source_id
   486	      WHERE e.target_id = ? AND e.relation = 'COVERS' AND n.kind = 'DIMENSION'
   487	    `).get(fileId) as { c: number }).c;
   488	
   489	    if (dimCoverage >= 2) saturated++;
   490	  }
   491	
   492	  return hotspotFiles.length > 0 ? saturated / hotspotFiles.length : 1.0;
   493	}
   494	
   495	// ───────────────────────────────────────────────────────────────
   496	// 5. COMPOSITE SIGNAL COMPUTATION
   497	// ───────────────────────────────────────────────────────────────
   498	
   499	/**
   500	 * Compute all convergence signals for a namespace.
   501	 * Dispatches to research or review signal computation based on loop type.
   502	 */
   503	export function computeSignals(ns: Namespace): ConvergenceSignals {
   504	  if (ns.loopType === 'research') {
   505	    return computeResearchSignals(ns);
   506	  }
   507	  return computeReviewSignals(ns);
   508	}
   509	
   510	/**

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   107	  sessionId?: string;
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
   157	
   158	    const ns: Namespace = {
   159	      specFolder: args.specFolder,
   160	      loopType: args.loopType,
   161	      sessionId: args.sessionId,
   162	    };
   163	    const stats = computeScopedStats(ns);
   164	
   165	    // Empty graph: can't make convergence decisions
   166	    if (stats.totalNodes === 0) {
   167	      return okResponse({
   168	        decision: 'CONTINUE' as ConvergenceDecision,
   169	        reason: 'Graph is empty; insufficient data for convergence assessment',
   170	        signals: null,
   171	        blockers: [],
   172	        trace: [],
   173	        namespace: buildNamespacePayload(ns),
   174	        scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
   175	        nodeCount: 0,
   176	        edgeCount: 0,
   177	      });
   178	    }
   179	
   180	    // Compute signals
   181	    const signals = computeScopedSignals(ns);
   182	    const momentum = computeScopedMomentum(ns);
   183	
   184	    // Persist snapshot if requested
   185	    if (args.persistSnapshot && args.iteration !== undefined) {
   186	      if (args.sessionId) {
   187	        createSnapshot({
   188	          specFolder: args.specFolder,
   189	          loopType: args.loopType,
   190	          sessionId: args.sessionId,
   191	          iteration: args.iteration,
   192	          metrics: {
   193	            ...signals,
   194	            nodeCount: stats.totalNodes,
   195	            edgeCount: stats.totalEdges,
   196	          },
   197	          nodeCount: stats.totalNodes,
   198	          edgeCount: stats.totalEdges,
   199	        });
   200	      }
   201	    }
   202	
   203	    // Evaluate convergence
   204	    const blockers: ConvergenceBlocker[] = [];
   205	    const trace: ConvergenceTraceEntry[] = [];
   206	
   207	    if (args.loopType === 'research') {
   208	      evaluateResearchConvergence(
   209	        signals as ResearchConvergenceSignals,
   210	        ns,
   211	        blockers,
   212	        trace,
   213	      );
   214	    } else {
   215	      evaluateReviewConvergence(
   216	        signals as ReviewConvergenceSignals,
   217	        ns,
   218	        blockers,
   219	        trace,
   220	      );
   221	    }
   222	
   223	    // Determine decision
   224	    const blockingBlockers = blockers.filter(b => b.severity === 'blocking');
   225	    let decision: ConvergenceDecision;
   226	
   227	    if (blockingBlockers.length > 0) {
   228	      decision = 'STOP_BLOCKED';
   229	    } else if (trace.every(t => t.passed)) {
   230	      decision = 'STOP_ALLOWED';
   231	    } else {
   232	      decision = 'CONTINUE';
   233	    }
   234	
   235	    const reason = buildDecisionReason(decision, blockingBlockers, trace);
   236	
   237	    // Phase 008 P1-01: emit a single canonical numeric score alongside the
   238	    // raw signals so reducer-owned `graphConvergenceScore` can consume it
   239	    // directly without fallback math.
   240	    const score = computeCompositeScore(signals, args.loopType);
   241	    const signalsWithScore = { ...signals, score };
   242	
   243	    return okResponse({
   244	      decision,
   245	      reason,
   246	      score,
   247	      signals: signalsWithScore,
   248	      blockers,
   249	      trace,
   250	      momentum,
   251	      namespace: buildNamespacePayload(ns),
   252	      scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
   253	      notes: args.sessionId
   254	        ? ['Convergence signals were computed from the session-scoped subgraph only.']
   255	        : ['No sessionId provided; convergence falls back to specFolder + loopType aggregation across all sessions for bootstrap/debugging use.'],
   256	      snapshotPersistence: args.persistSnapshot && !args.sessionId
   257	        ? 'skipped_without_sessionId'
   258	        : (args.persistSnapshot ? 'persisted' : 'not_requested'),
   259	      nodeCount: stats.totalNodes,
   260	      edgeCount: stats.totalEdges,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
    33	  sessionId?: string;
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
    54	
    55	    const ns: Namespace = {
    56	      specFolder: args.specFolder,
    57	      loopType: args.loopType,
    58	      sessionId: args.sessionId,
    59	    };
    60	
    61	    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
    62	
    63	    switch (args.queryType) {
    64	      case 'uncovered_questions':
    65	      case 'coverage_gaps': {
    66	        const gaps = findCoverageGaps(ns);
    67	        return okResponse({
    68	          queryType: args.queryType,
    69	          namespace: buildNamespacePayload(ns),
    70	          scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
    71	          gaps: gaps.slice(0, limit),
    72	          totalGaps: gaps.length,
    73	        });
    74	      }
    75	
    76	      case 'unverified_claims': {
    77	        const claims = findUnverifiedClaims(ns);
    78	        return okResponse({
    79	          queryType: 'unverified_claims',
    80	          namespace: buildNamespacePayload(ns),
    81	          scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
    82	          claims: claims.slice(0, limit).map(c => ({
    83	            id: c.id,
    84	            kind: c.kind,
    85	            name: c.name,
    86	            iteration: c.iteration,
    87	            metadata: c.metadata,
    88	          })),
    89	          totalUnverified: claims.length,
    90	        });
    91	      }
    92	
    93	      case 'contradictions': {
    94	        const contradictions = findContradictions(ns);
    95	        return okResponse({
    96	          queryType: 'contradictions',
    97	          namespace: buildNamespacePayload(ns),
    98	          scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
    99	          contradictions: contradictions.slice(0, limit),
   100	          totalContradictions: contradictions.length,
   101	        });
   102	      }
   103	
   104	      case 'provenance_chain': {
   105	        if (!args.nodeId) {
   106	          return errorResponse('nodeId is required for provenance_chain query');
   107	        }
   108	        const maxDepth = Math.min(Math.max(args.maxDepth ?? 10, 1), 20);
   109	        const chain = findProvenanceChain(ns, args.nodeId, maxDepth);
   110	        return okResponse({
   111	          queryType: 'provenance_chain',
   112	          namespace: buildNamespacePayload(ns),
   113	          scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
   114	          rootNodeId: args.nodeId,
   115	          chain: chain.slice(0, limit),
   116	          totalSteps: chain.length,
   117	          maxDepth,
   118	        });
   119	      }
   120	
   121	      case 'hot_nodes': {
   122	        const hotNodes = rankHotNodes(ns, limit);
   123	        return okResponse({
   124	          queryType: 'hot_nodes',
   125	          namespace: buildNamespacePayload(ns),
   126	          scopeMode: args.sessionId ? 'session' : 'all_sessions_default',
   127	          hotNodes,
   128	          totalReturned: hotNodes.length,
   129	        });
   130	      }
   131	
   132	      default:
   133	        return errorResponse(
   134	          `Unknown queryType: "${args.queryType}". Valid types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes`,
   135	        );
   136	    }
   137	  } catch (err: unknown) {
   138	    return errorResponse(
   139	      `Query failed: ${err instanceof Error ? err.message : String(err)}`,
   140	    );
   141	  }
   142	}
   143	
   144	function buildNamespacePayload(ns: Namespace): Record<string, unknown> {
   145	  return {
   146	    specFolder: ns.specFolder,
   147	    loopType: ns.loopType,
   148	    ...(ns.sessionId ? { sessionId: ns.sessionId } : {}),
   149	  };
   150	}
   151	
   152	// ───────────────────────────────────────────────────────────────
   153	// 3. RESPONSE HELPERS
   154	// ───────────────────────────────────────────────────────────────
   155	
   156	function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
   157	  return {
   158	    content: [{
   159	      type: 'text',
   160	      text: JSON.stringify({ status: 'ok', data }, null, 2),
   161	    }],
   162	  };
   163	}
   164	
   165	function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
   166	  return {
   167	    content: [{
   168	      type: 'text',
   169	      text: JSON.stringify({ status: 'error', error }),
   170	    }],
   171	  };
   172	}

exec
/bin/zsh -lc "rg -n \"shared|collision|session isolation|sessionId|all_sessions_default|getNodes\\(|handleCoverageGraphConvergence|computeSignals|findContradictions|p0ResolutionRate|hotspotSaturation\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:3:import { extractTriggerPhrases as sharedExtractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:17:    // ngramDepth 4 baseline (shared trigger-extractor and explicit depth 4)
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:92:  it('keeps trigger extraction locked to the shared baseline for frozen inputs', () => {
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:97:      expect(sharedExtractTriggerPhrases(goldenCase.text).slice(0, 8)).toEqual(goldenCase.expected);
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:229:// TODO(003-006): re-enable after 003-memory-quality-issues/006-memory-duplication-reduction lands the compact wrapper fixtures. End-to-end detection tests render memory via the shared pipeline and assert on old packet-shape sections.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:333:      'reorganize and simplify the shared module',
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:66:        // Ignore already-closed shared connections.
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:88:  // SUITE: Summary stats respect sessionId filter
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:89:  describe('T503: Summary stats respect sessionId filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:90:    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:103:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:120:        sessionId: sessB,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:130:      // Query with sessionId = sessA
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:133:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:143:    it('T503-01b: sessionId records filter consistent', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:157:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:173:        sessionId: sessB,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:185:        sessionId: sessA,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:192:      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:197:    it('T503-01c: sessionId filter normalizes whitespace to match stored records', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:200:      const sessionId = uniqueId('sess-trimmed');
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:209:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:217:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:222:        sessionId: `  ${sessionId}  `,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:228:      expect(data.learningHistory[0].sessionId).toBe(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:292:  // SUITE: Combined sessionId + onlyComplete filters
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:293:  describe('T503: Combined sessionId + onlyComplete filters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:306:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:323:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:329:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:353:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:369:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:374:        sessionId: sessC,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:61:import { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from '@spec-kit/shared/normalization';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:9:} from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:22:} from '@spec-kit/shared/contracts/retrieval-trace';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:34:    expect(trace.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:38:  it('createTrace includes optional sessionId and intent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:41:    expect(trace.sessionId).toBe('sess-123');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:236:      sessionId: 'session-id',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:263:    expect(sanitizedRecord.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:5:import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:295:    const { getAdaptiveWeights, INTENT_WEIGHT_PROFILES } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:309:    const { getAdaptiveWeights, DEFAULT_WEIGHTS } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:322:    const { INTENT_WEIGHT_PROFILES } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:460:    const { hybridAdaptiveFuse } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:49:function writeConfig(specFolder: string, sessionId: string): void {
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:54:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:61:        sessionId,
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:197:      '{"type":"config","topic":"Graph-aware stop fixture","sessionId":"graph-stop-blocked","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:216:      '{"type":"config","topic":"Graph-aware stop fixture","sessionId":"graph-stop-allowed","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:233:      '{"type":"config","topic":"Graph-aware stop fixture","sessionId":"graph-stop-default","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:253:      '{"type":"config","topic":"Handler-shape fixture","sessionId":"graph-stop-handler","maxIterations":5,"createdAt":"2026-04-11T00:00:00Z"}',
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:255:      '{"type":"event","event":"graph_convergence","decision":"STOP_ALLOWED","score":0.74,"signals":{"questionCoverage":0.8,"claimVerificationRate":0.7,"contradictionDensity":0.05,"sourceDiversity":2.1,"evidenceDepth":3.2,"score":0.74},"blockers":[],"trace":[],"timestamp":"2026-04-11T00:06:00Z","sessionId":"graph-stop-handler","generation":1}',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:221:      sessionId: 'copilot-parity',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:29:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:46:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:69:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:92:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:114:      sessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:147:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:156:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:164:      sessionId: 'session-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:185:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:211:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:241:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:248:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:254:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring-overflow.vitest.ts:6:} from '@spec-kit/shared/scoring/folder-scoring';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:225:    const sharedContent = buildMemoryContent('Duplicate Seed', 'Shared duplicate body for regression coverage.');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:227:    fs.writeFileSync(originalPath, sharedContent, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:228:    fs.writeFileSync(duplicatePath, sharedContent, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:308:    const sharedContent = buildMemoryContent('Atomic Duplicate Seed', 'Atomic duplicate behavior regression fixture.');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:310:    fs.writeFileSync(indexedPath, sharedContent, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:319:        content: sharedContent,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:14:} from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:15:import type { FusionWeights, DegradedModeContract, AdaptiveFusionResult } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:16:import type { RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:76:    sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:104:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:9:import { truncateToTokenBudget, COMPACTION_TOKEN_BUDGET } from '../hooks/claude/shared.js';
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:69:        '{"message":{"content":"Reading /src/hooks/shared.ts"}}',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:80:      expect([...paths]).toContain('/src/hooks/shared.ts');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:418:      vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:778:      vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:905:      vi.doUnmock('@spec-kit/shared/parsing/memory-sufficiency');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1607:          sessionId: 'session-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1619:          sessionId: 'session-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1674:          sessionId: 'session-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1690:          sessionId: 'session-p',
.opencode/skill/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts:6:} from '../../mcp_server/lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:272:    const sharedNode = results.find((row) => row['id'] === 9);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:273:    expect(sharedNode?.['score']).toBe(1.5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:274:    expect(sharedNode?.['targetId']).toBe('11');
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:9:import type { MemoryDbRow } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:251:vi.mock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:21:  it('classifies placeholder stub patterns through the shared validator', () => {
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:45:      [{ TITLE: 'Implement shared validator', NARRATIVE: 'Unified description validation across extractors and scoring.' }],
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:10:} from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:133:    sessionId: undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:9:  const sessionId = 'test-snapshot-store';
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:18:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:26:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:29:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:32:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:39:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:42:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:26:    expect(isProhibitedImportPath('../../shared/lib/../utils')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:29:  it('blocks sibling shared traversals and still allows public package imports', () => {
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:30:    expect(isProhibitedImportPath('../shared/utils')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts:31:    expect(isProhibitedImportPath('../../shared/utils/path-security')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:7:import { fuseResultsMulti, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:8:import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:15:  if (relativePath.startsWith('shared/')) {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:30:    source: 'shared/algorithms/rrf-fusion.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:35:    source: 'shared/embeddings.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:40:    source: 'shared/embeddings.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:55:    source: 'shared/embeddings/factory.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:4:import { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from '@spec-kit/shared/normalization';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:5:import type { Memory, MemoryDbRow } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:72:    sessionId: 'sess-abc123',
.opencode/skill/system-spec-kit/scripts/tests/tool-sanitizer.vitest.ts:1:// TEST: Tool Sanitizer shared utilities
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:18:const SHARED_PATH = path.join(ROOT, 'shared');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:34:function countSessionEntries(db: Database.Database, sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:36:    .get(sessionId) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:50:      const sessionId = 'stress-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:63:          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:66:          const currentCount = countSessionEntries(db, sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:71:      const finalCount = countSessionEntries(db, sessionId);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:11:import { validateMemoryTemplateContract } from '../../shared/parsing/memory-template-contract';
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:131:vi.mock('@spec-kit/shared/contracts/retrieval-trace', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:149:    || scope.sessionId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:160:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:613:    await fs.writeFile(realPath, 'shared-target', 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:384:        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:394:    input.config.sessionId = 'test-001';
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:426:    input.config.sessionId = 'test-001';
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:4:// Tests: ensureUniqueMemoryFilename collision detection and resolution
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:26:  it('returns original filename when no collision', () => {
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:37:  it('appends -1 suffix on first collision', () => {
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:43:  it('appends incrementing suffix for multiple collisions', () => {
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:54:      const name = ensureUniqueMemoryFilename(tmpDir, 'collision.md');
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:61:  it('ignores non-md files in collision check', () => {
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:67:  it('falls back to random hex suffix after 100 collisions (C5)', () => {
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:71:      fs.writeFileSync(path.join(tmpDir, `test-${i}.md`), `collision-${i}`);
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:81:  it('returns distinct random fallback names across repeated >100-collision calls', () => {
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts:84:      fs.writeFileSync(path.join(tmpDir, `test-${i}.md`), `collision-${i}`);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:171:    it('shared review relations have matching weights', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:326:    it('shared relations (COVERS, SUPPORTS, CONTRADICTS) exist in both sets', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:327:      const shared = ['COVERS', 'CONTRADICTS'];
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:331:      for (const rel of shared) {
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:5:import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker';
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:6:import type { Chunk } from '@spec-kit/shared/lib/structure-aware-chunker';
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:14:      sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:50:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:58:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:63:      sessionId: '  normalized-session  ',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:71:      sessionId: 'normalized-session',
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:18:    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:88:        sessionId: 'sess-123',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:141:        sessionId: 'sess-456',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:155:      expect(sel.context.sessionId).toBe('sess-456');
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:4:// Tests actual behavior of shared/embeddings.ts functions
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:21:const SHARED_DIST = path.join(ROOT, 'shared', 'dist');
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:861:  log('\n🔬 GROUP I: Re-export shim (lib/embeddings → shared/embeddings)');
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:865:    const sharedPath = path.join(ROOT, 'shared', 'dist', 'embeddings.js');
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:869:    const sharedMod = require(sharedPath);
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:871:    // The shim should re-export everything from shared
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:872:    const sharedKeys = Object.keys(sharedMod).sort();
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:875:    // All shared exports should be available through lib
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:878:    for (const key of sharedKeys) {
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:885:      'EB-126: lib/embeddings re-exports all shared/embeddings exports',
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:886:      missing.length === 0 ? `All ${sharedKeys.length} exports present` : `Missing: ${missing.join(', ')}`);
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:889:    assertEqual(libMod.generateEmbedding, sharedMod.generateEmbedding,
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:891:    assertEqual(libMod.EMBEDDING_DIM, sharedMod.EMBEDDING_DIM,
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:893:    assertEqual(libMod.TASK_PREFIX, sharedMod.TASK_PREFIX,
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:908:  console.log('  Source: shared/embeddings.ts (via lib/embeddings.ts shim)');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:19:  createWaveContext: (target: string, loopType: 'review' | 'research', options?: { sessionId?: string; generation?: number }) => object;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:20:  dispatchWave: (segments: object[], config: { sessionId: string; generation?: number; waveNumber: number; maxParallel?: number }) => { waveId: string; dispatches: object[]; timestamp: string; totalSegments: number; activeSegments: number; deferredSegments: number };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:90:      expect(ctx.sessionId).toMatch(/^wave-/);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:116:        sessionId: 'test-session',
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:128:        sessionId: 'test',
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:137:      expect(lifecycle.dispatchWave([], { sessionId: 's', waveNumber: 1 })).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts:131:  it('T005a-I4c: MAX_INGEST_PATHS+1 paths throws the shared limit error', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts:56:    const sessionId = 'gate-d-feature-3-session-dedup';
.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts:89:    const firstMark = sessionManager.markMemorySent(sessionId, specDocRow);
.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-session-dedup.vitest.ts:92:    const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, [
.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:127:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:8:// Mock the problematic @spec-kit/shared dependency chain
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:9:// So composite-scoring.ts can be imported without the shared workspace being linked
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:30:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:31:import type { FusionResult, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:6:const SHARED_ROOT = path.resolve(SERVER_ROOT, '..', 'shared');
.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts:128:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:32:function createSessionData(specFolderName: string, sessionId: string): SessionData {
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:55:    SESSION_ID: sessionId,
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:84:  it('passes options.sessionId as the third collectSessionDataFn argument', async () => {
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:115:        sessionId: explicitSessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:139:vi.mock('@spec-kit/shared/ranking/learned-combiner', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:145:vi.mock('@spec-kit/shared/contracts/retrieval-trace', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/unit-path-security.vitest.ts:8:import { validateFilePath } from '@spec-kit/shared/utils/path-security';
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:78:    { id: 202, content: 'Tool schemas define optional fields, defaults, and shared validation helpers. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:12:} from '../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:24:  findContradictions,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:100:function makeResearchNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:105:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:112:function makeReviewNode(specFolder: string, sessionId: string, id: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:117:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:168:      sessionId: 'session-clamp',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:177:      { specFolder: 'spec-clamp', loopType: 'research', sessionId: 'session-clamp' },
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:187:      sessionId: 'session-empty',
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:201:    expect(getNodes(emptyResearchNs)).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:204:    expect(findContradictions(emptyResearchNs)).toEqual([]);
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
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:344:    const tsContradictions = findContradictions(ns)
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
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:385:    expect(getNodes(researchNs).map(node => node.id).sort()).toEqual([
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:390:    expect(getNodes(reviewNs).map(node => node.id).sort()).toEqual([
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:396:    expect(findContradictions(reviewNs)).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:409:      hotspotSaturation: 0,
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:412:    expect(findContradictions(researchNs)).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:5:// Changes to shared files are correctly integrated and do not conflict.
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:13:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:74:    expect(brief.sharedPayload?.kind).toBe('startup');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:75:    expect(brief.sharedPayload?.provenance.producer).toBe('startup_brief');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:76:    expect(brief.sharedPayload?.sections.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:98:    expect(brief.sharedPayload?.provenance.trustState).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:111:    expect(brief.sharedPayload?.provenance.trustState).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:153:    expect(brief.sharedPayload).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:80:  getSessionState: (sessionId: string) => MockSessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:155:            for (const [sessionId, row] of sessionState.entries()) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:157:                sessionState.delete(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:166:              sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:193:            const existing = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:209:            sessionState.set(sessionId, nextRow);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:214:            const [updatedAt, sessionId] = args as [string, string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:215:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:238:            const [updatedAt, sessionId] = args as [string, string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:239:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:257:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:258:            return sessionState.has(sessionId) ? { 1: 1 } : undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:266:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:267:            return cloneRow(sessionState.get(sessionId));
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:271:            const [sessionId] = args as [string];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:272:            const row = sessionState.get(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:335:    getSessionState: (sessionId: string) => cloneRow(sessionState.get(sessionId)),
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:472:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['list-a', 'list-b']);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:504:        sessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:523:        sessionId: 'session-with-data',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:705:        sessionId: 'recover-fields',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:788:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['recoverable-a', 'recoverable-b']);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:798:      expect(result.sessions.some((session) => session.sessionId === 'exclude-completed')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:812:      const session = result.sessions.find((entry) => entry.sessionId === 'field-check');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:815:        sessionId: 'field-check',
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:2:// Verifies current shared-provider architecture and MCP facade.
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:12:} from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:13:import { VoyageProvider } from '@spec-kit/shared/embeddings/providers/voyage';
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:14:import { getStartupEmbeddingProfile } from '../../shared/embeddings/factory.js';
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:30:const HF_LOCAL_PROVIDER_FILE = path.resolve(__dirname, '..', '..', 'shared', 'embeddings', 'providers', 'hf-local.ts');
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:31:const OPENAI_PROVIDER_FILE = path.resolve(__dirname, '..', '..', 'shared', 'embeddings', 'providers', 'openai.ts');
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:32:const VOYAGE_PROVIDER_FILE = path.resolve(__dirname, '..', '..', 'shared', 'embeddings', 'providers', 'voyage.ts');
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:2:import { validateApiKey } from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:386:  function getExtractedRow(database: TestDatabase, sessionId: string, memoryId: number): ExtractedRow | undefined {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:398:    `).get(sessionId, memoryId) as ExtractedRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:422:      const sessionId = 'wm-provenance-session';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:427:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:438:      const row = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:454:      const sessionId = 'wm-no-count-probe';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:467:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:476:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:492:      `).get(sessionId, memoryId) as { cnt: number };
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:504:      const sessionId = 'wm-provenance-update';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:509:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:520:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:534:      `).get(sessionId, memoryId) as { cnt: number };
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:537:      const row = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:555:      const sessionId = 'wm-provenance-checkpoint';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:560:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:574:      const removed = workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:581:      const restoredRow = getExtractedRow(database, sessionId, memoryId);
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:579:  if ((step.toolName === 'memory_context' || step.toolName === 'memory_search') && typeof args.sessionId === 'string') {
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:580:    const candidate = args.sessionId.trim();
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:584:        args.sessionId = runtimeState.lastSessionId;
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:586:        delete args.sessionId;
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:874:    : typeof data.sessionId === 'string'
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:875:      ? data.sessionId
.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:5:import { applyMMR, computeCosine } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:6:import type { MMRCandidate, MMRConfig } from '@spec-kit/shared/algorithms/mmr-reranker';
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:39:vi.mock('../../shared/algorithms/rrf-fusion', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:64:vi.mock('../../shared/algorithms/adaptive-fusion', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:166:    const mod = await import('../../shared/algorithms/mmr-reranker');
.opencode/skill/system-spec-kit/mcp_server/tests/lazy-loading.vitest.ts:33:  return import('../../shared/embeddings');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-weighting.vitest.ts:3:import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:53:      const sessionId = 'ses/sion/../bad';
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:54:      const path = getStatePath(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:57:      expect(path).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:3:import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:215:    const collisionSpecFolder = `specs/${checkpointName('t011-c7c-collision-folder')}`;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:216:    const collisionPath = `${collisionSpecFolder}/memory/collision.md`;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:217:    const checkpoint = checkpointName('t011-c7c-id-collision');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:234:    ).run(collisionSpecFolder, collisionPath, 'collision-title', memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:251:    expect(row?.spec_folder).toBe(collisionSpecFolder);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:252:    expect(row?.file_path).toBe(collisionPath);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:253:    expect(row?.title).toBe('collision-title');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:6:import type { SharedPayloadEnvelope } from '../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:34:  it('builds a transport-only plan from shared payloads', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:59:        { id: 2, title: 'shared', score: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:62:        { id: 2, title: 'shared-duplicate', score: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:68:    expect(merged[1]?.title).toBe('shared');
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:33:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:37:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:45:    const state = loadState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:46:    expect(state!.claudeSessionId).toBe(sessionId);
.opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh:73:# Use isolated copy of script with missing ../lib/shell-common.sh (no shared file mutation)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:180:    // With 10 shared words and 1 different word each:
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:182:    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:185:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:190:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:195:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:239:    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:242:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:247:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:254:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:340:    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:343:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:348:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:365:    const sharedTriggers = 'authentication, login, session, token, validation, handler, middleware, security, user, access';
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:368:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:373:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:378:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:385:      triggerPhrases: sharedTriggers,
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:15:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:167:        { id: 'shared', content: 'shared doc' },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:171:        { id: 'shared', content: 'shared doc' },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:182:    expect(ids).toContain('shared');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:187:    const sharedDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'shared'), 'shared');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:188:    expect(sharedDoc.sources).toHaveLength(2);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:189:    expect(sharedDoc.rrfScore).toBeGreaterThan(expectDefined(fused.find((r: MultiFusedResult) => r.id === 'vec_only'), 'vec_only').rrfScore);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:191:    expect(sharedDoc.convergenceBonus).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:24:} from '@spec-kit/shared/ranking/learned-combiner';
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-circuit-breaker.vitest.ts:10:import { __embeddingCircuitTestables } from '../../shared/embeddings';
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:30:vi.mock('@spec-kit/shared/algorithms/mmr-reranker', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:7:import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate'
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:19:const SHARED_TYPES_FILE = path.join(SERVER_DIR, '..', 'shared', 'types.ts')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:25:let sharedTypesCode = ''
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:71:    sharedTypesCode = fs.readFileSync(SHARED_TYPES_FILE, 'utf8')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:435:      '@spec-kit/shared/embeddings/factory',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:964:          sessionId: null,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:972:          sessionId: null,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1099:        getSessionSnapshot: vi.fn(() => ({ sessionId: null, lastTool: null })),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1107:        getSessionSnapshot: vi.fn(() => ({ sessionId: null, lastTool: null })),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1115:        getSessionSnapshot: vi.fn(() => ({ sessionId: null, lastTool: null })),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1134:      vi.doMock('@spec-kit/shared/embeddings/factory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1463:          if (typeof args.sessionId === 'string') return args.sessionId
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1481:        simulateCall('memory_search', { query: 'recent issues', sessionId: 'sess-sticky-1' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1986:      // MCPResponse was moved to shared/types.ts and re-exported via 'export type'
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1987:      { name: 'MCPResponse', requiredFields: ['content'], source: 'sharedTypes' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2023:          sharedTypes: sharedTypesCode,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2740:    it('T64d: pending recovery reuses shared startup root expansion', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:12:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:111:      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'S' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:112:      { source: SOURCE_TYPES.BM25,   results: [{ id: 'shared', title: 'S' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:114:    const shared = fused.find(r => r.id === 'shared');
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:115:    expect(shared).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:116:    expect(shared!.convergenceBonus).toBeCloseTo(CONVERGENCE_BONUS, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:121:      { source: SOURCE_TYPES.VECTOR,  results: [{ id: 'shared', title: 'S' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:122:      { source: SOURCE_TYPES.BM25,    results: [{ id: 'shared', title: 'S' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:123:      { source: SOURCE_TYPES.KEYWORD, results: [{ id: 'shared', title: 'S' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:125:    const shared = fused.find(r => r.id === 'shared');
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:126:    expect(shared).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:127:    expect(shared!.convergenceBonus).toBeCloseTo(CONVERGENCE_BONUS * 2, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:235:        { id: 'shared', title: 'S' },
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:239:        { id: 'shared', title: 'S' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:4:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:5:import { fuseResults, fuseResultsMulti, fuseResultsCrossVariant, SOURCE_TYPES, DEFAULT_K } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:78:      { id: 'shared', title: 'Shared Result' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:82:      { id: 'shared', title: 'Shared Result' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:91:    const shared = requireResult(fused.find((r: FusionResult) => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:95:    expect(shared.rrfScore).toBeGreaterThan(vectorOnly.rrfScore);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:96:    expect(shared.rrfScore).toBeGreaterThan(bm25Only.rrfScore);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:97:    expect(shared.sources).toHaveLength(2);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:98:    expect(shared.convergenceBonus).toBeCloseTo(0.10, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:138:      { id: 'shared', title: 'Shared' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:142:      { id: 'shared', title: 'Shared' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:158:    const shared = requireResult(fused.find((r: FusionResult) => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:159:    expect(shared.sources).toContain(SOURCE_TYPES.VECTOR);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:160:    expect(shared.sources).toContain(SOURCE_TYPES.BM25);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:161:    expect(shared.sources).toHaveLength(2);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:162:    expect(shared.sourceScores).toHaveProperty(SOURCE_TYPES.BM25);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:163:    expect(shared.sourceScores[SOURCE_TYPES.BM25]).toEqual(expect.any(Number));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:182:    const vectorResults = [{ id: 'shared', title: 'Shared' }, { id: 'v-only', title: 'V' }];
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:183:    const bm25Results = [{ id: 'shared', title: 'Shared' }, { id: 'b-only', title: 'B' }];
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:184:    const graphResults = [{ id: 'shared', title: 'Shared' }, { id: 'g-only', title: 'G' }];
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:192:    const shared = requireResult(fused.find(r => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:193:    expect(shared.sources).toHaveLength(3);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:194:    expect(shared.rrfScore).toBeGreaterThan(requireResult(fused.find(r => r.id === 'v-only')).rrfScore);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:195:    expect(shared.convergenceBonus).toBeCloseTo(0.20, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:247:      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }, { id: 'v0-only', title: 'V0' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:250:      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }, { id: 'v1-only', title: 'V1' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:255:    const shared = requireResult(fused.find(r => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:258:    expect(shared.convergenceBonus).toBeGreaterThanOrEqual(0.10);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:259:    expect(shared.rrfScore).toBeGreaterThan(v0Only.rrfScore);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:268:      mkVariant(['shared', 'a']),
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:269:      mkVariant(['shared', 'b']),
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:270:      mkVariant(['shared', 'c']),
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:273:    const shared = requireResult(fused.find(r => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:275:    expect(shared.convergenceBonus).toBeCloseTo(0.20, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:297:        { id: 'shared', title: 'Shared' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:303:        { id: 'shared', title: 'Shared' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:334:      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:338:    const shared = requireResult(fused.find(r => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:340:    expect(shared.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(2, 6);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:341:    expect(shared.convergenceBonus).toBeCloseTo(0.10, 6);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:346:      [{ source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] }],
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:361:      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:362:      { source: SOURCE_TYPES.BM25, results: [{ id: 'shared', title: 'Shared' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:365:    const shared = requireResult(fused.find(r => r.id === 'shared'));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:366:    expect(shared.convergenceBonus).toBeCloseTo(0.10, 6);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:618:      `).run(9101, 'anchor-spec', '/anchor-spec/shared.md', 'section-a', 'Anchor A', now, now, 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:624:      `).run(9102, 'anchor-spec', '/anchor-spec/shared.md', 'section-b', 'Anchor B', now, now, 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:642:          '/anchor-spec/shared.md',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:18:} from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:19:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:20:import type { RrfItem, FusionResult, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:21:import type { FusionWeights } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:402:    it('Composite recency delegates to shared folder recency scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:405:      const sharedRecency = folderScoring.computeRecencyScore(
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:411:      expect(compositeRecency).toBeCloseTo(sharedRecency, 8);
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:26:      taskId: 'shared-task',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:30:      sessionId: 'sess-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:34:      taskId: 'shared-task',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:38:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:43:      taskId: 'shared-task',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:47:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:55:    `).get('specs/t081-session', 'shared-task', 'sess-a') as { phase: string; post_knowledge_score: number | null };
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:61:    `).get('specs/t081-session', 'shared-task', 'sess-b') as {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:76:  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:83:      sessionId: 'sess-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:91:      sessionId: 'sess-b',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:101:      message: expect.stringContaining('Provide sessionId'),
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:112:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:120:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:129:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:137:      sessionId: 'repeat-session',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:29:    sessionId?: unknown;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:394:      sessionId: 'session-secret',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:418:    expect(tracePayload.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:175:      const sessionId: string = 'test-session-T003';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:177:      const shouldSend: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:182:      const sessionId: string = 'test-session-T003';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:183:      const shouldSend2: boolean = sessionManager.shouldSendMemory(sessionId, 999);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:195:      const sessionId: string = 'test-session-T004';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:198:      const firstCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:201:      const markResult: MarkResult = sessionManager.markMemorySent(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:204:      const secondCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:216:      const sessionId: string = 'test-session-T005';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:224:        const result: MarkResult = sessionManager.markMemorySent(sessionId, memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:231:        expect(sessionManager.shouldSendMemory(sessionId, memory)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:236:      `).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:280:      const sessionId: string = 'test-session-T007';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:290:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:291:      sessionManager.markMemorySent(sessionId, searchResults[3]); // 504
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:293:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:308:      const sessionId: string = 'test-session-T007b';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:314:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, [
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:337:      const sessionId: string = 'test-session-T008';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:346:      sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:347:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:348:      sessionManager.markMemorySent(sessionId, searchResults[2]); // 603
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:350:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:359:      const sessionId: string = 'test-session-T008-zero';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:366:      const { dedupStats: noSavingsStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:169:  it('promotes in-memory initialization to the shared connection used by default operations', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:5:import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:7:import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1073:        id: 'shared-doc',
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1086:        id: 'shared-doc',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:6:import { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from '@spec-kit/shared/normalization';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:7:import type { Memory, MemoryDbRow } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:208:        'shared anchor row',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:12:} from '@spec-kit/shared/scoring/folder-scoring';
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:36:    sessionId: 'sess-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:217:      sessionId: 'session-XYZ',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:232:    logFeedbackEvent(db, makeEvent({ sessionId: null }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:327:  it('filters by sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:329:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-1' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:330:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-2' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:332:    const forSess1 = getFeedbackEvents(db, { sessionId: 'sess-1' });
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:9:// ── Hook shared utilities ──
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:18:    const { parseHookStdin } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:33:    const { parseHookStdin } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:49:    const { calculatePressureAdjustedBudget } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:59:    const { calculatePressureAdjustedBudget } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:70:    const { calculatePressureAdjustedBudget } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:84:    const { withTimeout } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:91:    const { withTimeout } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:100:    const { truncateToTokenBudget } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:106:    const { truncateToTokenBudget } = await import('../hooks/claude/shared.js');
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:67:    sessionId: 'sess-A',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:218:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:219:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:220:      makeEvent({ memoryId: 'mem-B', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:271:      makeEvent({ timestamp: 1000, sessionId: 'sess-in' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:272:      makeEvent({ timestamp: 5000, sessionId: 'sess-out' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:278:  it('treats distinct sessionIds as distinct sessions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:281:      makeEvent({ sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:282:      makeEvent({ sessionId: 'sess-1' }), // same session, not counted twice
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:283:      makeEvent({ sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:532:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-A', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:533:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-B', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:534:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-C', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:554:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:555:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:574:      makeEvent({ memoryId: 'mem-ok', sessionId: 's1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:575:      makeEvent({ memoryId: 'mem-ok', sessionId: 's2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:576:      makeEvent({ memoryId: 'mem-ok', sessionId: 's3', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:578:      makeEvent({ memoryId: 'mem-skip', sessionId: 's4', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:593:      makeEvent({ sessionId: 'sess-1', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:594:      makeEvent({ sessionId: 'sess-2', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:595:      makeEvent({ sessionId: 'sess-3', timestamp: BASE_TS - 10_000 }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:613:      makeEvent({ sessionId: 'sX', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:614:      makeEvent({ sessionId: 'sY', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:615:      makeEvent({ sessionId: 'sZ', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:632:      makeEvent({ sessionId: 's1', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:633:      makeEvent({ sessionId: 's2', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:634:      makeEvent({ sessionId: 's3', timestamp: BASE_TS }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:88:    expect(session.sessionId).toBe('sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:502:    expect(session.sessionId).toBe('singleton-test');
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:14:  function setScoreDirectly(sessionId: string, memoryId: number, score: number) {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:18:    `).run(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:21:  function getScoreDirectly(sessionId: string, memoryId: number): number | null {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:24:    ).get(sessionId, memoryId) as { attention_score: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:28:  function countEntries(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:31:    ).get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:79:    const sessionId = 'decay-floor-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:88:      setScoreDirectly(sessionId, 1, 0.06);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:89:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:91:      const scoreAfter1 = getScoreDirectly(sessionId, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:100:        wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:103:      const scoreAfterMany = getScoreDirectly(sessionId, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:109:      const count = countEntries(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:115:    const sessionId = 'delete-threshold-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:122:      setScoreDirectly(sessionId, 2, 0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:123:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:125:      const scoreAtFloor = getScoreDirectly(sessionId, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:130:      setScoreDirectly(sessionId, 3, 0.005);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:131:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:133:      const scoreClamped = getScoreDirectly(sessionId, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:142:      const deleteSessionId = sessionId + '-delete-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:163:      setScoreDirectly(sessionId, 4, 0.15);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:166:        wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:169:      const finalScore = getScoreDirectly(sessionId, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:195:    const sessionId = 'mixed-scores-test';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:202:      setScoreDirectly(sessionId, 5, 0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:203:      setScoreDirectly(sessionId, 6, 0.05);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:204:      setScoreDirectly(sessionId, 7, 0.005);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:205:      setScoreDirectly(sessionId, 8, 0.03);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:207:      wm.batchUpdateScores(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:209:      const s5 = getScoreDirectly(sessionId, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:215:      const s6 = getScoreDirectly(sessionId, 6);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:220:      const s7 = getScoreDirectly(sessionId, 7);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:228:      const s8 = getScoreDirectly(sessionId, 8);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:26:    SHARED_DIR:               path.join(mDir, '..', 'shared'),
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:202:            sessionId: 'sess-123',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:214:        expect(message.includes('sessionId')).not.toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:109:function mockTrustedSession(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:111:    requestedSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:112:    effectiveSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:512:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:530:    it('T027ka: rejects caller sessionId when it is not server-managed', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:536:          sessionId: 'session-new',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:553:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:573:          sessionId: 'session-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:601:          sessionId: 'session-trace',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:634:          sessionId: 'session-known',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:663:          sessionId: 'session-default-on',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:694:          sessionId: 'session-opt-out',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:14:} from '../hooks/claude/shared.js';
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:242:      insertEntity(db, 2, 'shared entity');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:246:      expect(matches[0].canonicalName).toBe('shared entity');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:295:      insertEntity(db, 2, 'shared entity');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:298:      insertCatalogEntry(db, 'shared entity');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:305:        canonicalName: 'shared entity',
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:630:        VALUES ('1', '2', 'supports', 0.7, 'Cross-doc entity: shared', 'entity_linker')`)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:665:      insertCatalogEntry(db, 'shared concept');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:671:      insertEntity(db, 2, 'shared concept');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:711:      insertCatalogEntry(db, 'shared concept');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:719:      insertEntity(db, 2, 'shared concept');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:736:      insertCatalogEntry(db, 'shared concept');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:744:      insertEntity(db, 2, 'shared concept');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:762:      // Entity shared across 3 spec folders = 3 pairwise combinations
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:801:      insertEntity(db, 2, 'shared entity');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:807:        VALUES ('shared entity', '["Shared Entity","shared entity"]', 'noun_phrase', 2),
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:826:          evidence: 'Cross-doc entity: shared entity',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:193:    // Use a larger holdout to make collision extremely unlikely
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts:24:vi.mock('@spec-kit/shared/algorithms/mmr-reranker', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:11:import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:36:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:4:} from '../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:39:    vi.doUnmock('../lib/context/shared-payload.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:45:    vi.doUnmock('../lib/context/shared-payload.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:107:    const sharedPayload = await import('../lib/context/shared-payload.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:108:    vi.spyOn(sharedPayload, 'attachStructuralTrustFields').mockImplementation(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:109:      throw new sharedPayload.StructuralTrustPayloadError(
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:127:    vi.doUnmock('../lib/context/shared-payload.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:133:    vi.doUnmock('../lib/context/shared-payload.js');
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:181:  it('T017-02: Handles minimal session state (only sessionId)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:185:  it('T017-03: Handles undefined sessionId gracefully', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:200:  it('T018-02: Displays sessionId in code format', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:10:// To bypass the flag check and hit the shared SQL path directly.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:117:  it('uses the shared database directory resolver when db-dir env vars are unset', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:124:      import('../../shared/paths'),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:33:import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion.js';
.opencode/skill/system-spec-kit/mcp_server/tests/api-key-validation.vitest.ts:5:} from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:58:      sessionId: 'session-test',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:84:      sessionId: 'session-test',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:106:      sessionId: 'foreign-session',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:137:      sessionId: 'codex-evidence',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:176:      sessionId: 'generic-infra',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:26:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:27:import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:524:      session_summary: 'Second same-minute save to verify collision-safe filename generation.',
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:67:    vi.doUnmock('../lib/context/shared-payload.js');
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:73:    vi.doMock('../lib/context/shared-payload.js', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:74:      const actual = await vi.importActual<typeof import('../lib/context/shared-payload.js')>(
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:75:        '../lib/context/shared-payload.js',
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:34:      expect(metrics.sessionId).toMatch(/^sess_/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:107:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:150:      sessionId: 'sess-ux-1',
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:20:import { SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:24:  it('uses the shared helper contract and preserves a clean boundary with a Unicode ellipsis', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:39:  it('applies the shared truncation helper to decision-extractor fallback surfaces', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:40:    const longNarrative = 'The shared helper keeps the decision narrative readable while preserving word boundaries throughout the saved memory output. '
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:50:          title: 'Use the shared truncation helper',
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:22:  function insertWorkingMemory(sessionId: string, memoryId: number, score: number = 0.8) {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:26:    `).run(sessionId, memoryId, score);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:29:  function countWorkingMemory(sessionId: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:32:    ).get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:105:      const sessionId = 'complete-test-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:108:      insertWorkingMemory(sessionId, 1, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:109:      insertWorkingMemory(sessionId, 2, 0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:110:      insertWorkingMemory(sessionId, 3, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:112:      const countBefore = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:119:      const result = sm.completeSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:123:      const countAfter = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:134:      const sessionId = 'clear-test-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:137:      insertWorkingMemory(sessionId, 4, 0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:138:      insertWorkingMemory(sessionId, 5, 0.6);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:140:      const countBefore = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:147:      `).run(sessionId, 'test-hash-123', 4);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:150:      const result = sm.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:154:      const countAfter = countWorkingMemory(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:160:      ).get(sessionId) as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:37:  'mcp_server/lib/governance/shared-policy.ts',
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:3:import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:42:vi.mock('@spec-kit/shared/config', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:43:  const actual = await vi.importActual<typeof import('@spec-kit/shared/config')>('@spec-kit/shared/config');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:23:    it('T531-1: sessionId parameter accepted by search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:28:            sessionId: 'dedup-session-001',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:35:        expect(getErrorMessage(error)).not.toContain('sessionId');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:44:            sessionId: 'dedup-session-002',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:75:    it('T531-4: Search without sessionId accepted (no dedup)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:80:            // No sessionId — dedup should not activate
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:94:    it('T531-5: Default dedup behavior with sessionId', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:99:            sessionId: 'dedup-session-default',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:115:            sessionId: 'dedup-session-disabled',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:51:  run: (context: { sessionId: string }) => Promise<T>,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:58:  const sessionId = `session-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:70:    return await run({ sessionId });
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:82:  sessionId: string,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:99:    claudeSessionId: sessionId,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:100:    speckitSessionId: `speckit-${sessionId}`,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:125:  saveState(sessionId, state);
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:375:      await withHookSandbox(async ({ sessionId }) => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:378:        const liveStartup = handleStartup({ session_id: sessionId, specFolder: VALID_SPEC_FOLDER });
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:380:        seedHookState(sessionId, scenario);
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:384:        const cachedStartup = handleStartup({ session_id: sessionId, specFolder: VALID_SPEC_FOLDER });
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:196:    it('namespace matches sessionId format', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:3:import { evaluateMemorySufficiency } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:13:        'Implemented a shared insufficiency gate across workflow and memory_save so thin saves fail explicitly.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:115:        'Kept one shared insufficiency contract instead of backend-specific thresholds.',
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:22:// Monotonic counter for unique history IDs (avoids Date.now() collisions)
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:224:    // 1 question, 2 answering findings, 1 shared source → only 1 quality class → diversity = 1.0 < 1.5
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:79:    const sessionId = 'test-session-123';
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:84:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:97:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:465:    const sessionId = generateSessionId();
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:466:    assertMatch(sessionId, /^session-\d+-[a-z0-9]+$/, 'EXT-Session-016: Session ID format correct');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:67:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:109:      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:112:      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:124:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:139:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:259:      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:268:      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:25:  it('exports parity patterns through the shared NOISE_PATTERNS list', () => {
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:37:  it('keeps shared-prefix prompts when their bigram shingles diverge', () => {
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:38:    const sharedPrefix = Array.from({ length: 20 }, (_, index) => `shared-prefix-token-${index}`).join(' ');
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:41:    const firstPrompt = `${sharedPrefix} ${firstTail}`;
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:42:    const secondPrompt = `${sharedPrefix} ${secondTail}`;
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:665:    // Test 3: validate_anchor_uniqueness handles collisions
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:669:      pass('T-009e: validate_anchor_uniqueness handles collisions', unique);
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:671:      fail('T-009e: validate_anchor_uniqueness handles collisions', unique);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:102:    const longRationale = 'Because the shared truncation helper keeps the decision context readable and avoids clipping words in the saved memory output. '
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:110:          decision: 'Adopt the shared truncation helper everywhere',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:120:    expect(result.DECISIONS[0]?.CONTEXT).toContain('Adopt the shared truncation helper everywhere');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:16:  createBoard: (opts: { sessionId: string; generation?: number; loopType: string; target?: string }) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:32:  createSegmentState: (id: string, config: { sessionId: string; generation?: number; waveId?: string; loopType?: string; files?: string[]; domains?: string[] }) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:51:      const b = board.createBoard({ sessionId: 'sess-1', loopType: 'review', target: 'my-repo' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:53:      expect(b.sessionId).toBe('sess-1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:60:    it('throws for missing sessionId', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:65:      expect(board.createBoard({ sessionId: 's', loopType: 'invalid' } as any)).toBeNull();
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:71:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:81:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:91:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:104:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:121:      const b = board.createBoard({ sessionId: 's1', generation: 2, loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:127:      expect(record.sessionId).toBe('s1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:136:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:145:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:152:      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:179:      expect(segState.MERGE_KEYS).toEqual(['sessionId', 'generation', 'segment', 'wave', 'findingId']);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:185:      const s = segState.createSegmentState('seg-1', { sessionId: 'sess-1', files: ['a.ts'] });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:187:      expect(s.sessionId).toBe('sess-1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:194:      expect(segState.createSegmentState('', { sessionId: 's' })).toBeNull();
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:197:    it('throws for missing sessionId', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:204:      const state = segState.createSegmentState('seg-1', { sessionId: 's1', generation: 2, waveId: 'w1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:206:      expect(record.sessionId).toBe('s1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:216:      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:219:      expect(state.jsonlRecords[0].sessionId).toBe('s1');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:226:      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:229:      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:238:      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:241:      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:250:      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:253:      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:262:      const s1 = segState.createSegmentState('seg-2', { sessionId: 's1', generation: 1 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:265:      const s2 = segState.createSegmentState('seg-1', { sessionId: 's1', generation: 1 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:282:      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:294:        '{"sessionId":"s1","generation":1,"segment":"seg-1","wave":"w1","findingId":"f1","valid":true}',
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:296:        '{"sessionId":"s1","generation":1,"segment":"seg-1","wave":"w1","findingId":"f2","also":"valid"}',
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:308:        sessionId: 's1', generation: 1, segment: 'seg-1', wave: 'w1', findingId: 'f1',
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:315:      const result = segState.validateMergeKeys({ sessionId: 's1' });
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:135:      sessionId: 'hit-current-3',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:150:      sessionId: 'hit-current-4',
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js:13:// Configure relative paths - embeddings consolidated to shared/ on 2024-12-31
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js:14:const libPath = path.join(__dirname, '../../shared/dist');
.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js:25:    // Test 1: Import modules (from shared/ after 2024-12-31 consolidation)
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:5:import { extractTriggerPhrases as extractSharedTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:28:  vi.doUnmock('../../shared/embeddings/factory');
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:67:    const embeddings = await import('../../shared/embeddings');
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:98:    vi.doMock('../../shared/embeddings/factory', () => ({
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:109:    const embeddings = await import('../../shared/embeddings');
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:15:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:29:  it('falls back to the shared boundary-safe helper for very long summaries', async () => {
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:51:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:19:import { handleCoverageGraphConvergence } from '../../mcp_server/handlers/coverage-graph/convergence.js';
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:26:function makeNode(id: string, sessionId: string, kind: CoverageNode['kind'], name: string, metadata?: Record<string, unknown>): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:31:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:38:function makeEdge(id: string, sessionId: string, sourceId: string, targetId: string, relation: CoverageEdge['relation']): CoverageEdge {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:43:    sessionId,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:52:  response: Awaited<ReturnType<typeof handleCoverageGraphConvergence>>,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:57:describe('coverage graph session isolation', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:106:  it('returns only the requested session nodes when sessionId is provided', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:107:    const sessionNodes = getNodes({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:110:      sessionId: SESSION_A,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:121:    const aggregateNodes = getNodes({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:137:  it('returns only the requested session edges when sessionId is provided', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:141:      sessionId: SESSION_A,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:165:  it('computes convergence from the session-scoped subset and defaults to all sessions when sessionId is omitted', async () => {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:166:    const scopedData = parseHandlerData(await handleCoverageGraphConvergence({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:169:      sessionId: SESSION_A,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:175:      sessionId: SESSION_A,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:183:    const aggregateData = parseHandlerData(await handleCoverageGraphConvergence({
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:192:    expect(aggregateData.namespace.sessionId).toBeUndefined();
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:193:    expect(aggregateData.scopeMode).toBe('all_sessions_default');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:201:// REQ-028 (F004, F005 in the 042 closing audit): shared-ID
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:202:// collision regression. Two sessions intentionally reuse the same
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:210:describe('coverage graph session isolation — shared-ID collisions', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:211:  const SHARED_SPEC = 'specs/042-session-collision';
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:216:  const nsX = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_X };
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:217:  const nsY = { specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE, sessionId: SESSION_Y };
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:219:  function collisionNode(sessionId: string, id: string, name: string): CoverageNode {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:224:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:230:  function collisionEdge(sessionId: string, id: string, sourceId: string, targetId: string): CoverageEdge {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:235:      sessionId,
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:246:    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-collision-'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:260:    // Session X writes "q-shared" first with one name.
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:261:    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X text'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:262:    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X text');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:263:    expect(getNode(nsY, 'q-shared')).toBeNull();
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:268:    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y text'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:270:    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X text');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:271:    expect(getNode(nsY, 'q-shared')?.name).toBe('Question Y text');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:273:    const allSessionX = getNodes(nsX).map((n) => n.id);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:274:    const allSessionY = getNodes(nsY).map((n) => n.id);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:275:    expect(allSessionX).toEqual(['q-shared']);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:276:    expect(allSessionY).toEqual(['q-shared']);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:278:    const aggregate = getNodes({ specFolder: SHARED_SPEC, loopType: SHARED_LOOP_TYPE });
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:284:    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:285:    upsertNode(collisionNode(SESSION_X, 'f-shared', 'Finding X'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:286:    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:287:    upsertNode(collisionNode(SESSION_Y, 'f-shared', 'Finding Y'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:289:    upsertEdge(collisionEdge(SESSION_X, 'answers-shared', 'f-shared', 'q-shared'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:290:    expect(getEdge(nsX, 'answers-shared')).toBeTruthy();
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:291:    expect(getEdge(nsY, 'answers-shared')).toBeNull();
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:294:    upsertEdge(collisionEdge(SESSION_Y, 'answers-shared', 'f-shared', 'q-shared'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:296:    const edgeX = getEdge(nsX, 'answers-shared');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:297:    const edgeY = getEdge(nsY, 'answers-shared');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:300:    expect(edgeX?.sessionId).toBe(SESSION_X);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:301:    expect(edgeY?.sessionId).toBe(SESSION_Y);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:308:    expect(getEdgesFrom(nsX, 'f-shared').map((e) => e.id)).toEqual(['answers-shared']);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:309:    expect(getEdgesFrom(nsY, 'f-shared').map((e) => e.id)).toEqual(['answers-shared']);
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:313:    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X v1'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:314:    upsertNode(collisionNode(SESSION_Y, 'q-shared', 'Question Y v1'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:317:    upsertNode(collisionNode(SESSION_X, 'q-shared', 'Question X v2'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:319:    expect(getNode(nsX, 'q-shared')?.name).toBe('Question X v2');
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:320:    expect(getNode(nsY, 'q-shared')?.name).toBe('Question Y v1');
.opencode/skill/system-spec-kit/mcp_server/tests/atomic-index-memory.vitest.ts:225:  it('serializes concurrent writes through the shared spec-folder lock', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:32:    sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:67:    params.sessionId ?? null,
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:3:import { validateMemoryTemplateContract } from '../../shared/parsing/memory-template-contract';
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:54:          sessionId: 'session-001',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:6:import type { MCPResponse } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:12:} from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:13:import { validateMemoryTemplateContract } from '@spec-kit/shared/parsing/memory-template-contract';
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:73:  'refactor shared utility functions module',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:62:    sessionId: 'rvw-fail-closed',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:117:        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:119:        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:141:        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:142:        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:179:        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:182:        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:195:    expect(result.registry.sessionId).toBe('rvw-fail-closed');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:80:function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:83:  ).run(sessionId, hash, memoryId, sentAt);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:232:    it('returns failure for empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:264:    it('empty sessionId returns zeros', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:334:    it('generates a server session when caller omits sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:430:    it('rejects empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:449:    it('fails for empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:506:        expect(state.sessionId).toBe('recover-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:539:    it('rejects empty sessionId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:560:        const ids = r.sessions.map((s: InterruptedSession) => s.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:564:        const s1 = r.sessions.find((s: InterruptedSession) => s.sessionId === 'int-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:577:      const ids = r.sessions.map((session: InterruptedSession) => session.sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:598:        sessionId: 'gen-md-1',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:619:      // Minimal input (only sessionId required)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:620:      const md = sm.generateContinueSessionMd({ sessionId: 'gen-md-2' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:71:      sessionId: 'hit-current-3',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:85:      sessionId: 'miss-current-2',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:98:      sessionId: 'ambiguity-current-3',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:125:        sessionId: 'hit-current-3',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:127:      sessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:160:      sessionId: undefined,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:13:import { validateMemoryTemplateContract } from '../../shared/parsing/memory-template-contract';
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:89:        sessionId: 'implementation-save-2',
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:18:    fs.mkdirSync(path.join(root, 'shared'), { recursive: true });
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:39:  it('T39: GAP A detects shared -> mcp_server/scripts imports across syntax variants', () => {
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:42:    writeFixtureFile(root, 'shared/named-multiline.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:50:    writeFixtureFile(root, 'shared/default-import.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:55:    writeFixtureFile(root, 'shared/namespace-import.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:60:    writeFixtureFile(root, 'shared/dynamic-import.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:78:  it('parses export-from, import type, and require() forms when checking shared neutrality', () => {
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:81:    writeFixtureFile(root, 'shared/export-from.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:85:    writeFixtureFile(root, 'shared/import-type.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:90:    writeFixtureFile(root, 'shared/require-call.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:206:    writeFixtureFile(root, 'shared/utils.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:207:      'export const sharedValue = 42;',
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:226:  it('T45: valid mcp_server/scripts -> shared imports are not false positives', () => {
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:229:    writeFixtureFile(root, 'shared/utils.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:230:      'export const sharedValue = 42;',
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:233:    writeFixtureFile(root, 'shared/consumer.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:234:      "import { sharedValue } from './utils';",
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:235:      'export const value = sharedValue;',
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:239:      "import { sharedValue } from '../../shared/utils';",
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:240:      'export const fromMcp = sharedValue;',
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:243:    writeFixtureFile(root, 'scripts/use-shared.ts', [
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:244:      "import { sharedValue } from '../shared/utils';",
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:245:      'export const fromScripts = sharedValue;',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:1:{"type":"config","mode":"review","topic":"Review of graph optimization module","reviewTarget":"specs/040-graph-optimization","reviewTargetType":"spec-folder","reviewDimensions":["correctness","security","traceability","maintainability"],"sessionId":"rvw-2026-03-20T14-00-00Z","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"stuckThreshold":2,"createdAt":"2026-03-20T14:00:00Z","specFolder":"040-graph-optimization","releaseReadinessState":"in-progress"}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:2:{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"D1 Correctness - reducer logic review","dimensions":["correctness"],"filesReviewed":["src/graph-reducer.ts","src/parser.ts"],"sessionId":"rvw-2026-03-20T14-00-00Z","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":4,"findingsSummary":{"P0":1,"P1":2,"P2":1},"findingsNew":{"P0":1,"P1":2,"P2":1},"newFindingsRatio":0.90,"timestamp":"2026-03-20T14:12:00Z","durationMs":72000}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:3:{"type":"iteration","mode":"review","run":2,"status":"complete","focus":"D2 Security - injection prevention audit","dimensions":["security","correctness"],"filesReviewed":["src/sanitizer.ts","src/input-validator.ts"],"sessionId":"rvw-2026-03-20T14-00-00Z","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":6,"findingsSummary":{"P0":1,"P1":3,"P2":2},"findingsNew":{"P0":0,"P1":1,"P2":1},"newFindingsRatio":0.40,"timestamp":"2026-03-20T14:24:00Z","durationMs":65000}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:4:{"type":"event","event":"blocked_stop","mode":"review","run":2,"stopReason":"blockedStop","legalStop":{"blockedBy":["dimensionCoverage","p0Resolution"],"gateResults":{"findingStability":{"pass":true,"detail":"Stability voted STOP."},"dimensionCoverage":{"pass":false,"detail":"Traceability and maintainability not examined."},"p0Resolution":{"pass":false,"detail":"1 unresolved P0."},"evidenceDensity":{"pass":true,"detail":"Density sufficient."},"hotspotSaturation":{"pass":true,"detail":"Hotspots saturated."}},"replayInputs":{"iterationCount":2,"newFindingsRatio":0.40,"noveltyRatio":0.40,"dimensionsExamined":["correctness","security"],"reviewDimensions":["correctness","security","traceability","maintainability"],"activeFindings":{"P0":1,"P1":3,"P2":2},"hotspotCoverage":{"saturated":1,"required":2}}},"recoveryStrategy":"Cover traceability and maintainability dimensions, then resolve the active P0.","timestamp":"2026-03-20T14:24:30Z"}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:5:{"type":"iteration","mode":"review","run":3,"status":"complete","focus":"D3 Traceability + D4 Maintainability sweep","dimensions":["traceability","maintainability"],"filesReviewed":["specs/040/spec.md","src/graph-reducer.ts","src/utils.ts"],"sessionId":"rvw-2026-03-20T14-00-00Z","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":7,"findingsSummary":{"P0":0,"P1":3,"P2":4},"findingsNew":{"P0":0,"P1":0,"P2":2},"newFindingsRatio":0.08,"convergenceSignals":{"rollingAvg":0.09,"madScore":0.06,"noveltyRatio":0.08,"compositeStop":0.62},"timestamp":"2026-03-20T14:36:00Z","durationMs":58000}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:6:{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":3,"verdict":"CONDITIONAL","activeP0":0,"activeP1":3,"activeP2":4,"dimensionCoverage":1.0,"stopReason":"converged","legalStop":{"blockedBy":[],"gateResults":{"findingStability":{"pass":true,"detail":"Stable."},"dimensionCoverage":{"pass":true,"detail":"All dimensions covered."},"p0Resolution":{"pass":true,"detail":"P0 resolved."},"evidenceDensity":{"pass":true,"detail":"Sufficient."},"hotspotSaturation":{"pass":true,"detail":"Saturated."}},"replayInputs":{"iterationCount":3,"newFindingsRatio":0.08,"noveltyRatio":0.08,"dimensionsExamined":["correctness","security","traceability","maintainability"],"hotspotCoverage":{"saturated":2,"required":2},"stopScore":0.62}},"timestamp":"2026-03-20T14:38:00Z"}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/sample-iterations.jsonl:1:{"type":"config","mode":"research","topic":"Legacy holdout replay fixture","maxIterations":5,"convergenceThreshold":0.15,"stuckThreshold":3,"sessionId":"replay-028-fixture"}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/sample-iterations.jsonl:1:{"type":"config","mode":"review","topic":"Replay fixture for 040","maxIterations":7,"convergenceThreshold":0.10,"stuckThreshold":2,"sessionId":"replay-040-fixture"}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:3:  "sessionSummary": "Phase 1 foundation work focused on two narrow repairs that improve memory quality without widening the remediation packet into unrelated metadata or reviewer behavior. The first repair aligned the OVERVIEW anchor identity so the table of contents, the HTML anchor, and the internal comment marker all point to the same destination. The second repair extracted a shared truncation helper so long session summaries stop at a clean word boundary and carry the canonical Unicode ellipsis instead of drifting between punctuation styles. The fixture describes a realistic verification pass where the helper was reused by the observation summary path, the OVERVIEW owner adopted the same contract, the compiled CLI replay was exercised with explicit JSON input, and the temporary replay artifacts were removed immediately after the check so the packet memory store stayed clean for the real documentation workflow.",

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts | sed -n '880,990p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   880	  afterEach(() => {
   881	    // Close the DB to release the file handle
   882	    try { closeDb(); } catch { /* may not be initialized */ }
   883	  });
   884	
   885	  it('initDb creates WAL mode database', () => {
   886	    const db = initDb(tempDir);
   887	
   888	    expect(db).toBeDefined();
   889	    expect(db).toBe(getDb());
   890	
   891	    const stats = getStats();
   892	    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
   893	
   894	    closeDb();
   895	  });
   896	
   897	  it('schema versioning detection', () => {
   898	    initDb(tempDir);
   899	
   900	    const stats = getStats();
   901	    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
   902	    expect(stats.totalFiles).toBe(0);
   903	  });
   904	
   905	  it('stores file mtimes and reports stale files via mtime checks', () => {
   906	    initDb(tempDir);
   907	
   908	    const trackedFile = path.join(tempDir, 'tracked.ts');
   909	    fs.writeFileSync(trackedFile, 'export const value = 1;\n');
   910	
   911	    upsertFile(
   912	      trackedFile,
   913	      'typescript',
   914	      'hash-abc',
   915	      0,
   916	      0,
   917	      'clean',
   918	      5,
   919	    );
   920	
   921	    const row = getDb().prepare(
   922	      'SELECT file_mtime_ms FROM code_files WHERE file_path = ?',
   923	    ).get(trackedFile) as { file_mtime_ms: number } | undefined;
   924	
   925	    expect(row?.file_mtime_ms).toBeGreaterThan(0);
   926	    expect(isFileStale(trackedFile)).toBe(false);
   927	    expect(ensureFreshFiles([trackedFile])).toEqual({
   928	      stale: [],
   929	      fresh: [trackedFile],
   930	    });
   931	
   932	    const futureTime = new Date(Date.now() + 5_000);
   933	    fs.utimesSync(trackedFile, futureTime, futureTime);
   934	
   935	    expect(isFileStale(trackedFile)).toBe(true);
   936	    expect(ensureFreshFiles([trackedFile])).toEqual({
   937	      stale: [trackedFile],
   938	      fresh: [],
   939	    });
   940	  });
   941	
   942	  it('stores code graph metadata for git HEAD tracking and creates the file-line index', () => {
   943	    initDb(tempDir);
   944	
   945	    expect(getLastGitHead()).toBeNull();
   946	
   947	    setLastGitHead('abc123');
   948	
   949	    expect(getLastGitHead()).toBe('abc123');
   950	
   951	    const indexes = getDb().prepare('PRAGMA index_list(code_nodes)').all() as Array<{ name: string }>;
   952	    expect(indexes.some((index) => index.name === 'idx_file_line')).toBe(true);
   953	  });
   954	
   955	  it('recovery after corrupted DB file', () => {
   956	    const dbPath = path.join(tempDir, 'code-graph.sqlite');
   957	    fs.writeFileSync(dbPath, Buffer.from([0x00, 0xff, 0xde, 0xad, 0xbe, 0xef]));
   958	
   959	    try { closeDb(); } catch { /* may not be initialized */ }
   960	
   961	    let initError: unknown = null;
   962	    try {
   963	      initDb(tempDir);
   964	    } catch (err) {
   965	      initError = err;
   966	    }
   967	
   968	    // Either succeeds (SQLite recreates over garbage) or throws a meaningful error —
   969	    // the critical assertion is that it does not hang or crash the process silently.
   970	    if (initError !== null) {
   971	      expect(initError).toBeInstanceOf(Error);
   972	      expect((initError as Error).message.length).toBeGreaterThan(0);
   973	    } else {
   974	      // Succeeded — verify the DB is functional
   975	      expect(getStats).not.toThrow();
   976	    }
   977	  });
   978	
   979	  it('cleanupOrphans removes stale nodes/edges', () => {
   980	    initDb(tempDir);
   981	
   982	    const fileId = upsertFile(
   983	      '/test/file.ts',
   984	      'typescript',
   985	      'hash-abc',
   986	      1,
   987	      0,
   988	      'ok',
   989	      50,
   990	    );

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/decision-record.md | sed -n '150,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"deep-loop-graph|coverage graph|SCHEMA_VERSION = 2|DROP TABLE IF EXISTS coverage_|schema_version.*coverage|migration.*coverage|initDb\\(tempDir\\).*coverage|session-isolation\" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/scripts/tests" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:57:describe('coverage graph session isolation', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:61:    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-session-isolation-'));
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:210:describe('coverage graph session isolation — shared-ID collisions', () => {
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:353:    const sessionId = 'session-isolation';
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:4:// Tests for the coverage graph database projection contract.
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:4:// Tests for the MCP tool surface that exposes coverage graph

exec
/bin/zsh -lc 'rg -n "REQ-024|REQ-028|session isolation|composite|collision|drop-and-recreate|drop the v1 tables|all_sessions_default" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/decision-record.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// COVERAGE GRAPH DB INTEGRATION TESTS (T022)
     3	// ───────────────────────────────────────────────────────────────
     4	// Tests for the coverage graph database projection contract.
     5	// Validates upsert, query, replay, and latency expectations
     6	// for the MCP-maintained SQLite graph projection.
     7	
     8	import { describe, it, expect } from 'vitest';
     9	
    10	/**
    11	 * Coverage Graph DB contract test stubs.
    12	 *
    13	 * These tests validate the contract defined in state_format.md
    14	 * Section 12 (Coverage Graph Integration Contract). The actual
    15	 * MCP implementation will be wired in Phase 3; these tests
    16	 * verify the contract shape and expected behaviors.
    17	 */
    18	
    19	// --- Contract shape validation ---
    20	
    21	interface UpsertPayload {
    22	  namespace: string;
    23	  nodes: Array<{ id: string; type: string; label: string; iteration: number }>;
    24	  edges: Array<{ source: string; target: string; relation: string; weight: number; iteration: number }>;
    25	  iteration: number;
    26	}
    27	
    28	interface UpsertResponse {
    29	  accepted: number;
    30	  rejected: number;
    31	  signals: {
    32	    componentCount: number;
    33	    largestComponentSize: number;
    34	    isolatedNodes: number;
    35	    totalNodes: number;
    36	    totalEdges: number;
    37	  };
    38	}
    39	
    40	describe('coverage-graph-db contract', () => {
    41	  describe('upsert payload shape', () => {
    42	    it('validates a well-formed upsert payload', () => {
    43	      const payload: UpsertPayload = {
    44	        namespace: 'dr-2026-03-18T10-00-00Z',
    45	        nodes: [
    46	          { id: 'q-1', type: 'question_node', label: 'What causes latency?', iteration: 3 },
    47	          { id: 'f-2', type: 'finding_node', label: 'Connection pooling bottleneck', iteration: 3 },
    48	        ],
    49	        edges: [
    50	          { source: 'f-2', target: 'q-1', relation: 'ANSWERS', weight: 1.3, iteration: 3 },
    51	        ],
    52	        iteration: 3,
    53	      };
    54	
    55	      expect(payload.namespace).toBeTruthy();
    56	      expect(payload.nodes.length).toBeGreaterThan(0);
    57	      expect(payload.edges.length).toBeGreaterThan(0);
    58	      expect(payload.iteration).toBeGreaterThan(0);
    59	    });
    60	
    61	    it('requires namespace on every payload', () => {
    62	      const payload: UpsertPayload = {
    63	        namespace: '',
    64	        nodes: [],
    65	        edges: [],
    66	        iteration: 1,
    67	      };
    68	
    69	      // Empty namespace should be rejected
    70	      expect(payload.namespace).toBeFalsy();
    71	    });
    72	
    73	    it('accepts empty nodes and edges arrays', () => {
    74	      const payload: UpsertPayload = {
    75	        namespace: 'test-ns',
    76	        nodes: [],
    77	        edges: [],
    78	        iteration: 1,
    79	      };
    80	
    81	      expect(payload.nodes.length).toBe(0);
    82	      expect(payload.edges.length).toBe(0);
    83	    });
    84	  });
    85	
    86	  describe('upsert response shape', () => {
    87	    it('validates a well-formed response', () => {
    88	      const response: UpsertResponse = {
    89	        accepted: 5,
    90	        rejected: 0,
    91	        signals: {
    92	          componentCount: 2,
    93	          largestComponentSize: 8,
    94	          isolatedNodes: 1,
    95	          totalNodes: 10,
    96	          totalEdges: 12,
    97	        },
    98	      };
    99	
   100	      expect(response.accepted).toBeGreaterThanOrEqual(0);
   101	      expect(response.rejected).toBeGreaterThanOrEqual(0);
   102	      expect(response.accepted + response.rejected).toBeGreaterThanOrEqual(0);
   103	      expect(response.signals.componentCount).toBeGreaterThanOrEqual(0);
   104	      expect(response.signals.totalNodes).toBeGreaterThanOrEqual(0);
   105	    });
   106	
   107	    it('signals contain all required fields', () => {
   108	      const signals: UpsertResponse['signals'] = {
   109	        componentCount: 1,
   110	        largestComponentSize: 5,
   111	        isolatedNodes: 0,
   112	        totalNodes: 5,
   113	        totalEdges: 4,
   114	      };
   115	
   116	      const requiredKeys = ['componentCount', 'largestComponentSize', 'isolatedNodes', 'totalNodes', 'totalEdges'];
   117	      for (const key of requiredKeys) {
   118	        expect(signals).toHaveProperty(key);
   119	      }
   120	    });
   121	  });
   122	
   123	  describe('latency budget contract', () => {
   124	    it('defines 500ms budget for upsert batches', () => {
   125	      const UPSERT_BUDGET_MS = 500;
   126	      expect(UPSERT_BUDGET_MS).toBe(500);
   127	    });
   128	
   129	    it('defines 200ms budget for queries', () => {
   130	      const QUERY_BUDGET_MS = 200;
   131	      expect(QUERY_BUDGET_MS).toBe(200);
   132	    });
   133	  });
   134	
   135	  describe('replay semantics', () => {
   136	    it('graph is rebuildable from JSONL alone', () => {
   137	      // Simulate replay: collect all graphEvents from iteration records
   138	      const iterationRecords = [
   139	        {
   140	          type: 'iteration',
   141	          run: 1,
   142	          graphEvents: [
   143	            { kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' },
   144	            { kind: 'edge', source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
   145	          ],
   146	        },
   147	        {
   148	          type: 'iteration',
   149	          run: 2,
   150	          graphEvents: [
   151	            { kind: 'node', id: 'f-2', nodeType: 'finding_node', label: 'F2' },
   152	            { kind: 'edge', source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
   153	          ],
   154	        },
   155	      ];
   156	
   157	      // Replay: collect all events
   158	      const allNodes: Array<{ kind: string; id: string }> = [];
   159	      const allEdges: Array<{ kind: string; source: string; target: string }> = [];
   160	
   161	      for (const record of iterationRecords) {
   162	        for (const event of record.graphEvents) {
   163	          if (event.kind === 'node') allNodes.push(event as { kind: string; id: string });
   164	          if (event.kind === 'edge') allEdges.push(event as { kind: string; source: string; target: string });
   165	        }
   166	      }
   167	
   168	      expect(allNodes.length).toBe(2);
   169	      expect(allEdges.length).toBe(2);
   170	    });
   171	
   172	    it('replay produces deterministic results', () => {
   173	      const events = [
   174	        { kind: 'node', id: 'a', nodeType: 'finding_node', label: 'A' },
   175	        { kind: 'node', id: 'b', nodeType: 'finding_node', label: 'B' },
   176	        { kind: 'edge', source: 'a', target: 'b', relation: 'CITES' },
   177	      ];
   178	
   179	      // Two replays of the same events should produce the same graph
   180	      const replay1Nodes = events.filter((e) => e.kind === 'node');
   181	      const replay2Nodes = events.filter((e) => e.kind === 'node');
   182	
   183	      expect(replay1Nodes.length).toBe(replay2Nodes.length);
   184	      expect(replay1Nodes.map((n) => n.id)).toEqual(replay2Nodes.map((n) => n.id));
   185	    });
   186	  });
   187	
   188	  describe('namespace scoping', () => {
   189	    it('namespaces isolate graph data between sessions', () => {
   190	      const ns1 = 'dr-session-1';
   191	      const ns2 = 'dr-session-2';
   192	      expect(ns1).not.toBe(ns2);
   193	      // Contract: nodes in ns1 are invisible from ns2 queries
   194	    });
   195	
   196	    it('namespace matches sessionId format', () => {
   197	      const namespace = 'dr-2026-03-18T10-00-00Z';
   198	      expect(namespace).toMatch(/^(dr|rvw)-\d{4}-\d{2}-\d{2}T/);
   199	    });
   200	  });
   201	
   202	  describe('node type taxonomy', () => {
   203	    it('research node types are well-defined', () => {
   204	      const researchNodeTypes = ['question_node', 'finding_node', 'claim_node', 'source_node'];
   205	      expect(researchNodeTypes.length).toBe(4);
   206	      for (const type of researchNodeTypes) {
   207	        expect(type).toMatch(/_node$/);
   208	      }
   209	    });
   210	
   211	    it('review node types are well-defined', () => {
   212	      const reviewNodeTypes = ['dimension_node', 'file_node', 'finding_node', 'evidence_node'];
   213	      expect(reviewNodeTypes.length).toBe(4);
   214	      for (const type of reviewNodeTypes) {
   215	        expect(type).toMatch(/_node$/);
   216	      }
   217	    });
   218	  });
   219	
   220	  describe('edge relation taxonomy', () => {
   221	    it('research relations are well-defined', () => {
   222	      const researchRelations = ['ANSWERS', 'CONTRADICTS', 'CITES', 'EXTENDS', 'SUPERSEDES'];
   223	      expect(researchRelations.length).toBe(5);
   224	      for (const rel of researchRelations) {
   225	        expect(rel).toBe(rel.toUpperCase());
   226	      }
   227	    });
   228	
   229	    it('review relations are well-defined', () => {
   230	      const reviewRelations = ['COVERS', 'CONTRADICTS', 'EVIDENCES', 'REMEDIATES', 'DEPENDS_ON'];
   231	      expect(reviewRelations.length).toBe(5);
   232	      for (const rel of reviewRelations) {
   233	        expect(rel).toBe(rel.toUpperCase());
   234	      }
   235	    });
   236	  });
   237	});

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// COVERAGE GRAPH TOOLS INTEGRATION TESTS (T022)
     3	// ───────────────────────────────────────────────────────────────
     4	// Tests for the MCP tool surface that exposes coverage graph
     5	// operations. Validates tool input/output schemas, error handling,
     6	// and integration with the reducer's graph contract.
     7	
     8	import { describe, it, expect } from 'vitest';
     9	
    10	/**
    11	 * Coverage Graph MCP Tool contract tests.
    12	 *
    13	 * These tests validate the tool interface contract between the
    14	 * reducer and MCP server. The actual MCP tool handlers will be
    15	 * implemented in Phase 3; these tests verify schema expectations
    16	 * and error handling contracts.
    17	 */
    18	
    19	// --- Tool schema validation ---
    20	
    21	interface GraphUpsertInput {
    22	  namespace: string;
    23	  nodes: Array<{ id: string; type: string; label: string; iteration: number }>;
    24	  edges: Array<{ source: string; target: string; relation: string; weight: number; iteration: number }>;
    25	  iteration: number;
    26	}
    27	
    28	interface GraphQueryInput {
    29	  namespace: string;
    30	  nodeId?: string;
    31	  maxDepth?: number;
    32	  signalsOnly?: boolean;
    33	}
    34	
    35	interface GraphSignalsOutput {
    36	  componentCount: number;
    37	  largestComponentSize: number;
    38	  isolatedNodes: number;
    39	  totalNodes: number;
    40	  totalEdges: number;
    41	  answerCoverage?: number;
    42	  dimensionCoverage?: number;
    43	}
    44	
    45	describe('coverage-graph-tools contract', () => {
    46	  describe('graph_upsert tool schema', () => {
    47	    it('accepts valid upsert input', () => {
    48	      const input: GraphUpsertInput = {
    49	        namespace: 'dr-2026-03-18T10-00-00Z',
    50	        nodes: [
    51	          { id: 'q-1', type: 'question_node', label: 'What causes latency?', iteration: 1 },
    52	        ],
    53	        edges: [
    54	          { source: 'f-1', target: 'q-1', relation: 'ANSWERS', weight: 1.3, iteration: 1 },
    55	        ],
    56	        iteration: 1,
    57	      };
    58	
    59	      expect(input.namespace).toBeTruthy();
    60	      expect(input.nodes.every((n) => n.id && n.type && n.label)).toBe(true);
    61	      expect(input.edges.every((e) => e.source && e.target && e.relation)).toBe(true);
    62	    });
    63	
    64	    it('rejects edges with invalid weight range', () => {
    65	      const invalidWeights = [-1.0, 3.0, NaN, Infinity];
    66	      for (const weight of invalidWeights) {
    67	        const isValid = typeof weight === 'number' && Number.isFinite(weight) && weight >= 0.0 && weight <= 2.0;
    68	        expect(isValid).toBe(false);
    69	      }
    70	    });
    71	
    72	    it('accepts edges with valid weight range', () => {
    73	      const validWeights = [0.0, 0.5, 1.0, 1.3, 2.0];
    74	      for (const weight of validWeights) {
    75	        const isValid = typeof weight === 'number' && Number.isFinite(weight) && weight >= 0.0 && weight <= 2.0;
    76	        expect(isValid).toBe(true);
    77	      }
    78	    });
    79	
    80	    it('rejects self-loop edges', () => {
    81	      const edge = { source: 'a', target: 'a', relation: 'CITES', weight: 1.0, iteration: 1 };
    82	      expect(edge.source).toBe(edge.target);
    83	      // Contract: MCP should reject and increment rejected count
    84	    });
    85	  });
    86	
    87	  describe('graph_query tool schema', () => {
    88	    it('accepts signals-only query', () => {
    89	      const input: GraphQueryInput = {
    90	        namespace: 'dr-2026-03-18T10-00-00Z',
    91	        signalsOnly: true,
    92	      };
    93	
    94	      expect(input.namespace).toBeTruthy();
    95	      expect(input.signalsOnly).toBe(true);
    96	    });
    97	
    98	    it('accepts node traversal query', () => {
    99	      const input: GraphQueryInput = {
   100	        namespace: 'dr-2026-03-18T10-00-00Z',
   101	        nodeId: 'q-1',
   102	        maxDepth: 3,
   103	      };
   104	
   105	      expect(input.nodeId).toBeTruthy();
   106	      expect(input.maxDepth).toBeGreaterThan(0);
   107	    });
   108	
   109	    it('defaults maxDepth to 5 when omitted', () => {
   110	      const DEFAULT_MAX_DEPTH = 5;
   111	      const input: GraphQueryInput = {
   112	        namespace: 'test-ns',
   113	        nodeId: 'q-1',
   114	      };
   115	
   116	      const effectiveDepth = input.maxDepth ?? DEFAULT_MAX_DEPTH;
   117	      expect(effectiveDepth).toBe(5);
   118	    });
   119	  });
   120	
   121	  describe('graph_signals output schema', () => {
   122	    it('returns all required signal fields', () => {
   123	      const output: GraphSignalsOutput = {
   124	        componentCount: 2,
   125	        largestComponentSize: 8,
   126	        isolatedNodes: 1,
   127	        totalNodes: 10,
   128	        totalEdges: 12,
   129	      };
   130	
   131	      const requiredKeys = ['componentCount', 'largestComponentSize', 'isolatedNodes', 'totalNodes', 'totalEdges'];
   132	      for (const key of requiredKeys) {
   133	        expect(output).toHaveProperty(key);
   134	        expect(typeof (output as Record<string, unknown>)[key]).toBe('number');
   135	      }
   136	    });
   137	
   138	    it('includes optional research-specific signal', () => {
   139	      const output: GraphSignalsOutput = {
   140	        componentCount: 1,
   141	        largestComponentSize: 5,
   142	        isolatedNodes: 0,
   143	        totalNodes: 5,
   144	        totalEdges: 4,
   145	        answerCoverage: 0.85,
   146	      };
   147	
   148	      expect(output.answerCoverage).toBeDefined();
   149	      expect(output.answerCoverage).toBeGreaterThanOrEqual(0);
   150	      expect(output.answerCoverage).toBeLessThanOrEqual(1);
   151	    });
   152	
   153	    it('includes optional review-specific signal', () => {
   154	      const output: GraphSignalsOutput = {
   155	        componentCount: 1,
   156	        largestComponentSize: 10,
   157	        isolatedNodes: 0,
   158	        totalNodes: 10,
   159	        totalEdges: 15,
   160	        dimensionCoverage: 0.75,
   161	      };
   162	
   163	      expect(output.dimensionCoverage).toBeDefined();
   164	      expect(output.dimensionCoverage).toBeGreaterThanOrEqual(0);
   165	      expect(output.dimensionCoverage).toBeLessThanOrEqual(1);
   166	    });
   167	  });
   168	
   169	  describe('error handling contract', () => {
   170	    it('returns rejected count for invalid nodes', () => {
   171	      // Contract: nodes without required id field should be rejected
   172	      const invalidNode = { type: 'finding_node', label: 'No ID' };
   173	      expect(invalidNode).not.toHaveProperty('id');
   174	    });
   175	
   176	    it('returns rejected count for invalid edges', () => {
   177	      // Contract: edges missing source or target should be rejected
   178	      const invalidEdge = { target: 'q-1', relation: 'ANSWERS', weight: 1.0 };
   179	      expect(invalidEdge).not.toHaveProperty('source');
   180	    });
   181	
   182	    it('handles missing namespace gracefully', () => {
   183	      const input = { nodes: [], edges: [], iteration: 1 };
   184	      expect(input).not.toHaveProperty('namespace');
   185	      // Contract: should return error, not crash
   186	    });
   187	  });
   188	
   189	  describe('fallback authority chain', () => {
   190	    it('priority 1: JSONL is always available', () => {
   191	      const priority1 = { source: 'jsonl', available: true };
   192	      expect(priority1.available).toBe(true);
   193	    });
   194	
   195	    it('priority 2: local JSON graph is reducer-rebuilt', () => {
   196	      const priority2 = { source: 'local-cache', available: true };
   197	      expect(priority2.source).toBe('local-cache');
   198	    });
   199	
   200	    it('priority 3: SQLite projection is MCP-maintained', () => {
   201	      const priority3 = { source: 'mcp', available: false };
   202	      // MCP may not always be available
   203	      expect(priority3.source).toBe('mcp');
   204	    });
   205	
   206	    it('reducer produces correct signals from JSONL alone', () => {
   207	      // Contract: even without MCP, the reducer must produce
   208	      // valid convergence signals from graphEvents in JSONL
   209	      const jsonlOnly = true;
   210	      const mcpAvailable = false;
   211	      expect(jsonlOnly).toBe(true);
   212	      expect(mcpAvailable).toBe(false);
   213	      // The reducer's getGraphState with mcpAvailable=false
   214	      // should still return valid graph state from JSONL
   215	    });
   216	  });
   217	
   218	  describe('convergence signal integration', () => {
   219	    it('graph signals participate in quality gate sub-checks', () => {
   220	      const qualityGateChecks = [
   221	        'sourceDiversity',
   222	        'focusAlignment',
   223	        'singleWeakSourceDominance',
   224	        'graphCoverage',
   225	      ];
   226	
   227	      expect(qualityGateChecks).toContain('graphCoverage');
   228	    });
   229	
   230	    it('graphCoverage sub-check passes when answer coverage >= 0.85', () => {
   231	      const answerCoverage = 0.90;
   232	      const isolatedNodes = 0;
   233	      const graphCoveragePass = answerCoverage >= 0.85 && isolatedNodes <= 2;
   234	      expect(graphCoveragePass).toBe(true);
   235	    });
   236	
   237	    it('graphCoverage sub-check fails when too many isolated nodes', () => {
   238	      const answerCoverage = 0.90;
   239	      const isolatedNodes = 5;
   240	      const graphCoveragePass = answerCoverage >= 0.85 && isolatedNodes <= 2;
   241	      expect(graphCoveragePass).toBe(false);
   242	    });
   243	
   244	    it('graphCoverage sub-check is skipped when no graph data', () => {
   245	      const totalNodes = 0;
   246	      const skipGraphCheck = totalNodes === 0;
   247	      expect(skipGraphCheck).toBe(true);
   248	    });
   249	
   250	    it('review graphEvidence sub-check validates finding connectivity', () => {
   251	      const graphFindingConnectivity = 0.95;
   252	      const graphIsolatedFindings = 0;
   253	      const graphEvidencePass = graphFindingConnectivity >= 0.90 && graphIsolatedFindings === 0;
   254	      expect(graphEvidencePass).toBe(true);
   255	    });
   256	  });
   257	
   258	  describe('weight calibration', () => {
   259	    it('research relation weights fall within valid range', () => {
   260	      const weights = {
   261	        ANSWERS: 1.3,
   262	        CONTRADICTS: 0.8,
   263	        CITES: 1.0,
   264	        EXTENDS: 1.1,
   265	        SUPERSEDES: 1.2,
   266	      };
   267	
   268	      for (const [, weight] of Object.entries(weights)) {
   269	        expect(weight).toBeGreaterThanOrEqual(0.0);
   270	        expect(weight).toBeLessThanOrEqual(2.0);
   271	      }
   272	    });
   273	
   274	    it('review relation weights fall within valid range', () => {
   275	      const weights = {
   276	        COVERS: 1.3,
   277	        CONTRADICTS: 0.8,
   278	        EVIDENCES: 1.0,
   279	        REMEDIATES: 1.1,
   280	        DEPENDS_ON: 0.9,
   281	      };
   282	
   283	      for (const [, weight] of Object.entries(weights)) {
   284	        expect(weight).toBeGreaterThanOrEqual(0.0);
   285	        expect(weight).toBeLessThanOrEqual(2.0);
   286	      }
   287	    });
   288	  });
   289	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    73	// ───────────────────────────────────────────────────────────────
    74	// 2. NODE-LEVEL SIGNALS
    75	// ───────────────────────────────────────────────────────────────
    76	
    77	/**
    78	 * Compute degree, depth, and weight signals for all nodes in a namespace.
    79	 */
    80	export function computeNodeSignals(ns: Namespace): NodeSignal[] {
    81	  const nodes = getNodes(ns);
    82	  const edges = getEdges(ns);
    83	
    84	  // Build adjacency maps
    85	  const inDegreeMap = new Map<string, number>();
    86	  const outDegreeMap = new Map<string, number>();
    87	  const weightSumMap = new Map<string, number>();
    88	
    89	  for (const edge of edges) {
    90	    outDegreeMap.set(edge.sourceId, (outDegreeMap.get(edge.sourceId) ?? 0) + 1);
    91	    inDegreeMap.set(edge.targetId, (inDegreeMap.get(edge.targetId) ?? 0) + 1);
    92	    weightSumMap.set(edge.sourceId, (weightSumMap.get(edge.sourceId) ?? 0) + edge.weight);
    93	    weightSumMap.set(edge.targetId, (weightSumMap.get(edge.targetId) ?? 0) + edge.weight);
    94	  }
    95	
    96	  // BFS depth from root nodes (nodes with no incoming edges)
    97	  const depthMap = computeDepths(nodes, edges);
    98	
    99	  return nodes.map(node => ({
   100	    nodeId: node.id,
   101	    kind: node.kind,
   102	    degree: (inDegreeMap.get(node.id) ?? 0) + (outDegreeMap.get(node.id) ?? 0),
   103	    inDegree: inDegreeMap.get(node.id) ?? 0,
   104	    outDegree: outDegreeMap.get(node.id) ?? 0,
   105	    depth: depthMap.get(node.id) ?? 0,
   106	    weightSum: weightSumMap.get(node.id) ?? 0,
   107	  }));
   108	}
   109	
   110	/**
   111	 * Compute longest-path depth for each node from any root node.
   112	 * Mirrors the in-memory CJS implementation so both layers report
   113	 * the same structural depth for DAG-shaped coverage graphs.
   114	 */
   115	function computeDepths(nodes: CoverageNode[], edges: CoverageEdge[]): Map<string, number> {
   116	  const adjacency = new Map<string, string[]>();
   117	  const inDegree = new Map<string, number>();
   118	
   119	  for (const node of nodes) {
   120	    adjacency.set(node.id, []);
   121	    inDegree.set(node.id, 0);
   122	  }
   123	
   124	  for (const edge of edges) {
   125	    if (!adjacency.has(edge.sourceId)) adjacency.set(edge.sourceId, []);
   126	    adjacency.get(edge.sourceId)!.push(edge.targetId);
   127	    inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
   128	    if (!inDegree.has(edge.sourceId)) inDegree.set(edge.sourceId, 0);
   129	  }
   130	
   131	  const depthMap = new Map<string, number>();
   132	  const remaining = new Map(inDegree);
   133	  const queue: string[] = [];
   134	
   135	  for (const [id, degree] of remaining) {
   136	    if (degree === 0) {
   137	      depthMap.set(id, 0);
   138	      queue.push(id);
   139	    }
   140	  }
   141	
   142	  let queueIndex = 0;
   143	  while (queueIndex < queue.length) {
   144	    const current = queue[queueIndex++];
   145	    const currentDepth = depthMap.get(current) ?? 0;
   146	
   147	    for (const childId of adjacency.get(current) ?? []) {
   148	      const candidateDepth = currentDepth + 1;
   149	      if (candidateDepth > (depthMap.get(childId) ?? 0)) {
   150	        depthMap.set(childId, candidateDepth);
   151	      }
   152	
   153	      const nextDegree = (remaining.get(childId) ?? 0) - 1;
   154	      remaining.set(childId, nextDegree);
   155	      if (nextDegree === 0) {
   156	        queue.push(childId);
   157	      }
   158	    }
   159	  }
   160	
   161	  for (const node of nodes) {
   162	    if (!depthMap.has(node.id)) depthMap.set(node.id, 0);
   163	  }
   164	
   165	  return depthMap;
   166	}
   167	
   168	// ───────────────────────────────────────────────────────────────
   169	// 3. RESEARCH CONVERGENCE SIGNALS
   170	// ───────────────────────────────────────────────────────────────
   171	
   172	/**
   173	 * Compute research convergence signals.
   174	 */
   175	export function computeResearchSignals(ns: Namespace): ResearchConvergenceSignals {
   176	  const nodes = getNodes(ns);
   177	  const edges = getEdges(ns);
   178	
   179	  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
   180	  const claimVerificationRate = computeResearchClaimVerificationRateFromData(nodes);
   181	  const contradictionDensity = computeResearchContradictionDensityFromData(edges);
   182	  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
   183	  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);
   184	
   185	  return {
   186	    questionCoverage,
   187	    claimVerificationRate,
   188	    contradictionDensity,
   189	    sourceDiversity,
   190	    evidenceDepth,
   191	  };
   192	}
   193	
   194	function parseNodeMetadata(metadata: CoverageNode['metadata'] | string | null | undefined): Record<string, unknown> | null {
   195	  if (!metadata) return null;
   196	  if (typeof metadata === 'string') {
   197	    try {
   198	      const parsed = JSON.parse(metadata) as unknown;
   199	      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
   200	    } catch {
   201	      return null;
   202	    }
   203	  }
   204	  return typeof metadata === 'object' ? metadata as Record<string, unknown> : null;
   205	}
   206	
   207	function buildAnsweringFindingsByQuestion(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
   208	  const answeringFindings = new Map<string, string[]>();
   209	
   210	  for (const edge of edges) {
   211	    if (edge.relation !== 'ANSWERS') continue;
   212	    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
   213	    answeringFindings.get(edge.targetId)!.push(edge.sourceId);
   214	  }
   215	
   216	  return answeringFindings;
   217	}
   218	
   219	function buildCitedSourcesByFinding(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
   220	  const citedSources = new Map<string, string[]>();

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts | sed -n '340,455p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	
   341	/**
   342	 * Canonical research evidence depth: average path length across all
   343	 * question -> finding paths, scoring 2 when the finding cites at least one
   344	 * source and 1 when it does not.
   345	 */
   346	export function computeResearchEvidenceDepthFromData(
   347	  nodes: ReadonlyArray<ResearchSignalNodeLike>,
   348	  edges: ReadonlyArray<ResearchSignalEdgeLike>,
   349	): number {
   350	  const questionIds = nodes
   351	    .filter(node => node.kind === 'QUESTION')
   352	    .map(node => node.id);
   353	
   354	  if (questionIds.length === 0) return 0;
   355	
   356	  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
   357	  const citedSources = buildCitedSourcesByFinding(edges);
   358	  let totalDepth = 0;
   359	  let pathCount = 0;
   360	
   361	  for (const questionId of questionIds) {
   362	    for (const findingId of answeringFindings.get(questionId) ?? []) {
   363	      totalDepth += (citedSources.get(findingId) ?? []).length > 0 ? 2 : 1;
   364	      pathCount++;
   365	    }
   366	  }
   367	
   368	  return pathCount > 0 ? totalDepth / pathCount : 0;
   369	}
   370	
   371	// ───────────────────────────────────────────────────────────────
   372	// 4. REVIEW CONVERGENCE SIGNALS
   373	// ───────────────────────────────────────────────────────────────
   374	
   375	/**
   376	 * Compute review convergence signals.
   377	 */
   378	export function computeReviewSignals(ns: Namespace): ReviewConvergenceSignals {
   379	  const d = getDb();
   380	  const { specFolder, loopType } = ns;
   381	
   382	  // dimensionCoverage: dimensions with >= 1 COVERS edge / all dimensions
   383	  const allDimensions = (d.prepare(
   384	    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'DIMENSION'`,
   385	  ).get(specFolder, loopType) as { c: number }).c;
   386	
   387	  const coveredDimensions = (d.prepare(`
   388	    SELECT COUNT(*) as c FROM coverage_nodes n
   389	    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'DIMENSION'
   390	      AND EXISTS (
   391	        SELECT 1 FROM coverage_edges e WHERE e.source_id = n.id AND e.relation = 'COVERS'
   392	      )
   393	  `).get(specFolder, loopType) as { c: number }).c;
   394	
   395	  const dimensionCoverage = allDimensions > 0 ? coveredDimensions / allDimensions : 0;
   396	
   397	  // findingStability: findings with 0 CONTRADICTS edges / all findings
   398	  const allFindings = (d.prepare(
   399	    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'`,
   400	  ).get(specFolder, loopType) as { c: number }).c;
   401	
   402	  const stableFindings = (d.prepare(`
   403	    SELECT COUNT(*) as c FROM coverage_nodes n
   404	    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'FINDING'
   405	      AND NOT EXISTS (
   406	        SELECT 1 FROM coverage_edges e
   407	        WHERE (e.source_id = n.id OR e.target_id = n.id) AND e.relation = 'CONTRADICTS'
   408	      )
   409	  `).get(specFolder, loopType) as { c: number }).c;
   410	
   411	  const findingStability = allFindings > 0 ? stableFindings / allFindings : 0;
   412	
   413	  // p0ResolutionRate: P0 findings with RESOLVES edge / P0 findings
   414	  const allP0 = d.prepare(`
   415	    SELECT id, metadata FROM coverage_nodes
   416	    WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'
   417	  `).all(specFolder, loopType) as Array<{ id: string; metadata: string | null }>;
   418	
   419	  let p0Count = 0;
   420	  let p0Resolved = 0;
   421	
   422	  for (const finding of allP0) {
   423	    if (finding.metadata) {
   424	      try {
   425	        const meta = JSON.parse(finding.metadata);
   426	        if (meta.severity === 'P0') {
   427	          p0Count++;
   428	          const hasResolve = (d.prepare(
   429	            `SELECT COUNT(*) as c FROM coverage_edges WHERE target_id = ? AND relation = 'RESOLVES'`,
   430	          ).get(finding.id) as { c: number }).c;
   431	          if (hasResolve > 0) p0Resolved++;
   432	        }
   433	      } catch { /* skip */ }
   434	    }
   435	  }
   436	
   437	  const p0ResolutionRate = p0Count > 0 ? p0Resolved / p0Count : 1.0; // No P0s = fully resolved
   438	
   439	  // evidenceDensity: average EVIDENCE_FOR edges per finding
   440	  const totalEvidenceEdges = (d.prepare(
   441	    `SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND relation = 'EVIDENCE_FOR'`,
   442	  ).get(specFolder, loopType) as { c: number }).c;
   443	
   444	  const evidenceDensity = allFindings > 0 ? totalEvidenceEdges / allFindings : 0;
   445	
   446	  // hotspotSaturation: hotspot files with >= 2 dimension coverage / hotspot files
   447	  const hotspotSaturation = computeHotspotSaturation(d, specFolder, loopType);
   448	
   449	  return {
   450	    dimensionCoverage,
   451	    findingStability,
   452	    p0ResolutionRate,
   453	    evidenceDensity,
   454	    hotspotSaturation,
   455	  };

codex
I’ve isolated the likely failure mode: the schema is composite-keyed, but some higher-level reads still re-link rows using only bare node IDs. I’m doing one last pass over the remaining query helpers so I don’t miss a second leak path before I write the findings.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts | sed -n '1,150p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    54	function buildSessionFilter(column: string, sessionId?: string): { clause: string; params: unknown[] } {
    55	  if (!sessionId) return { clause: '', params: [] };
    56	  return {
    57	    clause: ` AND ${column} = ?`,
    58	    params: [sessionId],
    59	  };
    60	}
    61	
    62	// ───────────────────────────────────────────────────────────────
    63	// 2. COVERAGE GAPS
    64	// ───────────────────────────────────────────────────────────────
    65	
    66	/**
    67	 * Find nodes with coverage gaps.
    68	 * For research: questions that have no incoming ANSWERS or COVERS edges.
    69	 * For review: dimensions/files that are not sources of outgoing COVERS or EVIDENCE_FOR edges.
    70	 */
    71	export function findCoverageGaps(ns: Namespace): CoverageGap[] {
    72	  const d = getDb();
    73	  const { specFolder, loopType, sessionId } = ns;
    74	
    75	  const coverageRelations = loopType === 'research'
    76	    ? ['ANSWERS', 'COVERS']
    77	    : ['COVERS', 'EVIDENCE_FOR'];
    78	
    79	  const targetKinds = loopType === 'research'
    80	    ? ['QUESTION']
    81	    : ['DIMENSION', 'FILE'];
    82	
    83	  const gaps: CoverageGap[] = [];
    84	
    85	  if (loopType === 'review') {
    86	    // Review mode: dimensions/files are sources of outgoing COVERS edges.
    87	    // A gap means the node has no outgoing coverage edges.
    88	    for (const kind of targetKinds) {
    89	      const nodeFilter = buildSessionFilter('n.session_id', sessionId);
    90	      const edgeFilter = buildSessionFilter('e.session_id', sessionId);
    91	      const nodeRows = d.prepare(`
    92	        SELECT n.id, n.kind, n.name
    93	        FROM coverage_nodes n
    94	        WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = ?
    95	          ${nodeFilter.clause}
    96	          AND NOT EXISTS (
    97	            SELECT 1 FROM coverage_edges e
    98	            WHERE e.source_id = n.id
    99	              ${edgeFilter.clause}
   100	              AND e.relation IN (${coverageRelations.map(() => '?').join(',')})
   101	          )
   102	      `).all(
   103	        specFolder,
   104	        loopType,
   105	        kind,
   106	        ...nodeFilter.params,
   107	        ...edgeFilter.params,
   108	        ...coverageRelations,
   109	      ) as Array<{ id: string; kind: string; name: string }>;
   110	
   111	      for (const row of nodeRows) {
   112	        gaps.push({
   113	          nodeId: row.id,
   114	          kind: row.kind,
   115	          name: row.name,
   116	          reason: `No outgoing ${coverageRelations.join(' or ')} edges`,
   117	        });
   118	      }
   119	    }
   120	  } else {
   121	    // Research mode: questions should have incoming ANSWERS edges.
   122	    for (const kind of targetKinds) {
   123	      const nodeFilter = buildSessionFilter('n.session_id', sessionId);
   124	      const edgeFilter = buildSessionFilter('e.session_id', sessionId);
   125	      const nodeRows = d.prepare(`
   126	        SELECT n.id, n.kind, n.name
   127	        FROM coverage_nodes n
   128	        WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = ?
   129	          ${nodeFilter.clause}
   130	          AND NOT EXISTS (
   131	            SELECT 1 FROM coverage_edges e
   132	            WHERE e.target_id = n.id
   133	              ${edgeFilter.clause}
   134	              AND e.relation IN (${coverageRelations.map(() => '?').join(',')})
   135	          )
   136	      `).all(
   137	        specFolder,
   138	        loopType,
   139	        kind,
   140	        ...nodeFilter.params,
   141	        ...edgeFilter.params,
   142	        ...coverageRelations,
   143	      ) as Array<{ id: string; kind: string; name: string }>;
   144	
   145	      for (const row of nodeRows) {
   146	        gaps.push({
   147	          nodeId: row.id,
   148	          kind: row.kind,
   149	          name: row.name,
   150	          reason: `No incoming ${coverageRelations.join(' or ')} edges`,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts | sed -n '320,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	    const rows = d.prepare(`
   321	      SELECT * FROM coverage_nodes
   322	      WHERE spec_folder = ? AND loop_type = ? AND kind = 'CLAIM'
   323	        ${nodeFilter.clause}
   324	    `).all(specFolder, loopType, ...nodeFilter.params) as Record<string, unknown>[];
   325	
   326	    return rows
   327	      .map(r => ({
   328	        id: r.id as string,
   329	        specFolder: r.spec_folder as string,
   330	        loopType: r.loop_type as string,
   331	        sessionId: r.session_id as string,
   332	        kind: r.kind as string,
   333	        name: r.name as string,
   334	        contentHash: r.content_hash as string | undefined,
   335	        iteration: r.iteration as number | undefined,
   336	        metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
   337	        createdAt: r.created_at as string | undefined,
   338	        updatedAt: r.updated_at as string | undefined,
   339	      }))
   340	      .filter(n => {
   341	        const status = n.metadata?.verification_status;
   342	        return status !== 'verified';
   343	      }) as CoverageNode[];
   344	  }
   345	
   346	  // Review: FINDING nodes with no RESOLVES incoming edge
   347	  const reviewNodeFilter = buildSessionFilter('n.session_id', sessionId);
   348	  const reviewEdgeFilter = buildSessionFilter('e.session_id', sessionId);
   349	  const rows = d.prepare(`
   350	    SELECT n.* FROM coverage_nodes n
   351	    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'FINDING'
   352	      ${reviewNodeFilter.clause}
   353	      AND NOT EXISTS (
   354	        SELECT 1 FROM coverage_edges e
   355	        WHERE e.target_id = n.id
   356	          ${reviewEdgeFilter.clause}
   357	          AND e.relation = 'RESOLVES'
   358	      )
   359	  `).all(
   360	    specFolder,
   361	    loopType,
   362	    ...reviewNodeFilter.params,
   363	    ...reviewEdgeFilter.params,
   364	  ) as Record<string, unknown>[];
   365	
   366	  return rows.map(r => ({
   367	    id: r.id as string,
   368	    specFolder: r.spec_folder as string,
   369	    loopType: r.loop_type as string,
   370	    sessionId: r.session_id as string,
   371	    kind: r.kind as string,
   372	    name: r.name as string,
   373	    contentHash: r.content_hash as string | undefined,
   374	    iteration: r.iteration as number | undefined,
   375	    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
   376	    createdAt: r.created_at as string | undefined,
   377	    updatedAt: r.updated_at as string | undefined,
   378	  })) as CoverageNode[];
   379	}
   380	
   381	// ───────────────────────────────────────────────────────────────
   382	// 6. HOT NODES
   383	// ───────────────────────────────────────────────────────────────
   384	
   385	/**
   386	 * Rank nodes by edge count + weight sum.
   387	 * Hot nodes are those with the most connections and highest total edge weight.
   388	 */
   389	export function rankHotNodes(ns: Namespace, limit: number = 10): HotNode[] {
   390	  const d = getDb();
   391	  const { specFolder, loopType, sessionId } = ns;
   392	  const edgeFilter = buildSessionFilter('e.session_id', sessionId);
   393	  const nodeFilter = buildSessionFilter('n.session_id', sessionId);
   394	
   395	  const rows = d.prepare(`
   396	    WITH node_edges AS (
   397	      SELECT n.id, n.kind, n.name,
   398	        (
   399	          SELECT COUNT(*) FROM coverage_edges e
   400	          WHERE (e.source_id = n.id OR e.target_id = n.id)
   401	            AND e.spec_folder = ? AND e.loop_type = ?
   402	            ${edgeFilter.clause}
   403	        ) AS edge_count,
   404	        (
   405	          SELECT COALESCE(SUM(e.weight), 0) FROM coverage_edges e
   406	          WHERE (e.source_id = n.id OR e.target_id = n.id)
   407	            AND e.spec_folder = ? AND e.loop_type = ?
   408	            ${edgeFilter.clause}
   409	        ) AS weight_sum
   410	      FROM coverage_nodes n
   411	      WHERE n.spec_folder = ? AND n.loop_type = ?
   412	        ${nodeFilter.clause}
   413	    )
   414	    SELECT id, kind, name, edge_count, weight_sum,
   415	      (edge_count * 1.0 + weight_sum * 0.5) AS score
   416	    FROM node_edges
   417	    WHERE edge_count > 0
   418	    ORDER BY score DESC
   419	    LIMIT ?
   420	  `).all(
   421	    specFolder,
   422	    loopType,
   423	    ...edgeFilter.params,
   424	    specFolder,
   425	    loopType,
   426	    ...edgeFilter.params,
   427	    specFolder,
   428	    loopType,
   429	    ...nodeFilter.params,
   430	    limit,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-convergence.ts 2>/dev/null | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
codex
**Findings**

`F-014-001`  
Severity: `P1`  
Dimension: `security`  
File: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`  
Line: `378-447, 482-487`  
Title: `Session-scoped convergence can still be influenced by another session's graph rows`  
Description: `SCHEMA_VERSION = 2` correctly makes row identity `(spec_folder, loop_type, session_id, id)`, but the review-signal SQL still evaluates coverage and resolution using bare node IDs. In `computeReviewSignals(ns)`, the outer node scans are scoped to `spec_folder` and `loop_type`, but the nested edge lookups for `COVERS`, `CONTRADICTS`, and `RESOLVES` do not constrain `e.spec_folder`, `e.loop_type`, or `e.session_id`. In `computeHotspotSaturation`, the join back to `coverage_nodes` is also `ON n.id = e.source_id` only. After the v2 migration, two sessions are allowed to reuse the same logical IDs, so a second session can accidentally or intentionally satisfy another session's convergence checks and suppress blockers. That is a real cross-session integrity leak on the stop-gating path.`  
Evidence: `SELECT 1 FROM coverage_edges e WHERE e.source_id = n.id AND e.relation = 'COVERS'` at lines `390-392`; `SELECT COUNT(*) as c FROM coverage_edges WHERE target_id = ? AND relation = 'RESOLVES'` at lines `428-430`; `JOIN coverage_nodes n ON n.id = e.source_id` at lines `482-487`.  
Recommendation: `Thread the full namespace through every nested edge lookup and join. Each subquery should bind `e.spec_folder = ? AND e.loop_type = ?` and, when session-scoped, `e.session_id = ?`; every node-edge join should match all composite-key columns, not just `id`.`

`F-014-002`  
Severity: `P1`  
Dimension: `security`  
File: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts`  
Line: `89-100, 123-134, 171-178, 347-357`  
Title: `Coverage-graph query helpers do not consistently honor the composite namespace`  
Description: `The query layer still has the same post-migration flaw: it scopes the outer row set, then uses bare-ID subqueries or joins internally. `findCoverageGaps()` checks for matching edges by `source_id`/`target_id` without constraining `spec_folder` or `loop_type`; `findContradictions()` joins `coverage_nodes` on `s.id = e.source_id` and `t.id = e.target_id` only; `findUnverifiedClaims()` checks `RESOLVES` edges by `target_id = n.id` with no spec/loop binding. With v2, identical logical IDs across sessions are expected, so these helpers can leak names, duplicate contradiction rows, or incorrectly mark another session's node as covered or resolved.`  
Evidence: `JOIN coverage_nodes s ON s.id = e.source_id` / `JOIN coverage_nodes t ON t.id = e.target_id` at lines `174-176`; `WHERE e.source_id = n.id` in the coverage-gap subquery at lines `97-100`; `WHERE e.target_id = n.id ... AND e.relation = 'RESOLVES'` at lines `353-357`.  
Recommendation: `Treat the composite key as the only valid identity everywhere in the query layer. Add composite join predicates for node-edge joins and include `spec_folder`, `loop_type`, and `session_id` filters in every EXISTS/NOT EXISTS subquery.`

`F-014-003`  
Severity: `P2`  
Dimension: `security`  
File: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`  
Line: `165-197, 259-320`  
Title: `The shared-ID regression suite does not cover the higher-level read paths that still leak`  
Description: `The new collision tests prove that low-level DB writes and direct getters now respect `(spec_folder, loop_type, session_id, id)`, but they stop there. The only convergence test in this file uses disjoint IDs (`q-a`, `q-b`, etc.), so it would not expose the bare-ID subqueries and joins still present in `coverage-graph-signals.ts` and `coverage-graph-query.ts`. The shared-ID section then exercises only `upsertNode`, `upsertEdge`, `getNode`, `getNodes`, `getEdge`, and `getEdgesFrom`. As written, this suite can pass while session-scoped convergence/query handlers still bleed across sessions.`  
Evidence: Disjoint convergence fixtures at lines `165-197`; shared-ID checks limited to low-level helpers at lines `259-320`.  
Recommendation: `Extend this suite with colliding-ID fixtures that call `handleCoverageGraphConvergence()` and the query helpers/handler (`coverage_gaps`, `contradictions`, `unverified_claims`) under `sessionId = session-x` and `sessionId = session-y`, and assert both outputs stay disjoint.`

No standalone exploit surfaced in the drop-and-recreate migration block itself during this pass; the schema and low-level upsert/get paths appear to implement the composite key correctly. The remaining risk is that the read/query layer still behaves as if `id` were globally unique.

**Iteration Summary**  
Total findings: `3`  
Breakdown: `0 P0 / 2 P1 / 1 P2`

**Coverage Assessment**  
Reviewed: `~92%` of the requested focus area. I read the v2 schema/migration block, low-level DB operations, convergence/query handlers, the review-signal/query helpers they call, the dedicated session-isolation regression suite, and the phase-008 packet context that documented the prior collision finding.

**Confidence**  
`high`

**Next Priorities**  
1. Audit the remaining coverage-graph read surfaces for the same composite-key omission pattern, especially any helper that joins nodes and edges by bare `id`.  
2. Add a true legacy-upgrade regression that opens a pre-v2 coverage-graph DB file and proves `initDb()` migrates it safely to v2 under real on-disk conditions.  
3. Re-run a focused security pass on all handlers that intentionally allow `sessionId` omission, because `all_sessions_default` is still an explicit cross-session read mode.
hook: Stop
hook: Stop Completed
tokens used
140,668
**Findings**

`F-014-001`  
Severity: `P1`  
Dimension: `security`  
File: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`  
Line: `378-447, 482-487`  
Title: `Session-scoped convergence can still be influenced by another session's graph rows`  
Description: `SCHEMA_VERSION = 2` correctly makes row identity `(spec_folder, loop_type, session_id, id)`, but the review-signal SQL still evaluates coverage and resolution using bare node IDs. In `computeReviewSignals(ns)`, the outer node scans are scoped to `spec_folder` and `loop_type`, but the nested edge lookups for `COVERS`, `CONTRADICTS`, and `RESOLVES` do not constrain `e.spec_folder`, `e.loop_type`, or `e.session_id`. In `computeHotspotSaturation`, the join back to `coverage_nodes` is also `ON n.id = e.source_id` only. After the v2 migration, two sessions are allowed to reuse the same logical IDs, so a second session can accidentally or intentionally satisfy another session's convergence checks and suppress blockers. That is a real cross-session integrity leak on the stop-gating path.`  
Evidence: `SELECT 1 FROM coverage_edges e WHERE e.source_id = n.id AND e.relation = 'COVERS'` at lines `390-392`; `SELECT COUNT(*) as c FROM coverage_edges WHERE target_id = ? AND relation = 'RESOLVES'` at lines `428-430`; `JOIN coverage_nodes n ON n.id = e.source_id` at lines `482-487`.  
Recommendation: `Thread the full namespace through every nested edge lookup and join. Each subquery should bind `e.spec_folder = ? AND e.loop_type = ?` and, when session-scoped, `e.session_id = ?`; every node-edge join should match all composite-key columns, not just `id`.`

`F-014-002`  
Severity: `P1`  
Dimension: `security`  
File: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts`  
Line: `89-100, 123-134, 171-178, 347-357`  
Title: `Coverage-graph query helpers do not consistently honor the composite namespace`  
Description: `The query layer still has the same post-migration flaw: it scopes the outer row set, then uses bare-ID subqueries or joins internally. `findCoverageGaps()` checks for matching edges by `source_id`/`target_id` without constraining `spec_folder` or `loop_type`; `findContradictions()` joins `coverage_nodes` on `s.id = e.source_id` and `t.id = e.target_id` only; `findUnverifiedClaims()` checks `RESOLVES` edges by `target_id = n.id` with no spec/loop binding. With v2, identical logical IDs across sessions are expected, so these helpers can leak names, duplicate contradiction rows, or incorrectly mark another session's node as covered or resolved.`  
Evidence: `JOIN coverage_nodes s ON s.id = e.source_id` / `JOIN coverage_nodes t ON t.id = e.target_id` at lines `174-176`; `WHERE e.source_id = n.id` in the coverage-gap subquery at lines `97-100`; `WHERE e.target_id = n.id ... AND e.relation = 'RESOLVES'` at lines `353-357`.  
Recommendation: `Treat the composite key as the only valid identity everywhere in the query layer. Add composite join predicates for node-edge joins and include `spec_folder`, `loop_type`, and `session_id` filters in every EXISTS/NOT EXISTS subquery.`

`F-014-003`  
Severity: `P2`  
Dimension: `security`  
File: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`  
Line: `165-197, 259-320`  
Title: `The shared-ID regression suite does not cover the higher-level read paths that still leak`  
Description: `The new collision tests prove that low-level DB writes and direct getters now respect `(spec_folder, loop_type, session_id, id)`, but they stop there. The only convergence test in this file uses disjoint IDs (`q-a`, `q-b`, etc.), so it would not expose the bare-ID subqueries and joins still present in `coverage-graph-signals.ts` and `coverage-graph-query.ts`. The shared-ID section then exercises only `upsertNode`, `upsertEdge`, `getNode`, `getNodes`, `getEdge`, and `getEdgesFrom`. As written, this suite can pass while session-scoped convergence/query handlers still bleed across sessions.`  
Evidence: Disjoint convergence fixtures at lines `165-197`; shared-ID checks limited to low-level helpers at lines `259-320`.  
Recommendation: `Extend this suite with colliding-ID fixtures that call `handleCoverageGraphConvergence()` and the query helpers/handler (`coverage_gaps`, `contradictions`, `unverified_claims`) under `sessionId = session-x` and `sessionId = session-y`, and assert both outputs stay disjoint.`

No standalone exploit surfaced in the drop-and-recreate migration block itself during this pass; the schema and low-level upsert/get paths appear to implement the composite key correctly. The remaining risk is that the read/query layer still behaves as if `id` were globally unique.

**Iteration Summary**  
Total findings: `3`  
Breakdown: `0 P0 / 2 P1 / 1 P2`

**Coverage Assessment**  
Reviewed: `~92%` of the requested focus area. I read the v2 schema/migration block, low-level DB operations, convergence/query handlers, the review-signal/query helpers they call, the dedicated session-isolation regression suite, and the phase-008 packet context that documented the prior collision finding.

**Confidence**  
`high`

**Next Priorities**  
1. Audit the remaining coverage-graph read surfaces for the same composite-key omission pattern, especially any helper that joins nodes and edges by bare `id`.  
2. Add a true legacy-upgrade regression that opens a pre-v2 coverage-graph DB file and proves `initDb()` migrates it safely to v2 under real on-disk conditions.  
3. Re-run a focused security pass on all handlers that intentionally allow `sessionId` omission, because `all_sessions_default` is still an explicit cross-session read mode.
