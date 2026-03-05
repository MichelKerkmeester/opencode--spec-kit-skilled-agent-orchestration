---
title: "Consolidated plan: 002-indexing-normalization [002-indexing-normalization/plan.md]"
description: "Consolidated from 002-index-tier-anomalies/plan.md and 004-frontmatter-indexing/plan.md."
SPECKIT_TEMPLATE_SOURCE: "merge-consolidation | v1.0"
trigger_phrases:
  - "consolidated"
  - "002-indexing-normalization"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated plan.md

This document consolidates source documents from:
- `002-index-tier-anomalies/plan.md`
- `004-frontmatter-indexing/plan.md`

## Source: `002-index-tier-anomalies/plan.md`

---
title: "Implementation Plan: Memory Index Deduplication and Tier Normalization [002-index-tier-anomalies/plan]"
description: "This implementation introduces a canonical-path dedup pass before index batching and a single tier-precedence model used across parser and scoring logic. Delivery is test-first ..."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "index"
  - "deduplication"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Memory Index Deduplication and Tier Normalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP server handlers + parser libraries |
| **Storage** | SQLite context index + incremental metadata |
| **Testing** | Vitest |

### Overview
This implementation introduces a canonical-path dedup pass before index batching and a single tier-precedence model used across parser and scoring logic. Delivery is test-first for duplicate-source regression and tier-resolution edge cases, then scoped code fixes, then validation and documentation sync.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (targeted + full suite subset)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted pipeline hardening with deterministic normalization stages.

### Key Components
- **`findMemoryFiles` scanner**: discovers candidate memory files from supported roots.
- **`findSpecDocuments` scanner**: discovers spec markdown docs under allowed trees.
- **`handleMemoryIndexScan` orchestrator**: merges candidates, applies incremental filtering, batches indexing.
- **Tier utilities (`importance-tiers`)**: provides normalization and default tier mapping.

### Data Flow
1. Discover candidates from memory and spec-document roots.
2. Canonicalize and deduplicate file paths.
3. Run incremental categorization on unique path set.
4. Index unique files, update mtimes, and emit accurate counters.
5. Parse/assign tiers using documented precedence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add failing regression tests for alias-root duplication.
- [ ] Add failing tier-resolution tests for mixed metadata signals.
- [ ] Confirm current baseline behavior and capture outputs.

### Phase 2: Core Implementation
- [ ] Add canonical-path dedup in scan assembly path.
- [ ] Keep specFolder filtering correct after canonicalization.
- [ ] Apply deterministic tier precedence in parser/scoring flow.
- [ ] Ensure counters and unchanged metrics use deduped set.

### Phase 3: Verification
- [ ] Run targeted Vitest files and confirm new assertions pass.
- [ ] Run broader MCP server test subset for regression safety.
- [ ] Update checklist with command-level evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | parser tier extraction and normalization | Vitest (`memory-parser.vitest.ts`, `importance-tiers.vitest.ts`) |
| Integration | scan merge/dedup and counter integrity | Vitest (`handler-memory-index.vitest.ts`) |
| Manual | targeted `memory_index_scan` sanity with alias roots | local MCP invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing incremental index metadata logic | Internal | Green | inaccurate changed/unchanged behavior |
| Filesystem `realpath` behavior consistency | Platform | Yellow | dedup mismatch across environments |
| Current tier config constants | Internal | Green | ranking regression risk |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scan counts or ranking behavior regress in targeted tests.
- **Procedure**: Revert scanner/indexer tier changes, re-run baseline tests, and preserve regression tests for next pass.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ---> Phase 2 (Core) ---> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Verify |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | Medium-High | 3-5 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline behavior captured before edits
- [ ] Scoped file list confirmed
- [ ] Targeted test commands documented

