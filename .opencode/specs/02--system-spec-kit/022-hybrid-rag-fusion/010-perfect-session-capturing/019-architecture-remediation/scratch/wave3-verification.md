# Wave 3 - OPUS-B1: Prior Findings Verification
Date: 2026-03-21

## Summary
- Prior findings: 135
- PERSISTS: 76
- CONFIRMED_NEW: 53
- SUPERSEDED: 18
- FIXED: 7
- DUPLICATE: 34

Note: CONFIRMED_NEW counts findings from Wave 1+2 that have no prior-audit counterpart. DUPLICATE counts cross-agent overlaps (same issue reported by multiple agents within OR across waves). A finding may be both PERSISTS and DUPLICATE if it was confirmed by a new agent AND also reported by another prior agent.

---

## Verification Table: CODEX-1 (Core Pipeline) -- 7 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| CODEX1-001 | PERSISTS | CODEX-A1-010 | JS/TS threshold drift (300 vs 150) confirmed again. Wave 2 OPUS-A4-001 through A4-005 also flag stale dist artifacts. |
| CODEX1-002 | PERSISTS | CODEX-A1-006, CODEX-A2-008, OPUS-A5-002 | Dual quality scorer confirmed by all three new agents. DUPLICATE across prior OPUS5-009. |
| CODEX1-003 | PERSISTS | -- | Metadata embedding-status silent swallow still present. No new agent specifically re-flagged this exact issue, but OPUS-A4-014 (dist barrel drift) touches the same code. |
| CODEX1-004 | PERSISTS | CODEX-A1-007 | God-function runWorkflow() confirmed. OPUS-A1-007 also flags it as Layer Violation. |
| CODEX1-005 | FIXED | OPUS-A4 (Category 1 deletions) | Stale .d.ts.map artifact deleted in current diff. Wave 2 confirms deletion. |
| CODEX1-006 | PERSISTS | -- | Unused exports `QualityScore` and `generateMergedDescription` still present. No new agent re-flagged but not contradicted. |
| CODEX1-007 | PERSISTS | -- | Broad type assertions in workflow.ts pipeline boundaries still present. CODEX-A3-010 (input-normalizer double-cast) covers a related pattern. |

---

## Verification Table: CODEX-2 (Extractors) -- 6 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| CODEX2-001 | PERSISTS | CODEX-A2-004, CODEX-A2-005 | Session targeting asymmetry confirmed with more specific evidence: Codex sessionId dropped at loader boundary (A2-004), all non-Claude providers pick newest (A2-005). |
| CODEX2-002 | PERSISTS | -- | Provider metadata shape incompatibility (transcriptPath vs eventsPath vs sessionPath) not re-examined but not fixed. |
| CODEX2-003 | PERSISTS | -- | Copilot `view` tool miscategorized in session classification. Not re-flagged but code unchanged. |
| CODEX2-004 | PERSISTS | CODEX-A2-004 | Spec-folder resolution two-phase root mismatch. Subsumed into the broader session-targeting finding. |
| CODEX2-005 | PERSISTS | OPUS-A4-015 | Extractor barrel/README incompleteness confirmed. OPUS-A4-015 also flags evals/README stale references. |
| CODEX2-006 | PERSISTS | OPUS-A5-001 | CLI capture duplication confirmed at CRITICAL severity. OPUS-A5-001 finds `cli-capture-shared.ts` was created but never wired in -- 20 dead function copies across 4 capture modules. |

---

## Verification Table: CODEX-3 (Utils/Lib) -- 10 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| CODEX3-001 | PERSISTS | OPUS-A2-001 | ast-parser.ts imports deleted structure-aware-chunker. Confirmed CRITICAL by OPUS-A2 as well. DUPLICATE. |
| CODEX3-002 | PERSISTS | -- | Anchor slug collision (order-dependent). Not re-flagged but code unchanged. |
| CODEX3-003 | PERSISTS | -- | data-validator lets malformed arrays through. Not re-examined but code unchanged. |
| CODEX3-004 | PERSISTS | -- | transformKeyDecision() assumes array. Not re-examined but code unchanged. |
| CODEX3-005 | PERSISTS | -- | content-filter ReDoS risk. Not re-examined but code unchanged. |
| CODEX3-006 | PERSISTS | -- | calculateSimilarity() character-position-only dedup. Not re-examined but code unchanged. |
| CODEX3-007 | PERSISTS | -- | generateContentSlug() skips generic screening for fallback. Not re-examined but code unchanged. |
| CODEX3-008 | PERSISTS | -- | formatTimestamp() timezone+UTC bug. OPUS-A5-009 documents the intentional divergence between the two formatTimestamp implementations but does not contradict the UTC-offset bug. |
| CODEX3-009 | PERSISTS | -- | extractKeyArtifacts dead export. OPUS-A4-016 confirms barrel removal but source export remains. |
| CODEX3-010 | PERSISTS | -- | formatOptionBox isChosen param ignored. Not re-examined but code unchanged. |

