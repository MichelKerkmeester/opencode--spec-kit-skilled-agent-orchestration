---
title: "Decision Record: Combined Bug Fixes (016)"
description: "Merged architectural decisions from 013 and 015 source spec folders"
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
importance_tier: "normal"
contextType: "implementation"
---
# Decision Record: Combined Bug Fixes (016)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Overview

This is a **combined decision record** merging architectural decisions from two source spec folders:

| # | Source Folder | ADR Count | Date Range |
|---|---------------|-----------|------------|
| 1 | `013-memory-search-bug-fixes` (merged) | ADR-001, ADR-002 | 2026-03-06 |
| 2 | `015-bug-fixes-and-alignment` (merged) | ADR-001 through ADR-009 | 2026-03-07 |

**Total decisions preserved:** 11 ADRs across workflow serialization, alias-root stability, fix-in-place strategy, provider resolution, dead code removal, documentation inflation, database fallback paths, verification prioritization, canonical merge governance, inherited ADR digests, and folder retirement.

---
---

<!-- ANCHOR:source-013 -->
## Source: 013 -- Memory Search Bug Fixes

---

<!-- ANCHOR:adr-013-001 -->
## ADR-001: Serialize overlapping `runWorkflow()` invocations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-06 |
| **Deciders** | OpenCode @speckit packet authoring in canonical packet `008-combined-bug-fixes` (source stream 013) |

---

<!-- ANCHOR:adr-013-001-context -->
### Context

`runWorkflow()` temporarily mutates shared global config (`CONFIG.DATA_FILE`, `CONFIG.SPEC_FOLDER_ARG`) so each invocation can resolve the correct input source and packet context. Save-and-restore logic reduced leakage between sequential calls, but it did not fully protect overlapping runs because concurrent invocations could still observe each other's in-flight globals.

### Constraints

- The workflow already depends on shared process-global configuration in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`.
- This packet is a bug-fix packet, so the change needed to stay narrow and regression-oriented rather than redesigning the workflow API.
<!-- /ANCHOR:adr-013-001-context -->

---

<!-- ANCHOR:adr-013-001-decision -->
### Decision

**We chose**: serialize overlapping `runWorkflow()` calls and keep save-and-restore as a secondary safeguard.

**How it works**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` now runs each invocation behind a workflow lock, then restores the prior config state when the run finishes. `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` adds deterministic regression coverage proving two overlapping calls observe their own per-run config and leave globals reset afterward.
<!-- /ANCHOR:adr-013-001-decision -->

---

<!-- ANCHOR:adr-013-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Serialize + restore** | Fixes the actual race, keeps existing surface area, easy to prove with tests | Reduces parallelism for this workflow path | 9/10 |
| Restore-only approach | Minimal code churn | Still unsafe under overlap because globals remain shared during execution | 5/10 |
| Full refactor away from globals | Best long-term isolation model | Too large for this packet and higher regression risk | 6/10 |

**Why this one**: This packet needed a reliable bug fix, not a workflow architecture rewrite. Serialization addressed the real concurrency hazard while preserving the current API and keeping verification focused.
<!-- /ANCHOR:adr-013-001-alternatives -->

---

<!-- ANCHOR:adr-013-001-consequences -->
### Consequences

**What improves**:
- Overlapping runs no longer interleave shared config state.
- Regression coverage now proves both sequential restoration and concurrent isolation expectations.

**What it costs**:
- Concurrent callers now wait their turn. Mitigation: the workflow is a short-lived context-save path, so throughput impact is acceptable for this packet.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden dependence on parallel execution | M | Keep the lock scoped to `runWorkflow()` only and cover behavior in regression tests |
| Future code assumes restore-only is enough | M | Keep the concurrency test as a permanent guardrail |
<!-- /ANCHOR:adr-013-001-consequences -->

---

<!-- ANCHOR:adr-013-001-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`

**How to roll back**: remove the workflow lock, restore the previous direct invocation path, and re-run the task-enrichment suite to confirm the prior behavior.
<!-- /ANCHOR:adr-013-001-impl -->
<!-- /ANCHOR:adr-013-001 -->

---

<!-- ANCHOR:adr-013-002 -->
## ADR-002: Preserve first-candidate alias-root semantics and add order-stability coverage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-06 |
| **Deciders** | OpenCode @speckit packet authoring in canonical packet `008-combined-bug-fixes` (source stream 013) |

---

<!-- ANCHOR:adr-013-002-context -->
### Context

Folder discovery can see the same spec tree through aliased roots such as `specs/` and `.opencode/specs/`. The bug fix needed canonical dedupe so discovery would not double-scan the same tree, but existing behavior also depended on retaining the first valid candidate path rather than rewriting identities after canonicalization.

### Constraints

- The discovery path in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` must stay deterministic across symlink and canonical-path permutations.
- This packet aimed to harden behavior with minimal semantic change, so preserving established first-candidate semantics was safer than redefining folder identity rules.
<!-- /ANCHOR:adr-013-002-context -->

