---
title: "Implementation Plan: v1.0.4 Full-Matrix Stress Test Design"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2"
description: "Plan for a future full-matrix v1.0.4 stress execution across system-spec-kit feature surfaces and CLI executors. Defines corpus structure, scoring, harness architecture, executor dispatch, aggregation, and execution sequencing without running the matrix."
trigger_phrases:
  - "v1.0.4 full matrix stress plan"
  - "full matrix executor plan"
  - "stress harness extension plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"
    last_updated_at: "2026-04-29T11:40:34Z"
    last_updated_by: "codex"
    recent_action: "Plan authored for design phase"
    next_safe_action: "Execution phase begins with T001 smoke validation; do not run from this design packet"
    blockers: []
    key_files:
      - "plan.md"
      - "corpus-plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:030-full-matrix-plan"
      session_id: "030-full-matrix-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Recommend per-feature runners plus a meta-aggregator rather than rewriting the search-quality harness as universal infrastructure."
---

# Implementation Plan: v1.0.4 Full-Matrix Stress Test Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, shell, markdown/JSON/JSONL artifacts |
| **Framework** | Vitest, Spec Kit Memory MCP runtime, CLI executors |
| **Storage** | Future execution packet-local `measurements/`, JSONL cell results, rubric JSON |
| **Testing** | Feature-owned runners, CLI smoke dispatches, meta-aggregator, strict spec validator |

### Overview

The future execution phase should run a feature-first matrix: each F1-F14 feature owns small scenario runners, while a meta-aggregator normalizes outputs across inline, native, and external CLI executors. This avoids forcing every feature into the search-quality harness while still producing one comparable sidecar and findings report.

