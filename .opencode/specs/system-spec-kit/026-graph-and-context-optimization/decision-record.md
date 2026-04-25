---
title: "Decision Record: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/decision-record]"
description: "Records decisions for consolidating the 026 active phase surface while preserving child phase folders."
trigger_phrases:
  - "026 graph and context optimization"
  - "026 phase consolidation"
  - "29 to 9 phase map"
  - "merged phase map"
  - "graph context optimization root packet"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-04-25T14:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Appended ADR-005 (post-push topology adjustment: rename 010-hook-parity to 009-hook-parity + remove post-hoc 009-memory-causal-graph documentation packet)"
    next_safe_action: "Use merged-phase-map.md and context indexes for navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:eedd47d8a93c36508e2f2fb7e0810d6467b298b0e4d6295125fb5bd10fb86805"
      session_id: "026-phase-consolidation-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Graph and Context Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Consolidate the active phase surface into nine thematic wrappers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-21 |
| **Deciders** | 026 phase consolidation pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

The root packet described a 19-phase train while the filesystem exposed 29 direct phase folders. Later phases were appended chronologically even when they were direct continuations of older themes, such as code graph packaging, search/advisor routing, deep-review remediation, runtime executor hardening, and hook parity.

### Constraints

- Every original phase packet must remain available.
- Root `research/`, `review/`, and `scratch/` folders must stay where they are.
- Runtime code is out of scope.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: replace the 29 direct top-level phase folders with nine active thematic wrappers.

**How it works**: Each wrapper has active Level 1 docs and a context index. Original folders live as direct children under the relevant thematic wrapper, while the single-source research packet is merged into phase `001`. Root `merged-phase-map.md` maps every old phase to its active home.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Nine thematic wrappers** | Preserves history while reducing active navigation | Requires metadata migration and bridge docs | 9/10 |
| Keep 29 top-level folders | No move needed | Navigation and validation remain noisy | 3/10 |
| Collapse to five broad themes | Smaller surface | Hides still-active areas like daemon/parity and code graph packaging | 6/10 |

**Why this one**: Nine themes match the actual story of the work without erasing active or scaffolded tracks.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Maintainers scan nine active folders instead of twenty-nine.
- Every old packet has an explicit child-phase path.
- Metadata preserves old IDs for continuity.

**What it costs**:
- Historical citations inside child packets may still describe old top-level paths. The bridge docs now carry the active mapping.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Old IDs disappear from graph lookup | H | Store old packet IDs in aliases and migration fields. |
| Child phase folders are mistaken for active phase work | M | Keep child folders under their thematic wrappers, not as root direct children. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Root map and filesystem disagreed. |
| 2 | **Beyond Local Maxima?** | PASS | Considered 29-folder and 5-folder alternatives. |
| 3 | **Sufficient?** | PASS | Nine wrappers cover every old phase. |
| 4 | **Fits Goal?** | PASS | Goal is active navigation reduction with history preservation. |
| 5 | **Open Horizons?** | PASS | New work can attach to thematic wrappers. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Old phase folders move under wrapper direct-child folders.
- Root docs describe nine active phases.
- Metadata records current paths and migration aliases.

**How to roll back**: Move child folders back to their old top-level names and restore root docs/metadata from version control.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Merge `008-skill-advisor/` and advisor-themed `009-hook-parity/` children into a single `008-skill-advisor/` wrapper

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-25 |
| **Deciders** | 026 second topical consolidation pass |

---

<!-- ANCHOR:adr-002-context -->
### Context

After the first consolidation pass (ADR-001) the skill-advisor system was browsable from two wrappers: `008-skill-advisor/` (search/routing tuning, advisor graph, phrase boosters, smart-router, docs/standards alignment, deferred remediation) and parts of `009-hook-parity/` (hook surface, daemon-and-advisor unification, plugin hardening, standards alignment, hook improvements). The split forced cross-wrapper navigation when reasoning about advisor changes and made advisor-themed migration aliases hard to keep coherent.

### Constraints

- Every original phase packet must remain intact under the new home.
- Migration aliases for the old `008-skill-advisor/` slug must be preserved for memory/graph continuity.
- No code changes; no rewriting of historical child narratives.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: merge `008-skill-advisor/` and the five advisor-themed children of `009-hook-parity/` into a single `008-skill-advisor/` wrapper.

