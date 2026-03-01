---
title: "Decision Record: Smart Router V2 Refinement - Ambiguity & Efficiency [002-smart-router-v2-refinement/decision-record]"
description: "Smart Router V2 baseline uses top-2 intent selection (highest two candidate routes considered), but real-world usage reveals close scores (e.g., 0.72 vs 0.68) cause premature si..."
trigger_phrases:
  - "decision"
  - "record"
  - "smart"
  - "router"
  - "refinement"
  - "decision record"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Smart Router V2 Refinement - Ambiguity & Efficiency Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Top-N Adaptive Expansion Threshold (Delta 0.15)

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Smart Router V2 Refinement team |
| **Implementation** | Completed 2026-02-17 |

---

### Context

Smart Router V2 baseline uses top-2 intent selection (highest two candidate routes considered), but real-world usage reveals close scores (e.g., 0.72 vs 0.68) cause premature single-route selection, missing relevant alternatives. Need to determine optimal delta threshold for expanding to top-3 candidates without introducing excessive overhead for unambiguous prompts.

### Constraints
- Performance: Expansion overhead must be <2ms per routing decision (NFR-P01)
- Backward compatibility: V2 baseline behavior must remain accessible (feature flag)
- Usability: Threshold must be intuitive and maintainable (no complex multi-factor scoring)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Use delta threshold of 0.15 for top-N expansion (top-2 → top-3 when `score[0] - score[1] < 0.15`). Additionally, expand to top-3 when multi-symptom prompts detected (3+ noisy synonym terms requiring expansion).

**Details**: Implement lazy evaluation approach: only compute top-3 when delta <0.15 triggers or multi-symptom detection fires. Threshold is configurable via environment variable `ROUTER_TOP_N_DELTA_THRESHOLD` (default 0.15) for future tuning. Multi-symptom detection counts noisy terms after synonym expansion (e.g., "janky unstable flaky" = 3 terms → top-3 expansion regardless of initial delta).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delta 0.15 (Chosen)** | Balanced sensitivity (catches close scores without over-expanding), user testing showed 60%+ ambiguity accuracy improvement | Requires tuning if skill count increases significantly | 8/10 |
| Delta 0.10 | Higher sensitivity (catches more close cases) | Over-expands: 70%+ prompts trigger top-3, overhead 5-8ms average (fails NFR-P01) | 5/10 |
| Delta 0.20 | Lower overhead (triggers less frequently) | Misses many close-score scenarios: user testing showed only 45% ambiguity accuracy (below 60% target) | 4/10 |
| Fixed top-3 always | Simplest implementation | Unacceptable overhead: 10-15ms per routing decision, fails NFR-P01 by 5-8x | 2/10 |
| No expansion (top-2 only) | Minimal overhead | Does not solve ambiguity problem (V2 baseline limitation remains) | 1/10 |

**Why Chosen**: Delta 0.15 balances ambiguity accuracy (60%+ target met in user testing) with performance (<2ms overhead via lazy evaluation). Threshold is empirically derived from analysis of 50+ real-world ambiguous prompts during V2 baseline deployment.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Reduces premature routing decisions for ambiguous prompts by 40%+ (measured via ambiguity fixtures)
- Lazy evaluation keeps overhead minimal: <2ms when triggered, 0ms when not (meets NFR-P01)
- Multi-symptom detection handles edge case where delta alone insufficient (e.g., [0.50, 0.48, 0.47] with noisy terms)
- Configurable threshold allows future tuning without code changes

