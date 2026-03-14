---
name: sk-code--opencode
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
- Preparing stack-specific standards evidence for `sk-code--review` baseline runs
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
- Web/frontend development (use `sk-code--web` instead)
- Browser-specific patterns (DOM, observers, animations)
- CSS styling or responsive design
- CDN deployment or minification workflows
- Full development lifecycle (research/debug/verify phases)

### Skill Overview

| Aspect        | This Skill (opencode)        | sk-code--web        |
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

        elif language == "CONFIG":
            selected.extend([
                "references/config/style_guide.md",
                "references/config/quality_standards.md",
                "references/config/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/config_checklist.md")

    if languages == ["UNKNOWN"]:
        return {
            "languages": languages,
            "language_scores": language_scores,
            "resources": selected,
            "needs_clarification": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        }

    deduped = []
    seen = set()
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            deduped.append(guarded)
            seen.add(guarded)
    return {"languages": languages, "language_scores": language_scores, "resources": deduped}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Standards Workflow

```
STEP 1: Language Detection
        ├─ Check file extension first (.js/.cjs/.mjs, .ts/.tsx/.mts, .py, .sh, .json/.jsonc)
        ├─ Fall back to keyword matching
        └─ Prompt user if ambiguous
        ↓
STEP 2: Load Shared Patterns (ALWAYS)
        ├─ universal_patterns.md → Naming, commenting principles
        └─ code_organization.md → File structure, sections
        ↓
STEP 3: Load Language References (CONDITIONAL)
        ├─ {language}/style_guide.md → Headers, formatting
        ├─ {language}/quality_standards.md → Errors, logging
        └─ {language}/quick_reference.md → Cheat sheet
        ↓
STEP 4: Apply Standards
        ├─ Follow patterns from loaded references
        ├─ Use checklist for validation (ON_DEMAND)
        └─ Cite evidence with file:line references
```

### Key Pattern Categories

| Category         | What It Covers                                              |
| ---------------- | ----------------------------------------------------------- |
| File Headers     | Box-drawing format, shebang, 'use strict', strict mode      |
| Section Dividers | Numbered sections with consistent divider style             |
| Naming           | Functions, constants, classes, interfaces, types per lang   |
| Commenting       | Purposeful comments only (explain WHY, not WHAT), max 3/10 LOC |
| Error Handling   | Guard clauses, try-catch, typed catch, specific exceptions  |
| Documentation    | JSDoc, TSDoc, Google docstrings                             |
| Design Quality   | KISS/DRY + SOLID (SRP/OCP/LSP/ISP/DIP) violation checks     |

### Evidence-Based Patterns

| Language   | Key Evidence Files                                             |
| ---------- | -------------------------------------------------------------- |
| JavaScript | `validation_patterns.js`, `wait_patterns.js`, `performance_patterns.js` |
| TypeScript | ~341 `.ts` files post-migration; patterns from `context-server.ts`, `config.ts`, `memory-search.ts` |
| Python     | `skill_advisor.py`, `validate_document.py`, `package_skill.py` |
| Shell      | `lib/common.sh`, `spec/create.sh`, `validate.sh`               |
| Config     | `config.jsonc`, `opencode.json`, `complexity-config.jsonc`     |

### 139 Carry-Forward Patterns

Recent 139 hybrid-rag implementation patterns are normative for new standards work:

1. **Default-on with explicit opt-out**
   - New behavior flags default to enabled.
   - Opt-out is explicit and testable (`false` path must be covered).
2. **Single source of truth constants**
   - Shared rule values live in one module and are imported by dependents/tests.
   - Avoid duplicate literals across handlers, tests, or checklists.
3. **Invariant-at-source, regression-at-seam**
   - Put invariants in core parsing/scoring modules.
   - Validate via seam-level tests and command assertions.
4. **Idempotent verification loops**
   - Re-running the same validation command should keep status stable.
   - Treat drift between first and second pass as a defect.

### Alignment Verifier Output Contract

The recurring verifier at `scripts/verify_alignment_drift.py` applies severity-aware reporting:

- Output format includes rule id and severity: `[{RULE_ID}] [{ERROR|WARN}]`.
- Default failure criteria: `ERROR` findings only.
- Optional strict mode: `--fail-on-warn` makes warnings build-breaking.
- Style rules (`JS-*`, `TS-*`, `PY-*`, `SH-*`) are warning-first by default.
- Parse/integrity rules (`COMMON-*`, `JSON-*`, `JSONC-*`) are error-class by default.
- Header style invariants and comment policy checks are manual checklist gates; the verifier checks marker-level headers only.
- Context-aware advisory downgrade is applied in archival/contextual paths (`z_archive`, `scratch`, `memory`, `research`, `context`, `assets`, `examples`, `fixtures`, and test-heavy paths).
- TypeScript module-header enforcement is skipped for test files (`*.test.ts`, `*.spec.ts`, `*.vitest.ts` + TSX variants) and pattern assets.
- JavaScript strict-mode enforcement is skipped for `.mjs`.
- `tsconfig*.json` supports comment-aware parsing fallback.

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

1. **Follow file header format for the language**
   - JavaScript: Box-drawing `// ─── MODULE_TYPE: NAME ───` + `'use strict'`
   - TypeScript: Module header block `// ─── MODULE: NAME ───` (no `'use strict'`; tsconfig handles it)
   - Python: Shebang `#!/usr/bin/env python3` + box-drawing header
   - Shell: Shebang `#!/usr/bin/env bash` + header + `set -euo pipefail`
   - JSONC: Box comment header (JSON cannot have comments)

2. **Use consistent naming conventions**
   - JavaScript: `camelCase` functions, `UPPER_SNAKE` constants, `PascalCase` classes
   - TypeScript: Same as JS + `PascalCase` interfaces/types/enums, `T`-prefix generics
   - Python: `snake_case` functions/variables, `UPPER_SNAKE` constants, `PascalCase` classes
   - Shell: `lowercase_underscore` functions, `UPPERCASE` globals
   - Config: `camelCase` keys, `$schema` for validation

3. **Add purposeful comments only (not narrative comments)**
   - Maximum 3 comments per 10 lines of code
   - Comments should explain WHY something is done, not WHAT it does
   - Bad: `// Loop through items`
   - Good: `// Reverse order preserves dependency resolution`

4. **Include reference comments for traceability**
   - Task: `// T001: Description`
   - Bug: `// BUG-042: Description`
   - Requirement: `// REQ-003: Description`
   - Security: `// SEC-001: Description (CWE-XXX)`

5. **Validate inputs and handle errors**
   - JavaScript: Guard clauses + try-catch
   - Python: try-except with specific exceptions + early return tuples
   - Shell: `set -euo pipefail` + explicit exit codes

6. **Apply KISS/DRY + SOLID checks before finalizing**
   - KISS: avoid speculative abstractions and unnecessary indirection
   - DRY: consolidate duplicated logic/constants into one source
   - SOLID: detect SRP/OCP/LSP/ISP/DIP violations and simplify before merge

7. **Preserve numbered ALL-CAPS section headers**
   - Keep `## N. UPPERCASE SECTION NAME` unchanged in standards and examples
   - File headers, shebangs, module banners, docstrings, and strict-mode directives do not count as numbered sections
   - The first numbered code section that appears in a file starts at `1`, then increments sequentially from the sections actually present
   - Treat header style drift as non-regression failure

8. **Run alignment verifier before completion claims**
   - Command: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root <changed-scope-root>`
   - Default mode fails on `ERROR` findings. Use `--fail-on-warn` when strict mode is required.

### ❌ NEVER

1. **Leave commented-out code** - Delete it (git preserves history)
2. **Skip the file header** - Every file needs identification (P0)
3. **Use generic variable names** - No `data`, `temp`, `x`, `foo`, `bar`
4. **Hardcode secrets** - Use `process.env.VAR`, `os.environ['VAR']`
5. **Mix naming conventions** - Be consistent within language

### ⚠️ ESCALATE IF

1. **Pattern conflicts with existing code** - Prefer consistency
2. **Language detection is ambiguous** - Ask user to clarify
3. **Evidence files not found** - Use general pattern, note the gap
4. **Security-sensitive code** - Require explicit review

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Quality Gates

| Gate               | Criteria                                 | Priority |
| ------------------ | ---------------------------------------- | -------- |
| File Header        | Matches language-specific format         | P0       |
| Naming Convention  | Consistent throughout file               | P0       |
| No Commented Code  | Zero commented-out code blocks           | P0       |
| Header Invariant   | Numbered ALL-CAPS section headers preserved | P0    |
| Alignment Verifier | `verify_alignment_drift.py` returns no `ERROR` on changed scope | P0 |
| Filesystem Safety  | Canonical path containment checks on create/move/delete flows | P0 |
| Spec Folder Safety | `NNN-name` validation + approved roots for spec operations | P0 |
| Error Handling     | All error paths handled                  | P1       |
| Comment Policy     | Max 3/10 + purposeful WHY comments only (manual checklist gate) | P1 |
| KISS/DRY/SOLID     | SRP/OCP/LSP/ISP/DIP violations identified | P1      |
| Documentation      | Public functions have doc comments       | P1       |
| Reference Comments | Task/bug/req references where applicable | P2       |

### Priority Levels

| Level | Handling                  | Examples                          |
| ----- | ------------------------- | --------------------------------- |
| P0    | HARD BLOCKER - must fix   | File header, no commented code    |
| P1    | Required OR approved skip | Consistent naming, error handling |
| P2    | Can defer                 | Reference comments, import order  |

### Completion Checklist

```
P0 Items (MUST pass):
□ File header present and correct format
□ No commented-out code
□ Consistent naming convention
□ Numbered ALL-CAPS section headers preserved
□ Alignment verifier reports no ERROR findings for changed scope
□ Filesystem mutation paths use canonical containment checks
□ Spec folder operations enforce `NNN-name` and approved roots

P1 Items (Required):
□ Comment policy enforced via manual checklist review (max 3/10, purposeful WHY comments only)
□ Error handling implemented
□ Public functions documented
□ KISS/DRY + SOLID checks applied (SRP/OCP/LSP/ISP/DIP)

P2 Items (Can defer):
□ Reference comments (T###, BUG-###)
□ Import order optimized
```

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in AGENTS.md.

- **Gate 2**: Skill routing via `skill_advisor.py`
- **Memory**: Context preserved via Spec Kit Memory MCP
- **Completion gate**: run `verify_alignment_drift.py` on changed scope before claiming done

### Review Baseline Delegation

`sk-code--opencode` is the standards overlay for OpenCode system code. Formal findings-first review logic is owned by `sk-code--review`.

- Use `sk-code--review/references/quick_reference.md` for severity model and review output contract.
- Use `sk-code--review` security/code-quality/test checklists for baseline risk findings.
- Use this skill's references/checklists only for language-specific standards evidence.

### Skill Differentiation

| Task Type                 | This Skill | sk-code--web |
| ------------------------- | ---------- | -------------- |
| MCP server JavaScript     | ✅          | ❌              |
| MCP server TypeScript     | ✅          | ❌              |
| Python validation scripts | ✅          | ❌              |
| Shell automation scripts  | ✅          | ❌              |
| JSON/JSONC configs        | ✅          | ❌              |
| Frontend JavaScript (DOM) | ❌          | ✅              |
| CSS styling               | ❌          | ✅              |
| Browser verification      | ❌          | ✅              |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:external-resources -->
## 7. EXTERNAL RESOURCES

| Resource          | URL                              | Use For                     |
| ----------------- | -------------------------------- | --------------------------- |
| MDN Web Docs      | developer.mozilla.org            | JavaScript, Node.js APIs    |
| TypeScript Docs   | typescriptlang.org/docs          | TypeScript language, config |
| TSDoc Reference   | tsdoc.org                        | TSDoc comment format        |
| Python Docs       | docs.python.org                  | Python standard library     |
| Bash Manual       | gnu.org/software/bash/manual     | Shell scripting             |
| JSON Schema       | json-schema.org                  | JSON/JSONC validation       |
| ShellCheck        | shellcheck.net                   | Shell script validation     |

---

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files

| Language   | Files                                                          |
| ---------- | -------------------------------------------------------------- |
| Shared     | `universal_patterns.md`, `code_organization.md`                |
| JavaScript | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| TypeScript | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Python     | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Shell      | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Config     | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |

### Checklists

- `assets/checklists/universal_checklist.md` - Cross-language P0 items
- `assets/checklists/javascript_checklist.md` - JS-specific validation
- `assets/checklists/typescript_checklist.md` - TS-specific validation
- `assets/checklists/python_checklist.md` - Python-specific validation
- `assets/checklists/shell_checklist.md` - Shell-specific validation
- `assets/checklists/config_checklist.md` - JSON/JSONC validation
- `references/shared/alignment_verification_automation.md` - verifier contract and automation workflow

### Related Skills

| Skill                       | Use For                                    |
| --------------------------- | ------------------------------------------ |
| **sk-code--review**       | Findings-first review baseline, severity model, risk reporting |
| **sk-code--web**          | Web/frontend development, browser testing  |
| **sk-doc** | Markdown documentation, skill creation     |
| **system-spec-kit**         | Spec folders, memory, context preservation |
| **sk-git**           | Git workflows, commits, PR creation        |

---

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:where-am-i-language-detection -->
## 9. WHERE AM I? (Language Detection)

| Language   | You're here if...                                   | Load these resources          |
| ---------- | --------------------------------------------------- | ----------------------------- |
| JavaScript | File is `.js/.mjs/.cjs`, or MCP/Node code           | `javascript/*` + quality      |
| TypeScript | File is `.ts/.tsx/.mts/.d.ts`, or interface/type/tsc | `typescript/*` + quality      |
| Python     | File is `.py`, or pytest/argparse keywords           | `python/*` + quality          |
| Shell      | File is `.sh/.bash`, or shebang keywords             | `shell/*` + quality           |
| Config     | File is `.json/.jsonc`, or schema keywords           | `config/*`                    |
| Unknown    | No extension, no keywords match                      | Ask user, use shared patterns |

---

<!-- /ANCHOR:where-am-i-language-detection -->
<!-- ANCHOR:quick-reference -->
## 10. QUICK REFERENCE

### File Header Templates

**JavaScript**
```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Module Name]                                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('fs');
```

**Python**
```python
#!/usr/bin/env python3
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ [Script Name]                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
"""Brief description."""

# ─────────────────────────────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────────────────────────────
import sys
```

**Shell**
```bash
#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ [Script Name]                                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Brief description.

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

**TypeScript**
```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: [Module Name]
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import path from 'path';
import type { SearchOptions } from '../types';
```

**JSONC**
```jsonc
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Config Name]                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
{
  "$schema": "https://...",
  // Section-level rationale
  "key": "value"
}
```

### Naming Matrix

| Element    | JavaScript    | TypeScript    | Python        | Shell         | Config      |
| ---------- | ------------- | ------------- | ------------- | ------------- | ----------- |
| Functions  | `camelCase`   | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Constants  | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | N/A         |
| Classes    | `PascalCase`  | `PascalCase`  | `PascalCase`  | N/A           | N/A         |
| Interfaces | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Types      | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Enums      | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Generics   | N/A           | `T`-prefix    | N/A           | N/A           | N/A         |
| Variables  | `camelCase`   | `camelCase`   | `snake_case`  | `lower_snake` | `camelCase` |
| Params     | `camelCase`   | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Booleans   | `is`/`has`    | `is`/`has`    | `is_`/`has_`  | `is_`/`has_`  | N/A         |
| Private    | `_prefix`     | `_prefix`     | `_prefix`     | `_prefix`     | N/A         |

### Error Handling Patterns

**JavaScript**
```javascript
function processData(data) {
  if (!data) throw new Error('Data required');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('[Module] Failed:', error.message);
    return null;
  }
}
```

**Python**
```python
def validate_input(data: str) -> Tuple[bool, str]:
    if not data:
        return False, "Data required"
    try:
        return True, json.loads(data)
    except json.JSONDecodeError as e:
        return False, f"Parse error: {e}"
```

**Shell**
```bash
validate_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        log_error "Not found: $file"
        return 1
    fi
    return 0
}
```

### Comment Patterns

```javascript
// GOOD - Purposeful comments
// Skip initialization to prevent double-binding
// Sort by recency so latest evidence is consumed first
// REQ-033: transaction manager for pending file recovery

// BAD - WHAT comments (avoid)
// Set value to 42
// Loop through items
```
<!-- /ANCHOR:quick-reference -->
