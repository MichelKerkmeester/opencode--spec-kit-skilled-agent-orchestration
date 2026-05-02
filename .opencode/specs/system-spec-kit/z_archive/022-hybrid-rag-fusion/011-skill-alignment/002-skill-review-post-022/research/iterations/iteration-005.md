### Finding M-001: Canonical docs no longer describe the same closeout scope
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/spec.md:41-45`
- **Evidence**: `spec.md` and `plan.md` frame 011 as a narrow documentation-only closeout for skill-guide, memory-reference, and asset drift, but `tasks.md:68-77`, `checklist.md:95-104`, and `implementation-summary.md:75-92` add a second 2026-03-22 "Post-Research-Refinement Alignment" pass with extra count reconciliations, environment-variable work, and verification across agent definitions, command files, and command configs.
- **Impact**: Future maintainers cannot tell whether phase 011 is a single 2026-03-21 closeout or a broader packet that also owns the later spec-011 follow-up. That weakens traceability and makes future drift reviews harder to scope correctly.
- **Fix**: Either fold the 2026-03-22 follow-up into `spec.md` and `plan.md` as first-class scope/requirements, or move the later pass into its own child packet and remove the extra tasks/checklist/summary sections from the canonical docs.

### Finding M-002: Phase navigation is stale after the review child packet was added
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/spec.md:89-94`
- **Evidence**: The `PHASE DOCUMENTATION MAP` lists only `001-post-session-capturing-alignment`, but the folder now also contains `002-skill-review-post-022/`. The parent packet is stale too: `../spec.md:39` still reports `011=1`, even though `011-skill-alignment` now has two numbered child folders.
- **Impact**: Maintainers following the packet tree will miss the review phase, and parent-level directory counts no longer match the on-disk structure. That makes future normalization work and packet navigation less trustworthy.
- **Fix**: Add `002-skill-review-post-022/` to the 011 phase map, then update the parent `022-hybrid-rag-fusion/spec.md` child-count metadata to reflect the live `011=2` state (or clearly document why review packets are excluded if that is intentional).

### Finding M-003: The Open Questions section is a stale guidance note, not an actionable question list
- **Severity**: P2
- **Dimension**: maintainability
- **File**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/spec.md:166-170`
- **Evidence**: Section 10 contains only closure statements ("this pack records completed documentation reconciliation work", "future reviews should prefer live-file verification", "create a fresh reconciliation pass if the memory surface changes again") rather than actual unresolved questions. That guidance also predates the current `002-skill-review-post-022` follow-up already present under the folder.
- **Impact**: Future maintainers looking for unresolved decisions or next-step triggers get a mislabeled section that hides the current follow-up structure instead of clarifying it.
- **Fix**: Replace Section 10 with real unresolved questions, or rename it to something like `Maintenance Notes` and explicitly point readers to the existing child packets/review phases for subsequent work.
