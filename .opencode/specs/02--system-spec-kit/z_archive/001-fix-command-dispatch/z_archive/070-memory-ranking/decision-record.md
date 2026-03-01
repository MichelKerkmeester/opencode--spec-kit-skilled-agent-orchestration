---
title: "Decision Record: Memory & Folder Ranking [070-memory-ranking/decision-record]"
description: "Date: 2026-01-16"
trigger_phrases:
  - "decision"
  - "record"
  - "memory"
  - "folder"
  - "ranking"
  - "decision record"
  - "070"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Memory & Folder Ranking

> **Spec:** `071-memory-ranking`  
> **Status:** Active  
> **Last Updated:** 2026-01-16

---

## D1: Composite Ranking Formula

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** Architecture Review

### Context

The current folder ranking uses a single factor (memory count), which produces poor results. We need a multi-factor approach that balances several considerations.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Count-only | Current approach | Simple, fast | Poor relevance |
| B. Recency-only | Sort by most recent update | Good for "resume work" | Ignores importance |
| C. Importance-only | Sort by tier | Good for references | Ignores recency |
| D. Composite (weighted) | Combine multiple factors | Balances all needs | More complex |

### Decision

**Option D: Composite weighted scoring**

Formula:
```
score = (recency × 0.40) + (importance × 0.30) + (activity × 0.20) + (validation × 0.10)
```

### Rationale

1. **Recency (40%):** Primary use case is resuming recent work
2. **Importance (30%):** Critical/constitutional content should surface
3. **Activity (20%):** Active folders (more memories) indicate relevance
4. **Validation (10%):** User feedback should influence rankings

### Consequences

- More computation required (but acceptable at <100ms)
- Weights are configurable (Phase 3)
- Users may initially be surprised by changed rankings

---

## D2: Archive Detection Patterns

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** Implementation Team

### Context

Need to identify archived, scratch, and test folders to exclude from default rankings.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Metadata flag | Explicit `isArchived` field | Accurate | Requires migration |
| B. Path patterns | Regex on folder path | Works immediately | May have false positives |
| C. User configuration | User defines patterns | Flexible | Burden on user |

### Decision

**Option B: Path patterns** with the following regexes:

```javascript
const ARCHIVE_PATTERNS = [
  /z_archive\//,   // Standard archive folder
  /\/scratch\//,   // Temporary work
  /\/test-/,       // Test prefixed subfolders
  /-test\//,       // Test suffixed folders
];
```

### Multipliers

| Pattern | Multiplier | Reasoning |
|---------|------------|-----------|
| `z_archive/` | 0.1 | Intentionally archived |
| `scratch/` | 0.2 | Temporary, may still be relevant |
| `test-` | 0.2 | Test content, low priority |

### Rationale

- Path patterns are convention in this codebase
- No migration needed
- Easy to extend patterns

### Consequences

- False positives possible (e.g., legitimate "test-driven" folder)
- Future: Add metadata flag for explicit control

---

## D3: Client-Side vs Server-Side Ranking

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** Architecture Review

### Context

Where should the ranking computation happen?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Client-side only | Compute in command logic | No MCP changes, fast iteration | Fetches more data, slower at scale |
| B. Server-side only | Compute in MCP | Performance, caching | Requires MCP release |
| C. Hybrid | Client for Phase 1, migrate to server | Best of both | More work total |

### Decision

**Option C: Hybrid approach**

- **Phase 1:** Client-side computation (no MCP dependency)
- **Phase 2:** Server-side with new API parameters
- **Fallback:** Client-side if server features unavailable

### Rationale

- Allows immediate improvement (Phase 1)
- Server-side provides better performance at scale
- Backward compatibility maintained

### Consequences

- Duplicate logic (client + server) temporarily
- Need feature detection for API capabilities

---

## D4: Decay Rate Selection

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** UX Analysis

### Context

What decay rate should be used for recency scoring?

### Formula

```
recency_score = 1 / (1 + days_since_update × decay_rate)
```

Note: "Half-life" here means ~50% score retention, which occurs at `days = 1/rate`.

### Options Considered

| Rate | 50% Point | 7-day Score | Description |
|------|-----------|-------------|-------------|
| 0.05 | 20 days | 0.74 | Slow decay, older content stays relevant |
| 0.10 | 10 days | 0.59 | Moderate decay, weekly work focus |
| 0.14 | 7 days | 0.50 | True 7-day half-life |
| 0.20 | 5 days | 0.42 | Fast decay, strong recency preference |

### Decision

**Decay rate: 0.10** (50% score at 10 days, 59% at 7 days)

Score examples:
- Today: 1.00
- 1 day: 0.91
- 3 days: 0.77
- 7 days: 0.59
- 14 days: 0.42
- 30 days: 0.25
- 90 days: 0.10

### Rationale

- Balances "resume recent work" with "find older references"
- Weekly cadence matches typical development sprints
- Configurable in Phase 3 for user preference

### Consequences

- 30+ day old memories significantly deprioritized
- Constitutional tier exemption needed (no decay for rules)

---

## D5: Backward Compatibility Approach

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** API Review

### Context

How do we maintain backward compatibility when changing ranking behavior?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Breaking change | New behavior is default | Clean, no legacy | Existing tools break |
| B. Opt-in new behavior | New params required | Safe rollout | Adoption friction |
| C. Opt-out old behavior | New default, param to revert | Best of both | Slightly complex |

### Decision

**Option C: Opt-out approach**

- New ranking is default (improved UX)
- `folderRanking: 'count'` restores old behavior
- All existing API calls work (params optional)

### Migration Path

