# Research Validation - Wave 3 Synthesis

## 1. Executive Summary

Wave-3 confirmed the **architecture, child ordering, and 8-child decomposition** from wave-1 and wave-2. No iteration justified an architecture re-open, no new child packets were warranted, and the train still reads as `002 -> 009`; the issues are contract-tightening and rollout-safety patches inside the existing scaffold, not decomposition failure. (per iter-001 summary and ruled-out directions; iter-002 summary; iter-003 P0 result; strategy "Ruled Out Directions")

Wave-3 also confirmed that the scaffold is **not ready for implementation as-is**. The one real P0 is child `005`: its replay gate is mathematically impossible because the stated `20 unique + 10 repeats` trace can only yield `33.3%` overall cache hits, not `>= 60%`. Iteration 013 explicitly re-checked the child packet and resolved the iteration-011 versus iteration-012 disagreement in favor of iteration-010's blocker call. (per iter-010 finding 1; iter-011 deep-dive 1; iter-012 P0 status; iter-013 executive assessment and deep-dive 1)

Overall verdict: **patch first, then implement**. The parent does not need to redesign the packet, but it should patch child `005` before any implementation starts and should patch several P1 contract gaps in `003/004/007/008/009` before dispatch so downstream teams are not implementing against ambiguous or under-proven runtime behavior. (per iter-011 executive assessment; iter-013 verdict; iter-001 ruled-out directions)

## 2. Per-Child Delta Table

| Child | Scaffold verdict | P0 findings | P1 findings | Dependency notes |
| --- | --- | --- | --- | --- |
| `002` | **ready** (per iter-001 comparison) | **0** - none. (per iter-001 row `002`) | **0** - none. (per iter-001 row `002`) | Upstream shared contract for `004`; no wave-3 patch requirement surfaced. (per iter-003 dependency graph) |
| `003` | **minor patches needed** | **0** - none. (per iter-002 P0 status; iter-003 P0 status) | **2** - freshness layer still blurs read-only probing with lifecycle/concurrency ownership; malformed or unreadable generation-counter recovery is not explicit. (per iter-002 finding 1; iter-008 finding 2) | `004` cache correctness depends on `003` freshness/signature output, so these fixes should land before producer work. (per iter-003 hidden non-linear edge 2; iter-013 deep-dive 2) |
| `004` | **minor patches needed** | **0** - none. (per iter-002 P0 status; iter-003 P0 status) | **3** - unsupported `semanticModeEnabled` / `60`-token floor drift remains; stale/degraded and non-live migration posture is still under-specified; null-brief / deleted-skill fail-open precision is still too loose. (per iter-002 finding 2; iter-007 findings 1-3; iter-012 deep-dive 1; iter-013 deep-dive 2) | Shared producer contract for `005-008`; if left loose, every runtime child inherits the wrong behavior surface. (per iter-003 dependency graph; iter-012 why-this-is-top-3) |
| `005` | **major revision needed** | **1** - replay hit-rate gate is mathematically impossible on the stated `20/10` trace. (per iter-010 finding 1; iter-013 deep-dive 1) | **4** - timing-budget target is below the lower bound implied by its own sample plan; corpus misses skip-policy and X5 prompt-poisoning fixtures; observability thresholds/schema/metric-dimension contract are still incomplete; type ownership with `004` must stay one-way. (per iter-010 finding 2; iter-004 findings 1-2; iter-006 findings 1-3; iter-003 finding 1) | Hard gate before `006/007/008`; also consumes `AdvisorHookResult` from `004`, so `004` owns types and `005` must stay a consumer. (per iter-003 dependency graph and finding 1; iter-013 verdict) |
| `006` | **ready** | **0** - none. (per iter-001 row `006`; iter-002 row `006`) | **0** - no P1 surfaced; only a deferred reconnect/replay edge case remained. (per iter-005 P2 finding 1) | Depends on `005`; serves as parity baseline for `007`. (per iter-003 dependency graph) |
| `007` | **minor patches needed** | **0** - none. (per iter-002 P0 status; iter-003 P0 status) | **4** - Copilot SDK proof is not yet a merge gate; Gemini schema-version variance is not turned into a fixture matrix; non-error `brief: null` / malformed-payload no-op behavior is still under-specified; wrapper-path privacy is too light. (per iter-002 finding 3; iter-005 findings 1-2; iter-007 finding 4; iter-009 finding 2; iter-013 deep-dive 3) | Downstream of `006`; `008` extends the parity file `007` creates, so `008` is not truly parallel with `007`. (per iter-003 hidden non-linear edge 3; iter-002 P2 finding 1) |
| `008` | **minor patches needed** | **0** - none. (per iter-002 P0 status; iter-003 P0 status) | **3** - wave-2 `PostToolUse` audit/repair slice is missing; stdin-versus-argv precedence is undefined when both are present; runtime-policy/fixture surface is still too thin for the documented edge cases. (per iter-001 finding 1; iter-005 findings 3-4; iter-012 deep-dive 3; iter-013 deprioritized P1s) | Depends on `007` in practice because it extends `advisor-runtime-parity.vitest.ts`; evidence from this child also feeds `009`. (per iter-003 finding 2; iter-002 row `008`; iter-003 dependency graph) |
| `009` | **minor patches needed** | **0** - none. (per iter-001 summary; iter-002 P0 status) | **2** - release contract still omits explicit validation/manual-playbook deliverables; privacy wording is still incomplete around hook-state persistence and Copilot wrapper prompt artifacts. (per iter-001 finding 2; iter-002 finding 5; iter-009 findings 1-2) | Final downstream doc/release contract for `006/007/008`; should absorb evidence produced by the runtime children instead of substituting line-count gates. (per iter-002 row `009`; iter-006 table row "Observability runbook in 009") |

