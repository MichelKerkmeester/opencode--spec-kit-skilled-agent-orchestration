# Research: Session Capturing Pipeline Improvements

> **Spec**: `010-perfect-session-capturing` | **Date**: 2026-03-16
> **Method**: 10 GPT-5.4 research agents (high reasoning) via cli-copilot in 3 waves + 1 GPT-5.4 agent (xhigh reasoning) via cli-codex + 1 Claude Opus 4.6 analysis + 1 Claude Opus 4.6 verification pass
> **Scope**: Retrospective review + prospective improvement analysis of the session capturing pipeline
> **Status**: Complete — 13 research items documented, R-12 fixes implemented, R-13 adds auto-detection + quality regression analysis + candidate competition trace + per-issue R-series mapping + blocker extraction bug (NEW)

---

## Executive Summary

The session capturing pipeline is architecturally sound after 35+ files modified and 8 gaps closed, but deep analysis reveals **systemic duplication, contract misalignment, coverage gaps, a critical source-of-truth integrity failure, template compliance enforcement gaps, and spec folder auto-detection fragility** that will compound as the system scales. The 13 research items identified improvements across 7 themes:

1. **Contract consolidation** — Dual quality scorers on different scales (R-01), 4 overlapping topic extractors (R-08), inconsistent type ownership (R-04), and divergent description validators (R-06) create maintenance burden and subtle behavioral drift.

2. **Data fidelity** — Lossy normalization drops file metadata before extractors see it (R-03), object-based facts silently vanish in multiple extractors (R-03), and manual decision enrichment is created then ignored (R-03). Contamination detection has gaps for low-volume cross-spec content (R-02).

3. **Semantic richness** — Single-field confidence conflates choice and rationale certainty (R-05), phase classification is rule-based without topic awareness (R-07), and embeddings are flat content without signal weighting (R-09).

4. **Verification** — Post-write orchestration (description tracking, indexing, retry) has no end-to-end test coverage (R-10), and the real gate chain runs only under heavy mocks.

5. **Source-of-truth integrity** — The pipeline can select the wrong session transcript entirely (R-11). Transcript resolution uses filesystem `mtime` instead of session identity, and all downstream validators check spec affinity (same folder) but not session identity (same conversation). A real-world failure produced a memory file rated `quality_score: 1.00` from the wrong session's data.

6. **Template compliance enforcement** — External agents deviate from templates because validation checks syntax (anchors balanced) not semantics (correct headers, correct anchors, correct format) (R-12). New `TEMPLATE_HEADERS` rule and required-anchor extension close this gap.

7. **Spec folder auto-detection fragility** — The folder detection cascade fails when working on parent folders with many children (depth-bias), when spec folders are new (no session DB entries), and when multiple sessions target the same spec folder (mtime confusion). Git status and session transcript signals are available but unused (R-13). Combined with R-11's wrong transcript selection, these failures produce memory files where 83% of R-series issues manifest simultaneously.

---

## Priority Matrix

### P0 — High Impact, High Risk (address first)

| # | Improvement | Source | Effort | Risk if Deferred |
|---|---|---|---|---|
| 0 | **Session source validation** — Replace `mtime`-based transcript selection with `expectedSessionId`-first resolution; add V10 validator for same-spec wrong-session mismatch; add contamination score penalty | R-11 | Medium | **Data integrity failure at pipeline entry** — wrong session captured, indexed, and rated as high quality |
| 1 | **Unify quality scorer contract** — Make `score01` canonical, keep `score100` for compatibility, migrate abort threshold | R-01 | Medium | Scale mismatch causes silent fidelity loss in frontmatter |
| 2 | **Preserve file metadata through normalization** — Stop flattening `ACTION`, `_provenance`, `_synthetic` in `input-normalizer.ts` | R-03 | Low | Permanent data loss at pipeline entry point |
| 3 | **Add workflow E2E test** — Real gate chain with explicit JSON → write → description tracking → index boundary | R-10 | Medium | Post-write bugs undetectable until production |
| 4 | **Canonicalize type ownership** — Move `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` into `types/session-types.ts` | R-04 | Low | Schema drift hidden by `[key: string]: unknown` index signatures |
| 5 | **Unify description quality validators** — Single shared validator with tiered outcomes: `placeholder`/`activity-only`/`semantic`/`high-confidence` | R-06 | Low | Inconsistent stub detection between extraction and scoring |
| 6 | **Git-status auto-detection signal** — New Priority 2.7 in folder-detector cascade: `git status --porcelain` filtered to spec paths, ranked by changed-file count | R-13 | Medium | Auto-detection fails for new/bulk spec folders; user always prompted |
| 7 | **Decision deduplication fix** — Suppress observation-type decisions when `_manualDecisions` exists (2-line fix at `decision-extractor.ts:260-261`) | R-13 | Low | Every memory save with JSON-provided decisions records each decision twice |
| 8 | **key_files filesystem fallback** — When tree-thinning produces empty key_files, fall back to spec folder file listing; fix thinning input to use file content not descriptions | R-13 | Low | key_files always empty when descriptions are short (100% merge rate) |

### P1 — High Impact, Moderate Risk (address next)

| # | Improvement | Source | Effort | Risk if Deferred |
|---|---|---|---|---|
| 6 | **Build unified `SemanticSignalExtractor`** — Replace 4 overlapping topic/trigger systems with one engine + compatibility adapters | R-08 | High | Stopword/ranking drift produces materially different outputs for same input |
| 7 | **Strengthen contamination detection** — V8 inspect frontmatter, handle non-dominant foreign-spec signals; V9 broaden beyond 3-title denylist | R-02 | Medium | Cross-spec contamination bypasses both early filters and late validators |
| 8 | **Implement weighted embedding input** — `title + decisions×3 + outcomes×2 + general×1` before `generateEmbedding()` | R-09 | Medium | Retrieval quality degrades as corpus grows without signal weighting |
| 9 | **Tighten `SessionData` index signatures** — Explicitly model implementation-guide, pre/postflight, and continue-session fields | R-04 | Medium | Runtime richer than declared types; TypeScript can't catch field access errors |
| 10 | **Adopt dual-confidence model** — `CHOICE_CONFIDENCE` + `RATIONALE_CONFIDENCE` with derived `CONFIDENCE` for compatibility | R-05 | Medium | Single confidence conflates two independent signals, reduces decision quality |
| 11 | **Session activity signal** — New Priority 3.5 in cascade: `SessionActivitySignal` interface aggregating tool call paths, git changes, transcript mentions with confidence boosts | R-13 | Medium | No session-aware signal between CWD (never fires) and mtime (unreliable) |
| 12 | **Parent-folder affinity boost** — When parent has >3 active children, boost parent's effective depth to prevent child-folder theft | R-13 | Low | Parent spec folders always lose to their children in depth-biased ranking |
| 13 | **Template-to-workflow field contract** — Wire `memory_classification`, `session_dedup`, `causal_links` from extractors to template | R-13 | Medium | Three YAML metadata sections empty in every memory save (construction gap) |
| 14 | **Blocker extraction content validation** — Reject strings that look like markdown headers, code fragments, or section numbering patterns in `extractBlockers()` | R-13 | Low | Truncated observation text parsed as blocker content (e.g., `PROBLEM' to '## 2.`) |

