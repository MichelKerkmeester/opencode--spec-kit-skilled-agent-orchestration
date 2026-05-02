---
title: "Context Lib: Shared Runtime Context Contracts"
description: "Shared payload, transport, caller context, and publication-gate helpers for startup, resume, bootstrap, health, and compaction surfaces."
trigger_phrases:
  - "context contracts"
  - "shared payload"
  - "opencode transport"
  - "publication gate"
---

# Context Lib: Shared Runtime Context Contracts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/lib/context/` owns the typed context contracts shared by MCP startup, resume, health, bootstrap, compaction, and OpenCode hook delivery paths. It keeps payload shape, trust metadata, transport rendering, caller identity, and publishability checks in one small package.

Current state:

- `shared-payload.ts` defines the canonical envelope, section, provenance, source, trust, advisor, and metric types used by context producers.
- `opencode-transport.ts` maps shared payload envelopes into OpenCode hook blocks without owning retrieval policy.
- `caller-context.ts` carries MCP caller metadata through async handler execution.
- `publication-gate.ts` rejects metric rows that do not have enough certainty, methodology, schema, and provenance data for publication.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         CONTEXT LIB                              │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│ MCP producers  │ ──▶ │ shared-payload.ts  │ ──▶ │ OpenCode hooks   │
│ resume/health  │     │ envelope contract  │     │ transport blocks │
└───────┬────────┘     └──────────┬─────────┘     └──────────────────┘
        │                         │
        ▼                         ▼
┌────────────────┐     ┌────────────────────┐
│ caller-context │     │ publication-gate.ts │
│ async metadata │     │ metric publish rule │
└────────────────┘     └────────────────────┘

Dependency direction:
context callers ───▶ context contracts ───▶ utility seams and type-only graph contracts
transport rendering ───▶ shared payload validation
publication checks ───▶ shared payload metric helpers
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
context/
+-- caller-context.ts       # AsyncLocalStorage wrapper for MCP caller metadata
+-- opencode-transport.ts   # Shared payload to OpenCode hook transport plan mapping
+-- publication-gate.ts     # Publishability checks for metric-bearing rows
+-- shared-payload.ts       # Canonical shared payload and trust contracts
`-- README.md
```

Allowed dependency direction:

```text
MCP tools, hooks, resume, health and bootstrap producers → lib/context/
opencode-transport.ts → shared-payload.ts
publication-gate.ts → shared-payload.ts
shared-payload.ts → neutral lib/utils seams and shared type packages
```

Disallowed dependency direction:

```text
lib/context/ → MCP tool handlers
lib/context/ → hook runtimes as side-effect owners
lib/context/ → database or filesystem mutation paths
transport adapters → retrieval policy ownership
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
mcp_server/lib/context/
+-- caller-context.ts
+-- opencode-transport.ts
+-- publication-gate.ts
+-- shared-payload.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `shared-payload.ts` | Defines shared payload kinds, trust states, certainty labels, structural trust axes, source refs, advisor metadata, metric publication metadata, envelope factories, and validation helpers. |
| `opencode-transport.ts` | Coerces unknown payloads into `SharedPayloadEnvelope`, selects sections, renders structural trust details, and builds an `OpenCodeTransportPlan` for runtime hook surfaces. |
| `caller-context.ts` | Exposes `runWithCallerContext`, `getCallerContext`, and `requireCallerContext` for MCP transport metadata propagation. |
| `publication-gate.ts` | Evaluates whether a row can be published by checking certainty, methodology status, schema version, provenance, and multiplier authority fields. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Context files may depend on neutral utility seams, shared type packages, and type-only graph contracts. |
| Exports | Export contracts and pure helpers only. Runtime producers import this folder instead of redefining payload shapes. |
| Ownership | This folder owns context contract vocabulary and transport formatting. Retrieval, indexing, graph scans, and hook installation live outside this folder. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ resume, bootstrap, health or hook caller │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ build or receive SharedPayloadEnvelope   │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ validate kind, producer and trust state  │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ render selected sections for transport   │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ attach caller or publication metadata    │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ caller receives typed runtime context    │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `SharedPayloadEnvelope` | Type | Canonical payload envelope consumed by startup, resume, health, bootstrap, and compaction paths. |
| `coerceSharedPayloadEnvelope` | Function | Narrows unknown runtime payload data to the shared envelope contract and rejects invalid enum values. |
| `buildOpenCodeTransportPlan` | Function | Builds transport-only blocks for OpenCode event, system transform, message transform, and compaction hooks. |
| `runWithCallerContext` | Function | Binds MCP caller metadata to downstream async execution. |
| `getCallerContext` | Function | Reads the current caller context when it exists. |
| `requireCallerContext` | Function | Throws when a handler expects caller context but none is bound. |
| `evaluatePublicationGate` | Function | Returns whether a metric row is publishable or gives the exclusion reason. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root.

```bash
node .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/lib/context/README.md
node .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/context/README.md
```

Expected result: the structure extractor reports README type with no critical issues, and document validation exits `0`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`../resume/README.md`](../resume/README.md)
- [`../../hooks/README.md`](../../hooks/README.md)
- [`../../tools/README.md`](../../tools/README.md)

<!-- /ANCHOR:related -->
