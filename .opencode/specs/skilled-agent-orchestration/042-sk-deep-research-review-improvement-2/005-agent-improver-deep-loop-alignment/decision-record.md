---
title: "Decision Record: Agent-Improver Deep-Loop Alignment [005]"
description: "5 ADRs governing the deep-loop alignment of sk-agent-improver: journal emission ownership, coverage graph reuse, trajectory convergence, parallel candidate opt-in, and backward compatibility."
trigger_phrases:
  - "005"
  - "agent improver ADR"
  - "improvement journal decision"
  - "proposal-only constraint"
  - "coverage graph namespace"
  - "parallel candidates opt-in"
  - "backward compatibility defaults"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Journal Emission in Orchestrator, Not Agent

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | michelkerkmeester-barter |

---

<!-- ANCHOR:adr-001-context -->
### Context

The sk-agent-improver skill uses a proposal-only agent model: the improvement agent generates candidate proposals but performs no side effects. All state mutations (promotion, rollback, scoring) happen in the orchestrator. We needed to add audit journal emission as part of this phase, which raised the question of where journal writes should happen.

If journal writes happen inside the agent, the agent can no longer be described as proposal-only, which breaks the core architectural guarantee that makes the skill safe to run in bounded improvement loops.

### Constraints

- Proposal-only constraint is a foundational guarantee of sk-agent-improver; violating it would require rethinking the entire skill model.
- Journal must capture the full session lifecycle including events that only the orchestrator knows about (legal-stop gate outcomes, session-ended stop-reason).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Place all journal write operations in the orchestrator, never in the proposal agent.

**How it works**: The orchestrator calls `improvement-journal.cjs` emit functions at each lifecycle boundary (iteration start, candidate evaluation, gate check, session end). The proposal agent receives no reference to the journal path and has no import of the journal script. This preserves the proposal-only model completely.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Orchestrator-only emit (chosen)** | Preserves proposal-only constraint; journal sees full session context | Orchestrator is responsible for calling emit at every lifecycle point | 9/10 |
| Agent emits its own events | Agent has direct access to its own state | Violates proposal-only constraint; agent gains side-effect capability | 2/10 |
| Shared event bus | Decoupled; both orchestrator and agent can emit | Adds infrastructure complexity; still gives agent write capability | 4/10 |

**Why this one**: The proposal-only constraint is the reason sk-agent-improver is safe for bounded improvement loops. Breaking it to simplify journal wiring is not a worthwhile trade.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Proposal-only constraint remains intact and provably enforced.
- Journal contains full session context that only the orchestrator possesses.

**What it costs**:
- Orchestrator must call emit at every lifecycle boundary; missing a call is a silent gap in the journal. Mitigation: the checklist and SKILL.md document all required emit points.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Orchestrator misses an emit call | Medium | CHK-026 manual integration test verifies all event types appear in journal |
| Future contributor adds journal write inside agent | High | Code review gate; checklist item CHK-100 flags this |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without orchestrator-owned emit, proposal-only constraint breaks |
| 2 | **Beyond Local Maxima?** | PASS | Shared event bus and agent-side emit both considered and rejected |
| 3 | **Sufficient?** | PASS | Orchestrator has all session context needed for complete journal |
| 4 | **Fits Goal?** | PASS | Journal auditability is a core deliverable of this phase |
| 5 | **Open Horizons?** | PASS | Orchestrator-owned emit is extensible; adding new event types requires no architectural change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `improvement-journal.cjs`: new append-only emitter script, imported only by orchestrator code paths
- agent-improver orchestrator section: updated with journal emit call sites at each lifecycle boundary
- improvement charter: audit trail obligations section added

**How to roll back**: Remove journal emit calls from the agent-improver orchestrator section; delete the journal emitter script; revert the charter file. No proposal-agent file changes needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Coverage Graph Namespace Reuse

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | michelkerkmeester-barter |

---

<!-- ANCHOR:adr-002-context -->
### Context

