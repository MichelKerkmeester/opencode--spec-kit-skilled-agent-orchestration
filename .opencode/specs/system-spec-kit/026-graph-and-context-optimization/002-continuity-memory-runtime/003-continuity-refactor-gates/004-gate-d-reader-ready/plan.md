---
title: "Implementation Plan: Gate D — Reader Ready"
description: "Retarget the reader handlers onto canonical docs and continuity records, then clear fallback, regression, and p95 performance gates before runtime rollout."
trigger_phrases: ["gate d", "reader ready", "implementation plan", "resume ladder", "reader handlers"]
importance_tier: "important"
contextType: "implementation"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Marked Gate D execution phases complete and captured shipped evidence"
    next_safe_action: "Reuse the recorded evidence if a follow-on reader packet opens"
    key_files: ["plan.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate D — Reader Ready

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js MCP server |
| **Framework** | System Spec Kit MCP handlers and shared search libraries |
| **Storage** | SQLite-backed `memory_index`, spec docs, handover tier content, `_memory.continuity` frontmatter |
| **Testing** | Vitest plus packet-specific regression and benchmark fixtures |

### Overview
Gate D follows the execution order in [`../resource-map.md`](../resource-map.md) section 4: keep the existing 4-stage retrieval pipeline, change the source semantics, and make resume doc-first. The core deliverable is a `resumeLadder` that reads the handover tier, then `_memory.continuity`, then canonical spec docs, then archived rows, while the surrounding handlers keep their current roles and only retarget assumptions.

Verification was treated as part of implementation, not a follow-up. Gate D closed with the `resumeLadder` landed in `mcp_server/lib/resume/resume-ladder.ts`, six reader surfaces retargeted, the 13-feature regression catalog green, five benchmark suites executed, and the gate-local verification lane recorded as 25 vitest files / 177 tests passed with 7 TODO-tagged skips deferred to the combined deep-review pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate C is closed and dual-write shadow is stable.
- [x] Canonical docs and `_memory.continuity` blocks exist for the packet fixtures used by Gate D.
- [x] Telemetry spans and archive metrics required by iterations 027 and 036 are available before benchmark runs.

### Definition of Done
- [x] All reader handlers are retargeted without replacing the 4-stage pipeline or wrapper roles.
- [x] Resume ladder fallback cases are tested and green.
- [x] Resume, search, trigger, and archive observation evidence is recorded in the packet docs.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read [`spec.md`](spec.md), [`tasks.md`](tasks.md), and [`../resource-map.md`](../resource-map.md) before implementation starts.
- Confirm Gate C stability, packet fixtures, and telemetry spans are still valid on the day work begins.
- Confirm the six reader surfaces remain the only owner files for this gate.
- Re-run strict packet validation after doc edits and before claiming the packet is ready.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep changes inside the six reader surfaces plus the chosen ladder helper | Prevents Gate D from drifting into Gate C or Gate E work |
| AI-ORDER-001 | Change source semantics before touching ranking math or wrapper roles | Matches the F-8 reader-retarget design from the parent packet |
| AI-VERIFY-001 | Treat regression, fallback, and p95 evidence as merge-blocking | Gate D is a proof gate, not just a refactor gate |
| AI-OBS-001 | Start D0 as soon as Gate C stability is confirmed | Archive dependence must be measured while the reader path is fresh |

### Status Reporting Format

- Start state: Gate C status, fixture readiness, and first handler seams to touch
- Work state: active handler, ladder contract status, and any fallback or perf risk found
- End state: validator result, regression or benchmark result, and D0 observation status

### Blocked Task Protocol

1. Stop if Gate C stability, canonical fixtures, or telemetry prerequisites are no longer true.
2. Do not widen scope to solve the blocker; record the dependency issue in the packet first.
3. Resume only after the prerequisite is restored and the packet docs still match reality.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered handler retarget on top of the existing retrieval and bootstrap architecture.

### Key Components
- **`memory-search.ts`**: keeps gather, fusion, rerank, and filter stages intact while reformatting canonical sources.
- **`memory-context.ts`**: stays the orchestration choke point and sends `resume` traffic into the new ladder.
- **`session-resume.ts`**: owns recovery ordering, freshness synthesis, and fast-path miss handling.
- **`resumeLadder` helper**: centralizes doc-first recovery reads, source selection, and stage telemetry.
- **Discovery and trigger handlers**: make spec docs the canonical metadata source and keep archive rows as measured fallback only.

### Data Flow
`/spec_kit:resume` resolves the packet pointer, reads the handover tier and continuity, synthesizes the freshest recovery package, and only falls through to spec-doc or archived lookup on miss. Search and trigger flows reuse the same indexed substrate change, so canonical spec docs and continuity records outrank archived rows without changing the surrounding ranking math.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reader Contract Lock and D0 Kickoff
- [x] Confirm Gate C stability, canonical fixture coverage, and D0 telemetry prerequisites.
- [x] Lock ADR-001 helper placement at `mcp_server/lib/resume/resume-ladder.ts` and align `session-resume.ts` / `session-bootstrap.ts` responsibilities.
- [x] Start D0 archived observation as soon as Gate C stability is confirmed; the observation lane runs in parallel with Phases 2 and 3.
- [x] Retarget discovery and trigger-source assumptions before touching user-facing resume flow.

### Phase 2: Core Reader Refactor
- [x] Restructure `memory-search.ts` to prefer `spec_doc` and `continuity` sources with archived fallback.
- [x] Restructure `memory-context.ts` resume mode and rewrite `session-resume.ts` around the ladder.
- [x] Update `session-bootstrap.ts`, `memory-index-discovery.ts`, and `memory-triggers.ts` to consume the new canonical source contract.

### Phase 3: Verification
- [x] Run the 10 resume tests, 25 integration tests, and 13 feature regressions from iteration 029.
- [x] Benchmark resume, search, and trigger p95 budgets from iteration 027.
- [x] Review the active D0 archived observation lane and document any archive-dependence or fallback churn before gate sign-off.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resumeLadder`, canonical source selection, trigger provenance, discovery bias | Vitest |
| Integration | Resume journey, bootstrap hints, fallback ladder, search/context composition | Vitest |
| Regression | 13 preserved features from iteration 025, mapped to the named rows in iteration 029 | Vitest + stable packet fixtures |
| Performance | `resume_latency_p95`, `search_latency_p95`, `trigger_match_latency_p95`, budget-burn spans | Bench harness + telemetry dashboards |
| Manual | Resume first-screen behavior, deep-profile fallback, archive-only misses, D0 observation review | Packet-local manual spot checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gate C dual-write shadow stable | Internal | Yellow | Reader benchmarks and D0 results are not trustworthy if the writer path is still churning |
| Canonical packet docs with `_memory.continuity` | Internal | Yellow | Resume ladder cannot prove the fast path and will overuse archived fallback |
| Iteration 029 fixture corpus and named test rows | Internal | Green | Without it, Gate D cannot claim preserved-feature coverage |
| Telemetry spans from iteration 027 and post-save verification from iteration 039 | Internal | Yellow | Perf misses cannot be attributed to the dominant stage, and stale doc trust becomes harder to diagnose |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Resume/search p95 misses target for two consecutive runs, D0 `archived_hit_rate` breaches the short-window ceiling, or fallback cases fail in a way that hides current packet state.
- **Procedure**: Revert the reader handler retarget, restore the previous `session-resume.ts` ordering, keep archived rows available, and rerun the baseline fixture suite before retrying Gate D.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Gate C stability ----┬----> D0 observation lane --------------------┐
                     │                                              │
                     └----> Handler retarget ----> Regression/perf proof ----> Gate D close
Fixture + telemetry -------------------------------------------------┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Lock and D0 Kickoff | Gate C, fixtures, telemetry | Core Refactor and D0 observation lane |
| Core Refactor | Contract Lock and D0 Kickoff | Verification |
| Verification | Core Refactor | Gate D close |
| D0 Observation Lane | Contract Lock and D0 Kickoff | Runtime rollout confidence and Gate D close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Lock and D0 Kickoff | Medium | 2-3 days |
| Core Refactor | High | 6-7 days |
| Verification and D0 Review | High | 3-4 days |
| **Total** | | **~2 weeks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline benchmark numbers captured before reader retarget lands. [Evidence: Gate D benchmark suite passed on 2026-04-12 across `tests/gate-d-benchmark-session-resume.vitest.ts`, `tests/gate-d-benchmark-memory-search.vitest.ts`, and `tests/gate-d-trigger-perf-benchmark.vitest.ts`]
- [x] Archive metrics and `resume.fast_path_source` dashboard behavior confirmed. [Evidence: `tests/session-bootstrap-gate-d.vitest.ts`, `tests/gate-d-regression-ablation-drift.vitest.ts`, and `tests/gate-d-resume-perf.vitest.ts` passed on 2026-04-12]
- [x] Stable fixture corpus checked into the expected test lane. [Evidence: the 2026-04-12 Gate D sweep passed `tests/memory-context.resume-gate-d.vitest.ts`, `tests/gate-d-regression-session-dedup.vitest.ts`, and `tests/gate-d-regression-trigger-fast-match.vitest.ts`]

### Rollback Procedure
1. Revert the reader-handler patch set and disable the doc-first resume ladder.
2. Restore prior resume ordering and rerun resume plus search smoke tests.
3. Confirm archived fallback still behaves like the pre-Gate-D baseline.
4. Document the dominant failing stage and owner before reattempting Gate D.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Gate D is a reader-path refactor plus telemetry and observation work.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────────┐
│ Gate C writer stable  │
└──────┬────────┬───────┘
       │        │
       │        ▼
       │   ┌───────────────────────┐
       │   │ D0 observation lane   │
       │   └──────────┬────────────┘
       ▼              │
┌───────────────────────┐
│ resumeLadder contract │
└──────┬─────────┬──────┘
       ▼         ▼
 memory-search  session-resume
       │         │
       └────┬────┘
            ▼
  bootstrap/discovery/triggers
            │
            ▼
    tests + perf review
            │
            └──────────────► D0 sign-off
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `resumeLadder` contract | Gate C stability, iteration 013 resume journey, iteration 029 test catalog | Recovery ordering, source telemetry | Resume and bootstrap refactor |
| Search/context retarget | Canonical doc substrate | Doc-first retrieval behavior | Regression and perf proof |
| Discovery/trigger retarget | Canonical frontmatter | Canonical metadata provenance | Trigger regressions and D0 trust |
| D0 observation lane | Gate C stability, archive telemetry, handler telemetry | Archive-dependence evidence | Gate D close and Gate E runtime rollout |
| Verification lane | All handler work, active D0 observation lane | Gate D close evidence | Gate E runtime rollout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Lock `resumeLadder` contract and helper placement** - 1 day - CRITICAL
2. **Retarget `memory-search.ts`, `memory-context.ts`, and `session-resume.ts`** - 4-5 days - CRITICAL
3. **Retarget bootstrap, discovery, and trigger provenance** - 2 days - CRITICAL
4. **Run resume, integration, regression, and perf evidence** - 3 days - CRITICAL

**Total Critical Path**: ~10-11 working days

**Parallel Opportunities**:
- `session-bootstrap.ts`, `memory-index-discovery.ts`, and `memory-triggers.ts` can move in parallel once the ladder contract is fixed.
- Regression fixture wiring and benchmark harness prep can run while the core handler refactor is in progress.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Reader contract locked | ADR-001 and ADR-002 accepted, helper placement fixed, fallback order agreed | Start of week 1 |
| M2 | Core reader refactor complete | Search, context, resume, bootstrap, discovery, and trigger handlers compile and behave canonically | End of week 1 |
| M3 | Reader-ready evidence complete | Resume/search/trigger p95 targets met, 13 regressions green, D0 observation active | End of week 2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Extract `resumeLadder` into a shared helper

**Status**: Accepted

**Context**: `session-resume.ts` and `session-bootstrap.ts` both need the same recovery ordering, freshness synthesis, and telemetry spans.

**Decision**: Put the ladder in a shared helper module and keep `session-bootstrap.ts` wrapper-only.

**Consequences**:
- Easier to test the 10 resume rows from iteration 029 directly.
- Slightly more module plumbing, but much lower drift risk between resume and bootstrap.

**Alternatives Rejected**:
- Inline ladder only in `session-resume.ts`: rejected because it makes telemetry reuse and bootstrap consistency harder.

---
