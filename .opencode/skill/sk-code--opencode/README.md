---
title: "sk-code--opencode"
description: "Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists."
trigger_phrases:
  - "opencode system code standards"
  - "mcp server javascript code style"
  - "typescript standards opencode"
  - "python script style opencode"
  - "shell script standards"
  - "jsonc config format"
  - "code quality opencode"
---

# sk-code--opencode

> Multi-language code standards for OpenCode system code, covering JavaScript, TypeScript, Python, Shell, and JSON/JSONC with automatic language detection and quality-gated checklists.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

`sk-code--opencode` defines code standards for all OpenCode system code: MCP servers, validators, advisors, automation scripts, and configuration files. It covers five languages: JavaScript, TypeScript, Python, Shell, and JSON/JSONC. The skill detects the target language from file extension or keyword signals, loads the correct style and quality references, and applies a quality checklist with P0 blockers that must pass before any completion claim.

The standards in this skill are evidence-based. Every pattern is extracted from actual OpenCode codebase files with file:line citations. File headers use box-drawing character formats. Section dividers follow a numbered ALL-CAPS convention. Naming conventions are strict and language-specific. Comment policy limits comments to 3 per 10 lines and requires WHY comments, not WHAT comments. These are not arbitrary preferences. They exist because consistent, purposeful formatting reduces cognitive load when reading system code across multiple languages in the same session.

The skill also owns the alignment verifier contract. The script `scripts/verify_alignment_drift.py` runs on any changed scope and reports rule violations by severity. ERROR findings are blockers. WARN findings are advisory by default and become blockers with `--fail-on-warn`. Running this verifier is a P0 requirement before claiming completion on any OpenCode system code change.

### Key Statistics

| Statistic | Value |
| --- | --- |
| Version | 1.2.0.0 |
| Supported languages | 5 (JavaScript, TypeScript, Python, Shell, JSON/JSONC) |
| Quality gate priority levels | 3 (P0 blocker, P1 required, P2 deferrable) |
| P0 quality gates | 7 (file header, naming, no commented code, section headers, alignment verifier, filesystem safety, spec folder safety) |
| Language detection signals | File extension (primary), keyword scoring (fallback) |
| Reference directories | 6 (shared, javascript, typescript, python, shell, config) |
| Checklist files | 6 (universal + one per language) |

### How This Compares

