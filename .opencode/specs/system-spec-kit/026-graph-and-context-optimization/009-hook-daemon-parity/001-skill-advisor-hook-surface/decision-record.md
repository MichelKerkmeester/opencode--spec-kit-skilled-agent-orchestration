---
title: "Decision Record: Skill-Advisor Hook Surface"
description: "Architectural decisions for 020 — cross-runtime proactive skill-advisor hook."
trigger_phrases:
  - "020 adr"
  - "skill advisor hook decisions"
importance_tier: "critical"
contextType: "decision-record"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T06:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Decision record scaffolded with ADR-001 (research-first) + ADR-002 (pattern reuse)"
    next_safe_action: "Populate additional ADRs as research converges"

---
# Decision Record: Skill-Advisor Hook Surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Research-first umbrella (not direct implementation)

### Metadata

| Field | Value |
|-------|-------|
| **Date** | 2026-04-19 |
| **Status** | Accepted |
| **Author** | claude-opus-4.7-1m |
| **Severity** | P0 |

### Context

Phase 020 could land as a direct-implementation spec folder (research inline, ship all hook wiring at once) OR as a research-first umbrella (investigate architecture, then spawn cluster implementation children).

### Constraints

- Cross-runtime hook trigger points vary — Codex may not expose a per-prompt hook at all (open research question Q1)
- Cache TTL and freshness semantics are empirical questions that need measurement against real prompts, not static design
- Context-budget tradeoffs (40/60/80/120 tokens) need measured routing-quality retention, not guessed constants

### Decision

**Research-first umbrella.** Scaffold `020/001-initial-research` first. Dispatch deep-research on architecture + budget + runtime parity. Spawn implementation children per finding cluster.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Direct implementation (ship hooks all at once) | Too many unknowns: Codex hook surface, optimal TTL, brief length — would force guesses that could regress accuracy |
| Single-runtime MVP (ship Claude-only first) | Creates asymmetric user experience and requires revisiting hook shape once we adapt for other runtimes |
| Research inline in implementation child | 019's research-first umbrella pattern proved effective; same shape reduces decision fatigue |

### Consequences

**Positive**:
- Unknowns quantified before commitment
- Implementation children are tightly scoped
- Proven pattern from 019 minimizes orchestration risk

**Negative**:
- Adds 20-30h research wall-clock before any implementation ships
- Potentially surfaces more children than user expected

### Five Checks

| Check | Answer |
|-------|--------|
| Simpler | Research-first defers complexity into scoped children vs one mega-implementation PR |
| Stable | Pattern already proven in 019 |
| Stated | Yes — this ADR |
| Supported | Yes — the 019 research→remediation arc ran successfully |
| Sealed | Yes — commit of this packet creates the boundary |

### Implementation

- See `plan.md §4 Phases 1-2`
- See `tasks.md` T001-T013
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Reuse code-graph `buildStartupBrief()` pattern exactly

### Metadata

| Field | Value |
|-------|-------|
| **Date** | 2026-04-19 |
| **Status** | Accepted |
| **Author** | claude-opus-4.7-1m |
| **Severity** | P0 |

### Context

The code-graph hook (session-prime injection of `buildStartupBrief()` output via shared-payload envelope) is already deployed in all 3 runtimes and performs well. Three architectural pattern options exist:
1. Direct copy of the code-graph pattern
2. New custom pattern per-runtime
3. Hybrid (share envelope, custom per-runtime producer)

### Constraints

- Users expect consistency across runtimes
- Every new pattern multiplies debugging surface
- Shared-payload envelope (phase 018 R4) is the cross-runtime transport standard

### Decision

**Reuse the code-graph pattern exactly.** `buildSkillAdvisorBrief()` mirrors `buildStartupBrief()` in shape, trust-state vocabulary, envelope usage, and per-runtime hook integration point.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Custom pattern per-runtime | Drift risk, higher test surface, no benefit |
| Hybrid (shared envelope, custom producer) | Producer shape should match too — divergence harder to reason about |
| New transport contract | Already shipped phase 018 R4 envelope; reusing it is free |

### Consequences

**Positive**:
- Direct translation opportunity — developers familiar with code-graph see the parallel instantly
- Single snapshot-test harness can verify both hooks
- Trust-state vocabulary (live/stale/absent/unavailable) already proven in M8

**Negative**:
- Any code-graph quirks get inherited
- Tightly couples the two; changing one requires awareness of the other

### Five Checks

| Check | Answer |
|-------|--------|
| Simpler | Yes — pattern reuse vs novel design |
| Stable | Yes — code-graph pattern is live and healthy |
| Stated | Yes — this ADR |
| Supported | Yes — startup-brief.ts has 9 green tests post-M8 |
| Sealed | Yes — mirror contract captured in `spec.md §3 Files to Change` |

### Implementation

- See `spec.md §3 Files to Change` for file-level mirroring map
- See `plan.md §3 Architecture` for data-flow parallel
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Fail-open contract when advisor subprocess unavailable

### Metadata

| Field | Value |
|-------|-------|
| **Date** | 2026-04-19 |
| **Status** | Accepted |
| **Author** | claude-opus-4.7-1m |
| **Severity** | P0 |

### Context

