---
title: "Script Utilities"
description: "Shared TypeScript and JavaScript utility modules for validation, path safety, frontmatter, normalization and script support."
trigger_phrases:
  - "spec kit utilities"
  - "data validator path utils"
  - "script utility modules"
---

<!-- markdownlint-disable MD025 -->

# Script Utilities

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. PACKAGE TOPOLOGY](#2-package-topology)
- [3. BOUNDARIES](#3-boundaries)
- [4. ENTRYPOINTS](#4-entrypoints)
- [5. VALIDATION](#5-validation)
- [6. RELATED](#6-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/utils/` contains reusable helpers for the system-spec-kit script
package. TypeScript sources compile to `scripts/dist/utils/`; the source-only
JavaScript helper is loaded directly where needed.

Current responsibilities:

- Data validation and input normalization.
- Safe file and path handling.
- Frontmatter formatting and parsing.
- Script logging, messages and prompt utilities.
- Tool, source and workspace identity detection.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/utils/
+-- data-validator.ts          # Input shape validation and flag mappings
+-- fact-coercion.ts           # Extracted fact normalization
+-- file-helpers.ts            # Safe file I/O helpers
+-- index.ts                   # Utility export surface
+-- input-normalizer.ts        # Runtime payload normalization
+-- logger.ts                  # Structured logging helpers
+-- memory-frontmatter.ts      # Memory frontmatter helpers
+-- message-utils.ts           # User-facing message formatting
+-- path-utils.ts              # Path containment and sanitization
+-- phase-classifier.ts        # Workflow phase classification
+-- prompt-utils.ts            # Prompt construction helpers
+-- slug-utils.ts              # Stable and unique slug helpers
+-- source-capabilities.ts     # Source capability metadata
+-- spec-affinity.ts           # Spec-folder affinity scoring
+-- task-enrichment.ts         # Task title enrichment helpers
+-- template-structure.js      # Source-only template structure helper
+-- tool-detection.ts          # MCP tool capability detection
+-- tool-sanitizer.ts          # Tool payload sanitization
+-- validation-utils.ts        # Path-scoped validation helpers
+-- workspace-identity.ts      # Workspace identity detection
`-- README.md
```

Compiled output:

```text
scripts/dist/utils/*.js
scripts/dist/utils/*.d.ts
scripts/dist/utils/*.js.map
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:boundaries -->
## 3. BOUNDARIES

Allowed direction:

- Script modules may import TypeScript utilities from source during build.
- Runtime callers should import compiled modules from `scripts/dist/utils/`.
- `template-structure.js` may be loaded directly because it is source-only JavaScript.

Disallowed direction:

- Source utilities must not import generated `dist/` files.
- Utilities should not call CLI entrypoints.
- Path helpers must not relax containment checks without explicit caller bases.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:entrypoints -->
## 4. ENTRYPOINTS

This folder has no standalone CLI. Consumers import specific helpers after the
scripts package is built:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/utils/path-utils.js')\
.then(m => console.log(typeof m.sanitizePath))"
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/utils/index.js')\
.then(m => console.log(Object.keys(m).length))"
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Use repository-root commands:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/utils/path-utils.js')\
.then(m => console.log(typeof m.sanitizePath))"
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/utils/index.js')\
.then(m => console.log(Boolean(m)))"
```

Expected behavior: the build succeeds, `sanitizePath` resolves as a function
and the aggregate utility module imports without throwing.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../core/README.md`](../core/README.md)
- [`../../references/validation/path_scoped_rules.md`](../../references/validation/path_scoped_rules.md)

<!-- /ANCHOR:related -->
