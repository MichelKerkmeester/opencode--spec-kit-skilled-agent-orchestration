---
title: Universal Code Style Guide (Language-Agnostic)
description: Stack-agnostic naming, formatting, and structure principles. Stack-specific rules (snake_case for web JS, BEM for CSS, etc.) live under references/<stack>/.
keywords: [code-style, naming, formatting, universal, stack-agnostic]
---

# Universal Code Style Guide

Stack-agnostic style principles. The actual naming convention (snake_case vs camelCase vs PascalCase) is **stack-specific** and lives under `references/<stack>/`; this doc captures the universal rules that hold across stacks.

> **Web stack note**: For Webflow-specific style enforcement (snake_case JS, file headers with box-drawing characters, semantic CSS custom property prefixes, BEM naming, GPU-only animation properties), see `references/web/standards/code_style_guide.md` and `references/web/standards/code_style_enforcement.md`.

---

## 1. NAMING (universal principles)

### 1.1 Names communicate intent

- A name should answer: *what does this represent / do / configure?*
- Reader-friendly > author-friendly. Optimize for the future reader, not for typing speed.
- A name with `_temp`, `_new`, `_v2` is a smell — it suggests the author didn't have a clear concept.

### 1.2 Stack-appropriate convention

Each stack has a community convention. Follow the stack convention; don't invent your own.

| Stack | Identifier convention |
|---|---|
| WEB JavaScript (this user's projects) | `snake_case` for variables/functions; `PascalCase` for classes/types; `UPPER_SNAKE` for constants |
| TypeScript / React / Next | `camelCase` for variables/functions; `PascalCase` for components/types; `UPPER_SNAKE` for constants |
| Go | `camelCase` (unexported), `PascalCase` (exported); short receiver names; no underscores |
| Swift | `camelCase` for properties/methods; `PascalCase` for types; `UPPER_SNAKE` not idiomatic — use `static let` |
| Python | `snake_case` for variables/functions; `PascalCase` for classes; `UPPER_SNAKE` for constants |

The stack-specific code quality checklist (see `code_quality_standards.md` §5) enforces the convention.

### 1.3 Universal anti-patterns

- Type-coded prefixes (`strName`, `iCount`) — your tooling tells you the type
- Hungarian notation in modern languages — leave it in COBOL
- Single-letter names for non-trivial scope (loop counters okay; algorithm coefficients okay; business logic NOT okay)
- Negated booleans (`is_not_ready`) — flip the polarity (`is_ready`) and let callers negate
- Magic numbers — name the value if it has meaning

---

## 2. FILE STRUCTURE (universal principles)

### 2.1 One thing per file

- A file represents one concept (one component, one service, one type system, one workflow)
- Multiple unrelated exports in one file is a smell

### 2.2 Stable import / structure order

Most communities have a conventional order. Follow it.

| Stack | Top-of-file order |
|---|---|
| WEB JS | File header (box-drawing) → constants → utils → main IIFE → init |
| TS / React | Imports (external → local) → types/interfaces → component → exports |
| Go | Package decl → imports → constants → types → functions (exported first) |
| Swift | Imports → types/extensions → main type → fileprivate helpers |
| Python | Module docstring → imports (stdlib → third-party → local) → constants → classes/functions |

### 2.3 Keep files small

- Hard to read > hard to navigate. Split files when they exceed ~500 lines or contain 3+ unrelated concepts.
- Exception: data files (constants, fixtures) can be large; that's fine.

---

## 3. COMMENTING (universal — see project CLAUDE.md for the strict version)

### 3.1 Default to no comments

Well-named identifiers and clear structure self-document. Add a comment only when:
- A hidden constraint exists (e.g. "this works around browser bug X")
- A non-obvious invariant must be preserved (e.g. "must run before init Y")
- A workaround references a specific issue (e.g. "see issue #1234")
- Behavior would surprise a reader

### 3.2 Never comment what the code does

```python
# BAD — explains the WHAT
i += 1  # increment i

# GOOD — explains the WHY
# Skip the first row because it's the header.
i += 1
```

### 3.3 No commented-out code

Delete it. Git history preserves it. Commented code is cognitive load with no payoff.

### 3.4 Stack-specific commenting overlays

Some stacks have additional commenting conventions (e.g. WEB JS uses three-line file headers with box-drawing characters; Go expects `// FunctionName ...` for exported functions). See the stack-specific style guide for those.

---

## 4. FORMATTING

### 4.1 Use the language's standard formatter

| Stack | Formatter |
|---|---|
| WEB JS / TS | Prettier |
| Go | `gofmt` (or `goimports`) |
| Swift | `swift-format` or SwiftLint |
| Python | Black / Ruff |

Don't fight the formatter. Configure once at the project root and never overwrite.

### 4.2 Line length

- Soft limit ~100-120 chars (matches most modern editors at split-view)
- Hard wrap only when it improves readability
- Don't wrap-for-wrap's-sake

---

## 5. STACK-SPECIFIC POINTERS

For the rules that ARE language-specific, see:

| Stack | Reference |
|---|---|
| WEB | `references/web/standards/code_style_guide.md` (snake_case JS, semantic CSS prefixes, BEM, GPU animation) |
| GO / NODEJS / REACT / RN / SWIFT | `references/<stack>/_placeholder.md` (canonical content retired) |
