---
title: "Template Scripts: Inline Gate Rendering"
description: "Template rendering scripts for Level-gated markdown content."
trigger_phrases:
  - "inline gate renderer"
  - "template rendering"
  - "level gated templates"
---

# Template Scripts: Inline Gate Rendering

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. USAGE NOTES](#4--usage-notes)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`scripts/templates/` owns the inline gate renderer used to produce Level-specific markdown from shared templates. It evaluates `<!-- IF ... -->` blocks and emits only the content that applies to the requested Level.

Current responsibilities:

- Parse `level:` gate expressions with `AND`, `OR`, `NOT` and parentheses.
- Render markdown templates while preserving fenced code behavior.
- Provide a shell wrapper for callers that need a stable executable entrypoint.

## 2. DIRECTORY TREE

```text
templates/
+-- inline-gate-renderer.sh  # Bash wrapper for shell callers
+-- inline-gate-renderer.ts  # Gate expression parser and markdown renderer
`-- README.md
```

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `inline-gate-renderer.ts` | Implements expression parsing, gate evaluation and template rendering. |
| `inline-gate-renderer.sh` | Runs the TypeScript renderer through the local `tsx` loader. |

## 4. USAGE NOTES

- Supported render levels are `1`, `2`, `3`, `3+` and `phase`.
- Gate markers are ignored inside fenced code blocks so examples remain intact.
- Empty gate markers are validated and removed from output.
- Use the shell wrapper when a Bash script needs to call the renderer.

## 5. VALIDATION

Run from the repository root:

```bash
python .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/templates/README.md
```

Expected result: the README validation exits `0`.

## 6. RELATED

- [`scripts/`](../README.md)
- [`inline-gate-renderer.ts`](./inline-gate-renderer.ts)
- [`inline-gate-renderer.sh`](./inline-gate-renderer.sh)
