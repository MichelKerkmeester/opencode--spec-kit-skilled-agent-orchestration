● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ "**/.opencode/skill/system-spec-kit/feature_catalog/**/*"
  └ 5 files found

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Cross-verify snippet files against the MASTER
  │ FEATURE_CATALOG.md for categories 11-21. Compare master section vs per-category snippet files
  │ for feature name, status, description, and missing/extra snippets. Produce a traceability
  │ consistency report." --threshold 0.8
  └ 2 lines...

I’m mapping the catalog structure first so I can compare the same slices on both sides rather than spot-checking blindly. After that I’ll run a structured diff for categories `11` through `21`.

● Search (grep)
  │ "^##\s+1[1-9]--|^##\s+20--|^##\s+21--"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ No matches found

● Search (grep)
  │ "^#|^##|^###" in *.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/{11--*,12--*,13--*,14--*,15--*,16--*,17--*,18--
  │ *,19--*,20--*,21--*}"
  └ No matches found

● List directory .opencode/skill/system-spec-kit/feature_catalog
  └ 24 files found

● Search (grep)
  │ "11--|12--|13--|14--|15--|16--|17--|18--|19--|20--|21--"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● List catalog entries (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  │ for p in sorted(base.iterdir()):…
  └ 27 lines...

I’ve confirmed the per-category directories exist. Next I’m pulling the exact master anchors and the files inside each category folder so I can compare feature-for-feature instead of just folder-by-folder.

● Read copilot-tool-output-1774423091536-ulc0pa.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423091536-ulc0pa.txt
  └ L1:200 (67 lines read)

● Search (grep)
  │ "11--scoring-and-calibration|12--query-intelligence|13--memory-quality-and-indexing|14--pipeline
  │ -architecture|15--retrieval-enhancements|16--tooling-and-scripts|17--governance|18--ux-hooks|19-
  │ -feature-flag-reference|20--remediation-revalidation|21--implement-and-remove-deprecated-feature
  │ s" (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● List snippet markdown files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  │ for name in […
  └ 160 lines...

I found one structural clue already: the master table of contents numbers don’t line up cleanly with the snippet folder names starting at this range, so I’m checking the actual section bodies next to separate a TOC numbering issue from real content drift.

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1768:1868 (100 lines read)

● Read 01-score-normalization.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalizati
  │ on.md
  └ L1:120 (77 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ L1:120 (10 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ L1:120 (10 lines read)

● Search (grep)
  │ "^##\s+\d+\." (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 21 lines found

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:60 (60 lines read)

● Read copilot-tool-output-1774423101620-lnv8dz.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423101620-lnv8dz.txt
  └ L1:220 (63 lines read)

I’ve narrowed this to a structural alignment problem, not just text drift: the master categories and snippet folders diverge in numbering and category coverage in this range. I’m validating whether that causes missing/extra category groups before I summarize feature-level matches.

● Search (glob)
  │ "**/20--spec-kit-phase-workflows" in .opencode/skill/system-spec-kit/feature_catalog
  └ No matches found

● Search (glob)
  │ "**/21--feature-flag-reference" in .opencode/skill/system-spec-kit/feature_catalog
  └ No matches found

● Search (grep)
  │ "spec-kit-phase-workflows|feature-flag-reference" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 16 lines found

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4298:4660 (133 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L1:80 (80 lines read)

● Read 08-audit-phase-020-mapping-note.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-ma
  │ pping-note.md
  └ L1:80 (10 lines read)

● Search (grep)
  │ "19--feature-flag-reference/08-audit-phase-020-mapping-note.md|20--remediation-revalidation/01-c
  │ ategory-stub.md|21--implement-and-remove-deprecated-features/01-category-stub.md"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ No matches found

● Compare master refs and snippets (shell)
  │ python3 - <<'PY'
  │ import re, json
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')…
  └ 134 lines...

● Compare master refs and snippets (shell)
  │ python3 - <<'PY'
  │ import re, json
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')…
  └ 140 lines...

● Read copilot-tool-output-1774423221834-bm22xk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423221834-bm22xk.txt
  └ L1:260 (260 lines read)

● Read copilot-tool-output-1774423221834-bm22xk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423221834-bm22xk.txt
  └ L261:520 (260 lines read)

● Read copilot-tool-output-1774423221834-bm22xk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423221834-bm22xk.txt
  └ L521:780 (260 lines read)

● Read copilot-tool-output-1774423221834-bm22xk.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423221834-bm22xk.txt
  └ L781:1040 (93 lines read)

I’ve got the full comparison matrix now. I’m spot-checking a few flagged mismatches so the final findings distinguish real content drift from harmless formatting differences.

● Read 02-cold-start-novelty-boost.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelt
  │ y-boost.md
  └ L1:80 (73 lines read)

● Read 17-outsourced-agent-memory-capture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-ag
  │ ent-memory-capture.md
  └ L1:80 (66 lines read)

● Read 17-json-primary-deprecation-posture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
  │ ion-posture.md
  └ L1:80 (80 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L1:90 (90 lines read)

● Summarize category mismatch counts (shell)
  │ python3 - <<'PY'
  │ import json
  │ from pathlib import Path
  │ p = Path('/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423221834-b
  │ m22xk.txt')…
  └ 19 lines...

● Search (grep)
  │ "Outsourced agent memory capture|Stateless enrichment and alignment guards|JSON-primary
  │ deprecation posture|Session capturing pipeline quality"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L1:40 (40 lines read)

● Read 18-session-enrichment-and-alignment-guards.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enric
  │ hment-and-alignment-guards.md
  └ L1:50 (50 lines read)

● List title mismatches (shell)
  │ python3 - <<'PY'
  │ import json
  │ from pathlib import Path
  │ p = Path('/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423221834-b
  │ m22xk.txt')…
  └ 18 lines...

# Iteration 012: Snippet vs Master Catalog Consistency (Categories 11-21)

## Agent: copilot / gpt-5.4 / high

## Dimension: traceability

## Files Reviewed

- `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md`
- `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/*.md` (22)
- `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/*.md` (11)
- `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/*.md` (24)
- `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/*.md` (22)
- `.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/*.md` (9)
- `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/*.md` (18)
- `.opencode/skill/system-spec-kit/feature_catalog/17--governance/*.md` (4)
- `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/*.md` (19)
- `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/*.md` (8)
- `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/*.md` (1)
- `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/*.md` (1)

## Consistency Check

_Status was compared through each snippet’s `CURRENT REALITY` / explicit status wording, because regular snippets do not carry a separate structured `status:` field._

### 11--scoring-and-calibration
- Maps to master `## 12. SCORING AND CALIBRATION`
- Master lists 22 features, snippets: 22 files
- Mismatches: 7 content/status drifts
- Affected: `02-cold-start-novelty-boost.md`, `08-rrf-k-value-sensitivity-analysis.md`, `13-scoring-and-fusion-corrections.md`, `19-learned-stage2-weight-combiner.md`, `20-shadow-feedback-holdout-evaluation.md`, `21-calibrated-overlap-bonus.md`, `22-rrf-k-experimental.md`

### 12--query-intelligence
- Maps to master `## 13. QUERY INTELLIGENCE`
- Master lists 11 features, snippets: 11 files
- Mismatches: 7 description/status drifts
- Affected: `02-relative-score-fusion-in-shadow-mode.md`, `05-dynamic-token-budget-allocation.md`, `07-llm-query-reformulation.md`, `08-hyde-hypothetical-document-embeddings.md`, `09-index-time-query-surrogates.md`, `10-query-decomposition.md`, `11-graph-concept-routing.md`

### 13--memory-quality-and-indexing
- Maps to master `## 14. MEMORY QUALITY AND INDEXING`
- Master lists 24 features, snippets: 24 files
- Mismatches: 11
- Title drift:
  - master `Outsourced agent memory capture` vs snippet `Outsourced agent handback protocol`
  - master `Stateless enrichment and alignment guards` vs snippet `Session enrichment and alignment guards`
- Additional description/status drift in 9 more files, including `01`, `05`, `16`, `19`, `20`, `21`, `22`, `23`, `24`

### 14--pipeline-architecture
- Maps to master `## 15. PIPELINE ARCHITECTURE`
- Master lists 22 features, snippets: 22 files
- Mismatches: 3
- Affected: `10-legacy-v1-pipeline-removal.md`, `18-atomic-write-then-index-api.md`, `19-embedding-retry-orchestrator.md`

### 15--retrieval-enhancements
- Maps to master `## 16. RETRIEVAL ENHANCEMENTS`
- Master lists 9 features, snippets: 9 files
- Mismatches: 2
- Affected: `02-constitutional-memory-as-expert-knowledge-injection.md`, `04-lightweight-consolidation.md`

### 16--tooling-and-scripts
- Maps to master `## 17. TOOLING AND SCRIPTS`
- Master lists 17 features, snippets: 18 files
- Extra snippet: `18-template-compliance-contract-enforcement.md`
- Mismatches: 11
- Title drift:
  - master `JSON-primary deprecation posture` vs snippet `JSON-only save contract`
  - minor heading drift on `12-session-capturing-pipeline-quality.md` (capitalization)
- Additional description/status drift in 9 more files, including `01`, `04`, `05`, `06`, `11`, `13`, `14`, `15`, `16`

### 17--governance
- Maps to master `## 18. GOVERNANCE`
- Master lists 4 features, snippets: 4 files
- Mismatches: 3
- Affected: `02-feature-flag-sunset-audit.md`, `03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`, `04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`

### 18--ux-hooks
- Maps to master `## 19. UX HOOKS`
- Master lists 19 features, snippets: 19 files
- Mismatches: 10
- Affected: `02`, `09`, `10`, `11`, `14`, `15`, `16`, `17`, `18`, `19`

### 19--feature-flag-reference
- Maps to master `## 21. FEATURE FLAG REFERENCE`
- Master lists 7 features, snippets: 8 files
- Extra snippet: `08-audit-phase-020-mapping-note.md`
- Mismatches: 6 of 7 master-backed files
- `01-1-search-pipeline-features-speckit.md` also has a title-format mismatch (`1. Search Pipeline Features...` in master vs unnumbered snippet title)

### 20--remediation-revalidation
- No standalone master feature section maps to this directory
- Master-backed features: 0, snippets: 1 file
- Extra snippet: `01-category-stub.md`
- Master overview says audit phase `021-remediation-revalidation` is covered by cross-category records, not by a standalone category folder

### 21--implement-and-remove-deprecated-features
- No standalone master feature section maps to this directory
- Master-backed features: 0, snippets: 1 file
- Extra snippet: `01-category-stub.md`
- Master overview says audit phase `022-implement-and-remove-deprecated-features` is covered by closure records elsewhere, not by a standalone category folder

## Findings

### P1-001: Category-to-folder traceability breaks for master categories 20-21
Master `## 20. SPEC KIT PHASE WORKFLOWS` has no corresponding snippet folder, while master `## 21. FEATURE FLAG REFERENCE` maps to `19--feature-flag-reference/`. Meanwhile `20--remediation-revalidation/` and `21--implement-and-remove-deprecated-features/` exist as standalone stubs even though the master only references those audit phases in overview coverage notes.

### P1-002: Feature-flag reference snippets are materially stale against master
`19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` diverges from the master flag table on live behavior/status. Examples include `SPECKIT_ASSISTIVE_RECONSOLIDATION`, `SPECKIT_CONSUMPTION_LOG`, `SPECKIT_CONTEXT_HEADERS`, and `SPECKIT_GRAPH_CONCEPT_ROUTING`, where the master now reflects newer runtime posture than the snippet.

### P1-003: Several snippet feature names no longer match master feature names
Confirmed title drift exists in at least:
- `13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`
- `13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md`
- `16--tooling-and-scripts/17-json-primary-deprecation-posture.md`

These are not just formatting issues; they rename the underlying feature concept.

### P2-004: Broad description/current-reality drift exists across master-backed snippets
Across categories `11--19`, I found 60 master-backed snippet files whose description and/or current-reality text no longer matches the master section content. The heaviest drift is in `13--memory-quality-and-indexing`, `16--tooling-and-scripts`, `18--ux-hooks`, and `19--feature-flag-reference`.

### P2-005: Orphan snippet files exist without master-backed feature entries
Extra snippet files not backed by a master feature entry in this range:
- `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md`
- `19--feature-flag-reference/08-audit-phase-020-mapping-note.md`
- `20--remediation-revalidation/01-category-stub.md`
- `21--implement-and-remove-deprecated-features/01-category-stub.md`

## Summary

- Categories checked: 11
- Consistent: 0, Inconsistent: 11
- Total findings: 5 (P0: 0, P1: 3, P2: 2)


Total usage est:        1 Premium request
API time spent:         4m 47s
Total session time:     5m 15s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 18.9k out, 1.2m cached (Est. 1 Premium request)
