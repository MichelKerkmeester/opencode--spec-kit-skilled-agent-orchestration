# Focus

Trace validator, template header, anchor semantics, provenance parsing, and test fixtures that treat `templates/level_N/` as canonical.

# Actions Taken

1. Read `scripts/utils/template-structure.js` end-to-end and traced how `check-template-headers.sh` derives expected headers and anchors.
2. Located and read the actual staleness checker at `scripts/spec/check-template-staleness.sh`; the prompt path `scripts/rules/check-template-staleness.sh` does not exist in this checkout.
3. Read `shared/parsing/spec-doc-health.ts`, `scripts/lib/anchor-generator.ts`, `scripts/wrap-all-templates.ts`, and provenance validators.
4. Grepped `mcp_server/tests/` and `scripts/tests/` for hardcoded `templates/level_` and `level_N` references.
5. Recounted `SPECKIT_TEMPLATE_SOURCE` usage under `.opencode/specs/` and sampled marker source distributions.

# Findings

## Validator and Template Path Expectations

`check-files.sh` is not the hard blocker for removing materialized level directories. It encodes required files by detected numeric level and does not read `templates/level_N/` to decide the required file set.

The stronger validator dependency is `check-template-headers.sh` -> `scripts/utils/template-structure.js`.

`template-structure.js` contains a hardcoded `TEMPLATE_PATHS` table:

| Level | Files Resolved |
| --- | --- |
| `1` | `level_1/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` |
| `2` | `level_2/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` |
| `3` | `level_3/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` |
| `3+` | `level_3+/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` |

The helper reads those files to build the contract:

- H2 headers are extracted after fenced-code stripping.
- Header text is normalized by removing placeholders (`[...]`), removing numeric prefixes, collapsing whitespace, trimming, and uppercasing.
- Headers prefixed `L2:`, `L3:`, or `L3+:` are optional template headers.
- Anchors are extracted from `<!-- ANCHOR:id -->` opening tags.
- Required anchors are the template anchors whose anchored section contains at least one required H2.
- Optional anchors are the template anchors whose anchored section contains optional H2s only.
- `decision-record.md` is special-cased: it does not derive its contract from the materialized template. It accepts dynamic `ADR/DR` entries and allows `adr-001*` anchors.
- Phase spec addenda are inferred from folder shape: a parent with child phase dirs adds the parent phase addendum, and a child whose parent `spec.md` contains `phase-map` adds the child header addendum.

This means full deletion of `level_N` outputs would break header validation unless `template-structure.js` is changed to either call a generator or resolve against a generated compatibility cache. A static manifest could work, but only if it preserves the same header and anchor ordering rules now derived from rendered markdown.

## Staleness and Provenance Markers

The actual staleness checker is `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh`.

Its current expectations:

- Current template version is read from `templates/level_1/spec.md`, first 30 lines, by grepping `SPECKIT_TEMPLATE_SOURCE` and extracting `vN.N`.
- Each spec folder's version is read from that folder's `spec.md`, first 30 lines, using the same `vN.N` regex.
- It excludes `scratch`, `memory`, `node_modules`, `.git`, `test-fixtures`, and `templates` during folder discovery.
- `--auto-upgrade` rewrites only the version portion in canonical spec docs, preserving the template source identifier before `|`.

`check-template-source.sh` is looser:

