---
title: "Template Renderers"
description: "Template rendering helpers for Spec Kit script output."
trigger_phrases:
  - "template renderer"
  - "populate template"
  - "spec template rendering"
---

# Template Renderers

> Template rendering source for script-generated markdown output.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SURFACE](#2--surface)
- [3. EXPORTS](#3--exports)
- [4. ALLOWED IMPORTS](#4--allowed-imports)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES](#6--boundaries)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/renderers/` owns the small template engine used by script flows that turn collected context into markdown output. It reads source templates, expands Mustache-like sections and variables, and removes template-only comments before files are written.

Runtime code imports the compiled output from `scripts/dist/renderers/`. Source edits belong in `scripts/renderers/*.ts`.

Use this folder when a script needs template expansion that is shared across spec generation, context saving, or report output. Keep template selection and file-write policy in the caller.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:surface -->
## 2. SURFACE

| Surface | Purpose |
|---|---|
| `populateTemplate()` | Loads a named template from `CONFIG.TEMPLATE_DIR`, renders it, and strips template config comments. |
| `renderTemplate()` | Renders a template string with variables, sections, inverted sections, comments and array loops. |
| Cleanup helpers | Normalize excess newlines and remove template instruction blocks before write. |
| `TemplateContext` | Shared data shape for renderer input. |

<!-- /ANCHOR:surface -->
<!-- ANCHOR:exports -->
## 3. EXPORTS

`index.ts` is the folder entrypoint. It exports:

- `populateTemplate`
- `renderTemplate`
- `TemplateContext`

`template-renderer.ts` also exports helper functions used by focused tests and adjacent script modules:

- `cleanupExcessiveNewlines`
- `stripTemplateConfigComments`
- `isFalsy`

<!-- /ANCHOR:exports -->
<!-- ANCHOR:allowed-imports -->
## 4. ALLOWED IMPORTS

| Import | Rule |
|---|---|
| Node built-ins | `fs/promises` and `path` are allowed for template loading. |
| `../core/index.js` | Allowed for `CONFIG.TEMPLATE_DIR`. |
| `../utils/logger.js` | Allowed for missing placeholder warnings. |
| `scripts/dist/` | Do not import compiled output from source files. |
| MCP server modules | Do not import MCP server runtime modules from this folder. |

<!-- /ANCHOR:allowed-imports -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `template-renderer.ts` | Template expansion, missing placeholder handling, value escaping and output cleanup. |
| `index.ts` | Public barrel for renderer imports. |
| `README.md` | Folder contract for maintainers and reviewers. |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Rendering | Expand variables, sections, inverted sections and arrays. |
| Template lookup | Load templates from the configured template directory only. |
| Caller control | Keep destination paths, overwrite rules and workflow decisions outside this folder. |
| Runtime separation | Do not import MCP server runtime modules or compiled output into source renderer files. |

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

- Call `populateTemplate()` when a script needs to load and render a named template file.
- Call `renderTemplate()` when a caller already has the template string in memory.
- Import `TemplateContext` when typing context objects passed into renderer functions.
- Use `cleanupExcessiveNewlines()` and `stripTemplateConfigComments()` only for focused tests or adjacent script cleanup.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root:

```bash
cd .opencode/skill/system-spec-kit/scripts && npm run build
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/renderers/README.md
```

Expected result: TypeScript builds and README validation exits `0` with no HVR issues.

<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 9. RELATED

- [Core script modules](../core/README.md)
- [Script utilities](../utils/README.md)
- [System Spec Kit scripts](../README.md)

<!-- /ANCHOR:related -->