**How it works**: All six children of `008-skill-advisor/` move under `008-skill-advisor/` (`001-search-and-routing-tuning/` through `006-deferred-remediation-and-telemetry-run/`; the never-existing `004-smart-router-context-efficacy/` slot was used to compact numbering). Five advisor-themed children move from `009-hook-parity/` and renumber to `007`-`011` under `008-skill-advisor/`. The `008-skill-advisor/` folder is then deleted; its slug remains as a `migration_aliases` entry on `008-skill-advisor/spec.md`. The `006/` numeric slot at the root level remains intentionally empty (do not renumber).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merge into `008-skill-advisor/`** | Single advisor home; coherent navigation; preserves all original packets as children | Requires renumbering and migration aliases | 9/10 |
| Keep advisor work split across two wrappers | No move needed | Cross-wrapper navigation persists; advisor changes touch two top-level folders | 3/10 |
| Move advisor work into `009-hook-parity/` instead | Advisor + hook in one place | Mixes search/routing tuning with runtime hook-parity remediation; breaks topical coherence | 4/10 |

**Why this one**: The advisor system is a coherent topical surface; the search/routing thread and the hook/plugin/standards thread are both advisor work, and unifying them under `008-skill-advisor/` matches the natural mental model.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Advisor reasoning happens inside one wrapper.
- 11 advisor-themed children share a single context index and continuity surface.
- Migration aliases on `008-skill-advisor/spec.md` keep the `008-skill-advisor/` slug discoverable.

**What it costs**:
- The `006/` numeric slot at the root level becomes a deliberate gap (audit marker).
- Memory/graph consumers must follow the alias to resolve old paths.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Six children move from `008-skill-advisor/` to `008-skill-advisor/`.
- Five children move from `009-hook-parity/` to `008-skill-advisor/` and renumber to `007`-`011`.
- `008-skill-advisor/` is deleted.
- `008-skill-advisor/spec.md` records `migration_aliases: [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor]`.

**How to roll back**: Reverse the moves and restore root docs/metadata from version control. The mapping in `scratch/reorg-2026-04-25/mapping.json` is the authoritative source for each move.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Create `009-memory-causal-graph/` as a Level-2 post-hoc documentation packet for live causal-graph infrastructure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-25 |
| **Deciders** | 026 second topical consolidation pass |

---

<!-- ANCHOR:adr-003-context -->
### Context

The causal-graph infrastructure (vector-index schema migration v8, `causal_edges` table, four MCP tools `memory_causal_link` / `memory_causal_unlink` / `memory_causal_stats` / `memory_drift_why`, six-relation taxonomy, ownership boundary between Memory, Code Graph, and Skill Graph) shipped to production multiple release cycles ago. It is referenced from `012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` (display-only consumer) and `005-memory-indexer-invariants/` (in passing for indexer correctness), but the 026 packet tree did not contain a single canonical documentation home for the infrastructure itself.

### Constraints

- No code changes; no schema mutation.
- Every claim must cite source files in `.opencode/skill/system-spec-kit/mcp_server/`.
- The packet is descriptive only; it does not propose new work.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: create `009-memory-causal-graph/` as a Level-2 post-hoc documentation packet.

**How it works**: The packet records the existing surface area, schema, traversal rules, MCP tool contracts, and ownership boundaries. Status is `Complete (post-hoc documentation only)`. No children, no implementation backlog. The numeric slot `009` is appropriate because earlier `009-hook-parity/` was already renamed and migrated during the first consolidation pass.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level-2 post-hoc documentation packet** | Single canonical home; code-grounded claims; no risk of code drift | Adds a wrapper for documentation only | 9/10 |
| Inline a section in `005-memory-indexer-invariants/` | No new wrapper needed | Conflates indexer correctness with causal-graph surface area; harder to find | 4/10 |
| Inline a section in `012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` | Co-located with display consumer | Display-only packet is out-of-scope for documenting underlying graph; mixes ownership | 3/10 |

**Why this one**: Documentation gaps for live infrastructure should have their own canonical home so that consumers (display, indexer, advisor) can link to one authoritative spec.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The 026 packet tree now has a single canonical home for causal-graph infrastructure.
- Future trust-display, indexer, and advisor work can cite `009-memory-causal-graph/` instead of fragmented references.

**What it costs**:
- One extra wrapper at the root level (Level 2; no code).
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New folder `009-memory-causal-graph/` with `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`, `description.json`, `graph-metadata.json`.
- No code, no schema, no children.

**How to roll back**: Delete the folder and remove the wrapper from the root phase map. The infrastructure remains in production unaffected.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Rename `009-hook-parity/` to `009-hook-parity/` after stripping advisor and code-graph scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-25 |
| **Deciders** | 026 second topical consolidation pass |

---

<!-- ANCHOR:adr-004-context -->
### Context