- It checks `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- It only requires `SPECKIT_TEMPLATE_SOURCE:` to appear in the first 20 lines.
- It does not parse or validate the source name.

`shared/parsing/spec-doc-health.ts` is also loose:

- It checks the first 500 bytes of the same document set, minus `implementation-summary.md`.
- It treats missing template source as a warning, not an error.
- Its regex accepts any non-empty marker payload: `<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*.+\s*-->`.

The current materialized templates are inconsistent with the "template path" idea. Their markers are mostly source-component names, not physical `level_N` paths:

- `spec-core | v2.2`
- `plan-core | v2.2`
- `tasks-core | v2.2`
- `impl-summary-core | v2.2`
- `checklist | v2.2`
- `decision-record | v2.2`
- `spec-core + level2-verify + level3-arch | v2.2`
- `spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2`

Recount under `.opencode/specs/`:

| Metric | Count |
| --- | ---: |
| `SPECKIT_TEMPLATE_SOURCE` occurrences | 5901 |
| Files with marker | 3168 |
| Unique folders with marker | 715 |

The "~800 spec folders" claim is directionally plausible but high for the current checkout. Current observed marker-bearing folders: 715.

## ANCHOR Invariants

There are several anchor parsers with overlapping but non-identical grammars:

| Consumer | Opening Syntax | ID Grammar | Closing Required | Notes |
| --- | --- | --- | --- | --- |
| `template-structure.js` | `<!-- ANCHOR:id -->` | `[A-Za-z0-9][A-Za-z0-9_-]*` | yes for section parsing | Does not accept slash IDs; preserves template order. |
| `spec-doc-health.ts` | `<!-- ANCHOR:id -->` | `\S+` | yes for error-free result | Only compares open and close sets; duplicates collapse in Sets. |
| `preflight.ts` | `<!-- ANCHOR:id -->` or lowercase `anchor` | `[a-zA-Z0-9][a-zA-Z0-9-/]*` | yes | Detects duplicate opening IDs and invalid IDs. |
| `memory-parser.ts` | `<!-- ANCHOR:id -->` or lowercase `anchor` | `[a-zA-Z0-9][a-zA-Z0-9-/]*` | yes | Invalid anchor structure causes anchor extraction to return `{}`. |
| `anchor-metadata.ts` | parser constants from search metadata | supports complete pairs | yes for emitted metadata | Unmatched opens/closes are ignored silently so retrieval does not crash. |
| `memory-sufficiency.ts` | `<!-- ANCHOR:id -->` or lowercase `anchor` | `[a-zA-Z0-9][a-zA-Z0-9-/]*` | no, counts openings | Used as a sufficiency signal. |
| `spec-doc-structure.ts` | `<!-- ANCHOR:id -->` | `[A-Za-z0-9][A-Za-z0-9_-]*` | yes | Nested same-id anchors are illegal; orphan and unclosed anchors are errors. |

Consolidation cannot regenerate "equivalent" anchors with different IDs and call it safe. Anchor IDs are structural: validators compare required anchor sequence, search records expose anchor IDs, routing keeps recent anchors, and memory extraction can address anchors directly.

## Anchor Injection Algorithm

The anchor wrapper path in this checkout is `scripts/wrap-all-templates.ts`, not `scripts/templates/wrap-all-templates.ts`.

`wrap-all-templates.ts`:

- Defines `LEVEL_FOLDERS = ['level_1', 'level_2', 'level_3', 'level_3+']`.
- Defines `TEMPLATE_FILES = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md', 'implementation-summary.md']`.
- For each file, reads content and calls `wrapSectionsWithAnchors(content)`.
- Writes the file only when `anchorsAdded > 0`.
- Skips missing files per level.

`wrapSectionsWithAnchors` in `scripts/lib/anchor-generator.ts`:

- Splits content on literal `\n`.
- Collects existing anchors with `/<!--\s*ANCHOR:\s*([a-z0-9-]+)\s*-->/gi`.
- Preserves anchors by skipping a `##` heading if an opening anchor appears within the previous two lines.
- Detects sections from exact `## ` headings only.
- Section end is the line before the next exact `## ` heading, or EOF.
- Anchor ID is deterministic for new wrappers: `${generateSemanticSlug(headingText)}-${sectionIndex}`.
- `generateSemanticSlug` lowercases, removes non-alphanumeric/space chars, splits whitespace, removes stop words and action verbs, keeps words longer than two chars, takes up to four words, and joins with hyphens; empty output becomes `unnamed`.
- Collisions are resolved by appending `-2`, `-3`, etc.
- Inserts:
  - `<!-- ANCHOR:id -->`
  - original section lines
  - `<!-- /ANCHOR:id -->`
  - a blank line
