---
title: "Gate C — Writer Ready"
description: "Gate C ADR set for the canonical writer boundaries, validator ordering, classifier fallback, rollback-safe writer guardrails, and continuity schema."
trigger_phrases: ["gate c", "writer ready", "decision record", "phase 018", "continuity"]
importance_tier: "critical"
contextType: "implementation"
level: "3+"
status: complete
closed_by_commit: TBD
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Accepted Gate C ADR set during the completion pass"
    next_safe_action: "Keep Gate C ADRs bundled with the final packet docs"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/decision-record.md"]
---
<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Gate C — Writer Ready
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate C Writer-Ready Architectural Decisions

A single compound decision record carrying the five architectural choices needed to ship the Gate C writer path. Each sub-decision preserves its original context, alternatives, and consequences.

### Metadata (shared)

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Gate** | C |
| **Date** | 2026-04-11 |
| **Status** | Accepted |

---

### Sub-decision 1: Four new writer modules

**Deciders**: Packet owner, runtime owner, validation reviewer | **Status**: Accepted | **Date**: 2026-04-11

<!-- ANCHOR:adr-001-context -->
### Context

`memory-save.ts` is already the only XL file in the packet (resource-map F-4, row B1). If Gate C pushes router, merge, continuity, and atomic index logic back into that file, the refactor becomes unreviewable and the pass-through/adapt/rewrite model from `../scratch/resource-map/02-handlers.md` collapses.

**Constraints**:
- Keep `withSpecFolderLock` unchanged.
- Match iteration 001's four-component boundary and row B1/C1/C10/D1 dependencies.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `contentRouter`, `anchorMergeOperation`, `thinContinuityRecord`, and `atomicIndexMemory` as first-class modules instead of inline helpers.

**How it works**: `memory-save.ts` becomes an orchestrator over these modules. `generate-context.ts`, save helpers, and template rollout adapt to the same public contracts.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four-module split** | Reviewable, testable, aligns with iterations 001/023 | More file churn up front | 9/10 |
| Inline rewrite | Fewer files | Preserves XL blast radius and hides ownership | 4/10 |

**Why this one**: The packet research is already organized around these four components. Reusing that boundary lowers risk and makes multi-agent ownership possible.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Writer behavior becomes testable per module instead of only through end-to-end fixtures.
- Gate C can parallelize validator, merge, router, and shadow workstreams safely.

**What it costs**:
- More coordination across files. Mitigation: explicit workstream ownership in `plan.md`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Contracts drift between modules | H | Freeze types/schema before the XL rewrite starts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Row B1 is already XL |
| 2 | **Beyond Local Maxima?** | PASS | Inline rewrite was rejected |
| 3 | **Sufficient?** | PASS | Four components cover the unique design work |
| 4 | **Fits Goal?** | PASS | Matches Gate C critical path |
| 5 | **Open Horizons?** | PASS | Leaves Gate D reader work decoupled |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New routing, merge, validation, and atomic-index modules land before `memory-save.ts` is rewritten.
- Save helpers and generator wrappers consume those modules instead of duplicating behavior.

**How to roll back**: Disable the new writer via the feature flag, restore the pre-refactor writer path, and keep the legacy save route authoritative.
<!-- /ANCHOR:adr-001-impl -->

---

---

### Sub-decision 2: Tier 3 classifier uses a strict JSON LLM contract

**Deciders**: Runtime owner, routing owner, QA reviewer | **Status**: Accepted | **Date**: 2026-04-11

### Context

Tier 1 rules and Tier 2 prototypes cover most chunks, but iteration 031 shows a stubborn ambiguous slice: mixed progress/delivery prose, decision-vs-research language, and wrapper fragments that still carry signal. Gate C needs a rare-path classifier that prevents silent misroutes without turning every save into an LLM call.

**Constraints**:
- Keep Tier 3 rare, deterministic, and bounded.
- Never invent categories, anchors, or merge modes outside the approved eight-category/five-mode contract.

---

### Decision

**We chose**: a `gpt-5.4` low-reasoning, `temperature: 0`, strict-JSON classifier with `max_output_tokens: 200` and `timeout_ms: 2000`.

**How it works**: Tier 3 sees one normalized chunk plus Tier 1/Tier 2 evidence, returns one of the eight categories, and refuses below `0.50` confidence. Fallback is Tier 2 top-1 with a penalty, not uncontrolled guessing.
See `../research/iterations/iteration-031.md` section 3 "Prompt template" and section 4 "Response schema" for the frozen prompt text and JSON output shape.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Strict JSON Tier 3** | Bounded cost, auditable, rare-path only | Adds provider dependency | 8/10 |
| Rules/prototypes only | No provider dependency | Higher misroute or over-refusal rate | 6/10 |
| LLM-first routing | Flexible | Too slow, too expensive, too opaque | 3/10 |

