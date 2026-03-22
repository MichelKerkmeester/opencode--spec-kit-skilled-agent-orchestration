---
title: "Providers Modules"
description: "Embedding provider abstraction and retry management for the Spec Kit Memory system."
trigger_phrases:
  - "embedding providers"
  - "retry manager"
  - "backoff retry"
---

# Providers Modules

> Embedding provider abstraction and retry management for the Spec Kit Memory system.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The providers module handles embedding generation and retry logic for the Spec Kit Memory MCP server. It provides a unified abstraction layer for multiple embedding providers (Voyage AI, OpenAI) with exponential backoff retry management for reliable embedding generation.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 2 | embeddings, retry-manager |
| Backoff Delays | 3 | 1min, 5min, 15min exponential |
| Max Retries | 3 | Before marking as permanently failed |

### Key Features

| Feature | Description |
|---------|-------------|
| **Provider Abstraction** | Unified interface for Voyage AI, OpenAI and local models (re-exported from `@spec-kit/shared/embeddings`) |
| **Exponential Backoff** | Retry with 1min, 5min, 15min delays |
| **Background Retry Job** | Optional processing of pending embeddings every 5 minutes |
| **Graceful Degradation** | Falls back to BM25-only mode when all providers fail |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
providers/
 embeddings.ts        # Re-export from @spec-kit/shared/embeddings
 retry-manager.ts     # Exponential backoff with background job
 README.md            # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `embeddings.ts` | Re-exports all embedding utilities from `@spec-kit/shared/embeddings` |
| `retry-manager.ts` | Retry queue, backoff timing, background job processing |

### Compiled Output

TypeScript source files compile to `mcp_server/dist/lib/providers/` with corresponding `.js` and `.d.ts` files.

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Embeddings Provider (`embeddings.ts`)

**Purpose**: Unified interface for generating embeddings from multiple providers

| Aspect | Details |
|--------|---------|
| **Providers** | Voyage AI (primary), OpenAI, HuggingFace local |
| **Task Types** | Query embeddings, document embeddings, batch processing |
| **Dimensions** | Dynamic based on provider/model selection |
| **Source** | Re-exported from `@spec-kit/shared/embeddings` (workspace package) |

```typescript
import { generateDocumentEmbedding, generateQueryEmbedding } from './embeddings';

const docEmbedding = await generateDocumentEmbedding('authentication flow');
const queryEmbedding = await generateQueryEmbedding('how to authenticate?');
```

### Retry Manager (`retry-manager.ts`)

**Purpose**: Handle failed embedding generations with exponential backoff

| Aspect | Details |
|--------|---------|
| **Backoff Delays** | 1 minute, 5 minutes, 15 minutes |
| **Max Retries** | 3 attempts before permanent failure |
| **Background Job** | Processes up to 5 pending items every 5 minutes |
| **Status Tracking** | pending, retry, success, failed states |

**Exported functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `getRetryQueue` | `(limit?: number) => RetryMemoryRow[]` | Get items eligible for retry |
| `getFailedEmbeddings` | `() => RetryMemoryRow[]` | Get permanently failed items |
| `getRetryStats` | `() => RetryStats` | Get queue statistics |
| `getEmbeddingRetryStats` | `() => EmbeddingRetryStats` | Get a lightweight in-memory retry health snapshot without DB access |
| `retryEmbedding` | `(id: number, content: string) => Promise<RetryResult>` | Retry a single embedding |
| `markAsFailed` | `(id: number, reason: string) => void` | Mark as permanently failed |
| `resetForRetry` | `(id: number) => boolean` | Reset a failed item for retry |
| `processRetryQueue` | `(limit?: number, contentLoader?) => Promise<BatchResult>` | Process batch of retries |
| `startBackgroundJob` | `(options?) => boolean` | Start background retry job |
| `stopBackgroundJob` | `() => boolean` | Stop background retry job |
| `isBackgroundJobRunning` | `() => boolean` | Check if background job is active |
| `runBackgroundJob` | `(batchSize?: number) => Promise<BackgroundJobResult>` | Run a single background job iteration |

**Exported constants:** `BACKGROUND_JOB_CONFIG`, `BACKOFF_DELAYS`, `MAX_RETRIES`

**Exported types:**

| Type | Purpose |
|------|---------|
| `EmbeddingRetryStats` | In-memory retry health snapshot returned by `getEmbeddingRetryStats()`, including pending/failed counts, retry attempts, circuit-breaker state, last run and queue depth |

**T3-15 circuit breaker:** The retry manager opens a provider circuit breaker after 5 consecutive embedding-provider failures, cools down for 2 minutes, and causes retry paths to skip outbound embedding API calls until the cooldown expires.

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Generate Embedding

```typescript
import { generateDocumentEmbedding } from './embeddings';

const text = 'How does the authentication flow work?';
const embedding = await generateDocumentEmbedding(text);

if (embedding) {
  console.log(`Embedding dimensions: ${embedding.length}`);
}
```

### Example 2: Monitor Retry Queue

```typescript
import { getRetryStats, getRetryQueue, getFailedEmbeddings } from './retry-manager';

const stats = getRetryStats();
console.log(`Queue size: ${stats.queue_size}, Failed: ${stats.failed}`);

const queue = getRetryQueue(10);
queue.forEach(item => {
  console.log(`${item.id}: ${item.retryCount} retries`);
});
```

### Example 3: Background Retry Job

```typescript
import { startBackgroundJob, stopBackgroundJob, isBackgroundJobRunning } from './retry-manager';

startBackgroundJob({ intervalMs: 300000, batchSize: 5, enabled: true });
console.log(isBackgroundJobRunning()); // true
stopBackgroundJob();
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Generate doc embedding | `generateDocumentEmbedding(text)` | Index new content |
| Generate query embedding | `generateQueryEmbedding(text)` | Search queries |
| Check queue stats | `getRetryStats()` | Monitor health |
| Process retries | `processRetryQueue(limit)` | Manual retry trigger |
| Reset failed | `resetForRetry(id)` | Re-attempt specific item |
| Start background | `startBackgroundJob()` | Server startup |

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [contracts/README.md](../contracts/README.md) | Shared data contracts used by providers |
| [search/README.md](../search/README.md) | Vector search using embeddings |

### External Resources

| Resource | Description |
|----------|-------------|
| [Voyage AI Docs](https://docs.voyageai.com/) | Primary embedding provider |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) | Alternative provider |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-16
