---
iteration: 6
dimension: security
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:57:20Z
completedAt: 2026-04-12T10:02:04Z
---

# Deep Review Iteration 006 — security

**Focus:** Phase 004 offline-optimizer: replay corpus extraction, config search bounds, audit trail integrity in .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs and replay-runner.cjs. Check for path traversal in corpus loading, bounds validation in config search, and advisory-only promotion gate enforcement.

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
session id: 019d811f-da28-7f51-b688-c116de7f2c95
--------
user
You are a senior code reviewer executing iteration 6 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: security
FOCUS: Phase 004 offline-optimizer: replay corpus extraction, config search bounds, audit trail integrity in .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs and replay-runner.cjs. Check for path traversal in corpus loading, bounds validation in config search, and advisory-only promotion gate enforcement.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for security issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-006-NNN (sequential within this iteration)
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
Reviewing the Phase 004 offline-optimizer security surface now. I’m starting by loading the relevant review/memory guidance, locating any deeper `AGENTS.md` files, and reading the target optimizer files before I assess findings.
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|offline-optimizer|replay-corpus|replay-runner|REQ-026|REQ-034|rvw-2026-04-11T13-50-06Z" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g 'MEMORY.md' . /Users/michelkerkmeester/.codex/memories | sed 's#"'^./##'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "security deep review of spec folder 042-sk-deep-research-review-improvement-2 focusing on replay-corpus.cjs and replay-runner.cjs path traversal, bounds validation, and promotion gate enforcement" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 187ms:
AGENTS.md
/Users/michelkerkmeester/.codex/memories/MEMORY.md
.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/app/e2e/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/app/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/desktop-electron/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/desktop/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/opencode/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external/packages/opencode/test/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
.opencode/specs/system-spec-kit/000-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
.opencode/specs/system-spec-kit/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-github/AGENTS.md

 succeeded in 704ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-bUDK1zRF' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.84,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-research(explicit), deep(name), loop, research(name)"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), review(name), security"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !folder, !spec, document~, folder, score~"
  },
  {
    "skill": "sk-improve-agent",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !promotion gate(phrase), candidate~, improvement, promotion"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.94,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), loop, review(name)"
  }
]

codex
I’ve confirmed the relevant review skills and there don’t appear to be deeper `AGENTS.md` files under the optimizer paths. Next I’m loading the review/spec guidance plus the Phase 004 files and nearby references so I can trace the trust boundaries precisely.
Security review iteration focused on Phase 004 offline optimizer artifacts and referenced implementation.
  → Load relevant memory/skill/spec context for Phase 004 offline optimizer
  • Read replay corpus and runner implementation plus referenced helpers/config surfaces
  • Assess path traversal, bounds validation, and promotion gate enforcement
  • Summarize findings with exact file/line evidence and coverage notes
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.2.0.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md) plus optional memory/ and scratch/ subdirectories

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze, phase

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.
Status: ✅ This requirement applies immediately once file edits are requested.

### Agent Exclusivity

**⛔ CRITICAL:** `@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files).

- **Requires @speckit:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other *.md in spec folders
- **Exceptions:**
  - canonical continuity saves → use `generate-context.js`
  - `scratch/` → temporary workspace, any agent
  - `handover.md` → @handover agent only
  - `research/research.md` → @deep-research agent only
  - `debug-delegation.md` → @debug agent only

Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |

**Rule:** When detected, proactively suggest the appropriate action.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template composition, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/config/` for runtime environment configuration.

### Template and Script Sources of Truth

- Level definitions and template size guidance: [level_specifications.md](./references/templates/level_specifications.md)
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use `templates/level_N/` for operational templates; `core/` and `addendum/` remain composition inputs.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `templates/compose.sh`

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/templates/level_specifications.md",
        "references/templates/template_guide.md",
        "references/validation/template_compliance_contract.md",
    ],
    "RESEARCH": [
        "references/workflows/quick_reference.md",
        "references/workflows/worked_examples.md",
        "references/memory/epistemic_vectors.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation_rules.md",
        "references/validation/template_compliance_contract.md",
        "references/templates/template_guide.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/workflows/quick_reference.md",
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
    ],
    "COMPLETE": [
        "references/validation/validation_rules.md",
        "references/workflows/nested_changelog.md",
    ],
    "MEMORY": [
        "references/memory/memory_system.md",
        "references/memory/save_workflow.md",
        "references/memory/trigger_config.md",
    ],
    "HANDOVER": [
        "references/workflows/quick_reference.md",
    ],
    "PHASE": [
        "references/structure/phase_definitions.md",
        "references/structure/sub_folder_versioning.md",
        "references/validation/phase_checklists.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedding_resilience.md",
        "references/memory/trigger_config.md",
    ],
    "EVALUATION": [
        "references/memory/epistemic_vectors.md",
        "references/config/environment_variables.md",
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
    ],
    "SCORING_CALIBRATION": [
        "references/config/environment_variables.md",
    ],
    "ROLLOUT_FLAGS": [
        "references/config/environment_variables.md",
        "feature_catalog/19--feature-flag-reference/",
    ],
    "GOVERNANCE": [
        "references/config/environment_variables.md",
    ],
}