**Why this one**: It keeps the common case cheap and deterministic while still giving ambiguous chunks a safe final arbiter.

---

### Consequences

**What improves**:
- Ambiguous chunks get a controlled escalation path.
- The routing audit reducer can compare Tier 3 outcomes against Tier 2 alternatives.

**What it costs**:
- Provider outage handling is required. Mitigation: penalized Tier 2 fallback plus refusal.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Malformed JSON or slow responses | M | One repair retry, then refuse and log |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iter 031 defines the rare-path need |
| 2 | **Beyond Local Maxima?** | PASS | Considered rules-only and LLM-first |
| 3 | **Sufficient?** | PASS | 8 categories, 5 modes, strict schema |
| 4 | **Fits Goal?** | PASS | Solves misroute risk, not general authoring |
| 5 | **Open Horizons?** | PASS | Cached and versioned prompt contract |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `contentRouter` gains Tier 3 prompt/versioning, response parsing, cache keys, and refusal behavior.
- Schemas and telemetry gain route confidence, alternatives, and decision latency fields.

**How to roll back**: Disable Tier 3 calls, fall back to Tier 2 plus refusal, and keep Gate C non-serving until classifier health recovers.

---

### Sub-decision 3: The validator bridge enforces ordered, fail-closed writer rules

**Deciders**: Validation owner, runtime owner, packet owner | **Status**: Accepted | **Date**: 2026-04-11

### Context

The current shell validator does not understand continuity blocks, merge legality, cross-anchor contamination, or post-save fingerprint safety. Iteration 022 already names the rule order and error families; Gate C needs that contract frozen before merge logic exists.

**Constraints**:
- Keep `validate.sh` as the public surface.
- Separate static validity from write-time safety and short-circuit on structural hard-fails.

---

### Decision

**We chose**: a Node-backed `spec-doc-structure.ts` bridge behind `validate.sh`, ordered as `ANCHORS_VALID -> FRONTMATTER_MEMORY_BLOCK -> MERGE_LEGALITY -> SPEC_DOC_SUFFICIENCY -> CROSS_ANCHOR_CONTAMINATION -> POST_SAVE_FINGERPRINT`.

**How it works**: `validate.sh` remains the orchestrator, but YAML parsing, merge simulation, prototype checks, and hashing all move into TypeScript where the logic is testable and reusable by the save pipeline itself.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Node bridge with ordered rules** | Reusable and precise | New module required | 9/10 |
| Bash-only expansion | No new runtime surface | Hard to test and too brittle | 4/10 |
| One mega save-time rule | Fewer names | No selective validation or debug hooks | 5/10 |

**Why this one**: The same logic has to power folder validation, save-time dry runs, and debug entrypoints. A reusable bridge is the only sustainable fit.

---

### Consequences

**What improves**:
- Rule results are explicit, code-scoped, and fixture-friendly.
- `validate.sh` can expose targeted debug hooks like `--merge-plan` and `--post-save`.

**What it costs**:
- The validator contract becomes a runtime dependency. Mitigation: ship fixtures and keep the shell wrapper thin.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rule ordering drifts between shell and TS | H | Treat iter 022 order as source-of-truth and test it directly |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gate C cannot prove merge safety otherwise |
| 2 | **Beyond Local Maxima?** | PASS | Compared Bash and monolithic alternatives |
| 3 | **Sufficient?** | PASS | Covers static and write-time checks |
| 4 | **Fits Goal?** | PASS | Directly protects canonical docs |
| 5 | **Open Horizons?** | PASS | Debug hooks stay available later |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- New validator module, fixture suites, and `validate.sh` rule/help updates.
- Save pipeline reuses the same legality, sufficiency, contamination, and fingerprint checks.

**How to roll back**: Keep the old shell rule surface, disable the new aliases, and block canonical writer promotion until the bridge is fixed.

---

### Sub-decision 4: Gate C keeps rollback-safe writer guardrails without observation-window state

**Deciders**: Incident commander, runtime owner, QA/on-call lead | **Status**: Accepted | **Date**: 2026-04-11

### Context

Gate C still needs auditable rollback-safe writer behavior. Iterations 032, 033, and 034 remain useful historical inputs for thresholds and rollback signals, but the live Phase 018 contract no longer carries an observation window, `shadow_only` state, or downstream promotion ladder.

**Constraints**:
- No observation window or `shadow_only` proving state is part of the live Gate C contract.
- Canonical writes must fail closed on routed validation, refusal, or rollback errors.
- Gate D and Gate E inherit packet-local evidence and rollback guarantees, not live proving-state transitions.

---

### Decision