### P2 — Moderate Impact, Lower Risk (address when capacity allows)

| # | Improvement | Source | Effort | Risk if Deferred |
|---|---|---|---|---|
| 11 | **Replace single-rule phase classification with topic clusters** — Use trigger-extractor preprocessing + real IDF for per-exchange document vectors | R-07 | High | Phase labels are brittle (grep in debug → "Research"), repeated loops merge |
| 12 | **Add contamination audit trail** — Structured logging at 3 pipeline points: extractor scrub, content-filter, post-render validation | R-02 | Low | No visibility into what contamination was caught vs missed |
| 13 | **Add `MODIFICATION_MAGNITUDE` to file records** — Leverage existing `changeScores` from git-context-extractor | R-06 | Low | No indication of change significance without reading diffs |
| 14 | **Centralize shared extraction helpers** — Tool-call detection, phase classification, duration calculation, manual decision parsing | R-03 | Medium | Same logic reimplemented in 2-3 extractors with subtle drift |
| 15 | **Expand observation types** — Add `test`, `documentation`, `performance` to current 6-type taxonomy | R-07 | Low | Doc/test work misclassified as `feature` or generic `observation` |
| 16 | **Instrument silent data drops** — Counters/logging for filtered prompts, truncated observations, ignored object facts, discarded metadata | R-03 | Low | Silent data loss not observable in production |
| 17 | **Migrate legacy JS tests to Vitest** — Especially `test-integration.js` which is shallower than its name suggests | R-10 | Medium | Only Vitest runs in `npm test`; legacy coverage not in CI path |
| 18 | **Template structural fingerprint** — Generate header/anchor fingerprint from templates, validate generated files against it; inline template content in delegation prompts | R-12 | Medium | External agents keep deviating from templates when given only path references |

---

## Detailed Findings

### R-01: Quality Scorer Consolidation

**Problem**: The pipeline runs three related quality checks (validator V1-V9, v2 normalized scorer, v1 legacy scorer) with a split contract: stored/indexed quality is `0.0-1.0`, but workflow gating uses `0-100`. The `qualityAbortThreshold` config is explicitly validated as `1-100`.

**Key evidence**:
- v1 covers 7 dimensions (trigger phrases, key topics, file descriptions, content length, HTML hygiene, observation dedup, sufficiency cap) on a 0-100 scale
- v2 covers 9 dimensions (placeholder integrity, spec folder integrity, decision integrity, semantic fields, tool state, spec relevance, title integrity, sufficiency, session evidence) on a 0.0-1.0 scale
- Direct overlap is small: only trigger-field sufficiency, title quality, and memory sufficiency are shared concerns
- Stored `quality_score` is already normalized 0.0-1.0 everywhere (frontmatter, MCP parser, index, save handlers)
- `qualityAbortThreshold` validated as `1-100` with default `15` proves abort gate is v1-bound

**Unified interface proposed**: `QualityScoreResult` with `score01` (canonical), `score100` (compatibility), typed `flags`, dimensional breakdown, and explicit gate outcomes.

**Migration risk**: High — scale mismatch would corrupt frontmatter, threshold config needs migration, both test baselines need rework.

**Recommendation**: Make `score01` canonical, keep `score100` as compatibility field, migrate in two phases.

---

### R-02: Contamination Detection Architecture

**Problem**: Three guard layers exist (not two): early lexical scrubber (`filterContamination`), prompt-quality pipeline (`content-filter`), and post-render validator (V8/V9). They run sequentially on different payloads — complementary, not redundant. Main gap: cross-spec contamination that looks like valid technical content.

**Key evidence**:
- `filterContamination` runs before and after enrichment on observations/summary/prompts
- `content-filter` operates on `allMessages` for semantic summary generation, not on final rendered body
- V8 misses low-volume contamination (1-2 foreign mentions, or spread across multiple foreign specs)
- V8 ignores frontmatter; V9 only catches 3 generic title patterns
- `content-filter` noise.patterns config exists in type/defaults but is never consulted
- `content-filter` can reward wrong-spec text (quality score favors uniqueness/density, not spec relevance)

**Audit trail proposed**: Structured JSON logging at 3 pipeline points with `stage`, `fieldPath`, `specFolder`, `removedPhrases`, `decision`, `failedRules`.

**Recommendation**: Strengthen V8 to inspect frontmatter and non-dominant foreign-spec signals. Broaden V9 beyond 3-title denylist. Add audit logging.

---

### R-03: Extraction Pipeline Data Flow

**Problem**: The pipeline is not "6 peer parallel extractors." It's 5 parallel branches with file-extractor and implementation-guide nested inside `collectSessionData`. Normalization is lossy — file metadata, manual decision enrichment, and object-based facts are silently dropped.

**Key evidence**:
- `FILES` metadata flattened to `{ FILE_PATH, DESCRIPTION }` — `ACTION`, `_provenance`, `_synthetic` dropped
- `collectSessionData()` truncates observations to `MAX_OBSERVATIONS` with no warning
- `transformKeyDecision()` creates `_manualDecision.fullText/chosenApproach/confidence` but `extractDecisions()` never reads it
- Object-based facts become `null` in conversation extractor, empty strings in file extractor
- Tool-call detection, phase classification, topic extraction, duration calculation, and manual decision parsing are each reimplemented in 2-3 extractors

**Data flow clarified**: `normalizeInputData()` → 2 data forks (cleaned + narrative) → `Promise.all([collectSessionData, extractConversations, extractDecisions, extractDiagrams, workflowData])` → post-parallel semantic summary + file enhancement + tree thinning → template rendering

**Recommendation**: Preserve metadata through normalization, centralize shared helpers, instrument drops.

---

### R-04: Type System Completeness

**Problem**: Canonical typing is only partial. `session-types.ts` imports 4 core shapes from extractor files (inverted dependency), and `SessionData`'s `[key: string]: unknown` masks undeclared but real fields.

