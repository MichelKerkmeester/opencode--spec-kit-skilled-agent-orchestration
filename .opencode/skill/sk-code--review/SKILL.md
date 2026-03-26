---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

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

- Baseline (always): `sk-code` (implemented by this skill: `sk-code--review`)
- Overlay (exactly one `sk-code--*`):
  - OpenCode system context -> `sk-code--opencode`
  - Frontend/web context -> `sk-code--web`
  - Default/other stacks -> `sk-code--full-stack`

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect `sk-code` baseline + one `sk-code--*` overlay
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
| Security/correctness minimums | `sk-code` baseline (`sk-code--review`) | Always enforced; never relaxed by overlay |
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
        return "sk-code--opencode"
    if any(term in text for term in ["frontend", "web", "css", "dom", "browser", "webflow"]) or any(
        marker in files for marker in ["next.config", "vite.config", "package.json", "src/"]
    ):
        return "sk-code--web"
    return "sk-code--full-stack"


def route_review_resources(task, workspace_files=None, changed_files=None):
    inventory = discover_markdown_resources()
    text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in DEFAULT_RESOURCES:
        load_if_available(relative_path)

    if sum(scores.values()) < 0.5:
        return {
            "intents": ["QUALITY"],
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "overlay_skill": detect_overlay_skill(task, workspace_files, changed_files),
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    if any(keyword in text for keyword in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    overlay_skill = detect_overlay_skill(task, workspace_files, changed_files)

    precedence = {
        "baseline_minimums": ["security", "correctness"],
        "overlay_overrides": ["style", "build", "test_commands", "stack_process"],
        "on_conflict": "escalate",
    }

    return {
        "intents": intents,
        "scores": scores,
        "overlay_skill": overlay_skill,
        "precedence": precedence,
        "resources": loaded,
    }
```
<!-- /ANCHOR:smart-routing -->

---

<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Phase 1: Scope and Baseline

1. Inspect the review target (`git diff`, staged diff, file list, or commit range).
2. Load baseline standards from `sk-code` references in this skill (`sk-code--review`).
3. Detect one overlay skill by codebase/stack signals.

### Phase 2: Overlay Alignment

1. Load overlay standards from one stack skill only.
2. Apply precedence matrix:
   - Baseline security/correctness minimums always apply.
   - Overlay style/process/verification conventions win on conflicts.
3. If precedence cannot be resolved deterministically, escalate before scoring.

### Phase 3: Findings-First Analysis

1. Analyze for security and correctness first.
2. Analyze quality/performance, test adequacy, contract safety, and architecture concerns.
3. Analyze KISS/DRY and SOLID violations (SRP/OCP/LSP/ISP/DIP) with evidence.
4. Analyze removal opportunities with safe-now vs deferred classification.
5. Produce findings ordered by severity (`P0`, `P1`, `P2`).

### Phase 4: Output and Next Action

Required output contract:

```markdown
## Code Review Summary

**Files reviewed**: X files, Y lines changed
**Overall assessment**: [APPROVE / REQUEST_CHANGES / COMMENT]
**Baseline used**: [sk-code (`sk-code--review`)]
**Overlay skill used**: [sk-code--opencode | sk-code--web | sk-code--full-stack]

## Findings

### P0 - Critical
1. [path:line] Title
   - Risk
   - User impact
   - Recommended fix

### P1 - High
...

## Removal/Iteration Plan

## Next Steps
```

After reporting findings, request explicit next action before any implementation follow-up.
<!-- /ANCHOR:how-it-works -->

---

<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

- Keep findings first; summaries follow findings.
- Enforce baseline security/correctness minimums regardless of overlay.
- Include file:line evidence for actionable findings.
- State assumptions when evidence is incomplete.
- Identify overlay skill used for standards alignment.

### ❌ NEVER

- Override stack-specific conventions with generic baseline style preferences.
- Approve code with unaddressed P0 security/correctness defects.
- Produce vague findings without concrete evidence.
- Mix unrelated cleanup into targeted fix recommendations.

### ⚠️ ESCALATE IF

- Stack detection is ambiguous and affects standards or verification commands.
- Baseline and overlay guidance conflict in a non-deterministic way.
- Large diff size prevents reliable severity assignment without narrowed scope.
- Requested remediation exceeds review scope and becomes architecture redesign.
<!-- /ANCHOR:rules -->

---

<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

- [review_core.md](./references/review_core.md) - Shared review doctrine: severity model, evidence rules, precedence, and finding schema.
- [review_ux_single_pass.md](./references/review_ux_single_pass.md) - Interactive single-pass review flow, presentation modes, and PR/pre-commit behavior.
- [quick_reference.md](./references/quick_reference.md) - Lightweight index for routing between shared doctrine and single-pass UX guidance.
- [security_checklist.md](./references/security_checklist.md) - Mandatory security and reliability checks.
- [code_quality_checklist.md](./references/code_quality_checklist.md) - Correctness, performance, KISS, and DRY checks.
- [solid_checklist.md](./references/solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture assessment prompts.
- [removal_plan.md](./references/removal_plan.md) - Safe-now vs deferred removal planning template.
- [test_quality_checklist.md](./references/test_quality_checklist.md) - Test quality, coverage, and anti-pattern detection.

### Reference Loading Notes

- Load only the references needed for the selected intents.
- Keep Section 2 (`SMART ROUTING`) as the authoritative routing source.
<!-- /ANCHOR:references -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Review output is findings-first and severity-ordered.
- `sk-code` baseline + `sk-code--*` overlay contract is explicit in report context.
- Security/correctness minimums are always covered.
- Recommended fixes are actionable and scope-proportional.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

- Primary review baseline for `@review` agents in `.opencode/agent/review.md`.
- Referenced by review-dispatch steps in `spec_kit` and `create` command YAML workflows.
- Complements, but does not replace, stack-specific skills:
  - `sk-code--opencode`
  - `sk-code--web`
  - `sk-code--full-stack`
<!-- /ANCHOR:integration-points -->

---

<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

- [sk-doc](../sk-doc/SKILL.md) - Skill authoring and packaging standards.
- [sk-code--opencode](../sk-code--opencode/SKILL.md) - OpenCode system code overlay standards.
- [sk-code--web](../sk-code--web/SKILL.md) - Web/frontend overlay standards.
- [sk-code--full-stack](../sk-code--full-stack/SKILL.md) - Default multi-stack overlay standards.
- [.opencode/agent/review.md](../../agent/review.md) - Runtime review agent contract.
<!-- /ANCHOR:related-resources -->
