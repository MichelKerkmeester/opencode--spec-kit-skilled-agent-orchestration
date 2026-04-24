---
title: "...text-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/002-spec-folder-graph-metadata/decision-record]"
description: "Accepted ADRs for the dedicated graph-metadata.json contract, the manual-versus-derived split, merge-based save refresh, and direct _memory.continuity frontmatter edits."
trigger_phrases:
  - "018 011 decision record"
  - "graph metadata adr"
  - "graph metadata architecture decisions"
  - "graph metadata merge adr"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/002-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Expanded the packet ADR into three accepted design decisions grounded in the completed research"
    next_safe_action: "Use these ADRs as hard implementation guardrails"
    key_files: ["decision-record.md", "research.md", "plan.md"]
status: "planned"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
# Decision Record: 018 / 011 — graph-metadata.json architecture

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a dedicated `graph-metadata.json` file per spec-folder root

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex research pass for Phase 018 / 011 |
| **Research Basis** | Iterations 3, 9, and 10 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 018 moved canonical continuity into git-tracked spec docs plus `_memory.continuity`, but Iteration 1 confirmed that the graph stack still expects packet-level metadata that used to arrive through legacy memory saves. Iteration 3 compared four storage options, and Iteration 9 clarified why `description.json` is the wrong boundary for high-churn graph state.

### Constraints

- The solution must preserve `_memory.continuity` as a thin resume surface, not turn it back into a large packet metadata dump.
- The solution must avoid overloading `description.json`, which is both incomplete across the repo and scoped to folder discovery plus tracking history.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a dedicated `graph-metadata.json` file in each spec-folder root, indexed as one `graph_metadata` row in `memory_index`.

**How it works**: canonical save completion refreshes the file on every save, even when no legacy context markdown is emitted. The file holds packet identity at the top level, keeps manual packet relationships in one merge-safe section, and regenerates derived fields such as trigger phrases, status, key files, entities, and timestamps in another.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dedicated `graph-metadata.json`** | Deterministic, schema-friendly, easy to index, matches packet-level ownership | Adds one new root file contract | 9/10 |
| `graph-metadata.yaml` | Human-readable, root-level, still schema-capable | Adds parser complexity without runtime benefit | 7/10 |
| Extend `_memory.continuity` | No new file, close to canonical docs | Too thin today, spread across docs, wrong place for packet graph state | 4/10 |
| Extend `description.json` | Existing root file, easy to discover | Wrong concern boundary, high churn risk, incomplete repo coverage | 5/10 |

**Why this one**: it restores the missing packet-level graph input with the smallest architectural change. It also reuses existing `memory_index` and `causal_edges` plumbing instead of inventing a new storage system.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet dependency and supersession queries get one stable machine-readable source per folder.
- `_memory.continuity` stays compact and `description.json` stays focused on discovery and tracking.

**What it costs**:
- The save path, index discovery, validation, and backfill tooling all need follow-on implementation work. Mitigation: stage rollout as schema, save-path, indexing, then backfill.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manual relationship edits get overwritten by save refresh | H | Preserve `manual.*` fields and fully regenerate only `derived.*` |
| Validation becomes noisy before old folders are backfilled | M | Roll out presence checks in warning-first mode |
| Graph metadata drifts away from canonical docs | M | Regenerate derived fields on every canonical save |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet-level graph inputs are materially missing after Phase 018 |
| 2 | **Beyond Local Maxima?** | PASS | The research compared four storage options and scored them directly |
| 3 | **Sufficient?** | PASS | One deterministic JSON file is smaller than reviving legacy memory-file behavior |
| 4 | **Fits Goal?** | PASS | The design restores graph usefulness without changing the canonical continuity model |
| 5 | **Open Horizons?** | PASS | The schema supports later code-graph enrichment and retroactive backfill |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `generate-context.js` and workflow helpers add a canonical-save metadata refresh step.
- Discovery, indexing, graph-edge processing, and validation gain explicit support for `graph-metadata.json`.

**How to roll back**: remove the new discovery and refresh path, stop generating `graph-metadata.json`, and fall back to current packet-doc-only behavior while reopening the design question. Do not move the graph state into `_memory.continuity` or `description.json` as a shortcut.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Split packet metadata into `manual` and `derived` sections

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex research pass for Phase 018 / 011 |
| **Research Basis** | Iterations 4 and 10 |

---

### Context

Iteration 4 showed that packet relationships and packet facts do not share the same ownership model. `depends_on`, `supersedes`, and intentional `related_to` links are human judgments that must survive automated refresh, while trigger phrases, packet status, key files, timestamps, and summary fields should be regenerated from canonical docs every time.

