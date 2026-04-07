---
type: deep-research
topic: Memory quality root cause analysis - generate-context.js JSON mode
spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues
status: complete
iterations: 10
generated: 2026-04-06T17:20:00Z
---

# Memory Quality Backend Improvements — Deep Research Report

## 1. Executive Summary
This research investigated eight defect classes observed in seven JSON-mode memory artifacts generated through `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`. Across iterations 1-9, every live defect except D6 was traced to a concrete owner in the JSON-mode pipeline, and the remaining D6 reproducer was narrowed to a historical or stale-sample issue rather than an active defect at the currently inspected merge site. [REFERENCE: iteration-001 through iteration-009]

The highest-confidence root causes are localized and concrete: D1 is caused by a hard `substring(0, 500)` clamp in `collect-session-data.ts`, D2 is caused by `extractDecisions()` skipping raw JSON decision arrays and falling through to lexical placeholder generation, D3 is split between unconditional folder-token append in `workflow.ts` and stopword-collapsed bigram generation in `semantic-signal-extractor.ts`, and D4 is a multi-writer drift introduced when `frontmatter-migration.ts` rewrites only the top tier. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

Later iterations converged the higher-risk recommendations into a narrower final matrix. D2 should be fixed with precedence hardening, not blanket lexical suppression; D5 should discover only an immediate, unambiguous predecessor with continuation gating; D7 should inject provenance only, not reuse the full captured-session enrichment path; and D3 should remove unconditional folder-token append while keeping `ensureMinTriggerPhrases()` as the guarded low-count fallback. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:108-131`] [REFERENCE: iteration-009]

The resulting remediation plan is intentionally incremental. P0 fixes are the low-risk, high-certainty changes: D8 template cleanup and D1 boundary-safe trimming. P1 addresses structural consistency and provenance gaps. P2 covers the more behaviorally sensitive search-quality fixes in D2 and D3. P3 reserves D5 and D6 for the cases where ambiguity and historical drift make a cautious, fixture-first rollout more appropriate. [REFERENCE: iteration-008 and iteration-009]

Convergence was effectively reached by iteration 9, where new information fell to `0.29`, all seven research questions had been answered, and the remaining work shifted from discovery to synthesis. Iteration 10 therefore serves as the final synthesis pass and establishes this report as the canonical source of truth superseding the individual iteration notes. [REFERENCE: iteration-008 and iteration-009]

## 2. Research Charter
Topic: root cause analysis and backend remediation for memory quality issues in JSON-mode `generate-context.js` saves for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues`. Scope included the structured JSON save path (`--json`, `/tmp/save-context-data.json`, and `--stdin`), the render pipeline, extractor behavior, template behavior, and any supporting migration or enrichment layers that shaped the broken sample outputs. Non-goals included manual repair of the seven broken memory files, redesign of the broader memory system, capture-mode investigations outside the JSON path, V8 contamination work, embedding-model changes, and `/memory:save` UX work. Stop conditions were: answer Q1-Q7, map D1-D8 to concrete owners, and converge by max-iteration or diminishing new information. [REFERENCE: deep-research-strategy.md]

## 3. Methodology
The investigation used a 10-iteration LEAF research loop with `cli-codex`, `gpt-5.4`, and `high` reasoning. Each iteration focused on one defect family or one synthesis step, wrote a standalone markdown note, and externalized state through `deep-research-state.jsonl`, `deep-research-strategy.md`, and `findings-registry.json`. This let each pass start with fresh context while preserving continuity through artifacts rather than model memory. [REFERENCE: deep-research-strategy.md, iteration-001 through iteration-009]

Iterations 1-7 localized the defect owners. Iteration 8 converted those findings into a remediation matrix. Iteration 9 then pressure-tested the open loose ends, narrowed the riskier recommendations, and ruled out the original F7 reproducer for D6. Iteration 10 synthesizes those artifacts into the canonical report. [REFERENCE: iteration-008 and iteration-009]