---

<!-- ANCHOR:adr-013-002-decision -->
### Decision

**We chose**: dedupe alias roots by canonical path while preserving the first candidate that survives normalization, and lock that behavior in with deterministic regression coverage.

**How it works**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` skips duplicate canonical roots but keeps the first normalized candidate path in play. `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` now verifies stable folder identities regardless of alias-root order.
<!-- /ANCHOR:adr-013-002-decision -->

---

<!-- ANCHOR:adr-013-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical dedupe + first-candidate retention** | Removes duplicates without changing the packet's expected identity semantics | Requires explicit regression coverage to avoid future drift | 9/10 |
| Always prefer canonical realpath output | Simpler conceptual rule | Could silently change existing folder identities and cache behavior | 6/10 |
| Keep alias duplicates | No behavior change for ordering | Preserves duplicate scanning and stale-cache bugs | 3/10 |

**Why this one**: The packet needed bug-fix stability, not a new identity model. Preserving first-candidate semantics minimized compatibility risk while still fixing duplicate-root discovery issues.
<!-- /ANCHOR:adr-013-002-alternatives -->

---

<!-- ANCHOR:adr-013-002-consequences -->
### Consequences

**What improves**:
- Alias roots dedupe cleanly without reintroducing unstable folder identities.
- Integration coverage makes alias-order stability a deterministic contract instead of an implicit assumption.

**What it costs**:
- The chosen identity can still depend on normalized candidate order. Mitigation: keep that rule explicit and tested because it matches current packet expectations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future refactors replace first-candidate behavior with canonical-rewrite behavior | M | Preserve the order-stability integration test as a regression gate |
| Cross-platform symlink differences hide alias behavior | L | Keep canonical-path dedupe and integration coverage centered on stable folder output |
<!-- /ANCHOR:adr-013-002-consequences -->

---

<!-- ANCHOR:adr-013-002-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`

**How to roll back**: revert the canonical-root dedupe change, remove the alias-order stability assertions, and re-run the folder-discovery integration suite.
<!-- /ANCHOR:adr-013-002-impl -->
<!-- /ANCHOR:adr-013-002 -->

<!-- /ANCHOR:source-013 -->

---
---

<!-- ANCHOR:source-015 -->
## Source: 015 -- Bug Fixes and Alignment

---

<!-- ANCHOR:adr-015-001 -->
## ADR-001: Fix-in-place vs Refactor Approach

| Field     | Value                                          |
| --------- | ---------------------------------------------- |
| Status    | Accepted                                       |
| Date      | 2026-03-07                                     |
| Deciders  | Audit review (40-agent consensus)              |

### Context

The audit found 35 P1 code bugs across algorithms, scoring, graph, handlers, mutation, and scripts. Two approaches are possible: (1) targeted fix-in-place with minimal change surface, or (2) broader refactoring to address root causes.

### Decision

**Fix-in-place with targeted guards.** Each bug gets the minimal fix (validation, guard clause, type check) rather than architectural refactoring. Rationale:

1. The codebase is architecturally sound (no circular deps, clean layer separation)
2. Most bugs are input validation gaps, not design flaws
3. Minimal change surface reduces regression risk
4. The scoring pipeline is performance-critical; refactoring risks latency regression

### Consequences

- Positive: Low risk, fast execution, testable changes
- Negative: Some root causes (e.g., NaN propagation paths) may have additional entry points not caught by this audit. Future scoring changes should include NaN-safety as a review criterion.
<!-- /ANCHOR:adr-015-001 -->

---

<!-- ANCHOR:adr-015-002 -->
## ADR-002: Ollama Provider Resolution

| Field     | Value                  |
| --------- | ---------------------- |
| Status    | Accepted               |
| Date      | 2026-03-07             |

### Context

`validateApiKey()` lists ollama as a valid local provider (skips key check), but `createEmbeddingsProvider()` throws "not yet implemented" for ollama. This disagreement confuses callers.

### Decision

**Remove ollama from the local providers list in `validateApiKey()`.** Ollama support is not implemented and should not pass validation. When ollama is actually implemented, re-add it to both validation and factory.

### Consequences

- Positive: Validation and factory agree; callers get clear error early
- Negative: Users who set `EMBEDDINGS_PROVIDER=ollama` will now get a validation error instead of a "not yet implemented" error from factory. This is actually better UX.
<!-- /ANCHOR:adr-015-002 -->

