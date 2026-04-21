# Iteration 011 - Deep-dive on open P0/P1 findings from iterations 001-010

## Executive assessment

The packet is **near convergence**. Iterations 001-010 surfaced only **one unresolved P0** (`005` replay hit-rate math) plus a backlog of P1 contract-tightening items. This pass did **not** discover a new blocker class; it deepened the existing `005` P0 and the two highest-impact open P1s: stale-freshness migration posture across `003/004`, and the missing Copilot proof gate in `007`. That keeps `newInfoRatio` below the convergence threshold at **0.04** while still producing concrete parent-level patch text. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/deep-research-state.jsonl:2-11]

Because there are **not three distinct open P0s** in the first ten iterations, this deep-dive uses the only open P0 plus the next two highest-impact open P1s. That is the honest ranking from the existing validation corpus rather than an attempt to force new blockers.

## Aggregated open P0/P1 backlog from iterations 001-010

| Source iter(s) | Child | Severity | Aggregated issue | Status after iter 011 |
| --- | --- | --- | --- | --- |
| 010 | `005` | P0 | Replay hit-rate gate is impossible as written: `20 unique + 10 repeats` cannot satisfy `>= 60%` overall hit rate under exact-prompt caching. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-010.md:20-32] | **Deep-dived here** |
| 010 | `005` | P1 | Timing-harness wall-clock budget is below the lower bound implied by its own 4-lane sample plan. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-010.md:20-32] | Folded into P0 patch set |
| 008 | `003/004` | P1 | Non-live freshness is detected but producer behavior on stale graph state is not pinned down; generation-counter corruption recovery is also implicit. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-008.md:17-22] | **Deep-dived here** |
| 002, 005 | `007` | P1 | Copilot SDK-path proof exists only as prose / setup work, not as a P0 merge gate with a version floor or checked-in evidence. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md:49-53] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-005.md:20-28] | **Deep-dived here** |
| 004 | `005` | P1 | 200-prompt corpus does not cover `004` skip-policy branches or wave-2 X5 adversarial prompt inputs. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-004.md:30-49] | Still open, lower blast radius |
| 006 | `005` | P1 | Observability gate is missing explicit alert thresholds, richer JSONL schema, and tighter metric-label contract. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-006.md:20-30] | Still open, lower blast radius |
| 007 | `004`, `007`, `008` | P1 | Fail-open precision gaps remain for stale-reuse, degraded/stale branch behavior, and explicit `brief: null` no-op handling outside Claude. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-007.md:27-35] | Still open, lower blast radius |
| 001, 005 | `008` | P1 | Codex child is still missing the wave-2 `PostToolUse` slice and dual-input precedence. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md:22-25] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-005.md:24-28] | Still open, lower blast radius |
| 001, 002 | `009` | P1 | Release contract still lacks explicit validation/manual-playbook deliverables. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md:24-25] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md:49-53] | Still open, lower blast radius |
| 009 | `003`, `007`, `009` | P1 | Hook-state persistence and Copilot wrapper fallback still lack explicit prompt-artifact privacy rules. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-009.md:22-26] | Still open, lower blast radius |

## Deep-dive 1 - P0: `005` replay hit-rate gate is internally impossible

### Re-check against child scaffold

The blocking math error is not confined to `005/spec.md`; it is repeated across the full child scaffold:

1. `005/spec.md` sets `Cache hit rate >= 60% on typical 30-turn session (synthetic replay)` while the same section defines the replay as `20 unique prompts + 10 repeats`. [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:145-156] [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md:199-212]
2. `005/plan.md` repeats the same impossible gate in both Definition of Done and Timing Harness phase work. [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/plan.md:55-60] [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/plan.md:133-147]
3. `005/tasks.md` operationalizes the same impossible gate in `T021`, `T028`, and completion criteria, so implementation would literally be asked to satisfy an unsatisfiable test. [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/tasks.md:75-99] [SOURCE: file:020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/tasks.md:103-108]

Wave-1 and wave-2 both require `005` to be the hard validation gate, but neither wave ever required a `>= 60%` overall hit rate on the specific `20/10` trace. Wave-1 only says `005` must own the renderer fixtures / parity gate before runtime rollout, and wave-2 X1 hardens the harness design without authorizing this contradictory replay math. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-01/research.md:317-322] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md:7-15] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md:23-30]

### Verdict

This remains the **only open P0** from iterations 001-010. It is a pure spec bug: no implementation can satisfy the current `005` contract without either changing the replay shape or weakening the metric definition.

