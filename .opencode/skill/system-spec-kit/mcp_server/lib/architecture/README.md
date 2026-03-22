---
title: "Architecture Module"
description: "7-layer MCP architecture with token budgets and document-aware routing."
trigger_phrases:
  - "architecture"
  - "layer definitions"
  - "token budgets"
---

# Architecture Module

> 7-layer MCP architecture with token budgets and document-aware routing.

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

The architecture module defines the 7-layer MCP tool organization (T060) that enables progressive disclosure from high-level orchestration to specialized operations. This layer model also frames document-aware behavior (spec documents, memory notes, constitutional files) used across indexing and retrieval.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Progressive Disclosure** | Start with high-level, drill down as needed |
| **Token Efficiency** | Higher layers = fewer tokens, more targeted |
| **Cognitive Load** | Reduce choices at each decision point |
| **Document Awareness** | Keep retrieval aware of `documentType` and `specLevel` metadata |

### Layer Summary

| Layer | Name | Token Budget | Purpose |
|-------|------|--------------|---------|
| L1 | Orchestration | 2000 | Unified entry points with intent-aware routing |
| L2 | Core | 1500 | Primary memory operations (search, save, triggers) |
| L3 | Discovery | 800 | Browse and explore (list, stats, health) |
| L4 | Mutation | 500 | Modify existing memories (update, delete, validate) |
| L5 | Lifecycle | 600 | Checkpoint and version management |
| L6 | Analysis | 1200 | Deep inspection and causal analysis |
| L7 | Maintenance | 1000 | System maintenance and bulk operations |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
architecture/
├── layer-definitions.ts  # 7-layer hierarchy with token budgets (~8KB)
└── README.md             # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `layer-definitions.ts` | Layer constants, tool-to-layer mapping, token budget helpers, documentation generator |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Layer Definitions

Each layer includes:
- **id**: Layer identifier (L1-L7)
- **name**: Human-readable name
- **description**: Purpose and usage guidance
- **tokenBudget**: Maximum tokens for responses
- **priority**: Layer order (1 = highest)
- **useCase**: When to use this layer
- **tools**: Array of tools belonging to this layer

### Exported Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `getLayerPrefix` | `(toolName: string) => string` | Get layer prefix string, e.g., `[L2:Core]` |
| `enhanceDescription` | `(toolName: string, desc: string) => string` | Add layer prefix to tool description |
| `getTokenBudget` | `(toolName: string) => number` | Get token budget for a tool (default: 1000) |
| `getLayerInfo` | `(toolName: string) => LayerDefinition \| null` | Get full layer definition for a tool |
| `getLayersByPriority` | `() => LayerDefinition[]` | Get all layers sorted by priority |
| `getRecommendedLayers` | `(taskType: TaskType) => LayerId[]` | Get recommended layers for task type |
| `getLayerDocumentation` | `() => string` | Generate markdown documentation |

### Exported Types

`LayerDefinition`, `LayerId`, `TaskType`

### Exported Constants

`LAYER_DEFINITIONS`, `TOOL_LAYER_MAP`

<!-- /ANCHOR:features -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

### Basic Import

```typescript
import {
  LAYER_DEFINITIONS,
  getTokenBudget,
  getLayerPrefix
} from './layer-definitions';
```

### Get Token Budget

```typescript
const budget = getTokenBudget('memory_search');
// Returns: 1500 (L2: Core layer budget)
```

### Enhance Tool Description

```typescript
const enhanced = enhanceDescription('memory_search', 'Search memories');
// Returns: "[L2:Core] Search memories"
```

### Get Recommended Layers

```typescript
const layers = getRecommendedLayers('search');
// Returns: ['L1', 'L2'] - Start orchestration, fallback to core
```

<!-- /ANCHOR:usage -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../response/](../response/) | Response envelope formatting |
| [../cache/](../cache/) | Tool output caching |

### Related Modules

| Module | Relationship |
|--------|--------------|
| `context-server.ts` | Uses layer definitions for tool organization |

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-02-16
