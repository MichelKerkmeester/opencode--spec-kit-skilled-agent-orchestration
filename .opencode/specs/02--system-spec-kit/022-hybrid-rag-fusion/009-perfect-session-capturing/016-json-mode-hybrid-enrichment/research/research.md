# Research: Flawless JSON Memory Capturing Pipeline

## Research Metadata

| Metric | Round 1 (Archived) | Round 2 (Current) |
|--------|--------------------|--------------------|
| Date | 2026-03-20 | 2026-03-21 |
| Method | 3 GPT-5.4 agents x 3 iterations | 10 Claude Opus 4.6 agents x 2 waves |
| Findings | 21 (archived design) | 74 (shipped pipeline) |
| Questions | 8/8 answered | 13/13 + adversarial answered |
| Convergence | entropy 1.00 >= 0.85 | all questions answered, newInfoRatio declining 0.90->0.81 |
| Target | Abandoned hybrid-enrichment design | **Shipped generate-context.js pipeline** |

---

## Executive Summary

This research investigated the shipped generate-context.js pipeline across 6 domains using 10 agents in 2 waves. The investigation found **74 concrete issues** with source-level citations, organized into 5 severity tiers. The most impactful findings:

1. **Quality scoring is effectively binary** — the bonus system (+0.20) fully compensates any combination of soft penalties, making `quality_score` always ~1.00 for real sessions
2. **Contamination filter covers only 2 of 8+ text fields** — `sessionSummary`, `keyDecisions`, `recentContext`, `technicalContext` bypass all cleaning
3. **15+ AI-composed fields are ingested but never rendered** — `toolCalls`, `exchanges`, and other rich data silently discarded
4. **Trigger phrases dominated by noise** — auto-extraction produces 15-30 phrases per memory, mostly path fragments and n-gram shingles
5. **No cross-session contradiction detection** — dedup is AI-dependent with zero automated verification

---

## Prioritized Recommendations

### P0 — CRITICAL (Should fix immediately)

| # | Finding | Domain | Source | Effort |
|---|---------|--------|--------|--------|
| 1 | Extend contamination filter to `_JSON_SESSION_SUMMARY`, `_manualDecisions`, `recentContext`, `technicalContext` | E | workflow.ts:548-602 | Medium (20-30 LOC) |
| 2 | Recalibrate or remove bonus system in extractors scorer — quality_score has zero discriminative power | C | extractors/quality-scorer.ts:113-205 | Medium |
| 3 | Fix fast-path `filesModified` drop — add conversion to `FILES` array on fast path | A | input-normalizer.ts:437-491 | Small (10 LOC) |
| 4 | Surface `RetryStats` through `memory_health` MCP tool for embedding visibility monitoring | D | retry-manager.ts:86-233 | Medium |
| 5 | Fix Vitest calibration tests to import extractors scorer (not dead-code core scorer) | C | quality-scorer-calibration.vitest.ts:5 | Small (1 LOC) |

### P1 — HIGH (Should fix in next sprint)

| # | Finding | Domain | Source | Effort |
|---|---------|--------|--------|--------|
| 6 | Add `resolveProjectPhase()` explicit override following contextType/importanceTier pattern | E | session-extractor.ts:188-207 | Medium (30 LOC) |
| 7 | Add trigger phrase quality filtering — suppress path fragments, n-gram shingles, generic tokens | D | workflow.ts:940-1018 | Medium |
| 8 | Add template consumption for `toolCalls` and `exchanges` fields | F | session-types.ts, workflow.ts | Large (new template section) |
| 9 | Add unknown-field warnings in `validateInputData` for typo detection | B | input-normalizer.ts:621-703 | Small (15 LOC) |
| 10 | Add YAML frontmatter syntax validation (use YAML parser, not regex) | B | validate-memory-quality.ts:183-191 | Medium |
| 11 | Add minimum content density V-rule (reject trivially short memories) | B | validate-memory-quality.ts | Small (15 LOC) |
| 12 | Add `contextType` enum validation (currently accepts any string) | B | input-normalizer.ts:602-606 | Small (5 LOC) |