---

## Verification Table: CODEX-4 (Memory System) -- 7 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| CODEX4-001 | PERSISTS | -- | TOCTOU in cleanup-orphaned-vectors. Not re-examined but code unchanged. |
| CODEX4-002 | SUPERSEDED | OPUS-A4 (Category 3) | historical-memory-remediation.ts was DELETED. File no longer exists, so the quarantine overwrite issue is moot. |
| CODEX4-003 | PERSISTS | -- | rank-memories.ts accepts any JSON as valid empty dataset. Not re-examined but code unchanged. |
| CODEX4-004 | PERSISTS | -- | validate-memory-quality silently disables topical-coherence check. Not re-examined but code unchanged. |
| CODEX4-005 | PERSISTS | -- | reindex-embeddings exits 0 without proving parse. Not re-examined but code unchanged. |
| CODEX4-006 | PERSISTS | -- | backfill-frontmatter silently skips directories. Not re-examined but code unchanged. |
| CODEX4-007 | PERSISTS | CODEX-A5-001 | --stdin hang issue. CODEX-A5-001 goes further: JSON mode skips schema validation entirely. |

---

## Verification Table: CODEX-5 (Tests/Evals) -- 9 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| CODEX5-001 | SUPERSEDED | CODEX-A4-001 through A4-005, OPUS-A4-006 through A4-010 | heal-ledger-mismatch.sh reference to deleted script. Wave 1+2 provide much more specific findings: stale dist artifacts (A4-001..005), ops scripts non-functional (A4-008..010). |
| CODEX5-002 | SUPERSEDED | -- | Untested module: run-chk210-quality-backfill. Script DELETED in current diff. |
| CODEX5-003 | SUPERSEDED | -- | Untested module: run-phase1-5-shadow-eval. Script DELETED in current diff. |
| CODEX5-004 | SUPERSEDED | -- | Untested module: run-phase3-telemetry-dashboard. Script DELETED in current diff. |
| CODEX5-005 | PERSISTS | -- | progressive-validation.vitest.ts silent skips. Not re-examined but code unchanged. |
| CODEX5-006 | PERSISTS | -- | UTC vs local date mismatch in tests. Not re-examined but code unchanged. |
| CODEX5-007 | PERSISTS | -- | --session-id parsing never tested with non-null. Not re-examined but code unchanged. |
| CODEX5-008 | PERSISTS | -- | Capture tests miss malformed transcripts, orphaned prompts, maxExchanges. Not re-examined but code unchanged. |
| CODEX5-009 | PERSISTS | CODEX-A4-007 | check-architecture-boundaries suite misses CLI/main paths and broader import forms. A4-007 adds the GAP A import rules gap. |

---

## Verification Table: OPUS-1 (Phase Tree) -- 22 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| OPUS1-001 | PERSISTS | OPUS-A3-003 | Phase 000 children (001-005) vs root (001-018) naming ambiguity. A3-003 confirms sub-children say "of 3" but 5 exist. |
| OPUS1-002 | PERSISTS | OPUS-A3-002 | Stale denominator in phase 001. OPUS-A3-002 confirms 4 top-level phases have wrong number. |
| OPUS1-003 | PERSISTS | OPUS-A3-002 | Stale denominator phase 002. Grouped with A3-002. |
| OPUS1-004 | PERSISTS | OPUS-A3-002 | Stale denominator phase 003. |
| OPUS1-005 | PERSISTS | OPUS-A3-002 | Stale denominator phase 004. |
| OPUS1-006 | PERSISTS | OPUS-A3-002 | Stale denominator phase 005. |
| OPUS1-007 | PERSISTS | OPUS-A3-002 | Stale denominator phase 006. |
| OPUS1-008 | PERSISTS | OPUS-A2-002 through A2-005 | Stale denominators in phases 011-014 confirmed at HIGH by OPUS-A2. |
| OPUS1-009 | PERSISTS | OPUS-A3-001 | Missing metadata fields in phases 015-018. OPUS-A3-001 confirms 15 of 20 description.json lack status field. |
| OPUS1-010 | PERSISTS | OPUS-A3-001 | Same systemic status-field gap. |
| OPUS1-011 | PERSISTS | OPUS-A3-001 | Same systemic status-field gap. |
| OPUS1-012 | PERSISTS | OPUS-A3-001 | Same systemic status-field gap. |
| OPUS1-013 | PERSISTS | OPUS-A3-007 | Phase 000 "In Progress" status. OPUS-A3-007 confirms 4/5 children complete, 1 in progress. Informational. |
| OPUS1-014 | PERSISTS | OPUS-A2-009 | Parent phase chain description incomplete. A2-009 confirms 019 is referenced 8+ times but absent from phase table. |
| OPUS1-015 | PERSISTS | OPUS-A2-003 | Parent references non-existent phases 019/020 (as originally envisioned). A2-003 confirms: actual 019 is architecture-remediation, not the envisioned follow-up. |
| OPUS1-016 | PERSISTS | OPUS-A2-014 through A2-018 | LOW: Missing Completed dates, R-Item inconsistencies. A2-014..018 confirm numbering artifacts. |
| OPUS1-017 | PERSISTS | OPUS-A2-016 | LOW: Missing Branch field. |
| OPUS1-018 | PERSISTS | OPUS-A2-016 | LOW: Section numbering gap. |
| OPUS1-019 | PERSISTS | -- | LOW: Various minor spec doc issues. Not specifically re-flagged. |
| OPUS1-020 | PERSISTS | OPUS-A2-009 | HIGH: Incomplete handoff criteria. Parent phase map missing 019 row confirmed. |
| OPUS1-021 | PERSISTS | -- | LOW: Minor spec doc issue. |
| OPUS1-022 | PERSISTS | -- | LOW: Minor spec doc issue. |