## 4. Defect Catalog (D1–D8)
D1: OVERVIEW truncation is a high-severity content corruption defect affecting all seven inspected memory files, because the summary text is visibly cut mid-sentence and degrades the most prominent human-readable section. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`] [REFERENCE: iteration-002]

D2: Generic decision placeholders are a high-severity semantic corruption defect affecting F1 and F2, where authored decisions are replaced by lexical fallbacks such as `observation decision 1` and `user decision 1`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`] [REFERENCE: iteration-003]

D3: Garbage trigger phrases are a high-severity retrieval-quality defect affecting F1, F2, and F6, where path fragments or synthetic word-pair artifacts pollute both frontmatter triggers and `Key Topics`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`] [REFERENCE: iteration-004]

D4: Importance-tier mismatch is a medium-severity metadata trust defect affecting F1 and F2, where frontmatter and the bottom metadata block disagree about the same memory's tier classification. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`] [REFERENCE: iteration-005]

D5: Missing `supersedes` links are a medium-severity lineage defect affecting continuation pairs such as F2→F1 and F5→F4, because continuation runs do not automatically attach to their immediate predecessors. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`] [REFERENCE: iteration-006]

D6: Duplicate trigger phrases were originally logged as a low-severity defect against F7, but the final skeptical pass ruled F7 out as a current reproducer and reclassified the defect as historical or stale-sample pending a better fixture. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:43-48`] [REFERENCE: iteration-009]

D7: Empty git provenance is a low-severity metadata completeness defect affecting all seven files, where `head_ref`, `commit_ref`, and repository state fields render empty because JSON mode bypasses the only enrichment path that fills them. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`] [REFERENCE: iteration-007]

D8: Anchor mismatch is a cosmetic template defect affecting all seven files, where the TOC uses `overview` while the comment anchor block still uses `summary`. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`] [REFERENCE: iteration-007]

## 5. Root Cause Analysis
D1 originates in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, where `sessionSummary` is truncated with `substring(0, 500)` before the template renders `{{SUMMARY}}`, making the extractor, not the template, the actual owner. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

D2 originates in `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185` and `:367-388`. The extractor never reads raw `keyDecisions` or `decisions` directly, so when normalized carriers are absent it falls through to lexical mining, which is also the branch that manufactures the generic placeholder labels. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:87-107`]

D3 has two concrete owners. Frontmatter trigger pollution comes from `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, where folder-derived tokens are appended after filtering. `Key Topics` fragment bigrams come from `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, where bigrams are counted after stopword removal collapses the token stream. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:116-149`]

D4 originates in `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`, which can recompute and rewrite the top frontmatter tier independently after initial render, while leaving the bottom metadata block stale. The post-save reviewer does not repair or even directly compare those two rendered locations. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`]

D5 originates as an orchestration omission rather than a parsing bug. `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236` only passes through existing `causal_links`, and the surrounding JSON-mode pipeline in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-740` and `:1305-1372` never scans the folder or memory index for a predecessor before render. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-740`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`]

D6 does not currently localize to the inspected workflow merge path. The current merge code in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`, the indexer merge in `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`, and YAML serialization in `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:95-105` either deduplicate or merely preserve inputs. That means the exact active owner remains unproven. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:95-105`] [REFERENCE: iteration-009]

D7 originates in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659` and `:877-923`, where `isCapturedSessionMode` is gated by `_source !== 'file'`, and only that captured-session branch executes the enrichment flow that eventually calls `extractGitContext()`. JSON-mode payloads therefore skip provenance collection entirely. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560`]

D8 originates directly in `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`, where the TOC, HTML id, and comment-anchor naming are inconsistent in the template source itself. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

