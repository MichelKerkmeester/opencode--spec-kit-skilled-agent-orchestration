---
title: "Response Module"
description: "Standardized response envelope for MCP tools: summary, data, hints, meta."
trigger_phrases:
  - "response envelope"
  - "MCP response"
  - "tool response format"
---

# Response Module

> Standardized response envelope for MCP tools: `{summary, data, hints, meta}`.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE](#4--usage)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The response module provides a standardized envelope format for all MCP tool responses. It ensures consistent structure across tools and enables token counting. It also provides actionable hints for AI agents.

### Envelope Structure

```javascript
{
  summary: "Human-readable result summary",
  data: { /* Tool-specific payload */ },
  hints: ["Actionable suggestions for next steps"],
  meta: {
    tool: "tool_name",
    tokenCount: 150,
    latencyMs: 42,
    cacheHit: false
  }
}
```

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Consistency** | All tools return same structure |
| **Token Awareness** | Auto-calculates response token count via `estimateTokens` from `@spec-kit/shared` formatters |
| **Actionable Hints** | Guides AI agents on next steps |
| **Performance Tracking** | Latency and cache hit metrics |
| **Error Handling** | Structured error responses with recovery hints |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
response/
 envelope.ts  # Response envelope factory functions
 README.md    # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `envelope.ts` | Core envelope creation functions and MCP wrappers |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Core Envelope Functions

| Function | Purpose |
|----------|---------|
| `createResponse(options)` | Base envelope factory |
| `createSuccessResponse(options)` | Success with default hints |
| `createEmptyResponse(options)` | Empty results with helpful hints |
| `createErrorResponse(options)` | Error with recovery guidance |

### MCP Wrapper Functions

| Function | Purpose |
|----------|---------|
| `wrapForMCP(envelope)` | Wrap envelope in MCP content format |
| `createMCPResponse(options)` | Create + wrap in one call |
| `createMCPSuccessResponse(options)` | Success + MCP wrap |
| `createMCPEmptyResponse(options)` | Empty + MCP wrap |
| `createMCPErrorResponse(options)` | Error + MCP wrap (sets isError) |

### Default Hints

| Scenario | Hints |
|----------|-------|
| **Empty Results** | "Try broadening search", "Use memory_list()", "Check specFolder filter" |
| **Rate Limited** | "Wait before retrying", "Consider batching" |
| **Success** | (Empty by default) |

### Exported Types

`ResponseMeta`, `MCPEnvelope`, `CreateResponseOptions`, `CreateEmptyResponseOptions`, `RecoveryInfo`, `CreateErrorResponseOptions`, `MCPResponse`, `DefaultHints`

### Exported Constants

`DEFAULT_HINTS`

<!-- /ANCHOR:features -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

### Basic Import

```typescript
import {
  createSuccessResponse,
  createEmptyResponse,
  createErrorResponse,
  createMCPResponse
} from './envelope';
```

### Success Response

```typescript
const response = createSuccessResponse({
  tool: 'memory_search',
  summary: 'Found 5 matching memories',
  data: {
    count: 5,
    results: [/* ... */]
  },
  startTime: Date.now() - 42  // For latency calculation
});
```

### Empty Response

```typescript
const response = createEmptyResponse({
  tool: 'memory_search',
  summary: 'No memories matched query',
  startTime
});
// Automatically includes helpful hints for empty results
```

### Error Response

```typescript
const response = createErrorResponse({
  tool: 'memory_save',
  error: new Error('Validation failed'),
  code: 'E002',
  details: { field: 'content', reason: 'empty' },
  recovery: {
    hint: 'Provide non-empty content',
    actions: ['Check input format', 'Review validation rules'],
    severity: 'warning'
  }
});
```

### MCP-Wrapped Response

```typescript
const mcpResponse = createMCPResponse({
  tool: 'memory_search',
  summary: 'Found 3 results',
  data: { count: 3, results: [...] }
});

// Returns: { content: [{ type: 'text', text: '...' }], isError: false }
```

<!-- /ANCHOR:usage -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../architecture/](../architecture/) | Layer definitions and token budgets |
| [../cache/](../cache/) | Tool output caching |

### Related Modules

| Module | Relationship |
|--------|--------------|
| `context-server.ts` | Uses envelope for all tool responses |
| `@spec-kit/shared/formatters/token-metrics.ts` | Provides `estimateTokens()` for meta |
| `lib/errors/` | Error types used with createErrorResponse |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-16
