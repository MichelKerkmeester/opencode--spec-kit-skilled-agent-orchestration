---
title: "Skill Advisor Handler Tests"
description: "Vitest coverage for advisor MCP handler response shapes, status reporting and validation contracts."
trigger_phrases:
  - "skill advisor handler tests"
  - "advisor recommend tests"
---

# Skill Advisor Handler Tests

> Vitest coverage for advisor MCP handler response shapes, status reporting and validation contracts.

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

`tests/handlers/` verifies the MCP-facing skill advisor handlers and their typed response contracts.

Current state:

- Covers recommendation success, unavailable states, status reads and validation shapes.
- Uses Vitest mocks for scorer and status dependencies where handler behavior is isolated.
- Checks prompt-safe output boundaries and threshold metadata.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
handlers/
+-- advisor-recommend-unavailable.vitest.ts  # Unavailable recommendation path
+-- advisor-recommend.vitest.ts              # Recommendation handler contract
+-- advisor-status.vitest.ts                 # Status handler freshness states
+-- advisor-validate-shapes.vitest.ts        # Validation response shape checks
+-- advisor-validate.vitest.ts               # Advisor validation handler behavior
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-recommend.vitest.ts` | Verifies recommendation payloads, attribution, freshness and dispatch integration. |
| `advisor-status.vitest.ts` | Verifies live, stale, absent and unavailable status output. |
| `advisor-validate.vitest.ts` | Covers validation handler behavior for advisor regression checks. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers
```

Expected result: all handler tests pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../README.md`](../README.md)
- [`../fixtures/README.md`](../fixtures/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