## 3. Severity-Tagged Action List

### P0 (blocks implementation)

1. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md`** to replace the impossible `REQ-006` replay gate with a mathematically consistent rule, and restate that the `<= 50 ms` latency gate is **cache-hit-only** rather than an all-lanes budget. This is P0 because the current spec defines an unsatisfiable hard gate. (per iter-010 finding 1 and concrete corrections; iter-013 deep-dive 1)
2. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/plan.md`** so Definition of Done and Phase 4 use the same corrected replay metric and a realistic wall-clock target for the stated four-lane timing suite. This is part of the same blocker because the impossible gate is duplicated in the plan. (per iter-010 finding 2; iter-011 deep-dive 1; iter-013 deep-dive 1)
3. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/tasks.md`** so `T021`, `T028`, and the completion criteria no longer require `>= 60%` hits on the `20 unique + 10 repeats` replay. This is also blocking because the task list currently operationalizes the unsatisfiable requirement. (per iter-010 finding 1; iter-011 deep-dive 1; iter-013 deep-dive 1)

### P1 (should patch pre-impl)

1. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/spec.md`** to add an explicit acceptance path for malformed or unreadable `.advisor-state/generation.json`, with recovery that recreates atomically or returns `state: "unavailable"` and diagnostics, but never silently reuses stale generation state. This is P1 because migration bootstrap otherwise stays ambiguous. (per iter-008 finding 2; iter-011 deep-dive 2; iter-013 deep-dive 2)
2. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md`** to remove unsupported `semanticModeEnabled` / `60`-token-floor scope, and to pin non-live freshness behavior for stale, absent, unavailable, deleted-skill, and `SIGNAL_KILLED` branches. This is P1 because `004` is upstream of every runtime child and wave-3 repeatedly found contract drift here. (per iter-002 finding 2; iter-007 findings 1-3; iter-012 deep-dive 1; iter-013 deep-dive 2)
3. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md`** to add supplemental skip-policy fixtures and wave-2 X5 prompt-poisoning fixtures, rather than relying only on the 200-prompt fire-path corpus. This is P1 because the child remains the rollout gate, but its evidence set is incomplete. (per iter-004 findings 1-2)
4. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md`** again to tighten the observability contract: exact JSONL record shape, per-metric label catalog, and alert-threshold assertions. This is P1 because the minimum observability floor exists, but the operator-facing contract is still loose enough to drift across implementations. (per iter-006 findings 1-3)
5. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md`** to make Copilot model-visible SDK proof a merge gate with a documented runtime/version floor, and to add an explicit Gemini schema-version fixture matrix. This is P1 because the current child can otherwise "pass" on transport plumbing without proving the shipped Copilot path. (per iter-002 finding 3; iter-005 findings 1-2; iter-011 deep-dive 3; iter-013 deep-dive 3)
6. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md`** to state that `brief: null` on an otherwise successful producer result yields no model-visible output, and that wrapper fallback must not log or persist the rewritten prompt artifact. This is P1 because wave-3 found both correctness and privacy gaps on that fallback path. (per iter-007 finding 4; iter-009 finding 2)
7. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/spec.md`** to add the missing `PostToolUse` audit/repair slice and define precedence when both stdin and argv are present with different content. This is P1 because wave-2 already settled the split, and parser ambiguity would make wrapper behavior nondeterministic. (per iter-001 finding 1; iter-005 finding 3; iter-012 deep-dive 3)
8. **Patch `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract/spec.md`** to add explicit validation/manual-playbook deliverables and to publish prompt-artifact privacy rules for hook-state persistence and Copilot wrapper fallback. This is P1 because the release child still under-specifies proof artifacts and privacy wording. (per iter-001 finding 2; iter-002 finding 5; iter-009 findings 1-2)