**We chose**: rollback-safe writer guardrails centered on routed validation, pending-route/manual-review refusal, and atomic promotion rollback, without separate proof-mode state.

**How it works**: Gate C validates before promotion, routes low-confidence content to manual-review artifacts instead of guessing, and restores the original on-disk state when canonical promotion or indexing fails. Any later rollout controls belong to Gate E, not this packet.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rollback-safe writer guardrails** | Auditable, rollback-safe, aligned with the directive | Requires explicit test and validation coverage | 9/10 |
| Downstream promotion ladder | Familiar from research | Carries superseded rollout detail into Gate C docs | 3/10 |
| Direct canonical flip in Gate C | Faster on paper | Blurs Gate C and Gate E responsibilities | 2/10 |

**Why this one**: It keeps rollback visible, preserves manual-review refusal paths, and matches the current direction that Gate C ends on routed writer correctness rather than observation-era proving state.

---

### Consequences

**What improves**:
- Proof, rollback, and incident states remain auditable packet events instead of operator folklore.
- Parity, latency, and fingerprint alerts map directly to blocking handoff behavior.

**What it costs**:
- Rejection and rollback behavior must stay covered by targeted tests and strict validation. Mitigation: keep them in the Gate C completion subset.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing targeted rollback/refusal coverage blocks close | M | Gate C checklist requires live rejection-path tests and strict validation |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Canonical writes without rollback-safe guardrails are unsafe |
| 2 | **Beyond Local Maxima?** | PASS | Rejected staged rollout carry-over and direct flip options |
| 3 | **Sufficient?** | PASS | Validation, refusal, and rollback paths cover Gate C needs |
| 4 | **Fits Goal?** | PASS | Gate C closes on routed writer correctness, not rollout time |
| 5 | **Open Horizons?** | PASS | Later gates can add rollout controls without reviving old stage names |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Keep routed validation, refusal artifacts, and atomic rollback behavior wired to the canonical writer path.
- Verify rejection-path handling through targeted tests instead of a proving-state control plane.

**How to roll back**: Restore the original file state when a promoted canonical save is rejected or fails indexing, and keep the writer blocked until the underlying error is resolved.

---

### Sub-decision 5: `_memory.continuity` stays thin, 14 fields, 2KB, fail-closed

**Deciders**: Packet owner, validation owner, runtime owner | **Status**: Accepted | **Date**: 2026-04-11

### Context

Gate C has to roll `_memory.continuity` into every template surface without recreating the heavyweight narrative problem phase 018 is trying to remove. Iterations 005 and 024 define a 14-field compact block with strict normalization, coherence rules, and a 2048-byte ceiling.

**Constraints**:
- Keep continuity machine-owned and compact.
- Fresh writes must fail closed on malformed state even if legacy reads can hydrate defaults.

---

### Decision

**We chose**: the iter 005/024 `_memory.continuity` schema with `packet_pointer`, timestamps, actor, recent/next actions, blockers, key files, dedup state, completion, and open/answered questions, capped at 2KB after normalization.

**How it works**: The block lives in frontmatter, updates on every successful canonical save, rejects narrative sprawl, and uses `MEMORY_003` through `MEMORY_017` for field and budget failures.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Thin frontmatter block** | Single source of truth, fast resume | Needs strict validation | 9/10 |
| Larger narrative continuity block | More context in one place | Recreates the memory wrapper problem | 3/10 |
| Sidecar continuity files | Clean separation | Sync drift and file-count sprawl | 5/10 |

**Why this one**: It keeps continuity cheap to read, cheap to diff, and bounded enough that canonical narrative still lives in anchors, not metadata.

---

### Consequences

**What improves**:
- Resume and dedup get a stable, compact substrate.
- Templates can standardize continuity without inventing a new storage primitive.

**What it costs**:
- Writers must normalize before measuring size. Mitigation: `MEMORY_017` reports actual byte cost and heaviest fields.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Continuity grows back into prose | H | Reject multi-sentence or oversized payloads before write |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resume and dedup need compact state |
| 2 | **Beyond Local Maxima?** | PASS | Compared larger block and sidecar options |
| 3 | **Sufficient?** | PASS | 14 fields cover the needed continuity hints |
| 4 | **Fits Goal?** | PASS | Prevents narrative duplication |
| 5 | **Open Horizons?** | PASS | Leaves Gate D reader logic simple |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Template frontmatter, continuity validator, and save-time update logic all adopt the same 14-field contract.
- `generate-context.ts` and `memory-save.ts` treat the block as machine-owned state, not user-authored prose.

**How to roll back**: Stop new continuity writes, restore last-known-good frontmatter from snapshots or Git history, and keep legacy fallback available until the schema issue is fixed.
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3+ Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
