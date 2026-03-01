# Full-Tree Fusion Audit

- Date: 2026-02-22 10:36:59 CET
- Commits: 111fb30a 937f0b06 85cc0ce3
- Changed paths (all types): 217
- Existing markdown paths audited: 104

## Invariant Results
- Top-level frontmatter first-line violations: 6
- Missing frontmatter closing delimiter: 0
- Stale active-spec references (outside z_archive): 0

### First-line frontmatter violations (expected exceptions)
- .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/001-mvp-monolithic/custom-rules-design.md
- .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/027-memory-plugin-and-refinement/002-memory-plugin/verification-guide.md
- .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation/test-results.md
- .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/files-touched.md
- .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/081-speckit-reimagined-pre-analysis/001-d-analysis-speckit-architecture-comparison.md
- README.md

## Body Drift Sample (frontmatter-stripped)
- Representative files checked: 3
- Files with body differences: 2

### Body-drift sample files
- .opencode/skill/system-spec-kit/README.md (body changed in commit sample)
- .opencode/skill/system-spec-kit/scripts/memory/README.md (body changed in commit sample)
- .opencode/specs/01--anobel.com/z_archive/003-btn-download-alignment/plan.md (frontmatter-only in commit sample)

## Notes
- This audit enforces structural invariants across the commit-derived markdown set.
- Body drift is sampled from files changed in commit 111fb30a where both parent and commit blobs exist.
- Full corpus body equivalence is not enforced for archive/history migrations.
