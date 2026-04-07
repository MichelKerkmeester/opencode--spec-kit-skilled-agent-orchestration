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

This expanded synthesis now covers the full three-generation research program: Gen-1 root-cause localization (iterations 1-10), Gen-2 implementation narrowing and rollout design (iterations 11-20), and Gen-3 safety/performance/operability validation (iterations 21-25). The prior canonical report compressed that corpus down to a small registry and digest appendix; this rewrite restores the per-iteration evidence trail so that readers can answer iteration-specific questions without reopening the raw notes. [REFERENCE: iteration-001 through iteration-025]

Across those 25 iterations, the corpus produced 176 total findings/recommendations, of which 166 were captured as numbered finding entries and are now listed directly in the generation-scoped registry below. The remaining synthesis-level determinations are represented in the convergence declarations, PR-train planning, migration guidance, observability addenda, and the new master recommendations catalog. [REFERENCE: iteration-010, iteration-020, iteration-023, iteration-024, iteration-025]

The expanded view materially changes prioritization confidence. Gen-2 established that D4 and D8 are population-scale JSON-mode defects, D2 and D6 remain narrow enough to justify fixture-first fixes, and D3 warrants a focused sanitizer rather than generic cleanup. Gen-3 then added the missing rollout safety layer: no hidden second D2/D7 owner surfaced, PR-7 latency stayed acceptable under the narrowed design, historical migration is only partially safe, and the only net-new defect candidate is a concurrent-save race around cross-process locking. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:20-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:23-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:20-41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md:22-34]

## 2. Research Charter
Topic: root cause analysis and backend remediation for memory quality issues in JSON-mode `generate-context.js` saves for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues`. Scope included the structured JSON save path (`--json`, `/tmp/save-context-data.json`, and `--stdin`), the render pipeline, extractor behavior, template behavior, and any supporting migration or enrichment layers that shaped the broken sample outputs. Non-goals included manual repair of the seven broken memory files, redesign of the broader memory system, capture-mode investigations outside the JSON path, V8 contamination work, embedding-model changes, and `/memory:save` UX work. Stop conditions were: answer Q1-Q7, map D1-D8 to concrete owners, and converge by max-iteration or diminishing new information. [REFERENCE: deep-research-strategy.md]

## 3. Methodology
The investigation used a 10-iteration LEAF research loop with `cli-codex`, `gpt-5.4`, and `high` reasoning. Each iteration focused on one defect family or one synthesis step, wrote a standalone markdown note, and externalized state through `deep-research-state.jsonl`, `deep-research-strategy.md`, and `findings-registry.json`. This let each pass start with fresh context while preserving continuity through artifacts rather than model memory. [REFERENCE: deep-research-strategy.md, iteration-001 through iteration-009]

Iterations 1-7 localized the defect owners. Iteration 8 converted those findings into a remediation matrix. Iteration 9 then pressure-tested the open loose ends, narrowed the riskier recommendations, and ruled out the original F7 reproducer for D6. Iteration 10 synthesizes those artifacts into the canonical report. [REFERENCE: iteration-008 and iteration-009]

- **Generation 1 (iterations 1-10):** localized D1-D8 to concrete owners, built the original remediation matrix, and declared initial convergence.
- **Generation 2 (iterations 11-20):** validated citation stability, measured corpus prevalence, narrowed D2/D3/D5/D7 implementation shape, designed fixtures and shared refactors, and produced the staged PR train.
- **Generation 3 (iterations 21-25):** audited latent failure modes, modeled PR-7 latency, evaluated migration options, specified telemetry/alerting, and verified capture-mode parity boundaries.

## 4. Defect Catalog (D1–D9 candidate)
D1: OVERVIEW truncation is a high-severity content corruption defect affecting all seven inspected memory files, because the summary text is visibly cut mid-sentence and degrades the most prominent human-readable section. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`] [REFERENCE: iteration-002]

D2: Generic decision placeholders are a high-severity semantic corruption defect affecting F1 and F2, where authored decisions are replaced by lexical fallbacks such as `observation decision 1` and `user decision 1`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`] [REFERENCE: iteration-003]

D3: Garbage trigger phrases are a high-severity retrieval-quality defect affecting F1, F2, and F6, where path fragments or synthetic word-pair artifacts pollute both frontmatter triggers and `Key Topics`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`] [REFERENCE: iteration-004]

D4: Importance-tier mismatch is a medium-severity metadata trust defect affecting F1 and F2, where frontmatter and the bottom metadata block disagree about the same memory's tier classification. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`] [REFERENCE: iteration-005]

D5: Missing `supersedes` links are a medium-severity lineage defect affecting continuation pairs such as F2→F1 and F5→F4, because continuation runs do not automatically attach to their immediate predecessors. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`] [REFERENCE: iteration-006]

D6: Duplicate trigger phrases were originally logged as a low-severity defect against F7, but the final skeptical pass ruled F7 out as a current reproducer and reclassified the defect as historical or stale-sample pending a better fixture. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:43-48`] [REFERENCE: iteration-009]

D7: Empty git provenance is a low-severity metadata completeness defect affecting all seven files, where `head_ref`, `commit_ref`, and repository state fields render empty because JSON mode bypasses the only enrichment path that fills them. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`] [REFERENCE: iteration-007]

D8: Anchor mismatch is a cosmetic template defect affecting all seven files, where the TOC uses `overview` while the comment anchor block still uses `summary`. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`] [REFERENCE: iteration-007]

D9 (candidate): Cross-process save-lock race is a low-frequency but operationally important latent defect candidate. The current workflow can continue after stale-lock read failure, timeout, or unexpected lock-directory errors without a stronger cross-process serialization guarantee, which means concurrent saves may still interleave in ways the defect-driven D1-D8 analysis never exercised. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:20-29]

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

### Generation-2 Evidence Addenda

#### D1 — extractor-bound truncation plus shared-helper extraction
Iteration 17 confirmed that D1 does not need a new design surface: the repo already has one boundary-aware truncator in `buildSessionSummaryObservation()`, and the live divergence exists only because `collect-session-data.ts` bypasses that helper with a raw `substring(0, 500)`. That keeps the post-fix refactor surface small and supports shipping D1 as a functional correction before any broader helper extraction. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]

#### D2 — exact predicate boundary and precedence-only fix seam
Iteration 13 pinned the real D2 patch boundary to the lexical admission predicate inside `extractDecisions()`: the placeholder branch remains governed by `decisionObservations.length === 0 && processedManualDecisions.length === 0`, and there is still no direct raw `keyDecisions` reader in this file. Iteration 17 then showed that the densest nearby truncation/user-visible logic already lives in `decision-extractor.ts`, which makes D2 a tight branch fix rather than a mode-wide behavior rewrite. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135,182-185,270-274,329-332,381-455]

#### D3 — empirical junk-filter design and reviewer-safe scope
Iteration 15 converted D3 from diagnosis into an empirical filter proposal: path-like fragments are the largest removable junk class, standalone stopwords are demonstrably present in live trigger arrays, and a narrow tuned filter removes 10.08% of corpus trigger occurrences with zero observed false positives. That evidence supports the remediation matrix choice to remove unconditional folder-token append, keep `ensureMinTriggerPhrases()` as the guarded low-count fallback, and move any residual singleton suppression into reviewer/assertion space rather than a broad regex bomb. [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:27-32] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/memory/01-04-26_07-21__prepared-the-external-graph-memory-research-phase.md:36-40]

#### D4 — two-writer problem before SSOT extraction
Iteration 17 confirmed that D4 remains a true two-writer problem and that the rest of the `importanceTier` surface is only propagation or detection. That means the repair should land as a writer synchronization/SSOT change first, with reviewer migration last, rather than trying to fix the issue at every mention of tier metadata in the repo. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-885,894-1064; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]

#### D5 — continuation-signal gate backed by corpus evidence
Iteration 14 measured the continuation-signal corpus directly and validated the Gen-1 narrowing: `extended` and `continuation` are rare but precise, while `phase N` and `vN` are noisy false-positive families. That evidence is why the final D5 proposal remains immediate-predecessor-only with ambiguity skip; it is now corpus-calibrated rather than intuition-based. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/memory/06-04-26_13-49__extended-deep-research-phase-003-contextador-from.md:2-2] [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:2-2]

#### D7 — provenance-only patch sized and de-risked
Iteration 18 reduced D7 from an architectural discussion to a tiny workflow patch: `extractGitContext()` already provides the correct degradation and detached-HEAD contract, `enrichCapturedSessionData()` is too broad a fix surface, and a six-line JSON-mode insertion after Step 3.5 is sufficient. That is the concrete evidence behind the provenance-only language frozen in the final matrix. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

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

### Generation-3 Addenda

- **PR-10 (optional):** Safe-subset batch migration for historical JSON-mode files should be treated as an optional post-remediation PR, not folded into the core 9-PR train. Gen-3 concluded that D8/D4 and possibly D3 can be mechanically repaired, but D1/D2/D5/D7 cannot be recovered safely from file content alone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:20-41]
- **PR-11 (optional):** Cross-process save-lock hardening is now the main candidate follow-on safety PR outside D1-D8. Iteration 21 found no second hidden content defect family, but it did surface lock-continuation behavior that warrants a separate concurrency-focused change if the team wants stronger operational guarantees. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:20-29]

## 11. Verification Strategy
Use helper-level unit tests for D1, D2, D3b, and D8, because those defects are already localized to small owners and do not require the full CLI pipeline to reproduce. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

Use workflow-slice integration tests for D3a, D5, and D7, where the behavior spans multiple helpers but still does not need end-to-end CLI execution. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1299`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

Prefer sample-payload replay fixtures over full pipeline runs for D2, D3, D4, and D7. F1 and F6 are especially valuable fixture sources because they contain the malformed decision, trigger, and duplicate-history examples that matter most for regression coverage. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:43-48`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/memory/06-04-26_15-37__deep-research-on-graphify-external-repo-python.md:656-661`] [REFERENCE: iteration-008 and iteration-009]

Keep full `generate-context.js` runs as final confirmation only after the localized tests pass. [REFERENCE: iteration-001 and iteration-008]

### Gen-2/Gen-3 Verification Addenda

- **Fixture catalog:** Iteration 16 translated AC-1..AC-8 into eight unit-test-ready payload fixtures (F-AC1 through F-AC8), including the exact environmental seams needed for D5 lineage seeding and D7 git provenance. That means every planned functional PR now has a deterministic fixture instead of an ad hoc replay plan. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-341] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- **Ellipsis pinning:** AC-1 still needs an explicit punctuation decision because the current helper emits ASCII `...` while the spec text names the single-character ellipsis `…`. The implementation PR should settle that before snapshot fixtures are finalized. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:87-88]
- **Performance model:** Iteration 22 established that the narrowed PR-7 design stays in an acceptable save-time budget on representative local measurements: ~1.4/7.9/16.3 ms at 100/500/1000 sibling files with full reads, or ~1.0/6.0/12.2 ms with a 2 KB header reader. Those figures make PR-7 safe to ship with measurement hooks, while also justifying a small partial-header primitive if the folder population grows. [CITATION: NONE — local microbenchmark]

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

### Gen-3 Risk Addenda

- **Concurrent saves:** The biggest newly surfaced risk is not semantic corruption but lock-behavior under concurrent execution. The current workflow can proceed after stale-lock read failure, timeout, or unexpected `mkdir` error, so adopting PR-11 would be an operational hardening decision rather than a content-fix requirement. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415]
- **Migration safety:** Historical repair is asymmetrical. D8 and D4 are safe mechanical migration candidates, D3 is a likely safe sanitizer candidate, but D1/D2/D7 are unrecoverable from the saved markdown alone and D5 only remains safe under strict ambiguity controls. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:20-41]
- **Capture-mode boundary risk:** Capture mode shares D2/D3/D5/D8 but not the JSON-mode D7 bypass, so future fixes must avoid over-scoping from JSON-specific symptoms to capture-mode behavior that is currently correct. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md:22-34]

## 13. Refactor Opportunities
A single source of truth for importance tier would remove the D4 class entirely by deriving both frontmatter and metadata-block renderings from one resolved value rather than maintaining two independently mutable representations. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

A shared truncation helper should be used across `collect-session-data.ts` and the observation summary path so user-visible narrative truncation follows one consistent boundary policy. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`]

The `_source === 'file'` overload is doing too much. An explicit enrichment-mode flag or save-mode contract would be clearer than inferring provenance behavior, decision fallback behavior, and context enrichment behavior from the same coarse source marker. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`] [REFERENCE: iteration-009]

### Exact Dependency Map (iter 17)

1. **Land functional fixes before cross-cutting extractions.** Iteration 17 showed that the helper and `_source` surfaces touch far more callsites than any single defect patch, so D1/D2/D3/D4/D5/D7/D8 should be repaired at their current owners first. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
2. **Shared truncation helper after D1/D2 stabilization.** The reusable boundary-aware logic already exists, but the dense user-visible truncation cluster sits in `collect-session-data.ts` and `decision-extractor.ts`, so extraction is safest after the direct correctness patches land. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135,182-185,270-274,329-332,381-455]
3. **Importance-tier SSOT before reviewer broadening.** Only two real writers matter for D4, and `post-save-review.ts` is already the downstream detector. That makes writer unification the prerequisite and reviewer migration the trailing step. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-885,894-1064; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226,279-289]
4. **Replace `_source` overloading with `SaveMode` only after D7 behavior is correct.** `_source` currently carries enrichment eligibility, review heuristics, and persisted metadata semantics, which is why the enum extraction is valuable but riskier than the provenance-only D7 patch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-460,654-659; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361-388,475-482,836-847]
5. **Reviewer/guardrail expansion last.** Once SSOT and save-mode cleanup are in place, the reviewer can safely absorb the wider CHECK-D1..D8 contract without chasing unstable upstream seams. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226,279-289] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25]

## 14. Open Questions / Loose Ends
D6 remains the only meaningful loose end. Historical duplicates are visible in F1, but F7 is not a valid current reproducer, and the inspected write path already deduplicates or preserves rather than creating duplicates. A better reproducer or fixture is needed before any code patch is justified. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`] [REFERENCE: iteration-009]

No additional unresolved root-cause owners remain for D1, D2, D3, D4, D5, D7, or D8. The remaining uncertainty is strictly about whether D6 still exists on a live path or only in older artifacts. [REFERENCE: iteration-009]

### Answered Across Gen-2 / Gen-3

- **Q8 citation drift:** answered — the frozen D1-D5/D7 owner citations still land on the same source seams. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-39]
- **Q9 population scope:** answered — D4 and D8 are population-scale, D3 is widespread, D2 and D6 remain narrow. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]
- **Q10/Q11/Q12 implementation narrowing:** answered — D2 is a predicate-bound precedence fix, D5 gating should only trust `extended`/`continuation`-style signals, and D3 can ship with a narrow empirical filter set. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:35-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-56] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-44]
- **Q13/Q14/Q15/Q16/Q17:** answered — fixtures exist, safe refactor ordering is mapped, the D7 patch is tiny and isolated, reviewer upgrades are scoped, and the 9-PR rollout train is staged. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:117-120] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-149] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:120-167]
- **Q18/Q19/Q20/Q21/Q22:** answered — no second hidden content defect family surfaced, PR-7 latency is acceptable, historical migration is only partially safe, telemetry can stay guardrail-sized, and capture-mode parity is now explicitly bounded. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:20-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:23-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:20-41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:26-44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md:22-34]

### Remaining Loose Ends

- Whether to promote **PR-10** (safe-subset historical migration) from optional to required should be decided only after the live fixes land and the team confirms how much historical search quality matters relative to rewrite risk. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:42-54]
- Whether to promote **PR-11** (cross-process save lock) from latent-risk candidate to committed remediation depends on expected concurrency pressure in real workflows, not on the original seven-file defect packet alone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:41-44]
- PR-7 can ship without a partial-header primitive, but iteration 22 now makes the tradeoff explicit enough that the helper should be considered an architectural follow-on rather than an accidental later optimization. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:23-39]

## 15. Findings Registry

This registry replaces the compressed F1-F18 view from the prior canonical synthesis. Each numbered item below is sourced directly from the corresponding iteration file, with labels widened to cover the full cross-generation corpus rather than only the first synthesis pass.

### 15.1 Gen-1 Findings

#### Label Migration
The previous `F1-F18` labels referred only to the compressed Gen-1 digest. This expanded registry renumbers the full finding stream in generation order: `F*` for iterations 1-10, `G*` for iterations 11-20, and `H*` for iterations 21-25.

#### Iteration 001 — JSON-Mode Pipeline Architecture Map

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-001.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F1.** The compiled runtime entry is a thin bridge into the source workflow modules; it imports `../core/workflow`, `../loaders`, and `../extractors/collect-session-data` rather than containing a separate pipeline. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:52-57`]

- **F2.** JSON-mode is normalized before extraction: `parseStructuredModeArguments()` always stamps `_source: 'file'` onto structured payloads, which later makes the save eligible for the JSON post-save review path. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:379-385`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-222`]

- **F3.** File-mode and inline/stdin JSON share the same downstream workflow; the only difference is whether Step 1 receives `preloadedData` and calls `normalizeInputData(...)` or loads from disk through `loadCollectedDataFromLoader(...)`. [CITATION: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:431-436`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:615-647`]

- **F4.** JSON-mode skips the captured-session enrichment branch entirely because `isCapturedSessionMode` is false when `_source === 'file'`; that means spec-folder/git enrichment is not part of the structured-input defect surface. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

- **F5.** The extractor fan-out is explicitly parallel and consists of five concurrent branches: session-data assembly, conversations, decisions, diagrams, and workflow-flowchart generation. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1063`]

