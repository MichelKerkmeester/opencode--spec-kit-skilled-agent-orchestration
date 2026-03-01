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
