---
title: "Spec Folder Utilities"
description: "TypeScript utilities for spec-folder detection, alignment checks, metadata generation and nested changelog output."
trigger_phrases:
  - "spec folder detection"
  - "alignment validation"
  - "folder utilities"
---

# Spec Folder Utilities

> TypeScript utilities that resolve spec folders, score folder alignment and generate packet metadata.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY FILES](#3--key-files)
- [4. COMMANDS](#4--commands)
- [5. BOUNDARIES](#5--boundaries)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/spec-folder/` contains source modules used by memory save and spec-maintenance workflows. The utilities detect active spec folders, validate content-to-folder alignment, create required packet directories, generate `description.json`, and build nested changelog data for root specs or phase children.

Current state:

- Source of truth is `scripts/spec-folder/*.ts`.
- Compiled runtime output is `scripts/dist/spec-folder/*.js`.
- Explicit CLI targets are authoritative when save workflows pass a spec-folder argument.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/spec-folder/
+-- index.ts                 # Public barrel for spec-folder utilities
+-- folder-detector.ts       # Spec-folder detection logic
+-- alignment-validator.ts   # Topic and folder alignment scoring
+-- directory-setup.ts       # Directory existence and setup helpers
+-- generate-description.ts  # description.json generator
+-- nested-changelog.ts      # Nested changelog data and CLI output
`-- README.md
```

Generated output:

```text
scripts/dist/spec-folder/
+-- index.js
+-- folder-detector.js
+-- alignment-validator.js
+-- directory-setup.js
+-- generate-description.js
`-- nested-changelog.js
```

Allowed direction:

- Memory save workflows may import through `scripts/spec-folder/index.ts`.
- CLI wrappers may run compiled output from `scripts/dist/spec-folder/` after build.
- Metadata generation may write `description.json` for a selected packet.

Disallowed direction:

- Source modules should not import generated `dist/` files.
- Detection logic should not override an explicit CLI target.
- Spec-folder utilities should not own memory indexing or MCP server persistence.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Exposes the public utility surface for script consumers. |
| `folder-detector.ts` | Finds candidate spec folders from CLI data, prompts and context signals. |
| `alignment-validator.ts` | Scores how well session topics match a target spec folder. |
| `directory-setup.ts` | Ensures selected packet directories exist before downstream writes. |
| `generate-description.ts` | Builds per-folder `description.json` metadata. |
| `nested-changelog.ts` | Builds nested changelog payloads for root packets and phase children. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:commands -->
## 4. COMMANDS

Run from the repository root unless noted.

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
```

Expected result: TypeScript compiles and emits `scripts/dist/spec-folder/` files.

```bash
node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js .opencode/specs/system-spec-kit/example-parent/example-child
```

Expected result: prints nested changelog data for the supplied packet path when the path exists.

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
```

Expected result: memory save workflow uses the explicit spec-folder target and supporting utilities from this folder.

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:boundaries -->
## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| CLI authority | Explicit folder arguments remain the selected target even if alignment scoring finds alternatives. |
| Archive filtering | Detection filters archived folders before ranking candidates. |
| Metadata | `generate-description.ts` owns `description.json`. Graph metadata belongs to graph-specific tooling. |
| Persistence | These utilities prepare paths and metadata. Memory indexing stays in memory and MCP modules. |

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run the README validator after editing this file:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/spec-folder/README.md
```

Run build and a compiled-module smoke check after changing source files:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/spec-folder/index.js').then(m => console.log(Object.keys(m).length))"
```

Expected result: build passes and the compiled public barrel exports module members.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

- [`../memory/README.md`](../memory/README.md)
- [`../core/README.md`](../core/README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