After ADR-002 moved five advisor-themed children to `008-skill-advisor/` and ADR-002's companion code-graph moves shifted two children (`013-code-graph-hook-improvements/` and `015-code-graph-advisor-refinement/`) to `007-code-graph/`, the surviving children of `009-hook-parity/` were exclusively runtime hook-parity remediations (Claude / Codex / Copilot / OpenCode plugin, schema fixes, wrapper wiring fixes). The wrapper name `hook-package` no longer matched the narrowed scope.

### Constraints

- Migration aliases for both `009-hook-parity/` and the earlier `009-hook-parity/` slug must be preserved.
- Surviving eight children must be renumbered to compact `001-008`.
- No code changes.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: rename `009-hook-parity/` to `009-hook-parity/` and renumber its eight surviving children to compact 001-008.

**How it works**: The wrapper is renamed in place after the seven non-hook-parity children have moved out. Surviving children renumber: `003-hook-parity-remediation/`→`001`, `004-copilot-hook-parity-remediation/`→`002`, `005-codex-hook-parity-remediation/`→`003`, `006-claude-hook-findings-remediation/`→`004`, `007-opencode-plugin-loader-remediation/`→`005`, `010-copilot-wrapper-schema-fix/`→`006`, `011-copilot-writer-wiring/`→`007`, `012-docs-impact-remediation/`→`008`. `009-hook-parity/spec.md` records `migration_aliases: [system-spec-kit/026-graph-and-context-optimization/009-hook-parity, system-spec-kit/026-graph-and-context-optimization/009-hook-parity]`.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename to `hook-parity` and renumber 001-008** | Name matches narrowed scope; compact child numbering; history preserved via aliases | Requires renumber across eight children | 9/10 |
| Keep name `hook-package` | No rename needed | Name no longer matches narrowed scope; misleading for resume/search | 2/10 |
| Split into per-runtime wrappers (Claude / Codex / Copilot / OpenCode) | Per-runtime scoping | Four wrappers for what is conceptually one parity program; over-fragmentation | 3/10 |

**Why this one**: After advisor and code-graph scope moved out, the wrapper is purely runtime hook-parity work; the name should reflect that.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Name matches scope.
- Compact 001-008 child numbering is easier to navigate.
- Migration aliases preserve discoverability for both prior slugs.

**What it costs**:
- Memory/graph consumers must follow aliases to resolve `009-hook-parity` and `009-hook-parity` references in older docs.
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Folder rename: `009-hook-parity/` → `009-hook-parity/`.
- Child renumbering across eight surviving packets.
- `009-hook-parity/spec.md` records both prior slugs in `migration_aliases`.

**How to roll back**: Reverse the rename and renumbering; restore `009-hook-parity/` and its prior child numbering from version control.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Post-push topology adjustment — rename `010-hook-parity/` to `009-hook-parity/` and remove the post-hoc `009-memory-causal-graph/` documentation packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-25 (14:45) |
| **Deciders** | User-driven retraction; root-doc narrative sync follow-up |

---

<!-- ANCHOR:adr-005-context -->
### Context

After the second consolidation pass landed (ADR-002, ADR-003, ADR-004) and the changes were pushed, two issues surfaced on review:

1. The Level-2 post-hoc documentation packet `009-memory-causal-graph/` (created by ADR-003 to provide a canonical documentation home for live causal-graph infrastructure: four MCP tools, the `causal_edges` schema, six-relation taxonomy, ownership boundary) was redundant. Display-layer coverage already existed under `012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/`, and the post-hoc wrapper added one numeric slot to scan in the active phase map without owning any executable scope.
2. The runtime hook-parity wrapper sat in `010-hook-parity/` (per ADR-004) only because the post-hoc documentation packet had occupied `009/`. With that packet removed, leaving hook-parity in `010/` would create a deliberate gap at `009/` for no narrative reason, while the topical surface had room to compact.

### Constraints

- The causal-graph infrastructure must remain in production code unchanged; only the post-hoc documentation wrapper is retracted.
- Migration aliases must capture the full rename chain (`009-hook-package` → `010-hook-package` → `010-hook-parity` → `009-hook-parity`) for memory/graph continuity.
- Eight surviving children of the renamed wrapper keep their `001-008` compact numbering and internal narratives intact.
- No code changes; no rewriting of historical child narratives.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: rename `010-hook-parity/` to `009-hook-parity/` (occupying the `009/` slot vacated by the removed documentation packet) and remove the post-hoc `009-memory-causal-graph/` documentation packet.

**How it works**:

- Rename: the wrapper folder moves from `010-hook-parity/` to `009-hook-parity/`. All eight children (`001-hook-parity-remediation/` through `008-docs-impact-remediation/`) retain their internal numbering and content. `009-hook-parity/spec.md` carries `migration_aliases` for three prior slugs: `system-spec-kit/026-graph-and-context-optimization/009-hook-package`, `system-spec-kit/026-graph-and-context-optimization/010-hook-package`, and `system-spec-kit/026-graph-and-context-optimization/010-hook-parity`.
- Removal: `009-memory-causal-graph/` is deleted entirely. Its prior content (which was descriptive-only, no code, no children) is retired. Display-layer documentation of the causal-graph surface area continues to live in `012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/`. The four MCP tools, `causal_edges` schema, six-relation taxonomy, and ownership boundary remain in production code unchanged.

The post-push adjustment is recorded as a sub-section of the second-pass section in `merged-phase-map.md`; the second-pass move/rename table itself is preserved verbatim.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename + remove (this ADR)** | Compact 10-wrapper surface; no orphaned `009/` gap; documentation is owned by the right consumer-facing wrapper; production code untouched | Requires migration alias for one extra prior slug; one more entry in `merged-phase-map.md` | 9/10 |
| Keep `010-hook-parity/` and leave `009/` permanently empty | No further rename needed | Permanent narrative gap with no audit reason after the documentation packet was removed; ongoing visual confusion | 4/10 |
| Keep `009-memory-causal-graph/` as-is | Single canonical home for causal-graph documentation as proposed in ADR-003 | Redundant with `012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/`; adds a wrapper for documentation only and inflates the active phase count | 3/10 |
| Keep `009-memory-causal-graph/` and rename hook-parity into a different slot (`011/` or higher) | Preserves ADR-003 | Worsens the numbering-gap problem; does not solve redundancy | 2/10 |

**Why this one**: Once the post-hoc documentation wrapper was identified as redundant, removing it cleanly and reclaiming `009/` for the hook-parity wrapper reverses the layout pressure that ADR-004 had to navigate around in the first place. The result is a smaller, more topical surface with the same underlying scope.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Active wrapper count drops from 11 to 10.
- The `009/` slot houses the runtime hook-parity wrapper without an intervening documentation gap.
- Causal-graph documentation has a single ownership home (display-layer, under `012/005-memory-causal-trust-display/`) instead of two overlapping ones.
- Production code, schema, MCP tools, and ownership boundaries remain in place — only the redundant documentation wrapper is retracted.

**What it costs**:
- An additional intentional numbering gap at `010/` (transient slot for the rename, preserved as an audit marker).
- Migration aliases on `009-hook-parity/spec.md` now record three prior slugs (`009-hook-package`, `010-hook-package`, `010-hook-parity`); memory/graph consumers must follow the chain to resolve old references.
- ADR-003 (which created the documentation packet) is now superseded by this ADR; readers should treat ADR-003 as historical context for the second-pass rationale that motivated its short-lived creation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Old references to `009-memory-causal-graph` in citations or memory traces fail to resolve | M | The display-layer wrapper at `012/005-memory-causal-trust-display/` remains; production code and MCP tools are unaffected; readers can search by `causal_edges`, `memory_causal_link`, etc., to land on production sources. |
| Migration alias chain becomes unwieldy | L | Three aliases is still bounded; the chain is recorded once on `009-hook-parity/spec.md` and in `merged-phase-map.md`. |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Post-hoc documentation wrapper was redundant; hook-parity in `010/` left an unmotivated `009/` gap. |
| 2 | **Beyond Local Maxima?** | PASS | Considered keeping the documentation packet, leaving the rename in `010/`, and renaming into a higher slot. |
| 3 | **Sufficient?** | PASS | Rename + remove fully reconciles the two surfaced issues; no further moves needed. |
| 4 | **Fits Goal?** | PASS | Goal is a compact, navigation-clean active surface with single-owner documentation. |
| 5 | **Open Horizons?** | PASS | Future causal-graph documentation expansion can extend the display-layer wrapper or open a new packet under appropriate ownership. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Folder rename: `010-hook-parity/` → `009-hook-parity/`. Children unchanged.
- Folder deletion: `009-memory-causal-graph/` removed entirely.
- `009-hook-parity/spec.md` records `migration_aliases: [system-spec-kit/026-graph-and-context-optimization/009-hook-package, system-spec-kit/026-graph-and-context-optimization/010-hook-package, system-spec-kit/026-graph-and-context-optimization/010-hook-parity]`.
- `merged-phase-map.md` gains a `2026-04-25 14:45 — Post-Push Adjustment` sub-section under the existing Second Consolidation section; prior tables are preserved verbatim.
- Root-level `description.json` and `graph-metadata.json` regenerated by `generate-context.js` (outside this narrative-update pass).

**How to roll back**: Restore `010-hook-parity/` and `009-memory-causal-graph/` from version control, revert the alias chain on the wrapper spec, and remove the post-push adjustment sub-section from `merged-phase-map.md`.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
