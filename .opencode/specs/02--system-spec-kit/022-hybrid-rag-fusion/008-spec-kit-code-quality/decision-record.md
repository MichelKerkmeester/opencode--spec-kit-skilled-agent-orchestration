---
title: "Decision Record: Spec Kit Code Quality Completion Run [008-spec-kit-code-quality/decision-record.md]"
description: "Architecture and execution decisions for phase 008 quality hardening across system-spec-kit and mcp_server."
trigger_phrases:
  - "decision record"
  - "phase 008"
  - "quality hardening decisions"
SPECKIT_TEMPLATE_SOURCE: "decision-record + level3-arch | v2.2"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: Spec Kit Code Quality Completion Run

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Baseline-First Stabilization for Locked Failing Triad

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-23 |
| **Deciders** | Phase 008 spec owner, quality execution owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase starts with known failing quality gates in `mcp_server`. If modularization or documentation work starts before stabilizing the locked failing triad, root-cause clarity degrades and regressions become harder to isolate.

### Constraints

- Locked decision requires baseline failures to be fixed.
- Phase scope includes structural and documentation work that can mask baseline behavior if sequenced incorrectly.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fix the locked baseline failing triad before any structural modularization or README modernization tasks.

**How it works**: Phase 1 reproduces and stabilizes `graph-search-fn`, `query-expander`, and `memory-save-extended` failures first. Only after focused reruns pass does the workflow proceed to read-only review synthesis and modularization.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Baseline-first stabilization (chosen)** | Clear causality; lower regression ambiguity | Requires strict sequencing discipline | 9/10 |
| Big-bang refactor then test fixes | Potentially fewer edit passes | High risk of masked root causes and unstable debugging | 4/10 |
| Docs-first modernization then code fixes | Fast visible progress | Does not reduce blocking quality risk | 3/10 |

**Why this one**: It minimizes ambiguity and aligns exactly with the locked requirement that baseline failures must be fixed.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Failing test causality remains isolated and traceable.
- Later modularization risk is reduced because baseline behavior is already known-good.

**What it costs**:
- Strict order can delay non-blocking documentation work. Mitigation: parallelize read-only review lanes while fixes are stabilizing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Additional failures surface during baseline reruns | Medium | Keep triad mandatory and route extras through explicit remediation queue |
| Time pressure to skip focused reruns | High | Keep rerun evidence as P0 checklist requirement |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Locked requirement explicitly mandates baseline fixes |
| 2 | **Beyond Local Maxima?** | PASS | Compared against big-bang and docs-first alternatives |
| 3 | **Sufficient?** | PASS | Sequencing change alone resolves ambiguity without extra abstraction |
| 4 | **Fits Goal?** | PASS | Directly unblocks quality closure path |
| 5 | **Open Horizons?** | PASS | Leaves room for modularization and standards updates after stabilization |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Focused fixes in search/query/save modules happen first.
- Verification commands for the triad become mandatory before downstream phases.

**How to roll back**: Revert triad-fix commits, rerun focused triad tests to confirm prior baseline state, and re-plan from reproduced failures.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Moderate Surgical Modularization Instead of Full Rewrite

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-23 |
| **Deciders** | Phase 008 spec owner, code-quality owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`memory-index` and `memory-save` are high-complexity hotspots. The quality lane includes a modularization failure and maintainability debt, but user-locked direction sets refactor depth to moderate surgical, not deep architectural replacement.

### Constraints

- Refactor depth must remain moderate surgical.
- Existing handler exports and MCP contracts must stay stable.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Apply focused helper extraction in hotspot handlers while preserving current public contracts and behavior.

**How it works**: Split cohesive internal sections into helper modules/functions, reduce hotspot size and complexity, and keep compatibility with existing tests and callers.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Moderate surgical extraction (chosen)** | Improves maintainability with bounded risk | Requires careful seam selection | 8/10 |
| Full architecture rewrite | Maximum structural cleanliness | High regression risk and scope overrun | 3/10 |
| Increase modularization thresholds only | Fastest short-term pass | Defers real maintainability debt | 5/10 |

**Why this one**: It satisfies maintainability goals and respects locked refactor-depth constraints.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Hotspot files become easier to reason about and test.
- Modularization gate failure has a concrete corrective path.

**What it costs**:
- More coordination between extracted helpers and existing tests. Mitigation: preserve exports and rerun focused regression suites.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Contract drift from extraction | High | Keep API signatures unchanged and assert with focused tests |
| Partial extraction leaves debt | Medium | Prioritize highest-value seams identified by review wave |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Modularization gate and maintainability debt are active blockers |
| 2 | **Beyond Local Maxima?** | PASS | Compared extraction vs threshold-only vs full rewrite |
| 3 | **Sufficient?** | PASS | Moderate extraction addresses blocker without architecture churn |
| 4 | **Fits Goal?** | PASS | Directly maps to required modularization outcome |
| 5 | **Open Horizons?** | PASS | Leaves optional deeper refactor for future phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Extract helper seams in `handlers/memory-index.ts` and selective seams in `handlers/memory-save.ts`.
- Keep handler entry points and test contracts intact.

