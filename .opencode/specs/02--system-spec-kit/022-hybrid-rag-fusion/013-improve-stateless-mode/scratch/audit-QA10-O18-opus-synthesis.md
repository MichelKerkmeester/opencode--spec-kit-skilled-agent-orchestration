# QA10-O18: Opus Audit Synthesis — Deduplicated & Ranked Findings

**Date:** 2026-03-09
**Scope:** All 17 Opus audit files (QA1 through QA8)
**Synthesized by:** Claude Opus 4.6 (@review agent)
**Pipeline:** `.opencode/skill/system-spec-kit/scripts/`

---

## 1. Aggregate Counts

| Severity | Unique Findings | Duplicate Instances Merged |
|----------|----------------|---------------------------|
| **P0**   | 1              | 0                         |
| **P1**   | 30             | 12                        |
| **P2**   | 57             | 8                         |
| **TOTAL**| **88 unique**  | **20 merged**             |

### Per-File Score Summary

| # | Audit ID | File(s) Under Review | Score | P0 | P1 | P2 |
|---|----------|---------------------|-------|----|----|-----|
| 1 | O01 | `core/workflow.ts` | 76 | 0 | 4 | 6 |
| 2 | O02 | `extractors/collect-session-data.ts` | 84 | 0 | 3 | 5 |
| 3 | O03 | `utils/input-normalizer.ts` | 83 | 0 | 3 | 6 |
| 4 | O04 | `extractors/file-extractor.ts` | 88 | 0 | 1 | 6 |
| 5 | O05 | `extractors/spec-folder-extractor.ts` | 82 | 0 | 2 | 7 |
| 6 | O06 | `extractors/git-context-extractor.ts` | 86 | 0 | 1 | 7 |
| 7 | O07 | Integration (spec-folder + git + workflow) | 96 | 0 | 0 | 4 |
| 8 | O08 | `extractors/opencode-capture.ts` | 74 | 1 | 5 | 7 |
| 9 | O09 | `extractors/session-extractor.ts` | 79 | 0 | 1 | 8 |
| 10 | O10 | `extractors/decision-extractor.ts` | 84 | 0 | 5 | 8 |
| 11 | O11 | `core/config.ts` + `core/file-writer.ts` | 86 | 0 | 2 | 6 |
| 12 | O12 | `utils/slug-utils.ts` + `types/session-types.ts` | 72 | 0 | 2 | 8 |
| 13 | O13 | Cross-cutting: Data Flow Integrity | 91 | 0 | 1 | 10 |
| 14 | O14 | Cross-cutting: Type Contracts | 78 | 0 | 3 | 4 |
| 15 | O15 | Cross-cutting: Imports & Barrels | PASS | 0 | 0 | 3 |
| 16 | O16 | Cross-cutting: Provenance Markers | PARTIAL | 0 | 2 | 5 |
| 17 | O17 | Cross-cutting: Contamination Bypass | COND | 0 | 3 | 2 |

**Weighted Average Score (files with numeric scores): 81/100 — ACCEPTABLE**

---

## 2. Top 10 Most Critical Findings

### RANK 1 — P0: ConversationCapture/OpencodeCapture Interface Name Mismatch (DATA LOSS)

| Attribute | Detail |
|-----------|--------|
| **ID** | O08-P0-1 |
| **File** | `opencode-capture.ts:79-95` vs `input-normalizer.ts:106-113` |
| **Audits** | O08 |
| **Impact** | Silent data loss — `session_title`, `session_id`, `captured_at` are ALWAYS `undefined` at consumer sites because `ConversationCapture` uses snake_case but `OpencodeCapture` uses camelCase. Dynamic import + `as` cast bypasses TypeScript checking. |
| **Evidence** | `data-loader.ts:160` reads `conversation.sessionTitle` which is always `undefined` because the actual field is `session_title`. `input-normalizer.ts:527-528` passes `capture.sessionId` and `capture.capturedAt` — both always `undefined`. |
| **Fix** | Align `ConversationCapture` fields to camelCase to match `OpencodeCapture`, or add a mapping layer in the consumer. |

---

### RANK 2 — P1: Learning Weight Swap — context/uncertainty Coefficients Transposed

