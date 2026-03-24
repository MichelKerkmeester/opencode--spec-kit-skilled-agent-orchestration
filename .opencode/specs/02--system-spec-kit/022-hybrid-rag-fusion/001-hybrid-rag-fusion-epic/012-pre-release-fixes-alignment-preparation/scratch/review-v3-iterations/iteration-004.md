# Review Iteration 4: D4 Completeness + D5 Cross-Ref - 006-Feature-Catalog

## Focus
Reviewed the `006-feature-catalog` phase spec against the live feature catalog implementation at `.opencode/skill/system-spec-kit/feature_catalog/`. Cross-checked snippet counts, category counts, and file existence claims.

## Findings
### P1-004: Spec claims 222 snippet files but live catalog has 219
- Dimension: D4
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:47] claims "222 feature catalog snippet files". Live `find` of category-scoped .md files returns 219 (221 total including 2 top-level files: feature_catalog.md and README.md).
- Impact: The spec overstates the catalog by 3 files. This makes the feature coverage math unreliable for release-readiness claims. The root 022 packet also references "222 feature files" at multiple locations.
- Final severity: P1

### P1-005: Spec references 20 categories but live catalog has 19
- Dimension: D5
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:117] says "20 categories" and [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/decision-record.md:208] decided "Keep the existing 20-category structure". Live catalog has 19 real category directories (01--retrieval through 19--feature-flag-reference) plus a `.github` directory that is not a feature category.
- Impact: Either a category was removed or never created. The "20 categories" claim across spec, decision-record, and verification reports is stale.
- Final severity: P1

### P2-004: Multiple overlapping historical count layers without reconciliation
- Dimension: D4
- Evidence: [SOURCE: spec.md:27] "180 snippets" (March 8 baseline), [SOURCE: spec.md:28] "189 snippets" (March 16), [SOURCE: spec.md:36] "194 snippet files" (March 16 addendum +5), [SOURCE: spec.md:47] "222 feature catalog snippet files" (current claim). Four different counts in one document without a clear reconciliation timeline.
- Impact: A reader cannot determine the current ground truth from the spec alone. The live count (219) doesn't match any of the four documented counts.
- Final severity: P2

## Cross-Reference Results
- Category directory names (01--retrieval through 19--feature-flag-reference) match between spec and live filesystem
- Per-category file counts verified: largest is 13--memory-quality-and-indexing (24 files), smallest are 04--maintenance and 07--evaluation (2 files each)
- The `.github` directory is correctly excluded from category count — it contains workflow configs, not features

## Ruled Out
- Missing entire categories: All 19 live categories exist and contain files. The count discrepancy is 20 claimed vs 19 live, not a missing category with features.
- Stale category names: All category directory names match between spec references and live filesystem.

## Assessment
- Confirmed findings: 3
- New findings ratio: 0.50 (3 new findings, 6 prior)
