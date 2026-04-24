---
title: "...ontext-optimization/006-search-routing-advisor/002-skill-advisor-graph/004-graph-metadata-enrichment/decision-record]"
description: "Level 3 ADRs for the shipped schema v2 skill metadata rollout and dual-schema compiler validation."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "graph metadata adr"
  - "schema v2 decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T14:05:00Z"
    last_updated_by: "gpt-5.4"
    recent_action: "Added the Level 3 ADRs that explain the shipped schema and compiler decisions"
    next_safe_action: "Keep packet docs and packet metadata aligned with these accepted decisions"
    key_files: ["decision-record.md", "spec.md", "graph-metadata.json"]
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Graph Metadata Enrichment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship schema v2 as an additive `derived` block

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | Packet maintainers for `011-skill-advisor-graph` |

---

<!-- ANCHOR:adr-001-context -->
### Context

The live skill metadata corpus needed richer routing and retrieval support than the original v1 shape could provide on its own. The packet review confirmed that the delivered corpus now includes `trigger_phrases`, `key_topics`, `key_files`, `entities`, `causal_summary`, `source_docs`, `created_at`, and `last_updated_at`, but the packet had not yet recorded why that richer shape was added without replacing the original top-level fields.

### Constraints

- Existing consumers already read the v1 top-level fields such as `skill_id`, `family`, `category`, `edges`, `domains`, and `intent_signals`.
- The rollout needed richer metadata without forcing every downstream consumer to change at once.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to ship schema version 2 by adding a `derived` block while keeping the original v1 fields intact.

**How it works**: The new metadata lives under `derived`, so the packet gains richer search, path, and narrative information without removing the fields older consumers already depend on. Existing readers can keep using the original fields, while newer consumers can opt into the additive metadata.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive schema v2 with `derived` block** | Preserves compatibility and adds richer metadata in a clear namespace | Slightly larger per-skill metadata files | 9/10 |
| Replace v1 with a new flat schema | Cleaner on paper for brand-new consumers | Breaks older consumers and complicates rollout | 4/10 |
| Keep schema v1 only | No migration work for consumers | Leaves routing and retrieval metadata unavailable | 3/10 |

**Why this one**: The additive `derived` block gave the rollout the metadata it needed without turning packet closure into a breaking-change migration.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Skill metadata now carries richer discovery and traceability fields.
- Existing consumers can keep reading the old fields without change.

**What it costs**:
- Metadata files are larger than the old v1-only versions. Mitigation: keep the new data namespaced under `derived` and validate it consistently.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer assumes only v1 exists | Medium | Keep the original top-level fields intact and document the additive rollout |
| Example docs drift from the live schema | Medium | Refresh packet examples from live metadata files such as `sk-deep-review` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review showed the live corpus already needed richer derived metadata |
| 2 | **Beyond Local Maxima?** | PASS | The packet considered replacement and no-change alternatives |
| 3 | **Sufficient?** | PASS | A single additive `derived` namespace covers the new fields without a breaking rewrite |
| 4 | **Fits Goal?** | PASS | The goal was enrichment without breaking existing consumers |
| 5 | **Open Horizons?** | PASS | The additive schema leaves room for future derived metadata growth |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Per-skill `graph-metadata.json` files move to `schema_version: 2`.
- New routing and retrieval metadata lives in the `derived` block.

**How to roll back**: Revert the schema v2 metadata files and restore the prior v1-only files, then rerun compiler validation before reopening the packet.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Keep compiler validation valid for both v1 and v2 metadata

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | Packet maintainers for `011-skill-advisor-graph` |

---

#### Context

Once the live corpus moved to schema v2, the validator still needed to support incremental rollout and historical compatibility. The review specifically asked for the packet to record that `skill_graph_compiler.py` validates both schema v1 and schema v2 so operators can verify mixed or transitional corpora without a forced all-at-once cutover.

#### Constraints

- The compiler is the canonical validation surface for the skill metadata corpus.
- Operators need a single validation command that works during rollout and after rollout.

---

#### Decision

**We chose**: to keep `skill_graph_compiler.py` valid for both schema v1 and schema v2 metadata files.

**How it works**: The compiler accepts legacy v1 files and the richer v2 files, then validates the `derived` block only when schema v2 is present. That keeps rollout incremental and lets the same validation command prove compatibility across both shapes.

---

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Validate both v1 and v2** | Supports incremental rollout and historical compatibility | Validator logic is slightly more complex | 9/10 |
| Validate only v2 after rollout | Simpler long-term contract | Breaks mixed or transitional corpora | 5/10 |
| Keep separate validators for v1 and v2 | Explicit boundaries | More tooling and more operator confusion | 4/10 |

**Why this one**: One compiler path keeps operator workflow simple while still allowing the corpus to evolve safely.

---

#### Consequences

**What improves**:
- The same validation command works before, during, and after schema rollout.
- Packet closeout can describe incremental rollout honestly instead of assuming a flag day migration.

**What it costs**:
- The compiler must keep dual-schema validation logic. Mitigation: constrain the v2-specific checks to the `derived` block only when schema v2 is present.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The validator drifts and stops accepting one schema shape | High | Keep `--validate-only` in the packet verification surface |
| Operators assume the packet requires a flag day migration | Medium | Document the dual-schema validation decision in this ADR and the packet spec |

---

#### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The rollout needed a single validation surface for both old and new metadata |
| 2 | **Beyond Local Maxima?** | PASS | The packet considered v2-only and split-validator alternatives |
| 3 | **Sufficient?** | PASS | Dual-schema validation covers incremental rollout without multiplying tools |
| 4 | **Fits Goal?** | PASS | The goal was safe rollout and safe verification |
| 5 | **Open Horizons?** | PASS | The compiler can keep validating historical packet state while newer metadata evolves |

**Checks Summary**: 5/5 PASS

---

#### Implementation

**What changes**:
- `skill_graph_compiler.py` accepts both schema v1 and schema v2 metadata files.
- Schema v2 validation adds `derived` block checks without removing legacy validation coverage.

**How to roll back**: Restore the prior compiler validation logic and reopen the packet because the incremental rollout guarantee would no longer hold.
