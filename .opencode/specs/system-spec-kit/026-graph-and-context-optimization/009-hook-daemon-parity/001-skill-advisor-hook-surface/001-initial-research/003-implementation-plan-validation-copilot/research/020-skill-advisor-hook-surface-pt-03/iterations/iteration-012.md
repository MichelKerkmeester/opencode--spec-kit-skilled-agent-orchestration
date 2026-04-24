# Iteration 12 - P0/P1 deep-dive

## Summary

No open **P0** finding survived iteration-001 through iteration-010. The scaffold remains implementable as `002 -> 009`; the remaining work is pre-implementation contract tightening. This pass adds **low novelty** and focuses on the three recurring **P1** gaps with the largest downstream blast radius: `004` producer drift, `007` Copilot proof gating, and `008` Codex post-tool coverage.

## Aggregate P0/P1 ledger from iteration-001 through iteration-010

### P0 status

- **No open P0 blockers.** Iteration-002 and iteration-003 explicitly conclude that the train is still acyclic and implementable, with only contract patches remaining.  
  **Citations:** `research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-002.md §Severity-tagged findings`, `research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-003.md §Hidden cycles / inverted-import risks`

### Open P1 findings still worth carrying

| Child | Recurring iterations | Current read | Status |
| --- | --- | --- | --- |
| `004-advisor-brief-producer-cache-policy` | 002, 004, 007 | Producer still carries unsupported `semanticModeEnabled` / `60`-token floor drift and underspecified stale/degraded branches. | **Open** |
| `007-gemini-copilot-hook-wiring` | 002, 005, 007 | Copilot model-visible transport proof exists in prose/setup tasks, but not as a hard P0 ship gate in the child contract. | **Open** |
| `008-codex-integration-and-hook-policy` | 001, 002, 005 | Codex child still omits the wave-2 `PostToolUse` audit/repair slice and leaves parser-precedence detail implicit. | **Open** |
| `009-documentation-and-release-contract` | 001, 002 | Manual playbook / validation artifact is still missing from the release child contract. | Open, secondary |
| `005-advisor-renderer-and-regression-harness` | 004, 006 | Supplemental skip/adversarial fixtures plus exact observability schema remain under-specified. | Open, secondary |
| `003-advisor-freshness-and-source-cache` | 002 | Freshness-vs-lifecycle ownership seam is still blurry, but it is less likely to block the first implementation wave than `004/007/008`. | Open, secondary |

## Top-3 deep dives

> Selection rule: no true P0 remained open, so this pass deep-dives the three **highest-impact P1s** instead.

### 1. P1 - `004` still over-specifies unsupported producer behavior

**Why this is top-3:** `004` is upstream of `005`, `006`, `007`, and `008`. If its producer contract is loose or wrong, every runtime child inherits the wrong result shape or semantics.

**Re-check of child packet**

- `004/spec.md §3 Scope` still exposes `semanticModeEnabled?: boolean` and `Token caps: 60 minimum, 80 default, 120 ambiguity/debug`, even though wave convergence only preserved exact-cache reuse plus `80/120` brief bands.  
- `004/spec.md §4.2 REQ-021-REQ-022`, `004/plan.md §4 Phase 4`, and `004/tasks.md Phase 3 T018` all continue to schedule that unsupported `60`-token / semantic-mode surface instead of retiring it before implementation.  
- `004/spec.md §8 Edge Cases` still leaves the stale/degraded path too implicit relative to the later validation findings on SQLite-busy reuse, deleted-skill suppression, and `brief: null` no-op parity.

**Wave cross-check**

- Wave-1 locks `004` to the core producer contract with `80/120` caps and optional exact cache, not a similarity/semantic branch.  
- Wave-2 sharpens `004` around normalization, metalinguistic suppression, deleted-skill fail-open behavior, and migration semantics; it does **not** reopen a semantic cache mode or a `60`-token floor.  
  **Citations:** `020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md §3 Scope`, `§4.2 REQ-021-REQ-022`, `§8 Edge Cases`; `020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/plan.md §4 Implementation Phases`; `020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/tasks.md Phase 3 T018-T020`; `research/020-skill-advisor-hook-surface-pt-01/research.md §Implementation Cluster Decomposition`; `research/020-skill-advisor-hook-surface-pt-02/research-extended.md §Wave-1 role | Wave-2 refinement`, `§X5`, `§X7`

