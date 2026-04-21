# Iteration 004 - Maintainability

## Focus

Maintainability pass over catalog standards, continuity metadata, and future-agent ergonomics.

## Files Reviewed

- `spec.md`
- `plan.md`
- `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`
- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`

## Findings

### DRFC-P2-006 - Catalog-root naming guidance conflicts between the packet and sk-doc reference

Severity: P2

The packet and template use lower-case `feature_catalog.md`, while the sk-doc creation reference says the root file is always `FEATURE_CATALOG.md`. Evidence: `spec.md:66-67` and `spec.md:131-146`; `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md:62-74`; `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:82-85`.

Impact: this conflict is not blocking the current shipped catalogs, but it makes future catalog packets harder to review because agents can satisfy one source while violating another.

### DRFC-P2-007 - Continuity frontmatter still routes the next safe action to implementation

Severity: P2

The spec and plan continuity blocks still say the next safe action is to implement the catalogs, even though the catalog roots exist. Evidence: `spec.md:16-20`; `plan.md:8-12`; live sk-deep-review catalog root at `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31`.

Impact: resume tooling or a future agent using packet-local continuity can spend effort on already-created files instead of reconciling completion state.

## Delta

New findings: P2=2. No P0/P1 findings in this dimension.