- **F6.** The lexical-decision fallback in `decision-extractor.ts` manufactures titles like `"observation decision 1"` and `"user decision 1"`, making that function an immediate suspect for defect D2’s generic placeholders. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:152-164`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:167-172`]

- **F7.** Trigger phrases are generated before rendering in the workflow, not in the post-save review or indexer; the workflow builds trigger source text from summary, decisions, file descriptions, and spec-folder tokens, filters them, and only then passes them into both the template and `indexMemory()`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1299`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1845-1852`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`]

- **F8.** Post-save quality review is advisory only in the current pipeline: it detects mismatches after the markdown file is already written, prints findings, and logs a score penalty hint, but it does not patch or block the saved file. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419`]

- **F9.** Semantic indexing is strictly post-write and policy-gated; duplicate skips, failed validation disposition, missing embeddings, or index-policy decisions can all prevent a saved file from entering the vector store even after the markdown exists on disk. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1825-1875`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:79-97`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148-181`]

- **F10.** The actual source layout differs from the prompt’s assumed `scripts/src/...` paths, so future iterations should inspect `scripts/memory`, `scripts/core`, `scripts/extractors`, and `scripts/renderers` as the canonical source tree for this runtime. [CITATION: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:52-57`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:24-27`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:21-22`]

#### Iteration 002 — D1 Root Cause — Truncated OVERVIEW

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-002.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F11.** `normalizeInputData()` preserves the raw JSON `sessionSummary`; it does not truncate that source field during the workflow merge path. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:617-637`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:668-745`]

- **F12.** `buildSessionSummaryObservation()` applies a separate 500-character narrative clamp with word-boundary trimming and ellipsis, affecting the `DETAILED CHANGES` feature entry rather than the `OVERVIEW` block. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`, `.opencode/skill/system-spec-kit/templates/context_template.md:380-385`]

- **F13.** The exact `OVERVIEW` defect owner is `collectSessionData()` at `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:876-877`, where `SUMMARY` is assigned with `data.sessionSummary.substring(0, 500)`. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`]

- **F14.** `context_template.md` renders the overview with a direct `{{SUMMARY}}` placeholder and adds no additional clipping logic. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:330-351`]

- **F15.** `populateTemplate()` and the renderer layer do not truncate; they pass through already-prepared values. [CITATION: `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:176-205`]

- **F16.** `generateImplementationSummary()` is not part of the overview truncation path; its only nearby truncation is the metadata-only `implSummary.task.substring(0, 100)` in workflow metadata. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:468-613`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1421-1427`]

#### Iteration 003 — D2 Root Cause — Generic Decision Placeholders

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-003.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F17.** The generic placeholder titles are emitted only by `buildLexicalDecisionObservations()`, not by the renderer or template layer. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-175`]

- **F18.** The lexical fallback is eligible only when both authoritative decision carriers are empty: `_manualDecisions` and decision-typed observations. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`]

- **F19.** The intended higher-priority JSON extraction path exists, but it is upstream in `normalizeInputData()`, not inside `extractDecisions()`. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752`]

- **F20.** `extractDecisions()` never reads raw `keyDecisions` or raw `decisions`; it depends entirely on normalized handoff fields. This is the design gap that lets lexical placeholders appear when normalization misses. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-388`]

- **F21.** The broken F1 file is consistent with the lexical fallback path and inconsistent with a successful `_manualDecisions` path, because the rendered titles are `observation decision 1` / `user decision 1` and the content collapses to generic `Chosen Approach` scaffolding. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-300`]

#### Iteration 004 — D3 Root Cause — Garbage Trigger Phrases

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F22.** The `trigger_phrases` path leak is owned by workflow, not the renderer: folder-derived tokens are appended after filtering in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1232-1295`]

- **F23.** The exact path-tokenizer responsible for `kit/026`, `optimization/001`, and `systems/004` is the workflow pair `specFolderName.replace(/^\d{1,3}-/, '').replace(/-/g, ' ')` plus `split(/\s+/)`, not a dedicated path parser elsewhere. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1226-1231`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1272`]

- **F24.** The shared tokenizer preserves slash-bearing tokens because its split regex does not include `/`, and it removes numeric-only tokens before n-gram counting. [CITATION: `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:116-129`]

- **F25.** The `Key Topics` garbage bigrams come from the topic extractor path, not the frontmatter trigger extractor path. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1198-1199`, `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:24-50`]

- **F26.** The fragment phrases are created because bigrams are counted after aggressive stopword filtering, which makes non-adjacent content words artificially adjacent in the filtered stream. [CITATION: `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:144-149`, `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:176-183`]

- **F27.** Existing validation is insufficient: `filterTriggerPhrases()` misses 3-5 letter generic singletons like `graph` and `and`, `ensureMinSemanticTopics()` does not quality-filter existing topics at all, and the indexer merge does not re-filter manual phrases before indexing. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:122-156`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:134-151`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:112-122`]

#### Iteration 005 — D4 Root Cause — Importance Tier Mismatch

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-005.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F28.** The original save writer for `importance_tier` is `collect-session-data.ts` feeding `IMPORTANCE_TIER` into `context_template.md`, and that single value is rendered into both locations on first write. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-900`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1024-1065`, `.opencode/skill/system-spec-kit/templates/context_template.md:1-6`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`]

- **F29.** The second independent tier writer is not `frontmatter-editor.ts`; it is the managed-frontmatter rewrite path in `frontmatter-migration.ts`. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:27-92`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:95-152`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1125`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1150-1183`]

- **F30.** The two paths diverge because they use different tier sources: payload/session-characteristic resolution during initial render versus existing frontmatter, body table extraction, or document-type defaults during frontmatter migration. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-900`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1006-1024`, `.opencode/skill/system-spec-kit/templates/context_template.md:129-130`]

- **F31.** For authoritative MCP parsing and DB persistence, frontmatter wins. The bottom metadata block is not consulted by `extractImportanceTier(...)`. [CITATION: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:629-666`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:215-219`]

- **F32.** For the script-side workflow indexer, neither rendered tier directly drives `vectorIndex.indexMemory(...)`; only `importanceWeight` is computed there. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:139-172`]

- **F33.** The post-save reviewer cannot repair D4 today because it only checks payload-vs-frontmatter mismatch and returns advisory issues instead of mutating the file, while ignoring frontmatter-vs-metadata-block drift entirely. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:8-9`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:77-107`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`]

#### Iteration 006 — D5 Root Cause - Missing Causal `supersedes` Links

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F34.** The script pipeline has no auto-supersedes builder; it only passes through `collectedData.causal_links` into the template. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1308-1372`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`]

- **F35.** JSON-mode normalization does not synthesize causal lineage, though caller-provided `causal_links` can survive the normalize-and-merge flow. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:71-130`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-647`]

- **F36.** `generate-context.js` does not query the spec folder `memory/` directory or existing memory files before write, so it never discovers predecessor runs on its own. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-740`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:958-1063`]

- **F37.** The folder `metadata.json` files are not a usable predecessor index; they track write quality and embedding state, not run-to-run lineage. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1406-1420`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/metadata.json:221-235`]

- **F38.** The real causal-link builder/extractor is MCP-side: `memory-parser.ts` extracts `causal_links`, and `processCausalLinks()` inserts graph edges after save. [CITATION: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:269-289`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:675-715`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:341-405`]

- **F39.** Available recovery surfaces already exist as tools: `memory_search` can find candidate predecessors and `memory_causal_link` can create explicit `supersedes` edges, but the script path never invokes them. [CITATION: `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:61-100`, `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:24-37`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639-647`]

- **F40.** Q5 is therefore resolved as a missing orchestration step: for auto-supersedes to work, JSON-mode needs a new pre-render predecessor-discovery phase or a post-write follow-up that searches the current spec folder, resolves the previous run, and writes/inserts the `supersedes` relationship explicitly. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1308-1372`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1013-1028`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:341-405`]

#### Iteration 007 — D7 Root Cause - Empty Git Provenance

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-007.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F41.** D7 is caused by the JSON-mode `_source === 'file'` gate, which makes `isCapturedSessionMode` false and skips the only Step 3.5 branch that performs spec-folder and git enrichment. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890`]

- **F42.** The only code path that calls `extractGitContext()` is `enrichCapturedSessionData()`, and that helper also short-circuits immediately for file-backed JSON input. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-471`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:556-560`]

- **F43.** JSON-mode therefore renders empty git refs by default: `collectSessionData()` maps missing git fields to `null` and `"unavailable"`, and the template emits those metadata keys unconditionally. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1085-1089`, `.opencode/skill/system-spec-kit/templates/context_template.md:749-753`]

- **F44.** D6 is not explained by the merge site in `workflow.ts`; the merged trigger list and the later folder-token additions both have explicit lowercase dedup guards. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1272`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`]

- **F45.** D8 is authored directly in `context_template.md`, where `ANCHOR:summary` and `id="overview"` coexist in the same overview section block. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:177-177`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

#### Iteration 008 — Remediation Matrix Synthesis

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-008.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F46.** D1 should be fixed in the extractor, not the renderer, because the hard overview clamp is introduced in `collect-session-data.ts` before template rendering. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

- **F47.** The best D1 remediation reference already exists in-repo: `buildSessionSummaryObservation()` trims on a word boundary and adds ellipsis instead of cutting mid-token. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`]

- **F48.** D2 requires extractor hardening because `extractDecisions()` never reads raw `keyDecisions`, while `conversation-extractor.ts` already does. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:87-107`]

- **F49.** D3 cannot be solved with one patch: frontmatter trigger pollution and `Key Topics` fragment bigrams have different owners. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md:20-25`]

- **F50.** D4 is a multi-writer drift bug. Initial render is consistent, but later frontmatter migration can rewrite only the top tier. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:1-6`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-757`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

- **F51.** D5 needs new orchestration rather than parser changes because the current causal context builder is only a pass-through reader. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:19-25`]

- **F52.** D6 is still unresolved at the implementation layer; the inspected workflow merge already deduplicates case-insensitively. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1233-1298`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-007.md:15-19`]

- **F53.** D7 should be fixed by separating provenance enrichment from capture-only context enrichment, not by reusing the full captured-session merge behavior in JSON mode. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923`]

- **F54.** D8 is a template-source cleanup with no extractor dependency because the mismatch already exists in `context_template.md`. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

- **F55.** The highest-value verification approach is helper-level regression coverage plus sample-payload replay, because each defect owner is already localized and does not require the full CLI pipeline to reproduce. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-001.md:43-70`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:74-80`]

#### Iteration 009 — D6 Verification + Skeptical Pass

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F56.** F7 is not a valid D6 reproducer in the current packet: its saved `trigger_phrases` array is unique, so the specific duplicate claim against that file should be treated as ruled out. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`]

- **F57.** D6 is still historically real because F1 contains literal duplicate trigger phrases, but the currently inspected workflow/indexer/render path already deduplicates or preserves rather than reintroducing duplicates. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:43-48`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1298`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-125`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:95-105`]

- **F58.** The D2 fix should be narrowed to raw-decision precedence hardening, because disabling lexical fallback for all JSON-mode saves would create an unnecessary behavior break for decision-less or malformed JSON payloads. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-107`]

- **F59.** The D5 fix should link only an immediate, unambiguous predecessor; folder-recency-only discovery is too risky once a folder contains 3+ runs or mixed histories. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_16-34__5-iteration-deep-research-session-investigating.md:2-3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_17-58__continuation-deep-research-run-for-002-codesight.md:2-3`]

- **F60.** The main cross-defect hazard is not D7 -> D5 but over-broad reuse of captured-session enrichment, which would reintroduce trigger/decision contamination while solving provenance. D3 should therefore remove unconditional folder-token append but keep the guarded low-count fallback. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-518`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:108-131`]

#### Iteration 010 — Final Synthesis Pass

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-010.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **F61.** All eight defect classes now have a final disposition, with concrete root-cause owners for D1-D5 and D7-D8 and a historical/stale-sample disposition for D6. [REFERENCE: research/research.md]

- **F62.** Iteration-9 narrowings are carried forward into the final matrix: D2 precedence-only, D5 immediate predecessor with continuation gating, D7 provenance-only, and D3 retaining `ensureMinTriggerPhrases()`. [REFERENCE: iteration-009, research/research.md]

- **F63.** Priority groups P0/P1/P2/P3 are ready for downstream `/spec_kit:plan` decomposition. [REFERENCE: research/research.md]

- **F64.** D6 is reclassified as a historical or stale-sample issue for now because F7 is ruled out while F1 still shows duplicate history. [CITATION: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/06-04-26_17-13__deep-research-synthesis-on-the-claudest-external.md:615-653`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-18`] [REFERENCE: iteration-009]

- **F65.** Cross-cutting refactor opportunities are now explicit: importance-tier SSOT, a shared truncation helper, and an explicit enrichment-mode flag instead of `_source === 'file'` overloading. [REFERENCE: research/research.md]

### 15.2 Gen-2 Findings

#### Iteration 011 — Citation Drift Verification (Q8)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G1.** All ten legacy Q8 target citations still resolve to the same six TypeScript files and the same cited line spans in the current source tree; I found no file move, helper rename, or line-number drift in the frozen D1-D5/D7 anchors. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]

- **G2.** D2’s “missing raw decision read” citation is still valid at the exact function entry: `extractDecisions()` begins by reading `_manualDecisions`, and the cited entry span still shows no direct `keyDecisions` or `decisions` intake before later fallback logic executes. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185]

- **G3.** D2’s lexical-fallback citation is also still exact: the `decisionObservations.length === 0 && processedManualDecisions.length === 0` branch still calls `buildLexicalDecisionObservations(collectedData)` and then prefers those observations when none others exist. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388]

- **G4.** D3 shows additive evolution without citation drift: the workflow block now includes a `FOLDER_STOPWORDS` set inside the same cited window, but folder-derived tokens are still appended after `filterTriggerPhrases()`, so the original owner citation remains valid. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1298]

- **G5.** D4’s second-writer citation remains precise because the same `inferImportanceTier(...)` plus `serializeFrontmatter(...)` path still recomputes and serializes managed frontmatter keys in one place; the owner did not move to another helper. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183]

- **G6.** D5 and D7 both remain orchestration omissions at the same seams: the workflow still injects `causalLinks` via `buildCausalLinksContext(collectedData)` without predecessor discovery, and JSON-mode still bypasses Step 3.5 because git/spec enrichment remains capture-mode-only. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]

#### Iteration 012 — Repo-wide JSON-mode Memory File Survey (Q9)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G7.** The broader JSON-mode population is dominated by D8 and D4, not by the full Gen-1 eight-defect bundle: D8 was observed in all 82 JSON-mode candidates and D4 in 81/82, which is far more pervasive than the original seven-file sample suggested for D4. [CITATION: NONE] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:31-40]

- **G8.** D3 clearly generalizes beyond the seven-file sample and is spread across unrelated product lines and spec trees, including `00--anobel.com`, `skilled-agent-orchestration`, `022-hybrid-rag-fusion`, `023-hybrid-rag-fusion-refinement`, `024-compact-code-graph`, and `026-graph-and-context-optimization`. Representative examples appear in the anobel button planning memory, coco integration, hybrid-rag epic memories, and compact-code-graph remediation memories. [SOURCE: .opencode/specs/00--anobel.com/036-notification-toast-button/memory/04-04-26_15-09__planning-session-for-cms-driven-button-in.md:4-20] [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:3-22] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/20-03-26_16-36__implemented-full-hybrid-rag-fusion-pipeline.md:3-30] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:4-34]

- **G9.** D2 remains narrow and localized to the original `001-claude-optimization-settings` lineage: only two files in the entire 82-file JSON-mode population reproduced the `observation decision N` placeholder symptom. That population result supports the Gen-1 recommendation to keep the D2 fix precedence-based rather than broad or mode-wide. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_12-05__deep-research-run-8-iterations-via-cli-copilot.md:229-232] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:232-235] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:69-70]

- **G10.** D6 also stayed rare at population scale: only one file in the entire JSON-mode corpus reproduced duplicate trigger phrases, and it is the same extended-memory lineage already flagged in Gen-1. That strengthens the case for treating D6 as fixture-first and low-priority rather than part of the broad remediation core. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-53] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:42-42]

- **G11.** The repo-wide static sweep did not re-detect D1, D5, or D7 as broad corpus defects. Those zeroes should be treated as conservative lower-bound observations rather than disproof of the Gen-1 mappings, because Gen-1 established D1 and D7 in the original seven-file sample while this population pass intentionally used only file-observable heuristics and no predecessor/source-code reasoning. [CITATION: NONE] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:31-46]

#### Iteration 013 — D2 Call-graph and Precedence Gate Design (Q10)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G12.** `runWorkflow()` is the entry point that normalizes preloaded JSON first and only then dispatches `extractDecisions(collectedData)` inside the extractor Promise group. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-637] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1031]

- **G13.** The raw `keyDecisions` list is handled upstream by `normalizeInputData()`, not by `decision-extractor.ts`: the normalizer copies it into `_manualDecisions` and, when needed, synthesizes decision observations via `transformKeyDecision()`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:200-260]

- **G14.** Inside `decision-extractor.ts`, the raw path intersects the fallback path only at the `extractDecisions()` boundary where `_manualDecisions` becomes `manualDecisions`; there is no direct `keyDecisions` reader in this file. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185]

- **G15.** The placeholder strings `observation decision N` and `user decision N` are emitted only by `buildLexicalDecisionObservations()`, which mines cue-bearing sentences from observations and user prompts. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176]

- **G16.** The exact lexical admission gate is the ternary predicate `decisionObservations.length === 0 && processedManualDecisions.length === 0`; that is the branch condition a precedence-only D2 fix must tighten. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384]

- **G17.** This is not a merge/clobber bug: when manual decisions exist, `extractDecisions()` explicitly clears `decisionObservations`, skips lexical mining, and later concatenates processed manual decisions into the final array. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]