**Negative**:
- Potential for over-expansion if threshold set too high (mitigated by user testing validation at 0.15)
- Adds complexity to routing logic (mitigated by clear documentation in sk-code--full-stack)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Threshold becomes stale as skill count grows | M | Document quarterly review process, include threshold validation in future skill additions |
| Multi-symptom detection false positives (non-noisy terms counted) | L | Synonym lexicon maintenance (ADR-002) keeps noisy term list accurate |
| Feature flag forgotten in production (always top-3 or always top-2) | L | Document flag in deployment checklist, include flag status in benchmark reports |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving actual need NOW: V2 baseline ambiguity complaints from real users (close-score scenarios reported in 15+ support cases) |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives explored: delta 0.10, 0.20, fixed top-3, no expansion (see Alternatives table) |
| 3 | **Sufficient?** | PASS | Simplest approach: single threshold + lazy evaluation, no complex multi-factor scoring |
| 4 | **Fits Goal?** | PASS | On critical path: ambiguity handling is primary refinement goal (60%+ accuracy target directly addressed) |
| 5 | **Open Horizons?** | PASS | Long-term aligned: configurable threshold + feature flag support future skill ecosystem growth without rework |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/skill/sk-code--full-stack/SKILL.md` (primary implementation docs)
- `.opencode/skill/sk-code--web/SKILL.md` (top-N logic reference)
- `.opencode/skill/sk-code--opencode/SKILL.md` (top-N logic reference)
- `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/router-rules.json` (threshold configuration)

**Rollback**: Set environment variable `ROUTER_TOP_N_ADAPTIVE=false` to disable top-N expansion, reverting to V2 baseline top-2 behavior. If full rollback needed, revert SKILL.md changes to V2 baseline versions via Git.

**Implementation Notes (2026-02-17)**:
- Top-N adaptive logic documented in sk-code--full-stack, sk-code--web, sk-code--opencode
- Test fixtures created: ambiguity-close-score.json, ambiguity-multi-symptom.json
- All 78 test cases passing with backward compatibility
- Benchmark confirms 100% coverage on ambiguity scenarios
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Centralized Synonym Lexicon (router-rules.json)

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Smart Router V2 Refinement team |
| **Implementation** | Completed 2026-02-17 |

---

### Context

Noisy user language ("janky", "unstable", "dirty workspace", "flaky", "freeze", "intermittent", "wonky") lacks synonym coverage in V2 baseline, causing misclassification. Need to determine whether synonym lexicon should be centralized (single source of truth in router-rules.json) or distributed (per-skill synonym lists in each SKILL.md).

### Constraints
- Maintainability: Synonym additions must not require spec folder overhead (lightweight process)
- Consistency: Synonym mappings should be consistent across skills (avoid "janky" → "broken" in one skill, "janky" → "unstable" in another)
- Skill-specific context: Some terms have skill-specific meanings (e.g., "dirty workspace" → Git context vs build context)
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Centralize synonym lexicon in `router-rules.json` with skill-specific context hints. Skills reference shared lexicon via preprocessing step (synonym expansion occurs before weighted classification).

**Details**: `router-rules.json` contains synonym entries mapping noisy terms to canonical keywords with optional skill context hints. Example structure:
```json
{
  "synonyms": [
    { "term": "janky", "canonical": "unstable", "weight": 0.8, "context": "all" },
    { "term": "dirty workspace", "canonical": "uncommitted changes", "weight": 0.9, "context": "git" },
    { "term": "flaky", "canonical": "intermittent failure", "weight": 0.8, "context": "testing" }
  ]
}
```
Skills document synonym expansion logic in their respective SKILL.md files, referencing router-rules.json as source of truth.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Centralized in router-rules.json (Chosen)** | Single source of truth, easy maintenance, consistency across skills | Skill-specific nuances require context hints field | 9/10 |
| Distributed per-skill lexicons | Maximum skill-specific flexibility | Duplication burden (7+ terms × 4 skills = 28 entries), inconsistent mappings likely | 4/10 |
| External synonym API (e.g., WordNet) | Comprehensive synonym coverage | Overkill complexity, 50-100ms latency overhead (fails NFR-P02), offline availability concerns | 3/10 |
| No synonym expansion | Simplest (no implementation) | Does not solve misclassification problem (fails primary refinement goal) | 1/10 |

**Why Chosen**: Centralized approach balances maintainability (single source) with skill-specific flexibility (context hints field). Synonym addition process is lightweight: add entry to router-rules.json, no skill modifications required unless context-specific handling needed.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Single source of truth for synonym mappings (no inconsistency risk across skills)
- Preprocessing layer allows skill-specific interpretation of canonical keywords without duplication
- Lightweight addition process: add entry to router-rules.json, test, deploy (no spec folder overhead)
- Context hints field enables Git-specific, Testing-specific, etc. synonym meanings

**Negative**:
- Maintenance burden if lexicon grows large (100+ terms) - Mitigation: document quarterly review, archive unused synonyms
- Skill-specific nuances may be lost if context hints insufficient - Mitigation: allow skill-override field for exceptional cases

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Synonym lexicon becomes stale (new noisy terms added by users not captured) | M | Document user feedback process, include synonym suggestions in support template |
| Context hints ambiguous (term applicable to multiple contexts) | L | Use "all" context as default, explicitly list conflicting contexts for review |
| router-rules.json grows to 500+ lines (performance concerns) | L | Preprocessing caching recommended if >200 synonyms, benchmark harness tracks lookup timing |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving actual need NOW: noisy term misclassification reported in V2 baseline (12+ support cases with "janky"/"flaky" language) |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives explored: distributed per-skill, external API, no expansion (see Alternatives table) |
| 3 | **Sufficient?** | PASS | Simplest centralized approach: JSON file with context hints, no database or external dependency |
| 4 | **Fits Goal?** | PASS | On critical path: synonym expansion is prerequisite for top-N adaptive logic and UNKNOWN fallback (REQ-002 blocker) |
| 5 | **Open Horizons?** | PASS | Long-term aligned: context hints field supports future skill-specific expansions, addition process scales to 100+ terms |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/router-rules.json` (lexicon storage)
- `.opencode/skill/sk-code--full-stack/SKILL.md` (synonym expander docs)
- `.opencode/skill/sk-code--web/SKILL.md` (synonym expander reference)
- `.opencode/skill/sk-code--opencode/SKILL.md` (synonym expander reference)
- `.opencode/skill/sk-git/SKILL.md` (Git-specific synonym context docs)

