# Research Strategy

## Topic
Identify concrete, implementable improvements to the generate-context.js pipeline that eliminate silent field drops and data mutations, prevent hallucinated content in output, maximize trigger phrase quality for MCP search discoverability, ensure YAML frontmatter validity and semantic accuracy, and strengthen error resilience and validation coverage.

Full CRAFT prompt: `prompts/flawless-json-memory-pipeline-research.md`

## Key Questions (remaining)
- [x] Q1: (ANSWERED Iter A6) Full priority chain mapped -- see Answered Questions below.
- [x] Q2: (ANSWERED Iter A7) Exhaustive V-rule gap analysis completed -- see Answered Questions below.
- [x] Q3: (FULLY ANSWERED Iter 6-A10) Runtime uses extractors/quality-scorer.ts (V2), NOT core scorer. Bonus system (+0.20) fully compensates any single penalty, making quality_score effectively always 1.00. Core scorer is dead code. Test suite tests the wrong scorer. See Answered Questions.
- [x] Q4: (ANSWERED Iter 1-A3) Trigger phrase effectiveness analyzed -- see Answered Questions below.
- [x] Q6: What session-types.ts fields are never consumed by templates, and what template placeholders have no data source? How does the dedup/causal system prevent cross-session contradictions?
- [x] Q7: (ANSWERED Iter A8) Contamination filter scope fully mapped -- see Answered Questions below.
- [x] Q8: (ANSWERED Iter A8) projectPhase override missing -- see Answered Questions below.
- [x] Q9: (ANSWERED Iter A9) Complete 5-stage chain: (1) input-normalizer.ts:430-434 entry, (2) _manualTriggerPhrases stored both fast/slow paths, (3) SemanticSignalExtractor n-gram depth 4 auto-extraction at workflow.ts:976, (4) dual merge at workflow.ts:980 (prepend priority) + memory-indexer.ts:116 (append fallback), (5) frontmatter-editor.ts:83 renders YAML. Manual phrases survive via RC2 fix with priority position.
- [x] Q10: (FULLY ANSWERED Iter 6-A10) Full retry infrastructure exists (retry-manager.ts): 5min background job, 3 retries with backoff, circuit breaker. RetryStats tracks pending/retry/failed/success counts. BUT stats are NOT surfaced through any MCP tool -- no user-visible monitoring. See Answered Questions.
- [x] Q11: (CONFIRMED Iter A6) On the fast path, `filesModified` is silently dropped when `userPrompts` is present -- fast path (line 437) never checks `filesModified`. Only `FILES` array survives.
- [x] Q12: (ANSWERED Iter A7) Unknown fields silently dropped -- see Answered Questions below.
- [x] Q13: (ANSWERED Iter A7) V12 degrades under 3 conditions -- see Answered Questions below.

