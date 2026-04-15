---
title: "Decision Record: Save Flow Planner-First Trim"
description: "Architecture decisions for packet 015's planner-first `/memory:save` refactor and hot-path trimming strategy."
trigger_phrases:
  - "015-save-flow-planner-first-trim"
  - "decision record"
  - "planner-first save"
  - "save flow trim"
  - "adr"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored Level 3 docs scaffold from 014 research findings"
    next_safe_action: "Review packet; run 3 transcript prototypes"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-save-flow-planner-first-trim-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Save Flow Planner-First Trim

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Planner-first output contract for `/memory:save`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-15 |
| **Deciders** | Operator review pending, cli-codex packet author |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 014 showed that the default save path already has enough information to tell the AI what canonical doc to edit, what legality checks apply, and what follow-up actions remain. The dry-run surface in `memory-save.ts` returns validation, quality, template-contract, and sufficiency information, but the default path still proceeds into a much heavier automation stack instead of exposing that plan directly.

### Constraints

- The default planner path must be non-mutating.
- The planner response must express the same target and legality state the fallback path would use.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Make planner output the default `/memory:save` behavior and require a structured response that names route category, target doc, target anchor, merge mode, hard blockers, continuity payload, and follow-up actions.

**How it works**: `memory-save.ts` will still compute canonical prep information, but it will stop short of mutation and return the plan to the AI. `generate-context.ts` and `/memory:save` docs will treat the explicit full-auto fallback as a separate operator choice rather than the default.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Planner-first default** | Makes save intent reviewable, reduces hot-path work, keeps AI in control of canonical edits | Requires a new stable response schema | 9/10 |
| Keep current full-auto default | No operator workflow change | Preserves over-engineered default-path cost and optional network dependencies | 5/10 |
| Replace the entire save stack with a new planner service | Clean break | Rebuilds proven safety logic and expands packet scope | 3/10 |

**Why this one**: It preserves the proven write core while removing the default-path work that 014 already classified as non-essential.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Pros**:
- Operators and AIs can inspect the intended canonical edit before mutation.
- The default path becomes cheaper and more deterministic.

**Cons**:
- Runtime and CLI code must agree on a new response schema. Mitigation: shared types plus handler and CLI tests.
- Operators who want one-shot automation now need an explicit fallback mode. Mitigation: document the fallback clearly.

**Neutral**:
- The canonical atomic writer remains in the codebase, but it stops being the default operator experience.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Planner output misses a field needed for safe edits | H | Lock the schema in shared types and transcript prototypes |
| Planner and fallback target selection diverge | H | Reuse canonical prep data for both modes |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 014 concluded the current default path is heavier than the remaining contract |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives included keep-as-is and full redesign |
| 3 | **Sufficient?** | PASS | Reuses current dry-run and canonical prep rather than rebuilding save logic |
| 4 | **Fits Goal?** | PASS | Directly implements the planner-first recommendation |
| 5 | **Open Horizons?** | PASS | Leaves fallback automation intact for operators who still need it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `handlers/memory-save.ts`, `handlers/save/types.ts`, `handlers/save/response-builder.ts`, and `handlers/save/validation-responses.ts`
- `scripts/memory/generate-context.ts` and `.opencode/command/memory/save.md`

**Related ADRs**: ADR-002, ADR-004, ADR-005

**How to roll back**: Restore full-auto mode as the default entry path while keeping the planner schema types dormant.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Keep reconsolidation-on-save behind an explicit opt-in flag

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-15 |
| **Deciders** | Operator review pending, cli-codex packet author |

---

### Context

`reconsolidation-bridge.ts` depends on explicit flags, embeddings, and checkpoints, then often degrades to warnings and continues normal save creation. Packet 014 judged that behavior disproportionate for the default save path, but it still has some maintenance value when operators explicitly want duplicate consolidation.

### Constraints

- Same-path lineage and supersede semantics still matter.
- Explicit opt-in behavior must be documented in runtime flags and command docs.

---

### Decision

**We chose**: Remove reconsolidation from the default save path and keep it available only behind an explicit opt-in fallback flag.

**How it works**: Planner mode will surface reconsolidation as an optional follow-up or fallback capability. `reconsolidation-bridge.ts` remains callable, but default saves do not invoke it automatically.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in reconsolidation** | Preserves advanced behavior without taxing every save | Adds flag and doc complexity | 8/10 |
| Keep reconsolidation-on-save by default | No behavior change for current users | Keeps checkpoint and embedding requirements on every save | 4/10 |
| Delete reconsolidation entirely | Simplest runtime path | Removes a capability some operators may still want | 5/10 |

**Why this one**: It trims the hot path without turning a niche but useful maintenance feature into permanent dead code.

---

### Consequences

**Pros**:
- Default saves no longer depend on reconsolidation readiness.
- Operators still have an escape hatch when they explicitly want duplicate consolidation.

