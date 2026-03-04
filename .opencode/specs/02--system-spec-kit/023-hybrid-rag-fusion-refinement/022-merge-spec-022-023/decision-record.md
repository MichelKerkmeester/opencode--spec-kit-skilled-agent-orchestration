---
title: "Decision Record: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion [template:level_3/decision-record.md]"
description: "5 ADRs covering phase renumbering strategy, parent document promotion, memory consolidation approach, feature catalog migration, and reference update strategy."
trigger_phrases:
  - "merge decisions"
  - "022 023 ADR"
  - "renumbering decision"
  - "merge architecture decisions"
importance_tier: "critical"
contextType: "architecture"
---
# Decision Record: Merge Specs 022 & 023 into Unified 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Phase Renumbering Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | User, AI Agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to combine 022's 9 phases (001-009) with 023's 24 phases into one folder without number collisions or chronological confusion. The renumbering must be simple enough to apply mechanically and produce a logical reading order.

### Constraints

- 022 already has phases 001-009 that must keep their numbers (they have established cross-references)
- 023 has 24 phase folders numbered 000-025 (with gap at 023)
- Chronologically, all 023 work happened after 022's 9 phases
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add +9 to all 023 phase numbers. 022 keeps 001-009, 023's phases become 010-033.

**How it works**: 023's phase `NNN-name` becomes `(NNN+9)-name` in the merged folder. Phase 000 (feature-overview) is a special case — it gets promoted to root-level docs instead of becoming phase 009. This gives us a clean sequential run from 001-033 with no gaps.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **+9 offset (chosen)** | Simple arithmetic, preserves chronology, no collisions | Requires phase number updates in cross-refs | 9/10 |
| Gap numbering (100+) | Large visual separation | Unnatural numbering gap (009 → 100), wastes number space | 4/10 |
| Interleaved by date | True chronological ordering | Breaks both folders' internal ordering, massively complex | 2/10 |
| Flat renumber from 001 | Clean restart | Breaks all existing 022 cross-references, loses history | 3/10 |

**Why this one**: +9 is the only option that preserves 022's existing numbers AND 023's chronological order while keeping a clean sequential sequence.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Single sequential phase numbering (001-033) with natural reading order
- 022's existing cross-references remain valid (phases 001-009 unchanged)
- Chronological development history is preserved

**What it costs**:
- All internal cross-references within 023's docs that mention phase numbers need updating. Mitigation: bulk find-replace with manual spot-check.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase number references in feature catalog point to old numbers | M | Feature catalog groups are independent of phase numbers (ADR-004) |
| Cross-refs between 023 phases use old numbers | M | Bulk find-replace in Phase 4 of implementation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two spec folders for one system causes real context fragmentation |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives explored with clear scoring |
| 3 | **Sufficient?** | PASS | Simple arithmetic, mechanically applicable |
| 4 | **Fits Goal?** | PASS | Directly serves the "single source of truth" goal |
| 5 | **Open Horizons?** | PASS | Sequential numbering leaves room for future phases (034+) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- 24 phase folders renamed with +9 offset
- Internal cross-references updated to new numbers

**How to roll back**: `git reset --hard HEAD~1` reverts all renames. Phase numbers return to original state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Parent Documentation Promotion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | User, AI Agent |

---

<!-- ANCHOR:adr-002-context -->
### Context

023 has a `000-feature-overview/` folder containing parent-level spec documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md). These serve as the consolidated overview for the entire refinement effort. Spec 022 has no root-level parent docs — only phase folders and a memory directory.

### Constraints

- 022 needs root-level parent docs to serve as the entry point for the merged spec
- 023's 000-feature-overview already functions as parent documentation
- Creating new root docs from scratch would duplicate work and lose accumulated content
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Promote 023's `000-feature-overview/` docs to 022's root level. The folder itself stays as a phase for its scratch/ contents.

**How it works**: Copy the 6 key spec documents from `023/000-feature-overview/` to `022/` root. The 000 folder moves to 022 as a regular phase (preserving scratch/ artifacts). This gives 022 proper parent docs without writing them from scratch.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Promote 000 docs to root (chosen)** | Reuses mature docs, fast, preserves content | Minor updates needed for new context | 8/10 |
| Keep as phase 010 | No special handling | 022 would still lack root docs | 3/10 |
| Write new root docs | Fresh, tailored to merged spec | Duplicates work, loses accumulated content | 4/10 |

