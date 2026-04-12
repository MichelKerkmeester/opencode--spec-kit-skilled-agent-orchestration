---
iteration: 13
dimension: correctness
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T10:30:49Z
completedAt: 2026-04-12T10:34:34Z
---

# Deep Review Iteration 013 — correctness

**Focus:** Phase 007-008 regression risk: check .opencode/skill/sk-deep-review/scripts/reduce-state.cjs for fail-closed corruption handling, claim-adjudication gate implementation, and the split between persistent same-severity findings and severity changes. Verify against .opencode/skill/sk-deep-review/references/state_format.md §9 and loop_protocol.md §Step 4a.

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
session id: 019d813e-7d32-7940-bcba-00ec31eb93e2
--------
user
You are a senior code reviewer executing iteration 13 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: correctness
FOCUS: Phase 007-008 regression risk: check .opencode/skill/sk-deep-review/scripts/reduce-state.cjs for fail-closed corruption handling, claim-adjudication gate implementation, and the split between persistent same-severity findings and severity changes. Verify against .opencode/skill/sk-deep-review/references/state_format.md §9 and loop_protocol.md §Step 4a.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for correctness issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-013-NNN (sequential within this iteration)
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
Reviewing the Phase 007-008 regression surface in `sk-deep-review`, with the goal of validating the reducer logic against the documented state contract and loop protocol before I judge findings. I’m starting with a quick memory pass and skill routing, then I’ll read the target reducer and referenced docs side by side and trace any related helpers that affect claim adjudication or severity transitions.
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|sk-deep-review|reduce-state|claim-adjudication|same-severity|severity change|loop_protocol|state_format" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
111:- 003-modus-memory-main, dont ask for spec folder, auto mode, validate.sh --strict, research/iterations/iteration-NNN.md, reduce-state.cjs, deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, max 6 agent threads
153:- safe continuation sequence: validate packet shape first, repair missing Level 3 docs if needed, preserve existing synthesis/legacy transcripts, extend iterations, run `reduce-state.cjs`, then sync packet docs and rerun strict validation [Task 2][Task 3][Task 5]
558:- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093
636:- deep-research extension runbook: align `maxIterations` in config/state/strategy first, keep lineage/execution mode unchanged, run reducer after each iteration (`node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`), then refresh synthesis/registry/dashboard artifacts [Task 2]
896:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
904:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
914:- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md
916:## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep review correctness audit of .opencode/skill/sk-deep-review/scripts/reduce-state.cjs against state_format.md section 9 and loop_protocol.md step 4a, including claim-adjudication gate and severity persistence behavior" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 537ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-jPtVMZjA' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/sk-deep-review(explicit), !deep review(phrase), !sk-deep-review(explicit), audit~, deep(name)"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !opencode, check~, opencode(name)"
  }
]

codex
Skill routing points to `sk-deep-review` and `sk-code-opencode`, which matches this audit well: I’ll use the deep-review workflow for findings discipline and the OpenCode standards overlay for the script/runtime details. I found a prior memory trail around the reducer and the `002-sk-deep-review-improvements` hardening work, so I’m pulling just that narrow context before I inspect the code.
exec
/bin/zsh -lc "sed -n '908,922p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### rollout_summary_files

- rollout_summaries/2026-04-03T08-52-11-1f0W-deep_research_phase1_100pct.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-52-11-019d528a-f2bc-7053-9269-e85eded82c3e.jsonl, updated_at=2026-04-03T09:49:06+00:00, thread_id=019d528a-f2bc-7053-9269-e85eded82c3e)

### keywords

- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md

## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-53-06-019d528b-cc68-77b3-9b4d-8b5dc37b791e.jsonl, updated_at=2026-04-03T09:42:20+00:00, thread_id=019d528b-cc68-77b3-9b4d-8b5dc37b791e)

### keywords

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got the prior hardening breadcrumb and the exact review skill loaded. Next I’m reading the reducer, its tests, and the two protocol docs together so I can compare runtime behavior to the documented Step 4a/Section 9 contract instead of reviewing the script in isolation.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-review/scripts/reduce-state.cjs" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-review/references/state_format.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review State Reducer                                                ║
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

