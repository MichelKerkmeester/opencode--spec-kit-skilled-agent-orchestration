---
title: "Decision Record: Memory Search Bug Fixes"
description: "Concise rationale for workflow serialization and alias-root stability decisions in spec 013"
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision record"
  - "workflow serialization"
  - "alias root"
  - "order stability"
  - "memory search bug fixes"
importance_tier: "normal"
contextType: "implementation"
---
# Decision Record: Memory Search Bug Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Serialize overlapping `runWorkflow()` invocations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-06 |
| **Deciders** | OpenCode @speckit packet authoring for spec 013 |

---

<!-- ANCHOR:adr-001-context -->
### Context

`runWorkflow()` temporarily mutates shared global config (`CONFIG.DATA_FILE`, `CONFIG.SPEC_FOLDER_ARG`) so each invocation can resolve the correct input source and packet context. Save-and-restore logic reduced leakage between sequential calls, but it did not fully protect overlapping runs because concurrent invocations could still observe each other's in-flight globals.

### Constraints

- The workflow already depends on shared process-global configuration in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`.
- This packet is a bug-fix packet, so the change needed to stay narrow and regression-oriented rather than redesigning the workflow API.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: serialize overlapping `runWorkflow()` calls and keep save-and-restore as a secondary safeguard.

**How it works**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` now runs each invocation behind a workflow lock, then restores the prior config state when the run finishes. `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` adds deterministic regression coverage proving two overlapping calls observe their own per-run config and leave globals reset afterward.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Serialize + restore** | Fixes the actual race, keeps existing surface area, easy to prove with tests | Reduces parallelism for this workflow path | 9/10 |
| Restore-only approach | Minimal code churn | Still unsafe under overlap because globals remain shared during execution | 5/10 |
| Full refactor away from globals | Best long-term isolation model | Too large for this packet and higher regression risk | 6/10 |

**Why this one**: This packet needed a reliable bug fix, not a workflow architecture rewrite. Serialization addressed the real concurrency hazard while preserving the current API and keeping verification focused.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
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
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`

**How to roll back**: remove the workflow lock, restore the previous direct invocation path, and re-run the task-enrichment suite to confirm the prior behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve first-candidate alias-root semantics and add order-stability coverage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-06 |
| **Deciders** | OpenCode @speckit packet authoring for spec 013 |

---

<!-- ANCHOR:adr-002-context -->
### Context

Folder discovery can see the same spec tree through aliased roots such as `specs/` and `.opencode/specs/`. The bug fix needed canonical dedupe so discovery would not double-scan the same tree, but existing behavior also depended on retaining the first valid candidate path rather than rewriting identities after canonicalization.

### Constraints

- The discovery path in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` must stay deterministic across symlink and canonical-path permutations.
- This packet aimed to harden behavior with minimal semantic change, so preserving established first-candidate semantics was safer than redefining folder identity rules.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: dedupe alias roots by canonical path while preserving the first candidate that survives normalization, and lock that behavior in with deterministic regression coverage.

**How it works**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` skips duplicate canonical roots but keeps the first normalized candidate path in play. `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` now verifies stable folder identities regardless of alias-root order.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical dedupe + first-candidate retention** | Removes duplicates without changing the packet's expected identity semantics | Requires explicit regression coverage to avoid future drift | 9/10 |
| Always prefer canonical realpath output | Simpler conceptual rule | Could silently change existing folder identities and cache behavior | 6/10 |
| Keep alias duplicates | No behavior change for ordering | Preserves duplicate scanning and stale-cache bugs | 3/10 |

**Why this one**: The packet needed bug-fix stability, not a new identity model. Preserving first-candidate semantics minimized compatibility risk while still fixing duplicate-root discovery issues.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
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
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`

**How to roll back**: revert the canonical-root dedupe change, remove the alias-order stability assertions, and re-run the folder-discovery integration suite.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
