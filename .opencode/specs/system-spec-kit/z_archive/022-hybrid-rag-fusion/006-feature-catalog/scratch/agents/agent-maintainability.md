● skill(sk-code-review)

I’m sampling representative catalog entries and the master index now, then I’ll cross-check file coverage, link targets, and naming consistency across category folders.

● List directory .opencode/skill/system-spec-kit/feature_catalog
  └ 24 files found

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/**/*.md"
  └ 5 files found

● Create session plan (shell)
  │ mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/777230fc-8279-4c9f-8cfa-14d07a568452' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/777230fc-8279-4c9f-8cfa-14d07a568452/plan.md'
  │ <<'EOF'…
  └ 7 lines...

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:260 (190 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/*.md"
  └ 11 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/01--retrieval/*.md"
  └ 11 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/*.md"
  └ 22 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/*.md"
  └ 22 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/*.md"
  └ 18 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/*.md"
  └ 8 files found

I found an early structural smell in the master index: the folder list includes `20--remediation-revalidation` and `21--implement-and-remove-deprecated-features`, but the top-level TOC appears to map section numbers differently. I’m validating that against actual link targets and per-file coverage now.

● Read 01-unified-context-retrieval-memorycontext.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memor
  │ ycontext.md
  └ L1:240 (240 lines read)

● Read 06-guards-and-edge-cases.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-e
  │ dge-cases.md
  └ L1:240 (56 lines read)

● Read 11-scoring-and-ranking-corrections.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranki
  │ ng-corrections.md
  └ L1:240 (58 lines read)

● Read 01-4-stage-pipeline-refactor.md
  │ .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-re
  │ factor.md
  └ L1:240 (226 lines read)

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ L1:240 (56 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L1:240 (89 lines read)

I’ve sampled six files, and the per-file template is not actually uniform: some entries use `Tests`, some use `Verification`, and the feature-flag reference pages introduce a local TOC that the other categories don’t have. I’m running a full inventory pass to turn that into concrete, count-backed findings.

● Audit feature catalog coverage and structure (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ from collections import Counter,defaultdict…
  └ 253 lines...

● Search (grep)
  │ "^##\s+20\.|^##\s+21\.|^##\s+9\.|^##\s+19\.|^##\s+Comprehensive remediation"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 4 lines found

✗ Read 01-enriched-read-results.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-enriched-read-results.md
  └ Path does not exist

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ L1:120 (14 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ L1:120 (13 lines read)

● Count all markdown files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  │ all_md = sorted(base.rglob('*.md'))…
  └ 11 lines...

I’ve confirmed there are `224` markdown files in the catalog tree, but only `217` feature files are linked from the master index. I’m now pinpointing which files are outside the dominant template so the findings stay specific and maintainability-only.

● List structural pattern variants (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ from collections import defaultdict, Counter
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode …
  └ 139 lines...

● Search (grep)
  │ "10-fast-delegated-search-memory-quick-search|18-template-compliance-contract-enforcement|08-aud
  │ it-phase-020-mapping-note|20--remediation-revalidation/01-category-stub|21--implement-and-remove
  │ -deprecated-features/01-category-stub"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ No matches found

● Read 08-audit-phase-020-mapping-note.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-ma
  │ pping-note.md
  └ L1:120 (10 lines read)

● Read 14-source-dist-alignment-enforcement.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/14-source-dist-alignment
  │ -enforcement.md
  └ L1:120 (53 lines read)

● Read 16-json-mode-hybrid-enrichment.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enri
  │ chment.md
  └ L1:160 (160 lines read)

● Search (grep)
  │ "^###\s+Comprehensive remediation|^###\s+Audit Phase Coverage Notes"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 3 lines found

● Search (grep)
  │ "Comprehensive remediation \(Sprint 8\)|Comprehensive remediation"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 3 lines found

● Search (grep)
  │ "^###+\s+Comprehensive remediation \(Sprint 8\)|^###+\s+Comprehensive remediation"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ No matches found

FINDING | P1 | `FEATURE_CATALOG.md` is not a complete master index. The catalog tree contains `224` markdown files total (`222` category docs plus `FEATURE_CATALOG.md` and `FEATURE_CATALOG_IN_SIMPLE_TERMS.md`), but the master index links only `217` category docs. Missing from the index: `01--retrieval/10-fast-delegated-search-memory-quick-search.md`, `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md`, `19--feature-flag-reference/08-audit-phase-020-mapping-note.md`, `20--remediation-revalidation/01-category-stub.md`, and `21--implement-and-remove-deprecated-features/01-category-stub.md`.

FINDING | P1 | Master-index internal navigation is broken. The top-level TOC links use `#N--slug` anchors, but headings such as `## 2. RETRIEVAL` resolve to `#2-retrieval`, not `#2--retrieval`; this affects all `21` top-level TOC entries. There is also an inline link to `#comprehensive-remediation-sprint-8` with no matching heading in `FEATURE_CATALOG.md`.

FINDING | P2 | The file template is not structurally uniform. The dominant pattern (`1. OVERVIEW / 2. CURRENT REALITY / 3. SOURCE FILES / 4. SOURCE METADATA`) appears in `176/222` category docs, leaving `46` structural outliers. Sampled examples: `16--tooling-and-scripts/11-feature-catalog-code-references.md` adds `5. PLAYBOOK COVERAGE`, `19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` adds a local `TABLE OF CONTENTS`, and `16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md` swaps in `FEATURE BREAKDOWN` and `VERIFICATION SOURCES`.

FINDING | P2 | No blank/empty sections were detected, but three pages are template orphans with no numbered H2 scaffold at all: `19--feature-flag-reference/08-audit-phase-020-mapping-note.md`, `20--remediation-revalidation/01-category-stub.md`, and `21--implement-and-remove-deprecated-features/01-category-stub.md`. Folder slugs themselves are consistently `NN--slug`; the maintainability drift is between master-index section numbering/navigation and the physical category folders for `19`-`21`.

SUMMARY: P0=0, P1=2, P2=2 maintainability findings.