### Proposed parent patch

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@ Pre-implementation patch queue for child 005
+- Patch child 005 before implementation:
+  - Replace the overloaded replay gate with one of two consistent forms:
+    1. keep the fixed `20 unique + 10 repeats` replay and set the overall-hit assertion to `>= 33%`, or
+    2. keep the `>= 60%` assertion but change the replay composition to at least `12 unique + 18 repeats`.
+  - Clarify that the `<= 50 ms` latency gate is cache-hit-only and does not apply to the cold/warm subprocess lanes.
+  - Relax the harness wall-clock target in 005 from `< 2 minutes` to a budget consistent with `4 lanes x 50 samples`, or explicitly reduce the sample counts.
```

## Deep-dive 2 - P1: `003/004` still leave migration posture underspecified

### Re-check against child scaffold

The earlier migration finding holds after re-reading both children's specs, plans, and tasks:

1. `003/spec.md` covers generation monotonicity, rename/delete suppression, and missing-file recreation, but it still does not close the **malformed or unreadable** `.advisor-state/generation.json` path as an acceptance scenario. The risk and edge-case prose mention missing-file recreation and read-only fallback, not corruption recovery. [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/spec.md:135-149] [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/spec.md:194-199] [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/spec.md:231-233]
2. `003/plan.md` and `003/tasks.md` similarly stop at atomic writes and benchmark validation; they do not schedule a corruption bootstrap scenario. [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/plan.md:125-138] [SOURCE: file:020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/tasks.md:47-63]
3. `004/spec.md` consumes `freshness` as input and invalidates cache entries on signature changes, but it never says what `buildSkillAdvisorBrief()` must do when freshness is already `stale`, `absent`, or `unavailable` for an already-running session. The plan/tasks likewise do not reserve work for a non-live migration path; they only model cache, subprocess, deleted-skill suppression, and generic fail-open. [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:103-137] [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md:166-191] [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/plan.md:123-149] [SOURCE: file:020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/tasks.md:45-79]

Wave-2 X7/X8 explicitly sharpen migration around generation-tagged snapshots, rename/delete suppression, and concurrent-session safety, so leaving non-live freshness posture implicit is weaker than the converged research contract. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md:23-30] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md:66-72]

### Verdict

This is still a **pre-implementation P1**, not a new P0. The graph-staleness signal exists; the missing piece is a precise rule preventing `004` from turning a stale graph snapshot into a fresh-looking cache hit.

### Proposed parent patch

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@ Pre-implementation patch queue for children 003-004
+- Patch child 003 before implementation:
+  - add an acceptance scenario for malformed or unreadable `.opencode/skill/.advisor-state/generation.json`;
+  - recovery must be explicit: recreate atomically or return `state: "unavailable"` with `diagnostics.reason`, but never reuse prior generation state silently.
+- Patch child 004 before implementation:
+  - when `freshness !== "live"`, exact-prompt cache reuse must not produce a fresh-looking result;
+  - `stale` may only surface through an explicit degraded/stale branch, while `absent` and `unavailable` must remain `fail_open` with `brief: null`;
+  - add one end-to-end migration acceptance scenario covering: stale graph detected -> cache bypass -> explicit degraded/fail-open outcome.
```

## Deep-dive 3 - P1: `007` still does not make Copilot proof a merge gate

### Re-check against child scaffold

The gap is narrower than it first looked, but it is still real:

1. `007/spec.md` correctly says the adapter must **prefer SDK `onUserPromptSubmitted` when available** and must **not** treat `{}` notification success as proof. But those are transport rules, not a release gate; no P0 requirement says the child must ship with a checked-in proof artifact or else fall back to wrapper-by-default. [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md:95-101] [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md:143-150] [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md:188-190]
2. `007/plan.md` makes `Copilot SDK capability captured for repo runtime version` part of Definition of Ready, which is useful, but still weaker than a spec-level acceptance gate. [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/plan.md:47-60]
3. `007/tasks.md` includes `T003 Capture / confirm Copilot SDK capability for shipped runtime version`, but again as setup work rather than as a merge-blocking acceptance criterion. [SOURCE: file:020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/tasks.md:32-38]

Wave-2 X3 is explicit that the checked-in wrapper is notification-only today and that the SDK path must be proven rather than assumed. That means the current child is still one patch away from turning a research caveat into an enforceable rollout contract. [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md:9-13] [SOURCE: file:research/020-skill-advisor-hook-surface-pt-02/research-extended.md:50-52]

### Verdict

This is the highest-impact remaining runtime P1 because it can otherwise let `007` "pass" on adapter plumbing while leaving the repo-supported Copilot surface unproven.

### Proposed parent patch

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@ Pre-implementation patch queue for child 007
+- Promote Copilot transport proof to a P0 merge gate:
+  - the default SDK path is allowed only after a checked-in fixture or captured runtime artifact proves that the repo-supported Copilot version exposes model-visible `onUserPromptSubmitted` `additionalContext`;
+  - notification-only `{}` is never sufficient evidence;
+  - if proof is absent, the wrapper path becomes the documented default and child 009 must publish the capability matrix + version floor.
```

## Deprioritized, still-open P1s

These remain open but were **not** selected for the top-three deep dive because their blast radius is lower than the items above:

1. `005` supplemental fixtures for skip/adversarial prompt classes. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-004.md:30-49]
2. `005` observability schema / threshold tightening. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-006.md:20-30]
3. `008` `PostToolUse` and dual-channel precedence patches. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md:22-25] [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-005.md:24-28]
4. `009` validation/manual-playbook scope patch. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md:24-25]
5. Hook-state / Copilot-wrapper privacy wording. [SOURCE: file:research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-009.md:22-26]

## Novelty assessment

No architecture was reopened, no new children are justified, and no new blocker class surfaced. The net-new value from iteration 011 is the **parent-ready patch text** above, not additional discovery. That is why `newInfoRatio` drops to **0.04** while the status remains **in_progress** pending final convergence handling.
