# Validation Summary

Command:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/008-deep-skill-feature-catalogs --strict
```

Result: FAILED

Summary: 7 errors, 4 warnings.

Errors:

- Missing required Level 3 file: `decision-record.md`.
- Missing anchor coverage across `plan.md`, `tasks.md`, and `checklist.md`; required anchors are also missing in `spec.md`.
- Missing continuity frontmatter fields in `tasks.md` and `checklist.md`.
- Missing required frontmatter fields in `plan.md`, `tasks.md`, and `checklist.md`.
- Level consistency error because `decision-record.md` is absent.
- Spec document integrity errors for missing/stale markdown references including `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md`.
- Structural template deviations across `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.

Warnings:

- Missing recommended sections.
- Checklist items lack priority context.
- AI protocol incomplete for Level 3.
- Section counts below Level 3 expectations.
