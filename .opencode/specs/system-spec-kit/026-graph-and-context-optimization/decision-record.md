---
title: "Decision Record: Graph and Context Optimization"
description: "Records the coordination decisions that keep the 026 parent packet aligned with its child packet train."
trigger_phrases:
  - "026 root decision record"
  - "graph context optimization adr"
importance_tier: "important"
contextType: "decision-record"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: Graph and Context Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the 026 root packet coordination-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | 026 packet audit pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 026 folder contains many child packets with their own research and runtime ownership. The root packet needs to explain sequencing and completion without duplicating child packet content or claiming local authority over behavior that lives elsewhere.

### Constraints

- Parent docs must validate cleanly under the active Level 3 template.
- Child packets remain the source of truth for runtime and research specifics.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep the root packet limited to coordination, handoff, and verification truth.

**How it works**: The parent `spec.md` records the phase documentation map, the child dependency edges, and the coordination-only scope. Companion docs point back to child packet evidence instead of replaying child packet details.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Coordination-only root** | Keeps the parent compact and truthful | Requires explicit references back to child docs | 9/10 |
| Restated child details in the root | More context in one file | Creates immediate drift against child-owned docs | 4/10 |

**Why this one**: The root packet only needs to help people navigate and verify the train. Repeating child-owned behavior would create maintenance debt without adding real authority.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The parent packet becomes validator-compliant and usable for resume and audit work.
- Child packet ownership stays clear.

**What it costs**:
- Reviewers have to follow links into child packets for detailed behavior. Mitigation: keep the parent phase map and evidence references explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parent packet drifts from child sequencing | M | Reconcile the root packet against child packet docs during audits |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The root packet previously failed validation and could not explain the train clearly |
| 2 | **Beyond Local Maxima?** | PASS | The alternative of repeating child content was considered and rejected |
| 3 | **Sufficient?** | PASS | Coordination-only wording solves the parent drift without widening scope |
| 4 | **Fits Goal?** | PASS | The packet's goal is navigation and verification, not runtime ownership |
| 5 | **Open Horizons?** | PASS | The child train can evolve without forcing the root packet to restate behavior |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Root `spec.md` now carries the parent phase map and handoff rules.
- Root companion docs now exist and capture verification evidence.

**How to roll back**: Revert the root packet docs, restore the previous parent state, and re-apply only the missing template sections and phase-map entries.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Split `006-canonical-continuity-refactor` into five focused phases

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | 026 packet reorganization pass |

---

### Context

The former `006-canonical-continuity-refactor` packet had grown to 19 sub-phases spanning gates, revisit work, cleanup, playbook remediation, and research follow-up. That concentration made the packet hard to navigate and blurred the thematic boundaries between execution, verification, and investigation work.

### Constraints

- The root packet docs must preserve the existing frontmatter and companion-doc structure.
- Reorganization should clarify navigation without rewriting child-owned narrative content.

---

### Decision

**We chose**: split `006-canonical-continuity-refactor` into five focused phases.

**How it works**: The former 006 scope is now distributed across `006-continuity-refactor-gates`, `007-release-alignment-revisits`, `008-cleanup-and-audit`, `009-playbook-and-remediation`, and `010-search-and-routing-tuning`. The former top-level `007` scope is now tracked as `011-skill-advisor-graph`.

---

### Consequences

**What improves**:
- Navigation is clearer because gates, revisits, cleanup, remediation, and research now have separate top-level homes.
- Thematic boundaries are explicit in the root phase map and companion docs.

**What it costs**:
- Root docs and cross-references need a one-time update to keep phase counts and names aligned.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy references to old 006 structure remain in parent docs | M | Sweep root packet docs for old phase names and counts during the reorganization pass |

---

### Implementation

**What changes**:
- Root packet docs now list 11 active phases instead of the older 6-phase root map.
- Cross-references move the former 006 sub-groups into phases `006` through `010`, and the former top-level `007` references now point to `011-skill-advisor-graph`.

**How to roll back**: Revert the root-doc reorganization references and restore the previous parent phase map if the split is reversed.

---

### ADR-003: Consolidate phases 015-020 into four thematic packets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | 026 packet consolidation pass |

---

### Context

After the 014-memory-save-rewrite shipped, the 026 train extended into a deep-review / foundational-runtime / CLI-executor arc via six new phases: 015 (implementation deep-review), 016 (foundational-runtime research charter), 017 (review-findings remediation against 016), 018 (cli-executor feature: native + cli-codex), 019 (cli-executor runtime matrix: cli-copilot + cli-gemini + cli-claude-code), and 020 (30-iter deep-research remediation against 018's research root). Each pair coupled tightly: 016 and 017 shared primitives and a single CONDITIONAL→PASS verdict, 018 and 019 shipped the same YAML-owned dispatch surface, and 020 was downstream remediation of 018/019. Keeping six separate top-level packets obscured the thematic grouping and forced cross-references that restated shared context.

### Constraints

- The consolidation must preserve history: every former sub-packet narrative and `implementation-summary.md` must remain locatable under the consolidated parent.
- Root packet docs and the validator must stay coordination-only.
- Cross-references across the repo must be swept to the new folder names.

---

### Decision

**We chose**: consolidate the former 015-020 range into four thematic packets — `015-deep-review-and-remediation`, `016-foundational-runtime`, `017-sk-deep-cli-runtime-execution`, and `018-cli-executor-remediation`.

**How it works**:
- The former 016 research charter and former 017 remediation merged into `016-foundational-runtime` with five preserved sub-phases: `001-initial-research`, `002-infrastructure-primitives`, `003-cluster-consumers`, `004-rollout-sweeps`, `005-p2-maintainability`.
- The former 018 executor feature and former 019 runtime matrix merged into `017-sk-deep-cli-runtime-execution` with two preserved sub-phases: `001-executor-feature`, `002-runtime-matrix`.
- The former 020 research-findings remediation was renamed to `018-cli-executor-remediation` at the same depth as its predecessor.
- The former 015 implementation deep-review absorbed its remediation plan and became `015-deep-review-and-remediation`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four thematic packets** | Each arc has one parent summary, one release-notes anchor, and one coordination surface | Requires one-time sweep of cross-references | 9/10 |
| Keep six separate packets | No migration work | Six parents restating shared context; release alignment becomes ambiguous | 4/10 |

**Why this one**: Keeps the shipped arc visible as one unit per theme while preserving every sub-packet's history in child folders.

---

### Consequences

**What improves**:
- Release-notes alignment is obvious (v3.4.0.1 and v3.4.0.2 belong to the 016 arc; v3.4.0.3 belongs to the 017+018 arc).
- Navigation is easier because each arc has one parent packet.

**What it costs**:
- Cross-references across the repo had to be swept to the new names. Commit `6ea12ddc2 chore(026): consolidate phases 015-020 into 4 thematic packets` covers the sweep.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy references to ex-016/017/018/019/020 remain in unrelated docs | M | One-time sweep via `rg` and validator runs; rely on the CI doc-graph to flag orphans |

---

### Implementation

**What changes**:
- Root packet docs now list 18 active phases.
- The executive summary, phase documentation map, phase handoff criteria, and complexity assessment reflect the four thematic packets.

**How to roll back**: Revert the consolidation commit, restore the six prior top-level folders, and sync the root packet phase map back to the ex-015 through ex-020 shape.