### P2 — MEDIUM (Track for improvement)

| # | Finding | Domain | Source | Effort |
|---|---------|--------|--------|--------|
| 13 | Remove 8 phantom V2.2 placeholders that have zero data sources | F | template-renderer.ts OPTIONAL_PLACEHOLDERS | Small |
| 14 | Un-suppress 9 OPTIONAL_PLACEHOLDERS that now have active data sources | F | template-renderer.ts | Small |
| 15 | Add string length limits to validation (sessionSummary, triggerPhrases, observations) | B | input-normalizer.ts:621-703 | Small |
| 16 | Add post-save review check for trigger phrase quality (not just path fragments) | D | post-save-review.ts | Medium |
| 17 | Add V12 path normalization so relative spec_folder names don't cause silent degradation | B | validate-memory-quality.ts:612-650 | Small |
| 18 | Add observation array dedup at normalization time (not just intra-document rendering) | F | input-normalizer.ts | Medium |
| 19 | Add status/percentage contradiction detection V-rule | B | validate-memory-quality.ts | Medium |
| 20 | Feed post-save review findings back into numeric quality score | C | post-save-review.ts + extractors/quality-scorer.ts | Medium |

---

## Domain Findings

### Domain A: Pipeline Data Integrity (Steps 1-6)

**Q1 ANSWERED**: Complete field propagation map through load→normalize→enrich.

**Two-path normalizer architecture** (input-normalizer.ts:414-530):
- **Fast path**: Triggered when `userPrompts`, `observations`, or `recentContext` present. Handles 11 field families. **Silently drops `filesModified`** (only converted to `FILES` on slow path).
- **Slow path**: Full conversion of legacy fields (`sessionSummary` → observation, `filesModified` → `FILES`).
- `sessionSummary` is NOT truly dropped on fast path — survives via index signature, consumed as `_JSON_SESSION_SUMMARY` downstream.

**Enrichment priority chains** (workflow.ts:268-390): Only for runtime-captured sessions (`_source !== 'file'`). JSON file mode bypasses ALL enrichment by design.

| Field Category | Merge Strategy | Priority |
|----------------|---------------|----------|
| `observations` | APPEND | Existing first, enrichment appended |
| `FILES` | DEDUPLICATE-APPEND | Existing wins on path collision |
| `_manualTriggerPhrases` | PREPEND | Enrichment first |
| `SUMMARY` | CONDITIONAL REPLACE/APPEND | Explicit > spec > git |
| Git metadata | OVERWRITE | Git enrichment wins |

**Template assembly bug**: `conversations` spread includes `TOOL_COUNT: 0` which overwrites `sessionData.TOOL_COUNT`. Only patched for captured-session mode (workflow.ts:1040).

[Sources: input-normalizer.ts:414-530, workflow.ts:268-390,1031-1099, collect-session-data.ts:354-990]

---

### Domain B: Schema & Validation Completeness (Steps 1, 8, 9)

**Q2 ANSWERED**: Exhaustive V-rule gap analysis with 6+ uncovered failure modes.

**No formal JSON Schema** — validation is ad-hoc in `validateInputData()` (input-normalizer.ts:621-703). The `RawInputData` index signature `[key: string]: unknown` accepts any field silently. Typos like `"sesionSummary"` are accepted and silently dropped.

**V-Rule Coverage Map** (validate-memory-quality.ts:42-650):

| Rule | Catches | Key Gap |
|------|---------|---------|
| V1 (HIGH) | `[TBD]` placeholders in 4 hardcoded fields | Other patterns (`[TODO]`, `{{var}}`), only 4 fields checked |
| V3 (HIGH) | Malformed spec_folder with `*`, `**`, `[` | Empty string, trailing slashes, nonexistent directories |
| V5 (LOW) | Empty trigger_phrases when tool_count >= 5 | Generic 1-2 token phrases pass; quality not checked |
| V8 (HIGH) | Foreign spec IDs dominating content | Ancestor allowance too permissive; non-spec-numbered drift undetected |
| V9 (HIGH) | 4 title contamination patterns | Meaningless titles ("Session Notes", "Work Done") pass |
| V12 (MED) | Zero topical overlap via substring matching | **Degrades to no-op when spec_folder is relative** (3 conditions) |

