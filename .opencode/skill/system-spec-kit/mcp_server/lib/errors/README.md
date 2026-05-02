---
title: "Errors"
description: "Error classes, error codes, recovery hints, and response helpers for MCP operations."
trigger_phrases:
  - "error handling"
  - "recovery hints"
  - "error codes"
---

# Errors

Shared error-handling code for the Spec Kit Memory MCP server. This folder converts internal failures into typed errors, user-facing messages, retry decisions, and recovery hints.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FLOW](#3--flow)
- [4. ALLOWED DEPENDENCY DIRECTION](#4--allowed-dependency-direction)
- [5. ERROR CATEGORIES](#5--error-categories)
- [6. USAGE](#6--usage)
- [7. RELATED FILES](#7--related-files)

## 1. OVERVIEW

Use this folder when MCP tools need consistent failure responses. Recovery hints should be actionable and should re-anchor packet-scoped work on `/spec_kit:resume` when continuity context is missing.

## 2. STRUCTURE

| File | Role |
| --- | --- |
| `core.ts` | `MemoryError`, timeout wrapper, transient checks, and response builders. |
| `recovery-hints.ts` | Error-code catalog, default hints, and tool-specific hint lookup. |
| `index.ts` | Public exports for error helpers. |

## 3. FLOW

```text
╭────────────────╮
│ Operation runs │
╰───────┬────────╯
        ▼
┌──────────────────────┐
│ Error is caught      │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Classify and map     │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Attach recovery hint │
└──────────┬───────────┘
           ▼
╭──────────────────────╮
│ MCP error response   │
╰──────────────────────╯
```

## 4. ALLOWED DEPENDENCY DIRECTION

```text
╭────────────────────╮
│ MCP tools and libs │
╰─────────┬──────────╯
          ▼
┌────────────────────╮
│ errors/            │
└─────────┬──────────┘
          ▼
┌────────────────────╮
│ Config and shared  │
│ types              │
└────────────────────┘
```

Application modules may import error helpers. Error helpers should not import tool handlers, storage implementations, search pipeline stages, or recovery workflows.

## 5. ERROR CATEGORIES

| Range | Category |
| --- | --- |
| `E001` to `E009` | Embedding failures. |
| `E010` to `E019` | File access and parsing failures. |
| `E020` to `E029` | Database failures. |
| `E030` to `E039` | Parameter validation failures. |
| `E040` to `E049` | Search failures. |
| `E050` to `E059` | API and authentication failures. |
| `E060` to `E109` | Checkpoint, session, memory, validation, and causal-graph failures. |
| `E429`, `E503` | Rate-limit and service-availability failures. |

## 6. USAGE

```typescript
import { buildErrorResponse } from '@spec-kit/lib/errors';

try {
  return await runTool();
} catch (error) {
  return buildErrorResponse('memory_search', error, { query });
}
```

## 7. RELATED FILES

| Path | Why it matters |
| --- | --- |
| `../validation/` | Preflight checks that often create parameter and validation errors. |
| `../../context-server.ts` | MCP server surface that returns error responses. |
| `../search/pipeline/` | Search calls that use error responses for retrieval failures. |