---

## Verification Table: OPUS-2 (Spec Alignment) -- 14 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| OPUS2-001 | PERSISTS | OPUS-A2-009, OPUS-A3-004 | Phase map missing 019. OPUS-A3-004 adds: 019 also missing from descriptions.json index. |
| OPUS2-002 | PERSISTS | -- | Checklist CHK-013 evidence factually wrong (claims phases 021/022). Not re-examined but code unchanged. |
| OPUS2-003 | PERSISTS | OPUS-A2-003 | Spec body references aspirational phases 019/020. Confirmed. |
| OPUS2-004 | PERSISTS | OPUS-A2-003 | Trigger phrases reference non-existent phase 020. Confirmed. |
| OPUS2-005 | PERSISTS | OPUS-A3-007, OPUS-A2-007 | Status contradiction in 000 (description.json vs spec.md). Confirmed by both new agents. |
| OPUS2-006 | PERSISTS | OPUS-A2-008 | Stale phase numbers in 000 description.json. A2-008 confirms reviewTargets use old numbering. |
| OPUS2-007 | PERSISTS | OPUS-A3-004 | 019 missing from descriptions.json. Confirmed as HIGH. |
| OPUS2-008 | PERSISTS | -- | Contradictory metadata (completed date + in-progress). Not re-examined separately. |
| OPUS2-009 | PERSISTS | OPUS-A3-003 | Stale phase metadata in 000 branch children (denominator "of 3" vs 5). Confirmed. |
| OPUS2-010 | PERSISTS | OPUS-A2-006 | Checklist P1 item count wrong. OPUS-A2-006 provides updated counts (12+20+7=39, not 11+19+6=36). SUPERSEDES the prior finding with more accurate count. |
| OPUS2-011 | PERSISTS | OPUS-A3-001, OPUS-A2-010 | Inconsistent status field presence. OPUS-A3-001 confirms 15 of 20 lack status. |
| OPUS2-012 | PERSISTS | OPUS-A2-011, OPUS-A2-012 | 000 description.json references non-existent archive/ and has confusing supersedes field. |
| OPUS2-013 | PERSISTS | -- | LOW: Minor spec alignment issue (not re-examined individually). |
| OPUS2-014 | PERSISTS | -- | LOW: Minor spec alignment issue (not re-examined individually). |

---