**Uncovered failure modes** (no V-rule catches):
1. YAML frontmatter syntax invalidity (regex parser, not YAML parser)
2. Duplicate observations (quality flag exists, no V-rule triggers it)
3. Trivially short content (quality flag exists, no V-rule triggers it)
4. Status/percentage contradictions (`COMPLETED+30%`, `BLOCKED+100%`)
5. Post-render `importance_tier` invalid values
6. `contextType` accepts any string (no enum validation)

[Sources: validate-memory-quality.ts:42-650, input-normalizer.ts:621-703, session-types.ts:293-295]

---

### Domain C: Quality Scoring Accuracy (Step 8)

**Q3 ANSWERED**: Runtime scorer definitively identified; bonus system makes score non-discriminative.

**Dual scorer architecture** — workflow.ts:39 imports `extractors/quality-scorer.ts` (V2). The `core/quality-scorer.ts` is **dead code** in the runtime pipeline. However, `quality-scorer-calibration.vitest.ts` tests the WRONG (core) scorer, creating misleading test coverage.

**Bonus system makes quality_score useless**:
- Starting score: 1.00
- Bonuses: +0.05 messages, +0.05 tools, +0.10 decisions = **+0.20 max**
- HIGH-severity penalties (0.25) never reach scorer (they block writes first)
- Maximum reachable penalty: MEDIUM (0.15) — fully compensated by any 2 bonuses
- **5 simultaneous soft failures + all bonuses = 0.95** (effectively perfect)
- Real-world quality_score: nearly always 1.00

**Description trust multipliers are legacy-only**: The tiered system (placeholder/activity-only/semantic/high-confidence with provenance multipliers) exists only in the dead-code core scorer. The active extractors scorer has no description quality concept.

[Sources: workflow.ts:39,1205-1216, extractors/quality-scorer.ts:113-205, core/quality-scorer.ts:124-127]

---

### Domain D: Indexing & Crawlability (Steps 10, 10.5, 11)

**Q4, Q7-Q10 ANSWERED**: Trigger phrase lifecycle fully traced; embedding monitoring gaps identified.

**Trigger phrase 5-stage lifecycle** (Q9):
1. JSON entry → input-normalizer.ts:430-435 (accepts camelCase/snake_case)
2. Storage → `_manualTriggerPhrases` on both fast/slow paths
3. Auto-extraction → workflow.ts:940-976, delegates to SemanticSignalExtractor with n-gram depth 4
4. Merge → **TWO merge points**: workflow.ts:980-988 (manual prepended for frontmatter) + memory-indexer.ts:104-137 (redundant merge for vector index)
5. Rendering → memory-metadata.ts:266,285 → frontmatter-editor.ts:83-88

**Manual phrases DO survive** (RC2 fix). But auto-extraction produces 15-30 noisy phrases that **dilute** the 5 precise manual phrases. Real memory files show path fragments ("system spec kit/022 hybrid rag fusion"), n-gram shingles ("roots contribute identical files"), and generic tokens ("and missing") dominating.

**Post-save review catches only single-token fragments** — multi-token path slugs pass undetected.

**Embedding visibility**: Full retry manager exists with circuit breaker (retry-manager.ts:86-233). Background job every 5 minutes, max 3 retries, exponential backoff. But `RetryStats` not surfaced through any MCP tool — no user-facing way to detect vector-invisible memories.

[Sources: input-normalizer.ts:430-451, workflow.ts:940-1018, memory-indexer.ts:104-137, retry-manager.ts:86-233, post-save-review.ts]

---

### Domain E: Hallucination & Error Prevention (Steps 5, 7, 8)

**Q5, Q7, Q8 ANSWERED**: 7 synthesis points mapped; contamination filter scope gap is critical.

