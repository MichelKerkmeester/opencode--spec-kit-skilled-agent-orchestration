---
title: "Config"
description: "Configuration files for Spec Kit's memory system, complexity detection, search and content filtering"
trigger_phrases:
  - "spec kit config"
  - "memory system configuration"
  - "config jsonc settings"
---

# Config

> Configuration files for Spec Kit's memory system, complexity detection, search and content filtering.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. CONFIGURATION OPTIONS](#2--configuration-options)
- [3. USAGE](#3--usage)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This directory contains the JSON configuration files that control how the Spec Kit system operates. All files use JSONC format (JSON with comments) for maintainability. These configs are loaded by various scripts throughout the system to determine behavior for memory indexing, search ranking, complexity scoring and content quality control.

| File                       | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `config.jsonc`             | Main configuration for memory, search, decay, tiers and templates   |
| `filters.jsonc`            | Content filtering pipeline for noise removal and quality scoring     |

<!-- /ANCHOR:overview -->

---

## 2. CONFIGURATION OPTIONS
<!-- ANCHOR:configuration -->

### config.jsonc

**Primary system configuration** controlling 11 major subsystems:

1. **Legacy Settings** - Basic limits for previews and message windows
2. **Semantic Search** - Voyage-4 embeddings, similarity thresholds (min: 50, max: 10 results)
3. **Memory Index** - SQLite database path, auto-rebuild, verification
4. **Trigger Surfacing** - Auto-surface relevant memories (min similarity: 70, max: 3 results)
5. **Memory Decay** - Time-based relevance decay (90-day scale, 0.3 weight, ~62 day half-life)
6. **Importance Tiers** - Six-tier system (constitutional to deprecated) with search boosts and expiration
7. **Hybrid Search** - RRF fusion of FTS + vector results (k=60)
8. **Context Type Detection** - Auto-classify context types (research, implementation, decision, discovery)
9. **Access Tracking** - Boost frequently accessed memories (0.1 per access, max 0.5)
10. **Checkpoints** - Save/restore memory states (max: 10, cleanup: 30 days)
11. **Templates** - Template configuration settings

**Key Settings:**
- `semanticSearch.enabled: true` - Enable vector similarity search
- `memoryDecay.enabled: true` - Apply time-based relevance decay
- `hybridSearch.enabled: true` - Combine FTS and vector search with RRF
- `templates.path: "templates"` - Path to spec templates

### complexity-config.jsonc (removed)

`complexity-config.jsonc` was deprecated and removed. Complexity scoring uses hardcoded defaults in the pipeline. Use `--level N` with `scripts/spec/create.sh` to select a documentation level directly.

### filters.jsonc

**Content filtering pipeline** with 3-stage quality control:

**1. Noise Filter:**
- Min content length: 15 characters
- Min unique words: 3
- Purpose: Remove empty or trivial content

**2. Deduplication:**
- Hash length: 300 characters
- Similarity threshold: 0.70
- Purpose: Prevent duplicate memory entries

**3. Quality Scoring:**
- Warn threshold: 20 points
- Factors: Uniqueness (30%), Density (30%), File refs (20%), Decisions (20%)
- Purpose: Flag low-quality content for review

<!-- /ANCHOR:configuration -->

---

## 3. USAGE
<!-- ANCHOR:usage -->

### Loading Configs

The main config is loaded by `scripts/core/config.ts`:

```typescript
import { loadConfig } from '../scripts/core/config';

const config = loadConfig();  // Loads config.jsonc (Section 1 keys only used at runtime)
```

The loader strips JSONC comments and parses JSON safely with fallback to defaults.

> **Note:** `loadComplexityConfig` and `loadFilterConfig` do not exist in `scripts/core/config.ts`.
> `complexity-config.jsonc` has been removed — complexity scoring uses hardcoded defaults.
> `filters.jsonc` is loaded directly by `scripts/lib/content-filter.ts`, not through the core config loader.

### Modifying Settings

1. **Edit the JSONC file** directly. Comments are preserved
2. **Reload required**: Most scripts load config on startup
3. **Validation**: Invalid JSON will fall back to defaults with warnings

### Common Adjustments

**Increase search result count:**
```jsonc
"semanticSearch": {
  "maxResults": 20  // Default: 10
}
```

**Adjust memory decay rate:**
```jsonc
"memoryDecay": {
  "scaleDays": 120,    // Slower decay (default: 90)
  "decayWeight": 0.2   // Less impact (default: 0.3)
}
```

**Disable content filtering:**
```jsonc
"pipeline": {
  "enabled": false    // Bypass all filters (default: true)
}
```

<!-- /ANCHOR:usage -->

---

## 4. RELATED DOCUMENTS
<!-- ANCHOR:related -->

| Document | Purpose |
|----------|---------|
| [Memory System](../references/memory/memory_system.md) | How configs affect memory behavior |
| [Trigger Config](../references/memory/trigger_config.md) | Automatic memory surfacing |
| [Template Guide](../references/templates/template_guide.md) | Template style differences |
| [Level Specifications](../references/templates/level_specifications.md) | Complexity level details |
| [Config Loader](../scripts/core/config.ts) | Implementation of config loading |
| [Content Filter](../scripts/lib/content-filter.ts) | Filter pipeline implementation |

<!-- /ANCHOR:related -->

---

*Part of the system-spec-kit conversation memory and context preservation system.*
