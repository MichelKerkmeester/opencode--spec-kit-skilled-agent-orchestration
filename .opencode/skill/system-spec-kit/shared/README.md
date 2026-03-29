---
title: "Shared Library Modules"
description: "Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, retrieval algorithms, contracts, config, and utility logic."
trigger_phrases:
  - "shared library modules"
  - "embeddings trigger extractor shared"
  - "shared TypeScript modules"
---

# Shared Library Modules

> Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, scoring, normalization, and utility logic. Source files are `.ts`. `shared/` builds as ESM (`package.json` sets `"type": "module"` and `tsconfig.json` uses NodeNext), with generated output in `shared/dist/`.

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

### What is the shared/ Directory?

The `shared/` directory is the **canonical source** for shared modules used by both:
- **CLI scripts** (`scripts/`) - `generate-context.ts` and other utilities
- **MCP server** (`mcp_server/`) - `context-server.ts` and memory tools

This consolidation eliminates code duplication and ensures consistent behavior across all entry points.

### Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     SHARED LIB ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ┌────────────────────┐                              │
│              │  shared/           │ ◄── CANONICAL SOURCE (.ts)   │
│              │  ├── embeddings.ts │                              │
│              │  ├── chunking.ts   │                              │
│              │  ├── trigger-      │                              │
│              │  │   extractor.ts  │                              │
│              │  └── embeddings/   │ ◄── Provider implementations │
│              └────────────────────┘                              │
│                       ▲                                          │
│           ┌───────────┴───────────────────┐                      │
│           │                               │                      │
│    ┌──────┴──────┐                 ┌──────┴──────┐               │
│    │scripts/lib  │                 │mcp_server/  │               │
│    │(RE-EXPORTS) │                 │lib/         │               │
│    ├─────────────┤                 │(RE-EXPORTS) │               │
│    │embeddings.ts│                 ├─────────────┤               │
│    │ export *    │                 │embeddings.ts│               │
│    │ from '@spec-│                 │ explicit    │               │
│    │ kit/shared/ │                 │ named re-   │               │
│    │ embeddings' │                 │ exports     │               │
│    └─────────────┘                 │ from shared │               │
│                                    └─────────────┘               │
│                                                                  │
│  Note: Source is TypeScript (.ts); compiled output is ESM (.js)  │
│  in shared/dist via `tsc -b` with NodeNext module resolution.    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Statistics

| Category                 | Count         | Details                                          |
| ------------------------ | ------------- | ------------------------------------------------ |
| Top-Level TS Modules     | 8             | index, embeddings, chunking, trigger extractor, types, normalization, config, paths |
| Top-Level Subdirectories | 10            | algorithms, contracts, dist, embeddings, lib, mcp_server, parsing, ranking, scoring, utils |
| Provider Implementations | 3             | OpenAI, HF Local, Voyage                         |
| Embedding Dimensions     | 768/1024/1536 | Provider-dependent                               |

### Key Features

| Feature                         | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| **Multi-Provider Embeddings**   | Supports Voyage, OpenAI, HuggingFace local with auto-detection |
| **Dynamic Dimension Detection** | 768 (HF), 1024 (Voyage), 1536/3072 (OpenAI)                    |
| **Task-Specific Functions**     | Document, query and clustering embeddings                      |
| **TF-IDF + Semantic Triggers**  | Advanced trigger phrase extraction (v11)                       |
| **Adaptive Fusion Support**     | Intent-aware weighting used by the runtime 5-channel retrieval pipeline (Vector, FTS5, BM25, Graph, Degree) |
| **7 Intent Profiles**           | Task-specific weight profiles: add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |

### Requirements

| Requirement          | Minimum | Recommended |
| -------------------- | ------- | ----------- |
| Node.js              | 18+     | 20+         |
| @huggingface/transformers | 2.0+    | Latest      |

<!-- /ANCHOR:overview -->

---

