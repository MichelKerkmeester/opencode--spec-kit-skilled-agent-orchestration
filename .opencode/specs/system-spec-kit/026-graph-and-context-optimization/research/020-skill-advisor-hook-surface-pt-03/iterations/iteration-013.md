# Iteration 013 - Deep-dive on P0/P1 findings from iterations 001-010

## Executive assessment

The packet is **near convergence**, but the first ten iterations still leave **one real open P0**: child `005`'s replay hit-rate gate is mathematically impossible as written. A direct re-read of the child scaffold resolves the iteration-011 vs iteration-012 disagreement in favor of iteration-010: `005` still blocks implementation until the parent patches that hard-gate math. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-010.md §Findings] [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md §4.1 REQ-006, §5 Acceptance Scenario 10] [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/plan.md §2 Quality Gates, §4 Phase 4] [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/tasks.md §Phase 5 T021, §Phase 7 T028]

Because the aggregate ledger exposes only **one** open P0 from iterations 001-010, this pass deep-dives that blocker plus the **two highest-blast-radius open P1s**: upstream freshness/migration correctness across `003/004`, and the missing Copilot proof gate in `007`. That ranking is stricter than the deferred Codex `008` gap because `003/004/007` affect the first rollout slice or the validity of cached advice across **all** runtime children. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-01/research.md §Implementation Cluster Decomposition] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X3, §X7, §X8]

## Aggregated open P0/P1 ledger from iterations 001-010

| Source iter(s) | Child | Severity | Open issue |
| --- | --- | --- | --- |
| 010 | `005` | P0 | Replay hit-rate gate is impossible: the stated `20 unique + 10 repeats` trace can only yield `33.3%` overall cache hits, not `>= 60%`. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-010.md §Findings] |
| 010 | `005` | P1 | Timing-harness wall-clock target is below the lower bound implied by its own 4-lane sample plan. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-010.md §Budget math, §Concrete corrections] |
| 008 | `003/004` | P1 | Non-live freshness is detected, but producer behavior for stale/absent/unavailable migration paths is still under-specified; corrupt generation-counter recovery is also implicit. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-008.md §Findings] |
| 002, 005 | `007` | P1 | Copilot transport proof exists in prose/setup tasks, but not as a merge-blocking acceptance gate with a version floor or committed evidence. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md §Severity-tagged findings] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-005.md §Findings] |
| 001, 002 | `008` | P1 | Codex child still omits the wave-2 `PostToolUse` audit/repair slice. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md §Severity-tagged findings] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md §Severity-tagged findings] |
| 004 | `005` | P1 | The 200-prompt corpus does not cover `004` skip-policy branches or wave-2 X5 prompt-poisoning fixtures. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-004.md §Findings] |
| 006 | `005` | P1 | Observability remains test-light on alert thresholds, exact JSONL schema, and per-metric label contract. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-006.md §Findings] |
| 007 | `004`, `007`, `008` | P1 | Fail-open precision gaps remain for stale/degraded branches and explicit `brief: null` no-op handling outside Claude. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-007.md §Findings] |
| 009 | `003`, `007`, `009` | P1 | Hook-state persistence and Copilot wrapper fallback still lack explicit prompt-artifact privacy rules. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-009.md §Findings] |

## Selected top-3 deep dives

### 1. P0 - `005` hard-gate math is internally unsatisfiable

#### Re-check against child scaffold

The blocker repeats across the whole `005` packet, not just one sentence:

1. `005/spec.md` defines a synthetic replay of **20 unique prompts + 10 repeats** while also requiring **cache hit rate >= 60%**. Under exact-prompt caching from `004`, that workload can only produce **10 hits out of 30 turns = 33.3%**. [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md §3.5 Timing harness, §4.1 REQ-006]
2. `005/plan.md` repeats the same impossible target in both Definition of Done and Phase 4 timing work. [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/plan.md §2 Quality Gates, §4 Implementation Phases]
3. `005/tasks.md` operationalizes the same impossible gate in `T021`, `T028`, and the completion criteria, so implementation would be asked to pass an unsatisfiable test. [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/tasks.md §Phase 5 T018-T021, §Phase 7 T027-T028]

#### Wave cross-check

Wave 1 and wave 2 both make `005` the rollout gate, but neither wave requires a `>= 60%` overall hit rate on the specific `20/10` trace. Wave 1 only requires the renderer/parity harness before runtime rollout, and wave 2 tightens `005` into an even stricter hard gate without authorizing contradictory replay math. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-01/research.md §Implementation Cluster Decomposition] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md §Refined child-level decomposition, §Key actionable conclusions]

#### Verdict

This is still the **only open P0** from iterations 001-010. It is a pure contract error in the scaffold, not an implementation uncertainty.