| Attribute | Detail |
|-----------|--------|
| **ID** | O02-P1-01 |
| **File** | `collect-session-data.ts:201-204` |
| **Audits** | O02 |
| **Impact** | Every `LEARNING_INDEX` calculation is silently corrupted. `du` (uncertainty delta) is multiplied by the context weight (0.35), and `dc` (context delta) by the uncertainty weight (0.25). Context improvements underweighted by 29%, uncertainty reductions overweighted by 40%. |
| **Evidence** | `du = deltaUncert` (L199), `dc = deltaContext` (L200). Config: `{ knowledge: 0.4, context: 0.35, uncertainty: 0.25 }`. The multiplication `du * CONFIG.LEARNING_WEIGHTS.context` applies 0.35 to uncertainty instead of context. |
| **Fix** | Swap: `(du * CONFIG.LEARNING_WEIGHTS.uncertainty) + (dc * CONFIG.LEARNING_WEIGHTS.context)` |

---

### RANK 3 — P1: Git Enrichment Leaks Cross-Spec Data (No Spec-Folder Scoping)

| Attribute | Detail |
|-----------|--------|
| **ID** | O17-P1-3 (also flagged in O06, O07) |
| **File** | `git-context-extractor.ts:117-187` |
| **Audits** | O17, O06, O07 |
| **Impact** | Git extractor operates at `projectRoot` scope, capturing ALL uncommitted changes and all commits from last 24 hours across the ENTIRE repository. Unrelated spec data leaks into memory files. Defeats the alignment guard (which validated original session data before enrichment). |
| **Evidence** | `extractGitContext(projectRoot)` uses `git status --porcelain` and `git log --since="24 hours ago"` with no path filtering. Compare with `transformOpencodeCapture` which has `specFolderHint` filtering. |
| **Fix** | Add `specFolderHint` parameter to `extractGitContext()` and filter status/log entries to paths containing spec-folder keywords. |

---

### RANK 4 — P1: `_manualTriggerPhrases` Stored but Never Consumed (Integration Gap)

| Attribute | Detail |
|-----------|--------|
| **ID** | O13-F03 |
| **File** | `workflow.ts` (trigger extraction pipeline, ~L843-884) |
| **Audits** | O13 |
| **Impact** | Spec-folder trigger phrases injected during enrichment are stored on `collectedData._manualTriggerPhrases` but the workflow trigger extraction pipeline NEVER reads them. These phrases are lost from search/retrieval indexing. |
| **Evidence** | Grep for `_manualTriggerPhrases` in `workflow.ts` shows zero read access. The trigger extraction at Step 8 builds from session content, summary, decisions, file paths — but ignores manual triggers. |
| **Fix** | After `preExtractedTriggers = ensureMinTriggerPhrases(...)`, merge `collectedData._manualTriggerPhrases` with dedup by lowercase. |

---

### RANK 5 — P1: Enriched Observations Skip Contamination Filter

| Attribute | Detail |
|-----------|--------|
| **ID** | O17-P1-1 + O17-P1-2 |
| **File** | `workflow.ts:736-748` |
| **Audits** | O17 |
| **Impact** | Contamination filter (`filterContamination`) is applied ONLY to `userPrompts`. Enriched observations, file descriptions, trigger phrases, decisions, and summary from spec-folder and git sources are never filtered. Git commit messages with AI chatter patterns ("I'll implement...", "Let me analyze...") flow into rendered memory unfiltered. |
| **Evidence** | `contamination-filter.ts` operates on `string` input only. workflow.ts L736-748 maps only `rawUserPrompts` through the filter. All 17 enrichment field paths documented in O17 Section 3 confirm zero filter coverage. |
| **Fix** | Apply `filterContamination()` to git commit subjects/bodies in `git-context-extractor.ts` before creating observation objects. |

---

### RANK 6 — P1: 39 Hidden Runtime Fields on SessionData via Index Signature

| Attribute | Detail |
|-----------|--------|
| **ID** | O14-F01 + O12-P1-01 |
| **File** | `session-types.ts:215`, `collect-session-data.ts:810-831` |
| **Audits** | O14, O12 |
| **Impact** | Three spread operators inject `ImplementationGuideData` (6 fields), `PreflightPostflightResult` (24 fields), and `ContinueSessionData` (9 fields) into the return value. None declared in `SessionData`. The `[key: string]: unknown` index signature silently absorbs them, defeating compile-time type safety. Consumers get `unknown` type for 39 fields. Refactoring any spread source silently breaks consumers. |
| **Evidence** | Verified field-by-field: all 39 fields exist at runtime but are invisible to TypeScript. `sessionData.HAS_IMPLEMENTATION_GUIDE` returns `unknown`, not `boolean`. |
| **Fix** | Extend `SessionData` from the three spread interfaces, or use intersection types. Remove/narrow the index signature. |