- **G18.** `conversation-extractor.ts` still reads raw `keyDecisions` directly when building synthetic messages, which confirms the raw-field asymmetry is specific to decision extraction rather than a repo-wide absence of raw JSON handling. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-107]

- **G19.** The correct D2 patch boundary is therefore inside `extractDecisions()`: either rehydrate manual decisions from raw arrays there when normalization missed, or at minimum add `rawKeyDecisions.length === 0` to the lexical predicate so authoritative raw arrays block placeholder generation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584]

#### Iteration 014 — D5 Continuation-signal Corpus (Q11)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G20.** The cleanest title-side continuation phrases are rare but precise: only three corpus titles use `extended` or `continuation`, and all three are the exact deep-research follow-on artifacts already implicated in the D5 sample set. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/memory/06-04-26_13-49__extended-deep-research-phase-003-contextador-from.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_17-58__continuation-deep-research-run-for-002-codesight.md:2-2]

- **G21.** `phase N` is the dominant raw match family, but it is far too noisy for D5 gating because most hits are phase labels or remediation milestones rather than continuation saves. [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/memory/31-03-26_09-02__executed-phase-008-compliance-audit-across-186.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/memory/01-04-26_11-03__completed-phase-3-deep-review-remediation-6-of-8.md:2-2]

- **G22.** `vN` is also a poor continuation proxy: the observed hits are version markers (`v2`) or an unrelated `v8` contamination reference, not lineage between runs. [SOURCE: .opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/memory/24-03-26_18-33__deep-research-v2-improving-review-logic-in-sk.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/001-initial-enrichment/memory/20-03-26_09-34__deep-research-completed-21-findings-across-v8.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:2-2]

- **G23.** The corpus validates iteration-009's narrowing: D5 should key on high-precision continuation language plus immediate-predecessor semantics, not on folder recency plus generic numerals. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:31-33] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:43-43]

- **G24.** Literal `iter NN` never appeared in the extracted titles, but numeral-led iteration carry-forward does appear, so any production gate should broaden beyond the exact `iteration 5` surface form or it will miss known continuation shapes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_16-34__5-iteration-deep-research-session-investigating.md:2-3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:2-2]

- **G25.** The known continuation pairs still have empty markdown-side lineage, so D5 remains a pre-render discovery problem rather than a downstream causal-graph insertion bug. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:9-16] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:20-30]

- **G26.** The final D5 matrix in `research.md` is now empirically grounded: excluding `phase N` and `vN` from the gate is not stylistic caution, but a direct response to corpus-level false-positive pressure. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:72-72] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:209-209] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/memory/31-03-26_09-02__executed-phase-008-compliance-audit-across-186.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:2-2]

#### Iteration 015 — D3 Empirical Filter-list Build (Q12)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G27.** Path-like fragments are the largest removable junk class in the live corpus: 174 of 2,282 trigger occurrences (7.63%). The surviving examples still look exactly like D3's Gen-1 leak shape, including slash-bearing tokens such as `"skills/022"` and `"skills/037"` inside saved frontmatter arrays [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:27-29].

- **G28.** Standalone English stopwords still appear literally in production memory files. `"and"` coexists next to path fragments and the valid short name `"mcp"` in the same trigger list, so a standalone stopword block is justified and low-risk [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20].

- **G29.** Stopword-collapsed bigram junk is present corpus-wide, not just in the original D3 samples: `"with phases"`, `"with research"`, and `"session for"` are all currently stored trigger phrases [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:3-5] [SOURCE: .opencode/specs/00--anobel.com/036-notification-toast-button/memory/04-04-26_15-09__planning-session-for-cms-driven-button-in.md:6-9]. This matches iteration 4's root-cause model that D3 includes synthetic word-pair artifacts, not only path leaks [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md:20-29].

- **G30.** Legitimate short product names are rare but real. Only one current-corpus short token matched the proposed allowlist (`"mcp"`, 2 occurrences), which means the keep-list can stay narrow without introducing false positives for short names [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:18-20].

- **G31.** Prefix filtering needs to be narrow and shape-based, not word-based. Numbered/ID-prefixed phrases like `"phase 7 cocoindex"` and `"f21 arithmetic inconsistency"` are clear junk candidates, but a blanket `^phase\b` rule would also overreach into the standalone domain noun `"phase"` [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:4-6] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:12-17] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:30-32].

- **G32.** The tuned filter removes 230 trigger occurrences (10.08% of the corpus) while preserving all observed legitimate short names. That is consistent with Gen-1's narrowed D3 direction: clean unconditional junk first, but do not broaden the rule set enough to break fallback or valid short tokens [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:69-70] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:38-44].

- **G33.** The main false-negative residue is generic singletons, not path or stopword artifacts. `"graph"` and `"research"` survive because they are not path-shaped, not stopwords, and not ID-prefixed; they likely need either a separate frequency-based singleton suppressor or a reviewer assertion rather than more regex [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/memory/01-04-26_07-21__prepared-the-external-graph-memory-research-phase.md:36-40].

#### Iteration 016 — AC-1..AC-8 Fixture Design (Q13)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G34.** The only hard requirement for structured JSON mode is a resolvable target spec folder; the parser accepts any JSON object and then injects `_source: "file"`. That means AC fixtures can stay tiny and do not need transcript-shaped noise to enter the real workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-341] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:369-385]

- **G35.** D2 fixtures must include both raw `keyDecisions` and decision-like `userPrompts`, otherwise pre-fix behavior may yield an empty DECISIONS section instead of the bad placeholder branch. The extractor currently ignores raw `keyDecisions` and only lexical-mines when both manual and observation decisions are absent. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-384]

- **G36.** D3 is the easiest defect to isolate with almost no payload because the folder-token leak happens after trigger filtering; the spec folder path itself is already enough to reproduce the issue. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298]

- **G37.** D5 and D7 are not pure-payload bugs: one needs seeded predecessor state and the other needs a git seam. The JSON fixture should therefore stay minimal while the harness supplies the missing environmental preconditions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

- **G38.** AC-1’s suffix expectation is still slightly underspecified: the existing word-boundary helper uses ASCII `...`, while the spec text uses the single-character ellipsis `…`. The implementation PR should pin one canonical suffix so fixture assertions do not encode punctuation ambiguity. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:87-88]

#### Iteration 017 — Refactor Dependency Map for Shared Helpers (Q14)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G39.** The repo already contains one boundary-aware narrative truncator (`buildSessionSummaryObservation()`), but D1 still bypasses it with a raw `substring(0, 500)` in `collect-session-data.ts`; the shared helper can therefore start as an extraction, not a brand-new design. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]

- **G40.** The decision path is the densest truncation cluster: five user-visible truncation callsites live under `extractDecisions()` and its lexical helper, which makes D2/D1 truncation work mostly a two-file refactor (`decision-extractor.ts` + `collect-session-data.ts`) plus reuse in `input-normalizer.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135,182-185,270-274,329-332,381-455]

- **G41.** D4 drift is a true multi-writer problem, but only two writers matter: initial render and managed-frontmatter migration. The rest of the `importanceTier` surface is propagation (`input-normalizer.ts`, `workflow.ts`) or detection (`post-save-review.ts`). [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-885,894-1064; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]

- **G42.** `_source` is currently overloaded across three concerns at once: enrichment eligibility, JSON-mode completion heuristics, and source-session metadata persistence. That is why a `SaveMode` enum is safer than another `_source === 'file'` patch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-460,654-659; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361-388,475-482,836-847]

- **G43.** `post-save-review.ts` is already the guardrail consumer for both D4 mismatch detection and `_source`-based captured-session checks, so it should migrate last after the SSOT and `SaveMode` extractions land. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226,279-289]

- **G44.** The target surface is smaller than a raw grep suggests because many `slice(0, N)` hits are structural caps or protocol parsing, not user-visible text truncation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:131-133; .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:68; .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:531]

- **G45.** Diagnostic truncations in reviewer/help text (`post-save-review.ts`) should stay out of the shared helper unless the team explicitly widens scope from persisted artifact text to human-facing warnings. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:240,340]

#### Iteration 018 — D7 Provenance-only <=10-line Patch (Q15)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G46.** JSON-mode inputs skip Step 3.5 entirely because `isCapturedSessionMode` is false when `_source === 'file'`, so the only existing git-enrichment call site never runs. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]

- **G47.** `enrichCapturedSessionData()` is the wrong fix surface for JSON mode because it merges far more than provenance, directly violating the iteration-9 narrowing. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]

- **G48.** `extractGitContext()` already centralizes the safe provenance contract needed by JSON mode: async extraction, detached-HEAD signaling, and empty-result degradation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]

- **G49.** Detached HEAD is represented as `headRef = 'HEAD'`, `commitRef = <short SHA>`, `isDetachedHead = true`; the patch preserves that exact contract instead of guessing a branch name. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:329-343]

- **G50.** Shallow history does not block this fix because provenance is derived from bounded `rev-list`, `rev-parse`, and `show/diff` calls that already degrade safely. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:330-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:369-373]

- **G51.** A six-line JSON-mode insertion after Step 3.5 is sufficient; no new helper, no template change, and no post-save contract change are required for Q15 itself. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]

#### Iteration 019 — Post-save Reviewer Contract Upgrade (Q16)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G52.** The live reviewer only implements six checks, and all of them are payload/frontmatter/content-quality comparisons; none inspect the rendered markdown for D1/D2/D5/D8-style structural regressions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343]

- **G53.** D4 is already a documented reviewer blind spot: the current code compares payload tier to frontmatter tier, but never frontmatter tier to the bottom metadata block. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-005.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-291]

- **G54.** The D3 reviewer-safe filter should reuse iteration 15's empirical regex set and allowlist instead of inventing a broader semantic blocklist, because the tuned corpus simulation removed 10.08% of trigger occurrences with zero observed false positives. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-44]

- **G55.** D5 title gating must exclude `phase N` and `vN`; iteration 14 showed those are the dominant noisy matches, while `extended` and `continuation` are the high-precision continuation signals. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:22-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-56]

- **G56.** D6's active producer is still unresolved, which makes a cheap duplicate-trigger assertion especially valuable as a guardrail even before the true owner is isolated. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:73-73]

- **G57.** D7 cannot safely depend on reviewer-time git probing if the contract must stay deterministic; the save pipeline needs to pass a payload-side `provenanceExpected`/`gitRepoAvailable` signal into `post-save-review.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:74-74]

#### Iteration 020 — PR Breakdown + Rollout Sequence (Q17)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **G58.** The original D1/D2/D3/D4/D5/D7 owner lines are still live, so the PR plan can cite concrete file spans without re-investigating ownership. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35]

- **G59.** D4 and D8 are population-scale JSON-mode defects, not just anomalies in the original seven-file sample, which justifies their placement before the narrower D5/D6 lane. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]

- **G60.** D2 is a predicate/precedence problem inside `extractDecisions()`, so it should ship as a tight branch fix with degraded-payload regression coverage rather than a mode-wide rewrite. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:44-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:65-73]

- **G61.** D5 should only gate on `extended` / `continuation`-style continuation signals plus immediate-predecessor semantics; `phase N` and `vN` stay excluded because the corpus shows they are noisy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]

- **G62.** D3 can remove a measurable junk slice of the live trigger corpus with narrow filters and no observed false positives, so it deserves its own PR rather than being hidden inside generic cleanup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:40-55]

- **G63.** AC fixtures already exist for every planned production PR in this train, which means rollout can be validated with small, deterministic payloads instead of fresh ad hoc test strategy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-264]

- **G64.** The safe refactor ordering is now explicit: functional fixes first, then helper extraction / save-mode cleanup, because the helper and `_source` surfaces span many more callsites than any single defect fix. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]

- **G65.** D7 is independently shippable because iteration 18 reduced it to a small workflow-only patch that copies provenance fields without invoking full captured-session enrichment. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78]

- **G66.** Reviewer guardrails belong last in the train because both the spec and iteration 19 place CHECK-D1..D8 after the functional fixes, especially D4, and expect new HIGH detections to block continuation only once the repaired contract exists. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]

- **G67.** D6 should stay deferred from the production rollout because Gen-1 still treats it as an unresolved live-owner question with test instrumentation only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:135-144] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:221-224]

### 15.3 Gen-3 Findings

#### Iteration 021 — Latent Failure Mode Audit (Q18)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **H1.** The only non-overlapping latent failure mode I found is operational, not content-shaping: the workflow can continue without cross-process locking after stale-lock read failures, unexpected `mkdir` errors, or timeout. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415]

- **H2.** The captured-session enrichment catches are not a current JSON-mode bug source because file-backed JSON exits that function immediately on `_source === 'file'`; they stay relevant only as a future D7 regression boundary if PR-4 accidentally reuses the captured branch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

- **H3.** `decision-extractor.ts` still has exactly one live placeholder-producing fallthrough, and it is the known D2 lexical branch guarded by `decisionObservations.length === 0 && processedManualDecisions.length === 0`. I did not find a second hidden placeholder path. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-388]

- **H4.** `input-normalizer.ts` already promotes `keyDecisions` into both `_manualDecisions` and synthesized decision observations on fast and slow paths, so the current tree does not hide a second "raw decisions were never propagated" defect behind empty defaults. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-687]

- **H5.** `semantic-signal-extractor.ts` contains a quality-degrading fallback that can bypass tech-stopword filtering when phrase count is too low, but the symptom is still the already-known D3 class (low-quality phrases), not a new defect family. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:243-255]

- **H6.** The null-input returns in `extractConversations()` and `extractDecisions()` are deliberate anti-corruption guards: they now emit empty packets instead of the older synthetic/simulated data paths. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-148] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-190]

- **H7.** Git-command failures are intentionally collapsed into an explicit `repositoryState: 'unavailable'` shape rather than silently fabricating provenance; combined with the current JSON-mode enrichment bypass, that means no second hidden D7 owner surfaced in this pass. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:99-104] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459]

#### Iteration 022 — PR-7 Performance Impact Model (Q19)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **H8.** PR-7's only valid insertion point is immediately before `buildCausalLinksContext()` in `workflow.ts`, because the current causal builder is a pass-through reader and does no predecessor discovery on its own. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]

- **H9.** The rollout plan already assumes PR-7 will be isolated to `workflow.ts`, `memory-metadata.ts`, and a new helper file, plus dedicated 3+ sibling lineage fixtures; that keeps the performance surface narrow and measurable. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:123-134] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:326-330]

- **H10.** Existing script/MCP frontmatter readers all operate on full in-memory content; I found no reusable partial-header reader in the current path. Even the one "head-only" check in `spec-doc-health.ts` still does `readFileSync(...).slice(0, 500)`, i.e. full read first, slice second. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:50-82] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:224-233] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:187-233] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts:150-152]

- **H11.** Existing directory-scan patterns are already simple `fs.readdirSync(..., { withFileTypes: true })` passes, so the natural PR-7 implementation is linear and cheap at the folder-walk layer. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:550-568]

- **H12.** The continuation gate is selective enough to be an effective early-exit filter: iteration 14 found continuation-style hits in only 13/140 titles, and only `extended` / `continuation` were clean enough to keep. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:16-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]

- **H13.** On a local macOS SSD microbenchmark using representative JSON-mode memory sizes, the added sibling scan is ~1.4 ms at 100 files, ~7.9 ms at 500 files, and ~16.3 ms at 1000 files with full-file reads; a 2 KB header reader cuts those totals to ~1.0 ms, ~6.0 ms, and ~12.2 ms respectively. [CITATION: NONE — local microbenchmark]

- **H14.** There is no inherent `N²` cliff in the narrowed PR-7 design from iterations 6/14/20; the only realistic cliffs come from implementation drift (rescans, pairwise candidate ranking, or unnecessarily heavy per-file parsers). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:19-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:120-134]

#### Iteration 023 — Migration Strategy for Pre-fix Broken Files (Q20)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **H15.** The migration target is materially larger than the original non-goal: 82 JSON-mode candidates across 135 memory files and 49 spec folders, so “leave history alone” is now a corpus-level decision rather than a seven-file cleanup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:61-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:47-128]

- **H16.** D8 and D4 dominate the population (82/82 and 81/82), which makes them strong candidates for mechanical migration rather than manual follow-up. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]

- **H17.** D3 is also broad and visibly mechanical: representative broken files carry path-fragment trigger phrases such as `kit/024`, `compact`, `code`, and `graph`, so a sanitizer-style cleanup is realistic. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:144-145] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:4-34]

- **H18.** D1 and D2 are not safely auto-healable from the file alone: the overview text is already cut mid-sentence and the decision titles degraded to `observation decision 1` / `user decision 1`, meaning the missing human-authored content is gone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357]

- **H19.** D7 provenance is also unrecoverable mechanically: the broken files store blank git provenance today, and writing current repo state back into historical memories would fabricate rather than restore provenance. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]

- **H20.** D5 can be backfilled only under strict ambiguity controls because the current recommendation already limits auto-supersedes to the immediate, unambiguous predecessor. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75]

- **H21.** A one-shot migration script matches existing repository practice better than an ad hoc manual sweep: there is already a frontmatter backfill CLI with dry-run/apply/report semantics and a separate bulk migration script with conflict-skipping and rewrite accounting. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:99-120] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:44-64] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:194-209]

#### Iteration 024 — Observability Hooks for Post-fix Pipeline (Q21)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **H22.** The live save boundary already has a precise injection point: Step 10.5 runs `reviewPostSaveQuality()` after file write, prints the review, and computes a score penalty, so telemetry can attach there without changing upstream extraction semantics. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797]

- **H23.** The current reviewer is still output-only from an operator perspective: it returns structured issues in memory, but its shipped surface is stdout text plus JSON print, not a metric or alert channel. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-230] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419]