## 1B. BOUNDARY AND IMPORT POLICY

`shared/` is the canonical source for modules consumed by **both** `scripts/` and `mcp_server/`.

- **Import convention**: Consumers should import via `@spec-kit/shared/*` path alias
- **Stability**: Shared modules must be stable — breaking changes require coordination with both consumers
- **New modules**: Document purpose and consumer expectations before adding
- **Ownership**: See [Architecture Boundaries](../ARCHITECTURE.md) for the full dependency matrix

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 30-Second Setup

```typescript
// From CLI scripts (scripts/*.ts)
import { generateEmbedding } from '@spec-kit/shared/embeddings';
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';

// From MCP server (mcp_server/*.ts)
import { generateEmbedding } from '@spec-kit/shared/embeddings';
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
```

### Verify Installation

```bash
# Check that all modules exist
ls .opencode/skill/system-spec-kit/shared/

# Expected source files:
# index.ts, types.ts, normalization.ts, config.ts, paths.ts
# embeddings.ts, chunking.ts, trigger-extractor.ts
# algorithms/, contracts/, embeddings/, lib/, parsing/, scoring/, utils/
# Compiled output is written to shared/dist/
```

### First Use

```typescript
import { generateDocumentEmbedding, getProviderMetadata } from '@spec-kit/shared/embeddings';

// Check active provider
const meta: { provider: string; model: string; dim: number; healthy: boolean } = getProviderMetadata();
console.log(`Provider: ${meta.provider}, Dimensions: ${meta.dim}`);
// Example: "Provider: voyage, Dimensions: 1024"

// Generate an embedding
const embedding: Float32Array = await generateDocumentEmbedding('How does authentication work?');
console.log(`Embedding dimensions: ${embedding.length}`);
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
shared/
├── index.ts                    # Barrel exports for all shared modules
├── types.ts                    # Shared type definitions
├── normalization.ts            # DB row <-> app object normalization
├── config.ts                   # Shared DB directory resolution and update markers
├── paths.ts                    # Shared DB path resolution
├── embeddings.ts               # Multi-provider embedding generation
├── chunking.ts                 # Semantic chunking utilities
├── trigger-extractor.ts        # Trigger phrase extraction
├── package.json                # @spec-kit/shared package manifest
├── tsconfig.json               # TypeScript project configuration
├── algorithms/                 # Shared retrieval fusion and reranking algorithms
│   ├── adaptive-fusion.ts      # Intent-aware weighted RRF profiles
│   ├── mmr-reranker.ts         # Diversity-aware reranking helpers
│   ├── rrf-fusion.ts           # Reciprocal rank fusion primitives
│   └── index.ts                # Algorithms barrel
├── contracts/
│   └── retrieval-trace.ts      # Typed trace/envelope contracts for retrieval responses
├── embeddings/                 # Provider implementations and profile helpers
│   ├── factory.ts              # Provider selection and auto-detection
│   ├── profile.ts              # Embedding profiles and DB path generation
│   ├── README.md               # Embeddings factory documentation
│   └── providers/
│       ├── hf-local.ts         # HuggingFace local (fallback)
│       ├── openai.ts           # OpenAI embeddings API
│       ├── voyage.ts           # Voyage AI (recommended)
│       └── README.md           # Provider comparison and interface docs
├── lib/
│   └── structure-aware-chunker.ts # Markdown-aware chunking helpers
├── mcp_server/
│   └── database/
│       ├── .db-updated         # Update marker for the shared database directory
│       ├── README.md           # Database directory notes and handling guidance
│       └── speckit_memory.db   # Active shared SQLite database file
├── parsing/
│   ├── memory-sufficiency.ts          # Memory sufficiency checks
│   ├── memory-template-contract.ts    # Template contract validation for memory files
│   ├── quality-extractors.ts          # Quality score/flags extraction
│   ├── quality-extractors.test.ts     # Parsing coverage for quality extraction
│   ├── spec-doc-health.ts             # Spec document health checks
│   └── spec-doc-health.test.ts        # Tests for spec document health checks
├── ranking/
│   ├── learned-combiner.ts     # ML-based score combiner for retrieval ranking
│   └── matrix-math.ts          # Matrix operations for ranking computations
├── scoring/
│   ├── folder-scoring.ts       # Composite folder ranking logic
│   └── README.md
├── utils/
│   ├── path-security.ts        # Path validation and containment checks
│   ├── retry.ts                # Retry/backoff classification logic
│   ├── jsonc-strip.ts          # JSONC comment stripping helper
│   ├── token-estimate.ts       # Shared token count estimation
│   └── README.md
├── dist/                       # Compiled JS output
└── README.md
```