const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
const SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 };

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readUtf8(filePath));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'entry';
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function zeroSeverityMap() {
  return { P0: 0, P1: 0, P2: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into an array of records, preserving both iteration and
 * event rows. Backward-compatible array return.
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {Array<Object>} Parsed records (corrupt lines silently dropped — use parseJsonlDetailed for fail-closed behavior)
 */
function parseJsonl(jsonlContent) {
  return parseJsonlDetailed(jsonlContent).records;
}

/**
 * Parse JSONL content and report malformed lines (fail-closed pathway).
 *
 * Returns both the parsed records and a corruption warning list. The reducer
 * exit code is non-zero when warnings are present unless `--lenient` is passed.
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line: number, raw: string, error: string}>}}
 */
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of jsonlContent.split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    try {
      records.push(JSON.parse(line));
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { records, corruptionWarnings };
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function extractSubsection(sectionText, subheading) {
  const pattern = new RegExp(`(?:^|\\n)###\\s+${escapeRegExp(subheading)}[^\\n]*\\n([\\s\\S]*?)(?=\\n###\\s|\\n##\\s|$)`, 'i');
  const match = sectionText.match(pattern);
  return match ? match[1].trim() : '';
}

function extractListItems(sectionText) {
  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
    .filter(Boolean);
}

/**
 * Parse a finding line of the form: `- **F001**: Title — file:line — Description`
 *
 * @param {string} line - Raw finding bullet
 * @param {string} severity - P0, P1, or P2 context
 * @returns {Object|null} Structured finding or null when the line is not a finding
 */
function parseFindingLine(line, severity) {
  const match = line.match(/^\*\*(F\d+)\*\*\s*:\s*(.+?)(?:\s+[—-]\s+`?([^`]+?)`?)?(?:\s+[—-]\s+(.+))?$/);
  if (!match) {
    return null;
  }

  const [, findingId, title, evidenceRaw, description] = match;
  let file = null;
  let lineNumber = null;

  if (evidenceRaw) {
    const evidenceMatch = evidenceRaw.trim().match(/^(.+?):(\d+)(?:[:-].*)?$/);
    if (evidenceMatch) {
      file = evidenceMatch[1];
      lineNumber = Number(evidenceMatch[2]);
    } else {
      file = evidenceRaw.trim();
    }
  }

  return {
    findingId,
    severity,
    title: normalizeText(title),
    file,
    line: lineNumber,
    description: normalizeText(description || ''),
  };
}

function parseFindingsBlock(sectionText, severity) {
  if (!sectionText) {
    return [];
  }

  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^-\s+\*\*F\d+\*\*/.test(line))
    .map((line) => parseFindingLine(line.replace(/^-\s+/, ''), severity))
    .filter(Boolean);
}

/**
 * Parse a single iteration markdown file into a structured review record.
 *
 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
 * @returns {Object} Parsed iteration with focus, findings, cross-reference, and reflection fields
 */
function parseIterationFile(iterationPath) {
  const markdown = readUtf8(iterationPath);
  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);

  const focusSection = extractSection(markdown, 'Focus');
  const findingsSection = extractSection(markdown, 'Findings');
  const ruledOutSection = extractSection(markdown, 'Ruled Out');
  const deadEndsSection = extractSection(markdown, 'Dead Ends');
  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
  const assessmentSection = extractSection(markdown, 'Assessment');

  const p0Block = extractSubsection(findingsSection, 'P0');
  const p1Block = extractSubsection(findingsSection, 'P1');
  const p2Block = extractSubsection(findingsSection, 'P2');

  const findings = [
    ...parseFindingsBlock(p0Block, 'P0'),
    ...parseFindingsBlock(p1Block, 'P1'),
    ...parseFindingsBlock(p2Block, 'P2'),
  ];

  const dimensionsAddressed = (assessmentSection.match(/Dimensions addressed:\s*(.+)/i) || [])[1];

  return {
    path: iterationPath,
    run: runMatch ? Number(runMatch[1]) : 0,
    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
    findings,
    ruledOut: extractListItems(ruledOutSection),
    deadEnds: extractListItems(deadEndsSection),
    nextFocus: normalizeText(nextFocusSection),
    dimensionsAddressed: dimensionsAddressed
      ? dimensionsAddressed.split(/[,;]/).map((value) => normalizeText(value).toLowerCase()).filter(Boolean)
      : [],
  };
}

function parseStrategyDimensions(strategyContent) {
  const section = extractSection(strategyContent, '3. REVIEW DIMENSIONS (remaining)')
    || extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
    .map((line) => {
      const checked = /^- \[[xX]\]\s+/.test(line);
      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
      return { checked, text };
    });
}

function uniqueById(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (seen.has(item.findingId)) {
      continue;
    }
    seen.add(item.findingId);
    result.push(item);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function buildFindingRegistry(iterationFiles, iterationRecords) {
  const findingById = new Map();

  for (const iteration of iterationFiles) {

 succeeded in 0ms:
---
title: Deep Review State Format
description: State file schemas for the autonomous deep review loop — config, JSONL log, strategy, iteration files, and review report.
---

# Deep Review State Format

State file schemas for the autonomous deep review loop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep review loop uses 8 state files under `{spec_folder}/review/`:

| File | Format | Mutability |
|------|--------|------------|
| `deep-review-config.json` | JSON | Immutable after init |
| `deep-review-state.jsonl` | JSON Lines | Append-only |
| `deep-review-findings-registry.json` | JSON | Auto-generated reducer state |
| `deep-review-strategy.md` | Markdown | Updated each iteration |
| `deep-review-dashboard.md` | Markdown | Auto-generated (read-only) |
| `.deep-review-pause` | Sentinel | Created/deleted by user |
| `review-report.md` | Markdown | Updated at synthesis |
| `iterations/iteration-NNN.md` | Markdown | Write-once |

```
{spec_folder}/
  review/
    deep-review-config.json
    deep-review-state.jsonl
    deep-review-findings-registry.json
    deep-review-strategy.md
    deep-review-dashboard.md
    .deep-review-pause
    review-report.md
    iterations/
      iteration-001.md
      iteration-002.md
      ...
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:config-file -->
## 2. CONFIG FILE (deep-review-config.json)

Created during initialization. Not modified after creation.

```json
{
  "topic": "Review of sk-deep-review skill package",
  "mode": "review",
  "reviewTarget": "specs/030-sk-deep-review-review-mode",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": ["correctness", "security", "traceability", "maintainability"],
  "sessionId": "rvw-2026-04-03T12-00-00Z",
  "parentSessionId": null,
  "lineageMode": "new",
  "generation": 1,
  "continuedFromRun": null,
  "maxIterations": 7,
  "convergenceThreshold": 0.10,
  "stuckThreshold": 2,
  "severityThreshold": "P2",
  "crossReference": {
    "core": ["spec_code", "checklist_evidence"],
    "overlay": ["feature_catalog_code", "playbook_capability"]
  },
  "qualityGateThreshold": true,
  "releaseReadinessState": "in-progress",
  "specFolder": "030-sk-deep-review-review-mode",
  "createdAt": "2026-03-24T14:00:00Z",
  "status": "initialized",
  "executionMode": "auto",
  "fileProtection": {
    "deep-review-config.json": "immutable",
    "deep-review-state.jsonl": "append-only",
    "deep-review-findings-registry.json": "auto-generated",
    "deep-review-strategy.md": "mutable",
    "deep-review-dashboard.md": "auto-generated",
    ".deep-review-pause": "operator-controlled",
    "review-report.md": "mutable",
    "review-report-v*.md": "write-once",
    "iteration-*.md": "write-once"
  },
  "reducer": {
    "enabled": true,
    "inputs": ["latestJSONLDelta", "newIterationFile", "priorReducedState"],
    "outputs": ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
    "metrics": [
      "dimensionsCovered",
      "findingsBySeverity",
      "openFindings",
      "resolvedFindings",
      "convergenceScore"
    ]
  }
}
```

### Field Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | `"review"` | -- | Session mode discriminator (required) |
| reviewTarget | string | -- | Path or identifier of the review target |
| reviewTargetType | string | `"spec-folder"` | `spec-folder`, `skill`, `agent`, `track`, `files` |
| reviewDimensions | string[] | all 4 | Dimensions to evaluate |
| sessionId | string | -- | Stable identifier for the current review lineage |
| parentSessionId | string \| null | `null` | Parent lineage reference for restart flows |
| lineageMode | string | `"new"` | `new`, `resume`, `restart`. `fork` and `completed-continue` are deferred and not emitted by the current runtime |
| generation | number | 1 | Lineage generation number — incremented on `restart`, unchanged on `resume` |
| continuedFromRun | number \| null | `null` | Count of completed iteration records at the lifecycle boundary (set on `resume` and `restart`) |
| maxIterations | number | 7 | Hard cap on loop iterations |
| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
| stuckThreshold | number | 2 | Consecutive no-progress iterations before recovery |
| severityThreshold | string | `"P2"` | Minimum severity to report: `P0`, `P1`, `P2` |
| crossReference | object | -- | Core (hard-gated) and overlay (advisory) protocol sets |
| qualityGateThreshold | boolean | true | Whether binary quality gates are enforced |
| specFolder | string | -- | Spec folder path (relative to specs/) |
| status | string | `"initialized"` | `initialized`, `running`, `converged`, `stuck`, `complete`, `error` |
| releaseReadinessState | string | `"in-progress"` | `in-progress`, `converged`, `release-blocking` |
| fileProtection | object | -- | Mutability declarations (see protection levels below) |
| reducer | object | -- | Canonical reducer inputs, outputs, and metrics names |

### File Protection Levels

| Level | Meaning |
|-------|---------|
| immutable | Cannot be modified after creation |
| append-only | New content added at end only |
| mutable | Can be read, edited, overwritten |
| write-once | Created once, never modified |
| auto-generated | System-managed, overwritten each refresh |
| operator-controlled | Created or deleted only by the human/operator to control loop state |

### Review Dimensions

| Dimension | Priority | Required for Coverage |
|-----------|----------|---------------------|
| correctness | 1 | Yes |
| security | 2 | Yes |
| traceability | 3 | Yes |
| maintainability | 4 | Yes |

### Severity Weights

| Severity | Weight | Label | Requires file:line |
|----------|--------|-------|--------------------|
| P0 | 10.0 | Blocker | Yes |
| P1 | 5.0 | Required | Yes |
| P2 | 1.0 | Suggestion | Yes |

---

<!-- /ANCHOR:config-file -->
<!-- ANCHOR:state-log -->
## 3. STATE LOG (deep-review-state.jsonl)

Append-only JSON Lines file. One JSON object per line.

### Line 1: Config Record

```json
{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
```

### Iteration Records

```json
{
  "type": "iteration", "mode": "review", "run": 3, "status": "complete",
  "focus": "D3 Traceability - skill/runtime alignment",
  "dimensions": ["traceability", "maintainability"],
  "filesReviewed": [".opencode/skill/sk-deep-research/README.md"],
  "sessionId": "rvw-2026-04-03T12-00-00Z",
  "parentSessionId": null,
  "lineageMode": "resume",
  "generation": 1,
  "continuedFromRun": null,
  "findingsCount": 4,
  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
  "newFindingsRatio": 0.32,
  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
}
```

**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`

**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`, `graphEvents`

| Required Field | Type | Description |
|---------------|------|-------------|
| mode | `"review"` | Session mode discriminator |
| dimensions | string[] | Review dimensions addressed this iteration |
| filesReviewed | string[] | Files examined |
| sessionId | string | Current lineage session identifier |
| generation | number | Lineage generation number |
| lineageMode | string | Lifecycle mode used for this run |
| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |

### Convergence Signals

| Signal | Weight | Description |
|--------|--------|-------------|
| rollingAvg | 0.30 | Rolling average of severity-weighted new findings |
| madScore | 0.25 | Noise-floor test against MAD-derived churn |
| dimensionCoverage | 0.45 | Required dimension + protocol coverage stability |
| compositeStop | -- | Weighted stop score (stop if > 0.60) |

**Severity math:** `refinementMultiplier: 0.5`, `p0OverrideMinRatio: 0.50`, `noFindingsRatio: 0.0`

### Graph Events

The optional `graphEvents` array records coverage graph mutations emitted by a review iteration. The MCP coverage graph handlers (`mcp_server/handlers/coverage-graph/upsert.ts`) consume these events and persist them into `deep-loop-graph.sqlite`, where they become the source of truth for graph-assisted convergence, hotspot saturation, and blocked-stop evidence.

```json
{
  "type": "iteration", "mode": "review", "run": 4, "status": "complete",
  "focus": "correctness",
  "dimensions": ["correctness"],
  "filesReviewed": ["src/api/session.ts"],
  "findingsSummary": { "P0": 0, "P1": 1, "P2": 0 },
  "findingsNew": { "P0": 0, "P1": 1, "P2": 0 },
  "newFindingsRatio": 0.18,
  "sessionId": "rvw-2026-03-24T10-00-00Z",
  "generation": 1,
  "lineageMode": "new",
  "graphEvents": [
    { "type": "dimension", "id": "d-correctness", "label": "correctness" },
    { "type": "file", "id": "file-session-ts", "label": "src/api/session.ts" },
    { "type": "finding", "id": "f-001", "label": "Missing CSRF token check on session POST" },
    { "type": "evidence", "id": "ev-001", "label": "src/api/session.ts:42" },
    { "type": "edge", "id": "e-in-dim-f-001", "relation": "IN_DIMENSION", "source": "f-001", "target": "d-correctness" },
    { "type": "edge", "id": "e-in-file-f-001", "relation": "IN_FILE", "source": "f-001", "target": "file-session-ts" },
    { "type": "edge", "id": "e-evidence-f-001", "relation": "EVIDENCE_FOR", "source": "ev-001", "target": "f-001" }
  ],
  "timestamp": "2026-03-24T10:12:00Z",
  "durationMs": 51000
}
```

#### Event payload shape

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | `"dimension"` \| `"file"` \| `"finding"` \| `"evidence"` \| `"remediation"` \| `"edge"` | Yes | Review-loop node kind or the literal `"edge"` for relation rows |
| id | string | Yes | Caller-chosen logical id. Must be unique **within** a single `(specFolder, loopType, sessionId)` namespace; see Namespace Rules below |
| label | string | Yes | Human-readable name/caption (dimension, path, finding title, evidence anchor, etc.) |
| relation | `"COVERS"` \| `"EVIDENCE_FOR"` \| `"CONTRADICTS"` \| `"RESOLVES"` \| `"CONFIRMS"` \| `"ESCALATES"` \| `"IN_DIMENSION"` \| `"IN_FILE"` | edges only | Review relation type. Required when `type == "edge"` |
| source | string | edges only | `id` of the source node inside the current namespace |
| target | string | edges only | `id` of the target node inside the current namespace. Self-loops are rejected by the upsert handler |
| metadata | object | No | Optional free-form metadata persisted alongside the row (e.g. `{ "hotspot_score": 2 }`) |


exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-review/references/loop_protocol.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Deep Review Loop Protocol
description: Complete lifecycle specification for the autonomous deep review loop — initialization, iteration, convergence, synthesis, and save phases.
---

# Deep Review Loop Protocol

Complete lifecycle specification for the autonomous deep review loop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep review loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the `@deep-review` agent (LEAF-only, no WebFetch) executes individual review iterations with fresh context each time.

```
┌──────────────┐     ┌───────────────────────────────┐     ┌───────────────┐     ┌──────────┐
│  INIT        │────>│  LOOP                         │────>│  SYNTHESIS    │────>│  SAVE    │
│              │     │  ┌─────────────────────────┐  │     │               │     │          │
│ Scope        │     │  │ Read State              │  │     │ Finding       │     │ Memory   │
│ Discovery    │     │  │ Check Convergence       │  │     │ Registry      │     │ Context  │
│ Dimension    │     │  │ Check Pause Sentinel    │  │     │ Dedup         │     │ Save     │
│ Ordering     │     │  │ Generate State Summary  │  │     │               │     │          │
│ Traceability │     │  │ Dispatch @deep-review   │  │     │ Severity      │     │          │
│ Planning     │     │  │ Evaluate Results        │  │     │ Reconcile     │     │          │
│ State Files  │     │  │ Claim Adjudication      │  │     │               │     │          │
│              │     │  │ Dashboard Generation    │  │     │ Replay        │     │          │
│              │     │  │ Loop Decision           │  │     │ Validation    │     │          │
│              │     │  └────────┬────────────────┘  │     │               │     │          │
│              │     │           │ repeat            │     │ review-report │     │          │
│              │     │           │                   │     │ (9 sections)  │     │          │
└──────────────┘     └───────────────────────────────┘     └───────────────┘     └──────────┘
```

### Core Innovation

Each agent dispatch gets a fresh context window. State continuity comes from files on disk, not in-context memory. This eliminates context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Key References

| Resource | Path | Purpose |
|----------|------|---------|
| Review contract | `assets/review_mode_contract.yaml` | Dimensions, verdicts, gates, protocols |
| Auto workflow | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Unattended review loop |
| Confirm workflow | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Step-by-step review with approval gates |
| Agent | `@deep-review` (LEAF) | Single iteration executor; no sub-agents, no WebFetch |
| Memory save | `generate-context.js` | Context preservation script |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:phase-initialization -->
## 2. PHASE 1: INITIALIZATION

### Purpose

Set up all state files for a new review session. Discover the scope, order dimensions by risk priority, establish the traceability protocol plan, and create the review state packet.

### Steps

1. **Classify session state before writing**:
   - `fresh`: no config/state/strategy files exist
   - `resume`: config + state + strategy all exist and agree
   - `completed-session`: consistent prior state with `config.status == "complete"`
   - `invalid-state`: partial or contradictory artifacts

2. **Create spec folder** (if needed): `mkdir -p {spec_folder}/review/iterations`

3. **Scope discovery**: Resolve the review target into a concrete file list using one of 5 target types:

   | Target Type | CLI Value | Resolution Strategy |
   |-------------|-----------|---------------------|
   | **Spec Folder** | `spec-folder` | Read `spec.md`, `plan.md`, implementation files listed in `tasks.md` |
   | **Skill** | `skill` | Read `SKILL.md`, `references/`, `assets/`, `scripts/`, find agent definitions and command entry points |
   | **Agent** | `agent` | Find agent definitions across all runtimes, compare for consistency |
   | **Track** | `track` | List all child spec folders under the track, read `spec.md` + `checklist.md` for each |
   | **Files** | `files` | Expand glob patterns, validate existence, discover cross-references |

   Store the resolved file list in strategy.md "Files Under Review".

4. **Dimension ordering**: Order the 4 review dimensions for iteration based on risk priority:

   | Priority | Dimension | Rationale |
   |----------|-----------|-----------|
   | 1 | Correctness | Logic errors have the highest blast radius |
   | 2 | Security | Vulnerabilities require immediate attention |
   | 3 | Traceability | Spec/code alignment ensures completeness |
   | 4 | Maintainability | Patterns and documentation quality (lowest immediate risk) |

   Default order: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. This order is configurable but the default prioritizes highest-impact dimensions first.

5. **Traceability protocol planning**: Partition the 6 cross-reference protocols into core vs overlay, and schedule only applicable overlays for the target type:

   | Level | Protocol | Applies To | Gate Class | Purpose |
   |-------|----------|------------|------------|---------|
   | Core | `spec_code` | all targets | hard | Verify normative claims resolve to shipped behavior |
   | Core | `checklist_evidence` | all targets | hard | Verify checked completion claims have evidence |
   | Overlay | `skill_agent` | skill | advisory | Verify SKILL.md and runtime agents agree |
   | Overlay | `agent_cross_runtime` | agent | advisory | Verify runtime agent parity |
   | Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
   | Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |

   Only schedule overlay protocols that apply to the resolved target type.

6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.

7. **Initialize state log**: First line of `{spec_folder}/review/deep-review-state.jsonl` with config record including `mode: "review"` and the lineage fields.

8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.

9. **Initialize strategy**: `{spec_folder}/review/deep-review-strategy.md` from review template with:
   - Topic (review target description)
   - Review Dimensions checklist
   - Files Under Review table
   - Cross-Reference Status table grouped by core vs overlay
   - Known Context from `memory_context()` results (if any)
   - Review Boundaries from config

10. **Validate review charter**:
   - Verify strategy.md contains Non-Goals and Stop Conditions sections (may be empty but must exist)
   - In **confirm mode**: present the charter (target, dimensions, scope, non-goals) for user review before proceeding
   - In **auto mode**: accept automatically and continue

11. **Resume only if config, JSONL, strategy, and findings registry agree**; otherwise halt for repair instead of guessing.

### Outputs

| File | Location | Purpose |
|------|----------|---------|
| Config | `{spec_folder}/review/deep-review-config.json` | Review parameters (immutable after init) |
| State | `{spec_folder}/review/deep-review-state.jsonl` | Iteration log (1 initial line) |
| Registry | `{spec_folder}/review/deep-review-findings-registry.json` | Reducer-owned findings state |
| Strategy | `{spec_folder}/review/deep-review-strategy.md` | Dimensions, findings, next focus |

---

<!-- /ANCHOR:phase-initialization -->
<!-- ANCHOR:phase-iteration-loop -->
## 3. PHASE 2: ITERATION LOOP

### Loop Steps (repeated until convergence)

#### Step 1: Read State

- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
- Read `{spec_folder}/review/deep-review-strategy.md` -- get next focus dimension/files, remaining dimensions, and protocol gaps

Reducer contract for every loop refresh:

| Reducer Part | Canonical Value | Notes |
|--------------|-----------------|-------|
| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |

#### Step 2: Check Convergence

Run `shouldContinue_review()` (see `../sk-deep-research/references/convergence.md` Section 10.3):

- Max iterations reached? `STOP`
- Stuck count `>= 2` using `noProgressThreshold = 0.05`? `STUCK_RECOVERY`
- Composite convergence votes `STOP` only after:
  - Rolling average uses `rollingStopThreshold = 0.08`
  - Dimension coverage reaches 100% across the 4-dimension model
  - Coverage has aged through `minStabilizationPasses >= 1`
  - Required traceability protocols are covered
  - Evidence, scope, and coverage gates pass
- Otherwise: `CONTINUE`

If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:

- `blockedBy`: array of the failed review gate names
- `gateResults`: per-gate pass/fail payloads using the review gate names above
- `recoveryStrategy`: one-line hint describing the next review action

The blocked-stop event is append-only evidence that legal-stop blocked the run; the loop then continues with the recovery or next-focus path rather than synthesizing.

Convergence signals and weights:

| Signal | Weight | Description |
|--------|--------|-------------|
| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `rollingStopThreshold` |
| MAD Noise Floor | 0.25 | Latest ratio within noise floor derived from historical ratios |
| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with stabilization |

**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.

#### Step 2a: Check Pause Sentinel

Before dispatching, check for a pause sentinel file:

1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
2. If present:
   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}`
   - Halt the loop with message:
     ```
     Review paused. Delete review/.deep-review-pause to resume.
     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
     ```
   - Do NOT exit to synthesis -- the loop is suspended, not stopped
3. On resume (file deleted and loop restarted):
   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   - Continue from step_read_state

**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause review between iterations.

Normalization rule: if the runtime first observes a raw `paused` condition or a raw `stuck_recovery` condition, it MUST rewrite the emitted JSONL event names to `userPaused` and `stuckRecovery` before appending them. Persisted review JSONL should never contain raw `paused` or raw `stuck_recovery` rows after emission.

#### Step 2b: Generate State Summary

Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:

```
STATE SUMMARY (auto-generated, review mode):
Iteration: {N} of {max} | Mode: review
Target: {config.reviewTarget} ({config.reviewTargetType})
Dimensions: {reviewed}/{total} complete | Next: {nextDimension}
Findings: P0:{count} P1:{count} P2:{count} active
Traceability: core={core_status} overlay={overlay_status}
Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
Provisional verdict: {PASS|CONDITIONAL|FAIL|PENDING} | hasAdvisories={hasAdvisories}
Next focus: {strategy.nextFocus}
```

This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete.

#### Step 3: Dispatch Agent

Dispatch `@deep-review` with review-specific context:

```
{state_summary}  // Auto-generated (Step 2b)

Review Target: {config.reviewTarget}
Review Mode: {config.reviewTargetType}
Iteration: {N} of {maxIterations}
Focus Dimension: {strategy.nextFocus.dimension}
Focus Files: {strategy.nextFocus.files}
Remaining Dimensions: {strategy.remainingDimensions}
Traceability Protocols:
  - Core: {core_protocols}
  - Overlay: {overlay_protocols}
Active Findings: {findingsSummary}
State Files:
  - Config: {spec_folder}/review/deep-review-config.json
  - State: {spec_folder}/review/deep-review-state.jsonl
  - Registry: {spec_folder}/review/deep-review-findings-registry.json
  - Strategy: {spec_folder}/review/deep-review-strategy.md
Output: Write findings to {spec_folder}/review/iterations/iteration-{NNN}.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
```

**Agent constraints**:
- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
- No WebFetch: review is code-only and read-only
- Target 8-11 tool calls per iteration (max 12); breadth over depth per cycle
- Tools available: Read, Grep, Glob, Edit (state files only), mcp__cocoindex_code__search

exec
/bin/zsh -lc 'rg -n "reduce-state|claim-adjudication|adjudicat|same-severity|severity.*change|state_format|loop_protocol" /Users/michelkerkmeester/.codex/memories/rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg -n \"reduce-state|claim|adjudicat|same-severity|severity.*change|persistent|resolved|carry|update.*finding|open finding\" .opencode/skill/sk-deep-review -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:15:Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:20:- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:188:      description: At least one unresolved P0 finding is present.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:198:      passCriteria: All normative claims resolve to shipped behavior or explicitly documented non-applicability with evidence.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:199:      partialCriteria: Some claims resolve, but one or more claims remain ambiguous or blocked by missing evidence.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:200:      failCriteria: A normative claim contradicts shipped behavior, references missing implementation, or cannot be reconciled.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:206:      passCriteria: Every checked checklist-style claim has supporting evidence and no unsupported completion marks remain.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:230:      passCriteria: Feature catalog claims match current capability, entry points, and discoverable implementation surfaces.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:232:      failCriteria: Catalog claims are materially false, missing required features, or point to absent implementation.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:259:        - resolvedFindings
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:50:- **P0 (Critical):** [N] active, [N] new this iteration, [N] upgrades, [N] resolved
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:51:- **P1 (Major):** [N] active, [N] new this iteration, [N] upgrades, [N] resolved
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:52:- **P2 (Minor):** [N] active, [N] new this iteration, [N] upgrades, [N] resolved
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:96:<!-- ANCHOR:resolved -->
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:105:<!-- /ANCHOR:resolved -->
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:118:- [blockers, missing coverage, unresolved contradictions, gate violations, high stuck count, declining trend, etc.]
.opencode/skill/sk-deep-review/assets/deep_review_config.json:45:  "reducerScriptPath": ".opencode/skill/sk-deep-review/scripts/reduce-state.cjs",
.opencode/skill/sk-deep-review/assets/deep_review_config.json:73:      "resolvedFindings",
.opencode/skill/sk-deep-review/SKILL.md:252:| **Correctness** | Logic, behavior, error handling | Does the code do what it claims? Are edge cases handled? |
.opencode/skill/sk-deep-review/SKILL.md:255:| **Completeness / Maintainability** | Coverage, dead code, documentation | Are TODOs resolved? Is the code self-documenting? |
.opencode/skill/sk-deep-review/SKILL.md:289:- Metrics: `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore`
.opencode/skill/sk-deep-review/SKILL.md:502:6. **Iteration 4** (Completeness): All TODOs resolved; 2 P2 naming advisories
.opencode/skill/sk-deep-review/SKILL.md:513:| STRATEGY.md persistent brain | AGR | `deep-review-strategy.md` (dimension tracking) |
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:292:  const resolvedIdSet = new Set();
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:294:    if (Array.isArray(record.resolvedFindings)) {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:295:      for (const id of record.resolvedFindings) {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:296:        resolvedIdSet.add(id);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:302:  const resolvedFindings = [];
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:304:    if (resolvedIdSet.has(finding.findingId)) {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:305:      finding.status = 'resolved';
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:306:      resolvedFindings.push(finding);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:313:  resolvedFindings.sort(compareFindings);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:315:  return { openFindings, resolvedFindings };
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:494:  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:502:  // so persistent-same-severity findings and severity-churn findings don't collapse.
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:503:  const persistentSameSeverity = openFindings.filter((finding) => {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:518:  // New code should read persistentSameSeverity + severityChanged directly.
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:526:    resolvedFindings,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:528:    persistentSameSeverity,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:534:    resolvedFindingsCount: resolvedFindings.length,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:618:    `- Resolved: ${registry.resolvedFindingsCount}`,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:642:  // JSONL iteration records (which do carry timestamps) instead.
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:667:  updated = replaceAnchorSection(updated, 'running-findings', '5. RUNNING FINDINGS', runningFindings, anchorOptions);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:755:    `| Resolved | ${registry.resolvedFindingsCount} |`,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:813:    `- persistentSameSeverity: ${(registry.persistentSameSeverity || []).length}`,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:836:      // `blocked_stop` and `claim_adjudication` events so operators see
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:837:      // claim-adjudication and legal-stop gate failures, not just severity.
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:850:        .find((r) => r && r.type === 'event' && r.event === 'claim_adjudication');
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:855:        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:890:  const resolvedSpecFolder = path.resolve(specFolder);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:891:  const reviewDir = path.join(resolvedSpecFolder, 'review');
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:961:      'Usage: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> [--lenient] [--create-missing-anchors]\n',
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:975:          resolvedFindingsCount: result.registry.resolvedFindingsCount,
.opencode/skill/sk-deep-review/README.md:30:`sk-deep-review` runs autonomous, multi-iteration code quality audits on targets that require more than a single review pass to assess thoroughly. Each iteration dispatches a fresh `@deep-review` agent with no prior context, using file-based state (JSONL log, strategy file, iteration notes) to carry findings forward without degrading the context window. When new findings drop below a configurable threshold across multiple consecutive iterations, a 3-signal composite convergence algorithm stops the loop and triggers final synthesis, producing a `{spec_folder}/review/review-report.md` with a binary release readiness verdict.
.opencode/skill/sk-deep-review/README.md:132:When `graphEvents` are present in review iteration records, the convergence system can incorporate structural graph signals into legal-stop evaluation. This adds graph-backed dimension and evidence coverage to the existing review stop gates so a stable-looking review still cannot stop early if the graph shows unresolved coverage gaps.
.opencode/skill/sk-deep-review/README.md:172:| `release-blocking` | Unresolved P0 findings remain active                                                        |
.opencode/skill/sk-deep-review/README.md:361:A: CONDITIONAL means active P0 is zero but active P1 findings remain. The code can proceed to planning and remediation but should not be released until P1 findings are resolved. Run `/spec_kit:plan` with the review report as input.
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:33:  const resolvedPath = path.resolve(capabilityPath);
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:34:  const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:37:    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: missing runtimes array`);
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:41:    capabilityPath: resolvedPath,
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:66:  const { capabilityPath: resolvedPath, matrix } = loadRuntimeCapabilities(capabilityPath);
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:71:      `Unknown deep-review runtime "${runtimeId}". Known runtimes: ${matrix.runtimes.map((entry) => entry.id).join(', ')}. Matrix: ${resolvedPath}`,
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:76:    capabilityPath: resolvedPath,
.opencode/skill/sk-deep-review/references/quick_reference.md:125:| `release-blocking` | At least one unresolved P0 remains active |
.opencode/skill/sk-deep-review/references/quick_reference.md:184:| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:8:This document combines the operator-facing manual testing contract for the `sk-deep-review` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide, while the per-feature files carry the scenario-specific execution truth.
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:124:| 9 | DRV-009 | Review iteration writes findings, JSONL, and strategy update | `03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md` |
.opencode/skill/sk-deep-review/references/convergence.md:28:- `release-blocking` whenever unresolved P0 findings remain active
.opencode/skill/sk-deep-review/references/convergence.md:79:    "claimAdjudicationGate": { "pass": true, "activeP0P1": 2 }
.opencode/skill/sk-deep-review/references/convergence.md:89:- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, and `claimAdjudicationGate`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1). The reducer reads these verbatim and does not coerce shapes.
.opencode/skill/sk-deep-review/references/convergence.md:352:- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
.opencode/skill/sk-deep-review/references/convergence.md:379:| **p0Resolution** | No unresolved P0 findings may remain active at stop time | Block STOP, persist `blockedStop` |
.opencode/skill/sk-deep-review/references/convergence.md:399:      pass: countActiveFindings(state, ["P0"]) == 0 and state.claimAdjudicationPassed != false,
.opencode/skill/sk-deep-review/references/convergence.md:400:      detail: "No unresolved P0 findings remain and blocker adjudication is complete."
.opencode/skill/sk-deep-review/references/convergence.md:428:| `p0Resolution` | Re-open the active blocker path and verify whether the P0 is real, downgraded, or still unresolved. |
.opencode/skill/sk-deep-review/references/convergence.md:503:| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
.opencode/skill/sk-deep-review/references/convergence.md:504:| Low-value advisory churn | Last 2 iterations found only P2 findings | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |
.opencode/skill/sk-deep-review/references/convergence.md:630:      "p0Resolution": { "pass": true, "detail": "No unresolved P0 findings remained." },
.opencode/skill/sk-deep-review/references/convergence.md:678:| `graphRemediationRatio` | number (0.0-1.0) | Fraction of P0/P1 findings with at least one REMEDIATES edge | Rising ratio supports stop (findings being resolved) |
.opencode/skill/sk-deep-review/references/state_format.md:97:      "resolvedFindings",
.opencode/skill/sk-deep-review/references/state_format.md:378:  "strategy": "Traceability protocol replay: re-run unresolved core or overlay checks",
.opencode/skill/sk-deep-review/references/state_format.md:413:      "summary": "README claimed the old report contract."
.opencode/skill/sk-deep-review/references/state_format.md:445:Updated at the end of each iteration. Serves as the persistent brain across fresh-context iterations.
.opencode/skill/sk-deep-review/references/state_format.md:485:6. Set next-focus based on remaining dimensions and open findings
.opencode/skill/sk-deep-review/references/state_format.md:501:  "resolvedFindings": [],
.opencode/skill/sk-deep-review/references/state_format.md:503:  "persistentSameSeverity": [],
.opencode/skill/sk-deep-review/references/state_format.md:518:  "resolvedFindingsCount": 1,
.opencode/skill/sk-deep-review/references/state_format.md:534:| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
.opencode/skill/sk-deep-review/references/state_format.md:536:| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility; new code should read the split arrays. |
.opencode/skill/sk-deep-review/references/state_format.md:622:| 5 | Spec Seed | Minimal spec updates implied by findings |
.opencode/skill/sk-deep-review/references/state_format.md:636:**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.
.opencode/skill/sk-deep-review/references/state_format.md:671:<!-- ANCHOR:claim-adjudication -->
.opencode/skill/sk-deep-review/references/state_format.md:674:Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`) — a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
.opencode/skill/sk-deep-review/references/state_format.md:683:  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
.opencode/skill/sk-deep-review/references/state_format.md:704:| `claim` | string | The single assertion the finding makes (one sentence, evidence-backed) |
.opencode/skill/sk-deep-review/references/state_format.md:705:| `evidenceRefs` | string[] | `file:line` or `file:range` citations that substantiate the claim (at least one entry) |
.opencode/skill/sk-deep-review/references/state_format.md:708:| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication (may differ from the severity originally asserted) |
.opencode/skill/sk-deep-review/references/state_format.md:713:### Validation Rules (enforced by `step_post_iteration_claim_adjudication`)
.opencode/skill/sk-deep-review/references/state_format.md:719:5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.
.opencode/skill/sk-deep-review/references/state_format.md:730:<!-- /ANCHOR:claim-adjudication -->
.opencode/skill/sk-deep-review/references/state_format.md:760:| status | `"active"` / `"resolved"` / `"deferred"` / `"disproved"` | Current status |
.opencode/skill/sk-deep-review/references/state_format.md:771:[discovered] --> active --> resolved    (fixed or confirmed non-issue)
.opencode/skill/sk-deep-review/references/state_format.md:781:| resolved | No |
.opencode/skill/sk-deep-review/references/state_format.md:787:Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.
.opencode/skill/sk-deep-review/references/loop_protocol.md:80:   Store the resolved file list in strategy.md "Files Under Review".
.opencode/skill/sk-deep-review/references/loop_protocol.md:97:   | Core | `spec_code` | all targets | hard | Verify normative claims resolve to shipped behavior |
.opencode/skill/sk-deep-review/references/loop_protocol.md:98:   | Core | `checklist_evidence` | all targets | hard | Verify checked completion claims have evidence |
.opencode/skill/sk-deep-review/references/loop_protocol.md:101:   | Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
.opencode/skill/sk-deep-review/references/loop_protocol.md:104:   Only schedule overlay protocols that apply to the resolved target type.
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
.opencode/skill/sk-deep-review/references/loop_protocol.md:156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:268:| `spec_code` | Compare normative claims in spec.md against shipped implementation | Pass/partial/fail per claim with file:line evidence |
.opencode/skill/sk-deep-review/references/loop_protocol.md:272:| `feature_catalog_code` | Compare catalog claims against discoverable implementation | Match/stale/missing per feature |
.opencode/skill/sk-deep-review/references/loop_protocol.md:296:3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
.opencode/skill/sk-deep-review/references/loop_protocol.md:306:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.
.opencode/skill/sk-deep-review/references/loop_protocol.md:308:Each new P0/P1 must carry a typed packet with the following required fields (see `state_format.md` §9 for the full schema and a worked example):
.opencode/skill/sk-deep-review/references/loop_protocol.md:313:| `claim` | string | The single assertion the finding makes |
.opencode/skill/sk-deep-review/references/loop_protocol.md:317:| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication |
.opencode/skill/sk-deep-review/references/loop_protocol.md:328:5. Emit the typed packet inside the iteration file so `step_post_iteration_claim_adjudication` can parse it.
.opencode/skill/sk-deep-review/references/loop_protocol.md:330:**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
.opencode/skill/sk-deep-review/references/loop_protocol.md:365:| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay**: re-run the unresolved traceability protocol directly against the conflicting artifacts |
.opencode/skill/sk-deep-review/references/loop_protocol.md:366:| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review**: explicitly search for P0/P1 patterns or downgrade unsupported severity claims |
.opencode/skill/sk-deep-review/references/loop_protocol.md:414:Use adjudicated `finalSeverity` for any P0/P1 that was downgraded during claim adjudication (Step 4a of the iteration loop). The original severity from the iteration file is preserved in the audit appendix.
.opencode/skill/sk-deep-review/references/loop_protocol.md:440:| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md:50:| DRV-023 | Review reducer fails closed on corruption and missing anchors | Verify corruption and missing anchors fail closed by default, with `--lenient` and `--create-missing-anchors` as explicit escape hatches. | Validate fail-closed reducer behavior for sk-deep-review. Confirm that malformed JSONL exits with code `2` unless `--lenient` is passed, that missing machine-owned anchors throw `Missing machine-owned anchor ...` unless `--create-missing-anchors` is used, and that `corruptionWarnings` remains present after lenient recovery, then return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture}; echo "exit: $?"` -> 2. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'` -> 3. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture}; echo "exit: $?"` -> 4. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture} --lenient; echo "exit: $?"` -> 5. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'` -> 6. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture} --create-missing-anchors; echo "exit: $?"` -> 7. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {anchor_fixture}/review/deep-review-strategy.md` | Without `--lenient`, corrupt JSONL exits `2` and preserves `corruptionWarnings`; without `--create-missing-anchors`, the reducer throws `Missing machine-owned anchor ...`; with `--lenient`, the reducer exits `0` but preserves `corruptionWarnings`; with `--create-missing-anchors`, the missing anchor is created and the reducer proceeds. | Capture both exit codes, the missing-anchor stderr, the populated `.corruptionWarnings` field before and after `--lenient`, and the strategy `next-focus` anchor after `--create-missing-anchors`. | PASS if all four exit conditions match the documented contract and warning state is still visible after lenient recovery; FAIL if any exit code, error string, warning surface, or anchor bootstrap behavior differs. | Privilege `reduce-state.cjs` for exit semantics and `review-reducer-fail-closed.vitest.ts` for concrete expected behavior. If fixture preparation accidentally combines both failures in one directory, split into two fixture copies before judging the reducer. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md:66:| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; emits `corruptionWarnings`, exits non-zero on corruption, and enforces machine-owned anchor presence unless recovery flags are passed |
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:15:- A persistent active `P0` (`F001`) introduced in iteration 2 and still open in iteration 3
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:16:- Three iteration files that let the reducer populate `blockedStopHistory`, `persistentSameSeverity`, and `severityChanged`
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:25:node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs \
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:73:  "resolvedFindings": [],
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:113:  "persistentSameSeverity": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:263:  "resolvedFindingsCount": 0,
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:15:Serves as the persistent brain for this blocked-stop review fixture. Records which dimensions remain, what was found, what approaches failed, and where the next iteration should focus.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md:73:- Iteration files keep the finding lineage explicit across severity changes.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:81:- persistentSameSeverity: 2
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:14:This scenario validates review iteration writes findings, JSONL, and strategy update for `DRV-009`. The objective is to verify that each iteration writes `iteration-NNN.md` with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:47:| DRV-009 | Review iteration writes findings, JSONL, and strategy update | Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy. | Validate the per-iteration write contract for sk-deep-review. Confirm that each iteration writes `iteration-NNN.md`, appends a JSONL record with severity counts, and updates `deep-review-strategy.md`, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'iteration-NNN\|iteration-{NNN}\|iteration_pattern\|Write.*iteration' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'step_validate_iteration\|iteration_file_written\|jsonl_appended\|strategy_updated\|on_missing_outputs' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'iteration-NNN\|JSONL\|strategy\|Write.*findings\|P0.*P1.*P2' .opencode/skill/sk-deep-review/references/quick_reference.md` | The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same outputs. | Capture the dispatch constraints, the validation step required outputs, and the quick reference iteration checklist. | PASS if all sources agree on the three required outputs and their formats; FAIL if any output is undocumented or the validation step does not check for it. | Inspect the on_missing_outputs fallback to verify that error handling still appends a JSONL record even when the agent fails to complete its outputs. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:28:- When: The operator runs `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:31:- Orchestrator prompt: Validate blocked-stop reducer surfacing for sk-deep-review. Confirm that running `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>` on a review packet with at least one `blocked_stop` event preserves the review gate bundle in `blockedStopHistory`, renders `BLOCKED STOPS` in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:50:| DRV-022 | Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus | Verify review `blocked_stop` output appears in `blockedStopHistory`, `BLOCKED STOPS`, and the strategy recovery anchor. | Validate blocked-stop reducer surfacing for sk-deep-review. Confirm that running `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>` on a review packet with at least one `blocked_stop` event preserves the review gate bundle in `blockedStopHistory`, renders `BLOCKED STOPS` in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy, then return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {spec_folder}` -> 2. `bash: cat {spec_folder}/review/deep-review-findings-registry.json | jq '.blockedStopHistory'` -> 3. `bash: grep -A 5 "BLOCKED STOPS" {spec_folder}/review/deep-review-dashboard.md` -> 4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/review/deep-review-strategy.md` | `blockedStopHistory` contains reducer-promoted blocked-stop entries with the review gate names; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record. | Capture the populated `blockedStopHistory` array, the dashboard `BLOCKED STOPS` excerpt, and the strategy `next-focus` anchor showing the recovery guidance. | PASS if all three review surfaces show the same blocked-stop data and preserve the review gate names; FAIL if any surface is missing blocked-stop data or the gate bundle is incomplete after the reducer run. | Privilege `deep-review-findings-registry.json` as the reducer-owned source of truth. If the registry is correct but the dashboard or strategy anchor is stale, treat that as reducer surfacing drift rather than JSONL input failure. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:66:| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md:3:description: "Verify that review iteration records carry a graphEvents array with dimension_node, file_node, and finding_node entries."
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md:31:- Orchestrator prompt: Validate the structured `graphEvents` contract for sk-deep-review. Confirm that graph-aware review convergence expects `graphEvents` in iteration records, and that graph replay tests show review JSONL records carrying `dimension_node`, `file_node`, and `finding_node` entries, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md:35:- Pass/fail posture: PASS if the convergence reference and graph replay tests agree that completed review iterations carry `graphEvents` and that review node types include `dimension_node`, `file_node`, and `finding_node`; FAIL if the record contract is absent or replay coverage is missing.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md:50:| DRV-015 | Review iterations emit structured graphEvents | Verify completed review iterations emit `graphEvents` with `dimension_node`, `file_node`, and `finding_node` coverage. | Validate the structured `graphEvents` contract for sk-deep-review. Confirm that graph-aware review convergence expects `graphEvents` in iteration records, and that the graph replay tests show review JSONL records carrying `dimension_node`, `file_node`, and `finding_node` entries, then return a concise operator-facing verdict. | 1. `bash: rg -n 'graphEvents|review iteration records|graph-aware review convergence' .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'graphEvents|dimension_node|file_node|finding_node|reviewNodeTypes' .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts` -> 3. `bash: rg -n 'graphEvents|finding_node' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts` | `graphEvents` used as iteration-record input; replay tests show review node-type coverage including `dimension_node`, `file_node`, and `finding_node`. | Capture the convergence reference lines that describe `graphEvents` in review iteration records, the review node-type list, and one replay example showing JSONL-shaped `graphEvents`. | PASS if the convergence reference and replay tests agree that completed review iterations emit `graphEvents` and that review graph node coverage includes `dimension_node`, `file_node`, and `finding_node`; FAIL if any of those pieces are missing or contradictory. | Privilege the convergence reference for the contract and the replay tests for concrete review node-type evidence. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:18:Dimension coverage is the heaviest-weighted convergence signal at 0.45. If it fires prematurely -- before all dimensions are examined or before findings have stabilized -- the review could stop with an incomplete picture. The `minStabilizationPasses` requirement ensures that coverage is not just claimed but verified through at least one follow-up iteration.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:28:- Orchestrator prompt: Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 (adversarial self-check on P0 findings) is documented in the SKILL.md rules, enforced in the quick reference iteration checklist, and checked in the YAML post-iteration claim adjudication, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:29:- Expected execution process: Inspect the SKILL.md rules for Rule 10, then the quick reference iteration checklist for the self-check step, then the YAML post-iteration claim adjudication step, then the agent definitions for the self-check protocol.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:31:- Expected signals: Rule 10 in SKILL.md mandates adversarial self-check for P0; the iteration checklist includes it as step 5; the YAML has a claim adjudication step that checks for P0/P1 self-check evidence; the agent definitions describe the Hunter/Skeptic/Referee roles.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:47:| DRV-012 | Adversarial self-check runs on P0 findings | Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them. | Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 mandates adversarial self-check for P0 findings, the iteration checklist enforces it, and the YAML claim adjudication checks for it, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'adversarial\|self.check\|Hunter\|Skeptic\|Referee\|Rule 10\|re-read.*P0' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'adversarial\|self.check\|P0.*check\|claim_adjudication' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'adversarial\|self.check\|P0\|Hunter\|Skeptic\|Referee' .opencode/skill/sk-deep-review/references/quick_reference.md .codex/agents/deep-review.toml .claude/agents/deep-review.md` | Rule 10 in SKILL.md mandates adversarial self-check; iteration checklist includes it as step 5; YAML has claim adjudication; agent definitions describe the protocol. | Capture Rule 10, the checklist step, the claim adjudication YAML step, and the agent self-check instructions. | PASS if the adversarial self-check is documented, enforced in the iteration checklist, and checked in the YAML; FAIL if P0 findings can be recorded without a self-check. | If the agent definition lacks explicit Hunter/Skeptic/Referee roles, check whether the SKILL.md Rule 10 wording is sufficient to trigger the behavior implicitly. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Post-iteration claim adjudication; inspect `step_post_iteration_claim_adjudication` |
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:3:description: "Verify that finding deduplication uses adjudicated finalSeverity and produces a clean Active Finding Registry in the review report."
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:14:This scenario validates finding deduplication and registry for `DRV-028`. The objective is to verify that the synthesis phase deduplicates findings across iterations using adjudicated `finalSeverity` and produces a clean Active Finding Registry in the review report.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:18:Multiple review iterations covering overlapping code areas will inevitably find the same issue more than once. Without deduplication, the report inflates finding counts, confuses remediation planning, and undermines operator trust. The `finalSeverity` adjudication ensures that when the same finding appears at different severities across iterations, the authoritative severity is used in the registry.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:26:- Objective: Verify finding deduplication uses adjudicated finalSeverity and produces clean registry.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:28:- Orchestrator prompt: Validate the finding deduplication contract for sk-deep-review. Confirm that during synthesis, findings from all `review/iterations/iteration-NNN.md` files are compared for duplicates, that duplicate resolution uses adjudicated `finalSeverity` (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in `review-report.md` contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:32:- Pass/fail posture: PASS if deduplication produces a clean registry with adjudicated severities; FAIL if duplicates appear in the registry or P0 findings are lost during deduplication.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:47:| DRV-028 | Finding deduplication and registry | Verify finding deduplication uses adjudicated finalSeverity and produces clean Active Finding Registry. | Validate the finding deduplication contract for sk-deep-review. Confirm that duplicate findings across iterations are merged using adjudicated `finalSeverity` (highest severity wins), the Active Finding Registry contains unique findings with evidence, and P0 findings are never discarded, then return a concise operator-facing verdict. | 1. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|Active Finding Registry|unique.*finding|merge.*finding|duplicate' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` -> 2. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|active_finding|merge|duplicate|unique' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Active Finding Registry|Dedup|finalSeverity|finding.*registry|finding.*evidence|unique.*finding' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Findings compared across iterations, `finalSeverity` is highest severity encountered, Active Finding Registry has unique entries, P0 never downgraded, evidence included. | Capture the deduplication rules from SKILL.md, the YAML synthesis deduplication logic, and the Active Finding Registry section definition from quick reference. | PASS if deduplication produces a clean registry with adjudicated severities; FAIL if duplicates appear in the registry or P0 findings are lost during deduplication. | Privilege the SKILL.md rules for deduplication logic and the quick reference for the Active Finding Registry section definition. |

codex
The first pass surfaced the key reducer branches, but I still need the precise contract sections and any tests that exercise them. I’m narrowing to exact line ranges now: the reducer’s registry logic, the Section 9 schema, the loop’s Step 4a adjudication rules, and any reducer tests/manual scenarios that confirm intended behavior.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '560,920p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '260,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	
   561	  if (!grouped.size) {
   562	    return '[No exhausted approach categories yet]';
   563	  }
   564	
   565	  return Array.from(grouped.entries())
   566	    .sort(([left], [right]) => left.localeCompare(right))
   567	    .map(([entry, runs]) => {
   568	      const attemptCount = runs.length;
   569	      const lastRun = Math.max(...runs);
   570	      return [
   571	        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
   572	        `- What was tried: ${entry}`,
   573	        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
   574	        `- Do NOT retry: ${entry}`,
   575	      ].join('\n');
   576	    })
   577	    .join('\n\n');
   578	}
   579	
   580	function replaceAnchorSection(content, anchorId, heading, body, options = {}) {
   581	  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
   582	  const replacement = [
   583	    `<!-- ANCHOR:${anchorId} -->`,
   584	    `## ${heading}`,
   585	    body.trim() ? body.trim() : '[None yet]',
   586	    '',
   587	    `<!-- /ANCHOR:${anchorId} -->`,
   588	  ].join('\n');
   589	
   590	  if (!pattern.test(content)) {
   591	    if (options.createMissing) {
   592	      const suffix = content.endsWith('\n') ? '' : '\n';
   593	      return `${content}${suffix}\n${replacement}\n`;
   594	    }
   595	    throw new Error(
   596	      `Missing machine-owned anchor "${anchorId}" in deep-review strategy file. `
   597	      + 'Pass createMissing:true (or the reducer CLI flag --create-missing-anchors) to bootstrap.',
   598	    );
   599	  }
   600	  return content.replace(pattern, replacement);
   601	}
   602	
   603	function updateStrategyContent(strategyContent, registry, iterationFiles, options = {}, iterationRecords = []) {
   604	  // Early return when there is no strategy file to update. Empty content
   605	  // cannot contain the machine-owned anchors and replaceAnchorSection would
   606	  // correctly fail-close — but for that specific case we intentionally skip
   607	  // rather than throw so bootstrap flows (no strategy yet) still work.
   608	  if (!strategyContent) {
   609	    return strategyContent;
   610	  }
   611	
   612	  const anchorOptions = { createMissing: Boolean(options.createMissingAnchors) };
   613	  const severity = registry.findingsBySeverity;
   614	  const runningFindings = [
   615	    `- P0 (Blockers): ${severity.P0}`,
   616	    `- P1 (Required): ${severity.P1}`,
   617	    `- P2 (Suggestions): ${severity.P2}`,
   618	    `- Resolved: ${registry.resolvedFindingsCount}`,
   619	  ].join('\n');
   620	
   621	  const completedDimensions = REQUIRED_DIMENSIONS
   622	    .filter((dimension) => registry.dimensionCoverage[dimension])
   623	    .map((dimension) => `- [x] ${dimension}`)
   624	    .join('\n') || '[None yet]';
   625	
   626	  const remainingDimensions = REQUIRED_DIMENSIONS
   627	    .filter((dimension) => !registry.dimensionCoverage[dimension])
   628	    .map((dimension) => `- [ ] ${dimension}`)
   629	    .join('\n') || '[All dimensions complete]';
   630	
   631	  // Default next-focus comes from latest iteration → first uncovered dimension → fallback.
   632	  let nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   633	    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
   634	    || '[All dimensions covered]';
   635	
   636	  // Part C REQ-014 / Phase 008 P1-03 closure: prefer the latest blocked-stop
   637	  // recovery only when blocked-stop is genuinely the most recent loop event.
   638	  // The earlier implementation read timestamps from the markdown iteration
   639	  // files, but parseIterationFile() never captures timestamps, so
   640	  // latestIterationTimestamp was always undefined and any historical
   641	  // blocked-stop permanently pinned next-focus. Fix: source recency from the
   642	  // JSONL iteration records (which do carry timestamps) instead.
   643	  const latestBlockedStop = registry.blockedStopHistory?.at(-1);
   644	  if (latestBlockedStop && latestBlockedStop.timestamp) {
   645	    const latestIterationTimestamp = iterationRecords
   646	      .filter((record) => record?.type === 'iteration' && typeof record.timestamp === 'string')
   647	      .map((record) => record.timestamp)
   648	      .at(-1);
   649	    const blockedIsMostRecent = !latestIterationTimestamp
   650	      || latestBlockedStop.timestamp >= latestIterationTimestamp;
   651	    if (blockedIsMostRecent) {
   652	      const blockers = Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0
   653	        ? latestBlockedStop.blockedBy.join(', ')
   654	        : 'unknown gates';
   655	      const recovery = latestBlockedStop.recoveryStrategy || '[no recovery strategy provided]';
   656	      nextFocus = [
   657	        `BLOCKED on: ${blockers}`,
   658	        `Recovery: ${recovery}`,
   659	        'Address the blocking gates before the next iteration.',
   660	      ].join('\n');
   661	    }
   662	  }
   663	
   664	  let updated = strategyContent;
   665	  updated = replaceAnchorSection(updated, 'review-dimensions', '3. REVIEW DIMENSIONS (remaining)', remainingDimensions, anchorOptions);
   666	  updated = replaceAnchorSection(updated, 'completed-dimensions', '4. COMPLETED DIMENSIONS', completedDimensions, anchorOptions);
   667	  updated = replaceAnchorSection(updated, 'running-findings', '5. RUNNING FINDINGS', runningFindings, anchorOptions);
   668	  updated = replaceAnchorSection(
   669	    updated,
   670	    'exhausted-approaches',
   671	    '9. EXHAUSTED APPROACHES (do not retry)',
   672	    buildExhaustedApproaches(iterationFiles),
   673	    anchorOptions,
   674	  );
   675	  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus, anchorOptions);
   676	  return updated;
   677	}
   678	
   679	function renderDashboard(config, registry, iterationRecords, iterationFiles) {
   680	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   681	  const ratios = iterationRecords
   682	    .filter((record) => record.type === 'iteration')
   683	    .map((record) => (typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio : null))
   684	    .filter((value) => value !== null);
   685	  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
   686	  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   687	    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
   688	    || '[All dimensions covered]';
   689	
   690	  const severity = registry.findingsBySeverity;
   691	  const verdict = severity.P0 > 0
   692	    ? 'FAIL'
   693	    : severity.P1 > 0
   694	      ? 'CONDITIONAL'
   695	      : 'PASS';
   696	  const hasAdvisories = verdict === 'PASS' && severity.P2 > 0;
   697	
   698	  const progressRows = iterationRecords
   699	    .filter((record) => record.type === 'iteration')
   700	    .map((record) => {
   701	      const dimensions = Array.isArray(record.dimensions) ? record.dimensions.join('/') : '-';
   702	      const ratio = typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio.toFixed(2) : '0.00';
   703	      const summary = record.findingsSummary || {};
   704	      const findings = `${summary.P0 ?? 0}/${summary.P1 ?? 0}/${summary.P2 ?? 0}`;
   705	      return `| ${record.run} | ${record.focus || 'unknown'} | ${dimensions} | ${ratio} | ${findings} | ${record.status || 'complete'} |`;
   706	    })
   707	    .join('\n') || '| 0 | none yet | - | 0.00 | 0/0/0 | initialized |';
   708	
   709	  const dimensionRows = REQUIRED_DIMENSIONS
   710	    .map((dimension) => {
   711	      const covered = registry.dimensionCoverage[dimension];
   712	      const status = covered ? 'covered' : 'pending';
   713	      const openInDimension = registry.openFindings.filter((finding) => finding.dimension === dimension).length;
   714	      return `| ${dimension} | ${status} | ${openInDimension} |`;
   715	    })
   716	    .join('\n');
   717	
   718	  return [
   719	    '---',
   720	    'title: Deep Review Dashboard',
   721	    'description: Auto-generated reducer view over the review packet.',
   722	    '---',
   723	    '',
   724	    '# Deep Review Dashboard - Session Overview',
   725	    '',
   726	    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
   727	    '',
   728	    '<!-- ANCHOR:overview -->',
   729	    '## 1. OVERVIEW',
   730	    '',
   731	    'Reducer-generated observability surface for the active review packet.',
   732	    '',
   733	    '<!-- /ANCHOR:overview -->',
   734	    '<!-- ANCHOR:status -->',
   735	    '## 2. STATUS',
   736	    `- Review Target: ${config.reviewTarget || '[Unknown target]'} (${config.reviewTargetType || 'unknown'})`,
   737	    `- Started: ${config.createdAt || '[Unknown start]'}`,
   738	    `- Status: ${String(config.status || 'initialized').toUpperCase()}`,
   739	    `- Iteration: ${iterationRecords.filter((record) => record.type === 'iteration').length} of ${config.maxIterations || 0}`,
   740	    `- Provisional Verdict: ${verdict}`,
   741	    `- hasAdvisories: ${hasAdvisories}`,
   742	    `- Session ID: ${config.sessionId || '[Unknown session]'}`,
   743	    `- Lifecycle Mode: ${config.lineageMode || 'new'}`,
   744	    `- Generation: ${config.generation ?? 1}`,
   745	    '',
   746	    '<!-- /ANCHOR:status -->',
   747	    '<!-- ANCHOR:findings-summary -->',
   748	    '## 3. FINDINGS SUMMARY',
   749	    '',
   750	    '| Severity | Count |',
   751	    '|----------|------:|',
   752	    `| P0 (Blockers) | ${severity.P0} |`,
   753	    `| P1 (Required) | ${severity.P1} |`,
   754	    `| P2 (Suggestions) | ${severity.P2} |`,
   755	    `| Resolved | ${registry.resolvedFindingsCount} |`,
   756	    '',
   757	    '<!-- /ANCHOR:findings-summary -->',
   758	    '<!-- ANCHOR:progress -->',
   759	    '## 4. PROGRESS',
   760	    '',
   761	    '| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |',
   762	    '|---|-------|------------|-------|----------|--------|',
   763	    progressRows,
   764	    '',
   765	    '<!-- /ANCHOR:progress -->',
   766	    '<!-- ANCHOR:dimension-coverage -->',
   767	    '## 5. DIMENSION COVERAGE',
   768	    '',
   769	    '| Dimension | Status | Open findings |',
   770	    '|-----------|--------|--------------:|',
   771	    dimensionRows,
   772	    '',
   773	    '<!-- /ANCHOR:dimension-coverage -->',
   774	    '<!-- ANCHOR:blocked-stops -->',
   775	    '## 6. BLOCKED STOPS',
   776	    ...(registry.blockedStopHistory && registry.blockedStopHistory.length > 0
   777	      ? registry.blockedStopHistory.flatMap((entry) => {
   778	          const blockers = Array.isArray(entry.blockedBy) && entry.blockedBy.length > 0
   779	            ? entry.blockedBy.join(', ')
   780	            : 'unknown gates';
   781	          const gateSummary = entry.gateResults && typeof entry.gateResults === 'object'
   782	            ? Object.entries(entry.gateResults)
   783	                .map(([gate, result]) => {
   784	                  const pass = result && typeof result === 'object' && 'pass' in result ? result.pass : '?';
   785	                  return `${gate}: ${pass}`;
   786	                })
   787	                .join(', ')
   788	            : '[no gate results]';
   789	          return [
   790	            `### Iteration ${entry.run} — blocked by [${blockers}]`,
   791	            `- Recovery: ${entry.recoveryStrategy || '[no recovery strategy recorded]'}`,
   792	            `- Gate results: ${gateSummary}`,
   793	            `- Timestamp: ${entry.timestamp || '[no timestamp]'}`,
   794	            '',
   795	          ];
   796	        })
   797	      : ['No blocked-stop events recorded.', '']),
   798	    '<!-- /ANCHOR:blocked-stops -->',
   799	    '<!-- ANCHOR:graph-convergence -->',
   800	    '## 7. GRAPH CONVERGENCE',
   801	    `- graphConvergenceScore: ${Number(registry.graphConvergenceScore || 0).toFixed(2)}`,
   802	    `- graphDecision: ${registry.graphDecision || 'none'}`,
   803	    ...(Array.isArray(registry.graphBlockers) && registry.graphBlockers.length > 0
   804	      ? [`- graphBlockers: ${registry.graphBlockers.map((b) => (typeof b === 'string' ? b : JSON.stringify(b))).join(', ')}`]
   805	      : ['- graphBlockers: none']),
   806	    '',
   807	    '<!-- /ANCHOR:graph-convergence -->',
   808	    '<!-- ANCHOR:trend -->',
   809	    '## 8. TREND',
   810	    `- Last 3 ratios: ${lastThreeRatios}`,
   811	    `- convergenceScore: ${Number(registry.convergenceScore || 0).toFixed(2)}`,
   812	    `- openFindings: ${registry.openFindingsCount}`,
   813	    `- persistentSameSeverity: ${(registry.persistentSameSeverity || []).length}`,
   814	    `- severityChanged: ${(registry.severityChanged || []).length}`,
   815	    `- repeatedFindings (deprecated combined bucket): ${registry.repeatedFindings.length}`,
   816	    '',
   817	    '<!-- /ANCHOR:trend -->',
   818	    '<!-- ANCHOR:corruption-warnings -->',
   819	    '## 9. CORRUPTION WARNINGS',
   820	    ...(Array.isArray(registry.corruptionWarnings) && registry.corruptionWarnings.length > 0
   821	      ? registry.corruptionWarnings.map((w) => `- Line ${w.line}: ${w.error} (raw: ${w.raw})`)
   822	      : ['No corrupt JSONL lines detected.']),
   823	    '',
   824	    '<!-- /ANCHOR:corruption-warnings -->',
   825	    '<!-- ANCHOR:next-focus -->',
   826	    '## 10. NEXT FOCUS',
   827	    nextFocus,
   828	    '',
   829	    '<!-- /ANCHOR:next-focus -->',
   830	    '<!-- ANCHOR:active-risks -->',
   831	    '## 11. ACTIVE RISKS',
   832	    ...(function buildActiveRisks() {
   833	      // REQ-034 (042 closing audit, F015): surface non-P0 release-readiness
   834	      // debt alongside P0s so the dashboard cannot hide P1 debt behind a
   835	      // "None active" summary when activeP0 == 0. Gate debt on the latest
   836	      // `blocked_stop` and `claim_adjudication` events so operators see
   837	      // claim-adjudication and legal-stop gate failures, not just severity.
   838	      const lines = [];
   839	      if (latestIteration?.status === 'error') {
   840	        lines.push('- Latest iteration reported error status.');
   841	      }
   842	      if (severity.P0 > 0) {
   843	        lines.push(`- ${severity.P0} active P0 finding(s) blocking release.`);
   844	      }
   845	      if (severity.P1 > 0) {
   846	        lines.push(`- ${severity.P1} active P1 finding(s) — required before release; not a P0 but still blocks PASS.`);
   847	      }
   848	      const latestClaimAdjudication = [...iterationRecords]
   849	        .reverse()
   850	        .find((r) => r && r.type === 'event' && r.event === 'claim_adjudication');
   851	      if (latestClaimAdjudication && latestClaimAdjudication.passed === false) {
   852	        const missing = Array.isArray(latestClaimAdjudication.missingPackets) && latestClaimAdjudication.missingPackets.length > 0
   853	          ? ` (missing packets: ${latestClaimAdjudication.missingPackets.join(', ')})`
   854	          : '';
   855	        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
   856	      }
   857	      const latestBlockedStop = [...iterationRecords]
   858	        .reverse()
   859	        .find((r) => r && r.type === 'event' && r.event === 'blocked_stop');
   860	      if (latestBlockedStop && Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0) {
   861	        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${latestBlockedStop.blockedBy.join(', ')}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
   862	      }
   863	      if (severity.P2 > 0 && lines.length === 0) {
   864	        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
   865	      }
   866	      if (lines.length === 0) {
   867	        lines.push('- None active beyond normal review uncertainty.');
   868	      }
   869	      return lines;
   870	    })(),
   871	    '',
   872	    '<!-- /ANCHOR:active-risks -->',
   873	    '',
   874	  ].join('\n');
   875	}
   876	
   877	/**
   878	 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
   879	 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
   880	 *
   881	 * @param {string} specFolder - Path to the spec folder containing a review/ directory
   882	 * @param {Object} [options] - Reducer options
   883	 * @param {boolean} [options.write=true] - Write outputs to disk when true
   884	 * @returns {Object} Paths and content for registry, strategy, and dashboard
   885	 */
   886	function reduceReviewState(specFolder, options = {}) {
   887	  const write = options.write !== false;
   888	  const lenient = Boolean(options.lenient);
   889	  const createMissingAnchors = Boolean(options.createMissingAnchors);
   890	  const resolvedSpecFolder = path.resolve(specFolder);
   891	  const reviewDir = path.join(resolvedSpecFolder, 'review');
   892	  const configPath = path.join(reviewDir, 'deep-review-config.json');
   893	  const stateLogPath = path.join(reviewDir, 'deep-review-state.jsonl');
   894	  const strategyPath = path.join(reviewDir, 'deep-review-strategy.md');
   895	  const registryPath = path.join(reviewDir, 'deep-review-findings-registry.json');
   896	  const dashboardPath = path.join(reviewDir, 'deep-review-dashboard.md');
   897	  const iterationDir = path.join(reviewDir, 'iterations');
   898	
   899	  const config = readJson(configPath);
   900	  const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
   901	  const strategyContent = fs.existsSync(strategyPath) ? readUtf8(strategyPath) : '';
   902	  const strategyDimensions = parseStrategyDimensions(strategyContent);
   903	  const iterationFiles = fs.existsSync(iterationDir)
   904	    ? fs.readdirSync(iterationDir)
   905	        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
   906	        .sort()
   907	        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
   908	    : [];
   909	
   910	  const registry = buildRegistry(strategyDimensions, iterationFiles, records, config, corruptionWarnings);
   911	  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, { createMissingAnchors }, records);
   912	  const dashboard = renderDashboard(config, registry, records, iterationFiles);
   913	
   914	  if (write) {
   915	    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
   916	    if (strategyContent) {
   917	      writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
   918	    }
   919	    writeUtf8(dashboardPath, dashboard);
   920	  }

 succeeded in 0ms:
   260	  for (const iteration of iterationFiles) {
   261	    for (const finding of iteration.findings) {
   262	      const existing = findingById.get(finding.findingId);
   263	      if (!existing) {
   264	        findingById.set(finding.findingId, {
   265	          ...finding,
   266	          dimension: deriveDimension(finding, iteration),
   267	          firstSeen: iteration.run,
   268	          lastSeen: iteration.run,
   269	          status: 'active',
   270	          transitions: [{
   271	            iteration: iteration.run,
   272	            from: null,
   273	            to: finding.severity,
   274	            reason: 'Initial discovery',
   275	          }],
   276	        });
   277	      } else {
   278	        existing.lastSeen = iteration.run;
   279	        if (existing.severity !== finding.severity) {
   280	          existing.transitions.push({
   281	            iteration: iteration.run,
   282	            from: existing.severity,
   283	            to: finding.severity,
   284	            reason: 'Severity adjusted in later iteration',
   285	          });
   286	          existing.severity = finding.severity;
   287	        }
   288	      }
   289	    }
   290	  }
   291	
   292	  const resolvedIdSet = new Set();
   293	  for (const record of iterationRecords) {
   294	    if (Array.isArray(record.resolvedFindings)) {
   295	      for (const id of record.resolvedFindings) {
   296	        resolvedIdSet.add(id);
   297	      }
   298	    }
   299	  }
   300	
   301	  const openFindings = [];
   302	  const resolvedFindings = [];
   303	  for (const finding of findingById.values()) {
   304	    if (resolvedIdSet.has(finding.findingId)) {
   305	      finding.status = 'resolved';
   306	      resolvedFindings.push(finding);
   307	    } else {
   308	      openFindings.push(finding);
   309	    }
   310	  }
   311	
   312	  openFindings.sort(compareFindings);
   313	  resolvedFindings.sort(compareFindings);
   314	
   315	  return { openFindings, resolvedFindings };
   316	}
   317	
   318	function compareFindings(left, right) {
   319	  const severityOrder = { P0: 0, P1: 1, P2: 2 };
   320	  const severityDiff = (severityOrder[left.severity] ?? 9) - (severityOrder[right.severity] ?? 9);
   321	  if (severityDiff !== 0) {
   322	    return severityDiff;
   323	  }
   324	  return left.findingId.localeCompare(right.findingId);
   325	}
   326	
   327	function deriveDimension(finding, iteration) {
   328	  const focus = `${iteration.focus} ${finding.title} ${finding.description}`.toLowerCase();
   329	  for (const dimension of REQUIRED_DIMENSIONS) {
   330	    if (focus.includes(dimension)) {
   331	      return dimension;
   332	    }
   333	  }
   334	  return iteration.dimensionsAddressed[0] || 'correctness';
   335	}
   336	
   337	function buildDimensionCoverage(iterationRecords, strategyDimensions) {
   338	  const covered = {};
   339	  for (const dimension of REQUIRED_DIMENSIONS) {
   340	    covered[dimension] = false;
   341	  }
   342	
   343	  for (const record of iterationRecords) {
   344	    if (!Array.isArray(record.dimensions)) {
   345	      continue;
   346	    }
   347	    for (const dimension of record.dimensions) {
   348	      const normalized = String(dimension).toLowerCase();
   349	      if (normalized in covered) {
   350	        covered[normalized] = true;
   351	      }
   352	    }
   353	  }
   354	
   355	  for (const entry of strategyDimensions) {
   356	    if (!entry.checked) {
   357	      continue;
   358	    }
   359	    const normalized = entry.text.toLowerCase();
   360	    for (const dimension of REQUIRED_DIMENSIONS) {
   361	      if (normalized.includes(dimension)) {
   362	        covered[dimension] = true;
   363	      }
   364	    }
   365	  }
   366	
   367	  return covered;
   368	}
   369	
   370	function buildFindingsBySeverity(openFindings) {
   371	  const counts = zeroSeverityMap();
   372	  for (const finding of openFindings) {
   373	    if (SEVERITY_KEYS.includes(finding.severity)) {
   374	      counts[finding.severity] += 1;
   375	    }
   376	  }
   377	  return counts;
   378	}
   379	
   380	function computeConvergenceScore(iterationRecords) {
   381	  const latest = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   382	  if (!latest) {
   383	    return 0;
   384	  }
   385	  return (
   386	    latest?.convergenceSignals?.compositeStop
   387	    ?? (typeof latest?.newFindingsRatio === 'number' ? 1 - latest.newFindingsRatio : 0)
   388	    ?? 0
   389	  );
   390	}
   391	
   392	function computeGraphConvergenceScore(signals) {
   393	  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
   394	    return 0;
   395	  }
   396	
   397	  const namedScore = signals.score
   398	    ?? signals.convergenceScore
   399	    ?? signals.compositeScore
   400	    ?? signals.stopScore
   401	    ?? signals.decisionScore;
   402	  if (typeof namedScore === 'number' && Number.isFinite(namedScore)) {
   403	    return namedScore;
   404	  }
   405	
   406	  const numericSignals = Object.values(signals)
   407	    .filter((value) => typeof value === 'number' && Number.isFinite(value));
   408	  if (!numericSignals.length) {
   409	    return 0;
   410	  }
   411	
   412	  const sum = numericSignals.reduce((total, value) => total + value, 0);
   413	  return sum / numericSignals.length;
   414	}
   415	
   416	function buildGraphConvergenceRollup(records) {
   417	  const latest = records
   418	    .filter((record) => record?.type === 'event' && record?.event === 'graph_convergence')
   419	    .at(-1);
   420	
   421	  if (!latest) {
   422	    return {
   423	      score: 0,
   424	      decision: null,
   425	      blockers: [],
   426	    };
   427	  }
   428	
   429	  return {
   430	    score: computeGraphConvergenceScore(latest.signals),
   431	    decision: normalizeText(latest.decision || '') || null,
   432	    blockers: Array.isArray(latest.blockers) ? latest.blockers : [],
   433	  };
   434	}
   435	
   436	/**
   437	 * Phase 008 P1-02 closure: defensively normalize each entry in `blockedBy` so
   438	 * the review dashboard cannot render `[object Object]` even if an older YAML
   439	 * workflow accidentally passes structured graph blockers through the contract.
   440	 *
   441	 * Contract: `blockedBy` is `string[]` of gate names. If an entry is already a
   442	 * string, pass it through. If it is a structured graph blocker object
   443	 * (`{type, description, count, severity}`), prefer `.type`, then `.name`, then
   444	 * a short JSON preview. If it is anything else, stringify it.
   445	 */
   446	function normalizeBlockedByList(value, legacyLegalStop) {
   447	  const rawList = Array.isArray(value)
   448	    ? value
   449	    : Array.isArray(legacyLegalStop?.blockedBy)
   450	      ? legacyLegalStop.blockedBy
   451	      : [];
   452	
   453	  return rawList.map((entry) => {
   454	    if (typeof entry === 'string') return entry;
   455	    if (entry && typeof entry === 'object') {
   456	      if (typeof entry.type === 'string' && entry.type.length > 0) return entry.type;
   457	      if (typeof entry.name === 'string' && entry.name.length > 0) return entry.name;
   458	      return 'graph_blocker';
   459	    }
   460	    return String(entry);
   461	  });
   462	}
   463	
   464	function buildBlockedStopHistory(records) {
   465	  return records
   466	    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
   467	    .map((record) => {
   468	      const legacyLegalStop = record.legalStop && typeof record.legalStop === 'object'
   469	        ? record.legalStop
   470	        : {};
   471	      const blockedBy = normalizeBlockedByList(record.blockedBy, legacyLegalStop);
   472	      const graphBlockerDetail = Array.isArray(record.graphBlockerDetail)
   473	        ? record.graphBlockerDetail
   474	        : Array.isArray(record.blockedBy) && record.blockedBy.some((e) => e && typeof e === 'object')
   475	          ? record.blockedBy
   476	          : [];
   477	
   478	      return {
   479	        run: typeof record.run === 'number' ? record.run : 0,
   480	        blockedBy,
   481	        graphBlockerDetail,
   482	        gateResults: record.gateResults && typeof record.gateResults === 'object'
   483	          ? record.gateResults
   484	          : legacyLegalStop.gateResults && typeof legacyLegalStop.gateResults === 'object'
   485	            ? legacyLegalStop.gateResults
   486	            : {},
   487	        recoveryStrategy: normalizeText(record.recoveryStrategy || ''),
   488	        timestamp: normalizeText(record.timestamp || ''),
   489	      };
   490	    });
   491	}
   492	
   493	function buildRegistry(strategyDimensions, iterationFiles, iterationRecords, config, corruptionWarnings = []) {
   494	  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
   495	  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
   496	  const findingsBySeverity = buildFindingsBySeverity(openFindings);
   497	  const convergenceScore = computeConvergenceScore(iterationRecords);
   498	  const graphConvergence = buildGraphConvergenceRollup(iterationRecords);
   499	  const blockedStopHistory = buildBlockedStopHistory(iterationRecords);
   500	
   501	  // Part C REQ-018: split repeatedFindings into two semantically distinct buckets
   502	  // so persistent-same-severity findings and severity-churn findings don't collapse.
   503	  const persistentSameSeverity = openFindings.filter((finding) => {
   504	    if (finding.lastSeen - finding.firstSeen < 1) return false;
   505	    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
   506	    // Exclude the initial discovery transition from the "no change" count
   507	    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
   508	    return nontrivialTransitions.length === 0;
   509	  });
   510	
   511	  const severityChanged = openFindings.filter((finding) => {
   512	    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
   513	    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
   514	    return nontrivialTransitions.length > 0;
   515	  });
   516	
   517	  // Deprecated: keep repeatedFindings for backward compatibility with older consumers.
   518	  // New code should read persistentSameSeverity + severityChanged directly.
   519	  const repeatedFindings = openFindings.filter((finding) => finding.lastSeen - finding.firstSeen >= 1);
   520	
   521	  return {
   522	    sessionId: config.sessionId || '',
   523	    generation: config.generation ?? 1,
   524	    lineageMode: config.lineageMode || 'new',
   525	    openFindings,
   526	    resolvedFindings,
   527	    blockedStopHistory,
   528	    persistentSameSeverity,
   529	    severityChanged,
   530	    repeatedFindings,
   531	    dimensionCoverage,
   532	    findingsBySeverity,
   533	    openFindingsCount: openFindings.length,
   534	    resolvedFindingsCount: resolvedFindings.length,
   535	    convergenceScore,
   536	    graphConvergenceScore: graphConvergence.score,
   537	    graphDecision: graphConvergence.decision,
   538	    graphBlockers: graphConvergence.blockers,
   539	    corruptionWarnings,
   540	  };
   541	}
   542	
   543	function blockFromBulletList(items) {
   544	  if (!items.length) {
   545	    return '[None yet]';
   546	  }
   547	  return items.map((item) => `- ${item}`).join('\n');
   548	}
   549	
   550	function buildExhaustedApproaches(iterationFiles) {
   551	  const grouped = new Map();
   552	
   553	  for (const iteration of iterationFiles) {
   554	    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
   555	      const bucket = grouped.get(entry) || [];
   556	      bucket.push(iteration.run);
   557	      grouped.set(entry, bucket);
   558	    }
   559	  }
   560	