### Rollback Procedure
1. Revert only scanner/indexer/tier files touched by this spec.
2. Re-run targeted tests and baseline scan checks.
3. Confirm duplicate behavior is restored only if intentional rollback.
4. Re-open unresolved tasks in `tasks.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Phase 1: Regression  │
│ setup + baseline     │
└──────────┬───────────┘
           │
           v
┌──────────────────────┐
│ Phase 2: Core fixes  │
│ dedup + tier logic   │
└──────────┬───────────┘
           │
           v
┌──────────────────────┐
│ Phase 3: Verification│
│ tests + docs sync    │
└──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Regression tests | Existing fixture/test infra | failing assertions | Core fixes |
| Scan dedup implementation | Regression tests | unique-file scan pipeline | Verification |
| Tier precedence implementation | Tier configs + parser functions | deterministic tier output | Verification |
| Verification/reporting | Core fixes | completion evidence | release |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Regression tests defined and failing** - 1-2 hours - CRITICAL
2. **Canonical dedup integrated in scan pipeline** - 2-3 hours - CRITICAL
3. **Tier precedence normalization implemented** - 1-2 hours - CRITICAL
4. **Verification and evidence capture complete** - 1-2 hours - CRITICAL

**Total Critical Path**: 5-9 hours

**Parallel Opportunities**:
- Parser-tier tests and scan dedup tests can be authored in parallel.
- Checklist and implementation-summary updates can run alongside final verification.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Failing regressions documented | End of Phase 1 |
| M2 | Core fixes landed | Dedup + tier tests pass | End of Phase 2 |
| M3 | Release ready | Validation + checklist evidence complete | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Canonical dedup and explicit tier precedence

**Status**: Proposed

**Context**: Duplicate alias roots and inconsistent tier interpretation undermine deterministic indexing and ranking.

**Decision**: Canonicalize and deduplicate file paths before indexing. Resolve tiers by a strict precedence chain and verify with regression tests.

**Consequences**:
- Better index integrity and stable counters.
- Slightly more preprocessing complexity in scan assembly.

**Alternatives Rejected**:
- Restrict scan to one root only, because it breaks compatibility with current dual-root support.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm active file list matches `tasks.md` scope.
- [ ] Confirm baseline tests are reproducible before edits.
- [ ] Confirm no unrelated refactors are included.

### Execution Rules

| Rule ID | Rule |
|---------|------|
| TASK-SEQ | Execute phases in order: setup, implementation, verification |
| TASK-SCOPE | Only modify files listed in `spec.md` unless checklist documents scope expansion |
| TASK-VERIFY | Run targeted tests after each core implementation task |

### Status Reporting Format
- Report status as: `done`, `in-progress`, or `blocked`.
- Include artifact path and evidence command for each completed verification task.

### Blocked Task Protocol
- Mark blocked tasks as `[B]` in `tasks.md`.
- Record blocker reason and immediate next action.
- Do not continue to downstream blocked tasks until blocker is resolved or deferred with approval.

## Source: `004-frontmatter-indexing/plan.md`

---
title: "Implementation Plan: 004-frontmatter-indexing [004-frontmatter-indexing/plan]"
description: "This plan standardizes frontmatter across templates, spec docs, and memory markdown, then rebuilds indexes from normalized metadata. The approach is parser-first: define canonic..."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "004"
  - "frontmatter"
  - "indexing"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: 004-frontmatter-indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, shell scripts |
| **Framework** | system-spec-kit parser/index workflow |
| **Storage** | SQLite index and markdown frontmatter |
| **Testing** | Vitest + script-level integration checks |

### Overview
This plan standardizes frontmatter across templates, spec docs, and memory markdown, then rebuilds indexes from normalized metadata. The approach is parser-first: define canonical schema, add compose/migration tooling, run dry-run validation, then apply migration and reindex. Verification covers idempotency, parser correctness, and retrieval stability.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline with staged migration and index rebuild

### Key Components
- **Frontmatter Schema Module**: defines canonical keys, defaults, and type coercion rules.
- **Parser/Compose Layer**: parses legacy metadata and emits normalized frontmatter.
- **Migration Runner**: applies deterministic rewrite with dry-run and apply modes.
- **Reindex Executor**: rebuilds index from normalized metadata and records verification output.

### Data Flow
Input markdown files pass through parse and normalize steps, then compose writes canonical frontmatter back to disk. The reindex step consumes normalized files and rebuilds index artifacts. Tests validate parser behavior, idempotency, and retrieval outcomes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Finalize canonical frontmatter schema and mapping table.
- [x] Add migration command with dry-run output.
- [x] Prepare fixture set for templates/spec/memory variants.

### Phase 2: Core Implementation
- [x] Implement normalize + compose behavior in parser layer.
- [x] Apply migration tooling to targeted files.
- [x] Hook explicit index rebuild after successful migration.

### Phase 3: Verification
- [x] Run parser, migration, and idempotency tests.
- [x] Run integration reindex + retrieval checks.
- [x] Update checklist and implementation summary with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Frontmatter parser, coercion, compose functions | Vitest |
| Integration | Migration runner + index rebuild + retrieval fixtures | Vitest and CLI commands |
| Manual | Dry-run diff inspection, sampled post-migration documents | Terminal + git diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing markdown corpus under spec templates/docs/memories | Internal | Green | Migration coverage is incomplete. |
| Memory indexing commands and test harness | Internal | Green | Reindex cannot be verified end-to-end. |
| Stable canonical schema decision | Internal | Yellow | Parser and migration implementation can drift. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: reindex regression, parser failures on migrated docs, or unacceptable retrieval drift.
- **Procedure**: revert migration commit set, restore previous index snapshot, rerun baseline tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Schema Definition ──► Parser/Compose ──► Migration Apply ──► Reindex ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema Definition | None | Parser/Compose, Migration |
| Parser/Compose | Schema Definition | Migration, Reindex |
| Migration Apply | Parser/Compose | Reindex |
| Reindex | Migration Apply | Verification |
| Verification | Reindex | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 2-4 hours |
| Core Implementation | High | 6-10 hours |
| Verification | Medium | 2-4 hours |
| **Total** | | **10-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created for targeted markdown scope
- [ ] Migration dry-run report archived
- [ ] Reindex validation baseline captured

### Rollback Procedure
1. Stop migration and index jobs.
2. Revert migration commits or restore from backup snapshot.
3. Rebuild index from pre-migration state.
4. Re-run baseline retrieval tests and compare outputs.

### Data Reversal
- **Has data migrations?** Yes
- **Reversal procedure**: restore pre-migration markdown snapshot, rerun index rebuild, rerun regression suite.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│ Canonical Schema  │───►│ Parser + Compose  │───►│ Migration Runner  │
└───────────────────┘    └─────────┬─────────┘    └─────────┬─────────┘
                                   │                        │
                             ┌─────▼─────┐            ┌─────▼─────┐
                             │ Test Data │            │ Reindex   │
                             │ Fixtures  │            │ Pipeline  │
                             └───────────┘            └─────┬─────┘
                                                             │
                                                       ┌─────▼─────┐
                                                       │ Validation │
                                                       └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Canonical Schema | None | Key map + coercion rules | Parser/Compose |
| Parser + Compose | Canonical Schema | Normalized frontmatter output | Migration Runner |
| Migration Runner | Parser + Compose | Rewritten markdown files | Reindex Pipeline |
| Reindex Pipeline | Migration Runner | Refreshed index | Validation |
| Validation | Reindex Pipeline | Pass/fail evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Schema contract freeze** - 1 day - CRITICAL
2. **Parser/compose and migration implementation** - 2 days - CRITICAL
3. **Reindex and regression verification** - 1 day - CRITICAL

**Total Critical Path**: 4 days

**Parallel Opportunities**:
- Fixture authoring and template updates can run in parallel with parser refactor.
- Retrieval regression assertions can be prepared while migration dry-run executes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema Locked | Canonical key/value rules approved and documented | Day 1 |
| M2 | Migration Ready | Dry-run shows deterministic rewrites with no schema violations | Day 3 |
| M3 | Release Ready | Reindex + regression suite pass on normalized corpus | Day 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Canonical frontmatter first, migration second

**Status**: Accepted

**Context**: Index reliability depends on stable metadata contracts across multiple markdown classes.

**Decision**: Freeze canonical schema before migration and block reindex until migration reports success.

**Consequences**:
- Positive: deterministic metadata structure and predictable indexing behavior.
- Negative: initial up-front effort to map legacy variants. Mitigation: use compatibility mapping table.

**Alternatives Rejected**:
- Incremental per-file ad hoc normalization: rejected due to drift risk and hard-to-verify state.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target files and migration scope before edits.
- Confirm canonical schema mapping is frozen for this run.
- Confirm test commands and rollback inputs are available.

### Task Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run in order: schema freeze, parser updates, migration dry-run, apply, reindex, verify |
| TASK-SCOPE | Restrict writes to targeted templates/spec docs/memories and related tooling paths |

### Status Reporting Format
- STATE: current phase and gate status.
- ACTIONS: commands run and files touched.
- RESULT: pass/fail plus next step.

### Blocked Task Protocol
1. Mark task as BLOCKED with concrete command output.
2. Attempt one bounded workaround that does not expand scope.
3. Escalate with evidence and options if still blocked.