## 6. Remediation Matrix (FINAL — supersedes iter 8)
| ID | Final remediation | Owner | Verification |
|----|-------------------|-------|--------------|
| D1 | Replace raw `substring(0, 500)` with a shared boundary-aware trimming helper modeled on `buildSessionSummaryObservation()`. | `collect-session-data.ts:875-881` | Helper-level fixture tests plus a template replay snapshot. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`] |
| D2 | Add raw JSON decision reading first, then use precedence hardening only when authoritative raw arrays exist; do not blanket-disable lexical fallback for all JSON-mode saves. | `decision-extractor.ts:182-185`, `decision-extractor.ts:367-388` | Fixtures for valid raw arrays, missing normalized carriers, and degraded decision-less JSON payloads. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`] |
| D3 | Remove unconditional folder-token append, keep `ensureMinTriggerPhrases()` as the only guarded folder-derived fallback, and require source adjacency for topic bigrams. | `workflow.ts:1271-1295`, `workflow.ts:1274-1298`, `semantic-signal-extractor.ts:260-284` | F1/F6 replay fixtures for both trigger and topic outputs. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:108-131`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`] |
| D4 | Extend managed-frontmatter migration to rewrite the bottom metadata block from the same resolved tier, and add reviewer coverage for frontmatter-vs-metadata drift. | `frontmatter-migration.ts:1112-1183`, `post-save-review.ts:279-289` | Divergent-fixture migration test plus reviewer assertions. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`] |
| D5 | Add predecessor discovery only for the immediate, unambiguous predecessor, with continuation-signal gating and ambiguity skip. | `memory-metadata.ts:227-236`, `workflow.ts:1305-1372` | Temp-folder lineage fixtures with one valid predecessor and one unrelated sibling. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`] |
| D6 | No production patch yet; replace the stale F7 reproducer with F1 or a synthetic duplicate fixture and isolate the true owner first. | unresolved active owner | Regression fixture only. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`] |
| D7 | Split provenance injection from capture-only enrichment so JSON mode always receives `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead`, but not captured-session summary/observation merges. | `workflow.ts:453-560`, `workflow.ts:877-923` | Stubbed provenance test that proves metadata fills while authored summary stays unchanged. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`] |
| D8 | Standardize the template on `overview` for TOC, HTML id, and comment anchor names. | `context_template.md:172-183`, `context_template.md:330-352` | Template consistency assertion. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`] |

This matrix supersedes the broader iteration-8 draft by adopting the iteration-9 narrowings: D2 is now precedence-only, D5 is immediate-predecessor plus gating, D7 is provenance-only, and D3 explicitly retains the guarded `ensureMinTriggerPhrases()` fallback. [REFERENCE: iteration-008 and iteration-009]

## 7. Detailed Fix Proposals
### D1
Root cause: hard extractor truncation in `collect-session-data.ts`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`]

Proposed fix: replace `substring(0, 500)` with boundary-aware trimming aligned to the helper already used for observation summaries. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`]

Code change: extract or reuse a shared trim helper and wire it into summary collection before template render. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:279-283`]

Risk: slightly longer rendered summaries or duplicated narrative with detailed sections. [REFERENCE: iteration-008]

Verification: unit-test `collectSessionData()` with long fixtures and snapshot rendered overview output. [REFERENCE: iteration-008]

### D2
Root cause: `extractDecisions()` skips raw JSON decision arrays and falls back to lexical placeholder mining. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`]

Proposed fix: read raw `keyDecisions` and `decisions` before lexical mining, and only suppress lexical fallback when authoritative raw arrays are actually present. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`]

Code change: add a raw-reader step and make lexical fallback explicitly conditional on decision-source availability rather than mode alone. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:87-107`]

Risk: regressing degraded-but-current behavior for malformed JSON payloads if fallback is disabled too broadly. [REFERENCE: iteration-009]

Verification: replay fixtures for raw-array, normalized-carrier-missing, and truly decision-less JSON payloads. [REFERENCE: iteration-009]

### D3
Root cause: two separate owners, one for trigger pollution and one for bigram artifacts. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`]

Proposed fix: remove unconditional folder-token append, keep the guarded low-count fallback in `ensureMinTriggerPhrases()`, and reject bigrams that are not adjacent in the source corpus. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:108-131`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`]