**7 content synthesis points** (hallucination vectors):
1. `contextType` detection — defaults to 'general' in JSON mode (overridable via RC5)
2. `importanceTier` heuristic — keyword matching in file path segments (overridable)
3. `projectPhase` — **always 'RESEARCH' in JSON mode** (NOT overridable, no `resolveProjectPhase()`)
4. `nextAction` fallback — hardcoded "Continue implementation" when no pattern match
5. Session status keyword matching — broad regex can hallucinate 'COMPLETED' from casual mentions
6. Learning summary narration — entirely synthesized text from numeric deltas
7. Key topics extraction — aggressive stopword removal may lose domain terms

**Contamination filter scope** (workflow.ts:548-602):
- **Only 29 actual patterns** (6 categories), not 74 as documented
- Applied to **only 2 field categories**: observations (title, narrative, facts) + SUMMARY
- **CRITICAL gaps**: `_JSON_SESSION_SUMMARY` used as title candidate without cleaning; `recentContext` entirely uncleaned; `_manualDecisions` preserves uncleaned originals; `technicalContext` KEY/VALUE never cleaned

**7 missing contamination categories**: hedging, conversational acknowledgment, meta-commentary, instruction echoing, markdown artifacts, safety disclaimers, redundant certainty markers.

[Sources: session-extractor.ts:119-207,289-297, collect-session-data.ts:279-399, contamination-filter.ts, workflow.ts:548-602]

---

### Domain F: Semantic Quality & Cross-Session Coherence (Steps 7, 10)

**Q6 ANSWERED**: Significant template consumption gaps and zero automated cross-session verification.

**Template field consumption gaps**:
- **9 stale OPTIONAL_PLACEHOLDER suppressions**: Memory Classification + Session Dedup placeholders now have data sources but warnings still suppressed
- **8 phantom V2.2 placeholders**: Session integrity check placeholders have zero construction sites — always render as empty strings
- **15+ CollectedDataBase fields never rendered**: `toolCalls` (ToolCallSummary[]), `exchanges` (ExchangeSummary[]), and pipeline-internal flags ingested but discarded

**Cross-session coherence** — entirely AI-dependent:
- `buildSessionDedupContext()` creates SHA1 fingerprint but **never compares** against existing memories
- `similar_memories` from AI input passed through without validating referenced IDs exist
- Causal links (`CAUSED_BY`, `SUPERSEDES`, etc.) passed through with **no graph validation** — no cycle detection, no existence checks
- Observation dedup is **intra-document only** — cross-memory duplication undetected
- V12 topical coherence is the **sole automated cross-reference** but only checks alignment, not contradiction

[Sources: session-types.ts, template-renderer.ts, workflow.ts, memory-metadata.ts, memory-indexer.ts]

---

### Adversarial Edge Cases

| Input | Behavior | Risk |
|-------|----------|------|
| Empty payload `{}` + CLI spec-folder | Valid but useless memory written | Medium — no minimum content validation |
| 100KB sessionSummary | Passes silently | Medium — no string length limits |
| 10,000 triggerPhrases | Passes silently | Low — no array size limits |
| Path traversal in triggerPhrases | Passes to YAML frontmatter | Low for code execution, HIGH for search pollution |
| Invalid contextType string | Accepted, propagated as-is | Low — no enum validation |
| 50 duplicate observations | All 50 rendered | Medium — no input-level dedup |
| importanceTier as number | **Correctly rejected** | None — validation works |

[Sources: input-normalizer.ts:621-703]

---

## Convergence Report

- **Stop reason**: All questions answered (13/13 + adversarial)
- **Total iterations**: 10 agents across 2 waves
- **Questions answered**: 13/13 original + 6 adversarial sub-questions
- **Wave 1 avg newInfoRatio**: 0.90 (foundation discovery)
- **Wave 2 avg newInfoRatio**: 0.81 (targeted gap-filling)
- **Convergence threshold**: 0.05 (not reached via ratio, stopped via question coverage)

---

## Round 1 Archive Note

Round 1 (2026-03-20) analyzed the abandoned hybrid-enrichment design with 3 GPT-5.4 agents across 3 iterations, producing 21 findings. Those findings are **historical only** and archived in `scratch/archive-round-1/`. Do not cite Round 1 findings as evidence about the shipped pipeline. See `scratch/archive-round-1/` for the original research artifacts.