1. **Phase 1:** Client-side changes only, no API breaking
2. **Phase 2:** New optional params, old behavior available
3. **Phase 3:** Deprecation warnings for `'count'` ranking

### Rationale

- Most users benefit from improvement immediately
- Power users can revert if needed
- Gradual deprecation of old behavior

### Consequences

- Must document behavior change in release notes
- Test both old and new behavior paths

---

## D6: Dashboard Section Design

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** UX Review

### Context

How should the dashboard organize and display ranked content?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. Single list | All folders in one ranked list | Simple | Can't serve multiple intents |
| B. Tabbed views | Switch between recency/importance/etc | Clean | Hides other views |
| C. Multiple sections | Show different views simultaneously | All intents visible | More visual complexity |

### Decision

**Option C: Multiple sections**

```
★ CONSTITUTIONAL (always active)       [3 max]
◆ RECENTLY ACTIVE FOLDERS              [3 max]
◇ HIGH IMPORTANCE CONTENT              [3 max]
○ RECENT MEMORIES                      [5 max]
```

### Section Rules

| Section | Source | Sort | Limit |
|---------|--------|------|-------|
| Constitutional | Tier filter | Importance | 3 |
| Recently Active | Composite score | Score DESC | 3 |
| High Importance | Critical/important tier | Tier + recency | 3 |
| Recent Memories | All memories | updatedAt DESC | 5 |

### Rationale

- Serves multiple user intents simultaneously
- Constitutional always visible (guardrails)
- Clear visual hierarchy with symbols
- 14 items max prevents overwhelming

### Consequences

- Hidden sections when empty (no visual noise)
- Users can navigate to specific section via actions

---

## D7: Importance Tier Weights

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** Domain Analysis

### Context

How should importance tiers contribute to the ranking score?

### Options Considered

| Approach | Constitutional | Critical | Important | Normal | Temporary | Deprecated |
|----------|---------------|----------|-----------|--------|-----------|------------|
| Linear | 1.0 | 0.8 | 0.6 | 0.4 | 0.2 | 0.0 |
| Exponential | 1.0 | 0.5 | 0.25 | 0.125 | 0.06 | 0.0 |
| Binary-ish | 1.0 | 1.0 | 0.5 | 0.3 | 0.1 | 0.0 |

### Decision

**Linear scaling:**

| Tier | Weight | Reasoning |
|------|--------|-----------|
| constitutional | 1.0 | Always maximum |
| critical | 0.8 | High priority |
| important | 0.6 | Notable |
| normal | 0.4 | Default level |
| temporary | 0.2 | Low priority, expected to age out |
| deprecated | 0.0 | Should not surface |

### Rationale

- Linear is intuitive and predictable
- Each tier step is meaningful (0.2 difference)
- Deprecated = 0 ensures cleanup incentive

### Consequences

- Constitutional memories dominate rankings (by design)
- Need explicit tier assignment during memory creation
- Temporary tier provides low-commitment option

---

## Decision Log

| ID | Decision | Date | Status |
|----|----------|------|--------|
| D1 | Composite ranking formula | 2026-01-16 | Decided |
| D2 | Archive detection patterns | 2026-01-16 | Decided |
| D3 | Client-side vs server-side | 2026-01-16 | Decided |
| D4 | Decay rate selection | 2026-01-16 | Decided |
| D5 | Backward compatibility | 2026-01-16 | Decided |
| D6 | Dashboard section design | 2026-01-16 | Decided |
| D7 | Importance tier weights | 2026-01-16 | Decided |
| D8 | Constitutional decay exemption | 2026-01-16 | Decided |

---

## D8: Constitutional Decay Exemption

**Date:** 2026-01-16  
**Status:** Decided  
**Decision Maker:** Domain Analysis

### Context

Constitutional tier memories contain critical rules and guardrails that must always surface, regardless of age. Applying recency decay would gradually deprioritize these essential memories.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A. No exemption | Apply decay to all tiers | Consistent formula | Rules fade over time |
| B. Reduced decay | Use lower decay rate for constitutional | Some recency signal | Still fades eventually |
| C. Full exemption | Constitutional always scores 1.0 for recency | Rules always surface | No recency signal |
| D. Separate section | Constitutional in own section, no scoring | Clear separation | Doesn't help in search |

### Decision

**Option C + D: Full exemption AND separate section**

- Constitutional memories always have `recencyScore = 1.0` in ranking calculations
- Dashboard displays constitutional memories in dedicated top section (D6)
- Search results include constitutional at top regardless of query (existing behavior)

### Implementation

```javascript
function computeRecencyScore(updatedAt, tier, decayRate = 0.1) {
  // Constitutional tier: no decay
  if (tier === 'constitutional') {
    return 1.0;
  }
  
  const daysSince = (Date.now() - new Date(updatedAt)) / (1000 * 60 * 60 * 24);
  return 1 / (1 + daysSince * decayRate);
}
```

### Rationale

- Constitutional content represents project guardrails and rules
- Age is irrelevant for rules (a 1-year-old rule is as valid as a 1-day-old rule)
- Separate section provides guaranteed visibility
- Full exemption ensures highest possible ranking in search

### Consequences

- Constitutional tier is "privileged" - use sparingly
- Users must be intentional about promoting to constitutional
- Maximum ~5 constitutional memories recommended to avoid dilution

---

## Pending Decisions

| Topic | Blocker | Expected Resolution |
|-------|---------|---------------------|
| Personalized weights storage | Phase 3 scope | After Phase 2 validation |
| A/B testing infrastructure | Phase 3 scope | After usage data available |
| Cross-project ranking | Out of scope | Future spec |