---

### RANK 7 — P1: Observation Provenance Markers Stripped by buildObservationsWithAnchors

| Attribute | Detail |
|-----------|--------|
| **ID** | O16-P1-02 (also flagged in O07, O13) |
| **File** | `file-extractor.ts:278-318` |
| **Audits** | O16, O07, O13 |
| **Impact** | `buildObservationsWithAnchors` transforms observations into `ObservationDetailed` which has NO `_provenance` or `_synthetic` fields. All provenance metadata permanently lost at this stage. Downstream consumers cannot distinguish synthetic observations from real ones. |
| **Evidence** | `ObservationDetailed` interface has 9 fields, none for provenance. Construction at L306-317 builds new objects with only declared fields. |
| **Fix** | Add optional `_PROVENANCE?: string` and `_SYNTHETIC?: boolean` to `ObservationDetailed` and propagate in the transformation. |

---

### RANK 8 — P1: Epoch-Seconds Timestamps Misinterpreted as Milliseconds

| Attribute | Detail |
|-----------|--------|
| **ID** | O03-P1-02 |
| **File** | `input-normalizer.ts:432, 468, 482` |
| **Audits** | O03 |
| **Impact** | `new Date(n)` interprets `n` as milliseconds. If OpenCode emits epoch-seconds (10-digit number), `new Date(1709913600)` yields 1970 instead of 2024. Corrupts session duration, observation ordering, expiry calculation. |
| **Evidence** | `CaptureExchange.timestamp` typed as `number | string`. No guard for epoch-seconds. `new Date(1709913600).toISOString()` = `1970-01-20T18:51:53.600Z`. |
| **Fix** | Add heuristic: `ts < 1e12 ? ts * 1000 : ts` before `new Date()`. |

---

### RANK 9 — P1: File Path Truncation Creates False Dedup Collisions

| Attribute | Detail |
|-----------|--------|
| **ID** | O04-P1-1 |
| **File** | `file-helpers.ts:19-24` (consumed at `file-extractor.ts:134`) |
| **Audits** | O04 |
| **Impact** | `toRelativePath` collapses paths >60 chars to `root/.../last-two-segments`. Two files like `src/modules/admin/components/shared/Button.tsx` and `src/modules/user/components/shared/Button.tsx` both become `src/.../shared/Button.tsx`, causing false dedup merge and silent data loss of one file entry. |
| **Evidence** | Path >60 chars → `parts[0]/.../parts[-2]/parts[-1]`. Same root + same last-2 segments = collision. |
| **Fix** | Use full normalized path as dedup key; truncate only for display. Or increase threshold significantly. |

---

### RANK 10 — P1: Anchor IDs Non-Deterministic Due to Date.now() in Hash

| Attribute | Detail |
|-----------|--------|
| **ID** | O10-P1-03 |
| **File** | `anchor-generator.ts:94` (called from `decision-extractor.ts:152, 365-368`) |
| **Audits** | O10 |
| **Impact** | `Date.now()` in the hash input means identical decision data produces different anchor IDs on every run. Breaks idempotency. Cross-referencing, deduplication, and linking systems cannot rely on stable anchor IDs across runs. |
| **Evidence** | `generateShortHash(\`${sectionTitle}|${additionalContext}|${Date.now()}\`)` — last component changes every millisecond. |
| **Fix** | Remove `Date.now()` from hash input, or replace with deterministic salt (spec folder + decision index). |

---

## 3. Systemic Patterns (Issues Appearing in 3+ Audits)

### Pattern A: Index Signature Abuse Defeats Type Safety
**Appearances:** O12, O14, O01, O02, O13
**Affected Interfaces:** `SessionData`, `CollectedDataFull`, `CollectedDataForFiles`, `DecisionRecord`, `PhaseEntry`, `ToolCallEntry`, `ConversationPhase`, `DiagramOutput`, `DecisionOption`
**Root Cause:** `[key: string]: unknown` index signatures added for Mustache template rendering convenience. This silently absorbs undeclared fields, prevents TypeScript from catching typos or removed fields, and hides 39+ runtime fields on `SessionData` alone.
**Recommendation:** Use a rendering adapter pattern: `function toTemplateData(session: SessionData): Record<string, unknown> { return { ...session }; }`. Remove index signatures from business-logic interfaces.