**Why this one**: 023's parent docs are already comprehensive and well-maintained. Promoting them is faster and preserves all accumulated knowledge.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- 022 gets a proper parent-level entry point immediately
- No content authoring needed — just copy and update references

**What it costs**:
- Promoted docs need reference updates (023 → 022 paths). Mitigation: part of Phase 4 reference sweep.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Promoted docs contain 023-specific language | L | Reference update pass will catch folder name references |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 022 needs root docs; reusing existing ones avoids duplication |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives explored |
| 3 | **Sufficient?** | PASS | Copy + reference update is the simplest path |
| 4 | **Fits Goal?** | PASS | Creates single entry point for merged spec |
| 5 | **Open Horizons?** | PASS | Root docs can be updated independently of phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- 6 spec documents copied from `023/000-feature-overview/` to `022/` root
- 000-feature-overview folder moved to 022 as a phase (for scratch/ preservation)

**How to roll back**: Delete copied root docs, move 000 folder back. `git reset --hard HEAD~1` handles both.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Memory Consolidation Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | User, AI Agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

022 has 6 memory files with generic names (e.g., `hybrid-rag-fusion.md`). 023 has 25 memory files with content-aware names (produced by the recently implemented `generateContentSlug()` in `slug-utils.ts`). All 31 files need to live in the merged 022's `memory/` directory with consistent naming.

### Constraints

- The user explicitly requested content-aware naming following the recently implemented slug-utils.ts logic
- Memory files must all be in the root `memory/` folder (not scattered in phase subdirectories)
- Exact duplicates must be detected and removed
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Rename 022's 6 generic memories with content-aware slugs derived from their content, then move 023's 25 memories as-is (already correctly named), and run SHA-256 dedup.

**How it works**: Read each of 022's 6 memory files, extract the task description or primary topic, run it through `generateContentSlug()` logic to produce a meaningful slug, and rename (preserving the date prefix). Then move 023's 25 memories. Finally, compute SHA-256 hashes for all 31 files and remove any exact duplicates.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Content-aware rename + move + dedup (chosen)** | Consistent naming, uses existing slug-utils.ts logic | Requires reading and analyzing 6 files | 9/10 |
| Keep generic names for 022 memories | Less work | Inconsistent with 023's content-aware names | 4/10 |
| Regenerate all 31 from scratch | Uniform format | Loses original save dates, unnecessary rework | 2/10 |

**Why this one**: Consistent with the recently implemented slug-utils.ts feature (see Sprint 019 implementation). The 6 files are easy to analyze manually.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- All 31 memories have meaningful, content-aware names
- Memory search returns clearer results with descriptive filenames
- Consistent with the content-aware naming convention established in Sprint 019

**What it costs**:
- 6 files need manual content analysis to generate slugs. Mitigation: straightforward reading task.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Memory index references old filenames | M | Full re-index via `memory_index_scan` after consolidation |
| SHA-256 dedup misses near-duplicates | L | Exact dedup is sufficient; near-dupes are different enough to keep |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly requested content-aware naming |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives explored |
| 3 | **Sufficient?** | PASS | Reuses existing slug-utils.ts logic, no new code needed |
| 4 | **Fits Goal?** | PASS | Produces uniform, discoverable memory filenames |
| 5 | **Open Horizons?** | PASS | Future memories will use the same slug-utils.ts logic |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- 6 memory files renamed in 022/memory/
- 25 memory files moved from 023/memory/ to 022/memory/
- metadata.json merged
- Full memory re-index after consolidation

**How to roll back**: `checkpoint_restore` recovers memory index. `git reset --hard HEAD~1` restores file names and locations.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Feature Catalog Migration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | User, AI Agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

023's `feature_catalog/` contains 25 groups with 144 snippet files documenting individual features. Each group has its own numbering (01-25) that is independent of phase folder numbers. The question was whether to renumber catalog groups to match the new phase numbers.

### Constraints

- Feature catalog groups (01-25) are thematic groupings, not phase references
- 144 snippet files would all need metadata updates if groups were renumbered
- No runtime code references feature catalog group numbers
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Move `feature_catalog/` as-is to 022 root. No renumbering of catalog groups.

