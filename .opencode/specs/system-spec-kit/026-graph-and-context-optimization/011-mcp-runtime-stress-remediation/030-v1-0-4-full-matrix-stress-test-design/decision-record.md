---
title: "Decision Record: v1.0.4 Full-Matrix Stress Test Design"
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
description: "Level 3 design decisions for the full-matrix v1.0.4 stress test: scope, matrix abstraction, scoring, harness architecture, executor reachability, and comparability."
trigger_phrases:
  - "full matrix decision record"
  - "v1.0.4 stress ADR"
  - "harness option A B C"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"
    last_updated_at: "2026-04-29T11:40:34Z"
    last_updated_by: "codex"
    recent_action: "Design ADRs authored"
    next_safe_action: "Use ADR-004 recommendation when preparing the execution packet"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:030-full-matrix-decisions"
      session_id: "030-full-matrix-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Decision Record: v1.0.4 Full-Matrix Stress Test Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Level 3 for the Design Packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex, user direction |

### Context

The packet designs a matrix across 14 feature surfaces, 7 executor surfaces, scenario classes, rubric semantics, harness architecture, and future execution sequencing. The Level 3 template is appropriate because the key work is architecture and coordination, not a small documentation update.

### Decision

**We chose**: Level 3.

**How it works**: `decision-record.md` records the design choices, while `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `corpus-plan.md` carry the execution-ready corpus and gating details.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level 3** | Documents ADRs, risk, executor matrix, and architecture choices | More docs than Level 2 | 9/10 |
| Level 2 | Faster and verification-focused | Weak for harness architecture and executor trade-offs | 5/10 |
| Level 3+ | Strong governance | Too much ceremony; no compliance sign-off requested | 6/10 |

**Why this one**: Level 3 is the smallest level that can honestly hold the architectural decisions without creating governance noise.

### Consequences

**What improves**:

- Future execution can start from a stable plan instead of rediscovering the matrix.
- ADRs make the harness and comparability choices reviewable.

**What it costs**:

- More packet content. Mitigation: keep execution artifacts out of this design packet.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
### ADR-002: Map the Larger Catalog Into F1-F14 Stress Surfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex |

### Context

The root feature catalog currently lists broad categories through `22--context-preservation-and-code-graph` (`feature_catalog.md:18`, `:39`), and the manual playbook lists corresponding category roots through `22--context-preservation-and-code-graph` (`manual_testing_playbook.md:18`, `:40`). The user asked for F1-F14 minimum coverage, including stress-testing and W3-W13 search features.

### Decision

**We chose**: Treat F1-F14 as the stress matrix abstraction over the current catalog, not as a claim that the on-disk catalog has only 14 categories.

**How it works**: Each F-category maps multiple catalog/playbook entries into one stressable surface. F14 covers the W3-W13 search remediation thread, while the underlying catalog still keeps W3-W13 distributed across retrieval, scoring, query intelligence, graph, and telemetry documents.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **F1-F14 abstraction** | Matches user request and current inventory | Requires mapping discipline | 9/10 |
| Test every catalog entry individually | Maximum coverage | Hundreds of cells per executor; not practical for first run | 4/10 |
| Stop at on-disk `14--pipeline-architecture` | Simple | False: misses newer categories and the separate `14--stress-testing` root | 2/10 |

**Why this one**: It is honest about the current catalog while keeping the first full matrix executable.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
### ADR-003: Score Scenario Cells and Roll Up Per Feature x Executor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex |

### Context

The stress-test pattern defines the generalized four dimensions and 0-2 scale (`14--stress-testing/01-stress-test-cycle.md:40`, `:49`). The user asked for aggregation per `(feature x CLI)` while also asking cells to be `feature x CLI x scenario`.

### Decision

**We chose**: The atomic scored row is `feature x executor x scenario`. The report rolls those rows up into `feature x executor` aggregates.

**How it works**: Each scenario row has four dimension scores. `NA`, `SKIP`, and `UNAUTOMATABLE` are not scored and are excluded from denominators. The sidecar reports both scenario-level scores and feature-executor rollups.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scenario rows with feature-executor rollup** | Preserves detail and satisfies aggregate request | Sidecar is larger | 9/10 |
| One score per feature-executor only | Compact | Hides which scenario failed | 5/10 |
| One score per feature only | Very compact | Loses executor variance | 2/10 |

**Why this one**: The matrix exists to expose surface and executor variance; scenario rows are the only honest unit.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
### ADR-004: Use Per-Feature Runners Plus a Meta-Aggregator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex |

### Context

The search-quality harness is built around retrieval channels and now exports telemetry through `telemetryExportPath` (`harness.ts:103`, `:199`, `:239`). It is valuable for F3/F4/F14 but not naturally suited for spec-folder creation, hooks, deep-loop state machines, or CLI dispatch.

### Decision

**We chose**: Option C, per-feature stress runners under each feature's existing test surface, plus a generic meta-aggregator that reads normalized JSONL.

**How it works**: Each feature owner emits normalized cell rows. The aggregator knows the schema and math, not the feature internals.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Option A: extend search-quality harness to be feature-agnostic | One harness, central runner | Overloads a retrieval harness; significant churn | 5/10 |
| Option B: new lightweight orchestrator invoking per-cell scripts | Simple and generic | More dispatch overhead; weaker feature locality | 7/10 |
| **Option C: per-feature runners plus meta-aggregator** | Local feature expertise, low harness churn, generic aggregation | Requires normalized result discipline | 9/10 |

**Why this one**: It keeps the search harness focused and makes every feature prove its own behavior through the nearest existing surface.

### Consequences

**What improves**:

- Feature-specific setup stays close to existing tests/playbooks.
- The aggregator can remain small and auditable.
- Search telemetry work from PP-1/PP-2 remains reusable without becoming the whole system's harness.

**What it costs**:

- First execution needs a cell result schema and adapter discipline. Mitigation: make T006-T009 schema setup mandatory before per-feature batches.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
### ADR-005: Treat Non-Applicable Cells as First-Class Results

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex |

### Context

Some features cannot be truthfully exercised through every executor. For example, prompt-time hook mutation differs by runtime: Copilot uses a custom-instructions workaround because prompt mutation is unavailable through hook stdout (`cli-copilot/SKILL.md:183`, `:188`; `skill-advisor-hook.md:55`, `:64`).

### Decision

**We chose**: Mark `NA`, `SKIP`, and `UNAUTOMATABLE` explicitly, outside scoring denominators.

**How it works**: Every manifest cell must produce either a scored result or a reasoned non-score status. The final findings must headline those counts.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **First-class non-score statuses** | Honest and auditable | More rows | 10/10 |
| Omit non-applicable cells | Cleaner table | Hides coverage gaps | 2/10 |
| Score non-applicable as zero | Punishes impossible surfaces | Misleading | 1/10 |

**Why this one**: Full-matrix credibility depends on showing what could not be tested.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
### ADR-006: Make the Full Matrix a New Baseline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex |

### Context

v1.0.2 used a 30-cell CLI-model rubric. Packet 029 used 12 search-quality cases and 16 telemetry captures, and explicitly said v1.0.2 was not exact same-cell comparable (`029-stress-test-v1-0-4/findings-v1-0-4.md:25`, `:129`, `:150`). The future full matrix is likely 220-260 applicable/scored-or-fixture cells.

### Decision

**We chose**: The full matrix becomes baseline `full-matrix-v1`. Prior cycles are directional context only unless a cell ID matches exactly.

**How it works**: The sidecar comparison block must set `comparable=false` for v1.0.2, v1.0.3, and packet 029. Regression-safety scores use "first full-matrix baseline" semantics until a later same-cell full-matrix run exists.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New full-matrix baseline** | Honest and durable | No aggregate delta on first run | 10/10 |
| Compare aggregate percent to packet 029 | Tempting headline | Invalid denominator and scope | 1/10 |
| Force old cells into new matrix only | Easier comparability | Fails the user's full-surface requirement | 3/10 |

**Why this one**: The new run measures a different universe; same-cell comparison must start with the first full matrix.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
### ADR-007: Batch by Feature After Executor Smoke

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-29 |
| **Deciders** | Codex |

### Context

Batching by CLI simplifies provider setup but scatters feature-specific fixtures. Batching by feature keeps setup local and lets one scenario definition drive all applicable executors.

### Decision

**We chose**: Smoke by executor first, then run feature-first batches.

**How it works**: T001 proves each executor's basic availability. Then T010-T023 run F1-F14 batches across all applicable executors.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Executor smoke, then feature-first batches** | Localizes fixture logic and still catches executor blockers early | Needs manifest tracking | 9/10 |
| CLI-first batches | Provider setup efficient | Repeats feature fixture setup across CLIs | 6/10 |
| Fully parallel all cells | Fast in theory | Hard to debug, costly, rate-limit prone | 3/10 |

**Why this one**: It optimizes for debuggability and evidence quality over raw dispatch speed.
<!-- /ANCHOR:adr-007 -->