**Proposed parent patch**

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@
- - [ ] 004-advisor-brief-producer-cache-policy (`buildSkillAdvisorBrief()` + prompt policy + HMAC exact cache + fail-open contract)
+ - [ ] 004-advisor-brief-producer-cache-policy (`buildSkillAdvisorBrief()` + prompt policy + HMAC exact cache + fail-open contract + exact `80/120` brief bands only; remove `semanticModeEnabled` / `60`-token floor before implementation; spell out stale/degraded reuse for SQLite-busy, deleted-skill suppression, and `brief: null` no-op parity)
```

### 2. P1 - `007` does not yet make Copilot transport proof a ship gate

**Why this is top-3:** `007` is the only child where the scaffold can "look done" while still failing the core wave-2 claim: that Copilot must prove a model-visible prompt-time path, not merely a notification path returning `{}`.

**Re-check of child packet**

- `007/spec.md §3.2 Copilot adapter` correctly says not to treat `{}` notification success as proof and says the SDK return-object path must be captured or fixture-checked before shipping the default path.  
- But `007/spec.md §4.1 REQ-003-REQ-004` only require "prefer SDK" and "fallback when unavailable"; they do **not** require a positive proof artifact or a minimum supported Copilot runtime / SDK floor before the child passes.  
- `007/plan.md §2 Definition of Ready` and `007/tasks.md Phase 1 T003` mention capability capture, but that proof remains a setup note rather than a P0 acceptance gate.

**Wave cross-check**

- Wave-2 X3 is explicit: the checked-in wrapper path is notification-only, while the upstream SDK path can still inject `additionalContext`. That means the implementation contract must gate ship/no-ship on model-visible proof, not just on adapter plumbing.  
- Wave-1 never settled this nuance, so the parent packet should absorb the wave-2 tightening before implementation dispatch.  
  **Citations:** `020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md §3.2 Copilot adapter`, `§4.1 REQ-003-REQ-004`, `§5 Acceptance Scenario 2`, `§5 Acceptance Scenario 6`; `020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/plan.md §2 Quality Gates`, `§4 Implementation Phases`; `020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/tasks.md Phase 1 T003`, `Phase 2 T014-T017`; `research/020-skill-advisor-hook-surface-pt-02/research-extended.md §Wave-1 role | Wave-2 refinement`, `§X3`

**Proposed parent patch**

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@
- - [ ] 007-gemini-copilot-hook-wiring (Gemini JSON `additionalContext` + Copilot SDK + wrapper fallback)
+ - [ ] 007-gemini-copilot-hook-wiring (Gemini JSON `additionalContext` + Copilot SDK + wrapper fallback; Copilot may ship the SDK path only after a committed proof artifact shows model-visible `additionalContext` for the supported runtime/version floor; notification-only `{}` does not satisfy this gate)
```

### 3. P1 - `008` still drops the wave-2 `PostToolUse` slice

**Why this is top-3:** `008` is the only runtime child whose current parent-facing bullet is already stale relative to the converged architecture. The omission is in both the child and the parent packet, so it can leak into implementation sequencing unless fixed now.

**Re-check of child packet**

- `008/spec.md §3 Scope` still covers `UserPromptSubmit`, dynamic hook-policy detection, Bash-only `PreToolUse` deny, and prompt-wrapper fallback, but not the post-side-effect `PostToolUse` audit/repair path.  
- `008/plan.md §4` and `008/tasks.md` phase breakdowns likewise stop at detector, prompt adapter, pre-tool deny, wrapper fallback, and parity extension.  
- `008/spec.md §10 Open Questions` even frames `PostToolUse` as a future-phase question, which contradicts the wave-2 decomposition that already settled it as part of the current child's contract.

**Wave cross-check**

- Wave-2 X4 narrowed Codex enforcement, but it did not remove `PostToolUse`; it explicitly split Codex into prompt-time advice (`UserPromptSubmit`), Bash-only `PreToolUse deny`, and `PostToolUse` audit/repair context.  
- Wave-1 parent decomposition is older and narrower; the wave-2 refinement is the stronger authority for this child now.  
  **Citations:** `020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/spec.md §3 Scope`, `§4.1 REQ-001-REQ-008`, `§10 Open Questions`; `020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/plan.md §4 Implementation Phases`; `020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/tasks.md Phase 2-3`; `research/020-skill-advisor-hook-surface-pt-02/research-extended.md §Wave-1 role | Wave-2 refinement`, `§X4`

**Proposed parent patch**

```diff
--- a/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
+++ b/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md
@@
- - [ ] 008-codex-integration-and-hook-policy (Codex `UserPromptSubmit` + dynamic hook-policy detection + Bash-only `PreToolUse deny`)
+ - [ ] 008-codex-integration-and-hook-policy (Codex `UserPromptSubmit` + dynamic hook-policy detection + Bash-only `PreToolUse deny` + `PostToolUse` audit/repair context; remove optional `session-prime` drift from the child before implementation dispatch)
```

## Net effect on convergence

- **New P0 surfaced:** 0
- **Still-open P1 worth carrying into pre-implementation patching:** 3 primary (`004`, `007`, `008`) + 3 secondary (`003`, `005`, `009`)
- **Recommendation:** treat this wave as **near-converged**. The remaining value is in patching the parent packet text before implementers start dispatching 004/007/008, not in reopening the child decomposition.
