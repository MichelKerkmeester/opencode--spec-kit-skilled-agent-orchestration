---
title: "Contracts: Retrieval Trace Surface"
description: "Proxy folder for retrieval trace contracts owned by the shared package."
trigger_phrases:
  - "retrieval contracts"
  - "context envelope"
  - "retrieval trace"
---

# Contracts: Retrieval Trace Surface

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/contracts/` is a documentation-only compatibility folder. Runtime contract code lives in `shared/contracts/retrieval-trace.ts` and is imported through `@spec-kit/shared/contracts/retrieval-trace`.

Current state:

- No local TypeScript modules are exported from this folder.
- Retrieval trace types and factories are owned by the shared package.
- Local readers use this README to find the public contract surface without duplicating definitions.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────╮
│ lib/contracts/                               │
│ README-only pointer                          │
╰──────────────────────────────────────────────╯
                    │
                    ▼
┌──────────────────────────────────────────────┐
│ shared/contracts/retrieval-trace.ts          │
│ Types and factory functions                  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ @spec-kit/shared/contracts/retrieval-trace   │
│ Public import path                           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Retrieval handlers and context envelopes     │
└──────────────────────────────────────────────┘
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
contracts/
└── README.md                    # Pointer to the shared retrieval trace contract

shared/contracts/
└── retrieval-trace.ts           # Canonical types and factories
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `lib/contracts/README.md` | Developer orientation for the contract import surface |
| `shared/contracts/retrieval-trace.ts` | Canonical source for retrieval trace types and factories |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

Allowed imports:

- Consumers import retrieval contracts from `@spec-kit/shared/contracts/retrieval-trace`.
- Documentation may link to `lib/contracts/README.md` as a local navigation surface.

Disallowed imports:

- Do not import runtime code from `lib/contracts/`.
- Do not redefine retrieval trace contracts in handler, telemetry or context modules.

Control flow:

```text
Caller needs retrieval metadata
          │
          ▼
Import from shared retrieval-trace contract
          │
          ▼
Create trace, entries, degraded contract or envelope
          │
          ▼
Return typed context payload to the caller
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

Public import path:

```typescript
import {
  addTraceEntry,
  createDegradedContract,
  createEnvelope,
  createTrace,
} from '@spec-kit/shared/contracts/retrieval-trace'

import type {
  ContextEnvelope,
  DegradedModeContract,
  EnvelopeMetadata,
  RetrievalStage,
  RetrievalTrace,
  TraceEntry,
} from '@spec-kit/shared/contracts/retrieval-trace'
```

Public surface:

| Export | Kind | Purpose |
|---|---|---|
| `ContextEnvelope<T>` | Type | Wraps response data with trace, degraded mode and metadata |
| `RetrievalTrace` | Type | Describes one retrieval pipeline run |
| `TraceEntry` | Type | Records one pipeline stage |
| `DegradedModeContract` | Type | Describes fallback behavior and confidence impact |
| `EnvelopeMetadata` | Type | Stores envelope version and creation time |
| `RetrievalStage` | Type | Names supported retrieval stages |
| `createTrace` | Function | Creates a trace for a query |
| `addTraceEntry` | Function | Adds a stage record to a trace |
| `createDegradedContract` | Function | Creates a fallback contract |
| `createEnvelope` | Function | Wraps data in a context envelope |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root after editing this README:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md
```

Runtime contract validation belongs to the shared package tests that cover `shared/contracts/retrieval-trace.ts`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

| Resource | Relationship |
|---|---|
| `../README.md` | Parent library map |
| `../context/README.md` | Context payload consumers |
| `../search/README.md` | Retrieval pipeline callers |
| `../telemetry/README.md` | Trace and metric consumers |

<!-- /ANCHOR:related -->