## Answered Questions
- [x] Q3 (partial): Penalty weights (high=0.25, medium=0.15, low=0.05) are structurally correct but functionally ineffective. High-severity penalties never fire at scoring time because those rules block file writing. The bonus system (+0.05 messages, +0.05 tools, +0.10 decisions = +0.20) fully compensates for any single low or medium penalty, meaning most V-rule failures are invisible in the final score. Evidence: sampled memory with `quality_flags: ["insufficient_capture"]` still has `quality_score: 1.00`.
- [x] Q5 (partial, re: description trust): Description trust multipliers exist ONLY in the legacy `core/quality-scorer.ts` (not in the extractors scorer). If the pipeline uses the "preferred" extractors scorer, description quality has zero weight.
- [x] Q5 (fully answered, iter A4): 7 synthesis points identified: contextType detection, importanceTier heuristic, projectPhase (always RESEARCH in JSON mode), nextAction fallback ("Continue implementation"), session status keyword matching, learning summary narration, key topics extraction. Contamination filter has 29 patterns (not 74). Filter only applies to observations + SUMMARY, missing sessionSummary/keyDecisions/nextSteps/blockers/recentContext fields. 7 missing contamination categories: hedging, conversational acknowledgment, meta-commentary, instruction echoing, markdown artifacts, safety disclaimers, redundant certainty markers.
- [x] Q6 (fully answered, iter A5): 9 OPTIONAL_PLACEHOLDERS now have data sources (memory classification + session dedup) but warnings still suppressed -- stale suppression. 8 session integrity placeholders have zero data sources (phantom V2.2). 15+ CollectedDataBase fields (notably toolCalls, exchanges) ingested but never rendered -- semantic quality loss. Cross-session dedup is entirely AI-dependent with no automated verification: no fingerprint comparison, no MCP query, no contradiction detection. Causal links are pass-through with no graph validation. Observation dedup is intra-document only. V12 topical coherence is the sole cross-reference check but only validates alignment, not contradiction.
- [x] Q7 (fully answered, Iter A8): filterContamination called in exactly ONE place (workflow.ts:548-602), applied only to observations + SUMMARY. Fields that bypass cleaning: `_JSON_SESSION_SUMMARY` (CRITICAL -- raw sessionSummary used as title candidate), `_manualDecisions` (uncleaned clone preserved alongside cleaned observation version), `recentContext` (CRITICAL -- learning/request strings passed through entirely uncleaned), `technicalContext` (KEY/VALUE strings never cleaned). nextSteps and blockers are LOW risk because they derive from already-cleaned observations.
- [x] Q8 (fully answered, Iter A8): projectPhase has NO explicit override mechanism unlike contextType (has explicitContextType param) and importanceTier (has resolveImportanceTier). detectProjectPhase returns 'RESEARCH' when toolCounts total=0, which is always true in JSON mode. Impact: incorrect PROJECT_PHASE in frontmatter, wrong phase in context summary narrative, misleading MCP search results. Fix: add resolveProjectPhase() following the established contextType/importanceTier pattern.
- [x] Q1 (fully answered, Iter A6): Two-path architecture in input-normalizer.ts: fast path (line 437, triggered by userPrompts/observations/recentContext) clones input and backfills missing arrays but DROPS filesModified; slow path converts filesModified to FILES. Enrichment (workflow.ts:268-390) only runs for _source !== 'file' -- JSON file input bypasses all enrichment. Template assembly uses JS spread: sessionData (base) < conversations (overlay, TOOL_COUNT:0 overwrite bug) < workflowData < explicit overrides. SUMMARY has three-way merge: collect-session-data synthesis, enrichment conditional replace/append, contamination double-pass. sessionSummary feeds _JSON_SESSION_SUMMARY for title + completion heuristic, not template SUMMARY directly.
- [x] Q11 (fully confirmed, Iter A6): When both userPrompts and filesModified present, fast path activates (line 437) and filesModified silently dropped -- never checked, never converted. Only pre-formatted FILES array entries survive.
- [x] Q2 (fully answered, Iter A7): Exhaustive V-rule gap analysis: V1 misses TBD outside 4 hardcoded fields; V2 ignores N/A when tool_count=0; V3 misses empty/nonexistent spec_folder; V4 catches only one exact phrasing; V5 checks quantity not quality; V6 has 8 hardcoded patterns; V7 misses inverse contradiction; V8 ancestor allowance over-permissive; V9 passes meaningless non-generic titles; V10 skips when min=0; V11 only checks metadata not body; V12 degrades under 3 conditions. 3 additional failure modes: (A) duplicate_observations flag orphaned, (B) YAML syntax never validated (regex not parser), (C) short_content flag orphaned. 5 soft failures = 95% score.
- [x] Q12 (fully answered, Iter A7): RawInputData index signature `[key: string]: unknown` silently accepts unknown fields. validateInputData checks ~12 known fields but never detects unknown/typo'd keys. No warning, no log. TODO(O3-12) acknowledges debt.
- [x] Q13 (fully answered, Iter A7): V12 degrades to no-op under 3 conditions: (1) empty spec_folder, (2) path.resolve(specFolder, 'spec.md') fails (most common -- relative paths + wrong CWD), (3) spec.md has no trigger_phrases. No semantic similarity, only substring match.
- [x] Q3 (fully answered, Iter 6-A10): Runtime uses extractors/quality-scorer.ts (imported as scoreMemoryQualityV2 at workflow.ts:39, invoked line 1205). Core/quality-scorer.ts is dead code. Bonus system (+0.20 max) fully compensates any single penalty. quality_score effectively 1.00 for all real sessions. Vitest calibration tests wrong scorer (core/ import). JS integration test correct (extractors/).
- [x] Q10 (fully answered, Iter 6-A10): Full retry infrastructure at retry-manager.ts. 5min background job, batch 5, max 3 retries, backoff 1/5/15min, circuit breaker after 5 failures. getRetryStats() exists but NOT exposed through any MCP tool. No user-visible monitoring.
- [x] Q-ADV (adversarial, Iter 6-A10): Empty {} with CLI spec-folder produces useless memory. No length limits anywhere. triggerPhrases unsanitized (search pollution risk). importanceTier validates enum correctly. contextType has NO validation. Duplicate observations pass through. Index signature accepts unknown fields silently.
- [x] Q4 (fully answered, Iter 1-A3): Auto-extracted trigger phrases dominated by path fragments ("system spec kit/022 hybrid rag fusion/005 architecture audit"), n-gram shingles ("roots contribute identical files"), generic tokens ("and missing", "audit"). Real files: 15-30 phrases; manually curated: 5 precise. Post-save-review catches only single-token fragments. Binary trigger matching (score=1.0) loses quality signal. 4-channel ranking (vector/BM25-FTS5/graph/degree) via adaptive RRF. Trigger phrases affect BM25/FTS5+trigger channels only. Pending-embedding memories invisible to vector search.

