---
title: "Learning"
description: "Correction tracking that updates stability signals across memory and spec-document entries."
trigger_phrases:
  - "learning corrections"
  - "memory stability"
  - "correction tracking"
---

# Learning

> Correction tracking that updates stability signals across memory and spec-document entries.

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

The learning module tracks corrections over time and applies stability adjustments that help the system learn which entries are most reliable. This applies to both standard memory notes and indexed spec documents, improving ranking quality for spec and decision retrieval.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Self-improving** | System learns from corrections over time |
| **Traceable** | Full correction history with undo capability |
| **Confidence signals** | Stability scores reflect memory reliability |
| **Atomic operations** | Database transactions ensure consistency |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

> **Note**: Source files remain locally and are also available in `@spec-kit/shared`.

```
learning/
├── corrections.ts   # Memory correction tracking with stability adjustments
├── index.ts         # Module barrel exports
└── README.md        # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `corrections.ts` | Correction types, stability adjustments, history tracking |
| `index.ts` | Unified export of all learning functionality |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Correction Types

| Type | Code | Description |
|------|------|-------------|
| **Superseded** | `superseded` | Old memory replaced by new, more accurate one |
| **Deprecated** | `deprecated` | Memory marked as outdated but preserved |
| **Refined** | `refined` | Memory content improved or clarified |
| **Merged** | `merged` | Multiple memories consolidated into one |

### Stability Adjustments

| Event | Multiplier | Effect |
|-------|------------|--------|
| Memory corrected | 0.5x | Original loses 50% stability |
| Memory replaces | 1.2x | Replacement gains 20% stability |

### Core Functions

| Function | Purpose |
|----------|---------|
| `record_correction(params)` | Record a correction with stability updates |
| `undo_correction(id)` | Reverse a correction, restore stability |
| `get_corrections_for_memory(id)` | Get correction history for a memory |
| `get_correction_chain(id)` | Traverse full correction graph |
| `get_corrections_stats()` | Aggregate statistics |

### Convenience Functions

| Function | Purpose |
|----------|---------|
| `deprecate_memory(id, reason)` | Mark memory as deprecated |
| `supersede_memory(old_id, new_id, reason)` | Replace with newer version |
| `refine_memory(original_id, refined_id, reason)` | Link to improved version |
| `merge_memories(source_ids, merged_id, reason)` | Consolidate multiple memories |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Recording a Correction

```typescript
import { corrections } from './index';

// Initialize with database
corrections.init(db);

// Record that memory 5 supersedes memory 3
const result = corrections.record_correction({
  original_memory_id: 3,
  correction_memory_id: 5,
  correction_type: 'superseded',
  reason: 'Updated with latest API changes',
  corrected_by: 'user'
});

console.log(result.stability_changes);
// {
//   original: { before: 1.0, after: 0.5, penalty_applied: 0.5 },
//   correction: { before: 1.0, after: 1.2, boost_applied: 1.2 }
// }
```

### Deprecating a Memory

```typescript
import { deprecate_memory } from './index';

// Mark memory as outdated (no replacement)
const result = deprecate_memory(42, 'Outdated API documentation');
// Original stability reduced by 50%
```

### Merging Multiple Memories

```typescript
import { merge_memories } from './index';

// Consolidate 3 memories into 1
const results = merge_memories(
  [10, 11, 12],  // Source memory IDs
  15,            // Merged target ID
  'Consolidated duplicate context entries'
);
// Each source gets 0.5x penalty, target gets 1.2x boost
```

### Undoing a Correction

```typescript
import { undo_correction } from './index';

// Reverse correction #7
const result = undo_correction(7);

console.log(result.stability_restored);
// { original: 1.0, correction: 1.0 }
```

### Querying Correction History

```typescript
import { get_corrections_for_memory, get_corrections_stats } from './index';

// Get all corrections involving memory 5
const history = get_corrections_for_memory(5, { include_undone: false });

// Get aggregate stats
const stats = get_corrections_stats();
// { total: 42, by_type: { superseded: 30, deprecated: 8, ... }, undone: 3 }
```

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../cognitive/](../cognitive/) | Stability and decay algorithms |
| [../storage/](../storage/) | Memory index persistence |

### Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `SPECKIT_RELATIONS` | `true` | Enable/disable correction tracking |

### Database Schema

The module creates a `memory_corrections` table with:
- Correction type and timestamps
- Before/after stability values (for undo)
- Foreign keys to `memory_index`
- Indexes for efficient queries

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-02-16