042 Phase 2 built a semantic coverage graph infrastructure for deep-research and deep-review loops. This phase needs to track explored mutation dimensions, tried mutation types, and integration surfaces for improvement sessions. We needed to decide whether to reuse the existing graph infrastructure or build a separate system.

### Constraints

- Building a separate graph system duplicates infrastructure and maintenance burden.
- The existing coverage graph must not be contaminated with improvement-session data.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Reuse the existing 042 Phase 2 coverage graph infrastructure by adding a `loop_type: "improvement"` namespace parameter to all read/write operations.

**How it works**: `mutation-coverage.cjs` calls the existing graph reader/writer APIs with `loop_type: "improvement"` on every operation. Queries without this parameter return only deep-research/review data. The namespace is enforced at the write layer, not the read layer, so existing consumers are unaffected.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Namespace reuse (chosen)** | No new infrastructure; proven API; single maintenance point | Requires confirming `loop_type` param support in Phase 2 API | 9/10 |
| Separate graph system | Full isolation; no risk of cross-contamination | Duplicates infrastructure; two systems to maintain | 4/10 |
| Flat file coverage tracking | Simplest implementation | Non-queryable; cannot support future graph traversal features | 5/10 |

**Why this one**: The Phase 2 graph already solves the hard problems (schema, persistence, querying). Adding a namespace parameter is a small change with high leverage.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No new infrastructure to build or maintain.
- Improvement session coverage data is stored in the same queryable format as research/review data.

**What it costs**:
- Requires verifying `loop_type` parameter support in Phase 2 API before implementation. Mitigation: T011 reads Phase 2 spec before writing mutation-coverage.cjs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 2 API does not support `loop_type` param | Medium | T011 confirms API before implementation; fallback is thin wrapper |
| Namespace parameter accidentally omitted | Medium | CHK-015 verifies namespace on all write operations |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Mutation coverage tracking is required by REQ-AI-006 |
| 2 | **Beyond Local Maxima?** | PASS | Separate system and flat-file alternatives considered |
| 3 | **Sufficient?** | PASS | Namespace isolation provides complete data separation |
| 4 | **Fits Goal?** | PASS | Reuse reduces implementation risk and effort |
| 5 | **Open Horizons?** | PASS | Namespace approach generalizes to future loop types |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `mutation-coverage.cjs`: all graph writes include `loop_type: "improvement"`; reads filter by namespace
- `improvement_config.json`: `coverageGraph.path` config field added

**How to roll back**: Delete `mutation-coverage.cjs`; remove `coverageGraph.path` from config. Phase 2 graph data is unchanged because improvement writes are namespace-isolated.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Dimension Trajectory as First-Class Convergence Signal

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | michelkerkmeester-barter |

---

<!-- ANCHOR:adr-003-context -->
### Context

The current sk-agent-improver convergence check looks at absolute score thresholds: if all 5 dimensions meet their targets, the session converges. This works for clean cases but is susceptible to noisy single-iteration jumps that look like convergence but are not stable.

042 Phase 1 introduced trajectory tracking for deep-research and deep-review to detect genuine stabilization vs. one-off score spikes. We needed to decide whether to adopt the same approach for agent-improver or keep the simpler absolute-threshold model.

### Constraints

- Minimum data requirements must not make the loop unnecessarily long for simple improvement cases.
- The trajectory mechanism must integrate with the existing 5-dimension scoring without changing the scoring formula.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Treat per-dimension score trajectory as a first-class convergence signal, requiring a minimum of 3 data points before the session can claim `converged`.

**How it works**: After each iteration, the orchestrator appends the 5-dimension score vector to a trajectory file. Before the legal-stop gate evaluates convergence, it checks that the trajectory has at least 3 entries and that the per-dimension variance across the last 3 entries is below the configured stabilization threshold.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Trajectory with 3-point minimum (chosen)** | Filters single-iteration noise; proven in 042 Phase 1 | Requires at least 3 iterations before convergence | 9/10 |
| Absolute threshold only (current) | Simple; no minimum iteration count | Susceptible to noisy single-iteration peaks | 5/10 |
| Exponential moving average | Smooth convergence signal | More complex math; harder to audit | 6/10 |

