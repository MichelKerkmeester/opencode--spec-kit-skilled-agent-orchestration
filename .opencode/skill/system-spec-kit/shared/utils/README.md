---
title: "Shared Utilities"
description: "Low-level utility functions providing path validation, retry logic, JSONC parsing, and token estimation shared across system-spec-kit."
trigger_phrases:
  - "shared utilities"
  - "path security validation"
  - "retry with backoff"
---

# Shared Utilities

> Low-level utility functions shared across `system-spec-kit`, providing path validation, retry/backoff classification, JSONC parsing helpers, and token count estimation.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. PATH SECURITY](#3--path-security)
- [4. RETRY](#4--retry)
- [5. TOKEN ESTIMATE](#5--token-estimate)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Low-level utility functions shared across `system-spec-kit`. These modules provide **security-hardened path validation**, **resilient retry logic** with error classification, **JSONC comment stripping** for config parsing, and **token count estimation**.

`path-security.ts` and `retry.ts` were migrated from `mcp_server/lib/utils/` to enable reuse by scripts and other consumers outside the MCP server.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
| ---- | ------- |
| `path-security.ts` | Filesystem path validation preventing traversal attacks |
| `retry.ts` | Retry-with-exponential-backoff and error classification |
| `jsonc-strip.ts` | JSONC comment stripping while preserving string literals |
| `token-estimate.ts` | Token count estimation using chars/4 heuristic |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:path-security -->
## 3. PATH SECURITY

**File:** `path-security.ts`

Validates filesystem paths against a set of allowed base directories. Prevents directory traversal, symlink escape, null-byte injection, and path canonicalization attacks.

### Exports

| Export             | Type       | Description                                         |
| ------------------ | ---------- | --------------------------------------------------- |
| `validateFilePath` | `function` | Validates a path is contained within allowed directories |
| `escapeRegex`      | `function` | Escapes special regex characters in a string        |

### `validateFilePath(filePath, allowedBasePaths)`

Returns the **resolved real path** if valid, or `null` if blocked.

```typescript
import { validateFilePath } from './path-security';

const safe = validateFilePath('/project/specs/001/spec.md', ['/project/specs']);
// => '/project/specs/001/spec.md'

const blocked = validateFilePath('/project/../etc/passwd', ['/project/specs']);
// => null (logs warning)
```

**Validation steps:**
1. Reject null bytes (`\0`) before resolution (CWE-78)
2. Resolve path via `path.resolve()`
3. Resolve symlinks via `fs.realpathSync()` (CWE-59), falling back to parent resolution for non-existent files
4. Containment check via `path.relative()` against each allowed base (CWE-22)

### Security Threats Mitigated

| CWE    | Threat              | Mitigation                                        |
| ------ | ------------------- | ------------------------------------------------- |
| CWE-22 | Path Traversal      | `path.relative()` containment check (not `startsWith`) |
| CWE-59 | Symlink Following   | `fs.realpathSync()` resolves symlinks before check |
| CWE-78 | Null Byte Injection | Explicit `\0` rejection before `path.resolve()`   |

<!-- /ANCHOR:path-security -->

---

<!-- ANCHOR:retry -->
## 4. RETRY

**File:** `retry.ts`

Retry-with-exponential-backoff utility that classifies errors as **transient** (retry) or **permanent** (fail fast). Includes detailed attempt logging for diagnostics.

### Primary Exports

| Export              | Type       | Description                                          |
| ------------------- | ---------- | ---------------------------------------------------- |
| `retryWithBackoff`  | `function` | Execute an async function with retry logic           |
| `withRetry`         | `function` | Wrap any async function to add retry behavior        |
| `classifyError`     | `function` | Classify an error as transient, permanent or unknown |
| `isTransientError`  | `function` | Check if error is retryable                          |
| `isPermanentError`  | `function` | Check if error is permanent (no retry)               |
| `calculateBackoff`  | `function` | Calculate delay for a given attempt number           |
| `getBackoffSequence`| `function` | Get all delay values for the configured retry count  |
| `sleep`             | `function` | Promise-based delay                                  |

### Configuration

| Export               | Type       | Description                                |
| -------------------- | ---------- | ------------------------------------------ |
| `DEFAULT_CONFIG`     | `RetryConfig` | Default retry settings (see below)      |

```typescript
{
  maxRetries: 3,
  baseDelayMs: 1000,   // 1s base
  maxDelayMs: 4000,    // 4s cap
  exponentialBase: 2,  // 2^attempt multiplier
}
// Backoff sequence: 1000ms → 2000ms → 4000ms
```

### Error Classification

Errors are classified using a priority chain: **HTTP status** → **network error code** → **permanent message patterns** → **transient message patterns** → **unknown (no retry)**.

**Transient HTTP status codes** (will retry):

`408` `429` `500` `502` `503` `504` `520-524` (Cloudflare)

**Permanent HTTP status codes** (fail fast):

`400` `401` `403` `404` `405` `410` `422`

**Transient network errors:**

`ETIMEDOUT` `ECONNRESET` `ECONNREFUSED` `ENOTFOUND` `ENETUNREACH` `EHOSTUNREACH` `EPIPE` `EAI_AGAIN`

**Message pattern matching** also catches errors like `SQLITE_BUSY`, `rate limit`, `authentication failed`, etc.

### Usage

```typescript
import { retryWithBackoff, withRetry } from './retry';

// Direct usage
const data = await retryWithBackoff(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  {
    operationName: 'fetch-data',
    maxRetries: 3,
    onRetry: (attempt, error, delay) => {
      console.log(`Retry ${attempt} in ${delay}ms: ${error.message}`);
    },
  }
);

// Wrapper usage: creates a retryable version of any async function
const resilientFetch = withRetry(fetchData, { operationName: 'fetch-data' });
const result = await resilientFetch(url, options);
```

### Error Behavior

| Scenario           | Behavior                                       |
| ------------------ | ---------------------------------------------- |
| Permanent error    | Fails immediately with `isPermanent: true`     |
| Transient error    | Retries with exponential backoff               |
| Unknown error      | Fails immediately (conservative default)       |
| Retries exhausted  | Throws with `retriesExhausted: true`           |
| All thrown errors   | Include `attemptLog` array and original `cause` |

### Types

Imported from `shared/types`:

- **`RetryConfig`**: `maxRetries`, `baseDelayMs`, `maxDelayMs`, `exponentialBase`
- **`ErrorClassification`**: `type` (`transient` | `permanent` | `unknown`), `reason`, `shouldRetry`
- **`RetryOptions`**: Extends config with `operationName`, `onRetry`, `shouldRetry` callback
- **`RetryAttemptLogEntry`**: Per-attempt diagnostic record

<!-- /ANCHOR:retry -->

---

<!-- ANCHOR:token-estimate -->
## 5. TOKEN ESTIMATE

**File:** `token-estimate.ts`

Provides a shared token count estimation function using the chars/4 approximation. This is the canonical implementation, replacing duplicate copies that previously existed in `tree-thinning.ts` and `token-metrics.ts`.

### Exports

| Export              | Type       | Description                                              |
| ------------------- | ---------- | -------------------------------------------------------- |
| `estimateTokenCount` | `function` | Estimates token count for a string using `Math.ceil(text.length / 4)` |

### Usage

```typescript
import { estimateTokenCount } from './token-estimate';

const tokens = estimateTokenCount('Hello world');
// => 3

estimateTokenCount(null);  // => 0
estimateTokenCount('');    // => 0
```

<!-- /ANCHOR:token-estimate -->

---

<!-- ANCHOR:related -->
## 6. RELATED

- **Types:** `shared/types.ts` contains `RetryConfig`, `ErrorClassification`, `RetryOptions`, `RetryAttemptLogEntry`
- **Origin:** `path-security.ts` and `retry.ts` migrated from `mcp_server/lib/utils/`; `jsonc-strip.ts` and `token-estimate.ts` are shared-native

<!-- /ANCHOR:related -->

---