---

<!-- ANCHOR:adr-015-003 -->
## ADR-003: Dead retry.ts Removal

| Field     | Value                  |
| --------- | ---------------------- |
| Status    | Accepted               |
| Date      | 2026-03-07             |

### Context

`mcp_server/lib/utils/retry.ts` (365 lines) is a complete duplicate of `shared/utils/retry.ts` (379 lines). Only consumed by its own test file. All production code imports from `@spec-kit/shared`.

### Decision

**Delete `mcp_server/lib/utils/retry.ts` and its test file.** The canonical implementation in `shared/utils/retry.ts` is the single source of truth.

### Consequences

- Positive: Eliminates drift risk between two independent retry implementations
- Negative: None. Test coverage for retry is maintained via `shared/` test suite.
<!-- /ANCHOR:adr-015-003 -->

---

<!-- ANCHOR:adr-015-004 -->
## ADR-004: Source File Table Inflation

| Field     | Value                  |
| --------- | ---------------------- |
| Status    | Accepted               |
| Date      | 2026-03-07             |

### Context

~50 feature catalog docs list 30-200+ source files per feature, most of which are shared infrastructure files unrelated to the specific feature. This was caused by auto-generation without filtering.

### Decision

**Accept current state for this sprint. Flag for future cleanup.** Reason: the tables are not incorrect (the listed files are part of the system), just non-actionable. Fixing 50 files is high-effort low-impact busywork. Add a note in the feature catalog README about the inflation pattern.

### Consequences

- Positive: Avoids 50-file documentation churn
- Negative: Source traceability remains noisy. Future catalog updates should use feature-specific file lists.
<!-- /ANCHOR:adr-015-004 -->

---

<!-- ANCHOR:adr-015-005 -->
## ADR-005: No-Database Fallback Path Strategy

| Field     | Value                  |
| --------- | ---------------------- |
| Status    | Accepted               |
| Date      | 2026-03-07             |

### Context

`memory-crud-update.ts` and `memory-crud-delete.ts` have fallback paths when the database handle is null. These paths skip transactions and causal edge cleanup, risking partial state.

### Decision

**Convert no-database fallback to early return with warning log.** If the database handle is absent, the operation should not proceed silently. Log a warning and return a structured error response indicating the database is unavailable.

### Consequences

- Positive: Eliminates silent partial-state risk
- Negative: Callers that relied on the fallback path (if any) will now get an error. This is the correct behavior -- operations without a database should fail explicitly.

### Five Checks Evaluation

| Check                   | Pass |
| ----------------------- | ---- |
| Necessary now?          | Yes  |
| Alternatives considered | Yes  |
| Simplest sufficient?    | Yes  |
| On critical path?       | Yes  |
| No tech debt?           | Yes  |
<!-- /ANCHOR:adr-015-005 -->

---

<!-- ANCHOR:adr-015-006 -->
## ADR-006: Verification-First Prioritization Over Inherited Breadth

| Field     | Value                                         |
| --------- | --------------------------------------------- |
| Status    | Accepted                                      |
| Date      | 2026-03-07                                    |
| Deciders  | Spec maintainer review + direct verification  |

### Context

This spec currently contains a large inherited backlog from a prior 40-agent audit. New direct verification plus post-fix refresh evidence on 2026-03-07 shows a narrower active set: `npm run check` is green, `npm run check:full` is now green after follow-up fixes and contract alignment, and checkpoint/scope fixes in this packet are confirmed. Treating all inherited findings as equally current still creates planning noise and hides immediate release blockers.

### Decision

**Prioritize reproduced findings first, keep inherited audit findings as provisional backlog.**

Execution order:
1. Resolve verification-aligned findings with current-state evidence, preserving green `npm run check` and `npm run check:full` gates after follow-up fixes and contract alignment.
2. Track inherited P0/P1/P2 findings as candidate backlog until each item is reproduced or explicitly deprioritized.
3. Gate release-readiness on current verification health and documentation truthfulness, not inherited count totals.

### Consequences

- Positive: Release decisions are based on current, reproducible evidence.
- Positive: Immediate blockers become visible and actionable in plan/tasks/checklist.
- Negative: Some inherited findings may remain unresolved in this cycle.
- Mitigation: Keep inherited findings listed, but require reproduction before promotion to active blocker status.
<!-- /ANCHOR:adr-015-006 -->

---

<!-- ANCHOR:adr-015-007 -->
## ADR-007: Canonical Merge Governance for 008 (Supersede 009 + 010)

