---
title: Code Folder README Template
description: Template for source-directory READMEs that explain purpose, architecture zones, package topology, boundaries, entrypoints and validation.
---

# Code Folder README Template

Use this template for source directories such as `mcp_server/tools/`, `src/components/`, `packages/api/` or subsystem folders. It explains how a code folder works now. It is not a project marketing page, skill README or full install guide.

---

## 1. WHEN TO USE

Create a code-folder README when a developer needs local orientation before editing the directory.

Include details when relevant:

- High-level purpose: what the folder owns.
- Architecture diagram: how callers, handlers, adapters and storage relate.
- Package topology: layers, zones and allowed dependency direction.
- Directory tree with only important files.
- Key files and responsibilities.
- Boundaries: what this folder may import, export or own.
- Data or control flow through important paths.
- Public entrypoints, exports or commands.
- Validation and test commands.
- Related documents.

Skip sections that do not apply. Keep the README short enough to scan before opening source files.

---

## 2. CONTENT MODEL

The compact `mcp_server/tools/README.md` pattern is the default: frontmatter, short overview, architecture diagram, directory tree, implemented state and related docs.

Use the broader `ARCHITECTURE.md` pattern only when the folder needs system-level behavior, package zones, dependency direction or data/control flow.

| Section | Include When | Notes |
|---|---|---|
| Overview | Always | One or two paragraphs about current responsibility |
| Architecture Diagram | Helpful for dispatch, pipelines, adapters or layered flows | Unicode box diagram preferred |
| Package Topology | The folder has layers, zones or import rules | Show dependency direction clearly |
| Directory Tree | Always for multi-file folders | Show only important files |
| Key Files | Always when responsibilities are split | Table with file and role |
| Boundaries | Relevant for import rules or ownership | State allowed and disallowed edges |
| Data or Control Flow | Relevant for handlers, pipelines or runtime paths | Keep to the main path |
| Entrypoints | Relevant when the folder exposes APIs, commands or exports | Include function names, files or CLI commands |
| Validation | Relevant when tests or checks exist | Use commands that work from repo root |
| Related | Always when nearby docs exist | Link parent, sibling and architecture docs |

---

## 3. ARCHITECTURE PATTERNS

Model diagrams on the package-level `ARCHITECTURE.md` style, scaled down to one folder. Prefer zones and arrows over prose when the folder has clear runtime paths.

### High-Level Architecture Example

```text
╭──────────────────────────────────────────────────────────────────╮
│                         [FOLDER NAME]                            │
╰──────────────────────────────────────────────────────────────────╯

┌─────────────┐      ┌────────────────┐      ┌────────────────┐
│ Callers     │ ───▶ │ Public API     │ ───▶ │ Handler Layer  │
│ CLI / MCP   │      │ index.ts       │      │ handlers/*     │
└──────┬──────┘      └───────┬────────┘      └────────┬───────┘
       │                     │                        │
       │                     ▼                        ▼
       │             ┌───────────────┐        ┌───────────────┐
       └──────────▶  │ Domain Lib    │ ───▶   │ Storage or IO │
                     │ lib/*         │        │ db / fs / net │
                     └───────┬───────┘        └───────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Shared Types  │
                     └───────────────┘

Dependency direction:
Public API ───▶ handlers ───▶ lib ───▶ adapters
Lib ───▶ shared types
Adapters do not import handlers
```

### Package Topology Example

```text
[folder]/
+-- index.ts              # Public exports only
+-- handlers/             # Runtime entrypoints, thin orchestration
+-- lib/                  # Domain logic and pure helpers
|   +-- pipeline/          # Ordered processing stages
|   `-- validation/        # Input and invariant checks
+-- adapters/             # Filesystem, database or network edges
+-- schemas/              # Zod, JSON Schema or typed contracts
`-- tests/                # Unit and integration coverage

Allowed direction:
index.ts → handlers/ → lib/ → adapters/
handlers/ → schemas/
lib/ → schemas/

Disallowed direction:
lib/ → handlers/
adapters/ → handlers/
tests/ → private fixtures outside this folder without a reason
```

### Data Or Control Flow Example

```text
╭──────────────────────────────────────────╮
│ [caller]                                 │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [public export or route]                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [input schema validation]                │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [handler orchestration]                  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [domain pipeline]                        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [adapter or side effect]                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [response formatter]                     │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ [caller receives typed result]           │
╰──────────────────────────────────────────╯
```

---

## 4. WRITING RULES