**Key evidence**:
- 4 parallel type remnants: `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` live in extractor files
- 8+ `CollectedDataFor*` subset interfaces, plus local types in semantic-summarizer and quality-scorer
- `PhaseEntry.ACTIVITIES?` is always populated (both real and simulation paths)
- 15+ `SessionData` fields from pre/postflight, continuation, implementation-guide are absorbed by index signature
- `OutcomeEntry.TYPE?` always set on real path but omitted by simulation

**Migration checklist**: 7 steps — canonicalize 4 leaked types → expand SessionData → make ACTIVITIES required → decide on OutcomeEntry.TYPE → use Pick<> for subsets → consolidate CollectedDataFor* → recompile/retest.

**Recommendation**: Treat as type-consolidation pass, not cosmetic cleanup. Index signature removal after explicit modeling.

---

### R-05: Decision Confidence Calibration

**Problem**: Single `CONFIDENCE` field mixes two questions: "how sure about the chosen option?" and "how sure about the captured rationale?" Current algorithm: normalize to 0-1, then heuristic ladder (70 if alternatives, 65 if rationale, else 50).

**Key evidence**:
- Manual decisions: `hasAlternatives → 70`, `hasRationale → 65`, else `50`
- Observation decisions: parse explicit `confidence:` regex, else same heuristic
- Downstream consumers: `DecisionRecord`, `decision-tree-generator`, `ascii-boxes`, `workflow.ts` (converts to %), `context_template.md`, `validate-memory-quality.ts`
- `diagram-extractor` does NOT consume confidence (confirmed no-op)
- `quality-scorer` is confidence-agnostic (only rewards "a decision exists")

**Dual-confidence proposed**: `CHOICE_CONFIDENCE` + `RATIONALE_CONFIDENCE`, derive legacy `CONFIDENCE = Math.min(choice, rationale)` for conservative compatibility.

**Recommendation**: Phase 1: add dual fields with derived overall. Phase 2: decide on split analytics for counts/importance.

---

### R-06: File Description Semantic Enrichment

**Problem**: Two different quality gates (extraction-time `isDescriptionValid()` and scoring-time `hasMeaningfulDescription()`) with partial overlap. Git-derived descriptions and provenance metadata are underutilized.

**Key evidence**:
- `isDescriptionValid()` rejects: markdown stubs, bullet stubs, trailing connectors, simple `modified <word>`, `[PLACEHOLDER]`, etc.
- `hasMeaningfulDescription()` rejects: empty, <20 chars, `description pending`, `modified during session`, generic `created|edited|... via|during`
- Neither catches: `Recent commit: modify in repository history`, `TBD`/`todo`/`pending`/`n/a`, bare `changed`/`modified`
- `_provenance` attached at extraction, preserved during merge, but not used for quality ranking or description selection
- `git-context-extractor` already provides: action type, `changeScores` from `git diff --stat`, commit type classification, branch name

**MODIFICATION_MAGNITUDE proposed**: `trivial`/`small`/`medium`/`large`/`unknown` from existing `changeScores` + action + commit-touch counts.

**Recommendation**: Unify validators, leverage provenance for trust weighting, persist `MODIFICATION_MAGNITUDE`.

---

### R-07: Conversation Phase & Topic Clustering

**Problem**: Phase labeling uses a 6-label precedence ladder (Research/Planning/Implementation/Debugging/Verification/Discussion) without topic awareness. Repeated returns to same phase merge into one duration. Flow pattern inferred from keyword presence, not actual branching.

**Key evidence**:
- Phase classification precedence is brittle: `grep` in debug → "Research"
- 5-minute `MESSAGE_TIME_WINDOW` can both over-associate and miss slower work
- `FLOW_PATTERN` derived from two boolean checks (has decisions? >3 phases?)
- `AUTO_GENERATED_FLOW` renders straight vertical list regardless of actual branching
- Shared trigger-extractor has reusable preprocessing but lacks real IDF (normalized TF + length bonus only)
- Current observation types: `bugfix`, `feature`, `refactor`, `decision`, `research`, `discovery` — missing `test`, `documentation`, `performance`

**Topic cluster proposed**: `TopicCluster { id, label, messageIndexes, observationIndexes, dominantTerms, phaseScores, primaryPhase, confidence }` — each exchange as a document, cluster by cosine/Jaccard overlap, label from combined evidence.

**Recommendation**: Replace single-rule phase with scored cluster-level labeling. Expand observation types. Stop merging repeated phases.

---

### R-08: Trigger/Topic Extraction Duplication

**Problem**: 3 real extraction engines + 1 wrapper, with different stopwords, weighting, and placeholder rules. Outputs differ materially for same input.

**Key evidence**:
- `shared/trigger-extractor.ts` (659 lines): English/tech/artifact stopwords, 1-4 gram extraction, typed term extractors, substring dedupe
- `core/topic-extractor.ts` (100 lines): weighted scoring, bigrams, spec-folder boosting, TITLE/RATIONALE weighting
- `session-extractor.ts:381-437`: larger stopword list, no weighting, no bigrams, sorted by token length
- `lib/semantic-summarizer.ts`: wrapper that calls `extractTriggerPhrases(allContent)`
- Stopword overlap: session has 136 terms, trigger-english 119 — 83 overlap but 53 unique to session

**Stopword divergence highlights**: session-only has `complete`, `create`, `fix`, `placeholder`, `simulation`, `user`, `assistant`. Core-only has `based`, `changes`, `check`, `tool`, `work`.

**Unified `SemanticSignalExtractor` proposed**: Single engine with `mode: 'topics'|'triggers'|'summary'|'all'`, `stopwordProfile: 'balanced'|'aggressive'`, configurable n-gram depth.

**Recommendation**: Build unified engine with compatibility adapters. Golden tests first, then tighten to one canonical ranking model.

---

### R-09: Memory Index Signal Optimization

**Problem**: Current indexing embeds full markdown content as-is. Title/triggers/quality are derived after embedding, so they don't shape the vector. Long inputs use priority-preserving truncation (keeps decision/high sections) but not true weighted concatenation.

**Key evidence**:
- `memory-indexer.ts` calls `generateEmbedding(content)` on raw markdown
- `semanticChunk()` preserves first 500, last 300 chars, then decision/high/medium sections when >8000 chars
- Dedicated `generateDocumentEmbedding()` exists but indexer doesn't use it
- Stored metadata: `specFolder`, `filePath`, `anchorId`, `title`, `triggerPhrases`, `importanceWeight`, `embedding`, `qualityScore`, `qualityFlags`
- Temporal decay already lives at retrieval time via `useDecay`, FSRS when review data exists, else half-life on `updated_at`