Code change: delete or re-filter the late folder-token append block and add adjacency validation before topic bigrams are emitted. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:176-183`]

Risk: overfiltering valid short names or lowering topic recall. [REFERENCE: iteration-008 and iteration-009]

Verification: F1/F6 fixture replay plus a control fixture with a real adjacent phrase such as `spec kit`. [REFERENCE: iteration-008]

### D4
Root cause: a second independent writer rewrites frontmatter after initial render, but the metadata block is left behind. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`]

Proposed fix: update both tier representations from one resolved value and extend reviewer coverage to compare them directly. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`]

Code change: patch the managed-frontmatter migration pass so the bottom metadata tier is rewritten in the same transaction. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

Risk: touching older documents more broadly than intended. [REFERENCE: iteration-008]

Verification: divergent-fixture migration test and reviewer assertions for both mismatch classes. [REFERENCE: iteration-008]

### D5
Root cause: the pipeline never performs predecessor discovery, and the causal builder is pass-through only. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`]

Proposed fix: add immediate-predecessor discovery with strong continuation gating and ambiguity skip. [REFERENCE: iteration-009]

Code change: insert a pre-render helper before `buildCausalLinksContext()` that consults the folder, picks only one qualified predecessor, and injects `supersedes` when lineage is clear. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`]

Risk: false-positive lineage in crowded folders or mixed-topic histories. [REFERENCE: iteration-009]

Verification: temp-folder lineage fixtures with multiple candidates and continuation-signal checks. [REFERENCE: iteration-009]

### D6
Root cause: still unproven at the active implementation layer. The currently inspected merge and serialization path already deduplicates or preserves rather than generating duplicates. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:95-105`]

Proposed fix: no production patch yet; replace the stale F7 reproducer with F1 or a synthetic fixture. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`] [REFERENCE: iteration-009]

Code change: test instrumentation only. [REFERENCE: iteration-009]

Risk: fixing the wrong stage and obscuring the actual source of historical duplicates. [REFERENCE: iteration-008 and iteration-009]

Verification: regression fixture that traces the first stage to emit a duplicate. [REFERENCE: iteration-009]

### D7
Root cause: provenance extraction is trapped inside captured-session-only enrichment. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

Proposed fix: split provenance-only enrichment from the broader captured-session merge behavior. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`]

Code change: run `extractGitContext()` for JSON-mode saves once project context is known, but merge only provenance fields for that mode. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1085-1089`]

Risk: broader contamination if the full captured-session enrichment path is reused instead of a narrow provenance-only helper. [REFERENCE: iteration-009]

Verification: stubbed git-context test proving refs fill while the authored summary remains untouched. [REFERENCE: iteration-009]

### D8
Root cause: literal template mismatch between comment-anchor name and section id/TOC label. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

Proposed fix: standardize all three on `overview`. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

Code change: rename `ANCHOR:summary` and its closing comment to `overview`. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

Risk: very low, limited to any tooling that still keys off the old comment-anchor name. [REFERENCE: iteration-008]

Verification: anchor-consistency assertion across TOC targets, HTML ids, and comment anchors. [REFERENCE: iteration-008]

## 8. Cross-Cutting Observations
JSON mode is consistently treated as a second-class citizen. D7 is the clearest example: the only enrichment path that gathers git provenance is guarded behind captured-session mode, so structured JSON saves miss metadata that runtime capture gets automatically. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

Several failures share a fallback-masks-missing-data pattern. D2 uses lexical placeholder mining when authoritative decision carriers are absent, D3 injects folder tokens after quality filtering has already run, and D7 silently degrades to empty provenance fields after enrichment is skipped. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1085-1089`]

Quality controls are mostly advisory rather than blocking. The post-save reviewer can report some mismatches, but it neither mutates the output nor covers all important drift classes such as frontmatter-vs-metadata divergence in D4. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`] [REFERENCE: iteration-005]

Multiple defects arise because the same fact is represented in more than one place without a clear single source of truth. Importance tier is duplicated across frontmatter and the metadata block, anchors are duplicated as HTML ids and comment anchors, and causal lineage exists both in markdown and later in the graph layer. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:1-6`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`, `.opencode/skill/system-spec-kit/templates/context_template.md:749-757`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`]