#### Proposed parent patch

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@
+### Pre-implementation patch queue
+
+1. **Child 005 hard-gate corrections**
+   - Replace the overloaded replay gate with one consistent option:
+     - keep the fixed `20 unique + 10 repeats` replay and assert `overall hit rate >= 33%`, or
+     - keep the `>= 60%` hit-rate assertion and change the replay to at least `12 unique + 18 repeats`.
+   - Clarify everywhere that the `<= 50 ms` latency gate is **cache-hit-only** and does not apply to cold/warm subprocess lanes.
+   - Relax the timing-harness wall-clock target in child `005` to match the stated 4-lane × 50-sample plan, or explicitly reduce the sample counts.
```

### 2. P1 - `003/004` still leave migration-safe cache reuse under-specified

#### Re-check against child scaffold

The issue is not that freshness is missing; it is that the migration posture across freshness and producer layers is still incomplete:

1. `003/spec.md` correctly covers stale detection, per-skill fingerprints, generation monotonicity, and rename/delete suppression, but it still does **not** close the malformed-or-unreadable generation-counter path as an acceptance scenario. [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/spec.md §4.1 REQ-003, §4.2 REQ-011-REQ-012, §L2 Edge Cases]
2. `003/plan.md` and `003/tasks.md` schedule atomic writes and benchmark validation, but they do not reserve work for corruption bootstrap or malformed-counter recovery. [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/plan.md §4 Implementation Phases] [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/tasks.md §Phase 2 T010-T013, §Phase 3 T014-T018]
3. `004/spec.md` consumes freshness, invalidates the exact cache on source-signature change, and defines fail-open branches, but it still does not pin what `buildSkillAdvisorBrief()` must do when `freshness !== "live"` for an already-running session. [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md §3 In Scope, §4.1 REQ-005-REQ-010, §L2 Edge Cases]
4. `004/plan.md` and `004/tasks.md` likewise reserve work for prompt policy, cache, subprocess, and fail-open handling, but not for an end-to-end stale-graph migration scenario. [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/plan.md §4 Implementation Phases] [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/tasks.md §Phase 2 T008-T014, §Phase 3 T015-T021]

#### Wave cross-check

Wave 2 is explicit that cache reuse must bind together freshness, migration, and concurrency: per-skill fingerprints, generation-tagged snapshots, rename/delete semantics, and fail-open when those guarantees are unavailable. That is broader than the current child text, which still allows the producer posture on stale/absent/unavailable freshness to stay implicit. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X7, §X8, §Key actionable conclusions]

#### Verdict

This remains the **highest-blast-radius open P1** because it affects cache correctness for the shared producer that every runtime child depends on. It is more urgent than the deferred Codex `008` scope hole.

#### Proposed parent patch

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@
+2. **Children 003-004 migration/freshness corrections**
+   - Patch child `003` to add an acceptance scenario for malformed or unreadable `.opencode/skill/.advisor-state/generation.json`.
+   - Recovery must be explicit: recreate atomically or return `state: "unavailable"` with `diagnostics.reason`; never silently reuse prior generation state.
+   - Patch child `004` so exact-prompt cache reuse is forbidden from presenting a fresh-looking result when `freshness !== "live"`.
+   - Require one end-to-end migration scenario covering: stale graph detected -> cache bypass or explicit degraded/stale branch -> no fresh-looking reuse.
```

### 3. P1 - `007` still does not make Copilot transport proof a ship gate

#### Re-check against child scaffold

The gap is no longer architectural; it is now a merge-gate gap:

1. `007/spec.md` correctly says Copilot must prefer the SDK `onUserPromptSubmitted` path when available and must **not** treat notification-only `{}` as proof, but the P0 requirements only enforce preference/fallback plumbing. [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md §3.2 Copilot adapter, §4.1 REQ-003-REQ-004, §5 Acceptance Scenario 6]
2. `007/plan.md` makes `Copilot SDK capability captured for repo runtime version` part of readiness, which is helpful but still weaker than a spec-level acceptance gate. [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/plan.md §2 Quality Gates]
3. `007/tasks.md` includes setup work to capture or confirm Copilot SDK capability, but again as preparation rather than as a merge-blocking requirement with committed evidence. [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/tasks.md §Phase 1 T001-T004, §Phase 3 T012-T018]

#### Wave cross-check

Wave 1 already required captured or fixture-backed proof that Copilot command-hook output is model-visible, and wave 2 X3 sharpened that further: the checked-in local wrapper is notification-only today, while the upstream SDK path may still inject `additionalContext`. The converged contract therefore requires proof, not assumption, before making the SDK path the default rollout path. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-01/research.md §Cross-runtime trigger inventory, §Implementation Cluster Decomposition] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X3, §Validation follow-ups]

#### Verdict

This is the highest-impact remaining runtime P1 because `007` can otherwise look "done" while the repo-supported Copilot path remains unproven.

#### Proposed parent patch

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@
+3. **Child 007 Copilot proof gate**
+   - Promote Copilot transport proof to a P0 merge gate.
+   - The SDK path may ship as the default only after a committed fixture or captured runtime artifact proves model-visible `additionalContext` for the repo-supported Copilot runtime/version floor.
+   - Notification-only `{}` is never sufficient evidence.
+   - If proof is absent, the wrapper path remains the documented default and child `009` must publish the capability matrix plus version floor.
```

## Deprioritized but still-open P1s

These remain valid, but they are not in the top-three because their blast radius is lower than the items above:

1. `008` still needs the wave-2 `PostToolUse` audit/repair slice, but `008` is a deferred parity expansion after the shared producer/renderer train stabilizes. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md §Severity-tagged findings] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md §Severity-tagged findings]
2. `005` still needs supplemental skip/adversarial fixtures and a tighter observability contract. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-004.md §Findings] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-006.md §Findings]
3. `004/007/008` still have fail-open precision gaps around stale/degraded and `brief: null` no-op paths. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-007.md §Findings]
4. `009` still needs explicit validation/manual-playbook and wrapper/hook-state privacy language. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md §Severity-tagged findings] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-009.md §Findings]

## Novelty and convergence note

This pass did **not** reopen architecture, justify new children, or surface a new blocker class. Its value is narrower: it resolves the 011/012 disagreement by confirming that the 005 replay gate is still an actual P0, and it converts the two highest-impact remaining P1s into parent-ready patch text. That keeps `newInfoRatio` **below 0.05** and supports early convergence once the parent absorbs these pre-implementation edits.
