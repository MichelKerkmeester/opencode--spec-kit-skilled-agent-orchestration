# Consolidated decision-record: Post-Review Remediation Epic

Consolidated on 2026-03-05 from the following source folders:

- 026-opus-remediation/decision-record.md

---

## Source: 026-opus-remediation/decision-record.md

---
title: "Decision Record: Refinement Phase 6 — Opus Review Remediation"
description: "Architecture decisions for legacy removal, score normalization, and stemmer improvements."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "refinement phase 6 decisions"
  - "legacy removal decision"
  - "resolveEffectiveScore decision"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove Legacy V1 Pipeline Entirely

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-02 |
| **Deciders** | Development team |

---

<!-- ANCHOR:adr-001-context -->
### Context

The V2 pipeline has been the default since `SPECKIT_PIPELINE_V2=true` became the standard configuration. The legacy V1 pipeline (~600 LOC) contains 3 of 4 P0 critical bugs: an inverted `STATE_PRIORITY` map, a different scoring order in `postSearchPipeline()`, and a mismatched `MAX_DEEP_QUERY_VARIANTS=6` vs V2's value. Fixing these bugs in dead code makes no sense.

### Constraints

- Cannot break any of the 7,081+ existing tests
- Must verify no test explicitly depends on `SPECKIT_PIPELINE_V2=false`
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Delete all legacy V1 pipeline code rather than fix bugs in it.

**How it works**: Remove all functions only called from the legacy path (`buildDeepQueryVariants`, `strengthenOnAccess`, `applyTestingEffect`, `filterByMemoryState`, `applySessionDedup`, `applyCrossEncoderReranking`, `applyIntentWeightsToResults`, `shouldApplyPostSearchIntentWeighting`, `postSearchPipeline`). Remove the `if (isPipelineV2Enabled())` branch. Mark `isPipelineV2Enabled()` as always-true with a deprecation comment.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete legacy code** | Removes 3 P0 bugs, -600 LOC, simpler codebase | One-way change | 9/10 |
| Fix bugs in legacy path | Keeps V1 as fallback | Maintains dead code, doubles maintenance surface | 3/10 |
| Feature flag legacy removal | Gradual rollout | Over-engineering for already-disabled code | 4/10 |

**Why this one**: The legacy path was already disabled by default. Fixing bugs in disabled code is wasted effort. Removing it is the simplest path that resolves 3 P0 issues simultaneously.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- 3 P0 bugs resolved with zero new code
- ~600 LOC removed from the codebase
- No more dual-path scoring ambiguity

**What it costs**:
- `SPECKIT_PIPELINE_V2=false` becomes a no-op. Mitigation: Mark the function as deprecated with a comment explaining this.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden test dependency on V1 path | H | Grep all test files for PIPELINE_V2=false before removal |
| User explicitly set V2=false in config | L | Function still exists but always returns true; log deprecation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 3 P0 bugs exist only in this dead code |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives (fix in place, feature flag) considered and rejected |
| 3 | **Sufficient?** | PASS | Complete removal is the simplest approach |
| 4 | **Fits Goal?** | PASS | Directly on the critical path for P0 resolution |
| 5 | **Open Horizons?** | PASS | Simpler codebase enables future improvements |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `handlers/memory-search.ts`: ~600 lines removed (legacy functions + branch)
- `lib/search/search-flags.ts`: `isPipelineV2Enabled()` returns true always

**How to roll back**: `git revert` the Sprint 1 commit. The legacy code is restored intact.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Shared resolveEffectiveScore() Function

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-02 |
| **Deciders** | Development team |

---

### Context

Stage 2's `resolveBaseScore()` and Stage 3's `effectiveScore()` compute the same conceptual score (the "best available score" for a pipeline row) but use different logic. Spec 015 fixed Stage 3 to use the correct fallback chain (`intentAdjustedScore → rrfScore → score → similarity/100`) with [0,1] clamping. Stage 2 still checks `score → rrfScore → similarity` without clamping and without checking `intentAdjustedScore`.

### Constraints

- Must not change Stage 3's already-correct `effectiveScore()` behavior
- Must update all 9+ call sites of `resolveBaseScore()` in Stage 2
- Must be placed in `pipeline/types.ts` for shared access

---

### Decision

**We chose**: Create `resolveEffectiveScore(row: PipelineRow): number` in `pipeline/types.ts` using Stage 3's corrected pattern. Replace Stage 2's `resolveBaseScore()` and Stage 3's `effectiveScore()` with calls to this shared function.