**Weighted concatenation proposed**: `title + decisions×3 + outcomes×2 + general×1` as embedding input. Aligns with sufficiency model which treats decisions/outcomes as durable evidence.

**Temporal decay**: Should stay in searcher (already implemented, always current, query-tunable, disable-able for audits). Indexer stores static decay inputs.

**Recommendation**: Replace raw `generateEmbedding(content)` with structured weighted payload builder, route through `generateDocumentEmbedding()`.

---

### R-10: Integration Test Coverage Gap Analysis

**Problem**: 22 vitest + 25 legacy JS + 4 shell + 1 Python tests exist, but the real gate chain runs only under heavy mocks. Post-write orchestration (description tracking, indexing, retry) has no E2E coverage.

**Key evidence**:
- `task-enrichment.vitest.ts` mocks file writer, both scorers, sufficiency, indexer, and retry manager
- `memory-render-fixture.vitest.ts` mocks spec-folder resolution, indexing, and retry
- `test-integration.js` checks cleanup helpers and export presence, not live orchestration
- No tests cover: `ctxFileWritten`, `memorySequence`, `memoryNameHistory`, duplicate-skip indexing, retry processing

**Top 5 untested critical paths**:
1. Post-write bookkeeping (description.json mutation, sequence increment, lost-update retry)
2. Real write/index boundary after all gates pass
3. True end-to-end loader → workflow → gate chain
4. Filter pipeline + tree thinning + quality threshold interaction
5. Workflow retry integration

**Minimal E2E fixture proposed**: 1 Vitest factory with temp repo, 3 test cases (happy-path save, stateless alignment block, duplicate/second-save).

**Recommendation**: Add `workflow-e2e.vitest.ts` targeting real gate chain with real write and description tracking.

---

### R-11: Session Capture Source Fidelity & Cross-Session Contamination

**Problem**: The pipeline's transcript selection uses filesystem `mtime` as a proxy for "current session," but any append, rewrite, or metadata-touch on an older same-workspace transcript can make it outrank the active session. Once the wrong transcript is selected, all downstream validators pass because they check spec affinity (same folder), not session identity (same conversation). This is a **source-of-truth corruption bug** at pipeline entry.

**Key evidence**:
- `data-loader.ts:314` calls `captureClaudeConversation(20, projectRoot)` with no session ID, PID, or start timestamp — capture starts blind to the active session
- `getRecentSessionCandidates()` (`claude-code-capture.ts:94`) reads `~/.claude/history.jsonl` backward for up to 5 session IDs but discards history timestamps
- `resolveTranscriptPath()` (`claude-code-capture.ts:140`) maps candidates to `.jsonl` files, sorts by `mtimeMs` (line 165), returns highest — wrong if older transcript was touched
- After selection, all downstream processing commits to the wrong source: normalizer, workflow, scorers, template rendering
- Bad memory file: `quality_score: 1.00` with `has_contamination: true` — v2 scorer at `extractors/quality-scorer.ts:104` adds the flag but never deducts from score
- V1 legacy scorer (`core/quality-scorer.ts:102`) has no contamination input in its function signature at all
- `file_count: 10` derived from `collectSessionData()` at `collect-session-data.ts:862` as `FILES.length` from wrong transcript's tool calls, not filesystem truth
- `key_files` empty because workflow filters out synthetic `(merged-small-files)` entries without replacement
- `memory_classification`, `session_dedup`, `causal_links` all blank — template expects these fields but workflow never supplies them (construction gap, not transcript bug)

**Transcript resolution failure path**:
1. `data-loader.ts:314` → `captureClaudeConversation(20, projectRoot)` — no session hint
2. `claude-code-capture.ts:298` → `resolveTranscriptPath(projectRoot)` — trusted blindly
3. `claude-code-capture.ts:94` → `getRecentSessionCandidates()` — 5 IDs by recency in history.jsonl, no timestamps preserved
4. `claude-code-capture.ts:165` → sort candidates by `mtimeMs`, return highest — wrong if stale transcript was touched
5. `claude-code-capture.ts:319-464` → parse wrong JSONL → all exchanges, toolCalls, metadata from stale session
6. `input-normalizer.ts:684` → spec-affinity filter passes (same spec folder in both sessions)
7. `workflow.ts:893` → all downstream extraction operates on wrong data

**Session boundary validation protocol proposed**:
- Add `captureClaudeConversation(maxExchanges, projectRoot, { expectedSessionId, sessionStartTs, invocationTs })`
- Fallback order: (1) exact runtime `sessionId` from environment, (2) active lock/session file, (3) newest history entry by history timestamp (not mtime), (4) reject if no candidate's last event falls within `[sessionStartTs, invocationTs + skew]`
- Persist `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated` through pipeline into frontmatter for audit

**Quality score disconnect fix**:
- V2 (`extractors/quality-scorer.ts:104`): at `if (hadContamination)`, add penalty: `qualityScore -= 0.25; sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.6);`
- V1 (`core/quality-scorer.ts:102`): extend signature to accept `hadContamination`, apply matching cap
- Both scorers must stay aligned since workflow emits both (`workflow.ts:1433`, `workflow.ts:1532`)

**HTML comment / trigger noise fix**:
- `removeMarkdown()` at `shared/trigger-extractor.ts:103` uses `/<[^>]+>/g` which actually does match `<!-- -->` comments — the initial hypothesis was wrong
- Real trigger noise comes from workflow feeding raw file paths and tree-thinning synthetic descriptions into trigger extraction (`workflow.ts:1311`, `tree-thinning.ts:152`)
- Fix: stop feeding raw full paths and merge metadata into trigger extraction input

**File count fidelity proposal**: Split into three metrics:
- `captured_file_count`: transcript-derived (current `FILES.length`)
- `filesystem_file_count`: recursive scan of resolved spec folder, excluding `memory/` and `scratch/`
- `git_changed_file_count`: `git diff --name-only -- <specFolder>` for change fidelity

**Cross-session detection proposal**: Add validators in three places:
- `claude-code-capture.ts`: hard-reject if transcript `sessionId` or end timestamp fails expected-session contract
- `workflow.ts`: compare `captured_file_count` vs `filesystem_file_count`, reject large divergences (e.g., RESEARCH phase capture + dozens of existing docs)
- `validate-memory-quality.ts`: new V10 rule for same-spec wrong-session mismatch (phase/file-count/continuation inconsistent with filesystem state)