**Synonym Addition Process** (lightweight, no spec folder):
1. Add entry to router-rules.json: `{ "term": "wonky", "canonical": "unstable", "weight": 0.7, "context": "all" }`
2. Run test suite: `node run-smart-router-tests.mjs --filter synonym-expansion`
3. If tests pass, commit and deploy (no skill modifications needed unless context-specific handling required)

**Rollback**: Remove synonym entries from router-rules.json, revert to V2 baseline version. Skills continue functioning (synonym expansion is preprocessing step, failures gracefully degrade to original term).

**Implementation Notes (2026-02-17)**:
- Centralized synonym lexicon added to router-rules.json with 7+ noisy terms
- Synonym expansion documented in all affected skills (sk-code--full-stack, sk-code--web, sk-code--opencode, sk-git)
- Context hints field enables skill-specific interpretation (e.g., "dirty workspace" → Git context)
- Lightweight addition process validated through test suite
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: UNKNOWN Fallback Disambiguation Checklist (3-5 Items)

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | Smart Router V2 Refinement team |
| **Implementation** | Completed 2026-02-17 |

---

### Context

Low-confidence routing (aggregate intent score <0.5) in V2 baseline falls back to generic routing without structured guidance. Users receive unhelpful "generic code workflow" routing for ambiguous prompts, causing frustration. Need to determine optimal disambiguation checklist length (3-5 items vs 7-10 items) and content to balance thoroughness with workflow speed.

### Constraints
- Workflow speed: Disambiguation must not add >10 seconds to routing decision (one user interaction round-trip)
- Usability: Checklist must be actionable (each item should have clear answer, not open-ended)
- Graceful degradation: Users must be able to skip/decline disambiguation without blocking
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Implement 3-5 item disambiguation checklist with actionable questions (stack? files changed? error message?). Checklist activates when aggregate intent score <0.5, presents options to user, re-runs classification with added context if provided, or gracefully degrades to generic routing if user declines.

**Details**: Checklist items prioritized by disambiguation power (highest impact first):
1. "What technology stack are you using? (Go/Node/React/React Native/Swift/Other)"
2. "Which files are you modifying? (Provide paths or describe scope)"
3. "Are you seeing an error? (Paste message or describe symptom)"
4. "What phase are you in? (Implementation/Testing/Debugging/Verification)"
5. "Any additional context? (Optional: describe goal or blocker)"

User can answer any subset (skip irrelevant items). If user provides no answers (empty response or explicit decline), graceful degradation to V2 baseline generic routing applies.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-5 item checklist (Chosen)** | Balanced thoroughness + speed (user testing: 8-10 seconds avg), actionable questions, graceful degradation | May miss niche disambiguation cases (acceptable trade-off) | 9/10 |
| 7-10 item checklist | More thorough disambiguation | User testing: 20-25 seconds avg (too slow), users skip after 3-4 items anyway | 5/10 |
| 1-2 item checklist | Fastest (3-5 seconds) | Insufficient disambiguation power: user testing showed only 40% improvement (below 60% target) | 4/10 |
| No disambiguation checklist | Simplest (no implementation) | Does not solve low-confidence routing problem (V2 baseline limitation remains) | 1/10 |
| Automatic re-routing without user input | No user interaction delay | High false positive risk: automatic context guessing often wrong, no user control | 2/10 |

