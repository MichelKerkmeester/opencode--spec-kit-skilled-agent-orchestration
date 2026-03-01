---
title: "Decision Record: OpenCode Documentation Quality Upgrade [122-upgrade-speckit-docs/decision-record]"
description: "Several anchor IDs in README.md files were inconsistent in naming conventions. Some used short names (e.g., examples, level-selection-guide) while others used more descriptive n..."
trigger_phrases:
  - "decision"
  - "record"
  - "opencode"
  - "documentation"
  - "quality"
  - "decision record"
  - "122"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: OpenCode Documentation Quality Upgrade

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Anchor ID Renames for Consistency

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-15 |
| **Deciders** | @speckit, user |

---

### Context

Several anchor IDs in README.md files were inconsistent in naming conventions. Some used short names (e.g., `examples`, `level-selection-guide`) while others used more descriptive names with prefixes. Documentation quality upgrade included standardizing these anchor IDs for consistency across the system.

### Constraints
- Technical: Memory system uses anchor IDs for targeted retrieval via memory_search({ anchors: [...] })
- Business: Documentation consistency improves maintainability
- Time/resource: Low-risk change, immediate implementation

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Rename anchor IDs for consistency (e.g., `examples` → `usage-examples`, `level-selection-guide` → `level-selection`)

**Details**: During prose tightening sweep, standardize anchor ID naming across all README.md files to use consistent conventions. Accept risk that indexed memories using old anchor IDs will silently fail to match after rename. Document known renames for awareness and plan re-index after commit.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename for consistency** | Uniform naming, better maintainability, future-proof documentation | Risk of breaking existing memory_search() calls using old anchor IDs | 8/10 |
| Keep existing anchor IDs | No risk to memory system, zero migration effort | Perpetuates inconsistency, harder to maintain over time | 5/10 |
| Alias old anchors | Backward compatibility, no breaking changes | Clutters documentation with duplicate anchors, maintenance overhead | 6/10 |

**Why Chosen**: Long-term documentation consistency outweighs short-term memory migration risk. Memory re-index is straightforward mitigation.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Consistent anchor naming across all documentation
- Better maintainability for future documentation changes

**Negative**:
- Existing memories using old anchor IDs will silently fail to match - Mitigation: Re-index memory system after commit, document known renames in memory/ if issues surface

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Memory search failures using old anchor IDs | M | Re-index memory system after commit, add migration note to memory/ folder if failures detected |
| Cross-reference breaks in external docs | L | All references internal to OpenCode system, controlled environment |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solves actual need for documentation consistency, improves maintainability |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered (keep existing, alias), rename chosen for long-term value |
| 3 | **Sufficient?** | PASS | Simple rename is simplest approach, no complex migration tooling needed |
| 4 | **Fits Goal?** | PASS | Directly supports documentation quality upgrade objective |
| 5 | **Open Horizons?** | PASS | Future-proof naming convention, aligns with long-term maintainability |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- Documentation: README.md files in .opencode/skill/system-spec-kit/, .opencode/skill/workflows-*, etc.
- Memory: Indexed memories using anchor IDs for targeted retrieval

**Rollback**: Revert anchor ID renames in documentation files, re-index memory system

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Scope Expansion Beyond Pure Prose

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-15 |
| **Deciders** | @speckit, user |

---

### Context

Original scope was "prose tightening" but implementation included 5 distinct concerns: (1) HVR prose enforcement (Oxford comma removal, em dash → period, etc.), (2) subfolder feature code (~200 lines TypeScript, actually Spec 124), (3) HVR ruleset addition (~120 lines to readme_template.md), (4) config changes (opencode.json, bun.lock, package.json), (5) anchor tag removal from TOC headings.

### Constraints
- Technical: Multiple file types (.md, .json, .ts, .lock) across different concerns
- Business: Pragmatic completion vs. spec purity
- Time/resource: Splitting into multiple specs adds overhead

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Accept broader scope rather than splitting into multiple specs

