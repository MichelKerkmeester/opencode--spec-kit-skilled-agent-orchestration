---
title: Deep Research Strategy
description: Session tracking for 30-iteration deep-research on Phase 017 refinement surface via cli-codex executor.
---

# Deep Research Strategy — Phase 017 Refinement Surface

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Thirty-iteration autonomous deep-research pass investigating the post-ship refinement, improvement, bug, and follow-up surface of Phase 017 (`review-findings-remediation`, shipped v3.4.0.2 on 2026-04-17). Executed via `cli-codex gpt-5.4 high fast` through the Phase 018 executor-selection infrastructure. Goal: produce a Phase-019+ scoping document with prioritized findings.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:topic -->
## 2. TOPIC

Post-Phase-017 refinement, improvement, bug, and follow-up surface under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/`. Covers metadata-freshness regen stability (H-56-1 aftermath + description.json auto-regen preserve-field gaps), code-graph readiness vocabulary completeness across the 7 sibling handlers, NFKC + evidence-marker + lint false-positive surfaces, retry-budget policy calibration (N=3 empirical basis), AsyncLocalStorage caller-context propagation edge cases, Copilot autonomous-execution hardening preconditions, Wave-D deferred P2 coupling risk (R55-P2-002/003/004), plus 16-folder canonical-save sweep ordering invariants.

<!-- /ANCHOR:topic -->

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1. Does H-56-1's two-batch 16-folder metadata refresh introduce clock-skew or concurrent-save ordering inconsistencies in `description.json.lastUpdated` vs `graph-metadata.json.derived.last_save_at`?
- [ ] Q2. What are the root causes + mitigation options for `generate-description.js` auto-regen overwriting hand-authored rich content in spec folders?
- [ ] Q3. Are all 8 `SharedPayloadTrustState` enum values actually reachable from each of the 7 code-graph sibling handlers, or is there dead-code vocabulary?
- [ ] Q4. How robust is NFKC unicode sanitization against homoglyph attacks beyond the 5 tested scripts (Cyrillic, zero-width, Greek, soft hyphen, combined)?
- [ ] Q5. Is the N=3 retry budget for `partial_causal_link_unresolved` empirically justified or arbitrary? What's the actual failure-resolution distribution?
- [ ] Q6. Does AsyncLocalStorage caller-context propagation survive across all async boundaries (setTimeout, Promise.all, event loop migrations)?
- [ ] Q7. What are the remaining Copilot-specific observability gaps post-Cluster E (compact-cache + session-prime), and how do they affect autonomous execution?
- [ ] Q8. What's the coupling risk of Wave-D deferred P2 items (R55-P2-002 importance-tier helper, R55-P2-003 executeConflict DRY, R55-P2-004 YAML evolution gap) being carried forward into Phase 019?
- [ ] Q9. Does evidence-marker bracket-depth lint produce false positives in edge cases (nested code blocks, fenced content with mismatched fences, paren-heavy content)?
- [ ] Q10. Is the 10-minute continuity-freshness threshold for `_memory.continuity.last_updated_at` vs `graph-metadata.derived.last_save_at` calibrated to real metadata-refresh latency, or is it a guess?

<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- P0 re-audit of already-closed composite attack chains from Phase 016 (A/B/C/D). Phase 017 closed those.
- Threat-model expansion beyond the 152-finding registry scope.
- Performance benchmarking of the deep-loop dispatch layer itself. That's 020+ territory.
- Any implementation or file mutation — this is a READ-ONLY research pass. Synthesis goes to `research.md` only.
- Re-litigating ADR decisions from Phase 018/019 (flat config, dispatch-branch pattern, cross-CLI delegation docs-only stance).

<!-- /ANCHOR:non-goals -->

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- 30 iterations exhausted (max).
- Convergence: `newInfoRatio` ≤ 0.05 for 3 consecutive iterations AND all 10 key questions answered or explicitly ruled out.
- Stuck recovery exhaustion (3 consecutive failed dispatches).
- Explicit user pause via `.deep-research-pause` sentinel.

<!-- /ANCHOR:stop-conditions -->

<!-- ANCHOR:known-context -->
## 6. KNOWN CONTEXT

Phase 017 shipped 2026-04-17 as v3.4.0.2. 25 commits to main, 27 remediation tasks closed. Verdict CONDITIONAL → PASS with advisories. 4 architectural primitives introduced: canonical metadata writer (H-56-1 fix), readiness-contract module, AsyncLocalStorage caller-context, retry-budget counter. Phase 017's `implementation-summary.md` §Known Limitations lists 8 explicit hedges. Phase 018 shipped cli-codex executor; Phase 019 shipped cli-copilot + cli-gemini + cli-claude-code executors.

Relevant memory entries: `feedback_phase_018_autonomous`, `feedback_codex_cli_fast_mode`, `feedback_copilot_concurrency_override`.

<!-- /ANCHOR:known-context -->

<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS

Iteration 1: H-56-1 cascade consistency across the 16-folder sweep. Inspect `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` timestamps for all affected folders under `026-graph-and-context-optimization/`. Identify any cross-folder ordering anomalies or clock-skew risks.

<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:iterations -->
## 8. ITERATIONS

[Reducer maintains this section.]

<!-- /ANCHOR:iterations -->
</content>
</invoke>