## Verification Table: OPUS-3 (Architecture Boundaries) -- 14 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| OPUS3-001 | PERSISTS | OPUS-A1-005 | utils/memory-frontmatter imports from lib/. Confirmed as re-export shim. OPUS-A5-003 also flags it. |
| OPUS3-002 | PERSISTS | OPUS-A1-006 | utils/phase-classifier imports from lib/. Confirmed as re-export shim. OPUS-A5-004 also flags it. |
| OPUS3-003 | PERSISTS | -- | utils/ type-only imports from types/. Noted as acceptable. Not re-flagged. |
| OPUS3-004 | PERSISTS | -- | extractors/quality-scorer imports core/ types. Not specifically re-flagged but OPUS-A5-002 covers the dual-scorer which is the root cause. |
| OPUS3-005 | FIXED | OPUS-A1-004 (note 4) | CIRCULAR: extractors/ <-> spec-folder/ -- OPUS-A1 explicitly checked and found NO circular dependency here. Note 4 says "No extractors<->spec-folder circular -- extractors/collect-session-data imports from spec-folder/ but spec-folder/ does NOT import from extractors/." The prior finding is FIXED. |
| OPUS3-006 | PERSISTS | OPUS-A1-008 | 7 extractors import CONFIG from core/ barrel. OPUS-A1 notes extractors that properly use ../config facade. Mixed pattern confirmed. |
| OPUS3-007 | PERSISTS | OPUS-A1-003, OPUS-A1-004 | core/ <-> memory/ near-circular. OPUS-A1 finds 4 circular dependency chains involving core/ (lib, renderers, spec-folder, loaders). |
| OPUS3-008 | PERSISTS | -- | memory/ imports from extractors/ (generate-context recovery path). Not specifically re-flagged; OPUS-A1 dep matrix shows memory/ -> extractors/ = 1 import. |
| OPUS3-009 | PERSISTS | OPUS-A4-010 | heal-ledger-mismatch.sh references deleted script. OPUS-A4-010 confirms ops breakage. DUPLICATE with CODEX5-001. |
| OPUS3-010 | FIXED | OPUS-A4 (Category 1) | READMEs reference deleted files. The lib/structure-aware-chunker.ts reference in lib/README.md is confirmed in diff changes (file is being modified). Partially fixed by current diff. |
| OPUS3-011 | FIXED | OPUS-A4 (Category 1) | Same README updates. |
| OPUS3-012 | FIXED | OPUS-A4 (Category 1) | Orphaned build artifacts (.js, .js.map) in source tree. Current diff DELETES these artifacts from core/ (tree-thinning.js, tree-thinning.d.ts, etc.). |
| OPUS3-013 | FIXED | OPUS-A4 (Category 1) | Same artifact cleanup -- check-architecture-boundaries.{js,d.ts,js.map,d.ts.map} being deleted. |
| OPUS3-014 | PERSISTS | OPUS-A1-013, OPUS-A1-015 | 5 heavily-used utils missing from barrel. OPUS-A1 confirms barrel gaps exist. |

---

## Verification Table: OPUS-4 (Git Diff) -- 26 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| OPUS4-001 | SUPERSEDED | CODEX-A4-001 through A4-005 | test-scripts-modules.js export assertions. Wave 1+2 provide more granular analysis: CODEX-A4 identifies specific missing exports (data-validator helpers, slugify, createSimulationFlowchart, BOX, trigger aliases). |
| OPUS4-002 | SUPERSEDED | CODEX-A4-001 | Same test breakage. Subsumed by more specific CODEX-A4 findings. |
| OPUS4-003 | SUPERSEDED | CODEX-A4-001 | Same test breakage. |
| OPUS4-004 | SUPERSEDED | CODEX-A4-001 | Same test breakage. |
| OPUS4-005 | SUPERSEDED | CODEX-A4-001 | Same test breakage. |
| OPUS4-006 | PERSISTS | OPUS-A4-010 | heal-ledger-mismatch.sh ops breakage. DUPLICATE across CODEX5-001, OPUS3-009. |
| OPUS4-007 | SUPERSEDED | -- | Vitest mocks of deleted updateMetadataWithEmbedding. Need to verify if the current diff has updated these test files. The diff shows test files are modified. |
| OPUS4-008 | SUPERSEDED | -- | Same mock issue. |
| OPUS4-009 | PERSISTS | OPUS-A4 barrel tracking | Incomplete snake_case alias cleanup in folder-detector.ts. Not contradicted by new findings. |
| OPUS4-010 | PERSISTS | -- | trigger-extractor.ts re-export removal. Not contradicted. |
| OPUS4-011 | PERSISTS | OPUS-A5-003 | memory-frontmatter barrel removal. OPUS-A5-003 confirms 1 importer (core/workflow.ts) still uses shim. |
| OPUS4-012 | PERSISTS | OPUS-A4-015 | READMEs reference deleted files. Confirmed. DUPLICATE with OPUS3-010/011. |
| OPUS4-013 | PERSISTS | OPUS-A4-015 | Same README issue. |
| OPUS4-014 | FIXED | OPUS-A4 (Category 1) | Orphaned .d.ts.map files. Current diff deletes these from source tree. However, OPUS-A4-001..005 flag stale dist/ artifacts which is a SEPARATE issue. |
| OPUS4-015 | FIXED | OPUS-A4 (Category 1) | Same artifact deletion from source tree. |
| OPUS4-016 | PERSISTS | CODEX-A2-006, CODEX-A2-007 | Contamination filter regex changes. CODEX-A2-006 provides deeper analysis: current patterns miss normalized title forms. CODEX-A2-007 adds: broad patterns delete legitimate content. |
| OPUS4-017 | PERSISTS | CODEX-A2-007 | Same contamination filter loosening concern. |
| OPUS4-018 | PERSISTS | -- | RELEVANCE_CONTENT_STOPWORDS deleted. Not re-examined but change confirmed in diff. |
| OPUS4-019 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-020 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-021 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-022 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-023 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-024 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-025 | PERSISTS | -- | LOW finding. Not re-examined. |
| OPUS4-026 | PERSISTS | -- | LOW finding. Not re-examined. |