### P2 (defer / accept)

1. **Defer `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring/spec.md` reconnect/replay coverage** to a follow-up packet or late pre-release pass. Wave-3 found the gap, but it did not rise above P2 because the adapter is advice-only and already fail-open. (per iter-005 P2 finding 1)
2. **Defer optional `session-prime` cleanup in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/spec.md`** until after the required `UserPromptSubmit` / `PreToolUse` / `PostToolUse` split is patched. It is scope drift, but not the main contract hole. (per iter-001 P2 finding 2; iter-012 deep-dive 3)
3. **Accept the current 100% top-1 parity threshold in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md` for the existing 200 fire-path corpus**, but keep skip/adversarial prompts in separate outcome-class fixtures instead of weakening parity. This is P2 because the threshold itself is not the realism problem; scope completeness is. (per iter-004 P2 finding 1)
4. **Optionally restate the cache-only, no-live-network invariant in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md`** when the child is next revised. Wave-3 marked it as a useful guardrail, but not a blocker for the first implementation wave because no child currently adds prompt-time network I/O. (per iter-007 P2 finding 1)

## 4. V1-V10 Coverage

1. **V1** - Gap analysis found no decomposition break, but it surfaced the missing Codex `PostToolUse` slice and missing release-validation/manual-playbook scope; highest severity **P1**. (primary: iter-001)
2. **V2** - Risk-hotspot pass kept the train acyclic and concentrated the biggest risks in `004`, `007`, `008`, and `009`; highest severity **P1**. (primary: iter-002)
3. **V3** - Dependency-cycle pass found no true cycle, but it exposed the `004 -> 005` type-ownership seam and `007 -> 008` hidden file-ownership dependency; highest severity **P1**. (primary: iter-003)
4. **V4** - Corpus-adequacy pass showed the 200-prompt set is balanced but incomplete for skip-policy and X5 adversarial coverage; highest severity **P1**. (primary: iter-004)
5. **V5** - Runtime-edge-case pass found missing Gemini schema-version coverage, Copilot SDK version-floor proof, and Codex dual-input precedence; highest severity **P1**. (primary: iter-005)
6. **V6** - Observability pass confirmed the metric floor exists, but exact thresholds, JSONL schema, and metric-dimension contracts are still thin; highest severity **P1**. (primary: iter-006)
7. **V7** - Fail-open audit confirmed the contract shape, but found stale/degraded reuse, freshness mapping, and explicit null-brief no-op gaps outside Claude; highest severity **P1**. (primary: iter-007)
8. **V8** - Migration pass confirmed rename/delete handling, but found stale-freshness producer posture and corrupted generation-counter recovery under-specified; highest severity **P1**. (primary: iter-008)
9. **V9** - Privacy pass found no transport-level break, but hook-state persistence and Copilot wrapper prompt artifacts still lack explicit non-persistence rules; highest severity **P1**. (primary: iter-009)
10. **V10** - Hard-gate realism pass confirmed the cache-hit latency goal is workable, but found the one true blocker: the `005` replay hit-rate gate is impossible as written; highest severity **P0**. (primary: iter-010; re-confirmed by iter-013)

## 5. Cross-Reference with Wave-1 + Wave-2

### Confirmed

- Wave-3 confirmed wave-1 and wave-2 on the **shared architecture and 8-child packet shape**. The child train still holds, and no new child phases are needed. (per iter-001 ruled-out directions; iter-002 summary; iter-003 P0 result)
- Wave-3 confirmed wave-2's refinements around **Copilot proof requirements, Codex scope split, migration safety, and prompt-poisoning risk**. The open gaps are not new architecture; they are places where the child specs have not yet fully absorbed those wave-2 refinements. (per iter-004 finding 2; iter-005 finding 2; iter-008 finding 1; iter-012 deep dives 2-3; iter-013 deep dives 2-3)

### Added

- Wave-3 added one new blocker class that prior waves had not turned into a packet-level stop condition: **the `005` replay hit-rate gate is internally unsatisfiable across spec, plan, and tasks**. (per iter-010 finding 1; iter-011 deep-dive 1; iter-013 deep-dive 1)
- Wave-3 also added concrete pre-implementation patch text for the parent on `005`, `003/004`, and `007`, which earlier waves did not need because they were still deciding the architecture. (per iter-011 proposed parent patches; iter-012 proposed parent patches; iter-013 proposed parent patches)

### Clarified

- Wave-3 clarified that `008` is **not truly parallel-safe with `007`**, because it extends the parity file `007` creates. That is a sequencing clarification, not a dependency-cycle reversal. (per iter-002 P2 finding 1; iter-003 finding 2)
- Wave-3 clarified that `005` remains the **single rollout gate**, but its evidence set needs two separate corrections: one hard-gate math fix and several non-blocking contract/evidence fixes. (per iter-004 findings 1-2; iter-006 findings 1-3; iter-010 findings 1-2; iter-013 verdict)

### Refuted

- Wave-3 refuted the softer read in iteration 012 that no P0 remained open. Iteration 013's direct packet re-read confirmed iteration 010 was right: the `005` replay gate is still blocking. (per iter-012 P0 status; iter-013 executive assessment)
- Wave-3 refuted the idea that line-count-heavy documentation alone is enough for release readiness. `009` still needs validation/manual-playbook proof and privacy wording, not just a `>= 400 lines` reference doc. (per iter-002 finding 5; iter-009 findings 1-2)

## 6. Handoff Contract for 020 Parent

### Must-fix before implementation begins (P0)

1. Correct child `005` replay-hit math across **spec, plan, and tasks** so the hard gate is satisfiable. (per iter-010 finding 1; iter-013 deep-dive 1)

### Recommended-fix before implementation begins (P1)

1. Patch `003/004` so stale, absent, unavailable, deleted-skill, and corrupted-generation migration paths are explicit and cannot look "fresh" by accident. (per iter-008 findings 1-2; iter-013 deep-dive 2)
2. Patch `007` so Copilot SDK proof is a merge gate with a runtime/version floor, Gemini schema drift is fixture-backed, and wrapper fallback has explicit null-brief plus privacy rules. (per iter-005 findings 1-2; iter-007 finding 4; iter-009 finding 2; iter-013 deep-dive 3)
3. Patch `008` so Codex includes `PostToolUse` and deterministic stdin/argv precedence. (per iter-001 finding 1; iter-005 finding 3; iter-012 deep-dive 3)
4. Patch `009` so release validation/manual-playbook proof and prompt-artifact privacy rules are first-class deliverables. (per iter-001 finding 2; iter-002 finding 5; iter-009 findings 1-2)
5. Tighten `005` evidence coverage on skip/X5 fixtures and observability contract details after the P0 math fix lands. (per iter-004 findings 1-2; iter-006 findings 1-3)

### Accepted risks (P2)

1. Claude reconnect/replay duplicate-delivery semantics can wait until after the first implementation wave. (per iter-005 P2 finding 1)
2. Optional Codex `session-prime` scope cleanup can wait behind the required `PostToolUse` patch. (per iter-001 P2 finding 2)
3. The cache-only network invariant and parity-threshold wording are worth preserving, but they are not first-wave blockers. (per iter-004 P2 finding 1; iter-007 P2 finding 1)

## 7. Convergence Note

- **Converged at:** iter 13 / 20 budget. (per strategy "Max iterations"; deep-research-state iter 13 record)
- **Rolling average at stop:** `0.0367`, derived from iter 11-13 `newInfoRatio` values `0.04`, `0.04`, and `0.03`. (per deep-research-state iter 11-13 records)
- **Questions answered:** 10 / 10. (per deep-research-state iter 10-13 records; strategy key-question list)
- **Coverage:** all 10 V-angles were covered. (per iterations 001-010 focus fields; strategy key-question list)
- **Why early convergence was legitimate:** iterations 011-013 did not reopen architecture or add a new blocker class; they only deepened the already-known `005` P0 and converted the highest-blast-radius P1s into parent-ready patch text. That is exactly the low-novelty, high-closure pattern the convergence rule was meant to stop on. (per iter-011 novelty assessment; iter-012 net effect on convergence; iter-013 novelty and convergence note)