### Pattern B: Provenance/Synthetic Markers Created but Stripped or Ignored
**Appearances:** O16, O07, O13, O17
**Affected Pipeline Stages:** `buildObservationsWithAnchors` (strips observation markers), `enhanceFilesWithSemanticDescriptions` (strips file markers on match), quality-scorer (never reads markers), contamination-filter (never reads markers), templates (never render markers)
**Root Cause:** Markers were added for traceability in Spec 013 but the downstream pipeline (from Spec 012 and earlier) was not updated to preserve or use them.
**Recommendation:** (1) Propagate markers through all transformation stages. (2) Use markers in quality scoring to weight synthetic vs real data. (3) Consider rendering provenance badges in templates.

### Pattern C: Contamination Filter Has Narrow Scope
**Appearances:** O17, O03, O13
**Description:** The contamination filter only processes `userPrompts[].prompt` strings. Enrichment data (observations, file descriptions, trigger phrases, decisions, summary, recentContext) bypasses it entirely. Git commit messages with AI chatter patterns are the primary risk vector.
**Recommendation:** Apply contamination filtering to git commit messages at extraction time. Consider a structural filter that operates on observation narratives in addition to raw prompts.

### Pattern D: Duplicate/Incompatible Type Definitions for Same Domain Concepts
**Appearances:** O14, O03, O12, O04
**Affected Types:** `Observation` vs `ObservationInput` (incompatible `facts` types), `FileEntry` vs `FileChange` vs `FileInput` (different optionality/casing), `SpecFileEntry` vs `RelatedDoc` (different required fields), `ObservationInput` duplicated in `file-extractor.ts` and `implementation-guide-extractor.ts`
**Root Cause:** Organic growth across multiple specs without type unification. Dual-cased fields (`FILE_PATH`/`path`, `DESCRIPTION`/`description`) bridge old and new formats.
**Recommendation:** Create canonical types in `session-types.ts` for `FileReference` and `ObservationInput`. Normalize upstream so dual-casing is eliminated.

### Pattern E: Input Mutation Without Documented Contract
**Appearances:** O01, O02, O13
**Description:** Functions like `enrichStatelessData` and `collectSessionData` mutate their `collectedData` argument in-place via direct property assignment. The mutation is intentional but undocumented. Callers holding references to the original object see unexpected changes.
**Affected Functions:** `enrichStatelessData` (workflow.ts:433-527), `collectSessionData` SPEC_FOLDER backfill (collect-session-data.ts:733-734)
**Recommendation:** Add JSDoc `@mutates collectedData` annotations. Consider clone-then-mutate for test isolation.

### Pattern F: Silent Error Swallowing Hides Diagnostic Information
**Appearances:** O06, O08, O05, O11
**Description:** Multiple functions use empty `catch` blocks or `catch { return emptyResult() }` without logging. When enrichment or extraction silently fails, debugging "why is data missing?" is difficult.
**Affected:** `git-context-extractor.ts:184-186`, `opencode-capture.ts:157-161`, `spec-folder-extractor.ts` readDoc, `config.ts` (various catch blocks)
**Recommendation:** Add structured `warn`-level logging before returning fallback values.

---

## 4. Full Unique P1 Findings (Deduplicated)