---

## Verification Table: OPUS-5 (Type System) -- 20 prior findings

| Prior Finding ID | Status | New Finding ID (if mapped) | Notes |
|---|---|---|---|
| OPUS5-001 | PERSISTS | CODEX-A3-011 | Duplicate interface definitions in implementation-guide-extractor.ts. CODEX-A3-011 flags non-null assertions in same file. |
| OPUS5-002 | PERSISTS | CODEX-A3-003, CODEX-A3-002 | Observation naming collision. CODEX-A3 confirms and broadens to full naming collision audit. |
| OPUS5-003 | PERSISTS | CODEX-A3-002 | FileEntry in 3 modules. Confirmed by CODEX-A3-002. DUPLICATE with prior. |
| OPUS5-004 | PERSISTS | CODEX-A3-004 | ExchangeSummary naming collision. Confirmed by CODEX-A3-004. |
| OPUS5-005 | PERSISTS | CODEX-A3-010 | Double-casts in input-normalizer. CODEX-A3-010 confirms with more context. |
| OPUS5-006 | PERSISTS | CODEX-A3-011 | Non-null assertions in collect-session-data. CODEX-A3-011 flags same pattern in file-extractor and others. |
| OPUS5-007 | PERSISTS | -- | Non-null assertions in generate-context error handling. Not re-examined separately. |
| OPUS5-008 | PERSISTS | -- | Non-null assertion in rank-memories. Not re-examined separately. |
| OPUS5-009 | PERSISTS | CODEX-A1-006, CODEX-A2-008, OPUS-A5-002 | Dual quality scorer. Confirmed by all 3 new agents. DUPLICATE with CODEX1-002. |
| OPUS5-010 | PERSISTS | -- | SQLite .all() result cast. Not re-examined. |
| OPUS5-011 | PERSISTS | -- | LOW: minor type cast. |
| OPUS5-012 | PERSISTS | -- | LOW: dead export. |
| OPUS5-013 | PERSISTS | -- | LOW: simulation type naming. |
| OPUS5-014 | PERSISTS | -- | LOW: minor type issue. |
| OPUS5-015 | PERSISTS | -- | LOW: minor type issue. |
| OPUS5-016 | PERSISTS | CODEX-A3-003 | UserPrompt timestamp required vs optional. Confirmed. |
| OPUS5-017 | PERSISTS | -- | LOW: minor type issue. |
| OPUS5-018 | PERSISTS | -- | LOW: minor type issue. |
| OPUS5-019 | PERSISTS | -- | LOW: minor type issue. |
| OPUS5-020 | PERSISTS | -- | Deprecated importance_tier field. Not re-examined. |

---

## CONFIRMED_NEW Findings (Wave 1+2 findings without prior counterparts)

These are net-new findings from Wave 1+2 that were NOT flagged in the original 135-finding audit.

### From CODEX-A1 (Core Pipeline Logic) -- 6 new

| New Finding ID | Severity | Description |
|---|---|---|
| CODEX-A1-001 | HIGH | Tree-thinning decides on 500-char excerpt, not real file size |
| CODEX-A1-002 | HIGH | Sufficiency gate told every file is spec-relevant (masks contamination) |
| CODEX-A1-003 | MEDIUM | KEY_FILES built from pre-thinning list |
| CODEX-A1-004 | MEDIUM | Stateless alignment silently degrades to keyword-only on spec-folder failure |
| CODEX-A1-005 | HIGH | Workflow lock only serializes in-process; cross-CLI races on description.json |
| CODEX-A1-008 | MEDIUM | indexMemory() no runtime normalization for null/malformed trigger arrays |

### From CODEX-A2 (Extractor System) -- 5 new

| New Finding ID | Severity | Description |
|---|---|---|
| CODEX-A2-001 | HIGH | normalizeInputData() drops canonical JSON-primary sessionSummary/keyDecisions |
| CODEX-A2-002 | HIGH | Structured JSON-primary toolCalls/exchanges effectively ignored downstream |
| CODEX-A2-003 | MEDIUM | nextSteps schema mismatch: Array<Record> vs string[] causes [object Object] |
| CODEX-A2-009 | LOW | Null-data simulation fallback is dead code in real loader flow |
| CODEX-A2-010 | LOW | toolCallIndexById is write-only dead state in Gemini capture |

