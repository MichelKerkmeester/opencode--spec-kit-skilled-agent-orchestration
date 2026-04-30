---
title: Universal Code Style Guide
description: Language-agnostic naming, file structure, commenting, and formatting principles that hold across WEBFLOW, NEXTJS, and GO.
---

# Universal Code Style Guide

Language-agnostic style principles. Naming conventions and stack-specific enforcement live in each stack's standards doc; this file captures the universal rules.

---

## 1. OVERVIEW

### Purpose

Codifies the style principles that apply regardless of stack — naming intent, file organization, commenting discipline, formatter use. The actual identifier convention (snake_case for WEBFLOW JS, camelCase for TypeScript, PascalCase for Go exported names) is stack-specific and lives under `references/{webflow,nextjs,go}/standards/`. Use this doc when the project lacks a stack-specific style guide, when reviewing a cross-stack convention question, or when a contributor is new to the stack.

### Core Principle

Names communicate intent. Files express one concept. Comments explain WHY (never WHAT). Formatters are not negotiable.

### When to Use

- When picking a name for a new variable, function, type, or file.
- When deciding how to lay out a file's top-of-file structure.
- When deciding whether to add a comment.
- When a reviewer flags a style nit and you need the cross-stack contract.

### Key Sources

- Per-stack style guides: `references/webflow/standards/code_style_guide.md`, `references/nextjs/standards/code_style.md`, `references/go/standards/code_style.md`.
- Project-level enforcement (banned phrases, voice rules): the project CLAUDE.md / AGENTS.md is authoritative for this user's projects.

---

## 2. NAMING (universal principles)

### Names communicate intent

- A name should answer: *what does this represent / do / configure?*
- Reader-friendly beats author-friendly. Optimize for the future reader, not for typing speed.
- A name with `_temp`, `_new`, `_v2` is a smell — it suggests the author didn't have a clear concept.

### Stack-appropriate convention

Each stack has a community convention. Follow the stack convention; do not invent your own.

| Stack                | Identifier convention                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| WEBFLOW (vanilla JS) | `snake_case` for variables/functions; `PascalCase` for classes/types; `UPPER_SNAKE` for constants            |
| NEXTJS (TypeScript)  | `camelCase` for variables/functions; `PascalCase` for components/types; `UPPER_SNAKE` for constants; `kebab-case` for CSS class names |
| GO                   | `camelCase` (unexported), `PascalCase` (exported); short receiver names; no underscores                      |
| Python (sidecar)     | `snake_case` for variables/functions; `PascalCase` for classes; `UPPER_SNAKE` for constants                  |

The per-stack code quality checklist (see `code_quality_standards.md` §6) enforces the convention.

### Universal anti-patterns

- Type-coded prefixes (`strName`, `iCount`) — your tooling tells you the type.
- Hungarian notation in modern languages — leave it in COBOL.
- Single-letter names for non-trivial scope (loop counters fine; algorithm coefficients fine; business logic NOT fine).
- Negated booleans (`is_not_ready`) — flip the polarity (`is_ready`) and let callers negate.
- Magic numbers — name the value if it has meaning.

---

## 3. FILE STRUCTURE (universal principles)

### One thing per file

- A file represents one concept (one component, one service, one type system, one workflow).
- Multiple unrelated exports in one file is a smell.

### Stable import / structure order

Most communities have a conventional order. Follow it.

| Stack       | Top-of-file order                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| WEBFLOW JS  | File header (box-drawing) → constants → utilities → main IIFE → init                                     |
| NEXTJS / TS | Imports (external → local) → types/interfaces → component → exports                                     |
| GO          | Package decl → imports → constants → types → functions (exported first)                                 |
| Python      | Module docstring → imports (stdlib → third-party → local) → constants → classes/functions              |

### Keep files small

- Hard to read beats hard to navigate. Split files when they exceed roughly 500 lines or contain three or more unrelated concepts.
- Exception: data files (constants, fixtures) can be large; that is fine.

---

## 4. COMMENTING (universal — see project CLAUDE.md for the strict version)

### Default to no comments

Well-named identifiers and clear structure self-document. Add a comment only when:

- A hidden constraint exists (for example, "this works around browser bug X").
- A non-obvious invariant must be preserved (for example, "must run before init Y").
- A workaround references a specific issue (for example, "see issue #1234").
- Behavior would surprise a reader.

### Never comment what the code does

```python
# BAD — explains the WHAT
i += 1  # increment i

# GOOD — explains the WHY
# Skip the first row because it's the header.
i += 1
```

### No commented-out code

Delete it. Git history preserves it. Commented code is cognitive load with no payoff.

### Stack-specific commenting overlays

Some stacks have additional commenting conventions (WEBFLOW JS uses three-line file headers with box-drawing characters; Go expects `// FunctionName ...` for exported functions). See the per-stack style guide.

---

## 5. FORMATTING

### Use the language's standard formatter

| Stack       | Formatter                       |
| ----------- | ------------------------------- |
| WEBFLOW JS  | Prettier                        |
| NEXTJS / TS | Prettier (Next.js project default) |
| GO          | `gofmt` (or `goimports`)        |
| Python      | Black or Ruff                   |

Don't fight the formatter. Configure once at the project root and never overwrite manually.

### Line length

- Soft limit roughly 100-120 characters (matches most modern editors at split-view).
- Hard wrap only when it improves readability.
- Don't wrap-for-wrap's-sake.

---

## 6. STACK-SPECIFIC POINTERS

For the rules that ARE language-specific, see:

| Stack    | Reference                                                                                  |
| -------- | ------------------------------------------------------------------------------------------ |
| WEBFLOW  | `references/webflow/standards/code_style_guide.md` (snake_case JS, semantic CSS prefixes, BEM, GPU animation) |
| NEXTJS   | `references/nextjs/standards/code_style.md` (TypeScript strict, file organization)         |
| GO       | `references/go/standards/code_style.md` (gofmt, error wrapping, context propagation)       |

---

## 7. RELATED RESOURCES

- `references/universal/code_quality_standards.md` - severity tiers (P0/P1/P2) that wrap per-stack style enforcement.
- `references/universal/error_recovery.md` - what to do when a style violation can't be auto-fixed.
- Per-stack standards under `references/{webflow,nextjs,go}/standards/`.
- `assets/{webflow,nextjs,go}/checklists/code_quality_checklist.md` - the per-stack checklists that operationalize this guide.
