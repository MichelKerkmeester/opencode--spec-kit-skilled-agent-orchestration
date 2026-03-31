# Iteration 004 — Traceability: Changelog ↔ Code

## P0

None.

## P1

### P1-1 Missing `v3.1.5.0` release note blocks the requested changelog-to-code traceability check

- **File:** `changelog/01--system-spec-kit/` (directory listing ends at `v3.1.4.0.md`), `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/review/deep-review-strategy.md:49`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/spec.md:95-112`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:34-43`
- **Evidence:** The prompt asks to verify `.opencode/changelog/01--system-spec-kit/v3.1.5.0.md`, but no such file exists in the repository. The current `changelog/01--system-spec-kit/` directory ends at `v3.1.4.0.md`, and `git log --all --full-history --name-status -- changelog/01--system-spec-kit/v3.1.5.0.md` returns no history. At the same time, the phase-009 review strategy says "All fixes are released as v3.1.5.0", and the spec/checklist present the work as fully resolved and verified.
- **Impact:** The requested review target is missing, so there is no release artifact to validate the claimed "13 numbered fixes", the "Files Changed" table, or fix-specific wording such as the row-count claims. Release traceability is therefore broken at the artifact level.
- **Recommendation:** Add the missing `v3.1.5.0.md` changelog entry, or update the phase-009 docs to reference the actual release artifact. Then reconcile the numbered fixes and Files Changed table against the committed files before treating the release as auditable.

### P1-2 Checked "0 decision remaining / all 186 folders verified" claims do not match the current repository state

- **File:** `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/spec.md:104-122`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:35-43`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/spec.md:24-37`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/spec.md:320-328`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/plan.md:20-31`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/plan.md:318-323`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/decision-record.md:20-32`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/decision-record.md:190-195`
- **Evidence:** Phase 009 claims "0 'decision' remaining on disk" and that "All 186 spec folders from spec 008 verified" are clean. That does not hold in the current tree: the consolidated spec/plan/decision-record under `022-hybrid-rag-fusion/002-indexing-normalization` still embed source blocks with `contextType: "decision"` in version-controlled markdown.
- **Impact:** The checked completion state overstates what is actually true in the repository. Anyone using the checklist/spec as evidence of full cleanup would reach the wrong conclusion.
- **Recommendation:** Narrow the wording to the actual verification scope, or expand the cleanup/verification pass to include embedded historical frontmatter blocks inside consolidated documents and rerun the documented verification.

## P2

### P2-1 Exact migration and dedup counts are documented as facts, but they are not traceable to committed evidence

- **File:** `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/spec.md:104-118`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:18-20`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:39-40`
- **Evidence:** The docs assert exact operational totals: `2006 decision→planning`, `3 discovery→general`, `13,211 duplicate rows removed`, `1,200 unique entries`, and the `95 / 1,104 / 1` distribution. The committed source changes do prove the parser/schema/runtime updates, but there is no checked-in SQL migration artifact, captured query output, DB snapshot, or generated report that makes those exact numbers independently verifiable from source control. This is especially relevant because the prompt's traceability questions explicitly target those row counts.
- **Impact:** The numbers may reflect one local database state, but they are not reproducible or auditable from the repository alone. That weakens both the checklist's checked evidence and the accuracy of any release note or commit message that repeats those counts.
- **Recommendation:** Check in reproducible evidence for the operational claims, such as the SQL used plus captured query output, or a generated audit artifact under the spec folder. If that evidence will remain external, soften the wording so the docs distinguish "code changed" from "local DB observed X rows".

### P2-2 The documented template-file count is not supported by the relevant commit set

- **File:** `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/review/deep-review-strategy.md:6-7`
- **Evidence:** The strategy says the scope is "14 source files + 41 template files." That count does not match the committed work for the spec-009 fix series. Across the relevant commits (`0829afc8a`, `781e53404`, `a7656dc97`, `1c932a4a0`, `a2b4be2af`, `369357cf5`, `c151fcd4f`), only two template files are touched: `.opencode/skill/system-spec-kit/templates/context_template.md` and `.opencode/skill/system-spec-kit/templates/addendum/phase/phase-child-header.md`. Even the broader diff from `v3.1.4.0` to `c151fcd4f` only shows 15 changed template files, not 41.
- **Impact:** The documented blast radius is inflated, which makes downstream Files Changed / changelog traceability unreliable and obscures which template edits were actually part of the phase-009 fix work.
- **Recommendation:** Recompute the template-file count directly from the scoped release commit set and update the strategy/changelog language to separate spec-009 fixes from unrelated template churn already present on the branch.