**Cons**:
- Operators must know when to ask for reconsolidation. Mitigation: show the option in planner follow-ups and docs.
- Tests must now cover both default-off and explicit-on behavior. Mitigation: keep focused reconsolidation bridge tests.

**Neutral**:
- Same-path identity remains preserved by the canonical core, independent of reconsolidation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flag naming drifts between docs and runtime | M | Centralize flag names in `search-flags.ts` and `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` |
| Operators forget the feature still exists | M | Surface reconsolidation as an explicit planner follow-up when relevant |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 014 classified reconsolidation-on-save as over-engineered |
| 2 | **Beyond Local Maxima?** | PASS | Compared default-on, opt-in, and delete-entirely paths |
| 3 | **Sufficient?** | PASS | Keeps the feature without keeping it in the hot path |
| 4 | **Fits Goal?** | PASS | Directly supports planner-first trim |
| 5 | **Open Horizons?** | PASS | Leaves room for future standalone maintenance workflows |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `handlers/save/reconsolidation-bridge.ts`
- `mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- reconsolidation test files

**Related ADRs**: ADR-001, ADR-003

**How to roll back**: Restore the previous default call site in `memory-save.ts` while keeping explicit flags documented.

---

### ADR-003: Defer post-insert enrichment bundle to standalone or explicit follow-up commands

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-15 |
| **Deciders** | Operator review pending, cli-codex packet author |

---

### Context

`post-insert.ts` sequentially runs causal links, entity extraction, summaries, entity linking, and graph lifecycle, but each step is already flag-guarded and wrapped to avoid blocking the save. That design means the enrichment bundle is optional by construction and is a poor fit for the default hot path.

### Constraints

- Causal links and graph richness may still matter later.
- Deferred work must be visible, not silently skipped.

---

### Decision

**We chose**: Remove post-insert enrichment from the default save path and represent it as explicit follow-up work or standalone maintenance commands.

**How it works**: Planner output will call out enrichment opportunities, while fallback or separate maintenance workflows can still invoke the bundle deliberately when search or graph richness is worth the cost.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit follow-up or standalone enrichment** | Matches current optional behavior and trims latency | Requires explicit operator awareness | 9/10 |
| Keep enrichment on every save | Immediate graph richness | Preserves long hot-path work that already tolerates failure | 4/10 |
| Keep only one enrichment step on the default path | Partial compromise | Hard to justify which step is special and why | 6/10 |

**Why this one**: The bundle is already optional by construction, so making that explicit aligns the runtime with reality.

---

### Consequences

**Pros**:
- Default save latency and complexity drop immediately.
- Operators can choose enrichment only when graph or search richness matters.

**Cons**:
- Immediate graph richness may arrive later. Mitigation: planner follow-up actions make that tradeoff explicit.
- Separate commands or fallback flags need documentation and tests. Mitigation: track them as M4 tasks.

**Neutral**:
- The canonical write core remains unchanged because enrichment was never its safety mechanism.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operators assume graph richness is immediate after save | M | Show enrichment as an explicit follow-up in planner output |
| Standalone enrichment workflows drift from save semantics | M | Keep enrichment entry points adjacent to existing save ownership files |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 014 classified post-insert enrichment as over-engineered |
| 2 | **Beyond Local Maxima?** | PASS | Compared default-on, partial retention, and explicit follow-up designs |
| 3 | **Sufficient?** | PASS | Uses the bundle only when its optional value is wanted |
| 4 | **Fits Goal?** | PASS | Directly removes non-safety work from the default path |
| 5 | **Open Horizons?** | PASS | Preserves later enrichment workflows without blocking save correctness |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `handlers/save/post-insert.ts`
- `scripts/core/workflow.ts`
- `api/indexing.ts` or other explicit follow-up entry points

**Related ADRs**: ADR-002, ADR-004

**How to roll back**: Restore the post-insert invocation in the default path and remove the new follow-up-only guidance.

---

### ADR-004: Keep the content-router category contract, trim Tier 2 and Tier 3 scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-15 |
| **Deciders** | Operator review pending, cli-codex packet author |

---

### Context

Packet 014 concluded that the eight-category content-router contract still earns its keep, but the current classifier stack is oversized for the simplified post-memory-folder save problem. Tier 1 already handles structured cases, Tier 2 relies on a frozen prototype library, and Tier 3 adds live model dependency and fallback behavior that is no longer justified on every save.

### Constraints

- Category names and target mapping must remain stable.
- Default behavior should stay deterministic and reviewable.

---

### Decision

**We chose**: Keep the eight canonical routing categories and deterministic Tier 1 or Tier 2 behavior, while removing Tier 3 from the default path and trimming Tier 2 to only the remaining useful coverage.

**How it works**: `content-router.ts` will keep category-to-target mapping untouched. The classifier stack changes only in scope: Tier 3 becomes explicit opt-in, and Tier 2 is reduced to the remaining cases that still earn deterministic prototype matching.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep categories, trim classifier scope** | Preserves target authority and reduces default complexity | Requires transcript validation to prove parity | 9/10 |
| Keep all three tiers as-is | No routing behavior change | Keeps live model dependency and broader prototype library on every save | 4/10 |
| Replace router with a smaller handcrafted rule set only | Maximum determinism | Risks losing nuanced category coverage without transcript proof | 6/10 |

**Why this one**: It preserves the part the research still values while trimming the part it called over-fitted.

---

### Consequences

**Pros**:
- The canonical target contract remains stable.
- Default routing becomes more deterministic and easier to reason about.

**Cons**:
- Some borderline cases may need manual review more often. Mitigation: test against real transcripts before implementation starts.
- Tier 2 trimming may need careful prototype curation. Mitigation: keep transcript mismatches as explicit backlog if needed.

**Neutral**:
- Route overrides and audit behavior remain part of the router contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tier 2 trimming drops a needed category example | M | Compare against transcript prototypes and keep a documented backlog |
| Operators misread warnings as hard failures | M | Keep clear planner wording for advisory routing warnings |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 014 kept the category contract but flagged the classifier stack as oversized |
| 2 | **Beyond Local Maxima?** | PASS | Compared keep-all, trim-scope, and rules-only paths |
| 3 | **Sufficient?** | PASS | Changes only classifier participation, not target mapping |
| 4 | **Fits Goal?** | PASS | Supports planner-first determinism |
| 5 | **Open Horizons?** | PASS | Leaves room for optional Tier 3 or expanded Tier 2 later if evidence supports it |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `lib/routing/content-router.ts`
- `lib/routing/routing-prototypes.json`
- `mcp_server/tests/content-router.vitest.ts`, `runtime-routing.vitest.ts`, `intent-routing.vitest.ts`

**Related ADRs**: ADR-001, ADR-003, ADR-005

**How to roll back**: Restore the prior router thresholds and default Tier 3 participation while keeping the category map unchanged.

---

### ADR-005: Retire quality-loop auto-fix from the default path while keeping hard checks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-15 |
| **Deciders** | Operator review pending, cli-codex packet author |

---

### Context

The current save path mixes two concerns: hard legality checks that prevent malformed canonical writes, and score-heavy or auto-fix behavior that rewrites trigger phrases, anchors, or budget issues before the canonical pending-file promotion. Packet 014 judged that second part over-engineered for the remaining save contract.

### Constraints

- Hard legality checks must remain blocking.
- Advisory quality information should still be visible to operators and AIs.

---

### Decision

**We chose**: Keep structural and legality checks as hard blockers, but retire auto-fix retries from the default path and surface score-heavy quality findings as advisory planner output.

**How it works**: `save-quality-gate.ts` keeps structural validation and exception handling where it protects correctness. `quality-loop.ts` stops mutating content by default and instead reports quality issues that the AI or operator can address explicitly.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hard checks plus advisory quality** | Keeps correctness guarantees without surprise mutations | Operators may need to fix issues manually | 9/10 |
| Keep auto-fix retries on every save | Maximum automation | Preserves hot-path mutations the research no longer supports | 4/10 |
| Remove both hard checks and auto-fix | Simplest runtime path | Unsafe for canonical docs | 1/10 |

**Why this one**: It cleanly separates correctness from convenience and matches the planner-first model.

---

### Consequences

**Pros**:
- Canonical save safety rules remain intact.
- Operators get explicit quality feedback without hidden content rewrites.

**Cons**:
- Some saves that previously auto-fixed trigger or anchor issues now require explicit edits. Mitigation: planner output should highlight the exact advisory issues.
- Quality-loop tests must be rewritten around advisory behavior. Mitigation: add targeted planner and quality-loop regressions.

**Neutral**:
- The quality-loop code may still exist for explicit opt-in or future maintenance contexts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operators confuse advisory issues with blockers | M | Separate blocker and advisory sections in the planner response |
| Doc wording continues to imply auto-fix on every save | M | Update command docs and env refs in the same milestone |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 014 specifically called the quality-loop auto-fix pipeline over-engineered |
| 2 | **Beyond Local Maxima?** | PASS | Compared advisory-only, keep-all, and remove-all paths |
| 3 | **Sufficient?** | PASS | Keeps only the rules that protect canonical correctness |
| 4 | **Fits Goal?** | PASS | Supports planner-first, reviewable save behavior |
| 5 | **Open Horizons?** | PASS | Leaves room for opt-in quality automation later |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `handlers/quality-loop.ts`
- `lib/validation/save-quality-gate.ts`
- quality and pipeline enforcement tests

**Related ADRs**: ADR-001, ADR-004

**How to roll back**: Restore the previous quality-loop default behavior and revert the planner response split between blockers and advisory quality.

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