- **H24.** A reusable structured logging primitive already exists and writes JSON to stderr, which is the right substrate for minimal save telemetry because it preserves stdout for CLI/data output. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:8-10] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48]

- **H25.** The scripts layer already emits low-cardinality operational events such as `contamination_audit` and `observation_truncation_applied`, so adding `memory_save_*` events is consistent with current practice rather than a new observability pattern. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:850-865] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:800-811]

- **H26.** PR-9 is intentionally scoped as the post-save reviewer upgrade at the end of the PR train, which means the telemetry set should stay guardrail-sized and defect-oriented rather than introducing a broad tracing platform in the same change. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:320-330]

- **H27.** Iteration 19 already gave a severity map for the checks: D1/D2/D4/D7 are HIGH and D3/D5/D6/D8 are MEDIUM, which naturally converts into page-vs-warn alert tiers for the new metrics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-149]

#### Iteration 025 — Cross-Runtime Capture-mode Parity Audit (Q22)

**Source of truth:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md`
**Registry scope:** numbered findings only; see the expanded appendix block for approach notes, ruled-out items, and new questions where applicable.

- **H28.** Native OpenCode capture payloads are structurally different from JSON-mode inputs: `transformOpencodeCapture()` emits observations/prompts/files but no `sessionSummary`, which is why the D1 truncation owner is not naturally exercised in capture mode. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1425-1456] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]

- **H29.** Capture mode still shares D2 because its normalized observations are not `decision` observations, and the lexical fallback remains reachable whenever Step 3.5 does not inject manual decisions from spec context. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1317-1355] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:508-514] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-388]

- **H30.** D3 is mode-agnostic because capture mode rejoins the same trigger-phrase builder, including the post-filter folder-token append that polluted JSON-mode files. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1298] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295]

- **H31.** D5 is equally shared because neither mode performs predecessor discovery before `buildCausalLinksContext()`; both only render caller-supplied lineage arrays. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1309] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]

- **H32.** Capture mode is the **correct** side of D7: it is the only path that actually executes spec/git enrichment and propagates git provenance fields into the payload. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]

- **H33.** D8 remains fully shared because both save modes ultimately render the same template with the same `overview`/`summary` anchor mismatch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1372] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:172-183] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:330-352]

- **H34.** D4 should not be used as evidence that the live capture branch is broken the same way as JSON mode; the earlier packet localized that bug to the managed-frontmatter migration helper, while the audited capture path renders directly and skips the JSON-only review hook. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:55-55] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1798]

## 16. Convergence Report
- Iterations: 10
- Stop reason: max_iterations + all_questions_answered (Q1-Q7)
- New-info ratio at iter 9: ~0.29 (dropping below 0.30)
- Questions resolved: 7 of 7
- Outstanding: D6 reproducer (historical)

## 17. Next Steps
Run `/spec_kit:plan` against this phase and convert the final remediation matrix into implementation work grouped by P0, P1, P2, and P3. P0 can likely be shipped as a tight low-risk patch set. P1 should stay scoped to consistency and provenance. P2 needs fixture-led regression coverage before code edits. P3 should remain investigation-first, especially for D6. [REFERENCE: iteration-008 and iteration-009]

If the team wants a follow-on audit, use F14-F18 as the highest-value validation set: re-check D6 with a trustworthy reproducer, then confirm the final D2/D5/D7 narrowings remain intact during implementation planning. [REFERENCE: iteration-009]

---

# APPENDIX B — GENERATION 2 ADDENDUM (Iterations 11-20)

> **Status:** Gen-2 complete · 10 iterations (11-20) via `cli-copilot gpt-5.4 reasoning_effort=high` · waves of 2 · reopened 2026-04-07 via `completed-continue` lifecycle · Gen-1 synthesis immutably snapshotted at `research/archive/research-v1-iter010-snapshot.md`.

## B.1 Why Gen 2
Gen 1 closed Q1-Q7 and produced the D1-D8 remediation matrix, but the spec needed three additional evidence classes before it could land safely: (a) **drift verification** that the frozen file:line anchors still point at the live owners, (b) **population-scale evidence** that the 7-file F1-F7 sample generalizes, and (c) **concrete implementation artifacts** — call graphs, phrase corpora, blocklists, fixtures, ≤10-line diffs, and a staged PR plan — so that a developer can open PRs directly from this document. [REFERENCE: deep-research-strategy.md §14]

## B.2 Gen-2 Iteration Map

| Iter | Wave | Question | Focus | Size | Findings | newInfoRatio |
|------|------|----------|-------|-----:|---------:|-------------:|
| 11 | W1 | Q8 — citation drift | verification | 8.6KB | 6 | 0.21 |
| 12 | W1 | Q9 — repo-wide survey | survey | 66KB | 5 | 0.68 |
| 13 | W2 | Q10 — D2 call graph | D2-design | 14.6KB | 8 | 0.36 |
| 14 | W2 | Q11 — D5 continuation corpus | D5-design | 15KB | 7 | 0.43 |
| 15 | W3 | Q12 — D3 empirical blocklist | D3-design | 10.7KB | 7 | 0.42 |
| 16 | W3 | Q13 — AC-1..AC-8 fixtures | testing | 23.7KB | 5 | 0.37 |
| 17 | W4 | Q14 — refactor dependency map | refactor-map | 14.4KB | 7 | 0.39 |
| 18 | W4 | Q15 — D7 ≤10-line patch | D7-design | 13KB | 6 | 0.31 |
| 19 | W5 | Q16 — post-save reviewer contract | guardrails | 21.3KB | 6 | 0.34 |
| 20 | W5 | Q17 — PR breakdown + rollout | rollout | 38.6KB | 10 | 0.18 |

Total Gen-2 evidence: **10 iterations · 67 findings · ~240KB of iteration files**.

## B.3 Per-Iteration Findings (Gen-2)

### B.3.0 Quick Index

- **G1 (iter 11):** Zero citation drift — all 10 frozen D1/D2/D3/D4/D5/D7 anchors still land on the same TypeScript owners and line spans in the current tree. [REFERENCE: iteration-011.md]
- **G2 (iter 12):** Population-scale confirmation — **82 of 135** memory files match JSON-mode heuristics; D4 and D8 are corpus-wide, not sample-local; D3 is prevalent enough to deserve its own PR. [REFERENCE: iteration-012.md]
- **G3 (iter 13):** D2 precedence gate is the predicate `decisionObservations.length === 0 && processedManualDecisions.length === 0` inside `extractDecisions()`; fix is a tight branch, not a rewrite. [REFERENCE: iteration-013.md]
- **G4 (iter 14):** D5 continuation-signal corpus: only `extended` and `continuation` are clean enough to gate auto-supersedes; `phase N` and `vN` are too noisy and must be excluded. [REFERENCE: iteration-014.md]
- **G5 (iter 15):** D3 empirical blocklist removes ~10% of the live trigger-phrase corpus with **zero observed false positives** against legitimate short product names. [REFERENCE: iteration-015.md]
- **G6 (iter 16):** AC-1..AC-8 fixtures (F-AC1..F-AC8) are ready as minimal JSON payloads — F-AC5 needs a seeded predecessor, F-AC6 needs a stubbed git seam; no new test strategy invention needed. [REFERENCE: iteration-016.md]
- **G7 (iter 17):** Refactor boundaries explicit — **8 truncation callsites**, **2 real importance-tier writers**, **7 `_source`/save-mode callsites**; refactor work can safely trail the functional fixes. [REFERENCE: iteration-017.md]
- **G8 (iter 18):** D7 reduces to a workflow-only insertion after Step 3.5 that copies four provenance fields from `extractGitContext()` into JSON-mode saves, explicitly avoiding the capture-mode enrichment branch. [REFERENCE: iteration-018.md]
- **G9 (iter 19):** Post-save reviewer upgrades from six baseline checks to a `CHECK-D1..D8` structural guardrail pass; D1/D2/D4/D7 as HIGH, D3/D5/D6/D8 as deterministic MEDIUM. [REFERENCE: iteration-019.md]
- **G10 (iter 20):** Staged **9-PR rollout** replaces the single mega-PR path. See B.4 below. [REFERENCE: iteration-020.md]

### B.3.1 Iteration 11 — Citation Drift Verification (Q8)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md`

**Focus**
Generation-1 remediation is only safe if the frozen D1-D8 root-cause citations still point at the live owners in the current tree. If those anchors drifted, downstream fix work could patch the wrong seam, misread an omission as resolved, or carry stale file:line references into the PR plan.

This pass therefore does not reopen Q1-Q7 or reinterpret the defects. It only checks whether the canonical citations from `research.md` and iteration 10 still land on the same functions, branches, and omission points in the current `.opencode/skill/system-spec-kit/scripts/` tree.

**Approach**
- Read the Gen-2 strategy reopen scope and confirmed Q8 is limited to drift verification, not root-cause re-analysis. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:174-210]
- Read the canonical Gen-1 synthesis to capture the frozen D1-D8 citation set now treated as the source of truth. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:48-75]
- Read iteration 10 to mirror the established deliverable tone and to cross-check which citations Gen-1 declared final. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-010.md:9-16]
- Located the live on-disk TypeScript owners under `.opencode/skill/system-spec-kit/scripts/` and inspected each cited neighborhood directly.
- Compared the frozen line spans against the current source to classify each as stable, drifted, moved, or missing.

**Findings**
1. All ten legacy Q8 target citations still resolve to the same six TypeScript files and the same cited line spans in the current source tree; I found no file move, helper rename, or line-number drift in the frozen D1-D5/D7 anchors. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
2. D2’s “missing raw decision read” citation is still valid at the exact function entry: `extractDecisions()` begins by reading `_manualDecisions`, and the cited entry span still shows no direct `keyDecisions` or `decisions` intake before later fallback logic executes. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185]
3. D2’s lexical-fallback citation is also still exact: the `decisionObservations.length === 0 && processedManualDecisions.length === 0` branch still calls `buildLexicalDecisionObservations(collectedData)` and then prefers those observations when none others exist. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388]
4. D3 shows additive evolution without citation drift: the workflow block now includes a `FOLDER_STOPWORDS` set inside the same cited window, but folder-derived tokens are still appended after `filterTriggerPhrases()`, so the original owner citation remains valid. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1298]
5. D4’s second-writer citation remains precise because the same `inferImportanceTier(...)` plus `serializeFrontmatter(...)` path still recomputes and serializes managed frontmatter keys in one place; the owner did not move to another helper. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183]
6. D5 and D7 both remain orchestration omissions at the same seams: the workflow still injects `causalLinks` via `buildCausalLinksContext(collectedData)` without predecessor discovery, and JSON-mode still bypasses Step 3.5 because git/spec enrichment remains capture-mode-only. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]

**Ruled out / not reproducible**
- I did **not** find evidence that any Q8 citation had moved to a renamed helper or a different file; every target still lands on the originally cited owner block in the current tree. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295]
- I did **not** find a newly added predecessor-discovery stage in the D5 render path; the workflow still passes through `causalLinks` and the helper still only reads arrays already present on `collectedData`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
- I did **not** find a provenance-only JSON-mode hook replacing the old capture-only gate; Step 3.5 remains entirely inside `if (isCapturedSessionMode)`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

**New questions raised**
- When remediation PRs land, should Gen-2 append a post-fix citation refresh appendix so `research.md` does not retain pre-fix line anchors indefinitely?
- Does the inline `FOLDER_STOPWORDS` addition inside the D3 workflow block change the fixture scope needed for Q12’s repo-wide trigger-phrase survey?

### B.3.2 Iteration 12 — Repo-wide JSON-mode Memory Survey (Q9)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md`

**Focus**
Gen-1 root-cause mapping was built from a seven-file cluster under `026-graph-and-context-optimization/001-research-graph-context-systems`. That was enough to localize D1-D8 in the backend, but not enough to answer whether the remediation matrix matches the real JSON-mode population or only one unusually broken lineage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:186-188] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:31-46]

This pass therefore treats the whole repository as the corpus: every `memory/*.md` outside `research/archive/`, classified with the Gen-2 JSON-mode heuristics, then scored for observable D1-D8 symptoms. The key question is not just "do the seven sample defects exist elsewhere?" but "which defects are universal template/migration problems, which are broad-but-not-universal corpus defects, and which are narrow lineage-specific edge cases?" [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:174-203]

**Approach**
- Enumerated every `memory/*.md` in the repo root and excluded `research/archive/` snapshots. [CITATION: NONE]
- Classified a file as JSON-mode when it matched at least 2 of the user-provided stateless-save heuristics (`_sourceTranscriptPath`, `_sourceSessionId`, `quality_score: 1.00`, empty provenance bundle, generic decision placeholders, or path-fragment trigger phrases). [CITATION: NONE]
- Parsed frontmatter plus rendered body content to flag D1-D8 only from observable file evidence; no source-code inference was used for row-level tagging. [CITATION: NONE]
- Treated D1, D5, and D7 as conservative lower-bound counters in this survey because their strongest signals depend on brittle truncation shape checks, predecessor context, or specific provenance field emptiness rather than simple structural presence. [CITATION: NONE]
- Kept the full candidate list in the matrix below so folder-level clustering can be inspected directly instead of inferred from summary percentages. [CITATION: NONE]

**Findings**
1. The broader JSON-mode population is dominated by D8 and D4, not by the full Gen-1 eight-defect bundle: D8 was observed in all 82 JSON-mode candidates and D4 in 81/82, which is far more pervasive than the original seven-file sample suggested for D4. [CITATION: NONE] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:31-40]
2. D3 clearly generalizes beyond the seven-file sample and is spread across unrelated product lines and spec trees, including `00--anobel.com`, `skilled-agent-orchestration`, `022-hybrid-rag-fusion`, `023-hybrid-rag-fusion-refinement`, `024-compact-code-graph`, and `026-graph-and-context-optimization`. Representative examples appear in the anobel button planning memory, coco integration, hybrid-rag epic memories, and compact-code-graph remediation memories. [SOURCE: .opencode/specs/00--anobel.com/036-notification-toast-button/memory/04-04-26_15-09__planning-session-for-cms-driven-button-in.md:4-20] [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:3-22] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/20-03-26_16-36__implemented-full-hybrid-rag-fusion-pipeline.md:3-30] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:4-34]
3. D2 remains narrow and localized to the original `001-claude-optimization-settings` lineage: only two files in the entire 82-file JSON-mode population reproduced the `observation decision N` placeholder symptom. That population result supports the Gen-1 recommendation to keep the D2 fix precedence-based rather than broad or mode-wide. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_12-05__deep-research-run-8-iterations-via-cli-copilot.md:229-232] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:232-235] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:69-70]
4. D6 also stayed rare at population scale: only one file in the entire JSON-mode corpus reproduced duplicate trigger phrases, and it is the same extended-memory lineage already flagged in Gen-1. That strengthens the case for treating D6 as fixture-first and low-priority rather than part of the broad remediation core. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:4-53] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:42-42]
5. The repo-wide static sweep did not re-detect D1, D5, or D7 as broad corpus defects. Those zeroes should be treated as conservative lower-bound observations rather than disproof of the Gen-1 mappings, because Gen-1 established D1 and D7 in the original seven-file sample while this population pass intentionally used only file-observable heuristics and no predecessor/source-code reasoning. [CITATION: NONE] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:31-46]

**Ruled out / not reproducible**
- A pure text-shape detector for D1 was not reliable enough for population counting; it did not robustly re-tag the known seven-file lineage, so the survey keeps D1 at `0 observed` rather than over-claiming. [CITATION: NONE]
- A single-file heuristic for D5 (`continuation`/`extended` title without visible `supersedes`) was too weak to support a confident corpus count because predecessor absence is a folder-history question, not just a local-file question. [CITATION: NONE]
- Empty git provenance was useful as a classification heuristic but not as a broad defect counter: many JSON-mode candidates still met the stateless-save threshold through other heuristics, so D7 did not generalize as a whole-population signature. [CITATION: NONE]

**New questions raised**
- Why is D4 nearly universal in the JSON-mode population when Gen-1 only surfaced it explicitly in two sample files?
- Should D3 remediation include a repo-wide cleanup/backfill plan, given that the defect spans 52 existing JSON-mode memories across many unrelated spec families?
- Are low-confidence D8-only candidates in `024-compact-code-graph` genuine JSON-mode artifacts or false positives caused by template residue plus a thin heuristic match set?

### B.3.3 Iteration 13 — D2 Call-graph and Precedence Gate Design (Q10)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md`

**Focus**
This iteration resolves the concrete design question left open by the iteration-9 narrowing: if D2 should ship as a precedence-only fix, exactly where does the raw JSON decision path meet the lexical fallback that emits placeholder decisions, and which branch must be gated so well-formed `keyDecisions` win without removing degraded fallback behavior for decision-less payloads. That is the core concern behind the P2 D2 remediation ordering in `research.md` section 10, which explicitly says D2 should ship with "precedence hardening and regression fixtures rather than a broad mode-based behavior change." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-189]

The live source shows the key nuance: there is no raw-JSON parser inside `decision-extractor.ts` itself. Raw `keyDecisions` are promoted upstream by `normalizeInputData()` in `input-normalizer.ts`, and `extractDecisions()` only sees the normalized carriers `_manualDecisions` and `observations`. The D2 gate therefore belongs at the lexical fallback predicate inside `extractDecisions()`, not at a later merge point. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-388]

**Approach**
1. Read the reopened Gen-2 packet state: strategy, canonical research synthesis, and the prior D2-focused iterations (003 and 009). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-189] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-003.md:17-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:17-24]
2. Open the live `decision-extractor.ts` and inventory every function, including the placeholder-emitting lexical helper and the main `extractDecisions()` merge logic. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:38-615]
3. Trace the caller chain from `runWorkflow()` to `normalizeInputData()` and then to `extractDecisions()` to identify where raw `keyDecisions` become normalized carriers. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-637] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1031] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:447-589] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752]
4. Compare that path with `conversation-extractor.ts`, which still reads raw `keyDecisions` directly, to confirm the asymmetry is specific to decision extraction. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-107]
5. Isolate the exact predicate that admits lexical fallback and determine whether D2 is a precedence issue, a merge/clobber issue, or an upstream handoff gap. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]