**How it works**: The entire `feature_catalog/` directory tree moves from 023 to 022 with no internal changes. Group numbers (01-25) stay the same because they represent thematic groupings (e.g., "01-core-search", "13-memory-quality"), not phase folder references.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move as-is (chosen)** | Zero risk, no internal changes, fast | Groups don't align with phase numbers | 9/10 |
| Renumber to match new phases | Visual alignment | Breaks all 144 snippet cross-refs, huge effort, groups are thematic not phase-based | 2/10 |

**Why this one**: Catalog groups are thematic categories, not phase references. Renumbering would break 144 files for zero functional benefit.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Zero risk of breaking 144 snippet cross-references
- Migration takes seconds instead of hours

**What it costs**:
- Catalog group numbers (01-25) don't match phase numbers (010-033). Mitigation: they never did — groups are thematic, not chronological.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusion between catalog group numbers and phase numbers | L | Document in feature catalog README that groups are thematic, not phase-aligned |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Feature catalog must move with the spec |
| 2 | **Beyond Local Maxima?** | PASS | Renumbering alternative explicitly rejected |
| 3 | **Sufficient?** | PASS | Simple directory move, no transformation needed |
| 4 | **Fits Goal?** | PASS | Preserves complete feature catalog in merged spec |
| 5 | **Open Horizons?** | PASS | New groups can be added at 26+ |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `feature_catalog/` directory moved from 023 to 022 root

**How to roll back**: Move directory back to 023. `git reset --hard HEAD~1`.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Reference Update Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-04 |
| **Deciders** | User, AI Agent |

---

<!-- ANCHOR:adr-005-context -->
### Context

After renaming and moving folders, all references to "023-hybrid-rag-fusion-refinement" throughout the repository must be updated to "022-hybrid-rag-fusion". Additionally, internal cross-references between phases that use old 023 phase numbers need updating to the new merged numbers.

### Constraints

- The folder name change ("023-hybrid-rag-fusion-refinement" → "022-hybrid-rag-fusion") is a simple string replacement
- Phase number references need context-aware handling — some numbers refer to feature catalog groups (01-25), not phases
- Only 1 test file (`hybrid-search-context-headers.vitest.ts`) has hardcoded path references
- All other path resolution in the MCP runtime is dynamic (via `getParentPath()`, `getAncestorPaths()`)
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Automated find-replace for the folder name string, plus manual verification for phase number cross-references.

**How it works**: (1) `grep -r "023-hybrid-rag-fusion-refinement"` finds all occurrences. (2) Bulk replace with "022-hybrid-rag-fusion" in all matches. (3) Manually review phase number references to distinguish phase refs from catalog group refs. (4) Update the one test fixture with hardcoded paths.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Automated folder name + manual phase numbers (chosen)** | Safe, handles ambiguity, fast for the bulk case | Phase numbers need manual review | 8/10 |
| Manual-only | Maximum control | Slow, error-prone for 200+ files | 3/10 |
| Script-based with AST parsing | Fully automated | Over-engineered for a one-time operation | 4/10 |

**Why this one**: The folder name replacement is unambiguous and safe to automate. Phase numbers need human judgment to distinguish from catalog group numbers. The hybrid approach balances speed and safety.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Bulk of references updated quickly and safely via automation
- Edge cases (phase vs catalog numbers) handled with human review

**What it costs**:
- Manual review of phase number references takes time. Mitigation: most internal cross-refs use folder names, not bare numbers.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed reference in an obscure file | M | Final `grep -r` verification catches any remnants |
| Phase number incorrectly changed to catalog group number | L | Context-aware manual review before each phase number change |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Stale references would break navigation and memory search |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives explored |
| 3 | **Sufficient?** | PASS | Automated bulk + manual edge cases covers everything |
| 4 | **Fits Goal?** | PASS | Ensures zero stale references in merged spec |
| 5 | **Open Horizons?** | PASS | New references will use 022 paths naturally |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- All "023-hybrid-rag-fusion-refinement" strings replaced with "022-hybrid-rag-fusion"
- Phase number cross-references updated where applicable
- Test fixture updated (1 file, 2 lines)

**How to roll back**: `git reset --hard HEAD~1` reverts all string replacements.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