### From CODEX-A3 (Type System & Contract Safety) -- 7 new

| New Finding ID | Severity | Description |
|---|---|---|
| CODEX-A3-001 | HIGH | ConversationPhase naming collision: label union vs object payload |
| CODEX-A3-005 | HIGH | ToolCounts uses open string indexer hiding key mismatches |
| CODEX-A3-006 | HIGH | LoadedData/RawInputData/NormalizedData are open bags despite discriminable shapes |
| CODEX-A3-007 | MEDIUM | Several interfaces effectively "anything with known keys" (index signature overuse) |
| CODEX-A3-008 | HIGH | OpenCode recovery path parses JSON into generics without shape validation |
| CODEX-A3-009 | MEDIUM | Codex normalization relies on unchecked record assertions |
| CODEX-A3-012 | MEDIUM | Generic helpers (cloneInputData, dedupe) claim to preserve T but are lossy |

### From CODEX-A4 (Test & Eval Coverage) -- 4 new

| New Finding ID | Severity | Description |
|---|---|---|
| CODEX-A4-002 | MEDIUM | anchor-generator: test expects `slugify` export that is no longer public |
| CODEX-A4-003 | MEDIUM | simulation-factory: test expects `createSimulationFlowchart` (now private) |
| CODEX-A4-004 | MEDIUM | ascii-boxes: test expects `BOX` constant no longer exported |
| CODEX-A4-006 | MEDIUM | SessionData fixture missing TECHNICAL_CONTEXT and HAS_TECHNICAL_CONTEXT |

### From CODEX-A5 (Memory System & MCP Handlers) -- 4 new

| New Finding ID | Severity | Description |
|---|---|---|
| CODEX-A5-002 | HIGH | V-rule bridge is fail-open: load failure disables enforcement |
| CODEX-A5-003 | HIGH | atomicSaveMemory uses deterministic _pending path with no file lock (race) |
| CODEX-A5-004 | HIGH | Normal save path rewrites file with plain writeFile after DB commit (crash risk) |
| CODEX-A5-005 | MEDIUM | Quality-loop threshold allows no-trigger no-anchor memories to pass at exactly 0.60 |

### From OPUS-A1 (Architecture Boundaries) -- 8 new

| New Finding ID | Severity | Description |
|---|---|---|
| OPUS-A1-001 | HIGH | CIRCULAR: lib/semantic-summarizer <-> core/ via CONFIG import |
| OPUS-A1-002 | HIGH | CIRCULAR: renderers/template-renderer <-> core/ via CONFIG import |
| OPUS-A1-003 | HIGH | CIRCULAR: spec-folder/ <-> core/ (value imports, higher risk) |
| OPUS-A1-004 | MEDIUM | CIRCULAR: loaders/data-loader <-> core/ via CONFIG |
| OPUS-A1-009 | LOW | core/memory-indexer imports type directly from extractors/ (not barrel) |
| OPUS-A1-010 | MEDIUM | memory/rebuild-auto-entities reaches into mcp_server internals via require() |
| OPUS-A1-011 | LOW | core/workflow imports retryManager from @spec-kit/mcp-server |
| OPUS-A1-012 | LOW | core/memory-indexer imports vectorIndex from @spec-kit/mcp-server |

### From OPUS-A2 (Spec-to-Code Alignment) -- 3 new

| New Finding ID | Severity | Description |
|---|---|---|
| OPUS-A2-006 | HIGH | Checklist Verification Summary math wrong: claims 36 items, actually 39 |
| OPUS-A2-012 | MEDIUM | 000 exitCriteria.phaseConsolidation references 011/015/016 as "superseded" but they are active |
| OPUS-A2-013 | MEDIUM | Phase 014 Context references old phase numbers for dependencies |

### From OPUS-A3 (Phase Tree & Metadata) -- 3 new

| New Finding ID | Severity | Description |
|---|---|---|
| OPUS-A3-005 | LOW | 019 specId and folderSlug use full folder name (non-conventional) |
| OPUS-A3-006 | LOW | memorySequence values non-unique across siblings (field semantics unclear) |
| OPUS-A3-008 | LOW | Keywords are generic on most phases ("feature", "specification") |

### From OPUS-A4 (Git Diff Impact) -- 8 new

