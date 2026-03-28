---
title: Embedding Resilience
description: Provider fallback chains, graceful degradation, and offline mode for reliable semantic search
---

# Embedding Resilience

Provider fallback chains, graceful degradation, and offline mode for reliable semantic search.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

The embedding resilience system ensures semantic search remains functional even when external embedding providers experience outages, rate limits, or network failures. This reference documents the fallback chain (REQ-029), graceful degradation (REQ-030), retry logic (REQ-031), offline mode (REQ-032), and provider health monitoring (REQ-033).

### Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| Embeddings Factory | `shared/embeddings/factory.ts` | Provider selection and fallback |
| Voyage Provider | `shared/embeddings/providers/voyage.ts` | Primary embedding provider |
| OpenAI Provider | `shared/embeddings/providers/openai.ts` | Secondary fallback provider |
| Retry Manager | `mcp_server/lib/providers/retry-manager.ts` | Exponential backoff handling |
| Vector Index | `mcp_server/lib/search/vector-index.ts` | Local embedding cache |

### Core Principle

**Availability over precision.** When high-quality embeddings fail, fall back to lower-quality alternatives rather than failing entirely. Keyword search is better than no search.

Governance boundaries still apply in every degradation mode. Fallback providers, cached embeddings, and keyword-only recovery must preserve the caller's `tenantId`, `userId`, `agentId`, and `sharedSpaceId` boundaries rather than widening scope to "find something."

For shared-memory rollout, degraded retrieval still assumes the shared space was explicitly enabled and membership was granted through `/memory:manage shared`. Resilience improves availability inside an allowed boundary; it does not weaken deny-by-default access rules.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:provider-fallback-chain -->
## 2. PROVIDER FALLBACK CHAIN

The system attempts providers in order until one succeeds (REQ-029):

### Fallback Order

```
┌─────────────────────────────────────────────────────────────────┐
│ EMBEDDING REQUEST                                               │
└───────────────────────────────────┬─────────────────────────────┘
                                    ↓
┌───────────────────────────────────────────────────────────────────┐
│ 1. VOYAGE AI (Primary)                                            │
│    Model: voyage-4                                                │
│    Quality: Highest (optimized for code/technical content)        │
│    Latency: ~150ms                                                │
└───────────────────────────────────┬───────────────────────────────┘
                                    ↓ FAIL
┌───────────────────────────────────────────────────────────────────┐
│ 2. OPENAI (Secondary)                                             │
│    Model: text-embedding-3-small                                  │
│    Quality: High (general purpose)                                │
│    Latency: ~100ms                                                │
└───────────────────────────────────┬───────────────────────────────┘
                                    ↓ FAIL
┌───────────────────────────────────────────────────────────────────┐
│ 3. LOCAL CACHE (Last Resort)                                      │
│    Source: Previously computed embeddings in SQLite               │
│    Quality: Varies (depends on cache age)                         │
│    Latency: <10ms                                                 │
└───────────────────────────────────┴───────────────────────────────┘
```

### Provider Configuration

```typescript
// Embedding provider priority (factory.ts)
interface ProviderConfig {
  name: string;
  envKey: string;
  model: string;
  dimensions: number;
  priority: number;
}

const PROVIDER_CHAIN: ProviderConfig[] = [
  {
    name: 'voyage',
    envKey: 'VOYAGE_API_KEY',
    model: 'voyage-4',
    dimensions: 1024,
    priority: 1
  },
  {
    name: 'openai',
    envKey: 'OPENAI_API_KEY',
    model: 'text-embedding-3-small',
    dimensions: 1536,
    priority: 2
  }
];
```

### Fallback Triggers

The system switches to the next provider when:

| Condition | Action |
|-----------|--------|
| HTTP 429 (Rate Limited) | Retry with backoff, then fallback |
| HTTP 5xx (Server Error) | Retry with backoff, then fallback |
| Network timeout (>10s) | Immediate fallback |
| Invalid API key | Skip provider, use next |
| Provider health < 50% | Preemptive fallback |

---

<!-- /ANCHOR:provider-fallback-chain -->
<!-- ANCHOR:graceful-degradation -->
## 3. GRACEFUL DEGRADATION

When all embedding providers fail, the system degrades to keyword-based search (REQ-030):

### Degradation Levels

| Level | Condition | Search Capability |
|-------|-----------|-------------------|
| **Full** | Primary provider healthy | Vector similarity + keyword + FTS5 |
| **Reduced** | Fallback provider active | Vector similarity (different model) + keyword |
| **Keyword Only** | All providers failed | FTS5 full-text search + trigger matching |
| **Offline** | No network + cache available | Cached embeddings + keyword |