**Findings**
1. `runWorkflow()` is the entry point that normalizes preloaded JSON first and only then dispatches `extractDecisions(collectedData)` inside the extractor Promise group. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-637] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1031]
2. The raw `keyDecisions` list is handled upstream by `normalizeInputData()`, not by `decision-extractor.ts`: the normalizer copies it into `_manualDecisions` and, when needed, synthesizes decision observations via `transformKeyDecision()`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:200-260]
3. Inside `decision-extractor.ts`, the raw path intersects the fallback path only at the `extractDecisions()` boundary where `_manualDecisions` becomes `manualDecisions`; there is no direct `keyDecisions` reader in this file. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185]
4. The placeholder strings `observation decision N` and `user decision N` are emitted only by `buildLexicalDecisionObservations()`, which mines cue-bearing sentences from observations and user prompts. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176]
5. The exact lexical admission gate is the ternary predicate `decisionObservations.length === 0 && processedManualDecisions.length === 0`; that is the branch condition a precedence-only D2 fix must tighten. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384]
6. This is not a merge/clobber bug: when manual decisions exist, `extractDecisions()` explicitly clears `decisionObservations`, skips lexical mining, and later concatenates processed manual decisions into the final array. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]
7. `conversation-extractor.ts` still reads raw `keyDecisions` directly when building synthetic messages, which confirms the raw-field asymmetry is specific to decision extraction rather than a repo-wide absence of raw JSON handling. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-107]
8. The correct D2 patch boundary is therefore inside `extractDecisions()`: either rehydrate manual decisions from raw arrays there when normalization missed, or at minimum add `rawKeyDecisions.length === 0` to the lexical predicate so authoritative raw arrays block placeholder generation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584]

**Ruled out / not reproducible**
The live source does **not** support a "lexical fallback clobbers already-parsed raw decisions" theory. Once `processedManualDecisions.length > 0`, `decisionObservations` are cleared, lexical extraction is skipped, and the final return concatenates manual decisions first; there is no later overwrite branch to reproduce. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]

The live source also does **not** support a "raw parser exists inside `decision-extractor.ts` but loses a precedence fight" theory. The file never reads `keyDecisions`/`key_decisions`; that handling exists only upstream in `normalizeInputData()` and separately in `conversation-extractor.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:87-107]

**New questions raised**
- What concrete payload shape caused `_manualDecisions` to be absent in the broken F1/F2 saves even though the normalizer has explicit `keyDecisions` promotion logic? [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-003.md:17-30]
- Should the D2 hardening reuse the existing manual-decision mapping logic inline, or extract that mapping into a shared helper so raw-rehydration and normalized-manual processing cannot drift? [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:193-365]

### B.3.4 Iteration 14 — D5 Continuation-signal Corpus (Q11)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md`

**Focus**
`research.md` freezes D5 as a P3 remediation: auto-link only the immediate, unambiguous predecessor, and only when continuation evidence is strong enough to justify lineage injection. This iteration supplies the missing empirical half of that recommendation by measuring which title-side phrases actually recur across the repo-wide memory corpus, instead of treating the D5 gate as a guess. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:124-133] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:209-209]

Iteration 9 already narrowed the earlier D5 proposal to "immediate predecessor with continuation gating" and named `extended`, `continuation`, and iteration carry-forward as the plausible signals. Q11 tests that narrowing against every `memory/**/*.md` title in the repo so the gate can prefer the high-precision terms that are actually present and explicitly exclude the noisy ones. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:29-33] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:43-43]

**Approach**
1. Enumerated every repo file under a `memory/` path ending in `.md`.
2. Extracted `title:` from frontmatter when present; otherwise fell back to the first `#` heading.
3. Matched each extracted title against the requested case-insensitive phrase families.
4. Counted per-pattern hits and sampled real titles for each non-zero family.
5. Cross-checked the same corpus for explicit lineage markers, especially non-empty `causal_links.supersedes`.
6. Compared the raw pattern hits against the known D5 continuation pairs from the Gen-1 packet to separate precision signals from false positives.

**Findings**
1. The cleanest title-side continuation phrases are rare but precise: only three corpus titles use `extended` or `continuation`, and all three are the exact deep-research follow-on artifacts already implicated in the D5 sample set. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/memory/06-04-26_13-49__extended-deep-research-phase-003-contextador-from.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_17-58__continuation-deep-research-run-for-002-codesight.md:2-2]
2. `phase N` is the dominant raw match family, but it is far too noisy for D5 gating because most hits are phase labels or remediation milestones rather than continuation saves. [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/memory/31-03-26_09-02__executed-phase-008-compliance-audit-across-186.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/memory/01-04-26_11-03__completed-phase-3-deep-review-remediation-6-of-8.md:2-2]
3. `vN` is also a poor continuation proxy: the observed hits are version markers (`v2`) or an unrelated `v8` contamination reference, not lineage between runs. [SOURCE: .opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/memory/24-03-26_18-33__deep-research-v2-improving-review-logic-in-sk.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/001-initial-enrichment/memory/20-03-26_09-34__deep-research-completed-21-findings-across-v8.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:2-2]
4. The corpus validates iteration-009's narrowing: D5 should key on high-precision continuation language plus immediate-predecessor semantics, not on folder recency plus generic numerals. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:31-33] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:43-43]
5. Literal `iter NN` never appeared in the extracted titles, but numeral-led iteration carry-forward does appear, so any production gate should broaden beyond the exact `iteration 5` surface form or it will miss known continuation shapes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_16-34__5-iteration-deep-research-session-investigating.md:2-3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:2-2]
6. The known continuation pairs still have empty markdown-side lineage, so D5 remains a pre-render discovery problem rather than a downstream causal-graph insertion bug. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:9-16] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:20-30]
7. The final D5 matrix in `research.md` is now empirically grounded: excluding `phase N` and `vN` from the gate is not stylistic caution, but a direct response to corpus-level false-positive pressure. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:72-72] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:209-209] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/memory/31-03-26_09-02__executed-phase-008-compliance-audit-across-186.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:2-2]

**Ruled out / not reproducible**
Using `phase N` as a first-class D5 gate term is ruled out by the corpus because it mostly matches unrelated phase bookkeeping and remediation work, not follow-on memory saves. `vN` is likewise too noisy because the hits are version labels and `v8` problem framing rather than run continuation. Literal `iter NN` also proved too narrow as the primary surface form because the actual continuation artifacts prefer numeral-led or hyphenated iteration carry-forward wording. [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/memory/31-03-26_09-02__executed-phase-008-compliance-audit-across-186.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:2-2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/06-04-26_16-34__5-iteration-deep-research-session-investigating.md:2-3]

**New questions raised**
- Should D5's pre-render helper consult description/payload before title when the frontmatter title is truncated or pathified?
- Do the sparse historical `_sourceSessionId` memories justify a secondary lineage fallback after title gating, or are they too inconsistent to use safely?

### B.3.5 Iteration 15 — D3 Empirical Filter-list Build (Q12)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md`

**Focus**
Generation-2 Q12 converts the Gen-1 D3 diagnosis into an empirical filter design. The canonical research report freezes D3 as a paired defect: saved `trigger_phrases` are polluted by path/folder fragments, while topic extraction can emit stopword-collapsed bigrams [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:36-37] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md:20-29].

Iteration 9 narrowed the safe remediation boundary: remove unconditional junk, but keep the guarded `ensureMinTriggerPhrases()` fallback instead of deleting all folder-derived recovery behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:38-44]. This pass therefore does not revisit root cause. It mines the current repo-wide `memory/**/*.md` corpus and pressure-tests a concrete blocklist against real samples, exactly as queued for Q12 in strategy section 14 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:189-191].

**Approach**
- Enumerated every `memory/**/*.md` path in the repo, then parsed frontmatter `trigger_phrases:` arrays from each file that actually contained them.
- Flattened all harvested phrases into one corpus, preserving first-seen source file and line for each unique phrase.
- Classified each phrase occurrence into one bucket: `PATH_FRAGMENT`, `STOPWORD`, `SINGLE_CHAR`, `SYNTHETIC_BIGRAM`, `LEGITIMATE_SHORT_NAME`, or `LEGITIMATE_PHRASE`.
- Simulated a candidate filter using regexes for path fragments, standalone stopwords, single-character tokens, stopword-bigrams, and narrow numbered/ID-style prefixes.
- Compared removals against observed legitimate short-name cases to measure false positives, then manually tagged the surviving generic singletons that still looked like junk.

**Findings**
1. Path-like fragments are the largest removable junk class in the live corpus: 174 of 2,282 trigger occurrences (7.63%). The surviving examples still look exactly like D3's Gen-1 leak shape, including slash-bearing tokens such as `"skills/022"` and `"skills/037"` inside saved frontmatter arrays [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:27-29].
2. Standalone English stopwords still appear literally in production memory files. `"and"` coexists next to path fragments and the valid short name `"mcp"` in the same trigger list, so a standalone stopword block is justified and low-risk [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20].
3. Stopword-collapsed bigram junk is present corpus-wide, not just in the original D3 samples: `"with phases"`, `"with research"`, and `"session for"` are all currently stored trigger phrases [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:3-5] [SOURCE: .opencode/specs/00--anobel.com/036-notification-toast-button/memory/04-04-26_15-09__planning-session-for-cms-driven-button-in.md:6-9]. This matches iteration 4's root-cause model that D3 includes synthetic word-pair artifacts, not only path leaks [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md:20-29].
4. Legitimate short product names are rare but real. Only one current-corpus short token matched the proposed allowlist (`"mcp"`, 2 occurrences), which means the keep-list can stay narrow without introducing false positives for short names [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:18-20].
5. Prefix filtering needs to be narrow and shape-based, not word-based. Numbered/ID-prefixed phrases like `"phase 7 cocoindex"` and `"f21 arithmetic inconsistency"` are clear junk candidates, but a blanket `^phase\b` rule would also overreach into the standalone domain noun `"phase"` [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:4-6] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:12-17] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:30-32].
6. The tuned filter removes 230 trigger occurrences (10.08% of the corpus) while preserving all observed legitimate short names. That is consistent with Gen-1's narrowed D3 direction: clean unconditional junk first, but do not broaden the rule set enough to break fallback or valid short tokens [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:69-70] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:38-44].
7. The main false-negative residue is generic singletons, not path or stopword artifacts. `"graph"` and `"research"` survive because they are not path-shaped, not stopwords, and not ID-prefixed; they likely need either a separate frequency-based singleton suppressor or a reviewer assertion rather than more regex [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/memory/01-04-26_07-21__prepared-the-external-graph-memory-research-phase.md:36-40].

**Ruled out / not reproducible**
- Broad prefix blocking such as `^phase\b` is not safe. It catches obvious junk like `"phase 7 cocoindex"` but also collides with the generic-but-not-obviously-broken singleton `"phase"` [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:4-6] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:30-32].
- A blanket short-token filter would be over-broad. The observed short-name case `"mcp"` is legitimate, so the short-name allowlist is required even though the current corpus only needs one live entry from it [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:18-20].
- Single-character cleanup is necessary only as a guardrail, not as the main D3 payoff. The current corpus produced no single-character `trigger_phrases`, so that rule should remain defensive rather than driving design priority.

**New questions raised**
- Should D3 add a second-stage generic-singleton suppressor (for tokens like `"graph"` and `"research"`) based on corpus frequency or source adjacency rather than regex alone?
- Should the same numbered/ID-prefix suppression be applied only to saved `trigger_phrases`, or also to `Key Topics` / semantic-topic outputs when they share the same surface form?

### B.3.6 Iteration 16 — AC-1..AC-8 Fixture Design (Q13)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md`

**Focus**
This iteration translates spec acceptance criteria AC-1..AC-8 into unit-test-ready JSON fixture shapes. The goal is not to re-prove Gen-1 root causes, but to turn them into small, reproducible payloads that fail on exactly one defect class at a time and therefore make the eventual remediation patches easy to verify without full-session replay noise. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:83-95] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-195]

Gen-2 Q13 is specifically about testing artifacts, so the useful output here is a fixture catalog, not more diagnosis. The catalog below keeps each AC fixture as close as possible to the real JSON-mode contract consumed by `generate-context.ts`, while avoiding fields that would accidentally activate a second defect class and muddy the before/after signal. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-341] [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:123-192]

**Approach**
- Start from the live structured-input parser, not the historical markdown artifacts, so every fixture matches the current JSON-mode entry contract. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:301-309] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:368-385]
- Use `CollectedDataBase` as the canonical field inventory, but prefer the smallest payload that still reaches the target defect owner. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:123-192]
- Reuse `filesChanged` rather than `filesModified` where possible because the alias is explicitly documented in the shared type contract. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:134-136]
- Keep D2 fixtures dependent on `userPrompts.prompt`, because the pre-fix extractor only reads `_manualDecisions`, `userPrompts`, and `observations` and ignores raw `keyDecisions`. [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:72-76] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-384]
- Treat D5 and D7 as harness-assisted fixtures: the JSON payload stays minimal, while the unit test seeds one predecessor memory (D5) or stubs `extractGitContext()` (D7). [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- Explicitly note D6 as out-of-band for the AC fixture set because the spec does not assign it a dedicated acceptance criterion and Gen-1 reclassified it as historical/stale-sample pending a better reproducer. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:40-45]

**Findings**
1. The only hard requirement for structured JSON mode is a resolvable target spec folder; the parser accepts any JSON object and then injects `_source: "file"`. That means AC fixtures can stay tiny and do not need transcript-shaped noise to enter the real workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:324-341] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:369-385]
2. D2 fixtures must include both raw `keyDecisions` and decision-like `userPrompts`, otherwise pre-fix behavior may yield an empty DECISIONS section instead of the bad placeholder branch. The extractor currently ignores raw `keyDecisions` and only lexical-mines when both manual and observation decisions are absent. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-384]
3. D3 is the easiest defect to isolate with almost no payload because the folder-token leak happens after trigger filtering; the spec folder path itself is already enough to reproduce the issue. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1298]
4. D5 and D7 are not pure-payload bugs: one needs seeded predecessor state and the other needs a git seam. The JSON fixture should therefore stay minimal while the harness supplies the missing environmental preconditions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
5. AC-1’s suffix expectation is still slightly underspecified: the existing word-boundary helper uses ASCII `...`, while the spec text uses the single-character ellipsis `…`. The implementation PR should pin one canonical suffix so fixture assertions do not encode punctuation ambiguity. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:87-88]

**Ruled out / not reproducible**
- I did **not** base the fixtures on top-level `triggerPhrases` even though real saved JSON payloads use that convenience key, because the canonical shared TS contract does not declare it and the AC set does not require testing that normalization seam directly. Using `specFolder` + `filesChanged` gives a cleaner D3 reproducer. [SOURCE: .opencode/specs/00--anobel.com/033-form-upload-issues/scratch/save-context-data.json:27-42] [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:126-192]
- D6 does not get its own AC fixture in this catalog. The spec’s AC table omits a standalone duplicate-trigger criterion, and Gen-1 final synthesis explicitly downgraded D6 to historical/stale-sample pending a better reproducer. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:85-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:40-45]

**New questions raised**
- Should the eventual fixture loader normalize convenience payload keys from real saved JSON samples (for example `filesModified` string arrays) before handing them to type-strict unit helpers, or should tests only use canonical `CollectedDataBase` keys? [SOURCE: .opencode/specs/00--anobel.com/033-form-upload-issues/scratch/save-context-data.json:11-25] [SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:134-136]
- For D5, is it safer for the unit harness to stub the generated title/continuation signal directly rather than rely on title inference from `sessionSummary` text? The current fixture design assumes continuation wording is enough, but the generation seam was not part of this iteration’s scope. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1308]
- Should AC-4 add a dedicated non-heuristic tier-classification seam so the divergence test does not depend on whatever phrases `inferImportanceTier()` happens to rank highly in the future? [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1115-1118]

### B.3.7 Iteration 17 — Refactor Dependency Map for Shared Helpers (Q14)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md`

**Focus**
`research.md` already froze three cross-cutting refactor targets for post-synthesis follow-up: a shared truncation helper, an importance-tier single source of truth, and an explicit save/enrichment mode instead of `_source === 'file'` overloading. This iteration maps the concrete callers so those extractions can be sequenced without changing unrelated behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:217-219]

Iteration 10 also flagged these as the remaining shared-helper opportunities after the D1-D8 root-cause pass. The goal here is not another diagnosis pass, but a safe dependency map: which callsites need to move together, which ones are only propagators or reviewers, and which truncation hits are out-of-scope because they are structural slices rather than user-visible text shaping. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-010.md:21-29]

**Approach**
- Re-read Gen-2 scope and the canonical synthesis anchors for the three shared-helper candidates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:173-210]
- Searched the live `scripts/` tree for substring/slice truncation patterns and then filtered out array caps, hash digests, and protocol parsing.
- Mapped every `importance_tier` / `importanceTier` read-write site, separating writers from propagators and reviewers.
- Mapped every `_source === 'file'`, `_source !== 'file'`, `_sourceSessionId`, and `_sourceTranscriptPath` usage in the workflow path.
- Cross-checked each shared-helper candidate against the earlier D1/D4/D7 defect owners so the refactor plan stays aligned with proven root causes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:48-63]