| # | ID | File | Finding | Audits |
|---|-----|------|---------|--------|
| 1 | O02-P1-01 | collect-session-data.ts:201-204 | Learning weight swap (context/uncertainty transposed) | O02 |
| 2 | O02-P1-02 | collect-session-data.ts:733-734 | Mutation of caller-owned collectedData during SPEC_FOLDER backfill | O02, O01 |
| 3 | O02-P1-03 | collect-session-data.ts:678 | `sessionInfo` typed as `{}` loses type safety | O02 |
| 4 | O03-P1-01 | input-normalizer.ts:233-234 | `SPEC_FOLDER` (SCREAMING_CASE) silently dropped during normalization | O03, O13 |
| 5 | O03-P1-02 | input-normalizer.ts:432,468,482 | Epoch-seconds timestamps misinterpreted as milliseconds | O03 |
| 6 | O03-P1-03 | input-normalizer.ts:413 | Relevance keyword filter drops short but valid segments (>2 chars) | O03 |
| 7 | O04-P1-1 | file-helpers.ts:19-24 | Path truncation creates false dedup collisions | O04 |
| 8 | O05-P1-1 | spec-folder-extractor.ts:275 | Observation capping silently drops progress/checklist data | O05 |
| 9 | O05-P1-2 | spec-folder-extractor.ts:54-65 | parseFrontmatter overwrites string value when followed by YAML list items | O05 |
| 10 | O06-P1-1 | git-context-extractor.ts:89-93 | parseStatScores captures brace-wrapped rename paths verbatim | O06 |
| 11 | O08-P1-1 | opencode-capture.ts:200-218 | getProjectId checks only first session file | O08 |
| 12 | O08-P1-2 | opencode-capture.ts:472-475 | Timestamp matching produces NaN on missing timestamps | O08 |
| 13 | O08-P1-3 | opencode-capture.ts:460-501 | buildExchanges greedy first-match pairs wrong prompt | O08 |
| 14 | O08-P1-4 | opencode-capture.ts:133-172 | File handle leak in readJsonlTail on partial read errors | O08 |
| 15 | O08-P1-5 | opencode-capture.ts:193-224 | getProjectId uses synchronous I/O in async module | O08 |
| 16 | O09-P1-01 | session-extractor.ts:290-292 | Negative duration unguarded (first > last timestamp) | O09 |
| 17 | O10-P1-01 | decision-extractor.ts:262 | Confidence score from regex unclamped (can exceed 100) | O10 |
| 18 | O10-P1-02 | decision-extractor.ts:168 | Unreachable confidence branch in manual decision path | O10 |
| 19 | O10-P1-03 | anchor-generator.ts:94 | Anchor IDs non-deterministic due to Date.now() in hash | O10 |
| 20 | O10-P1-04 | decision-extractor.ts:343,362-383 | MCP-path decisions have empty anchor IDs until post-processing | O10 |
| 21 | O10-P1-05 | decision-extractor.ts:168,261 | Duplicate confidence-scoring logic across two paths | O10 |
| 22 | O11-P1-1 | config.ts:162-167,210,252 | learningWeights sub-object never validated | O11 |
| 23 | O11-P1-2 | config.ts:179-201 | Brace-depth JSON parser ignores braces inside strings | O11 |
| 24 | O12-P1-01 | session-types.ts:215 | SessionData index signature hides ~30 undeclared spread fields | O12, O14 |
| 25 | O12-P1-02 | session-extractor.ts:25-37 | ToolCounts index signature masks missing required fields | O12 |
| 26 | O13-F03 | workflow.ts (~L843-884) | _manualTriggerPhrases stored but never consumed | O13 |
| 27 | O14-F02 | session-extractor.ts:74 vs file-extractor.ts:38 | Observation vs ObservationInput incompatible facts types | O14 |
| 28 | O14-F03 | Multiple files | FileEntry/FileChange/FileInput represent same concept with incompatible shapes | O14 |
| 29 | O16-P1-01 | file-extractor.ts:238-242,262-268 | enhanceFilesWithSemanticDescriptions strips provenance markers on match | O16, O13 |
| 30 | O16-P1-02 | file-extractor.ts:278-318 | buildObservationsWithAnchors strips all observation provenance markers | O16, O07, O13 |

*Note: O17's three P1 findings (enriched obs skip filter, field name evasion, git cross-spec leakage) are represented as Rank 3 and Rank 5 above. The field-name-evasion finding is a facet of the contamination filter scope issue (same root cause as Rank 5), so they are consolidated.*

---

## 5. Additional P1 from Cross-Cutting Audits

| # | ID | Finding | Audits |
|---|-----|---------|--------|
| 31 | O01-F01 | `isStatelessMode` vs `_source` semantic mismatch (dual-gate inconsistency) | O01 |
| 32 | O01-F02 | Dead code: sessionDataFn null check unreachable | O01 |
| 33 | O01-F03 | TOOL_COUNT patch uses unsafe `any` cast | O01 |
| 34 | O01-F04 | enrichStatelessData mutates collectedData in-place (undocumented contract) | O01, O02 |
| 35 | O17-P1-1+2 | Enriched observations/fields skip contamination filter entirely | O17 |
| 36 | O17-P1-3 | Git enrichment has no spec-folder scoping (cross-spec leakage) | O17, O06 |