### Keyword Search Fallback

When vector search is unavailable:

```typescript
// Graceful degradation to FTS5 search
async function searchWithDegradation(query: string, options: SearchOptions): Promise<SearchResult[]> {
  try {
    // Attempt vector search
    return await vectorSearch(query, options);
  } catch (embeddingError: unknown) {
    console.warn('[DEGRADED] Vector search failed, using keyword fallback');

    // Fall back to FTS5 full-text search
    return await fts5Search(query, {
      ...options,
      degraded: true,
      warningMessage: 'Results based on keyword matching (semantic search unavailable)'
    });
  }
}
```

### User Notification

When operating in degraded mode, search results include a warning:

```json
{
  "results": [...],
  "meta": {
    "degraded": true,
    "searchMode": "keyword",
    "message": "Semantic search unavailable. Results based on keyword matching."
  }
}
```

---

<!-- /ANCHOR:graceful-degradation -->
<!-- ANCHOR:retry-with-backoff -->
## 4. RETRY WITH BACKOFF

Transient failures trigger exponential backoff before provider switching (REQ-031):

### Retry Configuration

```typescript
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number;
}

const RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1
};
```

### Backoff Formula

```
delay = min(baseDelay * (multiplier ^ attempt) + jitter, maxDelay)
```

| Attempt | Base Delay | With Jitter (example) |
|---------|------------|----------------------|
| 1 | 1000ms | 1000-1100ms |
| 2 | 2000ms | 2000-2200ms |
| 3 | 4000ms | 4000-4400ms |
| FAIL | Switch provider | - |

### Retry Logic

```typescript
async function withRetry<T>(operation: () => Promise<T>, config: RetryConfig = RETRY_CONFIG): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error as Error;

      // Don't retry on permanent failures
      if (isPermanentError(error)) {
        throw error;
      }

      if (attempt < config.maxRetries) {
        const delay = calculateBackoff(attempt, config);
        console.log(`[RETRY] Attempt ${attempt} failed, retrying in ${delay}ms`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

function isPermanentError(error: unknown): boolean {
  const err = error as { status?: number; code?: string };
  return err.status === 401 || // Invalid API key
         err.status === 403 || // Forbidden
         err.code === 'INVALID_MODEL';
}
```

---

<!-- /ANCHOR:retry-with-backoff -->
<!-- ANCHOR:offline-mode -->
## 5. OFFLINE MODE

Cached embeddings enable search without network connectivity (REQ-032):

### Cache Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ EMBEDDING CACHE (SQLite)                                        │
├─────────────────────────────────────────────────────────────────┤
│ memory_id     │ TEXT PRIMARY KEY                                │
│ content_hash  │ TEXT (SHA-256 of source content)                │
│ embedding     │ BLOB (float32 array)                            │
│ provider      │ TEXT (voyage/openai)                            │
│ model         │ TEXT (voyage-4/text-embedding-3-small)          │
│ dimensions    │ INTEGER (1024/1536)                             │
│ created_at    │ DATETIME                                        │
│ last_used     │ DATETIME                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Cache Behavior

| Scenario | Behavior |
|----------|----------|
| Content unchanged | Use cached embedding (no API call) |
| Content modified | Re-generate embedding, update cache |
| Network available | Prefer fresh embeddings for new content |
| Network unavailable | Use cache, skip new content indexing |

### Offline Detection

```typescript
async function isOnline(): Promise<boolean> {
  try {
    await fetch('https://api.voyageai.com/health', {
      signal: AbortSignal.timeout(5000)
    });
    return true;
  } catch {
    return false;
  }
}

interface EmbeddingOptions {
  forceRefresh?: boolean;
}

async function getEmbedding(text: string, options: EmbeddingOptions): Promise<Float32Array> {
  const cached = await getFromCache(text);

  if (cached && !options.forceRefresh) {
    return cached;
  }

  if (!(await isOnline())) {
    if (cached) {
      console.log('[OFFLINE] Using cached embedding');
      return cached;
    }
    throw new Error('Offline and no cached embedding available');
  }

  const embedding = await generateEmbedding(text);
  await saveToCache(text, embedding);
  return embedding;
}
```

### Cache Eviction

Cache entries are evicted based on:

| Policy | Threshold | Action |
|--------|-----------|--------|
| Age | >30 days unused | Remove from cache |
| Size | >500MB total | Remove oldest entries |
| Staleness | Content hash mismatch | Invalidate on next access |

---

<!-- /ANCHOR:offline-mode -->
<!-- ANCHOR:provider-health-monitoring -->
## 6. PROVIDER HEALTH MONITORING

