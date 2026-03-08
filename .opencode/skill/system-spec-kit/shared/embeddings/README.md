---
title: "Embeddings Factory"
description: "Flexible embeddings system supporting multiple backends with strong fallback and per-profile databases."
trigger_phrases:
  - "embeddings factory"
  - "embedding provider selection"
  - "multi-provider embeddings fallback"
---

# Embeddings Factory

> Flexible embeddings system supporting multiple backends with strong fallback and per-profile databases.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. RELATED DOCUMENTS](#8--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is the Embeddings Factory?

The Embeddings Factory is a multi-provider architecture for generating vector embeddings. It automatically selects the best available provider based on environment configuration, with strong fallback to ensure embedding generation never fails.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| Providers | 3 | Voyage, HF Local, OpenAI |
| Default Model | nomic-embed-text-v1.5 | 768-dimensional vectors |
| Recommended | Voyage | Best retrieval quality (+8%) |

### Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Provider** | Supports Voyage, OpenAI, and HuggingFace local |
| **Auto-Detection** | Automatically selects provider based on available API keys |
| **Per-Profile DBs** | Each provider/model combo uses its own SQLite database |
| **Strong Fallback** | Degrades gracefully to local embeddings if cloud fails |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| @xenova/transformers | 2.0+ | Latest |

### Provider Comparison

| Feature | Voyage | HF Local | OpenAI |
|---------|--------|----------|--------|
| Cost | ~$0.06/1M | Free | ~$0.02/1M |
| Quality | Best (+8%) | Good | Good |
| Latency | Low | Medium | Low-Medium |
| Privacy | Cloud | Local | Cloud |
| Offline | No | Yes | No |
| Setup | API key | Easy | API key |
| Dimension | 1024 | 768 | 1536/3072 |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 30-Second Setup

```bash
# Without configuration: uses HF local (no API key needed)
node context-server.ts

# With Voyage (recommended): auto-detects the key
export VOYAGE_API_KEY=pa-...
node context-server.ts

# With OpenAI: auto-detects the key
export OPENAI_API_KEY=sk-...
node context-server.ts
```

### Verify Installation

```javascript
const embeddings = require('./embeddings');
const metadata = embeddings.getProviderMetadata();
console.log(metadata);
// Expected: { provider: 'voyage', model: 'voyage-code-2', dim: 1024, healthy: true }
```

### First Use

```javascript
const embeddings = require('./embeddings');

// Generate an embedding
const embedding = await embeddings.generateDocumentEmbedding('Hello world');
console.log(`Dimensions: ${embedding.length}`);
// Expected: Dimensions: 1024 (Voyage) or 768 (HF local)
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
embeddings/
├── profile.ts              # Defines EmbeddingProfile and slug management
├── factory.ts              # Factory that selects the appropriate provider
├── README.md               # This file
└── providers/
    ├── hf-local.ts         # HuggingFace local (fallback)
    ├── voyage.ts           # Voyage AI (recommended)
    ├── openai.ts           # OpenAI embeddings API
    └── README.md           # Provider comparison and interface docs
```

### Key Files

| File | Purpose |
|------|---------|
| `factory.ts` | Provider selection logic and auto-detection |
| `profile.ts` | Database path generation based on provider/model |
| `providers/voyage.ts` | Voyage AI integration (recommended) |
| `providers/hf-local.ts` | Local HuggingFace fallback |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:features -->
## 4. FEATURES

### Per-Profile Databases

Each unique combination of `{provider, model, dimension}` uses its own SQLite database:

```
database/
├── context-index.sqlite                              # Legacy (hf-local + nomic + 768)
├── context-index__openai__text-embedding-3-small__1536.sqlite
├── context-index__openai__text-embedding-3-large__3072.sqlite
└── context-index__hf-local__custom-model__768.sqlite
```

**Benefits:**
- No "dimension mismatch" errors
- Changing providers doesn't require migration
- Experiment without losing data

---

### Strong Fallback

If a cloud provider fails during warmup or healthcheck (authentication or network issues), the system automatically degrades to HF local **before** indexing data, preventing dimension mixing.

```
Cloud Provider → Health Check Failed → Fallback to HF Local → Continue
```

---

### Legacy Compatibility

The public API maintains 100% compatibility. Existing code works without changes:

```javascript
// Still works
const { generateDocumentEmbedding, getEmbeddingDimension } = require('./embeddings');
```

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VOYAGE_API_KEY` | No | - | Voyage AI API key (recommended) |
| `OPENAI_API_KEY` | No | - | OpenAI API key |
| `EMBEDDINGS_PROVIDER` | No | `auto` | Force specific provider |
| `OPENAI_EMBEDDINGS_MODEL` | No | `text-embedding-3-small` | OpenAI model override |
| `HF_EMBEDDINGS_MODEL` | No | `nomic-ai/nomic-embed-text-v1.5` | HF model override |

### Manual Override

```bash
# Force HF local even if API keys exist
export EMBEDDINGS_PROVIDER=hf-local

# Force OpenAI (requires key)
export EMBEDDINGS_PROVIDER=openai
export OPENAI_API_KEY=sk-...

# Configure specific model
export OPENAI_EMBEDDINGS_MODEL=text-embedding-3-large  # 3072 dims
export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5
```

### Configuration Precedence

1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
4. Fallback: HF local

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Generate Embeddings

```javascript
const embeddings = require('./embeddings');

// For indexing documents
const docEmbedding = await embeddings.generateDocumentEmbedding('text...');

// For search queries
const queryEmbedding = await embeddings.generateQueryEmbedding('search...');
```

**Result**: Float32Array with provider-specific dimensions

---

### Example 2: Get Provider Metadata

```javascript
const embeddings = require('./embeddings');

// Current provider info
const metadata = embeddings.getProviderMetadata();
console.log(metadata);
// {
//   provider: 'openai',
//   model: 'text-embedding-3-small',
//   dim: 1536,
//   healthy: true
// }

// Complete profile with database path
const profile = embeddings.getEmbeddingProfile();
console.log(profile.getDatabasePath('/base/dir'));
// '/base/dir/context-index__openai__text-embedding-3-small__1536.sqlite'
```

---

### Example 3: Pre-Warmup (Recommended)

```javascript
const embeddings = require('./embeddings');

// Call once at startup to download/load model
await embeddings.preWarmModel();
// Downloads ~274MB on first run for HF local
```

---

### Example 4: Testing

```bash
# Basic test (without loading heavy models)
node scripts/tests/test-embeddings-factory.js

# With OpenAI
OPENAI_API_KEY=sk-... node scripts/tests/test-embeddings-factory.js
```

---

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Document embedding | `generateDocumentEmbedding(text)` | Indexing content |
| Query embedding | `generateQueryEmbedding(text)` | Search queries |
| Pre-warm model | `preWarmModel()` | Application startup |
| Check provider | `getProviderMetadata()` | Debugging, logging |
| Get DB path | `getEmbeddingProfile().getDatabasePath(dir)` | Database management |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Common Issues

#### Dimension Mismatch

**Symptom**: `Error: dimension mismatch`

**Cause**: Switched providers without using per-profile databases

**Solution**: Should no longer occur with per-profile DBs. If you see this error, verify you're not using forced `MEMORY_DB_PATH`.

---

#### OpenAI Provider Requires Key

**Symptom**: `Error: OpenAI provider requires OPENAI_API_KEY`

**Cause**: Forced OpenAI provider without API key

**Solution**:
```bash
# Force HF local instead
export EMBEDDINGS_PROVIDER=hf-local
```

---

#### Model Not Loaded

**Symptom**: `Error: Model not loaded` or timeout on first embedding

**Cause**: HF local downloads ~274MB on first run

**Solution**:
```javascript
// Pre-warm the model on startup
await embeddings.preWarmModel();
```

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Dimension mismatch | Delete old DB, let per-profile create new one |
| API key not found | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
| Slow first embedding | Call `preWarmModel()` at startup |
| Wrong provider | Set `EMBEDDINGS_PROVIDER` explicitly |

### Diagnostic Commands

```bash
# Check active provider (via MCP tool memory_health)
{
  "embeddingProvider": {
    "provider": "...",
    "model": "...",
    "dimension": ...
  }
}

# Test embedding generation
node -e "require('./embeddings').generateDocumentEmbedding('test').then(e => console.log('Dims:', e.length))"

# Check environment
echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related -->
## 8. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [shared/README.md](../README.md) | Parent shared library documentation |
| [generate-context.js](../../scripts/dist/memory/generate-context.js) | Main script using embeddings |
| [SKILL.md](../../SKILL.md) | System spec-kit skill documentation |

### External Resources

| Resource | Description |
|----------|-------------|
| [@xenova/transformers](https://github.com/xenova/transformers.js) | JavaScript ML library for HF local |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Default HF embedding model |
| [Voyage AI](https://www.voyageai.com/) | Recommended embedding provider |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) | OpenAI embedding API docs |

### Provider Status

`factory.ts` reserves the `ollama` provider name but does not implement it yet. Current production providers are `voyage`, `openai`, and `hf-local`.

<!-- /ANCHOR:related -->

---

*Documentation version: 2.0 | Last updated: 2025-12-31*
