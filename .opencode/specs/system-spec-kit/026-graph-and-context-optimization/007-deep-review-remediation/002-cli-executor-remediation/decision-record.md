---
title: "...spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/decision-record]"
description: "ADRs for Phase 020: enrich schema_mismatch vs new dispatch_failure; merge-preserve repair policy; save-lineage enum; retry-budget docs-vs-code."
trigger_phrases:
  - "020 decisions"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation"
    last_updated_at: "2026-04-18T15:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "ADRs drafted"
    next_safe_action: "Begin Wave A"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Phase 020 Research-Findings Remediation

---

<!-- ANCHOR:adr-001 -->
## ADR-010: Sibling `dispatch_failure` event, not `schema_mismatch` enrichment

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

<!-- ANCHOR:adr-001-context -->
### Context

Research.md §13 raised whether R2 should enrich the existing `schema_mismatch` event with executor provenance or add a new typed `dispatch_failure` sibling event. The two cases are different failure modes:
- `schema_mismatch`: a record exists but is malformed or missing required fields.
- `dispatch_failure`: the dispatch itself crashed and no record was produced.

Enriching `schema_mismatch` covers the first; the second still has nothing to attach provenance to.

### Constraints

- Existing reducer consumers key on `event` field discriminator.
- Future analytics needs to distinguish "we got output but it's wrong" from "we got no output."
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Both. Enrich `schema_mismatch` with optional `executor` field (backward-compatible), AND add a new typed `dispatch_failure` event for the no-record-produced case.

**How it works**: `post-dispatch-validate.ts` emits `schema_mismatch` with `executor` when a record exists but fails validation. `executor-audit.ts#emitDispatchFailure` emits `dispatch_failure` with `executor` when the dispatch crashed, timed out, or produced no output.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Both events** | Covers both failure modes; backward-compatible | Two code paths to maintain | 9/10 |
| Enrich schema_mismatch only | Minimal change | No-record case still anonymous | 5/10 |
| New dispatch_failure only | Clean separation | Schema_mismatch still needs executor for data-present failures | 4/10 |

**Why this one**: Each event has a genuinely different meaning. Users analyzing logs need to distinguish "bad output" from "no output." The discriminator cost is small.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: Failure attribution complete across both modes.

**What it costs**: Two emit sites to maintain. Mitigated by shared `executor-audit.ts` helper.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reducer code paths diverge over time | Med | Share helper; single point of change |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Data-loss surface from research.md §5 F4 |
| 2 | Beyond Local Maxima? | PASS | 3 alternatives evaluated |
| 3 | Sufficient? | PASS | Both modes covered |
| 4 | Fits Goal? | PASS | Addresses R2 directly |
| 5 | Open Horizons? | PASS | Extensible to new failure modes |

**Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

- `executor-audit.ts`: `emitDispatchFailure(stateLogPath, executor, reason, iteration)` writes the new event.
- `post-dispatch-validate.ts`: when emitting `schema_mismatch`, include `executor` from the incoming dispatch context.

**Rollback**: single-commit revert of Wave A restores Phase 018/019 behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-011: Merge-preserve repair policy — canonical wins, authored preserved

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

### Context

Research.md §7 theme: "Preserve-on-repair matters more than regenerate-from-source convenience." The merge policy for `mergePreserveRepair` needs an explicit rule set. Three possibilities:
- (A) Authored always wins — safest but conflicts with canonical fields that must be derived.
- (B) Canonical always wins, authored always preserved on non-conflicting keys — loses no data while keeping derived invariants.
- (C) Most-recent-wins timestamp resolution — flaky, depends on clock accuracy.

### Decision

**(B)**: Canonical derived fields always win. Authored narrative + extension keys always preserved. Conflicts on canonical fields silently prefer canonical; logging the preference for audit.

### Consequences

- Users can trust that description.json repairs never silently destroy narrative content.
- Canonical `lastUpdated`, `specId`, `folderSlug`, `parentChain` are always correct post-repair.
- Extension keys (user-added sections) stay intact.

### Implementation

- `repair.ts#mergePreserveRepair(partial, target, canonicalOverrides)`:
  - Start with `partial` as base.
  - Overwrite with `canonicalOverrides` keys.
  - Any keys in `partial` NOT in `canonicalOverrides` stay from `partial`.
  - Emit a `repair_action` record listing preserved + overridden keys for audit.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-012: Save-lineage enum — start narrow, extend on need

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

### Context

R6 adds a `save_lineage` tag to graph-metadata.json `derived.*`. Research.md §13 asked whether the enum should be narrow (`description_only` / `graph_only` / `same_pass`) or richer (`backfill` / `migration` / `restore` / etc.).

### Decision

Start with the 3-value narrow enum. Extend only when telemetry shows meaningful additional lineage modes.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] 3-value narrow** | Matches observed lineage channels; easy to reason about | May need extension later | 8/10 |
| 6-value rich | Future-proof | Most values speculative; dead enum members | 5/10 |
| Open string | No maintenance | No validation; drift risk | 3/10 |

**Why this one**: Matches what research.md §6 Q1 actually observed. Extension is non-breaking (add new enum values).
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-013: Keep N=3 and 10-minute threshold; fix docs, add telemetry

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

### Context

Research.md §5 (F14, F7) and §6 Q5/Q10: both `MAX_RETRIES = 3` and the 10-minute continuity threshold are heuristic, not calibrated. Two options for R7 + R8:
- (A) Tune the numbers now based on our best guess.
- (B) Keep the numbers; fix the docs to say "heuristic"; add telemetry to enable later data-driven tuning.

### Decision

**(B)**. No numeric changes in this packet. Docs honesty + telemetry hooks only.

### Consequences

- Behavior unchanged for current users.
- Future numeric-tuning packet gated on telemetry data from R8.
- No regressive risk from bad guess.
<!-- /ANCHOR:adr-004 -->
</content>
</invoke>
