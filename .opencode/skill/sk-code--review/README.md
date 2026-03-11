# sk-code--review

Stack-agnostic baseline code-review skill for any codebase.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. WHAT THIS SKILL ADDS](#2--what-this-skill-adds)
- [3. INTENDED USAGE](#3--intended-usage)
- [4. PACKAGE STRUCTURE](#4--package-structure)
- [5. VALIDATION](#5--validation)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This skill defines universal findings-first review principles and mandatory security and correctness minimums. It is designed to run with one stack overlay skill:

- `sk-code--opencode` for OpenCode system code
- `sk-code--web` for frontend and web code
- `sk-code--full-stack` as the default fallback

<!-- /ANCHOR:overview -->

---

## 2. WHAT THIS SKILL ADDS

- Severity-ordered findings (`P0` to `P3`) with file:line evidence
- Baseline+overlay standards contract with explicit precedence
- Security and correctness minimum floor that overlays cannot weaken
- SOLID, quality and removal-plan references for consistent review output

---

## 3. INTENDED USAGE

Use this skill when review intent is explicit, for example:

- "Review this PR for blockers"
- "Run a security-focused code review"
- "Quality gate this diff before merge"
- "Find P0/P1 issues and propose fixes"

Default behavior is review-first and read-only findings.

---

## 4. PACKAGE STRUCTURE

```text
sk-code--review/
├── SKILL.md
├── README.md
└── references/
    ├── quick_reference.md
    ├── solid_checklist.md
    ├── security_checklist.md
    ├── code_quality_checklist.md
    ├── test_quality_checklist.md
    └── removal_plan.md
```

---

## 5. VALIDATION

Run validation from repo root:

```bash
python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/sk-code--review --json
python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-code--review
```