exec
/bin/zsh -lc "rg -n \"## 9\\.|ANCHOR:claim-adjudication|claim-adjudication|persistentSameSeverity|severityChanged|repeatedFindings|resolvedFindingsCount|claimAdjudicationGate|typed claim-adjudication packet|prose-only\" .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"reduce-state|claim_adjudication|claim-adjudication|persistentSameSeverity|severityChanged|repeatedFindings|blocked_stop\" .opencode/skill/sk-deep-review -g '*test*' -g '*vitest*' -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:287:        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:420:               blocked_gates = ["claimAdjudicationGate"]
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:421:               recovery_strategy = "Reviewer must add typed claim-adjudication packets (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) for every active P0/P1 finding before STOP is allowed."
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:423:          1. HARD STOPS (each still subject to step 5 legal-stop gates, including claimAdjudicationGate):
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:426:             A hard stop does NOT bypass the legal-stop decision tree; it must still pass step 5 including the claim-adjudication gate.
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:453:               f) claimAdjudicationGate: pass when claim_adjudication_gate_pass == true (i.e. last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate); record last_claim_adjudication_passed and claim_adjudication_active_count
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:458:               blocked_by_json = JSON array of failing gate names (always include "claimAdjudicationGate" when claim_adjudication_gate_pass == false)
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:472:               recovery_strategy = one-line hint describing the next review action needed to satisfy the failed gates (when claimAdjudicationGate is the failing gate, prefer the step-0 recovery_strategy already set)
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:508:          - claim_adjudication_gate_pass: "Boolean pass/fail for claimAdjudicationGate (false vetoes STOP)"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:509:          - claim_adjudication_active_count: "Count of active P0/P1 findings evaluated by claimAdjudicationGate"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:519:          append_jsonl: '{"type":"event","event":"blocked_stop","mode":"review","run":{current_iteration},"blockedBy":{blocked_by_json},"gateResults":{"convergenceGate":{"pass":{convergence_gate_pass},"score":{convergence_gate_score}},"dimensionCoverageGate":{"pass":{dimension_coverage_gate_pass},"covered":{dimension_coverage_gate_covered_json},"missing":{dimension_coverage_gate_missing_json}},"p0ResolutionGate":{"pass":{p0_resolution_gate_pass},"activeP0":{active_p0_count}},"evidenceDensityGate":{"pass":{evidence_density_gate_pass},"avgEvidencePerFinding":{avg_evidence_per_finding}},"hotspotSaturationGate":{"pass":{hotspot_saturation_gate_pass}},"claimAdjudicationGate":{"pass":{claim_adjudication_gate_pass},"activeP0P1":{claim_adjudication_active_count}}},"recoveryStrategy":"{recovery_strategy}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:660:        action: "Validate typed claim-adjudication packets for any new P0/P1 findings and persist the result to state.jsonl so the next iteration's claimAdjudicationGate can read it"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:662:          - typed_packets_present: "Every new P0/P1 finding in review/iterations/iteration-{NNN}.md contains a claim-adjudication JSON block"
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:671:          action: "Mark the iteration as invalid for convergence. The next iteration's claimAdjudicationGate (step_check_convergence step 0) reads the persisted `passed: false` event and vetoes STOP until a follow-up iteration rewrites the packets."
.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:675:          log: "Claim adjudication incomplete for new P0/P1 findings. Event persisted. The next iteration's step_check_convergence claim-adjudication pre-check will veto STOP while `passed: false` remains the latest event and active P0/P1 > 0."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:279:        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:387:               blocked_gates = ["claimAdjudicationGate"]
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:388:               recovery_strategy = "Reviewer must add typed claim-adjudication packets (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) for every active P0/P1 finding before STOP is allowed."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:390:          1. HARD STOPS (each still subject to step 5 legal-stop gates, including claimAdjudicationGate):
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:393:             A hard stop does NOT bypass the legal-stop decision tree; it must still pass step 5 including the claim-adjudication gate.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:420:               f) claimAdjudicationGate: pass when claim_adjudication_gate_pass == true (i.e. last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate); record last_claim_adjudication_passed and claim_adjudication_active_count
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:425:               blocked_by_json = JSON array of failing gate names (always include "claimAdjudicationGate" when claim_adjudication_gate_pass == false)
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:439:               recovery_strategy = one-line hint describing the next review action needed to satisfy the failed gates (when claimAdjudicationGate is the failing gate, prefer the step-0 recovery_strategy already set)
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:475:          - claim_adjudication_gate_pass: "Boolean pass/fail for claimAdjudicationGate (false vetoes STOP)"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:476:          - claim_adjudication_active_count: "Count of active P0/P1 findings evaluated by claimAdjudicationGate"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:486:          append_jsonl: '{"type":"event","event":"blocked_stop","mode":"review","run":{current_iteration},"blockedBy":{blocked_by_json},"gateResults":{"convergenceGate":{"pass":{convergence_gate_pass},"score":{convergence_gate_score}},"dimensionCoverageGate":{"pass":{dimension_coverage_gate_pass},"covered":{dimension_coverage_gate_covered_json},"missing":{dimension_coverage_gate_missing_json}},"p0ResolutionGate":{"pass":{p0_resolution_gate_pass},"activeP0":{active_p0_count}},"evidenceDensityGate":{"pass":{evidence_density_gate_pass},"avgEvidencePerFinding":{avg_evidence_per_finding}},"hotspotSaturationGate":{"pass":{hotspot_saturation_gate_pass}},"claimAdjudicationGate":{"pass":{claim_adjudication_gate_pass},"activeP0P1":{claim_adjudication_active_count}}},"recoveryStrategy":"{recovery_strategy}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:606:        action: "Validate typed claim-adjudication packets for any new P0/P1 findings and persist the result to state.jsonl so the next iteration's claimAdjudicationGate can read it"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:608:          - typed_packets_present: "Every new P0/P1 finding in review/iterations/iteration-{NNN}.md contains a claim-adjudication JSON block"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:617:          action: "Mark the iteration as invalid for convergence. The next iteration's claimAdjudicationGate (step_check_convergence step 0) reads the persisted `passed: false` event and vetoes STOP until a follow-up iteration rewrites the packets."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:621:          log: "Claim adjudication incomplete for new P0/P1 findings. Event persisted. The next iteration's step_check_convergence claim-adjudication pre-check will veto STOP while `passed: false` remains the latest event and active P0/P1 > 0."
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:306:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.
.opencode/skill/sk-deep-review/references/loop_protocol.md:330:**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
.opencode/skill/sk-deep-review/references/loop_protocol.md:677:## 9. ERROR HANDLING
.opencode/skill/sk-deep-review/references/state_format.md:503:  "persistentSameSeverity": [],
.opencode/skill/sk-deep-review/references/state_format.md:504:  "severityChanged": [],
.opencode/skill/sk-deep-review/references/state_format.md:505:  "repeatedFindings": [],
.opencode/skill/sk-deep-review/references/state_format.md:518:  "resolvedFindingsCount": 1,
.opencode/skill/sk-deep-review/references/state_format.md:534:| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
.opencode/skill/sk-deep-review/references/state_format.md:535:| `severityChanged` | array | Findings that went through at least one severity transition (P0↔P1↔P2) in their `transitions` history. |
.opencode/skill/sk-deep-review/references/state_format.md:536:| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility; new code should read the split arrays. |
.opencode/skill/sk-deep-review/references/state_format.md:671:<!-- ANCHOR:claim-adjudication -->
.opencode/skill/sk-deep-review/references/state_format.md:672:## 9. CLAIM ADJUDICATION
.opencode/skill/sk-deep-review/references/state_format.md:674:Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`) — a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
.opencode/skill/sk-deep-review/references/state_format.md:719:5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.
.opencode/skill/sk-deep-review/references/state_format.md:730:<!-- /ANCHOR:claim-adjudication -->

 succeeded in 0ms:
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:81:- persistentSameSeverity: 2
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:82:- severityChanged: 1
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:83:- repeatedFindings (deprecated combined bucket): 3
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:3:description: End-to-end fixture for the sk-deep-review blocked_stop reducer path.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:8:This fixture demonstrates the full `blocked_stop -> registry -> dashboard` reducer path for a review packet.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:13:- A complete `blocked_stop` bundle with all required `gateResults`
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:16:- Three iteration files that let the reducer populate `blockedStopHistory`, `persistentSameSeverity`, and `severityChanged`
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:25:node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs \
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:32:- Expected execution process: Inspect the deep-review convergence reference for legal-stop gate behavior first, then the coverage-graph convergence handler for review `dimensionCoverage` thresholds, then fixture evidence for persisted `blocked_stop`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:34:- Expected signals: review convergence docs describe `blockedStop` when legal-stop gates fail; graph convergence handler enforces review `dimensionCoverage`; fixture evidence shows `blocked_stop` with `blockedBy: ["dimensionCoverage", ...]`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md:50:| DRV-021 | Review graph convergence signals participate in legal-stop gates | Verify graph-backed dimension coverage can veto STOP after stability points toward convergence. | Validate the graph-backed legal-stop gate contract for sk-deep-review. Confirm that graph-aware review convergence tracks graph dimension coverage, and that when legal-stop evaluation fails dimension coverage the review persists blocked-stop state instead of stopping, then return a concise operator-facing verdict. | 1. `bash: rg -n 'blockedStop|dimensionCoverage|buildReviewLegalStop|graphEvents|graph-aware review convergence' .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'dimensionCoverage|threshold|STOP_BLOCKED|blocking' .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` -> 3. `bash: rg -n 'blocked_stop|blockedStop|dimensionCoverage' .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl` | Legal-stop docs map failed gate evaluation to `blockedStop`; the graph convergence handler evaluates review `dimensionCoverage`; fixture evidence shows persisted `blocked_stop` blocked by `dimensionCoverage`. | Capture the review convergence legal-stop wording, the handler threshold/check for review `dimensionCoverage`, and the sample blocked-stop JSONL record naming `dimensionCoverage` in `blockedBy`. | PASS if the review docs, graph convergence handler, and blocked-stop fixture all agree that dimension-coverage failure prevents STOP even when other signals are favorable; FAIL if dimension-coverage failure is only advisory or not persisted. | Privilege `references/convergence.md` for the review stop contract and the fixture for concrete JSONL persistence. If the handler threshold and packet-level wording differ, flag threshold drift for follow-up. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:3:description: "Verify that blocked_stop events preserve the review gate bundle in blockedStopHistory, render in the dashboard, and rewrite the strategy next-focus anchor with recovery guidance."
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:14:This scenario validates blocked-stop reducer surfacing for `DRV-022`. The objective is to verify that a review packet with at least one `blocked_stop` event preserves the review-specific legal-stop bundle in `blockedStopHistory`, renders that blocked-stop evidence in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:27:- Given: A review packet with at least one `blocked_stop` event whose `blockedBy` and `gateResults` use the review-specific legal-stop names `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:28:- When: The operator runs `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>`.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:31:- Orchestrator prompt: Validate blocked-stop reducer surfacing for sk-deep-review. Confirm that running `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>` on a review packet with at least one `blocked_stop` event preserves the review gate bundle in `blockedStopHistory`, renders `BLOCKED STOPS` in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:50:| DRV-022 | Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus | Verify review `blocked_stop` output appears in `blockedStopHistory`, `BLOCKED STOPS`, and the strategy recovery anchor. | Validate blocked-stop reducer surfacing for sk-deep-review. Confirm that running `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>` on a review packet with at least one `blocked_stop` event preserves the review gate bundle in `blockedStopHistory`, renders `BLOCKED STOPS` in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy, then return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {spec_folder}` -> 2. `bash: cat {spec_folder}/review/deep-review-findings-registry.json | jq '.blockedStopHistory'` -> 3. `bash: grep -A 5 "BLOCKED STOPS" {spec_folder}/review/deep-review-dashboard.md` -> 4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/review/deep-review-strategy.md` | `blockedStopHistory` contains reducer-promoted blocked-stop entries with the review gate names; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record. | Capture the populated `blockedStopHistory` array, the dashboard `BLOCKED STOPS` excerpt, and the strategy `next-focus` anchor showing the recovery guidance. | PASS if all three review surfaces show the same blocked-stop data and preserve the review gate names; FAIL if any surface is missing blocked-stop data or the gate bundle is incomplete after the reducer run. | Privilege `deep-review-findings-registry.json` as the reducer-owned source of truth. If the registry is correct but the dashboard or strategy anchor is stale, treat that as reducer surfacing drift rather than JSONL input failure. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:66:| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md:68:| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Review legal-stop workflow contract; defines the review-specific gate names used in `blocked_stop` events |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md:50:| DRV-023 | Review reducer fails closed on corruption and missing anchors | Verify corruption and missing anchors fail closed by default, with `--lenient` and `--create-missing-anchors` as explicit escape hatches. | Validate fail-closed reducer behavior for sk-deep-review. Confirm that malformed JSONL exits with code `2` unless `--lenient` is passed, that missing machine-owned anchors throw `Missing machine-owned anchor ...` unless `--create-missing-anchors` is used, and that `corruptionWarnings` remains present after lenient recovery, then return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture}; echo "exit: $?"` -> 2. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'` -> 3. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture}; echo "exit: $?"` -> 4. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {corrupt_fixture} --lenient; echo "exit: $?"` -> 5. `bash: cat {corrupt_fixture}/review/deep-review-findings-registry.json | jq '.corruptionWarnings'` -> 6. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {anchor_fixture} --create-missing-anchors; echo "exit: $?"` -> 7. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {anchor_fixture}/review/deep-review-strategy.md` | Without `--lenient`, corrupt JSONL exits `2` and preserves `corruptionWarnings`; without `--create-missing-anchors`, the reducer throws `Missing machine-owned anchor ...`; with `--lenient`, the reducer exits `0` but preserves `corruptionWarnings`; with `--create-missing-anchors`, the missing anchor is created and the reducer proceeds. | Capture both exit codes, the missing-anchor stderr, the populated `.corruptionWarnings` field before and after `--lenient`, and the strategy `next-focus` anchor after `--create-missing-anchors`. | PASS if all four exit conditions match the documented contract and warning state is still visible after lenient recovery; FAIL if any exit code, error string, warning surface, or anchor bootstrap behavior differs. | Privilege `reduce-state.cjs` for exit semantics and `review-reducer-fail-closed.vitest.ts` for concrete expected behavior. If fixture preparation accidentally combines both failures in one directory, split into two fixture copies before judging the reducer. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/023-fail-closed-reducer.md:66:| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; emits `corruptionWarnings`, exits non-zero on corruption, and enforces machine-owned anchor presence unless recovery flags are passed |
.opencode/skill/sk-deep-review/references/state_format.md:290:When the review legal-stop decision tree returns `blocked`, append a first-class `blocked_stop` event instead of silently overriding STOP to CONTINUE.
.opencode/skill/sk-deep-review/references/state_format.md:295:  "event": "blocked_stop",
.opencode/skill/sk-deep-review/references/state_format.md:348:**Combined-stop rule:** Final STOP is legal only when the inline review convergence decision says STOP and the latest `graph_convergence.decision == "STOP_ALLOWED"`. If the latest graph decision is `STOP_BLOCKED`, set `stop_blocked=true`, emit `blocked_stop`, and continue recovery instead of stopping. If the latest graph decision is `CONTINUE`, downgrade the inline STOP candidate to CONTINUE.
.opencode/skill/sk-deep-review/references/state_format.md:503:  "persistentSameSeverity": [],
.opencode/skill/sk-deep-review/references/state_format.md:504:  "severityChanged": [],
.opencode/skill/sk-deep-review/references/state_format.md:505:  "repeatedFindings": [],
.opencode/skill/sk-deep-review/references/state_format.md:533:| `blockedStopHistory` | array | One entry per `blocked_stop` JSONL event: `{run, blockedBy, gateResults, recoveryStrategy, timestamp}`. Rendered in the dashboard `BLOCKED STOPS` section and can drive the strategy `next-focus` anchor when blocked-stop is the most recent loop event. |
.opencode/skill/sk-deep-review/references/state_format.md:534:| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
.opencode/skill/sk-deep-review/references/state_format.md:535:| `severityChanged` | array | Findings that went through at least one severity transition (P0↔P1↔P2) in their `transitions` history. |
.opencode/skill/sk-deep-review/references/state_format.md:536:| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility; new code should read the split arrays. |
.opencode/skill/sk-deep-review/references/state_format.md:542:When no `blocked_stop` event has been recorded yet, `blockedStopHistory: []`.
.opencode/skill/sk-deep-review/references/state_format.md:550:- **Strategy next-focus override**: When the latest `blocked_stop` event timestamp is newer than the latest iteration timestamp, the reducer rewrites the strategy `next-focus` anchor to surface the blocking gates and recovery hint so operators see the blocker before choosing the next iteration direction.
.opencode/skill/sk-deep-review/references/state_format.md:671:<!-- ANCHOR:claim-adjudication -->
.opencode/skill/sk-deep-review/references/state_format.md:674:Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`) — a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
.opencode/skill/sk-deep-review/references/state_format.md:713:### Validation Rules (enforced by `step_post_iteration_claim_adjudication`)
.opencode/skill/sk-deep-review/references/state_format.md:719:5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.
.opencode/skill/sk-deep-review/references/state_format.md:730:<!-- /ANCHOR:claim-adjudication -->
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:47:| DRV-012 | Adversarial self-check runs on P0 findings | Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them. | Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 mandates adversarial self-check for P0 findings, the iteration checklist enforces it, and the YAML claim adjudication checks for it, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'adversarial\|self.check\|Hunter\|Skeptic\|Referee\|Rule 10\|re-read.*P0' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'adversarial\|self.check\|P0.*check\|claim_adjudication' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'adversarial\|self.check\|P0\|Hunter\|Skeptic\|Referee' .opencode/skill/sk-deep-review/references/quick_reference.md .codex/agents/deep-review.toml .claude/agents/deep-review.md` | Rule 10 in SKILL.md mandates adversarial self-check; iteration checklist includes it as step 5; YAML has claim adjudication; agent definitions describe the protocol. | Capture Rule 10, the checklist step, the claim adjudication YAML step, and the agent self-check instructions. | PASS if the adversarial self-check is documented, enforced in the iteration checklist, and checked in the YAML; FAIL if P0 findings can be recorded without a self-check. | If the agent definition lacks explicit Hunter/Skeptic/Referee roles, check whether the SKILL.md Rule 10 wording is sufficient to trigger the behavior implicitly. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Post-iteration claim adjudication; inspect `step_post_iteration_claim_adjudication` |
.opencode/skill/sk-deep-review/references/convergence.md:44:Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus — when STOP is vetoed — a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path; earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.
.opencode/skill/sk-deep-review/references/convergence.md:58:#### blocked_stop Event (canonical, persisted)
.opencode/skill/sk-deep-review/references/convergence.md:60:`step_emit_blocked_stop` in both `spec_kit_deep-review_{auto,confirm}.yaml` appends the following record to `deep-review-state.jsonl` whenever the legal-stop decision tree vetoes STOP. The gate names and their shapes are load-bearing — the reducer reads them verbatim:
.opencode/skill/sk-deep-review/references/convergence.md:65:  "event": "blocked_stop",
.opencode/skill/sk-deep-review/references/convergence.md:88:- `blockedBy`: array of gate names that failed (string[] — never structured objects). Empty when STOP is legal, in which case no `blocked_stop` event is emitted.
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:172:If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
.opencode/skill/sk-deep-review/references/loop_protocol.md:306:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.
.opencode/skill/sk-deep-review/references/loop_protocol.md:328:5. Emit the typed packet inside the iteration file so `step_post_iteration_claim_adjudication` can parse it.
.opencode/skill/sk-deep-review/references/loop_protocol.md:330:**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I have enough of the main reducer to start testing the contract mentally, and one likely mismatch is already emerging around how claim-adjudication is surfaced. I’m pulling the exact schema examples and reducer tests/fixtures next so I can separate real regressions from documentation drift or already-covered behavior.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '490,730p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/loop_protocol.md | sed -n '160,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   490	<!-- ANCHOR:findings-registry -->
   491	## 5. FINDINGS REGISTRY (deep-review-findings-registry.json)
   492	
   493	Reducer-owned JSON document regenerated after every iteration and lifecycle transition.
   494	
   495	```json
   496	{
   497	  "sessionId": "rvw-2026-04-03T12-00-00Z",
   498	  "generation": 1,
   499	  "lineageMode": "resume",
   500	  "openFindings": [],
   501	  "resolvedFindings": [],
   502	  "blockedStopHistory": [],
   503	  "persistentSameSeverity": [],
   504	  "severityChanged": [],
   505	  "repeatedFindings": [],
   506	  "dimensionCoverage": {
   507	    "correctness": true,
   508	    "security": true,
   509	    "traceability": false,
   510	    "maintainability": false
   511	  },
   512	  "findingsBySeverity": {
   513	    "P0": 0,
   514	    "P1": 1,
   515	    "P2": 2
   516	  },
   517	  "openFindingsCount": 3,
   518	  "resolvedFindingsCount": 1,
   519	  "convergenceScore": 0.44,
   520	  "graphConvergenceScore": 1.01,
   521	  "graphDecision": "STOP_ALLOWED",
   522	  "graphBlockers": [],
   523	  "corruptionWarnings": []
   524	}
   525	```
   526	
   527	This file is machine-owned and must stay synchronized with the latest iteration delta, dashboard metrics, and synthesized review report.
   528	
   529	### Phase 008 Additions
   530	
   531	| Field | Type | Description |
   532	|-------|------|-------------|
   533	| `blockedStopHistory` | array | One entry per `blocked_stop` JSONL event: `{run, blockedBy, gateResults, recoveryStrategy, timestamp}`. Rendered in the dashboard `BLOCKED STOPS` section and can drive the strategy `next-focus` anchor when blocked-stop is the most recent loop event. |
   534	| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
   535	| `severityChanged` | array | Findings that went through at least one severity transition (P0↔P1↔P2) in their `transitions` history. |
   536	| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility; new code should read the split arrays. |
   537	| `corruptionWarnings` | array | Per-line corruption reports from `parseJsonlDetailed()`: `{line, raw, error}`. Non-empty means the reducer detected malformed JSONL. |
   538	
   539	### Default Values
   540	
   541	When no `graph_convergence` event has been recorded yet, defaults are `graphConvergenceScore: 0`, `graphDecision: null`, and `graphBlockers: []`.
   542	When no `blocked_stop` event has been recorded yet, `blockedStopHistory: []`.
   543	When JSONL parses cleanly, `corruptionWarnings: []`.
   544	
   545	### Fail-Closed Semantics (REQ-015, REQ-016)
   546	
   547	- **Malformed JSONL**: The reducer CLI exits with code `2` and writes a warning to stderr when `corruptionWarnings.length > 0`. Pass `--lenient` (or `lenient:true` to `reduceReviewState`) to escape-hatch out and preserve the v1.2.0.0 fail-open behavior for legacy packets.
   548	- **Missing machine-owned anchors**: `replaceAnchorSection()` throws `Error('Missing machine-owned anchor "<id>" in deep-review strategy file.')` when the strategy file is present but lacks one of the required anchors. Pass `--create-missing-anchors` (or `createMissingAnchors:true`) to bootstrap empty strategy files by appending the missing anchor blocks.
   549	- **Dashboard surfaces**: `CORRUPTION WARNINGS` section lists detected lines; `BLOCKED STOPS` section lists `blockedStopHistory` entries; `GRAPH CONVERGENCE` section reports `graphConvergenceScore` / `graphDecision` / `graphBlockers`.
   550	- **Strategy next-focus override**: When the latest `blocked_stop` event timestamp is newer than the latest iteration timestamp, the reducer rewrites the strategy `next-focus` anchor to surface the blocking gates and recovery hint so operators see the blocker before choosing the next iteration direction.
   551	
   552	---
   553	
   554	<!-- /ANCHOR:findings-registry -->
   555	<!-- ANCHOR:iteration-files -->
   556	## 6. ITERATION FILES (review/iterations/iteration-NNN.md)
   557	
   558	Write-once files. One per iteration, zero-padded 3-digit naming.
   559	
   560	### Structure
   561	
   562	```markdown
   563	# Iteration [N]: [Focus Area]
   564	
   565	## Focus
   566	[Dimension(s), files, scope investigated]
   567	
   568	## Scorecard
   569	- Dimensions covered: [list]
   570	- Files reviewed: [count]
   571	- New findings: P0=[n] P1=[n] P2=[n]
   572	- Refined findings: P0=[n] P1=[n] P2=[n]
   573	- New findings ratio: [0.0-1.0]
   574	
   575	## Findings
   576	
   577	### P0 — Blocker
   578	- **F[NNN]**: [Title] — `file:line` — [Description with evidence]
   579	
   580	### P1 — Required
   581	- **F[NNN]**: [Title] — `file:line` — [Description with evidence]
   582	
   583	### P2 — Suggestion
   584	- **F[NNN]**: [Title] — `file:line` — [Description with evidence]
   585	
   586	## Cross-Reference Results
   587	| Protocol | Status | Gate | Evidence | Notes |
   588	|----------|--------|------|----------|-------|
   589	| spec_code | pass/partial/fail | hard | file:line | ... |
   590	
   591	## Assessment
   592	- New findings ratio: [0.0-1.0]
   593	- Dimensions addressed: [list]
   594	- Novelty justification: [breakdown]
   595	
   596	## Ruled Out
   597	- [Approach]: [Why] — [Evidence]
   598	
   599	## Dead Ends
   600	- [Direction]: [Why]
   601	
   602	## Recommended Next Focus
   603	[What to investigate next]
   604	```
   605	
   606	Every finding must include: unique ID (`F001`...), severity (`P0`/`P1`/`P2`), concrete `file:line` evidence, and dimension tag.
   607	
   608	---
   609	
   610	<!-- /ANCHOR:iteration-files -->
   611	<!-- ANCHOR:review-report -->
   612	## 7. REVIEW REPORT (review/review-report.md)
   613	
   614	The review synthesis output contains 9 sections:
   615	
   616	| # | Section | Description |
   617	|---|---------|-------------|
   618	| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` flag |
   619	| 2 | Planning Trigger | Why result routes to planning or changelog |
   620	| 3 | Active Finding Registry | Deduped active findings with evidence, severity, dimension |
   621	| 4 | Remediation Workstreams | Ordered lanes grouped by dependency or area |
   622	| 5 | Spec Seed | Minimal spec updates implied by findings |
   623	| 6 | Plan Seed | Initial remediation tasks from findings |
   624	| 7 | Traceability Status | Core vs overlay protocol outcomes and gaps |
   625	| 8 | Deferred Items | Advisory findings, blocked items, follow-up checks |
   626	| 9 | Audit Appendix | Coverage, convergence replay, audit detail |
   627	
   628	**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.
   629	
   630	**Planning Trigger** routes FAIL/CONDITIONAL to remediation planning, PASS to changelog creation.
   631	
   632	**Active Finding Registry** lists each active finding with findingId, severity, dimension, title, file:line evidence, first/last seen iteration, and status.
   633	
   634	**Remediation Workstreams** group related findings into ordered lanes with constituent finding IDs and execution order.
   635	
   636	**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.
   637	
   638	**Traceability Status** reports per-protocol pass/partial/fail with gating class and evidence.
   639	
   640	**Deferred Items** captures advisory findings, blocked protocols, and future follow-up checks.
   641	
   642	**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.
   643	
   644	---
   645	
   646	<!-- /ANCHOR:review-report -->
   647	<!-- ANCHOR:dashboard -->
   648	## 8. DASHBOARD (review/deep-review-dashboard.md)
   649	
   650	Auto-generated summary. Never manually edited.
   651	
   652	- **Path**: `{spec_folder}/review/deep-review-dashboard.md`
   653	- **Generated from**: JSONL state log + strategy + findings registry
   654	- **Refresh**: Regenerated after every iteration
   655	- **Protection**: `auto-generated` in fileProtection
   656	
   657	### Sections
   658	
   659	| Section | Source | Description |
   660	|---------|--------|-------------|
   661	| Findings Summary | JSONL | Active P0/P1/P2 counts, new vs refined |
   662	| Progress Table | JSONL | Run, status, focus, dimensions, ratio, duration |
   663	| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
   664	| Trend | JSONL signals | Rolling average, composite stop score, trajectory |
   665	
   666	**Rules:** Sole inputs are JSONL + strategy. Overwrite entirely on refresh. Read-only for all agents.
   667	
   668	---
   669	
   670	<!-- /ANCHOR:dashboard -->
   671	<!-- ANCHOR:claim-adjudication -->
   672	## 9. CLAIM ADJUDICATION
   673	
   674	Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`) — a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.
   675	
   676	### Typed Packet Schema (required)
   677	
   678	Embed the packet inside the iteration file for each new P0/P1 finding. The orchestrator parses it after evaluation and persists the validation result.
   679	
   680	```json
   681	{
   682	  "findingId": "F003",
   683	  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
   684	  "evidenceRefs": [
   685	    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154",
   686	    ".opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302"
   687	  ],
   688	  "counterevidenceSought": "Grepped the module for compound-key upserts, checked migration scripts, and inspected session-isolation.vitest.ts for a collision regression — none found.",
   689	  "alternativeExplanation": "Could be intentional single-tenant design, but phase 008 REQ-024 explicitly requires session isolation, so this is rejected.",
   690	  "finalSeverity": "P1",
   691	  "confidence": 0.86,
   692	  "downgradeTrigger": "If a composite primary key `(spec_folder, loop_type, session_id, id)` lands and a collision regression covers the ID-reuse path, downgrade to P2 tech-debt.",
   693	  "transitions": [
   694	    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
   695	  ]
   696	}
   697	```
   698	
   699	### Required Fields
   700	
   701	| Field | Type | Description |
   702	|-------|------|-------------|
   703	| `findingId` | string | Must match the finding ID in the iteration body and registry |
   704	| `claim` | string | The single assertion the finding makes (one sentence, evidence-backed) |
   705	| `evidenceRefs` | string[] | `file:line` or `file:range` citations that substantiate the claim (at least one entry) |
   706	| `counterevidenceSought` | string | Where the reviewer looked for contradicting evidence (commands, paths, docs) — blank string is not acceptable |
   707	| `alternativeExplanation` | string | An alternative reading of the evidence, even if the reviewer rejects it |
   708	| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication (may differ from the severity originally asserted) |
   709	| `confidence` | number `[0, 1]` | Reviewer confidence in `finalSeverity` |
   710	| `downgradeTrigger` | string | The concrete condition under which this finding should be downgraded in a future iteration |
   711	| `transitions` | object[] | Optional severity transition log; required when `finalSeverity` differs from the originally asserted severity |
   712	
   713	### Validation Rules (enforced by `step_post_iteration_claim_adjudication`)
   714	
   715	1. A packet MUST exist for every new P0/P1 finding introduced in this iteration. Carried-forward findings reuse the previous packet unless severity transitioned.
   716	2. All required fields MUST be present and non-empty. `confidence` MUST be a number in `[0, 1]`.
   717	3. Each `evidenceRefs` entry MUST contain a `:` separating the path from a line or range.
   718	4. `finalSeverity` MUST match the severity the finding is registered under in the iteration's `Findings` section and in `deep-review-findings-registry.json`.
   719	5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.
   720	
   721	### Severity Transition Rules
   722	
   723	- **P2 → P1**: confirmed exploitable impact or spec violation with direct evidence
   724	- **P1 → P0**: demonstrated data loss, security breach, or hard-gate failure
   725	- **Downgrade**: requires explicit counterevidence or a confirmed alternative explanation
   726	- Every transition is recorded in the packet's `transitions` array and mirrored into the finding registry's `transitions` field
   727	
   728	---
   729	
   730	<!-- /ANCHOR:claim-adjudication -->

 succeeded in 0ms:
   160	Run `shouldContinue_review()` (see `../sk-deep-research/references/convergence.md` Section 10.3):
   161	
   162	- Max iterations reached? `STOP`
   163	- Stuck count `>= 2` using `noProgressThreshold = 0.05`? `STUCK_RECOVERY`
   164	- Composite convergence votes `STOP` only after:
   165	  - Rolling average uses `rollingStopThreshold = 0.08`
   166	  - Dimension coverage reaches 100% across the 4-dimension model
   167	  - Coverage has aged through `minStabilizationPasses >= 1`
   168	  - Required traceability protocols are covered
   169	  - Evidence, scope, and coverage gates pass
   170	- Otherwise: `CONTINUE`
   171	
   172	If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
   173	
   174	- `blockedBy`: array of the failed review gate names
   175	- `gateResults`: per-gate pass/fail payloads using the review gate names above
   176	- `recoveryStrategy`: one-line hint describing the next review action
   177	
   178	The blocked-stop event is append-only evidence that legal-stop blocked the run; the loop then continues with the recovery or next-focus path rather than synthesizing.
   179	
   180	Convergence signals and weights:
   181	
   182	| Signal | Weight | Description |
   183	|--------|--------|-------------|
   184	| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `rollingStopThreshold` |
   185	| MAD Noise Floor | 0.25 | Latest ratio within noise floor derived from historical ratios |
   186	| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with stabilization |
   187	
   188	**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.
   189	
   190	#### Step 2a: Check Pause Sentinel
   191	
   192	Before dispatching, check for a pause sentinel file:
   193	
   194	1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
   195	2. If present:
   196	   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}`
   197	   - Halt the loop with message:
   198	     ```
   199	     Review paused. Delete review/.deep-review-pause to resume.
   200	     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
   201	     ```
   202	   - Do NOT exit to synthesis -- the loop is suspended, not stopped
   203	3. On resume (file deleted and loop restarted):
   204	   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   205	   - Continue from step_read_state
   206	
   207	**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause review between iterations.
   208	
   209	Normalization rule: if the runtime first observes a raw `paused` condition or a raw `stuck_recovery` condition, it MUST rewrite the emitted JSONL event names to `userPaused` and `stuckRecovery` before appending them. Persisted review JSONL should never contain raw `paused` or raw `stuck_recovery` rows after emission.
   210	
   211	#### Step 2b: Generate State Summary
   212	
   213	Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
   214	
   215	```
   216	STATE SUMMARY (auto-generated, review mode):
   217	Iteration: {N} of {max} | Mode: review
   218	Target: {config.reviewTarget} ({config.reviewTargetType})
   219	Dimensions: {reviewed}/{total} complete | Next: {nextDimension}
   220	Findings: P0:{count} P1:{count} P2:{count} active
   221	Traceability: core={core_status} overlay={overlay_status}
   222	Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
   223	Provisional verdict: {PASS|CONDITIONAL|FAIL|PENDING} | hasAdvisories={hasAdvisories}
   224	Next focus: {strategy.nextFocus}
   225	```
   226	
   227	This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete.
   228	
   229	#### Step 3: Dispatch Agent
   230	
   231	Dispatch `@deep-review` with review-specific context:
   232	
   233	```
   234	{state_summary}  // Auto-generated (Step 2b)
   235	
   236	Review Target: {config.reviewTarget}
   237	Review Mode: {config.reviewTargetType}
   238	Iteration: {N} of {maxIterations}
   239	Focus Dimension: {strategy.nextFocus.dimension}
   240	Focus Files: {strategy.nextFocus.files}
   241	Remaining Dimensions: {strategy.remainingDimensions}
   242	Traceability Protocols:
   243	  - Core: {core_protocols}
   244	  - Overlay: {overlay_protocols}
   245	Active Findings: {findingsSummary}
   246	State Files:
   247	  - Config: {spec_folder}/review/deep-review-config.json
   248	  - State: {spec_folder}/review/deep-review-state.jsonl
   249	  - Registry: {spec_folder}/review/deep-review-findings-registry.json
   250	  - Strategy: {spec_folder}/review/deep-review-strategy.md
   251	Output: Write findings to {spec_folder}/review/iterations/iteration-{NNN}.md
   252	CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
   253	CONSTRAINT: Target files are READ-ONLY -- never modify code under review
   254	```
   255	
   256	**Agent constraints**:
   257	- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
   258	- No WebFetch: review is code-only and read-only
   259	- Target 8-11 tool calls per iteration (max 12); breadth over depth per cycle
   260	- Tools available: Read, Grep, Glob, Edit (state files only), mcp__cocoindex_code__search
   261	
   262	#### Step 3a: Cross-Reference Protocol Execution
   263	
   264	During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.
   265	
   266	| Protocol | Execution | Expected Output |
   267	|----------|-----------|-----------------|
   268	| `spec_code` | Compare normative claims in spec.md against shipped implementation | Pass/partial/fail per claim with file:line evidence |
   269	| `checklist_evidence` | Verify every `[x]` mark in checklist.md has supporting evidence | Pass/partial/fail per checked item |
   270	| `skill_agent` | Compare SKILL.md contracts against runtime agent definitions | Agreement/drift/disagreement per capability |
   271	| `agent_cross_runtime` | Compare agent definitions across runtimes (.opencode, .claude, .codex, .gemini) | Parity/drift/divergence per runtime pair |
   272	| `feature_catalog_code` | Compare catalog claims against discoverable implementation | Match/stale/missing per feature |
   273	| `playbook_capability` | Validate playbook scenarios against executable reality | Executable/needs-update/impossible per scenario |
   274	
   275	Each protocol result includes:
   276	- `protocolId`: Protocol identifier
   277	- `status`: `pass`, `partial`, or `fail`
   278	- `gateClass`: `hard` or `advisory`
   279	- `applicable`: Whether the protocol applies to this target type
   280	- `counts`: `{ pass, partial, fail, skipped }`
   281	- `evidence`: Array of file:line citations
   282	- `findingRefs`: Array of finding IDs generated from this protocol
   283	- `summary`: Human-readable summary text
   284	
   285	#### Step 4: Evaluate Results
   286	
   287	After agent completes:
   288	
   289	1. Verify `{spec_folder}/review/iterations/iteration-{NNN}.md` was created
   290	2. Verify JSONL was appended with review iteration fields:
   291	   - `dimensions` (array of dimensions covered)
   292	   - `filesReviewed` (array of file paths)
   293	   - `findingsSummary` (cumulative P0/P1/P2 counts)
   294	   - `findingsNew` (this iteration's new findings)
   295	   - `traceabilityChecks` (protocol results if applicable)
   296	3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
   297	4. Extract `newFindingsRatio` from JSONL record
   298	5. Update stuck tracking using `noProgressThreshold = 0.05`:
   299	   - Skip if `status == "thought"` (no change)
   300	   - Reset to 0 if `status == "insight"` (breakthrough counts as progress)
   301	   - Increment if `newFindingsRatio < noProgressThreshold`
   302	   - Reset otherwise
   303	
   304	#### Step 4a: Claim Adjudication
   305	
   306	Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.
   307	
   308	Each new P0/P1 must carry a typed packet with the following required fields (see `state_format.md` §9 for the full schema and a worked example):
   309	
   310	| Field | Type | Description |
   311	|-------|------|-------------|
   312	| `findingId` | string | Matches the finding ID in the iteration body |
   313	| `claim` | string | The single assertion the finding makes |
   314	| `evidenceRefs` | string[] | `file:line` or `file:range` citations (≥ 1) |
   315	| `counterevidenceSought` | string | Where the orchestrator looked for contradicting evidence |
   316	| `alternativeExplanation` | string | An alternative explanation, even if rejected |
   317	| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication |
   318	| `confidence` | number `[0, 1]` | Orchestrator confidence in `finalSeverity` |
   319	| `downgradeTrigger` | string | Concrete condition that would cause a future downgrade |
   320	| `transitions` | object[] | Optional; required when `finalSeverity` differs from the originally asserted severity |
   321	
   322	**Protocol**:
   323	
   324	1. Re-read the cited evidence at the referenced file:line locations.
   325	2. Seek counterevidence in adjacent code, docs, or prior iteration history.
   326	3. Record an alternative explanation even if it is rejected.
   327	4. Confirm or downgrade severity before the finding becomes convergence-visible.
   328	5. Emit the typed packet inside the iteration file so `step_post_iteration_claim_adjudication` can parse it.
   329	
   330	**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
   331	
   332	#### Step 4b: Generate Dashboard
   333	
   334	Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
   335	
   336	| Section | Content |
   337	|---------|---------|
   338	| Status | Provisional verdict (`PASS`/`CONDITIONAL`/`FAIL`/`PENDING`) and `hasAdvisories` flag |
   339	| Findings Summary | P0/P1/P2 counts with deltas from previous iteration |
   340	| Progress Table | Iteration number, focus dimension, `newFindingsRatio`, findings count, status |

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '360,700p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   360	        transform: |
   361	          1. Call graph convergence on the current review lineage before the inline 3-signal vote.
   362	          2. Record the decision as one of CONTINUE, STOP_ALLOWED, STOP_BLOCKED.
   363	          3. Preserve raw graph signals and blockers for reducer rollup and blocked-stop evidence.
   364	          4. Normalize blockers to both JSON array and CSV forms for downstream stop handling.
   365	          5. Set graph_stop_blocked = true only when graph_decision == "STOP_BLOCKED".
   366	        mcp_tool:
   367	          name: mcp__spec_kit_memory__deep_loop_graph_convergence
   368	          note: "Call directly - NEVER through Code Mode. Review-side graph convergence must run before the inline review stop vote."
   369	          parameters: { specFolder: "{spec_folder}", loopType: "review", sessionId: "{session_id}" }
   370	        append_jsonl: '{"type":"event","event":"graph_convergence","mode":"review","run":{current_iteration},"decision":"{graph_decision}","signals":{graph_signals_json},"blockers":{graph_blockers_json},"timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
   371	        outputs:
   372	          - graph_decision: "CONTINUE | STOP_ALLOWED | STOP_BLOCKED"
   373	          - graph_signals_json: "JSON object returned by deep_loop_graph_convergence"
   374	          - graph_blockers_json: "JSON array of graph blockers when present, else []"
   375	          - graph_blockers_csv: "Comma-separated blocker summary when graph blocks STOP, else empty string"
   376	          - graph_stop_blocked: "Boolean true when graph_decision == STOP_BLOCKED"
   377	
   378	      step_check_convergence:
   379	        action: "Evaluate graph-assisted review stop conditions and the legal-stop decision tree"
   380	        algorithm: |
   381	          0. CLAIM-ADJUDICATION PRE-CHECK (universal STOP veto; runs before hard stops and composite convergence):
   382	             claim_adjudication_gate_pass = (last_claim_adjudication_passed != false) OR (p0_count + p1_count == 0)
   383	             If claim_adjudication_gate_pass == false:
   384	               candidate_decision = "BLOCKED"
   385	               stop_blocked = true
   386	               stopReason = "blockedStop"
   387	               blocked_gates = ["claimAdjudicationGate"]
   388	               recovery_strategy = "Reviewer must add typed claim-adjudication packets (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) for every active P0/P1 finding before STOP is allowed."
   389	               Skip hard stops (1) and composite convergence (4); proceed directly to step 5 legal-stop decision-tree assembly so blocked_by_json, gate outputs, and the blocked_stop event still populate consistently.
   390	          1. HARD STOPS (each still subject to step 5 legal-stop gates, including claimAdjudicationGate):
   391	             a) if iteration_count >= max_iterations: mark hard_stop_reason = "max_iterations_reached" and promote to STOP candidate
   392	             b) if all dimensions clean AND required traceability protocols are covered AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass (evidence: every P0/P1 has file:line; scope: all findings within target; coverage: all dimensions reviewed): mark hard_stop_reason = "all_dimensions_clean" and promote to STOP candidate
   393	             A hard stop does NOT bypass the legal-stop decision tree; it must still pass step 5 including the claim-adjudication gate.
   394	          2. STUCK DETECTION (threshold 2):
   395	             if stuck_count >= 2: STUCK_RECOVERY
   396	          3. GRAPH CONVERGENCE PREREQUISITE:
   397	               graph_decision, graph_signals_json, and graph_blockers_json are already populated by step_graph_convergence.
   398	               Final STOP is never legal unless the inline review vote says STOP AND graph_decision == "STOP_ALLOWED".
   399	               If graph_decision == "STOP_BLOCKED", set stop_blocked = true and route through blocked_stop emission instead of stopping.
   400	          4. COMPOSITE CONVERGENCE (3-signal weighted vote with split thresholds):
   401	               signals = []
   402	               a) Rolling average (w=0.30, window=2, needs 2+ iterations):
   403	                  avg = mean(last 2 newFindingsRatios)
   404	                  stop if avg <= 0.08
   405	               b) MAD noise floor (w=0.25, needs 3+ iterations):
   406	                  noiseFloor = MAD(all ratios) * 1.4826
   407	                  stop if latest ratio <= noiseFloor
   408	               c) Dimension coverage (w=0.45):
   409	                  coverage = dimensions_covered / total_dimensions
   410	                  stop if coverage >= 1.0 AND required traceability protocols are covered AND coverage_age >= 1
   411	               Redistribute weights for unavailable signals.
   412	               if latest ratio <= 0.05: mark no_progress_threshold_reached
   413	               if weighted_stop_score >= 0.60: inline STOP becomes a candidate and binary gates must run
   414	          5. LEGAL-STOP DECISION TREE (review-specific gates; runs whenever step 0 or a hard stop or the composite vote promotes STOP to a candidate):
   415	               a) convergenceGate: pass when a hard-stop condition is met OR weighted_stop_score >= 0.60; record score
   416	               b) dimensionCoverageGate: pass when configured dimensions and required traceability coverage are complete and coverage_age >= 1; record covered and missing dimensions
   417	               c) p0ResolutionGate: pass when activeP0 == 0; record activeP0
   418	               d) evidenceDensityGate: pass when every active P0/P1 has concrete file:line evidence and no active P0/P1 relies only on inference; record avgEvidencePerFinding
   419	               e) hotspotSaturationGate: pass when review hotspots have been revisited enough times to satisfy the saturation heuristic
   420	               f) claimAdjudicationGate: pass when claim_adjudication_gate_pass == true (i.e. last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate); record last_claim_adjudication_passed and claim_adjudication_active_count
   421	             if STOP is a candidate and any gate fails:
   422	               decision = "BLOCKED"
   423	               stop_blocked = true
   424	               stopReason = "blockedStop"
   425	               blocked_by_json = JSON array of failing gate names (always include "claimAdjudicationGate" when claim_adjudication_gate_pass == false)
   426	               blocked_by_csv = comma-separated list of failing gate names
   427	               convergence_gate_pass = boolean
   428	               convergence_gate_score = numeric convergence score
   429	               dimension_coverage_gate_pass = boolean
   430	               dimension_coverage_gate_covered_json = JSON array of covered review dimensions
   431	               dimension_coverage_gate_missing_json = JSON array of missing review dimensions
   432	               p0_resolution_gate_pass = boolean
   433	               active_p0_count = number of active P0 findings
   434	               evidence_density_gate_pass = boolean
   435	               avg_evidence_per_finding = numeric evidence density
   436	               hotspot_saturation_gate_pass = boolean
   437	               claim_adjudication_gate_pass = boolean
   438	               claim_adjudication_active_count = numeric count of active P0/P1 at the gate
   439	               recovery_strategy = one-line hint describing the next review action needed to satisfy the failed gates (when claimAdjudicationGate is the failing gate, prefer the step-0 recovery_strategy already set)
   440	          6. COMBINED STOP RULE:
   441	               a) if STOP is legal AND graph_decision == "STOP_ALLOWED": decision = "STOP"
   442	               b) if STOP is legal AND graph_decision == "STOP_BLOCKED":
   443	                    decision = "BLOCKED"
   444	                    stop_blocked = true
   445	                    stopReason = "blockedStop"
   446	                    # Phase 008 P1-02 closure: blockedBy must be string[] per the
   447	                    # published review blocked-stop contract. Extract the `.type`
   448	                    # field from each structured graph blocker; preserve the full
   449	                    # objects in graph_blocker_detail_json for operator inspection.
   450	                    blocked_by_json = JSON.stringify(graph_blockers_json.map(b => typeof b === "string" ? b : (b && b.type) || "graph_blocker"))
   451	                    blocked_by_csv = graph_blockers_csv
   452	                    graph_blocker_detail_json = graph_blockers_json
   453	                    recovery_strategy = "Resolve review coverage-graph blockers before stopping."
   454	               c) if STOP is legal AND graph_decision == "CONTINUE":
   455	                    decision = "CONTINUE"
   456	                    stop_blocked = false
   457	                    reason = "graph_convergence_continue"
   458	               d) else keep the existing STUCK_RECOVERY or CONTINUE outcome
   459	        outputs:
   460	          - decision: "STOP | BLOCKED | STUCK_RECOVERY | CONTINUE"
   461	          - reason: "Human-readable stop reason"
   462	          - stop_blocked: "Boolean true when STOP is vetoed by inline legal-stop gates or graph_decision == STOP_BLOCKED"
   463	          - blocked_by_json: "JSON array of failed legal-stop gates when decision == BLOCKED"
   464	          - blocked_by_csv: "Comma-separated list of failed legal-stop gates when decision == BLOCKED"
   465	          - convergence_gate_pass: "Boolean pass/fail for convergenceGate"
   466	          - convergence_gate_score: "Numeric score recorded for convergenceGate"
   467	          - dimension_coverage_gate_pass: "Boolean pass/fail for dimensionCoverageGate"
   468	          - dimension_coverage_gate_covered_json: "JSON array of covered review dimensions"
   469	          - dimension_coverage_gate_missing_json: "JSON array of missing review dimensions"
   470	          - p0_resolution_gate_pass: "Boolean pass/fail for p0ResolutionGate"
   471	          - active_p0_count: "Active P0 finding count at stop-check time"
   472	          - evidence_density_gate_pass: "Boolean pass/fail for evidenceDensityGate"
   473	          - avg_evidence_per_finding: "Numeric evidence density for active findings"
   474	          - hotspot_saturation_gate_pass: "Boolean pass/fail for hotspotSaturationGate"
   475	          - claim_adjudication_gate_pass: "Boolean pass/fail for claimAdjudicationGate (false vetoes STOP)"
   476	          - claim_adjudication_active_count: "Count of active P0/P1 findings evaluated by claimAdjudicationGate"
   477	          - graph_decision: "CONTINUE | STOP_ALLOWED | STOP_BLOCKED from step_graph_convergence"
   478	          - graph_signals_json: "JSON object returned by graph convergence"
   479	          - graph_blockers_json: "JSON array of graph blockers"
   480	          - graph_blockers_csv: "Comma-separated graph blocker summary"
   481	          - recovery_strategy: "One-line hint describing the next review action when decision == BLOCKED or STUCK_RECOVERY"
   482	
   483	      step_emit_blocked_stop:
   484	        action: "Persist blocked-stop evidence whenever the review legal-stop decision tree vetoes STOP"
   485	        if_blocked:
   486	          append_jsonl: '{"type":"event","event":"blocked_stop","mode":"review","run":{current_iteration},"blockedBy":{blocked_by_json},"gateResults":{"convergenceGate":{"pass":{convergence_gate_pass},"score":{convergence_gate_score}},"dimensionCoverageGate":{"pass":{dimension_coverage_gate_pass},"covered":{dimension_coverage_gate_covered_json},"missing":{dimension_coverage_gate_missing_json}},"p0ResolutionGate":{"pass":{p0_resolution_gate_pass},"activeP0":{active_p0_count}},"evidenceDensityGate":{"pass":{evidence_density_gate_pass},"avgEvidencePerFinding":{avg_evidence_per_finding}},"hotspotSaturationGate":{"pass":{hotspot_saturation_gate_pass}},"claimAdjudicationGate":{"pass":{claim_adjudication_gate_pass},"activeP0P1":{claim_adjudication_active_count}}},"recoveryStrategy":"{recovery_strategy}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
   487	          log: "Blocked STOP persisted for review loop. Failed gates: {blocked_by_csv}. Recovery strategy: {recovery_strategy}"
   488	        if_not_blocked:
   489	          proceed: true
   490	
   491	      step_handle_convergence:
   492	        action: "Act on convergence decision"
   493	        if_stop:
   494	          log: "Loop stopping. Reason: {reason}"
   495	          skip_to: phase_synthesis
   496	        if_blocked:
   497	          log: "Legal-stop gates blocked STOP. Failed gates: {blocked_by_csv}. Continuing review."
   498	        if_stuck_recovery:
   499	          log: "Stuck detected ({stuck_count} consecutive no-progress). Entering recovery."
   500	          recovery_strategies:
   501	            - "Change granularity: file-level → function-level → line-level review"
   502	            - "Traceability protocol replay: re-run unresolved core or overlay checks"
   503	            - "Escalate severity review: re-examine P2 findings for potential P1 upgrades"
   504	          pivot_target: "Pivot to the least-covered dimension (the review dimension with the fewest iteration passes and lowest coverage ratio)."
   505	          set:
   506	            next_dimension: "RECOVERY: {recovery_strategy}. Least-covered dimension: {least_explored}"
   507	            pending_stop_event: "stuck_recovery"
   508	            pending_stop_reason: "stuckRecovery"
   509	            pending_stop_detail: "Recovery path activated after repeated no-progress iterations"
   510	          reset: { stuck_count: 0 }
   511	        if_continue:
   512	          log: "Iteration {current_iteration}: Continuing. Dimension: {next_dimension}"
   513	
   514	      step_normalize_pause_events:
   515	        action: "Rewrite raw pause and recovery events to the frozen STOP_REASONS enum at emission time: converged, maxIterationsReached, blockedStop, stuckRecovery, error, manualStop, userPaused"
   516	        if_pending_pause_event:
   517	          append_jsonl: '{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"{pending_stop_detail}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
   518	          message: "Review paused. Delete review/.deep-review-pause to resume."
   519	          reset:
   520	            pending_stop_event: null
   521	            pending_stop_reason: null
   522	            pending_stop_detail: null
   523	          halt: true
   524	        if_pending_stuck_recovery:
   525	          append_jsonl: '{"type":"event","event":"stuckRecovery","mode":"review","stopReason":"stuckRecovery","fromIteration":{current_iteration},"strategy":"{recovery_strategy}","targetDimension":"{least_explored}","outcome":"pending","reason":"{pending_stop_detail}","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
   526	          reset:
   527	            pending_stop_event: null
   528	            pending_stop_reason: null
   529	            pending_stop_detail: null
   530	        if_no_pending_event:
   531	          proceed: true
   532	
   533	      step_generate_state_summary:
   534	        action: "Generate compact state summary for dispatch context (~200 tokens)"
   535	        generate: |
   536	          STATE SUMMARY (auto-generated):
   537	          Iteration: {current_iteration} of {max_iterations}
   538	          Dimension: {next_dimension}
   539	          Prior Findings: P0={p0_count} P1={p1_count} P2={p2_count}
   540	          Dimension Coverage: {dimensions_covered_list} ({dimension_coverage})
   541	          Traceability: core={core_protocol_status} overlay={overlay_protocol_status}
   542	          Coverage Age: {coverage_age}
   543	          Last 2 ratios: {ratio_prev} -> {ratio_latest}
   544	          Stuck count: {stuck_count}
   545	          Provisional Verdict: {PASS|CONDITIONAL|FAIL|PENDING} hasAdvisories={has_advisories}
   546	
   547	      step_dispatch_iteration:
   548	        action: "Dispatch @deep-review agent for one review iteration"
   549	        dispatch:
   550	          agent: deep-review
   551	          model: opus
   552	          context: |
   553	            {state_summary}
   554	
   555	            REVIEW ITERATION {current_iteration} of {max_iterations}
   556	            MODE: review
   557	            DIMENSION: {next_dimension}
   558	            REVIEW TARGET: {review_target}
   559	            REVIEW SCOPE FILES: {review_scope_files}
   560	            PRIOR FINDINGS: P0={p0_count} P1={p1_count} P2={p2_count}
   561	            SHARED DOCTRINE: Load .agents/skills/sk-code-review/references/review_core.md before final severity calls.
   562	            REVIEW DIMENSIONS: correctness, security, traceability, maintainability
   563	            TRACEABILITY PROTOCOLS:
   564	            - Core: spec_code, checklist_evidence
   565	            - Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
   566	            QUALITY GATES: evidence, scope, coverage
   567	            VERDICTS: FAIL | CONDITIONAL | PASS (PASS may set hasAdvisories=true when only P2 remain)
   568	            CLAIM ADJUDICATION: Every new P0/P1 must include claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.
   569	
   570	            State Files (ALL paths relative to repo root):
   571	              Config: {spec_folder}/review/deep-review-config.json
   572	              State Log: {spec_folder}/review/deep-review-state.jsonl
   573	              Findings Registry: {spec_folder}/review/deep-review-findings-registry.json
   574	              Strategy: {spec_folder}/review/deep-review-strategy.md
   575	              Write findings to: {spec_folder}/review/iterations/iteration-{NNN}.md
   576	
   577	            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
   578	            CONSTRAINT: Target 9 tool calls. Soft max 12, hard max 13.
   579	            CONSTRAINT: Write ALL findings to files. Do not hold in context.
   580	            CONSTRAINT: Review target is READ-ONLY. Do not modify reviewed files.
   581	            CONSTRAINT: Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
   582	            CONSTRAINT: When emitting the iteration JSONL record, include an optional `graphEvents` array of {type, id, label, relation?, source?, target?} objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.
   583	            CONSTRAINT: Update strategy.md dimension coverage, traceability status, and running findings.
   584	        wait_for_completion: true
   585	
   586	      step_evaluate_results:
   587	        action: "Verify iteration outputs and extract metrics"
   588	        verify:
   589	          - file_exists: "{spec_folder}/review/iterations/iteration-{NNN}.md"
   590	          - jsonl_appended: "New iteration record in state.jsonl"
   591	          - strategy_updated: "Strategy.md has been modified"
   592	        extract:
   593	          - newFindingsRatio: "From latest JSONL iteration record"
   594	          - findings_count: "From latest JSONL iteration record"
   595	          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
   596	          - dimensions: "From latest JSONL iteration record"
   597	          - files_reviewed: "From latest JSONL iteration record"
   598	          - status: "From latest JSONL iteration record"
   599	          - reviewed_artifacts: "From latest JSONL iteration record"
   600	          - traceability_checks: "From latest JSONL iteration record when present"
   601	        on_missing_outputs:
   602	          action: "Mark iteration as 'error', continue to next"
   603	          append_jsonl: '{"type":"iteration","run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
   604	
   605	      step_post_iteration_claim_adjudication:
   606	        action: "Validate typed claim-adjudication packets for any new P0/P1 findings and persist the result to state.jsonl so the next iteration's claimAdjudicationGate can read it"
   607	        verify:
   608	          - typed_packets_present: "Every new P0/P1 finding in review/iterations/iteration-{NNN}.md contains a claim-adjudication JSON block"
   609	          - packet_fields: "Each packet includes claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger"
   610	          - missing_packet_ids: "List of new P0/P1 finding IDs that are missing a typed packet or field; empty array when all packets validate"
   611	        on_pass:
   612	          set:
   613	            claim_adjudication_passed: true
   614	          append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},"passed":true,"activeP0P1":{active_p0_p1_count},"missingPackets":[],"timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
   615	          log: "Claim adjudication passed for iteration {current_iteration}. All new P0/P1 findings have typed packets."
   616	        on_fail:
   617	          action: "Mark the iteration as invalid for convergence. The next iteration's claimAdjudicationGate (step_check_convergence step 0) reads the persisted `passed: false` event and vetoes STOP until a follow-up iteration rewrites the packets."
   618	          set:
   619	            claim_adjudication_passed: false
   620	          append_jsonl: '{"type":"event","event":"claim_adjudication","mode":"review","run":{current_iteration},"passed":false,"activeP0P1":{active_p0_p1_count},"missingPackets":{missing_packet_ids},"reason":"Missing typed packet fields for new P0/P1 findings","timestamp":"{ISO_8601_NOW}","sessionId":"{session_id}","generation":{generation}}'
   621	          log: "Claim adjudication incomplete for new P0/P1 findings. Event persisted. The next iteration's step_check_convergence claim-adjudication pre-check will veto STOP while `passed: false` remains the latest event and active P0/P1 > 0."
   622	
   623	      step_reduce_review_state:
   624	        action: "Run reducer to refresh the canonical findings registry before dashboard generation"
   625	        command: "node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {spec_folder}"
   626	        read:
   627	          - "{spec_folder}/review/deep-review-state.jsonl"
   628	          - "{spec_folder}/review/iterations/iteration-{NNN}.md"
   629	          - "{spec_folder}/review/deep-review-findings-registry.json"
   630	          - "{spec_folder}/review/deep-review-strategy.md"
   631	        write:
   632	          - "{spec_folder}/review/deep-review-findings-registry.json"
   633	          - "{spec_folder}/review/deep-review-dashboard.md"
   634	          - "{spec_folder}/review/deep-review-strategy.md"
   635	        failure_modes:
   636	          malformed_delta: "skip + warn"
   637	          missing_iteration_file: "no-op + error"
   638	          schema_mismatch: "reject + conflict event"
   639	        guarantee: "Idempotent for identical inputs"
   640	        note: "Reducer outputs findingsRegistry, dashboardMetrics, and strategyUpdates. Re-running the same inputs must be idempotent."
   641	
   642	      step_graph_upsert:
   643	        action: "Transform the latest iteration graphEvents delta into review graph nodes and edges, then upsert it"
   644	        read:
   645	          - "{spec_folder}/review/deep-review-state.jsonl"
   646	          - "{spec_folder}/review/deep-review-findings-registry.json"
   647	        transform: |
   648	          1. Read the latest iteration JSONL record after reducer completion.
   649	          2. If graphEvents is absent or empty, set graph_nodes_json = [] and graph_edges_json = [] and skip the upsert.
   650	          3. For each graph event without relation/source/target, normalize kind = uppercase(event.kind || event.nodeKind || event.type) and keep only DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION.
   651	          4. Emit nodes as { id, kind, name, iteration, metadata } using the event label (or id fallback) and review metadata for run/current focus.
   652	          5. For each graph event with relation + source + target, normalize relation = uppercase(event.relation) and keep only COVERS, EVIDENCE_FOR, CONTRADICTS, RESOLVES, CONFIRMS, ESCALATES, IN_DIMENSION, IN_FILE.
   653	          6. Emit edges as { id, relation, sourceId, targetId, metadata } and deduplicate the batch by id.
   654	          7. Discard malformed or unknown graph events instead of failing the review iteration.
   655	        mcp_tool:
   656	          name: mcp__spec_kit_memory__deep_loop_graph_upsert
   657	          note: "Call directly - NEVER through Code Mode. Upsert only the latest iteration graph delta."
   658	          parameters: { specFolder: "{spec_folder}", loopType: "review", sessionId: "{session_id}", nodes: "{graph_nodes_json}", edges: "{graph_edges_json}" }
   659	        outputs:
   660	          - graph_nodes_json: "JSON array of normalized review graph nodes for the latest iteration"
   661	          - graph_edges_json: "JSON array of normalized review graph edges for the latest iteration"
   662	        skip_conditions:
   663	          - "Latest iteration record has no graphEvents array"
   664	
   665	      step_generate_dashboard:
   666	        action: "Generate or refresh the review dashboard"
   667	        read:
   668	          - "{spec_folder}/review/deep-review-state.jsonl"
   669	          - "{spec_folder}/review/deep-review-findings-registry.json"
   670	          - "{spec_folder}/review/deep-review-strategy.md"
   671	        content: |
   672	          # Deep Review Dashboard - Session Overview
   673	
   674	          Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.
   675	
   676	          ## Status
   677	          - Review Target: {review_target} ({review_target_type})
   678	          - Status: [ITERATING | CONVERGING | STUCK_RECOVERY | COMPLETE]
   679	          - Iteration: {current_iteration} of {max_iterations}
   680	          - Provisional Verdict: [PASS | CONDITIONAL | FAIL | PENDING]
   681	          - hasAdvisories: {has_advisories}
   682	
   683	          ## Findings Summary
   684	          | Severity | Count | Trend |
   685	          |----------|------:|-------|
   686	          | P0 (Blockers) | {p0_count} | {p0_trend} |
   687	          | P1 (Required) | {p1_count} | {p1_trend} |
   688	          | P2 (Suggestions) | {p2_count} | {p2_trend} |
   689	
   690	          ## Dimension Coverage
   691	          | Dimension | Status | Iteration | Findings |
   692	          |-----------|--------|-----------|----------|
   693	          | [per dimension from strategy + JSONL] |
   694	
   695	          ## Traceability Coverage
   696	          | Protocol | Level | Status | Findings |
   697	          |----------|-------|--------|----------|
   698	          | [per protocol from traceabilityChecks] |
   699	
   700	          ## Progress

exec
/bin/zsh -lc 'rg --files .opencode/skill/sk-deep-review/scripts/tests | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '920,1040p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   920	  }
   921	
   922	  // Part C REQ-015: fail-closed on corruption. Callers can opt out via lenient:true.
   923	  if (corruptionWarnings.length > 0 && !lenient) {
   924	    const preview = corruptionWarnings
   925	      .slice(0, 3)
   926	      .map((w) => `  - line ${w.line}: ${w.error}`)
   927	      .join('\n');
   928	    process.stderr.write(
   929	      `[sk-deep-review] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
   930	      + 'Pass --lenient to the reducer CLI (or lenient:true to reduceReviewState) to ignore corruption.\n',
   931	    );
   932	  }
   933	
   934	  return {
   935	    configPath,
   936	    stateLogPath,
   937	    strategyPath,
   938	    registryPath,
   939	    dashboardPath,
   940	    registry,
   941	    strategy,
   942	    dashboard,
   943	    corruptionWarnings,
   944	    hasCorruption: corruptionWarnings.length > 0,
   945	  };
   946	}
   947	
   948	// ─────────────────────────────────────────────────────────────────────────────
   949	// 6. CLI ENTRY POINT
   950	// ─────────────────────────────────────────────────────────────────────────────
   951	
   952	if (require.main === module) {
   953	  const args = process.argv.slice(2);
   954	  const lenient = args.includes('--lenient');
   955	  const createMissingAnchors = args.includes('--create-missing-anchors');
   956	  const positional = args.filter((arg) => !arg.startsWith('--'));
   957	  const specFolder = positional[0];
   958	
   959	  if (!specFolder) {
   960	    process.stderr.write(
   961	      'Usage: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> [--lenient] [--create-missing-anchors]\n',
   962	    );
   963	    process.exit(1);
   964	  }
   965	
   966	  try {
   967	    const result = reduceReviewState(specFolder, { write: true, lenient, createMissingAnchors });
   968	    process.stdout.write(
   969	      `${JSON.stringify(
   970	        {
   971	          registryPath: result.registryPath,
   972	          dashboardPath: result.dashboardPath,
   973	          strategyPath: result.strategyPath,
   974	          openFindingsCount: result.registry.openFindingsCount,
   975	          resolvedFindingsCount: result.registry.resolvedFindingsCount,
   976	          convergenceScore: result.registry.convergenceScore,
   977	          graphConvergenceScore: result.registry.graphConvergenceScore,
   978	          corruptionCount: result.corruptionWarnings.length,
   979	        },
   980	        null,
   981	        2,
   982	      )}\n`,
   983	    );
   984	    // Part C REQ-015: non-zero exit when corruption detected and not lenient.
   985	    if (result.hasCorruption && !lenient) {
   986	      process.exit(2);
   987	    }
   988	  } catch (error) {
   989	    process.stderr.write(`[sk-deep-review] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
   990	    process.exit(3);
   991	  }
   992	}
   993	
   994	// ─────────────────────────────────────────────────────────────────────────────
   995	// 7. EXPORTS
   996	// ─────────────────────────────────────────────────────────────────────────────
   997	
   998	module.exports = {
   999	  REQUIRED_DIMENSIONS,
  1000	  SEVERITY_KEYS,
  1001	  SEVERITY_WEIGHTS,
  1002	  buildGraphConvergenceRollup,
  1003	  parseIterationFile,
  1004	  parseJsonl,
  1005	  parseJsonlDetailed,
  1006	  parseFindingLine,
  1007	  replaceAnchorSection,
  1008	  reduceReviewState,
  1009	};

codex
The reducer has no direct unit test file under `scripts/tests`, which means fixtures and playbook scenarios may be the only executable evidence for this path. I’m checking whether the claim-adjudication and fail-closed contracts are actually covered anywhere, because missing coverage itself can explain why a regression slipped through.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Blocked Stop Fixture
description: End-to-end fixture for the sk-deep-review blocked_stop reducer path.
---

# Blocked Stop Fixture

This fixture demonstrates the full `blocked_stop -> registry -> dashboard` reducer path for a review packet.

For Gate E continuity, this fixture stays supporting evidence only. Broader packet recovery still routes through `/spec_kit:resume`, then `handover.md`, `_memory.continuity`, and the remaining spec docs.

It includes:
- A complete `blocked_stop` bundle with all required `gateResults`
- A severity upgrade where `F002` moves from `P2` in iteration 1 to `P1` in iteration 3
- A persistent active `P0` (`F001`) introduced in iteration 2 and still open in iteration 3
- Three iteration files that let the reducer populate `blockedStopHistory`, `persistentSameSeverity`, and `severityChanged`

This fixture is intended to exercise:
- `REQ-014` blocked-stop surfacing through the reducer and dashboard
- `REQ-021` reducer handling for blocked-stop history plus severity-transition tracking

Reducer entrypoint:

```bash
node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs \
  .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session
```

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{"type":"config","mode":"review","topic":"Reducer blocked-stop fixture for deep review review-mode packets","reviewTarget":"blocked-stop-session fixture","reviewTargetType":"fixture","sessionId":"rvw-blocked-stop-fixture","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.1,"createdAt":"2026-04-11T12:00:00Z","specFolder":".opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session"}
{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"Correctness review of reducer fixture state transitions","dimensions":["correctness"],"filesReviewed":["src/registry.ts","src/gates.ts"],"sessionId":"rvw-blocked-stop-fixture","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":2,"findingsSummary":{"P0":0,"P1":1,"P2":1},"findingsNew":{"P0":0,"P1":1,"P2":1},"newFindingsRatio":0.55,"timestamp":"2026-04-11T12:15:00Z","durationMs":45000,"findingRefs":["F002","F003"],"convergenceSignals":{"rollingAvg":0.12,"madScore":0.08,"dimensionCoverage":0.05,"compositeStop":0.05}}
{"type":"iteration","mode":"review","run":2,"status":"complete","focus":"Security review after export-path escalation","dimensions":["correctness","security"],"filesReviewed":["src/export.ts","src/registry.ts","src/gates.ts"],"sessionId":"rvw-blocked-stop-fixture","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":3,"findingsSummary":{"P0":1,"P1":1,"P2":1},"findingsNew":{"P0":1,"P1":0,"P2":0},"newFindingsRatio":0.68,"timestamp":"2026-04-11T12:30:00Z","durationMs":51000,"findingRefs":["F001","F002","F003"],"convergenceSignals":{"rollingAvg":0.18,"madScore":0.12,"dimensionCoverage":0.09,"compositeStop":0.09}}
{"type":"iteration","mode":"review","run":3,"status":"complete","focus":"Security verification of the blocked-stop path","dimensions":["correctness","security"],"filesReviewed":["src/export.ts","src/gates.ts","src/registry.ts"],"sessionId":"rvw-blocked-stop-fixture","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":3,"findingsSummary":{"P0":1,"P1":2,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.15,"timestamp":"2026-04-11T12:44:00Z","durationMs":39000,"findingRefs":["F001","F002","F003"],"convergenceSignals":{"rollingAvg":0.14,"madScore":0.13,"dimensionCoverage":0.15,"compositeStop":0.15}}
{"type":"event","event":"blocked_stop","mode":"review","run":3,"blockedBy":["dimensionCoverageGate","p0ResolutionGate"],"gateResults":{"convergenceGate":{"pass":true,"score":0.15},"dimensionCoverageGate":{"pass":false,"covered":["correctness","security"],"missing":["traceability","maintainability"]},"p0ResolutionGate":{"pass":false,"activeP0":1},"evidenceDensityGate":{"pass":true,"avgEvidencePerFinding":1.5},"hotspotSaturationGate":{"pass":true}},"recoveryStrategy":"Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.","timestamp":"2026-04-11T12:45:00Z","sessionId":"rvw-blocked-stop-fixture","generation":1}

 succeeded in 0ms:
# Iteration 2: Security escalation after export-path review

## Focus
Security review after export-path escalation from the blocked-stop fixture.

## Findings
### P0 - Blocker
- **F001**: Authorization bypass in review export route - `src/export.ts:41` - Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Correctness fallback can replay outdated gate state when later iterations update the review snapshot.

## Ruled Out
- A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.

## Dead Ends
- Token-only request mutation did not suppress the export leak because the reviewerId trust boundary stayed intact.

## Recommended Next Focus
Keep the security path under review, verify whether the stale stop-gate snapshot can influence blocker handling, and preserve the active P0 until the export boundary is proven safe.

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Iteration 1: Correctness baseline for reducer state transitions

## Focus
Correctness review of reducer fixture state transitions and registry bookkeeping.

## Findings
### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Correctness fallback can replay outdated gate state when later iterations update the review snapshot.

## Ruled Out
- Dashboard rendering bug in the progress table was not reproducible from the traced inputs.

## Dead Ends
- Replaying the same correctness trace with synthetic durations did not change the registry outcome.

## Recommended Next Focus
Expand into security review around export and reducer boundary handling to verify whether any active path can escalate beyond correctness-only impact.

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-003.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Iteration 3: Blocked-stop verification before legal stop

## Focus
Security verification of the blocked-stop path before a legal stop decision.

## Findings
### P0 - Blocker
- **F001**: Authorization bypass in review export route - `src/export.ts:41` - Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.
- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Security review showed the stale snapshot can preserve an outdated legal-stop decision, so severity is upgraded from advisory to required.

## Ruled Out
- The blocked-stop bundle itself is structurally complete, so the failure is not caused by missing event fields.

## Dead Ends
- Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.

## Recommended Next Focus
Resolve F001 first, then add traceability and maintainability coverage so the legal-stop gates can be re-evaluated without an active blocker.

exec
/bin/zsh -lc "rg -n \"review-reducer-fail-closed|reduceReviewState\\(|parseJsonlDetailed\\(|blockedStopHistory|persistentSameSeverity|severityChanged|claim_adjudication\" . -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 732ms:
./.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/scratch/archive-2026-03-25/iteration-003.md:37:- **Fix**: Persist `claim_adjudication_passed=false` and add it as a required convergence guard.
./.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:125:    const result = reducer.reduceReviewState(specFolder, { write: true });
./.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:168:    expect(() => reducer.reduceReviewState(specFolder, { write: false }))
./.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:188:    const result = reducer.reduceReviewState(specFolder, { write: true, lenient: true });

codex
The blocked-stop fixture is useful, but it doesn’t exercise claim-adjudication at all, which is exactly the gate I’m checking. I’m opening the fail-closed vitest now, because if it only covers corruption and anchors, that leaves the adjudication-stop path effectively untested.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// TEST: sk-deep-review reducer fail-closed behavior (phase 008 REQ-015, REQ-016)
//
// Covers:
//  - Test 1: malformed JSONL triggers corruptionWarnings + non-zero exit unless --lenient
//  - Test 2: missing machine-owned anchor throws a descriptive error
//  - Test 3: --lenient escape hatch preserves fail-open legacy behavior for corrupted JSONL
//
// Fixtures are written to a macOS-safe temp root (realpathSync wraps mkdtempSync
// so /var → /private/var symlinks don't poison path.relative in the reducer).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reducer = require('../../../sk-deep-review/scripts/reduce-state.cjs') as {
  reduceReviewState: (specFolder: string, options?: {
    write?: boolean;
    lenient?: boolean;
    createMissingAnchors?: boolean;
  }) => {
    corruptionWarnings: Array<{ line: number; error: string; raw: string }>;
    hasCorruption: boolean;
    registry: Record<string, unknown>;
    strategy: string;
    dashboard: string;
  };
  parseJsonlDetailed: (content: string) => {
    records: Array<Record<string, unknown>>;
    corruptionWarnings: Array<{ line: number; error: string; raw: string }>;
  };
  replaceAnchorSection: (
    content: string,
    anchorId: string,
    heading: string,
    body: string,
    options?: { createMissing?: boolean },
  ) => string;
};

const tempRoots: string[] = [];

function makeTempSpecFolder(slug: string): string {
  // Realpath resolves macOS /var → /private/var so internal path.relative stays
  // consistent with validateFilePath's symlink resolution.
  const projectRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `review-fail-closed-${slug}-`)));
  tempRoots.push(projectRoot);
  const specFolder = path.join(projectRoot, 'specs', 'phase-008', 'fail-closed');
  fs.mkdirSync(path.join(specFolder, 'review', 'iterations'), { recursive: true });
  return specFolder;
}

function writeConfig(specFolder: string): void {
  const config = {
    topic: 'fail-closed test',
    mode: 'review',
    reviewTarget: 'fixture',
    reviewTargetType: 'spec-folder',
    reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
    sessionId: 'rvw-fail-closed',
    generation: 1,
    lineageMode: 'new',
    maxIterations: 7,
    convergenceThreshold: 0.1,
    status: 'running',
    createdAt: '2026-04-11T00:00:00Z',
  };
  fs.writeFileSync(
    path.join(specFolder, 'review', 'deep-review-config.json'),
    `${JSON.stringify(config, null, 2)}\n`,
    'utf8',
  );
}

function writeIterationStub(specFolder: string): void {
  fs.writeFileSync(
    path.join(specFolder, 'review', 'iterations', 'iteration-001.md'),
    [
      '# Iteration 1: test',
      '',
      '## Focus',
      'fail-closed',
      '',
      '## Findings',
      '',
      '## Ruled Out',
      '',
      '## Dead Ends',
      '',
      '## Recommended Next Focus',
      'next',
      '',
    ].join('\n'),
    'utf8',
  );
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

describe('sk-deep-review reducer — fail-closed behavior', () => {
  it('reports corruptionWarnings and flags hasCorruption when JSONL is malformed', () => {
    const specFolder = makeTempSpecFolder('corruption');
    writeConfig(specFolder);
    writeIterationStub(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
        'this line is definitely not valid json',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = reducer.reduceReviewState(specFolder, { write: true });

    expect(result.hasCorruption).toBe(true);
    expect(result.corruptionWarnings).toHaveLength(1);
    expect(result.corruptionWarnings[0].line).toBe(2);
    expect(result.corruptionWarnings[0].error).toMatch(/not valid JSON|JSON/);
    expect(result.registry.corruptionWarnings).toEqual(result.corruptionWarnings);
  });

  it('throws a descriptive error when a machine-owned strategy anchor is missing', () => {
    const specFolder = makeTempSpecFolder('missing-anchor');
    writeConfig(specFolder);
    writeIterationStub(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
        '',
      ].join('\n'),
      'utf8',
    );
    // Strategy file exists but omits the required next-focus anchor.
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-strategy.md'),
      [
        '---',
        'title: partial strategy',
        '---',
        '',
        '<!-- ANCHOR:review-dimensions -->',
        '## 3. REVIEW DIMENSIONS (remaining)',
        '- [ ] correctness',
        '- [ ] security',
        '- [ ] traceability',
        '- [ ] maintainability',
        '<!-- /ANCHOR:review-dimensions -->',
        '',
        // No completed-dimensions / running-findings / exhausted-approaches / next-focus anchors
      ].join('\n'),
      'utf8',
    );

    expect(() => reducer.reduceReviewState(specFolder, { write: false }))
      .toThrow(/Missing machine-owned anchor .*completed-dimensions|running-findings|exhausted-approaches|next-focus/);
  });

  it('with --lenient / createMissingAnchors the reducer still records corruption but does not block', () => {
    const specFolder = makeTempSpecFolder('lenient');
    writeConfig(specFolder);
    writeIterationStub(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
        'garbage line A',
        'garbage line B',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = reducer.reduceReviewState(specFolder, { write: true, lenient: true });

    // corruption is still reported...
    expect(result.corruptionWarnings).toHaveLength(2);
    expect(result.hasCorruption).toBe(true);
    // ...but the reducer still produced registry output successfully
    expect(result.registry.corruptionWarnings).toEqual(result.corruptionWarnings);
    expect(result.registry.sessionId).toBe('rvw-fail-closed');
  });
});

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// TEST: sk-deep-review reducer fail-closed behavior (phase 008 REQ-015, REQ-016)
     2	//
     3	// Covers:
     4	//  - Test 1: malformed JSONL triggers corruptionWarnings + non-zero exit unless --lenient
     5	//  - Test 2: missing machine-owned anchor throws a descriptive error
     6	//  - Test 3: --lenient escape hatch preserves fail-open legacy behavior for corrupted JSONL
     7	//
     8	// Fixtures are written to a macOS-safe temp root (realpathSync wraps mkdtempSync
     9	// so /var → /private/var symlinks don't poison path.relative in the reducer).
    10	
    11	import fs from 'node:fs';
    12	import os from 'node:os';
    13	import path from 'node:path';
    14	
    15	import { afterEach, describe, expect, it } from 'vitest';
    16	
    17	// eslint-disable-next-line @typescript-eslint/no-var-requires
    18	const reducer = require('../../../sk-deep-review/scripts/reduce-state.cjs') as {
    19	  reduceReviewState: (specFolder: string, options?: {
    20	    write?: boolean;
    21	    lenient?: boolean;
    22	    createMissingAnchors?: boolean;
    23	  }) => {
    24	    corruptionWarnings: Array<{ line: number; error: string; raw: string }>;
    25	    hasCorruption: boolean;
    26	    registry: Record<string, unknown>;
    27	    strategy: string;
    28	    dashboard: string;
    29	  };
    30	  parseJsonlDetailed: (content: string) => {
    31	    records: Array<Record<string, unknown>>;
    32	    corruptionWarnings: Array<{ line: number; error: string; raw: string }>;
    33	  };
    34	  replaceAnchorSection: (
    35	    content: string,
    36	    anchorId: string,
    37	    heading: string,
    38	    body: string,
    39	    options?: { createMissing?: boolean },
    40	  ) => string;
    41	};
    42	
    43	const tempRoots: string[] = [];
    44	
    45	function makeTempSpecFolder(slug: string): string {
    46	  // Realpath resolves macOS /var → /private/var so internal path.relative stays
    47	  // consistent with validateFilePath's symlink resolution.
    48	  const projectRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `review-fail-closed-${slug}-`)));
    49	  tempRoots.push(projectRoot);
    50	  const specFolder = path.join(projectRoot, 'specs', 'phase-008', 'fail-closed');
    51	  fs.mkdirSync(path.join(specFolder, 'review', 'iterations'), { recursive: true });
    52	  return specFolder;
    53	}
    54	
    55	function writeConfig(specFolder: string): void {
    56	  const config = {
    57	    topic: 'fail-closed test',
    58	    mode: 'review',
    59	    reviewTarget: 'fixture',
    60	    reviewTargetType: 'spec-folder',
    61	    reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
    62	    sessionId: 'rvw-fail-closed',
    63	    generation: 1,
    64	    lineageMode: 'new',
    65	    maxIterations: 7,
    66	    convergenceThreshold: 0.1,
    67	    status: 'running',
    68	    createdAt: '2026-04-11T00:00:00Z',
    69	  };
    70	  fs.writeFileSync(
    71	    path.join(specFolder, 'review', 'deep-review-config.json'),
    72	    `${JSON.stringify(config, null, 2)}\n`,
    73	    'utf8',
    74	  );
    75	}
    76	
    77	function writeIterationStub(specFolder: string): void {
    78	  fs.writeFileSync(
    79	    path.join(specFolder, 'review', 'iterations', 'iteration-001.md'),
    80	    [
    81	      '# Iteration 1: test',
    82	      '',
    83	      '## Focus',
    84	      'fail-closed',
    85	      '',
    86	      '## Findings',
    87	      '',
    88	      '## Ruled Out',
    89	      '',
    90	      '## Dead Ends',
    91	      '',
    92	      '## Recommended Next Focus',
    93	      'next',
    94	      '',
    95	    ].join('\n'),
    96	    'utf8',
    97	  );
    98	}
    99	
   100	afterEach(() => {
   101	  while (tempRoots.length > 0) {
   102	    const root = tempRoots.pop();
   103	    if (root) {
   104	      fs.rmSync(root, { recursive: true, force: true });
   105	    }
   106	  }
   107	});
   108	
   109	describe('sk-deep-review reducer — fail-closed behavior', () => {
   110	  it('reports corruptionWarnings and flags hasCorruption when JSONL is malformed', () => {
   111	    const specFolder = makeTempSpecFolder('corruption');
   112	    writeConfig(specFolder);
   113	    writeIterationStub(specFolder);
   114	    fs.writeFileSync(
   115	      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
   116	      [
   117	        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
   118	        'this line is definitely not valid json',
   119	        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
   120	        '',
   121	      ].join('\n'),
   122	      'utf8',
   123	    );
   124	
   125	    const result = reducer.reduceReviewState(specFolder, { write: true });
   126	
   127	    expect(result.hasCorruption).toBe(true);
   128	    expect(result.corruptionWarnings).toHaveLength(1);
   129	    expect(result.corruptionWarnings[0].line).toBe(2);
   130	    expect(result.corruptionWarnings[0].error).toMatch(/not valid JSON|JSON/);
   131	    expect(result.registry.corruptionWarnings).toEqual(result.corruptionWarnings);
   132	  });
   133	
   134	  it('throws a descriptive error when a machine-owned strategy anchor is missing', () => {
   135	    const specFolder = makeTempSpecFolder('missing-anchor');
   136	    writeConfig(specFolder);
   137	    writeIterationStub(specFolder);
   138	    fs.writeFileSync(
   139	      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
   140	      [
   141	        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
   142	        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
   143	        '',
   144	      ].join('\n'),
   145	      'utf8',
   146	    );
   147	    // Strategy file exists but omits the required next-focus anchor.
   148	    fs.writeFileSync(
   149	      path.join(specFolder, 'review', 'deep-review-strategy.md'),
   150	      [
   151	        '---',
   152	        'title: partial strategy',
   153	        '---',
   154	        '',
   155	        '<!-- ANCHOR:review-dimensions -->',
   156	        '## 3. REVIEW DIMENSIONS (remaining)',
   157	        '- [ ] correctness',
   158	        '- [ ] security',
   159	        '- [ ] traceability',
   160	        '- [ ] maintainability',
   161	        '<!-- /ANCHOR:review-dimensions -->',
   162	        '',
   163	        // No completed-dimensions / running-findings / exhausted-approaches / next-focus anchors
   164	      ].join('\n'),
   165	      'utf8',
   166	    );
   167	
   168	    expect(() => reducer.reduceReviewState(specFolder, { write: false }))
   169	      .toThrow(/Missing machine-owned anchor .*completed-dimensions|running-findings|exhausted-approaches|next-focus/);
   170	  });
   171	
   172	  it('with --lenient / createMissingAnchors the reducer still records corruption but does not block', () => {
   173	    const specFolder = makeTempSpecFolder('lenient');
   174	    writeConfig(specFolder);
   175	    writeIterationStub(specFolder);
   176	    fs.writeFileSync(
   177	      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
   178	      [
   179	        '{"type":"config","mode":"review","sessionId":"rvw-fail-closed"}',
   180	        'garbage line A',
   181	        'garbage line B',
   182	        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"test","dimensions":["correctness"],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"sessionId":"rvw-fail-closed","generation":1,"lineageMode":"new","timestamp":"2026-04-11T00:05:00Z","durationMs":10000}',
   183	        '',
   184	      ].join('\n'),
   185	      'utf8',
   186	    );
   187	
   188	    const result = reducer.reduceReviewState(specFolder, { write: true, lenient: true });
   189	
   190	    // corruption is still reported...
   191	    expect(result.corruptionWarnings).toHaveLength(2);
   192	    expect(result.hasCorruption).toBe(true);
   193	    // ...but the reducer still produced registry output successfully
   194	    expect(result.registry.corruptionWarnings).toEqual(result.corruptionWarnings);
   195	    expect(result.registry.sessionId).toBe('rvw-fail-closed');
   196	  });
   197	});

exec
/bin/zsh -lc "rg -n \"claim adjudication|claim_adjudication|activeP0P1|missingPackets|typed packet|finalSeverity|transitions\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/sk-deep-review/scripts/tests .opencode/skill/sk-deep-review/manual_testing_playbook -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md:32:- Pass/fail posture: PASS if confirm mode has explicit approval gates at phase transitions; FAIL if any phase transition runs without an approval gate.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md:47:| DRV-002 | Confirm mode checkpointed review | Verify that `/spec_kit:deep-review:confirm` pauses at each phase for user approval before proceeding. | Validate the confirm entrypoint for sk-deep-review. Confirm that `/spec_kit:deep-review:confirm` routes to the confirm YAML workflow with explicit approval gates at each phase transition, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n '/spec_kit:deep-review:confirm|approval|multi_gate' .opencode/skill/sk-deep-review/README.md .opencode/skill/sk-deep-review/references/quick_reference.md` -> 2. `bash: rg -n 'confirm|approval|gate|pause' .opencode/command/spec_kit/deep-review.md` -> 3. `bash: rg -n 'approvals|approval_gate|wait_for_approval|interactive' .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | The confirm YAML has `approvals: multi_gate`, approval steps appear in the loop, and the command entrypoint routes `:confirm` to the confirm YAML. | Capture the mode-routing block, the confirm YAML operating_mode, and the approval gate steps together. | PASS if confirm mode has explicit approval gates at phase transitions; FAIL if any phase transition runs without an approval gate. | Compare the auto and confirm YAMLs side by side to verify the confirm variant adds approval gates that the auto variant omits. |
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:3:description: "Verify that finding deduplication uses adjudicated finalSeverity and produces a clean Active Finding Registry in the review report."
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:14:This scenario validates finding deduplication and registry for `DRV-028`. The objective is to verify that the synthesis phase deduplicates findings across iterations using adjudicated `finalSeverity` and produces a clean Active Finding Registry in the review report.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:18:Multiple review iterations covering overlapping code areas will inevitably find the same issue more than once. Without deduplication, the report inflates finding counts, confuses remediation planning, and undermines operator trust. The `finalSeverity` adjudication ensures that when the same finding appears at different severities across iterations, the authoritative severity is used in the registry.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:26:- Objective: Verify finding deduplication uses adjudicated finalSeverity and produces clean registry.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:28:- Orchestrator prompt: Validate the finding deduplication contract for sk-deep-review. Confirm that during synthesis, findings from all `review/iterations/iteration-NNN.md` files are compared for duplicates, that duplicate resolution uses adjudicated `finalSeverity` (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in `review-report.md` contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:31:- Expected signals: Findings are compared across iterations by location and description, `finalSeverity` is the highest severity encountered, the Active Finding Registry contains unique entries only, P0 findings are never downgraded or discarded, and the registry includes file:line evidence for each finding.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md:47:| DRV-028 | Finding deduplication and registry | Verify finding deduplication uses adjudicated finalSeverity and produces clean Active Finding Registry. | Validate the finding deduplication contract for sk-deep-review. Confirm that duplicate findings across iterations are merged using adjudicated `finalSeverity` (highest severity wins), the Active Finding Registry contains unique findings with evidence, and P0 findings are never discarded, then return a concise operator-facing verdict. | 1. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|Active Finding Registry|unique.*finding|merge.*finding|duplicate' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` -> 2. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|active_finding|merge|duplicate|unique' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Active Finding Registry|Dedup|finalSeverity|finding.*registry|finding.*evidence|unique.*finding' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Findings compared across iterations, `finalSeverity` is highest severity encountered, Active Finding Registry has unique entries, P0 never downgraded, evidence included. | Capture the deduplication rules from SKILL.md, the YAML synthesis deduplication logic, and the Active Finding Registry section definition from quick reference. | PASS if deduplication produces a clean registry with adjudicated severities; FAIL if duplicates appear in the registry or P0 findings are lost during deduplication. | Privilege the SKILL.md rules for deduplication logic and the quick reference for the Active Finding Registry section definition. |
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:17:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:37:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:63:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:125:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:145:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:167:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:195:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:215:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:241:      "transitions": [
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md:1:# Iteration 1: Correctness baseline for reducer state transitions
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-001.md:4:Correctness review of reducer fixture state transitions and registry bookkeeping.
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl:2:{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"Correctness review of reducer fixture state transitions","dimensions":["correctness"],"filesReviewed":["src/registry.ts","src/gates.ts"],"sessionId":"rvw-blocked-stop-fixture","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"findingsCount":2,"findingsSummary":{"P0":0,"P1":1,"P2":1},"findingsNew":{"P0":0,"P1":1,"P2":1},"newFindingsRatio":0.55,"timestamp":"2026-04-11T12:15:00Z","durationMs":45000,"findingRefs":["F002","F003"],"convergenceSignals":{"rollingAvg":0.12,"madScore":0.08,"dimensionCoverage":0.05,"compositeStop":0.05}}
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:204:    it('rejects backward transitions', () => {
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md:45:| 1 | Correctness review of reducer fixture state transitions | correctness | 0.55 | 0/1/1 | complete |
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts:333:    return 'Governance rollout scenario requires actor-scoped state transitions and race checks beyond direct handler automation.';
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:28:- Orchestrator prompt: Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 (adversarial self-check on P0 findings) is documented in the SKILL.md rules, enforced in the quick reference iteration checklist, and checked in the YAML post-iteration claim adjudication, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:29:- Expected execution process: Inspect the SKILL.md rules for Rule 10, then the quick reference iteration checklist for the self-check step, then the YAML post-iteration claim adjudication step, then the agent definitions for the self-check protocol.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:31:- Expected signals: Rule 10 in SKILL.md mandates adversarial self-check for P0; the iteration checklist includes it as step 5; the YAML has a claim adjudication step that checks for P0/P1 self-check evidence; the agent definitions describe the Hunter/Skeptic/Referee roles.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:47:| DRV-012 | Adversarial self-check runs on P0 findings | Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them. | Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 mandates adversarial self-check for P0 findings, the iteration checklist enforces it, and the YAML claim adjudication checks for it, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'adversarial\|self.check\|Hunter\|Skeptic\|Referee\|Rule 10\|re-read.*P0' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'adversarial\|self.check\|P0.*check\|claim_adjudication' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'adversarial\|self.check\|P0\|Hunter\|Skeptic\|Referee' .opencode/skill/sk-deep-review/references/quick_reference.md .codex/agents/deep-review.toml .claude/agents/deep-review.md` | Rule 10 in SKILL.md mandates adversarial self-check; iteration checklist includes it as step 5; YAML has claim adjudication; agent definitions describe the protocol. | Capture Rule 10, the checklist step, the claim adjudication YAML step, and the agent self-check instructions. | PASS if the adversarial self-check is documented, enforced in the iteration checklist, and checked in the YAML; FAIL if P0 findings can be recorded without a self-check. | If the agent definition lacks explicit Hunter/Skeptic/Referee roles, check whether the SKILL.md Rule 10 wording is sufficient to trigger the behavior implicitly. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Post-iteration claim adjudication; inspect `step_post_iteration_claim_adjudication` |
.opencode/skill/system-spec-kit/scripts/tests/test_dual_threshold.py:503:    """Boundary value tests for all threshold transitions."""

exec
/bin/zsh -lc "rg -n \"resolvedFindings\" .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/skill/sk-deep-review -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
.opencode/skill/sk-deep-review/references/loop_protocol.md:156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
.opencode/skill/sk-deep-review/references/state_format.md:97:      "resolvedFindings",
.opencode/skill/sk-deep-review/references/state_format.md:501:  "resolvedFindings": [],
.opencode/skill/sk-deep-review/references/state_format.md:518:  "resolvedFindingsCount": 1,
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:279:        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:259:        - resolvedFindings
.opencode/skill/sk-deep-review/assets/deep_review_config.json:73:      "resolvedFindings",
.opencode/skill/sk-deep-review/SKILL.md:289:- Metrics: `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore`
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:294:    if (Array.isArray(record.resolvedFindings)) {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:295:      for (const id of record.resolvedFindings) {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:302:  const resolvedFindings = [];
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:306:      resolvedFindings.push(finding);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:313:  resolvedFindings.sort(compareFindings);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:315:  return { openFindings, resolvedFindings };
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:494:  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:526:    resolvedFindings,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:534:    resolvedFindingsCount: resolvedFindings.length,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:618:    `- Resolved: ${registry.resolvedFindingsCount}`,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:755:    `| Resolved | ${registry.resolvedFindingsCount} |`,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:975:          resolvedFindingsCount: result.registry.resolvedFindingsCount,
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:73:  "resolvedFindings": [],
.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json:263:  "resolvedFindingsCount": 0,
.opencode/skill/sk-deep-review/references/state_format.md:97:      "resolvedFindings",
.opencode/skill/sk-deep-review/references/state_format.md:501:  "resolvedFindings": [],
.opencode/skill/sk-deep-review/references/state_format.md:518:  "resolvedFindingsCount": 1,
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
.opencode/skill/sk-deep-review/references/loop_protocol.md:156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |

 succeeded in 0ms:
{
  "sessionId": "rvw-blocked-stop-fixture",
  "generation": 1,
  "lineageMode": "new",
  "openFindings": [
    {
      "findingId": "F001",
      "severity": "P0",
      "title": "Authorization bypass in review export route",
      "file": "src/export.ts",
      "line": 41,
      "description": "Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.",
      "dimension": "security",
      "firstSeen": 2,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 2,
          "from": null,
          "to": "P0",
          "reason": "Initial discovery"
        }
      ]
    },
    {
      "findingId": "F002",
      "severity": "P1",
      "title": "Stale stop-gate snapshot reuse",
      "file": "src/gates.ts",
      "line": 64,
      "description": "Correctness fallback can replay outdated gate state when later iterations update the review snapshot.",
      "dimension": "correctness",
      "firstSeen": 1,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 1,
          "from": null,
          "to": "P2",
          "reason": "Initial discovery"
        },
        {
          "iteration": 3,
          "from": "P2",
          "to": "P1",
          "reason": "Severity adjusted in later iteration"
        }
      ]
    },
    {
      "findingId": "F003",
      "severity": "P1",
      "title": "Missing null guard in registry merge",
      "file": "src/registry.ts",
      "line": 88,
      "description": "Correctness path dereferences prior state before checking the record exists.",
      "dimension": "correctness",
      "firstSeen": 1,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 1,
          "from": null,
          "to": "P1",
          "reason": "Initial discovery"
        }
      ]
    }
  ],
  "resolvedFindings": [],
  "blockedStopHistory": [
    {
      "run": 3,
      "blockedBy": [
        "dimensionCoverageGate",
        "p0ResolutionGate"
      ],
      "gateResults": {
        "convergenceGate": {
          "pass": true,
          "score": 0.15
        },
        "dimensionCoverageGate": {
          "pass": false,
          "covered": [
            "correctness",
            "security"
          ],
          "missing": [
            "traceability",
            "maintainability"
          ]
        },
        "p0ResolutionGate": {
          "pass": false,
          "activeP0": 1
        },
        "evidenceDensityGate": {
          "pass": true,
          "avgEvidencePerFinding": 1.5
        },
        "hotspotSaturationGate": {
          "pass": true
        }
      },
      "recoveryStrategy": "Resolve active P0 (F001) and cover traceability + maintainability dimensions before next iteration.",
      "timestamp": "2026-04-11T12:45:00Z"
    }
  ],
  "persistentSameSeverity": [
    {
      "findingId": "F001",
      "severity": "P0",
      "title": "Authorization bypass in review export route",
      "file": "src/export.ts",
      "line": 41,
      "description": "Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.",
      "dimension": "security",
      "firstSeen": 2,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 2,
          "from": null,
          "to": "P0",
          "reason": "Initial discovery"
        }
      ]
    },
    {
      "findingId": "F003",
      "severity": "P1",
      "title": "Missing null guard in registry merge",
      "file": "src/registry.ts",
      "line": 88,
      "description": "Correctness path dereferences prior state before checking the record exists.",
      "dimension": "correctness",
      "firstSeen": 1,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 1,
          "from": null,
          "to": "P1",
          "reason": "Initial discovery"
        }
      ]
    }
  ],
  "severityChanged": [
    {
      "findingId": "F002",
      "severity": "P1",
      "title": "Stale stop-gate snapshot reuse",
      "file": "src/gates.ts",
      "line": 64,
      "description": "Correctness fallback can replay outdated gate state when later iterations update the review snapshot.",
      "dimension": "correctness",
      "firstSeen": 1,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 1,
          "from": null,
          "to": "P2",
          "reason": "Initial discovery"
        },
        {
          "iteration": 3,
          "from": "P2",
          "to": "P1",
          "reason": "Severity adjusted in later iteration"
        }
      ]
    }
  ],
  "repeatedFindings": [
    {
      "findingId": "F001",
      "severity": "P0",
      "title": "Authorization bypass in review export route",
      "file": "src/export.ts",
      "line": 41,
      "description": "Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.",
      "dimension": "security",
      "firstSeen": 2,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 2,
          "from": null,
          "to": "P0",
          "reason": "Initial discovery"
        }
      ]
    },
    {
      "findingId": "F002",
      "severity": "P1",
      "title": "Stale stop-gate snapshot reuse",
      "file": "src/gates.ts",
      "line": 64,
      "description": "Correctness fallback can replay outdated gate state when later iterations update the review snapshot.",
      "dimension": "correctness",
      "firstSeen": 1,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 1,
          "from": null,
          "to": "P2",
          "reason": "Initial discovery"
        },
        {
          "iteration": 3,
          "from": "P2",
          "to": "P1",
          "reason": "Severity adjusted in later iteration"
        }
      ]
    },
    {
      "findingId": "F003",
      "severity": "P1",
      "title": "Missing null guard in registry merge",
      "file": "src/registry.ts",
      "line": 88,
      "description": "Correctness path dereferences prior state before checking the record exists.",
      "dimension": "correctness",
      "firstSeen": 1,
      "lastSeen": 3,
      "status": "active",
      "transitions": [
        {
          "iteration": 1,
          "from": null,
          "to": "P1",
          "reason": "Initial discovery"
        }
      ]
    }
  ],
  "dimensionCoverage": {
    "correctness": true,
    "security": true,
    "traceability": false,
    "maintainability": false
  },
  "findingsBySeverity": {
    "P0": 1,
    "P1": 2,
    "P2": 0

codex
**Findings**

`F-013-001`  
Severity: `P1`  
Dimension: `correctness`  
File: [.opencode/skill/sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:260)  
Line: `260-288, 503-515`  
Title: Reducer ignores adjudicated `finalSeverity` and packet transition history  
Description: `buildFindingRegistry()` derives severity and transitions only from the severity bucket where a finding appears in `iteration-NNN.md`, then `persistentSameSeverity`/`severityChanged` are computed from that derived history. The reducer never parses the typed claim-adjudication packet from `state_format.md` §9, so same-iteration adjudication changes are invisible. That breaks the documented contract that packet `finalSeverity` is authoritative before convergence visibility and that packet `transitions` are mirrored into the registry. A finding downgraded or upgraded during Step 4a can therefore be counted under the wrong active severity and placed in the wrong split bucket.  
Evidence: In code, the registry is built from `iteration.findings` only, and transitions are appended only when later iteration headings change severity. In the contract, `finalSeverity` and `transitions` are part of the typed packet and “mirrored into the finding registry” ([state_format.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/state_format.md:690), lines `690-726`; [loop_protocol.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md:324), lines `324-330`).  
Recommendation: Parse claim-adjudication packets by `findingId`, treat packet `finalSeverity` as canonical for the registry, and seed/merge registry `transitions` from the packet before computing `persistentSameSeverity` and `severityChanged`.

`F-013-002`  
Severity: `P2`  
Dimension: `correctness`  
File: [.opencode/skill/sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:848)  
Line: `848-856`  
Title: Dashboard can report a stale claim-adjudication STOP veto after all active P0/P1 findings are gone  
Description: The `ACTIVE RISKS` section emits a STOP-veto warning whenever the latest `claim_adjudication` event has `passed === false`. It does not check whether there are still active P0/P1 findings. Step 4a defines `claimAdjudicationGate` as vacuously passing when no active P0/P1 remain, so after a later downgrade or resolution the reducer can still tell operators that STOP is vetoed even though the gate should now pass.  
Evidence: The warning is keyed only off the latest failed event in `iterationRecords`; there is no `severity.P0 + severity.P1` guard. The workflow contract explicitly says the gate passes when `last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate` ([spec_kit_deep-review_auto.yaml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:381), lines `381-388, 420`; [loop_protocol.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md:306), lines `306-330`).  
Recommendation: Only surface the veto when the latest failed adjudication still applies to active P0/P1, for example by checking current active counts or the event’s `activeP0P1` payload.

`F-013-003`  
Severity: `P2`  
Dimension: `correctness`  
File: [.opencode/skill/sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:900)  
Line: `900-945, 967-987`  
Title: Exported reducer API still behaves fail-open on corrupt JSONL unless callers add their own guard  
Description: `reduceReviewState()` parses corrupt JSONL, builds registry/strategy/dashboard, and returns normally even when `lenient` is false. The fail-closed behavior only happens in the CLI wrapper, which exits `2` after the reducer has already produced outputs. The published contract says `--lenient` or `lenient:true` is the escape hatch, so direct in-process callers currently get silent partial replay by default.  
Evidence: The function constructs outputs before the corruption branch and then returns `{ hasCorruption: true }`; only `require.main === module` exits non-zero. The contract says malformed JSONL should fail closed unless `--lenient` or `lenient:true` is used ([state_format.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/state_format.md:545), lines `545-548`).  
Recommendation: Make `reduceReviewState()` itself throw or refuse writes when corruption is present and `lenient` is false, then let the CLI translate that into exit code `2`.

**Iteration Summary**

Total findings: `3`  
Breakdown: `0 P0`, `1 P1`, `2 P2`

**Coverage Assessment**

Reviewed about `95%` of the requested focus area: the reducer logic, the relevant state-format contract, Step `4a` / legal-stop workflow wiring, the fail-closed test, and the shipped blocked-stop fixture.

**Confidence**

`high`

**Next Priorities**

Check reopened/resolved finding semantics in the reducer next. I did not fully validate whether a finding listed in `resolvedFindings` can be safely reopened later, or whether synthesis/report dedup uses the adjudicated `finalSeverity` consistently end to end.


hook: Stop
hook: Stop Completed
tokens used
95,014
**Findings**

`F-013-001`  
Severity: `P1`  
Dimension: `correctness`  
File: [.opencode/skill/sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:260)  
Line: `260-288, 503-515`  
Title: Reducer ignores adjudicated `finalSeverity` and packet transition history  
Description: `buildFindingRegistry()` derives severity and transitions only from the severity bucket where a finding appears in `iteration-NNN.md`, then `persistentSameSeverity`/`severityChanged` are computed from that derived history. The reducer never parses the typed claim-adjudication packet from `state_format.md` §9, so same-iteration adjudication changes are invisible. That breaks the documented contract that packet `finalSeverity` is authoritative before convergence visibility and that packet `transitions` are mirrored into the registry. A finding downgraded or upgraded during Step 4a can therefore be counted under the wrong active severity and placed in the wrong split bucket.  
Evidence: In code, the registry is built from `iteration.findings` only, and transitions are appended only when later iteration headings change severity. In the contract, `finalSeverity` and `transitions` are part of the typed packet and “mirrored into the finding registry” ([state_format.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/state_format.md:690), lines `690-726`; [loop_protocol.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md:324), lines `324-330`).  
Recommendation: Parse claim-adjudication packets by `findingId`, treat packet `finalSeverity` as canonical for the registry, and seed/merge registry `transitions` from the packet before computing `persistentSameSeverity` and `severityChanged`.

`F-013-002`  
Severity: `P2`  
Dimension: `correctness`  
File: [.opencode/skill/sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:848)  
Line: `848-856`  
Title: Dashboard can report a stale claim-adjudication STOP veto after all active P0/P1 findings are gone  
Description: The `ACTIVE RISKS` section emits a STOP-veto warning whenever the latest `claim_adjudication` event has `passed === false`. It does not check whether there are still active P0/P1 findings. Step 4a defines `claimAdjudicationGate` as vacuously passing when no active P0/P1 remain, so after a later downgrade or resolution the reducer can still tell operators that STOP is vetoed even though the gate should now pass.  
Evidence: The warning is keyed only off the latest failed event in `iterationRecords`; there is no `severity.P0 + severity.P1` guard. The workflow contract explicitly says the gate passes when `last_claim_adjudication_passed != false OR there are no active P0/P1 findings to adjudicate` ([spec_kit_deep-review_auto.yaml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:381), lines `381-388, 420`; [loop_protocol.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md:306), lines `306-330`).  
Recommendation: Only surface the veto when the latest failed adjudication still applies to active P0/P1, for example by checking current active counts or the event’s `activeP0P1` payload.

`F-013-003`  
Severity: `P2`  
Dimension: `correctness`  
File: [.opencode/skill/sk-deep-review/scripts/reduce-state.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:900)  
Line: `900-945, 967-987`  
Title: Exported reducer API still behaves fail-open on corrupt JSONL unless callers add their own guard  
Description: `reduceReviewState()` parses corrupt JSONL, builds registry/strategy/dashboard, and returns normally even when `lenient` is false. The fail-closed behavior only happens in the CLI wrapper, which exits `2` after the reducer has already produced outputs. The published contract says `--lenient` or `lenient:true` is the escape hatch, so direct in-process callers currently get silent partial replay by default.  
Evidence: The function constructs outputs before the corruption branch and then returns `{ hasCorruption: true }`; only `require.main === module` exits non-zero. The contract says malformed JSONL should fail closed unless `--lenient` or `lenient:true` is used ([state_format.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/state_format.md:545), lines `545-548`).  
Recommendation: Make `reduceReviewState()` itself throw or refuse writes when corruption is present and `lenient` is false, then let the CLI translate that into exit code `2`.

**Iteration Summary**

Total findings: `3`  
Breakdown: `0 P0`, `1 P1`, `2 P2`

**Coverage Assessment**

Reviewed about `95%` of the requested focus area: the reducer logic, the relevant state-format contract, Step `4a` / legal-stop workflow wiring, the fail-closed test, and the shipped blocked-stop fixture.

**Confidence**

`high`

**Next Priorities**

Check reopened/resolved finding semantics in the reducer next. I did not fully validate whether a finding listed in `resolvedFindings` can be safely reopened later, or whether synthesis/report dedup uses the adjudicated `finalSeverity` consistently end to end.