| Without This Skill | With This Skill |
| --- | --- |
| Inconsistent file headers across languages | Box-drawing format enforced per language |
| Mixed naming conventions in the same file | One naming convention per language, applied consistently |
| Commented-out code left in production files | Commented-out code is a P0 blocker |
| No comment policy | Max 3 comments per 10 lines, WHY-only |
| Completion claimed without alignment check | `verify_alignment_drift.py` must pass before done |
| Generic style guidance | Evidence-based patterns from actual OpenCode files |
| WHAT comments everywhere | Reference comments (T###, BUG-###, REQ-###, SEC-###) |

### Key Features

| Feature | Description |
| --- | --- |
| Language detection | Extension-first detection with weighted keyword fallback and top-2 ambiguity handling |
| Box-drawing file headers | Language-specific header format using box-drawing characters for every file |
| Numbered section dividers | ALL-CAPS section headers with sequential numbering preserved as style invariants |
| Strict naming matrix | Per-language naming rules covering functions, constants, classes, interfaces, booleans, and privates |
| Comment policy | Max 3 per 10 lines, WHY not WHAT, reference comment format (T###/BUG-###/REQ-###/SEC-###) |
| KISS/DRY + SOLID checks | SRP/OCP/LSP/ISP/DIP violation detection required before merge |
| Alignment verifier | `verify_alignment_drift.py` checks rule compliance on changed scope, severity-aware output |
| P0/P1/P2 quality gates | Tiered gate system with hard blockers, required items, and deferrable items |
| 139 carry-forward patterns | Four normative implementation patterns from the hybrid-rag work, applied to new standards |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Confirm skill activation.** Gate 2 routing loads this skill when OpenCode system code keywords appear (opencode, mcp, commonjs, typescript, python, bash, json). Verify the routing decision shows `sk-code--opencode` before proceeding.

**Step 2: Detect the language.** Check the file extension first: `.js/.mjs/.cjs` is JavaScript, `.ts/.tsx` is TypeScript, `.py` is Python, `.sh/.bash` is Shell, `.json/.jsonc` is Config. If no extension is available, read the task keywords against the detection table in SKILL.md §9.

**Step 3: Add the file header.** Every file must have the language-specific box-drawing header before any other content. JavaScript uses `// ╔══ ... ╗` followed by `'use strict'`. Python uses the shebang line first, then the box header. Shell uses `#!/usr/bin/env bash` then the box header then `set -euo pipefail`. TypeScript uses the module header block without `'use strict'`. See SKILL.md §10 or Section 6 of this README for exact templates.

**Step 4: Run the alignment verifier before claiming done.** After changes are complete, run: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root <changed-scope-root>`. Exit with no ERROR findings. Fix any blockers before stating completion.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

Language detection in this skill runs in two stages. The primary signal is the file extension. When a `.ts` file is in scope, the router immediately selects TypeScript references and checklists without any keyword scoring. This is fast, deterministic, and avoids false positives. When no extension is available (for example, a task description about modifying a config system), the router falls back to weighted keyword scoring across five language categories. Scores within 0.8 points of the top score trigger ambiguity handling, which loads quick-reference documents for both candidate languages.

The comment policy is one of the most visible standards in this skill, and one of the most frequently violated in AI-generated code. The rule is: maximum 3 comments per 10 lines of code, and every comment must explain WHY something is done, not WHAT it does. "Loop through items" is a WHAT comment. It describes what any developer can see by reading the code. "Reverse order preserves dependency resolution" is a WHY comment. It records a decision that is not visible from the code alone. Reference comments (T001, BUG-042, REQ-003, SEC-001) are a separate category and do not count against the density limit.

The 139 carry-forward patterns are normative for all new standards work in this skill. Four core patterns emerged from the hybrid-rag implementation: default-on with explicit opt-out, single source of truth constants, invariant-at-source with regression-at-seam validation, and idempotent verification loops. These patterns apply broadly. New behavior flags default to enabled. Shared rule values live in one module. Invariants go in core modules, not in test harnesses. Re-running the same validation command must produce stable output.

The alignment verifier output contract governs how rule violations are reported and acted on. Every finding includes a rule ID and severity label: `[JS-001] [ERROR]` or `[PY-003] [WARN]`. Style rules default to warning class. Parse and integrity rules default to error class. Context-aware downgrade applies in archival and scratch paths. TypeScript module-header enforcement skips test files. JavaScript strict-mode enforcement skips `.mjs` files. These exemptions exist to prevent false positives in paths where the standard does not apply.

### 3.2 FEATURE REFERENCE

**Language Detection: Extension Map**

| Extension | Language |
| --- | --- |
| `.js`, `.mjs`, `.cjs` | JavaScript |
| `.ts`, `.tsx`, `.mts`, `.d.ts` | TypeScript |
| `.py` | Python |
| `.sh`, `.bash` | Shell |
| `.json`, `.jsonc` | Config |

**Language Detection: Keyword Weights**

| Language | Strong Keywords (weight) |
| --- | --- |
| JavaScript | `module.exports` (2.1), `commonjs` (2.0), `node` (1.8) |
| TypeScript | `typescript` (2.4), `tsconfig` (2.1), `interface` (2.0) |
| Python | `python` (2.3), `pytest` (2.0), `argparse` (1.7) |
| Shell | `bash` (2.2), `pipefail` (1.7), `shebang` (1.5) |
| Config | `jsonc` (2.1), `json` (2.0), `schema` (1.8) |

**Naming Matrix**

| Element | JavaScript | TypeScript | Python | Shell | Config |
| --- | --- | --- | --- | --- | --- |
| Functions | `camelCase` | `camelCase` | `snake_case` | `snake_case` | N/A |
| Constants | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPERCASE` | N/A |
| Classes | `PascalCase` | `PascalCase` | `PascalCase` | N/A | N/A |
| Interfaces | N/A | `PascalCase` | N/A | N/A | N/A |
| Types | N/A | `PascalCase` | N/A | N/A | N/A |
| Generics | N/A | `T`-prefix | N/A | N/A | N/A |
| Variables | `camelCase` | `camelCase` | `snake_case` | `lower_snake` | `camelCase` |
| Booleans | `is`/`has` | `is`/`has` | `is_`/`has_` | `is_`/`has_` | N/A |
| Private | `_prefix` | `_prefix` | `_prefix` | `_prefix` | N/A |

**Quality Gate Priority Levels**

| Gate | Criteria | Priority |
| --- | --- | --- |
| File Header | Matches language-specific box-drawing format | P0 |
| Naming Convention | Consistent throughout the file | P0 |
| No Commented Code | Zero commented-out code blocks | P0 |
| Header Invariant | Numbered ALL-CAPS section headers preserved | P0 |
| Alignment Verifier | No ERROR findings on changed scope | P0 |
| Filesystem Safety | Canonical path containment on create/move/delete | P0 |
| Spec Folder Safety | `NNN-name` validation and approved roots | P0 |
| Error Handling | All error paths handled | P1 |
| Comment Policy | Max 3/10, WHY-only (manual checklist gate) | P1 |
| KISS/DRY/SOLID | SRP/OCP/LSP/ISP/DIP violations identified | P1 |
| Documentation | Public functions have doc comments | P1 |
| Reference Comments | T###/BUG-###/REQ-### where applicable | P2 |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
sk-code--opencode/
├── SKILL.md                              # AI agent instructions, routing logic, all rules
├── README.md                             # This file
├── scripts/
│   └── verify_alignment_drift.py         # Alignment verifier: severity-aware rule checking
├── references/
│   ├── shared/
│   │   ├── universal_patterns.md         # Naming, commenting principles (loaded always)
│   │   ├── code_organization.md          # File structure, section conventions (loaded always)
│   │   └── alignment_verification_automation.md  # Verifier contract and automation workflow
│   ├── javascript/
│   │   ├── style_guide.md                # JS box-drawing headers, 'use strict', section format
│   │   ├── quality_standards.md          # Error handling, guard clauses, logging
│   │   └── quick_reference.md            # JS cheat sheet
│   ├── typescript/
│   │   ├── style_guide.md                # TS module headers, tsconfig strict, type patterns
│   │   ├── quality_standards.md          # TSDoc, type guards, interface conventions
│   │   └── quick_reference.md            # TS cheat sheet
│   ├── python/
│   │   ├── style_guide.md                # Python shebang, box header, Google docstrings
│   │   ├── quality_standards.md          # try-except, specific exceptions, return tuples
│   │   └── quick_reference.md            # Python cheat sheet
│   ├── shell/
│   │   ├── style_guide.md                # Bash shebang, set -euo pipefail, quoting
│   │   ├── quality_standards.md          # Exit codes, error messages, ShellCheck compliance
│   │   └── quick_reference.md            # Shell cheat sheet
│   └── config/
│       ├── style_guide.md                # JSONC box comment headers, $schema, key ordering
│       ├── quality_standards.md          # Schema validation, comment-aware parsing
│       └── quick_reference.md            # Config cheat sheet
└── assets/
    └── checklists/
        ├── universal_checklist.md        # Cross-language P0 items
        ├── javascript_checklist.md       # JS-specific validation
        ├── typescript_checklist.md       # TS-specific validation
        ├── python_checklist.md           # Python-specific validation
        ├── shell_checklist.md            # Shell-specific validation
        └── config_checklist.md           # JSON/JSONC validation
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

This skill has no runtime configuration file. Behavior is controlled by the router logic in `SKILL.md §2` and the reference files in `references/`.

**Alignment verifier flags:**

| Flag | Default | Effect |
| --- | --- | --- |
| `--root <path>` | Required | Scope of the alignment check |
| `--fail-on-warn` | Off | Treat WARN findings as ERROR (strict mode) |

**Context-aware advisory downgrade paths (verifier applies reduced severity here):**

| Path Pattern | Reason for Downgrade |
| --- | --- |
| `z_archive/`, `scratch/` | Archival or experimental content, not production |
| `memory/`, `research/` | Generated or exploratory content |
| `context/`, `assets/`, `examples/`, `fixtures/` | Support content, not source modules |
| `*.test.ts`, `*.spec.ts`, `*.vitest.ts` and TSX variants | Test files exempt from module-header enforcement |
| `.mjs` files | Exempt from JavaScript strict-mode enforcement |
| `tsconfig*.json` | Comment-aware parsing fallback applied |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: New JavaScript MCP server module**

```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ memory-search                                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const { searchIndex } = require('./index');

// ─────────────────────────────────────────────────────────────────────────────
// 2. SEARCH
// ─────────────────────────────────────────────────────────────────────────────

// REQ-033: surface constitutional memories at top regardless of query
function searchMemories(query, options) {
  if (!query) throw new Error('Query required');
  return searchIndex(query, options);
}

module.exports = { searchMemories };
```

**Example 2: New Python validation script**

```python
#!/usr/bin/env python3
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ validate_spec_folder                                                     ║
# ╚══════════════════════════════════════════════════════════════════════════╝
"""Validates spec folder structure and naming conventions."""

# ─────────────────────────────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────────────────────────────
import sys
import argparse
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# 2. VALIDATION
# ─────────────────────────────────────────────────────────────────────────────

def validate_folder(path: str) -> tuple[bool, str]:
    """Validate a spec folder path against NNN-name convention."""
    resolved = Path(path)
    if not resolved.exists():
        return False, f"Path not found: {path}"
    return True, "Valid"
```

**Example 3: Shell automation script**

```bash
#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ sync-skills                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Synchronises skill symlinks across runtime directories.

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="${SCRIPT_DIR}/../.opencode/skill"

# ─────────────────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

sync_link() {
    local target="$1"
    local link="$2"
    if [[ ! -e "$link" ]]; then
        ln -s "$target" "$link"
    fi
}
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**Alignment verifier reports ERROR on a file you did not modify**

What you see: `verify_alignment_drift.py` flags a file outside your change set with an ERROR finding.

Common causes: The `--root` argument points to a parent directory that includes unrelated files. A previous change introduced a header violation that was not caught at the time.

Fix: Narrow the `--root` scope to the specific directory or file you changed. If the pre-existing violation is in a file you did not touch, open a separate task to fix it. Do not include unrelated fixes in the current change.

---

**Language detection routes to the wrong language**

What you see: A TypeScript task loads JavaScript references.

Common causes: The file extension was not provided in the task description. The keyword scores for JavaScript and TypeScript were within the 0.8 ambiguity delta, and JavaScript scored marginally higher.

Fix: Include the file extension explicitly in the task description, or name the language directly ("TypeScript interface in `config.ts`"). Extension-based detection is deterministic and always overrides keyword scoring.

---

**`'use strict'` added to an `.mjs` file**

What you see: An `.mjs` file receives a `'use strict'` directive during a standards pass.

Common causes: The JavaScript style guide was applied without checking the file extension. `.mjs` files use ES module syntax and do not accept `'use strict'` as a pragma.

Fix: The alignment verifier skips strict-mode enforcement for `.mjs` files by design. Remove the directive from the `.mjs` file. Apply `'use strict'` only to `.js` and `.cjs` files.

---

**Commented-out code flagged as P0 blocker**

What you see: The completion checklist fails on "No Commented Code" and the change cannot be marked done.

Common causes: Old code was commented out during debugging and left in the file. Unused function variants were preserved "just in case."

Fix: Delete the commented-out code. Git history preserves every line ever committed. There is no need to keep code in comments. If the code might be needed, create a separate branch or note the pattern in a task reference comment (T### or BUG-###) with the branch name.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: This skill covers standards only. What about the full development lifecycle (debugging, verification phases)?**

A: This skill is a standards overlay, not a lifecycle orchestrator. It answers "how should this code be written and formatted?" not "how do I implement, debug, and verify a feature end-to-end?" For the full three-phase lifecycle (Implementation, Testing and Debugging, Verification), use `sk-code--full-stack`. For OpenCode system code specifically, invoke `sk-code--opencode` alongside `sk-code--full-stack` to apply both the standards overlay and the lifecycle orchestration.

**Q: Why are the file headers mandatory? They add visual noise.**

A: File headers serve machine and human readers equally. The box-drawing format creates a consistent anchor point that tools can scan for module identification without parsing the entire file. For AI assistants reading large codebases, a consistent header format means the module name and type are always at line 1. The "visual noise" tradeoff is intentional. The header is the least ambiguous place to state what a file is. Comments inside the code body get removed or moved. Headers stay put.

**Q: What does "purposeful WHY comment" mean in practice?**

A: A WHY comment records a decision that is not visible from the code. It answers "why is this written this way and not another way?" Examples: "Reverse order preserves dependency resolution." "Skip initialization to prevent double-binding." "REQ-033: transaction manager for pending file recovery." A WHAT comment describes what the code does, which any developer can read directly. "Loop through items." "Set value to 42." These add nothing and clutter the file. When in doubt, ask: if this comment were deleted, would a future developer make a different decision? If yes, keep it. If no, delete it.

**Q: Can I use this skill for web frontend code?**

A: No. This skill covers OpenCode system code: MCP servers, validators, advisors, automation scripts, and configuration files. For web and frontend development (DOM APIs, CSS, browser-specific JavaScript, CDN workflows, responsive design), use `sk-code--web`. The boundary is clear: system code that runs in Node.js, Python, or Shell belongs here. Code that runs in a browser belongs in `sk-code--web`.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource | Path | Purpose |
| --- | --- | --- |
| SKILL.md | `.opencode/skill/sk-code--opencode/SKILL.md` | AI agent instructions, full routing pseudocode, all rules |
| Alignment verifier | `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` | Severity-aware rule compliance checker |
| Universal patterns | `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md` | Cross-language naming and commenting principles |
| Code organization | `.opencode/skill/sk-code--opencode/references/shared/code_organization.md` | File structure and section conventions |
| Verifier contract | `.opencode/skill/sk-code--opencode/references/shared/alignment_verification_automation.md` | Verifier output contract and automation workflow |
| Universal checklist | `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md` | Cross-language P0 quality gates |
| sk-code--full-stack | `.opencode/skill/sk-code--full-stack/SKILL.md` | Full development lifecycle orchestration across stacks |
| sk-code--review | `.opencode/skill/sk-code--review/SKILL.md` | Findings-first code review, severity model, merge decisions |
| sk-code--web | `.opencode/skill/sk-code--web/SKILL.md` | Web and frontend development, browser testing |
| sk-doc | `.opencode/skill/sk-doc/SKILL.md` | Markdown documentation, skill creation, DQI scoring |
| system-spec-kit | `.opencode/skill/system-spec-kit/SKILL.md` | Spec folder management, memory system, context preservation |
| sk-git | `.opencode/skill/sk-git/SKILL.md` | Git workflows, commit hygiene, PR creation |

<!-- /ANCHOR:related-documents -->