## 9. Cross-Defect Interaction Risks
The initially suspected D7→D5 interaction is narrower than it first appeared. A provenance-only D7 fix does not feed `buildCausalLinksContext()` and therefore does not automatically alter lineage behavior. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`] [REFERENCE: iteration-009]

The real D7 interaction risk is broader contamination. If the implementation reuses the full captured-session enrichment block instead of a provenance-only helper, JSON-mode saves could inherit extra observations, decisions, or trigger phrases, which would destabilize D2 and D3 surfaces. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-518`] [REFERENCE: iteration-009]

D3 must be narrowed carefully so the unconditional folder-token append is removed without also removing the guarded low-count fallback in `ensureMinTriggerPhrases()`. That fallback remains the safer final-resort behavior when coverage is genuinely sparse. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:108-131`] [REFERENCE: iteration-009]

## 10. Priority Ordering
P0: D8 first, then D1. D8 is a template-only cleanup with essentially no behavioral risk, while D1 is a one-owner trim fix with high user-visible value and low implementation complexity. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`]

P1: D4, then D7. D4 restores internal consistency for an already duplicated fact, and D7 fills important metadata gaps once the provenance-only boundary is respected. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

P2: D3, then D2. D3 improves trigger/topic quality but touches multiple heuristics. D2 is semantically important, but the iteration-9 narrowing showed it should ship only with precedence hardening and regression fixtures rather than a broad mode-based behavior change. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`] [REFERENCE: iteration-009]

P3: D5, then D6. D5 requires new lineage semantics and ambiguity handling. D6 is intentionally held back until a trustworthy reproducer and owner are re-established. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`] [REFERENCE: iteration-009]

## 11. Verification Strategy
Use helper-level unit tests for D1, D2, D3b, and D8, because those defects are already localized to small owners and do not require the full CLI pipeline to reproduce. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

Use workflow-slice integration tests for D3a, D5, and D7, where the behavior spans multiple helpers but still does not need end-to-end CLI execution. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1299`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

Prefer sample-payload replay fixtures over full pipeline runs for D2, D3, D4, and D7. F1 and F6 are especially valuable fixture sources because they contain the malformed decision, trigger, and duplicate-history examples that matter most for regression coverage. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:43-48`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/memory/06-04-26_15-37__deep-research-on-graphify-external-repo-python.md:656-661`] [REFERENCE: iteration-008 and iteration-009]

Keep full `generate-context.js` runs as final confirmation only after the localized tests pass. [REFERENCE: iteration-001 and iteration-008]

## 12. Risk Assessment
| Fix | Risk | Mitigation |
|------|------|------------|
| D1 | Longer overviews may bloat markdown or duplicate later narrative. | Keep a soft cap and reuse existing boundary trimming behavior. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:279-283`] |
| D2 | Over-broad JSON lexical suppression could break degraded-but-working payloads. | Use precedence hardening only when authoritative raw arrays are present. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`] |
| D3 | Overfiltering could remove valid short names or reduce topic recall. | Validate against both broken fixtures and known-good adjacent phrases. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1277-1286`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`] |
| D4 | Migration rewrite could touch more document content than intended. | Limit mutation to the exact tier field and add narrow fixtures. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1150-1183`] |
| D5 | Wrong predecessor links could harden false lineage into the causal graph. | Require a single immediate predecessor plus continuation gating and ambiguity skip. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`] [REFERENCE: iteration-009] |
| D6 | Patching the wrong layer could hide the real duplication stage. | Use regression fixtures only until the active owner is known. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`] [REFERENCE: iteration-009] |
| D7 | Reusing the full enrichment path could contaminate JSON-mode content. | Keep the change provenance-only. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`] |
| D8 | Rare tooling may still expect the old `summary` comment anchor. | Standardize and add a consistency assertion. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`] |

## 13. Refactor Opportunities
A single source of truth for importance tier would remove the D4 class entirely by deriving both frontmatter and metadata-block renderings from one resolved value rather than maintaining two independently mutable representations. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

