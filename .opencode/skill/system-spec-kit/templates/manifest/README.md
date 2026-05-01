# Internal Level Contract Maintainer Notes

This directory is private implementation infrastructure for the Spec Kit template system. The JSON control file maps public Level values to the internal document set, lazy document lifecycle, and section gates consumed by scaffolding and validation code.

Public and AI-facing surfaces must keep using Level 1, Level 2, Level 3, Level 3+, and phase-parent wording. The private taxonomy in the JSON file is for maintainers only and must not appear in command help, validator output, generated packet files, agent prompts, command docs, or policy docs.

## Files

- `spec-kit-docs.json`: private source of truth for Level contracts.
- `*.md.tmpl`: whole-document markdown templates with inline `<!-- IF level:N -->` gates.
- `phase-parent.spec.md.tmpl`: lean phase-parent spec template.

## Rendering

Use `scripts/templates/inline-gate-renderer.ts` or its shell wrapper to render a template for a single Level. Rendered output should match the legacy Level template output except for the intentional wording cleanup in user-story placeholders and phase-parent child-list wording.