**How it works**: The function checks `intentAdjustedScore → rrfScore → score → similarity/100` with `isFinite()` guards and [0,1] clamping at each step. Both stages import and call this single function.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared function in types.ts** | Single source of truth, both stages consistent | 9+ call sites to update | 9/10 |
| Fix resolveBaseScore in place | Fewer changes | Still two separate implementations of same logic | 5/10 |
| Leave as-is | Zero changes | Stage 2/3 inconsistency persists | 2/10 |

**Why this one**: A shared function eliminates the class of bug where two implementations drift. The one-time cost of updating call sites prevents future divergence.

---

### Consequences

**What improves**:
- Consistent scoring across all pipeline stages
- Single function to maintain for score resolution

**What it costs**:
- 9+ call sites in Stage 2 need updating. Mitigation: Each is a direct replacement with same semantics.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Stage 2/3 inconsistency is a documented bug (#11) |
| 2 | **Beyond Local Maxima?** | PASS | In-place fix considered but rejected for drift risk |
| 3 | **Sufficient?** | PASS | Shared function is the minimal deduplication needed |
| 4 | **Fits Goal?** | PASS | Directly resolves finding #11 |
| 5 | **Open Horizons?** | PASS | Future stages can import the same function |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `pipeline/types.ts`: New `resolveEffectiveScore()` function exported
- `pipeline/stage2-fusion.ts`: All `resolveBaseScore()` calls replaced; function deleted
- `pipeline/stage3-rerank.ts`: Local `effectiveScore()` replaced with import

**How to roll back**: `git revert` the Sprint 2 commit.

---

### Scope Exclusions

Two independent `resolveBaseScore()` implementations exist **outside** the Stage 1–4 pipeline scope of this ADR:

| Module | Location | Purpose |
|--------|----------|---------|
| `session-boost.ts` | `lib/search/session-boost.ts:112` | Resolves base score for session-boost calculations (post-pipeline boost applied to final results) |
| `causal-boost.ts` | `lib/search/causal-boost.ts:70` | Resolves base score for causal-boost calculations (post-pipeline boost using causal graph edges) |

**Why excluded:** These modules operate **after** the pipeline completes, applying multiplicative boosts to already-scored results. Their `resolveBaseScore()` functions serve a different purpose than the pipeline's `resolveEffectiveScore()` — they resolve a baseline for boost ratio calculation, not for inter-stage score propagation. Unifying them would couple post-pipeline boost logic to pipeline internals with no correctness benefit.

**Note:** Stage 2's `resolveBaseScore` in `stage2-fusion.ts:152` is already an alias for `resolveEffectiveScore` per this ADR.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Stemmer Double-Consonant Handling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-02 |
| **Deciders** | Development team |

---

### Context

`simpleStem()` in `bm25-index.ts` strips `-ing` and `-ed` suffixes but does not handle doubled consonants. "running" becomes "runn" instead of "run". "stopped" becomes "stopp" instead of "stop". This creates asymmetric stems where the base form and inflected form don't match in the BM25 index.

### Constraints

- Must not break existing BM25 index data (changes only affect new indexing)
- Must handle common double-consonant patterns without over-stemming

---

### Decision

**We chose**: After stripping `-ing`/`-ed` suffixes, check if the resulting word ends in a doubled consonant and remove the duplicate.

**How it works**: After suffix removal, if `word[word.length-1] === word[word.length-2]` and both are consonants, slice off the last character. This handles "running"→"runn"→"run", "stopped"→"stopp"→"stop".

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Double-consonant reduction** | Simple, handles common cases | Edge cases with legitimate double endings | 8/10 |
| Full Porter stemmer | Comprehensive | Massive complexity increase for a "simple" stemmer | 4/10 |
| Leave as-is | Zero risk | Asymmetric stems persist | 2/10 |

**Why this one**: The simplest fix that handles the common patterns. A full stemmer would be over-engineering for a function explicitly named `simpleStem`.

---

### Consequences

**What improves**:
- "running"/"run", "stopped"/"stop" now stem to the same value
- BM25 recall improves for inflected search terms

**What it costs**:
- Existing BM25 index data unchanged until re-indexed. Mitigation: Acceptable — gradual improvement as memories are updated.
- Rare words with legitimate double endings (e.g., "inn", "add") may be over-stemmed. Mitigation: Minimal impact on search quality; these are uncommon in memory content.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Asymmetric stems cause search misses |
| 2 | **Beyond Local Maxima?** | PASS | Full Porter stemmer considered, too complex |
| 3 | **Sufficient?** | PASS | Handles the reported pattern with minimal code |
| 4 | **Fits Goal?** | PASS | Directly resolves finding #18 |
| 5 | **Open Horizons?** | PASS | Does not preclude future stemmer upgrades |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `lib/search/bm25-index.ts`: Add double-consonant check after suffix removal in `simpleStem()`

**How to roll back**: `git revert` the Sprint 3 commit.
<!-- /ANCHOR:adr-003 -->


---