A shared truncation helper should be used across `collect-session-data.ts` and the observation summary path so user-visible narrative truncation follows one consistent boundary policy. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`]

The `_source === 'file'` overload is doing too much. An explicit enrichment-mode flag or save-mode contract would be clearer than inferring provenance behavior, decision fallback behavior, and context enrichment behavior from the same coarse source marker. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`] [REFERENCE: iteration-009]

## 14. Open Questions / Loose Ends
D6 remains the only meaningful loose end. Historical duplicates are visible in F1, but F7 is not a valid current reproducer, and the inspected write path already deduplicates or preserves rather than creating duplicates. A better reproducer or fixture is needed before any code patch is justified. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`] [REFERENCE: iteration-009]

No additional unresolved root-cause owners remain for D1, D2, D3, D4, D5, D7, or D8. The remaining uncertainty is strictly about whether D6 still exists on a live path or only in older artifacts. [REFERENCE: iteration-009]

## 15. Findings Registry
F1. The hard OVERVIEW truncation comes from `collect-session-data.ts`, not the template renderer. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

F2. The best in-repo fix pattern for D1 already exists in `buildSessionSummaryObservation()`, which trims on a boundary and adds ellipsis. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`]

F3. `extractDecisions()` never reads raw JSON decision arrays directly before lexical fallback. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`]

F4. The lexical fallback branch is the one that manufactures `observation decision N` and `user decision N` placeholders. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`]

F5. Folder-token leakage into `trigger_phrases` is owned by the late append logic in `workflow.ts`, not the renderer. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`]

F6. `Key Topics` garbage bigrams come from stopword-collapsed adjacency in `semantic-signal-extractor.ts`, not from the frontmatter trigger path. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`]

F7. The initial save render writes one importance tier into both top and bottom locations, so D4 requires a later second writer to create drift. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:1-6`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`]

F8. The second writer is `frontmatter-migration.ts`, not `frontmatter-editor.ts`. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

F9. The post-save reviewer is advisory and does not repair frontmatter-vs-metadata drift. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`]

F10. The causal-link builder in script space is pass-through only; predecessor discovery does not currently exist. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`]

F11. JSON mode skips the only workflow branch that performs git provenance enrichment because `_source === 'file'` makes `isCapturedSessionMode` false. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

F12. The anchor mismatch is authored directly in `context_template.md`. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

F13. The currently inspected merge/index/render path does not explain exact duplicate trigger phrases in F7. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:95-105`] [REFERENCE: iteration-009]

F14. F7 is not a valid present-tense D6 reproducer. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`] [REFERENCE: iteration-009]

F15. F1 still contains historical duplicate trigger phrases and remains the best currently observed duplicate fixture. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:43-48`] [REFERENCE: iteration-009]

F16. The final D2 recommendation is precedence hardening, not blanket JSON lexical suppression. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`] [REFERENCE: iteration-009]

F17. The final D5 recommendation is immediate-predecessor-only auto-linking with continuation gating and ambiguity skip. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`] [REFERENCE: iteration-009]

F18. The final D7 recommendation is provenance-only injection rather than reuse of full captured-session enrichment. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`] [REFERENCE: iteration-009]

## 16. Convergence Report
- Iterations: 10
- Stop reason: max_iterations + all_questions_answered (Q1-Q7)
- New-info ratio at iter 9: ~0.29 (dropping below 0.30)
- Questions resolved: 7 of 7
- Outstanding: D6 reproducer (historical)

## 17. Next Steps
Run `/spec_kit:plan` against this phase and convert the final remediation matrix into implementation work grouped by P0, P1, P2, and P3. P0 can likely be shipped as a tight low-risk patch set. P1 should stay scoped to consistency and provenance. P2 needs fixture-led regression coverage before code edits. P3 should remain investigation-first, especially for D6. [REFERENCE: iteration-008 and iteration-009]

If the team wants a follow-on audit, use F14-F18 as the highest-value validation set: re-check D6 with a trustworthy reproducer, then confirm the final D2/D5/D7 narrowings remain intact during implementation planning. [REFERENCE: iteration-009]
