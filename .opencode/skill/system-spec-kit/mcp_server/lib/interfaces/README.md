---
title: "Interfaces"
description: "Protocol abstractions for embedding/vector backends, with shared-package migration notes."
trigger_phrases:
  - "interfaces"
  - "embedding provider interface"
  - "vector store interface"
---

# Interfaces

> Protocol abstractions for embedding/vector backends, with shared-package migration notes.

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

The interfaces module documents contracts for embedding providers and vector stores. Most interfaces now live in `@spec-kit/shared`; this local module remains the compatibility layer and local vector-store stub.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Testability** | Mock implementations for fast, deterministic unit tests |
| **Flexibility** | Swap backends (local vs API embeddings) via configuration |
| **Adaptability** | Migrate to new systems (e.g., LadybugDB) without interface changes |
| **Decoupling** | Core logic depends on interfaces, not concrete implementations |
| **Document-Type Indexing Alignment** | Retrieval pipeline preserves document metadata (`documentType`, `specLevel`) through storage boundaries |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

> **Note**: Most source files (`embedding-provider.ts`, `index.ts`) were relocated to `@spec-kit/shared` during the shared package migration. `vector-store.ts` remains as a local stub/re-export.

```
interfaces/
├── vector-store.ts         # Vector store interface (stub/re-export from @spec-kit/shared)
└── README.md               # This file
```

### Relocated Files

| File | Status |
|------|--------|
| `embedding-provider.ts` | Relocated to `@spec-kit/shared` |
| `vector-store.ts` | **Remains locally** (stub/re-export) |
| `index.ts` | Relocated to `@spec-kit/shared` |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Local Runtime Contract

The local module currently exports one runtime contract:

| Export | Location | Purpose |
|--------|----------|---------|
| `IVectorStore` | `vector-store.ts` | Abstract base class for JS runtime consumers; subclasses must implement search/upsert/delete/get/stats/availability/dimension/close |

### Shared-Package Contracts

`IEmbeddingProvider` and TypeScript-first interface definitions are maintained in `@spec-kit/shared` as part of the shared-package migration.

### Test-Only Mocks

`MockEmbeddingProvider` and `MockVectorStore` are implemented in `../../tests/interfaces.vitest.ts` for interface compliance tests. They are not exported from `lib/interfaces/`.

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Implementing a Custom Vector Store

```typescript
import { IVectorStore } from './vector-store';

class InMemoryVectorStore extends IVectorStore {
  async search(embedding, topK, options) { return []; }
  async upsert(id, embedding, metadata) { return 1; }
  async delete(id) { return true; }
  async get(id) { return null; }
  async getStats() { return { total: 0, pending: 0, success: 0, failed: 0, retry: 0 }; }
  isAvailable() { return true; }
  getEmbeddingDimension() { return 1024; }
  close() {}
}
```

### Verifying Base-Class Enforcement

```typescript
import { IVectorStore } from './vector-store';

const base = new IVectorStore();
await base.search([], 10); // throws: "Method search() must be implemented by subclass"
```

### Using Test-Only Mocks

Use `../../tests/interfaces.vitest.ts` when you need the in-memory `MockEmbeddingProvider` or `MockVectorStore` test helpers.

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [./vector-store.ts](./vector-store.ts) | Local runtime abstract class contract |
| [../search/vector-index-impl.ts](../search/vector-index-impl.ts) | Main in-repo `IVectorStore` implementation |
| [../../tests/interfaces.vitest.ts](../../tests/interfaces.vitest.ts) | Interface compliance tests and mock classes |

### Design Patterns

| Pattern | Application |
|---------|-------------|
| Interface Segregation | Each interface has single responsibility |
| Dependency Injection | Consumers accept interface, not concrete class |
| Strategy Pattern | Swap implementations at runtime |

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-02-16
