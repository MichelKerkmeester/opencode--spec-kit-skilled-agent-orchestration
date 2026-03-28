---
title: "Error response credential sanitization"
description: "Strips API keys and bearer tokens from MCP tool error responses to prevent credential leakage through buildErrorResponse()."
---

# Error response credential sanitization

## 1. OVERVIEW

Strips API keys and bearer tokens from MCP tool error responses to prevent credential leakage through `buildErrorResponse()`.

When an MCP tool fails, the error response envelope could previously contain raw provider API keys, bearer tokens, or key-value credentials embedded in error messages or details objects. The sanitization layer now intercepts these patterns before the response reaches callers, preserving actionable debug context (error codes, provider names, HTTP status) while redacting secrets.

---

## 2. CURRENT REALITY

Two functions handle sanitization in the error response path:

**sanitizeErrorField()**: Strips four credential patterns from string values:
- `sk-*` (OpenAI-style API keys, 20+ chars)
- `voy_*` (Voyage API keys, 20+ chars)
- `Bearer *` (authorization tokens)
- `key=*` / `key:*` (key-value credential assignments, 20+ chars)

All matches are replaced with `[REDACTED]`. Non-sensitive content (error codes, provider names, HTTP status codes) passes through unchanged.

**sanitizeDetails()**: Recursively walks the `details` object in error responses, applying `sanitizeErrorField()` to every string leaf. Handles nested objects, arrays, and mixed structures so credentials cannot hide inside deeply nested error context.

Both functions are applied in `buildErrorResponse()` to the `summary`, `data.error`, and `data.details` fields before the envelope is returned to the MCP caller.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/errors/core.ts` | Lib | `sanitizeErrorField()` and `sanitizeDetails()` applied in `buildErrorResponse()` |
| `mcp_server/context-server.ts` | Server | Shutdown cleanup logging uses `get_error_message()` instead of raw error objects |
| `mcp_server/lib/utils/cleanup-helpers.ts` | Lib | Side-effect-free cleanup helpers extracted from context-server |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/error-sanitization.vitest.ts` | Covers all 4 credential patterns, non-sensitive passthrough, nested objects, and arrays in details |

---

## 4. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Source feature title: Error response credential sanitization
- Current reality source: 025-mcp-runtime-hardening spec folder