### Key Files

| File                    | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `embeddings.ts` | Unified API for multi-provider embedding generation |
| `trigger-extractor.ts` | Trigger phrase extraction for memory indexing |
| `normalization.ts` | Canonical DB row <-> app object conversion |
| `config.ts` | Shared DB directory resolution and update marker paths |
| `paths.ts` | Canonical `context-index.sqlite` path resolution |
| `algorithms/` | Shared adaptive fusion, RRF fusion, and MMR reranking helpers |
| `contracts/retrieval-trace.ts` | Typed retrieval trace and context envelope contracts |
| `scoring/folder-scoring.ts` | Composite folder scoring and ranking |
| `utils/token-estimate.ts` | Shared token count estimation (chars/4 heuristic) |
| `parsing/quality-extractors.ts` | Quality score and flags extraction from frontmatter |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:features -->
## 4. FEATURES

### Multi-Provider Embeddings (embeddings.ts)

**Purpose**: Unified embedding generation across multiple providers

| Aspect             | Details                                 |
| ------------------ | --------------------------------------- |
| **Providers**      | Voyage AI, OpenAI, HuggingFace local    |
| **Auto-Detection** | Selects best provider based on API keys |
| **Fallback**       | Graceful degradation to HF local        |
| **Task Types**     | Document, query and clustering embeddings  |

**Key Functions**:

| Function                          | Purpose            | Returns          |
| --------------------------------- | ------------------ | ---------------- |
| `generateEmbedding(text)`         | Generic embedding  | Float32Array     |
| `generateDocumentEmbedding(text)` | For indexing       | Float32Array     |
| `generateQueryEmbedding(text)`    | For search         | Float32Array     |
| `generateBatchEmbeddings(texts)`  | Batch processing   | Float32Array[]   |
| `getEmbeddingDimension()`         | Current dimensions | number           |
| `getProviderMetadata()`           | Provider info      | Object           |
| `preWarmModel()`                  | Pre-load model     | Promise<boolean> |

### Consumer Shims