**Recommendation**: Fix transcript resolution (session-ID-first selection), add contamination score penalty, add V10 validator, add filesystem truth pass, stop feeding synthetic descriptions into triggers.

---

### R-12: Template Compliance Enforcement Gap

**Problem**: External agents (Copilot, Gemini) deviate from spec-kit templates because `validate.sh` checks syntax (anchor pairs balanced, template source header present) but not semantics (correct section headers, correct anchor IDs, correct checklist item format). 18 validation rules exist but none compare generated content against template structure. This impacts indexability — missing anchors mean structured retrieval fails for those sections.

**Key evidence**:
- `019-manual-testing-per-playbook/002-mutation/checklist.md`: completely wrong structure — `# Checklist:` H1 instead of `# Verification Checklist:`, `**[P0]**` format instead of `CHK-NNN [P0]`, 10 custom `###` subsection headers
- 12/19 checklist files had extra YAML `SPECKIT_TEMPLATE_SOURCE:` field not in the template (only the HTML comment is canonical)
- `019-feature-flag-reference/checklist.md`: YAML comment `# SPECKIT_TEMPLATE_SOURCE` leaked into content area
- `check-anchors.sh` validated pair balance but not that required IDs (`protocol`, `pre-impl`, `code-quality`, etc.) were present
- No rule checked that `## 2. PROBLEM & PURPOSE` wasn't truncated to `## 2. PROBLEM`
- No rule checked that checklist items used `CHK-NNN [P0]` format

**Root cause**:
1. `check-anchors.sh` validates pair balance, not required ID presence per file type
2. No rule checks section header text against template expectations
3. External CLI agents get template paths but interpret rather than copy
4. Post-agent validation catches syntax issues but not structural deviation

**Fixes applied**:
- `check-template-headers.sh` (new WARN rule): verifies section headers match template expectations per file type, checks CHK-NNN format for checklists, checks H1 format
- `check-anchors.sh` (extended): added required anchor ID validation per file type — spec.md needs 7 anchors, plan.md needs 7, tasks.md needs 6, checklist.md needs 8
- Registered `TEMPLATE_HEADERS` rule in `validate.sh` with WARN severity
- Fixed 002-mutation/checklist.md (H1, frontmatter, CHK-NNN format, summary counts)
- Fixed 019-feature-flag-reference/checklist.md (removed YAML comment leak)
- Removed extra YAML `SPECKIT_TEMPLATE_SOURCE` field from 12 checklist files

**Priority**: P1 — impacts indexability and consistency of all agent-generated spec docs

**Recommendation**:
1. New `TEMPLATE_HEADERS` validation rule (WARN severity) — **implemented**
2. Extended `ANCHORS_VALID` rule with required anchor IDs per file type (ERROR severity) — **implemented**
3. Future: template structural fingerprint for automated comparison
4. Future: inline full template content in external agent delegation prompts (not just paths)
5. Future: post-agent validation gate — run `validate.sh --strict` automatically after any agent creates spec docs

---

### R-13: Spec Folder Auto-Detection Failure & Memory Quality Regression

**Problem**: Two consecutive `/memory:save` operations for `019-manual-testing-per-playbook` exposed compound failures: (A) the auto-detection cascade failed to identify the active spec folder despite 24+ untracked files, and (B) the saved memory file exhibited 10 of 12 previously-identified R-series issues simultaneously — a quality regression demonstrating that R-11's source-of-truth corruption cascades into nearly every downstream pipeline stage. Additionally, a new decision deduplication bug was discovered where 4 decisions appear twice due to dual-write in the input normalizer.

**Key evidence — Auto-detection failure (Problem A)**:
- `folder-detector.ts:351-366`: Ranking uses strict priority sort (quality > depth > idVector > mtime). The 19 child folders of `019-manual-testing-per-playbook` at depth 4 always outrank the parent at depth 3
- `folder-detector.ts:372-396`: `assessAutoDetectConfidence()` uses a boolean `lowConfidence` flag, not a numeric threshold. Two candidates with different idVectors return `lowConfidence: false`, causing silent wrong selection
- `folder-detector.ts:643-786`: `collectAutoDetectCandidates()` scans 445+ spec folders. All depth-4 children of `019-*`, `012-*`, `014-*` compete at the same level, creating a massive tie pool
- `folder-detector.ts:1143-1172`: CWD check (Priority 3) requires `process.cwd()` inside specs dir — never fires from repo root (standard invocation)
- No git-status signal exists anywhere in the cascade. 24 untracked files under one folder would be an overwhelming indicator
- `input-normalizer.ts:720-744`: Tool call file paths are already captured and spec-affinity-filtered, but never aggregated into a folder-detection signal
- `claude-code-capture.ts:396-424`: CaptureToolCall includes full `input` with `filePath`/`file_path`/`path` fields — data exists but is unused for detection

**Key evidence — Candidate competition trace for `019-manual-testing-per-playbook` (Problem A, supplementary)**:
- Parent folder relative path: `02--system-spec-kit/022-hybrid-rag-fusion/019-manual-testing-per-playbook` → depth=3, idVector=[19]
- Child folder (e.g., `001-retrieval`) relative path: `02--system-spec-kit/022-hybrid-rag-fusion/019-manual-testing-per-playbook/001-retrieval` → depth=4, idVector=[19, 1]
- `compareAutoDetectCandidates` (`folder-detector.ts:355-356`): `b.depth - a.depth` — ALL 19 children at depth 4 outrank parent at depth 3. Parent eliminated before idVector/mtime tiebreakers
- Among children, `compareIdVectorsDesc` sorts descending → `019-feature-flag-reference` (idVector [19, 19]) beats `018-ux-hooks` ([19, 18]) beats `001-retrieval` ([19, 1])
- Winner: `019-feature-flag-reference` — the **last** child folder alphabetically/numerically, NOT the parent
- `assessAutoDetectConfidence` (`folder-detector.ts:387-395`): Top two children have same quality, same depth (4), but DIFFERENT idVectors ([19,19] vs [19,18]) → returns `lowConfidence: false, reason: 'clear ranked winner'`
- **The system is confidently wrong, not uncertain** — no user prompt is triggered because confidence assessment treats idVector differences as disambiguating evidence
- `workflow.ts:1322-1324`: Even if the correct parent folder WERE selected, trigger extraction feeds raw `FILE_PATH` values and synthetic tree-thinning `DESCRIPTION` strings into `extractTriggerPhrases()`, producing noise like `"merged-small-files tree-thinning merged small"` and full spec paths as trigger phrases