### Constraints

- Human packet relationships must survive repeated canonical saves.
- Derived packet facts must converge on current reality instead of accumulating stale fields.

---

### Decision

**We chose**: a schema with top-level identity, `manual.*` relationship arrays, and `derived.*` regenerated packet metadata.

**How it works**: the parser treats `manual.*` as protected operator input and treats `derived.*` as rebuildable output from canonical packet docs plus save payload. Validation enforces both halves of the contract under one schema.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Manual + derived split** | Clear ownership, merge-safe, deterministic refresh | Slightly larger schema | 10/10 |
| All fields derived | Simplest refresh loop | Destroys intentional packet relationships | 3/10 |
| All fields manual | Maximum operator control | Too much drift, too much maintenance, weak automation value | 4/10 |
| Mixed untyped blob | Flexible | Hard to validate and easy to misuse | 5/10 |

**Why this one**: it protects the only fields that truly need human intent while keeping the rest of the packet state deterministic and easy to refresh.

---

### Consequences

**What improves**:
- Save refresh can stay deterministic without wiping out intentional packet links.
- Validation and backfill can reason clearly about which fields are safe to regenerate.

**What it costs**:
- Parser and merge logic become slightly more complex. Mitigation: keep the schema explicit and cover merge behavior with tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later implementation writes into `manual.*` automatically | H | Keep `manual.*` write paths explicit and narrow |
| Derived extraction becomes too heuristic-heavy | M | Prefer canonical packet docs and bounded extraction rules |
| Operators misread the split | M | Document it in packet docs, parser APIs, and validation output |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Different ownership rules exist for packet links vs packet facts |
| 2 | **Beyond Local Maxima?** | PASS | Research compared fully manual, fully derived, and hybrid models |
| 3 | **Sufficient?** | PASS | One clear split is simpler than field-by-field special cases |
| 4 | **Fits Goal?** | PASS | Supports safe refresh and durable relationships together |
| 5 | **Open Horizons?** | PASS | Leaves room for later additive fields without changing the ownership rule |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Schema and parser logic enforce `manual.*` vs `derived.*` boundaries.
- Save-path refresh reads, preserves, and rewrites the correct halves of the document.

**How to roll back**: remove the graph-metadata producer rather than collapsing the schema into an untyped or fully derived blob.

---

### ADR-003: Refresh graph metadata by merge, not blind overwrite

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex research pass for Phase 018 / 011 |
| **Research Basis** | Iterations 5 and 10 |

---

### Context

Iteration 5 identified the lifecycle rule that matters most: graph metadata must refresh from canonical save, but a blind overwrite would erase manual packet links and a patch-style partial refresh would leave stale derived data behind. The save path needs a deterministic strategy that protects operator intent and packet freshness at the same time.

### Constraints

- Refresh must run even when no legacy markdown file is written.
- Manual packet relationships must survive every refresh.
- Derived packet state must reflect current canonical docs after every save.

---

### Decision

**We chose**: load existing `graph-metadata.json`, preserve `manual.*`, fully regenerate `derived.*`, and rewrite the file atomically.

**How it works**: the save path reads the existing file if present, validates or normalizes the manual section, rebuilds the derived section from canonical docs and save payload, then writes the full file atomically so readers never see a partial document.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merge manual + rebuild derived** | Protects intent, removes stale derived data, deterministic | Requires explicit merge logic | 10/10 |
| Full overwrite | Simple implementation | Loses manual relationships | 2/10 |
| Patch changed fields only | Smaller writes | Leaves stale derived fields behind and complicates reasoning | 5/10 |
| Manual refresh only | Maximum operator control | Defeats the purpose of canonical-save authority | 3/10 |

**Why this one**: it is the only option that protects operator intent and packet freshness simultaneously.

---

### Consequences

**What improves**:
- Save refresh becomes deterministic and easy to reason about.
- Packet graph state stays aligned with canonical docs without destroying manual packet links.

**What it costs**:
- Atomic write and merge behavior must be implemented carefully. Mitigation: cover the no-file, existing-file, and malformed-file cases with tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Refresh hooks the wrong save branch and never runs | H | Bind refresh to canonical save completion and test the no-legacy-markdown case |
| Existing malformed files break refresh | M | Validate early and fail with actionable diagnostics |
| Concurrent writes leave partial JSON | M | Use atomic write semantics |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Save refresh is required, but overwriting would destroy manual data |
| 2 | **Beyond Local Maxima?** | PASS | Research compared overwrite, merge, and partial-refresh behavior |
| 3 | **Sufficient?** | PASS | One merge rule handles all future refreshes cleanly |
| 4 | **Fits Goal?** | PASS | Keeps canonical save authoritative without reviving legacy packet state |
| 5 | **Open Horizons?** | PASS | Supports later additive derived fields and backfill without redesign |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Save-path helpers add read-validate-merge-write behavior for `graph-metadata.json`.
- Tests cover manual preservation, derived regeneration, and atomic write semantics.