**Details**: Treat documentation quality upgrade as a holistic standards sweep encompassing prose, structure, config cleanup, and related improvements. Acknowledge reduced spec purity but prioritize pragmatic completion and avoid overhead of managing 3-4 separate specs for tightly related changes.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified sweep (chosen)** | Single commit, pragmatic completion, reduced overhead | Reduced spec purity, multiple concerns mixed | 8/10 |
| Split into separate specs (prose, config, features) | Clean separation of concerns, spec purity | 3-4 specs to manage, commit coordination overhead, same files touched multiple times | 5/10 |
| Defer non-prose changes to future specs | Maintains narrow scope, clear prose-only focus | Leaves related improvements incomplete, duplicates review effort | 4/10 |

**Why Chosen**: Pragmatic completion and reduced coordination overhead outweigh spec purity concerns for a standards-upgrade sweep.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Single commit for all documentation quality improvements
- Reduced overhead vs. managing 3-4 separate specs
- Holistic standards upgrade

**Negative**:
- Reduced spec purity (multiple concerns in one spec) - Mitigation: Document distinct concerns in decision-record.md for awareness
- Subfolder feature code (~200 lines TS) belongs to Spec 124, not Spec 122 - Mitigation: Note overlap in implementation-summary.md

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Spec purity dilution | L | Document distinct concerns, accept as pragmatic trade-off |
| Cross-spec confusion (Spec 122 vs. 124) | M | Document overlap explicitly, commit order recommendation (Spec 122 first) |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solves actual need for documentation quality upgrade, config cleanup, template improvement |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered (split specs, defer changes), unified sweep chosen for pragmatism |
| 3 | **Sufficient?** | PASS | Single sweep is simpler than coordinating 3-4 separate specs for related changes |
| 4 | **Fits Goal?** | PASS | Directly supports documentation quality upgrade objective, holistic standards improvement |
| 5 | **Open Horizons?** | PASS | No long-term lock-in, future specs can split concerns if needed |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- Documentation: 85 .md files across .opencode/ hierarchy
- Config: opencode.json, package.json, bun.lock
- Templates: readme_template.md (+120 lines HVR ruleset)
- Features: Subfolder versioning code (~200 lines TS, Spec 124 overlap)

**Rollback**: Revert all changes in single commit, or selectively revert by file category if needed

<!-- /ANCHOR:adr-002-impl -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Coverage Gaps as Future Work

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-15 |
| **Deciders** | @speckit, user |

---

### Context

46 of ~127 documentation files not covered (63% coverage). Deferred categories: 8 agent definitions, 7 SKILL.md files, 14 command files, 9 install guides, 8 miscellaneous. Question: Complete all files in this spec or defer to future work?

### Constraints
- Technical: Diminishing returns on remaining files (less critical paths)
- Business: 63% coverage achieves core documentation quality goals
- Time/resource: Additional 46 files would double implementation time

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Defer 46 remaining files to separate future spec rather than expanding Spec 122

**Details**: Prioritize breadth over depth. Core documentation covered (system-spec-kit internals, key skills, main READMEs). Remaining files are lower-traffic (agent definitions, command docs, install guides). Defer to future spec for comprehensive coverage to avoid scope creep and maintain momentum.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer to future spec** | Maintains momentum, avoids scope creep, 63% coverage sufficient for immediate goals | Incomplete coverage, future spec needed | 8/10 |
| Complete all 127 files now | 100% coverage, no future work needed | Doubles implementation time, diminishing returns on lower-traffic files | 5/10 |
| Complete only high-traffic files (current) | Balanced approach, covers critical paths | 37% remaining files need future attention | 8/10 |

**Why Chosen**: 63% coverage achieves core goals (system-spec-kit, key skills, main docs). Remaining 37% are lower-traffic files with diminishing returns. Future spec can complete comprehensive coverage.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Maintains momentum, avoids scope creep
- 63% coverage sufficient for immediate documentation quality goals
- Core critical paths covered

