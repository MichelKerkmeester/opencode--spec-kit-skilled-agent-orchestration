---
title: "Memory and Document Type Configuration"
description: "Memory-type decay configuration plus document-type inference and defaults."
trigger_phrases:
  - "memory types"
  - "half-life configuration"
  - "type inference"
---

# Memory and Document Type Configuration

> Memory-type decay configuration plus document-type inference and defaults.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. KEY CONCEPTS](#2--key-concepts)
- [3. STRUCTURE](#3--structure)
- [4. USAGE](#4--usage)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is the Config Module?

The config module defines two related configuration layers: memory types (decay behavior) and spec document types (indexing and weighting behavior). This keeps retrieval aligned with both conversational memory state and spec-folder document structure.

### Key Features

| Feature | Description |
|---------|-------------|
| **9 Memory Types** | From working (1-day half-life) to meta-cognitive (never decays) |
| **8 Spec Document Types** | `spec`, `plan`, `tasks`, `checklist`, `decision_record`, `implementation_summary`, `research`, `handover` |
| **Automatic Inference** | Detect memory type from path, frontmatter, or keywords |
| **Document Inference** | Detect `documentType` from spec-folder filenames and location |
| **Tier Mapping** | Link importance tiers to appropriate memory types |
| **Validation** | Verify type assignments and warn on mismatches |

### Module Statistics

| Category | Count | Details |
|----------|-------|---------|
| Memory Types | 9 | Cognitive categories with differentiated decay |
| Spec Document Types | 8 | Canonical spec folder docs recognized by filename |
| Path Patterns | 30+ | Regex patterns for type inference |
| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
| Half-Life Range | 1-365 days | Plus null for never-decay |

<!-- /ANCHOR:overview -->

---

## 2. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### Memory Types and Half-Lives

| Type | Half-Life | Auto-Expire | Description |
|------|-----------|-------------|-------------|
| **working** | 1 day | 7 days | Active session context, immediate task state |
| **episodic** | 7 days | 30 days | Event-based: sessions, debugging, discoveries |
| **prospective** | 14 days | 60 days | Future intentions: TODOs, next steps, plans |
| **implicit** | 30 days | 120 days | Learned patterns: code styles, workflows |
| **declarative** | 60 days | 180 days | Facts: implementations, APIs, technical details |
| **procedural** | 90 days | 365 days | How-to: processes, procedures, guides |
| **semantic** | 180 days | Never | Core concepts: architecture, design principles |
| **autobiographical** | 365 days | Never | Project history: milestones, major decisions |
| **meta-cognitive** | Never | Never | Rules about rules: constitutional, invariants |

### Type Inference Priority

The system infers memory type using this precedence:

| Priority | Source | Confidence | Example |
|----------|--------|------------|---------|
| 1 | Frontmatter explicit | 1.0 | `memory_type: procedural` |
| 2 | Importance tier | 0.9 | `importance_tier: constitutional` -> meta-cognitive |
| 3 | File path pattern | 0.8 | `/scratch/` -> working |
| 4 | Keyword analysis | 0.7 | Title contains "how to" -> procedural |
| 5 | Default | 0.5 | Falls back to `declarative` |

### Tier to Type Mapping

| Importance Tier | Inferred Type | Rationale |
|-----------------|---------------|-----------|
| constitutional | meta-cognitive | Rules that never decay |
| critical | semantic | Core concepts, high persistence |
| important | declarative | Important facts |
| normal | declarative | Standard content |
| temporary | working | Session-scoped, fast decay |
| deprecated | episodic | Historical, kept for reference |

### Path Pattern Examples

| Pattern | Type | Example Paths |
|---------|------|---------------|
| `/scratch/`, `/temp/` | working | `specs/<###-spec-name>/scratch/debug.md` |
| `session-\d+`, `debug-log` | episodic | `memory/session-1.md` |
| `todo`, `next-steps` | prospective | `memory/next-steps.md` |
| `guide`, `checklist` | procedural | `docs/install-guide.md` |
| `architecture`, `adr-\d+` | semantic | `docs/adr-001.md` |
| `constitutional`, `claude.md` | meta-cognitive | `AGENTS.md`, `AGENTS.md` |

<!-- /ANCHOR:key-concepts -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
config/
├── memory-types.ts       # 9 memory types with half-lives and patterns (~9KB)
├── type-inference.ts     # Auto-detect type from path/content (~9KB)
└── README.md             # This file
```

**Note:** `index.js` exists only as compiled JS in `dist/lib/config/` (never migrated to TypeScript source). It provides barrel re-exports for both modules.

### Key Files

| File | Purpose |
|------|---------|
| `memory-types.ts` | Type definitions, half-lives, path/keyword patterns |
| `type-inference.ts` | Multi-source inference with confidence scoring |

<!-- /ANCHOR:structure -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

### Example 1: Get Type Configuration

```typescript
import { getTypeConfig, getHalfLife, isDecayEnabled } from './memory-types';

const config = getTypeConfig('procedural');
// Returns: { halfLifeDays: 90, autoExpireDays: 365, decayEnabled: true, description: '...' }

const halfLife = getHalfLife('working');
// Returns: 1

const decays = isDecayEnabled('meta-cognitive');
// Returns: false
```

### Example 2: Infer Memory Type

```typescript
import { inferMemoryType } from './type-inference';

// From file path
const result1 = inferMemoryType({
  filePath: 'specs/<###-spec-name>/scratch/debug.md',
});
// Returns: { type: 'working', source: 'file_path', confidence: 0.8 }

// From frontmatter
const result2 = inferMemoryType({
  content: '---\nmemory_type: semantic\n---\n# Architecture Overview',
});
// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }

// From keywords
const result3 = inferMemoryType({
  title: 'How to configure authentication',
  triggerPhrases: ['auth guide', 'setup steps'],
});
// Returns: { type: 'procedural', source: 'keywords', confidence: 0.7 }
```

### Example 3: Batch Inference

```typescript
import { inferMemoryTypesBatch } from './type-inference';

const memories = [
  { file_path: 'memory/session-1.md', title: 'Debug Session' },
  { file_path: 'docs/architecture.md', title: 'System Design' },
];

const results = inferMemoryTypesBatch(memories);
// Returns: Map { 'memory/session-1.md' => { type: 'episodic', ... }, ... }
```

### Example 4: Validate Inferred Type

```typescript
import { validateInferredType } from './type-inference';

const validation = validateInferredType('declarative', '/specs/scratch/temp.md');
// Returns: { valid: false, warnings: ['Temporary file has slow-decay type'] }
```

### halfLife=0 Edge Case

> **Warning:** `validateHalfLifeConfig()` in `memory-types.ts` checks `< 0` but not `=== 0`.
> A half-life of 0 days would pass validation but cause division-by-zero in FSRS decay
> calculations where stability (derived from half-life) is used as a denominator.
> The error message states "must be positive number or null" but zero is accepted.
> Callers should ensure halfLife values are strictly positive (> 0) or null.

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| List valid types | `getValidTypes()` | Validation, UI dropdowns |
| Check type valid | `isValidType('working')` | Input validation |
| Get default | `getDefaultType()` | Fallback assignment |
| Reset config | `getDefaultHalfLives()` | Config recovery |

<!-- /ANCHOR:usage -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../scoring/README.md](../scoring/README.md) | Composite scoring with tier and document-type integration |
| [../cognitive/README.md](../cognitive/README.md) | Attention decay using half-lives |
| [../../configs/search-weights.json](../../configs/search-weights.json) | Runtime weight configuration |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../../README.md](../../README.md) | MCP server overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.8.1 | Last updated: 2026-02-21*