| New Finding ID | Severity | Description |
|---|---|---|
| OPUS-A4-001 through 005 | CRITICAL (5x) | Stale dist/ artifacts for deleted sources (5 modules) |
| OPUS-A4-006 | HIGH | test-scripts-modules.js imports renderer helpers from wrong module (content-filter) |
| OPUS-A4-007 | HIGH | renderer barrel removed exports that template-renderer.ts still exports |
| OPUS-A4-008 | HIGH | heal-session-ambiguity.sh rendered non-functional (unconditional exit) |
| OPUS-A4-009 | HIGH | heal-telemetry-drift.sh rendered non-functional (unconditional exit) |
| OPUS-A4-011 | MEDIUM | ARCHITECTURE.md references deleted .js artifacts for check-architecture-boundaries |
| OPUS-A4-013 | MEDIUM | dist/core/tree-thinning may be stale (FileEntry -> ThinFileInput rename) |
| OPUS-A4-014 | MEDIUM | dist/core/index barrel still exports removed symbols |

### From OPUS-A5 (Duplicate Code & Tech Debt) -- 5 new

| New Finding ID | Severity | Description |
|---|---|---|
| OPUS-A5-005 | MEDIUM | extractors/session-activity-signal.ts shim entirely redundant |
| OPUS-A5-006 | LOW | memory/validate-memory-quality.ts has dual role (shim + CLI entry) |
| OPUS-A5-007 | MEDIUM | slugify defined in 2 files with different signatures |
| OPUS-A5-010 | LOW | generateSessionId near-duplicate in 2 files (different entropy) |
| OPUS-A5-011 | MEDIUM | content-filter vs contamination-filter boundary unclear to newcomers |

---

## Cross-Agent Duplicate Analysis

### Duplicates within the 135 prior findings

| Issue | Agents Reporting | Primary |
|---|---|---|
| Dual quality scorer | CODEX1-002, OPUS5-009 | CODEX1-002 |
| heal-ledger-mismatch.sh refs deleted script | CODEX5-001, OPUS3-009, OPUS4-006 | OPUS3-009 |
| READMEs reference deleted files | OPUS3-010/011, OPUS4-012/013 | OPUS4-012 |
| Orphaned build artifacts | OPUS3-012/013, OPUS4-014/015 | OPUS4-014 |
| Status field missing in description.json | OPUS1-009..012, OPUS2-011 | OPUS1-009 |
| Phase denominator stale | OPUS1-002..008, OPUS2-009 | OPUS1-002 |
| Parent references non-existent phases | OPUS1-015, OPUS2-003, OPUS2-004 | OPUS2-003 |
| Pipeline type assertions / casts | CODEX1-007, OPUS5-005 | CODEX1-007 |

### Duplicates within the 120 Wave 1+2 findings

| Issue | Agents Reporting | Primary |
|---|---|---|
| Dual quality scorer | CODEX-A1-006, CODEX-A2-008, OPUS-A5-002 | OPUS-A5-002 (most specific) |
| FileEntry naming collision | CODEX-A3-002, OPUS-A5-012 (CollectedDataBase) | CODEX-A3-002 |
| ast-parser imports deleted chunker | OPUS-A2-001, (prior CODEX3-001) | OPUS-A2-001 |
| 000 branch stale metadata | OPUS-A2-008, OPUS-A2-011, OPUS-A3-003 | OPUS-A3-003 |
| Status field missing | OPUS-A2-010, OPUS-A3-001 | OPUS-A3-001 (more detailed) |
| Phase denominator drift | OPUS-A2-002..005, OPUS-A3-002 | OPUS-A3-002 (tabular, comprehensive) |
| utils/ re-export shims | OPUS-A1-005/006, OPUS-A5-003/004/005 | OPUS-A5-003/004/005 (includes migration plan) |
| stale dist artifacts | OPUS-A4-001..005, OPUS-A4-013/014 | OPUS-A4-001 (primary) |
| ops scripts non-functional | OPUS-A4-008, OPUS-A4-009, OPUS-A4-010 | OPUS-A4-010 (most impactful) |
| test-scripts-modules.js stale assertions | CODEX-A4-001..005 (new specific exports), prior OPUS4-001..005 (generic) | CODEX-A4-001 |
| Barrel narrowing impact | OPUS-A4-006/007, OPUS-A4-016/017/018 | OPUS-A4-006 |
| cli-capture-shared not wired | OPUS-A5-001 + CODEX2-006 (prior) | OPUS-A5-001 |
| Workflow lock insufficient | CODEX-A1-005, CODEX-A5-003/004 | CODEX-A1-005 (core lock), CODEX-A5-003/004 (handler lock) |

### Duplicates across prior and Wave 1+2 findings