**Why this one**: The 3-point minimum is the simplest mechanism that eliminates single-iteration false positives. It is already validated in 042 Phase 1 for analogous loop structures.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Sessions converge on genuine stabilization, not one-off score spikes.
- Trajectory data is available post-session for scoring weight optimization.

**What it costs**:
- Sessions that would have converged in 1-2 iterations under the old model now require at least 3. Mitigation: 3 is a low minimum; it adds at most 2 additional iterations for fast-converging cases.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False convergence from coincidental score alignment across 3 iterations | Low | Stabilization threshold configurable; default set conservatively |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Single-iteration convergence claims are unreliable without trajectory |
| 2 | **Beyond Local Maxima?** | PASS | EMA and absolute-threshold alternatives considered |
| 3 | **Sufficient?** | PASS | 3-point minimum with variance check eliminates primary failure mode |
| 4 | **Fits Goal?** | PASS | Trajectory data feeds scoring weight optimizer (REQ-AI-012) |
| 5 | **Open Horizons?** | PASS | Trajectory file is a reusable artifact; future analyses can read it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `mutation-coverage.cjs`: trajectory writer appends score vector after each iteration
- agent-improver orchestrator section: legal-stop gate updated to check trajectory minimum and variance before accepting `converged`
- improvement strategy asset: trajectory-based convergence criteria documented
- improvement config: `trajectory.minDataPoints` and `trajectory.stabilizationThreshold` config fields added

**How to roll back**: Remove trajectory check from the legal-stop gate in the agent-improver orchestrator section; restore prior absolute-threshold convergence logic. Trajectory file is additive and can be left in place or deleted.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Parallel Candidates Opt-In Only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | michelkerkmeester-barter |

---

<!-- ANCHOR:adr-004-context -->
### Context

042 Phase 3 built a wave executor for running parallel candidate sets in deep-research and deep-review. Applying parallel candidate waves to agent-improver could accelerate exploration of diverse mutation strategies. However, parallel waves significantly increase context length per session and are only beneficial when the improvement space is broad enough to warrant multiple simultaneous strategies.

We needed to decide whether to enable parallel waves by default or make them opt-in.

### Constraints

- Agent context windows are finite; parallel waves with 2-3 candidates per iteration are 2-3x the per-iteration cost.
- Most agent improvement sessions target narrow, well-defined improvement goals that do not benefit from strategy diversification.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Parallel candidate waves are disabled by default and activate only when `parallelWaves.enabled: true` and the `explorationBreadthScore` meets or exceeds the configured `activationThreshold` in improvement_config.json.

**How it works**: At the start of each iteration, the orchestrator checks the parallel wave gate. If `enabled` is false or the exploration-breadth score is below the threshold, it runs a single candidate as before. If both conditions are met, it spawns 2-3 candidates with different mutation strategies and selects the highest non-regressive result.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in via config gate (chosen)** | No overhead for narrow improvement cases; explicit decision to expand | Requires developer to configure when exploration breadth warrants it | 9/10 |
| Always-on parallel waves | Maximum exploration in all sessions | 2-3x context cost; wasteful for narrow improvement goals | 3/10 |
| Auto-detect breadth and enable automatically | No manual configuration | Auto-detection heuristic is complex and potentially unreliable | 5/10 |

**Why this one**: The sessions that benefit most from parallel waves are the minority. Making parallel waves the default would impose a 2-3x context cost on all sessions. An explicit opt-in with a breadth gate gives developers control without adding complexity to the common case.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Default session cost is unchanged; no overhead for the common case.
- Parallel exploration is available when explicitly needed.