- Existing anchor IDs are preserved; the generator only creates IDs for unwrapped H2 sections.

The currently generated template anchors therefore depend on the rendered markdown line structure and H2 order. Byte-identical on-demand output is plausible only if the generator composes first, then applies the same wrapper, then preserves line endings and blank-line insertion exactly. A manifest-only rewrite would need golden comparisons against all 21 materialized markdown outputs.

## Test Fixtures Hardcoding Level Directories

Hardcoded `level_N` references appear in these test files:

- `scripts/tests/test-template-system.js`
- `scripts/tests/test-template-comprehensive.js`
- `scripts/tests/test-five-checks.js`
- `scripts/tests/test-integration.vitest.ts`
- `scripts/tests/test-phase-system.sh`
- `scripts/tests/template-structure.vitest.ts`
- `scripts/tests/progressive-validation.vitest.ts`
- `scripts/tests/progressive-validation.vitest.js`
- `mcp_server/tests/spec-doc-structure.vitest.ts`
- `mcp_server/tests/thin-continuity-record.vitest.ts`

The phase creation expected-output fixtures also hardcode template provenance/title suffixes with `template:level_1/...`, `template:level_2/...`, and `template:level_3/...`:

- `scripts/tests/fixtures/phase-creation/expected-2phase-default/**`
- `scripts/tests/fixtures/phase-creation/expected-3phase-named/**`

Notable expectations:

- `test-template-system.js` asserts all four level directories exist and have exact file counts: 4, 5, 6, 6.
- `test-template-comprehensive.js` repeats the exact file-count checks and source marker checks.
- `template-structure.vitest.ts` asserts `resolveTemplatePath('2', 'plan.md')` ends in `templates/level_2/plan.md` and `resolveTemplatePath('3+', 'decision-record.md')` ends in `templates/level_3+/decision-record.md`.
- `test-integration.vitest.ts` directly asserts `templates/level_1`, `level_2`, and `level_3` exist and reads `level_2/spec.md`.
- `test-phase-system.sh` copies `templates/level_1` into a temp repo for phase tests.

These tests are not just incidental snapshots. They encode the current public API of the template system.

# Questions Answered

Q4: The file-existence validator can survive consolidation because required files are encoded by level, but the header validator cannot survive raw deletion of materialized level directories. Its contract is derived from rendered `templates/level_N/*.md` paths through `template-structure.js`.

Q6: Byte-identical output is achievable in principle if consolidation keeps `compose.sh` semantics and runs the existing anchor wrapper after composition. It is risky with a manifest-only or TS rewrite unless every level/file pair is golden-tested for exact bytes, because anchor IDs and blank lines are generated from rendered section order.

Q8: The hardcoded path surface is broader than runtime scripts. Tests, fixtures, command-facing expectations, and title/provenance strings all assume `level_N` paths or names.

# Questions Remaining

- Q3: Generator choice still needs a direct byte-diff experiment: current `compose.sh --verify` plus a generated temp tree compared against checked-in level outputs.
- Q5: Backward compatibility plan should define whether old `SPECKIT_TEMPLATE_SOURCE` names remain accepted forever or get normalized during upgrade.
- Q7: Need measure create-time impact of compose-on-demand or cache-refresh path against the <500ms target.
- Q9: Recommendation is trending PARTIAL: source-of-truth consolidation with a compatibility cache/resolver first, then optional physical deletion after consumers are migrated.

# Next Focus

Run a deterministic output experiment: generate the level outputs into a temp cache from `core/` and `addendum/`, run the anchor wrapper if needed, compare bytes against checked-in `templates/level_N/`, and measure latency. Then trace `create.sh` and `template-utils.sh` change points for a compatibility cache design.