COMMAND_BOOSTS = {
    "/spec_kit:plan": "PLAN",
    "/spec_kit:implement": "IMPLEMENT",
    "/spec_kit:debug": "DEBUG",
    "/spec_kit:complete": "COMPLETE",
    "/spec_kit:handover": "HANDOVER",
    "/spec_kit:plan :with-phases": "PHASE",
    "/memory:search": "MEMORY",
    "/memory:save": "MEMORY",
    "/memory:manage": "MEMORY",
    "/memory:learn": "MEMORY",
    "/spec_kit:resume": "MEMORY",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["deep dive", "full validation", "full checklist", "full template"],
    "ON_DEMAND": [
        "references/validation/phase_checklists.md",
        "references/templates/template_guide.md",
    ],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    """Allow markdown loads only within this skill folder."""
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    """Recursively discover routable markdown docs for this skill only."""
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/042-sk-deep-research-review-improvement-2/spec.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/042-sk-deep-research-review-improvement-2/spec.md: No such file or directory

codex
The spec path I tried first was wrong, so I’m resolving the actual packet location before I trace the Phase 004 implementation references. After that I’ll read the optimizer files and the spec docs that point into them so the review stays anchored to intended behavior.
exec
/bin/zsh -lc "rg --files | rg '042-sk-deep-research-review-improvement-2|replay-corpus\\.cjs|replay-runner\\.cjs|offline-optimizer|phase-004|Phase 004'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 202ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-008.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-018.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-019.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/research.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-config.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/findings-registry.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs

codex
I’ve resolved the packet under `.opencode/specs/skilled-agent-orchestration/.../004-offline-loop-optimizer`. I’m reading the phase docs and the optimizer implementation together so I can compare the intended security constraints with the actual trust boundaries in corpus loading and replay execution.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Feature Specification: Offline Loop Optimizer [042.004]"
description: "Define an offline replay optimizer that tunes deterministic deep-loop configs against real packet traces now, while deferring prompt and meta-optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
trigger_phrases:
  - "042.004"
  - "offline loop optimizer"
  - "replay corpus"
  - "optimizer manifest"
  - "advisory promotion gate"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 004 is now explicitly split into two sub-phases. Phase 4a is the realistic near-term deliverable: build an offline compile/evaluate loop that replays real packet traces, tunes deterministic numeric config thresholds, and emits advisory patch recommendations with a full audit trail. Phase 4b is deferred future work for prompt-pack and meta-optimization once replay fixtures, behavioral suites, and multi-family corpus coverage actually exist.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Parent Packet** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 4 of 8 (`4a` active now, `4b` deferred) |
| **Predecessor** | `003-wave-executor` |
| **Successor** | `../005-agent-improver-deep-loop-alignment/spec.md` |
| **Handoff Criteria** | Phase 4a outputs are replay-verified, audit-trailed, and emitted as advisory-only candidate patches until Phase 1 replay fixtures and Phase 3 behavioral suites exist. |

<!-- ANCHOR:phase-context -->
**Phase Context**: This phase closes the moonshot chain by turning prior run traces into an offline improvement engine, but the research findings show the safe near-term scope is narrower than originally drafted. Phases 001 through 003 make deep-loop behavior explicit, graph-aware, and segment-capable; Phase 4a should use those artifacts to tune deterministic thresholds and recovery settings without experimenting live in production, while Phase 4b stays deferred until the replay and behavioral foundations are real.

**Dependencies**:
- Phase 001 runtime contracts and stable stop or recovery semantics.
- Phase 002 graph metrics as optimization signals.
- Phase 003 richer wave-run traces and segment-aware artifacts.
- Phase 001 replay fixtures must exist before any production-grade replay or promotion claim is credible.
- Phase 003 behavioral suites must exist before any non-advisory promotion is allowed.

**Deliverables**:
- **Phase 4a**: replay corpus builder with `040` required, `028` optional as an older holdout, and `042` excluded until it has implementation traces.
- **Phase 4a**: rubric and scoring framework for run quality, deterministic replay runner, random-search baseline, optimizer manifest, and audit-trailed advisory candidate reports.
- **Phase 4b (deferred)**: prompt-pack optimization, task-shape-aware meta-learning, and gated production promotion after prerequisite suites and corpus diversity exist.
<!-- /ANCHOR:phase-context -->
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop products now have richer runtime state, but tuning them is still largely manual: convergence thresholds, stuck detection, recovery escalation, and related numeric controls are adjusted by human judgment and one-off testing. That is expensive, hard to compare rigorously, and vulnerable to regressions because the system has no offline compile/evaluate loop that can replay historical traces, score outcomes, and prove that a new deterministic configuration is actually better before it is even considered for production.

### Purpose

Define an offline replay optimizer that learns from real packet traces, scores run quality against a shared rubric, searches bounded deterministic config space, and emits advisory candidate patches only. Production promotion remains out of scope until Phase 1 replay fixtures and Phase 3 behavioral suites exist, and prompt or meta-optimization remains deferred future work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build a replay corpus with packet family `040` as the required source, packet family `028` as an optional structurally older holdout, and packet family `042` excluded until it has real implementation traces.
- Define a rubric for finding accuracy, convergence efficiency, recovery success rate, and synthesis quality.
- Add configuration-search logic for deterministic numeric settings such as convergence thresholds, stuck detection, and recovery escalation.
- Add a deterministic replay runner for reducer and convergence logic under alternate configs.
- Add a canonical optimizer manifest that declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
- Add an advisory-only promotion gate that never mutates production config directly while prerequisite fixtures and suites are still missing.
- Record a full audit trail for every optimization attempt, including rejected candidates and patch-style recommendations.

### Out of Scope

- Online reinforcement or live-production auto-tuning.
- Replacing human review of candidate configs.
- Inventing new runtime artifacts outside the traces already produced by Phases 001 through 003.
- Broad model selection or vendor-routing work unrelated to deep-loop runtime tuning.
- Direct mutation of canonical agent `.md` files during optimization. Agent markdown remains behavior documentation, not an optimizer template surface.
- Full prompt optimization, cross-packet meta-learning, and automatic production promotion in the current phase scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs` | Create | Score runs across accuracy, convergence efficiency, recovery success, and synthesis quality. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs` | Create | Search bounded deterministic numeric config candidates. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and emit advisory-only candidate patches. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Create | Canonical manifest of tunable fields, locked contract fields, and future prompt-pack entrypoints. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts` | Create | Verify scoring rules and metric weighting behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` | Create | Verify search-space handling and candidate bookkeeping. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify advisory promotion gating, rollback behavior, and audit output. |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures, optimization-result snapshots, and advisory patch artifacts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 4a MUST build a replay corpus with packet family `040` as the required source corpus. | Corpus inputs are tied to real `040` packet artifacts, normalized into a deterministic replay format, and traceable back to their source runs and metadata. |
| REQ-002 | Packet family `028` MAY be ingested as an optional holdout corpus, but only with compatibility grading because it is older and structurally different; packet family `042` MUST NOT be treated as corpus input until it has real implementation traces. | Corpus ingestion records source-family compatibility, marks `028` as optional holdout only, and rejects `042` as a training corpus until live traces exist. |
| REQ-003 | The optimizer MUST define a rubric that scores run quality across finding accuracy, convergence efficiency, recovery success rate, and synthesis quality. | The rubric exposes explicit metric definitions, weighting, and score outputs; the phase does not rely on one opaque "goodness" number. |
| REQ-004 | Phase 4a MUST provide a deterministic replay runner that can evaluate alternate configs without running live agent iterations. | Replay consumes stored traces and config candidates, produces repeatable outputs, and isolates replay from live network or human-in-the-loop variability. |
| REQ-005 | The phase MUST define a canonical optimizer manifest that separates tunable fields, locked contract fields, and prompt-pack entrypoints. | A single manifest names each optimizer-managed field family, each locked lifecycle or schema contract field, and each future prompt-pack insertion point. |
| REQ-006 | No production promotion is allowed until the replay fixtures planned in Phase 1 and the behavioral suites planned in Phase 3 actually exist. | Until both prerequisite surfaces exist, all optimizer outputs are advisory-only candidate patches or reports and must not directly mutate canonical production configs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Phase 4a search MUST stay within deterministic numeric config families such as convergence thresholds, stuck sensitivity, and recovery escalation. | Search configuration covers the allowed deterministic tunable dimensions, excludes locked contract fields, and records which candidates touched which parameter families. |
| REQ-008 | Every optimization run MUST emit an audit trail that records what was tried, what improved, what regressed, and why a candidate was accepted or rejected. | Audit output exists for every run, including failed searches and rejected advisory promotions, and captures both candidate settings and evaluation outcomes. |
| REQ-009 | Optimizer scoring MUST incorporate graph and wave metrics when those traces are available, without inventing fake values for older runs. | The corpus and rubric can consume Phase 002 or Phase 003 signals when present, and explicitly mark them unavailable for older traces instead of fabricating them. |
| REQ-010 | If prompt optimization remains in scope for deferred Phase 4b, it MUST operate on generated prompt packs or patch artifacts rather than directly mutating agent `.md` files. | Prompt candidates are expressed as generated pack outputs or patch artifacts that can be replayed, diffed, tested, and rolled back independently of canonical agent markdown. |
| REQ-011 | If cross-packet meta-learning remains in future scope, it MUST introduce a task-shape metadata model before learning across packets is allowed. | No meta-learning work proceeds without explicit metadata for task shape, scope, and domain clustering plus at least two compatible packet families. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The optimizer corpus is built from real packet traces, with `040` as the required source family.
- **SC-002**: Rubric scores are broken down by quality dimension, not hidden behind one opaque number.
- **SC-003**: Replay is deterministic enough to compare baseline and candidate configs reliably.
- **SC-004**: Search scope is bounded to deterministic numeric config families for Phase 4a.
- **SC-005**: Promotion remains advisory-only until replay fixtures and behavioral suites exist.
- **SC-006**: Every optimization run produces a reviewable audit trail.
- **SC-007**: The optimizer manifest keeps tunable and locked fields explicit and rollback-friendly.
- **SC-008**: Any future prompt optimization route is expressed as prompt packs or patch artifacts rather than direct agent-markdown mutation.

### Acceptance Scenarios

1. **Given** packet family `040`, **when** the corpus builder runs, **then** it emits deterministic replay inputs tied back to its source runs and metadata.
2. **Given** packet family `028`, **when** the corpus builder attempts ingestion, **then** it records compatibility grading and treats `028` as an optional holdout instead of a required training corpus.
3. **Given** packet family `042`, **when** corpus intake is evaluated, **then** the optimizer refuses to treat it as replay corpus until implementation traces exist.
4. **Given** a candidate config improves convergence efficiency but harms accuracy, **when** rubric scoring runs, **then** the breakdown shows the trade-off explicitly instead of hiding it.
5. **Given** the same baseline trace and candidate config, **when** replay runs twice, **then** the resulting score and decision outputs remain stable.
6. **Given** a candidate outperforms baseline in replay but the Phase 1 replay fixtures or Phase 3 behavioral suites do not yet exist, **when** promotion runs, **then** the optimizer emits only an advisory patch or report and refuses production promotion.
7. **Given** an older packet trace lacks graph or wave metrics, **when** scoring runs, **then** the audit trail marks those dimensions unavailable rather than inventing placeholder values.
8. **Given** a candidate touches a non-tunable contract field, **when** promotion eligibility is checked, **then** the optimizer rejects the candidate as out of bounds.
9. **Given** a future prompt candidate, **when** optimization is attempted, **then** the system works through a generated prompt pack or patch artifact rather than mutating agent `.md` files directly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001-003 traces must be stable and sufficiently rich | High | Limit corpus intake to runs with trustworthy runtime artifacts and record gaps explicitly. |
| Dependency | Phase 001 replay fixtures must exist before promotion can graduate beyond advisory reports | High | Treat missing replay fixtures as a hard promotion block and keep outputs patch-only. |
| Dependency | Phase 003 behavioral suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
| Risk | Replay fidelity is too low to support fair candidate comparisons | High | Keep replay deterministic, tie it to stored traces, and reject promotion when fidelity is insufficient. |
| Risk | Optimization without behavioral tests could promote broken configs | High | Keep promotion advisory-only until the behavioral suite exists and passes. |
| Risk | Search space grows too broad and hides why a candidate improved | Medium | Start with bounded numeric parameter families and require audit logs for every search step. |
| Risk | Optimizer starts changing fields that should remain human-governed | Medium | Mark optimizer-managed fields explicitly in runtime configs and docs. |
| Risk | Single-family corpus limits generalization | High | Treat `040` as a pilot corpus, treat `028` as optional holdout only, and defer meta-learning until 2+ compatible families exist. |
| Risk | Optional holdout `028` is structurally incompatible with modern replay assumptions | Medium | Compatibility-grade it explicitly and never require it for Phase 4a success. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Offline search and replay should remain bounded enough to run in routine maintenance windows without monopolizing the developer environment.
- Corpus loading should scale with additional packet families by incremental or chunked processing rather than full rebuilds only.

### Reliability

- Replay comparisons must be deterministic for the same trace and candidate input.
- Promotion must fail closed when replay fidelity, rubric coverage, or downstream tests are insufficient.
- Advisory-only promotion must be the default behavior until the prerequisite replay fixtures and behavioral suites exist.

### Maintainability

- Optimizer-managed config fields should be documented once in the canonical optimizer manifest plus the deep-loop config files and references.
- Audit records should explain decisions in plain terms so future maintainers can understand why a candidate was accepted or rejected.
- Canonical agent markdown must remain behavior documentation; optimizer experimentation belongs in generated prompt packs or patch artifacts.

---

## 8. EDGE CASES

- A candidate improves convergence efficiency but harms finding accuracy. Promotion must reject that trade-off unless the rubric explicitly preserves overall quality.
- Historical runs are missing graph or wave artifacts because older phases were not yet implemented. Corpus ingestion must mark those gaps instead of fabricating signals.
- Two candidate configs tie on rubric score but differ in risk. The promotion gate must keep the safer or more explainable candidate, or refuse promotion.
- Replay reveals that optional holdout `028` behaves differently from required corpus `040`. Audit output must preserve that split rather than averaging it away.
- A candidate modifies an optimizer-managed threshold and a non-tunable contract field together. Promotion must reject the candidate as out of bounds.
- A candidate improves replay score before behavioral suites exist. The optimizer must emit only an advisory report or patch artifact and refuse production promotion.
- A prompt experiment tries to write directly into an agent markdown file. The optimizer must reject it and require a generated prompt pack or patch artifact instead.

---

## 9. COMPLEXITY ASSESSMENT

| Axis | Assessment |
|------|------------|
| **Corpus Engineering** | Medium-High: `040` is viable now, `028` is a compatibility holdout, and `042` has no traces yet. |
| **Evaluation Design** | High: quality metrics must be specific enough to trust but broad enough to compare different run shapes. |
| **Replay Fidelity** | High: deterministic replay is the whole safety story for Phase 4a. |
| **Governance** | High: advisory-only promotion, manifest boundaries, and rollback semantics must stay explicit. |
| **Deferred Scope** | Very High: prompt optimization and meta-learning are materially premature until behavioral suites and broader corpus coverage exist. |
| **Overall** | High but stageable: Phase 4a is realistic now; Phase 4b should remain explicitly deferred. |

---

## 10. RISK MATRIX

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Implementation Summary: Offline Loop Optimizer [042.004]"
description: "Phase 4a: offline replay optimizer with deterministic config tuning, advisory promotion gate, and full audit trail. Phase 4b prompt/meta optimization remains deferred."
trigger_phrases:
  - "042.004"
  - "implementation summary"
  - "offline loop optimizer"
  - "replay corpus"
  - "advisory promotion"
importance_tier: "important"
contextType: "planning"
---
# Implementation Summary: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-offline-loop-optimizer |
| **Completed** | 2026-04-10 (Phase 4a); Phase 4b deferred |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep-loop configs can now be tuned offline against real packet traces without experimenting live in production. Phase 4a delivers a complete compile/evaluate loop: harvest traces, score them with a rubric, search bounded deterministic config space, replay candidates, and emit advisory candidate patches with a full audit trail.

### Replay Corpus

The `040` replay corpus extractor harvests real traces from packet family `040` as the required corpus. Packet family `028` is supported as an optional compatibility-graded holdout. Packet family `042` is explicitly excluded until implementation traces exist. The corpus includes structured JSONL artifacts with iteration metadata, convergence signals, and stop decisions.

### Quality Rubric

A multi-dimensional rubric scores convergence efficiency, recovery success rate, finding accuracy, and synthesis quality. Each dimension produces a normalized score that feeds into the search and promotion stages.

### Deterministic Replay Runner

The replay runner executes baseline and candidate configs against the same corpus traces deterministically. Replay results are comparable across runs because the runner controls all non-deterministic inputs.

### Random-Search Config Optimizer

The search module generates candidate configs by perturbing bounded deterministic numeric fields within the optimizer-managed config surface. Only fields declared tunable in the optimizer manifest are eligible for mutation. Locked contract fields and future prompt-pack entrypoints are explicitly excluded.

### Audit Trail

Every optimization run produces durable audit output covering both accepted and rejected candidates. Advisory patch artifacts include the candidate config diff, rubric scores, replay comparison, and a human-readable recommendation. Rejected candidates are preserved with the same audit detail.

### Advisory-Only Promotion Gate

The promotion gate refuses production mutation until replay fixtures and behavioral suites exist. All current outputs are advisory-only candidate patches that require human review before any canonical config is changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded through 3 sub-phases: corpus/rubric/replay foundation, search/audit/manifest, and advisory promotion gate. 20 files were touched (14 new), adding approximately 3,800 lines. 91 tests cover corpus extraction, rubric scoring, replay determinism, search boundaries, audit persistence, and promotion gate behavior.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deterministic `4a` now, `4b` deferred | Safe near-term scope is narrower than originally drafted; prompt/meta optimization needs replay fixtures and behavioral suites first |
| Advisory-only promotion until prerequisites exist | Prevents unsafe live mutation from an optimizer that lacks production-grade replay validation |
| Optimizer manifest separates tunable vs locked fields | Config governance prevents optimizer from mutating runtime contracts or non-numeric surfaces |
| `040` as required corpus, `028` as optional holdout | `040` has real implementation traces; `028` has older compatibility-graded data |
| Prompt work via packs/patches, not direct agent markdown edits | Keeps prompt changes replayable, rollback-safe, and auditable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Replay corpus extraction from `040` traces | PASS (91 tests) |
| Quality rubric multi-dimensional scoring | PASS |
| Deterministic replay produces comparable results | PASS |
| Search stays within optimizer-managed config boundaries | PASS |
| Audit trail preserves accepted and rejected candidates | PASS |
| Advisory-only promotion gate refuses production mutation | PASS |
| Phase 4b tasks remain blocked with explicit prerequisites | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 4b is deferred.** Prompt-pack generation, cross-packet meta-learning, and automatic promotion remain blocked until behavioral test suites and 2+ compatible corpus families exist.
2. **Advisory-only outputs require human review.** No candidate config change is applied to production without manual approval.
3. **Corpus is limited to `040` family.** Broader corpus coverage from additional packet families will improve optimizer confidence.
<!-- /ANCHOR:limitations -->

 succeeded in 0ms:
'use strict';

// ---------------------------------------------------------------
// MODULE: Replay Corpus Builder (T001)
// ---------------------------------------------------------------
// Extracts replay corpus from packet JSONL data for offline
// loop optimization. Packet family 040 is REQUIRED. 028 is an
// optional holdout. 042 is excluded until traces exist.
// ---------------------------------------------------------------

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Supported packet families and their corpus roles.
 * @type {Readonly<Record<string, { role: string; required: boolean; compatibilityGrade: string }>>}
 */
const PACKET_FAMILIES = Object.freeze({
  '040': { role: 'primary', required: true, compatibilityGrade: 'full' },
  '028': { role: 'holdout', required: false, compatibilityGrade: 'legacy' },
  '042': { role: 'excluded', required: false, compatibilityGrade: 'none' },
});

/**
 * Required fields for a valid corpus entry.
 * @type {ReadonlyArray<string>}
 */
const REQUIRED_ENTRY_FIELDS = Object.freeze([
  'id',
  'packetFamily',
  'sourceRun',
  'config',
  'iterations',
  'stopOutcome',
]);

/**
 * JSONL record types that carry iteration data.
 * @type {ReadonlySet<string>}
 */
const ITERATION_TYPES = new Set(['iteration']);

/**
 * JSONL record types that carry stop/event data.
 * @type {ReadonlySet<string>}
 */
const EVENT_TYPES = new Set(['event']);

/* ---------------------------------------------------------------
   2. CORPUS ENTRY SCHEMA
----------------------------------------------------------------*/

/**
 * Validate a single corpus entry against the expected schema.
 *
 * @param {object} entry - The corpus entry to validate.
 * @returns {{ valid: boolean; errors: string[] }}
 */
function validateCorpusEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== 'object') {
    return { valid: false, errors: ['Entry must be a non-null object'] };
  }

  for (const field of REQUIRED_ENTRY_FIELDS) {
    if (entry[field] === undefined || entry[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (entry.packetFamily && !PACKET_FAMILIES[entry.packetFamily]) {
    errors.push(`Unknown packet family: ${entry.packetFamily}`);
  }

  if (entry.packetFamily === '042') {
    errors.push('Packet family 042 is excluded until implementation traces exist');
  }

  if (entry.iterations && !Array.isArray(entry.iterations)) {
    errors.push('iterations must be an array');
  }

  if (entry.iterations && Array.isArray(entry.iterations) && entry.iterations.length === 0) {
    errors.push('iterations must not be empty');
  }

  if (entry.config && typeof entry.config !== 'object') {
    errors.push('config must be an object');
  }

  if (entry.stopOutcome && typeof entry.stopOutcome !== 'object') {
    errors.push('stopOutcome must be an object');
  }

  return { valid: errors.length === 0, errors };
}

/* ---------------------------------------------------------------
   3. JSONL PARSING
----------------------------------------------------------------*/

/**
 * Parse JSONL content into an array of records.
 * Tracks skipped/malformed lines for diagnostics.
 *
 * @param {string} content - Raw JSONL string.
 * @returns {{ records: object[]; skippedLines: Array<{ lineNumber: number; content: string; error: string }>; totalLines: number }} Parsed records with skip metadata.
 */
function parseJSONL(content) {
  const lines = content.trim().split('\n');
  const records = [];
  const skippedLines = [];
  let nonBlankCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    nonBlankCount++;
    try {
      records.push(JSON.parse(trimmed));
    } catch (err) {
      skippedLines.push({
        lineNumber: i + 1,
        content: trimmed.length > 200 ? trimmed.slice(0, 200) + '...' : trimmed,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { records, skippedLines, totalLines: nonBlankCount };
}

/* ---------------------------------------------------------------
   4. CORPUS BUILDING
----------------------------------------------------------------*/

/**
 * Extract a single corpus entry from a set of parsed JSONL records.
 *
 * @param {object[]} records - Parsed JSONL records from a single run.
 * @param {string} packetFamily - The packet family identifier (e.g., '040').
 * @param {string} sourceRunId - Identifier for the source run.
 * @param {object} [options={}] - Extraction options.
 * @param {string} [options.timestamp] - Override timestamp for deterministic replay. Defaults to current time.
 * @returns {object} A corpus entry.
 */
function extractCorpusEntry(records, packetFamily, sourceRunId, options) {
  const opts = options || {};
  const extractedAt = opts.timestamp || new Date().toISOString();
  const configRecord = records.find((r) => r.type === 'config') || {};
  const iterations = records.filter((r) => ITERATION_TYPES.has(r.type));
  const events = records.filter((r) => EVENT_TYPES.has(r.type));

  // Find the LAST terminal event (synthesis_complete, stop_decision, etc.)
  // An intermediate stop_decision before the real synthesis_complete must not
  // freeze stopOutcome — iterate all events and keep the final match.
  let stopEvent = null;
  for (const e of events) {
    if (
      e.event === 'synthesis_complete' ||
      e.event === 'stop_decision' ||
      e.event === 'stopped'
    ) {
      stopEvent = e;
    }
  }

  const familyInfo = PACKET_FAMILIES[packetFamily] || {
    role: 'unknown',
    required: false,
    compatibilityGrade: 'unknown',
  };

  const entry = {
    id: `${packetFamily}-${sourceRunId}`,
    packetFamily,
    sourceRun: sourceRunId,
    compatibilityGrade: familyInfo.compatibilityGrade,
    role: familyInfo.role,
    config: {
      maxIterations: configRecord.maxIterations || null,
      convergenceThreshold: configRecord.convergenceThreshold || null,
      stuckThreshold: configRecord.stuckThreshold || null,
      mode: configRecord.mode || null,
      topic: configRecord.topic || null,
    },
    iterations: iterations.map((iter) => ({
      run: iter.run,
      status: iter.status,
      focus: iter.focus || null,
      findingsCount: iter.findingsCount || 0,
      newInfoRatio: iter.newInfoRatio ?? iter.newFindingsRatio ?? null,
      convergenceSignals: iter.convergenceSignals || null,
      durationMs: iter.durationMs || null,
      timestamp: iter.timestamp || null,
    })),
    stopOutcome: stopEvent
      ? {
          stopReason: stopEvent.stopReason || stopEvent.decision || null,
          legalStop: stopEvent.legalStop || null,
          totalIterations: stopEvent.totalIterations || iterations.length,
          verdict: stopEvent.verdict || null,
        }
      : {
          stopReason: 'unknown',
          legalStop: null,
          totalIterations: iterations.length,
          verdict: null,
        },
    metadata: {
      extractedAt,
      sourceRecordCount: records.length,
      hasGraphMetrics: iterations.some(
        (i) => i.convergenceSignals && i.convergenceSignals.graphCoverage !== undefined,
      ),
      hasWaveMetrics: iterations.some(
        (i) => i.convergenceSignals && i.convergenceSignals.waveSegments !== undefined,
      ),
    },
  };

  return entry;
}

/**
 * Build a replay corpus from a packet family's JSONL data.
 *
 * @param {string} packetFamily - The packet family identifier ('040', '028', '042').
 * @param {object} [options={}] - Options.
 * @param {string} [options.fixturesDir] - Path to the fixtures directory.
 * @param {string} [options.jsonlContent] - Raw JSONL content (alternative to reading from disk).
 * @param {string} [options.sourceRunId] - Run identifier for the corpus entry.
 * @param {string} [options.timestamp] - Override timestamp for deterministic replay.
 * @returns {{ corpus: object[]; errors: string[]; warnings: string[]; familyInfo: object }}
 */
function buildCorpus(packetFamily, options = {}) {
  const errors = [];
  const warnings = [];
  const corpus = [];

  // Check family validity
  const familyInfo = PACKET_FAMILIES[packetFamily];
  if (!familyInfo) {
    errors.push(`Unknown packet family: ${packetFamily}`);
    return { corpus, errors, warnings, familyInfo: null };
  }

  // 042 is excluded
  if (packetFamily === '042') {
    errors.push(
      'Packet family 042 is excluded until implementation traces exist',
    );
    return { corpus, errors, warnings, familyInfo };
  }


 succeeded in 0ms:
---
title: "Decision Record: Offline Loop Optimizer [042.004]"
description: "Accepted architecture decision for the offline replay optimizer and its advisory promotion boundary."
trigger_phrases:
  - "042.004"
  - "decision record"
  - "offline loop optimizer"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship deterministic offline config optimization first and keep promotion advisory-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet 042 closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a safe way to improve deep-loop runtime configs using real traces, but the repo did not yet have the replay fixtures, behavioral suites, or multi-family corpus coverage needed for broad prompt or meta-optimization. The phase had to produce real value now without pretending the wider optimizer vision was already safe, and it had to stop the optimizer from mutating locked contract fields or applying production config changes directly.

### Constraints

- Production configs could not be mutated directly by the new optimizer.
- Prompt optimization could not edit canonical agent markdown files directly.
- Promotion had to fail closed when prerequisite replay or behavior evidence was missing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: deliver Phase 4a as a deterministic offline config optimizer now, keep Phase 4b prompt/meta optimization explicitly deferred, and bound all current promotion output to advisory-only candidate patches or reports.

**How it works**: Phase 4a focuses on corpus extraction, rubric scoring, deterministic replay, bounded numeric search, audit output, and advisory patch generation. Search can mutate only optimizer-managed numeric fields declared in the manifest, and promotion refuses direct production mutation until stronger replay and behavioral gates exist and pass.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Deterministic config optimization now with advisory-only promotion** | Delivers real value with a clear safety envelope | Leaves some ambitious optimization ideas intentionally deferred and still requires human review | 9/10 |
| Build prompt and meta optimization immediately | Bigger theoretical upside | Unsafe without replay fixtures, behavioral suites, and multi-family data | 3/10 |
| Direct production mutation after replay score improvement | Fastest path to applied tuning | Too risky without stronger replay and behavioral validation | 2/10 |

**Why this one**: It captures the part of the optimizer story that is already supportable by repo evidence while keeping the rest clearly fenced off.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet gets a realistic replay-based improvement loop immediately.
- Candidate tuning remains reviewable, explainable, and rollback-friendly.
- Non-tunable contract fields are protected by an explicit manifest boundary.

**What it costs**:
- Phase 4b remains visibly deferred and humans still need to review accepted candidates. Mitigation: keep the prerequisites and audit outputs explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deferred scope is mistaken for unfinished delivery | M | Keep Phase 4a and Phase 4b language explicit in all phase docs |
| Replay-based tuning is over-trusted without broader validation | H | Keep outputs advisory only until stronger gates exist |
| Search tries to mutate locked fields | H | Enforce the manifest boundary in both search and promotion |
| Advisory candidates are treated as production-ready anyway | H | Make advisory-only status explicit across spec, plan, tasks, checklist, and implementation summary |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase needed a safe near-term optimizer story |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include immediate broader optimization and direct production mutation |
| 3 | **Sufficient?** | PASS | Deterministic config tuning with advisory output is enough for the current phase |
| 4 | **Fits Goal?** | PASS | The decision stays aligned with offline replay and advisory maintenance work |
| 5 | **Open Horizons?** | PASS | Phase 4b remains documented for later expansion once prerequisites exist |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Build replay corpus, rubric, replay runner, search, promotion, and manifest surfaces for deterministic config tuning
- Keep prompt/meta work documented as deferred future scope
- Emit advisory reports and patch artifacts with full replay and rubric context

**How to roll back**: Stop using the optimizer outputs, refuse all promotion output, keep canonical configs unchanged, and preserve advisory reports for audit/debugging.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

 succeeded in 0ms:
'use strict';

// ---------------------------------------------------------------
// MODULE: Deterministic Replay Runner (T003)
// ---------------------------------------------------------------
// Replays corpus entries with given configurations, producing
// deterministic outputs. Same inputs always produce same outputs.
// Isolates replay from live network or human-in-the-loop
// variability (REQ-004).
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Default config values used when a config field is not specified.
 * @type {Readonly<Record<string, number|boolean>>}
 */
const DEFAULT_CONFIG = Object.freeze({
  convergenceThreshold: 0.05,
  stuckThreshold: 3,
  maxIterations: 10,
  rollingStopThreshold: 0.08,
  noProgressThreshold: 0.05,
  compositeStopScore: 0.60,
});

/* ---------------------------------------------------------------
   2. CONVERGENCE EVALUATION
----------------------------------------------------------------*/

/**
 * Evaluate whether the loop would converge at this iteration
 * given the config thresholds.
 *
 * @param {object} iteration - A corpus iteration record.
 * @param {object} config - The configuration under test.
 * @param {object} priorState - Accumulated state from prior iterations.
 * @returns {{ converged: boolean; stuck: boolean; signals: object }}
 */
function evaluateConvergence(iteration, config, priorState) {
  if (!iteration || typeof iteration !== 'object') {
    return {
      converged: false,
      stuck: false,
      signals: {
        newInfoRatio: 1.0,
        rollingAvg: 1.0,
        compositeScore: 1.0,
        belowThreshold: false,
        compositePass: false,
        consecutiveLowProgress: 0,
        convergenceThreshold: DEFAULT_CONFIG.convergenceThreshold,
        stuckThreshold: DEFAULT_CONFIG.stuckThreshold,
      },
    };
  }
  if (!config || typeof config !== 'object') config = DEFAULT_CONFIG;
  if (!priorState || typeof priorState !== 'object') {
    priorState = { newInfoRatios: [], consecutiveLowProgress: 0 };
  }
  const newInfoRatio = iteration.newInfoRatio ?? 1.0;
  const convergenceThreshold = config.convergenceThreshold ?? DEFAULT_CONFIG.convergenceThreshold;
  const stuckThreshold = config.stuckThreshold ?? DEFAULT_CONFIG.stuckThreshold;
  const noProgressThreshold = config.noProgressThreshold ?? DEFAULT_CONFIG.noProgressThreshold;
  const compositeStopScore = config.compositeStopScore ?? DEFAULT_CONFIG.compositeStopScore;

  // Compute rolling average of newInfoRatio
  const ratios = [...priorState.newInfoRatios, newInfoRatio];
  const windowSize = Math.min(ratios.length, 3);
  const window = ratios.slice(-windowSize);
  const rollingAvg = window.reduce((s, v) => s + v, 0) / window.length;

  // Check stuck (consecutive low-progress iterations)
  const isLowProgress = newInfoRatio < noProgressThreshold;
  const consecutiveLowProgress = isLowProgress
    ? priorState.consecutiveLowProgress + 1
    : 0;
  const stuck = consecutiveLowProgress >= stuckThreshold;

  // Convergence signals
  const convergenceSignals = iteration.convergenceSignals || {};
  const compositeScore = convergenceSignals.compositeStop ?? rollingAvg;

  // Converged when rolling average is below threshold.
  // compositePass is an additional signal only when compositeStop was
  // explicitly provided by convergence signals (not the fallback).
  const belowThreshold = rollingAvg <= convergenceThreshold;
  const hasExplicitComposite = convergenceSignals.compositeStop !== undefined;
  const compositePass = hasExplicitComposite && compositeScore >= compositeStopScore;
  const converged = belowThreshold || compositePass;

  return {
    converged,
    stuck,
    signals: {
      newInfoRatio,
      rollingAvg,
      compositeScore,
      belowThreshold,
      compositePass,
      consecutiveLowProgress,
      convergenceThreshold,
      stuckThreshold,
    },
  };
}

/* ---------------------------------------------------------------
   3. REPLAY EXECUTION
----------------------------------------------------------------*/

/**
 * Replay a corpus entry with a given config. Deterministic:
 * same corpus entry + same config = same output.
 *
 * @param {object} corpusEntry - A validated corpus entry from replay-corpus.cjs.
 * @param {object} config - The configuration to replay under.
 * @returns {{ iterationsUsed: number; maxIterations: number; converged: boolean; stuckIterations: number; recoveryAttempts: number; recoverySuccesses: number; totalFindings: number; relevantFindings: number; stopReason: string; perIterationSignals: object[]; finalSignals: object }}
 */
function replayRun(corpusEntry, config) {
  if (!corpusEntry || typeof corpusEntry !== 'object') {
    return {
      iterationsUsed: 0,
      maxIterations: DEFAULT_CONFIG.maxIterations,
      converged: false,
      stuckIterations: 0,
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      totalFindings: 0,
      relevantFindings: 0,
      stopReason: 'invalidCorpusEntry',
      perIterationSignals: [],
      graphBonus: 1.0,
      finalSignals: null,
    };
  }
  if (!config || typeof config !== 'object') config = DEFAULT_CONFIG;
  const maxIterations = config.maxIterations ?? DEFAULT_CONFIG.maxIterations;
  const iterations = corpusEntry.iterations || [];

  let state = {
    newInfoRatios: [],
    consecutiveLowProgress: 0,
    totalFindings: 0,
    relevantFindings: 0,
    stuckIterations: 0,
    recoveryAttempts: 0,
    recoverySuccesses: 0,
  };

  const perIterationSignals = [];
  let converged = false;
  let iterationsUsed = 0;
  let stopReason = 'maxIterationsReached';

  for (let i = 0; i < iterations.length && i < maxIterations; i++) {
    const iteration = iterations[i];
    iterationsUsed = i + 1;

    // Accumulate findings
    const findingsCount = iteration.findingsCount || 0;
    state.totalFindings += findingsCount;

    // Relevant findings: those with significant new info ratio
    const newInfoRatio = iteration.newInfoRatio ?? 0;
    if (newInfoRatio > 0.1) {
      state.relevantFindings += findingsCount;
    }

    // Evaluate convergence under candidate config
    const evalResult = evaluateConvergence(iteration, config, state);

    // Update state
    state.newInfoRatios.push(newInfoRatio);

    if (evalResult.stuck) {
      state.stuckIterations++;
      state.recoveryAttempts++;
      // Simulate recovery: if there are more iterations after stuck, recovery succeeded
      if (i + 1 < iterations.length) {
        state.recoverySuccesses++;
      }
    }

    state.consecutiveLowProgress = evalResult.signals.consecutiveLowProgress;

    perIterationSignals.push({
      run: iteration.run || i + 1,
      ...evalResult.signals,
      converged: evalResult.converged,
      stuck: evalResult.stuck,
    });

    // Check stop conditions
    if (evalResult.converged) {
      converged = true;
      stopReason = 'converged';
      break;
    }

    if (evalResult.stuck) {
      stopReason = 'stuckRecovery';
      // Don't break - recovery might happen in next iteration
    }
  }

  // Check for graph/wave metrics in the corpus entry and apply graph bonus
  let graphBonus = 1.0;
  if (corpusEntry.graphMetrics || corpusEntry.waveMetrics) {
    const graphMetrics = corpusEntry.graphMetrics || {};
    const waveMetrics = corpusEntry.waveMetrics || {};
    // Apply a 1.1x bonus when graph convergence signals are present and positive
    if (graphMetrics.graphConvergence > 0 || waveMetrics.convergenceScore > 0) {
      graphBonus = 1.1;
    }
  }

  return {
    iterationsUsed,
    maxIterations,
    converged,
    stuckIterations: state.stuckIterations,
    recoveryAttempts: state.recoveryAttempts,
    recoverySuccesses: state.recoverySuccesses,
    totalFindings: state.totalFindings,
    relevantFindings: state.relevantFindings,
    stopReason,
    perIterationSignals,
    graphBonus,
    finalSignals: perIterationSignals.length > 0
      ? perIterationSignals[perIterationSignals.length - 1]
      : null,
  };
}

/**
 * Compare baseline and candidate replay results.
 *
 * @param {object} baseline - Replay results for the baseline config.
 * @param {object} candidate - Replay results for the candidate config.
 * @returns {{ improved: boolean; regressions: string[]; improvements: string[]; delta: Record<string, number> }}
 */
function compareResults(baseline, candidate) {
  if (!baseline || typeof baseline !== 'object' || !candidate || typeof candidate !== 'object') {
    return { improved: false, regressions: ['Missing baseline or candidate results'], improvements: [], delta: {} };
  }
  const improvements = [];
  const regressions = [];
  const delta = {};

  // Compare convergence efficiency (lower iterations used = better)
  const iterDelta = baseline.iterationsUsed - candidate.iterationsUsed;
  delta.iterationsUsed = iterDelta;
  if (iterDelta > 0) {
    improvements.push(`Converged ${iterDelta} iteration(s) sooner`);
  } else if (iterDelta < 0) {
    regressions.push(`Needed ${Math.abs(iterDelta)} more iteration(s)`);
  }

  // Compare convergence (converging is better than not)
  if (candidate.converged && !baseline.converged) {
    improvements.push('Candidate converged while baseline did not');
  } else if (!candidate.converged && baseline.converged) {
    regressions.push('Candidate failed to converge while baseline did');
  }

  // Compare stuck iterations (fewer = better)
  const stuckDelta = baseline.stuckIterations - candidate.stuckIterations;
  delta.stuckIterations = stuckDelta;
  if (stuckDelta > 0) {
    improvements.push(`${stuckDelta} fewer stuck iteration(s)`);
  } else if (stuckDelta < 0) {
    regressions.push(`${Math.abs(stuckDelta)} more stuck iteration(s)`);
  }

  // Compare findings (more relevant findings = better)
  const findingsDelta = candidate.relevantFindings - baseline.relevantFindings;
  delta.relevantFindings = findingsDelta;
  if (findingsDelta > 0) {
    improvements.push(`${findingsDelta} more relevant finding(s)`);
  } else if (findingsDelta < 0) {
    regressions.push(`${Math.abs(findingsDelta)} fewer relevant finding(s)`);
  }

  // Overall: improved if there are improvements and no critical regressions
  const improved = improvements.length > 0 && regressions.length === 0;

  return { improved, regressions, improvements, delta };
}

/* ---------------------------------------------------------------
   4. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  DEFAULT_CONFIG,
  evaluateConvergence,
  replayRun,
  compareResults,
};

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Writing or modifying OpenCode system code (.opencode/, MCP servers, scripts)
- Creating new JavaScript modules for MCP servers or utilities
- Writing Python scripts (validators, advisors, test utilities)
- Creating Shell scripts (automation, validation, deployment)
- Configuring JSON/JSONC files (manifests, schemas, configs)
- Preparing stack-specific standards evidence for `sk-code-review` baseline runs
- Need naming, formatting, or structure guidance

**Keyword triggers:**

| Language   | Keywords                                                                          |
| ---------- | --------------------------------------------------------------------------------- |
| JavaScript | `opencode`, `mcp`, `commonjs`, `require`, `module.exports`, `strict`              |
| TypeScript | `typescript`, `ts`, `tsx`, `interface`, `type`, `tsconfig`, `tsc`, `strict`       |
| Python     | `python`, `pytest`, `argparse`, `docstring`, `snake_case`                         |
| Shell      | `bash`, `shell`, `shebang`, `set -e`, `pipefail`                                  |
| Config     | `json`, `jsonc`, `config`, `schema`, `manifest`                                   |

### When NOT to Use

**Do NOT use this skill for:**
- Web/frontend development (use `sk-code-web` instead)
- Browser-specific patterns (DOM, observers, animations)
- CSS styling or responsive design
- CDN deployment or minification workflows
- Full development lifecycle (research/debug/verify phases)

### Skill Overview

| Aspect        | This Skill (opencode)        | sk-code-web        |
| ------------- | ---------------------------- | --------------------- |
| **Target**    | System/backend code          | Web/frontend code     |
| **Languages** | JS, TS, Python, Shell, JSON  | HTML, CSS, JavaScript |
| **Phases**    | Standards only               | 4 phases (0-3)        |
| **Browser**   | Not applicable               | Required verification |
| **Focus**     | Internal tooling             | User-facing features  |

**The Standard**: Evidence-based patterns extracted from actual OpenCode codebase files with file:line citations.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/shared/` for universal cross-language patterns, structure conventions, and organization guidance.
- `references/javascript/` for JavaScript style, quality standards, and quick-reference guidance.
- `references/typescript/` for TypeScript style, quality standards, and quick-reference guidance.
- `references/python/` for Python style, quality standards, and quick-reference guidance.
- `references/shell/` for shell scripting style, quality standards, and quick-reference guidance.
- `references/config/` for JSON/JSONC style rules and configuration guidance.
- `assets/checklists/` for language-specific quality gates and completion checklists.

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If language keywords match | Language-specific references |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/shared/universal_patterns.md"

LANGUAGE_KEYWORDS = {
    "JAVASCRIPT": {"node": 1.8, "commonjs": 2.0, "require": 1.5, "module.exports": 2.1},
    "TYPESCRIPT": {"typescript": 2.4, "interface": 2.0, "tsconfig": 2.1, "tsc": 1.8},
    "PYTHON": {"python": 2.3, "pytest": 2.0, "argparse": 1.7, "docstring": 1.6},
    "SHELL": {"bash": 2.2, "shebang": 1.5, "set -e": 1.5, "pipefail": 1.7},
    "CONFIG": {"json": 2.0, "jsonc": 2.1, "schema": 1.8, "manifest": 1.5},
}

FILE_EXTENSIONS = {
    ".js": "JAVASCRIPT", ".mjs": "JAVASCRIPT", ".cjs": "JAVASCRIPT",
    ".ts": "TYPESCRIPT", ".tsx": "TYPESCRIPT", ".mts": "TYPESCRIPT", ".d.ts": "TYPESCRIPT",
    ".py": "PYTHON",
    ".sh": "SHELL", ".bash": "SHELL",
    ".json": "CONFIG", ".jsonc": "CONFIG"
}

NOISY_SYNONYMS = {
    "TYPESCRIPT": {"typecheck": 1.8, "lint": 1.3, "strict": 1.2, "ci": 1.0},
    "SHELL": {"shell safety": 2.0, "pipefail": 1.7, "unsafe": 1.6, "script warning": 1.4},
    "CONFIG": {"jsonc": 2.0, "schema": 1.3, "config drift": 1.4, "format": 1.2},
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "List changed file extensions in the patch",
    "Confirm CI failure category (style, typecheck, shell safety, config parsing)",
    "Provide one representative failing command/output",
    "Confirm minimum verification command set before completion claim",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "context", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "path", "")),
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
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def detect_languages(task):
    """Weighted language intent scoring with top-2 ambiguity handling."""
    ext = Path(task.path).suffix.lower() if getattr(task, "path", "") else ""
    if ext in FILE_EXTENSIONS:
        return [FILE_EXTENSIONS[ext]], {FILE_EXTENSIONS[ext]: 100.0}

    text = _task_text(task)
    scores = {lang: 0.0 for lang in LANGUAGE_KEYWORDS}
    for language, signals in LANGUAGE_KEYWORDS.items():
        for term, weight in signals.items():
            if term in text:
                scores[language] += weight
    for language, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if term in text:
                scores[language] += weight

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    best_lang, best_score = ranked[0]
    second_lang, second_score = ranked[1]
    if best_score == 0:
        return ["UNKNOWN"], scores
    adaptive_limit = 3 if sum(1 for term in ["ci", "mixed", "multi", "format", "safety"] if term in text) >= 2 else 2
    if (best_score - second_score) <= 0.8:
        top_languages = [language for language, score in ranked if score > 0][:adaptive_limit]
        return top_languages, scores
    return [best_lang], scores

def route_opencode_resources(task):
    inventory = discover_markdown_resources()

    selected = ["references/shared/universal_patterns.md", "references/shared/code_organization.md"]

    languages, language_scores = detect_languages(task)

    # Ambiguity handling: when top-2 are close, load both quick references.
    for language in languages:
        if language == "JAVASCRIPT":
            selected.extend([
                "references/javascript/style_guide.md",
                "references/javascript/quality_standards.md",
                "references/javascript/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/javascript_checklist.md")

        elif language == "TYPESCRIPT":
            selected.extend([
                "references/typescript/style_guide.md",
                "references/typescript/quality_standards.md",
                "references/typescript/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/typescript_checklist.md")

        elif language == "PYTHON":
            selected.extend([
                "references/python/style_guide.md",
                "references/python/quality_standards.md",
                "references/python/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/python_checklist.md")

        elif language == "SHELL":
            selected.extend([
                "references/shell/style_guide.md",
                "references/shell/quality_standards.md",
                "references/shell/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/shell_checklist.md")

codex
I’ve got the phase contract and the two primary implementation files in view. I’m now expanding into the surrounding optimizer modules and tests, because the security questions here depend on how manifest bounds, search mutation, and promotion gating are enforced end-to-end rather than in isolation.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
    53	/* ---------------------------------------------------------------
    54	   2. CORPUS ENTRY SCHEMA
    55	----------------------------------------------------------------*/
    56	
    57	/**
    58	 * Validate a single corpus entry against the expected schema.
    59	 *
    60	 * @param {object} entry - The corpus entry to validate.
    61	 * @returns {{ valid: boolean; errors: string[] }}
    62	 */
    63	function validateCorpusEntry(entry) {
    64	  const errors = [];
    65	
    66	  if (!entry || typeof entry !== 'object') {
    67	    return { valid: false, errors: ['Entry must be a non-null object'] };
    68	  }
    69	
    70	  for (const field of REQUIRED_ENTRY_FIELDS) {
    71	    if (entry[field] === undefined || entry[field] === null) {
    72	      errors.push(`Missing required field: ${field}`);
    73	    }
    74	  }
    75	
    76	  if (entry.packetFamily && !PACKET_FAMILIES[entry.packetFamily]) {
    77	    errors.push(`Unknown packet family: ${entry.packetFamily}`);
    78	  }
    79	
    80	  if (entry.packetFamily === '042') {
    81	    errors.push('Packet family 042 is excluded until implementation traces exist');
    82	  }
    83	
    84	  if (entry.iterations && !Array.isArray(entry.iterations)) {
    85	    errors.push('iterations must be an array');
    86	  }
    87	
    88	  if (entry.iterations && Array.isArray(entry.iterations) && entry.iterations.length === 0) {
    89	    errors.push('iterations must not be empty');
    90	  }
    91	
    92	  if (entry.config && typeof entry.config !== 'object') {
    93	    errors.push('config must be an object');
    94	  }
    95	
    96	  if (entry.stopOutcome && typeof entry.stopOutcome !== 'object') {
    97	    errors.push('stopOutcome must be an object');
    98	  }
    99	
   100	  return { valid: errors.length === 0, errors };
   101	}
   102	
   103	/* ---------------------------------------------------------------
   104	   3. JSONL PARSING
   105	----------------------------------------------------------------*/
   106	
   107	/**
   108	 * Parse JSONL content into an array of records.
   109	 * Tracks skipped/malformed lines for diagnostics.
   110	 *
   111	 * @param {string} content - Raw JSONL string.
   112	 * @returns {{ records: object[]; skippedLines: Array<{ lineNumber: number; content: string; error: string }>; totalLines: number }} Parsed records with skip metadata.
   113	 */
   114	function parseJSONL(content) {
   115	  const lines = content.trim().split('\n');
   116	  const records = [];
   117	  const skippedLines = [];
   118	  let nonBlankCount = 0;
   119	
   120	  for (let i = 0; i < lines.length; i++) {
   121	    const trimmed = lines[i].trim();
   122	    if (!trimmed) continue;
   123	    nonBlankCount++;
   124	    try {
   125	      records.push(JSON.parse(trimmed));
   126	    } catch (err) {
   127	      skippedLines.push({
   128	        lineNumber: i + 1,
   129	        content: trimmed.length > 200 ? trimmed.slice(0, 200) + '...' : trimmed,
   130	        error: err instanceof Error ? err.message : String(err),
   131	      });
   132	    }
   133	  }
   134	
   135	  return { records, skippedLines, totalLines: nonBlankCount };
   136	}
   137	
   138	/* ---------------------------------------------------------------
   139	   4. CORPUS BUILDING
   140	----------------------------------------------------------------*/
   141	
   142	/**
   143	 * Extract a single corpus entry from a set of parsed JSONL records.
   144	 *
   145	 * @param {object[]} records - Parsed JSONL records from a single run.
   146	 * @param {string} packetFamily - The packet family identifier (e.g., '040').
   147	 * @param {string} sourceRunId - Identifier for the source run.
   148	 * @param {object} [options={}] - Extraction options.
   149	 * @param {string} [options.timestamp] - Override timestamp for deterministic replay. Defaults to current time.
   150	 * @returns {object} A corpus entry.
   151	 */
   152	function extractCorpusEntry(records, packetFamily, sourceRunId, options) {
   153	  const opts = options || {};
   154	  const extractedAt = opts.timestamp || new Date().toISOString();
   155	  const configRecord = records.find((r) => r.type === 'config') || {};
   156	  const iterations = records.filter((r) => ITERATION_TYPES.has(r.type));
   157	  const events = records.filter((r) => EVENT_TYPES.has(r.type));
   158	
   159	  // Find the LAST terminal event (synthesis_complete, stop_decision, etc.)
   160	  // An intermediate stop_decision before the real synthesis_complete must not
   161	  // freeze stopOutcome — iterate all events and keep the final match.
   162	  let stopEvent = null;
   163	  for (const e of events) {
   164	    if (
   165	      e.event === 'synthesis_complete' ||
   166	      e.event === 'stop_decision' ||
   167	      e.event === 'stopped'
   168	    ) {
   169	      stopEvent = e;
   170	    }
   171	  }
   172	
   173	  const familyInfo = PACKET_FAMILIES[packetFamily] || {
   174	    role: 'unknown',
   175	    required: false,
   176	    compatibilityGrade: 'unknown',
   177	  };
   178	
   179	  const entry = {
   180	    id: `${packetFamily}-${sourceRunId}`,
   181	    packetFamily,
   182	    sourceRun: sourceRunId,
   183	    compatibilityGrade: familyInfo.compatibilityGrade,
   184	    role: familyInfo.role,
   185	    config: {
   186	      maxIterations: configRecord.maxIterations || null,
   187	      convergenceThreshold: configRecord.convergenceThreshold || null,
   188	      stuckThreshold: configRecord.stuckThreshold || null,
   189	      mode: configRecord.mode || null,
   190	      topic: configRecord.topic || null,
   191	    },
   192	    iterations: iterations.map((iter) => ({
   193	      run: iter.run,
   194	      status: iter.status,
   195	      focus: iter.focus || null,
   196	      findingsCount: iter.findingsCount || 0,
   197	      newInfoRatio: iter.newInfoRatio ?? iter.newFindingsRatio ?? null,
   198	      convergenceSignals: iter.convergenceSignals || null,
   199	      durationMs: iter.durationMs || null,
   200	      timestamp: iter.timestamp || null,
   201	    })),
   202	    stopOutcome: stopEvent
   203	      ? {
   204	          stopReason: stopEvent.stopReason || stopEvent.decision || null,
   205	          legalStop: stopEvent.legalStop || null,
   206	          totalIterations: stopEvent.totalIterations || iterations.length,
   207	          verdict: stopEvent.verdict || null,
   208	        }
   209	      : {
   210	          stopReason: 'unknown',
   211	          legalStop: null,
   212	          totalIterations: iterations.length,
   213	          verdict: null,
   214	        },
   215	    metadata: {
   216	      extractedAt,
   217	      sourceRecordCount: records.length,
   218	      hasGraphMetrics: iterations.some(
   219	        (i) => i.convergenceSignals && i.convergenceSignals.graphCoverage !== undefined,
   220	      ),
   221	      hasWaveMetrics: iterations.some(
   222	        (i) => i.convergenceSignals && i.convergenceSignals.waveSegments !== undefined,
   223	      ),
   224	    },
   225	  };
   226	
   227	  return entry;
   228	}
   229	
   230	/**
   231	 * Build a replay corpus from a packet family's JSONL data.
   232	 *
   233	 * @param {string} packetFamily - The packet family identifier ('040', '028', '042').
   234	 * @param {object} [options={}] - Options.
   235	 * @param {string} [options.fixturesDir] - Path to the fixtures directory.
   236	 * @param {string} [options.jsonlContent] - Raw JSONL content (alternative to reading from disk).
   237	 * @param {string} [options.sourceRunId] - Run identifier for the corpus entry.
   238	 * @param {string} [options.timestamp] - Override timestamp for deterministic replay.
   239	 * @returns {{ corpus: object[]; errors: string[]; warnings: string[]; familyInfo: object }}
   240	 */
   241	function buildCorpus(packetFamily, options = {}) {
   242	  const errors = [];
   243	  const warnings = [];
   244	  const corpus = [];
   245	
   246	  // Check family validity
   247	  const familyInfo = PACKET_FAMILIES[packetFamily];
   248	  if (!familyInfo) {
   249	    errors.push(`Unknown packet family: ${packetFamily}`);
   250	    return { corpus, errors, warnings, familyInfo: null };
   251	  }
   252	
   253	  // 042 is excluded
   254	  if (packetFamily === '042') {
   255	    errors.push(
   256	      'Packet family 042 is excluded until implementation traces exist',
   257	    );
   258	    return { corpus, errors, warnings, familyInfo };
   259	  }
   260	
   261	  // 028 holdout warning
   262	  if (packetFamily === '028') {
   263	    warnings.push(
   264	      'Packet family 028 is an optional holdout with legacy compatibility grading',
   265	    );
   266	  }
   267	
   268	  let parsed;
   269	
   270	  if (options.jsonlContent) {
   271	    parsed = parseJSONL(options.jsonlContent);
   272	  } else if (options.fixturesDir) {
   273	    const jsonlPath = path.join(
   274	      options.fixturesDir,
   275	      packetFamily,
   276	      'sample-iterations.jsonl',
   277	    );
   278	    if (!fs.existsSync(jsonlPath)) {
   279	      errors.push(`JSONL fixture not found: ${jsonlPath}`);
   280	      return { corpus, errors, warnings, familyInfo };
   281	    }
   282	    const content = fs.readFileSync(jsonlPath, 'utf8');
   283	    parsed = parseJSONL(content);
   284	  } else {
   285	    errors.push('Either fixturesDir or jsonlContent must be provided');
   286	    return { corpus, errors, warnings, familyInfo };
   287	  }
   288	
   289	  const { records, skippedLines, totalLines } = parsed;
   290	
   291	  // P1-4: Reject traces where >20% of non-blank lines are malformed
   292	  if (totalLines > 0 && skippedLines.length / totalLines > 0.20) {
   293	    errors.push(
   294	      `Too many malformed JSONL lines: ${skippedLines.length}/${totalLines} (${(skippedLines.length / totalLines * 100).toFixed(1)}%) exceeds 20% threshold`,
   295	    );
   296	    return { corpus, errors, warnings, familyInfo };
   297	  }
   298	
   299	  if (skippedLines.length > 0) {
   300	    warnings.push(
   301	      `Skipped ${skippedLines.length} malformed JSONL line(s) out of ${totalLines}`,
   302	    );
   303	  }
   304	
   305	  if (records.length === 0) {
   306	    errors.push('No valid JSONL records found');
   307	    return { corpus, errors, warnings, familyInfo };
   308	  }
   309	
   310	  const sourceRunId =
   311	    options.sourceRunId ||
   312	    (records.find((r) => r.sessionId) || {}).sessionId ||
   313	    `${packetFamily}-run-1`;
   314	
   315	  const entry = extractCorpusEntry(records, packetFamily, sourceRunId, {
   316	    timestamp: options.timestamp,
   317	  });
   318	
   319	  // Attach skip/validation metadata to the corpus entry
   320	  if (skippedLines.length > 0) {

 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Deterministic Replay Runner (T003)
     5	// ---------------------------------------------------------------
     6	// Replays corpus entries with given configurations, producing
     7	// deterministic outputs. Same inputs always produce same outputs.
     8	// Isolates replay from live network or human-in-the-loop
     9	// variability (REQ-004).
    10	// ---------------------------------------------------------------
    11	
    12	/* ---------------------------------------------------------------
    13	   1. CONSTANTS
    14	----------------------------------------------------------------*/
    15	
    16	/**
    17	 * Default config values used when a config field is not specified.
    18	 * @type {Readonly<Record<string, number|boolean>>}
    19	 */
    20	const DEFAULT_CONFIG = Object.freeze({
    21	  convergenceThreshold: 0.05,
    22	  stuckThreshold: 3,
    23	  maxIterations: 10,
    24	  rollingStopThreshold: 0.08,
    25	  noProgressThreshold: 0.05,
    26	  compositeStopScore: 0.60,
    27	});
    28	
    29	/* ---------------------------------------------------------------
    30	   2. CONVERGENCE EVALUATION
    31	----------------------------------------------------------------*/
    32	
    33	/**
    34	 * Evaluate whether the loop would converge at this iteration
    35	 * given the config thresholds.
    36	 *
    37	 * @param {object} iteration - A corpus iteration record.
    38	 * @param {object} config - The configuration under test.
    39	 * @param {object} priorState - Accumulated state from prior iterations.
    40	 * @returns {{ converged: boolean; stuck: boolean; signals: object }}
    41	 */
    42	function evaluateConvergence(iteration, config, priorState) {
    43	  if (!iteration || typeof iteration !== 'object') {
    44	    return {
    45	      converged: false,
    46	      stuck: false,
    47	      signals: {
    48	        newInfoRatio: 1.0,
    49	        rollingAvg: 1.0,
    50	        compositeScore: 1.0,
    51	        belowThreshold: false,
    52	        compositePass: false,
    53	        consecutiveLowProgress: 0,
    54	        convergenceThreshold: DEFAULT_CONFIG.convergenceThreshold,
    55	        stuckThreshold: DEFAULT_CONFIG.stuckThreshold,
    56	      },
    57	    };
    58	  }
    59	  if (!config || typeof config !== 'object') config = DEFAULT_CONFIG;
    60	  if (!priorState || typeof priorState !== 'object') {
    61	    priorState = { newInfoRatios: [], consecutiveLowProgress: 0 };
    62	  }
    63	  const newInfoRatio = iteration.newInfoRatio ?? 1.0;
    64	  const convergenceThreshold = config.convergenceThreshold ?? DEFAULT_CONFIG.convergenceThreshold;
    65	  const stuckThreshold = config.stuckThreshold ?? DEFAULT_CONFIG.stuckThreshold;
    66	  const noProgressThreshold = config.noProgressThreshold ?? DEFAULT_CONFIG.noProgressThreshold;
    67	  const compositeStopScore = config.compositeStopScore ?? DEFAULT_CONFIG.compositeStopScore;
    68	
    69	  // Compute rolling average of newInfoRatio
    70	  const ratios = [...priorState.newInfoRatios, newInfoRatio];
    71	  const windowSize = Math.min(ratios.length, 3);
    72	  const window = ratios.slice(-windowSize);
    73	  const rollingAvg = window.reduce((s, v) => s + v, 0) / window.length;
    74	
    75	  // Check stuck (consecutive low-progress iterations)
    76	  const isLowProgress = newInfoRatio < noProgressThreshold;
    77	  const consecutiveLowProgress = isLowProgress
    78	    ? priorState.consecutiveLowProgress + 1
    79	    : 0;
    80	  const stuck = consecutiveLowProgress >= stuckThreshold;
    81	
    82	  // Convergence signals
    83	  const convergenceSignals = iteration.convergenceSignals || {};
    84	  const compositeScore = convergenceSignals.compositeStop ?? rollingAvg;
    85	
    86	  // Converged when rolling average is below threshold.
    87	  // compositePass is an additional signal only when compositeStop was
    88	  // explicitly provided by convergence signals (not the fallback).
    89	  const belowThreshold = rollingAvg <= convergenceThreshold;
    90	  const hasExplicitComposite = convergenceSignals.compositeStop !== undefined;
    91	  const compositePass = hasExplicitComposite && compositeScore >= compositeStopScore;
    92	  const converged = belowThreshold || compositePass;
    93	
    94	  return {
    95	    converged,
    96	    stuck,
    97	    signals: {
    98	      newInfoRatio,
    99	      rollingAvg,
   100	      compositeScore,
   101	      belowThreshold,
   102	      compositePass,
   103	      consecutiveLowProgress,
   104	      convergenceThreshold,
   105	      stuckThreshold,
   106	    },
   107	  };
   108	}
   109	
   110	/* ---------------------------------------------------------------
   111	   3. REPLAY EXECUTION
   112	----------------------------------------------------------------*/
   113	
   114	/**
   115	 * Replay a corpus entry with a given config. Deterministic:
   116	 * same corpus entry + same config = same output.
   117	 *
   118	 * @param {object} corpusEntry - A validated corpus entry from replay-corpus.cjs.
   119	 * @param {object} config - The configuration to replay under.
   120	 * @returns {{ iterationsUsed: number; maxIterations: number; converged: boolean; stuckIterations: number; recoveryAttempts: number; recoverySuccesses: number; totalFindings: number; relevantFindings: number; stopReason: string; perIterationSignals: object[]; finalSignals: object }}
   121	 */
   122	function replayRun(corpusEntry, config) {
   123	  if (!corpusEntry || typeof corpusEntry !== 'object') {
   124	    return {
   125	      iterationsUsed: 0,
   126	      maxIterations: DEFAULT_CONFIG.maxIterations,
   127	      converged: false,
   128	      stuckIterations: 0,
   129	      recoveryAttempts: 0,
   130	      recoverySuccesses: 0,
   131	      totalFindings: 0,
   132	      relevantFindings: 0,
   133	      stopReason: 'invalidCorpusEntry',
   134	      perIterationSignals: [],
   135	      graphBonus: 1.0,
   136	      finalSignals: null,
   137	    };
   138	  }
   139	  if (!config || typeof config !== 'object') config = DEFAULT_CONFIG;
   140	  const maxIterations = config.maxIterations ?? DEFAULT_CONFIG.maxIterations;
   141	  const iterations = corpusEntry.iterations || [];
   142	
   143	  let state = {
   144	    newInfoRatios: [],
   145	    consecutiveLowProgress: 0,
   146	    totalFindings: 0,
   147	    relevantFindings: 0,
   148	    stuckIterations: 0,
   149	    recoveryAttempts: 0,
   150	    recoverySuccesses: 0,
   151	  };
   152	
   153	  const perIterationSignals = [];
   154	  let converged = false;
   155	  let iterationsUsed = 0;
   156	  let stopReason = 'maxIterationsReached';
   157	
   158	  for (let i = 0; i < iterations.length && i < maxIterations; i++) {
   159	    const iteration = iterations[i];
   160	    iterationsUsed = i + 1;
   161	
   162	    // Accumulate findings
   163	    const findingsCount = iteration.findingsCount || 0;
   164	    state.totalFindings += findingsCount;
   165	
   166	    // Relevant findings: those with significant new info ratio
   167	    const newInfoRatio = iteration.newInfoRatio ?? 0;
   168	    if (newInfoRatio > 0.1) {
   169	      state.relevantFindings += findingsCount;
   170	    }
   171	
   172	    // Evaluate convergence under candidate config
   173	    const evalResult = evaluateConvergence(iteration, config, state);
   174	
   175	    // Update state
   176	    state.newInfoRatios.push(newInfoRatio);
   177	
   178	    if (evalResult.stuck) {
   179	      state.stuckIterations++;
   180	      state.recoveryAttempts++;
   181	      // Simulate recovery: if there are more iterations after stuck, recovery succeeded
   182	      if (i + 1 < iterations.length) {
   183	        state.recoverySuccesses++;
   184	      }
   185	    }
   186	
   187	    state.consecutiveLowProgress = evalResult.signals.consecutiveLowProgress;
   188	
   189	    perIterationSignals.push({
   190	      run: iteration.run || i + 1,
   191	      ...evalResult.signals,
   192	      converged: evalResult.converged,
   193	      stuck: evalResult.stuck,
   194	    });
   195	
   196	    // Check stop conditions
   197	    if (evalResult.converged) {
   198	      converged = true;
   199	      stopReason = 'converged';
   200	      break;
   201	    }
   202	
   203	    if (evalResult.stuck) {
   204	      stopReason = 'stuckRecovery';
   205	      // Don't break - recovery might happen in next iteration
   206	    }
   207	  }
   208	
   209	  // Check for graph/wave metrics in the corpus entry and apply graph bonus
   210	  let graphBonus = 1.0;
   211	  if (corpusEntry.graphMetrics || corpusEntry.waveMetrics) {
   212	    const graphMetrics = corpusEntry.graphMetrics || {};
   213	    const waveMetrics = corpusEntry.waveMetrics || {};
   214	    // Apply a 1.1x bonus when graph convergence signals are present and positive
   215	    if (graphMetrics.graphConvergence > 0 || waveMetrics.convergenceScore > 0) {
   216	      graphBonus = 1.1;
   217	    }
   218	  }
   219	
   220	  return {
   221	    iterationsUsed,
   222	    maxIterations,
   223	    converged,
   224	    stuckIterations: state.stuckIterations,
   225	    recoveryAttempts: state.recoveryAttempts,
   226	    recoverySuccesses: state.recoverySuccesses,
   227	    totalFindings: state.totalFindings,
   228	    relevantFindings: state.relevantFindings,
   229	    stopReason,
   230	    perIterationSignals,
   231	    graphBonus,
   232	    finalSignals: perIterationSignals.length > 0
   233	      ? perIterationSignals[perIterationSignals.length - 1]
   234	      : null,
   235	  };
   236	}
   237	
   238	/**
   239	 * Compare baseline and candidate replay results.
   240	 *
   241	 * @param {object} baseline - Replay results for the baseline config.
   242	 * @param {object} candidate - Replay results for the candidate config.
   243	 * @returns {{ improved: boolean; regressions: string[]; improvements: string[]; delta: Record<string, number> }}
   244	 */
   245	function compareResults(baseline, candidate) {
   246	  if (!baseline || typeof baseline !== 'object' || !candidate || typeof candidate !== 'object') {
   247	    return { improved: false, regressions: ['Missing baseline or candidate results'], improvements: [], delta: {} };
   248	  }
   249	  const improvements = [];
   250	  const regressions = [];
   251	  const delta = {};
   252	
   253	  // Compare convergence efficiency (lower iterations used = better)
   254	  const iterDelta = baseline.iterationsUsed - candidate.iterationsUsed;
   255	  delta.iterationsUsed = iterDelta;
   256	  if (iterDelta > 0) {
   257	    improvements.push(`Converged ${iterDelta} iteration(s) sooner`);
   258	  } else if (iterDelta < 0) {
   259	    regressions.push(`Needed ${Math.abs(iterDelta)} more iteration(s)`);
   260	  }
   261	
   262	  // Compare convergence (converging is better than not)
   263	  if (candidate.converged && !baseline.converged) {
   264	    improvements.push('Candidate converged while baseline did not');
   265	  } else if (!candidate.converged && baseline.converged) {
   266	    regressions.push('Candidate failed to converge while baseline did');
   267	  }
   268	
   269	  // Compare stuck iterations (fewer = better)
   270	  const stuckDelta = baseline.stuckIterations - candidate.stuckIterations;
   271	  delta.stuckIterations = stuckDelta;
   272	  if (stuckDelta > 0) {
   273	    improvements.push(`${stuckDelta} fewer stuck iteration(s)`);
   274	  } else if (stuckDelta < 0) {
   275	    regressions.push(`${Math.abs(stuckDelta)} more stuck iteration(s)`);
   276	  }
   277	
   278	  // Compare findings (more relevant findings = better)
   279	  const findingsDelta = candidate.relevantFindings - baseline.relevantFindings;
   280	  delta.relevantFindings = findingsDelta;
   281	  if (findingsDelta > 0) {
   282	    improvements.push(`${findingsDelta} more relevant finding(s)`);
   283	  } else if (findingsDelta < 0) {
   284	    regressions.push(`${Math.abs(findingsDelta)} fewer relevant finding(s)`);
   285	  }
   286	
   287	  // Overall: improved if there are improvements and no critical regressions
   288	  const improved = improvements.length > 0 && regressions.length === 0;
   289	
   290	  return { improved, regressions, improvements, delta };
   291	}
   292	
   293	/* ---------------------------------------------------------------
   294	   4. EXPORTS
   295	----------------------------------------------------------------*/
   296	
   297	module.exports = {
   298	  DEFAULT_CONFIG,
   299	  evaluateConvergence,
   300	  replayRun,
   301	  compareResults,
   302	};

exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts/optimizer .opencode/skill/system-spec-kit/scripts/tests | rg 'optimizer|replay|promote|manifest|search|rubric'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs
.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json
.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-config-candidate.json
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-config-baseline.json
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/sample-iterations.jsonl
.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/sample-iterations.jsonl
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/memory/06-04-26_12-05__deep-research-run-8.md

exec
/bin/zsh -lc "rg -n \"replay-corpus|replay-runner|promote|optimizer-manifest|search bounded|advisory-only|candidate patch|audit trail|fixtures|behavioral suites\" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11 -g '"'!**/graph-metadata.json'"' -g '"'!**/description.json'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:32:| `004-offline-loop-optimizer` | Phase 4a — replay optimizer, audit trail, 91 tests (Phase 4b deferred) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:98:| **Phase 4** | Offline optimizer | Optimizer scripts, replay fixtures, config boundaries, promotion gate, offline maintenance docs |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:121:| REQ-005 | Phase 4b must remain explicitly deferred until replay fixtures, behavioral suites, and corpus prerequisites exist. | [./004-offline-loop-optimizer/spec.md](./004-offline-loop-optimizer/spec.md) |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:160:| Dependency | Replay fixtures and behavioral suites are prerequisites for non-advisory optimization | High | Keep Phase 4a advisory-only and Phase 4b deferred until those prerequisites exist. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:20:## ADR-001: Ship deterministic offline config optimization first and keep promotion advisory-only
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:35:We needed a safe way to improve deep-loop runtime configs using real traces, but the repo did not yet have the replay fixtures, behavioral suites, or multi-family corpus coverage needed for broad prompt or meta-optimization. The phase had to produce real value now without pretending the wider optimizer vision was already safe, and it had to stop the optimizer from mutating locked contract fields or applying production config changes directly.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:49:**We chose**: deliver Phase 4a as a deterministic offline config optimizer now, keep Phase 4b prompt/meta optimization explicitly deferred, and bound all current promotion output to advisory-only candidate patches or reports.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:61:| **Deterministic config optimization now with advisory-only promotion** | Delivers real value with a clear safety envelope | Leaves some ambitious optimization ideas intentionally deferred and still requires human review | 9/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:62:| Build prompt and meta optimization immediately | Bigger theoretical upside | Unsafe without replay fixtures, behavioral suites, and multi-family data | 3/10 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:88:| Advisory candidates are treated as production-ready anyway | H | Make advisory-only status explicit across spec, plan, tasks, checklist, and implementation summary |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:3:description: "Define an offline replay optimizer that tunes deterministic deep-loop configs against real packet traces now, while deferring prompt and meta-optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:22:Phase 004 is now explicitly split into two sub-phases. Phase 4a is the realistic near-term deliverable: build an offline compile/evaluate loop that replays real packet traces, tunes deterministic numeric config thresholds, and emits advisory patch recommendations with a full audit trail. Phase 4b is deferred future work for prompt-pack and meta-optimization once replay fixtures, behavioral suites, and multi-family corpus coverage actually exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:39:| **Handoff Criteria** | Phase 4a outputs are replay-verified, audit-trailed, and emitted as advisory-only candidate patches until Phase 1 replay fixtures and Phase 3 behavioral suites exist. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:48:- Phase 001 replay fixtures must exist before any production-grade replay or promotion claim is credible.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:49:- Phase 003 behavioral suites must exist before any non-advisory promotion is allowed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:69:Define an offline replay optimizer that learns from real packet traces, scores run quality against a shared rubric, searches bounded deterministic config space, and emits advisory candidate patches only. Production promotion remains out of scope until Phase 1 replay fixtures and Phase 3 behavioral suites exist, and prompt or meta-optimization remains deferred future work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:84:- Add an advisory-only promotion gate that never mutates production config directly while prerequisite fixtures and suites are still missing.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:85:- Record a full audit trail for every optimization attempt, including rejected candidates and patch-style recommendations.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:100:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:103:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:104:| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and emit advisory-only candidate patches. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:105:| `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Create | Canonical manifest of tunable fields, locked contract fields, and future prompt-pack entrypoints. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:112:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:115:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:116:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify advisory promotion gating, rollback behavior, and audit output. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:117:| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures, optimization-result snapshots, and advisory patch artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:134:| REQ-006 | No production promotion is allowed until the replay fixtures planned in Phase 1 and the behavioral suites planned in Phase 3 actually exist. | Until both prerequisite surfaces exist, all optimizer outputs are advisory-only candidate patches or reports and must not directly mutate canonical production configs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:141:| REQ-008 | Every optimization run MUST emit an audit trail that records what was tried, what improved, what regressed, and why a candidate was accepted or rejected. | Audit output exists for every run, including failed searches and rejected advisory promotions, and captures both candidate settings and evaluation outcomes. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:156:- **SC-005**: Promotion remains advisory-only until replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:157:- **SC-006**: Every optimization run produces a reviewable audit trail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:168:6. **Given** a candidate outperforms baseline in replay but the Phase 1 replay fixtures or Phase 3 behavioral suites do not yet exist, **when** promotion runs, **then** the optimizer emits only an advisory patch or report and refuses production promotion.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:169:7. **Given** an older packet trace lacks graph or wave metrics, **when** scoring runs, **then** the audit trail marks those dimensions unavailable rather than inventing placeholder values.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:182:| Dependency | Phase 001 replay fixtures must exist before promotion can graduate beyond advisory reports | High | Treat missing replay fixtures as a hard promotion block and keep outputs patch-only. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:183:| Dependency | Phase 003 behavioral suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:185:| Risk | Optimization without behavioral tests could promote broken configs | High | Keep promotion advisory-only until the behavioral suite exists and passes. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:205:- Advisory-only promotion must be the default behavior until the prerequisite replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:222:- A candidate improves replay score before behavioral suites exist. The optimizer must emit only an advisory report or patch artifact and refuse production promotion.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:234:| **Governance** | High: advisory-only promotion, manifest boundaries, and rollback semantics must stay explicit. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:235:| **Deferred Scope** | Very High: prompt optimization and meta-learning are materially premature until behavioral suites and broader corpus coverage exist. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:247:| Missing behavioral tests would allow broken configs through | Medium | High | Keep promotion advisory-only until those suites exist and pass. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:255:- As a release reviewer, I want every candidate to show baseline comparison, audit reasoning, and explicit advisory-only status until replay and behavioral gates are real.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/iterations/iteration-002.md:22:- **F005**: Session-isolation regression omits the ID-collision path — `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62` — The REQ-024 suite only inserts disjoint node and edge IDs per session (`q-a`/`q-b`, `a-answers-1`/`b-answers-1`) across `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62-91`, so it proves filtered reads on non-overlapping fixtures but never exercises the global-ID overwrite path in `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` and `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376`. The test can stay green while the runtime still corrupts session isolation under shared IDs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:3:description: "Deliver Phase 4a as a deterministic offline config optimizer with advisory-only outputs now, and defer Phase 4b prompt/meta optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:29:| **Storage** | Replay corpus fixtures, audit records, candidate config snapshots, existing deep-loop config files |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:34:This phase now splits into two tracks. Phase 4a is the realistic near-term work: harvest real traces, score them with a rubric, search bounded deterministic config space, replay candidates deterministically, and emit advisory candidate patches with a full audit trail. Phase 4b remains deliberately deferred until replay fixtures, behavioral suites, and multi-family corpus coverage exist for safe prompt and meta-optimization.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:48:- [x] Phase 001 replay fixtures exist for production-grade replay gating.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:49:- [x] Phase 003 behavioral suites exist for non-advisory promotion.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:60:- [x] Promotion gate emits advisory-only outputs until replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:93:  -> record audit trail
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:95:  -> require replay fixtures + behavioral gates before any future production promotion
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:115:- Phase 1 replay fixtures for production-grade replay validation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:127:- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:129:- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:131:- `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:132:- `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:139:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:142:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:143:- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:144:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:151:- Prove promotion stays advisory-only while prerequisite replay fixtures and behavioral suites are still missing.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:161:**Why deferred**: Full prompt optimization, cross-packet meta-learning, and automatic promotion are premature today because the corpus is effectively single-family, the optimizer script tree does not exist yet, and the behavioral replay fixtures are still future work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:164:- Phase 3 behavioral suites must exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:177:- Prove behavioral suites catch regressions before any promotion automation is enabled.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:202:| Phase 001 replay fixtures | Internal | Red | Phase 4a cannot graduate beyond advisory reporting without them. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:205:| Phase 003 behavioral suites | Internal | Red | Phase 4b and any non-advisory promotion remain blocked without them. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:230:  -> audit trail and advisory promotion
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:235:| Corpus builder | Real packet-family traces plus runtime contracts | Replayable corpus fixtures | rubric, replay |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:249:- **Session 4**: finish the advisory-only promotion gate, docs, and replay-oriented verification. If prerequisite fixtures still do not exist, stop at advisory outputs and do not widen scope into Phase 4b.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:33:- [x] CHK-001 [P0] The phase fixes `040` as the required replay corpus and keeps `028` optional while excluding `042` as training input until traces exist. [EVIDENCE: spec.md REQ-001 and REQ-002; implementation-summary.md "Replay Corpus"] [TESTS: optimizer-replay-corpus.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:34:- [x] CHK-002 [P0] The technical approach is explicitly Phase 4a first, with Phase 4b deferred until replay fixtures and behavioral suites exist. [EVIDENCE: spec.md executive summary and purpose; plan.md overview] [TESTS: validate.sh --strict]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:44:- [x] CHK-011 [P0] Advisory-only promotion is the current completed posture and does not over-claim production mutation. [EVIDENCE: implementation-summary.md "Advisory-Only Promotion Gate"; decision-record.md ADR-001] [TESTS: optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:54:- [x] CHK-020 [P0] The phase names dedicated tests for corpus extraction, rubric scoring, search bounds, replay determinism, and promotion gating. [EVIDENCE: spec.md test file list; tasks.md T001-T007] [TESTS: optimizer-replay-corpus.vitest.ts; optimizer-rubric.vitest.ts; optimizer-search.vitest.ts; optimizer-replay-runner.vitest.ts; optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:56:- [x] CHK-022 [P1] Verification includes the advisory promotion guard and blocked future-scope prerequisites. [EVIDENCE: implementation-summary.md "Verification"; decision-record.md ADR-001] [TESTS: optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:65:- [x] CHK-030 [P0] The optimizer refuses to mutate non-tunable contract fields. [EVIDENCE: spec.md REQ-005 and REQ-007; decision-record.md ADR-001] [TESTS: optimizer-search.vitest.ts; optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:66:- [x] CHK-031 [P0] Promotion fails closed until replay fixtures and behavioral suites exist. [EVIDENCE: spec.md REQ-006; implementation-summary.md "Advisory-Only Promotion Gate"] [TESTS: optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:67:- [x] CHK-032 [P1] Older traces without graph or wave metrics are marked unavailable instead of fabricated. [EVIDENCE: spec.md REQ-009 and acceptance scenarios] [TESTS: optimizer-replay-corpus.vitest.ts; optimizer-rubric.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:120:- [x] CHK-110 [P1] Replay work is documented as bounded offline maintenance rather than live runtime overhead. [EVIDENCE: plan.md summary and testing strategy] [TESTS: optimizer-replay-runner.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:121:- [x] CHK-111 [P1] Deterministic replay is treated as the core safety requirement for candidate comparison. [EVIDENCE: implementation-summary.md "Deterministic Replay Runner"; decision-record.md ADR-001] [TESTS: optimizer-replay-runner.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:122:- [x] CHK-112 [P2] Search and replay suites cover the performance-sensitive control surfaces through deterministic comparison tests. [EVIDENCE: tasks.md T003-T005] [TESTS: optimizer-search.vitest.ts; optimizer-replay-runner.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:132:- [x] CHK-121 [P0] Advisory-only promotion is the current deployment gate. [EVIDENCE: spec.md REQ-006 and implementation-summary.md "Advisory-Only Promotion Gate"] [TESTS: optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:133:- [x] CHK-122 [P1] Monitoring and audit expectations are explicit for every optimizer run. [EVIDENCE: implementation-summary.md "Audit Trail"] [TESTS: optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:134:- [x] CHK-123 [P1] Future Phase 4b work is explicitly blocked behind behavioral suites and broader corpus coverage. [EVIDENCE: plan.md and spec.md] [TESTS: validate.sh --strict]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:143:- [x] CHK-130 [P1] Audit trails preserve accepted and rejected candidates. [EVIDENCE: implementation-summary.md "Audit Trail"] [TESTS: optimizer-promote.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:145:- [x] CHK-132 [P2] Missing graph or wave metrics are represented honestly for older traces. [EVIDENCE: spec.md REQ-009 and acceptance scenarios] [TESTS: optimizer-replay-corpus.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/iterations/iteration-008.md:22:- **F013**: Phase 008 implementation summary overclaims REQ-024 closure — `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:59` — The summary says `session-isolation.vitest.ts` validates that concurrent sessions cannot see each other's graph nodes, but the shipped suite only seeds disjoint node and edge IDs (`q-a`/`q-b`, `a-answers-1`/`b-answers-1`) and asserts filtered reads on those non-overlapping fixtures at `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:61-91`. The underlying storage layer still upserts by bare `id` only at `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` and `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376`, so phase 008 only proved session-scoped reads, not shared-ID collision isolation. The implementation summary therefore reports REQ-024 as fully closed on evidence that does not cover the active collision hazard already captured by F004/F005.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/deep-review-findings-registry.json:232:      "description": "The REQ-024 suite only inserts disjoint node and edge IDs per session (`q-a`/`q-b`, `a-answers-1`/`b-answers-1`) across `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62-91`, so it proves filtered reads on non-overlapping fixtures but never exercises the global-ID overwrite path in `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` and `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376`. The test can stay green while the runtime still corrupts session isolation under shared IDs.",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/deep-review-findings-registry.json:292:      "description": "The summary says `session-isolation.vitest.ts` validates that concurrent sessions cannot see each other's graph nodes, but the shipped suite only seeds disjoint node and edge IDs (`q-a`/`q-b`, `a-answers-1`/`b-answers-1`) and asserts filtered reads on those non-overlapping fixtures at `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:61-91`. The underlying storage layer still upserts by bare `id` only at `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` and `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376`, so phase 008 only proved session-scoped reads, not shared-ID collision isolation. The implementation summary therefore reports REQ-024 as fully closed on evidence that does not cover the active collision hazard already captured by F004/F005.",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/review-report.md:69:- **Risk**: the current regression suite proves filtered reads on disjoint fixtures, not isolation under shared-ID collision.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:63:- If the replay fixtures or behavioral suites do not yet exist, keep outputs advisory-only and block any production-promotion task.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:76:| T001 | Completed | REQ-001, REQ-002 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:78:| T003 | Completed | REQ-004 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:95:| T005 | Completed | REQ-008 | `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`; `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:96:| T006 | Completed | REQ-005, REQ-007 | `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-review/references/convergence.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:99:- [x] T005 Build the audit trail for optimization runs, including rejected candidates and advisory patch outputs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:112:| T007 | Completed | REQ-006, REQ-008 | `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:114:- [x] T007 Implement the advisory-only promotion gate that refuses production mutation until replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:122:| T008 | Blocked | REQ-010 | `.opencode/skill/system-spec-kit/scripts/optimizer/prompt-pack-generator.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-prompt-pack.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/prompt-packs/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:124:| T010 | Blocked | REQ-006, REQ-010 | `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:138:- [x] Promotion remains advisory-only unless baseline improvement and prerequisite replay plus behavioral gates both exist and pass.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:3:description: "Phase 4a: offline replay optimizer with deterministic config tuning, advisory promotion gate, and full audit trail. Phase 4b prompt/meta optimization remains deferred."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:35:Deep-loop configs can now be tuned offline against real packet traces without experimenting live in production. Phase 4a delivers a complete compile/evaluate loop: harvest traces, score them with a rubric, search bounded deterministic config space, replay candidates, and emit advisory candidate patches with a full audit trail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:59:The promotion gate refuses production mutation until replay fixtures and behavioral suites exist. All current outputs are advisory-only candidate patches that require human review before any canonical config is changed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:77:| Deterministic `4a` now, `4b` deferred | Safe near-term scope is narrower than originally drafted; prompt/meta optimization needs replay fixtures and behavioral suites first |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/deep-review-strategy.md:269:| 008-further-deep-loop-improvements | Closes 12 research recommendations: contract truth + graph wiring + reducer surfacing + fixtures + closing audit P1 fixes | d504f19ca through c07c9fbcf |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:25:- .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/ (existing test fixtures)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:956:/bin/zsh -lc "printf 'EVAL FILES\\n'; rg --files .opencode/skill/system-spec-kit/mcp_server/lib/eval; printf '\\nFIXTURE FILES\\n'; rg --files .opencode/skill/system-spec-kit/mcp_server/tests/fixtures" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:978:.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:979:.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:980:.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:981:.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:982:.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1101:    70	| T001 | Pending | REQ-001 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1102:    71	| T002 | Pending | REQ-001 | `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1106:    75	- [ ] T002 Add corpus fixtures and tests that prove deterministic normalization.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1120:    89	| T005 | Pending | REQ-003 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1122:    91	| T007 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`; `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1139:   108	| T008 | Pending | REQ-004, REQ-006 | `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1141:   110	| T010 | Pending | REQ-004, REQ-007 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1142:   111	| T011 | Pending | REQ-004, REQ-006, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1200:    29	| **Storage** | Replay corpus fixtures, audit records, candidate config snapshots, existing deep-loop config files |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1205:    34	This phase creates the deep-loop equivalent of an offline compiler: harvest real traces, score them with a rubric, search bounded config space, replay candidates deterministically, and only promote candidates that beat baseline without breaking existing safety nets. The sequence is intentionally conservative so governance and replay fidelity arrive before any config is considered promotable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1217:    46	- [x] Promotion is explicitly gated by existing parity and behavioral suites.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1272:   101	- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1274:   103	- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1276:   105	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1290:   119	- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1292:   121	- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1307:   136	- `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1308:   137	- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1342:   171	| Existing parity and behavioral suites | Internal | Green | Promotion safety would collapse without current gates. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1350:   179	- **Trigger**: Replay fidelity is insufficient, rubric scoring is untrustworthy, or promoted candidates cannot stay within bounded config surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3558:/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json; do echo "===== $f ====="; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3560:===== .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3564:     4	// Shared test fixtures for runtime detection and hook availability tests.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3678:===== .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3682:===== .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json =====
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3965:.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:61:  /** shadow rank - production rank (negative = promoted in shadow) */
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:4672:   139	[Paths definitively eliminated -- not just unproductive this iteration, but proven to be fundamentally unviable. These should be promoted to strategy.md "Exhausted Approaches" if not already there.]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6552:    53	The current deep-loop stack is functional, but it still treats "converged" as a mostly inferred state instead of a strongly explained runtime truth. Deep research and deep review already have JSONL state, dashboards, and reducer/parity coverage, yet the consolidated research shows clear gaps around stop-reason taxonomy, legal done gates, resume/start-from behavior, research claim verification, audit trails, richer dashboards, behavior-first test coverage, and large-run coordination.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6648:   149	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6665:   166	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6815:    95	  -> add replay corpus, thin end-to-end harnesses, reducer/schema extensions, and integration fixtures early
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6894:   174	- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6896:   176	- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6902:   182	**Why third**: Once the substrate is durable and observable, we can safely layer the trust surfaces that decide what evidence is promoted, what convergence means semantically, and which sections stay machine-owned.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6927:   207	- Ledger fixtures prove `verified`, `contradicted`, and `unresolved` claims render into synthesis metadata with downgrade conditions and provenance.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6928:   208	- Semantic convergence fixtures assert novelty, contradiction density, and citation overlap participate in typed stop-decision traces instead of scalar-only thresholds.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7483:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:3:description: "Define an offline replay and optimization loop that scores historical deep-loop runs, searches for better configurations, and promotes only replay-verified improvements into production."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7486:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:22:Phase 004 builds the offline compile/evaluate loop for deep research and deep review. It uses historical packet traces to score real behavior, search for better thresholds and prompts, replay those candidates deterministically, and promote only the candidates that improve baseline outcomes without breaking existing parity and behavioral gates.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7490:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:55:- Deterministic replay runner and promotion gate with full audit trail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7492:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:69:Define an offline replay optimizer that learns from real packet families, scores run quality against a shared rubric, searches for better configurations, and only promotes configurations that beat baseline behavior under deterministic replay plus existing parity and behavioral tests.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7496:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:97:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7497:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:100:| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7498:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:101:| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and enforce promotion gates. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7501:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:108:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7503:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:111:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7504:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:112:| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify promotion gating, rollback behavior, and audit output. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7505:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:113:| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures and optimization-result snapshots. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7509:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:135:| REQ-006 | Every optimization run MUST emit an audit trail that records what was tried, what improved, what regressed, and why a candidate was accepted or rejected. | Audit output exists for every run, including failed searches and rejected promotions, and captures both candidate settings and evaluation outcomes. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7527:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:239:- As a release reviewer, I want every promoted candidate to show baseline comparison, audit reasoning, and passing test gates so promotion feels safe.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7544:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:95:  -> add replay corpus, thin end-to-end harnesses, reducer/schema extensions, and integration fixtures early
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7551:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:174:- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7552:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:176:- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7553:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:207:- Ledger fixtures prove `verified`, `contradicted`, and `unresolved` claims render into synthesis metadata with downgrade conditions and provenance.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7554:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:208:- Semantic convergence fixtures assert novelty, contradiction density, and citation overlap participate in typed stop-decision traces instead of scalar-only thresholds.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7561:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:222:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7562:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:223:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7563:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:224:- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042/`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7579:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:298:| Integration | Auto and confirm YAML flows across resume/blocked-stop/optional-mode scenarios | Workflow fixtures plus targeted `pnpm vitest` integration cases added in this packet's implementation phase |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7619:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:70:| T001 | Pending | REQ-001 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7620:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:71:| T002 | Pending | REQ-001 | `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7622:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:75:- [ ] T002 Add corpus fixtures and tests that prove deterministic normalization.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7623:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:89:| T005 | Pending | REQ-003 | `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7624:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:91:| T007 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`; `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7626:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:111:| T011 | Pending | REQ-004, REQ-006, REQ-007 | `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8268:I’m at the point where the remaining questions are mostly feasibility and reuse. I’m doing one last pass to verify what’s actually missing today: whether the planned behavioral suites and optimizer scripts already exist in any form, or whether Phase 4 is truly starting from zero on those surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8270:/bin/zsh -lc 'for p in .opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028 .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040 .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042 .opencode/skill/system-spec-kit/scripts/optimizer; do if [ -e "$p" ]; then echo "EXISTS $p"; else echo "MISSING $p"; fi; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8274:MISSING .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8275:MISSING .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8276:MISSING .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8889:- The broader behavioral suites and packet replay fixtures are still only planned in `042`, not established today [042 plan.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md#L218), [042 plan.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md#L229), [042 plan.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md#L297).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8923:- Keep promotion advisory-only until replay fixtures and behavioral suites actually exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8926:- Realistic now: corpus builder for `040`, deterministic replay runner, rubric engine, random-search baseline, audit trail, and patch-style candidate reports.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8927:- Premature now: full prompt optimization, cross-packet meta-learning, and automatic config promotion. The corpus is effectively single-family, the optimizer script tree does not exist yet, and the planned behavioral replay fixtures are still future packet work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8930:- Add a hard prerequisite: no production promotion until the planned replay fixtures and behavioral suites from packet `042` Phase 3 exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8995:- The broader behavioral suites and packet replay fixtures are still only planned in `042`, not established today [042 plan.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md#L218), [042 plan.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md#L229), [042 plan.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md#L297).
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:9029:- Keep promotion advisory-only until replay fixtures and behavioral suites actually exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:9032:- Realistic now: corpus builder for `040`, deterministic replay runner, rubric engine, random-search baseline, audit trail, and patch-style candidate reports.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:9033:- Premature now: full prompt optimization, cross-packet meta-learning, and automatic config promotion. The corpus is effectively single-family, the optimizer script tree does not exist yet, and the planned behavioral replay fixtures are still future packet work.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:9036:- Add a hard prerequisite: no production promotion until the planned replay fixtures and behavioral suites from packet `042` Phase 3 exist.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
    11	const { replayRun } = require('./replay-runner.cjs');
    12	const { scoreRun } = require('./rubric.cjs');
    13	
    14	/* ---------------------------------------------------------------
    15	   1. CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	/**
    19	 * Default parameter space for numeric thresholds.
    20	 * Each entry defines min, max, and step for a tunable field.
    21	 * @type {Readonly<Record<string, { min: number; max: number; step: number }>>}
    22	 */
    23	const DEFAULT_PARAM_SPACE = Object.freeze({
    24	  convergenceThreshold: { min: 0.01, max: 0.20, step: 0.01 },
    25	  stuckThreshold: { min: 1, max: 5, step: 1 },
    26	  noProgressThreshold: { min: 0.01, max: 0.15, step: 0.01 },
    27	  compositeStopScore: { min: 0.40, max: 0.80, step: 0.05 },
    28	  maxIterations: { min: 3, max: 20, step: 1 },
    29	});
    30	
    31	/* ---------------------------------------------------------------
    32	   2. PARAMETER SAMPLING
    33	----------------------------------------------------------------*/
    34	
    35	/**
    36	 * Deterministic pseudo-random number generator (mulberry32).
    37	 * Produces repeatable sequences given the same seed.
    38	 *
    39	 * @param {number} seed
    40	 * @returns {() => number} A function that returns the next random value in [0, 1).
    41	 */
    42	function createRNG(seed) {
    43	  if (typeof seed !== 'number' || !Number.isFinite(seed)) seed = 42;
    44	  let state = seed | 0;
    45	  return function () {
    46	    state = (state + 0x6D2B79F5) | 0;
    47	    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    48	    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    49	    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    50	  };
    51	}
    52	
    53	/**
    54	 * Sample a random config from the parameter space.
    55	 *
    56	 * @param {Record<string, { min: number; max: number; step: number }>} paramSpace
    57	 * @param {() => number} rng - Random number generator.
    58	 * @returns {Record<string, number>}
    59	 */
    60	function sampleConfig(paramSpace, rng) {
    61	  if (!paramSpace || typeof paramSpace !== 'object' || typeof rng !== 'function') return {};
    62	  const config = {};
    63	
    64	  for (const [name, bounds] of Object.entries(paramSpace)) {
    65	    const range = bounds.max - bounds.min;
    66	    const steps = Math.round(range / bounds.step);
    67	    const stepIndex = Math.floor(rng() * (steps + 1));
    68	    const value = bounds.min + stepIndex * bounds.step;
    69	
    70	    // Round to avoid floating point drift
    71	    const decimals = countDecimals(bounds.step);
    72	    config[name] = Number(value.toFixed(decimals));
    73	  }
    74	
    75	  return config;
    76	}
    77	
    78	/**
    79	 * Count decimal places in a number.
    80	 * @param {number} n
    81	 * @returns {number}
    82	 */
    83	function countDecimals(n) {
    84	  if (typeof n !== 'number' || !Number.isFinite(n)) return 0;
    85	  const str = n.toString();
    86	  const dotIndex = str.indexOf('.');
    87	  return dotIndex < 0 ? 0 : str.length - dotIndex - 1;
    88	}
    89	
    90	/* ---------------------------------------------------------------
    91	   3. AUDIT TRAIL
    92	----------------------------------------------------------------*/
    93	
    94	/**
    95	 * Record a candidate to the audit trail.
    96	 *
    97	 * @param {object} candidate - The candidate config.
    98	 * @param {object} score - The rubric score result.
    99	 * @param {boolean} accepted - Whether the candidate was accepted.
   100	 * @param {object} [comparison] - Optional comparison details.
   101	 * @param {object} [options] - Additional options.
   102	 * @param {string} [options.timestamp] - Override timestamp for deterministic replay. Defaults to current time.
   103	 * @returns {object} An audit record.
   104	 */
   105	function recordCandidate(candidate, score, accepted, comparison, options) {
   106	  if (!score || typeof score !== 'object') {
   107	    score = { composite: 0, perDimension: {}, unavailableDimensions: [] };
   108	  }
   109	  const opts = options || {};
   110	  return {
   111	    timestamp: opts.timestamp || new Date().toISOString(),
   112	    candidate,
   113	    score: {
   114	      composite: score.composite,
   115	      perDimension: score.perDimension,
   116	      unavailableDimensions: score.unavailableDimensions,
   117	    },
   118	    accepted,
   119	    comparison: comparison || null,
   120	    reason: accepted
   121	      ? 'Candidate improved composite score without regressions'
   122	      : comparison && comparison.regressions && comparison.regressions.length > 0
   123	        ? `Rejected: ${comparison.regressions.join('; ')}`
   124	        : 'Rejected: no improvement over baseline',
   125	  };
   126	}
   127	
   128	/* ---------------------------------------------------------------
   129	   4. RANDOM SEARCH
   130	----------------------------------------------------------------*/
   131	
   132	/**
   133	 * Run random search over the config space, evaluating each
   134	 * candidate against the corpus using replay and rubric scoring.
   135	 *
   136	 * @param {object[]} corpus - Array of corpus entries.
   137	 * @param {object} rubric - A rubric from defineRubric().
   138	 * @param {Record<string, { min: number; max: number; step: number }>} [paramSpace] - Parameter space definition.
   139	 * @param {number} [iterations=20] - Number of random candidates to try.
   140	 * @param {object} [options={}] - Additional options.
   141	 * @param {number} [options.seed=42] - RNG seed for reproducibility.
   142	 * @param {object} [options.baselineConfig] - Baseline config for comparison.
   143	 * @returns {{ bestCandidate: object|null; bestScore: object|null; auditTrail: object[]; baselineScore: object|null; iterations: number }}
   144	 */
   145	function randomSearch(corpus, rubric, paramSpace, iterations, options) {
   146	  if (!Array.isArray(corpus) || !rubric || typeof rubric !== 'object') {
   147	    return {
   148	      bestCandidate: null,
   149	      bestScore: null,
   150	      auditTrail: [],
   151	      baselineScore: null,
   152	      iterations: 0,
   153	    };
   154	  }
   155	  const opts = options || {};
   156	  const space = paramSpace || DEFAULT_PARAM_SPACE;
   157	  const maxIter = typeof iterations === 'number' && iterations > 0 ? iterations : 20;
   158	  const seed = opts.seed ?? 42;
   159	  const rng = createRNG(seed);
   160	
   161	  const auditTrail = [];
   162	  let bestCandidate = null;
   163	  let bestScore = null;
   164	  let baselineScore = null;
   165	
   166	  // Compute baseline if provided
   167	  if (opts.baselineConfig) {
   168	    const baselineResults = evaluateConfig(corpus, opts.baselineConfig, rubric);
   169	    baselineScore = baselineResults;
   170	    // Initialize best to baseline so first candidate must beat it
   171	    bestScore = baselineResults;
   172	    bestCandidate = opts.baselineConfig;
   173	  }
   174	
   175	  for (let i = 0; i < maxIter; i++) {
   176	    const candidateConfig = sampleConfig(space, rng);
   177	    const candidateResults = evaluateConfig(corpus, candidateConfig, rubric);
   178	
   179	    let accepted = false;
   180	    let comparison = null;
   181	
   182	    if (bestScore === null) {
   183	      // First candidate is accepted as initial best only when no baseline was provided
   184	      accepted = true;
   185	      bestCandidate = candidateConfig;
   186	      bestScore = candidateResults;
   187	    } else if (candidateResults.composite > bestScore.composite) {
   188	      // Check for regressions against baseline if available
   189	      if (baselineScore) {
   190	        comparison = compareScores(baselineScore, candidateResults);
   191	        // Only accept if no critical regressions
   192	        if (comparison.regressions.length === 0) {
   193	          accepted = true;
   194	          bestCandidate = candidateConfig;
   195	          bestScore = candidateResults;
   196	        }
   197	      } else {
   198	        comparison = compareScores(bestScore, candidateResults);
   199	        accepted = true;
   200	        bestCandidate = candidateConfig;
   201	        bestScore = candidateResults;
   202	      }
   203	    } else {
   204	      comparison = compareScores(bestScore || baselineScore, candidateResults);
   205	    }
   206	
   207	    auditTrail.push(
   208	      recordCandidate(candidateConfig, candidateResults, accepted, comparison, { timestamp: opts.timestamp }),
   209	    );
   210	  }
   211	
   212	  return {
   213	    bestCandidate,
   214	    bestScore,
   215	    auditTrail,
   216	    baselineScore,
   217	    iterations: maxIter,
   218	  };
   219	}
   220	
   221	/**
   222	 * Evaluate a config against the full corpus.
   223	 * Averages rubric scores across all corpus entries.
   224	 *
   225	 * @param {object[]} corpus - Corpus entries.
   226	 * @param {object} config - Config to evaluate.
   227	 * @param {object} rubric - Rubric for scoring.
   228	 * @returns {object} Aggregated score result.
   229	 */
   230	function evaluateConfig(corpus, config, rubric) {
   231	  if (!Array.isArray(corpus) || corpus.length === 0 || !config || typeof config !== 'object' || !rubric || typeof rubric !== 'object') {
   232	    return { composite: 0, perDimension: {}, unavailableDimensions: [] };
   233	  }
   234	
   235	  const scores = corpus.map((entry) => {
   236	    const replayResults = replayRun(entry, config);
   237	    return scoreRun(rubric, replayResults);
   238	  });
   239	
   240	  // Average across corpus entries
   241	  const avgComposite =
   242	    scores.reduce((sum, s) => sum + s.composite, 0) / scores.length;
   243	
   244	  // Average per-dimension scores
   245	  const perDimension = {};
   246	  const allDimensionNames = new Set();
   247	  for (const s of scores) {
   248	    for (const name of Object.keys(s.perDimension)) {
   249	      allDimensionNames.add(name);
   250	    }
   251	  }
   252	
   253	  for (const name of allDimensionNames) {
   254	    const dimScores = scores
   255	      .map((s) => s.perDimension[name])
   256	      .filter((d) => d && d.available);
   257	
   258	    if (dimScores.length === 0) {
   259	      perDimension[name] = { score: null, weight: 0, weighted: 0, available: false };
   260	    } else {
   261	      const avgScore = dimScores.reduce((sum, d) => sum + d.score, 0) / dimScores.length;
   262	      const weight = dimScores[0].weight;
   263	      perDimension[name] = {
   264	        score: avgScore,
   265	        weight,
   266	        weighted: avgScore * weight,
   267	        available: true,
   268	      };
   269	    }
   270	  }
   271	
   272	  const unavailableDimensions = [...allDimensionNames].filter(
   273	    (name) => perDimension[name] && !perDimension[name].available,
   274	  );
   275	
   276	  return { composite: avgComposite, perDimension, unavailableDimensions };
   277	}
   278	
   279	/**
   280	 * Compare two score results for improvements and regressions.
   281	 *
   282	 * @param {object} baseline - Baseline score.
   283	 * @param {object} candidate - Candidate score.
   284	 * @returns {{ improvements: string[]; regressions: string[] }}
   285	 */
   286	function compareScores(baseline, candidate) {
   287	  if (!baseline || typeof baseline !== 'object' || !candidate || typeof candidate !== 'object') {
   288	    return { improvements: [], regressions: ['Missing baseline or candidate score'] };
   289	  }
   290	  const improvements = [];
   291	  const regressions = [];
   292	
   293	  if (candidate.composite > baseline.composite) {
   294	    improvements.push(
   295	      `Composite improved: ${baseline.composite.toFixed(3)} -> ${candidate.composite.toFixed(3)}`,
   296	    );
   297	  } else if (candidate.composite < baseline.composite) {
   298	    regressions.push(
   299	      `Composite regressed: ${baseline.composite.toFixed(3)} -> ${candidate.composite.toFixed(3)}`,
   300	    );
   301	  }
   302	
   303	  // Check per-dimension regressions
   304	  for (const [name, candidateDim] of Object.entries(candidate.perDimension)) {
   305	    const baselineDim = baseline.perDimension[name];
   306	    if (!baselineDim || !baselineDim.available || !candidateDim.available) continue;
   307	
   308	    if (candidateDim.score < baselineDim.score - 0.05) {
   309	      regressions.push(
   310	        `${name} regressed: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   311	      );
   312	    } else if (candidateDim.score > baselineDim.score + 0.05) {
   313	      improvements.push(
   314	        `${name} improved: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   315	      );
   316	    }
   317	  }
   318	
   319	  return { improvements, regressions };
   320	}
   321	
   322	/* ---------------------------------------------------------------
   323	   5. EXPORTS
   324	----------------------------------------------------------------*/
   325	
   326	module.exports = {
   327	  DEFAULT_PARAM_SPACE,
   328	  createRNG,
   329	  sampleConfig,
   330	  recordCandidate,
   331	  randomSearch,
   332	  evaluateConfig,
   333	  compareScores,
   334	  countDecimals,
   335	};

 succeeded in 0ms:
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
    39	/* ---------------------------------------------------------------
    40	   2. PREREQUISITE CHECKING
    41	----------------------------------------------------------------*/
    42	
    43	/**
    44	 * Check whether production promotion prerequisites exist.
    45	 * Until both replay fixtures and behavioral suites exist,
    46	 * promotion is advisory-only.
    47	 *
    48	 * @param {object} [context={}] - Context for checking prerequisites.
    49	 * @param {boolean} [context.replayFixturesExist=false] - Whether Phase 1 replay fixtures exist.
    50	 * @param {boolean} [context.behavioralSuitesExist=false] - Whether Phase 3 behavioral suites exist.
    51	 * @returns {{ allMet: boolean; results: Record<string, boolean>; missing: string[] }}
    52	 */
    53	function checkPrerequisites(context) {
    54	  const ctx = context || {};
    55	
    56	  const results = {
    57	    replayFixturesExist: !!ctx.replayFixturesExist,
    58	    behavioralSuitesExist: !!ctx.behavioralSuitesExist,
    59	  };
    60	
    61	  const missing = PROMOTION_PREREQUISITES.filter((p) => !results[p]);
    62	  const allMet = missing.length === 0;
    63	
    64	  return { allMet, results, missing };
    65	}
    66	
    67	/* ---------------------------------------------------------------
    68	   3. MANIFEST BOUNDARY CHECKING
    69	----------------------------------------------------------------*/
    70	
    71	/**
    72	 * Check whether a candidate config only touches tunable fields
    73	 * (not locked contract fields), and validate value types and ranges
    74	 * against the manifest definitions.
    75	 *
    76	 * @param {object} candidate - The candidate config.
    77	 * @param {object} manifest - The optimizer manifest.
    78	 * @returns {{ valid: boolean; violations: string[] }}
    79	 */
    80	function checkManifestBoundary(candidate, manifest) {
    81	  if (!candidate || typeof candidate !== 'object' || !manifest || typeof manifest !== 'object') {
    82	    return { valid: false, violations: ['Candidate and manifest objects are required'] };
    83	  }
    84	  const violations = [];
    85	  const tunableFieldMap = new Map();
    86	  for (const f of manifest.tunableFields || []) {
    87	    const name = f.name || f;
    88	    tunableFieldMap.set(name, f);
    89	  }
    90	  const lockedFields = new Set(
    91	    (manifest.lockedFields || []).map((f) => f.name || f),
    92	  );
    93	
    94	  for (const [field, value] of Object.entries(candidate)) {
    95	    if (lockedFields.has(field)) {
    96	      violations.push(`Field "${field}" is a locked contract field and cannot be modified by the optimizer`);
    97	    } else if (!tunableFieldMap.has(field)) {
    98	      violations.push(`Field "${field}" is not listed as tunable in the optimizer manifest`);
    99	    } else {
   100	      // Validate type and range against manifest definition
   101	      const def = tunableFieldMap.get(field);
   102	      if (def && typeof def === 'object') {
   103	        // Type validation
   104	        if (def.type === 'number' || def.type === 'integer') {
   105	          if (typeof value !== 'number') {
   106	            violations.push(`Field "${field}" must be a ${def.type}, got ${typeof value}`);
   107	          } else if (def.type === 'integer' && !Number.isInteger(value)) {
   108	            violations.push(`Field "${field}" must be an integer, got ${value}`);
   109	          }
   110	        }
   111	        // Range validation
   112	        if (def.range && typeof value === 'number') {
   113	          if (def.range.min !== undefined && value < def.range.min) {
   114	            violations.push(`Field "${field}" value ${value} is below manifest minimum ${def.range.min}`);
   115	          }
   116	          if (def.range.max !== undefined && value > def.range.max) {
   117	            violations.push(`Field "${field}" value ${value} is above manifest maximum ${def.range.max}`);
   118	          }
   119	        }
   120	      }
   121	    }
   122	  }
   123	
   124	  return {
   125	    valid: violations.length === 0,
   126	    violations,
   127	  };
   128	}
   129	
   130	/* ---------------------------------------------------------------
   131	   4. CANDIDATE EVALUATION
   132	----------------------------------------------------------------*/
   133	
   134	/**
   135	 * Evaluate a candidate against the baseline score.
   136	 *
   137	 * @param {object} candidate - The candidate config + score.
   138	 * @param {object} candidate.config - The config values.
   139	 * @param {object} candidate.score - The rubric score result.
   140	 * @param {object} baselineScore - The baseline rubric score result.
   141	 * @param {object} [options={}] - Additional options.
   142	 * @param {object} [options.manifest] - Optimizer manifest for boundary checking.
   143	 * @returns {{ decision: string; improved: boolean; regressions: string[]; improvements: string[]; manifestCheck: object|null; prerequisiteCheck: object; advisoryOnly: boolean }}
   144	 */
   145	function evaluateCandidate(candidate, baselineScore, options) {
   146	  if (!candidate || typeof candidate !== 'object' || !candidate.score || !baselineScore || typeof baselineScore !== 'object') {
   147	    return {
   148	      decision: PROMOTION_DECISIONS.BLOCKED,
   149	      improved: false,
   150	      regressions: ['Candidate and baselineScore are required'],
   151	      improvements: [],
   152	      manifestCheck: null,
   153	      prerequisiteCheck: checkPrerequisites(),
   154	      advisoryOnly: true,
   155	    };
   156	  }
   157	  const opts = options || {};
   158	
   159	  // Always check prerequisites
   160	  const prerequisiteCheck = checkPrerequisites(opts.prerequisites || {});
   161	  // Manifest governance: promotionMode is advisory-only and autoPromotionAllowed is false.
   162	  // advisoryOnly is ALWAYS true regardless of prerequisite state.
   163	  const advisoryOnly = true;
   164	
   165	  // Check manifest boundaries if manifest provided
   166	  let manifestCheck = null;
   167	  if (opts.manifest) {
   168	    manifestCheck = checkManifestBoundary(candidate.config, opts.manifest);
   169	    if (!manifestCheck.valid) {
   170	      return {
   171	        decision: PROMOTION_DECISIONS.BLOCKED,
   172	        improved: false,
   173	        regressions: manifestCheck.violations,
   174	        improvements: [],
   175	        manifestCheck,
   176	        prerequisiteCheck,
   177	        advisoryOnly: true,
   178	      };
   179	    }
   180	  }
   181	
   182	  // Compare scores
   183	  const improvements = [];
   184	  const regressions = [];
   185	
   186	  const candidateComposite = candidate.score.composite;
   187	  const baselineComposite = baselineScore.composite;
   188	
   189	  if (candidateComposite > baselineComposite) {
   190	    improvements.push(
   191	      `Composite score improved: ${baselineComposite.toFixed(3)} -> ${candidateComposite.toFixed(3)}`,
   192	    );
   193	  } else if (candidateComposite < baselineComposite) {
   194	    regressions.push(
   195	      `Composite score regressed: ${baselineComposite.toFixed(3)} -> ${candidateComposite.toFixed(3)}`,
   196	    );
   197	  }
   198	
   199	  // Per-dimension comparison
   200	  if (candidate.score.perDimension && baselineScore.perDimension) {
   201	    for (const [name, candidateDim] of Object.entries(candidate.score.perDimension)) {
   202	      const baselineDim = baselineScore.perDimension[name];
   203	      if (!baselineDim || !baselineDim.available || !candidateDim.available) continue;
   204	
   205	      if (candidateDim.score < baselineDim.score - 0.01) {
   206	        regressions.push(
   207	          `${name} regressed: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   208	        );
   209	      } else if (candidateDim.score > baselineDim.score + 0.01) {
   210	        improvements.push(
   211	          `${name} improved: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
   212	        );
   213	      }
   214	    }
   215	  }
   216	
   217	  const improved = improvements.length > 0 && regressions.length === 0;
   218	
   219	  let decision;
   220	  if (!improved || regressions.length > 0) {
   221	    decision = PROMOTION_DECISIONS.ADVISORY_REJECT;
   222	  } else {
   223	    decision = PROMOTION_DECISIONS.ADVISORY_ACCEPT;
   224	  }
   225	
   226	  return {
   227	    decision,
   228	    improved,
   229	    regressions,
   230	    improvements,
   231	    manifestCheck,
   232	    prerequisiteCheck,
   233	    advisoryOnly,
   234	  };
   235	}
   236	
   237	/* ---------------------------------------------------------------
   238	   5. PROMOTION REPORT
   239	----------------------------------------------------------------*/
   240	
   241	/**
   242	 * Generate an advisory-only promotion report.
   243	 * Never auto-promotes. Always produces a report for human review.
   244	 *
   245	 * @param {object} candidate - The candidate config.
   246	 * @param {object} score - The rubric score result.
   247	 * @param {string} decision - The promotion decision.
   248	 * @param {object} [options={}] - Additional context for the report.
   249	 * @returns {object} A structured promotion report.
   250	 */
   251	function generatePromotionReport(candidate, score, decision, options) {
   252	  if (!score || typeof score !== 'object') {
   253	    score = { composite: 0, perDimension: {}, unavailableDimensions: [] };
   254	  }
   255	  const opts = options || {};
   256	
   257	  const report = {
   258	    reportType: 'advisory-promotion',
   259	    generatedAt: new Date().toISOString(),
   260	    decision,
   261	    advisoryOnly: true,
   262	    autoPromotionAllowed: false,
   263	
   264	    candidate: {
   265	      config: candidate,
   266	      score: {
   267	        composite: score.composite,
   268	        perDimension: score.perDimension,
   269	        unavailableDimensions: score.unavailableDimensions || [],
   270	      },
   271	    },
   272	
   273	    evaluation: {
   274	      improved: opts.improved ?? false,
   275	      improvements: opts.improvements || [],
   276	      regressions: opts.regressions || [],
   277	    },
   278	
   279	    prerequisites: opts.prerequisiteCheck || {
   280	      allMet: false,
   281	      results: {
   282	        replayFixturesExist: false,
   283	        behavioralSuitesExist: false,
   284	      },
   285	      missing: ['replayFixturesExist', 'behavioralSuitesExist'],
   286	    },
   287	
   288	    manifestBoundary: opts.manifestCheck || null,
   289	
   290	    recommendation:
   291	      decision === PROMOTION_DECISIONS.ADVISORY_ACCEPT
   292	        ? 'Candidate shows improvement in replay. Review the per-dimension breakdown and audit trail before manual promotion.'
   293	        : decision === PROMOTION_DECISIONS.BLOCKED
   294	          ? 'Candidate touches locked or non-tunable fields. Promotion is blocked.'
   295	          : 'Candidate does not improve over baseline or has regressions. Not recommended for promotion.',
   296	
   297	    humanReviewRequired: true,
   298	    nextSteps: [
   299	      'Review per-dimension score breakdown',
   300	      'Inspect audit trail for rejected candidates',
   301	      'Verify no locked fields were modified',
   302	      ...(opts.prerequisiteCheck && !opts.prerequisiteCheck.allMet
   303	        ? ['Complete prerequisite replay fixtures and behavioral suites before production promotion']
   304	        : []),
   305	    ],
   306	  };
   307	
   308	  return report;
   309	}
   310	
   311	/**
   312	 * Save a promotion report to disk.
   313	 *
   314	 * @param {object} report - The promotion report.
   315	 * @param {string} outputPath - File path for the output.
   316	 */
   317	function savePromotionReport(report, outputPath) {
   318	  if (!report || typeof report !== 'object' || typeof outputPath !== 'string' || !outputPath) {
   319	    return false;
   320	  }
   321	  const dir = path.dirname(outputPath);
   322	  if (!fs.existsSync(dir)) {
   323	    fs.mkdirSync(dir, { recursive: true });
   324	  }
   325	  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
   326	  return true;
   327	}
   328	
   329	/* ---------------------------------------------------------------
   330	   6. EXPORTS
   331	----------------------------------------------------------------*/
   332	
   333	module.exports = {
   334	  PROMOTION_PREREQUISITES,
   335	  PROMOTION_DECISIONS,
   336	  checkPrerequisites,
   337	  checkManifestBoundary,
   338	  evaluateCandidate,
   339	  generatePromotionReport,
   340	  savePromotionReport,
   341	};

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "$schema": "optimizer-manifest/v1",
  "description": "Canonical manifest declaring which fields are tunable by the offline loop optimizer, which are locked runtime contracts, and which are deferred prompt-pack entrypoints.",
  "version": "1.0.0",
  "lastUpdated": "2026-04-10",

  "tunableFields": [
    {
      "name": "convergenceThreshold",
      "type": "number",
      "description": "General convergence sensitivity threshold. Lower values require more convergence before stopping.",
      "range": { "min": 0.01, "max": 0.20 },
      "products": ["deep-research", "deep-review"],
      "configPaths": [
        ".opencode/skill/sk-deep-research/assets/deep_research_config.json",
        ".opencode/skill/sk-deep-review/assets/deep_review_config.json"
      ]
    },
    {
      "name": "stuckThreshold",
      "type": "integer",
      "description": "Number of consecutive no-progress iterations before stuck recovery is triggered.",
      "range": { "min": 1, "max": 5 },
      "products": ["deep-research", "deep-review"],
      "configPaths": [
        ".opencode/skill/sk-deep-research/assets/deep_research_config.json",
        ".opencode/skill/sk-deep-review/assets/deep_review_config.json"
      ]
    },
    {
      "name": "maxIterations",
      "type": "integer",
      "description": "Hard ceiling on loop iterations. Controls maximum compute budget.",
      "range": { "min": 3, "max": 20 },
      "products": ["deep-research", "deep-review"],
      "configPaths": [
        ".opencode/skill/sk-deep-research/assets/deep_research_config.json",
        ".opencode/skill/sk-deep-review/assets/deep_review_config.json"
      ]
    },
    {
      "name": "noProgressThreshold",
      "type": "number",
      "description": "New-info ratio below which an iteration is classified as no-progress.",
      "range": { "min": 0.01, "max": 0.15 },
      "products": ["deep-research", "deep-review"],
      "configPaths": []
    },
    {
      "name": "compositeStopScore",
      "type": "number",
      "description": "Weighted stop score needed before guard evaluation passes.",
      "range": { "min": 0.40, "max": 0.80 },
      "products": ["deep-review"],
      "configPaths": []
    }
  ],

  "lockedFields": [
    {
      "name": "type",
      "reason": "JSONL schema contract — record type discriminator must not change.",
      "contract": "JSONL schema"
    },
    {
      "name": "stopReason",
      "reason": "Stop-reason enum is a runtime contract shared across all consumers.",
      "contract": "convergence contract"
    },
    {
      "name": "legalStop",
      "reason": "Legal-stop record structure is a runtime contract used by reducers and dashboards.",
      "contract": "convergence contract"
    },
    {
      "name": "lineageMode",
      "reason": "Lineage semantics (new/resume/fork/restart) are lifecycle contracts.",
      "contract": "session lifecycle"
    },
    {
      "name": "fileProtection",
      "reason": "File protection policies are governance contracts, not tunable parameters.",
      "contract": "file governance"
    },
    {
      "name": "reducer",
      "reason": "Reducer configuration defines the state-management contract.",
      "contract": "reducer contract"
    },
    {
      "name": "sessionId",
      "reason": "Session identity is a lifecycle contract.",
      "contract": "session lifecycle"
    },
    {
      "name": "mode",
      "reason": "Product mode (research/review) is an identity field, not a tunable.",
      "contract": "product identity"
    },
    {
      "name": "reviewDimensions",
      "reason": "Review dimensions define the product scope, not numeric tuning surface.",
      "contract": "product identity"
    }
  ],

  "deferredPromptPackEntrypoints": [
    {
      "name": "iterationPromptPack",
      "status": "DEFERRED",
      "reason": "Phase 4b — requires behavioral test suite + 2+ corpus families before prompt optimization is safe.",
      "prerequisite": "T008"
    },
    {
      "name": "recoveryPromptPack",
      "status": "DEFERRED",
      "reason": "Phase 4b — recovery strategy prompts must be tested via behavioral suites before optimization.",
      "prerequisite": "T008"
    },
    {
      "name": "synthesisPromptPack",
      "status": "DEFERRED",
      "reason": "Phase 4b — synthesis prompt quality requires end-to-end behavioral validation.",
      "prerequisite": "T008"
    }
  ],

  "governance": {
    "promotionMode": "advisory-only",
    "autoPromotionAllowed": false,
    "autoPromotionPrerequisites": [
      "Phase 1 replay fixtures exist",
      "Phase 3 behavioral suites exist and pass",
      "At least 2 compatible corpus families available"
    ],
    "rollbackPolicy": "All promoted configs must be reversible via the prior baseline config stored in the audit trail."
  }
}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { createRequire } from 'node:module';
     4	import { fileURLToPath } from 'node:url';
     5	
     6	import { describe, expect, it } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    10	const require = createRequire(import.meta.url);
    11	
    12	const replayCorpus = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
    15	)) as {
    16	  PACKET_FAMILIES: Record<string, { role: string; required: boolean; compatibilityGrade: string }>;
    17	  REQUIRED_ENTRY_FIELDS: readonly string[];
    18	  buildCorpus: (
    19	    packetFamily: string,
    20	    options?: { fixturesDir?: string; jsonlContent?: string; sourceRunId?: string; timestamp?: string },
    21	  ) => { corpus: Array<Record<string, any>>; errors: string[]; warnings: string[]; familyInfo: object | null };
    22	  validateCorpusEntry: (entry: object) => { valid: boolean; errors: string[] };
    23	  extractCorpusEntry: (records: object[], packetFamily: string, sourceRunId: string, options?: { timestamp?: string }) => Record<string, any>;
    24	  parseJSONL: (content: string) => { records: object[]; skippedLines: Array<{ lineNumber: number; content: string; error: string }>; totalLines: number };
    25	  saveCorpus: (corpus: object[], outputPath: string) => void;
    26	  loadCorpus: (corpusPath: string) => object[];
    27	};
    28	
    29	const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');
    30	const REPLAY_FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-replay');
    31	
    32	describe('Replay Corpus Builder (T001)', () => {
    33	  describe('PACKET_FAMILIES', () => {
    34	    it('should define 040 as the required primary corpus', () => {
    35	      const family = replayCorpus.PACKET_FAMILIES['040'];
    36	      expect(family).toBeDefined();
    37	      expect(family.role).toBe('primary');
    38	      expect(family.required).toBe(true);
    39	      expect(family.compatibilityGrade).toBe('full');
    40	    });
    41	
    42	    it('should define 028 as an optional holdout', () => {
    43	      const family = replayCorpus.PACKET_FAMILIES['028'];
    44	      expect(family).toBeDefined();
    45	      expect(family.role).toBe('holdout');
    46	      expect(family.required).toBe(false);
    47	      expect(family.compatibilityGrade).toBe('legacy');
    48	    });
    49	
    50	    it('should define 042 as excluded', () => {
    51	      const family = replayCorpus.PACKET_FAMILIES['042'];
    52	      expect(family).toBeDefined();
    53	      expect(family.role).toBe('excluded');
    54	      expect(family.required).toBe(false);
    55	      expect(family.compatibilityGrade).toBe('none');
    56	    });
    57	  });
    58	
    59	  describe('parseJSONL', () => {
    60	    it('should parse valid JSONL content', () => {
    61	      const content = '{"type":"config","topic":"test"}\n{"type":"iteration","run":1}\n';
    62	      const result = replayCorpus.parseJSONL(content);
    63	      expect(result.records).toHaveLength(2);
    64	      expect(result.records[0]).toEqual({ type: 'config', topic: 'test' });
    65	      expect(result.records[1]).toEqual({ type: 'iteration', run: 1 });
    66	      expect(result.skippedLines).toHaveLength(0);
    67	      expect(result.totalLines).toBe(2);
    68	    });
    69	
    70	    it('should skip blank lines', () => {
    71	      const content = '{"type":"config"}\n\n{"type":"iteration"}\n\n';
    72	      const result = replayCorpus.parseJSONL(content);
    73	      expect(result.records).toHaveLength(2);
    74	      expect(result.totalLines).toBe(2);
    75	    });
    76	
    77	    it('should track malformed lines with metadata (P1-4)', () => {
    78	      const content = '{"type":"config"}\nnot-json\n{"type":"iteration"}\n';
    79	      const result = replayCorpus.parseJSONL(content);
    80	      expect(result.records).toHaveLength(2);
    81	      expect(result.skippedLines).toHaveLength(1);
    82	      expect(result.skippedLines[0].lineNumber).toBe(2);
    83	      expect(result.skippedLines[0].content).toBe('not-json');
    84	      expect(result.skippedLines[0].error).toBeDefined();
    85	      expect(result.totalLines).toBe(3);
    86	    });
    87	
    88	    it('should truncate long malformed line content to 200 chars (P1-4)', () => {
    89	      const longLine = 'x'.repeat(300);
    90	      const content = `{"type":"config"}\n${longLine}\n`;
    91	      const result = replayCorpus.parseJSONL(content);
    92	      expect(result.skippedLines).toHaveLength(1);
    93	      expect(result.skippedLines[0].content.length).toBeLessThanOrEqual(203); // 200 + '...'
    94	    });
    95	  });
    96	
    97	  describe('validateCorpusEntry', () => {
    98	    it('should accept a valid entry', () => {
    99	      const entry = {
   100	        id: '040-run-1',
   101	        packetFamily: '040',
   102	        sourceRun: 'run-1',
   103	        config: { maxIterations: 7 },
   104	        iterations: [{ run: 1 }],
   105	        stopOutcome: { stopReason: 'converged' },
   106	      };
   107	      const result = replayCorpus.validateCorpusEntry(entry);
   108	      expect(result.valid).toBe(true);
   109	      expect(result.errors).toHaveLength(0);
   110	    });
   111	
   112	    it('should reject null input', () => {
   113	      const result = replayCorpus.validateCorpusEntry(null as any);
   114	      expect(result.valid).toBe(false);
   115	    });
   116	
   117	    it('should report missing required fields', () => {
   118	      const result = replayCorpus.validateCorpusEntry({});
   119	      expect(result.valid).toBe(false);
   120	      expect(result.errors.length).toBeGreaterThan(0);
   121	      for (const field of replayCorpus.REQUIRED_ENTRY_FIELDS) {
   122	        expect(result.errors.some((e: string) => e.includes(field))).toBe(true);
   123	      }
   124	    });
   125	
   126	    it('should reject packet family 042', () => {
   127	      const entry = {
   128	        id: '042-run-1',
   129	        packetFamily: '042',
   130	        sourceRun: 'run-1',
   131	        config: {},
   132	        iterations: [{ run: 1 }],
   133	        stopOutcome: { stopReason: 'converged' },
   134	      };
   135	      const result = replayCorpus.validateCorpusEntry(entry);
   136	      expect(result.valid).toBe(false);
   137	      expect(result.errors.some((e: string) => e.includes('042'))).toBe(true);
   138	    });
   139	
   140	    it('should reject empty iterations array', () => {
   141	      const entry = {
   142	        id: '040-run-1',
   143	        packetFamily: '040',
   144	        sourceRun: 'run-1',
   145	        config: {},
   146	        iterations: [],
   147	        stopOutcome: { stopReason: 'converged' },
   148	      };
   149	      const result = replayCorpus.validateCorpusEntry(entry);
   150	      expect(result.valid).toBe(false);
   151	      expect(result.errors.some((e: string) => e.includes('empty'))).toBe(true);
   152	    });
   153	  });
   154	
   155	  describe('buildCorpus', () => {
   156	    it('should build corpus from 040 JSONL fixtures', () => {
   157	      const result = replayCorpus.buildCorpus('040', {
   158	        fixturesDir: REPLAY_FIXTURES_DIR,
   159	      });
   160	      expect(result.errors).toHaveLength(0);
   161	      expect(result.corpus).toHaveLength(1);
   162	      expect(result.familyInfo).toBeDefined();
   163	      expect(result.familyInfo!.role).toBe('primary');
   164	    });
   165	
   166	    it('should build corpus from 028 with holdout warning', () => {
   167	      const result = replayCorpus.buildCorpus('028', {
   168	        fixturesDir: REPLAY_FIXTURES_DIR,
   169	      });
   170	      expect(result.errors).toHaveLength(0);
   171	      expect(result.corpus).toHaveLength(1);
   172	      expect(result.warnings.some((w: string) => w.includes('holdout'))).toBe(true);
   173	    });
   174	
   175	    it('should reject 042 corpus building', () => {
   176	      const result = replayCorpus.buildCorpus('042', {
   177	        fixturesDir: REPLAY_FIXTURES_DIR,
   178	      });
   179	      expect(result.errors.length).toBeGreaterThan(0);
   180	      expect(result.errors.some((e: string) => e.includes('042'))).toBe(true);
   181	      expect(result.corpus).toHaveLength(0);
   182	    });
   183	
   184	    it('should reject unknown packet family', () => {
   185	      const result = replayCorpus.buildCorpus('999', {
   186	        fixturesDir: REPLAY_FIXTURES_DIR,
   187	      });
   188	      expect(result.errors.length).toBeGreaterThan(0);
   189	      expect(result.familyInfo).toBeNull();
   190	    });
   191	
   192	    it('should build corpus from raw JSONL content', () => {
   193	      const content = fs.readFileSync(
   194	        path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
   195	        'utf8',
   196	      );
   197	      const result = replayCorpus.buildCorpus('040', {
   198	        jsonlContent: content,
   199	        sourceRunId: 'test-run-1',
   200	      });
   201	      expect(result.errors).toHaveLength(0);
   202	      expect(result.corpus).toHaveLength(1);
   203	      const entry = result.corpus[0] as Record<string, any>;
   204	      expect(entry.id).toBe('040-test-run-1');
   205	    });
   206	
   207	    it('should warn when graph metrics are unavailable (REQ-009)', () => {
   208	      const content = fs.readFileSync(
   209	        path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
   210	        'utf8',
   211	      );
   212	      const result = replayCorpus.buildCorpus('040', {
   213	        jsonlContent: content,
   214	      });
   215	      // Our sample data does not have graphCoverage, so expect warning
   216	      expect(result.warnings.some((w: string) => w.includes('graph metrics unavailable'))).toBe(true);
   217	    });
   218	
   219	    it('should error when no input source is provided', () => {
   220	      const result = replayCorpus.buildCorpus('040', {});
   221	      expect(result.errors.length).toBeGreaterThan(0);
   222	      expect(result.errors.some((e: string) => e.includes('fixturesDir'))).toBe(true);
   223	    });
   224	  });
   225	
   226	  describe('saveCorpus / loadCorpus', () => {
   227	    it('should round-trip corpus through disk', () => {
   228	      const corpus = [
   229	        {
   230	          id: '040-test',
   231	          packetFamily: '040',
   232	          sourceRun: 'test',
   233	          config: { maxIterations: 7 },
   234	          iterations: [{ run: 1 }],
   235	          stopOutcome: { stopReason: 'converged' },
   236	        },
   237	      ];
   238	      const tmpPath = path.join(
   239	        process.env.TMPDIR || '/tmp',
   240	        `corpus-test-${Date.now()}.json`,
   241	      );
   242	
   243	      try {
   244	        replayCorpus.saveCorpus(corpus, tmpPath);
   245	        expect(fs.existsSync(tmpPath)).toBe(true);
   246	        const loaded = replayCorpus.loadCorpus(tmpPath);
   247	        expect(loaded).toEqual(corpus);
   248	      } finally {
   249	        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
   250	      }
   251	    });
   252	
   253	    it('should return an empty corpus for a missing corpus file', () => {
   254	      expect(replayCorpus.loadCorpus('/nonexistent/path.json')).toEqual([]);
   255	    });
   256	  });
   257	
   258	  describe('P1-1: deterministic timestamps', () => {
   259	    it('should use provided timestamp in extractCorpusEntry', () => {
   260	      const records = [
   261	        { type: 'config', maxIterations: 7 },
   262	        { type: 'iteration', run: 1, status: 'complete' },
   263	        { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 1 },
   264	      ];
   265	      const fixedTime = '2026-01-01T00:00:00.000Z';
   266	      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-1', { timestamp: fixedTime });
   267	      expect(entry.metadata.extractedAt).toBe(fixedTime);
   268	    });
   269	
   270	    it('should default to current time when no timestamp override', () => {
   271	      const records = [
   272	        { type: 'config', maxIterations: 7 },
   273	        { type: 'iteration', run: 1, status: 'complete' },
   274	        { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 1 },
   275	      ];
   276	      const before = new Date().toISOString();
   277	      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-1');
   278	      const after = new Date().toISOString();
   279	      expect(entry.metadata.extractedAt >= before).toBe(true);
   280	      expect(entry.metadata.extractedAt <= after).toBe(true);

 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { createRequire } from 'node:module';
     4	import { fileURLToPath } from 'node:url';
     5	
     6	import { describe, expect, it } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    10	const require = createRequire(import.meta.url);
    11	
    12	const search = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs',
    15	)) as {
    16	  DEFAULT_PARAM_SPACE: Record<string, { min: number; max: number; step: number }>;
    17	  createRNG: (seed: number) => () => number;
    18	  sampleConfig: (
    19	    paramSpace: Record<string, { min: number; max: number; step: number }>,
    20	    rng: () => number,
    21	  ) => Record<string, number>;
    22	  recordCandidate: (
    23	    candidate: object,
    24	    score: { composite: number; perDimension: object; unavailableDimensions: string[] },
    25	    accepted: boolean,
    26	    comparison?: object,
    27	    options?: { timestamp?: string },
    28	  ) => Record<string, any>;
    29	  randomSearch: (
    30	    corpus: object[],
    31	    rubric: object,
    32	    paramSpace?: Record<string, { min: number; max: number; step: number }>,
    33	    iterations?: number,
    34	    options?: { seed?: number; baselineConfig?: object },
    35	  ) => {
    36	    bestCandidate: object | null;
    37	    bestScore: object | null;
    38	    auditTrail: Array<Record<string, any>>;
    39	    baselineScore: object | null;
    40	    iterations: number;
    41	  };
    42	  evaluateConfig: (
    43	    corpus: object[],
    44	    config: object,
    45	    rubric: object,
    46	  ) => { composite: number; perDimension: object; unavailableDimensions: string[] };
    47	  compareScores: (
    48	    baseline: { composite: number; perDimension: Record<string, any> },
    49	    candidate: { composite: number; perDimension: Record<string, any> },
    50	  ) => { improvements: string[]; regressions: string[] };
    51	  countDecimals: (n: number) => number;
    52	};
    53	
    54	const replayCorpus = require(path.join(
    55	  WORKSPACE_ROOT,
    56	  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
    57	)) as {
    58	  buildCorpus: (family: string, options: { jsonlContent?: string }) => { corpus: any[] };
    59	};
    60	
    61	const rubricModule = require(path.join(
    62	  WORKSPACE_ROOT,
    63	  '.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs',
    64	)) as {
    65	  defineRubric: (dimensions?: Record<string, number>) => { dimensions: Record<string, number>; totalWeight: number };
    66	};
    67	
    68	const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');
    69	
    70	function loadTestCorpus(): object[] {
    71	  const content = fs.readFileSync(
    72	    path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
    73	    'utf8',
    74	  );
    75	  return replayCorpus.buildCorpus('040', { jsonlContent: content }).corpus;
    76	}
    77	
    78	describe('Random Search Optimizer (T004)', () => {
    79	  describe('createRNG', () => {
    80	    it('should produce deterministic sequences from the same seed', () => {
    81	      const rng1 = search.createRNG(42);
    82	      const rng2 = search.createRNG(42);
    83	
    84	      const seq1 = Array.from({ length: 10 }, () => rng1());
    85	      const seq2 = Array.from({ length: 10 }, () => rng2());
    86	
    87	      expect(seq1).toEqual(seq2);
    88	    });
    89	
    90	    it('should produce different sequences from different seeds', () => {
    91	      const rng1 = search.createRNG(42);
    92	      const rng2 = search.createRNG(99);
    93	
    94	      const v1 = rng1();
    95	      const v2 = rng2();
    96	
    97	      expect(v1).not.toBe(v2);
    98	    });
    99	
   100	    it('should produce values in [0, 1)', () => {
   101	      const rng = search.createRNG(42);
   102	      for (let i = 0; i < 100; i++) {
   103	        const v = rng();
   104	        expect(v).toBeGreaterThanOrEqual(0);
   105	        expect(v).toBeLessThan(1);
   106	      }
   107	    });
   108	  });
   109	
   110	  describe('sampleConfig', () => {
   111	    it('should sample values within parameter bounds', () => {
   112	      const rng = search.createRNG(42);
   113	      const config = search.sampleConfig(search.DEFAULT_PARAM_SPACE, rng);
   114	
   115	      for (const [name, bounds] of Object.entries(search.DEFAULT_PARAM_SPACE)) {
   116	        expect(config[name]).toBeGreaterThanOrEqual(bounds.min);
   117	        expect(config[name]).toBeLessThanOrEqual(bounds.max);
   118	      }
   119	    });
   120	
   121	    it('should produce values at step intervals', () => {
   122	      const rng = search.createRNG(42);
   123	      const space = {
   124	        testParam: { min: 0.0, max: 1.0, step: 0.25 },
   125	      };
   126	
   127	      const config = search.sampleConfig(space, rng);
   128	      const validValues = [0.0, 0.25, 0.5, 0.75, 1.0];
   129	      expect(validValues).toContain(config.testParam);
   130	    });
   131	  });
   132	
   133	  describe('countDecimals', () => {
   134	    it('should count decimal places', () => {
   135	      expect(search.countDecimals(0.01)).toBe(2);
   136	      expect(search.countDecimals(0.1)).toBe(1);
   137	      expect(search.countDecimals(1)).toBe(0);
   138	      expect(search.countDecimals(0.001)).toBe(3);
   139	    });
   140	  });
   141	
   142	  describe('recordCandidate (T005 audit)', () => {
   143	    it('should record accepted candidates', () => {
   144	      const record = search.recordCandidate(
   145	        { convergenceThreshold: 0.05 },
   146	        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
   147	        true,
   148	      ) as Record<string, any>;
   149	
   150	      expect(record.accepted).toBe(true);
   151	      expect(record.candidate).toEqual({ convergenceThreshold: 0.05 });
   152	      expect(record.score.composite).toBe(0.8);
   153	      expect(record.timestamp).toBeDefined();
   154	      expect(record.reason).toContain('improved');
   155	    });
   156	
   157	    it('should record rejected candidates with reason', () => {
   158	      const record = search.recordCandidate(
   159	        { convergenceThreshold: 0.05 },
   160	        { composite: 0.3, perDimension: {}, unavailableDimensions: [] },
   161	        false,
   162	        { regressions: ['Composite regressed'], improvements: [] },
   163	      ) as Record<string, any>;
   164	
   165	      expect(record.accepted).toBe(false);
   166	      expect(record.reason).toContain('Rejected');
   167	    });
   168	
   169	    it('should include comparison details when available', () => {
   170	      const comparison = {
   171	        improvements: ['convergence improved'],
   172	        regressions: ['accuracy regressed'],
   173	      };
   174	      const record = search.recordCandidate(
   175	        { convergenceThreshold: 0.05 },
   176	        { composite: 0.5, perDimension: {}, unavailableDimensions: [] },
   177	        false,
   178	        comparison,
   179	      ) as Record<string, any>;
   180	
   181	      expect(record.comparison).toEqual(comparison);
   182	    });
   183	  });
   184	
   185	  describe('randomSearch', () => {
   186	    it('should complete search and return audit trail (REQ-008)', () => {
   187	      const corpus = loadTestCorpus();
   188	      const testRubric = rubricModule.defineRubric();
   189	      const iterations = 5;
   190	
   191	      const result = search.randomSearch(corpus, testRubric, undefined, iterations, { seed: 42 });
   192	
   193	      expect(result.iterations).toBe(iterations);
   194	      expect(result.auditTrail).toHaveLength(iterations);
   195	      expect(result.bestCandidate).not.toBeNull();
   196	      expect(result.bestScore).not.toBeNull();
   197	    });
   198	
   199	    it('should produce deterministic results from the same seed', () => {
   200	      const corpus = loadTestCorpus();
   201	      const testRubric = rubricModule.defineRubric();
   202	
   203	      const result1 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
   204	      const result2 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
   205	
   206	      expect(result1.bestCandidate).toEqual(result2.bestCandidate);
   207	      expect((result1.bestScore as any).composite).toBe((result2.bestScore as any).composite);
   208	    });
   209	
   210	    it('should record BOTH accepted and rejected candidates (REQ-008)', () => {
   211	      const corpus = loadTestCorpus();
   212	      const testRubric = rubricModule.defineRubric();
   213	
   214	      const result = search.randomSearch(corpus, testRubric, undefined, 10, { seed: 42 });
   215	
   216	      const accepted = result.auditTrail.filter((r) => r.accepted);
   217	      const rejected = result.auditTrail.filter((r) => !r.accepted);
   218	
   219	      // At least the first candidate should be accepted
   220	      expect(accepted.length).toBeGreaterThanOrEqual(1);
   221	      // With 10 iterations, some should be rejected
   222	      expect(result.auditTrail).toHaveLength(10);
   223	      // Total should be 10
   224	      expect(accepted.length + rejected.length).toBe(10);
   225	    });
   226	
   227	    it('should respect bounded numeric parameter space (REQ-007)', () => {
   228	      const corpus = loadTestCorpus();
   229	      const testRubric = rubricModule.defineRubric();
   230	
   231	      const result = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
   232	
   233	      // All candidates in audit trail should have values within bounds
   234	      for (const record of result.auditTrail) {
   235	        const candidate = record.candidate as Record<string, number>;
   236	        for (const [name, bounds] of Object.entries(search.DEFAULT_PARAM_SPACE)) {
   237	          if (candidate[name] !== undefined) {
   238	            expect(candidate[name]).toBeGreaterThanOrEqual(bounds.min);
   239	            expect(candidate[name]).toBeLessThanOrEqual(bounds.max);
   240	          }
   241	        }
   242	      }
   243	    });
   244	
   245	    it('should compute baseline score when baselineConfig is provided', () => {
   246	      const corpus = loadTestCorpus();
   247	      const testRubric = rubricModule.defineRubric();
   248	      const baselineConfig = JSON.parse(
   249	        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
   250	      );
   251	
   252	      const result = search.randomSearch(corpus, testRubric, undefined, 3, {
   253	        seed: 42,
   254	        baselineConfig,
   255	      });
   256	
   257	      expect(result.baselineScore).not.toBeNull();
   258	    });
   259	  });
   260	
   261	  describe('evaluateConfig', () => {
   262	    it('should produce scores for a valid config', () => {
   263	      const corpus = loadTestCorpus();
   264	      const testRubric = rubricModule.defineRubric();
   265	      const config = { convergenceThreshold: 0.05, maxIterations: 7 };
   266	
   267	      const result = search.evaluateConfig(corpus, config, testRubric);
   268	      expect(result.composite).toBeGreaterThanOrEqual(0);
   269	      expect(result.composite).toBeLessThanOrEqual(1);
   270	    });
   271	
   272	    it('should return zero scores for empty corpus', () => {
   273	      const testRubric = rubricModule.defineRubric();
   274	      const result = search.evaluateConfig([], {}, testRubric);
   275	      expect(result.composite).toBe(0);
   276	    });
   277	  });
   278	
   279	  describe('compareScores', () => {
   280	    it('should detect composite improvement', () => {
   281	      const baseline = { composite: 0.5, perDimension: {} };
   282	      const candidate = { composite: 0.8, perDimension: {} };
   283	
   284	      const result = search.compareScores(baseline, candidate);
   285	      expect(result.improvements.some((i: string) => i.includes('Composite improved'))).toBe(true);
   286	    });
   287	
   288	    it('should detect composite regression', () => {
   289	      const baseline = { composite: 0.8, perDimension: {} };
   290	      const candidate = { composite: 0.5, perDimension: {} };
   291	
   292	      const result = search.compareScores(baseline, candidate);
   293	      expect(result.regressions.some((r: string) => r.includes('Composite regressed'))).toBe(true);
   294	    });
   295	
   296	    it('should detect per-dimension regressions', () => {
   297	      const baseline = {
   298	        composite: 0.7,
   299	        perDimension: { findingAccuracy: { score: 0.8, available: true } },
   300	      };
   301	      const candidate = {
   302	        composite: 0.7,
   303	        perDimension: { findingAccuracy: { score: 0.3, available: true } },
   304	      };
   305	
   306	      const result = search.compareScores(baseline, candidate);
   307	      expect(result.regressions.some((r: string) => r.includes('findingAccuracy'))).toBe(true);
   308	    });
   309	  });
   310	
   311	  describe('P1-1: deterministic timestamps in recordCandidate', () => {
   312	    it('should use provided timestamp for deterministic replay', () => {
   313	      const fixedTime = '2026-01-01T00:00:00.000Z';
   314	      const record = search.recordCandidate(
   315	        { convergenceThreshold: 0.05 },
   316	        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
   317	        true,
   318	        undefined,
   319	        { timestamp: fixedTime },
   320	      );

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { createRequire } from 'node:module';
     4	import { fileURLToPath } from 'node:url';
     5	
     6	import { describe, expect, it } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    10	const require = createRequire(import.meta.url);
    11	
    12	const promote = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs',
    15	)) as {
    16	  PROMOTION_PREREQUISITES: readonly string[];
    17	  PROMOTION_DECISIONS: Record<string, string>;
    18	  checkPrerequisites: (context?: {
    19	    replayFixturesExist?: boolean;
    20	    behavioralSuitesExist?: boolean;
    21	  }) => { allMet: boolean; results: Record<string, boolean>; missing: string[] };
    22	  checkManifestBoundary: (
    23	    candidate: Record<string, any>,
    24	    manifest: { tunableFields?: Array<{ name: string }>; lockedFields?: Array<{ name: string }> },
    25	  ) => { valid: boolean; violations: string[] };
    26	  evaluateCandidate: (
    27	    candidate: { config: Record<string, any>; score: Record<string, any> },
    28	    baselineScore: Record<string, any>,
    29	    options?: Record<string, any>,
    30	  ) => {
    31	    decision: string;
    32	    improved: boolean;
    33	    regressions: string[];
    34	    improvements: string[];
    35	    manifestCheck: object | null;
    36	    prerequisiteCheck: object;
    37	    advisoryOnly: boolean;
    38	  };
    39	  generatePromotionReport: (
    40	    candidate: object,
    41	    score: Record<string, any>,
    42	    decision: string,
    43	    options?: Record<string, any>,
    44	  ) => Record<string, any>;
    45	  savePromotionReport: (report: object, outputPath: string) => void;
    46	};
    47	
    48	const manifest = JSON.parse(
    49	  fs.readFileSync(
    50	    path.join(
    51	      WORKSPACE_ROOT,
    52	      '.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json',
    53	    ),
    54	    'utf8',
    55	  ),
    56	);
    57	
    58	describe('Advisory Promotion Gate (T007)', () => {
    59	  describe('checkPrerequisites', () => {
    60	    it('should report all missing when no prerequisites exist', () => {
    61	      const result = promote.checkPrerequisites();
    62	      expect(result.allMet).toBe(false);
    63	      expect(result.missing).toHaveLength(2);
    64	      expect(result.missing).toContain('replayFixturesExist');
    65	      expect(result.missing).toContain('behavioralSuitesExist');
    66	    });
    67	
    68	    it('should report partial missing', () => {
    69	      const result = promote.checkPrerequisites({ replayFixturesExist: true });
    70	      expect(result.allMet).toBe(false);
    71	      expect(result.missing).toContain('behavioralSuitesExist');
    72	      expect(result.results.replayFixturesExist).toBe(true);
    73	    });
    74	
    75	    it('should pass when all prerequisites exist', () => {
    76	      const result = promote.checkPrerequisites({
    77	        replayFixturesExist: true,
    78	        behavioralSuitesExist: true,
    79	      });
    80	      expect(result.allMet).toBe(true);
    81	      expect(result.missing).toHaveLength(0);
    82	    });
    83	  });
    84	
    85	  describe('checkManifestBoundary', () => {
    86	    it('should allow tunable fields', () => {
    87	      const result = promote.checkManifestBoundary(
    88	        { convergenceThreshold: 0.05 },
    89	        manifest,
    90	      );
    91	      expect(result.valid).toBe(true);
    92	      expect(result.violations).toHaveLength(0);
    93	    });
    94	
    95	    it('should reject locked contract fields', () => {
    96	      const result = promote.checkManifestBoundary(
    97	        { stopReason: 'converged' },
    98	        manifest,
    99	      );
   100	      expect(result.valid).toBe(false);
   101	      expect(result.violations.some((v: string) => v.includes('locked'))).toBe(true);
   102	    });
   103	
   104	    it('should reject fields not in manifest', () => {
   105	      const result = promote.checkManifestBoundary(
   106	        { unknownField: 42 },
   107	        manifest,
   108	      );
   109	      expect(result.valid).toBe(false);
   110	      expect(result.violations.some((v: string) => v.includes('not listed as tunable'))).toBe(true);
   111	    });
   112	
   113	    it('should reject mixed tunable and locked fields', () => {
   114	      const result = promote.checkManifestBoundary(
   115	        { convergenceThreshold: 0.05, fileProtection: {} },
   116	        manifest,
   117	      );
   118	      expect(result.valid).toBe(false);
   119	    });
   120	  });
   121	
   122	  describe('evaluateCandidate', () => {
   123	    const baselineScore = {
   124	      composite: 0.6,
   125	      perDimension: {
   126	        convergenceEfficiency: { score: 0.5, weight: 0.3, weighted: 0.15, available: true },
   127	        findingAccuracy: { score: 0.7, weight: 0.3, weighted: 0.21, available: true },
   128	      },
   129	    };
   130	
   131	    it('should produce advisory-accept when candidate improves', () => {
   132	      const candidate = {
   133	        config: { convergenceThreshold: 0.05 },
   134	        score: {
   135	          composite: 0.8,
   136	          perDimension: {
   137	            convergenceEfficiency: { score: 0.7, weight: 0.3, weighted: 0.21, available: true },
   138	            findingAccuracy: { score: 0.8, weight: 0.3, weighted: 0.24, available: true },
   139	          },
   140	        },
   141	      };
   142	
   143	      const result = promote.evaluateCandidate(candidate, baselineScore, {
   144	        manifest,
   145	      });
   146	
   147	      expect(result.decision).toBe('advisory-accept');
   148	      expect(result.improved).toBe(true);
   149	      expect(result.advisoryOnly).toBe(true); // prerequisites not met
   150	    });
   151	
   152	    it('should produce advisory-reject when candidate regresses', () => {
   153	      const candidate = {
   154	        config: { convergenceThreshold: 0.05 },
   155	        score: {
   156	          composite: 0.4,
   157	          perDimension: {
   158	            convergenceEfficiency: { score: 0.3, weight: 0.3, weighted: 0.09, available: true },
   159	            findingAccuracy: { score: 0.5, weight: 0.3, weighted: 0.15, available: true },
   160	          },
   161	        },
   162	      };
   163	
   164	      const result = promote.evaluateCandidate(candidate, baselineScore);
   165	      expect(result.decision).toBe('advisory-reject');
   166	      expect(result.improved).toBe(false);
   167	    });
   168	
   169	    it('should block promotion when candidate touches locked fields', () => {
   170	      const candidate = {
   171	        config: { stopReason: 'converged' },
   172	        score: { composite: 0.9, perDimension: {} },
   173	      };
   174	
   175	      const result = promote.evaluateCandidate(candidate, baselineScore, {
   176	        manifest,
   177	      });
   178	
   179	      expect(result.decision).toBe('blocked');
   180	      expect(result.manifestCheck).toBeDefined();
   181	    });
   182	
   183	    it('should always be advisory-only when prerequisites are missing (REQ-006)', () => {
   184	      const candidate = {
   185	        config: { convergenceThreshold: 0.05 },
   186	        score: {
   187	          composite: 0.9,
   188	          perDimension: {},
   189	        },
   190	      };
   191	
   192	      const result = promote.evaluateCandidate(candidate, baselineScore, {
   193	        prerequisites: {
   194	          replayFixturesExist: false,
   195	          behavioralSuitesExist: false,
   196	        },
   197	      });
   198	
   199	      expect(result.advisoryOnly).toBe(true);
   200	      expect(result.prerequisiteCheck).toBeDefined();
   201	    });
   202	
   203	    it('should still be advisory-only even with all prerequisites met (Phase 4a scope)', () => {
   204	      const candidate = {
   205	        config: { convergenceThreshold: 0.05 },
   206	        score: {
   207	          composite: 0.9,
   208	          perDimension: {},
   209	        },
   210	      };
   211	
   212	      // Even with prerequisites met, the decision is advisory-*
   213	      const result = promote.evaluateCandidate(candidate, baselineScore, {
   214	        prerequisites: {
   215	          replayFixturesExist: true,
   216	          behavioralSuitesExist: true,
   217	        },
   218	      });
   219	
   220	      expect(result.decision).toMatch(/^advisory-/);
   221	    });
   222	
   223	    it('P1-2: advisoryOnly MUST be true even when all prerequisites are met', () => {
   224	      const candidate = {
   225	        config: { convergenceThreshold: 0.05 },
   226	        score: {
   227	          composite: 0.9,
   228	          perDimension: {
   229	            convergenceEfficiency: { score: 0.9, weight: 0.3, weighted: 0.27, available: true },
   230	            findingAccuracy: { score: 0.9, weight: 0.3, weighted: 0.27, available: true },
   231	          },
   232	        },
   233	      };
   234	
   235	      const result = promote.evaluateCandidate(candidate, baselineScore, {
   236	        manifest,
   237	        prerequisites: {
   238	          replayFixturesExist: true,
   239	          behavioralSuitesExist: true,
   240	        },
   241	      });
   242	
   243	      // This is the core P1-2 assertion: advisoryOnly must NEVER flip to false
   244	      expect(result.advisoryOnly).toBe(true);
   245	    });
   246	  });
   247	
   248	  describe('generatePromotionReport', () => {
   249	    it('should generate a complete advisory report', () => {
   250	      const report = promote.generatePromotionReport(
   251	        { convergenceThreshold: 0.05 },
   252	        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
   253	        'advisory-accept',
   254	        {
   255	          improved: true,
   256	          improvements: ['Composite improved'],
   257	          regressions: [],
   258	        },
   259	      );
   260	
   261	      expect(report.reportType).toBe('advisory-promotion');
   262	      expect(report.advisoryOnly).toBe(true);
   263	      expect(report.autoPromotionAllowed).toBe(false);
   264	      expect(report.humanReviewRequired).toBe(true);
   265	      expect(report.decision).toBe('advisory-accept');
   266	      expect(report.candidate).toBeDefined();
   267	      expect(report.evaluation).toBeDefined();
   268	      expect(report.prerequisites).toBeDefined();
   269	      expect(report.recommendation).toBeDefined();
   270	      expect(report.nextSteps).toBeDefined();
   271	      expect(report.generatedAt).toBeDefined();
   272	    });
   273	
   274	    it('should never set autoPromotionAllowed to true', () => {
   275	      const report = promote.generatePromotionReport(
   276	        { convergenceThreshold: 0.05 },
   277	        { composite: 0.99, perDimension: {} },
   278	        'advisory-accept',
   279	      );
   280	
   281	      expect(report.autoPromotionAllowed).toBe(false);
   282	    });
   283	
   284	    it('should include prerequisite gap in next steps when prerequisites are missing', () => {
   285	      const report = promote.generatePromotionReport(
   286	        { convergenceThreshold: 0.05 },
   287	        { composite: 0.8, perDimension: {} },
   288	        'advisory-accept',
   289	        {
   290	          prerequisiteCheck: {
   291	            allMet: false,
   292	            missing: ['behavioralSuitesExist'],
   293	          },
   294	        },
   295	      );
   296	
   297	      expect(
   298	        report.nextSteps.some((s: string) => s.includes('prerequisite')),
   299	      ).toBe(true);
   300	    });
   301	  });
   302	
   303	  describe('P1-2: checkManifestBoundary range/type validation', () => {
   304	    it('should reject values below manifest minimum', () => {
   305	      const result = promote.checkManifestBoundary(
   306	        { convergenceThreshold: 0.001 },
   307	        manifest,
   308	      );
   309	      expect(result.valid).toBe(false);
   310	      expect(result.violations.some((v: string) => v.includes('below manifest minimum'))).toBe(true);
   311	    });
   312	
   313	    it('should reject values above manifest maximum', () => {
   314	      const result = promote.checkManifestBoundary(
   315	        { convergenceThreshold: 0.99 },
   316	        manifest,
   317	      );
   318	      expect(result.valid).toBe(false);
   319	      expect(result.violations.some((v: string) => v.includes('above manifest maximum'))).toBe(true);
   320	    });
   321	
   322	    it('should reject non-integer for integer type fields', () => {
   323	      const result = promote.checkManifestBoundary(
   324	        { stuckThreshold: 2.5 },
   325	        manifest,
   326	      );
   327	      expect(result.valid).toBe(false);
   328	      expect(result.violations.some((v: string) => v.includes('integer'))).toBe(true);
   329	    });
   330	
   331	    it('should reject non-number for numeric fields', () => {
   332	      const result = promote.checkManifestBoundary(
   333	        { convergenceThreshold: 'not-a-number' },
   334	        manifest,
   335	      );
   336	      expect(result.valid).toBe(false);
   337	      expect(result.violations.some((v: string) => v.includes('must be a number'))).toBe(true);
   338	    });
   339	
   340	    it('should accept values within manifest range', () => {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs | sed -n '320,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	  if (skippedLines.length > 0) {
   321	    entry.metadata.skippedLines = skippedLines;
   322	  }
   323	  entry.metadata.validationErrors = [];
   324	
   325	  const validation = validateCorpusEntry(entry);
   326	
   327	  if (!validation.valid) {
   328	    errors.push(...validation.errors);
   329	    entry.metadata.validationErrors = validation.errors;
   330	  } else {
   331	    corpus.push(entry);
   332	  }
   333	
   334	  // Mark unavailable metrics explicitly (REQ-009)
   335	  if (!entry.metadata.hasGraphMetrics) {
   336	    warnings.push(
   337	      `Corpus entry ${entry.id}: graph metrics unavailable (older trace format)`,
   338	    );
   339	  }
   340	  if (!entry.metadata.hasWaveMetrics) {
   341	    warnings.push(
   342	      `Corpus entry ${entry.id}: wave metrics unavailable (older trace format)`,
   343	    );
   344	  }
   345	
   346	  return { corpus, errors, warnings, familyInfo };
   347	}
   348	
   349	/* ---------------------------------------------------------------
   350	   5. CORPUS PERSISTENCE
   351	----------------------------------------------------------------*/
   352	
   353	/**
   354	 * Save a corpus to disk as a JSON file.
   355	 *
   356	 * @param {object[]} corpus - The corpus entries.
   357	 * @param {string} outputPath - File path for the output.
   358	 */
   359	function saveCorpus(corpus, outputPath) {
   360	  if (!Array.isArray(corpus) || typeof outputPath !== 'string' || !outputPath) return false;
   361	  const dir = path.dirname(outputPath);
   362	  if (!fs.existsSync(dir)) {
   363	    fs.mkdirSync(dir, { recursive: true });
   364	  }
   365	  fs.writeFileSync(outputPath, JSON.stringify(corpus, null, 2), 'utf8');
   366	  return true;
   367	}
   368	
   369	/**
   370	 * Load a saved corpus from disk.
   371	 *
   372	 * @param {string} corpusPath - Path to the corpus JSON file.
   373	 * @returns {object[]} The loaded corpus entries.
   374	 */
   375	function loadCorpus(corpusPath) {
   376	  if (typeof corpusPath !== 'string' || !corpusPath || !fs.existsSync(corpusPath)) {
   377	    return [];
   378	  }
   379	  try {
   380	    const content = fs.readFileSync(corpusPath, 'utf8');
   381	    const parsed = JSON.parse(content);
   382	    return Array.isArray(parsed) ? parsed : [];
   383	  } catch (_error) {
   384	    return [];
   385	  }
   386	}
   387	
   388	/* ---------------------------------------------------------------
   389	   6. EXPORTS
   390	----------------------------------------------------------------*/
   391	
   392	module.exports = {
   393	  PACKET_FAMILIES,
   394	  REQUIRED_ENTRY_FIELDS,
   395	  buildCorpus,
   396	  validateCorpusEntry,
   397	  extractCorpusEntry,
   398	  parseJSONL,
   399	  saveCorpus,
   400	  loadCorpus,
   401	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	import { createRequire } from 'node:module';
     4	import { fileURLToPath } from 'node:url';
     5	
     6	import { describe, expect, it } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    10	const require = createRequire(import.meta.url);
    11	
    12	const replayRunner = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs',
    15	)) as {
    16	  DEFAULT_CONFIG: Record<string, number | boolean>;
    17	  evaluateConvergence: (
    18	    iteration: Record<string, any>,
    19	    config: Record<string, any>,
    20	    priorState: Record<string, any>,
    21	  ) => { converged: boolean; stuck: boolean; signals: Record<string, any> };
    22	  replayRun: (
    23	    corpusEntry: Record<string, any>,
    24	    config: Record<string, any>,
    25	  ) => {
    26	    iterationsUsed: number;
    27	    maxIterations: number;
    28	    converged: boolean;
    29	    stuckIterations: number;
    30	    recoveryAttempts: number;
    31	    recoverySuccesses: number;
    32	    totalFindings: number;
    33	    relevantFindings: number;
    34	    stopReason: string;
    35	    perIterationSignals: object[];
    36	    finalSignals: object | null;
    37	  };
    38	  compareResults: (
    39	    baseline: Record<string, any>,
    40	    candidate: Record<string, any>,
    41	  ) => { improved: boolean; regressions: string[]; improvements: string[]; delta: Record<string, number> };
    42	};
    43	
    44	const replayCorpus = require(path.join(
    45	  WORKSPACE_ROOT,
    46	  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
    47	)) as {
    48	  buildCorpus: (family: string, options: { jsonlContent?: string }) => { corpus: any[] };
    49	};
    50	
    51	const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');
    52	
    53	function loadSampleCorpusEntry(): Record<string, any> {
    54	  const content = fs.readFileSync(
    55	    path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
    56	    'utf8',
    57	  );
    58	  const result = replayCorpus.buildCorpus('040', { jsonlContent: content });
    59	  return result.corpus[0] as Record<string, any>;
    60	}
    61	
    62	describe('Deterministic Replay Runner (T003)', () => {
    63	  describe('evaluateConvergence', () => {
    64	    it('should detect convergence when newInfoRatio is below threshold', () => {
    65	      const result = replayRunner.evaluateConvergence(
    66	        { newInfoRatio: 0.02 },
    67	        { convergenceThreshold: 0.05 },
    68	        { newInfoRatios: [0.03, 0.02], consecutiveLowProgress: 0 },
    69	      );
    70	      expect(result.converged).toBe(true);
    71	    });
    72	
    73	    it('should not converge when newInfoRatio is above threshold', () => {
    74	      const result = replayRunner.evaluateConvergence(
    75	        { newInfoRatio: 0.50 },
    76	        { convergenceThreshold: 0.05 },
    77	        { newInfoRatios: [0.80], consecutiveLowProgress: 0 },
    78	      );
    79	      expect(result.converged).toBe(false);
    80	    });
    81	
    82	    it('should detect stuck state after consecutive low-progress iterations', () => {
    83	      const result = replayRunner.evaluateConvergence(
    84	        { newInfoRatio: 0.01 },
    85	        { stuckThreshold: 2, noProgressThreshold: 0.05 },
    86	        { newInfoRatios: [0.01], consecutiveLowProgress: 1 },
    87	      );
    88	      expect(result.stuck).toBe(true);
    89	      expect(result.signals.consecutiveLowProgress).toBe(2);
    90	    });
    91	
    92	    it('should reset consecutiveLowProgress when progress resumes', () => {
    93	      const result = replayRunner.evaluateConvergence(
    94	        { newInfoRatio: 0.50 },
    95	        { stuckThreshold: 3, noProgressThreshold: 0.05 },
    96	        { newInfoRatios: [0.01, 0.01], consecutiveLowProgress: 2 },
    97	      );
    98	      expect(result.stuck).toBe(false);
    99	      expect(result.signals.consecutiveLowProgress).toBe(0);
   100	    });
   101	  });
   102	
   103	  describe('replayRun', () => {
   104	    it('should replay a corpus entry deterministically', () => {
   105	      const entry = loadSampleCorpusEntry();
   106	      const baselineConfig = JSON.parse(
   107	        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
   108	      );
   109	
   110	      const result1 = replayRunner.replayRun(entry, baselineConfig);
   111	      const result2 = replayRunner.replayRun(entry, baselineConfig);
   112	
   113	      // Deterministic: same inputs produce same outputs
   114	      expect(result1.iterationsUsed).toBe(result2.iterationsUsed);
   115	      expect(result1.converged).toBe(result2.converged);
   116	      expect(result1.stopReason).toBe(result2.stopReason);
   117	      expect(result1.stuckIterations).toBe(result2.stuckIterations);
   118	      expect(result1.totalFindings).toBe(result2.totalFindings);
   119	      expect(result1.relevantFindings).toBe(result2.relevantFindings);
   120	    });
   121	
   122	    it('should produce per-iteration signals', () => {
   123	      const entry = loadSampleCorpusEntry();
   124	      const config = JSON.parse(
   125	        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
   126	      );
   127	
   128	      const result = replayRunner.replayRun(entry, config);
   129	      expect(result.perIterationSignals.length).toBeGreaterThan(0);
   130	      expect(result.finalSignals).not.toBeNull();
   131	    });
   132	
   133	    it('should respect maxIterations from config', () => {
   134	      const entry = loadSampleCorpusEntry();
   135	      const config = { maxIterations: 1 };
   136	
   137	      const result = replayRunner.replayRun(entry, config);
   138	      expect(result.iterationsUsed).toBeLessThanOrEqual(1);
   139	    });
   140	
   141	    it('should track findings across iterations', () => {
   142	      const entry = loadSampleCorpusEntry();
   143	      const config = JSON.parse(
   144	        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
   145	      );
   146	
   147	      const result = replayRunner.replayRun(entry, config);
   148	      expect(result.totalFindings).toBeGreaterThan(0);
   149	    });
   150	
   151	    it('should handle empty iterations', () => {
   152	      const entry = {
   153	        id: 'empty-test',
   154	        packetFamily: '040',
   155	        sourceRun: 'empty',
   156	        config: {},
   157	        iterations: [],
   158	        stopOutcome: { stopReason: 'unknown' },
   159	      };
   160	      const config = { maxIterations: 7 };
   161	
   162	      const result = replayRunner.replayRun(entry, config);
   163	      expect(result.iterationsUsed).toBe(0);
   164	      expect(result.converged).toBe(false);
   165	      expect(result.stopReason).toBe('maxIterationsReached');
   166	    });
   167	
   168	    it('should produce different results for different configs', () => {
   169	      const entry = loadSampleCorpusEntry();
   170	      const baseline = JSON.parse(
   171	        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
   172	      );
   173	      const candidate = JSON.parse(
   174	        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-candidate.json'), 'utf8'),
   175	      );
   176	
   177	      const baselineResult = replayRunner.replayRun(entry, baseline);
   178	      const candidateResult = replayRunner.replayRun(entry, candidate);
   179	
   180	      // Results may differ because different thresholds change convergence behavior
   181	      // At minimum, the per-iteration signals should reflect different thresholds
   182	      expect(baselineResult.perIterationSignals[0]).toBeDefined();
   183	      expect(candidateResult.perIterationSignals[0]).toBeDefined();
   184	    });
   185	  });
   186	
   187	  describe('compareResults', () => {
   188	    it('should detect improvements', () => {
   189	      const baseline = {
   190	        iterationsUsed: 5,
   191	        converged: true,
   192	        stuckIterations: 1,
   193	        relevantFindings: 8,
   194	      };
   195	      const candidate = {
   196	        iterationsUsed: 3,
   197	        converged: true,
   198	        stuckIterations: 0,
   199	        relevantFindings: 10,
   200	      };
   201	
   202	      const comparison = replayRunner.compareResults(baseline, candidate);
   203	      expect(comparison.improved).toBe(true);
   204	      expect(comparison.improvements.length).toBeGreaterThan(0);
   205	      expect(comparison.regressions).toHaveLength(0);
   206	    });
   207	
   208	    it('should detect regressions', () => {
   209	      const baseline = {
   210	        iterationsUsed: 3,
   211	        converged: true,
   212	        stuckIterations: 0,
   213	        relevantFindings: 10,
   214	      };
   215	      const candidate = {
   216	        iterationsUsed: 7,
   217	        converged: false,
   218	        stuckIterations: 2,
   219	        relevantFindings: 5,
   220	      };
   221	
   222	      const comparison = replayRunner.compareResults(baseline, candidate);
   223	      expect(comparison.improved).toBe(false);
   224	      expect(comparison.regressions.length).toBeGreaterThan(0);
   225	    });
   226	
   227	    it('should report delta values', () => {
   228	      const baseline = {
   229	        iterationsUsed: 5,
   230	        converged: true,
   231	        stuckIterations: 1,
   232	        relevantFindings: 8,
   233	      };
   234	      const candidate = {
   235	        iterationsUsed: 3,
   236	        converged: true,
   237	        stuckIterations: 0,
   238	        relevantFindings: 10,
   239	      };
   240	
   241	      const comparison = replayRunner.compareResults(baseline, candidate);
   242	      expect(comparison.delta.iterationsUsed).toBe(2); // 5 - 3 = saved 2
   243	      expect(comparison.delta.stuckIterations).toBe(1); // 1 - 0 = saved 1
   244	      expect(comparison.delta.relevantFindings).toBe(2); // 10 - 8 = gained 2
   245	    });
   246	
   247	    it('should flag convergence regression', () => {
   248	      const baseline = { iterationsUsed: 5, converged: true, stuckIterations: 0, relevantFindings: 5 };
   249	      const candidate = { iterationsUsed: 5, converged: false, stuckIterations: 0, relevantFindings: 5 };
   250	
   251	      const comparison = replayRunner.compareResults(baseline, candidate);
   252	      expect(comparison.regressions.some((r: string) => r.includes('converge'))).toBe(true);
   253	    });
   254	  });
   255	});

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md | sed -n '40,130p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	## 2. QUALITY GATES
    41	
    42	### Definition of Ready
    43	
    44	- [x] Phase 001 through Phase 003 have identified the runtime artifacts and metrics worth optimizing.
    45	- [x] Packet family `040` is identified as the required real replay corpus.
    46	- [x] Packet family `028` is understood as an optional older holdout, not a required corpus family.
    47	- [x] Packet family `042` is planning-only and has no implementation traces yet.
    48	- [x] Phase 001 replay fixtures exist for production-grade replay gating.
    49	- [x] Phase 003 behavioral suites exist for non-advisory promotion.
    50	- [x] Optimizer-managed fields are treated as bounded config surfaces, not free-form mutation targets.
    51	
    52	### Definition of Done
    53	
    54	- [x] Replay corpus extraction is deterministic and traceable to source runs.
    55	- [x] Rubric scoring exposes per-dimension outputs and clear weighting.
    56	- [x] Search space is bounded, auditable, and mapped to named deterministic parameter families.
    57	- [x] Replay runner can compare baseline and candidate configs without live execution.
    58	- [x] Audit output exists for accepted and rejected candidates.
    59	- [x] Optimizer manifest exists and clearly separates tunable fields, locked contract fields, and future prompt-pack entrypoints.
    60	- [x] Promotion gate emits advisory-only outputs until replay fixtures and behavioral suites exist.
    61	<!-- /ANCHOR:quality-gates -->
    62	
    63	---
    64	
    65	<!-- ANCHOR:architecture -->
    66	## 3. ARCHITECTURE
    67	
    68	### Pattern
    69	
    70	Offline compile/evaluate loop with governed advisory promotion.
    71	
    72	### Key Components
    73	
    74	- **Replay corpus builder**: normalizes real packet-family traces into replayable datasets, with `040` required and `028` optional as a compatibility holdout.
    75	- **Rubric engine**: scores replay outcomes across multiple quality dimensions.
    76	- **Replay runner**: re-evaluates reducer and convergence logic under alternate candidates.
    77	- **Random-search engine**: explores bounded deterministic numeric config candidates.
    78	- **Optimizer manifest**: declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
    79	- **Audit trail**: records candidates, scores, regressions, and advisory decisions.
    80	- **Advisory promotion gate**: blocks risky candidates and emits patch-style recommendations without mutating canonical configs.
    81	- **Phase 4b placeholder**: future prompt-pack generation and meta-learning surfaces, explicitly deferred.
    82	
    83	### Data Flow
    84	
    85	```text
    86	Collect historical traces
    87	  -> normalize replay corpus
    88	  -> score baseline runs with rubric
    89	  -> replay deterministic baselines
    90	  -> generate random-search candidate configs
    91	  -> replay candidates deterministically
    92	  -> compare against baseline
    93	  -> record audit trail
    94	  -> emit advisory patch reports
    95	  -> require replay fixtures + behavioral gates before any future production promotion
    96	```
    97	<!-- /ANCHOR:architecture -->
    98	
    99	---
   100	
   101	<!-- ANCHOR:phases -->
   102	## 4. IMPLEMENTATION PHASES
   103	
   104	### Phase 4a: Deterministic Config Optimizer
   105	
   106	**Status**: Active now
   107	
   108	**Estimated sessions**: 3-4
   109	
   110	**Scope**: REQ-001 through REQ-009
   111	
   112	**Why now**: The repo has enough real data for a bounded pilot on deterministic config tuning, but not enough corpus diversity or safety coverage for prompt/meta optimization.
   113	
   114	**Dependencies**:
   115	- Phase 1 replay fixtures for production-grade replay validation.
   116	- Existing `040` traces as the required real corpus.
   117	
   118	**Sub-steps**:
   119	1. Corpus builder
   120	2. Rubric definition
   121	3. Replay runner
   122	4. Random search
   123	5. Audit trail
   124	6. Advisory promotion
   125	
   126	**Files to change**:
   127	- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`
   128	- `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs`
   129	- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`
   130	- `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/review-report.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Review Report: 042 Deep Research & Review Runtime Improvement Bundle [Closing Audit]"
     3	description: "Synthesis of 10 Codex-driven deep review iterations against the entire 042 bundle. Verdict: CONDITIONAL — 0 P0, 10 P1, 6 P2."
     4	---
     5	
     6	# Review Report: 042 Bundle Closing Audit
     7	
     8	## 1. Executive Summary
     9	
    10	- **Verdict**: CONDITIONAL
    11	- **activeP0**: 0
    12	- **activeP1**: 10
    13	- **activeP2**: 6
    14	- **hasAdvisories**: false
    15	- **Session**: `rvw-2026-04-11T13-50-06Z`
    16	- **Scope**: Entire 042 bundle — `spec.md` plus all 8 phase folders (`001` through `008`) and shipped runtime code across `sk-deep-research`, `sk-deep-review`, `sk-improve-agent`, the `system-spec-kit` coverage-graph stack, 6 YAML workflows, vitest suites, changelog surfaces, and packet-root completion artifacts.
    17	- **Stop reason**: `maxIterationsReached` (`10/10`, planned hard cap)
    18	- **Coverage**: all 4 dimensions reached during the session: correctness, security, traceability, and maintainability
    19	- **Convergence**: `newFindingsRatio` fell from `1.00` to `0.06`; final reducer `convergenceScore` is `0.94`, but legal release readiness remains blocked by 10 active P1 findings
    20	
    21	The dominant pattern across the 10 iterations was contract drift, not isolated code polish. The bundle added meaningful reducer, workflow, and test hardening, but several user-visible promises still do not match the live execution path: STOP gating does not consume claim-adjudication state, lifecycle branches are advertised without persisted lineage transitions, and the coverage-graph namespace contract is still weak at both storage and documentation layers.
    22	
    23	The second pattern was release-surface optimism outrunning evidence. Phase 008 closeout and packet-root summaries certify completion in places where the live review packet still records required debt, so operators can receive a "finished" signal even though the current closing audit is still CONDITIONAL.
    24	
    25	## 2. Planning Trigger
    26	
    27	CONDITIONAL routes to `/spec_kit:plan` for remediation before the 042 bundle can be treated as PASS. The next packet should preserve this closing audit as the baseline, open with the active P1 registry below, and sequence the remediation lanes in implementation dependency order so runtime and persistence fixes land before documentation and packet-root closeout updates.
    28	
    29	## 3. Active Finding Registry
    30	
    31	| ID | Sev | Dimension | Title | Origin | Key evidence | First seen | Last seen | Status |
    32	|---|---|---|---|---|---|---:|---:|---|
    33	| F001 | P1 | correctness | Canonical deep-review agent still emits an unparseable iteration schema | `I001` (`iteration-001.md:18`) | `.opencode/agent/deep-review.md:147`; `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:137-206` | 1 | 1 | active |
    34	| F002 | P1 | correctness | Claim-adjudication is documented as a hard stop gate but never participates in STOP eligibility | `I001` (`iteration-001.md:19`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:574`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:388-429` | 1 | 1 | active |
    35	| F003 | P2 | correctness | Review config JSONL collapses requested dimensions into one string element | `I001` (`iteration-001.md:22`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:259` | 1 | 1 | active |
    36	| F004 | P1 | security | Coverage-graph writes are not session-isolated when IDs collide | `I002` (`iteration-002.md:19`) | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` | 2 | 2 | active |
    37	| F005 | P2 | security | Session-isolation regression omits the ID-collision path | `I002` (`iteration-002.md:22`) | `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376` | 2 | 2 | active |
    38	| F006 | P1 | security | Graph-event namespace contract is still undocumented on the visible path | `I003` (`iteration-003.md:19`) | `.opencode/skill/sk-deep-research/references/state_format.md:145`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:658-665` | 3 | 3 | active |
    39	| F007 | P1 | traceability | Claim-adjudication state format still documents a prose block instead of the typed packet the workflow enforces | `I004` (`iteration-004.md:18`) | `.opencode/skill/sk-deep-review/references/state_format.md:621`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:619-628` | 4 | 4 | active |
    40	| F008 | P1 | traceability | Deep-review quick reference teaches the wrong weighted convergence signal set | `I004` (`iteration-004.md:19`) | `.opencode/skill/sk-deep-review/references/quick_reference.md:145`; `.opencode/skill/sk-deep-review/references/convergence.md:165-171` | 4 | 4 | active |
    41	| F009 | P2 | traceability | Convergence reference still describes a persisted `legalStop` synthesis payload the shipped JSONL schema does not write | `I004` (`iteration-004.md:22`) | `.opencode/skill/sk-deep-review/references/convergence.md:44`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:896` | 4 | 4 | active |
    42	| F010 | P1 | correctness | Resume/restart/fork/completed-continue are exposed as live lifecycle branches without any matching lineage write path | `I005` (`iteration-005.md:19`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:143-146` | 5 | 5 | active |
    43	| F011 | P2 | traceability | Resume-event examples remain skeletal even where the visible state contract expects lineage metadata | `I005` (`iteration-005.md:22`) | `.opencode/skill/sk-deep-research/references/loop_protocol.md:83`; `.opencode/skill/sk-deep-review/references/state_format.md:240-243` | 5 | 5 | active |
    44	| F012 | P1 | correctness | Improve-agent docs promise resumable lineage modes that the shipped workflow cannot execute or surface | `I006` (`iteration-006.md:19`) | `.opencode/skill/sk-improve-agent/SKILL.md:292`; `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:36-42` | 6 | 6 | active |
    45	| F013 | P2 | traceability | Phase 008 implementation summary overclaims REQ-024 closure | `I008` (`iteration-008.md:19`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:59`; `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:61-91` | 8 | 8 | active |
    46	| F014 | P1 | traceability | Phase 008 closeout claims full requirement closure while open review P1s remain | `I009` (`iteration-009.md:19`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:157`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-dashboard.md:35` | 9 | 9 | active |
    47	| F015 | P2 | traceability | Reducer-owned `ACTIVE RISKS` summary hides non-P0 release-readiness debt | `I009` (`iteration-009.md:22`) | `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:832`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-dashboard.md:100` | 9 | 9 | active |
    48	| F016 | P1 | traceability | Root packet completion surfaces still certify an obsolete four-phase "implemented" state | `I010` (`iteration-010.md:18`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md:60`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md:95`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:98`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:23` | 10 | 10 | active |
    49	
    50	### Finding Digests
    51	
    52	#### F001
    53	- **Risk**: a canonical reviewer following `.opencode/agent/deep-review.md` can produce markdown the reducer does not parse, which drops real findings out of the registry and dashboard.
    54	- **Carry-forward note**: fix the authoritative authoring contract before relying on any parser-driven closeout automation.
    55	
    56	#### F002
    57	- **Risk**: claim-adjudication failure is recorded but not consumed by the legal-stop tree, so synthesis can happen even when the required adjudication packet is invalid or absent.
    58	- **Carry-forward note**: this is the highest-priority loop-control gap because it affects release gating directly.
    59	
    60	#### F003
    61	- **Risk**: the persisted config row serializes `reviewDimensions` as one string element, which weakens replay quality and future schema migrations.
    62	- **Carry-forward note**: keep it coupled to F001 so the emitted state contract is fixed together with the authoring contract.
    63	
    64	#### F004
    65	- **Risk**: the coverage graph still mutates rows by bare ID, so two sessions reusing the same node or edge ID can overwrite each other.
    66	- **Carry-forward note**: this is the core session-isolation defect; the other graph findings are downstream evidence, tests, and docs.
    67	
    68	#### F005
    69	- **Risk**: the current regression suite proves filtered reads on disjoint fixtures, not isolation under shared-ID collision.
    70	- **Carry-forward note**: keep this behind F004 so the test is updated against the repaired storage contract rather than the current broken behavior.
    71	
    72	#### F006
    73	- **Risk**: visible review and research references do not tell operators how graph-event IDs must remain namespaced or unique per session.
    74	- **Carry-forward note**: land after F004 so the documentation reflects the repaired runtime, not the old bare-ID behavior.
    75	
    76	#### F007
    77	- **Risk**: reviewers are told to write prose claim-adjudication blocks even though the confirm workflow now requires typed packet fields.
    78	- **Carry-forward note**: pair with F002 because runtime gating and the visible packet contract must close together.
    79	
    80	#### F008
    81	- **Risk**: the quick reference teaches the wrong weighted convergence vote, which points operators at the wrong tuning levers during manual audits.
    82	- **Carry-forward note**: repair alongside F009 so the quick reference, convergence reference, and persisted JSONL contract align.
    83	
    84	#### F009
    85	- **Risk**: `convergence.md` still shows a persisted `legalStop` synthesis payload that the JSONL schema no longer writes.
    86	- **Carry-forward note**: keep this in the documentation lane unless the remediation packet decides to restore `legalStop` persistence instead.
    87	
    88	#### F010
    89	- **Risk**: review and research workflows advertise resume/restart/fork/completed-continue branches but only initialize `new` lineage metadata and never emit transition events.
    90	- **Carry-forward note**: this is the lifecycle runtime defect; fix it before touching example rows or packet closeout claims.
    91	
    92	#### F011
    93	- **Risk**: even if F010 is fixed later, the visible resume examples are still under-specified and omit lineage metadata fields operators are told to expect.
    94	- **Carry-forward note**: close in the same packet as F010, after the real lifecycle event payload is settled.
    95	
    96	#### F012
    97	- **Risk**: `sk-improve-agent` promises resumable lineage modes without any workflow inputs, runtime branches, or reducer ancestry output to support them.
    98	- **Carry-forward note**: the remediation packet must choose between shipping the lifecycle feature or shrinking the claim surface.
    99	
   100	#### F013
   101	- **Risk**: phase 008 implementation summary claims REQ-024 is fully closed even though the cited test still misses collision behavior.
   102	- **Carry-forward note**: do not fix this summary until F004/F005 are resolved or explicitly descoped.
   103	
   104	#### F014
   105	- **Risk**: phase 008 closeout says all 25 requirements are closed while the live review packet still carries required debt.
   106	- **Carry-forward note**: this should only move once the runtime/doc fixes are either landed or reclassified.
   107	
   108	#### F015
   109	- **Risk**: the reducer-generated dashboard hides active release-readiness debt whenever there is no P0, which makes quick scans deceptively calm.
   110	- **Carry-forward note**: land with root closeout reconciliation so the dashboard and packet summaries tell the same truth.
   111	
   112	#### F016
   113	- **Risk**: the packet root still presents 042 as a completed four-phase bundle even though phases 005-008 and the live review ledger are not absorbed there.
   114	- **Carry-forward note**: treat this as the final closure lane because it depends on the outcome of every earlier remediation decision.
   115	
   116	## 4. Remediation Workstreams
   117	
   118	### Lane 1: Claim-Adjudication Stop Gate Wiring
   119	
   120	- **Findings**: F002, F007
   121	- **Why first**: the loop can currently synthesize after a failed claim-adjudication packet, so the closing audit cannot trust required-stop behavior until this lane is fixed.
   122	- **Target surfaces**: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`, `.opencode/skill/sk-deep-review/references/state_format.md`, `.opencode/skill/sk-deep-review/references/loop_protocol.md`
   123	- **Required decision**: either wire `claim_adjudication_passed` into the legal-stop gate or explicitly downgrade the documentation so claim adjudication is no longer described as STOP-blocking.
   124	- **Exit condition**: a failed or missing typed adjudication packet demonstrably blocks STOP and the operator-facing schema shows the exact typed fields the workflow enforces.
   125	- **Validation proof**: add or extend static contract tests around STOP gating and packet schema parity, then re-run the targeted parity suite.
   126	
   127	### Lane 2: Coverage-Graph Session Isolation
   128	
   129	- **Findings**: F004, F005, F006, F013
   130	- **Why second**: this is the only active security lane, and every release-facing REQ-024 claim depends on the storage contract actually being session-safe under collision.
   131	- **Target surfaces**: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`, `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-review/references/state_format.md`, phase 008 closeout docs
   132	- **Required decision**: choose a stable storage namespace model such as composite primary keys or deterministic session-qualified IDs; then document that model on the visible graph-event contract.
   133	- **Exit condition**: shared-ID collisions no longer overwrite prior session rows, the isolation test fails on the pre-fix path and passes on the repaired path, and REQ-024 closeout language cites the repaired test coverage honestly.
   134	- **Validation proof**: targeted vitest for collision reuse plus any DB-level migration or query proof the packet introduces.
   135	
   136	### Lane 3: Lifecycle Persistence Across Review, Research, and Improve-Agent
   137	
   138	- **Findings**: F010, F011, F012
   139	- **Why third**: lineage branches are currently advertised but not persisted, and the packet should decide once whether it is implementing those branches or retracting them.
   140	- **Target surfaces**: `spec_kit_deep-review_confirm.yaml`, `spec_kit_deep-research_confirm.yaml`, `sk-deep-review` and `sk-deep-research` references, `sk-improve-agent` skill/command/workflow/reducer surfaces
   141	- **Required decision**: either implement `resume` / `restart` / `fork` / `completed-continue` as real runtime branches with event emission and ancestry metadata or narrow every user-facing promise to match the current one-session model.
   142	- **Exit condition**: review, research, and improve-agent all tell the same lifecycle story and produce auditable lineage metadata consistent with their visible contract.
   143	- **Validation proof**: contract-parity checks plus reducer/state-log assertions for the chosen lineage model.
   144	
   145	### Lane 4: Canonical Documentation and State Contract Cleanup
   146	
   147	- **Findings**: F001, F003, F008, F009
   148	- **Why fourth**: these are still serious, but they are safer to repair after the runtime and lifecycle decisions stop moving.
   149	- **Target surfaces**: `.opencode/agent/deep-review.md`, `sk-deep-review` references, the deep-review config JSONL writer in both workflow mirrors
   150	- **Required decision**: pick one canonical iteration schema and one canonical persisted stop schema, then make every example and writer match it.
   151	- **Exit condition**: the canonical agent, workflow outputs, quick reference, convergence reference, and state-format reference all describe the same parser-accepted structures.
   152	- **Validation proof**: reducer-parity tests and a sample iteration file that round-trips into the registry without manual fixes.
   153	
   154	### Lane 5: Packet Root Release-Readiness Reconciliation
   155	
   156	- **Findings**: F014, F015, F016
   157	- **Why last**: packet closeout surfaces should only be rewritten after the runtime, state, and documentation decisions are resolved.
   158	- **Target surfaces**: phase 008 `implementation-summary.md`, packet-root `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and the reducer-owned `ACTIVE RISKS` branch
   159	- **Required decision**: either hold the packet in an explicitly conditional state until follow-up work lands or rewrite the closeout surfaces to describe the remaining debt accurately.
   160	- **Exit condition**: packet root and dashboard no longer imply release-ready completion while active required findings remain.
   161	- **Validation proof**: strict packet validation plus a fresh closing review snapshot that matches the packet-root summary.
   162	
   163	### Workstream Dependency Notes
   164	
   165	- Lane 1 unlocks trustworthy stop semantics; until it lands, any later PASS-style synthesis is still suspect.
   166	- Lane 2 is the only security lane and should not be deferred behind documentation cleanup.
   167	- Lane 3 depends on a product decision as much as implementation effort: ship lineage branches for real, or retract them everywhere.
   168	- Lane 4 should be treated as canonical-surface cleanup after runtime truth is stable; otherwise the docs may be rewritten twice.
   169	- Lane 5 is a release-management lane, not a discovery lane. It should consume the outputs of the first four lanes rather than run in parallel with them.
   170	- F001 and F003 are best handled together because the canonical authoring schema and persisted config schema are the same operator contract from two directions.
   171	- F004, F005, F006, and F013 should stay in one packet because each later finding only makes sense once the storage-layer identity story is fixed.
   172	- F010, F011, and F012 should share one owner if possible so review, research, and improve-agent do not diverge again during remediation.
   173	- F014, F015, and F016 should be revalidated with a fresh dashboard snapshot after edits; static prose updates alone are not enough.
   174	- If the follow-up packet needs to split, split between runtime/state fixes (lanes 1-3) and release-surface reconciliation (lanes 4-5), not inside a lane.
   175	
   176	## 5. Spec Seed
   177	
   178	1. **REQ-026 [correctness] Claim adjudication must participate in legal STOP eligibility.**
   179	The deep-review runtime must treat a failed or missing typed claim-adjudication packet as a STOP veto until remediation or downgrade logic explicitly clears it. Applies to `spec_kit_deep-review_auto.yaml` and its operator-facing confirm mirror.
   180	
   181	2. **REQ-027 [traceability] Claim-adjudication packet schema must be canonical on the visible path.**
   182	`state_format.md`, `loop_protocol.md`, and confirm/runtime validation must name the same machine-readable fields for adjudicating P0/P1 findings.
   183	
   184	3. **REQ-028 [security] Coverage-graph storage identity must be session-isolated under shared IDs.**
   185	Coverage-graph writes must preserve `specFolder + loopType + sessionId + id` isolation semantics even when multiple sessions reuse the same node or edge ID.
   186	
   187	4. **REQ-029 [traceability] Graph-event namespace rules must be documented and regression-tested.**
   188	Review and research state-format references must define `graphEvents` payload shape, namespace expectations, and the collision regression that proves the contract.
   189	
   190	5. **REQ-030 [correctness] Lifecycle branches must either persist lineage transitions or be removed from exposed runtime choices.**
   191	Review, research, and improve-agent may not advertise `resume`, `restart`, `fork`, or `completed-continue` unless those branches write auditable ancestry metadata.
   192	
   193	6. **REQ-031 [traceability] Lifecycle examples must include the full persisted event contract.**
   194	If lifecycle branches remain supported, all resume/restart/fork/completed-continue examples must carry the same metadata fields the JSONL/state-format contract requires.
   195	
   196	7. **REQ-032 [correctness] Canonical review iteration output must match reducer parsing and config persistence.**
   197	The deep-review agent schema and both config writers must emit structures that the shipped reducer accepts without hand normalization.
   198	
   199	8. **REQ-033 [traceability] Convergence and stop-contract references must match persisted JSONL reality.**
   200	Quick references and convergence docs must describe the same weighted signals, blocked-stop schema, and synthesis payload shape the runtime actually writes.
   201	
   202	9. **REQ-034 [traceability] Release-readiness surfaces must not certify PASS while required review debt remains.**
   203	Phase closeout summaries, packet-root completion artifacts, and reducer-owned dashboard risk summaries must reflect active P1/P2 debt until a fresh PASS review exists.
   204	
   205	## 6. Plan Seed
   206	
   207	1. **T001 [correctness] Wire claim-adjudication into the deep-review legal-stop tree**  
   208	Target files: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`  
   209	Findings: F002  
   210	REQ: REQ-026
   211	
   212	2. **T002 [traceability] Replace prose claim-adjudication examples with the typed packet contract**  
   213	Target files: `.opencode/skill/sk-deep-review/references/state_format.md`, `.opencode/skill/sk-deep-review/references/loop_protocol.md`  
   214	Findings: F007  
   215	REQ: REQ-027
   216	
   217	3. **T003 [security] Change coverage-graph upsert identity to a session-safe namespace**  
   218	Target files: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`, related query helpers if needed  
   219	Findings: F004  
   220	REQ: REQ-028
   221	
   222	4. **T004 [security] Add a collision-path regression for shared node and edge IDs across sessions**  
   223	Target files: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`  
   224	Findings: F005  
   225	REQ: REQ-029
   226	
   227	5. **T005 [traceability] Document graphEvents payload schema and namespace expectations on review and research references**  
   228	Target files: `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-review/references/state_format.md`  
   229	Findings: F006  
   230	REQ: REQ-029
   231	
   232	6. **T006 [correctness] Implement or retract lifecycle branches on deep-review and deep-research workflows**  
   233	Target files: `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, any paired auto assets touched by the chosen solution  
   234	Findings: F010  
   235	REQ: REQ-030
   236	
   237	7. **T007 [traceability] Normalize lifecycle event examples and state-format rows after the runtime decision lands**  
   238	Target files: `sk-deep-review` and `sk-deep-research` `state_format.md`, `loop_protocol.md`, `quick_reference.md`  
   239	Findings: F011  
   240	REQ: REQ-031

codex
I’ve finished the first pass over the core modules and tests. I’m now tracing where these helpers are called and how file paths/configs enter them, because the security question hinges on whether unsafe inputs are merely theoretical or actually reachable from the optimizer workflow surfaces.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-005.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
iteration: 5
dimension: correctness
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:53:22Z
completedAt: 2026-04-12T09:57:20Z
---

# Deep Review Iteration 005 — correctness

**Focus:** Phase 003 wave-executor: fan-out/join logic, segment identity determinism, activation gates in .opencode/skill/system-spec-kit/scripts/lib/wave-*.cjs (5 modules). Check wave-lifecycle.cjs for state transitions, wave-segment-planner.cjs for deterministic ordering, wave-convergence.cjs for per-segment convergence.

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
session id: 019d811c-34e1-72d2-be48-9e48371ee416
--------
user
You are a senior code reviewer executing iteration 5 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: correctness
FOCUS: Phase 003 wave-executor: fan-out/join logic, segment identity determinism, activation gates in .opencode/skill/system-spec-kit/scripts/lib/wave-*.cjs (5 modules). Check wave-lifecycle.cjs for state transitions, wave-segment-planner.cjs for deterministic ordering, wave-convergence.cjs for per-segment convergence.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for correctness issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-005-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: correctness
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
Reviewing iteration 5 against the Phase 003 wave-executor surfaces now. I’m starting with the required routing and context steps, then I’ll read the focused `wave-*.cjs` modules and the 042 spec evidence before I assess correctness findings.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|rvw-2026-04-11T13-50-06Z|REQ-026|REQ-034|wave-executor|wave-lifecycle|wave-segment-planner|wave-convergence" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg --files -g 'CLAUDE.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "Deep review iteration 5 for spec folder 042-sk-deep-research-review-improvement-2 focused on correctness in Phase 003 wave-executor wave-*.cjs modules" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 175ms:
CLAUDE.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md

 succeeded in 510ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-Tm0h6tZT' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-research(explicit), deep(name), iteration, loop, research(name)"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), correctness, review(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !folder, !spec, document~, folder, score~"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.89,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), iteration, loop, review(name)"
  }
]

codex
The routing pass points to `sk-code-review` and `sk-deep-review`, so I’m following those review conventions now. I’m also pulling the repo-local `CLAUDE.md` and the 042 packet context so the findings stay aligned with the existing review workflow rather than doing a generic pass.
exec
/bin/zsh -lc "sed -n '1,220p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "P1-1|P1-2|P1-4|offline optimizer|replay corpus|promotion gate|manifest boundary|random search" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"replay-corpus|replay-runner|optimizer-manifest|promote\\.cjs|search\\.cjs|auditTrail|outputPath|fixturesDir|corpusPath\" .opencode/command .opencode/skill/system-spec-kit/scripts -g '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:11:const { replayRun } = require('./replay-runner.cjs');
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:143: * @returns {{ bestCandidate: object|null; bestScore: object|null; auditTrail: object[]; baselineScore: object|null; iterations: number }}
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:150:      auditTrail: [],
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:161:  const auditTrail = [];
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:207:    auditTrail.push(
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:215:    auditTrail,
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:315: * @param {string} outputPath - File path for the output.
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:317:function savePromotionReport(report, outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:318:  if (!report || typeof report !== 'object' || typeof outputPath !== 'string' || !outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:321:  const dir = path.dirname(outputPath);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:325:  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
.opencode/skill/system-spec-kit/scripts/evals/run-redaction-calibration.ts:83:  const outputPath = path.join(specFolder, 'scratch', 'redaction-calibration.md');
.opencode/skill/system-spec-kit/scripts/evals/run-redaction-calibration.ts:130:  fs.writeFileSync(outputPath, `${content}\n`, 'utf8');
.opencode/command/spec_kit/deep-research.md:293:- Optimizer manifest: `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
.opencode/command/spec_kit/deep-review.md:350:- Optimizer manifest: `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:235: * @param {string} [options.fixturesDir] - Path to the fixtures directory.
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:272:  } else if (options.fixturesDir) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:274:      options.fixturesDir,
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:285:    errors.push('Either fixturesDir or jsonlContent must be provided');
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:357: * @param {string} outputPath - File path for the output.
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:359:function saveCorpus(corpus, outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:360:  if (!Array.isArray(corpus) || typeof outputPath !== 'string' || !outputPath) return false;
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:361:  const dir = path.dirname(outputPath);
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:365:  fs.writeFileSync(outputPath, JSON.stringify(corpus, null, 2), 'utf8');
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:372: * @param {string} corpusPath - Path to the corpus JSON file.
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:375:function loadCorpus(corpusPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:376:  if (typeof corpusPath !== 'string' || !corpusPath || !fs.existsSync(corpusPath)) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:380:    const content = fs.readFileSync(corpusPath, 'utf8');
.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json:2:  "$schema": "optimizer-manifest/v1",
.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:118: * @param {object} corpusEntry - A validated corpus entry from replay-corpus.cjs.
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:26:  outputPath: string | null;
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:53:  outputPath: string;
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:102:    outputPath: null,
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:134:      options.outputPath = value;
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:653:function buildNestedChangelogData(specFolderPath: string, options: Pick<CliOptions, 'mode' | 'outputPath'>): NestedChangelogData {
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:668:  const outputPath = buildOutputPath(rootSpecFolder, specFolder, mode, options.outputPath);
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:683:    outputPath: normalizeSlashes(path.relative(CONFIG.PROJECT_ROOT, outputPath)),
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:731:  const absoluteOutputPath = path.join(CONFIG.PROJECT_ROOT, data.outputPath);
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:114:  { mode: 'auto', outputPath: null }
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:116:// nestedChangelog.outputPath -> ".opencode/specs/.../024-compact-code-graph/changelog/changelog-024-029-review-remediation.md"

 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:76:- Non-tunable contract fields are protected by an explicit manifest boundary.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:87:| Search tries to mutate locked fields | H | Enforce the manifest boundary in both search and promotion |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:113:- Build replay corpus, rubric, replay runner, search, promotion, and manifest surfaces for deterministic config tuning
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:7:  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:9:  - "advisory promotion gate"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:52:- **Phase 4a**: replay corpus builder with `040` required, `028` optional as an older holdout, and `042` excluded until it has implementation traces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:79:- Build a replay corpus with packet family `040` as the required source, packet family `028` as an optional structurally older holdout, and packet family `042` excluded until it has real implementation traces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:84:- Add an advisory-only promotion gate that never mutates production config directly while prerequisite fixtures and suites are still missing.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:129:| REQ-001 | Phase 4a MUST build a replay corpus with packet family `040` as the required source corpus. | Corpus inputs are tied to real `040` packet artifacts, normalized into a deterministic replay format, and traceable back to their source runs and metadata. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:165:3. **Given** packet family `042`, **when** corpus intake is evaluated, **then** the optimizer refuses to treat it as replay corpus until implementation traces exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:183:| Dependency | Phase 003 behavioral suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:219:- Two candidate configs tie on rubric score but differ in risk. The promotion gate must keep the safer or more explainable candidate, or refuse promotion.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:45:- [x] Packet family `040` is identified as the required real replay corpus.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:80:- **Advisory promotion gate**: blocks risky candidates and emits patch-style recommendations without mutating canonical configs.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:87:  -> normalize replay corpus
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:239:| Advisory promotion gate | Search, replay, and audit outputs | Patch-style recommendations without live mutation | completion |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:248:- **Session 3**: add random search, audit output, and the optimizer manifest that marks tunable vs locked fields.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/plan.md:249:- **Session 4**: finish the advisory-only promotion gate, docs, and replay-oriented verification. If prerequisite fixtures still do not exist, stop at advisory outputs and do not widen scope into Phase 4b.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:72:**Scope note**: Phase 4a is the realistic near-term track. Packet family `040` is the required replay corpus, `028` is optional holdout data only, and `042` has no implementation traces yet.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:80:- [x] T001 Build the `040` replay corpus extractor, with optional compatibility-graded `028` holdout support and explicit exclusion of `042` until traces exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:114:- [x] T007 Implement the advisory-only promotion gate that refuses production mutation until replay fixtures and behavioral suites exist.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:3:description: "Phase 4a: offline replay optimizer with deterministic config tuning, advisory promotion gate, and full audit trail. Phase 4b prompt/meta optimization remains deferred."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:8:  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:39:The `040` replay corpus extractor harvests real traces from packet family `040` as the required corpus. Packet family `028` is supported as an optional compatibility-graded holdout. Packet family `042` is explicitly excluded until implementation traces exist. The corpus includes structured JSONL artifacts with iteration metadata, convergence signals, and stop decisions.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:59:The promotion gate refuses production mutation until replay fixtures and behavioral suites exist. All current outputs are advisory-only candidate patches that require human review before any canonical config is changed.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:67:Implementation proceeded through 3 sub-phases: corpus/rubric/replay foundation, search/audit/manifest, and advisory promotion gate. 20 files were touched (14 new), adding approximately 3,800 lines. 91 tests cover corpus extraction, rubric scoring, replay determinism, search boundaries, audit persistence, and promotion gate behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md:96:| Advisory-only promotion gate refuses production mutation | PASS |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/graph-metadata.json:16:      "replay corpus",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/graph-metadata.json:18:      "advisory promotion gate",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:126:  • Inventory replay corpus and parameter surfaces across packet families and configs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1039:     8	  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1105:    74	- [ ] T001 Build the replay corpus extractor for packet families `028`, `040`, and `042`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1144:   113	- [ ] T008 Implement the promotion gate that compares candidates to baseline and enforces test success.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1174:     3	description: "Deliver the offline replay optimizer by building a real-run corpus, a scored rubric, a bounded configuration search loop, and a promotion gate that only ships replay-verified improvements."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1180:     9	  - "promotion gate"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:1251:    80	  -> normalize replay corpus
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:3791:I’ve confirmed there’s exactly one substantial in-repo replay corpus today: the `040` research wave with `90` iteration markdown files and a `96`-line JSONL ledger. I’m now tightening the tunable-surface inventory by pulling every threshold, switch, and prompt-bearing file that Phase 4 would realistically optimize, including the agent markdown surfaces the spec hints at.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6192:I’ve now confirmed a key feasibility tension: Phase 4 assumes a multi-family replay corpus, but the actual loop telemetry currently appears concentrated in `040`, while `028` and `042` mostly contribute specs/docs rather than run ledgers. I’m quantifying that gap and summarizing the 040 dataset shape so we can judge whether optimization is realistic now or needs more corpus-building first.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6648:   149	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:6815:    95	  -> add replay corpus, thin end-to-end harnesses, reducer/schema extensions, and integration fixtures early
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7089:One important implementation reality just surfaced: `reduce-state.cjs` is a synchronizer, not a convergence evaluator. It reads the stored JSONL and iteration files, then publishes registry/dashboard state, but it does not recompute stop logic from thresholds itself, which means an offline optimizer would need a new replay evaluator rather than tuning the reducer in isolation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7484:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:7:  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7485:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:9:  - "promotion gate"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7489:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:49:- Existing behavioral and parity test suites as promotion gates.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7490:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:55:- Deterministic replay runner and promotion gate with full audit trail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7493:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:79:- Build a replay corpus from historical packet families `028`, `040`, and `042`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7495:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:83:- Add a promotion gate that requires replay success plus parity and behavioral test success.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7498:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:101:| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and enforce promotion gates. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7506:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:125:| REQ-001 | The phase MUST build a replay corpus from real packet families `028`, `040`, and `042`. | Corpus inputs are tied to real packet artifacts, normalized into a deterministic replay format, and traceable back to their source packets and run metadata. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7516:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:171:| Dependency | Behavioral and parity suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7520:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:204:- Two candidate configs tie on rubric score but differ in risk. The promotion gate must keep the safer or more explainable candidate, or refuse promotion.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7544:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:95:  -> add replay corpus, thin end-to-end harnesses, reducer/schema extensions, and integration fixtures early
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7578:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md:297:| Behavioral | Research/review runtime behavior, stop reasons, journals, snapshots, replay corpus, observability, decomposition, and semantic convergence | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7612:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:8:  - "replay corpus"
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7621:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:74:- [ ] T001 Build the replay corpus extractor for packet families `028`, `040`, and `042`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:7627:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/tasks.md:113:- [ ] T008 Implement the promotion gate that compares candidates to baseline and enforces test success.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8837:- Only `040` is a true replay corpus today: [040 research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/research.md#L4) says the packet has `90` iterations across three waves, and [040 dashboard.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-dashboard.md#L6) shows `90 / 90` complete.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8864:- External evidence supports a staged strategy: [Random Search for Hyper-Parameter Optimization](https://www.jmlr.org/papers/v13/bergstra12a.html) favors random search over grid in large spaces, while [Practical Bayesian Optimization of Machine Learning Algorithms](https://lips.cs.princeton.edu/bibliography/snoek2012practical/) becomes attractive once evaluations are expensive and the objective is stable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8865:Novel insight: the right sequence is not grid vs Bayesian; it is tiny deterministic sweeps first, then bounded random search, then BO only after the replay objective is trustworthy.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8943:- Only `040` is a true replay corpus today: [040 research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/research.md#L4) says the packet has `90` iterations across three waves, and [040 dashboard.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/deep-research-dashboard.md#L6) shows `90 / 90` complete.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8970:- External evidence supports a staged strategy: [Random Search for Hyper-Parameter Optimization](https://www.jmlr.org/papers/v13/bergstra12a.html) favors random search over grid in large spaces, while [Practical Bayesian Optimization of Machine Learning Algorithms](https://lips.cs.princeton.edu/bibliography/snoek2012practical/) becomes attractive once evaluations are expensive and the objective is stable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/scratch/codex-gpt54-deep-research.md:8971:Novel insight: the right sequence is not grid vs Bayesian; it is tiny deterministic sweeps first, then bounded random search, then BO only after the replay objective is trustworthy.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/dispatch-20-iterations.sh:56:  "Phase 004 offline-optimizer: replay corpus extraction, config search bounds, audit trail integrity in .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs and replay-runner.cjs. Check for path traversal in corpus loading, bounds validation in config search, and advisory-only promotion gate enforcement."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/dispatch-20-iterations.sh:57:  "Phase 003-004 spec-code alignment: verify 003-wave-executor/spec.md and 004-offline-loop-optimizer/spec.md claims against the actual wave-*.cjs and optimizer/*.cjs implementations. Check that activation thresholds, segment plans, and replay corpus configs match documented values."
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/checklist.md:33:- [x] CHK-001 [P0] The phase fixes `040` as the required replay corpus and keeps `028` optional while excluding `042` as training input until traces exist. [EVIDENCE: spec.md REQ-001 and REQ-002; implementation-summary.md "Replay Corpus"] [TESTS: optimizer-replay-corpus.vitest.ts]
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/deep-review-strategy.md:265:| 004-offline-loop-optimizer | Phase 4a: replay corpus, rubric, advisory promotion gate. Phase 4b: deferred | mid 042 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-005.md:1304:- Offline replay optimization, config search, and promotion gates from Phase 004.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-001.md:1556:   152	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:569:   152	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:742:   152	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:825:   300	| Coordination | 12/15 | Multiple file families, replay corpus seeding, and phased verification must move together; optional coordination-board mode adds design complexity |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:884:   359	- Q6: Which real packet families should seed the first replay corpus: `028`, `040`, or `042` fixtures?
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:3101:.opencode/skill/sk-deep-review/references/convergence.md:721:The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:3233:.opencode/skill/sk-deep-research/references/convergence.md:1241:The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.

exec
/bin/zsh -lc "rg -n \"buildCorpus\\(|loadCorpus\\(|saveCorpus\\(|randomSearch\\(|evaluateCandidate\\(|savePromotionReport\\(|checkManifestBoundary\\(|sampleConfig\\(\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:157:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:167:      const result = replayCorpus.buildCorpus('028', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:176:      const result = replayCorpus.buildCorpus('042', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:185:      const result = replayCorpus.buildCorpus('999', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:197:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:212:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:220:      const result = replayCorpus.buildCorpus('040', {});
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:244:        replayCorpus.saveCorpus(corpus, tmpPath);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:246:        const loaded = replayCorpus.loadCorpus(tmpPath);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:254:      expect(replayCorpus.loadCorpus('/nonexistent/path.json')).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:286:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:331:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:354:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:366:      const result = replayCorpus.buildCorpus('040', {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:75:  return replayCorpus.buildCorpus('040', { jsonlContent: content }).corpus;
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:113:      const config = search.sampleConfig(search.DEFAULT_PARAM_SPACE, rng);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:127:      const config = search.sampleConfig(space, rng);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:191:      const result = search.randomSearch(corpus, testRubric, undefined, iterations, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:203:      const result1 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:204:      const result2 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:214:      const result = search.randomSearch(corpus, testRubric, undefined, 10, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:231:      const result = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:252:      const result = search.randomSearch(corpus, testRubric, undefined, 3, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts:349:      const config = search.sampleConfig(search.DEFAULT_PARAM_SPACE, rng);
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:60:function sampleConfig(paramSpace, rng) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:145:function randomSearch(corpus, rubric, paramSpace, iterations, options) {
.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:176:    const candidateConfig = sampleConfig(space, rng);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:80:function checkManifestBoundary(candidate, manifest) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:145:function evaluateCandidate(candidate, baselineScore, options) {
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:168:    manifestCheck = checkManifestBoundary(candidate.config, opts.manifest);
.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:317:function savePromotionReport(report, outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:241:function buildCorpus(packetFamily, options = {}) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:359:function saveCorpus(corpus, outputPath) {
.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:375:function loadCorpus(corpusPath) {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts:58:  const result = replayCorpus.buildCorpus('040', { jsonlContent: content });
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:87:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:96:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:105:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:114:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:143:      const result = promote.evaluateCandidate(candidate, baselineScore, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:164:      const result = promote.evaluateCandidate(candidate, baselineScore);
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:175:      const result = promote.evaluateCandidate(candidate, baselineScore, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:192:      const result = promote.evaluateCandidate(candidate, baselineScore, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:213:      const result = promote.evaluateCandidate(candidate, baselineScore, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:235:      const result = promote.evaluateCandidate(candidate, baselineScore, {
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:305:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:314:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:323:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:332:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:341:      const result = promote.checkManifestBoundary(
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts:364:        promote.savePromotionReport(report, tmpPath);

codex
The main risk pattern is getting clearer: the optimizer’s last-line guards are weaker than the packet contract says. I’m pulling exact spec line references now so I can tie each finding back to the promised boundary, not just the implementation detail.
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md | sed -n '76,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    76	
    77	### In Scope
    78	
    79	- Build a replay corpus with packet family `040` as the required source, packet family `028` as an optional structurally older holdout, and packet family `042` excluded until it has real implementation traces.
    80	- Define a rubric for finding accuracy, convergence efficiency, recovery success rate, and synthesis quality.
    81	- Add configuration-search logic for deterministic numeric settings such as convergence thresholds, stuck detection, and recovery escalation.
    82	- Add a deterministic replay runner for reducer and convergence logic under alternate configs.
    83	- Add a canonical optimizer manifest that declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
    84	- Add an advisory-only promotion gate that never mutates production config directly while prerequisite fixtures and suites are still missing.
    85	- Record a full audit trail for every optimization attempt, including rejected candidates and patch-style recommendations.
    86	
    87	### Out of Scope
    88	
    89	- Online reinforcement or live-production auto-tuning.
    90	- Replacing human review of candidate configs.
    91	- Inventing new runtime artifacts outside the traces already produced by Phases 001 through 003.
    92	- Broad model selection or vendor-routing work unrelated to deep-loop runtime tuning.
    93	- Direct mutation of canonical agent `.md` files during optimization. Agent markdown remains behavior documentation, not an optimizer template surface.
    94	- Full prompt optimization, cross-packet meta-learning, and automatic production promotion in the current phase scope.
    95	
    96	### Files to Change
    97	
    98	| File Path | Change Type | Description |
    99	|-----------|-------------|-------------|
   100	| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
   101	| `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs` | Create | Score runs across accuracy, convergence efficiency, recovery success, and synthesis quality. |
   102	| `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs` | Create | Search bounded deterministic numeric config candidates. |
   103	| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
   104	| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and emit advisory-only candidate patches. |
   105	| `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Create | Canonical manifest of tunable fields, locked contract fields, and future prompt-pack entrypoints. |
   106	| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
   107	| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
   108	| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
   109	| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
   110	| `.opencode/command/spec_kit/deep-research.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
   111	| `.opencode/command/spec_kit/deep-review.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
   112	| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
   113	| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts` | Create | Verify scoring rules and metric weighting behavior. |
   114	| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` | Create | Verify search-space handling and candidate bookkeeping. |
   115	| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
   116	| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify advisory promotion gating, rollback behavior, and audit output. |
   117	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures, optimization-result snapshots, and advisory patch artifacts. |
   118	<!-- /ANCHOR:scope -->
   119	
   120	---
   121	
   122	<!-- ANCHOR:requirements -->
   123	## 4. REQUIREMENTS
   124	
   125	### P0 - Blockers (MUST complete)
   126	
   127	| ID | Requirement | Acceptance Criteria |
   128	|----|-------------|---------------------|
   129	| REQ-001 | Phase 4a MUST build a replay corpus with packet family `040` as the required source corpus. | Corpus inputs are tied to real `040` packet artifacts, normalized into a deterministic replay format, and traceable back to their source runs and metadata. |
   130	| REQ-002 | Packet family `028` MAY be ingested as an optional holdout corpus, but only with compatibility grading because it is older and structurally different; packet family `042` MUST NOT be treated as corpus input until it has real implementation traces. | Corpus ingestion records source-family compatibility, marks `028` as optional holdout only, and rejects `042` as a training corpus until live traces exist. |
   131	| REQ-003 | The optimizer MUST define a rubric that scores run quality across finding accuracy, convergence efficiency, recovery success rate, and synthesis quality. | The rubric exposes explicit metric definitions, weighting, and score outputs; the phase does not rely on one opaque "goodness" number. |
   132	| REQ-004 | Phase 4a MUST provide a deterministic replay runner that can evaluate alternate configs without running live agent iterations. | Replay consumes stored traces and config candidates, produces repeatable outputs, and isolates replay from live network or human-in-the-loop variability. |
   133	| REQ-005 | The phase MUST define a canonical optimizer manifest that separates tunable fields, locked contract fields, and prompt-pack entrypoints. | A single manifest names each optimizer-managed field family, each locked lifecycle or schema contract field, and each future prompt-pack insertion point. |
   134	| REQ-006 | No production promotion is allowed until the replay fixtures planned in Phase 1 and the behavioral suites planned in Phase 3 actually exist. | Until both prerequisite surfaces exist, all optimizer outputs are advisory-only candidate patches or reports and must not directly mutate canonical production configs. |
   135	
   136	### P1 - Required (complete OR user-approved deferral)
   137	
   138	| ID | Requirement | Acceptance Criteria |
   139	|----|-------------|---------------------|
   140	| REQ-007 | Phase 4a search MUST stay within deterministic numeric config families such as convergence thresholds, stuck sensitivity, and recovery escalation. | Search configuration covers the allowed deterministic tunable dimensions, excludes locked contract fields, and records which candidates touched which parameter families. |
   141	| REQ-008 | Every optimization run MUST emit an audit trail that records what was tried, what improved, what regressed, and why a candidate was accepted or rejected. | Audit output exists for every run, including failed searches and rejected advisory promotions, and captures both candidate settings and evaluation outcomes. |
   142	| REQ-009 | Optimizer scoring MUST incorporate graph and wave metrics when those traces are available, without inventing fake values for older runs. | The corpus and rubric can consume Phase 002 or Phase 003 signals when present, and explicitly mark them unavailable for older traces instead of fabricating them. |
   143	| REQ-010 | If prompt optimization remains in scope for deferred Phase 4b, it MUST operate on generated prompt packs or patch artifacts rather than directly mutating agent `.md` files. | Prompt candidates are expressed as generated pack outputs or patch artifacts that can be replayed, diffed, tested, and rolled back independently of canonical agent markdown. |
   144	| REQ-011 | If cross-packet meta-learning remains in future scope, it MUST introduce a task-shape metadata model before learning across packets is allowed. | No meta-learning work proceeds without explicit metadata for task shape, scope, and domain clustering plus at least two compatible packet families. |
   145	<!-- /ANCHOR:requirements -->
   146	
   147	---
   148	
   149	<!-- ANCHOR:success-criteria -->
   150	## 5. SUCCESS CRITERIA
   151	
   152	- **SC-001**: The optimizer corpus is built from real packet traces, with `040` as the required source family.
   153	- **SC-002**: Rubric scores are broken down by quality dimension, not hidden behind one opaque number.
   154	- **SC-003**: Replay is deterministic enough to compare baseline and candidate configs reliably.
   155	- **SC-004**: Search scope is bounded to deterministic numeric config families for Phase 4a.
   156	- **SC-005**: Promotion remains advisory-only until replay fixtures and behavioral suites exist.
   157	- **SC-006**: Every optimization run produces a reviewable audit trail.
   158	- **SC-007**: The optimizer manifest keeps tunable and locked fields explicit and rollback-friendly.
   159	- **SC-008**: Any future prompt optimization route is expressed as prompt packs or patch artifacts rather than direct agent-markdown mutation.
   160	
   161	### Acceptance Scenarios
   162	
   163	1. **Given** packet family `040`, **when** the corpus builder runs, **then** it emits deterministic replay inputs tied back to its source runs and metadata.
   164	2. **Given** packet family `028`, **when** the corpus builder attempts ingestion, **then** it records compatibility grading and treats `028` as an optional holdout instead of a required training corpus.
   165	3. **Given** packet family `042`, **when** corpus intake is evaluated, **then** the optimizer refuses to treat it as replay corpus until implementation traces exist.
   166	4. **Given** a candidate config improves convergence efficiency but harms accuracy, **when** rubric scoring runs, **then** the breakdown shows the trade-off explicitly instead of hiding it.
   167	5. **Given** the same baseline trace and candidate config, **when** replay runs twice, **then** the resulting score and decision outputs remain stable.
   168	6. **Given** a candidate outperforms baseline in replay but the Phase 1 replay fixtures or Phase 3 behavioral suites do not yet exist, **when** promotion runs, **then** the optimizer emits only an advisory patch or report and refuses production promotion.
   169	7. **Given** an older packet trace lacks graph or wave metrics, **when** scoring runs, **then** the audit trail marks those dimensions unavailable rather than inventing placeholder values.
   170	8. **Given** a candidate touches a non-tunable contract field, **when** promotion eligibility is checked, **then** the optimizer rejects the candidate as out of bounds.
   171	9. **Given** a future prompt candidate, **when** optimization is attempted, **then** the system works through a generated prompt pack or patch artifact rather than mutating agent `.md` files directly.
   172	<!-- /ANCHOR:success-criteria -->
   173	
   174	---
   175	
   176	<!-- ANCHOR:risks -->
   177	## 6. RISKS & DEPENDENCIES
   178	
   179	| Type | Item | Impact | Mitigation |
   180	|------|------|--------|------------|
   181	| Dependency | Phase 001-003 traces must be stable and sufficiently rich | High | Limit corpus intake to runs with trustworthy runtime artifacts and record gaps explicitly. |
   182	| Dependency | Phase 001 replay fixtures must exist before promotion can graduate beyond advisory reports | High | Treat missing replay fixtures as a hard promotion block and keep outputs patch-only. |
   183	| Dependency | Phase 003 behavioral suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
   184	| Risk | Replay fidelity is too low to support fair candidate comparisons | High | Keep replay deterministic, tie it to stored traces, and reject promotion when fidelity is insufficient. |
   185	| Risk | Optimization without behavioral tests could promote broken configs | High | Keep promotion advisory-only until the behavioral suite exists and passes. |
   186	| Risk | Search space grows too broad and hides why a candidate improved | Medium | Start with bounded numeric parameter families and require audit logs for every search step. |
   187	| Risk | Optimizer starts changing fields that should remain human-governed | Medium | Mark optimizer-managed fields explicitly in runtime configs and docs. |
   188	| Risk | Single-family corpus limits generalization | High | Treat `040` as a pilot corpus, treat `028` as optional holdout only, and defer meta-learning until 2+ compatible families exist. |
   189	| Risk | Optional holdout `028` is structurally incompatible with modern replay assumptions | Medium | Compatibility-grade it explicitly and never require it for Phase 4a success. |
   190	<!-- /ANCHOR:risks -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md | sed -n '32,98p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    32	<!-- ANCHOR:adr-001-context -->
    33	### Context
    34	
    35	We needed a safe way to improve deep-loop runtime configs using real traces, but the repo did not yet have the replay fixtures, behavioral suites, or multi-family corpus coverage needed for broad prompt or meta-optimization. The phase had to produce real value now without pretending the wider optimizer vision was already safe, and it had to stop the optimizer from mutating locked contract fields or applying production config changes directly.
    36	
    37	### Constraints
    38	
    39	- Production configs could not be mutated directly by the new optimizer.
    40	- Prompt optimization could not edit canonical agent markdown files directly.
    41	- Promotion had to fail closed when prerequisite replay or behavior evidence was missing.
    42	<!-- /ANCHOR:adr-001-context -->
    43	
    44	---
    45	
    46	<!-- ANCHOR:adr-001-decision -->
    47	### Decision
    48	
    49	**We chose**: deliver Phase 4a as a deterministic offline config optimizer now, keep Phase 4b prompt/meta optimization explicitly deferred, and bound all current promotion output to advisory-only candidate patches or reports.
    50	
    51	**How it works**: Phase 4a focuses on corpus extraction, rubric scoring, deterministic replay, bounded numeric search, audit output, and advisory patch generation. Search can mutate only optimizer-managed numeric fields declared in the manifest, and promotion refuses direct production mutation until stronger replay and behavioral gates exist and pass.
    52	<!-- /ANCHOR:adr-001-decision -->
    53	
    54	---
    55	
    56	<!-- ANCHOR:adr-001-alternatives -->
    57	### Alternatives Considered
    58	
    59	| Option | Pros | Cons | Score |
    60	|--------|------|------|-------|
    61	| **Deterministic config optimization now with advisory-only promotion** | Delivers real value with a clear safety envelope | Leaves some ambitious optimization ideas intentionally deferred and still requires human review | 9/10 |
    62	| Build prompt and meta optimization immediately | Bigger theoretical upside | Unsafe without replay fixtures, behavioral suites, and multi-family data | 3/10 |
    63	| Direct production mutation after replay score improvement | Fastest path to applied tuning | Too risky without stronger replay and behavioral validation | 2/10 |
    64	
    65	**Why this one**: It captures the part of the optimizer story that is already supportable by repo evidence while keeping the rest clearly fenced off.
    66	<!-- /ANCHOR:adr-001-alternatives -->
    67	
    68	---
    69	
    70	<!-- ANCHOR:adr-001-consequences -->
    71	### Consequences
    72	
    73	**What improves**:
    74	- The packet gets a realistic replay-based improvement loop immediately.
    75	- Candidate tuning remains reviewable, explainable, and rollback-friendly.
    76	- Non-tunable contract fields are protected by an explicit manifest boundary.
    77	
    78	**What it costs**:
    79	- Phase 4b remains visibly deferred and humans still need to review accepted candidates. Mitigation: keep the prerequisites and audit outputs explicit.
    80	
    81	**Risks**:
    82	
    83	| Risk | Impact | Mitigation |
    84	|------|--------|------------|
    85	| Deferred scope is mistaken for unfinished delivery | M | Keep Phase 4a and Phase 4b language explicit in all phase docs |
    86	| Replay-based tuning is over-trusted without broader validation | H | Keep outputs advisory only until stronger gates exist |
    87	| Search tries to mutate locked fields | H | Enforce the manifest boundary in both search and promotion |
    88	| Advisory candidates are treated as production-ready anyway | H | Make advisory-only status explicit across spec, plan, tasks, checklist, and implementation summary |
    89	<!-- /ANCHOR:adr-001-consequences -->
    90	
    91	---
    92	
    93	<!-- ANCHOR:adr-001-five-checks -->
    94	### Five Checks Evaluation
    95	
    96	| # | Check | Result | Evidence |
    97	|---|-------|--------|----------|
    98	| 1 | **Necessary?** | PASS | The phase needed a safe near-term optimizer story |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "$schema": "optimizer-manifest/v1",
     3	  "description": "Canonical manifest declaring which fields are tunable by the offline loop optimizer, which are locked runtime contracts, and which are deferred prompt-pack entrypoints.",
     4	  "version": "1.0.0",
     5	  "lastUpdated": "2026-04-10",
     6	
     7	  "tunableFields": [
     8	    {
     9	      "name": "convergenceThreshold",
    10	      "type": "number",
    11	      "description": "General convergence sensitivity threshold. Lower values require more convergence before stopping.",
    12	      "range": { "min": 0.01, "max": 0.20 },
    13	      "products": ["deep-research", "deep-review"],
    14	      "configPaths": [
    15	        ".opencode/skill/sk-deep-research/assets/deep_research_config.json",
    16	        ".opencode/skill/sk-deep-review/assets/deep_review_config.json"
    17	      ]
    18	    },
    19	    {
    20	      "name": "stuckThreshold",
    21	      "type": "integer",
    22	      "description": "Number of consecutive no-progress iterations before stuck recovery is triggered.",
    23	      "range": { "min": 1, "max": 5 },
    24	      "products": ["deep-research", "deep-review"],
    25	      "configPaths": [
    26	        ".opencode/skill/sk-deep-research/assets/deep_research_config.json",
    27	        ".opencode/skill/sk-deep-review/assets/deep_review_config.json"
    28	      ]
    29	    },
    30	    {
    31	      "name": "maxIterations",
    32	      "type": "integer",
    33	      "description": "Hard ceiling on loop iterations. Controls maximum compute budget.",
    34	      "range": { "min": 3, "max": 20 },
    35	      "products": ["deep-research", "deep-review"],
    36	      "configPaths": [
    37	        ".opencode/skill/sk-deep-research/assets/deep_research_config.json",
    38	        ".opencode/skill/sk-deep-review/assets/deep_review_config.json"
    39	      ]
    40	    },
    41	    {
    42	      "name": "noProgressThreshold",
    43	      "type": "number",
    44	      "description": "New-info ratio below which an iteration is classified as no-progress.",
    45	      "range": { "min": 0.01, "max": 0.15 },
    46	      "products": ["deep-research", "deep-review"],
    47	      "configPaths": []
    48	    },
    49	    {
    50	      "name": "compositeStopScore",
    51	      "type": "number",
    52	      "description": "Weighted stop score needed before guard evaluation passes.",
    53	      "range": { "min": 0.40, "max": 0.80 },
    54	      "products": ["deep-review"],
    55	      "configPaths": []
    56	    }
    57	  ],
    58	
    59	  "lockedFields": [
    60	    {
    61	      "name": "type",
    62	      "reason": "JSONL schema contract — record type discriminator must not change.",
    63	      "contract": "JSONL schema"
    64	    },
    65	    {
    66	      "name": "stopReason",
    67	      "reason": "Stop-reason enum is a runtime contract shared across all consumers.",
    68	      "contract": "convergence contract"
    69	    },
    70	    {
    71	      "name": "legalStop",
    72	      "reason": "Legal-stop record structure is a runtime contract used by reducers and dashboards.",
    73	      "contract": "convergence contract"
    74	    },
    75	    {
    76	      "name": "lineageMode",
    77	      "reason": "Lineage semantics (new/resume/fork/restart) are lifecycle contracts.",
    78	      "contract": "session lifecycle"
    79	    },
    80	    {
    81	      "name": "fileProtection",
    82	      "reason": "File protection policies are governance contracts, not tunable parameters.",
    83	      "contract": "file governance"
    84	    },
    85	    {
    86	      "name": "reducer",
    87	      "reason": "Reducer configuration defines the state-management contract.",
    88	      "contract": "reducer contract"
    89	    },
    90	    {
    91	      "name": "sessionId",
    92	      "reason": "Session identity is a lifecycle contract.",
    93	      "contract": "session lifecycle"
    94	    },
    95	    {
    96	      "name": "mode",
    97	      "reason": "Product mode (research/review) is an identity field, not a tunable.",
    98	      "contract": "product identity"
    99	    },
   100	    {
   101	      "name": "reviewDimensions",
   102	      "reason": "Review dimensions define the product scope, not numeric tuning surface.",
   103	      "contract": "product identity"
   104	    }
   105	  ],
   106	
   107	  "deferredPromptPackEntrypoints": [
   108	    {
   109	      "name": "iterationPromptPack",
   110	      "status": "DEFERRED",
   111	      "reason": "Phase 4b — requires behavioral test suite + 2+ corpus families before prompt optimization is safe.",
   112	      "prerequisite": "T008"
   113	    },
   114	    {
   115	      "name": "recoveryPromptPack",
   116	      "status": "DEFERRED",
   117	      "reason": "Phase 4b — recovery strategy prompts must be tested via behavioral suites before optimization.",
   118	      "prerequisite": "T008"
   119	    },
   120	    {
   121	      "name": "synthesisPromptPack",
   122	      "status": "DEFERRED",
   123	      "reason": "Phase 4b — synthesis prompt quality requires end-to-end behavioral validation.",
   124	      "prerequisite": "T008"
   125	    }
   126	  ],
   127	
   128	  "governance": {
   129	    "promotionMode": "advisory-only",
   130	    "autoPromotionAllowed": false,
   131	    "autoPromotionPrerequisites": [
   132	      "Phase 1 replay fixtures exist",
   133	      "Phase 3 behavioral suites exist and pass",
   134	      "At least 2 compatible corpus families available"
   135	    ],
   136	    "rollbackPolicy": "All promoted configs must be reversible via the prior baseline config stored in the audit trail."
   137	  }
   138	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/implementation-summary.md | sed -n '34,100p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    34	
    35	Deep-loop configs can now be tuned offline against real packet traces without experimenting live in production. Phase 4a delivers a complete compile/evaluate loop: harvest traces, score them with a rubric, search bounded deterministic config space, replay candidates, and emit advisory candidate patches with a full audit trail.
    36	
    37	### Replay Corpus
    38	
    39	The `040` replay corpus extractor harvests real traces from packet family `040` as the required corpus. Packet family `028` is supported as an optional compatibility-graded holdout. Packet family `042` is explicitly excluded until implementation traces exist. The corpus includes structured JSONL artifacts with iteration metadata, convergence signals, and stop decisions.
    40	
    41	### Quality Rubric
    42	
    43	A multi-dimensional rubric scores convergence efficiency, recovery success rate, finding accuracy, and synthesis quality. Each dimension produces a normalized score that feeds into the search and promotion stages.
    44	
    45	### Deterministic Replay Runner
    46	
    47	The replay runner executes baseline and candidate configs against the same corpus traces deterministically. Replay results are comparable across runs because the runner controls all non-deterministic inputs.
    48	
    49	### Random-Search Config Optimizer
    50	
    51	The search module generates candidate configs by perturbing bounded deterministic numeric fields within the optimizer-managed config surface. Only fields declared tunable in the optimizer manifest are eligible for mutation. Locked contract fields and future prompt-pack entrypoints are explicitly excluded.
    52	
    53	### Audit Trail
    54	
    55	Every optimization run produces durable audit output covering both accepted and rejected candidates. Advisory patch artifacts include the candidate config diff, rubric scores, replay comparison, and a human-readable recommendation. Rejected candidates are preserved with the same audit detail.
    56	
    57	### Advisory-Only Promotion Gate
    58	
    59	The promotion gate refuses production mutation until replay fixtures and behavioral suites exist. All current outputs are advisory-only candidate patches that require human review before any canonical config is changed.
    60	<!-- /ANCHOR:what-built -->
    61	
    62	---
    63	
    64	<!-- ANCHOR:how-delivered -->
    65	## How It Was Delivered
    66	
    67	Implementation proceeded through 3 sub-phases: corpus/rubric/replay foundation, search/audit/manifest, and advisory promotion gate. 20 files were touched (14 new), adding approximately 3,800 lines. 91 tests cover corpus extraction, rubric scoring, replay determinism, search boundaries, audit persistence, and promotion gate behavior.
    68	<!-- /ANCHOR:how-delivered -->
    69	
    70	---
    71	
    72	<!-- ANCHOR:decisions -->
    73	## Key Decisions
    74	
    75	| Decision | Why |
    76	|----------|-----|
    77	| Deterministic `4a` now, `4b` deferred | Safe near-term scope is narrower than originally drafted; prompt/meta optimization needs replay fixtures and behavioral suites first |
    78	| Advisory-only promotion until prerequisites exist | Prevents unsafe live mutation from an optimizer that lacks production-grade replay validation |
    79	| Optimizer manifest separates tunable vs locked fields | Config governance prevents optimizer from mutating runtime contracts or non-numeric surfaces |
    80	| `040` as required corpus, `028` as optional holdout | `040` has real implementation traces; `028` has older compatibility-graded data |
    81	| Prompt work via packs/patches, not direct agent markdown edits | Keeps prompt changes replayable, rollback-safe, and auditable |
    82	<!-- /ANCHOR:decisions -->
    83	
    84	---
    85	
    86	<!-- ANCHOR:verification -->
    87	## Verification
    88	
    89	| Check | Result |
    90	|-------|--------|
    91	| Replay corpus extraction from `040` traces | PASS (91 tests) |
    92	| Quality rubric multi-dimensional scoring | PASS |
    93	| Deterministic replay produces comparable results | PASS |
    94	| Search stays within optimizer-managed config boundaries | PASS |
    95	| Audit trail preserves accepted and rejected candidates | PASS |
    96	| Advisory-only promotion gate refuses production mutation | PASS |
    97	| Phase 4b tasks remain blocked with explicit prerequisites | PASS |
    98	<!-- /ANCHOR:verification -->
    99	
   100	---

codex
I’ve got enough static evidence for likely findings, and I’m doing one quick runtime sanity pass with tiny `node -e` probes. That will let me confirm whether the boundary gaps are actually reachable in the shipped helper APIs, not just theoretical from reading the source.
2026-04-12T10:00:28.933659Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const fs = require('fs');
const path = require('path');
const os = require('os');
const replayCorpus = require('./.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs');
const p = path.join(process.cwd(), 'package.json');
console.log(fs.existsSync(p), Array.isArray(replayCorpus.loadCorpus(p)), replayCorpus.loadCorpus(p).length);
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-12T10:00:28.933701Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const promote = require('./.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs');
const candidate = { config: { stopReason: 'converged' }, score: { composite: 0.9, perDimension: {} } };
const baseline = { composite: 0.6, perDimension: {} };
console.log(JSON.stringify(promote.evaluateCandidate(candidate, baseline), null, 2));
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-12T10:00:28.933723Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const search = require('./.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs');
const rng = () => 0.5;
const space = { stopReason: { min: 0, max: 1, step: 1 }, convergenceThreshold: { min: 0.001, max: 0.99, step: 0.989 } };
console.log(JSON.stringify(search.sampleConfig(space, rng), null, 2));
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
codex
The sandbox blocked heredoc temp files, so I’m switching those probes to single-line `node -e` calls. I only need a couple of direct confirmations now, then I can finalize the findings with exact evidence.
exec
/bin/zsh -lc "node -e \"const promote=require('./.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs'); const candidate={config:{stopReason:'converged'},score:{composite:0.9,perDimension:{}}}; const baseline={composite:0.6,perDimension:{}}; console.log(JSON.stringify(promote.evaluateCandidate(candidate, baseline)));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{"decision":"advisory-accept","improved":true,"regressions":[],"improvements":["Composite score improved: 0.600 -> 0.900"],"manifestCheck":null,"prerequisiteCheck":{"allMet":false,"results":{"replayFixturesExist":false,"behavioralSuitesExist":false},"missing":["replayFixturesExist","behavioralSuitesExist"]},"advisoryOnly":true}

exec
/bin/zsh -lc "node -e \"const replayCorpus=require('./.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs'); const p=require('path').join(process.cwd(),'package.json'); const loaded=replayCorpus.loadCorpus(p); console.log(JSON.stringify({path:p,isArray:Array.isArray(loaded),length:loaded.length}));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{"path":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/package.json","isArray":true,"length":0}

exec
/bin/zsh -lc "node -e \"const search=require('./.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs'); const rng=()=>0.5; const space={stopReason:{min:0,max:1,step:1},convergenceThreshold:{min:0.001,max:0.99,step:0.989}}; console.log(JSON.stringify(search.sampleConfig(space,rng)));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{"stopReason":1,"convergenceThreshold":0.99}

exec
/bin/zsh -lc "rg -l '"'^'"\\s*\\[' -g '*.json' . | head -n 20" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
./.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/AutoAgent-main/evaluation/multihoprag/result.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/05--lifecycle.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/11--scoring-and-calibration.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/07--evaluation.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/17--governance.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/22--context-preservation-and-code-graph.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/01--retrieval.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/18--ux-hooks.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/manual-playbook-results.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/16--tooling-and-scripts.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/03--discovery.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/14--pipeline-architecture.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/20--remediation-revalidation.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/21--implement-and-remove-deprecated-features.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/19--feature-flag-reference.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/10--graph-signal-activation.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/06--analysis.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/09--evaluation-and-measurement.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/04--maintenance.json
./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/13--memory-quality-and-indexing.json

exec
/bin/zsh -lc "node -e \"const replayCorpus=require('./.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs'); const p=require('path').join(process.cwd(),'.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/deep-review-state.jsonl'); console.log(JSON.stringify(replayCorpus.buildCorpus('040',{fixturesDir:'./.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay'})));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{"corpus":[{"id":"040-replay-040-fixture","packetFamily":"040","sourceRun":"replay-040-fixture","compatibilityGrade":"full","role":"primary","config":{"maxIterations":7,"convergenceThreshold":0.1,"stuckThreshold":2,"mode":"review","topic":"Replay fixture for 040"},"iterations":[{"run":1,"status":"complete","focus":"Initial review","findingsCount":3,"newInfoRatio":0.85,"convergenceSignals":null,"durationMs":60000,"timestamp":"2026-03-20T14:10:00Z"},{"run":2,"status":"complete","focus":"Follow-up review","findingsCount":4,"newInfoRatio":0.3,"convergenceSignals":null,"durationMs":55000,"timestamp":"2026-03-20T14:20:00Z"},{"run":3,"status":"complete","focus":"Final pass","findingsCount":4,"newInfoRatio":0.05,"convergenceSignals":{"rollingAvg":0.08,"madScore":0.04,"noveltyRatio":0.05,"compositeStop":0.65},"durationMs":50000,"timestamp":"2026-03-20T14:30:00Z"}],"stopOutcome":{"stopReason":"converged","legalStop":null,"totalIterations":3,"verdict":"PASS"},"metadata":{"extractedAt":"2026-04-12T10:00:47.438Z","sourceRecordCount":5,"hasGraphMetrics":false,"hasWaveMetrics":false,"validationErrors":[]}}],"errors":[],"warnings":["Corpus entry 040-replay-040-fixture: graph metrics unavailable (older trace format)","Corpus entry 040-replay-040-fixture: wave metrics unavailable (older trace format)"],"familyInfo":{"role":"primary","required":true,"compatibilityGrade":"full"}}

exec
/bin/zsh -lc "node -e \"const replayCorpus=require('./.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs'); const p=require('path').join(process.cwd(),'.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/05--lifecycle.json'); const loaded=replayCorpus.loadCorpus(p); console.log(JSON.stringify({path:p,isArray:Array.isArray(loaded),length:loaded.length,firstType:loaded[0]&&typeof loaded[0]}));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{"path":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report/05--lifecycle.json","isArray":true,"length":10,"firstType":"object"}

Completed focused security review of Phase 004 optimizer spec, core modules, surrounding manifest/tests, and historical review context. I verified the main boundary behaviors with direct node probes where the sandbox allowed it.
  ✓ Load relevant memory/skill/spec context for Phase 004 offline optimizer
  ✓ Read replay corpus and runner implementation plus referenced helpers/config surfaces
  ✓ Assess path traversal, bounds validation, and promotion gate enforcement
  → Summarize findings with exact file/line evidence and coverage notes
codex
**Findings**

Finding ID: `F-006-001`  
Severity: `P1`  
Dimension: `security`  
File: [promote.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:317)  
Line: `317-325`  
Title: Advisory report writes can overwrite arbitrary repo paths  
Description: The phase contract says promotion output must remain advisory-only and must not directly mutate canonical production configs, but `savePromotionReport()` will write JSON to any caller-supplied `outputPath`. A buggy or malicious caller can point this at a real config or any other writable repo file, which collapses the “advisory-only” safety boundary into an arbitrary file write primitive.  
Evidence: `savePromotionReport()` derives `dir = path.dirname(outputPath)`, creates it recursively, then calls `fs.writeFileSync(outputPath, ...)` with no root, symlink, or file-class checks. This contradicts [004-offline-loop-optimizer/spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:134) and [decision-record.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:35), which require no direct production mutation.  
Recommendation: Restrict report output to a dedicated audit directory, resolve and verify the real path stays under that root, reject symlinks and existing non-audit targets, and fail closed on any path escape attempt.

Finding ID: `F-006-002`  
Severity: `P1`  
Dimension: `security`  
File: [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:60)  
Line: `60-73`, `145-177`  
Title: Config search accepts out-of-bounds and locked-field mutations  
Description: Phase 004 promises that search stays inside deterministic numeric, manifest-governed fields, but `sampleConfig()` and `randomSearch()` trust any caller-provided `paramSpace`. There is no validation that fields are tunable, numeric, finite, within manifest range, or even sane (`step > 0`, `min <= max`). That lets callers generate candidates for locked fields and impossible bounds before the promotion layer ever sees them.  
Evidence: `sampleConfig()` blindly iterates `Object.entries(paramSpace)`, and `randomSearch()` passes that output straight into evaluation and the audit trail. Direct probe result: `{"stopReason":1,"convergenceThreshold":0.99}` was accepted from a custom parameter space, even though the manifest marks `stopReason` locked and caps `convergenceThreshold` at `0.20` in [optimizer-manifest.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json:59). That violates [REQ-007](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:140) and the ADR claim that search mutates only manifest-managed numeric fields.  
Recommendation: Derive the effective search space from the canonical manifest, reject unknown/locked fields, validate `min/max/step` rigorously, and add regression tests for malicious custom `paramSpace` input.

Finding ID: `F-006-003`  
Severity: `P1`  
Dimension: `security`  
File: [promote.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:165)  
Line: `165-180`  
Title: Promotion boundary enforcement is optional instead of fail-closed  
Description: The manifest check is treated as optional plumbing. If a caller forgets or omits `options.manifest`, `evaluateCandidate()` skips locked-field enforcement entirely and can return `advisory-accept` for a candidate that touches forbidden contract fields. Because this is the last policy gate before generating “approved” advisory artifacts, omission becomes a bypass.  
Evidence: The code only runs `checkManifestBoundary()` inside `if (opts.manifest)`. Direct probe result: passing `{ config: { stopReason: 'converged' }, score: { composite: 0.9 } }` without a manifest returned `decision:"advisory-accept"` and `manifestCheck:null`. That breaks acceptance scenario 8 in [004-offline-loop-optimizer/spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:170) and the ADR requirement for an explicit manifest boundary.  
Recommendation: Make the manifest mandatory for evaluation, or load the canonical manifest internally by default and block when it is unavailable.

Finding ID: `F-006-004`  
Severity: `P2`  
Dimension: `security`  
File: [replay-corpus.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:272)  
Line: `272-282`, `359-365`, `375-384`  
Title: Corpus helpers are path-agnostic and mask integrity failures  
Description: The corpus layer trusts caller-controlled filesystem locations for fixture loading, corpus saving, and corpus loading. That is enough path-escape surface for future CLI/operator wiring, and `loadCorpus()` further hides corruption by collapsing parse/type failures into `[]`, making a tampered corpus indistinguishable from an empty one.  
Evidence: `buildCorpus()` joins arbitrary `fixturesDir`, `saveCorpus()` writes any `outputPath`, and `loadCorpus()` reads any existing JSON path. Direct probe result: `loadCorpus()` successfully loaded an unrelated array JSON from another spec folder (`length: 10`), proving there is no corpus-root confinement.  
Recommendation: Constrain reads and writes to approved corpus/audit roots, reject symlink escapes, and return explicit integrity errors for malformed or unexpected corpus files instead of silently returning an empty array.

**Iteration Summary**  
Total findings: `4`  
Breakdown: `0 P0`, `3 P1`, `1 P2`

**Coverage Assessment**  
Reviewed about `95%` of the stated focus area: the phase spec/ADR/implementation summary, `replay-corpus.cjs`, `replay-runner.cjs`, `search.cjs`, `promote.cjs`, the optimizer manifest, and the related vitest suites. I did not find a standalone security issue inside `replay-runner.cjs`; the material risks were in the surrounding boundary enforcement and persistence helpers.

**Confidence**  
`high`

**Next Priorities**  
Inspect any CLI/workflow surface that will eventually expose these optimizer helpers, especially anything that passes `fixturesDir`, `outputPath`, `corpusPath`, or custom search bounds from user input. The next security pass should also verify whether any downstream consumer persists advisory outputs or applies candidate configs without re-running the manifest gate.
hook: Stop
hook: Stop Completed
tokens used
159,669
**Findings**

Finding ID: `F-006-001`  
Severity: `P1`  
Dimension: `security`  
File: [promote.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:317)  
Line: `317-325`  
Title: Advisory report writes can overwrite arbitrary repo paths  
Description: The phase contract says promotion output must remain advisory-only and must not directly mutate canonical production configs, but `savePromotionReport()` will write JSON to any caller-supplied `outputPath`. A buggy or malicious caller can point this at a real config or any other writable repo file, which collapses the “advisory-only” safety boundary into an arbitrary file write primitive.  
Evidence: `savePromotionReport()` derives `dir = path.dirname(outputPath)`, creates it recursively, then calls `fs.writeFileSync(outputPath, ...)` with no root, symlink, or file-class checks. This contradicts [004-offline-loop-optimizer/spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:134) and [decision-record.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record.md:35), which require no direct production mutation.  
Recommendation: Restrict report output to a dedicated audit directory, resolve and verify the real path stays under that root, reject symlinks and existing non-audit targets, and fail closed on any path escape attempt.

Finding ID: `F-006-002`  
Severity: `P1`  
Dimension: `security`  
File: [search.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:60)  
Line: `60-73`, `145-177`  
Title: Config search accepts out-of-bounds and locked-field mutations  
Description: Phase 004 promises that search stays inside deterministic numeric, manifest-governed fields, but `sampleConfig()` and `randomSearch()` trust any caller-provided `paramSpace`. There is no validation that fields are tunable, numeric, finite, within manifest range, or even sane (`step > 0`, `min <= max`). That lets callers generate candidates for locked fields and impossible bounds before the promotion layer ever sees them.  
Evidence: `sampleConfig()` blindly iterates `Object.entries(paramSpace)`, and `randomSearch()` passes that output straight into evaluation and the audit trail. Direct probe result: `{"stopReason":1,"convergenceThreshold":0.99}` was accepted from a custom parameter space, even though the manifest marks `stopReason` locked and caps `convergenceThreshold` at `0.20` in [optimizer-manifest.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json:59). That violates [REQ-007](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:140) and the ADR claim that search mutates only manifest-managed numeric fields.  
Recommendation: Derive the effective search space from the canonical manifest, reject unknown/locked fields, validate `min/max/step` rigorously, and add regression tests for malicious custom `paramSpace` input.

Finding ID: `F-006-003`  
Severity: `P1`  
Dimension: `security`  
File: [promote.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:165)  
Line: `165-180`  
Title: Promotion boundary enforcement is optional instead of fail-closed  
Description: The manifest check is treated as optional plumbing. If a caller forgets or omits `options.manifest`, `evaluateCandidate()` skips locked-field enforcement entirely and can return `advisory-accept` for a candidate that touches forbidden contract fields. Because this is the last policy gate before generating “approved” advisory artifacts, omission becomes a bypass.  
Evidence: The code only runs `checkManifestBoundary()` inside `if (opts.manifest)`. Direct probe result: passing `{ config: { stopReason: 'converged' }, score: { composite: 0.9 } }` without a manifest returned `decision:"advisory-accept"` and `manifestCheck:null`. That breaks acceptance scenario 8 in [004-offline-loop-optimizer/spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/spec.md:170) and the ADR requirement for an explicit manifest boundary.  
Recommendation: Make the manifest mandatory for evaluation, or load the canonical manifest internally by default and block when it is unavailable.

Finding ID: `F-006-004`  
Severity: `P2`  
Dimension: `security`  
File: [replay-corpus.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:272)  
Line: `272-282`, `359-365`, `375-384`  
Title: Corpus helpers are path-agnostic and mask integrity failures  
Description: The corpus layer trusts caller-controlled filesystem locations for fixture loading, corpus saving, and corpus loading. That is enough path-escape surface for future CLI/operator wiring, and `loadCorpus()` further hides corruption by collapsing parse/type failures into `[]`, making a tampered corpus indistinguishable from an empty one.  
Evidence: `buildCorpus()` joins arbitrary `fixturesDir`, `saveCorpus()` writes any `outputPath`, and `loadCorpus()` reads any existing JSON path. Direct probe result: `loadCorpus()` successfully loaded an unrelated array JSON from another spec folder (`length: 10`), proving there is no corpus-root confinement.  
Recommendation: Constrain reads and writes to approved corpus/audit roots, reject symlink escapes, and return explicit integrity errors for malformed or unexpected corpus files instead of silently returning an empty array.

**Iteration Summary**  
Total findings: `4`  
Breakdown: `0 P0`, `3 P1`, `1 P2`

**Coverage Assessment**  
Reviewed about `95%` of the stated focus area: the phase spec/ADR/implementation summary, `replay-corpus.cjs`, `replay-runner.cjs`, `search.cjs`, `promote.cjs`, the optimizer manifest, and the related vitest suites. I did not find a standalone security issue inside `replay-runner.cjs`; the material risks were in the surrounding boundary enforcement and persistence helpers.

**Confidence**  
`high`

**Next Priorities**  
Inspect any CLI/workflow surface that will eventually expose these optimizer helpers, especially anything that passes `fixturesDir`, `outputPath`, `corpusPath`, or custom search bounds from user input. The next security pass should also verify whether any downstream consumer persists advisory outputs or applies candidate configs without re-running the manifest gate.