Two re-export shims exist for path convenience:
- `scripts/lib/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
- `mcp_server/lib/providers/embeddings.ts` → explicit named re-exports from `@spec-kit/shared/embeddings`

The canonical source is the `shared/` package. `shared/embeddings.ts` is the public shared entry point for embeddings, while `shared/embeddings/` contains provider-specific implementation details. These shims stay implementation-free: the scripts shim uses a barrel re-export, while the MCP server shim uses explicit named re-exports for auditability.

---

### Trigger Phrase Extraction (trigger-extractor.ts)

**Purpose**: Extract trigger phrases for proactive memory surfacing

| Aspect          | Details                                         |
| --------------- | ----------------------------------------------- |
| **Algorithm**   | TF-IDF + N-gram hybrid with priority extraction |
| **Version**     | v11.0.0                                         |
| **Performance** | <100ms for typical content (<10KB)              |
| **Output**      | 8-25 normalized trigger phrases                 |

**Priority Extraction Types**:

| Type            | Bonus | Example                               |
| --------------- | ----- | ------------------------------------- |
| Problem Terms   | 3.0x  | "short output", "missing data"        |
| Technical Terms | 2.5x  | "generateContext", "memory_search"    |
| Decision Terms  | 2.0x  | "chose openai", "selected voyage"     |
| Action Terms    | 1.5x  | "fix bug", "add feature"              |
| Compound Nouns  | 1.3x  | "trigger extraction", "memory system" |

**Key Functions**:

| Function                               | Purpose         | Returns  |
| -------------------------------------- | --------------- | -------- |
| `extractTriggerPhrases(text)`          | Extract phrases | string[] |
| `extractTriggerPhrasesWithStats(text)` | With metadata   | Object   |

---

### Provider Comparison

| Feature    | Voyage     | HF Local | OpenAI    |
| ---------- | ---------- | -------- | --------- |
| Cost       | ~$0.06/1M  | Free     | ~$0.02/1M |
| Quality    | Best (+8%) | Good     | Good      |
| Dimensions | 1024       | 768      | 1536/3072 |
| Privacy    | Cloud      | Local    | Cloud     |
| Offline    | No         | Yes      | No        |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Environment Variables

| Variable                  | Required | Default                          | Description                     |
| ------------------------- | -------- | -------------------------------- | ------------------------------- |
| `VOYAGE_API_KEY`          | No       | -                                | Voyage AI API key (recommended) |
| `OPENAI_API_KEY`          | No       | -                                | OpenAI API key                  |
| `EMBEDDINGS_PROVIDER`     | No       | `auto`                           | Force specific provider         |
| `OPENAI_EMBEDDINGS_MODEL` | No       | `text-embedding-3-small`         | OpenAI model                    |
| `HF_EMBEDDINGS_MODEL`     | No       | `nomic-ai/nomic-embed-text-v1.5` | HF model                        |

### Provider Selection Precedence

1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
4. Fallback: HF local (no API key needed)

### Per-Profile Databases

The shared database directory currently contains the runtime database plus its marker/readme files:

```
database/
├── .db-updated       # Update marker for the shared database directory
├── README.md         # Database directory notes and handling guidance
└── speckit_memory.db # Active shared SQLite database file
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: CLI Script Usage

```typescript
// In scripts/memory/generate-context.ts or similar
import { generateDocumentEmbedding, getEmbeddingDimension } from '@spec-kit/shared/embeddings';
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';

// Generate embedding for memory content
const content: string = 'Decided to use Voyage API for embeddings due to quality';
const embedding: Float32Array = await generateDocumentEmbedding(content);
console.log(`Dimensions: ${embedding.length}`);

// Extract trigger phrases
const triggers: string[] = extractTriggerPhrases(content);
console.log(`Triggers: ${triggers.join(', ')}`);
// Output: "voyage api, embeddings, quality"
```

---

### Example 2: MCP Server Usage

```typescript
// In mcp_server/context-server.ts
import { generateQueryEmbedding, preWarmModel } from '@spec-kit/shared/embeddings';
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';

// Pre-warm on startup
await preWarmModel();

// Search handler
async function handleSearch(query: string): Promise<void> {
  const queryEmbedding: Float32Array = await generateQueryEmbedding(query);
  // Use embedding for vector search...
}
```

---

### Example 3: Get Provider Information

```typescript
import { getProviderMetadata, getEmbeddingProfile } from '@spec-kit/shared/embeddings';

// Check current provider
const meta = getProviderMetadata();
console.log(meta);
// { provider: 'voyage', model: 'voyage-code-2', dim: 1024, healthy: true }

// Get database path for current profile
const profile = getEmbeddingProfile();
const dbPath: string = profile.getDatabasePath('/base/path');
// '/base/path/context-index__voyage__voyage-code-2__1024.sqlite'
```

---

### Example 4: Trigger Extraction with Stats

