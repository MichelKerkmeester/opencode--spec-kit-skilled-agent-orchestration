---
title: "sk-code--opencode"
description: "Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns and quality checklists"
trigger_phrases:
  - "opencode system code standards"
  - "multi-language code quality"
  - "opencode javascript typescript python shell"
---

# sk-code--opencode

> Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell and JSON/JSONC) with language detection routing, universal patterns and quality checklists.

---

#### TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [STRUCTURE](#3--structure)
4. [FEATURES](#4--features)
5. [CONFIGURATION](#5--configuration)
6. [EXAMPLES](#6--examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [RELATED](#8--related)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This skill enforces consistent code standards across all languages used in the OpenCode system: JavaScript, TypeScript, Python, Shell and JSON/JSONC. It provides evidence-based patterns extracted from the actual OpenCode codebase with `file:line` citations, not theoretical guidelines.

The skill uses a smart routing system that detects the target language via file extension or keyword matching, then loads only the relevant references. Shared patterns (naming, commenting and file organization) load on every invocation. Language-specific style guides and quality standards load conditionally.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

This skill activates automatically via Gate 2 (`skill_advisor.py`) when you work on OpenCode system code. No manual invocation is needed for most tasks.

**Typical flow:**
1. Skill detects the language from the file extension or task keywords
2. Shared patterns (`universal_patterns.md`, `code_organization.md`) load automatically
3. Language-specific style guide and quality standards load conditionally
4. Checklists load on demand for validation passes
5. Run `verify_alignment_drift.py` on changed scope before completion claims

**Manual invocation:** Load the skill when writing OpenCode system code in `.opencode/`, MCP servers or system scripts. For formal review output, pair with `sk-code--review`.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
.opencode/skill/sk-code--opencode/
├── SKILL.md                          # Entry point with routing logic
├── README.md                         # This file
├── references/
│   ├── shared/
│   │   ├── universal_patterns.md     # Cross-language naming, commenting
│   │   └── code_organization.md      # File structure, sections
│   ├── javascript/
│   │   ├── style_guide.md            # Headers, formatting, naming
│   │   ├── quality_standards.md      # Errors, exports, JSDoc
│   │   └── quick_reference.md        # Cheat sheet
│   ├── typescript/
│   │   ├── style_guide.md            # Headers, interfaces, naming
│   │   ├── quality_standards.md      # Type safety, generics, TSDoc
│   │   └── quick_reference.md        # Cheat sheet
│   ├── python/
│   │   ├── style_guide.md            # Shebang, docstrings, naming
│   │   ├── quality_standards.md      # Type hints, exceptions
│   │   └── quick_reference.md        # Cheat sheet
│   ├── shell/
│   │   ├── style_guide.md            # Strict mode, ANSI colors, logging
│   │   ├── quality_standards.md      # Variable quoting, exit codes
│   │   └── quick_reference.md        # Cheat sheet
│   └── config/
│       ├── style_guide.md            # JSON/JSONC structure, $schema
│       └── quick_reference.md        # Cheat sheet
├── assets/
    └── checklists/
        ├── universal_checklist.md    # Cross-language P0 items
        ├── javascript_checklist.md   # JS-specific validation
        ├── typescript_checklist.md   # TS-specific validation
        ├── python_checklist.md       # Python-specific validation
        ├── shell_checklist.md        # Shell-specific validation
        └── config_checklist.md       # JSON/JSONC validation
└── scripts/
    ├── verify_alignment_drift.py     # Severity-aware alignment verifier
    └── test_verify_alignment_drift.py # Verifier regression tests
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:features -->
## 4. FEATURES

- **Smart language detection**: Routes to the correct standards via file extension or keyword matching across 5 languages
- **Three-tier resource loading**: ALWAYS (shared patterns), CONDITIONAL (language-specific), ON_DEMAND (checklists)
- **Evidence-based patterns**: All standards are extracted from real OpenCode codebase files, not theoretical guidelines
- **File header templates**: Language-specific box-drawing headers for JavaScript, TypeScript, Python, Shell and JSONC
- **Naming convention matrix**: Complete naming rules per language (functions, constants, classes, interfaces, types and enums)
- **Quality checklists**: P0/P1/P2 prioritized validation for each language
- **WHY-not-WHAT commenting**: Enforces meaningful comments with reference traceability (T###, BUG-###, REQ-###)
- **Error handling patterns**: Guard clauses, try-catch, typed exceptions and early-return tuples per language

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

No configuration files are required. The skill self-configures through language detection.

**Resource loading levels:**

| Level       | When                       | What loads                   |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every invocation           | Shared patterns + SKILL.md   |
| CONDITIONAL | Language keywords detected | Language-specific references  |
| ON_DEMAND   | Explicit request           | Deep-dive quality standards  |

**Priority levels for quality gates:**

| Level | Handling                    | Examples                          |
| ----- | --------------------------- | --------------------------------- |
| P0    | HARD BLOCKER, must fix      | File header, no commented code    |
| P1    | Required OR skip w/approval | Naming, error handling            |
| P2    | Can defer                   | Reference comments, import order  |

**Completion gate command:**

```bash
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. EXAMPLES

**Language detection keywords:**

| Language   | Trigger keywords                                             |
| ---------- | ------------------------------------------------------------ |
| JavaScript | `opencode`, `mcp`, `commonjs`, `require`, `module.exports`  |
| TypeScript | `typescript`, `ts`, `interface`, `type`, `tsconfig`, `tsc`  |
| Python     | `python`, `pytest`, `argparse`, `docstring`, `snake_case`   |
| Shell      | `bash`, `shell`, `shebang`, `set -e`, `pipefail`            |
| Config     | `json`, `jsonc`, `config`, `schema`, `manifest`             |

**Quick naming reference:**

| Element   | JS / TS       | Python        | Shell         | Config      |
| --------- | ------------- | ------------- | ------------- | ----------- |
| Functions | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Constants | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | N/A         |
| Classes   | `PascalCase`  | `PascalCase`  | N/A           | N/A         |
| Variables | `camelCase`   | `snake_case`  | `lower_snake` | `camelCase` |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| Issue                          | Cause                            | Fix                                              |
| ------------------------------ | -------------------------------- | ------------------------------------------------ |
| Wrong language detected        | Ambiguous file or missing ext    | Specify the language explicitly in your request   |
| Pattern conflicts with codebase| Existing code uses different style| Prefer consistency with existing code over skill rules |
| Evidence files not found       | Codebase changed since extraction| Use the general pattern and note the gap          |
| Skill loads but no references  | Language not in supported set    | Check supported: JS, TS, Python, Shell, JSON/JSONC|

**Escalation triggers:**
- Pattern conflicts with existing code. Prefer consistency.
- Language detection is ambiguous. Ask user to clarify.
- Security-sensitive code. Require explicit review.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related -->
## 8. RELATED

**Related skills:**

| Skill                         | Relationship                                      |
| ----------------------------- | ------------------------------------------------- |
| `sk-code--review`             | Findings-first review baseline, severity handling, risk checklists |
| `sk-code--web`                | Web/frontend code (DOM, CSS, browser testing)     |
| `sk-code--full-stack`  | Multi-stack projects (Go, React, Swift, etc.)     |
| `mcp-code-mode`               | TypeScript orchestration for external MCP tools    |
| `sk-doc`     | Markdown docs, skill creation, DQI validation     |
| `system-spec-kit`             | Spec folders, memory, context preservation        |
| `sk-git`               | Git workflows, commits, PR creation               |

**Key distinction:** This skill covers system/backend code standards only. For frontend/browser work, use `sk-code--web`. For multi-stack projects with Go, React or Swift, use `sk-code--full-stack`.

<!-- /ANCHOR:related -->