**Key evidence — Decision deduplication bug (Problem B, sub-finding)**:
- `input-normalizer.ts:415-449`: Same 4 decisions written to BOTH `observations[]` (as `type: 'decision'`, lines 415-422) AND `_manualDecisions[]` (line 448-449) — **dual-write is the root cause**
- `decision-extractor.ts:260-261`: `decisionObservations` filtered independently from `processedManualDecisions` — the guard at lines 265-266 suppresses lexical extraction but NOT observation-type extraction
- `decision-extractor.ts:440`: `const allDecisions = [...processedManualDecisions, ...decisions]` — unguarded concatenation produces 4+4=8 entries
- No `Set`, `filter`, or `Map` dedup exists between the two arrays
- Result: decisions 1-4 appear twice — once at 50% confidence without trees, once at 65% with Visual Decision Trees

**Key evidence — File count & key_files pipeline (Problem B, sub-finding)**:
- `collect-session-data.ts:862`: `FILE_COUNT = FILES.length` — limited by JSON-mode input, counts 10 vs 38 actual files
- `workflow.ts:1234-1237`: Tree thinning uses `f.DESCRIPTION` as "content" (1-3 tokens), not actual file content — with merge threshold of 200 tokens (`tree-thinning.ts:31`), ALL files get `merged-into-parent`
- `workflow.ts:1297-1300`: `key_files` filter removes synthetic `(merged-small-files)` entries, producing empty array when all files were merged
- `workflow.ts:411-421`: `applyThinningToFileChanges()` creates synthetic entries when no "kept" file remains — the only output for 100% merged groups