```typescript
import { extractTriggerPhrasesWithStats } from '@spec-kit/shared/trigger-extractor';

const result = extractTriggerPhrasesWithStats(memoryContent);
console.log(result);
// {
//   phrases: ['memory search', 'trigger extraction', ...],
//   stats: { inputLength: 5000, phraseCount: 15, extractionTimeMs: 42 },
//   breakdown: {
//     problemTerms: 2,
//     technicalTerms: 5,
//     decisionTerms: 1,
//     ...
//   }
// }
```

---

### Common Patterns

| Pattern            | Code                              | When to Use         |
| ------------------ | --------------------------------- | ------------------- |
| Document embedding | `generateDocumentEmbedding(text)` | Indexing content    |
| Query embedding    | `generateQueryEmbedding(text)`    | Search queries      |
| Batch processing   | `generateBatchEmbeddings(texts)`  | Multiple texts      |
| Check provider     | `getProviderMetadata()`           | Debugging, logging  |
| Extract triggers   | `extractTriggerPhrases(text)`     | Memory indexing     |
| Pre-warm model     | `preWarmModel()`                  | Application startup |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Common Issues

#### Provider Not Loading

**Symptom**: `Error: Provider not initialized`

**Cause**: Provider failed to initialize or model not loaded

**Solution**:
```typescript
// Pre-warm on startup
import { preWarmModel } from './embeddings';
await preWarmModel();
```

---

#### Dimension Mismatch

**Symptom**: `Error: dimension mismatch (expected 768, got 1024)`

**Cause**: Changed providers without updating database

**Solution**: Per-profile databases should prevent this. If it occurs:
```bash
# Delete old database and let system create new one
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

---

#### Slow First Embedding

**Symptom**: First embedding takes 30+ seconds

**Cause**: HF local downloads ~274MB model on first run

**Solution**:
```typescript
// Pre-warm at startup to download/load model
await preWarmModel();
```

---

### Quick Fixes

| Problem               | Quick Fix                                              |
| --------------------- | ------------------------------------------------------ |
| Provider not detected | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
| Wrong provider        | Set `EMBEDDINGS_PROVIDER` explicitly                   |
| Slow triggers         | Ensure content is <10KB for <100ms                     |
| Empty triggers        | Check content length (minimum 50 chars)                |

### Diagnostic Commands

```bash
# Check environment
echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"

# Run from shared/ so Node resolves compiled modules in dist/
cd .opencode/skill/system-spec-kit/shared

# Test embedding generation (runs compiled ESM .js output)
node --input-type=module -e "const { generateDocumentEmbedding } = await import('./dist/embeddings.js'); const e = await generateDocumentEmbedding('test'); console.log('Dims:', e.length)"

# Test trigger extraction (runs compiled ESM .js output)
node --input-type=module -e "const { extractTriggerPhrases } = await import('./dist/trigger-extractor.js'); console.log(extractTriggerPhrases('memory search trigger extraction'))"
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related -->
## 8. RELATED DOCUMENTS

### Internal Documentation

| Document                                                | Purpose                                    |
| ------------------------------------------------------- | ------------------------------------------ |
| [scripts/lib/README.md](../scripts/lib/README.md)       | CLI scripts library (re-exports from here) |
| [mcp_server/lib/README.md](../mcp_server/lib/README.md) | MCP server library (re-exports from here)  |
| [embeddings/README.md](./embeddings/README.md)          | Embeddings factory detailed docs           |
| [SKILL.md](../SKILL.md)                                 | Parent skill documentation                 |

### External Resources

| Resource                                                                  | Description                        |
| ------------------------------------------------------------------------- | ---------------------------------- |
| [@huggingface/transformers](https://github.com/huggingface/transformers.js) | JavaScript ML library for HF local |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Default HF embedding model         |
| [Voyage AI](https://www.voyageai.com/)                                    | Recommended embedding provider     |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)   | OpenAI embedding API docs          |

<!-- /ANCHOR:related -->

---

*Documentation version: 2.1 | Last updated: 2026-02-21 | Migrated to TypeScript*