*Some entries above overlap with the Top 10 and are listed for completeness of the canonical P1 inventory.*

---

## 6. P0 Inventory (Complete)

| # | ID | File | Finding | Status |
|---|-----|------|---------|--------|
| 1 | O08-P0-1 | opencode-capture.ts:79-95 | ConversationCapture/OpencodeCapture naming mismatch causes silent data loss | CONFIRMED — must fix before next release |

---

## 7. Deduplication Notes

The following findings appeared in multiple audits and were merged:

| Finding | Appeared In | Canonical ID |
|---------|-------------|-------------|
| SessionData index signature / hidden fields | O12, O14 | O12-P1-01 |
| SPEC_FOLDER uppercase not mapped | O03, O13 | O03-P1-01 |
| Observation provenance stripped | O16, O07, O13 | O16-P1-02 |
| File provenance stripped by semantic enhancement | O16, O13 | O16-P1-01 |
| enrichStatelessData in-place mutation | O01, O02 | O01-F04 |
| Git cross-spec leakage | O17, O06, O07 | O17-P1-3 |
| Input mutation contract undocumented | O01, O02 | O02-P1-02 |
| Duplicate type definitions (Observation/FileEntry variants) | O14, O03, O12 | O14-F02, O14-F03 |
| Contamination filter narrow scope | O17, O03, O13 | O17-P1-1+2 |
| `_manualTriggerPhrases` dead field | O13 (confirmed), O03 (noted) | O13-F03 |
| Dual quality scorer maintenance burden | O01 (P2) | O01-F05 |
| Observation dedup by title may merge semantically different items | O04 (P2), O07 (P2), O13 (P2) | consolidated P2 |

---

## 8. Priority Fix Batches

### Batch 1: Critical (Fix Immediately)
1. **O08-P0-1** — Align ConversationCapture fields to camelCase
2. **O02-P1-01** — Fix learning weight swap (du*uncertainty, dc*context)
3. **O17-P1-3** — Add specFolderHint to git-context-extractor

### Batch 2: High Priority (Fix This Sprint)
4. **O13-F03** — Merge _manualTriggerPhrases into trigger pipeline
5. **O17-P1-1** — Apply contamination filter to git commit messages
6. **O03-P1-02** — Add epoch-seconds guard to timestamp conversion
7. **O04-P1-1** — Use full path as dedup key (not truncated path)
8. **O10-P1-03** — Remove Date.now() from anchor hash
9. **O08-P1-2** — Fix NaN propagation in timestamp matching
10. **O08-P1-3** — Track consumed prompts in buildExchanges

### Batch 3: Type Safety (Fix This Cycle)
11. **O12-P1-01 / O14-F01** — Extend SessionData from spread interfaces
12. **O14-F02** — Unify Observation/ObservationInput types
13. **O14-F03** — Create canonical FileReference type
14. **O16-P1-01** — Preserve provenance in enhanceFilesWithSemanticDescriptions
15. **O16-P1-02** — Add provenance fields to ObservationDetailed

### Batch 4: Hardening (Next Sprint)
16-36. Remaining P1 findings (config validation, parser fixes, dead code removal, etc.)

---

## 9. Architecture Health Summary

| Dimension | Health | Key Concern |
|-----------|--------|-------------|
| **Import Graph** | EXCELLENT | Acyclic, clean layering, correct barrel exclusions |
| **Data Flow** | GOOD | All critical fields survive; one dead-weight field; one integration gap |
| **Type Safety** | WEAK | Index signatures on 9 interfaces; 39 hidden fields; 3 incompatible type variants |
| **Contamination Prevention** | MODERATE | Alignment guard correctly ordered; filter scope too narrow for enrichment |
| **Provenance Tracking** | PARTIAL | Created correctly; stripped at 2 transformation stages; never consumed |
| **Error Handling** | ADEQUATE | All fatal ops propagate; 4+ modules silently swallow non-fatal errors |
| **Security** | STRONG | Path traversal guards, no injection vectors, CSPRNG session IDs |

---

*Synthesis completed by @review agent. Read-only analysis — no files modified.*
