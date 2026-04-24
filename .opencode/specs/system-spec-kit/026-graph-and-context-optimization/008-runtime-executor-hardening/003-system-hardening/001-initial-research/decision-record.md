---
title: "...ph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/decision-record]"
description: "ADRs for 019/001: dispatch order and findings registry schema."
trigger_phrases:
  - "019 research wave adr"
  - "tier 1 dispatch adr"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Decision record scaffolded"
    next_safe_action: "Charter approval"
    key_files: ["decision-record.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: 019 Initial Research Wave

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Dispatch order — SSK-RR-2 first, then 026-scoped, then skill-wide

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Research wave author; user approval pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Six Tier 1 iterations can dispatch in many orders. Choosing poorly wastes compute on iterations whose assumptions are invalidated by later findings. The candidates differ in how their failure modes propagate:

- `SSK-RR-2` audits the canonical-save pipeline itself. If it finds the pipeline broken, every other research iteration that relies on pipeline integrity (writing findings, saving continuity, producing registry entries) is suspect.
- `DR-1` delta-reviews 015 findings. It doesn't depend on other Tier 1 items and is a useful early signal about which 015 issues remain.
- `RR-1` / `RR-2` are 026-scoped. They assume the canonical-save pipeline is trustworthy.
- `SSK-RR-1` / `SSK-DR-1` are skill-wide audits. They benefit from evidence produced by earlier iterations (e.g., SSK-DR-1's template/validator audit might incorporate findings from SSK-RR-2).

### Constraints

- Iterations dispatch through canonical skill-owned commands (Gate 4 HARD-block).
- Executor capacity is finite; parallel dispatch is capped by available cli-codex concurrency.
- Mid-wave interruption is possible but preserves more work if earlier waves are independent.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: wave-ordered dispatch with three waves — Wave 1 (SSK-RR-2 + DR-1 in parallel), Wave 2 (RR-1 + RR-2 in parallel), Wave 3 (SSK-RR-1 + SSK-DR-1 in parallel).

**How it works**:
- **Wave 1 starts immediately.** SSK-RR-2 surfaces infrastructure-integrity risks; DR-1 is independent and useful regardless of pipeline state.
- **Wave 2 dispatches after Wave 1 convergence.** If SSK-RR-2 surfaces a P0 canonical-save defect, the wave pauses and redirects to a hotfix child; otherwise proceeds.
- **Wave 3 dispatches after Wave 2.** Skill-wide audits benefit from evidence produced by earlier iterations and can incorporate cross-references to 026-scoped findings.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Wave-ordered (this decision)** | Surfaces infrastructure risks early; preserves earlier work if later waves pause | Sequential gating adds wall-clock time between waves | 9/10 |
| Strict sequential (one at a time) | Simplest to track | Severely delays total wall clock | 4/10 |
| All-parallel from day 1 | Shortest wall clock if everything succeeds | If SSK-RR-2 surfaces P0, five iterations' worth of work is wasted | 5/10 |
| Alphabetical by ID | Deterministic | No semantic basis; risks the all-parallel failure mode | 3/10 |

**Why this one**: Balances parallelism against blast-radius containment. The wave boundary preserves work if a P0 surfaces; within a wave, parallelism keeps wall clock low.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Infrastructure-integrity risks surface in Wave 1 before Waves 2+3 invest compute.
- Waves partition the work for easy audit and mid-wave decision-making.

**What it costs**:
- Total wall clock is ~8-11 days rather than ~5-7 days for full-parallel.
- Requires a convergence check at wave boundaries.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wave-gating adds latency when no P0 surfaces | L | Acceptable trade-off for blast-radius containment |
| Wave 1 converges slowly and blocks later waves | M | If SSK-RR-2 takes unusually long, allow DR-1 to be treated as a complete Wave 1 signal since DR-1 doesn't depend on SSK-RR-2 outcome |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without wave order, SSK-RR-2 P0 surfacing late would invalidate earlier iterations |
| 2 | **Beyond Local Maxima?** | PASS | All-parallel and strict-sequential alternatives considered |
| 3 | **Sufficient?** | PASS | Wave boundaries provide mid-wave decision points |
| 4 | **Fits Goal?** | PASS | Goal is grounded findings; wave order protects against speculative invalid findings |
| 5 | **Open Horizons?** | PASS | Wave structure allows mid-wave scope adjustment without discarding completed work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `plan.md §4 Phases` defines the three waves explicitly.
- `plan.md AI-DISPATCH-002` through `AI-DISPATCH-005` encode the ordering.
- `tasks.md Phase 2` groups tasks by wave.

**How to roll back**: If wave gating proves unnecessarily slow and no P0 emerges from Wave 1, a future similar wave could skip the wave boundary and dispatch fully parallel. Record the decision in a new ADR.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Findings registry schema — one row per finding, grouped by proposed cluster

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Research wave author; user approval pending |

---

### Context

Six iterations may produce 10-50+ findings. Downstream implementation children (`019/002-*`) must be able to scope their work from the registry. The registry schema determines whether that's easy or painful.

### Constraints

- Registry must be machine-parseable (REQ-006).
- Must support severity (P0/P1/P2), cluster grouping (ADR-002 of parent packet), and defer reasons.
- Must cross-reference original iteration evidence.

---

### Decision

**We chose**: markdown table schema with one row per finding, grouped by `proposed_cluster`. Mirror to `findings-registry.json` for machine parsing.

**How it works**:

| Column | Purpose |
|--------|---------|
| `finding_id` | Unique ID scoped to the iteration (e.g., `DR-1-001`, `RR-1-007`) |
| `source_iteration` | Tier 1 ID + iteration file reference |
| `severity` | P0 / P1 / P2 |
| `proposed_cluster` | Cluster slug (e.g., `canonical-save-integrity`, `nfkc-sanitizer-hardening`) |
| `file_or_surface` | Primary file or surface affected |
| `description` | 1-2 sentence summary |
| `defer_reason` | Empty or reason if the finding is explicitly deferred |
| `cross_refs` | IDs of overlapping findings from other iterations |

Rows are grouped in the markdown by `proposed_cluster`, with cluster-level headers. `findings-registry.json` mirrors the table content 1:1.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One row per finding, grouped by cluster (this decision)** | Direct mapping to implementation children | Requires cluster assignment at consolidation time | 9/10 |
| One row per iteration (aggregated findings per item) | Simpler | Hides within-iteration severity variance | 4/10 |
| One row per file or surface | Matches shipping unit | Loses per-finding traceability | 5/10 |
| Free-form narrative | Most expressive | Not machine-parseable | 2/10 |

**Why this one**: Best balance of machine-parseability and actionable cluster mapping.

---

### Consequences

**What improves**:
- Implementation children can extract scope directly from registry.
- Cross-iteration overlaps are explicit via `cross_refs`.
- Severity-first triage is easy.

**What it costs**:
- Cluster assignment requires human judgment at consolidation time.
- Schema must be kept consistent across iterations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cluster assignments drift across iterations | M | Define cluster slugs early; maintain a cluster glossary in `implementation-summary.md` |
| JSON mirror drifts from markdown | M | Generate JSON from markdown via script, or write schema-check tests |

---

### Implementation

**What changes**:
- `implementation-summary.md §Findings Registry` uses the schema above.
- Optional: `findings-registry.json` generated alongside.

**How to roll back**: If the schema proves too rigid, relax individual columns or add optional ones in a new ADR. No destructive rollback needed.

---

### ADR-003: Sub-packet per Tier 1 dispatch — canonical sk-deep-research owns one packet's state

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Plan mode approval for "start running all iterations" |

#### Context

The canonical `/spec_kit:deep-research :auto` and `/spec_kit:deep-review :auto` workflows each own one packet's worth of state: `deep-research-state.jsonl`, iteration markdown files, the deep-research-strategy output, `findings-registry.json`, the deep-research-dashboard output, the research.md output. Running multiple dispatches against a single packet collides this state.

The original 019/001 plan.md held six dispatch blocks inline under this single packet, planning for all 6 to run sequentially. That pattern would fail: each dispatch would overwrite the previous dispatch's state files.

#### Decision

**We chose**: one Level 2 sub-packet per Tier 1 item.

**How it works**: Six sub-packets (`001-006/`) are created under this packet, numbered by wave-dispatch order. Each sub-packet's `plan.md §4.1` contains one canonical `/spec_kit:deep-research :auto` or `/spec_kit:deep-review :auto` invocation. Output paths resolve via `resolveArtifactRoot()` to `026/research/019-system-hardening/001-initial-research/<NNN-slug>/` (one per sub-packet), avoiding collision.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sub-packet per dispatch** | Canonical workflow works; each dispatch owns its state | 6 Level 2 packets = 30 files to scaffold | 9/10 |
| Single packet, sequential dispatches with manual state rotation | Fewer folders | Error-prone; loses state on each rotation; skill doesn't support it | 2/10 |
| Single packet, parallel dispatches via backgrounded invocations | Faster | State collision unavoidable; canonical workflow forbids | 1/10 |

**Why this one**: Only option that respects the canonical workflow contract. The 30-file scaffolding cost is one-time; runtime benefits are durable.

#### Consequences

**What improves**:
- Each dispatch's state is isolated and auditable.
- Wave gating is explicit (sub-packet convergence per wave).
- Findings registry consolidates from 6 known sources.

**What it costs**:
- 30 files scaffolded at setup time.
- Parent docs (spec.md, plan.md, tasks.md, implementation-summary.md) refactored for coordination-only.
- Original embedded dispatch blocks removed from `plan.md §4.1` (retained as historical note).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sub-packets accumulate divergent scope | M | Each sub-packet references the same scratch doc; drift surfaces in findings registry |

#### Implementation

**What changes**:
- Six sub-packet folders created under `001-initial-research/`.
- Each sub-packet has 5 Level 2 docs + description.json + graph-metadata.json.
- Parent `spec.md §3.1`, `plan.md §4.1-4.2`, `tasks.md` reframed to coordination-only.
- Parent `decision-record.md` adds this ADR-003.

**How to roll back**: Archive sub-packets to `z_archive/` and restore the inline dispatch-block history (preserved in git log). Only warranted if the canonical workflow itself changes to support multi-stream packets.