**Negative**:
- Incomplete coverage (46 files remaining) - Mitigation: Document deferred categories, create future spec for comprehensive coverage
- Inconsistency between covered/uncovered files - Mitigation: Prioritized high-traffic files first

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Incomplete documentation quality | M | 63% coverage includes critical paths, future spec planned for comprehensive completion |
| User confusion (mixed styles) | L | Deferred files are lower-traffic (agents, commands, install guides) |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solves actual need for core documentation quality, deferred files less critical |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered (100% coverage, current 63%), balanced approach chosen |
| 3 | **Sufficient?** | PASS | 63% coverage sufficient for immediate goals, avoids diminishing returns |
| 4 | **Fits Goal?** | PASS | Directly supports documentation quality upgrade for critical paths |
| 5 | **Open Horizons?** | PASS | Future spec can complete comprehensive coverage, no lock-in |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- Documentation: 81 files covered, 46 files deferred (8 agents, 7 SKILL.md, 14 commands, 9 install guides, 8 misc)

**Rollback**: No rollback needed (deferred files remain unchanged)

<!-- /ANCHOR:adr-003-impl -->

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Cross-Spec Overlap with Spec 124

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-15 |
| **Deciders** | @speckit, user |

---

### Context

`scripts/spec/README.md` modified by both Spec 122 (prose tightening) and Spec 124 (upgrade-level.sh documentation addition). Both specs touch the same file, creating potential for merge conflicts if committed in wrong order.

### Constraints
- Technical: Git merge conflicts if commit order incorrect
- Business: Both specs valid and needed
- Time/resource: Low coordination cost if commit order documented

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Document overlap and recommend committing Spec 122 first, then rebasing Spec 124

**Details**: Accept overlap as pragmatic outcome of parallel work. Document commit order recommendation explicitly: (1) Commit Spec 122 (prose tightening), (2) Rebase Spec 124 onto Spec 122 commit, (3) Commit Spec 124 (upgrade-level.sh docs). This avoids merge conflicts and preserves both sets of changes.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document overlap + commit order** | Clear coordination, avoids conflicts, preserves both changes | Requires manual coordination | 9/10 |
| Merge specs into single commit | No coordination needed, single commit | Mixes concerns (prose + feature docs), reduces spec clarity | 4/10 |
| Revert one spec's changes to shared file | No overlap, clean separation | Loses valid work from one spec, duplicates effort | 2/10 |

**Why Chosen**: Documentation + commit order recommendation provides clear coordination with minimal overhead and preserves both specs' valid changes.

<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Both specs' changes preserved
- Clear commit order prevents merge conflicts
- Minimal coordination overhead

**Negative**:
- Requires manual coordination (commit order) - Mitigation: Document explicitly in implementation-summary.md and decision-record.md

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Merge conflict if committed in wrong order | M | Document commit order explicitly: Spec 122 first, then rebase Spec 124 |
| Confusion about which spec owns shared file changes | L | Document overlap explicitly in both specs' decision records |

<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both specs provide valid changes, overlap unavoidable for shared file |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered (merge specs, revert), documentation chosen for clarity |
| 3 | **Sufficient?** | PASS | Simple documentation + commit order is simplest coordination approach |
| 4 | **Fits Goal?** | PASS | Preserves both specs' valid changes, minimal coordination overhead |
| 5 | **Open Horizons?** | PASS | No long-term lock-in, future specs can handle overlaps similarly |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- Documentation: `scripts/spec/README.md` (modified by both Spec 122 and Spec 124)
- Git: Commit order coordination required

**Rollback**: If merge conflict occurs, reset to before Spec 122 commit, apply Spec 124 first, then reapply Spec 122

<!-- /ANCHOR:adr-004-impl -->

<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