The advisor subprocess might fail for legitimate reasons: Python not in PATH on user's machine, subprocess timeout exceeded, malformed JSON output, concurrent-write to the skill-graph. If the hook fails on any of these, the entire turn could be blocked — a far worse outcome than just losing advisor suggestions.

### Constraints

- The hook is additive — pre-hook users already had turns working without it
- The hook must not regress baseline reliability
- Error noise in briefs is worse than silent omission for users who don't need advisor

### Decision

**Fail-open.** Any advisor-subprocess error → `freshness=unavailable` + skip the brief section entirely. Turn proceeds as if the hook never ran.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Fail-closed (block turn on advisor error) | Unacceptable reliability regression |
| Inline error message in brief | Pollutes every turn when advisor is unavailable |
| Retry with backoff | Adds latency budget risk without clear benefit |

### Consequences

**Positive**:
- Hook cannot make turns worse than baseline
- Degraded mode is transparent via freshness signal
- Debugging is clear — check freshness, not turn failure

**Negative**:
- Silent degradation could mask real advisor problems
- Need separate observability (log warning when `unavailable` is set)

### Five Checks

| Check | Answer |
|-------|--------|
| Simpler | Yes — one branch, one outcome |
| Stable | Yes — mirrors code-graph's failure model |
| Stated | Yes — this ADR and `spec.md §6 Risks` |
| Supported | Yes — phase 018 shared-payload handles `unavailable` trustState |
| Sealed | Yes — contract enforced in `buildSkillAdvisorBrief` type signature |

### Implementation

- See `spec.md §6 Risks` row "Hook failure blocks turn completion"
- See `spec.md §8 Edge Cases` "Error Scenarios"
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Research → implementation handoff — 8-child critical path with renderer-first hard gate

### Metadata

| Field | Value |
|-------|-------|
| **Date** | 2026-04-19 |
| **Status** | Accepted |
| **Author** | claude-opus-4.7-1m |
| **Severity** | P0 |

### Context

After wave-1 (cli-codex, 10 iterations) and wave-2 (cli-copilot, 10 iterations) converged on the 020 research charter, the handoff to implementation could have taken three shapes: (1) single-packet implementation with inline wiring for all runtimes; (2) runtime-first (ship Claude adapter before payload contract); or (3) contract-first, renderer-first train with runtime adapters layered on top.

Waves agree on shape (3): ship the payload envelope → freshness → producer → renderer + corpus harness first, then runtimes. Wave-2 tightened the renderer into a **hard gate**: no runtime adapter merges before 005 converges at 100% corpus parity + p95 cache-hit ≤ 50 ms + privacy audit green.

### Constraints

- Each child must be independently reviewable via `/spec_kit:implement :auto`
- 005 must be a hard dependency for 006/007/008 (research-extended §X5 + §X9: renderer is the trust boundary)
- 002's envelope extension must land before any runtime emits advisor content (producer-identity rule from research-extended §X9)
- 009 must land last to consolidate documentation + release checklist

### Decision

Scaffold 8 children (002-009) under `020/`, with the critical path:

```
001 (converged) -> 002 -> 003 -> 004 -> 005 (HARD GATE) -> 006 -> 007 -> 008 -> 009
```

- 002-006 ship first (core + first user-visible slice)
- 007 + 008 run in parallel after 006 merges
- 009 closes release contract after 006/007/008 converge

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Single-packet implementation (inline everything) | Can't track per-child convergence; loses `/spec_kit:implement :auto` unit |
| Runtime-first (Claude adapter before envelope) | Violates renderer-first gate + producer-identity rule |
| 40-token brief (smaller visible surface) | Hides threshold/freshness; can make failed recommendations look valid |
| Similarity-only cache reuse | Too many near-misses across deep-loop/review prompts |
| `kind: "skill-advisor"` producer enum name | Confuses lifecycle with producer identity |
| 5-runtime parallel rollout | Diverges renderer text; parity regressions untraceable |

### Consequences

**Positive**:
- Each child has narrow scope + clear convergence criteria
- 005 hard gate ensures corpus parity and p95 budget before user-visible rollout
- Runtime adapters (006/007/008) are thin wrappers around the shared renderer
- Disable flag (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`) works uniformly because all runtimes share the producer

**Negative**:
- 8 children add orchestration overhead vs. single-packet
- Hard gate adds wall-clock to first user-visible slice (must wait for 005 parity)
- Documentation child (009) creates a late feedback loop on accuracy

### Five Checks

| Check | Answer |
|-------|--------|
| Simpler | Yes — each child is independently scoped |
| Stable | Yes — both waves converged on this ordering with no architectural reversal |
| Stated | Yes — this ADR plus cross-references in each child's spec.md |
| Supported | Yes — research-extended §Final Open Questions: no architecture-level questions remain |
| Sealed | Yes — scaffolding commit closes the handoff |

### Implementation

- See `spec.md §1 Metadata` Child Layout for the finalized 8-child list
- See `plan.md §4 Phase 2` for the dependency chain
- See `tasks.md` T007-T023 for the scaffolding + implementation tasks
- See each child's `spec.md` for scope detail (wave-1 + wave-2 folded)
<!-- /ANCHOR:adr-004 -->
