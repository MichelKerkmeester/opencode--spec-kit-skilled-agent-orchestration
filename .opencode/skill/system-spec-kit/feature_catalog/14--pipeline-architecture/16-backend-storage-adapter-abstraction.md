# Backend storage adapter abstraction

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Backend storage adapter abstraction is a deferred plan for vector/graph/document storage abstractions while SQLite handles current scale.

## 2. CURRENT REALITY

**PLANNED (Sprint 019): DEFERRED.** Vector/graph/document storage abstractions (`IVectorStore`, `IGraphStore`, `IDocumentStore`) are deferred to avoid premature abstraction while SQLite coupling handles current scale. Estimated effort: M-L (1-2 weeks).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Backend storage adapter abstraction
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

Right now the system is tightly connected to one specific type of database. This planned feature would add a flexible layer so the database could be swapped out for a different one without rewriting the rest of the system. It is deferred because the current database handles the workload fine, and building the swap layer before it is needed would be premature effort.