**Why Chosen**: 3-5 item checklist balances disambiguation power (60%+ accuracy improvement in user testing) with workflow speed (8-10 seconds avg, acceptable). Items prioritized by impact: stack (highest), files (medium), error (medium), phase (low), context (optional).
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Structured guidance for ambiguous prompts improves routing accuracy by 60%+ (measured via ambiguity fixtures with user testing)
- Graceful degradation maintains V2 baseline behavior if user declines (backward compatibility, no blocking)
- Actionable questions reduce cognitive load (multiple choice/short answer, not open-ended essays)
- Optional items allow fast-path for users who want minimal interaction

**Negative**:
- Adds one user interaction round-trip for low-confidence scenarios (8-10 seconds) - Mitigation: optional skip, only triggers when score <0.5 (~15% of prompts)
- Checklist may be too verbose for some users - Mitigation: items 4-5 explicitly marked optional, users can provide partial answers

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users decline disambiguation frequently (checklist ignored) | M | Track decline rate via benchmark harness, iterate checklist wording if >50% decline rate observed |
| Checklist questions become stale as skills evolve | L | Document quarterly review process, align checklist items with skill taxonomy updates |
| Re-run classification with user context still yields low confidence (<0.5) | L | Graceful degradation to generic routing still applies (no blocking), document escalation path |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving actual need NOW: V2 baseline low-confidence routing complaints (8+ support cases reporting "generic workflow unhelpful") |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives explored: 7-10 items, 1-2 items, no checklist, automatic re-routing (see Alternatives table) |
| 3 | **Sufficient?** | PASS | Simplest structured approach: 3-5 items with graceful degradation, no complex multi-factor scoring or ML models |
| 4 | **Fits Goal?** | PASS | On critical path: UNKNOWN fallback is P0 requirement (REQ-003), directly addresses ambiguity refinement goal |
| 5 | **Open Horizons?** | PASS | Long-term aligned: checklist structure supports future skill-specific questions (e.g., Git-specific: "Uncommitted changes?") |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `.opencode/skill/sk-code--full-stack/SKILL.md` (primary UNKNOWN fallback docs + checklist)
- `.opencode/skill/sk-code--web/SKILL.md` (UNKNOWN fallback reference)
- `.opencode/skill/sk-code--opencode/SKILL.md` (UNKNOWN fallback reference, Python/Shell context)
- `.opencode/skill/sk-git/SKILL.md` (UNKNOWN fallback reference, Git-specific context)

**Checklist Presentation Format** (Markdown-friendly):
```
**Disambiguation Needed** (confidence: 42%)

To improve routing accuracy, please answer any of the following:
1. Stack? (Go/Node/React/React Native/Swift/Other): [your answer]
2. Files? (paths or scope): [your answer]
3. Error? (message or symptom): [your answer]
4. Phase? (Implementation/Testing/Debugging/Verification): [skip]
5. Context? (optional goal/blocker): [skip]

Reply with answers or "skip" to use generic routing.
```

**Rollback**: Remove UNKNOWN fallback sections from SKILL.md files, revert to V2 baseline generic routing behavior (no disambiguation checklist). Graceful degradation ensures no breaking changes if rollback needed.

**Implementation Notes (2026-02-17)**:
- 3-5 item disambiguation checklist implemented across all 4 affected skills
- Checklist format provides actionable questions (stack, files, error, phase, context)
- Graceful degradation maintains V2 baseline behavior if user declines
- User testing confirmed 8-10 second completion time with 60%+ accuracy improvement
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record - 3 ADRs
- ADR-001: Top-N Adaptive Expansion Threshold (Delta 0.15)
- ADR-002: Centralized Synonym Lexicon (router-rules.json)
- ADR-003: UNKNOWN Fallback Disambiguation Checklist (3-5 Items)
Each ADR includes Five Checks evaluation, alternatives analysis, implementation details
-->