**Key evidence — Quality regression mapping (Problem B, meta-analysis)**:
- 10 of 12 R-series items (83%) manifest in the two bad memory files for `019-manual-testing-per-playbook`
- R-11 is the dominant root cause: wrong transcript → wrong file count, trigger noise, inflated quality scores, compressed conversations
- 15:31 file is a net regression over 14:30: `message_count` 12→1, `tool_count` 95→0, decisions 0→8 (duplicated)
- Only improvement: 15:31 has accurate overview text (14:30 captured user's conversational remark)
- Three template fields never wired to workflow: `memory_classification`, `session_dedup`, `causal_links` — empty in ALL memory saves (construction gap independent of R-11)

**Key evidence — Per-issue R-series fix mapping for 15:31 bad memory file (Problem B, supplementary)**:

| Issue in 15:31 file | Root Cause | R-series Fix |
|---|---|---|
| `file_count: 10` (actual: 38+) | JSON-mode input provides limited file list; `FILES.length` at `collect-session-data.ts:862` | R-13 P0-8: filesystem_file_count fallback |
| `key_files:` empty | Tree-thinning uses `f.DESCRIPTION` (1-3 tokens) as content → 100% merge rate → synthetic entries filtered | R-13 P0-8: key_files filesystem fallback + fix thinning input |
| `decision_count: 8` (actual: 4) | Dual-write at `input-normalizer.ts:415-449` + unguarded merge at `decision-extractor.ts:440` | R-13 P0-7: decision dedup fix |
| `message_count: 1` | JSON-mode data has single aggregated prompt, not transcript exchanges | R-11 P0-0: session-ID-first transcript resolution |
| `tool_count: 0` | JSON-mode data lacks tool call records | R-11 P0-0: session-ID-first transcript resolution |
| `quality_score: 0.90` (should be lower) | V2 scorer flags contamination but doesn't deduct; V1 has no contamination input | R-11 + R-01: contamination score penalty |
| Trigger noise (`"merged-small-files"`, `"tree-thinning"`) | `workflow.ts:1322-1324` feeds raw FILE_PATH + synthetic descriptions into trigger extraction | R-11: trigger input sanitization |
| `Phase: RESEARCH` (was IMPLEMENTATION) | Phase classification from wrong/limited data; keyword ladder misclassifies | R-07: topic-cluster phase classification |
| `Blockers: PROBLEM' to '## 2.` | **NEW**: `buildProjectStateSnapshot` parses truncated observation text as blocker content; not covered by R-01–R-12 | **NEW P1**: blocker extraction should validate content is a meaningful blocker, not a code fragment or section header |
| `memory_classification`, `session_dedup`, `causal_links` all empty | Template expects fields but workflow never supplies them | R-13 B8: template-to-workflow field contract |
| `Completion: 14%` (was 100% complete) | `estimateCompletionPercent` at `collect-session-data.ts:436-461` underestimates from 1 message + 0 tools | R-11 P0-0: correct transcript → correct message/tool counts |
| Conversation section: 0 phases, 1 message | JSON-mode provides summary text not transcript exchanges | R-11 P0-0: session-ID-first transcript resolution |

- **NEW finding**: `Blockers: PROBLEM' to '## 2.` is a previously-unidentified extraction bug in `session-extractor.ts:buildProjectStateSnapshot()` where a truncated observation title/narrative containing markdown section headers is parsed as a blocker string. This is NOT covered by R-01–R-12 or the existing R-13 proposed fixes. **Proposed fix**: add content validation in `extractBlockers()` to reject strings that look like markdown headers, code fragments, or section numbering patterns (e.g., `/^##\s|^['"\`]|'\s+to\s+'/`)

**Proposed fixes**:

1. **Git-status Priority 2.7 signal** (High priority — new priority level in `folder-detector.ts`):
   Run `git status --porcelain`, filter paths under `specs/`, group by spec folder, rank by file count. A folder with 24 untracked files is an overwhelming signal. Insert between Priority 2.5 (session DB) and Priority 3 (CWD). ~50 lines in `folder-detector.ts`.

2. **Session activity signal Priority 3.5** (High priority — new priority level):
   New `SessionActivitySignal` interface aggregating tool call file paths, git changed paths, and transcript mentions. Confidence boost scoring: 0.1/mention, 0.2/Read, 0.3/Edit|Write, 0.25/git-changed-file. New file `scripts/extractors/session-activity-signal.ts`. Insert between Priority 3 and Priority 4.

3. **Parent-folder affinity boost** (Medium priority — modify `folder-detector.ts:351-366`):
   When a parent spec folder has >3 child folders with recent mtime, boost parent's effective depth to match children. Prevents child folders from stealing selection from the intended parent.

4. **Decision dedup fix** (High priority — 2-line fix in `decision-extractor.ts:260-261`):
   When `processedManualDecisions.length > 0`, set `decisionObservations = []` to suppress observation-type decisions. Mirrors existing lexical suppression pattern at lines 265-266.

5. **key_files filesystem fallback** (Medium priority — modify `workflow.ts:1297-1300`):
   When post-thinning `keyFiles` is empty, fall back to listing `*.md`/`*.json` files from the spec folder. Alternatively, fix root cause: use actual file content for tree-thinning instead of `f.DESCRIPTION`.

6. **Template-to-workflow field contract** (Medium priority — wire `memory_classification`, `session_dedup`, `causal_links`):
   Three YAML metadata sections exist in the template but workflow never populates them. Affects ALL memory saves, independent of transcript selection.

**Recommendation**: Fix decision dedup (2-line change) and git-status signal (new Priority 2.7) first — these address the highest-impact bugs with lowest risk. Then add session activity signal, parent-affinity boost, and key_files fallback. Template field wiring is a broader effort that should align with Phase A type consolidation.

---

## Cross-Cutting Observations

### Theme 1: Contract Consolidation Debt
R-01 (dual scorer scales), R-04 (inverted type ownership), R-06 (divergent validators), and R-08 (4 topic extractors) all point to the same root cause: features were added incrementally with local contracts that were never unified. The unified interfaces proposed by R-01 (`QualityScoreResult`), R-04 (canonical `session-types.ts`), R-06 (tiered description validator), and R-08 (`SemanticSignalExtractor`) should be designed together to avoid creating new contract seams.

### Theme 2: Information Loss at Boundaries
R-03 identified 5+ data loss points. R-06 showed provenance metadata is attached but never leveraged. R-02 showed contamination filtering operates on different payloads at each stage. The common fix: preserve richer data through normalization and make pipeline stage boundaries explicit with instrumentation.

### Theme 3: Scoring Model Maturity
R-01 (quality), R-05 (confidence), R-07 (phase), and R-09 (embedding) all propose moving from binary/heuristic scoring to multi-dimensional scored models. These should share infrastructure where possible — e.g., the unified topic extractor (R-08) feeds both phase labeling (R-07) and embedding weighting (R-09).

### Theme 4: Verification Maturity
R-10 showed the test pyramid is bottom-heavy: unit helpers are well-covered, but orchestration E2E is thin. R-02's audit trail proposal would make contamination observable. R-03's drop instrumentation would make data loss observable. Together, these create the observability layer needed to safely evolve the scoring models.

### Theme 5: Template Compliance at Generation Time
R-12 showed that external agent delegation creates a validation blind spot: agents interpret templates rather than copying them, and the 18-rule validation suite checks syntax (anchors balanced, headers present) but not semantics (correct headers, correct anchors, correct format). The new `TEMPLATE_HEADERS` rule and required-anchor extension to `ANCHORS_VALID` close this gap for future validations, but the deeper fix is hardening delegation prompts to include template content inline rather than as path references.

### Theme 6: Source-of-Truth Integrity
R-11 revealed a category of failure not covered by Themes 1-4: the pipeline can select the wrong input entirely. Spec-affinity validators (R-02, R-06, R-08) only verify content-to-spec alignment, not content-to-session alignment. When two sessions target the same spec folder, the wrong one can be captured with no downstream detection. This is the highest-priority fix because it invalidates all downstream processing — scoring, extraction, embedding, and indexing are all high-quality operations on garbage input. R-11's session boundary protocol and V10 validator address this at the root, while R-01's contamination penalty fix addresses the secondary failure (scoring doesn't penalize even when contamination is detected).

### Theme 7: Detection & Routing Fragility
R-13 revealed that the spec folder auto-detection cascade — the very first step that determines WHERE memory is saved — has structural weaknesses that compound with R-11's transcript selection failures. Depth-bias in ranking (children outrank parents), absence of git-status signals, and 445+ candidates competing on stale mtime create a system that fails precisely when it matters most: new spec folders with many children, first-time saves, and bulk file creation workflows. The cascade was designed for simple cases (few spec folders, clear mtime winner) but breaks in production-scale repos. Combined with R-03's dual-write decision bug and tree-thinning's over-aggressive merging of description-length "content," R-13 demonstrates that R-01–R-12 issues are not isolated — they combine multiplicatively. Two consecutive bad saves for the same folder produced files where 83% of all known R-series issues manifest simultaneously. R-13f verification additionally revealed a blocker extraction bug where truncated observation text containing markdown section headers is parsed as a blocker string — the `Blockers: PROBLEM' to '## 2.` artifact in the 15:31 file is a content validation gap in `extractBlockers()` that is independent of transcript selection.

---

## Recommended Implementation Sequence

```
Phase A0: Source Integrity & Detection (P0 critical, 1-2 spec folders — address FIRST)
├── A0.1: Session-ID-first transcript resolution (R-11) — expectedSessionId parameter, history-timestamp fallback
├── A0.2: Contamination score penalty (R-11 + R-01) — v2 penalty at hadContamination, v1 signature extension
├── A0.3: V10 same-spec wrong-session validator (R-11) — filesystem truth vs captured data divergence
├── A0.4: Filesystem file count (R-11) — captured_file_count + filesystem_file_count split
├── A0.5: Trigger input sanitization (R-11) — stop feeding raw paths and tree-thinning synthetic descriptions
├── A0.6: Git-status auto-detection signal (R-13) — new Priority 2.7 in folder-detector cascade
├── A0.7: Decision deduplication fix (R-13) — suppress observation-type decisions when _manualDecisions exists (2-line fix)
└── A0.8: key_files filesystem fallback (R-13) — prevent empty key_files when tree-thinning over-merges

Phase A: Foundation (P0 items, 2 spec folders)
├── A1: Type consolidation (R-04 items 1-3) + description validator unification (R-06)
├── A2: Preserve file metadata through normalization (R-03)
├── A3: Quality scorer unification (R-01) — score01 canonical, score100 compatibility
└── A4: Workflow E2E test (R-10) — catches regressions from A0+A1-A3

Phase B: Signal Quality (P1 items, 3 spec folders)
├── B1: Unified SemanticSignalExtractor (R-08) — golden tests, then adapter migration
├── B2: Contamination detection strengthening (R-02) + audit trail
├── B3: Weighted embedding input (R-09) — depends on B1 for signal extraction
├── B4: Tighten SessionData index signatures (R-04 items 4-7)
├── B5: Template structural fingerprint + delegation prompt hardening (R-12)
├── B6: Session activity signal Priority 3.5 (R-13) — SessionActivitySignal interface + buildSessionActivitySignal()
├── B7: Parent-folder affinity boost (R-13) — effective depth boost for parents with many active children
├── B8: Template-to-workflow field contract (R-13) — wire memory_classification, session_dedup, causal_links
└── B9: Blocker extraction content validation (R-13) — reject markdown headers/code fragments in extractBlockers()

Phase C: Semantic Richness (P1-P2 items, 2 spec folders)
├── C1: Dual-confidence model (R-05) — type change + rendering + template
├── C2: Topic-cluster phase classification (R-07) — depends on B1
└── C3: MODIFICATION_MAGNITUDE (R-06) + observation type expansion (R-07)

Phase D: Observability & Cleanup (P2 items, 1 spec folder)
├── D1: Drop instrumentation (R-03) + contamination audit trail (R-02)
├── D2: Centralize shared extraction helpers (R-03)
└── D3: Legacy test migration to Vitest (R-10)
```

---

## Decision Points for User

1. **Quality scorer migration strategy** — Big-bang unification or phased score01-first? R-01 recommends phased, but the unified `QualityScoreResult` interface is ready if you prefer atomic migration.

2. **SemanticSignalExtractor scope** — Should this subsume all 4 extractors immediately (R-08 adapter approach), or start with topic-extractor + session-extractor merger first?

3. **Dual confidence adoption** — Phase 1 only (add fields, keep derived `CONFIDENCE`), or go directly to Phase 2 (split analytics for counts/importance)?

4. **Topic cluster complexity** — Full TF-IDF with real IDF (requires corpus management) vs. enhanced TF-only with adjacency merging?

5. **E2E test depth** — Minimal 3-case fixture (R-10 proposal), or extended coverage including filter pipeline + tree thinning interaction?

6. **Temporal decay** — Confirm searcher-side placement (R-09 recommends this, already implemented). Any use case for indexer-side pre-computation?

7. **Session ID source** — R-11 proposes `expectedSessionId` from environment/host API. Claude Code exposes session ID in transcript events but not as an environment variable. Should the capture API require it (breaking change for callers) or accept it optionally with mtime fallback?

8. **Auto-detection cascade expansion** — R-13 proposes two new priority levels (2.7 git-status, 3.5 session-activity). Should both be added, or just git-status (simpler, no transcript dependency)?

9. **Decision dedup strategy** — R-13 identifies 3 fix options: (A) suppress observation decisions when manual exists (2-line fix), (B) dedup at merge by title/hash, (C) fix dual-write at source. Option A is minimal but masks the root cause. Option C prevents all future duplication but changes normalizer contract.

10. **Tree-thinning input** — Currently uses `f.DESCRIPTION` (1-3 tokens) causing 100% merge rate. Fix at source (read actual file content for token counting) or add fallback (filesystem listing when key_files empty)?

---

## Appendix: Agent Execution Summary

| Agent | Title | Model | Reasoning | Time | Tokens In | Tokens Out | Cached |
|---|---|---|---|---|---|---|---|
| R-01 | Quality Scorer Consolidation | gpt-5.4 | high | 3m 28s | 816.7k | 12.2k | 761.1k |
| R-02 | Contamination Detection Architecture | gpt-5.4 | high | 2m 48s | 583.3k | 10.3k | 475.6k |
| R-03 | Extraction Pipeline Data Flow | gpt-5.4 | high | 4m 04s | 799.6k | 14.8k | 726.8k |
| R-04 | Type System Completeness | gpt-5.4 | high | 3m 40s | 788.0k | 14.4k | 713.6k |
| R-05 | Decision Confidence Calibration | gpt-5.4 | high | 3m 42s | 517.3k | 12.5k | 427.0k |
| R-06 | File Description Semantic Enrichment | gpt-5.4 | high | 1m 46s | 271.1k | 5.9k | 244.1k |
| R-07 | Conversation Phase & Topic Clustering | gpt-5.4 | high | 3m 45s | 756.9k | 10.4k | 713.2k |
| R-08 | Trigger/Topic Extraction Duplication | gpt-5.4 | high | 5m 44s | 1.4m | 15.7k | 1.4m |
| R-09 | Memory Index Signal Optimization | gpt-5.4 | high | 3m 27s | 913.9k | 10.9k | 848.5k |
| R-10 | Integration Test Coverage Gap Analysis | gpt-5.4 | high | 5m 54s | 2.4m | 17.7k | 2.2m |
| R-11 | Session Capture Source Fidelity | gpt-5.4 | xhigh | ~4m | ~510k | ~8k | — |
| R-12 | Template Compliance Enforcement Gap | claude-opus-4-6 | — | ~5m | — | — | — |
| **R-01–R-12 Total** | | | | **~47m** | **~9.7m** | **~133k** | **~8.5m** |
| R-13a | Auto-Detection Failure Path | claude-opus-4-6 | — | ~2m 21s | ~63k | — | — |
| R-13b | Session Activity Signal Design | claude-opus-4-6 | — | ~1m 55s | ~86k | — | — |
| R-13c | Memory Quality Regression Analysis | claude-opus-4-6 | — | ~1m 14s | ~72k | — | — |
| R-13d | Decision Deduplication Bug | claude-opus-4-6 | — | ~1m 42s | ~81k | — | — |
| R-13e | File Count & Key Files Pipeline | claude-opus-4-6 | — | ~1m 38s | ~96k | — | — |
| **R-13 Total** | 5 parallel agents | claude-opus-4-6 | — | **~2m 21s** (wall) | **~398k** | — | — |
| R-13f | Verification + Supplement | claude-opus-4-6[1m] | — | ~5m | ~350k | — | — |
| **Grand Total** | 19 agents across R-01–R-13 | | | **~54m** | **~10.5m** | — | — |

R-01 through R-10 ran as read-only leaf agents via cli-copilot with `--allow-all-tools`. R-11 ran via cli-codex with `--sandbox read-only` and `xhigh` reasoning (user-approved override of standing `high` preference). R-12 was analyzed directly by Claude Opus 4.6 with 3 parallel Explore agents + 1 Plan agent, then implemented (new validation rules + file fixes). R-13 ran as 5 parallel Claude Opus 4.6 research agents (read-only), synthesized by the orchestrating Opus session. R-13f was a verification pass by Claude Opus 4.6 (1M context) that read all 7 critical source files, verified every R-13 claim against actual code, and added 2 supplementary findings: (1) candidate competition trace showing `019-feature-flag-reference` wins with `lowConfidence: false` despite being the wrong folder, (2) per-issue R-series fix mapping for the 15:31 bad memory file revealing a NEW blocker extraction bug not covered by R-01–R-12. No source pipeline files were modified by R-01–R-11 or R-13. R-12 created 1 new validation rule and extended 2 existing files.
