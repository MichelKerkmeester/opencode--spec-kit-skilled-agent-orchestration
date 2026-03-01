---
title: "Utils"
description: "Utility functions for output formatting and path security."
trigger_phrases:
  - "utility functions"
  - "format helpers"
  - "path security"
---

# Utils

> Utility functions for output formatting and path security.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The utils module provides foundational utilities used throughout the MCP server. These include date formatting and path traversal security (re-exported from `@spec-kit/shared`).

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Security** | Path traversal protection (CWE-22 mitigation) via `@spec-kit/shared` |
| **Consistency** | Shared formatting across the codebase |

### Module Statistics

| Metric | Value |
|--------|-------|
| Utility modules | 4 |
| Source | `format-helpers.ts`, `retry.ts` and `logger.ts` are local. `path-security.ts` re-exports from `@spec-kit/shared` |

<!-- /ANCHOR:overview -->

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
utils/
 format-helpers.ts   # Output formatting utilities
 retry.ts            # Retry logic with exponential backoff
 logger.ts           # Structured logging utilities
 path-security.ts    # Re-exports from @spec-kit/shared/utils/path-security
 README.md           # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `format-helpers.ts` | Human-readable date formatting (`formatAgeString`) |
| `retry.ts` | Retry wrapper with exponential backoff for transient failures |
| `logger.ts` | Structured logging utilities for MCP server operations |
| `path-security.ts` | Re-exports path validation and regex escaping from `@spec-kit/shared/utils/path-security` |

<!-- /ANCHOR:structure -->

## 3. FEATURES
<!-- ANCHOR:features -->

### Format Helpers (`format-helpers.ts`)

| Function | Signature | Purpose |
|----------|-----------|---------|
| `formatAgeString` | `(dateString: string \| null) => string` | Convert date to human-readable age ("2 days ago", "yesterday", "never") |

### Path Security (`path-security.ts`)

Re-exports from `@spec-kit/shared/utils/path-security`:

| Function | Purpose |
|----------|---------|
| `validateFilePath` | Validate path is within allowed directories |
| `escapeRegex` | Escape special regex characters |

### Retry (`retry.ts`)

| Function | Purpose |
|----------|---------|
| `withRetry` | Wrap async operations with exponential backoff retry logic for transient failures |

### Logger (`logger.ts`)

| Function | Purpose |
|----------|---------|
| Structured logging | Consistent log output for MCP server operations |

<!-- /ANCHOR:features -->

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Format Helpers

```typescript
import { formatAgeString } from './format-helpers';

formatAgeString('2024-01-15T10:00:00Z'); // "2 weeks ago"
formatAgeString(null);                    // "never"
```

### Path Security

```typescript
import { validateFilePath, escapeRegex } from './path-security';

const allowed = ['/home/user/project', '/tmp'];
const userPath = '../../../<blocked-path>';

const safe = validateFilePath(userPath, allowed);
// Returns null - path traversal blocked

const escaped = escapeRegex('file.name (1)');
// Returns: "file\\.name \\(1\\)"
```

<!-- /ANCHOR:usage-examples -->

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../providers/](../providers/) | Uses path security for file loading |
| [../parsing/](../parsing/) | Uses `escapeRegex` for trigger matching |

### Security References

| Topic | Reference |
|-------|-----------|
| Path Traversal | CWE-22: Improper Limitation of Pathname |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-16