| Field     | Value                                                       |
| --------- | ----------------------------------------------------------- |
| Status    | Accepted                                                    |
| Date      | 2026-03-07                                                  |
| Deciders  | Spec maintainer review + merge-normalization pass           |

### Context

Folder `008-combined-bug-fixes` now acts as the canonical active destination for this remediation track, while the folded remediation-epic lineage and an earlier audit folder contain unique history that should not be lost:

- The remediation-epic lineage now folded into `008-combined-bug-fixes` preserves root ADR context (including ADR-001 through ADR-003 in its inherited decision stream).
- `009-architecture-audit` preserves cross-AI audit provenance and handover state, including historical test snapshot metadata (`243 files`, `7205 tests`).

These records include contradictory completion statements across time. Blindly copying all claims into canonical 008 would re-introduce truth drift.

### Decision

**Use 008 as the single active canonical folder and treat 009/010 plus 015 source streams as historical artifacts.**

Operational rules:
1. 008 is the only active planning truth for open/closed status.
2. 009 and 010 remain preserved and receive superseded pointers to 008.
3. Inherited completion claims are retained only as historical snapshots unless reproduced in current verification.
4. Handover provenance from 010 is referenced in canonical 008 summaries, but the source handover file in folder 010 is not edited in this merge.

### Consequences

- Positive: Single canonical source of truth for current status.
- Positive: Historical lineage remains auditable without folder deletion.
- Positive: Contradictory completion language is downgraded to snapshot context unless re-verified.
- Negative: Readers must distinguish "historical snapshot" from "current status" language.
- Mitigation: Explicit canonical merge notices in spec/checklist/implementation-summary documents.
<!-- /ANCHOR:adr-015-007 -->

---

<!-- ANCHOR:adr-015-008 -->
## ADR-008: Inherited 009 ADR Digest (Historical, Already Implemented)

| Field     | Value                                                           |
| --------- | --------------------------------------------------------------- |
| Status    | Accepted                                                        |
| Date      | 2026-03-07                                                      |
| Source    | Retired 009 ADR stream (ADR-001..003 historical digest) |

### Context

The material now housed in folder `008-combined-bug-fixes` contains the substantive rationale bodies for three historical decisions that were implemented before this archival fold-in but were not yet summarized in canonical 008 as historical context.

### Decision

**Absorb the decision substance from 009 ADR-001..003 into canonical 008 as inherited historical decisions already implemented.**

Inherited decision digest:
1. **Legacy V1 pipeline removal:** remove dead V1 pipeline code and keep V2 as sole runtime path to eliminate dead-path P0 exposure.
2. **Shared `resolveEffectiveScore()`:** use one shared score-resolution chain across Stage 2 and Stage 3 to prevent fallback drift.
3. **BM25 `simpleStem` double-consonant handling:** after `-ing`/`-ed` stripping, collapse doubled consonants to avoid asymmetric stems (for example, `running` -> `run`).

### Consequences

- Positive: 015 retains decision rationale even if 009 is retired.
- Positive: Historical implementation intent stays auditable without reopening superseded folders.
- Negative: These are snapshot statements; they do not substitute for current-branch re-verification.
<!-- /ANCHOR:adr-015-008 -->

---

<!-- ANCHOR:adr-015-009 -->
## ADR-009: Final Archival Fold-In and Folder Retirement (009 + 010)

| Field     | Value                                                |
| --------- | ---------------------------------------------------- |
| Status    | Accepted                                             |
| Date      | 2026-03-07                                           |
| Supersedes | ADR-007 operational rule #2 (preserve 009/010 live) |

### Context

Unique historical content from 009 (ADR bodies + remediation execution details) and 010 (handover/session continuity details) is now absorbed into 015 and related canonical docs. Downstream mapping references are normalized to 015.

### Decision

**Retire the formerly separate remediation-epic lineage now folded into `008-combined-bug-fixes` and `009-architecture-audit` as live spec folders after archival fold-in sufficiency checks pass.**

Operational rules:
1. 015 remains the only live canonical folder for this remediation track.
2. 009/010 content persists only through historical digests in canonical 008 and normalized downstream references.
3. Resume/navigation pointers must target 015 or subsequent active folders (for example, 011/012), not deleted legacy folders.

### Consequences

- Positive: Removes split-canonical ambiguity and folder-level drift.
- Positive: Preserves unique historical context while reducing maintenance surface.
- Negative: Legacy direct folder paths for 009/010 become invalid.
- Mitigation: Keep explicit historical snapshot language in canonical 008 and mapping notes in related docs.
<!-- /ANCHOR:adr-015-009 -->

<!-- /ANCHOR:source-015 -->
