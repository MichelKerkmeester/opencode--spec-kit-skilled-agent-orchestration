---
title: "Skill Advisor Schemas: Tool And Metadata Contracts"
description: "TypeScript and JSON schema contracts for advisor tool responses, compatibility checks, daemon status and derived skill metadata."
trigger_phrases:
  - "skill advisor schemas"
  - "advisor tool schemas"
  - "derived skill metadata schema"
---

# Skill Advisor Schemas: Tool And Metadata Contracts

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`skill_advisor/schemas/` defines contract shapes used by advisor tools, daemon status reporting, compatibility validation and generated skill metadata. These files keep prompt-safe tool surfaces and generated metadata shapes separate from handler orchestration.

Current state:

- Defines advisor tool schemas and daemon status types.
- Stores compatibility and derived skill metadata contracts.
- Keeps schema-level changes close to related tests under `tests/schemas/`.

---

## 2. DIRECTORY TREE

```text
schemas/
+-- advisor-tool-schemas.ts   # Tool request and response schema helpers
+-- compat-contract.json      # Compatibility contract shape
+-- daemon-status.ts          # Daemon status schema and types
+-- generation-metadata.ts    # Skill graph generation metadata types
+-- skill-derived-v2.ts       # Derived skill metadata contract
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-tool-schemas.ts` | Defines schema helpers for advisor tool inputs and outputs. |
| `compat-contract.json` | Stores the compatibility contract consumed by advisor checks. |
| `daemon-status.ts` | Defines daemon status fields returned by advisor status paths. |
| `generation-metadata.ts` | Describes metadata from skill graph generation. |
| `skill-derived-v2.ts` | Defines the derived skill metadata contract. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep schema modules focused on types, validation helpers and stable JSON contracts. |
| Exports | Export contract types and schema helpers, not runtime routing logic. |
| Ownership | Put advisor response and metadata shapes here. Put handlers in `../handlers/` and scorer logic in `../lib/`. |

Main flow:

```text
advisor tool, daemon or generator path
  -> schema contract
  -> validated prompt-safe shape
  -> handler response or test assertion
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-tool-schemas.ts` | TypeScript module | Advisor tool schema surface. |
| `daemon-status.ts` | TypeScript module | Daemon status contract. |
| `generation-metadata.ts` | TypeScript module | Skill graph generation metadata contract. |
| `skill-derived-v2.ts` | TypeScript module | Derived skill metadata contract. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../tests/schemas/README.md`](../tests/schemas/README.md)
- [`../handlers/README.md`](../handlers/README.md)