- Document current behavior only.
- Use code terms exactly as they appear in files.
- Prefer file paths, exported names and commands over narrative history.
- Keep diagrams small enough to read in a terminal.
- State allowed dependency direction when the folder has layers.
- Remove optional sections when they do not apply.
- Do not cite spec packet numbers, phase IDs or migration notes.
- Follow HVR: no em dashes, no semicolon characters, no banned terms and no setup phrases.

---

## 5. FILLABLE SCAFFOLD

Copy this scaffold, then remove sections that do not apply.

````markdown
---
title: "[Folder Name]: [Responsibility]"
description: "[One-sentence current responsibility.]"
trigger_phrases:
  - "[folder concept]"
---

# [Folder Name]: [Responsibility]

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. ARCHITECTURE](#2-architecture)
- [3. PACKAGE TOPOLOGY](#3-package-topology)
- [4. DIRECTORY TREE](#4-directory-tree)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES AND FLOW](#6-boundaries-and-flow)
- [7. ENTRYPOINTS](#7-entrypoints)
- [8. VALIDATION](#8-validation)
- [9. RELATED](#9-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`[folder]/` [describes what this directory owns]. It [maps input to output, groups related modules or provides a package boundary].

Current state:

- [Implemented behavior or responsibility]
- [Important invariant or constraint]
- [Runtime relationship to parent package]

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

Include this section when a diagram explains the folder faster than prose.

```text
╭──────────────────────────────────────────────────────────────────╮
│                         [FOLDER NAME]                            │
╰──────────────────────────────────────────────────────────────────╯

┌─────────────┐      ┌────────────────┐      ┌────────────────┐
│ [Callers]   │ ───▶ │ [Public API]   │ ───▶ │ [Handlers]     │
└──────┬──────┘      └───────┬────────┘      └────────┬───────┘
       │                     │                        │
       │                     ▼                        ▼
       │             ┌───────────────┐        ┌───────────────┐
       └──────────▶  │ [Domain Lib]  │ ───▶   │ [Adapter]     │
                     └───────┬───────┘        └───────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ [Shared Types]│
                     └───────────────┘

Dependency direction: [zone-a] ───▶ [zone-b] ───▶ [zone-c]
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

Use this section when imports, layers or ownership boundaries matter.

```text
[folder]/
+-- index.ts              # Public exports only
+-- handlers/             # Runtime entrypoints
+-- lib/                  # Domain logic
|   +-- pipeline/          # Ordered stages
|   `-- validation/        # Checks and guards
+-- adapters/             # External IO boundary
+-- schemas/              # Input and output contracts
`-- tests/                # Coverage for this folder
```

Allowed dependency direction:

```text
index.ts → handlers/ → lib/ → adapters/
handlers/ → schemas/
lib/ → schemas/
```

Disallowed dependency direction:

```text
lib/ → handlers/
adapters/ → handlers/
private modules → public API barrels when this creates a cycle
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
[folder]/
+-- [file-a.ts]          # [Responsibility]
+-- [file-b.ts]          # [Responsibility]
+-- [subfolder]/         # [Responsibility]
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `[file-a.ts]` | [What it owns] |
| `[file-b.ts]` | [What it owns] |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

Include this section when the folder has important import rules, ownership boundaries or runtime paths.

| Boundary | Rule |
|---|---|
| Imports | [Allowed imports or disallowed internals] |
| Exports | [Public files, functions or package exports] |
| Ownership | [What belongs here and what belongs elsewhere] |

Main flow:

```text
╭──────────────────────────────────────────╮
│ [input or caller]                        │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [entrypoint]                             │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [schema or guard]                        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [processing module]                      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ [adapter, output or side effect]         │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ [formatted result]                       │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `[exportedName]` | Function | [What callers use it for] |
| `[command]` | CLI | [What it runs] |
| `[file.ts]` | Module | [Why readers open it first] |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root unless noted.

```bash
[test or validation command]
```

Expected result: [success signal].

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`[Parent README]`](../README.md)
- [`[Architecture Doc]`](../../ARCHITECTURE.md)
- [`[Sibling Folder]`](../sibling/README.md)

<!-- /ANCHOR:related -->
````

---

## 6. FINAL CHECKLIST

- [ ] The README states what the folder owns.
- [ ] Architecture diagrams use real folder zones and arrows.
- [ ] Package topology states allowed dependency direction when layers exist.
- [ ] The directory tree includes only useful files and folders.
- [ ] Key files have clear responsibilities.
- [ ] Optional architecture, boundary, flow, entrypoint and validation sections are present only when relevant.
- [ ] Commands were tested or marked as examples.
- [ ] Links resolve relative to the README location.
- [ ] HVR passes: no em dashes, no semicolon characters, no banned terms and no setup phrases.