The plan uses packet 029's telemetry run as evidence of the current search harness boundary, not as the full matrix baseline. Packet 029's own findings say it used the v1.0.3 12-case telemetry layout and that v1.0.2 was not exact same-cell comparable (`029-stress-test-v1-0-4/findings-v1-0-4.md:31`, `:34`, `:150`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 target packet pre-approved by user.
- [x] Feature catalog and manual testing playbook inventoried.
- [x] CLI executor skill surfaces inventoried.
- [x] Recent refinement evidence read: packet 020, packet 022, packet 029, PP-1, PP-2, stress-test templates.
- [x] No runtime or prior-packet writes performed.

### Definition of Done

- [x] Matrix surfaces F1-F14 defined.
- [x] Executor dispatch and reachability policy defined.
- [x] Rubric and comparison policy defined.
- [x] Harness-extension options documented and recommendation chosen.
- [x] Future execution tasks authored.
- [x] Strict validator exits 0 for this design packet after template-conformance fixes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Feature-owned runners with a meta-aggregator.

### Key Components

| Component | Purpose |
|-----------|---------|
| `matrix-manifest.json` | Future execution artifact that enumerates `featureId`, `executorId`, `scenarioId`, applicability, invocation type, and expected evidence. |
| Per-feature runner | Script, command prompt, or manual scenario adapter owned by each feature surface. |
| CLI dispatcher | Thin wrapper that invokes cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode, native, or inline cells with timeouts. |
| Cell result JSONL | Append-only normalized result stream. One row per `feature x executor x scenario`. |
| Meta-aggregator | Reads JSONL, validates schema, computes per-scenario and per-`feature x executor` scores, emits findings and rubric sidecar. |
| Regression reviewer | Runs Hunter -> Skeptic -> Referee for every dropped same-cell score before final REGRESSION labels. |

### Data Flow

`matrix-manifest.json` -> smoke validation -> per-feature batch runners -> `measurements/full-matrix-cell-results.jsonl` -> meta-aggregator -> full findings markdown, `findings-rubric-v1-0-4-full.json`, `measurements/full-matrix-summary.json`, and regression-review sections.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Execution Packet Setup

- Create a separate execution packet, or explicitly authorize this packet for execution writes.
- Copy this design's `matrix-manifest` requirements into the execution packet.
- Confirm CLI auth and workspace target authority.
- Run T001 smoke: one harmless cell per executor.

### Phase 2: Corpus Freeze

- Freeze the manifest before any scoring begins.
- Store feature/executor/scenario counts and applicability counts.
- Declare which cells require real model invocations, deterministic fixtures, disposable sandboxes, or CLI auth.

### Phase 3: Per-Feature Batches

- Run batches by feature, not by CLI. This localizes feature-specific setup and lets the same scenario fixture drive every applicable executor.
- Parallelism is allowed only after T001 smoke. Keep cli-copilot at max 3 concurrent dispatches per user-supplied memory feedback.
- Every batch appends normalized cell rows; no batch writes findings directly.

### Phase 4: Aggregation and Regression Review

- Aggregate per scenario and per `feature x executor`.
- Compare only against a prior full-matrix run when one exists. For v1.0.2, v1.0.3, and packet 029, record directional context with `comparable=false`.
- Run Hunter -> Skeptic -> Referee on all dropped same-cell scores.

### Phase 5: Verification and Closeout

- Validate JSON/JSONL parseability.
- Validate sidecar aggregate math.
- Run strict validator on the execution packet.
- Save continuity as "full-matrix execution complete" in the execution packet only.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke dispatch | One harmless cell per executor | CLI skills, native Task tool, inline shell/MCP |
| Deterministic feature runner | Fixture-only behavior and artifact shape | Vitest, shell scripts, JSON schema checks |
| Real invocation cell | CLI/model behavior and user-visible outcome | CLI dispatch transcript plus normalized cell row |
| Aggregator validation | JSONL schema, denominator math, verdict counts | Node.js script or Vitest |
| Spec validation | Execution packet structure | `validate.sh --strict` |

### L2 Verification Addendum

- All JSON and JSONL artifacts parse.
- `NA`, `SKIP`, and `UNAUTOMATABLE` are counted outside score denominators and listed in findings.
- Every score has evidence.
- Every dropped same-cell score has Hunter -> Skeptic -> Referee.
- No runtime files are modified by fixture-only cells unless the execution packet explicitly includes harness implementation tasks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stress-test pattern | Documentation | Available | Required for rubric, sidecar, findings shape (`14--stress-testing/01-stress-test-cycle.md:40`, `:57`). |
| Manual playbook real-execution policy | Documentation | Available | Required to distinguish fixture proof from real workflow proof (`manual_testing_playbook.md:9`). |
| PP-1 live handler seam | Test pattern | Available | Search telemetry cells can use live handler with declared mocked boundary (`handler-memory-search-live-envelope.vitest.ts:3`, `:15`). |
| PP-2 harness export mode | Harness feature | Available | Search-quality cells can export telemetry JSONL (`harness.ts:199`, `:239`). |
| CLI auth | Environment | Unknown until execution | Cells for that CLI become `SKIP` if unavailable. |
| CocoIndex index | Environment | Tool calls were cancelled in this design session; execution must recheck | F8 real-search cells become `SKIP` if the index is missing or unavailable. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Execution packet writes outside target authority, mutates prior packets, or starts running the matrix from this design packet without approval.
- **Procedure**: Stop execution, preserve transcripts, revert only unauthorized execution artifacts, and re-run strict validator on the design packet. Do not delete user-owned unrelated dirty worktree files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Design Packet -> Execution Packet Setup -> Smoke Dispatch -> Corpus Freeze
       -> Per-Feature Batches -> Aggregation -> Regression Review -> Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Execution Packet Setup | This design packet | Smoke Dispatch |
| Smoke Dispatch | CLI auth and target authority | Corpus Freeze |
| Corpus Freeze | Smoke Dispatch pass/skip statuses | Per-Feature Batches |
| Per-Feature Batches | Frozen manifest | Aggregation |
| Aggregation | Cell result JSONL | Regression Review |
| Regression Review | Aggregated deltas | Validation |
| Validation | Findings, sidecar, measurements | Closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Execution setup and smoke | Medium | 2-4 hours |
| Manifest freeze and fixture preparation | Medium | 3-6 hours |
| Per-feature runner implementation or adaptation | High | 1-3 days |
| Full matrix dispatch | High | 1-2 days depending on CLI auth/rate limits |
| Aggregation and adversarial review | High | 4-8 hours |
| **Total** | | **3-6 days for a careful first full run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [ ] Confirm execution target packet.
- [ ] Confirm disposable sandbox paths for destructive cells.
- [ ] Confirm CLI auth or predeclare `SKIP`.
- [ ] Confirm aggregator output directory.

### Rollback Procedure

1. Stop new dispatches.
2. Mark in-flight cells `STOPPED`.
3. Preserve `cell-results.jsonl` and transcripts.
4. Remove only malformed execution artifacts from the execution packet.
5. Re-run strict validator.

### Data Reversal

- **Has data migrations?** No for this design. Execution destructive cells must use disposable sandboxes and checkpoints.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Catalog + playbook evidence
        |
        v
F1-F14 corpus manifest ---- Executor smoke gates
        |                         |
        v                         v
Feature-owned runners ---> Cell JSONL stream
        |                         |
        v                         v
             Meta-aggregator
                    |
                    v
Findings + rubric + measurements
                    |
                    v
Hunter/Skeptic/Referee + strict validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Matrix manifest | Spec/corpus plan | Cell universe and applicability | Smoke and batching |
| Executor smoke | CLI skill contracts and auth | Executor readiness statuses | Real invocation cells |
| Per-feature runners | Feature fixtures and target authority | Cell JSONL rows | Aggregation |
| Meta-aggregator | Cell JSONL schema | Sidecar, findings, summary | Regression review |
| Regression review | Prior comparable full-matrix baseline if present | Final verdicts | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 smoke all executors** - CRITICAL - execution cannot know applicable cells until executor reachability is real.
2. **Freeze manifest** - CRITICAL - scoring before freeze invalidates the run.
3. **Implement or select the meta-aggregator** - CRITICAL - without normalized rows, cross-feature results are not comparable.
4. **Run per-feature batches** - CRITICAL - largest runtime.
5. **Regression review** - CRITICAL - required before publishing REGRESSION.

**Total Critical Path**: 3-6 days for the first real run.

**Parallel Opportunities**:

- Feature fixture preparation can happen while CLI auth smoke is pending.
- F3/F4/F14 search cells can reuse PP-1/PP-2 fixtures while F1/F10/F11 write/loop cells prepare sandboxes.
- Aggregator schema tests can be written before the full result stream exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Smoke Ready | One harmless cell per executor returns PASS/SKIP with evidence | Execution Phase 1 |
| M2 | Corpus Frozen | Matrix manifest locked with counts and applicability | Execution Phase 2 |
| M3 | Batch Complete | All feature batches produce normalized JSONL rows | Execution Phase 3 |
| M4 | Findings Ready | Findings, rubric, measurements, and regression reviews complete | Execution Phase 4 |
| M5 | Validator Green | Strict validator exits 0 | Execution Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### Rubric Design

The rubric inherits the generalized stress-cycle dimensions (`14--stress-testing/01-stress-test-cycle.md:40`, `:49`):

| Dimension | Score 0 | Score 1 | Score 2 |
|-----------|---------|---------|---------|
| `correctness` | Wrong, absent, or contradicts evidence | Partially correct, incomplete, noisy | Correct and evidence-supported |
| `robustness` | Breaks under weak, stale, vague, or adversarial input | Handles some rough edges inconsistently | Handles expected rough edges with bounded behavior |
| `telemetry` | Missing required evidence or audit data | Partial or hard-to-reproduce evidence | Evidence is complete enough to replay |
| `regression-safety` | Worse than prior comparable same cell or unreviewed drop | Mixed, unchanged, or no comparable prior | Equal/better than prior comparable cell, or clean first baseline |

Scoring unit: `feature x executor x scenario`. Rollup unit: `feature x executor`, computed by summing scenario dimension scores and dividing by the max for applicable, scored scenarios only. `NA`, `SKIP`, and `UNAUTOMATABLE` are excluded from the denominator and reported separately.

Comparison protocol:

1. Compare to prior full-matrix sidecar only when cell IDs match exactly.
2. Treat v1.0.2, v1.0.3, and packet 029 as directional context only.
3. Flag any dropped same-cell dimension score as `candidateRegression=true`.
4. Run Hunter -> Skeptic -> Referee before final REGRESSION.
5. Record `comparison.comparable=false` for non-like-for-like baselines.

---

### Harness-Extension Plan

The current search-quality harness is good at document retrieval metrics and telemetry export. It is not a universal system-spec-kit orchestrator. It has channels limited to `memory_search`, `code_graph_query`, and `skill_graph_query` (`corpus.ts:7`) and preserves envelope/audit/shadow telemetry for those runners (`harness.ts:33`, `:45`, `:90`).

The execution phase should use **Option C: per-feature stress runners plus a meta-aggregator**.

| Option | Description | Fit |
|--------|-------------|-----|
| A | Extend search-quality harness into a feature-agnostic runner where each cell defines a runner | Too much harness churn; risks turning a retrieval harness into a generic workflow engine. |
| B | Build a new lightweight orchestrator that invokes per-cell scripts | Simple aggregation, but higher dispatch overhead and more duplicated feature setup. |
| C | Keep per-feature runners under feature test surfaces; add a meta-aggregator that reads normalized findings JSONL | Best balance: features keep local expertise, aggregator stays generic, search harness remains focused. |

The ADR in `decision-record.md` makes this recommendation binding for the first execution phase.

---

### CLI Executor Sub-Plan

| Executor | Cell Timeout | Budget | Output Contract | Non-Applicable Examples |
|----------|--------------|--------|-----------------|-------------------------|
| cli-codex | 20 min standard, 45 min deep-loop | gpt-5.5 xhigh, service-tier null per user | JSON or markdown transcript plus normalized cell row | Self-invocation from a Codex parent is invalid; execution should dispatch from non-Codex or mark blocked. |
| cli-copilot | 20 min | max 3 concurrent dispatches | Transcript, changed-files guard, normalized cell row | Hook prompt-mutation cells are simulated through custom instructions, not true stdout injection. |
| cli-gemini | 20 min | `gemini-3.1-pro-preview` only | Text/JSON output and normalized cell row | Write-heavy cells unless execution authority grants `--yolo`. |
| cli-claude-code | 20 min standard, 45 min deep reasoning | plan mode for read-only, JSON/schema where useful | JSON transcript and normalized cell row | Real web-search cells; Claude Code skill says no `--search` flag (`cli-claude-code/SKILL.md:43`). |
| cli-opencode | 30 min | provider preflight required | JSON output from `opencode run` | Provider unavailable or self-invocation without explicit parallel-detached use. |
| native | Command-owned timeout | Task tool or command YAML | Iteration files, state JSONL, normalized cell row | Direct Task-tool loops for deep-review/deep-research are invalid. |
| inline | 5-10 min | current runtime only | Tool output, files/artifacts, normalized cell row | External model variance cannot be tested inline. |