**How to roll back**: Revert extraction commits only, restore prior handler composition, rerun modularization and baseline triad tests.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Repo-Owned README Modernization with Conditional Standards Propagation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-23 |
| **Deciders** | Phase 008 spec owner, documentation owner |

---

<!-- ANCHOR:adr-003-context -->
### Context

Documentation modernization is required, but scope is intentionally constrained to repo-owned READMEs under `system-spec-kit`. Vendor/generated trees must remain untouched. In parallel, `sk-code--opencode` updates are required only when actual implementation patterns introduce new enforceable guidance.

### Constraints

- README scope excludes `node_modules`, `dist`, and cache-like directories.
- Standards propagation is conditional, not automatic.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Enforce strict README inclusion/exclusion filters and perform evidence-based conditional updates to `sk-code--opencode`.

**How it works**: Generate a README scope manifest, update only in-scope docs, and run a post-change standards diff to decide whether propagation files require updates.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scoped modernization + conditional propagation (chosen)** | Prevents drift and unnecessary churn | Requires explicit manifest and diff discipline | 9/10 |
| Update every discovered README | Maximum uniformity | High risk of vendor/generated churn | 2/10 |
| Skip standards propagation entirely | Saves time | Risks future code/doc mismatch | 4/10 |

**Why this one**: It aligns exactly with locked user constraints while preserving standards integrity.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Documentation quality rises where ownership is clear.
- Standards docs remain accurate without gratuitous edits.

**What it costs**:
- Additional manifest/diff steps in verification. Mitigation: include these checks directly in tasks/checklist.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Exclusion filter misses a generated subtree | Medium | Validate touched-file manifest before completion |
| Needed standards update mistakenly skipped | Medium | Make propagation review a required P1 gate with evidence |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | README and standards outcomes are explicit requirements |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated full-sweep and no-propagation alternatives |
| 3 | **Sufficient?** | PASS | Scoped updates + conditional propagation satisfy requirements |
| 4 | **Fits Goal?** | PASS | Preserves closure velocity and boundary discipline |
| 5 | **Open Horizons?** | PASS | Leaves broader documentation unification as separate future work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- README inventory and updates are restricted to repo-owned in-scope paths.
- `sk-code--opencode` docs are updated only when change deltas justify it.

**How to roll back**: Revert README and standards-doc commits independently, regenerate manifest, and re-run scope validation.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Consolidate Phase 009 into Canonical Phase 008

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-23 |
| **Deciders** | Phase 008 spec owner, governance owner |

---

<!-- ANCHOR:adr-004-context -->
### Context

Two sibling phase folders (`008-spec-kit-code-quality` and `009-spec-kit-code-quality`) held overlapping governance and verification artifacts for the same initiative under `139-hybrid-rag-fusion`. Continuing dual active folders risks drift in checklist gates, audit artifacts, and closure evidence.

### Constraints

- `008` remains the authoritative root documentation set.
- `009` evidence must be preserved without deleting existing `009` files.
- Ongoing work must continue in one canonical phase folder.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Merge phase `009-spec-kit-code-quality` into `008-spec-kit-code-quality`, keep `008` as the single active phase folder, import `009` evidence snapshots into `008/scratch/from-009-*`, and tombstone `009`.

**How it works**: Governance deltas from `009` are merged into `008/checklist.md`, continuity notes are added in `008` root docs, and `009/TOMBSTONE.md` redirects all future execution to `008`.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merge into 008 and tombstone 009 (chosen)** | Single source of truth; preserves full evidence chain | Requires one-time continuity edits | 10/10 |
| Keep both folders active | No immediate merge effort | Ongoing drift risk and ambiguous execution path | 2/10 |
| Replace 008 root docs wholesale with 009 | Fast consolidation | Violates authoritative-root requirement and loses 008 continuity | 1/10 |

**Why this one**: It preserves traceability while eliminating dual-phase ambiguity with minimal disruption.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- `008` becomes the canonical execution and governance location.
- `009` artifacts remain auditable via imported `from-009-*` snapshots and scratch evidence.

**What it costs**:
- Additional documentation maintenance for merge continuity. Mitigation: keep updates minimal and explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing critical `009` evidence during merge | Medium | Explicit imported-artifact list in `implementation-summary.md` |
| Team continues using `009` accidentally | Medium | Tombstone file with exact destination path and instruction to continue in `008` |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Added merge governance sections to `008/checklist.md`.
- Imported specified `009` root and scratch artifacts into `008/scratch/from-009-*`.
- Added continuity notes in `008/tasks.md` and `008/implementation-summary.md`.
- Added `009/TOMBSTONE.md`.

**How to roll back**: Remove merge-specific continuity sections and imported `from-009-*` artifacts, then restore previous dual-folder workflow explicitly.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