Track provider reliability and preemptively switch when degraded (REQ-033):

### Health Metrics

```typescript
interface HealthMetricsConfig {
  windowSize: number;
  latencyThreshold: number;
  errorThreshold: number;
  healthyThreshold: number;
  unhealthyThreshold: number;
}

const HEALTH_METRICS: HealthMetricsConfig = {
  windowSize: 100,        // Rolling window of requests
  latencyThreshold: 2000, // Max acceptable latency (ms)
  errorThreshold: 0.1,    // Max acceptable error rate (10%)
  healthyThreshold: 0.8,  // Minimum health score to use provider
  unhealthyThreshold: 0.5 // Score below which to preemptively switch
};
```

### Health Score Calculation

```typescript
interface ProviderMetrics {
  successRate: number;
  avgLatency: number;
  errorRate: number;
}

function calculateHealth(metrics: ProviderMetrics): number {
  const { successRate, avgLatency, errorRate } = metrics;

  // Weighted health score (0-1)
  const score = (
    (successRate * 0.5) +                              // 50% weight: success rate
    (1 - Math.min(avgLatency / 2000, 1)) * 0.3 +      // 30% weight: latency
    ((1 - errorRate) * 0.2)                            // 20% weight: error rate
  );

  return Math.max(0, Math.min(1, score));
}
```

### Health Status Levels

| Score | Status | Action |
|-------|--------|--------|
| 0.8 - 1.0 | Healthy | Use as primary |
| 0.5 - 0.8 | Degraded | Log warning, continue using |
| 0.0 - 0.5 | Unhealthy | Preemptive switch to fallback |

### Health Check Implementation

```typescript
interface RequestRecord {
  success: boolean;
  latencyMs: number;
  timestamp: number;
}

interface ProviderHealthData {
  requests: RequestRecord[];
  successRate: number;
  avgLatency: number;
  errorRate: number;
  health: number;
}

class ProviderHealthMonitor {
  private metrics: Map<string, ProviderHealthData> = new Map();
  private window: number = 100;

  recordRequest(provider: string, success: boolean, latencyMs: number): void {
    const m = this.getMetrics(provider);
    m.requests.push({ success, latencyMs, timestamp: Date.now() });

    // Keep rolling window
    if (m.requests.length > this.window) {
      m.requests.shift();
    }

    // Update aggregates
    m.successRate = m.requests.filter(r => r.success).length / m.requests.length;
    m.avgLatency = m.requests.reduce((sum, r) => sum + r.latencyMs, 0) / m.requests.length;
    m.errorRate = 1 - m.successRate;
    m.health = calculateHealth(m);
  }

  shouldFallback(provider: string): boolean {
    const m = this.getMetrics(provider);
    return m.health < HEALTH_METRICS.unhealthyThreshold;
  }
}
```

### Automatic Recovery

When a provider recovers:

```typescript
// Health check runs every 5 minutes for unhealthy providers
async function healthCheckLoop(): Promise<void> {
  for (const provider of unhealthyProviders) {
    try {
      await testProvider(provider);
      provider.health = recalculateHealth(provider);

      if (provider.health >= HEALTH_METRICS.healthyThreshold) {
        console.log(`[RECOVERY] ${provider.name} is healthy again`);
        unhealthyProviders.delete(provider);
      }
    } catch {
      // Still unhealthy, continue using fallback
    }
  }
}
```

---

<!-- /ANCHOR:provider-health-monitoring -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Reference Files

- [memory_system.md](./memory_system.md) - Memory system overview and MCP tools
- [save_workflow.md](./save_workflow.md) - Memory save workflow documentation
- [environment_variables.md](../config/environment_variables.md) - API key configuration

### Source Files

- `shared/embeddings/factory.ts` - Provider factory and fallback chain
- `shared/embeddings/providers/voyage.ts` - Voyage AI provider
- `shared/embeddings/providers/openai.ts` - OpenAI provider
- `mcp_server/lib/providers/retry-manager.ts` - Retry and backoff logic
- `mcp_server/lib/search/vector-index.ts` - Embedding cache and vector operations

### Requirements Traceability

| Requirement | Section | Status |
|-------------|---------|--------|
| REQ-029: Provider Fallback | Section 2 | Documented |
| REQ-030: Graceful Degradation | Section 3 | Documented |
| REQ-031: Retry with Backoff | Section 4 | Documented |
| REQ-032: Offline Mode | Section 5 | Documented |
| REQ-033: Health Monitoring | Section 6 | Documented |
<!-- /ANCHOR:related-resources -->