**Findings**
1. The repo already contains one boundary-aware narrative truncator (`buildSessionSummaryObservation()`), but D1 still bypasses it with a raw `substring(0, 500)` in `collect-session-data.ts`; the shared helper can therefore start as an extraction, not a brand-new design. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]
2. The decision path is the densest truncation cluster: five user-visible truncation callsites live under `extractDecisions()` and its lexical helper, which makes D2/D1 truncation work mostly a two-file refactor (`decision-extractor.ts` + `collect-session-data.ts`) plus reuse in `input-normalizer.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135,182-185,270-274,329-332,381-455]
3. D4 drift is a true multi-writer problem, but only two writers matter: initial render and managed-frontmatter migration. The rest of the `importanceTier` surface is propagation (`input-normalizer.ts`, `workflow.ts`) or detection (`post-save-review.ts`). [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:883-885,894-1064; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]
4. `_source` is currently overloaded across three concerns at once: enrichment eligibility, JSON-mode completion heuristics, and source-session metadata persistence. That is why a `SaveMode` enum is safer than another `_source === 'file'` patch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-460,654-659; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361-388,475-482,836-847]
5. `post-save-review.ts` is already the guardrail consumer for both D4 mismatch detection and `_source`-based captured-session checks, so it should migrate last after the SSOT and `SaveMode` extractions land. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226,279-289]
6. The target surface is smaller than a raw grep suggests because many `slice(0, N)` hits are structural caps or protocol parsing, not user-visible text truncation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:131-133; .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:68; .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:531]
7. Diagnostic truncations in reviewer/help text (`post-save-review.ts`) should stay out of the shared helper unless the team explicitly widens scope from persisted artifact text to human-facing warnings. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:240,340]

**Ruled out / not reproducible**
- Structural `slice(0, N)` usages for array caps, hashes, or git status parsing are not shared-helper candidates for Q14. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:131-133; .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:68; .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:531]
- I found no third writer that independently mutates the rendered tier after save; outside the initial render and `frontmatter-migration.ts`, the remaining `importanceTier` sites only propagate or inspect the value. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551-555,755-758; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:624-635; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289]

**New questions raised**
- Should `SaveMode` live on `RawInputData` / `CollectedDataFull`, or be derived once in `workflow.ts` to avoid schema churn in saved payload fixtures?
- Should the bottom metadata block remain template-owned, or should managed-frontmatter migration become responsible for rewriting both tier locations atomically?
- Do the decision-extractor short limits (`120`, `200`) need one generic helper, or a helper plus named wrappers for title/context/rationale budgets to preserve reviewable intent?

### B.3.8 Iteration 18 — D7 Provenance-only <=10-line Patch (Q15)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md`

**Focus**
D7 in the canonical synthesis is still the same defect: JSON-mode saves never receive git provenance because Step 3.5 only runs for captured-session inputs, so `head_ref`, `commit_ref`, and `repository_state` stay empty or fall back to `"unavailable"` in rendered memory files. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:146-155] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]

Iteration 9 narrowed the acceptable fix: do not reuse the full captured-session enrichment branch, because that branch also merges spec-folder observations, FILES, trigger phrases, decisions, and summary text. This pass converts that narrowing into an exact provenance-only patch that calls `extractGitContext()` directly from the JSON-mode path and copies only the four provenance fields already consumed by template rendering. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:35-44] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]

**Approach**
- Re-read the Gen-2 strategy plus the D7 synthesis and prior narrowing notes to lock the allowed fix shape. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-195] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:146-155]
- Inspect `workflow.ts` at the capture-only gate and the Step 3.5 enrichment block. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- Inspect `extractGitContext()` itself to confirm its signature, fallback contract, and detached-HEAD behavior. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]
- Design the smallest possible workflow-only insertion that copies provenance fields without invoking `enrichCapturedSessionData()`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- Check edge cases against extractor internals: detached HEAD, shallow history, non-git, CI detached checkout, and submodule-rooted execution. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:344-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]

**Findings**
1. JSON-mode inputs skip Step 3.5 entirely because `isCapturedSessionMode` is false when `_source === 'file'`, so the only existing git-enrichment call site never runs. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]
2. `enrichCapturedSessionData()` is the wrong fix surface for JSON mode because it merges far more than provenance, directly violating the iteration-9 narrowing. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]
3. `extractGitContext()` already centralizes the safe provenance contract needed by JSON mode: async extraction, detached-HEAD signaling, and empty-result degradation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]
4. Detached HEAD is represented as `headRef = 'HEAD'`, `commitRef = <short SHA>`, `isDetachedHead = true`; the patch preserves that exact contract instead of guessing a branch name. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:329-343]
5. Shallow history does not block this fix because provenance is derived from bounded `rev-list`, `rev-parse`, and `show/diff` calls that already degrade safely. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:330-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:369-373]
6. A six-line JSON-mode insertion after Step 3.5 is sufficient; no new helper, no template change, and no post-save contract change are required for Q15 itself. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]

**Ruled out / not reproducible**
Reusing `enrichCapturedSessionData()` for JSON mode was ruled out because its merge surface is much wider than provenance and would reintroduce exactly the contamination risk iteration 9 flagged. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:35-44] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]

Inlining git-shell commands directly into `workflow.ts` was also rejected; it would duplicate the extractor's existing fallback rules (`emptyResult()`, detached-HEAD detection, bounded diff logic) for no gain. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:499-502]

**New questions raised**
Should JSON mode preserve caller-supplied provenance when `headRef` / `commitRef` are already present, or is live git state always the desired source of truth?

### B.3.9 Iteration 19 — Post-save Reviewer Contract Upgrade (Q16)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md`

**Focus**
Generation 2 shifts from root-cause discovery to post-fix drift detection, so the reviewer contract now matters as much as the underlying remediations. The current `post-save-review.ts` still behaves like a narrow payload-vs-frontmatter comparator: it catches generic titles, path-fragment triggers, explicit payload/frontmatter tier drift, missing decision counts, context type drift, and generic descriptions, but it does not inspect the rendered markdown for the D1-D8 regression shapes that matter after the fixes land. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:173-173]

Q16 therefore is not "add more warnings" in the abstract. It is about turning the reviewer into a cheap structural guardrail that can detect whether the shipped D1-D8 fixes silently drifted back, using only the saved file plus the JSON payload. That constraint rules out repo scans, git probes, or embedding-based validation, and it favors regex- and parser-based assertions that reuse the reviewer's existing frontmatter parser, metadata-block parser, and content-level string matching. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:56-157]

**Approach**
- Read the canonical Gen-2 scope and the D4/D3/D5 prior design iterations to keep this pass inside Q16 and aligned with the frozen remediation matrix. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:65-77]
- Inventory the current reviewer's real surface area, including parser helpers, existing severity model, and current checks 1-6. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:17-45] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343]
- Reuse the corpus-derived D3 blocklist/allowlist and the D5 continuation regex rather than inventing new heuristics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39]
- Propose only O(1)/O(N) checks over the saved file and payload, with no network, no repo grep, and no dependency on runtime-global state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200]
- Separate blocking regressions (HIGH) from advisory guardrails (MEDIUM) so the contract matches the existing "manual patch HIGH before continuing" behavior. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:401-418]

**Findings**
1. The live reviewer only implements six checks, and all of them are payload/frontmatter/content-quality comparisons; none inspect the rendered markdown for D1/D2/D5/D8-style structural regressions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:236-343]
2. D4 is already a documented reviewer blind spot: the current code compares payload tier to frontmatter tier, but never frontmatter tier to the bottom metadata block. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-005.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-291]
3. The D3 reviewer-safe filter should reuse iteration 15's empirical regex set and allowlist instead of inventing a broader semantic blocklist, because the tuned corpus simulation removed 10.08% of trigger occurrences with zero observed false positives. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-44]
4. D5 title gating must exclude `phase N` and `vN`; iteration 14 showed those are the dominant noisy matches, while `extended` and `continuation` are the high-precision continuation signals. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:22-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-56]
5. D6's active producer is still unresolved, which makes a cheap duplicate-trigger assertion especially valuable as a guardrail even before the true owner is isolated. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:73-73]
6. D7 cannot safely depend on reviewer-time git probing if the contract must stay deterministic; the save pipeline needs to pass a payload-side `provenanceExpected`/`gitRepoAvailable` signal into `post-save-review.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:74-74]

**Ruled out / not reproducible**
- Repo-wide grep, sibling-folder scans, or git-shell probes inside `post-save-review.ts` are ruled out for Q16 because they violate the deterministic saved-file-plus-payload constraint and the O(1)/O(N) runtime budget. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200]
- A D5 reviewer regex that includes `phase N` or `vN` is ruled out by corpus evidence: those shapes mostly hit unrelated phase bookkeeping or version labels, not continuation runs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:38-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:55-56]
- A broader D3 singleton blocklist for words like `graph` or `research` is not yet justified for a reviewer assertion. Iteration 15 showed those are the main false-negative residue, but solving that with regex alone would overreach compared with the validated shape-based blocklist. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:45-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:55-59]

**New questions raised**
- Should the D7 remediation formally extend `PostSaveReviewInput['collectedData']` with `gitRepoAvailable` / `provenanceExpected` so the reviewer can stay deterministic without runtime git calls?
- Should CHECK-D1 key off a fixed overflow delta (for example `+40` chars) or a ratio between `sessionSummary` and `OVERVIEW` length to reduce acronym-ending false positives on legitimate short summaries?

### B.3.10 Iteration 20 — PR Breakdown + Rollout Sequence (Q17)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md`

**Focus**
The remediation set is not safe as a single mega-PR because the packet mixes three different risk classes: template-only cleanup (D8), single-owner correctness fixes (D1, D7), and behavior-sensitive heuristic work (D2, D3, D5). The canonical priority ordering already separates those classes into P0-P3, and the spec adds explicit landing constraints such as "D4 must land before adding the post-save reviewer drift assertion" and "D5 should only land with a regression fixture proving the continuation-signal gate works on a 3+ memory folder." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:24-28]

A staged train is also justified by the new Gen-2 evidence. Iteration 11 confirms the original owner lines are still valid, iteration 12 shows D4/D8/D3 are corpus-wide rather than seven-file anomalies, iteration 16 converts AC-1..AC-8 into minimal fixtures, iteration 17 maps the refactor-only surfaces that should trail the functional fixes, and iteration 18 reduces D7 to a workflow-only patch small enough to stand alone. That combination makes the safest plan: land user-visible correctness first, then consistency/provenance, then heuristic changes, then optional refactor/guardrail follow-ups. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-40] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58]

**Approach**
- Reused strategy section 14 as the scope lock so this pass stayed in rollout planning rather than reopening root-cause questions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:180-200]
- Used research section 10 as the canonical P0-P3 ordering baseline, then split each priority bucket into reviewable PR-sized slices. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]
- Used iteration 11 to trust the cited live owner lines and iteration 17 to map which helper/refactor work can wait until after behavior fixes land. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
- Used iteration 12 to bias earlier PRs toward the defects that appear across the broader JSON-mode population, not just the original seven-file sample. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:44-46]
- Used iterations 13-18 to assign exact owner files, minimal patch boundaries, and fixture-backed validation lanes per PR. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:26-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-264] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58]
- Kept the reviewer-upgrade PR last because the strategy schedules Q16 as a post-fix guardrail question, the spec makes reviewer assertions downstream of D4, and iteration 19 now defines the new CHECK-D1..D8 reviewer contract as a post-fix structural guardrail rather than a prerequisite remediation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:3-13]

**Findings**
1. The original D1/D2/D3/D4/D5/D7 owner lines are still live, so the PR plan can cite concrete file spans without re-investigating ownership. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35]
2. D4 and D8 are population-scale JSON-mode defects, not just anomalies in the original seven-file sample, which justifies their placement before the narrower D5/D6 lane. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]
3. D2 is a predicate/precedence problem inside `extractDecisions()`, so it should ship as a tight branch fix with degraded-payload regression coverage rather than a mode-wide rewrite. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:44-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:65-73]
4. D5 should only gate on `extended` / `continuation`-style continuation signals plus immediate-predecessor semantics; `phase N` and `vN` stay excluded because the corpus shows they are noisy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]
5. D3 can remove a measurable junk slice of the live trigger corpus with narrow filters and no observed false positives, so it deserves its own PR rather than being hidden inside generic cleanup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:40-55]
6. AC fixtures already exist for every planned production PR in this train, which means rollout can be validated with small, deterministic payloads instead of fresh ad hoc test strategy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-264]
7. The safe refactor ordering is now explicit: functional fixes first, then helper extraction / save-mode cleanup, because the helper and `_source` surfaces span many more callsites than any single defect fix. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
8. D7 is independently shippable because iteration 18 reduced it to a small workflow-only patch that copies provenance fields without invoking full captured-session enrichment. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78]
9. Reviewer guardrails belong last in the train because both the spec and iteration 19 place CHECK-D1..D8 after the functional fixes, especially D4, and expect new HIGH detections to block continuation only once the repaired contract exists. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]
10. D6 should stay deferred from the production rollout because Gen-1 still treats it as an unresolved live-owner question with test instrumentation only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:135-144] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:221-224]

## B.4 Final PR Train (from iter 20)
Nine PRs in strict dependency order. Each PR is independently revertable; no shared schema migrations.

| # | Priority | Defect | Scope | Owners | Test fixture |
|---|----------|--------|-------|--------|--------------|
| PR-1 | P0 | D8 | anchor template consistency | `context_template.md:172-183,330-352` | F-AC7 |
| PR-2 | P0 | D1 | shared truncation helper + OVERVIEW fix | `collect-session-data.ts:875-881` + `input-normalizer.ts:274-283,668-674` + NEW `lib/truncate-on-word-boundary.ts` | F-AC1 |
| PR-3 | P1 | D4 | importance-tier SSOT | `frontmatter-migration.ts:1112-1183` + `session-extractor.ts:607-612` + `post-save-review.ts:279-289` | F-AC4 |
| PR-4 | P1 | D7 | provenance-only injection | `workflow.ts:658-659,877-923` (≤10 LOC) | F-AC6 |
| PR-5 | P2 | D3 | trigger-phrase sanitization | `workflow.ts:1271-1298` + `semantic-signal-extractor.ts:260-284` + NEW `lib/trigger-phrase-sanitizer.ts` | F-AC3 |
| PR-6 | P2 | D2 | precedence-only gate | `decision-extractor.ts:182-185,381-384` | F-AC2 + degraded-payload regression |
| PR-7 | P3 | D5 | auto-supersedes w/ continuation gate | `workflow.ts:1305-1372` + `memory-metadata.ts:227-236` + NEW `core/find-predecessor-memory.ts` | F-AC5 + 3+ lineage fixture |
| PR-8 | P3 | (refactor) | save-mode flag + helper migration | multi-file (`_source` → explicit `SaveMode`) | re-use F-AC1/F-AC2/F-AC6 |
| PR-9 | P3 | (guardrail) | post-save reviewer upgrade | `post-save-review.ts` with CHECK-D1..D8 | broken fixtures D1/D4/D7/D8 + clean F-AC8 |

**Dependency DAG:** `PR-1, PR-2 → PR-3 → PR-4 → PR-5 → PR-6 → PR-7 → PR-8 → PR-9` (see iteration-020.md §Dependency DAG).

**D6 remains DEFERRED:** no production PR — test-only instrumentation until a live owner and reproducer are re-established.

Cross-reference: the full per-PR rationale, dependency sequencing, and rollback notes from iter 20 now live in **B.3.10** so readers can move from the train table to the implementation narrative without reopening the raw iteration file.

## B.5 Gen-2 Convergence Declaration

- **Iterations executed:** 11-20 (all 10)
- **Questions resolved:** Q8-Q17 (all 10)
- **Drift detected:** none
- **Stop reason:** max_iterations (gen-2 cap) + all_questions_answered
- **Gen-2 new-info ratio trajectory:** 0.21 → 0.68 → 0.36 → 0.43 → 0.42 → 0.37 → 0.39 → 0.31 → 0.34 → 0.18 (mean 0.37, tail at 0.18 confirms diminishing returns exactly at iter 20 synthesis as designed)
- **Delegation:** 10/10 iterations dispatched via `cli-copilot gpt-5.4 reasoning_effort=high`, parallelized in 5 waves of 2
- **Evidence gap closed:** drift verified, population measured, call graphs mapped, corpora mined, blocklists empirical, fixtures ready, patches scoped, rollout staged

## B.6 Next Step (outside this research loop)

Run `/spec_kit:plan :with-phases` against this spec folder to convert the 9-PR train in B.4 into a phase-structured implementation workflow. Use the AC-1..AC-8 fixtures from iteration-016 as the phase exit criteria. PR-1/PR-2 can ship in parallel as the first phase.

---

# APPENDIX C — GENERATION 3 ADDENDUM (Iterations 21-25)

> **Status:** Gen-3 complete · 5 iterations (21-25) via `cli-copilot gpt-5.4 reasoning_effort=high` · waves **2 + 2 + 1** · reopened 2026-04-07 via second `completed-continue` lifecycle · Gen-2 synthesis immutably snapshotted at `research/archive/research-v2-iter020-snapshot.md`.

## C.1 Why Gen 3
Gen 2 produced a locked 9-PR train but left four operational questions unanswered: is there a **D9+ latent bug** we haven't found? is the PR-7 performance budget **safe**? what do we do with the **82 pre-fix broken files**? and does **capture mode** actually dodge the D1-D8 bug class, or does the spec's "out of scope" assumption hide parity bugs? Gen 3 answers all four with 5 focused iterations. [REFERENCE: deep-research-strategy.md §15]

## C.2 Gen-3 Iteration Map

