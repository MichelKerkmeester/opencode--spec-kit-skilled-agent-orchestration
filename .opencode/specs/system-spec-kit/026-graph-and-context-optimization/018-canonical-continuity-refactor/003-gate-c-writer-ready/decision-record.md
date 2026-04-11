---
title: "Gate C — Writer Ready"
description: "Gate C ADR set for the canonical writer boundaries, validator ordering, classifier fallback, flag state machine, and continuity schema."
trigger_phrases:
  - "gate c"
  - "writer ready"
  - "decision record"
  - "phase 018"
  - "continuity"
importance_tier: "critical"
contextType: "implementation"
level: "3+"
gate: "C"
parent: "018-canonical-continuity-refactor"
---
# Decision Record: Gate C — Writer Ready

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the writer split into four new components

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-11 |
| **Deciders** | Packet owner, runtime owner, validation reviewer |

---

<!-- ANCHOR:adr-001-context -->
### Context

`memory-save.ts` is already the only XL file in the packet (resource-map F-4, row B1). If Gate C pushes router, merge, continuity, and atomic index logic back into that file, the refactor becomes unreviewable and the pass-through/adapt/rewrite model from `02-handlers.md` collapses.

### Constraints

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
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Tier 3 classifier uses a strict JSON LLM contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-11 |
| **Deciders** | Runtime owner, routing owner, QA reviewer |

---

<!-- ANCHOR:adr-002-context -->
### Context

Tier 1 rules and Tier 2 prototypes cover most chunks, but iteration 031 shows a stubborn ambiguous slice: mixed progress/delivery prose, decision-vs-research language, and wrapper fragments that still carry signal. Gate C needs a rare-path classifier that prevents silent misroutes without turning every save into an LLM call.

### Constraints

- Keep Tier 3 rare, deterministic, and bounded.
- Never invent categories, anchors, or merge modes outside the approved eight-category/five-mode contract.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a `gpt-5.4` low-reasoning, `temperature: 0`, strict-JSON classifier with `max_output_tokens: 200` and `timeout_ms: 2000`.

**How it works**: Tier 3 sees one normalized chunk plus Tier 1/Tier 2 evidence, returns one of the eight categories, and refuses below `0.50` confidence. Fallback is Tier 2 top-1 with a penalty, not uncontrolled guessing.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Strict JSON Tier 3** | Bounded cost, auditable, rare-path only | Adds provider dependency | 8/10 |
| Rules/prototypes only | No provider dependency | Higher misroute or over-refusal rate | 6/10 |
| LLM-first routing | Flexible | Too slow, too expensive, too opaque | 3/10 |

**Why this one**: It keeps the common case cheap and deterministic while still giving ambiguous chunks a safe final arbiter.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
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
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iter 031 defines the rare-path need |
| 2 | **Beyond Local Maxima?** | PASS | Considered rules-only and LLM-first |
| 3 | **Sufficient?** | PASS | 8 categories, 5 modes, strict schema |
| 4 | **Fits Goal?** | PASS | Solves misroute risk, not general authoring |
| 5 | **Open Horizons?** | PASS | Cached and versioned prompt contract |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `contentRouter` gains Tier 3 prompt/versioning, response parsing, cache keys, and refusal behavior.
- Schemas and telemetry gain route confidence, alternatives, and decision latency fields.

**How to roll back**: Disable Tier 3 calls, fall back to Tier 2 plus refusal, and keep Gate C in `shadow_only` until classifier health recovers.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The validator bridge enforces ordered, fail-closed writer rules

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-11 |
| **Deciders** | Validation owner, runtime owner, packet owner |

---

<!-- ANCHOR:adr-003-context -->
### Context

The current shell validator does not understand continuity blocks, merge legality, cross-anchor contamination, or post-save fingerprint safety. Iteration 022 already names the rule order and error families; Gate C needs that contract frozen before merge logic exists.

### Constraints

- Keep `validate.sh` as the public surface.
- Separate static validity from write-time safety and short-circuit on structural hard-fails.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: a Node-backed `spec-doc-structure.ts` bridge behind `validate.sh`, ordered as `ANCHORS_VALID -> FRONTMATTER_MEMORY_BLOCK -> MERGE_LEGALITY -> SPEC_DOC_SUFFICIENCY -> CROSS_ANCHOR_CONTAMINATION -> POST_SAVE_FINGERPRINT`.

**How it works**: `validate.sh` remains the orchestrator, but YAML parsing, merge simulation, prototype checks, and hashing all move into TypeScript where the logic is testable and reusable by the save pipeline itself.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Node bridge with ordered rules** | Reusable and precise | New module required | 9/10 |
| Bash-only expansion | No new runtime surface | Hard to test and too brittle | 4/10 |
| One mega save-time rule | Fewer names | No selective validation or debug hooks | 5/10 |

**Why this one**: The same logic has to power folder validation, save-time dry runs, and debug entrypoints. A reusable bridge is the only sustainable fit.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
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
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gate C cannot prove merge safety otherwise |
| 2 | **Beyond Local Maxima?** | PASS | Compared Bash and monolithic alternatives |
| 3 | **Sufficient?** | PASS | Covers static and write-time checks |
| 4 | **Fits Goal?** | PASS | Directly protects canonical docs |
| 5 | **Open Horizons?** | PASS | Debug hooks stay available later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New validator module, fixture suites, and `validate.sh` rule/help updates.
- Save pipeline reuses the same legality, sufficiency, contamination, and fingerprint checks.