**What it costs**:
- Developers must configure and enable parallel waves manually for sessions that would benefit. Mitigation: SKILL.md documents when to use the feature and how to set the threshold.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Developer enables parallel waves without sufficient exploration breadth, causing noisy results | Low | Activation threshold gate prevents activation below the breadth score; threshold documented in SKILL.md |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parallel exploration is a valid performance lever for broad improvement goals |
| 2 | **Beyond Local Maxima?** | PASS | Always-on and auto-detect alternatives considered |
| 3 | **Sufficient?** | PASS | Opt-in gate provides parallel exploration without default overhead |
| 4 | **Fits Goal?** | PASS | Backward compatibility (ADR-005) requires `enabled: false` default |
| 5 | **Open Horizons?** | PASS | Auto-detection can be added later without breaking the opt-in model |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `candidate-lineage.cjs`: new script for wave lineage tracking
- agent-improver orchestrator section: parallel wave orchestration branch added with gate check
- improvement config: `parallelWaves.enabled`, `parallelWaves.activationThreshold`, `parallelWaves.maxCandidates` fields added with `enabled: false` default

**How to roll back**: Set `parallelWaves.enabled: false` (already the default); remove wave orchestration branch from the agent-improver orchestrator section; delete `candidate-lineage.cjs`. No existing sessions are affected.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Backward Compatibility via Optional Config Fields

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | michelkerkmeester-barter |

---

<!-- ANCHOR:adr-005-context -->
### Context

This phase adds 13 new behaviors and approximately 15 new configuration fields to the sk-agent-improver skill. Any of these changes could silently break existing improvement sessions if they introduce required fields or change default behavior. We needed to decide how to structure the additions to guarantee that existing sessions are unaffected.

### Constraints

- The team runs existing improvement sessions regularly; breaking them is not acceptable.
- New config fields must be usable without requiring updates to every existing improvement_config.json file.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: All new configuration fields introduced in this phase are optional with documented defaults. If a field is absent from improvement_config.json, the skill uses the default and behaves identically to its pre-phase state.

**How it works**: Each new config field in improvement_config.json has a JSDoc comment specifying its type, default value, and valid range. The SKILL.md loading section documents that missing fields are resolved to their defaults. New scripts are only invoked when the corresponding config block is present or when the orchestrator explicitly calls them; they are not imported automatically.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Optional fields with defaults (chosen)** | Zero migration effort for existing sessions; clear documentation of defaults | Implementer must remember to code default fallback for every new field | 9/10 |
| Required fields with migration guide | Explicit opt-in signal | All existing config files must be updated; high migration burden | 3/10 |
| Feature flags via environment variables | No config file changes needed | Harder to discover; not co-located with other config | 5/10 |

**Why this one**: Optional fields with defaults are the lowest-friction approach for existing users and the most consistent with how the current improvement_config.json is already structured.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Existing improvement sessions require zero changes to continue working after this phase.
- New capabilities are discoverable through improvement_config.json comments.

**What it costs**:
- Every new config field must be coded with an explicit default fallback in the consuming code; no field can assume its presence. Mitigation: CHK-013 verifies JSDoc comments on all new fields; CHK-027 verifies backward compatibility via manual test.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| New field lacks default and throws on absent config | High | CHK-027 backward-compat test catches this before completion |
| Default value is wrong for common use case | Medium | Defaults reviewed in ADR-001 through ADR-004 for each feature area |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase adds 15 new config fields; backward compat rule is essential |
| 2 | **Beyond Local Maxima?** | PASS | Required fields and env-var flags considered |
| 3 | **Sufficient?** | PASS | Optional fields with defaults cover the full compatibility surface |
| 4 | **Fits Goal?** | PASS | No existing session should break as a result of this phase |
| 5 | **Open Horizons?** | PASS | New fields can be promoted to required in a future breaking-change release if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `improvement_config.json`: all new fields added as optional with JSDoc-style inline comments documenting type, default, and valid range
- SKILL.md: config loading section updated to document that absent fields resolve to defaults

**How to roll back**: Rollback is not needed; this ADR governs the implementation approach for all other ADRs. Removing new config fields from improvement_config.json restores the pre-phase config shape.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