**How to roll back**: disable the graph-metadata refresh path entirely rather than weakening merge guarantees.

---

### ADR-004: Allow direct AI edits to `_memory.continuity` frontmatter; reserve `generate-context.js` for DB indexing and embeddings

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex implementation pass for Phase 018 / 011 |
| **Research Basis** | Phase 018 canonical continuity model plus current `CLAUDE.md` and `/memory:save` workflow review |

### Context

The old memory-save rule assumed the primary artifact was a standalone markdown file under `memory/`, so forcing every continuity update through `generate-context.js` was the safest way to keep routing, anchors, and indexing aligned. Post-018, canonical continuity now lives in `_memory.continuity` frontmatter inside spec docs that the AI is already editing for other packet work.

For small session updates, pushing six frontmatter fields through the full save pipeline adds overhead without improving the truth source. The AI already has the freshest session state at edit time, while the script still matters for database refresh, embedding generation, and any compatibility output that depends on its routing logic.

### Constraints

- Direct edits must stay limited to `_memory.continuity` blocks inside canonical spec docs.
- The change must not re-open manual creation of standalone `memory/*.md` continuity artifacts.
- Indexed saves, embedding refresh, and `description.json` refresh still need one canonical script path.

---

### Decision

**We chose**: allow direct AI edits to `_memory.continuity` YAML blocks in canonical spec docs for session continuity updates, while keeping `generate-context.js` as the canonical path for DB indexing, embedding generation, `description.json` refresh, and full save workflows.

**How it works**: if the task is only to update doc-local continuity hints, the AI may patch the frontmatter in-place. If the task also needs indexed retrieval freshness, embeddings, compatibility artifacts, or save-workflow side effects, the AI must still run `generate-context.js`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Direct `_memory.continuity` edits + scripted indexed saves** | Fast for small continuity updates, preserves canonical indexing path, matches post-018 architecture | Requires clear boundary guidance | 10/10 |
| Keep `generate-context.js` mandatory for every frontmatter change | One workflow to teach, guaranteed side effects | Unnecessary overhead for small doc-local updates, mismatched to canonical spec-doc ownership | 5/10 |
| Return to standalone `memory/*.md` continuity files | Restores old script-only model | Reopens the packet-sprawl model that Phase 018 retired | 1/10 |

**Why this one**: it matches the new canonical continuity model without weakening the save pipeline where that pipeline still adds real value.

---

### Consequences

**What improves**:
- Session continuity updates become faster and easier to apply when the canonical source is already open in a spec doc.
- The rules now match post-018 reality instead of treating spec-doc frontmatter like a legacy memory-file workflow.

**What it costs**:
- Operators must distinguish between continuity-only edits and indexed saves. Mitigation: document the boundary clearly in `CLAUDE.md` and `/memory:save`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Direct edits are mistaken for indexed saves | H | State explicitly that DB sync, embeddings, and `description.json` refresh still require `generate-context.js` |
| Someone resumes manually creating standalone memory files | M | Keep the hard ban on manual `memory/*.md` continuity artifacts |
| Frontmatter edits drift from save-workflow expectations | M | Limit the exception to `_memory.continuity` only and keep all broader save behavior on the script path |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Canonical continuity is now frontmatter in docs, not standalone memory markdown |
| 2 | **Beyond Local Maxima?** | PASS | The decision separates doc-local continuity updates from indexed save side effects instead of forcing one path for both |
| 3 | **Sufficient?** | PASS | One narrow exception handles the real workflow pain without changing packet graph boundaries |
| 4 | **Fits Goal?** | PASS | Preserves script authority where indexing and embeddings matter while simplifying frontmatter maintenance |
| 5 | **Open Horizons?** | PASS | Leaves room for future save automation without reintroducing the legacy memory-file model |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `CLAUDE.md` updates the Memory Save Rule so direct `_memory.continuity` edits are allowed, but indexed saves still go through `generate-context.js`.
- `/memory:save` documents the same boundary and keeps standalone memory-file creation forbidden.

**How to roll back**: restore the script-only rule for `_memory.continuity` frontmatter edits and remove the direct-edit allowance from the operator docs.


---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
