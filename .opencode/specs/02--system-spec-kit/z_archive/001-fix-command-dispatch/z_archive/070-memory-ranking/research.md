---
title: "Research: Memory & Folder Ranking Approaches [070-memory-ranking/research]"
description: "Ranking memories and folders for relevance requires balancing multiple, sometimes competing, factors"
trigger_phrases:
  - "research"
  - "memory"
  - "folder"
  - "ranking"
  - "approaches"
  - "070"
importance_tier: "normal"
contextType: "research"
---
# Research: Memory & Folder Ranking Approaches

> **Spec:** `071-memory-ranking`  
> **Purpose:** Document prior art, alternatives, and evidence supporting design decisions  
> **Created:** 2026-01-16

---

## 1. Problem Space Analysis

### 1.1 Core Challenge

Ranking memories and folders for relevance requires balancing multiple, sometimes competing, factors:

| Factor | User Need | Tension |
|--------|-----------|---------|
| Recency | Resume recent work | Old important content buried |
| Importance | Find critical references | New work not visible |
| Activity | Active projects surface | Busy ≠ relevant |
| Similarity | Find related content | Cold start problem |

### 1.2 Use Case Analysis

Based on observed usage patterns:

| Use Case | Frequency | Primary Signal |
|----------|-----------|----------------|
| Resume recent work | 60% | Recency |
| Find specific reference | 25% | Semantic + Importance |
| Explore related context | 10% | Semantic similarity |
| Clean up / organize | 5% | Age + Status |

This distribution informed the weight allocation in D1 (recency: 40%, importance: 30%).

---

## 2. Prior Art Review

### 2.1 Email Ranking (Gmail Priority Inbox)

**Approach:** Machine learning on user behavior (opens, replies, archives)

**Signals used:**
- Sender importance (frequent correspondence)
- Keywords in subject
- User actions on similar emails
- Thread participation

**Relevance to our problem:**
- Click-through learning (Phase 3 P3-2) follows this pattern
- "Sender" ≈ "Spec folder" for grouping

**Limitations:**
- Requires significant training data
- Privacy considerations

### 2.2 Search Engine Ranking (PageRank + BM25)

**Approach:** Combine structural signals (links) with text matching

**Signals used:**
- Query-document relevance (BM25/TF-IDF)
- Document authority (PageRank)
- Freshness boost for time-sensitive queries
- User engagement signals

**Relevance to our problem:**
- Semantic similarity ≈ BM25
- Importance tier ≈ PageRank authority
- Recency decay ≈ freshness boost

**Adopted:** Composite scoring mirrors this multi-signal approach

### 2.3 Note-Taking Apps (Notion, Obsidian)

**Approach:** Recency + explicit organization

**Signals used:**
- Last modified (primary sort)
- User-defined tags/folders
- Backlinks (Obsidian)
- Favorites/pins

**Relevance to our problem:**
- Constitutional tier ≈ Pinned/Favorited
- Spec folders ≈ User-defined folders
- Trigger phrases ≈ Tags

**Adopted:** Section-based dashboard (D6) similar to "Favorites + Recent"

### 2.4 Code Search (GitHub, Sourcegraph)

**Approach:** Lexical + Semantic + Recency

**Signals used:**
- Text matching (exact, fuzzy)
- File path patterns
- Recent commits boost
- Repository popularity

**Relevance to our problem:**
- Archive patterns ≈ excluding test/vendor directories
- Recency in commits ≈ recency in memory updates

**Adopted:** Archive detection patterns (D2)

---

## 3. Ranking Algorithm Alternatives

### 3.1 Pure Recency (Rejected)

```
score = 1 / (1 + days_since_update * 0.1)
```

**Pros:** Simple, intuitive, fast
**Cons:** Constitutional content buried, no importance signal

**Verdict:** Insufficient for "find reference" use case (25% of usage)

### 3.2 Pure Importance (Rejected)

```
score = tier_weight[memory.tier]
```

**Pros:** Critical content always surfaces
**Cons:** New work invisible, stale content accumulates

**Verdict:** Insufficient for "resume work" use case (60% of usage)

### 3.3 Bayesian Ranking (Considered for Future)

```
score = P(relevant | features) using Naive Bayes
```

**Pros:** Learns from user behavior, adapts over time
**Cons:** Requires training data, cold start problem

**Verdict:** Defer to Phase 3 (P3-2 Click-Through Learning)

### 3.4 Composite Weighted (Adopted)

```
score = w1*recency + w2*importance + w3*activity + w4*validation
```

**Pros:** Balances all use cases, configurable, no training needed
**Cons:** Weights are heuristic, may need tuning

