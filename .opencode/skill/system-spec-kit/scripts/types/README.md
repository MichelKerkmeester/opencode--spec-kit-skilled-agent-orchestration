---
title: "Type Definitions"
description: "Shared TypeScript interfaces for Spec Kit script session payloads and generated context data."
trigger_phrases:
  - "session types"
  - "type definitions"
  - "session data interface"
---

# Type Definitions

> Shared TypeScript interfaces for script payloads, session extraction, decisions, conversations and diagrams.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY FILES](#3--key-files)
- [4. ENTRYPOINTS](#4--entrypoints)
- [5. BOUNDARIES](#5--boundaries)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/types/` contains shared TypeScript types used by extractors, renderers, simulation helpers and context-generation modules. The folder keeps data contracts in one source file so script modules can share session payload shapes without redefining them.

Current state:

- Source of truth is `session-types.ts`.
- Runtime declarations are generated into `scripts/dist/types/` by the TypeScript build.
- These definitions model script data only. They are not MCP server API contracts.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/types/
+-- session-types.ts      # Shared session, decision, conversation and diagram interfaces
`-- README.md
```

Generated output:

```text
scripts/dist/types/
+-- session-types.js
+-- session-types.d.ts
`-- session-types.js.map
```

Allowed direction:

- Script source modules may import from `scripts/types/session-types.ts`.
- Extractors may provide imported field types used by `SessionData`.
- Build output may be inspected by runtime smoke tests.

Disallowed direction:

- Source modules should not import from `scripts/dist/types/`.
- Type files should not contain runtime behavior.
- MCP server public API types should not be defined here.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `session-types.ts` | Defines decision, conversation, diagram and session payload interfaces. |
| `../extractors/file-extractor.ts` | Provides file-change and observation types consumed by session types. |
| `../extractors/session-extractor.ts` | Provides tool-count and spec-file entry types consumed by session types. |

Primary type groups:

| Group | Purpose |
|---|---|
| `DecisionData` | Decision records, options, evidence and confidence fields. |
| `ConversationData` | Messages, tool calls, phases and conversation flow metadata. |
| `DiagramData` | Diagram output, decision trees and pattern summaries. |
| `SessionData` | Root generated-context payload used by save and render workflows. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:entrypoints -->
## 4. ENTRYPOINTS

This folder has no standalone CLI. Consumers import the types from source during TypeScript development or from generated declarations after build.

Example source import:

```typescript
import type { SessionData } from '../types/session-types'
```

Example declaration check:

```bash
test -f .opencode/skill/system-spec-kit/scripts/dist/types/session-types.d.ts
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:boundaries -->
## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Ownership | This folder owns script payload interfaces only. |
| Runtime | Keep runtime logic in extractors, renderers, core modules or libraries. |
| Imports | Prefer type-only imports when consumers only need compile-time shapes. |
| Public APIs | MCP server request and response contracts belong under `mcp_server/`. |

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run the README validator after editing this file:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/types/README.md
```

Run the script build after changing type definitions:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
```

Expected result: TypeScript compiles and emits declarations for `session-types.ts`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

- [`../extractors/README.md`](../extractors/README.md)
- [`../renderers/README.md`](../renderers/README.md)
- [`../core/README.md`](../core/README.md)
- [`../README.md`](../README.md)

<!-- /ANCHOR:related -->
