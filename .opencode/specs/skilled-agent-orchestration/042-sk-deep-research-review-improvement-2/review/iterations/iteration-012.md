---
iteration: 12
dimension: maintainability
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T10:26:42Z
completedAt: 2026-04-12T10:30:49Z
---

# Deep Review Iteration 012 — maintainability

**Focus:** Phase 005-006 test quality: review .opencode/skill/sk-improve-agent/scripts/tests/ (5 vitest files) and .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts plus coverage-graph-stress.vitest.ts for assertion quality, edge cases, and coverage of the documented contract.

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
session id: 019d813a-bac4-7972-a20c-8444ea134e29
--------
user
You are a senior code reviewer executing iteration 12 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: maintainability
FOCUS: Phase 005-006 test quality: review .opencode/skill/sk-improve-agent/scripts/tests/ (5 vitest files) and .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts plus coverage-graph-stress.vitest.ts for assertion quality, edge cases, and coverage of the documented contract.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for maintainability issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-012-NNN (sequential within this iteration)
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
I’m treating this as a focused maintainability review of the named test surfaces only. I’ll load the relevant review guidance, pull lightweight prior context from memory, then read the target vitest files carefully before I draft findings with exact evidence.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|rvw-2026-04-11T13-50-06Z|REQ-026|REQ-034|coverage-graph|sk-improve-agent" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep review maintainability of vitest assertion quality, edge cases, and documented contract coverage for .opencode/skill/sk-improve-agent/scripts/tests/ and .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts plus coverage-graph-stress.vitest.ts" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 513ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-UzrG25tx' (errno=Operation not permitted)
[
  {
    "skill": "sk-improve-agent",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/sk-improve-agent(explicit), !/sk-improve-agent(phrase), !sk-improve-agent(explicit), !sk-improve-agent(phrase), improve(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, folder"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !opencode, opencode(name), quality, system"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), opencode~, quality, review(name)"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), opencode, review(name)"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: document, documented~, opencode, quality, spec~"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !improve(multi), opencode~, quality, spec~"
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
Skill routing points strongly to `sk-code-review`, with `sk-code-opencode` as the repo-specific overlay. I’m loading just the relevant review guidance now, then I’ll walk the target test files line by line and map findings to the documented contract.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg --files .opencode/skill/sk-improve-agent/scripts/tests .opencode/skill/system-spec-kit/scripts/tests | rg '(coverage-graph-(integration|stress)\\.vitest\\.ts|\\.vitest\\.ts"'$)'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/tool-sanitizer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/utils-regressions.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/workspace-identity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/workflow-warning.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/backfill-frontmatter.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/alignment-drift-fixture-preservation.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/ascii-boxes.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts

codex
I have the review baseline loaded and the exact target set confirmed. Next I’m sizing the files and reading them in chunks so I can distinguish true contract gaps from harmless test style differences.
exec
/bin/zsh -lc 'wc -l .opencode/skill/sk-improve-agent/scripts/tests/*.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/references/test_quality_checklist.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     268 .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts
     184 .opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts
     202 .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts
     195 .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
     225 .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts
     480 .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
     412 .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts
    1966 total

 succeeded in 0ms:
---
title: Test Quality Checklist
description: Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.
---

# Test Quality Checklist

Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provide a systematic pass for test defects that reduce confidence in code correctness or mask regressions.

### Core Principle

Tests that cannot fail are worse than no tests. They create false confidence and hide real defects.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:coverage-quality -->
## 2. COVERAGE QUALITY

Flag:
- Test functions that execute code paths without any assertions (assertion-free execution).
- Test suites covering only happy-path scenarios with no error or edge case validation.
- Changed behavior that lacks a corresponding test update or addition.
- New public API surface introduced without any test coverage.
- Snapshot or golden-file tests that auto-pass because the baseline was never updated after behavior changes.

Review prompts:
- "Does every test function contain at least one meaningful assertion?"
- "Are failure modes and boundary conditions tested alongside the happy path?"
- "Do the tests cover the behavior that actually changed in this diff?"

Severity guidance:
- P0 for assertion-free test functions (silently passing tests that verify nothing).
- P1 for changed behavior with no corresponding test update.
- P2 for missing edge case coverage on low-risk paths.
<!-- /ANCHOR:coverage-quality -->

---

<!-- ANCHOR:test-structure -->
## 3. TEST STRUCTURE AND CLARITY

Flag:
- Test functions missing clear Arrange/Act/Assert separation.
- Test names that do not describe the scenario or expected outcome.
- Magic values in test data without comments explaining their significance.
- Multiple unrelated assertions in a single test function.
- Test setup that obscures the behavior under test.

Review prompts:
- "Can a reader determine what this test validates from the name alone?"
- "Is the test data traceable to a specific requirement or edge case?"
- "Would a failure message from this test pinpoint the broken behavior?"

Severity guidance:
- P2 default for structural clarity issues.
- P1 if poor structure makes regression detection unreliable (for example, a multi-assertion test where early failures mask later ones).
<!-- /ANCHOR:test-structure -->

---

<!-- ANCHOR:test-independence -->
## 4. TEST INDEPENDENCE AND RELIABILITY

Flag:
- Tests that depend on execution order or results from prior tests.
- Shared mutable state between test functions without proper reset.
- Tests that rely on wall-clock timing, network availability, or filesystem state.
- Missing cleanup or teardown for resources created during test setup.
- Tests that pass in isolation but fail when run with the full suite (or vice versa).

Review prompts:
- "Can each test run independently in any order and produce the same result?"
- "Does the test rely on external state that could change between runs?"
- "Is shared state properly isolated or reset between test functions?"

Severity guidance:
- P1 for flaky tests or tests with execution-order dependencies.
- P2 for missing teardown or cleanup that does not yet cause observed failures.
<!-- /ANCHOR:test-independence -->

---

<!-- ANCHOR:test-smells -->
## 5. TEST SMELL DETECTION

Flag:
- Tests tightly coupled to implementation details (breaking on safe refactors).
- Over-mocking that replaces the system under test with stubs, testing mock behavior instead of real behavior.
- Conditional logic (if/else, try/catch) inside test functions that creates untested branches.
- Catch blocks inside tests that swallow assertion failures and convert them to passing results.
- Copy-paste duplication across test functions without shared helpers or parameterized tests.

Review prompts:
- "Would a safe refactor (rename, extract method) break this test without changing behavior?"
- "Is this test verifying real system behavior or just mock wiring?"
- "Does any catch block inside a test risk swallowing an assertion error?"

Severity guidance:
- P0 for catch blocks that swallow assertion failures (tests that cannot fail).
- P1 for over-mocking that makes the test unable to detect real defects.
- P2 for implementation coupling or copy-paste duplication.
<!-- /ANCHOR:test-smells -->

---

<!-- ANCHOR:test-pyramid -->
## 6. TEST PYRAMID AWARENESS

Flag:
- Unit tests that require database, network, or filesystem access (should be integration tests).
- End-to-end tests for logic that can be validated at the unit level.
- New external service calls or integrations introduced without integration test coverage.
- Test suite dominated by one level (all unit, all E2E) with no balance.

Review prompts:
- "Is this test at the right level of the test pyramid for what it validates?"
- "Does a new external dependency have at least one integration-level test?"
- "Could this slow integration test be replaced by a faster unit test?"

Severity guidance:
- P2 default for test-level misplacement.
- P1 when wrong test level creates a confidence gap (for example, unit-testing an integration boundary without any integration test).
<!-- /ANCHOR:test-pyramid -->

---

<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Baseline review flow and severity output contract.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, performance, KISS, and DRY checks.
- [security_checklist.md](./security_checklist.md) - Security, authz, abuse, and privacy risk checks.
- [solid_checklist.md](./solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.

Overlay portability: pair this baseline with stack-specific test guidance from `sk-code-opencode`, `sk-code-web`, or `sk-code-full-stack`.
<!-- /ANCHOR:related-resources -->

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    12	const lineage = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs',
    15	)) as {
    16	  createLineageGraph: () => object;
    17	  recordCandidate: (lineagePath: string, candidate: object) => void;
    18	  getLineage: (lineagePath: string, candidateId: string) => object[];
    19	  getCandidatesByWave: (lineagePath: string, sessionId: string, waveIndex?: number) => object[];
    20	  getRootCandidates: (lineagePath: string) => object[];
    21	  getChildren: (lineagePath: string, parentCandidateId: string) => object[];
    22	};
    23	
    24	let tmpDir: string;
    25	let lineagePath: string;
    26	
    27	beforeEach(() => {
    28	  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lineage-test-'));
    29	  lineagePath = path.join(tmpDir, 'candidate-lineage.json');
    30	});
    31	
    32	afterEach(() => {
    33	  fs.rmSync(tmpDir, { recursive: true, force: true });
    34	});
    35	
    36	describe('candidate-lineage', () => {
    37	  describe('createLineageGraph', () => {
    38	    it('creates an empty graph', () => {
    39	      const graph = lineage.createLineageGraph() as { nodes: unknown[] };
    40	      expect(graph.nodes).toEqual([]);
    41	      expect(graph).toHaveProperty('createdAt');
    42	    });
    43	  });
    44	
    45	  describe('recordCandidate', () => {
    46	    it('creates file and records candidate', () => {
    47	      lineage.recordCandidate(lineagePath, {
    48	        candidateId: 'c-001',
    49	        sessionId: 's-001',
    50	        waveIndex: 0,
    51	        mutationType: 'section-reorder',
    52	      });
    53	
    54	      expect(fs.existsSync(lineagePath)).toBe(true);
    55	      const graph = JSON.parse(fs.readFileSync(lineagePath, 'utf8'));
    56	      expect(graph.nodes).toHaveLength(1);
    57	      expect(graph.nodes[0].candidateId).toBe('c-001');
    58	      expect(graph.nodes[0].parentCandidateId).toBeNull();
    59	    });
    60	
    61	    it('records parent-child relationships', () => {
    62	      lineage.recordCandidate(lineagePath, {
    63	        candidateId: 'c-001',
    64	        sessionId: 's-001',
    65	        waveIndex: 0,
    66	        mutationType: 'base',
    67	      });
    68	      lineage.recordCandidate(lineagePath, {
    69	        candidateId: 'c-002',
    70	        sessionId: 's-001',
    71	        waveIndex: 1,
    72	        mutationType: 'variant-a',
    73	        parentCandidateId: 'c-001',
    74	      });
    75	
    76	      const graph = JSON.parse(fs.readFileSync(lineagePath, 'utf8'));
    77	      expect(graph.nodes).toHaveLength(2);
    78	      expect(graph.nodes[1].parentCandidateId).toBe('c-001');
    79	    });
    80	  });
    81	
    82	  describe('getLineage', () => {
    83	    it('returns empty for non-existent file', () => {
    84	      expect(lineage.getLineage('/nonexistent/path.json', 'c-001')).toEqual([]);
    85	    });
    86	
    87	    it('returns single node for root candidate', () => {
    88	      lineage.recordCandidate(lineagePath, {
    89	        candidateId: 'c-001',
    90	        sessionId: 's-001',
    91	        waveIndex: 0,
    92	        mutationType: 'base',
    93	      });
    94	
    95	      const chain = lineage.getLineage(lineagePath, 'c-001');
    96	      expect(chain).toHaveLength(1);
    97	      expect((chain[0] as { candidateId: string }).candidateId).toBe('c-001');
    98	    });
    99	
   100	    it('traces full derivation chain from root to leaf', () => {
   101	      lineage.recordCandidate(lineagePath, {
   102	        candidateId: 'c-001',
   103	        sessionId: 's-001',
   104	        waveIndex: 0,
   105	        mutationType: 'base',
   106	      });
   107	      lineage.recordCandidate(lineagePath, {
   108	        candidateId: 'c-002',
   109	        sessionId: 's-001',
   110	        waveIndex: 1,
   111	        mutationType: 'variant-a',
   112	        parentCandidateId: 'c-001',
   113	      });
   114	      lineage.recordCandidate(lineagePath, {
   115	        candidateId: 'c-003',
   116	        sessionId: 's-001',
   117	        waveIndex: 2,
   118	        mutationType: 'variant-b',
   119	        parentCandidateId: 'c-002',
   120	      });
   121	
   122	      const chain = lineage.getLineage(lineagePath, 'c-003') as Array<{ candidateId: string }>;
   123	      expect(chain).toHaveLength(3);
   124	      expect(chain[0].candidateId).toBe('c-001');
   125	      expect(chain[1].candidateId).toBe('c-002');
   126	      expect(chain[2].candidateId).toBe('c-003');
   127	    });
   128	
   129	    it('returns empty for unknown candidate', () => {
   130	      lineage.recordCandidate(lineagePath, {
   131	        candidateId: 'c-001',
   132	        sessionId: 's-001',
   133	        waveIndex: 0,
   134	        mutationType: 'base',
   135	      });
   136	
   137	      expect(lineage.getLineage(lineagePath, 'c-unknown')).toEqual([]);
   138	    });
   139	  });
   140	
   141	  describe('getCandidatesByWave', () => {
   142	    it('filters by session and wave index', () => {
   143	      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
   144	      lineage.recordCandidate(lineagePath, { candidateId: 'c-002', sessionId: 's-001', waveIndex: 1, mutationType: 'b' });
   145	      lineage.recordCandidate(lineagePath, { candidateId: 'c-003', sessionId: 's-002', waveIndex: 0, mutationType: 'c' });
   146	
   147	      const wave0 = lineage.getCandidatesByWave(lineagePath, 's-001', 0);
   148	      expect(wave0).toHaveLength(1);
   149	      expect((wave0[0] as { candidateId: string }).candidateId).toBe('c-001');
   150	
   151	      const allS1 = lineage.getCandidatesByWave(lineagePath, 's-001');
   152	      expect(allS1).toHaveLength(2);
   153	    });
   154	  });
   155	
   156	  describe('getRootCandidates', () => {
   157	    it('returns only candidates with no parent', () => {
   158	      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
   159	      lineage.recordCandidate(lineagePath, { candidateId: 'c-002', sessionId: 's-001', waveIndex: 1, mutationType: 'b', parentCandidateId: 'c-001' });
   160	
   161	      const roots = lineage.getRootCandidates(lineagePath);
   162	      expect(roots).toHaveLength(1);
   163	      expect((roots[0] as { candidateId: string }).candidateId).toBe('c-001');
   164	    });
   165	  });
   166	
   167	  describe('getChildren', () => {
   168	    it('returns direct children of a candidate', () => {
   169	      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
   170	      lineage.recordCandidate(lineagePath, { candidateId: 'c-002', sessionId: 's-001', waveIndex: 1, mutationType: 'b', parentCandidateId: 'c-001' });
   171	      lineage.recordCandidate(lineagePath, { candidateId: 'c-003', sessionId: 's-001', waveIndex: 1, mutationType: 'c', parentCandidateId: 'c-001' });
   172	
   173	      const children = lineage.getChildren(lineagePath, 'c-001');
   174	      expect(children).toHaveLength(2);
   175	    });
   176	
   177	    it('returns empty for leaf candidates', () => {
   178	      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
   179	
   180	      const children = lineage.getChildren(lineagePath, 'c-001');
   181	      expect(children).toEqual([]);
   182	    });
   183	  });
   184	});

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

 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const stability = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs',
    13	)) as {
    14	  MIN_REPLAY_COUNT_DEFAULT: number;
    15	  DEFAULT_REPLAY_COUNT: number;
    16	  DEFAULT_WARNING_THRESHOLD: number;
    17	  DEFAULT_SESSION_COUNT_THRESHOLD: number;
    18	  DIMENSIONS: readonly string[];
    19	  mean: (values: number[]) => number;
    20	  stddev: (values: number[]) => number;
    21	  stabilityCoefficient: (values: number[]) => number;
    22	  measureStability:
    23	    (results: object[], config?: object) =>
    24	      | { dimensions: Record<string, { coefficient: number; mean: number; stddev: number; samples: number }>; stable: boolean; warnings: string[] }
    25	      | { state: string; replayCount: number; minRequired: number; reason: string };
    26	  isStable: (stabilityResult: { state?: string; dimensions?: Record<string, { coefficient: number }> }, maxVariance?: number) => boolean;
    27	  generateWeightRecommendations: (sessionHistory: object[], currentWeights: Record<string, number>, config?: object) => { recommendations: Record<string, number> | null; sufficient: boolean; report: string };
    28	};
    29	
    30	describe('benchmark-stability', () => {
    31	  describe('constants', () => {
    32	    it('has default minimum replay count of 3', () => {
    33	      expect(stability.MIN_REPLAY_COUNT_DEFAULT).toBe(3);
    34	    });
    35	
    36	    it('has default replay count of 3', () => {
    37	      expect(stability.DEFAULT_REPLAY_COUNT).toBe(3);
    38	    });
    39	
    40	    it('has default warning threshold of 0.95', () => {
    41	      expect(stability.DEFAULT_WARNING_THRESHOLD).toBe(0.95);
    42	    });
    43	
    44	    it('has default session count threshold of 5', () => {
    45	      expect(stability.DEFAULT_SESSION_COUNT_THRESHOLD).toBe(5);
    46	    });
    47	
    48	    it('defines all 5 dimensions', () => {
    49	      expect(stability.DIMENSIONS).toHaveLength(5);
    50	      expect(stability.DIMENSIONS).toContain('structural');
    51	      expect(stability.DIMENSIONS).toContain('ruleCoherence');
    52	      expect(stability.DIMENSIONS).toContain('integration');
    53	      expect(stability.DIMENSIONS).toContain('outputQuality');
    54	      expect(stability.DIMENSIONS).toContain('systemFitness');
    55	    });
    56	  });
    57	
    58	  describe('math helpers', () => {
    59	    it('computes mean correctly', () => {
    60	      expect(stability.mean([1, 2, 3, 4, 5])).toBe(3);
    61	      expect(stability.mean([])).toBe(0);
    62	      expect(stability.mean([10])).toBe(10);
    63	    });
    64	
    65	    it('computes stddev correctly', () => {
    66	      expect(stability.stddev([])).toBe(0);
    67	      expect(stability.stddev([5])).toBe(0);
    68	      // stddev of [2, 4, 4, 4, 5, 5, 7, 9] should be ~2.14
    69	      const sd = stability.stddev([2, 4, 4, 4, 5, 5, 7, 9]);
    70	      expect(sd).toBeGreaterThan(2);
    71	      expect(sd).toBeLessThan(2.5);
    72	    });
    73	
    74	    it('computes stability coefficient — perfect stability = 1.0', () => {
    75	      expect(stability.stabilityCoefficient([90, 90, 90])).toBe(1.0);
    76	    });
    77	
    78	    it('computes stability coefficient — high variance = low coefficient', () => {
    79	      const coeff = stability.stabilityCoefficient([50, 90, 10, 80]);
    80	      expect(coeff).toBeLessThan(0.7);
    81	    });
    82	
    83	    it('returns 1.0 for zero mean', () => {
    84	      expect(stability.stabilityCoefficient([0, 0, 0])).toBe(1.0);
    85	    });
    86	  });
    87	
    88	  describe('measureStability', () => {
    89	    it('returns insufficientSample for 1 replay', () => {
    90	      expect(stability.measureStability([
    91	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
    92	      ])).toEqual({
    93	        state: 'insufficientSample',
    94	        replayCount: 1,
    95	        minRequired: 3,
    96	        reason: 'Benchmark stability requires at least 3 replays before verdict',
    97	      });
    98	    });
    99	
   100	    it('returns insufficientSample for 2 replays', () => {
   101	      expect(stability.measureStability([
   102	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   103	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   104	      ])).toEqual({
   105	        state: 'insufficientSample',
   106	        replayCount: 2,
   107	        minRequired: 3,
   108	        reason: 'Benchmark stability requires at least 3 replays before verdict',
   109	      });
   110	    });
   111	
   112	    it('returns stable for identical replays', () => {
   113	      const results = [
   114	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   115	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   116	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   117	      ];
   118	
   119	      const result = stability.measureStability(results);
   120	      if ('state' in result) {
   121	        throw new Error('Expected full stability verdict for 3 replays');
   122	      }
   123	      expect(result.stable).toBe(true);
   124	      expect(result.warnings).toHaveLength(0);
   125	      expect(result.dimensions.structural.coefficient).toBe(1.0);
   126	    });
   127	
   128	    it('detects instability and emits warnings', () => {
   129	      const results = [
   130	        { scores: { structural: 95, ruleCoherence: 90, integration: 50, outputQuality: 88, systemFitness: 93 } },
   131	        { scores: { structural: 95, ruleCoherence: 90, integration: 90, outputQuality: 88, systemFitness: 93 } },
   132	        { scores: { structural: 95, ruleCoherence: 90, integration: 70, outputQuality: 88, systemFitness: 93 } },
   133	      ];
   134	
   135	      const result = stability.measureStability(results);
   136	      if ('state' in result) {
   137	        throw new Error('Expected full stability verdict for 3 replays');
   138	      }
   139	      expect(result.stable).toBe(false);
   140	      expect(result.warnings.length).toBeGreaterThan(0);
   141	      expect(result.warnings[0]).toContain('stabilityWarning');
   142	      expect(result.warnings[0]).toContain('integration');
   143	    });
   144	
   145	    it('handles dimension array format', () => {
   146	      const results = [
   147	        { dimensions: [{ name: 'structural', score: 95 }, { name: 'ruleCoherence', score: 90 }] },
   148	        { dimensions: [{ name: 'structural', score: 95 }, { name: 'ruleCoherence', score: 90 }] },
   149	        { dimensions: [{ name: 'structural', score: 95 }, { name: 'ruleCoherence', score: 90 }] },
   150	      ];
   151	
   152	      const result = stability.measureStability(results);
   153	      if ('state' in result) {
   154	        throw new Error('Expected full stability verdict for 3 replays');
   155	      }
   156	      expect(result.dimensions.structural.coefficient).toBe(1.0);
   157	    });
   158	
   159	    it('returns insufficientSample for empty results', () => {
   160	      const result = stability.measureStability([]);
   161	      expect(result).toEqual({
   162	        state: 'insufficientSample',
   163	        replayCount: 0,
   164	        minRequired: 3,
   165	        reason: 'Benchmark stability requires at least 3 replays before verdict',
   166	      });
   167	    });
   168	
   169	    it('respects custom minReplayCount override', () => {
   170	      const result = stability.measureStability([
   171	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   172	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   173	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   174	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   175	      ], { minReplayCount: 5 });
   176	
   177	      expect(result).toEqual({
   178	        state: 'insufficientSample',
   179	        replayCount: 4,
   180	        minRequired: 5,
   181	        reason: 'Benchmark stability requires at least 5 replays before verdict',
   182	      });
   183	    });
   184	  });
   185	
   186	  describe('isStable', () => {
   187	    it('accepts results with low variance', () => {
   188	      const result = stability.measureStability([
   189	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   190	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   191	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   192	      ]);
   193	      expect(stability.isStable(result)).toBe(true);
   194	    });
   195	
   196	    it('rejects results with high variance', () => {
   197	      const result = stability.measureStability([
   198	        { scores: { structural: 50, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   199	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   200	        { scores: { structural: 70, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   201	      ]);
   202	      expect(stability.isStable(result, 0.01)).toBe(false);
   203	    });
   204	
   205	    it('treats insufficientSample as not stable', () => {
   206	      const result = stability.measureStability([
   207	        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
   208	      ]);
   209	      expect(stability.isStable(result)).toBe(false);
   210	    });
   211	  });
   212	
   213	  describe('generateWeightRecommendations', () => {
   214	    it('returns insufficient when session count is below threshold', () => {
   215	      const result = stability.generateWeightRecommendations(
   216	        [{ scores: { structural: 90 } }],
   217	        { structural: 0.20, ruleCoherence: 0.25, integration: 0.25, outputQuality: 0.15, systemFitness: 0.15 },
   218	      );
   219	      expect(result.sufficient).toBe(false);
   220	      expect(result.recommendations).toBeNull();

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts | sed -n '221,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   221	      expect(result.report).toContain('Insufficient');
   222	    });
   223	
   224	    it('generates recommendations when sufficient sessions exist', () => {
   225	      const sessions = Array.from({ length: 6 }, (_, i) => ({
   226	        scores: {
   227	          structural: 95 - i,
   228	          ruleCoherence: 70 + i,
   229	          integration: 92,
   230	          outputQuality: 88,
   231	          systemFitness: 93,
   232	        },
   233	      }));
   234	
   235	      const currentWeights = {
   236	        structural: 0.20,
   237	        ruleCoherence: 0.25,
   238	        integration: 0.25,
   239	        outputQuality: 0.15,
   240	        systemFitness: 0.15,
   241	      };
   242	
   243	      const result = stability.generateWeightRecommendations(sessions, currentWeights);
   244	      expect(result.sufficient).toBe(true);
   245	      expect(result.recommendations).toBeDefined();
   246	      expect(result.report).toContain('Weight Optimization Report');
   247	      expect(result.report).toContain('advisory only');
   248	
   249	      // All weights should sum to approximately 1.0
   250	      const totalWeight = Object.values(result.recommendations!).reduce((s, w) => s + w, 0);
   251	      expect(totalWeight).toBeGreaterThan(0.98);
   252	      expect(totalWeight).toBeLessThan(1.02);
   253	    });
   254	
   255	    it('respects custom session count threshold', () => {
   256	      const sessions = Array.from({ length: 3 }, () => ({
   257	        scores: { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 93 },
   258	      }));
   259	
   260	      const result = stability.generateWeightRecommendations(
   261	        sessions,
   262	        { structural: 0.20, ruleCoherence: 0.25, integration: 0.25, outputQuality: 0.15, systemFitness: 0.15 },
   263	        { sessionCountThreshold: 3 },
   264	      );
   265	      expect(result.sufficient).toBe(true);
   266	    });
   267	  });
   268	});

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
    12	const coverage = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs',
    15	)) as {
    16	  LOOP_TYPE: string;
    17	  MIN_TRAJECTORY_POINTS: number;
    18	  DEFAULT_STABILITY_DELTA: number;
    19	  createCoverageGraph: () => object;
    20	  recordMutation: (coveragePath: string, mutation: object) => void;
    21	  getExhaustedMutations: (coveragePath: string) => object[];
    22	  markExhausted: (coveragePath: string, dimension: string, mutationType: string) => void;
    23	  getMutationCoverage: (coveragePath: string) => { dimensions: Record<string, { tried: string[]; exhausted: string[]; triedCount: number; exhaustedCount: number }> };
    24	  recordTrajectory: (coveragePath: string, dataPoint: object) => void;
    25	  getTrajectory: (coveragePath: string) => object[];
    26	  checkConvergenceEligibility: (coveragePath: string, options?: object) => { canConverge: boolean; reason: string; dataPoints: number };
    27	};
    28	
    29	let tmpDir: string;
    30	let coveragePath: string;
    31	
    32	beforeEach(() => {
    33	  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-test-'));
    34	  coveragePath = path.join(tmpDir, 'coverage-graph.json');
    35	});
    36	
    37	afterEach(() => {
    38	  fs.rmSync(tmpDir, { recursive: true, force: true });
    39	});
    40	
    41	describe('mutation-coverage', () => {
    42	  describe('constants', () => {
    43	    it('uses improvement loop type for namespace isolation', () => {
    44	      expect(coverage.LOOP_TYPE).toBe('improvement');
    45	    });
    46	
    47	    it('requires minimum 3 trajectory data points', () => {
    48	      expect(coverage.MIN_TRAJECTORY_POINTS).toBe(3);
    49	    });
    50	
    51	    it('has default stability delta of 2', () => {
    52	      expect(coverage.DEFAULT_STABILITY_DELTA).toBe(2);
    53	    });
    54	  });
    55	
    56	  describe('createCoverageGraph', () => {
    57	    it('creates an empty graph with improvement loop type', () => {
    58	      const graph = coverage.createCoverageGraph() as { loopType: string; mutations: unknown[]; exhausted: unknown[]; trajectory: unknown[] };
    59	      expect(graph.loopType).toBe('improvement');
    60	      expect(graph.mutations).toEqual([]);
    61	      expect(graph.exhausted).toEqual([]);
    62	      expect(graph.trajectory).toEqual([]);
    63	    });
    64	  });
    65	
    66	  describe('recordMutation', () => {
    67	    it('creates file and records mutation', () => {
    68	      coverage.recordMutation(coveragePath, {
    69	        dimension: 'structural',
    70	        mutationType: 'section-reorder',
    71	        candidateId: 'c-001',
    72	        iteration: 1,
    73	      });
    74	
    75	      expect(fs.existsSync(coveragePath)).toBe(true);
    76	      const graph = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    77	      expect(graph.mutations).toHaveLength(1);
    78	      expect(graph.mutations[0].dimension).toBe('structural');
    79	      expect(graph.mutations[0].mutationType).toBe('section-reorder');
    80	    });
    81	
    82	    it('appends to existing mutations', () => {
    83	      coverage.recordMutation(coveragePath, { dimension: 'structural', mutationType: 'a', candidateId: '1', iteration: 1 });
    84	      coverage.recordMutation(coveragePath, { dimension: 'ruleCoherence', mutationType: 'b', candidateId: '2', iteration: 2 });
    85	
    86	      const graph = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    87	      expect(graph.mutations).toHaveLength(2);
    88	    });
    89	  });
    90	
    91	  describe('markExhausted and getExhaustedMutations', () => {
    92	    it('marks a mutation type as exhausted', () => {
    93	      coverage.markExhausted(coveragePath, 'structural', 'section-reorder');
    94	      const exhausted = coverage.getExhaustedMutations(coveragePath);
    95	      expect(exhausted).toHaveLength(1);
    96	      expect((exhausted[0] as { dimension: string }).dimension).toBe('structural');
    97	      expect((exhausted[0] as { mutationType: string }).mutationType).toBe('section-reorder');
    98	    });
    99	
   100	    it('prevents duplicate exhaustion entries', () => {
   101	      coverage.markExhausted(coveragePath, 'structural', 'section-reorder');
   102	      coverage.markExhausted(coveragePath, 'structural', 'section-reorder');
   103	      const exhausted = coverage.getExhaustedMutations(coveragePath);
   104	      expect(exhausted).toHaveLength(1);
   105	    });
   106	
   107	    it('returns empty for non-existent file', () => {
   108	      const exhausted = coverage.getExhaustedMutations('/nonexistent/path.json');
   109	      expect(exhausted).toEqual([]);
   110	    });
   111	  });
   112	
   113	  describe('getMutationCoverage', () => {
   114	    it('returns coverage stats per dimension', () => {
   115	      coverage.recordMutation(coveragePath, { dimension: 'structural', mutationType: 'a', candidateId: '1', iteration: 1 });
   116	      coverage.recordMutation(coveragePath, { dimension: 'structural', mutationType: 'b', candidateId: '2', iteration: 2 });
   117	      coverage.recordMutation(coveragePath, { dimension: 'integration', mutationType: 'c', candidateId: '3', iteration: 3 });
   118	      coverage.markExhausted(coveragePath, 'structural', 'a');
   119	
   120	      const stats = coverage.getMutationCoverage(coveragePath);
   121	      expect(stats.dimensions.structural.triedCount).toBe(2);
   122	      expect(stats.dimensions.structural.exhaustedCount).toBe(1);
   123	      expect(stats.dimensions.integration.triedCount).toBe(1);
   124	    });
   125	
   126	    it('returns empty dimensions for non-existent file', () => {
   127	      const stats = coverage.getMutationCoverage('/nonexistent/path.json');
   128	      expect(stats.dimensions).toEqual({});
   129	    });
   130	  });
   131	
   132	  describe('trajectory', () => {
   133	    it('records and retrieves trajectory data', () => {
   134	      coverage.recordTrajectory(coveragePath, {
   135	        iteration: 1,
   136	        scores: { structural: 90, ruleCoherence: 85, integration: 88, outputQuality: 92, systemFitness: 95 },
   137	      });
   138	
   139	      const trajectory = coverage.getTrajectory(coveragePath);
   140	      expect(trajectory).toHaveLength(1);
   141	      expect((trajectory[0] as { iteration: number }).iteration).toBe(1);
   142	    });
   143	
   144	    it('returns empty array for non-existent file', () => {
   145	      expect(coverage.getTrajectory('/nonexistent/path.json')).toEqual([]);
   146	    });
   147	  });
   148	
   149	  describe('checkConvergenceEligibility', () => {
   150	    it('rejects convergence with insufficient data points', () => {
   151	      coverage.recordTrajectory(coveragePath, {
   152	        iteration: 1,
   153	        scores: { structural: 90, ruleCoherence: 85, integration: 88, outputQuality: 92, systemFitness: 95 },
   154	      });
   155	
   156	      const result = coverage.checkConvergenceEligibility(coveragePath);
   157	      expect(result.canConverge).toBe(false);
   158	      expect(result.reason).toContain('Insufficient');
   159	      expect(result.dataPoints).toBe(1);
   160	    });
   161	
   162	    it('allows convergence with stable scores across 3+ points', () => {
   163	      for (let i = 1; i <= 3; i++) {
   164	        coverage.recordTrajectory(coveragePath, {
   165	          iteration: i,
   166	          scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
   167	        });
   168	      }
   169	
   170	      const result = coverage.checkConvergenceEligibility(coveragePath);
   171	      expect(result.canConverge).toBe(true);
   172	      expect(result.dataPoints).toBe(3);
   173	    });
   174	
   175	    it('rejects convergence with unstable dimensions', () => {
   176	      coverage.recordTrajectory(coveragePath, {
   177	        iteration: 1,
   178	        scores: { structural: 80, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
   179	      });
   180	      coverage.recordTrajectory(coveragePath, {
   181	        iteration: 2,
   182	        scores: { structural: 85, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
   183	      });
   184	      coverage.recordTrajectory(coveragePath, {
   185	        iteration: 3,
   186	        scores: { structural: 90, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
   187	      });
   188	
   189	      const result = coverage.checkConvergenceEligibility(coveragePath);
   190	      expect(result.canConverge).toBe(false);
   191	      expect(result.reason).toContain('Unstable');
   192	      expect(result.reason).toContain('structural');
   193	    });
   194	  });
   195	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import path from 'node:path';
     2	import fs from 'node:fs';
     3	import os from 'node:os';
     4	import { createRequire } from 'node:module';
     5	import { fileURLToPath } from 'node:url';
     6	import { describe, expect, it, beforeEach, afterEach } from 'vitest';
     7	
     8	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     9	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
    10	const require = createRequire(import.meta.url);
    11	
    12	const detector = require(path.join(
    13	  WORKSPACE_ROOT,
    14	  '.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs',
    15	)) as {
    16	  HARD_DIMENSIONS: readonly string[];
    17	  SOFT_DIMENSIONS: readonly string[];
    18	  DEFAULT_IMPROVEMENT_THRESHOLD: number;
    19	  MIN_DATA_POINTS_DEFAULT: number;
    20	  DEFAULT_REGRESSION_THRESHOLDS: Readonly<{ hard: number; soft: number }>;
    21	  detectTradeOffs:
    22	    (trajectoryData: object[], options?: object) =>
    23	      | Array<{ improving: string; regressing: string; improvementDelta: number; regressionDelta: number; iteration: number }>
    24	      | { state: string; dataPoints: number; minRequired: number; reason: string };
    25	  getTrajectory: (journalPath: string) => object[];
    26	  checkParetoDominance: (candidateScores: Record<string, number>, baselineScores: Record<string, number>) => { dominated: boolean; dominatingDimensions: string[]; regressions: string[] };
    27	};
    28	
    29	let tmpDir: string;
    30	
    31	beforeEach(() => {
    32	  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tradeoff-test-'));
    33	});
    34	
    35	afterEach(() => {
    36	  fs.rmSync(tmpDir, { recursive: true, force: true });
    37	});
    38	
    39	describe('trade-off-detector', () => {
    40	  describe('constants', () => {
    41	    it('defines hard dimensions', () => {
    42	      expect(detector.HARD_DIMENSIONS).toContain('structural');
    43	      expect(detector.HARD_DIMENSIONS).toContain('integration');
    44	      expect(detector.HARD_DIMENSIONS).toContain('systemFitness');
    45	    });
    46	
    47	    it('defines soft dimensions', () => {
    48	      expect(detector.SOFT_DIMENSIONS).toContain('ruleCoherence');
    49	      expect(detector.SOFT_DIMENSIONS).toContain('outputQuality');
    50	    });
    51	
    52	    it('has default improvement threshold of 3', () => {
    53	      expect(detector.DEFAULT_IMPROVEMENT_THRESHOLD).toBe(3);
    54	    });
    55	
    56	    it('has default minimum data points of 3', () => {
    57	      expect(detector.MIN_DATA_POINTS_DEFAULT).toBe(3);
    58	    });
    59	
    60	    it('has default regression thresholds', () => {
    61	      expect(detector.DEFAULT_REGRESSION_THRESHOLDS.hard).toBe(-3);
    62	      expect(detector.DEFAULT_REGRESSION_THRESHOLDS.soft).toBe(-5);
    63	    });
    64	  });
    65	
    66	  describe('detectTradeOffs', () => {
    67	    it('returns insufficientData for 2-point trajectories', () => {
    68	      expect(detector.detectTradeOffs([
    69	        { iteration: 1, scores: { structural: 90, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
    70	        { iteration: 2, scores: { structural: 85, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
    71	      ])).toEqual({
    72	        state: 'insufficientData',
    73	        dataPoints: 2,
    74	        minRequired: 3,
    75	        reason: 'Trade-off detection requires at least 3 data points before analysis',
    76	      });
    77	    });
    78	
    79	    it('detects trade-off when 3-point trajectory has a hard regression and another improvement', () => {
    80	      const trajectory = [
    81	        { iteration: 1, scores: { structural: 92, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
    82	        { iteration: 2, scores: { structural: 91, ruleCoherence: 82, integration: 90, outputQuality: 85, systemFitness: 90 } },
    83	        { iteration: 3, scores: { structural: 85, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
    84	      ];
    85	
    86	      const tradeOffs = detector.detectTradeOffs(trajectory);
    87	      expect(Array.isArray(tradeOffs)).toBe(true);
    88	      if (!Array.isArray(tradeOffs)) {
    89	        throw new Error('Expected trade-off array for 3-point trajectory');
    90	      }
    91	      expect(tradeOffs.length).toBeGreaterThan(0);
    92	
    93	      const found = tradeOffs.find(
    94	        (t) => t.improving === 'ruleCoherence' && t.regressing === 'structural'
    95	      );
    96	      expect(found).toBeDefined();
    97	      expect(found!.improvementDelta).toBe(8);
    98	      expect(found!.regressionDelta).toBe(-6);
    99	    });
   100	
   101	    it('does not flag when both dimensions improve', () => {
   102	      const trajectory = [
   103	        { iteration: 1, scores: { structural: 85, ruleCoherence: 80, integration: 88, outputQuality: 85, systemFitness: 88 } },
   104	        { iteration: 2, scores: { structural: 88, ruleCoherence: 84, integration: 90, outputQuality: 87, systemFitness: 90 } },
   105	        { iteration: 3, scores: { structural: 92, ruleCoherence: 88, integration: 92, outputQuality: 90, systemFitness: 93 } },
   106	      ];
   107	
   108	      const tradeOffs = detector.detectTradeOffs(trajectory);
   109	      expect(tradeOffs).toEqual([]);
   110	    });
   111	
   112	    it('does not flag when regressions are below threshold', () => {
   113	      const trajectory = [
   114	        { iteration: 1, scores: { structural: 90, ruleCoherence: 85, integration: 90, outputQuality: 85, systemFitness: 90 } },
   115	        { iteration: 2, scores: { structural: 90, ruleCoherence: 86, integration: 90, outputQuality: 85, systemFitness: 90 } },
   116	        { iteration: 3, scores: { structural: 89, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
   117	      ];
   118	
   119	      const tradeOffs = detector.detectTradeOffs(trajectory);
   120	      expect(tradeOffs).toEqual([]);
   121	    });
   122	
   123	    it('respects custom thresholds', () => {
   124	      const trajectory = [
   125	        { iteration: 1, scores: { structural: 90, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
   126	        { iteration: 2, scores: { structural: 89, ruleCoherence: 82, integration: 90, outputQuality: 85, systemFitness: 90 } },
   127	        { iteration: 3, scores: { structural: 85, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
   128	      ];
   129	
   130	      // With very strict thresholds, even -5 should not trigger
   131	      const tradeOffs = detector.detectTradeOffs(trajectory, {
   132	        regressionThresholds: { hard: -10, soft: -10 },
   133	      });
   134	      expect(tradeOffs).toEqual([]);
   135	    });
   136	
   137	    it('respects custom minDataPoints override', () => {
   138	      const trajectory = [
   139	        { iteration: 1, scores: { structural: 90, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
   140	        { iteration: 2, scores: { structural: 89, ruleCoherence: 82, integration: 90, outputQuality: 85, systemFitness: 90 } },
   141	        { iteration: 3, scores: { structural: 88, ruleCoherence: 84, integration: 90, outputQuality: 85, systemFitness: 90 } },
   142	        { iteration: 4, scores: { structural: 83, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
   143	      ];
   144	
   145	      expect(detector.detectTradeOffs(trajectory, { minDataPoints: 5 })).toEqual({
   146	        state: 'insufficientData',
   147	        dataPoints: 4,
   148	        minRequired: 5,
   149	        reason: 'Trade-off detection requires at least 5 data points before analysis',
   150	      });
   151	    });
   152	
   153	    it('handles empty trajectory gracefully', () => {
   154	      const tradeOffs = detector.detectTradeOffs(null as unknown as object[]);
   155	      expect(tradeOffs).toEqual({
   156	        state: 'insufficientData',
   157	        dataPoints: 0,
   158	        minRequired: 3,
   159	        reason: 'Trade-off detection requires at least 3 data points before analysis',
   160	      });
   161	    });
   162	  });
   163	
   164	  describe('getTrajectory', () => {
   165	    it('returns empty for non-existent file', () => {
   166	      expect(detector.getTrajectory('/nonexistent/path.jsonl')).toEqual([]);
   167	    });
   168	
   169	    it('extracts scores from candidate_scored journal events', () => {
   170	      const journalPath = path.join(tmpDir, 'journal.jsonl');
   171	      const events = [
   172	        {
   173	          eventType: 'candidate_scored',
   174	          iteration: 1,
   175	          details: {
   176	            dimensions: [
   177	              { name: 'structural', score: 90 },
   178	              { name: 'ruleCoherence', score: 85 },
   179	            ],
   180	          },
   181	        },
   182	        {
   183	          eventType: 'session_start',
   184	          iteration: 0,
   185	        },
   186	      ];
   187	
   188	      fs.writeFileSync(
   189	        journalPath,
   190	        events.map((e) => JSON.stringify(e)).join('\n') + '\n',
   191	        'utf8'
   192	      );
   193	
   194	      const trajectory = detector.getTrajectory(journalPath) as Array<{ iteration: number; scores: Record<string, number> }>;
   195	      expect(trajectory).toHaveLength(1);
   196	      expect(trajectory[0].scores.structural).toBe(90);
   197	    });
   198	  });
   199	
   200	  describe('checkParetoDominance', () => {
   201	    it('detects Pareto-dominated candidate', () => {
   202	      const candidate = { structural: 85, ruleCoherence: 80, integration: 88, outputQuality: 82, systemFitness: 90 };
   203	      const baseline = { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 95 };
   204	
   205	      const result = detector.checkParetoDominance(candidate, baseline);
   206	      expect(result.dominated).toBe(true);
   207	      expect(result.regressions.length).toBeGreaterThan(0);
   208	    });
   209	
   210	    it('does not flag when candidate improves at least one dimension', () => {
   211	      const candidate = { structural: 95, ruleCoherence: 80, integration: 88, outputQuality: 82, systemFitness: 90 };
   212	      const baseline = { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 95 };
   213	
   214	      const result = detector.checkParetoDominance(candidate, baseline);
   215	      expect(result.dominated).toBe(false);
   216	    });
   217	
   218	    it('detects equal candidates as non-dominated', () => {
   219	      const scores = { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 95 };
   220	
   221	      const result = detector.checkParetoDominance(scores, scores);
   222	      expect(result.dominated).toBe(false);
   223	    });
   224	  });
   225	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts | sed -n '241,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts | sed -n '241,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "MIN_REPLAY_COUNT_DEFAULT|DEFAULT_WARNING_THRESHOLD|generateWeightRecommendations|sessionCountThreshold|Trade-off detection requires|STOP_REASONS|VALID_EVENT_TYPES|markExhausted|checkConvergenceEligibility|parentCandidateId" .opencode/skill/sk-improve-agent/scripts/*.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:20:const MIN_REPLAY_COUNT_DEFAULT = 3;
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:21:const DEFAULT_REPLAY_COUNT = MIN_REPLAY_COUNT_DEFAULT;
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:28:const DEFAULT_WARNING_THRESHOLD = 0.95;
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:62:  return MIN_REPLAY_COUNT_DEFAULT;
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:123:    warningThreshold: DEFAULT_WARNING_THRESHOLD,
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:227: * @param {object} [config] - { sessionCountThreshold? }
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:230:function generateWeightRecommendations(sessionHistory, currentWeights, config) {
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:232:    sessionCountThreshold: DEFAULT_SESSION_COUNT_THRESHOLD,
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:236:  if (!sessionHistory || sessionHistory.length < opts.sessionCountThreshold) {
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:240:      report: `Insufficient session history: ${(sessionHistory || []).length} < ${opts.sessionCountThreshold}. Recommendations require at least ${opts.sessionCountThreshold} sessions.`,
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:327:  MIN_REPLAY_COUNT_DEFAULT,
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:329:  DEFAULT_WARNING_THRESHOLD,
.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:337:  generateWeightRecommendations,
.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:116:function markExhausted(coveragePath, dimension, mutationType) {
.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:229:function checkConvergenceEligibility(coveragePath, options) {
.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:286:  markExhausted,
.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:290:  checkConvergenceEligibility,
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21:const STOP_REASONS = Object.freeze({
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47:const VALID_EVENT_TYPES = Object.freeze([
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:87:  } else if (!VALID_EVENT_TYPES.includes(event.eventType)) {
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:88:    errors.push(`Invalid eventType: "${event.eventType}". Valid types: ${VALID_EVENT_TYPES.join(', ')}`);
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:94:    } else if (!Object.values(STOP_REASONS).includes(event.details.stopReason)) {
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:95:      errors.push(`Invalid stopReason: "${event.details.stopReason}". Valid reasons: ${Object.values(STOP_REASONS).join(', ')}`);
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:211:  STOP_REASONS,
.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:213:  VALID_EVENT_TYPES,
.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:94:      reason: `Trade-off detection requires at least ${minDataPoints} data points before analysis`,
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:51: * @param {object} candidate - { candidateId, sessionId, waveIndex, mutationType, parentCandidateId?, iteration?, scores? }
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:61:    parentCandidateId: candidate.parentCandidateId || null,
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:102:    if (!current.parentCandidateId) {
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:105:    current = nodeMap.get(current.parentCandidateId);
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:148:  return graph.nodes.filter((node) => !node.parentCandidateId);
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:155: * @param {string} parentCandidateId - Parent candidate ID
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:158:function getChildren(lineagePath, parentCandidateId) {
.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:165:    (node) => node.parentCandidateId === parentCandidateId

exec
/bin/zsh -lc "rg -n \"coverage-graph-db|VALID_RELATIONS|SCHEMA_SQL|EVIDENCE_FOR|EVIDENCES|CHECK\\(source_id "'!= target_id'"\\)|SOURCE_DIVERSITY_THRESHOLD|EVIDENCE_DEPTH_THRESHOLD\" .opencode/skill/system-spec-kit/scripts -g '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:133:const SOURCE_DIVERSITY_THRESHOLD = 1.5;
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:140:const EVIDENCE_DEPTH_THRESHOLD = 1.5;
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:372:      sourceDiversity: { pass: false, value: 0, threshold: SOURCE_DIVERSITY_THRESHOLD },
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:373:      evidenceDepth: { pass: false, value: 0, threshold: EVIDENCE_DEPTH_THRESHOLD },
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:381:    pass: diversity >= SOURCE_DIVERSITY_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:383:    threshold: SOURCE_DIVERSITY_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:387:    pass: depth >= EVIDENCE_DEPTH_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:389:    threshold: EVIDENCE_DEPTH_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:405:  SOURCE_DIVERSITY_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:406:  EVIDENCE_DEPTH_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:40:  EVIDENCE_FOR: 1.0,

codex
I’ve finished the first pass over the seven target suites. Now I’m cross-checking the tests against the actual CJS/TS contracts they claim to guard, because a few assertions already look like “comment-backed” checks rather than executable guarantees.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/mcp_server/lib/coverage-graph/coverage-graph-db.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs | sed -n '1,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/scripts/mcp_server/lib/coverage-graph/coverage-graph-db.ts: No such file or directory

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
   261	      count: scores.length,
   262	    };
   263	  }
   264	
   265	  // Simple heuristic: dimensions with consistently low scores deserve higher weight;
   266	  // dimensions with high variance should be investigated before weight changes.
   267	  const recommended = {};
   268	  let totalWeight = 0;
   269	
   270	  for (const dim of DIMENSIONS) {
   271	    const current = currentWeights[dim] || 0.20;
   272	    const dimData = dimensionVariances[dim];
   273	
   274	    // If a dimension consistently scores low (mean < 80), suggest increasing weight
   275	    // If it consistently scores high (mean > 95), suggest slightly decreasing weight
   276	    let adjustment = 0;
   277	    if (dimData.mean < 80 && dimData.count >= 3) {
   278	      adjustment = 0.02;
   279	    } else if (dimData.mean > 95 && dimData.count >= 3) {
   280	      adjustment = -0.01;
   281	    }
   282	
   283	    recommended[dim] = Math.max(0.05, Math.min(0.40, current + adjustment));
   284	    totalWeight += recommended[dim];
   285	  }
   286	
   287	  // Normalize to sum to 1.0
   288	  for (const dim of DIMENSIONS) {
   289	    recommended[dim] = Math.round((recommended[dim] / totalWeight) * 100) / 100;
   290	  }
   291	
   292	  // Build report lines
   293	  const reportLines = [
   294	    'Weight Optimization Report',
   295	    '═'.repeat(40),
   296	    `Sessions analyzed: ${sessionHistory.length}`,
   297	    '',
   298	    '| Dimension | Current | Recommended | Mean Score | StdDev |',
   299	    '|-----------|---------|-------------|------------|--------|',
   300	  ];
   301	
   302	  for (const dim of DIMENSIONS) {
   303	    const current = currentWeights[dim] || 0.20;
   304	    const rec = recommended[dim];
   305	    const data = dimensionVariances[dim];
   306	    reportLines.push(
   307	      `| ${dim} | ${current.toFixed(2)} | ${rec.toFixed(2)} | ${data.mean.toFixed(1)} | ${data.stddev.toFixed(1)} |`
   308	    );
   309	  }
   310	
   311	  reportLines.push('');
   312	  reportLines.push('NOTE: These recommendations are advisory only. Do NOT auto-apply.');
   313	  reportLines.push('Review the report and apply manually if appropriate.');
   314	
   315	  return {
   316	    recommendations: recommended,
   317	    sufficient: true,
   318	    report: reportLines.join('\n'),
   319	  };
   320	}
   321	
   322	// ─────────────────────────────────────────────────────────────────────────────
   323	// 5. EXPORTS
   324	// ─────────────────────────────────────────────────────────────────────────────
   325	
   326	module.exports = {
   327	  MIN_REPLAY_COUNT_DEFAULT,
   328	  DEFAULT_REPLAY_COUNT,
   329	  DEFAULT_WARNING_THRESHOLD,
   330	  DEFAULT_SESSION_COUNT_THRESHOLD,
   331	  DIMENSIONS,
   332	  mean,
   333	  stddev,
   334	  stabilityCoefficient,
   335	  measureStability,
   336	  isStable,
   337	  generateWeightRecommendations,
   338	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   261	    return {
   262	      canConverge: false,
   263	      reason: `Unstable dimensions: ${unstableDimensions.join(', ')}`,
   264	      dataPoints: trajectory.length,
   265	    };
   266	  }
   267	
   268	  return {
   269	    canConverge: true,
   270	    reason: 'All dimensions stable across last ' + opts.minDataPoints + ' data points',
   271	    dataPoints: trajectory.length,
   272	  };
   273	}
   274	
   275	// ─────────────────────────────────────────────────────────────────────────────
   276	// 6. EXPORTS
   277	// ─────────────────────────────────────────────────────────────────────────────
   278	
   279	module.exports = {
   280	  LOOP_TYPE,
   281	  MIN_TRAJECTORY_POINTS,
   282	  DEFAULT_STABILITY_DELTA,
   283	  createCoverageGraph,
   284	  recordMutation,
   285	  getExhaustedMutations,
   286	  markExhausted,
   287	  getMutationCoverage,
   288	  recordTrajectory,
   289	  getTrajectory,
   290	  checkConvergenceEligibility,
   291	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   261	    }
   262	    const event = { eventType: emitType, details };
   263	    const result = emitEvent(journalPath, event);
   264	    if (!result.success) {
   265	      process.stderr.write(`Validation failed: ${result.errors.join(', ')}\n`);
   266	      process.exit(1);
   267	    }
   268	    process.stdout.write(JSON.stringify({ success: true, eventType: emitType }) + '\n');
   269	  } else {
   270	    process.stderr.write(
   271	      'Usage:\n' +
   272	      '  node improvement-journal.cjs --emit <eventType> --journal <path> [--details <json>]\n' +
   273	      '  node improvement-journal.cjs --read <path>\n'
   274	    );
   275	    process.exit(2);
   276	  }
   277	}

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

exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts | rg 'coverage-graph-db\\.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/scripts -name 'coverage-graph-db.ts' -o -path '*coverage-graph-db.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit -path '*coverage-graph-db.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 201ms:
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	  }
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	 * @returns {number} Count of edges involving this node within the window
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs | sed -n '260,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	 *
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

codex
**Findings**
1. Finding ID: `F-012-001`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:67)  
Line: `67-101, 119-179`  
Title: Cross-layer contract is shadow-copied instead of verified from the TS authority  
Description: The suite claims to validate CJS ↔ TS alignment, but the TS side is represented by hard-coded fixtures inside the test file. That creates a second manual source of truth and allows false passes whenever `coverage-graph-db.ts` drifts independently from these fixtures.  
Evidence: `TS_VALID_RELATIONS`, `TS_RESEARCH_WEIGHTS`, and `TS_REVIEW_WEIGHTS` are defined locally, and the assertions compare CJS exports only against those locals. The real authority lives in [.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:114) lines `114-146`.  
Recommendation: Read or parse the real TS file during the test, or extract the shared relation/weight constants into a dependency-light module that both the TS layer and the tests import.

2. Finding ID: `F-012-002`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:182)  
Line: `182-185, 267-272`  
Title: Two “contract” checks are tautologies and cannot catch regressions  
Description: These tests read like TS-layer verification, but neither one inspects the TS layer. If the TS schema or relation naming changes, both tests still pass, so they provide documentation theater rather than executable protection.  
Evidence: One test only asserts `coreModule.REVIEW_RELATION_WEIGHTS` has `EVIDENCE_FOR`; another sets `const selfLoopConstraintDocumented = true` and asserts it is `true`. The actual schema constraint is in `coverage-graph-db.ts` lines `172-184`.  
Recommendation: Replace both with executable assertions against the TS source or extracted constants. For example, assert that `VALID_RELATIONS.review` contains `EVIDENCE_FOR` and that `SCHEMA_SQL` contains `CHECK(source_id != target_id)`.

3. Finding ID: `F-012-003`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:119)  
Line: `119-126, 131-150, 156-165, 174-180, 188-207, 241-268, 293-299, 323-327, 352-360, 404-409`  
Title: Stress suite bakes fixed wall-clock budgets into unit tests  
Description: The file repeatedly asserts strict elapsed-time ceilings with `performance.now()`. Those checks are highly sensitive to host load, CI hardware, and runtime differences, so they are likely to produce flaky failures without any functional regression.  
Evidence: Examples include `expect(elapsed).toBeLessThan(2000)`, `5000`, and `10000` across multiple tests.  
Recommendation: Move these checks into an opt-in benchmark/perf job, or loosen them into smoke-level guards with CI-aware skipping. Keep the unit suite focused on deterministic correctness assertions.

4. Finding ID: `F-012-004`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:62)  
Line: `62-66, 271-279`  
Title: “No contradictions” test does not build a contradiction-free graph and only asserts array shape  
Description: The helper used by the test rotates through `CONTRADICTS`, so the setup contradicts the test name. The assertion then only checks `Array.isArray`, which means a broken scanner can still pass. This leaves one named REQ-GT-008 scenario effectively uncovered.  
Evidence: `RELATIONS` includes `CONTRADICTS`, the comment says “filter out any accidental CONTRADICTS,” but no filtering happens, and the only check is `expect(Array.isArray(contradictions)).toBe(true)`.  
Recommendation: Build an explicit contradiction-free graph and assert `[]`, or rename the test to match the actual setup and assert a deterministic contradiction count.

5. Finding ID: `F-012-005`  
Severity: `P2`  
Dimension: `maintainability`  
File: [.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:224)  
Line: `224-252`  
Title: Recommendation test validates report formatting more than optimizer behavior  
Description: The fixture data is intentionally skewed, but the assertions only check that recommendations exist, the report contains expected strings, and weights sum roughly to 1.0. A regression that adjusts the wrong dimension, or returns unchanged weights, would still pass.  
Evidence: The test never ties the output to the low `ruleCoherence` scores in the session history; it only uses `toBeDefined`, `toContain`, and a total-weight bound.  
Recommendation: Assert at least one heuristic outcome directly, such as `ruleCoherence` increasing relative to the current weight, bounds staying within `[0.05, 0.40]`, and all five dimensions appearing in the result.

6. Finding ID: `F-012-006`  
Severity: `P2`  
Dimension: `maintainability`  
File: [.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:89)  
Line: `89-101, 188-199`  
Title: Supported `session_end` alias is implemented but unpinned by tests  
Description: The journal module explicitly supports both `session_ended` and `session_end`, but the suite exercises only `session_ended`. That leaves a documented compatibility path unprotected against accidental removal or refactor drift.  
Evidence: The implementation accepts both aliases in [.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:91) lines `91-101` and reads both at lines `193-203`; the tests only create `session_ended` events.  
Recommendation: Add validation, emit, and read-path tests for `session_end` so the backward-compat contract is explicit.

**Iteration Summary**  
Total findings: `6`  
Breakdown: `0 P0`, `4 P1`, `2 P2`

**Coverage Assessment**  
Reviewed `100%` of the requested focus area: all `7/7` named test files, with source cross-checks against the referenced implementation modules.

**Confidence**  
`high`

**Next Priorities**  
Examine the dedicated coverage-graph unit suites next: `coverage-graph-core.vitest.ts`, `coverage-graph-signals.vitest.ts`, `coverage-graph-convergence.vitest.ts`, and `coverage-graph-cross-layer.vitest.ts`, plus improve-agent resume/CLI/recovery branches that are implemented but only lightly pinned here (env overrides, malformed file recovery, lineage cycle handling).
hook: Stop
hook: Stop Completed
tokens used
132,185
**Findings**
1. Finding ID: `F-012-001`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:67)  
Line: `67-101, 119-179`  
Title: Cross-layer contract is shadow-copied instead of verified from the TS authority  
Description: The suite claims to validate CJS ↔ TS alignment, but the TS side is represented by hard-coded fixtures inside the test file. That creates a second manual source of truth and allows false passes whenever `coverage-graph-db.ts` drifts independently from these fixtures.  
Evidence: `TS_VALID_RELATIONS`, `TS_RESEARCH_WEIGHTS`, and `TS_REVIEW_WEIGHTS` are defined locally, and the assertions compare CJS exports only against those locals. The real authority lives in [.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:114) lines `114-146`.  
Recommendation: Read or parse the real TS file during the test, or extract the shared relation/weight constants into a dependency-light module that both the TS layer and the tests import.

2. Finding ID: `F-012-002`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:182)  
Line: `182-185, 267-272`  
Title: Two “contract” checks are tautologies and cannot catch regressions  
Description: These tests read like TS-layer verification, but neither one inspects the TS layer. If the TS schema or relation naming changes, both tests still pass, so they provide documentation theater rather than executable protection.  
Evidence: One test only asserts `coreModule.REVIEW_RELATION_WEIGHTS` has `EVIDENCE_FOR`; another sets `const selfLoopConstraintDocumented = true` and asserts it is `true`. The actual schema constraint is in `coverage-graph-db.ts` lines `172-184`.  
Recommendation: Replace both with executable assertions against the TS source or extracted constants. For example, assert that `VALID_RELATIONS.review` contains `EVIDENCE_FOR` and that `SCHEMA_SQL` contains `CHECK(source_id != target_id)`.

3. Finding ID: `F-012-003`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:119)  
Line: `119-126, 131-150, 156-165, 174-180, 188-207, 241-268, 293-299, 323-327, 352-360, 404-409`  
Title: Stress suite bakes fixed wall-clock budgets into unit tests  
Description: The file repeatedly asserts strict elapsed-time ceilings with `performance.now()`. Those checks are highly sensitive to host load, CI hardware, and runtime differences, so they are likely to produce flaky failures without any functional regression.  
Evidence: Examples include `expect(elapsed).toBeLessThan(2000)`, `5000`, and `10000` across multiple tests.  
Recommendation: Move these checks into an opt-in benchmark/perf job, or loosen them into smoke-level guards with CI-aware skipping. Keep the unit suite focused on deterministic correctness assertions.

4. Finding ID: `F-012-004`  
Severity: `P1`  
Dimension: `maintainability`  
File: [.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:62)  
Line: `62-66, 271-279`  
Title: “No contradictions” test does not build a contradiction-free graph and only asserts array shape  
Description: The helper used by the test rotates through `CONTRADICTS`, so the setup contradicts the test name. The assertion then only checks `Array.isArray`, which means a broken scanner can still pass. This leaves one named REQ-GT-008 scenario effectively uncovered.  
Evidence: `RELATIONS` includes `CONTRADICTS`, the comment says “filter out any accidental CONTRADICTS,” but no filtering happens, and the only check is `expect(Array.isArray(contradictions)).toBe(true)`.  
Recommendation: Build an explicit contradiction-free graph and assert `[]`, or rename the test to match the actual setup and assert a deterministic contradiction count.

5. Finding ID: `F-012-005`  
Severity: `P2`  
Dimension: `maintainability`  
File: [.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:224)  
Line: `224-252`  
Title: Recommendation test validates report formatting more than optimizer behavior  
Description: The fixture data is intentionally skewed, but the assertions only check that recommendations exist, the report contains expected strings, and weights sum roughly to 1.0. A regression that adjusts the wrong dimension, or returns unchanged weights, would still pass.  
Evidence: The test never ties the output to the low `ruleCoherence` scores in the session history; it only uses `toBeDefined`, `toContain`, and a total-weight bound.  
Recommendation: Assert at least one heuristic outcome directly, such as `ruleCoherence` increasing relative to the current weight, bounds staying within `[0.05, 0.40]`, and all five dimensions appearing in the result.

6. Finding ID: `F-012-006`  
Severity: `P2`  
Dimension: `maintainability`  
File: [.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:89)  
Line: `89-101, 188-199`  
Title: Supported `session_end` alias is implemented but unpinned by tests  
Description: The journal module explicitly supports both `session_ended` and `session_end`, but the suite exercises only `session_ended`. That leaves a documented compatibility path unprotected against accidental removal or refactor drift.  
Evidence: The implementation accepts both aliases in [.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:91) lines `91-101` and reads both at lines `193-203`; the tests only create `session_ended` events.  
Recommendation: Add validation, emit, and read-path tests for `session_end` so the backward-compat contract is explicit.

**Iteration Summary**  
Total findings: `6`  
Breakdown: `0 P0`, `4 P1`, `2 P2`

**Coverage Assessment**  
Reviewed `100%` of the requested focus area: all `7/7` named test files, with source cross-checks against the referenced implementation modules.

**Confidence**  
`high`

**Next Priorities**  
Examine the dedicated coverage-graph unit suites next: `coverage-graph-core.vitest.ts`, `coverage-graph-signals.vitest.ts`, `coverage-graph-convergence.vitest.ts`, and `coverage-graph-cross-layer.vitest.ts`, plus improve-agent resume/CLI/recovery branches that are implemented but only lightly pinned here (env overrides, malformed file recovery, lineage cycle handling).