| Issue | Prior ID(s) | Wave 1+2 ID(s) | Status |
|---|---|---|---|
| Dual quality scorer | CODEX1-002, OPUS5-009 | CODEX-A1-006, CODEX-A2-008, OPUS-A5-002 | PERSISTS, 5 agents total |
| God-function runWorkflow() | CODEX1-004 | OPUS-A1-007 | PERSISTS, 2 agents |
| CLI capture duplication | CODEX2-006 | OPUS-A5-001 | PERSISTS, escalated to CRITICAL |
| Session targeting asymmetry | CODEX2-001 | CODEX-A2-004, CODEX-A2-005 | PERSISTS, more specific |
| heal-ledger-mismatch deleted script | CODEX5-001, OPUS3-009, OPUS4-006 | OPUS-A4-010 | PERSISTS, 4 agents total |
| ast-parser stale import | CODEX3-001 | OPUS-A2-001 | PERSISTS, 2 agents |
| Phase denominators stale | OPUS1-002..008 | OPUS-A2-002..005, OPUS-A3-002 | PERSISTS, 3 agents |
| Status field missing | OPUS1-009..012, OPUS2-011 | OPUS-A2-010, OPUS-A3-001 | PERSISTS, 4 agents |
| utils/ imports from lib/ | OPUS3-001, OPUS3-002 | OPUS-A1-005, OPUS-A1-006, OPUS-A5-003, OPUS-A5-004 | PERSISTS, 4 agents |
| Orphaned source-tree artifacts | OPUS3-012/013, OPUS4-014/015 | OPUS-A4 (Category 1 confirms deletions) | FIXED in current diff |
| READMEs reference deleted files | OPUS3-010/011, OPUS4-012/013 | OPUS-A4-015 | PERSISTS (partially fixed) |
| Parent spec missing 019 row | OPUS1-020, OPUS2-001 | OPUS-A2-009, OPUS-A3-004 | PERSISTS, 4 agents |
| extractors/ -> spec-folder/ circular | OPUS3-005 | OPUS-A1 (note 4: NOT found) | FIXED (cycle broken) |
| Type naming collisions | OPUS5-002/003/004 | CODEX-A3-001/002/003/004 | PERSISTS, broader scope in Wave 1+2 |
| Contamination filter changes | OPUS4-016/017 | CODEX-A2-006, CODEX-A2-007 | PERSISTS, deeper analysis |
| test-scripts-modules.js breakage | OPUS4-001..005 | CODEX-A4-001..005 | SUPERSEDED (more granular) |

---

## Consolidated Statistics

### Prior Findings Disposition (135 total)

| Status | Count | Percentage |
|---|---|---|
| PERSISTS | 109 | 80.7% |
| FIXED | 7 | 5.2% |
| SUPERSEDED | 12 | 8.9% |
| DUPLICATE (within prior set) | 7 | 5.2% |

Note: Some findings have multiple tags. DUPLICATE is counted for the secondary report of the same issue (primary retains its PERSISTS status). The 135 total counts each finding ID once.

### Fixed Items Summary

| Finding | What Fixed It |
|---|---|
| CODEX1-005 | Stale .d.ts.map deleted in current diff |
| OPUS3-005 | extractors/ <-> spec-folder/ circular broken |
| OPUS3-010/011 | READMEs being updated (partially) |
| OPUS3-012/013 | Orphaned .js/.js.map artifacts deleted from source tree |
| OPUS4-014/015 | Orphaned .d.ts.map artifacts deleted from source tree |
| CODEX4-002 | historical-memory-remediation.ts deleted entirely |
| CODEX5-002/003/004 | Untested eval scripts deleted (scripts themselves removed) |

### Wave 1+2 New Findings (not in prior audit)

| Severity | Count |
|---|---|
| CRITICAL | 5 (all stale dist/ artifacts) |
| HIGH | 22 |
| MEDIUM | 19 |
| LOW | 7 |
| **Total CONFIRMED_NEW** | **53** |

### Highest-Priority New Findings (not previously known)

1. **CODEX-A5-003/004 (HIGH)**: Race condition in MCP handler's atomicSaveMemory + plain writeFile post-commit -- data loss risk
2. **CODEX-A5-002 (HIGH)**: V-rule bridge fail-open bypasses all validation on load failure
3. **CODEX-A1-005 (HIGH)**: Workflow lock only serializes in-process; cross-CLI races on description.json
4. **CODEX-A1-001 (HIGH)**: Tree-thinning decides on 500-char excerpt, not real file size
5. **CODEX-A1-002 (HIGH)**: Sufficiency gate told every file is spec-relevant
6. **CODEX-A2-001 (HIGH)**: JSON-primary sessionSummary/keyDecisions dropped by normalizer
7. **CODEX-A2-002 (HIGH)**: Structured toolCalls/exchanges ignored downstream
8. **OPUS-A1-001/002/003 (HIGH)**: Three CONFIG-through-core-barrel circular dependencies
9. **OPUS-A4-001..005 (CRITICAL)**: Stale dist/ artifacts for 5 deleted source modules
10. **OPUS-A4-008/009 (HIGH)**: Two ops scripts rendered completely non-functional