| Iter | Wave | Question | Focus | Size | Findings | newInfoRatio |
|------|------|----------|-------|-----:|---------:|-------------:|
| 21 | W6 | Q18 — latent failure mode audit | latent-bugs | 13.9KB | 7 | 0.14 |
| 22 | W6 | Q19 — PR-7 performance impact | performance | 18.8KB | 7 | 0.36 |
| 23 | W7 | Q20 — migration strategy (82 files) | migration | 18.5KB | 7 | 0.38 |
| 24 | W7 | Q21 — observability telemetry | observability | 16KB | 6 | 0.27 |
| 25 | W8 | Q22 — capture-mode parity audit | parity | 18.6KB | 7 | 0.24 |

Total Gen-3 evidence: **5 iterations · 34 findings · ~86KB of iteration files**.

## C.3 Per-Iteration Findings (Gen-3)

### C.3.0 Quick Index

- **1 — Latent bug: ONE new D9 candidate surfaced (iter 21)**
  Gen 3 found exactly one non-D1..D8 latent bug worth naming: **D9 — cross-process save-lock bypass**. Simultaneous `--json` saves have no cross-process serialization, which makes filename collision handling, indexing order, and post-save review timing **non-deterministic under concurrent runs**. This is real but LOW severity in single-user workflows; matters more in CI/automation. [REFERENCE: iteration-021.md §D9 candidates]
  Other than D9, the audit confirmed **D1-D8 coverage is substantively complete** — the newInfoRatio of 0.14 on iter 21 reflects that Gen 1-2 already mapped the high-value failure modes. [REFERENCE: iteration-021.md]

- **2 — PR-7 performance: ACCEPTABLE (iter 22)**
  The D5 auto-supersedes predecessor-discovery design is **not latency-dangerous** at 50/100/500 memory folders as long as the implementation sticks to the narrowed iter-9/iter-20 contract: **list-folder + frontmatter-only read + regex match + pick immediate predecessor + ambiguity skip**. The risk is adding "nice-to-have" rescans or heavy helpers during implementation — those must be resisted. [REFERENCE: iteration-022.md]
  **Verdict:** PR-7 can ship as scoped. Add the proposed optimizations (skip-when-preset, cache-per-session, name-prefilter) only if measurements justify it post-rollout.

- **3 — Migration strategy: Option C (safe-subset batch) (iter 23)**
  Of four options (do-nothing / auto-heal / batch script / regenerate), Gen-3 recommends **Option C — one-shot batch migration, but only for safe/mechanical defects**:
  - **Auto-migrate:** D8 anchor rename · D4 tier synchronization · D6 dedupe · D3 trigger-phrase sanitation
- **Do NOT auto-migrate:** D1 truncation (content would be wrong), D2 decision placeholders (no source of truth without transcript), D5 supersedes (ambiguity risk), D7 git provenance (history is lost)
- **Delivery:** new PR-10 (optional, post-PR-9) that runs a batch script with `--dry-run`, `--per-defect`, and backup-to-archive gates. [REFERENCE: iteration-023.md §Recommendation]

- **4 — Observability: 11 HIGH-priority metrics (iter 24)**
  Ship these 9 metrics with PR-9 (post-save reviewer), plus 2 counters in PR-7:
  | Metric | Type | Watches |
|--------|------|---------|
| `memory_save_overview_length_histogram` | histogram | D1 regression |
| `memory_save_decision_fallback_used_total` | counter | D2 regression |
| `memory_save_trigger_phrase_rejected_total` | counter | D3 filter effectiveness |
| `memory_save_frontmatter_tier_drift_total` | counter | D4 regression (must stay 0) |
| `memory_save_continuation_signal_hit_total` | counter (+label) | D5 gating correctness |
| `memory_save_git_provenance_missing_total` | counter | D7 regression |
| `memory_save_template_anchor_violations_total` | counter | D8 regression |
| `memory_save_review_violation_total` | counter (+label) | all D1-D8 simultaneously |
| `memory_save_duration_seconds` | histogram | PR-7 latency budget |
  Alerting: `M4 > 0 → page`, `M6 > 5/hr → warn`, `M9 p95 > 500ms → warn`. [REFERENCE: iteration-024.md §Metric catalog]

- **5 — Capture-mode parity: BUGS ARE SHARED (iter 25)**
  This is the most **surprising** Gen-3 result. The spec §5 lists "capture-mode enrichment changes" as out-of-scope, **but** the parity audit shows capture mode and JSON mode share most of the buggy code paths:
  | Defect | Capture-mode status | Impact |
|--------|---------------------|--------|
| D1 | JSON-only (needs `sessionSummary`) | SAFE in capture mode |
| D2 | **SHARED** — same `decision-extractor.ts` path | capture mode gets free fix |
| D3 | **SHARED** — same `workflow.ts:1271-1295` folder-token appender | capture mode gets free fix |
| D4 | **SHARED** — same `frontmatter-migration.ts` writer | capture mode gets free fix |
| D5 | **SHARED** — no predecessor discovery in either mode | capture mode gets free fix |
| D6 | SHARED (historical only) | no action |
| D7 | JSON-only (literally defined as "capture mode skipped") | SAFE in capture mode |
| D8 | **SHARED** — same template | capture mode gets free fix |
  **Interpretation:** The spec scope line is still technically correct (we're not CHANGING capture mode behavior intentionally), but **release notes must mention that capture mode ALSO benefits** from PRs 3/5/6/7/1. This is good news — the 9-PR train is more impactful than originally advertised. [REFERENCE: iteration-025.md §Parity matrix]

### C.3.1 Iteration 21 — Latent Failure Mode Audit (Q18)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md`

**Focus**
Generation 3 exists to answer the question Gen-1 and Gen-2 explicitly left open: whether the JSON-mode save path still hides "unknown unknowns" after the D1-D8 root-cause map and the 9-PR rollout train were locked. That matters because a latent swallow or empty-default path can survive a defect-driven remediation program if it never manifests in the seven-file sample corpus that drove the original investigation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:217-246]

Appendix B already decomposes the confirmed work into safe landing slices, so this pass is not re-litigating D1-D8. It is stress-testing the pipeline assumptions behind that train by auditing every visible `try`/`catch`, silent sentinel, null-input guard, and empty-default path in the JSON-mode generator/workflow/extractor stack. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]

**Approach**
- Read the Gen-3 scope lock in strategy section 15, the canonical D1-D8 catalog in research section 4, and iteration 020 as the output-format baseline.
- Swept the live script tree for `catch`, `return null`, `return []`, `return ''`, `??`, `|| []`, `|| ''`, and null-guard early returns across `memory/`, `extractors/`, `core/workflow.ts`, `lib/`, and `utils/input-normalizer.ts`.
- Re-read the hot ranges in `generate-context.ts`, `workflow.ts`, `decision-extractor.ts`, `conversation-extractor.ts`, `git-context-extractor.ts`, `semantic-signal-extractor.ts`, and `input-normalizer.ts`.
- Mapped each fallback to one of three buckets: already explained by D1-D8, benign/intentional degradation, or a non-overlapping D9+ candidate.
- Treated capture-mode-only branches as out of scope unless the current JSON-mode path can actually execute them.

**Findings**
1. The only non-overlapping latent failure mode I found is operational, not content-shaping: the workflow can continue without cross-process locking after stale-lock read failures, unexpected `mkdir` errors, or timeout. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415]
2. The captured-session enrichment catches are not a current JSON-mode bug source because file-backed JSON exits that function immediately on `_source === 'file'`; they stay relevant only as a future D7 regression boundary if PR-4 accidentally reuses the captured branch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
3. `decision-extractor.ts` still has exactly one live placeholder-producing fallthrough, and it is the known D2 lexical branch guarded by `decisionObservations.length === 0 && processedManualDecisions.length === 0`. I did not find a second hidden placeholder path. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-388]
4. `input-normalizer.ts` already promotes `keyDecisions` into both `_manualDecisions` and synthesized decision observations on fast and slow paths, so the current tree does not hide a second "raw decisions were never propagated" defect behind empty defaults. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-687]
5. `semantic-signal-extractor.ts` contains a quality-degrading fallback that can bypass tech-stopword filtering when phrase count is too low, but the symptom is still the already-known D3 class (low-quality phrases), not a new defect family. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:243-255]
6. The null-input returns in `extractConversations()` and `extractDecisions()` are deliberate anti-corruption guards: they now emit empty packets instead of the older synthetic/simulated data paths. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-148] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-190]
7. Git-command failures are intentionally collapsed into an explicit `repositoryState: 'unavailable'` shape rather than silently fabricating provenance; combined with the current JSON-mode enrichment bypass, that means no second hidden D7 owner surfaced in this pass. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:99-104] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459]

**Ruled out / not reproducible**
- I did not find a second live D2-style placeholder generator beyond the already-known lexical decision fallback. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:379-388]
- I did not find a current JSON-mode path that executes the captured-session enrichment catches; the `_source === 'file'` guard blocks that route today. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-459]
- I did not find any evidence that the null-input/empty-array guards in `conversation-extractor.ts`, `decision-extractor.ts`, or `semantic-signal-extractor.ts` create a new user-visible corruption class on their own; they mostly replace older synthetic fallbacks with explicit empties. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:130-148] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-190] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-320]

**New questions raised**
- Should PR-10 harden `withWorkflowRunLock()`/filesystem-lock behavior before the 9-PR content-quality train lands, or is the concurrency risk acceptable as a separate operational follow-up?
- If PR-4 adds provenance-only JSON-mode git extraction, should `tryRunGitCommand()` continue to silently return `null`, or should JSON mode surface a structured degraded-provenance warning when git is present but unreadable?

### C.3.2 Iteration 22 — PR-7 Performance Impact Model (Q19)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md`

**Focus**
PR-7 is a save-path change, so its cost matters more than a typical background cleanup. Every extra sibling scan happens synchronously before render, and save-time latency is directly user-visible in the JSON-mode workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1151-1372]

The rollout packet already narrowed D5 to a deliberately small fix: immediate predecessor only, continuation-gated, ambiguity-safe, and isolated in a new helper. That is good for correctness, but it still means the write path must walk the current folder on every eligible save unless the implementation adds a cheap skip or cache. Measuring that now avoids shipping a "safe" lineage fix that feels slow in large memory folders. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:124-129] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:120-134]

**Approach**
- Re-read Gen-3 scope and the frozen PR-7 contract in `research.md` Appendix B and iteration 20. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:215-246] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:326-330] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:120-134]
- Re-check the continuation-signal corpus so the modeled gate matches the already-approved signal family and excludes known noisy families. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:16-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39]
- Inspect the actual workflow seam where predecessor discovery would be inserted and confirm that the current causal-link builder is pass-through only. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
- Search for existing directory-walk and frontmatter-read helpers to determine whether PR-7 can reuse a cheap primitive or would inherit full-file reads. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:550-568] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:50-82] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:224-233] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:187-233]
- Run a local macOS SSD microbenchmark on temporary folders sized from representative JSON-mode memory files (median ~28.9 KB, p95 ~50.7 KB) to estimate warm-cache wall-clock cost for 50/100/500/1000 siblings. [CITATION: NONE — local microbenchmark executed in this iteration]

**Findings**
1. PR-7's only valid insertion point is immediately before `buildCausalLinksContext()` in `workflow.ts`, because the current causal builder is a pass-through reader and does no predecessor discovery on its own. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
2. The rollout plan already assumes PR-7 will be isolated to `workflow.ts`, `memory-metadata.ts`, and a new helper file, plus dedicated 3+ sibling lineage fixtures; that keeps the performance surface narrow and measurable. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:123-134] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:326-330]
3. Existing script/MCP frontmatter readers all operate on full in-memory content; I found no reusable partial-header reader in the current path. Even the one "head-only" check in `spec-doc-health.ts` still does `readFileSync(...).slice(0, 500)`, i.e. full read first, slice second. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:50-82] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:224-233] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:187-233] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts:150-152]
4. Existing directory-scan patterns are already simple `fs.readdirSync(..., { withFileTypes: true })` passes, so the natural PR-7 implementation is linear and cheap at the folder-walk layer. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:550-568]
5. The continuation gate is selective enough to be an effective early-exit filter: iteration 14 found continuation-style hits in only 13/140 titles, and only `extended` / `continuation` were clean enough to keep. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:16-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]
6. On a local macOS SSD microbenchmark using representative JSON-mode memory sizes, the added sibling scan is ~1.4 ms at 100 files, ~7.9 ms at 500 files, and ~16.3 ms at 1000 files with full-file reads; a 2 KB header reader cuts those totals to ~1.0 ms, ~6.0 ms, and ~12.2 ms respectively. [CITATION: NONE — local microbenchmark]
7. There is no inherent `N²` cliff in the narrowed PR-7 design from iterations 6/14/20; the only realistic cliffs come from implementation drift (rescans, pairwise candidate ranking, or unnecessarily heavy per-file parsers). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-006.md:19-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-020.md:120-134]

**Ruled out / not reproducible**
- I found no evidence that the current D5 path already hides a quadratic helper. Today it does not scan for predecessors at all; it simply forwards caller-supplied `causal_links`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372]
- I found no existing low-cost script-side primitive that reads only the YAML header from disk. The closest examples all read the full file first and then parse or slice in memory. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:50-82] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts:150-152] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:187-233]

**New questions raised**
- Should PR-7 define "immediate predecessor" by timestamp-prefixed filename ordering, file mtime, or frontmatter date/session fields?
- Is it worth extracting a shared `readFrontmatterHead()` utility now so PR-7 and future reviewer/validator helpers do not keep multiplying full-file reads?

### C.3.3 Iteration 23 — Migration Strategy for Pre-fix Broken Files (Q20)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md`

**Focus**
Gen-1 deliberately treated manual repair of the original seven broken memory files as out of scope, but Gen-2 changed the scale of the problem: iteration 12 found **82 JSON-mode candidates out of 135 total memory files**, with D8 present in all 82, D4 in 81, and D3 in 52. That turns migration from an edge-case cleanup into a corpus-shaping decision for search quality, lineage trust, and user confidence in historical memories. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:61-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]

The migration question matters now because the canonical 9-PR train fixes future saves, but it does not automatically clean historical artifacts. If pre-fix and post-fix files coexist indefinitely, the memory corpus stays mixed: new saves improve while old D3/D4/D8-heavy files continue to pollute retrieval and metadata trust. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:314-328] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:142-147]

**Approach**
- Re-read Gen-3 scope and the original non-goal boundary so the migration recommendation stays additive rather than reopening Q1-Q17.
- Use iteration 12 as the population baseline for file counts, per-defect prevalence, and corpus spread.
- Inspect representative broken files to separate defects that are still recoverable from the artifact itself versus defects where source information is already lost.
- Check current remediation guidance and PR train ordering to place migration after the preventive fixes and post-save reviewer hardening.
- Search the repository for existing migration/backfill tooling to see whether a one-shot repo-wide script fits established patterns.

**Findings**
1. The migration target is materially larger than the original non-goal: 82 JSON-mode candidates across 135 memory files and 49 spec folders, so “leave history alone” is now a corpus-level decision rather than a seven-file cleanup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:61-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:47-128]
2. D8 and D4 dominate the population (82/82 and 81/82), which makes them strong candidates for mechanical migration rather than manual follow-up. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]
3. D3 is also broad and visibly mechanical: representative broken files carry path-fragment trigger phrases such as `kit/024`, `compact`, `code`, and `graph`, so a sanitizer-style cleanup is realistic. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:144-145] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:4-34]
4. D1 and D2 are not safely auto-healable from the file alone: the overview text is already cut mid-sentence and the decision titles degraded to `observation decision 1` / `user decision 1`, meaning the missing human-authored content is gone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357]
5. D7 provenance is also unrecoverable mechanically: the broken files store blank git provenance today, and writing current repo state back into historical memories would fabricate rather than restore provenance. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]
6. D5 can be backfilled only under strict ambiguity controls because the current recommendation already limits auto-supersedes to the immediate, unambiguous predecessor. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75]
7. A one-shot migration script matches existing repository practice better than an ad hoc manual sweep: there is already a frontmatter backfill CLI with dry-run/apply/report semantics and a separate bulk migration script with conflict-skipping and rewrite accounting. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:99-120] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:44-64] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:194-209]

**Ruled out / not reproducible**
- **Blind full-artifact regeneration as the default plan:** representative broken JSON-mode files keep `_sourceTranscriptPath` and `_sourceSessionId` empty, so the source material is often not addressable from the artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:55-58]
- **Blanket D5 backfill across every “extended/continuation” title:** the accepted D5 design already requires an immediate, unambiguous predecessor and ambiguity skip. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75]
- **Batch-fixing D1/D2/D7 from the current file only:** the missing source truth is not reproducible from the corrupted artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]

**New questions raised**
- Should PR-10 emit a machine-readable `skipped-ambiguous` manifest so D1/D2/D7 and ambiguous D5 candidates can be reviewed later without re-scanning the repo?

### C.3.4 Iteration 24 — Observability Hooks for Post-fix Pipeline (Q21)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md`

**Focus**
PR-9 is explicitly the guardrail PR at the tail of the 9-PR train, and iteration 19 already defined the structural reviewer contract (`CHECK-D1..D8`) that should catch the known memory-save regressions. But the live save path still runs that review only after the file is written, prints a human-readable report to stdout, and optionally applies an internal `quality_score` penalty; nothing in the current path emits an external low-cardinality production signal that an operator could alert on before users read a broken memory file. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:311-328] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-155] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419]

The minimal production-safe answer is therefore not "add full observability everywhere." It is: keep the new reviewer assertions, but also emit a compact metric/log layer at the save boundary so D1/D2/D4/D7 regressions page quickly, D3/D5/D8 drift becomes visible as warning trends, and PR-7/PR-9 overhead stays measurable. The codebase already has a reusable structured JSON logger on stderr, plus a few targeted audit events, so the missing piece is a save-pipeline telemetry catalog rather than a brand-new logging substrate. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:463-481] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:850-865] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:800-811]

