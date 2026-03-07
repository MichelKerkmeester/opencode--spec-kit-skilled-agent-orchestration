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
| `complexity-config.jsonc`  | **DEPRECATED**: Complexity detection weights/thresholds (not read by any runtime code, retained for reference) |
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

### complexity-config.jsonc (DEPRECATED)

> **DEPRECATED:** This file is not read by any runtime code. Retained for reference only. Use `--level N` with `scripts/spec/create.sh` to select a level directly. See the deprecation header in the file itself and [level_selection_guide.md](../references/templates/level_selection_guide.md) for current guidance.

**Complexity scoring algorithm** with 5-dimensional analysis:

**Dimensions** (weights sum to 100):
- **Scope** (25%) - Files affected, LOC estimate, systems touched
- **Risk** (25%) - Security, auth, breaking changes
- **Research** (20%) - Investigation needs, unknowns, external dependencies
- **Multi-Agent** (15%) - Parallel workstreams, coordination needs
- **Coordination** (15%) - Cross-system dependencies, blocking relationships

**Level Thresholds:**
- **Level 1 (Baseline)**: 0-25 points
- **Level 2 (Verification)**: 26-55 points
- **Level 3 (Full)**: 56-79 points
- **Level 3+ (Extended)**: 80-100 points

**Keyword Matching:**
- High-risk keywords (auth, security, encryption): 15 points each
- Medium-risk keywords (api, database, config): 8 points each
- Investigation keywords (research, analyze, explore): 12 points each
- Uncertainty keywords (unknown, unclear, tbd): 15 points each

**Feature Scaling:**
- User stories: 1-2 (Level 1) to 8-15 (Level 3+)
- Phases: 2-3 (Level 1) to 8-12 (Level 3+)
- Tasks: 5-15 (Level 1) to 100-200 (Level 3+)
- Checklist items: 10-20 (Level 1) to 100-150 (Level 3+)

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
> `complexity-config.jsonc` is not read by any runtime code (see deprecation notice in that file).
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

**Change complexity level thresholds:**
```jsonc
"levels": {
  "level1Max": 30,    // Wider Level 1 range (default: 25)
  "level2Max": 60     // Adjust Level 2 ceiling (default: 55)
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
