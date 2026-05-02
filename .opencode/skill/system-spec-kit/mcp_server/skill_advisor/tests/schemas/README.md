---
title: "Skill Advisor Schema Tests"
description: "Vitest coverage for skill advisor MCP tool input schemas and workspaceRoot allowlist checks."
trigger_phrases:
  - "skill advisor schema tests"
  - "advisor tool schema tests"
---

# Skill Advisor Schema Tests

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/schemas/` verifies advisor MCP tool schemas and path-bounding rules for workspace roots.

Current state:

- Covers recommend, validate, status and rebuild input schema parsing.
- Checks that allowed workspace roots include the repo root, temp directories and optional allowlist entries.
- Rejects arbitrary absolute paths outside the configured allowlist.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
schemas/
+-- advisor-tool-schemas.vitest.ts  # Advisor tool input schema checks
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-tool-schemas.vitest.ts` | Verifies Zod schema parsing and `isAllowedWorkspaceRoot()` allowlist behavior. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run skill_advisor/tests/schemas
```

Expected result: schema parsing and workspace root bounds checks pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../handlers/README.md`](../handlers/README.md)
- [`../parity/README.md`](../parity/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