## What Worked
- Iter 1: Side-by-side comparison of all three quality subsystems (core scorer, extractors scorer, post-save review) revealed structural inconsistencies invisible in isolation
- Iter 1: Sampling actual memory files to ground-truth the scoring output against frontmatter metadata
- Iter A5: End-to-end data flow tracing (session-types.ts -> memory-metadata.ts -> workflow.ts spread -> template-renderer.ts OPTIONAL_PLACEHOLDERS) revealed both supply-side and demand-side gaps systematically

- Iter A4: Direct source reading of contamination-filter.ts + session-extractor.ts was highly productive; well-structured code with JSDoc made synthesis points easy to enumerate. Glob resolved incorrect dispatch paths quickly.
- Iter 1-A3: Sampling 5 real memory files and comparing auto-extracted vs. manually-curated trigger phrases -- clearest evidence of pollution problem
- Iter 1-A3: Reading post-save-review.ts PATH_FRAGMENT_PATTERNS to understand detection coverage gaps (multi-token paths missed)
- Iter 1-A3: Save handler pipeline README + trigger matcher grep revealed binary scoring and deferred indexing invisibility
- Iter A1: Reading input-normalizer.ts end-to-end exposed the two-path (fast/slow) architecture as root cause of most silent field drops. Asymmetry not visible from types alone.
- Iter A8: Tracing the single filterContamination call site in workflow.ts immediately revealed the scope boundary. Comparing contextType/importanceTier override patterns against projectPhase absence provided clean structural proof of the missing override.
- Iter A6: Deep reading of workflow.ts lines 268-1099 in a single pass covered enrichment + template assembly chain completely. Spread operator analysis (sessionData < conversations < workflowData < explicit overrides) was the key to understanding override priorities.
- Iter A7: Full-file read of validate-memory-quality.ts (731 lines) enabled exhaustive V-rule analysis in one pass. Cross-referencing QualityFlag type definitions against quality-scorer.ts flag mappings revealed orphan flags (duplicate_observations, short_content) that no V-rule activates. Reading validateInputData confirmed no Object.keys() iteration for unknown field detection.
- Iter 6-A10: Import chain tracing (generate-context.ts:25 -> workflow.ts:39 -> extractors/quality-scorer.ts) was definitive for Q3 -- 3 lines of imports proved which scorer runs. Following retryManager import chain revealed complete retry infrastructure. Static validation analysis for adversarial cases was efficient: each absence of a check is itself a finding.

## What Failed
- Iter 1: Initial file path guess for quality-scorer.ts was wrong (lib/ vs core/); resolved with Grep fallback

- Iter A4: Dispatch referenced lib/contamination-filter.ts which does not exist; actual path is extractors/contamination-filter.ts
- Iter A1: Could not read workflow.ts deeply enough (200-line limit) to trace enrichment phase.
- Iter 1-A3: memory-frontmatter.ts does not exist at renderers/ path -- actual renderer/template location unknown (gap in trigger phrase chain tracing)

## Exhausted Approaches (do not retry)
[None yet]

## Next Focus
Final iteration completed (6 of 6). All 13 original questions answered plus adversarial edge case analysis. Q9 was answered by A9 (5-stage trigger phrase chain). Synthesis should proceed with all questions resolved.

## Known Context
No prior memory context found. Prior deep-research round (3 iterations, 21 findings) exists in scratch/archive-round-1/ but targeted the abandoned hybrid-enrichment design. Key findings from that round that may still be relevant:
- CRITICAL: Shallow copy mutation in enrichFileSourceData leaks to callers
- CRITICAL: Manual-normalized path drops session/git blocks entirely
- CRITICAL: Zero test coverage for session/git JSON payload contract
- HIGH: 13 unnecessary `as Record` casts defeat type safety
- HIGH: Status/percent contradictions preserved (COMPLETED+30%, BLOCKED+100%)

## Research Boundaries
- Max iterations: 6
- Convergence threshold: 0.05
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Reference-only modes: `:restart`, segment partitioning, wave pruning, checkpoint commits, alternate `claude -p` dispatch
- Current segment: 1
- Started: 2026-03-21T17:12:00.000Z
