# Template Contributions

> **Purpose:** This document captures novel documentation patterns introduced in 082-speckit-reimagined that could be contributed back to the system-spec-kit templates.

## Overview

During the development of this spec folder, several patterns emerged that improve task tracking, verification, and cross-referencing. These patterns are proposed for inclusion in the standard SpecKit templates.

---

## Pattern 1: Workstream Prefixes [W:PREFIX]

### Description
Tag tasks with workstream identifiers to enable filtering and grouping of related work.

### Format
```
[W:XXXX] where XXXX is a 4-6 character uppercase identifier
```

### Examples from This Spec
| Prefix | Workstream | Tasks |
|--------|------------|-------|
| `[W:DEDUP]` | Session Deduplication | T001-T005 |
| `[W:TYPE]` | Memory Type Hierarchy | T006-T010 |
| `[W:RECOV]` | Recovery Hints | T011-T015 |
| `[W:CACHE]` | Caching Layer | T016-T019 |
| `[W:DECAY]` | Multi-Factor Decay | T020-T029 |
| `[W:GRAPH]` | Causal Memory Graph | T050-T069 |

### Benefits
- Enables workstream-level progress tracking
- Supports parallel execution by different agents
- Facilitates dependency mapping between workstreams

### Proposed Template Addition
Add to `tasks.md` template:
```markdown
## Workstream Index
| Prefix | Name | Tasks | Owner | Status |
|--------|------|-------|-------|--------|
```

---

## Pattern 2: Block-Task References [B:T###]

### Description
Link implementation blocks to their originating task IDs for traceability.

### Format
```
[B:T###] where ### is the task number (e.g., T001, T042)
```

### Usage
In code comments or implementation notes:
```javascript
// [B:T042] Implement causal edge creation
function createCausalEdge(parent, child) { ... }
```

In documentation:
```markdown
The deduplication algorithm [B:T003] uses semantic hashing...
```

### Benefits
- Traces code back to requirements
- Enables impact analysis when tasks change
- Supports automated coverage verification

### Proposed Template Addition
Add to `implementation-summary.md` template:
```markdown
## Task-to-Implementation Mapping
| Task ID | Implementation Location | Status |
|---------|------------------------|--------|
```

---

## Pattern 3: Five Checks Integration

### Description
Apply the Five Checks Framework (from AGENTS.md) at key decision points within spec documentation.

### The Five Checks
1. **Necessary?** - Solving ACTUAL need NOW?
2. **Beyond Local Maxima?** - Explored alternatives?
3. **Sufficient?** - Simplest approach?
4. **Fits Goal?** - On critical path?
5. **Open Horizons?** - Long-term aligned?

### Integration Points
- `decision-record.md`: Each ADR should reference which checks were applied
- `plan.md`: Major phase decisions should pass Five Checks
- `tasks.md`: P0 task additions should pass checks 1 and 4

### Example from This Spec
```markdown
### ADR-007: Causal Graph vs Simple Linking

**Five Checks Applied:**
1. ✅ Necessary - Decision lineage required for debugging
2. ✅ Beyond Local Maxima - Considered: flat links, tags, full graph
3. ✅ Sufficient - DAG structure is minimal viable
4. ✅ Fits Goal - Core to memory system goals
5. ⚠️ Open Horizons - May need schema migration path

**Decision:** Proceed with DAG structure, add migration notes
```

### Proposed Template Addition
Add Five Checks section to `decision-record.md` ADR template.

---

## Pattern 4: Evidence Log with Verification Audit Trail

### Description
Structured evidence collection for checklist item verification.

### Format
Evidence references in checklist items:
```markdown
- [x] CHK-001: Component works [E:screenshot.png] [E:test.log]
```

Evidence types:
| Code | Type | Example |
|------|------|---------|
| `[E:filename]` | File in scratch/evidence/ | `[E:api-response.json]` |
| `[E:commit:hash]` | Git commit | `[E:commit:abc1234]` |
| `[E:review:date]` | Human review | `[E:review:2026-02-01]` |
| `[E:automated]` | Passed automation | `[E:automated]` |

### Evidence Log Table
```markdown
| Item ID | Evidence Type | Reference | Verified By | Date |
|---------|---------------|-----------|-------------|------|
| CHK-001 | screenshot | api-test.png | agent | 2026-02-01 |
```

### Benefits
- Auditable verification trail
- Supports async verification by different agents
- Enables verification coverage metrics

### Proposed Template Addition
Add Evidence Log section to `checklist.md` template (already implemented in this spec as REF-006).

---

## Adoption Recommendation

| Pattern | Priority | Complexity | Recommendation |
|---------|----------|------------|----------------|
| Workstream Prefixes | High | Low | Add to tasks.md template |
| Block-Task References | Medium | Low | Add to implementation-summary.md |
| Five Checks Integration | High | Medium | Add to decision-record.md |
| Evidence Log | High | Low | Add to checklist.md template |

### Next Steps
1. Review patterns with system-spec-kit maintainers
2. Create PRs to update template files
3. Document in skill reference materials
4. Add to skill triggers for automatic pattern suggestion

---

*Generated: 2026-02-01*
*Source: 082-speckit-reimagined documentation analysis*