**Approach**
- Re-read Gen-3 scope to keep this pass inside Q21 and anchor the recommendation to PR-9 rather than reopening the root-cause work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:215-246]
- Use iteration 19's `CHECK-D1..D8` contract as the defect-to-signal map, because that is already the frozen reviewer surface PR-9 is meant to ship. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:25-155]
- Audit the save path for real existing observability hooks: structured JSON logger, stdout review print, degradation warnings, and any currently emitted audit events. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:463-474]
- Prefer low-cardinality counters/histograms at the save boundary; keep path/title/detail payloads in structured logs only. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48]
- Treat D1/D2/D4/D7 as page-worthy because iteration 19 already classified them as HIGH reviewer failures, and keep D3/D5/D6/D8 warning-level unless they spike. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-149]

**Findings**
1. The live save boundary already has a precise injection point: Step 10.5 runs `reviewPostSaveQuality()` after file write, prints the review, and computes a score penalty, so telemetry can attach there without changing upstream extraction semantics. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1797]
2. The current reviewer is still output-only from an operator perspective: it returns structured issues in memory, but its shipped surface is stdout text plus JSON print, not a metric or alert channel. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-230] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:384-419]
3. A reusable structured logging primitive already exists and writes JSON to stderr, which is the right substrate for minimal save telemetry because it preserves stdout for CLI/data output. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:8-10] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48]
4. The scripts layer already emits low-cardinality operational events such as `contamination_audit` and `observation_truncation_applied`, so adding `memory_save_*` events is consistent with current practice rather than a new observability pattern. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:850-865] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:800-811]
5. PR-9 is intentionally scoped as the post-save reviewer upgrade at the end of the PR train, which means the telemetry set should stay guardrail-sized and defect-oriented rather than introducing a broad tracing platform in the same change. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:320-330]
6. Iteration 19 already gave a severity map for the checks: D1/D2/D4/D7 are HIGH and D3/D5/D6/D8 are MEDIUM, which naturally converts into page-vs-warn alert tiers for the new metrics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-149]

**Ruled out / not reproducible**
- Full tracing / span instrumentation in PR-9 is ruled out as the first ship vehicle; the code in scope already has a JSON logger and a narrow reviewer callsite, so counters/histograms plus structured events are the minimal fit for the stated guardrail PR. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/logger.ts:27-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:328-330]
- A server-style `/healthz` endpoint is not the preferred first healthcheck because the save path under study is a CLI/script workflow, not a resident HTTP service. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:608-611]

**New questions raised**
- Should `memory-telemetry.ts` stop at `structuredLog()` emission, or should PR-9 also define a pluggable adapter boundary for StatsD / OpenTelemetry export?
- Where should `provenance_expected` live after PR-4: derived in `workflow.ts`, or passed explicitly into the reviewer input contract?

### C.3.5 Iteration 25 — Cross-Runtime Capture-mode Parity Audit (Q22)

**Iteration source:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md`

**Focus**
The spec locked capture-mode enrichment changes out of scope, but Gen-3 still needed to verify that this was a true scope boundary rather than an untested assumption. This pass therefore audited the live OpenCode capture path that enters `runWorkflow()` as a non-file payload, trips `isCapturedSessionMode`, executes Step 3.5 enrichment, and then rejoins the shared extractor/render pipeline. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:215-246] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1116-1456] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:654-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

The result is mixed rather than absolute. Capture mode is not a clone of JSON mode: it genuinely avoids the D1 truncation owner and the D7 provenance-gate bug. But once capture data rejoins the shared pipeline, it still inherits the D2 lexical placeholder branch, the D3 trigger-phrase pollution path, the D5 missing-predecessor omission, and the D8 template anchor mismatch. D4 sits outside the audited live capture save path because the capture workflow renders directly and never enters the managed-frontmatter migration owner identified in the earlier packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:48-63] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1798]

**Approach**
- Re-read the Gen-3 charter and Q22 scope lock to keep this pass additive rather than reopening Q1-Q21. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:215-246]
- Re-read the canonical D1-D8 owner map plus APPENDIX B so each parity judgment ties back to the frozen defect definitions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:48-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:314-346]
- Re-read iteration 001 and iteration 007 to anchor the original pipeline map and the already-proven D7 capture/JSON split. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-001.md:43-73] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-007.md:6-31]
- Re-read iterations 021-024 so the Gen-3 framing, evidence style, and frozen non-goals stayed aligned. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:1-79] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:1-77] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:1-106] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:1-167]
- Trace the live capture input shape from `transformOpencodeCapture()` into `runWorkflow()`, then compare each D1-D8 owner against the actual capture-only seams (`enrichCapturedSessionData()`, Step 3.5, and the render-time `TOOL_COUNT` patch). [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1116-1456] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1316-1321]

**Findings**
1. Native OpenCode capture payloads are structurally different from JSON-mode inputs: `transformOpencodeCapture()` emits observations/prompts/files but no `sessionSummary`, which is why the D1 truncation owner is not naturally exercised in capture mode. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1425-1456] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]
2. Capture mode still shares D2 because its normalized observations are not `decision` observations, and the lexical fallback remains reachable whenever Step 3.5 does not inject manual decisions from spec context. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1317-1355] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:508-514] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-388]
3. D3 is mode-agnostic because capture mode rejoins the same trigger-phrase builder, including the post-filter folder-token append that polluted JSON-mode files. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1209-1298] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295]
4. D5 is equally shared because neither mode performs predecessor discovery before `buildCausalLinksContext()`; both only render caller-supplied lineage arrays. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1309] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236]
5. Capture mode is the **correct** side of D7: it is the only path that actually executes spec/git enrichment and propagates git provenance fields into the payload. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]
6. D8 remains fully shared because both save modes ultimately render the same template with the same `overview`/`summary` anchor mismatch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1372] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:172-183] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:330-352]
7. D4 should not be used as evidence that the live capture branch is broken the same way as JSON mode; the earlier packet localized that bug to the managed-frontmatter migration helper, while the audited capture path renders directly and skips the JSON-only review hook. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:55-55] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1311-1372] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1773-1798]

**Ruled out / not reproducible**
- I did **not** find evidence that native capture mode hits the exact D1 truncation branch on its own; the owner is keyed to `data.sessionSummary`, and the native capture normalizer does not emit that field. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1425-1456] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881]
- I did **not** find a capture-mode-specific D7 gap; the bug definition itself is "JSON skips the capture-only enrichment branch," which means capture mode is the path that already does the right work. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659]
- I did **not** find a new capture-only corruption family beyond D1-D8. The branch has extra alignment guards and enrichment degradation warnings, but not a new content-shaping defect comparable to D1/D2/D3/D5/D8. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:654-695] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:893-919]

**New questions raised**
- Should the PR-train release notes explicitly label PR-2 / PR-5 / PR-7 / PR-1 as "shared-mode" fixes so capture-mode users know they benefit too?
- Does the managed-frontmatter/backfill toolchain need its own parity audit, since D4 sits outside the live capture branch but is still mode-agnostic once historical files are rewritten?

## C.4 Additions to the PR Train

Gen 3 does NOT reorder PR-1..PR-9. It adds two optional successors:

- **PR-10 (optional, post-PR-9):** Safe-subset batch migration of 82 pre-fix files (D3/D4/D6/D8 only). Dry-run first. Rationale from iter 23. [REFERENCE: iteration-023.md]
- **PR-11 (optional, standalone, low priority):** Cross-process save lock for D9 candidate. Only if concurrent `--json` saves become a real workflow (CI/automation). [REFERENCE: iteration-021.md]

Observability metrics from iter 24 **fold into** PR-9 (same file: `post-save-review.ts`) rather than becoming a separate PR.

## C.5 Gen-3 Convergence Declaration

- **Iterations executed:** 21-25 (all 5)
- **Questions resolved:** Q18-Q22 (all 5)
- **Stop reason:** max_iterations (Gen-3 cap: 5) + all_questions_answered
- **New-info trajectory:** 0.14 → 0.36 → 0.38 → 0.27 → 0.24 (mean 0.28; lower than Gen-2's 0.37, confirming diminishing returns as expected)
- **Delegation:** 5/5 iterations via `cli-copilot gpt-5.4 reasoning_effort=high` in 3 waves (2+2+1)
- **Total cumulative research lineage:** 25 iterations · 176 findings · Gen-1 (iter 1-10) + Gen-2 (iter 11-20) + Gen-3 (iter 21-25)

## C.6 Headline Decisions

1. **Proceed with the 9-PR train from Appendix B as-is.** Gen-3 found no blocker.
2. **Add optional PR-10** (safe-subset migration) after PR-9 if stakeholders care about the 82 historical files.
3. **Add optional PR-11** (cross-process lock) only if concurrent saves become a workflow.
4. **Fold the 9 observability metrics into PR-9** — no separate PR.
5. **Update release notes** to advertise that capture mode also benefits from D2/D3/D4/D5/D8 fixes.
6. **Spec scope line stays correct** — no spec amendment needed.

## C.7 Next Step (outside this research loop)

Unchanged from Appendix B: run `/spec_kit:plan :with-phases` against this spec folder. Gen-3 is **additive evidence only**; the primary PR train is still B.4. If stakeholders want PR-10 or PR-11, add them as P4 tail-PRs in the plan.

# APPENDIX D — MASTER RECOMMENDATIONS CATALOG

## D.1 Code-level fix recommendations

### D1 — OVERVIEW truncation
- **Owner:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`.
- **Recommendation:** Replace the raw `substring(0, 500)` clamp with boundary-aware trimming that reuses the existing observation helper behavior instead of inventing a second summarization rule. [from: iter 008] [from: iter 017]
- **Implementation notes:** Keep the first PR scoped to extractor correctness; perform shared-helper extraction only after D1/D2 text surfaces stabilize. [from: iter 017]
- **Gen-3 safety/perf note:** No extra rollout safety concern surfaced beyond snapshot/fixture pinning of the suffix contract (`...` vs `…`). [from: iter 016]

### D2 — Generic decision placeholders
- **Owner:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185` and `:381-384`.
- **Recommendation:** Add raw-decision precedence hardening at the `extractDecisions()` boundary so authoritative raw arrays block the lexical placeholder branch when normalization missed. [from: iter 009] [from: iter 013]
- **Implementation notes:** Do **not** blanket-disable lexical fallback for all JSON-mode saves; degraded fallback stays valuable for malformed or decision-less payloads. [from: iter 009]
- **Gen-3 safety/perf note:** Iteration 21 found no second hidden placeholder path; the only live fallthrough remains the known lexical predicate. [from: iter 021]

### D3 — Trigger/topic garbage
- **Owner:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295` and `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`.
- **Recommendation:** Remove unconditional folder-token append, keep `ensureMinTriggerPhrases()` as the guarded low-count fallback, and apply the empirical D3 filter-list/reviewer contract from Gen-2. [from: iter 008] [from: iter 015] [from: iter 019]
- **Implementation notes:** Use narrow shape-based rules (path fragments, stopwords, ID-prefixed phrases) rather than broad semantic suppression; leave residual generic singletons to reviewer logic if needed. [from: iter 015]
- **Gen-3 safety/perf note:** Capture mode shares this defect class, so any D3 fix should be mode-agnostic and tested across both save modes. [from: iter 025]

### D4 — Importance-tier mismatch
- **Owner:** `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183` plus reviewer blind spot in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:279-289`.
- **Recommendation:** Establish an importance-tier SSOT so managed-frontmatter rewrite and bottom metadata block are emitted from the same resolved tier. [from: iter 008] [from: iter 017]
- **Implementation notes:** Treat this as a two-writer repair first, reviewer upgrade second. [from: iter 017] [from: iter 019]
- **Gen-3 safety/perf note:** D4 is population-scale in historical JSON-mode files, which is why it is a leading candidate for optional mechanical migration later. [from: iter 012] [from: iter 023]

### D5 — Missing `supersedes`
- **Owner:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372` and `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`.
- **Recommendation:** Insert predecessor discovery immediately before `buildCausalLinksContext()` and only auto-link the immediate, unambiguous predecessor when continuation evidence is strong. [from: iter 006] [from: iter 014] [from: iter 022]
- **Implementation notes:** Trust `extended` / `continuation`-style signals; exclude noisy `phase N` and `vN` families; skip on ambiguity. [from: iter 014]
- **Gen-3 safety/perf note:** Save-time latency stays acceptable under the narrowed design, but a partial-header reader would make the folder scan cheaper if corpus size grows. [from: iter 022]

### D6 — Duplicate trigger phrases
- **Owner:** unresolved active producer.
- **Recommendation:** Keep D6 out of the production PR train, replace F7 with F1 or a synthetic duplicate fixture, and use guardrail assertions to detect regressions while the real owner remains unproven. [from: iter 009] [from: iter 019]
- **Implementation notes:** The inspected workflow/indexer/render slice already deduplicates or only preserves inputs, so do not force a speculative production patch. [from: iter 009]
- **Gen-3 safety/perf note:** No hidden second owner surfaced in Gen-3, reinforcing the defer/test-only status. [from: iter 021]

### D7 — Empty git provenance
- **Owner:** capture-only enrichment gate in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659` / `:877-923`.
- **Recommendation:** Add a provenance-only JSON-mode insertion that copies `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead` via `extractGitContext()` without reusing captured-session summary/observation merging. [from: iter 008] [from: iter 018]
- **Implementation notes:** Preserve detached-HEAD behavior and existing empty-result degradation; no template or reviewer contract change is required for the core patch. [from: iter 018]
- **Gen-3 safety/perf note:** Capture mode is already correct here, so keep the change scoped to JSON-mode parity rather than capture-mode rewiring. [from: iter 025]

### D8 — Overview anchor mismatch
- **Owner:** `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`.
- **Recommendation:** Align TOC fragment, HTML `id`, and comment anchor on a single `overview` name in one template-only patch. [from: iter 008]
- **Implementation notes:** This is safe to ship first because it has no extractor or reviewer dependency. [from: iter 020]

### D9 candidate — Cross-process save-lock race
- **Owner:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-415`.
- **Recommendation:** Treat stronger cross-process save locking as an optional operational PR rather than part of the D1-D8 content-fix core. [from: iter 021]
- **Implementation notes:** The risk surface is timeout/read-error continuation, not silent content fabrication. [from: iter 021]

## D.2 Architectural recommendations

- **SaveMode enum:** Replace `_source === 'file'` overloading with an explicit save/enrichment mode because `_source` currently conflates enrichment eligibility, reviewer heuristics, and persisted source-session metadata. [from: iter 017] [from: iter 021]
- **Shared truncation helper:** Extract the existing boundary-aware narrative trim behavior into a reusable helper and let D1/D2 adopt it after the first correctness patches land. [from: iter 008] [from: iter 017]
- **Importance-tier SSOT:** Collapse the two D4 writers into one authoritative tier-resolution surface before broadening reviewer assertions. [from: iter 005] [from: iter 017]
- **Partial-header file reader:** If PR-7 lands, add a small primitive that reads just the frontmatter/header slice instead of full-file content for sibling scans. No reusable helper exists today. [from: iter 022]

## D.3 Testing recommendations

- **Eight fixtures (F-AC1..F-AC8):** Adopt the Gen-2 fixture catalog directly; it already maps one payload/harness shape per acceptance criterion. [from: iter 016]
- **AC-1 ellipsis pinning:** Decide whether the product standard is ASCII `...` or Unicode `…` before freezing D1 snapshots. [from: iter 016]
- **3+ memory-folder lineage fixture:** Use a folder with at least three sibling memories to prove D5 immediate-predecessor gating and ambiguity skip. [from: iter 016] [from: iter 020]
- **Degraded-payload D2 fixture:** Keep one fixture with raw `keyDecisions` plus decision-like prompts but missing normalized carriers to prove precedence hardening works without removing degraded fallback behavior. [from: iter 009] [from: iter 013]
- **Stubbed git seam for F-AC6:** Test D7 through a harness-controlled git seam rather than live repo state. [from: iter 016] [from: iter 018]

## D.4 Rollout recommendations

- **9-PR train:** Preserve the Gen-2 rollout as the mainline landing sequence, with template-only and single-owner fixes first, behavior-sensitive heuristics later, and reviewer guardrails last. [from: iter 020]
- **Dependency DAG + rollback:** Keep the explicit DAG and rollback notes from iter 20 so D4/D7/D5 do not drag refactor work in prematurely. [from: iter 020]
- **PR-10 optional migration:** If historical repair is desired, restrict it to the safe subset (D8/D4 and maybe D3) and keep it outside the core train. [from: iter 023]
- **PR-11 optional save lock:** If concurrency pressure is real, add a dedicated cross-process lock hardening PR after the core quality fixes. [from: iter 021]

## D.5 Operational recommendations

- **Telemetry metrics:** Fold nine low-cardinality save-quality metrics into PR-9 rather than creating a broad tracing initiative. [from: iter 024]
- **Alert rules:** Page on M4 > 0, warn on M6 > 5/hour, and warn on M9 p95 > 500 ms. [from: iter 024]
- **Release notes update:** When parity fixes ship, document that D2/D3/D5/D8 are shared save-path defects while D7 was JSON-mode-specific. [from: iter 025]
- **Spec scope line:** Capture-mode audit confirmed the spec boundary remains valid; no spec-scope amendment is needed just because the shared defects cross modes. [from: iter 025]

## D.6 Deferred / not recommended

- **D6 stays test-only:** Keep it out of production scope until a live owner is found. [from: iter 009] [from: iter 012]
- **No auto-migration for D1/D2/D5/D7:** These defects are unrecoverable or too ambiguity-sensitive to repair safely from file content alone. [from: iter 023]
- **Reject wholesale reuse of `enrichCapturedSessionData()` for D7:** It pulls in decisions/observations/trigger phrases and would contaminate JSON-mode saves while solving provenance. [from: iter 009] [from: iter 018]