**How to roll back**: Keep the old shell rule surface, disable the new aliases, and block canonical writer promotion until the bridge is fixed.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Gate C uses the iter 034 feature-flag state machine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-11 |
| **Deciders** | Incident commander, runtime owner, QA/on-call lead |

---

<!-- ANCHOR:adr-004-context -->
### Context

Shadow-only proving is not enough without an auditable control plane. Iterations 032, 033, and 034 define class-specific thresholds, rollback rules, and eight named states (`S0` through `S7`) that Gate C must follow so promotion and rollback are evidence-driven.

### Constraints

- Gate C only uses `S1 shadow_only`; it must not skip buckets.
- Correctness-loss incidents for `resume` and `trigger_match` must jump straight back to `S1`.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: the iter 034 SQLite-backed state machine with states `disabled`, `shadow_only`, `dual_write_10pct`, `dual_write_50pct`, `dual_write_100pct`, `canonical`, `legacy_cleanup`, and `rolled_back`.

**How it works**: Gate C must reach a stable `S1` foundation and prepare promotion evidence for `S2-S4`, but no serving-state skip is allowed. Automatic rollback uses the named thresholds from iter 032/033 and always emits a control-plane event.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Named state machine** | Auditable, rollback-safe, cacheable | More explicit control-plane work | 9/10 |
| Env-var toggles only | Simple | Too static for canaries and rollback | 4/10 |
| Direct shadow->canonical jump | Faster | Skips required proof buckets | 2/10 |

**Why this one**: The state machine makes rollback visible and keeps Gate C, Gate D, and Gate E evidence on the same control-plane vocabulary.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Promotion and rollback become auditable packet events instead of operator folklore.
- Shadow, latency, and fingerprint alerts map to explicit demotion behavior.

**What it costs**:
- Control-plane tables and dashboards must exist before claiming success. Mitigation: treat them as P0 Gate C work.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing telemetry blocks promotion | M | Gate C checklist requires live spans and reducers |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Rollout without a state machine is unsafe |
| 2 | **Beyond Local Maxima?** | PASS | Rejected env-var and bucket-skip options |
| 3 | **Sufficient?** | PASS | S0-S7 covers proving and rollback |
| 4 | **Fits Goal?** | PASS | Gate C closes on stable shadow evidence |
| 5 | **Open Horizons?** | PASS | Same control plane supports Gates D-F |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Add or reuse the `canonical_continuity_rollout` control-plane row, cache semantics, and event log.
- Wire state transitions to shadow, latency, resume, trigger, and fingerprint signals.

**How to roll back**: Use the state machine's fallback path, preserve the event trail, and keep the new writer non-serving until the cooldown expires.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: `_memory.continuity` stays thin, 14 fields, 2KB, fail-closed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-11 |
| **Deciders** | Packet owner, validation owner, runtime owner |

---

<!-- ANCHOR:adr-005-context -->
### Context

Gate C has to roll `_memory.continuity` into every template surface without recreating the heavyweight narrative problem phase 018 is trying to remove. Iterations 005 and 024 define a 14-field compact block with strict normalization, coherence rules, and a 2048-byte ceiling.

### Constraints

- Keep continuity machine-owned and compact.
- Fresh writes must fail closed on malformed state even if legacy reads can hydrate defaults.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: the iter 005/024 `_memory.continuity` schema with `packet_pointer`, timestamps, actor, recent/next actions, blockers, key files, dedup state, completion, and open/answered questions, capped at 2KB after normalization.

**How it works**: The block lives in frontmatter, updates on every successful canonical save, rejects narrative sprawl, and uses `MEMORY_003` through `MEMORY_017` for field and budget failures.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Thin frontmatter block** | Single source of truth, fast resume | Needs strict validation | 9/10 |
| Larger narrative continuity block | More context in one place | Recreates the memory wrapper problem | 3/10 |
| Sidecar continuity files | Clean separation | Sync drift and file-count sprawl | 5/10 |

**Why this one**: It keeps continuity cheap to read, cheap to diff, and bounded enough that canonical narrative still lives in anchors, not metadata.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
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
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resume and dedup need compact state |
| 2 | **Beyond Local Maxima?** | PASS | Compared larger block and sidecar options |
| 3 | **Sufficient?** | PASS | 14 fields cover the needed continuity hints |
| 4 | **Fits Goal?** | PASS | Prevents narrative duplication |
| 5 | **Open Horizons?** | PASS | Leaves Gate D reader logic simple |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Template frontmatter, continuity validator, and save-time update logic all adopt the same 14-field contract.
- `generate-context.ts` and `memory-save.ts` treat the block as machine-owned state, not user-authored prose.

**How to roll back**: Stop new continuity writes, restore last-known-good frontmatter from snapshots or Git history, and keep legacy fallback available until the schema issue is fixed.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!--
Level 3+ Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