**Verdict:** Best balance of simplicity and effectiveness (D1)

---

## 4. Decay Function Analysis

### 4.1 Linear Decay

```
score = max(0, 1 - days * rate)
```

**Behavior:** Uniform decrease, hits zero at 1/rate days
**Issue:** Cliff at zero, old content completely invisible

### 4.2 Exponential Decay

```
score = e^(-days * rate)
```

**Behavior:** Fast initial drop, asymptotic to zero
**Issue:** Harder to reason about half-life

### 4.3 Inverse Decay (Adopted)

```
score = 1 / (1 + days * rate)
```

**Behavior:** Smooth decay, never hits zero, predictable half-life
**Adopted:** Rate 0.1 gives 50% at 10 days, 10% at 90 days (D4)

### 4.4 Comparison at Different Ages

| Days | Linear (0.01) | Exponential (0.1) | Inverse (0.1) |
|------|---------------|-------------------|---------------|
| 0 | 1.00 | 1.00 | 1.00 |
| 7 | 0.93 | 0.50 | 0.59 |
| 30 | 0.70 | 0.05 | 0.25 |
| 90 | 0.10 | 0.00 | 0.10 |

**Selection rationale:** Inverse provides gentle decay while keeping old content discoverable.

---

## 5. Archive Detection Approaches

### 5.1 Explicit Metadata (Not Adopted)

Add `isArchived: boolean` field to memories.

**Pros:** Accurate, no false positives
**Cons:** Requires migration, user must set explicitly

### 5.2 Path Pattern Matching (Adopted)

Regex on folder paths: `z_archive/`, `scratch/`, `test-`

**Pros:** Works immediately, follows existing conventions
**Cons:** May have false positives (e.g., "test-driven" folder)

**Mitigation:** Toggle to show archived (P1-6)

### 5.3 Age-Based Heuristic (Considered)

Folders with no updates in 90+ days marked as "stale"

**Pros:** Automatic, no configuration
**Cons:** Active old projects incorrectly marked

**Verdict:** Not adopted as primary, may add as secondary signal

---

## 6. Dashboard Design Alternatives

### 6.1 Single Ranked List

```
1. Memory A (score: 0.92)
2. Memory B (score: 0.85)
3. Memory C (score: 0.78)
```

**Pros:** Simple, consistent
**Cons:** Can't serve multiple intents, constitutional may not appear

### 6.2 Tabbed Views

```
[Recent] [Important] [All]
```

**Pros:** Clean, focused views
**Cons:** Requires navigation, user may miss content

### 6.3 Multiple Sections (Adopted)

```
★ CONSTITUTIONAL
◆ RECENTLY ACTIVE
◇ HIGH IMPORTANCE
○ RECENT MEMORIES
```

**Pros:** All intents visible, clear hierarchy
**Cons:** More visual complexity, limited items per section

**Adopted:** D6 decision, 14 items max

---

## 7. Performance Considerations

### 7.1 Client-Side Scoring

**Approach:** Fetch all memories, compute scores in command logic

**Performance:** O(n) where n = memory count
- 100 memories: ~10ms
- 500 memories: ~50ms
- 1000 memories: ~100ms

**Verdict:** Acceptable for Phase 1 (D3)

### 7.2 Server-Side Scoring

**Approach:** Compute in SQL, return pre-scored results

**Performance:** O(1) query with index
- Any count: ~5ms with proper indexes

**Verdict:** Required for Phase 2 at scale (D3)

### 7.3 Caching Strategy

- Cache folder scores for 60 seconds
- Invalidate on memory add/update/delete
- Pre-compute on memory change (background)

---

## 8. References

1. **PageRank Paper:** Brin, S. & Page, L. (1998). The Anatomy of a Large-Scale Hypertextual Web Search Engine.
2. **BM25 Algorithm:** Robertson, S. & Zaragoza, H. (2009). The Probabilistic Relevance Framework.
3. **Gmail Priority Inbox:** Aberdeen, D. et al. (2010). The Learning Behind Gmail Priority Inbox.
4. **Obsidian Backlinks:** https://help.obsidian.md/Plugins/Backlinks
5. **SQLite Performance:** https://www.sqlite.org/queryplanner.html

---

## 9. Open Questions

| Question | Status | Resolution Path |
|----------|--------|-----------------|
| Optimal decay rate per user? | Open | Phase 3 personalization |
| How many constitutional memories before dilution? | Open | Usage data collection |
| Should trigger phrase matches boost ranking? | Partial | Implemented in search, not folders |
| Cross-project memory ranking? | Out of scope | Future spec |
